"""Cash and Treasury Assistant: data, calculations, agents, approval marker and routing."""
import re
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from poc import app as app_module
from poc import treasury as T
from poc import treasury_data as D
from poc import treasury_agents as TA
from poc.history import PERIODS


@pytest.fixture()
def client():
    return TestClient(app_module.app)


@pytest.fixture()
def ctx():
    context = app_module.agent_context()
    context.store.set_state("treasury_proposals", {})  # proposals are local drafts; start each test clean
    return context


def test_data_is_deterministic_and_period_specific():
    assert D.account_rows("2026-11") == D.account_rows("2026-11")
    assert T.position("2026-02") != T.position("2026-11")
    assert T.position("2026-02")["as_of"] == "2026-02-27" and T.position("2026-11")["as_of"] == "2026-11-30"


def test_every_period_position_is_internally_consistent():
    for period in PERIODS:
        pos = T.position(period)
        assert len(pos["accounts"]) == 9
        for a in pos["accounts"]:
            assert a["expected_closing"] == a["opening"] + a["receipts"] - a["payments"], (period, a["id"])
            expect = "DEFICIT" if a["expected_closing"] < a["min"] else "IDLE_CASH" if a["opening"] > 1.5 * a["target"] else "WITHIN_POLICY"
            assert a["status"] == expect, (period, a["id"])
        assert pos["totals"]["usd_opening"] == sum(a["usd_opening"] for a in pos["accounts"]) == sum(b["usd_balance"] for b in pos["banks"])
        assert abs(sum(b["share_pct"] for b in pos["banks"]) - 100) < 0.5
        assert pos["totals"]["deficit"] + pos["totals"]["idle"] + pos["totals"]["within_policy"] == 9
        assert len(pos["policy_checks"]) == 6


def test_unavailable_period_is_denied():
    for fn in (T.position, T.recommendations, T.banks):
        with pytest.raises(Exception, match="NO DATA AVAILABLE"):
            fn("2027-01")
    with pytest.raises(Exception, match="NO DATA AVAILABLE"):
        T.forecast("2027-01", 30)


def test_recommendations_respect_templates_currency_and_limits():
    for period in PERIODS:
        pos = T.position(period)
        accounts = {a["id"]: a for a in pos["accounts"]}
        rec = T.recommendations(period)
        templates = {t[0]: t for t in D.TEMPLATES}
        moved = {}
        for r in rec["recommendations"]:
            t = templates[r["template"]]
            assert (r["from_account"], r["to_account"], r["ccy"]) == (t[1], t[2], t[3])
            assert accounts[r["from_account"]]["ccy"] == accounts[r["to_account"]]["ccy"] == r["ccy"]
            assert 0 < r["amount"] <= t[4]
            assert accounts[r["to_account"]]["status"] == "DEFICIT" and accounts[r["from_account"]]["status"] != "DEFICIT"
            moved[r["from_account"]] = moved.get(r["from_account"], 0) + r["amount"]
            assert r["payload_hash"] == T.proposal_hash(period, r)
        for src, amount in moved.items():
            assert amount <= accounts[src]["above_target"], (period, src)
        # nothing is hidden: each deficit is covered or listed as unfunded
        for a in pos["accounts"]:
            if a["status"] == "DEFICIT":
                covered = sum(r["amount"] for r in rec["recommendations"] if r["to_account"] == a["id"])
                left = sum(u["remaining"] for u in rec["unfunded"] if u["account"] == a["id"])
                assert covered >= a["shortfall"] or left > 0, (period, a["id"])


def test_forecast_horizons_and_shortfall_logic():
    for period in ("2026-02", "2026-08", "2026-11"):
        for h in (7, 30, 90):
            fc = T.forecast(period, h)
            assert len(fc["usd_series"]) == h
            for c in fc["by_currency"]:
                assert c["net"] == c["closing"] - c["opening"]
                assert bool(c["first_shortfall"]) == (c["lowest"] < c["minimum_required"])
    with pytest.raises(Exception, match="Horizon"):
        T.forecast("2026-11", 45)
    assert T.forecast("2026-11", 90)["shortfall"] is True


def test_bank_relationships_add_up():
    b = T.banks("2026-11")
    assert b["totals"]["fees_usd"] == sum(r["fees_total_usd"] for r in b["banks"])
    assert all(r["credit_line_drawn"] <= r["credit_line_limit"] for r in b["banks"])
    assert b["over_concentration_limit"] == ["Bank Charlie"]


def test_routing_table():
    cases = {"What is our cash position for November 2026?": "treasury", "Propose transfers to cover shortfalls": "treasury", "Forecast liquidity for the next 30 days": "treasury",
             "Show bank fees and credit lines": "treasury", "Initiate the bank transfer now": "treasury", "Reconcile November 2026 company code 1000 ledger 0L USD": "reconciliation",
             "Investigate this variance": "reconciliation", "Explain the route controls": "reconciliation", "Reconcile the bank accounts": "reconciliation"}
    for text, domain in cases.items():
        assert TA.route_domain(text) == domain, text


