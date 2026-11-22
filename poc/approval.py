from __future__ import annotations

import hashlib
import uuid
from decimal import Decimal

from .contracts import AdjustmentProposal,ApprovalDecision,PostingCommand,ToolCall
from .gateway import select_gateway
from .identity import sign_in
from .store import Denied,Store,compact

def proposal_hash(case_id,case_version,amount,currency,rationale):
    return hashlib.sha256(compact({"case_id":case_id,"case_version":case_version,"amount":str(amount),"currency":currency,"rationale":rationale,"target":"S4_SIMULATOR","posting_basis":"variance_marker_only"}).encode()).hexdigest()

class ApprovalSimulator:
    def __init__(self,store:Store): self.store=store

    def propose(self,case_id:str,rationale:str="Investigate synthetic variance"):
        with self.store.lock:
            case=self.store.case(case_id)
            if not case or case["status"]!="complete": raise Denied("Completed reconciliation required")
            variance=case["result"]["variance"]
            if variance["state"]!="comparable" or variance["amount"] is None: raise Denied("Stale or blocked sources cannot support proposal")
            amount=Decimal(str(variance["amount"]))
            if amount==0: raise Denied("Zero variance has no synthetic journal proposal")
            if self.store.investigations(case_id): raise Denied("Document investigation is active; resolve or review the source exception before any marker proposal")
            if self.store.db.execute("SELECT 1 FROM proposals WHERE case_id=?",(case_id,)).fetchone(): raise Denied("One proposal per reconciliation case")
            proposal=AdjustmentProposal(proposal_id=f"proposal-{uuid.uuid4().hex[:8]}",case_id=case_id,case_version=case["version"],amount=amount,rationale=rationale,payload_hash=proposal_hash(case_id,case["version"],amount,"USD",rationale))
            def request():
                return self.store.call(case_id,case["scenario"],"n8n_workflow","finance_approver","approval_request",case["user_id"],"approval",{"proposal_id":proposal.proposal_id,"hash":proposal.payload_hash[:12]},lambda:True)
            self.store.call(case_id,case["scenario"],"agentcore_runtime","n8n_workflow","propose_adjustment",case["user_id"],"approval",{"proposal_id":proposal.proposal_id,"amount":str(amount),"posting_basis":"variance_marker_only","synthetic":True},request)
            self.store.db.execute("INSERT INTO proposals VALUES (?,?,?,?)",(proposal.proposal_id,case_id,proposal.model_dump_json(),"awaiting_approval"))
            self.store.db.commit()
            return proposal.model_dump(mode="json")

    def decide(self,decision:ApprovalDecision,ambiguous:bool=False):
        with self.store.lock:
            return self._decide_locked(decision,ambiguous)

    def _decide_locked(self,decision:ApprovalDecision,ambiguous:bool=False):
        proposal=self.store.proposal(decision.proposal_id)
        if not proposal: raise Denied("Unknown proposal")
        case=self.store.case(proposal["case_id"])
        scenario=case["scenario"]
        if self.store.db.execute("SELECT 1 FROM callbacks WHERE callback_id=?",(decision.callback_id,)).fetchone():
            self.store.emit(case["case_id"],scenario,"trusted_callback","posting_executor","duplicate_callback",decision.approver_id,"denied","error","event",{"reason":"duplicate callback"},"deny")
            raise Denied("Duplicate callback")
        approver=sign_in(decision.approver_id)
        if approver.role!="finance_approver" or decision.approver_id==case["user_id"]: raise Denied("Separate finance approver required")
        if decision.payload_hash!=proposal["payload_hash"] or decision.case_version!=proposal["case_version"]:
            self.store.emit(case["case_id"],scenario,"trusted_callback","executor_recheck","proposal_integrity",decision.approver_id,"denied","error","event",{"reason":"hash or version mismatch"},"deny")
            raise Denied("Proposal hash or case version mismatch")
        if proposal["status"]=="synthetic_posted":
            row=self.store.db.execute("SELECT document_number FROM journals WHERE proposal_id=?",(decision.proposal_id,)).fetchone()
            if not row: raise Denied("Posted proposal is missing its synthetic journal receipt")
            self.store.db.execute("INSERT INTO callbacks VALUES (?,?)",(decision.callback_id,decision.proposal_id))
            self.store.db.commit()
            return {"document_number":row[0],"status":"SYNTHETIC_POSTED","synthetic":True,"duplicate":True}
        if proposal["status"]!="awaiting_approval": raise Denied("Proposal is not pending")
        self.store.db.execute("INSERT INTO callbacks VALUES (?,?)",(decision.callback_id,decision.proposal_id))
        self.store.db.commit()
        def callback():
            if not decision.approved:
                self.store.db.execute("UPDATE proposals SET status='rejected' WHERE proposal_id=?",(decision.proposal_id,))
                self.store.db.commit()
                return {"status":"rejected","synthetic":True}
            return self.store.call(case["case_id"],scenario,"trusted_callback","posting_executor","trusted_callback",decision.approver_id,"approval",{"proposal_id":decision.proposal_id},lambda:self.execute(proposal,case,ambiguous))
        return self.store.call(case["case_id"],scenario,"finance_approver","trusted_callback","finance_decision",decision.approver_id,"approval",{"approved":decision.approved,"proposal_id":decision.proposal_id},callback)

    def execute(self,proposal,case,ambiguous=False):
        case_id=case["case_id"]
        scenario=case["scenario"]
        def recheck():
            if proposal["status"]!="awaiting_approval": raise Denied("Proposal is not pending")
            if case["status"]!="complete" or case["version"]!=proposal["case_version"]: raise Denied("Reconciliation case changed since proposal")
            if proposal["posting_basis"]!="variance_marker_only" or proposal_hash(case_id,proposal["case_version"],proposal["amount"],proposal["currency"],proposal["rationale"])!=proposal["payload_hash"]: raise Denied("Stored proposal integrity changed")
            period=case["scope"]["period"]
            sources={name:self.store.source_for_period(name,period) for name in ("s4","cfin","bw","databricks")}
            for name,current in sources.items():
                expected=case["result"]["sources"][name]
                if current is None or current.get("deny") or current["freshness"]!="current": raise Denied(f"{name} source freshness or access changed")
                if name=="databricks" and not current.get("uc_grant",False): raise Denied("Databricks grant changed")
                if Decimal(str(current["balance"]))!=Decimal(str(expected["balance"])) or current["evidence_id"]!=expected["evidence_id"]: raise Denied(f"{name} source balance or evidence changed")
                if current["timestamp_utc"].replace("Z","+00:00")!=expected["timestamp_utc"].replace("Z","+00:00"): raise Denied(f"{name} source timestamp changed")
            live_variance=Decimal(str(sources["s4"]["balance"]))-Decimal(str(sources["cfin"]["balance"]))
            if live_variance!=Decimal(str(proposal["amount"])) or live_variance!=Decimal(str(case["result"]["variance"]["amount"])): raise Denied("Recomputed variance differs from proposal")
            if ambiguous: raise Denied("Ambiguous post response: no automatic retry; operator review required")
            command=PostingCommand(proposal_id=proposal["proposal_id"],case_id=case_id,period=period,amount=proposal["amount"],currency=proposal["currency"],payload_hash=proposal["payload_hash"],case_version=proposal["case_version"])
            executor=sign_in("posting.executor")
            gateway=select_gateway(self.store,scenario)
            call=ToolCall(name="sap.post",case_id=case_id,arguments={"command":command})
            result=self.store.call(case_id,scenario,"executor_recheck","mcp_client","post_tool",executor.user_id,"write",{"proposal_id":proposal["proposal_id"]},lambda:gateway.invoke(call,executor,case["scope"]))
            self.store.db.execute("UPDATE proposals SET status='synthetic_posted' WHERE proposal_id=?",(proposal["proposal_id"],))
            self.store.db.commit()
            self.store.emit(case_id,scenario,"s4_post_api","synthetic_result","journal_result",executor.user_id,"ok","write","event",result,"allow",payload_hash=proposal["payload_hash"],case_version=proposal["case_version"])
            return result
        try:
            return self.store.call(case_id,scenario,"posting_executor","executor_recheck","immutable_recheck","posting.executor","control",{"proposal_id":proposal["proposal_id"],"hash":proposal["payload_hash"][:12]},recheck)
        except Denied:
            self.store.db.execute("UPDATE proposals SET status='blocked' WHERE proposal_id=? AND status='awaiting_approval'",(proposal["proposal_id"],))
            self.store.db.commit()
            raise
