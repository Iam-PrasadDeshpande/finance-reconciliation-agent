# Accrual agent: design and implementation review (three roles)

**What this is, and is not.** A review of the design and the finished build from three architect roles: SAP finance solutions architect, AI architect and enterprise architect. It was carried out by the engineer who built it, in each role in turn, against the code, the tests and the browser suites. It is **not** a sign-off by your named architects; it prepares one. Nothing here is verified against a tenant. SAP statements come from web-search summaries read on 2026-11-26; the pages themselves were not read.

## Reviewed

Design (before the build): scope, flow, LLM role. Implementation (after): `poc/accrual_*`, the module, the workflow panel, 23 unit tests, 31 browser checks on web (desktop and phone) and on a local Streamlit run.

## SAP finance solutions architect

| # | Finding | Disposition |
|---|---|---|
| F1 | The five types cover SAP's documented accrual sources (purchase order, service entry sheet, manual) plus GR/IR | OK |
| F2 | Reversal on the first day of the next period; posting on the last day | Implemented as a scheduled reversal document; **not executed** (no next-period run). Accepted limitation |
| F3 | Closed posting period must block posting | Implemented (approve and post denied); tested |
| F4 | Duplicate protection by reference against earlier documents and the ledger | Implemented; a rerun after posting keeps the posted journal and shows every reference as a duplicate; tested |
| F5 | Accruals belong in the company-code ledger; Central Finance receives replicated documents | Implemented as a reconciliation of replication, not a posting to Central Finance. Design assumption |
| F6 | Account determination, profit centre, ledger, foreign currency, partial periods, invoice-received-goods-not-received | **Open**: static account map, one currency per company code |
| F7 | Posting route in a real system (accrual engine, manual journal entry, released API) and SAP agent availability for your edition | **Open**, not verified |

## AI architect

| # | Finding | Disposition |
|---|---|---|
| A1 | The model must not compute numbers | Amounts always come from deterministic code; LLM and Rules give the same amount for every formula line (tested) |
| A2 | Untrusted document text | An injected instruction in a document is detected, ignored and flagged; no amount or posting changes (tested). Detection is a pattern list: weaker than a real classifier, **open** for a real model |
| A3 | Hallucinated or weak evidence | Estimates carry range, evidence and confidence; below 75 percent a low-confidence flag is raised; a vendor's own statement is flagged unverified |
| A4 | Model, prompt and schema versions must be recorded | Recorded on the plan and the run; the simulation is labelled everywhere. A real call also needs the stored prompt and response (**open**) |
| A5 | Evaluation | Seeded cases per type and situation are tests; a threshold-based evaluation set for a real model is **open** |
| A6 | The agent must not hold posting credentials | No posting or approval tool; posting is a human action (conformance test enforces tool names) |

## Enterprise architect

| # | Finding | Disposition |
|---|---|---|
| E1 | New agents must not change the architecture views | The module plugs in with one file; the reads use existing gateway and backend components; the views are unchanged |
| E2 | Segregation of duties and audit | Preparer cannot approve; approval hash-bound; audit trail per run. The approver role is a **demo switch asserted by the browser**: a real build takes it from the identity provider (**open**) |
| E3 | Shared state on the hosted demo | Runs and the ledger are shared by every viewer of the hosted app and persist; a Reset action exists. Demo limitation |
| E4 | Posting is a write capability | Kept outside the cockpit's "no write tool" rule: a local, synthetic, human-triggered action; the Finance Posting MCP stays not active against any SAP system |
| E5 | Technical options and agents must be discoverable | The Agents area is a Fiori launchpad: tiles, family tabs, technical options below |

## Defects found and fixed during the review

1. The reconcile answer claimed a tie to Central Finance while replication was still open: now it lists what is open.
2. The trace display cut the S/4HANA and Central Finance hops after 12 hops: cap raised to 24.
3. The "full output" link would have navigated to a screen that does not exist: hidden for workflow modules.
4. Several browser checks relied on fixed delays and on text the CSS uppercases: rewritten to wait on page state.

## Not verified

Everything that needs a tenant: the SAP agent's availability, the posting route, entitlements, identity propagation, cross-account registry sharing, real model behaviour and cost. Named architects must still sign off.
