# Period contract, matching evidence and manual posting guidance

## One selected period
`selected_period = YYYY-MM` is a single value in the React app (`period` in `frontend/src/App.jsx`, helpers in `frontend/src/period.js`).
The header selector, the worklist rows, the Entry page, the ask bars, the Agents area and the detailed report all read and write it.

- Initial value: a valid `?period=` in the URL, else the value stored for this browser tab, else November 2026 (only when nothing was ever selected).
- Every agent request carries it (`period` on `/api/agent/plan`, `agent_plan` and `select_period` actions in Streamlit).
- Precedence: a period named in the request text wins for that request and the selector then follows it. The effective period is shown before the request runs.
- A plan keeps the period it was made for (`effective_period`, `period_source`). If the selection changes afterwards, the plan is flagged as stale instead of being shown as current.
- A late response for an earlier selection is ignored; a stored case for another period is never reused (`case_for_period`).
- A period without data shows `NO DATA AVAILABLE FOR <MONTH YEAR>`. No other month is substituted.

## Variance and matching
`Variance = S/4HANA balance minus Central Finance balance` for one company code, ledger, currency and period. Positive means S/4HANA is higher.
Amounts are whole US dollars held as integers, so the arithmetic is exact. `poc/recon_report.py` returns `matching.rows` and `matching.totals`; the row differences add up to the summary variance (`totals.reconciles`) and the UI shows that check.
Statuses: MATCHED, UNMATCHED_SOURCE, UNMATCHED_TARGET, AMOUNT_MISMATCH, TIMING_DIFFERENCE, DUPLICATE, REQUIRES_REVIEW.

## What is synthetic
Every balance, document reference and matching row is synthetic. Each report carries `DATA SOURCE: SYNTHETIC / DEMONSTRATION`, `SAP ACCESS: NOT CONNECTED / NOT VERIFIED` and `EXECUTION MODE: READ-ONLY PROPOSED WORKFLOW`. Fiscal year and period assume a calendar fiscal year and are not read from SAP.

## Manual SAP posting guidance
`poc/sap_guidance.py` lists the Fiori apps (F0718 Post General Journal Entries, F0717/F0717A Manage Journal Entries, F2547A Verify General Journal Entries for Requester), the five-step manual workflow and a per-cause recommendation. Most causes (timing, replication, mapping, duplicate) are fixed at the source and need no journal entry. The guide never proposes accounts or amounts and shows no document number.
App availability, authorization and release applicability for S/4HANA 2023 Private Edition are **NOT_VERIFIED**: the SAP Help pages could not be read in full here, so confirm each app in the SAP Fiori Apps Reference Library for your release and roles.

## Checks
`tests/test_period_sync.py`, `scripts/qa_period_sync.py` (web) and `scripts/qa_period_sync_streamlit.py` (Streamlit).
