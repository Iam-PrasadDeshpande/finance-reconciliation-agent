from __future__ import annotations

from typing import Protocol
from .contracts import ToolCall
from .identity import authorize
from .store import Store,Denied
from .tools import DomainTools

# Architecture V5.1: the gateways a tool call passes through, in order, for each scenario.
#   S1 and S3: the agent calls Apigee directly (S3 differs from S1 only in registration, which is never on the call path).
#   S2: the agent calls AgentCore Gateway, which calls Apigee, which reaches the SAP side.
GATES={"S1":("apigee",),"S2":("agentcore","apigee"),"S3":("apigee",)}
OPERATION={"apigee":"cross_cloud_mcp","agentcore":"aws_internal_mcp"}
BOUNDARY={"apigee":"external Google","agentcore":"agent platform logical"}
TARGET={"sap.read":"sap_read_tool","sap.compare":"sap_read_tool","databricks.read":"databricks_read_tool","sap.post":"sap_post_tool","bdc.read":"bdc_read_tool"}

class GatewayPort(Protocol):
    def invoke(self,call:ToolCall,identity,scope:dict): ...

class GatewaySimulator:
    def __init__(self,store:Store,scenario:str):
        self.store=store
        self.scenario=scenario
        self.gates=GATES[scenario]
        self.tools=DomainTools(store)

    def invoke(self,call:ToolCall,identity,scope:dict):
        case_id,sc,uid,s=call.case_id,self.scenario,identity.user_id,self.store
        if call.name=="sap.post": required="sap.post"
        elif call.name in ("sap.read","sap.compare"): required=call.name
        elif call.name=="databricks.read": required="databricks.read"
        else: required="bdc.read"
        rw="write" if call.name=="sap.post" else "read"

        def run(index,caller):
            p=self.gates[index]
            last=index==len(self.gates)-1
            def reach():
                # after the audit decision: the next gateway in series, or the domain tool at the end
                if last:
                    return s.call(case_id,sc,f"{p}_audit",TARGET[call.name],"tool_invoke",uid,rw,{"tool":call.name},lambda:self.tools.invoke(call,sc,identity))
                return run(index+1,f"{p}_audit")
            def inbound():
                authorize(identity,scope["company_code"],required)
                return s.call(case_id,sc,f"{p}_inbound",f"{p}_registry","target_lookup",uid,"control",{"tool":call.name},
                    lambda:s.call(case_id,sc,f"{p}_registry",f"{p}_outbound","credential_reference",uid,"identity",{"credential":"synthetic-reference-only"},
                    lambda:s.call(case_id,sc,f"{p}_outbound",f"{p}_audit","gateway_audit",uid,"control",{"tool":call.name},reach)))
            return s.call(case_id,sc,caller,f"{p}_gateway",OPERATION[p],uid,rw,{"tool":call.name,"trust_boundary":BOUNDARY[p]},
                lambda:s.call(case_id,sc,f"{p}_gateway",f"{p}_inbound","caller_authorize",uid,"identity",{"required_scope":required},inbound))
        return run(0,"mcp_client")

class ApigeeGatewaySimulator(GatewaySimulator):
    def __init__(self,store,scenario="S1"): super().__init__(store,scenario)

class AgentCoreGatewaySimulator(GatewaySimulator):
    def __init__(self,store): super().__init__(store,"S2")

def select_gateway(store,scenario):
    if scenario in ("S1","S3"): return ApigeeGatewaySimulator(store,scenario)
    if scenario=="S2": return AgentCoreGatewaySimulator(store)
    raise Denied("Unknown scenario")
