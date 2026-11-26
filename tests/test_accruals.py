"""SAP Accrual Posting Agent: calculations of every accrual type, the LLM and Rules executions, the controls, and the workflow
review -> approval -> simulated posting -> reconciliation. Synthetic data; the LLM is simulated; posting is a local synthetic ledger."""
import pytest

from poc import accrual_data as A
from poc import accrual_engine as E
from poc import app as app_module
from poc import cockpit
from poc.store import Denied

PERIOD = "2026-11"
AP = {"approver_id": "finance.approver"}
MK = {"approver_id": "finance.maker"}


@pytest.fixture()
def ctx():
    context = app_module.agent_context()
    for cc in A.COMPANY_CODES:
        for period in ("2026-11", "2026-10", "2026-04", "2026-05"):
            cockpit.action(context.store, "accruals", "reset", {"period": period, "company_code": cc})
    yield context
    for cc in A.COMPANY_CODES:
        for period in ("2026-11", "2026-10", "2026-04", "2026-05"):
            cockpit.action(context.store, "accruals", "reset", {"period": period, "company_code": cc})


def prepare(ctx, cc="1000", period="2026-11", options=None, scenario="S1", message=None):
    return cockpit.run(ctx, message or f"Prepare accruals for company code {cc} for {period}", scenario, None, period, options or {})


def run_of(ctx, cc, period=PERIOD):
    return (ctx.store.get_state("accrual_runs") or {})[f"{period}|{cc}"]


def line(run, key):
    return next(l for l in run["lines"] if l["key"] == key)


def accept_all(ctx, cc, period=PERIOD):
    base = {"period": period, "company_code": cc}
    for l in run_of(ctx, cc, period)["lines"]:
        if l["status"] != "blocked":
            cockpit.action(ctx.store, "accruals", "decide_line", {**base, **AP, "line_id": l["line_id"], "decision": "accept"})
    return base


def approve_and_post(ctx, cc, period=PERIOD):
    prepare(ctx, cc, period)
    base = accept_all(ctx, cc, period)
    cockpit.action(ctx.store, "accruals", "approve_journal", {**base, **AP, "payload_hash": E.journal_hash(run_of(ctx, cc, period))})
    return base, cockpit.action(ctx.store, "accruals", "post_journal", {**base, **AP})


# ---- the agent and its options -----------------------------------------------------------------------------------------
def test_routes_to_the_accrual_agent_and_default_execution_is_llm(ctx):
    assert cockpit.route("Prepare accruals for November 2026") == "accruals"
    assert cockpit.route("Reconcile the posted accrual entries for November 2026") == "accruals"  # accrual wins over the reconciliation words
    plan = prepare(ctx)
    assert plan["domain"] == "accruals" and plan["status"] == "done" and plan["execution"] == "llm" and plan["llm"]["simulated"] is True
    assert "execution LLM" in plan["answer"] and "simulated" in plan["answer"]
    module = cockpit.get("accruals")
    options = {o["id"]: o for o in module.options}
    assert options["execution"]["default"] == "llm" and options["execution"]["choices"][0]["label"] == "LLM"
    assert options["types"]["default"] == "all" and len(options["types"]["choices"]) == 6 and set(options["company_code"]["default"]) == set("1000")


def test_the_agent_has_no_posting_or_approval_tool():
    cat = cockpit.get("accruals").catalog()
    names = {t["name"] for t in cat["tools"]}
    assert not [n for n in names if any(w in n for w in ("post", "approve", "release", "write", "reverse"))]
    assert {"post_accrual_journal", "approve_journal"} <= set(cat["not_tools"])
    assert all(t["rw"] in ("read", "local-draft", "none") for t in cat["tools"])


def test_posting_and_approval_requests_are_refused(ctx):
    posted = prepare(ctx, message="Post the accrual journal for November 2026")
    assert posted["status"] == "blocked" and "not an agent action" in posted["answer"] and not posted["steps"]
    approved = prepare(ctx, message="Approve the accrual journal for November 2026")
    assert approved["status"] == "blocked" and "approver" in approved["answer"]
    assert not (ctx.store.get_state("accrual_ledger") or [])


# ---- every accrual type, calculated by deterministic code --------------------------------------------------------------
def test_all_five_types_exist_for_every_company_code_and_period():
    for cc in A.COMPANY_CODES:
        for period in A.PERIODS:
            kinds = {i["type"] for i in A.items(period, cc)}
            assert kinds == set(A.TYPES), (cc, period)


