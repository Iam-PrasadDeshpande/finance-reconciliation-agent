import React,{useState} from 'react';
import './mcp-approaches.css';
import './mcp-bird.css';
import './arch-split.css';
import ArchitectureDiagram from './ArchitectureDiagram';
import {SCENARIOS,IDS,MATRIX,BANNER} from './mcpScenarios';

// Complete architecture: one overview per scenario and a side-by-side comparison, all generated from the canonical model.
const DIAGRAM={S1:'D2',S2:'D3',S3:'D4'};
const FACTS=[['Agent hosting and execution','agent_runtime'],['Runtime gateway','mcp_gateway'],['Apigee','apigee_role'],['Custom MCP runtime (if required)','custom_mcp_runtime'],['AWS account','aws_account'],['Agent and MCP registry','agent_registry'],['LLM gateway','llm_gateway'],['Artifacts and CI/CD','artifact_repository'],['SAP integration','integration_suite'],['Business authorization','backend_authorization'],['Persistence','persistence']];

export default function McpApproaches({playbooks={},onQuestion,onDetailedDiagram,onGovernance,onAgentHosting}){
  const [section,setSection]=useState('S3');
  const [diagram,setDiagram]=useState(null);
  const route=section==='compare'?null:section;
  const sc=route?SCENARIOS[route]:null;
  const plan=route?playbooks[route]:null;
  return <main className="mcp-comparison mcp-bird arch-page hosting-page" aria-label="Complete architecture">
    <header className="surface mcp-bird-header"><div><h2>Complete architecture</h2><span className="eyebrow">AGENT → MCP → SAP, END TO END · THREE SCENARIOS UNDER EVALUATION</span></div><span className="pill warn">{BANNER.split(' · ')[0]}</span></header>
    <nav className="surface mcp-route-tabs mcp-bird-tabs" role="tablist" aria-label="Architecture approach details">
      {[...IDS,'compare'].map(id=><button type="button" role="tab" key={id} aria-selected={section===id} className={section===id?'active':''} onClick={()=>setSection(id)}><strong>{id==='compare'?'Compare all':id}</strong><span>{id==='compare'?'Three scenarios side by side':SCENARIOS[id].short}</span></button>)}
    </nav>
    {route?<section className="surface mcp-bird-panel arch-panel" role="tabpanel" aria-label={`${route} architecture overview`}>
      <div className="mcp-bird-panel-title"><div><span className="eyebrow">{route} · {sc.status.toUpperCase()}</span><h3>{sc.name}</h3></div><div className="mcp-bird-title-actions"><button type="button" className="diagram-action" onClick={()=>setDiagram(DIAGRAM[route])}>Architecture diagram ↗</button></div></div>
      <div className="mcp-bird-path arch-path" aria-label="Selected request path">{sc.chain.split(' → ').map((node,index)=><React.Fragment key={node+index}>{index>0&&<span aria-hidden="true">→</span>}<b>{node}</b></React.Fragment>)}</div>
      <p>{sc.objective}</p>
      <div className="arch-grid">
        <section aria-label="Route facts"><h4>Who owns what</h4><div className="arch-cards">{FACTS.map(([label,field])=><div key={field} className={/pending|TBD/i.test(sc[field])?'warn':''}><span>{label}</span><b>{sc[field]}</b></div>)}</div></section>
        <section aria-label="Open dependencies"><h4>Advantages</h4><ul>{sc.advantages.map(x=><li key={x}>{x}</li>)}</ul><h4>Considerations</h4><ul>{sc.considerations.map(x=><li key={x}>{x}</li>)}</ul><h4>Not yet verified</h4><ul>{sc.unverified.map(x=><li key={x}>{x}</li>)}</ul><h4>Enterprise-policy dependencies</h4><ul>{sc.policy_dependencies.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section aria-label="Assumptions" className="arch-judgment"><h4>Assumptions</h4><ul>{sc.assumptions.map(x=><li key={x}>{x}</li>)}</ul><p className="good"><strong>Classification</strong>{sc.classification}</p>{plan?.decisions?.length>0&&<><h4>Open decisions</h4><ul>{plan.decisions.map(x=><li key={x}>{x}</li>)}</ul></>}</section>
      </div>
      <div className="arch-links"><span>Related, separate views:</span>{onGovernance&&<button type="button" className="text-link" onClick={()=>onGovernance(route)}>MCP hosting →</button>}{onAgentHosting&&<button type="button" className="text-link" onClick={onAgentHosting}>Agent hosting →</button>}{onDetailedDiagram&&<button type="button" className="text-link" onClick={()=>onDetailedDiagram(route)}>All diagrams →</button>}{onQuestion&&<button type="button" className="text-link" onClick={onQuestion}>Architecture questions →</button>}</div>
    </section>:<section className="surface mcp-bird-panel mcp-bird-compare arch-panel" role="tabpanel" aria-label="Route comparison overview">
      <div className="mcp-bird-panel-title"><div><span className="eyebrow">COMPLETE ARCHITECTURE · SIDE BY SIDE</span><h3>Three scenarios, one decision view</h3></div></div>
      <div className="mg-scroll"><table className="mg-table" data-testid="arch-compare"><thead><tr><th scope="col">Dimension</th>{IDS.map(id=><th scope="col" key={id}>{SCENARIOS[id].name}</th>)}</tr></thead><tbody>{MATRIX.map(([dimension,...cells])=><tr key={dimension}><th scope="row">{dimension}</th>{cells.map((text,i)=><td key={IDS[i]}>{text}</td>)}</tr>)}</tbody></table></div>
    </section>}
    {diagram&&<ArchitectureDiagram diagramKey={diagram} onClose={()=>setDiagram(null)} onDetails={()=>{const id=Object.keys(DIAGRAM).find(k=>DIAGRAM[k]===diagram);setDiagram(null);if(id&&onDetailedDiagram)onDetailedDiagram(id)}}/>}
  </main>;
}
