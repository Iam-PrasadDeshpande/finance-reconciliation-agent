import React,{useState} from 'react';
import {fiscalLabel,longMonth} from './period';
import './close.css';

const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value||0));
const signed=value=>`${Number(value)>0?'+':Number(value)<0?'−':''}${money(Math.abs(Number(value||0)))}`;

// Close & reconcile in one view: all periods with both balances and the variance on the left, the selected period on the right.
export default function CloseCockpit({period,onPeriod,onOpenReport,onAsk,banner,conditions=[],onCondition,history,cases=[],currentCase,proposal,role,onRole,approve,onOpenEvidence,summary,periodPanel,extrasLeft,extrasRight}){
  const [statusFilter,setStatusFilter]=useState('all');
  const [condition,setCondition]=useState('');
  const [applied,setApplied]=useState('');
  const rows=history?.periods||[];
  const staleSources=row=>Object.entries(row.sources||{}).filter(([,source])=>source.freshness!=='current').map(([name])=>name.toUpperCase());
  const stale=rows.filter(row=>staleSources(row).length>0);
  const visible=rows.filter(row=>statusFilter==='all'||(statusFilter==='exception')===(staleSources(row).length>0));
  const s=summary?.summary;
  const result=currentCase?.result;
  return <section className="close-screen" aria-label="Close and reconcile" data-testid="close-screen">
    <div className="surface cl-head">
      <div><span className="eyebrow">FINANCE / PERIOD-END CLOSE</span><h2>Close &amp; reconcile</h2>{banner||<p>S/4HANA versus Central Finance for company code 1000, ledger 0L, USD · selected {longMonth(period)} · {fiscalLabel(period)}</p>}</div>
      <div className="cl-head-actions"><div className="cl-buttons"><button type="button" className="primary" onClick={onAsk}>Ask the agents about {longMonth(period)}</button><button type="button" className="rr-row-report" onClick={()=>onOpenReport?.(period)}>Detailed report for {period} →</button></div></div>
    </div>
    <div className="cl-grid">
      <section className="surface cl-left" aria-label="Monthly reconciliation">
        <div className="cl-toolbar"><h3>Monthly reconciliation · {rows.length} periods · {rows.length-stale.length} comparable · <span className={stale.length?"cl-bad":""}>{stale.length} exceptions</span></h3>
          <div className="cl-filter" role="group" aria-label="Status filter">{[['all','All'],['ready','Ready'],['exception','Exception']].map(([id,label])=><button type="button" key={id} className={statusFilter===id?'active':''} aria-pressed={statusFilter===id} onClick={()=>setStatusFilter(id)}>{label}</button>)}</div></div>
        <div className="cl-cols" aria-hidden="true"><span>Period</span><span className="num">S/4HANA</span><span className="num">Central Finance</span><span className="num">Variance</span><span>Status</span></div>
        <div className="worklist">{visible.map(row=>{const bad=staleSources(row);const variance=row.sources.s4.balance-row.sources.cfin.balance;return <button type="button" key={row.period} className={period===row.period?'selected':''} aria-pressed={period===row.period} onClick={()=>onPeriod?.(row.period)} title={bad.length?`${bad.join(', ')} freshness requires review`:undefined}>
          <span>{row.period}</span><span className="num">{money(row.sources.s4.balance)}</span><span className="num">{money(row.sources.cfin.balance)}</span><strong className="num">{bad.length?'Source review':signed(variance)}</strong><em className={bad.length?'warn':'ok'}>{bad.length?'EXCEPTION':'READY'}</em></button>})}{!visible.length&&<p className="fi-empty-filter">No periods match the filter.</p>}</div>
        {conditions.length>0&&<div className="rr-condition cl-lab" role="group" aria-label="Simulate a close condition"><div><span className="eyebrow">SCENARIO LAB · SYNTHETIC</span></div>
          <select value={condition} onChange={event=>{setCondition(event.target.value);setApplied('')}} aria-label="Condition"><option value="">Choose a condition…</option>{conditions.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
          <button type="button" disabled={!condition} onClick={()=>{onCondition?.(period,condition);setApplied(condition)}}>Apply to {period}</button>
          {(applied||condition)&&<span className="rr-condition-note" role="status">{applied?`${conditions.find(item=>item.id===applied)?.what} Run the period again, then open the detailed report.`:conditions.find(item=>item.id===condition)?.what}</span>}</div>}
        {extrasLeft}
      </section>
      <div className="cl-right">
        {periodPanel}
        {extrasRight}
        <details className="surface cl-case"><summary><strong>Case, evidence and approval</strong><span>{cases.length} case(s) reviewed this session</span></summary>
          {result?<>{result.scope?.period===period&&result.advisory_explanation&&<p className="micro" data-testid="case-explanation">{result.advisory_explanation}</p>}<div className="detail-line"><span>Case</span><strong>{currentCase.case_id}</strong></div><div className="detail-line"><span>Period / route</span><strong>{result.scope.period} · {currentCase.scenario}</strong></div><div className="detail-line"><span>S/4HANA − Central Finance</span><strong>{money(result.variance.amount)}</strong></div><div className="detail-line"><span>Source status</span><strong>{result.variance.state}</strong></div>
            <button className="detail-toggle" type="button" onClick={onOpenEvidence}>Open account, document and correlation evidence →</button></>:<p className="micro">Ask the agents for a reconciliation to attach a case and its source lineage.</p>}
          <div className="approval-lane"><span className="eyebrow">SEPARATE SYNTHETIC APPROVAL LANE</span><p>{proposal?`Proposal ${proposal.proposal_id} · ${proposal.status} · signed variance marker ${money(proposal.amount)}`:'No proposal for this case.'}</p>
            <label htmlFor="demo-role">Demo role</label><select id="demo-role" value={role} onChange={event=>onRole(event.target.value)}><option value="maker">Finance maker</option><option value="approver">Finance approver</option></select>
            <button type="button" disabled={role!=='approver'||proposal?.status!=='awaiting_approval'} onClick={approve}>Approve variance marker</button>
            <small>Approval records a local synthetic marker only; it does not determine accounts or post to SAP.</small></div></details>
      </div>
    </div>
  </section>;
}
