"""Cash and Treasury Assistant module. Implementation lives in poc/treasury_agents.py, poc/treasury.py and poc/treasury_data.py."""
from __future__ import annotations

from .. import treasury as T
from .. import treasury_agents as TA
from ..cockpit import AgentModule


def _run(ctx, message, scenario, case_id, period):
    return TA.run_treasury_plan(ctx, TA.treasury_plan(message), scenario, period, period)


def _view(store, period):
    return {**T.view(period), "proposals": TA.list_proposals(store, period)}


def _decide(store, payload):
    return TA.decide_proposal(store, payload["proposal_id"], payload["approver_id"], bool(payload["approved"]), payload["payload_hash"])


ONTOLOGY = {
    "classes": [
        {"id": "treasury.Bank", "label": "Bank", "kind": "entity", "description": "A house bank that holds one or more accounts. Four synthetic banks.", "properties": ["bank id", "name"], "sap_term": "House bank", "sap_status": "SAP_TERM", "sources": []},
        {"id": "treasury.BankAccount", "label": "Bank account", "kind": "entity", "description": "An account with a currency, a policy minimum and a target balance.", "properties": ["account", "entity", "bank", "currency", "kind", "minimum", "target"], "sap_term": "Bank account (Manage Bank Accounts)", "sap_status": "DOCUMENTED", "sources": ["R1"], "where": {"tab": "treasury", "label": "Cash & treasury"}},
        {"id": "treasury.CashPosition", "label": "Cash position", "kind": "measure", "description": "Per account: opening balance, expected receipts and payments for the as-of day, expected closing, and a status of deficit, idle cash or within policy.", "properties": ["opening", "receipts", "payments", "expected closing", "status", "USD equivalent"], "sap_term": "Cash position (Cash Position app, F1737 not verified for your release)", "sap_status": "DOCUMENTED", "sources": ["R1", "R3"], "where": {"tab": "treasury", "label": "Cash & treasury"}},
        {"id": "treasury.BankStatement", "label": "Bank statement", "kind": "artifact", "description": "The daily statement for an account. Completeness and the opening balance agreeing with the prior closing are checked.", "properties": ["last statement", "gap days", "opening check"], "sap_term": "Bank statement", "sap_status": "DOCUMENTED", "sources": ["R5"]},
        {"id": "treasury.CashFlowItem", "label": "Cash flow item", "kind": "entity", "description": "An expected receipt or payment with a flow type, liquidity item, planning level, scheduled date and a predicted date.", "properties": ["flow type", "liquidity item", "planning level", "amount", "scheduled", "predicted"], "sap_term": "Flow type, liquidity item, planning level", "sap_status": "SAP_TERM", "sources": []},
        {"id": "treasury.PaymentBehaviour", "label": "Payment behaviour", "kind": "measure", "description": "How many days later than the due date a customer segment actually pays. It shifts expected receipts in the forecast.", "properties": ["segment", "days late"], "sap_term": "Actual payment behaviour", "sap_status": "DOCUMENTED", "sources": ["R2"]},
        {"id": "treasury.LiquidityForecast", "label": "Liquidity forecast", "kind": "measure", "description": "Projected balance by currency over 7, 30 or 90 days and the first date it falls below the sum of account minimums.", "properties": ["horizon", "projected balance", "first shortfall"], "sap_term": "Liquidity forecast (Liquidity Forecast Details, F0741 not verified)", "sap_status": "DOCUMENTED", "sources": ["R2", "R4", "R5"], "where": {"tab": "treasury", "label": "Cash & treasury, Forecast"}},
        {"id": "treasury.PolicyRule", "label": "Treasury policy rule", "kind": "rule", "description": "Six rules: minimum balance, no overdraft, bank concentration limit, idle cash, statements, opening balance.", "properties": ["rule id", "threshold", "result"], "sap_term": "Treasury policy rules", "sap_status": "DOCUMENTED", "sources": ["R3"], "where": {"tab": "treasury", "label": "Cash & treasury, Policy"}},
        {"id": "treasury.TransferTemplate", "label": "Transfer template", "kind": "entity", "description": "An allowed from-account and to-account pair with a maximum amount.", "properties": ["template", "from", "to", "currency", "maximum"], "sap_term": "Bank transfer template", "sap_status": "DOCUMENTED", "sources": ["R1", "R3"]},
        {"id": "treasury.TransferProposal", "label": "Transfer proposal", "kind": "artifact", "description": "A drafted recommendation to cover a deficit from an account with cash above target. A person approves; the demo never initiates a transfer.", "properties": ["proposal id", "from", "to", "amount", "template", "payload hash", "status"], "sap_term": "Transfer recommendation (initiated from an approved proposal)", "sap_status": "DOCUMENTED", "sources": ["R1"], "where": {"tab": "treasury", "label": "Cash & treasury, Proposals"}},
        {"id": "treasury.BankRelationship", "label": "Bank relationship", "kind": "measure", "description": "Per bank: accounts, average balance, payment volume, credit line, borrowings, investments and fees.", "properties": ["credit line", "borrowings", "investments", "payment volume", "fees", "share of cash"], "sap_term": "Bank relationship insight", "sap_status": "DOCUMENTED", "sources": ["R1"], "where": {"tab": "treasury", "label": "Cash & treasury, Bank relationships"}},
    ],
    "relations": [
        {"from": "treasury.BankAccount", "to": "treasury.Bank", "label": "held at", "kind": "has"},
        {"from": "treasury.BankAccount", "to": "CompanyCode", "label": "belongs to", "kind": "has"},
        {"from": "treasury.BankAccount", "to": "Currency", "label": "in", "kind": "has"},
        {"from": "treasury.CashPosition", "to": "treasury.BankAccount", "label": "of", "kind": "scoped"},
        {"from": "treasury.CashPosition", "to": "FiscalPeriod", "label": "as of", "kind": "scoped"},
        {"from": "treasury.BankStatement", "to": "treasury.BankAccount", "label": "evidences", "kind": "explains"},
        {"from": "treasury.PolicyRule", "to": "treasury.CashPosition", "label": "governs", "kind": "guards"},
        {"from": "treasury.CashFlowItem", "to": "treasury.LiquidityForecast", "label": "feeds", "kind": "derives"},
        {"from": "treasury.PaymentBehaviour", "to": "treasury.CashFlowItem", "label": "shifts date of", "kind": "derives"},
        {"from": "treasury.CashPosition", "to": "treasury.LiquidityForecast", "label": "opens", "kind": "derives"},
        {"from": "treasury.TransferTemplate", "to": "treasury.BankAccount", "label": "pairs", "kind": "has"},
        {"from": "treasury.TransferProposal", "to": "treasury.CashPosition", "label": "covers a deficit in", "kind": "proposes"},
        {"from": "treasury.TransferProposal", "to": "treasury.TransferTemplate", "label": "uses", "kind": "uses"},
        {"from": "ApprovalMarker", "to": "treasury.TransferProposal", "label": "records decision on", "kind": "guards"},
        {"from": "treasury.BankRelationship", "to": "treasury.Bank", "label": "summarizes", "kind": "scoped"},
    ],
}
TOOL_CONCEPTS = {
    "plan": {"reads": [], "produces": []},
    "check_statement_completeness": {"reads": ["treasury.BankStatement", "treasury.BankAccount"], "produces": ["FlowEvent"]},
    "get_opening_balances": {"reads": ["treasury.BankAccount", "treasury.CashPosition"], "produces": ["FlowEvent"]},
    "identify_surplus_deficit": {"reads": ["treasury.CashPosition"], "produces": []},
    "check_treasury_policy": {"reads": ["treasury.CashPosition", "treasury.PolicyRule"], "produces": []},
    "retrieve_transfer_templates": {"reads": ["treasury.TransferTemplate"], "produces": ["FlowEvent"]},
    "generate_transfer_recommendations": {"reads": ["treasury.CashPosition", "treasury.TransferTemplate"], "produces": ["treasury.TransferProposal"]},
    "forecast_liquidity": {"reads": ["treasury.CashFlowItem", "treasury.PaymentBehaviour", "treasury.CashPosition"], "produces": ["treasury.LiquidityForecast", "FlowEvent"]},
    "bank_relationship_summary": {"reads": ["treasury.Bank", "treasury.BankAccount"], "produces": ["treasury.BankRelationship", "FlowEvent"]},
}

