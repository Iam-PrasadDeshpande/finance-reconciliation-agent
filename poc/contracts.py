from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field, field_validator

Scenario = Literal["S1", "S2", "S3"]


class IdentityContext(BaseModel):
    user_id: str
    role: Literal["finance_reader", "finance_approver", "operator", "executor"]
    company_codes: list[str]
    expires_at_utc: datetime
    scopes: list[str] = Field(default_factory=list)


class AgentManifest(BaseModel):
    name: str = "month_end_reconciler"
    version: str
    schema_version: str = "1.0"
    tool_bindings: list[str]
    policy: Literal["read_only_with_approval"] = "read_only_with_approval"


class ReconciliationRequest(BaseModel):
    scenario: Scenario
    company_code: str
    ledger: str
    period: str
    currency: str = "USD"
    user_id: str = "finance.user"

    @field_validator("period")
    @classmethod
    def valid_period(cls, value: str) -> str:
        datetime.strptime(value, "%Y-%m")
        return value


class ToolCall(BaseModel):
    name: str
    schema_version: str = "1.0"
    case_id: str
    arguments: dict


class ToolResult(BaseModel):
    name: str
    status: Literal["ok", "denied", "error"]
    data: dict = Field(default_factory=dict)
    audit_id: str


class SourceSnapshot(BaseModel):
    source: str
    period: str | None = None
    balance: Decimal | None = None
    currency: str = "USD"
    timestamp_utc: datetime
    evidence_id: str
    mapping: str = "1000:0L"
    freshness: Literal["current", "stale", "blocked"] = "current"
    account_count: int | None = None
    journal_count: int | None = None
    synthetic: bool = True


class Variance(BaseModel):
    amount: Decimal | None
    state: Literal["comparable", "stale", "blocked"]
    formula: str
    evidence_ids: list[str]
    synthetic: bool = True


class AdjustmentProposal(BaseModel):
    proposal_id: str
    case_id: str
    case_version: int
    target_system: str = "S4_SIMULATOR"
    amount: Decimal
    posting_basis: Literal["variance_marker_only"] = "variance_marker_only"
    currency: str = "USD"
    rationale: str
    payload_hash: str
    status: str = "awaiting_approval"


class ApprovalDecision(BaseModel):
    proposal_id: str
    approver_id: str
    approved: bool
    callback_id: str
    payload_hash: str
    case_version: int


class PostingCommand(BaseModel):
    proposal_id: str
    case_id: str
    period: str
    amount: Decimal
    posting_basis: Literal["variance_marker_only"] = "variance_marker_only"
    currency: str
    payload_hash: str
    case_version: int


class SyntheticJournalResult(BaseModel):
    document_number: str
    status: Literal["SYNTHETIC_POSTED", "BLOCKED"]
    synthetic: bool = True


class FlowEvent(BaseModel):
    event_id: str
    case_id: str
    trace_id: str
    scenario: Scenario
    source_component_id: str
    target_component_id: str
    operation: str
    actor: str
    timestamp_utc: datetime
    status: str
    schema_version: str = "1.0"
    parent_event_id: str | None = None
    flow_type: str
    direction: Literal["request", "response", "event"]
    transport: str = "local-python"
    duration_ms: int = 0
    authorization_decision: str = "n/a"
    payload_summary: dict = Field(default_factory=dict)
    payload_hash: str | None = None
    case_version: int | None = None
