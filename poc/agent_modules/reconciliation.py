"""Reconciliation agent module: month-end S/4HANA versus Central Finance reconciliation. Implementation lives in poc/agents.py."""
from __future__ import annotations

from .. import agents as A
from ..cockpit import AgentModule


def _catalog() -> dict:
    return {**A.catalog(), "references": []}


def _run(ctx, message, scenario, case_id, period):
    case = A.case_for_period(ctx.store, case_id, period)
    return A.run_plan(ctx, A.plan_for(message, case), scenario, "finance.user", {"selected_period": period} if period else None)


ONTOLOGY = {
    "classes": [
        {"id": "reconciliation.SourceSnapshot", "label": "Source snapshot", "kind": "entity", "description": "A period's balances from one source: S/4HANA, Central Finance, BW or Databricks, with freshness.", "properties": ["source", "balance", "freshness", "evidence id"], "sap_term": "S/4HANA G/L balances; Central Finance; BW", "sap_status": "DEMO_ONLY", "sources": [], "where": {"tab": "business", "label": "Close & reconcile"}},
        {"id": "reconciliation.Variance", "label": "Variance", "kind": "measure", "description": "S/4HANA balance minus Central Finance balance for one company code, ledger, currency and period. Positive means S/4HANA is higher.", "properties": ["amount", "state", "formula"], "sap_term": "Reconciliation difference", "sap_status": "DEMO_ONLY", "sources": [], "where": {"tab": "business", "label": "Close & reconcile"}},
        {"id": "reconciliation.ReconcilingItem", "label": "Reconciling item", "kind": "entity", "description": "A document-level difference that explains part of the variance, with a cause, reason code and aging.", "properties": ["document id", "category", "reason code", "difference", "age"], "sap_term": "Open item", "sap_status": "SAP_TERM", "sources": [], "where": {"tab": "business", "label": "Detailed report"}},
        {"id": "reconciliation.Account", "label": "G/L account", "kind": "entity", "description": "The ledger account a reconciling item sits on.", "properties": ["account", "name"], "sap_term": "G/L account", "sap_status": "SAP_TERM", "sources": []},
        {"id": "reconciliation.JournalDocument", "label": "Journal document", "kind": "entity", "description": "A synthetic accounting document compared between S/4HANA and Central Finance.", "properties": ["document id", "type", "posting date", "amount"], "sap_term": "Accounting document", "sap_status": "SAP_TERM", "sources": []},
        {"id": "reconciliation.MatchingRow", "label": "Matching row", "kind": "artifact", "description": "One row of matching evidence with a status such as MATCHED or TIMING_DIFFERENCE. The rows add up to the variance.", "properties": ["matching key", "source ref", "target ref", "rule", "status"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": [], "where": {"tab": "business", "label": "Detailed report, Matching details"}},
        {"id": "reconciliation.CloseReadiness", "label": "Close readiness", "kind": "measure", "description": "Balanced, within tolerance, explained, exception or hold: whether the period can proceed to a person's approval.", "properties": ["status", "explained %", "open items"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "reconciliation.Investigation", "label": "Investigation", "kind": "process", "description": "A bounded comparison of Central Finance and S/4HANA documents that finds the cause and its proof.", "properties": ["case", "profile", "proof items"], "sap_term": "AIF error handling (reprocess)", "sap_status": "SAP_TERM", "sources": []},
        {"id": "reconciliation.VarianceProposal", "label": "Variance proposal", "kind": "artifact", "description": "A local draft a person approves as a marker. A real correction is posted manually in SAP (see the SAP posting guide).", "properties": ["amount", "payload hash", "status"], "sap_term": "Post General Journal Entries (F0718), manual", "sap_status": "SAP_TERM", "sources": [], "where": {"tab": "business", "label": "Close & reconcile"}},
    ],
    "relations": [
        {"from": "reconciliation.SourceSnapshot", "to": "CompanyCode", "label": "belongs to", "kind": "has"},
        {"from": "reconciliation.SourceSnapshot", "to": "FiscalPeriod", "label": "for", "kind": "scoped"},
        {"from": "reconciliation.SourceSnapshot", "to": "reconciliation.Variance", "label": "compared into", "kind": "derives"},
        {"from": "reconciliation.Variance", "to": "FiscalPeriod", "label": "for", "kind": "scoped"},
        {"from": "reconciliation.ReconcilingItem", "to": "reconciliation.Variance", "label": "explains", "kind": "explains"},
        {"from": "reconciliation.MatchingRow", "to": "reconciliation.Variance", "label": "adds up to", "kind": "explains"},
        {"from": "reconciliation.ReconcilingItem", "to": "reconciliation.Account", "label": "sits on", "kind": "has"},
        {"from": "reconciliation.ReconcilingItem", "to": "reconciliation.JournalDocument", "label": "documented by", "kind": "has"},
        {"from": "reconciliation.Variance", "to": "reconciliation.CloseReadiness", "label": "decides", "kind": "derives"},
        {"from": "reconciliation.Investigation", "to": "reconciliation.ReconcilingItem", "label": "finds cause of", "kind": "explains"},
        {"from": "reconciliation.VarianceProposal", "to": "reconciliation.Variance", "label": "proposes a marker for", "kind": "proposes"},
        {"from": "ApprovalMarker", "to": "reconciliation.VarianceProposal", "label": "records decision on", "kind": "guards"},
    ],
}
TOOL_CONCEPTS = {
    "plan": {"reads": [], "produces": []},
    "resolve_scope": {"reads": ["CompanyCode", "Ledger", "FiscalPeriod", "Currency"], "produces": []},
    "collect_evidence": {"reads": ["reconciliation.SourceSnapshot"], "produces": ["FlowEvent"]},
    "compute_variance": {"reads": ["reconciliation.SourceSnapshot"], "produces": ["reconciliation.Variance"]},
    "close_readiness": {"reads": ["reconciliation.Variance", "reconciliation.ReconcilingItem", "reconciliation.MatchingRow"], "produces": ["reconciliation.CloseReadiness"]},
    "start_investigation": {"reads": ["reconciliation.ReconcilingItem", "reconciliation.JournalDocument"], "produces": ["reconciliation.Investigation"]},
    "route_controls": {"reads": ["McpServer"], "produces": []},
    "trace": {"reads": ["FlowEvent"], "produces": []},
    "draft_proposal": {"reads": ["reconciliation.Variance"], "produces": ["reconciliation.VarianceProposal"]},
}

MODULE = AgentModule(
    id="reconciliation", name="Reconciliation Agent", family_label="Reconciliation agent", short_name="Close & reconcile",
    blurb="Worklist, variance and the detailed report.", icon="▦",
    tab={"id": "business", "label": "Close & reconcile", "short": "Close", "icon": "▦"}, renderer="builtin:reconciliation",
    routing_words=[r"reconcil\w*", "variance", "variances", "close", "central finance", "cfin", "journal", "journals", "period-end", "exception", "exceptions"], routing_priority=100,
    ask_template="Reconcile {period} company code 1000 ledger 0L USD", examples=["Reconcile {period} company code 1000 ledger 0L USD", "Investigate this variance", "Explain the route controls", "Post a journal entry to SAP for {period}"],
    catalog=_catalog, run=_run, ontology=lambda: ONTOLOGY, tool_concepts=TOOL_CONCEPTS, default=True,
    output={"screen_name": "Close & reconcile", "open_label": "Open in Close & reconcile", "detail_label": "Open the detailed reconciliation report"},
    architecture={"route": "Selected scenario (S1, S2 or S3: Apigee MCP/API, with AgentCore Gateway in front in S2) (gateway, domain MCP, SAP BAIP, S/4HANA, Central Finance, BW) plus Databricks", "data": "poc/history.py and poc/recon_report.py (synthetic)", "hosting": "Agent runtime and MCP hosting are chosen on the Architecture pages; they apply to every module"},
)
