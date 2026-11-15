// Yaygın vitamin/mineraller: ayrıntılı matriksin yerine geçmeyen kısa okuma yüzeyi.
import { NUTRIENT_BY_KEY, SOURCES } from './nutrients.js';
import { normalizeSettings, referenceFor } from './settings.js';
import { referenceLabel } from './references.js';
import { nutrientLabel } from './i18n-nutrients.js';
import { esc, fmtAmount, fmtPct } from './util.js';
import { L } from './i18n.js';

const GROUPS = [
  { id: 'vitamin', title: 'Vitaminler', keys: ['vita_rae', 'thiamin', 'riboflavin', 'niacin', 'panto', 'b6', 'biotin', 'folate', 'b12', 'vitc', 'vitd', 'vite', 'vitk', 'choline'] },
  { id: 'mineral', title: 'Mineraller', keys: ['ca', 'fe', 'mg', 'p', 'k', 'na', 'zn', 'cu', 'mn', 'se', 'iodine', 'mo', 'cr', 'fluoride'] },
];

const finitePositive = value => typeof value === 'number' && Number.isFinite(value) && value > 0;
const finiteAmount = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;

// Referansın türü ve birim uyumu, tüm matriksle aynı sahipten gelir.
// Kayıtların değerleri veya kaynak kapsamı bu görünüm için değiştirilmez.
export function micronutrientSummary(result, settings = {}) {
  const cfg = normalizeSettings(settings);
  const r = result || {};
  const count = Number.isInteger(r.n) && r.n >= 0 ? r.n : 1;
  const groups = GROUPS.filter(group => !cfg.hiddenSections.includes(group.id)).map(group => {
    const rows = group.keys.map(key => {
      const nutrient = NUTRIENT_BY_KEY[key];
      const raw = r.v?.[key];
      const rawCoverage = r.cov?.[key];
      const coverageKnown = count <= 1 || (Number.isInteger(rawCoverage) && rawCoverage >= 0 && rawCoverage <= count);
      const hasValue = count > 0 && finiteAmount(raw) && !(count > 1 && rawCoverage === 0);
      const contributors = !hasValue ? 0 : count <= 1 ? 1 : coverageKnown ? rawCoverage : null;
      const partial = hasValue && coverageKnown && contributors < count;
      const status = !hasValue ? 'missing' : !coverageKnown ? 'unverified' : partial ? 'partial' : 'complete';
      const reference = referenceFor(nutrient, cfg);
      const referenceValue = finitePositive(reference.value) ? reference.value : null;
      const candidatePercent = cfg.showNrv && hasValue && coverageKnown && referenceValue != null ? raw / referenceValue * 100 : null;
      const percent = Number.isFinite(candidatePercent) ? candidatePercent : null;
      return {
        key, nutrient, value: hasValue ? raw : null, source: hasValue ? r.s?.[key] || null : null,
        contributors, count, coverageKnown, partial, status, reportedZero: hasValue && raw === 0,
        reference, referenceValue, percent, barPercent: percent == null ? null : Math.min(100, percent),
      };
    });
    return { id: group.id, title: group.title, rows, known: rows.filter(row => row.value != null).length };
  });
  const rows = groups.flatMap(group => group.rows);
  const knownRows = rows.filter(row => row.value != null);
  const sourceCounts = new Map();
  for (const row of knownRows) if (row.source) sourceCounts.set(row.source, (sourceCounts.get(row.source) || 0) + 1);
  const [source, sourceCount] = [...sourceCounts].sort((a, b) => b[1] - a[1])[0] || [];
  const baseSource = knownRows.length >= 2 && sourceCount >= knownRows.length / 2 ? source : null;
  return {
    groups, total: rows.length, known: knownRows.length, missing: rows.length - knownRows.length,
    complete: rows.filter(row => row.status === 'complete').length,
    partial: rows.filter(row => row.partial).length,
    unverified: rows.filter(row => row.status === 'unverified').length,
    baseSource,
  };
}

function sourceName(source) {
  if (source === 'k') return L('Kullanıcının ürün etiketi');
  if (source === 'd') return L('Hesaplanan değer');
  if (source === 'm') return L('Karma kaynak');
  return SOURCES[source]?.short ? L(SOURCES[source].short) : L('Kaynak belirtilmemiş');
}

