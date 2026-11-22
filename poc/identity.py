from datetime import datetime,timezone,timedelta
from .contracts import IdentityContext
from .store import Denied

USERS={
 "finance.user":("finance_reader",["1000"],["sap.read","sap.compare","databricks.read","bdc.read"]),
 "finance.approver":("finance_approver",["1000"],["approve"]),
 "finance.operator":("operator",["1000"],["fixture.write"]),
 "posting.executor":("executor",["1000"],["sap.post"]),
 "restricted.user":("finance_reader",["2000"],["sap.read"]),
}

def sign_in(user_id:str,expired:bool=False):
    if user_id not in USERS: raise Denied("Unknown synthetic user")
    role,codes,scopes=USERS[user_id]
    return IdentityContext(user_id=user_id,role=role,company_codes=codes,scopes=scopes,expires_at_utc=datetime.now(timezone.utc)+(timedelta(seconds=-1) if expired else timedelta(hours=1)))

def authorize(identity:IdentityContext,company_code:str,scope:str):
    if identity.expires_at_utc<=datetime.now(timezone.utc): raise Denied("Identity expired")
    if company_code not in identity.company_codes: raise Denied(f"Company code {company_code} is forbidden for {identity.user_id}")
    if scope not in identity.scopes: raise Denied(f"Missing scope {scope}")

def backend_authorize(backend:str,identity:IdentityContext,company_code:str,write:bool=False,deny:bool=False):
    authorize(identity,company_code,"sap.post" if write else "sap.read")
    if deny: raise Denied(f"{backend} mapped-user / backend role denied")
    return f"SYN-MAPPED-{backend}-{identity.user_id}"
