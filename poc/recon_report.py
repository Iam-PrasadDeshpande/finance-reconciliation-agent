"""Detailed synthetic reconciliation report for one close period.

Everything here is deterministic and derived from the seeded synthetic history. Account
lines, reconciling items and aging are computed so that they add up exactly to the
period's S/4HANA versus Central Finance variance. SAP transaction names are references
for realism only: nothing here calls SAP, and the demo never posts.
"""
from __future__ import annotations

import calendar
from datetime import date, timedelta

from .history import ACCOUNTS, PERIODS, VARIANCES
from .store import Denied, Store

TOLERANCE = 1000
MEDIUM = 2500
HIGH = 10000

ACCOUNT_NAMES = {
    "110000": "Cash and bank",
    "120000": "Trade receivables",
    "210000": "GR/IR clearing",
    "310000": "Accrued liabilities",
    "410000": "Revenue",
    "510000": "Operating expense",
}

# category -> label, reason code, account, document type, typical action, owner, AI confidence,
# SAP reference (simulated, not invoked), whether the AI treats it as explained.
CATEGORIES = {
    "timing_cutoff": dict(label="Cut-off / timing", reason="RC-TIM", account="210000", doc_type="WE",
        action="Confirm the posting date with Procurement. The item should clear in the next period.", owner="GL accountant",
        confidence=0.93, ref="FAGLL03 line-item display", explained=True,
        rationale="Goods receipt posted on the last working day; the matching invoice is expected in the next period. Pattern matches earlier cut-off items."),
    "replication_gap": dict(label="Not replicated to Central Finance", reason="RC-REP", account="110000", doc_type="SA",
        action="Check the mapping, then reprocess the document in AIF. Re-run the comparison after replication.", owner="Finance systems",
        confidence=0.88, ref="/AIF/ERR error handling", explained=True,
        rationale="Document exists in S/4HANA and is in a reprocessable AIF state. Amount equals the difference, so a single reprocess is the likely fix."),
    "mapping_conflict": dict(label="Account mapping conflict", reason="RC-MAP", account="310000", doc_type="SA",
        action="Correct the Central Finance mapping, reprocess and re-compare. Review similar documents.", owner="Finance systems",
        confidence=0.61, ref="Central Finance mapping check", explained=False,
        rationale="Document replicated to a different account than in S/4HANA. Confidence is low because more than one mapping rule could explain it."),
    "fx_revaluation": dict(label="FX revaluation difference", reason="RC-FXR", account="120000", doc_type="DR",
        action="Compare the translation rates for the two ledgers and document the rate source.", owner="Treasury accountant",
        confidence=0.9, ref="FAGL_FCV foreign-currency valuation", explained=True,
        rationale="Difference is within the revaluation range of the open receivable. Rate dates differ by one day."),
    "duplicate_posting": dict(label="Duplicate replication", reason="RC-DUP", account="410000", doc_type="DR",
        action="Reverse the duplicate in Central Finance after the owner confirms.", owner="Finance systems",
        confidence=0.74, ref="Central Finance duplicate check", explained=False,
        rationale="Two replicated documents share an amount and reference. One is probably a retry, but a legitimate repeat cannot be excluded."),
    "unexplained": dict(label="Unexplained difference", reason="RC-UNX", account="110000", doc_type="SA",
        action="Compare the document lists in S/4HANA and Central Finance for the period and find the missing or changed document.", owner="GL accountant",
        confidence=0.0, ref="FAGLL03 line-item display", explained=False,
        rationale="No seeded item explains this difference."),
    "intercompany": dict(label="Intercompany mismatch", reason="RC-ICO", account="120000", doc_type="KR",
        action="Ask the partner company to confirm and align the intercompany document.", owner="Intercompany accountant",
        confidence=0.58, ref="Intercompany reconciliation", explained=False,
        rationale="Partner entity posted a different amount. Cannot be explained from this company code's data alone."),
}

# Variance patterns for non-zero periods: [(category, weight)], weights sum to 1.0. A weight above 1
# with a negative partner models gross items that partly offset.
PATTERNS = [
    [("timing_cutoff", 1.0)],
    [("replication_gap", 1.0)],
    [("timing_cutoff", 0.6), ("fx_revaluation", 0.4)],
    [("mapping_conflict", 0.7), ("timing_cutoff", 0.3)],
    [("replication_gap", 1.2), ("duplicate_posting", -0.2)],
    [("intercompany", 0.5), ("fx_revaluation", 0.5)],
]


def _period_end(period: str) -> date:
    year, month = map(int, period.split("-"))
    return date(year, month, calendar.monthrange(year, month)[1])


def _split(total: int, weights):
    amounts = [round(total * w) for w in weights[:-1]]
    amounts.append(total - sum(amounts))
    return amounts


