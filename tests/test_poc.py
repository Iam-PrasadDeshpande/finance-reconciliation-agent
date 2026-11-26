from datetime import datetime,timezone
from concurrent.futures import ThreadPoolExecutor
import importlib
import time

import pytest

from poc.approval import ApprovalSimulator
from poc.contracts import AgentManifest,ApprovalDecision,ReconciliationRequest,ToolCall
from poc.foundry import FoundrySimulator
from poc.gateway import select_gateway
from poc.identity import sign_in
from poc.registry import components,edges
from poc.runtime import RuntimeSimulator
from poc.store import Denied,Store
from poc.intents import parse_reconciliation
from poc.questions import answer_follow_up, request_for_demo
from poc.architecture_view import architecture_events, architecture_registry
from poc.investigation import InvestigationSimulator
from poc.decision_lab import question_catalog, build_run, start_run, advance_run, get_run
from poc.route_playbooks import route_playbook_catalog

@pytest.fixture
def env(tmp_path):
    store=Store(tmp_path/"test.sqlite3")
    FoundrySimulator(store).create(AgentManifest(version="test-1",tool_bindings=["sap.read","databricks.read","sap.post"]))
    return store,RuntimeSimulator(store),ApprovalSimulator(store)

def request(scenario="S1",user_id="finance.user",company_code="1000"):
    return ReconciliationRequest(scenario=scenario,company_code=company_code,ledger="0L",period="2026-11",currency="USD",user_id=user_id)

def journal_count(store): return store.db.execute("SELECT COUNT(*) FROM journals").fetchone()[0]

def test_architecture_decision_catalog_and_combined_route_are_open():
    catalog = question_catalog()
    assert len(catalog) == 6
    assert all(item["next_action"] and item["owner"] and len(item["gates"]) == 3 for item in catalog)
    assert all(len(item["dependencies"]) >= 3 for item in catalog)
    run = build_run("sap_mcp_hosting", "S3", "onboarded")
    names = [step["component"] for step in run["steps"]]
    # V5.2: S3 runs the agent on AgentCore, passes AgentCore Gateway and then Apigee; the registry is design-time only
    assert names.index("AWS Agent Registry") < names.index("AgentCore Runtime + Identity") < names.index("AgentCore Gateway") < names.index("SAP Apigee MCP") < names.index("SAP Integration Suite") < names.index("SAP backend role")
    s1 = [step["component"] for step in build_run("sap_mcp_hosting", "S1", "onboarded")["steps"]]
    assert "AgentCore Gateway" not in s1 and "AgentCore Runtime + Identity" not in s1 and s1.index("SAP BTP Cloud Foundry agent") < s1.index("SAP Apigee MCP")
    s2 = [step["component"] for step in build_run("sap_mcp_hosting", "S2", "onboarded")["steps"]]
    assert "SAP Apigee MCP" not in s2 and s2.index("AgentCore Gateway") < s2.index("SAP Integration Suite")
    assert run["steps"][1]["phase"] == "design-time"
    assert run["steps"][2]["input"] == "Can SAP retain Apigee as its domain MCP layer?"
    assert run["route_status"].startswith("Preferred for SAP and non-SAP")
    assert run["decision_status"].startswith("OPEN")
    assert all("1000" not in str(step) and "ghp_" not in str(step) for step in run["steps"])


def test_route_hosting_playbooks_cover_all_three_cases():
    playbooks = route_playbook_catalog()
    assert set(playbooks) == {"S1", "S2", "S3"}
    assert all(len(item["steps"]) >= 5 and item["decisions"] and item["sources"] for item in playbooks.values())
    assert all(all(stage["configure"] and stage["dependency"] and stage["proof"] and stage["owner"] for stage in item["steps"]) for item in playbooks.values())
    assert "AgentCore Gateway" in playbooks["S3"]["path"] and "Apigee MCP" in playbooks["S3"]["path"]
    assert "AgentCore Gateway" in playbooks["S2"]["path"] and "Apigee" not in playbooks["S2"]["path"] and "AgentCore" not in playbooks["S1"]["path"]
    assert "Preferred for SAP and non-SAP" in playbooks["S3"]["status"] and playbooks["S1"]["status"] == "Preferred for SAP-centric agents" and playbooks["S2"]["status"].startswith("Not preferred")


