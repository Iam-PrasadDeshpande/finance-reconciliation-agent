import React,{useEffect,useMemo,useState} from 'react';
import {PanZoom} from './DetailedDiagrams';
import {landscapeSvg} from './landscapeDiagrams';
import './architecture-diagram.css';
import {MCP,HOSTING} from './landscapeData';

export default function ArchitectureDiagram({kind,id,onClose,onDetails}){
  const diagram=(kind==='mcp'?MCP:HOSTING)[id];
  const [view,setView]=useState(null),[expanded,setExpanded]=useState(false);
  const vector=useMemo(()=>diagram?{id:`${kind}-${id}`,title:diagram.title,svg:landscapeSvg(kind,id),file:`landscape-${kind}-${id}`,png:true}:null,[diagram,kind,id]);
  useEffect(()=>{const close=event=>{if(event.key==='Escape')onClose()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[onClose]);
  if(!diagram)return null;
  return <div className="arch-diagram-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}><section className="surface arch-diagram-modal" role="dialog" aria-modal="true" aria-label={`${diagram.title} architecture diagram`}>
    <header className="arch-diagram-header"><div><span className="eyebrow">ARCHITECTURE DIAGRAM · {kind==='mcp'?'MCP HOSTING PATH':'AGENT HOSTING PATH'}</span><h2>{diagram.title}</h2></div><div><span className="pill warn">{diagram.status}</span><button type="button" onClick={onClose} autoFocus>Close</button></div></header>
    <div className="arch-diagram-viewer"><PanZoom diagram={vector} uid={`arch-${kind}-${id}`} view={view} onView={setView} onFit={setView} expanded={expanded} onExpand={setExpanded}/></div>
    <footer className="arch-diagram-footer"><p><strong>Open decision:</strong> {diagram.decision}</p><div><a href={diagram.source} target="_blank" rel="noreferrer">Vendor reference ↗</a>{onDetails&&<button type="button" onClick={onDetails}>View detailed prerequisites →</button>}</div></footer>
  </section></div>;
}
