"""Bounded finance intent parsing for the synthetic local demo."""
import re
from datetime import datetime

MONTHS={datetime(2026,m,1).strftime("%B").lower():m for m in range(1,13)}
MONTHS.update({datetime(2026,m,1).strftime("%b").lower():m for m in range(1,13)})

def parse_reconciliation(message:str):
    text=message.lower().strip()
    if "reconcil" not in text and "variance" not in text and "balance" not in text:
        return {"unsupported":"Ask for a synthetic reconciliation or variance for a specific month."}
    code=re.search(r"company\s*code\s*(\d{4})",text)
    ledger=re.search(r"ledger\s*([0-9a-z]+)",text)
    iso=re.search(r"\b(2025|2026)-(0[1-9]|1[0-2])\b",text)
    period=iso.group(0) if iso else None
    if period is None:
        for name,month in MONTHS.items():
            match=re.search(rf"\b{name}\s+(2025|2026)\b",text)
            if match:
                period=f"{match.group(1)}-{month:02d}"
                break
    currency="USD" if re.search(r"\b(?:usd|us dollars?)\b|\$",text) else None
    missing=[label for label,value in (("company code",code),("ledger",ledger),("period",period),("currency",currency)) if value is None]
    if missing: return {"follow_up":f"Please specify {', '.join(missing)}."}
    return {"company_code":code.group(1),"ledger":ledger.group(1).upper(),"period":period,"currency":currency}
