"""Cash and treasury calculations over the synthetic dataset. Pure functions: no SAP, no network, no writes.

Definitions used everywhere (so every screen and every agent answer agrees):
  expected closing = opening balance + expected receipts - expected payments, for the as-of business day
  DEFICIT          = expected closing below the account's policy minimum balance
  IDLE_CASH        = opening balance above idle_multiple times the account target
  WITHIN_POLICY    = everything else
Amounts are whole units of the account currency held as integers, so the arithmetic is exact. The USD display
amount is the account amount times a synthetic rate, rounded; it is for display and bank concentration only.
"""
from __future__ import annotations

import hashlib
import json
from collections import defaultdict
from datetime import date, timedelta

from . import treasury_data as data
from .history import PERIODS
from .sap_guidance import PROVENANCE
from .store import Denied

DISPLAY_CCY = "USD"
RATE_TYPE = "M (synthetic average rate)"


def check_period(period: str) -> str:
    if period not in PERIODS:
        raise Denied("NO DATA AVAILABLE FOR THIS PERIOD. The synthetic treasury data covers December 2025 through November 2026.")
    return period


def position(period: str) -> dict:
    check_period(period)
    rows = data.account_rows(period)
    accounts, by_bank, by_ccy = [], defaultdict(int), defaultdict(lambda: {"opening": 0, "closing": 0})
    for row in rows:
        closing = row["opening"] + row["receipts"] - row["payments"]
        if closing < row["min"]:
            status = "DEFICIT"
        elif row["opening"] > data.POLICY["idle_multiple"] * row["target"]:
            status = "IDLE_CASH"
        else:
            status = "WITHIN_POLICY"
        mismatch = row["prior_closing"] - row["opening"]
        usd_open, usd_close = data.to_usd(row["opening"], row["ccy"], period), data.to_usd(closing, row["ccy"], period)
        accounts.append({
            **{k: row[k] for k in ("id", "entity", "bank", "ccy", "kind", "min", "target", "opening", "receipts", "payments")},
            "bank_name": data.BANKS[row["bank"]], "expected_closing": closing, "status": status,
            "shortfall": max(0, row["min"] - closing), "above_target": max(0, closing - row["target"]),
            "usd_opening": usd_open, "usd_closing": usd_close,
            "statement": {"complete": row["statement_gap_days"] == 0, "gap_days": row["statement_gap_days"], "last_statement": row["last_statement"],
                          "opening_check": "OK" if mismatch == 0 else "MISMATCH", "opening_difference": -mismatch},
        })
        by_bank[row["bank"]] += usd_open
        by_ccy[row["ccy"]]["opening"] += row["opening"]
        by_ccy[row["ccy"]]["closing"] += closing
    total = sum(by_bank.values())
    banks = [{"bank": b, "name": data.BANKS[b], "usd_balance": v, "share_pct": round(100 * v / total, 1) if total else 0.0} for b, v in sorted(by_bank.items())]
    result = {
        "period": period, "as_of": data.as_of(period).isoformat(), "display_currency": DISPLAY_CCY, "exchange_rate_type": RATE_TYPE,
        "fx": {c: data.fx_rate(c, period) for c in data.BASE_FX}, "provenance": PROVENANCE, "policy": data.POLICY,
        "accounts": accounts, "banks": banks,
        "totals": {"usd_opening": total, "usd_closing": sum(a["usd_closing"] for a in accounts),
                   "by_currency": {c: dict(v) for c, v in by_ccy.items()},
                   "deficit": sum(1 for a in accounts if a["status"] == "DEFICIT"), "idle": sum(1 for a in accounts if a["status"] == "IDLE_CASH"),
                   "within_policy": sum(1 for a in accounts if a["status"] == "WITHIN_POLICY"), "accounts": len(accounts)},
    }
    result["policy_checks"] = policy_checks(result)
    result["statements"] = statement_check(result)
    return result


def statement_check(pos: dict) -> dict:
    missing = [a["id"] for a in pos["accounts"] if not a["statement"]["complete"]]
    mismatched = [{"account": a["id"], "difference": a["statement"]["opening_difference"], "ccy": a["ccy"]} for a in pos["accounts"] if a["statement"]["opening_check"] == "MISMATCH"]
    return {"expected": len(pos["accounts"]), "complete": len(pos["accounts"]) - len(missing), "missing": missing, "opening_mismatches": mismatched,
            "ready": not missing and not mismatched}


