"""Generate a repeatable, redacted local trace bundle without touching active state."""
import json
import os
import sys
from pathlib import Path

os.environ["POC_FIXED_CLOCK_UTC"]="2026-11-30T18:30:00Z"
root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root))

from poc.approval import ApprovalSimulator
from poc.contracts import AgentManifest,ApprovalDecision,ReconciliationRequest
from poc.demos import KINDS,run_failure
from poc.foundry import FoundrySimulator
from poc.runtime import RuntimeSimulator
from poc.store import Store

out=root/"docs"/"evidence"
out.mkdir(parents=True,exist_ok=True)
store=Store(Path(":memory:"))
FoundrySimulator(store).create(AgentManifest(version="evidence-1.0",tool_bindings=["sap.read","databricks.read","sap.post"]))
runtime=RuntimeSimulator(store)
results={}
for scenario in ("S1","S2"):
    result=runtime.reconcile(ReconciliationRequest(scenario=scenario,company_code="1000",ledger="0L",period="2026-11",currency="USD"))
    results[scenario]=result
historical={}
for period in ("2026-02","2026-03","2026-07"):
    historical[period]=runtime.reconcile(ReconciliationRequest(scenario="S1",company_code="1000",ledger="0L",period=period,currency="USD"))
approval=ApprovalSimulator(store)
proposal=approval.propose(results["S1"]["case_id"])
posted=approval.decide(ApprovalDecision(proposal_id=proposal["proposal_id"],approver_id="finance.approver",approved=True,callback_id="evidence-callback-1",payload_hash=proposal["payload_hash"],case_version=proposal["case_version"]))
bundle={"label":"SYNTHETIC REDACTED LOCAL POC","history":{"periods":store.history_overview(),"balance_rows":store.db.execute("SELECT COUNT(*) FROM period_balances").fetchone()[0],"journal_rows":store.db.execute("SELECT COUNT(*) FROM journal_fixtures").fetchone()[0]},"results":results,"historical_results":historical,"proposal":proposal,"synthetic_post":posted,"traces":{scenario:store.events(result["case_id"]) for scenario,result in results.items()},"historical_traces":{period:store.events(result["case_id"]) for period,result in historical.items()},"failure_demonstrations":{kind:run_failure(kind) for kind in KINDS}}
(out/"trace_bundle.json").write_text(json.dumps(bundle,indent=2),encoding="utf-8")
print(json.dumps({"scenarios":list(results),"variance":results["S1"]["variance"]["amount"],"historical_periods":len(bundle["history"]["periods"]),"historical_variances":{period:result["variance"] for period,result in historical.items()},"synthetic_document":posted["document_number"],"failure_checks":len(KINDS),"trace_events":{k:len(v) for k,v in bundle["traces"].items()}},indent=2))
