"""Browser regression for the current three-view synthetic demo."""
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
    assert tabs.count() == 3

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
    for index, route in enumerate(("S1", "S2", "S3")):
        route_tabs.nth(index).click()
        assert route_tabs.nth(index).get_attribute("aria-selected") == "true"
        assert f"{route} · RESPONSIBILITY PATH" in page.locator(".mcp-main").inner_text()
    route_tabs.nth(1).click()
    assert "MCP-server target" in page.locator(".mcp-ownership").inner_text()
    assert "Runtime passthrough" not in page.locator(".mcp-ownership").inner_text()
    page.get_by_role("button", name="Run related architecture questions").click()
    page.locator(".question-card").first.click()
    page.locator(".lab-flow-panel .pill").filter(has_text="complete").wait_for(timeout=30000)
    page.locator(".detail-return-bar button").click()
    tabs.nth(2).click()
    route_tabs.nth(3).click()
    assert page.get_by_role("region", name="Architecture comparison table").locator("tbody tr").count() >= 10

    if not hosted:
        tabs.nth(1).click()
        page.get_by_role("button", name="Run architecture").click()
        page.get_by_role("heading", name="Case complete").wait_for(timeout=30000)
        assert int(page.locator(".flow-caption span").last.inner_text().split()[0]) > 0

    assert not errors, errors
    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for label, url, hosted, width in (
        ("web desktop", WEB, False, 1440),
        ("web mobile", WEB, False, 390),
        ("streamlit desktop", STREAMLIT, True, 1440),
        ("streamlit mobile", STREAMLIT, True, 390),
    ):
        page = browser.new_page(viewport={"width": width, "height": 900 if width == 1440 else 844})
        check(page, url, hosted)
        print({"surface": label, "three_tabs": "PASS", "detail_links": "PASS",
               "four_approach_tabs": "PASS", "s2_target": "PASS", "page_errors": 0}, flush=True)
        page.context.close()
    browser.close()