def test_formula_amounts_match_an_independent_calculation(ctx):
    plan = prepare(ctx, "1000")
    run = run_of(ctx, "1000")
    items = {i["key"]: i for i in A.items(PERIOD, "1000")}
    po1, po2, ses2, gr2, con1 = items["PO-1"], items["PO-2"], items["SES-2"], items["GRIR-2"], items["CON-1"]
    assert line(run, "PO-1")["amount"] == round((po1["scheduled_due"] - po1["invoiced"]) * po1["unit"]) and line(run, "PO-1")["clause"] == "H2"      # no receipt: planned cost
    assert line(run, "PO-2")["amount"] == round((po2["received"] - po2["invoiced"]) * po2["unit"]) and line(run, "PO-2")["clause"] == "H1"          # receipt: delivered not invoiced
    assert line(run, "SES-2")["amount"] == ses2["accepted"] - ses2["invoiced"] and line(run, "SES-2")["clause"] == "H3"
    assert line(run, "GRIR-2")["amount"] == gr2["gr_value"] - gr2["ir_value"] and line(run, "GRIR-2")["clause"] == "H1"
    assert line(run, "CON-1")["amount"] == con1["monthly"] * con1["months"] and line(run, "CON-1")["clause"] == "H4"
    assert plan["status"] == "done"


def test_estimates_have_a_range_evidence_and_a_flag_when_weak(ctx):
    prepare(ctx, "1000")
    run = run_of(ctx, "1000")
    est1, est2 = line(run, "EST-1"), line(run, "EST-2")
    avg = round(sum(A.history(PERIOD, "1000")) / 3)
    assert est1["amount"] == round(avg * A.SEASON[11]) and est1["estimate"]["low"] < est1["amount"] < est1["estimate"]["high"] and est1["clause"] == "H5"
    assert est2["evidence"] and est2["estimate"] and "hours" in est2["basis"]
    prepare(ctx, "2000")
    unrec = line(run_of(ctx, "2000"), "UNREC")  # a liability only an e-mail mentions
    assert unrec["amount"] > 0 and any("No purchase order" in f for f in unrec["flags"]) and unrec["confidence"] < 0.75 and any("Low confidence" in f for f in unrec["flags"])


# ---- LLM versus Rules --------------------------------------------------------------------------------------------------
def test_llm_and_rules_give_the_same_amount_for_every_formula_line(ctx):
    prepare(ctx, "1000", options={"execution": "llm"})
    llm = {l["key"]: l["amount"] for l in run_of(ctx, "1000")["lines"]}
    cockpit.action(ctx.store, "accruals", "reset", {"period": PERIOD, "company_code": "1000"})
    prepare(ctx, "1000", options={"execution": "rules"})
    rules = run_of(ctx, "1000")
    for l in rules["lines"]:
        assert l["amount"] == llm[l["key"]], l["key"]
    assert {e["key"] for e in rules["excluded"]} == {"EST-1", "EST-2"} and "H5" in rules["excluded"][0]["excluded"]
    assert rules["execution"] == "rules" and rules["llm"] is None and rules["documents"] == []


def test_rules_execution_skips_documents_and_estimates_and_cannot_find_the_email_liability(ctx):
    plan = prepare(ctx, "2000", options={"execution": "rules"})
    skipped = {s["tool"] for s in plan["steps"] if s["status"] == "skipped"}
    assert skipped == {"read_source_documents", "estimate_accrual"}
    assert "UNREC" not in {l["key"] for l in run_of(ctx, "2000")["lines"]}
    cockpit.action(ctx.store, "accruals", "reset", {"period": PERIOD, "company_code": "2000"})
    prepare(ctx, "2000", options={"execution": "llm"})
    assert "UNREC" in {l["key"] for l in run_of(ctx, "2000")["lines"]}


def test_prompt_injection_in_a_document_is_flagged_ignored_and_never_changes_an_amount(ctx):
    plan = prepare(ctx, "1000")
    run = run_of(ctx, "1000")
    assert run["injections"] == ["D-EL"] and "ignored" in plan["answer"]
    doc = next(d for d in A.documents(PERIOD, "1000") if d["doc_id"] == "D-EL")
    facts = E._facts(doc["text"])
    assert line(run, "EST-2")["amount"] == round(facts["rate"] * facts["hours"])
    assert not (ctx.store.get_state("accrual_ledger") or []), "an instruction in a document must never cause a posting"
    assert all("post this entry" not in str(l) for l in run["lines"])


# ---- policy ------------------------------------------------------------------------------------------------------------
def test_duplicate_is_blocked_and_cannot_be_accepted(ctx):
    prepare(ctx, "1000")
    run = run_of(ctx, "1000")
    dup = line(run, "SES-1")
    assert dup["status"] == "blocked" and any("Duplicate" in f for f in dup["flags"])
    with pytest.raises(Denied, match="blocked"):
        cockpit.action(ctx.store, "accruals", "decide_line", {"period": PERIOD, "company_code": "1000", **AP, "line_id": dup["line_id"], "decision": "accept"})