@pytest.mark.parametrize("question,probe,denied_at", [
    ("sap_mcp_hosting", "missing_target", "AgentCore Gateway"),
    ("sap_identity", "missing_principal", "SAP backend role"),
    ("read_vs_post", "post_no_approval", "Finance approval boundary"),
    ("foundry_registry", "unregistered", "AWS Agent Registry"),
    ("external_agent", "unapproved_partner", "AgentCore Gateway"),
])
def test_decision_probes_fail_at_the_intended_boundary(question,probe,denied_at):
    run = build_run(question,"S3",probe)
    assert run["outcome"] == "DENIED"
    assert run["steps"][-1]["component"] == denied_at
    assert run["steps"][-1]["status"] == "denied"
    assert all(step["component"] != "SAP finance API" for step in run["steps"])


def test_architecture_decision_progress_is_persisted_and_bounded(tmp_path):
    store = Store(tmp_path / "decision.sqlite3")
    first = start_run(store,"sap_identity","S3","delegated")
    assert first["steps"] == [] and first["status"] == "running"
    advance_run(store, first["run_id"], pace_ms=0)
    finished = get_run(store, first["run_id"])
    assert finished["status"] == "complete"
    assert finished["total_steps"] == len(finished["steps"])
    assert finished["steps"][-1]["component"] == "Finance answer + audit"
    with pytest.raises(Denied):
        build_run("sap_identity", "S4", "delegated")

def decision(proposal,approved=True,callback_id="cb-1",payload_hash=None):
    return ApprovalDecision(proposal_id=proposal["proposal_id"],approver_id="finance.approver",approved=approved,callback_id=callback_id,payload_hash=payload_hash or proposal["payload_hash"],case_version=proposal["case_version"])

def test_registry_has_all_named_components_and_edges():
    ids={c["component_id"] for c in components()}
    assert len(ids)==len(components())
    assert {"s4_roles","cfin_roles","bw_roles","agentcore_gateway","apigee_gateway","bdc_connect","posting_executor"}<=ids
    assert all(e["source"] in ids and e["target"] in ids for e in edges())

def test_fixture_calculation_and_scenario_equivalence(env):
    store,runtime,_=env
    s1=runtime.reconcile(request("S1"));s2=runtime.reconcile(request("S2"))
    assert s1["variance"]["amount"]==s2["variance"]["amount"]=="25000"
    assert s1["variance"]["state"]==s2["variance"]["state"]=="comparable"
    assert set(s1["variance"]["evidence_ids"])=={"SYN-S4-GL-001","SYN-CFIN-001","SYN-BW-001","SYN-DBX-001"}
    e1=store.events(s1["case_id"]);e2=store.events(s2["case_id"])
    assert any(e["operation"]=="cross_cloud_mcp" for e in e1)
    assert any(e["operation"]=="aws_internal_mcp" for e in e2)
    assert any(e["operation"]=="custom_iflow" for e in e1)
    assert any(e["operation"]=="direct_api" for e in e1)
    assert {"s4_live_gl","s4_journals","cfin_status","bw_hierarchy","bw_load"}<={e["target_component_id"] for e in e1}
    assert not any(e["source_component_id"].startswith("agentcore_gateway") for e in e1)
    # V5.2: S1 calls Apigee, S2 calls AgentCore Gateway (no Apigee unless inserted), S3 passes AgentCore Gateway and then Apigee
    assert not any("apigee_gateway" in (e["source_component_id"],e["target_component_id"]) for e in e2)
    s3=runtime.reconcile(request("S3"));e3=store.events(s3["case_id"])
    gate_order=[e["target_component_id"] for e in e3 if e["target_component_id"] in ("agentcore_gateway","apigee_gateway") and e["direction"]=="request"]
    assert gate_order[:2]==["agentcore_gateway","apigee_gateway"]
    assert s3["variance"]["amount"]==s1["variance"]["amount"] and s3["variance"]["state"]==s1["variance"]["state"]
    assert all(e["scenario"]=="S3" for e in e3)
    assert all(e["payload_summary"].get("synthetic",True) for e in e1)
    assert any(e["direction"]=="response" and e["parent_event_id"] for e in e1)
    assert journal_count(store)==0

@pytest.mark.parametrize("user,code,expired,missing",[("restricted.user","1000",False,False),("finance.user","1000",True,False),("finance.user","1000",False,True)])
def test_identity_denials_fail_closed(env,user,code,expired,missing):
    store,runtime,_=env
    with pytest.raises(Denied): runtime.reconcile(request(user_id=user,company_code=code),expired=expired,missing_scope=missing)
    assert journal_count(store)==0

def test_invalid_binding_and_wrong_target(env):
    store,runtime,_=env
    with pytest.raises(Denied): FoundrySimulator(store).create(AgentManifest(version="invalid",tool_bindings=["sap.read","evil.post"]))
    result=runtime.reconcile(request())
    identity=sign_in("finance.user")
    call=ToolCall(name="sap.read",case_id=result["case_id"],arguments={"backend":"unknown","scope":result["scope"]})
    with pytest.raises(Denied): select_gateway(store,"S1").invoke(call,identity,result["scope"])
    assert journal_count(store)==0

