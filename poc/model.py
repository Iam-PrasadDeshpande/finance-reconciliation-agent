from hashlib import sha256
from decimal import Decimal
from .store import Store

class ModelSimulator:
    def __init__(self,store:Store): self.store=store

    def explain(self,case_id,scenario,variance):
        amount=variance["amount"]
        prompt=f"Synthetic month-end variance state={variance['state']} amount={amount} USD; evidence count={len(variance['evidence_ids'])}"
        digest=sha256(prompt.encode()).hexdigest()
        def bedrock():
            if variance["state"]!="comparable": return "Advisory: source freshness or comparability needs review; no variance marker is supported."
            value=Decimal(str(amount))
            if value==0: return "Advisory: the synthetic S/4 and Central Finance balances match for this period. No variance marker is indicated."
            relation="exceeds" if value>0 else "is below"
            return f"Advisory: the synthetic S/4 balance {relation} the comparable Central Finance balance by ${abs(value):,.0f}. Review source mapping and replication before considering a signed variance marker."
        return self.store.call(case_id,scenario,"reconciliation_engine","portkey_route","model_route", "agent.workload","model",{"prompt_digest":digest[:16]},lambda:self.store.call(case_id,scenario,"portkey_route","portkey_redaction","redact", "agent.workload","model",{"prompt_digest":digest[:16],"raw_finance_payload":False},lambda:self.store.call(case_id,scenario,"portkey_redaction","portkey_guardrails","guardrails","agent.workload","model",{"authoritative":False},lambda:self.store.call(case_id,scenario,"portkey_guardrails","bedrock_response","inference","agent.workload","model",{"model":"deterministic simulator"},lambda:self.store.call(case_id,scenario,"bedrock_response","portkey_usage","usage","agent.workload","model",{"estimated_cost_usd":0.0},lambda:self.store.call(case_id,scenario,"portkey_usage","agentcore_runtime","model_return","agent.workload","model",{"prompt_digest":digest[:16]},bedrock))))))
