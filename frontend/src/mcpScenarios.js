// Architecture V5.1: every scenario, comparison table and diagram on the Architecture pages is generated from architectureModel.json,
// which is exported from the canonical backend model (poc/architecture_model.py). Do not define scenario facts here.
// Nothing in this file is tenant evidence. "TBD · REQUIRES VALIDATION" marks missing proof.
import MODEL from './architectureModel.json';

export const ACCESSED = '2026-11-25';
export const TBD = 'TBD · REQUIRES VALIDATION';
export const IDS = MODEL.ids;
export const BANNER = MODEL.banner;

export const SCENARIOS = Object.fromEntries(MODEL.ids.map(id => {
  const s = MODEL.scenarios[id];
  const spec = MODEL.diagrams[{ S1: 'D2', S2: 'D3', S3: 'D4' }[id]];
  return [id, { ...s, label: s.name, chain: spec.chain, summary: s.objective, baseline: s.hosting_note }];
}));
export const MODEL_VERSION = MODEL.version;
export const DIAGRAM_NAMES = MODEL.diagramNames;
export const DIAGRAM_KEYS = Object.keys(MODEL.diagrams);

export const GLOSSARY = [
  ['MCP client', 'Agent-side component that discovers and invokes MCP tools.'],
  ['MCP server', 'Protocol endpoint exposing tools and resources over MCP.'],
  ['Managed MCP endpoint (Pattern A)', 'An approved API exposed as an MCP tool by Apigee. No separate custom MCP application server is required.'],
  ['Custom MCP server (Pattern B)', 'Independently deployed MCP business logic on the hosting platform of the scenario, exposed or proxied by Apigee.'],
  ['MCP gateway', 'Governed entry point that routes, authorizes and applies policy. It is not necessarily where tool logic runs.'],
  ['Registry', 'Catalog and discovery of agents and MCP servers. Control plane only; never an invocation hop and not proof of reachability or authorization.'],
  ['AgentCore Runtime / Gateway / Registry', 'Three distinct AWS capabilities: where an agent runs, the gateway that routes tool calls, and the catalog.'],
  ['Portkey', 'LLM gateway for every scenario. Independent of the MCP gateway and the registry.'],
  ['Integration Suite', 'SAP integration boundary between the gateway and the SAP backend.'],
  ['Cloud Connector', 'Private connectivity to the SAP landscape; applies only where the connectivity model needs it.'],
];

// Comparison rows: [dimension, S1, S2, S3]
export const MATRIX = MODEL.comparison;
export const CONN_COLS = MODEL.connCols;
export const CONNECTIONS = MODEL.connections;
export const DOMAINS = MODEL.domains;
export const RECOMMENDATION = { headline: MODEL.recommendation.headline, why: MODEL.recommendation.why, standards: MODEL.recommendation.depends, open: MODEL.recommendation.open, changes: MODEL.recommendation.changes, poc: MODEL.recommendation.poc };
export const EVIDENCE = MODEL.evidence;
export const EVIDENCE_NOTE = MODEL.evidenceStatus;
export const S1_REGISTRY = MODEL.s1Registry;
export const OWNER_DATE = MODEL.ownerDate;
export const DECISION_SUMMARY = MODEL.decisionSummary;
export const DECISIONS = MODEL.decisions;

const LEGEND_TEXT = { invoke: 'Runtime invocation', registry: 'Registration / discovery', llm: 'LLM invocation', identity: 'Identity / token', audit: 'Audit / correlation', approval: 'Approval', deploy: 'Deployment' };
export const LEGEND = ['invoke', 'registry', 'llm', 'identity', 'audit'].map(k => [k, LEGEND_TEXT[k]]);

export function diagramSpec(key) { return MODEL.diagrams[key]; }
export function diagramSvg(key) {
  const d = MODEL.diagrams[key];
  return renderTopology({ ...d, title: d.title, captions: (d.lanes || []).map(([row, text]) => [(d.ys || [118, 258, 398, 528, 668])[row] - (row >= 2 ? 18 : 26), text]), legend: d.legend.map(k => [k, LEGEND_TEXT[k]]), height: d.height });
}
export function topologySvg(id) { return diagramSvg({ S1: 'D2', S2: 'D3', S3: 'D4' }[id]); }

// Shared renderer: every architecture diagram in the app is drawn here so lanes, node styling, edge styles, legend and header stay identical.
const FILL = { control: '#FFFFFF', decision: '#FFF8EE', agent: '#E8F1FB', gateway: '#FFF1E0', domain: '#EAF6EC', integration: '#F0EAF8', backend: '#E3E9EF', data: '#EEF2F5', registry: '#E5F5F2', artifact: '#F3F3F3', identity: '#FFF7DA', ui: '#EEF4FA', llm: '#F4EAFA', store: '#EEF2F5' };
const EDGE = {
  invoke: { c: '#0A4F9E', w: 2.6, d: '' },
  registry: { c: '#0C8F76', w: 2, d: '7 4' },
  deploy: { c: '#6B6B6B', w: 2, d: '2 4' },
  identity: { c: '#C26A00', w: 2, d: '8 3 2 3' },
  approval: { c: '#B3261E', w: 2.4, d: '10 3' },
  return: { c: '#0C8F76', w: 2.2, d: '7 4' },
  llm: { c: '#7B3FA0', w: 2.6, d: '' },
  audit: { c: '#5A6B7B', w: 1.8, d: '1.5 4' },
};
const BOUND = { google: '#C26A00', aws: '#0A4F9E', sap: '#5B3F8C' };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function wrap(text, max) {
  const out = []; let line = '';
  for (const word of String(text).split(' ')) {
    if ((line + ' ' + word).trim().length > max && line) { out.push(line); line = word; } else line = (line + ' ' + word).trim();
  }
  if (line) out.push(line);
  return out;
}


