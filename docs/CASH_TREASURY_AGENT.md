# Cash and Treasury Assistant: what SAP documents, what the demo imitates, what is open

Synthetic demo. No SAP, bank or tenant is connected. Nothing here is SAP's ontology or an approved design.

## 1. What SAP documents (sources read on 2026-11-25)

| Source | What it says | Status |
|---|---|---|
| SAP Help Portal, What's New Viewer, Finance Agents (R1) | **Cash Positioning Agent**: daily cash positioning tasks: check opening balances of bank accounts, identify surplus and deficit accounts, retrieve transfer templates, generate transfer recommendations, and initiate bank transfers based on approved proposals. **Bank Relationship Agent**: real-time insight into bank relationships: bank accounts, average bank account balances, payment volumes, credit lines, borrowings, investments and bank fees, in natural language over existing business data. **Cash and Treasury Orchestration Agent**: supports cash managers and corporate treasurers with queries and tasks; identifies the intent and coordinates the appropriate agents. | READ |
| Same viewer, release entries | Private Edition: Bank Relationship and Orchestration agents "as of release 2025"; Cash Positioning "as of release 2025" (an earlier entry: "2025 FPS0 and higher"). Public Edition 2602.3. Entries dated 29 Sep and 27 Oct 2026: restricted availability, then general availability in a phased approach. | READ |
| SAP, Cash and Treasury Assistant page (R2) | Eight agents: Bank Relationship, Orchestration, **Cash Forecasting** ("projects liquidity by currency and entity across short- to long-term horizons"), Cash Positioning ("scans positions continuously to flag concentration risk, prevent overdrafts, and surface idle cash"), FX Risk Hedging, Market Data Validation, Treasury Financing, Treasury Operations. "Predict cash flow timing based on actual payment behavior." | READ |
| SAP Learning, Cash Management Agent (R3) | Daily cash positioning (retrieve opening balances, forecast cash flows, calculate closing balances), bank account insights (surplus and deficit), bank transfer proposals with templates, treasury policy rules defined in natural language. SAP marks the agent shown as **Beta**. | READ |
| SAP Community, 2023 FPS03 highlights (R4) | **Joule Agent for Cash Manager**: questions about current cash positions, liquidity forecasts and bank balances, with navigation to the relevant apps. Beta shipment. | READ |
| SAP Community, 2025 FPS1 highlights (R5) | Cash Management Agent: checks bank statement completeness, validates opening balances, prepares cash-flow forecasts. Beta. | READ |
| SAP Fiori Apps Reference Library (R6) | Cash Position (F1737), Liquidity Forecast Details (F0741), Cash Flow Analyzer, bank transfer templates. IDs come from SAP knowledge base articles. | NOT_VERIFIED for your release |

SAP's product pages for the Bank Relationship and Cash Management agents returned 403 to automated reads, so their wording was not used.

## 2. How the demo imitates it

| SAP statement | Demo behaviour | Where |
|---|---|---|
| Orchestration agent identifies intent and coordinates agents | `Cash and Treasury Orchestration Agent`: a rule table picks cash position, transfer proposal, forecast, bank relationships, or a refusal; it adds steps when it finds deficits or a forecast shortfall | `treasury_agents.py` |
| Check opening balances, surplus and deficit accounts | `get_opening_balances`, `identify_surplus_deficit`: DEFICIT if expected close is below the minimum, IDLE_CASH if opening is above 1.5 times target | `treasury.py` |
| Check bank statement completeness, validate opening balances | `check_statement_completeness`: missing statements and opening balances that disagree with the prior closing | `treasury.py` |
| Retrieve transfer templates, generate recommendations | `retrieve_transfer_templates`, `generate_transfer_recommendations`: only template pairs, same currency, limited to cash above target; what cannot be funded is listed, never invented | `treasury.py` |
| Treasury policy rules | `check_treasury_policy`: six rules (minimum balance, no overdraft, bank concentration 40%, idle cash, statements, opening balance) | `treasury_data.py` |
| Initiate transfers based on approved proposals | **Stops at an approval marker.** A person with the approver role records a local marker bound to the proposal hash. The demo never initiates a transfer; asking an agent to do so is refused. | `treasury_agents.py` |
| Liquidity by currency and entity, short to long horizons | `forecast_liquidity` for 7, 30 or 90 days; first shortfall by currency; receipts shifted by observed payment behaviour | `treasury.py` |
| Bank relationship insight | `bank_relationship_summary`: accounts, average balance, payment volume, credit line, borrowings, investments, fees, share of cash | `treasury.py` |
| Concentration risk, overdrafts, idle cash | Policy rules P1 to P4 | `treasury.py` |
| Navigate to the relevant apps | The SAP tab lists the apps where a person verifies, marked NOT_VERIFIED | `TreasuryDetail.jsx` |

