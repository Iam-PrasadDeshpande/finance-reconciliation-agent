"""Simulated agent layer: one orchestrator and specialist agents exposed as typed, MCP-style tools.

The calls are in-process Python calls shaped like MCP tools/call and tools/list. There is no MCP transport,
no model, and no agent can post to SAP or approve. Everything is deterministic rules over the existing
simulators. Plans write local case, event and proposal records only.
"""
from __future__ import annotations

import re
from datetime import datetime
import time
import uuid
from dataclasses import dataclass, field
from typing import Callable

from .contracts import ReconciliationRequest
from .questions import mentioned_period, request_for_demo
from .recon_report import build_report
from .registry import components
from .route_playbooks import route_playbook_catalog
from .store import Denied, Store

LABEL = "Simulated agents · deterministic rules · no LLM · in-process MCP-style tool calls · no SAP writes"
ROUTES = ("S1", "S2", "S3")

# view ids are the app's navigation targets: close, run, report, evidence-proof, decision-responsibilities, plan
AGENT_CARDS = [
    {"id": "orchestrator", "name": "Orchestrator", "role": "Plans the request and calls the specialists. It never touches SAP itself.", "mode": "plans only", "view": "plan", "tools": ["plan"], "mcp_server": "tool client (orchestrator)", "layers": []},
    {"id": "scope", "name": "Scope & intake", "role": "Turns a request into a period, company code, ledger and route.", "mode": "read", "view": "close", "tools": ["resolve_scope"], "mcp_server": "scope-mcp", "layers": ["Finance scope rules"]},
    {"id": "evidence", "name": "Evidence", "role": "Reads S/4HANA, Central Finance, BW and Databricks snapshots through the selected route.", "mode": "read (simulated)", "view": "run", "tools": ["collect_evidence"], "mcp_server": "evidence-mcp", "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends", "Enterprise Databricks"]},
    {"id": "variance", "name": "Variance & close", "role": "Computes the variance and says whether the period can close.", "mode": "read", "view": "report", "tools": ["compute_variance", "close_readiness"], "mcp_server": "variance-mcp", "layers": ["Reconciliation engine", "Report builder"]},
    {"id": "investigator", "name": "Investigator", "role": "Finds the document-level cause of a variance and shows its proof.", "mode": "read", "view": "evidence-proof", "tools": ["start_investigation"], "mcp_server": "investigator-mcp", "layers": ["Central Finance document comparison", "AIF reprocess state"]},
    {"id": "governance", "name": "Governance & route", "role": "Explains the MCP route, controls and open decisions, and the stored trace.", "mode": "read", "view": "decision-responsibilities", "tools": ["route_controls", "trace"], "mcp_server": "governance-mcp", "layers": ["Route playbooks", "Stored event trail"]},
    {"id": "approval", "name": "Approval gatekeeper", "role": "Drafts a proposal only. A person with the approver role decides.", "mode": "local marker draft", "view": "close", "tools": ["draft_proposal"], "mcp_server": "approval-mcp", "layers": ["Approval store (local marker)"]},
]
for _card in AGENT_CARDS:
    _card.setdefault("kind", "orchestrator" if _card["id"] == "orchestrator" else "specialist")
CARD = {c["id"]: c for c in AGENT_CARDS}

# name -> agent, class, input, output. sap.post, decide, execute and fixture changes are NOT tools.
TOOLS = {
    "plan": {"agent": "orchestrator", "rw": "none", "input": {"message": "string", "case_id": "string?"}, "output": "Plan"},
    "resolve_scope": {"agent": "scope", "rw": "read", "input": {"message": "string", "case_id": "string?"}, "output": "scope, assumed fields or a follow-up question"},
    "collect_evidence": {"agent": "evidence", "rw": "read", "input": {"scope": "object", "route": "S1|S2|S3"}, "output": "case with four source snapshots"},
    "compute_variance": {"agent": "variance", "rw": "read", "input": {"case_id": "string"}, "output": "variance amount and state"},
    "close_readiness": {"agent": "variance", "rw": "read", "input": {"period": "YYYY-MM", "case_id": "string?"}, "output": "report status and open items"},
    "start_investigation": {"agent": "investigator", "rw": "read", "input": {"case_id": "string"}, "output": "investigation with proof items"},
    "route_controls": {"agent": "governance", "rw": "read", "input": {"route": "S1|S2|S3"}, "output": "path and open decisions"},
    "trace": {"agent": "governance", "rw": "read", "input": {"case_id": "string"}, "output": "stored event count"},
    "draft_proposal": {"agent": "approval", "rw": "local-draft", "input": {"case_id": "string"}, "output": "proposal awaiting approval"},
}
NOT_TOOLS = ["sap.post", "approval.decide", "approval.execute", "fixture.mutate", "investigation.resolve"]
PLAN_ONLY = ("plan", "draft_proposal", "start_investigation", "collect_evidence")

