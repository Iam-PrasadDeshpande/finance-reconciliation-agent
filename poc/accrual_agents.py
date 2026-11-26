"""SAP Accrual Posting Agent (custom, imitating SAP's standard Accounting Accruals Agent) on synthetic data, at company-code level.

Workflow: prepare (agent) -> review -> approve -> post (simulated, local synthetic ledger) -> reconcile the posted entries -> replicate.
The agent has NO posting tool. Posting is a human-triggered action that writes one document to a LOCAL SYNTHETIC LEDGER; no SAP system
is changed. Execution 'llm' (default, labelled LLM) uses the SIMULATED model of poc/accrual_engine.py; 'rules' uses coded rules only.
"""
from __future__ import annotations

import re
import time
import uuid
from datetime import datetime, timezone

from . import accrual_data as A
from . import accrual_engine as E
from .agents import _finish, _max_seq, _trace
from .questions import mentioned_period
from .sap_guidance import PROVENANCE
from .store import Denied
from .treasury_agents import _read_chain

LABEL = "Accrual posting agent · custom imitation of SAP's standard agent · synthetic · SIMULATED LLM (no model called) · posting is a simulated local entry, no SAP system is changed"
APPROVER = "finance.approver"
READ_OPS = ("read_open_items", "read_accrual_candidates")
TYPE_IDS = list(A.TYPES)

REFS = {
    "AC1": {"title": "SAP Help: Accounting Accruals Agent Overview", "url": "https://help.sap.com/docs/SAP_S4HANA_CLOUD/0fa84c9d9c634132b7c4abb9ffdd8f06/db6ed77578d84b42aed62ae3b1324c07.html",
            "supports": "The agent automates accrual preparation from reading the policies to calculating amounts and drafting journal entries; it needs Joule on S/4HANA Cloud Public Edition.", "status": "SEARCH RESULT 2026-11-26; page not read"},
    "AC2": {"title": "SAP Community: Automating Month-End Accruals with the SAP Accounting Accruals Agent", "url": "https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/automating-month-end-accruals-with-the-sap-accounting-accruals-agent/ba-p/14476174",
            "supports": "A plain-language policy handbook drives the agent; proposals explain the rule applied; users accept, adjust or reject each proposal; duplicates are checked.", "status": "SEARCH RESULT 2026-11-26; page not read"},
    "AC3": {"title": "SAP: Accounting Accruals Agent (product page)", "url": "https://www.sap.com/products/erp/accounting-accruals-agent.html",
            "supports": "Automates journal entry preparation for manual accruals; can be orchestrated with other finance agents.", "status": "SEARCH RESULT 2026-11-26; availability reports conflict"},
    "AC4": {"title": "SAP Learning: Accruals Management, manual accruals", "url": "https://learning.sap.com/courses/configuring-the-financial-closing-in-sap-s-4hana/accruals-management-manual-accruals",
            "supports": "Manual accruals are contract-like data that the accrual engine posts periodically; reversal on the first day of the next period.", "status": "SEARCH RESULT 2026-11-26; page not read"},
    "AC5": {"title": "SAP Learning: Accruals Management, purchase order accruals", "url": "https://learning.sap.com/courses/configuring-the-financial-closing-in-sap-s-4hana/accruals-management-purchase-order-accruals",
            "supports": "An accrual object per purchase order with item sub-objects; planned cost from the delivery schedule, actual cost from goods receipts.", "status": "SEARCH RESULT 2026-11-26; page not read"},
    "AC6": {"title": "SAP Learning: Using service entry sheet accruals", "url": "https://learning.sap.com/courses/accruals-management/using-service-entry-sheet-accruals_e50399b2-6a5e-474d-9a11-a2492e70f8c6",
            "supports": "Service entry sheet accruals use the sheet's account assignment and the goods receipt posting date.", "status": "SEARCH RESULT 2026-11-26; page not read"},
    "AC7": {"title": "SAP Community: GR/IR regrouping through F.19", "url": "https://blogs.sap.com/2021/12/30/gr-ir-gr-ir-regrouping-through-t.code-f.19/",
            "supports": "GR/IR adjustment postings at period end with an automatic reversal on the first working day of the next period.", "status": "SEARCH RESULT 2026-11-26; page not read"},
    "AC8": {"title": "BDO: Reviewing AI in finance processes", "url": "https://www.bdo.com/insights/assurance/reviewing-ai-in-finance-processes-practical-audit-considerations-for-controllers",
            "supports": "AI that prepares journal entries needs preparer-reviewer separation and a substantive review.", "status": "SEARCH RESULT 2026-11-26; page not read"},
}
TOOL_REFS = {"get_accrual_candidates": ["AC4", "AC5", "AC6", "AC7"], "get_prior_accruals": ["AC2"], "read_source_documents": ["AC2"], "interpret_policy": ["AC2", "AC3"], "calculate_accrual": ["AC4", "AC5", "AC6", "AC7"],
             "estimate_accrual": ["AC2"], "check_accrual_policy": ["AC2", "AC8"], "draft_accrual_journal": ["AC1", "AC2"], "reconcile_ledger_entries": ["AC4", "AC7"]}

S4 = "S/4HANA (SYNG Core)"
CFIN = "Central Finance (S/4HANA)"
SYSTEMS_OF_RECORD = {
    "get_accrual_candidates": [(S4, "purchase orders, goods receipts, service entry sheets and contracts of the company code")],
    "get_prior_accruals": [(S4, "accrual documents already posted in the period (account 215000)")],
    "read_source_documents": [(S4, "attached source documents (synthetic)")],
    "interpret_policy": [], "calculate_accrual": [], "estimate_accrual": [], "check_accrual_policy": [], "draft_accrual_journal": [],
    "reconcile_ledger_entries": [(S4, "posted accrual documents and account 215000"), (CFIN, "documents replicated from the company code")],
}
RECORDS_NOTE = "Design assumption, not verified against a tenant; the demo data is synthetic. Computed steps use no system of record."
LOCAL = {"interpret_policy", "calculate_accrual", "estimate_accrual", "check_accrual_policy", "draft_accrual_journal"}


