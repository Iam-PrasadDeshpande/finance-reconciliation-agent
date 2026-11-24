"""Focused browser check for the three architecture hosting plans."""
import os
from playwright.sync_api import sync_playwright

WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8896")
STREAMLIT = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8606")


def check(page, url):
    page.goto(url, wait_until="domcontentloaded")
    page.locator(".launchpad-decision-row").first.wait_for(timeout=30000)
    page.locator(".launchpad-decision-row").first.click()
    page.locator(".question-card.selected").first.wait_for(timeout=30000)
    page.get_by_role("button", name="Hosting & dependencies").click()
    dialog = page.get_by_role("dialog", name="Gateway implementation plan")
    dialog.wait_for()
    for route, minimum in (("S1", 5), ("S2", 5), ("S3", 6)):
        dialog.get_by_role("button", name=f"{route} ·", exact=False).click()
        assert dialog.locator(".route-plan-sequence button").count() >= minimum
        assert dialog.locator(".route-plan-decisions ol li").count() >= 3
        assert dialog.locator(".route-plan-decisions ul li").count() == 3
        assert dialog.locator("footer a").count() >= 3
        dialog.locator(".route-plan-sequence button").last.click()
        assert dialog.get_by_text("Proof to accept").is_visible()
    dialog.get_by_role("button", name="Close implementation plan").click()
    assert not dialog.is_visible()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, url in (("web", WEB), ("streamlit", STREAMLIT)):
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        check(page, url)
        print({name: "PASS", "routes": ["S1", "S2", "S3"], "question_dependencies": "PASS"})
        page.close()
    browser.close()
