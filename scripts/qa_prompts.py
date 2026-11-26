"""Prompt-to-execution matrix: every prompt typed on the front page reaches the right agents, the run is shown, and it stays shown while
the person moves through every area and every Architecture view.

For each prompt (reconciliation and treasury, including the refusals) the script
  1. types it on the front page and runs it,
  2. checks the agent screen repeats the request, names the right module, lists the expected agents and tools as done (or shows the control that stopped it),
  3. walks every area tab and every Architecture sub-view (and home) and comes back,
  4. checks the same run is still shown: same request, steps, answer and output link, and the module's own screen still carries the 'latest agent run' banner,
  5. changes the period and back: the run is flagged stale for the other period and recovers.
At the end it checks that every specialist agent of every module was exercised at least once.

    QA_URL=http://127.0.0.1:8925 python scripts/qa_prompts.py     (also a Streamlit URL, local or hosted; QA_MOBILE=1 for a phone viewport)
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from playwright.sync_api import sync_playwright
from qa_nav import nav, agent_page, space
from poc import cockpit

URL = os.environ.get("QA_URL", "http://127.0.0.1:8899").rstrip("/")
MOBILE = os.environ.get("QA_MOBILE") == "1"
SHOTS = Path(os.environ.get("QA_SHOTS", "prompt_evidence")); SHOTS.mkdir(parents=True, exist_ok=True)
CAT = cockpit.catalog()["domains"]
NAME = {t["name"]: next(a["name"] for a in CAT[m]["agents"] if a["id"] == t["agent"]) for m in CAT for t in CAT[m]["tools"]}
SPECIALISTS = {a["name"] for m in CAT for a in CAT[m]["agents"] if a["kind"] == "specialist"}
results, exercised = [], set()

# (module, prompt, expected tools or None when the control must stop it)
MATRIX = [
    ("reconciliation", "Reconcile November 2026 company code 1000 ledger 0L USD", ["resolve_scope", "collect_evidence", "compute_variance", "close_readiness", "trace", "start_investigation"]),
    ("reconciliation", "Explain the route controls", ["route_controls"]),
    ("reconciliation", "Investigate this variance", ["start_investigation"]),
    ("reconciliation", "Propose an adjustment", ("control", "Document investigation is active")),  # November still has an active investigation
    ("reconciliation", "Post a journal entry to SAP for November 2026", None),
    ("reconciliation", "Reconcile October 2026 company code 1000 ledger 0L USD", ["resolve_scope", "collect_evidence", "compute_variance", "close_readiness", "trace"]),
    ("reconciliation", "Propose an adjustment", ["draft_proposal"]),  # October has a variance and no investigation, so the approval agent drafts
    ("treasury", "What is our cash position for November 2026?", ["check_statement_completeness", "get_opening_balances", "identify_surplus_deficit", "check_treasury_policy", "retrieve_transfer_templates", "generate_transfer_recommendations"]),
    ("treasury", "Propose transfers to cover shortfalls", ["get_opening_balances", "identify_surplus_deficit", "retrieve_transfer_templates", "generate_transfer_recommendations"]),
    ("treasury", "Forecast liquidity for the next 30 days", ["forecast_liquidity"]),
    ("treasury", "Show bank fees and credit lines", ["bank_relationship_summary"]),
    ("treasury", "Initiate the bank transfer now", None),
    ("accruals", "Prepare accruals for company code 1000 for November 2026", ["get_accrual_candidates", "get_prior_accruals", "read_source_documents", "interpret_policy", "calculate_accrual", "estimate_accrual", "check_accrual_policy", "draft_accrual_journal"]),
    ("accruals", "Reconcile the posted accrual entries for company code 3000 for November 2026", ("control", "No posted accrual journal exists")),
    ("accruals", "Post the accrual journal for November 2026", None),
]
if os.environ.get("QA_ONLY"):
    MATRIX = [row for row in MATRIX if row[0] == os.environ["QA_ONLY"]]
# any further module (for example the scaffold) is exercised with its own first example
for manifest in cockpit.manifests():
    if manifest["id"] not in ("reconciliation", "treasury", "accruals"):
        MATRIX.append((manifest["id"], manifest["examples"][0].replace("{period}", "November 2026"), [t["name"] for t in CAT[manifest["id"]]["tools"] if t["name"] != "plan"]))


def check(name, ok, detail=""):
    results.append(bool(ok)); print(("PASS " if ok else "FAIL ") + name + (f" :: {detail}" if detail else ""))
    return bool(ok)


with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844} if MOBILE else {"width": 1440, "height": 900})
    page.set_default_timeout(150000)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(4000)
    f = page.frame_locator("iframe").first if page.locator("iframe").count() else page
    f.get_by_role("tab", name="Finance apps").click(); f.locator(".entry-card").nth(2).wait_for(timeout=150000)
    tabs_nav = nav(f)
    modules = [m for m in cockpit.manifests() if m.get("tab")]
    agents_index = len(modules)
    arch_index = len(modules) + 1
    tab_of = {m["id"]: i for i, m in enumerate(modules)}

    def home():
        f.get_by_role("button", name="Back to Finance Launchpad").click()
        f.locator("#entry-ask-input").wait_for()

    def settled():
        page.wait_for_function("1")
        f.locator(".aw-plan-state").first.wait_for(timeout=150000)
        for _ in range(150):
            text = f.locator(".aw-plan-state").first.inner_text()
            if "Dispatching" not in text:
                break
            page.wait_for_timeout(500)

    def snapshot():
        agent_page(f, "Technical options")
        log = f.locator(".aw-log li:not(.orch)")
        names = [log.nth(i).locator("b").inner_text() for i in range(log.count())]
        done_count = f.locator(".aw-log li.done:not(.orch)").count()
        agent_page(f, "Ask the agents")
        return {"request": f.locator("[data-testid=plan-request]").inner_text(), "domain": f.locator("[data-testid=plan-domain]").inner_text(),
                "steps": names, "done": done_count, "answer": f.locator(".aw-answer p").first.inner_text()[:140] if f.locator(".aw-answer").count() else "",
                "output": f.locator("[data-testid=plan-output]").count(), "workflow": f.locator("[data-testid=workflow-panel]").count(), "state": f.locator(".aw-plan-state").first.get_attribute("class")}

    def walk():
        """Every area, every Architecture view, and home, then back to the Agents screen."""
        for index in [i for i in range(len(modules))] + [arch_index]:
            tabs_nav.nth(index).click()
            page.wait_for_timeout(250)
        f.locator(".fi-gtile").first.click()
        views = f.get_by_role("tablist", name="Architecture views").get_by_role("tab")
        count = views.count()
        for i in range(count):
            views.nth(i).click()
            page.wait_for_timeout(300)
        home()
        f.get_by_role("tab", name="Agents & architecture").click(); f.get_by_role("button", name="Open Watch the agents work").click()
        f.locator("[data-testid=plan-request]").wait_for(timeout=60000)
        return count

    def watchdog(error):
        """When a wait times out, record what the page actually shows, so a stall can be told apart from a failed check."""
        print(f"STALL: {type(error).__name__}: {str(error).splitlines()[0][:120]}")
        try:
            page.screenshot(path=str(SHOTS / "stall.png"))
            print("STALL page text:", page.inner_text("body")[:300].replace(chr(10), " | "))
            print("STALL iframe count:", page.locator("iframe").count(), "| app visible:", f.locator(".app-shell").count(), "| entry visible:", f.locator(".entry-card").count(), "| workbench:", f.locator("main.agent-workbench").count())
            print("STALL entry input now:", repr(f.locator("#entry-ask-input").input_value()[:70]) if f.locator("#entry-ask-input").count() else "none", "| last typed:", repr(LAST_TYPED[:70]))
        except Exception as inner:
            print("STALL could not inspect the page:", str(inner)[:100])

    first = True
    last_request = ""
    LAST_TYPED = ""
    try:
        for module, prompt, expected_tools in MATRIX:
            label = f"[{module}] {prompt[:46]}"
            if not first:
                home()
            first = False
            f.locator("#entry-ask-input").fill(prompt)
            LAST_TYPED = prompt
            check(f"{label}: routes to its module before running", f.locator("[data-testid=route-chip]").get_attribute("data-domain") == module)
            before = last_request  # the workbench still shows the previous plan until the new one arrives
            f.get_by_role("button", name="Run plan →").click()
            ran = None
            for _ in range(300):
                current = f.locator("[data-testid=plan-request]").inner_text() if f.locator("[data-testid=plan-request]").count() else ""
                if current and current != before:
                    ran = current
                    break
                page.wait_for_timeout(500)
            if not check(f"{label}: the request that ran is the one typed", ran is not None and prompt in ran, f"ran: {ran!r}"):
                continue
            settled()
            a = snapshot()
            last_request = a["request"]
            check(f"{label}: the agent screen shows the request exactly as typed", prompt in a["request"])
            check(f"{label}: handled by {module}", cockpit.get(module).family_label.lower() in a["domain"].lower())
            if expected_tools is None:
                check(f"{label}: stopped at a control, nothing executed", "blocked" in a["state"] and a["steps"] == [] and a["output"] == 0)
            elif isinstance(expected_tools, tuple):
                check(f"{label}: the agent ran and a control stopped it with the reason shown", "blocked" in a["state"] and len(a["steps"]) == 1 and expected_tools[1] in f.locator(".aw-answer").inner_text() and a["output"] == 0, expected_tools[1])
                exercised.update(w for w in SPECIALISTS if w in " ".join(a["steps"]))
            else:
                want = [NAME[t] for t in expected_tools]
                check(f"{label}: every expected agent ran and finished", all(w in " ".join(a["steps"]) for w in want) and a["done"] >= len(set(want)) and "done" in a["state"], f"{a['done']} steps done: {sorted(set(want))}")
                check(f"{label}: the full-output link or the workflow panel is shown", a["output"] == 1 or (cockpit.get(module).workflow and a["workflow"] == 1))
                exercised.update(w for w in want if w in SPECIALISTS)
            page.screenshot(path=str(SHOTS / f"p_{module}_{abs(hash(prompt)) % 10000}{'_m' if MOBILE else ''}.png"))
            views = walk()
            b = snapshot()
            check(f"{label}: after {len(modules) + 1} areas, {views} architecture views and home, the same run is still shown", {k: a[k] for k in ("request", "domain", "steps", "answer", "output")} == {k: b[k] for k in ("request", "domain", "steps", "answer", "output")} and b["done"] == a["done"], f"{b['done']}/{len(b['steps'])} done")
            if isinstance(expected_tools, list) and module in tab_of:
                tabs_nav.nth(tab_of[module]).click()
                f.locator("[data-testid=close-screen], [data-testid=treasury-page], [data-testid=module-page]").first.wait_for(timeout=60000)
                check(f"{label}: the module's own screen still carries the latest-run banner", f.locator("[data-testid=agent-run-banner]").count() == 1)
                other = [i for m, i in tab_of.items() if m != module]
                if other:
                    tabs_nav.nth(other[0]).click()
                    page.wait_for_timeout(500)
                    check(f"{label}: the other module's screen does not claim this run", f.locator("[data-testid=agent-run-banner]").count() == 0)
                tabs_nav.nth(agents_index).click()
            # the period contract holds for a run that is still on screen
            if isinstance(expected_tools, list) and prompt.startswith(("Reconcile November", "What is our cash")):
                f.locator("#global-period").select_option("2026-02")
                f.locator("[data-testid=plan-stale]").wait_for(timeout=30000)
                check(f"{label}: changing the period flags the run as stale and offers a re-run", f.locator("[data-testid=plan-stale] button").count() == 1)
                f.locator("#global-period").select_option("2026-11")
                f.locator("[data-testid=plan-stale]").wait_for(state="detached", timeout=30000)
                check(f"{label}: returning to the period clears the stale flag and keeps the run", prompt in f.locator("[data-testid=plan-request]").inner_text())
    except Exception as error:
        watchdog(error)
        check("the matrix ran to the end without a stall", False, str(error).splitlines()[0][:100])

    check("every specialist agent of every module was exercised by a front-page prompt", exercised >= SPECIALISTS, f"missing: {sorted(SPECIALISTS - exercised)}" if exercised < SPECIALISTS else f"{len(SPECIALISTS)} agents")
    check("no page errors across the whole matrix", not errors, "; ".join(errors)[:200])
    browser.close()

print(f"\n{sum(results)} passed, {len(results) - sum(results)} failed")
raise SystemExit(0 if all(results) else 1)
