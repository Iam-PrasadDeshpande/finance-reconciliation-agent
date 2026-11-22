"""Isolated fail-closed demonstrations; never writes to the active POC store."""
from pathlib import Path

from .approval import ApprovalSimulator
from .contracts import AgentManifest,ApprovalDecision,ReconciliationRequest,ToolCall
from .foundry import FoundrySimulator
from .gateway import select_gateway
from .identity import sign_in
from .runtime import RuntimeSimulator
from .store import Denied,Store

KINDS=("forbidden_company","missing_tool_scope","wrong_target","expired_identity","stale_cfin","stale_bw","changed_hash","rejected_approval","duplicate_callback","ambiguous_post","sap_denial")

def run_failure(kind:str):
    if kind not in KINDS: raise Denied("Unknown failure demonstration")
    store=Store(Path(":memory:"))
    FoundrySimulator(store).create(AgentManifest(version="failure-demo",tool_bindings=["sap.read","databricks.read","sap.post"]))
    runtime=RuntimeSimulator(store)
    approval=ApprovalSimulator(store)
    req=ReconciliationRequest(scenario="S1",company_code="1000",ledger="0L",period="2026-11",currency="USD")
    outcome=""
    try:
        if kind=="forbidden_company": runtime.reconcile(req.model_copy(update={"company_code":"2000"}))
        elif kind=="missing_tool_scope": runtime.reconcile(req,missing_scope=True)
        elif kind=="expired_identity": runtime.reconcile(req,expired=True)
        elif kind in ("stale_cfin","stale_bw"):
            fixture=store.get_state("fixture");source="cfin" if kind=="stale_cfin" else "bw";fixture[source]["replication_status" if source=="cfin" else "load_status"]="stale";store.set_state("fixture",fixture)
            result=runtime.reconcile(req);approval.propose(result["case_id"])
        else:
            result=runtime.reconcile(req)
            if kind=="wrong_target":
                select_gateway(store,"S1").invoke(ToolCall(name="sap.read",case_id=result["case_id"],arguments={"backend":"wrong","scope":result["scope"]}),sign_in("finance.user"),result["scope"])
            else:
                proposal=approval.propose(result["case_id"])
                if kind=="sap_denial":
                    fixture=store.get_state("fixture");fixture["s4"]["deny"]=True;store.set_state("fixture",fixture)
                approved=kind not in ("rejected_approval","duplicate_callback")
                decision=ApprovalDecision(proposal_id=proposal["proposal_id"],approver_id="finance.approver",approved=approved,callback_id="demo-callback",payload_hash="changed" if kind=="changed_hash" else proposal["payload_hash"],case_version=proposal["case_version"])
                if kind=="duplicate_callback": approval.decide(decision)
                response=approval.decide(decision,ambiguous=kind=="ambiguous_post")
                if kind=="rejected_approval": outcome=response["status"]
    except Denied as exc: outcome=f"DENIED: {exc}"
    journals=store.db.execute("SELECT COUNT(*) FROM journals").fetchone()[0]
    events=store.events()
    return {"kind":kind,"outcome":outcome,"synthetic_journals":journals,"failed_closed":journals==0,"denied_events":[{"case_id":e["case_id"],"source":e["source_component_id"],"target":e["target_component_id"],"reason":e["payload_summary"].get("reason")} for e in events if e["status"]=="denied"][-8:],"event_count":len(events),"isolated":True,"synthetic":True}
