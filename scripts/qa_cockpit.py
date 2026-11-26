"""Manifest-driven browser acceptance for the SAP Finance Agent Cockpit.

The script discovers the agent modules from /api/cockpit/modules and runs the SAME checks for each one: routing from the entry page,
Level 1 screen, period synchronization, Level 2 workbench (family switch, roster, plan, result), concepts linking to the ontology.
Run it against a server with a module added and it must pass with no UI change: that is the plug-and-play proof.

    QA_WEB_URL=http://127.0.0.1:8925 python scripts/qa_cockpit.py          (QA_SHOTS for screenshots)
    COCKPIT_SAMPLE_MODULE=1 python local_demo.py --port 8926               (adds the scaffold module, then run this against :8926)
"""
import json
import os
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space

WEB = os.environ.get("QA_WEB_URL", "http://127.0.0.1:8899").rstrip("/")
SHOTS = Path(os.environ.get("QA_SHOTS", "cockpit_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
results = []
MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


def api(path):
    with urllib.request.urlopen(WEB + path, timeout=60) as response:
        return json.loads(response.read())


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))
    return bool(ok)


def fill(template, period="2026-11"):
    year, month = period.split("-")
    return template.replace("{period}", f"{MONTHS[int(month) - 1]} {year}")


manifests = api("/api/cockpit/modules")
catalog = api("/api/agent/catalog")
ontology = api("/api/cockpit/ontology")
ids = [m["id"] for m in manifests]
print("modules:", ids)

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    with_tab = [m for m in manifests if m.get("tab")]

    page.goto(WEB + "/", wait_until="domcontentloaded")
    page.locator(".entry-card").nth(len(with_tab) + 1).wait_for(timeout=30000)
    check("entry shows one card per module plus agents and architecture", page.locator(".entry-card").count() == len(with_tab) + 2, f"{len(with_tab)} modules")
    check("every module has its own entry card", all(page.locator(f".entry-card[data-module='{m['id']}']").count() == 1 for m in with_tab))
    for m in manifests:
        for example in m["examples"]:
            page.locator("#entry-ask-input").fill(fill(example))
            if page.locator("[data-testid=route-chip]").get_attribute("data-domain") != m["id"]:
                check(f"example routes to {m['id']}", False, example)
                break
        else:
            check(f"all {len(m['examples'])} examples route to {m['id']}", True)
    page.screenshot(path=str(SHOTS / "c01_entry.png"))
    first = with_tab[0]
    page.get_by_role("button", name=f"Open {first['short_name']}").click()
    page.get_by_role("tablist", name="Spaces").wait_for(timeout=30000)
    tabs = page.get_by_role("tablist", name="Spaces").get_by_role("tab")
    check("the shell has three spaces: Finance apps, Agents, Architecture & operations", tabs.count() == 3)
    space(page, "Finance apps")
    check("the Finance apps page has one tile per agent app", page.locator(".fi-gtile").count() == len(with_tab))

    for m in with_tab:
        space(page, "Finance apps")
        page.locator(f"[data-tile='{m['tab']['id']}']").click()
        if m["renderer"] == "builtin:reconciliation":
            page.locator("[data-testid=period-panel]").wait_for(timeout=30000)
            check(f"{m['id']}: level 1 renders", page.locator("[data-testid=period-panel]").count() == 1)
        else:
            selector = "[data-testid=treasury-page]" if m["renderer"] == "treasury" else f"[data-testid=module-page][data-module='{m['id']}']"
            page.locator(selector).wait_for(timeout=30000)
            body = page.locator(selector).inner_text()
            check(f"{m['id']}: level 1 renders with provenance", "SYNTHETIC / DEMONSTRATION" in body and "NOT CONNECTED / NOT VERIFIED" in body)
            for period in ("2026-02", "2026-11"):
                page.locator("#global-period").select_option(period)
                page.locator(f"{selector}[data-period='{period}']").wait_for(timeout=30000)
            check(f"{m['id']}: level 1 follows the period selector", page.locator("#global-period").input_value() == "2026-11")
        page.screenshot(path=str(SHOTS / f"c02_level1_{m['id']}.png"))

    # Level 2: the same workbench serves every module
    space(page, "Agents")
    agent_page(page, "Agent catalog")
    switch = page.get_by_role("tablist", name="Agent family").get_by_role("tab")
    check("the launchpad tabs list All agents and every module from the catalog", switch.count() == len(ids) + 1 and all(catalog["domains"][i]["name"] in page.get_by_role("tablist", name="Agent family").inner_text() for i in ids))
    for m in manifests:
        dom = catalog["domains"][m["id"]]
        page.get_by_role("tablist", name="Agent family").get_by_role("tab", name=dom["name"]).click()
        check(f"{m['id']}: roster has the catalog's agents", page.locator(".fi-launchpad .fi-tile").count() == len(dom["agents"]), f"{len(dom['agents'])} agents")
        agent_page(page, "Technical options")
        page.get_by_role("tab", name="Tool catalog").click()
        check(f"{m['id']}: tool catalog lists its tools", page.locator(".aw-catalog tbody tr").count() == len(dom["tools"]))
        page.get_by_role("tab", name="Orchestration and calls").click()
        agent_page(page, "Ask the agents")
        page.locator("#global-period").select_option("2026-11")
        page.locator("#aw-ask-input").fill(fill(m["examples"][0]))
        page.get_by_role("button", name="Run plan").click()
        page.locator("[data-testid=plan-domain]").get_by_text(m["family_label"]).first.wait_for(timeout=90000)
        page.wait_for_timeout(5500)
        check(f"{m['id']}: the plan is handled by this module and finishes", page.locator(".aw-answer").count() == 1)
        check(f"{m['id']}: the plan states its effective period", "November 2026" in page.locator("[data-testid=plan-period]").inner_text())
        page.screenshot(path=str(SHOTS / f"c03_level2_{m['id']}.png"))
        agent_page(page, "Technical options")
        step = page.locator(".aw-log li:not(.orch) button").first
        step.click()
        chips = page.locator("[data-testid=concept-chip]")
        check(f"{m['id']}: a step shows the concepts its tool reads and produces", chips.count() > 0, f"{chips.count()} chips")
        label = chips.first.inner_text().split("·")[-1].strip()
        chips.first.click()
        page.locator("[data-testid=ontology-view]").wait_for(timeout=15000)
        check(f"{m['id']}: a concept chip opens the ontology on that concept", label.lower() in page.locator("[data-testid=ontology-detail]").inner_text().lower(), label)
        space(page, "Agents")
        agent_page(page, "Agent catalog")

    # Ontology
    space(page, "Architecture")
    page.locator("[data-tile=ontology]").click()
    page.locator("[data-testid=ontology-view]").wait_for(timeout=15000)
    check("the ontology draws every concept from every module", page.locator("[data-testid=ontology-node]").count() == len(ontology["classes"]), f"{len(ontology['classes'])} concepts, {len(ontology['relations'])} relations")
    for m in manifests:
        page.get_by_role("group", name="Show concepts from").get_by_role("button", name=m["name"]).click()
        own = [c for c in ontology["classes"] if c["module"] == m["id"]]
        shown = page.locator("[data-testid=ontology-node]").count()
        check(f"{m['id']}: its filter shows its concepts", shown >= len(own) > 0, f"{shown} shown, {len(own)} own")
    page.get_by_role("group", name="Show concepts from").get_by_role("button", name="All").click()
    used = next(c for c in ontology["classes"] if c["used_by"])
    page.locator(f"[data-testid=ontology-node][data-id='{used['id']}']").click()
    detail = page.locator("[data-testid=ontology-detail]").inner_text()
    check("selecting a concept shows its meaning, SAP grounding, users and relations", used["label"] in detail and "sap grounding" in detail.lower() and page.locator("[data-testid=ontology-used-by] li").count() == len(used["used_by"]) and "relations" in detail.lower())
    page.locator("#ont-search").fill("zzzz-no-such-concept")
    check("search filters the graph", page.locator("[data-testid=ontology-node]").count() == 0)
    page.locator("#ont-search").fill("")
    page.screenshot(path=str(SHOTS / "c04_ontology.png"))
    documented = next(c for c in ontology["classes"] if c["sap_status"] == "DOCUMENTED" and c["sources"])
    page.locator(f"[data-testid=ontology-node][data-id='{documented['id']}']").click()
    check("a documented concept links to its SAP source", page.locator("[data-testid=ontology-detail] a").count() >= 1 and "Documented by SAP" in page.locator("[data-testid=ontology-detail]").inner_text())
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
