"""Cash and Treasury Assistant: an orchestrator and three specialist agents over the synthetic treasury data.

Modelled on what SAP documents (see TREASURY_REFS): a Cash and Treasury Orchestration Agent that identifies the intent and
coordinates specialist agents; a Cash Positioning Agent (opening balances, surplus and deficit accounts, transfer templates,
transfer recommendations); a Cash Forecasting Agent (liquidity by currency and entity over a horizon); and a Bank
Relationship Agent (bank accounts, average balances, payment volumes, credit lines, borrowings, investments, bank fees).

Same rules as the reconciliation agents: deterministic, no LLM, in-process MCP-shaped tool calls, no MCP transport, read-only
against the simulated S/4HANA layers. The only write is a local draft proposal. Initiating a bank transfer is NOT a tool:
SAP describes initiation 'based on approved proposals', and a person approves. This demo never initiates a transfer.
"""
from __future__ import annotations

import re
import time
import uuid
from datetime import datetime

from . import treasury as T
from . import treasury_data as D
from .agents import APPROVAL_WORDS, _finish, _max_seq, _trace, case_for_period, plan_for, run_plan
from .questions import mentioned_period
from .sap_guidance import PROVENANCE
from .store import Denied

LABEL = "Simulated agents · deterministic rules · no LLM · in-process MCP-style tool calls · synthetic treasury data · no bank transfer is ever initiated"

TREASURY_REFS = {
    "R1": {"title": "SAP Help Portal: What's New Viewer, Finance Agents", "url": "https://help.sap.com/whats-new/b7eb46e7ca78488a9494995aa0454c4d",
           "supports": "Official descriptions of the Cash Positioning, Bank Relationship and Cash and Treasury Orchestration agents, and their release statements.", "status": "READ 2026-11-25"},
    "R2": {"title": "SAP: Cash and Treasury Assistant", "url": "https://www.sap.com/use-cases/joule-assistant/cash-treasury-ai",
           "supports": "The agent lineup (including the Cash Forecasting Agent), tasks and example use cases.", "status": "READ 2026-11-25"},
    "R3": {"title": "SAP Learning: Automating Cash Management Tasks with the Cash Management Agent", "url": "https://learning.sap.com/courses/reviewing-the-use-of-sap-joule-agents-in-finance/automating-cash-management-tasks-with-the-cash-management-agent_e835e2fb-0398-419e-ab57-550eb149244f",
           "supports": "Daily cash positioning, bank account surplus and deficit insight, bank transfer proposals with templates, treasury policy rules. SAP marks the agent shown as Beta.", "status": "READ 2026-11-25"},
    "R4": {"title": "SAP Community: SAP S/4HANA Cloud Private Edition 2023 FPS03 release highlights", "url": "https://community.sap.com/t5/enterprise-resource-planning-blogs-by-sap/sap-s-4hana-cloud-private-edition-2023-fps03-release-part-1/ba-p/14038835",
           "supports": "Joule Agent for Cash Manager: questions about current cash positions, liquidity forecasts and bank balances, with navigation to the relevant apps. Beta shipment.", "status": "READ 2026-11-25"},
    "R5": {"title": "SAP Community: What's New in SAP Cloud ERP Private 2025 FPS1", "url": "https://community.sap.com/t5/enterprise-resource-planning-blog-posts-by-sap/what-s-new-in-the-sap-cloud-erp-private-2025-fps1-release/ba-p/14335355",
           "supports": "Cash Management Agent: checks bank statement completeness, validates opening balances, prepares cash-flow forecasts. Beta.", "status": "READ 2026-11-25"},
    "R6": {"title": "SAP Fiori Apps Reference Library (Cash Position F1737, Liquidity Forecast Details F0741, Cash Flow Analyzer)", "url": "https://fioriappslibrary.hana.ondemand.com/",
           "supports": "Where a person verifies positions and forecasts in SAP. App IDs come from SAP knowledge base articles.", "status": "NOT_VERIFIED for your release"},
}
TOOL_REFS = {
    "plan": ["R1", "R2"], "check_statement_completeness": ["R5", "R1"], "get_opening_balances": ["R1", "R3"], "identify_surplus_deficit": ["R1", "R3"],
    "check_treasury_policy": ["R3"], "retrieve_transfer_templates": ["R1", "R3"], "generate_transfer_recommendations": ["R1", "R3"],
    "forecast_liquidity": ["R2", "R4", "R5"], "bank_relationship_summary": ["R1", "R2"],
}

