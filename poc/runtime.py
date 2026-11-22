from __future__ import annotations

import uuid
from decimal import Decimal

from .contracts import ReconciliationRequest,ToolCall,Variance
from .foundry import FoundrySimulator
from .gateway import select_gateway
from .identity import authorize,sign_in
from .model import ModelSimulator
from .store import Denied,Store

class ReconciliationEngine:
    @staticmethod
    def calculate(snapshots:dict):
        s4=snapshots["s4"]
        cfin=snapshots["cfin"]
        all_sources=list(snapshots.values())
        evidence=[s["evidence_id"] for s in all_sources]
        if any(s["freshness"]=="blocked" for s in all_sources): state="blocked"
        elif any(s["freshness"]=="stale" for s in all_sources): state="stale"
        elif len({s.get("period") for s in all_sources})!=1: state="blocked"
        elif any(s["currency"]!="USD" or s["mapping"] not in ("1000:0L","ERP-A:1000->1000") for s in all_sources): state="blocked"
        else: state="comparable"
        amount=Decimal(str(s4["balance"]))-Decimal(str(cfin["balance"])) if state=="comparable" else None
        return Variance(amount=amount,state=state,formula="S/4 current balance - comparable Central Finance balance",evidence_ids=evidence).model_dump(mode="json")

class RuntimeSimulator:
    def __init__(self,store:Store):
        self.store=store
        self.foundry=FoundrySimulator(store)
        self.model=ModelSimulator(store)

    def reconcile(self,request:ReconciliationRequest,expired:bool=False,missing_scope:bool=False,case_id:str|None=None,demo_pace_ms:int=0):
        case_id=case_id or f"case-{uuid.uuid4().hex[:10]}"
        previous_pace=getattr(self.store.thread_state,"pace_ms",0)
        self.store.thread_state.pace_ms=demo_pace_ms
        scope=request.model_dump(include={"company_code","ledger","period","currency"})
        self.store.save_case(case_id,request.scenario,request.user_id,scope,status="running")
        try:
            if request.period not in self.store.available_periods(): raise Denied("No synthetic finance history for requested period")
            active=self.foundry.active()
            if not active: raise Denied("No activated agent version")
            identity=sign_in(request.user_id,expired)
            if missing_scope: identity.scopes=[]
            def authenticate():
                authorize(identity,scope["company_code"],"sap.read")
                return self.store.call(case_id,request.scenario,"enterprise_idp","finance_policy","read_policy",request.user_id,"identity",{"company_code":scope["company_code"]},lambda:True)
            self.store.call(case_id,request.scenario,"finance_user","business_chat","submit_request",request.user_id,"read",scope,lambda:self.store.call(case_id,request.scenario,"business_chat","enterprise_idp","sign_in",request.user_id,"identity",{"user_id":request.user_id},authenticate))
            def invoke():
                self.store.call(case_id,request.scenario,"agentcore_runtime","agentcore_identity","workload_identity",request.user_id,"identity",{"role":"agent.workload"},lambda:self.store.call(case_id,request.scenario,"agentcore_identity","iam_roles","role_policy",request.user_id,"identity",{"scope":"read"},lambda:self.store.call(case_id,request.scenario,"iam_roles","secret_reference","reference_access",request.user_id,"control",{"reference":"synthetic-only"},lambda:self.store.call(case_id,request.scenario,"secret_reference","kms_key_use","key_use",request.user_id,"control",{"key":"synthetic-local"},lambda:True))))
                gateway=select_gateway(self.store,request.scenario)
                snapshots={}
                for backend in ("s4","cfin","bw"):
                    call=ToolCall(name="sap.read",case_id=case_id,arguments={"backend":backend,"scope":scope})
                    snapshots[backend]=self.store.call(case_id,request.scenario,"agentcore_runtime","mcp_client","read_sap",request.user_id,"read",{"backend":backend},lambda c=call:gateway.invoke(c,identity,scope))
                call=ToolCall(name="databricks.read",case_id=case_id,arguments={"scope":scope})
                snapshots["databricks"]=self.store.call(case_id,request.scenario,"agentcore_runtime","mcp_client","read_databricks",request.user_id,"read",{"source":"databricks"},lambda:gateway.invoke(call,identity,scope))
                def calculate(): return self.store.call(case_id,request.scenario,"context_manager","reconciliation_engine","calculate_variance",request.user_id,"data",{"evidence_ids":[s["evidence_id"] for s in snapshots.values()]},lambda:ReconciliationEngine.calculate(snapshots))
                variance=self.store.call(case_id,request.scenario,"agentcore_runtime","context_manager","assemble_context",request.user_id,"data",{"sources":list(snapshots)},calculate)
                explanation=self.model.explain(case_id,request.scenario,variance)
                return {"case_id":case_id,"trace_id":f"trace-{case_id}","scenario":request.scenario,"agent_version":active["version"],"scope":scope,"variance":variance,"sources":snapshots,"advisory_explanation":explanation,"synthetic":True,"source_s4_balance_at_run":snapshots["s4"]["balance"]}
            result=self.store.call(case_id,request.scenario,"business_chat","agentcore_runtime","invoke_agent",request.user_id,"read",{"scope":scope,"agent_version":active["version"]},invoke)
            self.store.save_case(case_id,request.scenario,request.user_id,scope,result,"complete")
            return result
        except Exception as exc:
            self.store.save_case(case_id,request.scenario,request.user_id,scope,{"error":str(exc),"synthetic":True},"denied")
            raise
        finally:
            self.store.thread_state.pace_ms=previous_pace

