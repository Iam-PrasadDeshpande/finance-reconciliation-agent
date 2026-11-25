"""Streamlit-surface check of the canonical period contract (embedded component, session state, reruns, refresh).
QA_STREAMLIT_URL=http://127.0.0.1:8924 python scripts/qa_period_sync_streamlit.py   Screenshots: QA_SHOTS."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8924").rstrip("/")
SHOTS = Path(os.environ.get("QA_SHOTS", "period_sync_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
FEB, NOV = "$0", "+$25,000"  # seeded variances for 2026-02 and 2026-11 (see poc/history.py)
results = []


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.set_default_timeout(60000)
    page.goto(URL, wait_until="domcontentloaded")
    def surface():  # hosted Streamlit renders the component in an iframe, newer local versions render it inline
        page.wait_for_timeout(4000)
        return page.frame_locator("iframe").first if page.locator("iframe").count() else page

    f = surface()
    f.locator(".entry-card").first.wait_for(timeout=120000)

    def level1(period):
        f.locator(f"[data-testid=period-panel][data-period='{period}']").wait_for(timeout=60000)
        return f.locator("[data-testid=level1-variance]").inner_text(), f.locator("#global-period").input_value()

    f.get_by_role("button", name="Open Close & reconcile").click()
    v, sel = level1("2026-11"); check("streamlit level 1 starts on November", v == NOV and sel == "2026-11", v)
    f.locator("#global-period").select_option("2026-02")
    v, sel = level1("2026-02"); check("streamlit level 1 shows February", v == FEB and sel == "2026-02", v)
    page.wait_for_timeout(2500)  # let the rerun round-trip finish; the old defect reset the period here
    check("February survives the Streamlit rerun", f.locator("#global-period").input_value() == "2026-02" and f.locator("[data-testid=level1-period]").inner_text().startswith("Feb 2026"))
    page.screenshot(path=str(SHOTS / "s01_streamlit_level1_february.png"))
    f.get_by_role("button", name="Ask the agents about February 2026").click()
    f.locator(".aw-answer").wait_for(timeout=120000)
    page.wait_for_timeout(2500)
    check("streamlit level 2 runs for February", "February 2026" in f.locator("[data-testid=plan-period]").inner_text() and "2026-02" in f.locator(".aw-answer").inner_text())
    check("streamlit level 2 selector is February", f.locator("#global-period").input_value() == "2026-02")
    page.screenshot(path=str(SHOTS / "s02_streamlit_level2_february.png"))
    f.locator(".tab-nav [role=tab]").nth(0).click()
    v, sel = level1("2026-02"); check("streamlit return to level 1 keeps February (case exists for it)", v == FEB and sel == "2026-02", v)
    for period, want in (("2026-11", NOV), ("2026-02", FEB), ("2026-11", NOV), ("2026-02", FEB)):
        f.locator("#global-period").select_option(period)
        v, _ = level1(period); check(f"streamlit switch to {period}", v == want, v)
        page.wait_for_timeout(1200)
        check(f"{period} holds after rerun", f.locator("#global-period").input_value() == period)
    f.get_by_role("button", name="Open detailed reconciliation").click()
    dialog = f.locator("dialog.rr-dialog")
    f.locator("#rr-title").wait_for(timeout=60000)
    dialog.get_by_role("tab", name="Matching details").click()
    check("streamlit detailed report is February and reconciles", "February 2026" in dialog.locator("#rr-title").inner_text() and dialog.locator("[data-testid=match-check]").inner_text() == "Rows explain the variance")
    page.screenshot(path=str(SHOTS / "s03_streamlit_matching_february.png"))
    dialog.get_by_role("button", name="Close reconciliation report").click()
    page.wait_for_timeout(800)
    page.reload(wait_until="domcontentloaded")
    f = surface()
    f.locator(".entry-card").first.wait_for(timeout=120000)
    check("streamlit refresh keeps February on the entry page", f.locator("#entry-period").input_value() == "2026-02")
    f.get_by_role("button", name="Open Close & reconcile").click()
    v, sel = level1("2026-02"); check("streamlit refresh keeps February on level 1", v == FEB and sel == "2026-02", v)
    page.screenshot(path=str(SHOTS / "s04_streamlit_after_refresh.png"))
    browser.close()
print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
