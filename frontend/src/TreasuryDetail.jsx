import React,{useEffect,useRef,useState} from 'react';
import {PeriodSelect,ProvenanceStrip} from './PeriodUi';
import {Chip,Sparkline,fmt,signedFmt} from './TreasuryCockpit';
import {fiscalLabel,longMonth} from './period';
import './reconciliation-report.css';
import './treasury.css';

const TABS=[['position','Position'],['forecast','Forecast'],['banks','Bank relationships'],['policy','Policy & statements'],['proposals','Transfer proposals'],['sap','SAP guidance & sources']];
const SAP_APPS=[['Cash Position (F1737)','Daily positions by account. Display currency and exchange rate type are mandatory fields in SAP.'],['Liquidity Forecast Details (F0741)','Forecast flows by liquidity item.'],['Cash Flow Analyzer','Combines cash position details, liquidity forecast detail and actual cash flow.'],['Bank transfer templates and Make Bank Transfers','Where a person with authorization creates the transfer from an approved proposal.'],['Manage Bank Accounts','Bank account master data.']];

function Position({data}){
  const pos=data.position;
  return <div className="rr-pane"><table className="rr-table" data-testid="detail-accounts"><thead><tr><th>Account</th><th>Entity</th><th>Bank</th><th>Ccy</th><th className="num">Opening</th><th className="num">+ Receipts</th><th className="num">− Payments</th><th className="num">Expected close</th><th className="num">Minimum</th><th className="num">Target</th><th>Status</th><th className="num">USD equiv. close</th></tr></thead>
    <tbody>{pos.accounts.map(a=><tr key={a.id} className={a.status==='DEFICIT'?'hl':''}><td>{a.id} <small>{a.kind}</small></td><td>{a.entity}</td><td>{a.bank_name}</td><td>{a.ccy}</td><td className="num">{fmt(a.opening)}</td><td className="num">{fmt(a.receipts)}</td><td className="num">{fmt(a.payments)}</td><td className="num">{fmt(a.expected_closing)}</td><td className="num">{fmt(a.min)}</td><td className="num">{fmt(a.target)}</td><td><Chip status={a.status}/></td><td className="num">{fmt(a.usd_closing)}</td></tr>)}</tbody>
    <tfoot><tr><th colSpan="11">Group total, USD equivalent</th><td className="num">{fmt(pos.totals.usd_closing)}</td></tr></tfoot></table>
    <p className="rr-note">Expected close = opening + expected receipts − expected payments for the as-of business day. Deficit = expected close below the minimum. Idle cash = opening above 1.5 × target. Rates are synthetic ({Object.entries(pos.fx).map(([c,r])=>`${c} ${r}`).join(', ')}).</p></div>;
}

function Forecast({data}){
  const [horizon,setHorizon]=useState('30');
  const fc=data.forecast[horizon];
  return <div className="rr-pane" data-testid="detail-forecast">
    <div className="tr-horizon" role="group" aria-label="Forecast horizon">{['7','30','90'].map(h=><button type="button" key={h} className={horizon===h?'active':''} aria-pressed={horizon===h} onClick={()=>setHorizon(h)}>{h} days</button>)}</div>
    <table className="rr-table"><thead><tr><th>Currency</th><th className="num">Opening</th><th className="num">Projected close</th><th className="num">Net</th><th className="num">Sum of minimums</th><th className="num">Lowest</th><th>First shortfall</th><th>If paid on due date</th></tr></thead>
      <tbody>{fc.by_currency.map(c=><tr key={c.ccy} className={c.first_shortfall?'hl':''}><td>{c.ccy}</td><td className="num">{fmt(c.opening)}</td><td className="num">{fmt(c.closing)}</td><td className="num">{signedFmt(c.net)}</td><td className="num">{fmt(c.minimum_required)}</td><td className="num">{fmt(c.lowest)}</td><td>{c.first_shortfall?c.first_shortfall.date:'none'}</td><td>{c.first_shortfall_if_paid_on_due_date?c.first_shortfall_if_paid_on_due_date.date:'none'}</td></tr>)}</tbody></table>
    <Sparkline series={fc.usd_series} label={`Projected group cash, ${horizon} days`}/>
    <h3>Flows by flow type and liquidity item</h3>
    <table className="rr-table"><thead><tr><th>Flow type</th><th>Liquidity item</th><th>Planning level</th><th className="num">USD equivalent</th></tr></thead><tbody>{fc.by_flow_type.map(f=><tr key={f.flow_type}><td>{f.name}</td><td>{f.liquidity_item}</td><td>{f.planning_level}</td><td className="num">{signedFmt(f.usd)}</td></tr>)}</tbody></table>
    <p className="rr-note">Receipts are moved by observed payment behaviour ({fc.payment_behaviour.map(p=>`${p.segment} ${p.days_late} days late`).join(', ')}). {fc.basis}</p></div>;
}