WRITE_VERBS = re.compile(r"\b(post|book|reverse|clear|write|enter|create|change|edit|delete|update)\b")
WRITE_OBJECTS = re.compile(r"\b(journal|journals|sap|entry|entries|posting|postings|document|documents|je|ledger|balance|balances)\b")
APPROVAL_WORDS = re.compile(r"\b(approve|approved|decide|execute|sign off|authori[sz]e|release)\b")
CLARIFY = ("I can reconcile a period, investigate a variance, explain the route controls, check close readiness or draft a proposal. "
           "Which would you like? For example: Reconcile November 2026 company code 1000 ledger 0L USD.")


@dataclass
class Context:
    store: Store
    runtime: object
    investigator: object
    approval: object
    ensure: Callable[[], None]
    options: dict = field(default_factory=dict)


def _step(index, agent, tool, purpose, extra=None):
    step = {"step_id": f"s{index}", "agent": agent, "tool": tool, "purpose": purpose, "rw": TOOLS[tool]["rw"], "status": "pending", "summary": "", "view": CARD[agent]["view"]}
    step.update(extra or {})
    return step


def case_for_period(store, case_id, period):
    """A stored case is used only when it belongs to the selected period; otherwise the selected period decides."""
    case = store.case(case_id) if case_id else None
    if case and period and (case.get("scope") or {}).get("period") != period:
        return None
    return case


def plan_for(message: str, case: dict | None = None) -> dict:
    text = (message or "").lower().strip()
    steps: list[tuple[str, str, str]] = []
    note = ""
    if WRITE_VERBS.search(text) and WRITE_OBJECTS.search(text):
        intent = "refused_write"
    elif APPROVAL_WORDS.search(text):
        intent = "refused_approval"
    elif "investigat" in text:
        intent = "investigate"
        steps = [("investigator", "start_investigation", "Find the document that explains the variance")]
    elif re.search(r"\bpropos", text) or ("adjust" in text and "reconcil" not in text):
        intent = "propose"
        steps = [("approval", "draft_proposal", "Draft a local variance-marker proposal for approval")]
    elif any(word in text for word in ("control", "route", "gateway", "architecture", "governance")) and "reconcil" not in text:
        intent = "explain_route"
        steps = [("governance", "route_controls", "Explain the route, controls and open decisions")]
    elif any(word in text for word in ("report", "close", "ready")) and "reconcil" not in text:
        intent = "close_readiness"
        steps = [("variance", "close_readiness", "Check whether the period can close")]
    elif "reconcil" in text or "variance" in text or "balance" in text or mentioned_period(text):
        intent = "reconcile"
        steps = [("scope", "resolve_scope", "Resolve period, company code, ledger and route"),
                 ("evidence", "collect_evidence", "Read the four source snapshots"),
                 ("variance", "compute_variance", "Compute S/4HANA minus Central Finance"),
                 ("variance", "close_readiness", "Build the report and check close readiness"),
                 ("governance", "trace", "Attach the stored event trail")]
    else:
        intent = "clarify"
        note = CLARIFY
    return {
        "plan_id": f"plan-{uuid.uuid4().hex[:8]}", "intent": intent, "message": message, "synthetic": True, "label": LABEL,
        "status": "planned", "case_id": (case or {}).get("case_id"), "note": note, "adaptations": [],
        "steps": [_step(i + 1, agent, tool, purpose) for i, (agent, tool, purpose) in enumerate(steps)],
    }


