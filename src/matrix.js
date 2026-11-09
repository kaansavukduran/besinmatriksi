// Besin matriksi görünümü (HTML üretimi)
import { NUTRIENTS, SECTIONS, SOURCES, ALLERGENS } from './nutrients.js';
import { derive } from './calc.js';
import { esc, fmtNum, fmtAmount, fmtPct } from './util.js';
import { normalizeSettings, referenceFor } from './settings.js';

const SRC_LABEL = { u: 'USDA', i: 'IFCT', e: 'Tahmin', d: 'Hesap', m: 'Karma', k: 'Etiket' };
const SRC_TITLE = {
  u: SOURCES.u.long, i: SOURCES.i.long, e: SOURCES.e.long,
  d: 'Diğer ölçülmüş değerlerden hesaplandı (ör. tuz = sodyum × 2,5)', m: 'Tarifteki malzemeler farklı kaynaklardan', k: 'Kullanıcının ürün etiketinden girdiği değer',
};

function srcChip(s, item) {
  if (!s) return '';
  const record = s === 'u' && item?.usda ? ` · USDA SR28 (2015), NDB ${item.usda.ndb} · ${item.usda.desc}` : s === 'i' && item?.ifct ? ` · IFCT 2017, ${item.ifct.code} · ${item.ifct.name}` : s === 'e' && item?.estFrom ? ` · IFCT 2017 çiğ kaynak kaydı: ${item.estFrom}; protein/yağ oranı ile tahmin` : '';
  return `<span class="src src-${s}" title="${esc(SRC_TITLE[s] + record)}">${SRC_LABEL[s]}</span>`;
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
      <span class="pct">${fmtPct(p)}</span></span>`;
  }
  const extra = [];
  if (x === 0 && (s === 'u' || s === 'i' || s === 'k')) extra.push('<span class="flag" title="Kaynak bu değeri 0 olarak bildiriyor (tespit sınırının altında olabilir)">kaynak 0</span>');
  if (cfg.showSd && r.sd?.[n.key] != null) extra.push(`<span class="sd" title="IFCT standart sapması">± ${fmtAmount(r.sd[n.key], n.unit, cfg.precision).n}</span>`);
  if (cfg.showAlt && r.alt?.[n.key] != null) {
    const a = fmtAmount(r.alt[n.key], n.unit, cfg.precision);
    extra.push(`<span class="alt" title="Aynı besinin IFCT 2017 ölçümü (farklı örnek). İki kaynak birlikte olası aralığı gösterir.">IFCT: ${a.n} ${esc(a.u)}</span>`);
  }
  if (r.cov && r.n > 1 && (r.cov[n.key] || 0) < r.n) {
    extra.push(`<span class="flag partial" title="Bu bileşen yalnızca bazı malzemelerde ölçülmüş; toplam eksik olabilir">kısmi ${r.cov[n.key]}/${r.n}</span>`);
  }
  return {
    missing: false,
    html: `<div class="row" role="row">
      <span class="lbl" role="cell">${esc(n.label)}</span>
      <span class="val" role="cell">${valueCell(n, x, cfg)}</span>
      ${pct ? `<span class="pctc" role="cell">${pct}</span>` : '<span class="pctc" role="cell"></span>'}
      <span class="meta" role="cell">${cfg.showSource ? srcChip(s, cfg.sourceItem) : ''}${extra.join('')}</span>
    </div>`,
  };
}

function section(sec, r, cfg, open) {
  const list = NUTRIENTS.filter((n) => n.section === sec.id && n.key !== 'energy_kj');
  let html = '', sub = undefined, have = 0;
  const missing = [];
  for (const n of list) {
    if (n.key === 'energy') {
      if (r.v.energy == null) { missing.push(n.label); continue; }
      have++;
      const kj = r.v.energy_kj;
      const ref = referenceFor(n, cfg);
      const p = ref.value ? (r.v.energy / ref.value) * 100 : null;
      const amount = cfg.energyUnit === 'kj' ? `${fmtNum(kj, cfg.precision)} <span class="unit">kJ</span>` : `${fmtNum(r.v.energy, cfg.precision)} <span class="unit">kcal</span>`;
      html += `<div class="row" role="row"><span class="lbl" role="cell">Enerji</span>
        <span class="val" role="cell"><span class="num">${amount}</span>
        ${kj != null && cfg.energyUnit === 'both' ? `<span class="kj">· ${fmtNum(kj, cfg.precision)} kJ</span>` : ''}</span>
        <span class="pctc" role="cell">${cfg.showNrv && p != null ? `<span class="nrv" title="${esc(ref.title)}; ${ref.label} ${fmtNum(ref.value)} kcal"><span class="bar"><i style="width:${Math.min(100, p).toFixed(1)}%"></i></span><span class="pct">${fmtPct(p)}</span></span>` : ''}</span>
        <span class="meta" role="cell">${cfg.showSource ? srcChip(r.s.energy, cfg.sourceItem) : ''}${r.cov && r.cov.energy < r.n ? `<span class="flag partial">kısmi ${r.cov.energy}/${r.n}</span>` : ''}</span></div>`;
      continue;
    }
    const rr = row(n, r, cfg);
    if (rr.missing) {
      missing.push(n.label);
      if (cfg.showMissing) {
        if (n.sub !== sub) { sub = n.sub; if (sub) html += `<div class="sub">${esc(sub)}</div>`; }
        html += `<div class="row miss" role="row"><span class="lbl" role="cell">${esc(n.label)}</span><span class="val" role="cell">veri yok</span><span class="pctc" role="cell"></span><span class="meta" role="cell"></span></div>`;
      }
      continue;
    }
    have++;
    if (n.sub !== sub) { sub = n.sub; if (sub) html += `<div class="sub">${esc(sub)}</div>`; }
    html += rr.html;
  }
  const total = have + missing.length;
  const missNote = missing.length && !cfg.showMissing
    ? `<button class="linkish miss-note" data-action="toggle-missing" title="${esc(missing.join(', '))}">Veri yok: ${missing.length} bileşen · göster</button>`
    : '';
  const body = have
    ? `<div class="rows" role="table" aria-label="${esc(sec.title)}">${html}</div>${missNote}`
    : `<p class="empty">Bu form için bu başlıkta ölçüm verisi yok. ${missing.length ? `(${missing.length} bileşen tanımlı, hiçbiri ölçülmemiş.)` : ''}</p>${cfg.showMissing ? `<div class="rows">${html}</div>` : ''}`;
  return `<details class="sec" data-sec="${sec.id}" ${open ? 'open' : ''}>
    <summary><span class="ico" aria-hidden="true">${cfg.emoji ? sec.icon : ''}</span><span class="st">${esc(sec.title)}</span>
    <span class="cov ${have ? '' : 'none'}" title="Verisi olan bileşen / tanımlı bileşen">${have}/${total}</span></summary>
    ${body}</details>`;
}

function ratioRow(label, val, fmt, verdict, help) {
  return `<div class="row"><span class="lbl">${label}</span><span class="val"><span class="num">${fmt}</span></span>
    <span class="pctc">${verdict ? `<span class="chip ${verdict[0]}">${verdict[1]}</span>` : ''}</span>
    <span class="meta"><span class="help" title="${esc(help)}">?</span></span></div>`;
}

function derivedCard(r, cfg, open) {
  const d = derive(r);
  let h = '';
  if (d.energySplit) {
    const e = d.energySplit;
    h += `<div class="split" aria-label="Enerji dağılımı">
      <div class="splitbar"><i class="sp-p" style="width:${e.p}%"></i><i class="sp-c" style="width:${e.c}%"></i><i class="sp-f" style="width:${e.f}%"></i><i class="sp-fib" style="width:${e.fib}%"></i></div>
      <div class="legend"><span><b class="sp-p"></b>Protein ${fmtPct(e.p)}</span><span><b class="sp-c"></b>Karbonhidrat ${fmtPct(e.c)}</span><span><b class="sp-f"></b>Yağ ${fmtPct(e.f)}</span><span><b class="sp-fib"></b>Lif ${fmtPct(e.fib)}</span></div>
      <p class="hint">Atwater genel faktörleri (4 / 4 / 9 / 2 kcal/g) ile yaklaşık enerji payları.</p></div>`;
  }
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
    aas = `<div class="aas"><div class="aas-head"><b>Amino asit skoru: ${fmtNum(a.raw)}%</b>
      <span class="chip ${a.raw >= 100 ? 'ok' : a.raw >= 75 ? 'warn' : 'bad'}">Sınırlayıcı: ${esc(a.limiting)}</span>
      <span class="help" title="WHO/FAO/UNU 2007 yetişkin referans örüntüsüne göre (mg/g protein). Sindirilebilirlik düzeltmesi YOK; PDCAAS/DIAAS değildir.${a.complete ? '' : ' Bazı amino asitler ölçülmemiş.'}">?</span></div>
      <div class="aabars">${a.rows.map((x) => `<div class="aabar" title="${esc(x.label)}: ${x.mgPerG == null ? 'veri yok' : fmtNum(x.mgPerG) + ' mg/g protein, referans ' + x.ref}">
        <span class="aal">${esc(x.label)}</span><span class="aat"><i class="${x.ratio == null ? 'na' : x.ratio >= 1 ? 'ok' : 'low'}" style="width:${x.ratio == null ? 0 : Math.min(150, x.ratio * 100) / 1.5}%"></i><em style="left:${100 / 1.5}%"></em></span>
        <span class="aav">${x.ratio == null ? '–' : fmtPct(x.ratio * 100)}</span></div>`).join('')}</div>
      <p class="hint">Çizgi = referans (%100). Baklagil + tahıl birlikte tüketilince sınırlayıcı amino asitler birbirini tamamlar; tarif sekmesinde dene.</p></div>`;
  }
  const body = (h + (rows.length ? `<div class="rows">${rows.join('')}</div>` : '') + aas) || '<p class="empty">Hesaplama için gerekli veriler yok.</p>';
  return `<details class="sec" data-sec="hesap" ${open ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🧮' : ''}</span><span class="st">Hesaplanan göstergeler</span></summary>${body}</details>`;
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
  return `<ul class="notes">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul><p class="hint">Bunlar genel beslenme bilimi kurallarıdır; bu besine özgü ölçüm değildir.</p>`;
}

function toleranceCard(r, item, cfg, open) {
  const unknownAllergens = item?.custom || item?.ext;
  const al = (item?.allergens || []).map((a) => `<span class="chip warn">${esc(ALLERGENS[a] || a)}</span>`).join('');
  const rfo = ['raffinose', 'stachyose', 'verbascose', 'ajugose'].map((k) => r.v[k]).filter((x) => x != null);
  const rfoSum = rfo.reduce((a, b) => a + b, 0);
  const lines = [];
  lines.push(`<div class="kv"><span>Alerjenler (AB 14 listesi)</span><span>${unknownAllergens ? '<span class="muted">Bilgi girilmedi; ürün etiketini kontrol et</span>' : al || (item ? '<span class="chip ok">Katalogda bildirilen yok</span>' : '<span class="muted">tarif: malzemelere bak</span>')}</span></div>`);
  lines.push(`<div class="kv"><span>Gluten</span><span>${unknownAllergens ? 'veri yok; ürün etiketi ve çapraz bulaşma bilgisi gerekli' : item?.allergens?.includes('gluten') ? 'İçerir' : item ? 'Tahıl kaynaklı gluten beklenmez (çapraz bulaşma ürüne göre)' : '–'}</span></div>`);
  lines.push(`<div class="kv"><span>FODMAP</span><span>${rfo.length ? `Rafinoz ailesi (GOS) ölçülmüş: ${fmtNum(rfoSum)} g. ` : ''}Porsiyon eşikleri: <b>veri yok</b> (Monash / FODMAP Friendly verileri lisanslı, bu uygulamada yok).</span></div>`);
  if (r.v.lactose != null) lines.push(`<div class="kv"><span>Laktoz</span><span>${fmtNum(r.v.lactose)} g</span></div>`);
  lines.push(`<div class="kv"><span>Histamin / biyojen aminler</span><span><b>veri yok</b></span></div>`);
  if (item?.note) lines.push(`<div class="note">⚠️ ${esc(item.note)}</div>`);
  return `<details class="sec" data-sec="tolerans" ${open ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🤧' : ''}</span><span class="st">Alerji, intolerans ve uyarılar</span></summary><div class="kvs">${lines.join('')}</div></details>`;
}

function safetyExtra(cfg, open) {
  const items = ['Pestisit kalıntıları', 'Küf toksinleri (aflatoksin, okratoksin)', 'Akrilamid, PAH, nitrozaminler, 3-MCPD', 'Mikrobiyal bulaşma', 'Ambalajdan geçen maddeler', 'İyot', 'Florür'];
  return `<details class="sec" data-sec="kalinti" ${open ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🧫' : ''}</span><span class="st">Kalıntılar, bulaşanlar ve kapsam dışı</span></summary>
    <p class="empty">Bu başlıklar ürün partisine, bölgeye ve işleme bağlıdır; uygulamadaki açık veri setlerinde ölçüm yok:</p>
    <div class="chips">${items.map((x) => `<span class="chip">${x}: veri yok</span>`).join('')}</div>
    <p class="hint">Glisemik indeks / glisemik yük: veri yok (yayımlanmış GI tabloları test koşuluna bağlı ve lisanslı).</p></details>`;
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
    rows.push(['Ölçüm temeli', `${fmtNum(r.grams)} ${item.liquid ? 'g (sıvılarda ≈ mL; yoğunluk ≈ 1 kabulü)' : 'g yenebilir kısım'} · kaynak değerleri 100 g başına`]);
    if (item.custom) rows.push(['Kaynak', 'Ürün etiketinden elle girildi; girilmeyen bileşenler “veri yok” sayılır.']);
    if (item.usda) {
      let part = 'Yenebilir kısım';
      if (item.usda.refuse) part += ` · satın alınan ağırlığın %${item.usda.refuse}'i atılır${item.usda.refDesc ? ` (${esc(item.usda.refDesc)})` : ''}`;
      rows.push(['İncelenen kısım', part]);
      rows.push(['USDA kaydı', `${esc(item.usda.desc)} <span class="muted">· NDB ${esc(item.usda.ndb)}</span>`]);
    }
    if (item.ifct) rows.push(['IFCT kaydı', `${esc(item.ifct.name)} <span class="muted">· ${esc(item.ifct.code)}${item.ifct.regions ? ` · ${item.ifct.regions} bölge örneği` : ''}</span>`]);
    if (item.estFrom) rows.push(['Tahmin', 'Amino asit ve yağ asidi profilleri aynı besinin çiğ/kuru IFCT ölçümünden bu formun protein/yağ değerine oranlandı (“Tahmin” etiketi).']);
    rows.push(['Değişkenler', 'Çeşit, olgunluk, mevsim, toprak, saklama ve laboratuvar yöntemi değerleri değiştirir; iki kaynak arasındaki fark doğal aralığı gösterir.']);
  }
  return `<div class="idcard">${rows.map(([k, v]) => `<div class="kv"><span>${k}</span><span>${v}</span></div>`).join('')}</div>`;
}

