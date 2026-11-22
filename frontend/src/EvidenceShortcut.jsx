import React from 'react';

export default function EvidenceShortcut({investigation,onOpen}){
  const diagnosis=investigation?.diagnosis?.classification?.replaceAll('_',' ');
  return <section className="surface evidence-shortcut"><div><span className="eyebrow">EVIDENCE & CORRELATION</span><strong>{investigation?`${diagnosis||'Investigation in progress'} · ${investigation.status.replaceAll('_',' ')}`:'Trace the agent’s proof'}</strong><small>{investigation?`${investigation.proof?.length||0} evidence items · ${investigation.plan?.filter(step=>step.status==='complete').length||0} plan steps complete`:'Document comparison, decisions, source lineage and component events'}</small></div><button type="button" className="text-link" onClick={onOpen}>Open proof & correlation →</button></section>;
}
