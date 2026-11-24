from poc.agents import AGENT_CARDS, NOT_TOOLS, TOOLS, Context, catalog, invoke_tool, plan_for, run_plan
from poc.approval import ApprovalSimulator
from poc.foundry import FoundrySimulator
from poc.investigation import InvestigationSimulator
from poc.runtime import RuntimeSimulator
from poc.store import Denied, Store


def make_context(tmp_path):
    store = Store(tmp_path / "agents.sqlite3")
    foundry = FoundrySimulator(store)

    def ensure():
        if not foundry.active():
            raise AssertionError("tests use the app's activation helper through the API")

    return store, Context(store, RuntimeSimulator(store), InvestigationSimulator(store), ApprovalSimulator(store), ensure)


def test_plan_is_deterministic_and_write_tools_are_not_registered():
    first = plan_for("Reconcile November 2026 company code 1000 ledger 0L USD")
    second = plan_for("Reconcile November 2026 company code 1000 ledger 0L USD")
    strip = lambda plan: [(s["agent"], s["tool"]) for s in plan["steps"]]
    assert strip(first) == strip(second) == [("scope", "resolve_scope"), ("evidence", "collect_evidence"), ("variance", "compute_variance"), ("variance", "close_readiness"), ("governance", "trace")]
    assert plan_for("investigate this variance")["intent"] == "investigate"
    assert plan_for("propose an adjustment")["steps"][0]["tool"] == "draft_proposal"
    for forbidden in ("sap.post", "post", "decide", "execute", "approval.decide", "fixture.mutate"):
        assert forbidden not in TOOLS
    assert set(NOT_TOOLS) >= {"sap.post", "approval.decide", "approval.execute"}
    assert {c["id"] for c in AGENT_CARDS} >= {"orchestrator", "scope", "evidence", "variance", "investigator", "governance", "approval"}
    assert all(t["agent"] in {c["id"] for c in AGENT_CARDS} for t in TOOLS.values())


def test_posting_request_is_refused_by_the_orchestrator(tmp_path):
    store, ctx = make_context(tmp_path)
    plan = run_plan(ctx, plan_for("Post a journal entry to SAP for November 2026"))
    assert plan["status"] == "blocked" and plan["steps"] == [] and "not an agent action" in plan["blocked_reason"]
    assert store.get_state("journals") is None


def test_steps_need_a_case_and_scope_follow_up_holds_the_plan(tmp_path):
    store, ctx = make_context(tmp_path)
    blocked = run_plan(ctx, plan_for("propose an adjustment"))
    assert blocked["status"] == "blocked" and blocked["steps"][0]["status"] == "blocked"
    held = run_plan(ctx, plan_for("reconcile"))
    assert held["status"] == "needs_input" and held["steps"][0]["status"] == "held" and all(s["status"] == "skipped" for s in held["steps"][1:])


def test_direct_tool_calls_only_reach_read_tools(tmp_path):
    store, ctx = make_context(tmp_path)
    for name in ("plan", "draft_proposal", "start_investigation", "collect_evidence", "sap.post", "approval.decide"):
        try:
            invoke_tool(ctx, name, {})
        except Denied:
            continue
        raise AssertionError(f"{name} must not be directly callable")
    routed = invoke_tool(ctx, "route_controls", {"scenario": "S2"})
    assert routed["status"] == "done" and "S2" in routed["steps"][0]["summary"]
    ready = invoke_tool(ctx, "close_readiness", {"period": "2026-11"})
    assert ready["status"] == "done" and "Explained" in ready["steps"][0]["summary"]


def test_agent_endpoints_run_a_full_reconcile_plan():
    from fastapi.testclient import TestClient
    import poc.app as application
    client = TestClient(application.app)
    cat = client.get("/api/agent/catalog").json()
    assert len(cat["agents"]) == 7 and "no LLM" in cat["label"]
    plan = client.post("/api/agent/plan", json={"message": "Reconcile November 2026 company code 1000 ledger 0L USD", "scenario": "S1"}).json()
    assert plan["status"] == "done" and [s["status"] for s in plan["steps"]] == ["done"] * 5 and plan["case_id"]
    assert client.get(f"/api/cases/{plan['case_id']}").json()["status"] == "complete"
    assert client.get("/api/agent/plans/last").json()["plan_id"] == plan["plan_id"]
    assert client.post("/api/agent/tools/draft_proposal", json={"case_id": plan["case_id"]}).status_code in (400, 403, 404, 409, 422)
    refused = client.post("/api/agent/plan", json={"message": "post a journal to SAP"}).json()
    assert refused["status"] == "blocked"
