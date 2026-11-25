"""Architecture V5.1: the canonical scenario model, its diagrams, and the guarantee that the UI reads only the model."""
import copy
import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

from poc import architecture_model as m

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend" / "src"


def test_model_has_no_violations():
    assert m.validate() == []


def test_exactly_three_scenarios_with_every_required_field():
    assert tuple(m.SCENARIOS) == ("S1", "S2", "S3")
    required = {"objective", "agent_runtime", "agent_hosting_owner", "agent_execution_endpoint", "ui_hosting", "mcp_client", "mcp_endpoint_type", "mcp_gateway",
                "custom_mcp_runtime", "custom_mcp_hosting_owner", "mcp_tool_execution_location", "agent_registry", "mcp_registry", "registry_publisher_approver", "registry_sync",
                "agent_discovery", "mcp_tool_discovery", "agentcore_gateway", "agentcore_runtime", "aws_agent_registry", "llm_gateway", "llm_boundary", "integration_suite",
                "cloud_connector", "backend_authorization", "identity_boundary", "persistence", "monitoring_audit", "artifact_repository", "trust_boundaries", "assumptions",
                "unverified", "policy_dependencies"}
    for sid, sc in m.SCENARIOS.items():
        assert required <= set(sc), (sid, required - set(sc))
        assert all(sc[key] not in ("", None, []) for key in required if not isinstance(sc[key], bool)), sid


def test_s1_is_sap_centric_with_an_honest_registry():
    s = m.SCENARIOS["S1"]
    assert s["agent_runtime"] == "SAP BTP Cloud Foundry" and "Cloud Foundry" in s["custom_mcp_runtime"]
    assert "Apigee" in s["mcp_gateway"] and s["llm_gateway"] == "Portkey"
    assert not (s["agentcore_runtime"] or s["agentcore_gateway"] or s["aws_agent_registry"])
    assert s["agent_registry"] == m.UNRESOLVED == s["mcp_registry"] and "pending" in m.UNRESOLVED


def test_s2_keeps_agentcore_runtime_gateway_and_registry_distinct():
    s = m.SCENARIOS["S2"]
    assert s["agent_runtime"] == "AWS AgentCore Runtime" and "AgentCore Runtime" in s["custom_mcp_runtime"]
    assert s["agentcore_runtime"] and s["agentcore_gateway"] and s["aws_agent_registry"]
    assert "AgentCore Gateway" in s["mcp_gateway"] and "Apigee" in s["mcp_gateway"]  # Apigee stays mandatory as the SAP-facing gateway
    assert s["agent_registry"] == s["mcp_registry"] == "AWS Agent Registry"


def test_s3_registers_in_aws_but_executes_on_sap():
    s = m.SCENARIOS["S3"]
    assert s["agent_runtime"] == "SAP BTP Cloud Foundry" and "Cloud Foundry" in s["custom_mcp_runtime"]
    assert s["agent_registry"] == s["mcp_registry"] == "AWS Agent Registry"
    assert not s["agentcore_runtime"] and not s["agentcore_gateway"]
    assert s["status"].startswith("Preferred candidate") and "POC validation" in s["status"]
    assert "S3-B" in s["variant_b"] and "not baseline" in s["variant_b"]


def test_common_rules_for_all_scenarios():
    for sc in m.SCENARIOS.values():
        assert sc["llm_gateway"] == "Portkey" and "Apigee" in sc["mcp_gateway"]
        assert sc["persistence"].startswith("Conditional") and "conditional" in sc["cloud_connector"].lower()
        assert "SAP backend" in sc["backend_authorization"]
        for value in sc.values():
            if isinstance(value, str):
                assert not m.BAD_GOOGLE.search(value), value


