import { COLOR_LABELS, normalizeColors, accentText, themeTextContrast } from './theme.js';
import { esc, fmtNum } from './util.js';

export const COLOR_PALETTE = ['#ffffff', '#f7f7fb', '#f6efe0', '#14161f', '#000000', '#6b4de6', '#8ad1ff', '#2e8a4a', '#e0569b', '#a8572a', '#ffd400', '#c62d42'];
export function themePreview(colors) {
  const c = normalizeColors(colors);
  return `<div class="theme-preview" style="background:${c.bg};color:${c.fg};border-color:${c.line}">
    <div style="background:${c.card};border:1px solid ${c.line};padding:.8rem;border-radius:var(--radius)"><b>İı Şş Ğğ · Kendi matriksim</b><p style="color:${c.muted}">İkincil yazı · 100 g · kaynak bilgisi</p><span style="background:${c.card2};padding:.4rem;display:inline-block">İkincil yüzey</span> <span style="background:${c.accent};color:${accentText(c.accent)};padding:.4rem;display:inline-block">Seçili düğme</span></div>
  </div>`;
}
export function renderThemeEditor(editor, colors) {
  if (!editor || !COLOR_LABELS[editor.key]) return '';
  const c = normalizeColors({ ...colors, [editor.key]: editor.color });
  const min = themeTextContrast(c);
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="Renk seçimi"><div class="modal-box color-editor">
    <div class="modal-h"><h2>Renk seç · ${esc(COLOR_LABELS[editor.key])}</h2><button class="btn ghost" data-action="theme-color-close">Vazgeç</button></div>
    <p>Hazır renge dokun veya renk alanını aç. Değişiklik yalnız “Rengi kaydet” ile temana yazılır.</p>
    <div class="color-palette" role="group" aria-label="Hazır renkler">${COLOR_PALETTE.map(color => `<button class="color-swatch" data-action="theme-color-preset" data-color="${color}" aria-label="Renk ${color}" style="background:${color};color:${accentText(color)}">${color}</button>`).join('')}</div>
    <label class="field" for="theme-color-picker">Renk alanını aç<input type="color" id="theme-color-picker" value="${c[editor.key]}"></label>
    <label class="field" for="theme-color-hex">HEX renk kodu<input id="theme-color-hex" value="${c[editor.key]}" maxlength="7" spellcheck="false" pattern="#[a-fA-F0-9]{6}" aria-describedby="theme-color-help"></label>
    <p id="theme-color-help" class="hint"># ile başlayan altı haneli kod. Örnek: #6b4de6.</p>
    <div id="theme-editor-preview">${themePreview(c)}</div>
    <p class="hint" role="status" id="theme-editor-contrast">En düşük metin kontrastı: ${fmtNum(min)}:1. ${min < 4.5 ? 'Normal metin için 4,5:1 eşiğinin altında; yazı veya zemin rengini değiştir.' : 'Önizlemedeki metin çiftleri AA eşiğini karşılıyor.'}</p>
    <button class="btn primary" data-action="theme-color-save">Rengi kaydet</button>
  </div></div>`;
}
