// Ayarlar sayfasının bölüm şeridi (B181) ve dört gruplu içindekiler (B212). Saf işlev: HTML alır, kimlikli kart + şerit döndürür.
import { L, t as tr } from './i18n.js';
import { esc } from './util.js';

export function withSettingsToc(html) {
  const titles = [];
  let n = 0;
  const out = html.replace(/<(section|div) class="card([^"]*)"([^>]*)>(\s*)<h2>([\s\S]*?)<\/h2>/g, (m, tag, cls, rest, ws, h) => {
    const id = `set-${n++}`;
    const text = h.replace(/<[^>]*>/g, '').replace(/^[^\p{L}]+/u, '').trim();
    titles.push([id, text]);
    return `<${tag} class="card${cls}"${rest} id="${id}">${ws}<h2 tabindex="-1">${h}</h2>`;
  });
  // B212: 16 bölüm düğmesi dört anlamlı grupta (başlık metniyle eşlenir, dil bağımsız); eşleşmeyen "Diğer"e düşer
  const groups = [
    [L("Genel"), [tr('language'), tr('quickPresets'), L("Görünüm profilleri"), L("Güncellemeler"), tr('aionTitle')]],
    [L("Görünüm ve yazı"), [tr('themes'), tr('fontTitle'), tr('customTheme')]],
    [L("Erişilebilirlik"), [tr('appearance'), L("Düzen ve erişilebilirlik")]],
    [L("Veri ve matriks"), [L("Matriks gösterimi"), L("Matriks bölümleri"), L("Birim ve sayı tercihleri"), L("Yüzde referansı"), L("Yalnızca ayarları taşı"), L("Yedekleme")]],
  ];
  const clean = (x) => String(x).replace(/<[^>]*>/g, '').replace(/^[^\p{L}]+/u, '').trim();
  const placed = new Set();
  const chip = ([id, t]) => `<button class="pchip" data-action="settings-jump" data-id="${id}">${esc(t)}</button>`;
  const rows = groups.map(([g, names]) => { const keys = names.map(clean); const items = titles.filter(([id, t]) => !placed.has(id) && keys.includes(t)); items.forEach(([id]) => placed.add(id)); return items.length ? `<div class="toc-group" role="group" aria-label="${esc(g)}"><span class="toc-label" aria-hidden="true">${esc(g)}</span><div class="toc-chips">${items.map(chip).join('')}</div></div>` : ''; });
  const rest = titles.filter(([id]) => !placed.has(id));
  if (rest.length) rows.push(`<div class="toc-group" role="group" aria-label="${L("Diğer")}"><span class="toc-label" aria-hidden="true">${L("Diğer")}</span><div class="toc-chips">${rest.map(chip).join('')}</div></div>`);
  const toc = `<nav class="settings-toc" aria-label="${L("Ayar bölümleri")}">${rows.join('')}</nav>`;
  return out.replace('<p class="hint" id="settings-none"', toc + '<p class="hint" id="settings-none"');
}
