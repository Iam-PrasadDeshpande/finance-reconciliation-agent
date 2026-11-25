# POC proof and entitlement checklist (Architecture V5.2)

Status: a checklist for the owner and platform teams. Nothing here has been run by this application: no tenant is connected. On 2026-11-25 the owner stated that tenant entitlements are live; that is recorded as owner-confirmed, not verified. A line is PASS, HOLD or NOT_VERIFIED only when a named owner confirms it in writing.

## 1. Entitlement and capability, before any build

| Item | Applies to | Confirm | Owner |
|---|---|---|---|
| Dedicated SAP-agent AWS account, region, quotas | S2, S3 | Approved in the AWS Organization; AgentCore Runtime, Gateway and Registry usable | AI Foundry + AWS platform |
| Central AWS Agent Registry and cross-account sharing | all | Registry owned by AI Foundry; publisher and consumer permissions; sharing through AWS Organizations and RAM | AI Foundry |
| SAP BTP Cloud Foundry space, quota and contractual charges | S1 | Space and memory quota fit the agent and custom MCP; consumption cost known | SAP BTP platform team |
| Apigee MCP enabled | S1, S3 (S2 optional) | Enabled, region, hybrid version if hybrid (1.17.4 or later for stateless) | SAP Integration |
| Portkey route to the approved model | all | Route, credentials held in Portkey, fallback | AI platform |
| Identity provider that supports token exchange | S2, S3 | Token exchange for user delegation | Security |
| GitLab pipelines and runners | all | Pipelines deploy the runtime, targets, bundles and registry records | Platform engineering |

## 2. Validations (compare S2 and S3 first; S1 as a baseline)

Dedicated account service access; AgentCore Runtime operation; AgentCore Gateway tool invocation; AWS Agent Registry registration and discovery; cross-account registry access; Apigee-managed MCP endpoint; S2 direct Integration Suite or API target pattern, if permitted; S3 Gateway-to-Apigee pattern; Portkey model invocation; delegated business-user identity; backend SAP authorization with an authorized and an unauthorized user on the same read-only tool; read-only reconciliation accuracy; network and gateway latency; execution cost; operational logs and audit; failure and retry handling; incident and support ownership.

## 3. Decision logic

Select S3 only when the account and services are approved, Apigee remains in the approved SAP integration design, gateway-to-gateway invocation works, principal propagation is validated, policy ownership is clear, cost is competitive and operations are acceptable. Select S2 where AgentCore-native MCP or API access meets enterprise and SAP policy with lower complexity or cost. Select S1 where SAP-specific execution or verified cost justifies Cloud Foundry. Platform preference alone decides nothing.

## 4. What the documents already settle (read 2026-11-25)

AgentCore Gateway and Apigee share four MCP protocol versions; the gateway supports outbound OAuth client credentials, authorization code and token exchange but not caller passthrough; Apigee MCP supports OAuth 2.1 and OIDC and not SSE; registry synchronization needs an HTTPS URL, runs on creation and on demand, reverts the record to draft and is not documented to remove stale tools; AgentCore Policy enforces at the gateway; the Cloud Foundry runtime runs Python with space quotas. They do not settle any tenant entitlement, private-network reachability, the target classification of an external MCP server, or cross-account registry sharing.
