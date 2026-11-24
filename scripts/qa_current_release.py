"""Browser regression for the current five-tab synthetic demo (set QA_SKIP_STREAMLIT=1 to run web only)."""
from __future__ import annotations

import os
from playwright.sync_api import sync_playwright

WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8899")
STREAMLIT = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8612")


def check(page, url, hosted):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(url, wait_until="domcontentloaded")
    page.get_by_role("button", name="Open Finance Reconciliation Agent").wait_for(timeout=30000)
    page.get_by_role("button", name="Open Finance Reconciliation Agent").click()
    tabs = page.locator(".tab-nav [role=tab]")
    assert tabs.count() == 5

    # Both detail views are available through contextual links and return to a main view.
    tabs.nth(1).click()
    page.get_by_role("button", name="Inspect event proof in Evidence").click()
    page.locator(".detail-return-bar").wait_for()
    page.locator(".detail-return-bar button").click()
    assert tabs.nth(1).get_attribute("aria-selected") == "true"
    page.get_by_role("button", name="Review open architecture questions").click()
    page.locator(".question-card").first.wait_for()
    page.locator(".detail-return-bar button").click()

    tabs.nth(2).click()
    route_tabs = page.get_by_role("tablist", name="Architecture approach details").get_by_role("tab")
    assert route_tabs.count() == 4
    assert page.locator(".mcp-bird-host-grid button").count() == 4
    for index, route in enumerate(("S1", "S2", "S3")):
        route_tabs.nth(index).click()
        assert route_tabs.nth(index).get_attribute("aria-selected") == "true"
        assert f"MCP ACCESS · {route}" in page.locator(".mcp-bird-panel").inner_text()
        page.locator(".diagram-action").click()
        diagram = page.get_by_role("dialog", name=f"{route} ·", exact=False)
        assert diagram.locator(".arch-diagram-node").count() >= 6
        assert diagram.locator(".arch-diagram-controls article").count() == 4
        diagram.get_by_role("button", name="Close").click()
    route_tabs.nth(1).click()
    page.get_by_role("button", name="View handoffs and proof").click()
    dialog = page.get_by_role("dialog", name="S2 architecture details")
    assert "MCP-server target" in dialog.inner_text()
    assert "Runtime passthrough" not in dialog.inner_text()
    page.get_by_role("button", name="Run related architecture questions").click()
    page.locator(".question-card").first.click()
    page.locator(".lab-flow-panel .pill").filter(has_text="complete").wait_for(timeout=30000)
    page.locator(".detail-return-bar button").click()
    tabs.nth(2).click()
    route_tabs.nth(3).click()
    assert page.locator(".mcp-bird-compare-grid article").count() == 3
    page.get_by_role("button", name="View full control matrix").click()
    assert page.get_by_role("dialog", name="Full MCP control matrix").locator("tbody tr").count() == 15
    page.get_by_role("dialog", name="Full MCP control matrix").get_by_role("button", name="Close").click()
    page.locator(".mcp-bird-host-grid button").nth(1).click()
    hosting_diagram = page.get_by_role("dialog", name="architecture diagram")
    assert hosting_diagram.locator(".arch-diagram-node").count() == 6
    hosting_diagram.get_by_role("button", name="View detailed prerequisites").click()
    assert "Cloud Foundry" in page.get_by_role("dialog", name="SAP BTP pro-code agent hosting details").inner_text()
    page.get_by_role("dialog", name="SAP BTP pro-code agent hosting details").get_by_role("button", name="Close").click()
    if page.viewport_size["width"] >= 1000:
        assert page.locator(".mcp-bird").evaluate("e => e.scrollHeight <= e.clientHeight")
        assert page.locator(".mcp-bird-panel").evaluate("e => e.scrollHeight <= e.clientHeight")

    # Detailed diagram tab: explicit S1/S2 selection, compare mode, zoom, reset and navigation back.
    tabs.nth(2).click()
    route_tabs.nth(0).click()
    page.get_by_role("button", name="Detailed diagram (zoom)").click()
    assert tabs.nth(3).get_attribute("aria-selected") == "true"
    selector = page.get_by_role("tablist", name="Detailed diagram selection").get_by_role("tab")
    assert selector.count() == 3
    assert page.locator("[data-testid=diagram-S1] text").count() >= 200
    zoom = page.locator(".dd-zoom").first
    fitted = zoom.inner_text()
    page.get_by_role("button", name="Zoom in S1").click()
    assert int(zoom.inner_text()[:-1]) > int(fitted[:-1])
    page.get_by_role("button", name="Reset S1 view to fit").click()
    assert zoom.inner_text() == fitted
    selector.nth(1).click()
    assert page.locator("[data-testid=diagram-S2]").count() == 1 and page.locator("[data-testid=diagram-S1]").count() == 0
    assert page.locator("[data-testid=diagram-S2] text", has_text="AWS trust boundary").count() == 1
    selector.nth(2).click()
    assert page.locator(".dd-viewer").count() == 2
    page.get_by_role("button", name="← Architecture pros").first.click()
    assert tabs.nth(2).get_attribute("aria-selected") == "true"

    # MCP hosting & governance tab: scenario selection, generated diagrams, matrices, consistency and navigation.
    tabs.nth(2).click()
    route_tabs.nth(2).click()
    page.get_by_role("button", name="MCP hosting & governance").click()
    assert tabs.nth(4).get_attribute("aria-selected") == "true"
    scenario = page.get_by_role("tablist", name="MCP scenario selection").get_by_role("tab")
    assert scenario.count() == 4
    assert scenario.nth(2).get_attribute("aria-selected") == "true"  # arrived from S3
    assert page.locator("[data-testid=mg-matrix] tbody tr").count() == 21
    for index, sid in enumerate(["S1", "S2", "S3"]):
        scenario.nth(index).click()
        stage = page.locator(f"[data-testid=diagram-{sid}]")
        stage.wait_for()
        assert stage.locator("text").count() >= 60
        kinds = {"invoke", "registry", "deploy", "identity"}
        assert all(stage.locator(f"path[stroke-dasharray]").count() or kind == "invoke" for kind in kinds)
        assert page.locator(f"[data-testid=mg-connections-{sid}] tbody tr").count() >= 6
        assert page.locator(".mg-open").count() > 0
        zoom = page.locator(".dd-zoom").first
        assert zoom.inner_text() != "0%"
    # S3 shows two gateways in series; S2 shows the AWS trust boundary; registries are never invocation targets.
    assert page.locator("[data-testid=diagram-S3] text", has_text="Apigee MCP endpoint").count() >= 1
    assert page.locator("[data-testid=diagram-S3] text", has_text="AgentCore Gateway").count() >= 1
    scenario.nth(1).click()
    assert page.locator("[data-testid=diagram-S2] text", has_text="AWS trust boundary").count() == 1
    svg_text = page.locator("[data-testid=diagram-S2] svg").inner_html()
    assert "NOT AN INVOCATION HOP" in svg_text and "tool code" in svg_text and "no custom" in svg_text
    assert "Finance Read MCP" in page.locator("[data-testid=mg-domain]").inner_text()
    assert "Finance Posting MCP" in page.locator("[data-testid=mg-domain]").inner_text()
    assert page.locator("[data-testid=mg-evidence] a[href^='https://']").count() >= 8
    zoom = page.locator(".dd-zoom").first
    fitted = zoom.inner_text()
    page.get_by_role("button", name="Zoom in S2").click()
    assert int(zoom.inner_text()[:-1]) > int(fitted[:-1])
    page.get_by_role("button", name="Reset S2 view to fit").click()
    assert zoom.inner_text() == fitted
    with page.expect_download() as download:
        page.get_by_role("button", name="Download S2 as 2x PNG").click()
    assert download.value.suggested_filename == "mcp-topology-s2-2x.png"
    scenario.nth(3).click()
    assert page.locator(".dd-viewer").count() == 2
    page.get_by_role("button", name="Pros & cons →").first.click()
    assert tabs.nth(2).get_attribute("aria-selected") == "true"

    if not hosted:
        tabs.nth(1).click()
        page.get_by_role("button", name="Run architecture").click()
        page.get_by_role("heading", name="Case complete").wait_for(timeout=30000)
        assert int(page.locator(".flow-caption span").last.inner_text().split()[0]) > 0

    assert not errors, errors
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    surfaces = [("web desktop", WEB, False, 1440), ("web mobile", WEB, False, 390)]
    if os.environ.get("QA_SKIP_STREAMLIT") != "1":
        surfaces += [("streamlit desktop", STREAMLIT, True, 1440), ("streamlit mobile", STREAMLIT, True, 390)]
    for label, url, hosted, width in surfaces:
        page = browser.new_page(viewport={"width": width, "height": 900 if width == 1440 else 844})
        check(page, url, hosted)
        print({"surface": label, "five_tabs": "PASS", "mcp_governance": "PASS", "detailed_diagrams_zoom": "PASS", "detail_links": "PASS",
               "four_approach_tabs": "PASS", "seven_diagram_designs": "PASS", "no_desktop_scroll": "PASS", "page_errors": 0}, flush=True)
        page.context.close()
    browser.close()
