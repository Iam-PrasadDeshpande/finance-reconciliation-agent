import React,{useEffect,useState} from 'react';
import './themes.css';
import themesCss from './themes.css?raw';

// SAP Fiori theme names. The application is custom React, not SAPUI5, so these are close approximations built from the
// published theme families (Quartz, Horizon, high contrast), not SAP's own theme libraries.
export const THEMES=[
  {id:'quartz-light',label:'SAP Quartz Light',note:'Default · light'},
  {id:'morning-horizon',label:'SAP Morning Horizon',note:'Light · Horizon brand blue'},
  {id:'quartz-dark',label:'SAP Quartz Dark',note:'Dark'},
  {id:'evening-horizon',label:'SAP Evening Horizon',note:'Dark · Horizon'},
  {id:'hcw',label:'SAP High Contrast White',note:'Accessibility'},
  {id:'hcb',label:'SAP High Contrast Black',note:'Accessibility'},
];
const KEY='finance-cockpit-theme';
function readSaved(){try{const value=window.localStorage.getItem(KEY);return THEMES.some(t=>t.id===value)?value:'quartz-light'}catch{return 'quartz-light'}}
// In the hosted Streamlit page the application's own stylesheet lives in a shadow root or a frame, where a selector on the root element cannot
// match. So the theme rules are also injected into the page document itself (the parent when reachable, otherwise this document) and the
// attribute is set there. The frame's own root is left unthemed when the parent is themed, so nothing is inverted twice.
function pageDocument(){
  try{if(window.parent&&window.parent!==window){void window.parent.document.documentElement;return {doc:window.parent.document,parent:true}}}catch{}
  return {doc:document,parent:false};
}
export function applyTheme(id){
  const {doc,parent}=pageDocument();
  try{
    if(!doc.getElementById('finance-cockpit-themes')){const style=doc.createElement('style');style.id='finance-cockpit-themes';style.textContent=themesCss;doc.head.appendChild(style)}
    doc.documentElement.setAttribute('data-theme',id);
  }catch{}
  try{
    if(parent)document.documentElement.setAttribute('data-theme','hosted');
    document.documentElement.setAttribute('data-theme-choice',id);
  }catch{}
  try{window.localStorage.setItem(KEY,id)}catch{}
}
export default function ThemeSwitch(){
  const [theme,setTheme]=useState(readSaved);
  useEffect(()=>{applyTheme(theme)},[theme]);
  return <label className="theme-switch"><span>Theme</span><select aria-label="SAP Fiori theme" value={theme} onChange={event=>setTheme(event.target.value)}>{THEMES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</select></label>;
}
