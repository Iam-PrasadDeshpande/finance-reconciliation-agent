# MCP hosting and governance (synthetic design review)

Status: **proposed design for evaluation (Architecture V5.2).** No SAP, AWS, Google, Databricks, Portkey or BDC tenant is connected. The decision record, rules, recommendation framework and gaps are in `docs/ARCHITECTURE_V5_2.md`; the MCP hosting page is generated from `poc/architecture_model.py`.

## The three scenarios

| | S1 SAP-hosted hybrid | S2 AWS AgentCore-native | S3 AgentCore + Apigee hybrid |
|---|---|---|---|
| Agent hosting and execution | SAP BTP Cloud Foundry | AWS AgentCore Runtime | AWS AgentCore Runtime |
| Custom MCP code (only if required) | Cloud Foundry | AgentCore Runtime | Conditional; AgentCore Runtime preferred, exposed through Apigee |
| Runtime gateway | Google Apigee | AgentCore Gateway | AgentCore Gateway in front of Google Apigee |
| Apigee | Required | Optional, by SAP Integration and Security | Required |
| Agent and MCP registry | AWS Agent Registry | AWS Agent Registry | AWS Agent Registry |
| Preference | Preferred for SAP-centric agents | Not preferred · kept for reference | Preferred for SAP and non-SAP agents, conditional |

## Exposure patterns

**Pattern A**: an approved API exposed as an MCP tool by Apigee (S1, S3), no custom server; in S2 an approved API/OpenAPI Gateway target can play the same role once its schema, authentication and connectivity are checked. **Pattern B**: a custom MCP server on an approved runtime where logic needs code (Cloud Foundry in S1, AgentCore Runtime in S2, behind Apigee in S3). A managed endpoint is not application-code hosting, and Apigee is not arbitrary agent-code hosting.

## Terminology the pages enforce

A registry is a catalog and never an invocation hop. AgentCore Runtime hosts; AgentCore Gateway mediates; AWS Agent Registry registers: three separate capabilities. Registration, deployment, authentication, authorization and execution are separate states. Read and posting tools are separate domains; this demo is read and tally only. GitLab deploys but is never a runtime.

## Gateways in S3

AgentCore Gateway and Apigee have separate candidate responsibilities (agent-facing access and tool policy versus SAP-facing exposure and API products). Neither is assumed to provide every function: validate supported features, avoid duplicated policy and ambiguous tool names, agree quota ownership and join logs with one correlation id. The table is in the Selection view.

## Open items

Account approval and registry sharing; the real call through AgentCore Gateway to Apigee, Apigee reachability from AWS and the credential-provider account; delegated identity; cost rates; SAP Integration's Apigee mandate for S2. See the Decision brief and `docs/POC_PROOF_AND_ENTITLEMENT_CHECKLIST.md`.
