// Besin matriksi görünümü (HTML üretimi)
import { NUTRIENTS, SECTIONS, SOURCES, ALLERGENS } from './nutrients.js';
import { derive } from './calc.js';
import { esc, fmtNum, fmtAmount, fmtPct, pctText } from './util.js';
import { normalizeSettings, referenceFor } from './settings.js';
import { referenceLabel } from './references.js';
import { L, getLanguage } from './i18n.js';
import { dailyRefs, refKind } from './daily-ref.js';
import { nutrientLabel } from './i18n-nutrients.js';

const nl = nutrientLabel;

const SRC_LABEL = { u: 'USDA', N: 'USDA FNDDS', F: 'USDA FDC', f: 'USDA Flavonoid', y: 'USDA İzoflavon', i: 'IFCT', e: 'Tahmin', d: 'Hesap', m: 'Karma', k: 'Etiket' };
const SRC_TITLE = {
  u: SOURCES.u.long, N: SOURCES.N.long, F: SOURCES.F.long, f: SOURCES.f.long, y: SOURCES.y.long, i: SOURCES.i.long, e: SOURCES.e.long,
  d: 'Diğer ölçülmüş değerlerden hesaplandı (ör. tuz = sodyum × 2,5)', m: 'Tarifteki malzemeler farklı kaynaklardan', k: 'Kullanıcının ürün etiketinden girdiği değer',
};

function srcChip(s, item) {
  if (!s) return '';
  const record = s === 'N' && item?.usda?.fndds ? ` · FNDDS ${item.usda.fndds} · ${item.usda.desc}` : s === 'F' && item?.usda?.fdc ? ` · FDC ${item.usda.fdc} (NDB ${item.usda.ndb})` : (s === 'u' || s === 'f' || s === 'y') && item?.usda ? (s === 'u' ? ' · USDA SR28 (2015), NDB ' : ' · NDB ') + `${item.usda.ndb} · ${item.usda.desc}` : s === 'i' && item?.ifct ? ` · IFCT 2017, ${item.ifct.code} · ${item.ifct.name}` : s === 'e' && item?.estFrom ? ' · ' + L("IFCT 2017 çiğ kaynak kaydı: {r}; protein/yağ oranı ile tahmin", { r: item.estFrom }) : '';
  return `<span class="src src-${s}" title="${esc(L(SRC_TITLE[s]) + record)}">${L(SRC_LABEL[s])}</span>`;
}

function valueCell(n, x, cfg) {
  const { n: num, u } = fmtAmount(x, n.unit, cfg.precision);
  return `<span class="num">${num}</span> <span class="unit">${esc(u)}</span>`;
}

function row(n, r, cfg) {
  const x = r.v[n.key];
  const s = r.s[n.key];
  if (x == null) return { missing: true, html: '' };
  let pct = '';
  const ref = referenceFor(n, cfg);
  if (cfg.showNrv && ref.value) {
    const p = (x / ref.value) * 100;
    pct = `<span class="nrv" title="${esc(ref.title)}; ${ref.label}: ${fmtNum(ref.value)} ${esc(n.unit)}">
      <span class="bar"><i style="width:${Math.min(100, p).toFixed(1)}%"></i>${p > 100 ? '<b class="over"></b>' : ''}</span>
      <span class="pct">${fmtPct(p)}${ref.type ? `<small class="ref-kind">${ref.type}</small>` : ''}</span></span>`;
  }
  const extra = [];
  if (x === 0 && (s === 'u' || s === 'i' || s === 'k')) extra.push(`<span class="flag" title="${L("Kaynak bu değeri 0 olarak bildiriyor (tespit sınırının altında olabilir)")}">${L("kaynak 0")}</span>`);
  if (cfg.showSd && r.sd?.[n.key] != null) extra.push(`<span class="sd" title="${L("IFCT standart sapması")}">± ${fmtAmount(r.sd[n.key], n.unit, cfg.precision).n}</span>`);
  if (cfg.showAlt && r.alt?.[n.key] != null) {
    const a = fmtAmount(r.alt[n.key], n.unit, cfg.precision);
    extra.push(`<span class="alt" title="${L("Aynı besinin IFCT 2017 ölçümü (farklı örnek). İki kaynak birlikte olası aralığı gösterir.")}">IFCT: ${a.n} ${esc(a.u)}</span>`);
  }
  if (r.cov && r.n > 1 && (r.cov[n.key] || 0) < r.n) {
    extra.push(`<span class="flag partial" title="${L("Bu bileşen yalnızca bazı malzemelerde ölçülmüş; toplam eksik olabilir")}">${L("kısmi {a}/{b}", { a: r.cov[n.key], b: r.n })}</span>`);
  }
  return {
    missing: false,
    html: `<div class="row" role="row">
      <span class="lbl" role="cell">${esc(nl(n))}</span>
      <span class="val" role="cell">${valueCell(n, x, cfg)}</span>
      ${pct ? `<span class="pctc" role="cell">${pct}</span>` : '<span class="pctc" role="cell"></span>'}
      <span class="meta" role="cell">${cfg.showSource ? srcChip(s, cfg.sourceItem) : ''}${extra.join('')}</span>
    </div>`,
  };
}

