"""Deterministic, evidence-bounded answers for the synthetic finance demo."""
from __future__ import annotations

import re
import uuid
from datetime import datetime
from decimal import Decimal

from .intents import parse_reconciliation

DEFAULT_SCOPE = {"company_code": "1000", "ledger": "0L", "currency": "USD"}
SOURCE_NAMES = {"s4": "S/4HANA", "cfin": "Central Finance", "bw": "BW/4HANA", "databricks": "Databricks"}


def mentioned_period(text: str) -> str | None:
    iso = re.search(r"\b(2025|2026)-(0[1-9]|1[0-2])\b", text)
    if iso:
        return iso.group(0)
    for month in range(1, 13):
        name = datetime(2026, month, 1).strftime("%B").lower()
        match = re.search(rf"\b(?:{name}|{name[:3]})\s+(2025|2026)\b", text)
        if match:
            return f"{match.group(1)}-{month:02d}"
    return None
ARCHITECTURE_TOPICS = {
    "apigee": ("Google Apigee", "Scenario S1 uses the simulated external gateway for inbound policy, route selection, outbound target credentials and an audit decision."),
    "agentcore gateway": ("AgentCore Gateway", "Scenario S2 uses the simulated AWS gateway for inbound policy, target registration, outbound credentials and an audit decision."),
    "aws": ("AWS runtime", "The simulated AgentCore runtime checks workload identity, invokes typed tools, assembles evidence and records component events."),
    "agentcore": ("AgentCore", "The simulated AWS runtime hosts the agent and calls the selected gateway with a scoped identity. The S2 gateway route is modeled separately."),
    "s/4": ("S/4HANA", "The simulated S/4HANA read API supplies the current G/L balance and journal evidence; the restricted posting API can write only a local synthetic document after approval."),
    "sap": ("SAP integration", "The simulated SAP route traverses the selected gateway, domain tool, API Management, destination mapping, backend role and backend API."),
    "central finance": ("Central Finance", "The simulated mapped accounting snapshot is the comparable balance for the deterministic S/4HANA minus Central Finance variance."),
    "cfin": ("Central Finance", "The simulated mapped accounting snapshot is the comparable balance for the deterministic S/4HANA minus Central Finance variance."),
    "bw": ("BW/4HANA", "The simulated BW/4HANA aggregate provides analytic context and freshness; it is not the variance operand."),
    "databricks": ("Databricks", "The simulated SQL Warehouse and Unity Catalog path supplies historical evidence and pipeline freshness; it is not the variance operand."),
    "bdc": ("SAP Business Data Cloud", "BDC is a future reference-only branch in this POC. No live Datasphere, SAP Databricks or Delta Sharing integration is proven."),
    "portkey": ("Portkey", "The simulated model branch routes minimized context through redaction, guardrails and usage logging before the advisory Bedrock response."),
    "bedrock": ("Bedrock", "The simulated Bedrock response is advisory. The reconciliation amount and comparability state come from deterministic Python rules."),
    "approval": ("Approval and posting", "A separate finance decision reaches the controlled executor. It rechecks case state, source freshness, amount and idempotency before any local synthetic journal is created."),
    "integration": ("Integration boundary", "Each tool call traverses a selected gateway and a typed integration boundary. The local function calls expose the intended contract but do not prove tenant connectivity."),
    "api management": ("SAP API Management", "The simulated API Management boundary validates a typed request before direct API or custom iFlow destination routing."),
    "node": ("Node.js frontend", "The Node-built UI renders the architecture and business workspace from typed Python responses and neutralized component events."),
    "python": ("Python backend", "The Python engine owns scope checks, deterministic variance, source freshness, approvals and the SQLite evidence ledger."),
}


