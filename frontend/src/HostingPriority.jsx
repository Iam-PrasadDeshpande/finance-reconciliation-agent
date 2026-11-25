import React,{useState} from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import ScenarioDecisions from './ScenarioDecisions';
import {SCENARIOS,IDS,BANNER} from './mcpScenarios';
import './arch-split.css';

// Agent hosting: where the agent runs and executes, and what travels with it. Generated from the canonical model.
// Registration is a separate decision and lives on the Registry page.
const OPTIONS=[
  {id:'cf',name:'SAP BTP Cloud Foundry',scenarios:['S1'],diagrams:{S1:'D2'},priority:'S1 · SAP owns execution',
    why:['The agent, its MCP client and any custom MCP code run in the SAP BTP landscape, next to Integration Suite and the SAP backend.','The agent calls Apigee directly: one gateway hop and one identity mapping to prove.','AWS Agent Registry only registers it: choosing the registry does not move the agent to AWS.','The case for this host is SAP coupling or verified platform economics, not preference.'],
    prove:['Actual Cloud Foundry consumption and contractual charges for frequent agent workloads','Scaling and capacity, and supportability of custom orchestration','Workload identity for the agent and its token to Apigee','Enterprise approval of direct Apigee invocation']},
  {id:'agentcore',name:'AWS AgentCore Runtime',scenarios:['S2','S3'],diagrams:{S2:'D3',S3:'D4'},priority:'S2 and S3 · AWS owns execution',
    why:['AgentCore Runtime hosts the agent and eligible custom MCP servers; AgentCore Gateway mediates the tools; AWS Agent Registry registers them. These are three separate capabilities.','S3 keeps Apigee as the SAP-facing MCP/API gateway behind AgentCore Gateway; S2 omits it unless SAP Integration requires it.','GitLab deploys the runtime image, gateway targets and registry records from one central platform.','A dedicated SAP-agent AWS account is proposed, not provisioned.'],
    prove:['Dedicated account approval, AgentCore entitlements, quotas and region','AgentCore Gateway to Apigee protocol, token exchange and reachability (S3)','Whether Apigee is mandatory for the SAP route (S2 versus S3)','Non-duplicative gateway responsibilities and one correlation id']},
];
const FIELDS=[['Agent hosting and execution','agent_runtime'],['Operated by','agent_hosting_owner'],['Execution endpoint','agent_execution_endpoint'],['UI hosting','ui_hosting'],['MCP client','mcp_client'],['Custom MCP code (if required)','custom_mcp_runtime'],['LLM path','llm_boundary'],['Identity','identity_boundary'],['Persistence','persistence'],['Monitoring and audit','monitoring_audit']];

export default function HostingPriority({onMcp,onComplete,onRegistry}){
  const [selected,setSelected]=useState('agentcore'),[diagram,setDiagram]=useState(null),[scenario,setScenario]=useState('S3');
  const item=OPTIONS.find(option=>option.id===selected);
  const active=item.scenarios.includes(scenario)?scenario:item.scenarios[0];
  const sc=SCENARIOS[active];
  return <main className="mcp-comparison mcp-bird arch-page hosting-page" aria-label="Agent hosting">
    <header className="surface mcp-bird-header"><div><h2>Agent hosting</h2><span className="eyebrow">WHERE THE FINANCE AGENT RUNS AND EXECUTES · REGISTRATION AND GATEWAYS ARE SEPARATE</span></div><span className="pill warn">{BANNER.split(' · ')[0]}</span></header>
    <nav className="surface mcp-route-tabs mcp-bird-tabs" role="tablist" aria-label="Agent hosting options">
      {OPTIONS.map(option=><button type="button" role="tab" key={option.id} aria-selected={selected===option.id} className={selected===option.id?'active':''} onClick={()=>{setSelected(option.id);setScenario(option.scenarios[option.scenarios.length-1])}}><strong>{option.name}</strong><span>{option.priority}</span></button>)}
    </nav>
    <ScenarioDecisions focus={item.scenarios} title="Hosting next to the other decisions" rows={[['Agent hosting and execution','agent_runtime','Where it runs'],['Agent registration and discovery','agent_registry','Not decided by hosting'],['MCP implementation hosting','custom_mcp_runtime','Where custom code runs'],['LLM gateway','llm_gateway','Same everywhere']]}/>
    <section className="surface mcp-bird-panel arch-panel" role="tabpanel" aria-label={`${item.name} overview`}>
      <div className="mcp-bird-panel-title"><div><span className="eyebrow">{item.priority}</span><h3>{item.name}</h3></div><div className="mcp-bird-title-actions">{item.scenarios.map(id=><button key={id} type="button" className="diagram-action" onClick={()=>setDiagram(item.diagrams[id])}>{id} diagram ↗</button>)}</div></div>
      <div className="mcp-bird-path arch-path" aria-label="Where the agent sits"><b>SAP Fiori / existing UI</b><span aria-hidden="true">→</span><b>Agent · {item.name}</b><span aria-hidden="true">→</span><b>Portkey → approved LLM</b><span aria-hidden="true">→</span><b>{active==='S3'?'AgentCore Gateway → Apigee':active==='S2'?'AgentCore Gateway':'Apigee MCP/API'}</b></div>
      <div className="arch-grid">
        <section aria-label="Scenario details"><h4>Scenario</h4>{item.scenarios.length>1&&<div className="dd-selector" role="tablist" aria-label="Scenario using this host">{item.scenarios.map(id=><button type="button" role="tab" key={id} aria-selected={active===id} className={active===id?'active':''} onClick={()=>setScenario(id)}>{id}</button>)}</div>}<p><strong>{sc.name}.</strong> {sc.objective}</p><h4>Why this host</h4><ul>{item.why.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section aria-label="What runs where"><h4>What runs where in {active}</h4><div className="arch-cards one">{FIELDS.map(([label,field])=><div key={field}><span>{label}</span><b>{sc[field]}</b></div>)}</div></section>
        <section aria-label="To prove" className="arch-judgment"><h4>Still to prove</h4><ul>{item.prove.map(x=><li key={x}>{x}</li>)}</ul><h4>Not verified</h4><ul>{sc.unverified.map(x=><li key={x}>{x}</li>)}</ul></section>
      </div>
      <div className="arch-links"><span>Also:</span>{onRegistry&&<button type="button" className="text-link" onClick={onRegistry}>Registry →</button>}{onMcp&&<button type="button" className="text-link" onClick={onMcp}>MCP hosting →</button>}{onComplete&&<button type="button" className="text-link" onClick={onComplete}>Complete architecture →</button>}</div>
    </section>
    {diagram&&<ArchitectureDiagram diagramKey={diagram} onClose={()=>setDiagram(null)}/>}
  </main>;
}