function section(sec, r, cfg, open) {
  const list = NUTRIENTS.filter((n) => n.section === sec.id && !['energy_kj', 'ash', 'water'].includes(n.key));
  let html = '', sub = undefined, have = 0;
  const missing = [];
  for (const n of list) {
    if (n.key === 'energy') {
      if (r.v.energy == null) { missing.push(nl(n)); continue; }
      have++;
      const kj = r.v.energy_kj;
      const ref = referenceFor(n, cfg);
      const p = ref.value ? (r.v.energy / ref.value) * 100 : null;
      const amount = cfg.energyUnit === 'kj' ? `${fmtNum(kj, cfg.precision)} <span class="unit">kJ</span>` : `${fmtNum(r.v.energy, cfg.precision)} <span class="unit">kcal</span>`;
      html += `<div class="row" role="row"><span class="lbl" role="cell">${L("Kalori")}</span>
        <span class="val" role="cell"><span class="num">${amount}</span></span>
        <span class="pctc" role="cell">${cfg.showNrv && p != null ? `<span class="nrv" title="${esc(ref.title)}; ${ref.label} ${fmtNum(ref.value)} kcal"><span class="bar"><i style="width:${Math.min(100, p).toFixed(1)}%"></i></span><span class="pct">${fmtPct(p)}</span></span>` : ''}</span>
        <span class="meta" role="cell">${cfg.showSource ? srcChip(r.s.energy, cfg.sourceItem) : ''}${r.cov && r.cov.energy < r.n ? `<span class="flag partial">${L("kısmi {a}/{b}", { a: r.cov.energy, b: r.n })}</span>` : ''}</span></div>`;
      continue;
    }
    const rr = row(n, r, cfg);
    if (rr.missing) {
      missing.push(nl(n));
      if (cfg.showMissing) {
        if (n.sub !== sub) { sub = n.sub; if (sub) html += `<div class="sub">${esc(L(sub))}</div>`; }
        html += `<div class="row miss" role="row"><span class="lbl" role="cell">${esc(nl(n))}</span><span class="val" role="cell">${L("veri yok")}</span><span class="pctc" role="cell"></span><span class="meta" role="cell"></span></div>`;
      }
      continue;
    }
    have++;
    if (n.sub !== sub) { sub = n.sub; if (sub) html += `<div class="sub">${esc(L(sub))}</div>`; }
    html += rr.html;
  }
  const total = have + missing.length;
  const missNote = missing.length && !cfg.showMissing
    ? `<button class="linkish miss-note" data-action="toggle-missing" title="${esc(missing.join(', '))}">${L("Veri yok: {n} bileşen · göster", { n: missing.length })}</button>`
    : '';
  const body = have
    ? `<div class="rows" role="table" aria-label="${esc(L(sec.title))}">${html}</div>${missNote}`
    : `<p class="empty">${L("Bu form için bu başlıkta ölçüm verisi yok.")} ${missing.length ? L("({n} bileşen tanımlı, hiçbiri ölçülmemiş.)", { n: missing.length }) : ''}</p>${cfg.showMissing ? `<div class="rows">${html}</div>` : ''}`;
  return `<details class="sec" data-sec="${sec.id}" ${open ? 'open' : ''}>
    <summary><span class="ico" aria-hidden="true">${cfg.emoji ? sec.icon : ''}</span><span class="st">${esc(L(sec.title))}</span>
    <span class="cov ${have ? '' : 'none'}" title="${L("Verisi olan bileşen / tanımlı bileşen")}">${have}/${total}</span></summary>
    ${body}</details>`;
}

