# MCP hosting and governance (synthetic design review)

Status: proposed design for review. No SAP, AWS, Google, Databricks or BDC tenant is connected. Nothing here is an approved architecture, tenant evidence or production authorization.

The UI tab **MCP hosting & governance** is generated from one file, `frontend/src/mcpScenarios.js`. Edit that file, not the rendered tables, so the three scenarios stay consistent.

## What the tab holds

| Item | Where in the config |
|---|---|
| S1 / S2 / S3 definitions and baselines | `SCENARIOS` |
| 21-row responsibility matrix | `MATRIX` |
| Endpoint connectivity (invocation, registry and deployment separated) | `CONNECTIONS` |
| Registry and artifact ownership | rows of `MATRIX` |
| Finance read, posting and analytical domains | `DOMAINS` |
| Agent hosting versus MCP scenario | `HOSTING` |
| 15-dimension decision matrix | `DIMENSIONS` |
| Recommendation and proof plan | `RECOMMENDATION` |
| Source evidence | `EVIDENCE` |
| Three SVG topology diagrams | `TOPOLOGY`, rendered by `topologySvg()` |

## Terminology the page enforces

- A registry is a catalog. It is never an invocation hop.
- A gateway routes and authorizes. It does not necessarily run the domain tools.
- Agent hosting, model hosting, MCP hosting, gateway and registry are separate decisions.
- Read and posting tools sit in separate domains with separate authorizations. This demo never posts to SAP.

## Evidence summary (read 2026-11-24)

| Finding | Source | Consequence |
|---|---|---|
| Apigee MCP proxies expose existing APIs as MCP tools derived from OpenAPI 3.0.x; OAuth 2.1 and OIDC are supported; a proxy can also front your own MCP server. | Apigee MCP overview and quickstart | Apigee is an MCP gateway and exposure layer, not a general Python MCP-server runtime. |
| API hub imports Apigee MCP proxies and syncs MCP tools to Agent Registry; sync is on by default; manually styled MCP APIs are not synced. | API hub registration and Agent Registry integration | S1 and S3 have a Google-side catalog without custom sync. Release status of the integration needs checking. |
| AgentCore Gateway MCP-server targets support no auth, gateway role, OAuth (client credentials, authorization code, token exchange) and API key. Caller IAM and token passthrough are not offered. | Gateway outbound authorization | The S3 hop to Apigee cannot pass the caller's token through. Token exchange behaviour is unproven. |
| AgentCore Runtime hosts MCP servers over Streamable HTTP; container, ARM64, port 8000. | Runtime MCP servers | In S2 a coded Finance MCP server runs on Runtime, not in the Gateway. |
| AWS Agent Registry is a discovery and approval catalog. Only approved records are discoverable. The newer namespace is `agent-registry`. | AWS Agent Registry | Registry is separate from the Gateway. Use the current namespace. No cross-platform sync with Apigee API hub is documented. |
| SAP Integration Suite can host MCP Server artifacts on Integration Cell from an API, an OpenAPI HTTP endpoint or RFC. | SAP Help: MCP Server | A fourth, SAP-managed option. Not assumed in S1 to S3. Tenant entitlement is unchecked. |
| Principal propagation through Integration Suite and Cloud Connector is described mainly in SAP Community posts; a client-credentials token carries no user. | SAP Community | Treat user delegation as NOT_VERIFIED until proven in the tenant. |

Details with links and the validation still required for each row are on the tab.

## Recommendation (proposal, not approval)

Use **S1** as the proof-of-concept baseline for the SAP Finance domain interface: it keeps the domain contract on the SAP-facing side, has one gateway hop and one identity mapping to prove, and matches documented Apigee capability for a read-heavy baseline. Choose **S2** if enterprise standards already host domain MCP servers on AgentCore. Justify **S3** only by a named control that one gateway cannot meet; otherwise it duplicates policy. A failed identity test between the gateway and Integration Suite would reopen all three.

## Status vocabulary

- **Vendor-documented · tenant NOT_VERIFIED**: a product page states the capability; our tenant is unchecked.
- **Design assumption**: our proposal, not documented behaviour.
- **TBD — REQUIRES VALIDATION**: evidence missing. No component was invented to fill the gap.

## Open items that only the owner or the tenant can close

1. Which team owns the Finance domain MCP interface, and the approval authority across both registries.
2. Whether Apigee MCP, the API hub and Agent Registry are enabled in the tenant and region, and their release status.
3. Delegated user identity versus service identity, and Cloud Connector token exchange to ABAP roles.
4. A real AgentCore Gateway to Apigee call to settle protocol version, token exchange and tool naming.
5. Cost, latency and egress, which are unmeasured.