def _items_for(store: Store, period: str, variance: int):
    end = _period_end(period)
    if variance == 0:
        return []
    if period == "2026-11":
        docs = store.comparison_documents(period)
        rows = [d for d in docs if d["s4_amount"] != d["cfin_amount"]]
        built = []
        for index, doc in enumerate(rows):
            built.append(dict(category="replication_gap", document_id=doc["document_id"], s4=doc["s4_amount"], cfin=doc["cfin_amount"],
                              aif=doc["aif_status"], mapping=doc["mapping_status"], posted=end - timedelta(days=2 + index)))
        return built
    pattern = PATTERNS[PERIODS.index(period) % len(PATTERNS)]
    amounts = _split(variance, [w for _, w in pattern])
    built = []
    for index, ((category, _), amount) in enumerate(zip(pattern, amounts)):
        age = {"timing_cutoff": 1, "replication_gap": 2, "fx_revaluation": 3, "mapping_conflict": 38, "duplicate_posting": 6, "intercompany": 12}[category]
        built.append(dict(category=category, document_id=f"SYN-{period.replace('-', '')}-{index + 1:02d}", s4=abs(amount) + 40000 * (index + 1) if amount > 0 else 40000,
                          cfin=(abs(amount) + 40000 * (index + 1)) - amount if amount > 0 else 40000 + abs(amount), aif="ready_for_reprocess" if category == "replication_gap" else "replicated",
                          mapping="conflict" if category == "mapping_conflict" else "mapped", posted=end - timedelta(days=age)))
    return built


def _materiality(amount: int) -> str:
    size = abs(amount)
    return "high" if size >= HIGH else "medium" if size >= MEDIUM else "low"


def _bucket(age: int) -> str:
    return "0-7 days" if age <= 7 else "8-30 days" if age <= 30 else "31-60 days" if age <= 60 else "over 60 days"


BUCKETS = ["0-7 days", "8-30 days", "31-60 days", "over 60 days"]


