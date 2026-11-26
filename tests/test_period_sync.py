"""Period contract, matching evidence, provenance and manual-posting guidance."""
import re

import pytest
from fastapi.testclient import TestClient

from poc import app as app_module
from poc.agents import case_for_period
from poc.history import PERIODS, VARIANCES
from poc.questions import request_for_demo
from poc.recon_report import apply_condition, build_report
from poc.sap_guidance import PROVENANCE, TREATMENT, guide


@pytest.fixture()
def store():
    return app_module.store


@pytest.fixture()
def client():
    return TestClient(app_module.app)


def test_every_period_matching_rows_explain_the_summary_variance(store):
    for period in PERIODS:
        report = build_report(store, period)
        totals = report["matching"]["totals"]
        assert totals["reconciles"] is True, period
        assert totals["difference_total"] == report["summary"]["variance"] == sum(r["difference"] for r in report["matching"]["rows"]), period
        assert totals["matched_count"] + totals["exception_count"] == len(report["matching"]["rows"])
        assert all(r["difference"] == 0 for r in report["matching"]["rows"] if r["status"] == "MATCHED")
        assert report["summary"]["s4_total"] - report["summary"]["cfin_total"] == report["summary"]["variance"]


def test_february_and_november_are_distinct_and_independent(store):
    feb, nov = build_report(store, "2026-02"), build_report(store, "2026-11")
    assert feb["period"] == "2026-02" and nov["period"] == "2026-11"
    assert feb["summary"]["variance"] == VARIANCES[PERIODS.index("2026-02")] == 0
    assert nov["summary"]["variance"] == 25000
    assert feb["summary"]["s4_total"] != nov["summary"]["s4_total"]
    assert {r["matching_key"] for r in feb["matching"]["rows"]}.isdisjoint({r["matching_key"] for r in nov["matching"]["rows"]})
    assert all(not r["source_ref"].startswith("SYN-202611") for r in feb["matching"]["rows"])
    assert feb["fiscal"] == {"year": 2026, "period": 2, "note": feb["fiscal"]["note"]} and nov["period_label"] == "November 2026"


def test_matching_statuses_use_the_defined_vocabulary(store):
    allowed = {"MATCHED", "UNMATCHED_SOURCE", "UNMATCHED_TARGET", "AMOUNT_MISMATCH", "TIMING_DIFFERENCE", "DUPLICATE", "REQUIRES_REVIEW"}
    seen = set()
    for period in PERIODS:
        for row in build_report(store, period)["matching"]["rows"]:
            seen.add(row["status"])
            assert row["status"] in allowed and row["currency"] == "USD" and row["matching_key"] and row["rule"]
    assert "MATCHED" in seen and len(seen) > 2


def test_condition_changes_only_the_selected_period_and_stays_reconciled(store):
    before_nov = build_report(store, "2026-11")["summary"]["variance"]
    try:
        apply_condition(store, "2026-02", "late_posting")
        feb = build_report(store, "2026-02")
        assert feb["summary"]["variance"] != 0 and feb["matching"]["totals"]["reconciles"]
        assert build_report(store, "2026-11")["summary"]["variance"] == before_nov
    finally:
        apply_condition(store, "2026-02", "baseline")
    assert build_report(store, "2026-02")["summary"]["variance"] == 0


def test_unavailable_period_is_explicit_not_substituted(store, client):
    assert client.get("/api/reports/2027-01").status_code >= 400
    plan = client.post("/api/agent/plan", json={"message": "Reconcile December 2026 company code 1000 ledger 0L USD", "scenario": "S1", "demo_pace_ms": 0}).json()
    assert plan["status"] == "blocked" and "NO DATA AVAILABLE FOR DECEMBER 2026" in plan["answer"] and plan["effective_period"] is None
    parsed, _, follow_up = request_for_demo("Reconcile Dec 2027 company code 1000 ledger 0L USD")
    assert parsed is None and follow_up.startswith("NO DATA AVAILABLE FOR")
    response = client.post("/api/agent/plan", json={"message": "Reconcile the period", "scenario": "S1", "period": "2027-01"})
    assert response.status_code >= 400 and "NO DATA AVAILABLE" in response.text


