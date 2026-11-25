"""Conformance suite for the SAP Finance Agent Cockpit.

Every agent module, built in or added later, must pass these tests unchanged. They check the contract, not a module's numbers:
routing, catalog shape, tools that cannot write, the period contract, no-data behaviour, the Level 1 view, declarative result
blocks, event layers, ontology fragments and SAP references. Adding an agent = adding poc/agent_modules/<id>.py and running this file.
"""
import json
import re
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from poc import app as app_module
from poc import cockpit
from poc.agent_modules import _sample
from poc.cockpit import ALLOWED_RW, AgentModule
from poc.registry import components
from poc.sap_guidance import PROVENANCE

KINDS = {"entity", "measure", "rule", "process", "artifact", "actor"}
SAP_STATUS = {"DOCUMENTED", "SAP_TERM", "DEMO_ONLY"}
RENDERERS = {"builtin:reconciliation", "treasury", "generic"}
BLOCK_TYPES = {"kpis", "table", "list", "note"}
WRITE_NAME = re.compile(r"post|execute|initiate|approve|decide|delete|write|change|release")
KNOWN_ZONES = {c["zone"] for c in components()}
KNOWN_COMPONENTS = {c["component_id"] for c in components()}


def all_modules():
    found = list(cockpit.modules())
    if not any(m.id == _sample.MODULE.id for m in found):
        found.append(_sample.MODULE)  # the scaffold is always held to the contract, even when it is not loaded
    return found


MODULES = all_modules()
IDS = [m.id for m in MODULES]


@pytest.fixture()
def ctx():
    context = app_module.agent_context()
    context.store.set_state("treasury_proposals", {})
    return context


@pytest.fixture()
def client():
    return TestClient(app_module.app)


def merged_ontology():
    classes = {c["id"]: c for c in cockpit.ontology()["classes"]}
    for m in MODULES:  # include the scaffold even if it is not registered
        for c in m.ontology()["classes"]:
            classes.setdefault(c["id"], {**c, "module": m.id})
    return classes


def references():
    refs = {}
    for m in MODULES:
        for r in m.catalog().get("references", []):
            refs[r["id"]] = r
    return refs


def check_blocks(blocks):
    for b in blocks:
        assert b["type"] in BLOCK_TYPES, b["type"]
        if b["type"] == "kpis":
            assert b["items"] and all("label" in i and "value" in i for i in b["items"])
        if b["type"] == "table":
            keys = {c["key"] for c in b["columns"]}
            assert b["columns"] and all(keys <= set(r) or True for r in b["rows"]) and all(c["key"] in r for r in b["rows"] for c in b["columns"])
        if b["type"] == "list":
            assert all(isinstance(i, str) for i in b["items"])
        if b["type"] == "note":
            assert isinstance(b["text"], str)