AGENT_CARDS = [
    {"id": "treasury_orchestrator", "name": "Cash and Treasury Orchestration Agent", "role": "Identifies your intent and coordinates the specialist agents. It never touches SAP itself.", "mode": "plans only", "view": "plan", "tools": ["plan"], "mcp_server": "tool client (orchestrator)", "layers": [],
     "sap": "SAP: supports cash managers and corporate treasurers with cash and treasury queries; identifies the intent and coordinates the appropriate agents.", "availability": "SAP What's New: integrates with S/4HANA Cloud Private Edition as of release 2025."},
    {"id": "cash_positioning", "name": "Cash Positioning Agent", "role": "Checks opening balances, finds surplus and deficit accounts, retrieves transfer templates and drafts transfer recommendations for a person to approve.", "mode": "read + local draft", "view": "treasury", "tools": ["check_statement_completeness", "get_opening_balances", "identify_surplus_deficit", "check_treasury_policy", "retrieve_transfer_templates", "generate_transfer_recommendations"], "mcp_server": "cash-positioning-mcp", "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"],
     "sap": "SAP: daily cash positioning tasks: check opening balances, identify surplus and deficit accounts, retrieve transfer templates, generate transfer recommendations, initiate bank transfers based on approved proposals. Also flags concentration risk, overdrafts and idle cash.", "availability": "SAP What's New: Private Edition as of release 2025 (an earlier entry says 2025 FPS0 and higher); phased general availability."},
    {"id": "cash_forecasting", "name": "Cash Forecasting Agent", "role": "Projects liquidity by currency and entity over 7, 30 or 90 days and flags the first shortfall.", "mode": "read", "view": "treasury-forecast", "tools": ["forecast_liquidity"], "mcp_server": "cash-forecasting-mcp", "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"],
     "sap": "SAP: projects liquidity by currency and entity across short- to long-term horizons; predicts cash flow timing from actual payment behaviour.", "availability": "NOT_VERIFIED: listed on SAP's Cash and Treasury Assistant page, but no release statement was found in SAP's What's New viewer."},
    {"id": "bank_relationship", "name": "Bank Relationship Agent", "role": "Summarizes each bank: accounts, average balance, payment volume, credit line, borrowings, investments and fees.", "mode": "read", "view": "treasury-banks", "tools": ["bank_relationship_summary"], "mcp_server": "bank-relationship-mcp", "layers": ["Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"],
     "sap": "SAP: real-time insight into bank relationships: bank accounts, average bank account balances, payment volumes, credit lines, borrowings, investments and bank fees.", "availability": "SAP What's New: Private Edition as of release 2025; SAP's product page says early adopter customers only for some editions."},
]
VIEWS = {"treasury": "module:treasury", "treasury-forecast": "module:treasury:forecast", "treasury-banks": "module:treasury:banks"}
VIEW_LABELS = {"module:treasury": "Open Cash & treasury", "module:treasury:forecast": "Open the cash forecast", "module:treasury:banks": "Open bank relationships"}
for _card in AGENT_CARDS:
    _card["kind"] = "orchestrator" if _card["id"] == "treasury_orchestrator" else "specialist"
    _card["view"] = VIEWS.get(_card["view"], _card["view"])
    _card["view_label"] = VIEW_LABELS.get(_card["view"])
CARD = {c["id"]: c for c in AGENT_CARDS}

TOOLS = {
    "plan": {"agent": "treasury_orchestrator", "rw": "none", "input": {"message": "string"}, "output": "Plan"},
    "check_statement_completeness": {"agent": "cash_positioning", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "statements received, opening balance agreement"},
    "get_opening_balances": {"agent": "cash_positioning", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "opening balance and expected flows per bank account"},
    "identify_surplus_deficit": {"agent": "cash_positioning", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "deficit, idle-cash and within-policy accounts"},
    "check_treasury_policy": {"agent": "cash_positioning", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "six policy rules, pass or breach"},
    "retrieve_transfer_templates": {"agent": "cash_positioning", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "allowed from/to account pairs"},
    "generate_transfer_recommendations": {"agent": "cash_positioning", "rw": "local-draft", "input": {"period": "YYYY-MM"}, "output": "draft transfer proposals awaiting a person's approval"},
    "forecast_liquidity": {"agent": "cash_forecasting", "rw": "read", "input": {"period": "YYYY-MM", "horizon_days": "7|30|90"}, "output": "projected balance by currency, first shortfall"},
    "bank_relationship_summary": {"agent": "bank_relationship", "rw": "read", "input": {"period": "YYYY-MM"}, "output": "per-bank credit, borrowings, investments, volumes, fees"},
}
NOT_TOOLS = ["initiate_bank_transfer", "approve_transfer_proposal", "sap.post", "journal.post", "bank_account.change", "fixture.mutate"]
LOCAL_ONLY = ("identify_surplus_deficit", "check_treasury_policy", "generate_transfer_recommendations")  # computed here, no SAP read

