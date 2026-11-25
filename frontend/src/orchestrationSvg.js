// Orchestration graph: the orchestrator (MCP client) calls specialist agents (MCP servers) with tools/call,
// and each agent reaches application layers. Drawn by the same renderer as every other diagram in the app.
// Layers come from the stored events of each step, not from a fixed picture.
import {renderTopology} from './mcpScenarios';

export const ORCH_SIZE = {w: 1200, h: 660};
const N = (id, row, col, title, sub, kind, extra = {}) => ({id, row, col, title, sub, kind, ...extra});
const LEGEND = [['invoke', 'MCP-style tools/call (in-process)'], ['registry', 'Reaches application layer'], ['identity', 'Needs input'], ['approval', 'Blocked by a control']];
const LAYER = {
  'Selected gateway': ['Selected MCP gateway', 'gateway', 'Apigee, or AgentCore Gateway in S2'],
  'Domain MCP': ['Domain MCP tools', 'domain', 'Finance read tools'],
  'SAP BAIP': ['SAP integration', 'integration', 'API Management and iFlow'],
  'SAP backends': ['SAP backends', 'backend', 'S/4HANA, Central Finance, BW'],
  'Enterprise Databricks': ['Databricks', 'data', 'Data evidence'],
  'AWS runtime': ['Agent runtime', 'domain', 'Runs the finance agent'],
  'Business entry': ['Business request', 'agent', 'Intent and scope'],
  'AWS controls': ['Agent identity', 'identity', 'Workload identity'],
  'Model branch': ['AI advisory', 'agent', 'Explanation only'],
  'Write approval': ['Write approval', 'decision', 'Separate branch'],
  'Future BDC': ['BDC (future)', 'data', 'Reference only'],
  'AI Foundry design time': ['Agent registration', 'registry', 'Design time'],
};
const STATE_COLOR = {done: '#107E3E', running: '#E9730C', held: '#E9730C', blocked: '#BB0000', pending: undefined};

export function effectiveStatus(step, index, shown) {
  if (index < shown) return step.status;
  return index === shown ? 'running' : 'pending';
}

export function orchestrationSvg({plan, catalog, shown, selectedAgent}) {
  const cards = catalog?.agents || [];
  const specialists = cards.filter(a => a.kind !== 'orchestrator');
  const steps = plan?.steps || [];
  const revealed = Math.min(shown, steps.length);
  const stateOf = (step, index) => (plan ? effectiveStatus(step, index, shown) : 'pending');
  const byAgent = {};
  steps.forEach((step, index) => { (byAgent[step.agent] ||= []).push({step, index}); });
  const nodes = [];
  const dispatching = plan ? (revealed >= steps.length ? 'All steps dispatched' : `Dispatching step ${revealed + 1} of ${steps.length}`) : 'Waiting for a request';
  nodes.push(N('orch', 0, 1.5, 'Orchestrator · tool client', plan ? `${plan.orchestrator?.rule || ''}. ${dispatching}. It plans and calls tools; it never touches SAP.` : 'Ask a question to start. It plans and calls tools; it never touches SAP.', 'agent', {
    span: 3, h: 84, zone: 'agent:orchestrator', status: plan ? dispatching : 'Idle', statusColor: plan ? '#0A4F9E' : '#506778', stroke: selectedAgent === 'orchestrator' ? '#0A6ED1' : '#0A4F9E', strokeWidth: 2.4,
  }));
  specialists.forEach((agent, i) => {
    const mine = byAgent[agent.id] || [];
    const states = mine.map(({step, index}) => stateOf(step, index));
    const called = mine.length > 0 && states.some(s => s !== 'pending');
    const worst = states.includes('blocked') ? 'blocked' : states.includes('held') ? 'held' : states.includes('running') ? 'running' : called ? 'done' : 'pending';
    const doneCount = states.filter(s => s === 'done').length;
    nodes.push(N(`agent:${agent.id}`, 1, i + (6 - specialists.length) / 2, agent.name, `${agent.mcp_server} · ${agent.tools.join(', ')}`, 'domain', {
      h: 84, zone: `agent:${agent.id}`,
      status: mine.length ? (called ? `${doneCount}/${mine.length} calls done${mine.every(({step}) => !(step.trace?.layers?.length)) ? ' · computed locally' : ''}` : 'Queued') : 'Not called',
      statusColor: called ? STATE_COLOR[worst] : '#506778',
      stroke: selectedAgent === agent.id ? '#0A6ED1' : called ? STATE_COLOR[worst] : '#B8C7D3', strokeWidth: selectedAgent === agent.id ? 3.2 : called ? 2.2 : 1.2, dashed: !called && mine.length === 0,
    }));
  });
  // application layers reached, from the step traces
  const layerOrder = [];
  const layerEdges = [];
  steps.forEach((step, index) => {
    const status = stateOf(step, index);
    if (status === 'pending' || status === 'running') return;
    const zones = step.trace?.layers || [];
    zones.forEach((zone, k) => {
      if (!layerOrder.includes(zone)) layerOrder.push(zone);
      layerEdges.push([`agent:${step.agent}`, `layer:${zone}`, 'registry', k === 0 && step.trace?.count ? `${step.trace.count} events` : '']);
    });
  });
  layerOrder.forEach((zone, i) => {
    const meta = LAYER[zone] || [zone, 'control', ''];
    nodes.push(N(`layer:${zone}`, i < 6 ? 2 : 3, i % 6, meta[0], meta[2], meta[1], {h: 84, status: 'Reached', statusColor: '#0D6A33', stroke: '#107E3E', strokeWidth: 1.8}));
  });
  // dedupe layer edges between the same pair
  const seen = new Set();
  const uniqueLayerEdges = layerEdges.filter(([a, b]) => (seen.has(`${a}>${b}`) ? false : seen.add(`${a}>${b}`)));
  const edges = [];
  Object.entries(byAgent).forEach(([agentId, list]) => {
    const states = list.map(({step, index}) => stateOf(step, index));
    if (states.every(s => s === 'pending')) return;
    const worst = states.includes('blocked') ? 'blocked' : states.includes('held') ? 'held' : 'ok';
    const label = `#${list.map(({index}) => index + 1).join(' #')} ${list[0].step.tool}${list.length > 1 ? ` +${list.length - 1}` : ''}`;
    edges.push(['orch', `agent:${agentId}`, worst === 'blocked' ? 'approval' : worst === 'held' ? 'identity' : 'invoke', label, {active: states.includes('running')}]);
  });
  edges.push(...uniqueLayerEdges);
  return renderTopology({
    cols: 6, ys: [96, 224, 392, 508], nh: 84, height: ORCH_SIZE.h, nodes, edges, bounds: [], legend: LEGEND,
    captions: [[88, 'ORCHESTRATOR · TOOL CLIENT', 'end'], [382, 'APPLICATION LAYERS THE EVENTS TOUCHED', 'end']],
    title: plan ? `Orchestration · ${String(plan.intent).replace('_', ' ')}` : 'Orchestration · waiting for a request',
    chain: steps.length ? steps.map((s, i) => `#${i + 1} ${s.agent}.${s.tool}`).join(' → ') : 'Orchestrator → specialist agents (tool providers) → application layers',
    banner: 'SIMULATED AGENTS · DETERMINISTIC RULES · NO LLM · NO SAP WRITES',
    footer: 'Each arrow from the orchestrator is an in-process, MCP-style tool call (no MCP transport). Layers are drawn only from the stored events each step produced; steps with none were computed locally.',
  });
}
