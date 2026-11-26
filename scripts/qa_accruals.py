"""The Fiori launchpad of the Agents area and the accrual posting agent end to end in a real browser:
tiles grouped by tabs, the LLM default execution option, a run, review, approval, simulated posting, reconciliation after posting,
the Rules execution, a closed posting period and the maker/approver roles.

    QA_URL=http://127.0.0.1:8929 python scripts/qa_accruals.py     (web app or a Streamlit URL; QA_MOBILE=1 for a phone viewport)
It waits on page state (never on a fixed delay), so it holds on the Streamlit bridge, where every click is a round trip.
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space
from poc import accrual_data as A
from poc import cockpit

URL = os.environ.get("QA_URL", "http://127.0.0.1:8899").rstrip("/")
MOBILE = os.environ.get("QA_MOBILE") == "1"
SHOTS = Path(os.environ.get("QA_SHOTS", "accrual_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
CAT = cockpit.catalog()["domains"]
results = []


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))
    return bool(ok)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844} if MOBILE else {"width": 1440, "height": 900})
    page.set_default_timeout(120000)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded")
    page.add_style_tag(content="[data-testid=stSkillsNudgeAnchor]{display:none !important}")  # the local Streamlit dev toast covers the corner
    page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.get_by_role("tab", name="Finance apps").click(); f.locator(".entry-card").nth(2).wait_for(timeout=150000)
    f.get_by_role("tab", name="Agents & architecture").click(); f.get_by_role("button", name="Open Watch the agents work").click()
    agent_page(f, "Agent catalog")
    f.locator("[data-testid=agent-launchpad]").wait_for()
    family = f.get_by_role("tablist", name="Agent family")

    def until(condition, timeout=90000, step=400):
        waited = 0
        while waited < timeout:
            try:
                if condition():
                    return True
            except Exception:
                pass
            page.wait_for_timeout(step)
            waited += step
        return False

    def panel():
        return f.locator("[data-testid=workflow-panel]")

    def text():
        return panel().inner_text() if panel().count() else ""

    def act(name):
        button = panel().locator(f"[data-action={name}]").first
        button.wait_for(state="visible")
        return button

    def lines_table():
        return panel().locator(".blk-table", has_text="Proposal lines")

    def accepted():
        return lines_table().locator("tbody tr td:nth-child(9)", has_text="accepted").count()

    def run_prompt(prompt):
        """Run a request and wait until the plan finished (the orchestration log says so)."""
        agent_page(f, "Ask the agents")
        f.locator("#aw-ask-input").fill(prompt)
        f.get_by_role("button", name="Run plan").click()
        until(lambda: prompt in f.locator("[data-testid=plan-request]").inner_text())
        until(lambda: f.locator(".aw-answer").count() > 0)
        page.wait_for_timeout(600)

    def on(page_name, fn):
        """Read something that lives on another page of the Agents space, then come back to Ask the agents."""
        agent_page(f, page_name)
        try:
            return fn()
        finally:
            agent_page(f, "Ask the agents")

    def click_until(button_name, condition):
        act(button_name).click()
        return until(condition)

    # ---- 1. the Fiori launchpad: every agent is a tile, grouped by tabs ----------------------------------------------------
    total = sum(len(CAT[m]["agents"]) for m in CAT)
    tabs = family.get_by_role("tab")
    check("the launchpad has an All agents tab and one tab per agent family", tabs.count() == len(CAT) + 1 and tabs.first.inner_text().startswith("All agents"), str(tabs.all_inner_texts()))
    check("the All agents catalogue shows every agent as a tile, grouped in sections", f.locator(".fi-launchpad .fi-tile").count() == total and f.locator(".fi-section-title").count() == len(CAT), f"{total} tiles")
    check("tiles carry the agent name, a one-sentence purpose, its mode and its tool count", all(t in f.locator(".fi-launchpad").inner_text() for t in ("Accrual Preparation Agent", "Cash Positioning Agent", "Evidence", "read + local draft")))
    check("the Agents space has three pages: Ask, Agent catalog, Technical options", f.get_by_role("tablist", name="Agent pages").get_by_role("tab").count() == 3)
    family.get_by_role("tab", name="Accrual Posting Agent").click()
    check("the accrual tab shows its three agents as tiles", f.locator(".fi-launchpad .fi-tile").count() == 3 and f.locator(".fi-section-title").count() == 0)
    f.locator(".fi-tile", has_text="Accrual Preparation Agent").click()
    sor = f.locator("[data-testid=tile-systems-of-record]")
    check("selecting a tile shows its details with the systems of record", "Accrual Preparation Agent" in f.locator("[data-testid=tile-detail]").inner_text() and "S/4HANA" in sor.inner_text() and "not verified" in sor.inner_text())

    # ---- 2. execution options: LLM is the default -----------------------------------------------------------------------------
    agent_page(f, "Ask the agents")
    summary = f.locator("[data-testid=options-summary]").inner_text()
    check("the ask area shows the default execution LLM, company code 1000 and All types", "Execution: LLM" in summary and "1000" in summary and "All types" in summary, summary.replace("\n", " "))
    agent_page(f, "Technical options"); f.get_by_role("tab", name="Execution options").click()
    execution = f.locator("#opt-execution")
    check("Execution offers LLM (default) and Rules", execution.input_value() == "llm" and [o.inner_text() for o in execution.locator("option").all()] == ["LLM", "Rules"])
    check("Accrual types offers All types and each of the five types", f.locator("#opt-types option").count() == 6 and f.locator("#opt-types").input_value() == "all")
    check("Company code offers the three company codes", f.locator("#opt-company_code option").count() == 3)
    f.get_by_role("tab", name="Orchestration and calls").click(); agent_page(f, "Ask the agents")

    # ---- 3. a run in the LLM execution, then the workflow -----------------------------------------------------------------------
    PREPARE = "Prepare accruals for company code 1000 for November 2026"
    run_prompt(PREPARE)
    if any(w in text() for w in ("POSTED", "RECONCILED")):  # a previous run on this server left a posted journal: start clean
        click_until("reset", lambda: "No accrual run yet" in text())
        run_prompt(PREPARE)
    answer = f.locator(".aw-answer").inner_text()
    check("the run uses the LLM execution and says the model is simulated", "execution LLM" in answer and "simulated" in answer and "no SAP system was changed" in answer, answer[:140].replace("\n", " "))
    check("all eight steps ran and the tile shows it was called", on("Technical options", lambda: f.locator(".aw-log li.done").count() == 8) and on("Agent catalog", lambda: "Called · 8 steps" in f.locator(".fi-tile", has_text="Accrual Preparation Agent").inner_text()))
    check("no output-screen link is offered, the workflow panel is on the page", f.locator("[data-testid=plan-output]").count() == 0 and panel().count() == 1)
    page.screenshot(path=str(SHOTS / "a01_run.png"))
    check("the workflow shows ten proposal lines, the duplicate blocked and the injection attempt ignored", until(lambda: lines_table().locator("tbody tr").count() == 10)
          and "Duplicate" in text() and "Prompt-injection attempt" in text() and "ignored" in text())
    check("the simulated posting is labelled and there is no posting tool", "SIMULATED POSTING" in text() and "no SAP system is changed" in text())

    # roles: the preparer cannot decide
    panel().locator("[data-action=decide_line]", has_text="Accept").first.click()
    check("as the preparer, deciding a line is refused", until(lambda: "approver" in f.locator("[data-testid=workflow-error]").inner_text()))
    f.get_by_role("button", name="Finance approver").click()
    count = panel().locator("[data-action=decide_line]", has_text="Accept").count()
    for i in range(count):
        panel().locator("[data-action=decide_line]", has_text="Accept").nth(i).click()
        until(lambda: accepted() >= i + 1)
    check("every line that is not blocked is accepted and the journal preview is shown", accepted() == count == 9 and "journal preview" in text().lower() and "Debit" in text(), f"{accepted()} accepted")
    check("posting is disabled until the journal is approved", act("post_journal").is_disabled() and not act("approve_journal").is_disabled())
    act("approve_journal").click()
    check("the journal is approved and posting is now allowed", until(lambda: "APPROVED" in text() and not act("post_journal").is_disabled()))
    act("post_journal").click()
    check("posting writes one document to the synthetic ledger with a scheduled reversal", until(lambda: "SYN-JE-1000-2026-11-01" in text() and "SYN-JE-REV-1000-2026-11-01" in text() and "(scheduled)" in text()))
    check("the same journal cannot be posted twice", until(lambda: act("post_journal").is_disabled()))
    page.screenshot(path=str(SHOTS / "a02_posted.png"))
    act("reconcile").click()
    until(lambda: "reconciliation after posting" in text().lower())
    pending = A.replication_pending("2026-11", "1000", "SYN-JE-1000-2026-11-01")
    if pending:
        check("reconciliation after posting finds Central Finance replication pending", "OPEN: REPLICATION PENDING" in text() and "Pending replication" in text())
        act("replicate").click()
        until(lambda: act("replicate").is_disabled())
        act("reconcile").click()
    check("the posted entries reconcile to the approved lines, the ledger, the reversal and Central Finance",
          until(lambda: "RECONCILED" in text() and "OPEN: REPLICATION" not in text() and "NOT RECONCILED" not in text()) and panel().locator(".blk-table", has_text="Reconciliation after posting").locator("tbody tr").count() == 7)
    page.screenshot(path=str(SHOTS / "a03_reconciled.png"))

    # the agent reconciles through S/4HANA and Central Finance
    run_prompt("Reconcile the posted accrual entries for company code 1000 for November 2026")
    check("the agent's own reconciliation run completes and names both systems of record", "Reconcile" in f.locator("[data-testid=plan-request]").inner_text()
          and "Central Finance" in on("Technical options", lambda: f.locator(".aw-log").inner_text()) + f.locator("[data-testid=module-result]").inner_text() + f.locator(".aw-answer").inner_text())

    # a request to post is refused
    run_prompt("Post the accrual journal for November 2026")
    check("a request to post is refused: posting is a person's action", "blocked" in on("Technical options", lambda: f.locator(".aw-plan-state").first.get_attribute("class")) and "not an agent action" in f.locator(".aw-answer").inner_text())

    # ---- 4. the Rules execution -----------------------------------------------------------------------------------------------
    click_until("reset", lambda: "No accrual run yet" in text() or lines_table().count() == 0)
    agent_page(f, "Technical options"); f.get_by_role("tab", name="Execution options").click()
    f.locator("#opt-execution").select_option("rules")
    f.get_by_role("tab", name="Orchestration and calls").click(); agent_page(f, "Ask the agents")
    check("the options line now shows the Rules execution", "Execution: Rules" in f.locator("[data-testid=options-summary]").inner_text())
    run_prompt(PREPARE)
    check("Rules execution: eight lines proposed, two estimates excluded, no documents and no estimates", "execution Rules" in f.locator(".aw-answer").inner_text() and "2 excluded" in f.locator(".aw-answer").inner_text()
          and on("Technical options", lambda: f.locator(".aw-log li.skipped").count() == 2) and until(lambda: lines_table().locator("tbody tr").count() == 8))
    agent_page(f, "Technical options"); f.get_by_role("tab", name="Execution options").click()
    f.locator("#opt-execution").select_option("llm")
    f.get_by_role("tab", name="Orchestration and calls").click(); agent_page(f, "Ask the agents")

    # ---- 5. a closed posting period -------------------------------------------------------------------------------------------
    f.locator("#global-period").select_option("2026-10")
    run_prompt("Prepare accruals for company code 3000 for October 2026")
    until(lambda: lines_table().count() == 1 and "3000" in lines_table().inner_text())
    count = panel().locator("[data-action=decide_line]", has_text="Accept").count()
    for i in range(count):
        panel().locator("[data-action=decide_line]", has_text="Accept").nth(i).click()
        until(lambda: accepted() >= i + 1)
    check("a closed posting period is shown and blocks approval even with every line accepted", "Closed" in text() and act("approve_journal").is_disabled() and "Posting period closed" in text())

    # ---- 6. the existing agents are tiles too and the technical tabs are reachable ----------------------------------------------
    agent_page(f, "Agent catalog")
    family.get_by_role("tab", name="Cash and Treasury Assistant").click()
    check("the cash agents are tiles in their own group", f.locator(".fi-launchpad .fi-tile").count() == len(CAT["treasury"]["agents"]))
    family.get_by_role("tab", name="Reconciliation Agent").click()
    check("the reconciliation agents are tiles in their own group", f.locator(".fi-launchpad .fi-tile").count() == len(CAT["reconciliation"]["agents"]))
    agent_page(f, "Technical options")
    f.get_by_role("tab", name="Tool catalog").click()
    check("the tool catalog is a technical tab and lists the family's tools", f.locator(".aw-catalog tbody tr").count() == len(CAT["reconciliation"]["tools"]))
    # first-level Accruals tab, plugged in like Close & reconcile and Cash & treasury
    space(f, "Finance apps")
    tiles = f.locator(".fi-gtile")
    check("Finance apps is a page of tiles: Close, Cash, Accruals", tiles.count() == 3 and "Accruals" in tiles.nth(2).inner_text(), str(tiles.all_inner_texts()))
    check("the shell has three spaces", f.get_by_role("tablist", name="Spaces").get_by_role("tab").count() == 3)
    f.locator("[data-tile=accruals]").click()
    f.locator("[data-testid=module-page][data-module=accruals]").wait_for(timeout=90000)
    check("the Accruals tab shows the accrual screen and the workflow panel", until(lambda: panel().count() == 1 and "Accrual" in panel().inner_text()))
    check("the Accruals tab offers the preparer and approver roles", panel().get_by_role("button", name="Finance approver").count() >= 1 or "approver" in text().lower())
    check("no page errors", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
