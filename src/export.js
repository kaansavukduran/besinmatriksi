// Matriksi Türkçe Excel uyumlu CSV'ye çevirir (; ayraç, ondalık virgül, UTF-8 BOM)
import { NUTRIENTS, SECTIONS } from './nutrients.js';
import { derive } from './calc.js';

const SRC = { u: 'USDA SR28', i: 'IFCT 2017', e: 'Tahmin', d: 'Hesap', m: 'Karma', k: 'Etiket' };
const num = (x) => (x == null ? '' : String(Number(x.toPrecision(6))).replace('.', ','));
const cell = (s) => (/[;"\n]/.test(s) ? `"${String(s).replace(/"/g, '""')}"` : String(s));

export function matrixCSV(r, title) {
  const rows = [[title], [], ['Bölüm', 'Bileşen', 'Miktar', 'Birim', '%BRD', 'Kaynak', 'Kapsam']];
  for (const sec of SECTIONS) {
    for (const n of NUTRIENTS.filter((x) => x.section === sec.id)) {
      const x = r.v[n.key];
      const cov = r.cov && r.n > 1 ? `${r.cov[n.key] || 0}/${r.n}` : '';
      rows.push([sec.title, n.label, x == null ? 'veri yok' : num(x), n.unit, x != null && n.nrv ? num((x / n.nrv) * 100) : '', x == null ? '' : SRC[r.s[n.key]] || '', cov]);
    }
  }
  const d = derive(r);
  rows.push([], ['Hesaplanan göstergeler']);
  const add = (l, v) => v != null && rows.push(['Gösterge', l, num(v)]);
  add('PRAL (mEq)', d.pral); add('Omega-6 : Omega-3', d.n6n3); add('Na : K (molar)', d.naK);
  add('Fitat : Zn (molar)', d.phyZn); add('Fitat : Fe (molar)', d.phyFe); add('Fitat : Ca (molar)', d.phyCa); add('Oksalat : Ca (molar)', d.oxCa);
  if (d.aas) rows.push(['Gösterge', `Amino asit skoru (sınırlayıcı: ${d.aas.limiting})`, num(d.aas.raw), '%']);
  return '﻿' + rows.map((r) => r.map((c) => cell(c ?? '')).join(';')).join('\r\n');
}
