"""Streamlit-hostable entrypoint for the Node-built synthetic architecture UI.

The browser component sends typed actions to this Python session. Each viewer gets
an isolated in-memory SQLite fixture; no external finance service is called.
"""
from __future__ import annotations

import uuid
import hashlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import os
import sys
import time

import streamlit as st


def _reload_changed_poc_modules(root: Path) -> bool:
    """Streamlit keeps imported modules cached across reruns, so after a hosted redeploy an edited
    poc module could stay stale while new files loaded. Drop every poc module when the sources change."""
    stamp = hashlib.sha256(b"".join(path.read_bytes() for path in sorted(root.rglob("*.py")))).hexdigest()
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
from poc.agents import Context as AgentContext, case_for_period, catalog as agent_catalog, plan_for, run_plan
from poc import cockpit
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
        st.session_state.finance_selected_period = None
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
    time.sleep(float(os.environ.get("COCKPIT_ACTION_DELAY", "0") or 0))  # test hook: widens the window in which two actions can overlap (default 0)
    if os.environ.get("COCKPIT_DEBUG"):
        print(f"ACTION {kind} seq={action.get('_seq')} msg={str(action.get('message', ''))[:40]!r}", flush=True)
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
            selected = action.get("period") if action.get("period") in store.available_periods() else None
            case_id = action.get("case_id") or st.session_state.finance_case_id
            plan = cockpit.run(context, action.get("message", ""), action.get("scenario", "S1"), case_id, selected, action.get("options") or {})
            if selected:
                st.session_state.finance_selected_period = selected
            if plan.get("domain") == "treasury" and plan.get("trace_case_id"):
                st.session_state.finance_trace_id = plan["trace_case_id"]
            st.session_state.finance_agent_plan = plan
            if plan.get("case_id") and store.case(plan["case_id"]):
                st.session_state.finance_case_id = plan["case_id"]
                st.session_state.finance_trace_id = plan["case_id"]
        elif kind == "condition":
            if not any(c["status"] in ("queued", "running") for c in store.cases()):
                apply_condition(store, action.get("period", ""), action.get("condition", ""))
        elif kind == "module_action":
            payload = dict(action.get("payload") or {})
            if action.get("role") is not None:
                payload["approver_id"] = "finance.approver" if action.get("role") == "approver" else "finance.maker"
            cockpit.action(store, action.get("module", ""), action.get("name", ""), payload)
        elif kind == "select_period":
            st.session_state.finance_selected_period = action.get("period") if action.get("period") in store.available_periods() else None
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


import base64
_LOGO_PNG = "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"  # demo logo, docs/brand/finance-agent-logo-64.png
st.set_page_config(page_title="SAP Finance Agent Cockpit", page_icon=base64.b64decode(_LOGO_PNG), layout="wide", initial_sidebar_state="collapsed")
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


@st.cache_resource
def static_payload(build_version: str, poc_stamp: str):
    """Everything that cannot change while the process runs: built once, not once per second."""
    return {"architecture": architecture_registry(), "decision_questions": question_catalog(), "route_playbooks": route_playbook_catalog(),
            "conditions": [{"id": key, **value} for key, value in CONDITIONS.items()], "agents": cockpit.catalog(), "modules": cockpit.manifests(), "ontology": cockpit.ontology()}


def memo(key, factory):
    """Per-session memo for views that only change when an action ran. Bounded so it cannot grow."""
    cache = st.session_state.setdefault("finance_memo", {})
    if key not in cache:
        if len(cache) > 60:
            cache.clear()
        cache[key] = factory()
    return cache[key]


def needs_polling(store) -> bool:
    """Only a run in flight needs the one-second refresh. An idle app must not re-run, and re-send everything, every second."""
    try:
        if any(c["status"] in ("queued", "running") for c in store.cases()):
            return True
    except Exception:
        return True
    run_id = st.session_state.finance_decision_run_id
    return bool(run_id and (get_decision_run(store, run_id) or {}).get("status") != "complete")


def render_app(polling: bool):
    time.sleep(float(os.environ.get("COCKPIT_RENDER_DELAY", "0") or 0))  # test hook: emulates a slow host CPU (default 0)
    store = session()
    mutations = st.session_state.get("finance_mutations", 0)
    period = st.session_state.finance_selected_period
    case_id = st.session_state.finance_case_id
    trace_id = st.session_state.finance_trace_id
    current = store.case(case_id) if case_id else None
    investigation = store.investigation(st.session_state.finance_investigation_id) if st.session_state.finance_investigation_id else None
    data = {
        **static_payload(BUILD_VERSION, getattr(sys, "_finance_poc_stamp", "")),
        "history": {"periods": memo(("history", mutations), store.history_overview), "available_periods": store.available_periods(),
                    "account_count": 6, "source_count": 4, "journal_records_per_month": 12},
        "cases": store.cases()[:20],
        "proposals": store.proposals(),
        "investigation": investigation,
        "investigation_events": architecture_events(store.events(investigation["case_id"])) if investigation else [],
        "active_case": current,
        "history_detail": store.history_detail(current["scope"]["period"]) if current and current.get("scope",{}).get("period") in store.available_periods() else None,
        "events": architecture_events(store.events(trace_id)) if trace_id else [],
        "local_bundle": LOCAL_BUNDLE_INFO,
        "decision_run": get_decision_run(store, st.session_state.finance_decision_run_id) if st.session_state.finance_decision_run_id else None,
        "response": st.session_state.finance_response,
        "response_nonce": st.session_state.finance_response_nonce,
        "action_seq": st.session_state.get("finance_action_seq", -1),
        "module_views": memo(("views", period, mutations), lambda: {m.id: cockpit.view(store, m.id, period) for m in cockpit.modules() if m.view is not None}) if period else {},
        "agent_plan": st.session_state.finance_agent_plan,
        "period_report": memo(("period_report", period, mutations, (current or {}).get("case_id"), (current or {}).get("status")), lambda: build_report(store, period, current if current and current.get("scope", {}).get("period") == period else None, None)) if period else None,
        "report": build_report(store, st.session_state.finance_report_period, current if current and current.get("scope", {}).get("period") == st.session_state.finance_report_period else None, store.events(case_id) if current and current.get("scope", {}).get("period") == st.session_state.finance_report_period else None) if st.session_state.finance_report_period else None,
        "simulation": True,
    }
    result = architecture_component(BUILD_VERSION)(data=data, key="finance_architecture", on_action_change=lambda: None)
    if result.action:
        try:
            handle_action(result.action)
        finally:  # the browser sends one action at a time and waits for this number before sending the next
            st.session_state.finance_mutations = st.session_state.get("finance_mutations", 0) + 1
            seq = result.action.get("_seq")
            if isinstance(seq, int):
                st.session_state.finance_action_seq = max(st.session_state.get("finance_action_seq", -1), seq)
        st.rerun()
    if polling and not needs_polling(store):
        st.rerun()  # the run finished: leave the polling fragment so the idle one takes over


show_polling = st.fragment(run_every="1s")(render_app)
show_idle = st.fragment(render_app)
polling_now = needs_polling(session())
(show_polling if polling_now else show_idle)(polling_now)