def systems_for(tools):
    seen = {}
    for tool in tools:
        for system, scope in SYSTEMS_OF_RECORD.get(tool, []):
            seen.setdefault(system, []).append(scope)
    return [{"system": system, "scope": "; ".join(dict.fromkeys(scopes))} for system, scopes in seen.items()]


PREP_TOOLS = ["get_accrual_candidates", "get_prior_accruals", "read_source_documents", "interpret_policy", "calculate_accrual", "estimate_accrual", "check_accrual_policy", "draft_accrual_journal"]
AGENT_CARDS = [
    {"id": "accrual_orchestrator", "name": "Accrual Orchestration Agent", "role": "Identifies your intent (prepare accruals or reconcile posted entries), refuses posting and approval, and coordinates the specialists. It never touches SAP itself.",
     "mode": "plans only", "view": "plan", "tools": ["plan"], "mcp_server": "tool client (orchestrator)", "layers": [], "kind": "orchestrator",
     "sap": "SAP: the Accounting Accruals Agent can be orchestrated with other finance agents by a financial closing orchestration agent.", "availability": "SAP availability reports conflict (restricted availability to general availability); this agent is a custom imitation."},
    {"id": "accrual_preparer", "name": "Accrual Preparation Agent", "role": "Finds accrual candidates of all types in a company code, reads the policy and source documents, calculates and estimates amounts, checks policy and drafts the journal for a person to review.",
     "mode": "read + local draft", "view": "workflow", "tools": PREP_TOOLS, "mcp_server": "accrual-preparation-mcp", "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"], "kind": "specialist",
     "sap": "SAP: reads the accrual policy, retrieves historical data, calculates amounts, prepares proposed journal entries, checks that the period was not already accrued.", "availability": "SAP availability reports conflict; the SAP agent needs S/4HANA Cloud Public Edition with Joule."},
    {"id": "accrual_reconciler", "name": "Posted Entries Reconciliation Agent", "role": "After a person has approved and posted the journal, ties the posted documents to the approved lines, the accrual account, the reversal and Central Finance.",
     "mode": "read", "view": "workflow", "tools": ["reconcile_ledger_entries"], "mcp_server": "accrual-reconciliation-mcp", "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"], "kind": "specialist",
     "sap": "Custom: SAP posts the entry; this agent checks the result against the ledger and its replication to Central Finance.", "availability": "Custom imitation on synthetic data."},
]
NOT_TOOLS = ["post_accrual_journal", "reverse_journal", "approve_journal", "sap.post", "journal.post", "fixture.mutate"]
TOOLS = {
    "plan": {"agent": "accrual_orchestrator", "rw": "none", "input": {"message": "string"}, "output": "Plan"},
    "get_accrual_candidates": {"agent": "accrual_preparer", "rw": "read", "input": {"period": "YYYY-MM", "company_code": "string", "types": "all|type"}, "output": "accrual candidates of the selected types"},
    "get_prior_accruals": {"agent": "accrual_preparer", "rw": "read", "input": {"period": "YYYY-MM", "company_code": "string"}, "output": "references already accrued in the period"},
    "read_source_documents": {"agent": "accrual_preparer", "rw": "read", "input": {"period": "YYYY-MM", "company_code": "string"}, "output": "source documents and any instruction found in them (LLM execution only)"},
    "interpret_policy": {"agent": "accrual_preparer", "rw": "read", "input": {"execution": "llm|rules"}, "output": "rule set with the handbook clause for each rule"},
    "calculate_accrual": {"agent": "accrual_preparer", "rw": "read", "input": {"candidates": "list"}, "output": "formula amounts per type, with the basis"},
    "estimate_accrual": {"agent": "accrual_preparer", "rw": "read", "input": {"candidates": "list"}, "output": "estimates with range and evidence (LLM execution only)"},
    "check_accrual_policy": {"agent": "accrual_preparer", "rw": "read", "input": {"lines": "list"}, "output": "materiality, duplicate, cost center, account and confidence checks"},
    "draft_accrual_journal": {"agent": "accrual_preparer", "rw": "local-draft", "input": {"lines": "list"}, "output": "proposal lines awaiting a person's review"},
    "reconcile_ledger_entries": {"agent": "accrual_reconciler", "rw": "read", "input": {"period": "YYYY-MM", "company_code": "string"}, "output": "reconciliation checks and status"},
}
CARD = {c["id"]: c for c in AGENT_CARDS}
for _c in AGENT_CARDS:
    _c["systems_of_record"] = systems_for(_c["tools"])
    _c["records_note"] = RECORDS_NOTE if _c["systems_of_record"] else "None. It plans and calls; it never touches SAP itself."

OPTIONS = [
    {"id": "execution", "label": "Execution", "default": "llm", "choices": [{"id": "llm", "label": "LLM"}, {"id": "rules", "label": "Rules"}],
     "help": "LLM (default, simulated) reads the handbook and documents, estimates and explains. Rules runs coded rules only."},
    {"id": "company_code", "label": "Company code", "default": "1000", "choices": [{"id": cc, "label": f"{cc} · {m['name']} ({m['ccy']})"} for cc, m in A.COMPANY_CODES.items()],
     "help": "The agent works at company-code level; one journal per company code."},
    {"id": "types", "label": "Accrual types", "default": "all", "choices": [{"id": "all", "label": "All types"}] + [{"id": k, "label": v} for k, v in A.TYPES.items()],
     "help": "Purchase order, service entry sheet, GR/IR, recurring contract and estimate accruals."},
]
EXAMPLES = ["Prepare accruals for {period}", "Prepare accruals for company code 2000 for {period}", "Which accruals are missing for {period}?", "Reconcile the posted accrual entries for {period}", "Post the accrual journal for {period}"]
POST_WORDS = re.compile(r"\b(post|posting|book|submit|commit)\b")
APPROVE_WORDS = re.compile(r"\b(approve|approval|release|sign off)\b")
RECON_WORDS = re.compile(r"\b(reconcil\w*|tie[- ]?out|posted|replicat\w*|verify|ledger)\b")
PREPARE_WORDS = re.compile(r"\b(prepare|propose|proposal|proposals|draft|which|missing|find|calculate|estimate)\b")


