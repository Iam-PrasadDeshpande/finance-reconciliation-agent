"""Deterministic synthetic finance history for December 2025 through November 2026."""
from __future__ import annotations

import calendar

PERIODS = [f"{year:04d}-{month:02d}" for year,month in
           ([(2025,12)]+[(2026,month) for month in range(1,12)])]
ACCOUNTS = ("110000", "120000", "210000", "310000", "410000", "510000")
WEIGHTS = (35, 25, 15, 10, 8, 7)
VARIANCES = (0, 3000, 0, 5000, 12000, 0, 4500, 0, 8000, 0, 15000, 25000)
SOURCES = ("s4", "cfin", "bw", "databricks")


def create_tables(db):
    db.executescript("""
      CREATE TABLE IF NOT EXISTS period_balances(
        period TEXT NOT NULL, company_code TEXT NOT NULL, ledger TEXT NOT NULL,
        currency TEXT NOT NULL, source TEXT NOT NULL, account TEXT NOT NULL,
        balance INTEGER NOT NULL, timestamp_utc TEXT NOT NULL,
        evidence_id TEXT NOT NULL, mapping TEXT NOT NULL, freshness TEXT NOT NULL,
        PRIMARY KEY(period,company_code,ledger,currency,source,account)
      );
      CREATE TABLE IF NOT EXISTS journal_fixtures(
        journal_id TEXT PRIMARY KEY, period TEXT NOT NULL, company_code TEXT NOT NULL,
        ledger TEXT NOT NULL, account TEXT NOT NULL, amount INTEGER NOT NULL,
        currency TEXT NOT NULL, description TEXT NOT NULL, timestamp_utc TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_period_balances_scope ON period_balances(period,company_code,ledger,currency,source);
      CREATE INDEX IF NOT EXISTS idx_journal_fixtures_period ON journal_fixtures(period,company_code,ledger);
    """)


def seed_history(db):
    if db.execute("SELECT 1 FROM period_balances LIMIT 1").fetchone(): return
    balance_rows=[]
    journal_rows=[]
    for index,period in enumerate(PERIODS):
        year,month=map(int,period.split("-"))
        day=calendar.monthrange(year,month)[1]
        stamp=f"{period}-{day:02d}T18:00:00+00:00"
        s4_total=890_000+index*10_000
        cfin_total=s4_total-VARIANCES[index]
        totals={"s4":s4_total,"cfin":cfin_total,"bw":cfin_total,"databricks":cfin_total}
        freshness={"s4":"current","cfin":"stale" if period=="2026-03" else "current",
                   "bw":"stale" if period=="2026-07" else "current",
                   "databricks":"stale" if period=="2026-01" else "current"}
        for source,total in totals.items():
            allocated=[total*w//100 for w in WEIGHTS[:-1]]
            allocated.append(total-sum(allocated))
            for account,amount in zip(ACCOUNTS,allocated):
                evidence=f"SYN-{source.upper()}-{period}-{account}"
                balance_rows.append((period,"1000","0L","USD",source,account,amount,stamp,evidence,
                                     "ERP-A:1000->1000" if source=="cfin" else "1000:0L",freshness[source]))
        # Journal movements are evidence records, not the closing balance calculation.
        for j in range(12):
            journal_rows.append((f"SYN-J-{period}-{j+1:02d}",period,"1000","0L",ACCOUNTS[j%len(ACCOUNTS)],
                                 (index+1)*(j+1)*125,"USD",f"Synthetic monthly movement {j+1}",stamp))
    db.executemany("INSERT INTO period_balances VALUES (?,?,?,?,?,?,?,?,?,?,?)",balance_rows)
    db.executemany("INSERT INTO journal_fixtures VALUES (?,?,?,?,?,?,?,?,?)",journal_rows)
    db.commit()


def source_snapshot(db,period:str,source:str):
    rows=db.execute("""SELECT account,balance,timestamp_utc,evidence_id,mapping,freshness
                       FROM period_balances WHERE period=? AND company_code='1000' AND ledger='0L'
                       AND currency='USD' AND source=? ORDER BY account""",(period,source)).fetchall()
    if not rows: return None
    result={"balance":sum(r[1] for r in rows),"timestamp_utc":rows[0][2],
            "evidence_id":f"SYN-{source.upper()}-{period}-AGG","account_count":len(rows),
            "evidence_refs":[r[3] for r in rows],"source_mapping":rows[0][4],
            "freshness":rows[0][5],"deny":False}
    if source=="s4":
        journals=db.execute("SELECT journal_id FROM journal_fixtures WHERE period=? ORDER BY journal_id",(period,)).fetchall()
        result["journals"]=[{"id":r[0]} for r in journals]
    elif source=="cfin": result["replication_status"]=rows[0][5]
    elif source=="bw":
        result["load_status"]=rows[0][5]
        result["hierarchy"]=f"H-{period}"
    else:
        result["pipeline_status"]=rows[0][5]
        result["uc_grant"]=True
    return result


def period_overview(db):
    rows=db.execute("""SELECT period,source,SUM(balance) balance,MAX(freshness) freshness
                       FROM period_balances GROUP BY period,source ORDER BY period,source""").fetchall()
    periods={}
    for r in rows:
        periods.setdefault(r[0],{"period":r[0],"sources":{}})["sources"][r[1]]={"balance":r[2],"freshness":r[3]}
    return list(periods.values())
