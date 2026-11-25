"""Stable v7 component and connector register for the local simulators."""
from __future__ import annotations

from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]

# Zone, ID, display name, module, state. Every named v7 subcomponent is retained.
ROWS = [
 ("Business entry","finance_user","Finance user","poc.identity","simulated"),
 ("Business entry","business_chat","Business chat application","poc.app","simulated"),
 ("Business entry","enterprise_idp","Enterprise IdP / SSO","poc.identity","simulated"),
 ("Business entry","finance_policy","Finance read-only / write policy","poc.identity","simulated"),
 ("AI Foundry design time","foundry_sdk","Custom Foundry SDK","poc.foundry","simulated"),
 ("AI Foundry design time","creation_api","Local agent creation API","poc.app","simulated"),
 ("AI Foundry design time","agent_package","Python agent package and typed bindings","poc.runtime","simulated"),
 ("AI Foundry design time","gitlab_pipeline","GitLab source, tests, CI/CD and receipt","poc.foundry","simulated"),
 ("AWS runtime","agentcore_runtime","AgentCore Runtime simulator","poc.runtime","simulated"),
 ("AWS runtime","agentcore_identity","AgentCore Identity simulator","poc.identity","simulated"),
 ("AWS runtime","mcp_client","MCP client / gateway integration","poc.runtime","simulated"),
 ("AWS runtime","context_manager","Context Manager","poc.runtime","simulated"),
 ("AWS runtime","reconciliation_engine","Deterministic Reconciliation Engine","poc.runtime","simulated"),
 ("AWS runtime","agentcore_memory","Optional AgentCore Memory simulator","poc.runtime","inactive"),
 ("AWS runtime","observability","Observability / correlation simulator","poc.store","simulated"),
 ("AWS runtime","posting_executor","Controlled Posting Executor","poc.approval","simulated"),
 ("AWS controls","iam_roles","IAM / workload role simulator","poc.identity","simulated"),
 ("AWS controls","secret_reference","Secrets Manager-style reference","poc.identity","simulated"),
 ("AWS controls","kms_key_use","KMS-style key-use event","poc.identity","simulated"),
 ("AWS controls","cloudwatch_sink","CloudWatch-style trace sink","poc.store","simulated"),
 ("Selected gateway","apigee_gateway","Google Apigee MCP simulator (S1 and S3 gateway path)","poc.gateway","scenario_s1"),
 ("Selected gateway","apigee_inbound","S1 inbound caller policy","poc.gateway","scenario_s1"),
 ("Selected gateway","apigee_registry","S1 tool registry / route","poc.gateway","scenario_s1"),
 ("Selected gateway","apigee_outbound","S1 outbound target credential","poc.gateway","scenario_s1"),
 ("Selected gateway","apigee_audit","S1 audit decision","poc.gateway","scenario_s1"),
 ("Selected gateway","agentcore_gateway","AgentCore Gateway simulator (S2 gateway path)","poc.gateway","scenario_s2"),
 ("Selected gateway","agentcore_inbound","S2 inbound caller policy","poc.gateway","scenario_s2"),
 ("Selected gateway","agentcore_registry","S2 target registry / route","poc.gateway","scenario_s2"),
 ("Selected gateway","agentcore_outbound","S2 outbound target credential","poc.gateway","scenario_s2"),
 ("Selected gateway","agentcore_audit","S2 audit decision","poc.gateway","scenario_s2"),
 ("Domain MCP","sap_read_tool","SAP Finance read target","poc.tools","simulated"),
 ("Domain MCP","sap_post_tool","Restricted SAP Finance posting target","poc.tools","simulated"),
 ("Domain MCP","databricks_read_tool","Enterprise Databricks read target","poc.tools","simulated"),
 ("Domain MCP","bdc_read_tool","Optional future BDC read target","poc.tools","future"),
 ("Domain MCP","tool_contract","Schema and version validation","poc.tools","simulated"),
 ("Domain MCP","operation_policy","Per-operation policy","poc.tools","simulated"),
 ("Domain MCP","input_validation","Input validation and bounded results","poc.tools","simulated"),
 ("Domain MCP","tool_audit","Timeout and audit functions","poc.tools","simulated"),
 ("SAP BAIP","api_management","API Management simulator","poc.baip","simulated"),
 ("SAP BAIP","custom_iflow","Cloud Integration custom iFlow path","poc.baip","simulated"),
 ("SAP BAIP","destination_mapping","Destinations, connectivity and token mapping","poc.baip","simulated"),
 ("SAP BAIP","cloud_connector","Conditional SAP Cloud Connector route","poc.baip","inactive"),
 ("SAP backends","s4_live_gl","S/4HANA live G/L","poc.backends","simulated"),
 ("SAP backends","s4_journals","S/4HANA journal and open items","poc.backends","simulated"),
 ("SAP backends","s4_read_api","S/4HANA custom ABAP read API","poc.backends","simulated"),
 ("SAP backends","s4_post_api","S/4HANA controlled posting API","poc.backends","simulated"),
 ("SAP backends","s4_roles","S/4HANA backend roles","poc.backends","simulated"),
 ("SAP backends","cfin_accounting","Central Finance mapped / replicated accounting","poc.backends","simulated"),
 ("SAP backends","cfin_status","Central Finance status, errors and cutoff","poc.backends","simulated"),
 ("SAP backends","cfin_roles","Central Finance backend roles","poc.backends","simulated"),
 ("SAP backends","bw_aggregate","BW/4HANA aggregate","poc.backends","simulated"),
 ("SAP backends","bw_hierarchy","BW/4HANA hierarchy","poc.backends","simulated"),
 ("SAP backends","bw_load","BW/4HANA load status","poc.backends","simulated"),
 ("SAP backends","bw_roles","BW/4HANA analytic roles","poc.backends","simulated"),
 ("Enterprise Databricks","unity_catalog","Unity Catalog grants","poc.backends","simulated"),
 ("Enterprise Databricks","delta_history","Delta / Lakehouse history and evidence","poc.backends","simulated"),
 ("Enterprise Databricks","sql_warehouse","SQL Warehouse","poc.backends","simulated"),
 ("Enterprise Databricks","data_pipeline","Data Engineering Pipeline / freshness","poc.backends","simulated"),
 ("Enterprise Databricks","databricks_access","Approved API / MCP access","poc.backends","simulated"),
 ("Future BDC","bdc_connect","BDC Connect sharing boundary","poc.backends","future"),
 ("Future BDC","datasphere_product","SAP Datasphere semantic product","poc.backends","future"),
 ("Future BDC","sap_databricks","SAP Databricks consumer / producer","poc.backends","future"),
 ("Future BDC","sac_view","SAP Analytics Cloud view","poc.backends","future"),
 ("Model branch","portkey_route","Portkey routing and auth simulator","poc.model","simulated"),
 ("Model branch","portkey_redaction","Portkey redaction simulator","poc.model","simulated"),
 ("Model branch","portkey_guardrails","Portkey guardrails simulator","poc.model","simulated"),
 ("Model branch","portkey_usage","Portkey log, usage and cost simulator","poc.model","simulated"),
 ("Model branch","bedrock_response","Amazon Bedrock model response simulator","poc.model","simulated"),
 ("Write approval","n8n_workflow","n8n workflow simulator","poc.approval","simulated"),
 ("Write approval","finance_approver","Finance approver actor","poc.approval","simulated"),
 ("Write approval","trusted_callback","Trusted decision callback","poc.approval","simulated"),
 ("Write approval","executor_recheck","Executor recheck","poc.approval","simulated"),
 ("Write approval","synthetic_result","Synthetic S/4 posting result and audit","poc.approval","simulated"),
]