function coverage(r, cfg) {
  const secs = SECTIONS.map((s) => {
    const list = NUTRIENTS.filter((n) => n.section === s.id && n.key !== 'energy_kj');
    const have = list.filter((n) => r.v[n.key] != null).length;
    const partial = r.cov && r.n > 1 ? list.filter(n => r.v[n.key] != null && r.cov[n.key] < r.n).length : 0;
    return { s, have, partial, total: list.length };
  });
  return `<div class="coverage">${secs.map((x) => `<span class="covchip ${x.have === 0 ? 'none' : x.have / x.total > 0.6 && !x.partial ? 'full' : 'part'}" title="${esc(x.s.title)}: ${x.have}/${x.total}; ${x.partial} kısmi malzeme kapsamı">${cfg.emoji ? x.s.icon + ' ' : ''}${x.have}/${x.total}</span>`).join('')}</div>`;
}

export function renderMatrix(r, cfg, ctx = {}) {
  cfg = normalizeSettings(cfg);
  const item = ctx.item || null;
  cfg.sourceItem = item;
  const open = (id) => !ctx.closed?.has(id);
  const d = [identityCard(item, r, cfg, ctx), coverage(r, cfg), `<p class="hint reference-label">${cfg.referenceMode === 'custom' ? '%hedef: elle girilen hedefler, öneri değildir. Hedef girilmeyen bileşenlerde yüzde gösterilmez.' : '%BRD: AB 1169/2011 (2011) yetişkin etiket referansı / TGK. Kişisel ihtiyaç değildir.'}</p>`];
  if (cfg.hiddenSections.length) d.push(`<p class="hint">${cfg.hiddenSections.length} bölüm ayarlarda gizlendi. Kapsam özeti ve CSV tüm bileşenleri içerir.</p>`);
  if (cfg.pinnedNutrients.length) {
    const rows = cfg.pinnedNutrients.map(k => NUTRIENTS.find(n => n.key === k)).map(n => {
      const result = row(n, r, cfg);
      return result.missing ? `<div class="row miss" role="row"><span class="lbl" role="cell">${esc(n.label)}</span><span class="val" role="cell">veri yok</span></div>` : result.html;
    }).join('');
    d.push(`<section class="pinned card" aria-label="Sabitlenen besin öğeleri"><h3>Sabitlenen besin öğeleri</h3><div class="rows" role="table" aria-label="Sabitlenen değerler">${rows}</div></section>`);
  }
  const prep = preparationNotes(r, item);
  for (const id of cfg.sectionOrder) {
    if (cfg.hiddenSections.includes(id)) continue;
    const sec = SECTIONS.find(s => s.id === id);
    if (sec) d.push(section(sec, r, cfg, open(id)));
    else if (id === 'hesap') d.push(derivedCard(r, cfg, open(id)));
    else if (id === 'tolerans') d.push(toleranceCard(r, item, cfg, open(id)));
    else if (id === 'kalinti') d.push(safetyExtra(cfg, open(id)));
    else if (id === 'hazirlik' && prep) d.push(`<details class="sec" data-sec="hazirlik" ${open('hazirlik') ? 'open' : ''}><summary><span class="ico">${cfg.emoji ? '🍳' : ''}</span><span class="st">Hazırlama ve emilim</span></summary>${prep}</details>`);
  }
  return d.join('');
}
