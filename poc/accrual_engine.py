"""Accrual calculation, the simulated LLM, policy checks, the journal and the reconciliation (pure functions; no store access).

The split mirrors the design rule of the assessment: the model translates policy, reads documents and writes the reasoning, and
deterministic code does every calculation. Execution 'llm' (default) lets the simulated model interpret the handbook, read documents,
estimate where no formula exists and explain each line. Execution 'rules' runs the coded rules only: no documents, no estimates.
In both modes every amount comes from this module's arithmetic, so a formula-based line has the same amount in either mode.

THE LLM HERE IS SIMULATED. No model is called and no model tenant is connected. The simulation is deterministic and labelled in
every output; LLM_ADAPTER is the one place a real call (through Portkey) would replace it.
"""
from __future__ import annotations

import hashlib
import json
import re
from datetime import date

from . import accrual_data as A

LLM = {"mode": "LLM", "simulated": True, "model": "simulated-accrual-llm-1", "prompt_version": "accrual-prompt-1", "temperature": 0,
       "output_schema": "AccrualProposal v1", "note": "SIMULATED: no model is called. Outputs are deterministic and recorded the way a real model call would be."}
LLM_ADAPTER = "simulated"  # a real implementation would call the model through Portkey here, then validate against the same schema
EXECUTIONS = {"llm": "LLM", "rules": "Rules"}
INJECTION_PATTERN = re.compile(r"(ignore\s+(the\s+)?(accrual\s+)?(policy|instructions)|post\s+this\s+entry|without\s+review|system\s+note\s+to\s+the\s+ai)", re.I)
RULES = [
    {"clause": "H1", "applies_to": "GR/IR items and purchase orders with a goods receipt", "formula": "goods receipt value less invoiced value"},
    {"clause": "H2", "applies_to": "purchase orders without a receipt", "formula": "scheduled quantity due times unit price, less invoiced value"},
    {"clause": "H3", "applies_to": "service entry sheets", "formula": "accepted value less invoiced value"},
    {"clause": "H4", "applies_to": "recurring contracts billed in arrears", "formula": "monthly fee times months since the last invoice"},
    {"clause": "H5", "applies_to": "items without an invoice value", "formula": "estimate from history, documented hours and rate, or a vendor statement; mark as estimate"},
    {"clause": "H6", "applies_to": "all lines", "formula": "materiality threshold, approved expense account and cost center; post on the last day, reverse on the first day of the next period"},
]
COST_CENTER_HISTORY = {"PO": "CC-PROD", "SES": "CC-FAC", "GRIR": "CC-PROD", "CONTRACT": "CC-ADM", "ESTIMATE": "CC-FAC"}


def execution_label(execution: str) -> str:
    return EXECUTIONS.get(execution, "LLM")


# ---- deterministic calculation (used by both executions) -------------------------------------------------------------
def formula_amount(item: dict):
    """(amount, basis, clause) for a formula-based type, or None for an estimate type."""
    t = item["type"]
    if t == "PO" and item["received"] > 0:
        qty = item["received"] - item["invoiced"]
        return max(0, round(qty * item["unit"])), f"(received {item['received']} − invoiced {item['invoiced']}) × unit price {item['unit']}", "H1"
    if t == "PO":
        qty = item["scheduled_due"] - item["invoiced"]
        return max(0, round(qty * item["unit"])), f"(scheduled quantity due {item['scheduled_due']} − invoiced {item['invoiced']}) × unit price {item['unit']}", "H2"
    if t == "SES":
        return max(0, item["accepted"] - item["invoiced"]), f"accepted {item['accepted']:,} − invoiced {item['invoiced']:,}", "H3"
    if t == "GRIR":
        return max(0, item["gr_value"] - item["ir_value"]), f"goods receipt {item['gr_value']:,} − invoice {item['ir_value']:,}", "H1"
    if t == "CONTRACT":
        return item["monthly"] * item["months"], f"monthly fee {item['monthly']:,} × {item['months']} month(s) since the last invoice", "H4"
    return None


