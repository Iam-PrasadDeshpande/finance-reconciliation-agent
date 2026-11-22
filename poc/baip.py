from .store import Denied,Store
from .backends import SAPBackends

class BAIPSimulator:
    """Per-target API Management, route, destination and conditional SCC."""
    ROUTES={"s4":"direct_api","cfin":"custom_iflow","bw":"direct_api"}
    PRIVATE={"s4":False,"cfin":False,"bw":False}

    def __init__(self,store:Store):
        self.store=store
        self.backends=SAPBackends(store)

    def read(self,case_id,scenario,backend,identity,scope):
        if backend not in self.ROUTES: raise Denied("Unknown SAP target")
        def route():
            route=self.ROUTES[backend]
            def destination():
                def backend_call(): return self.backends.read(case_id,scenario,backend,identity,scope)
                if self.PRIVATE[backend]:
                    return self.store.call(case_id,scenario,"destination_mapping","cloud_connector","private_route",identity.user_id,"control",{"backend":backend},backend_call)
                return backend_call()
            if route=="custom_iflow":
                return self.store.call(case_id,scenario,"api_management","custom_iflow","custom_iflow",identity.user_id,"read",{"backend":backend},lambda:self.store.call(case_id,scenario,"custom_iflow","destination_mapping","destination",identity.user_id,"identity",{"backend":backend,"mapping":"candidate"},destination))
            return self.store.call(case_id,scenario,"api_management","destination_mapping","direct_api",identity.user_id,"read",{"backend":backend,"mapping":"candidate"},destination)
        return self.store.call(case_id,scenario,"tool_audit","api_management","sap_read",identity.user_id,"read",{"backend":backend,"route":self.ROUTES[backend]},route)

    def post(self,case_id,scenario,command,identity):
        def route():
            return self.store.call(case_id,scenario,"api_management","destination_mapping","direct_api_post",identity.user_id,"write",{"target":"s4","proposal_id":command.proposal_id},lambda:self.store.call(case_id,scenario,"destination_mapping","s4_roles","posting_role",identity.user_id,"identity",{"target":"s4"},lambda:self.backends.post(case_id,scenario,command,identity)))
        return self.store.call(case_id,scenario,"sap_post_tool","api_management","restricted_post",identity.user_id,"write",{"proposal_id":command.proposal_id},route)

    def compare(self,case_id,scenario,identity,scope,fault_profile="replication_gap"):
        def route():
            return self.store.call(case_id,scenario,"api_management","custom_iflow","comparison_iflow",identity.user_id,"read",{"period":scope["period"]},lambda:self.store.call(case_id,scenario,"custom_iflow","destination_mapping","comparison_destination",identity.user_id,"identity",{"target":"cfin"},lambda:self.backends.compare(case_id,scenario,identity,scope,fault_profile)))
        return self.store.call(case_id,scenario,"tool_audit","api_management","sap_compare",identity.user_id,"read",{"period":scope["period"],"fault_profile":fault_profile},route)