def test_agent_plan_uses_selector_and_explicit_request_wins(client):
    selected = client.post("/api/agent/plan", json={"message": "Reconcile company code 1000 ledger 0L USD", "scenario": "S1", "period": "2026-02", "demo_pace_ms": 0}).json()
    assert selected["effective_period"] == "2026-02" and selected["period_source"] == "selector" and selected["selected_period"] == "2026-02"
    assert "2026-02" in selected["answer"]
    explicit = client.post("/api/agent/plan", json={"message": "Reconcile November 2026 company code 1000 ledger 0L USD", "scenario": "S1", "period": "2026-02", "demo_pace_ms": 0}).json()
    assert explicit["effective_period"] == "2026-11" and explicit["period_source"] == "request" and explicit["selected_period"] == "2026-02"


def test_agent_never_falls_back_to_november_without_a_period(client):
    plan = client.post("/api/agent/plan", json={"message": "Check close readiness", "scenario": "S1"}).json()
    assert plan.get("effective_period") != "2026-11" or plan["period_source"] != "selector"
    assert "2026-11" not in (plan.get("answer") or "") or plan["status"] != "done"


def test_stored_case_for_another_period_is_not_reused(store):
    case = next((c for c in store.cases() if (c.get("scope") or {}).get("period")), None)
    if case:
        other = next(p for p in PERIODS if p != case["scope"]["period"])
        assert case_for_period(store, case["case_id"], other) is None
        assert case_for_period(store, case["case_id"], case["scope"]["period"]) is not None


def test_provenance_and_sign_convention_are_explicit(store):
    report = build_report(store, "2026-02")
    assert report["provenance"] == PROVENANCE == {"data_source": "SYNTHETIC / DEMONSTRATION", "sap_access": "NOT CONNECTED / NOT VERIFIED", "execution_mode": "READ-ONLY PROPOSED WORKFLOW"}
    assert "positive" in report["sign_convention"].lower() and "S/4HANA balance minus Central Finance balance" in report["sign_convention"]


def test_posting_guidance_is_manual_and_invents_nothing(store):
    g = guide()
    ids = " ".join(a["id"] for a in g["apps"])
    assert "F0718" in ids and "F0717" in ids and "F2547A" in ids
    text = " ".join(str(v) for v in (g["steps"], g["not_done"], g["fields"], g["verification"]))
    assert "did not post anything" in text and "NOT_VERIFIED" in text
    assert not re.search(r"\b\d{10}\b", text), "no document number may appear"
    # every reconciling category has a route, and most do not call for a G/L journal entry
    report = build_report(store, "2026-11")
    assert all(i["treatment"]["manual_journal_entry"] in ("no", "conditional", "after_investigation") for i in report["items"])
    assert sum(1 for v in TREATMENT.values() if v[0] == "no") >= 3


def test_no_agent_tool_can_post_to_sap():
    from poc.agents import TOOLS
    assert not any(re.search(r"post|journal|sap\.write|execute", name) for name in TOOLS if name != "draft_proposal")


def test_reconciliation_plan_carries_its_output_inline(client):
    """The Ask page shows the reconciliation output like the other agent apps: the figures, items, accounts and controls come with the plan."""
    plan = client.post("/api/agent/plan", json={"message": "Reconcile November 2026 company code 1000 ledger 0L USD", "scenario": "S1", "demo_pace_ms": 0}).json()
    assert plan["status"] == "done" and plan["domain"] == "reconciliation"
    blocks = plan["result_blocks"]
    assert [b["type"] for b in blocks] == ["kpis", "table", "table", "table", "note"]
    kpis = {i["label"]: i["value"] for i in blocks[0]["items"]}
    assert kpis["S/4HANA total"].endswith("USD") and "Variance" in kpis
    assert blocks[1]["title"] == "Reconciling items" and blocks[1]["rows"]


def test_investigate_and_route_plans_carry_their_output_inline(client):
    """Investigate and Explain-route-controls show their result on the Ask page too, not only a summary and a link."""
    first = client.post("/api/agent/plan", json={"message": "Reconcile November 2026 company code 1000 ledger 0L USD", "scenario": "S1", "demo_pace_ms": 0}).json()
    inv = client.post("/api/agent/plan", json={"message": "Investigate this variance", "scenario": "S1", "case_id": first["case_id"], "demo_pace_ms": 0}).json()
    assert inv["status"] == "done" and inv["intent"] == "investigate"
    assert inv["result_blocks"][0]["type"] == "kpis" and {i["label"] for i in inv["result_blocks"][0]["items"]} >= {"Status", "Diagnosis"}
    route = client.post("/api/agent/plan", json={"message": "Explain the route controls", "scenario": "S1", "demo_pace_ms": 0}).json()
    assert route["status"] == "done" and route["intent"] == "explain_route"
    types = [b["type"] for b in route["result_blocks"]]
    assert types[0] == "kpis" and "table" in types and "list" in types
