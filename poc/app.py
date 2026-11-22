from __future__ import annotations

import asyncio
import json
import uuid
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import FastAPI,HTTPException,Query,Header
from fastapi.responses import FileResponse,StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .approval import ApprovalSimulator
from .demos import KINDS,run_failure
from .contracts import AgentManifest,ApprovalDecision,ReconciliationRequest
from .foundry import FoundrySimulator
from .gateway import select_gateway
from .identity import sign_in
from .investigation import InvestigationSimulator
from .contracts import ToolCall
from .registry import components,edges,write_registries
from .runtime import RuntimeSimulator
from .intents import parse_reconciliation
from .questions import answer_follow_up, request_for_demo, mentioned_period, trace_question
from .architecture_view import architecture_registry, architecture_events
from .store import Denied,Store

ROOT=Path(__file__).resolve().parents[1]
write_registries()
store=Store()
store.recover_interrupted_runs()
foundry=FoundrySimulator(store)
runtime=RuntimeSimulator(store)
approval=ApprovalSimulator(store)
investigator=InvestigationSimulator(store)
app=FastAPI(title="Synthetic Finance Reconciliation POC",version="0.1.0")
run_pool=ThreadPoolExecutor(max_workers=2,thread_name_prefix="synthetic-architecture-run")
WEB_BUILD=ROOT/"frontend"/"dist"
if WEB_BUILD.exists():
    app.mount("/assets",StaticFiles(directory=WEB_BUILD/"assets"),name="frontend-assets")

def ensure_demo_agent():
    active=foundry.active()
    if not active or "sap.compare" not in active["manifest"]["tool_bindings"]:
        foundry.create(AgentManifest(version="demo-3.0",tool_bindings=["sap.read","sap.compare","databricks.read","sap.post"]))

class ChatInput(BaseModel):
    message:str
    scenario:str="S1"
    user_id:str="finance.user"
    case_id:str|None=None
    demo_pace_ms:int=80

class Mutation(BaseModel):
    source:str
    period:str="2026-11"
    field:str
    value:int|str|bool
    operator_id:str="finance.operator"

class ProposalInput(BaseModel):
    case_id:str
    rationale:str="Investigate synthetic variance"

class InvestigationInput(BaseModel):
    case_id:str
    fault_profile:str="replication_gap"

class ReprocessInput(BaseModel):
    operator_id:str="finance.operator"

class DecisionInput(BaseModel):
    proposal_id:str
    approver_id:str="finance.approver"
    approved:bool
    callback_id:str|None=None
    payload_hash:str|None=None
    case_version:int|None=None
    ambiguous:bool=False

def fail(exc):
    raise HTTPException(status_code=403 if isinstance(exc,Denied) else 400,detail=str(exc))

@app.get("/")
def index(): return FileResponse(WEB_BUILD/"index.html" if (WEB_BUILD/"index.html").exists() else ROOT/"static"/"index.html")

@app.get("/static/{name}")
def static(name:str):
    if name not in ("app.css","app.js","architecture.css","architecture.js"): raise HTTPException(404)
    return FileResponse(ROOT/"static"/name)

@app.get("/api/health")
def health(): return {"status":"ready","simulation":True,"database":str(store.path),"component_count":len(components()),"edge_count":len(edges())}

@app.get("/api/registry")
def registry(): return {"components":components(),"edges":edges(),"gates":{f"G{i}":"OPEN — live vendor proof required" for i in range(1,8)}}

@app.get("/api/architecture/registry")
def neutral_registry(): return architecture_registry()

@app.get("/api/architecture/events")
def neutral_events(case_id:str,after:int=0): return architecture_events(store.events(case_id,after))

@app.get("/api/bootstrap")
def bootstrap():
    return {"history":history(),"cases":store.cases()[:20],"agent":foundry.active(),
            "architecture":architecture_registry(),"simulation":True}

@app.get("/api/agents")
def agents(): return {"active":foundry.active()}

@app.post("/api/agents")
def create_agent(manifest:AgentManifest):
    try: return foundry.create(manifest)
    except Exception as exc: fail(exc)

@app.post("/api/reconcile")
def reconcile(req:ReconciliationRequest):
    try: return runtime.reconcile(req)
    except Exception as exc: fail(exc)

