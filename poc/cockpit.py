"""SAP Finance Agent Cockpit: the contract an agent module implements, and the registry that makes agents plug and play.

An agent module is one file in poc/agent_modules/ that exposes MODULE (an AgentModule). Dropping the file in is the only
backend step: routing, the agent catalog, the Level 1 screen, the Level 2 workbench, the ontology and the API pick it up
from the manifest. Nothing else in the cockpit names a module.

What the cockpit owns (shared by every module):  the period contract, request routing, the plan/step shape, the selected MCP
route (S1/S2) and the simulated SAP layers, provenance labels, the Architecture pages (MCP hosting, agent hosting, diagrams).
What a module owns:  its agents and tools, its synthetic data, its Level 1 view, its ontology fragment, its SAP references.

The calls are in-process and MCP-shaped (no MCP transport). No module may expose a write tool; the only permitted write is a
local draft or a local approval marker.
"""
from __future__ import annotations

import importlib
import os
import pkgutil
import re
from dataclasses import dataclass, field
from typing import Callable

from .sap_guidance import PROVENANCE
from .store import Denied

ALLOWED_RW = ("read", "local-draft", "none")  # a tool that can write to SAP does not exist in this cockpit
STEP_FIELDS = ("step_id", "agent", "tool", "purpose", "rw", "status", "summary")
CORE_ID = "core"


@dataclass
class AgentModule:
    id: str                              # 'treasury'
    name: str                            # 'Cash and Treasury Assistant'
    family_label: str                    # chip text: 'Cash and Treasury assistant'
    short_name: str                      # 'Cash & treasury'
    blurb: str                           # entry card text
    icon: str
    tab: dict | None                     # {'id','label','short','icon'}; None = reachable from the Agents area only
    renderer: str                        # 'builtin:reconciliation' | 'treasury' | 'generic'
    routing_words: list[str]             # whole-word triggers; a request mentioning none goes to the default module
    routing_priority: int                # on a tie between modules the higher number wins
    ask_template: str                    # default request, '{period}' is replaced by 'November 2026'
    examples: list[str]                  # '{period}' allowed
    catalog: Callable[[], dict]          # agents, tools, not_tools, note, references
    run: Callable                        # (ctx, message, scenario, case_id, period) -> plan
    ontology: Callable[[], dict] = lambda: {"classes": [], "relations": []}
    view: Callable | None = None         # (store, period) -> dict for the Level 1 screen; generic modules also return 'ui'
    actions: dict = field(default_factory=dict)  # name -> (store, payload) -> dict
    tool_concepts: dict = field(default_factory=dict)  # tool -> {'reads': [class ids], 'produces': [class ids]}
    default: bool = False                # exactly one module answers requests that match nobody
    architecture: dict = field(default_factory=dict)  # how this module sits on the shared MCP route and data
    output: dict = field(default_factory=dict)  # where the full output of a run lives: screen_name, open_label, detail_label (optional)


_registry: dict[str, AgentModule] = {}
_loaded = False


def register(module: AgentModule) -> AgentModule:
    if module.id in _registry:
        raise ValueError(f"Duplicate agent module id: {module.id}")
    _registry[module.id] = module
    return module


def unregister(module_id: str) -> None:
    _registry.pop(module_id, None)


def modules() -> list[AgentModule]:
    """Registered modules in a stable order: the default module first, then by routing priority, then id."""
    global _loaded
    if not _loaded:
        _loaded = True
        from . import agent_modules  # discovery happens in the package
        for info in pkgutil.iter_modules(agent_modules.__path__):
            if info.name.startswith("_") and not (info.name == "_sample" and os.environ.get("COCKPIT_SAMPLE_MODULE") == "1"):
                continue
            loaded = importlib.import_module(f"{agent_modules.__name__}.{info.name}")
            if getattr(loaded, "MODULE", None) is not None and loaded.MODULE.id not in _registry:
                register(loaded.MODULE)
    return sorted(_registry.values(), key=lambda m: (not m.default, -m.routing_priority, m.id))


