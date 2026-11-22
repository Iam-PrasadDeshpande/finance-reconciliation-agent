from __future__ import annotations

from .contracts import SourceSnapshot
from .identity import backend_authorize,authorize
from .store import Denied,Store

class SAPBackends:
    def __init__(self,store:Store): self.store=store

    def read(self,case_id,scenario,backend,identity,scope):
        data=self.store.source_for_period(backend,scope["period"])
        if data is None: raise Denied("No synthetic source for requested period")
        role={"s4":"s4_roles","cfin":"cfin_roles","bw":"bw_roles"}[backend]
        target={"s4":"s4_read_api","cfin":"cfin_accounting","bw":"bw_aggregate"}[backend]
        def checked():
            backend_authorize(backend,identity,scope["company_code"],deny=data.get("deny",False))
            if scope["ledger"]!="0L" or scope["currency"]!="USD": raise Denied(f"{backend} unsupported ledger/currency")
            if backend=="s4":
                self.store.call(case_id,scenario,"s4_read_api","s4_live_gl","read_gl",identity.user_id,"read",{"evidence_id":data["evidence_id"]},lambda:data["balance"])
                self.store.call(case_id,scenario,"s4_read_api","s4_journals","read_journals",identity.user_id,"read",{"bounded_count":len(data["journals"])},lambda:len(data["journals"]))
            elif backend=="cfin":
                self.store.call(case_id,scenario,"cfin_accounting","cfin_status","replication_cutoff",identity.user_id,"data",{"status":data["replication_status"]},lambda:data["replication_status"])
            else:
                self.store.call(case_id,scenario,"bw_aggregate","bw_hierarchy","hierarchy",identity.user_id,"data",{"hierarchy":data["hierarchy"]},lambda:data["hierarchy"])
                self.store.call(case_id,scenario,"bw_aggregate","bw_load","load_status",identity.user_id,"data",{"status":data["load_status"]},lambda:data["load_status"])
            freshness="current"
            if backend=="cfin" and data["replication_status"]!="current": freshness="stale"
            if backend=="bw" and data["load_status"]!="current": freshness="stale"
            return SourceSnapshot(source=backend,period=scope["period"],balance=data["balance"],timestamp_utc=data["timestamp_utc"],evidence_id=data["evidence_id"],mapping=data.get("source_mapping","1000:0L"),freshness=freshness,account_count=data["account_count"],journal_count=len(data.get("journals",[])) if backend=="s4" else None).model_dump(mode="json")
        return self.store.call(case_id,scenario,"destination_mapping",role,"backend_authorize",identity.user_id,"identity",{"backend":backend,"company_code":scope["company_code"]},lambda:self.store.call(case_id,scenario,role,target,"read_source",identity.user_id,"read",{"backend":backend,"scope":scope},checked))

    def compare(self,case_id,scenario,identity,scope,fault_profile="replication_gap"):
        if fault_profile not in ("replication_gap","mapping_conflict"): raise Denied("Unsupported investigation profile")
        def checked():
            if scope!={"company_code":"1000","ledger":"0L","period":"2026-11","currency":"USD"}: raise Denied("Document comparison supports only the seeded November scope")
            backend_authorize("cfin",identity,scope["company_code"],deny=self.store.source_for_period("cfin",scope["period"]).get("deny",False))
            documents=self.store.comparison_documents(scope["period"])
            if fault_profile=="mapping_conflict":
                documents=[{**row,"mapping_status":"conflict","aif_status":"mapping_error"} if row["document_id"]=="SYN-FI-004" else row for row in documents]
            return {"period":scope["period"],"documents":documents,"s4_total":sum(row["s4_amount"] for row in documents),"cfin_total":sum(row["cfin_amount"] for row in documents),"difference":sum(row["s4_amount"]-row["cfin_amount"] for row in documents),"fault_profile":fault_profile,"synthetic":True}
        return self.store.call(case_id,scenario,"destination_mapping","cfin_roles","compare_authorize",identity.user_id,"identity",{"period":scope["period"]},lambda:self.store.call(case_id,scenario,"cfin_roles","cfin_accounting","compare_documents",identity.user_id,"read",{"period":scope["period"],"fault_profile":fault_profile},checked))

    def post(self,case_id,scenario,command,identity):
        source=self.store.source_for_period("s4",command.period)
        def write():
            with self.store.lock:
                backend_authorize("s4",identity,"1000",write=True,deny=source.get("deny",False))
                if command.posting_basis!="variance_marker_only": raise Denied("Unsupported synthetic journal basis")
                existing=self.store.db.execute("SELECT document_number FROM journals WHERE proposal_id=?",(command.proposal_id,)).fetchone()
                if existing: return {"document_number":existing[0],"status":"SYNTHETIC_POSTED","synthetic":True,"duplicate":True,"journal_kind":"VARIANCE_MARKER_ONLY"}
                number=f"SYN-{self.store.db.execute('SELECT COALESCE(MAX(CAST(SUBSTR(document_number,5) AS INTEGER)),0) FROM journals').fetchone()[0]+1:06d}"
                result={"document_number":number,"status":"SYNTHETIC_POSTED","synthetic":True,"journal_kind":"VARIANCE_MARKER_ONLY"}
                self.store.db.execute("INSERT INTO journals VALUES (?,?,?)",(number,command.proposal_id,command.model_dump_json()))
                self.store.db.commit()
                return result
        return self.store.call(case_id,scenario,"s4_roles","s4_post_api","synthetic_post",identity.user_id,"write",{"proposal_id":command.proposal_id,"hash":command.payload_hash[:12]},write)

class Databricks:
    def __init__(self,store:Store): self.store=store

    def read(self,case_id,scenario,identity,scope):
        data=self.store.source_for_period("databricks",scope["period"])
        if data is None: raise Denied("No synthetic Databricks source for requested period")
        def query():
            authorize(identity,scope["company_code"],"databricks.read")
            if not data["uc_grant"]: raise Denied("Unity Catalog grant denied")
            return SourceSnapshot(source="databricks",period=scope["period"],balance=data["balance"],timestamp_utc=data["timestamp_utc"],evidence_id=data["evidence_id"],freshness="current" if data["pipeline_status"]=="current" else "stale",account_count=data["account_count"]).model_dump(mode="json")
        return self.store.call(case_id,scenario,"databricks_access","sql_warehouse","sql_query",identity.user_id,"read",{"scope":scope},lambda:self.store.call(case_id,scenario,"sql_warehouse","unity_catalog","grant_check",identity.user_id,"identity",{"company_code":scope["company_code"]},lambda:self.store.call(case_id,scenario,"unity_catalog","delta_history","read_history",identity.user_id,"read",{"evidence":"bounded"},lambda:self.store.call(case_id,scenario,"delta_history","data_pipeline","freshness_check",identity.user_id,"data",{"pipeline_status":data["pipeline_status"]},query))))
