import React from 'react';
import './spaces.css';

// SAP Fiori "Spaces and Pages" shell: level 1 is a Space (a tab of the shell), level 2 is a Page made of sections of tiles.
// Opening a tile enters the app; the breadcrumb leads back to the page. The spaces and tiles are data, not code.
export const SPACES = [
  {id: 'apps', icon: '▦', label: 'Finance apps', short: 'Apps', hint: 'The agent apps you work in'},
  {id: 'agents', icon: '◆', label: 'Agents', short: 'Agents', hint: 'Ask, catalog and technical options'},
  {id: 'arch', icon: '⬡', label: 'Architecture & operations', short: 'Architecture', hint: 'How the agents run, are hosted and governed'},
];

export function SpaceBar({space, onSpace, onKeyDown, label = 'Spaces'}) {
  return <div className="fi-spacebar" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
    {SPACES.map(s => <button type="button" role="tab" key={s.id} data-space={s.id} tabIndex={space === s.id ? 0 : -1} aria-selected={space === s.id} className={space === s.id ? 'active' : ''} onClick={() => onSpace(s.id)}>
      <span className="tab-icon" aria-hidden="true">{s.icon}</span><span className="tab-label-full">{s.label}</span><span className="tab-label-mobile">{s.short}</span>
    </button>)}
  </div>;
}

export function Crumb({space, page, onHome}) {
  const meta = SPACES.find(s => s.id === space);
  return <nav className="fi-crumb" aria-label="Breadcrumb">
    <button type="button" onClick={onHome} data-testid="crumb-home">{meta?.label}</button><span aria-hidden="true">›</span><strong aria-current="page">{page}</strong>
  </nav>;
}

function Tile({tile, onOpen}) {
  return <button type="button" className={`fi-gtile ${tile.accent || ''} ${tile.cls || ''}`} data-tile={tile.id} data-module={tile.module} aria-label={`Open ${tile.title}`} onClick={() => onOpen(tile.id)}>
    <span className="fi-gtile-head"><span className="fi-gtile-icon" aria-hidden="true">{tile.icon}</span>{tile.tag && <i className="fi-gtile-tag">{tile.tag}</i>}</span>
    <strong className="fi-gtile-title">{tile.title}</strong>
    <span className="fi-gtile-sub">{tile.sub}</span>
    <span className="fi-gtile-foot">{(tile.foot || []).map(f => <i key={f}>{f}</i>)}</span>
  </button>;
}

// Sections of tiles without a page wrapper (used inside My Home, which has its own main landmark).
export function TileSections({sections, onOpen}) {
  return sections.map(section => <section key={section.title} className="fi-page-section" aria-label={section.title}>
    <h3>{section.title}{section.note && <small>{section.note}</small>}</h3>
    <ul className="fi-gtiles">{section.tiles.map(tile => <li key={tile.id}><Tile tile={tile} onOpen={onOpen}/></li>)}</ul>
  </section>);
}

// A page: a title and sections, each section a titled grid of tiles.
export function TilePage({testid, title, subtitle, sections, onOpen}) {
  return <main className="fi-page" aria-label={title} data-testid={testid}>
    <header className="fi-page-head"><h2>{title}</h2><p>{subtitle}</p></header>
    <TileSections sections={sections} onOpen={onOpen}/>
  </main>;
}

export const ARCH_PAGES = [
  {id: 'architecture', icon: '▶', title: 'Live run', sub: 'Replay a synthetic run through the selected scenario', section: 'Run and explore'},
  {id: 'diagrams', icon: '◫', title: 'Diagrams', sub: 'Ten generated diagrams with zoom and export', section: 'Run and explore'},
  {id: 'approaches', icon: '⬡', title: 'Complete architecture', sub: 'Three scenarios end to end; S1 and S3 preferred', section: 'Hosting and governance'},
  {id: 'mcp', icon: '⇄', title: 'MCP hosting', sub: 'How the MCP is exposed, hosted and run', section: 'Hosting and governance'},
  {id: 'agenthost', icon: '◈', title: 'Agent hosting', sub: 'Where the finance agent runs', section: 'Hosting and governance'},
  {id: 'registry', icon: '☰', title: 'Registry', sub: 'Where agents and MCP servers are catalogued', section: 'Hosting and governance'},
  {id: 'selection', icon: '⚖', title: 'Selection & cost', sub: 'Recommendation, gateways, cost, AWS account', section: 'Decide'},
  {id: 'brief', icon: '✎', title: 'Decision brief', sub: 'What is open and who owns it', section: 'Decide'},
  {id: 'questions', icon: '?', title: 'Architecture questions', sub: 'Open questions with replayable evidence', section: 'Decide'},
  {id: 'ontology', icon: '◎', title: 'Ontology', sub: 'Concepts and how the agents use them', section: 'Concepts and evidence'},
  {id: 'evidence', icon: '✓', title: 'Evidence & correlation', sub: 'Case evidence, traces and correlation', section: 'Concepts and evidence'},
];

export const archSections = () => {
  const order = [];
  ARCH_PAGES.forEach(p => { if (!order.includes(p.section)) order.push(p.section); });
  return order.map(title => ({title, tiles: ARCH_PAGES.filter(p => p.section === title).map(p => ({id: p.id, icon: p.icon, title: p.title, sub: p.sub, foot: ['Open']}))}));
};