def catalog_domain() -> dict:
    return {"label": LABEL, "name": "Accrual Posting Agent", "agents": AGENT_CARDS, "tools": [{"name": n, **t} for n, t in TOOLS.items()], "not_tools": NOT_TOOLS, "examples": EXAMPLES,
            "references": [{"id": k, **v} for k, v in REFS.items()], "options": OPTIONS,
            "note": "Calls are in-process and MCP-shaped; there is no MCP transport. The LLM is simulated. No tool posts or approves: a person approves and posts to a local synthetic ledger."}


# ---- state -----------------------------------------------------------------------------------------------------------
def _runs(store) -> dict:
    return store.get_state("accrual_runs") or {}


def _ledger(store) -> list:
    return store.get_state("accrual_ledger") or []


def _key(period, cc) -> str:
    return f"{period}|{cc}"


def _save_run(store, run):
    runs = _runs(store)
    runs[_key(run["period"], run["company_code"])] = run
    store.set_state("accrual_runs", runs)


def _audit(run, actor, action, note=""):
    run["audit"].append({"at": datetime.now(timezone.utc).strftime("%H:%M:%S"), "actor": actor, "action": action, "note": note})


def _types(options) -> list:
    value = (options or {}).get("types", "all")
    if value in (None, "", "all"):
        return TYPE_IDS
    chosen = [value] if isinstance(value, str) else list(value)
    return [t for t in chosen if t in A.TYPES] or TYPE_IDS


def _company_code(store, message, options):
    found = re.search(r"\b(1000|2000|3000)\b", message or "")
    cc = found.group(1) if found else (options or {}).get("company_code") or store.get_state("accrual_selected_cc") or "1000"
    return cc if cc in A.COMPANY_CODES else "1000"


def _step(index, agent, tool, purpose, extra=None):
    step = {"step_id": f"s{index}", "agent": agent, "tool": tool, "purpose": purpose, "rw": TOOLS[tool]["rw"], "status": "pending", "summary": "", "view": CARD[agent]["view"],
            "systems_of_record": systems_for([tool])}
    step.update(extra or {})
    return step


def _plan(message, intent, execution):
    text = (message or "").lower().strip()
    steps = []
    llm = execution == "llm"
    if intent == "prepare":
        for i, (tool, purpose) in enumerate([("get_accrual_candidates", "Find accrual candidates of the selected types in the company code"), ("get_prior_accruals", "Check which references are already accrued this period"),
                                              ("read_source_documents", "Read source documents for liabilities the structured data does not hold"), ("interpret_policy", "Work out the rules from the handbook"),
                                              ("calculate_accrual", "Calculate the formula-based amounts"), ("estimate_accrual", "Estimate items that have no formula"),
                                              ("check_accrual_policy", "Check materiality, duplicates, cost center, account and confidence"), ("draft_accrual_journal", "Draft the proposal lines for a person to review")], 1):
            steps.append(_step(i, "accrual_preparer", tool, purpose))
    elif intent == "reconcile":
        steps.append(_step(1, "accrual_reconciler", "reconcile_ledger_entries", "Tie the posted documents to the approved lines, the ledger, the reversal and Central Finance"))
    return {"plan_id": f"plan-{uuid.uuid4().hex[:8]}", "domain": "accruals", "intent": intent, "message": message, "synthetic": True, "label": LABEL, "status": "planned", "case_id": None, "note": "",
            "adaptations": [], "provenance": PROVENANCE, "steps": steps, "execution": execution}


def route_intent(message) -> str:
    text = (message or "").lower()
    if POST_WORDS.search(text) and not PREPARE_WORDS.search(text) and not RECON_WORDS.search(text):
        return "refused_post"
    if APPROVE_WORDS.search(text) and not RECON_WORDS.search(text):
        return "refused_approval"
    if RECON_WORDS.search(text) and not PREPARE_WORDS.search(text):
        return "reconcile"
    return "prepare"