def test_intents_and_steps(ctx):
    expect = {"What is our cash position?": "cash_position", "Propose transfers to cover shortfalls": "transfer_proposal", "Forecast liquidity for the next 30 days": "forecast",
              "Show bank fees and credit lines": "bank_relationships", "Initiate the bank transfer now": "refused_initiate", "Approve the transfer proposal": "refused_approval", "cash": "cash_position"}
    for text, intent in expect.items():
        assert TA.treasury_plan(text)["intent"] == intent, text
    assert TA.treasury_plan("Forecast liquidity for the next 90 days")["horizon_days"] == 90
    assert TA.treasury_plan("Forecast liquidity next week")["horizon_days"] == 7


def test_no_tool_can_initiate_or_write(ctx):
    assert all(t["rw"] in ("read", "local-draft", "none") for t in TA.TOOLS.values())
    assert not [n for n in TA.TOOLS if re.search(r"initiate|approve|post|execute|change", n)]
    assert {"initiate_bank_transfer", "approve_transfer_proposal"} <= set(TA.NOT_TOOLS)
    plan = TA.run_assistant(ctx, "Initiate the bank transfer now and send the funds", "S1", None, "2026-11")
    assert plan["status"] == "blocked" and plan["steps"] == [] and "not an agent action" in plan["answer"]
    assert TA.run_assistant(ctx, "Approve the transfer proposal", "S1", None, "2026-11")["status"] == "blocked"


def test_plan_uses_selector_request_precedence_and_no_data(ctx):
    selected = TA.run_assistant(ctx, "What is our cash position?", "S1", None, "2026-02")
    assert selected["domain"] == "treasury" and selected["effective_period"] == "2026-02" and selected["period_source"] == "selector"
    explicit = TA.run_assistant(ctx, "What is our cash position for November 2026?", "S1", None, "2026-02")
    assert explicit["effective_period"] == "2026-11" and explicit["period_source"] == "request" and explicit["selected_period"] == "2026-02"
    gone = TA.run_assistant(ctx, "What is our cash position for December 2026?", "S1", None, "2026-11")
    assert gone["status"] == "blocked" and "NO DATA AVAILABLE FOR DECEMBER 2026" in gone["answer"] and gone["effective_period"] is None
    assert TA.run_assistant(ctx, "What is our cash position?", "S1", None, None)["status"] == "needs_input"


def test_plan_numbers_equal_the_calculation_and_cite_sap(ctx):
    plan = TA.run_assistant(ctx, "What is our cash position for November 2026?", "S1", None, "2026-11")
    assert plan["status"] == "done" and plan["domain"] == "treasury" and plan["case_id"] is None
    pos = T.position("2026-11")
    assert plan["result"]["totals"] == pos["totals"] and plan["result"]["accounts"] == pos["accounts"]
    assert f"{pos['totals']['usd_opening']:,}" in plan["answer"]
    assert {"R1", "R3", "R5"} <= {r["id"] for r in plan["references"]} and all(r["url"].startswith("https://") for r in plan["references"])
    assert plan["adaptations"] and plan["adaptations"][0]["added"].endswith("generate_transfer_recommendations")  # deficits found, so the orchestrator added steps
    assert "no bank transfer was initiated" in plan["answer"]


def test_events_show_the_selected_route_layers(ctx):
    s1 = TA.run_assistant(ctx, "Show bank fees and credit lines", "S1", None, "2026-11")
    s2 = TA.run_assistant(ctx, "Show bank fees and credit lines", "S2", None, "2026-11")
    t1, t2 = s1["steps"][0]["trace"], s2["steps"][0]["trace"]
    assert {"Selected gateway", "Domain MCP", "SAP BAIP", "SAP backends"} <= set(t1["layers"]) and t1["count"] > 8
    assert any("apigee_gateway" in h["to"] for h in t1["hops"]) and any("agentcore_gateway" in h["to"] for h in t2["hops"])
    local = TA.run_assistant(ctx, "Which accounts are in deficit?", "S1", None, "2026-11")
    assert next(s for s in local["steps"] if s["tool"] == "identify_surplus_deficit")["trace"]["layers"] == []  # computed locally, no layer called


