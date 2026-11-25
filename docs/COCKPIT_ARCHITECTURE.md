# SAP Finance Agent Cockpit: structure, plug-and-play contract and validation

The cockpit hosts several agent modules. Each module works on its own synthetic data, has its own tools and ontology fragment, and reaches the
simulated SAP layers through the MCP route chosen on the Architecture pages. This page records the assessment that led to the structure, the
contract a module implements, how to add an agent, and how the cockpit is validated end to end.

## 1. Assessment: what was coupled to a specific agent

When the second agent (Cash and Treasury) was added, the application worked, but a new agent would have meant editing about eight places:

| Coupling found | Where | Now |
|---|---|---|
| Request routing as hard-coded regular expressions, duplicated in Python and JavaScript | `treasury_agents.py`, `period.js` | Each module declares `routing_words` and a priority. The browser builds its router from the manifest. |
| Catalog assembled by hand for two families | `treasury_agents.py` | `cockpit.catalog()` aggregates every registered module. |
| Per-agent API endpoints | `app.py` | Generic `/api/cockpit/modules`, `/ontology`, `/{module}/view/{period}`, `/{module}/action/{name}`. The old `/api/treasury/...` routes remain as thin wrappers. |
| Per-agent Streamlit data keys and actions | `streamlit_app.py` | `modules`, `module_views`, `ontology` and one `module_action`. |
| Area tabs, entry cards and examples written by hand | `App.jsx`, `Entry.jsx` | Built from the module manifests. |
| A fixed two-way family switch and a treasury-only result component | `AgentWorkbench.jsx` | The switch comes from the catalog; every module's result is drawn from declarative blocks. |
| Orchestrator found by name pattern | `orchestrationSvg.js` | Cards carry `kind: orchestrator | specialist`. |
| Hosted reload guard watched only `poc/*.py` | `streamlit_app.py` | It hashes `poc/**/*.py`, so a new file under `poc/agent_modules/` reloads. |

## 2. Layers and who owns what

| Layer | Owner | Notes |
|---|---|---|
| Shell: header, period selector, areas, routing, provenance labels | Cockpit | One canonical period for every screen (see `PERIOD_SYNC.md`). |
| Agent module: agents, tools, runner, Level 1 view, ontology fragment, SAP references | The module (`poc/agent_modules/<id>.py`) | The only thing a new agent adds. |
| MCP-shaped tool calls and plan/step shape | Cockpit | In-process; there is no MCP transport. A tool is `read`, `local-draft` or `none`. A write to SAP is never a tool. |
| Selected route (S1 Apigee or S2 AgentCore) and the simulated SAP layers | Cockpit | Modules read through it; they add no architecture components. |
| Architecture pages (complete architecture, MCP hosting, agent hosting, diagrams) | Cockpit | About hosting and routes, so they apply to every module. They are not per-agent. |
| Synthetic data | The module | Deterministic, labelled synthetic, no SAP connection. |
| Ontology | Merged by the cockpit from shared concepts plus each module's fragment | The demo's own model, grounded to SAP terms where SAP documents them. Not an SAP-published ontology. |

## 3. The module contract (`poc/cockpit.py`, `AgentModule`)

`id`, `name`, `family_label`, `short_name`, `blurb`, `icon`; `tab` (`id`, `label`, `short`, `icon`, or none); `renderer`
(`builtin:reconciliation`, `treasury` or `generic`); `routing_words` and `routing_priority`; `ask_template` and `examples` (`{period}` is filled in);
`catalog()` (agents, tools, `not_tools`, references); `run(ctx, message, scenario, case_id, period)` returning a plan; optional `view(store, period)`
and `actions`; `ontology()` and `tool_concepts` (what each tool reads and produces); `architecture` (how it sits on the shared route and data).
Exactly one module is the `default` and answers requests that match nobody.

