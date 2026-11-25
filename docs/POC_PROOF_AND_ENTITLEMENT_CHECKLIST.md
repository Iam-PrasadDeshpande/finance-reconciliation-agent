# POC proof and entitlement checklist (Architecture V5.2)

Status: a checklist for the owner and platform teams. Nothing here has been run by this application: no tenant is connected. On 2026-11-25 the owner stated that tenant entitlements are live; that is recorded as owner-confirmed, not verified. Each line is PASS, HOLD or NOT_VERIFIED only when a named owner confirms it in writing. The five open decisions behind it are in the Decision brief page and `poc/architecture_model.py` (`DECISIONS`).

## 1. Entitlement and capability, before any build

| Item | Applies to | Documented capability | Confirm in the tenant | Owner |
|---|---|---|---|---|
| SAP BTP Cloud Foundry space and quota for the agent and any custom MCP | S1, S3 | Python buildpack, space quota plans, service plans and metering | Space exists, memory quota covers the agent, outbound path to Apigee and Portkey | SAP BTP platform team |
| Apigee MCP enabled for the organization | S1, S2, S3 | Existing APIs exposed as MCP tools; OpenAPI 3.0.x; 1000 tools per organization; capacity limits in some regions | Enablement, region, hybrid version if hybrid (1.17.4 or later for stateless) | SAP Integration |
| AgentCore Runtime and Gateway availability | S2 (S3-B) | Runtime hosts agents; Gateway has MCP, HTTP and inference targets | Region, account, quota | AWS platform team |
| AWS Agent Registry availability | S2, S3 | Records, curator approval, `agent-registry` namespace | Region, curator and publisher roles | AI Foundry |
| Registry for S1 | S1 | Decided: interim GitLab catalog (SAP AI Agent Hub is not available); integration team approves | A GitLab project for the catalog, record schema, discovery interface | Integration team |
| Portkey route to the approved model | all | LLM gateway | Route, credentials held in Portkey, fallback | AI platform |
| Identity provider that supports token exchange | S2 (user delegation) | AgentCore outbound OAuth: client credentials, authorization code, token exchange | Token exchange supported by the chosen server | Security |

## 2. Proofs, one per open decision

1. **S1 registry (GitLab catalog)**: register the agent and the Apigee MCP endpoint through a merge request approved by the integration team, discover them from another client through the published index, revoke one and confirm it disappears.
2. **AgentCore Gateway mandate**: AI Foundry's written confirmation is recorded (the owner states it is mandatory in S2 only). Only if the policy changes: a direct call to Apigee without a gateway-issued credential is rejected (S3-B).
3. **Registry publishing (S3)**: publish a record through the registry API from the GitLab release pipeline (no AWS connection into SAP), discover it, release a new version, retire the old record and confirm discovery shows only the approved version. Check that AWS can reach the Apigee URL and that the credential provider is in the same account (both not yet checked) only if registry synchronization is wanted.
4. **AgentCore Gateway to Apigee (S2)**: one `tools/list` and one `tools/call` through the gateway to Apigee and on to a read tool; first with service identity (client credentials, DEFAULT listing), then with user delegation (token exchange); record the SAP user in the evidence.
5. **Negative authorization (all)**: a tool the mapped user may not run is rejected by the SAP backend even though the agent can discover and call it.

## 3. What the documents already settle (read 2026-11-25)

- AgentCore Gateway and Apigee share four MCP protocol versions (2026-07-28, 2025-11-25, 2025-06-18, 2025-03-26).
- The gateway supports outbound OAuth client credentials, authorization code and token exchange for MCP-server targets; caller token passthrough is not supported.
- Apigee MCP supports OAuth 2.1 and OIDC and does not support SSE streams.
- Registry synchronization needs an HTTPS URL, runs on creation and on demand, reverts the record to draft and is not documented to remove stale tools.
- AgentCore Policy enforces Cedar rules at the gateway; the documents do not say that a target refuses calls that bypass it.
- The SAP Cloud Foundry runtime runs Python applications and uses space quota and service plans.

What they do not settle: any tenant entitlement, private-network reachability for the registry or the gateway target, the AgentCore target classification of an external MCP server, and the availability of SAP AI Agent Hub (its product page returned HTTP 403).
