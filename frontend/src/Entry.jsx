import React,{useState} from 'react';
import './agents.css';
import './workbench.css';
import './brief.css';
import {ROLES} from './roleData';

const EXAMPLES=['Reconcile November 2026 company code 1000 ledger 0L USD','Investigate this variance','Explain the route controls'];

export default function Entry({periodCount,localBundle,onOpenApp,onOpenAgents,onOpenArchitecture,onAsk,onGo}){
  const [text,setText]=useState(EXAMPLES[0]);
  return <main className="entry" aria-label="Finance agents home">
    <section className="entry-hero">
      <span className="eyebrow">FINANCE / AGENTS</span>
      <h2>Ask the finance agents</h2>
      <p>An orchestrator plans your request and calls specialist agents with MCP-style tool calls. They read the simulated SAP finance layers; people approve and nothing is posted.</p>
      <form className="entry-ask" onSubmit={event=>{event.preventDefault();if(text.trim())onAsk(text.trim())}}>
        <label htmlFor="entry-ask-input" className="sr-only">What should the agents do?</label>
        <input id="entry-ask-input" value={text} onChange={event=>setText(event.target.value)} aria-label="What should the agents do?"/>
        <button type="submit" className="primary">Run plan →</button>
      </form>
      <div className="entry-examples" role="group" aria-label="Example requests">{EXAMPLES.map(item=><button type="button" key={item} onClick={()=>setText(item)}>{item}</button>)}</div>
    </section>
    <section className="entry-how" aria-label="How it works">
      <div><strong>You ask</strong><span>Plain request</span></div><b aria-hidden="true">→</b>
      <div className="hot"><strong>Orchestrator</strong><span>Tool client · plans and calls</span></div><b aria-hidden="true">→</b>
      <div><strong>Specialist agents</strong><span>Tool providers · typed tools</span></div><b aria-hidden="true">→</b>
      <div><strong>Application layers</strong><span>Gateway · SAP integration · SAP · Databricks</span></div>
    </section>
    <ul className="entry-cards">
      <li><button type="button" className="entry-card" onClick={onOpenApp} aria-label="Open Finance Reconciliation Agent"><span aria-hidden="true">▦</span><strong>Close a period</strong><small>Worklist, variance and the detailed report. {periodCount} periods.</small><em>Open Close &amp; reconcile →</em></button></li>
      <li><button type="button" className="entry-card" onClick={onOpenAgents}><span aria-hidden="true">◆</span><strong>Watch the agents work</strong><small>See the orchestrator call each agent and which layers it reached.</small><em>Open Agents →</em></button></li>
      <li><button type="button" className="entry-card" onClick={onOpenArchitecture}><span aria-hidden="true">⬡</span><strong>Review the architecture</strong><small>Live run, S1 · S2 · S3 options, governance and diagrams.</small><em>Open Architecture →</em></button></li>
    </ul>
    {onGo&&<section className="entry-roles" aria-label="Start from your audience"><h3>Presenting this? Start from your audience</h3><ul>{ROLES.map(role=><li key={role.id}><strong>{role.name}</strong><small>{role.ask}</small><div className="role-links">{role.links.map(([id,label])=><button type="button" key={id+label} onClick={()=>onGo(id)}>{label} →</button>)}</div></li>)}</ul></section>
    }    {localBundle&&<div className="entry-download"><div><strong>Run it on your laptop</strong><span>Windows bundle. Python is needed on first launch. {Math.round(localBundle.bytes/1024)} KB · SHA-256 {localBundle.sha256.slice(0,12)}…</span></div><a href={localBundle.url} download="finance_reconciliation_local_windows.zip" aria-label="Download local Windows demo bundle">Download Windows bundle ↓</a></div>}
  </main>;
}