Every answer carries the SAP sources it rests on (R1 to R6) with their status.

## 3. Synthetic data, by level (`poc/treasury_data.py`, deterministic)

| Level | Content | Notes |
|---|---|---|
| L0 reference | 3 company codes (US, DE, CH), 4 banks, 9 bank accounts with currency, kind, minimum and target; 6 transfer templates; the policy; flow types, liquidity items, planning levels; synthetic rates | Fixed |
| L1 period snapshot | Per period (12 months): opening balance, expected receipts and payments for the as-of business day, bank statement facts (last statement, gap, prior closing) | A hash of period and account, no random state |
| L2 forecast | 90 business days of cash flow items by entity: customer receipts, vendor payments, payroll, taxes, debt service, intercompany, capex; scheduled and predicted dates | Receipts are weaker in periods with seeded deficits |
| L3 bank relationships | Per bank: credit line and drawn amount, borrowings and rate, investments, payment count and volume, fees by type | Per period |
| L4 derived | Position status, policy checks, recommendations, projections, concentration | Computed, never stored |
| Local | Draft proposals and approval markers | Store state; never an SAP document |

Seeded situations per period are listed in `SEEDS`. For example February is clean apart from one idle reserve; November has two deficits, an idle
reserve, a concentration breach, a missing statement and an opening-balance mismatch. Statuses are always computed from the numbers.

## 4. Open points for your clarification

1. **Release statements disagree.** The email says the Cash Positioning Agent needs S/4HANA 2023 FPS03 (Notes 3576432, 3616238, 3724030) and the Bank Relationship Agent 2025 FPS01 (Notes 3744036, 3798283). SAP's What's New viewer says Private Edition "as of release 2025" for all three, and the capability documented for 2023 FPS03 is the **Joule Agent for Cash Manager** (beta), a different, earlier offering. A knowledge base article ties Note 3576432 to the Cash Management AI assistant. Notes 3616238, 3724030, 3744036 and 3798283 were not found. Please confirm which product each note enables.
2. **Cash Forecasting Agent.** SAP's marketing page lists it, but no release statement was found in the What's New viewer. The demo includes it, marked NOT_VERIFIED.
3. **Where the demo stops.** SAP says the Cash Positioning Agent can initiate bank transfers from approved proposals. The demo stops at a local approval marker. Confirm that this is the boundary you want to show.
4. **Availability status.** SAP marks the agents Beta, early adopter, restricted availability, then phased general availability. The demo does not claim your tenant can use them.
5. **Fiori app IDs** (F1737, F0741) and the Help pages for them were not verified for your release.
6. **Scope not built.** SAP also lists Treasury Operations, Treasury Financing, FX Risk Hedging and Market Data Validation agents. They are not in the demo.
7. **Entities and banks are invented.** Three company codes, four banks and nine accounts. If you want a shape closer to a real scenario, give me the account structure.
8. **Naming.** SAP calls it the Cash and Treasury Assistant; the screens say "Cash & treasury". Change the names in `agent_modules/treasury.py` if you prefer another.
