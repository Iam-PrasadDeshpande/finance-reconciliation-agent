"""Reviewable hosting contracts for the three synthetic gateway scenarios.

These are candidate implementation plans, not deployed topology or approvals.
Only public vendor documentation is linked. No tenant endpoints or secrets live here.
"""

SOURCES = {
    "aws_mcp": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-MCPservers.html",
    "aws_runtime": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-target-http-runtime.html",
    "aws_target": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-add-target-api-target-config.html",
    "aws_openapi": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-schema-openapi.html",
    "apigee_mcp": "https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-overview",
    "apigee_setup": "https://docs.cloud.google.com/apigee/docs/api-platform/apigee-mcp/apigee-mcp-quickstart",
    "sap_identity": "https://help.sap.com/doc/fc5a7d8c89db4a448903df7d526b36f4/Cloud/en-US/668ddc52b4c54429a3abb37be25b57df.pdf",
}


def step(handoff, configure, dependency, proof, owner):
    return {"handoff": handoff, "configure": configure, "dependency": dependency,
            "proof": proof, "owner": owner}


PLAYBOOKS = {
    "S1": {
        "title": "S1 · SAP Apigee is the agent-facing MCP boundary",
        "status": "Simulated alternative · hosting approval open",
        "path": "External agent on AgentCore Runtime → SAP Apigee MCP endpoint → SAP Integration Suite → SAP backend",
        "hosting": "SAP Integration owns an Apigee environment, externally reachable MCP hostname and Discovery Proxy. AgentCore Runtime is the MCP client; AgentCore Gateway is not in this route.",
        "steps": [
            step("Finance tool contract → Apigee", "Define read-only reconciliation operations in an OpenAPI 3.0.x contract; deploy the SAP API proxy and MCP Discovery Proxy. Align servers.url with the Apigee environment-group hostname.", "Apigee entitlement/environment, API hub where required, SAP Integration Suite API contract and agreed tool names.", "MCP initialize, tools/list and a typed read tools/call succeed against a nonproduction target.", "SAP Integration"),
            step("AgentCore Runtime → Apigee MCP", "Give the agent the approved Apigee MCP URL and client identity. Configure Apigee OAuth/OIDC validation, client allowlist and tool-level authorization.", "Approved network egress, DNS/TLS trust, issuer/audience/scopes and a credential lifecycle owner.", "Apigee accepts the allowed client and denies an unapproved client or write tool.", "AI Foundry runtime + SAP Integration + Security"),
            step("Apigee → Integration Suite", "Map each MCP tool to one SAP-facing API or iFlow; validate typed arguments, source system, period and operation scope.", "Published Integration Suite endpoint, destination credential model, rate limits and error contract.", "Correlated request and response show exact mapping; malformed inputs fail before SAP.", "SAP Integration"),
            step("Integration Suite → SAP backend", "Select direct cloud API or conditional Cloud Connector route; map delegated or approved service identity to the target backend.", "Connectivity trust, backend API enablement, SAP roles and finance data authorization.", "A named nonproduction principal is authorized for read and denied for out-of-scope company/operation.", "SAP Connectivity + SAP Security + FI"),
            step("SAP result → agent", "Return source timestamp, currency, ledger, totals and evidence reference; retain correlation IDs across Apigee, iFlow and SAP logs.", "Source freshness rule, retention policy and audit ownership.", "Reconciliation ties to source documents; failure and retry evidence is correlated end to end.", "FI + Enterprise Architecture"),
        ],
        "decisions": [
            "Does AI Foundry permit an external agent to call SAP-owned Apigee directly?",
            "Who owns agent-facing discovery, authorization and incident response when AgentCore Gateway is absent?",
            "Will Apigee receive delegated user identity or a scoped service identity, and how will SAP authorize it?",
        ],
        "sources": ["apigee_setup", "apigee_mcp", "sap_identity"],
    },
    "S2": {
        "title": "S2 · AgentCore-hosted SAP finance MCP adapter",
        "status": "Simulated alternative · AWS hosting and SAP target contract open",
        "path": "External agent on AgentCore Runtime → AgentCore Gateway → SAP finance MCP adapter on AgentCore Runtime → SAP Integration Suite → SAP backend",
        "hosting": "AI Foundry would operate the Gateway and an AgentCore Runtime-hosted MCP adapter. SAP Integration would own the finance tool/API contract and SAP-facing integration. This is a candidate hosting model, not a deployed MCP server or approved replacement for Apigee.",
        "steps": [
            step("SAP tool contract → hosted MCP adapter", "Define versioned, read-only finance tools and deploy an MCP adapter on AgentCore Runtime. Decide whether Gateway aggregates it as an MCP-server target or passes through to it as a Runtime target; the latter does not provide unified tool listing or synchronization.", "AWS runtime hosting approval, SAP API/iFlow contract, MCP protocol/schema compatibility, domain tool owner and operational support.", "Nonproduction MCP initialize, tools/list and read tools/call work; unknown and write tools fail. Confirm the chosen target mode behaves as intended.", "AI Foundry + SAP Integration"),
            step("AgentCore Runtime → AgentCore Gateway", "Configure Gateway inbound authentication and per-agent tool authorization; bind only approved workload or user identities.", "Agent identity, issuer/audience or IAM policy, Gateway service role and Region.", "Approved agent invokes a read; an unapproved identity or tool is denied and audited.", "AI Foundry runtime + Security"),
            step("Gateway → hosted MCP adapter", "Register the Runtime-hosted MCP endpoint with a supported Gateway target type. Configure target identity, egress, TLS, tool listing/synchronization when aggregation is selected, and block direct adapter access if policy requires Gateway-only entry.", "Runtime endpoint, Gateway target contract, same-account/region constraints where applicable, approved outbound credential and service ownership.", "Target becomes ready; Gateway-to-adapter MCP request succeeds; direct bypass and bad credentials are denied.", "AI Foundry + AWS platform + Security"),
            step("MCP adapter → Integration Suite → SAP", "Map each finance tool to an approved SAP API/iFlow and destination. Select delegated token exchange or scoped service identity and enforce the final SAP role and company/ledger authorization.", "Reachable Integration Suite endpoint, direct or conditional Cloud Connector route, identity trust at each hop, SAP API and finance roles.", "Correlate an allowed read to SAP source evidence; unauthorized company and write calls fail at the backend.", "SAP Integration + SAP Security + FI"),
            step("SAP evidence → agent", "Return typed source timestamp, totals, currency and correlation ID through the adapter and Gateway; define retry and outage ownership.", "Finance freshness rules, evidence retention, cross-platform logs and incident owner.", "One nonproduction trace links the tool call to source documents and a reproducible reconciliation result.", "FI + Enterprise Architecture"),
        ],
        "decisions": [
            "May AI Foundry host SAP's domain MCP adapter on AgentCore Runtime while SAP retains the tool contract?",
            "Will Gateway use MCP aggregation or Runtime passthrough, and who owns discovery/version synchronization?",
            "Which outbound identity reaches SAP, and who enforces each tool and backend authorization boundary?",
        ],
        "sources": ["aws_mcp", "aws_runtime", "sap_identity"],
    },
    "S3": {
        "title": "S3 · AgentCore Gateway fronts SAP Apigee MCP",
        "status": "Unapproved combined candidate",
        "path": "External agent on AgentCore Runtime → AgentCore Gateway → SAP Apigee MCP endpoint → SAP Integration Suite → SAP backend",
        "hosting": "SAP Integration retains an Apigee-hosted MCP endpoint; AI Foundry creates an AgentCore Gateway MCP-server target pointing at that endpoint. The URL in the target is Apigee's externally reachable MCP hostname and path, not its internal managed target.",
        "steps": [
            step("SAP finance APIs → Apigee MCP", "Publish versioned OpenAPI 3.0.x finance-read operations; deploy Apigee MCP Discovery Proxy on the approved environment-group hostname and protect tools/list and tools/call.", "SAP API/iFlow contract, Apigee MCP-capable environment, hostname/TLS, API hub and domain owner.", "Direct nonproduction MCP initialize, tools/list and read tools/call work; write and unknown tools are denied.", "SAP Integration"),
            step("Apigee MCP → AgentCore target", "Create an AgentCore Gateway MCP-server target with the encoded Apigee HTTPS MCP endpoint; choose an outbound credential provider such as OAuth. Configure target egress and trust.", "AI Foundry approval for domain-owned hosting; reachable DNS/network path; compatible MCP protocol; Apigee issuer, audience and scopes.", "GetGatewayTarget reports READY; an AgentCore-to-Apigee MCP handshake and tools/list succeed.", "AI Foundry runtime + SAP Integration + Network"),
            step("Tool catalog → Gateway discovery", "Choose DEFAULT listing with synchronization after Apigee tool changes, or DYNAMIC listing if the selected user-token model cannot support background discovery.", "Registry owner/version approval, MCP tool schema stability, listing mode and credential model.", "Add/change/retire a tool in Apigee and prove Gateway catalog refresh or invocation-time discovery.", "AI Foundry governance + SAP Integration"),
            step("Agent → Gateway → Apigee", "Configure Gateway inbound agent authorization and outbound Apigee OAuth separately; agree which gateway enforces tool allowlists, payload limits and audit.", "Agent identity, target credential, signed control matrix, deny precedence and shared correlation ID.", "Allowed read succeeds; unapproved partner, tool, expired token and duplicate controls produce agreed deny/audit results.", "Enterprise Architecture + Security + both gateway owners"),
            step("Apigee → Integration Suite → SAP", "Map MCP tool to SAP API/iFlow; select delegated token exchange or approved service identity; configure direct or conditional Cloud Connector path and backend roles.", "Identity trust at each hop, SAP destination configuration, Cloud Connector only if needed, FI authorization.", "Trace the same principal or approved service identity to S/4HANA, Central Finance and BW/4HANA role checks.", "SAP Integration + SAP Security + FI"),
            step("SAP evidence → both gateways → agent", "Return typed source evidence and correlate Apigee, Gateway, iFlow and SAP logs; define retry, timeout, retention and incident ownership.", "Cross-platform trace fields, observability access and finance source freshness agreement.", "One nonproduction case proves request, denial, source response and final reconciliation across both gateways.", "Enterprise Architecture + FI + operations"),
        ],
        "decisions": [
            "Is SAP-owned Apigee MCP hosting an approved Gateway target, and who operates each layer?",
            "Does OAuth client credentials suffice for read, or is on-behalf-of token exchange required for SAP user authorization?",
            "Which layer owns discovery, authorization, credential rotation, policy precedence and audit without duplicate control?",
            "Which listing mode and synchronization process keep Gateway tools aligned with Apigee?",
        ],
        "sources": ["aws_mcp", "aws_target", "apigee_setup", "apigee_mcp", "sap_identity"],
    },
}


