// USDA SR28 NUTR_DEF kimlikleri. İzomer ayrımı olmayan değerler özel izomer adıyla eşlenmez.
export const USDA_NUTRIENTS = {
  water: '255', energy: '208', energy_kj: '268', ash: '207', protein: '203', fat: '204', carb: '205', fiber: '291', sugars: '269',
  ca: '301', fe: '303', mg: '304', p: '305', k: '306', na: '307', zn: '309', cu: '312', mn: '315', se: '317',
  vitc: '401', thiamin: '404', riboflavin: '405', niacin: '406', panto: '410', b6: '415', folate: '417', b12: '418',
  folic_acid: '431', food_folate: '432', folate_dfe: '435', choline: '421', vita_rae: '320', retinol: '319',
  bcarotene: '321', acarotene: '322', bcrypto: '334', lycopene: '337', lutzea: '338', vite: '323', vitd: '328', d2: '325', d3: '326', vitk: '430',
  toc_b: '341', toc_g: '342', toc_d: '343', t3_a: '344', t3_b: '345', t3_g: '346', t3_d: '347',
  starch: '209', sucrose: '210', glucose: '211', fructose: '212', lactose: '213', maltose: '214',
  trp: '501', thr: '502', ile: '503', leu: '504', lys: '505', met: '506', cys: '507', phe: '508', tyr: '509', val: '510',
  arg: '511', his: '512', ala: '513', asp: '514', glu: '515', gly: '516', pro: '517', ser: '518',
  cholesterol: '601', trans: '605', sfa: '606', mufa: '645', pufa: '646',
  f4d0: '607', f6d0: '608', f8d0: '609', f10d0: '610', f12d0: '611', f14d0: '612', f15d0: '652', f16d0: '613', f18d0: '614', f20d0: '615', f22d0: '624', f24d0: '654',
  la: '675', ala_fa: '851', f20d2: '672', f20d3: '853', aa_fa: '855', epa: '629', dpa: '631', dha: '621',
  phytosterols: '636', sitosterol: '641', campesterol: '639', stigmasterol: '638',
  f14d1_total: '625', f16d1_c: '673', f18d1_c: '674', f18d1_trans: '663', f20d1_total: '628', f22d1_c: '676', f24d1_c: '671',
  mk4: '428', caffeine: '262', theobromine: '263', betaine: '454', fluoride: '313', galactose: '287',
};
export function unitFactor(from, to) {
  const mass = { g: 0, mg: -3, 'µg': -6 };
  if (from === to) return 1;
  if (Object.hasOwn(mass, from) && Object.hasOwn(mass, to)) return 10 ** (mass[from] - mass[to]);
  throw new Error(`Uyumsuz USDA birimi: ${from} → ${to}`);
}
