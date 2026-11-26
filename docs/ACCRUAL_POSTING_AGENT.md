# SAP Accrual Posting Agent (custom imitation, synthetic)

Synthetic demo. No SAP, AWS, Apigee, Portkey or model tenant is connected. This is a **custom agent that imitates the behaviour SAP describes for its standard Accounting Accruals Agent** (read the accrual policy, calculate, check duplicates, propose journal entries with the reasoning, let a person accept, adjust or reject, then post). It is not SAP's agent and claims nothing about SAP's release, availability or posting capability (sources: `docs/ACCRUAL_AGENT_REVIEW.md`, all search summaries, pages not read).

## What it does, step by step (company-code level)

| Step | Who | What |
|---|---|---|
| 1 Prepare | Accrual Preparation Agent | Finds candidates of all five types, reads the policy and documents, calculates, estimates, checks, drafts the lines. Nothing is posted. |
| 2 Review | Finance approver | Accepts or rejects each line; blocked lines (duplicate, no cost center under Rules) cannot be accepted. |
| 3 Approve | Finance approver (not the preparer) | Approves the journal; the approval is bound to a hash of the accepted lines and is withdrawn if they change. |
| 4 Post (simulated) | Finance approver | Writes one balanced document to a **local synthetic ledger**, with a reversal scheduled for the first day of the next period. No SAP system is changed. |
| 5 Reconcile | Posted Entries Reconciliation Agent | Ties the posted documents to the approved lines, the accrual account, the reversal and Central Finance (replication). |

The agent has **no posting or approval tool** (`post_accrual_journal`, `approve_journal` are on its not-a-tool list). Approval, posting, replication and reset are human-triggered *actions* of the module, outside the agent's tools.

## Accrual types (all), and how each is calculated (deterministic code)

| Type | Rule (handbook clause) |
|---|---|
| Purchase order | With a receipt: (received − invoiced) × price (H1). Without: scheduled quantity due × price − invoiced (H2). |
| Service entry sheet | Accepted value − invoiced (H3). |
| GR/IR | Goods receipt value − invoice value (H1). |
| Recurring contract | Monthly fee × months since the last invoice (H4). |
| Policy estimate | No formula: history average × seasonality, documented hours × rate, or a vendor's written statement (H5); range, evidence and confidence attached. |

## Execution option: LLM (default) or Rules

The Agents area offers **Execution** (LLM is the default, Rules the alternative), **Company code** (1000, 2000, 3000) and **Accrual types** (All types, or one) under *Technical options*. The chosen values are summarised next to the ask box.

| | LLM (default) | Rules |
|---|---|---|
| Policy | Reads the handbook and quotes the clause for each rule | Coded rule set; handbook not read |
| Documents | Reads source documents; finds a liability an e-mail mentions; ignores instructions found in a document and flags them | None |
| Estimates | Chooses the method, shows range and evidence | Excluded as "needs an estimate" |
| Cost center missing | Suggests one from history, flagged for the reviewer | Blocked |
| Explanation | Reasoning per line | The rule that fired |

**The LLM is simulated.** No model is called; outputs are deterministic and recorded the way a real call would be (model, prompt version, schema). `LLM_ADAPTER` in `poc/accrual_engine.py` is the one place a real call (through Portkey) would replace the simulation. In both executions every amount comes from deterministic code, so a formula line has the same amount either way (tested).

## Controls

Preparer cannot approve; approval bound to the accepted-lines hash; closed posting period blocks approval and posting; duplicates blocked; materiality threshold; approved expense accounts; prompt-injection text in a document is flagged and never changes an amount; a request to post or approve is refused by the orchestrator.

## Systems of record (design assumption, not verified)

S/4HANA (SYNG Core): purchase orders, receipts, service entry sheets, contracts, open items, posted accrual documents. Central Finance: documents replicated from the company code (checked by the reconciliation). Accruals are posted in the company-code ledger, not in Central Finance. The reads pass the selected scenario's gateway chain and use existing components.

## Where to find it

Finance apps space, **Accruals** tile (third, after Close & reconcile and Cash & treasury; plugged in through the module manifest like the other two): the accrual screen with the **Accrual posting workflow** panel and the Preparer / Finance approver switch. The Agents space shows the three accrual agents in the Agent catalog and the execution options under Technical options.

## Limits

Synthetic data and a simulated model; posting is a local entry; the reversal is scheduled, not executed; no foreign-currency, partial-period, intercompany or invoice-received-goods-not-received cases; accounts and thresholds are invented; the SAP posting route (accrual engine, manual journal entry or API) is not decided and the SAP agent's availability for your edition is unconfirmed.
