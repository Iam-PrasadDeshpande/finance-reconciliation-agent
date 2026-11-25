"""Architecture V5.2: the canonical model, its diagrams, the recommendation and cost engines, and the guarantee that the UI reads only the model."""
import copy
import itertools
import json
import re
import shutil
import subprocess
from pathlib import Path

import pytest

from poc import architecture_model as m

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "frontend" / "src"
NODE = shutil.which("node")


def test_model_has_no_violations():
    assert m.validate() == []


def test_exactly_three_scenarios_with_every_required_field():
    assert tuple(m.SCENARIOS) == ("S1", "S2", "S3")
    required = {"objective", "classification", "agent_runtime", "agent_hosting_owner", "agent_execution_endpoint", "ui_hosting", "mcp_client", "mcp_endpoint_type", "mcp_gateway",
                "custom_mcp_runtime", "custom_mcp_hosting_owner", "mcp_tool_execution_location", "agent_registry", "mcp_registry", "registry_publisher_approver", "registry_sync",
                "agent_discovery", "mcp_tool_discovery", "apigee_role", "agentcore_gateway", "agentcore_runtime", "aws_agent_registry", "aws_account", "llm_gateway", "llm_boundary",
                "integration_suite", "cloud_connector", "backend_authorization", "identity_boundary", "persistence", "monitoring_audit", "artifact_repository", "trust_boundaries",
                "assumptions", "unverified", "policy_dependencies", "advantages", "considerations"}
    for sid, sc in m.SCENARIOS.items():
        assert required <= set(sc), (sid, required - set(sc))
        assert all(sc[key] not in ("", None, []) for key in required if not isinstance(sc[key], bool)), sid


def test_s1_is_the_sap_hosted_hybrid():
    s = m.SCENARIOS["S1"]
    assert s["name"].endswith("SAP-hosted hybrid") and s["status"] == "SAP-hosted alternative"
    assert s["agent_runtime"] == "SAP BTP Cloud Foundry" and "Cloud Foundry" in s["custom_mcp_runtime"] and "Apigee" in s["mcp_gateway"]
    assert not (s["agentcore_runtime"] or s["agentcore_gateway"]) and s["aws_agent_registry"]
    assert s["agent_registry"] == s["mcp_registry"] == "AWS Agent Registry"


def test_s2_is_aws_native_with_optional_apigee():
    s = m.SCENARIOS["S2"]
    assert s["agent_runtime"] == "AWS AgentCore Runtime" and "AgentCore Runtime" in s["custom_mcp_runtime"]
    assert s["agentcore_runtime"] and s["agentcore_gateway"] and s["aws_agent_registry"]
    assert "AgentCore Gateway" in s["mcp_gateway"] and s["apigee_role"].startswith("Optional") and "never bypassed silently" in s["apigee_role"]
    assert "API/OpenAPI" in s["mcp_endpoint_type"] and "validated" in s["mcp_tool_execution_location"]


def test_s3_is_the_conditional_preferred_candidate_with_a_dedicated_account():
    s = m.SCENARIOS["S3"]
    assert s["agent_runtime"] == "AWS AgentCore Runtime" and s["apigee_role"].startswith("Required")
    assert "AgentCore Gateway" in s["mcp_gateway"] and "Apigee" in s["mcp_gateway"]
    assert s["status"].startswith("Preferred candidate") and "conditional" in s["status"].lower() and "Not production-approved" in s["classification"]
    assert "Dedicated SAP-agent AWS account" in s["aws_account"] and "not provisioned" in s["aws_account"]
    assert "Pattern A" in s["mcp_endpoint_type"] and "Pattern B" in s["mcp_endpoint_type"]
    assert "never an execution hop" in s["hosting_note"]
    assert re.search(r"unconditional winner|production-ready", " ".join(map(str, s.values())), re.I) is None


def test_common_rules_for_all_scenarios():
    for sid, sc in m.SCENARIOS.items():
        assert sc["llm_gateway"] == "Portkey" and sc["agent_registry"] == sc["mcp_registry"] == "AWS Agent Registry"
        assert sc["persistence"].startswith("Conditional") and "conditional" in sc["cloud_connector"].lower()
        assert "SAP backend" in sc["backend_authorization"] and "GitLab" in sc["artifact_repository"]
        assert not any(m.BAD_GOOGLE.search(v) for v in sc.values() if isinstance(v, str)), sid


