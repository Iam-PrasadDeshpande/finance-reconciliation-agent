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
    assert plan["status"] == "done" and [s["status"] for s in plan["steps"]] == ["done"] * 6 and plan["case_id"]
    assert plan["steps"][-1]["tool"] == "start_investigation" and plan["steps"][-1]["added_by"] and plan["adaptations"][0]["added"] == "investigator.start_investigation"
    assert "No SAP write was made" in plan["answer"]
    assert client.get(f"/api/cases/{plan['case_id']}").json()["status"] == "complete"
    assert client.get("/api/agent/plans/last").json()["plan_id"] == plan["plan_id"]
    assert client.post("/api/agent/tools/draft_proposal", json={"case_id": plan["case_id"]}).status_code in (400, 403, 404, 409, 422)
    refused = client.post("/api/agent/plan", json={"message": "post a journal to SAP"}).json()
    assert refused["status"] == "blocked"


def test_steps_record_the_mcp_call_and_the_layers_actually_reached():
    from fastapi.testclient import TestClient
    import poc.app as application
    client = TestClient(application.app)
    plan = client.post("/api/agent/plan", json={"message": "Reconcile November 2026 company code 1000 ledger 0L USD", "scenario": "S1"}).json()
    assert plan["orchestrator"]["dispatches"] == 6 and "MCP-style" in plan["orchestrator"]["role"] and plan["duration_ms"] >= 0
    by_tool = {s["tool"]: s for s in plan["steps"]}
    for step in plan["steps"]:
        assert step["mcp"]["method"].startswith("tools/call") and step["mcp"]["server"].endswith("-mcp")
        assert {"count", "first_seq", "last_seq", "layers", "hops"} <= set(step["trace"])
    evidence = by_tool["collect_evidence"]
    assert evidence["trace"]["count"] > 10 and "SAP backends" in evidence["trace"]["layers"] and "Selected gateway" in evidence["trace"]["layers"]
    assert evidence["mcp"]["arguments"]["route"] == "S1" and evidence["mcp"]["arguments"]["scope"]["period"] == "2026-11"
    assert by_tool["resolve_scope"]["trace"]["count"] == 0
    assert by_tool["trace"]["mcp"]["arguments"]["case_id"] == plan["case_id"]
    assert all(c["mcp_server"] for c in client.get("/api/agent/catalog").json()["agents"])
    assert "no MCP transport" in client.get("/api/agent/catalog").json()["note"]


def test_review_findings_are_fixed():
    from fastapi.testclient import TestClient
    import poc.app as application
    client = TestClient(application.app)
    for text in ("book a journal entry for november", "create a JE in the ledger", "reverse the posting", "post a journal entry to SAP", "investigate and post a journal to SAP"):
        assert plan_for(text)["intent"] == "refused_write", text
    for text in ("approve the proposal", "please execute the posting now"):
        assert plan_for(text)["intent"] in ("refused_write", "refused_approval"), text
    assert plan_for("approve the proposal")["intent"] == "refused_approval"
    assert plan_for("hello")["intent"] == "clarify" and plan_for("compost heap")["intent"] == "clarify"
    assert plan_for("reconcile and adjust")["intent"] == "reconcile"
    assert client.post("/api/agent/plan", json={"message": "hello"}).json()["status"] == "needs_input"
    assert client.post("/api/agent/plan", json={"message": "Reconcile November 2026", "scenario": "S9"}).status_code == 422
    assert client.post("/api/agent/plan", json={"message": "x" * 500}).status_code == 422
    ready = client.post("/api/agent/tools/close_readiness", json={"period": "2026-03"}).json()
    assert ready["steps"][0]["ref"]["period"] == "2026-03" and ready["steps"][0]["mcp"]["arguments"]["period"] == "2026-03"
    assert client.post("/api/agent/tools/close_readiness", json={"period": "1999-01"}).status_code in (400, 403, 404, 409, 422)
    assert client.post("/api/agent/tools/route_controls", json={"scenario": "S9"}).status_code in (400, 403, 404, 409, 422)
    assert client.post("/api/agent/tools/trace", json={}).status_code in (400, 403, 404, 409, 422)
    plan = client.post("/api/agent/plan", json={"message": "Reconcile December 2025 company code 1000 ledger 0L USD", "scenario": "S2"}).json()
    by_tool = {s["tool"]: s for s in plan["steps"]}
    assert plan["status"] == "done" and "start_investigation" not in by_tool and plan["adaptations"] == [] or plan["adaptations"]
    assert by_tool["compute_variance"]["trace"]["count"] == 0 and by_tool["compute_variance"]["trace"]["layers"] == []
    events = client.get("/api/events", params={"case_id": plan["case_id"]}).json()
    stamped = [e for e in events if (e.get("payload_summary") or {}).get("step_id")]
    assert stamped and {e["payload_summary"]["plan_id"] for e in stamped} == {plan["plan_id"]}
    assert by_tool["collect_evidence"]["trace"]["count"] == len([e for e in stamped if e["payload_summary"]["step_id"] == by_tool["collect_evidence"]["step_id"]])
