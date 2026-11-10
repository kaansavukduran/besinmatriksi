import { NUTRIENTS } from './nutrients.js';
import { efsaReference, EFSA_META, EFSA_TYPES, referenceLabel } from './references.js';
import { esc, fmtNum } from './util.js';
import { L } from './i18n.js';
import { nutrientLabel } from './i18n-nutrients.js';
export function renderEfsaSettings(settings, open = false) {
  const option = (value, label, selected) => `<option value="${value}" ${String(selected) === String(value) ? 'selected' : ''}>${label}</option>`;
  const rows = NUTRIENTS.map(n => ({ n, ref: efsaReference(n, settings) })).filter(({ ref }) => ref.value != null);
  return `<div class="efsa-settings">
    <p class="hint">EFSA — European Food Safety Authority. ${esc(referenceLabel(settings))}</p>
    <div class="cu-grid"><label class="field"><span>${L("Kaynağın yaş grubu için yaş")}</span><select data-efsa="efsaAge">${Array.from({ length: 99 }, (_, i) => option(i + 1, L("{a} yaş", { a: i + 1 }), settings.efsaAge)).join('')}</select></label>
    <label class="field"><span>${L("Kaynağın cinsiyet grubu")}</span><select data-efsa="efsaSex">${[['unspecified', L("Seç")], ['female', L("Kadın grubu")], ['male', L("Erkek grubu")]].map(([v, l]) => option(v, l, settings.efsaSex)).join('')}</select></label></div>
    ${settings.efsaAge >= 18 ? `<label class="field"><span>${L("Çinko için kaynak koşulu: günlük toplam fitat düzeyi")}</span><select data-efsa="efsaPhytate">${option('', L("Seçilmedi — çinko yüzdesi gösterilmez"), settings.efsaPhytate)}${['300', '600', '900', '1200'].map(v => option(v, L("{v} mg/gün fitat", { v }), settings.efsaPhytate)).join('')}</select></label><p class="hint">${L("Fitat düzeyi otomatik tahmin edilmez. Bu seçili besinin fitatı veya emilen çinko miktarı değildir.")}</p>` : ''}
    ${settings.efsaAge >= 18 && settings.efsaSex === 'female' ? `<label class="field"><span>${L("Demir için kaynağın grubu")}</span><select data-efsa="efsaIronGroup">${[['unspecified', L("Seçilmedi — demir yüzdesi gösterilmez")], ['pre', L("Premenopoz grubu")], ['post', L("Postmenopoz grubu")]].map(([v, l]) => option(v, l, settings.efsaIronGroup)).join('')}</select></label><p class="hint">${L("Grup yaştan çıkarılmaz; kaydın kendi yaş sınırı da uygulanır.")}</p>` : ''}
    <p class="hint">${L("Bu seçenek 1–99 yaş çocuk/yetişkin tablolarındaki {n} karşılaştırılabilir bileşeni kapsar. Bebeklik, gebelik/emzirme, enerji/vücut ağırlığına bağlı değerler, RI/AR/SSI ve üst sınır (UL) dahil değildir. A vitamini RE değeri RAE'ye eşitlenmez; toplam folat, DFE yerine kullanılmaz. Eksik gıda ölçümü doldurulmaz.", { n: EFSA_META.mappedNutrients })}</p>
    <details class="efsa-table" ${open ? 'open' : ''}><summary>${L("Seçili grubun referans tablosunu incele ({n} bileşen)", { n: rows.length })}</summary>
      ${rows.length ? `<ul class="source-ingredients">${rows.map(({ n, ref }) => `<li><b>${esc(nutrientLabel(n))}: ${fmtNum(ref.value)} ${esc(n.unit)}/${L("gün")} · ${ref.type}</b><p>${esc(L(EFSA_TYPES[ref.type]))} · EFSA ${ref.year} · ${L("kaynak satırı {r}", { r: ref.row })}</p><p>${esc(ref.sourceValue)} ${esc(ref.sourceUnit)} · ${esc(ref.doi)}</p><p>${esc(ref.title)}</p></li>`).join('')}</ul>` : `<p>${L("Yaş ve cinsiyet grubu seçildiğinde eşleşen kayıtlar burada görünür.")}</p>`}
    </details>
  </div>`;
}
