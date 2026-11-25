import React,{useEffect,useMemo,useRef,useState} from 'react';
import './reconciliation-report.css';
import {PeriodSelect,ProvenanceStrip} from './PeriodUi';

const usd=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value||0));
const signed=value=>`${Number(value)>0?'+':Number(value)<0?'−':''}${usd(Math.abs(Number(value||0)))}`;
const TABS=[['summary','Summary'],['accounts','Accounts'],['matching','Matching details'],['items','Reconciling items'],['aging','Aging'],['controls','Controls'],['posting','SAP posting guide'],['ai','AI review'],['audit','Audit trail']];
const STATUS_LABEL={BALANCED:'Balanced',WITHIN_TOLERANCE:'Within tolerance',EXPLAINED:'Explained · approval needed',EXCEPTION:'Exception · investigate',HOLD:'On hold · sources stale'};
const STATUS_TONE={BALANCED:'ok',WITHIN_TOLERANCE:'ok',EXPLAINED:'info',EXCEPTION:'bad',HOLD:'warn'};

function download(name,type,text){const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
const csvCell=value=>`"${String(value??'').replace(/"/g,'""')}"`;
function itemsCsv(report){
  const head=['item_id','document_id','document_type','account','account_name','posting_date','age_days','s4_amount','cfin_amount','difference','materiality','category','reason_code','status','owner','recommended_action','ai_confidence'];
  return [head.join(','),...report.items.map(item=>head.map(key=>csvCell(key==='ai_confidence'?item.ai.confidence:item[key])).join(','))].join('\r\n');
}

function Bridge({bridge}){
  const total=bridge[0].value;const end=bridge[bridge.length-1].value;
  const lo=Math.min(total,end)*0.985;const hi=Math.max(total,end)*1.005;
  const W=640,H=210,top=24,bottom=44,pw=W/bridge.length;
  const y=value=>top+(H-top-bottom)*(1-(value-lo)/Math.max(1,hi-lo));
  let running=total;
  return <svg className="rr-bridge" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Variance bridge from the S/4HANA balance to the Central Finance balance">
    {bridge.map((step,index)=>{
      const x=index*pw+pw*0.2,w=pw*0.6;let from,to,fill;
      if(step.kind==='total'){from=lo;to=step.value;fill='#0a6ed1'}
      else{from=running;to=running+step.value;running=to;fill=step.value<0?'#bb0000':'#107e3e'}
      const top1=y(Math.max(from,to)),h=Math.max(3,Math.abs(y(from)-y(to)));
      return <g key={step.label}><rect x={x} y={top1} width={w} height={h} fill={fill} rx="2"/><text x={x+w/2} y={top1-6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d2d3e">{step.kind==='total'?usd(step.value):signed(step.value)}</text>
        <text x={x+w/2} y={H-22} textAnchor="middle" fontSize="10.5" fill="#34495c">{step.label.length>20?step.label.slice(0,19)+'…':step.label}</text></g>;
    })}
  </svg>;
}

function Chip({status}){return <span className={`rr-chip ${String(status).toLowerCase().replace('_','-')}`}>{String(status).replace('_',' ')}</span>}

function Summary({report}){
  const s=report.summary;
  return <div className="rr-pane">
    <div className={`rr-banner ${STATUS_TONE[s.status]}`}><strong>{STATUS_LABEL[s.status]}</strong><span>{s.status_text}</span></div>
    <div className="rr-kpis">
      <div><span>S/4HANA balance</span><strong>{usd(s.s4_total)}</strong></div>
      <div><span>Central Finance balance</span><strong>{usd(s.cfin_total)}</strong></div>
      <div className={s.variance?'attn':''}><span>Variance</span><strong>{signed(s.variance)}</strong><small>Tolerance {usd(s.tolerance)}</small></div>
      <div><span>Explained</span><strong>{s.explained_pct}%</strong><small>{usd(s.explained)} of {usd(s.variance)}</small></div>
      <div className={s.unexplained?'attn':''}><span>Unexplained</span><strong>{usd(s.unexplained)}</strong></div>
      <div><span>Open items</span><strong>{s.open_items}</strong><small>{s.high_items} high · {s.matched_movements} matched movements</small></div>
    </div>
    <div className="rr-grid2">
      <section><h3>Variance bridge</h3><p className="rr-note">From the S/4HANA balance to the Central Finance balance, by reason.</p>{report.bridge.length>2?<Bridge bridge={report.bridge}/>:<p className="rr-empty">No reconciling items. The two balances agree.</p>}</section>
      <section><h3>Close timeline · source checks</h3><ol className="rr-timeline">{report.timeline.map(step=><li key={step.source} className={step.freshness==='current'?'ok':'warn'}><strong>{step.step}</strong><span>{usd(step.balance)} · {step.freshness} · {step.timestamp_utc?.slice(11,16)} UTC</span></li>)}</ol></section>
    </div>
    <section><h3>Next actions</h3>{report.actions.length?<table className="rr-table"><thead><tr><th>#</th><th>Item</th><th>Owner</th><th>Action</th><th>Due</th><th className="num">Amount</th></tr></thead><tbody>{report.actions.map(a=><tr key={a.item_id}><td>{a.priority}</td><td>{a.item_id}</td><td>{a.owner}</td><td>{a.action}</td><td>{a.due}</td><td className="num">{signed(a.amount)}</td></tr>)}</tbody></table>:<p className="rr-empty">No action needed for this period.</p>}</section>
    <p className="rr-note">{report.sign_convention}</p>
    <p className="rr-note">Approval readiness: {s.ready_for_approval?'ready for a separate finance approval.':'not ready. Resolve the items above first.'} This report never posts to SAP.</p>
  </div>;
}

function Accounts({report}){
  const max=Math.max(1,...report.accounts.map(a=>Math.abs(a.difference)));
  return <div className="rr-pane"><table className="rr-table"><thead><tr><th>Account</th><th>Name</th><th className="num">S/4HANA</th><th className="num">Central Finance</th><th className="num">Difference</th><th>Open items</th><th>Status</th></tr></thead>
    <tbody>{report.accounts.map(a=><tr key={a.account} className={a.status==='variance'?'hl':''}><td>{a.account}</td><td>{a.name}</td><td className="num">{usd(a.s4_balance)}</td><td className="num">{usd(a.cfin_balance)}</td>
      <td className="num"><span className="rr-bar" style={{width:`${Math.abs(a.difference)/max*60}px`}} aria-hidden="true"/>{signed(a.difference)}</td><td>{a.open_items}</td><td><Chip status={a.status==='variance'?'EXCEPTION':a.status==='matched'?'PASS':'PASS'}/> {a.status.replace('_',' ')}</td></tr>)}</tbody>
    <tfoot><tr><th colSpan="2">Total</th><td className="num">{usd(report.summary.s4_total)}</td><td className="num">{usd(report.summary.cfin_total)}</td><td className="num">{signed(report.summary.variance)}</td><td>{report.summary.open_items}</td><td/></tr></tfoot></table>
    <p className="rr-note">S/4HANA lines come from the synthetic history. Central Finance lines are derived from the document-level differences so that every column adds up.</p></div>;
}

const MATCH_FILTERS=[['all','All rows'],['exceptions','Exceptions only'],['MATCHED','Matched'],['UNMATCHED_SOURCE','Unmatched source'],['UNMATCHED_TARGET','Unmatched target'],['AMOUNT_MISMATCH','Amount mismatch'],['TIMING_DIFFERENCE','Timing difference'],['DUPLICATE','Duplicate'],['REQUIRES_REVIEW','Requires review']];
function Matching({report}){
  const [filter,setFilter]=useState('all');
  const m=report.matching,t=m.totals;
  const rows=m.rows.filter(r=>filter==='all'||(filter==='exceptions'?r.status!=='MATCHED':r.status===filter));
  return <div className="rr-pane">
    <div className="rr-match-totals"><div><span>Matched</span><strong>{t.matched_count}</strong></div><div><span>Exceptions</span><strong>{t.exception_count}</strong></div><div><span>Sum of row differences</span><strong>{signed(t.difference_total)}</strong></div><div><span>Summary variance</span><strong>{signed(t.summary_variance)}</strong></div><div><span>Check</span><strong className={t.reconciles?'rr-match-ok':'rr-match-bad'} data-testid="match-check">{t.reconciles?'Rows explain the variance':'Rows do not explain the variance'}</strong></div></div>
    <label className="rr-filter">Show <select value={filter} onChange={event=>setFilter(event.target.value)} aria-label="Matching status filter">{MATCH_FILTERS.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
    <table className="rr-table" data-testid="matching-table"><thead><tr><th>Matching key</th><th>Source ref</th><th>Target ref</th><th className="num">Amount</th><th>Cur.</th><th>Posting date</th><th>Rule</th><th className="num">Difference</th><th>Status</th><th>Exception reason</th></tr></thead>
      <tbody>{rows.map(r=><tr key={r.matching_key} className={r.status==='MATCHED'?'':'hl'}><td>{r.matching_key}</td><td>{r.source_ref}</td><td>{r.target_ref||'none'}</td><td className="num">{usd(r.amount)}</td><td>{r.currency}</td><td>{r.posting_date||'n/a'}</td><td>{r.rule}</td><td className="num">{signed(r.difference)}</td><td>{r.status}</td><td>{r.reason||'none'}</td></tr>)}{!rows.length&&<tr><td colSpan="10">No rows with this status in this period.</td></tr>}</tbody>
      <tfoot><tr><th colSpan="7">Total of all rows</th><td className="num">{signed(t.difference_total)}</td><td colSpan="2">Summary variance {signed(t.summary_variance)}</td></tr></tfoot></table>
    <p className="rr-note">{t.scope_note} {report.sign_convention}</p>
  </div>;
}

const GUIDE_LINKS=[['Post General Journal Entries (F0718), SAP Help','https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/7340a09096454b7abf4379f926a21567/950f8054747b053de10000000a441470.html?version=2023.latest'],['Manage Journal Entries, SAP Help','https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/3cb1182b4a184bdd93f8d62e3f1f0741/d2d78154f9a7033de10000000a441470.html?version=2023.latest'],['Verify General Journal Entries \u2013 For Requester, SAP Help','https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/651d8af3ea974ad1a4d74449122c620e/6b33e9e760b840098d4c66f49121dc98.html'],['SAP Fiori Apps Reference Library','https://fioriappslibrary.hana.ondemand.com/']];
const JE_LABEL={no:'No journal entry',conditional:'Conditional',after_investigation:'Only after investigation'};
function Posting({report}){
  const g=report.manual_posting;
  return <div className="rr-pane rr-guide" data-testid="posting-guide">
    <div className="rr-banner warn"><strong>Manual posting only</strong><span>This app never posts to SAP and shows no SAP document number. A person with SAP authorization posts, after approval.</span></div>
    <h3>Which items need a journal entry?</h3>
    {report.items.length?<table className="rr-table"><thead><tr><th>Item</th><th>Cause</th><th className="num">Difference</th><th>Manual G/L entry</th><th>Recommended route</th></tr></thead><tbody>{report.items.map(i=><tr key={i.item_id}><td>{i.item_id}</td><td>{i.category_label}</td><td className="num">{signed(i.difference)}</td><td>{JE_LABEL[i.treatment.manual_journal_entry]}</td><td>{i.treatment.route}</td></tr>)}</tbody></table>:<p className="rr-empty">No reconciling items for this period, so there is nothing to correct.</p>}
    <h3>SAP Fiori apps</h3>
    <div className="rr-apps">{g.apps.map(a=><article key={a.id}><b>{a.id} · {a.name}</b><p>{a.use}</p><p><em>{a.note}</em></p></article>)}</div>
    <h3>Manual workflow</h3>
    <ol>{g.steps.map(step=><li key={step.title}><strong>{step.title}.</strong> {step.text}</li>)}</ol>
    <details><summary>Fields the accountant reviews before posting</summary><ul>{g.fields.map(f=><li key={f}>{f}</li>)}</ul><p className="rr-note">No account, amount or posting rule is proposed here. Any example would be synthetic and is intentionally not shown.</p></details>
    <div className="rr-not-done"><strong>What this app did not do</strong><ul>{g.not_done.map(x=><li key={x}>{x}</li>)}</ul></div>
    <p className="rr-note">{g.verification}</p>
    <p className="rr-note">{GUIDE_LINKS.map(([label,url],index)=><React.Fragment key={url}>{index>0&&' · '}<a href={url} target="_blank" rel="noreferrer">{label} ↗</a></React.Fragment>)}</p>
  </div>;
}

function Items({report}){
  const [status,setStatus]=useState('all'),[materiality,setMaterial]=useState('all'),[open,setOpen]=useState(null);
  const rows=report.items.filter(i=>(status==='all'||i.status===status)&&(materiality==='all'||i.materiality===materiality));
  return <div className="rr-pane">
    <div className="rr-filters"><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option value="all">All</option><option value="needs_review">Needs review</option><option value="explained">Explained</option></select></label>
      <label>Materiality<select value={materiality} onChange={e=>setMaterial(e.target.value)}><option value="all">All</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><span>{rows.length} of {report.items.length} items</span></div>
    {report.items.length===0?<p className="rr-empty">No reconciling items for this period.</p>:<table className="rr-table"><thead><tr><th/><th>Document</th><th>Type</th><th>Account</th><th>Posted</th><th className="num">S/4HANA</th><th className="num">Central Finance</th><th className="num">Difference</th><th>Reason</th><th>Status</th></tr></thead>
    <tbody>{rows.map(i=><React.Fragment key={i.item_id}><tr className={open===i.item_id?'hl':''}><td><button type="button" className="rr-expand" aria-expanded={open===i.item_id} aria-label={`Details for ${i.document_id}`} onClick={()=>setOpen(open===i.item_id?null:i.item_id)}>{open===i.item_id?'▾':'▸'}</button></td>
      <td>{i.document_id}</td><td>{i.document_type}</td><td>{i.account} {i.account_name}</td><td>{i.posting_date} · {i.age_days}d</td><td className="num">{usd(i.s4_amount)}</td><td className="num">{usd(i.cfin_amount)}</td><td className="num"><strong>{signed(i.difference)}</strong></td><td>{i.reason_code} · {i.category_label}</td>
      <td><Chip status={i.status==='explained'?'PASS':'HOLD'}/> {i.status.replace('_',' ')} · {i.materiality}</td></tr>
      {open===i.item_id&&<tr className="rr-detail"><td/><td colSpan="9"><div className="rr-detail-grid">
        <div><span>AIF / mapping</span><strong>{i.aif_status} · {i.mapping_status}</strong></div><div><span>Owner</span><strong>{i.owner}</strong></div><div><span>SAP reference</span><strong>{i.sap_reference}</strong></div>
        <div className="wide"><span>Recommended action</span><strong>{i.recommended_action}</strong></div>
        <div className="wide"><span>AI assessment · {Math.round(i.ai.confidence*100)}% confidence</span><strong>{i.ai.rationale}</strong><small>{i.ai.basis}</small></div></div></td></tr>}</React.Fragment>)}</tbody></table>}
    <details className="rr-matched"><summary><strong>Matched movements ({report.matched.length})</strong> · agree in S/4HANA and Central Finance</summary><table className="rr-table"><thead><tr><th>Journal</th><th>Account</th><th>Description</th><th className="num">Amount</th></tr></thead><tbody>{report.matched.map(m=><tr key={m.journal_id}><td>{m.journal_id}</td><td>{m.account} {m.account_name}</td><td>{m.description}</td><td className="num">{usd(m.amount)}</td></tr>)}</tbody></table></details>
  </div>;
}

function Aging({report}){
  const max=Math.max(1,...report.aging.map(b=>Math.abs(b.amount)));
  return <div className="rr-pane"><p className="rr-note">Age of open reconciling items at the period end.</p><div className="rr-aging">{report.aging.map(b=><div key={b.bucket}><span>{b.bucket}</span><div className="rr-meter"><i style={{width:`${Math.abs(b.amount)/max*100}%`}}/></div><strong>{b.count} item{b.count===1?'':'s'} · {signed(b.amount)}</strong></div>)}</div>
    {report.aging[3].count+report.aging[2].count>0&&<p className="rr-banner warn"><strong>Older items</strong><span>Items older than 30 days need an owner and a clearing date before sign-off.</span></p>}</div>;
}

function Controls({report}){
  return <div className="rr-pane"><p className="rr-note">PASS, HOLD and NOT_VERIFIED are reported separately. NOT_VERIFIED means the demo cannot prove it without a real tenant.</p>
    <table className="rr-table"><thead><tr><th>ID</th><th>Control</th><th>Status</th><th>Detail</th></tr></thead><tbody>{report.controls.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td><Chip status={c.status}/></td><td>{c.detail}</td></tr>)}</tbody></table></div>;
}

function AiReview({report}){
  const ai=report.ai_review;
  return <div className="rr-pane"><p className="rr-banner info"><strong>Advisory only</strong><span>The assistant explains and ranks. A person decides. Model: {ai.model}.</span></p>
    <div className="rr-grid2"><section><h3>What the AI did</h3><ul>{ai.did.map(x=><li key={x}>{x}</li>)}</ul></section><section><h3>What it did not do</h3><ul>{ai.did_not.map(x=><li key={x}>{x}</li>)}</ul></section></div>
    <section><h3>Confidence by item</h3>{report.items.length?<div className="rr-aging">{report.items.map(i=><div key={i.item_id}><span>{i.document_id}</span><div className="rr-meter"><i style={{width:`${i.ai.confidence*100}%`}} className={i.ai.confidence<0.7?'low':''}/></div><strong>{Math.round(i.ai.confidence*100)}% · {i.ai.classification}</strong></div>)}</div>:<p className="rr-empty">Nothing to classify.</p>}
      <p className="rr-note">Items below 70% confidence are flagged for human review.</p></section></div>;
}

function Audit({report}){
  return <div className="rr-pane"><div className="rr-detail-grid"><div><span>Report</span><strong>{report.report_id}</strong></div><div><span>Case / route</span><strong>{report.case_id?`${report.case_id} · ${report.scenario}`:'Not attached'}</strong></div><div><span>Trace</span><strong>{report.trace_id||'Run the period to attach a trace'}</strong></div><div><span>As of</span><strong>{report.as_of}</strong></div></div>
    <h3>Source evidence</h3><table className="rr-table"><thead><tr><th>Source</th><th className="num">Balance</th><th>Freshness</th><th>Timestamp</th><th>Evidence id</th></tr></thead><tbody>{report.sources.map(s=><tr key={s.source}><td>{s.source}</td><td className="num">{usd(s.balance)}</td><td><Chip status={s.freshness==='current'?'PASS':'HOLD'}/> {s.freshness}</td><td>{s.timestamp_utc?.replace('T',' ').slice(0,16)} UTC</td><td>SYN-{s.source.toUpperCase()}-{report.period}-AGG</td></tr>)}</tbody></table>
    <h3>Stored events ({report.events.length})</h3>{report.events.length?<table className="rr-table"><thead><tr><th>#</th><th>From</th><th>To</th><th>Operation</th><th>Status</th></tr></thead><tbody>{report.events.map(e=><tr key={e.seq}><td>{e.seq}</td><td>{e.source}</td><td>{e.target}</td><td>{e.operation}</td><td>{e.status}</td></tr>)}</tbody></table>:<p className="rr-empty">No run is attached to this report. Run the period to record events.</p>}
    <p className="rr-note">{report.disclaimer}</p></div>;
}

export default function ReconciliationReport({report,period,periods,onPeriod,onClose}){
  const dialogRef=useRef(null);
  const [tab,setTab]=useState('summary'),[printing,setPrinting]=useState(false);
  useEffect(()=>{const dialog=dialogRef.current;if(dialog&&!dialog.open)dialog.showModal();return()=>{if(dialog?.open)dialog.close()}},[]);
  useEffect(()=>{
    if(!printing)return;
    const done=()=>setPrinting(false);
    window.addEventListener('afterprint',done);
    const timer=setTimeout(()=>{try{window.print()}catch{done()}},60);
    return()=>{clearTimeout(timer);window.removeEventListener('afterprint',done)};
  },[printing]);
  const body=useMemo(()=>{
    if(!report)return null;
    return {summary:<Summary report={report}/>,accounts:<Accounts report={report}/>,matching:<Matching report={report}/>,posting:<Posting report={report}/>,items:<Items report={report}/>,aging:<Aging report={report}/>,controls:<Controls report={report}/>,ai:<AiReview report={report}/>,audit:<Audit report={report}/>}[tab];
  },[report,tab]);
  const move=event=>{const index=TABS.findIndex(([id])=>id===tab);if(event.key==='ArrowRight'){setTab(TABS[(index+1)%TABS.length][0]);event.preventDefault()}if(event.key==='ArrowLeft'){setTab(TABS[(index+TABS.length-1)%TABS.length][0]);event.preventDefault()}};
  return <dialog ref={dialogRef} className="rr-dialog" aria-labelledby="rr-title" onClose={onClose}>
    <header className="rr-header"><div><span className="eyebrow">SYNTHETIC RECONCILIATION REPORT · {report?.report_id||`RPT-${period}`}</span><h2 id="rr-title">{report?`Company code ${report.company_code} · ledger ${report.ledger} · ${report.period_label} (FY${report.fiscal.year} P${String(report.fiscal.period).padStart(2,'0')}) · ${report.currency}`:`Loading report for ${period}…`}</h2>{report&&<ProvenanceStrip provenance={report.provenance} compact/>}</div>
      <div className="rr-actions">{onPeriod&&<PeriodSelect period={period} periods={periods} onPeriod={onPeriod} id="rr-period"/>}{report&&<span className={`rr-chip ${STATUS_TONE[report.summary.status]}`}>{STATUS_LABEL[report.summary.status]}</span>}
        <button type="button" disabled={!report} onClick={()=>download(`${report.report_id}-items.csv`,'text/csv',itemsCsv(report))}>Items CSV ⤓</button>
        <button type="button" disabled={!report} onClick={()=>download(`${report.report_id}.json`,'application/json',JSON.stringify(report,null,2))}>Report JSON ⤓</button>
        <button type="button" disabled={!report} onClick={()=>setPrinting(true)}>Print full report</button>
        <button type="button" onClick={onClose} aria-label="Close reconciliation report">×</button></div></header>
    {report&&printing?<div className="rr-body rr-print-all">{TABS.map(([id,label])=><section key={id}><h2>{label}</h2>{{summary:<Summary report={report}/>,accounts:<Accounts report={report}/>,matching:<Matching report={report}/>,posting:<Posting report={report}/>,items:<Items report={report}/>,aging:<Aging report={report}/>,controls:<Controls report={report}/>,ai:<AiReview report={report}/>,audit:<Audit report={report}/>}[id]}</section>)}</div>:report?<><div className="rr-tabs" role="tablist" aria-label="Report sections" onKeyDown={move}>{TABS.map(([id,label])=><button type="button" role="tab" key={id} aria-selected={tab===id} tabIndex={tab===id?0:-1} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}{id==='items'&&report.items.length?<em>{report.items.length}</em>:null}</button>)}</div>
      <div className="rr-body" role="tabpanel">{body}</div></>:<div className="rr-body"><p className="rr-empty" role="status">Loading the synthetic report…</p></div>}
  </dialog>;
}