INITIATE = re.compile(r"\b(initiate|execute|send|release|trigger|book|make|move|wire|pay)\b")
TRANSFER_OBJ = re.compile(r"\b(transfer|transfers|payment|payments|funds|money|wire)\b")
CLARIFY = ("I can report the cash position, find surplus and deficit accounts, check treasury policy, propose bank transfers for a person to approve, "
           "forecast liquidity for 7, 30 or 90 days, or summarize bank relationships. For example: What is our cash position for November 2026?")
EXAMPLES = ["What is our cash position for November 2026?", "Propose transfers to cover shortfalls", "Forecast liquidity for the next 30 days", "Show bank fees and credit lines"]


def route_domain(message: str) -> str:
    """Which agent module handles a request. Kept for callers of the old name; the cockpit registry decides."""
    from .cockpit import route
    return route(message)


def _step(index, agent, tool, purpose, extra=None):
    step = {"step_id": f"s{index}", "agent": agent, "tool": tool, "purpose": purpose, "rw": TOOLS[tool]["rw"], "status": "pending", "summary": "", "view": CARD[agent]["view"]}
    step.update(extra or {})
    return step


def _horizon(text: str) -> int:
    match = re.search(r"\b(7|30|90)\s*(?:-|\s)?(?:day|days|d)\b", text)
    if match:
        return int(match.group(1))
    if "week" in text:
        return 7
    if "quarter" in text or "three month" in text:
        return 90
    return 30


def treasury_plan(message: str) -> dict:
    text = (message or "").lower().strip()
    steps, note, horizon = [], "", _horizon(text)
    if INITIATE.search(text) and TRANSFER_OBJ.search(text) and not re.search(r"\b(propos\w*|recommend\w*|suggest\w*|cover|show|what|which|how)\b", text):
        intent = "refused_initiate"
    elif APPROVAL_WORDS.search(text):
        intent = "refused_approval"
    elif re.search(r"\b(propos\w*|recommend\w*|suggest\w*)\b", text) or (re.search(r"\bcover\b", text) and re.search(r"shortfall|deficit", text)):
        intent = "transfer_proposal"
        steps = [("cash_positioning", "get_opening_balances", "Read the opening balances and expected flows"), ("cash_positioning", "identify_surplus_deficit", "Find deficit and surplus accounts"),
                 ("cash_positioning", "retrieve_transfer_templates", "Retrieve the allowed bank transfer templates"), ("cash_positioning", "generate_transfer_recommendations", "Draft transfer recommendations for approval")]
    elif re.search(r"\b(forecast\w*|projection|project|next \d+ days?|liquidity|runway)\b", text):
        intent = "forecast"
        steps = [("cash_forecasting", "forecast_liquidity", f"Project liquidity for {horizon} days")]
    elif re.search(r"\b(fee|fees|credit line|credit lines|borrow\w*|investment\w*|relationship\w*|payment volume\w*|wallet|which bank|banks)\b", text):
        intent = "bank_relationships"
        steps = [("bank_relationship", "bank_relationship_summary", "Summarize each bank relationship")]
    elif re.search(r"\b(concentration|policy|overdraft\w*|idle|surplus|deficit|statement\w*|opening balance\w*|position|positioning|cash|balance|balances)\b", text):
        intent = "cash_position"
        steps = [("cash_positioning", "check_statement_completeness", "Check bank statements and opening balances"), ("cash_positioning", "get_opening_balances", "Read the opening balances and expected flows"),
                 ("cash_positioning", "identify_surplus_deficit", "Find deficit and surplus accounts"), ("cash_positioning", "check_treasury_policy", "Check the six treasury policy rules")]
    else:
        intent, note = "clarify", CLARIFY
    return {"plan_id": f"plan-{uuid.uuid4().hex[:8]}", "domain": "treasury", "intent": intent, "message": message, "synthetic": True, "label": LABEL, "status": "planned", "case_id": None,
            "note": note, "adaptations": [], "horizon_days": horizon, "provenance": PROVENANCE,
            "steps": [_step(i + 1, a, t, p) for i, (a, t, p) in enumerate(steps)]}


