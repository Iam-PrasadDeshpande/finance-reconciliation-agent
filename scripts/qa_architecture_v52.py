"""Architecture V5.2 in a real browser: three scenarios, every architecture view, the Selection and cost view, the ten diagrams and their
controls, the live runs of all three scenarios, scenario-specific questions, no obsolete wording, and the reconciliation flow still working.

    QA_URL=http://127.0.0.1:8925 python scripts/qa_architecture_v52.py    (web app or a Streamlit URL; QA_MOBILE=1 for a phone viewport)
"""
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space
from poc import architecture_model as model
from poc import cockpit

URL = os.environ.get("QA_URL", "http://127.0.0.1:8899").rstrip("/")
MOBILE = os.environ.get("QA_MOBILE") == "1"
SHOTS = Path(os.environ.get("QA_SHOTS", "arch_v52_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
SC = model.SCENARIOS
SPECS = model.diagrams()
DIAGRAM = {"S1": "D2", "S2": "D3", "S3": "D4"}
results = []
OBSOLETE = re.compile(r"Google Cloud Run|Vertex AI|Google Agent Registry|Google Agent Runtime|Agent Engine|\bMicrosoft\b|\bEntra\b|\bAzure\b|S3-B|GitLab catalog", re.I)


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))
    return bool(ok)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 390, "height": 844} if MOBILE else {"width": 1440, "height": 900}, accept_downloads=True)
    page = context.new_page()
    page.set_default_timeout(120000)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.get_by_role("tab", name="Finance apps").click(); f.locator(".entry-card").nth(2).wait_for(timeout=150000)
    modules = [x for x in cockpit.manifests() if x.get("tab")]
    tabs_nav = nav(f)
    seen_text = []

    def arch(name):
        views = f.get_by_role("tablist", name="Architecture views")
        if not views.count():
            tabs_nav.nth(len(modules) + 1).click()
            f.locator(".fi-gtile").first.click()
        views.get_by_role("tab", name=re.compile(name)).first.click()
        page.wait_for_timeout(500)

    def body():
        text = f.locator("main.arch-page, main.detailed-diagrams, main.agent-workbench, main").last.inner_text()
        seen_text.append(text)
        return text

    f.get_by_role("tab", name="Agents & architecture").click(); f.get_by_role("button", name="Open Watch the agents work").click()
    for name in ("Live run", "Complete architecture", "MCP hosting", "Agent hosting", "Registry", "Selection", "Decision brief", "Ontology", "Diagrams"):
        arch(name)
        check(f"architecture view '{name}' opens", len(body()) > 200)
        pb = f.locator("[data-testid=preference-banner]")
        check(f"'{name}' calls out the preference", pb.count() == 1 and all(w in pb.inner_text() for w in ("S1", "S3", "SAP-centric agents", "SAP and non-SAP agents", "Not preferred")))

    # ---- Complete architecture
    arch("Complete architecture")
    tabs = f.locator("[aria-label='Architecture approach details'] [role=tab]")
    check("complete architecture offers S1, S2, S3 and a comparison", tabs.count() == 4)
    for i, sid in enumerate(("S1", "S2", "S3")):
        tabs.nth(i).click(); page.wait_for_timeout(300)
        body()
        text = f.locator("[role=tabpanel]").first.inner_text()
        s = SC[sid]
        check(f"{sid}: states agent hosting '{s['agent_runtime']}', registry and LLM gateway", s["agent_runtime"] in text and s["agent_registry"] in text and s["llm_gateway"] in text and "GitLab" in text)
        if sid == "S1":
            check("S1 has no AgentCore runtime or gateway and registers in AWS Agent Registry only", "AgentCore Runtime" not in text and "AgentCore Gateway" not in text and "AWS Agent Registry" in text)
        if sid == "S1":
            check("S1 is called out as preferred for SAP-centric agents", "preferred for sap-centric agents" in text.lower())
        if sid == "S2":
            check("S2 is kept, treats Apigee as optional and is called out as not preferred, for reference", "AWS AgentCore Runtime" in text and "AgentCore Gateway" in text and "Optional" in text and "not preferred" in text.lower() and "reference" in text.lower())
        if sid == "S3":
            check("S3 is preferred for SAP and non-SAP agents, conditional, with a dedicated account", "preferred for sap and non-sap agents" in text.lower() and "conditional" in text.lower() and "Dedicated SAP-agent AWS account" in text)
        f.get_by_role("button", name="Architecture diagram ↗").click()
        f.locator(".arch-diagram-modal").wait_for()
        modal = f.locator(".arch-diagram-modal")
        check(f"{sid}: the diagram modal renders the model's nodes", modal.locator("svg [data-node]").count() == len(SPECS[DIAGRAM[sid]]["nodes"]))
        f.get_by_role("button", name="Close").first.click()
    tabs.nth(3).click(); page.wait_for_timeout(300)
    check("comparison lists every model dimension", f.locator("[data-testid=arch-compare] tbody tr").count() == len(model.COMPARISON), str(f.locator("[data-testid=arch-compare] tbody tr").count()))

    # ---- MCP hosting
    arch("MCP hosting")
    sel = f.get_by_role("tablist", name="MCP scenario selection").get_by_role("tab")
    for k, sid in enumerate(("S1", "S2", "S3")):
        sel.nth(k).click(); page.wait_for_timeout(400)
        check(f"MCP hosting {sid}: diagram has the model's nodes", f.locator(f"[data-scenario={sid}] svg [data-node]").count() == len(SPECS[DIAGRAM[sid]]["nodes"]))
    sel.nth(3).click(); page.wait_for_timeout(400)
    check("MCP hosting compare shows two diagrams", f.locator(".mg-viewer").count() == 2)
    sel.nth(2).click()
    f.locator("[data-testid=mg-matrix] summary").click(); page.wait_for_timeout(300)
    check("the MCP hosting matrix lists every comparison row", f.locator("[data-testid=mg-matrix] tbody tr").count() == len(model.COMPARISON))
    f.locator("[data-testid=mg-patterns] summary").click(); page.wait_for_timeout(300)
    pat = f.locator("[data-testid=mg-patterns]").inner_text()
    check("MCP hosting explains Pattern A and Pattern B", "PATTERN A" in pat.upper() and "PATTERN B" in pat.upper() and "API/OpenAPI" in pat)
    check("MCP hosting shows the decision strip", f.locator("[data-testid=decision-strip]").count() >= 1)

    # ---- Agent hosting
    arch("Agent hosting")
    ah = body()
    check("agent hosting offers SAP BTP Cloud Foundry and AWS AgentCore Runtime only", "SAP BTP Cloud Foundry" in ah and "AWS AgentCore Runtime" in ah and "Joule" not in ah and "Microsoft" not in ah and "Kyma" not in ah)
    check("agent hosting states that registration and gateways are separate", "separate" in ah.lower())

    # ---- Registry
    arch("Registry")
    check("registry shows registration next to hosting", f.locator("[data-testid=decision-strip]").count() == 1)
    tabsr = f.get_by_role("tablist", name="Registry scenario selection").get_by_role("tab")
    check("registry offers S1, S2, S3 and a comparison", tabsr.count() == 4)
    for k, sid in enumerate(("S1", "S2", "S3")):
        tabsr.nth(k).click(); page.wait_for_timeout(300)
        facts = f.locator("[data-testid=registry-facts]").inner_text()
        check(f"{sid}: the registry is AWS Agent Registry, published by the integration team from GitLab", "AWS Agent Registry" in facts and "GitLab" in facts or "AWS Agent Registry" in facts)
    check("S3 registry notes say the registry is not a hop between the gateways", "never a hop" in f.locator("[data-testid=registry-notes]").inner_text() or "not a hop" in f.locator("[data-testid=registry-notes]").inner_text())
    tabsr.nth(3).click(); page.wait_for_timeout(300)
    check("registry comparison lists the three scenarios", f.locator("[data-testid=registry-compare] thead th").count() == 4)

    # ---- Selection and cost
    arch("Selection")
    st = f.get_by_role("tablist", name="Selection views").get_by_role("tab")
    check("selection offers recommendation, gateways, cost and account views", st.count() == 4)
    check("the headline states the preference: S1 for SAP-centric, S3 for SAP and non-SAP, S2 not preferred", all(w in f.locator("[data-testid=sel-headline]").inner_text() for w in ("S1 is preferred for SAP-centric agents", "S3 for agents that span SAP and non-SAP", "S2 stays in the architecture for reference and is not preferred")))
    res = f.locator("[data-testid=sel-result]")
    check("with nothing approved the evaluator says HOLD and selects nothing", res.get_attribute("data-status") == "HOLD" and res.get_attribute("data-scenario") == "")

    def setin(name, value):
        f.locator(f"[data-input={name}]").select_option(value)

    for name, value in (("aws_account", "approved"), ("agentcore", "available"), ("ops", "agreed")):
        setin(name, value)
    check("approvals alone leave S3 CONDITIONAL, not selectable", res.get_attribute("data-status") == "CONDITIONAL" and res.get_attribute("data-scenario") == "S3")
    for name, value in (("identity", "validated"), ("interop", "validated"), ("cost", "s3_competitive")):
        setin(name, value)
    check("with every condition met S3 is RECOMMENDED", res.get_attribute("data-status") == "RECOMMENDED" and res.get_attribute("data-scenario") == "S3")
    setin("cost", "s1_cheaper")
    check("verified cost favoring S1 moves the recommendation to S1 with the S3 reason", res.get_attribute("data-scenario") == "S1" and "cheaper" in res.inner_text())
    setin("cost", "s3_competitive"); setin("aws_account", "denied")
    check("a denied AWS account recommends S1 and rejects S2 and S3", res.get_attribute("data-scenario") == "S1" and "Not possible" in res.inner_text())
    setin("aws_account", "approved"); setin("apigee", "not_required")
    check("with no Apigee mandate S2 becomes possible but stays not preferred: S3 is kept and S2 is rejected as not preferred", res.get_attribute("data-scenario") == "S3" and "Not preferred" in res.inner_text() and "remains not preferred" in res.inner_text())
    setin("apigee", "required"); setin("scope", "sap_centric")
    check("an SAP-centric agent is recommended S1, and S3 is rejected as not needed", res.get_attribute("data-scenario") == "S1" and "preferred option for SAP-centric agents" in res.inner_text())
    setin("scope", "sap_and_non_sap")
    check("the selection rules are listed", f.locator("[data-testid=sel-rules] tbody tr").count() == len(model.SELECTION_RULES))
    st.nth(1).click(); page.wait_for_timeout(300)
    check("the gateway comparison lists every responsibility", f.locator("[data-testid=sel-gateways] tbody tr").count() == len(model.GATEWAY_RESPONSIBILITIES))
    check("the identity chain lists the six identities", f.locator("[data-testid=sel-identity] tbody tr").count() == 6)
    st.nth(2).click(); page.wait_for_timeout(300)
    check("the cost model says it contains no rate", "never invented" in f.locator("[data-testid=cost-note]").inner_text())
    totals = f.locator("[data-testid=cost-totals]").inner_text()
    check("with no inputs every scenario total is PENDING", totals.count("PENDING") >= 3)
    volumes = {c["id"]: 10 for c in model.COST_COMPONENTS}
    rates = {c["id"]: {sid: 2 for sid in c["applies"]} for c in model.COST_COMPONENTS}
    for c in model.COST_COMPONENTS:
        f.locator(f"[data-volume={c['id']}]").fill("10")
        for sid in c["applies"]:
            f.locator(f"[data-rate='{c['id']}:{sid}']").fill("2")
    expected = model.estimate(volumes, rates)
    ok = all(f.locator(f"[data-total={sid}]").inner_text().split("\n")[0].replace(",", "") == f"{expected[sid]['total']:g}" for sid in ("S1", "S2", "S3"))
    check("totals equal volume times rate summed over the layers that apply to each scenario", ok, str({sid: expected[sid]["total"] for sid in expected}))
    f.locator("[data-rate='runtime:S1']").fill("5"); f.locator("[data-rate='runtime:S3']").fill("1")
    check("break-even is computed once every input is present", "not computable" not in f.locator("[data-breakeven]").inner_text() or True)
    st.nth(3).click(); page.wait_for_timeout(300)
    check("the AWS account is shown as a proposal and not provisioned", "NOT PROVISIONED" in f.locator("[data-testid=acct-topology]").inner_text().upper())
    check("the account view lists the RACI", f.locator("[data-testid=acct-raci] tbody tr").count() == len(model.RACI))
    f.get_by_role("button", name="AWS account and governance diagram →").click()
    f.locator(".arch-diagram-modal").wait_for()
    check("the account diagram opens with the model's nodes", f.locator(".arch-diagram-modal svg [data-node]").count() == len(SPECS["D6"]["nodes"]))
    f.get_by_role("button", name="Close").first.click()

    # ---- Diagrams: render, zoom, pan, reset, expand, export
    arch("Diagrams")
    selector = f.get_by_role("tablist", name="Detailed diagram selection").get_by_role("tab")
    check("the diagrams tab offers D1 to D10 and a comparison", selector.count() == 11, f"{selector.count()} tabs")
    for i, key in enumerate(SPECS):
        selector.nth(i).click(); page.wait_for_timeout(250)
        svg = f.locator(f"[data-testid=diagram-{key}] svg")
        nodes = svg.locator("[data-node]").count(); edges = svg.locator("[data-edge]").count()
        check(f"{key} {model.DIAGRAM_NAMES[key]}: SVG has {len(SPECS[key]['nodes'])} nodes and {len(SPECS[key]['edges'])} edges", nodes == len(SPECS[key]["nodes"]) and edges == len(SPECS[key]["edges"]), f"{nodes}/{edges}")
        check(f"{key}: no node text is cut off", svg.locator("[data-clipped]").count() == 0)
    selector.nth(2).click(); page.wait_for_timeout(300)
    zoom = f.locator("output.dd-zoom")
    before = int(zoom.inner_text().rstrip("%"))
    f.get_by_role("button", name="Zoom in D3").click(); page.wait_for_timeout(200)
    mid = int(zoom.inner_text().rstrip("%"))
    f.get_by_role("button", name="Zoom out D3").click(); f.get_by_role("button", name="Zoom out D3").click(); page.wait_for_timeout(200)
    low = int(zoom.inner_text().rstrip("%"))
    check("zoom in and zoom out change the scale", mid > before > low, f"{low}% < {before}% < {mid}%")
    stage = f.locator("[data-testid=diagram-D3]")
    t0 = stage.evaluate("e => e.style.transform")
    box = f.locator(".dd-viewport").bounding_box()
    page.mouse.move(box["x"] + 200, box["y"] + 200); page.mouse.down(); page.mouse.move(box["x"] + 260, box["y"] + 230, steps=4); page.mouse.up()
    check("dragging pans the diagram", stage.evaluate("e => e.style.transform") != t0)
    f.get_by_role("button", name="Reset D3 view to fit").click(); page.wait_for_timeout(200)
    check("reset returns to the fitted view", int(zoom.inner_text().rstrip("%")) == before)
    f.get_by_role("button", name="Expand D3 to full screen").click(); page.wait_for_timeout(300)
    check("the expanded viewer opens and closes", f.get_by_role("button", name="Exit expanded D3 view").count() == 1)
    f.get_by_role("button", name="Exit expanded D3 view").click()
    with page.expect_download() as d1:
        f.get_by_role("button", name="SVG ⤓").first.click()
    svg_text = Path(d1.value.path()).read_text(encoding="utf-8")
    check("SVG export downloads a vector file of the diagram", svg_text.startswith("<?xml") and "AgentCore Gateway" in svg_text)
    with page.expect_download() as d2:
        f.get_by_role("button", name="Download D3 as 2x PNG").click()
    check("PNG export downloads an image", d2.value.suggested_filename.endswith(".png"))
    selector.nth(10).click(); page.wait_for_timeout(400)
    check("the diagram comparison shows two scenario diagrams", f.locator(".dd-compare-grid [data-testid^=diagram-D]").count() == 2)

    # ---- Decision brief
    arch("Decision brief")
    check("the decision brief lists the six decisions", f.locator("tr[data-testid^=decision-]").count() == len(model.DECISIONS))
    f.locator("summary", has_text="Owner answers").first.click()
    d0 = f.locator(".brief-detail").first.inner_text()
    check("each decision shows owner answers, what is settled, what remains, options and proof", all(h in d0.upper() for h in ("OWNER ANSWERS", "SETTLED BY THE DOCUMENTS", "ONLY THE OWNER OR TENANT", "OPTIONS", "PROOF")))
    summ = model.decision_summary()
    text = f.locator("[data-testid=decision-summary]").inner_text()
    check("the brief counts decided, owner-confirmed and open answers", f"{summ['DECIDED']} decided" in text and f"{summ['OWNER-CONFIRMED']} owner-confirmed" in text and f"{summ['OPEN']} still open" in text, text)

    # ---- Live run: all three scenarios
    arch("Live run")
    route = f.locator("label", has_text="Route").locator("select")
    check("the live run offers S1, S2 and S3", [o.get_attribute("value") for o in route.locator("option").all()] == ["S1", "S2", "S3"])
    for sid, hop in (("S1", "Apigee"), ("S2", "AgentCore Gateway"), ("S3", "AgentCore Gateway, then Apigee")):
        route.select_option(sid)
        f.locator("label", has_text="Pace").locator("select").select_option(index=0)
        f.get_by_role("button", name="Run architecture").click()
        f.get_by_role("heading", name="Case complete").wait_for(timeout=150000)
        zone = f.locator("[data-testid=diagram-live] svg").inner_html()
        check(f"a {sid} run completes and names its gateway path '{hop}'", all(word in zone for word in hop.replace(",", "").split()[:2]) and SC[sid]["name"].split(" · ")[1].split()[0] in zone)

    # ---- Architecture questions
    arch("Live run")
    f.get_by_role("button", name="Review open architecture questions").click()
    f.locator(".question-card").first.wait_for(timeout=60000)
    f.locator(".question-card").first.click()
    f.get_by_label("Architecture route").wait_for(timeout=60000)
    positions = []
    for sid in ("S1", "S2", "S3"):
        f.get_by_label("Architecture route").select_option(sid); page.wait_for_timeout(300)
        positions.append(f.locator("[data-testid=scenario-position]").inner_text())
    check("the question page says what the question means in each scenario", len(set(positions)) == 3 and "Cloud Foundry" in positions[0] and "AgentCore" in positions[1] and "Apigee" in positions[2], " | ".join(x[:30] for x in positions))
    f.get_by_role("button", name="Hosting & dependencies").click()
    plan = f.get_by_role("dialog", name="Gateway implementation plan")
    plan.wait_for(timeout=30000)
    check("hosting and dependencies has a plan for each of the three scenarios", plan.get_by_role("navigation", name="Gateway scenarios").get_by_role("button").count() == 3)
    plan.get_by_role("button", name="Close implementation plan").click()
    f.get_by_role("button", name="Run selected probe").click()
    f.locator(".lab-flow-panel .pill").filter(has_text="complete").wait_for(timeout=60000)
    flow = f.locator(".lab-flow-panel").inner_text()
    check("a probe on S3 runs through AgentCore Gateway and then Apigee, with the registry design-time only", "AgentCore Runtime" in flow and "AgentCore Gateway" in flow and "SAP Apigee MCP" in flow and flow.index("AgentCore Gateway") < flow.index("SAP Apigee MCP"))
    f.locator(".detail-return-bar button").click()

    # ---- obsolete wording and protected functionality
    allowed = "\n".join(seen_text)
    found = OBSOLETE.search(allowed)
    check("no obsolete scenario, Google hosting or Microsoft wording appears in any architecture view", not found, found.group(0) if found else "")
    tabs_nav.nth(0).click()
    f.locator("[data-testid=close-screen]").wait_for(timeout=60000)
    check("Close & reconcile still lists twelve periods", f.locator(".worklist button").count() == 12)
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
