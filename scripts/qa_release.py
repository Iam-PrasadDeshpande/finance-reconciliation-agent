"""Positive and negative browser acceptance on the local synthetic entrypoints."""
from pathlib import Path
import os
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"docs"/"evidence"
OUT.mkdir(parents=True,exist_ok=True)
WEB=os.environ.get("QA_WEB_URL","http://127.0.0.1:8877")
STREAMLIT=os.environ.get("QA_STREAMLIT_URL","http://127.0.0.1:8503")

with sync_playwright() as playwright:
    browser=playwright.chromium.launch()
    fast=browser.new_page(viewport={"width":1440,"height":900})
    errors=[]
    fast.on("pageerror",lambda error: errors.append(str(error)))
    fast.goto(WEB+"/",wait_until="networkidle")
    fast.get_by_role("heading",name="Reconciliation work center").wait_for()
    assert fast.locator(".worklist button").count()==12
    assert fast.locator(".cockpit-kpis .attention strong").inner_text()=="3"
    fast.get_by_role("button",name="Reconcile February 2026").click()
    fast.get_by_text("Reconciliation for 2026-02: 0 USD variance.",exact=False).wait_for()
    fast.get_by_role("button",name="Propose an adjustment").click()
    fast.get_by_text("Zero variance has no synthetic journal proposal",exact=False).wait_for()
    fast.locator("#chat-question").fill("Reconcile November 2026")
    fast.get_by_role("button",name="Send").click()
    fast.get_by_text("Reconciliation for 2026-11: 25,000 USD variance.",exact=False).wait_for()
    fast.get_by_role("button",name="Open account, document and correlation evidence").click()
    fast.get_by_role("tab",name="Evidence & correlation").wait_for()
    fast.get_by_text("Open 24 G/L account balances").click()
    assert fast.locator(".source-evidence details").first.locator(".source-evidence-rows>div").count()==24
    fast.get_by_text("Open 12 journal evidence records").click()
    assert fast.locator(".source-evidence details").nth(1).locator(".source-evidence-rows>div").count()==12
    fast.get_by_role("tab",name="Business workspace").click()
    fast.get_by_role("button",name="Propose variance marker").click()
    fast.get_by_text("awaiting a separate finance approval",exact=False).wait_for()
    assert fast.get_by_role("button",name="Approve variance marker").is_disabled()
    fast.locator("#demo-role").select_option("approver")
    fast.get_by_role("button",name="Approve variance marker").click()
    fast.get_by_text("Synthetic variance marker SYN-",exact=False).wait_for()
    fast.screenshot(path=str(OUT/"release_work_center.png"),full_page=True)
    assert not errors,errors

    race=browser.new_page(viewport={"width":1280,"height":800})
    race.goto(WEB+"/",wait_until="networkidle")
    race.get_by_role("button",name="Reconcile February 2026").click()
    race.get_by_role("button",name="Show source evidence").click(force=True)
    race.get_by_text("Reconciliation for 2026-02: 0 USD variance.",exact=False).wait_for()
    assert race.locator(".chat-message.user").count()==1
    race.close()

    mobile=browser.new_page(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
    mobile.goto(WEB+"/",wait_until="networkidle")
    mobile.get_by_role("heading",name="Reconciliation work center").wait_for()
    assert mobile.evaluate("document.documentElement.scrollWidth")<=390
    mobile.screenshot(path=str(OUT/"release_mobile.png"),full_page=True)

    a=browser.new_page(viewport={"width":1280,"height":800})
    b=browser.new_page(viewport={"width":1280,"height":800})
    a.goto(STREAMLIT+"/",wait_until="domcontentloaded")
    b.goto(STREAMLIT+"/",wait_until="domcontentloaded")
    a.get_by_role("heading",name="Reconciliation work center").wait_for(timeout=20000)
    b.get_by_role("heading",name="Reconciliation work center").wait_for(timeout=20000)
    a.get_by_role("button",name="Reconcile November 2026").click() if a.get_by_role("button",name="Reconcile November 2026").count() else a.locator("#chat-question").fill("Reconcile November 2026")
    if not a.get_by_text("Reconciliation for 2026-11: 25,000 USD variance.",exact=False).count():
        a.get_by_role("button",name="Send").click()
    a.get_by_text("Reconciliation for 2026-11: 25,000 USD variance.",exact=False).wait_for(timeout=30000)
    assert "Case case-" in a.locator(".chat-footer").inner_text()
    assert "Case case-" not in b.locator(".chat-footer").inner_text()
    a.get_by_role("button",name="Propose variance marker").click()
    a.get_by_text("awaiting a separate finance approval",exact=False).wait_for(timeout=30000)
    assert a.get_by_role("button",name="Approve variance marker").is_disabled()
    a.locator("#demo-role").select_option("approver")
    a.get_by_role("button",name="Approve variance marker").click()
    a.get_by_text("Synthetic variance marker SYN-",exact=False).wait_for(timeout=30000)
    assert "SYN-" not in b.locator(".chat-messages").inner_text()
    a.screenshot(path=str(OUT/"release_streamlit_approval.png"),full_page=True)
    print({"fastapi_positive_negative":"PASS","mobile_390px":"PASS","streamlit_two_viewers":"PASS","page_errors":errors})
    browser.close()