# ---- the simulated LLM -------------------------------------------------------------------------------------------------
def interpret_handbook(execution: str) -> list[dict]:
    """The rule set the agent works from. LLM: read from the handbook text, with the clause quoted. Rules: the coded rules."""
    if execution == "llm":
        text = {c["id"]: c for c in A.HANDBOOK["clauses"]}
        return [{**r, "source": "LLM interpretation of the handbook", "quote": text[r["clause"]]["text"], "handbook": A.HANDBOOK["version"]} for r in RULES]
    return [{**r, "source": "coded rule", "quote": None, "handbook": None} for r in RULES if r["clause"] != "H5"]


def scan_documents(documents: list[dict]) -> dict:
    """Mark documents that carry instructions. Document content is untrusted input and is never obeyed."""
    flagged = [d["doc_id"] for d in documents if INJECTION_PATTERN.search(d["text"])]
    return {"documents": len(documents), "injection_detected": flagged}


def _facts(text: str) -> dict:
    """Extract only the structured facts a value is built from; any other sentence in a document is ignored."""
    rate = re.search(r"Hourly rate agreed:\s*(\d+)", text)
    hours = re.search(r"(\d+(?:\.\d+)?)\s*hours worked", text)
    stated = re.search(r"estimate for the month is\s*(\d+)", text)
    return {"rate": int(rate.group(1)) if rate else None, "hours": float(hours.group(1)) if hours else None, "stated": int(stated.group(1)) if stated else None}


def estimate(item: dict, period: str, cc: str, documents: list[dict]) -> dict | None:
    """Estimate for an item with no formula (clause H5). The method is the model's judgment; the arithmetic is deterministic."""
    month = int(period[5:])
    if item["method"] == "history":
        past = A.history(period, cc)
        avg, season = round(sum(past) / 3), A.SEASON[month]
        amount = round(avg * season)
        return {"amount": amount, "low": round(amount * 0.9), "high": round(amount * 1.1), "confidence": 0.82, "clause": "H5",
                "basis": f"average of the last three invoices {avg:,} × seasonality {season}", "evidence": [f"last three invoices: {', '.join(f'{x:,}' for x in past)}"], "flags": []}
    if item["method"] == "hours":
        doc = next((d for d in documents if d["doc_id"] == item.get("doc")), None)
        facts = _facts(doc["text"]) if doc else {}
        if not facts.get("rate") or not facts.get("hours"):
            return None
        amount = round(facts["rate"] * facts["hours"])
        return {"amount": amount, "low": round(amount * 0.85), "high": amount, "confidence": 0.78, "clause": "H5",
                "basis": f"documented hours {facts['hours']} × agreed rate {facts['rate']}", "evidence": [f"{doc['doc_id']}: rate {facts['rate']}, {facts['hours']} hours"], "flags": []}
    return None


def document_candidates(period: str, cc: str, documents: list[dict]) -> list[dict]:
    """Liabilities the structured data does not hold, found in unstructured documents (LLM execution only)."""
    out = []
    for d in documents:
        facts = _facts(d["text"])
        if d["doc_id"] == "D-MAIL" and facts["stated"]:
            out.append({"key": "UNREC", "type": "ESTIMATE", "vendor": "Kestrel Logistics", "reference": "No purchase order (vendor e-mail)", "description": "Pallet-shipping services delivered, no purchase order raised",
                        "cost_center": None, "expense_key": "SES", "currency": A.COMPANY_CODES[cc]["ccy"], "company_code": cc, "period": period, "method": "stated", "doc": d["doc_id"], "situation": "unrecorded",
                        "stated": facts["stated"]})
    return out


def explain(line: dict, execution: str) -> str:
    """The reasoning shown to the reviewer. LLM: grounded in the evidence and the handbook clause. Rules: the rule that fired."""
    if execution != "llm":
        return f"Rule {line['clause']}: {line['basis']}."
    parts = [f"Handbook clause {line['clause']} applies. {line['basis']} = {line['amount']:,} {line['currency']}."]
    if line.get("estimate"):
        parts.append(f"This is an estimate (range {line['estimate']['low']:,} to {line['estimate']['high']:,}); evidence: {'; '.join(line['evidence'])}.")
    for flag in line["flags"]:
        parts.append(flag + ".")
    return " ".join(parts)