@pytest.mark.parametrize("mutate,expected", [
    (lambda s: s["S3"].update(agentcore_gateway=True), "S3"),
    (lambda s: s["S1"].update(aws_agent_registry=True), "S1"),
    (lambda s: s["S1"].update(agent_registry="AWS Agent Registry"), "unresolved"),
    (lambda s: s["S2"].update(llm_gateway="Vertex AI"), "Portkey"),
    (lambda s: s["S3"].update(agent_runtime="AWS AgentCore Runtime"), "S3"),
    (lambda s: s["S3"].update(persistence="SAP HANA Cloud"), "conditional"),
    (lambda s: s["S2"].update(mcp_gateway="Google Agent Registry"), "Apigee"),
])
def test_validation_rejects_a_corrupted_model(mutate, expected):
    broken = copy.deepcopy(m.SCENARIOS)
    mutate(broken)
    errors = m.validate(broken)
    assert errors and any(expected.lower() in error.lower() for error in errors), errors


def test_diagram_set_is_complete_and_consistent():
    specs = m.diagrams()
    assert list(specs) == ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10"]
    for key, spec in specs.items():
        assert m.validate_diagram(spec) == [], key
        ids = {n["id"] for n in spec["nodes"]}
        assert all(e[0] in ids and e[1] in ids for e in spec["edges"]), key
    # D2..D4 are exactly the scenario diagrams
    assert {specs[k]["scenario"] for k in ("D2", "D3", "D4")} == {"S1", "S2", "S3"}


def test_scenario_diagram_topologies():
    specs = m.diagrams()
    text = {k: " | ".join(f"{n['title']} {n['sub']} {n.get('status', '')}" for n in specs[k]["nodes"]) for k in specs}
    assert "AgentCore" not in text["D2"] and "AWS" not in text["D2"] and "PENDING" in text["D2"]
    assert all(token in text["D3"] for token in ("AgentCore Runtime", "AgentCore Gateway", "AWS Agent Registry", "Apigee", "Portkey"))
    kinds3 = {n["id"] for n in specs["D4"]["nodes"]}
    assert "gw" not in kinds3  # no AgentCore Gateway node in the S3 baseline
    assert "AgentCore Runtime" not in text["D4"] and "AWS Agent Registry" in text["D4"]
    # the S3-B note is the only AgentCore mention, and it is a dashed decision note, not a path component
    s3b = [n for n in specs["D4"]["nodes"] if "AgentCore" in n["title"] + n["sub"]]
    assert [n["id"] for n in s3b] == ["s3b"] and s3b[0]["kind"] == "decision" and s3b[0].get("dashed")


def test_registry_is_never_an_execution_hop_in_any_scenario_diagram():
    for key in ("D1", "D2", "D3", "D4", "D7", "D10"):
        spec = m.diagrams()[key]
        kinds = {n["id"]: n["kind"] for n in spec["nodes"]}
        for a, b, kind, *_ in spec["edges"]:
            if "registry" in (kinds[a], kinds[b]):
                assert kind in ("registry", "approval"), (key, a, b, kind)
        runtime_edges = [(a, b) for a, b, kind, *_ in spec["edges"] if kind == "invoke"]
        assert all("reg" not in a and "reg" not in b for a, b in runtime_edges), key


def test_no_agent_to_sap_backend_and_no_llm_bypass():
    for key, spec in m.diagrams().items():
        for a, b, kind, *_ in spec["edges"]:
            assert not (b == "sap" and kind == "invoke" and a in ("agent", "portkey", "gw", "apigee", "custom")), (key, a, b)
            if b == "llm":
                assert a == "portkey", (key, a)
        # every scenario diagram (D2..D4) reaches the model only through Portkey
    for key in ("D2", "D3", "D4"):
        spec = m.diagrams()[key]
        llm_edges = [(a, b) for a, b, kind, *_ in spec["edges"] if kind == "llm"]
        assert ("agent", "portkey") in llm_edges and ("portkey", "llm") in llm_edges