@app.get("/api/history")
def history():
    return {"label":"SYNTHETIC MONTHLY HISTORY","periods":store.history_overview(),
            "available_periods":store.available_periods(),"account_count":6,
            "source_count":4,"journal_records_per_month":12}

@app.get("/api/history/{period}")
def history_detail(period:str):
    try: return store.history_detail(period)
    except Exception as exc: fail(exc)

@app.post("/api/runs",status_code=202)
def start_architecture_run(data:ChatInput):
    parsed,assumed,follow_up=request_for_demo(data.message)
    if follow_up: return {"follow_up":follow_up,"synthetic":True}
    if data.demo_pace_ms<0 or data.demo_pace_ms>150: raise HTTPException(400,"Demo pace must be 0–150 ms")
    try:
        ensure_demo_agent()
        request=ReconciliationRequest(scenario=data.scenario,user_id=data.user_id,**parsed)
        if request.period not in store.available_periods(): raise Denied("No synthetic finance history for requested period")
        case_id=f"case-{uuid.uuid4().hex[:10]}"
        scope=request.model_dump(include={"company_code","ledger","period","currency"})
        store.save_case(case_id,request.scenario,request.user_id,scope,status="queued")
        run_pool.submit(runtime.reconcile,request,case_id=case_id,demo_pace_ms=data.demo_pace_ms)
        return {"case_id":case_id,"trace_id":f"trace-{case_id}","scenario":request.scenario,
                "status":"queued","scope":scope,"assumed_fields":assumed,"synthetic":True}
    except Exception as exc: fail(exc)

@app.get("/api/runs/{case_id}/stream")
async def architecture_stream(case_id:str,after:int=0,last_event_id:str|None=Header(default=None)):
    if not store.case(case_id): raise HTTPException(404,"Unknown case")
    async def stream_rows():
        cursor=max(after,int(last_event_id)) if last_event_id and last_event_id.isdigit() else after
        while True:
            rows=store.events(case_id,cursor)
            for event in rows:
                cursor=event["seq"]
                yield f"id: {cursor}\nevent: flow\ndata: {json.dumps(event)}\n\n"
            current=store.case(case_id)
            if current and current["status"] in ("complete","denied","interrupted"):
                yield f"event: complete\ndata: {json.dumps(current)}\n\n"
                return
            yield ": waiting for persisted flow\n\n"
            await asyncio.sleep(.15)
    return StreamingResponse(stream_rows(),media_type="text/event-stream",headers={"Cache-Control":"no-cache"})

@app.get("/api/architecture/runs/{case_id}/stream")
async def neutral_architecture_stream(case_id:str,after:int=0,last_event_id:str|None=Header(default=None)):
    if not store.case(case_id): raise HTTPException(404,"Unknown case")
    async def stream_rows():
        cursor=max(after,int(last_event_id)) if last_event_id and last_event_id.isdigit() else after
        while True:
            for event in architecture_events(store.events(case_id,cursor)):
                cursor=event["seq"]
                yield f"id: {cursor}\nevent: flow\ndata: {json.dumps(event)}\n\n"
            current=store.case(case_id)
            if current and current["status"] in ("complete","denied","interrupted"):
                yield f"event: complete\ndata: {json.dumps({'case_id':case_id,'status':current['status']})}\n\n"
                return
            await asyncio.sleep(.15)
    return StreamingResponse(stream_rows(),media_type="text/event-stream",headers={"Cache-Control":"no-cache"})

