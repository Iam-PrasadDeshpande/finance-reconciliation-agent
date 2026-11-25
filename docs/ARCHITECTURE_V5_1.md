# Architecture V5.1: three scenarios, one model

Status: **proposed design for evaluation. Nothing here is approved, deployed or tenant-verified.** No cloud resource, registry, gateway, SAP system or credential is created or contacted by this application.

## Decision record

Three candidate designs are agreed for evaluation. Portkey is the LLM gateway in all three, SAP Integration Suite is the SAP integration boundary, Google Apigee is the SAP-facing MCP/API gateway in all three, and the SAP backend decides business authorization.

| | S1 SAP-centric | S2 AWS AgentCore-centric | S3 SAP-hosted hybrid |
|---|---|---|---|
| Agent hosting and execution | SAP BTP Cloud Foundry | AWS AgentCore Runtime | SAP BTP Cloud Foundry |
| Custom MCP code (only if required) | Cloud Foundry, behind Apigee | AgentCore Runtime, proxied by Apigee (cross-cloud, conditional) | Cloud Foundry, behind Apigee |
| MCP gateway | Apigee | AgentCore Gateway in front of Apigee | Apigee |
| Agent and MCP registry | Domain-managed catalog, **product selection pending** | AWS Agent Registry | AWS Agent Registry (control plane only) |
| AgentCore Runtime / Gateway | not used | used | not used (Gateway only in the S3-B variant) |
| Status | evaluation candidate | evaluation candidate | **preferred candidate, subject to AI Foundry policy and POC validation** |

S3-B (policy-dependent, not baseline): if AI Foundry mandates AgentCore Gateway for every tool invocation, it sits between the agent and Apigee. It is documented as an option, never as a fourth scenario.

Two MCP patterns, in every scenario: **A** an approved API exposed as an MCP tool by Apigee (no custom server), **B** a custom MCP server on the scenario's hosting platform behind Apigee. A managed endpoint is not application-code hosting.

Persistence is conditional (HANA Cloud only if durable SAP-side state is required; SAP ledgers are never duplicated). Cloud Connector is conditional on the connectivity model. The application remains read and tally only: posting-capable tools are described as separately governed future capabilities and none is active.

## One model

`poc/architecture_model.py` is the only place scenario facts are written. It holds the 38 per-scenario fields, the 22-row comparison, the connection tables, the ten diagram specifications, the recommendation and the evidence list, and it validates the owner-approved invariants.

```
poc/architecture_model.py  ->  scripts/build_architecture_model.py  ->  frontend/src/architectureModel.json
                                                                          -> mcpScenarios.js (one renderer) -> every view
poc/architecture_model.py  ->  GET /api/architecture/model
```

After any change to the model run `python scripts/build_architecture_model.py`; a test fails when the committed JSON is stale. `python scripts/build_architecture_model.py --check` reports without writing.

## Diagram inventory

| Id | Diagram | Where it appears |
|---|---|---|
| D1 | Enterprise overview (control, runtime and evidence planes) | Architecture · Diagrams |
| D2, D3, D4 | S1, S2, S3 topology | Complete architecture (diagram button), MCP hosting, Agent hosting, Diagrams |
| D5 | MCP hosting versus registration (four independent decisions plus gateway) | Diagrams; link from MCP hosting |
| D6 | Identity, authorization and principal propagation, with the negative case | Diagrams |
| D7 | LLM execution through Portkey | Diagrams |
| D8 | Registry lifecycle and synchronization | Diagrams |
| D9 | Observability and audit correlation | Diagrams |
| D10 | Three-scenario comparison | Diagrams |

Edge styles: solid = runtime invocation, dashed green = registration and discovery, solid violet = LLM, dash-dot orange = identity and token, dotted grey = audit, dashed red = approval. All diagrams, in both the hosting views and the Diagrams tab, are drawn by one renderer (`renderTopology` in `frontend/src/mcpScenarios.js`) with zoom, pan, reset, expand, SVG and PNG export. `node scripts/render_architecture_svgs.mjs <dir>` renders all ten and fails if any SVG differs from its specification.

Removed: `landscapeData.js`, `landscapeDiagrams.js`, and the two static deck SVGs (`diagrams/s1.svg`, `s2.svg`), which encoded the previous S1/S2/S3 meaning and Microsoft Foundry and Joule hosting options outside the three scenarios.

## Invariants enforced (tests/test_architecture_model.py)

