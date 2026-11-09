export const COLOR_LABELS = { bg: 'Arka plan', fg: 'Yazı', card: 'Kart', accent: 'Vurgu', card2: 'İkincil yüzey', muted: 'İkincil yazı', line: 'Kenarlık' };
export const DEFAULT_COLORS = { bg: '#f7f7fb', fg: '#1e2233', card: '#ffffff', accent: '#6b4de6', card2: '#f0f1f8', muted: '#626a85', line: '#dfe2ee' };
export const validColor = value => typeof value === 'string' && /^#[a-f0-9]{6}$/i.test(value);
export function normalizeColors(colors) {
  const out = Object.fromEntries(Object.entries(DEFAULT_COLORS).map(([k, v]) => [k, validColor(colors?.[k]) ? colors[k] : v]));
  // Dört renkli eski özel temanın görünümünü yeni alanlar yüzünden değiştirme.
  if (colors && typeof colors === 'object') for (const [k, base] of Object.entries({ card2: 'bg', muted: 'fg', line: 'fg' })) {
    if (!validColor(colors[k])) out[k] = out[base];
  }
  return out;
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
export function themeTextContrast(colors) {
  const c = normalizeColors(colors);
  return Math.min(...['fg', 'muted'].flatMap(text => ['bg', 'card', 'card2'].map(bg => contrastRatio(c[text], c[bg]))));
}
export function exportTheme(colors) { return JSON.stringify({ app: 'besin-matriksi-tema', version: 2, colors: normalizeColors(colors) }, null, 2); }
export function parseTheme(text) {
  const p = JSON.parse(text);
  const keys = p?.version === 1 ? ['bg', 'fg', 'card', 'accent'] : Object.keys(DEFAULT_COLORS);
  if (p?.app !== 'besin-matriksi-tema' || ![1, 2].includes(p.version) || !p.colors || keys.some(k => !validColor(p.colors[k]))) throw new Error('Geçerli bir Besin Matriksi tema dosyası değil.');
  return normalizeColors(p.colors);
}