A `generic` module needs no UI code: its `view()` returns `ui.blocks` and its plans return `result_blocks`, built from four block types
(`kpis`, `table`, `list`, `note`). A module that needs a richer screen adds a React renderer and one entry in the renderer map, as treasury does.

## 4. Adding an agent

1. Copy `poc/agent_modules/_sample.py` to `poc/agent_modules/<id>.py` (no leading underscore) and replace the content: cards, tools, runner, view, ontology fragment, references.
2. Run `python -m pytest tests/test_cockpit_contract.py`. It runs the same conformance tests against every registered module.
3. Run `python scripts/qa_cockpit.py` against a local server. It discovers the module from the API and checks it in the browser with no change to the script.
4. Optional, by hand: audience lenses in `frontend/src/roleData.js`, the decision brief, and the docs.

You do not touch routing, the catalog, the API, the Streamlit app, the tabs, the entry page, the workbench or the ontology view. The scaffold proves this:
with `COCKPIT_SAMPLE_MODULE=1` it appears as a third module and `qa_cockpit.py` passes 38 of 38 checks with no UI change.

## 5. Validation model

| Check | What it proves | Where |
|---|---|---|
| Conformance tests, per module | Unique ids; one default; routing compiles and every example routes to its own module; cards and tools consistent; no tool can write; plans have the step shape and use only known layers and components; the period contract (selector, explicit request wins, no data is explicit); the Level 1 view and blocks; ontology fragment (namespaced ids, no orphans, SAP status backed by a source); references citable | `tests/test_cockpit_contract.py` |
| Plug-in test | A module registered at run time appears in routing, manifest, catalog, ontology, view and API, then is removed | same file |
| Shared UI names no module | No routing constants or module lists in the shared UI source | same file |
| Module logic | Numbers, statuses, recommendations, approval marker | `tests/test_treasury.py`, `tests/test_period_sync.py`, `tests/test_poc.py`, `tests/test_agents.py` |
| Browser, web | Entry routing, Level 1, period sync, Level 2, concepts into the ontology, ontology graph, per module from the manifests | `scripts/qa_cockpit.py`, `qa_treasury.py`, `qa_period_sync.py`, `qa_current_release.py` |
| Browser, Streamlit | The same on the embedded surface, including reruns and refresh | `qa_cockpit_streamlit.py`, `qa_treasury_streamlit.py`, `qa_period_sync_streamlit.py` |

## 6. What is not plug-and-play yet

- A new module with an unusual Level 1 screen needs a React renderer (one component and one map entry). The generic blocks cover KPIs, tables, lists and notes.
- A module that needs a different route or hosting option is an architecture decision on the Architecture pages, not a code change.
- Audience lenses, the decision brief and the written docs are edited by hand.
- Each module brings its own synthetic data and its own SAP references; the cockpit cannot check that they are right, only that they are present and labelled.
- The calls are in-process. Moving a module to a real MCP server is a separate piece of work for every module.

## 7. One flow, with links both ways

Whatever is asked, wherever it is asked, runs the same agents. The front-screen bar, the Ask bars on Close & reconcile and Cash & treasury, the buttons on those screens, the shell menu and the Agents screen all call one path (`askAgents`); there is no separate chat. The legacy "Ask about the evidence" chat drawer was removed from the Close screen because it produced a different, older consolidated report than the agents did.

- The Agents screen repeats the exact request, then shows a **Full output of this run** bar. Each module declares its output (`output` in the contract): for the reconciliation agent, "Open in Close & reconcile" and "Open the detailed reconciliation report"; for treasury, "Open in Cash & treasury" and "Open the detailed cash & treasury view".
- Each module screen shows a **Latest agent run** banner (for the same period) with a "View agent run" link back to the Agents screen.
- A finished plan is shown complete when you return to it; the step animation plays once.
- Close & reconcile is one view: all twelve periods with the S/4HANA balance, Central Finance balance, variance and status; the selected period's detail; the scenario lab; and the case and approval controls in a fold. It fits a 1440 × 900 laptop without scrolling.
