import Logo from './Logo';
import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {fiscalLabel,longMonth,readInitialPeriod,storePeriod,validPeriod} from './period';
import {CockpitProvider,buildCockpit} from './cockpit';
import OntologyView from './OntologyView';
import GenericModuleView from './GenericModuleView';
import './close.css';
import TreasuryCockpit from './TreasuryCockpit';
import TreasuryDetail from './TreasuryDetail';
import {PeriodSelect,ProvenanceStrip} from './PeriodUi';
import CloseCockpit from './CloseCockpit';
import EvidenceShortcut from './EvidenceShortcut';
import EvidenceCorrelation from './EvidenceCorrelation';
import ArchitectureQuestions from './ArchitectureQuestions';
import McpApproaches from './McpApproaches';
import DetailedDiagrams from './DetailedDiagrams';
import McpGovernance from './McpGovernance';
import HostingPriority from './HostingPriority';
import ThemeSwitch from './ThemeSwitch';
import RegistryView from './RegistryView';
import SelectionView from './SelectionView';
import DecisionBrief from './DecisionBrief';
import {PROCESS,CONTROLS} from './roleData';
import './brief.css';
import ReconciliationReport from './ReconciliationReport';
import AgentWorkbench,{AskBar} from './AgentWorkbench';
import WorkflowPanel from './WorkflowPanel';
import PreferenceBanner from './PreferenceBanner';
import Entry from './Entry';
import {PanZoom} from './DetailedDiagrams';
import {liveSvg,LIVE_SIZE} from './liveArchitecture';
import AgentJourney from './AgentJourney';
import {SpaceBar,Crumb,TilePage,SPACES,ARCH_PAGES,archSections} from './Spaces';

const ZONE_ORDER=['Business entry','Design time and registration','Agent runtime','Agent controls','Selected gateway','Domain MCP','SAP BAIP','SAP backends','Enterprise Databricks','Future BDC','Model branch','Write approval'];
const REQUEST_ZONES=['Business entry','Agent runtime','Selected gateway','Domain MCP'];
const BRANCH_ZONES=[['Design time and registration','Design-time activation'],['Agent controls','Identity and keys'],['Future BDC','Future reference only'],['Write approval','Separate write branch']];
const ZONE_SHORT={'Business entry':'Finance request','Design time and registration':'Agent registration','Agent runtime':'External finance agent','Agent controls':'Agent identity','Selected gateway':'Agent gateway','Domain MCP':'Domain tools','SAP BAIP':'SAP integration','SAP backends':'SAP finance','Enterprise Databricks':'Data evidence','Future BDC':'BDC reference','Model branch':'AI advisory','Write approval':'Approval'};
const REVIEWERS=[['FI','Variance operands, freshness, posting controls'],['SAP','Backend roles and approved APIs'],['Central Finance','Replication mapping and cutoff'],['BW/4HANA','Aggregate context and load state'],['Integration','BAIP, destinations and identity'],['Apigee','SAP-facing MCP/API policy, routing and audit (S1, S3; optional in S2)'],['AWS','AgentCore Runtime and Gateway (S2, S3); Agent Registry (all)'],['Databricks','Unity Catalog and Delta evidence'],['BDC','Future sharing boundary'],['Portkey / AI','Redaction, guardrails and advisory text'],['Node.js / Python','Typed UI contracts and deterministic engine'],['UX','Task clarity, accessibility and trace readability']];
const monthLabel=period=>{if(!period)return 'Select month';const [year,month]=period.split('-').map(Number);return new Date(Date.UTC(year,month-1,1)).toLocaleString('en-US',{month:'short',year:'numeric',timeZone:'UTC'})};
const currency=value=>value===null||value===undefined?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(value));
const valueText=value=>{if(value===undefined||value===null)return '—';if(typeof value==='object')return JSON.stringify(value);return String(value)};
async function api(path,method='GET',body){const response=await fetch(path,{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});let data;try{data=await response.json()}catch{data={detail:response.statusText}}if(!response.ok)throw Error(data.detail||response.statusText);return data}

function answerActions(reply,caseRecord){
  if(reply.error)return [];
  const caseId=reply.case_id||caseRecord?.case_id||null;
  const traceId=reply.trace_case_id||caseId;
  const hasResult=Boolean(reply.result||caseRecord?.result);
  const actions=[];
  if(hasResult){actions.push({label:'View reconciliation report',target:'report',caseId});actions.push({label:'Inspect source evidence',target:'finance',caseId})}
  if(traceId)actions.push({label:'Follow component flow',target:'architecture',caseId,traceId});
  if(reply.status==='limited'||reply.status==='needs_scope')actions.push({label:'Open architecture questions',target:'questions'});
  if(!actions.length)actions.push({label:'Open close worklist',target:'business'});
  return actions;
}

function ShellMenu({menuModules=[],open,onToggle,onNavigate}){
  return <div className="shell-menu-wrap"><button type="button" className="shell-menu-trigger" onClick={onToggle} aria-label="Open application menu" aria-expanded={open} aria-controls="finance-app-menu"><span aria-hidden="true">▦</span><span>Menu</span></button>{open&&<div id="finance-app-menu" className="shell-menu-popover" role="menu" aria-label="Finance application menu"><strong>Finance workspace</strong><button type="button" role="menuitem" onClick={()=>onNavigate('launchpad')}>⌂ <span>My Home</span></button><button type="button" role="menuitem" onClick={()=>onNavigate('business')}>▤ <span>Close worklist</span></button>{menuModules.filter(m=>m.tab&&m.tab.id!=='business').map(m=><button type="button" role="menuitem" key={m.id} onClick={()=>onNavigate(m.tab.id)}>{m.icon} <span>{m.short_name}</span></button>)}<button type="button" role="menuitem" onClick={()=>onNavigate('architecture')}>⇄ <span>Live architecture</span></button><button type="button" role="menuitem" onClick={()=>onNavigate('approaches')}>⇌ <span>Complete architecture</span></button><button type="button" role="menuitem" onClick={()=>onNavigate('agent')}>✦ <span>Ask Finance Agent</span></button></div>}</div>;
}

const signedUsd=value=>`${Number(value)>0?'+':Number(value)<0?'\u2212':''}${currency(Math.abs(Number(value||0)))}`;
function PeriodPanel({summary,state,period,onOpenDetail,onAsk,onRun}){
  if(state==='none')return <div className="period-nodata" role="alert" data-testid="level1-nodata">NO DATA AVAILABLE FOR {longMonth(period).toUpperCase()}</div>;
  if(!summary)return <div className="empty-state" role="status"><strong>Loading {longMonth(period)}…</strong></div>;
  const s=summary.summary,t=summary.matching.totals;
  const unmatched=summary.matching.rows.filter(r=>r.status.startsWith('UNMATCHED')).length;
  const tone=s.status==='BALANCED'||s.status==='WITHIN_TOLERANCE'?'ok':s.status==='EXCEPTION'?'bad':s.status==='HOLD'?'warn':'';
  return <div className="period-panel" data-testid="period-panel" data-period={summary.period}>
    <ProvenanceStrip provenance={summary.provenance} compact/>
    <div className={`pp-status ${tone}`}><strong>{s.status.replace('_',' ')}</strong> · {s.status_text}</div>
    <div className="pp-kpis">
      <div><span>Company · ledger</span><strong>{summary.company_code} · {summary.ledger}</strong><small>{summary.currency} · FY{summary.fiscal.year} P{String(summary.fiscal.period).padStart(2,'0')}</small></div>
      <div className={s.variance?'attn':''}><span>Variance</span><strong data-testid="level1-variance">{signedUsd(s.variance)}</strong><small>S/4HANA − Central Finance · positive means S/4HANA is higher</small></div>
      <div><span>Source balance (S/4HANA)</span><strong>{currency(s.s4_total)}</strong></div>
      <div><span>Target balance (Central Finance)</span><strong>{currency(s.cfin_total)}</strong></div>
      <div><span>Matched items</span><strong>{t.matched_count}</strong></div>
      <div className={t.exception_count?'attn':''}><span>Unmatched · exceptions</span><strong>{unmatched} · {t.exception_count}</strong><small>Unexplained {currency(s.unexplained)}</small></div>
    </div>
    <div className="pp-actions"><button type="button" className="primary" onClick={onOpenDetail}>Open detailed reconciliation →</button></div>
    <details className="close-process"><summary>Who does what in the close</summary><ol>{PROCESS.map(([step,who,note])=><li key={step}><b>{step}</b><em>{who}</em><small>{note}</small></li>)}</ol><p><strong>Controls:</strong> {CONTROLS.join(' · ')}.</p></details>
  </div>;
}