@app.post("/api/chat")
def chat(data:ChatInput):
    msg=data.message.lower().strip()
    if msg.startswith("investigate"):
        if not data.case_id or not store.case(data.case_id):
            trace_case=trace_question(store,data.scenario,data.case_id,"investigation_needs_case","needs_case")
            return {"kind":"investigation","status":"needs_case","answer":"Run a comparable November 2026 reconciliation first, then investigate its document variance.","trace_case_id":trace_case,"synthetic":True}
        try:
            ensure_demo_agent()
            record=investigator.start(data.case_id,"replication_gap")
            run_pool.submit(investigator.run,record["investigation_id"])
            return {"kind":"investigation","status":"running","answer":"Document investigation started. The proof dossier will update as the agent tests each step.","case_id":data.case_id,"trace_case_id":data.case_id,"investigation":record,"synthetic":True}
        except Exception as exc: fail(exc)
    if "reconcil" in msg or (mentioned_period(msg) and "variance" in msg):
        current=store.case(data.case_id) if data.case_id else None
        parsed,assumed,follow_up=request_for_demo(data.message,current["scope"] if current else None)
        if follow_up:
            trace_case=trace_question(store,data.scenario,data.case_id,"clarification","needs_scope")
            return {"kind":"clarification","status":"needs_scope","answer":follow_up,"case_id":data.case_id,"trace_case_id":trace_case,"synthetic":True}
        if parsed["period"] not in store.available_periods() or parsed["company_code"]!="1000" or parsed["ledger"]!="0L":
            answer="This synthetic demo contains December 2025 through November 2026 for its one documented finance scope. I cannot reconcile the requested scope from this dataset."
            trace_case=trace_question(store,data.scenario,data.case_id,"scope_limit","limited")
            return {"kind":"scope_limit","status":"limited","answer":answer,"case_id":data.case_id,"trace_case_id":trace_case,"synthetic":True}
        try:
            ensure_demo_agent()
            result=runtime.reconcile(ReconciliationRequest(scenario=data.scenario,user_id=data.user_id,**parsed))
            variance=result["variance"]
            answer=(f"Reconciliation for {parsed['period']}: {int(variance['amount']):,} USD variance."
                    if variance["amount"] is not None else f"Reconciliation for {parsed['period']}: {variance['state']}; no comparable amount.")
            if assumed: answer+=f" Used the demo's synthetic {', '.join(assumed)}."
            return {"kind":"reconciliation","status":"answered","answer":answer,"case_id":result["case_id"],
                    "trace_case_id":result["case_id"],"scenario":result["scenario"],"result":result,"assumed_fields":assumed,"synthetic":True}
        except Exception as exc: fail(exc)
    try: return answer_follow_up(store,approval,data.message,data.case_id,data.scenario)
    except Exception as exc: fail(exc)

@app.get("/api/cases")
def cases(): return store.cases()

@app.get("/api/cases/{case_id}")
def case(case_id:str):
    result=store.case(case_id)
    if not result: raise HTTPException(404)
    return result

@app.get("/api/events")
def events(case_id:str|None=None,after:int=0): return store.events(case_id,after)

@app.get("/api/events/stream")
async def stream(case_id:str|None=None,after:int=0):
    async def rows():
        cursor=after
        while True:
            for event in store.events(case_id,cursor):
                cursor=event["seq"]
                yield f"id: {cursor}\ndata: {json.dumps(event)}\n\n"
            await asyncio.sleep(0.5)
    return StreamingResponse(rows(),media_type="text/event-stream")

@app.get("/api/audit/{case_id}")
def audit(case_id:str):
    if not store.case(case_id): raise HTTPException(404)
    return {"label":"SYNTHETIC REDACTED POC AUDIT","case":store.case(case_id),"events":store.events(case_id),"component_telemetry":store.telemetry(case_id)}

@app.get("/api/telemetry/{case_id}")
def telemetry(case_id:str):
    if not store.case(case_id): raise HTTPException(404)
    return {"case_id":case_id,"component_logs":store.telemetry(case_id),"note":"Local correlation of simulated component logs; no shared vendor-native service"}

@app.get("/api/fixture")
def fixture(): return {"label":"SYNTHETIC","sources":store.get_state("fixture")}

@app.post("/api/bdc/enable")
def enable_bdc(enabled:bool=Query(...)):
    fixture=store.get_state("fixture")
    fixture["bdc_enabled"]=enabled
    store.set_state("fixture",fixture)
    store.emit("fixture","S1","bdc_connect","observability","future_sharing_toggle","finance.operator","ok","future","event",{"enabled":enabled,"status":"FUTURE / SIMULATED","physical_copy":False},"allow")
    return {"enabled":enabled,"status":"FUTURE / SIMULATED","interoperability_proven":False}

@app.post("/api/bdc/{case_id}")
def read_bdc(case_id:str):
    case=store.case(case_id)
    if not case: raise HTTPException(404,"Unknown case")
    try:
        identity=sign_in(case["user_id"])
        call=ToolCall(name="bdc.read",case_id=case_id,arguments={"scope":case["scope"]})
        return select_gateway(store,case["scenario"]).invoke(call,identity,case["scope"])
    except Exception as exc: fail(exc)