@pytest.mark.parametrize("source,field,value",[("cfin","replication_status","stale"),("bw","load_status","stale"),("databricks","pipeline_status","error")])
def test_stale_source_blocks_proposal(env,source,field,value):
    store,runtime,approval=env
    fixture=store.get_state("fixture");fixture[source][field]=value;store.set_state("fixture",fixture)
    result=runtime.reconcile(request())
    assert result["variance"]["state"]=="stale"
    with pytest.raises(Denied): approval.propose(result["case_id"])
    assert journal_count(store)==0

def test_source_change_changes_next_read(env):
    store,runtime,_=env
    before=runtime.reconcile(request())
    fixture=store.get_state("fixture");fixture["cfin"]["balance"]=970000;store.set_state("fixture",fixture)
    after=runtime.reconcile(request())
    assert before["variance"]["amount"]=="25000"
    assert after["variance"]["amount"]=="30000"

def test_approved_synthetic_post_and_duplicate_callback(env):
    store,runtime,approval=env
    result=runtime.reconcile(request());proposal=approval.propose(result["case_id"])
    posted=approval.decide(decision(proposal))
    assert posted["status"]=="SYNTHETIC_POSTED"
    assert posted["document_number"].startswith("SYN-")
    with pytest.raises(Denied,match="Duplicate"): approval.decide(decision(proposal))
    assert journal_count(store)==1

@pytest.mark.parametrize("failure",["reject","tamper","stale","ambiguous","sap_deny"])
def test_post_negative_cases_create_no_journal(env,failure):
    store,runtime,approval=env
    result=runtime.reconcile(request());proposal=approval.propose(result["case_id"])
    if failure=="reject": assert approval.decide(decision(proposal,approved=False))["status"]=="rejected"
    else:
        if failure=="stale":
            fixture=store.get_state("fixture");fixture["s4"]["balance"]+=1;store.set_state("fixture",fixture)
        if failure=="sap_deny":
            fixture=store.get_state("fixture");fixture["s4"]["deny"]=True;store.set_state("fixture",fixture)
        with pytest.raises(Denied): approval.decide(decision(proposal,payload_hash="bad" if failure=="tamper" else None),ambiguous=failure=="ambiguous")
    assert journal_count(store)==0

def test_tool_schema_version_rejected(env):
    store,runtime,_=env
    result=runtime.reconcile(request())
    call=ToolCall(name="sap.read",schema_version="9.9",case_id=result["case_id"],arguments={"backend":"s4","scope":result["scope"]})
    with pytest.raises(Denied,match="schema version"): select_gateway(store,"S2").invoke(call,sign_in("finance.user"),result["scope"])

def test_future_bdc_is_opt_in_reference_only(env):
    store,runtime,_=env
    result=runtime.reconcile(request())
    call=ToolCall(name="bdc.read",case_id=result["case_id"],arguments={"scope":result["scope"]})
    gateway=select_gateway(store,"S1")
    with pytest.raises(Denied,match="disabled"): gateway.invoke(call,sign_in("finance.user"),result["scope"])
    fixture=store.get_state("fixture");fixture["bdc_enabled"]=True;store.set_state("fixture",fixture)
    future=gateway.invoke(call,sign_in("finance.user"),result["scope"])
    assert future["status"]=="FUTURE / SIMULATED"
    assert future["shared_reference"]==fixture["databricks"]["evidence_id"]
    assert future["physical_copy"] is False

def test_twelve_month_sqlite_history_and_monthly_results(env):
    store,runtime,approval=env
    assert store.available_periods()==["2025-12",*[f"2026-{m:02d}" for m in range(1,12)]]
    assert store.db.execute("SELECT COUNT(*) FROM period_balances").fetchone()[0]==12*4*6
    assert store.db.execute("SELECT COUNT(*) FROM journal_fixtures").fetchone()[0]==12*12
    assert store.source_for_period("s4","2026-11")["balance"]==1_000_000
    feb=runtime.reconcile(request().model_copy(update={"period":"2026-02"}))
    assert feb["variance"]["amount"]=="0"
    assert "balances match" in feb["advisory_explanation"]
    march=runtime.reconcile(request().model_copy(update={"period":"2026-03"}))
    assert march["variance"]["state"]=="stale"
    with pytest.raises(Denied): approval.propose(march["case_id"])
    july=runtime.reconcile(request().model_copy(update={"period":"2026-07"}))
    assert july["sources"]["bw"]["freshness"]=="stale"