function renderRow(row, cfg, baseSource, contributions) {
  const missing = row.value == null;
  const amount = missing ? null : fmtAmount(row.value, row.nutrient.unit, cfg.precision);
  const lowerBound = row.partial ? '≥ ' : '';
  const value = missing ? L('veri yok') : `${lowerBound}${amount.n} ${esc(amount.u)}`;
  const meta = [];
  if (row.partial) meta.push(L('Kısmi toplam · {a}/{b} malzemede veri', { a: row.contributors, b: row.count }));
  else if (row.status === 'unverified') meta.push(L('Malzeme kapsamı bilinmiyor'));
  if (row.reportedZero) meta.push(L('Kayıtlı değer 0'));
  if (!missing && cfg.showNrv && row.referenceValue == null && row.nutrient.nrvNote && row.reference.reason) meta.push(row.reference.reason);
  if (!missing && cfg.showSource && row.source !== baseSource) meta.push(sourceName(row.source));

  const target = row.referenceValue == null ? '' : fmtAmount(row.referenceValue, row.nutrient.unit, cfg.precision);
  const referenceText = row.percent != null ? `${lowerBound}${fmtPct(row.percent)}` : missing ? '—' : row.referenceValue == null ? L('Referans yok') : L('Yüzde hesaplanmadı');
  const referenceTitle = [row.reference.title, target ? `${L('Referans')}: ${target.n} ${target.u}` : row.reference.reason].filter(Boolean).join(' · ');
  const label = nutrientLabel(row.nutrient);
  const name = contributions
    ? `<button type="button" class="micro-name" data-action="micro-source" data-key="${row.key}" aria-label="${esc(L('{n}: katkı veren besinleri göster', { n: label }))}">${esc(label)}</button>`
    : `<span class="micro-name">${esc(label)}</span>`;
  return `<div class="micro-row${missing ? ' missing' : ''}${row.partial ? ' partial' : ''}" data-micro="${row.key}" data-micro-status="${row.status}">
    ${name}
    <strong class="micro-value">${value}</strong>
    ${cfg.showNrv ? `<span class="micro-ref" title="${esc(referenceTitle)}">${referenceText}${row.percent != null && row.reference.type ? `<small>${esc(row.reference.type)}</small>` : ''}</span>` : ''}
    ${row.percent != null ? `<span class="micro-track" aria-hidden="true"><i style="width:${row.barPercent.toFixed(2)}%"></i></span>` : ''}
    ${meta.length ? `<small class="micro-meta">${meta.map(esc).join(' · ')}</small>` : ''}
  </div>`;
}

export function renderMicronutrients(result, settings = {}, { open = true, contributions = null } = {}) {
  const cfg = normalizeSettings(settings);
  const summary = micronutrientSummary(result, cfg);
  if (!summary.total) return '';
  const source = cfg.showSource && summary.baseSource ? `<p class="micro-source">${L('Ortak kaynak: {s}', { s: esc(sourceName(summary.baseSource)) })}</p>` : '';
  const coverage = L('{known}/{total} mikro besinde veri', { known: summary.known, total: summary.total });
  return `<details class="micro-overview" data-sec="micro" data-reference="${cfg.showNrv}"${open ? ' open' : ''}>
    <summary><span class="micro-title">${L('Vitaminler ve mineraller')}</span><span class="micro-count">${coverage}</span></summary>
    <p class="micro-context">${L('Seçilen miktarın mikro besinleri. Eksik veri sıfır sayılmaz; kısmi tarif toplamı ≥ ile gösterilir.')}</p>
    ${cfg.showNrv ? `<p class="micro-reference">${esc(referenceLabel(cfg))}</p>` : ''}
    ${source}
    <div class="micro-groups">${summary.groups.map(group => `<section class="micro-group" data-micro-group="${group.id}"><h3>${L(group.title)}</h3>${group.rows.map(row => renderRow(row, cfg, summary.baseSource, ['recipe', 'day'].includes(contributions))).join('')}</section>`).join('')}</div>
  </details>`;
}