const ARCH_TABS=['architecture','approaches','mcp','agenthost','registry','selection','brief','ontology','diagrams'];

function Report({result,onOpenEvidence,onRunCurrent,onOpenDetail,period,summary,summaryState,onAskPeriod}){
  const variance=result?.scope?.period===period?result?.variance:undefined;
  return <section className="surface business-result"><div className="section-heading"><div><span className="eyebrow">MONTH-END RECONCILIATION</span><h2>Selected period</h2></div><span className="pill quiet" data-testid="level1-period">{monthLabel(period)} · {fiscalLabel(period)}</span></div>
    <PeriodPanel summary={summary} state={summaryState} period={period} onOpenDetail={onOpenDetail} onAsk={onAskPeriod} onRun={onRunCurrent}/>
  </section>;
}

function BusinessReportDialog({caseRecord,onClose,onOpenEvidence}){
  const dialogRef=useRef(null);
  const result=caseRecord?.result;
  const variance=result?.variance;
  useEffect(()=>{const dialog=dialogRef.current;dialog?.showModal();return()=>{if(dialog?.open)dialog.close()}},[]);
  return <dialog ref={dialogRef} className="business-report-dialog" aria-labelledby="business-report-title" onClose={onClose}>
    <div className="business-report-header"><div><span className="eyebrow">SYNTHETIC MONTH-END RECONCILIATION</span><h2 id="business-report-title">Business analysis report</h2><p>{result?`${monthLabel(result.scope?.period)} · ${result.scenario} · ${result.case_id}`:'No completed case selected'}</p></div><button type="button" onClick={onClose} aria-label="Close business report">×</button></div>
    {variance?<div className="business-report-body">
      <div className="business-report-summary"><div><span>Variance</span><strong>{variance.amount===null?'Not comparable':currency(variance.amount)}</strong><small>S/4HANA − Central Finance</small></div><div><span>Result state</span><strong>{variance.state.toUpperCase()}</strong><small>{variance.state==='comparable'?'Sources are comparable':'Source review required'}</small></div><div><span>Period</span><strong>{monthLabel(result.scope?.period)}</strong><small>{result.scenario} synthetic route</small></div></div>
      <section><h3>Business conclusion</h3><p>{result.advisory_explanation}</p><p>The calculation is deterministic. Review the supporting records before proposing any variance marker.</p></section>
      <p className="business-report-note">Synthetic local data only. This report does not post to SAP or prove live system authorization.</p>
    </div>:<div className="business-report-body"><div className="empty-state"><strong>No completed report yet</strong><p>Run the architecture for a synthetic month-end period, then open Business report again to inspect the calculated result and evidence.</p></div></div>}
    <div className="business-report-actions">{result&&<button type="button" onClick={()=>{onClose();onOpenEvidence()}}>Inspect source records in Evidence →</button>}<button type="button" className="primary" onClick={onClose}>Close</button></div>
  </dialog>;
}

function ArchitectureRoute({registry,events,scenario,selectedZone,onZone,liveRunning,reportReady,onOpenReport}){
  const [view,setView]=useState(null),[expanded,setExpanded]=useState(false);
  const svg=useMemo(()=>liveSvg({registry,events,scenario,selectedZone,liveRunning,reportReady,zoneShort:ZONE_SHORT}),[registry,events,scenario,selectedZone,liveRunning,reportReady]);
  const diagram=useMemo(()=>({id:'live',title:`Live run (simulator) · ${scenario}`,svg,w:LIVE_SIZE.w,h:LIVE_SIZE.h,file:'live-architecture',png:true}),[svg,scenario]);
  return <div className="route-viewer" aria-label="Live architecture topology"><PanZoom diagram={diagram} uid="live-arch" view={view} onView={setView} onFit={setView} expanded={expanded} onExpand={setExpanded} onPick={zone=>zone==='__report'?onOpenReport():onZone(zone)}/></div>;
}

