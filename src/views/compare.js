// B218: Kıyasla sekmesi (arama, sütun kartları, grafikler, tablo) app.js'ten ayrıldı; davranış aynı
import { S } from '../state.js';
import { search, resolve, formName, foodName } from '../data.js';
import { NUTRIENTS, NUTRIENT_BY_KEY, SECTIONS } from '../nutrients.js';
import { scaleItem, assessAmino } from '../calc.js';
import { BASIC_KEYS, macroPie } from '../matrix.js';
import { esc, fmtNum, fmtAmount, fmtPct } from '../util.js';
import { L } from '../i18n.js';
import { nutrientLabel } from '../i18n-nutrients.js';
import { dailyRefs } from '../daily-ref.js';
import { compareChart, compareAminoChart } from '../compare-chart.js';
import { amountControls, miniAmount } from './amount.js';
import { foodIcon, persona, isPhone } from './common.js';

export function compareResults(q) {
  const k = (q || '').trim();
  if (!k) return '';
  const rows = [];
  for (const f of search(k).curated) {
    f.forms.forEach((fm, i) => { if (fm.v && Object.keys(fm.v).length && rows.length < 10) rows.push({ f, i, fm }); });
    if (rows.length >= 10) break;
  }
  if (!rows.length) return `<p class="empty">${L("Bu aramaya uyan besin yok.")}</p>`;
  return `<div class="cmp-results" role="list">${rows.map(({ f, i, fm }) => {
    const on = S.compare.some((c) => c.ref.t === 'c' && c.ref.id === f.id && c.ref.f === i);
    return `<button class="cmp-result ${on ? 'on' : ''}" role="listitem" data-action="cmp-pick" data-id="${esc(f.id)}" data-f="${i}" ${on || S.compare.length >= 4 ? 'disabled' : ''}><span class="fi" aria-hidden="true">${foodIcon(f, 24)}</span><span><b>${esc(foodName(f))}</b><small>${esc(formName(fm.label))}${fm.v.energy != null ? ` · ${fmtNum(fm.v.energy)} kcal` : ''}</small></span><span class="cmp-plus" aria-hidden="true">${on ? '✓' : '＋'}</span></button>`;
  }).join('')}</div>`;
}