def _run_chain(store, case_id, scenario, hops, fn):
    def build(i):
        if i == len(hops):
            return fn
        source, target, operation, flow, summary = hops[i]
        inner = build(i + 1)
        return lambda: store.call(case_id, scenario, source, target, operation, "finance.user", flow, summary, inner)
    return build(0)()


def _read_chain(store, case_id, scenario, tool, fn):
    """The same selected-route layers the reconciliation reads use: gateway, domain MCP tool, BAIP, then the S/4HANA backend.
    Only existing components are used, so the architecture views are unchanged."""
    from .gateway import GATES, OPERATION
    s = {"tool": tool}
    hops = [("agentcore_runtime", "mcp_client", "invoke_treasury_tool", "read", s)]
    gates = GATES[scenario]
    for i, p in enumerate(gates):
        caller = "mcp_client" if i == 0 else f"{gates[i - 1]}_audit"
        hops += [(caller, f"{p}_gateway", OPERATION[p], "read", s),
                 (f"{p}_inbound", f"{p}_registry", "target_lookup", "control", s),
                 (f"{p}_registry", f"{p}_outbound", "credential_reference", "identity", {"credential": "synthetic-reference-only"})]
    hops += [(f"{gates[-1]}_outbound", "sap_read_tool", "treasury_read_tool", "read", s),
            ("tool_audit", "api_management", "sap_read", "read", {"backend": "s4"}),
            ("api_management", "destination_mapping", "direct_api", "read", {"backend": "s4"}),
            ("destination_mapping", "s4_roles", "backend_authorize", "identity", {"backend": "s4"}),
            ("s4_roles", "s4_read_api", "read_cash_management", "read", s),
            ("s4_read_api", "s4_live_gl", "read_bank_balances", "read", s)]
    return _run_chain(store, case_id, scenario, hops, fn)


def _money(amount: int, ccy: str) -> str:
    return f"{amount:,} {ccy}"


def _periodlabel(period: str) -> str:
    year, month = period.split("-")
    return datetime(int(year), int(month), 1).strftime("%B %Y")


