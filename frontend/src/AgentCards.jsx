import React,{useState} from 'react';
import './agents.css';

const STATUS={done:'✓',running:'…',pending:'·',held:'?',blocked:'✕',skipped:'–'};
const PLAN_NOTE={done:'Plan complete. Open any step to see where it worked.',needs_input:'The plan stopped: it needs one more detail from you.',blocked:'The plan stopped at a control. Nothing was changed.',planned:'Plan ready.'};

export default function AgentCards({catalog,plan,busy,onAsk,onGo,activeId}){
  const [text,setText]=useState('Reconcile November 2026 company code 1000 ledger 0L USD');
  const agents=catalog?.agents||[];
  if(!agents.length)return null;
  const submit=event=>{event.preventDefault();if(text.trim()&&!busy)onAsk(text.trim())};
  const byId=Object.fromEntries(agents.map(a=>[a.id,a]));
  return <section className="surface agent-strip" aria-label="Finance agents">
    <div className="agent-head">
      <div><span className="eyebrow">AGENTS · SIMULATED</span><strong>Ask the orchestrator, or open an agent's layer</strong></div>
      <form className="agent-ask" onSubmit={submit}><label htmlFor="agent-ask" className="sr-only">Ask the orchestrator</label><input id="agent-ask" value={text} onChange={event=>setText(event.target.value)} placeholder="e.g. Reconcile November 2026, or Explain the route controls"/><button type="submit" className="primary" disabled={busy}>{busy?'Running…':'Run plan'}</button></form>
    </div>
    <ul className="agent-cards">{agents.map(agent=><li key={agent.id}><button type="button" className={`agent-card ${activeId===agent.id?'active':''}`} onClick={()=>onGo(agent)} aria-label={`Open ${agent.name} agent`} title={agent.role}>
      <strong>{agent.name}</strong><span>{agent.role}</span><em>{agent.mode}</em></button></li>)}</ul>
    {plan?.steps&&<div className="agent-plan" aria-live="polite">
      <div className={`agent-plan-note ${plan.status}`}><strong>{plan.intent.replace('_',' ')}</strong><span>{plan.blocked_reason||PLAN_NOTE[plan.status]||''}</span></div>
      {plan.steps.length>0&&<ol>{plan.steps.map(step=><li key={step.step_id} className={step.status}><button type="button" onClick={()=>onGo(byId[step.agent]||{},step)} aria-label={`${byId[step.agent]?.name||step.agent}: ${step.purpose}`}>
        <span className="agent-step-mark" aria-hidden="true">{STATUS[step.status]}</span><b>{byId[step.agent]?.name||step.agent}</b><small>{step.summary||step.purpose}</small><code className="tech">{step.tool} · {step.rw}</code></button></li>)}</ol>}
    </div>}
    <p className="agent-foot">{catalog.label}. Agents plan and read; approval, posting and data changes are never agent actions.</p>
  </section>;
}
