import React from 'react';

const LAYERS=[
  ['External agent contract','The agent host, identity and MCP client are named simulator components (the hosts are SAP BTP Cloud Foundry in S1 and AgentCore Runtime in S2 and S3). The local Python runtime follows a bounded plan; no external agent is connected.'],
  ['SAP-owned capability','The SAP finance tool, Apigee gateway, Integration Suite path and backend roles are simulated boundaries. No SAP tenant call or principal propagation is proved.'],
  ['Presentation','The Fiori-inspired interface is built with React and Node.js tooling. Streamlit hosts its compiled assets; Node.js is not an agent in the runtime path.'],
  ['Execution and proof','Python evaluates the finance rules and SQLite stores synthetic snapshots, cases and request/response events. The variance amount comes from the deterministic engine.'],
];

export default function ImplementationEvidence({currentCase,events=[]}){
  return <section className="surface implementation-evidence"><div className="section-heading"><div><span className="eyebrow">IMPLEMENTATION AND VALIDATION BOUNDARY</span><h2>What the external-agent view represents</h2></div><span className="pill simulated">SYNTHETIC</span></div>
    <p className="implementation-intro">The live diagram presents a proposed external agent calling SAP-owned finance capabilities. The runnable demo uses one local simulator process and does not establish deployed gateway, SAP, or identity integration.</p>
    <div className="implementation-grid">{LAYERS.map(([name,detail])=><div key={name}><strong>{name}</strong><p>{detail}</p></div>)}</div>
    <div className="implementation-state"><strong>Current trace</strong><span>{currentCase?.case_id||'No case selected'} · {events.length} stored events</span><span>Simulator runs S1, S2 and S3 · S3 is the preferred candidate to evaluate first · all three remain proposals</span></div>
  </section>;
}