def _run_tool(ctx, plan, step, state, scenario):
    store, tool, period = ctx.store, step["tool"], state["period"]
    case_id = plan["trace_case_id"]
    if tool == "check_statement_completeness":
        pos = _read_chain(store, case_id, scenario, tool, lambda: T.position(period))
        state["pos"] = pos
        s = pos["statements"]
        bits = [f"{s['complete']} of {s['expected']} bank statements are complete"]
        if s["missing"]:
            bits.append("missing: " + ", ".join(s["missing"]))
        if s["opening_mismatches"]:
            bits.append("opening balance disagrees with prior closing: " + ", ".join("{} ({:+,} {})".format(m["account"], m["difference"], m["ccy"]) for m in s["opening_mismatches"]))
        _finish(step, "done", "; ".join(bits) + ("." if not s["ready"] else ". All opening balances agree."))
    elif tool == "get_opening_balances":
        pos = _read_chain(store, case_id, scenario, tool, lambda: T.position(period))
        state["pos"] = pos
        t = pos["totals"]
        by_ccy = ", ".join("{:,} {}".format(v["opening"], c) for c, v in t["by_currency"].items())
        _finish(step, "done", f"Opening balances for {t['accounts']} accounts as of {pos['as_of']}: {t['usd_opening']:,} USD equivalent ({by_ccy}).")
    elif tool == "identify_surplus_deficit":
        pos = state.get("pos") or T.position(period)
        state["pos"] = pos
        deficit = [a for a in pos["accounts"] if a["status"] == "DEFICIT"]
        idle = [a for a in pos["accounts"] if a["status"] == "IDLE_CASH"]
        state["deficits"] = deficit
        deficit_text = ", ".join("{} short {}".format(a["id"], _money(a["shortfall"], a["ccy"])) for a in deficit)
        idle_text = ", ".join(a["id"] for a in idle)
        text = f"{len(deficit)} deficit account(s)" + (f" ({deficit_text})" if deficit else "")
        text += f", {len(idle)} idle-cash account(s)" + (f" ({idle_text})" if idle else "") + f", {pos['totals']['within_policy']} within policy."
        _finish(step, "done", text)
    elif tool == "check_treasury_policy":
        pos = state.get("pos") or T.position(period)
        state["pos"] = pos
        bad = [c for c in pos["policy_checks"] if c["status"] == "BREACH"]
        detail = "; ".join("{} {}".format(c["rule"], c["detail"]) for c in bad)
        _finish(step, "done", f"{len(bad)} of {len(pos['policy_checks'])} treasury policy rules breached" + (": " + detail if bad else "") + ".")
    elif tool == "retrieve_transfer_templates":
        templates = _read_chain(store, case_id, scenario, tool, lambda: T.transfer_templates(period))
        state["templates"] = templates
        need = {a["id"] for a in state.get("deficits", [])}
        usable = [t for t in templates if t["to"] in need]
        _finish(step, "done", f"{len(templates)} bank transfer templates, {len(usable)} usable for the deficit accounts.")
    elif tool == "generate_transfer_recommendations":
        rec = T.recommendations(period)
        saved = save_proposals(store, period, rec["recommendations"])
        state["recs"] = rec
        state["proposals"] = saved
        total = sum(r["usd_amount"] for r in rec["recommendations"])
        text = f"{len(rec['recommendations'])} transfer recommendation(s) drafted for approval" + (f" ({total:,} USD equivalent)" if rec["recommendations"] else "")
        text += f"; {len(rec['unfunded'])} deficit(s) have no template funding and need a person's decision." if rec["unfunded"] else "."
        _finish(step, "done", text)
    elif tool == "forecast_liquidity":
        horizon = plan["horizon_days"]
        fc = _read_chain(store, case_id, scenario, tool, lambda: T.forecast(period, horizon))
        state["fc"] = fc
        first = [c for c in fc["by_currency"] if c["first_shortfall"]]
        moves = "; ".join("{} {:,} to {:,}".format(c["ccy"], c["opening"], c["closing"]) for c in fc["by_currency"])
        firsts = "; ".join("{} on {}".format(c["ccy"], c["first_shortfall"]["date"]) for c in first)
        text = f"{horizon}-day projection from {fc['as_of']}: {moves}."
        text += f" First shortfall: {firsts}." if first else " No currency falls below its minimum."
        _finish(step, "done", text)
    elif tool == "bank_relationship_summary":
        b = _read_chain(store, case_id, scenario, tool, lambda: T.banks(period))
        state["banks"] = b
        t = b["totals"]
        text = f"{len(b['banks'])} banks: credit drawn {t['credit_drawn']:,} of {t['credit_limit']:,} USD, borrowings {t['borrowings']:,}, investments {t['investments']:,}, fees {t['fees_usd']:,} USD this month."
        if b["over_concentration_limit"]:
            text += f" Over the {b['concentration_limit_pct']}% concentration limit: {', '.join(b['over_concentration_limit'])}."
        _finish(step, "done", text)
    else:
        raise Denied("Unknown treasury tool")