def get(module_id: str) -> AgentModule:
    for module in modules():
        if module.id == module_id:
            return module
    raise Denied("Unknown agent module.")


def default_module() -> AgentModule:
    found = [m for m in modules() if m.default]
    if len(found) != 1:
        raise RuntimeError("Exactly one agent module must be the default.")
    return found[0]


def _pattern(words: list[str]) -> re.Pattern:
    return re.compile(r"\b(" + "|".join(words) + r")\b")


def route(message: str) -> str:
    """The module that handles a request: the highest-priority module whose words appear, else the default module."""
    text = (message or "").lower()
    hits = [m for m in modules() if m.routing_words and _pattern(m.routing_words).search(text)]
    if not hits:
        return default_module().id
    return max(hits, key=lambda m: m.routing_priority).id


def run(ctx, message: str, scenario: str, case_id, period):
    module = get(route(message))
    plan = module.run(ctx, message, scenario, case_id, period)
    plan["domain"] = module.id
    return plan


def view(store, module_id: str, period: str) -> dict:
    module = get(module_id)
    if module.view is None:
        raise Denied("This module has no Level 1 view.")
    return module.view(store, period)


def action(store, module_id: str, name: str, payload: dict) -> dict:
    module = get(module_id)
    if name not in module.actions:
        raise Denied("Unknown module action.")
    return module.actions[name](store, payload)


def manifests() -> list[dict]:
    """Everything the UI needs to show modules, with no callables. The browser builds its router from this."""
    out = []
    for m in modules():
        out.append({"id": m.id, "name": m.name, "family_label": m.family_label, "short_name": m.short_name, "blurb": m.blurb, "icon": m.icon, "tab": m.tab,
                    "renderer": m.renderer, "default": m.default, "has_view": m.view is not None, "actions": sorted(m.actions),
                    "routing": {"words": m.routing_words, "priority": m.routing_priority}, "ask_template": m.ask_template, "examples": m.examples,
                    "architecture": m.architecture, "output": m.output})
    return out


def catalog(recon_legacy: dict | None = None) -> dict:
    """Both the old flat keys (the default module) and every module under 'domains'."""
    domains = {}
    for m in modules():
        cat = m.catalog()
        concepts = m.tool_concepts
        tools = [{**t, "reads": concepts.get(t["name"], {}).get("reads", []), "produces": concepts.get(t["name"], {}).get("produces", [])} for t in cat["tools"]]
        domains[m.id] = {**cat, "tools": tools, "name": m.name, "id": m.id, "examples": m.examples}
    first = domains[default_module().id]
    return {**first, "domains": domains, "order": [m.id for m in modules()], "default": default_module().id, "provenance": PROVENANCE}


def ontology() -> dict:
    """Shared core concepts plus each module's fragment, merged. Relation endpoints must exist (checked by the conformance tests)."""
    from .ontology_core import CORE
    classes = [{**c, "module": CORE_ID} for c in CORE["classes"]]
    relations = [{**r, "module": CORE_ID} for r in CORE["relations"]]
    for m in modules():
        frag = m.ontology()
        classes += [{**c, "module": m.id} for c in frag["classes"]]
        relations += [{**r, "module": m.id} for r in frag["relations"]]
    used: dict[str, list[dict]] = {}
    for m in modules():
        cat = m.catalog()
        agent_of = {t["name"]: t["agent"] for t in cat["tools"]}
        for tool, spec in m.tool_concepts.items():
            for kind in ("reads", "produces"):
                for cid in spec.get(kind, []):
                    used.setdefault(cid, []).append({"module": m.id, "tool": tool, "agent": agent_of.get(tool), "access": kind})
    for c in classes:
        c["used_by"] = used.get(c["id"], [])
    return {"modules": [{"id": CORE_ID, "name": "Shared cockpit concepts"}] + [{"id": m.id, "name": m.name} for m in modules()], "classes": classes, "relations": relations,
            "note": "The ontology is this demo's own model of its synthetic data and agents, grounded to SAP terms where SAP documents them. It is not an SAP-published ontology."}
