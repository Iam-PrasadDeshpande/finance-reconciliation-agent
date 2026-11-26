"""SAP Accrual Posting Agent module (custom imitation of SAP's standard Accounting Accruals Agent). Implementation lives in
poc/accrual_agents.py (agents, workflow actions, view), poc/accrual_engine.py (calculations, simulated LLM, reconciliation) and poc/accrual_data.py."""
from __future__ import annotations

from .. import accrual_agents as AG
from ..cockpit import AgentModule

ONTOLOGY = {
    "classes": [
        {"id": "accruals.AccrualItem", "label": "Accrual candidate", "kind": "entity", "description": "An open commitment, receipt, service or contract that may need an accrual at period end, per company code.", "properties": ["type", "reference", "vendor", "company code", "values"], "sap_term": "Accrual object (purchase order, service entry sheet, manual accrual)", "sap_status": "DOCUMENTED", "sources": ["AC4", "AC5", "AC6"]},
        {"id": "accruals.PolicyHandbook", "label": "Accrual policy handbook", "kind": "artifact", "description": "The plain-language policy the agent works from: which expenses to accrue, how, which accounts, when to reverse.", "properties": ["version", "clauses"], "sap_term": "Accrual policy handbook", "sap_status": "DOCUMENTED", "sources": ["AC2"]},
        {"id": "accruals.SourceDocument", "label": "Source document", "kind": "artifact", "description": "Unstructured evidence such as an engagement letter or a vendor e-mail. Its content is untrusted input.", "properties": ["document id", "kind", "text"], "sap_term": "", "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "accruals.PolicyCheck", "label": "Accrual policy check", "kind": "rule", "description": "Materiality, duplicate, cost center, approved account and confidence checks.", "properties": ["rule", "result"], "sap_term": "", "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "accruals.AccrualProposal", "label": "Accrual proposal line", "kind": "artifact", "description": "One proposed accrual with amount, basis, handbook clause, confidence, flags and the reasoning shown to the reviewer.", "properties": ["amount", "basis", "clause", "confidence", "status"], "sap_term": "Proposed journal entry line", "sap_status": "DOCUMENTED", "sources": ["AC1", "AC2"]},
        {"id": "accruals.JournalDraft", "label": "Accrual journal draft", "kind": "artifact", "description": "A balanced journal for one company code built from the accepted lines, with a posting date and a reversal date.", "properties": ["rows", "hash", "posting date", "reversal date"], "sap_term": "Journal entry", "sap_status": "SAP_TERM", "sources": []},
        {"id": "accruals.PostedDocument", "label": "Posted accrual document (simulated)", "kind": "artifact", "description": "The document written to the local synthetic ledger after approval. No SAP system is changed.", "properties": ["document number", "total", "replicated"], "sap_term": "", "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "accruals.Reversal", "label": "Accrual reversal", "kind": "artifact", "description": "The opposite document scheduled for the first day of the next period.", "properties": ["date", "total"], "sap_term": "Automatic reversal posting", "sap_status": "DOCUMENTED", "sources": ["AC4", "AC7"]},
        {"id": "accruals.LedgerReconciliation", "label": "Reconciliation of posted entries", "kind": "process", "description": "Ties posted documents to approved lines, the accrual account, the reversal and Central Finance.", "properties": ["checks", "status"], "sap_term": "", "sap_status": "DEMO_ONLY", "sources": []},
    ],
    "relations": [
        {"from": "accruals.AccrualItem", "to": "CompanyCode", "label": "belongs to", "kind": "has"},
        {"from": "accruals.PolicyHandbook", "to": "accruals.AccrualProposal", "label": "governs", "kind": "guards"},
        {"from": "accruals.SourceDocument", "to": "accruals.AccrualProposal", "label": "evidences", "kind": "explains"},
        {"from": "accruals.AccrualItem", "to": "accruals.AccrualProposal", "label": "becomes", "kind": "derives"},
        {"from": "accruals.PolicyCheck", "to": "accruals.AccrualProposal", "label": "checks", "kind": "guards"},
        {"from": "accruals.AccrualProposal", "to": "accruals.JournalDraft", "label": "accepted lines form", "kind": "derives"},
        {"from": "ApprovalMarker", "to": "accruals.JournalDraft", "label": "records approval of", "kind": "guards"},
        {"from": "accruals.JournalDraft", "to": "accruals.PostedDocument", "label": "is posted as", "kind": "derives"},
        {"from": "accruals.PostedDocument", "to": "accruals.Reversal", "label": "is reversed by", "kind": "derives"},
        {"from": "accruals.LedgerReconciliation", "to": "accruals.PostedDocument", "label": "reconciles", "kind": "explains"},
        {"from": "accruals.PostedDocument", "to": "FiscalPeriod", "label": "posted in", "kind": "scoped"},
    ],
}
TOOL_CONCEPTS = {
    "plan": {"reads": [], "produces": []},
    "get_accrual_candidates": {"reads": ["accruals.AccrualItem"], "produces": ["FlowEvent"]},
    "get_prior_accruals": {"reads": ["accruals.PostedDocument"], "produces": ["FlowEvent"]},
    "read_source_documents": {"reads": ["accruals.SourceDocument"], "produces": ["FlowEvent"]},
    "interpret_policy": {"reads": ["accruals.PolicyHandbook"], "produces": []},
    "calculate_accrual": {"reads": ["accruals.AccrualItem", "accruals.PolicyHandbook"], "produces": ["accruals.AccrualProposal"]},
    "estimate_accrual": {"reads": ["accruals.AccrualItem", "accruals.SourceDocument"], "produces": ["accruals.AccrualProposal"]},
    "check_accrual_policy": {"reads": ["accruals.AccrualProposal"], "produces": ["accruals.PolicyCheck"]},
    "draft_accrual_journal": {"reads": ["accruals.AccrualProposal"], "produces": ["accruals.JournalDraft"]},
    "reconcile_ledger_entries": {"reads": ["accruals.PostedDocument", "accruals.Reversal"], "produces": ["accruals.LedgerReconciliation", "FlowEvent"]},
}

MODULE = AgentModule(
    id="accruals", name="Accrual Posting Agent", family_label="Accrual posting agent", short_name="Accruals",
    blurb="Prepares accruals of all types per company code, then review, approval, simulated posting and reconciliation.", icon="◈",
    tab=None, renderer="generic",
    routing_words=["accrual", "accruals", "accrue", "accrued", "accruing", "deferral", "deferrals"], routing_priority=150,
    ask_template="Prepare accruals for {period}", examples=AG.EXAMPLES,
    catalog=AG.catalog_domain, run=AG.run_plan, ontology=lambda: ONTOLOGY, view=AG.view, actions=AG.ACTIONS, tool_concepts=TOOL_CONCEPTS,
    options=AG.OPTIONS, workflow=True,
    output={"screen_name": "Accrual workflow", "open_label": "Open the accrual workflow", "detail_label": "Open the accrual workflow"},
    architecture={"route": "Selected scenario (S1, S2 or S3), then the S/4HANA backend and, for the reconciliation only, Central Finance (existing components; architecture views unchanged)",
                  "data": "Synthetic accrual candidates, documents and a local synthetic ledger. The LLM is simulated. Posting is a human-triggered local entry, not an agent tool and not an SAP write."},
)
