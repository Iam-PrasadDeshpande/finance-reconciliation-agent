"""Browser regression for the current three-area synthetic demo (set QA_SKIP_STREAMLIT=1 to run web only)."""
from __future__ import annotations

import os
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space

WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8899")
STREAMLIT = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8612")


def check(page, url, hosted):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(url, wait_until="domcontentloaded")
    page.get_by_role("tab", name="Finance apps").click(); page.get_by_role("button", name="Open Close & reconcile").wait_for(timeout=30000)
    # Level 1 entry: agent-first, no open-decision list.
    assert page.locator(".entry-card").count() == 3
    assert page.locator(".entry-roles").count() == 0  # the audience block was removed from My Home
    assert page.get_by_text("Open decisions").count() == 0
    assert page.get_by_label("What should the agents do?").input_value() != ""
    page.get_by_role("button", name="Open Close & reconcile").click()
    tabs = nav(page)
    assert page.get_by_role("tablist", name="Spaces").get_by_role("tab").count() == 3

    def go_decision(label):
        if not page.get_by_role("tablist", name="Architecture views").count():
            tabs.nth(4).click()
            page.locator(".fi-gtile").first.click()
        page.get_by_role("tablist", name="Architecture views").get_by_role("tab", name=label).click()

    def decision_selected(label):
        return page.get_by_role("tablist", name="Architecture views").get_by_role("tab", name=label).get_attribute("aria-selected") == "true"

    page.locator(".close-process li").first.wait_for(state="attached", timeout=30000)
    assert page.locator(".close-process li").count() == 6

    # Agents area: the orchestrator calls specialist agents over MCP and the graph shows what each reached.
    assert page.locator(".agent-ask-bar").count() == 1
    tabs.nth(3).click()
    assert page.get_by_role("tablist", name="Spaces").get_by_role("tab", name="Agents").get_attribute("aria-selected") == "true"
    page.get_by_role("button", name="Run plan").click()
    for _ in range(240):
        if "Plan complete" in (page.locator(".aw-plan-state").first.text_content() if page.locator(".aw-plan-state").count() else ""):
            break
        page.wait_for_timeout(250)
    assert "Plan complete" in page.locator(".aw-plan-state").first.text_content()
    answer_text = page.locator(".aw-answer").text_content()
    agent_page(page, "Technical options")
    stage = page.locator("[data-testid=diagram-orchestration]")
    assert stage.locator("[data-node^='agent:']").count() == 6 and stage.locator("[data-node='orch']").count() == 1
    assert stage.locator("[data-node^='layer:']").count() >= 5
    assert stage.locator("path[data-edge^='orch-agent:']").count() == 3
    assert stage.locator("path[data-edge='orch-agent:investigator']").count() == 1 and stage.locator("path[data-edge='orch-agent:approval']").count() == 0
    assert "No SAP write was made" in answer_text
    assert "start_investigation" in page.locator(".aw-log").text_content() or "Added by the orchestrator" in page.locator(".aw-log").text_content()
    assert page.locator(".aw-log li").count() == 7
    agent_page(page, "Agent catalog")
    page.get_by_role("button", name="Select Evidence agent").click()
    agent_page(page, "Technical options")
    detail = page.locator(".aw-detail").inner_text()
    assert "evidence-mcp" in detail and "tools/call" in detail and "SAP backends" in page.locator(".aw-detail").text_content()
    page.get_by_role("button", name="Open the live architecture").click()
    assert decision_selected("Live run")
    assert "Evidence agent" in page.locator(".agent-ribbon").inner_text()
    page.get_by_role("button", name="Back to Agents").click()
    assert page.get_by_role("tablist", name="Spaces").get_by_role("tab", name="Agents").get_attribute("aria-selected") == "true"
    agent_page(page, "Agent catalog")
    page.get_by_role("button", name="Select Governance & route agent").click()
    agent_page(page, "Technical options")
    page.get_by_role("button", name="Open responsibilities & governance").click()
    assert decision_selected("MCP hosting")
    page.get_by_role("button", name="Dismiss agent banner").click()
    tabs.nth(3).click()
    agent_page(page, "Technical options")
    page.get_by_role("tab", name="Tool catalog").click()
    assert page.locator(".aw-catalog").text_content().count("collect_evidence") >= 1
    assert "sap.post" in page.locator(".aw-catalog").text_content()
    page.get_by_role("tab", name="Orchestration and calls").click()
    agent_page(page, "Ask the agents")
    page.get_by_label("Ask the orchestrator").fill("Post a journal entry to SAP for November 2026")
    page.get_by_role("button", name="Run plan").click()
    page.locator(".aw-plan-state.blocked").wait_for(timeout=60000)
    assert "not an agent action" in page.locator(".aw-plan-state").first.text_content()
    page.get_by_label("Ask the orchestrator").fill("hello")
    page.get_by_role("button", name="Run plan").click()
    page.locator(".aw-plan-state.needs_input").wait_for(timeout=60000)
    assert "Which would you like" in page.locator(".aw-answer").text_content()
    page.get_by_label("Ask the orchestrator").fill("approve the proposal")
    page.get_by_role("button", name="Run plan").click()
    page.locator(".aw-plan-state.blocked").wait_for(timeout=60000)
    assert "person's decision" in page.locator(".aw-answer").text_content()
    tabs.nth(0).click()

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
        page.wait_for_timeout(1500 if hosted else 1200)

    apply("baseline")
    open_report()
    assert dialog.get_by_role("tab").count() == 9
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
    go_decision("Live run")
    page.get_by_role("button", name="Inspect event proof in Evidence").click()
    page.locator(".detail-return-bar").wait_for()
    page.locator(".detail-return-bar button").click()
    assert decision_selected("Live run")
    page.get_by_role("button", name="Review open architecture questions").click()
    page.locator(".question-card").first.wait_for()
    page.locator(".detail-return-bar button").click()

    # Architecture V5.1: three scenarios from one model (details are covered by qa_architecture_v51.py).
    go_decision("Complete architecture")
    route_tabs = page.get_by_role("tablist", name="Architecture approach details").get_by_role("tab")
    assert route_tabs.count() == 4
    for index, route in enumerate(("S1", "S2", "S3")):
        route_tabs.nth(index).click()
        assert route_tabs.nth(index).get_attribute("aria-selected") == "true"
        assert route in page.locator(".mcp-bird-panel").inner_text()
        page.locator(".diagram-action").click()
        diagram = page.get_by_role("dialog", name=f"{route} ·", exact=False)
        assert diagram.locator("[data-node]").count() >= 12
        diagram.get_by_role("button", name="Close").click()
    route_tabs.nth(3).click()
    assert page.locator("[data-testid=arch-compare] tbody tr").count() == 26
    go_decision("Agent hosting")
    host_tabs = page.get_by_role("tablist", name="Agent hosting options").get_by_role("tab")
    assert host_tabs.count() == 2
    page.get_by_role("button", name="S3 diagram").click()
    assert page.get_by_role("dialog", name="architecture diagram").locator("[data-node]").count() >= 12
    page.get_by_role("dialog", name="architecture diagram").get_by_role("button", name="Close").click()
    go_decision("Complete architecture")

    # Diagrams tab: ten generated diagrams plus a comparison.
    go_decision("Diagrams")
    selector = page.get_by_role("tablist", name="Detailed diagram selection").get_by_role("tab")
    assert selector.count() == 11
    selector.nth(2).click()
    assert page.locator("[data-testid=diagram-D3] svg [data-node]").count() >= 12
    zoom = page.locator(".dd-zoom").first
    fitted = zoom.inner_text()
    page.get_by_role("button", name="Zoom in D3").click()
    assert int(zoom.inner_text()[:-1]) > int(fitted[:-1])
    page.get_by_role("button", name="Reset D3 view to fit").click()
    assert zoom.inner_text() == fitted
    selector.nth(10).click()
    assert page.locator(".dd-compare-grid [data-testid^=diagram-D]").count() == 2

    # MCP hosting: scenario selection, matrices, evidence and navigation.
    go_decision("Complete architecture")
    route_tabs.nth(2).click()
    page.get_by_role("button", name="MCP hosting →").click()
    assert decision_selected("MCP hosting")
    scenario = page.get_by_role("tablist", name="MCP scenario selection").get_by_role("tab")
    assert scenario.count() == 4
    assert scenario.nth(2).get_attribute("aria-selected") == "true"  # arrived from S3
    page.locator("[data-testid=mg-matrix] summary").click()
    assert page.locator("[data-testid=mg-matrix] tbody tr").count() == 26
    for index, sid in enumerate(["S1", "S2", "S3"]):
        scenario.nth(index).click()
        assert page.locator(f"[data-scenario={sid}] svg [data-node]").count() >= 12
        page.locator(f"[data-testid=mg-connections-{sid}] summary").click()
        assert page.locator(f"[data-testid=mg-connections-{sid}] tbody tr").count() >= 8
    assert "Finance Read MCP" in page.locator("[data-testid=mg-domain]").text_content()
    assert "Finance Posting MCP" in page.locator("[data-testid=mg-domain]").text_content()
    assert page.locator("[data-testid=mg-evidence] a[href^='https://']").count() >= 7
    page.get_by_role("button", name="Zoom in S3").click()
    page.get_by_role("button", name="Reset S3 view to fit").click()
    with page.expect_download() as download:
        page.get_by_role("button", name="Download S3 as 2x PNG").click()
    assert download.value.suggested_filename == "mcp-topology-s3-2x.png"
    scenario.nth(3).click()
    assert page.locator(".mg-viewer").count() == 2
    page.get_by_role("button", name="Complete architecture →").first.click()
    assert page.get_by_role("tablist", name="Spaces").get_by_role("tab", name="Architecture").get_attribute("aria-selected") == "true"

    # Audience-ready additions: decision brief, role lenses on My Home and the close process panel.
    go_decision("Decision brief")
    assert page.locator(".brief-table tr[data-testid^=decision-]").count() == 7
    assert page.locator(".brief-gates li").count() == 7
    page.get_by_role("button", name="Proves / does not prove").click()
    assert "real MCP transport" in page.get_by_role("dialog", name="What this demo proves, and what it does not").inner_text()
    page.get_by_role("dialog", name="What this demo proves, and what it does not").get_by_role("button", name="Close").click()

    # Live architecture: generated vector topology with the shared zoom viewer and clickable zones.
    go_decision("Live run")
    viewer = page.locator(".route-viewer")
    viewer.wait_for()
    # Technical details are hidden by default and shown on request.
    assert page.locator(".flow-caption .tech").first.is_hidden()
    page.get_by_label("Technical details").check()
    assert page.locator(".flow-caption .tech").first.is_visible()
    page.get_by_label("Technical details").uncheck()
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
        go_decision("Live run")
        page.get_by_role("button", name="Run architecture").click()
        page.get_by_role("heading", name="Case complete").wait_for(timeout=30000)
        assert int(page.locator(".flow-caption span").last.text_content().split()[0]) > 0

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
        print({"surface": label, "entry_and_three_areas": "PASS", "agent_orchestration_graph": "PASS", "detailed_report_and_scenario_lab": "PASS", "mcp_governance": "PASS", "detailed_diagrams_zoom": "PASS", "detail_links": "PASS",
               "four_approach_tabs": "PASS", "seven_diagram_designs": "PASS", "no_desktop_scroll": "PASS", "page_errors": 0}, flush=True)
        page.context.close()
    browser.close()
