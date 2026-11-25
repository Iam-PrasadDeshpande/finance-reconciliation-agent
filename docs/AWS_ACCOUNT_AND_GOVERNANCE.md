# Dedicated SAP-agent AWS account: proposal and governance (Architecture V5.2)

Status: **a proposal for evaluation. No account or resource is provisioned and none is requested by this application.** Account provisioning does not prove access to every AgentCore capability: confirm enterprise service policy, actual entitlements, permissions and regional support.

## Proposed topology

| Account or layer | What it holds | Owns |
|---|---|---|
| AI Foundry governance account | The central AWS Agent Registry, curator and approval roles, shared with workload accounts | Registry ownership, publisher and consumer permissions, record approval |
| SAP-agent workload account (proposed) | AgentCore Runtime and Gateway for SAP-related agents; development, test and production separated, or another enterprise-approved arrangement | IAM least privilege, SCP guardrails, egress to Apigee and Integration Suite, secrets and encryption, tagging |
| AWS Organizations and landing zone | The existing organization, SCPs, region and data-residency policy | Enterprise policy owner |
| Shared services | Portkey connectivity, central logging, monitoring, incident response, cost allocation and billing | Platform operations |

GitLab deploys the runtime, gateway targets and registry record definitions into these accounts; it is not a runtime. Do not create a duplicate registry because execution uses a dedicated account.

## What to evaluate before a request

Dedicated account within the approved AWS Organization; landing-zone compliance; separation of development, test and production; IAM roles and least privilege; SCP restrictions; region and data residency; AgentCore availability and quotas; AgentCore Runtime and Gateway permissions; approved networking and egress; access to Apigee and Integration Suite; Portkey connectivity; secrets and encryption; cost allocation and billing ownership; monitoring and incident response; tagging and lifecycle policies.

## Central registry and cross-account sharing

Confirm: registry ownership by AI Foundry; publisher permissions for the workload account; consumer permissions; curator approval authority; cross-account sharing through AWS Organizations and AWS Resource Access Manager; region compatibility; metadata synchronization and endpoint reachability; revocation and versioning; registry entitlements. **Cross-account sharing was not read in this build and is NOT_VERIFIED.**

## Operating ownership

See the RACI in the Selection view (agent runtime, Apigee policies, AgentCore Gateway targets, registry records, Portkey, SAP authorization, GitLab pipelines, cost allocation). The decision to request the account sits with AI Foundry, AWS platform, Security and Enterprise Architecture.
