"""Streamlit-hostable entrypoint for the Node-built synthetic architecture UI.

The browser component sends typed actions to this Python session. Each viewer gets
an isolated in-memory SQLite fixture; no external finance service is called.
"""
from __future__ import annotations

import uuid
import hashlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import sys

import streamlit as st


def _reload_changed_poc_modules(root: Path) -> bool:
    """Streamlit keeps imported modules cached across reruns, so after a hosted redeploy an edited
    poc module could stay stale while new files loaded. Drop every poc module when the sources change."""
    stamp = hashlib.sha256(b"".join(path.read_bytes() for path in sorted(root.glob("*.py")))).hexdigest()
    if getattr(sys, "_finance_poc_stamp", None) == stamp:
        return False
    for name in [name for name in sys.modules if name == "poc" or name.startswith("poc.")]:
        del sys.modules[name]
    sys._finance_poc_stamp = stamp
    return True


_reload_changed_poc_modules(Path(__file__).resolve().parent / "poc")

from poc.approval import ApprovalSimulator
from poc.architecture_view import architecture_events, architecture_registry
from poc.contracts import AgentManifest, ApprovalDecision, ReconciliationRequest
from poc.foundry import FoundrySimulator
from poc.investigation import InvestigationSimulator
from poc.questions import answer_follow_up, request_for_demo, mentioned_period, trace_question
from poc.runtime import RuntimeSimulator
from poc.store import Store
from poc.decision_lab import question_catalog, start_run as start_decision_run, get_run as get_decision_run, advance_run as advance_decision_run
from poc.route_playbooks import route_playbook_catalog
from poc.agents import Context as AgentContext, catalog as agent_catalog, plan_for, run_plan
from poc.recon_report import CONDITIONS, apply_condition, build_report

ROOT = Path(__file__).resolve().parent
BUILD = ROOT / "frontend" / "dist_streamlit"
LOCAL_BUNDLE = ROOT / "static" / "finance_reconciliation_local_windows.zip"
LOCAL_BUNDLE_INFO = {
    "url": "app/static/finance_reconciliation_local_windows.zip",
    "bytes": LOCAL_BUNDLE.stat().st_size,
    "sha256": hashlib.sha256(LOCAL_BUNDLE.read_bytes()).hexdigest(),
} if LOCAL_BUNDLE.is_file() else None
BUILD_VERSION = hashlib.sha256(
    (BUILD / "finance_architecture.js").read_bytes()
    + (BUILD / "finance_architecture.css").read_bytes()
).hexdigest()[:12] if (BUILD / "finance_architecture.js").exists() and (BUILD / "finance_architecture.css").exists() else "missing"


@st.cache_resource
def worker_pool():
    return ThreadPoolExecutor(max_workers=4, thread_name_prefix="streamlit-synthetic-run")


def session():
    if "finance_store" not in st.session_state:
        store = Store(Path(":memory:"))
        st.session_state.finance_store = store
        st.session_state.finance_runtime = RuntimeSimulator(store)
        st.session_state.finance_approval = ApprovalSimulator(store)
        st.session_state.finance_investigator = InvestigationSimulator(store)
        st.session_state.finance_investigation_id = None
        st.session_state.finance_case_id = None
        st.session_state.finance_trace_id = None
        st.session_state.finance_response = None
        st.session_state.finance_response_nonce = 0
        st.session_state.finance_decision_run_id = None
        st.session_state.finance_report_period = None
        st.session_state.finance_agent_plan = None
    return st.session_state.finance_store


def publish_response(answer: dict):
    st.session_state.finance_response = answer
    st.session_state.finance_response_nonce += 1


def ensure_agent(store: Store):
    foundry = FoundrySimulator(store)
    active = foundry.active()
    if not active or "sap.compare" not in active["manifest"]["tool_bindings"]:
        foundry.create(AgentManifest(version="demo-3.0", tool_bindings=["sap.read", "sap.compare", "databricks.read", "sap.post"]))