# ---- policy ------------------------------------------------------------------------------------------------------------
def build_line(item: dict, execution: str, period: str, cc: str, documents: list[dict], taken: dict) -> dict:
    """One proposal line (or an exclusion) from one candidate. `taken` maps a reference to a document that already accrues it."""
    base = {"line_id": f"{cc}-{period}-{item['key']}", "key": item["key"], "type": item["type"], "type_label": A.TYPES[item["type"]], "vendor": item["vendor"], "reference": item["reference"],
            "description": item["description"], "currency": item["currency"], "cost_center": item["cost_center"], "expense_key": item["expense_key"], "flags": [], "evidence": [], "estimate": None,
            "source": "LLM" if execution == "llm" else "Rules"}
    ccy = A.COMPANY_CODES[cc]["ccy"]
    got = formula_amount(item)
    if got:
        amount, basis, clause = got
        base.update(amount=amount, basis=basis, clause=clause, confidence=0.99)
    elif execution != "llm":
        return {**base, "excluded": "Needs an estimate (clause H5); a fixed rule cannot produce one. Run with the LLM execution.", "amount": 0, "clause": "H5", "basis": "", "confidence": 0.0}
    elif item["method"] == "stated":
        base.update(amount=item["stated"], low=round(item["stated"] * 0.9), high=item["stated"], clause="H5", basis=f"amount stated by the vendor, {item['stated']:,}", confidence=0.6,
                    estimate={"low": round(item["stated"] * 0.9), "high": item["stated"]}, evidence=[f"{item['doc']}: vendor estimate {item['stated']:,}"],
                    flags=["No purchase order exists: raise a commitment before posting", "Amount is the vendor's own statement and is unverified"])
    else:
        est = estimate(item, period, cc, documents)
        if not est:
            return {**base, "excluded": "Not enough evidence to estimate; no document value found.", "amount": 0, "clause": "H5", "basis": "", "confidence": 0.0}
        base.update(amount=est["amount"], basis=est["basis"], clause=est["clause"], confidence=est["confidence"], estimate={"low": est["low"], "high": est["high"]}, evidence=est["evidence"], flags=est["flags"])
    if base["amount"] <= 0:
        return {**base, "excluded": "Nothing to accrue: the value is already invoiced."}
    if base["amount"] < A.MATERIALITY[cc]:
        return {**base, "excluded": f"Below the materiality threshold of {A.MATERIALITY[cc]:,} {ccy} (clause H6)."}
    status = "proposed"
    if item["reference"] in taken:
        base["flags"].append(f"Duplicate: already accrued in document {taken[item['reference']]}")
        status = "blocked"
    if not base["cost_center"]:
        if execution == "llm":
            base["cost_center"] = COST_CENTER_HISTORY[item["type"]]
            base["flags"].append(f"Cost center {base['cost_center']} suggested from history; the reviewer must confirm")
        else:
            base["flags"].append("No cost center (clause H6); a rule cannot suggest one")
            status = "blocked"
    if base["confidence"] < 0.75:
        base["flags"].append("Low confidence: review the evidence before accepting")
    account = A.EXPENSE[base["expense_key"]]
    base.update(expense_account=account[0], expense_account_name=account[1], liability_account=A.LIABILITY[0], status=status, reasoning=None)
    base["reasoning"] = explain(base, execution)
    return base


# ---- journal -----------------------------------------------------------------------------------------------------------
def accepted_lines(run: dict) -> list[dict]:
    return [line for line in run["lines"] if line.get("status") == "accepted"]


def journal_hash(run: dict) -> str:
    material = [(l["line_id"], l["amount"], l["expense_account"], l["cost_center"]) for l in accepted_lines(run)]
    return hashlib.sha256(json.dumps([run["company_code"], run["period"], material], sort_keys=True).encode()).hexdigest()


