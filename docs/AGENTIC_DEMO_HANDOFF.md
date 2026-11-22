# Agentic investigation demo handoff

## Architecture-team walkthrough

1. In **Business workspace**, reconcile November 2026. The aggregate S/4HANA and Central Finance snapshots differ by 25,000 USD.
2. Follow **Open proof & correlation**. Run **Missing replication**. Four synthetic document comparisons tie to 1,000,000 USD at source and 975,000 USD in Central Finance. One mapped 25,000 USD document is absent. The plan records readiness, the gateway-routed `sap.compare` call, hypothesis tie-out and a policy recommendation.
3. Inspect a proof item and its SHA-256 digest, then select a plan step to jump to the corresponding component message. Use **Entire request** to include the original reconciliation flow.
4. Apply the explicit **simulated reprocess** action. The local source, BW and Databricks evidence refresh; an independent new reconciliation returns a zero variance. The original 25,000 USD case and its proof remain stored.
5. On a fresh case, choose **Mapping conflict**. The agent holds for finance/integration review and does not mutate source data or create a journal. Once an investigation exists, a variance-marker proposal for that original case is blocked.

The business and architecture tabs show compact status and links; detailed evidence and correlation live in the third tab. At 1440 × 900, the browser document does not scroll vertically; long content scrolls inside panels. Narrow screens use natural page scrolling.

## Verified local result

- Python regression: **54 passed**.
- Node/Vite: FastAPI and Streamlit bundles built.
- Browser suites: `qa_v3.py`, `qa_release.py`, `qa_agentic.py` passed on fresh FastAPI and Streamlit servers. Positive resolution, mapping hold, architecture redaction, replay, mobile 390-pixel width, two isolated Streamlit viewers and desktop viewport containment passed; no page JavaScript errors were observed.
- `docs/evidence/agentic_trace_bundle.json` contains the resolved and held dossiers and neutral architecture events. All ten proof-item hashes verified; both branches created zero synthetic journals.
- The Streamlit ZIP was extracted in isolation. Its Python modules imported, the typed comparison ran through 73 registered components, and simulated resolution returned zero variance.

## Streamlit posting package

`release/finance_architecture_streamlit.zip` contains **30 allowlisted files** and `UPLOAD_MANIFEST.json`, with SHA-256 `553943f46f1666db276b203cf4529f3ff41580e899175070616617feee26951b`. It includes the compiled frontend and Python entrypoint; it excludes the local SQLite files, `.venv`, `node_modules`, browser captures and environment files. The earlier archive hash in `INDEPENDENT_REVIEW_AND_RELEASE.md` refers to the prior version.

Hosting has not occurred. The project is nested under the user's home Git root, so the package should be extracted into a dedicated repository before selecting `streamlit_app.py` as the hosted entrypoint. The simulated documents, AIF status, gateways, role switch and reprocess are not live SAP or vendor proof. G1–G7 remain open as described in `POC_LIMITATIONS.md`.
