import React,{useEffect,useState} from 'react';
import {RECOMMENDATION} from './mcpScenarios';
import {GATES,PROVES,NOT_PROVEN} from './roleData';
import {DECISIONS as REGISTER,DECISION_SUMMARY,OWNER_DATE} from './mcpScenarios';
import './arch-split.css';
import './brief.css';

const POPUPS={
  change:['What would change the recommendation',RECOMMENDATION.changes],
  poc:['How a proof of concept settles it',RECOMMENDATION.poc],
  depends:['What the recommendation depends on',RECOMMENDATION.standards],
  limits:['What this demo proves, and what it does not',null],
};

export default function DecisionBrief({onComplete,onMcp,onAgentHosting}){
  const [popup,setPopup]=useState(null);
  useEffect(()=>{
    if(!popup)return;
    const close=event=>{if(event.key==='Escape')setPopup(null)};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[popup]);
  const headline=RECOMMENDATION.headline.replace(/^ARCHITECTURE_RECOMMENDED \(proposal for owner decision, not approval\): /,'');
  return <main className="mcp-comparison mcp-bird arch-page brief-page" aria-label="Decision brief">
    <header className="surface mcp-bird-header"><div><h2>Decision brief</h2><span className="eyebrow">WHAT NEEDS DECIDING, WHO OWNS IT, WHAT IS STILL OPEN</span></div><span className="pill warn">PROPOSAL FOR OWNER DECISION · NOT AN APPROVAL</span></header>
    <div className="brief-grid">
      <section className="surface brief-card" aria-label="Recommendation"><span className="eyebrow">PROPOSED BASELINE</span><h3>{headline.charAt(0).toUpperCase()+headline.slice(1)}</h3><ul>{RECOMMENDATION.why.map(x=><li key={x}>{x}</li>)}</ul>
        <div className="brief-links"><button type="button" onClick={()=>setPopup('change')}>What would change it</button><button type="button" onClick={()=>setPopup('poc')}>Proof plan</button><button type="button" onClick={()=>setPopup('depends')}>Depends on</button><button type="button" onClick={()=>setPopup('limits')}>Proves / does not prove</button></div>
        <div className="brief-links alt"><button type="button" onClick={onComplete}>Complete architecture →</button><button type="button" onClick={onMcp}>MCP hosting →</button><button type="button" onClick={onAgentHosting}>Agent hosting →</button></div></section>
      <section className="surface brief-card brief-register" aria-label="Decisions needed"><span className="eyebrow">DECISIONS · {REGISTER.length} · OWNER ANSWERS OF {OWNER_DATE}</span><p className="brief-counts" data-testid="decision-summary"><b>{DECISION_SUMMARY.DECIDED}</b> decided · <b>{DECISION_SUMMARY['OWNER-CONFIRMED']}</b> owner-confirmed, not independently verified · <b className="open">{DECISION_SUMMARY.OPEN}</b> still open</p>
        <table className="brief-table"><thead><tr><th scope="col">Decision</th><th scope="col">Proposal</th><th scope="col">Owner</th><th scope="col">Status</th></tr></thead><tbody>{REGISTER.map(item=><React.Fragment key={item.id}><tr data-testid={`decision-${item.id}`}><th scope="row">{item.title}<small>{item.scenarios.join(' · ')}</small></th><td>{item.proposal}</td><td>{item.owner}</td><td><span className="brief-open">{item.status}</span></td></tr>
          <tr className="brief-detail-row"><td colSpan="4"><details><summary>Owner answers, settled, remaining, options and proof</summary><div className="brief-detail"><div className="brief-answers"><h4>Owner answers</h4><ul>{item.answers.map(([q,a,state])=><li key={q}><span className={`brief-state ${state.toLowerCase()}`}>{state}</span> <strong>{q}</strong> {a}</li>)}</ul></div><div><h4>Settled by the documents</h4><ul>{item.settled.map(x=><li key={x}>{x}</li>)}</ul></div><div><h4>Only the owner or tenant can close</h4><ul>{item.remaining.map(x=><li key={x}>{x}</li>)}</ul></div><div><h4>Options</h4><ul>{item.options.map(x=><li key={x}>{x}</li>)}</ul></div><div><h4>Proof</h4><p>{item.proof}</p></div></div></details></td></tr></React.Fragment>)}</tbody></table></section>
      <section className="surface brief-card" aria-label="Proof gates"><span className="eyebrow">PROOF GATES · NONE PASSED</span>
        <ul className="brief-gates">{GATES.map(([id,text,state])=><li key={id}><b>{id}</b><span>{text}</span><em className={state.includes('P0')?'p0':''}>{state}</em></li>)}</ul></section>
    </div>
    {popup&&<div className="mcp-bird-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setPopup(null)}}><section className="surface mcp-bird-modal" role="dialog" aria-modal="true" aria-label={POPUPS[popup][0]}><div className="mcp-bird-modal-header"><div><span className="eyebrow">DECISION BRIEF · DESIGN REVIEW ONLY</span><h3>{POPUPS[popup][0]}</h3></div><button type="button" onClick={()=>setPopup(null)} autoFocus>Close</button></div><div className="mcp-bird-modal-body">{popup==='limits'?<div className="mcp-bird-modal-owners"><article><h4>This demo shows</h4><ul>{PROVES.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>This demo does not prove</h4><ul>{NOT_PROVEN.map(x=><li key={x}>{x}</li>)}</ul></article></div>:<ul>{POPUPS[popup][1].map(x=><li key={x}>{x}</li>)}</ul>}</div></section></div>}
  </main>;
}