// Kalori kutusunun üstünde: kalorinin protein / karbonhidrat / yağ / lif paylarını gösteren pasta (halka) grafik
export function macroPie(r, cfg, opts = {}) {
  const e = derive(r).energySplit;
  if (!e) return opts.compact ? `<div class="macro-pie mini none"><h4>${esc(opts.title || '')}</h4><p class="hint">${L("Makro verisi eksik; pasta çizilmedi.")}</p></div>` : '';
  const parts = [['p', L("Protein"), e.p, r.v.protein], ['c', L("Karbonhidrat"), e.c, r.v.carb_avail], ['f', L("Yağ"), e.f, r.v.fat], ['fib', L("Lif"), e.fib, r.v.fiber]];
  const R = 15.9155; // çevre = 100
  let off = 25, arcs = '';
  for (const [k, , pct] of parts) {
    if (pct <= 0) continue;
    arcs += `<circle r="${R}" cx="21" cy="21" fill="none" stroke="var(--sp-${k})" stroke-width="7" stroke-dasharray="${pct.toFixed(2)} ${(100 - pct).toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" data-part="${k}"/>`;
    off -= pct;
  }
  const label = parts.map(([, n, pct]) => `${n} ${fmtPct(pct)}`).join(', ');
  if (opts.compact) return `<div class="macro-pie mini" aria-label="${esc((opts.title || '') + ': ' + label)}"><h4>${esc(opts.title || '')}</h4>
    <svg viewBox="0 0 42 42" class="pie" role="img" aria-label="${esc(label)}"><circle r="${R}" cx="21" cy="21" fill="none" stroke="var(--line)" stroke-width="7"/>${arcs}</svg>
    <ul class="pie-legend">${parts.map(([k, n, pct]) => `<li data-part="${k}"><b class="sp-${k}"></b><span>${n}</span><strong>${fmtPct(pct)}</strong></li>`).join('')}</ul></div>`;
  if (opts.inline) return `<div class="macro-pie inline" data-sec="pasta" aria-label="${esc(L("Kalori dağılımı") + ': ' + label)}"><h4>${L("Kalori nereden geliyor?")}</h4>
    <svg viewBox="0 0 42 42" class="pie" role="img" aria-label="${esc(label)}"><circle r="${R}" cx="21" cy="21" fill="none" stroke="var(--line)" stroke-width="7"/>${arcs}</svg>
    <ul class="pie-legend">${parts.map(([k, n, pct]) => `<li data-part="${k}"><b class="sp-${k}"></b><span>${n}</span><strong>${fmtPct(pct)}</strong></li>`).join('')}</ul></div>`;
  return `<section class="card macro-pie" data-sec="pasta" aria-label="${esc(L("Kalori dağılımı") + ': ' + label)}">
    <h3>${L("Kalori nereden geliyor?")}</h3>
    <div class="pie-wrap"><svg viewBox="0 0 42 42" class="pie" role="img" aria-label="${esc(label)}"><circle r="${R}" cx="21" cy="21" fill="none" stroke="var(--line)" stroke-width="7"/>${arcs}</svg>
    <ul class="pie-legend">${parts.map(([k, n, pct, g]) => `<li data-part="${k}"><b class="sp-${k}"></b><span>${n}</span><strong>${fmtPct(pct)}</strong>${g != null ? `<small>${fmtAmount(g, 'g', cfg.precision).n} g</small>` : ''}</li>`).join('')}</ul></div>
    <p class="hint">${L("Kalorinin yüzde kaçının protein, karbonhidrat, yağ ve liften geldiği (Atwater genel faktörleri 4 / 4 / 9 / 2 kcal/g; yaklaşık).")}</p></section>`;
}

function ratioRow(label, val, fmt, verdict, help) {
  label = L(label); help = L(help); if (verdict) verdict = [verdict[0], L(verdict[1])];
  return `<div class="row"><span class="lbl">${label}</span><span class="val"><span class="num">${fmt}</span></span>
    <span class="pctc">${verdict ? `<span class="chip ${verdict[0]}">${verdict[1]}</span>` : ''}</span>
    <span class="meta"><span class="help" title="${esc(help)}">?</span></span></div>`;
}

