"""Deterministic synthetic data for the Cash and Treasury Assistant demo.

Nothing here comes from SAP or a bank. Every account, balance, bank, rate, credit line and cash flow is invented, and
the generator is a pure function of the period (a hash, not a random number generator), so every run gives the same
result. The shape follows what SAP describes for cash positioning, cash forecasting and bank relationships:
bank accounts with opening balances and expected daily flows, bank statements, flow types and liquidity items,
bank transfer templates, treasury policy rules, and per-bank credit lines, borrowings, investments, volumes and fees.

Seeded situations (deficit, idle cash, missing statement, opening-balance mismatch) are listed in SEEDS so the
demo has something to find; the status of every account is still computed from the numbers, never read from SEEDS.
"""
from __future__ import annotations

import calendar
import hashlib
from datetime import date, timedelta

from .history import PERIODS

ENTITIES = {
    "1000": {"name": "Synthetic US Inc", "ccy": "USD", "scale": 1.0},
    "2000": {"name": "Synthetic DE GmbH", "ccy": "EUR", "scale": 0.55},
    "3000": {"name": "Synthetic CH AG", "ccy": "CHF", "scale": 0.25},
}
BANKS = {"BNK-A": "Bank Alpha", "BNK-B": "Bank Bravo", "BNK-C": "Bank Charlie", "BNK-D": "Bank Delta"}
BASE_FX = {"USD": 1.0, "EUR": 1.10, "CHF": 1.15}  # synthetic rates to the USD display currency

# id, entity, bank, currency, kind, minimum balance, target balance (policy, in account currency)
ACCOUNTS = [
    ("1000-OP", "1000", "BNK-A", "USD", "Operating", 400_000, 1_200_000),
    ("1000-PAY", "1000", "BNK-A", "USD", "Payroll", 250_000, 600_000),
    ("1000-COL", "1000", "BNK-B", "USD", "Collections", 100_000, 800_000),
    ("1000-RES", "1000", "BNK-C", "USD", "Reserve", 500_000, 2_000_000),
    ("2000-OP", "2000", "BNK-B", "EUR", "Operating", 300_000, 900_000),
    ("2000-PAY", "2000", "BNK-D", "EUR", "Payroll", 200_000, 450_000),
    ("2000-COL", "2000", "BNK-D", "EUR", "Collections", 80_000, 600_000),
    ("3000-OP", "3000", "BNK-D", "CHF", "Operating", 150_000, 500_000),
    ("3000-RES", "3000", "BNK-D", "CHF", "Reserve", 200_000, 800_000),
]

# Situations planted per period, by account. Computed statuses decide what the UI shows.
SEEDS = {
    "2025-12": {},
    "2026-01": {"2000-COL": "stmt_missing", "1000-RES": "idle"},
    "2026-02": {"3000-RES": "idle"},
    "2026-03": {"1000-PAY": "deficit"},
    "2026-04": {"2000-PAY": "deficit", "1000-COL": "opening_mismatch"},
    "2026-05": {"1000-RES": "idle", "3000-RES": "idle"},
    "2026-06": {"1000-OP": "deficit", "3000-OP": "stmt_missing"},
    "2026-07": {},
    "2026-08": {"2000-OP": "deficit", "2000-COL": "deficit"},
    "2026-09": {"1000-RES": "idle"},
    "2026-10": {"3000-OP": "deficit"},
    "2026-11": {"1000-PAY": "deficit", "2000-PAY": "deficit", "2000-COL": "stmt_missing", "1000-COL": "opening_mismatch", "1000-RES": "idle"},
}

# bank transfer templates (SAP: bank transfer templates define the allowed from/to pairs)
TEMPLATES = [
    ("TT-01", "1000-RES", "1000-PAY", "USD", 600_000, "Reserve to payroll"),
    ("TT-02", "1000-RES", "1000-OP", "USD", 600_000, "Reserve to operating"),
    ("TT-03", "1000-COL", "1000-OP", "USD", 400_000, "Collections sweep to operating"),
    ("TT-04", "2000-COL", "2000-PAY", "EUR", 300_000, "Collections to payroll"),
    ("TT-05", "2000-COL", "2000-OP", "EUR", 300_000, "Collections to operating"),
    ("TT-06", "3000-RES", "3000-OP", "CHF", 250_000, "Reserve to operating"),
]

