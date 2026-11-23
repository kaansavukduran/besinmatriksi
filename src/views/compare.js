import { S } from '../state.js';
import { resolve, formName } from '../data.js';
import { NUTRIENTS, NUTRIENT_BY_KEY, SECTIONS } from '../nutrients.js';
import { scaleItem, assessAmino } from '../calc.js';
import { BASIC_KEYS, macroPie } from '../matrix.js';
import { esc, fmtNum, fmtAmount, fmtPct } from '../util.js';
import { L, t } from '../i18n.js';
import { nutrientLabel } from '../i18n-nutrients.js';
import { dailyRefs } from '../daily-ref.js';
import { compareChart, compareAminoChart } from '../compare-chart.js';
import { amountControls, miniAmount } from './amount.js';
import { persona, isPhone } from './common.js';

function nutrientTable(items, rows, { basic = false } = {}) {
  const caption = basic ? L("Besin karşılaştırma tablosu") : L("Ayrıntılı besin değerleri");
  const headingCells = items.map(({ c, item }) => {
    const form = item.food?.forms.length > 1 ? `${esc(item.formLabel)} · ` : '';
    return `<th scope="col" class="cmp-food">${esc(item.name)}<br><span class="muted">${form}${fmtNum(c.g)} ${item.customLiquid ? 'mL' : 'g'}</span></th>`;
  }).join('');
  return `<div class="tablewrap ${basic ? 'compare-basic-wrap' : 'compare-detail-wrap'}" tabindex="0" role="region" aria-label="${basic ? L("Karşılaştırma tablosu (yana kaydırılabilir)") : caption}" data-keep-scroll="compare-${basic ? 'basic' : 'detail'}"><table class="cmp" style="--cmp-n:${items.length}"><caption class="sr">${caption}</caption><thead><tr><th scope="col">${L("Bileşen")}</th>${headingCells}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}

function matchAmounts(items) {
  if (items.length < 2) return '';
  const liquids = items.filter(({ item }) => item.customLiquid).length;
  if (liquids && liquids !== items.length) {
    return `<p class="hint">${L("Miktarı eşitlemek için besinlerin birimleri aynı olmalı.")}</p>`;
  }
  const label = (n) => liquids ? L("Hepsi {n} mL", { n }) : (n === 100 ? L("Hepsi 100 g") : L("Hepsi 50 g"));
  return `<div class="compare-basis presets"><span>${L("Miktarı eşitle")}</span>${[100, 50].map((n) => `<button type="button" class="btn ghost" data-action="cmp-same" data-g="${n}">${label(n)}</button>`).join('')}</div>`;
}

export function renderCompare() {
  const items = S.compare.map((c, i) => ({ c, i, item: resolve(c.ref) })).filter((x) => x.item); // i: S.compare'deki gerçek konum
  const cols = items.map(({ c, i, item }, col) => {
    const formOptions = item.food?.forms.map((form, k) => {
      const chosen = k === c.ref.f;
      const duplicate = !chosen && S.compare.some(({ ref }) => ref.t === 'c' && ref.id === item.food.id && ref.f === k);
      return `<option value="${k}" ${chosen ? 'selected' : ''} ${duplicate ? 'disabled' : ''}>${esc(formName(form.label))}</option>`;
    });
    const formSelect = formOptions?.length > 1
      ? `<select class="cmp-form" data-cmpform="${i}" aria-label="${esc(L("{n} için tüketim biçimi", { n: item.name }))}">${formOptions.join('')}</select>`
      : `<span class="muted">${esc(item.formLabel)}</span>`;
    return `<div class="cmp-col">
      <div class="cmp-h"><b><i class="cc-sw s${col + 1}" aria-hidden="true"></i>${esc(item.name)}</b>${formSelect}
      <button class="btn ghost danger" data-action="cmp-del" data-i="${i}" aria-label="${L("Çıkar")}">✕</button></div>
      ${S.ingOpen.has('cmp:' + i) ? `${amountControls('cmp:' + i, c.g, item.portions || [], { compact: true, liquid: item.liquid, density: item.density, customLiquid: item.customLiquid })}<button class="btn ghost" data-action="ing-open" data-id="cmp:${i}" aria-expanded="true">${L("Kapat")}</button>` : miniAmount('cmp:' + i, c.g, 1, 'cmp:' + i, item.name, { customLiquid: item.customLiquid })}
    </div>`;
  }).join('');
  const addBtn = S.compare.length < 4 ? `<button type="button" class="btn primary" data-action="cmp-add">＋ ${L("Besin ekle")}</button>` : '';
  let table = items.length < 2 ? `<p class="empty">${L("En az iki besin ekle.")}</p>` : '';
  if (items.length) {
    const rs = items.map(({ c, item }) => scaleItem(item, c.g));
    const section = S.cmpSection === 'temel' ? 'all' : S.cmpSection;
    const secChips = [['all', L("Tümü")], ...SECTIONS.filter((s) => s.id !== 'enerji').map((s) => [s.id, L(s.title)])].map(([id, label]) => `<button type="button" class="pchip ${section === id ? 'on' : ''}" data-action="cmp-sec" data-s="${id}" aria-pressed="${section === id}">${esc(label)}</button>`).join('');
    const rows = [];
    let lastSec = null;
    const pr = persona();
    const cmpRow = (n, vals, basic = false) => {
      const max = Math.max(...vals.filter((x) => x != null));
      const refs = basic && S.settings.showNrv ? dailyRefs(n.key, { ...pr, custom: S.settings.referenceMode === 'custom' ? S.settings.targets : null }) : [];
      const pcts = (x) => refs.length ? `<small class="cpct">${refs.map((ref) => `${refs.length > 1 ? L(ref.who === 'female' ? "K" : "E") + ' ' : ''}${fmtPct((x / ref.value) * 100)}`).join(' · ')}</small>` : '';
      return `<tr><th scope="row">${esc(nutrientLabel(n))} <span class="unit">${esc(n.unit)}</span></th>${vals.map((x) => {
        if (x == null) return `<td class="miss">${L("veri yok")}</td>`;
        const w = max > 0 ? (x / max) * 100 : 0;
        return `<td class="${x === max && items.length > 1 && max > 0 ? 'best' : ''}"><span class="cbar"><i style="width:${w.toFixed(1)}%"></i></span>${fmtAmount(x, n.unit, S.settings.precision).n}${fmtAmount(x, n.unit).u !== n.unit ? ' ' + fmtAmount(x, n.unit).u : ''}${pcts(x)}</td>`;
      }).join('')}</tr>`;
    };
    const basicRows = [`<tr class="secrow basic"><th colspan="${items.length + 1}">${L("Temel besin değerleri")}${S.settings.showNrv ? ` <small class="muted">${pr.sex || S.settings.referenceMode === 'custom' ? L("% günlük referans") : L("% günlük referans · K: ortalama kadın, E: ortalama erkek")}</small>` : ''}</th></tr>`];
    for (const k of BASIC_KEYS) {
      const key = k === 'energy' && S.settings.energyUnit === 'kj' ? 'energy_kj' : k;
      const n = NUTRIENT_BY_KEY[key];
      if (n) basicRows.push(cmpRow(n, rs.map((r) => r.v[key]), key !== 'energy_kj'));
    }
    const secIdx = new Map(SECTIONS.map((x, i) => [x.id, i]));
    const cmpNutrients = NUTRIENTS.slice().sort((a, b) => secIdx.get(a.section) - secIdx.get(b.section)); // bölüm sırası matrisle aynı
    for (const n of cmpNutrients) {
      if (n.section === 'enerji' || ['ash', 'water'].includes(n.key)) continue;
      if (section !== 'all' && n.section !== section) continue;
      if (section === 'all' && BASIC_KEYS.includes(n.key)) continue;
      const vals = rs.map((r) => r.v[n.key]);
      if (vals.every((x) => x == null)) continue;
      if (n.section !== lastSec) { lastSec = n.section; rows.push(`<tr class="secrow"><th colspan="${items.length + 1}">${esc(L(SECTIONS.find((s) => s.id === n.section).title))}</th></tr>`); }
      rows.push(cmpRow(n, vals));
    }
    const pies = `<section class="cmp-pies"><h2>${L("Kalori nereden geliyor?")}</h2><div class="cmp-pie-row">${items.map(({ c, item }, i) => macroPie(rs[i], S.settings, { compact: true, title: `${item.name} · ${fmtNum(c.g)} ${item.customLiquid ? 'mL' : 'g'}` })).join('')}</div><p class="hint">${L("Kalorinin yüzde kaçının protein, karbonhidrat, yağ ve liften geldiği (Atwater genel faktörleri 4 / 4 / 9 / 2 kcal/g; yaklaşık).")}</p></section>`;
    const chartRows = BASIC_KEYS.map((k) => NUTRIENT_BY_KEY[k === 'energy' && S.settings.energyUnit === 'kj' ? 'energy_kj' : k]).filter(Boolean).map((n) => ({ key: n.key, label: nutrientLabel(n), unit: n.unit }));
    const chart = compareChart(items.map(({ item }, j) => ({ name: item.name, form: item.formLabel, v: rs[j].v })), chartRows, (x, unit) => { const a = fmtAmount(x, unit, S.settings.precision); return `${a.n} ${a.u}`; });
    const aminoChart = compareAminoChart(items.map(({ item }, j) => ({ name: item.name, amino: assessAmino(rs[j]) })), (x) => fmtPct(x), (x) => L(x), S.cmpAminoOpen ?? !isPhone());
    table += `
      ${matchAmounts(items)}
      ${nutrientTable(items, basicRows, { basic: true })}
      <details class="compare-details" data-ux-details="compare-details" ${S.uxDetails?.['compare-details'] ? 'open' : ''}>
        <summary id="compare-details-toggle">${L("Ayrıntılı besin değerleri")}</summary>
        <div class="presets cmp-secs" role="group" aria-label="${L("Bölüm")}">${secChips}</div>
        ${rows.length ? nutrientTable(items, rows) : `<p class="empty">${L("veri yok")}</p>`}
        <p class="hint">${L("Satırdaki en yüksek değer vurgulanır; “yüksek = iyi” anlamına gelmez (sodyum, toksik mineraller, antinutrientler).")}</p>
        <p class="hint basic-src">${L("Temel değer yüzdeleri: PHE Government Dietary Recommendations (2016, 19–64 yaş); şeker için AB 1169/2011. Kişisel ihtiyaç veya tıbbi öneri değildir.")}</p>
      </details>
      <details class="compare-charts" data-ux-details="compare-charts" ${S.uxDetails?.['compare-charts'] ? 'open' : ''}>
        <summary id="compare-charts-toggle">${L("Grafikler")}</summary>
        ${pies}${chart}${aminoChart}
      </details>`;
  }
  return `<div class="compare">
    <header class="compare-heading"><h1>${t('karsilastir')}</h1>${addBtn}</header>
    ${S.compare.length >= 4 ? `<p class="hint">${L("En fazla 4 besin kıyaslanır; yeni eklemek için birini çıkar.")}</p>` : ''}
    ${cols ? `<div class="cmp-cols">${cols}</div>` : ''}
    <div id="cmp-table">${table}</div>
  </div>`;
}