@pytest.mark.parametrize("mutate,expected", [
    (lambda s: s["S1"].update(agentcore_gateway=True), "S1"),
    (lambda s: s["S2"].update(apigee_role="Required: always"), "Apigee must be optional"),
    (lambda s: s["S3"].update(apigee_role="Optional"), "S3"),
    (lambda s: s["S3"].update(aws_account="Existing SAP account"), "dedicated"),
    (lambda s: s["S2"].update(llm_gateway="Vertex AI"), "Portkey"),
    (lambda s: s["S3"].update(persistence="SAP HANA Cloud"), "conditional"),
    (lambda s: s["S1"].update(artifact_repository="Organization Git"), "GitLab"),
    (lambda s: s["S3"].update(status="Approved production architecture"), "preferred"),
    (lambda s: s["S1"].update(agent_registry="Domain-managed catalog"), "registries"),
])
def test_validation_rejects_a_corrupted_model(mutate, expected):
    broken = copy.deepcopy(m.SCENARIOS)
    mutate(broken)
    errors = m.validate(broken)
    assert errors and any(expected.lower() in error.lower() for error in errors), errors


def test_diagram_set_is_complete_and_consistent():
    specs = m.diagrams()
    assert list(specs) == [f"D{i}" for i in range(1, 11)]
    for key, spec in specs.items():
        assert m.validate_diagram(spec) == [], key
        ids = {n["id"] for n in spec["nodes"]}
        assert all(e[0] in ids and e[1] in ids for e in spec["edges"]), key
    assert {specs[k]["scenario"] for k in ("D2", "D3", "D4")} == {"S1", "S2", "S3"}


def _texts(spec):
    return " | ".join(f"{n['title']} {n['sub']} {n.get('status', '')}" for n in spec["nodes"])


def test_scenario_diagram_topologies():
    specs = m.diagrams()
    d2, d3, d4 = (specs[k] for k in ("D2", "D3", "D4"))
    assert "AgentCore" not in _texts(d2) and any(n["id"] == "apigee" and not n.get("dashed") for n in d2["nodes"])
    nodes3 = {n["id"]: n for n in d3["nodes"]}
    assert nodes3["apigee"].get("dashed") and nodes3["custom"].get("dashed")  # Apigee optional, custom MCP conditional
    assert any(e[0] == "gw" and e[1] == "int" and e[2] == "invoke" for e in d3["edges"])  # the API-target alternative reaches Integration Suite
    nodes4 = {n["id"]: n for n in d4["nodes"]}
    assert not nodes4["apigee"].get("dashed") and any(e[0] == "gw" and e[1] == "apigee" and e[2] == "invoke" for e in d4["edges"])
    for spec in (d2, d3, d4):
        assert any(e[0] == "gitlab" and e[2] == "deploy" for e in spec["edges"]) and "GitLab" in _texts(spec)
    for spec in (d3, d4):
        assert any(e[0] == "gitlab" and e[1] == "agent" and e[2] == "deploy" for e in spec["edges"])
        assert "AWS SAP-agent account (proposed)" in [b[0] for b in spec["bounds"]]


def test_registry_is_never_an_execution_hop_and_nothing_bypasses_sap_or_portkey():
    for key, spec in m.diagrams().items():
        kinds = {n["id"]: n["kind"] for n in spec["nodes"]}
        for a, b, kind, *_ in spec["edges"]:
            if "registry" in (kinds[a], kinds[b]) and key not in ("D5", "D9"):
                assert kind in ("registry", "approval", "deploy"), (key, a, b, kind)
            assert not (b == "sap" and kind == "invoke" and a in ("agent", "portkey", "gw", "apigee", "custom")), (key, a, b)
            if b == "llm":
                assert a == "portkey", (key, a)
            assert not (kind == "deploy" and kinds[b] == "backend"), (key, a, b)
    for key in ("D2", "D3", "D4"):
        llm = [(a, b) for a, b, kind, *_ in m.diagrams()[key]["edges"] if kind == "llm"]
        assert ("agent", "portkey") in llm and ("portkey", "llm") in llm


