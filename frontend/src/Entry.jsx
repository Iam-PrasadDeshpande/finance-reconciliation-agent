import React,{useState} from 'react';
import './agents.css';
import './workbench.css';
import './brief.css';
import {ROLES} from './roleData';
import {DEFAULT_PERIOD} from './period';
import {useCockpit} from './cockpit';
import {EffectivePeriod,PeriodSelect,RouteChip,useAskText} from './PeriodUi';

const EXAMPLES=['Reconcile November 2026 company code 1000 ledger 0L USD','Investigate this variance','Explain the route controls'];

export default function Entry({periodCount,localBundle,onOpenApp,onOpenAgents,onOpenArchitecture,onOpenTreasury,onAsk,onGo,period=DEFAULT_PERIOD,periods,onPeriod}){
  const cockpit=useCockpit();
  const [text,setText]=useAskText(period,cockpit.def?.id);
  const examples=cockpit.modules.flatMap(m=>cockpit.examples(m.id,period).slice(0,2));
  return <main className="entry" aria-label="Finance agents home">
    <section className="entry-hero">
      <span className="eyebrow">FINANCE / AGENTS</span>
      <h2>Ask the finance agents</h2>
      <p>An orchestrator plans your request, routes it to the right agent module, and calls its specialist agents with MCP-style tool calls. They read the simulated SAP finance layers; people approve and nothing is posted.</p>
      <form className="entry-ask" onSubmit={event=>{event.preventDefault();if(text.trim())onAsk(text.trim())}}>
        {onPeriod&&<PeriodSelect period={period} periods={periods} onPeriod={onPeriod} id="entry-period"/>}<label htmlFor="entry-ask-input" className="sr-only">What should the agents do?</label>
        <input id="entry-ask-input" value={text} onChange={event=>setText(event.target.value)} aria-label="What should the agents do?"/>
        <button type="submit" className="primary">Run plan →</button>
      </form>
      <div className="entry-examples" role="group" aria-label="Example requests">{examples.map(item=><button type="button" key={item} onClick={()=>setText(item)}>{item}</button>)}</div>
      <span className="ask-meta"><EffectivePeriod text={text} period={period} periods={periods}/><RouteChip text={text}/></span>
    </section>
    <section className="entry-how" aria-label="How it works">
      <div><strong>You ask</strong><span>Plain request</span></div><b aria-hidden="true">→</b>
      <div className="hot"><strong>Orchestrator</strong><span>Tool client · plans and calls</span></div><b aria-hidden="true">→</b>
      <div><strong>Specialist agents</strong><span>Tool providers · typed tools</span></div><b aria-hidden="true">→</b>
      <div><strong>Application layers</strong><span>Gateway · SAP integration · SAP · Databricks</span></div>
    </section>
    <ul className="entry-cards">
      {cockpit.tabs.map(m=><li key={m.id}><button type="button" className="entry-card" onClick={()=>onGo?.(m.tab.id)} aria-label={`Open ${m.short_name}`} data-module={m.id}><span aria-hidden="true">{m.icon}</span><strong>{m.short_name}</strong><small>{m.blurb}</small><em>Open {m.short_name} →</em></button></li>)}
      <li><button type="button" className="entry-card" onClick={onOpenAgents}><span aria-hidden="true">◆</span><strong>Watch the agents work</strong><small>See the orchestrator call each agent and which layers it reached.</small><em>Open Agents →</em></button></li>
      <li><button type="button" className="entry-card" onClick={onOpenArchitecture}><span aria-hidden="true">⬡</span><strong>Review the architecture</strong><small>Live run, the three scenarios (SAP-centric, AgentCore-centric, SAP-hosted hybrid), MCP hosting and diagrams.</small><em>Open Architecture →</em></button></li>
    </ul>
    {onGo&&<section className="entry-roles" aria-label="Start from your audience"><h3>Presenting this? Start from your audience</h3><ul>{ROLES.map(role=><li key={role.id}><strong>{role.name}</strong><small>{role.ask}</small><div className="role-links">{role.links.map(([id,label])=><button type="button" key={id+label} onClick={()=>onGo(id)}>{label} →</button>)}</div></li>)}</ul></section>
    }    {localBundle&&<div className="entry-download"><div><strong>Run it on your laptop</strong><span>Windows bundle. Python is needed on first launch. {Math.round(localBundle.bytes/1024)} KB · SHA-256 {localBundle.sha256.slice(0,12)}…</span></div><a href={localBundle.url} download="finance_reconciliation_local_windows.zip" aria-label="Download local Windows demo bundle">Download Windows bundle ↓</a></div>}
  </main>;
}
