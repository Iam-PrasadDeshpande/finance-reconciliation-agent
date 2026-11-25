# Comparative cost model (Architecture V5.2)

The model is in the app (Selection, Cost model) and in `poc/architecture_model.py` (`COST_COMPONENTS`, `estimate`, `break_even`, mirrored in `frontend/src/selectionEngine.js`). **It contains no rate.** SAP BTP credit rates, enterprise AWS discounts, Apigee charges and measured savings are not known to this application and are never invented; enter each rate with its source. The hypotheses that BTP credits make frequent agent hosting expensive and that the existing SAP AWS infrastructure is unsuitable for AI-native workloads need evidence.

## How it works

One workload definition (the monthly volumes) applies to every scenario. For each cost layer that applies to a scenario the monthly cost is volume multiplied by rate. A scenario total appears only when every needed volume and rate is present; otherwise the total is PENDING and the missing inputs are counted. Sensitivity shows plus or minus 20 percent on every rate. Break-even solves the volume of one component at which two scenarios cost the same, holding all other inputs fixed; it is not computable when an input is missing, the slopes are equal or the result is negative.

## Layers

Agent runtime CPU and memory; idle capacity; AgentCore Gateway tool invocations (S2, S3); Apigee usage (S1, S3); Integration Suite consumption; Cloud Connector operating cost; Portkey and model-provider cost; inter-cloud transfer and egress; persistence; observability; agent registry; support and staffing; environment isolation and disaster recovery.

## Workload profiles to compare

Low-frequency SAP-specific agent; high-frequency analytical agent; bursty enterprise agent; long-running reconciliation workflow; multi-agent and multi-tool orchestration. Use the same definition for every platform.

## Reading the result

AWS may be more attractive when runtime is the dominant cost and consumption pricing fits the profile; SAP BTP may be preferable when committed credits are already paid, SAP coupling is high or the extra gateway and cross-cloud transfer outweigh the compute saving. A high invocation frequency does not automatically make AWS cheaper: it raises gateway and runtime charges too.