def run_treasury_plan(ctx, plan, scenario="S1", period=None, selector=None):
    store = ctx.store
    plan["selected_period"] = selector
    plan["trace_case_id"] = f"treasury-{plan['plan_id']}"
    plan["orchestrator"] = {"role": "tool client (MCP-style, in-process)", "rule": f"intent {plan['intent']}", "dispatches": len(plan["steps"]), "order": [s["tool"] for s in plan["steps"]]}
    mentioned = mentioned_period((plan.get("message") or "").lower())
    plan["period_source"] = "request" if mentioned else ("selector" if selector else None)
    plan["effective_period"] = None
    plan["references"] = []
    if plan["intent"] in ("refused_initiate", "refused_approval"):
        plan["status"] = "blocked"
        plan["blocked_reason"] = ("Initiating a bank transfer is not an agent action. SAP describes initiation only from an approved proposal, and a person with bank-transfer authorization does it in SAP. "
                                  "This agent can draft a recommendation for approval; nothing was sent." if plan["intent"] == "refused_initiate" else
                                  "Approval is a person's decision, not an agent action. Switch to the finance approver role to decide on a transfer proposal.")
        plan["answer"] = plan["blocked_reason"]
        plan["references"] = [TREASURY_REFS[r] | {"id": r} for r in ("R1", "R3")]
        return plan
    if plan["intent"] == "clarify":
        plan["status"] = "needs_input"
        plan["answer"] = plan["note"]
        return plan
    effective = mentioned or selector
    if not effective:
        plan["status"], plan["answer"] = "needs_input", "Which month should I use? Choose a period, December 2025 through November 2026."
        plan["steps"], plan["orchestrator"]["dispatches"], plan["orchestrator"]["order"] = [], 0, []
        return plan
    if effective not in D.PERIODS:
        label = _periodlabel(effective) if re.fullmatch(r"\d{4}-\d{2}", effective) else effective
        plan["status"], plan["blocked_reason"] = "blocked", f"NO DATA AVAILABLE FOR {label.upper()}. The synthetic treasury data covers December 2025 through November 2026."
        plan["answer"] = f"Stopped: {plan['blocked_reason']} Nothing was changed."
        plan["steps"], plan["orchestrator"]["dispatches"], plan["orchestrator"]["order"] = [], 0, []
        return plan
    state = {"period": effective}
    plan["effective_period"] = effective
    started = time.perf_counter()
    index = 0
    while index < len(plan["steps"]):
        step = plan["steps"][index]
        index += 1
        step["status"] = "running"
        before = _max_seq(store)
        step["started_ms"] = int((time.perf_counter() - started) * 1000)
        step["mcp"] = {"server": CARD[step["agent"]]["mcp_server"], "method": "tools/call (MCP-style, in-process)", "tool": step["tool"], "arguments": {"period": effective, **({"horizon_days": plan["horizon_days"]} if step["tool"] == "forecast_liquidity" else {})}}
        store.thread_state.agent_ctx = {"plan_id": plan["plan_id"], "step_id": step["step_id"]}
        try:
            _run_tool(ctx, plan, step, state, scenario)
        except Denied as exc:
            _finish(step, "blocked", str(exc))
            plan["status"] = "blocked"
        finally:
            store.thread_state.agent_ctx = None
        step["duration_ms"] = int((time.perf_counter() - started) * 1000) - step["started_ms"]
        step["trace"] = _trace(store, before, step["step_id"], plan["plan_id"])
        if step["status"] == "blocked":
            break
        # the orchestrator adapts the plan from what the specialists found
        done_tools = {s["tool"] for s in plan["steps"]}
        if step["tool"] == "identify_surplus_deficit" and state.get("deficits") and plan["intent"] == "cash_position" and "generate_transfer_recommendations" not in done_tools:
            plan["steps"].append(_step(len(plan["steps"]) + 1, "cash_positioning", "retrieve_transfer_templates", "Retrieve templates for the deficit accounts", {"added_by": "deficit accounts found"}))
            plan["steps"].append(_step(len(plan["steps"]) + 1, "cash_positioning", "generate_transfer_recommendations", "Draft transfer recommendations for approval", {"added_by": "deficit accounts found"}))
            plan["adaptations"].append({"after": step["step_id"], "added": "cash_positioning.generate_transfer_recommendations", "because": f"{len(state['deficits'])} deficit account(s) were found"})
        if step["tool"] == "forecast_liquidity" and state["fc"]["shortfall"] and "identify_surplus_deficit" not in done_tools:
            plan["steps"].append(_step(len(plan["steps"]) + 1, "cash_positioning", "identify_surplus_deficit", "See which accounts hold cash above target", {"added_by": "the forecast shows a shortfall"}))
            plan["adaptations"].append({"after": step["step_id"], "added": "cash_positioning.identify_surplus_deficit", "because": "the forecast shows a shortfall, so the agent checks which accounts could fund it"})
    if plan["status"] not in ("blocked", "needs_input"):
        plan["status"] = "done"
    for step in plan["steps"]:
        if step["status"] in ("pending", "running"):
            step["status"] = "skipped"
    plan["orchestrator"]["dispatches"] = len(plan["steps"])
    plan["orchestrator"]["order"] = [s["tool"] for s in plan["steps"]]
    plan["duration_ms"] = int((time.perf_counter() - started) * 1000)
    refs = ["R1", "R2"]
    for s in plan["steps"]:
        for r in TOOL_REFS.get(s["tool"], []):
            if r not in refs:
                refs.append(r)
    plan["references"] = [TREASURY_REFS[r] | {"id": r} for r in sorted(refs)]
    plan["result"] = _result(state)
    plan["result_blocks"] = _blocks(state)
    plan["answer"] = _answer(plan, state)
    ctx.store.set_state("last_plan", plan)
    return plan