# ---- the agent run ---------------------------------------------------------------------------------------------------
def run_plan(ctx, message, scenario, case_id, period):
    store = ctx.store
    options = getattr(ctx, "options", None) or {}
    execution = options.get("execution") if options.get("execution") in E.EXECUTIONS else "llm"
    plan = _plan(message, route_intent(message), execution)
    plan["selected_period"] = period
    plan["trace_case_id"] = f"accrual-{plan['plan_id']}"
    plan["orchestrator"] = {"role": "tool client (MCP-style, in-process)", "rule": f"intent {plan['intent']}", "dispatches": len(plan["steps"]), "order": [s["tool"] for s in plan["steps"]]}
    mentioned = mentioned_period((message or "").lower())
    plan["period_source"] = "request" if mentioned else ("selector" if period else None)
    plan["effective_period"] = None
    plan["references"] = []
    if plan["intent"] in ("refused_post", "refused_approval"):
        plan["status"] = "blocked"
        plan["blocked_reason"] = ("Posting is not an agent action. The agent drafts the journal; a person approves it and posts it in the workflow panel, and this demo posts only to a local synthetic ledger." if plan["intent"] == "refused_post"
                                  else "Approval is a person's decision. Switch to the finance approver role and approve the journal in the workflow panel.")
        plan["answer"] = plan["blocked_reason"]
        plan["references"] = [REFS["AC2"] | {"id": "AC2"}, REFS["AC8"] | {"id": "AC8"}]
        return plan
    effective = mentioned or period
    if not effective:
        plan["status"], plan["answer"] = "needs_input", "Which month should I use? Choose a period, December 2025 through November 2026."
        plan["steps"], plan["orchestrator"]["dispatches"], plan["orchestrator"]["order"] = [], 0, []
        return plan
    if effective not in A.PERIODS:
        label = effective
        plan["status"], plan["blocked_reason"] = "blocked", f"NO DATA AVAILABLE FOR {label.upper()}. The synthetic accrual data covers December 2025 through November 2026."
        plan["answer"] = f"Stopped: {plan['blocked_reason']} Nothing was changed."
        plan["steps"], plan["orchestrator"]["dispatches"], plan["orchestrator"]["order"] = [], 0, []
        return plan
    cc = _company_code(store, message, options)
    types = _types(options)
    plan["effective_period"], plan["company_code"], plan["types"] = effective, cc, types
    store.set_state("accrual_selected_cc", cc)
    state = {"period": effective, "cc": cc, "types": types, "execution": execution, "scenario": scenario}
    started = time.perf_counter()
    for step in plan["steps"]:
        if execution != "llm" and step["tool"] in ("read_source_documents", "estimate_accrual"):
            _finish(step, "skipped", "Not used in the Rules execution: a fixed rule reads no documents and makes no estimate.")
            step["mcp"] = {"server": CARD[step["agent"]]["mcp_server"], "method": "not called", "tool": step["tool"], "arguments": {}}
            step["trace"] = {"count": 0, "layers": [], "hops": []}
            continue
        step["status"] = "running"
        before = _max_seq(store)
        step["started_ms"] = int((time.perf_counter() - started) * 1000)
        step["mcp"] = {"server": CARD[step["agent"]]["mcp_server"], "method": "tools/call (MCP-style, in-process)", "tool": step["tool"], "arguments": {"period": effective, "company_code": cc, "execution": E.execution_label(execution)}}
        store.thread_state.agent_ctx = {"plan_id": plan["plan_id"], "step_id": step["step_id"]}
        try:
            _run_tool(store, plan, step, state)
        except Denied as exc:
            _finish(step, "blocked", str(exc))
            plan["status"] = "blocked"
        finally:
            store.thread_state.agent_ctx = None
        step["duration_ms"] = int((time.perf_counter() - started) * 1000) - step["started_ms"]
        step["trace"] = _trace(store, before, step["step_id"], plan["plan_id"])
        if step["status"] == "blocked":
            break
    if plan["status"] not in ("blocked", "needs_input"):
        plan["status"] = "done"
    for step in plan["steps"]:
        if step["status"] in ("pending", "running"):
            step["status"] = "skipped"
    plan["duration_ms"] = int((time.perf_counter() - started) * 1000)
    refs = ["AC2"]
    for s in plan["steps"]:
        for r in TOOL_REFS.get(s["tool"], []):
            if r not in refs:
                refs.append(r)
    plan["references"] = [REFS[r] | {"id": r} for r in sorted(refs)]
    plan["systems_of_record"] = systems_for([s["tool"] for s in plan["steps"] if s.get("status") == "done"])
    plan["llm"] = {**E.LLM, "used": execution == "llm"}
    plan["result_blocks"] = _result_blocks(state, plan)
    plan["answer"] = _answer(plan, state)
    store.set_state("last_plan", plan)
    return plan


def _chain(store, plan, tool, fn, state, cfin=False):
    return _read_chain(store, plan["trace_case_id"], state["scenario"], tool, fn, cfin=cfin, ops=READ_OPS)


