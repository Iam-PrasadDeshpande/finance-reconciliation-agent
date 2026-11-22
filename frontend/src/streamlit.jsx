import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './style.css';
import './branches.css';

const roots=new WeakMap();
export default function financeArchitecture(component){
  const {parentElement,data,setTriggerValue}=component;
  const mount=parentElement.querySelector('.finance-root');
  if(!mount)throw new Error('Missing finance component mount');
  let root=roots.get(parentElement);
  if(!root){root=createRoot(mount);roots.set(parentElement,root)}
  root.render(<App bridge={{data:data||{},action:(payload)=>setTriggerValue('action',payload)}}/>);
  return ()=>{const current=roots.get(parentElement);if(current){current.unmount();roots.delete(parentElement)}};
}