POLICY = {
    "min_balance": "Every account stays at or above its minimum balance.",
    "no_overdraft": "No account may close below zero.",
    "concentration_limit_pct": 40,
    "concentration": "No single bank holds more than 40% of group cash (USD equivalent).",
    "idle_multiple": 1.5,
    "idle": "Cash above 1.5 times the account target is idle and can be moved.",
    "statements": "A bank statement is expected for every account every business day.",
    "opening_balance": "An account's opening balance equals the prior day's closing balance on its statement.",
    "approval": "A person approves every transfer proposal. Agents never initiate a bank transfer.",
}

FLOW_TYPES = {
    "FT-AR": ("Customer receipts (AR)", "LI-100 Operating receipts", "PL-SUB Subledger"),
    "FT-AP": ("Vendor payments (AP)", "LI-200 Operating payments", "PL-SUB Subledger"),
    "FT-PAY": ("Payroll", "LI-210 Personnel", "PL-PLAN Planned"),
    "FT-TAX": ("Taxes", "LI-220 Taxes and duties", "PL-PLAN Planned"),
    "FT-DEBT": ("Debt service", "LI-300 Financing", "PL-PLAN Planned"),
    "FT-IC": ("Intercompany settlement", "LI-400 Intercompany", "PL-SUB Subledger"),
    "FT-CAPEX": ("Capital expenditure", "LI-250 Investment", "PL-PLAN Planned"),
}
# actual payment behaviour (days later than the due date); the forecast uses it to shift expected receipts
PAYMENT_BEHAVIOUR = [("Large corporates", 6), ("Mid-market", 3), ("Small customers", 1)]


def _u(*parts) -> float:
    digest = hashlib.sha256("|".join(str(p) for p in parts).encode()).digest()
    return int.from_bytes(digest[:6], "big") / 2 ** 48


def period_index(period: str) -> int:
    return PERIODS.index(period)


def fx_rate(ccy: str, period: str) -> float:
    return round(BASE_FX[ccy] * (1 + 0.003 * ((period_index(period) * 7) % 5 - 2)), 4) if ccy != "USD" else 1.0


def to_usd(amount: int, ccy: str, period: str) -> int:
    return round(amount * fx_rate(ccy, period))


def as_of(period: str) -> date:
    year, month = map(int, period.split("-"))
    day = date(year, month, calendar.monthrange(year, month)[1])
    while day.weekday() >= 5:
        day -= timedelta(days=1)
    return day


def next_business_day(day: date) -> date:
    day += timedelta(days=1)
    while day.weekday() >= 5:
        day += timedelta(days=1)
    return day


def account_rows(period: str) -> list[dict]:
    """Opening balance, expected flows for the as-of day, bank statement facts and prior-day closing, per account."""
    seeds = SEEDS[period]
    day = as_of(period)
    rows = []
    for account_id, entity, bank, ccy, kind, minimum, target in ACCOUNTS:
        receipts = round(target * 0.05 * (0.6 + _u(period, account_id, "r")), -3)
        payments = round(target * 0.06 * (0.5 + _u(period, account_id, "p")), -3)
        seed = seeds.get(account_id)
        if seed == "deficit":
            closing = round(minimum * (0.55 + 0.25 * _u(period, account_id, "d")), -3)
            opening = closing - receipts + payments
        elif seed == "idle":
            opening = round(target * (1.7 + 0.4 * _u(period, account_id, "i") + (0.9 if period == "2026-11" else 0)), -3)  # November: a large idle reserve
        elif kind in ("Collections", "Reserve"):
            # source accounts normally hold some cash above target but below the idle threshold
            opening = round(target * (1.05 + 0.4 * _u(period, account_id, "o")), -3)
        else:
            low, high = minimum * 1.35 + payments, target * 1.25
            opening = round(low + (high - low) * _u(period, account_id, "o"), -3)
        opening = int(opening)
        prior_closing = opening
        if seed == "opening_mismatch":
            prior_closing = opening + int(round(8_000 + 12_000 * _u(period, account_id, "m"), -2))
        gap_days = 2 if seed == "stmt_missing" else 0
        last_statement = day
        for _ in range(gap_days):
            last_statement -= timedelta(days=1)
            while last_statement.weekday() >= 5:
                last_statement -= timedelta(days=1)
        rows.append({"id": account_id, "entity": entity, "bank": bank, "ccy": ccy, "kind": kind, "min": minimum, "target": target,
                     "opening": opening, "receipts": int(receipts), "payments": int(payments), "prior_closing": prior_closing,
                     "statement_gap_days": gap_days, "last_statement": last_statement.isoformat()})
    return rows


