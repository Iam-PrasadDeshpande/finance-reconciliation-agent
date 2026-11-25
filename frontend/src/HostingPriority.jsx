import React,{useState} from 'react';
import ArchitectureDiagram from './ArchitectureDiagram';
import {SCENARIOS,BANNER} from './mcpScenarios';
import './arch-split.css';

// Agent hosting: where the agent runs and executes. Generated from the canonical model; registration is a separate decision (see MCP hosting).
const OPTIONS=[
  {id:'cf',name:'SAP BTP Cloud Foundry',scenarios:['S1','S3'],diagrams:{S1:'D2',S3:'D4'},priority:'S1 and S3 · SAP owns execution'},
  {id:'agentcore',name:'AWS AgentCore Runtime',scenarios:['S2'],diagrams:{S2:'D3'},priority:'S2 · AWS owns execution'},
];
export default function HostingPriority({onMcp,onComplete}){
  const [selected,setSelected]=useState('cf'),[diagram,setDiagram]=useState(null);
  const item=OPTIONS.find(option=>option.id===selected);
  const first=SCENARIOS[item.scenarios[0]];
  return <main className="mcp-comparison mcp-bird arch-page hosting-page" aria-label="Agent hosting">
    <header className="surface mcp-bird-header"><div><h2>Agent hosting</h2><span className="eyebrow">WHERE THE FINANCE AGENT RUNS AND EXECUTES</span></div><span className="pill warn">{BANNER.split(' · ')[0]}</span></header>
    <nav className="surface mcp-route-tabs mcp-bird-tabs" role="tablist" aria-label="Agent hosting options">
      {OPTIONS.map(option=><button type="button" role="tab" key={option.id} aria-selected={selected===option.id} className={selected===option.id?'active':''} onClick={()=>setSelected(option.id)}><strong>{option.name}</strong><span>{option.priority}</span></button>)}
    </nav>
    <section className="surface mcp-bird-panel arch-panel" role="tabpanel" aria-label={`${item.name} overview`}>
      <div className="mcp-bird-panel-title"><div><span className="eyebrow">{item.priority}</span><h3>{item.name}</h3></div><div className="mcp-bird-title-actions">{item.scenarios.map(id=><button key={id} type="button" className="diagram-action" onClick={()=>setDiagram(item.diagrams[id])}>{id} diagram ↗</button>)}</div></div>
      <div className="mcp-bird-path arch-path" aria-label="Where the agent sits"><b>SAP Fiori / existing UI</b><span aria-hidden="true">→</span><b>Agent · {item.name}</b><span aria-hidden="true">→</span><b>Portkey → approved LLM</b><span aria-hidden="true">→</span><b>MCP gateway (Apigee)</b></div>
      <div className="arch-grid two">
        <section aria-label="Platform facts"><h4>What runs where</h4><div className="arch-cards"><div><span>Agent hosting and execution</span><b>{first.agent_runtime}</b></div><div><span>Operated by</span><b>{first.agent_hosting_owner}</b></div><div><span>Custom MCP code, only if required</span><b>{first.custom_mcp_runtime}</b></div><div><span>LLM</span><b>Portkey → approved LLM provider</b></div></div></section>
        <section aria-label="Scenarios that use it"><h4>Used by</h4>{item.scenarios.map(id=><p key={id}><strong>{SCENARIOS[id].name}.</strong> {SCENARIOS[id].objective}</p>)}<h4>Not decided here</h4><p>Registration and discovery are separate: using AWS Agent Registry (S3) does not move the agent to AWS. See MCP hosting.</p></section>
      </div>
      <div className="arch-links"><span>Also:</span>{onMcp&&<button type="button" className="text-link" onClick={onMcp}>MCP hosting and registration →</button>}{onComplete&&<button type="button" className="text-link" onClick={onComplete}>Complete architecture →</button>}</div>
    </section>
    {diagram&&<ArchitectureDiagram diagramKey={diagram} onClose={()=>setDiagram(null)}/>}
  </main>;
}
