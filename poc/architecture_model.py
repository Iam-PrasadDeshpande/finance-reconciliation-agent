"""Canonical architecture model, Architecture V5.1: the single source of truth for the three scenarios under evaluation.

Everything the Architecture pages show (scenario summaries, comparison tables, connection tables, diagrams D1..D10) is generated from
this module, exported to ``frontend/src/architectureModel.json`` by ``scripts/build_architecture_model.py`` and checked by
``tests/test_architecture_model.py``. Nothing here is tenant evidence: it is a proposed design for evaluation, not an approved
topology. No cloud resource is created or contacted.

S1  SAP-centric:              SAP BTP Cloud Foundry agent + Apigee MCP/API; registry = domain-managed catalog (product pending).
S2  AWS AgentCore-centric:    AgentCore Runtime agent + AgentCore Gateway + Apigee MCP/API; AWS Agent Registry.
S3  SAP-hosted hybrid:        SAP BTP Cloud Foundry agent + Apigee MCP/API; AWS Agent Registry for registration and discovery only.
Portkey is the LLM gateway in all three; SAP Integration Suite is the SAP integration boundary; the SAP backend decides authorization.
"""
from __future__ import annotations

import re

MODEL_VERSION = "5.1"
STATUS_BANNER = "PROPOSED DESIGN FOR EVALUATION · NOT TENANT-VERIFIED · NOT AN APPROVED ARCHITECTURE"
SCENARIO_IDS = ("S1", "S2", "S3")
UNRESOLVED = "Domain-managed catalog · product selection pending"
PENDING = "TBD · REQUIRES VALIDATION"

# --------------------------------------------------------------------------- scenarios
SCENARIOS: dict[str, dict] = {
    "S1": {
        "id": "S1", "name": "S1 · SAP-centric", "short": "SAP-centric",
        "status": "Evaluation candidate",
        "objective": "SAP owns agent execution and the domain's MCP capability. Apigee is the SAP-facing MCP/API gateway. Registration is domain-managed; no AWS component takes part.",
        "agent_runtime": "SAP BTP Cloud Foundry",
        "agent_hosting_owner": "SAP BTP platform team",
        "agent_execution_endpoint": "Cloud Foundry application route (agent API)",
        "ui_hosting": "SAP Fiori launchpad or the existing application UI",
        "mcp_client": "Inside the agent process on Cloud Foundry",
        "mcp_endpoint_type": "Apigee-managed MCP endpoint (Pattern A); custom MCP server behind Apigee only where logic is needed (Pattern B)",
        "mcp_gateway": "Google Apigee (SAP-facing MCP/API gateway and policy layer)",
        "custom_mcp_runtime": "SAP BTP Cloud Foundry, only if required",
        "custom_mcp_hosting_owner": "SAP BTP platform team",
        "mcp_tool_execution_location": "Pattern A: API operation behind Apigee. Pattern B: the custom MCP service on Cloud Foundry",
        "agent_registry": UNRESOLVED,
        "mcp_registry": UNRESOLVED,
        "registry_publisher_approver": "Domain team publishes; approval owner " + PENDING,
        "registry_sync": "Not defined. No product is selected, so no synchronization mechanism exists",
        "agent_discovery": "Domain-managed catalog lookup (mechanism " + PENDING + ")",
        "mcp_tool_discovery": "Apigee MCP tools/list at the endpoint; catalog lookup " + PENDING,
        "agentcore_runtime": False, "agentcore_gateway": False, "aws_agent_registry": False,
        "llm_gateway": "Portkey",
        "llm_boundary": "Cloud Foundry agent → Portkey → approved LLM provider. No direct provider route",
        "integration_suite": "SAP Integration Suite (API Management / Cloud Integration)",
        "cloud_connector": "SAP Cloud Connector, where the system connectivity model needs it (conditional)",
        "backend_authorization": "Target SAP backend roles of the mapped user or service identity",
        "identity_boundary": "Enterprise IdP or SAP Cloud Identity Services (IAS, candidate); token exchange and user mapping subject to validation",
        "persistence": "Conditional: SAP HANA Cloud or an existing approved store, only if durable state is required",
        "monitoring_audit": "SAP BTP logs for the agent; Apigee analytics; Integration Suite monitoring; SAP change documents",
        "artifact_repository": "Organization Git; Cloud Foundry application artifacts; Apigee proxy bundles and OpenAPI specs",
        "trust_boundaries": ["SAP BTP", "Google Apigee", "SAP landscape", "Portkey / LLM provider"],
        "assumptions": ["Apigee MCP is enabled for the organization and fronts approved Integration Suite APIs", "An enterprise IdP can issue tokens to the Cloud Foundry agent"],
        "unverified": ["Registry product for agents and MCP", "Apigee-to-Integration Suite identity mapping", "Principal propagation to the SAP backend"],
        "policy_dependencies": ["Whether the enterprise requires central registration of agents and MCP servers", "Who owns domain MCP interfaces"],
        "hosting_note": "Registry is Domain-managed — product selection pending. Do not read it as an SAP-native Agent Registry.",
    },
    "S2": {
        "id": "S2", "name": "S2 · AWS AgentCore-centric", "short": "AgentCore-centric",
        "status": "Evaluation candidate",
        "objective": "AWS owns agent execution, any custom MCP code hosting, the runtime gateway and enterprise registration. Apigee remains the SAP-facing MCP/API gateway behind AgentCore Gateway.",
        "agent_runtime": "AWS AgentCore Runtime",
        "agent_hosting_owner": "AWS cloud platform team",
        "agent_execution_endpoint": "AgentCore Runtime agent invocation endpoint",
        "ui_hosting": "Existing application UI or SAP Fiori acting as an agent client",
        "mcp_client": "Inside the agent process on AgentCore Runtime",
        "mcp_endpoint_type": "AgentCore Gateway MCP endpoint toward the agent; Apigee-managed MCP endpoint (Pattern A) toward SAP; custom MCP on AgentCore Runtime only if required (Pattern B)",
        "mcp_gateway": "AWS AgentCore Gateway (enterprise MCP gateway) and Google Apigee (SAP-facing MCP/API gateway)",
        "custom_mcp_runtime": "AWS AgentCore Runtime, if required",
        "custom_mcp_hosting_owner": "AWS cloud platform team",
        "mcp_tool_execution_location": "Pattern A: API operation behind Apigee. Pattern B: custom MCP on AgentCore Runtime, reached through Apigee as a cross-cloud target (conditional)",
        "agent_registry": "AWS Agent Registry",
        "mcp_registry": "AWS Agent Registry",
        "registry_publisher_approver": "AI Foundry publishes; approval owner " + PENDING,
        "registry_sync": "Registry records created from agent and MCP descriptors; external sources via registry synchronization where supported",
        "agent_discovery": "AWS Agent Registry search, approved records only",
        "mcp_tool_discovery": "AgentCore Gateway tools/list; MCP descriptor in AWS Agent Registry",
        "agentcore_runtime": True, "agentcore_gateway": True, "aws_agent_registry": True,
        "llm_gateway": "Portkey",
        "llm_boundary": "AgentCore Runtime agent → Portkey → approved LLM provider. No direct provider route",
        "integration_suite": "SAP Integration Suite (API Management / Cloud Integration)",
        "cloud_connector": "SAP Cloud Connector, where the system connectivity model needs it (conditional)",
        "backend_authorization": "Target SAP backend roles of the mapped user or service identity",
        "identity_boundary": "Enterprise IdP and AgentCore Identity toward the gateway; Apigee and Integration Suite identities beyond; token exchange and user mapping subject to validation",
        "persistence": "Conditional: approved AWS persistence, only if durable state is required",
        "monitoring_audit": "AgentCore Runtime and Gateway observability; Apigee analytics; Integration Suite monitoring; SAP change documents",
        "artifact_repository": "Organization Git; container registry for the runtime image; gateway target definitions; Apigee bundles and specs",
        "trust_boundaries": ["AWS", "Google Apigee", "SAP landscape", "Portkey / LLM provider"],
        "assumptions": ["AgentCore Gateway can register Apigee's MCP endpoint as a target", "An AWS-hosted custom MCP can be proxied by Apigee (conditional)"],
        "unverified": ["AgentCore Gateway to Apigee protocol and token exchange; target classification of an external MCP server (MCP or HTTP target) is unclear in the documentation", "Two policy points on one call (gateway then Apigee)", "AWS Agent Registry availability and region"],
        "policy_dependencies": ["Whether AI Foundry requires AgentCore for all agent hosting", "Ownership of duplicated gateway policy"],
        "hosting_note": "AgentCore Runtime, AgentCore Gateway and AWS Agent Registry are three distinct capabilities.",
    },
    "S3": {
        "id": "S3", "name": "S3 · SAP-hosted hybrid", "short": "SAP-hosted hybrid",
        "status": "Preferred candidate — subject to AI Foundry policy and POC validation",
        "objective": "SAP retains execution ownership while AI Foundry manages central discovery and registration. Hosting on SAP BTP, registration in AWS Agent Registry, no AWS execution hop.",
        "agent_runtime": "SAP BTP Cloud Foundry",
        "agent_hosting_owner": "SAP BTP platform team",
        "agent_execution_endpoint": "Cloud Foundry application route (agent API)",
        "ui_hosting": "SAP Fiori launchpad or the existing application UI",
        "mcp_client": "Inside the agent process on Cloud Foundry",
        "mcp_endpoint_type": "Apigee-managed MCP endpoint (Pattern A); custom MCP server behind Apigee only where logic is needed (Pattern B)",
        "mcp_gateway": "Google Apigee (SAP-facing MCP/API gateway and policy layer)",
        "custom_mcp_runtime": "SAP BTP Cloud Foundry, if required",
        "custom_mcp_hosting_owner": "SAP BTP platform team",
        "mcp_tool_execution_location": "Pattern A: API operation behind Apigee. Pattern B: the custom MCP service on Cloud Foundry",
        "agent_registry": "AWS Agent Registry",
        "mcp_registry": "AWS Agent Registry",
        "registry_publisher_approver": "AI Foundry approves; domain team publishes SAP-hosted agent and Apigee MCP endpoint metadata",
        "registry_sync": "Registry records for SAP-hosted agent and Apigee MCP endpoint, created or synchronized from external sources where supported (control plane only)",
        "agent_discovery": "AWS Agent Registry search, approved records only",
        "mcp_tool_discovery": "Apigee MCP tools/list at the endpoint; endpoint metadata in AWS Agent Registry",
        "agentcore_runtime": False, "agentcore_gateway": False, "aws_agent_registry": True,
        "llm_gateway": "Portkey",
        "llm_boundary": "Cloud Foundry agent → Portkey → approved LLM provider. No direct provider route",
        "integration_suite": "SAP Integration Suite (API Management / Cloud Integration)",
        "cloud_connector": "SAP Cloud Connector, where the system connectivity model needs it (conditional)",
        "backend_authorization": "Target SAP backend roles of the mapped user or service identity",
        "identity_boundary": "Enterprise IdP or SAP Cloud Identity Services (IAS, candidate); registry access is a separate control-plane identity; token exchange and user mapping subject to validation",
        "persistence": "Conditional: SAP HANA Cloud or an existing approved store, only if durable state is required",
        "monitoring_audit": "SAP BTP logs for the agent; Apigee analytics; Integration Suite monitoring; SAP change documents; registry audit for publication events",
        "artifact_repository": "Organization Git; Cloud Foundry application artifacts; Apigee bundles and specs; registry record definitions",
        "trust_boundaries": ["SAP BTP", "Google Apigee", "SAP landscape", "AWS (control plane only)", "Portkey / LLM provider"],
        "assumptions": ["AWS Agent Registry can hold records for agents and MCP servers that run outside AWS (record sync connects from AWS to the endpoint URL with outbound credentials)", "Registration does not require AWS to host or invoke anything"],
        "unverified": ["Registry synchronization from the external sources in this tenant: AWS must be able to reach the Apigee or Cloud Foundry URL with an outbound credential from a provider in the same account", "AI Foundry stance on tool calls that bypass AgentCore Gateway", "Cross-cloud administration of registry records"],
        "policy_dependencies": ["AI Foundry policy on whether AgentCore Gateway is mandatory for all tool invocations (see S3-B)"],
        "hosting_note": "AWS Agent Registry handles registration, discovery and governance metadata. It is never an execution hop.",
        "variant_b": "S3-B (policy-dependent, not baseline): if AI Foundry mandates AgentCore Gateway for every tool invocation, AgentCore Gateway sits between the agent and Apigee. It is documented as an option, not a fourth primary scenario.",
    },
}

