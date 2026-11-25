// Recommendation and cost engines for the Selection view. Plain functions with no imports so a test can run them under node and
// compare them with the Python originals in poc/architecture_model.py (recommend, estimate, break_even).
const SCENARIOS = ['S1', 'S2', 'S3'];

export function recommend(selection, inputs) {
  const i = { ...selection.defaults, ...(inputs || {}) };
  const reasons = [], conditions = [], missing = [], rejected = {};
  const blocked = i.aws_account === 'denied' || i.agentcore === 'unavailable' || i.security === 'sap_only_execution' || i.security === 'no_cross_cloud';
  let scenario = null, status = 'HOLD', evaluateFirst = 'S3';

  if (blocked) {
    const why = i.aws_account === 'denied' ? 'the dedicated AWS account is denied' : i.agentcore === 'unavailable' ? 'AgentCore is unavailable' : 'a security restriction rules out AWS runtime calls';
    rejected.S2 = 'Not possible: ' + why + '.';
    rejected.S3 = 'Not possible: ' + why + '.';
    evaluateFirst = 'S1';
    if (i.sap_hosting === 'permitted') {
      scenario = 'S1';
      status = i.ops === 'agreed' ? 'RECOMMENDED' : 'CONDITIONAL';
      reasons.push('The AWS execution options are unavailable (' + why + '), so SAP-hosted execution is the remaining option.');
      if (i.ops !== 'agreed') missing.push('Operational ownership and support for Cloud Foundry');
      if (i.sap_coupling === 'high') reasons.push('SAP application coupling is high, which supports SAP BTP execution.');
      conditions.push('Verify Cloud Foundry capacity and contractual charges for the workload', 'SAP Integration and Security approve direct Apigee invocation');
    } else {
      reasons.push('The enterprise does not permit centrally registered SAP-hosted agents and the AWS options are unavailable: no permitted option remains.');
      missing.push('A permitted hosting option');
    }
  } else {
    if (i.aws_account !== 'approved') missing.push('Dedicated SAP-agent AWS account approval');
    if (i.agentcore !== 'available') missing.push('AgentCore Runtime, Gateway and Registry availability confirmation');
    if (i.ops !== 'agreed') missing.push('Operational ownership and support');
    if (i.apigee === 'undecided') missing.push('SAP Integration decision on whether Apigee is mandatory for the SAP route');
    if (missing.length) {
      scenario = null; status = 'HOLD';
      evaluateFirst = (i.apigee === 'required' || i.apigee === 'undecided') ? 'S3' : 'S2';
      reasons.push('Mandatory approvals are missing, so no scenario can be selected yet. Evaluate ' + evaluateFirst + ' first in the comparative POC.');
    } else if (i.apigee === 'required') {
      if (i.identity === 'failed' || i.interop === 'failed') {
        rejected.S3 = 'Identity or gateway interoperability validation failed.';
        if (i.sap_hosting === 'permitted') {
          scenario = 'S1'; status = 'CONDITIONAL';
          reasons.push('S3 failed validation; SAP-hosted execution with Apigee is the fallback.');
          conditions.push('Verify Cloud Foundry capacity and contractual charges');
        } else {
          scenario = null; status = 'HOLD';
          reasons.push('S3 failed validation and SAP-hosted agents are restricted.');
        }
      } else {
        scenario = 'S3';
        if (i.identity !== 'validated') missing.push('Delegated user identity validated end to end');
        if (i.interop !== 'validated') missing.push('AgentCore Gateway to Apigee interoperability validated');
        if (i.cost === 's1_cheaper') {
          if (i.sap_hosting === 'permitted') {
            scenario = 'S1'; status = 'CONDITIONAL';
            rejected.S3 = 'Verified cost evidence shows S1 is cheaper for this workload.';
            reasons.push('Verified cost evidence favors S1; the extra gateway of S3 is not justified.');
            conditions.push('Confirm the cost evidence with FinOps');
          } else {
            status = 'CONDITIONAL';
            conditions.push('S1 is cheaper but SAP-hosted agents are restricted');
          }
        } else if (i.cost === 's2_cheaper') {
          scenario = 'S2'; status = 'CONDITIONAL';
          rejected.S3 = 'Verified cost evidence shows S2 is cheaper.';
          reasons.push('S2 is cheaper; it needs an approved Apigee exception for the SAP route.');
          conditions.push('SAP Integration approves an Apigee exception');
        } else {
          if (i.cost === 'unknown') missing.push('Verified comparative cost evidence');
          status = missing.length ? 'CONDITIONAL' : 'RECOMMENDED';
          reasons.push('AWS execution is approved and Apigee is required, so S3 is the preferred candidate.');
        }
      }
    } else {
      scenario = 'S2';
      if (i.identity === 'failed') {
        scenario = null; status = 'HOLD';
        reasons.push('Identity validation failed: no AWS scenario can be selected.');
      } else {
        if (i.identity !== 'validated') missing.push('Delegated user identity validated end to end');
        if (i.cost === 's1_cheaper' && i.sap_hosting === 'permitted') {
          scenario = 'S1'; status = 'CONDITIONAL';
          rejected.S2 = 'Verified cost evidence shows S1 is cheaper.';
          reasons.push('Verified cost evidence favors S1.');
          conditions.push('Confirm the cost evidence with FinOps');
        } else {
          if (i.cost === 'unknown' || i.cost === 's3_competitive') missing.push('Verified comparative cost evidence');
          status = missing.length ? 'CONDITIONAL' : 'RECOMMENDED';
          reasons.push('Apigee is not mandated for the route, so the simpler AgentCore-native S2 is preferred; S3 is still evaluated first in the POC.');
          conditions.push('SAP Integration and Security confirm the route without Apigee');
        }
      }
    }
  }
  if (scenario === 'S3') conditions.push('Non-duplicative responsibilities for AgentCore Gateway and Apigee', 'Correlation id joined across both gateways');
  if (i.workload === 'high_frequency') reasons.push('A high-frequency workload makes runtime and gateway charges material; it does not by itself make AWS cheaper.');
  if (scenario && scenario !== 'S1' && !('S1' in rejected)) rejected.S1 = 'Not preferred while AWS execution is approved and the SAP-hosted placement is not required by coupling or verified cost.';
  if (scenario === 'S1') for (const other of ['S2', 'S3']) if (!(other in rejected)) rejected[other] = 'Not selected: the SAP-hosted placement is preferred for the stated reasons.';
  if (scenario === 'S3' && !('S2' in rejected)) rejected.S2 = 'Not preferred while Apigee is required for the SAP route; S2 needs an approved exception.';
  if (scenario === 'S2' && !('S3' in rejected)) rejected.S3 = 'Not needed while Apigee is not mandated: it would add a gateway hop and its charges.';
  return {
    scenario, status, selectable: status === 'RECOMMENDED', evaluate_first: evaluateFirst, reasons, conditions, missing_evidence: missing,
    rejected: SCENARIOS.filter(s => s in rejected).map(s => [s, rejected[s]]), authority: selection.authority, revisit: selection.revisit,
  };
}

