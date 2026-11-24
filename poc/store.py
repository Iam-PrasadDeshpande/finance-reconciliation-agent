from __future__ import annotations

import json
import os
import sqlite3
import threading
import time
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Callable

from .contracts import FlowEvent
from .history import PERIODS,WEIGHTS,create_tables,seed_history,source_snapshot,period_overview

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = Path(os.environ.get("POC_DB_PATH", ROOT / "poc_state.sqlite3"))

def compact(value: Any) -> str:
    return json.dumps(value,sort_keys=True,default=str,separators=(",",":"))

class Denied(Exception):
    pass

class Store:
    def __init__(self,path: Path=DB_PATH):
        self.path=Path(path)
        self.lock=threading.RLock()
        self.thread_state=threading.local()
        self.db=sqlite3.connect(self.path,check_same_thread=False)
        self.db.row_factory=sqlite3.Row
        self.fixed_clock=os.environ.get("POC_FIXED_CLOCK_UTC")
        self.clock_step=0
        self.db.executescript("""
          CREATE TABLE IF NOT EXISTS events(seq INTEGER PRIMARY KEY AUTOINCREMENT,event_id TEXT UNIQUE,case_id TEXT,trace_id TEXT,record TEXT);
          CREATE TABLE IF NOT EXISTS component_logs(component_id TEXT,case_id TEXT,event_id TEXT,operation TEXT,status TEXT,PRIMARY KEY(component_id,event_id));
          CREATE TABLE IF NOT EXISTS cases(case_id TEXT PRIMARY KEY,scenario TEXT,user_id TEXT,version INTEGER,scope TEXT,result TEXT,status TEXT);
          CREATE TABLE IF NOT EXISTS state(key TEXT PRIMARY KEY,value TEXT);
          CREATE TABLE IF NOT EXISTS agents(version TEXT PRIMARY KEY,manifest TEXT,receipt TEXT,active INTEGER);
          CREATE TABLE IF NOT EXISTS proposals(proposal_id TEXT PRIMARY KEY,case_id TEXT,payload TEXT,status TEXT);
          CREATE TABLE IF NOT EXISTS callbacks(callback_id TEXT PRIMARY KEY,proposal_id TEXT);
          CREATE TABLE IF NOT EXISTS journals(document_number TEXT PRIMARY KEY,proposal_id TEXT UNIQUE,payload TEXT);
          CREATE TABLE IF NOT EXISTS replication_documents(document_id TEXT PRIMARY KEY,period TEXT,s4_amount INTEGER,cfin_amount INTEGER,mapping_status TEXT,aif_status TEXT,evidence_id TEXT);
          CREATE TABLE IF NOT EXISTS investigations(investigation_id TEXT PRIMARY KEY,case_id TEXT,record TEXT);
        """)
        create_tables(self.db)
        self.db.commit()
        if self.get_state("fixture") is None: self.reset()
        else:
            seed_history(self.db)
            self.seed_replication_documents()

    def seed_replication_documents(self):
        with self.lock:
            if self.db.execute("SELECT 1 FROM replication_documents LIMIT 1").fetchone(): return
            self.db.executemany("INSERT INTO replication_documents VALUES (?,?,?,?,?,?,?)",[
                ("SYN-FI-001","2026-11",400000,400000,"mapped","replicated","SYN-CMP-001"),
                ("SYN-FI-002","2026-11",350000,350000,"mapped","replicated","SYN-CMP-002"),
                ("SYN-FI-003","2026-11",225000,225000,"mapped","replicated","SYN-CMP-003"),
                ("SYN-FI-004","2026-11",25000,0,"mapped","ready_for_reprocess","SYN-CMP-004"),
            ])
            self.db.commit()

    def recover_interrupted_runs(self):
        with self.lock:
            self.db.execute("UPDATE cases SET status='interrupted', result=? WHERE status IN ('queued','running')",(compact({"error":"Local process stopped before completion","synthetic":True}),))
            self.db.commit()

    def get_state(self,key:str):
        with self.lock: row=self.db.execute("SELECT value FROM state WHERE key=?",(key,)).fetchone()
        return json.loads(row[0]) if row else None

    def set_state(self,key:str,value:Any):
        with self.lock:
            self.db.execute("INSERT OR REPLACE INTO state VALUES (?,?)",(key,compact(value)))
            self.db.commit()

    def reset(self):
        with self.lock:
            self.clock_step=0
            self.db.executescript("DELETE FROM events; DELETE FROM component_logs; DELETE FROM cases; DELETE FROM state; DELETE FROM proposals; DELETE FROM callbacks; DELETE FROM journals; DELETE FROM agents; DELETE FROM period_balances; DELETE FROM journal_fixtures; DELETE FROM replication_documents; DELETE FROM investigations;")
            fixture={
              "s4":{"balance":1000000,"timestamp_utc":"2026-11-30T18:00:00+00:00","evidence_id":"SYN-S4-GL-001","journals":[{"id":"SYN-J-001","amount":1000000}],"deny":False},
              "cfin":{"balance":975000,"timestamp_utc":"2026-11-30T18:05:00+00:00","evidence_id":"SYN-CFIN-001","replication_status":"current","source_mapping":"ERP-A:1000->1000","deny":False},
              "bw":{"balance":975000,"timestamp_utc":"2026-11-30T18:10:00+00:00","evidence_id":"SYN-BW-001","load_status":"current","hierarchy":"H-2026-11","deny":False},
              "databricks":{"balance":975000,"timestamp_utc":"2026-11-30T18:15:00+00:00","evidence_id":"SYN-DBX-001","pipeline_status":"current","uc_grant":True},
              "bdc_enabled":False,
            }
            self.set_state("fixture",fixture)
            self.set_state("tick",0)
            seed_history(self.db)
            self.seed_replication_documents()
            self.db.commit()
        return fixture

    def available_periods(self): return list(PERIODS)

    def history_overview(self):
        with self.lock: return period_overview(self.db)

    def history_detail(self,period:str):
        if period not in PERIODS: raise Denied("No synthetic finance history for requested period")
        with self.lock:
            balances=[dict(row) for row in self.db.execute("""SELECT source,account,balance,currency,timestamp_utc,evidence_id,freshness
                     FROM period_balances WHERE period=? ORDER BY source,account""",(period,)).fetchall()]
            journals=[dict(row) for row in self.db.execute("""SELECT journal_id,account,amount,currency,description,timestamp_utc
                     FROM journal_fixtures WHERE period=? ORDER BY journal_id""",(period,)).fetchall()]
        return {"period":period,"company_code":"1000","ledger":"0L","currency":"USD","balances":balances,"journals":journals,"synthetic":True}

    def mutate_period_source(self,period:str,source:str,field:str,value):
        if period not in PERIODS: raise Denied("No synthetic finance history for requested period")
        if source not in ("s4","cfin","bw","databricks"): raise Denied("Unknown synthetic source")
        if field in ("deny","uc_grant") and period!="2026-11": raise Denied("This control is available only for the November fixture")
        current=self.source_for_period(source,period)
        old=current.get(field)
        if field=="balance":
            if not isinstance(value,int) or isinstance(value,bool) or value<0: raise Denied("Balance must be a nonnegative integer")
            amounts=[value*w//100 for w in WEIGHTS[:-1]]
            amounts.append(value-sum(amounts))
            stamp=datetime.now(timezone.utc).isoformat()
            with self.lock:
                accounts=[row[0] for row in self.db.execute("SELECT account FROM period_balances WHERE period=? AND source=? ORDER BY account",(period,source)).fetchall()]
                for account,amount in zip(accounts,amounts):
                    self.db.execute("UPDATE period_balances SET balance=?,timestamp_utc=? WHERE period=? AND source=? AND account=?",(amount,stamp,period,source,account))
                self.db.commit()
        elif field in ("replication_status","load_status","pipeline_status"):
            if value not in ("current","stale","error"): raise Denied("Invalid freshness state")
            freshness="current" if value=="current" else "stale"
            with self.lock:
                self.db.execute("UPDATE period_balances SET freshness=? WHERE period=? AND source=?",(freshness,period,source))
                self.db.commit()
        elif field not in ("deny","uc_grant"): raise Denied("Unsupported synthetic source field")
        if period=="2026-11":
            fixture=self.get_state("fixture")
            fixture[source][field]=value
            fixture[source]["timestamp_utc"]=datetime.now(timezone.utc).isoformat()
            self.set_state("fixture",fixture)
        return {"period":period,"source":source,"field":field,"before":old,"after":value,"next_read":"pull based","synthetic":True}

    def source_for_period(self,source:str,period:str):
        with self.lock:
            data=source_snapshot(self.db,period,source)
            if data is None: return None
            if period=="2026-11":
                fixture=self.get_state("fixture")[source]
                for key in ("balance","timestamp_utc","evidence_id","replication_status","load_status","pipeline_status","uc_grant","deny","source_mapping"):
                    if key in fixture: data[key]=fixture[key]
                data["freshness"]=("current" if all(fixture.get(k,"current")=="current" for k in ("replication_status","load_status","pipeline_status")) else "stale")
            return data

    def comparison_documents(self,period:str):
        if period!="2026-11": raise Denied("Document comparison is seeded for November 2026 only")
        with self.lock:
            return [dict(row) for row in self.db.execute("SELECT * FROM replication_documents WHERE period=? ORDER BY document_id",(period,)).fetchall()]

    def investigation(self,investigation_id:str):
        with self.lock: row=self.db.execute("SELECT record FROM investigations WHERE investigation_id=?",(investigation_id,)).fetchone()
        return json.loads(row[0]) if row else None

    def investigations(self,case_id:str|None=None):
        with self.lock:
            rows=self.db.execute("SELECT record FROM investigations WHERE case_id=? ORDER BY rowid DESC",(case_id,)).fetchall() if case_id else self.db.execute("SELECT record FROM investigations ORDER BY rowid DESC").fetchall()
        return [json.loads(row[0]) for row in rows]

    def save_investigation(self,record:dict):
        with self.lock:
            self.db.execute("INSERT OR REPLACE INTO investigations VALUES (?,?,?)",(record["investigation_id"],record["case_id"],compact(record)))
            self.db.commit()

    def apply_replication_reprocess(self,document_id:str,expected_balances:dict):
        with self.lock:
            rows=self.comparison_documents("2026-11")
            missing=next((row for row in rows if row["document_id"]==document_id),None)
            if not missing or missing["mapping_status"]!="mapped" or missing["aif_status"]!="ready_for_reprocess" or missing["cfin_amount"]!=0: raise Denied("Document is not eligible for synthetic reprocessing")
            for source,expected in expected_balances.items():
                current=self.source_for_period(source,"2026-11")
                if current["balance"]!=expected or current["freshness"]!="current" or current.get("deny") or (source=="databricks" and not current.get("uc_grant")): raise Denied(f"{source} source changed before synthetic reprocess")
            fixture=self.get_state("fixture")
            stamp=datetime.now(timezone.utc).isoformat()
            delta=missing["s4_amount"]
            after={}
            accounts_by_source={source:[row[0] for row in self.db.execute("SELECT account FROM period_balances WHERE period='2026-11' AND source=? ORDER BY account",(source,)).fetchall()] for source in ("cfin","bw","databricks")}
            if any(len(accounts)!=len(WEIGHTS) for accounts in accounts_by_source.values()): raise Denied("Synthetic account allocation is incomplete")
            try:
                for source in ("cfin","bw","databricks"):
                    total=expected_balances[source]+delta
                    amounts=[total*w//100 for w in WEIGHTS[:-1]]
                    amounts.append(total-sum(amounts))
                    for account,amount in zip(accounts_by_source[source],amounts):
                        self.db.execute("UPDATE period_balances SET balance=?,timestamp_utc=? WHERE period='2026-11' AND source=? AND account=?",(amount,stamp,source,account))
                    fixture[source]["balance"]=total
                    fixture[source]["timestamp_utc"]=stamp
                    fixture[source]["evidence_id"]=f"SYN-{source.upper()}-REFRESH-{document_id}"
                    after[source]=total
                self.db.execute("UPDATE replication_documents SET cfin_amount=s4_amount,aif_status='replicated' WHERE document_id=?",(document_id,))
                self.db.execute("UPDATE state SET value=? WHERE key='fixture'",(compact(fixture),))
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise
            return {"document_id":document_id,"before":{source:expected_balances[source] for source in after},"after":after,"evidence_id":"SYN-REPROCESS-"+document_id,"synthetic":True}

    def tick(self):
        n=self.get_state("tick") or 0
        self.set_state("tick",n+1)
        return n+1

    def emit(self,case_id:str,scenario:str,source:str,target:str,operation:str,actor:str,status:str,flow_type:str,direction:str,summary:dict|None=None,decision:str="n/a",parent:str|None=None,payload_hash:str|None=None,case_version:int|None=None,duration_ms:int=0):
        # Summaries are constructed by callers from allowlisted scalar fields.
        agent_ctx=getattr(self.thread_state,"agent_ctx",None)
        if agent_ctx: summary={**(summary or {}),**agent_ctx}
        if self.fixed_clock:
            stamp=datetime.fromisoformat(self.fixed_clock.replace("Z","+00:00"))+timedelta(milliseconds=self.clock_step)
            self.clock_step+=1
        else: stamp=datetime.now(timezone.utc)
        event=FlowEvent(event_id=str(uuid.uuid4()),case_id=case_id,trace_id=f"trace-{case_id}",scenario=scenario,source_component_id=source,target_component_id=target,operation=operation,actor=actor,timestamp_utc=stamp,status=status,parent_event_id=parent,flow_type=flow_type,direction=direction,authorization_decision=decision,payload_summary=summary or {},payload_hash=payload_hash,case_version=case_version,duration_ms=duration_ms)
        with self.lock:
            self.db.execute("INSERT INTO events(event_id,case_id,trace_id,record) VALUES (?,?,?,?)",(event.event_id,case_id,event.trace_id,event.model_dump_json()))
            self.db.execute("INSERT INTO component_logs VALUES (?,?,?,?,?)",(source,case_id,event.event_id,operation,status))
            self.db.commit()
        return event.event_id

    def call(self,case_id:str,scenario:str,source:str,target:str,operation:str,actor:str,flow_type:str,summary:dict,fn:Callable[[],Any],decision:str="allow"):
        start=time.perf_counter()
        request=self.emit(case_id,scenario,source,target,operation,actor,"sent",flow_type,"request",summary,decision)
        try:
            pace=getattr(self.thread_state,"pace_ms",0)
            if pace: time.sleep(pace/1000)
            result=fn()
            safe_result={"result":"ok","synthetic":True}
            if isinstance(result,dict):
                for key in ("source","period","balance","currency","timestamp_utc","evidence_id","freshness","account_count","journal_count","amount","state","formula","evidence_ids","status","document_number"):
                    if key in result: safe_result[key]=result[key]
                if "variance" in result: safe_result["variance"]=result["variance"]
            elif isinstance(result,str) and flow_type=="model": safe_result["advisory"]=result[:180]
            if pace: time.sleep(pace/2000)
            self.emit(case_id,scenario,target,source,operation,actor,"ok",flow_type,"response",safe_result,decision,request,duration_ms=max(0,round((time.perf_counter()-start)*1000)))
            return result
        except Exception as exc:
            self.emit(case_id,scenario,target,source,operation,actor,"denied" if isinstance(exc,Denied) else "error",flow_type,"response",{"reason":str(exc)[:180],"synthetic":True},"deny",request,duration_ms=max(0,round((time.perf_counter()-start)*1000)))
            raise

    def events(self,case_id:str|None=None,after:int=0):
        with self.lock:
            if case_id:
                rows=self.db.execute("SELECT seq,record FROM events WHERE case_id=? AND seq>? ORDER BY seq",(case_id,after)).fetchall()
            else:
                rows=self.db.execute("SELECT seq,record FROM events WHERE seq>? ORDER BY seq",(after,)).fetchall()
        return [{"seq":r[0],**json.loads(r[1])} for r in rows]

    def telemetry(self,case_id:str):
        rows=self.db.execute("SELECT component_id,COUNT(*) AS event_count,MAX(operation) AS latest_operation FROM component_logs WHERE case_id=? GROUP BY component_id ORDER BY component_id",(case_id,)).fetchall()
        return [dict(r) for r in rows]

    def case(self,case_id:str):
        with self.lock: row=self.db.execute("SELECT * FROM cases WHERE case_id=?",(case_id,)).fetchone()
        return {**dict(row),"scope":json.loads(row["scope"]),"result":json.loads(row["result"]) if row["result"] else None} if row else None

    def cases(self):
        with self.lock: ids=[r[0] for r in self.db.execute("SELECT case_id FROM cases ORDER BY rowid DESC").fetchall()]
        return [self.case(case_id) for case_id in ids]

    def save_case(self,case_id,scenario,user_id,scope,result=None,status="created",version=1):
        with self.lock:
            self.db.execute("INSERT OR REPLACE INTO cases VALUES (?,?,?,?,?,?,?)",(case_id,scenario,user_id,version,compact(scope),compact(result) if result is not None else None,status))
            self.db.commit()

    def proposal(self,proposal_id):
        row=self.db.execute("SELECT payload,status FROM proposals WHERE proposal_id=?",(proposal_id,)).fetchone()
        return {**json.loads(row[0]),"status":row[1]} if row else None

    def proposals(self):
        return [self.proposal(r[0]) for r in self.db.execute("SELECT proposal_id FROM proposals ORDER BY rowid DESC").fetchall()]
