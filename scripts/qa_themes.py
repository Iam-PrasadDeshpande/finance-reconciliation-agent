"""SAP Fiori themes across the whole application: every theme can be chosen, persists, and visibly changes every area.

    QA_URL=http://127.0.0.1:8925 python scripts/qa_themes.py     (web app or a Streamlit URL; QA_MOBILE=1 for a phone viewport)
"""
import io
import os
import re
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

URL = os.environ.get("QA_URL", "http://127.0.0.1:8899").rstrip("/")
MOBILE = os.environ.get("QA_MOBILE") == "1"
SHOTS = Path(os.environ.get("QA_SHOTS", "theme_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
THEMES = [("quartz-light", "SAP Quartz Light", "light"), ("morning-horizon", "SAP Morning Horizon", "light"), ("quartz-dark", "SAP Quartz Dark", "dark"),
          ("evening-horizon", "SAP Evening Horizon", "dark"), ("hcw", "SAP High Contrast White", "light"), ("hcb", "SAP High Contrast Black", "dark")]
results = []


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))


def luminance(png):
    img = Image.open(io.BytesIO(png)).convert("L")
    w, h = img.size
    pts = [(w // 2, int(h * 0.6)), (w // 3, int(h * 0.8)), (int(w * 0.8), int(h * 0.7)), (w // 2, int(h * 0.95))]
    return sum(img.getpixel(p) for p in pts) / len(pts)


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
    check("My Home no longer shows the audience block", f.locator(".entry-roles").count() == 0 and "Presenting this" not in f.locator("body").inner_text())
    f.get_by_role("button", name="Open Agents").click()
    tabs = f.locator(".tab-nav [role=tab]")
    select = f.get_by_label("SAP Fiori theme")
    options = [o.get_attribute("value") for o in select.locator("option").all()]
    check("the six SAP Fiori themes are offered", options == [t[0] for t in THEMES], str(options))
    areas = [(0, "close"), (1, "cash"), (2, "accruals"), (3, "agents"), (4, "architecture")]
    light_lum = {}
    for tid, label, tone in THEMES:
        select.select_option(tid)
        page.wait_for_timeout(500)
        html_theme = f.locator("html").get_attribute("data-theme-choice")
        check(f"{label}: applied to the whole document", html_theme == tid)
        for index, area in areas:
            tabs.nth(index).click(); page.wait_for_timeout(600)
            lum = luminance(page.screenshot())
            ok = lum < 90 if tone == "dark" else lum > 150
            check(f"{label}: {area} area reads as a {tone} theme", ok, f"luminance {lum:.0f}")
            if index == 3:
                page.screenshot(path=str(SHOTS / f"{tid}_architecture{'_m' if MOBILE else ''}.png"))
            if index == 0:
                page.screenshot(path=str(SHOTS / f"{tid}_close{'_m' if MOBILE else ''}.png"))
    # the choice persists across a reload
    select.select_option("evening-horizon")
    page.reload(wait_until="domcontentloaded"); page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.locator(".entry-card").nth(3).wait_for(timeout=150000)
    check("the chosen theme persists after a reload", f.locator("html").get_attribute("data-theme-choice") == "evening-horizon")
    f.get_by_label("SAP Fiori theme").select_option("quartz-light")
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