const blank = v => v === undefined || v === null || v === '';

export function estimate(components, volumes, rates) {
  const out = {};
  for (const sid of SCENARIOS) {
    let total = 0; const parts = [], missing = [];
    for (const c of components) {
      if (!(sid in c.applies)) continue;
      const v = volumes[c.id], r = (rates[c.id] || {})[sid];
      if (blank(v) || blank(r)) { missing.push(c.id); continue; }
      const cost = Number(v) * Number(r);
      total += cost; parts.push([c.id, cost]);
    }
    out[sid] = { total: missing.length ? null : total, partial: total, parts, missing };
  }
  return out;
}

export function breakEven(components, volumes, rates, component, a, b) {
  const line = sid => {
    let rest = 0, slope = 0;
    for (const c of components) {
      if (!(sid in c.applies)) continue;
      const r = (rates[c.id] || {})[sid], v = volumes[c.id];
      if (blank(r)) return null;
      if (c.id === component) slope = Number(r);
      else if (blank(v)) return null;
      else rest += Number(v) * Number(r);
    }
    return [rest, slope];
  };
  const la = line(a), lb = line(b);
  if (!la || !lb || la[1] === lb[1]) return null;
  const x = (lb[0] - la[0]) / (la[1] - lb[1]);
  return x > 0 ? x : null;
}