def _max_seq(store: Store) -> int:
    with store.lock:
        return store.db.execute("SELECT COALESCE(MAX(seq),0) FROM events").fetchone()[0]


def _trace(store: Store, before: int, step_id: str, plan_id: str) -> dict:
    """Events this step produced, joined by the plan id and step id written into each event."""
    zones = {c["component_id"]: c["zone"] for c in components()}
    rows = [e for e in store.events(None, before) if (e.get("payload_summary") or {}).get("step_id") == step_id and (e.get("payload_summary") or {}).get("plan_id") == plan_id]
    layers, hops, seen = [], [], set()
    for event in rows:
        key = (event["source_component_id"], event["target_component_id"], event["operation"])
        for cid in (event["source_component_id"], event["target_component_id"]):
            zone = zones.get(cid)
            if zone and zone not in layers:
                layers.append(zone)
        if key not in seen and len(hops) < 24:
            seen.add(key)
            hops.append({"from": key[0], "to": key[1], "operation": key[2]})
    return {"count": len(rows), "first_seq": rows[0]["seq"] if rows else None, "last_seq": rows[-1]["seq"] if rows else None, "layers": layers, "hops": hops}


def _finish(step, status, summary):
    step["status"], step["summary"] = status, summary


def _arguments(tool, plan, state, scenario):
    if tool == "resolve_scope":
        return {"message": plan["message"]}
    if tool == "collect_evidence":
        return {"scope": state.get("parsed"), "route": scenario}
    if tool in ("compute_variance", "trace", "start_investigation", "draft_proposal"):
        return {"case_id": state.get("case_id")}
    if tool == "close_readiness":
        return {"period": state.get("period") or (state.get("scope") or {}).get("period") or (state.get("parsed") or {}).get("period"), "case_id": state.get("case_id")}
    if tool == "route_controls":
        return {"route": scenario}
    return {}


def run_plan(ctx: Context, plan: dict, scenario: str = "S1", user_id: str = "finance.user", initial: dict | None = None) -> dict:
    store = ctx.store
    case = store.case(plan["case_id"]) if plan.get("case_id") else None
    state = {"case": case, "scope": case["scope"] if case else None, "result": None, "case_id": plan.get("case_id")}
    selected = (initial or {}).get("selected_period")
    state.update({k: v for k, v in (initial or {}).items() if k != "selected_period"})
    state["selector"] = selected
    plan["selected_period"] = selected
    plan["period_source"] = "request" if mentioned_period((plan.get("message") or "").lower()) else ("selector" if selected else "case")
    plan["orchestrator"] = {"role": "tool client (MCP-style, in-process)", "rule": f"intent {plan['intent']}", "dispatches": len(plan["steps"]), "order": [s["tool"] for s in plan["steps"]]}
    if plan["intent"] == "refused_write":
        plan["status"] = "blocked"
        plan["blocked_reason"] = "Posting or changing SAP data is not an agent action. SAP access here is simulated with no SAP writes; a local marker needs a proposal and a separate finance approval."
        plan["answer"] = plan["blocked_reason"]
        return plan
    if plan["intent"] == "refused_approval":
        plan["status"] = "blocked"
        plan["blocked_reason"] = "Approval is a person's decision, not an agent action. Switch to the finance approver role to decide."
        plan["answer"] = plan["blocked_reason"]
        return plan
    if plan["intent"] == "clarify":
        plan["status"] = "needs_input"
        plan["answer"] = plan["note"]
        return plan
    started = time.perf_counter()
    index = 0
    while index < len(plan["steps"]):
        step = plan["steps"][index]
        index += 1
        step["status"] = "running"
        before = _max_seq(store)
        step["started_ms"] = int((time.perf_counter() - started) * 1000)
        step["mcp"] = {"server": CARD[step["agent"]]["mcp_server"], "method": "tools/call (MCP-style, in-process)", "tool": step["tool"], "arguments": _arguments(step["tool"], plan, state, scenario)}
        store.thread_state.agent_ctx = {"plan_id": plan["plan_id"], "step_id": step["step_id"]}
        try:
            _run_step(ctx, plan, step, state, scenario, user_id)
        except Denied as exc:
            _finish(step, "blocked", str(exc))
            plan["status"] = "blocked"
        finally:
            store.thread_state.agent_ctx = None
        step["duration_ms"] = int((time.perf_counter() - started) * 1000) - step["started_ms"]
        step["trace"] = _trace(store, before, step["step_id"], plan["plan_id"])
        step["mcp"]["arguments"] = _arguments(step["tool"], plan, state, scenario)
        if step["status"] == "blocked":
            break
        if step["status"] == "held":
            plan["status"] = "needs_input"
            break
        if step["tool"] == "close_readiness" and plan["intent"] == "reconcile" and state.get("report"):
            summary = state["report"]
            if summary["variance"] != 0:
                if state.get("period") == "2026-11" and not any(s["tool"] == "start_investigation" for s in plan["steps"]):
                    plan["steps"].append(_step(len(plan["steps"]) + 1, "investigator", "start_investigation", "Find the document that explains the non-zero variance", {"added_by": "variance result is non-zero"}))
                    plan["adaptations"].append({"after": step["step_id"], "added": "investigator.start_investigation", "because": f"variance is {summary['variance']:,} USD"})
                else:
                    plan["adaptations"].append({"after": step["step_id"], "added": None, "because": "variance is non-zero, but document investigation is seeded for November 2026 only in this demo"})
    if plan["status"] not in ("blocked", "needs_input"):
        plan["status"] = "done"
    for step in plan["steps"]:
        if step["status"] in ("pending", "running"):
            step["status"] = "skipped"
    plan["orchestrator"]["dispatches"] = len(plan["steps"])
    plan["orchestrator"]["order"] = [s["tool"] for s in plan["steps"]]
    plan["case_id"] = state["case_id"]
    plan["effective_period"] = None if plan["status"] == "needs_input" else (state.get("period") or (state.get("parsed") or {}).get("period") or (state.get("scope") or {}).get("period"))
    plan["duration_ms"] = int((time.perf_counter() - started) * 1000)
    plan["answer"] = _answer(plan)
    if plan["intent"] == "reconcile" and plan["status"] == "done" and state.get("report_full"):
        plan["result_blocks"] = _recon_blocks(state["report_full"])
    store.set_state("last_plan", plan)
    return plan


