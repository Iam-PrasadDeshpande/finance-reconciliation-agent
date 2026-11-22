"""Company-neutral projection of the synthetic architecture trace."""
from __future__ import annotations
import re

from .registry import components, edges

PRIVATE_KEYS = {"company_code", "ledger", "user_id", "source_mapping", "mapping", "scope"}


def neutral(value):
    if isinstance(value, dict):
        return {key: neutral(item) for key, item in value.items() if key not in PRIVATE_KEYS}
    if isinstance(value, list):
        return [neutral(item) for item in value]
    if isinstance(value, str):
        value = re.sub(r"\b(?:company code|company_code|entity)\s*[:=]?\s*\d{4}\b", "synthetic entity", value, flags=re.I)
        value = re.sub(r"\bERP-[A-Z]:\d{4}->\d{4}\b", "synthetic mapping", value)
        value = re.sub(r"\b\d{4}:0L\b", "synthetic scope", value)
        return value
    return value


def architecture_registry():
    return {
        "components": [neutral(c) for c in components()],
        "edges": [neutral(e) for e in edges()],
        "gates": {f"G{i}": "OPEN · live vendor proof required" for i in range(1, 8)},
        "synthetic": True,
    }


def architecture_events(rows):
    return [neutral(row) for row in rows]