function Banks({data}){
  const b=data.banks;
  return <div className="rr-pane"><table className="rr-table" data-testid="detail-banks"><thead><tr><th>Bank</th><th>Accounts</th><th className="num">Balance (USD)</th><th className="num">Share</th><th className="num">Average balance</th><th className="num">Payments</th><th className="num">Volume (USD)</th><th className="num">Credit line</th><th className="num">Drawn</th><th className="num">Borrowings</th><th className="num">Investments</th><th className="num">Fees (USD)</th><th className="num">Fee per payment</th></tr></thead>
    <tbody>{b.banks.map(r=><tr key={r.bank} className={r.share_pct>b.concentration_limit_pct?'hl':''}><td>{r.name}</td><td>{r.accounts.join(', ')}</td><td className="num">{fmt(r.usd_balance)}</td><td className="num">{r.share_pct}%</td><td className="num">{fmt(r.avg_balance_usd)}</td><td className="num">{fmt(r.payment_count)}</td><td className="num">{fmt(r.payment_volume_usd)}</td><td className="num">{fmt(r.credit_line_limit)}</td><td className="num">{fmt(r.credit_line_drawn)}</td><td className="num">{fmt(r.borrowings)}</td><td className="num">{fmt(r.investments)}</td><td className="num">{fmt(r.fees_total_usd)}</td><td className="num">{r.fee_per_payment_usd.toFixed(2)}</td></tr>)}</tbody>
    <tfoot><tr><th colSpan="7">Total</th><td className="num">{fmt(b.totals.credit_limit)}</td><td className="num">{fmt(b.totals.credit_drawn)}</td><td className="num">{fmt(b.totals.borrowings)}</td><td className="num">{fmt(b.totals.investments)}</td><td className="num">{fmt(b.totals.fees_usd)}</td><td/></tr></tfoot></table>
    <p className="rr-note">{b.over_concentration_limit.length?`Over the ${b.concentration_limit_pct}% concentration limit: ${b.over_concentration_limit.join(', ')}. `:`No bank is over the ${b.concentration_limit_pct}% limit. `}Credit lines, borrowings, investments, volumes and fees are synthetic.</p></div>;
}

function Policy({data}){
  const pos=data.position,s=pos.statements;
  return <div className="rr-pane"><table className="rr-table" data-testid="detail-policy"><thead><tr><th>Rule</th><th>Policy</th><th>Result</th><th>Detail</th></tr></thead><tbody>{pos.policy_checks.map(c=><tr key={c.rule} className={c.status==='BREACH'?'hl':''}><td>{c.rule}</td><td>{c.text}</td><td><span className={`tr-chip ${c.status==='PASS'?'ok':'bad'}`}>{c.status}</span></td><td>{c.detail}</td></tr>)}</tbody></table>
    <h3>Bank statements</h3><p className="rr-note">{s.complete} of {s.expected} complete. {s.missing.length?`Missing: ${s.missing.join(', ')}. `:''}{s.opening_mismatches.length?`Opening balance differs from prior closing: ${s.opening_mismatches.map(m=>`${m.account} (${signedFmt(m.difference)} ${m.ccy})`).join(', ')}.`:'All opening balances agree with the prior closing.'}</p></div>;
}

function Proposals({data,role,onDecision,onAsk}){
  const saved=Object.fromEntries((data.proposals||[]).map(p=>[p.proposal_id,p]));
  const recs=data.recommendations;
  return <div className="rr-pane" data-testid="detail-proposals">
    {recs.recommendations.length?<table className="rr-table"><thead><tr><th>Proposal</th><th>From</th><th>To</th><th className="num">Amount</th><th>Template</th><th>Policy rule</th><th>Status</th><th>Decision</th></tr></thead><tbody>{recs.recommendations.map(r=>{const p=saved[r.proposal_id];return <tr key={r.proposal_id}><td>{r.proposal_id}</td><td>{r.from_account}</td><td>{r.to_account}</td><td className="num">{fmt(r.amount)} {r.ccy}</td><td>{r.template} · {r.template_name}</td><td>{r.policy_rule}</td><td>{p?p.status.replace('_',' '):'not yet drafted'}</td>
      <td>{p?(p.status==='awaiting_approval'?<><button type="button" disabled={role!=='approver'} onClick={()=>onDecision(p,true)}>Approve (marker)</button> <button type="button" disabled={role!=='approver'} onClick={()=>onDecision(p,false)}>Reject</button></>:p.note):<button type="button" onClick={()=>onAsk('Propose transfers to cover shortfalls')}>Ask the agents to draft</button>}{r.caveat&&<small className="tr-caveat"> {r.caveat}</small>}</td></tr>})}</tbody></table>:<p className="rr-empty">No deficit that a transfer template can fund for this period.</p>}
    {recs.unfunded.length>0&&<p className="tr-caveat">Not covered by any template: {recs.unfunded.map(u=>`${u.account} (${fmt(u.remaining)} ${u.ccy})`).join(', ')}. {recs.unfunded[0].reason}</p>}
    <h3>Bank transfer templates</h3><table className="rr-table"><thead><tr><th>Template</th><th>From</th><th>To</th><th>Ccy</th><th className="num">Maximum</th><th>Name</th></tr></thead><tbody>{data.templates.map(t=><tr key={t.template}><td>{t.template}</td><td>{t.from}</td><td>{t.to}</td><td>{t.ccy}</td><td className="num">{fmt(t.max_amount)}</td><td>{t.name}</td></tr>)}</tbody></table>
    <p className="rr-note">SAP describes initiating a bank transfer from an approved proposal. Here an approval records a local marker; nothing is initiated and SAP is not changed.</p></div>;
}

