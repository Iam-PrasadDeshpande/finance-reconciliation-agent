import React,{useMemo,useState} from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import {SELECTION,RECOMMENDATION,GATEWAY_RESPONSIBILITIES,IDENTITY_CHAIN,ACCOUNT,LIFECYCLE,GUARDRAILS,RACI,POC_VALIDATIONS,COST,SCENARIOS,IDS,BANNER} from './mcpScenarios';
import {recommend,estimate,breakEven} from './selectionEngine';
import './mcp-governance.css';
import './arch-split.css';
import './selection.css';

// Selection, cost and governance: the recommendation framework, the two gateways and the identity chain, an editable cost model with no
// invented rates, and the proposed AWS account architecture. All content comes from the canonical model.
const TABS=[['recommendation','Recommendation'],['gateways','Gateways and identity'],['cost','Cost model'],['account','AWS account and governance']];
const STATUS_CLASS={RECOMMENDED:'ok',CONDITIONAL:'warn',HOLD:'hold'};
const money=v=>v===null||v===undefined?'PENDING':v.toLocaleString(undefined,{maximumFractionDigits:2});

function Table({head,rows,testid}){
  return <div className="mg-scroll"><table className="mg-table" data-testid={testid}><thead><tr>{head.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th scope="row" key={j}>{cell}</th>:<td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function Recommendation({onDiagram}){
  const [inputs,setInputs]=useState({...SELECTION.defaults});
  const result=useMemo(()=>recommend(SELECTION,inputs),[inputs]);
  const set=(id,value)=>setInputs(previous=>({...previous,[id]:value}));
  return <div className="sel-grid">
    <section className="surface mg-section" aria-label="Architecture preference"><h3>Preference: S1 for SAP-centric agents, S3 for SAP and non-SAP agents</h3>
      <p className="mg-reco" data-testid="sel-headline"><strong>{RECOMMENDATION.headline}</strong></p>
      <div className="mg-cards"><article><h4>Conditions</h4><ul>{RECOMMENDATION.conditions.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Cost assumptions</h4><ul>{RECOMMENDATION.cost_assumptions.map(x=><li key={x}>{x}</li>)}</ul></article>
        <article><h4>Key risks</h4><ul>{RECOMMENDATION.risks.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Rejected alternatives</h4><ul>{RECOMMENDATION.rejected.map(x=><li key={x}>{x}</li>)}</ul></article>
        <article><h4>Evidence still missing</h4><ul>{RECOMMENDATION.missing.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Approval authority and revisit</h4><p>{RECOMMENDATION.authority}</p><ul>{RECOMMENDATION.revisit.map(x=><li key={x}>{x}</li>)}</ul></article></div></section>
    <section className="surface mg-section" aria-label="Recommendation evaluator" data-testid="sel-evaluator"><h3>Evaluate a workload</h3><p className="micro">Set what is actually known. Missing approvals give HOLD or CONDITIONAL, never an unconditional selection. Defaults are the current state: nothing is approved or validated yet.</p>
      <div className="sel-form">{SELECTION.inputs.map(field=><label key={field.id}><span>{field.label}</span><select aria-label={field.label} data-input={field.id} value={inputs[field.id]} onChange={event=>set(field.id,event.target.value)}>{field.options.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>)}</div>
      <div className={`sel-result ${STATUS_CLASS[result.status]}`} data-testid="sel-result" data-status={result.status} data-scenario={result.scenario||''}>
        <div className="sel-head"><span className="sel-status">{result.status}</span><strong>{result.scenario?`${result.scenario} · ${SCENARIOS[result.scenario].short}`:`No scenario can be selected · evaluate ${result.evaluate_first} first`}</strong>{!result.selectable&&<span className="pill warn">{result.scenario?'CONDITIONAL, NOT SELECTABLE YET':'SELECTION NOT ALLOWED'}</span>}</div>
        <div className="mg-cards"><article><h4>Why</h4><ul>{result.reasons.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Conditions</h4><ul>{result.conditions.length?result.conditions.map(x=><li key={x}>{x}</li>):<li>None beyond the listed evidence</li>}</ul></article>
          <article><h4>Evidence still missing</h4><ul data-testid="sel-missing">{result.missing_evidence.length?result.missing_evidence.map(x=><li key={x}>{x}</li>):<li>None</li>}</ul></article><article><h4>Rejected</h4><ul>{result.rejected.map(([s,why])=><li key={s}><strong>{s}</strong> {why}</li>)}</ul></article></div>
        <p className="micro">Approval authority: {result.authority}. Revisit when: {result.revisit.join('; ')}.</p></div></section>
    <section className="surface mg-section" aria-label="Selection rules"><h3>Selection rules</h3><Table head={['Rule','Applies when']} rows={SELECTION.rules} testid="sel-rules"/><button type="button" className="text-link" onClick={()=>onDiagram('D9')}>Decision tree diagram →</button></section>
  </div>;
}

function Gateways({onDiagram}){
  return <div className="sel-grid">
    <section className="surface mg-section" aria-label="Gateway responsibilities"><h3>AgentCore Gateway and Google Apigee: responsibilities in S3</h3><p className="micro">Candidate responsibilities, not assumptions: each is validated against supported features and the enterprise configuration. Avoid duplicate MCP tool publication or ambiguous tool names for the same capability.</p>
      <Table head={['Responsibility','AgentCore Gateway','Google Apigee','Note']} rows={GATEWAY_RESPONSIBILITIES} testid="sel-gateways"/></section>
    <section className="surface mg-section" aria-label="Identity chain"><h3>Identities from the business user to the SAP backend</h3><p className="micro">Global User ID, a user-name header or a workload token alone is not principal propagation. The negative test: an authorized and an unauthorized user call the same read-only tool and SAP rejects the unauthorized one.</p>
      <Table head={['Identity','Where','What it is']} rows={IDENTITY_CHAIN} testid="sel-identity"/><button type="button" className="text-link" onClick={()=>onDiagram('D7')}>Gateway and principal propagation diagram →</button></section>
  </div>;
}

function CostModel({onDiagram}){
  const [volumes,setVolumes]=useState({}),[rates,setRates]=useState({}),[profile,setProfile]=useState(COST.workloads[0][0]),[component,setComponent]=useState('runtime'),[pair,setPair]=useState(['S1','S3']);
  const result=useMemo(()=>estimate(COST.components,volumes,rates),[volumes,rates]);
  const be=useMemo(()=>breakEven(COST.components,volumes,rates,component,pair[0],pair[1]),[volumes,rates,component,pair]);
  const setRate=(id,sid,value)=>setRates(previous=>({...previous,[id]:{...(previous[id]||{}),[sid]:value}}));
  const complete=IDS.filter(sid=>result[sid].total!==null);
  return <div className="sel-grid">
    <section className="surface mg-section" aria-label="Cost model" data-testid="cost-model"><h3>Comparative operating cost: one workload, three scenarios</h3><p className="micro" data-testid="cost-note">{COST.note}</p>
      <label className="sel-profile"><span>Workload profile (one definition for all scenarios)</span><select aria-label="Workload profile" value={profile} onChange={event=>setProfile(event.target.value)}>{COST.workloads.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
      <div className="mg-scroll"><table className="mg-table sel-cost"><thead><tr><th scope="col">Cost component</th><th scope="col">Monthly volume</th>{IDS.map(sid=><th scope="col" key={sid}>{SCENARIOS[sid].short}<small>rate per unit</small></th>)}</tr></thead>
        <tbody>{COST.components.map(c=><tr key={c.id}><th scope="row">{c.label}<small>{c.driver}</small></th>
          <td><input type="number" min="0" aria-label={`${c.label} volume`} data-volume={c.id} value={volumes[c.id]??''} onChange={event=>setVolumes(previous=>({...previous,[c.id]:event.target.value}))}/></td>
          {IDS.map(sid=>c.applies[sid]?<td key={sid}><input type="number" min="0" step="any" aria-label={`${c.label} rate ${sid}`} data-rate={`${c.id}:${sid}`} value={(rates[c.id]||{})[sid]??''} onChange={event=>setRate(c.id,sid,event.target.value)}/><small>{c.applies[sid]}</small></td>:<td key={sid} className="sel-na">not used</td>)}</tr>)}</tbody>
        <tfoot><tr data-testid="cost-totals"><th scope="row">Monthly total (illustrative until rates have a source)</th><td/>{IDS.map(sid=><td key={sid} data-total={sid} className={result[sid].total===null?'mg-open':''}><strong>{money(result[sid].total)}</strong>{result[sid].total===null&&<small>{result[sid].missing.length} input(s) missing · partial {money(result[sid].partial)}</small>}</td>)}</tr>
          <tr><th scope="row">Sensitivity, ±20% on every rate</th><td/>{IDS.map(sid=><td key={sid}>{result[sid].total===null?'PENDING':`${money(result[sid].total*0.8)} to ${money(result[sid].total*1.2)}`}</td>)}</tr></tfoot></table></div>
      <div className="sel-break" data-testid="cost-breakeven"><strong>Break-even</strong> volume of <select aria-label="Break-even component" value={component} onChange={event=>setComponent(event.target.value)}>{COST.components.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select> between <select aria-label="Break-even first" value={pair[0]} onChange={event=>setPair([event.target.value,pair[1]])}>{IDS.map(s=><option key={s}>{s}</option>)}</select> and <select aria-label="Break-even second" value={pair[1]} onChange={event=>setPair([pair[0],event.target.value])}>{IDS.map(s=><option key={s}>{s}</option>)}</select>: <b data-breakeven>{be===null?'not computable (a rate or volume is missing, the slopes are equal or the volume would be negative)':be.toLocaleString(undefined,{maximumFractionDigits:2})}</b>{complete.length<2&&<span className="micro"> · needs the other components filled in</span>}</div>
      <p className="micro">Do not conclude that a high invocation frequency makes AWS cheaper: it can raise gateway and runtime charges as well. SAP BTP credit rates, enterprise AWS discounts and Apigee charges must come from the contracts.</p><button type="button" className="text-link" onClick={()=>onDiagram('D8')}>Cost and operational responsibility diagram →</button></section>
  </div>;
}

function Account({onDiagram}){
  return <div className="sel-grid">
    <section className="surface mg-section" aria-label="AWS account proposal" data-testid="acct-topology"><h3>Dedicated SAP-agent AWS account (proposal)</h3><p className="pill warn">{ACCOUNT.status}</p>
      <Table head={['Account or layer','What it holds','Owns']} rows={ACCOUNT.topology} testid="acct-table"/><p className="micro">{ACCOUNT.qualification}</p><button type="button" className="text-link" onClick={()=>onDiagram('D6')}>AWS account and governance diagram →</button></section>
    <section className="surface mg-section" aria-label="Account evaluation"><div className="mg-cards"><article><h4>Evaluate for the account</h4><ul>{ACCOUNT.evaluate.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Central registry and cross-account sharing</h4><ul>{ACCOUNT.registry_sharing.map(x=><li key={x}>{x}</li>)}</ul></article>
      <article><h4>Common implementation lifecycle</h4><ol>{LIFECYCLE.map(x=><li key={x}>{x}</li>)}</ol></article><article><h4>Guardrails for every scenario</h4><ul>{GUARDRAILS.map(x=><li key={x}>{x}</li>)}</ul></article></div></section>
    <section className="surface mg-section" aria-label="Operating ownership"><h3>Operating ownership (RACI)</h3><Table head={['Area','Responsible','Accountable','Consulted','Informed']} rows={RACI} testid="acct-raci"/>
      <h3>POC validations</h3><ul className="sel-poc">{POC_VALIDATIONS.map(x=><li key={x}>{x}</li>)}</ul><p className="micro">Compare the preferred options S1 (SAP-centric agents) and S3 (SAP and non-SAP agents) first; S2 stays as a reference and is compared only on request. Nothing here provisions an account or a service.</p></section>
  </div>;
}

export default function SelectionView({onRegistry,onMcp}){
  const [tab,setTab]=useState('recommendation'),[diagram,setDiagram]=useState(null);
  return <main className="detailed-diagrams mcp-governance arch-page selection-page" aria-label="Selection and cost">
    <header className="surface dd-header"><div className="dd-title"><span className="eyebrow">SELECTION · RECOMMENDATION FRAMEWORK, GATEWAYS, COST AND AWS ACCOUNT</span><h2>Choose the hosting by evidence, and revisit it</h2></div>
      <nav className="dd-selector" role="tablist" aria-label="Selection views">{TABS.map(([id,label])=><button type="button" role="tab" key={id} aria-selected={tab===id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</nav>
      <div className="dd-header-actions"><span className="pill warn">{BANNER.split(' · ').slice(0,2).join(' · ')}</span></div></header>
    {tab==='recommendation'&&<Recommendation onDiagram={setDiagram}/>}{tab==='gateways'&&<Gateways onDiagram={setDiagram}/>}{tab==='cost'&&<CostModel onDiagram={setDiagram}/>}{tab==='account'&&<Account onDiagram={setDiagram}/>}
    <nav className="mg-anchors" aria-label="Related views">{onMcp&&<button type="button" onClick={onMcp}>MCP hosting →</button>}{onRegistry&&<button type="button" onClick={onRegistry}>Registry →</button>}</nav>
    {diagram&&<ArchitectureDiagram diagramKey={diagram} onClose={()=>setDiagram(null)}/>}
  </main>;
}
