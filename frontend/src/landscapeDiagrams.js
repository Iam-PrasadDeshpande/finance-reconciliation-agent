// Landscape architecture diagrams (MCP route and agent hosting) generated from landscapeData.js with the
// same renderer, lanes, node styling and legend as the MCP hosting & governance topology diagrams.
import {MCP, HOSTING} from './landscapeData';
import {renderTopology} from './mcpScenarios';

export const LANDSCAPE = [
  ...['S1', 'S2', 'S3'].map(id => ({key: `mcp-${id}`, kind: 'mcp', id, tab: MCP[id].title.split(' · ')[0] + ' path', title: MCP[id].title})),
  ...[['agentcore', 'AgentCore'], ['btp', 'SAP BTP'], ['microsoft', 'Foundry'], ['joule', 'Joule']].map(([id, tab]) => ({key: `host-${id}`, kind: 'hosting', id, tab: `Host · ${tab}`, title: HOSTING[id].title})),
];

const N = (id, row, col, title, sub, kind, extra = {}) => ({id, row, col, title, sub, kind, ...extra});
const LEGEND = [['invoke', 'Request / tool call'], ['return', 'Evidence / response'], ['identity', 'Identity / authentication']];
const CAPTIONS = [[104, 'IDENTITY AND SECURITY'], [224, 'REQUEST AND TOOL-CALL PATH'], [514, 'CROSS-CUTTING CONTROLS · design dependencies, not proved connections'], [654, 'OPEN DECISION']];

function kindOf(stage) {
  if (stage.type === 'ux') return 'agent';
  if (stage.type === 'agent') return 'domain';
  if (stage.type === 'gateway') return 'gateway';
  return /backend/i.test(stage.label) ? 'backend' : 'integration';
}

export function landscapeSvg(kind, id) {
  const d = (kind === 'mcp' ? MCP : HOSTING)[id];
  const n = d.stages.length;
  const nodes = d.stages.map((s, i) => N(`s${i}`, 1, i, s.label, `${s.owner}. ${s.detail}`, kindOf(s), {h: 124, stage: true}));
  nodes.push(N('idp', 0, 0, 'Identity and access', 'Caller or service identity is proved at every hop. The SAP backend role check is the final authorization.', 'identity'));
  const span = n / 4;
  d.controls.forEach(([name, text], i) => nodes.push(N(`c${i}`, 3, i * span, name, text, 'control', {span, h: 108})));
  nodes.push(N('decision', 4, 0, 'Open decision', d.decision, 'decision', {span: n, h: 70}));
  const edges = d.stages.slice(1).map((s, i) => [`s${i}`, `s${i + 1}`, 'invoke', d.stages[i].out]);
  edges.push([`s${n - 1}`, 's0', 'return', d.returnFlow]);
  const gateway = d.stages.findIndex(s => s.type === 'gateway');
  edges.push(['idp', 's1', 'identity', 'agent identity']);
  if (gateway > 1) edges.push(['idp', `s${gateway}`, 'identity', 'tool credential']);
  const sap = d.stages.map((s, i) => (s.type === 'sap' && i > 0 ? `s${i}` : null)).filter(Boolean);
  return renderTopology({
    cols: n, nodes, edges, bounds: [['SAP landscape', sap, 'sap']], captions: CAPTIONS, legend: LEGEND,
    title: d.title, chain: d.stages.map(s => s.label).join(' → '), banner: d.status.toUpperCase(),
    footer: 'Proposed design for review. Vendor names are design projections, not connected services. Nothing here is an approved tenant architecture.',
  });
}
