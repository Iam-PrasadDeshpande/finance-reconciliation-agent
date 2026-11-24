"""Simulated agent layer: one orchestrator and specialist agents exposed as typed, MCP-style tools.

Everything here is deterministic rules over the existing simulators. No model is called, nothing posts
to SAP, and no agent can approve. Approval, posting and fixture changes are deliberately not tools.
"""
from __future__ import annotations

import uuid
from dataclasses import dataclass
from typing import Callable

from .contracts import ReconciliationRequest
from .questions import request_for_demo
from .recon_report import build_report
from .route_playbooks import route_playbook_catalog
from .store import Denied, Store

LABEL = "Simulated agents · deterministic rules · no LLM · read-only SAP simulation"

# view ids are the app's navigation targets: close, run, decision-compare, decision-responsibilities,
# decision-diagrams, evidence-proof, report
AGENT_CARDS = [
    {"id": "orchestrator", "name": "Orchestrator", "role": "Plans the request and calls the specialists. It never touches SAP itself.", "mode": "plans only", "view": "plan", "tools": ["plan"]},
    {"id": "scope", "name": "Scope & intake", "role": "Turns a request into a period, company code, ledger and route.", "mode": "read", "view": "close", "tools": ["resolve_scope"]},
    {"id": "evidence", "name": "Evidence", "role": "Reads S/4HANA, Central Finance, BW and Databricks snapshots through the selected route.", "mode": "read (simulated)", "view": "run", "tools": ["collect_evidence"]},
    {"id": "variance", "name": "Variance & close", "role": "Computes the variance and says whether the period can close.", "mode": "read", "view": "report", "tools": ["compute_variance", "close_readiness"]},
    {"id": "investigator", "name": "Investigator", "role": "Finds the document-level cause of a variance and shows its proof.", "mode": "read", "view": "evidence-proof", "tools": ["start_investigation"]},
    {"id": "governance", "name": "Governance & route", "role": "Explains the MCP route, controls and open decisions, and the stored trace.", "mode": "read", "view": "decision-responsibilities", "tools": ["route_controls", "trace"]},
    {"id": "approval", "name": "Approval gatekeeper", "role": "Drafts a proposal only. A person with the approver role decides.", "mode": "local marker draft", "view": "close", "tools": ["draft_proposal"]},
]

# name -> agent, read/write class, input, output. sap.post, decide, execute and fixture changes are NOT tools.
TOOLS = {
    "plan": {"agent": "orchestrator", "rw": "none", "input": {"message": "string", "case_id": "string?"}, "output": "Plan"},
    "resolve_scope": {"agent": "scope", "rw": "read", "input": {"message": "string", "case_id": "string?"}, "output": "scope, assumed fields or a follow-up question"},
    "collect_evidence": {"agent": "evidence", "rw": "read", "input": {"scope": "object", "route": "S1|S2"}, "output": "case with four source snapshots"},
    "compute_variance": {"agent": "variance", "rw": "read", "input": {"case_id": "string"}, "output": "variance amount and state"},
    "close_readiness": {"agent": "variance", "rw": "read", "input": {"period": "string", "case_id": "string?"}, "output": "report status and open items"},
    "start_investigation": {"agent": "investigator", "rw": "read", "input": {"case_id": "string"}, "output": "investigation with proof items"},
    "route_controls": {"agent": "governance", "rw": "read", "input": {"route": "S1|S2|S3"}, "output": "path and open decisions"},
    "trace": {"agent": "governance", "rw": "read", "input": {"case_id": "string"}, "output": "stored event count"},
    "draft_proposal": {"agent": "approval", "rw": "local-draft", "input": {"case_id": "string"}, "output": "proposal awaiting approval"},
}
NOT_TOOLS = ["sap.post", "approval.decide", "approval.execute", "fixture.mutate", "investigation.resolve"]


@dataclass
class Context:
    store: Store
    runtime: object
    investigator: object
    approval: object
    ensure: Callable[[], None]


def plan_for(message: str, case: dict | None = None) -> dict:
    text = (message or "").lower().strip()
    steps: list[tuple[str, str, str]] = []
    if "post" in text and any(word in text for word in ("journal", "sap", "entry", "posting")):
        intent = "refused_write"
    elif text.startswith("investigate") or "investigat" in text:
        intent = "investigate"
        steps = [("investigator", "start_investigation", "Find the document that explains the variance")]
    elif "propos" in text or "adjust" in text:
        intent = "propose"
        steps = [("approval", "draft_proposal", "Draft a local variance-marker proposal for approval")]
    elif any(word in text for word in ("control", "route", "gateway", "architecture", "governance")) and "reconcil" not in text:
        intent = "explain_route"
        steps = [("governance", "route_controls", "Explain the route, controls and open decisions")]
    elif any(word in text for word in ("report", "close", "ready")) and "reconcil" not in text:
        intent = "close_readiness"
        steps = [("variance", "close_readiness", "Check whether the period can close")]
    else:
        intent = "reconcile"
        steps = [("scope", "resolve_scope", "Resolve period, company code, ledger and route"),
                 ("evidence", "collect_evidence", "Read the four source snapshots"),
                 ("variance", "compute_variance", "Compute S/4HANA minus Central Finance"),
                 ("variance", "close_readiness", "Build the report and check close readiness"),
                 ("governance", "trace", "Attach the stored event trail")]
    return {
        "plan_id": f"plan-{uuid.uuid4().hex[:8]}", "intent": intent, "message": message, "synthetic": True, "label": LABEL,
        "status": "planned", "case_id": (case or {}).get("case_id"),
        "steps": [{"step_id": f"s{i + 1}", "agent": agent, "tool": tool, "purpose": purpose, "rw": TOOLS[tool]["rw"], "status": "pending", "summary": "", "view": next(c["view"] for c in AGENT_CARDS if c["id"] == agent)}
                  for i, (agent, tool, purpose) in enumerate(steps)],
    }


