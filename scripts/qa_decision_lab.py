"""Browser acceptance for the fourth architecture-questions tab."""
from __future__ import annotations

import json
import os

from playwright.sync_api import sync_playwright


WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8876")
STREAMLIT = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8502")
QUESTIONS = [
    "Can SAP retain Apigee as its domain MCP layer?",
    "Which gateway owns each control?",
    "Does the caller identity reach SAP?",
    "Can the agent read but not post?",
    "What does the Foundry registry govern?",
    "Can an external agent use SAP tools?",
]


def choose(page, title):
    page.locator(".question-card").filter(has_text=title).click()
    page.locator(".lab-flow-panel .pill").filter(has_text="complete").wait_for(timeout=30000)


def run_probe(page, probe, outcome):
    page.get_by_label("Architecture probe").select_option(probe)
    page.get_by_role("button", name="Run selected probe").click()
    page.locator(".lab-flow-panel .pill").filter(has_text="complete").wait_for(timeout=30000)
    assert outcome in page.locator(".lab-route-note").inner_text()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []
    web = browser.new_page(viewport={"width": 1440, "height": 900})
    web.on("pageerror", lambda error: errors.append(str(error)))
    web.goto(WEB, wait_until="networkidle")
    assert web.get_by_role("tab").count() == 4
    web.get_by_role("tab", name="Architecture questions").click()
    assert web.locator(".question-card").count() == 6
    choose(web, QUESTIONS[0])
    names = web.locator(".lab-node strong").all_inner_texts()
    assert names.index("AgentCore Gateway") < names.index("SAP Apigee MCP") < names.index("SAP Integration Suite")
    assert "Unapproved candidate" in web.locator(".lab-route-note").inner_text()
    assert "OPEN" in web.locator(".lab-open-status").inner_text()
    assert web.locator(".lab-node.selected strong").inner_text() == "Business intent"
    web.get_by_role("button", name="Next handoff").click()
    assert web.locator(".lab-node.selected strong").inner_text() == "AI Foundry registry"
    web.get_by_role("button", name="Next handoff").click()
    assert web.locator(".lab-node.selected strong").inner_text() == "Enterprise identity provider"
    with web.expect_download() as info:
        web.get_by_role("button", name="Download synthetic decision packet").click()
    packet = json.loads(info.value.path().read_text(encoding="utf-8"))
    assert packet["route"] == "S3" and packet["decision_status"].startswith("OPEN")

    run_probe(web, "missing_target", "DENIED")
    assert web.locator(".lab-node.denied strong").inner_text() == "AgentCore Gateway"
    web.get_by_label("Architecture route").select_option("S1")
    run_probe(web, "onboarded", "SIMULATED")
    assert "AgentCore Gateway" not in web.locator(".lab-node strong").all_inner_texts()
    web.get_by_label("Architecture route").select_option("S2")
    web.get_by_role("button", name="Run selected probe").click()
    web.locator(".lab-flow-panel .pill").filter(has_text="complete").wait_for(timeout=30000)
    assert "SAP Apigee MCP" not in web.locator(".lab-node strong").all_inner_texts()

    choose(web, QUESTIONS[1])
    run_probe(web, "duplicate_controls", "REVIEW")
    assert web.locator(".lab-node.review strong").inner_text() == "SAP Apigee MCP"
    choose(web, QUESTIONS[2])
    run_probe(web, "missing_principal", "DENIED")
    assert web.locator(".lab-node.denied strong").inner_text() == "SAP backend role"
    choose(web, QUESTIONS[3])
    run_probe(web, "post_no_approval", "DENIED")
    assert web.locator(".lab-node.denied strong").inner_text() == "Finance approval boundary"
    run_probe(web, "post_with_approval", "SIMULATED")
    web.locator(".lab-node").filter(has_text="SAP finance API").click()
    assert "no real sap call or fi posting" in web.locator(".lab-inspector").inner_text().lower()
    choose(web, QUESTIONS[4])
    run_probe(web, "unregistered", "DENIED")
    assert web.locator(".lab-node.denied strong").inner_text() == "AI Foundry registry"
    choose(web, QUESTIONS[5])
    run_probe(web, "unapproved_partner", "DENIED")
    assert web.locator(".lab-node.denied strong").inner_text() == "AgentCore Gateway"
    assert web.evaluate("document.documentElement.scrollWidth") <= 1440
    assert not errors, errors
    print({"fastapi_questions": 6, "routes": ["S1", "S2", "S3"], "negative_probes": 5, "export": "PASS", "page_errors": errors})

    streamlit = browser.new_page(viewport={"width": 1440, "height": 900})
    streamlit.on("pageerror", lambda error: errors.append(str(error)))
    streamlit.goto(STREAMLIT, wait_until="domcontentloaded")
    streamlit.get_by_role("tab", name="Architecture questions").wait_for(timeout=30000)
    streamlit.get_by_role("tab", name="Architecture questions").click()
    choose(streamlit, QUESTIONS[0])
    assert "SAP Apigee MCP" in streamlit.locator(".lab-node strong").all_inner_texts()
    choose(streamlit, QUESTIONS[2])
    run_probe(streamlit, "missing_principal", "DENIED")
    assert streamlit.locator(".lab-node.denied strong").inner_text() == "SAP backend role"

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
    mobile.goto(STREAMLIT, wait_until="domcontentloaded")
    mobile.get_by_role("tab", name="Architecture questions").wait_for(timeout=30000)
    mobile.get_by_role("tab", name="Architecture questions").click()
    assert mobile.locator(".question-card").count() == 6
    assert mobile.evaluate("document.documentElement.scrollWidth") <= 390
    assert not errors, errors
    print({"streamlit_combined_and_denial": "PASS", "mobile_390px": "PASS", "page_errors": errors})
    browser.close()
