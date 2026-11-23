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
    assert page.locator('.app-footer').is_visible()
    assert 'Demo and learning purposes only' in page.locator('.app-footer').inner_text()
    assert page.get_by_role('heading',name='Finance Launchpad').is_visible()
    assert page.get_by_role('tab').count()==0
    page.screenshot(path=str(OUT/'ux_fiori_launchpad.png'))
    page.get_by_role('button',name='Open Finance Reconciliation Agent').click()
    assert page.get_by_role('tab').count()==4
    page.get_by_role('button',name='Open application menu').click()
    assert page.get_by_role('menuitem').count()==6
    page.get_by_role('menuitem',name='Live architecture').click()
    assert page.get_by_role('tab',name='Live architecture').get_attribute('aria-selected')=='true'
    page.get_by_role('button',name='Open application menu').click()
    page.get_by_role('menuitem',name='Close worklist').click()
    widths=[round(tab.bounding_box()['width']) for tab in page.get_by_role('tab').all()]
    assert max(widths)-min(widths)<=2,widths
    assert page.locator('.worklist button').count()==12
    assert page.get_by_role('button',name='Ask Finance Agent').is_visible()
    page.locator('.fi-filterbar select').nth(1).select_option('exception')
    assert page.locator('.worklist button').count()==3
    page.get_by_role('button',name='Clear filters').click()
    assert page.locator('.worklist button').count()==12
    page.locator('.worklist button').filter(has_text='2026-11').click()
    page.get_by_text('Variance to review',exact=False).wait_for()
    assert page.locator('.cockpit-kpis').bounding_box()['y']>100
    assert page.locator('.business-result').is_visible()
    assert not page.get_by_role('dialog',name='Finance Agent').is_visible()
    page.get_by_role('button',name='Ask Finance Agent').click()
    assert page.get_by_role('dialog',name='Finance Agent').is_visible()
    page.get_by_text('Reconciliation for 2026-11: 25,000 USD variance.',exact=False).wait_for()
    page.locator('#chat-question').fill('Why is there a variance?')
    page.get_by_role('button',name='Send').click()
    page.get_by_text('The comparable variance is',exact=False).wait_for()
    page.locator('#chat-question').fill('Predict tomorrow weather')
    page.get_by_role('button',name='Send').click()
    page.get_by_text('I cannot verify that question from this synthetic case.',exact=False).wait_for()
    assert page.locator('.chat-composer').bounding_box()['y']+page.locator('.chat-composer').bounding_box()['height']<900
    page.screenshot(path=str(OUT/'ux_fiori_agent_panel.png'))
    page.get_by_role('button',name='View reconciliation report').last.click()
    page.get_by_role('dialog',name='Business analysis report').wait_for(state='visible')
    assert 'Nov 2026' in page.get_by_role('dialog',name='Business analysis report').inner_text()
    page.get_by_role('button',name='Close business report').click()
    page.screenshot(path=str(OUT/'ux_four_tabs_business.png'))
    page.get_by_role('button',name='Ask Finance Agent').click()
    page.get_by_role('button',name='Inspect source evidence').last.click()
    assert page.get_by_role('tab',name='Evidence & correlation').get_attribute('aria-selected')=='true'
    assert page.locator('.finance-evidence-table tbody tr').count()==4
    assert page.locator('.evidence-months>div').count()==12
    page.screenshot(path=str(OUT/'ux_four_tabs_evidence.png'))
    page.get_by_role('tab',name='Business workspace').click()
    page.get_by_role('button',name='Ask Finance Agent').click()
    page.get_by_role('button',name='Follow component flow').last.click()
    assert page.get_by_role('tab',name='Live architecture').get_attribute('aria-selected')=='true'
    assert page.locator('.route-zone').count()==12
    assert not page.locator('.component-panel').count()
    assert page.locator('.agent-journey-stage').count()==5
    assert page.locator('.agent-journey-stage.complete').count()==5
    assert page.locator('.source-route-group').first.is_visible()
    assert page.locator('.case-buttons').bounding_box()['y']<830
    page.get_by_role('button',name='Open detailed business report').click()
    assert page.get_by_role('dialog').is_visible()
    assert 'Business conclusion' in page.get_by_role('dialog').inner_text()
    page.get_by_role('button',name='Close business report').click()
    page.screenshot(path=str(OUT/'ux_four_tabs_architecture.png'))
    page.get_by_role('button',name='Inspect event proof in Evidence').click()
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
    page.get_by_role('tab',name='Evidence & correlation').click()
    page.get_by_role('button',name='Implementation',exact=True).click()
    assert 'Node.js is not an agent' in page.locator('.implementation-evidence').inner_text()
    assert 'no external agent is connected' in page.locator('.implementation-evidence').inner_text()
    page.screenshot(path=str(OUT/'ux_external_agent_implementation.png'))
    page.get_by_role('tab',name='Live architecture').click()
    page.locator('.command-controls select').nth(1).select_option('S2')
    page.get_by_role('button',name='Run architecture').click()
    page.get_by_role('heading',name='Case complete').wait_for(timeout=30000)
    assert page.locator('.agent-journey-stage.complete').count()==5
    assert 'S2 · AgentCore' in page.locator('.route-zone[data-zone="Selected gateway"]').inner_text()
    assert page.evaluate('document.documentElement.scrollWidth')<=1440
    assert not errors,errors
    page.get_by_role('button',name='Back to Finance Launchpad').click()
    assert page.get_by_role('heading',name='Finance Launchpad').is_visible()
    page.get_by_role('button',name='Open Finance Reconciliation Agent').click()
    assert page.get_by_role('tab',name='Business workspace').get_attribute('aria-selected')=='true'
    print({'fastapi':'PASS','tab_widths':widths,'months':12,'zones':12,'journey_stages':5,'routes':['S1','S2'],'question_handoffs':'PASS','page_errors':errors})
    mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    mobile.goto(WEB,wait_until='networkidle')
    assert 'Demo and learning purposes only' in mobile.locator('.app-footer').inner_text()
    assert mobile.evaluate('document.documentElement.scrollWidth')<=390
    mobile.get_by_role('button',name='Open Finance Reconciliation Agent').click()
    mobile.get_by_role('button',name='Open application menu').click()
    assert mobile.get_by_role('menu').is_visible()
    assert mobile.get_by_role('menu').bounding_box()['x']>=0
    mobile.get_by_role('menuitem',name='Close worklist').click()
    mobile.get_by_role('tab',name='Live architecture').click()
    assert mobile.evaluate('document.documentElement.scrollWidth')<=390
    print({'mobile_horizontal_overflow':'PASS'})
    hosted=browser.new_page(viewport={'width':1440,'height':900})
    hosted.goto(STREAMLIT,wait_until='domcontentloaded')
    hosted.get_by_role('button',name='Open Finance Reconciliation Agent').wait_for(timeout=30000)
    hosted.get_by_role('button',name='Open Finance Reconciliation Agent').click()
    hosted.get_by_role('tab',name='Business workspace').wait_for(timeout=30000)
    assert 'Demo and learning purposes only' in hosted.locator('.app-footer').inner_text()
    assert hosted.get_by_role('tab').count()==4
    hosted.locator('.worklist button').filter(has_text='2026-11').click()
    hosted.get_by_text('Variance to review',exact=False).wait_for(timeout=30000)
    hosted.get_by_role('button',name='Ask Finance Agent').click()
    hosted.get_by_role('button',name='Inspect source evidence').wait_for(timeout=30000)
    hosted.get_by_role('button',name='Inspect source evidence').click()
    assert hosted.locator('.finance-evidence-table tbody tr').count()==4
    hosted.get_by_role('tab',name='Live architecture').click()
    assert hosted.locator('.route-zone').count()==12
    hosted.get_by_role('tab',name='Evidence & correlation').click()
    hosted.get_by_role('button',name='Implementation',exact=True).click()
    assert 'Node.js is not an agent' in hosted.locator('.implementation-evidence').inner_text()
    print({'streamlit_reconciliation_and_evidence':'PASS','implementation_disclosure':'PASS'})
    short=browser.new_page(viewport={'width':1536,'height':720})
    short.goto(STREAMLIT,wait_until='domcontentloaded')
    short.get_by_role('button',name='Open Finance Reconciliation Agent').wait_for(timeout=30000)
    short.get_by_role('button',name='Open Finance Reconciliation Agent').click()
    short.get_by_role('tab',name='Live architecture').wait_for(timeout=30000)
    short.get_by_role('tab',name='Live architecture').click()
    assert short.locator('.route-zone').count()==12
    assert short.locator('.route-scroll').evaluate('(e)=>e.scrollHeight<=e.clientHeight')
    assert short.locator('.route-zone').evaluate_all('(es)=>es.every(e=>e.querySelector(".route-status").getBoundingClientRect().bottom<=e.getBoundingClientRect().bottom-1)')
    short.wait_for_timeout(2000)
    short.screenshot(path=str(OUT/'architecture_short_landscape_fixed.png'))
    print({'streamlit_short_landscape_12_zones':'PASS'})
    browser.close()
