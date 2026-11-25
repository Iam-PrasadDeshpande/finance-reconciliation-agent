import React,{useCallback,useMemo,useRef,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import {SCENARIOS,IDS,GLOSSARY,MATRIX,CONN_COLS,CONNECTIONS,DOMAINS,RECOMMENDATION,EVIDENCE,EVIDENCE_NOTE,ACCESSED,topologySvg,LEGEND,TBD,BANNER} from './mcpScenarios';
import './detailed-diagrams.css';
import './mcp-governance.css';

// MCP hosting and registration. Four independent decisions (agent hosting, MCP hosting, agent registry, MCP registry) plus the MCP gateway.
// Every table and diagram below is generated from the canonical model (poc/architecture_model.py).
const REGISTRY_ROWS=['Agent registry','MCP registry','Enterprise governance alignment','Deployment prerequisites','Open architecture decisions'];
const SECTIONS=[['mg-responsibility','Comparison matrix'],['mg-connections','Endpoint connectivity'],['mg-registry','Registry and ownership'],['mg-domain','Finance domain design'],['mg-recommendation','Recommendation'],['mg-evidence','Source evidence']];
const HINTS={'mg-responsibility':'Hosting, registration, gateway, identity, cost and governance side by side','mg-registry':'Registration is separate from hosting and execution','mg-domain':'Read, posting and analytical tools with separate authorizations','mg-recommendation':'Preferred candidate and proof plan','mg-evidence':'Official sources and what they do not prove','mg-connections':'Every connection, with its plane and verification status'};
const DIAGRAM={S1:'D2',S2:'D3',S3:'D4'};

function diagramFor(id){return {id,title:SCENARIOS[id].label,svg:topologySvg(id),file:`mcp-topology-${id.toLowerCase()}`,png:true}}
const isOpen=text=>/TBD|TO VALIDATE|unproven|NOT_VERIFIED|REQUIRES VALIDATION|needs proof|must be proven|unmeasured|pending|unresolved/i.test(text);
const Cell=({text})=><td className={isOpen(text)?'mg-open':''}>{text}</td>;

function Fold({id,testid,title,hint,open,onToggle,children}){
  return <details id={id} className="surface mg-section mg-fold" data-testid={testid} open={open} onToggle={event=>onToggle(id,event.currentTarget.open)}><summary><h3>{title}</h3><span className="mg-hint">{hint}</span></summary>{children}</details>;
}

export default function McpGovernance({view='S3',onView,onApproaches,onAgentHosting,onDetailed}){
  const rootRef=useRef(null),[openMap,setOpenMap]=useState({'mg-recommendation':true});
  const toggleFold=(id,value)=>setOpenMap(previous=>previous[id]===value?previous:{...previous,[id]:value});
  const [viewA,setViewA]=useState(null),[viewB,setViewB]=useState(null),[sync,setSync]=useState(true),[expanded,setExpanded]=useState(null),[other,setOther]=useState('S3');
  const compare=view==='compare';
  const id=compare?'S1':view;
  const sc=SCENARIOS[id]||SCENARIOS.S3;
  const diagrams=useMemo(()=>Object.fromEntries(IDS.map(key=>[key,diagramFor(key)])),[]);
  const setBoth=useCallback(next=>{setViewA(next);setViewB(next)},[]);
  const second=other===id?IDS.find(x=>x!==id):other;
  const choose=next=>{if(next===view)return;setExpanded(null);onView(next)};
  const jump=anchor=>{setOpenMap(previous=>({...previous,[anchor]:true}));requestAnimationFrame(()=>rootRef.current?.querySelector(`#${anchor}`)?.scrollIntoView({behavior:'smooth',block:'start'}))};
  const focusIds=compare?['S1',second]:[id];
  const registryRows=MATRIX.filter(row=>REGISTRY_ROWS.includes(row[0]));
  return <main ref={rootRef} className="detailed-diagrams mcp-governance" aria-label="MCP hosting">
    <header className="surface dd-header">
      <div className="dd-title"><span className="eyebrow">MCP HOSTING · WHO HOSTS, REGISTERS, EXPOSES AND CALLS THE FINANCE MCP</span><h2>{compare?'Compare MCP topologies':sc.label}</h2></div>
      <nav className="dd-selector" role="tablist" aria-label="MCP scenario selection">
        {[...IDS,'compare'].map(key=><button type="button" role="tab" key={key} aria-selected={view===key} className={view===key?'active':''} onClick={()=>choose(key)}>{key==='compare'?'Compare side-by-side':SCENARIOS[key].label}</button>)}
      </nav>
      <div className="dd-header-actions"><span className="pill warn">{BANNER.split(' · ').slice(0,2).join(' · ')}</span></div>
    </header>
    <section className="surface dd-summary" aria-label="Scenario summary">
      <div><span className="eyebrow">{compare?'WHAT THIS VIEW SHOWS':`${id} · ${sc.short.toUpperCase()} · ${sc.status.toUpperCase()}`}</span><p>{compare?'Two scenarios side by side. Pick the second one below. The matrices further down always show all three.':sc.summary}</p>{!compare&&<p className="micro">{sc.baseline}</p>}</div>
      <div className="dd-invariant"><span className="eyebrow">FOUR INDEPENDENT DECISIONS</span><p>Agent hosting, MCP implementation hosting, agent registration and MCP registration are separate. Using AWS Agent Registry does not require AWS agent hosting. Apigee is the SAP-facing MCP/API gateway in every scenario. A registry is a catalog, never an invocation hop.</p></div>
    </section>
    <nav className="mg-anchors" aria-label="Sections on this page">{SECTIONS.map(([anchor,label])=><button type="button" key={anchor} onClick={()=>jump(anchor)}>{label}</button>)}<button type="button" onClick={onApproaches}>Complete architecture →</button>{onAgentHosting&&<button type="button" onClick={onAgentHosting}>Agent hosting →</button>}{onDetailed&&<button type="button" onClick={()=>onDetailed(compare?'D5':'D5')}>Hosting versus registration diagram →</button>}</nav>
    {compare&&<div className="surface dd-compare-bar"><label><input type="checkbox" checked={sync} onChange={event=>setSync(event.target.checked)}/> Synchronize zoom and pan</label><label>Compare S1 with <select value={second} onChange={event=>setOther(event.target.value)}>{IDS.filter(key=>key!=='S1').map(key=><option key={key} value={key}>{SCENARIOS[key].label}</option>)}</select></label></div>}
    <div className={`mg-viewers ${compare?'two':''}`}>
      {focusIds.map((key,index)=><div className="mg-viewer" key={key} data-scenario={key}><PanZoom diagram={diagrams[key]} uid={`mg-${key}-${compare?'c':'s'}`} compact={compare} view={index===0?viewA:viewB}
        onView={next=>{if(compare&&sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}} onFit={next=>{if(compare&&sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}}
        expanded={expanded===key} onExpand={on=>setExpanded(on?key:null)}/></div>)}
    </div>

    <Fold id="mg-responsibility" testid="mg-matrix" title={<>Comparison matrix · {MATRIX.length} rows</>} hint={HINTS['mg-responsibility']} open={Boolean(openMap['mg-responsibility'])} onToggle={toggleFold}><p className="micro">Selected scenario highlighted. “{TBD}” marks proof that does not exist yet.</p>
      <div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Dimension</th>{IDS.map(key=><th scope="col" key={key} className={focusIds.includes(key)?'sel':''}>{SCENARIOS[key].label}</th>)}</tr></thead>
        <tbody>{MATRIX.map(([row,...cells],index)=><tr key={row}><th scope="row">{index+1}. {row}</th>{cells.map((text,i)=><td key={IDS[i]} className={`${focusIds.includes(IDS[i])?'sel':''} ${isOpen(text)?'mg-open':''}`}>{text}</td>)}</tr>)}</tbody></table></div></Fold>

    {focusIds.map(key=><Fold key={key} id={key===focusIds[0]?'mg-connections':`mg-connections-${key}`} testid={`mg-connections-${key}`} title={<>Endpoint connectivity · {SCENARIOS[key].label}</>} hint={HINTS['mg-connections']} open={Boolean(openMap[key===focusIds[0]?'mg-connections':`mg-connections-${key}`])} onToggle={toggleFold}>
      <div className="mg-scroll"><table className="mg-table wide"><thead><tr>{CONN_COLS.map(col=><th scope="col" key={col}>{col}</th>)}</tr></thead>
        <tbody>{CONNECTIONS[key].map((row,index)=><tr key={index} className={/not invocation/i.test(row[2])?'mg-aside':''}>{row.map((text,i)=>i===0?<th scope="row" key={i}>{text}</th>:<Cell key={i} text={text}/>)}</tr>)}</tbody></table></div></Fold>)}

    <Fold id="mg-registry" testid="mg-registry" title={<>Registry and ownership</>} hint={HINTS['mg-registry']} open={Boolean(openMap['mg-registry'])} onToggle={toggleFold}><p className="micro">Registries catalog and govern; they are not runtime hops and registration is not proof of reachability or authorization.</p>
      <div className="mg-scroll"><table className="mg-table"><thead><tr><th scope="col">Item</th>{IDS.map(key=><th scope="col" key={key} className={focusIds.includes(key)?'sel':''}>{SCENARIOS[key].label}</th>)}</tr></thead>
        <tbody>{registryRows.map(([row,...cells])=><tr key={row}><th scope="row">{row}</th>{cells.map((text,i)=><td key={IDS[i]} className={`${focusIds.includes(IDS[i])?'sel':''} ${isOpen(text)?'mg-open':''}`}>{text}</td>)}</tr>)}
          {[['Registry publisher and approval owner','registry_publisher_approver'],['Registry synchronization','registry_sync'],['Agent discovery','agent_discovery'],['MCP tool discovery','mcp_tool_discovery'],['Artifact repository','artifact_repository']].map(([label,field])=><tr key={field}><th scope="row">{label}</th>{IDS.map(key=><td key={key} className={`${focusIds.includes(key)?'sel':''} ${isOpen(SCENARIOS[key][field])?'mg-open':''}`}>{SCENARIOS[key][field]}</td>)}</tr>)}</tbody></table></div>
      <p className="micro">S1 states its registry as unresolved: no product is selected, so none is shown. S3 registers SAP-hosted metadata in AWS Agent Registry without any AWS execution hop.</p></Fold>

    <Fold id="mg-domain" testid="mg-domain" title={<>Finance domain MCP design</>} hint={HINTS['mg-domain']} open={Boolean(openMap['mg-domain'])} onToggle={toggleFold}><p className="micro">Read and write use separate authorizations. This application is read and tally only; no posting capability is active.</p>
      <div className="mg-cards">{DOMAINS.map(item=><article key={item.name}><span className={`pill ${item.mode.startsWith('WRITE')?'warn':'quiet'}`}>{item.mode}</span><h4>{item.name}</h4><p>{item.tools}</p><p><strong>Control</strong> {item.control}</p></article>)}</div>
      <p className="micro">Five authorizations stay distinct: business approval, agent authorization, gateway authorization, SAP backend user authorization and the actual SAP result. The SAP backend remains the business authority.</p></Fold>

    <Fold id="mg-recommendation" testid="mg-recommendation" title={<>Recommendation and proof plan</>} hint={HINTS['mg-recommendation']} open={Boolean(openMap['mg-recommendation'])} onToggle={toggleFold}><p className="mg-reco"><strong>{RECOMMENDATION.headline}</strong></p>
      <div className="mg-cards"><article><h4>Why</h4><ul>{RECOMMENDATION.why.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Depends on</h4><ul>{RECOMMENDATION.standards.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Open decisions</h4><ul>{RECOMMENDATION.open.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>What would change it</h4><ul>{RECOMMENDATION.changes.map(x=><li key={x}>{x}</li>)}</ul></article><article><h4>Proof of concept</h4><ul>{RECOMMENDATION.poc.map(x=><li key={x}>{x}</li>)}</ul></article></div>
      <p className="micro">A recommendation is not production authorization.</p></Fold>

    <Fold id="mg-evidence" testid="mg-evidence" title={<>Source evidence · listed {ACCESSED}</>} hint={HINTS['mg-evidence']} open={Boolean(openMap['mg-evidence'])} onToggle={toggleFold}><p className="micro">{EVIDENCE_NOTE}</p>
      <div className="mg-scroll"><table className="mg-table wide"><thead><tr>{['Platform','Source','Documented capability','Architecture consequence','Validation still required'].map(c=><th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{EVIDENCE.map(([platform,title,url,capability,consequence,validation])=><tr key={url}><th scope="row">{platform}</th><td><a href={url} target="_blank" rel="noreferrer">{title} ↗</a></td><td>{capability}</td><td>{consequence}</td><Cell text={validation}/></tr>)}</tbody></table></div></Fold>

    <section className="surface mg-section" aria-label="Glossary"><details><summary><strong>Glossary · terms used on this page</strong></summary><dl className="mg-glossary">{GLOSSARY.map(([term,text])=><React.Fragment key={term}><dt>{term}</dt><dd>{text}</dd></React.Fragment>)}</dl></details>
      <p className="micro">Legend: {LEGEND.map(([,text])=>text).join(' · ')}.</p></section>
  </main>;
}