function derivedCard(r, cfg, open) {
  const d = derive(r);
  let h = '';
  // Enerji dağılımı artık temel değer kartındaki pastada gösterilir (tekrar yok)
  const rows = [];
  if (d.protDensity != null) rows.push(ratioRow('Protein yoğunluğu', d.protDensity, `${fmtNum(d.protDensity)} g / 100 kcal`, null, '100 kcal enerji başına protein gramı.'));
  if (d.pral != null) rows.push(ratioRow('PRAL (seçilen miktar)', d.pral, `${fmtNum(d.pral)} mEq`, d.pral < 0 ? ['ok', 'alkali yönlü'] : ['warn', 'asit yönlü'],
    'Potansiyel böbrek asit yükü, Remer & Manz (1995): 0,49×protein + 0,037×P − 0,021×K − 0,026×Mg − 0,013×Ca. Tahmini bir göstergedir; sağlık sonucu değildir.'));
  if (d.n6n3 != null) rows.push(ratioRow('Omega-6 : Omega-3', d.n6n3, `${fmtNum(d.n6n3)} : 1`, null, 'Toplam n-6 / toplam n-3 (yoksa LA / ALA). Tek başına bir sağlık hedefi olarak kanıtı sınırlıdır; mutlak ALA ve LA miktarları daha anlamlıdır.'));
  if (d.naK != null) rows.push(ratioRow('Na : K (molar)', d.naK, fmtNum(d.naK), d.naK < 1 ? ['ok', '< 1'] : ['warn', '≥ 1'], 'WHO yetişkinler için Na:K molar oranının ≈ 1 veya altında olmasını önerir (2012 rehberlerinden türetilir).'));
  if (d.phyZn != null) rows.push(ratioRow('Fitat : Çinko (molar)', d.phyZn, fmtNum(d.phyZn), d.phyZn > 15 ? ['bad', '> 15 düşük emilim'] : d.phyZn > 5 ? ['warn', '5–15 orta'] : ['ok', '< 5'], 'WHO/FAO (2004) eşikleri: >15 düşük, 5–15 orta, <5 yüksek çinko biyoyararlanımı. Tek besine değil öğüne uygulanır.'));
  if (d.phyFe != null) rows.push(ratioRow('Fitat : Demir (molar)', d.phyFe, fmtNum(d.phyFe), d.phyFe > 1 ? ['bad', '> 1 emilim baskılanır'] : d.phyFe > 0.4 ? ['warn', '0,4–1'] : ['ok', '< 0,4'], 'Hurrell & Egli (2010): >1 demir emilimini belirgin baskılar; ideal <0,4 (C vitamini yoksa). Fermentasyon, ıslatma, filizlendirme fitatı azaltır.'));
  if (d.phyCa != null) rows.push(ratioRow('Fitat : Kalsiyum (molar)', d.phyCa, fmtNum(d.phyCa), d.phyCa > 0.24 ? ['warn', '> 0,24'] : ['ok', '≤ 0,24'], '>0,24 kalsiyum biyoyararlanımının azaldığına işaret eden eşik olarak kullanılır (Umeta ve ark. 2005).'));
  if (d.oxCa != null) rows.push(ratioRow('Oksalat : Kalsiyum (molar)', d.oxCa, fmtNum(d.oxCa), d.oxCa >= 1 ? ['warn', '≥ 1 molar oran'] : ['ok', '< 1'], 'Oksalat/kalsiyum molar oranı; bağlanmayı veya kişideki gerçek emilimi doğrudan ölçmez. Hazırlama biçimi ve oksalatın çözünürlüğü önemlidir.'));
  let aas = '';
  if (d.aas) {
    const a = d.aas;
    aas = `<div class="aas"><div class="aas-head"><b>${L("Amino asit skoru: {s}", { s: pctText(fmtNum(a.raw)) })}</b>
      <span class="chip ${a.raw >= 100 ? 'ok' : a.raw >= 75 ? 'warn' : 'bad'}">${L("Sınırlayıcı: {a}", { a: esc(L(a.limiting)) })}</span>
      <span class="help" title="${L("WHO/FAO/UNU 2007 yetişkin referans örüntüsüne göre (mg/g protein). Sindirilebilirlik düzeltmesi YOK; PDCAAS/DIAAS değildir.")}${a.complete ? '' : ' ' + L("Bazı amino asitler ölçülmemiş.")}">?</span></div>
      <div class="aabars">${a.rows.map((x) => `<div class="aabar" title="${esc(L(x.label))}: ${x.mgPerG == null ? L("veri yok") : fmtNum(x.mgPerG) + ' mg/g protein, ' + L("referans") + ' ' + x.ref}">
        <span class="aal">${esc(L(x.label))}</span><span class="aat"><i class="${x.ratio == null ? 'na' : x.ratio >= 1 ? 'ok' : 'low'}" style="width:${x.ratio == null ? 0 : Math.min(150, x.ratio * 100) / 1.5}%"></i><em style="left:${100 / 1.5}%"></em></span>
        <span class="aav">${x.ratio == null ? '–' : fmtPct(x.ratio * 100)}</span></div>`).join('')}</div>
      <p class="hint">${L("Çizgi = referans (%100). Baklagil + tahıl birlikte tüketilince sınırlayıcı amino asitler birbirini tamamlar; tarif sekmesinde dene.")}</p></div>`;
  }
  const body = (h + (rows.length ? `<div class="rows">${rows.join('')}</div>` : '') + aas) || `<p class="empty">${L("Hesaplama için gerekli veriler yok.")}</p>`;
  return `<details class="sec" data-sec="hesap" ${open ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🧮' : ''}</span><span class="st">${L("Hesaplanan göstergeler")}</span></summary>${body}</details>`;
}