def _finish(step, status, summary):
    step["status"], step["summary"] = status, summary


def run_plan(ctx: Context, plan: dict, scenario: str = "S1", user_id: str = "finance.user") -> dict:
    store = ctx.store
    case = store.case(plan["case_id"]) if plan.get("case_id") else None
    state = {"case": case, "scope": case["scope"] if case else None, "result": None, "case_id": plan.get("case_id")}
    if plan["intent"] == "refused_write":
        plan["status"] = "blocked"
        plan["blocked_reason"] = "Posting to SAP is not an agent action. This demo's SAP access is simulated and read-only; a local marker needs a proposal and a separate finance approval."
        return plan
    for step in plan["steps"]:
        step["status"] = "running"
        try:
            _run_step(ctx, plan, step, state, scenario, user_id)
        except Denied as exc:
            _finish(step, "blocked", str(exc))
            plan["status"] = "blocked"
            break
        if step["status"] == "held":
            plan["status"] = "needs_input"
            break
    else:
        plan["status"] = "done"
    for step in plan["steps"]:
        if step["status"] in ("pending", "running"):
            step["status"] = "skipped"
    plan["case_id"] = state["case_id"]
    store.set_state("last_plan", plan)
    return plan


def _need_case(state):
    if not state["case_id"] or not state["case"]:
        raise Denied("Run a reconciliation first so there is a case to work on.")


def _run_step(ctx, plan, step, state, scenario, user_id):
    store, tool = ctx.store, step["tool"]
    if tool == "resolve_scope":
        parsed, assumed, follow_up = request_for_demo(plan["message"], state["scope"])
        if follow_up:
            _finish(step, "held", follow_up)
            return
        if parsed["period"] not in store.available_periods() or parsed["company_code"] != "1000" or parsed["ledger"] != "0L":
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
        _finish(step, "done", f"{variance.get('state', 'unknown')}" + (f" · variance {int(amount):,} USD" if amount is not None else " · no comparable amount"))
    elif tool == "close_readiness":
        period = (state["scope"] or {}).get("period") or (state.get("parsed") or {}).get("period") or "2026-11"
        events = store.events(state["case_id"]) if state["case_id"] else None
        report = build_report(store, period, state["case"], events)
        summary = report["summary"]
        state["period"] = period
        _finish(step, "done", f"{summary['status'].replace('_', ' ').title()} · variance {summary['variance']:,} USD · {summary['open_items']} open items · unexplained {summary['unexplained']:,} USD")
        step["ref"] = {"period": period}
    elif tool == "trace":
        _need_case(state)
        _finish(step, "done", f"{len(store.events(state['case_id']))} stored events for {state['case_id']}.")
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


def invoke_tool(ctx: Context, name: str, args: dict) -> dict:
    """MCP-style single tool call. Only registered read tools are reachable."""
    if name not in TOOLS or name in ("plan", "draft_proposal", "start_investigation", "collect_evidence"):
        raise Denied("Tool is not available for direct calls")
    message = args.get("message") or ""
    case = ctx.store.case(args["case_id"]) if args.get("case_id") else None
    if name == "resolve_scope":
        plan = plan_for(message or "reconcile", case)
        plan["steps"] = [s for s in plan["steps"] if s["tool"] == "resolve_scope"]
    elif name == "close_readiness":
        plan = plan_for("report", case)
        plan["steps"][0]["tool"] = "close_readiness"
        plan["message"] = f"report {args.get('period', '')}"
        if args.get("period"):
            case = case or {"scope": {"period": args["period"]}}
            plan["case_id"] = (case or {}).get("case_id")
    elif name == "route_controls":
        plan = plan_for("route controls", case)
    else:
        plan = plan_for("trace", case)
        plan["steps"] = [{"step_id": "s1", "agent": TOOLS[name]["agent"], "tool": name, "purpose": name, "rw": "read", "status": "pending", "summary": "", "view": "run"}]
    return run_plan(ctx, plan, args.get("scenario", "S1"), args.get("user_id", "finance.user"))


def catalog() -> dict:
    return {"label": LABEL, "agents": AGENT_CARDS, "tools": [{"name": n, **t} for n, t in TOOLS.items()], "not_tools": NOT_TOOLS}
