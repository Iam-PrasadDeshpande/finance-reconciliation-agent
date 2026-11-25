# Architecture V5.2: three scenarios, an evidence-driven recommendation

Status: **proposed design for evaluation. Nothing here is approved, provisioned, deployed or tenant-verified.** No AWS account, AgentCore resource, registry, gateway, SAP service or credential is created or contacted by this application. S3 is the **preferred candidate to evaluate first**, not an unconditional winner.

## Decision record

| | S1 SAP-hosted hybrid | S2 AWS AgentCore-native | S3 AWS AgentCore + Apigee hybrid |
|---|---|---|---|
| Classification | SAP-hosted alternative | AWS-native alternative | Preferred candidate for a comparative POC, conditional |
| Agent hosting and execution | SAP BTP Cloud Foundry | AWS AgentCore Runtime | AWS AgentCore Runtime |
| Custom MCP code (only if required) | Cloud Foundry | AgentCore Runtime | Conditional; AgentCore Runtime preferred, exposed through Apigee |
| Runtime gateway | Google Apigee | AWS AgentCore Gateway | AgentCore Gateway in front of Apigee |
| Apigee | Required | Optional, only where SAP Integration and Security require it | Required |
| Agent and MCP registry | AWS Agent Registry (registration only) | AWS Agent Registry | AWS Agent Registry (separate control-plane path) |
| AWS account | Not used for execution | Dedicated SAP-agent account (proposed) | Dedicated SAP-agent account (proposed) |
| LLM gateway | Portkey | Portkey | Portkey |

Common to all: SAP Integration Suite is the SAP integration boundary; SAP Cloud Connector and persistence are conditional; the SAP backend decides business authorization; **GitLab is the central source, CI/CD and artifact platform wherever AgentCore (and Cloud Foundry) is used: it deploys the runtime, gateway targets, Apigee bundles and registry records and is never a runtime.** The application stays read and tally only.

### Why the classification changed

V5.1 treated the SAP-hosted hybrid as the preferred candidate. V5.2 reflects the proposal for a dedicated AWS account for SAP-related agents and AgentCore for managed execution, with Apigee kept for SAP-specific MCP/API governance: S3 (AgentCore + Apigee) becomes the strategic candidate to evaluate first, S2 the AWS-native alternative and S1 the SAP-hosted alternative. The change is a hypothesis to test, not a verdict: runtime cost, identity integration, operational complexity or policy can make S2 or S1 the right answer.

### Critical rules (all enforced by tests)

AgentCore Runtime hosts agents and eligible custom MCP servers; AgentCore Gateway mediates and is not an agent-hosting service; AWS Agent Registry stores governed metadata and is neither a runtime gateway nor an invocation hop; Apigee exposes or proxies SAP-facing MCP/API capabilities and does not host arbitrary agent code; registration, deployment, authentication, authorization and execution are separate states; no agent bypasses SAP Integration Suite or SAP authorization; a registered skill never grants tool permissions; nothing is labelled production-ready without evidence.

## Recommendation framework

`recommend()` in `poc/architecture_model.py` (mirrored in `frontend/src/selectionEngine.js`, with a test that proves both agree on a grid of inputs) turns what is known into HOLD, CONDITIONAL or RECOMMENDED, with reasons, conditions, missing evidence, rejected alternatives, the approving authority and revisit triggers. Missing mandatory approvals give HOLD, never an unconditional choice. No numerical score is produced. The same rules are shown in the app (Selection, Recommendation) and as the decision tree D9. The default state, where nothing is approved or validated, gives HOLD with S3 to evaluate first.

## Cost model

An editable model (Selection, Cost model) with thirteen cost layers, one workload definition for all scenarios and per-scenario rates entered with their source. It contains no rate: SAP BTP credit rates, enterprise AWS discounts and Apigee charges are never invented. It shows totals only when every needed input is present, a plus or minus 20 percent sensitivity and a break-even volume. See `docs/COST_MODEL.md`.

## Diagram inventory

| Id | Diagram |
|---|---|
| D1 | Enterprise AI reference architecture (control, runtime and evidence planes, GitLab) |
| D2, D3, D4 | S1, S2 and S3 topologies, with the alternative API-target and conditional Apigee in S2 |
| D5 | Four responsibility model plus gateway mediation and the LLM gateway |
| D6 | AWS account and governance architecture |
| D7 | Gateway and principal propagation (six identities, negative case) |
| D8 | Cost and operational responsibility layers |
| D9 | Architecture selection decision tree |
| D10 | Three-scenario executive comparison |

All are generated from the model by one renderer (`frontend/src/mcpScenarios.js`) with zoom, pan, fit, expand, SVG and PNG export. `node scripts/render_architecture_svgs.mjs <dir>` renders them and fails if any SVG differs from its specification or any node text is cut off.

## Pages

Live run (S1, S2 and S3 are runnable in the simulator: S1 calls Apigee, S2 calls AgentCore Gateway, S3 passes AgentCore Gateway then Apigee), Complete architecture, MCP hosting, Agent hosting, Registry, **Selection and cost** (new: recommendation evaluator, gateways and identity, cost model, AWS account and governance), Decision brief, Ontology, Diagrams.

## Evidence

Read on 2026-11-25 (AWS and Google through a web fetch, SAP Cloud Foundry and the SAP reference architecture in a browser): AgentCore Gateway and Apigee share four MCP protocol versions; outbound OAuth and token exchange are documented, caller passthrough is not; registry synchronization needs an HTTPS URL, runs on creation and on demand and reverts the record to draft; AgentCore Policy enforces at the gateway; the Cloud Foundry runtime runs Python. **Not read in this build and NOT_VERIFIED:** cross-account sharing of AWS Agent Registry (AWS Organizations, AWS Resource Access Manager) and the account service entitlements. Vendor documentation is capability, not tenant evidence.

## Decisions and owner answers

The Decision brief lists six decisions (account, central registry and sharing, gateway interoperability, identity, cost evidence, Apigee policy) with answers tagged DECIDED, OWNER-CONFIRMED or OPEN. Carried forward from the owner on 2026-11-25: GitLab is the central platform (DECIDED); the integration team with the respective technical approvals approves publishing; tenant entitlements are live (both OWNER-CONFIRMED, not independently verified). Still open: account approval and AWS Agent Registry sharing, the real call through AgentCore Gateway to Apigee, Apigee reachability from AWS, the credential-provider account, delegated identity, cost rates, and SAP Integration's Apigee mandate. The earlier interim GitLab registry and the gateway-mandate positions belonged to the V5.1 scenarios and no longer apply.

## Simulator and what it proves

The simulator replays one synthetic reconciliation through each scenario's gateway chain (`GATES` in `poc/gateway.py`). It proves no connection. The S2 chain does not simulate an inserted Apigee. Zones are labelled generically.

## Rollback

Everything is in one feature branch. To restore V5.1 behaviour reset to `origin/main` before the V5.2 merge or revert the merge commit. The financial logic, synthetic data, treasury logic and credentials are untouched.
