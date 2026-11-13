import { scaleItem } from './calc.js';
import { NUTRIENTS } from './nutrients.js';
import { esc, fmtNum, fmtAmount } from './util.js';
import { L } from './i18n.js';
import { nutrientLabel } from './i18n-nutrients.js';

const CALCULATIONS = {
  salt: { keys: ['na'], label: 'Tuz (g) = sodyum (mg) × 2,5 / 1000' },
  energy_kj: { keys: ['energy'], label: 'Enerji (kJ) = enerji (kcal) × 4,184' },
  carb_avail: { keys: ['carb', 'fiber'], label: 'Lif hariç karbonhidrat = en az 0 olacak şekilde toplam karbonhidrat − lif' },
  carb: { keys: ['carb_avail', 'fiber'], label: 'Toplam karbonhidrat = etiket karbonhidratı + lif' },
};
export const LABELS = { u: 'USDA SR28 (2015)', N: 'USDA FNDDS', F: 'USDA FDC', f: 'USDA Flavonoid', y: 'USDA İzoflavon', L: 'USDA SR Legacy', I: 'USDA İyot', C: 'USDA Kolin', P: 'USDA Proantosiyanidin', U: 'USDA Pürin', r: 'Tahmin (tarif)', k: 'Kullanıcının ürün etiketi', d: 'Hesaplanan değer', i: 'IFCT 2017', e: 'Tahmin' };
export const usdaRecord = (u) => (!u ? '' : u.ndb ? `NDB ${u.ndb}` : u.fndds ? `FNDDS ${u.fndds}` : u.fdc ? `FDC ${u.fdc}` : '');

// Kaydı bulunamayan malzeme ve ölçülmüş sıfır da ayrı satır olarak korunur.
export function recipeContributions(recipe, resolve, key, factor = 1) {
  return recipe.items.map((ingredient, index) => {
    const item = resolve(ingredient.ref);
    const scaled = item ? scaleItem(item, ingredient.g) : null;
    const source = scaled?.s[key];
    const calculation = source === 'd' ? CALCULATIONS[key] : null;
    return {
      index, name: item?.name || L('Bulunamayan kayıt'), form: item?.formLabel || '',
      grams: ingredient.g, factor, missingRecord: !item,
      value: scaled?.v[key] == null ? null : scaled.v[key] * factor,
      source, usda: item?.usda || null,
      formula: calculation ? L(calculation.label) : null,
      inputs: (calculation?.keys || []).map(k => ({ key: k, value: scaled.v[k] == null ? null : scaled.v[k] * factor, source: scaled.s[k] })),
    };
  });
}

function amount(value, unit, precision) {
  if (value == null) return L("veri yok");
  const a = fmtAmount(value, unit, precision);
  return `${a.n} ${esc(a.u)}`;
}

export function renderRecipeSourceRows(recipe, resolve, key, factor, precision) {
  const nutrient = NUTRIENTS.find(n => n.key === key);
  if (!nutrient) return '';
  const rows = recipeContributions(recipe, resolve, key, factor);
  const known = rows.filter(row => row.value != null);
  const total = known.length ? known.reduce((sum, row) => sum + row.value, 0) : null;
  return `<p class="source-total"><b>${esc(nutrientLabel(nutrient))}: ${amount(total, nutrient.unit, precision)}</b> · ${L("{a}/{b} malzemede veri", { a: known.length, b: rows.length })}${known.length < rows.length ? ' · ' + L("kısmi toplam") : ''}</p>
    <p class="hint">${L("Eksik veri sıfır sayılmaz. Katkılar yuvarlanmadan toplanır; gösterimde yuvarlama farkı olabilir. Bu döküm pişirme kayıplarını veya emilimi ölçmez.")}</p>
    <ul class="source-ingredients">${rows.map(row => {
      const source = L(LABELS[row.source] || 'Kaynak belirtilmemiş');
      const record = row.usda && (['u', 'N', 'F', 'f', 'y', 'L', 'I', 'C', 'P', 'U'].includes(row.source) || row.inputs.some(input => input.source === 'u'))
        ? ` · ${esc(usdaRecord(row.usda))} · ${esc(row.usda.desc)}` : '';
      return `<li><div class="source-contribution"><b>${esc(row.name)}</b><strong>${amount(row.value, nutrient.unit, precision)}</strong></div>
        <p>${esc(row.form)} · ${fmtNum(row.grams)} g ${L('malzeme')}${factor !== 1 ? ` × ${fmtNum(factor, 'high')} ${L('hesap payı')}` : ''}</p>
        <p>${row.value == null ? row.missingRecord ? L("Kayıt bulunamadı; katkı bilinmiyor.") : L("Bu malzemede bu bileşen için veri yok.") : `${esc(source)}${record}${row.value === 0 ? ' · ' + L("kaynak/hesap sonucu 0") : ''}`}</p>
        ${row.formula ? `<p>${esc(row.formula)}</p><ul>${row.inputs.map(input => {
          const n = NUTRIENTS.find(n => n.key === input.key);
          return `<li>${esc(n ? nutrientLabel(n) : input.key)}: ${amount(input.value, n?.unit || '', precision)} · ${esc(L(LABELS[input.source] || 'Kaynak belirtilmemiş'))}</li>`;
        }).join('')}</ul>` : ''}</li>`;
    }).join('')}</ul>`;
}

export function renderRecipeSources(recipe, resolve, { key = 'energy', factor = 1, basisLabel, open = false, precision } = {}) {
  return `<details class="card recipe-sources" ${open ? 'open' : ''}>
    <summary>${L("Malzeme ve kaynak dökümü")}</summary>
    <p>${esc(basisLabel)}</p>
    <label class="field" for="recipe-source-nutrient">${L("Katkısını inceleyeceğin bileşen")}
      <select id="recipe-source-nutrient">${NUTRIENTS.map(n => `<option value="${n.key}" ${n.key === key ? 'selected' : ''}>${esc(nutrientLabel(n))} (${esc(n.unit)})</option>`).join('')}</select>
    </label>
    <div id="recipe-source-rows" aria-live="polite">${renderRecipeSourceRows(recipe, resolve, key, factor, precision)}</div>
  </details>`;
}
