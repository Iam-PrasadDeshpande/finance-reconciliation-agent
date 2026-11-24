import React,{useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import s1Svg from './diagrams/s1.svg?raw';
import s2Svg from './diagrams/s2.svg?raw';
import './detailed-diagrams.css';

// The diagram canvas is the reference deck's slide: 1200 x 840 points.
const W=1200,H=840,MAX_SCALE=12;
export const PNG_SCALES=[2,4];
const clamp=(value,low,high)=>Math.min(high,Math.max(low,value));

const DIAGRAMS={
  S1:{id:'S1',tab:'S1 · Google Apigee MCP',title:'S1 · Google Apigee MCP',svg:s1Svg,
    gateway:'Google Apigee MCP, external to AWS',
    summary:'The custom agent runs on Amazon Bedrock AgentCore Runtime and reaches the finance-owned domain MCP tools, SAP BAIP and the SAP backends through one MCP gateway: Google Apigee, outside the AWS boundary. Apigee applies inbound authorization and outbound target credentials; read paths return results over the same mediated path.'},
  S2:{id:'S2',tab:'S2 · AgentCore Gateway MCP',title:'S2 · AgentCore Gateway MCP',svg:s2Svg,
    gateway:'AgentCore Gateway MCP, inside AWS',
    summary:'The same agent and downstream path, but the single MCP gateway is AgentCore Gateway inside the AWS trust boundary. Inbound authorization and outbound target credentials are applied by the gateway before the finance-owned domain MCP tools, SAP BAIP and the SAP backends.'},
};
const INVARIANT='Only MCP gateway placement and its inbound / outbound auth controls change. Agent logic, domain tools, SAP integration, data, model and approval paths remain equivalent.';
const DIFFERENCES=[
  ['Lane 03 MCP gateway','Google Apigee · external to AWS','AgentCore Gateway · inside AWS'],
  ['Trust boundary','Gateway sits outside the AWS boundary','AWS trust boundary encloses lanes 02 and 03'],
  ['MCP entry detail','Apigee mode TBD','Target type TBD'],
  ['Colour coding','Gateway lane in orange (external)','Gateway lane in blue (AWS)'],
  ['Common to both','ONE selected gateway · no Portkey MCP','ONE selected gateway · no Portkey MCP'],
];
const OPEN_ITEMS=[
  'Delegation versus service identity: TO VALIDATE',
  'Integration Suite / iFlow identity propagation: TBD',
  'Mapped principal and ABAP roles at each SAP backend: TO VALIDATE',
  'Operation allowlist and outbound target credential or exchange: TBD',
  'Direct API versus iFlow / Cloud Connector route per backend; private route needs proof',
  'SAP Business Data Cloud and Databricks entitlement and scope: TO VALIDATE (future state)',
];

function markup(svg,uid){return svg.replace('aria-labelledby="t d"',`aria-labelledby="${uid}-t ${uid}-d"`).replace('id="t"',`id="${uid}-t"`).replace('id="d"',`id="${uid}-d"`)}
function svgFile(svg){return new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svg}`],{type:'image/svg+xml'})}

export function PanZoom({diagram,uid,view,onView,onFit,expanded,onExpand,compact}){
  const viewport=useRef(null),wrapper=useRef(null),viewRef=useRef(view),fitRef=useRef({s:0.5,x:0,y:0}),fitted=useRef(true),pointers=useRef(new Map()),pinch=useRef(null);
  viewRef.current=view;
  const onViewRef=useRef(onView),onFitRef=useRef(onFit);
  onViewRef.current=onView;onFitRef.current=onFit;
  const html=useMemo(()=>markup(diagram.svg,uid),[diagram,uid]);
  const computeFit=useCallback(()=>{
    const box=viewport.current?.getBoundingClientRect();
    if(!box||!box.width||!box.height)return null;
    const s=Math.min((box.width-16)/W,(box.height-16)/H);
    return {s,x:(box.width-W*s)/2,y:(box.height-H*s)/2};
  },[]);
  const fit=useCallback(()=>{const next=computeFit();if(!next)return;fitRef.current=next;fitted.current=true;onFitRef.current(next)},[computeFit]);
  useLayoutEffect(()=>{fit()},[fit,expanded,diagram.id]);
  useEffect(()=>{
    const node=viewport.current;if(!node||typeof ResizeObserver==='undefined')return;
    const observer=new ResizeObserver(()=>{if(fitted.current)fit();else{const next=computeFit();if(next)fitRef.current=next}});
    observer.observe(node);return()=>observer.disconnect();
  },[fit,computeFit]);
  const zoomAt=useCallback((factor,cx,cy)=>{
    const current=viewRef.current;if(!current)return;
    const minScale=Math.max(0.05,fitRef.current.s*0.5);
    const s=clamp(current.s*factor,minScale,MAX_SCALE);
    const ratio=s/current.s;
    fitted.current=false;
    onViewRef.current({s,x:cx-(cx-current.x)*ratio,y:cy-(cy-current.y)*ratio});
  },[]);
  const zoomCenter=factor=>{const box=viewport.current.getBoundingClientRect();zoomAt(factor,box.width/2,box.height/2)};
  const panBy=(dx,dy)=>{const current=viewRef.current;if(!current)return;fitted.current=false;onViewRef.current({...current,x:current.x+dx,y:current.y+dy})};
  const actual=()=>{const box=viewport.current.getBoundingClientRect();const current=viewRef.current;const ratio=1/current.s;fitted.current=false;const cx=box.width/2,cy=box.height/2;onViewRef.current({s:1,x:cx-(cx-current.x)*ratio,y:cy-(cy-current.y)*ratio})};
  useEffect(()=>{
    const node=viewport.current;if(!node)return;
    const onWheel=event=>{
      event.preventDefault();
      const box=node.getBoundingClientRect();
      const unit=event.deltaMode===1?32:event.deltaMode===2?400:1;
      zoomAt(Math.exp(-event.deltaY*unit*(event.ctrlKey?0.01:0.0016)),event.clientX-box.left,event.clientY-box.top);
    };
    node.addEventListener('wheel',onWheel,{passive:false});
    return()=>node.removeEventListener('wheel',onWheel);
  },[zoomAt]);
  const onPointerDown=event=>{
    if(event.target.closest('button'))return;
    viewport.current.setPointerCapture?.(event.pointerId);
    pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    if(pointers.current.size===2){const [a,b]=[...pointers.current.values()];pinch.current=Math.hypot(a.x-b.x,a.y-b.y)}
  };
  const onPointerMove=event=>{
    const previous=pointers.current.get(event.pointerId);if(!previous)return;
    const point={x:event.clientX,y:event.clientY};
    if(pointers.current.size===1){panBy(point.x-previous.x,point.y-previous.y)}
    else if(pointers.current.size===2&&pinch.current){
      pointers.current.set(event.pointerId,point);
      const [a,b]=[...pointers.current.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);
      const box=viewport.current.getBoundingClientRect();
      zoomAt(distance/pinch.current,(a.x+b.x)/2-box.left,(a.y+b.y)/2-box.top);pinch.current=distance;return;
    }
    pointers.current.set(event.pointerId,point);
  };
  const onPointerUp=event=>{pointers.current.delete(event.pointerId);if(pointers.current.size<2)pinch.current=null};
  const onKeyDown=event=>{
    const step=60;
    if(event.key==='+'||event.key==='=')zoomCenter(1.25);
    else if(event.key==='-'||event.key==='_')zoomCenter(0.8);
    else if(event.key==='0')fit();
    else if(event.key==='1')actual();
    else if(event.key==='ArrowLeft')panBy(step,0);
    else if(event.key==='ArrowRight')panBy(-step,0);
    else if(event.key==='ArrowUp')panBy(0,step);
    else if(event.key==='ArrowDown')panBy(0,-step);
    else if(event.key==='Escape'&&expanded)onExpand(false);
    else return;
    event.preventDefault();event.stopPropagation();
  };
  useEffect(()=>{
    if(!expanded)return;
    const onKey=event=>{if(event.key==='Escape')onExpand(false)};
    document.addEventListener('keydown',onKey);
    const fullscreenChange=()=>{if(!document.fullscreenElement&&expanded)onExpand(false)};
    document.addEventListener('fullscreenchange',fullscreenChange);
    return()=>{document.removeEventListener('keydown',onKey);document.removeEventListener('fullscreenchange',fullscreenChange)};
  },[expanded,onExpand]);
  const toggleExpand=()=>{
    if(expanded){if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});onExpand(false);return}
    onExpand(true);
    try{wrapper.current?.requestFullscreen?.().catch(()=>{})}catch{/* fullscreen is optional; the expanded overlay still works */}
  };
  const openFullSize=()=>{const url=URL.createObjectURL(svgFile(diagram.svg));window.open(url,'_blank','noopener');setTimeout(()=>URL.revokeObjectURL(url),60000)};
  const download=()=>{const url=URL.createObjectURL(svgFile(diagram.svg));const link=document.createElement('a');link.href=url;link.download=`${diagram.file||`finance-architecture-${diagram.id.toLowerCase()}`}.svg`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  const downloadPng=scale=>{
    const url=URL.createObjectURL(svgFile(diagram.svg));const image=new Image();
    image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=W*scale;canvas.height=H*scale;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);canvas.toBlob(blob=>{if(!blob)return;const href=URL.createObjectURL(blob);const link=document.createElement('a');link.href=href;link.download=`${diagram.file||`finance-architecture-${diagram.id.toLowerCase()}`}-${scale}x.png`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000)},'image/png')};
    image.onerror=()=>URL.revokeObjectURL(url);image.src=url;
  };
  const percent=Math.round((view?.s||0)*100);
  const transform=view?`translate(${view.x}px,${view.y}px) scale(${view.s})`:'none';
  return <div ref={wrapper} className={`dd-viewer ${expanded?'expanded':''} ${compact?'compact':''}`}>
    <div className="dd-toolbar" role="toolbar" aria-label={`${diagram.title} viewer controls`}>
      <strong className="dd-viewer-title"><span className={`dd-dot ${diagram.id.toLowerCase()}`} aria-hidden="true"/>{diagram.title}</strong>
      <div className="dd-tools">
        <button type="button" onClick={()=>zoomCenter(0.8)} aria-label={`Zoom out ${diagram.id}`} title="Zoom out (−)">−</button>
        <output className="dd-zoom" aria-live="polite" aria-label={`${diagram.id} zoom level`}>{percent}%</output>
        <button type="button" onClick={()=>zoomCenter(1.25)} aria-label={`Zoom in ${diagram.id}`} title="Zoom in (+)">+</button>
        <button type="button" onClick={fit} aria-label={`Reset ${diagram.id} view to fit`} title="Reset to fit (0)">Reset</button>
        <button type="button" onClick={actual} aria-label={`${diagram.id} actual size`} title="Actual size, 100% (1)">100%</button>
        <button type="button" onClick={toggleExpand} aria-label={expanded?`Exit expanded ${diagram.id} view`:`Expand ${diagram.id} to full screen`} aria-pressed={expanded}>{expanded?'Close ✕':'Expand ⤢'}</button>
        <button type="button" onClick={openFullSize} title="Open the vector SVG in a new browser tab">Open full-size ↗</button>
        <button type="button" onClick={download} title="Download the vector SVG">SVG ⤓</button>
        {diagram.png&&PNG_SCALES.map(scale=><button type="button" key={scale} onClick={()=>downloadPng(scale)} aria-label={`Download ${diagram.id} as ${scale}x PNG`} title={`Download a ${W*scale} x ${H*scale} px PNG`}>PNG {scale}× ⤓</button>)}
      </div>
    </div>
    <div ref={viewport} className="dd-viewport" tabIndex={0} role="group" aria-label={`${diagram.title} diagram. Scroll or pinch to zoom, drag to pan. Keys: plus and minus zoom, arrow keys pan, 0 resets, 1 actual size.`}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={onKeyDown} onDoubleClick={event=>{if(event.target.closest('button'))return;const box=viewport.current.getBoundingClientRect();zoomAt(1.8,event.clientX-box.left,event.clientY-box.top)}}>
      <div className="dd-stage" data-testid={`diagram-${diagram.id}`} style={{width:W,height:H,transform}} dangerouslySetInnerHTML={{__html:html}}/>
      <span className="dd-hint" aria-hidden="true">Scroll to zoom · drag to pan · double-click to zoom in</span>
    </div>
  </div>;
}

export default function DetailedDiagrams({view='S1',onView,onBack}){
  const [viewA,setViewA]=useState(null),[viewB,setViewB]=useState(null),[sync,setSync]=useState(true),[expanded,setExpanded]=useState(null);
  const compare=view==='compare';
  const choose=id=>{setExpanded(null);onView(id)};
  const single=DIAGRAMS[compare?'S1':view]||DIAGRAMS.S1;
  const setBoth=useCallback(next=>{setViewA(next);setViewB(next)},[]);
  const keys=['S1','S2'];
  return <main className="detailed-diagrams" aria-label="Detailed architecture diagrams">
    <header className="surface dd-header">
      <div className="dd-title"><span className="eyebrow">ARCHITECTURE DIAGRAMS · DETAILED L2 REFERENCE</span><h2>{compare?'S1 and S2 side by side':single.title}</h2></div>
      <nav className="dd-selector" role="tablist" aria-label="Detailed diagram selection">
        {[...keys,'compare'].map(id=><button type="button" role="tab" key={id} aria-selected={view===id} className={view===id?'active':''} onClick={()=>choose(id)}>{id==='compare'?'Compare side-by-side':DIAGRAMS[id].tab}</button>)}
      </nav>
      <div className="dd-header-actions"><span className="pill warn">PROPOSED DESIGN · REVIEW DRAFT · NOT TENANT-VERIFIED</span><button type="button" onClick={onBack}>← Architecture pros &amp; cons</button></div>
    </header>
    <section className="surface dd-summary" aria-label="Diagram summary">
      <div><span className="eyebrow">{compare?'WHAT THIS VIEW SHOWS':`${single.id} · MCP GATEWAY`}</span><p>{compare?'Both detailed diagrams share one worked month-end reconciliation path. Use the synchronized viewers to inspect lane 03 (MCP gateway) and the AWS trust boundary, where they differ.':single.summary}</p></div>
      <div className="dd-invariant"><span className="eyebrow">SCENARIO INVARIANT</span><p>{INVARIANT}</p></div>
    </section>
    <div className={`dd-body ${compare?'is-compare':''}`}>
      {compare?<>
        <div className="dd-compare-bar surface"><label><input type="checkbox" checked={sync} onChange={event=>setSync(event.target.checked)}/> Synchronize zoom and pan</label><span>Zoom into lane 03 and the AWS trust boundary to see where the two options differ.</span></div>
        <div className="dd-compare-grid">
          {keys.map((id,index)=><PanZoom key={id} diagram={DIAGRAMS[id]} uid={`dd-${id}-cmp`} compact view={index===0?viewA:viewB} onView={next=>{if(sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}} onFit={next=>{if(sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}} expanded={expanded===id} onExpand={on=>setExpanded(on?id:null)}/>)}
        </div>
      </>:<PanZoom key={single.id} diagram={single} uid={`dd-${single.id}`} view={viewA} onView={setViewA} onFit={setViewA} expanded={expanded===single.id} onExpand={on=>setExpanded(on?single.id:null)}/>}
      <aside className="surface dd-side" aria-label="Key differences and open validations">
        <h3>What changes between S1 and S2</h3>
        <table><thead><tr><th scope="col">Item</th><th scope="col">S1</th><th scope="col">S2</th></tr></thead><tbody>{DIFFERENCES.map(([item,a,b])=><tr key={item}><th scope="row">{item}</th><td className={view==='S2'?'dim':''}>{a}</td><td className={view==='S1'?'dim':''}>{b}</td></tr>)}</tbody></table>
        <h3>Open validations shown in the diagram</h3>
        <ul>{OPEN_ITEMS.map(item=><li key={item}>{item}</li>)}</ul>
        <p className="micro">Vendor-named components are design projections, not connected services. S3 has no detailed diagram in the supplied reference.</p>
        <button type="button" className="text-link" onClick={onBack}>Back to architecture pros &amp; cons →</button>
      </aside>
    </div>
  </main>;
}