export function renderTopology(t) {
  const W = 1200, H = t.height || 840, M = 30, GAP = 30, NH = t.nh || 92;
  const nw = (W - 2 * M - (t.cols - 1) * GAP) / t.cols;
  const ys = t.ys || [118, 258, 398, 528, 668];
  const pos = {};
  // A node grows to fit all of its text (up to the row gap) instead of silently cutting lines off.
  const needed = (n, w) => 20 + wrap(n.title, Math.floor(w / 7.1)).length * 15 + wrap(n.sub, Math.floor((w - 8) / 5.7)).length * 12.5 + 8 + (n.status ? 14 : 0);
  for (const n of t.nodes) {
    const span = n.span || 1, w = span * nw + (span - 1) * GAP, base = n.h || NH, need = Math.ceil(needed(n, w));
    pos[n.id] = { x: M + n.col * (nw + GAP), y: ys[n.row], w, h: need > base ? Math.min(need, 136) : base, clipped: need > 136, n };
  }
  const parts = [];
  // boundaries first
  for (const [label, members, kind] of t.bounds) {
    const bs = members.map(m => pos[m]);
    const x = Math.min(...bs.map(b => b.x)) - 10, y = Math.min(...bs.map(b => b.y)) - 24;
    const x2 = Math.max(...bs.map(b => b.x + b.w)) + 10, y2 = Math.max(...bs.map(b => b.y + b.h)) + 5;
    parts.push(`<rect x="${x}" y="${y}" width="${x2 - x}" height="${y2 - y}" rx="8" fill="none" stroke="${BOUND[kind]}" stroke-width="2" stroke-dasharray="14 5"/>`);
    parts.push(`<text x="${x + 8}" y="${y + 15}" font-size="12" font-weight="700" fill="${BOUND[kind]}">${esc(label)}</text>`);
  }
  // identity band label
  const cap = (y, text, anchor = 'end') => parts.push(`<text x="${anchor === 'end' ? W - M : M}" y="${y}" font-size="11.5" font-weight="700" fill="#506778" text-anchor="${anchor}">${text}</text>`);
  for (const [y, text, anchor] of t.captions) cap(y, text, anchor);
  // edges
  const labels = [];
  const arrows = [];
  const idCount = {};
  for (const [a, b, type, label, opts = {}] of t.edges) {
    const slot = type === 'identity' ? (idCount[a] = (idCount[a] ?? -1) + 1) : 0;
    const A = pos[a], B = pos[b], st = opts.active ? { ...EDGE[type], c: '#E9730C', w: EDGE[type].w + 1 } : EDGE[type];
    const ac = { x: A.x + A.w / 2, y: A.y + A.h / 2 }, bc = { x: B.x + B.w / 2, y: B.y + B.h / 2 };
    let d, lx, ly, ex, ey, dx, dy;
    if (type === 'return' && A.n.row === B.n.row && !opts.straight) {
      const sx = A.x + A.w / 2, tx = B.x + B.w / 2, y0 = A.y + A.h, y1 = y0 + 56;
      d = `M${sx},${y0} L${sx},${y1} L${tx},${y1} L${tx},${y0}`; lx = (sx + tx) / 2; ly = y1 - 7; ex = tx; ey = y0; dx = 0; dy = -1;
    } else if (A.n.row === B.n.row) {
      const left = A.x < B.x;
      const sx = left ? A.x + A.w : A.x, tx = left ? B.x : B.x + B.w, y = ac.y + (type === 'identity' ? 14 : 0);
      d = `M${sx},${y} L${tx},${y}`; lx = (sx + tx) / 2; ly = A.y + A.h + (A.n.row === 1 ? 26 : 14); ex = tx; ey = y; dx = left ? 1 : -1; dy = 0;
    } else {
      const down = A.y < B.y;
      const sy = down ? A.y + A.h : A.y, ty = down ? B.y : B.y + B.h;
      const off = type === 'identity' ? 14 + slot * 40 : type === 'approval' ? -12 : (opts.off || 0);
      const sx = ac.x + off, tx = bc.x + off, my = opts.my ?? (sy + ty) / 2;
      d = `M${sx},${sy} L${sx},${my} L${tx},${my} L${tx},${ty}`;
      if (type === 'identity') { lx = sx; ly = sy + (down ? 18 + slot * 14 : -8); } else if (opts.labelAt === 'mid') { lx = (sx + tx) / 2; ly = my - 6; } else { lx = tx; ly = down ? ty - 8 : ty + 20; } ex = tx; ey = ty; dx = 0; dy = down ? 1 : -1;
    }
    parts.push(`<path d="${d}" fill="none" stroke="${st.c}" stroke-width="${st.w}"${st.d ? ` stroke-dasharray="${st.d}"` : ''}${opts.active ? ' class="live-flow"' : ''} data-edge="${a}-${b}"/>`);
    const s = 7;
    arrows.push(dx !== 0
      ? `<polygon points="${ex},${ey} ${ex - dx * s * 1.6},${ey - s * 0.7} ${ex - dx * s * 1.6},${ey + s * 0.7}" fill="${st.c}"/>`
      : `<polygon points="${ex},${ey} ${ex - s * 0.7},${ey - dy * s * 1.6} ${ex + s * 0.7},${ey - dy * s * 1.6}" fill="${st.c}"/>`);
    if (label) labels.push([lx, ly, label, st.c]);
  }
  parts.push(...arrows);
  // nodes
  for (const n of t.nodes) {
    const p = pos[n.id];
    const tag = `${n.stage ? ' data-stage="1"' : ''}${n.kind === 'control' ? ' data-control="1"' : ''}`;
    parts.push(`<rect data-node="${n.id}"${p.clipped ? ' data-clipped="1"' : ''}${tag} x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="7" fill="${FILL[n.kind]}" stroke="${n.stroke || '#506778'}" stroke-width="${n.strokeWidth || 1.4}"${n.dashed ? ' stroke-dasharray="7 4"' : ''}${n.cls ? ` class="${n.cls}"` : ''}/>`);
    const title = wrap(n.title, Math.floor(p.w / 7.1));
    title.forEach((line, i) => parts.push(`<text x="${p.x + 8}" y="${p.y + 20 + i * 15}" font-size="12.5" font-weight="700" fill="#1D2D3E">${esc(line)}</text>`));
    const sub = wrap(n.sub, Math.floor((p.w - 8) / 5.7));
    sub.forEach((line, i) => parts.push(`<text x="${p.x + 8}" y="${p.y + 20 + title.length * 15 + i * 12.5}" font-size="10.5" fill="#34495C">${esc(line)}</text>`));
    if (n.status) parts.push(`<text x="${p.x + 8}" y="${p.y + p.h - 9}" font-size="10.5" font-weight="700" fill="${n.statusColor || '#34495C'}">${esc(n.status)}</text>`);
    if (n.zone) parts.push(`<rect data-zone="${esc(n.zone)}" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="7" fill="transparent"/>`);
  }
  for (const [lx, ly, label, c] of labels) {
    const w = label.length * 5.6 + 10;
    parts.push(`<rect x="${lx - w / 2}" y="${ly - 11}" width="${w}" height="15" rx="3" fill="#F1F4F7" opacity="0.94"/><text x="${lx}" y="${ly}" font-size="10.5" font-weight="600" fill="${c}" text-anchor="middle">${esc(label)}</text>`);
  }
  // legend
  let lx0 = M;
  parts.push(`<rect x="${M - 8}" y="${H - 54}" width="${W - 2 * M + 16}" height="40" rx="6" fill="#FFFFFF" stroke="#D9E1E7"/>`);
  parts.push(`<text x="${M}" y="${H - 36}" font-size="11" font-weight="700" fill="#506778">LEGEND</text>`);
  for (const [type, text] of t.legend) {
    const st = EDGE[type];
    parts.push(`<line x1="${lx0 + 60}" y1="${H - 40}" x2="${lx0 + 90}" y2="${H - 40}" stroke="${st.c}" stroke-width="${st.w}"${st.d ? ` stroke-dasharray="${st.d}"` : ''}/><text x="${lx0 + 96}" y="${H - 36}" font-size="11" fill="#1D2D3E">${esc(text)}</text>`);
    lx0 += 96 + text.length * 5.4 + 8;
  }
  parts.push(`<text x="${M}" y="${H - 20}" font-size="10.5" fill="#506778">${esc(t.footer)}</text>`);
  const title = t.title;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${H}" role="img" aria-labelledby="t d" font-family="'Segoe UI','Segoe UI Variable','Helvetica Neue',Arial,sans-serif" text-rendering="geometricPrecision"><title id="t">${esc(title)}</title><desc id="d">${esc(t.chain)}</desc><rect width="1200" height="${H}" fill="#F1F4F7"/><text x="${M}" y="40" font-size="20" font-weight="700" fill="#1D2D3E">${esc(title)}</text><text x="${M}" y="62" font-size="12" fill="#34495C">${esc(t.chain.length > 150 ? t.chain.slice(0, 147) + '…' : t.chain)}</text><text x="${M}" y="82" font-size="11" fill="#B3261E" font-weight="700">${esc(t.banner)}</text>${parts.join('')}</svg>\n`;
}
