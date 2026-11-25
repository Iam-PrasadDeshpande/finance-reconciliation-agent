import React from 'react';
import {ProvenanceStrip} from './PeriodUi';
import {fiscalLabel,longMonth} from './period';
import './treasury.css';

export const fmt = value => Number(value || 0).toLocaleString('en-US');
export const signedFmt = value => `${Number(value) > 0 ? '+' : Number(value) < 0 ? '−' : ''}${fmt(Math.abs(Number(value || 0)))}`;
export const STATUS_TEXT = {DEFICIT: 'Deficit', IDLE_CASH: 'Idle cash', WITHIN_POLICY: 'Within policy'};
export const STATUS_TONE = {DEFICIT: 'bad', IDLE_CASH: 'warn', WITHIN_POLICY: 'ok'};
export const Chip = ({status}) => <span className={`tr-chip ${STATUS_TONE[status] || ''}`}>{STATUS_TEXT[status] || status}</span>;

export function Sparkline({series, minimum, label}) {
  if (!series?.length) return null;
  const values = series.map(point => point.balance);
  const lo = Math.min(...values, minimum ?? Infinity) * 0.98;
  const hi = Math.max(...values) * 1.02;
  const W = 320, H = 96, pad = 6;
  const x = index => pad + (W - 2 * pad) * (index / Math.max(1, series.length - 1));
  const y = value => pad + (H - 2 * pad) * (1 - (value - lo) / Math.max(1, hi - lo));
  const path = series.map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${y(point.balance).toFixed(1)}`).join(' ');
  return <svg className="tr-spark" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
    {minimum ? <line x1={pad} x2={W - pad} y1={y(minimum)} y2={y(minimum)} stroke="#BB0000" strokeDasharray="4 3" strokeWidth="1"/> : null}
    <path d={`${path} L${x(series.length - 1)},${H - pad} L${x(0)},${H - pad} Z`} fill="#0a6ed122"/>
    <path d={path} fill="none" stroke="#0a6ed1" strokeWidth="2"/>
    <text x={pad} y={H - 1} fontSize="9" fill="#587184">{series[0].date.slice(5)}</text>
    <text x={W - pad} y={H - 1} fontSize="9" fill="#587184" textAnchor="end">{series[series.length - 1].date.slice(5)}</text>
  </svg>;
}

export default function TreasuryCockpit({period, data, state, role, onRole, onOpenDetail, onDecision, onAsk}) {
  if (state === 'none') return <main className="treasury-page"><div className="period-nodata" role="alert" data-testid="treasury-nodata">NO DATA AVAILABLE FOR {longMonth(period).toUpperCase()}</div></main>;
  if (!data) return <main className="treasury-page"><div className="empty-state" role="status"><strong>Loading {longMonth(period)}…</strong></div></main>;
  const pos = data.position, t = pos.totals, fc = data.forecast['30'], recs = data.recommendations;
  const breaches = pos.policy_checks.filter(c => c.status === 'BREACH');
  const proposals = Object.fromEntries((data.proposals || []).map(item => [item.proposal_id, item]));
  const usdMin = fc.by_currency.reduce((sum, c) => sum + Math.round(c.minimum_required * (pos.fx[c.ccy] || 1)), 0);
  const firstShort = fc.by_currency.filter(c => c.first_shortfall);
  return <main className="treasury-page" aria-label="Cash and treasury" data-testid="treasury-page" data-period={pos.period}>
    <section className="surface tr-head">
      <div><span className="eyebrow">FINANCE / CASH &amp; TREASURY</span><h2>Cash &amp; treasury</h2>
        <p className="tr-sub">Daily cash positioning as of <b>{pos.as_of}</b> · {longMonth(period)} · {fiscalLabel(period)} · display currency {pos.display_currency}, rate type {pos.exchange_rate_type}</p></div>
      <div className="tr-head-actions"><ProvenanceStrip provenance={pos.provenance} compact/><div className="tr-buttons"><button type="button" className="primary" onClick={() => onOpenDetail('position')}>Open detailed cash &amp; treasury view →</button><button type="button" onClick={() => onAsk('Propose transfers to cover shortfalls')}>Ask the treasury agents</button></div></div>
    </section>
    <section className="tr-kpis" aria-label="Key figures">
      <div data-testid="kpi-cash"><span>Group cash (USD equivalent)</span><strong>{fmt(t.usd_opening)}</strong><small>{t.accounts} accounts · {Object.keys(t.by_currency).join(' · ')}</small></div>
      <div className={t.deficit ? 'attn' : ''} data-testid="kpi-deficit"><span>Deficit accounts</span><strong>{t.deficit}</strong><small>expected close below minimum</small></div>
      <div className={t.idle ? 'warn' : ''} data-testid="kpi-idle"><span>Idle-cash accounts</span><strong>{t.idle}</strong><small>above 1.5 × target</small></div>
      <div className={breaches.length ? 'attn' : ''} data-testid="kpi-policy"><span>Policy rules breached</span><strong>{breaches.length} of {pos.policy_checks.length}</strong><small>{breaches.map(c => c.rule).join(' · ') || 'none'}</small></div>
      <div className={pos.statements.ready ? '' : 'warn'} data-testid="kpi-statements"><span>Bank statements</span><strong>{pos.statements.complete} of {pos.statements.expected}</strong><small>{pos.statements.opening_mismatches.length} opening-balance mismatch(es)</small></div>
      <div className={fc.shortfall ? 'warn' : ''} data-testid="kpi-forecast"><span>30-day forecast</span><strong>{firstShort.length ? 'Shortfall' : 'No shortfall'}</strong><small>{firstShort.length ? firstShort.map(c => `${c.ccy} ${c.first_shortfall.date.slice(5)}`).join(' · ') : 'all currencies above minimum'}</small></div>
    </section>
    <div className="tr-grid">
      <section className="surface tr-card" aria-label="Bank accounts"><h3>Bank accounts · opening balance and expected close</h3>
        <div className="tr-scroll"><table className="tr-table" data-testid="treasury-accounts"><thead><tr><th>Account</th><th>Bank</th><th>Ccy</th><th className="num">Opening</th><th className="num">Expected close</th><th className="num">Minimum</th><th>Status</th><th>Statement</th></tr></thead>
          <tbody>{pos.accounts.map(a => <tr key={a.id} className={a.status === 'DEFICIT' ? 'hl' : ''}><td><b>{a.id}</b> <small>{a.kind}</small></td><td>{a.bank_name}</td><td>{a.ccy}</td><td className="num">{fmt(a.opening)}</td><td className="num">{fmt(a.expected_closing)}</td><td className="num">{fmt(a.min)}</td><td><Chip status={a.status}/></td>
            <td>{a.statement.complete && a.statement.opening_check === 'OK' ? <span className="tr-ok">OK</span> : <span className="tr-flag" title={`${a.statement.complete ? '' : `Statement ${a.statement.gap_days} business days old. `}${a.statement.opening_check === 'OK' ? '' : `Opening differs from prior closing by ${signedFmt(a.statement.opening_difference)}`}`}>{a.statement.complete ? 'Opening mismatch' : 'Missing'}</span>}</td></tr>)}</tbody></table></div></section>
      <div className="tr-side">
        <section className="surface tr-card" aria-label="Liquidity forecast"><h3>30-day liquidity (USD equivalent)</h3><Sparkline series={fc.usd_series} minimum={usdMin} label="Projected group cash for the next 30 days"/>
          <p className="tr-note">{firstShort.length ? `First shortfall: ${firstShort.map(c => `${c.ccy} on ${c.first_shortfall.date}`).join('; ')}. ` : 'No currency falls below the sum of its account minimums. '}Dashed line is the minimum.</p></section>
        <section className="surface tr-card" aria-label="Transfer recommendations"><h3>Transfer recommendations</h3>
          {recs.recommendations.length ? <ul className="tr-recs" data-testid="treasury-recs">{recs.recommendations.map(r => { const saved = proposals[r.proposal_id]; return <li key={r.proposal_id}><div><b>{fmt(r.amount)} {r.ccy}</b> {r.from_account} → {r.to_account} <small>({r.template} · {r.template_name})</small></div><small>{r.reason}</small>{r.caveat && <small className="tr-caveat">{r.caveat}</small>}
            <div className="tr-rec-actions">{saved ? <><span className={`tr-chip ${saved.status === 'approved_marker' ? 'ok' : saved.status === 'rejected' ? 'bad' : 'warn'}`}>{saved.status.replace('_', ' ')}</span>
              {saved.status === 'awaiting_approval' && <><button type="button" disabled={role !== 'approver'} onClick={() => onDecision(saved, true)}>Approve (marker)</button><button type="button" disabled={role !== 'approver'} onClick={() => onDecision(saved, false)}>Reject</button></>}</> : <button type="button" onClick={() => onAsk('Propose transfers to cover shortfalls')}>Ask the agents to draft it</button>}</div></li>; })}</ul> : <p className="tr-note">No deficit that a transfer template can fund.</p>}
          {recs.unfunded.length > 0 && <p className="tr-caveat" data-testid="treasury-unfunded">Not covered by any template: {recs.unfunded.map(u => `${u.account} (${fmt(u.remaining)} ${u.ccy})`).join(', ')}. A person must decide.</p>}
          <label className="tr-role">Demo role <select value={role} onChange={event => onRole(event.target.value)}><option value="maker">Finance maker</option><option value="approver">Finance approver</option></select></label>
          <p className="tr-note">Approval records a local synthetic marker only. No bank transfer is initiated and SAP is not changed.</p></section>
        <section className="surface tr-card" aria-label="Bank concentration"><h3>Bank concentration · limit {pos.policy.concentration_limit_pct}%</h3>
          <ul className="tr-bars">{pos.banks.map(b => <li key={b.bank} className={b.share_pct > pos.policy.concentration_limit_pct ? 'over' : ''}><span>{b.name}</span><i style={{width: `${Math.min(100, b.share_pct)}%`}}/><b>{b.share_pct}%</b></li>)}</ul></section>
      </div>
    </div>
  </main>;
}
