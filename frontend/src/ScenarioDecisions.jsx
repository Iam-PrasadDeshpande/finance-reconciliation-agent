import React from 'react';
import {SCENARIOS,IDS} from './mcpScenarios';

// The independent decisions that make up a scenario, one row each. Hosting and registration are separate rows on purpose:
// choosing where an agent or MCP is registered never decides where it runs.
export const DECISION_ROWS=[
  ['Agent hosting and execution','agent_runtime','Where the agent runs'],
  ['Agent registration and discovery','agent_registry','Where the agent is catalogued'],
  ['MCP implementation hosting','custom_mcp_runtime','Only where custom MCP code is needed'],
  ['MCP registration and discovery','mcp_registry','Where the MCP server is catalogued'],
  ['MCP gateway / exposure','mcp_gateway','Who exposes and governs the tools'],
  ['LLM gateway','llm_gateway','Model access, independent of the rest'],
];
const open=text=>/pending|TBD|unresolved/i.test(text);

export default function ScenarioDecisions({focus=IDS,title='The independent decisions in each scenario',rows=DECISION_ROWS}){
  return <section className="surface sd-strip" data-testid="decision-strip" aria-label={title}>
    <div className="sd-head"><span className="eyebrow">{title.toUpperCase()}</span><span className="micro">Registration never decides hosting: AWS Agent Registry (S3) does not move the agent to AWS.</span></div>
    <div className="mg-scroll"><table className="mg-table sd-table"><thead><tr><th scope="col">Decision</th>{IDS.map(id=><th scope="col" key={id} className={focus.includes(id)?'sel':''}>{SCENARIOS[id].name}</th>)}</tr></thead>
      <tbody>{rows.map(([label,field,hint])=><tr key={field}><th scope="row">{label}<small>{hint}</small></th>{IDS.map(id=><td key={id} className={`${focus.includes(id)?'sel':''} ${open(SCENARIOS[id][field])?'mg-open':''}`}>{SCENARIOS[id][field]}</td>)}</tr>)}</tbody></table></div>
  </section>;
}
