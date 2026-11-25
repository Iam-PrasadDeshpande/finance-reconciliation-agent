// Audience lenses, close-process ownership, decisions and proof gates. Gates G1-G7 and the "not proven" list
// come from docs/POC_LIMITATIONS.md; the recommendation comes from mcpScenarios.js. Nothing here is an approval.
export const ROLES = [
  {id: 'ea', name: 'Enterprise architect', ask: 'Is the target coherent, governable and decision-ready?', links: [['brief', 'Decision brief'], ['ontology', 'Ontology'], ['approaches', 'Complete architecture']]},
  {id: 'ia', name: 'Integration architect', ask: 'Which interfaces, identities and hops does each route need?', links: [['mcp', 'MCP hosting'], ['ontology', 'Ontology'], ['diagrams', 'Detailed diagrams']]},
  {id: 'fin', name: 'Finance', ask: 'Can I trust the close result, and who approves what?', links: [['business', 'Close & reconcile'], ['treasury', 'Cash & treasury'], ['agents', 'Ask the agents']]},
  {id: 'ba', name: 'Business architect', ask: 'What changes in the process, and where are the controls?', links: [['business', 'Who does what'], ['agents', 'Agent roles'], ['brief', 'Decision brief']]},
];

export const PROCESS = [
  ['Collect source balances', 'System', 'Simulated S/4HANA, Central Finance and BW snapshots'],
  ['Compare and compute variance', 'Agent · read only', 'Reconciliation agent, deterministic rules'],
  ['Explain the variance', 'Agent · read only', 'Investigator agent; advisory, never a posting'],
  ['Draft an adjustment proposal', 'Agent · local draft', 'Proposal agent writes a draft only, never to SAP'],
  ['Approve', 'Person', 'Finance approver, a different role from the maker'],
  ['Post to SAP', 'Outside this demo', 'Human-approved path; only a nonproduction marker is simulated'],
];
export const CONTROLS = ['Maker and approver are separate roles', 'Approval is bound to the proposal hash and case version', 'Every step is stored as an event you can inspect', 'No agent tool can post to SAP'];

export const DECISIONS = [
  ['Route for the SAP finance interface', 'S1 as the proof-of-concept baseline', 'Enterprise architecture + SAP integration'],
  ['Agent runtime host', 'Validate the approved enterprise platform first; SAP BTP is the conditional alternative', 'Enterprise AI + platform team'],
  ['Identity: user delegation or service identity', 'Prove service identity first, then delegation', 'Security + SAP Basis'],
  ['Registry source of truth', 'API hub for the SAP domain; agent registry holds a reference', 'Enterprise AI Foundry'],
  ['Model access (PTP/PAP)', 'Separate approval; does not decide the host', 'Enterprise AI'],
  ['Posting to SAP', 'Out of scope. Human approval and nonproduction evidence first', 'Finance + SAP'],
  ['12-month total cost', 'Unmeasured; needs an estimate per route', 'Finance + procurement'],
];

export const GATES = [
  ['G1', 'Scenario, owners, licensing, cost and network topology', 'OPEN'],
  ['G2', 'Gateway inbound authorization, target type and outbound credential proof', 'OPEN'],
  ['G3', 'Integration Suite identity mapping and SAP authorization at all backends', 'OPEN · P0'],
  ['G4', 'Finance rules, source contracts, freshness and reconciliation vectors', 'OPEN'],
  ['G5', 'Human approval tests and nonproduction SAP document evidence', 'OPEN · P0'],
  ['G6', 'Privacy, Unity Catalog grants, BDC sharing and Portkey retention', 'OPEN'],
  ['G7', 'Cross-system trace correlation, retention and incident ownership', 'OPEN'],
];

export const PROVES = ['The workflow shape: ask, plan, specialist calls, evidence, proposal, approval', 'What each agent may and may not do, shown as read-only tools and refusals', 'Where each route puts the gateway, the identity hop and the owner'];
export const NOT_PROVEN = ['Any live SAP, AWS, Google or Databricks connection', 'A real MCP transport (calls are in-process and MCP-shaped)', 'Identity propagation, performance, availability or cost'];