function ComponentDetails({registry,zone,events,selectedComponent,onComponent,scenario}){
  const components=(registry?.components||[]).filter(c=>c.zone===zone);
  const statusByComponent=useMemo(()=>{const output={};for(const event of events){const id=event.direction==='response'?event.source_component_id:event.target_component_id;output[id]=event}return output},[events]);
  const detail=components.find(c=>c.component_id===selectedComponent)||components[0];
  const selectedEvent=detail&&statusByComponent[detail.component_id];
  return <div className="detail-layout"><section className="surface component-panel"><div className="section-heading"><div><span className="eyebrow">COMPONENT LAYER</span><h2>{zone}</h2></div><span className="pill quiet">{components.length} nodes</span></div><div className="component-grid">{components.map(c=>{const event=statusByComponent[c.component_id];const skipped=(c.runtime_state==='scenario_s1'&&scenario==='S2')||(c.runtime_state==='scenario_s2'&&scenario==='S1');const state=skipped?`INACTIVE IN ${scenario}`:c.runtime_state==='future'?'FUTURE':c.runtime_state==='inactive'?'INACTIVE':event?.direction==='request'?'PROCESSING':event?'RETURNED':'READY';return <button key={c.component_id} type="button" onClick={()=>onComponent(c.component_id)} className={`component-tile ${detail?.component_id===c.component_id?'selected':''} ${state==='PROCESSING'?'working':''} ${skipped?'skipped':''}`}><span className="component-type">{c.classification}</span><strong>{c.display_name}</strong><span className={`component-state ${state==='RETURNED'?'ok':state==='PROCESSING'?'busy':''}`}>{state}</span>{event&&<small>{event.operation.replaceAll('_',' ')} · {event.direction}</small>}</button>})}</div></section><aside className="surface inspector"><span className="eyebrow">ARCHITECT INSPECTOR</span>{detail?<><h2>{detail.display_name}</h2><p>{detail.purpose}</p><div className="inspector-row"><span>Owner</span><strong>{detail.owner}</strong></div><div className="inspector-row"><span>Boundary</span><strong>{detail.trust_boundary}</strong></div><div className="inspector-row"><span>Contract</span><strong>{detail.request_schema}</strong></div><div className="inspector-block"><span className="eyebrow">LATEST COMPONENT MESSAGE</span>{selectedEvent?<><p className="message-operation">{selectedEvent.operation.replaceAll('_',' ')} · {selectedEvent.direction} · {selectedEvent.status}</p><pre>{JSON.stringify(selectedEvent.payload_summary||{},null,2)}</pre></>:<p className="micro">Run a question to see this component's bounded input and output.</p>}</div><div className="validation-note"><strong>Live validation still required</strong><p>{detail.remaining_live_vendor_validation}</p></div></>:<p>Select a component.</p>}</aside></div>
}

export default function App({bridge}){
  const embedded=Boolean(bridge);
  const [boot,setBoot]=useState(bridge?.data||null);
  const cockpit=useMemo(()=>buildCockpit((embedded?bridge?.data?.modules:boot?.modules)||[]),[embedded,bridge?.data?.modules,boot?.modules]);
  const [tab,setTab]=useState('business');
  const [diagramView,setDiagramView]=useState('D1');
  const [mcpView,setMcpView]=useState('S1');
  const [conditions,setConditions]=useState(bridge?.data?.conditions||[]);
  const [agentCatalog,setAgentCatalog]=useState(bridge?.data?.agents||null);
  const [agentPlan,setAgentPlan]=useState(bridge?.data?.agent_plan||null);
  const [agentBusy,setAgentBusy]=useState(false);
  const [agentFocus,setAgentFocus]=useState(null);
  const [showTech,setShowTech]=useState(()=>{try{return localStorage.getItem('finance.showTech')==='1'}catch{return false}});
  const lastDecision=useRef('approaches');
  const [reconPeriod,setReconPeriod]=useState(null);
  const [recon,setRecon]=useState(null);
  const [screen,setScreen]=useState('launchpad');
  const lastMainTab=useRef('business');
  const [chatOpen,setChatOpen]=useState(false);
  const [shellMenuOpen,setShellMenuOpen]=useState(false);
  const agentStart=useRef('ask');
  const [pendingReportCaseId,setPendingReportCaseId]=useState(null);
  const [questionFocus,setQuestionFocus]=useState(null);
  const [evidenceFocus,setEvidenceFocus]=useState({section:'proof',nonce:0});
  const [reportOpen,setReportOpen]=useState(false);
  const [scenario,setScenario]=useState('S1');
  const [period,setPeriod]=useState(readInitialPeriod);
  const periodRev=useRef(0);
  const agentReq=useRef(0);
  const selectPeriod=useCallback(next=>{if(!validPeriod(next))return;periodRev.current+=1;setPeriod(next);storePeriod(next)},[]);
  const [pace,setPace]=useState(60);
  const [question,setQuestion]=useState('');
  const [runIntent,setRunIntent]=useState('Reconcile the selected synthetic period');
  const [messages,setMessages]=useState([{role:'assistant',text:'Ask about a reconciliation, the source evidence, an architecture component, or a control. Each answer has an inspectable synthetic flow.'}]);
  const [currentCase,setCurrentCase]=useState(null);
  const [traceCaseId,setTraceCaseId]=useState(null);
  const [events,setEvents]=useState([]);
  const [running,setRunning]=useState(false);
  const [selectedZone,setSelectedZone]=useState('Business entry');
  const [selectedComponent,setSelectedComponent]=useState(null);
  const [selectedEvent,setSelectedEvent]=useState(null);
  const [replayAt,setReplayAt]=useState(null);
  const [playing,setPlaying]=useState(false);
  const [error,setError]=useState('');
  const [storedCases,setStoredCases]=useState([]);
  const [proposals,setProposals]=useState([]);
  const [historyDetail,setHistoryDetail]=useState(null);
  const [investigation,setInvestigation]=useState(bridge?.data?.investigation||null);
  const [investigationEvents,setInvestigationEvents]=useState([]);
  const [investigationBusy,setInvestigationBusy]=useState(false);
  const [demoRole,setDemoRole]=useState('maker');
  const [questionBusy,setQuestionBusy]=useState(false);
  const [decisionRun,setDecisionRun]=useState(bridge?.data?.decision_run||null);
  const [decisionBusy,setDecisionBusy]=useState(false);
  const questionLock=useRef(false);
  const streamRef=useRef(null),routeRef=useRef(null),chatRef=useRef(null),lastBridgeResponse=useRef(null);
  const architecture=boot?.architecture;
  const history=boot?.history;

  const [l1Fetched,setL1Fetched]=useState(null);
  useEffect(()=>{if(embedded)return;let stop=false;setL1Fetched(null);api(`/api/reports/${period}`).then(report=>{if(!stop)setL1Fetched({period,report})}).catch(exc=>{if(!stop)setL1Fetched({period,error:exc.message})});return()=>{stop=true}},[embedded,period,history,currentCase?.case_id,currentCase?.status]);
  useEffect(()=>{if(embedded)bridge.action({type:'select_period',period})},[embedded,period]);
  const l1Report=embedded?(bridge?.data?.period_report?.period===period?bridge.data.period_report:null):(l1Fetched?.period===period?(l1Fetched.report||null):null);
  const [treasuryDetail,setTreasuryDetail]=useState(null);
  const [moduleRev,setModuleRev]=useState(0);
  const [fetched,setFetched]=useState({});
  const activeModule=cockpit.tabs.find(m=>m.tab.id===tab&&m.renderer!=='builtin:reconciliation')||null;
  const appIds=cockpit.tabs.map(m=>m.tab.id);
  const spaceOf=id=>(id==='apps'||appIds.includes(id))?'apps':id==='agents'?'agents':(id==='arch'||ARCH_TABS.includes(id))?'arch':null;
  const space=spaceOf(tab)||spaceOf(lastMainTab.current)||'apps';
  const enterSpace=id=>{if(id==='agents')agentStart.current='ask';setTab(id==='apps'?'apps':id==='agents'?'agents':'arch')};
  const pageLabel=tab==='business'?'Close & reconcile':(cockpit.tabs.find(m=>m.tab.id===tab)?.tab.label)||(ARCH_PAGES.find(p=>p.id===tab)?.title)||'';
  const appTiles=cockpit.tabs.map(m=>({id:m.tab.id,icon:m.tab.icon,title:m.tab.label,sub:m.blurb||m.name,foot:[`${(agentCatalog?.domains?.[m.id]?.agents||[]).length||'—'} agents`,'Open app']}));
  const wantedView=activeModule?.has_view?activeModule.id:(treasuryDetail?'treasury':null);
  useEffect(()=>{if(embedded||!wantedView)return;let stop=false;api(`/api/cockpit/${wantedView}/view/${period}`).then(view=>{if(!stop)setFetched(previous=>({...previous,[wantedView]:{period,view}}))}).catch(exc=>{if(!stop)setFetched(previous=>({...previous,[wantedView]:{period,error:exc.message}}))});return()=>{stop=true}},[embedded,period,wantedView,moduleRev]);
  const workflowIds=cockpit.modules.filter(m=>m.workflow&&m.has_view).map(m=>m.id);
  useEffect(()=>{if(embedded||tab!=='agents'||!workflowIds.length)return;let stop=false;workflowIds.forEach(id=>api(`/api/cockpit/${id}/view/${period}`).then(view=>{if(!stop)setFetched(previous=>({...previous,[id]:{period,view}}))}).catch(exc=>{if(!stop)setFetched(previous=>({...previous,[id]:{period,error:exc.message}}))}));return()=>{stop=true}},[embedded,tab,period,moduleRev,workflowIds.join(',')]);
  const [actionError,setActionError]=useState('');
  async function moduleAction(moduleId,item){
    setActionError('');
    if(item.role==='approver'&&demoRole!=='approver'){setActionError('Switch to the finance approver role first.');return}
    if(embedded){bridge.action({type:'module_action',module:moduleId,name:item.action,payload:item.payload||{},role:demoRole});return}
    try{await api(`/api/cockpit/${moduleId}/action/${item.action}`,'POST',{...(item.payload||{}),approver_id:demoRole==='approver'?'finance.approver':'finance.maker'});setModuleRev(n=>n+1)}catch(exc){setActionError(exc.message);setModuleRev(n=>n+1)}
  }
  const viewOf=id=>embedded?(bridge?.data?.module_views?.[id]?.period===period?bridge.data.module_views[id]:null):(fetched[id]?.period===period?(fetched[id].view||null):null);
  const stateOf=id=>viewOf(id)?'ok':((history?.available_periods&&!history.available_periods.includes(period))||(!embedded&&fetched[id]?.period===period&&fetched[id].error))?'none':'loading';
  const trData=viewOf('treasury');
  async function decideProposal(proposal,approved){
    if(demoRole!=='approver'){setError('Switch to the finance approver role first.');return}
    setError('');
    const payload={proposal_id:proposal.proposal_id,approved,payload_hash:proposal.payload_hash};
    if(embedded){bridge.action({type:'module_action',module:'treasury',name:'decide',payload,role:demoRole});return}
    try{await api('/api/cockpit/treasury/action/decide','POST',{...payload,approver_id:'finance.approver'});setModuleRev(n=>n+1)}catch(exc){setError(exc.message)}
  }
  const [ontology,setOntology]=useState(bridge?.data?.ontology||null);
  const [ontologyFocus,setOntologyFocus]=useState(null);
  useEffect(()=>{if(embedded){if(bridge?.data?.ontology)setOntology(bridge.data.ontology);return}if(ontology)return;api('/api/cockpit/ontology').then(setOntology).catch(()=>{})},[embedded,bridge?.data?.ontology]);
  const ontologyRefs=Object.values(agentCatalog?.domains||{}).flatMap(domain=>domain.references||[]);
  function openConcept(id){setOntologyFocus(id);setTab('ontology')}
  const agentBanner=id=>{const p=agentPlan;if(!p||p.domain!==id||p.status!=='done'||!p.effective_period||p.effective_period!==period)return null;const text=String(p.answer||'');return <div className="surface agent-run-banner" data-testid="agent-run-banner"><span className="eyebrow">LATEST AGENT RUN · {longMonth(p.effective_period).toUpperCase()}</span><span className="arb-text">{text.slice(0,180)}{text.length>180?'…':''}</span><button type="button" onClick={()=>setTab('agents')}>View agent run →</button></div>};
  function openOutput(plan,kind){const target=cockpit.byId[plan.domain];if(!target)return;const planned=plan.effective_period;if(planned&&planned!==period)selectPeriod(planned);if(kind==='detail'&&target.renderer==='builtin:reconciliation'){setTab('business');openReconReport(planned||period);return}if(kind==='detail'&&target.renderer==='treasury'){setTab('treasury');setTreasuryDetail('position');return}if(target.tab)setTab(target.tab.id)}
  const l1Available=history?.available_periods;
  const l1State=l1Report?'ok':((l1Available&&!l1Available.includes(period))||(!embedded&&l1Fetched?.period===period&&l1Fetched.error))?'none':'loading';
  const activeProposal=proposals.find(p=>p.case_id===currentCase?.case_id);
  useEffect(()=>{if(tab==='business'||tab==='apps'||tab==='arch'||tab==='agents'||ARCH_TABS.includes(tab)||cockpit.tabs.some(m=>m.tab.id===tab))lastMainTab.current=tab},[tab]);
  useEffect(()=>{const selected=currentCase?.scope?.period;if(embedded||!selected)return;api(`/api/history/${selected}`).then(setHistoryDetail).catch(()=>setHistoryDetail(null))},[embedded,currentCase?.scope?.period]);
  const visibleEvents=replayAt===null?events:events.slice(0,replayAt+1);
  const currentEvent=selectedEvent||visibleEvents.at(-1);
  const activeComponent=currentEvent?(currentEvent.direction==='response'?currentEvent.source_component_id:currentEvent.target_component_id):null;
  const activeZone=architecture?.components?.find(c=>c.component_id===activeComponent)?.zone;

  useEffect(()=>{if(embedded)return;Promise.all([api('/api/bootstrap'),api('/api/proposals')]).then(([data,items])=>{setBoot(data);setStoredCases(data.cases||[]);setProposals(items)}).catch(e=>setError(e.message));return()=>{streamRef.current?.close()}},[embedded]);
  useEffect(()=>{if(!embedded)return;const data=bridge.data||{};setBoot(previous=>({...previous,...data}));setStoredCases(data.cases||[]);setProposals(data.proposals||[]);setHistoryDetail(data.history_detail||null);setInvestigation(data.investigation||null);setInvestigationEvents(data.investigation_events||[]);setDecisionRun(data.decision_run||null);if(data.decision_run?.status==='complete')setDecisionBusy(false);if(data.active_case){setCurrentCase(data.active_case);setTraceCaseId(data.active_case.case_id);setScenario(data.active_case.scenario)}if(data.events)setEvents(data.events);setRunning(data.active_case?.status==='queued'||data.active_case?.status==='running');if(data.response&&data.response_nonce!==lastBridgeResponse.current){lastBridgeResponse.current=data.response_nonce;questionLock.current=false;setQuestionBusy(false);setInvestigationBusy(false);setMessages(previous=>[...previous,{role:'assistant',text:data.response.answer||data.response.error||'The synthetic operation completed.',limited:data.response.status==='limited',actions:answerActions(data.response,data.active_case||currentCase)}]);if(data.response.error)setError(data.response.error)}},[embedded,bridge?.data]);
  useEffect(()=>{if(embedded||!investigation?.investigation_id||!['running','reconciling'].includes(investigation.status))return;let cancelled=false;const refresh=async()=>{try{const [record,trace]=await Promise.all([api(`/api/investigations/${investigation.investigation_id}`),api(`/api/architecture/events?case_id=${encodeURIComponent(investigation.case_id)}`)]);if(!cancelled){setInvestigation(record);setInvestigationEvents(trace);setTraceCaseId(record.case_id);setEvents(trace)}}catch(e){if(!cancelled)setError(e.message)}};const timer=setInterval(refresh,350);return()=>{cancelled=true;clearInterval(timer)}},[embedded,investigation?.investigation_id,investigation?.status]);
  useEffect(()=>{if(embedded||tab!=='evidence'||!investigation?.case_id)return;api(`/api/architecture/events?case_id=${encodeURIComponent(investigation.case_id)}`).then(setInvestigationEvents).catch(e=>setError(e.message))},[embedded,tab,investigation?.case_id,investigation?.status]);
  useEffect(()=>{if(embedded||!decisionRun?.run_id||decisionRun.status==='complete')return;let stopped=false;const timer=setInterval(async()=>{try{const next=await api(`/api/architecture/questions/runs/${encodeURIComponent(decisionRun.run_id)}`);if(!stopped){setDecisionRun(next);if(next.status==='complete')setDecisionBusy(false)}}catch(e){if(!stopped){setError(e.message);setDecisionBusy(false)}}},350);return()=>{stopped=true;clearInterval(timer)}},[embedded,decisionRun?.run_id,decisionRun?.status]);
  useEffect(()=>{if(!playing||!events.length)return;const timer=setInterval(()=>setReplayAt(previous=>{const next=(previous??-1)+1;if(next>=events.length){setPlaying(false);return events.length-1}return next}),140);return()=>clearInterval(timer)},[playing,events.length]);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight},[messages]);
  useEffect(()=>{if(!chatOpen)return;const onKey=event=>{if(event.key==='Escape')setChatOpen(false)};window.addEventListener('keydown',onKey);document.getElementById('chat-question')?.focus();return()=>window.removeEventListener('keydown',onKey)},[chatOpen]);
  useEffect(()=>{if(!shellMenuOpen)return;const onPointer=event=>{if(!event.target.closest('.shell-menu-wrap'))setShellMenuOpen(false)};const onKey=event=>{if(event.key==='Escape')setShellMenuOpen(false)};document.addEventListener('pointerdown',onPointer);window.addEventListener('keydown',onKey);return()=>{document.removeEventListener('pointerdown',onPointer);window.removeEventListener('keydown',onKey)}},[shellMenuOpen]);
  useEffect(()=>{if(activeZone&&replayAt===null)setSelectedZone(activeZone)},[activeZone,replayAt]);
  useEffect(()=>{if(pendingReportCaseId&&currentCase?.case_id===pendingReportCaseId){setPendingReportCaseId(null);setReportOpen(true)}},[pendingReportCaseId,currentCase?.case_id]);

  async function refreshCase(caseId){if(embedded){bridge.action({type:'load_case',case_id:caseId});return}const rev=periodRev.current;const [caseData,trace,prior]=await Promise.all([api(`/api/cases/${encodeURIComponent(caseId)}`),api(`/api/architecture/events?case_id=${encodeURIComponent(caseId)}`),api(`/api/investigations?case_id=${encodeURIComponent(caseId)}`)]);setCurrentCase(caseData);setInvestigation(prior[0]||null);setTraceCaseId(caseId);setScenario(caseData.scenario);if(rev===periodRev.current&&caseData.scope?.period&&caseData.scope.period!==period)selectPeriod(caseData.scope.period);setEvents(trace);setReplayAt(null);setSelectedEvent(null)}
  function openStream(caseId){streamRef.current?.close();const stream=new EventSource(`/api/architecture/runs/${encodeURIComponent(caseId)}/stream`);streamRef.current=stream;stream.addEventListener('flow',message=>{const event=JSON.parse(message.data);setEvents(previous=>previous.some(item=>item.seq===event.seq)?previous:[...previous,event])});stream.addEventListener('complete',async()=>{stream.close();streamRef.current=null;setRunning(false);try{await refreshCase(caseId);const data=await api('/api/cases');setStoredCases(data.slice(0,20))}catch(e){setError(e.message)}});stream.onerror=()=>{setError('Live connection interrupted. Stored events can be reloaded from the case list.')};}
  async function startRun(){setError('');setInvestigation(null);setTab('architecture');setEvents([]);setReplayAt(null);setSelectedEvent(null);setRunning(true);const text=runIntent.trim()==='Reconcile the selected synthetic period'||!runIntent.trim()?`Reconcile ${monthLabel(period)}`:runIntent.trim();if(embedded){bridge.action({type:'run',message:text,scenario,period,pace});return}try{const started=await api('/api/runs','POST',{message:text,scenario,user_id:'finance.user',demo_pace_ms:pace});if(started.follow_up){setRunning(false);setError(started.follow_up);return}setTraceCaseId(started.case_id);setCurrentCase({case_id:started.case_id,scenario:started.scenario,scope:started.scope,status:'running'});openStream(started.case_id)}catch(e){setRunning(false);setError(e.message)}}
  async function sendQuestion(text=question){const prompt=text.trim();if(!prompt||questionLock.current)return;const rev=periodRev.current;questionLock.current=true;setQuestionBusy(true);setQuestion('');setMessages(previous=>[...previous,{role:'user',text:prompt}]);setError('');if(embedded){bridge.action({type:'chat',message:prompt,scenario:currentCase?.scenario||scenario,case_id:currentCase?.case_id});return}try{const answer=await api('/api/chat','POST',{message:prompt,scenario:currentCase?.scenario||scenario,case_id:currentCase?.case_id,user_id:'finance.user'});setMessages(previous=>[...previous,{role:'assistant',text:answer.answer||'The synthetic operation completed.',limited:answer.status==='limited',actions:answerActions(answer,answer.result?{case_id:answer.case_id,result:answer.result}:currentCase)}]);if(answer.investigation)setInvestigation(answer.investigation);if(answer.result){setInvestigation(null);setCurrentCase({case_id:answer.case_id,scenario:answer.scenario,scope:answer.result.scope,status:'complete',result:answer.result});if(rev===periodRev.current&&answer.result.scope.period!==period)selectPeriod(answer.result.scope.period);setScenario(answer.scenario)}if(answer.trace_case_id){setTraceCaseId(answer.trace_case_id);setEvents(await api(`/api/architecture/events?case_id=${encodeURIComponent(answer.trace_case_id)}`));setReplayAt(null)}const [cases,items]=await Promise.all([api('/api/cases'),api('/api/proposals')]);setStoredCases(cases.slice(0,20));setProposals(items)}catch(e){setMessages(previous=>[...previous,{role:'assistant',text:`I could not complete that synthetic request: ${e.message}`,limited:true}]);setError(e.message)}finally{questionLock.current=false;setQuestionBusy(false)}}
  async function openReconReport(period){selectPeriod(period);setReconPeriod(period);setRecon(null);if(embedded){bridge.action({type:'report',period});return}try{const caseQuery=currentCase?.scope?.period===period?`?case_id=${encodeURIComponent(currentCase.case_id)}`:'';setRecon(await api(`/api/reports/${period}${caseQuery}`))}catch(exc){setError(exc.message);setReconPeriod(null)}}
  useEffect(()=>{if(embedded){setConditions(bridge.data?.conditions||[]);return}api('/api/conditions').then(setConditions).catch(()=>{})},[embedded,bridge?.data?.conditions]);
  async function applyCondition(period,condition){setError('');if(embedded){bridge.action({type:'condition',period,condition});return}try{await api('/api/conditions','POST',{period,condition});const history=await api('/api/history');setBoot(previous=>({...previous,history}));if(reconPeriod)openReconReport(reconPeriod)}catch(exc){setError(exc.message)}}
  function closeReconReport(){setReconPeriod(null);setRecon(null);if(embedded)bridge.action({type:'report',period:null})}
  useEffect(()=>{if(embedded&&reconPeriod&&bridge.data?.report?.period===reconPeriod)setRecon(bridge.data.report)},[embedded,reconPeriod,bridge?.data?.report]);
  useEffect(()=>{try{localStorage.setItem('finance.showTech',showTech?'1':'0')}catch{/* optional */}},[showTech]);
  useEffect(()=>{if(ARCH_TABS.includes(tab))lastDecision.current=tab},[tab]);
  useEffect(()=>{if(embedded){const data=bridge.data||{};if(data.agents)setAgentCatalog(data.agents);if(data.agent_plan&&data.agent_plan.plan_id!==agentPlan?.plan_id){setAgentPlan(data.agent_plan);setAgentBusy(false);if(data.agent_plan.period_source==='request'&&data.agent_plan.effective_period)selectPeriod(data.agent_plan.effective_period)}return}api('/api/agent/catalog').then(setAgentCatalog).catch(()=>{})},[embedded,bridge?.data?.agents,bridge?.data?.agent_plan]);
  async function askAgents(message,options){setError('');setScreen('app');setTab('agents');setAgentBusy(true);const token=++agentReq.current;if(embedded){bridge.action({type:'agent_plan',message,scenario,case_id:currentCase?.case_id||null,period,options:options||{}});return}try{const plan=await api('/api/agent/plan','POST',{message,scenario,user_id:'finance.user',case_id:currentCase?.case_id||null,period,demo_pace_ms:0,options:options||{}});if(token!==agentReq.current)return;if(plan.period_source==='request'&&plan.effective_period&&plan.effective_period!==period)selectPeriod(plan.effective_period);setAgentPlan(plan);setModuleRev(n=>n+1);if(plan.trace_case_id&&!plan.case_id){setTraceCaseId(plan.trace_case_id);setEvents(await api(`/api/architecture/events?case_id=${encodeURIComponent(plan.trace_case_id)}`));setReplayAt(null)}if(plan.case_id){await refreshCase(plan.case_id);const refreshed=await api('/api/history');setBoot(previous=>({...previous,history:refreshed}));setStoredCases((await api('/api/cases')).slice(0,20))}}catch(exc){setError(exc.message)}finally{setAgentBusy(false)}}
  function goAgent(agent,step){
    if(!agent?.id)return;
    setAgentFocus({id:agent.id,name:agent.name,role:agent.role,tools:agent.tools||[]});
    const view=step?.view||agent.view;
    const period=step?.ref?.period||currentCase?.scope?.period||history?.available_periods?.at(-1);
    if(view==='run')setTab('architecture');
    else if(view==='report')openReconReport(period);
    else if(view==='evidence-proof')openEvidence('proof');
    else if(view==='decision-responsibilities')setTab('mcp');
    else if(typeof view==='string'&&view.startsWith('module:')){const [,moduleId,section]=view.split(':');const target=cockpit.byId[moduleId];if(target?.tab)setTab(target.tab.id);if(moduleId==='treasury'&&section)setTreasuryDetail(section)}
    else setTab('business');
  }
  function moveArea(event){const order=SPACES.map(s=>s.id);const current=order.indexOf(space);let next=null;if(event.key==='ArrowRight')next=(current+1)%order.length;if(event.key==='ArrowLeft')next=(current+order.length-1)%order.length;if(next===null)return;event.preventDefault();const id=order[next];const list=event.currentTarget;enterSpace(id);requestAnimationFrame(()=>list.querySelectorAll('[role=tab]')[next]?.focus())}
  async function approve(){if(demoRole!=='approver'){setError('Switch to the synthetic finance approver lane first.');return}if(embedded){bridge.action({type:'approve',case_id:currentCase?.case_id,role:demoRole});return}try{const items=await api('/api/proposals');const proposal=items.find(p=>p.case_id===currentCase?.case_id&&p.status==='awaiting_approval');if(!proposal){setError('No pending synthetic proposal for this case.');return}const result=await api('/api/decisions','POST',{proposal_id:proposal.proposal_id,approver_id:'finance.approver',approved:true,payload_hash:proposal.payload_hash,case_version:proposal.case_version});setMessages(previous=>[...previous,{role:'assistant',text:`Approval result: ${result.status}. Synthetic variance marker ${result.document_number||'not created'}.`}]);setEvents(await api(`/api/architecture/events?case_id=${encodeURIComponent(currentCase.case_id)}`));setProposals(await api('/api/proposals'))}catch(e){setError(e.message)}}
  async function startInvestigation(profile){if(!currentCase?.case_id)return;setError('');setInvestigationBusy(true);if(embedded){bridge.action({type:'investigate',case_id:currentCase.case_id,fault_profile:profile});return}try{const record=await api('/api/investigations','POST',{case_id:currentCase.case_id,fault_profile:profile});setInvestigation(record);setTraceCaseId(record.case_id);setReplayAt(null);setEvents(await api(`/api/architecture/events?case_id=${encodeURIComponent(record.case_id)}`))}catch(e){setError(e.message)}finally{setInvestigationBusy(false)}}
  async function resolveInvestigation(investigationId){setError('');setInvestigationBusy(true);if(embedded){bridge.action({type:'reprocess',investigation_id:investigationId,operator_id:'finance.operator'});return}try{const record=await api(`/api/investigations/${investigationId}/reprocess`,'POST',{operator_id:'finance.operator'});if(record.after?.case_id)await refreshCase(record.after.case_id);setInvestigation(record);const history=await api('/api/history');setBoot(previous=>({...previous,history}));setStoredCases((await api('/api/cases')).slice(0,20));setMessages(previous=>[...previous,{role:'assistant',text:record.reason}])}catch(e){setError(e.message)}finally{setInvestigationBusy(false)}}
  async function inspectInvestigationTrace(caseId){if(embedded){bridge.action({type:'load_case',case_id:caseId});setTab('architecture');return}setTraceCaseId(caseId);setEvents(await api(`/api/architecture/events?case_id=${encodeURIComponent(caseId)}`));setReplayAt(null);setTab('architecture')}
  async function startDecision(questionId,route,probe){setTab('questions');setError('');setDecisionBusy(true);setDecisionRun(null);if(embedded){bridge.action({type:'decision_run',question_id:questionId,route,probe});return}try{const record=await api('/api/architecture/questions/runs','POST',{question_id:questionId,route,probe});setDecisionRun(record)}catch(e){setError(e.message);setDecisionBusy(false)}}
  function openEvidence(section='proof',extra={}){setEvidenceFocus(previous=>({section,...extra,nonce:previous.nonce+1}));setTab('evidence')}
  function navigateFromMenu(target){setShellMenuOpen(false);setChatOpen(false);if(target==='launchpad'){setScreen('launchpad');return}setScreen('app');if(target==='agent'){agentStart.current='ask';setTab('agents');return}setTab(target)}
  function openLaunchpadDecision(id){setQuestionFocus(previous=>({id,nonce:(previous?.nonce||0)+1}));setScreen('app');setTab('questions')}
  async function followAnswer(action){
    setChatOpen(false);setShellMenuOpen(false);
    if(action.target==='architecture')setTab('architecture');
    else if(action.target==='finance')openEvidence('finance');
    else setTab(action.target==='report'?'business':action.target);
    try{
      if(embedded&&action.target==='report'&&action.caseId&&action.caseId!==currentCase?.case_id){setPendingReportCaseId(action.caseId);await refreshCase(action.caseId);return}
      if(action.caseId&&action.caseId!==currentCase?.case_id&&action.target!=='questions')await refreshCase(action.caseId);
      if(action.target==='architecture'&&action.traceId&&!embedded){setTraceCaseId(action.traceId);setEvents(await api(`/api/architecture/events?case_id=${encodeURIComponent(action.traceId)}`));setReplayAt(null)}
      if(action.target==='report')setReportOpen(true);
    }catch(e){setError(e.message)}
  }
  const disclaimer=<footer className="app-footer"><span><strong>Demo and learning purposes only.</strong> Synthetic finance data; no live SAP or cloud system is connected.</span></footer>;
  const withCockpit=node=>(<CockpitProvider value={cockpit}>{node}</CockpitProvider>);
  if(screen==='launchpad')return withCockpit(<div className={`app-shell launchpad-shell ${embedded?'embedded':''}`}>
    <header className="shell-header launchpad-header"><div className="brand"><ShellMenu menuModules={cockpit.modules} open={shellMenuOpen} onToggle={()=>setShellMenuOpen(value=>!value)} onNavigate={navigateFromMenu}/><Logo/><div><span className="brand-overline">SAP FINANCE AGENT COCKPIT / LOCAL DEMO</span><h1>My Home</h1></div></div><div className="header-meta"><ThemeSwitch/><span className="pill simulated">LOCAL SIMULATION</span></div></header>
    <Entry period={period} periods={history?.available_periods} onPeriod={selectPeriod} periodCount={history?.available_periods?.length||12} localBundle={boot?.local_bundle} onOpenApp={()=>{setTab('business');setScreen('app')}} onOpenAgents={()=>{agentStart.current='ask';setTab('agents');setScreen('app')}} onOpenAgentPage={p=>{agentStart.current=p;setTab('agents');setScreen('app')}} onOpenArchitecture={()=>{setTab(lastDecision.current);setScreen('app')}} onOpenTreasury={()=>{setTab('treasury');setScreen('app')}} onAsk={askAgents} onGo={id=>{setTab(id==='live'?'architecture':id);setScreen('app')}}/>
    {disclaimer}
  </div>);
  return withCockpit(<div className={`app-shell ${embedded?'embedded':''} ${showTech?'':'tech-off'}`}>
    <header className="shell-header"><div className="brand"><button type="button" className="shell-home" onClick={()=>navigateFromMenu('launchpad')} aria-label="Back to Finance Launchpad">⌂</button><ShellMenu menuModules={cockpit.modules} open={shellMenuOpen} onToggle={()=>setShellMenuOpen(value=>!value)} onNavigate={navigateFromMenu}/><Logo/><div><span className="brand-overline">HOME / FINANCE / AGENT COCKPIT</span><h1>SAP Finance Agent Cockpit</h1></div></div><div className="header-meta"><ThemeSwitch/><span className="header-separator"/><span className="pill simulated">LOCAL SIMULATION</span><span className="header-separator"/><PeriodSelect period={period} periods={history?.available_periods} onPeriod={selectPeriod} id="global-period"/><span className="header-separator"/><label className="tech-toggle"><input type="checkbox" checked={showTech} onChange={event=>setShowTech(event.target.checked)}/> Technical details</label></div></header>
    <SpaceBar space={space} onSpace={enterSpace} onKeyDown={moveArea}/>
    {space==='apps'&&tab!=='apps'&&<Crumb space="apps" page={pageLabel} onHome={()=>setTab('apps')}/>}
    {space==='arch'&&tab!=='arch'&&tab!=='evidence'&&tab!=='questions'&&<Crumb space="arch" page={pageLabel} onHome={()=>setTab('arch')}/>}
    {(tab==='evidence'||tab==='questions')&&<div className="detail-return-bar"><div><span className="eyebrow">ON-DEMAND DETAIL</span><strong>{tab==='evidence'?'Evidence & correlation':'Architecture questions'}</strong></div><button type="button" onClick={()=>setTab(lastMainTab.current)}>← Back to {({business:'Execution simulator',treasury:'Cash & treasury',ontology:'Ontology',architecture:'Live architecture',approaches:'Complete architecture',agenthost:'Agent hosting',brief:'Decision brief',diagrams:'Architecture diagrams',mcp:'MCP hosting',agents:'Agents'})[lastMainTab.current]}</button></div>}
    {error&&<div className="error-banner" role="alert"><strong>Needs attention</strong><span>{error}</span><button type="button" onClick={()=>setError('')} aria-label="Dismiss error">×</button></div>}
    {ARCH_TABS.includes(tab)&&<PreferenceBanner/>}{ARCH_TABS.includes(tab)&&<div className="surface decision-nav" role="tablist" aria-label="Architecture views">{[['architecture','Live run','Replay a run through the architecture'],['approaches','Complete architecture','Three scenarios end to end'],['mcp','MCP hosting','How the MCP is exposed, hosted and run'],['agenthost','Agent hosting','Where the finance agent runs'],['registry','Registry','Where agents and MCP servers are catalogued'],['selection','Selection & cost','Recommendation, gateways, cost, AWS account'],['brief','Decision brief','What is open, who owns it'],['ontology','Ontology','Concepts and how the agents use them'],['diagrams','Diagrams','Ten generated diagrams, zoom and export']].map(([id,label,hint])=><button type="button" role="tab" key={id} aria-selected={tab===id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}<small>{hint}</small></button>)}</div>}
    {agentFocus&&<div className="agent-ribbon" role="status"><strong>Opened by the {agentFocus.name} agent</strong><span>{agentFocus.role}</span><button type="button" onClick={()=>{setTab('agents');setAgentFocus(null)}}>Back to Agents</button><button type="button" onClick={()=>setAgentFocus(null)} aria-label="Dismiss agent banner">Dismiss</button></div>}
    {treasuryDetail&&<TreasuryDetail data={trData} period={period} periods={history?.available_periods} onPeriod={selectPeriod} role={demoRole} onDecision={decideProposal} onAsk={askAgents} refs={agentCatalog?.domains?.treasury?.references} initial={treasuryDetail} onClose={()=>setTreasuryDetail(null)}/>}
    {reconPeriod&&<ReconciliationReport report={recon} period={reconPeriod} periods={history?.available_periods} onPeriod={openReconReport} onClose={closeReconReport}/>}
    {tab==='apps'?<TilePage testid="apps-page" title="Finance apps" subtitle="Open an agent app. Each app has its own screen, its agents and its workflow; the Agents space shows how they run." sections={[{title:'Agent apps',note:'Synthetic data · simulated agents',tiles:appTiles}]} onOpen={setTab}/>:tab==='arch'?<TilePage testid="arch-page" title="Architecture & operations" subtitle="How the agents run, where they are hosted and how they are governed. S1 and S3 are preferred; S2 is kept for reference." sections={archSections()} onOpen={setTab}/>:activeModule?<><AskBar onAsk={askAgents} busy={agentBusy} period={period} periods={history?.available_periods} domain={activeModule.id} label={`Ask the ${activeModule.short_name} agents`}/>{agentBanner(activeModule.id)}{activeModule.renderer==='treasury'?<TreasuryCockpit period={period} periods={history?.available_periods} data={trData} state={stateOf('treasury')} role={demoRole} onRole={setDemoRole} onOpenDetail={setTreasuryDetail} onDecision={decideProposal} onAsk={askAgents}/>:<>{activeModule.workflow&&viewOf(activeModule.id)?<main className="module-page" aria-label={activeModule.name} data-testid="module-page" data-module={activeModule.id} data-period={viewOf(activeModule.id).period}><section className="surface module-head"><div><span className="eyebrow">{activeModule.name.toUpperCase()}</span><h2>{activeModule.name}</h2><p>{activeModule.blurb}</p></div><ProvenanceStrip provenance={viewOf(activeModule.id).provenance} compact/></section><WorkflowPanel module={activeModule} view={viewOf(activeModule.id)} role={demoRole} onRole={setDemoRole} onAction={moduleAction} error={actionError}/></main>:<GenericModuleView module={activeModule} period={period} view={viewOf(activeModule.id)} state={stateOf(activeModule.id)} onAsk={askAgents}/>}</>}</>:tab==='business'?<><AskBar onAsk={askAgents} busy={agentBusy} period={period} periods={history?.available_periods} domain="reconciliation"/><CloseCockpit period={period} onPeriod={selectPeriod} onOpenReport={openReconReport} onAsk={()=>askAgents(cockpit.ask('reconciliation',period))} banner={agentBanner('reconciliation')} conditions={conditions} onCondition={applyCondition} history={history} cases={storedCases} currentCase={currentCase} proposal={activeProposal} role={demoRole} onRole={setDemoRole} approve={approve} onOpenEvidence={()=>openEvidence('finance')} summary={l1Report} periodPanel={<Report result={currentCase?.result} period={period} summary={l1Report} summaryState={l1State} onAskPeriod={()=>askAgents(cockpit.ask('reconciliation',period))} onOpenDetail={()=>openReconReport(period)} onOpenEvidence={()=>openEvidence('finance')} onRunCurrent={()=>askAgents(cockpit.ask('reconciliation',period))}/>} extrasRight={investigation?<EvidenceShortcut investigation={investigation} onOpen={()=>openEvidence('proof')}/>:null} extrasLeft={<>{currentCase?.result?.variance?.amount!==null&&currentCase?.result?.variance?.amount!==undefined&&Number(currentCase.result.variance.amount)!==0&&investigation?.case_id!==currentCase.case_id&&<section className="surface action-strip"><div><span className="eyebrow">CONTROLLED WRITE BRANCH</span><strong>Signed variance marker requires separate approval</strong><p>A comparable nonzero variance may create a local marker proposal.</p></div><button type="button" onClick={()=>askAgents('Propose an adjustment')}>Ask the agents to propose a variance marker</button></section>}</>}/></>:tab==='agents'?<AgentWorkbench startPage={agentStart.current} catalog={agentCatalog} plan={agentPlan} busy={agentBusy} onAsk={askAgents} onOpenLayer={goAgent} onOpenConcept={openConcept} onOpenOutput={openOutput} ontology={ontology} period={period} periods={history?.available_periods} workflowViews={Object.fromEntries(workflowIds.map(id=>[id,viewOf(id)]))} role={demoRole} onRole={setDemoRole} onModuleAction={moduleAction} actionError={actionError}/>:tab==='architecture'?<main className="architecture-layout"><section className="surface command-bar"><div><span className="eyebrow">EXTERNAL AGENT → SAP FINANCE</span><h2>Follow an external agent into SAP</h2><p>This simulator replays one synthetic reconciliation through the selected scenario: S1 calls Apigee, S2 calls AgentCore Gateway, S3 passes AgentCore Gateway and then Apigee. The full topology is in the Diagrams tab (D2 to D4).</p><button type="button" className="text-link architecture-question-link" onClick={()=>setTab('questions')}>Review open architecture questions →</button></div><div className="command-controls"><label>Business intent<input value={runIntent} onChange={e=>setRunIntent(e.target.value)} aria-label="Business intent"/></label><label>Period<select value={period} onChange={e=>selectPeriod(e.target.value)}>{(history?.available_periods||['2026-11']).map(p=><option value={p} key={p}>{monthLabel(p)}</option>)}</select></label><label>Route<select value={scenario} onChange={e=>setScenario(e.target.value)} disabled={running}><option value="S1">S1 · SAP-hosted hybrid · preferred (SAP-centric)</option><option value="S2">S2 · AWS AgentCore-native · not preferred</option><option value="S3">S3 · AgentCore + Apigee hybrid · preferred (SAP and non-SAP)</option></select></label><label>Pace<select value={pace} onChange={e=>setPace(Number(e.target.value))}><option value={30}>Fast</option><option value={60}>Normal</option><option value={120}>Slow</option></select></label><button type="button" className="primary" onClick={startRun} disabled={running}>{running?'Running…':'Run architecture'}</button></div></section><section className="surface route-panel"><div className="section-heading"><div><span className="eyebrow">COMPONENT COMMUNICATION</span><h2>{running?'Processing live':currentCase?.status==='complete'?'Case complete':'Architecture ready'}</h2></div><div className="route-actions"><span className="pill quiet tech">{traceCaseId||'No trace selected'}</span><button type="button" onClick={()=>{setReplayAt(-1);setSelectedEvent(null);setPlaying(true)}} disabled={!events.length}>Replay</button><button type="button" onClick={()=>setPlaying(false)} disabled={!playing}>Pause</button><button type="button" onClick={()=>{setPlaying(false);setReplayAt(null);setSelectedEvent(null)}} disabled={replayAt===null}>Live</button></div></div><ArchitectureRoute registry={architecture} events={visibleEvents} scenario={scenario} selectedZone={selectedZone} onZone={zone=>{setSelectedZone(zone);setSelectedComponent(null)}} viewportRef={routeRef} liveRunning={running} reportReady={Boolean(currentCase?.result?.variance)} onOpenReport={()=>setReportOpen(true)}/><div className="flow-caption"><span className={`status-dot ${running?'pulsing':''}`}/> <strong>{currentEvent?`${currentEvent.status==='denied'?'Control denied':'Handoff recorded'} · ${ZONE_SHORT[activeZone||selectedZone]||activeZone||selectedZone}`:'Awaiting a business question'}</strong><span>{ZONE_SHORT[activeZone]||'Select a route zone'}</span><span className="tech">{events.length} stored events</span></div></section><AgentJourney events={visibleEvents} running={running} selectedZone={ZONE_SHORT[selectedZone]||selectedZone} onOpenEvidence={()=>openEvidence("components")}/><section className="surface case-strip"><div><span className="eyebrow">STORED CASES</span><h2>Replay an earlier run</h2></div><div className="case-buttons">{storedCases.slice(0,8).map(item=><button type="button" key={item.case_id} onClick={()=>refreshCase(item.case_id)}>{monthLabel(item.scope?.period)} · {item.scenario} · {item.status}</button>)}{!storedCases.length&&<span className="micro">No completed case yet.</span>}</div></section></main>:tab==='questions'?<ArchitectureQuestions questions={boot?.decision_questions||[]} routePlaybooks={boot?.route_playbooks||{}} focus={questionFocus} run={decisionRun} onRun={startDecision} busy={decisionBusy} onOpenEvidence={stepSeq=>openEvidence('questions',{stepSeq})}/>:tab==='ontology'?<OntologyView ontology={ontology} references={ontologyRefs} focus={ontologyFocus} onOpenTab={id=>setTab(id)}/>:tab==='brief'?<DecisionBrief onComplete={()=>setTab('approaches')} onMcp={()=>setTab('mcp')} onAgentHosting={()=>setTab('agenthost')}/>:tab==='selection'?<SelectionView onMcp={()=>setTab('mcp')} onRegistry={()=>setTab('registry')}/>:tab==='registry'?<RegistryView onMcp={()=>setTab('mcp')} onAgentHosting={()=>setTab('agenthost')} onDiagrams={view=>{setDiagramView(view);setTab('diagrams')}}/>:tab==='agenthost'?<HostingPriority onMcp={()=>setTab('mcp')} onComplete={()=>setTab('approaches')} onRegistry={()=>setTab('registry')}/>:tab==='mcp'?<McpGovernance view={mcpView} onView={setMcpView} onApproaches={()=>setTab('approaches')} onAgentHosting={()=>setTab('agenthost')} onRegistry={()=>setTab('registry')} onDetailed={view=>{setDiagramView(({S1:'D2',S2:'D3',S3:'D4'})[view]||view);setTab('diagrams')}}/>:tab==='diagrams'?<DetailedDiagrams view={diagramView} onView={setDiagramView} onBack={()=>setTab('approaches')}/>:tab==='approaches'?<McpApproaches playbooks={boot?.route_playbooks||{}} onQuestion={()=>setTab('questions')} onDetailedDiagram={view=>{setDiagramView(({S1:'D2',S2:'D3',S3:'D4'})[view]||view);setTab('diagrams')}} onGovernance={view=>{setMcpView(view);setTab('mcp')}} onAgentHosting={()=>setTab('agenthost')}/>:<EvidenceCorrelation investigation={investigation} currentCase={currentCase} history={history} busy={investigationBusy} onStart={startInvestigation} onResolve={resolveInvestigation} onTrace={inspectInvestigationTrace} historyDetail={historyDetail} events={investigation?.case_id===currentCase?.case_id&&investigationEvents.length?investigationEvents:events} caseEvents={events} decisionRun={decisionRun} decisionQuestions={boot?.decision_questions||[]} focus={evidenceFocus} componentDetails={<ComponentDetails registry={architecture} zone={selectedZone} events={visibleEvents} selectedComponent={selectedComponent} onComponent={setSelectedComponent} scenario={scenario}/>} reviewPanel={<section className="surface architect-review"><div className="section-heading"><div><span className="eyebrow">CROSS-DISCIPLINE REVIEW</span><h2>Architect questions to test</h2></div></div><div className="review-list">{REVIEWERS.map(([role,focus])=><div key={role}><strong>{role}</strong><span>{focus}</span></div>)}</div><p className="micro">Vendor-named stages are simulations. G1–G7 remain open pending tenant evidence.</p></section>} />}
    {disclaimer}
    {reportOpen&&<BusinessReportDialog caseRecord={currentCase} onClose={()=>setReportOpen(false)} onOpenEvidence={()=>openEvidence("finance")}/>}
  </div>);
}
