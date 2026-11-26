import React,{useEffect,useMemo,useRef,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import {orchestrationSvg,ORCH_SIZE,effectiveStatus} from './orchestrationSvg';
import './agents.css';
import './workbench.css';
import {DEFAULT_PERIOD,fiscalLabel,longMonth} from './period';
import {Blocks} from './Blocks';
import {useCockpit} from './cockpit';
import './ontology.css';
import {EffectivePeriod,RouteChip,useAskText} from './PeriodUi';

const MARK={done:'✓',running:'…',pending:'·',held:'?',blocked:'✕',skipped:'–'};
const VIEW_LABEL={treasury:'Open Cash & treasury','treasury-forecast':'Open the cash forecast','treasury-banks':'Open bank relationships',run:'Open the live architecture',report:'Open the detailed report','evidence-proof':'Open the proof dossier','decision-responsibilities':'Open responsibilities & governance',close:'Open Close & reconcile',plan:'Stay here'};
const PLAYED=new Set(); // plans whose step animation already ran: coming back to the screen shows them complete
const reduceMotion=()=>{try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}};

export function AskBar({onAsk,busy,label='Ask the agents',period=DEFAULT_PERIOD,periods,domain='reconciliation'}){
  const [text,setText]=useAskText(period,domain);
  return <form className="surface agent-ask-bar" onSubmit={event=>{event.preventDefault();if(text.trim()&&!busy)onAsk(text.trim())}}><label htmlFor="ask-bar-input"><span className="eyebrow">AGENTS · SIMULATED</span><strong>{label}</strong></label><div className="ask-main"><input id="ask-bar-input" value={text} onChange={event=>setText(event.target.value)} aria-label={label}/><span className="ask-meta"><EffectivePeriod text={text} period={period} periods={periods}/><RouteChip text={text}/></span></div><button type="submit" className="primary" disabled={busy}>{busy?'Running…':'Ask →'}</button></form>;
}

function ModuleResult({plan}){
  return <section className="surface aw-result tr-result" aria-label="Result" data-testid="module-result" data-module={plan.domain}>
    <span className="eyebrow">RESULT · {plan.effective_period} · SYNTHETIC DATA · NOT AN SAP BALANCE</span>
    <Blocks blocks={plan.result_blocks}/>
    {plan.references?.length>0&&<details open className="tr-sources" data-testid="module-sources"><summary><b>SAP sources behind this answer</b></summary><ul className="tr-refs">{plan.references.map(ref=><li key={ref.id}><a href={ref.url} target="_blank" rel="noreferrer">{ref.id} · {ref.title} ↗</a> <small>{ref.supports} [{ref.status}]</small></li>)}</ul></details>}
  </section>;
}