def _result(state) -> dict:
    out = {"period": state["period"]}
    pos = state.get("pos")
    if pos:
        out |= {"as_of": pos["as_of"], "totals": pos["totals"], "accounts": pos["accounts"], "policy_checks": pos["policy_checks"], "statements": pos["statements"], "banks_share": pos["banks"]}
    if state.get("recs"):
        out["recommendations"] = state["recs"]["recommendations"]
        out["unfunded"] = state["recs"]["unfunded"]
    if state.get("fc"):
        out["forecast"] = {k: state["fc"][k] for k in ("horizon_days", "as_of", "by_currency", "shortfall", "usd_series", "basis")}
    if state.get("banks"):
        out["banks"] = state["banks"]
    return out


def _blocks(state) -> list[dict]:
    """The result as declarative blocks the cockpit renders for any module (kpis, table, list, note)."""
    blocks = []
    pos = state.get("pos")
    tones = {"DEFICIT": "bad", "IDLE_CASH": "warn", "WITHIN_POLICY": "ok"}
    words = {"DEFICIT": "Deficit", "IDLE_CASH": "Idle cash", "WITHIN_POLICY": "Within policy"}
    if pos:
        t = pos["totals"]
        breached = [c for c in pos["policy_checks"] if c["status"] == "BREACH"]
        blocks.append({"type": "kpis", "items": [
            {"label": "Group cash (USD equivalent)", "value": "{:,}".format(t["usd_opening"])},
            {"label": "Deficit accounts", "value": str(t["deficit"]), "tone": "bad" if t["deficit"] else None},
            {"label": "Idle-cash accounts", "value": str(t["idle"]), "tone": "warn" if t["idle"] else None},
            {"label": "Policy rules breached", "value": "{} of {}".format(len(breached), len(pos["policy_checks"])), "tone": "bad" if breached else None}]})
        blocks.append({"type": "table", "title": "Bank accounts", "columns": [
            {"key": "id", "label": "Account"}, {"key": "ccy", "label": "Ccy"}, {"key": "opening", "label": "Opening", "align": "right", "format": "int"},
            {"key": "expected_closing", "label": "Expected close", "align": "right", "format": "int"}, {"key": "min", "label": "Minimum", "align": "right", "format": "int"},
            {"key": "status", "label": "Status", "tones": tones, "words": words}], "rows": pos["accounts"], "highlight": {"key": "status", "equals": "DEFICIT"}})
        if breached:
            blocks.append({"type": "note", "text": "Policy: " + " · ".join("{} {}".format(c["rule"], c["detail"]) for c in breached), "tone": "warn"})
    if state.get("recs"):
        recs = state["recs"]
        items = []
        for r in recs["recommendations"]:
            line = "{:,} {} {} to {} ({}, {}). {}".format(r["amount"], r["ccy"], r["from_account"], r["to_account"], r["template"], r["policy_rule"], r["reason"])
            items.append(line + (" " + r["caveat"] if r.get("caveat") else ""))
        blocks.append({"type": "list", "title": "Transfer recommendations (drafts for a person to approve)", "items": items or ["None."]})
        if recs["unfunded"]:
            blocks.append({"type": "note", "text": "Not covered by any template: " + ", ".join("{} ({:,} {})".format(u["account"], u["remaining"], u["ccy"]) for u in recs["unfunded"]) + ". A person must decide.", "tone": "bad"})
    if state.get("fc"):
        fc = state["fc"]
        rows = [{"ccy": c["ccy"], "opening": c["opening"], "closing": c["closing"], "net": c["net"], "first": c["first_shortfall"]["date"] if c["first_shortfall"] else "none"} for c in fc["by_currency"]]
        blocks.append({"type": "table", "title": "{}-day liquidity by currency".format(fc["horizon_days"]), "columns": [
            {"key": "ccy", "label": "Ccy"}, {"key": "opening", "label": "Opening", "align": "right", "format": "int"}, {"key": "closing", "label": "Projected close", "align": "right", "format": "int"},
            {"key": "net", "label": "Net", "align": "right", "format": "signed"}, {"key": "first", "label": "First shortfall"}], "rows": rows, "highlight": {"key": "first", "notequals": "none"}})
    if state.get("banks"):
        rows = [{"name": b["name"], "share": "{}%".format(b["share_pct"]), "credit": "{:,} / {:,}".format(b["credit_line_drawn"], b["credit_line_limit"]), "borrowings": b["borrowings"], "investments": b["investments"], "fees": b["fees_total_usd"]} for b in state["banks"]["banks"]]
        blocks.append({"type": "table", "title": "Bank relationships", "columns": [
            {"key": "name", "label": "Bank"}, {"key": "share", "label": "Share", "align": "right"}, {"key": "credit", "label": "Credit drawn / line", "align": "right"},
            {"key": "borrowings", "label": "Borrowings", "align": "right", "format": "int"}, {"key": "investments", "label": "Investments", "align": "right", "format": "int"},
            {"key": "fees", "label": "Fees (USD)", "align": "right", "format": "int"}], "rows": rows})
    return blocks


