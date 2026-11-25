import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './style.css';
import './branches.css';
import './questions.css';
import './fiori.css';

const roots=new WeakMap();

// Streamlit keeps only the latest trigger value, so two actions sent before a rerun finishes lose one. Actions are therefore sent one at a
// time: the next goes out only after the server has acknowledged the previous (data.action_seq), and a newer period selection replaces an
// older one still waiting. A 12 second timeout means a lost acknowledgement can never block the queue.
let queue=[],inflight=null,sendTrigger=null,nextSeq=0;
function pump(){
  if(inflight||!queue.length||!sendTrigger)return;
  inflight=queue.shift();
  const current=inflight;
  sendTrigger('action',{...current.payload,_seq:current.seq});
  current.timer=setTimeout(()=>{if(inflight===current){inflight=null;pump()}},12000);
}
function enqueue(payload){
  if(payload?.type==='select_period')queue=queue.filter(item=>item.payload.type!=='select_period');
  queue.push({payload,seq:++nextSeq});
  pump();
}
function acknowledge(ack){
  if(inflight&&typeof ack==='number'&&ack>=inflight.seq){clearTimeout(inflight.timer);inflight=null;pump()}
}
export default function financeArchitecture(component){
  const {parentElement,data,setTriggerValue}=component;
  const mount=parentElement.querySelector('.finance-root');
  if(!mount)throw new Error('Missing finance component mount');
  let root=roots.get(parentElement);
  if(!root){root=createRoot(mount);roots.set(parentElement,root)}
  sendTrigger=setTriggerValue;
  acknowledge(data?.action_seq);
  root.render(<App bridge={{data:data||{},action:enqueue}}/>);
  return ()=>{const current=roots.get(parentElement);if(current){current.unmount();roots.delete(parentElement)}};
}
