import React from 'react';
import {IDS, PREFERENCE, PREFERENCE_LINE, SCENARIOS} from './mcpScenarios';
import './launchpad.css';

// The owner's stated preference, shown on every architecture view: S1 for SAP-centric agents, S3 for SAP and non-SAP agents,
// S2 kept in the architecture for reference and not preferred. It comes from the canonical model (PREFERENCE), not from this file.
export default function PreferenceBanner() {
  return <aside className="pref-banner" data-testid="preference-banner" aria-label="Architecture preference">
    <span className="eyebrow">ARCHITECTURE PREFERENCE</span>
    <ul>{IDS.map(id => <li key={id} className={`pref ${PREFERENCE[id].label === 'Preferred' ? 'yes' : 'no'}`} data-scenario={id}><b>{id}</b><span className="pref-badge">{PREFERENCE[id].label === 'Preferred' ? 'Preferred' : '✕ Not preferred'}</span><span>{PREFERENCE[id].scope}</span></li>)}</ul>
    <p>{PREFERENCE_LINE}. {PREFERENCE.S3.text}</p>
  </aside>;
}

export const prefTag = id => `${SCENARIOS[id].short} · ${PREFERENCE[id].label.toLowerCase()}`;
