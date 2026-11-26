"""Browser acceptance for the Cash and Treasury Assistant next to the Reconciliation agent.

QA_WEB_URL=http://127.0.0.1:8925 python scripts/qa_treasury.py        Screenshots: QA_SHOTS (default ./treasury_evidence)
Expected numbers come from /api/treasury/<period>, never from the UI.
"""
import json
import os
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8899").rstrip("/")
SHOTS = Path(os.environ.get("QA_SHOTS", "treasury_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
results = []


def api(path, data=None):
    request = urllib.request.Request(WEB + path, data=json.dumps(data).encode() if data is not None else None, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read())


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))
    return bool(ok)


def fmt(n):
    return f"{n:,}"


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    api("/api/treasury/proposals")  # warm
    nov, feb = api("/api/treasury/2026-11"), api("/api/treasury/2026-02")

    def shot(name):
        page.screenshot(path=str(SHOTS / f"{name}.png"))

    def tab(index):
        page.locator(".tab-nav [role=tab]").nth(index).click()

    # 1. Entry: four cards and live routing
    page.goto(WEB + "/", wait_until="domcontentloaded")
    page.locator(".entry-card").nth(3).wait_for(timeout=30000)  # the module cards come from the manifests
    check("entry has four cards including Cash & treasury", page.locator(".entry-card").count() == 4 and page.get_by_role("button", name="Open Cash & treasury").count() == 1)
    page.locator("#entry-ask-input").fill("What is our cash position for November 2026?")
    check("treasury question routes to the Cash and Treasury assistant", page.locator("[data-testid=route-chip]").get_attribute("data-domain") == "treasury")
    page.locator("#entry-ask-input").fill("Reconcile November 2026 company code 1000 ledger 0L USD")
    check("reconciliation question routes to the Reconciliation agent", page.locator("[data-testid=route-chip]").get_attribute("data-domain") == "reconciliation")
    shot("t01_entry_routing")

    # 2. Level 1 -> ask -> Level 2 (treasury)
    page.locator("#entry-ask-input").fill("What is our cash position for November 2026?")
    page.get_by_role("button", name="Run plan →").click()
    page.locator("[data-testid=module-result]").wait_for(timeout=60000)
    page.wait_for_timeout(4500)
    check("agents area shows the treasury family and badge", "Cash and Treasury assistant" in page.locator("[data-testid=plan-domain]").inner_text()
          and page.locator(".domain-switch [aria-selected=true]").inner_text() == "Cash and Treasury Assistant")
    check("roster lists the four SAP-modelled agents", page.locator(".aw-roster li").count() == 4 and "Cash Positioning Agent" in page.locator(".aw-roster").inner_text())
    page.locator(".aw-roster li", has_text="Cash Positioning Agent").first.click()
    sor = page.locator("[data-testid=systems-of-record]")
    check("cash agent detail names its system of record with the design-assumption note", sor.count() >= 1 and "S/4HANA" in sor.first.inner_text() and "not verified" in sor.first.inner_text(), sor.first.inner_text()[:90] if sor.count() else "")
    check("orchestration graph draws the treasury agents and the layers reached", page.locator("[data-testid=diagram-orchestration] [data-node]").count() >= 8)
    answer = page.locator(".aw-answer").inner_text()
    check("answer carries the computed Nov numbers", fmt(nov["position"]["totals"]["usd_opening"]) in answer and "synthetic" in answer and "no bank transfer was initiated" in answer, answer[:110].replace(chr(10), " "))
    check("result table lists nine accounts and SAP sources are cited", page.locator("[data-testid=module-result] tbody tr").count() >= 9 and page.locator("[data-testid=module-sources] a").count() >= 4)
    check("orchestrator adapted the plan after finding deficits", "generate_transfer_recommendations" in page.locator(".aw-adapt").inner_text())
    shot("t02_level2_treasury_plan")

    # 3. Level 1 Cash & treasury
    tab(1)
    page.locator("[data-testid=treasury-page][data-period='2026-11']").wait_for(timeout=30000)
    check("level 1 KPIs equal the calculation (Nov)", page.locator("[data-testid=kpi-deficit] strong").inner_text() == str(nov["position"]["totals"]["deficit"])
          and page.locator("[data-testid=kpi-idle] strong").inner_text() == str(nov["position"]["totals"]["idle"])
          and fmt(nov["position"]["totals"]["usd_opening"]) in page.locator("[data-testid=kpi-cash]").inner_text())
    check("level 1 shows nine accounts and the provenance strip", page.locator("[data-testid=treasury-accounts] tbody tr").count() == 9 and "SYNTHETIC / DEMONSTRATION" in page.locator("[data-testid=treasury-page]").inner_text() and "NOT CONNECTED / NOT VERIFIED" in page.locator("[data-testid=treasury-page]").inner_text())
    check("policy breaches and statements are reported", page.locator("[data-testid=kpi-policy] strong").inner_text() == "5 of 6" and page.locator("[data-testid=kpi-statements] strong").inner_text() == "8 of 9")
    recs = page.locator("[data-testid=treasury-recs] li")
    check("two recommendations are awaiting approval and the unreliable source is caveated", recs.count() == 2 and "awaiting approval" in recs.first.inner_text() and "Check the bank statement of 2000-COL" in page.locator("[data-testid=treasury-recs]").inner_text())
    check("maker cannot approve", page.get_by_role("button", name="Approve (marker)").first.is_disabled())
    page.locator(".tr-role select").select_option("approver")
    page.get_by_role("button", name="Approve (marker)").first.click()
    page.wait_for_function("document.querySelector('[data-testid=treasury-recs]')?.innerText.includes('approved marker')", timeout=15000)
    check("approver records a local marker only", "approved marker" in page.locator("[data-testid=treasury-recs]").inner_text() and "No bank transfer is initiated" in page.locator("[data-testid=treasury-page]").inner_text())
    shot("t03_level1_treasury_nov")

    # 4. Period synchronization across both levels and both domains
    page.locator("#global-period").select_option("2026-02")
    page.locator("[data-testid=treasury-page][data-period='2026-02']").wait_for(timeout=30000)
    check("level 1 treasury switches to February's numbers", page.locator("[data-testid=kpi-deficit] strong").inner_text() == str(feb["position"]["totals"]["deficit"])
          and fmt(feb["position"]["totals"]["usd_opening"]) in page.locator("[data-testid=kpi-cash]").inner_text() and fmt(nov["position"]["totals"]["usd_opening"]) not in page.locator("[data-testid=kpi-cash]").inner_text())
    shot("t04_level1_treasury_feb")
    tab(2)
    page.locator("[data-testid=plan-stale]").wait_for(timeout=10000)
    check("level 2 flags the November treasury plan as stale for February", "November 2026" in page.locator("[data-testid=plan-stale]").inner_text())
    page.get_by_role("button", name="Run for February 2026").click()
    page.wait_for_function("document.querySelector('[data-testid=plan-period]')?.innerText.includes('February 2026')", timeout=60000)
    check("the re-run stays in the treasury family for February", "Cash and Treasury assistant" in page.locator("[data-testid=plan-domain]").inner_text() and fmt(feb["position"]["totals"]["usd_opening"]) in page.locator(".aw-answer").inner_text())
    tab(1)
    page.locator("[data-testid=treasury-page][data-period='2026-02']").wait_for(timeout=30000)
    check("returning to level 1 keeps February", page.locator("#global-period").input_value() == "2026-02")
    for period, expected in (("2026-11", nov), ("2026-02", feb), ("2026-11", nov)):
        page.locator("#global-period").select_option(period)
        page.locator(f"[data-testid=treasury-page][data-period='{period}']").wait_for(timeout=30000)
        check(f"repeat switch to {period} shows its own cash", fmt(expected["position"]["totals"]["usd_opening"]) in page.locator("[data-testid=kpi-cash]").inner_text())

    # 5. Detail dialog: every section, horizon switch, SAP sources
    page.get_by_role("button", name="Open detailed cash & treasury view").click()
    dialog = page.locator("dialog.rr-dialog")
    dialog.locator("[data-testid=detail-accounts]").wait_for(timeout=30000)
    check("detail position table has nine accounts and a total", dialog.locator("[data-testid=detail-accounts] tbody tr").count() == 9)
    dialog.get_by_role("tab", name="Forecast").click()
    before = dialog.locator("[data-testid=detail-forecast] tbody tr").first.inner_text()
    dialog.get_by_role("button", name="90 days").click()
    after = api("/api/treasury/2026-11")["forecast"]["90"]
    check("forecast horizon switch shows the 90-day projection", f"{after['by_currency'][0]['closing']:,}" in dialog.locator("[data-testid=detail-forecast]").inner_text(), before[:40])
    dialog.get_by_role("tab", name="Bank relationships").click()
    check("bank table lists four banks and flags the concentration breach", dialog.locator("[data-testid=detail-banks] tbody tr").count() == 4 and "Bank Charlie" in dialog.locator("[data-testid=detail-banks]").locator("xpath=..").inner_text())
    dialog.get_by_role("tab", name="Policy & statements").click()
    check("six policy rules are listed", dialog.locator("[data-testid=detail-policy] tbody tr").count() == 6)
    dialog.get_by_role("tab", name="Transfer proposals").click()
    check("proposals tab shows templates and the approved marker", dialog.locator("[data-testid=detail-proposals]").inner_text().count("TT-0") >= 6 and "approved marker" in dialog.locator("[data-testid=detail-proposals]").inner_text())
    dialog.get_by_role("tab", name="SAP guidance & sources").click()
    sap = dialog.locator("[data-testid=detail-sap]").inner_text()
    check("SAP tab cites sources, keeps posting manual and flags what is not verified", dialog.locator("[data-testid=detail-sap] a").count() == 6 and "NOT_VERIFIED" in sap and "never initiates a bank transfer" in sap and "F1737" in sap)
    shot("t05_detail_sap_sources")
    dialog.get_by_role("button", name="Close cash and treasury view").click()

    # 6. Controls: initiation is refused, unavailable period is explicit
    tab(2)
    page.locator("#aw-ask-input").fill("Initiate the bank transfer now")
    page.get_by_role("button", name="Run plan").click()
    page.locator(".aw-answer").wait_for(timeout=30000)
    page.wait_for_function("document.querySelector('.aw-answer')?.innerText.includes('not an agent action')", timeout=30000)
    check("initiating a bank transfer is refused and nothing runs", "not an agent action" in page.locator(".aw-plan-state").inner_text() and "blocked" in page.locator(".aw-plan-state").get_attribute("class") and page.locator("[data-testid=module-result]").count() == 0)
    page.locator("#aw-ask-input").fill("What is our cash position for December 2026?")
    page.get_by_role("button", name="Run plan").click()
    page.wait_for_function("document.querySelector('.aw-answer')?.innerText.includes('NO DATA AVAILABLE FOR DECEMBER 2026')", timeout=30000)
    check("unavailable period is explicit and never substituted", "2026-11" not in page.locator(".aw-answer").inner_text())
    shot("t06_refused_and_no_data")

    # 7. The reconciliation agent still works, and the domain switch shows each family
    page.locator("#global-period").select_option("2026-11")
    page.locator("#aw-ask-input").fill("Reconcile November 2026 company code 1000 ledger 0L USD")
    page.get_by_role("button", name="Run plan").click()
    page.wait_for_function("document.querySelector('[data-testid=plan-domain]')?.innerText.includes('Reconciliation agent')", timeout=60000)
    page.wait_for_timeout(5000)
    check("reconciliation request goes to the Reconciliation agent with its own roster", page.locator(".aw-roster li").count() == 7 and "25,000" in page.locator(".aw-answer").inner_text() and page.locator("[data-testid=module-result]").count() == 0)
    page.get_by_role("tab", name="Cash and Treasury assistant").click()
    check("switching the family lists the treasury agents and tools", page.locator(".aw-roster li").count() == 4 and page.locator(".aw-catalog tbody tr").count() == 9)
    page.get_by_role("tab", name="Reconciliation agent").click()
    check("and back to the reconciliation agents", page.locator(".aw-roster li").count() == 7)
    shot("t07_reconciliation_still_works")

    # 8. Architecture views are unchanged and the treasury events are reachable in the Live run
    tab(3)
    check("architecture area keeps its views and adds the ontology", page.get_by_role("tablist", name="Architecture views").get_by_role("tab").count() == 9)
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