# --------------------------------------------------------------------------- comparison (section 7)
COMPARISON: list[tuple[str, str, str, str]] = [
    ("Agent hosting", "SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "SAP BTP Cloud Foundry"),
    ("Agent execution", "Cloud Foundry application", "AgentCore Runtime agent", "Cloud Foundry application"),
    ("MCP gateway", "Google Apigee", "AgentCore Gateway (enterprise) in front of Google Apigee (SAP-facing)", "Google Apigee"),
    ("Managed MCP endpoint versus custom server", "Pattern A is the default: an approved API exposed as an MCP tool through Apigee, no custom server. Pattern B only where logic needs code", "Same two patterns behind Apigee; AgentCore Gateway fronts both", "Same as S1"),
    ("Custom MCP server hosting", "SAP BTP Cloud Foundry, only if required", "AWS AgentCore Runtime, if required (proxied by Apigee: cross-cloud, conditional)", "SAP BTP Cloud Foundry, if required"),
    ("MCP tool execution", "Behind Apigee: API operation, or the Cloud Foundry service", "Behind Apigee: API operation, or the AgentCore-hosted service through a cross-cloud target", "Behind Apigee: API operation, or the Cloud Foundry service"),
    ("Agent registry", UNRESOLVED, "AWS Agent Registry", "AWS Agent Registry"),
    ("MCP registry", UNRESOLVED, "AWS Agent Registry", "AWS Agent Registry"),
    ("LLM routing", "Portkey", "Portkey", "Portkey"),
    ("Persistence", "Conditional: SAP HANA Cloud or an existing approved store", "Conditional: approved AWS persistence", "Conditional: SAP HANA Cloud or an existing approved store"),
    ("Identity propagation", "Enterprise IdP or IAS to agent, Apigee, Integration Suite; mapping to validate", "Adds AgentCore Identity and a second gateway hop; mapping to validate", "As S1 plus a separate control-plane identity to the registry"),
    ("SAP connectivity", "Apigee → SAP Integration Suite → Cloud Connector where applicable → SAP backend", "Same after Apigee", "Same as S1"),
    ("Business authorization", "SAP backend, always", "SAP backend, always", "SAP backend, always"),
    ("Operational responsibility", "SAP BTP team runs the agent and any custom MCP; the integration team runs Apigee", "AWS team runs agent, gateway and any custom MCP; the integration team runs Apigee", "As S1; AI Foundry runs the registry"),
    ("Monitoring and audit", "BTP logs, Apigee analytics, Integration Suite monitoring; correlation id to propagate", "AgentCore observability plus the same SAP-side sources; two gateway logs to correlate", "As S1 plus registry publication audit"),
    ("Scalability", "Cloud Foundry application scaling; limited by BTP quota", "AgentCore managed runtime scaling", "As S1"),
    ("Network complexity", "Cloud Foundry → Apigee (cross-cloud) → Integration Suite", "AWS → Apigee (cross-cloud) → Integration Suite; Pattern B adds Apigee → AWS", "As S1; registry traffic is separate control-plane traffic"),
    ("Cost drivers", "BTP runtime, Apigee, Integration Suite, Portkey", "AgentCore Runtime and Gateway, Agent Registry, Apigee, Integration Suite, Portkey", "BTP runtime, Agent Registry, Apigee, Integration Suite, Portkey"),
    ("Vendor and platform dependencies", "SAP BTP, Google Apigee", "AWS, Google Apigee", "SAP BTP, AWS (registry only), Google Apigee"),
    ("Enterprise governance alignment", "Registry unresolved: governance for discovery is a gap", "Aligned with AWS-centric AI Foundry governance", "Central registration under AI Foundry with SAP execution ownership"),
    ("Deployment prerequisites", "Cloud Foundry space, Apigee MCP enablement, Integration Suite APIs, IdP, Portkey route", "AgentCore access in region, Gateway target for Apigee, registry, Apigee MCP, IdP, Portkey route", "As S1 plus Agent Registry access and record synchronization method"),
    ("Open architecture decisions", "Which registry product; who approves publication", "Gateway-to-Apigee token exchange; duplicate policy ownership", "Whether AgentCore Gateway is mandated (S3-B); registry synchronization method"),
]

# --------------------------------------------------------------------------- connection tables
CONN_COLS = ["Source", "Destination", "Plane", "Protocol", "Authentication", "Verification"]
DOC = "Vendor-documented · tenant NOT_VERIFIED"
DES = "Design assumption"


def _chain(agent: str, gw: list[tuple[str, str, str]], registry: str, mcp_registry_note: str, scenario: str) -> list[list[str]]:
    rows = [["SAP Fiori / existing UI", agent, "Runtime", "HTTPS", "User sign-in; delegated token to validate", DES]]
    rows += [list(g) for g in gw]
    rows += [
        ["Apigee MCP/API", "SAP Integration Suite", "Runtime", "HTTPS REST or OData", "OAuth client or certificate; mapping to validate", DES],
        ["SAP Integration Suite", "SAP Cloud Connector (conditional)", "Runtime", "HTTPS tunnel", "Cloud Connector subaccount trust", "Applicable only for private connectivity"],
        ["SAP Cloud Connector or Integration Suite", "SAP backend (S/4HANA · Central Finance)", "Runtime", "RFC / OData", "Principal propagation or technical user; SAP roles decide", DES],
        [agent, "Portkey", "LLM", "HTTPS", "Portkey credential; provider keys held in Portkey", DES],
        ["Portkey", "Approved LLM provider", "LLM", "HTTPS", "Provider credential held in Portkey", DES],
        [agent, registry, "Registration / discovery (not invocation)", "Registry API", "Registry identity", mcp_registry_note],
    ]
    return rows


CONNECTIONS: dict[str, list[list[str]]] = {
    "S1": _chain("Cloud Foundry agent (MCP client)",
                 [["Cloud Foundry agent (MCP client)", "Apigee MCP endpoint", "Runtime", "MCP over Streamable HTTP", "OAuth 2.1 / OIDC bearer or API key per product", DOC]],
                 UNRESOLVED, PENDING, "S1")
    + [["Apigee MCP endpoint", "Custom MCP server on Cloud Foundry (Pattern B)", "Runtime (conditional)", "HTTPS proxy target", "Target credential held by Apigee", "Only where custom logic is required"]],
    "S2": _chain("AgentCore Runtime agent (MCP client)",
                 [["AgentCore Runtime agent (MCP client)", "AgentCore Gateway", "Runtime", "MCP over Streamable HTTP", "JWT bearer validated by the gateway authorizer, or IAM", DOC],
                  ["AgentCore Gateway", "Apigee MCP endpoint", "Runtime", "MCP over Streamable HTTP; protocol compatibility unproven", "Outbound OAuth or API key via AgentCore Identity; token exchange to validate", PENDING]],
                 "AWS Agent Registry", DOC, "S2")
    + [["Apigee MCP endpoint", "Custom MCP on AgentCore Runtime (Pattern B)", "Runtime (conditional, cross-cloud)", "HTTPS proxy target", "Target credential held by Apigee", "Only where custom logic is required; extra network hop"]],
    "S3": _chain("Cloud Foundry agent (MCP client)",
                 [["Cloud Foundry agent (MCP client)", "Apigee MCP endpoint", "Runtime", "MCP over Streamable HTTP", "OAuth 2.1 / OIDC bearer or API key per product", DOC]],
                 "AWS Agent Registry", DOC, "S3")
    + [["Apigee MCP endpoint metadata", "AWS Agent Registry", "Registration (not invocation)", "Registry API or synchronization where supported", "Registry identity, separate from runtime identity", PENDING],
       ["Apigee MCP endpoint", "Custom MCP server on Cloud Foundry (Pattern B)", "Runtime (conditional)", "HTTPS proxy target", "Target credential held by Apigee", "Only where custom logic is required"]],
}

# --------------------------------------------------------------------------- diagram specs
LEGEND_ALL = ["invoke", "registry", "llm", "identity", "audit", "approval"]


def n(id: str, row: int, col: int, title: str, sub: str, kind: str, **kw) -> dict:
    return {"id": id, "row": row, "col": col, "title": title, "sub": sub, "kind": kind, **kw}


def e(a: str, b: str, kind: str, label: str = "", **opts) -> list:
    return [a, b, kind, label, opts] if opts else [a, b, kind, label]


def _spec(id: str, title: str, chain: str, nodes: list, edges: list, *, cols: int, bounds=(), lanes=(), legend=None, footer: str = "", nh: int = 100, ys=None, height: int = 840, scenario: str | None = None) -> dict:
    return {"id": id, "scenario": scenario, "title": title, "chain": chain, "banner": STATUS_BANNER, "cols": cols, "nh": nh, "ys": ys or [118, 258, 398, 528, 668],
            "height": height, "nodes": nodes, "edges": edges, "bounds": [list(b) for b in bounds], "lanes": [list(x) for x in lanes], "legend": legend or LEGEND_ALL,
            "footer": footer or "Proposed design for review. Vendor names are design projections, not connected services. Registry, identity, LLM and audit arrows are not invocation traffic."}


def _scenario_diagram(sid: str) -> dict:
    sc = SCENARIOS[sid]
    s2 = sid == "S2"
    cols = 7 if s2 else 6
    nodes = [
        n("ui", 1, 0, "SAP Fiori / existing UI", "Finance user entry; application unchanged", "ui"),
        n("idp", 0, 0, "Enterprise identity", "IdP or SAP Cloud Identity (IAS, candidate); mapping to validate", "identity"),
    ]
    edges: list = []
    if s2:
        nodes += [
            n("agent", 1, 1, "Agent · AWS AgentCore Runtime", "Agent execution and MCP client", "agent"),
            n("gw", 1, 2, "AWS AgentCore Gateway", "Enterprise MCP gateway; routes and authorizes", "gateway"),
            n("apigee", 1, 3, "Google Apigee MCP/API", "SAP-facing gateway; managed MCP endpoint (Pattern A)", "gateway"),
            n("int", 1, 4, "SAP Integration Suite", "SAP integration boundary", "integration"),
            n("cc", 1, 5, "SAP Cloud Connector", "Conditional, private connectivity only", "integration", dashed=True),
            n("sap", 1, 6, "SAP backend", "S/4HANA · Central Finance; business authorization", "backend"),
            n("custom", 2, 3, "Custom MCP · AgentCore Runtime", "Pattern B, conditional; via Apigee, cross-cloud", "domain", dashed=True),
            n("reg_agent", 3, 1, "Agent registry · AWS Agent Registry", "Agent descriptor; discovery and approval", "registry"),
            n("reg_mcp", 3, 2, "MCP registry · AWS Agent Registry", "MCP descriptor; discovery and approval", "registry"),
            n("portkey", 0, 1, "Portkey", "LLM gateway: model selection, credentials, fallback", "llm"),
            n("llm", 0, 2, "Approved LLM provider", "Reached only through Portkey", "llm"),
            n("db", 2, 0, "Persistence · conditional", "Approved AWS store, only if durable state is needed", "store", dashed=True),
        ]
        edges += [
            e("ui", "agent", "invoke", ""), e("agent", "gw", "invoke", "MCP tools/call"), e("gw", "apigee", "invoke", ""),
            e("apigee", "int", "invoke", "API call"), e("int", "cc", "invoke", "if private"), e("cc", "sap", "invoke", "RFC / OData"),
            e("apigee", "custom", "invoke", "proxy target · cross-cloud", off=-30),
            e("agent", "portkey", "llm", "LLM request", off=-14), e("portkey", "llm", "llm", "model call"),
            e("idp", "agent", "identity", "workload / user token"),
            e("agent", "reg_agent", "registry", "agent descriptor", off=-20, labelAt="mid"), e("gw", "reg_mcp", "registry", "MCP descriptor", off=-20, labelAt="mid"),
            e("agent", "db", "invoke", "state if required", off=20),
        ]
        bounds = [("AWS", ["agent", "gw"], "aws"), ("Google Apigee", ["apigee"], "google"), ("SAP landscape", ["int", "cc", "sap"], "sap")]
        chain = "UI → AgentCore Runtime agent → AgentCore Gateway → Apigee MCP/API → Integration Suite → Cloud Connector (conditional) → SAP backend"
        footer = "Registration/discovery goes to AWS Agent Registry and is separate from the runtime path. AgentCore Runtime, Gateway and Registry are three capabilities. Apigee stays mandatory."
    else:
        agent_title = "Agent · SAP BTP Cloud Foundry"
        nodes += [
            n("agent", 1, 1, agent_title, "Agent execution and MCP client", "agent"),
            n("apigee", 1, 2, "Google Apigee MCP/API", "SAP-facing gateway; managed MCP endpoint (Pattern A)", "gateway"),
            n("int", 1, 3, "SAP Integration Suite", "SAP integration boundary", "integration"),
            n("cc", 1, 4, "SAP Cloud Connector", "Conditional, private connectivity only", "integration", dashed=True),
            n("sap", 1, 5, "SAP backend", "S/4HANA · Central Finance; business authorization", "backend"),
            n("custom", 2, 3, "Custom MCP · SAP BTP Cloud Foundry", "Pattern B, only if required; behind Apigee", "domain", dashed=True),
            n("portkey", 0, 1, "Portkey", "LLM gateway: model selection, credentials, fallback", "llm"),
            n("llm", 0, 2, "Approved LLM provider", "Reached only through Portkey", "llm"),
            n("db", 2, 0, "Persistence · conditional", "SAP HANA Cloud or existing approved store, only if needed", "store", dashed=True),
        ]
        edges += [
            e("ui", "agent", "invoke", ""), e("agent", "apigee", "invoke", "MCP tools/call"), e("apigee", "int", "invoke", "API call"),
            e("int", "cc", "invoke", "if private"), e("cc", "sap", "invoke", "RFC / OData"),
            e("apigee", "custom", "invoke", "proxy target"),
            e("agent", "portkey", "llm", "LLM request", off=-14), e("portkey", "llm", "llm", "model call"),
            e("idp", "agent", "identity", "workload / user token"),
            e("agent", "db", "invoke", "state if required", off=20),
        ]
        bounds = [("SAP BTP", ["agent"], "sap"), ("Google Apigee", ["apigee"], "google"), ("SAP landscape", ["int", "cc", "sap"], "sap")]
        if sid == "S1":
            nodes += [
                n("reg_agent", 3, 1, "Agent registry", "Domain-managed catalog", "registry", dashed=True, status="PRODUCT SELECTION PENDING", statusColor="#B3261E"),
                n("reg_mcp", 3, 2, "MCP registry", "Domain-managed catalog", "registry", dashed=True, status="PRODUCT SELECTION PENDING", statusColor="#B3261E"),
            ]
            edges += [e("agent", "reg_agent", "registry", "register / discover", off=-20, labelAt="mid"), e("apigee", "reg_mcp", "registry", "register / discover", off=-20, labelAt="mid")]
            chain = "UI → Cloud Foundry agent → Apigee MCP/API → Integration Suite → Cloud Connector (conditional) → SAP backend"
            footer = "No AWS AgentCore component takes part. The registry is not selected yet: a plain API catalog is not a complete agent registry."
        else:
            nodes += [
                n("reg_agent", 3, 1, "Agent registry · AWS Agent Registry", "SAP-hosted agent metadata", "registry"),
                n("reg_mcp", 3, 2, "MCP registry · AWS Agent Registry", "Apigee MCP endpoint metadata", "registry"),
                n("s3b", 4, 0, "S3-B variant · not baseline", "Only if AI Foundry mandates AgentCore Gateway for all tool calls: it would sit between agent and Apigee. Policy-dependent option.", "decision", span=4, h=70, dashed=True),
            ]
            edges += [e("agent", "reg_agent", "registry", "agent metadata", off=-20, labelAt="mid"), e("apigee", "reg_mcp", "registry", "endpoint metadata", off=-20, labelAt="mid")]
            bounds += [("AWS control plane only", ["reg_agent", "reg_mcp"], "aws")]
            chain = "UI → Cloud Foundry agent → Apigee MCP/API → Integration Suite → Cloud Connector (conditional) → SAP backend"
            footer = "AWS Agent Registry registers and governs. It is not an execution hop: no AgentCore Runtime, and no AgentCore Gateway in the baseline."
    lanes = [(0, "IDENTITY · LLM"), (1, "RUNTIME PATH"), (2, "OPTIONAL"), (3, "CONTROL PLANE")]
    return _spec(f"D{ {'S1': 2, 'S2': 3, 'S3': 4}[sid] }", f"{sc['name']} · topology", chain, nodes, edges, cols=cols, bounds=bounds, lanes=lanes, legend=["invoke", "llm", "identity", "registry"], footer=footer, scenario=sid)


def _d1() -> dict:
    nodes = [
        n("idp", 0, 0, "Identity providers", "Enterprise IdP, SAP Cloud Identity (candidate); trust boundaries", "identity"),
        n("reg", 0, 2, "Agent and MCP registries", "Control plane: catalog, discovery, approval", "registry"),
        n("ent", 0, 4, "AI Foundry governance", "Approval and publication authority", "decision"),
        n("ui", 1, 0, "SAP Fiori / existing UI", "Finance user entry", "ui"),
        n("agent", 1, 1, "Agent execution platform", "Runtime plane · hosts agent and MCP client", "agent"),
        n("gw", 1, 2, "MCP gateway / API layer", "Google Apigee; AgentCore Gateway in S2 only", "gateway"),
        n("int", 1, 3, "SAP Integration Suite", "SAP integration boundary", "integration"),
        n("cc", 1, 4, "SAP Cloud Connector", "Conditional", "integration", dashed=True),
        n("sap", 1, 5, "SAP Finance backend", "S/4HANA · Central Finance", "backend"),
        n("portkey", 2, 0, "Portkey", "LLM gateway", "llm"),
        n("llm", 2, 1, "Approved LLM provider", "Only through Portkey", "llm"),
        n("custom", 2, 2, "Custom MCP runtime", "Only where logic needs code; platform per scenario", "domain", dashed=True),
        n("obs", 3, 3, "Observability and audit", "Evidence plane: logs, traces, change documents", "store", span=3),
    ]
    edges = [
        e("ui", "agent", "invoke", ""), e("agent", "gw", "invoke", "MCP tools/call"), e("gw", "int", "invoke", "API call"), e("int", "cc", "invoke", "if private"), e("cc", "sap", "invoke", "RFC / OData"),
        e("gw", "custom", "invoke", "proxy target (if needed)"),
        e("agent", "portkey", "llm", "LLM request", off=-14), e("portkey", "llm", "llm", "model call"),
        e("idp", "agent", "identity", "tokens"),
        e("agent", "reg", "registry", "register / discover", off=14), e("ent", "reg", "approval", "approve"),
        e("cc", "obs", "audit", "evidence"), e("sap", "obs", "audit", "evidence"),
    ]
    lanes = [(0, "CONTROL PLANE"), (1, "RUNTIME PLANE"), (2, "LLM · OPTIONAL"), (3, "EVIDENCE PLANE")]
    return _spec("D1", "Enterprise architecture overview", "Control plane · runtime plane · evidence plane, common to S1, S2 and S3", nodes, edges, cols=6, lanes=lanes,
                 bounds=[("SAP landscape", ["int", "cc", "sap"], "sap")], legend=LEGEND_ALL, footer="No registry is a runtime hop. Per-scenario placement of the agent platform and gateway is in D2 to D4.")


def _d5() -> dict:
    cols = ("S1 · SAP-centric", "S2 · AWS AgentCore-centric", "S3 · SAP-hosted hybrid")
    rows = [
        ("Agent hosting and execution", ["SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "SAP BTP Cloud Foundry"]),
        ("Agent registration and discovery", [UNRESOLVED, "AWS Agent Registry", "AWS Agent Registry"]),
        ("MCP implementation hosting and execution", ["Cloud Foundry, only if custom code is needed", "AgentCore Runtime, only if custom code is needed", "Cloud Foundry, only if custom code is needed"]),
        ("MCP registration and discovery", [UNRESOLVED, "AWS Agent Registry", "AWS Agent Registry"]),
        ("MCP gateway / exposure (shared responsibility)", ["Google Apigee", "AgentCore Gateway + Google Apigee", "Google Apigee"]),
        ("LLM gateway (common to all)", ["Portkey", "Portkey", "Portkey"]),
    ]
    nodes, edges = [], []
    for r, (label, vals) in enumerate(rows):
        nodes.append(n(f"l{r}", r, 0, label, "Independent decision" if r < 4 else "Shared across scenarios", "decision" if r < 4 else ("gateway" if r == 4 else "llm")))
        for c, v in enumerate(vals, start=1):
            kind = ("agent", "registry", "domain", "registry", "gateway", "llm")[r]
            extra = {"dashed": True} if (v == UNRESOLVED) else {}
            nodes.append(n(f"c{r}_{c}", r, c, v, cols[c - 1], kind, **extra, **({"status": "PRODUCT PENDING", "statusColor": "#B3261E"} if v == UNRESOLVED else {})))
    for c in (1, 2, 3):
        edges.append(e(f"c0_{c}", f"c1_{c}", "registry", "metadata only" if c != 2 else "metadata", off=0))
        edges.append(e(f"c2_{c}", f"c3_{c}", "registry", "metadata only"))
    return _spec("D5", "MCP hosting versus registration", "Four independent decisions, plus the MCP gateway and the LLM gateway as separate shared responsibilities", nodes, edges, cols=4, legend=["registry"], nh=76, ys=[104, 208, 312, 416, 520, 624],
                 footer="Using AWS Agent Registry (S3) does not require AWS agent hosting: the agent still runs on SAP BTP Cloud Foundry. The dashed arrow carries metadata only.")


def _d6() -> dict:
    nodes = [
        n("idp", 0, 1, "SAP Cloud Identity Services (IAS) · candidate trust component", "Evaluate as trust component; Global User ID as identity-correlation attribute where supported", "identity", span=3, h=70),
        n("user", 1, 0, "Business user", "Authenticates at the IdP", "ui"),
        n("agent", 1, 1, "Agent workload identity", "Identity of the agent runtime", "agent"),
        n("mcp", 1, 2, "MCP client identity", "Token the client presents to the gateway", "agent"),
        n("gw", 1, 3, "Gateway identity", "Apigee (and AgentCore Gateway in S2)", "gateway"),
        n("int", 1, 4, "Integration Suite identity", "Service identity toward SAP", "integration"),
        n("sap", 1, 5, "SAP backend identity", "Mapped user or technical user executes", "backend"),
        n("notenough", 2, 0, "Not sufficient on its own", "A Global User ID or an ordinary HTTP header is not principal propagation", "decision", span=2, h=80),
        n("tx", 2, 2, "Token exchange / user mapping", "Subject to validation at every boundary: PENDING, not proven", "decision", span=2, h=80, dashed=True),
        n("neg", 2, 4, "Negative case", "Agent may discover and call the tool; SAP rejects an operation the mapped user lacks authority for", "decision", span=2, h=80),
        n("auth", 3, 0, "SAP backend is the business authority", "Registry visibility, gateway access and tool discovery never grant business authorization. Business approval is a separate step.", "backend", span=3, h=84),
        n("byscen", 3, 3, "What differs by scenario", "S1: agent to Apigee, one hop. S2: agent to AgentCore Gateway to Apigee, two hops. S3: as S1, plus a separate registry identity.", "decision", span=3, h=84),
    ]
    edges = [
        e("user", "agent", "identity", "delegated user token"), e("agent", "mcp", "identity", "client credential"), e("mcp", "gw", "identity", "bearer · validated"),
        e("gw", "int", "identity", "OAuth / cert · mapping"), e("int", "sap", "identity", "principal propagation"),
        e("idp", "agent", "identity", "issues tokens", off=-20), e("idp", "gw", "identity", "validates", off=-10),
    ]
    return _spec("D6", "Identity, authorization and principal propagation", "Six identities, five boundaries; SAP decides business authorization", nodes, edges, cols=6, legend=["identity"], nh=96,
                 lanes=[(1, "IDENTITIES"), (2, "VALIDATION")], footer="Authentication and authorization are separate at each boundary. Token exchange and user mapping are design assumptions until validated.")


def _d7() -> dict:
    nodes = [
        n("agent", 1, 0, "Agent runtime", "S1, S3: SAP BTP Cloud Foundry. S2: AgentCore Runtime", "agent"),
        n("portkey", 1, 1, "Portkey LLM gateway", "Single route to models in all scenarios", "llm"),
        n("llm", 1, 2, "Approved LLM provider", "Selected model", "llm"),
        n("sep", 1, 4, "MCP gateway and registries", "Separate planes: no path to Portkey", "gateway", dashed=True),
        n("m1", 2, 0, "Model selection", "Which approved model serves the request", "control"),
        n("m2", 2, 1, "Credential management", "Provider keys held in Portkey, not in the agent", "control"),
        n("m3", 2, 2, "Timeout and fallback", "Policy for slow or failed calls", "control"),
        n("m4", 2, 3, "Monitoring", "Usage, latency and cost per request", "control"),
        n("nobypass", 3, 0, "No direct provider route", "A call that bypasses Portkey is not permitted in any scenario", "decision", span=5, h=70),
    ]
    edges = [e("agent", "portkey", "llm", "LLM request"), e("portkey", "llm", "llm", "model call")]
    return _spec("D7", "LLM execution architecture", "Agent runtime → Portkey → approved LLM provider (common to S1, S2, S3)", nodes, edges, cols=5, legend=["llm"],
                 lanes=[(1, "LLM PATH"), (2, "AT PORTKEY")], footer="Portkey is independent of the MCP gateway and the registry. Model-provider routes that skip Portkey are not drawn because they are not allowed.")


def _d8() -> dict:
    top = ["Capability developed", "Versioned artifact", "Domain validation", "Approval", "Registry publication"]
    bottom = ["Discovery", "Invocation under runtime authorization", "Monitoring", "Version update or retirement", "Revocation and stale-metadata handling"]
    subs_top = ["Agent or MCP code and descriptor", "Git tag, image or spec version", "Domain owner checks scope", "AI Foundry or domain owner", "Registry record created"]
    subs_bottom = ["Approved records only", "Not proven by registration alone", "Runtime and registry telemetry", "New version or retire record", "Expired or revoked records must disappear"]
    nodes = [n(f"t{i}", 1, i, t, subs_top[i], "artifact" if i < 3 else "registry") for i, t in enumerate(top)]
    nodes += [n(f"b{i}", 2, 4 - i, t, subs_bottom[i], "agent" if i == 1 else "registry") for i, t in enumerate(bottom)]
    nodes += [
        n("ext", 3, 0, "External sources (S3)", "SAP-hosted agent and Apigee MCP endpoint metadata", "domain", span=1),
        n("areg", 3, 2, "AWS Agent Registry", "Synchronizes approved metadata from external sources where supported", "registry", span=1),
        n("warn", 4, 0, "Publication is not proof", "Not proof of endpoint reachability, runtime authorization or SAP execution. Stale or revoked metadata is detected by periodic re-validation.", "decision", span=5, h=70),
    ]
    edges = [e(f"t{i}", f"t{i + 1}", "invoke", "") for i in range(4)] + [e("t4", "b0", "registry", "publish → discover")]
    edges += [e(f"b{i}", f"b{i + 1}", "invoke", "") for i in range(4)]
    edges += [e("ext", "areg", "registry", "sync approved metadata")]
    return _spec("D8", "Registry lifecycle and synchronization", "Developed → artifact → validation → approval → publication → discovery → invocation → monitoring → update or retirement", nodes, edges, cols=5, legend=["invoke", "registry"],
                 lanes=[(1, "PUBLISH"), (2, "USE · RETIRE"), (3, "")], footer="Lifecycle arrows show order of steps, not runtime traffic. Discovery returns metadata; invocation is a separate authorized call.")


def _d9() -> dict:
    names = [("Agent request", "Session and business correlation id created", "agent"), ("LLM request", "Portkey log with request id", "llm"), ("MCP tool invocation", "Client call and tool name", "agent"),
             ("Gateway decision", "Apigee (and AgentCore Gateway in S2) allow or deny", "gateway"), ("Integration Suite execution", "Message processing log", "integration"), ("SAP backend operation", "Application log and change documents", "backend")]
    nodes = [n(f"s{i}", 1, i, t, s, k) for i, (t, s, k) in enumerate(names)]
    nodes += [
        n("err", 2, 0, "Error / exception outcome", "Recorded with the same business correlation id", "decision", span=2, h=80),
        n("model", 2, 2, "Common correlation model", "Business id + session id + per-system request ids. Products do not share one trace id automatically", "store", span=4, h=80),
        n("join", 3, 0, "Evidence join", "Records are joined across systems by the business correlation id in an evidence store", "store", span=3, h=70),
        n("resp", 3, 3, "Audit responsibility", "Agent platform: agent and LLM. Gateway team: gateway. Integration team: Suite. SAP: backend", "control", span=3, h=70),
    ]
    edges = [e(f"s{i}", f"s{i + 1}", "audit", "correlate") for i in range(5)]
    return _spec("D9", "Observability and audit", "Agent request → LLM → MCP tool → gateway → Integration Suite → SAP backend, joined by a correlation id", nodes, edges, cols=6, legend=["audit"],
                 lanes=[(1, "EVIDENCE"), (2, "OUTCOME"), (3, "JOIN")], footer="The correlation id must be propagated by design and tested; it is not assumed to be carried by every product.")


def _d10() -> dict:
    registry = {"S1": ("Registry", UNRESOLVED, True), "S2": ("AWS Agent Registry", "Agent and MCP records", False), "S3": ("AWS Agent Registry", "Metadata only, not a hop", False)}
    host = {"S1": ("Cloud Foundry agent", "SAP BTP", "SAP-centric"), "S2": ("AgentCore Runtime agent", "AWS", "AWS AgentCore-centric"), "S3": ("Cloud Foundry agent", "SAP BTP", "SAP-hosted hybrid · preferred candidate")}
    nodes, edges = [], []
    for k, sid in enumerate(SCENARIO_IDS):
        r = 2 * k
        chain = [("ui", "SAP Fiori / UI", host[sid][2], "ui", 0), ("agent", host[sid][0], host[sid][1], "agent", 1)]
        if sid == "S2":
            chain.append(("gw", "AgentCore Gateway", "Enterprise gateway", "gateway", 2))
        chain += [("apigee", "Apigee MCP/API", "SAP-facing gateway", "gateway", 3), ("int", "Integration Suite", "SAP integration", "integration", 4), ("sap", "SAP backend", "Authorizes", "backend", 5)]
        prev = None
        for key, title, sub, kind, col in chain:
            nid = f"{sid}_{key}"
            nodes.append(n(nid, r, col, title, sub, kind))
            if prev:
                edges.append(e(prev, nid, "invoke", ""))
            prev = nid
        nodes.append(n(f"{sid}_portkey", r + 1, 1, "Portkey", "LLM gateway", "llm", h=56))
        edges.append(e(f"{sid}_agent", f"{sid}_portkey", "llm", ""))
        title, sub, pending = registry[sid]
        extra = {"dashed": True, "status": "PENDING", "statusColor": "#B3261E"} if pending else {}
        nodes.append(n(f"{sid}_reg", r + 1, 2, title, sub, "registry", h=56, **extra))
        edges.append(e(f"{sid}_agent", f"{sid}_reg", "registry", "", off=22))
    return _spec("D10", "Three-scenario comparison", "Same labels and ownership boundaries in every scenario; Portkey is common and the registry is never in the path", nodes, edges, cols=6, legend=["invoke", "llm", "registry"], nh=62,
                 ys=[104, 176, 304, 376, 504, 576], lanes=[(0, "S1"), (2, "S2"), (4, "S3 · PREFERRED CANDIDATE")],
                 footer="Portkey is the LLM gateway in all three. The SAP backend decides authorization in all three. S3-B (AgentCore Gateway mandated) is a separate option, not drawn.")


def diagrams() -> dict[str, dict]:
    out = {"D1": _d1(), "D2": _scenario_diagram("S1"), "D3": _scenario_diagram("S2"), "D4": _scenario_diagram("S3"), "D5": _d5(), "D6": _d6(), "D7": _d7(), "D8": _d8(), "D9": _d9(), "D10": _d10()}
    return out


DIAGRAM_NAMES = {"D1": "Enterprise overview", "D2": "S1 SAP-centric", "D3": "S2 AWS AgentCore-centric", "D4": "S3 SAP-hosted hybrid", "D5": "MCP hosting versus registration",
                 "D6": "Identity and authorization", "D7": "LLM execution", "D8": "Registry lifecycle", "D9": "Observability and audit", "D10": "Three-scenario comparison"}

RECOMMENDATION = {
    "headline": "S3 is the preferred candidate for POC validation, subject to AI Foundry policy. It is not approved and not production-ready.",
    "why": [
        "SAP keeps execution ownership: the agent and any custom MCP code run on SAP BTP Cloud Foundry, and Apigee stays the SAP-facing gateway.",
        "AI Foundry still gets central discovery and registration through AWS Agent Registry, which is control plane only and adds no execution hop.",
        "It needs one gateway hop and one identity mapping to prove, not two as in S2.",
    ],
    "depends": ["AI Foundry policy on whether AgentCore Gateway is mandatory for all tool invocations (S3-B)", "AWS Agent Registry accepts records for agents and MCP servers hosted outside AWS", "Approved synchronization method for registry records"],
    "open": ["Registry product for S1 (unresolved)", "Delegated user versus service identity", "Principal propagation through Integration Suite and Cloud Connector", "Whether HANA Cloud is needed at all: persistence is conditional"],
    "changes": ["If AI Foundry mandates AgentCore Gateway for every tool call, evaluate S3-B or S2.", "If the enterprise requires AWS hosting for all agents, choose S2.", "If no central registry is required, S1 is simplest but its registry stays unresolved."],
    "poc": ["Run one read tool through the S3 path with a service identity and record the call, token and SAP user.", "Repeat with user delegation and mark each result PASS, HOLD or NOT_VERIFIED.", "Register the SAP-hosted agent and the Apigee endpoint in AWS Agent Registry and confirm discovery without any AWS execution hop."],
}

EVIDENCE = [
    ["Google Apigee", "Apigee MCP overview", "https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-overview", "Existing Apigee APIs can be exposed as MCP tools through MCP endpoints with no local or remote MCP server to install or manage. OpenAPI 3.0.x only; a limit of 1000 MCP tools per organization; capacity limits in some regions; stateless protocol 2026-07-28 and stateful versions 2025-11-25 down to 2024-11-05.", "Pattern A needs no custom MCP server, within the tool and region limits.", "Tenant enablement, region capacity and hybrid version"],
    ["Google Apigee", "Manage MCP tool access", "https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/manage-mcp-tool-access", "Access is controlled with API products and developer apps; ParsePayload (JSON-RPC 2.0) plus API-key or OAuth verification; tools outside the client's product are removed from tools/list. The page also says traffic can be proxied to your own MCP server.", "Apigee is the policy layer for tool access, and Pattern B (custom server behind Apigee) is documented.", "API product design and the custom-server proxy pattern in this tenant"],
    ["AWS AgentCore", "Gateway core concepts", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-core-concepts.html", "Gateway is a secure entry point for agentic traffic with MCP, HTTP and inference target categories and inbound OAuth (JWT), IAM, authenticate-only or none. The page lists MCP servers under MCP targets and external MCP servers under HTTP targets, so target classification needs confirming.", "Makes the S2 gateway hop plausible; Apigee as a gateway target is unproven.", "Which target type fits the Apigee MCP endpoint; token exchange"],
    ["AWS AgentCore", "Agent Registry", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html", "A managed discovery service: a catalog for organizing, curating and discovering resources. Record types AGENT, MCP, SKILL, CUSTOM and WEB_BOT; publishers submit, curators approve. Runtime and Gateway are listed as related services, so it is separate from both. The older bedrock-agentcore preview namespace was announced for discontinuation on 2026-10-30.", "Registry is a separate capability from Runtime and Gateway and does not require AWS hosting. Use the agent-registry namespace.", "Availability and region in the tenant; curator and approval roles"],
    ["AWS AgentCore", "Registry: synchronize external records", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-sync-records.html", "The registry can synchronize record metadata from external sources by connecting to the provided URL with outbound credentials: MCP servers and A2A agent cards (credentials: none, OAuth through an AgentCore Identity provider, or IAM SigV4). The credential provider must be in the same account.", "Supports S3 registration of SAP-hosted metadata, but AWS must be able to reach the endpoint URL: that is a network and credential dependency, not an execution hop.", "Reachability of Apigee or Cloud Foundry URLs from AWS; credential provider"],
    ["AWS AgentCore", "Registry: supported record types", "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-supported-record-types.html", "AGENT records use a2aAgentCard, mcpServer or custom descriptors; MCP records use mcpServer or custom; exactly one primary descriptor per record. Agents that do not follow A2A can use mcpServer or custom.", "A SAP-hosted agent can be registered with a custom or mcpServer descriptor.", "Descriptor fit for our agents"],
    ["SAP", "SAP BTP Cloud Foundry runtime", "https://help.sap.com/docs/cf-runtime/cloud-foundry-runtime/what-is-sap-btp-cloud-foundry-runtime", "NOT_VERIFIED: the page returned no readable body when fetched (script-rendered), so no capability statement is recorded here.", "Cloud Foundry as the S1 and S3 agent host rests on the owner's brief and general knowledge, not on this page.", "Read the page in a browser; confirm entitlement and quota"],
]
EVIDENCE_STATUS = ("Pages read through a web fetch on 2026-11-25: six of seven returned content, summarized above; the SAP Cloud Foundry page returned no body and is NOT_VERIFIED. "
                   "Vendor documentation describes product capability only. It does not show that a feature is configured, licensed or available in this organization's tenant or region.")

DOMAINS = [
    {"name": "Finance Read MCP", "mode": "READ", "tools": "Reconciliation balances, ledger and period data, journal and document status, reconciliation exceptions", "control": "Read-only backend operations. No write tool is registered. This is the only capability the application uses."},
    {"name": "Finance Posting MCP", "mode": "WRITE · APPROVAL-GATED · NOT ACTIVE", "tools": "Future: propose and post a reconciliation adjustment through a governed approval", "control": "A separately governed capability. It is not active in this application and posting is never automatic."},
    {"name": "Analytical / Data MCP", "mode": "READ · FUTURE", "tools": "Authorized Databricks or BDC-backed context", "control": "Entitlement and scope: " + PENDING},
]


# --------------------------------------------------------------------------- validation
BAD_GOOGLE = re.compile(r"Cloud Run|Vertex|Google Agent Registry|Google Agent Runtime|Agent Engine|Google Cloud agent", re.I)


def _texts(spec: dict) -> list[str]:
    return [f"{x['title']} {x['sub']}" for x in spec["nodes"]]


def validate_diagram(spec: dict) -> list[str]:
    """Topology rules every rendered diagram must satisfy, independent of the scenario table."""
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
        if k == "invoke" and "registry" in (kind.get(a), kind.get(b)) and spec["id"] != "D8":
            errors.append(f"{spec['id']}: registry used as a runtime invocation hop ({a}->{b})")
        if k == "invoke" and b == "sap" and a in ("agent", "mcp", "portkey", "gw", "apigee", "custom"):
            errors.append(f"{spec['id']}: direct access to the SAP backend ({a}->{b})")
        if b in ("llm",) and a != "portkey" and k in ("llm", "invoke"):
            errors.append(f"{spec['id']}: LLM provider reached without Portkey ({a}->{b})")
    sid = spec.get("scenario")
    texts = " | ".join(_texts(spec))
    if sid in ("S1", "S3"):
        if re.search(r"AgentCore Runtime|AgentCore Gateway", texts) and not any(x["id"] == "s3b" for x in spec["nodes"]):
            errors.append(f"{spec['id']}: AgentCore component in an SAP-hosted scenario")
        for x in spec["nodes"]:
            if x["id"] != "s3b" and re.search(r"AgentCore", f"{x['title']} {x['sub']}"):
                errors.append(f"{spec['id']}: AgentCore named on {x['id']} in {sid}")
        if "AgentCore" in " ".join(x["title"] for x in spec["nodes"]):
            errors.append(f"{spec['id']}: AgentCore in a title")
    if sid == "S1" and "AWS" in texts:
        errors.append("D2: AWS component shown in S1")
    if sid == "S2":
        for need in ("AgentCore Runtime", "AgentCore Gateway", "AWS Agent Registry", "Apigee", "Portkey"):
            if need not in texts:
                errors.append(f"D3: missing {need}")
    if sid in ("S1", "S2", "S3") and "Portkey" not in texts:
        errors.append(f"{spec['id']}: Portkey missing")
    return errors


def validate(model: dict | None = None) -> list[str]:
    """Return every violation of the owner-approved evaluation baseline. Empty means the model is consistent."""
    s = (model or SCENARIOS)
    errors: list[str] = []
    if tuple(s) != SCENARIO_IDS:
        errors.append("exactly S1, S2 and S3 must be defined")
        return errors
    for sid, sc in s.items():
        if sc["llm_gateway"] != "Portkey":
            errors.append(f"{sid}: LLM gateway must be Portkey")
        if "Apigee" not in sc["mcp_gateway"]:
            errors.append(f"{sid}: Apigee must be the SAP-facing MCP gateway")
        for key, value in sc.items():
            if isinstance(value, str) and BAD_GOOGLE.search(value):
                errors.append(f"{sid}.{key}: Google hosting or registry platform mentioned")
        if "SAP backend" not in sc["backend_authorization"] and "SAP backend" not in sc["backend_authorization"].replace("Target SAP backend", "SAP backend"):
            errors.append(f"{sid}: SAP backend authorization missing")
        if not sc["persistence"].startswith("Conditional"):
            errors.append(f"{sid}: persistence must be conditional")
        if "conditional" not in sc["cloud_connector"].lower():
            errors.append(f"{sid}: Cloud Connector must be conditional")
        if not sc["unverified"]:
            errors.append(f"{sid}: unverified dependencies missing")
    a, b, c = s["S1"], s["S2"], s["S3"]
    if a["agent_runtime"] != "SAP BTP Cloud Foundry" or "Cloud Foundry" not in a["custom_mcp_runtime"]:
        errors.append("S1: agent and custom MCP runtime must be SAP BTP Cloud Foundry")
    if a["agentcore_runtime"] or a["agentcore_gateway"] or a["aws_agent_registry"]:
        errors.append("S1: no AWS AgentCore component may be used")
    if a["agent_registry"] != UNRESOLVED or a["mcp_registry"] != UNRESOLVED:
        errors.append("S1: registry must stay explicitly unresolved")
    if b["agent_runtime"] != "AWS AgentCore Runtime" or not b["agentcore_gateway"] or "AgentCore Runtime" not in b["custom_mcp_runtime"]:
        errors.append("S2: AgentCore Runtime and Gateway are required and host the custom MCP")
    if b["agent_registry"] != "AWS Agent Registry" or b["mcp_registry"] != "AWS Agent Registry":
        errors.append("S2: registries must be AWS Agent Registry")
    if c["agent_runtime"] != "SAP BTP Cloud Foundry" or "Cloud Foundry" not in c["custom_mcp_runtime"]:
        errors.append("S3: agent and custom MCP runtime must be SAP BTP Cloud Foundry")
    if c["agentcore_runtime"] or c["agentcore_gateway"]:
        errors.append("S3: AgentCore Runtime absent and AgentCore Gateway absent from the baseline")
    if c["agent_registry"] != "AWS Agent Registry" or c["mcp_registry"] != "AWS Agent Registry":
        errors.append("S3: registries must be AWS Agent Registry")
    if "Preferred candidate" not in c["status"]:
        errors.append("S3 must be labelled a preferred candidate subject to policy and POC")
    if re.search(r"production-ready|enterprise-approved", " ".join(map(str, c.values())), re.I):
        errors.append("S3 must not claim production readiness or approval")
    for name, spec in diagrams().items():
        errors += validate_diagram(spec)
    return errors


def export() -> dict:
    return {"version": MODEL_VERSION, "banner": STATUS_BANNER, "ids": list(SCENARIO_IDS), "scenarios": SCENARIOS, "comparison": COMPARISON, "connCols": CONN_COLS,
            "connections": CONNECTIONS, "diagrams": diagrams(), "diagramNames": DIAGRAM_NAMES, "recommendation": RECOMMENDATION, "evidence": EVIDENCE, "evidenceStatus": EVIDENCE_STATUS,
            "domains": DOMAINS, "unresolvedRegistry": UNRESOLVED}
