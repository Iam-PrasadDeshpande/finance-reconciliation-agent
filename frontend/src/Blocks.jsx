import React from 'react';
import './blocks.css';

const int = value => Number(value || 0).toLocaleString('en-US');
const signed = value => `${Number(value) > 0 ? '+' : Number(value) < 0 ? '−' : ''}${int(Math.abs(Number(value || 0)))}`;

function cell(column, row) {
  const value = row[column.key];
  if (column.tones) return <span className={`blk-chip ${column.tones[value] || ''}`}>{(column.words && column.words[value]) || value}</span>;
  if (column.format === 'int') return int(value);
  if (column.format === 'signed') return signed(value);
  return value ?? '';
}

function hit(rule, row) {
  if (!rule) return false;
  if (rule.equals !== undefined) return row[rule.key] === rule.equals;
  if (rule.notequals !== undefined) return row[rule.key] !== rule.notequals;
  return false;
}

// Declarative blocks (kpis, table, list, note): what a module returns for its Level 1 view and for a plan's result.
export function Blocks({blocks = []}) {
  return <div className="blk-stack">{blocks.map((block, index) => {
    if (block.type === 'kpis') return <div className="blk-kpis" key={index}>{block.items.map(item => <div key={item.label} className={item.tone || ''}><span>{item.label}</span><strong>{item.value}</strong>{item.note && <small>{item.note}</small>}</div>)}</div>;
    if (block.type === 'table') return <section key={index} className="blk-table">{block.title && <h4>{block.title}</h4>}<div className="blk-scroll"><table><thead><tr>{block.columns.map(c => <th key={c.key} className={c.align === 'right' ? 'num' : ''}>{c.label}</th>)}</tr></thead>
      <tbody>{block.rows.map((row, i) => <tr key={i} className={hit(block.highlight, row) ? 'hl' : ''}>{block.columns.map(c => <td key={c.key} className={c.align === 'right' ? 'num' : ''}>{cell(c, row)}</td>)}</tr>)}</tbody></table></div></section>;
    if (block.type === 'list') return <section key={index} className="blk-list">{block.title && <h4>{block.title}</h4>}<ul>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ul></section>;
    if (block.type === 'note') return <p key={index} className={`blk-note ${block.tone || ''}`}>{block.text}</p>;
    return null;
  })}</div>;
}
