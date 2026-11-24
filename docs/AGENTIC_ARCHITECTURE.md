# Agentic architecture (simulated)

Status: synthetic design for review. Agents are deterministic rules over the existing simulators. No model is called, nothing posts to SAP, and no agent approves.

## Roster

| Agent | Responsibility | Tools | Class | Opens |
|---|---|---|---|---|
| Orchestrator | Plans the request and calls the specialists | `plan` | plans only | Close & reconcile |
| Scope & intake | Period, company code, ledger, route | `resolve_scope` | read | Close & reconcile |
| Evidence | S/4HANA, Central Finance, BW and Databricks snapshots through the selected route | `collect_evidence` | read (simulated) | Run & trace |
| Variance & close | Variance and close readiness | `compute_variance`, `close_readiness` | read | Detailed report |
| Investigator | Document-level cause and proof | `start_investigation` | read | Evidence proof |
| Governance & route | Route controls, open decisions, stored trace | `route_controls`, `trace` | read | Responsibilities & governance |
| Approval gatekeeper | Drafts a local marker proposal only | `draft_proposal` | local draft | Close & reconcile |

## Contract

- `plan_for(message, case)` is a rule table and returns a plan: `{plan_id, intent, steps[], status}`.
- Each step is `{step_id, agent, tool, purpose, rw, status, summary, view}`. Status is `pending`, `running`, `done`, `held`, `blocked` or `skipped`.
- `run_plan` executes steps through the existing simulators, so every step also writes the stored event trail. A plan stops at a held step (it needs one more detail) or a blocked step (a control refused it).
- The plan is stored as `last_plan`. The same code serves the FastAPI endpoints and the Streamlit `agent_plan` action.

## Not agent actions

`sap.post`, `approval.decide`, `approval.execute`, `fixture.mutate` and `investigation.resolve` are not registered as tools. A request to post a journal is refused by the orchestrator. Direct tool calls reach only registered read tools; `plan`, `draft_proposal`, `start_investigation` and `collect_evidence` are available only through a plan.

## Navigation and disclosure

The three areas are Close & reconcile, Run & trace and Architecture decision. Technical identifiers are hidden unless **Technical details** is ticked. The MCP governance matrices are collapsed sections whose headers state what is inside. Tests: `tests/test_agents.py` and the browser checks in `scripts/qa_current_release.py`.
