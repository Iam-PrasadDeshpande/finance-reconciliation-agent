"""Browser acceptance for the Fiori-style frontend and Streamlit entrypoint."""
from pathlib import Path
import os
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs" / "evidence"
WEB=os.environ.get("QA_WEB_URL","http://127.0.0.1:8876")
STREAMLIT=os.environ.get("QA_STREAMLIT_URL","http://127.0.0.1:8502")


def check_fastapi(browser):
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(WEB+"/", wait_until="networkidle")
    page.get_by_role("heading", name="Finance Architecture Studio").wait_for()
    page.get_by_role("button", name="Why is there a variance?").click()
    page.get_by_text("I cannot verify that question from this synthetic demo.", exact=False).wait_for()
    page.get_by_role("button", name="Reconcile February 2026").click()
    page.get_by_text("Reconciliation for 2026-02: 0 USD variance.", exact=False).wait_for(timeout=15000)
    page.get_by_role("button", name="Why is there a variance?").click()
    page.get_by_text("The comparable variance is 910,000 − 910,000 = 0 USD", exact=False).wait_for()
    page.get_by_role("button", name="Show source evidence").click()
    page.get_by_text("Source evidence: BW/4HANA", exact=False).wait_for()
    page.locator("#chat-question").fill("Show journal evidence for March 2026")
    page.get_by_role("button", name="Send").click()
    page.get_by_text("2026-03 has 12 synthetic journal evidence records", exact=False).wait_for()
    page.screenshot(path=str(EVIDENCE / "business_v3_answers.png"))
    with page.expect_download() as download:
        page.get_by_role("button", name="Download report").click()
    assert download.value.suggested_filename.endswith("-synthetic-report.json")
    page.get_by_role("tab", name="Live architecture").click()
    assert page.locator(".route-zone").count() == 12
    assert "1000" not in page.locator(".architecture-layout").inner_text()
    page.screenshot(path=str(EVIDENCE / "architecture_v3_initial.png"))
    page.locator(".command-controls select").first.select_option("2026-11")
    page.get_by_role("button", name="Run architecture").click()
    page.locator(".route-zone.current").first.wait_for(timeout=10000)
    page.screenshot(path=str(EVIDENCE / "architecture_v3_live.png"))
    page.get_by_role("heading", name="Case complete").wait_for(timeout=45000)
    assert page.locator(".event-row").count() > 0
    assert "1000" not in page.locator(".architecture-layout").inner_text()
    page.screenshot(path=str(EVIDENCE / "architecture_v3_result.png"), full_page=True)
    page.get_by_role("button", name="Replay").click()
    page.wait_for_timeout(450)
    page.get_by_role("button", name="Pause").click()
    page.get_by_role("tab", name="Business workspace").click()
    page.get_by_text("$25,000", exact=False).first.wait_for()
    assert not errors, errors
    width = page.evaluate("document.documentElement.scrollWidth")
    assert width <= 1440, width
    print({"fastapi": "PASS", "zones": 12, "company_neutral": True, "page_width": width, "page_errors": errors})
    page.close()


def check_streamlit(browser):
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(STREAMLIT+"/", wait_until="domcontentloaded")
    try:
        page.get_by_role("heading", name="Finance Architecture Studio").wait_for(timeout=12000)
    except Exception:
        print("STREAMLIT DEBUG", ascii(page.locator("body").inner_text()[:1800]), ascii(errors))
        page.screenshot(path=str(EVIDENCE / "streamlit_v3_debug.png"))
        raise
    page.get_by_role("button", name="Reconcile February 2026").click()
    page.get_by_text("Reconciliation for 2026-02: 0 USD variance.", exact=False).wait_for(timeout=30000)
    page.get_by_role("tab", name="Live architecture").click()
    assert page.locator(".route-zone").count() == 12
    page.locator(".command-controls select").first.select_option("2026-03")
    page.get_by_role("button", name="Run architecture").click()
    page.get_by_role("heading", name="Processing live").wait_for(timeout=20000)
    page.get_by_role("heading", name="Case complete").wait_for(timeout=45000)
    assert page.locator(".event-row").count() > 0
    assert "1000" not in page.locator(".architecture-layout").inner_text()
    page.screenshot(path=str(EVIDENCE / "streamlit_v3_local.png"))
    assert not errors, errors
    print({"streamlit": "PASS", "zones": 12, "page_errors": errors})
    page.close()


if __name__ == "__main__":
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        check_fastapi(browser)
        check_streamlit(browser)
        browser.close()
