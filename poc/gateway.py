from __future__ import annotations

from typing import Protocol
from .contracts import ToolCall
from .identity import authorize
from .store import Store,Denied
from .tools import DomainTools

class GatewayPort(Protocol):
    def invoke(self,call:ToolCall,identity,scope:dict): ...

class GatewaySimulator:
    def __init__(self,store:Store,scenario:str):
        self.store=store
        self.scenario=scenario
        self.prefix="apigee" if scenario=="S1" else "agentcore"
        self.tools=DomainTools(store)

    def invoke(self,call:ToolCall,identity,scope:dict):
        p=self.prefix
        case_id=call.case_id
        if call.name=="sap.post": required="sap.post"
        elif call.name in ("sap.read","sap.compare"): required=call.name
        elif call.name=="databricks.read": required="databricks.read"
        else: required="bdc.read"
        def inbound():
            authorize(identity,scope["company_code"],required)
            return self.store.call(case_id,self.scenario,f"{p}_inbound",f"{p}_registry","target_lookup",identity.user_id,"control",{"tool":call.name},lambda:self.store.call(case_id,self.scenario,f"{p}_registry",f"{p}_outbound","credential_reference",identity.user_id,"identity",{"credential":"synthetic-reference-only"},lambda:self.store.call(case_id,self.scenario,f"{p}_outbound",f"{p}_audit","gateway_audit",identity.user_id,"control",{"tool":call.name},lambda:self.store.call(case_id,self.scenario,f"{p}_audit",{"sap.read":"sap_read_tool","sap.compare":"sap_read_tool","databricks.read":"databricks_read_tool","sap.post":"sap_post_tool","bdc.read":"bdc_read_tool"}[call.name],"tool_invoke",identity.user_id,"write" if call.name=="sap.post" else "read",{"tool":call.name},lambda:self.tools.invoke(call,self.scenario,identity)))))
        return self.store.call(case_id,self.scenario,"mcp_client",f"{p}_gateway","cross_cloud_mcp" if p=="apigee" else "aws_internal_mcp",identity.user_id,"read" if call.name!="sap.post" else "write",{"tool":call.name,"trust_boundary":"external Google" if p=="apigee" else "AWS logical"},lambda:self.store.call(case_id,self.scenario,f"{p}_gateway",f"{p}_inbound","caller_authorize",identity.user_id,"identity",{"required_scope":required},inbound))

class ApigeeGatewaySimulator(GatewaySimulator):
    def __init__(self,store): super().__init__(store,"S1")

class AgentCoreGatewaySimulator(GatewaySimulator):
    def __init__(self,store): super().__init__(store,"S2")

def select_gateway(store,scenario):
    if scenario=="S1": return ApigeeGatewaySimulator(store)
    if scenario=="S2": return AgentCoreGatewaySimulator(store)
    raise Denied("Unknown scenario")