def _recon_blocks(report: dict) -> list:
    """The reconciliation output shown inline on the Ask page, like the other agent apps: figures, reconciling items, accounts and controls."""
    sm, ccy = report["summary"], report.get("currency", "USD")
    tone = {"BALANCED": "ok", "WITHIN_TOLERANCE": "ok", "EXPLAINED": "ok"}.get(sm["status"], "warn")
    blocks = [{"type": "kpis", "items": [
        {"label": "Close readiness", "value": sm["status"].replace("_", " ").title(), "tone": tone, "note": sm.get("status_text", "")},
        {"label": "S/4HANA total", "value": f"{sm['s4_total']:,} {ccy}"}, {"label": "Central Finance total", "value": f"{sm['cfin_total']:,} {ccy}"},
        {"label": "Variance", "value": f"{sm['variance']:,} {ccy}"}, {"label": "Unexplained", "value": f"{sm['unexplained']:,} {ccy}", "tone": "ok" if not sm["unexplained"] else "warn"},
        {"label": "Open items", "value": str(sm["open_items"])}]}]
    items = report.get("items", [])
    if items:
        blocks.append({"type": "table", "title": "Reconciling items", "columns": [
            {"key": "document", "label": "Document"}, {"key": "category", "label": "Category"}, {"key": "account", "label": "Account"},
            {"key": "difference", "label": f"Difference ({ccy})", "align": "right", "format": "int"}, {"key": "status", "label": "Status"}, {"key": "owner", "label": "Owner"}],
            "rows": [{"document": i["document_id"], "category": i["category_label"], "account": f"{i['account']} {i['account_name']}", "difference": i["difference"],
                      "status": i["status"].replace("_", " "), "owner": i["owner"]} for i in items]})
    accounts = report.get("accounts", [])
    if accounts:
        blocks.append({"type": "table", "title": "Accounts", "columns": [
            {"key": "account", "label": "Account"}, {"key": "s4", "label": "S/4HANA", "align": "right", "format": "int"}, {"key": "cfin", "label": "Central Finance", "align": "right", "format": "int"},
            {"key": "difference", "label": "Difference", "align": "right", "format": "int"}, {"key": "status", "label": "Status"}],
            "rows": [{"account": f"{a['account']} {a['name']}", "s4": a["s4_balance"], "cfin": a["cfin_balance"], "difference": a["difference"], "status": a["status"].replace("_", " ")} for a in accounts]})
    controls = report.get("controls", [])
    if controls:
        blocks.append({"type": "table", "title": "Controls", "columns": [{"key": "name", "label": "Control"}, {"key": "status", "label": "Result"}, {"key": "detail", "label": "Detail"}],
                       "rows": [{"name": f"{c['id']} {c['name']}", "status": c["status"], "detail": c["detail"]} for c in controls]})
    blocks.append({"type": "note", "text": "Synthetic data. This is the same report as the Close & reconcile screen; no SAP write was made and a person decides on any proposal."})
    return blocks


