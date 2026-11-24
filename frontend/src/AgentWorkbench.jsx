import React,{useEffect,useMemo,useRef,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import {orchestrationSvg,ORCH_SIZE,effectiveStatus} from './orchestrationSvg';
import './agents.css';
import './workbench.css';

const MARK={done:'✓',running:'…',pending:'·',held:'?',blocked:'✕',skipped:'–'};
const VIEW_LABEL={run:'Open the live architecture',report:'Open the detailed report','evidence-proof':'Open the proof dossier','decision-responsibilities':'Open responsibilities & governance',close:'Open Close & reconcile',plan:'Stay here'};
const EXAMPLES=['Reconcile November 2026 company code 1000 ledger 0L USD','Explain the route controls','Investigate this variance','Post a journal entry to SAP for November 2026'];
const reduceMotion=()=>{try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}};

export function AskBar({onAsk,busy,label='Ask the agents'}){
  const [text,setText]=useState('Reconcile November 2026 company code 1000 ledger 0L USD');
  return <form className="surface agent-ask-bar" onSubmit={event=>{event.preventDefault();if(text.trim()&&!busy)onAsk(text.trim())}}><label htmlFor="ask-bar-input"><span className="eyebrow">AGENTS · SIMULATED</span><strong>{label}</strong></label><input id="ask-bar-input" value={text} onChange={event=>setText(event.target.value)} aria-label={label}/><button type="submit" className="primary" disabled={busy}>{busy?'Running…':'Ask →'}</button></form>;
}

