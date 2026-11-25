import React,{useEffect,useRef,useState} from 'react';
import {explicitOutsideHistory,fiscalLabel,longMonth,mentionedPeriod,shortMonth} from './period';
import {useCockpit} from './cockpit';
import './period.css';

export function PeriodSelect({period,periods,onPeriod,label='Period',id}){
  const list=periods?.length?periods:[period];
  const options=list.includes(period)?list:[period,...list];
  return <label className="period-select"><span>{label}</span><select id={id} value={period} onChange={event=>onPeriod(event.target.value)} aria-label={label}>{options.map(item=><option key={item} value={item}>{shortMonth(item)} · {fiscalLabel(item)}{list.includes(item)?'':' · no data'}</option>)}</select></label>;
}

// Shows which period a request will use before it runs. An explicit period in the text wins for that request.
export function EffectivePeriod({text,period,periods}){
  const mentioned=mentionedPeriod(text);
  const outside=explicitOutsideHistory(text);
  const effective=mentioned||period;
  if(outside)return <span className="period-effective bad" role="status">NO DATA AVAILABLE FOR {outside.toUpperCase()}</span>;
  const noData=periods?.length&&!periods.includes(effective);
  if(noData)return <span className="period-effective bad" role="status">NO DATA AVAILABLE FOR {longMonth(effective).toUpperCase()}</span>;
  return <span className="period-effective" role="status">Effective period: <b>{longMonth(effective)}</b><em>{mentioned?(mentioned===period?'selector and request agree':'taken from your request'):'taken from the selector'}</em></span>;
}

// Request text follows the selected period until the person edits it.
export function useAskText(period,domain){
  const cockpit=useCockpit();
  const [edited,setEdited]=useState(null);
  const last=useRef({period,domain});
  // reset the text only when the period or module really changed, never on mount: a fast typist (or a busy machine) must not lose what was typed
  useEffect(()=>{if(last.current.period!==period||last.current.domain!==domain){last.current={period,domain};setEdited(null)}},[period,domain]);
  return [edited??cockpit.ask(domain,period),setEdited];
}

// Shows which agent family a request will go to, before it runs.
export function RouteChip({text}){
  const cockpit=useCockpit();
  const domain=cockpit.route(text);
  return <span className={`route-chip ${domain}`} data-testid="route-chip" data-domain={domain}>Routed to <b>{cockpit.label(domain)}</b></span>;
}

export function ProvenanceStrip({provenance,compact}){
  const p=provenance||{data_source:'SYNTHETIC / DEMONSTRATION',sap_access:'NOT CONNECTED / NOT VERIFIED',execution_mode:'READ-ONLY PROPOSED WORKFLOW'};
  return <div className={`provenance ${compact?'compact':''}`} role="group" aria-label="Data source and SAP access"><span><i>DATA SOURCE</i><b>{p.data_source}</b></span><span><i>SAP ACCESS</i><b>{p.sap_access}</b></span><span><i>EXECUTION MODE</i><b>{p.execution_mode}</b></span></div>;
}
