"""Streamlit-surface check of the Cash and Treasury Assistant: routing, reruns, period sync, approval marker, refusal, reconciliation intact.
QA_STREAMLIT_URL=http://127.0.0.1:8924 python scripts/qa_treasury_streamlit.py   Screenshots: QA_SHOTS. Run from the repo root."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space
from poc import treasury as T

URL = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8924").rstrip("/")
SHOTS = Path(os.environ.get("QA_SHOTS", "treasury_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
nov, feb = T.position("2026-11")["totals"], T.position("2026-02")["totals"]
results = []


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.set_default_timeout(90000)
    page.goto(URL, wait_until="domcontentloaded")

    def surface():
        page.wait_for_timeout(4000)
        return page.frame_locator("iframe").first if page.locator("iframe").count() else page

    f = surface()
    f.locator(".entry-card").nth(3).wait_for(timeout=120000)
    check("streamlit entry has five cards", f.locator(".entry-card").count() == 5)
    f.locator("#entry-ask-input").fill("What is our cash position for November 2026?")
    check("streamlit routes the treasury question", f.locator("[data-testid=route-chip]").get_attribute("data-domain") == "treasury")
    f.get_by_role("button", name="Run plan →").click()
    f.locator("[data-testid=module-result]").wait_for(timeout=120000)
    page.wait_for_timeout(4500)
    check("streamlit agents area shows the treasury result and sources", "Cash and Treasury assistant" in f.locator("[data-testid=plan-domain]").inner_text() and f.locator("[data-testid=module-sources] a").count() >= 4 and f"{nov['usd_opening']:,}" in f.locator(".aw-answer").inner_text())
    page.screenshot(path=str(SHOTS / "s_t1_streamlit_agents_treasury.png"))
    nav(f).nth(1).click()
    f.locator("[data-testid=treasury-page][data-period='2026-11']").wait_for(timeout=90000)
    check("streamlit level 1 equals the calculation", f.locator("[data-testid=kpi-deficit] strong").inner_text() == str(nov["deficit"]) and f"{nov['usd_opening']:,}" in f.locator("[data-testid=kpi-cash]").inner_text())
    check("streamlit shows the drafted proposals", f.locator("[data-testid=treasury-recs] li").count() == 2 and "awaiting approval" in f.locator("[data-testid=treasury-recs]").inner_text())
    f.locator(".tr-role select").select_option("approver")
    f.get_by_role("button", name="Approve (marker)").first.click()
    page.wait_for_function("true")
    f.locator("[data-testid=treasury-recs]").get_by_text("approved marker").first.wait_for(timeout=60000)
    check("streamlit approval is a local marker only", "No bank transfer is initiated" in f.locator("[data-testid=treasury-page]").inner_text())
    page.screenshot(path=str(SHOTS / "s_t2_streamlit_level1_treasury.png"))
    f.locator("#global-period").select_option("2026-02")
    f.locator("[data-testid=treasury-page][data-period='2026-02']").wait_for(timeout=90000)
    page.wait_for_timeout(2500)
    check("streamlit February holds after rerun and has its own numbers", f.locator("#global-period").input_value() == "2026-02" and f"{feb['usd_opening']:,}" in f.locator("[data-testid=kpi-cash]").inner_text())
    f.get_by_role("button", name="Open detailed cash & treasury view").click()
    dialog = f.locator("dialog.rr-dialog")
    dialog.locator("[data-testid=detail-accounts]").wait_for(timeout=90000)
    check("streamlit detail dialog has six sections", dialog.get_by_role("tab").count() == 6 and dialog.locator("[data-testid=detail-accounts] tbody tr").count() == 9)
    dialog.get_by_role("button", name="Close cash and treasury view").click()
    nav(f).nth(3).click()
    f.locator("#aw-ask-input").fill("Initiate the bank transfer now")
    f.get_by_role("button", name="Run plan").click()
    f.locator(".aw-answer").get_by_text("not an agent action").first.wait_for(timeout=90000)
    check("streamlit refuses to initiate a transfer", f.locator("[data-testid=module-result]").count() == 0)
    f.locator("#global-period").select_option("2026-11")
    f.locator("#aw-ask-input").fill("Reconcile November 2026 company code 1000 ledger 0L USD")
    f.get_by_role("button", name="Run plan").click()
    f.locator("[data-testid=plan-domain]").get_by_text("Reconciliation agent").first.wait_for(timeout=120000)
    page.wait_for_timeout(5000)
    check("streamlit reconciliation agent still answers", "25,000" in f.locator(".aw-answer").inner_text())
    page.screenshot(path=str(SHOTS / "s_t3_streamlit_reconciliation_intact.png"))
    page.reload(wait_until="domcontentloaded")
    f = surface()
    f.locator(".entry-card").first.wait_for(timeout=120000)
    check("streamlit refresh keeps the period", f.locator("#entry-period").input_value() == "2026-11")
    browser.close()
print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
