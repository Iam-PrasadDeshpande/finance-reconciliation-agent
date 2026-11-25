"""Company-neutral architecture decision scenarios for the synthetic demo.

The trace evaluates typed probes in Python and persists timed progress to the
existing SQLite state store. It is a simulator, not a vendor or SAP call.
"""
from __future__ import annotations

import time
import uuid

from .store import Denied, Store
from .route_playbooks import QUESTION_DEPENDENCIES


QUESTIONS = [
    {
        "id": "sap_mcp_hosting",
        "scenario_position": {"S1": "The MCP endpoint is Apigee-managed (Pattern A) and any custom MCP runs on SAP BTP Cloud Foundry behind it. SAP owns both; the endpoint is recorded in the interim GitLab catalog.", "S2": "Apigee exposes the SAP tools behind AgentCore Gateway. A custom MCP on AgentCore Runtime would be reached through Apigee as a cross-cloud target. Gateway-to-Apigee protocol and target type are unproven.", "S3": "Same SAP-side hosting as S1 (Apigee, custom MCP on Cloud Foundry). The endpoint metadata is registered in AWS Agent Registry; registration does not move hosting."},
        "title": "Can SAP retain Apigee as its domain MCP layer?",
        "summary": "Test a domain-owned MCP target behind the agent runtime.",
        "current_position": "Existing MCP targets are technically possible; SAP ownership and Apigee hosting approval remain open.",
        "decision": "May SAP own and host this MCP capability through Apigee, and what onboarding contract applies?",
        "owner": "AI Foundry + SAP Solution Architecture + Integration",
        "next_action": "Confirm SAP-owned Apigee MCP hosting policy and document the Apigee MCP endpoint onboarding contract (and the AgentCore Gateway target in S2).",
        "default_route": "S3", "probes": [
            {"id": "onboarded", "label": "Target onboarded (candidate)"},
            {"id": "missing_target", "label": "Target absent / denied"},
        ], "gates": ["Domain hosting policy", "MCP target registration and synchronization", "SAP target ownership and support"],
    },
    {
        "id": "gateway_ownership",
        "scenario_position": {"S1": "One gateway, Apigee, owns inbound authorization, credentials, routing and audit. There is no second policy point.", "S2": "Two gateways in series: AgentCore Gateway (enterprise entry) then Apigee (SAP-facing). Each control needs one named owner and a deny-precedence rule to avoid duplicated policy.", "S3": "One gateway, Apigee, as in S1. AgentCore Gateway is absent from the baseline; if AI Foundry mandates it for all tool calls that is variant S3-B."},
        "title": "Which gateway owns each control?",
        "summary": "Show gateway, registry and Apigee responsibilities per scenario.",
        "current_position": "Apigee is the SAP-facing gateway in every scenario; AgentCore Gateway fronts it only in S2; a registry is control plane only. The control split needs agreement.",
        "decision": "Assign one accountable owner for discovery, authorization, credentials, routing and audit at each boundary.",
        "owner": "Enterprise Architecture + AI Foundry + Apigee + Security",
        "next_action": "Sign off a control matrix for both gateways, including policy precedence and cross-gateway audit correlation.",
        "default_route": "S3", "probes": [
            {"id": "split_controls", "label": "Distinct controls"},
            {"id": "duplicate_controls", "label": "Overlapping controls flagged"},
        ], "gates": ["Gateway control matrix", "Audit and correlation ownership", "No conflicting tool policy"],
    },
    {
        "id": "sap_identity",
        "scenario_position": {"S1": "Cloud Foundry agent identity to Apigee, then Integration Suite identity to the SAP backend. One gateway hop to prove.", "S2": "Agent identity to AgentCore Gateway, outbound credential to Apigee, then Integration Suite to SAP: two token hops to prove.", "S3": "As S1, plus a separate control-plane identity for registry access that must never carry business authorization."},
        "title": "Does the caller identity reach SAP?",
        "summary": "Trace a redacted principal reference across every trust boundary.",
        "current_position": "Gateway authentication does not establish delegated SAP principal propagation or backend authorization.",
        "decision": "Approve delegated-user propagation or an explicitly scoped service-identity alternative.",
        "owner": "Enterprise IdP + agent platform identity + Integration + SAP Security",
        "next_action": "Trace a real tenant principal through every hop and prove the selected identity model in each SAP backend role check.",
        "default_route": "S3", "probes": [
            {"id": "delegated", "label": "Delegated user candidate"},
            {"id": "service", "label": "Service identity candidate"},
            {"id": "missing_principal", "label": "Missing SAP principal / denied"},
        ], "gates": ["Token exchange and audience at every hop", "Integration Suite and conditional Cloud Connector mapping", "Backend role authorization in each SAP system"],
    },
    {
        "id": "read_vs_post",
        "scenario_position": {"S1": "Read tools only. Posting would be a separately governed capability behind Apigee on Cloud Foundry; none is active.", "S2": "Read tools only. Posting would be a separately governed capability reachable through both gateways; none is active.", "S3": "Read tools only. Registration of a posting tool would not authorize it; none is active."},
        "title": "Can the agent read but not post?",
        "summary": "Compare finance read access with approval-gated write intent.",
        "current_position": "Read and write require separate controls; a synthetic marker is not an SAP FI posting.",
        "decision": "Separate read scope, posting scope and accountable human approval; define the real SAP posting contract.",
        "owner": "FI Architecture + SAP Security + AI Foundry",
        "next_action": "Approve separate read and write tool scopes, then prove human approval and a nonproduction SAP posting contract.",
        "default_route": "S3", "probes": [
            {"id": "read", "label": "Reconciliation read"},
            {"id": "post_no_approval", "label": "Post without approval / denied"},
            {"id": "post_with_approval", "label": "Approved synthetic marker only"},
        ], "gates": ["Distinct read and write tool bindings", "Independent approval and replay protection", "Nonproduction SAP posting evidence before any real write"],
    },
    {
        "id": "foundry_registry",
        "scenario_position": {"S1": "An interim catalog on GitLab (SAP AI Agent Hub is not available). The integration team approves records through merge requests; revocation removes the record. It is not a full agent registry.", "S2": "AWS Agent Registry catalogues the AgentCore-hosted agent and the MCP descriptor; approved records only are discoverable.", "S3": "AWS Agent Registry holds metadata for the SAP-hosted agent and the Apigee endpoint, published from the GitLab pipeline. Synchronization from the URL would need AWS to reach it; that is not yet checked. Control plane only."},
        "title": "What does the Foundry registry govern?",
        "summary": "Separate design-time registration from runtime tool invocation.",
        "current_position": "Registration governs lifecycle and discovery; it grants no direct SAP access by itself.",
        "decision": "Publish domain tool ownership, version, approval, lifecycle and synchronization requirements.",
        "owner": "AI Foundry Governance + Domain Tool Owner",
        "next_action": "Publish registry onboarding, versioning, synchronization and retirement rules for domain-owned tools.",
        "default_route": "S3", "probes": [
            {"id": "registered", "label": "Registered tool candidate"},
            {"id": "unregistered", "label": "Unregistered tool / denied"},
        ], "gates": ["Registry lifecycle policy", "Gateway target discovery contract", "Version and retirement behavior"],
    },
    {
        "id": "external_agent",
        "scenario_position": {"S1": "A partner agent would call Apigee directly; Apigee product and app controls limit its tools.", "S2": "A partner agent would enter through AgentCore Gateway, then Apigee; both gateways constrain its tools.", "S3": "A partner agent would call Apigee directly; discovery of its record in AWS Agent Registry is separate from its authorization."},
        "title": "Can an external agent use SAP tools?",
        "summary": "Demonstrate partner onboarding, scoped entry and backend authorization.",
        "current_position": "External agents need explicit identity, tool, repository and SAP authorization decisions.",
        "decision": "Set partner POC entry criteria and an approved external-agent access path.",
        "owner": "Enterprise Architecture + AI Foundry + SAP + Security",
        "next_action": "Approve partner identity, tool allowlist, repository policy and SAP role proof for a bounded external-agent POC.",
        "default_route": "S3", "probes": [
            {"id": "approved_partner", "label": "Approved partner candidate"},
            {"id": "unapproved_partner", "label": "Unapproved partner / denied"},
        ], "gates": ["Partner identity and tool allowlist", "No blanket public-repository approval", "End-to-end audit and SAP role proof"],
    },
]