function preparationNotes(r, item) {
  const v = r.v, d = derive(r), notes = [];
  const cat = item?.cat;
  if (v.fe > 0 && (d.phyFe > 1 || cat === 'baklagil' || cat === 'tahil'))
    notes.push('Bitkisel (hem olmayan) demir: C vitamini içeren bir besinle birlikte tüketmek emilimi artırır; çay/kahve ve yüksek fitat azaltır. Islatma, filizlendirme, ekşi maya/fermentasyon fitatı düşürür.');
  if (d.oxCa >= 1) notes.push('Oksalat kalsiyumu bağladığı için bu besindeki kalsiyumun emilimi düşüktür. Haşlayıp suyunu dökmek çözünür oksalatı azaltır.');
  if ((v.bcarotene || 0) + (v.lycopene || 0) + (v.lutzea || 0) + (v.lutein || 0) > 1000)
    notes.push('Karotenoidler yağda çözünür: az miktarda yağ ile ve ezilmiş/pişirilmiş biçimde biyoyararlanım artar.');
  if (cat === 'baklagil') notes.push('Kuru baklagilleri ıslatıp iyice pişirmek lektinleri ve tripsin inhibitörlerini büyük ölçüde etkisizleştirir; ıslatma suyunu dökmek rafinoz ailesi şekerlerini (gaz yapan GOS) azaltır.');
  if (v.vitc > 5 && item && !['cig', 'taze', 'suyu'].includes(item.form?.key))
    notes.push('C vitamini ısı ve suya duyarlıdır; haşlamada suya geçer. Buharda kısa pişirme kaybı azaltır.');
  if (v.ala_fa > 500 || v.n3 > 0.5) notes.push('ALA ışık, ısı ve oksijenle okside olur; serin, karanlık ve kapalı saklayın. Öğütülmüş tohumları kısa sürede tüketin.');
  if (['alg', 'mantar', 'soya'].includes(cat)) notes.push('Alg, mantar ve fermente ürünlerde ölçülen B12 değişken ve çoğu zaman insanlarda aktif olmayan analog biçimdedir; veganlar için güvenilir B12 kaynağı takviye veya zenginleştirilmiş üründür.');
  if (!notes.length) return '';
  return `<ul class="notes">${notes.map((n) => `<li>${esc(L(n))}</li>`).join('')}</ul><p class="hint">${L("Bunlar genel beslenme bilimi kurallarıdır; bu besine özgü ölçüm değildir.")}</p>`;
}

function toleranceCard(r, item, cfg, open) {
  const unknownAllergens = item?.custom || item?.ext;
  const al = (item?.allergens || []).map((a) => `<span class="chip warn">${esc(L(ALLERGENS[a] || a))}</span>`).join('');
  const rfo = ['raffinose', 'stachyose', 'verbascose', 'ajugose'].map((k) => r.v[k]).filter((x) => x != null);
  const rfoSum = rfo.reduce((a, b) => a + b, 0);
  const lines = [];
  lines.push(`<div class="kv"><span>${L("Alerjenler (AB 14 listesi)")}</span><span>${unknownAllergens ? `<span class="muted">${L("Bilgi girilmedi; ürün etiketini kontrol et")}</span>` : al || (item ? `<span class="chip ok">${L("Katalogda bildirilen yok")}</span>` : `<span class="muted">${L("tarif: malzemelere bak")}</span>`)}</span></div>`);
  lines.push(`<div class="kv"><span>Gluten</span><span>${unknownAllergens ? L("veri yok; ürün etiketi ve çapraz bulaşma bilgisi gerekli") : item?.allergens?.includes('gluten') ? L("İçerir") : item ? L("Tahıl kaynaklı gluten beklenmez (çapraz bulaşma ürüne göre)") : '–'}</span></div>`);
  lines.push(`<div class="kv"><span>FODMAP</span><span>${rfo.length ? L("Rafinoz ailesi (GOS) ölçülmüş: {g} g.", { g: fmtNum(rfoSum) }) + ' ' : ''}${L("Porsiyon eşikleri: veri yok (Monash / FODMAP Friendly verileri lisanslı, bu uygulamada yok).")}</span></div>`);
  if (r.v.lactose != null) lines.push(`<div class="kv"><span>${L("Laktoz")}</span><span>${fmtNum(r.v.lactose)} g</span></div>`);
  lines.push(`<div class="kv"><span>${L("Histamin / biyojen aminler")}</span><span><b>${L("veri yok")}</b></span></div>`);
  if (item?.note) lines.push(`<div class="note">⚠️ ${esc(L(item.note))}</div>`);
  return `<details class="sec" data-sec="tolerans" ${open ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🤧' : ''}</span><span class="st">${L("Alerji, intolerans ve uyarılar")}</span></summary><div class="kvs">${lines.join('')}</div></details>`;
}