function Sap({refs}){
  return <div className="rr-pane" data-testid="detail-sap">
    <div className="rr-banner warn"><strong>Manual in SAP</strong><span>This demo never initiates a bank transfer. A person with authorization does it in SAP from an approved proposal, then the position is refreshed and checked again.</span></div>
    <h3>Where a person verifies in SAP</h3><ul>{SAP_APPS.map(([name,text])=><li key={name}><b>{name}</b>: {text}</li>)}</ul>
    <p className="rr-note">App names and IDs come from SAP knowledge base articles and SAP Learning. They are NOT_VERIFIED for your release and roles: confirm each one in the SAP Fiori Apps Reference Library.</p>
    <h3>What SAP documents, and what this demo imitates</h3>
    <table className="rr-table"><thead><tr><th>Source</th><th>Supports</th><th>Status</th></tr></thead><tbody>{refs.map(r=><tr key={r.id}><td><a href={r.url} target="_blank" rel="noreferrer">{r.id} · {r.title} ↗</a></td><td>{r.supports}</td><td>{r.status}</td></tr>)}</tbody></table></div>;
}

export default function TreasuryDetail({data,period,periods,onPeriod,role,onDecision,onAsk,refs,initial='position',onClose}){
  const dialogRef=useRef(null);
  const [tab,setTab]=useState(initial);
  useEffect(()=>{const dialog=dialogRef.current;if(dialog&&!dialog.open)dialog.showModal();return()=>{if(dialog?.open)dialog.close()}},[]);
  const pos=data?.position;
  const move=event=>{const index=TABS.findIndex(([id])=>id===tab);if(event.key==='ArrowRight'){setTab(TABS[(index+1)%TABS.length][0]);event.preventDefault()}if(event.key==='ArrowLeft'){setTab(TABS[(index+TABS.length-1)%TABS.length][0]);event.preventDefault()}};
  const body=data?{position:<Position data={data}/>,forecast:<Forecast data={data}/>,banks:<Banks data={data}/>,policy:<Policy data={data}/>,proposals:<Proposals data={data} role={role} onDecision={onDecision} onAsk={onAsk}/>,sap:<Sap refs={refs||[]}/>}[tab]:null;
  return <dialog ref={dialogRef} className="rr-dialog" aria-labelledby="tr-title" onClose={onClose}>
    <header className="rr-header"><div><span className="eyebrow">SYNTHETIC CASH &amp; TREASURY VIEW · AS OF {pos?.as_of||'…'}</span><h2 id="tr-title">{data?`${longMonth(period)} (${fiscalLabel(period)}) · display currency ${pos.display_currency}`:`Loading ${longMonth(period)}…`}</h2>{pos&&<ProvenanceStrip provenance={pos.provenance} compact/>}</div>
      <div className="rr-actions">{onPeriod&&<PeriodSelect period={period} periods={periods} onPeriod={onPeriod} id="tr-period"/>}<button type="button" onClick={onClose} aria-label="Close cash and treasury view">×</button></div></header>
    {data?<><div className="rr-tabs" role="tablist" aria-label="Cash and treasury sections" onKeyDown={move}>{TABS.map(([id,label])=><button type="button" role="tab" key={id} aria-selected={tab===id} tabIndex={tab===id?0:-1} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</div><div className="rr-body" role="tabpanel">{body}</div></>:<div className="rr-body"><p className="rr-empty" role="status">Loading the synthetic treasury view…</p></div>}
  </dialog>;
}