def _run_tool(store, plan, step, state):
    tool, period, cc, execution = step["tool"], state["period"], state["cc"], state["execution"]
    if tool == "get_accrual_candidates":
        found = _chain(store, plan, tool, lambda: [i for i in A.items(period, cc) if i["type"] in state["types"]], state)
        state["items"] = found
        by_type = {}
        for i in found:
            by_type[i["type"]] = by_type.get(i["type"], 0) + 1
        _finish(step, "done", f"{len(found)} accrual candidates in company code {cc}: " + ", ".join(f"{n} {t}" for t, n in by_type.items()) + ".")
    elif tool == "get_prior_accruals":
        def taken():
            refs = dict(A.already_accrued(period, cc))
            for d in _ledger(store):
                if d["company_code"] == cc and d["period"] == period:
                    for row in d["lines"]:
                        refs[row["reference"]] = d["doc_no"]
            return refs
        state["taken"] = _chain(store, plan, tool, taken, state)
        _finish(step, "done", f"{len(state['taken'])} reference(s) already carry an accrual document this period." if state["taken"] else "No reference is accrued yet this period.")
    elif tool == "read_source_documents":
        docs = _chain(store, plan, tool, lambda: A.documents(period, cc), state)
        scan = E.scan_documents(docs)
        state["docs"], state["scan"] = docs, scan
        extra = E.document_candidates(period, cc, docs) if "ESTIMATE" in state["types"] else []
        state["items"] = state.get("items", []) + extra
        note = f" Instructions found in {', '.join(scan['injection_detected'])} were ignored: document content is untrusted input." if scan["injection_detected"] else ""
        _finish(step, "done", f"Read {len(docs)} documents (simulated LLM); {len(extra)} liability found that the structured data does not hold.{note}")
    elif tool == "interpret_policy":
        state["rules"] = E.interpret_handbook(execution)
        _finish(step, "done", f"{len(state['rules'])} rules from the {'handbook (' + A.HANDBOOK['version'] + ', read by the simulated LLM)' if execution == 'llm' else 'coded rule set (handbook not read)'}.")
    elif tool == "calculate_accrual":
        calc = [(i["key"], E.formula_amount(i)) for i in state.get("items", [])]
        state["calc_count"] = sum(1 for _, v in calc if v)
        _finish(step, "done", f"{state['calc_count']} formula-based amounts calculated by deterministic code (purchase order, service entry sheet, GR/IR and contract rules).")
    elif tool == "estimate_accrual":
        docs = state.get("docs", [])
        est = [i for i in state.get("items", []) if i["type"] == "ESTIMATE"]
        state["estimates"] = len(est)
        _finish(step, "done", f"{len(est)} item(s) without a formula estimated; the model chose the method, the arithmetic is deterministic, each carries a range and evidence.")
    elif tool == "check_accrual_policy":
        lines, excluded = [], []
        for item in state.get("items", []):
            built = E.build_line(item, state["execution"], period, cc, state.get("docs", []), state.get("taken", {}))
            (excluded if built.get("excluded") else lines).append(built)
        state["lines"], state["excluded"] = lines, excluded
        blocked = sum(1 for l in lines if l["status"] == "blocked")
        _finish(step, "done", f"{len(lines)} line(s) proposed ({blocked} blocked), {len(excluded)} excluded.")
    elif tool == "draft_accrual_journal":
        existing = _runs(store).get(_key(period, cc))
        if existing and existing["status"] in ("posted", "reconciled"):
            state["kept_posted"] = True
            _finish(step, "done", "A posted journal exists for this company code and period; it was kept. The new proposals are duplicates and were not saved.")
            return
        run = {"run_id": f"ACC-{plan['plan_id']}", "period": period, "company_code": cc, "currency": A.COMPANY_CODES[cc]["ccy"], "execution": execution, "types": state["types"], "status": "proposed",
               "lines": state["lines"], "excluded": state["excluded"], "documents": state.get("docs", []), "injections": (state.get("scan") or {}).get("injection_detected", []), "rules": state["rules"],
               "period_open": not A.is_closed(period, cc), "prepared_by": "finance.user", "approval": None, "posting": None, "reconciliation": None, "audit": [], "llm": E.LLM if execution == "llm" else None}
        _audit(run, "finance.user", "prepared", f"{len(run['lines'])} lines, execution {E.execution_label(execution)}")
        _save_run(store, run)
        state["run"] = run
        _finish(step, "done", f"Draft saved for company code {cc}: {len(run['lines'])} line(s) awaiting review. Nothing was posted.")
    elif tool == "reconcile_ledger_entries":
        run = _runs(store).get(_key(period, cc))
        if not run or run["status"] not in ("posted", "reconciled"):
            raise Denied(f"No posted accrual journal exists for company code {cc} in {period}. Prepare, approve and post first.")
        result = _chain(store, plan, tool, lambda: E.reconcile(run, _ledger(store)), state, cfin=True)
        run["reconciliation"] = result
        run["status"] = "reconciled" if result["status"] == "RECONCILED" else "posted"
        _audit(run, "finance.user", "reconciled", result["status"])
        _save_run(store, run)
        state["recon"] = result
        _finish(step, "done", f"Reconciliation of company code {cc}: {result['status']}. S/4HANA {result['s4_total']:,} {result['currency']}, Central Finance {result['cfin_total']:,} {result['currency']}.")


def _answer(plan, state) -> str:
    if plan["status"] == "blocked":
        return next((s["summary"] for s in plan["steps"] if s["status"] == "blocked"), "Stopped.")
    cc, label = state["cc"], E.execution_label(state["execution"])
    if plan["intent"] == "reconcile":
        r = state.get("recon") or {}
        open_items = [c["check"] for c in r.get("checks", []) if c["status"] != "OK"]
        verdict = "The posted entries tie to the approved lines, the accrual account, the reversal and Central Finance." if not open_items else "Open: " + "; ".join(open_items) + (f" ({', '.join(r['pending_documents'])} waiting for replication)" if r.get("pending_documents") else "") + "."
        return f"Company code {cc}, {plan['effective_period']}: {r.get('status')}. {verdict} Posting was a simulated local entry; no SAP system was changed."
    lines, excl = state.get("lines", []), state.get("excluded", [])
    total = sum(l["amount"] for l in lines if l["status"] != "blocked")
    ccy = A.COMPANY_CODES[cc]["ccy"]
    tail = " The LLM is simulated (no model was called)." if state["execution"] == "llm" else " Rules execution: no documents were read and no estimates were made."
    inj = f" Instructions in {', '.join(state['scan']['injection_detected'])} were ignored." if state.get("scan", {}).get("injection_detected") else ""
    return (f"Company code {cc}, {plan['effective_period']}, execution {label}: {len(lines)} accrual line(s) proposed, {total:,} {ccy} before review, {sum(1 for l in lines if l['status'] == 'blocked')} blocked, {len(excl)} excluded."
            f"{inj} A person reviews and approves, then posts to the local synthetic ledger; the agent never posts and no SAP system was changed.{tail}")


def _result_blocks(state, plan) -> list:
    if plan["intent"] == "reconcile":
        r = state.get("recon")
        if not r:
            return []
        return [{"type": "kpis", "items": [{"label": "Status", "value": r["status"], "tone": "ok" if r["status"] == "RECONCILED" else "warn"}, {"label": "S/4HANA total", "value": f"{r['s4_total']:,} {r['currency']}"},
                                          {"label": "Central Finance total", "value": f"{r['cfin_total']:,} {r['currency']}"}, {"label": "Difference", "value": f"{r['difference']:,} {r['currency']}"}]},
                {"type": "table", "title": "Reconciliation checks", "columns": [{"key": "check", "label": "Check"}, {"key": "expected", "label": "Expected"}, {"key": "actual", "label": "Actual"}, {"key": "status", "label": "Result"}], "rows": r["checks"]}]
    lines, excl = state.get("lines", []), state.get("excluded", [])
    ccy = A.COMPANY_CODES[state["cc"]]["ccy"]
    blocks = [{"type": "kpis", "items": [{"label": "Company code", "value": state["cc"], "note": A.COMPANY_CODES[state["cc"]]["name"]}, {"label": "Execution", "value": E.execution_label(state["execution"]), "note": "simulated model" if state["execution"] == "llm" else "coded rules"},
                                          {"label": "Lines proposed", "value": str(len(lines))}, {"label": f"Total ({ccy})", "value": f"{sum(l['amount'] for l in lines):,}"}, {"label": "Excluded", "value": str(len(excl))}]}]
    if lines:
        blocks.append({"type": "table", "title": "Proposed accrual lines (a person reviews them in the workflow panel)", "columns": [{"key": "type", "label": "Type"}, {"key": "reference", "label": "Reference"}, {"key": "vendor", "label": "Vendor"},
                       {"key": "amount", "label": f"Amount ({ccy})", "align": "right", "format": "int"}, {"key": "clause", "label": "Clause"}, {"key": "status", "label": "Status"}],
                       "rows": [{"type": l["type"], "reference": l["reference"], "vendor": l["vendor"], "amount": l["amount"], "clause": l["clause"], "status": l["status"]} for l in lines]})
    if excl:
        blocks.append({"type": "list", "title": "Excluded", "items": [f"{e['reference']}: {e['excluded']}" for e in excl]})
    return blocks