function safetyExtra(cfg, open) {
  const items = ['Pestisit kalıntıları', 'Küf toksinleri (aflatoksin, okratoksin)', 'Akrilamid, PAH, nitrozaminler, 3-MCPD', 'Mikrobiyal bulaşma', 'Ambalajdan geçen maddeler', 'İyot', 'Florür'];
  return `<details class="sec" data-sec="kalinti" ${open ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🧫' : ''}</span><span class="st">${L("Kalıntılar, bulaşanlar ve kapsam dışı")}</span></summary>
    <p class="empty">${L("Bu başlıklar ürün partisine, bölgeye ve işleme bağlıdır; uygulamadaki açık veri setlerinde ölçüm yok:")}</p>
    <div class="chips">${items.map((x) => `<span class="chip">${L(x)}: ${L("veri yok")}</span>`).join('')}</div>
    <p class="hint">${L("Glisemik indeks / glisemik yük: veri yok (yayımlanmış GI tabloları test koşuluna bağlı ve lisanslı).")}</p></details>`;
}

function identityCard(item, r, cfg, ctx) {
  const rows = [];
  if (ctx.recipe) {
    rows.push(['Tarif', esc(ctx.recipe.name)]);
    rows.push(['Malzeme sayısı', String(r.n)]);
    rows.push(['Ölçüm temeli', esc(ctx.basisLabel)]);
  } else {
    rows.push(['Besin', `${esc(item.name)}${item.sci ? ` <i class="sci">${esc(item.sci)}</i>` : ''}`]);
    rows.push(['Tüketim biçimi', esc(item.formLabel)]);
    rows.push(['Ölçüm temeli', `${fmtNum(r.grams)} ${item.liquid ? L("g (sıvılarda ≈ mL; yoğunluk ≈ 1 kabulü)") : L("g yenebilir kısım")} · ${L("kaynak değerleri 100 g başına")}`]);
    if (item.custom) rows.push(['Kaynak', L("Ürün etiketinden elle girildi; girilmeyen bileşenler “veri yok” sayılır.")]);
    if (item.usda) {
      let part = L('Yenebilir kısım');
      if (item.usda.refuse) part += ' · ' + L("satın alınan ağırlığın %{p}'i atılır", { p: item.usda.refuse }) + (item.usda.refDesc ? ` (${esc(item.usda.refDesc)})` : '');
      rows.push(['İncelenen kısım', part]);
      rows.push(['USDA kaydı', `${esc(item.usda.desc)} <span class="muted">· NDB ${esc(item.usda.ndb)}</span>`]);
    }
    if (item.ifct) rows.push(['IFCT kaydı', `${esc(item.ifct.name)} <span class="muted">· ${esc(item.ifct.code)}${item.ifct.regions ? ' · ' + L("{n} bölge örneği", { n: item.ifct.regions }) : ''}</span>`]);
    if (item.estFrom) rows.push(['Tahmin', L("Amino asit ve yağ asidi profilleri aynı besinin çiğ/kuru IFCT ölçümünden bu formun protein/yağ değerine oranlandı (“Tahmin” etiketi).")]);
    rows.push(['Değişkenler', L("Çeşit, olgunluk, mevsim, toprak, saklama ve laboratuvar yöntemi değerleri değiştirir; iki kaynak arasındaki fark doğal aralığı gösterir.")]);
  }
  return `<div class="idcard">${rows.map(([k, v]) => `<div class="kv"><span>${L(k)}</span><span>${v}</span></div>`).join('')}</div>`;
}

function coverage(r, cfg) {
  const secs = SECTIONS.map((s) => {
    const list = NUTRIENTS.filter((n) => n.section === s.id && n.key !== 'energy_kj');
    const have = list.filter((n) => r.v[n.key] != null).length;
    const partial = r.cov && r.n > 1 ? list.filter(n => r.v[n.key] != null && r.cov[n.key] < r.n).length : 0;
    return { s, have, partial, total: list.length };
  });
  return `<div class="coverage">${secs.map((x) => `<span class="covchip ${x.have === 0 ? 'none' : x.have / x.total > 0.6 && !x.partial ? 'full' : 'part'}" title="${esc(L(x.s.title))}: ${x.have}/${x.total}; ${L("{n} kısmi malzeme kapsamı", { n: x.partial })}">${cfg.emoji ? x.s.icon + ' ' : ''}${x.have}/${x.total}</span>`).join('')}</div>`;
}

