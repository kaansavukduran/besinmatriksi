// B201: Kıyasla özet grafiği. Her satır bir besin değeri; çubuklar o satırdaki en yüksek değere göre (birimler farklı olduğundan tek eksen yok).
// Ölçülmemiş değer çubuk çizilmez, "veri yok" yazılır (asla 0 gibi gösterilmez). Renk besinin sırasını izler; ad ve değer her zaman yazılı.
import { L } from './i18n.js';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function compareChart(foods, rows, fmt = (x, unit) => `${x} ${unit}`) {
  if (foods.length < 2) return '';
  const legend = `<ul class="cc-legend">${foods.map((f, i) => `<li><i class="cc-sw s${i + 1}" aria-hidden="true"></i>${esc(f.name)}${f.form ? ` <span class="muted">${esc(f.form)}</span>` : ''}</li>`).join('')}</ul>`;
  const body = rows.map(({ key, label, unit }) => {
    const vals = foods.map((f) => f.v[key] ?? null);
    const known = vals.filter((x) => x != null);
    if (!known.length) return '';
    const max = Math.max(...known);
    return `<div class="cc-row" data-cc="${esc(key)}"><div class="cc-label">${esc(label)}</div><div class="cc-bars">${vals.map((x, i) => {
      const title = `${foods[i].name}: ${x == null ? L("veri yok") : fmt(x, unit)}`;
      if (x == null) return `<div class="cc-bar miss" title="${esc(title)}"><span class="cc-v">${L("veri yok")}</span></div>`;
      const w = max > 0 ? Math.max(1.5, (x / max) * 100) : 0;
      return `<div class="cc-bar" title="${esc(title)}"><span class="cc-track"><i class="s${i + 1}" style="width:${w.toFixed(1)}%"></i></span><span class="cc-v${x === max && max > 0 ? ' best' : ''}">${esc(fmt(x, unit))}</span></div>`;
    }).join('')}</div></div>`;
  }).join('');
  return `<figure class="cmp-chart" aria-label="${L("Temel değerler grafiği")}"><figcaption>${L("Temel değerler, satırdaki en yüksek değere göre")}</figcaption>${legend}<div class="cc-body">${body}</div><p class="hint">${L("Her satır kendi içinde ölçeklenir; kesin değerler temel besin değerleri tablosunda.")}</p></figure>`;
}

// B201: amino asit profili kıyası. Değer = mg/g protein ÷ WHO/FAO/UNU 2007 referansı (%); çizgi %100.
// Eksik ölçüm: o hücre "veri yok"; kısmi ölçüm "≥" (alt sınır). Sindirilebilirlik düzeltmesi yok.
export function compareAminoChart(foods, fmtPct = (x) => `${Math.round(x)}%`, labelOf = (x) => x, open = true) {
  if (foods.length < 2 || !foods.some((f) => f.amino?.rows.some((r) => r.ratio != null))) return '';
  const all = foods.flatMap((f) => f.amino?.rows.map((r) => r.ratio).filter((x) => x != null) || []);
  const top = Math.max(1, ...all) * 100;
  const refPos = (100 / top) * 100;
  const legend = `<ul class="cc-legend">${foods.map((f, i) => `<li><i class="cc-sw s${i + 1}" aria-hidden="true"></i>${esc(f.name)}${f.amino?.limiting ? ` <span class="muted">· ${esc(L("sınırlayıcı: {a}", { a: labelOf(f.amino.limiting) }))}</span>` : ''}</li>`).join('')}</ul>`;
  const body = foods[0].amino.rows.map((row, k) => `<div class="cc-row" data-cc-aa="${row.id}"><div class="cc-label">${esc(labelOf(row.label))}</div><div class="cc-bars">${foods.map((f, i) => {
    const r = f.amino?.rows[k];
    if (!r || r.ratio == null) return `<div class="cc-bar miss" title="${esc(f.name + ': ' + L("veri yok"))}"><span class="cc-v">${L("veri yok")}</span></div>`;
    const pct = r.ratio * 100, txt = `${r.complete ? '' : '≥'}${fmtPct(pct)}`;
    return `<div class="cc-bar${pct < 100 ? ' under' : ''}" title="${esc(f.name + ': ' + txt)}"><span class="cc-track ref" style="--ref:${refPos.toFixed(1)}%"><i class="s${i + 1}" style="width:${Math.max(1.5, (pct / top) * 100).toFixed(1)}%"></i><b class="cc-ref" aria-hidden="true"></b></span><span class="cc-v">${esc(txt)}</span></div>`;
  }).join('')}</div></div>`).join('');
  return `<details class="cmp-chart cmp-amino" aria-label="${L("Amino asit profili")}"${open ? ' open' : ''}><summary>${L("Amino asit profili (% referans)")}</summary>${legend}<div class="cc-body">${body}</div><p class="hint">${L("Çizgi = referans (%100), mg/g protein, WHO/FAO/UNU 2007. Sindirilebilirlik düzeltmesi yok; ≥ = bazı ölçümler eksik, alt sınır.")}</p></details>`;
}
