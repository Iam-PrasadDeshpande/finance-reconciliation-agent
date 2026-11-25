import React,{useState} from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import ScenarioDecisions from './ScenarioDecisions';
import {SCENARIOS,IDS,BANNER} from './mcpScenarios';
import './arch-split.css';

// Agent hosting: where the agent runs and executes, and what travels with it. Generated from the canonical model.
// Registration is a separate decision and lives on the Registry page.
const OPTIONS=[
  {id:'cf',name:'SAP BTP Cloud Foundry',scenarios:['S1','S3'],diagrams:{S1:'D2',S3:'D4'},priority:'S1 and S3 · SAP owns execution',
    why:['The agent, its MCP client and any custom MCP code run in the SAP BTP landscape, next to Integration Suite and the SAP backend.','The agent calls Apigee directly: one gateway hop and one identity mapping to prove.','Registration is independent: S1 uses an interim GitLab catalog, S3 registers metadata in AWS Agent Registry without moving anything to AWS.'],
    prove:['Cloud Foundry space, entitlement and quota (the SAP documentation page could not be read, so this is NOT_VERIFIED)','Workload identity for the agent and its token to Apigee','Outbound path from Cloud Foundry to Apigee and to Portkey']},
  {id:'agentcore',name:'AWS AgentCore Runtime',scenarios:['S2'],diagrams:{S2:'D3'},priority:'S2 · AWS owns execution',
    why:['The agent and any custom MCP code run on AgentCore Runtime; AgentCore Gateway is the enterprise entry for tool calls and Apigee stays the SAP-facing gateway behind it.','AgentCore Runtime, Gateway and Agent Registry are three separate capabilities, each with its own configuration and owner.','A custom MCP on AgentCore Runtime that Apigee proxies is a cross-cloud path and is conditional.'],
    prove:['AgentCore availability and region in the tenant','Gateway to Apigee protocol, token exchange and target type','Duplicated policy at two gateways and who owns it']},
];
const FIELDS=[['Agent hosting and execution','agent_runtime'],['Operated by','agent_hosting_owner'],['Execution endpoint','agent_execution_endpoint'],['UI hosting','ui_hosting'],['MCP client','mcp_client'],['Custom MCP code (if required)','custom_mcp_runtime'],['LLM path','llm_boundary'],['Identity','identity_boundary'],['Persistence','persistence'],['Monitoring and audit','monitoring_audit']];

export default function HostingPriority({onMcp,onComplete,onRegistry}){
  const [selected,setSelected]=useState('cf'),[diagram,setDiagram]=useState(null),[scenario,setScenario]=useState('S3');
  const item=OPTIONS.find(option=>option.id===selected);
  const active=item.scenarios.includes(scenario)?scenario:item.scenarios[0];
  const sc=SCENARIOS[active];
  return <main className="mcp-comparison mcp-bird arch-page hosting-page" aria-label="Agent hosting">
    <header className="surface mcp-bird-header"><div><h2>Agent hosting</h2><span className="eyebrow">WHERE THE FINANCE AGENT RUNS AND EXECUTES · REGISTRATION IS A SEPARATE DECISION</span></div><span className="pill warn">{BANNER.split(' · ')[0]}</span></header>
    <nav className="surface mcp-route-tabs mcp-bird-tabs" role="tablist" aria-label="Agent hosting options">
      {OPTIONS.map(option=><button type="button" role="tab" key={option.id} aria-selected={selected===option.id} className={selected===option.id?'active':''} onClick={()=>{setSelected(option.id);setScenario(option.scenarios[option.scenarios.length-1])}}><strong>{option.name}</strong><span>{option.priority}</span></button>)}
    </nav>
    <ScenarioDecisions focus={item.scenarios} title="Hosting next to the other decisions" rows={[['Agent hosting and execution','agent_runtime','Where it runs'],['Agent registration and discovery','agent_registry','Not decided by hosting'],['MCP implementation hosting','custom_mcp_runtime','Where custom code runs'],['LLM gateway','llm_gateway','Same everywhere']]}/>
    <section className="surface mcp-bird-panel arch-panel" role="tabpanel" aria-label={`${item.name} overview`}>
      <div className="mcp-bird-panel-title"><div><span className="eyebrow">{item.priority}</span><h3>{item.name}</h3></div><div className="mcp-bird-title-actions">{item.scenarios.map(id=><button key={id} type="button" className="diagram-action" onClick={()=>setDiagram(item.diagrams[id])}>{id} diagram ↗</button>)}</div></div>
      <div className="mcp-bird-path arch-path" aria-label="Where the agent sits"><b>SAP Fiori / existing UI</b><span aria-hidden="true">→</span><b>Agent · {item.name}</b><span aria-hidden="true">→</span><b>Portkey → approved LLM</b><span aria-hidden="true">→</span><b>{active==='S2'?'AgentCore Gateway → Apigee':'Apigee MCP/API'}</b></div>
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
