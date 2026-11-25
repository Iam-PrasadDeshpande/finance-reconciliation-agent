import React,{useMemo,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import ScenarioDecisions from './ScenarioDecisions';
import {SCENARIOS,IDS,MATRIX,BANNER,diagramSvg,diagramSpec} from './mcpScenarios';
import './detailed-diagrams.css';
import './mcp-governance.css';
import './arch-split.css';

// Agent and MCP registration: a control-plane concern, shown separately from hosting and execution.
const ROWS=[['Agent registry','agent_registry'],['MCP registry','mcp_registry'],['Publisher and approval owner','registry_publisher_approver'],['Synchronization','registry_sync'],['Agent discovery','agent_discovery'],['MCP tool discovery','mcp_tool_discovery'],['Identity of the registry caller','identity_boundary'],['Audit of publication','monitoring_audit']];
const NOTES={
  S1:['The agent runs on SAP BTP Cloud Foundry and the MCP endpoint is Apigee; only their metadata lives in AWS Agent Registry.','Records are published from the GitLab pipeline by the integration team, with the respective technical approvals; the registry curator approves.','Publishing a record is not proof of reachability, authorization or execution.'],
  S2:['AWS Agent Registry is a separate service from AgentCore Runtime and AgentCore Gateway. It catalogues what they host but is not on the call path.','Agent and MCP descriptors are published from GitLab, approved by a curator, then discoverable. Use the agent-registry namespace.','Gateway tool discovery (tools/list) is separate from registry discovery of the MCP server record. A skill record never grants tool permissions.'],
  S3:['The agent runs on AgentCore Runtime and the SAP-facing MCP endpoint is Apigee; the agent record and the Apigee endpoint metadata are published to AWS Agent Registry on a separate control-plane path.','Gateway target configuration is a separate runtime responsibility: the registry is never a hop between the gateways.','A central registry owned by AI Foundry is proposed; cross-account sharing (AWS Organizations, AWS Resource Access Manager) is not yet confirmed.'],
};
const SHOW=['D5','D8'];
const isOpen=text=>/TBD|not defined|pending/i.test(text);

export default function RegistryView({onMcp,onAgentHosting,onDiagrams}){
  const [section,setSection]=useState('S3'),[diagramKey,setDiagramKey]=useState('D5'),[view,setView]=useState(null),[expanded,setExpanded]=useState(false);
  const compare=section==='compare';
  const id=compare?null:section;
  const diagram=useMemo(()=>{const spec=diagramSpec(diagramKey);return {id:diagramKey,title:spec.title,svg:diagramSvg(diagramKey),file:`architecture-${diagramKey.toLowerCase()}`,png:true}},[diagramKey]);
  const rows=MATRIX.filter(row=>['Agent registry','MCP registry','Enterprise governance alignment'].includes(row[0]));
  return <main className="detailed-diagrams mcp-governance arch-page registry-page" aria-label="Registry">
    <header className="surface dd-header">
      <div className="dd-title"><span className="eyebrow">AGENT AND MCP REGISTRATION · CONTROL PLANE, NEVER AN EXECUTION HOP</span><h2>{compare?'Registry compared':SCENARIOS[id].name}</h2></div>
      <nav className="dd-selector" role="tablist" aria-label="Registry scenario selection">{[...IDS,'compare'].map(key=><button type="button" role="tab" key={key} aria-selected={section===key} className={section===key?'active':''} onClick={()=>setSection(key)}>{key==='compare'?'Compare all':SCENARIOS[key].name}</button>)}</nav>
      <div className="dd-header-actions"><span className="pill warn">{BANNER.split(' · ').slice(0,2).join(' · ')}</span></div>
    </header>
    <ScenarioDecisions focus={compare?IDS:[id]} title="Registration next to hosting" rows={[['Agent hosting and execution','agent_runtime','Where it runs'],['Agent registration and discovery','agent_registry','Where it is catalogued'],['MCP implementation hosting','custom_mcp_runtime','Where custom code runs'],['MCP registration and discovery','mcp_registry','Where it is catalogued']]}/>
    {compare?<section className="surface mg-section" data-testid="registry-compare"><h3>Registry comparison</h3><div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Item</th>{IDS.map(key=><th scope="col" key={key}>{SCENARIOS[key].name}</th>)}</tr></thead><tbody>
      {ROWS.slice(0,6).map(([label,field])=><tr key={field}><th scope="row">{label}</th>{IDS.map(key=><td key={key} className={isOpen(SCENARIOS[key][field])?'mg-open':''}>{SCENARIOS[key][field]}</td>)}</tr>)}
      {rows.map(([label,...cells])=><tr key={label}><th scope="row">{label}</th>{cells.map((text,i)=><td key={IDS[i]} className={isOpen(text)?'mg-open':''}>{text}</td>)}</tr>)}</tbody></table></div></section>
    :<div className="mg-cards registry-cards">
      <section className="surface mg-section" data-testid="registry-facts"><h3>How registration works in {id}</h3><table className="mg-table"><tbody>{ROWS.map(([label,field])=><tr key={field}><th scope="row">{label}</th><td className={isOpen(SCENARIOS[id][field])?'mg-open':''}>{SCENARIOS[id][field]}</td></tr>)}</tbody></table></section>
      <section className="surface mg-section" data-testid="registry-notes"><h3>What to know</h3><ul>{NOTES[id].map(x=><li key={x}>{x}</li>)}</ul>
        <h3>Not yet verified</h3><ul>{SCENARIOS[id].unverified.map(x=><li key={x}>{x}</li>)}</ul>
        </section>
    </div>}
    <section className="surface mg-section" aria-label="Registry diagrams">
      <div className="dd-compare-bar"><strong>Diagram</strong>{SHOW.map(key=><button type="button" key={key} className={diagramKey===key?'active':''} aria-pressed={diagramKey===key} onClick={()=>{setDiagramKey(key);setView(null)}}>{key==='D5'?'D5 · Hosting versus registration':'D8 · Registry lifecycle'}</button>)}</div>
      <div className="mg-viewers"><div className="mg-viewer"><PanZoom diagram={diagram} uid={`reg-${diagramKey}`} view={view} onView={setView} onFit={setView} expanded={expanded} onExpand={setExpanded}/></div></div>
      <p className="micro">Publication is not proof of reachability, runtime authorization or SAP execution. Revoked or stale records must disappear from discovery.</p>
    </section>
    <nav className="mg-anchors" aria-label="Related views"><button type="button" onClick={onMcp}>MCP hosting →</button><button type="button" onClick={onAgentHosting}>Agent hosting →</button><button type="button" onClick={()=>onDiagrams&&onDiagrams('D8')}>All diagrams →</button></nav>
  </main>;
}