@app.post("/api/fixture/mutate")
def mutate(change:Mutation):
    if change.operator_id!="finance.operator": raise HTTPException(403,"Synthetic operator role required")
    allow={"s4":{"balance","deny"},"cfin":{"balance","replication_status","deny"},"bw":{"balance","load_status","deny"},"databricks":{"balance","pipeline_status","uc_grant"}}
    if change.source not in allow or change.field not in allow[change.source]: raise HTTPException(400,"Unsupported source field")
    if any(c["status"] in ("queued","running") for c in store.cases()): raise HTTPException(409,"Wait for the active run before changing source data")
    try:
        result=store.mutate_period_source(change.period,change.source,change.field,change.value)
        store.emit("fixture", "S1",change.source,"observability","synthetic_source_change",change.operator_id,"ok","data","event",{"period":change.period,"source":change.source,"field":change.field,"before":result["before"],"after":change.value,"pull_based":True},"allow")
        return result
    except Exception as exc: fail(exc)

@app.post("/api/fixture/reset")
def reset():
    if any(c["status"] in ("queued","running") for c in store.cases()):
        raise HTTPException(409,"Wait for the active synthetic run before resetting")
    return {"sources":store.reset(),"synthetic":True}

@app.get("/api/proposals")
def proposals(): return store.proposals()

@app.post("/api/investigations",status_code=202)
def start_investigation(data:InvestigationInput):
    try:
        ensure_demo_agent()
        record=investigator.start(data.case_id,data.fault_profile)
        run_pool.submit(investigator.run,record["investigation_id"])
        return record
    except Exception as exc: fail(exc)

@app.get("/api/investigations")
def investigations(case_id:str|None=None): return store.investigations(case_id)

@app.get("/api/investigations/{investigation_id}")
def investigation(investigation_id:str):
    record=store.investigation(investigation_id)
    if not record: raise HTTPException(404,"Unknown synthetic investigation")
    return record

@app.post("/api/investigations/{investigation_id}/reprocess")
def simulated_reprocess(investigation_id:str,data:ReprocessInput):
    try: return investigator.resolve(investigation_id,data.operator_id)
    except Exception as exc: fail(exc)

@app.post("/api/proposals")
def propose(data:ProposalInput):
    try: return approval.propose(data.case_id,data.rationale)
    except Exception as exc: fail(exc)

@app.post("/api/decisions")
def decide(data:DecisionInput):
    proposal=store.proposal(data.proposal_id)
    if not proposal: raise HTTPException(404,"Unknown proposal")
    decision=ApprovalDecision(proposal_id=data.proposal_id,approver_id=data.approver_id,approved=data.approved,callback_id=data.callback_id or str(uuid.uuid4()),payload_hash=data.payload_hash or proposal["payload_hash"],case_version=data.case_version if data.case_version is not None else proposal["case_version"])
    try: return approval.decide(decision,data.ambiguous)
    except Exception as exc: fail(exc)

@app.post("/api/compare")
def compare():
    from .store import Store
    sample=Store(Path(":memory:"))
    FoundrySimulator(sample).create(AgentManifest(version="comparison-1.0",tool_bindings=["sap.read","databricks.read","sap.post"]))
    isolated_runtime=RuntimeSimulator(sample)
    results=[isolated_runtime.reconcile(ReconciliationRequest(scenario=scenario,company_code="1000",ledger="0L",period="2026-11",currency="USD")) for scenario in ("S1","S2")]
    traces=[sample.events(r["case_id"]) for r in results]
    gateway_hops=[[e["operation"] for e in events if "gateway" in e["source_component_id"] or "gateway" in e["target_component_id"] or "apigee" in e["source_component_id"] or "apigee" in e["target_component_id"]] for events in traces]
    return {"equivalent":results[0]["variance"]==results[1]["variance"],"results":results,"gateway_hops":gateway_hops,"synthetic":True}

@app.get("/api/failures")
def failure_kinds(): return {"kinds":KINDS}

@app.post("/api/failures/{kind}")
def failure_demo(kind:str):
    try: return run_failure(kind)
    except Exception as exc: fail(exc)