MODULE = AgentModule(
    id="treasury", name="Cash and Treasury Assistant", family_label="Cash and Treasury assistant", short_name="Cash & treasury",
    blurb="Positions, 30-day forecast, bank relationships and transfer proposals.", icon="◍",
    tab={"id": "treasury", "label": "Cash & treasury", "short": "Cash", "icon": "◍"}, renderer="treasury",
    routing_words=["cash", "liquidity", "treasury", "bank", "banks", "forecast", "forecasts", "surplus", "deficit", "overdraft", "overdrafts", "credit line", "credit lines", "idle", "concentration", "funding", "transfer", "transfers", "shortfall", "shortfalls"], routing_priority=50,
    ask_template="What is our cash position for {period}?", examples=["What is our cash position for {period}?", "Propose transfers to cover shortfalls", "Forecast liquidity for the next 30 days", "Show bank fees and credit lines"],
    catalog=TA.catalog_domain, run=_run, ontology=lambda: ONTOLOGY, view=_view, actions={"decide": _decide, "proposals": lambda store, p: TA.list_proposals(store, p.get("period"))},
    tool_concepts=TOOL_CONCEPTS,
    output={"screen_name": "Cash & treasury", "open_label": "Open in Cash & treasury", "detail_label": "Open the detailed cash & treasury view"},
    architecture={"route": "Selected MCP route S1 or S2, then the S/4HANA backend (modelled with the existing S/4HANA components; no new architecture components)", "data": "poc/treasury_data.py (synthetic, deterministic)", "hosting": "Agent runtime and MCP hosting are chosen on the Architecture pages; they apply to every module"},
)
