// Matriksi Türkçe Excel uyumlu CSV'ye çevirir (; ayraç, ondalık virgül, UTF-8 BOM)
import { NUTRIENTS, SECTIONS } from './nutrients.js';
import { referenceFor, normalizeSettings } from './settings.js';
import { derive } from './calc.js';
import { referenceLabel, percentColumnLabel } from './references.js';
import { L } from './i18n.js';
import { nutrientLabel } from './i18n-nutrients.js';

export const SRC = { u: 'USDA SR28', N: 'USDA FNDDS', F: 'USDA FDC', f: 'USDA Flavonoid', y: 'USDA İzoflavon', r: 'Tahmin (tarif)', i: 'IFCT 2017', e: 'Tahmin', d: 'Hesap', m: 'Karma', k: 'Etiket' };
// CSV formül enjeksiyonunu önle (=, +, -, @ ile başlayan metin hücreleri)
const text = (s) => (/^[=+\-@\t\r]/.test(String(s)) ? "'" + s : s);
const num = (x) => (x == null ? '' : String(Number(x.toPrecision(6))).replace('.', ','));
const cell = (s) => (/[;"\n]/.test(s) ? `"${String(s).replace(/"/g, '""')}"` : String(s));

export function matrixCSV(r, title, settings = {}) {
  settings = normalizeSettings(settings);
  const efsa = settings.referenceMode === 'efsa';
  const rows = [[text(title)], [], [L('Bölüm'), L('Bileşen'), L('Miktar'), L('Birim'), percentColumnLabel(settings), L('Kaynak'), L('Kapsam'), ...(efsa ? [L('Referans türü'), L('Referans miktarı'), L('Referans birimi'), L('Referans yılı'), L('Referans kaynak/grup')] : [])]];
  for (const sec of SECTIONS) {
    for (const n of NUTRIENTS.filter((x) => x.section === sec.id)) {
      const x = r.v[n.key];
      const cov = r.cov && r.n > 1 ? `${r.cov[n.key] || 0}/${r.n}` : '';
      const ref = referenceFor(n, settings);
      rows.push([L(sec.title), nutrientLabel(n), x == null ? L('veri yok') : num(x), n.unit, x != null && ref.value ? num((x / ref.value) * 100) : '', x == null ? '' : L(SRC[r.s[n.key]] || ''), cov, ...(efsa ? [ref.type || '', ref.value == null ? '' : num(ref.value), ref.value == null ? '' : n.unit + '/' + L('gün'), ref.year || '', ref.title] : [])]);
    }
  }
  const d = derive(r);
  rows.push([], [L('Hesaplanan göstergeler')]);
  const add = (l, v) => v != null && rows.push([L('Gösterge'), L(l), num(v)]);
  add('PRAL (mEq)', d.pral); add('Omega-6 : Omega-3', d.n6n3); add('Na : K (molar)', d.naK);
  add('Fitat : Zn (molar)', d.phyZn); add('Fitat : Fe (molar)', d.phyFe); add('Fitat : Ca (molar)', d.phyCa); add('Oksalat : Ca (molar)', d.oxCa);
  if (d.aas) rows.push([L('Gösterge'), L("Amino asit skoru (sınırlayıcı: {a})", { a: L(d.aas.limiting) }), num(d.aas.raw), '%']);
  if (efsa) rows.push([], [L('Yüzde referansı'), referenceLabel(settings)]);
  return '﻿' + rows.map((r) => r.map((c) => cell(c ?? '')).join(';')).join('\r\n');
}
