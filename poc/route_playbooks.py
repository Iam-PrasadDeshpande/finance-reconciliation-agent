"""Reviewable hosting contracts for the three Architecture V5.2 scenarios (S1 SAP-hosted hybrid, S2 AWS AgentCore-native, S3 AgentCore + Apigee hybrid).

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
        "title": 'S1 · SAP-hosted hybrid',
        "status": 'SAP-hosted alternative',
        "path": 'SAP Fiori / existing UI → Cloud Foundry agent → Apigee MCP → SAP Integration Suite → Cloud Connector (conditional) → SAP backend (registration in AWS Agent Registry, control plane only)',
        "hosting": 'SAP BTP Cloud Foundry hosts and executes the agent and any custom MCP code, behind Apigee, which is the SAP-facing MCP and runtime gateway. AWS Agent Registry holds registration metadata only. No AgentCore component runs anything. GitLab deploys the Cloud Foundry artifacts and publishes the registry records.',
        "steps": [
            step('Finance APIs → Apigee MCP endpoint', 'Expose approved read operations as MCP tools through Apigee (Pattern A). Add a custom MCP server on Cloud Foundry behind Apigee only where logic needs code (Pattern B).', 'Apigee MCP enablement and OpenAPI contract', 'One read tool listed and called through Apigee', 'SAP Integration'),
            step('Cloud Foundry agent → Apigee', 'Deploy the agent from GitLab to SAP BTP Cloud Foundry with an MCP client and a workload identity; give it the Apigee MCP URL.', 'Cloud Foundry space, quota and identity provider', 'Agent lists and calls one tool', 'SAP BTP platform team'),
            step('Agent → Portkey → LLM', 'Route every model call through Portkey; no direct provider route.', 'Portkey route and approved model', 'Model call visible in Portkey log', 'AI platform'),
            step('Apigee → Integration Suite → SAP', 'Map each tool to an approved API; add Cloud Connector only where the connectivity model needs it.', 'Integration Suite API and destination', 'SAP backend role check passes and a negative case is rejected', 'SAP Integration + SAP Security'),
            step('Registration → AWS Agent Registry', 'Publish the agent and Apigee endpoint records from the GitLab pipeline; the curator approves before discovery.', 'Registry access and cross-account sharing', 'Discovery works while execution stays on SAP BTP', 'Integration team + AI Foundry'),
        ],
        "decisions": [
            'Will SAP Integration and Security approve direct Apigee invocation from Cloud Foundry?',
            'What are the Cloud Foundry consumption and contractual charges for frequent agent workloads?',
            'Is custom orchestration supportable on Cloud Foundry?',
            'Can AWS Agent Registry hold records for SAP-hosted agents, published from GitLab?',
        ],
        "sources": ['apigee_setup', 'apigee_mcp', 'btp_cf', 'aws_registry', 'sap_identity'],
    },
    "S2": {
        "title": 'S2 · AWS AgentCore-native',
        "status": 'AWS-native alternative',
        "path": 'UI → AgentCore Runtime agent → AgentCore Gateway → AgentCore-hosted MCP server or API target → SAP Integration Suite → Cloud Connector (conditional) → SAP backend',
        "hosting": 'AgentCore Runtime hosts the agent and any eligible custom MCP server; AgentCore Gateway mediates the tools; AWS Agent Registry registers them. These are three separate capabilities. Apigee is optional and is inserted into the approved route only where SAP Integration and Security require it. GitLab deploys the runtime image, gateway targets and registry records.',
        "steps": [
            step('Agent → AgentCore Gateway', 'Deploy the agent from GitLab to AgentCore Runtime in the SAP-agent account; configure Gateway inbound authorization and per-agent tool authorization.', 'AgentCore access in the region and quota', 'Agent lists and calls a Gateway tool', 'AWS platform team'),
            step('Gateway → MCP or API target', 'Register a custom MCP on AgentCore Runtime as an MCP-server target, or an approved OpenAPI target that avoids a custom server; check schema, authentication and connectivity first.', 'Target schema and Integration Suite reachability', 'One read through the target to SAP', 'AWS platform team + SAP Integration'),
            step('Agent → Portkey → LLM', 'Route every model call through Portkey; no direct provider route.', 'Portkey route and approved model', 'Model call visible in Portkey log', 'AI platform'),
            step('Gateway → Integration Suite → SAP', 'Map each tool to an approved API; insert Apigee only where SAP Integration policy requires it; Cloud Connector only where needed.', 'Integration Suite API and destination', 'SAP backend role check passes and a negative case is rejected', 'SAP Integration + SAP Security'),
            step('Registration → AWS Agent Registry', 'Publish agent and MCP descriptors from the GitLab pipeline; the curator approves before discovery.', 'Registry access', 'Discovery returns approved records only', 'Integration team + AI Foundry'),
        ],
        "decisions": [
            'Does SAP Integration require Apigee for the route from AWS to Integration Suite, or can an exception be approved?',
            'Is the API/OpenAPI target valid (schema, authentication, connectivity)?',
            'Who owns the custom MCP lifecycle?',
            'Is user identity carried across AWS and SAP?',
        ],
        "sources": ['aws_gateway', 'aws_registry', 'aws_mcp', 'sap_identity'],
    },
    "S3": {
        "title": 'S3 · AgentCore + Apigee hybrid',
        "status": 'Preferred candidate for a comparative POC · conditional',
        "path": 'UI → AgentCore Runtime agent → AgentCore Gateway → Apigee MCP → SAP Integration Suite → Cloud Connector (conditional) → SAP backend (registration in AWS Agent Registry on a separate path)',
        "hosting": 'AgentCore Runtime in a proposed dedicated SAP-agent AWS account executes the agent; AgentCore Gateway is the enterprise runtime gateway; Apigee stays the SAP-facing MCP/API gateway; AWS Agent Registry registers the agent and the Apigee endpoint on a separate control-plane path. Final selection is conditional on account approval, identity validation, gateway interoperability, enterprise policy and measured comparative cost. GitLab deploys the runtime, gateway targets, Apigee bundles and registry records.',
        "steps": [
            step('Account and runtime', 'Obtain the dedicated SAP-agent AWS account; deploy the agent from GitLab to AgentCore Runtime.', 'Account approval, AgentCore entitlements and region', 'Agent runs in the account', 'AWS platform team + AI Foundry'),
            step('AgentCore Gateway → Apigee', 'Register the Apigee MCP endpoint as a Gateway MCP-server target; choose the outbound credential (client credentials first, token exchange for user delegation).', 'Protocol compatibility, token exchange, reachability, tool naming', 'One tools/list and one tools/call through both gateways', 'AI Foundry + SAP Integration'),
            step('Agent → Portkey → LLM', 'Route every model call through Portkey; no direct provider route.', 'Portkey route and approved model', 'Model call visible in Portkey log', 'AI platform'),
            step('Apigee → Integration Suite → SAP', 'Map each tool to an approved API; Cloud Connector only where needed.', 'Integration Suite API and destination', 'SAP backend role check passes; an unauthorized user is rejected', 'SAP Integration + SAP Security'),
            step('Registration → AWS Agent Registry', 'Publish the AgentCore agent record and the Apigee endpoint metadata from the GitLab pipeline; keep gateway target configuration separate.', 'Cross-account sharing from the central registry', 'Registration works without any registry hop on the call path', 'Integration team + AI Foundry'),
        ],
        "decisions": [
            'Is the dedicated AWS account approved with AgentCore services?',
            'Does the AgentCore Gateway to Apigee call work with delegated identity?',
            'Who owns each gateway control so that policy is not duplicated?',
            'Is the comparative cost competitive for the workload?',
        ],
        "sources": ['aws_gateway', 'aws_registry', 'aws_registry_sync', 'apigee_mcp', 'sap_identity'],
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
        "Agree deny precedence and a single cross-gateway correlation ID where two gateways are in series (S3).",
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