def test_missing_cost_center_is_suggested_by_the_llm_and_blocked_by_rules(ctx):
    prepare(ctx, "2000", options={"execution": "llm"})
    llm = line(run_of(ctx, "2000"), "PO-2")
    assert llm["status"] == "proposed" and llm["cost_center"] and any("suggested" in f for f in llm["flags"])
    cockpit.action(ctx.store, "accruals", "reset", {"period": PERIOD, "company_code": "2000"})
    prepare(ctx, "2000", options={"execution": "rules"})
    rule = line(run_of(ctx, "2000"), "PO-2")
    assert rule["status"] == "blocked" and any("No cost center" in f for f in rule["flags"])


def test_below_materiality_is_excluded(ctx):
    prepare(ctx, "3000")
    excluded = {e["key"]: e for e in run_of(ctx, "3000")["excluded"]}
    assert "CON-2" in excluded and "materiality" in excluded["CON-2"]["excluded"]


def test_types_option_limits_the_candidates(ctx):
    prepare(ctx, "1000", options={"types": "GRIR"})
    assert {l["type"] for l in run_of(ctx, "1000")["lines"]} == {"GRIR"}


def test_company_code_comes_from_the_request_then_the_option_and_runs_are_independent(ctx):
    prepare(ctx, "3000", options={"company_code": "1000"}, message="Prepare accruals for company code 3000 for November 2026")
    assert run_of(ctx, "3000")["company_code"] == "3000" and run_of(ctx, "3000")["currency"] == "CHF"
    prepare(ctx, "1000", options={"company_code": "2000"}, message="Prepare accruals for November 2026")
    assert run_of(ctx, "2000")["currency"] == "EUR" and f"{PERIOD}|1000" not in (ctx.store.get_state("accrual_runs") or {})


# ---- workflow: review, approval, simulated posting, reconciliation ------------------------------------------------------
def test_only_the_approver_decides_approves_and_posts(ctx):
    prepare(ctx, "1000")
    base = {"period": PERIOD, "company_code": "1000"}
    lid = next(l["line_id"] for l in run_of(ctx, "1000")["lines"] if l["status"] == "proposed")
    for name, extra in (("decide_line", {"line_id": lid, "decision": "accept"}), ("approve_journal", {"payload_hash": "x"}), ("post_journal", {})):
        with pytest.raises(Denied, match="approver"):
            cockpit.action(ctx.store, "accruals", name, {**base, **MK, **extra})


def test_posting_needs_the_approval_and_the_approval_is_bound_to_the_accepted_lines(ctx):
    prepare(ctx, "1000")
    base = accept_all(ctx, "1000")
    with pytest.raises(Denied, match="approved before"):
        cockpit.action(ctx.store, "accruals", "post_journal", {**base, **AP})
    with pytest.raises(Denied, match="changed"):
        cockpit.action(ctx.store, "accruals", "approve_journal", {**base, **AP, "payload_hash": "0" * 64})
    cockpit.action(ctx.store, "accruals", "approve_journal", {**base, **AP, "payload_hash": E.journal_hash(run_of(ctx, "1000"))})
    victim = next(l for l in run_of(ctx, "1000")["lines"] if l["status"] == "accepted")
    cockpit.action(ctx.store, "accruals", "decide_line", {**base, **AP, "line_id": victim["line_id"], "decision": "reject"})
    assert run_of(ctx, "1000")["approval"] is None and run_of(ctx, "1000")["status"] == "accepted"  # changing the lines withdraws the approval
    with pytest.raises(Denied, match="approved before"):
        cockpit.action(ctx.store, "accruals", "post_journal", {**base, **AP})


def test_closed_posting_period_blocks_approval_and_posting(ctx):
    prepare(ctx, "3000", period="2026-10")
    assert run_of(ctx, "3000", "2026-10")["period_open"] is False
    base = accept_all(ctx, "3000", "2026-10")
    with pytest.raises(Denied, match="closed"):
        cockpit.action(ctx.store, "accruals", "approve_journal", {**base, **AP, "payload_hash": E.journal_hash(run_of(ctx, "3000", "2026-10"))})
    assert not (ctx.store.get_state("accrual_ledger") or [])