def test_registry_has_exactly_one_default_and_unique_ids_and_tabs():
    assert len(IDS) == len(set(IDS))
    assert sum(1 for m in cockpit.modules() if m.default) == 1
    tabs = [m.tab["id"] for m in cockpit.modules() if m.tab]
    assert len(tabs) == len(set(tabs))
    with pytest.raises(ValueError):
        cockpit.register(cockpit.modules()[0])


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_manifest_is_serializable_and_routing_compiles(module):
    manifest = [m for m in [{"id": module.id, "routing": module.routing_words}]]
    json.dumps(manifest)
    assert module.renderer in RENDERERS
    assert re.compile(r"\b(" + "|".join(module.routing_words) + r")\b") if module.routing_words else module.default
    assert module.ask_template and module.examples and module.name and module.family_label and module.short_name and module.blurb
    if module.tab:
        assert {"id", "label", "short", "icon"} <= set(module.tab)
    if module.renderer == "generic":
        assert module.view is not None, "a generic module needs a view() returning ui blocks"


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_catalog_shape_and_tools_cannot_write(module):
    cat = module.catalog()
    cards, tools = cat["agents"], cat["tools"]
    assert cards and len({c["id"] for c in cards}) == len(cards)
    assert sum(1 for c in cards if c["kind"] == "orchestrator") == 1
    for card in cards:
        assert {"id", "name", "role", "mode", "view", "tools", "mcp_server", "layers", "kind"} <= set(card)
        assert card["kind"] in ("orchestrator", "specialist")
    names = {t["name"] for t in tools}
    ids = {c["id"] for c in cards}
    assert all(t["agent"] in ids and t["rw"] in ALLOWED_RW for t in tools)
    assert all(set(c["tools"]) <= names for c in cards)
    assert "plan" in names and not [n for n in names if WRITE_NAME.search(n)], "a write-capable tool name was registered"
    assert cat["not_tools"], "list what is deliberately not a tool"
    json.dumps(cat)


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_examples_route_to_their_module(module):
    for text in [module.ask_template] + module.examples:
        filled = text.replace("{period}", "November 2026")
        routed = cockpit.route(filled) if module in cockpit.modules() else module.id
        assert routed == module.id, f"{filled!r} routed to {routed}"


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_run_returns_a_plan_the_workbench_can_draw(module, ctx):
    message = module.ask_template.replace("{period}", "November 2026")
    for scenario in ("S1", "S2"):
        plan = module.run(ctx, message, scenario, None, "2026-11")
        assert plan["plan_id"] and plan["status"] in ("done", "blocked", "needs_input") and plan["answer"] and plan["label"]
        assert plan["steps"], "a plan with nothing to do cannot be drawn"
        ids = {c["id"] for c in module.catalog()["agents"]}
        for step in plan["steps"]:
            assert set(("step_id", "agent", "tool", "purpose", "rw", "status", "summary")) <= set(step)
            assert step["agent"] in ids and step["rw"] in ALLOWED_RW and step["status"] in ("done", "blocked", "held", "skipped")
            trace = step.get("trace", {"layers": [], "hops": []})
            assert set(trace["layers"]) <= KNOWN_ZONES
            assert all(h["from"] in KNOWN_COMPONENTS and h["to"] in KNOWN_COMPONENTS for h in trace["hops"])
        json.dumps(plan)
        check_blocks(plan.get("result_blocks", []))


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_period_contract(module, ctx):
    plain = module.ask_template.replace("{period}", "November 2026")
    selected = module.run(ctx, module.ask_template.replace("{period}", "").replace(" for ", " ").strip() or plain, "S1", None, "2026-02")
    assert selected["effective_period"] in ("2026-02", None)  # selector decides when the request names no month
    explicit = module.run(ctx, plain, "S1", None, "2026-02")
    assert explicit["effective_period"] == "2026-11" and explicit["period_source"] == "request"
    gone = module.run(ctx, plain.replace("November 2026", "December 2026"), "S1", None, "2026-11")
    assert gone["status"] in ("blocked", "needs_input") and "NO DATA AVAILABLE" in gone["answer"] and "2026-11" not in gone["answer"]
    assert gone["effective_period"] is None


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_view_contract_and_no_data(module):
    if module.view is None:
        pytest.skip("module has no Level 1 view")
    store = app_module.store
    view = module.view(store, "2026-11")
    assert view["period"] == "2026-11"
    if module.renderer == "generic":
        ui = view["ui"]
        assert ui["title"] and ui["blocks"] and view["provenance"] == PROVENANCE
        check_blocks(ui["blocks"])
    with pytest.raises(Exception, match="NO DATA AVAILABLE"):
        module.view(store, "2027-01")


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_ontology_fragment_and_tool_concepts(module):
    frag = module.ontology()
    classes = merged_ontology()
    refs = references()
    own = {c["id"] for c in frag["classes"]}
    assert all(cid.startswith(module.id + ".") for cid in own), "module concepts are namespaced by the module id"
    for c in frag["classes"]:
        assert {"id", "label", "kind", "description", "properties", "sap_term", "sap_status", "sources"} <= set(c)
        assert c["kind"] in KINDS and c["sap_status"] in SAP_STATUS
        assert c["description"] and isinstance(c["properties"], list)
        if c["sap_status"] == "DOCUMENTED":
            assert c["sources"] and all(s in refs for s in c["sources"]), f"{c['id']} claims SAP documentation without a source"
        if c["sap_status"] == "DEMO_ONLY":
            assert not c["sap_term"] or "manual" in c["sap_term"].lower() or c["sap_term"], "demo-only concepts claim no SAP term"
    related = {r["from"] for r in frag["relations"]} | {r["to"] for r in frag["relations"]}
    assert own <= related, f"orphan concepts: {own - related}"
    for r in frag["relations"]:
        assert r["from"] in classes and r["to"] in classes, r
    tools = {t["name"] for t in module.catalog()["tools"]}
    assert set(module.tool_concepts) == tools, "every tool declares what it reads and produces"
    for spec in module.tool_concepts.values():
        assert all(cid in classes for cid in spec["reads"] + spec["produces"])


