"""Stress test for the Streamlit action bridge: rapid period changes must always settle on the last selection, and a request sent right
after still runs. QA_STREAMLIT_URL=https://finance-reconciliation-agent.streamlit.app python scripts/qa_stress_streamlit.py"""
import os
import random
from playwright.sync_api import sync_playwright

URL = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8924").rstrip("/")
PERIODS = ["2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"]
random.seed(7)
ok = bad = 0
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.set_default_timeout(90000)
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.locator(".entry-card").nth(3).wait_for(timeout=150000)
    f.get_by_role("button", name="Open Close & reconcile").click()
    f.locator("[data-testid=period-panel]").wait_for(timeout=90000)
    for round_ in range(12):
        picks = random.sample(PERIODS, 3)
        for p in picks:
            f.locator("#global-period").select_option(p)
            page.wait_for_timeout(120)
        last = picks[-1]
        try:
            f.locator(f"[data-testid=period-panel][data-period='{last}']").wait_for(timeout=45000)
            ok += 1
            print(f"PASS round {round_ + 1}: {' -> '.join(picks)} settled on {last}")
        except Exception:
            bad += 1
            print(f"FAIL round {round_ + 1}: {' -> '.join(picks)} never showed {last}")
    # a request right after a burst of changes still runs
    for p in ("2026-03", "2026-11", "2026-02"):
        f.locator("#global-period").select_option(p)
    f.get_by_role("button", name="Ask the agents about February 2026").click()
    try:
        f.locator("[data-testid=plan-request]").wait_for(timeout=90000)
        ok += 1
        print("PASS a request sent right after the burst ran")
    except Exception:
        bad += 1
        print("FAIL a request sent right after the burst never ran")
    browser.close()
print(f"\n{ok} passed, {bad} failed")
raise SystemExit(0 if not bad else 1)
