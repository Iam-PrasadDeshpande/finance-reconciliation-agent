"""Browser acceptance for dynamic investigation proof and controlled resolution."""
from pathlib import Path
import os
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"docs"/"evidence"
OUT.mkdir(parents=True,exist_ok=True)
WEB=os.environ.get("QA_WEB_URL","http://127.0.0.1:8878")
STREAMLIT=os.environ.get("QA_STREAMLIT_URL","http://127.0.0.1:8504")

def reconcile_november(page):
    page.locator("#chat-question").fill("Reconcile November 2026")
    page.get_by_role("button",name="Send").click()
    page.get_by_text("Reconciliation for 2026-11: 25,000 USD variance.",exact=False).wait_for(timeout=30000)

with sync_playwright() as playwright:
    browser=playwright.chromium.launch()
    errors=[]
    web=browser.new_page(viewport={"width":1440,"height":900})
    web.on("pageerror",lambda error: errors.append(str(error)))
    web.goto(WEB+"/",wait_until="networkidle")
    assert web.evaluate("document.documentElement.scrollHeight <= window.innerHeight + 2")
    reconcile_november(web)
    web.get_by_role("button",name="Open proof & correlation").click()
    dossier=web.locator(".evidence-layout .proof-dossier")
    dossier.get_by_role("button",name="Investigate variance").click()
    dossier.locator(".proof-decision strong").get_by_text("replication gap",exact=True).wait_for(timeout=30000)
    dossier.get_by_text("Four-document source to Central Finance comparison").first.wait_for()
    assert dossier.locator(".proof-step-complete").count()==4
    assert dossier.locator(".proof-evidence-list button").count()==4
    dossier.get_by_role("button",name="Inspect investigation trace").click()
    web.get_by_role("tab",name="Live architecture").wait_for()
    web.locator(".event-row").first.wait_for(timeout=10000)
    assert web.locator(".event-row").count()>0
    assert "1000" not in web.locator(".architecture-layout").inner_text()
    web.screenshot(path=str(OUT/"agentic_architecture_proof.png"),full_page=True)
    web.get_by_role("tab",name="Evidence & correlation").click()
    dossier=web.locator(".evidence-layout .proof-dossier")
    assert web.locator(".correlation-events button").count()>0
    dossier.get_by_role("button",name="Apply simulated reprocess and re-reconcile").click()
    dossier.get_by_text("resolved",exact=True).wait_for(timeout=30000)
    assert dossier.locator(".proof-summary").inner_text().count("$0")>=1
    web.get_by_role("tab",name="Business workspace").click()
    assert web.locator(".report-stack .tile-value").first.inner_text()=="$0"
    web.get_by_role("tab",name="Evidence & correlation").click()
    assert dossier.locator(".proof-evidence-list button").count()==6
    web.screenshot(path=str(OUT/"agentic_resolved_dossier.png"),full_page=True)
    assert not errors,errors

    reset=web.request.post(WEB+"/api/fixture/reset")
    assert reset.ok
    hold=browser.new_page(viewport={"width":1440,"height":900})
    hold.goto(WEB+"/",wait_until="networkidle")
    reconcile_november(hold)
    hold.get_by_role("button",name="Open proof & correlation").click()
    dossier=hold.locator(".evidence-layout .proof-dossier")
    dossier.locator("select").select_option("mapping_conflict")
    dossier.get_by_role("button",name="Investigate variance").click()
    dossier.locator(".proof-decision strong").get_by_text("mapping conflict",exact=True).wait_for(timeout=30000)
    assert "Held for finance and integration review" in dossier.inner_text()
    assert dossier.get_by_role("button",name="Apply simulated reprocess and re-reconcile").count()==0
    hold.get_by_role("tab",name="Business workspace").click()
    assert hold.locator(".report-stack .tile-value").first.inner_text()=="$25,000"
    hold.screenshot(path=str(OUT/"agentic_mapping_hold.png"),full_page=True)

    streamlit=browser.new_page(viewport={"width":1440,"height":900})
    streamlit.on("pageerror",lambda error: errors.append(str(error)))
    streamlit.goto(STREAMLIT+"/",wait_until="domcontentloaded")
    streamlit.get_by_role("heading",name="Finance Architecture Studio").wait_for(timeout=20000)
    reconcile_november(streamlit)
    streamlit.get_by_role("button",name="Open proof & correlation").click()
    dossier=streamlit.locator(".evidence-layout .proof-dossier")
    dossier.get_by_role("button",name="Investigate variance").click()
    dossier.locator(".proof-decision strong").get_by_text("replication gap",exact=True).wait_for(timeout=45000)
    assert dossier.locator(".proof-evidence-list button").count()==4
    dossier.get_by_role("button",name="Apply simulated reprocess and re-reconcile").click()
    dossier.get_by_text("resolved",exact=True).wait_for(timeout=45000)
    streamlit.get_by_role("tab",name="Business workspace").click()
    assert streamlit.locator(".report-stack .tile-value").first.inner_text()=="$0"
    streamlit.get_by_role("tab",name="Evidence & correlation").click()
    streamlit.screenshot(path=str(OUT/"agentic_streamlit_dossier.png"),full_page=True)
    assert not errors,errors
    print({"fastapi_resolution":"PASS","mapping_hold":"PASS","streamlit_resolution":"PASS","architecture_neutral":True,"browser_errors":errors})
    browser.close()