def request_for_demo(message: str, scope: dict | None = None) -> tuple[dict | None, list[str], str | None]:
    """Resolve a conversational request against an explicit synthetic scope."""
    parsed = parse_reconciliation(message)
    if "unsupported" in parsed:
        return None, [], parsed["unsupported"]
    if "follow_up" not in parsed:
        return parsed, [], None
    context = {**DEFAULT_SCOPE, **(scope or {})}
    text = message.lower()
    period = mentioned_period(text)
    if not period:
        months = "january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec"
        explicit = re.search(rf"\b(?:20\d{{2}}-(?:0[1-9]|1[0-2])|(?:{months})\s+20\d{{2}})\b", text)
        if explicit:
            return None, [], f"{message[explicit.start():explicit.end()]} is outside the 12-month synthetic history. Choose December 2025 through November 2026."
    period = period or (scope or {}).get("period")
    if not period:
        return None, [], "Which synthetic month should I reconcile? Choose December 2025 through November 2026."
    code = re.search(r"company\s*code\s*(\d{4})", text)
    ledger = re.search(r"ledger\s*([0-9a-z]+)", text)
    currency = re.search(r"\b(?:usd|us dollars?)\b|\$", text)
    resolved = {"company_code": code.group(1) if code else context["company_code"],
                "ledger": ledger.group(1).upper() if ledger else context["ledger"],
                "period": period,
                "currency": "USD" if currency else context["currency"]}
    assumed = [name for name, explicit in (("company code", code), ("ledger", ledger), ("currency", currency)) if not explicit]
    if not mentioned_period(text):
        assumed.append("period")
    return resolved, assumed, None


def trace_question(store, scenario: str, case_id: str | None, kind: str, status: str, details: dict | None = None) -> str:
    trace_case = case_id or f"question-{uuid.uuid4().hex[:10]}"
    actor = "finance.user"
    summary = {"question_type": kind, "synthetic": True}
    store.call(trace_case, scenario, "finance_user", "business_chat", "ask_question", actor, "read", summary,
               lambda: store.call(trace_case, scenario, "business_chat", "context_manager", "resolve_question", actor, "data", summary,
                                  lambda: store.call(trace_case, scenario, "context_manager", "business_chat", "compose_answer", actor, "data", {"answer_status": status, **(details or {})}, lambda: {"status": status})))
    return trace_case