export default function AgentWorkbench({catalog,plan:planProp,busy,onAsk,onOpenLayer,onOpenConcept,onOpenOutput,period=DEFAULT_PERIOD,periods,ontology}){
  const cockpit=useCockpit();
  const order=catalog?.order||['reconciliation'];
  const [picked,setPicked]=useState(null);
  const domain=picked||catalog?.default||order[0];
  const setDomain=setPicked;
  useEffect(()=>{if(planProp?.domain)setPicked(planProp.domain)},[planProp?.plan_id]);
  const activeCatalog=catalog?.domains?.[domain]||catalog;
  const plan=planProp&&(planProp.domain||catalog?.default)===domain?planProp:null;
  const agents=activeCatalog?.agents||[];
  const isOrch=id=>agents.find(a=>a.id===id)?.kind==='orchestrator';
  const orchestratorId=(agents.find(a=>a.kind==='orchestrator')||{}).id||'orchestrator';
  const [text,setText]=useAskText(period,domain);
  const examples=cockpit.examples(domain,period);
  const conceptLabel=id=>((ontology?.classes||[]).find(c=>c.id===id)||{}).label||String(id).split('.').pop();
  const [shown,setShown]=useState(0);
  const [selected,setSelected]=useState(null);
  const [view,setView]=useState(null),[expanded,setExpanded]=useState(false);
  const lastPlan=useRef(null);
  const steps=plan?.steps||[];
  useEffect(()=>{
    if(!plan||lastPlan.current===plan.plan_id)return;
    lastPlan.current=plan.plan_id;
    setSelected(null);
    if(reduceMotion()||!steps.length||PLAYED.has(plan.plan_id)){PLAYED.add(plan.plan_id);setShown(steps.length);return}
    PLAYED.add(plan.plan_id);
    setShown(0);
    let count=0;
    const timer=setInterval(()=>{count+=1;setShown(count);if(count>=steps.length)clearInterval(timer)},650);
    return()=>clearInterval(timer);
  },[plan?.plan_id]);
  const selectedAgent=selected?.agent||null;
  const svg=useMemo(()=>orchestrationSvg({plan,catalog:activeCatalog,shown,selectedAgent:isOrch(selectedAgent)?'orchestrator':selectedAgent}),[plan,activeCatalog,shown,selectedAgent]);
  const diagram=useMemo(()=>({id:'orchestration',title:'Orchestration',svg,w:ORCH_SIZE.w,h:ORCH_SIZE.h,file:'orchestration',png:true}),[svg]);
  const cardById=Object.fromEntries(agents.map(a=>[a.id,a]));
  const submit=event=>{event.preventDefault();if(text.trim()&&!busy)onAsk(text.trim())};
  const pick=zone=>{
    if(!zone?.startsWith('agent:'))return;
    const id=zone.slice(6);
    if(id==='orchestrator'){setSelected({agent:orchestratorId});return}
    const step=steps.find(s=>s.agent===id);
    setSelected({agent:id,step_id:step?.step_id});
  };
  const chosenStep=steps.find(s=>s.step_id===selected?.step_id)||null;
  const chosenCard=selected?cardById[selected.agent]:null;
  const done=plan&&shown>=steps.length;
  return <main className="agent-workbench" aria-label="Agents">
    <header className="surface aw-header">
      <div className="aw-title"><div className="domain-switch" role="tablist" aria-label="Agent family">{order.map(key=><button type="button" role="tab" key={key} aria-selected={domain===key} className={domain===key?'active':''} onClick={()=>setDomain(key)}>{catalog?.domains?.[key]?.name||key}</button>)}</div><span className="eyebrow">AGENTS · ORCHESTRATED WITH MCP-STYLE TOOL CALLS · {(activeCatalog?.name||domain).toUpperCase()}</span><h2>Watch the orchestrator call its agents</h2><p>The orchestrator plans and calls specialist agents, each a tool provider with a few typed tools. The calls are MCP-shaped but in-process (no MCP transport yet). Select an agent or a step to see what it did and which application layers its events actually touched.</p></div>
      <form className="aw-ask" onSubmit={submit}><label htmlFor="aw-ask-input" className="sr-only">Ask the orchestrator</label><input id="aw-ask-input" value={text} onChange={event=>setText(event.target.value)} aria-label="Ask the orchestrator"/><button type="submit" className="primary" disabled={busy}>{busy?'Running…':'Run plan'}</button><span className="ask-meta"><EffectivePeriod text={text} period={period} periods={periods}/><RouteChip text={text}/></span>
        <div className="aw-examples" role="group" aria-label="Example requests">{examples.map(item=><button type="button" key={item} onClick={()=>setText(item)}>{item.length>34?item.slice(0,32)+'…':item}</button>)}</div></form>
    </header>
    {plan&&<p className="aw-period"><span className={`domain-badge ${plan.domain}`} data-testid="plan-domain">Handled by <b>{cockpit.label(plan.domain)}</b></span></p>}
    {plan?.message&&<p className="aw-period" data-testid="plan-request">Your request: <b>“{plan.message}”</b></p>}
    {plan?.effective_period&&<p className="aw-period" data-testid="plan-period">Plan period: <b>{longMonth(plan.effective_period)}</b> · {fiscalLabel(plan.effective_period)} · taken from {plan.period_source==='request'?'the request':plan.period_source==='selector'?'the period selector':'the open case'}</p>}
    {plan?.effective_period&&plan.effective_period!==period&&<div className="period-stale" role="alert" data-testid="plan-stale">This plan is for {longMonth(plan.effective_period)}. The selected period is {longMonth(period)}. <button type="button" onClick={()=>onAsk(cockpit.ask(plan.domain,period))}>Run for {longMonth(period)}</button></div>}
    {plan&&(done||steps.length===0)&&<section className="surface aw-answer" aria-label="What the agents found"><div><span className="eyebrow">WHAT THE AGENTS FOUND</span><p>{plan.answer||plan.blocked_reason||plan.note}</p></div>{plan.adaptations?.length>0&&<p className="aw-adapt"><b>The orchestrator adapted the plan:</b> {plan.adaptations.map(a=>a.added?`added ${a.added} because ${a.because}`:a.because).join('; ')}.</p>}</section>}
    {plan&&plan.status==='done'&&(done||steps.length===0)&&(()=>{const out=cockpit.byId[plan.domain]?.output;return out?.open_label&&<section className="surface aw-output" data-testid="plan-output" aria-label="Open the full output of this run"><div><span className="eyebrow">FULL OUTPUT OF THIS RUN</span><p>The answer above is a summary. The complete output for {longMonth(plan.effective_period)} is on the {out.screen_name} screen.</p></div><div className="aw-output-actions"><button type="button" className="primary" data-testid="plan-output-screen" onClick={()=>onOpenOutput?.(plan,'screen')}>{out.open_label} →</button>{out.detail_label&&<button type="button" data-testid="plan-output-detail" onClick={()=>onOpenOutput?.(plan,'detail')}>{out.detail_label} →</button>}</div></section>})()}
    <div className="aw-body">
      <section className="aw-graph" aria-label="Orchestration graph"><div className="aw-viewer"><PanZoom diagram={diagram} uid="orch" view={view} onView={setView} onFit={setView} expanded={expanded} onExpand={setExpanded} onPick={pick}/></div></section>
      <aside className="surface aw-side" aria-label="Orchestration log and step detail">
        <h3>Orchestration log</h3>
        {!plan?<p className="aw-empty">No plan yet. Run a request to see the orchestrator dispatch its calls.</p>:<>
          <div className={`aw-plan-state ${plan.status}`} role="status"><strong>{String(plan.intent).replace('_',' ')}</strong><span>{plan.blocked_reason||(done||steps.length===0?{done:'Plan complete.',needs_input:'Stopped: it needs one more detail.',blocked:'Stopped at a control. Nothing was changed.'}[plan.status]||'':`Dispatching step ${Math.min(shown+1,steps.length)} of ${steps.length}…`)}</span></div>
          <ol className="aw-log"><li className="orch"><button type="button" onClick={()=>setSelected({agent:orchestratorId})}><span className="aw-mark">◆</span><b>Orchestrator</b><small>Planned {steps.length} step{steps.length===1?'':'s'} ({plan.orchestrator?.rule}). Calls each agent with an MCP-style tool call (in-process).</small></button></li>
            {steps.map((step,index)=>{const status=effectiveStatus(step,index,shown);if(status==='pending'&&index>shown)return null;return <li key={step.step_id} className={`${status} ${selected?.step_id===step.step_id?'sel':''}`}><button type="button" onClick={()=>setSelected({agent:step.agent,step_id:step.step_id})}><span className="aw-mark" aria-hidden="true">{MARK[status]}</span><b>#{index+1} {cardById[step.agent]?.name||step.agent}</b><small>{status==='running'?step.purpose:step.summary||step.purpose}</small>{step.added_by&&<small className="aw-added">Added by the orchestrator: {step.added_by}</small>}<code className="tech">{step.mcp?.server} · {step.tool} · {step.duration_ms??0} ms</code></button></li>})}
          </ol>
          {steps.length===0&&<p className={`aw-note ${plan.status==='blocked'?'bad':''}`}>{plan.blocked_reason||plan.note}</p>}
        </>}
        {chosenCard&&<div className="aw-detail" aria-live="polite">
          <h3>{chosenCard.name}{chosenStep?` · step #${steps.indexOf(chosenStep)+1}`:''}</h3>
          <p>{chosenCard.role}</p>
          {chosenStep?<>
            <dl><dt>Tool provider</dt><dd>{chosenStep.mcp?.server}</dd><dt>Call</dt><dd><code>tools/call</code> (MCP-style) · {chosenStep.tool} ({chosenStep.rw})</dd><dt>Result</dt><dd>{chosenStep.summary||'Pending'}</dd><dt>System of record</dt><dd data-testid="systems-of-record">{chosenStep.systems_of_record?.length?chosenStep.systems_of_record.map(r=>`${r.system}: ${r.scope}`).join(' · ')+'. '+chosenCard.records_note:'None. Computed from the steps above.'}</dd><dt>Layers reached</dt><dd>{chosenStep.trace?.layers?.length?chosenStep.trace.layers.join(' → '):'None. Computed locally, no application layer called.'}</dd><dt>Events</dt><dd>{chosenStep.trace?.count??0} stored{chosenStep.trace?.first_seq?` · #${chosenStep.trace.first_seq}–#${chosenStep.trace.last_seq}`:''}</dd></dl>
            {(()=>{const tool=(activeCatalog?.tools||[]).find(t=>t.name===chosenStep.tool);const chips=[...(tool?.reads||[]).map(id=>['reads',id]),...(tool?.produces||[]).map(id=>['produces',id])];return chips.length>0&&<div className="concept-chips" data-testid="concept-chips"><span className="micro">Concepts:</span>{chips.map(([kind,id])=><button type="button" key={kind+id} className={`concept-chip ${kind}`} data-testid="concept-chip" onClick={()=>onOpenConcept?.(id)}>{kind} · {conceptLabel(id)}</button>)}</div>})()}
            {chosenStep.trace?.hops?.length>0&&<details className="aw-hops"><summary>Calls made ({chosenStep.trace.hops.length} distinct hops)</summary><ul>{chosenStep.trace.hops.map((hop,i)=><li key={i}><code>{hop.from} → {hop.to}</code> · {hop.operation}</li>)}</ul></details>}
            <details className="tech aw-json"><summary>MCP-shaped request (illustrative, never sent)</summary><pre>{JSON.stringify({note:'in-process call; no MCP transport',jsonrpc:'2.0',method:'tools/call',params:{name:chosenStep.tool,arguments:chosenStep.mcp?.arguments||{}}},null,2)}</pre></details>
            <button type="button" className="aw-open" onClick={()=>onOpenLayer(chosenCard,chosenStep)}>{chosenCard.view_label||VIEW_LABEL[chosenStep.view||chosenCard.view]||'Open layer'} →</button>
          </>:<>
            <dl><dt>Tool provider</dt><dd>{chosenCard.mcp_server}</dd><dt>Tools</dt><dd>{chosenCard.tools.join(', ')}</dd><dt>Layers it can reach</dt><dd>{chosenCard.layers.join(' → ')||'None; it only plans and calls'}</dd><dt>Systems of record</dt><dd data-testid="systems-of-record">{chosenCard.systems_of_record?.length?chosenCard.systems_of_record.map(r=>`${r.system}: ${r.scope}`).join(' · ')+'. '+chosenCard.records_note:chosenCard.records_note}</dd></dl>
            <p className="aw-note">{isOrch(chosenCard.id)?'It chose this plan with a fixed rule table, then called each agent in order. No model is involved.':'Not called in this plan.'}</p>
            {!isOrch(chosenCard.id)&&<button type="button" className="aw-open" onClick={()=>onOpenLayer(chosenCard)}>{chosenCard.view_label||VIEW_LABEL[chosenCard.view]||'Open layer'} →</button>}
          </>}
        </div>}
      </aside>
    </div>
    {plan?.result_blocks?.length>0&&(done||steps.length===0)&&<ModuleResult plan={plan}/>}
    <section className="surface aw-roster" aria-label="Agent roster"><div className="aw-roster-head"><div><span className="eyebrow">AGENT ROSTER</span><strong>Who does what</strong></div></div>
      <ul>{agents.map(agent=>{const mine=steps.filter(s=>s.agent===agent.id);return <li key={agent.id}><button type="button" className={`agent-card ${selected?.agent===agent.id?'active':''}`} onClick={()=>setSelected({agent:agent.id,step_id:mine[0]?.step_id})} aria-label={`Select ${agent.name} agent`}>
        <strong>{agent.name}</strong><span>{agent.role}</span><small className="aw-chips">{agent.tools.map(t=><i key={t}>{t}</i>)}</small><em>{agent.mcp_server}</em><span className="aw-last">{mine.length?mine.map(s=>s.summary||s.purpose).join(' · '):'Not called in this plan'}</span></button></li>})}</ul></section>
    <details className="surface aw-catalog"><summary><strong>Tool catalog</strong> <span>tools/list-shaped · {activeCatalog?.tools?.length||0} tools · writes are not tools</span></summary>
      <table className="rr-table"><thead><tr><th>Tool</th><th>Agent</th><th>Class</th><th>Input</th><th>Output</th></tr></thead><tbody>{(activeCatalog?.tools||[]).map(tool=><tr key={tool.name}><td><code>{tool.name}</code></td><td>{cardById[tool.agent]?.name}</td><td>{tool.rw}</td><td><code>{JSON.stringify(tool.input)}</code></td><td>{tool.output}</td></tr>)}</tbody></table>
      <p className="micro">Not registered as tools, by design: {(activeCatalog?.not_tools||[]).join(', ')}. {activeCatalog?.note}</p></details>
  </main>;
}
