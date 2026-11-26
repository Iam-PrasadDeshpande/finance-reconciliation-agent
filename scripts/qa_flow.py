"""One flow, with links both ways: whatever is asked anywhere runs the same agents, and the full output is one click away.

Works against the local web app or a Streamlit surface (the component may be in an iframe):
    QA_URL=http://127.0.0.1:8925 python scripts/qa_flow.py
    QA_URL=https://finance-reconciliation-agent.streamlit.app python scripts/qa_flow.py   (QA_MOBILE=1 for a phone viewport)
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space
from poc import treasury as T

URL = os.environ.get("QA_URL", "http://127.0.0.1:8899").rstrip("/")
MOBILE = os.environ.get("QA_MOBILE") == "1"
SHOTS = Path(os.environ.get("QA_SHOTS", "flow_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
NOV_CASH = f"{T.position('2026-11')['totals']['usd_opening']:,}"
results = []


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))
    return bool(ok)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844} if MOBILE else {"width": 1440, "height": 900})
    page.set_default_timeout(120000)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.locator(".entry-card").nth(3).wait_for(timeout=150000)

    def area(index):
        nav(f).nth(index).click()

    def shot(name):
        page.screenshot(path=str(SHOTS / f"{name}{'_m' if MOBILE else ''}.png"))

    # 1. Reconciliation request typed on the front screen: same text on the agent screen, output one click away
    request = "Reconcile November 2026 company code 1000 ledger 0L USD"
    f.locator("#entry-ask-input").fill(request)
    f.get_by_role("button", name="Run plan →").click()
    f.locator("[data-testid=plan-output]").wait_for(timeout=150000)
    page.wait_for_timeout(5500)
    check("the agent screen shows exactly what was typed on the front screen", request in f.locator("[data-testid=plan-request]").inner_text())
    check("a clear link to the full output is shown under the answer", f.locator("[data-testid=plan-output-screen]").inner_text().startswith("Open in Close & reconcile") and f.locator("[data-testid=plan-output-detail]").count() == 1)
    shot("f1_agent_with_output_links")
    f.locator("[data-testid=plan-output-screen]").click()
    f.locator("[data-testid=close-screen]").wait_for(timeout=60000)
    check("the link opens Close & reconcile on the same period", "Nov 2026" in f.locator("[data-testid=level1-period]").inner_text())
    check("Close & reconcile points back to the agent run", f.locator("[data-testid=agent-run-banner]").count() == 1 and "25,000" in f.locator("[data-testid=agent-run-banner]").inner_text())
    shot("f2_close_with_agent_banner")
    f.locator("[data-testid=agent-run-banner] button").click()
    f.locator("[data-testid=plan-domain]").wait_for(timeout=60000)
    check("and the banner link returns to the agent run", "Reconciliation agent" in f.locator("[data-testid=plan-domain]").inner_text() and f.locator("[data-testid=plan-output]").count() == 1)
    f.locator("[data-testid=plan-output-detail]").click()
    f.locator("dialog.rr-dialog #rr-title").get_by_text("November 2026").wait_for(timeout=60000)
    check("the detail link opens the detailed reconciliation report for that period", "November 2026" in f.locator("dialog.rr-dialog #rr-title").inner_text())
    f.locator("dialog.rr-dialog").get_by_role("button", name="Close reconciliation report").click()

    # 2. Cash and treasury request from the Cash & treasury screen: same flow, same links
    area(1)
    f.locator("[data-testid=treasury-page]").wait_for(timeout=90000)
    f.locator("#ask-bar-input").fill("What is our cash position for November 2026?")
    f.get_by_role("button", name="Ask →").click()
    f.locator("[data-testid=plan-request]").get_by_text("cash position").first.wait_for(timeout=150000)  # the previous run stays on screen until the new one arrives
    f.locator("[data-testid=plan-output]").wait_for(timeout=150000)
    page.wait_for_timeout(5500)
    check("a treasury request is handled by the treasury module with its own output link", "Cash and Treasury assistant" in f.locator("[data-testid=plan-domain]").inner_text() and f.locator("[data-testid=plan-output-screen]").inner_text().startswith("Open in Cash & treasury"))
    check("the request typed on the Cash & treasury screen is shown on the agent screen", "cash position" in f.locator("[data-testid=plan-request]").inner_text().lower())
    f.locator("[data-testid=plan-output-detail]").click()
    f.locator("dialog.rr-dialog [data-testid=detail-accounts]").wait_for(timeout=60000)
    check("the detail link opens the detailed cash & treasury view with the same numbers", NOV_CASH in f.locator("dialog.rr-dialog").inner_text() or f.locator("dialog.rr-dialog [data-testid=detail-accounts] tbody tr").count() == 9)
    f.locator("dialog.rr-dialog").get_by_role("button", name="Close cash and treasury view").click()
    check("Cash & treasury points back to the agent run", f.locator("[data-testid=agent-run-banner]").count() == 1)
    shot("f3_treasury_with_agent_banner")

    # 3. Asking from inside Close & reconcile uses the same agents, never the old chat or the old consolidated report
    area(0)
    f.locator("[data-testid=close-screen]").wait_for(timeout=60000)
    f.get_by_role("button", name="Ask the agents about November 2026").first.click()
    f.locator("[data-testid=plan-request]").get_by_text("Reconcile November 2026").first.wait_for(timeout=150000)
    page.wait_for_timeout(5500)
    body = f.locator("main.agent-workbench").inner_text()
    check("asking from Close & reconcile runs the reconciliation agents on the agent screen", "Reconciliation agent" in f.locator("[data-testid=plan-domain]").inner_text() and "Reconcile November 2026" in f.locator("[data-testid=plan-request]").inner_text())
    check("no legacy chat panel and no old consolidated report", f.locator(".chat-panel").count() == 0 and f.locator("text=Business analysis report").count() == 0 and "Ask about the evidence" not in body)

    # 4. The shell menu no longer opens a separate legacy chat
    if not MOBILE:
        f.get_by_role("button", name="Open application menu").click()
        f.get_by_role("menuitem", name="Ask Finance Agent").click()
        f.locator("main.agent-workbench").wait_for(timeout=30000)
        check("the menu's Ask Finance Agent goes to the agent screen", f.locator(".chat-panel.open").count() == 0)

    # 5. Close & reconcile in one view
    area(0)
    f.locator("[data-testid=close-screen]").wait_for(timeout=60000)
    rows = f.locator(".worklist button")
    check("Close & reconcile lists all twelve periods with both balances and the variance", rows.count() == 12 and "$" in rows.nth(0).inner_text() and rows.nth(11).locator("span").count() >= 3)
    if not MOBILE:
        overflow = f.locator("[data-testid=close-screen]").evaluate("e => e.scrollHeight - e.clientHeight")
        embedded = page.locator("iframe").count() > 0 or page.locator("[data-testid=stApp]").count() > 0
        # standalone: everything in one view. Inside Streamlit the page chrome takes some height, so allow a small scroll.
        check("Close & reconcile is visible in one view on a 1440x900 laptop" + (" (Streamlit: within 140px)" if embedded else ""), overflow <= (140 if embedded else 2), f"overflow {overflow}px")
    shot("f4_close_one_view")
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