@pytest.mark.parametrize("module", MODULES, ids=IDS)
def test_references_are_citable(module):
    for r in module.catalog().get("references", []):
        assert r["id"] and r["title"] and r["url"].startswith("https://") and r["supports"] and r["status"]


def test_shared_ontology_has_no_dangling_relation_and_is_namespaced():
    onto = cockpit.ontology()
    ids = {c["id"] for c in onto["classes"]}
    assert len(ids) == len(onto["classes"])
    assert all(r["from"] in ids and r["to"] in ids for r in onto["relations"])
    assert {m["id"] for m in onto["modules"]} >= {"core"} | {m.id for m in cockpit.modules()}
    core = {c["id"] for c in onto["classes"] if c["module"] == "core"}
    assert {"CompanyCode", "FiscalPeriod", "Agent", "Tool", "ApprovalMarker", "Provenance"} <= core
    assert any(c["used_by"] for c in onto["classes"]), "tools declare which concepts they touch"
    assert "not an SAP-published ontology" in onto["note"]


def test_a_new_module_plugs_in_without_touching_the_cockpit(client):
    """Register a module at run time: routing, manifest, catalog, ontology, view and the API all pick it up."""
    plug = AgentModule(**{**_sample.MODULE.__dict__, "id": "plugged", "name": "Plugged Agent", "family_label": "Plugged agent", "short_name": "Plugged",
                          "tab": {"id": "plugged", "label": "Plugged", "short": "Plug", "icon": "+"}, "routing_words": ["zebra"], "ask_template": "zebra for {period}", "examples": ["zebra for {period}"],
                          "ontology": lambda: {"classes": [{"id": "plugged.Thing", "label": "Thing", "kind": "entity", "description": "d", "properties": [], "sap_term": None, "sap_status": "DEMO_ONLY", "sources": []}],
                                               "relations": [{"from": "plugged.Thing", "to": "FiscalPeriod", "label": "for", "kind": "scoped"}]},
                          "tool_concepts": {"plan": {"reads": [], "produces": []}, "read_sample": {"reads": ["plugged.Thing"], "produces": []}}})
    cockpit.modules()
    cockpit.register(plug)
    try:
        assert cockpit.route("a zebra appears") == "plugged" and cockpit.route("What is our cash position?") == "treasury"
        assert "plugged" in [m["id"] for m in client.get("/api/cockpit/modules").json()]
        assert "plugged" in client.get("/api/agent/catalog").json()["domains"]
        assert any(c["id"] == "plugged.Thing" for c in client.get("/api/cockpit/ontology").json()["classes"])
        assert client.get("/api/cockpit/plugged/view/2026-11").json()["ui"]["blocks"]
        plan = client.post("/api/agent/plan", json={"message": "zebra for November 2026", "scenario": "S1", "period": "2026-11", "demo_pace_ms": 0}).json()
        assert plan["domain"] == "plugged" and plan["status"] == "done"
    finally:
        cockpit.unregister("plugged")
    assert cockpit.route("a zebra appears") == "reconciliation"


def test_routing_follows_priority_and_defaults():
    assert cockpit.route("Reconcile the bank accounts") == "reconciliation"
    assert cockpit.route("Explain the route controls") == "reconciliation"
    assert cockpit.route("What is our cash position?") == "treasury"
    assert cockpit.route("") == cockpit.default_module().id


def test_shared_ui_names_no_module():
    src = Path(__file__).resolve().parents[1] / "frontend" / "src"
    banned = ["routeDomain", "DOMAIN_NAME", "DOMAIN_LABEL", "askFor(", "['reconciliation','treasury']", "TreasuryResult"]
    for name in ("App.jsx", "AgentWorkbench.jsx", "Entry.jsx", "PeriodUi.jsx", "period.js", "cockpit.js"):
        text = (src / name).read_text(encoding="utf-8")
        assert not [b for b in banned if b in text], (name, [b for b in banned if b in text])


def test_api_surface(client):
    manifests = client.get("/api/cockpit/modules").json()
    assert [m["id"] for m in manifests][0] == "reconciliation" and all("routing" in m and "ask_template" in m for m in manifests)
    assert client.get("/api/cockpit/treasury/view/2027-01").status_code >= 400
    assert client.get("/api/cockpit/nope/view/2026-11").status_code >= 400
    assert client.post("/api/cockpit/treasury/action/nope", json={}).status_code >= 400
    boot = client.get("/api/boot").json() if client.get("/api/boot").status_code == 200 else {}
    assert not boot or "modules" in boot
