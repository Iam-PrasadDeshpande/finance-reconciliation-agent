import React,{useEffect,useRef,useState} from 'react';

const ROUTES=[
  {id:'S1',label:'S1 · SAP-hosted hybrid'},
  {id:'S2',label:'S2 · AWS AgentCore-native'},
  {id:'S3',label:'S3 · AgentCore + Apigee hybrid'},
];

function FlowNode({step,selected,processing,onSelect}){
  return <button type="button" data-seq={step.seq} className={`lab-node ${step.status} ${selected?'selected':''} ${processing?'processing':''}`} onClick={onSelect} aria-label={`Step ${step.seq}: ${step.component}, ${step.status}`}>
    <small>{String(step.seq).padStart(2,'0')} · {step.phase}</small><strong>{step.component}</strong><span>{step.status.toUpperCase()}</span>
  </button>;
}

function RoutePlanDialog({playbooks,question,initialRoute,onClose}){
  const [activeRoute,setActiveRoute]=useState(initialRoute);
  const [activeStep,setActiveStep]=useState(0);
  const playbook=playbooks[activeRoute];
  const stage=playbook?.steps?.[activeStep];
  useEffect(()=>{const close=event=>{if(event.key==='Escape')onClose()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[onClose]);
  return <div className="route-plan-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
    <section role="dialog" aria-modal="true" aria-label="Gateway implementation plan" className="route-plan-dialog">
      <header><div><span className="eyebrow">ARCHITECTURE IMPLEMENTATION PLAN · CANDIDATE ONLY</span><h2>What must be built and proved</h2><p>Choose a scenario and a handoff to inspect its configuration, dependency and acceptance proof.</p></div><button type="button" onClick={onClose} aria-label="Close implementation plan">Close ×</button></header>
      <nav className="route-plan-tabs" aria-label="Gateway scenarios">{ROUTES.map(item=><button type="button" key={item.id} className={activeRoute===item.id?'active':''} onClick={()=>{setActiveRoute(item.id);setActiveStep(0)}} aria-pressed={activeRoute===item.id}>{item.label}</button>)}</nav>
      {playbook?<><div className="route-plan-summary"><strong>{playbook.title}</strong><span>{playbook.status}</span><p>{playbook.path}</p><small><b>Hosting:</b> {playbook.hosting}</small></div>
        <div className="route-plan-body">
          <div className="route-plan-sequence"><h3>Build sequence</h3>{playbook.steps.map((item,index)=><button type="button" key={item.handoff} className={activeStep===index?'active':''} onClick={()=>setActiveStep(index)} aria-pressed={activeStep===index}><em>{String(index+1).padStart(2,'0')}</em><span>{item.handoff}</span><b aria-hidden="true">›</b></button>)}</div>
          <div className="route-plan-detail"><span className="eyebrow">HANDOFF {activeStep+1} OF {playbook.steps.length}</span><h3>{stage?.handoff}</h3><dl><div><dt>Configure</dt><dd>{stage?.configure}</dd></div><div><dt>Depends on</dt><dd>{stage?.dependency}</dd></div><div><dt>Proof to accept</dt><dd>{stage?.proof}</dd></div><div><dt>Accountable team</dt><dd>{stage?.owner}</dd></div></dl></div>
          <aside className="route-plan-decisions"><h3>Open decisions for this route</h3><ol>{playbook.decisions.map(item=><li key={item}>{item}</li>)}</ol>{question&&<><h3>For this question: {question.title}</h3><ul>{(question.dependencies||[]).map(item=><li key={item}>{item}</li>)}</ul><strong>Next: {question.next_action}</strong></>}</aside>
        </div>
        <footer><span>Reference designs only. Hosting, credentials, identity and SAP authorization require tenant proof and owner approval.</span><div>{playbook.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}</div></footer>
      </>:<p className="empty-inline">No route plan is available.</p>}
    </section>
  </div>;
}

export default function ArchitectureQuestions({questions=[],routePlaybooks={},focus,run,onRun,busy,onOpenEvidence}){
  const [selectedId,setSelectedId]=useState(run?.question_id||null);
  const [route,setRoute]=useState(run?.route||'S3');
  const [probe,setProbe]=useState(run?.probe||'');
  const [selectedSeq,setSelectedSeq]=useState(null);
  const [followLive,setFollowLive]=useState(true);
  const [planOpen,setPlanOpen]=useState(false);
  const lastFocusNonce=useRef(null);
  const question=questions.find(item=>item.id===selectedId);
  const visibleRun=run?.question_id===selectedId?run:null;
  const steps=visibleRun?.steps||[];
  const designSteps=steps.filter(item=>item.phase==='design-time');
  const runtimeSteps=steps.filter(item=>item.phase!=='design-time');
  const selected=steps.find(item=>item.seq===selectedSeq)||steps.at(-1);
  const selectedIndex=steps.findIndex(item=>item.seq===selected?.seq);

  useEffect(()=>{
    if(steps.length&&(followLive||selectedSeq===null||!steps.some(item=>item.seq===selectedSeq)))setSelectedSeq(steps.at(-1).seq);
  },[visibleRun?.run_id,steps.length,followLive]);
  useEffect(()=>{
    if(visibleRun?.status==='complete'&&followLive&&steps.length){setSelectedSeq(steps[0].seq);setFollowLive(false)}
  },[visibleRun?.run_id,visibleRun?.status,steps.length,followLive]);
  useEffect(()=>{if(!focus?.id||focus.nonce===lastFocusNonce.current)return;const item=questions.find(candidate=>candidate.id===focus.id);if(item){lastFocusNonce.current=focus.nonce;choose(item)}},[focus?.nonce,questions]);

  function choose(item){
    const nextRoute=item.default_route||'S3';
    const nextProbe=item.probes[0].id;
    setSelectedId(item.id);setRoute(nextRoute);setProbe(nextProbe);setSelectedSeq(null);setFollowLive(true);
    onRun(item.id,nextRoute,nextProbe);
  }
  function rerun(){if(question){setSelectedSeq(null);setFollowLive(true);onRun(question.id,route,probe)}}
  function navigate(delta){const next=steps[selectedIndex+delta];if(next){setSelectedSeq(next.seq);setFollowLive(false)}}

  return <main className="question-lab" aria-label="Architecture questions">
    <aside className="surface question-rail">
      <div className="section-heading"><div><span className="eyebrow">ARCHITECTURE ALIGNMENT</span><h2>Open questions</h2></div><span className="pill simulated">6 decisions</span></div>
      <p className="lab-intro">Select a question to run a synthetic component path. Each result remains an open architecture decision.</p>
      <div className="question-list">{questions.map((item,index)=><button type="button" key={item.id} className={`question-card ${selectedId===item.id?'selected':''}`} onClick={()=>choose(item)} aria-pressed={selectedId===item.id}>
        <span>Q{index+1} · OPEN</span><strong>{item.title}</strong><small>{item.summary}</small>
      </button>)}</div>
      <p className="lab-footnote">Each probe walks the selected scenario: S1 SAP-hosted hybrid (Cloud Foundry agent, Apigee), S2 AWS AgentCore-native (AgentCore Runtime and Gateway) and S3 AgentCore + Apigee hybrid (AgentCore Runtime and Gateway, then Apigee). AWS Agent Registry registers on a separate path in all three. Results are simulated; approval remains open.</p>
    </aside>

    <section className="lab-center">
      <section className="surface lab-command">
        <div><span className="eyebrow">EXTERNAL AGENT / SAP ALIGNMENT PROBE</span><h2>{question?.title||'Choose an architecture question'}</h2><p>{question?.summary||'Run a question to inspect the propagated request and response at each component.'}</p></div>
        {question&&<div className="lab-controls">
          <label>Route<select aria-label="Architecture route" value={route} onChange={event=>setRoute(event.target.value)}>{ROUTES.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label>Probe<select aria-label="Architecture probe" value={probe} onChange={event=>setProbe(event.target.value)}>{question.probes.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <button type="button" className="primary" onClick={rerun} disabled={busy}>{busy?'Running…':'Run selected probe'}</button>
          <button type="button" className="route-plan-open" onClick={()=>setPlanOpen(true)}>Hosting & dependencies →</button>
        </div>}
      </section>

      <section className="surface lab-flow-panel">
        <div className="section-heading"><div><span className="eyebrow">COMPONENT HANDOFFS</span><h2>Propagated flow</h2></div><div className="lab-step-nav"><button type="button" onClick={()=>navigate(-1)} disabled={selectedIndex<=0} aria-label="Previous handoff">←</button><span>{selected?`${selected.seq}/${visibleRun.total_steps}`:'—'}</span><button type="button" onClick={()=>navigate(1)} disabled={selectedIndex<0||selectedIndex>=steps.length-1} aria-label="Next handoff">→</button><span className={`pill ${visibleRun?.outcome==='DENIED'?'warn':'quiet'}`}>{visibleRun?`${steps.length}/${visibleRun.total_steps} steps · ${visibleRun.status}`:'Awaiting question'}</span></div></div>
        {visibleRun?<>
          <div className="lab-route-note"><strong>{visibleRun.route_label}</strong><span>{visibleRun.route_status}</span><span>{visibleRun.outcome}</span></div>
          <div className="lab-design-branch"><span>DESIGN-TIME PREREQUISITE · NOT A RUNTIME HOP</span>{designSteps.map(step=><FlowNode key={step.seq} step={step} selected={selected?.seq===step.seq} processing={visibleRun.status==='running'&&step.seq===steps.at(-1)?.seq} onSelect={()=>{setSelectedSeq(step.seq);setFollowLive(false)}}/>)}</div>
          <div className="lab-flow" aria-label="Architecture runtime call path"><span className="lab-flow-caption">RUNTIME CALL PATH · LEFT TO RIGHT, THEN NEXT ROW</span>{runtimeSteps.map(step=><FlowNode key={step.seq} step={step} selected={selected?.seq===step.seq} processing={visibleRun.status==='running'&&step.seq===steps.at(-1)?.seq} onSelect={()=>{setSelectedSeq(step.seq);setFollowLive(false)}}/>)}{visibleRun.status==='running'&&<div className="lab-pending" aria-live="polite">Evaluating next handoff…</div>}</div>
        </>:<div className="empty-inline">Click an open question to generate its route and control trace.</div>}
      </section>

      <div className="lab-evidence-link"><span>{selected?`Selected handoff · ${selected.component}`:'Select a question to trace its route'}</span><button type="button" onClick={()=>onOpenEvidence?.(selected?.seq)} disabled={!visibleRun}>Inspect handoff details in Evidence →</button></div>
    </section>

    <aside className="surface lab-decision">
      <div className="section-heading"><div><span className="eyebrow">MEETING DECISION RECORD</span><h2>Required alignment</h2></div></div>
      {question?<>
        <div className="lab-position"><span>Discussion baseline · not approved policy</span><p>{question.current_position}</p>{question.scenario_position?.[route]&&<p data-testid="scenario-position"><strong>{route}:</strong> {question.scenario_position[route]}</p>}</div>
        <div className="lab-decision-question"><span>Decision to resolve</span><strong>{question.decision}</strong><small>Owner · {question.owner}</small></div>
        <div className="lab-open-status">OPEN · No policy or tenant approval is asserted by this simulator.</div>
        <div className="lab-next-action"><span>Next action</span><strong>{question.next_action}</strong></div>
        <h3>Proof required to close</h3><ul className="lab-gates">{question.gates.map(gate=><li key={gate}>{gate}</li>)}</ul>
        <p className="lab-decision-hint">Detailed handoff records and the synthetic decision packet are in Evidence & correlation.</p>
        <button type="button" className="lab-export" onClick={()=>onOpenEvidence?.(selected?.seq)}>Open decision evidence →</button>
      </>:<p className="empty-inline">Select an open question to see its decision owner and required architecture alignment. Control details are in Evidence.</p>}
    </aside>
    {planOpen&&<RoutePlanDialog playbooks={routePlaybooks} question={question} initialRoute={route} onClose={()=>setPlanOpen(false)}/>}
  </main>;
}
