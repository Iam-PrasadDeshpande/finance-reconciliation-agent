import React,{useEffect,useMemo,useState} from 'react';
import './ontology.css';

const KINDS=[['actor','Actor','#0e7c86','#e9f6f8'],['process','Process','#6b4fb3','#f1ecfa'],['entity','Entity','#0a6ed1','#e8f1fb'],['measure','Measure','#107E3E','#f2faf4'],['rule','Rule','#d99a25','#fff8eb'],['artifact','Artifact','#6b7f8f','#f4f6f8']];
const KIND=Object.fromEntries(KINDS.map(([id,label,stroke,fill])=>[id,{label,stroke,fill}]));
const STATUS={DOCUMENTED:['Documented by SAP','ok'],SAP_TERM:['SAP term, not source-checked','warn'],DEMO_ONLY:['Demo concept only','']};
const W=190,H=46,GAP_X=70,GAP_Y=14,TOP=34,PAD=12;

function layout(classes,modules){
  const pos={};const cols=modules.filter(m=>classes.some(c=>c.module===m.id));
  cols.forEach((m,ci)=>{
    classes.filter(c=>c.module===m.id).sort((a,b)=>KINDS.findIndex(k=>k[0]===a.kind)-KINDS.findIndex(k=>k[0]===b.kind)||a.label.localeCompare(b.label)).forEach((c,ri)=>{pos[c.id]={x:PAD+ci*(W+GAP_X),y:TOP+ri*(H+GAP_Y)}});
  });
  const rows=Math.max(1,...cols.map(m=>classes.filter(c=>c.module===m.id).length));
  return {pos,cols,width:PAD*2+cols.length*W+Math.max(0,cols.length-1)*GAP_X,height:TOP+rows*(H+GAP_Y)+PAD};
}

function edgePath(a,b){
  if(a.x===b.x){const x=a.x+W,dx=36;return `M${x},${a.y+H/2} C${x+dx},${a.y+H/2} ${x+dx},${b.y+H/2} ${x},${b.y+H/2}`}
  const forward=a.x<b.x;const x1=forward?a.x+W:a.x,x2=forward?b.x:b.x+W,dx=Math.max(30,Math.abs(x2-x1)/2)*(forward?1:-1);
  return `M${x1},${a.y+H/2} C${x1+dx},${a.y+H/2} ${x2-dx},${b.y+H/2} ${x2},${b.y+H/2}`;
}

