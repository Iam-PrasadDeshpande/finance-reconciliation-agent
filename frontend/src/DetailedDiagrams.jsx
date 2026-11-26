import React,{useCallback,useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {DIAGRAM_KEYS,DIAGRAM_NAMES,diagramSvg,diagramSpec,SCENARIOS,BANNER} from './mcpScenarios';
import './detailed-diagrams.css';

// The diagram canvas is the reference deck's slide: 1200 x 840 points.
const W=1200,H=840,MAX_SCALE=12;
export const PNG_SCALES=[2,4];
const clamp=(value,low,high)=>Math.min(high,Math.max(low,value));

const SHORT={D1:'Reference',D2:'S1',D3:'S2',D4:'S3',D5:'Responsibilities',D6:'AWS account',D7:'Gateway identity',D8:'Cost',D9:'Decision tree',D10:'Executive'};
const DIAGRAMS=Object.fromEntries(DIAGRAM_KEYS.map(key=>{const spec=diagramSpec(key);return [key,{id:key,tab:`${key} · ${SHORT[key]}`,title:`${key} · ${spec.title}`,svg:diagramSvg(key),file:`architecture-${key.toLowerCase()}`,png:true,summary:spec.chain,footer:spec.footer}]}));
const COMPARE_PAIR=['D2','D4'];
const OPEN_ITEMS=['S1 is preferred for SAP-centric agents; S3 is preferred for SAP and non-SAP agents but conditional on account approval, identity, gateway interoperability and verified cost; S2 is kept for reference and is not preferred','The dedicated SAP-agent AWS account is proposed and not provisioned','AgentCore Gateway to Apigee: the real call has not been run; reachability and the credential provider account are not yet checked','Delegated identity and principal propagation are not yet validated','No cost rates are entered: the comparison is pending FinOps input'];

function markup(svg,uid){return svg.replace('aria-labelledby="t d"',`aria-labelledby="${uid}-t ${uid}-d"`).replace('id="t"',`id="${uid}-t"`).replace('id="d"',`id="${uid}-d"`)}
function svgFile(svg){return new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svg}`],{type:'image/svg+xml'})}

export function PanZoom({diagram,uid,view,onView,onFit,expanded,onExpand,compact,onPick}){
  const DW=diagram.w||W,DH=diagram.h||H,startPt=useRef(null);
  const viewport=useRef(null),wrapper=useRef(null),viewRef=useRef(view),fitRef=useRef({s:0.5,x:0,y:0}),fitted=useRef(true),pointers=useRef(new Map()),pinch=useRef(null);
  viewRef.current=view;
  const onViewRef=useRef(onView),onFitRef=useRef(onFit);
  onViewRef.current=onView;onFitRef.current=onFit;
  const html=useMemo(()=>markup(diagram.svg,uid),[diagram,uid]);
  const computeFit=useCallback(()=>{
    const box=viewport.current?.getBoundingClientRect();
    if(!box||!box.width||!box.height)return null;
    const s=Math.min((box.width-16)/DW,(box.height-16)/DH);
    return {s,x:(box.width-DW*s)/2,y:(box.height-DH*s)/2};
  },[DW,DH]);
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
    startPt.current={x:event.clientX,y:event.clientY};
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
  const onPointerUp=event=>{
    const start=startPt.current;pointers.current.delete(event.pointerId);if(pointers.current.size<2)pinch.current=null;
    if(onPick&&start&&event.type==='pointerup'&&pointers.current.size===0&&Math.hypot(event.clientX-start.x,event.clientY-start.y)<5){const scope=viewport.current?.getRootNode?.();const hit=(scope?.elementFromPoint?scope:document).elementFromPoint(event.clientX,event.clientY)?.closest?.('[data-zone]');if(hit)onPick(hit.getAttribute('data-zone'))}
    startPt.current=null;
  };
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
    image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=DW*scale;canvas.height=DH*scale;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);canvas.toBlob(blob=>{if(!blob)return;const href=URL.createObjectURL(blob);const link=document.createElement('a');link.href=href;link.download=`${diagram.file||`finance-architecture-${diagram.id.toLowerCase()}`}-${scale}x.png`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),1000)},'image/png')};
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
        {diagram.png&&PNG_SCALES.map(scale=><button type="button" key={scale} onClick={()=>downloadPng(scale)} aria-label={`Download ${diagram.id} as ${scale}x PNG`} title={`Download a ${DW*scale} x ${DH*scale} px PNG`}>PNG {scale}× ⤓</button>)}
      </div>
    </div>
    <div ref={viewport} className="dd-viewport" tabIndex={0} role="group" aria-label={`${diagram.title} diagram. Scroll or pinch to zoom, drag to pan. Keys: plus and minus zoom, arrow keys pan, 0 resets, 1 actual size.`}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onKeyDown={onKeyDown} onDoubleClick={event=>{if(event.target.closest('button'))return;const box=viewport.current.getBoundingClientRect();zoomAt(1.8,event.clientX-box.left,event.clientY-box.top)}}>
      <div className="dd-stage" data-testid={`diagram-${diagram.id}`} style={{width:DW,height:DH,transform}} dangerouslySetInnerHTML={{__html:html}}/>
      <span className="dd-hint" aria-hidden="true">Scroll to zoom · drag to pan · double-click to zoom in</span>
    </div>
  </div>;
}

export default function DetailedDiagrams({view='D1',onView,onBack}){
  const [viewA,setViewA]=useState(null),[viewB,setViewB]=useState(null),[sync,setSync]=useState(true),[expanded,setExpanded]=useState(null),[pair,setPair]=useState(COMPARE_PAIR);
  const compare=view==='compare';
  const key=DIAGRAMS[view]?view:'D1';
  const choose=id=>{setExpanded(null);onView(id)};
  const single=DIAGRAMS[key];
  const setBoth=useCallback(next=>{setViewA(next);setViewB(next)},[]);
  const scenarioKeys=['D2','D3','D4'];
  return <main className="detailed-diagrams" aria-label="Architecture diagrams">
    <header className="surface dd-header">
      <div className="dd-title"><span className="eyebrow">ARCHITECTURE DIAGRAMS · V5.1 · GENERATED FROM ONE MODEL (VECTOR)</span><h2>{compare?'Scenario topologies side by side':single.title}</h2></div>
      <nav className="dd-selector" role="tablist" aria-label="Detailed diagram selection">
        {[...DIAGRAM_KEYS,'compare'].map(id=><button type="button" role="tab" key={id} aria-selected={view===id} className={view===id?'active':''} onClick={()=>choose(id)}>{id==='compare'?'Compare side-by-side':DIAGRAMS[id].tab}</button>)}
      </nav>
      <div className="dd-header-actions"><span className="pill warn">PROPOSED DESIGN · NOT APPROVED · NOT TENANT-VERIFIED</span><button type="button" onClick={onBack}>← Complete architecture</button></div>
    </header>
    <section className="surface dd-summary" aria-label="Diagram summary">
      <div><span className="eyebrow">{compare?'WHAT THIS VIEW SHOWS':single.id}</span><p>{compare?'Two scenario topologies from the same model. Pick the scenarios below; zoom and pan can be synchronized.':single.summary}</p></div>
      <div className="dd-invariant"><span className="eyebrow">COMMON TO S1, S2 AND S3</span><p>Portkey is the LLM gateway. SAP Integration Suite is the SAP integration boundary. The SAP backend decides business authorization. GitLab deploys everything and is never a runtime. A registry is a catalog, never an invocation hop.</p></div>
    </section>
    <div className={`dd-body ${compare?'is-compare':''}`}>
      {compare?<>
        <div className="dd-compare-bar surface"><label><input type="checkbox" checked={sync} onChange={event=>setSync(event.target.checked)}/> Synchronize zoom and pan</label>{pair.map((value,index)=><label key={index}>{index?'with':'Compare'} <select value={value} onChange={event=>setPair(previous=>previous.map((x,i)=>i===index?event.target.value:x))}>{scenarioKeys.map(id=><option key={id} value={id}>{DIAGRAMS[id].tab}</option>)}</select></label>)}</div>
        <div className="dd-compare-grid">
          {pair.map((id,index)=><PanZoom key={`${id}-${index}`} diagram={DIAGRAMS[id]} uid={`dd-${id}-cmp-${index}`} compact view={index===0?viewA:viewB} onView={next=>{if(sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}} onFit={next=>{if(sync)setBoth(next);else (index===0?setViewA:setViewB)(next)}} expanded={expanded===index} onExpand={on=>setExpanded(on?index:null)}/>)}
        </div>
      </>:<PanZoom key={single.id} diagram={single} uid={`dd-${single.id}`} view={viewA} onView={setViewA} onFit={setViewA} expanded={expanded===single.id} onExpand={on=>setExpanded(on?single.id:null)}/>}
      <aside className="surface dd-side" aria-label="Open validations">
        <h3>Scenarios in this model</h3>
        <ul>{['S1','S2','S3'].map(id=><li key={id}><strong>{id}</strong> {SCENARIOS[id].agent_runtime} · gateway: {SCENARIOS[id].mcp_gateway}</li>)}</ul>
        <h3>Open validations</h3>
        <ul>{OPEN_ITEMS.map(item=><li key={item}>{item}</li>)}</ul>
        <p className="micro">{BANNER}. Vendor-named components are design projections, not connected services.</p>
        <button type="button" className="text-link" onClick={onBack}>Back to complete architecture →</button>
      </aside>
    </div>
  </main>;
}