def test_historical_intent_parsing():
    assert parse_reconciliation("Reconcile company code 1000, ledger 0L, February 2026, USD")["period"]=="2026-02"
    assert parse_reconciliation("Reconcile company code 1000 ledger 0L 2025-12 USD")["period"]=="2025-12"
    assert "follow_up" in parse_reconciliation("Reconcile November 2026")

def test_paced_run_persists_events_before_result(env):
    store,runtime,_=env
    case_id="case-live-test"
    with ThreadPoolExecutor(max_workers=1) as pool:
        future=pool.submit(runtime.reconcile,request(),case_id=case_id,demo_pace_ms=12)
        time.sleep(.05)
        assert not future.done()
        assert store.case(case_id)["status"]=="running"
        assert len(store.events(case_id))>0
        result=future.result(timeout=15)
    assert result["variance"]["amount"]=="25000"
    assert store.case(case_id)["status"]=="complete"
    seq=[event["seq"] for event in store.events(case_id)]
    assert seq==sorted(seq)

def test_historical_mutation_affects_next_read_and_history_detail(env):
    store,runtime,_=env
    before=runtime.reconcile(request().model_copy(update={"period":"2026-04"}))
    current=store.source_for_period("cfin","2026-04")["balance"]
    change=store.mutate_period_source("2026-04","cfin","balance",current-7000)
    after=runtime.reconcile(request().model_copy(update={"period":"2026-04"}))
    assert change["before"]==current
    assert int(after["variance"]["amount"])==int(before["variance"]["amount"])+7000
    detail=store.history_detail("2026-04")
    assert len(detail["balances"])==24 and len(detail["journals"])==12

def test_non_november_approval_uses_that_period_state(env):
    store,runtime,approval=env
    result=runtime.reconcile(request().model_copy(update={"period":"2026-04"}))
    proposal=approval.propose(result["case_id"])
    posted=approval.decide(decision(proposal))
    assert posted["status"]=="SYNTHETIC_POSTED"
    assert journal_count(store)==1

def test_run_api_returns_case_before_streamed_completion(env,monkeypatch):
    from fastapi.testclient import TestClient
    module=importlib.import_module("poc.app")
    store,runtime,_=env
    monkeypatch.setattr(module,"store",store)
    monkeypatch.setattr(module,"runtime",runtime)
    monkeypatch.setattr(module,"foundry",FoundrySimulator(store))
    client=TestClient(module.app)
    started_at=time.perf_counter()
    response=client.post("/api/runs",json={"message":"Reconcile company code 1000, ledger 0L, February 2026, USD","scenario":"S2","demo_pace_ms":12})
    assert response.status_code==202
    assert time.perf_counter()-started_at<.5
    case_id=response.json()["case_id"]
    assert store.case(case_id)["status"] in ("queued","running")
    for _ in range(100):
        case=store.case(case_id)
        if case["status"]=="complete": break
        time.sleep(.05)
    assert case["status"]=="complete"
    assert case["result"]["variance"]["amount"]=="0"
    stream=client.get(f"/api/runs/{case_id}/stream")
    assert "event: flow" in stream.text
    assert "event: complete" in stream.text

def test_conversational_questions_have_typed_answers_and_traces(env):
    store,runtime,approval=env
    result=runtime.reconcile(request())
    before=len(store.events(result["case_id"]))
    why=answer_follow_up(store,approval,"Why is there a variance?",result["case_id"],"S2")
    assert why["status"]=="answered"
    assert "25,000 USD" in why["answer"]
    assert why["scenario"]=="S1"  # Selected case wins over a stale UI selector.
    assert why["trace_case_id"]==result["case_id"]
    evidence=answer_follow_up(store,approval,"Show source evidence",result["case_id"],"S2")
    assert "Central Finance" in evidence["answer"]
    assert int(evidence["sources"]["cfin"]["balance"])==975_000
    limited=answer_follow_up(store,approval,"What is the weather?",result["case_id"],"S2")
    assert limited["status"]=="limited" and "cannot verify" in limited["answer"]
    assert len(store.events(result["case_id"]))>=before+18

def test_neutral_architecture_projection_removes_company_scope(env):
    store,runtime,_=env
    result=runtime.reconcile(request())
    import json
    payload=json.dumps({"registry":architecture_registry(),"events":architecture_events(store.events(result["case_id"]))})
    assert '"company_code"' not in payload
    assert '"ledger"' not in payload
    assert '"1000"' not in payload
    assert len(architecture_registry()["components"])==73