def _answer(plan):
    by = {s["tool"]: s for s in plan["steps"] if s["status"] == "done"}
    if plan["status"] == "needs_input":
        held = next((s for s in plan["steps"] if s["status"] == "held"), None)
        return (held or {}).get("summary") or plan.get("note") or "More detail is needed."
    if plan["status"] == "blocked":
        blocked = next((s for s in plan["steps"] if s["status"] == "blocked"), None)
        return f"Stopped: {blocked['summary']} Nothing was changed." if blocked else plan.get("blocked_reason", "")
    if plan["intent"] == "reconcile":
        scope = by.get("resolve_scope", {}).get("summary", "")
        text = f"{scope} Variance: {by.get('compute_variance', {}).get('summary', 'n/a')}. Close readiness: {by.get('close_readiness', {}).get('summary', 'n/a')}."
        if "start_investigation" in by:
            text += f" {by['start_investigation']['summary']}"
        elif plan["adaptations"] and not plan["adaptations"][0].get("added"):
            text += f" Note: {plan['adaptations'][0]['because']}."
        return text + " No SAP write was made; a person decides on any proposal."
    return " ".join(s["summary"] for s in plan["steps"] if s["summary"]) + " No SAP write was made."


def _need_case(state):
    if not state["case_id"] or not state["case"]:
        raise Denied("Run a reconciliation first so there is a case to work on.")