def _answer(plan, state) -> str:
    if plan["status"] == "blocked":
        blocked = next((s for s in plan["steps"] if s["status"] == "blocked"), None)
        return f"Stopped: {blocked['summary']} Nothing was changed." if blocked else plan.get("blocked_reason", "")
    by = {s["tool"]: s["summary"] for s in plan["steps"] if s["status"] == "done"}
    head = f"{_periodlabel(state['period'])} · as of {D.as_of(state['period']).isoformat()} · synthetic data. "
    parts = [by[t] for t in ("check_statement_completeness", "get_opening_balances", "identify_surplus_deficit", "check_treasury_policy", "retrieve_transfer_templates", "generate_transfer_recommendations", "forecast_liquidity", "bank_relationship_summary") if t in by]
    drafts = bool(state.get("recs") and state["recs"]["recommendations"])
    tail = (" Recommendations are drafts for a person to approve; " if drafts else " ") + "no bank transfer was initiated and SAP was not changed."
    return head + " ".join(parts) + tail


# ---- local draft proposals and the approval marker (never a bank transfer) ----
def _proposals(store) -> dict:
    return store.get_state("treasury_proposals") or {}


def save_proposals(store, period: str, recs: list[dict]) -> list[dict]:
    items = _proposals(store)
    for key in [k for k, v in items.items() if v["period"] == period and v["status"] == "awaiting_approval"]:
        del items[key]
    for rec in recs:
        if rec["proposal_id"] in items:
            continue
        items[rec["proposal_id"]] = {**rec, "period": period, "status": "awaiting_approval", "decided_by": None, "note": "Draft. A person must approve; this app never initiates a transfer."}
    store.set_state("treasury_proposals", items)
    return [v for v in items.values() if v["period"] == period]


def list_proposals(store, period: str | None = None) -> list[dict]:
    return [v for v in _proposals(store).values() if period is None or v["period"] == period]


def decide_proposal(store, proposal_id: str, approver_id: str, approved: bool, payload_hash: str) -> dict:
    if approver_id != "finance.approver":
        raise Denied("The finance approver role is required to decide on a transfer proposal.")
    items = _proposals(store)
    item = items.get(proposal_id)
    if not item:
        raise Denied("Unknown transfer proposal.")
    if item["status"] != "awaiting_approval":
        raise Denied(f"This proposal is already {item['status'].replace('_', ' ')}.")
    if payload_hash != item["payload_hash"] or T.proposal_hash(item["period"], item) != item["payload_hash"]:
        raise Denied("The proposal changed since it was drafted. Review it again.")
    item |= {"status": "approved_marker" if approved else "rejected", "decided_by": approver_id,
             "note": "Local synthetic marker only. No bank transfer was initiated and SAP was not changed." if approved else "Rejected. Nothing was sent."}
    items[proposal_id] = item
    store.set_state("treasury_proposals", items)
    return item


# ---- catalog and the single entry point used by the API and the Streamlit app ----
def catalog_domain() -> dict:
    return {"label": LABEL, "name": "Cash and Treasury Assistant", "agents": AGENT_CARDS, "tools": [{"name": n, **t} for n, t in TOOLS.items()], "not_tools": NOT_TOOLS,
            "examples": EXAMPLES, "references": [{"id": k, **v} for k, v in TREASURY_REFS.items()],
            "note": "Calls are in-process and MCP-shaped; there is no MCP transport. No tool initiates a bank transfer; SAP describes initiation only from an approved proposal."}


def assistant_catalog(recon_catalog: dict | None = None) -> dict:
    """Kept for callers of the old name; the cockpit registry builds the catalog."""
    from .cockpit import catalog
    return catalog()


def run_assistant(ctx, message: str, scenario: str, case_id, period):
    """Kept for callers of the old name: route one request through the cockpit registry."""
    from .cockpit import run
    return run(ctx, message, scenario, case_id, period)
