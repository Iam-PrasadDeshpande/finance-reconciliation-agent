"""Canonical architecture model, Architecture V5.2: the single source of truth for the three scenarios and the stated preference (S1 and S3 preferred, S2 kept for reference).

Everything the Architecture pages show (scenarios, comparison, connections, diagrams D1..D10, the recommendation framework, the cost model,
the AWS account proposal and the decision register) is defined here, exported to ``frontend/src/architectureModel.json`` by
``scripts/build_architecture_model.py`` and checked by ``tests/test_architecture_model.py``. Nothing here is tenant evidence and nothing is
provisioned: it is a proposed design for evaluation.

PREFERENCE (owner statement): S1 is preferred for SAP-centric agents and S3 is preferred for agents that span SAP and non-SAP systems.
S2 stays in the architecture for reference and is not preferred; selecting it needs an explicit owner exception.

S1  SAP-hosted hybrid:           SAP BTP Cloud Foundry agent + Apigee MCP; AWS Agent Registry for registration only. Preferred for SAP-centric agents.
S2  AWS AgentCore-native:        AgentCore Runtime agent + AgentCore Gateway + AgentCore-hosted or API-backed MCP; Apigee optional. Not preferred; kept for reference.
S3  AWS AgentCore + Apigee:      AgentCore Runtime agent + AgentCore Gateway fronting Apigee MCP; dedicated SAP-agent AWS account (proposed).
                                 Preferred for SAP and non-SAP agents, conditional on account approval, identity, interoperability and cost.
Common: Portkey is the LLM gateway; SAP Integration Suite is the SAP integration boundary; the SAP backend decides business authorization;
GitLab is the source, CI/CD and artifact platform that deploys everything (it is never a runtime).
"""
from __future__ import annotations

import re

MODEL_VERSION = "5.2"
STATUS_BANNER = "PROPOSED DESIGN FOR EVALUATION · NOT TENANT-VERIFIED · NOT AN APPROVED ARCHITECTURE"
SCENARIO_IDS = ("S1", "S2", "S3")
PREFERENCE_LINE = "Preference: S1 for SAP-centric agents · S3 for SAP and non-SAP agents · S2 is kept in the architecture for reference and is not preferred"
PREFERENCE = {
    "S1": {"label": "Preferred", "scope": "SAP-centric agents", "badge": "PREFERRED · SAP-centric agents", "text": "Preferred option for SAP-centric agents."},
    "S2": {"label": "Not preferred", "scope": "Reference only", "badge": "NOT PREFERRED · kept for reference", "text": "Kept in the architecture for reference; not preferred. Selecting it needs an explicit owner exception."},
    "S3": {"label": "Preferred", "scope": "SAP and non-SAP agents", "badge": "PREFERRED · SAP and non-SAP agents", "text": "Preferred option for agents that span SAP and non-SAP systems; conditional, not yet approved."},
}
PENDING = "TBD · REQUIRES VALIDATION"
OWNER_DATE = "2026-11-25"
AWS_REGISTRY = "AWS Agent Registry"
GITLAB = "GitLab (central platform): source, specs, descriptors, CI/CD pipelines and artifacts"

# --------------------------------------------------------------------------- scenarios
SCENARIOS: dict[str, dict] = {
    "S1": {
        "id": "S1", "name": "S1 · SAP-hosted hybrid", "short": "SAP-hosted hybrid",
        "status": "Preferred for SAP-centric agents",
        "classification": "Preferred option for SAP-centric agents, where SAP coupling is high or verified platform economics justify SAP BTP execution; also the fallback when AWS execution is unavailable.",
        "objective": "SAP BTP Cloud Foundry hosts and executes the agent. Apigee exposes the SAP MCP capability. AWS Agent Registry holds registration and discovery metadata only; no AgentCore component runs anything.",
        "agent_runtime": "SAP BTP Cloud Foundry", "agent_hosting_owner": "SAP BTP platform team",
        "agent_execution_endpoint": "Cloud Foundry application route (agent API)",
        "ui_hosting": "SAP Fiori launchpad or the existing application UI",
        "mcp_client": "Inside the agent process on Cloud Foundry",
        "mcp_endpoint_type": "Apigee-managed MCP endpoint (Pattern A); custom MCP server on Cloud Foundry behind Apigee only where logic needs code (Pattern B)",
        "mcp_gateway": "Google Apigee (SAP-facing MCP/API gateway and runtime gateway)",
        "custom_mcp_runtime": "SAP BTP Cloud Foundry, if required", "custom_mcp_hosting_owner": "SAP BTP platform team",
        "mcp_tool_execution_location": "Pattern A: API operation behind Apigee. Pattern B: the custom MCP service on Cloud Foundry",
        "agent_registry": AWS_REGISTRY, "mcp_registry": AWS_REGISTRY,
        "registry_publisher_approver": "Integration team with the respective technical approvals; records published from the GitLab pipeline; AWS Agent Registry curator approves",
        "registry_sync": "Records are published to AWS Agent Registry from the GitLab release pipeline through the registry API; synchronization from the endpoint URL only if Security approves AWS reaching it",
        "agent_discovery": "AWS Agent Registry search, approved records only",
        "mcp_tool_discovery": "Apigee MCP tools/list at the endpoint; endpoint metadata in AWS Agent Registry",
        "apigee_role": "Required: the SAP-facing MCP endpoint and runtime gateway",
        "agentcore_runtime": False, "agentcore_gateway": False, "aws_agent_registry": True,
        "aws_account": "Not used for execution. Registry records live in the central AI Foundry governance account",
        "llm_gateway": "Portkey", "llm_boundary": "Cloud Foundry agent → Portkey → approved LLM provider. No direct provider route",
        "integration_suite": "SAP Integration Suite (API Management / Cloud Integration)",
        "cloud_connector": "SAP Cloud Connector, where the system connectivity model needs it (conditional)",
        "backend_authorization": "Target SAP backend roles of the mapped user or service identity",
        "identity_boundary": "Corporate IdP or SAP Cloud Identity Services (IAS, candidate) → Cloud Foundry agent → Apigee → Integration Suite; token exchange and user mapping subject to validation",
        "persistence": "Conditional: existing approved service, or SAP HANA Cloud where justified",
        "monitoring_audit": "SAP BTP logs for the agent; Apigee analytics; Integration Suite monitoring; SAP change documents; registry publication audit",
        "artifact_repository": GITLAB + "; Cloud Foundry application artifacts; Apigee bundles",
        "trust_boundaries": ["SAP BTP", "Google Apigee", "SAP landscape", "AWS (control plane only)", "Portkey / LLM provider"],
        "assumptions": ["Direct Apigee invocation from Cloud Foundry is approved by SAP Integration and Security", "AWS Agent Registry can hold records for agents and MCP servers that run outside AWS"],
        "unverified": ["Actual Cloud Foundry consumption and contractual charges for frequent agent workloads", "Scaling and capacity of Cloud Foundry for the workload", "Supportability of custom orchestration on Cloud Foundry", "Cross-cloud registry publication and synchronization", "Enterprise approval of direct Apigee invocation"],
        "policy_dependencies": ["Enterprise permits centrally registered but SAP-hosted agents", "SAP Integration approves direct Apigee invocation"],
        "hosting_note": "SAP BTP executes; AWS Agent Registry only registers. Choosing the registry does not move the agent to AWS.",
        "advantages": ["SAP-domain application and process ownership", "Closer alignment with SAP integration and BTP services", "Reuse of existing BTP operating practices"],
        "considerations": ["Cloud Foundry consumption and contractual charges", "Scaling and capacity for frequent agent workloads", "Supportability of custom orchestration", "Cross-cloud registry publication", "Approval of direct Apigee invocation"],
    },
    "S2": {
        "id": "S2", "name": "S2 · AWS AgentCore-native", "short": "AgentCore-native",
        "status": "Not preferred · kept for reference",
        "classification": "Kept in the architecture for reference and not preferred. It is technically valid where AgentCore meets the requirements without an additional Apigee gateway, but selecting it needs an explicit owner exception.",
        "objective": "AWS owns agent execution, any custom MCP execution and the runtime gateway: AgentCore Runtime hosts the agent and eligible MCP servers, AgentCore Gateway mediates the tools, AWS Agent Registry registers them. Apigee is optional, only where SAP Integration and Security require it.",
        "agent_runtime": "AWS AgentCore Runtime", "agent_hosting_owner": "AWS cloud platform team (SAP-agent account)",
        "agent_execution_endpoint": "AgentCore Runtime agent invocation endpoint",
        "ui_hosting": "Existing application UI or SAP Fiori acting as an agent client",
        "mcp_client": "Inside the agent process on AgentCore Runtime",
        "mcp_endpoint_type": "AgentCore Gateway MCP endpoint to the agent; an AgentCore Runtime MCP server target, or an approved API/OpenAPI target that avoids a custom server",
        "mcp_gateway": "AWS AgentCore Gateway (runtime gateway); Google Apigee only where SAP Integration policy requires it",
        "custom_mcp_runtime": "AWS AgentCore Runtime, when required", "custom_mcp_hosting_owner": "AWS cloud platform team",
        "mcp_tool_execution_location": "A custom MCP server on AgentCore Runtime, or an API operation behind an approved Gateway API target; the target must be validated before use",
        "agent_registry": AWS_REGISTRY, "mcp_registry": AWS_REGISTRY,
        "registry_publisher_approver": "Integration team with the respective technical approvals publishes; AWS Agent Registry curator (AI Foundry) approves",
        "registry_sync": "Registry records created from agent and MCP descriptors by the GitLab pipeline; external sources via registry synchronization where supported",
        "agent_discovery": "AWS Agent Registry search, approved records only",
        "mcp_tool_discovery": "AgentCore Gateway tools/list (tool names prefixed with the target name); MCP descriptor in AWS Agent Registry",
        "apigee_role": "Optional: inserted into the approved downstream route only where SAP Integration and Security require it; never bypassed silently",
        "agentcore_runtime": True, "agentcore_gateway": True, "aws_agent_registry": True,
        "aws_account": "Dedicated SAP-agent AWS account (proposed, not provisioned); central registry in the AI Foundry governance account",
        "llm_gateway": "Portkey", "llm_boundary": "AgentCore Runtime agent → Portkey → approved LLM provider. No direct provider route",
        "integration_suite": "SAP Integration Suite (API Management / Cloud Integration)",
        "cloud_connector": "SAP Cloud Connector, where the system connectivity model needs it (conditional)",
        "backend_authorization": "Target SAP backend roles of the mapped user or service identity",
        "identity_boundary": "Corporate IdP → AgentCore Runtime / AgentCore Identity → AgentCore Gateway → Integration Suite (or Apigee where inserted); token exchange and user mapping subject to validation",
        "persistence": "Conditional: approved AWS persistence service",
        "monitoring_audit": "AgentCore Runtime and Gateway observability; Integration Suite monitoring; SAP change documents; registry publication audit",
        "artifact_repository": GITLAB + "; the AgentCore runtime image, gateway target definitions and registry record definitions are deployed from GitLab",
        "trust_boundaries": ["AWS (SAP-agent account)", "AWS (AI Foundry governance account)", "SAP landscape", "Portkey / LLM provider"],
        "assumptions": ["An approved API/OpenAPI target or a custom MCP on AgentCore Runtime can reach the SAP Integration Suite API", "SAP Integration and Security accept the route without Apigee, or approve Apigee as an exception"],
        "unverified": ["AgentCore Runtime, Gateway and Registry entitlements, quota and region in the dedicated account", "API/OpenAPI target schema, authentication and connectivity to Integration Suite", "SAP API policy exceptions if Apigee is omitted", "Cross-platform user identity", "Custom MCP lifecycle ownership"],
        "policy_dependencies": ["SAP Integration policy on whether Apigee is mandatory for the SAP API route", "AWS account approval and service availability"],
        "hosting_note": "AgentCore Runtime hosts, AgentCore Gateway mediates, AWS Agent Registry registers: three distinct capabilities. Apigee is optional, not assumed.",
        "advantages": ["Centralized AWS runtime and tool-management capabilities", "Less dependence on SAP BTP for general-purpose agent compute", "Potentially simpler runtime architecture for AWS-native MCP capabilities", "Consistent AgentCore operational tooling"],
        "considerations": ["AgentCore Runtime and Gateway costs", "Custom MCP lifecycle management", "SAP API gateway policy exceptions if Apigee is omitted", "Cross-platform user identity", "AWS account permissions and service availability", "Responsibility for SAP-specific API policies"],
    },
    "S3": {
        "id": "S3", "name": "S3 · AWS AgentCore + Apigee hybrid", "short": "AgentCore + Apigee",
        "status": "Preferred for SAP and non-SAP agents · conditional",
        "classification": "Preferred option for agents that span SAP and non-SAP systems, conditional on account approval, identity validation, gateway interoperability, enterprise policy and measured comparative cost. Not production-approved.",
        "objective": "AWS AgentCore Runtime executes the agent, AgentCore Gateway is the enterprise runtime gateway, and Google Apigee stays the SAP-facing MCP/API gateway in front of SAP Integration Suite. AWS Agent Registry registers agents and MCP endpoints on a separate control-plane path. A dedicated SAP-agent AWS account is proposed.",
        "agent_runtime": "AWS AgentCore Runtime", "agent_hosting_owner": "AWS cloud platform team (SAP-agent account)",
        "agent_execution_endpoint": "AgentCore Runtime agent invocation endpoint",
        "ui_hosting": "SAP Fiori or an enterprise application client",
        "mcp_client": "Inside the agent process on AgentCore Runtime (framework executing in the runtime)",
        "mcp_endpoint_type": "AgentCore Gateway MCP endpoint to the agent; Apigee-managed MCP endpoint (Pattern A) to SAP; custom MCP behind Apigee only where Apigee-managed MCP is insufficient (Pattern B)",
        "mcp_gateway": "AWS AgentCore Gateway (enterprise runtime gateway) in front of Google Apigee (SAP-facing MCP/API gateway)",
        "custom_mcp_runtime": "Conditional: an approved runtime, preferably AgentCore Runtime for AWS-owned code, exposed through Apigee", "custom_mcp_hosting_owner": "AWS cloud platform team",
        "mcp_tool_execution_location": "Pattern A: API operation behind Apigee. Pattern B: the custom MCP service on its approved runtime, reached through Apigee",
        "agent_registry": AWS_REGISTRY, "mcp_registry": AWS_REGISTRY,
        "registry_publisher_approver": "Integration team with the respective technical approvals publishes from GitLab; AWS Agent Registry curator (AI Foundry) approves",
        "registry_sync": "AgentCore agent record and Apigee MCP endpoint metadata are published to AWS Agent Registry as a control-plane path; gateway target configuration is a separate runtime responsibility",
        "agent_discovery": "AWS Agent Registry search, approved records only",
        "mcp_tool_discovery": "AgentCore Gateway tools/list toward the agent; Apigee tools/list behind it; the registry record is metadata only",
        "apigee_role": "Required: the SAP-facing MCP endpoint behind AgentCore Gateway",
        "agentcore_runtime": True, "agentcore_gateway": True, "aws_agent_registry": True,
        "aws_account": "Dedicated SAP-agent AWS account (proposed, not provisioned) with separate environments; the central registry may live in the AI Foundry governance account",
        "llm_gateway": "Portkey", "llm_boundary": "AgentCore Runtime → Portkey → approved enterprise LLM. No direct provider route",
        "integration_suite": "SAP Integration Suite (API Management / Cloud Integration)",
        "cloud_connector": "SAP Cloud Connector, only for the applicable private-connectivity route (conditional)",
        "backend_authorization": "Target SAP backend roles of the mapped user or service identity",
        "identity_boundary": "Corporate IdP → AgentCore Runtime / AgentCore Identity → AgentCore Gateway → Apigee → Integration Suite → SAP backend; two token hops to validate",
        "persistence": "Conditional: approved AWS persistence service",
        "monitoring_audit": "AgentCore Runtime and Gateway observability; Apigee analytics; Integration Suite monitoring; SAP change documents; one correlation id joined across all of them",
        "artifact_repository": GITLAB + "; the AgentCore runtime image, gateway targets, Apigee bundles and registry record definitions are deployed from GitLab",
        "trust_boundaries": ["AWS (SAP-agent account)", "AWS (AI Foundry governance account)", "Google Apigee", "SAP landscape", "Portkey / LLM provider"],
        "assumptions": ["AgentCore Gateway can register the Apigee MCP endpoint as a target and exchange tokens", "Apigee remains part of the approved SAP integration design", "The dedicated AWS account is approved with the AgentCore services"],
        "unverified": ["AgentCore Gateway to Apigee: MCP protocol versions overlap (2026-07-28, 2025-11-25, 2025-06-18, 2025-03-26) and outbound OAuth and token exchange are documented, but no end-to-end call has been made", "Whether the Apigee endpoint is reachable from AWS (not yet checked)", "Whether the registry credential provider is in the same AWS account (not yet checked)", "Whether an external MCP server is an MCP or an HTTP target for the gateway; Apigee MCP does not support SSE streams", "Non-duplicative responsibilities of the two gateways, quota ownership and tool naming", "Dedicated account approval, quotas and region", "Comparative cost against S1 (and S2, kept for reference)"],
        "policy_dependencies": ["AI Foundry and SAP Integration approve the gateway ownership boundaries", "Dedicated SAP-agent AWS account approved", "Enterprise approval of the additional gateway hop and its cost"],
        "hosting_note": "AgentCore Gateway fronts Apigee: two gateways in series with separate responsibilities. AWS Agent Registry is never an execution hop.",
        "advantages": ["AWS-managed agent execution", "SAP-specific MCP/API governance retained through Apigee", "Central agent and MCP registration", "Potential separation of compute cost from SAP BTP", "Reusable for multiple SAP systems", "Consistent Portkey LLM governance"],
        "considerations": ["Two runtime gateways need non-duplicative responsibilities", "AgentCore-to-Apigee authentication and token exchange", "An additional network hop and gateway charges", "MCP protocol and tool schema compatibility", "Possible duplicated tool catalogs and policy controls", "Multi-cloud incident management and audit correlation", "Separate AWS account approval and operational ownership"],
    },
}
for _sid, _sc in SCENARIOS.items():
    _sc["preference"] = PREFERENCE[_sid]

