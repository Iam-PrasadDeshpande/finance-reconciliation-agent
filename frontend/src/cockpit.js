// The cockpit knows modules only through their manifests (GET /api/cockpit/modules, also in the boot payload).
// Routing, default requests, examples, tabs and family labels all come from here, so a new agent module needs no UI change.
import {createContext, createElement, useContext} from 'react';
import {longMonth} from './period';

export function buildCockpit(modules = []) {
  const list = modules || [];
  const byId = Object.fromEntries(list.map(m => [m.id, m]));
  const def = list.find(m => m.default) || list[0] || null;
  const matchers = list.filter(m => m.routing?.words?.length).map(m => ({id: m.id, priority: m.routing.priority, re: new RegExp(`\\b(${m.routing.words.join('|')})\\b`)}));
  const fill = (template, period) => String(template || '').replace('{period}', longMonth(period));
  // same rule as poc/cockpit.py route(): highest priority among modules whose words appear, else the default module
  const route = text => {
    const lower = String(text || '').toLowerCase();
    const hits = matchers.filter(m => m.re.test(lower));
    if (!hits.length) return def?.id || 'reconciliation';
    return hits.reduce((best, m) => (m.priority > best.priority ? m : best)).id;
  };
  return {
    modules: list, byId, def, route,
    ask: (id, period) => fill((byId[id] || def)?.ask_template, period),
    examples: (id, period) => ((byId[id] || def)?.examples || []).map(t => fill(t, period)),
    label: id => byId[id]?.family_label || id || '',
    name: id => byId[id]?.name || id || '',
    tabs: list.filter(m => m.tab),
  };
}

const Context = createContext(null);
export const CockpitContext = Context;
export const CockpitProvider = ({value, children}) => createElement(Context.Provider, {value}, children);
export const useCockpit = () => useContext(Context) || buildCockpit([]);