def test_demo_request_infers_bounded_synthetic_scope():
    parsed,assumed,follow_up=request_for_demo("Reconcile February 2026")
    assert follow_up is None and parsed=={"company_code":"1000","ledger":"0L","period":"2026-02","currency":"USD"}
    assert set(assumed)=={"company code","ledger","currency"}
    assert request_for_demo("Reconcile a month")[2].startswith("Which synthetic month")

def test_monthly_finance_questions_and_architecture_topics(env):
    store,_,approval=env
    balance=answer_follow_up(store,approval,"What is the S/4HANA balance for account 110000 in February 2026?",None,"S1")
    assert balance["kind"]=="monthly_balance" and "318,500 USD" in balance["answer"]
    journals=answer_follow_up(store,approval,"Show journal evidence for March 2026",None,"S1")
    assert journals["journal_count"]==12 and "SYN-J-2026-03-01" in journals["answer"]
    stale=answer_follow_up(store,approval,"Which months are stale?",None,"S1")
    assert stale["stale_periods"]==["2026-01","2026-03","2026-07"]
    annual=answer_follow_up(store,approval,"Give an annual summary",None,"S1")
    assert annual["comparable_months"]==9
    routes=answer_follow_up(store,approval,"Compare S1 and S2",None,"S1")
    assert "Apigee" in routes["answer"] and "AgentCore" in routes["answer"]
    assert all(store.events(row["trace_case_id"]) for row in (balance,journals,stale,annual,routes))

def test_advisory_language_matches_negative_variance(env):
    store,runtime,_=env
    store.mutate_period_source("2026-04","cfin","balance",1_000_000)
    result=runtime.reconcile(request().model_copy(update={"period":"2026-04"}))
    assert int(result["variance"]["amount"])<0
    assert "is below" in result["advisory_explanation"]

def test_chat_clarification_and_scope_limit_have_architecture_traces(env,monkeypatch):
    from fastapi.testclient import TestClient
    module=importlib.import_module("poc.app")
    store,runtime,approval=env
    monkeypatch.setattr(module,"store",store)
    monkeypatch.setattr(module,"runtime",runtime)
    monkeypatch.setattr(module,"approval",approval)
    client=TestClient(module.app)
    missing=client.post("/api/chat",json={"message":"Reconcile a month"}).json()
    assert missing["status"]=="needs_scope"
    assert len(store.events(missing["trace_case_id"]))==6
    outside=client.post("/api/chat",json={"message":"Reconcile company code 2000, ledger 0L, February 2026, USD"}).json()
    assert outside["status"]=="limited"
    assert len(store.events(outside["trace_case_id"]))==6
    assert "2000" not in str(architecture_events(store.events(outside["trace_case_id"])))

@pytest.mark.parametrize("source,field,value",[
    ("s4","balance",1_000_001),("cfin","balance",975_001),
    ("bw","balance",975_001),("databricks","balance",975_001),
    ("cfin","replication_status","stale"),("bw","load_status","stale"),
    ("databricks","pipeline_status","error"),("databricks","uc_grant",False),
    ("cfin","evidence_id","SYN-CHANGED"),
])
def test_post_rechecks_every_source_after_proposal(env,source,field,value):
    store,runtime,approval=env
    result=runtime.reconcile(request()); proposal=approval.propose(result["case_id"])
    fixture=store.get_state("fixture");fixture[source][field]=value;store.set_state("fixture",fixture)
    with pytest.raises(Denied): approval.decide(decision(proposal))
    assert journal_count(store)==0
    assert store.proposal(proposal["proposal_id"])["status"]=="blocked"

def test_zero_and_negative_variance_proposal_policy(env):
    store,runtime,approval=env
    zero=runtime.reconcile(request().model_copy(update={"period":"2026-02"}))
    with pytest.raises(Denied,match="Zero variance"): approval.propose(zero["case_id"])
    store.mutate_period_source("2026-04","cfin","balance",1_000_000)
    negative=runtime.reconcile(request().model_copy(update={"period":"2026-04"}))
    proposal=approval.propose(negative["case_id"])
    assert int(proposal["amount"])<0
    assert proposal["posting_basis"]=="variance_marker_only"
    assert approval.decide(decision(proposal))["status"]=="SYNTHETIC_POSTED"

def test_one_proposal_and_stable_post_receipt(env):
    store,runtime,approval=env
    result=runtime.reconcile(request());proposal=approval.propose(result["case_id"])
    with pytest.raises(Denied,match="One proposal"): approval.propose(result["case_id"])
    first=approval.decide(decision(proposal))
    replay=approval.decide(decision(proposal,callback_id="cb-new"))
    assert replay["document_number"]==first["document_number"] and replay["duplicate"]
    assert store.proposal(proposal["proposal_id"])["status"]=="synthetic_posted"
    assert journal_count(store)==1

