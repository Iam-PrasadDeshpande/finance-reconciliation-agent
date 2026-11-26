import React from 'react';
import './launchpad.css';

// A SAP Fiori launchpad for the agents: every agent is a tile, tiles are grouped into sections, and the groups are reached through tabs
// ("All agents" is the catalogue; one tab per agent family). The groups come from the cockpit catalog, so a new agent module needs no change here.
const firstSentence = (text = '') => {
  const match = String(text).match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : String(text)).trim();
};

function Tile({agent, icon, active, calledSteps, onPick}) {
  const orchestrator = agent.kind === 'orchestrator';
  const called = calledSteps.length;
  const worst = calledSteps.some(s => s.status === 'blocked') ? 'blocked' : calledSteps.some(s => s.status === 'skipped') && calledSteps.every(s => s.status === 'skipped') ? 'skipped' : 'done';
  return <button type="button" className={`fi-tile ${orchestrator ? 'orchestrator' : ''} ${active ? 'active' : ''}`} aria-pressed={active} aria-label={`Select ${agent.name} agent`} data-agent={agent.id} onClick={onPick}>
    <span className="fi-tile-head"><span className="fi-tile-icon" aria-hidden="true">{orchestrator ? '◆' : icon}</span><span className="fi-tile-kind">{orchestrator ? 'Orchestrator' : 'Specialist agent'}</span></span>
    <strong className="fi-tile-title">{agent.name}</strong>
    <span className="fi-tile-sub">{firstSentence(agent.role)}</span>
    <span className="fi-tile-foot"><i>{agent.mode}</i><i>{agent.tools.length} tool{agent.tools.length === 1 ? '' : 's'}</i>{called > 0 && <em className={`fi-tile-state ${worst}`}>Called · {called} step{called === 1 ? '' : 's'}</em>}</span>
  </button>;
}

export function TileDetail({card}) {
  if (!card) return null;
  const sor = card.systems_of_record || [];
  return <aside className="fi-detail" data-testid="tile-detail" aria-live="polite" aria-label={`${card.name} details`}>
    <div><span className="eyebrow">{card.kind === 'orchestrator' ? 'ORCHESTRATOR' : 'AGENT'} · {String(card.mode).toUpperCase()}</span><h3>{card.name}</h3><p>{card.role}</p></div>
    <dl><dt>Tool provider</dt><dd>{card.mcp_server}</dd><dt>Tools</dt><dd>{card.tools.map(t => <i key={t} className="fi-chip">{t}</i>)}</dd><dt>Layers it can reach</dt><dd>{(card.layers || []).join(' → ') || 'None; it only plans and calls'}</dd>
      <dt>Systems of record</dt><dd data-testid="tile-systems-of-record">{sor.length ? sor.map(r => `${r.system}: ${r.scope}`).join(' · ') + '. ' + card.records_note : (card.records_note || 'None')}</dd>
      {card.sap && <><dt>SAP</dt><dd>{card.sap}</dd></>}{card.availability && <><dt>Availability</dt><dd>{card.availability}</dd></>}</dl>
  </aside>;
}

export default function AgentLaunchpad({catalog, modules = [], group, onGroup, selectedAgent, onPick, plan}) {
  const order = catalog?.order || [];
  const byId = Object.fromEntries(modules.map(m => [m.id, m]));
  const groups = order.map(id => ({id, name: catalog.domains?.[id]?.name || id, icon: byId[id]?.icon || '◇', blurb: byId[id]?.blurb || '', agents: catalog.domains?.[id]?.agents || []}));
  const total = groups.reduce((n, g) => n + g.agents.length, 0);
  const shown = group === 'all' ? groups : groups.filter(g => g.id === group);
  const card = groups.flatMap(g => g.agents).find(a => a.id === selectedAgent) || null;
  return <section className="surface fi-launchpad" aria-label="Agent launchpad" data-testid="agent-launchpad">
    <div className="fi-lp-head"><div><span className="eyebrow">AGENT LAUNCHPAD</span><strong>All agents</strong></div><small>{total} agents in {groups.length} groups · select a tile to see what it does, or ask below</small></div>
    <div className="fi-tabs domain-switch" role="tablist" aria-label="Agent family">
      <button type="button" role="tab" id="fi-tab-all" aria-selected={group === 'all'} aria-controls="fi-panel" className={group === 'all' ? 'active' : ''} data-count={total} onClick={() => onGroup('all')}>All agents</button>
      {groups.map(g => <button type="button" role="tab" key={g.id} id={`fi-tab-${g.id}`} aria-selected={group === g.id} aria-controls="fi-panel" className={group === g.id ? 'active' : ''} data-count={g.agents.length} onClick={() => onGroup(g.id)}>{g.name}</button>)}
    </div>
    <div id="fi-panel" role="tabpanel" aria-labelledby={`fi-tab-${group}`} className="fi-panel">
      {shown.map(g => <section key={g.id} className="fi-section" aria-label={g.name}>
        {group === 'all' && <h3 className="fi-section-title"><span aria-hidden="true">{g.icon}</span>{g.name}<small>{g.blurb}</small></h3>}
        <ul className="fi-tiles">{g.agents.map(agent => {
          const steps = plan?.domain === g.id ? (plan.steps || []).filter(s => s.agent === agent.id) : [];
          return <li key={agent.id}><Tile agent={agent} icon={g.icon} active={selectedAgent === agent.id} calledSteps={steps} onPick={() => onPick(agent.id, g.id)}/></li>;
        })}</ul>
      </section>)}
    </div>
    <TileDetail card={card}/>
  </section>;
}
