import React from 'react';
import {Blocks} from './Blocks';
import {ProvenanceStrip} from './PeriodUi';
import {fiscalLabel, longMonth} from './period';
import './blocks.css';

// Level 1 screen for any module that has no custom renderer: it draws the 'ui' blocks the module's view() returned.
export default function GenericModuleView({module, period, view, state, onAsk}) {
  if (state === 'none') return <main className="module-page"><div className="period-nodata" role="alert" data-testid="module-nodata">NO DATA AVAILABLE FOR {longMonth(period).toUpperCase()}</div></main>;
  if (!view) return <main className="module-page"><div className="empty-state" role="status"><strong>Loading {longMonth(period)}…</strong></div></main>;
  const ui = view.ui || {title: module.name, blocks: []};
  return <main className="module-page" aria-label={module.name} data-testid="module-page" data-module={module.id} data-period={view.period}>
    <section className="surface module-head"><div><span className="eyebrow">{module.name.toUpperCase()}</span><h2>{ui.title}</h2><p>{ui.subtitle} · {longMonth(period)} · {fiscalLabel(period)}</p></div>
      <div className="tr-head-actions"><ProvenanceStrip provenance={view.provenance} compact/>{module.examples?.length > 0 && <div className="tr-buttons"><button type="button" className="primary" onClick={() => onAsk(module.ask_template.replace('{period}', longMonth(period)))}>Ask this agent</button></div>}</div></section>
    <section className="surface module-body"><Blocks blocks={ui.blocks}/></section>
  </main>;
}
