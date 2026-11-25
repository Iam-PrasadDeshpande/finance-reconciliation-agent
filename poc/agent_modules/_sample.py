"""Scaffold: the smallest complete agent module. Copy this file, rename it without the leading underscore, and replace the content.

It is not an SAP agent and claims nothing about SAP. It exists to show that a new agent needs only this one file (and no change to the
cockpit, the API or the UI): it is loaded only when COCKPIT_SAMPLE_MODULE=1, and the conformance tests run against it.

What a module supplies:  cards (agents) + tools + a runner that returns a plan + an optional Level 1 'ui' view + an ontology fragment.
What it reuses from the cockpit:  period contract, routing, plan/step shape, the selected MCP route chain, provenance, the workbench.
"""
from __future__ import annotations

import time
import uuid

from ..agents import _finish, _max_seq, _trace
from ..questions import mentioned_period
from ..cockpit import AgentModule
from ..sap_guidance import PROVENANCE
from ..store import Denied
from ..treasury_agents import _read_chain
from .. import treasury_data as D

LABEL = "Scaffold agent · deterministic · synthetic · reads through the selected MCP route · no SAP writes"
CARDS = [
    {"id": "sample_orchestrator", "name": "Sample orchestrator", "role": "Plans the request and calls the sample reader.", "mode": "plans only", "view": "plan", "tools": ["plan"], "mcp_server": "tool client (orchestrator)", "layers": [], "kind": "orchestrator"},
    {"id": "sample_reader", "name": "Sample reader", "role": "Reads one synthetic figure for the period through the selected route.", "mode": "read", "view": "module:sample", "view_label": "Open Sample agent", "tools": ["read_sample"], "mcp_server": "sample-mcp",
     "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"], "kind": "specialist"},
]
TOOLS = {"plan": {"agent": "sample_orchestrator", "rw": "none", "input": {"message": "string"}, "output": "Plan"},
         "read_sample": {"agent": "sample_reader", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "one synthetic figure"}}


def _figure(period: str) -> int:
    return 1_000 + 100 * D.period_index(period)


def _run(ctx, message, scenario, case_id, period):
    plan = {"plan_id": f"plan-{uuid.uuid4().hex[:8]}", "domain": "sample", "intent": "read_sample", "message": message, "synthetic": True, "label": LABEL, "status": "planned", "case_id": None, "note": "", "adaptations": [],
            "provenance": PROVENANCE, "selected_period": period, "period_source": None, "effective_period": None, "references": [], "trace_case_id": None,
            "steps": [{"step_id": "s1", "agent": "sample_reader", "tool": "read_sample", "purpose": "Read the sample figure", "rw": "read", "status": "pending", "summary": "", "view": "module:sample"}]}
    plan["trace_case_id"] = f"sample-{plan['plan_id']}"
    plan["orchestrator"] = {"role": "tool client (MCP-style, in-process)", "rule": "intent read_sample", "dispatches": 1, "order": ["read_sample"]}
    mentioned = mentioned_period((message or "").lower())
    plan["period_source"] = "request" if mentioned else ("selector" if period else None)
    period = mentioned or period
    if not period:
        plan["status"], plan["answer"], plan["steps"] = "needs_input", "Choose a period, December 2025 through November 2026.", []
        return plan
    if period not in D.PERIODS:
        plan["status"], plan["steps"] = "blocked", []
        plan["answer"] = "Stopped: NO DATA AVAILABLE FOR " + period + ". Nothing was changed."
        return plan
    plan["effective_period"] = period
    store, step = ctx.store, plan["steps"][0]
    before, started = _max_seq(store), time.perf_counter()
    store.thread_state.agent_ctx = {"plan_id": plan["plan_id"], "step_id": "s1"}
    try:
        value = _read_chain(store, plan["trace_case_id"], scenario, "read_sample", lambda: _figure(period))
        _finish(step, "done", f"Sample figure for {period}: {value:,} (synthetic).")
    except Denied as exc:
        _finish(step, "blocked", str(exc))
        plan["status"] = "blocked"
    finally:
        store.thread_state.agent_ctx = None
    step["mcp"] = {"server": "sample-mcp", "method": "tools/call (MCP-style, in-process)", "tool": "read_sample", "arguments": {"period": period}}
    step["duration_ms"] = int((time.perf_counter() - started) * 1000)
    step["trace"] = _trace(store, before, "s1", plan["plan_id"])
    plan["status"] = "blocked" if plan["status"] == "blocked" else "done"
    plan["answer"] = step["summary"] + " No SAP write was made."
    plan["result_blocks"] = [{"type": "kpis", "items": [{"label": "Sample figure", "value": f"{_figure(period):,}"}]}]
    return plan


def _view(store, period):
    if period not in D.PERIODS:
        raise Denied("NO DATA AVAILABLE FOR THIS PERIOD.")
    return {"period": period, "provenance": PROVENANCE, "ui": {"title": "Sample agent", "subtitle": f"Scaffold view for {period}. Not an SAP agent.", "blocks": [
        {"type": "kpis", "items": [{"label": "Sample figure", "value": f"{_figure(period):,}", "note": "synthetic"}, {"label": "Period index", "value": str(D.period_index(period))}]},
        {"type": "table", "title": "How the figure is built", "columns": [{"key": "part", "label": "Part"}, {"key": "value", "label": "Value", "align": "right", "format": "int"}], "rows": [{"part": "Base", "value": 1000}, {"part": "Per period", "value": 100 * D.period_index(period)}]},
        {"type": "note", "text": "Everything on this screen came from the module's view() as declarative blocks. No UI code was written for it.", "tone": "ok"}]}}


MODULE = AgentModule(
    id="sample", name="Sample Agent (scaffold)", family_label="Sample agent", short_name="Sample agent", blurb="A scaffold module that proves a new agent plugs in with one file.", icon="✱",
    tab={"id": "sample", "label": "Sample agent", "short": "Sample", "icon": "✱"}, renderer="generic", routing_words=["scaffold", "sample agent", "hello cockpit"], routing_priority=10,
    ask_template="Read the scaffold figure for {period}", examples=["Read the scaffold figure for {period}"],
    catalog=lambda: {"label": LABEL, "name": "Sample Agent (scaffold)", "agents": CARDS, "tools": [{"name": n, **t} for n, t in TOOLS.items()], "not_tools": ["sap.post"], "references": [], "examples": [], "note": "Scaffold only."},
    run=_run, view=_view,
    ontology=lambda: {"classes": [{"id": "sample.Figure", "label": "Sample figure", "kind": "measure", "description": "A synthetic number used only to prove the plug-in path.", "properties": ["period", "value"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []}],
                      "relations": [{"from": "sample.Figure", "to": "FiscalPeriod", "label": "for", "kind": "scoped"}]},
    tool_concepts={"plan": {"reads": [], "produces": []}, "read_sample": {"reads": ["FiscalPeriod"], "produces": ["sample.Figure", "FlowEvent"]}},
    output={"screen_name": "Sample agent", "open_label": "Open the Sample agent screen", "detail_label": None},
    architecture={"route": "Selected scenario (S1, S2 or S3: Apigee MCP/API, with AgentCore Gateway in front in S2), then the existing S/4HANA components", "data": "computed in this file (synthetic)", "hosting": "Chosen on the Architecture pages; applies to every module"},
)
