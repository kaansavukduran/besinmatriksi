// WHO/FAO/UNU 2007, TRS 935, Table 23: average adult requirements, mg/kg/day.
// Met and Phe contribute to joint targets; they are not independent daily targets.
import { L } from './i18n.js';
import { fmtNum } from './util.js';
export const AA_DAILY = Object.freeze({ his: 10, ile: 20, leu: 39, lys: 30, met: 15, phe: 25, thr: 15, trp: 4, val: 26 });
export function aminoReference(key, profile = {}) {
  if (!Object.hasOwn(AA_DAILY, key)) return null;
  if ((profile.age != null && profile.age < 18) || profile.specialContext) return { unavailable: true };
  const personal = profile.age >= 18 && Number.isFinite(profile.weight) && profile.weight >= 10 && profile.weight <= 400;
  const weight = personal ? profile.weight : 70;
  const joint = key === 'met' ? L("Metiyonin + sistein ortak hedefine katkı") : key === 'phe' ? L("Fenilalanin + tirozin ortak hedefine katkı") : '';
  return { value: AA_DAILY[key] * weight, weight, personal, joint,
    title: L("WHO/FAO/UNU 2007 · yetişkin ortalama ihtiyacı · {w} kg × {r} mg/kg/gün", { w: fmtNum(weight), r: AA_DAILY[key] }) };
}
export function aminoNote(profile) {
  const ref = aminoReference('his', profile);
  if (ref.unavailable) return L("Bu profil için yetişkin amino asit referansı uygulanmadı. Çocuklar ve özel durumlar için ayrı değerlendirme gerekir.");
  return (ref.personal ? L("Amino asit günlük referansı: kayıtlı yetişkin profili, {w} kg.", { w: fmtNum(ref.weight) }) : L("Amino asit günlük referansı: 70 kg yetişkin örneği. Kendi kilon için Günlük ve profil bölümünde yaş ve kilonu kaydet.")) + ' ' + L("WHO/FAO/UNU 2007 ortalama ihtiyacı; emilim veya kişisel yeterlilik ölçümü değildir. Metiyonin ve fenilalanin çubukları ortak hedefe yalnız o amino asidin katkısını gösterir. ≥: eksik ölçümlü toplam.");
}
