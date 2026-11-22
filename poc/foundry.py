from __future__ import annotations

from hashlib import sha256
from .contracts import AgentManifest
from .store import Denied,Store,compact

VALID_TOOLS={"sap.read","sap.compare","databricks.read","sap.post"}

class FoundrySimulator:
    def __init__(self,store:Store): self.store=store

    def create(self,manifest:AgentManifest):
        if manifest.schema_version!="1.0": raise Denied("Unsupported manifest schema")
        if not manifest.tool_bindings or set(manifest.tool_bindings)-VALID_TOOLS: raise Denied("Invalid tool binding")
        if "sap.read" not in manifest.tool_bindings or "databricks.read" not in manifest.tool_bindings: raise Denied("Required read bindings missing")
        digest=sha256(compact(manifest.model_dump()).encode()).hexdigest()
        receipt={"version":manifest.version,"artifact_digest":digest,"ci_checks":["schema","tool_policy","synthetic_contract"],"status":"SIMULATED ACTIVATED"}
        case_id=f"build-{manifest.version}"
        self.store.call(case_id,"S1","foundry_sdk","creation_api","create_agent","foundry.operator","control",{"version":manifest.version},lambda:self.store.call(case_id,"S1","creation_api","gitlab_pipeline","validate_ci","foundry.operator","control",{"checks":receipt["ci_checks"]},lambda:self.store.call(case_id,"S1","gitlab_pipeline","agent_package","package","foundry.operator","control",{"digest":digest[:12]},lambda:self.store.call(case_id,"S1","agent_package","agentcore_runtime","activate","foundry.operator","control",{"version":manifest.version},lambda:True))))
        self.store.db.execute("UPDATE agents SET active=0")
        self.store.db.execute("INSERT OR REPLACE INTO agents VALUES (?,?,?,1)",(manifest.version,manifest.model_dump_json(),compact(receipt)))
        self.store.db.commit()
        return receipt

    def active(self):
        row=self.store.db.execute("SELECT version,manifest,receipt FROM agents WHERE active=1").fetchone()
        return {"version":row[0],"manifest":__import__('json').loads(row[1]),"receipt":__import__('json').loads(row[2])} if row else None