def components():
    output=[]
    owners={"Business entry":"Finance process and app owner","AI Foundry design time":"Foundry platform owner","AWS runtime":"AWS and Foundry owner","AWS controls":"AWS security owner","Selected gateway":"Gateway platform owner","Domain MCP":"Finance tool owner","SAP BAIP":"Integration Suite owner","SAP backends":"SAP finance and security owner","Enterprise Databricks":"Enterprise data owner","Future BDC":"SAP BDC data product owner","Model branch":"AI platform owner","Write approval":"Finance controls owner"}
    gates={"Business entry":"G1, G3","AI Foundry design time":"G1, G7","AWS runtime":"G2, G7","AWS controls":"G2, G7","Selected gateway":"G2","Domain MCP":"G2, G5","SAP BAIP":"G3","SAP backends":"G3, G4, G5","Enterprise Databricks":"G4, G6","Future BDC":"G6","Model branch":"G6","Write approval":"G5"}
    managed={"agentcore_runtime","agentcore_identity","agentcore_memory","observability","apigee_gateway","agentcore_gateway","api_management","custom_iflow","cloud_connector","unity_catalog","sql_warehouse","bedrock_response","n8n_workflow"}
    for zone,cid,name,module,state in ROWS:
        output.append(dict(component_id=cid,display_name=name,zone=zone,trust_boundary=("external Google" if cid.startswith("apigee") else "AWS logical" if zone in ("AWS runtime","AWS controls") or cid.startswith("agentcore_") else zone),owner=owners[zone],classification="future simulator" if state=="future" else "managed vendor simulator" if cid in managed else "custom Python simulator",purpose=name,runtime_state=state,code_module=module,health="inactive" if state in ("inactive","future") else "ready",inbound_interfaces=["local-python"],outbound_interfaces=["local-python"],request_schema="FlowEvent/ToolCall v1.0",response_schema="FlowEvent/ToolResult v1.0",identity_authorization="synthetic scoped policy",data_classification="SYNTHETIC FINANCE",dependencies=sorted({s for s,t,_ in CHAINS if t==cid}),timeout_retry="2s; no automatic write retry",failure_deny="fail closed and emit deny event",latency_ms=0,latest_trace_id=None,latest_case_id=None,audit_events=[],remaining_live_vendor_validation=f"{gates[zone]} OPEN; no tenant proof"))
    return output