def test_concurrent_approval_creates_one_journal(env):
    store,runtime,approval=env
    result=runtime.reconcile(request());proposal=approval.propose(result["case_id"])
    with ThreadPoolExecutor(max_workers=2) as pool:
        outcomes=list(pool.map(lambda n: approval.decide(decision(proposal,callback_id=f"parallel-{n}")),range(2)))
    assert outcomes[0]["document_number"]==outcomes[1]["document_number"]
    assert journal_count(store)==1

def test_denied_company_code_is_redacted_from_architecture_trace(env):
    store,_,_=env
    raw=[{"operation":"scope_limit","payload_summary":{"reason":"Company code 2000 is outside ERP-A:2000->2000 and 2000:0L"}}]
    import json
    neutral=json.dumps(architecture_events(raw))
    assert "2000" not in neutral and "synthetic entity" in neutral

def investigation_env(env,scenario="S1",period="2026-11"):
    store,runtime,_=env
    FoundrySimulator(store).create(AgentManifest(version="investigation-test",tool_bindings=["sap.read","sap.compare","databricks.read","sap.post"]))
    case=runtime.reconcile(request(scenario).model_copy(update={"period":period}))
    return store,InvestigationSimulator(store),case

@pytest.mark.parametrize("scenario,route",[("S1","cross_cloud_mcp"),("S2","aws_internal_mcp")])
def test_agentic_document_investigation_ties_to_variance(env,scenario,route):
    store,agent,case=investigation_env(env,scenario)
    started=agent.start(case["case_id"])
    assert started["status"]=="running" and all(step["status"]=="pending" for step in started["plan"])
    record=agent.run(started["investigation_id"])
    assert record["status"]=="action_proposed"
    assert record["diagnosis"]["classification"]=="replication_gap"
    comparison=next(item for item in record["proof"] if item["step_id"]=="compare")["data"]
    assert (comparison["s4_total"],comparison["cfin_total"],comparison["difference"])==(1_000_000,975_000,25_000)
    assert len(comparison["documents"])==4
    assert all(step["status"]=="complete" and step["proof_ids"] for step in record["plan"])
    assert all(len(item["sha256"])==64 for item in record["proof"])
    operations=[event["operation"] for event in store.events(case["case_id"])]
    assert "sap_compare" in operations and route in operations and "recommend_next_action" in operations
    assert journal_count(store)==0

def test_reprocess_reconciles_and_preserves_before_proof(env):
    store,agent,case=investigation_env(env)
    record=agent.run(agent.start(case["case_id"])["investigation_id"])
    resolved=agent.resolve(record["investigation_id"])
    assert resolved["status"]=="resolved"
    assert resolved["before"]["variance"]["amount"]=="25000"
    assert resolved["after"]["variance"]["amount"]=="0"
    assert resolved["after"]["case_id"]!=case["case_id"]
    assert all(store.source_for_period(source,"2026-11")["balance"]==1_000_000 for source in ("s4","cfin","bw","databricks"))
    assert store.comparison_documents("2026-11")[-1]["aif_status"]=="replicated"
    assert journal_count(store)==0
    with pytest.raises(Denied,match="No approved"): agent.resolve(record["investigation_id"])

def test_mapping_conflict_holds_without_source_mutation(env):
    store,agent,case=investigation_env(env,"S2")
    record=agent.run(agent.start(case["case_id"],"mapping_conflict")["investigation_id"])
    assert record["status"]=="held" and record["diagnosis"]["classification"]=="mapping_conflict"
    assert record["proposed_action"]["action"]=="manual_review"
    assert store.source_for_period("cfin","2026-11")["balance"]==975_000
    with pytest.raises(Denied): agent.resolve(record["investigation_id"])

def test_document_evidence_gap_holds_and_cannot_reprocess(env):
    store,agent,case=investigation_env(env)
    store.db.execute("UPDATE replication_documents SET s4_amount=26000 WHERE document_id='SYN-FI-004'")
    store.db.commit()
    record=agent.run(agent.start(case["case_id"])["investigation_id"])
    assert record["status"]=="held" and record["diagnosis"]["classification"]=="evidence_gap"
    assert store.source_for_period("cfin","2026-11")["balance"]==975_000