export default function OntologyView({ontology,references=[],focus,onOpenTab}){
  const [moduleFilter,setModuleFilter]=useState('all');
  const [query,setQuery]=useState('');
  const [selected,setSelected]=useState(focus||null);
  useEffect(()=>{if(focus){setSelected(focus);setModuleFilter('all');setQuery('')}},[focus]);
  const classes=ontology?.classes||[],relations=ontology?.relations||[],modules=ontology?.modules||[];
  const byId=useMemo(()=>Object.fromEntries(classes.map(c=>[c.id,c])),[classes]);
  const refById=Object.fromEntries(references.map(r=>[r.id,r]));
  const q=query.trim().toLowerCase();
  const visible=classes.filter(c=>(moduleFilter==='all'||c.module===moduleFilter||c.module==='core'&&moduleFilter!=='all'&&relations.some(r=>(r.from===c.id&&byId[r.to]?.module===moduleFilter)||(r.to===c.id&&byId[r.from]?.module===moduleFilter)))&&(!q||`${c.label} ${c.description} ${c.sap_term||''}`.toLowerCase().includes(q)));
  const ids=new Set(visible.map(c=>c.id));
  const {pos,cols,width,height}=useMemo(()=>layout(visible,modules),[visible.map(c=>c.id).join('|'),modules.length]);
  const edges=relations.filter(r=>ids.has(r.from)&&ids.has(r.to));
  const sel=selected&&byId[selected]?byId[selected]:null;
  const near=new Set(sel?[sel.id,...edges.filter(e=>e.from===sel.id||e.to===sel.id).flatMap(e=>[e.from,e.to])]:[]);
  const rels=sel?relations.filter(r=>r.from===sel.id||r.to===sel.id):[];
  if(!ontology)return <main className="ontology-page"><div className="empty-state" role="status"><strong>Loading the ontology…</strong></div></main>;
  return <main className="ontology-page" aria-label="Ontology" data-testid="ontology-view">
    <header className="surface ont-head"><div><span className="eyebrow">ONTOLOGY · THE CONCEPTS THE AGENTS WORK WITH</span><h2>Ontology</h2><p>{classes.length} concepts and {relations.length} relations. Each agent module brings its own concepts; shared concepts are listed once. {ontology.note}</p></div>
      <div className="ont-controls"><div className="ont-chips" role="group" aria-label="Show concepts from">{[{id:'all',name:'All'},...modules].map(m=><button type="button" key={m.id} className={moduleFilter===m.id?'active':''} aria-pressed={moduleFilter===m.id} onClick={()=>setModuleFilter(m.id)}>{m.name}</button>)}</div>
        <label className="sr-only" htmlFor="ont-search">Search concepts</label><input id="ont-search" type="search" placeholder="Search concepts" value={query} onChange={event=>setQuery(event.target.value)}/></div></header>
    <div className="ont-body">
      <section className="surface ont-graph" aria-label="Ontology graph">
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Concepts and their relations" onClick={event=>{if(event.target.tagName==='svg')setSelected(null)}}>
          {cols.map((m,ci)=><text key={m.id} x={PAD+ci*(W+GAP_X)} y={20} fontSize="11" fontWeight="800" fill="#557695" letterSpacing=".05em">{m.name.toUpperCase()}</text>)}
          {edges.map((e,i)=>{const a=pos[e.from],b=pos[e.to];const on=sel&&(e.from===sel.id||e.to===sel.id);const mx=(a.x+b.x+W)/2,my=(a.y+b.y+H)/2;return <g key={i} opacity={sel?(on?1:.08):.45}><path d={edgePath(a,b)} fill="none" stroke={on?'#0a6ed1':'#8aa2b4'} strokeWidth={on?1.8:1}/>{on&&<text x={mx} y={my-3} fontSize="10" textAnchor="middle" fill="#075793" paintOrder="stroke" stroke="#fff" strokeWidth="3">{e.label}</text>}</g>})}
          {visible.map(c=>{const p=pos[c.id],k=KIND[c.kind]||KIND.artifact;const dim=sel&&!near.has(c.id);return <g key={c.id} data-testid="ontology-node" data-id={c.id} opacity={dim?.3:1} tabIndex={0} role="button" aria-label={`${c.label}, ${k.label}`} onClick={()=>setSelected(c.id)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setSelected(c.id)}}} style={{cursor:'pointer'}}>
            <rect x={p.x} y={p.y} width={W} height={H} rx="5" fill={k.fill} stroke={sel?.id===c.id?'#0a4f9e':k.stroke} strokeWidth={sel?.id===c.id?3:c.sap_status==='DOCUMENTED'?2:1.2} strokeDasharray={c.sap_status==='DEMO_ONLY'?'4 3':undefined}/>
            <text x={p.x+9} y={p.y+19} fontSize="12" fontWeight="700" fill="#1d2d3e">{c.label.length>25?c.label.slice(0,24)+'…':c.label}</text>
            <text x={p.x+9} y={p.y+35} fontSize="9.5" fill="#587184">{k.label} · {(STATUS[c.sap_status]||[c.sap_status])[0]}</text></g>})}
        </svg>
        <div className="ont-legend" aria-label="Legend">{KINDS.map(([id,label,stroke,fill])=><span key={id}><i style={{background:fill,borderColor:stroke}}/>{label}</span>)}<span><i className="dashed"/>Dashed: demo concept only</span><span><i className="solid"/>Bold: documented by SAP</span></div>
      </section>
      <aside className="surface ont-detail" aria-live="polite" data-testid="ontology-detail">
        {!sel?<><h3>Select a concept</h3><p className="ont-note">Click a box to see what it means, where SAP describes it, which agents and tools use it, and how it relates to other concepts. Relations of the selected concept are labelled on the graph.</p></>:<>
          <span className="eyebrow">{(KIND[sel.kind]||KIND.artifact).label.toUpperCase()} · {(modules.find(m=>m.id===sel.module)||{}).name}</span><h3>{sel.label}</h3><p>{sel.description}</p>
          {sel.properties?.length>0&&<><h4>Properties</h4><p className="ont-props">{sel.properties.join(' · ')}</p></>}
          <h4>SAP grounding</h4><p><span className={`ont-chip ${(STATUS[sel.sap_status]||[])[1]||''}`}>{(STATUS[sel.sap_status]||[sel.sap_status])[0]}</span> {sel.sap_term||'No SAP counterpart is claimed.'}</p>
          {sel.sources?.length>0&&<ul className="ont-list">{sel.sources.map(id=>refById[id]?<li key={id}><a href={refById[id].url} target="_blank" rel="noreferrer">{id} · {refById[id].title} ↗</a> <small>[{refById[id].status}]</small></li>:<li key={id}>{id}</li>)}</ul>}
          <h4>Used by</h4>{sel.used_by?.length?<ul className="ont-list" data-testid="ontology-used-by">{sel.used_by.map((u,i)=><li key={i}><b>{u.agent||u.module}</b> · <code>{u.tool}</code> <small>{u.access==='reads'?'reads':'produces'}</small></li>)}</ul>:<p className="ont-note">No tool reads or produces it directly.</p>}
          <h4>Relations</h4>{rels.length?<ul className="ont-list">{rels.map((r,i)=>{const out=r.from===sel.id,other=byId[out?r.to:r.from];return <li key={i}>{out?<>this <em>{r.label}</em> </>:<><button type="button" className="ont-link" onClick={()=>setSelected(other.id)}>{other.label}</button> <em>{r.label}</em> this</>}{out&&<button type="button" className="ont-link" onClick={()=>setSelected(other.id)}>{other.label}</button>}</li>})}</ul>:<p className="ont-note">None.</p>}
          {sel.where&&onOpenTab&&<button type="button" className="ont-open" onClick={()=>onOpenTab(sel.where.tab)}>Open {sel.where.label} →</button>}
        </>}
      </aside>
    </div>
    <details className="surface ont-table"><summary><strong>Table view</strong> <span>{visible.length} concepts</span></summary><table className="rr-table"><thead><tr><th>Concept</th><th>Kind</th><th>Module</th><th>SAP term</th><th>Status</th></tr></thead><tbody>{visible.map(c=><tr key={c.id}><td>{c.label}</td><td>{(KIND[c.kind]||{}).label}</td><td>{(modules.find(m=>m.id===c.module)||{}).name}</td><td>{c.sap_term||'none claimed'}</td><td>{(STATUS[c.sap_status]||[c.sap_status])[0]}</td></tr>)}</tbody></table></details>
  </main>;
}