# ---- workflow actions (human-triggered; never agent tools) -------------------------------------------------------------
def _approver(payload):
    if payload.get("approver_id") != APPROVER:
        raise Denied("Only the finance approver role can do this. Switch to the approver role.")


def _need_run(store, payload) -> dict:
    period, cc = payload.get("period"), payload.get("company_code")
    if period not in A.PERIODS or cc not in A.COMPANY_CODES:
        raise Denied("NO DATA AVAILABLE FOR THIS PERIOD OR COMPANY CODE.")
    run = _runs(store).get(_key(period, cc))
    if not run:
        raise Denied("No accrual run exists for this company code and period. Ask the agent to prepare the accruals first.")
    return run


def act_select(store, payload):
    cc = payload.get("company_code")
    if cc not in A.COMPANY_CODES:
        raise Denied("Unknown company code.")
    store.set_state("accrual_selected_cc", cc)
    return {"selected": cc}


def act_decide_line(store, payload):
    _approver(payload)
    run = _need_run(store, payload)
    if run["status"] not in ("proposed", "accepted", "approved"):
        raise Denied("The journal is already posted; lines can no longer be changed.")
    line = next((l for l in run["lines"] if l["line_id"] == payload.get("line_id")), None)
    if not line:
        raise Denied("Unknown line.")
    if line["status"] == "blocked":
        raise Denied("A blocked line cannot be accepted. It stays out of the journal.")
    decision = payload.get("decision")
    if decision not in ("accept", "reject"):
        raise Denied("Decision must be accept or reject.")
    line["status"] = "accepted" if decision == "accept" else "rejected"
    if run["approval"]:
        run["approval"] = None
        _audit(run, payload["approver_id"], "approval withdrawn", "the accepted lines changed")
    run["status"] = "accepted" if E.accepted_lines(run) else "proposed"
    _audit(run, payload["approver_id"], decision, line["line_id"])
    _save_run(store, run)
    return {"run_status": run["status"]}


def act_approve_journal(store, payload):
    _approver(payload)
    run = _need_run(store, payload)
    if run["status"] not in ("accepted", "approved"):
        raise Denied("Accept at least one line before approving the journal.")
    if not run["period_open"]:
        raise Denied("The posting period is closed for this company code. The journal cannot be approved for posting.")
    if payload.get("payload_hash") != E.journal_hash(run):
        raise Denied("The accepted lines changed after this approval was requested. Review the journal again.")
    if run["prepared_by"] == payload["approver_id"]:
        raise Denied("The preparer cannot approve their own journal.")
    run["approval"] = {"approver": payload["approver_id"], "hash": E.journal_hash(run), "at": datetime.now(timezone.utc).strftime("%H:%M:%S")}
    run["status"] = "approved"
    _audit(run, payload["approver_id"], "approved journal", run["approval"]["hash"][:12])
    _save_run(store, run)
    return {"run_status": run["status"], "hash": run["approval"]["hash"]}


def act_post_journal(store, payload):
    """SIMULATED posting: one document in the local synthetic ledger. No SAP system is changed."""
    _approver(payload)
    run = _need_run(store, payload)
    if run["status"] in ("posted", "reconciled"):
        raise Denied("This journal is already posted.")
    if run["status"] != "approved" or not run["approval"]:
        raise Denied("The journal must be approved before it can be posted.")
    if not run["period_open"]:
        raise Denied("The posting period is closed for this company code.")
    if run["approval"]["hash"] != E.journal_hash(run):
        raise Denied("The accepted lines changed after the approval. Approve again.")
    journal = E.build_journal(run)
    if not journal["balanced"]:
        raise Denied("The journal is not balanced.")
    ledger = _ledger(store)
    seq = 1 + sum(1 for d in ledger if d["company_code"] == run["company_code"] and d["period"] == run["period"])
    doc_no = f"SYN-JE-{run['company_code']}-{run['period']}-{seq:02d}"
    total = journal["debit"]
    doc = {"doc_no": doc_no, "company_code": run["company_code"], "period": run["period"], "posting_date": journal["posting_date"], "currency": run["currency"], "debit": journal["debit"], "credit": journal["credit"],
           "total": total, "lines": [{"reference": l["reference"], "amount": l["amount"], "expense_account": l["expense_account"], "cost_center": l["cost_center"], "line_id": l["line_id"]} for l in E.accepted_lines(run)],
           "run_id": run["run_id"], "hash": journal["hash"], "status": "posted", "simulated": True,
           "reversal": {"doc_no": doc_no.replace("SYN-JE-", "SYN-JE-REV-"), "date": journal["reversal_date"], "total": -total, "status": "scheduled"},
           "replicated": not A.replication_pending(run["period"], run["company_code"], doc_no)}
    ledger.append(doc)
    store.set_state("accrual_ledger", ledger)
    run["posting"] = {"doc_no": doc_no, "at": datetime.now(timezone.utc).strftime("%H:%M:%S"), "by": payload["approver_id"]}
    run["status"] = "posted"
    _audit(run, payload["approver_id"], "posted (simulated, local ledger)", doc_no)
    _save_run(store, run)
    return {"doc_no": doc_no, "run_status": run["status"]}