def handle_action(action: dict):
    store = session()
    kind = action.get("type")
    try:
        if kind == "decision_run":
            record = start_decision_run(store, action.get("question_id", ""), action.get("route", "S3"), action.get("probe", ""))
            st.session_state.finance_decision_run_id = record["run_id"]
            worker_pool().submit(advance_decision_run, store, record["run_id"])
        elif kind == "run":
            parsed, assumed, follow_up = request_for_demo(action.get("message", ""))
            if follow_up:
                publish_response({"answer": follow_up, "status": "needs_scope"})
                return
            ensure_agent(store)
            request = ReconciliationRequest(scenario=action.get("scenario", "S1"), user_id="finance.user", **parsed)
            if request.period not in store.available_periods():
                raise ValueError("This synthetic period is not available")
            case_id = f"case-{uuid.uuid4().hex[:10]}"
            scope = request.model_dump(include={"company_code", "ledger", "period", "currency"})
            store.save_case(case_id, request.scenario, request.user_id, scope, status="queued")
            st.session_state.finance_case_id = case_id
            st.session_state.finance_trace_id = case_id
            st.session_state.finance_investigation_id = None
            pace = min(150, max(0, int(action.get("pace", 60))))
            worker_pool().submit(st.session_state.finance_runtime.reconcile, request, case_id=case_id, demo_pace_ms=pace)
            publish_response({"answer": f"Started synthetic {request.period} run via {request.scenario}." + (f" Demo defaults supplied {', '.join(assumed)}." if assumed else ""), "status": "running"})
        elif kind == "chat":
            message = str(action.get("message", ""))
            if message.lower().strip().startswith("investigate"):
                ensure_agent(store)
                record = st.session_state.finance_investigator.start(action.get("case_id"), "replication_gap")
                st.session_state.finance_investigation_id = record["investigation_id"]
                st.session_state.finance_trace_id = record["case_id"]
                worker_pool().submit(st.session_state.finance_investigator.run, record["investigation_id"])
                publish_response({"answer": "Document investigation started. The proof dossier will update as each step completes.", "status": "running"})
            elif "reconcil" in message.lower() or (mentioned_period(message.lower()) and "variance" in message.lower()):
                current = store.case(action.get("case_id")) if action.get("case_id") else None
                parsed, assumed, follow_up = request_for_demo(message, current["scope"] if current else None)
                if follow_up:
                    st.session_state.finance_trace_id = trace_question(store, action.get("scenario", "S1"), action.get("case_id"), "clarification", "needs_scope")
                    publish_response({"answer": follow_up, "status": "needs_scope"})
                    return
                if parsed["period"] not in store.available_periods() or parsed["company_code"] != "1000" or parsed["ledger"] != "0L":
                    st.session_state.finance_trace_id = trace_question(store, action.get("scenario", "S1"), action.get("case_id"), "scope_limit", "limited")
                    publish_response({"answer": "This synthetic demo has twelve months for its one documented finance scope. I cannot reconcile the requested scope from this dataset.", "status": "limited"})
                    return
                ensure_agent(store)
                result = st.session_state.finance_runtime.reconcile(ReconciliationRequest(scenario=action.get("scenario", "S1"), user_id="finance.user", **parsed))
                st.session_state.finance_case_id = result["case_id"]
                st.session_state.finance_trace_id = result["case_id"]
                st.session_state.finance_investigation_id = None
                value = result["variance"]["amount"]
                answer = f"Reconciliation for {parsed['period']}: {int(value):,} USD variance." if value is not None else f"Reconciliation for {parsed['period']}: {result['variance']['state']}; no comparable amount."
                if assumed:
                    answer += f" Used the demo's synthetic {', '.join(assumed)}."
                publish_response({"answer": answer, "status": "answered"})
            else:
                answer = answer_follow_up(store, st.session_state.finance_approval, message, action.get("case_id"), action.get("scenario", "S1"))
                st.session_state.finance_trace_id = answer["trace_case_id"]
                publish_response(answer)
        elif kind == "agent_plan":
            context = AgentContext(store, st.session_state.finance_runtime, st.session_state.finance_investigator, st.session_state.finance_approval, lambda: ensure_agent(store))
            case_id = action.get("case_id") or st.session_state.finance_case_id
            plan = run_plan(context, plan_for(action.get("message", ""), store.case(case_id) if case_id else None), action.get("scenario", "S1"), "finance.user")
            st.session_state.finance_agent_plan = plan
            if plan.get("case_id") and store.case(plan["case_id"]):
                st.session_state.finance_case_id = plan["case_id"]
                st.session_state.finance_trace_id = plan["case_id"]
        elif kind == "condition":
            if not any(c["status"] in ("queued", "running") for c in store.cases()):
                apply_condition(store, action.get("period", ""), action.get("condition", ""))
        elif kind == "report":
            st.session_state.finance_report_period = action.get("period") if action.get("period") in store.available_periods() else None
        elif kind == "load_case":
            case_id = action.get("case_id")
            if not store.case(case_id):
                raise ValueError("Unknown synthetic case")
            st.session_state.finance_case_id = case_id
            st.session_state.finance_trace_id = case_id
            prior = store.investigations(case_id)
            st.session_state.finance_investigation_id = prior[0]["investigation_id"] if prior else None
            publish_response({"answer": "Stored synthetic case loaded for replay.", "status": "answered"})
        elif kind == "investigate":
            ensure_agent(store)
            record = st.session_state.finance_investigator.start(action.get("case_id"), action.get("fault_profile", "replication_gap"))
            st.session_state.finance_investigation_id = record["investigation_id"]
            st.session_state.finance_trace_id = record["case_id"]
            worker_pool().submit(st.session_state.finance_investigator.run, record["investigation_id"])
            publish_response({"answer": "Document investigation started. The proof dossier will update as each step completes.", "status": "running"})
        elif kind == "reprocess":
            record = st.session_state.finance_investigator.resolve(action.get("investigation_id"), action.get("operator_id", "finance.operator"))
            st.session_state.finance_case_id = record["after"]["case_id"] if record.get("after") else record["case_id"]
            st.session_state.finance_trace_id = st.session_state.finance_case_id
            publish_response({"answer": record["reason"], "status": record["status"]})
        elif kind == "approve":
            if action.get("role") != "approver":
                raise ValueError("Switch to the synthetic finance approver lane first")
            case_id = action.get("case_id")
            proposal = next((p for p in store.proposals() if p["case_id"] == case_id and p["status"] == "awaiting_approval"), None)
            if not proposal:
                raise ValueError("No pending synthetic proposal for this case")
            decision = ApprovalDecision(proposal_id=proposal["proposal_id"], approver_id="finance.approver", approved=True,
                                        callback_id=f"streamlit-{uuid.uuid4().hex}", payload_hash=proposal["payload_hash"],
                                        case_version=proposal["case_version"])
            result = st.session_state.finance_approval.decide(decision)
            publish_response({"answer": f"Approval result: {result['status']}. Synthetic variance marker {result.get('document_number', 'not created')}.", "status": "answered"})
        else:
            publish_response({"answer": "This synthetic action is not supported.", "status": "limited"})
    except Exception as exc:
        publish_response({"error": str(exc), "answer": f"I could not complete that synthetic action: {exc}", "status": "denied"})


