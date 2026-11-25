import React,{useEffect,useMemo,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import {diagramSvg,diagramSpec,BANNER} from './mcpScenarios';
import './architecture-diagram.css';

// Modal viewer for one generated architecture diagram (D1..D10) with the shared zoom, pan, fit, expand and export controls.
export default function ArchitectureDiagram({diagramKey,onClose,onDetails}){
  const spec=diagramSpec(diagramKey);
  const [view,setView]=useState(null),[expanded,setExpanded]=useState(false);
  const vector=useMemo(()=>spec?{id:`modal-${diagramKey}`,title:spec.title,svg:diagramSvg(diagramKey),file:`architecture-${diagramKey.toLowerCase()}`,png:true}:null,[spec,diagramKey]);
  useEffect(()=>{const close=event=>{if(event.key==='Escape')onClose()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[onClose]);
  if(!spec)return null;
  return <div className="arch-diagram-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section className="surface arch-diagram-modal" role="dialog" aria-modal="true" aria-label={`${spec.title} architecture diagram`}>
    <header className="arch-diagram-header"><div><span className="eyebrow">ARCHITECTURE DIAGRAM · {diagramKey}</span><h2>{spec.title}</h2></div><div><span className="pill warn">PROPOSED · NOT APPROVED</span><button type="button" onClick={onClose} autoFocus>Close</button></div></header>
    <div className="arch-diagram-viewer"><PanZoom diagram={vector} uid={`arch-${diagramKey}`} view={view} onView={setView} onFit={setView} expanded={expanded} onExpand={setExpanded}/></div>
    <footer className="arch-diagram-footer"><p><strong>Note:</strong> {spec.footer} {BANNER}.</p><div>{onDetails&&<button type="button" onClick={onDetails}>View details →</button>}</div></footer>
  </section></div>;
}
