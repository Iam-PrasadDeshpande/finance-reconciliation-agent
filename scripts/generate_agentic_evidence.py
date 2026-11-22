"""Produce isolated, reviewable positive and held investigation dossiers."""
import hashlib
import json
import os
import sys
from pathlib import Path

os.environ["POC_FIXED_CLOCK_UTC"]="2026-11-30T18:30:00Z"
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))

from poc.architecture_view import architecture_events
from poc.contracts import AgentManifest, ReconciliationRequest
from poc.foundry import FoundrySimulator
from poc.investigation import InvestigationSimulator
from poc.runtime import RuntimeSimulator
from poc.store import Store, compact

def scenario(profile):
    store=Store(Path(":memory:"))
    FoundrySimulator(store).create(AgentManifest(version="agentic-evidence-1",tool_bindings=["sap.read","sap.compare","databricks.read","sap.post"]))
    before=RuntimeSimulator(store).reconcile(ReconciliationRequest(scenario="S1",company_code="1000",ledger="0L",period="2026-11"))
    investigator=InvestigationSimulator(store)
    record=investigator.start(before["case_id"],profile)
    record=investigator.run(record["investigation_id"])
    if profile=="replication_gap": record=investigator.resolve(record["investigation_id"])
    assert all(hashlib.sha256(compact(item["data"]).encode()).hexdigest()==item["sha256"] for item in record["proof"])
    return {"dossier":record,"architecture_events":architecture_events(store.events(before["case_id"])),"journal_count":store.db.execute("SELECT COUNT(*) FROM journals").fetchone()[0]}

bundle={"label":"SYNTHETIC AGENTIC INVESTIGATION EVIDENCE","resolved":scenario("replication_gap"),"mapping_hold":scenario("mapping_conflict")}
assert bundle["resolved"]["dossier"]["after"]["variance"]["amount"]=="0"
assert bundle["mapping_hold"]["dossier"]["status"]=="held"
assert bundle["resolved"]["journal_count"]==bundle["mapping_hold"]["journal_count"]==0
output=ROOT/"docs"/"evidence"/"agentic_trace_bundle.json"
output.write_text(json.dumps(bundle,indent=2),encoding="utf-8")
print(json.dumps({"output":str(output),"resolved_proof_items":len(bundle["resolved"]["dossier"]["proof"]),"held_proof_items":len(bundle["mapping_hold"]["dossier"]["proof"]),"resolved_variance":bundle["resolved"]["dossier"]["after"]["variance"]["amount"],"journals":0}))