st.set_page_config(page_title="Finance Architecture Studio", page_icon="▦", layout="wide", initial_sidebar_state="collapsed")
st.html("<style>header[data-testid='stHeader'],#MainMenu,footer{display:none!important}.block-container{max-width:none!important;padding:0!important}</style>")
if not (BUILD / "finance_architecture.js").exists():
    st.error("Frontend build missing. Run npm install and npm run build in the frontend directory.")
    st.stop()

@st.cache_resource
def architecture_component(build_version: str):
    return st.components.v2.component(
        f"finance_architecture_{build_version}",
        html='<div class="finance-root"></div>',
        js=(BUILD / "finance_architecture.js").read_text(encoding="utf-8"),
        css=(BUILD / "finance_architecture.css").read_text(encoding="utf-8"),
    )


@st.fragment(run_every="1s")
def show_app():
    store = session()
    case_id = st.session_state.finance_case_id
    trace_id = st.session_state.finance_trace_id
    current = store.case(case_id) if case_id else None
    investigation = store.investigation(st.session_state.finance_investigation_id) if st.session_state.finance_investigation_id else None
    data = {
        "architecture": architecture_registry(),
        "history": {"periods": store.history_overview(), "available_periods": store.available_periods(),
                    "account_count": 6, "source_count": 4, "journal_records_per_month": 12},
        "cases": store.cases()[:20],
        "proposals": store.proposals(),
        "investigation": investigation,
        "investigation_events": architecture_events(store.events(investigation["case_id"])) if investigation else [],
        "active_case": current,
        "history_detail": store.history_detail(current["scope"]["period"]) if current and current.get("scope",{}).get("period") in store.available_periods() else None,
        "events": architecture_events(store.events(trace_id)) if trace_id else [],
        "decision_questions": question_catalog(),
        "route_playbooks": route_playbook_catalog(),
        "local_bundle": LOCAL_BUNDLE_INFO,
        "decision_run": get_decision_run(store, st.session_state.finance_decision_run_id) if st.session_state.finance_decision_run_id else None,
        "response": st.session_state.finance_response,
        "response_nonce": st.session_state.finance_response_nonce,
        "conditions": [{"id": key, **value} for key, value in CONDITIONS.items()],
        "agents": agent_catalog(),
        "agent_plan": st.session_state.finance_agent_plan,
        "report": build_report(store, st.session_state.finance_report_period, current if current and current.get("scope", {}).get("period") == st.session_state.finance_report_period else None, store.events(case_id) if current and current.get("scope", {}).get("period") == st.session_state.finance_report_period else None) if st.session_state.finance_report_period else None,
        "simulation": True,
    }
    result = architecture_component(BUILD_VERSION)(data=data, key="finance_architecture", on_action_change=lambda: None)
    if result.action:
        handle_action(result.action)
        st.rerun()


show_app()
