export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Türkçe duyarsız arama anahtarı
export function norm(s) {
  return String(s || '')
    .replace(/İ/g, 'i').replace(/I/g, 'ı')
    .toLocaleLowerCase('tr')
    .replace(/[ıi]/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[âàá]/g, 'a').replace(/[îí]/g, 'i').replace(/[ûú]/g, 'u')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const fmtCache = new Map();
function nf(min, max) {
  const k = min + ':' + max;
  if (!fmtCache.has(k)) fmtCache.set(k, new Intl.NumberFormat('tr-TR', { minimumFractionDigits: min, maximumFractionDigits: max }));
  return fmtCache.get(k);
}

// Uyarlanabilir hassasiyet: büyük değerler tam, küçük değerler 3 anlamlı basamak
export function fmtNum(x, precision = 'normal') {
  if (x == null || Number.isNaN(x)) return '–';
  if (x === 0) return '0';
  const a = Math.abs(x);
  const extra = precision === 'high' ? 1 : precision === 'low' ? -1 : 0;
  let d;
  if (a >= 1000) d = 0;
  else if (a >= 100) d = Math.max(0, 0 + extra);
  else if (a >= 10) d = Math.max(0, 1 + extra);
  else if (a >= 1) d = Math.max(0, 2 + extra);
  else d = Math.min(6, Math.max(1, Math.ceil(-Math.log10(a)) + 1 + extra));
  return nf(0, d).format(x);
}

// Büyük değerlerde birimi yükselt (15 000 mg -> 15 g)
export function fmtAmount(x, unit, precision) {
  if (x == null) return { n: '–', u: unit };
  let v = x, u = unit;
  if (u === 'µg' && Math.abs(v) >= 10000) { v /= 1000; u = 'mg'; }
  if (u === 'mg' && Math.abs(v) >= 10000) { v /= 1000; u = 'g'; }
  if (u === 'g' && Math.abs(v) >= 10000) { v /= 1000; u = 'kg'; }
  return { n: fmtNum(v, precision), u };
}

export const fmtPct = (x) => (x == null ? '–' : x >= 10 ? Math.round(x) + '%' : nf(0, 1).format(x) + '%');

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function clamp(x, lo, hi) { return Math.min(hi, Math.max(lo, x)); }

export function download(name, text, type = 'application/json') {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
