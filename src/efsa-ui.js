import { NUTRIENTS } from './nutrients.js';
import { efsaReference, EFSA_META, EFSA_TYPES, referenceLabel } from './references.js';
import { esc, fmtNum } from './util.js';
export function renderEfsaSettings(settings, open = false) {
  const option = (value, label, selected) => `<option value="${value}" ${String(selected) === String(value) ? 'selected' : ''}>${label}</option>`;
  const rows = NUTRIENTS.map(n => ({ n, ref: efsaReference(n, settings) })).filter(({ ref }) => ref.value != null);
  return `<div class="efsa-settings">
    <p class="hint">EFSA — European Food Safety Authority. ${esc(referenceLabel(settings))}</p>
    <div class="cu-grid"><label class="field"><span>Kaynağın yaş grubu için yaş</span><select data-efsa="efsaAge">${Array.from({ length: 99 }, (_, i) => option(i + 1, `${i + 1} yaş`, settings.efsaAge)).join('')}</select></label>
    <label class="field"><span>Kaynağın cinsiyet grubu</span><select data-efsa="efsaSex">${[['unspecified', 'Seç'], ['female', 'Kadın grubu'], ['male', 'Erkek grubu']].map(([v, l]) => option(v, l, settings.efsaSex)).join('')}</select></label></div>
    ${settings.efsaAge >= 18 ? `<label class="field"><span>Çinko için kaynak koşulu: günlük toplam fitat düzeyi</span><select data-efsa="efsaPhytate">${option('', 'Seçilmedi — çinko yüzdesi gösterilmez', settings.efsaPhytate)}${['300', '600', '900', '1200'].map(v => option(v, `${v} mg/gün fitat`, settings.efsaPhytate)).join('')}</select></label><p class="hint">Fitat düzeyi otomatik tahmin edilmez. Bu seçili besinin fitatı veya emilen çinko miktarı değildir.</p>` : ''}
    ${settings.efsaAge >= 18 && settings.efsaSex === 'female' ? `<label class="field"><span>Demir için kaynağın grubu</span><select data-efsa="efsaIronGroup">${[['unspecified', 'Seçilmedi — demir yüzdesi gösterilmez'], ['pre', 'Premenopoz grubu'], ['post', 'Postmenopoz grubu']].map(([v, l]) => option(v, l, settings.efsaIronGroup)).join('')}</select></label><p class="hint">Grup yaştan çıkarılmaz; kaydın kendi yaş sınırı da uygulanır.</p>` : ''}
    <p class="hint">Bu seçenek 1–99 yaş çocuk/yetişkin tablolarındaki ${EFSA_META.mappedNutrients} karşılaştırılabilir bileşeni kapsar. Bebeklik, gebelik/emzirme, enerji/vücut ağırlığına bağlı değerler, RI/AR/SSI ve üst sınır (UL) dahil değildir. A vitamini RE değeri RAE'ye eşitlenmez; toplam folat, DFE yerine kullanılmaz. Eksik gıda ölçümü doldurulmaz.</p>
    <details class="efsa-table" ${open ? 'open' : ''}><summary>Seçili grubun referans tablosunu incele (${rows.length} bileşen)</summary>
      ${rows.length ? `<ul class="source-ingredients">${rows.map(({ n, ref }) => `<li><b>${esc(n.label)}: ${fmtNum(ref.value)} ${esc(n.unit)}/gün · ${ref.type}</b><p>${esc(EFSA_TYPES[ref.type])} · EFSA ${ref.year} · kaynak satırı ${ref.row}</p><p>${esc(ref.sourceValue)} ${esc(ref.sourceUnit)} · ${esc(ref.doi)}</p><p>${esc(ref.title)}</p></li>`).join('')}</ul>` : '<p>Yaş ve cinsiyet grubu seçildiğinde eşleşen kayıtlar burada görünür.</p>'}
    </details>
  </div>`;
}
