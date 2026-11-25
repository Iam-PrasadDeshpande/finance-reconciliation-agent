// One canonical period contract: selected_period = 'YYYY-MM'. Every screen reads and writes this one value.
export const DEFAULT_PERIOD = '2026-11';
const NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const KEY = 'finance.selected_period';

export const validPeriod = value => /^\d{4}-(0[1-9]|1[0-2])$/.test(value || '');
export const longMonth = period => {
  if (!validPeriod(period)) return 'No period';
  const [year, month] = period.split('-').map(Number);
  return `${NAMES[month - 1][0].toUpperCase()}${NAMES[month - 1].slice(1)} ${year}`;
};
export const shortMonth = period => (validPeriod(period) ? `${longMonth(period).slice(0, 3)} ${period.slice(0, 4)}` : 'Select month');
export const fiscalLabel = period => (validPeriod(period) ? `FY${period.slice(0, 4)} · P${period.slice(5)}` : '');


// Mirrors poc/questions.py mentioned_period: YYYY-MM, or a month name or abbreviation with 2025/2026.
export function mentionedPeriod(text) {
  const lower = String(text || '').toLowerCase();
  const iso = lower.match(/\b(2025|2026)-(0[1-9]|1[0-2])\b/);
  if (iso) return iso[0];
  for (let month = 1; month <= 12; month += 1) {
    const name = NAMES[month - 1];
    const match = lower.match(new RegExp(`\\b(?:${name}|${name.slice(0, 3)})\\s+(2025|2026)\\b`));
    if (match) return `${match[1]}-${String(month).padStart(2, '0')}`;
  }
  return null;
}

// A month or ISO period the user typed that the synthetic history does not cover.
export function explicitOutsideHistory(text) {
  const lower = String(text || '').toLowerCase();
  if (mentionedPeriod(lower)) return null;
  const months = 'january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec';
  const match = lower.match(new RegExp(`\\b(?:20\\d{2}-(?:0[1-9]|1[0-2])|(?:${months})\\s+20\\d{2})\\b`));
  return match ? match[0] : null;
}

export function readInitialPeriod() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('period');
    if (validPeriod(fromUrl)) return fromUrl;
  } catch { /* no URL access */ }
  try {
    const stored = window.sessionStorage.getItem(KEY);
    if (validPeriod(stored)) return stored;
  } catch { /* storage unavailable */ }
  return DEFAULT_PERIOD;
}

export function storePeriod(period) {
  try { window.sessionStorage.setItem(KEY, period); } catch { /* storage unavailable */ }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('period', period);
    window.history.replaceState(null, '', url);
  } catch { /* URL not writable */ }
}
