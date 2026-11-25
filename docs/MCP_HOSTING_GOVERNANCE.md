# MCP hosting and governance (synthetic design review)

Status: **proposed design for evaluation (Architecture V5.1).** No SAP, AWS, Google, Databricks, Portkey or BDC tenant is connected. Nothing here is an approved architecture, tenant evidence or production authorization. The full decision record, gaps and rollback are in `docs/ARCHITECTURE_V5_1.md`.

The **MCP hosting** page is generated from the canonical model `poc/architecture_model.py` (exported to `frontend/src/architectureModel.json` by `python scripts/build_architecture_model.py`). Edit the model, not the rendered tables, so every page tells the same story.

## The three scenarios

| | S1 SAP-centric | S2 AWS AgentCore-centric | S3 SAP-hosted hybrid |
|---|---|---|---|
| Agent hosting and execution | SAP BTP Cloud Foundry | AWS AgentCore Runtime | SAP BTP Cloud Foundry |
| Custom MCP code (only if required) | Cloud Foundry, behind Apigee | AgentCore Runtime, proxied by Apigee (cross-cloud) | Cloud Foundry, behind Apigee |
| MCP gateway | Google Apigee | AgentCore Gateway in front of Apigee | Google Apigee |
| Agent and MCP registry | Interim catalog on GitLab (not a full agent registry; decided by the owner) | AWS Agent Registry | AWS Agent Registry (control plane only) |
| Status | evaluation candidate | evaluation candidate | preferred candidate, subject to AI Foundry policy and POC validation |

Common to all: Portkey is the LLM gateway; SAP Integration Suite is the SAP integration boundary; SAP Cloud Connector is conditional; persistence is conditional; the SAP backend decides business authorization. Google Apigee is the SAP-facing MCP/API gateway: Pattern A exposes an approved API as an MCP tool (no custom server), Pattern B puts a custom MCP server behind it.

## What the page holds

Comparison matrix (22 rows), per-scenario connection tables, registry and ownership, the Finance read, posting (not active) and analytical domains, the recommendation and proof plan, and source evidence. The ten generated diagrams are on the Diagrams tab.

## Terminology the page enforces

- A registry is a catalog. It is never an invocation hop, and registration is not proof of reachability or authorization.
- A gateway routes and authorizes. It does not necessarily run the domain tools.
- Agent hosting, MCP hosting, agent registration, MCP registration and the MCP gateway are separate decisions. Using AWS Agent Registry does not require AWS agent hosting.
- Read and posting tools sit in separate domains. This demo is read and tally only and never posts to SAP.

## Evidence (read 2026-11-25)

See the table in `docs/ARCHITECTURE_V5_1.md`. Six of seven sources were read; the SAP Cloud Foundry page returned no body and is NOT_VERIFIED. Vendor documentation shows capability, not tenant entitlement.

## Status vocabulary

- **Vendor-documented · tenant NOT_VERIFIED**: a product page states the capability; our tenant is unchecked.
- **Design assumption**: our proposal, not documented behaviour.
- **TBD · REQUIRES VALIDATION**: evidence missing. No component was invented to fill the gap.

## Owner answers of 2026-11-25 and what is still open

Decided or confirmed by the owner (statements, not evidence):

- **S1 registry**: SAP AI Agent Hub is not available, so S1 uses an interim catalog on GitLab, the central platform. The integration team, with the respective technical approvals, approves publishing. It is not a full agent registry.
- **GitLab** hosts source, specs, descriptors, catalog records and CI/CD for every scenario (not runtime hosting).
- **AgentCore Gateway** is mandatory in S2 by design and not mandatory in S1 or S3, so S3-B is not required. AI Foundry's written confirmation is pending.
- **Tenant entitlements** (Cloud Foundry, Apigee MCP, AgentCore, Agent Registry, Portkey) are owner-confirmed live; no written evidence or region and quota detail is attached.

Still open (not yet checked):

1. Whether AWS can reach the Apigee MCP endpoint.
2. Whether the registry credential provider is in the same AWS account.
3. The real end-to-end call through AgentCore Gateway to Apigee (S2).

The register with options, proposals and proofs is in the Decision brief and `docs/POC_PROOF_AND_ENTITLEMENT_CHECKLIST.md`.
