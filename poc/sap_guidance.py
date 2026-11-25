"""Manual SAP posting guidance shown beside a reconciliation. Static, release-neutral text.

Nothing here calls SAP, posts a document or invents a document number. App names and IDs come from SAP Help
Portal and SAP Knowledge Base text for SAP S/4HANA (on-premise, 2023 and later). Availability of each app, the
user's authorization and the organization's approval process are NOT verified by this demo: confirm each app in
the SAP Fiori Apps Reference Library for your exact release and role setup.
"""
from __future__ import annotations

PROVENANCE = {
    "data_source": "SYNTHETIC / DEMONSTRATION",
    "sap_access": "NOT CONNECTED / NOT VERIFIED",
    "execution_mode": "READ-ONLY PROPOSED WORKFLOW",
}

SIGN_CONVENTION = ("Variance = S/4HANA balance minus Central Finance balance, same company code, ledger, currency and period. "
                   "Positive: S/4HANA is higher. Negative: Central Finance is higher. Amounts are whole US dollars (exact integer arithmetic).")

APPS = [
    {"id": "F0718", "name": "Post General Journal Entries", "use": "Enter and post a manual G/L journal entry.",
     "note": "Requires the matching authorization; the app may also start a configured approval workflow."},
    {"id": "F0717 / F0717A", "name": "Manage Journal Entries", "use": "Display, review and follow up on journal entries, including the one you posted.",
     "note": "F0717A is the newer variant; which one appears depends on release and role."},
    {"id": "F2547A", "name": "Verify General Journal Entries – For Requester", "use": "Submit a journal entry for verification where the verification workflow is configured.",
     "note": "Applies only if your organization has set up journal-entry verification."},
]

FIELDS = ["Company code", "Posting date and document date", "Fiscal period (posting period must be open)", "Document type", "Currency",
          "Reference and header text", "G/L accounts, debit and credit amounts (must balance)", "Cost center or profit center where required",
          "Ledger (leading or non-leading) and any ledger-specific rules", "Tax and field-status requirements", "Supporting attachment or reference",
          "Who must approve before posting"]

STEPS = [
    ("Investigate", "Confirm the period, company code, variance, currency, affected accounts, suspected cause and the source and target references."),
    ("Decide if a posting is needed", "Most differences are timing, replication, mapping or duplicate problems that are fixed at the source, not with a journal entry."),
    ("Prepare the entry", "Only for a genuine G/L adjustment, the accountant determines accounts and amounts from policy and documents them with approval. This demo never determines accounts."),
    ("Post manually in SAP", "Open the SAP Fiori launchpad, open Post General Journal Entries (F0718) if you are authorized, enter and check the entry, follow any verification or approval step, then post."),
    ("Record and reconcile again", "Record the SAP accounting document number that SAP returns, refresh the data, re-run this reconciliation and compare before and after."),
]

NOT_DONE = ["This application did not post anything and holds no SAP document number.",
            "No SAP tenant is connected, so no balance here is an SAP balance.",
            "A variance only clears after SAP data is refreshed and the reconciliation is run again."]

# reconciling-item category -> (is a manual G/L entry a candidate, recommended route)
TREATMENT = {
    "timing_cutoff": ("no", "Timing difference. Expected to clear in the next period; no journal entry."),
    "replication_gap": ("no", "Missing in Central Finance. Fix mapping or reprocess the replication, then compare again; no journal entry."),
    "mapping_conflict": ("no", "Mapping error. Correct the Central Finance mapping, reprocess and re-compare; no journal entry."),
    "fx_revaluation": ("conditional", "Currency difference. Normally resolved by the foreign-currency valuation run; a manual entry only if policy allows and the accountant approves."),
    "duplicate_posting": ("no", "Duplicate. Reverse the duplicate at the source after the owner confirms; do not adjust the G/L to hide it."),
    "intercompany": ("conditional", "Intercompany mismatch. Align with the partner company first; post only after both sides agree."),
    "unexplained": ("after_investigation", "Unexplained. Find the document or cause first; a G/L adjustment is possible only if the investigation proves one is required."),
}


def treatment(category: str) -> dict:
    candidate, route = TREATMENT.get(category, ("after_investigation", "Investigate before any correction."))
    return {"manual_journal_entry": candidate, "route": route}


def guide() -> dict:
    return {"apps": APPS, "fields": FIELDS, "steps": [{"title": t, "text": x} for t, x in STEPS], "not_done": NOT_DONE,
            "verification": "App availability, authorization and release applicability are NOT_VERIFIED. Check the SAP Fiori Apps Reference Library for your release."}
