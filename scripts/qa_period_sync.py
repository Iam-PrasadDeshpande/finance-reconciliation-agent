"""Browser acceptance for period synchronization between Level 1 (Close & reconcile) and Level 2 (Agents, detailed report).

Run against a local web server:  QA_WEB_URL=http://127.0.0.1:8899 python scripts/qa_period_sync.py
Screenshots go to QA_SHOTS (default ./period_sync_evidence). Expected values come from /api/reports/<period>, not from the UI.
"""
import json
import os
import re
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8899").rstrip("/")
SHOTS = Path(os.environ.get("QA_SHOTS", "period_sync_evidence"))
SHOTS.mkdir(parents=True, exist_ok=True)
results = []


def api(path):
    with urllib.request.urlopen(WEB + path, timeout=30) as response:
        return json.loads(response.read())


def money(value):
    sign = "+" if value > 0 else "−" if value < 0 else ""
    return f"{sign}${abs(value):,}"


def record(name, ok, detail=""):
    results.append((name, ok, detail))
    print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))


def check(name, condition, detail=""):
    record(name, bool(condition), detail)
    return bool(condition)


def shot(page, name):
    page.screenshot(path=str(SHOTS / f"{name}.png"))


def open_app(page, url=WEB + "/"):
    page.goto(url, wait_until="domcontentloaded")
    page.locator(".entry-card").first.wait_for(timeout=30000)


def enter(page):
    page.get_by_role("button", name="Open Close & reconcile").click()
    page.locator("[data-testid=period-panel], [data-testid=level1-nodata]").first.wait_for(timeout=30000)


def select_header(page, period):
    page.locator("#global-period").select_option(period)


def level1(page, period):
    page.locator(f"[data-testid=period-panel][data-period='{period}']").wait_for(timeout=30000)
    return {"badge": page.locator("[data-testid=level1-period]").inner_text(), "variance": page.locator("[data-testid=level1-variance]").inner_text(),
            "selected": page.locator("#global-period").input_value()}