def test_simulated_posting_writes_one_balanced_local_document_with_a_reversal_and_is_idempotent(ctx):
    base, posted = approve_and_post(ctx, "1000")
    ledger = ctx.store.get_state("accrual_ledger")
    assert len(ledger) == 1 and posted["doc_no"] == ledger[0]["doc_no"] == "SYN-JE-1000-2026-11-01" and ledger[0]["simulated"] is True
    doc = ledger[0]
    assert doc["debit"] == doc["credit"] == doc["total"] == sum(l["amount"] for l in run_of(ctx, "1000")["lines"] if l["status"] == "accepted")
    assert doc["posting_date"] == "2026-11-30" and doc["reversal"]["date"] == "2026-12-01" and doc["reversal"]["total"] == -doc["total"]
    with pytest.raises(Denied, match="already posted"):
        cockpit.action(ctx.store, "accruals", "post_journal", {**base, **AP})
    assert len(ctx.store.get_state("accrual_ledger")) == 1


def test_reconciliation_after_posting_finds_the_replication_gap_then_reconciles(ctx):
    base, _ = approve_and_post(ctx, "2000")  # for 2000 in November the synthetic Central Finance cut-off leaves the document pending
    first = cockpit.action(ctx.store, "accruals", "reconcile", base)
    assert first["status"] == "OPEN: REPLICATION PENDING" and first["difference"] == first["s4_total"] > 0 and first["pending_documents"]
    assert [c["status"] for c in first["checks"]].count("DIFFERENCE") == 1 and first["checks"][-1]["status"] == "DIFFERENCE"
    assert all(c["status"] == "OK" for c in first["checks"][:-1])
    cockpit.action(ctx.store, "accruals", "replicate", base)
    second = cockpit.action(ctx.store, "accruals", "reconcile", base)
    assert second["status"] == "RECONCILED" and second["difference"] == 0 and run_of(ctx, "2000")["status"] == "reconciled"
    with pytest.raises(Denied, match="Nothing is waiting"):
        cockpit.action(ctx.store, "accruals", "replicate", base)


def test_the_agent_reconciles_the_posted_entries_through_s4hana_and_central_finance(ctx):
    approve_and_post(ctx, "1000")
    plan = cockpit.run(ctx, "Reconcile the posted accrual entries for company code 1000 for November 2026", "S3", None, PERIOD, {})
    assert plan["status"] == "done" and plan["steps"][0]["tool"] == "reconcile_ledger_entries"
    targets = {h["to"] for h in plan["steps"][0]["trace"]["hops"]}
    assert {"s4_live_gl", "cfin_accounting"} <= targets and {s["system"] for s in plan["systems_of_record"]} == {"S/4HANA (SYNG Core)", "Central Finance (S/4HANA)"}
    nothing = cockpit.run(ctx, "Reconcile the posted accrual entries for company code 3000 for November 2026", "S1", None, PERIOD, {})
    assert nothing["status"] == "blocked" and "Prepare, approve and post first" in nothing["answer"]


def test_a_rerun_after_posting_keeps_the_posted_journal(ctx):
    approve_and_post(ctx, "1000")
    plan = prepare(ctx, "1000")
    assert "was kept" in plan["steps"][-1]["summary"] and run_of(ctx, "1000")["status"] == "posted"
    dup = [l for l in plan["result_blocks"][1]["rows"] if l["status"] == "blocked"] if len(plan["result_blocks"]) > 1 else []
    assert len(dup) >= 5  # every posted reference is now a duplicate


def test_view_shows_the_workflow_actions_and_disables_what_is_not_yet_allowed(ctx):
    prepare(ctx, "1000")
    cockpit.action(ctx.store, "accruals", "select", {"company_code": "1000"})
    blocks = cockpit.view(ctx.store, "accruals", PERIOD)["ui"]["blocks"]
    assert [b["type"] for b in blocks][:2] == ["note", "actions"] and "SIMULATED POSTING" in blocks[0]["text"]
    actions = [b for b in blocks if b["type"] == "actions"][-1]["items"]
    by = {i["action"]: i for i in actions}
    assert by["approve_journal"]["disabled"] and by["post_journal"]["disabled"] and by["reconcile"]["disabled"] and by["approve_journal"]["role"] == "approver"
    table = next(b for b in blocks if b["type"] == "table" and b["title"].startswith("Proposal lines"))
    assert next(c for c in table["columns"] if c["key"] == "decision")["format"] == "actions" and all(isinstance(r["decision"], list) for r in table["rows"])
    base, _ = approve_and_post(ctx, "1000")
    after = cockpit.view(ctx.store, "accruals", PERIOD)["ui"]["blocks"]
    assert any(b["type"] == "table" and b["title"].startswith("Posted documents") for b in after)


def test_the_view_has_no_data_outside_the_history(ctx):
    with pytest.raises(Exception, match="NO DATA AVAILABLE"):
        cockpit.view(ctx.store, "accruals", "2027-01")
    gone = prepare(ctx, message="Prepare accruals for December 2026", period=PERIOD)
    assert gone["status"] == "blocked" and "NO DATA AVAILABLE" in gone["answer"]
