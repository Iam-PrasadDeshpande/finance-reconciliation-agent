# MCP hosting and governance (synthetic design review)

Status: **proposed design for evaluation (Architecture V5.1).** No SAP, AWS, Google, Databricks, Portkey or BDC tenant is connected. Nothing here is an approved architecture, tenant evidence or production authorization. The full decision record, gaps and rollback are in `docs/ARCHITECTURE_V5_1.md`.

The **MCP hosting** page is generated from the canonical model `poc/architecture_model.py` (exported to `frontend/src/architectureModel.json` by `python scripts/build_architecture_model.py`). Edit the model, not the rendered tables, so every page tells the same story.

## The three scenarios

| | S1 SAP-centric | S2 AWS AgentCore-centric | S3 SAP-hosted hybrid |
|---|---|---|---|
| Agent hosting and execution | SAP BTP Cloud Foundry | AWS AgentCore Runtime | SAP BTP Cloud Foundry |
| Custom MCP code (only if required) | Cloud Foundry, behind Apigee | AgentCore Runtime, proxied by Apigee (cross-cloud) | Cloud Foundry, behind Apigee |
| MCP gateway | Google Apigee | AgentCore Gateway in front of Apigee | Google Apigee |
| Agent and MCP registry | Domain-managed catalog, product selection pending | AWS Agent Registry | AWS Agent Registry (control plane only) |
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

## Open items only the owner or the tenant can close

1. Which registry product S1 uses, and who approves publication.
2. Whether AI Foundry mandates AgentCore Gateway for every tool call (variant S3-B).
3. Whether AWS Agent Registry can synchronize SAP-hosted endpoints in this tenant (AWS must reach the URL with an outbound credential).
4. A real AgentCore Gateway to Apigee call (S2) to settle protocol, token exchange and target type.
5. Delegated user identity versus service identity, and token exchange to ABAP roles.
6. Whether persistence (HANA Cloud) is needed at all.
7. Cost, latency and egress, which are unmeasured.
