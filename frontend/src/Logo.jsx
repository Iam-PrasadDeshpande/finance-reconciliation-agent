import React from 'react';

// Demo logo for the Finance Agent: an "F" (the ledger) with a green checked node (the agent that proposes; a person approves).
export default function Logo({size = 34, className = 'brand-logo'}) {
  return <svg className={className} width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Finance Agent logo">
    <defs><linearGradient id="fa-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1a82e8"/><stop offset="1" stopColor="#0a4f9e"/></linearGradient></defs>
    <rect width="64" height="64" rx="14" fill="url(#fa-bg)"/>
    <path d="M18 15h28v7.5H26.5V30H42v7.5H26.5V49H18z" fill="#fff"/>
    <circle cx="46" cy="46" r="9" fill="#2ca75a" stroke="#fff" strokeWidth="3"/>
    <path d="M41.8 46.2l3 3 5.4-6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
