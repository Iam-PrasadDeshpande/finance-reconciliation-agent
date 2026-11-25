// Live architecture topology as vector SVG, drawn by the same renderer, lanes, node styling and legend as the
// MCP hosting & governance diagrams. Node outlines show live state: orange = processing now, green = visited,
// blue = selected. Edges leaving the current zone are highlighted while a run is in progress.
import './live-architecture.css';
import {renderTopology} from './mcpScenarios';

export const LIVE_SIZE = {w: 1200, h: 520};
const N = (id, row, col, title, sub, kind, extra = {}) => ({id, row, col, title, sub, kind, ...extra});
const LEGEND = [['invoke', 'Tool call'], ['return', 'Evidence'], ['registry', 'Reference'], ['deploy', 'Registration'], ['identity', 'Identity'], ['approval', 'Approval']];
const CAPTIONS = [[92, 'DESIGN TIME AND IDENTITY', 'end'], [322, 'RESULT, EVIDENCE AND APPROVAL', 'start']];
const KIND = {'Business entry': 'agent', 'AWS runtime': 'domain', 'Selected gateway': 'gateway', 'Domain MCP': 'domain', 'SAP BAIP': 'integration', 'SAP backends': 'backend', 'Enterprise Databricks': 'data', 'Future BDC': 'data', 'Model branch': 'agent', 'AI Foundry design time': 'registry', 'AWS controls': 'identity', 'Write approval': 'decision'};
const POS = {'AI Foundry design time': [0, 0], 'AWS controls': [0, 1], 'Business entry': [1, 0], 'AWS runtime': [1, 1], 'Selected gateway': [1, 2], 'Domain MCP': [1, 3], 'SAP BAIP': [1, 4], 'SAP backends': [1, 5], 'Enterprise Databricks': [2, 3], 'Future BDC': [2, 4], 'Write approval': [2, 0], 'Model branch': [2, 2]};

export function liveSvg({registry, events, scenario, selectedZone, liveRunning, reportReady, zoneShort}) {
  const components = registry?.components || [];
  const zoneOf = Object.fromEntries(components.map(c => [c.component_id, c.zone]));
  const count = zone => components.filter(c => c.zone === zone).length;
  const stats = {};
  for (const event of events) {
    const zone = zoneOf[event.direction === 'response' ? event.source_component_id : event.target_component_id];
    if (zone) stats[zone] = (stats[zone] || 0) + 1;
  }
  const last = events.at(-1);
  const current = last ? zoneOf[last.direction === 'response' ? last.source_component_id : last.target_component_id] : null;
  const processing = liveRunning && current;
  const node = zone => {
    const [row, col] = POS[zone];
    const here = processing && current === zone, seen = Boolean(stats[zone]);
    const status = here ? 'Processing now' : seen ? `${stats[zone]} events` : zone === 'Future BDC' ? 'Future / simulated' : zone === 'Write approval' ? 'Separate branch' : 'Waiting';
    const sub = zone === 'Selected gateway' ? `${scenario} · ${scenario === 'S1' ? 'Apigee path (S1, S3)' : 'AgentCore Gateway path (S2)'}` : `${zone} · ${count(zone)} components`;
    return N(zone, row, col, zoneShort[zone] || zone, sub, KIND[zone], {
      zone, status, statusColor: here ? '#B45309' : seen ? '#0D6A33' : '#506778',
      stroke: zone === selectedZone ? '#0A6ED1' : here ? '#E9730C' : seen ? '#107E3E' : undefined,
      strokeWidth: zone === selectedZone ? 3.2 : here ? 3.4 : seen ? 2 : undefined, dashed: zone === 'Future BDC', cls: here ? 'node-current' : '',
    });
  };
  const nodes = Object.keys(POS).map(node);
  nodes.push(N('__report', 2, 1, 'Business report', reportReady ? 'Analysis and evidence are ready' : 'Run the architecture to generate the result', 'control', {
    zone: '__report', status: reportReady ? 'Complete · open report' : 'Awaiting run', statusColor: reportReady ? '#0D6A33' : '#506778', stroke: reportReady ? '#107E3E' : undefined, strokeWidth: reportReady ? 2 : undefined,
  }));
  const hot = from => Boolean(processing && current === from);
  const edges = [
    ['Business entry', 'AWS runtime', 'invoke', 'business intent', {active: hot('Business entry')}],
    ['AWS runtime', 'Selected gateway', 'invoke', 'MCP tool call', {active: hot('AWS runtime')}],
    ['Selected gateway', 'Domain MCP', 'invoke', 'authorized call', {active: hot('Selected gateway')}],
    ['Domain MCP', 'SAP BAIP', 'invoke', 'typed SAP request', {active: hot('Domain MCP')}],
    ['SAP BAIP', 'SAP backends', 'invoke', 'backend read', {active: hot('SAP BAIP')}],
    ['Domain MCP', 'Enterprise Databricks', 'invoke', 'data evidence', {active: hot('Enterprise Databricks')}],
    ['Enterprise Databricks', 'Future BDC', 'registry', 'future reference'],
    ['AI Foundry design time', 'AWS runtime', 'deploy', 'agent registration', {off: -34}],
    ['AWS controls', 'AWS runtime', 'identity', 'agent identity'],
    ['SAP backends', 'Model branch', 'return', 'SAP evidence', {labelAt: 'mid'}],
    ['Enterprise Databricks', 'Model branch', 'return', 'data evidence', {straight: true}],
    ['Model branch', '__report', 'return', 'deterministic result', {straight: true}],
    ['__report', 'Write approval', 'approval', 'separate write branch'],
  ];
  return renderTopology({
    cols: 6, ys: [100, 214, 334], nh: 80, height: LIVE_SIZE.h, nodes, edges, bounds: [['SAP landscape', ['SAP BAIP', 'SAP backends'], 'sap']], captions: CAPTIONS, legend: LEGEND,
    title: `Live run (simulator) · ${scenario === 'S1' ? 'Apigee gateway path (S1, S3)' : 'AgentCore Gateway path (S2)'}`,
    chain: 'Finance request → external agent → selected gateway → domain tools → SAP integration → SAP backend',
    banner: processing ? 'RUN IN PROGRESS · SIMULATED' : 'SIMULATED · NO TENANT CONNECTED',
    footer: 'Simulator scope: it replays gateway behaviour and draws the agent in the AWS runtime zone for both paths. It is not the V5.1 topology: see Diagrams D2 to D4. Orange: processing now. Green: visited. Blue: selected zone.',
  });
}