def _run_step(ctx, plan, step, state, scenario, user_id):
    store, tool = ctx.store, step["tool"]
    if tool == "resolve_scope":
        scope = state["scope"] or ({"period": state["selector"]} if state.get("selector") else None)
        parsed, assumed, follow_up = request_for_demo(plan["message"], scope)
        if follow_up:
            _finish(step, "held", follow_up)
            return
        if parsed["period"] not in store.available_periods():
            year, month = parsed["period"].split("-")
            raise Denied(f"NO DATA AVAILABLE FOR {datetime(int(year), int(month), 1).strftime('%B %Y').upper()}. This synthetic demo covers December 2025 through November 2026 for company code 1000, ledger 0L.")
        if parsed["company_code"] != "1000" or parsed["ledger"] != "0L":
            raise Denied("This synthetic demo covers December 2025 through November 2026 for company code 1000, ledger 0L.")
        state["parsed"] = parsed
        extra = f" Assumed {', '.join(assumed)}." if assumed else ""
        _finish(step, "done", f"{parsed['period']} · company {parsed['company_code']} · ledger {parsed['ledger']} · {parsed['currency']} · route {scenario}.{extra}")
    elif tool == "collect_evidence":
        ctx.ensure()
        result = ctx.runtime.reconcile(ReconciliationRequest(scenario=scenario, user_id=user_id, **state["parsed"]))
        state["result"], state["case_id"] = result, result["case_id"]
        state["case"] = store.case(result["case_id"])
        state["scope"] = state["case"]["scope"]
        _finish(step, "done", f"Read {len(result['sources'])} sources through {scenario}. Case {result['case_id']}.")
    elif tool == "compute_variance":
        _need_case(state)
        variance = (state["result"] or state["case"].get("result") or {}).get("variance") or {}
        amount = variance.get("amount")
        _finish(step, "done", f"{variance.get('state', 'unknown')}" + (f" · {int(amount):,} USD" if amount is not None else " · no comparable amount"))
    elif tool == "close_readiness":
        period = state.get("period") or (state["scope"] or {}).get("period") or (state.get("parsed") or {}).get("period") or state.get("selector")
        if not period:
            raise Denied("No period is selected. Choose a period first.")
        events = store.events(state["case_id"]) if state["case_id"] else None
        report = build_report(store, period, state["case"], events)
        summary = report["summary"]
        state["period"], state["report"], state["report_full"] = period, summary, report
        _finish(step, "done", f"{summary['status'].replace('_', ' ').title()} · variance {summary['variance']:,} USD · {summary['open_items']} open items · unexplained {summary['unexplained']:,} USD")
        step["ref"] = {"period": period}
    elif tool == "trace":
        _need_case(state)
        _finish(step, "done", f"{len(store.events(state['case_id']))} stored events for {state['case_id']} so far.")
    elif tool == "start_investigation":
        _need_case(state)
        ctx.ensure()
        record = ctx.investigator.start(state["case_id"], "replication_gap")
        done = ctx.investigator.run(record["investigation_id"])
        _finish(step, "done", f"Investigation {record['investigation_id']} · {(done or record).get('status', 'complete')}. Open the proof dossier.")
        step["ref"] = {"investigation_id": record["investigation_id"]}
    elif tool == "draft_proposal":
        _need_case(state)
        proposal = ctx.approval.propose(state["case_id"])
        _finish(step, "done", f"Proposal {proposal.get('proposal_id', '')} is {proposal.get('status', 'awaiting approval')}. Only a person with the approver role can decide.")
    elif tool == "route_controls":
        catalog = route_playbook_catalog()
        route = scenario if scenario in catalog else "S1"
        entry = catalog[route]
        _finish(step, "done", f"{route}: {entry.get('path', '')} · {len(entry.get('decisions', []))} open decisions.")
    else:
        raise Denied("Unregistered agent tool")


def validate_args(store: Store, name: str, args: dict) -> None:
    if args.get("scenario", "S1") not in ROUTES:
        raise Denied("Route must be S1, S2 or S3.")
    period = args.get("period")
    if period is not None and (not re.fullmatch(r"\d{4}-\d{2}", str(period)) or period not in store.available_periods()):
        raise Denied("Period must be YYYY-MM within December 2025 to November 2026.")
    case_id = args.get("case_id")
    if case_id is not None and not store.case(case_id):
        raise Denied("Unknown case id.")
    if name in ("compute_variance", "trace") and not case_id:
        raise Denied(f"{name} needs a case id.")


def invoke_tool(ctx: Context, name: str, args: dict) -> dict:
    """Single MCP-style tool call. Only registered read tools are reachable; plan-only tools are not."""
    if name not in TOOLS or name in PLAN_ONLY:
        raise Denied("Tool is not available for direct calls")
    validate_args(ctx.store, name, args)
    message = args.get("message") or ""
    case = ctx.store.case(args["case_id"]) if args.get("case_id") else None
    initial = None
    if name == "resolve_scope":
        plan = plan_for(message or "reconcile", case)
        plan["steps"] = [s for s in plan["steps"] if s["tool"] == "resolve_scope"]
    elif name == "close_readiness":
        plan = plan_for("report", case)
        plan["steps"] = [_step(1, "variance", "close_readiness", "Check whether the period can close")]
        if args.get("period"):
            initial = {"period": args["period"]}
    elif name == "route_controls":
        plan = plan_for("route controls", case)
    else:
        plan = plan_for("trace", case)
        plan["steps"] = [_step(1, TOOLS[name]["agent"], name, name)]
    return run_plan(ctx, plan, args.get("scenario", "S1"), "finance.user", initial)


def catalog() -> dict:
    return {"label": LABEL, "agents": AGENT_CARDS, "tools": [{"name": n, **t} for n, t in TOOLS.items()], "not_tools": NOT_TOOLS,
            "note": "Calls are in-process and MCP-shaped; there is no MCP transport. The demo agent's registration still lists sap.post for the separate, human-approved local marker path; no agent tool exposes it."}