def build_report(store: Store, period: str, case: dict | None = None, events: list | None = None) -> dict:
    if period not in PERIODS:
        raise Denied("No synthetic finance history for requested period")
    index = PERIODS.index(period)
    variance = VARIANCES[index]
    end = _period_end(period)
    overview = next(p for p in store.history_overview() if p["period"] == period)["sources"]
    detail = store.history_detail(period)
    s4_rows = {r["account"]: r["balance"] for r in detail["balances"] if r["source"] == "s4"}
    s4_total = overview["s4"]["balance"]
    cfin_total = overview["cfin"]["balance"]
    # The stored fixtures are authoritative for totals; mutated fixtures change the variance.
    variance = s4_total - cfin_total

    raw = _items_for(store, period, variance)
    if raw and sum(r["s4"] - r["cfin"] for r in raw) != variance:
        # A mutated balance means the seeded items no longer explain the difference; add an
        # honest unexplained residual rather than forcing the report to balance.
        raw.append(dict(category="unexplained", document_id=f"SYN-{period.replace('-', '')}-RESIDUAL", s4=variance - sum(r["s4"] - r["cfin"] for r in raw),
                        cfin=0, aif="not_applicable", mapping="unknown", posted=end))
    elif not raw and variance:
        raw.append(dict(category="unexplained", document_id=f"SYN-{period.replace('-', '')}-RESIDUAL", s4=variance, cfin=0, aif="not_applicable", mapping="unknown", posted=end))

    items = []
    for number, row in enumerate(raw, start=1):
        meta = CATEGORIES[row["category"]]
        diff = row["s4"] - row["cfin"]
        age = (end - row["posted"]).days
        residual = row["document_id"].endswith("RESIDUAL")
        explained = meta["explained"] and not residual
        items.append({
            "item_id": f"{period}-I{number:02d}", "document_id": row["document_id"], "document_type": meta["doc_type"], "account": meta["account"],
            "account_name": ACCOUNT_NAMES[meta["account"]], "posting_date": row["posted"].isoformat(), "age_days": age, "aging_bucket": _bucket(age),
            "s4_amount": row["s4"], "cfin_amount": row["cfin"], "difference": diff, "materiality": _materiality(diff),
            "category": row["category"], "category_label": meta["label"], "reason_code": meta["reason"], "aif_status": row["aif"], "mapping_status": row["mapping"],
            "status": "explained" if explained else "needs_review", "owner": meta["owner"], "recommended_action": meta["action"],
            "sap_reference": f"{meta['ref']} (simulated, not invoked)",
            "ai": {"classification": meta["label"], "confidence": meta["confidence"] if not residual else 0.0,
                   "rationale": meta["rationale"] if not residual else "The stored balances changed after the seeded items were built. No item explains the remaining difference, so it needs a person to investigate.",
                   "basis": "Synthetic rule-based classification, advisory only"},
        })

    # Account view: S/4 from the history table, Central Finance derived from item differences.
    account_diff = {a: 0 for a in ACCOUNTS}
    account_items = {a: 0 for a in ACCOUNTS}
    for item in items:
        account_diff[item["account"]] += item["difference"]
        account_items[item["account"]] += 1
    accounts = []
    for account in ACCOUNTS:
        s4 = s4_rows.get(account, 0)
        cfin = s4 - account_diff[account]
        status = "matched" if account_diff[account] == 0 else "within_tolerance" if abs(account_diff[account]) <= TOLERANCE else "variance"
        accounts.append({"account": account, "name": ACCOUNT_NAMES[account], "s4_balance": s4, "cfin_balance": cfin, "difference": account_diff[account],
                         "open_items": account_items[account], "status": status})

    unexplained = sum(i["difference"] for i in items if i["status"] == "needs_review")
    explained = variance - unexplained
    stale = [name for name, src in overview.items() if src["freshness"] != "current"]
    if stale:
        status, status_text = "HOLD", "Source data is stale, so the comparison is not reliable yet."
    elif variance == 0:
        status, status_text = "BALANCED", "S/4HANA and Central Finance agree. No reconciling items."
    elif abs(variance) <= TOLERANCE:
        status, status_text = "WITHIN_TOLERANCE", "The difference is within the tolerance and can be accepted with a note."
    elif unexplained == 0:
        status, status_text = "EXPLAINED", "Every difference is explained. A separate finance approval is still needed to proceed."
    else:
        status, status_text = "EXCEPTION", "Part of the difference is not explained and needs investigation."

    bridge = [{"label": "S/4HANA balance", "value": s4_total, "kind": "total"}]
    by_category = {}
    for item in items:
        by_category[item["category_label"]] = by_category.get(item["category_label"], 0) - item["difference"]
    bridge += [{"label": label, "value": value, "kind": "step"} for label, value in by_category.items()]
    bridge.append({"label": "Central Finance balance", "value": cfin_total, "kind": "total"})

    aging = [{"bucket": b, "count": sum(1 for i in items if i["aging_bucket"] == b), "amount": sum(i["difference"] for i in items if i["aging_bucket"] == b)} for b in BUCKETS]

    mapping_conflicts = any(i["category"] == "mapping_conflict" for i in items)
    controls = [
        {"id": "C1", "name": "All four sources returned data", "status": "PASS", "detail": "S/4HANA, Central Finance, BW and Databricks snapshots exist for the period."},
        {"id": "C2", "name": "Sources are current", "status": "PASS" if not stale else "HOLD", "detail": "All sources are current." if not stale else f"Stale source: {', '.join(stale)}."},
        {"id": "C3", "name": "Same company code, ledger, currency and period", "status": "PASS", "detail": "1000 / 0L / USD for every source."},
        {"id": "C4", "name": "Account mapping valid", "status": "HOLD" if mapping_conflicts else "PASS", "detail": "A mapping conflict is open." if mapping_conflicts else "No mapping conflict found."},
        {"id": "C5", "name": "Difference within tolerance or fully explained", "status": "PASS" if variance == 0 or abs(variance) <= TOLERANCE or unexplained == 0 else "HOLD",
         "detail": f"Tolerance ${TOLERANCE:,}. Unexplained ${abs(unexplained):,}."},
        {"id": "C6", "name": "Approval separate from preparation", "status": "PASS", "detail": "The demo enforces a separate approver role before any local marker."},
        {"id": "C7", "name": "No SAP write by the agent", "status": "PASS", "detail": "SAP access is simulated and read-only."},
        {"id": "C8", "name": "Backend user authorization", "status": "NOT_VERIFIED", "detail": "Synthetic roles only. No SAP tenant is connected."},
        {"id": "C9", "name": "Evidence retained", "status": "PASS" if events else "NOT_VERIFIED", "detail": f"{len(events)} stored events for the case." if events else "Run the case to attach the stored event trail."},
    ]
    actions = []
    for item in sorted(items, key=lambda i: (i["status"] != "needs_review", -abs(i["difference"]))):
        actions.append({"priority": len(actions) + 1, "item_id": item["item_id"], "owner": item["owner"], "action": item["recommended_action"],
                        "due": (end + timedelta(days=1 if item["materiality"] == "high" else 3)).isoformat(), "amount": item["difference"]})
    stamps = {}
    for row in detail["balances"]:
        stamps.setdefault(row["source"], row["timestamp_utc"])
    timeline = []
    for name, label in (("s4", "S/4HANA ledger snapshot"), ("cfin", "Central Finance replication check"), ("bw", "BW/4HANA load check"), ("databricks", "Databricks pipeline check")):
        timeline.append({"step": label, "source": name, "freshness": overview[name]["freshness"], "balance": overview[name]["balance"], "timestamp_utc": stamps.get(name)})
    return {
        "report_id": f"RPT-{period}", "period": period, "company_code": "1000", "ledger": "0L", "currency": "USD", "as_of": f"{end.isoformat()}T18:20:00+00:00",
        "synthetic": True, "case_id": (case or {}).get("case_id"), "scenario": (case or {}).get("scenario"), "trace_id": f"trace-{case['case_id']}" if case else None,
        "summary": {"status": status, "status_text": status_text, "s4_total": s4_total, "cfin_total": cfin_total, "variance": variance, "explained": explained,
                    "unexplained": unexplained, "explained_pct": 100 if variance == 0 else round(100 * explained / variance), "tolerance": TOLERANCE, "open_items": len(items),
                    "high_items": sum(1 for i in items if i["materiality"] == "high"), "matched_movements": len(detail["journals"]),
                    "ready_for_approval": status in ("EXPLAINED", "WITHIN_TOLERANCE")},
        "sources": [{"source": k, **v, "timestamp_utc": stamps.get(k)} for k, v in overview.items()],
        "matched": [{"journal_id": j["journal_id"], "account": j["account"], "account_name": ACCOUNT_NAMES.get(j["account"], ""), "amount": j["amount"], "description": j["description"], "timestamp_utc": j["timestamp_utc"], "status": "matched in S/4HANA and Central Finance"} for j in detail["journals"]],
        "timeline": timeline, "accounts": accounts, "items": items, "bridge": bridge, "aging": aging, "controls": controls, "actions": actions,
        "ai_review": {"advisory_only": True, "authoritative": False, "model": "deterministic simulator",
                      "did": ["Compared source totals and account lines", "Classified each reconciling item with a confidence", "Ranked follow-up actions"],
                      "did_not": ["Post to SAP", "Approve the variance", "Change any balance", "Use data outside the synthetic fixtures"]},
        "events": [{"seq": e.get("seq"), "source": e.get("source"), "target": e.get("target"), "operation": e.get("operation"), "status": e.get("status")} for e in (events or [])][:60],
        "disclaimer": "Synthetic demo data. SAP transaction references are for realism and are not invoked. This report is not a financial statement.",
    }

