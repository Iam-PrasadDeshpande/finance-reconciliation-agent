import React,{useEffect,useRef,useState} from 'react';

const ROUTES=[
  {id:'S1',label:'S1 · Apigee route'},
  {id:'S2',label:'S2 · AgentCore route'},
  {id:'S3',label:'S3 · Combined candidate'},
];

function downloadPacket(run){
  const link=document.createElement('a');
  const blob=new Blob([JSON.stringify({...run,meeting_status:'OPEN — no human decision recorded'},null,2)],{type:'application/json'});
  link.href=URL.createObjectURL(blob);link.download=`${run.run_id}-architecture-decision.json`;link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

function FlowNode({step,selected,processing,onSelect}){
  return <button type="button" data-seq={step.seq} className={`lab-node ${step.status} ${selected?'selected':''} ${processing?'processing':''}`} onClick={onSelect} aria-label={`Step ${step.seq}: ${step.component}, ${step.status}`}>
    <small>{String(step.seq).padStart(2,'0')} · {step.phase}</small><strong>{step.component}</strong><span>{step.status.toUpperCase()}</span>
  </button>;
}

export default function ArchitectureQuestions({questions=[],run,onRun,busy}){
  const [selectedId,setSelectedId]=useState(null);
  const [route,setRoute]=useState('S3');
  const [probe,setProbe]=useState('');
  const [selectedSeq,setSelectedSeq]=useState(null);
  const [followLive,setFollowLive]=useState(true);
  const flowRef=useRef(null);
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
    if(!flowRef.current||!steps.length||!followLive)return;
    flowRef.current.scrollTo({left:flowRef.current.scrollWidth,behavior:'smooth'});
  },[steps.length,followLive]);
  useEffect(()=>{
    if(visibleRun?.status==='complete'&&followLive&&steps.length){setSelectedSeq(steps[0].seq);setFollowLive(false)}
  },[visibleRun?.run_id,visibleRun?.status,steps.length,followLive]);
  useEffect(()=>{
    if(followLive||!flowRef.current||!selectedSeq)return;
    const flow=flowRef.current;
    const node=flow.querySelector(`[data-seq="${selectedSeq}"]`);
    if(node){
      const left=selectedSeq===1?0:flow.scrollLeft+node.getBoundingClientRect().left-flow.getBoundingClientRect().left-20;
      flow.scrollTo({left:Math.max(0,left),behavior:'auto'});
    }
  },[selectedSeq,followLive]);

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
      <p className="lab-footnote">S1 and S2 represent the existing alternatives. S3 is an unapproved combined-path candidate.</p>
    </aside>

    <section className="lab-center">
      <section className="surface lab-command">
        <div><span className="eyebrow">PYTHON-EVALUATED SYNTHETIC TRACE</span><h2>{question?.title||'Choose an architecture question'}</h2><p>{question?.summary||'Run a question to inspect the propagated request and response at each component.'}</p></div>
        {question&&<div className="lab-controls">
          <label>Route<select aria-label="Architecture route" value={route} onChange={event=>setRoute(event.target.value)}>{ROUTES.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <label>Probe<select aria-label="Architecture probe" value={probe} onChange={event=>setProbe(event.target.value)}>{question.probes.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <button type="button" className="primary" onClick={rerun} disabled={busy}>{busy?'Running…':'Run selected probe'}</button>
        </div>}
      </section>

      <section className="surface lab-flow-panel">
        <div className="section-heading"><div><span className="eyebrow">COMPONENT HANDOFFS</span><h2>Propagated flow</h2></div><div className="lab-step-nav"><button type="button" onClick={()=>navigate(-1)} disabled={selectedIndex<=0} aria-label="Previous handoff">←</button><span>{selected?`${selected.seq}/${visibleRun.total_steps}`:'—'}</span><button type="button" onClick={()=>navigate(1)} disabled={selectedIndex<0||selectedIndex>=steps.length-1} aria-label="Next handoff">→</button><span className={`pill ${visibleRun?.outcome==='DENIED'?'warn':'quiet'}`}>{visibleRun?`${steps.length}/${visibleRun.total_steps} steps · ${visibleRun.status}`:'Awaiting question'}</span></div></div>
        {visibleRun?<>
          <div className="lab-route-note"><strong>{visibleRun.route_label}</strong><span>{visibleRun.route_status}</span><span>{visibleRun.outcome}</span></div>
          <div className="lab-design-branch"><span>DESIGN-TIME PREREQUISITE · NOT A RUNTIME HOP</span>{designSteps.map(step=><FlowNode key={step.seq} step={step} selected={selected?.seq===step.seq} processing={visibleRun.status==='running'&&step.seq===steps.at(-1)?.seq} onSelect={()=>{setSelectedSeq(step.seq);setFollowLive(false)}}/>)}</div>
          <div className="lab-flow" ref={flowRef} aria-label="Architecture runtime call path"><span className="lab-flow-caption">RUNTIME CALL PATH</span>{runtimeSteps.map((step,index)=><React.Fragment key={step.seq}>{index>0&&<span className="lab-arrow" aria-hidden="true">→</span>}<FlowNode step={step} selected={selected?.seq===step.seq} processing={visibleRun.status==='running'&&step.seq===steps.at(-1)?.seq} onSelect={()=>{setSelectedSeq(step.seq);setFollowLive(false)}}/></React.Fragment>)}{visibleRun.status==='running'&&<div className="lab-pending" aria-live="polite">Evaluating next handoff…</div>}</div>
        </>:<div className="empty-inline">Click an open question to generate its route and control trace.</div>}
      </section>

      <section className="surface lab-inspector">
        <div className="section-heading"><div><span className="eyebrow">INPUT · CONTROL · OUTPUT</span><h2>{selected?.component||'Select a handoff'}</h2></div>{selected&&<span className="pill quiet">{selected.evidence_id}</span>}</div>
        {selected?<div className="lab-message-grid">
          <div><span>Received from previous component</span><p>{selected.input}</p></div>
          <div><span>Control and accountable owner</span><p>{selected.control}<br/><strong>{selected.owner}</strong></p></div>
          <div><span>Passed to next component</span><p>{selected.output}</p></div>
          <div><span>Identity / live proof gap</span><p>{selected.identity}<br/><strong>{selected.proof_gap}</strong></p></div>
        </div>:<p className="empty-inline">Inputs, outputs, authorization and proof gaps appear as the Python evaluator advances.</p>}
      </section>
    </section>

    <aside className="surface lab-decision">
      <div className="section-heading"><div><span className="eyebrow">MEETING DECISION RECORD</span><h2>Required alignment</h2></div></div>
      {question?<>
        <div className="lab-position"><span>Discussion baseline · not approved policy</span><p>{question.current_position}</p></div>
        <div className="lab-decision-question"><span>Decision to resolve</span><strong>{question.decision}</strong><small>Owner · {question.owner}</small></div>
        <div className="lab-open-status">OPEN · No policy or tenant approval is asserted by this simulator.</div>
        <h3>Proof needed before approval</h3><ul className="lab-gates">{question.gates.map(gate=><li key={gate}>{gate}</li>)}</ul>
        <h3>Control ownership to align</h3><div className="lab-matrix">{(visibleRun?.control_matrix||[]).map(row=><div key={row.component}><strong>{row.component}</strong><span>{row.owner}</span><p>{row.responsibility}</p></div>)}</div>
        {visibleRun?.status==='complete'&&<button type="button" className="lab-export" onClick={()=>downloadPacket(visibleRun)}>Download synthetic decision packet</button>}
      </>:<p className="empty-inline">Each question shows its decision owner, control matrix and live proof gates here.</p>}
    </aside>
  </main>;
}
