import React from 'react';
import {Blocks} from './Blocks';
import './launchpad.css';

// The workflow of a module that has one (review, approve, post, reconcile). The module returns declarative blocks; the shell draws them,
// reports a click on a button, and the module's action (checked by the backend) decides. The role switch is the demo's maker and approver.
export default function WorkflowPanel({module, view, role = 'maker', onRole, onAction, error}) {
  const ui = view?.ui;
  if (!ui) return null;
  return <section className="surface fi-workflow" aria-label={ui.title} data-testid="workflow-panel" data-module={module.id}>
    <header>
      <div><span className="eyebrow">WORKFLOW · {module.name.toUpperCase()}</span><h3>{ui.title}</h3><p>{ui.subtitle}</p></div>
      <div className="fi-role" role="group" aria-label="Demo role"><button type="button" aria-pressed={role === 'maker'} onClick={() => onRole?.('maker')}>Preparer</button><button type="button" aria-pressed={role === 'approver'} onClick={() => onRole?.('approver')}>Finance approver</button></div>
    </header>
    {error && <p className="blk-note bad" role="alert" data-testid="workflow-error">{error}</p>}
    <Blocks blocks={ui.blocks} onAction={item => onAction?.(module.id, item)}/>
  </section>;
}
