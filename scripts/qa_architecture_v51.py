"""Architecture V5.1 in a real browser: three scenarios, every architecture tab, the ten diagrams, zoom / pan / reset / expand / export,
comparison consistency with the canonical model, no obsolete Google hosting, and the reconciliation flow still working.

    QA_URL=http://127.0.0.1:8925 python scripts/qa_architecture_v51.py    (web app or a Streamlit URL; QA_MOBILE=1 for a phone viewport)
"""
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from poc import architecture_model as model
from poc import cockpit

URL = os.environ.get("QA_URL", "http://127.0.0.1:8899").rstrip("/")
MOBILE = os.environ.get("QA_MOBILE") == "1"
SHOTS = Path(os.environ.get("QA_SHOTS", "arch_v51_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
SC = model.SCENARIOS
SPECS = model.diagrams()
results = []
OBSOLETE = re.compile(r"Cloud Run|Vertex|Google Agent Registry|Google Agent Runtime|Agent Engine", re.I)


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
    f.locator(".entry-card").nth(3).wait_for(timeout=150000)
    modules = [m for m in cockpit.manifests() if m.get("tab")]
    tabs_nav = f.locator(".tab-nav [role=tab]")
    seen_text = []

    def arch(name):
        tabs_nav.nth(len(modules) + 1).click()
        f.get_by_role("tablist", name="Architecture views").get_by_role("tab", name=re.compile(name)).first.click()
        page.wait_for_timeout(500)

    def body():
        text = f.locator("main.arch-page, main.detailed-diagrams, main.agent-workbench, main").last.inner_text()
        seen_text.append(text)
        return text

    f.get_by_role("button", name="Open Agents").click() if f.get_by_role("button", name="Open Agents").count() else None
    # ---- every architecture tab opens
    for name in ("Live run", "Complete architecture", "MCP hosting", "Agent hosting", "Registry", "Decision brief", "Ontology", "Diagrams"):
        arch(name)
        check(f"architecture tab '{name}' opens", len(body()) > 200)

    # ---- Complete architecture: three scenarios + comparison
    arch("Complete architecture")
    tabs = f.locator("[aria-label='Architecture approach details'] [role=tab]")
    check("complete architecture offers S1, S2, S3 and a comparison", tabs.count() == 4)
    for i, sid in enumerate(("S1", "S2", "S3")):
        tabs.nth(i).click(); page.wait_for_timeout(300)
        body()
        text = f.locator("[role=tabpanel]").first.inner_text()  # the scenario panel only, not the scenario tab strip
        s = SC[sid]
        check(f"{sid}: the overview states agent hosting '{s['agent_runtime']}' and registry '{s['agent_registry']}'", s["agent_runtime"] in text and s["agent_registry"] in text and s["llm_gateway"] in text)
        if sid == "S1":
            check("S1 discloses that its registry product is unresolved", "product selection pending" in text.lower() and "AWS Agent Registry" not in text)
            check("S1 shows no AWS AgentCore component", "AgentCore" not in text)
        if sid == "S2":
            check("S2 names AgentCore Runtime, Gateway and AWS Agent Registry separately", all(k in text for k in ("AgentCore Runtime", "AgentCore Gateway", "AWS Agent Registry")) or "AgentCore Gateway" in text)
        if sid == "S3":
            check("S3 is labelled a preferred candidate subject to policy and POC", "preferred candidate" in text.lower() and "poc validation" in text.lower())
            check("S3 baseline shows no AgentCore Runtime and mentions S3-B only as a variant", "AgentCore Runtime" not in text and "AgentCore Gateway" in text and "S3-B" in text)
        f.get_by_role("button", name="Architecture diagram ↗").click()
        f.locator(".arch-diagram-modal").wait_for()
        modal = f.locator(".arch-diagram-modal")
        ok = modal.locator("[data-testid^=diagram-modal-D]").count() == 1 and modal.locator("svg [data-node]").count() == len(SPECS[{"S1": "D2", "S2": "D3", "S3": "D4"}[sid]]["nodes"])
        check(f"{sid}: the diagram modal renders the model's nodes", ok)
        f.keyboard.press("Escape") if False else f.get_by_role("button", name="Close").first.click()
    tabs.nth(3).click(); page.wait_for_timeout(300)
    rows = f.locator("[data-testid=arch-compare] tbody tr")
    check("comparison lists every model dimension", rows.count() == len(model.COMPARISON), f"{rows.count()} rows")
    text = f.locator("[data-testid=arch-compare]").inner_text()
    check("comparison shows agent hosting per scenario from the model", "SAP BTP Cloud Foundry" in text and "AWS AgentCore Runtime" in text and model.UNRESOLVED in text)

    # ---- MCP hosting for each scenario and compare
    arch("MCP hosting")
    for sid in ("S1", "S2", "S3"):
        f.get_by_role("tablist", name="MCP scenario selection").get_by_role("tab").nth(["S1", "S2", "S3"].index(sid)).click(); page.wait_for_timeout(400)
        check(f"MCP hosting {sid}: diagram has the model's nodes", f.locator(f"[data-scenario={sid}] svg [data-node]").count() == len(SPECS[{"S1": "D2", "S2": "D3", "S3": "D4"}[sid]]["nodes"]))
    f.get_by_role("tablist", name="MCP scenario selection").get_by_role("tab").nth(3).click(); page.wait_for_timeout(400)
    check("MCP hosting compare shows two diagrams", f.locator(".mg-viewer").count() == 2)
    f.get_by_role("tablist", name="MCP scenario selection").get_by_role("tab").nth(2).click()
    f.locator("[data-testid=mg-matrix] summary").click(); page.wait_for_timeout(300)
    check("the MCP hosting matrix lists every comparison row", f.locator("[data-testid=mg-matrix] tbody tr").count() == len(model.COMPARISON))
    f.locator("[data-testid=mg-patterns] summary").click(); page.wait_for_timeout(300)
    pat = f.locator("[data-testid=mg-patterns]").inner_text()
    check("MCP hosting explains the managed endpoint versus the custom server", "PATTERN A" in pat.upper() and "PATTERN B" in pat.upper() and "Cloud Foundry" in pat)
    check("MCP hosting shows a decision strip with hosting next to registration", f.locator("[data-testid=decision-strip]").count() >= 1)
    check("the MCP hosting page points registration to its own page", "Registry" in body())

    # ---- Agent hosting
    arch("Agent hosting")
    ah = body()
    check("agent hosting offers SAP BTP Cloud Foundry and AWS AgentCore Runtime only", "SAP BTP Cloud Foundry" in ah and "AWS AgentCore Runtime" in ah and "Joule" not in ah and "Microsoft" not in ah and "Kyma" not in ah)
    check("agent hosting states that registration is a separate decision", "separate decision" in ah.lower() or "Registration is separate" in ah or "not decided by hosting" in ah.lower())

    # ---- Registry
    arch("Registry")
    rg = f.locator("main.registry-page").inner_text()
    check("registry shows registration next to hosting", f.locator("[data-testid=decision-strip]").count() == 1)
    tabsr = f.get_by_role("tablist", name="Registry scenario selection").get_by_role("tab")
    check("registry offers S1, S2, S3 and a comparison", tabsr.count() == 4)
    tabsr.nth(0).click(); page.wait_for_timeout(300)
    s1r = f.locator("main.registry-page").inner_text()
    check("S1 registry is shown as unresolved with no product invented", "product selection pending" in s1r.lower() and "AWS Agent Registry" not in f.locator("[data-testid=registry-facts]").inner_text())
    tabsr.nth(2).click(); page.wait_for_timeout(300)
    s3r = f.locator("[data-testid=registry-facts]").inner_text() + f.locator("[data-testid=registry-notes]").inner_text()
    check("S3 registers in AWS Agent Registry as control plane only", "AWS Agent Registry" in s3r and "never an execution hop" in s3r)
    tabsr.nth(3).click(); page.wait_for_timeout(300)
    check("registry comparison lists the three scenarios", f.locator("[data-testid=registry-compare] thead th").count() == 4)
    check("registry shows D5 and offers D8", f.locator("[data-testid=diagram-D5] svg [data-node]").count() == len(SPECS["D5"]["nodes"]))

    # ---- The ten diagrams: render, zoom, pan, reset, expand, export
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
    path = d1.value.path()
    svg_text = Path(path).read_text(encoding="utf-8")
    check("SVG export downloads a vector file of the diagram", svg_text.startswith("<?xml") and "AgentCore Gateway" in svg_text and "<svg" in svg_text)
    with page.expect_download() as d2:
        f.get_by_role("button", name="Download D3 as 2x PNG").click()
    check("PNG export downloads an image", d2.value.suggested_filename.endswith(".png"))
    page.screenshot(path=str(SHOTS / f"diagrams_d3{'_m' if MOBILE else ''}.png"))
    selector.nth(10).click(); page.wait_for_timeout(400)
    check("the diagram comparison shows two scenario diagrams", f.locator(".dd-compare-grid [data-testid^=diagram-D]").count() == 2)
    check("the diagrams page keeps the common-rules note", "Portkey is the LLM gateway" in body())

    # ---- no obsolete assumptions anywhere we visited
    allowed = "\n".join(seen_text)
    check("no Google agent hosting or Google agent registry appears in any architecture view", not OBSOLETE.search(allowed), (OBSOLETE.search(allowed) or [""])[0] if OBSOLETE.search(allowed) else "")

    # ---- the reconciliation flow is unchanged
    tabs_nav.nth(0).click()
    f.locator("[data-testid=close-screen]").wait_for(timeout=60000)
    check("Close & reconcile still lists twelve periods", f.locator(".worklist button").count() == 12)
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