def forecast_items(period: str, days: int = 90) -> list[dict]:
    """Expected cash flows after the as-of date, by entity, with flow type, liquidity item and planning level.
    'scheduled' is the due date; 'predicted' shifts customer receipts by the entity's observed payment behaviour."""
    start = as_of(period)
    idx = period_index(period)
    drift = (0.92 + 0.16 * _u(period, "ar-trend")) * (0.8 if any(v == "deficit" for v in SEEDS[period].values()) else 1.0)  # tight periods collect less
    items = []
    for entity, meta in ENTITIES.items():
        ccy, scale = meta["ccy"], meta["scale"]
        shift = 1 + round(5 * _u(entity, "behaviour"))
        day = start
        for k in range(1, days + 1):
            day = start + timedelta(days=k)
            if day.weekday() >= 5:
                continue
            ar = round(scale * 74_000 * drift * (0.6 + _u(period, entity, k, "ar")), -2)
            ap = round(scale * 56_000 * (0.7 + _u(period, entity, k, "ap")), -2)
            items.append(_item(day, entity, ccy, "FT-AR", int(ar), shift))
            items.append(_item(day, entity, ccy, "FT-AP", -int(ap), 0))
            if day.day in (25, 26) and (day.day == 25 or (day - timedelta(days=1)).weekday() >= 5):
                items.append(_item(day, entity, ccy, "FT-PAY", -int(round(scale * 430_000, -3)), 0))
            if day.day in (20, 21) and (day.day == 20 or (day - timedelta(days=1)).weekday() >= 5):
                items.append(_item(day, entity, ccy, "FT-TAX", -int(round(scale * 175_000, -3)), 0))
            if day.day in (15, 16) and entity != "3000" and (day.day == 15 or (day - timedelta(days=1)).weekday() >= 5):
                items.append(_item(day, entity, ccy, "FT-DEBT", -int(round(scale * 240_000, -3)), 0))
            if day.day == 28 or (day.day in (29, 30) and (day - timedelta(days=1)).weekday() >= 5 and day.day - 1 == 28):
                sign = 1 if _u(period, entity, day.month, "ic") > 0.5 else -1
                items.append(_item(day, entity, ccy, "FT-IC", sign * int(round(scale * 90_000, -3)), 0))
        capex_day = start + timedelta(days=30 + int(20 * _u(period, entity, "capex")))
        while capex_day.weekday() >= 5:
            capex_day += timedelta(days=1)
        if idx % 3 == 0 and entity != "3000":
            items.append(_item(capex_day, entity, ccy, "FT-CAPEX", -int(round(scale * 280_000, -3)), 0))
    return items


def _item(day: date, entity: str, ccy: str, flow: str, amount: int, shift: int) -> dict:
    name, liquidity_item, level = FLOW_TYPES[flow]
    predicted = day
    for _ in range(shift):
        predicted = next_business_day(predicted)
    return {"entity": entity, "ccy": ccy, "flow_type": flow, "flow_name": name, "liquidity_item": liquidity_item, "planning_level": level,
            "amount": amount, "scheduled": day.isoformat(), "predicted": predicted.isoformat()}


def bank_rows(period: str) -> list[dict]:
    """Per-bank relationship facts: credit line, borrowings, investments, monthly payment volume and fees (USD)."""
    idx = period_index(period)
    base = {"BNK-A": (5_000_000, 1_200_000, 3_000_000, 4.9, 600_000), "BNK-B": (3_000_000, 0, 0, 0.0, 400_000),
            "BNK-C": (2_000_000, 0, 1_500_000, 5.4, 1_000_000), "BNK-D": (1_500_000, 250_000, 0, 6.1, 0)}
    rows = []
    for bank_id, name in BANKS.items():
        limit, drawn, loans, rate, deposits = base[bank_id]
        volume_count = int(round(180 + 520 * _u(bank_id, "vol", "count") + 15 * idx))
        volume_amount = int(round(volume_count * (9_000 + 6_000 * _u(bank_id, period, "vol"))))
        fees = {"Account maintenance": int(round(1_200 + 900 * _u(bank_id, "maint"), -1)),
                "Payment processing": int(round(volume_count * (1.4 + 1.6 * _u(bank_id, "pay")), -1)),
                "FX and other": int(round(400 + 1_600 * _u(bank_id, period, "fx"), -1))}
        rows.append({"bank": bank_id, "name": name, "credit_line_limit": limit, "credit_line_drawn": int(drawn * (0.9 + 0.2 * _u(bank_id, period, "draw"))),
                     "borrowings": loans, "borrowing_rate_pct": rate, "investments": int(deposits * (0.95 + 0.1 * _u(bank_id, period, "inv"))),
                     "payment_count": volume_count, "payment_volume_usd": volume_amount, "fees_usd": fees,
                     "avg_balance_factor": round(0.9 + 0.2 * _u(bank_id, period, "avg"), 3)})
    return rows