def test_cash_agents_name_s4hana_and_central_finance_as_systems_of_record(ctx):
    cards = {c["id"]: c for c in TA.AGENT_CARDS}
    for agent in ("cash_positioning", "cash_forecasting", "bank_relationship"):
        systems = {r["system"] for r in cards[agent]["systems_of_record"]}
        assert systems == {TA.S4, TA.CFIN}, agent
        assert "not verified" in cards[agent]["records_note"]
    assert cards["treasury_orchestrator"]["systems_of_record"] == [] and "never touches SAP" in cards["treasury_orchestrator"]["records_note"]
    forecast = TA.run_assistant(ctx, "Forecast liquidity for the next 30 days", "S3", None, "2026-11")
    step = next(s for s in forecast["steps"] if s["tool"] == "forecast_liquidity")
    targets = {h["to"] for h in step["trace"]["hops"]}
    assert {"s4_live_gl", "cfin_accounting", "cfin_status"} <= targets  # both systems of record are read
    assert {r["system"] for r in forecast["systems_of_record"]} == {TA.S4, TA.CFIN}
    statements = TA.run_assistant(ctx, "Are all bank statements complete?", "S3", None, "2026-11")
    st = next(s for s in statements["steps"] if s["tool"] == "check_statement_completeness")
    assert "cfin_accounting" not in {h["to"] for h in st["trace"]["hops"]} and [r["system"] for r in st["systems_of_record"]] == [TA.S4]
    local = TA.run_assistant(ctx, "Which accounts are in deficit?", "S1", None, "2026-11")
    assert next(s for s in local["steps"] if s["tool"] == "identify_surplus_deficit")["systems_of_record"] == []


def test_proposal_approval_marker_never_initiates(ctx):
    plan = TA.run_assistant(ctx, "Propose transfers to cover shortfalls", "S1", None, "2026-11")
    saved = TA.list_proposals(ctx.store, "2026-11")
    assert saved and all(p["status"] == "awaiting_approval" for p in saved)
    p = next(x for x in saved if x["status"] == "awaiting_approval")
    with pytest.raises(Exception, match="approver role"):
        TA.decide_proposal(ctx.store, p["proposal_id"], "finance.maker", True, p["payload_hash"])
    with pytest.raises(Exception, match="changed"):
        TA.decide_proposal(ctx.store, p["proposal_id"], "finance.approver", True, "0" * 64)
    done = TA.decide_proposal(ctx.store, p["proposal_id"], "finance.approver", True, p["payload_hash"])
    assert done["status"] == "approved_marker" and "No bank transfer was initiated" in done["note"] and "document" not in done
    with pytest.raises(Exception, match="already"):
        TA.decide_proposal(ctx.store, p["proposal_id"], "finance.approver", False, p["payload_hash"])
    TA.run_assistant(ctx, "Propose transfers to cover shortfalls", "S1", None, "2026-11")  # a decided proposal is never silently replaced
    assert next(x for x in TA.list_proposals(ctx.store, "2026-11") if x["proposal_id"] == p["proposal_id"])["status"] == "approved_marker"


def test_catalog_lists_every_family():
    cat = TA.assistant_catalog(app_module.agent_catalog())
    assert set(cat["domains"]) == {"reconciliation", "treasury", "accruals"} and len(cat["agents"]) == 7  # the flat keys are the default (reconciliation) family
    treasury = cat["domains"]["treasury"]
    assert [a["id"] for a in treasury["agents"]] == ["treasury_orchestrator", "cash_positioning", "cash_forecasting", "bank_relationship"]
    assert all(t["agent"] in {a["id"] for a in treasury["agents"]} for t in treasury["tools"])
    assert "NOT_VERIFIED" in next(a for a in treasury["agents"] if a["id"] == "cash_forecasting")["availability"]


def test_api_surface(client):
    view = client.get("/api/treasury/2026-02").json()
    assert view["position"]["period"] == "2026-02" and set(view["forecast"]) == {"7", "30", "90"}
    assert client.get("/api/treasury/2027-01").status_code >= 400
    app_module.store.set_state("treasury_proposals", {})
    treasury = client.post("/api/agent/plan", json={"message": "Propose transfers to cover shortfalls", "scenario": "S1", "period": "2026-11", "demo_pace_ms": 0}).json()
    recon = client.post("/api/agent/plan", json={"message": "Reconcile November 2026 company code 1000 ledger 0L USD", "scenario": "S1", "period": "2026-11", "demo_pace_ms": 0}).json()
    assert treasury["domain"] == "treasury" and recon["domain"] == "reconciliation" and recon["case_id"]
    assert client.get("/api/agent/catalog").json()["domains"]["treasury"]["name"] == "Cash and Treasury Assistant"
    proposals = client.get("/api/treasury/proposals", params={"period": "2026-11"}).json()
    assert proposals
    bad = client.post(f"/api/treasury/proposals/{proposals[0]['proposal_id']}/decision", json={"approver_id": "finance.maker", "approved": True, "payload_hash": proposals[0]["payload_hash"]})
    assert bad.status_code == 403