def test_diagram_rules_catch_violations():
    spec = copy.deepcopy(m.diagrams()["D4"]); spec["edges"].append(["reg_agent", "agent", "invoke", ""])
    assert any("registry" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D2"]); spec["nodes"].append({"id": "x", "row": 4, "col": 5, "title": "Google Cloud Run agent", "sub": "", "kind": "agent"})
    assert any("Google" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D3"]); spec["edges"].append(["agent", "sap", "invoke", ""])
    assert any("direct access" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D2"]); spec["edges"].append(["agent", "llm", "llm", ""])
    assert any("Portkey" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D3"]); next(n for n in spec["nodes"] if n["id"] == "apigee")["dashed"] = False
    assert any("optional" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D4"]); spec["edges"] = [e for e in spec["edges"] if not (e[0] == "gw" and e[1] == "apigee")]
    assert any("front" in e for e in m.validate_diagram(spec))
    spec = copy.deepcopy(m.diagrams()["D3"]); spec["edges"] = [e for e in spec["edges"] if not (e[0] == "gitlab" and e[1] == "agent")]
    assert any("GitLab must deploy" in e for e in m.validate_diagram(spec))


def test_responsibility_diagram_matches_the_scenario_facts():
    cell = {n["id"]: n["title"] for n in m.diagrams()["D5"]["nodes"]}
    for col, sid in enumerate(("S1", "S2", "S3"), start=1):
        sc = m.SCENARIOS[sid]
        assert cell[f"c0_{col}"] == sc["agent_runtime"] and cell[f"c1_{col}"] == sc["agent_registry"] and cell[f"c3_{col}"] == sc["mcp_registry"]
        assert ("AgentCore Gateway" in cell[f"c4_{col}"]) == sc["agentcore_gateway"] and cell[f"c5_{col}"] == sc["llm_gateway"]


def test_comparison_covers_every_dimension_with_three_columns():
    names = " ".join(row[0] for row in m.COMPARISON).lower()
    for need in ("classification", "agent hosting", "agent execution", "aws account", "runtime gateway", "apigee", "managed mcp endpoint", "custom mcp server hosting", "mcp tool execution", "agent registry",
                 "mcp registry", "llm routing", "persistence", "identity propagation", "sap connectivity", "business authorization", "operational responsibility", "monitoring", "scalability",
                 "network complexity", "cost drivers", "vendor", "governance", "deployment prerequisites", "open architecture decisions"):
        assert need in names, need
    flat = {row[0]: row for row in m.COMPARISON}
    assert all(len(row) == 4 for row in m.COMPARISON)
    assert flat["Agent hosting"][1:] == ("SAP BTP Cloud Foundry", "AWS AgentCore Runtime", "AWS AgentCore Runtime")
    assert flat["Apigee"][1].startswith("Required") and flat["Apigee"][2].startswith("Optional") and flat["Apigee"][3].startswith("Required")
    assert flat["LLM routing"][1:] == ("Portkey",) * 3 and flat["Classification"][3].startswith("Preferred candidate")


# --------------------------------------------------------------------------- recommendation
def _case(**kw):
    base = {"aws_account": "approved", "agentcore": "available", "apigee": "required", "identity": "validated", "interop": "validated", "cost": "s3_competitive", "ops": "agreed",
            "sap_hosting": "permitted", "sap_coupling": "medium", "security": "none", "workload": "low_frequency"}
    base.update(kw)
    return m.recommend(base)


def test_default_state_holds_and_never_selects():
    r = m.recommend()
    assert r["status"] == "HOLD" and r["scenario"] is None and r["selectable"] is False and r["evaluate_first"] == "S3"
    assert "Dedicated SAP-agent AWS account approval" in r["missing_evidence"]


def test_s3_is_recommended_only_when_every_condition_holds():
    r = _case()
    assert (r["scenario"], r["status"], r["selectable"]) == ("S3", "RECOMMENDED", True)
    for change, reason in [({"aws_account": "pending"}, "account"), ({"agentcore": "pending"}, "AgentCore"), ({"ops": "pending"}, "Operational"), ({"apigee": "undecided"}, "Apigee")]:
        r = _case(**change)
        assert r["status"] == "HOLD" and r["selectable"] is False and any(reason in x for x in r["missing_evidence"]), change
    for change, need in [({"identity": "pending"}, "identity"), ({"interop": "pending"}, "interoperability"), ({"cost": "unknown"}, "cost")]:
        r = _case(**change)
        assert (r["scenario"], r["status"], r["selectable"]) == ("S3", "CONDITIONAL", False) and any(need in x.lower() for x in r["missing_evidence"]), change


def test_s3_falls_back_with_reasons_when_validation_or_cost_fails():
    assert _case(identity="failed")["scenario"] == "S1" and _case(identity="failed")["status"] == "CONDITIONAL"
    assert _case(interop="failed", sap_hosting="restricted")["status"] == "HOLD"
    r = _case(cost="s1_cheaper")
    assert r["scenario"] == "S1" and any("cheaper" in x[1] for x in r["rejected"] if x[0] == "S3")
    r = _case(cost="s2_cheaper")
    assert r["scenario"] == "S2" and r["status"] == "CONDITIONAL" and any("exception" in c for c in r["conditions"])


def test_s2_is_the_simpler_choice_when_apigee_is_not_mandated():
    for apigee in ("not_required", "optional"):
        r = _case(apigee=apigee, cost="s2_cheaper")
        assert (r["scenario"], r["status"]) == ("S2", "RECOMMENDED"), apigee
    assert _case(apigee="not_required", cost="unknown")["status"] == "CONDITIONAL"
    assert _case(apigee="not_required", identity="failed")["status"] == "HOLD"


def test_s1_when_aws_is_unavailable_or_restricted():
    for change in ({"aws_account": "denied"}, {"agentcore": "unavailable"}, {"security": "sap_only_execution"}, {"security": "no_cross_cloud"}):
        r = _case(**change)
        assert (r["scenario"], r["status"]) == ("S1", "RECOMMENDED"), change
        assert {x[0] for x in r["rejected"]} == {"S2", "S3"}
    assert _case(aws_account="denied", sap_hosting="restricted")["status"] == "HOLD"
    assert _case(aws_account="denied", ops="pending")["status"] == "CONDITIONAL"


def test_high_frequency_never_concludes_that_aws_is_cheaper():
    r = _case(workload="high_frequency")
    assert any("does not by itself make AWS cheaper" in x for x in r["reasons"])
    assert _case(workload="high_frequency", cost="unknown")["status"] == "CONDITIONAL"


def test_recommendation_always_names_authority_and_revisit_triggers():
    r = m.recommend()
    assert "AI Foundry" in r["authority"] and len(r["revisit"]) >= 5
    assert m.SELECTION_RULES[-1][0] == "Hold rule"


@pytest.mark.skipif(NODE is None, reason="node is not installed")
def test_javascript_engines_agree_with_python(tmp_path):
    keys = ["aws_account", "agentcore", "apigee", "identity", "interop", "cost", "ops", "sap_hosting", "security", "workload"]
    options = {i["id"]: [o[0] for o in i["options"]] for i in m.SELECTION_INPUTS}
    cases = [dict(zip(keys, combo)) for combo in itertools.islice(itertools.product(*[options[k] for k in keys]), 0, None, 997)]
    cases += [{}, {"aws_account": "approved", "agentcore": "available", "ops": "agreed", "identity": "validated", "interop": "validated", "cost": "s3_competitive"}]
    expected = [m.recommend(c) for c in cases]
    volumes = {"runtime": 100, "gateway": 1000, "apigee": 1000, "integration": 1000, "llm": 50}
    rates = {"runtime": {"S1": 3, "S2": 2, "S3": 2}, "gateway": {"S2": 0.01, "S3": 0.01}, "apigee": {"S1": 0.02, "S3": 0.02}, "integration": {"S1": 0.5, "S2": 0.5, "S3": 0.5}, "llm": {"S1": 1, "S2": 1, "S3": 1}}
    cost_expected = {"est": m.estimate(volumes, rates), "be": m.break_even(volumes, rates, "runtime", "S1", "S3")}
    script = tmp_path / "parity.mjs"
    script.write_text("import {recommend,estimate,breakEven} from " + json.dumps((SRC / "selectionEngine.js").as_uri()) + ";\nimport fs from 'node:fs';\n"
                      "const d=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));\n"
                      "const out={recs:d.cases.map(c=>recommend(d.selection,c)),est:estimate(d.components,d.volumes,d.rates),be:breakEven(d.components,d.volumes,d.rates,'runtime','S1','S3')};\n"
                      "console.log(JSON.stringify(out));\n", encoding="utf-8")
    data = tmp_path / "in.json"
    data.write_text(json.dumps({"cases": cases, "selection": {"defaults": m.SELECTION_DEFAULTS, "authority": m.AUTHORITY, "revisit": m.REVISIT}, "volumes": volumes, "rates": rates, "components": m.COST_COMPONENTS}), encoding="utf-8")
    result = subprocess.run([NODE, str(script), str(data)], capture_output=True, text=True, timeout=120)
    assert result.returncode == 0, result.stderr
    out = json.loads(result.stdout)
    assert len(out["recs"]) == len(expected) and out["recs"] == json.loads(json.dumps(expected))
    assert out["est"] == json.loads(json.dumps(cost_expected["est"])) and out["be"] == cost_expected["be"]


# --------------------------------------------------------------------------- cost model
def test_cost_model_has_no_rates_and_never_guesses():
    assert {c["id"] for c in m.COST_COMPONENTS} >= {"runtime", "idle", "gateway", "apigee", "integration", "connector", "llm", "egress", "persistence", "observability", "registry", "support", "dr"}
    assert [p[0] for p in m.WORKLOAD_PROFILES] == ["low_frequency", "high_frequency", "bursty", "long_running", "multi_agent"]
    out = m.estimate({}, {})
    assert all(out[sid]["total"] is None and out[sid]["missing"] for sid in out)
    assert "never invented" in m.COST_NOTE and "BTP credit" in m.COST_NOTE
    assert not any(k in json.dumps(m.COST_COMPONENTS).lower() for k in ("usd", "$", "eur"))


def test_cost_estimate_is_the_sum_of_volume_times_rate_and_only_for_applicable_layers():
    comps = {c["id"]: c for c in m.COST_COMPONENTS}
    assert "S1" not in comps["gateway"]["applies"] and "S2" not in comps["apigee"]["applies"]
    volumes = {c["id"]: 10 for c in m.COST_COMPONENTS}
    rates = {c["id"]: {sid: 2 for sid in c["applies"]} for c in m.COST_COMPONENTS}
    out = m.estimate(volumes, rates)
    for sid in m.SCENARIO_IDS:
        applicable = [c for c in m.COST_COMPONENTS if sid in c["applies"]]
        assert out[sid]["total"] == 20 * len(applicable)
    rates["runtime"]["S1"] = None
    assert m.estimate(volumes, rates)["S1"]["total"] is None


def test_break_even_is_solved_from_the_inputs():
    volumes = {c["id"]: 0 for c in m.COST_COMPONENTS} | {"gateway": 100, "apigee": 100}
    rates = {c["id"]: {sid: 0 for sid in c["applies"]} for c in m.COST_COMPONENTS}
    rates["runtime"] = {"S1": 5, "S2": 1, "S3": 1}
    rates["gateway"] = {"S2": 1, "S3": 1}
    rates["apigee"] = {"S1": 1, "S3": 1}
    # S1 = 5x + 100 ; S3 = x + 200 -> equal at x = 25
    assert m.break_even(volumes, rates, "runtime", "S1", "S3") == 25
    assert m.break_even(volumes, {**rates, "runtime": {"S1": 1, "S2": 1, "S3": 1}}, "runtime", "S1", "S3") is None
    assert m.break_even({}, rates, "runtime", "S1", "S3") is None
    partial = {k: v for k, v in rates.items() if k != "idle"}
    assert m.break_even(volumes, partial, "runtime", "S1", "S3") is None


# --------------------------------------------------------------------------- governance content
def test_gateway_identity_account_and_guardrail_content():
    rows = {r[0]: r for r in m.GATEWAY_RESPONSIBILITIES}
    assert len(rows) == 9 and "Apigee is not arbitrary agent-code hosting" in rows["SAP-facing MCP/API exposure"][3]
    assert "correlation id" in rows["Telemetry"][3] and "no caller passthrough" in rows["Outbound credentials"][1]
    assert [r[0] for r in m.IDENTITY_CHAIN] == ["Business user", "Agent workload", "MCP client", "Gateway / service", "SAP integration", "SAP backend"]
    assert "not proof of propagation" in m.IDENTITY_CHAIN[0][2]
    assert "NOT PROVISIONED" in m.ACCOUNT["status"] and "Dedicated account within the approved AWS Organization" in m.ACCOUNT["evaluate"]
    assert len(m.ACCOUNT["evaluate"]) == 15 and any("Resource Access Manager" in x for x in m.ACCOUNT["registry_sharing"])
    assert "duplicate registry" in m.ACCOUNT["qualification"]
    assert len(m.LIFECYCLE) == 12 and m.LIFECYCLE[0] == "Use-case intake" and m.LIFECYCLE[-1] == "Monitoring and lifecycle management"
    assert any("registered skill never grants" in g for g in m.GUARDRAILS) and any("Portkey" in g for g in m.GUARDRAILS)
    assert len(m.POC_VALIDATIONS) == 17 and len(m.RACI) >= 6


def test_decision_register_records_the_owner_answers_and_what_is_open():
    ids = {d["id"]: d for d in m.DECISIONS}
    assert set(ids) == {"aws_account", "registry_ownership", "gateway_interop", "identity", "cost_evidence", "apigee_policy"}
    for d in m.DECISIONS:
        assert d["settled"] and d["remaining"] and d["options"] and d["proposal"] and d["proof"] and d["owner"] and d["answers"], d["id"]
        assert all(state in m.ANSWER_STATES for _, _, state in d["answers"])
    assert sum(1 for d in m.DECISIONS for _, _, s in d["answers"] if s == "DECIDED") == 1  # GitLab as the central platform
    assert any(q for q, a, s in ids["gateway_interop"]["answers"] if s == "OPEN" and "reachable from AWS" in q)
    assert m.decision_summary()["OPEN"] >= 6
    shared = [v for v in m.MCP_PROTOCOL_VERSIONS["agentcore_gateway"] if v in m.MCP_PROTOCOL_VERSIONS["apigee"]]
    assert shared == ["2026-07-28", "2025-11-25", "2025-06-18", "2025-03-26"] and all(v in ids["gateway_interop"]["settled"][0] for v in shared)


def test_evidence_records_what_could_and_could_not_be_read():
    by_title = {row[1]: row for row in m.EVIDENCE}
    assert "Python" in by_title["SAP BTP Cloud Foundry runtime"][3]
    assert "reverts the record to draft" in by_title["Registry: synchronize external records"][3]
    assert "do not say that a target blocks calls that bypass the gateway" in by_title["AgentCore Policy"][3]
    assert "NOT_VERIFIED" in m.EVIDENCE_STATUS and "Resource Access Manager" in m.EVIDENCE_STATUS


# --------------------------------------------------------------------------- the UI reads only the model
def test_exported_json_is_current_and_the_ui_reads_only_it():
    assert json.loads((SRC / "architectureModel.json").read_text(encoding="utf-8")) == json.loads(json.dumps(m.export())), "run: python scripts/build_architecture_model.py"
    assert "architectureModel.json" in (SRC / "mcpScenarios.js").read_text(encoding="utf-8")
    for name in ("landscapeData.js", "landscapeDiagrams.js"):
        assert not (SRC / name).exists(), name
    stale = re.compile(r"Google Agent Registry|Vertex AI|Google Cloud Run|Agent Engine|Microsoft Foundry hosted|Joule Studio")
    assert [f.name for f in SRC.glob("*.js*") if stale.search(f.read_text(encoding="utf-8"))] == []


@pytest.mark.skipif(NODE is None, reason="node is not installed")
def test_every_rendered_svg_matches_its_spec(tmp_path):
    result = subprocess.run([NODE, str(ROOT / "scripts" / "render_architecture_svgs.mjs"), str(tmp_path)], capture_output=True, text=True, timeout=120)
    assert result.returncode == 0, result.stdout + result.stderr
    assert "ALL DIAGRAMS MATCH THEIR SPEC (10 diagrams)" in result.stdout and "CLIPPED" not in result.stdout
    for key in m.diagrams():
        svg = (tmp_path / f"{key}.svg").read_text(encoding="utf-8")
        assert "NOT AN APPROVED ARCHITECTURE" in svg and "Cloud Run" not in svg


OLD = re.compile(r"S1 SAP-centric|SAP-centric|S3-B|interim GitLab catalog|GitLab catalog|product selection pending|Domain-managed catalog|registry product unresolved|S1 Apigee|S2 AgentCore (?:route|gateway)|"
                 r"Combined candidate|PTP/PAP|\bMicrosoft\b|\bEntra\b|\bAzure\b|Joule Studio|Bedrock response")


def test_no_page_or_backend_text_still_uses_an_older_scenario_meaning():
    files = [*SRC.glob("*.js"), *SRC.glob("*.jsx"), *(ROOT / "poc").glob("*.py"), *(ROOT / "poc" / "agent_modules").glob("*.py"), ROOT / "streamlit_app.py"]
    hits = {f.name: m_.group(0) for f in files if f.name != "architecture_model.py" for m_ in [OLD.search(f.read_text(encoding="utf-8"))] if m_}
    assert hits == {}, hits


def test_current_documents_use_the_v5_2_scenario_meaning():
    current = ["README.md", "HANDOVER.md", "CLAUDE.md", "FIRST_TASK_FOR_CLAUDE.txt", "docs/ARCHITECTURE_V5_2.md", "docs/ARCHITECTURE_MAPPING.md", "docs/POC_LIMITATIONS.md", "docs/MCP_HOSTING_GOVERNANCE.md",
               "docs/LOCAL_LAPTOP_GUIDE.md", "docs/COCKPIT_ARCHITECTURE.md", "docs/POC_PROOF_AND_ENTITLEMENT_CHECKLIST.md", "docs/AWS_ACCOUNT_AND_GOVERNANCE.md", "docs/COST_MODEL.md"]
    hits = {}
    for name in current:
        path = ROOT / name
        if not path.exists():
            continue
        found = OLD.search(path.read_text(encoding="utf-8"))
        if found:
            hits[name] = found.group(0)
    assert hits == {}, hits


def test_s3_is_a_real_runnable_scenario_end_to_end(tmp_path):
    from poc.contracts import AgentManifest, ReconciliationRequest
    from poc.foundry import FoundrySimulator
    from poc.gateway import GATES
    from poc.runtime import RuntimeSimulator
    from poc.store import Store
    assert GATES == {"S1": ("apigee",), "S2": ("agentcore",), "S3": ("agentcore", "apigee")}
    store = Store(tmp_path / "s3.sqlite3")
    FoundrySimulator(store).create(AgentManifest(version="v52-test", tool_bindings=["sap.read", "databricks.read", "sap.post"]))
    runtime = RuntimeSimulator(store)
    out = {sid: runtime.reconcile(ReconciliationRequest(scenario=sid, company_code="1000", ledger="0L", period="2026-11", currency="USD")) for sid in ("S1", "S2", "S3")}
    assert out["S1"]["variance"]["amount"] == out["S2"]["variance"]["amount"] == out["S3"]["variance"]["amount"]
    touched = {sid: {e["target_component_id"] for e in store.events(r["case_id"])} for sid, r in out.items()}
    assert "agentcore_gateway" not in touched["S1"] and "apigee_gateway" in touched["S1"]
    assert "agentcore_gateway" in touched["S2"] and "apigee_gateway" not in touched["S2"]
    assert "agentcore_gateway" in touched["S3"] and "apigee_gateway" in touched["S3"]


def test_treasury_reads_follow_each_scenario_gateway_chain(tmp_path):
    from poc.store import Store
    from poc.treasury_agents import _read_chain
    store = Store(tmp_path / "t.sqlite3")
    seen = {}
    for sid in ("S1", "S2", "S3"):
        _read_chain(store, f"case-{sid}", sid, "get_opening_balances", lambda: {"ok": True})
        seen[sid] = [e["target_component_id"] for e in store.events(f"case-{sid}") if e["direction"] == "request"]
    assert "agentcore_gateway" not in seen["S1"] and "apigee_gateway" not in seen["S2"]
    assert seen["S3"].index("agentcore_gateway") < seen["S3"].index("apigee_gateway") < seen["S3"].index("sap_read_tool")
    assert seen["S2"].index("agentcore_gateway") < seen["S2"].index("sap_read_tool") and seen["S1"].index("apigee_gateway") < seen["S1"].index("sap_read_tool")