def policy_checks(pos: dict) -> list[dict]:
    accounts, limit = pos["accounts"], data.POLICY["concentration_limit_pct"]
    deficits = [a["id"] for a in accounts if a["status"] == "DEFICIT"]
    overdrafts = [a["id"] for a in accounts if a["expected_closing"] < 0]
    idle = [a["id"] for a in accounts if a["status"] == "IDLE_CASH"]
    over = [f"{b['name']} {b['share_pct']}%" for b in pos["banks"] if b["share_pct"] > limit]
    stmt = [a["id"] for a in accounts if not a["statement"]["complete"]]
    openmis = [a["id"] for a in accounts if a["statement"]["opening_check"] == "MISMATCH"]
    def row(rule, text, bad, detail_ok):
        return {"rule": rule, "text": text, "status": "BREACH" if bad else "PASS", "detail": ", ".join(bad) if bad else detail_ok}
    return [row("P1", data.POLICY["min_balance"], deficits, "All accounts close at or above their minimum."),
            row("P2", data.POLICY["no_overdraft"], overdrafts, "No account closes below zero."),
            row("P3", data.POLICY["concentration"], over, "No bank is above the limit."),
            row("P4", data.POLICY["idle"], idle, "No idle cash found."),
            row("P5", data.POLICY["statements"], stmt, "All statements received."),
            row("P6", data.POLICY["opening_balance"], openmis, "All opening balances agree with the prior closing.")]


def transfer_templates(period: str) -> list[dict]:
    check_period(period)
    return [{"template": t, "from": f, "to": to, "ccy": c, "max_amount": m, "name": n} for t, f, to, c, m, n in data.TEMPLATES]