# A request and its response are persisted separately by the event store.
CHAINS = [
 ("finance_user","business_chat","read"),("business_chat","enterprise_idp","identity"),("enterprise_idp","finance_policy","identity"),("business_chat","agentcore_runtime","read"),("agentcore_runtime","agentcore_identity","identity"),("agentcore_identity","iam_roles","identity"),("iam_roles","secret_reference","control"),("secret_reference","kms_key_use","control"),("agentcore_runtime","mcp_client","read"),
 ("mcp_client","apigee_gateway","read"),("apigee_gateway","apigee_inbound","identity"),("apigee_inbound","apigee_registry","control"),("apigee_registry","apigee_outbound","identity"),("apigee_outbound","apigee_audit","control"),
 ("mcp_client","agentcore_gateway","read"),("agentcore_gateway","agentcore_inbound","identity"),("agentcore_inbound","agentcore_registry","control"),("agentcore_registry","agentcore_outbound","identity"),("agentcore_outbound","agentcore_audit","control"),
 ("apigee_audit","sap_read_tool","read"),("apigee_audit","databricks_read_tool","read"),("apigee_audit","sap_post_tool","write"),("agentcore_audit","sap_read_tool","read"),("agentcore_audit","databricks_read_tool","read"),("agentcore_audit","sap_post_tool","write"),
 ("sap_read_tool","tool_contract","control"),("tool_contract","operation_policy","control"),("operation_policy","input_validation","control"),("input_validation","tool_audit","control"),("tool_audit","api_management","read"),("api_management","custom_iflow","read"),("custom_iflow","destination_mapping","read"),("api_management","destination_mapping","read"),("destination_mapping","cloud_connector","read"),
 ("destination_mapping","s4_roles","identity"),("s4_roles","s4_read_api","read"),("s4_read_api","s4_live_gl","read"),("s4_read_api","s4_journals","read"),("destination_mapping","cfin_roles","identity"),("cfin_roles","cfin_accounting","read"),("cfin_accounting","cfin_status","read"),("destination_mapping","bw_roles","identity"),("bw_roles","bw_aggregate","read"),("bw_aggregate","bw_hierarchy","read"),("bw_aggregate","bw_load","read"),
 ("databricks_read_tool","databricks_access","read"),("databricks_access","sql_warehouse","read"),("sql_warehouse","unity_catalog","identity"),("unity_catalog","delta_history","read"),("delta_history","data_pipeline","read"),
 ("bdc_read_tool","bdc_connect","future"),("bdc_connect","datasphere_product","future"),("bdc_connect","sap_databricks","future"),("sap_databricks","delta_history","future"),("datasphere_product","sac_view","future"),
 ("agentcore_runtime","context_manager","read"),("context_manager","reconciliation_engine","read"),("reconciliation_engine","portkey_route","model"),("portkey_route","portkey_redaction","model"),("portkey_redaction","portkey_guardrails","model"),("portkey_guardrails","bedrock_response","model"),("bedrock_response","portkey_usage","model"),("portkey_usage","agentcore_runtime","model"),
 ("agentcore_runtime","n8n_workflow","approval"),("n8n_workflow","finance_approver","approval"),("finance_approver","trusted_callback","approval"),("trusted_callback","posting_executor","approval"),("posting_executor","executor_recheck","control"),("executor_recheck","mcp_client","write"),("sap_post_tool","api_management","write"),("destination_mapping","s4_roles","write"),("s4_roles","s4_post_api","write"),("s4_post_api","synthetic_result","write"),
 ("foundry_sdk","creation_api","control"),("creation_api","gitlab_pipeline","control"),("gitlab_pipeline","agent_package","control"),("agent_package","agentcore_runtime","control"),
 ("observability","cloudwatch_sink","control"),
]

def edges():
    return [dict(edge_id=f"{s}__{t}",source=s,target=t,direction="request and response",flow_type=typ,trigger="component invocation",transport="local-python; synthetic simulator",schema="FlowEvent v1.0",redacted_payload_example={"scope":"1000/0L/2026-11","synthetic":True},credential_policy_decision="scoped simulator policy",expected_response="typed response or deny",correlation_fields=["case_id","trace_id","parent_event_id"],error_behavior="fail closed; audited",mode="callback" if t=="trusted_callback" else "asynchronous" if typ=="approval" else "synchronous") for s,t,typ in CHAINS]

def write_registries():
    (ROOT/"component_registry.yaml").write_text(yaml.safe_dump({"schema_version":"1.0","components":components()},sort_keys=False,allow_unicode=True),encoding="utf-8")
    (ROOT/"edge_registry.yaml").write_text(yaml.safe_dump({"schema_version":"1.0","edges":edges()},sort_keys=False,allow_unicode=True),encoding="utf-8")
