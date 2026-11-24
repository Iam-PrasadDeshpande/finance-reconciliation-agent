import React,{useCallback,useMemo,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import {SCENARIOS,IDS,GLOSSARY,MATRIX,CONN_COLS,CONNECTIONS,DOMAINS,HOSTING,DIMENSIONS,RECOMMENDATION,EVIDENCE,EVIDENCE_NOTE,ACCESSED,topologySvg,LEGEND,TBD} from './mcpScenarios';
import './detailed-diagrams.css';
import './mcp-governance.css';

const REGISTRY_ROWS=['MCP registry and discovery','Enterprise registry / approval authority','Source-code repository','MCP specifications and versioned artifacts','Container / package artifact storage','Gateway-target configuration','Deployment ownership'];
const SECTIONS=[['mg-responsibility','Responsibility matrix'],['mg-connections','Endpoint connectivity'],['mg-registry','Registry and artifacts'],['mg-domain','Finance domain design'],['mg-hosting','Agent hosting'],['mg-decision','Decision matrix'],['mg-recommendation','Recommendation'],['mg-evidence','Evidence']];

function diagramFor(id){return {id,title:SCENARIOS[id].label,svg:topologySvg(id),file:`mcp-topology-${id.toLowerCase()}`,png:true}}
const isOpen=text=>/TBD|TO VALIDATE|unproven|NOT_VERIFIED|REQUIRES VALIDATION|needs proof|must be proven|unmeasured/i.test(text);
const Cell=({text})=><td className={isOpen(text)?'mg-open':''}>{text}</td>;

export default function McpGovernance({view='S1',onView,onApproaches,onDetailed}){
  const [viewA,setViewA]=useState(null),[viewB,setViewB]=useState(null),[sync,setSync]=useState(true),[expanded,setExpanded]=useState(null),[other,setOther]=useState('S3');
  const compare=view==='compare';
  const id=compare?'S1':view;
  const sc=SCENARIOS[id];
  const diagrams=useMemo(()=>Object.fromEntries(IDS.map(key=>[key,diagramFor(key)])),[]);
  const setBoth=useCallback(next=>{setViewA(next);setViewB(next)},[]);
  const second=other===id?IDS.find(x=>x!==id):other;
  const choose=next=>{if(next===view)return;setExpanded(null);onView(next)};
  const jump=anchor=>document.getElementById(anchor)?.scrollIntoView({behavior:'smooth',block:'start'});
  const focusIds=compare?['S1',second]:[id];
  return <main className="detailed-diagrams mcp-governance" aria-label="MCP hosting and governance">
    <header className="surface dd-header">
      <div className="dd-title"><span className="eyebrow">MCP HOSTING &amp; GOVERNANCE · WHO CREATES, HOSTS, REGISTERS AND CALLS THE FINANCE MCP</span><h2>{compare?'Compare MCP topologies':sc.label}</h2></div>
      <nav className="dd-selector" role="tablist" aria-label="MCP scenario selection">
        {[...IDS,'compare'].map(key=><button type="button" role="tab" key={key} aria-selected={view===key} className={view===key?'active':''} onClick={()=>choose(key)}>{key==='compare'?'Compare side-by-side':SCENARIOS[key].label}</button>)}
      </nav>
      <div className="dd-header-actions"><span className="pill warn">PROPOSED DESIGN · NOT APPROVED · NOT TENANT-VERIFIED</span></div>
    </header>
    <section className="surface dd-summary" aria-label="Scenario summary">
      <div><span className="eyebrow">{compare?'WHAT THIS VIEW SHOWS':`${id} · ${sc.short.toUpperCase()}`}</span><p>{compare?`Two scenarios side by side. Pick the second one below. The matrices further down always show all three.`:sc.summary}</p>{!compare&&<p className="mg-baseline">{sc.baseline}</p>}</div>
      <div className="dd-invariant"><span className="eyebrow">AGENT HOSTING IS A SEPARATE DECISION</span><p>Choosing a gateway does not choose the agent runtime or the LLM. A registry is a catalog, never an invocation hop. A gateway routes and authorizes; it does not necessarily run the domain tools.</p></div>
    </section>
    <nav className="mg-anchors" aria-label="Sections on this page">{SECTIONS.map(([anchor,label])=><button type="button" key={anchor} onClick={()=>jump(anchor)}>{label}</button>)}<button type="button" onClick={onApproaches}>Pros &amp; cons →</button><button type="button" onClick={()=>onDetailed(id==='S3'||compare?'S1':id)}>Detailed reference diagrams →</button></nav>
    {compare&&<div className="surface dd-compare-bar"><label><input type="checkbox" checked={sync} onChange={event=>setSync(event.target.checked)}/> Synchronize zoom and pan</label><label>Compare S1 with <select value={second} onChange={event=>setOther(event.target.value)} aria-label="Second scenario">{IDS.filter(x=>x!=='S1').map(x=><option key={x} value={x}>{SCENARIOS[x].label}</option>)}</select></label></div>}
    <div className={`mg-viewers ${compare?'two':''}`}>
      {focusIds.map((key,index)=><div className="mg-viewer" key={key} data-scenario={key}><PanZoom diagram={diagrams[key]} uid={`mg-${key}-${compare?'c':'s'}`} compact={compare} view={index===0?viewA:viewB}
        onView={next=>{if(compare&&sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}} onFit={next=>{if(compare&&sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}}
        expanded={expanded===key} onExpand={on=>setExpanded(on?key:null)}/></div>)}
    </div>

    <section id="mg-responsibility" className="surface mg-section" data-testid="mg-matrix"><h3>Responsibility matrix · 21 rows</h3><p className="micro">Selected scenario highlighted. “{TBD}” and other open items are tinted. Every cell comes from one scenario configuration.</p>
      <div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Responsibility</th>{IDS.map(key=><th scope="col" key={key} className={focusIds.includes(key)?'sel':''}>{SCENARIOS[key].label}</th>)}</tr></thead>
        <tbody>{MATRIX.map(([row,...cells],index)=><tr key={row}><th scope="row">{index+1}. {row}</th>{cells.map((text,i)=><td key={IDS[i]} className={`${focusIds.includes(IDS[i])?'sel':''} ${isOpen(text)?'mg-open':''}`}>{text}</td>)}</tr>)}</tbody></table></div></section>

    {focusIds.map(key=><section id={key===focusIds[0]?'mg-connections':undefined} className="surface mg-section" key={key} data-testid={`mg-connections-${key}`}><h3>Endpoint connectivity · {SCENARIOS[key].label}</h3><p className="micro">Invocation traffic is listed separately from registry lookups and artifact deployment. Endpoint addresses are conceptual placeholders.</p>
      <div className="mg-scroll"><table className="mg-table wide"><thead><tr>{CONN_COLS.map(col=><th scope="col" key={col}>{col}</th>)}</tr></thead>
        <tbody>{CONNECTIONS[key].map((row,index)=><tr key={index} className={/not invocation/i.test(row[2])?'mg-aside':''}>{row.map((text,i)=>i===0?<th scope="row" key={i}>{text}</th>:<Cell key={i} text={text}/>)}</tr>)}</tbody></table></div></section>)}

    <section id="mg-registry" className="surface mg-section" data-testid="mg-registry"><h3>Registry and artifact ownership</h3><p className="micro">Registries catalog; repositories hold source and specifications; runtimes execute. These rows are the same cells as the responsibility matrix.</p>
      <div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Item</th>{IDS.map(key=><th scope="col" key={key} className={focusIds.includes(key)?'sel':''}>{SCENARIOS[key].label}</th>)}</tr></thead>
        <tbody>{MATRIX.filter(row=>REGISTRY_ROWS.includes(row[0])).map(([row,...cells])=><tr key={row}><th scope="row">{row}</th>{cells.map((text,i)=><td key={IDS[i]} className={`${focusIds.includes(IDS[i])?'sel':''} ${isOpen(text)?'mg-open':''}`}>{text}</td>)}</tr>)}</tbody></table></div>
      <p className="micro">Proposed hybrid source of truth: Apigee API hub for the SAP domain; AWS Agent Registry holds a reference; Enterprise AI Foundry owns publication approval. No automatic cross-platform synchronization is assumed.</p></section>

    <section id="mg-domain" className="surface mg-section" data-testid="mg-domain"><h3>Finance domain MCP design</h3><p className="micro">Read and write use separate authorizations. No generic write-capable tool may bypass SAP validation, approval, idempotency, posting-period control or audit. This demo never posts to SAP.</p>
      <div className="mg-cards">{DOMAINS.map(item=><article key={item.name}><span className={`pill ${item.mode.startsWith('WRITE')?'warn':'quiet'}`}>{item.mode}</span><h4>{item.name}</h4><p>{item.tools}</p><p><strong>Control</strong> {item.control}</p></article>)}</div>
      <p className="micro">Five authorizations stay distinct: business approval, agent authorization, gateway authorization, SAP backend user authorization and the actual SAP posting result. Service identity is simpler to prove; end-user delegation needs proven token exchange, Cloud Connector, identity mapping and ABAP roles ({TBD}).</p></section>

    <section id="mg-hosting" className="surface mg-section" data-testid="mg-hosting"><h3>Agent hosting versus MCP scenario</h3><p className="micro">A custom agent can run on one platform and consume an MCP endpoint hosted elsewhere. Nothing here is an enterprise approval.</p>
      <div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Agent host</th>{IDS.map(key=><th scope="col" key={key}>{SCENARIOS[key].label}</th>)}</tr></thead><tbody>{HOSTING.map(([name,...cells])=><tr key={name}><th scope="row">{name}</th>{cells.map((text,i)=><Cell key={i} text={text}/>)}</tr>)}</tbody></table></div></section>

    <section id="mg-decision" className="surface mg-section" data-testid="mg-decision"><h3>Decision matrix</h3><p className="micro">Qualitative assessment. These are architectural judgments, not verified product claims or an approval.</p>
      <div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Dimension</th>{IDS.map(key=><th scope="col" key={key} className={focusIds.includes(key)?'sel':''}>{SCENARIOS[key].label}</th>)}</tr></thead><tbody>{DIMENSIONS.map(([dim,...cells])=><tr key={dim}><th scope="row">{dim}</th>{cells.map((text,i)=><td key={IDS[i]} className={focusIds.includes(IDS[i])?'sel':''}>{text}</td>)}</tr>)}</tbody></table></div>
      <button type="button" className="text-link" onClick={onApproaches}>Compare with the pros &amp; cons view →</button></section>

    <section id="mg-recommendation" className="surface mg-section" data-testid="mg-recommendation"><h3>Recommendation and proof plan</h3><p className="mg-reco"><strong>{RECOMMENDATION.headline}</strong></p>
      <div className="mg-cards"><article><h4>Why</h4><ul>{RECOMMENDATION.why.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Depends on</h4><ul>{RECOMMENDATION.standards.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Open decisions</h4><ul>{RECOMMENDATION.open.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>What would change it</h4><ul>{RECOMMENDATION.changes.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>How a POC proves it</h4><ul>{RECOMMENDATION.poc.map(x=><li key={x}>{x}</li>)}</ul></article></div>
      <p className="micro">A recommendation is not production authorization.</p></section>

    <section id="mg-evidence" className="surface mg-section" data-testid="mg-evidence"><h3>Source evidence · accessed {ACCESSED}</h3><p className="micro">{EVIDENCE_NOTE}</p>
      <div className="mg-scroll"><table className="mg-table wide"><thead><tr>{['Platform','Source','Documented capability','Architecture consequence','Validation still required'].map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{EVIDENCE.map(([platform,title,url,capability,consequence,validate])=><tr key={url}><th scope="row">{platform}</th><td><a href={url} target="_blank" rel="noopener noreferrer">{title}</a></td><td>{capability}</td><td>{consequence}</td><td className="mg-open">{validate}</td></tr>)}</tbody></table></div></section>

    <section className="surface mg-section" aria-label="Glossary"><details><summary><strong>Glossary · MCP terms used on this page</strong></summary><dl className="mg-glossary">{GLOSSARY.map(([term,text])=><React.Fragment key={term}><dt>{term}</dt><dd>{text}</dd></React.Fragment>)}</dl></details>
      <p className="micro">Legend: {LEGEND.map(([,text])=>text).join(' · ')}.</p></section>
  </main>;
}
