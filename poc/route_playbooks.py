"""Reviewable hosting contracts for the three Architecture V5.1 scenarios (S1 SAP-centric, S2 AWS AgentCore-centric, S3 SAP-hosted hybrid).

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
    "btp_python": "https://help.sap.com/docs/btp/sap-business-technology-platform/developing-python-in-cloud-foundry-environment",
    "btp_kyma": "https://help.sap.com/docs/btp/sap-business-technology-platform/606ec610ee4746c09d5d2bef5a85a124.html",
    "btp_cf": "https://help.sap.com/docs/cf-runtime/cloud-foundry-runtime/what-is-sap-btp-cloud-foundry-runtime",
    "aws_gateway": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway-core-concepts.html",
    "aws_registry": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry.html",
    "aws_registry_sync": "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/registry-sync-records.html",
}


def step(handoff, configure, dependency, proof, owner):
    return {"handoff": handoff, "configure": configure, "dependency": dependency,
            "proof": proof, "owner": owner}


PLAYBOOKS = {
    "S1": {
        "title": "S1 · SAP-centric",
        "status": "Evaluation candidate · interim GitLab catalog as registry",
        "path": "SAP Fiori / existing UI → Cloud Foundry agent → Apigee MCP/API → SAP Integration Suite → Cloud Connector (conditional) → SAP backend",
        "hosting": "SAP owns agent execution on SAP BTP Cloud Foundry and any custom MCP code behind Apigee. Apigee is the SAP-facing MCP/API gateway. The registry is an interim catalog on GitLab, selected by the owner because SAP AI Agent Hub is not available; it is not a complete agent registry. No AWS component takes part.",
        "steps": [
            step("Finance APIs → Apigee MCP endpoint", "Expose approved read operations as MCP tools through Apigee (Pattern A). Add a custom MCP server on Cloud Foundry behind Apigee only where logic needs code (Pattern B).", "Apigee MCP enablement and OpenAPI contract", "One read tool listed and called through Apigee", "SAP Integration"),
            step("Cloud Foundry agent → Apigee", "Deploy the agent on SAP BTP Cloud Foundry with an MCP client and a workload identity; give it the Apigee MCP URL.", "Cloud Foundry space and identity provider", "Agent lists and calls one tool", "SAP BTP platform team"),
            step("Agent → Portkey → LLM", "Route every model call through Portkey; no direct provider route.", "Portkey route and approved model", "Model call visible in Portkey log", "AI platform"),
            step("Apigee → Integration Suite → SAP", "Map each tool to an approved API; add Cloud Connector only where the connectivity model needs it.", "Integration Suite API and destination", "SAP backend role check passes and a negative case is rejected", "SAP Integration + SAP Security"),
            step("Registration", "Add a record for the agent and for the Apigee MCP endpoint to the GitLab catalog through a merge request; the pipeline validates the schema and publishes an index.", "GitLab project, record schema and discovery interface (to be built)", "Discovery from another client through the index, then revocation removes the record", "Integration team"),
        ],
        "decisions": [
            "Is the interim GitLab catalog enough, or will a registry product follow?",
            "Which record schema, discovery interface and revocation process does the catalog need?",
            "Will Apigee receive delegated user identity or a scoped service identity, and how will SAP authorize it?",
            "Is persistence needed, or does an existing store suffice (HANA Cloud is conditional)?",
        ],
        "sources": ["apigee_setup", "apigee_mcp", "btp_cf", "sap_identity"],
    },
    "S2": {
        "title": "S2 · AWS AgentCore-centric",
        "status": "Evaluation candidate · gateway-to-Apigee protocol unproven",
        "path": "UI → AgentCore Runtime agent → AgentCore Gateway → Apigee MCP/API → SAP Integration Suite → Cloud Connector (conditional) → SAP backend",
        "hosting": "AWS owns agent execution on AgentCore Runtime, any custom MCP code, the runtime gateway (AgentCore Gateway) and enterprise registration (AWS Agent Registry). AgentCore Runtime, Gateway and Registry are three separate capabilities. Apigee remains the SAP-facing MCP/API gateway behind AgentCore Gateway.",
        "steps": [
            step("Agent → AgentCore Gateway", "Host the agent on AgentCore Runtime; configure Gateway inbound authorization and per-agent tool authorization.", "AgentCore access in the region", "Agent lists and calls a Gateway tool", "AWS cloud platform team"),
            step("AgentCore Gateway → Apigee", "Register the Apigee MCP endpoint as a Gateway MCP-server target; choose the outbound credential provider. If a custom MCP runs on AgentCore Runtime and is proxied by Apigee, draw and test that cross-cloud path.", "Protocol compatibility and token exchange", "One end-to-end read through both gateways", "Platform + SAP Integration"),
            step("Agent → Portkey → LLM", "Route every model call through Portkey; no direct provider route.", "Portkey route and approved model", "Model call visible in Portkey log", "AI platform"),
            step("Apigee → Integration Suite → SAP", "Map each tool to an approved API; Cloud Connector only where needed.", "Integration Suite API and destination", "SAP backend role check passes and a negative case is rejected", "SAP Integration + SAP Security"),
            step("Registration", "Create agent and MCP descriptors in AWS Agent Registry; approve before discovery.", "Registry access and namespace", "Discovery returns approved records only", "AI Foundry"),
        ],
        "decisions": [
            "Which gateway enforces tool allowlists, and how is duplicated policy avoided?",
            "Does the outbound credential or token exchange carry a user, or a service identity?",
            "Is a custom MCP on AgentCore Runtime needed, given the cross-cloud hop through Apigee?",
        ],
        "sources": ["aws_gateway", "aws_registry", "aws_mcp", "apigee_mcp", "sap_identity"],
    },
    "S3": {
        "title": "S3 · SAP-hosted hybrid",
        "status": "Preferred candidate · subject to AI Foundry policy and POC validation",
        "path": "SAP Fiori / existing UI → Cloud Foundry agent → Apigee MCP/API → SAP Integration Suite → Cloud Connector (conditional) → SAP backend (registration in AWS Agent Registry, control plane only)",
        "hosting": "SAP retains execution ownership: the agent and any custom MCP code run on SAP BTP Cloud Foundry behind Apigee. AI Foundry manages central discovery and registration in AWS Agent Registry. The registry is not an execution hop, and neither AgentCore Runtime nor AgentCore Gateway is in the baseline. If AI Foundry mandates AgentCore Gateway for all tool calls, that is the policy-dependent variant S3-B.",
        "steps": [
            step("Finance APIs → Apigee MCP endpoint", "Expose approved read operations as MCP tools through Apigee (Pattern A); custom MCP on Cloud Foundry only if needed (Pattern B).", "Apigee MCP enablement and OpenAPI contract", "One read tool listed and called through Apigee", "SAP Integration"),
            step("Cloud Foundry agent → Apigee", "Deploy the agent on SAP BTP Cloud Foundry; MCP client calls Apigee directly.", "Cloud Foundry space and identity provider", "Agent lists and calls one tool", "SAP BTP platform team"),
            step("Agent → Portkey → LLM", "Route every model call through Portkey; no direct provider route.", "Portkey route and approved model", "Model call visible in Portkey log", "AI platform"),
            step("Apigee → Integration Suite → SAP", "Map each tool to an approved API; Cloud Connector only where needed.", "Integration Suite API and destination", "SAP backend role check passes and a negative case is rejected", "SAP Integration + SAP Security"),
            step("Registration → AWS Agent Registry", "Register the SAP-hosted agent and the Apigee MCP endpoint metadata; approve before discovery. Confirm no AWS execution hop appears in any trace.", "Registry access and synchronization method", "Discovery works while execution stays SAP-hosted", "AI Foundry"),
        ],
        "decisions": [
            "Will AI Foundry confirm in writing that AgentCore Gateway is not mandatory for S3 (the owner states it is not)?",
            "Can AWS Agent Registry hold records for agents and MCP servers hosted outside AWS in this tenant?",
            "Are records published from the GitLab release pipeline (AWS never calls into SAP), and how are stale records retired?",
            "Is persistence needed, or does an existing store suffice (HANA Cloud is conditional)?",
        ],
        "sources": ["aws_registry", "aws_registry_sync", "apigee_mcp", "btp_cf", "sap_identity"],
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
        "Agree deny precedence and a single cross-gateway correlation ID where two gateways are in series (S2).",
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
        "Define registry synchronization from external sources and version mismatch handling; registration is never proof of reachability.",
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