def act_replicate(store, payload):
    run = _need_run(store, payload)
    ledger, count = _ledger(store), 0
    for d in ledger:
        if d["company_code"] == run["company_code"] and d["period"] == run["period"] and not d["replicated"]:
            d["replicated"], count = True, count + 1
    if not count:
        raise Denied("Nothing is waiting for replication.")
    store.set_state("accrual_ledger", ledger)
    _audit(run, payload.get("approver_id", "finance.user"), "replication to Central Finance run (simulated)", f"{count} document(s)")
    _save_run(store, run)
    return {"replicated": count}


def act_reconcile(store, payload):
    run = _need_run(store, payload)
    if run["status"] not in ("posted", "reconciled"):
        raise Denied("Post the journal before reconciling.")
    result = E.reconcile(run, _ledger(store))
    run["reconciliation"], run["status"] = result, ("reconciled" if result["status"] == "RECONCILED" else "posted")
    _audit(run, payload.get("approver_id", "finance.user"), "reconciled", result["status"])
    _save_run(store, run)
    return result


def act_reset(store, payload):
    period, cc = payload.get("period"), payload.get("company_code")
    if period not in A.PERIODS or cc not in A.COMPANY_CODES:
        raise Denied("NO DATA AVAILABLE FOR THIS PERIOD OR COMPANY CODE.")
    runs = _runs(store)
    runs.pop(_key(period, cc), None)
    store.set_state("accrual_runs", runs)
    store.set_state("accrual_ledger", [d for d in _ledger(store) if not (d["company_code"] == cc and d["period"] == period)])
    return {"reset": True}


ACTIONS = {"select": act_select, "decide_line": act_decide_line, "approve_journal": act_approve_journal, "post_journal": act_post_journal, "replicate": act_replicate, "reconcile": act_reconcile, "reset": act_reset}


# ---- the workflow panel (declarative blocks) ---------------------------------------------------------------------------
def _flow_rows(run) -> list:
    acc = len(E.accepted_lines(run))
    s = run["status"]
    done = lambda ok: "Done" if ok else "Waiting"
    return [{"step": "1  Prepare (agent)", "who": "Accrual Preparation Agent", "state": "Done", "note": f"{len(run['lines'])} lines, {len(run['excluded'])} excluded"},
            {"step": "2  Review", "who": "Finance approver", "state": done(acc > 0 or s in ("approved", "posted", "reconciled")), "note": f"{acc} accepted"},
            {"step": "3  Approve journal", "who": "Finance approver (not the preparer)", "state": done(s in ("approved", "posted", "reconciled")), "note": (run["approval"] or {}).get("hash", "")[:12]},
            {"step": "4  Post (simulated)", "who": "Finance approver", "state": done(s in ("posted", "reconciled")), "note": (run["posting"] or {}).get("doc_no", "local synthetic ledger only")},
            {"step": "5  Reconcile posted entries", "who": "Posted Entries Reconciliation Agent", "state": done(s == "reconciled" or bool(run["reconciliation"])), "note": (run["reconciliation"] or {}).get("status", "")}]


