"""Streamlit-surface check of the cockpit: module tabs from manifests, family switch, concepts into the ontology, ontology graph.
QA_STREAMLIT_URL=http://127.0.0.1:8924 python scripts/qa_cockpit_streamlit.py   Run from the repo root."""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space
from poc import cockpit

URL = os.environ.get("QA_STREAMLIT_URL", "http://127.0.0.1:8924").rstrip("/")
SHOTS = Path(os.environ.get("QA_SHOTS", "cockpit_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
modules = [m for m in cockpit.manifests()]
with_tab = [m for m in modules if m["tab"]]
onto = cockpit.ontology()
results = []


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.set_default_timeout(90000)
    page.goto(URL, wait_until="domcontentloaded")
    page.add_style_tag(content="[data-testid=stSkillsNudgeAnchor]{display:none !important}")  # the local Streamlit dev toast covers the corner
    page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.get_by_role("tab", name="Finance apps").click(); f.locator(".entry-card").nth(len(with_tab) - 1).wait_for(timeout=120000)
    check("streamlit entry has a card per module", f.locator(".entry-card").count() == len(with_tab))
    f.locator("#entry-ask-input").fill(modules[1]["examples"][0].replace("{period}", "November 2026"))
    check("streamlit routes from the manifest", f.locator("[data-testid=route-chip]").get_attribute("data-domain") == modules[1]["id"])
    f.get_by_role("button", name=f"Open {with_tab[0]['short_name']}").click()
    tabs = f.get_by_role("tablist", name="Spaces").get_by_role("tab")
    tabs.first.wait_for(timeout=90000)
    check("streamlit has the three spaces and a tile per agent app", tabs.count() == 3 and (space(f, "Finance apps") or True) and f.locator(".fi-gtile").count() == len(with_tab))
    space(f, "Agents")
    f.locator("#aw-ask-input").fill(modules[1]["examples"][0].replace("{period}", "November 2026"))
    f.get_by_role("button", name="Run plan").click()
    f.locator("[data-testid=plan-domain]").get_by_text(modules[1]["family_label"]).first.wait_for(timeout=120000)
    page.wait_for_timeout(5500)
    agent_page(f, "Technical options")
    f.locator(".aw-log li:not(.orch) button").first.click()
    chips = f.locator("[data-testid=concept-chip]")
    check("streamlit steps list the concepts their tools touch", chips.count() > 0)
    chips.first.click()
    f.locator("[data-testid=ontology-view]").wait_for(timeout=60000)
    check("streamlit concept chip opens the ontology", f.locator("[data-testid=ontology-detail] h3").count() == 1)
    check("streamlit ontology draws every concept", f.locator("[data-testid=ontology-node]").count() == len(onto["classes"]), f"{len(onto['classes'])} concepts")
    page.screenshot(path=str(SHOTS / "s_c1_streamlit_ontology.png"))
    browser.close()
print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