Model: S1 has no AWS AgentCore component and an explicitly unresolved registry; S2 has AgentCore Runtime, Gateway and Agent Registry as three distinct capabilities and Apigee mandatory; S3 has Cloud Foundry execution, AWS Agent Registry and no AgentCore Runtime or Gateway; Portkey everywhere; persistence and Cloud Connector conditional; SAP backend authorization mandatory; S3 never claims production readiness. Corrupting the model is rejected (seven mutation cases).

Diagrams: no Google hosting or registry platform; no registry on a runtime path; no direct access to the SAP backend; the model is reached only through Portkey; D2 to D4 contain exactly the nodes and edges of the model, checked on the rendered SVG.

## Source evidence (read 2026-11-25)

| Source | Finding that matters here |
|---|---|
| Apigee MCP overview | Existing Apigee APIs are exposed as MCP tools with no MCP server to install; OpenAPI 3.0.x; 1000 tools per organization; capacity limits in some regions |
| Apigee tool access | API products and apps control which tools a client sees; the page also describes proxying your own MCP server |
| AgentCore Gateway concepts | Entry point with MCP, HTTP and inference target categories; whether an external MCP server is an MCP or an HTTP target is ambiguous on the page |
| AWS Agent Registry | A separate discovery and approval service (AGENT, MCP, SKILL, CUSTOM, WEB_BOT records); the older preview namespace was announced for discontinuation on 2026-10-30, so use `agent-registry` |
| Registry synchronization | Records can be synchronized from external MCP servers and A2A cards by connecting to the URL with outbound credentials; the credential provider must be in the same account |
| Registry record types | An agent can be registered with `a2aAgentCard`, `mcpServer` or `custom` descriptors |
| SAP BTP Cloud Foundry runtime | **NOT_VERIFIED**: the page returned no body when fetched; the Cloud Foundry host assumption rests on the owner's brief |

These are product-capability statements. They do not show that anything is entitled, configured or available in the organization's tenant or region.

## What is PASS, HOLD and NOT_VERIFIED

PASS (observed): model invariants, diagram generation against specifications, the application's architecture views, the unchanged reconciliation flow (see the QA logs listed in the handover).

HOLD / design gaps:

- **S1 registry**: no product is selected. The application shows this openly and does not invent one.
- **S3 registry synchronization** connects from AWS to the SAP-hosted endpoint URL with outbound credentials. That is control-plane traffic, not an execution hop, but it needs a reachable endpoint and a credential provider in the same AWS account. Whether that is acceptable for SAP-hosted endpoints is an open security decision.
- **S2** AgentCore Gateway to Apigee protocol, token exchange and target classification are unproven.
- **Identity**: SAP Cloud Identity Services (IAS) is a candidate trust component; Global User ID is an identity-correlation attribute where supported. Token exchange and principal propagation are design assumptions until validated.
- **Live run simulator**: the simulator still draws the agent in an "AWS runtime" zone and has an Apigee path (S1, S3) and an AgentCore Gateway path (S2) without Apigee behind it. It is labelled as a simulator on the page. Redrawing the simulator's component zones would change recorded simulation events and was deliberately not done in this change.

NOT_VERIFIED: every product capability in the tenant, SAP BTP Cloud Foundry entitlement, AWS Agent Registry region and approval roles, Portkey routes, Apigee MCP enablement. No live runtime was used.

## Rollback

All changes are in one feature branch (`claude/architecture-v5-1`). To restore the previous behaviour, revert the merge commit or reset the branch to `origin/main` at `f75b973`. Files changed: `poc/architecture_model.py` (new), `scripts/build_architecture_model.py` (new), `scripts/render_architecture_svgs.mjs` (new), `scripts/qa_architecture_v51.py` (new), `tests/test_architecture_model.py` (new), `frontend/src/architectureModel.json` (generated), `frontend/src/mcpScenarios.js`, `McpGovernance.jsx`, `McpApproaches.jsx`, `HostingPriority.jsx`, `ArchitectureDiagram.jsx`, `DetailedDiagrams.jsx`, `App.jsx`, `roleData.js`, `liveArchitecture.js`, `poc/route_playbooks.py`, `poc/decision_lab.py`, `poc/registry.py` (display names only), `poc/app.py` (one read-only endpoint), and `tests/test_poc.py`. Reconciliation logic, the synthetic datasets, treasury logic and credentials are untouched.