def view(store, period):
    if period not in A.PERIODS:
        raise Denied("NO DATA AVAILABLE FOR THIS PERIOD.")
    cc = store.get_state("accrual_selected_cc") or "1000"
    blocks = [{"type": "note", "tone": "warn", "text": "SIMULATED POSTING. Posted documents exist only in a local synthetic ledger; no SAP system is changed. The agent has no posting tool: a person approves and posts."},
              {"type": "actions", "title": "Company code (the agent works at company-code level)", "items": [{"label": f"{k} · {v['name']} ({v['ccy']})", "action": "select", "payload": {"company_code": k}, "active": k == cc} for k, v in A.COMPANY_CODES.items()]}]
    run = _runs(store).get(_key(period, cc))
    base = {"period": period, "company_code": cc}
    if not run:
        blocks.append({"type": "note", "text": f"No accrual run yet for company code {cc} in {period}. Ask the Accrual Posting agent to prepare the accruals; choose the Execution option (LLM is the default)."})
        return _wrap(period, cc, blocks)
    ccy = run["currency"]
    accepted, journal = E.accepted_lines(run), E.build_journal(run)
    blocks.append({"type": "kpis", "items": [{"label": "Execution", "value": E.execution_label(run["execution"]), "note": "simulated model" if run["execution"] == "llm" else "coded rules"},
                                              {"label": "Posting period", "value": "Open" if run["period_open"] else "Closed", "tone": "ok" if run["period_open"] else "bad"},
                                              {"label": "Proposed lines", "value": str(len(run["lines"])), "note": f"{sum(1 for l in run['lines'] if l['status'] == 'blocked')} blocked"},
                                              {"label": f"Accepted ({ccy})", "value": f"{journal['debit']:,}", "note": f"{len(accepted)} lines"}, {"label": "Status", "value": run["status"].upper()}]})
    blocks.append({"type": "table", "title": "Workflow", "columns": [{"key": "step", "label": "Step"}, {"key": "who", "label": "Who"}, {"key": "state", "label": "State"}, {"key": "note", "label": "Note"}], "rows": _flow_rows(run)})
    locked = run["status"] in ("posted", "reconciled")
    llm = run["execution"] == "llm"
    rows = []
    for l in run["lines"]:
        buttons = [] if (l["status"] == "blocked" or locked) else [{"label": "Accept", "action": "decide_line", "payload": {**base, "line_id": l["line_id"], "decision": "accept"}, "role": "approver", "active": l["status"] == "accepted"},
                                                                    {"label": "Reject", "action": "decide_line", "payload": {**base, "line_id": l["line_id"], "decision": "reject"}, "role": "approver", "active": l["status"] == "rejected"}]
        est = f" · range {l['estimate']['low']:,}–{l['estimate']['high']:,}" if l.get("estimate") else ""
        rows.append({"type": l["type"], "reference": l["reference"], "vendor": l["vendor"], "amount": l["amount"], "clause": l["clause"], "confidence": f"{int(l['confidence'] * 100)}%",
                     "why": (l["reasoning"] if llm else l["basis"]) + est, "flags": "; ".join(l["flags"]) or "none", "status": l["status"], "decision": buttons})
    cols = [{"key": "type", "label": "Type"}, {"key": "reference", "label": "Reference"}, {"key": "vendor", "label": "Vendor"}, {"key": "amount", "label": f"Amount ({ccy})", "align": "right", "format": "int"},
            {"key": "clause", "label": "Clause"}, {"key": "confidence", "label": "Confidence"}, {"key": "why", "label": "Why (simulated LLM)" if llm else "Basis (rule)"}, {"key": "flags", "label": "Flags"},
            {"key": "status", "label": "Status"}, {"key": "decision", "label": "Review", "format": "actions"}]
    blocks.append({"type": "table", "title": f"Proposal lines · company code {cc} · {period}", "columns": cols, "rows": rows})
    if run["excluded"]:
        blocks.append({"type": "table", "title": "Excluded candidates", "columns": [{"key": "reference", "label": "Reference"}, {"key": "type", "label": "Type"}, {"key": "reason", "label": "Reason"}],
                       "rows": [{"reference": e["reference"], "type": e["type"], "reason": e["excluded"]} for e in run["excluded"]]})
    if run["injections"]:
        blocks.append({"type": "note", "tone": "warn", "text": f"Prompt-injection attempt: {', '.join(run['injections'])} contained instructions to the agent. They were ignored; amounts come only from the structured facts in the document."})
    if llm:
        blocks.append({"type": "list", "title": "Rules the simulated LLM read from the handbook (" + A.HANDBOOK["version"] + ")", "items": [f"{r['clause']}: {r['formula']} ({r['applies_to']})" for r in run["rules"]]})
    if accepted:
        blocks.append({"type": "table", "title": f"Journal preview · posting date {journal['posting_date']} · reversal {journal['reversal_date']}", "columns": [{"key": "account", "label": "Account"}, {"key": "cost_center", "label": "Cost center"},
                       {"key": "debit", "label": "Debit", "align": "right", "format": "int"}, {"key": "credit", "label": "Credit", "align": "right", "format": "int"}, {"key": "text", "label": "Text"}],
                       "rows": [{**r, "cost_center": r["cost_center"] or ""} for r in journal["rows"]]})
        blocks.append({"type": "note", "tone": "ok" if journal["balanced"] else "bad", "text": f"Debit {journal['debit']:,} {ccy}, credit {journal['credit']:,} {ccy}. Journal hash {journal['hash'][:16]}…"})
    can_approve = run["status"] in ("accepted",) and run["period_open"]
    blocks.append({"type": "actions", "title": "Approve, post and reconcile (finance approver)", "items": [
        {"label": "Approve journal", "action": "approve_journal", "payload": {**base, "payload_hash": journal["hash"]}, "role": "approver", "disabled": not can_approve, "hint": "Accept at least one line first" if not accepted else ("Posting period closed" if not run["period_open"] else "")},
        {"label": "Post to synthetic ledger (simulated)", "action": "post_journal", "payload": base, "role": "approver", "disabled": run["status"] != "approved", "tone": "primary", "hint": "Approve the journal first" if run["status"] != "approved" else ""},
        {"label": "Reconcile posted entries", "action": "reconcile", "payload": base, "disabled": not locked},
        {"label": "Run replication to Central Finance (simulated)", "action": "replicate", "payload": base, "disabled": not locked or not any((not d["replicated"]) for d in _ledger(store) if d["company_code"] == cc and d["period"] == period)},
        {"label": "Reset this company code", "action": "reset", "payload": base}]})
    docs = [d for d in _ledger(store) if d["company_code"] == cc and d["period"] == period]
    if docs:
        blocks.append({"type": "table", "title": "Posted documents (local synthetic ledger)", "columns": [{"key": "doc", "label": "Document"}, {"key": "date", "label": "Posting date"}, {"key": "total", "label": f"Total ({ccy})", "align": "right", "format": "int"},
                       {"key": "reversal", "label": "Reversal"}, {"key": "cfin", "label": "Central Finance"}],
                       "rows": [{"doc": d["doc_no"], "date": d["posting_date"], "total": d["total"], "reversal": f"{d['reversal']['doc_no']} on {d['reversal']['date']} ({d['reversal']['status']})", "cfin": "replicated" if d["replicated"] else "pending replication"} for d in docs]})
    if run["reconciliation"]:
        r = run["reconciliation"]
        blocks.append({"type": "table", "title": f"Reconciliation after posting · {r['status']}", "columns": [{"key": "check", "label": "Check"}, {"key": "expected", "label": "Expected"}, {"key": "actual", "label": "Actual"}, {"key": "status", "label": "Result"}, {"key": "note", "label": "Note"}], "rows": r["checks"]})
        blocks.append({"type": "note", "tone": "ok" if r["status"] == "RECONCILED" else "warn", "text": f"{r['status']}: S/4HANA {r['s4_total']:,} {r['currency']}, Central Finance {r['cfin_total']:,} {r['currency']}, difference {r['difference']:,}."})
    blocks.append({"type": "list", "title": "Audit trail", "items": [f"{a['at']} · {a['actor']} · {a['action']}" + (f" · {a['note']}" if a["note"] else "") for a in run["audit"]]})
    return _wrap(period, cc, blocks)


def _wrap(period, cc, blocks):
    return {"period": period, "company_code": cc, "provenance": PROVENANCE, "ui": {"title": "Accrual posting workflow", "subtitle": f"Company code {cc} · custom imitation of SAP's standard accruals agent · synthetic", "blocks": blocks}}