// Temel değerler: herkesin ilk baktığı 8 bileşen; ayrıntılar altında kalır. Ölçülmemiş = "veri yok", kısmi kapsam belirtilir.
export const BASIC_KEYS = ['energy', 'protein', 'carb_avail', 'sugars', 'fat', 'sfa', 'fiber', 'salt'];
const BASIC_SHORT = { energy: 'Kalori', protein: 'Protein', carb_avail: 'Karbonhidrat', sugars: 'Şeker', fat: 'Yağ', sfa: 'Doymuş yağ', fiber: 'Lif', salt: 'Tuz' };
// Temel besin değerleri: her karoda günlük referansa göre çubuk ve yüzde.
// Kişisel bilgi yoksa ortalama kadın ve erkek (PHE 2016, 19–64 yaş); elle hedef veya kişisel enerji varsa onlar.
const WHO = { female: "Kadın", male: "Erkek", you: "Sen", both: "Günlük" };
export function basicCard(r, cfg, title = null, opts = {}) {
  cfg = normalizeSettings(cfg);
  const persona = { ...(opts.persona || {}), custom: cfg.referenceMode === 'custom' ? cfg.targets : null };
  if (opts.energyTarget > 0 && !(persona.energy > 0)) persona.energy = opts.energyTarget;
  const tiles = BASIC_KEYS.map((k) => {
    const n = NUTRIENTS.find((x) => x.key === k);
    if (!n) return '';
    const x = r.v[k];
    const partial = x != null && r.n > 1 && (r.cov?.[k] || 0) < r.n;
    const kj = k === 'energy' && cfg.energyUnit === 'kj' && r.v.energy_kj != null;
    const val = x == null ? `<b class="miss">${L("veri yok")}</b>` : kj ? `<b>${partial ? '≥ ' : ''}${fmtNum(r.v.energy_kj, cfg.precision)} <span class="unit">kJ</span></b>` : `<b>${partial ? '≥ ' : ''}${fmtAmount(x, n.unit, cfg.precision).n} <span class="unit">${esc(fmtAmount(x, n.unit).u)}</span></b>`;
    const refs = x == null || !cfg.showNrv ? [] : dailyRefs(k, persona);
    const kind = refKind(k);
    const bars = refs.map((ref) => {
      const pct = (x / ref.value) * 100;
      const cls = kind === 'limit' && pct > 100 ? 'over' : kind === 'goal' && pct >= 100 ? 'done' : '';
      return `<span class="gref ${cls}" data-who="${ref.who}"><span class="gwho">${L(WHO[ref.who])}</span><span class="gbar" role="img" aria-label="${esc(L(WHO[ref.who]) + ' ' + fmtPct(pct))}"><i style="width:${Math.min(100, pct).toFixed(1)}%"></i></span><span class="gpct">${fmtPct(pct)}</span></span>`;
    }).join('');
    let note = '';
    if (refs.length === 1 && opts.goals) {
      const ref = refs[0], pct = (x / ref.value) * 100, left = ref.value - x;
      note = kind === 'limit' ? (pct > 100 ? L("üst sınırı {p} aştı", { p: fmtPct(pct - 100) }) : L("üst sınırın {p}", { p: fmtPct(pct) }))
        : kind === 'goal' ? (left > 0 ? L("kalan {v}", { v: `${fmtAmount(left, n.unit, cfg.precision).n} ${fmtAmount(left, n.unit).u}` }) : L("hedefe ulaşıldı ✓"))
          : L("referansın {p}", { p: fmtPct(pct) });
    } else if (refs.length && kind === 'limit') note = L("üst sınıra göre");
    // Tüm referanslarda hedefe ulaşıldıysa "done"; herhangi birinde üst sınır aşıldıysa "over"
    const pcts = refs.map((ref) => (x / ref.value) * 100);
    const cls = !pcts.length ? '' : kind === 'limit' && pcts.some((p) => p > 100) ? ' over' : kind === 'goal' && pcts.every((p) => p >= 100) ? ' done' : '';
    return `<div class="basic-tile${refs.length ? ' goal' : ''}${cls}" data-basic="${k}" title="${esc(nl(n))}"><span>${L(BASIC_SHORT[k])}</span>${val}${bars}${note ? `<small>${note}</small>` : ''}</div>`;
  }).join('');
  const who = persona.custom ? L("kendi hedeflerin") : persona.sex === 'female' ? L("ortalama yetişkin kadın") : persona.sex === 'male' ? L("ortalama yetişkin erkek") : L("ortalama yetişkin kadın ve erkek");
  const foot = L("Yüzdeler günlük referansa göredir: {w}{e}. Kaynak: PHE Government Dietary Recommendations (2016, 19–64 yaş); şeker için AB 1169/2011 toplam şeker referansı. Kalori, protein ve lifte hedefe doğru; yağ, doymuş yağ, şeker ve tuzda üst sınıra göre. Kişisel ihtiyaç veya tıbbi öneri değildir.",
    { w: who, e: persona.energy > 0 && !persona.custom ? L("; kalori hedefi profilinden ({k} kcal)", { k: fmtNum(persona.energy) }) : '' });
  // Pasta (kalori nereden geliyor) temel değerlerle aynı kartta: solda pasta, sağda 8 karo
  const pie = opts.pie ? macroPie(r, cfg, { inline: true }) : '';
  const pieNote = pie ? ' ' + L("Pasta: kalorinin protein, karbonhidrat, yağ ve liften gelen payı (Atwater 4 / 4 / 9 / 2 kcal/g; yaklaşık).") : '';
  return `<section class="card basic-card${opts.goals ? ' goals' : ''}${pie ? ' with-pie' : ''}" aria-label="${L("Temel besin değerleri")}"><h3>${title || L("Temel besin değerleri")}</h3><div class="basic-layout">${pie}<div class="basic-tiles"><div class="basic-grid">${tiles}</div></div></div><p class="hint basic-src">${foot}${pieNote}</p></section>`;
}