def test_investigation_rejects_zero_stale_and_unbound_agent(env):
    store,runtime,_=env
    case=runtime.reconcile(request())
    with pytest.raises(Denied,match="binding"): InvestigationSimulator(store).start(case["case_id"])
    FoundrySimulator(store).create(AgentManifest(version="investigation-test",tool_bindings=["sap.read","sap.compare","databricks.read"]))
    zero=runtime.reconcile(request().model_copy(update={"period":"2026-02"}))
    with pytest.raises(Denied,match="nonzero"): InvestigationSimulator(store).start(zero["case_id"])
    stale=runtime.reconcile(request().model_copy(update={"period":"2026-03"}))
    with pytest.raises(Denied,match="nonzero"): InvestigationSimulator(store).start(stale["case_id"])
    with pytest.raises(Denied,match="profile"): InvestigationSimulator(store).start(case["case_id"],"unknown")

def test_source_change_after_case_holds_investigation(env):
    store,agent,case=investigation_env(env)
    fixture=store.get_state("fixture");fixture["cfin"]["balance"]+=1;store.set_state("fixture",fixture)
    record=agent.run(agent.start(case["case_id"])["investigation_id"])
    assert record["status"]=="held" and "rerun reconciliation" in record["reason"]
    assert not record["proposed_action"]

def test_reprocess_requires_operator_and_current_source(env):
    store,agent,case=investigation_env(env)
    record=agent.run(agent.start(case["case_id"])["investigation_id"])
    with pytest.raises(Denied,match="operator"): agent.resolve(record["investigation_id"],"finance.user")
    fixture=store.get_state("fixture");fixture["bw"]["balance"]+=1;store.set_state("fixture",fixture)
    with pytest.raises(Denied,match="changed"): agent.resolve(record["investigation_id"])
    assert store.comparison_documents("2026-11")[-1]["aif_status"]=="ready_for_reprocess"

def test_investigation_blocks_variance_marker_and_explains_proof(env):
    store,agent,case=investigation_env(env)
    record=agent.run(agent.start(case["case_id"])["investigation_id"])
    with pytest.raises(Denied,match="investigation is active"): ApprovalSimulator(store).propose(case["case_id"])
    answer=answer_follow_up(store,ApprovalSimulator(store),"What did the investigation find?",case["case_id"],"S1")
    assert answer["kind"]=="investigation_status" and "SYN-FI-004" in answer["answer"] and "25,000 USD" in answer["answer"]
    resolved=agent.resolve(record["investigation_id"])
    after_answer=answer_follow_up(store,ApprovalSimulator(store),"Show proof dossier",resolved["after"]["case_id"],"S1")
    assert "after-run variance is 0 USD" in after_answer["answer"]

def test_reprocess_rejects_changed_evidence_with_same_balance(env):
    store,agent,case=investigation_env(env)
    record=agent.run(agent.start(case["case_id"])["investigation_id"])
    fixture=store.get_state("fixture");fixture["cfin"]["evidence_id"]="SYN-CHANGED";store.set_state("fixture",fixture)
    with pytest.raises(Denied,match="evidence changed"): agent.resolve(record["investigation_id"])
    assert store.comparison_documents("2026-11")[-1]["aif_status"]=="ready_for_reprocess"

def test_investigation_api_and_chat_return_trace(env,monkeypatch):
    from fastapi.testclient import TestClient
    module=importlib.import_module("poc.app")
    store,runtime,_=env
    FoundrySimulator(store).create(AgentManifest(version="investigation-test",tool_bindings=["sap.read","sap.compare","databricks.read","sap.post"]))
    case=runtime.reconcile(request())
    monkeypatch.setattr(module,"store",store)
    monkeypatch.setattr(module,"runtime",runtime)
    monkeypatch.setattr(module,"foundry",FoundrySimulator(store))
    monkeypatch.setattr(module,"investigator",InvestigationSimulator(store))
    client=TestClient(module.app)
    answer=client.post("/api/chat",json={"message":"Investigate this variance","case_id":case["case_id"]}).json()
    assert answer["status"]=="running" and answer["trace_case_id"]==case["case_id"]
    investigation_id=answer["investigation"]["investigation_id"]
    for _ in range(100):
        record=client.get(f"/api/investigations/{investigation_id}").json()
        if record["status"]!="running":break
        time.sleep(.05)
    assert record["status"]=="action_proposed"
    resolved=client.post(f"/api/investigations/{investigation_id}/reprocess",json={"operator_id":"finance.operator"}).json()
    assert resolved["after"]["variance"]["amount"]=="0"


def test_out_of_range_period_and_posting_request_are_refused(tmp_path):
    parsed, assumed, follow_up = request_for_demo("Reconcile Dec 2030", {"period": "2026-01"})
    assert parsed is None and "outside the 12-month synthetic history" in follow_up
    parsed, _, follow_up = request_for_demo("Reconcile 2027-03", {"period": "2026-01"})
    assert parsed is None and "2027-03" in follow_up
    answer = answer_follow_up(Store(tmp_path / "refuse.sqlite3"), None, "Post a journal entry to SAP for Nov 2026", None, "S1")
    assert answer["kind"] == "posting_refused" and "does not post to SAP" in answer["answer"]


