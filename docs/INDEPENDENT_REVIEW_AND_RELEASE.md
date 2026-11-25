# Independent review and Streamlit posting handoff

## Review disposition · 22 November 2026

Two separate read-only reviewers assessed the finance architecture and the UX/Streamlit path. The FI reviewer checked variance, source evidence, authorization and approval invariants. The UX reviewer checked the work center, browser interaction, live trace and upload path. Their findings were implemented and rechecked as follows.

| Finding | Disposition |
| --- | --- |
| Approval used an incomplete source recheck | Rechecks all four source balances, evidence IDs, timestamps, freshness, the Databricks grant and the recomputed signed variance under the store lock. |
| Repeated proposals and callbacks could create inconsistent status or journals | One proposal per case; a new callback ID after a successful post returns the existing receipt; same callback is rejected; concurrent decisions produce one journal. |
| Zero or negative variance policy was unclear | Zero cannot produce a proposal. Negative values are allowed as signed **variance markers**. The marker is not a balanced FI posting. |
| Denied company code could appear in the architecture trace | Neutral projection strips structured scope and recognized entity/mapping strings; denied `2000` case is tested. |
| Diagram called sequential reads parallel | The UI and documentation now state sequential reads on separate SAP and Databricks paths. |
| Chat requests could overwrite one another | Only one chat action is accepted at a time; the composer and suggestions are disabled while a request is in flight. |
| Business workspace lacked a finance work center | Added 12-month close worklist, exception count, selected case and control status, four-source evidence, 24 account balances and 12 illustrative journal records per month. |
| Maker and approver appeared as one action row | Moved approval to a separate synthetic role lane with an explicit switch and local receipt; server checks the role marker. It remains a same-viewer simulation. |
| Streamlit resent a large payload every 0.4 seconds | Poll period increased to one second. Full data still refreshes at that cadence; an incremental event protocol remains future performance work. |
| Project was not a clean deployable repository | Created an allowlisted 29-file ZIP with pinned minimal requirements and SHA-256 manifest. Database, `.venv`, Node modules, screenshots and environment files are excluded. |

## Regression evidence

`python -m pytest -q tests/test_poc.py` passed **43 tests**. Positive coverage includes both gateway scenarios, 12 monthly periods, signed variance markers, local approval and journal receipt, and paced live events. Negative coverage includes denied scope and identity, stale reads, each source changing after proposal, grant loss, zero variance, duplicate callback, repeated proposal, ambiguous response, tamper, and concurrent approval.

`npm run build` passed for the FastAPI and Streamlit React bundles. `python scripts/qa_v3.py` passed local Chromium flows on both entrypoints. `python scripts/qa_release.py` passed close work center, zero-variance denial, November approval, account and journal drilldown, rapid-chat guard, 390-pixel mobile width, and two isolated Streamlit viewers. No browser JavaScript errors appeared in those checks. Screenshots are under `docs/evidence/`.

## Posting package

Run `python scripts/package_streamlit.py` after any source or frontend build change. The output is `release/finance_architecture_streamlit.zip`; inspect `UPLOAD_MANIFEST.json` for the exact file list and hashes. Extract it into a dedicated GitHub repository, then select `streamlit_app.py` as the Streamlit entrypoint. The current project is nested under the user's home Git root rather than its own clean repository, so do not publish that parent repository. Hosting, production authentication and live vendor gates G1–G7 are still open.

Final local archive SHA-256: `d53ab346fd6ddc57c27c690ddea0d92e55653ff44c57802c96dc6e0046e00b66` (29 allowlisted files, 140,968 bytes). An isolated extraction imported the Python modules and completed an S1 November reconciliation with 73 components and a 25,000 USD variance.

> **Architecture V5.1 note.** This review predates V5.1. The scenarios, pages and checks it names are superseded by `docs/ARCHITECTURE_V5_1.md`.
