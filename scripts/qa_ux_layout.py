"""Focused browser check for the four-workspace UX."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

WEB=os.environ.get('QA_WEB_URL','http://127.0.0.1:8893')
STREAMLIT=os.environ.get('QA_STREAMLIT_URL','http://127.0.0.1:8603')
OUT=Path(__file__).resolve().parents[1]/'docs'/'evidence'
OUT.mkdir(exist_ok=True)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(WEB,wait_until='networkidle')
    assert page.get_by_role('tab').count()==4
    widths=[round(tab.bounding_box()['width']) for tab in page.get_by_role('tab').all()]
    assert max(widths)-min(widths)<=2,widths
    assert page.locator('.worklist button').count()==12
    page.locator('.worklist button').filter(has_text='2026-11').click()
    page.get_by_text('Reconciliation for 2026-11: 25,000 USD variance.',exact=False).wait_for()
    assert page.locator('.business-result').is_visible()
    assert page.locator('.chat-composer').bounding_box()['y']+page.locator('.chat-composer').bounding_box()['height']<900
    page.screenshot(path=str(OUT/'ux_four_tabs_business.png'))
    page.get_by_role('button',name='Inspect source records and calculation').click()
    assert page.get_by_role('tab',name='Evidence & correlation').get_attribute('aria-selected')=='true'
    assert page.locator('.finance-evidence-table tbody tr').count()==4
    assert page.locator('.evidence-months>div').count()==12
    page.screenshot(path=str(OUT/'ux_four_tabs_evidence.png'))
    page.get_by_role('tab',name='Live architecture').click()
    assert page.locator('.route-zone').count()==12
    assert not page.locator('.component-panel').count()
    assert page.locator('.case-buttons').bounding_box()['y']<830
    page.get_by_role('button',name='Open detailed business report').click()
    assert page.get_by_role('dialog').is_visible()
    assert 'Business conclusion' in page.get_by_role('dialog').inner_text()
    page.get_by_role('button',name='Close business report').click()
    page.screenshot(path=str(OUT/'ux_four_tabs_architecture.png'))
    page.get_by_role('button',name='Inspect components and events in Evidence').click()
    assert page.locator('.component-panel').is_visible()
    assert page.locator('.inspector').is_visible()
    page.get_by_role('tab',name='Architecture questions').click()
    page.locator('.question-card').first.click()
    page.locator('.lab-step-nav .pill').filter(has_text='complete').wait_for(timeout=30000)
    assert page.locator('.lab-node').count()>=12
    assert not page.locator('.lab-inspector').count()
    page.screenshot(path=str(OUT/'ux_four_tabs_questions.png'))
    page.get_by_role('button',name='Inspect handoff details in Evidence').click()
    assert page.locator('.question-evidence-detail').is_visible()
    assert 'Received input' in page.locator('.question-evidence-detail').inner_text()
    with page.expect_download() as download:
        page.get_by_role('button',name='Download synthetic decision packet').click()
    assert download.value.suggested_filename.endswith('.json')
    page.get_by_role('tab',name='Architecture questions').click()
    page.get_by_label('Architecture probe').select_option('missing_target')
    page.get_by_role('button',name='Run selected probe').click()
    page.locator('.lab-step-nav .pill').filter(has_text='complete').wait_for(timeout=30000)
    assert 'DENIED' in page.locator('.lab-route-note').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth')<=1440
    assert not errors,errors
    print({'fastapi':'PASS','tab_widths':widths,'months':12,'zones':12,'question_handoffs':'PASS','page_errors':errors})
    mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    mobile.goto(WEB,wait_until='networkidle')
    assert mobile.evaluate('document.documentElement.scrollWidth')<=390
    print({'mobile_horizontal_overflow':'PASS'})
    hosted=browser.new_page(viewport={'width':1440,'height':900})
    hosted.goto(STREAMLIT,wait_until='domcontentloaded')
    hosted.get_by_role('tab',name='Business workspace').wait_for(timeout=30000)
    assert hosted.get_by_role('tab').count()==4
    hosted.locator('.worklist button').filter(has_text='2026-11').click()
    hosted.get_by_text('Reconciliation for 2026-11: 25,000 USD variance.',exact=False).wait_for(timeout=30000)
    hosted.get_by_role('button',name='Inspect source records and calculation').click()
    assert hosted.locator('.finance-evidence-table tbody tr').count()==4
    hosted.get_by_role('tab',name='Live architecture').click()
    assert hosted.locator('.route-zone').count()==12
    print({'streamlit_reconciliation_and_evidence':'PASS'})
    browser.close()