export default function AgentWorkbench({catalog,plan,busy,onAsk,onOpenLayer}){
  const agents=catalog?.agents||[];
  const [text,setText]=useState(EXAMPLES[0]);
  const [shown,setShown]=useState(0);
  const [selected,setSelected]=useState(null);
  const [view,setView]=useState(null),[expanded,setExpanded]=useState(false);
  const lastPlan=useRef(null);
  const steps=plan?.steps||[];
  useEffect(()=>{
    if(!plan||lastPlan.current===plan.plan_id)return;
    lastPlan.current=plan.plan_id;
    setSelected(null);
    if(reduceMotion()||!steps.length){setShown(steps.length);return}
    setShown(0);
    let count=0;
    const timer=setInterval(()=>{count+=1;setShown(count);if(count>=steps.length)clearInterval(timer)},650);
    return()=>clearInterval(timer);
  },[plan?.plan_id]);
  const selectedAgent=selected?.agent||null;
  const svg=useMemo(()=>orchestrationSvg({plan,catalog,shown,selectedAgent}),[plan,catalog,shown,selectedAgent]);
  const diagram=useMemo(()=>({id:'orchestration',title:'Orchestration',svg,w:ORCH_SIZE.w,h:ORCH_SIZE.h,file:'orchestration',png:true}),[svg]);
  const cardById=Object.fromEntries(agents.map(a=>[a.id,a]));
  const submit=event=>{event.preventDefault();if(text.trim()&&!busy)onAsk(text.trim())};
  const pick=zone=>{
    if(!zone?.startsWith('agent:'))return;
    const id=zone.slice(6);
    if(id==='orchestrator'){setSelected({agent:'orchestrator'});return}
    const step=steps.find(s=>s.agent===id);
    setSelected({agent:id,step_id:step?.step_id});
  };
  const chosenStep=steps.find(s=>s.step_id===selected?.step_id)||null;
  const chosenCard=selected?cardById[selected.agent]:null;
  const done=plan&&shown>=steps.length;
  return <main className="agent-workbench" aria-label="Agents">
    <header className="surface aw-header">
      <div className="aw-title"><span className="eyebrow">AGENTS · ORCHESTRATED WITH MCP-STYLE TOOL CALLS</span><h2>Watch the orchestrator call its agents</h2><p>The orchestrator plans and calls specialist agents, each a tool provider with a few typed tools. The calls are MCP-shaped but in-process (no MCP transport yet). Select an agent or a step to see what it did and which application layers its events actually touched.</p></div>
      <form className="aw-ask" onSubmit={submit}><label htmlFor="aw-ask-input" className="sr-only">Ask the orchestrator</label><input id="aw-ask-input" value={text} onChange={event=>setText(event.target.value)} aria-label="Ask the orchestrator"/><button type="submit" className="primary" disabled={busy}>{busy?'Running…':'Run plan'}</button>
        <div className="aw-examples" role="group" aria-label="Example requests">{EXAMPLES.map(item=><button type="button" key={item} onClick={()=>setText(item)}>{item.length>34?item.slice(0,32)+'…':item}</button>)}</div></form>
    </header>
    {plan&&(done||steps.length===0)&&<section className="surface aw-answer" aria-label="What the agents found"><div><span className="eyebrow">WHAT THE AGENTS FOUND</span><p>{plan.answer||plan.blocked_reason||plan.note}</p></div>{plan.adaptations?.length>0&&<p className="aw-adapt"><b>The orchestrator adapted the plan:</b> {plan.adaptations.map(a=>a.added?`added ${a.added} because ${a.because}`:a.because).join('; ')}.</p>}</section>}
    <div className="aw-body">
      <section className="aw-graph" aria-label="Orchestration graph"><div className="aw-viewer"><PanZoom diagram={diagram} uid="orch" view={view} onView={setView} onFit={setView} expanded={expanded} onExpand={setExpanded} onPick={pick}/></div></section>
      <aside className="surface aw-side" aria-label="Orchestration log and step detail">
        <h3>Orchestration log</h3>
        {!plan?<p className="aw-empty">No plan yet. Run a request to see the orchestrator dispatch its calls.</p>:<>
          <div className={`aw-plan-state ${plan.status}`} role="status"><strong>{String(plan.intent).replace('_',' ')}</strong><span>{plan.blocked_reason||(done||steps.length===0?{done:'Plan complete.',needs_input:'Stopped: it needs one more detail.',blocked:'Stopped at a control. Nothing was changed.'}[plan.status]||'':`Dispatching step ${Math.min(shown+1,steps.length)} of ${steps.length}…`)}</span></div>
          <ol className="aw-log"><li className="orch"><button type="button" onClick={()=>setSelected({agent:'orchestrator'})}><span className="aw-mark">◆</span><b>Orchestrator</b><small>Planned {steps.length} step{steps.length===1?'':'s'} ({plan.orchestrator?.rule}). Calls each agent with an MCP-style tool call (in-process).</small></button></li>
            {steps.map((step,index)=>{const status=effectiveStatus(step,index,shown);if(status==='pending'&&index>shown)return null;return <li key={step.step_id} className={`${status} ${selected?.step_id===step.step_id?'sel':''}`}><button type="button" onClick={()=>setSelected({agent:step.agent,step_id:step.step_id})}><span className="aw-mark" aria-hidden="true">{MARK[status]}</span><b>#{index+1} {cardById[step.agent]?.name||step.agent}</b><small>{status==='running'?step.purpose:step.summary||step.purpose}</small>{step.added_by&&<small className="aw-added">Added by the orchestrator: {step.added_by}</small>}<code className="tech">{step.mcp?.server} · {step.tool} · {step.duration_ms??0} ms</code></button></li>})}
          </ol>
          {steps.length===0&&<p className={`aw-note ${plan.status==='blocked'?'bad':''}`}>{plan.blocked_reason||plan.note}</p>}
        </>}
        {chosenCard&&<div className="aw-detail" aria-live="polite">
          <h3>{chosenCard.name}{chosenStep?` · step #${steps.indexOf(chosenStep)+1}`:''}</h3>
          <p>{chosenCard.role}</p>
          {chosenStep?<>
            <dl><dt>Tool provider</dt><dd>{chosenStep.mcp?.server}</dd><dt>Call</dt><dd><code>tools/call</code> (MCP-style) · {chosenStep.tool} ({chosenStep.rw})</dd><dt>Result</dt><dd>{chosenStep.summary||'Pending'}</dd><dt>Layers reached</dt><dd>{chosenStep.trace?.layers?.length?chosenStep.trace.layers.join(' → '):'None. Computed locally, no application layer called.'}</dd><dt>Events</dt><dd>{chosenStep.trace?.count??0} stored{chosenStep.trace?.first_seq?` · #${chosenStep.trace.first_seq}–#${chosenStep.trace.last_seq}`:''}</dd></dl>
            {chosenStep.trace?.hops?.length>0&&<details className="aw-hops"><summary>Calls made ({chosenStep.trace.hops.length} distinct hops)</summary><ul>{chosenStep.trace.hops.map((hop,i)=><li key={i}><code>{hop.from} → {hop.to}</code> · {hop.operation}</li>)}</ul></details>}
            <details className="tech aw-json"><summary>MCP-shaped request (illustrative, never sent)</summary><pre>{JSON.stringify({note:'in-process call; no MCP transport',jsonrpc:'2.0',method:'tools/call',params:{name:chosenStep.tool,arguments:chosenStep.mcp?.arguments||{}}},null,2)}</pre></details>
            <button type="button" className="aw-open" onClick={()=>onOpenLayer(chosenCard,chosenStep)}>{VIEW_LABEL[chosenStep.view||chosenCard.view]||'Open layer'} →</button>
          </>:<>
            <dl><dt>Tool provider</dt><dd>{chosenCard.mcp_server}</dd><dt>Tools</dt><dd>{chosenCard.tools.join(', ')}</dd><dt>Layers it can reach</dt><dd>{chosenCard.layers.join(' → ')||'None; it only plans and calls'}</dd></dl>
            <p className="aw-note">{chosenCard.id==='orchestrator'?'It chose this plan with a fixed rule table, then called each agent in order. No model is involved.':'Not called in this plan.'}</p>
            {chosenCard.id!=='orchestrator'&&<button type="button" className="aw-open" onClick={()=>onOpenLayer(chosenCard)}>{VIEW_LABEL[chosenCard.view]||'Open layer'} →</button>}
          </>}
        </div>}
      </aside>
    </div>
    <section className="surface aw-roster" aria-label="Agent roster"><div className="aw-roster-head"><div><span className="eyebrow">AGENT ROSTER</span><strong>Who does what</strong></div></div>
      <ul>{agents.map(agent=>{const mine=steps.filter(s=>s.agent===agent.id);return <li key={agent.id}><button type="button" className={`agent-card ${selected?.agent===agent.id?'active':''}`} onClick={()=>setSelected({agent:agent.id,step_id:mine[0]?.step_id})} aria-label={`Select ${agent.name} agent`}>
        <strong>{agent.name}</strong><span>{agent.role}</span><small className="aw-chips">{agent.tools.map(t=><i key={t}>{t}</i>)}</small><em>{agent.mcp_server}</em><span className="aw-last">{mine.length?mine.map(s=>s.summary||s.purpose).join(' · '):'Not called in this plan'}</span></button></li>})}</ul></section>
    <details className="surface aw-catalog"><summary><strong>Tool catalog</strong> <span>tools/list-shaped · {catalog?.tools?.length||0} tools · writes are not tools</span></summary>
      <table className="rr-table"><thead><tr><th>Tool</th><th>Agent</th><th>Class</th><th>Input</th><th>Output</th></tr></thead><tbody>{(catalog?.tools||[]).map(tool=><tr key={tool.name}><td><code>{tool.name}</code></td><td>{cardById[tool.agent]?.name}</td><td>{tool.rw}</td><td><code>{JSON.stringify(tool.input)}</code></td><td>{tool.output}</td></tr>)}</tbody></table>
      <p className="micro">Not registered as tools, by design: {(catalog?.not_tools||[]).join(', ')}. {catalog?.note}</p></details>
  </main>;
}
