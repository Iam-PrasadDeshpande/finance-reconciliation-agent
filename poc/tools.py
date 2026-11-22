from .contracts import ToolCall
from .store import Denied,Store
from .baip import BAIPSimulator
from .backends import Databricks

class DomainTools:
    ALLOWED={"sap.read","sap.compare","databricks.read","sap.post","bdc.read"}
    def __init__(self,store:Store):
        self.store=store
        self.baip=BAIPSimulator(store)
        self.dbx=Databricks(store)

    def invoke(self,call:ToolCall,scenario,identity):
        case_id=call.case_id
        if call.schema_version!="1.0": raise Denied("Unsupported tool schema version")
        if call.name not in self.ALLOWED: raise Denied("Unregistered tool")
        target={"sap.read":"sap_read_tool","sap.compare":"sap_read_tool","databricks.read":"databricks_read_tool","sap.post":"sap_post_tool","bdc.read":"bdc_read_tool"}[call.name]
        def validated():
            if call.name=="sap.read":
                backend=call.arguments.get("backend")
                if backend not in ("s4","cfin","bw"): raise Denied("Wrong SAP target")
                return self.baip.read(case_id,scenario,backend,identity,call.arguments["scope"])
            if call.name=="sap.compare":
                return self.baip.compare(case_id,scenario,identity,call.arguments["scope"],call.arguments.get("fault_profile","replication_gap"))
            if call.name=="databricks.read":
                return self.store.call(case_id,scenario,target,"databricks_access","approved_api",identity.user_id,"read",{"scope":call.arguments["scope"]},lambda:self.dbx.read(case_id,scenario,identity,call.arguments["scope"]))
            if call.name=="bdc.read":
                fixture=self.store.get_state("fixture")
                if not fixture["bdc_enabled"]: raise Denied("FUTURE / SIMULATED BDC read disabled in baseline")
                def shared():
                    return {"status":"FUTURE / SIMULATED","product":"synthetic_finance_history","shared_reference":fixture["databricks"]["evidence_id"],"physical_copy":False,"interoperability_proven":False}
                return self.store.call(case_id,scenario,"bdc_read_tool","bdc_connect","future_product_authorize",identity.user_id,"future",{"product":"synthetic_finance_history"},lambda:self.store.call(case_id,scenario,"bdc_connect","sap_databricks","shared_reference",identity.user_id,"future",{"reference_only":True},lambda:self.store.call(case_id,scenario,"sap_databricks","delta_history","refer_existing_history",identity.user_id,"future",{"evidence_id":fixture["databricks"]["evidence_id"]},shared)))
            if identity.role!="executor": raise Denied("Posting tool requires executor role")
            return self.baip.post(case_id,scenario,call.arguments["command"],identity)
        return self.store.call(case_id,scenario,target,"tool_contract","schema_validate",identity.user_id,"control",{"tool":call.name,"schema_version":call.schema_version},lambda:self.store.call(case_id,scenario,"tool_contract","operation_policy","operation_allowlist",identity.user_id,"control",{"tool":call.name},lambda:self.store.call(case_id,scenario,"operation_policy","input_validation","bounded_input",identity.user_id,"control",{"tool":call.name},lambda:self.store.call(case_id,scenario,"input_validation","tool_audit","audit_and_timeout",identity.user_id,"control",{"tool":call.name},validated))))