export function renderCompare() {
  const items = S.compare.map((c, i) => ({ c, i, item: resolve(c.ref) })).filter((x) => x.item); // i: S.compare'deki gerçek konum
  const cols = items.map(({ c, i, item }) => `<div class="cmp-col">
      <div class="cmp-h"><b><i class="cc-sw s${items.findIndex((x) => x.i === i) + 1}" aria-hidden="true"></i>${esc(item.name)}</b>${item.food && item.food.forms.length > 1 ? `<select class="cmp-form" data-cmpform="${i}" aria-label="${esc(L("{n} için tüketim biçimi", { n: item.name }))}">${item.food.forms.map((fm, k) => `<option value="${k}" ${k === c.ref.f ? 'selected' : ''}>${esc(formName(fm.label))}</option>`).join('')}</select>` : `<span class="muted">${esc(item.formLabel)}</span>`}
      <button class="btn ghost danger" data-action="cmp-del" data-i="${i}" aria-label="${L("Çıkar")}">✕</button></div>
      ${S.ingOpen.has('cmp:' + i) ? `${amountControls('cmp:' + i, c.g, item.portions || [], { compact: true, liquid: item.liquid, density: item.density, customLiquid: item.customLiquid })}<button class="btn ghost" data-action="ing-open" data-id="cmp:${i}" aria-expanded="true">${L("Kapat")}</button>` : miniAmount('cmp:' + i, c.g, 1, 'cmp:' + i, item.name)}
    </div>`).join('');
  const addBtn = S.compare.length < 4 ? `<button class="cmp-add" data-action="cmp-add">＋ ${L("Besin ekle")}<br><span class="muted">${S.compare.length}/4</span></button>` : '';
  let table = '';
  if (items.length) {
    const rs = items.map(({ c, item }) => scaleItem(item, c.g));
    const secChips = [['all', L("Tümü")], ['temel', L("Temel besin değerleri")], ...SECTIONS.filter((s) => s.id !== 'enerji').map((s) => [s.id, L(s.title)])].map(([id, t]) => `<button class="pchip ${S.cmpSection === id ? 'on' : ''}" data-action="cmp-sec" data-s="${id}">${esc(t)}</button>`).join('');
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
    // Önce temel değerler (kalori, protein, karbonhidrat, şeker, yağ, doymuş yağ, lif, tuz), sonra ayrıntılı bölümler
    const showBasic = S.cmpSection === 'all' || S.cmpSection === 'temel';
    if (showBasic) {
      rows.push(`<tr class="secrow basic"><th colspan="${items.length + 1}">${L("Temel besin değerleri")}${S.settings.showNrv ? ` <small class="muted">${pr.sex || S.settings.referenceMode === 'custom' ? L("% günlük referans") : L("% günlük referans · K: ortalama kadın, E: ortalama erkek")}</small>` : ''}</th></tr>`);
      for (const k of BASIC_KEYS) { const key = k === 'energy' && S.settings.energyUnit === 'kj' ? 'energy_kj' : k; const n = NUTRIENT_BY_KEY[key]; if (n) rows.push(cmpRow(n, rs.map((r) => r.v[key]), key !== 'energy_kj')); }
    }
    const secIdx = new Map(SECTIONS.map((x, i) => [x.id, i]));
    const cmpNutrients = NUTRIENTS.slice().sort((a, b) => secIdx.get(a.section) - secIdx.get(b.section)); // bölüm sırası matrisle aynı
    for (const n of S.cmpSection === 'temel' ? [] : cmpNutrients) {
      // Kalori kutusu yalnız kaloriyi gösterir (su, kül, ayrıca kJ satırı yok; kJ seçiliyse kcal yerine kJ)
      if (['ash', 'water'].includes(n.key)) continue;
      if (n.section === 'enerji') continue; // kalori Temel besin değerleri satırında
      if (n.key === 'energy_kj' && S.settings.energyUnit !== 'kj') continue;
      if (n.key === 'energy_kj' && S.settings.energyUnit === 'kcal') continue;
      if (n.key === 'energy' && S.settings.energyUnit === 'kj') continue;
      if (S.cmpSection !== 'all' && n.section !== S.cmpSection) continue;
      if (S.cmpSection === 'all' && BASIC_KEYS.includes(n.key)) continue;
      const vals = rs.map((r) => r.v[n.key]);
      if (vals.every((x) => x == null)) continue;
      if (n.section !== lastSec) { lastSec = n.section; rows.push(`<tr class="secrow"><th colspan="${items.length + 1}">${esc(L(SECTIONS.find((s) => s.id === n.section).title))}</th></tr>`); }
      rows.push(cmpRow(n, vals));
    }
    const pies = `<section class="card cmp-pies" aria-label="${L("Kalori nereden geliyor?")}"><h3>${L("Kalori nereden geliyor?")}</h3><div class="cmp-pie-row">${items.map(({ c, item }, i) => macroPie(rs[i], S.settings, { compact: true, title: `${item.name} · ${fmtNum(c.g)} g` })).join('')}</div><p class="hint">${L("Kalorinin yüzde kaçının protein, karbonhidrat, yağ ve liften geldiği (Atwater genel faktörleri 4 / 4 / 9 / 2 kcal/g; yaklaşık).")}</p></section>`;
    const chartRows = BASIC_KEYS.map((k) => NUTRIENT_BY_KEY[k === 'energy' && S.settings.energyUnit === 'kj' ? 'energy_kj' : k]).filter(Boolean).map((n) => ({ key: n.key, label: nutrientLabel(n), unit: n.unit }));
    const chart = compareChart(items.map(({ item }, j) => ({ name: item.name, form: item.formLabel, v: rs[j].v })), chartRows, (x, unit) => { const a = fmtAmount(x, unit, S.settings.precision); return `${a.n} ${a.u}`; });
    const aminoChart = compareAminoChart(items.map(({ item }, j) => ({ name: item.name, amino: assessAmino(rs[j]) })), (x) => fmtPct(x), (x) => L(x), S.cmpAminoOpen ?? !isPhone());
    table = pies + chart + aminoChart + `<div class="presets cmp-secs" role="group" aria-label="${L("Bölüm")}">${secChips}</div>
      <div class="tablewrap" tabindex="0" role="region" aria-label="${L("Karşılaştırma tablosu (yana kaydırılabilir)")}"><table class="cmp" style="--cmp-n:${items.length}"><caption class="sr">${L("Besin karşılaştırma tablosu")}</caption><thead><tr><th scope="col">${L("Bileşen")}</th>${items.map(({ c, item }) => `<th scope="col" class="cmp-food">${esc(item.name)}<br><span class="muted">${esc(item.formLabel)} · ${fmtNum(c.g)} ${item.customLiquid ? 'mL' : 'g'}</span></th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>
      <p class="hint">${L("Aynı miktar ve biçimde karşılaştırmak için miktarları eşitle:")} <button class="btn ghost" data-action="cmp-same" data-g="100">${L("Hepsi 100 g")}</button> <button class="btn ghost" data-action="cmp-same" data-g="50">${L("Hepsi 50 g")}</button>. ${L("Satırdaki en yüksek değer vurgulanır; “yüksek = iyi” anlamına gelmez (sodyum, toksik mineraller, antinutrientler).")}</p>
      <p class="hint basic-src">${L("Temel değer yüzdeleri: PHE Government Dietary Recommendations (2016, 19–64 yaş); şeker için AB 1169/2011. Kişisel ihtiyaç veya tıbbi öneri değildir.")}</p>`;
  } else {
    table = `<p class="empty">${L("İki ile dört besini yan yana koy. Keşfet'te “Karşılaştır”a tıklayarak da ekleyebilirsin.")}</p>`;
  }
  const searchBox = S.compare.length < 4 ? `<div class="cmp-search"><label class="field"><span>${L("Kıyaslamak için besin ara")}</span><input id="cmp-q" type="search" autocomplete="off" value="${esc(S.cmpQ || '')}" placeholder="${L("ör. nohut, mercimek, yulaf")}"></label><div id="cmp-found">${compareResults(S.cmpQ)}</div>${!items.length && !S.cmpQ ? `<p class="hint">${L("İki ya da daha fazla besini yan yana görmek için ara ve dokun (en fazla 4).")}</p>` : ''}</div>` : `<p class="hint">${L("En fazla 4 besin kıyaslanır; yeni eklemek için birini çıkar.")}</p>`;
  return `<div class="compare">${searchBox}<div class="cmp-cols">${cols}${addBtn}</div><div id="cmp-table">${table}</div></div>`;
}
