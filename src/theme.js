export const DEFAULT_COLORS = { bg: '#f7f7fb', fg: '#1e2233', card: '#ffffff', accent: '#6b4de6' };
export function normalizeColors(colors) {
  return Object.fromEntries(Object.entries(DEFAULT_COLORS).map(([k, v]) => [k, typeof colors?.[k] === 'string' && /^#[a-f0-9]{6}$/i.test(colors[k]) ? colors[k] : v]));
}
const luminance = hex => {
  const [r, g, b] = hex.slice(1).match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return .2126 * r + .7152 * g + .0722 * b;
};
export function contrastRatio(a, b) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
export function accentText(accent) { return contrastRatio(accent, '#ffffff') >= contrastRatio(accent, '#000000') ? '#ffffff' : '#000000'; }
export function exportTheme(colors) { return JSON.stringify({ app: 'besin-matriksi-tema', version: 1, colors: normalizeColors(colors) }, null, 2); }
export function parseTheme(text) {
  const p = JSON.parse(text);
  if (p?.app !== 'besin-matriksi-tema' || p.version !== 1 || !p.colors || Object.keys(DEFAULT_COLORS).some(k => !/^#[a-f0-9]{6}$/i.test(p.colors[k]))) throw new Error('Geçerli bir Besin Matriksi tema dosyası değil.');
  return normalizeColors(p.colors);
}