export function renderMatrix(r, cfg, ctx = {}) {
  cfg = normalizeSettings(cfg);
  const item = ctx.item || null;
  cfg.sourceItem = item;
  const open = (id) => !ctx.closed?.has(id);
  const d = [ctx.recipe ? '' : basicCard(r, cfg, null, { persona: ctx.persona, pie: true })];
  // Hesaplanan göstergeler temel değer + pasta kartının hemen altında (gizlenmediyse)
  const hesapFirst = cfg.sectionOrder.includes('hesap') && !cfg.hiddenSections.includes('hesap');
  if (hesapFirst) d.push(derivedCard(r, cfg, open('hesap')));
  const tail = [identityCard(item, r, cfg, ctx), coverage(r, cfg), `<p class="hint reference-label">${esc(referenceLabel(cfg))}</p>`];
  if (cfg.hiddenSections.length) d.push(`<p class="hint">${L("{n} bölüm ayarlarda gizlendi. Kapsam özeti ve CSV tüm bileşenleri içerir.", { n: cfg.hiddenSections.length })}</p>`);
  if (cfg.pinnedNutrients.length) {
    const rows = cfg.pinnedNutrients.map(k => NUTRIENTS.find(n => n.key === k)).map(n => {
      const result = row(n, r, cfg);
      return result.missing ? `<div class="row miss" role="row"><span class="lbl" role="cell">${esc(nl(n))}</span><span class="val" role="cell">${L("veri yok")}</span></div>` : result.html;
    }).join('');
    d.push(`<section class="pinned card" aria-label="${L("Sabitlenen besin öğeleri")}"><h3>${L("Sabitlenen besin öğeleri")}</h3><div class="rows" role="table" aria-label="${L("Sabitlenen değerler")}">${rows}</div></section>`);
  }
  const prep = preparationNotes(r, item);
  for (const id of cfg.sectionOrder) {
    if (cfg.hiddenSections.includes(id)) continue;
    const sec = SECTIONS.find(s => s.id === id);
    // Kalori temel değer kartında gösterilir; ayrı Kalori kutusu yok (Kaan, 2026-11-12)
    if (sec) { if (sec.id !== 'enerji') d.push(section(sec, r, cfg, open(id))); }
    else if (id === 'hesap' && !hesapFirst) d.push(derivedCard(r, cfg, open(id)));
    else if (id === 'tolerans') d.push(toleranceCard(r, item, cfg, open(id)));
    else if (id === 'kalinti') d.push(safetyExtra(cfg, open(id)));
    else if (id === 'hazirlik' && prep) d.push(`<details class="sec" data-sec="hazirlik" ${open('hazirlik') ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🍳' : ''}</span><span class="st">${L("Hazırlama ve emilim")}</span></summary>${prep}</details>`);
  }
  return d.concat(tail).join('');
}
