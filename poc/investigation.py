"""Evidence-driven, synthetic Central Finance variance investigation."""
from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from .contracts import ReconciliationRequest, ToolCall
from .foundry import FoundrySimulator
from .gateway import select_gateway
from .identity import authorize, sign_in
from .runtime import RuntimeSimulator
from .store import Denied, Store, compact


class InvestigationSimulator:
    PLAN = (
        ("readiness", "Validate close case and source snapshot", "context_manager"),
        ("compare", "Compare source and Central Finance documents", "cfin_accounting"),
        ("hypothesis", "Test replication and mapping hypotheses", "reconciliation_engine"),
        ("recommendation", "Choose a controlled next action", "finance_policy"),
    )

    def __init__(self, store: Store):
        self.store = store

    def start(self, case_id: str, fault_profile: str = "replication_gap") -> dict:
        if fault_profile not in ("replication_gap", "mapping_conflict"):
            raise Denied("Unsupported investigation profile")
        with self.store.lock:
            case = self.store.case(case_id)
            if not case or case["status"] != "complete": raise Denied("Completed reconciliation case required")
            variance = case["result"]["variance"]
            if variance["state"] != "comparable" or variance["amount"] is None or Decimal(str(variance["amount"])) == 0:
                raise Denied("Comparable nonzero variance required")
            if case["scope"] != {"company_code": "1000", "ledger": "0L", "period": "2026-11", "currency": "USD"}:
                raise Denied("Document investigation is seeded for November 2026 only")
            active = FoundrySimulator(self.store).active()
            if not active or "sap.compare" not in active["manifest"]["tool_bindings"]:
                raise Denied("Active agent lacks the document comparison binding")
            if any(p["case_id"] == case_id and p["status"] == "synthetic_posted" for p in self.store.proposals()):
                raise Denied("A posted marker requires operator review before investigation")
            record = {
                "investigation_id": f"investigation-{uuid.uuid4().hex[:10]}", "case_id": case_id,
                "scenario": case["scenario"], "fault_profile": fault_profile, "status": "running",
                "plan": [{"step_id": key, "label": label, "component_id": component, "status": "pending", "proof_ids": []} for key, label, component in self.PLAN],
                "proof": [], "diagnosis": None, "proposed_action": None,
                "before": {"case_id": case_id, "variance": variance, "sources": case["result"]["sources"]},
                "after": None, "reason": None, "synthetic": True,
                "created_at_utc": datetime.now(timezone.utc).isoformat(),
            }
            self.store.save_investigation(record)
            return record

    def _proof(self, record: dict, step_id: str, evidence_id: str, label: str, component_id: str, data: dict):
        digest = hashlib.sha256(compact(data).encode()).hexdigest()
        item = {"proof_id": f"proof-{uuid.uuid4().hex[:8]}", "step_id": step_id,
                "evidence_id": evidence_id, "label": label, "component_id": component_id,
                "sha256": digest, "data": data, "synthetic": True}
        record["proof"].append(item)
        next(step for step in record["plan"] if step["step_id"] == step_id)["proof_ids"].append(item["proof_id"])
        return item

    def _step(self, record: dict, step_id: str, source: str, target: str, operation: str, fn):
        step = next(step for step in record["plan"] if step["step_id"] == step_id)
        step["status"] = "running"
        self.store.save_investigation(record)
        result = self.store.call(record["case_id"], record["scenario"], source, target, operation,
                                 "finance.user", "investigation", {"step_id": step_id, "synthetic": True}, fn)
        step["status"] = "complete"
        step["last_event_seq"] = self.store.events(record["case_id"])[-1]["seq"]
        self.store.save_investigation(record)
        return result

    def run(self, investigation_id: str) -> dict:
        record = self.store.investigation(investigation_id)
        if not record or record["status"] != "running": raise Denied("Unknown or completed investigation")
        case = self.store.case(record["case_id"])
        try:
            def readiness():
                if not case or case["status"] != "complete": raise Denied("Case changed during investigation")
                current = {name: self.store.source_for_period(name, "2026-11") for name in ("s4", "cfin", "bw", "databricks")}
                for name, source in current.items():
                    prior = case["result"]["sources"][name]
                    if source["freshness"] != "current" or source.get("deny") or Decimal(str(source["balance"])) != Decimal(str(prior["balance"])) or source["evidence_id"] != prior["evidence_id"] or source["timestamp_utc"].replace("Z", "+00:00") != prior["timestamp_utc"].replace("Z", "+00:00"):
                        raise Denied(f"{name} source changed; rerun reconciliation")
                if not current["databricks"].get("uc_grant", False): raise Denied("Databricks grant changed")
                return current
            current = self._step(record, "readiness", "agentcore_runtime", "context_manager", "investigation_readiness", readiness)
            self._proof(record, "readiness", "SYN-READINESS-" + case["case_id"], "Source snapshot and close eligibility", "context_manager",
                        {"case_id": case["case_id"], "variance": case["result"]["variance"], "sources": {name: {"balance": source["balance"], "evidence_id": source["evidence_id"], "timestamp_utc": source["timestamp_utc"], "freshness": source["freshness"]} for name, source in current.items()}})
            self.store.save_investigation(record)

            def compare():
                identity = sign_in(case["user_id"])
                call = ToolCall(name="sap.compare", case_id=case["case_id"], arguments={"scope": case["scope"], "fault_profile": record["fault_profile"]})
                return select_gateway(self.store, case["scenario"]).invoke(call, identity, case["scope"])
            comparison = self._step(record, "compare", "context_manager", "mcp_client", "request_document_comparison", compare)
            self._proof(record, "compare", "SYN-CFIN-DOC-COMPARISON-2026-11", "Four-document source to Central Finance comparison", "cfin_accounting", comparison)
            self.store.save_investigation(record)

            def evaluate():
                expected = int(Decimal(str(case["result"]["variance"]["amount"])))
                if comparison["s4_total"] != current["s4"]["balance"] or comparison["cfin_total"] != current["cfin"]["balance"] or comparison["difference"] != expected:
                    return {"classification": "evidence_gap", "reason": "Document comparison does not tie to source snapshots", "matched": False}
                gaps = [row for row in comparison["documents"] if row["s4_amount"] != row["cfin_amount"]]
                if len(gaps) != 1 or gaps[0]["s4_amount"] - gaps[0]["cfin_amount"] != expected:
                    return {"classification": "unexplained", "reason": "Variance does not map to one document", "matched": False}
                gap = gaps[0]
                if gap["mapping_status"] != "mapped" or gap["aif_status"] == "mapping_error":
                    return {"classification": "mapping_conflict", "reason": "Mapping error requires finance and integration review", "matched": True, "document_id": gap["document_id"]}
                if gap["aif_status"] == "ready_for_reprocess" and gap["cfin_amount"] == 0:
                    return {"classification": "replication_gap", "reason": "One mapped document is absent from Central Finance", "matched": True, "document_id": gap["document_id"]}
                return {"classification": "unexplained", "reason": "Document status does not support reprocessing", "matched": False}
            diagnosis = self._step(record, "hypothesis", "context_manager", "reconciliation_engine", "test_hypotheses", evaluate)
            record["diagnosis"] = diagnosis
            self._proof(record, "hypothesis", "SYN-HYPOTHESIS-" + case["case_id"], "Deterministic document and variance tie-out", "reconciliation_engine", diagnosis)
            self.store.save_investigation(record)

            def recommend():
                if diagnosis["classification"] == "replication_gap":
                    return {"action": "simulated_reprocess", "requires_operator": True, "automatic_write": False,
                            "document_id": diagnosis["document_id"], "reason": "Mapped document explains the full variance; recheck source state before local reprocess"}
                return {"action": "manual_review", "requires_operator": True, "automatic_write": False, "reason": diagnosis["reason"]}
            recommendation = self._step(record, "recommendation", "reconciliation_engine", "finance_policy", "recommend_next_action", recommend)
            record["proposed_action"] = recommendation
            record["status"] = "action_proposed" if recommendation["action"] == "simulated_reprocess" else "held"
            record["reason"] = recommendation["reason"]
            self._proof(record, "recommendation", "SYN-POLICY-" + case["case_id"], "Action policy and hold decision", "finance_policy", recommendation)
            self.store.save_investigation(record)
            return record
        except Exception as exc:
            record["status"] = "held"
            record["reason"] = str(exc)
            for step in record["plan"]:
                if step["status"] == "running": step["status"] = "blocked"
            self.store.save_investigation(record)
            return record

    def resolve(self, investigation_id: str, operator_id: str = "finance.operator") -> dict:
        with self.store.lock:
            record = self.store.investigation(investigation_id)
            if not record or record["status"] != "action_proposed" or record["proposed_action"]["action"] != "simulated_reprocess":
                raise Denied("No approved synthetic reprocess candidate")
            identity = sign_in(operator_id)
            if identity.role != "operator": raise Denied("Synthetic operator role required")
            authorize(identity, "1000", "fixture.write")
            case = self.store.case(record["case_id"])
            expected = {name: int(Decimal(str(case["result"]["sources"][name]["balance"]))) for name in ("s4", "cfin", "bw", "databricks")}
            for name in ("s4", "cfin", "bw", "databricks"):
                current = self.store.source_for_period(name, "2026-11")
                prior = record["before"]["sources"][name]
                if current["evidence_id"] != prior["evidence_id"] or current["timestamp_utc"].replace("Z", "+00:00") != prior["timestamp_utc"].replace("Z", "+00:00"):
                    raise Denied(f"{name} evidence changed before reprocess")
            if sum(row["s4_amount"] - row["cfin_amount"] for row in self.store.comparison_documents("2026-11")) != int(Decimal(str(case["result"]["variance"]["amount"]))):
                raise Denied("Document evidence changed before reprocess")
            document_id = record["proposed_action"]["document_id"]
            receipt = self.store.call(case["case_id"], case["scenario"], "finance_policy", "cfin_status", "operator_authorized_reprocess", operator_id, "write",
                                      {"document_id": document_id, "synthetic": True}, lambda: self.store.apply_replication_reprocess(document_id, expected))
            self._proof(record, "recommendation", receipt["evidence_id"], "Synthetic reprocess and downstream refresh receipt", "cfin_status", receipt)
            record["status"] = "reconciling"
            self.store.save_investigation(record)
            request = ReconciliationRequest(scenario=case["scenario"], user_id=case["user_id"], **case["scope"])
            try:
                after = RuntimeSimulator(self.store).reconcile(request)
            except Exception as exc:
                record["status"] = "held"
                record["reason"] = f"Synthetic source refresh completed, but re-reconciliation failed: {exc}"
                self.store.save_investigation(record)
                raise
            record["after"] = {"case_id": after["case_id"], "variance": after["variance"], "sources": after["sources"]}
            record["status"] = "resolved" if after["variance"]["state"] == "comparable" and Decimal(str(after["variance"]["amount"])) == 0 else "held"
            record["reason"] = "Reconciliation cleared after simulated reprocess and evidence refresh" if record["status"] == "resolved" else "Reconciliation remains open after simulated reprocess"
            self._proof(record, "recommendation", "SYN-RECONCILED-" + after["case_id"], "Independent after-run reconciliation", "reconciliation_engine", record["after"])
            self.store.save_investigation(record)
            return record