def answer_follow_up(store, approval, message: str, case_id: str | None, scenario: str) -> dict:
    text = message.lower().strip()
    case = store.case(case_id) if case_id else None
    effective_scenario = case["scenario"] if case else scenario
    result = case.get("result") if case else None
    if case and case["status"] != "complete":
        answer = "This synthetic case is still processing. Its architecture trace is available; ask again when the report is complete."
        kind, status, extra = "case_status", "pending", {}
    elif re.match(r"^(?:please\s+|can you\s+)?(?:post|book|write|enter|create)\b.*\b(?:journal|entry|sap|posting)\b", text):
        answer = "This demo does not post to SAP. Its SAP access is simulated and read-only; a local synthetic journal can exist only after a comparable case, a proposal and a separate finance approval."
        kind, status, extra = "posting_refused", "refused", {}
    elif any(word in text for word in ("propose", "adjust")):
        if not case:
            answer = "Run a reconciliation first. A proposal can be created only from a completed, comparable synthetic case with a nonzero variance."
            kind, status, extra = "proposal", "needs_case", {}
        else:
            try:
                proposal = approval.propose(case_id)
                answer = f"Synthetic proposal {proposal['proposal_id']} is awaiting a separate finance approval. No journal has been created."
                kind, status, extra = "proposal", "awaiting_approval", {"proposal": proposal}
            except Exception as exc:
                answer = f"No proposal was created: {exc}."
                kind, status, extra = "proposal", "denied", {}
    elif any(term in text for term in ("investigation", "proof dossier", "missing document", "document comparison")):
        records = [item for item in store.investigations() if item["case_id"] == case_id or (item.get("after") or {}).get("case_id") == case_id] if case_id else []
        if records:
            latest = records[0]
            diagnosis = latest.get("diagnosis") or {}
            comparison = next((item["data"] for item in latest["proof"] if item["step_id"] == "compare"), None)
            missing = [row for row in (comparison or {}).get("documents", []) if row["s4_amount"] != row["cfin_amount"]]
            detail = f" Evidence points to {missing[0]['document_id']} ({missing[0]['s4_amount'] - missing[0]['cfin_amount']:,} USD difference)." if missing else ""
            after = latest.get("after")
            outcome = f" The after-run variance is {int(after['variance']['amount']):,} USD." if after and after["variance"]["amount"] is not None else ""
            answer = f"Investigation {latest['investigation_id']} is {latest['status']}: {diagnosis.get('classification','still running').replace('_',' ')}. {latest.get('reason') or 'Evidence is being checked.'}{detail}{outcome} The proof dossier contains {len(latest['proof'])} evidence items."
            kind, status, extra = "investigation_status", "answered", {"investigation_id": latest["investigation_id"], "proof_count": len(latest["proof"])}
        else:
            answer = "No document investigation is recorded for this case. Run a comparable November 2026 reconciliation, then ask me to investigate the variance."
            kind, status, extra = "investigation_status", "needs_case", {}
    elif any(term in text for term in ("s1 vs s2", "s1 and s2", "compare gateways", "compare scenarios", "apigee versus", "apigee vs")):
        answer = "S1 routes the typed tool request through the simulated external Apigee boundary. S2 routes it through the simulated AWS AgentCore Gateway. Both reach the same finance tools and deterministic reconciliation rules; neither route has live tenant proof."
        kind, status, extra = "scenario_comparison", "answered", {}
    elif any(term in text for term in ("limitation", "live gate", "risk", "production ready", "real system", "arbitrary company")):
        answer = "This is a local synthetic simulator. It covers one seeded finance scope and 12 months. G1–G7 remain open for live identity, gateway, SAP authorization, source rules, approval, privacy and trace evidence; no vendor tenant or production posting is connected."
        kind, status, extra = "limitations", "answered", {}
    elif "fresh" in text and result:
        sources = result.get("sources") or {}
        answer = "Source freshness: " + "; ".join(f"{SOURCE_NAMES.get(key,key)} is {value['freshness']}" for key,value in sources.items()) + ". A stale source prevents a comparable result and a proposal."
        kind, status, extra = "freshness", "answered", {}
    elif ("annual" in text or "whole year" in text or "year summary" in text or "all months" in text):
        rows = store.history_overview()
        comparable = [row for row in rows if all(item["freshness"] == "current" for item in row["sources"].values())]
        stale = [row["period"] for row in rows if row not in comparable]
        total = sum(row["sources"]["s4"]["balance"] - row["sources"]["cfin"]["balance"] for row in comparable)
        answer = f"The synthetic year has {len(rows)} monthly periods. {len(comparable)} are comparable, with {total:,} USD in summed monthly variances. Stale periods are {', '.join(stale)}; they are excluded from that sum. This is an illustrative overview, not a consolidated ledger."
        kind, status, extra = "annual_overview", "answered", {"comparable_months": len(comparable), "stale_periods": stale}
    elif "stale" in text and ("which" in text or "period" in text or "month" in text):
        stale = [row["period"] for row in store.history_overview() if any(item["freshness"] != "current" for item in row["sources"].values())]
        answer = f"The synthetic periods with a stale source are {', '.join(stale)}. A run in any of those periods has no comparable amount until the source is refreshed."
        kind, status, extra = "stale_periods", "answered", {"stale_periods": stale}
    elif ("balance" in text or "journal" in text or "document" in text) and mentioned_period(text):
        period = mentioned_period(text)
        if period not in store.available_periods():
            answer = f"{period} is outside the 12-month synthetic history. Choose December 2025 through November 2026."
            kind, status, extra = "history", "limited", {"period": period}
        else:
            detail = store.history_detail(period)
            if "journal" in text or "document" in text:
                ids = [row["journal_id"] for row in detail["journals"]]
                answer = f"{period} has {len(ids)} synthetic journal evidence records: {', '.join(ids)}. They illustrate movements but do not calculate the closing balances."
                kind, status, extra = "journal_evidence", "answered", {"period": period, "journal_count": len(ids)}
            else:
                account = re.search(r"account\s*(\d{6})", text)
                sources = [key for key,name in SOURCE_NAMES.items() if key in text or name.lower() in text]
                rows = [row for row in detail["balances"] if (not account or row["account"] == account.group(1)) and (not sources or row["source"] in sources)]
                if rows:
                    label = f"account {account.group(1)}" if account else "all six seeded accounts"
                    totals = {key: sum(row["balance"] for row in rows if row["source"] == key) for key in SOURCE_NAMES}
                    answer = f"{period} synthetic balance for {label}: " + "; ".join(f"{SOURCE_NAMES[key]} {amount:,} USD" for key,amount in totals.items() if any(row["source"] == key for row in rows)) + "."
                    kind, status, extra = "monthly_balance", "answered", {"period": period, "account": account.group(1) if account else None}
                else:
                    answer = f"No seeded balance matched that account or source in {period}. The demo has six accounts: 110000, 120000, 210000, 310000, 410000 and 510000."
                    kind, status, extra = "monthly_balance", "limited", {"period": period}
    elif "approval" in text and any(term in text for term in ("how", "explain", "work", "architecture")):
        answer = ARCHITECTURE_TOPICS["approval"][1] + " This flow is simulated and requires live G5 proof."
        kind, status, extra = "approval_architecture", "answered", {}
    elif "approval" in text or ("status" in text and case):
        rows = [p for p in store.proposals() if p["case_id"] == case_id] if case else []
        answer = "No proposal is recorded for this case." if not rows else "Approval status: " + "; ".join(f"{p['proposal_id']} is {p['status']}" for p in rows) + "."
        kind, status, extra = "approval_status", "answered", {"proposals": rows}
    elif ("source" in text or "evidence" in text) and result and not (mentioned_period(text) and any(term in text for term in ("balance", "journal", "document"))):
        sources = result.get("sources") or {}
        answer = "Source evidence: " + "; ".join(f"{SOURCE_NAMES.get(key,key)} {Decimal(str(value['balance'])):,.0f} USD, {value['freshness']}, {value['evidence_id']}" for key,value in sources.items()) + "."
        kind, status, extra = "source_evidence", "answered", {"sources": sources}
    elif any(word in text for word in ("why", "variance", "difference", "amount")) and result:
        variance = result.get("variance") or {}
        if variance.get("state") == "comparable":
            s4 = result["sources"]["s4"]["balance"]
            cfin = result["sources"]["cfin"]["balance"]
            answer = f"The comparable variance is {Decimal(str(s4)):,.0f} − {Decimal(str(cfin)):,.0f} = {int(variance['amount']):,.0f} USD. S/4HANA and Central Finance are the two operands; BW/4HANA and Databricks provide context."
        else:
            stale = [SOURCE_NAMES.get(key,key) for key,value in (result.get("sources") or {}).items() if value.get("freshness") != "current"]
            answer = f"There is no comparable amount because the result is {variance.get('state','blocked')}. Review the {', '.join(stale) or 'source'} freshness before proposing an adjustment."
        kind, status, extra = "variance_explanation", "answered", {"variance": variance}
    elif any(word in text for word in ("history", "month", "period", "journal", "document")):
        periods = store.available_periods()
        period = (case or {}).get("scope", {}).get("period", periods[-1])
        count = len(store.history_detail(period)["journals"])
        answer = f"The synthetic SQLite seed spans {periods[0]} through {periods[-1]} across {len(periods)} months. {period} has {count} journal evidence records. These records illustrate the source trail and do not calculate the closing balance."
        kind, status, extra = "history", "answered", {"period": period, "journal_count": count}
    elif "flow" in text or "architecture" in text or "component" in text:
        answer = "The live route is business entry → synthetic identity → AgentCore runtime → selected S1 Apigee or S2 AgentCore gateway → typed domain tool → SAP integration and data sources → context and deterministic reconciliation → advisory model → report. Approval and posting form a separate controlled branch."
        kind, status, extra = "architecture", "answered", {}
    else:
        topic = next(((name, description) for term,(name,description) in ARCHITECTURE_TOPICS.items() if term in text), None)
        if topic:
            answer = f"{topic[0]}: {topic[1]} This is a local simulator; live tenant proof remains open."
            kind, status, extra = "architecture_topic", "answered", {"topic": topic[0]}
        elif result:
            answer = "I cannot verify that question from this synthetic case. I can explain the variance, source evidence, freshness, monthly journals, approval state, or the architecture route."
            kind, status, extra = "evidence_limit", "limited", {}
        else:
            answer = "I cannot verify that question from this synthetic demo. Ask about the architecture or choose a month for reconciliation; a run will then expose the component flow and report."
            kind, status, extra = "evidence_limit", "limited", {}
    trace_case = trace_question(store, effective_scenario, case_id, kind, status, {k:v for k,v in extra.items() if k in ("period", "journal_count", "topic")})
    return {"kind": kind, "status": status, "answer": answer, "case_id": case_id,
            "trace_case_id": trace_case, "scenario": effective_scenario, "synthetic": True, **extra}
