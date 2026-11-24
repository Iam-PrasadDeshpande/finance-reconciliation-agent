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

    # Execution simulator: detailed reconciliation report and scenario lab (restores the baseline at the end).
    tabs.nth(0).click()
    dialog = page.locator(".rr-dialog[open]")

    def open_report():
        page.get_by_role("button", name="Detailed report for").click()
        dialog.locator(".rr-kpis").wait_for(timeout=30000)

    def close_report():
        dialog.get_by_role("button", name="Close reconciliation report").click()
        dialog.wait_for(state="detached", timeout=10000)

    def apply(condition):
        page.locator(".rr-condition select").select_option(condition)
        page.get_by_role("button", name="Apply to").click()
        page.wait_for_timeout(1500 if hosted else 400)

    apply("baseline")
    open_report()
    assert dialog.get_by_role("tab").count() == 7
    assert "Explained" in dialog.locator(".rr-banner").first.inner_text()
    assert "$25,000" in dialog.locator(".rr-kpis").inner_text()
    dialog.get_by_role("tab", name="Reconciling items").click()
    dialog.get_by_role("button", name="Details for SYN-FI-004").click()
    assert "AIF" in dialog.locator(".rr-detail").inner_text()
    dialog.get_by_role("tab", name="Controls").click()
    controls = dialog.locator(".rr-table").inner_text()
    assert "PASS" in controls and "HOLD" not in controls and "NOT VERIFIED" in controls
    dialog.get_by_role("tab", name="Aging").click()
    assert dialog.locator(".rr-aging > div").count() == 4
    dialog.get_by_role("tab", name="AI review").click()
    assert "Advisory only" in dialog.locator(".rr-body").inner_text()
    dialog.get_by_role("tab", name="Reconciling items").click()
    with page.expect_download() as csv_download:
        dialog.get_by_role("button", name="Items CSV").click()
    assert csv_download.value.suggested_filename == "RPT-2026-11-items.csv"
    close_report()
    apply("late_posting")
    open_report()
    assert "$18,000" in dialog.locator(".rr-kpis").inner_text()
    assert "Exception" in dialog.locator(".rr-banner").first.inner_text()
    close_report()
    apply("late_replication")
    open_report()
    assert "On hold" in dialog.locator(".rr-banner").first.inner_text()
    close_report()
    apply("baseline")
    open_report()
    assert "Explained" in dialog.locator(".rr-banner").first.inner_text()
    close_report()

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
        assert diagram.locator("[data-stage]").count() >= 6
        assert diagram.locator("[data-control]").count() == 4
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
    assert hosting_diagram.locator("[data-stage]").count() == 6
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
    landscape = page.get_by_role("tablist", name="Landscape diagram selection").get_by_role("tab")
    assert landscape.count() == 7
    for index in range(7):
        landscape.nth(index).click()
        assert page.locator("[data-testid^=diagram-] [data-stage]").count() in (6, 7)
        assert page.locator("[data-testid^=diagram-] [data-control]").count() == 4
        assert page.locator(".dd-viewer").count() == 1
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

    # Live architecture: generated vector topology with the shared zoom viewer and clickable zones.
    tabs.nth(1).click()
    viewer = page.locator(".route-viewer")
    viewer.wait_for()
    assert viewer.locator("[data-zone]").count() >= 12
    live_zoom = viewer.locator(".dd-zoom")
    live_fit = live_zoom.inner_text()
    viewer.get_by_role("button", name="Zoom in live").click()
    assert int(live_zoom.inner_text()[:-1]) > int(live_fit[:-1])
    viewer.get_by_role("button", name="Reset live view to fit").click()
    assert live_zoom.inner_text() == live_fit
    assert viewer.get_by_role("button", name="Download live as 2x PNG").count() == 1
    sap_zone = viewer.locator('rect[data-zone="SAP BAIP"]')
    sap_zone.click()
    selected = page.locator('rect[data-node="SAP BAIP"]')
    for _ in range(60):
        if selected.get_attribute("stroke") == "#0A6ED1":
            break
        page.wait_for_timeout(250)
    assert selected.get_attribute("stroke") == "#0A6ED1"

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
        print({"surface": label, "five_tabs": "PASS", "detailed_report_and_scenario_lab": "PASS", "mcp_governance": "PASS", "detailed_diagrams_zoom": "PASS", "detail_links": "PASS",
               "four_approach_tabs": "PASS", "seven_diagram_designs": "PASS", "no_desktop_scroll": "PASS", "page_errors": 0}, flush=True)
        page.context.close()
    browser.close()
