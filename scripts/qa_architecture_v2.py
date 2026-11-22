"""Local Chromium smoke check for the interactive synthetic architecture demo."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "evidence"


def main():
    errors = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto("http://127.0.0.1:8876/", wait_until="networkidle")
        page.locator("#tab-architecture").click()
        page.locator("#create-agent").click()
        page.locator("#demo-pace").select_option("30")
        page.locator('[data-demo-period="2026-02"]').click()
        page.locator("#demo-start").click()
        page.locator("#event-count").filter(has_text="persisted events").wait_for()
        page.wait_for_function("document.querySelectorAll('.component.processing').length > 0", timeout=10000)
        page.evaluate("window.scrollTo(0, 0)")
        page.screenshot(path=str(OUT / "architecture_v2_live.png"))
        page.locator("#demo-run-state").filter(has_text="Complete").wait_for(timeout=30000)
        assert "February 2026" in page.locator("#demo-question").input_value()
        assert "$0 USD" in page.locator("#demo-report").inner_text()
        assert page.locator(".component.completed").count() > 0
        page.evaluate("window.scrollTo(0, 0)")
        page.screenshot(path=str(OUT / "architecture_v2_result.png"))
        case_id = page.locator("#header-case").inner_text()

        page.locator(".demo-case-history summary").click()
        page.locator("#demo-prior-case").select_option(case_id)
        page.locator("#demo-load-case").click()
        page.locator("#demo-run-state").filter(has_text="Stored case").wait_for()
        page.locator("#replay").click()
        page.wait_for_function("document.querySelector('#active-event-seq').textContent.length > 0")
        assert "Replay" in page.locator("#timeline-mode").inner_text()
        page.locator("#pause").click()

        page.locator('[data-demo-period="2026-03"]').click()
        page.locator("#demo-start").click()
        page.locator("#demo-run-state").filter(has_text="Complete").wait_for(timeout=30000)
        assert "STALE" in page.locator("#demo-report").inner_text()
        assert "No comparable amount" in page.locator("#demo-report").inner_text()
        page.locator("#zoom").fill("125")
        page.screenshot(path=str(OUT / "architecture_v2_stale_detail.png"))

        page.locator("#source-period").locator("xpath=ancestor::details").locator("summary").click()
        page.locator("#source-period").select_option("2026-03")
        page.locator("#inspect-history").click()
        page.locator("#source-output").filter(has_text="SYN-J-2026-03-01").wait_for()
        width = page.evaluate("document.documentElement.scrollWidth")
        assert width <= 1440, f"Horizontal page overflow: {width}"
        assert not errors, errors
        print({"tabs": page.locator(".top-tab").count(), "components": page.locator(".component").count(), "history_months": page.locator(".month-chip").count(), "stored_case_loaded": case_id, "stale_report": True, "page_width": width, "javascript_errors": errors})
        browser.close()


if __name__ == "__main__":
    main()
