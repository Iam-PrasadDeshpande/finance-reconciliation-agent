"""Shared concepts every agent module builds on. A module's own fragment may point at these ids.

sap_status: DOCUMENTED = an SAP page read for this demo describes it (see 'sources'); SAP_TERM = standard SAP vocabulary that was not
checked against documentation here; DEMO_ONLY = a concept of this demo with no SAP counterpart claimed.
kind: entity | measure | rule | process | artifact | actor
"""
CORE = {
    "classes": [
        {"id": "CompanyCode", "label": "Company code", "kind": "entity", "description": "The legal entity a ledger and its balances belong to. The reconciliation scope is 1000; treasury also shows 2000 and 3000.", "properties": ["code", "name", "currency"], "sap_term": "Company code", "sap_status": "SAP_TERM", "sources": []},
        {"id": "Ledger", "label": "Ledger", "kind": "entity", "description": "The set of books a balance is read from. Only the leading ledger 0L is modelled.", "properties": ["ledger id"], "sap_term": "Ledger (leading ledger 0L)", "sap_status": "SAP_TERM", "sources": []},
        {"id": "FiscalPeriod", "label": "Period", "kind": "entity", "description": "The one selected month (YYYY-MM) that every screen and every agent request uses. Calendar fiscal year is assumed.", "properties": ["YYYY-MM", "fiscal year", "fiscal period", "as-of date"], "sap_term": "Fiscal year and posting period", "sap_status": "SAP_TERM", "sources": []},
        {"id": "Currency", "label": "Currency", "kind": "entity", "description": "Account currency, plus a USD display currency with a synthetic rate for totals.", "properties": ["code", "synthetic rate"], "sap_term": "Currency and exchange rate type", "sap_status": "SAP_TERM", "sources": []},
        {"id": "Provenance", "label": "Provenance", "kind": "artifact", "description": "The three labels on every result: data source SYNTHETIC, SAP access NOT CONNECTED, execution mode READ-ONLY PROPOSED WORKFLOW.", "properties": ["data source", "SAP access", "execution mode"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "Agent", "label": "Agent", "kind": "actor", "description": "An orchestrator or a specialist. Simulated, deterministic rules, no LLM.", "properties": ["id", "role", "mode", "layers reached"], "sap_term": "Joule agent", "sap_status": "DOCUMENTED", "sources": ["R2"]},
        {"id": "Tool", "label": "Tool", "kind": "process", "description": "A typed, MCP-shaped call a specialist offers. Read, local-draft or none; a write to SAP is never a tool.", "properties": ["name", "read/write class", "input", "output"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "McpServer", "label": "MCP server (tool provider)", "kind": "actor", "description": "The named provider of an agent's tools. Calls are in-process; there is no MCP transport.", "properties": ["name"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "FlowEvent", "label": "Flow event", "kind": "artifact", "description": "A stored record of a call between two architecture components, used to show which layers a step touched.", "properties": ["source", "target", "operation", "status"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "ApprovalMarker", "label": "Approval marker", "kind": "artifact", "description": "A local record that a person approved a draft. It never posts to SAP and never initiates a bank transfer.", "properties": ["decided by", "payload hash", "status"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "ReferenceSource", "label": "SAP source", "kind": "artifact", "description": "An SAP page an answer is based on, with whether it was read or is not verified.", "properties": ["title", "url", "status"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "Scenario", "label": "Architecture scenario", "kind": "artifact", "description": "One of three designs under evaluation: S1 SAP-centric, S2 AWS AgentCore-centric, S3 SAP-hosted hybrid. A proposal, never an approval.", "properties": ["id", "status", "agent host", "gateway", "registry"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "AgentHost", "label": "Agent host", "kind": "actor", "description": "The platform where an agent runs and executes: SAP BTP Cloud Foundry in S1 and S3, AWS AgentCore Runtime in S2. Independent of where the agent is registered.", "properties": ["platform", "operator"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "McpGateway", "label": "MCP gateway", "kind": "actor", "description": "Exposes and governs tools. Google Apigee is the SAP-facing gateway in every scenario; AgentCore Gateway sits in front of it in S2 only.", "properties": ["product", "policy"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "Registry", "label": "Agent and MCP registry", "kind": "artifact", "description": "A catalog of agents and MCP servers for discovery and approval: unresolved in S1, AWS Agent Registry in S2 and S3. Control plane only, never an invocation hop.", "properties": ["product", "approval owner"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
        {"id": "LlmGateway", "label": "LLM gateway", "kind": "actor", "description": "Portkey in every scenario: model selection, credentials, fallback and monitoring. Independent of the MCP gateway and the registry.", "properties": ["product"], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []},
    ],
    "relations": [
        {"from": "CompanyCode", "to": "Ledger", "label": "keeps", "kind": "has"},
        {"from": "CompanyCode", "to": "Currency", "label": "uses", "kind": "has"},
        {"from": "Agent", "to": "Tool", "label": "calls", "kind": "calls"},
        {"from": "Tool", "to": "McpServer", "label": "served by", "kind": "served_by"},
        {"from": "Tool", "to": "FlowEvent", "label": "leaves", "kind": "emits"},
        {"from": "Tool", "to": "FiscalPeriod", "label": "scoped to", "kind": "scoped"},
        {"from": "Provenance", "to": "Tool", "label": "labels results of", "kind": "labels"},
        {"from": "ApprovalMarker", "to": "Agent", "label": "never decided by", "kind": "guards"},
        {"from": "Agent", "to": "ReferenceSource", "label": "cites", "kind": "cites"},
        {"from": "Agent", "to": "AgentHost", "label": "runs on", "kind": "has"},
        {"from": "Tool", "to": "McpGateway", "label": "exposed through", "kind": "served_by"},
        {"from": "Agent", "to": "Registry", "label": "catalogued in (not on the call path)", "kind": "labels"},
        {"from": "Agent", "to": "LlmGateway", "label": "reaches models only through", "kind": "calls"},
        {"from": "Scenario", "to": "AgentHost", "label": "chooses", "kind": "has"},
    ],
}