def build_journal(run: dict) -> dict:
    rows = []
    for l in accepted_lines(run):
        rows.append({"line": l["line_id"], "account": f"{l['expense_account']} {l['expense_account_name']}", "cost_center": l["cost_center"], "debit": l["amount"], "credit": 0, "text": f"{l['vendor']} {l['reference']}"})
        rows.append({"line": l["line_id"], "account": f"{l['liability_account']} {A.LIABILITY[1]}", "cost_center": None, "debit": 0, "credit": l["amount"], "text": f"Accrual {l['reference']}"})
    debit, credit = sum(r["debit"] for r in rows), sum(r["credit"] for r in rows)
    return {"rows": rows, "debit": debit, "credit": credit, "balanced": debit == credit, "posting_date": A.period_end(run["period"]).isoformat(),
            "reversal_date": A.next_period_start(run["period"]).isoformat(), "currency": run["currency"], "hash": journal_hash(run)}


# ---- reconciliation of the posted entries ------------------------------------------------------------------------------
def reconcile(run: dict, ledger_docs: list[dict]) -> dict:
    """Tie the posted documents to what was approved, to the accrual account, to the reversal, and to Central Finance."""
    cc, period = run["company_code"], run["period"]
    docs = [d for d in ledger_docs if d["company_code"] == cc and d["period"] == period]
    approved = accepted_lines(run)
    approved_total = sum(l["amount"] for l in approved)
    posted_lines = [row for d in docs for row in d["lines"]]
    posted_total = sum(row["amount"] for row in posted_lines)
    refs = [row["reference"] for row in posted_lines]
    reversal_ok = bool(docs) and all(d["reversal"]["date"] == A.next_period_start(period).isoformat() and d["reversal"]["total"] == -d["total"] for d in docs)
    s4 = sum(d["total"] for d in docs)
    cfin = sum(d["total"] for d in docs if d["replicated"])
    pending = [d["doc_no"] for d in docs if not d["replicated"]]
    ccy = run["currency"]

    def check(name, expected, actual, ok, note=""):
        return {"check": name, "expected": expected, "actual": actual, "status": "OK" if ok else "DIFFERENCE", "note": note}

    checks = [
        check("Every approved line is posted once", f"{len(approved)} lines", f"{len(posted_lines)} lines", len(approved) == len(posted_lines) and len(set(refs)) == len(refs)),
        check("Debits equal credits", "balanced", "balanced" if all(d["debit"] == d["credit"] for d in docs) and docs else "unbalanced", bool(docs) and all(d["debit"] == d["credit"] for d in docs)),
        check("Posted total equals approved total", f"{approved_total:,} {ccy}", f"{posted_total:,} {ccy}", approved_total == posted_total and bool(docs)),
        check("Accrued liabilities account 215000 equals the posted total", f"{approved_total:,} {ccy}", f"{s4:,} {ccy}", s4 == approved_total and bool(docs)),
        check("Reversal is scheduled for the first day of the next period", A.next_period_start(period).isoformat(), docs[0]["reversal"]["date"] if docs else "none", reversal_ok),
        check("No reference is accrued twice", "0 duplicates", f"{len(refs) - len(set(refs))} duplicates", len(refs) == len(set(refs))),
        check("Central Finance holds the same total as S/4HANA", f"{s4:,} {ccy}", f"{cfin:,} {ccy}", s4 == cfin and bool(docs), ("Pending replication: " + ", ".join(pending)) if pending else ""),
    ]
    differences = [c for c in checks if c["status"] != "OK"]
    only_replication = len(differences) == 1 and differences[0]["check"].startswith("Central Finance")
    status = "RECONCILED" if not differences else ("OPEN: REPLICATION PENDING" if only_replication else "NOT RECONCILED")
    return {"status": status, "checks": checks, "s4_total": s4, "cfin_total": cfin, "difference": s4 - cfin, "pending_documents": pending, "documents": [d["doc_no"] for d in docs], "currency": ccy}