def test_detailed_report_adds_up_for_every_period(tmp_path):
    from poc.history import PERIODS
    from poc.recon_report import build_report
    store = Store(tmp_path / "report.sqlite3")
    for period in PERIODS:
        report = build_report(store, period)
        summary = report["summary"]
        assert summary["s4_total"] - summary["cfin_total"] == summary["variance"]
        assert sum(item["difference"] for item in report["items"]) == summary["variance"]
        assert sum(a["difference"] for a in report["accounts"]) == summary["variance"]
        assert sum(a["cfin_balance"] for a in report["accounts"]) == summary["cfin_total"]
        assert sum(b["amount"] for b in report["aging"]) == summary["variance"]
        assert summary["explained"] + summary["unexplained"] == summary["variance"]
        assert report["bridge"][0]["value"] + sum(s["value"] for s in report["bridge"][1:-1]) == report["bridge"][-1]["value"]
        assert {c["status"] for c in report["controls"]} <= {"PASS", "HOLD", "NOT_VERIFIED"}
        assert any(c["status"] == "NOT_VERIFIED" for c in report["controls"])
        assert report["ai_review"]["advisory_only"] and "Post to SAP" in report["ai_review"]["did_not"]
    november = build_report(store, "2026-11")
    assert [i["document_id"] for i in november["items"]] == ["SYN-FI-004"]
    assert november["summary"]["variance"] == 25000 and november["summary"]["status"] == "EXPLAINED"
    assert build_report(store, "2025-12")["summary"]["status"] == "BALANCED"
    assert build_report(store, "2026-03")["summary"]["status"] == "HOLD"


def test_report_residual_is_unexplained_after_balance_change(tmp_path):
    from poc.recon_report import build_report
    store = Store(tmp_path / "residual.sqlite3")
    store.mutate_period_source("2026-11", "cfin", "balance", 960000)
    report = build_report(store, "2026-11")
    assert sum(i["difference"] for i in report["items"]) == report["summary"]["variance"] == 40000
    assert report["summary"]["unexplained"] == 15000 and report["summary"]["status"] == "EXCEPTION"


def test_report_endpoint_and_rejects_unknown_period():
    from fastapi.testclient import TestClient
    import poc.app as application
    client = TestClient(application.app)
    ok = client.get("/api/reports/2026-11")
    assert ok.status_code == 200 and ok.json()["report_id"] == "RPT-2026-11"
    assert client.get("/api/reports/2030-01").status_code in (400, 403, 404, 409, 422)


def test_close_conditions_change_the_report_and_restore(tmp_path):
    from poc.recon_report import apply_condition, build_report, CONDITIONS
    store = Store(tmp_path / "conditions.sqlite3")
    base = build_report(store, "2026-11")["summary"]
    apply_condition(store, "2026-11", "late_posting")
    late = build_report(store, "2026-11")
    assert late["summary"]["variance"] == 43000 and late["summary"]["unexplained"] == 18000 and late["summary"]["status"] == "EXCEPTION"
    apply_condition(store, "2026-11", "clean_close")
    clean = build_report(store, "2026-11")
    assert clean["summary"]["variance"] == 0 and clean["items"] == [] and clean["summary"]["status"] == "BALANCED"
    for key in ("late_replication", "bw_delay", "pipeline_lag"):
        apply_condition(store, "2026-11", "baseline")
        apply_condition(store, "2026-11", key)
        assert build_report(store, "2026-11")["summary"]["status"] == "HOLD"
    apply_condition(store, "2026-11", "baseline")
    assert build_report(store, "2026-11")["summary"] == base
    apply_condition(store, "2026-03", "baseline")
    assert build_report(store, "2026-03")["summary"]["status"] == "HOLD"
    assert set(CONDITIONS) >= {"baseline", "clean_close", "late_replication", "late_posting"}


def test_condition_endpoint_guards():
    from fastapi.testclient import TestClient
    import poc.app as application
    client = TestClient(application.app)
    assert client.post("/api/conditions", json={"condition": "clean_close", "operator_id": "intruder"}).status_code == 403
    assert client.post("/api/conditions", json={"condition": "nonsense"}).status_code in (400, 403, 404, 409, 422)
    ok = client.post("/api/conditions", json={"condition": "late_posting"})
    assert ok.status_code == 200 and client.get("/api/reports/2026-11").json()["summary"]["unexplained"] == 18000
    assert client.post("/api/conditions", json={"condition": "baseline"}).status_code == 200