ROUTES = {
    "S1": {"label": "S1 · SAP-centric", "status": "Evaluation candidate", "gateways": ["apigee_mcp"], "agent": "sap_btp", "registry": "domain"},
    "S2": {"label": "S2 · AWS AgentCore-centric", "status": "Evaluation candidate", "gateways": ["agentcore_gateway", "apigee_mcp"], "agent": "agentcore", "registry": "aws"},
    "S3": {"label": "S3 · SAP-hosted hybrid", "status": "Preferred candidate, subject to AI Foundry policy and POC validation", "gateways": ["apigee_mcp"], "agent": "sap_btp", "registry": "aws"},
}

CONTROL_MATRIX = [
    {"component": "Agent and MCP registry", "owner": "AI Foundry (S2, S3) or the integration team (S1, GitLab catalog)", "responsibility": "Registration, discovery, approval, version and lifecycle. Control plane only: registration is not an invocation hop and grants no SAP access."},
    {"component": "AgentCore Gateway (S2 only)", "owner": "AI Foundry runtime", "responsibility": "Enterprise MCP gateway: inbound authorization, outbound credential and invocation audit toward Apigee."},
    {"component": "Google Apigee MCP/API", "owner": "SAP Integration", "responsibility": "SAP-facing MCP/API gateway in every scenario: tool mapping, policy, routing and SAP-facing audit."},
    {"component": "Portkey", "owner": "AI platform", "responsibility": "LLM gateway in every scenario: model selection, credentials, fallback and monitoring. Independent of the MCP gateway."},
    {"component": "SAP Integration Suite", "owner": "SAP Integration", "responsibility": "SAP integration boundary: approved API, identity mapping and conditional Cloud Connector route."},
    {"component": "SAP backend", "owner": "SAP Security + FI", "responsibility": "Final user or service authorization and finance operation control."},
]