def test_diagram_rules_catch_violations():
    spec = copy.deepcopy(m.diagrams()["D4"])
    spec["edges"].append(["reg_agent", "agent", "invoke", ""])
    assert any("registry" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D2"])
    spec["nodes"].append({"id": "x", "row": 4, "col": 5, "title": "Google Cloud Run agent", "sub": "", "kind": "agent"})
    assert any("Google" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D3"])
    spec["edges"].append(["agent", "sap", "invoke", ""])
    assert any("direct access" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D2"])
    spec["edges"].append(["agent", "llm", "llm", ""])
    assert any("Portkey" in e for e in m.validate_diagram(spec))


def test_comparison_covers_every_required_dimension_with_three_columns():
    names = " ".join(row[0] for row in m.COMPARISON)
    for need in ("Agent hosting", "Agent execution", "MCP gateway", "Managed MCP endpoint", "Custom MCP server hosting", "MCP tool execution", "Agent registry", "MCP registry", "LLM routing",
                 "Persistence", "Identity propagation", "SAP connectivity", "Business authorization", "Operational responsibility", "Monitoring", "Scalability", "Network complexity",
                 "Cost drivers", "Vendor", "governance", "Deployment prerequisites", "Open architecture decisions"):
        assert need.lower() in names.lower(), need
    assert all(len(row) == 4 for row in m.COMPARISON)
    flat = {row[0]: row for row in m.COMPARISON}
    assert flat["Agent hosting"][1:] == ("SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "SAP BTP Cloud Foundry")
    assert flat["Agent registry"][1] == m.UNRESOLVED and flat["Agent registry"][2] == flat["Agent registry"][3] == "AWS Agent Registry"
    assert flat["LLM routing"][1:] == ("Portkey",) * 3


def test_exported_json_is_current_and_the_ui_reads_only_it():
    target = SRC / "architectureModel.json"
    assert json.loads(target.read_text(encoding="utf-8")) == json.loads(json.dumps(m.export())), "run: python scripts/build_architecture_model.py"
    scenarios_js = (SRC / "mcpScenarios.js").read_text(encoding="utf-8")
    assert "architectureModel.json" in scenarios_js
    # no second, hand-written scenario definition may survive in the frontend
    for name in ("landscapeData.js", "landscapeDiagrams.js"):
        assert not (SRC / name).exists(), name
    assert not (SRC / "diagrams").exists() or not list((SRC / "diagrams").glob("s*.svg"))
    stale = re.compile(r"Google Agent Registry|Vertex|Cloud Run|Agent Engine|Microsoft Foundry hosted|Joule Studio", re.I)
    hits = [f.name for f in SRC.glob("*.js*") if stale.search(f.read_text(encoding="utf-8"))]
    assert hits == [], hits


@pytest.mark.skipif(shutil.which("node") is None, reason="node is not installed")
def test_every_rendered_svg_matches_its_spec(tmp_path):
    result = subprocess.run(["node", str(ROOT / "scripts" / "render_architecture_svgs.mjs"), str(tmp_path)], capture_output=True, text=True, timeout=120)
    assert result.returncode == 0, result.stdout + result.stderr
    assert "ALL DIAGRAMS MATCH THEIR SPEC (10 diagrams)" in result.stdout
    for key in m.diagrams():
        svg = (tmp_path / f"{key}.svg").read_text(encoding="utf-8")
        assert "<svg" in svg and "NOT AN APPROVED ARCHITECTURE" in svg
        assert "Cloud Run" not in svg and "Vertex" not in svg


def test_no_page_or_backend_text_still_uses_the_old_scenario_meaning():
    old = re.compile(r"S1 Apigee|S2 AgentCore|S1 · Apigee|S2 · AgentCore|Combined candidate|S1/S2 simulated|S1 and S2 are simulated|Apigee route|AgentCore route|PTP/PAP|Microsoft Foundry|Joule Studio|Bedrock response", re.I)
    files = [*SRC.glob("*.js"), *SRC.glob("*.jsx"), *(ROOT / "poc").glob("*.py"), *(ROOT / "poc" / "agent_modules").glob("*.py"), ROOT / "streamlit_app.py"]
    hits = {f.name: m.group(0) for f in files if f.name != "architecture_model.py" for m in [old.search(f.read_text(encoding="utf-8"))] if m}
    assert hits == {}, hits
    for doc in ("MCP_HOSTING_GOVERNANCE.md", "POC_LIMITATIONS.md"):
        text = (ROOT / "docs" / doc).read_text(encoding="utf-8")
        assert not re.search(r"API hub|Google Agent Registry|S3 AgentCore-to-Apigee", text), doc