def tab(page, index):
    page.locator(".tab-nav [role=tab]").nth(index).click()


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    expected = {p: api(f"/api/reports/{p}") for p in ("2026-02", "2026-11")}
    feb, nov = expected["2026-02"], expected["2026-11"]
    check("fixtures differ by period", feb["summary"]["variance"] != nov["summary"]["variance"] and feb["matching"]["rows"] != nov["matching"]["rows"],
          f"Feb {feb['summary']['variance']} / Nov {nov['summary']['variance']}")

    # 1. Default November on Level 1
    open_app(page)
    check("entry default is the November selector value", page.locator("#entry-period").input_value() == "2026-11")
    enter(page)
    l1 = level1(page, "2026-11")
    check("level 1 starts on November 2026", "Nov 2026" in l1["badge"] and l1["variance"] == money(nov["summary"]["variance"]), str(l1))
    shot(page, "01_level1_november")

    # 2. Select February in Level 1
    select_header(page, "2026-02")
    l1 = level1(page, "2026-02")
    check("level 1 shows February after selecting it", "Feb 2026" in l1["badge"] and l1["variance"] == money(feb["summary"]["variance"]), str(l1))
    check("worklist highlights February", page.locator(".worklist button.selected span").first.inner_text() == "2026-02")
    check("ask bar effective period is February", "February 2026" in page.locator(".agent-ask-bar .period-effective").inner_text())
    shot(page, "02_level1_february_selected")

    # 3. Level 1 -> Level 2 (Ask the agents about February)
    page.get_by_role("button", name="Ask the agents about February 2026").click()
    page.locator(".aw-answer").wait_for(timeout=60000)
    page.wait_for_timeout(1500)
    plan_period = page.locator("[data-testid=plan-period]").inner_text()
    answer = page.locator(".aw-answer").inner_text()
    check("level 2 plan runs for February", "February 2026" in plan_period and "2026-02" in answer, plan_period)
    check("level 2 header selector still February", page.locator("#global-period").input_value() == "2026-02")
    check("level 2 answer carries the February variance", f"{abs(feb['summary']['variance']):,}" in answer.replace("\n", " ") or feb["summary"]["variance"] == 0, answer[:160].replace("\n", " "))
    check("no stale-plan banner while periods agree", page.locator("[data-testid=plan-stale]").count() == 0)
    shot(page, "03_level2_february")

    # 4. Level 2 -> Level 1 preserves February
    tab(page, 0)
    l1 = level1(page, "2026-02")
    check("returning to level 1 keeps February", "Feb 2026" in l1["badge"] and l1["selected"] == "2026-02", str(l1))
    shot(page, "04_level1_after_return_february")

    # 5. Change the period inside Level 2: stale plan is flagged, not shown as current
    tab(page, 2)
    select_header(page, "2026-11")
    page.locator("[data-testid=plan-stale]").wait_for(timeout=10000)
    check("changing period at level 2 flags the February plan as stale", "February 2026" in page.locator("[data-testid=plan-stale]").inner_text())
    shot(page, "05_level2_stale_plan_flag")
    page.get_by_role("button", name="Run for November 2026").click()
    page.wait_for_function("document.querySelector('[data-testid=plan-period]')?.innerText.includes('November 2026')", timeout=60000)
    check("level 2 re-run is for November", "2026-11" in page.locator(".aw-answer").inner_text())
    tab(page, 0)
    l1 = level1(page, "2026-11")
    check("level 1 follows the level 2 selection", "Nov 2026" in l1["badge"], str(l1))

    # 6. Worklist row selects the period; detailed report; matching; posting guide
    page.locator(".worklist button", has_text="2026-02").click()
    l1 = level1(page, "2026-02")
    check("worklist row selects February", "Feb 2026" in l1["badge"])
    page.get_by_role("button", name="Open detailed reconciliation").click()
    dialog = page.locator("dialog.rr-dialog")
    dialog.locator("#rr-period").wait_for(timeout=30000)
    page.wait_for_function("document.querySelector('#rr-title')?.innerText.includes('February 2026')", timeout=30000)
    check("detailed report is February", "February 2026" in dialog.locator("#rr-title").inner_text() and dialog.locator("#rr-period").input_value() == "2026-02")
    check("report shows provenance", "SYNTHETIC / DEMONSTRATION" in dialog.inner_text() and "NOT CONNECTED / NOT VERIFIED" in dialog.inner_text() and "READ-ONLY PROPOSED WORKFLOW" in dialog.inner_text())
    dialog.get_by_role("tab", name="Matching details").click()
    check("matching rows reconcile to the summary variance", dialog.locator("[data-testid=match-check]").inner_text() == "Rows explain the variance")
    check("matching row count is February's", dialog.locator("[data-testid=matching-table] tbody tr").count() == len(feb["matching"]["rows"]), f"{len(feb['matching']['rows'])} rows")
    shot(page, "06_detail_february_matching")
    dialog.get_by_role("tab", name="SAP posting guide").click()
    guide = dialog.locator("[data-testid=posting-guide]").inner_text()
    check("posting guide names the Fiori apps and stays manual", all(x in guide for x in ("F0718", "F0717", "F2547A")) and "never posts to SAP" in guide)
    check("posting guide invents no document number", not re.search(r"\b(49|10|20|50)\d{8}\b", guide) and "holds no SAP document number" in guide)
    shot(page, "07_detail_posting_guide")
    dialog.locator("#rr-period").select_option("2026-11")
    page.wait_for_function("document.querySelector('#rr-title')?.innerText.includes('November 2026')", timeout=30000)
    dialog.get_by_role("tab", name="Matching details").click()
    check("report switches to November data", dialog.locator("[data-testid=matching-table] tbody tr").count() == len(nov["matching"]["rows"]))
    check("November matching reconciles", dialog.locator("[data-testid=match-check]").inner_text() == "Rows explain the variance")
    shot(page, "08_detail_november_matching")
    dialog.get_by_role("button", name="Close reconciliation report").click()
    l1 = level1(page, "2026-11")
    check("closing the report leaves level 1 on the period chosen inside it", "Nov 2026" in l1["badge"] and l1["variance"] == money(nov["summary"]["variance"]), str(l1))

    # 7. Repeated switching: Nov -> Feb -> Nov -> Feb with no stale values
    seen = []
    for period, exp in (("2026-02", feb), ("2026-11", nov), ("2026-02", feb), ("2026-11", nov), ("2026-02", feb)):
        select_header(page, period)
        state = level1(page, period)
        seen.append(state["variance"])
        check(f"switch to {period} shows its own variance", state["variance"] == money(exp["summary"]["variance"]), state["variance"])
    shot(page, "09_repeated_switching_end_february")

    # 8. Scenario lab changes February data; matching explains the new variance
    page.locator(".rr-condition select").select_option("late_posting")
    page.get_by_role("button", name="Apply to 2026-02").click()
    page.wait_for_timeout(1500)
    level1(page, "2026-02")
    changed = api("/api/reports/2026-02")
    check("scenario lab changed only February", changed["summary"]["variance"] != 0 and api("/api/reports/2026-11")["summary"]["variance"] == nov["summary"]["variance"])
    page.wait_for_function("document.querySelector('[data-testid=level1-variance]')?.innerText!=='$0'", timeout=15000)
    check("level 1 shows the recalculated February variance", page.locator("[data-testid=level1-variance]").inner_text() == money(changed["summary"]["variance"]), page.locator("[data-testid=level1-variance]").inner_text())
    check("API matching rows still sum to the recalculated variance", changed["matching"]["totals"]["reconciles"] and changed["matching"]["totals"]["difference_total"] == changed["summary"]["variance"])
    shot(page, "10_february_recalculated_after_condition")
    page.locator(".rr-condition select").select_option("baseline")
    page.get_by_role("button", name="Apply to 2026-02").click()
    page.wait_for_timeout(1500)
    check("baseline restored", api("/api/reports/2026-02")["summary"]["variance"] == feb["summary"]["variance"])

    # 9. Refresh and deep links
    select_header(page, "2026-02")
    level1(page, "2026-02")
    page.reload(wait_until="domcontentloaded")
    page.locator(".entry-card").first.wait_for(timeout=30000)
    check("refresh keeps February on the entry page", page.locator("#entry-period").input_value() == "2026-02")
    enter(page)
    check("refresh keeps February on level 1", "Feb 2026" in level1(page, "2026-02")["badge"])
    shot(page, "11_after_refresh_february")
    deep = browser.new_page(viewport={"width": 1440, "height": 900})
    open_app(deep, WEB + "/?period=2026-02")
    enter(deep)
    check("deep link ?period=2026-02 opens February", "Feb 2026" in level1(deep, "2026-02")["badge"])
    tab(deep, 2)
    deep.locator("#aw-ask-input").wait_for()
    check("deep link reaches level 2 with February in the request text", "February 2026" in deep.locator("#aw-ask-input").input_value() and "February 2026" in deep.locator(".aw-ask .period-effective").inner_text())
    deep.close()

    # 10. Unavailable periods are explicit, never substituted
    gone = browser.new_page(viewport={"width": 1440, "height": 900})
    open_app(gone, WEB + "/?period=2027-01")
    enter(gone)
    check("unavailable period shows NO DATA", "NO DATA AVAILABLE FOR JANUARY 2027" in gone.locator("[data-testid=level1-nodata]").inner_text())
    check("no November figure under the unavailable heading", gone.locator("[data-testid=period-panel]").count() == 0)
    shot(gone, "12_unavailable_period_no_data")
    gone.close()
    page.locator("#global-period").select_option("2026-11")
    tab(page, 2)
    page.locator("#aw-ask-input").fill("Reconcile December 2026 company code 1000 ledger 0L USD")
    check("effective-period chip warns before running", "NO DATA AVAILABLE FOR DECEMBER 2026" in page.locator(".aw-ask .period-effective").inner_text())
    page.get_by_role("button", name="Run plan").click()
    page.wait_for_timeout(2500)
    page.locator(".aw-answer").wait_for(timeout=30000)
    refusal = page.locator(".aw-answer").inner_text()
    check("agent refuses the unavailable period explicitly in its answer", "NO DATA AVAILABLE FOR DECEMBER 2026" in refusal and "2026-11" not in refusal, refusal[:120].replace(chr(10), " "))
    shot(page, "13_agent_unavailable_period")

    # 11. A request that names a period wins over the selector, and the selection follows it
    page.locator("#global-period").select_option("2026-11")
    page.locator("#aw-ask-input").fill("Reconcile February 2026 company code 1000 ledger 0L USD")
    check("chip shows the request period wins", "taken from your request" in page.locator(".aw-ask .period-effective").inner_text())
    page.get_by_role("button", name="Run plan").click()
    page.wait_for_function("document.querySelector('[data-testid=plan-period]')?.innerText.includes('February 2026')", timeout=60000)
    page.wait_for_timeout(500)
    check("selector follows the explicit request", page.locator("#global-period").input_value() == "2026-02")
    shot(page, "14_request_period_wins")

    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

failed = [item for item in results if not item[1]]
print(f"\n{len(results) - len(failed)} passed, {len(failed)} failed")
raise SystemExit(1 if failed else 0)