def question_catalog() -> list[dict]:
    return [{**item, "dependencies": QUESTION_DEPENDENCIES[item["id"]]} for item in QUESTIONS]


def build_run(question_id: str, route: str, probe: str) -> dict:
    question = next((item for item in QUESTIONS if item["id"] == question_id), None)
    if not question or route not in ROUTES or probe not in {item["id"] for item in question["probes"]}:
        raise Denied("Unknown architecture question, route or probe")
    run_id = "arch-" + uuid.uuid4().hex[:12]
    steps = []
    prior = "Business question"

    def add(component, owner, control, output, *, status="passed", identity="redacted synthetic reference", proof="Tenant proof required", phase="runtime"):
        nonlocal prior
        index = len(steps) + 1
        steps.append({"seq": index, "component": component, "owner": owner, "phase": phase,
                      "input": "Tool registration request (design-time)" if phase == "design-time" else prior,
                      "output": output, "control": control, "identity": identity,
                      "status": status, "proof_gap": proof, "evidence_id": f"SYN-ARCH-{run_id}-{index:02d}"})
        if phase != "design-time":
            prior = output

    add("Business intent", "Finance architect", "Typed use-case scope", question["title"], proof="Finance use-case signoff")
    registered = probe != "unregistered"
    registry_name = {"domain": "GitLab catalog (interim)", "aws": "AWS Agent Registry"}[ROUTES[route]["registry"]]
    add(registry_name, "AI Foundry governance" if ROUTES[route]["registry"] == "aws" else "Domain team", "Owner, approval, version and tool binding",
        "Registered synthetic tool reference" if registered else "Tool not registered; runtime invocation blocked",
        status="passed" if registered else "denied", phase="design-time",
        proof="Published domain-owned hosting and onboarding policy")
    if registered:
        add("Enterprise identity provider", "Enterprise identity", "Caller authentication and group claim",
            "Pseudonymous caller reference issued", proof="Real tenant issuer, audience and group mapping")
        if ROUTES[route]["agent"] == "agentcore":
            add("AgentCore Runtime + Identity", "AI Foundry runtime", "Agent workload identity and scoped tool request",
                "Synthetic runtime invokes the selected gateway", proof="Deployed runtime and identity policy")
        else:
            add("SAP BTP Cloud Foundry agent", "SAP BTP platform team", "Agent workload identity and scoped tool request",
                "Synthetic agent invokes the Apigee MCP endpoint", proof="Deployed Cloud Foundry application and identity policy")
        if question_id == "read_vs_post" and probe in ("post_no_approval", "post_with_approval"):
            approved = probe == "post_with_approval"
            add("Finance approval boundary", "FI control owner", "Separate human approval for write intent",
                "Synthetic marker proposal permitted; no SAP posting" if approved else "Write denied before SAP tool invocation",
                status="passed" if approved else "denied", proof="Independent approver, callback integrity and nonproduction SAP posting proof")
        if not steps[-1]["status"] == "denied":
            for gateway in ROUTES[route]["gateways"]:
                is_aws = gateway == "agentcore_gateway"
                name = "AgentCore Gateway" if is_aws else "SAP Apigee MCP"
                owner = "AI Foundry runtime" if is_aws else "SAP Integration"
                control = ("Agent-facing target, inbound policy and outbound credential" if is_aws
                           else "SAP domain MCP policy, tool mapping and audit")
                denied = ((probe == "missing_target" and (gateway == ROUTES[route]["gateways"][0])) or
                          (probe == "unapproved_partner" and (gateway == ROUTES[route]["gateways"][0])))
                overlap = probe == "duplicate_controls" and not is_aws and len(ROUTES[route]["gateways"]) > 1
                add(name, owner, control,
                    "Target or caller not approved; invocation denied" if denied else
                    "Control overlap requires owner decision" if overlap else
                    "Scoped synthetic tool call forwarded",
                    status="denied" if denied else "review" if overlap else "passed",
                    proof="Target protocol, outbound credential, policy and audit proof")
                if denied:
                    break
            if steps[-1]["status"] != "denied":
                operation = "synthetic marker" if probe == "post_with_approval" else "reconciliation read"
                add("SAP finance domain tool", "SAP Integration", "Typed tool schema and operation allowlist",
                    f"Validated {operation} request", proof="Approved SAP tool contract and version")
                add("SAP Integration Suite", "SAP Integration", "Payload, destination and identity mapping",
                    "SAP API request mapped with redacted identity reference",
                    proof="iFlow mapping, credential and principal propagation")
                add("Cloud Connector (conditional)", "SAP connectivity", "On-premise hop only when target requires it",
                    "Conditional on-premise route represented; no live connector called",
                    status="reference", proof="Target topology, trust and certificate mapping")
                missing = probe == "missing_principal"
                add("SAP backend role", "SAP Security", "Final backend authorization for requested operation",
                    "No mapped principal; backend denied" if missing else "Synthetic role check permitted",
                    status="denied" if missing else "passed",
                    identity="missing SAP principal" if missing else "delegated candidate" if probe == "delegated" else "service candidate" if probe == "service" else "redacted synthetic reference",
                    proof="Backend role and principal proof in S/4HANA, Central Finance and BW/4HANA")
                if not missing:
                    add("SAP finance API", "SAP backend owner", "Read API or controlled marker boundary",
                        "Synthetic source evidence returned; no real SAP call or FI posting",
                        proof="Approved API, source contract and nonproduction evidence")
                    add("Finance answer + audit", "Finance + Enterprise Architecture", "Correlate result and control decisions",
                        "Decision record and synthetic trace ready",
                        proof="Cross-system correlation and retention ownership")

    outcome = "DENIED" if steps[-1]["status"] == "denied" else "SIMULATED · REVIEW" if any(s["status"] == "review" for s in steps) else "SIMULATED · COMPLETE"
    return {"run_id": run_id, "question_id": question_id, "question": question["title"],
            "route": route, "route_label": ROUTES[route]["label"], "route_status": ROUTES[route]["status"],
            "probe": probe, "outcome": outcome, "decision": question["decision"],
            "decision_owner": question["owner"], "decision_status": "OPEN — human architecture alignment required",
            "gates": question["gates"], "control_matrix": CONTROL_MATRIX,
            "steps": steps, "visible_count": 0, "status": "running", "synthetic": True}


def start_run(store: Store, question_id: str, route: str, probe: str) -> dict:
    record = build_run(question_id, route, probe)
    store.set_state("decision_lab:" + record["run_id"], record)
    return public_run(record)


def public_run(record: dict) -> dict:
    return {**record, "steps": record["steps"][:record["visible_count"]],
            "total_steps": len(record["steps"])}


def get_run(store: Store, run_id: str) -> dict:
    record = store.get_state("decision_lab:" + run_id)
    if not record:
        raise Denied("Unknown synthetic architecture run")
    return public_run(record)


def advance_run(store: Store, run_id: str, pace_ms: int = 220) -> None:
    key = "decision_lab:" + run_id
    record = store.get_state(key)
    if not record:
        return
    for index in range(1, len(record["steps"]) + 1):
        time.sleep(max(0, min(600, pace_ms)) / 1000)
        record = store.get_state(key)
        if not record:
            return
        record["visible_count"] = index
        record["status"] = "complete" if index == len(record["steps"]) else "running"
        store.set_state(key, record)