def recommendations(period: str) -> dict:
    """Cover each deficit up to the policy minimum from same-currency accounts with cash above target, using only templates.
    Whatever a template cannot cover is reported as unfunded; it is never invented."""
    pos = position(period)
    accounts = {a["id"]: a for a in pos["accounts"]}
    available = {a["id"]: a["above_target"] for a in pos["accounts"]}
    recs, unfunded = [], []
    for deficit in sorted((a for a in pos["accounts"] if a["status"] == "DEFICIT"), key=lambda a: -a["shortfall"]):
        need = -(-deficit["shortfall"] // 1000) * 1000
        sources = sorted((t for t in data.TEMPLATES if t[2] == deficit["id"]), key=lambda t: -available.get(t[1], 0))
        for template, src, dst, ccy, cap, name in sources:
            take = min(need, available.get(src, 0), cap)
            if take <= 0:
                continue
            available[src] -= take
            need -= take
            flagged = [x for x in (src, dst) if not accounts[x]["statement"]["complete"] or accounts[x]["statement"]["opening_check"] != "OK"]
            recs.append({"caveat": ("Check the bank statement of " + ", ".join(flagged) + " before approving: its balance is not fully verified.") if flagged else None, "template": template, "template_name": name, "from_account": src, "to_account": dst, "ccy": ccy, "amount": take,
                         "usd_amount": data.to_usd(take, ccy, period), "reason": f"{dst} is expected to close {deficit['shortfall']:,} {ccy} below its minimum of {deficit['min']:,}.",
                         "policy_rule": "P1 minimum balance", "from_above_target_after": available[src]})
            if need <= 0:
                break
        if need > 0:
            unfunded.append({"account": deficit["id"], "ccy": deficit["ccy"], "remaining": need, "reason": "No template funds this account with enough cash above target. A person must decide how to cover it."})
    for i, rec in enumerate(recs, start=1):
        rec["payload_hash"] = proposal_hash(period, rec)
        rec["proposal_id"] = f"TP-{period}-{i:02d}-{rec['payload_hash'][:6]}"  # a changed recommendation gets a new id, never a decided one's
    return {"period": period, "recommendations": recs, "unfunded": unfunded, "covered": sum(1 for _ in recs)}


def proposal_hash(period: str, rec: dict) -> str:
    payload = {k: rec[k] for k in ("template", "from_account", "to_account", "ccy", "amount")}
    return hashlib.sha256(json.dumps({"period": period, **payload}, sort_keys=True).encode()).hexdigest()


def forecast(period: str, horizon_days: int = 30) -> dict:
    """Projected balance by currency after the as-of date. Receipts move to their predicted date (observed payment
    behaviour); the scheduled-date series is kept so the effect of that behaviour is visible."""
    check_period(period)
    if horizon_days not in (7, 30, 90):
        raise Denied("Horizon must be 7, 30 or 90 days.")
    pos = position(period)
    start = data.as_of(period)
    end = start + timedelta(days=horizon_days)
    items = [i for i in data.forecast_items(period, 90) if date.fromisoformat(i["scheduled"]) <= end or date.fromisoformat(i["predicted"]) <= end]
    opening = {c: v["closing"] for c, v in pos["totals"]["by_currency"].items()}
    minimum = defaultdict(int)
    for a in pos["accounts"]:
        minimum[a["ccy"]] += a["min"]
    days = [start + timedelta(days=k) for k in range(1, horizon_days + 1)]

    def series(key):
        net = defaultdict(lambda: defaultdict(int))
        for it in items:
            net[it["ccy"]][it[key]] += it["amount"]
        out = {}
        for ccy, balance in opening.items():
            run, rows = balance, []
            for d in days:
                run += net[ccy].get(d.isoformat(), 0)
                rows.append({"date": d.isoformat(), "balance": run})
            out[ccy] = rows
        return out

    predicted, scheduled = series("predicted"), series("scheduled")
    by_ccy = []
    for ccy, rows in predicted.items():
        first = next((r for r in rows if r["balance"] < minimum[ccy]), None)
        sched_first = next((r for r in scheduled[ccy] if r["balance"] < minimum[ccy]), None)
        by_ccy.append({"ccy": ccy, "opening": opening[ccy], "closing": rows[-1]["balance"], "net": rows[-1]["balance"] - opening[ccy], "minimum_required": minimum[ccy],
                       "lowest": min(r["balance"] for r in rows), "first_shortfall": first, "first_shortfall_if_paid_on_due_date": sched_first,
                       "scheduled_closing": scheduled[ccy][-1]["balance"]})
    usd = [{"date": d.isoformat(), "balance": sum(data.to_usd(predicted[c][i]["balance"], c, period) for c in predicted)} for i, d in enumerate(days)]
    flows = defaultdict(lambda: defaultdict(int))
    for it in items:
        if date.fromisoformat(it["predicted"]) <= end:
            flows[it["flow_type"]][it["ccy"]] += it["amount"]
    by_flow = [{"flow_type": f, "name": data.FLOW_TYPES[f][0], "liquidity_item": data.FLOW_TYPES[f][1], "planning_level": data.FLOW_TYPES[f][2],
                "by_currency": dict(v), "usd": sum(data.to_usd(a, c, period) for c, a in v.items())} for f, v in sorted(flows.items())]
    return {"period": period, "as_of": start.isoformat(), "horizon_days": horizon_days, "provenance": PROVENANCE, "by_currency": by_ccy, "usd_series": usd,
            "by_flow_type": by_flow, "payment_behaviour": [{"segment": s, "days_late": d} for s, d in data.PAYMENT_BEHAVIOUR],
            "shortfall": any(r["first_shortfall"] for r in by_ccy),
            "basis": "Opening = expected closing of every account on the as-of day. Receipts shifted by observed payment behaviour. Shortfall = projected balance below the sum of account minimums in that currency."}


def banks(period: str) -> dict:
    pos = position(period)
    share = {b["bank"]: b for b in pos["banks"]}
    rows = []
    for row in data.bank_rows(period):
        usd_open = share[row["bank"]]["usd_balance"]
        fees = sum(row["fees_usd"].values())
        rows.append({**row, "usd_balance": usd_open, "share_pct": share[row["bank"]]["share_pct"], "avg_balance_usd": round(usd_open * row["avg_balance_factor"]),
                     "accounts": [a["id"] for a in pos["accounts"] if a["bank"] == row["bank"]], "fees_total_usd": fees,
                     "fee_per_payment_usd": round(fees / row["payment_count"], 2) if row["payment_count"] else 0.0,
                     "credit_available": row["credit_line_limit"] - row["credit_line_drawn"]})
    limit = data.POLICY["concentration_limit_pct"]
    return {"period": period, "display_currency": DISPLAY_CCY, "provenance": PROVENANCE, "banks": rows,
            "totals": {"fees_usd": sum(r["fees_total_usd"] for r in rows), "borrowings": sum(r["borrowings"] for r in rows),
                       "investments": sum(r["investments"] for r in rows), "credit_drawn": sum(r["credit_line_drawn"] for r in rows),
                       "credit_limit": sum(r["credit_line_limit"] for r in rows)},
            "over_concentration_limit": [r["name"] for r in rows if r["share_pct"] > limit], "concentration_limit_pct": limit}


def view(period: str) -> dict:
    """Everything the Level 1 cash and treasury screen and the detail dialog need for one period."""
    pos = position(period)
    return {"period": period, "position": pos, "forecast": {str(h): forecast(period, h) for h in (7, 30, 90)}, "banks": banks(period),
            "recommendations": recommendations(period), "templates": transfer_templates(period)}
