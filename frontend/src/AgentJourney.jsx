import React from 'react';

const STAGES=[
  {label:'Finance intent',operation:'submit_request',doneDirection:'request',success:'Accepted',description:'Request accepted'},
  {label:'External agent',operation:'invoke_agent',doneDirection:'request',success:'Invoked',description:'Bounded plan invoked'},
  {label:'SAP tool call',operation:'read_sap',doneDirection:'request',success:'Called',description:'Read requested through gateway'},
  {label:'SAP evidence',operation:'sap_read',doneDirection:'response',success:'Returned',description:'Source response returned'},
  {label:'Reconciliation',operation:'calculate_variance',doneDirection:'response',success:'Verified',description:'Deterministic check completed'},
];

export default function AgentJourney({events=[],running=false,selectedZone,onOpenEvidence}){
  const state=STAGES.map(stage=>{
    const matching=events.filter(event=>event.operation===stage.operation);
    const finished=matching.findLast(event=>event.direction===stage.doneDirection&&event.status!=='denied');
    const denied=matching.findLast(event=>event.status==='denied');
    return {...stage,event:finished||denied||matching.at(-1),state:denied&&!finished?'held':finished?'complete':matching.length?'working':'waiting'};
  });
  return <section className="surface agent-journey" aria-label="External agent and SAP journey">
    <div className="agent-journey-heading"><div><span className="eyebrow">EXTERNAL AGENT → SAP · SYNTHETIC FLOW</span><strong>{selectedZone}</strong></div><button type="button" onClick={onOpenEvidence}>Inspect event proof in Evidence →</button></div>
    <div className="agent-journey-stages">{state.map((stage,index)=><div key={stage.operation} className={`agent-journey-stage ${stage.state}`}><span>{String(index+1).padStart(2,'0')} · {stage.label}</span><strong>{stage.state==='complete'?stage.success:stage.state==='held'?'Held':stage.state==='working'?'Processing':stage.description}</strong><small>{stage.event?`Recorded event #${stage.event.seq}`:running?'Awaiting handoff':'No event yet'}</small></div>)}</div>
  </section>;
}