QUESTION_DEPENDENCIES = {
    "sap_mcp_hosting": [
        "SAP Integration confirms Apigee product, environment, hostname and MCP Discovery Proxy ownership.",
        "AI Foundry confirms policy for domain-owned external MCP targets and target onboarding.",
        "Network and Security agree egress, DNS/TLS, OAuth audience and tool allowlist.",
    ],
    "gateway_ownership": [
        "Name one owner per inbound auth, outbound credential, tool discovery, payload policy, rate limit, audit and incident action.",
        "Agree deny precedence and a single cross-gateway correlation ID for S3.",
        "Test policy overlap and outage ownership before any production routing.",
    ],
    "sap_identity": [
        "Choose delegated user or scoped service identity per tool; document issuer, audience and exchange at each boundary.",
        "Map the chosen principal through Integration Suite and conditional Cloud Connector to each SAP target.",
        "Prove final backend role checks and company/ledger restrictions, including denial cases.",
    ],
    "read_vs_post": [
        "Publish separate read and write tool contracts and scopes; no generic SAP posting tool.",
        "Require independent human approval, signed callback and replay protection for any write.",
        "Prove a balanced nonproduction FI document and rejection/tamper/duplicate cases before real posting is considered.",
    ],
    "foundry_registry": [
        "Assign tool owner, approved version, schema and retirement process in the registry.",
        "Map registry approval to Gateway target binding; registration alone grants no access.",
        "Define Apigee-to-Gateway catalog synchronization and version mismatch handling.",
    ],
    "external_agent": [
        "Approve partner workload/user identity, repository policy, network path and bounded tool allowlist.",
        "Constrain partner access at Gateway or Apigee and again at the SAP backend.",
        "Capture one end-to-end positive trace and negative traces for unapproved partner and tool.",
    ],
}


def route_playbook_catalog() -> dict:
    return {key: {**item, "sources": [
        {"label": source.replace("_", " ").title(), "url": SOURCES[source]}
        for source in item["sources"]
    ]} for key, item in PLAYBOOKS.items()}