# --------------------------------------------------------------------------- comparison
COMPARISON: list[tuple[str, str, str, str]] = [
    ("Preference", "Preferred for SAP-centric agents", "Not preferred · kept for reference", "Preferred for SAP and non-SAP agents · conditional"),
    ("Agent hosting", "SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "AWS AgentCore Runtime"),
    ("MCP / agent hosting", "Agent: Cloud Foundry · MCP: Apigee", "Agent: AgentCore · MCP: AgentCore Gateway", "Agent: AgentCore · MCP: Apigee → AgentCore Gateway"),
    ("Agent execution", "Cloud Foundry application", "AgentCore Runtime agent", "AgentCore Runtime agent"),
    ("AWS account", "Not used for execution; registry in the central governance account", "Dedicated SAP-agent account (proposed)", "Dedicated SAP-agent account (proposed)"),
    ("Runtime gateway", "Google Apigee", "AWS AgentCore Gateway", "AWS AgentCore Gateway in front of Google Apigee"),
    ("Apigee", "Required: SAP-facing MCP endpoint", "Optional, only where SAP Integration and Security require it", "Required: SAP-facing MCP endpoint"),
    ("Managed MCP endpoint versus custom server", "Pattern A (Apigee-managed) by default; Pattern B only where logic needs code", "API/OpenAPI Gateway target avoids a custom server; a custom MCP on AgentCore Runtime where needed", "Pattern A by default; Pattern B only where Apigee-managed MCP is insufficient"),
    ("Custom MCP server hosting", "SAP BTP Cloud Foundry, if required", "AWS AgentCore Runtime, when required", "Conditional; AgentCore Runtime preferred for AWS-owned code, exposed through Apigee"),
    ("MCP tool execution", "Behind Apigee: API operation, or the Cloud Foundry service", "Behind the Gateway: AgentCore-hosted MCP or an API target", "Behind Apigee: API operation, or the custom MCP service"),
    ("Agent registry", AWS_REGISTRY, AWS_REGISTRY, AWS_REGISTRY),
    ("MCP registry", AWS_REGISTRY, AWS_REGISTRY, AWS_REGISTRY),
    ("LLM routing", "Portkey", "Portkey", "Portkey"),
    ("Persistence", "Conditional: existing approved service, or SAP HANA Cloud where justified", "Conditional: approved AWS service", "Conditional: approved AWS service"),
    ("Identity propagation", "IdP or IAS to the agent, Apigee, Integration Suite; mapping to validate", "IdP to AgentCore Identity and Gateway, then Integration Suite; mapping to validate", "IdP to AgentCore Identity, Gateway, Apigee and Integration Suite; two token hops to validate"),
    ("SAP connectivity", "Apigee → Integration Suite → Cloud Connector where applicable → SAP backend", "Gateway (or Apigee if inserted) → Integration Suite → Cloud Connector where applicable → SAP backend", "Gateway → Apigee → Integration Suite → Cloud Connector where applicable → SAP backend"),
    ("Business authorization", "SAP backend, always", "SAP backend, always", "SAP backend, always"),
    ("Operational responsibility", "SAP BTP team runs the agent; integration team runs Apigee", "AWS team runs agent, gateway and MCP; Apigee team only if inserted", "AWS team runs agent and gateway; integration team runs Apigee; two teams share incidents"),
    ("Monitoring and audit", "BTP logs, Apigee analytics, Integration Suite monitoring", "AgentCore observability plus SAP-side sources", "AgentCore, Apigee and SAP-side sources joined by a correlation id"),
    ("Scalability", "Cloud Foundry application scaling within BTP quota", "AgentCore managed runtime scaling", "AgentCore managed runtime scaling; Apigee capacity limits apply"),
    ("Network complexity", "Cloud Foundry → Apigee → Integration Suite", "AWS → Integration Suite (or via Apigee)", "AWS → Apigee (cross-cloud) → Integration Suite; extra gateway hop"),
    ("Cost drivers", "BTP runtime and credits, Apigee, Integration Suite, Portkey", "AgentCore Runtime and Gateway, Agent Registry, Integration Suite, Portkey", "AgentCore Runtime and Gateway, Apigee, Agent Registry, Integration Suite, Portkey, cross-cloud transfer"),
    ("Vendor and platform dependencies", "SAP BTP, Google Apigee, AWS (registry only)", "AWS, SAP", "AWS, Google Apigee, SAP"),
    ("Enterprise governance alignment", "Central registration with SAP execution ownership", "Aligned with AWS-centric AI Foundry governance", "Central registration plus SAP-facing MCP governance"),
    ("Deployment prerequisites", "Cloud Foundry space and quota, Apigee MCP, GitLab pipeline, registry access", "Dedicated AWS account, AgentCore services, GitLab pipeline, registry access", "As S2 plus Apigee MCP and a gateway-to-Apigee target"),
    ("Open architecture decisions", "Approval of direct Apigee invocation; Cloud Foundry economics", "Whether Apigee is mandated; API target validity", "Account approval, interoperability, identity, comparative cost, gateway ownership"),
]

# --------------------------------------------------------------------------- connections
CONN_COLS = ["Source", "Destination", "Plane", "Protocol", "Authentication", "Verification"]
DOC = "Vendor-documented · tenant NOT_VERIFIED"
DES = "Design assumption"


def _tail(agent: str, via: str, registry_note: str, extra: list[list[str]] | None = None) -> list[list[str]]:
    rows = [["SAP Fiori / existing UI", agent, "Runtime", "HTTPS", "User sign-in; delegated token to validate", DES]]
    rows += extra or []
    rows += [
        [via, "SAP Integration Suite", "Runtime", "HTTPS REST or OData", "OAuth client or certificate; mapping to validate", DES],
        ["SAP Integration Suite", "SAP Cloud Connector (conditional)", "Runtime", "HTTPS tunnel", "Cloud Connector subaccount trust", "Applicable only for private connectivity"],
        ["SAP Cloud Connector or Integration Suite", "SAP backend (S/4HANA · Central Finance)", "Runtime", "RFC / OData", "Principal propagation or technical user; SAP roles decide", DES],
        [agent, "Portkey", "LLM", "HTTPS", "Portkey credential; provider keys held in Portkey", DES],
        ["Portkey", "Approved LLM provider", "LLM", "HTTPS", "Provider credential held in Portkey", DES],
        ["GitLab CI/CD", "Deployment targets", "Deployment (not invocation)", "Pipeline", "Pipeline service identity", DES],
        [agent, AWS_REGISTRY, "Registration (not invocation)", "Registry API", "Registry identity, separate from runtime identity", registry_note],
    ]
    return rows


CONNECTIONS: dict[str, list[list[str]]] = {
    "S1": _tail("Cloud Foundry agent (MCP client)", "Apigee MCP endpoint", DOC, [
        ["Cloud Foundry agent (MCP client)", "Apigee MCP endpoint", "Runtime", "MCP over Streamable HTTP", "OAuth 2.1 / OIDC bearer or API key per product", DOC],
        ["Apigee MCP endpoint", "Custom MCP on Cloud Foundry (Pattern B)", "Runtime (conditional)", "HTTPS proxy target", "Target credential held by Apigee", "Only where custom logic is required"]]),
    "S2": _tail("AgentCore Runtime agent (MCP client)", "AgentCore Gateway", DOC, [
        ["AgentCore Runtime agent (MCP client)", "AgentCore Gateway", "Runtime", "MCP over Streamable HTTP", "JWT bearer validated by the gateway authorizer, or IAM", DOC],
        ["AgentCore Gateway", "Custom MCP on AgentCore Runtime", "Runtime (conditional)", "MCP over Streamable HTTP", "Outbound OAuth or gateway role", "Only where a custom MCP is required"],
        ["AgentCore Gateway", "API / OpenAPI target (alternative)", "Runtime (alternative)", "HTTPS, target schema", "Credential provider per target", "Schema, authentication and connectivity must be checked first"],
        ["AgentCore Gateway", "Apigee MCP endpoint (optional)", "Runtime (conditional)", "MCP over Streamable HTTP", "Outbound OAuth or token exchange", "Only where SAP Integration policy requires Apigee"]]),
    "S3": _tail("AgentCore Runtime agent (MCP client)", "Apigee MCP endpoint", DOC, [
        ["AgentCore Runtime agent (MCP client)", "AgentCore Gateway", "Runtime", "MCP over Streamable HTTP", "JWT bearer validated by the gateway authorizer, or IAM", DOC],
        ["AgentCore Gateway", "Apigee MCP endpoint", "Runtime", "MCP over Streamable HTTP; four shared protocol versions", "Outbound OAuth client credentials or token exchange; passthrough is not supported", PENDING],
        ["Apigee MCP endpoint", "Custom MCP service (Pattern B, conditional)", "Runtime (conditional)", "HTTPS proxy target", "Target credential held by Apigee", "Only where Apigee-managed MCP is insufficient"],
        ["Apigee MCP endpoint metadata", AWS_REGISTRY, "Registration (not invocation)", "Registry API", "Registry identity, separate from runtime identity", PENDING]]),
}

# --------------------------------------------------------------------------- gateway responsibilities and identity
GATEWAY_RESPONSIBILITIES: list[tuple[str, str, str, str]] = [
    ("Agent-facing MCP access", "Candidate: enterprise entry for agents (MCP endpoint, tool discovery)", "Not the agent-facing entry in S3", "Validate in the POC"),
    ("Inbound authentication and authorization", "Candidate: JWT, IAM or authenticate-only; Cedar policy in enforce mode", "Candidate: OAuth 2.1 / OIDC or API key per API product", "Neither is assumed to provide every function; validate supported features"),
    ("Gateway target configuration", "Candidate: MCP-server, OpenAPI and function targets; tool names prefixed with the target name", "Not applicable", "Target classification of an external MCP server is ambiguous in the documents"),
    ("Outbound credentials", "Candidate: client credentials, authorization code, token exchange, API key, gateway role; no caller passthrough", "Candidate: target credentials held for the SAP-facing API", "Two credential hops in S3"),
    ("SAP-facing MCP/API exposure", "Not the SAP-facing layer", "Candidate: API products expose Integration Suite APIs as MCP tools; OpenAPI 3.0.x; 1000 tools per organization", "Apigee is not arbitrary agent-code hosting"),
    ("Domain-specific tool access control", "Enterprise tool-access policies", "API products and apps filter which tools a client sees", "Avoid duplicated or conflicting policies"),
    ("Schema and backend routing", "Target schema to the next hop", "OpenAPI schema and routing to Integration Suite", "One owner per schema"),
    ("Telemetry", "Runtime gateway telemetry", "Domain traffic analytics", "A correlation id must join both; products do not share a trace id automatically"),
    ("Rate limits and quotas", "Gateway quotas", "API product quotas and capacity limits", "Quota ownership to be agreed"),
]

IDENTITY_CHAIN: list[tuple[str, str, str]] = [
    ("Business user", "Enterprise authentication (corporate IdP; SAP Cloud Identity Services as a candidate trust component)", "User identity; Global User ID is a correlation attribute where supported, not proof of propagation"),
    ("Agent workload", "AgentCore Runtime / AgentCore Identity (S2, S3) or Cloud Foundry (S1)", "Workload identity, separate from the user"),
    ("MCP client", "Inside the agent process", "Token presented to the first gateway"),
    ("Gateway / service", "AgentCore Gateway, then Apigee (S3); Apigee (S1); AgentCore Gateway (S2)", "Inbound validation and outbound token exchange or credential"),
    ("SAP integration", "SAP Integration Suite, then Cloud Connector where applicable", "Service identity toward SAP; principal propagation to validate"),
    ("SAP backend", "S/4HANA / Central Finance", "Execution identity: mapped user or technical user; SAP roles decide business authorization"),
]

# --------------------------------------------------------------------------- AWS account proposal
ACCOUNT = {
    "status": "PROPOSED · NOT PROVISIONED · NO AWS RESOURCE IS CREATED BY THIS APPLICATION",
    "topology": [
        ["AI Foundry governance account", "Owns AWS Agent Registry (central), curator and approval roles, shared with workload accounts", "Registry ownership; publisher and consumer permissions; record approval"],
        ["SAP-agent workload account (proposed)", "AgentCore Runtime and Gateway for SAP-related agents; separate environments (development, test, production) or another enterprise-approved arrangement", "IAM least privilege, SCP guardrails, egress to Apigee and Integration Suite, secrets and encryption, tagging"],
        ["AWS Organizations and landing zone", "Existing organization; landing-zone compliance; SCPs; region and data-residency policy", "Enterprise policy owner"],
        ["Shared services", "Portkey connectivity, central logging and monitoring, incident response, cost allocation and billing ownership", "Platform operations"],
    ],
    "evaluate": [
        "Dedicated account within the approved AWS Organization", "Enterprise landing-zone compliance", "Separation of development, test and production", "IAM roles and least-privilege access",
        "AWS Organizations SCP restrictions", "Region and data-residency policy", "AgentCore service availability and quotas", "AgentCore Runtime and Gateway permissions",
        "Approved networking and egress", "Access to Apigee and Integration Suite", "Approved Portkey connectivity", "Secrets management and encryption",
        "Cost allocation and billing ownership", "Operational monitoring and incident response", "Resource tagging and lifecycle policies",
    ],
    "registry_sharing": [
        "Registry ownership by AI Foundry in a central governance account", "Publisher permissions for the SAP-agent account", "Consumer permissions for discovering clients",
        "Record approval authority (curator)", "Cross-account sharing through AWS Organizations and AWS Resource Access Manager", "Region compatibility",
        "Metadata synchronization and endpoint reachability", "Revocation and versioning", "Registry service entitlements",
    ],
    "qualification": "Account provisioning does not prove access to every AgentCore capability. Confirm enterprise service policy, actual entitlements, permissions and regional support. Do not create a duplicate registry because execution uses a dedicated account.",
}

LIFECYCLE = ["Use-case intake", "Business and risk classification", "Architecture selection", "Identity and security design", "MCP/API contract", "Agent development", "Testing",
             "Registry publication", "Runtime validation", "Business approval", "Production release", "Monitoring and lifecycle management"]
GUARDRAILS = ["Approved agent and MCP ownership", "Version-controlled artifacts in GitLab", "LLM routing only through Portkey", "Least-privilege tool access", "User and workload identity separation",
              "Prompt-injection and data-exfiltration protection", "Read/write capability classification", "Human approval for applicable business operations", "SAP authorization and segregation of duties",
              "Timeouts, retries and idempotency", "Sensitive data handling and retention", "Cost budgets and alerts", "Centralized audit correlation", "Incident response",
              "Tool and agent revocation", "Rollback and recovery", "A registered skill never grants additional tool permissions"]
RACI = [
    ["Agent runtime (AgentCore or Cloud Foundry)", "AWS platform team / SAP BTP team", "AI Foundry", "Security", "Integration team"],
    ["Apigee MCP/API policies", "SAP Integration", "SAP Integration lead", "Security, AI Foundry", "Agent teams"],
    ["AgentCore Gateway targets and policy", "AWS platform team", "AI Foundry", "SAP Integration, Security", "Agent teams"],
    ["AWS Agent Registry records and approval", "Integration team (publish)", "AI Foundry (curator)", "Security", "Consumers"],
    ["LLM routing (Portkey)", "AI platform", "AI Foundry", "Security, Finance", "Agent teams"],
    ["SAP backend authorization", "SAP Security", "SAP Finance owner", "Integration team", "Agent teams"],
    ["GitLab pipelines and artifacts", "Platform engineering", "Integration team", "Security", "All teams"],
    ["Cost allocation and budgets", "FinOps", "Platform owners", "Finance", "Agent teams"],
]
POC_VALIDATIONS = [
    "Dedicated AWS account service access", "AgentCore Runtime operation", "AgentCore Gateway tool invocation", "AWS Agent Registry registration and discovery", "Cross-account registry access",
    "Apigee-managed MCP endpoint", "S2 direct Integration Suite/API pattern, if permitted", "S3 Gateway-to-Apigee pattern", "Portkey model invocation", "Delegated business-user identity",
    "Backend SAP authorization (authorized and unauthorized user, same tool)", "Read-only reconciliation accuracy", "Network and gateway latency", "Execution cost", "Operational logs and audit",
    "Failure and retry handling", "Incident and support ownership",
]

# --------------------------------------------------------------------------- recommendation framework
SELECTION_INPUTS = [
    {"id": "scope", "label": "Agent scope", "options": [["sap_and_non_sap", "Spans SAP and non-SAP systems"], ["sap_centric", "SAP-centric"]]},
    {"id": "aws_account", "label": "Dedicated SAP-agent AWS account", "options": [["approved", "Approved"], ["pending", "Pending"], ["denied", "Denied"]]},
    {"id": "agentcore", "label": "AgentCore Runtime, Gateway and Registry availability", "options": [["available", "Available"], ["pending", "Pending"], ["unavailable", "Unavailable"]]},
    {"id": "apigee", "label": "Apigee for the SAP route", "options": [["required", "Required"], ["optional", "Optional (exception possible)"], ["not_required", "Not required"], ["undecided", "Undecided"]]},
    {"id": "identity", "label": "Delegated user identity and SAP authorization", "options": [["validated", "Validated end to end"], ["pending", "Not yet validated"], ["failed", "Failed"]]},
    {"id": "interop", "label": "AgentCore Gateway to Apigee interoperability", "options": [["validated", "Validated"], ["pending", "Not yet validated"], ["failed", "Failed"]]},
    {"id": "cost", "label": "Verified comparative operating cost", "options": [["s3_competitive", "S3 is competitive"], ["s2_cheaper", "S2 is cheaper"], ["s1_cheaper", "S1 is cheaper"], ["unknown", "Not verified"]]},
    {"id": "ops", "label": "Operational ownership and support", "options": [["agreed", "Agreed"], ["pending", "Pending"], ["none", "Not available"]]},
    {"id": "sap_hosting", "label": "Enterprise permits centrally registered SAP-hosted agents", "options": [["permitted", "Permitted"], ["restricted", "Restricted"]]},
    {"id": "sap_coupling", "label": "SAP application coupling", "options": [["high", "High"], ["medium", "Medium"], ["low", "Low"]]},
    {"id": "security", "label": "Security restriction", "options": [["none", "None"], ["no_cross_cloud", "No cross-cloud runtime calls"], ["sap_only_execution", "Execution must stay on SAP"]]},
    {"id": "workload", "label": "Workload profile", "options": [["low_frequency", "Low-frequency SAP-specific agent"], ["high_frequency", "High-frequency analytical agent"], ["bursty", "Bursty enterprise agent"], ["long_running", "Long-running reconciliation workflow"], ["multi_agent", "Multi-agent and multi-tool orchestration"]]},
]
SELECTION_DEFAULTS = {"scope": "sap_and_non_sap", "aws_account": "pending", "agentcore": "pending", "apigee": "required", "identity": "pending", "interop": "pending", "cost": "unknown", "ops": "pending",
                      "sap_hosting": "permitted", "sap_coupling": "medium", "security": "none", "workload": "low_frequency"}
AUTHORITY = "AI Foundry with SAP Integration, Security and Enterprise Architecture; Finance for cost"
REVISIT = ["Actual enterprise costs become known", "The AWS account or AgentCore availability changes", "SAP Integration changes the Apigee mandate", "Identity or gateway validation fails or passes",
           "The workload profile changes", "Enterprise security or data-residency policy changes"]
SELECTION_RULES = [
    ["S1 preferred when", "The agent is SAP-centric; SAP BTP execution is technically justified; SAP coupling is significant or BTP economics are verified favorable; BTP capacity or terms are verified; the enterprise permits centrally registered SAP-hosted agents. S1 is also the fallback when AWS execution is unavailable, disallowed or fails validation."],
    ["S3 preferred when", "The agent spans SAP and non-SAP systems; AWS execution is approved; AgentCore hosting is suitable; Apigee remains required or preferred; the gateway can invoke Apigee securely; delegated identity is validated end to end; comparative cost supports the extra gateway; AI Foundry and SAP Integration approve the boundaries."],
    ["S2 not preferred", "S2 stays in the architecture for reference. It is technically possible where AgentCore meets the requirements and Apigee is not mandated, but it is not preferred: selecting it needs an explicit owner exception."],
    ["Hold rule", "A missing mandatory approval or unvalidated prerequisite never produces an unconditional selection: the result is HOLD (selection not allowed) or CONDITIONAL."],
]


def recommend(inputs: dict | None = None) -> dict:
    """Evidence-driven recommendation with the stated preference: S1 for SAP-centric agents, S3 for SAP and non-SAP agents, S2 never preferred.
    Mirrored by frontend/src/selectionEngine.js; tests prove they agree."""
    i = {**SELECTION_DEFAULTS, **(inputs or {})}
    reasons: list[str] = []
    conditions: list[str] = []
    missing: list[str] = []
    rejected: dict[str, str] = {"S2": "Not preferred: kept in the architecture for reference; selecting it needs an explicit owner exception."}
    sap_centric = i["scope"] == "sap_centric"
    blocked = i["aws_account"] == "denied" or i["agentcore"] == "unavailable" or i["security"] in ("sap_only_execution", "no_cross_cloud")
    scenario, status = None, "HOLD"
    evaluate_first = "S1" if sap_centric else "S3"

    if blocked:
        why = "the dedicated AWS account is denied" if i["aws_account"] == "denied" else "AgentCore is unavailable" if i["agentcore"] == "unavailable" else "a security restriction rules out AWS runtime calls"
        rejected["S2"] = "Not possible: " + why + "."
        rejected["S3"] = "Not possible: " + why + "."
        evaluate_first = "S1"
        if i["sap_hosting"] == "permitted":
            scenario = "S1"
            status = "RECOMMENDED" if i["ops"] == "agreed" else "CONDITIONAL"
            reasons.append("The AWS execution options are unavailable (" + why + "), so SAP-hosted execution is the remaining option.")
            if i["ops"] != "agreed":
                missing.append("Operational ownership and support for Cloud Foundry")
            if i["sap_coupling"] == "high":
                reasons.append("SAP application coupling is high, which supports SAP BTP execution.")
            conditions += ["Verify Cloud Foundry capacity and contractual charges for the workload", "SAP Integration and Security approve direct Apigee invocation"]
        else:
            reasons.append("The enterprise does not permit centrally registered SAP-hosted agents and the AWS options are unavailable: no permitted option remains.")
            missing.append("A permitted hosting option")
    elif sap_centric and i["sap_hosting"] == "permitted":
        scenario = "S1"
        if i["ops"] != "agreed":
            missing.append("Operational ownership and support for Cloud Foundry")
        status = "RECOMMENDED" if not missing else "CONDITIONAL"
        reasons.append("S1 is the preferred option for SAP-centric agents.")
        if i["sap_coupling"] == "high":
            reasons.append("SAP application coupling is high, which supports SAP BTP execution.")
        if i["cost"] == "s3_competitive":
            reasons.append("Verified cost shows S3 is competitive, but S1 stays preferred for an SAP-centric agent.")
        conditions += ["Verify Cloud Foundry capacity and contractual charges for the workload", "SAP Integration and Security approve direct Apigee invocation"]
        rejected["S3"] = "Not needed for an SAP-centric agent: it adds an AWS account, a second gateway and cross-cloud transfer."
    else:
        if sap_centric:
            reasons.append("SAP-hosted agents are restricted, so S1 cannot be selected; S3 is the remaining preferred option.")
        if i["aws_account"] != "approved":
            missing.append("Dedicated SAP-agent AWS account approval")
        if i["agentcore"] != "available":
            missing.append("AgentCore Runtime, Gateway and Registry availability confirmation")
        if i["ops"] != "agreed":
            missing.append("Operational ownership and support")
        if i["apigee"] == "undecided":
            missing.append("SAP Integration decision on whether Apigee is mandatory for the SAP route")
        if missing:
            scenario, status = None, "HOLD"
            evaluate_first = "S3"
            reasons.append("Mandatory approvals are missing, so no scenario can be selected yet. Evaluate S3 first in the comparative POC.")
        elif i["identity"] == "failed" or i["interop"] == "failed":
            rejected["S3"] = "Identity or gateway interoperability validation failed."
            if i["sap_hosting"] == "permitted":
                scenario, status = "S1", "CONDITIONAL"
                reasons.append("S3 failed validation; SAP-hosted execution with Apigee is the fallback.")
                conditions.append("Verify Cloud Foundry capacity and contractual charges")
            else:
                scenario, status = None, "HOLD"
                reasons.append("S3 failed validation and SAP-hosted agents are restricted.")
        else:
            scenario = "S3"
            if i["identity"] != "validated":
                missing.append("Delegated user identity validated end to end")
            if i["interop"] != "validated":
                missing.append("AgentCore Gateway to Apigee interoperability validated")
            if i["cost"] == "s1_cheaper":
                if i["sap_hosting"] == "permitted":
                    scenario, status = "S1", "CONDITIONAL"
                    rejected["S3"] = "Verified cost evidence shows S1 is cheaper for this workload."
                    reasons.append("Verified cost evidence favors S1; the extra gateway of S3 is not justified.")
                    conditions.append("Confirm the cost evidence with FinOps")
                else:
                    status = "CONDITIONAL"
                    conditions.append("S1 is cheaper but SAP-hosted agents are restricted")
            else:
                if i["cost"] == "unknown":
                    missing.append("Verified comparative cost evidence")
                if i["cost"] == "s2_cheaper":
                    conditions.append("S2 is cheaper but not preferred: selecting it needs an explicit owner exception")
                status = "RECOMMENDED" if not missing else "CONDITIONAL"
                reasons.append("AWS execution is approved, so S3 is the preferred option for an agent that spans SAP and non-SAP systems.")
                if i["apigee"] == "not_required":
                    reasons.append("Apigee is not mandated for the route, so S2 would be technically possible but remains not preferred; S3 keeps the SAP-specific MCP governance.")
    if scenario == "S3":
        conditions += ["Non-duplicative responsibilities for AgentCore Gateway and Apigee", "Correlation id joined across both gateways"]
    if i["workload"] == "high_frequency":
        reasons.append("A high-frequency workload makes runtime and gateway charges material; it does not by itself make AWS cheaper.")
    if scenario and scenario != "S1" and "S1" not in rejected:
        rejected["S1"] = "Not preferred for an agent that spans SAP and non-SAP systems while AWS execution is approved and the SAP-hosted placement is not required by coupling or verified cost."
    if scenario == "S1":
        rejected.setdefault("S3", "Not selected: the SAP-hosted placement is preferred for the stated reasons.")
    return {"scenario": scenario, "status": status, "selectable": status == "RECOMMENDED", "evaluate_first": evaluate_first, "reasons": reasons, "conditions": conditions,
            "missing_evidence": missing, "rejected": [[s, rejected[s]] for s in SCENARIO_IDS if s in rejected], "authority": AUTHORITY, "revisit": REVISIT}


# --------------------------------------------------------------------------- cost model (editable, no invented rates)
COST_COMPONENTS = [
    {"id": "runtime", "label": "Agent runtime CPU and memory", "driver": "vCPU-hours and GB-hours per month", "applies": {"S1": "SAP BTP Cloud Foundry credits", "S2": "AgentCore Runtime", "S3": "AgentCore Runtime"}},
    {"id": "idle", "label": "Runtime idle capacity", "driver": "Reserved or idle hours per month", "applies": {"S1": "Cloud Foundry instances kept running", "S2": "AgentCore (consumption)", "S3": "AgentCore (consumption)"}},
    {"id": "gateway", "label": "AgentCore Gateway tool invocations", "driver": "Tool invocations per month", "applies": {"S2": "AgentCore Gateway", "S3": "AgentCore Gateway"}},
    {"id": "apigee", "label": "Apigee MCP/API usage", "driver": "API calls per month", "applies": {"S1": "Apigee", "S3": "Apigee"}},
    {"id": "integration", "label": "SAP Integration Suite consumption", "driver": "Messages or API calls per month", "applies": {"S1": "Integration Suite", "S2": "Integration Suite", "S3": "Integration Suite"}},
    {"id": "connector", "label": "Cloud Connector operating cost", "driver": "Operating effort or hosting per month", "applies": {"S1": "Where applicable", "S2": "Where applicable", "S3": "Where applicable"}},
    {"id": "llm", "label": "Portkey and model-provider cost", "driver": "Tokens per month", "applies": {"S1": "Portkey + provider", "S2": "Portkey + provider", "S3": "Portkey + provider"}},
    {"id": "egress", "label": "Inter-cloud data transfer and egress", "driver": "GB per month", "applies": {"S1": "Cloud Foundry to Apigee and registry", "S2": "AWS to SAP", "S3": "AWS to Apigee to SAP"}},
    {"id": "persistence", "label": "Persistence and storage", "driver": "GB per month and operations", "applies": {"S1": "Approved service or HANA Cloud", "S2": "Approved AWS service", "S3": "Approved AWS service"}},
    {"id": "observability", "label": "Observability and logging", "driver": "GB of logs per month", "applies": {"S1": "BTP + Apigee", "S2": "AgentCore", "S3": "AgentCore + Apigee"}},
    {"id": "registry", "label": "Agent Registry", "driver": "Records and requests per month", "applies": {"S1": "AWS Agent Registry", "S2": "AWS Agent Registry", "S3": "AWS Agent Registry"}},
    {"id": "support", "label": "Support and operational staffing", "driver": "FTE-months", "applies": {"S1": "BTP + integration teams", "S2": "AWS platform team", "S3": "AWS platform + integration teams"}},
    {"id": "dr", "label": "Environment isolation and disaster recovery", "driver": "Extra environments per month", "applies": {"S1": "BTP subaccounts", "S2": "AWS accounts", "S3": "AWS accounts"}},
]
WORKLOAD_PROFILES = [
    ["low_frequency", "Low-frequency SAP-specific agent"], ["high_frequency", "High-frequency analytical agent"], ["bursty", "Bursty enterprise agent"],
    ["long_running", "Long-running reconciliation workflow"], ["multi_agent", "Multi-agent and multi-tool orchestration"],
]
COST_NOTE = ("No rate is supplied. SAP BTP credit rates, enterprise AWS discounts, Apigee charges and measured savings are not known to this application and are never invented: "
             "enter them with their source. One workload definition (the volumes) applies to every scenario.")


def estimate(volumes: dict, rates: dict) -> dict:
    """Monthly estimate per scenario: sum of volume x rate over the components that apply. Missing inputs give None, never a guess."""
    out = {}
    for sid in SCENARIO_IDS:
        total, parts, missing = 0.0, [], []
        for c in COST_COMPONENTS:
            if sid not in c["applies"]:
                continue
            v, r = volumes.get(c["id"]), (rates.get(c["id"]) or {}).get(sid)
            if v in (None, "") or r in (None, ""):
                missing.append(c["id"])
                continue
            cost = float(v) * float(r)
            total += cost
            parts.append([c["id"], cost])
        out[sid] = {"total": None if missing else total, "partial": total, "parts": parts, "missing": missing}
    return out


def break_even(volumes: dict, rates: dict, component: str, a: str, b: str):
    """Volume of one component at which scenarios a and b cost the same, holding every other input fixed. None when not computable."""
    def line(sid):
        rest, slope = 0.0, 0.0
        for c in COST_COMPONENTS:
            if sid not in c["applies"]:
                continue
            r = (rates.get(c["id"]) or {}).get(sid)
            v = volumes.get(c["id"])
            if r in (None, ""):
                return None
            if c["id"] == component:
                slope = float(r)
            elif v in (None, ""):
                return None
            else:
                rest += float(v) * float(r)
        return rest, slope
    la, lb = line(a), line(b)
    if la is None or lb is None or la[1] == lb[1]:
        return None
    x = (lb[0] - la[0]) / (la[1] - lb[1])
    return x if x > 0 else None


# --------------------------------------------------------------------------- diagrams
LEGEND_ALL = ["invoke", "registry", "llm", "identity", "audit", "approval", "deploy"]


def n(id: str, row: int, col: int, title: str, sub: str, kind: str, **kw) -> dict:
    return {"id": id, "row": row, "col": col, "title": title, "sub": sub, "kind": kind, **kw}


def e(a: str, b: str, kind: str, label: str = "", **opts) -> list:
    return [a, b, kind, label, opts] if opts else [a, b, kind, label]


def _spec(id: str, title: str, chain: str, nodes: list, edges: list, *, cols: int, bounds=(), lanes=(), legend=None, footer: str = "", nh: int = 100, ys=None, height: int = 840, scenario: str | None = None, badge: str | None = None) -> dict:
    return {"id": id, "scenario": scenario, "badge": badge, "title": title, "chain": chain, "banner": STATUS_BANNER, "cols": cols, "nh": nh, "ys": ys or [118, 258, 398, 528, 668],
            "height": height, "nodes": nodes, "edges": edges, "bounds": [list(b) for b in bounds], "lanes": [list(x) for x in lanes], "legend": legend or LEGEND_ALL,
            "footer": footer or "Proposed design for review. Vendor names are design projections, not connected services. Registry, identity, LLM, audit and deployment arrows are not invocation traffic."}


def _scenario_diagram(sid: str) -> dict:
    sc = SCENARIOS[sid]
    aws = sid in ("S2", "S3")
    cols = 7 if aws else 6
    nodes = [n("ui", 1, 0, "SAP Fiori / app client", "Finance user entry; application unchanged", "ui"),
             n("idp", 0, 0, "Enterprise identity", "Corporate IdP or SAP Cloud Identity (IAS, candidate); mapping to validate", "identity"),
             n("portkey", 0, 1, "Portkey", "LLM gateway: model selection, credentials, fallback", "llm"),
             n("llm", 0, 2, "Approved LLM provider", "Reached only through Portkey", "llm"),
             n("gitlab", 2, 0, "GitLab CI/CD", "Source, specs and pipelines; deploys the runtime and publishes records", "artifact")]
    edges = [e("ui", "agent", "invoke", ""), e("agent", "portkey", "llm", "LLM request", off=-14), e("portkey", "llm", "llm", "model call"),
             e("idp", "agent", "identity", "workload / user token"),
             e("gitlab", "agent", "deploy", "deploy", off=0),
             e("agent", "reg_agent", "registry", "agent record", off=-20, labelAt="mid"), e("gitlab", "reg_agent", "deploy", "publish records", off=0)]
    if aws:
        nodes += [n("agent", 1, 1, "Agent · AWS AgentCore Runtime", "Agent execution and MCP client", "agent"),
                  n("gw", 1, 2, "AWS AgentCore Gateway", "Enterprise runtime gateway; routes and authorizes", "gateway")]
        if sid == "S3":
            nodes += [n("apigee", 1, 3, "Google Apigee MCP/API", "SAP-facing gateway; managed MCP endpoint (Pattern A)", "gateway"),
                      n("custom", 2, 3, "Custom MCP service", "Pattern B, conditional; AgentCore Runtime preferred; behind Apigee", "domain", dashed=True)]
            edges += [e("agent", "gw", "invoke", "MCP tools/call"), e("gw", "apigee", "invoke", "MCP target"), e("apigee", "int", "invoke", "API call"), e("apigee", "custom", "invoke", "proxy target (if needed)", off=-30),
                      e("gitlab", "custom", "deploy", "")]
            chain = "UI → AgentCore Runtime agent → AgentCore Gateway → Apigee MCP → Integration Suite → Cloud Connector (conditional) → SAP backend"
            footer = "AgentCore Gateway fronts Apigee: two gateways in series with separate responsibilities. AWS Agent Registry registers and is never an execution hop."
            bounds = [("AWS SAP-agent account (proposed)", ["agent", "gw"], "aws"), ("Google Apigee", ["apigee"], "google"), ("SAP landscape", ["int", "cc", "sap"], "sap")]
        else:
            nodes += [n("custom", 2, 3, "Custom MCP · AgentCore Runtime", "Conditional: MCP server target on AgentCore Runtime", "domain", dashed=True),
                      n("apigee", 2, 4, "Google Apigee", "Optional: only where SAP Integration policy requires it", "gateway", dashed=True)]
            edges += [e("agent", "gw", "invoke", "MCP tools/call"), e("gw", "custom", "invoke", "MCP target", my=372, off=-20), e("custom", "int", "invoke", "", my=372, off=20),
                      e("gw", "int", "invoke", "API target (alt.)", off=26), e("gw", "apigee", "invoke", "if required", my=384, off=12), e("apigee", "int", "invoke", ""),
                      e("gitlab", "custom", "deploy", "")]
            chain = "UI → AgentCore agent → AgentCore Gateway → MCP or API target → Integration Suite → Cloud Connector → SAP backend"
            footer = "Apigee is optional and inserted into the approved route only where required. A Gateway API target avoids a custom MCP server once its schema, authentication and connectivity are checked."
            bounds = [("AWS SAP-agent account (proposed)", ["agent", "gw"], "aws"), ("SAP landscape", ["int", "cc", "sap"], "sap")]
        nodes += [n("int", 1, 4, "SAP Integration Suite", "SAP integration boundary", "integration"), n("cc", 1, 5, "SAP Cloud Connector", "Conditional, private connectivity only", "integration", dashed=True),
                  n("sap", 1, 6, "SAP backend", "S/4HANA · Central Finance; business authorization", "backend"),
                  n("reg_agent", 3, 1, "Agent registry · AWS Agent Registry", "Agent descriptor; discovery and approval", "registry"),
                  n("reg_mcp", 3, 2, "MCP registry · AWS Agent Registry", "MCP descriptor; discovery and approval", "registry"),
                  n("db", 2, 5, "Persistence · conditional", "Approved AWS store, only if durable state is needed", "store", dashed=True)]
        edges += [e("int", "cc", "invoke", "if private"), e("cc", "sap", "invoke", "RFC / OData"), e("gw", "reg_mcp", "registry", "MCP descriptor", off=-20, labelAt="mid")]
        lanes = [(0, "IDENTITY · LLM"), (1, "RUNTIME PATH"), (2, "OPTIONAL · DEPLOY"), (3, "CONTROL PLANE")]
        return _spec({"S2": "D3", "S3": "D4"}[sid], f"{sc['name']} · topology", chain, nodes, edges, cols=cols, bounds=bounds, lanes=lanes, legend=["invoke", "llm", "identity", "registry", "deploy"],
                     footer=PREFERENCE[sid]["text"] + " " + footer, scenario=sid, badge=PREFERENCE[sid]["badge"])
    nodes += [n("agent", 1, 1, "Agent · SAP BTP Cloud Foundry", "Agent execution and MCP client", "agent"),
              n("apigee", 1, 2, "Google Apigee MCP/API", "SAP-facing gateway; managed MCP endpoint (Pattern A)", "gateway"),
              n("int", 1, 3, "SAP Integration Suite", "SAP integration boundary", "integration"),
              n("cc", 1, 4, "SAP Cloud Connector", "Conditional, private connectivity only", "integration", dashed=True),
              n("sap", 1, 5, "SAP backend", "S/4HANA · Central Finance; business authorization", "backend"),
              n("custom", 2, 3, "Custom MCP · Cloud Foundry", "Pattern B, only if required; behind Apigee", "domain", dashed=True),
              n("db", 2, 5, "Persistence · conditional", "Existing approved service or HANA Cloud where justified", "store", dashed=True),
              n("reg_agent", 3, 1, "Agent registry · AWS Agent Registry", "SAP-hosted agent metadata", "registry"),
              n("reg_mcp", 3, 2, "MCP registry · AWS Agent Registry", "Apigee MCP endpoint metadata", "registry")]
    edges += [e("agent", "apigee", "invoke", "MCP tools/call"), e("apigee", "int", "invoke", "API call"), e("int", "cc", "invoke", "if private"), e("cc", "sap", "invoke", "RFC / OData"),
              e("apigee", "custom", "invoke", "proxy target"), e("gitlab", "custom", "deploy", ""), e("apigee", "reg_mcp", "registry", "endpoint metadata", off=-20, labelAt="mid")]
    bounds = [("SAP BTP", ["agent"], "sap"), ("Google Apigee", ["apigee"], "google"), ("SAP landscape", ["int", "cc", "sap"], "sap"), ("AWS control plane only", ["reg_agent", "reg_mcp"], "aws")]
    lanes = [(0, "IDENTITY · LLM"), (1, "RUNTIME PATH"), (2, "OPTIONAL · DEPLOY"), (3, "CONTROL PLANE")]
    return _spec("D2", f"{sc['name']} · topology", "UI → Cloud Foundry agent → Apigee MCP → Integration Suite → Cloud Connector (conditional) → SAP backend (registry is control plane only)", nodes, edges, cols=cols,
                 bounds=bounds, lanes=lanes, legend=["invoke", "llm", "identity", "registry", "deploy"], scenario=sid, badge=PREFERENCE[sid]["badge"],
                 footer=PREFERENCE[sid]["text"] + " SAP BTP executes; AWS Agent Registry registers metadata only. No AgentCore component runs anything in S1.")


def _d1() -> dict:
    nodes = [
        n("idp", 0, 0, "Identity providers", "Corporate IdP, SAP Cloud Identity (candidate); trust boundaries", "identity"),
        n("reg", 0, 2, "AWS Agent Registry", "Control plane: agent and MCP catalog, discovery, approval", "registry"),
        n("ent", 0, 4, "AI Foundry governance", "Registry ownership and approval authority", "decision"),
        n("ui", 1, 0, "SAP Fiori / app client", "Finance user entry", "ui"),
        n("agent", 1, 1, "AI execution platform", "AWS AgentCore Runtime (S2, S3) or SAP BTP Cloud Foundry (S1)", "agent"),
        n("gw", 1, 2, "Runtime gateways", "AgentCore Gateway (S2, S3); Apigee (S1, S3; S2 optional)", "gateway"),
        n("int", 1, 3, "SAP Integration Suite", "SAP integration boundary", "integration"),
        n("cc", 1, 4, "SAP Cloud Connector", "Conditional", "integration", dashed=True),
        n("sap", 1, 5, "SAP Finance backend", "S/4HANA · Central Finance", "backend"),
        n("portkey", 2, 0, "Portkey", "LLM gateway", "llm"), n("llm", 2, 1, "Approved LLM provider", "Only through Portkey", "llm"),
        n("custom", 2, 2, "Custom MCP runtime", "Only where logic needs code; platform per scenario", "domain", dashed=True),
        n("gitlab", 3, 0, "GitLab (central platform)", "Source, specs, descriptors, CI/CD and artifacts for every scenario", "artifact", span=3),
        n("obs", 3, 3, "Observability and audit", "Evidence plane: logs, traces, change documents", "store", span=3),
    ]
    edges = [e("ui", "agent", "invoke", ""), e("agent", "gw", "invoke", "MCP tools/call"), e("gw", "int", "invoke", "API call"), e("int", "cc", "invoke", "if private"), e("cc", "sap", "invoke", "RFC / OData"),
             e("gw", "custom", "invoke", "proxy target (if needed)"), e("agent", "portkey", "llm", "LLM request", off=-14), e("portkey", "llm", "llm", "model call"),
             e("idp", "agent", "identity", "tokens"), e("agent", "reg", "registry", "register / discover", off=14), e("ent", "reg", "approval", "approve"),
             e("cc", "obs", "audit", "evidence"), e("sap", "obs", "audit", "evidence")]
    return _spec("D1", "Enterprise AI reference architecture", "Control plane · runtime plane · evidence plane, common to S1, S2 and S3. Preference: S1 for SAP-centric agents, S3 for SAP and non-SAP agents; S2 is kept for reference", nodes, edges, cols=6,
                 lanes=[(0, "CONTROL PLANE"), (1, "RUNTIME PLANE"), (2, "LLM · OPTIONAL"), (3, "PLATFORM · EVIDENCE")], bounds=[("SAP landscape", ["int", "cc", "sap"], "sap")],
                 legend=["invoke", "registry", "llm", "identity", "audit", "approval"], footer="No registry is a runtime hop. Per-scenario placement of the agent platform and gateways is in D2 to D4.")


def _d5() -> dict:
    cols = ("S1 · SAP-hosted hybrid", "S2 · AWS AgentCore-native", "S3 · AgentCore + Apigee")
    rows = [("Agent hosting and execution", ["SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "AWS AgentCore Runtime"]),
            ("Agent registration and discovery", [AWS_REGISTRY] * 3),
            ("MCP implementation hosting and execution", ["Cloud Foundry, only if custom code is needed", "AgentCore Runtime, when a custom MCP is needed", "Conditional: AgentCore Runtime preferred, exposed through Apigee"]),
            ("MCP registration and discovery", [AWS_REGISTRY] * 3),
            ("Runtime gateway mediation (separate responsibility)", ["Google Apigee", "AgentCore Gateway (Apigee optional)", "AgentCore Gateway in front of Apigee"]),
            ("LLM gateway (common to all)", ["Portkey"] * 3)]
    nodes, edges = [], []
    for r, (label, vals) in enumerate(rows):
        nodes.append(n(f"l{r}", r, 0, label, "Independent decision" if r < 4 else "Separate responsibility", "decision" if r < 4 else ("gateway" if r == 4 else "llm")))
        for c, v in enumerate(vals, start=1):
            kind = ("agent", "registry", "domain", "registry", "gateway", "llm")[r]
            nodes.append(n(f"c{r}_{c}", r, c, v, cols[c - 1], kind))
    for c in (1, 2, 3):
        edges.append(e(f"c0_{c}", f"c1_{c}", "registry", "metadata only"))
        edges.append(e(f"c2_{c}", f"c3_{c}", "registry", "metadata only"))
    return _spec("D5", "Four responsibility model", "Agent hosting, MCP hosting, agent registration and MCP registration, with gateway mediation and the LLM gateway identified separately", nodes, edges, cols=4,
                 legend=["registry"], nh=76, ys=[104, 208, 312, 416, 520, 624],
                 footer="Using AWS Agent Registry does not decide where anything runs, and AgentCore Gateway is not an agent-hosting service. The dashed arrow carries metadata only.")


def _d6() -> dict:
    nodes = [
        n("org", 0, 0, "AWS Organizations and landing zone", "SCPs, region and data-residency policy, enterprise compliance", "decision", span=2, h=84),
        n("idp", 0, 3, "Identity", "Corporate IdP, workload roles, least privilege", "identity", span=2, h=84),
        n("gov", 1, 0, "AI Foundry governance account", "Central AWS Agent Registry, curator and approval roles, shared by AWS RAM", "registry", span=2),
        n("wl", 1, 3, "SAP-agent workload account (proposed)", "AgentCore Runtime and Gateway; dev, test and prod separated", "agent", span=2),
        n("gl", 2, 0, "GitLab (central platform)", "Pipelines deploy the runtime and publish registry records", "artifact", span=2, h=84),
        n("net", 2, 3, "Network and egress", "Approved path to Apigee and Integration Suite; Portkey connectivity", "integration", span=2, h=84),
        n("ops", 3, 0, "Operations", "Monitoring, incident response, tagging and lifecycle policies", "store", span=2, h=84),
        n("fin", 3, 3, "Cost allocation and billing", "Budgets and alerts; owner per account", "control", span=2, h=84),
    ]
    edges = [e("org", "gov", "approval", "guardrails"), e("org", "wl", "approval", "SCPs", off=20), e("wl", "gov", "registry", "publish records"), e("gl", "wl", "deploy", "deploy", off=-20),
             e("gl", "gov", "deploy", "publish record definitions", off=24), e("idp", "wl", "identity", "workload roles"), e("wl", "net", "invoke", "egress")]
    return _spec("D6", "AWS account and governance architecture", "Dedicated SAP-agent execution account, central AI Foundry registry, identity, network and operational ownership (proposed; nothing is provisioned)", nodes, edges, cols=5,
                 legend=["invoke", "registry", "identity", "deploy", "approval"], nh=100, ys=[104, 232, 388, 540, 668], lanes=[(0, "POLICY"), (1, "ACCOUNTS"), (2, "PLATFORM"), (3, "OPERATIONS")],
                 footer="Account provisioning does not prove access to every AgentCore capability: confirm policy, entitlements, permissions and region. The registry is not duplicated per account.")


def _d7() -> dict:
    steps = [("user", "Business user", "Enterprise authentication; delegated user token", "ui"), ("agent", "AgentCore Runtime agent", "Agent workload identity (AgentCore Identity)", "agent"),
             ("gw", "AgentCore Gateway", "Inbound JWT validation; outbound credential or token exchange", "gateway"), ("apigee", "Google Apigee", "Token validation; API product policy", "gateway"),
             ("int", "SAP Integration Suite", "Service identity toward SAP", "integration"), ("sap", "SAP backend", "Mapped user executes; SAP roles authorize", "backend")]
    nodes = [n(k, 1, i, t, s, kind) for i, (k, t, s, kind) in enumerate(steps)]
    nodes += [n("idp", 0, 1, "Corporate IdP · SAP Cloud Identity (candidate)", "Issues and exchanges tokens; Global User ID is a correlation attribute, not proof of propagation", "identity", span=3, h=84),
              n("neg", 2, 0, "Negative case", "An authorized and an unauthorized user call the same read-only tool; SAP rejects the unauthorized one", "decision", span=2, h=84),
              n("val", 2, 2, "Validation status", "Token exchange and user mapping are NOT yet proven at any hop", "decision", span=2, h=84, dashed=True),
              n("auth", 2, 4, "SAP is the business authority", "Gateways and registries never grant business authorization", "backend", span=2, h=84)]
    edges = [e("user", "agent", "identity", "user token"), e("agent", "gw", "identity", "bearer · validated"), e("gw", "apigee", "identity", "exchange / client credential"),
             e("apigee", "int", "identity", "OAuth / cert"), e("int", "sap", "identity", "principal propagation"), e("idp", "agent", "identity", "issues", off=-20), e("idp", "gw", "identity", "validates", off=0)]
    return _spec("D7", "Gateway and principal propagation (S3)", "Six identities across AWS, Apigee and SAP; S1 drops the AgentCore hops, S2 drops Apigee unless inserted", nodes, edges, cols=6, legend=["identity"], nh=96,
                 lanes=[(1, "IDENTITIES"), (2, "VALIDATION")], footer="The workload token alone is not end-user principal propagation. The final SAP execution identity must be evidenced in the SAP backend.")


def _d8() -> dict:
    layers = [("rt", "Agent runtime", "S1: BTP credits · S2, S3: AgentCore consumption", "agent"), ("gw", "AgentCore Gateway", "S2, S3 only · per tool invocation", "gateway"),
              ("ap", "Apigee MCP/API", "S1, S3 · S2 optional", "gateway"), ("is", "Integration Suite", "All · messages or API calls", "integration"),
              ("cc", "Cloud Connector", "Where applicable", "integration"), ("llm", "Portkey and model", "All · tokens", "llm"),
              ("net", "Network and egress", "Cross-cloud transfer: highest in S3", "control"), ("db", "Persistence", "Conditional", "store"),
              ("obs", "Observability", "Logs per platform", "store"), ("sup", "Support and operations", "Teams differ per scenario", "decision")]
    nodes = [n(k, 1 + i // 5, i % 5, t, s, kind) for i, (k, t, s, kind) in enumerate(layers)]
    nodes.append(n("note", 3, 0, "Billable layers differ per scenario", "One workload definition, one editable model, no invented rates: see Selection · Cost model", "decision", span=5, h=70))
    return _spec("D8", "Cost and operational responsibility architecture", "The separately billable runtime, gateway, integration, network, persistence, observability and support layers", nodes, [], cols=5, legend=["invoke"], nh=100,
                 ys=[120, 250, 400, 560, 700], lanes=[(1, "RUNTIME LAYERS"), (2, "SHARED LAYERS")], footer="Layers are cost and ownership categories, not arrows of traffic.")


def _d9() -> dict:
    nodes = [
        n("start", 0, 0, "Classify the agent", "SAP-centric, or spans SAP and non-SAP systems; frequency, tools", "ui"),
        n("q0", 0, 1, "SAP-centric?", "SAP coupling, BTP practice, verified economics", "decision"),
        n("q1", 0, 2, "AWS account and AgentCore approved?", "Account, services, ownership", "decision"),
        n("q3", 0, 3, "Identity and interop validated, cost competitive?", "Evidence, not preference", "decision"),
        n("hold", 1, 2, "HOLD / CONDITIONAL", "A missing approval never gives an unconditional choice", "control"),
        n("s1", 2, 0, "S1 · SAP-hosted hybrid", "Preferred for SAP-centric agents; also the fallback", "agent"),
        n("s2", 2, 1, "S2 · AWS AgentCore-native", "Not preferred; owner exception only", "agent", dashed=True),
        n("s3", 2, 3, "S3 · AgentCore + Apigee", "Preferred for SAP and non-SAP agents; conditional", "agent"),
    ]
    edges = [e("start", "q0", "invoke", ""), e("q0", "s1", "invoke", "yes", my=234), e("q0", "q1", "invoke", "no: SAP and non-SAP"), e("q1", "q3", "invoke", "yes"), e("q1", "hold", "invoke", "pending"),
             e("q3", "s3", "invoke", "yes", my=240), e("q1", "s2", "invoke", "exception only", my=372, off=20)]
    return _spec("D9", "Architecture selection decision tree", "Agent scope and approval gates lead to S1 or S3; S2 is kept for reference and is not preferred; the same rules are in Selection · Recommendation", nodes, edges, cols=4, legend=["invoke"], nh=100,
                 ys=[130, 270, 410, 560, 700], footer="S1 is preferred for SAP-centric agents and S3 for SAP and non-SAP agents. S3 needs its conditions met; S1 is the fallback; S2 needs an explicit owner exception.")


def _d10() -> dict:
    cols = ("S1 · SAP-hosted hybrid", "S2 · AWS AgentCore-native", "S3 · AgentCore + Apigee")
    rows = [("Preference", ["Preferred for SAP-centric agents", "Not preferred · kept for reference", "Preferred for SAP and non-SAP agents · conditional"]),
            ("Benefits", ["SAP-domain ownership; BTP practices reused", "Simpler AWS-native runtime; AgentCore tooling", "AWS execution plus SAP-specific MCP governance in Apigee"]),
            ("Risks", ["Cloud Foundry cost and capacity for frequent agents", "Apigee policy exception; custom MCP lifecycle", "Two gateways, extra hop, cross-cloud audit, token exchange"]),
            ("Pending decisions", ["Direct Apigee invocation; BTP economics", "Is Apigee mandated; API target validity", "Account, interoperability, identity, cost, gateway ownership"]),
            ("Chosen when", ["The agent is SAP-centric, or AWS is unavailable", "Only by explicit owner exception", "The agent spans SAP and non-SAP; AWS approved; evidence supports the extra gateway"])]
    nodes = []
    for r, (label, vals) in enumerate(rows):
        nodes.append(n(f"l{r}", r, 0, label, "", "decision"))
        for c, v in enumerate(vals, start=1):
            nodes.append(n(f"c{r}_{c}", r, c, v, cols[c - 1] if r == 0 else "", ("agent", "integration", "gateway", "registry", "domain")[r]))
    return _spec("D10", "Executive comparison: S1 and S3 are preferred", "A decision-ready comparison; S1 for SAP-centric agents, S3 for SAP and non-SAP agents, S2 kept for reference", nodes, [], cols=4, legend=["invoke"], nh=88,
                 ys=[110, 220, 330, 440, 550], footer="S3 is preferred for SAP and non-SAP agents but not approved; selection is conditional on the evidence listed under Pending decisions and the rules in Selection · Recommendation.")


def diagrams() -> dict[str, dict]:
    return {"D1": _d1(), "D2": _scenario_diagram("S1"), "D3": _scenario_diagram("S2"), "D4": _scenario_diagram("S3"), "D5": _d5(), "D6": _d6(), "D7": _d7(), "D8": _d8(), "D9": _d9(), "D10": _d10()}


DIAGRAM_NAMES = {"D1": "Enterprise AI reference", "D2": "S1 SAP-hosted hybrid (preferred, SAP-centric)", "D3": "S2 AWS-native (not preferred)", "D4": "S3 AgentCore + Apigee (preferred, SAP and non-SAP)", "D5": "Four responsibility model",
                 "D6": "AWS account and governance", "D7": "Gateway and principal propagation", "D8": "Cost and operations", "D9": "Selection decision tree", "D10": "Executive comparison"}

RECOMMENDATION = {
    "headline": "S1 is preferred for SAP-centric agents and S3 for agents that span SAP and non-SAP systems. Neither is approved: S3 is conditional on account approval, identity, interoperability and cost, and S1 is its fallback. S2 stays in the architecture for reference and is not preferred.",
    "preference": [PREFERENCE["S1"]["text"], PREFERENCE["S3"]["text"], PREFERENCE["S2"]["text"]],
    "why": ["AWS runs the agent, which separates compute from SAP BTP and is reusable across SAP systems.", "Apigee keeps the SAP-specific MCP and API governance in front of Integration Suite.", "AWS Agent Registry gives central registration without becoming an execution hop."],
    "depends": ["The dedicated SAP-agent AWS account and AgentCore services are approved", "Apigee remains part of the approved SAP integration design", "AgentCore Gateway can securely invoke the Apigee MCP endpoint", "Delegated user identity is validated end to end", "Comparative cost supports the extra gateway", "AI Foundry and SAP Integration approve the ownership boundaries"],
    "open": ["Account approval", "Gateway-to-Apigee interoperability", "Identity and principal propagation", "Verified comparative cost", "Non-duplicative gateway responsibilities"],
    "changes": ["If Apigee is not mandated, S2 becomes technically possible but is still not preferred; it needs an explicit owner exception.", "If AWS is unavailable, restricted or costlier, S1 is the fallback.", "If cost, identity or interoperability evidence fails, S3 is not selected."],
    "poc": POC_VALIDATIONS,
    "conditions": ["Account approved with AgentCore services", "Gateway interoperability and identity validated", "Cost competitive for the workload", "Ownership agreed"],
    "cost_assumptions": ["No rates are assumed: SAP BTP credits, enterprise AWS discounts and Apigee charges are unknown", "One workload definition across the three scenarios"],
    "risks": ["Two gateways with overlapping policy", "Extra hop and cross-cloud audit", "Token exchange across AWS, Apigee and SAP", "Account approval and ownership"],
    "rejected": ["S2: not preferred; kept for reference (selecting it needs an explicit owner exception)", "S1 for an agent that spans SAP and non-SAP systems while AWS execution is approved and the placement is not justified by coupling or verified cost"],
    "missing": ["Dedicated account approval", "End-to-end call through the gateway to Apigee", "Delegated identity validation", "Verified comparative cost"],
    "authority": AUTHORITY, "revisit": REVISIT,
}

# Evidence read on 2026-11-25 (carried forward from V5.1)
EVIDENCE = [
    ["Google Apigee", "Apigee MCP overview", "https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-overview", "Existing Apigee APIs are exposed as MCP tools with no MCP server to install or manage. Stateless protocol 2026-07-28 and stateful 2025-11-25, 2025-06-18, 2025-03-26, 2024-11-05 at one endpoint over HTTP/S; SSE streams are not supported. OAuth 2.1 and OIDC. OpenAPI 3.0.x; 1000 tools per organization; capacity limits in some regions.", "Pattern A needs no custom MCP server, within the limits. Apigee is not arbitrary agent-code hosting.", "Tenant enablement, region capacity, hybrid version"],
    ["Google Apigee", "Manage MCP tool access", "https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/manage-mcp-tool-access", "Access is controlled with API products and developer apps; ParsePayload (JSON-RPC 2.0) plus API-key or OAuth verification; tools outside the client's product are removed from tools/list. This page says traffic can be proxied to your own MCP server.", "Apigee is the SAP-domain policy layer. Pattern B rests on this one statement.", "Prove the custom-server proxy pattern in this tenant"],
    ["AWS AgentCore", "Gateway core concepts", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-core-concepts.html", "Gateway is a secure entry point for agentic traffic with MCP, HTTP and inference target categories and inbound OAuth (JWT), IAM, authenticate-only or none. It is not an agent-hosting service.", "AgentCore Gateway mediates; AgentCore Runtime hosts.", "Target classification of an external MCP server (listed under both MCP and HTTP targets)"],
    ["AWS AgentCore", "Gateway MCP server targets and outbound authorization", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html", "Supported MCP versions 2026-07-28, 2025-11-25, 2025-06-18 and 2025-03-26. Outbound auth for MCP-server targets: none (not recommended), gateway role, OAuth client credentials, authorization code, token exchange, API key. Caller token passthrough is not supported; on-behalf-of is supported through token exchange. Listing mode DEFAULT when the server supports client credentials, otherwise DYNAMIC. Tool names are prefixed with the target name.", "Four protocol versions are shared with Apigee. User identity reaches Apigee only through token exchange.", "An authorization server that supports token exchange; private targets (not documented)"],
    ["AWS AgentCore", "AgentCore Policy", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy-getting-started.html", "Cedar policies attach to a gateway; in enforce mode every tool call that reaches the gateway is evaluated and denied unless permitted. The pages do not say that a target blocks calls that bypass the gateway.", "Policy is enforced at the gateway; bypass prevention is a separate credential or network control.", "Prove that Apigee rejects a call that does not carry a gateway-issued credential"],
    ["AWS AgentCore", "Agent Registry", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html", "A managed discovery service: a catalog for organizing, curating and discovering resources. Record types AGENT, MCP, SKILL, CUSTOM and WEB_BOT; publishers submit, curators approve. Runtime and Gateway are related services, so it is separate from both. The older preview namespace was announced for discontinuation on 2026-10-30.", "The registry is a catalog, not a gateway and not a runtime. Use the agent-registry namespace.", "Availability and region; cross-account sharing (not read in this build)"],
    ["AWS AgentCore", "Registry: synchronize external records", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-sync-records.html", "The registry connects to a valid HTTPS URL with outbound credentials (none, OAuth from a provider in the same account, or IAM SigV4) and extracts server and tool definitions. Sync runs when the record is created and on demand; no schedule is stated. Triggering sync reverts the record to draft. Removal of stale tools is not described. Private-network reachability is not mentioned.", "Supports registering SAP-hosted or Apigee endpoints, but AWS must reach the URL; stale entries need an explicit retirement process.", "Reachability of the Apigee URL from AWS; credential provider in the same account"],
    ["AWS AgentCore", "Registry: supported record types", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-supported-record-types.html", "AGENT records use a2aAgentCard, mcpServer or custom descriptors; MCP records use mcpServer or custom; SKILL is a separate record type.", "A skill record is metadata and never grants tool permissions.", "Descriptor fit for our agents"],
    ["SAP", "SAP BTP Cloud Foundry runtime", "https://help.sap.com/docs/cf-runtime/cloud-foundry-runtime/what-is-sap-btp-cloud-foundry-runtime", "The Cloud Foundry runtime on SAP platform runs polyglot cloud-native applications with SAP Java, Node.js and Python buildpacks; orgs, spaces and space quota plans are managed; service plans and metering apply. (Read in a browser on 2026-11-25.)", "Cloud Foundry can host the S1 agent and any custom MCP code.", "Entitlement, quota and contractual charges"],
    ["SAP", "A2A and MCP for AI agent interoperability at SAP (reference architecture, updated 2026-10-26)", "https://architecture.learning.sap.com/docs/ref-arch/76ec36", "SAP recommends Agent Gateway (A2A) for multi-agent collaboration and an MCP Gateway in SAP Integration Suite for governed exposure of APIs as MCP tools. A disclaimer says bidirectional communication with third-party and self-hosted agents through Agent Gateway is not yet generally available.", "SAP offers its own MCP gateway; it is an alternative to Apigee that this evaluation does not model.", "Whether SAP's own MCP Gateway should be compared with Apigee"],
]
EVIDENCE_STATUS = ("Read on 2026-11-25: AWS and Google pages through a web fetch, the SAP Cloud Foundry runtime page and the SAP reference architecture in a browser. "
                   "Cross-account sharing of AWS Agent Registry (AWS Organizations, AWS Resource Access Manager) and AWS account service entitlements were NOT read in this build and are NOT_VERIFIED. "
                   "Vendor documentation describes product capability only; it does not show that a feature is configured, licensed or available in this organization's tenant or region.")

DOMAINS = [
    {"name": "Finance Read MCP", "mode": "READ", "tools": "Reconciliation balances, ledger and period data, journal and document status, reconciliation exceptions", "control": "Read-only backend operations. No write tool is registered. This is the only capability the application uses."},
    {"name": "Finance Posting MCP", "mode": "WRITE · APPROVAL-GATED · NOT ACTIVE", "tools": "Future: propose and post a reconciliation adjustment through a governed approval", "control": "A separately governed capability. It is not active in this application and posting is never automatic."},
    {"name": "Analytical / Data MCP", "mode": "READ · FUTURE", "tools": "Authorized Databricks or BDC-backed context", "control": "Entitlement and scope: " + PENDING},
]
MCP_PROTOCOL_VERSIONS = {"agentcore_gateway": ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26"],
                         "apigee": ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"]}

# --------------------------------------------------------------------------- decision register
DECISIONS = [
    {"id": "architecture_preference", "title": "Architecture preference: S1 and S3 preferred, S2 kept for reference", "scenarios": ["S1", "S2", "S3"], "status": "OWNER-STATED · NOT APPROVED BY AI FOUNDRY",
     "answers": [["Which scenarios are preferred?", "S1 for SAP-centric agents and S3 for agents spanning SAP and non-SAP systems; S2 stays in the architecture for reference and is not preferred (owner statement, 2026-11-26)", "OWNER-CONFIRMED"],
                 ["Has AI Foundry approved the preference?", "Not recorded", "OPEN"]],
     "settled": ["The preference is stated by the owner and shown on every architecture view.", "S2 stays in the architecture and the comparison; it is not under evaluation as a preferred option."],
     "remaining": ["AI Foundry approval of the preference", "The per-agent rule for choosing between S1 and S3 (scope, coupling, cost)"],
     "options": ["S1 for SAP-centric and S3 for SAP and non-SAP (as stated)", "S3 for every agent", "S1 for every agent"],
     "proposal": "Record the preference in the AI Foundry standard and classify each agent as SAP-centric or SAP and non-SAP at intake.",
     "proof": "AI Foundry records the preference and each agent carries its classification and its selected scenario.", "owner": "AI Foundry + Enterprise Architecture"},
    {"id": "aws_account", "title": "Dedicated SAP-agent AWS account", "scenarios": ["S2", "S3"], "status": "OPEN · APPROVAL NOT RECORDED",
     "answers": [["Are the tenant entitlements live (Cloud Foundry, Apigee MCP, AgentCore, Agent Registry, Portkey)?", "Live, per the owner (carried forward from 2026-11-25)", "OWNER-CONFIRMED"],
                 ["Has the dedicated SAP-agent AWS account been approved, with AgentCore services?", "Not recorded", "OPEN"]],
     "settled": ["The account is a proposal, not a provisioned resource.", "Provisioning an account does not prove access to every AgentCore capability."],
     "remaining": ["Account approval, quotas, region and permissions", "Separation of development, test and production", "Written entitlement confirmations"],
     "options": ["Dedicated account with separate environments", "Dedicated account plus a central governance account", "Reuse the existing SAP AWS account (the proposal says it is unsuitable for AI-native workloads)"],
     "proposal": "Approve the dedicated account within the AWS Organization and confirm AgentCore entitlements in writing before any build.",
     "proof": "AgentCore Runtime, Gateway and Registry are used in the account by the platform team and logged.", "owner": "AI Foundry + AWS platform + Security"},
    {"id": "registry_ownership", "title": "Central AWS Agent Registry and cross-account sharing", "scenarios": ["S1", "S2", "S3"], "status": "OPEN · SHARING NOT CONFIRMED",
     "answers": [["Who approves publishing an agent or MCP record?", "The integration team with the respective technical approvals (owner, carried forward)", "OWNER-CONFIRMED"],
                 ["Is GitLab the central platform for source, specs, descriptors and CI/CD?", "Yes (owner, carried forward)", "DECIDED"],
                 ["Does AI Foundry own the registry in a central account, shared with the workload account?", "Not confirmed", "OPEN"]],
     "settled": ["Registry records can be published from the GitLab pipeline through the registry API.", "A registry duplicate per account is not wanted."],
     "remaining": ["Cross-account sharing through AWS Organizations and AWS Resource Access Manager (not read in this build)", "Curator and publisher permissions", "Region compatibility and revocation"],
     "options": ["Central registry in the AI Foundry account, shared to workload accounts", "Registry inside the workload account (rejected as a duplicate)"],
     "proposal": "Keep one central registry, publish from GitLab, and confirm the sharing mechanism with AWS.",
     "proof": "A record published from the workload account is discovered by a consumer in another account; a revoked record disappears.", "owner": "AI Foundry"},
    {"id": "gateway_interop", "title": "AgentCore Gateway to Apigee (S3)", "scenarios": ["S3"], "status": "OPEN · NOT YET CHECKED",
     "answers": [["Has an end-to-end call through the gateway to Apigee been made?", "Not yet checked", "OPEN"],
                 ["Is the Apigee MCP endpoint reachable from AWS?", "Not yet checked", "OPEN"],
                 ["Is the registry credential provider in the same AWS account?", "Not yet checked", "OPEN"]],
     "settled": ["Four MCP protocol versions are shared (2026-07-28, 2025-11-25, 2025-06-18, 2025-03-26).", "The gateway supports outbound OAuth client credentials, authorization code and token exchange; passthrough is not supported.", "Apigee MCP supports OAuth 2.1 and OIDC and no SSE."],
     "remaining": ["The real call", "Target classification and tool naming", "Non-duplicative gateway responsibilities and quota ownership", "Private reachability"],
     "options": ["Service identity first (client credentials)", "User delegation through token exchange"],
     "proposal": "Prove service identity end to end first, then user delegation.",
     "proof": "One tools/list and one tools/call through the gateway to Apigee and on to a read tool, with correlation across both logs.", "owner": "AI Foundry + SAP Integration"},
    {"id": "identity", "title": "Delegated identity and SAP authorization", "scenarios": ["S1", "S2", "S3"], "status": "OPEN · NOT YET VALIDATED",
     "answers": [["Is delegated user identity validated end to end?", "Not yet checked", "OPEN"]],
     "settled": ["Global User ID, a user-name header or a workload token alone is not principal propagation.", "SAP backend authorization stays mandatory."],
     "remaining": ["Which platform exchanges each token", "Evidence of the final SAP execution identity"],
     "options": ["Service identity first", "Delegated user through token exchange"],
     "proposal": "Run the negative test: an authorized and an unauthorized user call the same read-only tool.",
     "proof": "SAP rejects the unauthorized user and the evidence names the execution identity.", "owner": "Security + SAP Basis"},
    {"id": "cost_evidence", "title": "Verified comparative operating cost", "scenarios": ["S1", "S2", "S3"], "status": "OPEN · NO RATES ENTERED",
     "answers": [["Are SAP BTP credit rates, enterprise AWS discounts and Apigee charges known?", "Not provided", "OPEN"]],
     "settled": ["The model is editable and has no rates; none is invented.", "High invocation frequency does not automatically make AWS cheaper."],
     "remaining": ["Unit rates with provenance", "Measured workload volumes", "Support and staffing assumptions"],
     "options": ["Enter rates in the cost model for one workload definition"],
     "proposal": "FinOps supplies rates and volumes; the model then shows totals, sensitivity and break-even.",
     "proof": "The same workload is run on the compared platforms and measured.", "owner": "FinOps + platform owners"},
    {"id": "apigee_policy", "title": "Is Apigee mandatory for the SAP API route? (S2)", "scenarios": ["S2"], "status": "OPEN · POLICY NOT RECORDED",
     "answers": [["Does SAP Integration require Apigee for the route from AWS to Integration Suite?", "Not recorded", "OPEN"]],
     "settled": ["S2 is valid without Apigee only if SAP Integration and Security accept it or approve an exception."],
     "remaining": ["SAP Integration's written position"],
     "options": ["Apigee not required: S2", "Apigee required: S3", "Apigee optional by exception: S2 with Apigee inserted"],
     "proposal": "Obtain SAP Integration's written position per route.",
     "proof": "The policy statement is recorded against the decision.", "owner": "SAP Integration + Security"},
]
ANSWER_STATES = ("DECIDED", "OWNER-CONFIRMED", "OPEN")


def decision_summary() -> dict:
    counts = {s: 0 for s in ANSWER_STATES}
    for d in DECISIONS:
        for _, _, state in d["answers"]:
            counts[state] += 1
    return counts


# --------------------------------------------------------------------------- validation
BAD_GOOGLE = re.compile(r"Cloud Run|Vertex|Google Agent Registry|Google Agent Runtime|Agent Engine|Google Cloud agent", re.I)


def _texts(spec: dict) -> list[str]:
    return [f"{x['title']} {x['sub']}" for x in spec["nodes"]]


def validate_diagram(spec: dict) -> list[str]:
    errors: list[str] = []
    ids = {x["id"] for x in spec["nodes"]}
    kind = {x["id"]: x["kind"] for x in spec["nodes"]}
    if len(ids) != len(spec["nodes"]):
        errors.append(f"{spec['id']}: duplicate node ids")
    for a, b, k, *_ in spec["edges"]:
        if a not in ids or b not in ids:
            errors.append(f"{spec['id']}: edge {a}->{b} names a missing node")
    for text in _texts(spec):
        if BAD_GOOGLE.search(text):
            errors.append(f"{spec['id']}: Google hosting or registry platform shown: {text[:60]}")
    for a, b, k, *_ in spec["edges"]:
        if k == "invoke" and "registry" in (kind.get(a), kind.get(b)) and spec["id"] not in ("D5", "D9"):
            errors.append(f"{spec['id']}: registry used as a runtime invocation hop ({a}->{b})")
        if k == "invoke" and b == "sap" and a in ("agent", "mcp", "portkey", "gw", "apigee", "custom"):
            errors.append(f"{spec['id']}: direct access to the SAP backend ({a}->{b})")
        if b == "llm" and a != "portkey" and k in ("llm", "invoke"):
            errors.append(f"{spec['id']}: LLM provider reached without Portkey ({a}->{b})")
        if k == "deploy" and kind.get(b) == "backend":
            errors.append(f"{spec['id']}: deployment arrow into the SAP backend ({a}->{b})")
    sid = spec.get("scenario")
    nodes = {x["id"]: x for x in spec["nodes"]}
    texts = " | ".join(_texts(spec))
    if sid == "S1":
        if "AgentCore" in texts:
            errors.append("D2: AgentCore shown in S1")
        if not any(x["id"] == "apigee" and not x.get("dashed") for x in spec["nodes"]):
            errors.append("D2: Apigee must be a required node in S1")
    if sid == "S2":
        for need in ("AgentCore Runtime", "AgentCore Gateway", "AWS Agent Registry", "Portkey"):
            if need not in texts:
                errors.append(f"D3: missing {need}")
        if "apigee" in nodes and not nodes["apigee"].get("dashed"):
            errors.append("D3: Apigee must be optional (dashed) in S2")
    if sid == "S3":
        for need in ("AgentCore Runtime", "AgentCore Gateway", "Apigee", "AWS Agent Registry", "Portkey"):
            if need not in texts:
                errors.append(f"D4: missing {need}")
        if not any(a == "gw" and b == "apigee" and k == "invoke" for a, b, k, *_ in spec["edges"]):
            errors.append("D4: AgentCore Gateway must front Apigee")
    if sid in SCENARIO_IDS:
        if "Portkey" not in texts:
            errors.append(f"{spec['id']}: Portkey missing")
        if "GitLab" not in texts:
            errors.append(f"{spec['id']}: GitLab CI/CD missing")
        if sid in ("S2", "S3") and not any(a == "gitlab" and b == "agent" and k == "deploy" for a, b, k, *_ in spec["edges"]):
            errors.append(f"{spec['id']}: GitLab must deploy the AgentCore runtime")
    return errors


def validate(model: dict | None = None) -> list[str]:
    s = model or SCENARIOS
    errors: list[str] = []
    if tuple(s) != SCENARIO_IDS:
        return ["exactly S1, S2 and S3 must be defined"]
    for sid, sc in s.items():
        if sc["llm_gateway"] != "Portkey":
            errors.append(f"{sid}: LLM gateway must be Portkey")
        if sc["agent_registry"] != AWS_REGISTRY or sc["mcp_registry"] != AWS_REGISTRY:
            errors.append(f"{sid}: registries must be AWS Agent Registry")
        for key, value in sc.items():
            if isinstance(value, str) and BAD_GOOGLE.search(value):
                errors.append(f"{sid}.{key}: Google hosting or registry platform mentioned")
        if "SAP backend" not in sc["backend_authorization"]:
            errors.append(f"{sid}: SAP backend authorization missing")
        if not sc["persistence"].startswith("Conditional"):
            errors.append(f"{sid}: persistence must be conditional")
        if "conditional" not in sc["cloud_connector"].lower():
            errors.append(f"{sid}: Cloud Connector must be conditional")
        if not sc["unverified"] or "GitLab" not in sc["artifact_repository"]:
            errors.append(f"{sid}: unverified dependencies and the GitLab artifact platform are required")
    a, b, c = s["S1"], s["S2"], s["S3"]
    if a["agent_runtime"] != "SAP BTP Cloud Foundry" or "Cloud Foundry" not in a["custom_mcp_runtime"] or "Apigee" not in a["mcp_gateway"]:
        errors.append("S1: agent and custom MCP on SAP BTP Cloud Foundry with Apigee as the gateway")
    if a["agentcore_runtime"] or a["agentcore_gateway"]:
        errors.append("S1: no AgentCore execution or gateway")
    if b["agent_runtime"] != "AWS AgentCore Runtime" or not b["agentcore_gateway"] or "AgentCore Runtime" not in b["custom_mcp_runtime"]:
        errors.append("S2: AgentCore Runtime hosts the agent and MCP; AgentCore Gateway is required")
    if not b["apigee_role"].startswith("Optional"):
        errors.append("S2: Apigee must be optional, not automatically mandatory")
    if c["agent_runtime"] != "AWS AgentCore Runtime" or not c["agentcore_gateway"] or "Apigee" not in c["mcp_gateway"] or not c["apigee_role"].startswith("Required"):
        errors.append("S3: AgentCore Runtime and Gateway fronting Apigee are required")
    if "Dedicated SAP-agent AWS account" not in c["aws_account"]:
        errors.append("S3: the dedicated SAP-agent AWS account must be proposed")
    if "Preferred" not in c["status"] or "conditional" not in c["status"].lower():
        errors.append("S3 must be labelled preferred for SAP and non-SAP agents and conditional")
    if "Preferred" not in a["status"] or "SAP-centric" not in a["status"]:
        errors.append("S1 must be labelled preferred for SAP-centric agents")
    if "Not preferred" not in b["status"] or "reference" not in b["status"].lower():
        errors.append("S2 must be kept in the architecture and labelled not preferred, for reference")
    if [PREFERENCE[x]["label"] for x in SCENARIO_IDS] != ["Preferred", "Not preferred", "Preferred"]:
        errors.append("the preference record must prefer S1 and S3 and not S2")
    if re.search(r"production-ready|enterprise-approved|unconditional winner", " ".join(map(str, c.values())), re.I):
        errors.append("S3 must not claim production readiness or approval")
    if {d["id"] for d in DECISIONS} != {"architecture_preference", "aws_account", "registry_ownership", "gateway_interop", "identity", "cost_evidence", "apigee_policy"}:
        errors.append("the decision register must cover the seven items")
    if any(state not in ANSWER_STATES for d in DECISIONS for _, _, state in d["answers"]):
        errors.append("every decision answer must be DECIDED, OWNER-CONFIRMED or OPEN")
    if any(not d["proposal"] or not d["proof"] or not d["owner"] or not d["remaining"] for d in DECISIONS):
        errors.append("every register item needs a proposal, proof, owner and what remains")
    for name, spec in diagrams().items():
        errors += validate_diagram(spec)
    return errors


def export() -> dict:
    return {"version": MODEL_VERSION, "banner": STATUS_BANNER, "ids": list(SCENARIO_IDS), "scenarios": SCENARIOS, "preference": PREFERENCE, "preferenceLine": PREFERENCE_LINE, "comparison": COMPARISON, "connCols": CONN_COLS, "connections": CONNECTIONS,
            "diagrams": diagrams(), "diagramNames": DIAGRAM_NAMES, "recommendation": RECOMMENDATION, "evidence": EVIDENCE, "evidenceStatus": EVIDENCE_STATUS, "domains": DOMAINS,
            "decisions": DECISIONS, "decisionSummary": decision_summary(), "ownerDate": OWNER_DATE,
            "selection": {"inputs": SELECTION_INPUTS, "defaults": SELECTION_DEFAULTS, "rules": SELECTION_RULES, "authority": AUTHORITY, "revisit": REVISIT},
            "gatewayResponsibilities": GATEWAY_RESPONSIBILITIES, "identityChain": IDENTITY_CHAIN, "account": ACCOUNT, "lifecycle": LIFECYCLE, "guardrails": GUARDRAILS, "raci": RACI,
            "pocValidations": POC_VALIDATIONS, "cost": {"components": COST_COMPONENTS, "workloads": WORKLOAD_PROFILES, "note": COST_NOTE}}