# ---- close-condition presets for the simulator ----
CONDITIONS = {
    "baseline": {"label": "Restore the seeded baseline for this period", "what": "Puts balances and freshness back to the seeded values."},
    "clean_close": {"label": "Clean close · S/4HANA and Central Finance agree", "what": "Central Finance balance equals S/4HANA. No reconciling items."},
    "late_replication": {"label": "Late Central Finance replication", "what": "Central Finance replication is behind. The comparison is held until it is current."},
    "bw_delay": {"label": "BW/4HANA load delayed", "what": "The BW hierarchy load did not finish. The comparison is held."},
    "pipeline_lag": {"label": "Databricks pipeline lag", "what": "The Databricks snapshot is behind. The comparison is held."},
    "late_posting": {"label": "Unreplicated posting after cut-off (+$18,000)", "what": "A posting in S/4HANA is missing from Central Finance and no seeded item explains it, so part of the variance is unexplained."},
}


def seeded_values(period: str):
    index = PERIODS.index(period)
    s4 = 890_000 + index * 10_000
    stale = {"cfin": "2026-03", "bw": "2026-07", "databricks": "2026-01"}
    return s4, s4 - VARIANCES[index], {name: ("stale" if period == at else "current") for name, at in stale.items()}


def apply_condition(store: Store, period: str, key: str) -> dict:
    if period not in PERIODS:
        raise Denied("No synthetic finance history for requested period")
    if key not in CONDITIONS:
        raise Denied("Unknown close condition")
    s4, cfin, fresh = seeded_values(period)
    fields = {"cfin": "replication_status", "bw": "load_status", "databricks": "pipeline_status"}
    changes = []

    def set_balance(source, value):
        changes.append(store.mutate_period_source(period, source, "balance", value))

    def set_fresh(source, value):
        changes.append(store.mutate_period_source(period, source, fields[source], value))

    if key in ("baseline", "clean_close", "late_posting"):
        target = {"baseline": cfin, "clean_close": s4, "late_posting": cfin - 18_000}[key]
        for source in ("cfin", "bw", "databricks"):
            set_balance(source, target)
        set_balance("s4", s4)
    if key == "baseline":
        for source, value in fresh.items():
            set_fresh(source, value)
    elif key in ("clean_close", "late_posting"):
        for source in fields:
            set_fresh(source, "current")
    else:
        source = {"late_replication": "cfin", "bw_delay": "bw", "pipeline_lag": "databricks"}[key]
        set_fresh(source, "stale")
    return {"period": period, "condition": key, **CONDITIONS[key], "changes": len(changes), "synthetic": True}
