import React,{useState} from 'react';
import './agents.css';
import './workbench.css';
import './brief.css';
import {DEFAULT_PERIOD} from './period';
import {useCockpit} from './cockpit';
import {TileSections} from './Spaces';
import {EffectivePeriod,PeriodSelect,RouteChip,useAskText} from './PeriodUi';

const HOME_TABS=[{id:'how',icon:'⇢',label:'How it works',short:'How'},{id:'apps',icon:'▦',label:'Finance apps',short:'Apps'},{id:'arch',icon:'⬡',label:'Agents & architecture',short:'Architecture'}];
const HOW=[
  {title:'You ask',line:'Plain request',detail:'Type a finance question or pick an example; the period you choose applies.'},
  {title:'Orchestrator',line:'Tool client · plans and calls',detail:'Routes the request to the right agent app and plans the tool calls.',hot:true},
  {title:'Specialist agents',line:'Tool providers · typed tools',detail:'Each agent has typed, read-only tools; people approve and nothing is posted to SAP.'},
  {title:'Application layers',line:'Gateway · SAP integration · SAP · Databricks',detail:'Simulated layers that answer the tool calls; no tenant is connected.'}];
const EXAMPLES=['Reconcile November 2026 company code 1000 ledger 0L USD','Investigate this variance','Explain the route controls'];

export default function Entry({periodCount,localBundle,onOpenApp,onOpenAgents,onOpenAgentPage,onOpenArchitecture,onOpenTreasury,onAsk,onGo,period=DEFAULT_PERIOD,periods,onPeriod}){
  const cockpit=useCockpit();
  const [text,setText]=useAskText(period,cockpit.def?.id);
  const [space,setSpace]=useState('how');
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
    <div className="entry-spaces">
      <div className="fi-spacebar" role="tablist" aria-label="Home sections" onKeyDown={event=>{const order=HOME_TABS.map(t=>t.id),i=order.indexOf(space);if(event.key==='ArrowRight'||event.key==='ArrowLeft'){const next=order[(i+(event.key==='ArrowRight'?1:order.length-1))%order.length];setSpace(next);event.preventDefault();setTimeout(()=>document.querySelector(`.entry-spaces [data-home="${next}"]`)?.focus(),0)}}}>
        {HOME_TABS.map(t=><button type="button" role="tab" key={t.id} data-home={t.id} tabIndex={space===t.id?0:-1} aria-selected={space===t.id} className={space===t.id?'active':''} onClick={()=>setSpace(t.id)}><span className="tab-icon" aria-hidden="true">{t.icon}</span><span className="tab-label-full">{t.label}</span><span className="tab-label-mobile">{t.short}</span></button>)}
      </div>
      {space==='how'&&<section className="entry-how" aria-label="How it works">
        {HOW.map((h,i)=><React.Fragment key={h.title}>{i>0&&<b aria-hidden="true">→</b>}<div className={h.hot?'hot':''}><strong>{h.title}</strong><span>{h.line}</span><small>{h.detail}</small></div></React.Fragment>)}
      </section>}
      {space==='apps'&&<TileSections onOpen={id=>onGo?.(id)} sections={[{title:'Agent apps',note:'Synthetic data · simulated agents',tiles:cockpit.tabs.map(m=>({id:m.tab.id,module:m.id,cls:'entry-card',icon:m.icon,title:m.short_name,sub:m.blurb,foot:['Open app']}))}]}/>}
      {space==='arch'&&<TileSections onOpen={id=>id==='watch'?onOpenAgents?.():onOpenArchitecture?.()} sections={[{title:'Watch and review',note:'Everything else lives in the Agents and Architecture spaces',tiles:[
        {id:'watch',icon:'◆',title:'Watch the agents work',sub:'See the orchestrator call each agent and which layers it reached.',foot:['Open Agents']},
        {id:'review',icon:'⬡',title:'Review the architecture',sub:'Live run, the three scenarios (SAP-hosted hybrid, AgentCore-native, AgentCore + Apigee), selection and cost, and diagrams.',foot:['Open Architecture']}]}]}/>}
    </div>
    {localBundle&&<div className="entry-download"><div><strong>Run it on your laptop</strong><span>Windows bundle. Python is needed on first launch. {Math.round(localBundle.bytes/1024)} KB · SHA-256 {localBundle.sha256.slice(0,12)}…</span></div><a href={localBundle.url} download="finance_reconciliation_local_windows.zip" aria-label="Download local Windows demo bundle">Download Windows bundle ↓</a></div>}
  </main>;
}
