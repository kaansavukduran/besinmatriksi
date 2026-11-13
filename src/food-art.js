// Besin resimleri: her küratörlü besine kendi küçük SVG çizimi (çevrimdışı, el yapımı, lisans gerektirmez).
// Çizim = şekil şablonu + besine özgü renk/biçim parametreleri. Aynı parametre iki besinde kullanılmaz (test eder).
// viewBox 0 0 32 32; renkler sabit (temadan bağımsız okunur), ince koyu kontur her zeminde ayrışır.

const K = '#2b2233'; // kontur
const st = (w = 1.2) => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const shine = (x = 12, y = 13, rx = 2.6, ry = 1.7) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".45"/>`;
const leaf = (c = '#4caf50', x = 17, y = 7) => `<path d="M${x} ${y} q4-4 8-1 q-4 4-8 1z" fill="${c}" ${st(1)}/>`;
const stem = (x = 16, y = 8) => `<path d="M${x} ${y} q.5-3 2-4.5" fill="none" ${st(1.4)}/>`;

const SHAPES = {
  // Ekmek: loaf (somun), flat (pide/lavaş); kızartma; patlamış mısır
  bread: (c, c2 = '#f5deb3', v = 'loaf') => (v === 'flat'
    ? `<ellipse cx="16" cy="18" rx="13" ry="8" fill="${c}" ${st()}/><ellipse cx="16" cy="17" rx="10" ry="5.5" fill="${c2}" opacity=".55"/>` + [[11, 16], [16, 15], [21, 17], [14, 20], [19, 20]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${K}" opacity=".35"/>`).join('')
    : `<path d="M5 15 q0-8 11-8 q11 0 11 8 v10 q0 3-3 3 h-16 q-3 0-3-3z" fill="${c}" ${st()}/><path d="M7 16 q9-3 18 0 v8 q0 2-2 2 h-14 q-2 0-2-2z" fill="${c2}"/>` + [11, 16, 21].map((x) => `<path d="M${x - 2} 9 l3 3" stroke="${K}" stroke-width=".8" opacity=".45"/>`).join('')),
  fries: (c, c2 = '#e53935') => `<path d="M7 14 h18 l-2 15 h-14z" fill="${c2}" ${st()}/>` + [9, 12, 15, 18, 21].map((x, i) => `<rect x="${x}" y="${4 + (i % 2) * 2}" width="2.6" height="12" rx="1" fill="${c}" ${st(.7)}/>`).join('') + `<path d="M7 14 h18 l-2 15 h-14z" fill="${c2}" ${st()}/><circle cx="16" cy="21" r="2.4" fill="#fff" opacity=".7"/>`,
  popcorn: (c, c2 = '#e53935') => `<path d="M8 15 h16 l-2 14 h-12z" fill="#ffffff" ${st()}/><path d="M11 15 l1 14 M16 15 v14 M21 15 l-1 14" stroke="${c2}" stroke-width="1.6"/>` + [[10, 12], [14, 10], [18, 11], [22, 13], [12, 7], [17, 6], [20, 8], [15, 14]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${c}" ${st(.7)}/>`).join(''),
  water: (c, c2 = '#90caf9') => `<path d="M8 6 h16 l-2 22 h-12z" fill="${c}" opacity=".35" ${st()}/><path d="M9.2 12 h13.6 l-1.5 16 h-10.6z" fill="${c2}"/><path d="M8 6 h16 l-2 22 h-12z" fill="none" ${st()}/><path d="M13 18 q3 2 6 0" fill="none" stroke="#fff" stroke-width="1"/>`,
  // Yuvarlak meyve/sebze. o: dots (narenciye), stripes (kavun), crease (çekirdekli), crown (nar), seeds (çilek)
  round: (c, c2 = '#4caf50', o = '') => {
    let s = `<circle cx="16" cy="18" r="11" fill="${c}" ${st()}/>`;
    if (o.includes('crease')) s += `<path d="M16 8 q-3 10 0 21" fill="none" stroke="${K}" stroke-width=".8" opacity=".55"/>`;
    if (o.includes('stripes')) s += `<path d="M9 10 q-3 8 0 16 M16 7 v22 M23 10 q3 8 0 16" fill="none" stroke="${c2}" stroke-width="1.6" opacity=".9"/>`;
    if (o.includes('dots')) s += [[11, 15], [20, 14], [14, 22], [21, 22], [17, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${K}" opacity=".35"/>`).join('');
    if (o.includes('seeds')) s += [[12, 15], [17, 13], [21, 17], [14, 21], [19, 23], [11, 19]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".6" ry=".9" fill="#ffe08a"/>`).join('');
    if (o.includes('crown')) s += `<path d="M13 8 l1-3 1.5 2 1.5-2.5 1.5 2.5 1.5-2 1 3z" fill="${c}" ${st(1)}/>`;
    else if (!o.includes('noleaf')) s += stem() + leaf(c2);
    if (o.includes('half')) s += `<circle cx="16" cy="18" r="7" fill="${c2}" opacity=".9"/><circle cx="16" cy="18" r="2.2" fill="${K}" opacity=".6"/>`;
    return s + shine();
  },
  pear: (c, c2 = '#4caf50') => `<path d="M16 6 c-3 0-3 5-5 9 c-3 5-1 13 5 13 s8-8 5-13 c-2-4-2-9-5-9z" fill="${c}" ${st()}/>` + stem(16, 6) + leaf(c2, 17, 5) + shine(13, 18),
  // Salkım: üzüm, yaban mersini, dut
  cluster: (c, c2 = '#4caf50', n = 'grape') => {
    const pts = n === 'berry' ? [[11, 18], [18, 15], [21, 22], [13, 25], [16, 20]] : [[10, 12], [16, 12], [22, 12], [13, 17], [19, 17], [16, 22], [13, 27 - 5], [19, 22], [16, 27]];
    const r = n === 'berry' ? 4.6 : 3.6;
    return pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${st(1)}/>`).join('') + (n === 'berry' ? '' : stem(16, 8) + leaf(c2, 17, 6)) + pts.slice(0, 3).map(([x, y]) => `<circle cx="${x - 1}" cy="${y - 1}" r=".9" fill="#fff" opacity=".5"/>`).join('');
  },
  // Uzun: muz, salatalık, kabak, havuç, patlıcan, biber, mısır, kuşkonmaz
  long: (c, c2 = '#4caf50', v = 'cuke') => {
    if (v === 'banana') return `<path d="M5 9 q4 17 22 15 q-1 3-4 3 q-17 1-20-17z" fill="${c}" ${st()}/><path d="M5 9 l-1-2" ${st(2)}/>`;
    if (v === 'carrot') return `<path d="M10 9 l12 3 l-13 17 z" fill="${c}" ${st()}/><path d="M11 13 l5 1 M10 18 l4 1" stroke="${K}" stroke-width=".8" opacity=".5"/><path d="M13 9 q-2-5 1-6 M16 10 q1-5 5-5 M18 11 q4-3 6 0" fill="none" stroke="${c2}" stroke-width="2"/>`;
    if (v === 'eggplant') return `<path d="M11 9 q-8 6-4 15 q4 6 12 3 q8-4 6-12 q-2-6-9-7z" fill="${c}" ${st()}/><path d="M11 9 q2-4 6-2 l-1 3 q-3-1-5-1z" fill="${c2}" ${st(1)}/>` + shine(12, 16);
    if (v === 'pepper') return `<path d="M9 11 q-2 12 6 17 q2 1 4 0 q8-5 5-17 q-3-3-7-1 q-5-2-8 1z" fill="${c}" ${st()}/><path d="M15 10 q0-4 3-6" fill="none" stroke="${c2}" stroke-width="2.2"/>` + shine(12, 16);
    if (v === 'chili') return `<path d="M8 9 q2 0 3 2 q2 12 14 17 q-14 0-17-17z" fill="${c}" ${st()}/><path d="M8 9 q-1-3 2-4" fill="none" stroke="${c2}" stroke-width="2.2"/>`;
    if (v === 'corn') return `<path d="M16 4 q7 4 6 14 q-1 10-6 11 q-5-1-6-11 q-1-10 6-14z" fill="${c}" ${st()}/>` + [8, 12, 16, 20, 24].map((y) => `<path d="M11 ${y} h10" stroke="${K}" stroke-width=".6" opacity=".4"/>`).join('') + `<path d="M10 29 q-5-8 0-14 M22 29 q5-8 0-14" fill="${c2}" ${st(1)}/>`;
    if (v === 'spear') return `<path d="M14 29 l1-20 q1-5 2 0 l1 20z" fill="${c}" ${st()}/><path d="M15 12 l-2-2 M17 15 l2-2 M15 19 l-2-2" stroke="${c2}" stroke-width="1.2"/>`;
    if (v === 'okra') return `<path d="M12 6 q-2 1 0 3 l5 19 q2 2 3 0 l-3-19 q1-3-5-3z" fill="${c}" ${st()}/><path d="M14 10 l4 16" stroke="${K}" stroke-width=".6" opacity=".4"/>`;
    // cuke / zucchini / leek / celery
    return `<rect x="5" y="12" width="22" height="9" rx="4.5" fill="${c}" ${st()} transform="rotate(-25 16 16)"/>` + (v === 'leek' ? `<path d="M22 9 q4-5 6-3 M22 9 q2-6 5-6" fill="none" stroke="${c2}" stroke-width="2.4"/>` : '') +
      (v === 'cuke' ? [[10, 18], [15, 15], [20, 13]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${c2}"/>`).join('') : '') + (v === 'zucchini' ? `<path d="M24 10 l3-2" ${st(2)}/>` : '');
  },
  // Yapraklı yeşillik. v: broad (ıspanak), curly (kale), lettuce (baş), herb dalı ayrı
  leafy: (c, c2 = '#2e7d32', v = 'broad') => {
    if (v === 'floret') return `<path d="M13 29 l1-9 h4 l1 9z" fill="${c2}" ${st()}/><path d="M14 21 l-4-4 M18 21 l4-4" stroke="${c2}" stroke-width="2"/>` + [[9, 14], [16, 11], [23, 14], [12, 18], [20, 18], [16, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="${c}" ${st(1)}/>`).join('');
    if (v === 'head') return `<circle cx="16" cy="18" r="11" fill="${c}" ${st()}/><path d="M9 14 q7 4 14 0 M8 20 q8 4 16 0" fill="none" stroke="${c2}" stroke-width="1.2"/>` + shine();
    if (v === 'curly') return `<path d="M16 29 v-8 M16 21 q-9 2-10-6 q2 1 2-2 q2 1 3-2 q2 1 5-1 q3 2 5 1 q1 3 3 2 q0 3 2 2 q-1 8-10 6z" fill="${c}" ${st()}/><path d="M16 26 v-14" stroke="${c2}" stroke-width="1.2"/>`;
    if (v === 'stalk') return `<path d="M13 29 q-1-8 0-12 h6 q1 4 0 12z" fill="${c2}" ${st()}/><path d="M16 18 q-10-1-9-11 q9 1 9 11z M16 18 q10-1 9-11 q-9 1-9 11z" fill="${c}" ${st()}/>`;
    if (v === 'vine') return `<path d="M16 28 q-12-6-10-16 l4 2 l2-6 l4 4 l4-4 l2 6 l4-2 q2 10-10 16z" fill="${c}" ${st()}/><path d="M16 27 v-14 M16 20 l-5-4 M16 20 l5-4" stroke="${c2}" stroke-width="1"/>`;
    return `<path d="M16 29 q-11-6-9-17 q7-6 9-8 q2 2 9 8 q2 11-9 17z" fill="${c}" ${st()}/><path d="M16 28 v-21 M16 14 l-5-3 M16 19 l-6-3 M16 14 l5-3 M16 19 l6-3" stroke="${c2}" stroke-width="1"/>`;
  },
  // Soğanlı/yumru: soğan, sarımsak, rezene, pancar, turp, şalgam
  bulb: (c, c2 = '#4caf50', v = 'onion') => {
    if (v === 'garlic') return `<path d="M16 6 q-1 4-6 8 q-5 5-1 11 q7 5 14 0 q4-6-1-11 q-5-4-6-8z" fill="${c}" ${st()}/><path d="M16 12 v16 M12 14 q-2 6 0 13 M20 14 q2 6 0 13" fill="none" stroke="${K}" stroke-width=".7" opacity=".45"/>`;
    const root = v === 'root' ? `<path d="M16 28 v3" ${st(1.2)}/>` : `<path d="M13 28 q3 3 6 0" fill="none" ${st(1)}/>`;
    return `<path d="M16 7 q-11 7-10 14 q1 7 10 7 q9 0 10-7 q1-7-10-14z" fill="${c}" ${st()}/>` + root + `<path d="M16 7 q-2-4 0-6 M16 7 q3-3 5-4" fill="none" stroke="${c2}" stroke-width="2"/>` + shine(12, 17);
  },
  tuber: (c, c2 = '#7b5a3a', v = 'potato') => (v === 'sweet'
    ? `<path d="M4 18 q4-9 13-8 q10 1 12 6 q-2 7-12 8 q-9 1-13-6z" fill="${c}" ${st()}/>`
    : v === 'knob' ? `<path d="M8 12 q4-6 9-3 q3-3 7 0 q4 4 0 8 q4 5-2 9 q-5 3-9-1 q-6 1-6-5 q-3-4 1-8z" fill="${c}" ${st()}/>`
      : `<path d="M6 17 q0-9 10-9 q11 0 11 9 q0 10-11 10 q-10 0-10-10z" fill="${c}" ${st()}/>`) +
    [[12, 15], [19, 13], [21, 20], [13, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${c2}"/>`).join('') + shine(11, 13),
  // Baklagil yığını: bean (fasulye), round (nohut/bezelye), lentil (mercimek), pod (taze fasulye/bakla)
  legume: (c, c2 = '#fff', v = 'bean') => {
    if (v === 'pod') return `<path d="M5 22 q10-16 23-14 q-3 13-23 14z" fill="${c}" ${st()}/>` + [[11, 18], [16, 15], [21, 12]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="2" fill="${c2}" opacity=".85"/>`).join('');
    if (v === 'round') return [[11, 13], [20, 13], [16, 20], [9, 22], [23, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${c}" ${st(1)}/><path d="M${x - 1} ${y - 3} q1 1 2 0" fill="none" stroke="${c2}" stroke-width=".8"/>`).join('');
    if (v === 'lentil') return [[10, 12], [19, 11], [24, 18], [14, 18], [8, 22], [18, 25], [22, 24 - 1]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.6" fill="${c}" ${st(.9)}/>`).join('');
    if (v === 'mash') return `<path d="M5 18 h22 q-1 10-11 10 q-10 0-11-10z" fill="#e8e1d5" ${st()}/><path d="M7 18 q2-6 9-6 q7 0 9 6z" fill="${c}" ${st(1)}/><circle cx="16" cy="14" r="1.6" fill="${c2}"/>`;
    return [[11, 12, -30], [21, 12, 25], [16, 20, 0], [10, 23, 20], [22, 23, -20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.3" fill="${c}" ${st(1)} transform="rotate(${r} ${x} ${y})"/><circle cx="${x}" cy="${y - .5}" r=".9" fill="${c2}"/>`).join('');
  },
  // Tahıl: ear (başak), bowl (tane dolu kâse), bread (ekmek/un), noodle (makarna)
  grain: (c, c2 = '#c8a24a', v = 'ear') => {
    if (v === 'bowl') return `<path d="M4 17 h24 q-1 11-12 11 q-11 0-12-11z" fill="${c2}" ${st()}/>` + [[9, 15], [13, 14], [17, 14], [21, 15], [11, 12], [15, 11], [19, 12], [24, 16]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1.1" fill="${c}" ${st(.6)}/>`).join('');
    if (v === 'sack') return `<path d="M8 12 q-3 16 8 16 q11 0 8-16 l-2-4 h-12z" fill="${c2}" ${st()}/><path d="M10 8 q6 3 12 0" fill="none" ${st(1)}/><ellipse cx="16" cy="9" rx="5" ry="1.6" fill="${c}"/><text x="16" y="23" text-anchor="middle" font-size="7" font-weight="700" fill="${K}" font-family="sans-serif">${c === '#ffffff' ? 'U' : ''}</text>`;
    if (v === 'pasta') return `<path d="M6 10 q5 4 10 0 q5-4 10 0 M6 16 q5 4 10 0 q5-4 10 0 M6 22 q5 4 10 0 q5-4 10 0" fill="none" stroke="${c}" stroke-width="3.2"/><path d="M6 10 q5 4 10 0 q5-4 10 0" fill="none" stroke="${K}" stroke-width=".5" opacity=".4"/>`;
    if (v === 'block') return `<rect x="6" y="9" width="20" height="16" rx="3" fill="${c}" ${st()}/><path d="M9 14 q3 2 6 0 q3-2 7 0 M9 19 q4 2 7 0 q3-2 7 1" fill="none" stroke="${c2}" stroke-width="1"/>`;
    return `<path d="M16 29 v-18" ${st(1.4)}/>` + [7, 11, 15, 19].map((y) => `<ellipse cx="13" cy="${y}" rx="2.4" ry="1.5" fill="${c}" ${st(.8)} transform="rotate(-35 13 ${y})"/><ellipse cx="19" cy="${y}" rx="2.4" ry="1.5" fill="${c}" ${st(.8)} transform="rotate(35 19 ${y})"/>`).join('') + `<path d="M16 6 v-3 M13 6 l-2-3 M19 6 l2-3" stroke="${c2}" stroke-width="1"/>`;
  },
  nut: (c, c2 = '#f2e2c4', v = 'almond') => {
    if (v === 'walnut') return `<path d="M16 6 q-10 0-10 10 q0 11 10 11 q10 0 10-11 q0-10-10-10z" fill="${c}" ${st()}/><path d="M16 6 v21 M10 11 q3 3 0 6 q3 3 0 6 M22 11 q-3 3 0 6 q-3 3 0 6" fill="none" stroke="${K}" stroke-width=".8" opacity=".6"/>`;
    if (v === 'hazel') return `<circle cx="16" cy="18" r="9" fill="${c}" ${st()}/><path d="M7 15 q9-12 18 0 q-9-3-18 0z" fill="${c2}" ${st(1)}/>` + shine(13, 20);
    if (v === 'cashew') return `<path d="M22 8 q-14-3-15 10 q0 9 9 10 q2-2 0-4 q-5-1-4-6 q1-6 9-5 q3-3 1-5z" fill="${c}" ${st()}/>`;
    if (v === 'pista') return `<ellipse cx="16" cy="17" rx="10" ry="7" fill="${c2}" ${st()} transform="rotate(-20 16 17)"/><ellipse cx="17" cy="16" rx="6" ry="3.8" fill="${c}" transform="rotate(-20 17 16)"/>`;
    if (v === 'coconut') return `<path d="M4 17 a12 12 0 0 0 24 0z" fill="#7a5233" ${st()}/><path d="M7 17 a9 8 0 0 0 18 0z" fill="${c}"/>`;
    if (v === 'chestnut') return `<path d="M16 6 q-11 6-10 15 q1 7 10 7 q9 0 10-7 q1-9-10-15z" fill="${c}" ${st()}/><path d="M8 22 q8 3 16 0" fill="none" stroke="${c2}" stroke-width="2.4"/>` + shine(12, 14);
    if (v === 'brazil') return `<path d="M8 22 l6-16 q4-2 6 2 l4 14 q-8 6-16 0z" fill="${c}" ${st()}/>` + shine(14, 12, 1.6, 2.5);
    if (v === 'macadamia') return `<circle cx="16" cy="17" r="10" fill="${c}" ${st()}/><circle cx="19" cy="14" r="3" fill="${c2}" opacity=".5"/>` + shine(12, 14);
    if (v === 'pecan') return `<ellipse cx="16" cy="17" rx="7" ry="11" fill="${c}" ${st()}/><path d="M16 6 v22 M11 10 q3 2 0 5 q3 2 0 5 q3 2 0 5 M21 10 q-3 2 0 5 q-3 2 0 5 q-3 2 0 5" fill="none" stroke="${K}" stroke-width=".7" opacity=".55"/>`;
    if (v === 'pine') return [[10, 12], [16, 9], [22, 12], [12, 20], [20, 20], [16, 25]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3.6" fill="${c}" ${st(.8)}/>`).join('');
    if (v === 'peanut') return `<path d="M11 6 q-6 0-5 7 q1 3 3 4 q-3 3-2 7 q2 5 8 4 q5-1 4-6 q-1-3-3-4 q3-3 2-7 q-1-5-7-5z" fill="${c}" ${st()}/><path d="M9 11 h6 M8 22 h7" stroke="${K}" stroke-width=".6" opacity=".4"/>`;
    return `<path d="M16 5 q-9 9-7 17 q2 6 7 6 q5 0 7-6 q2-8-7-17z" fill="${c}" ${st()}/><path d="M16 9 q-3 8 0 16" fill="none" stroke="${K}" stroke-width=".7" opacity=".4"/>` + shine(13, 18, 1.5, 2.5);
  },
  // Tohum: küçük tanelerden oluşan yığın (şekil: oval/yuvarlak/damla)
  seeds: (c, c2 = '#e8dcc8', v = 'oval') => {
    const pts = [[9, 21], [13, 18], [17, 21], [21, 18], [24, 22], [11, 25], [15, 25], [19, 25], [23, 26], [15, 14], [19, 14], [12, 13], [22, 13]];
    const one = ([x, y], i) => v === 'round' ? `<circle cx="${x}" cy="${y}" r="1.7" fill="${c}" ${st(.5)}/>` : v === 'drop' ? `<path d="M${x} ${y - 2.6} q2.4 3 0 5 q-2.4-2 0-5z" fill="${c}" ${st(.5)}/>` : `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="1.3" fill="${c}" ${st(.5)} transform="rotate(${(i * 37) % 180} ${x} ${y})"/>`;
    return `<ellipse cx="16" cy="25" rx="12" ry="4" fill="${c2}" opacity=".6"/>` + pts.map(one).join('');
  },
  mushroom: (c, c2 = '#f5ead9', v = 'cap') => {
    if (v === 'oyster') return `<path d="M5 12 q11-9 22 0 q-4 6-11 5 q-7 1-11-5z" fill="${c}" ${st()}/><path d="M14 16 q0 7 2 12 h1 q0-6 1-12" fill="${c2}" ${st(1)}/>`;
    if (v === 'enoki') return [10, 13, 16, 19, 22].map((x) => `<path d="M${x} 28 q0-10 ${x < 16 ? -1 : 1}-17" fill="none" stroke="${c2}" stroke-width="1.6"/><circle cx="${x + (x < 16 ? -1 : 1)}" cy="10" r="1.9" fill="${c}" ${st(.6)}/>`).join('');
    if (v === 'morel') return `<path d="M16 3 q-7 4-6 13 q1 4 6 4 q5 0 6-4 q1-9-6-13z" fill="${c}" ${st()}/><path d="M12 9 l3 2 l-2 3 l3 2 M19 8 l-3 3 l3 2 l-2 3" fill="none" stroke="${K}" stroke-width=".7"/><rect x="13" y="19" width="6" height="9" rx="2" fill="${c2}" ${st(1)}/>`;
    if (v === 'ear') return `<path d="M8 22 q-4-12 8-15 q12 0 9 11 q-2 7-7 5 q-3-2-5 1 q-3 2-5-2z" fill="${c}" ${st()}/><path d="M12 18 q4-6 9-3" fill="none" stroke="${c2}" stroke-width="1" opacity=".5"/>`;
    if (v === 'frond') return `<path d="M16 28 q-10-3-11-12 q5 1 6-3 q3 2 5-2 q2 4 5 2 q1 4 6 3 q-1 9-11 12z" fill="${c}" ${st()}/><path d="M16 27 q-1-8-5-12 M16 27 q1-8 5-12" fill="none" stroke="${c2}" stroke-width="1"/>`;
    const flat = v === 'flat';
    return `<rect x="13" y="16" width="6" height="12" rx="2.5" fill="${c2}" ${st()}/><path d="M4 ${flat ? 16 : 17} q12 ${flat ? -10 : -14} 24 0 q-12 ${flat ? 3 : 4}-24 0z" fill="${c}" ${st()}/>` + (v === 'spots' ? `<circle cx="11" cy="12" r="1.3" fill="#fff" opacity=".7"/><circle cx="19" cy="10" r="1.1" fill="#fff" opacity=".7"/>` : shine(12, 12, 2.6, 1.3));
  },
  seaweed: (c, c2 = '#1b5e20', v = 'wave') => {
    if (v === 'sheet') return `<rect x="6" y="7" width="20" height="20" rx="2" fill="${c}" ${st()}/><path d="M9 11 h14 M9 15 h14 M9 19 h14 M9 23 h14" stroke="${c2}" stroke-width=".7" opacity=".5"/>`;
    if (v === 'powder') return `<path d="M5 20 q11-12 22 0z" fill="${c}" ${st()}/><path d="M3 20 h26 q-2 8-13 8 q-11 0-13-8z" fill="#f2efe8" ${st()}/>`;
    if (v === 'bar') return `<rect x="6" y="9" width="20" height="15" rx="2" fill="${c}" ${st()} opacity=".85"/><path d="M8 12 l16 9 M8 18 l10 5" stroke="${c2}" stroke-width=".8" opacity=".6"/>`;
    return [8, 14, 20].map((x, i) => `<path d="M${x} 29 q-3-6 1-11 q4-5 0-11" fill="none" stroke="${i === 1 ? c2 : c}" stroke-width="3.4" stroke-linecap="round"/>`).join('');
  },
  herb: (c, c2 = '#2e7d32', v = 'sprig') => {
    if (v === 'needle') return `<path d="M16 29 v-24" ${st(1.4)}/>` + [7, 10, 13, 16, 19, 22].map((y) => `<path d="M16 ${y} l-6 -2 M16 ${y} l6 -2" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`).join('');
    if (v === 'round') return `<path d="M16 29 v-22" stroke="${c2}" stroke-width="1.2"/>` + [[11, 8], [21, 8], [10, 14], [22, 14], [11, 20], [21, 20], [16, 5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${c}" ${st(.8)}/>`).join('');
    if (v === 'feather') return `<path d="M16 29 v-24" stroke="${c2}" stroke-width="1.2"/>` + [6, 10, 14, 18].map((y) => `<path d="M16 ${y + 2} q-7-1-9-6 M16 ${y + 2} q7-1 9-6" fill="none" stroke="${c}" stroke-width="1.4"/>`).join('');
    if (v === 'big') return `<path d="M16 29 v-6" ${st(1.3)}/><path d="M16 24 q-11-3-9-14 q7-3 9-6 q2 3 9 6 q2 11-9 14z" fill="${c}" ${st()}/><path d="M16 23 v-16" stroke="${c2}" stroke-width="1"/>`;
    return `<path d="M16 29 q-1-12 1-23" fill="none" stroke="${c2}" stroke-width="1.3"/>` + [[11, 9], [21, 11], [10, 16], [22, 18], [12, 23]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.4" fill="${c}" ${st(.8)} transform="rotate(${x < 16 ? -25 : 25} ${x} ${y})"/>`).join('');
  },
  // Baharat: küçük kâsede toz/tane. v: powder, whole (tane), stick (tarçın), pod (kakule), star (anason), thread (safran), leaf (defne)
  spice: (c, c2 = '#e9e1d3', v = 'powder') => {
    const dish = `<path d="M3 20 h26 q-2 8-13 8 q-11 0-13-8z" fill="${c2}" ${st()}/>`;
    if (v === 'stick') return `<rect x="6" y="9" width="20" height="5" rx="2.5" fill="${c}" ${st()} transform="rotate(-20 16 11)"/><rect x="8" y="16" width="20" height="5" rx="2.5" fill="${c}" ${st()} transform="rotate(-20 18 18)"/>`;
    if (v === 'star') return `<path d="M16 5 l2.5 7 7.5 0.5 -6 4.5 2.5 7.5 -6.5-4.5 -6.5 4.5 2.5-7.5 -6-4.5 7.5-.5z" fill="${c}" ${st()}/><circle cx="16" cy="15" r="1.6" fill="${c2}"/>`;
    if (v === 'thread') return dish + [10, 13, 16, 19, 22].map((x, i) => `<path d="M${x} 20 q${i % 2 ? 2 : -2}-6 ${i % 2 ? -1 : 1}-12" fill="none" stroke="${c}" stroke-width="1.6"/>`).join('');
    if (v === 'leaf') return `<path d="M6 25 q2-17 20-19 q-2 18-20 19z" fill="${c}" ${st()}/><path d="M7 24 q8-8 17-16" fill="none" stroke="${c2}" stroke-width="1"/>`;
    if (v === 'clove') return [[11, 10], [18, 9], [14, 18], [21, 17]].map(([x, y]) => `<path d="M${x} ${y} v9" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="2.6" fill="${c}" ${st(.8)}/>`).join('');
    const top = v === 'whole' ? [[9, 19], [13, 17], [17, 17], [21, 18], [11, 15], [15, 14], [19, 15], [23, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${c}" ${st(.5)}/>`).join('')
      : v === 'seed' ? [[9, 19], [13, 17], [17, 17], [21, 18], [11, 15], [15, 14], [19, 15], [23, 19]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="1" fill="${c}" ${st(.5)} transform="rotate(${i * 40} ${x} ${y})"/>`).join('')
        : v === 'pod' ? [[11, 16], [16, 15], [21, 16]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3.6" fill="${c}" ${st(.8)}/>`).join('')
          : `<path d="M6 20 q10-12 20 0z" fill="${c}" ${st()}/>`;
    return top + dish;
  },
  // Şişe (yağlar, sos, sirke): c sıvı rengi, c2 kapak
  bottle: (c, c2 = '#6d4c41', v = 'tall') => {
    if (v === 'small') return `<rect x="11" y="4" width="10" height="4" rx="1" fill="${c2}" ${st()}/><path d="M10 10 h12 v16 q0 3-3 3 h-6 q-3 0-3-3z" fill="${c}" ${st()}/>` + shine(13, 16, 1, 3);
    if (v === 'round') return `<rect x="13" y="3" width="6" height="4" rx="1" fill="${c2}" ${st()}/><path d="M13 7 h6 v4 q7 3 7 10 q0 8-10 8 q-10 0-10-8 q0-7 7-10z" fill="${c}" ${st()}/>` + shine(11, 18, 1.4, 3);
    return `<rect x="13" y="2" width="6" height="4" rx="1" fill="${c2}" ${st()}/><path d="M13 6 h6 v4 q4 2 4 6 v11 q0 2-2 2 h-10 q-2 0-2-2 v-11 q0-4 4-6z" fill="${c}" ${st()}/><rect x="10" y="17" width="12" height="6" rx="1" fill="#fff" opacity=".55"/>` + shine(12, 14, 1, 2.4);
  },
  // Fincan/bardak (içecekler). v: mug, glass, teacup, box (meyve suyu kutusu), carton (süt)
  cup: (c, c2 = '#ffffff', v = 'mug') => {
    if (v === 'glass') return `<path d="M8 6 h16 l-2 22 h-12z" fill="${c2}" opacity=".35" ${st()}/><path d="M9 11 h14 l-1.6 17 h-10.8z" fill="${c}"/><path d="M8 6 h16 l-2 22 h-12z" fill="none" ${st()}/>` + shine(12, 15, 1, 3);
    if (v === 'teacup') return `<path d="M5 13 h19 q0 13-9.5 13 q-9.5 0-9.5-13z" fill="${c2}" ${st()}/><path d="M24 15 q5 0 4 4 q-1 3-5 3" fill="none" ${st()}/><ellipse cx="14.5" cy="13.5" rx="8.5" ry="2" fill="${c}"/><path d="M4 28 h22" ${st(1.4)}/>`;
    if (v === 'box') return `<rect x="9" y="8" width="14" height="20" rx="1.5" fill="${c2}" ${st()}/><rect x="9" y="14" width="14" height="9" fill="${c}"/><path d="M19 8 l3-5 h3" fill="none" ${st(1.2)}/>`;
    if (v === 'carton') return `<path d="M9 10 l3-5 h8 l3 5 v18 h-14z" fill="${c2}" ${st()}/><path d="M9 10 h14" ${st(1)}/><rect x="9" y="15" width="14" height="8" fill="${c}"/>`;
    if (v === 'espresso') return `<path d="M8 16 h13 q0 9-6.5 9 q-6.5 0-6.5-9z" fill="${c2}" ${st()}/><path d="M21 18 q4 0 3 3 q-1 2-4 2" fill="none" ${st(1)}/><ellipse cx="14.5" cy="16.5" rx="5.6" ry="1.4" fill="${c}"/><path d="M5 28 h19" ${st(1.4)}/><path d="M12 12 q-2-3 0-6 M16 12 q-2-3 0-6" fill="none" stroke="#9e9e9e" stroke-width="1"/>`;
    return `<path d="M6 9 h17 v14 q0 5-5 5 h-7 q-5 0-5-5z" fill="${c2}" ${st()}/><path d="M23 12 q5 0 5 4 q0 4-5 4" fill="none" ${st()}/><ellipse cx="14.5" cy="10" rx="7.5" ry="1.8" fill="${c}"/>`;
  },
  // Kavanoz (ezme, macun, pekmez, bal, tahin, salça)
  jar: (c, c2 = '#d32f2f', v = 'jar') => {
    if (v === 'tube') return `<path d="M8 8 h14 l-2 18 q-5 3-10 0z" fill="${c2}" ${st()}/><rect x="12" y="4" width="6" height="4" rx="1" fill="${K}"/><rect x="10" y="13" width="10" height="7" rx="1" fill="${c}"/>`;
    if (v === 'can') return `<rect x="8" y="7" width="16" height="21" rx="2" fill="#cfd8dc" ${st()}/><rect x="8" y="12" width="16" height="11" fill="${c2}"/><circle cx="16" cy="17.5" r="3.4" fill="${c}"/><ellipse cx="16" cy="7" rx="8" ry="1.6" fill="#eceff1" ${st(1)}/>`;
    if (v === 'honey') return `<rect x="9" y="5" width="14" height="4" rx="1" fill="${c2}" ${st()}/><path d="M8 10 h16 v15 q0 3-3 3 h-10 q-3 0-3-3z" fill="${c}" ${st()}/><path d="M8 13 q4 3 8 0 q4-3 8 0" fill="none" stroke="#fff" stroke-width="1" opacity=".5"/>`;
    return `<rect x="9" y="5" width="14" height="4" rx="1" fill="${c2}" ${st()}/><path d="M8 10 h16 v15 q0 3-3 3 h-10 q-3 0-3-3z" fill="${c}" ${st()}/><rect x="10" y="15" width="12" height="7" rx="1" fill="#fff" opacity=".6"/>` + shine(11, 13, 1, 2);
  },
  // Blok (tofu, tempeh, peynir, tereyağı, çikolata)
  block: (c, c2 = '#ffffff', v = 'cube') => {
    if (v === 'wedge') return `<path d="M4 22 l20-12 l4 4 v10 h-24z" fill="${c}" ${st()}/><path d="M4 22 h24" ${st(1)}/><circle cx="12" cy="19" r="1.6" fill="${c2}"/><circle cx="19" cy="21" r="1.2" fill="${c2}"/><circle cx="23" cy="16" r="1" fill="${c2}"/>`;
    if (v === 'bar') return `<rect x="5" y="9" width="22" height="15" rx="1.5" fill="${c}" ${st()}/><path d="M12 9 v15 M19 9 v15 M5 16.5 h22" stroke="${c2}" stroke-width="1"/>`;
    if (v === 'speckled') return `<rect x="5" y="9" width="22" height="15" rx="2" fill="${c}" ${st()}/>` + [[9, 13], [14, 12], [20, 13], [24, 15], [8, 19], [12, 20], [17, 18], [22, 20], [16, 22]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="1" fill="${c2}"/>`).join('');
    if (v === 'ball') return `<circle cx="16" cy="18" r="10" fill="${c}" ${st()}/>` + shine(12, 14);
    if (v === 'crumble') return `<path d="M4 20 h24 q-2 8-12 8 q-10 0-12-8z" fill="#cfd8dc" ${st()}/>` + [[9, 17], [13, 15], [17, 16], [21, 17], [11, 19], [15, 18], [19, 19], [23, 19]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.3" fill="${c}" ${st(.5)}/>`).join('');
    if (v === 'stick') return `<path d="M4 15 l18-5 l6 4 l-18 6z" fill="${c}" ${st()}/><path d="M4 15 v6 l6 5 v-6 M10 26 l18-6 v-6" fill="${c}" ${st()}/>`;
    return `<path d="M6 13 l10-5 l10 5 v11 l-10 5 l-10-5z" fill="${c}" ${st()}/><path d="M6 13 l10 5 l10-5 M16 18 v11" fill="none" ${st(1)}/><path d="M7 13.5 l9-4.5 l9 4.5 l-9 4.5z" fill="${c2}" opacity=".35"/>`;
  },
  egg: (c = '#fff8ec', c2 = '#ffb300', v = 'whole') => {
    if (v === 'white') return `<path d="M5 18 q0-9 9-9 q4-3 8 0 q6 2 5 9 q0 9-11 9 q-11 0-11-9z" fill="${c}" ${st()}/>` + shine(11, 14);
    if (v === 'yolk') return `<path d="M5 18 q0-9 9-9 q4-3 8 0 q6 2 5 9 q0 9-11 9 q-11 0-11-9z" fill="${c}" ${st()}/><circle cx="16" cy="17" r="5" fill="${c2}" ${st(1)}/>` + shine(14, 15, 1.3, .9);
    if (v === 'boiled') return `<ellipse cx="16" cy="17" rx="9" ry="11" fill="${c}" ${st()}/><circle cx="16" cy="18" r="5" fill="${c2}"/>`;
    return `<ellipse cx="16" cy="17" rx="9" ry="11" fill="${c}" ${st()}/>` + shine(12, 12);
  },
  meat: (c, c2 = '#fff3e0', v = 'steak') => {
    if (v === 'drumstick') return `<path d="M18 4 q9 1 9 10 q0 8-9 8 l-6 4 q-1 3-3 2 q-2 0-1-3 q-3 0-2-2 q1-2 3-1 l4-6 q-2-11 5-12z" fill="${c}" ${st()}/><circle cx="7" cy="27" r="1.6" fill="${c2}" ${st(.8)}/>` + shine(20, 10);
    if (v === 'mince') return `<path d="M4 20 h24 q-2 8-12 8 q-10 0-12-8z" fill="#cfd8dc" ${st()}/><path d="M6 20 q2-9 10-9 q8 0 10 9z" fill="${c}" ${st()}/>` + [[11, 16], [16, 14], [21, 16], [14, 18], [19, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="${c2}"/>`).join('');
    if (v === 'liver') return `<path d="M5 15 q3-8 12-7 q11 1 10 9 q-1 9-11 9 q-12 0-11-11z" fill="${c}" ${st()}/><path d="M15 9 q-2 8 2 16" fill="none" stroke="${K}" stroke-width=".7" opacity=".5"/>` + shine(10, 14);
    if (v === 'leg') return `<path d="M7 6 q9-2 14 8 q5 9-1 13 q-6 3-10-4 q-3-5-6-7 q-3-6 3-10z" fill="${c}" ${st()}/><path d="M8 8 q-3-2-4-5" ${st(2.2)}/><path d="M10 14 q4 1 6 6" fill="none" stroke="${c2}" stroke-width="1.6"/>`;
    if (v === 'breast') return `<path d="M6 12 q6-7 15-4 q8 4 5 13 q-3 7-11 6 q-11-2-9-15z" fill="${c}" ${st()}/><path d="M10 13 q6 0 12 4 M9 18 q6 0 11 4" fill="none" stroke="${c2}" stroke-width=".9"/>`;
    if (v === 'turkey') return `<path d="M5 20 q0-11 11-11 q11 0 11 11 q0 6-11 6 q-11 0-11-6z" fill="${c}" ${st()}/><path d="M8 26 h16" ${st(1.4)}/><path d="M24 12 l4-3 M8 12 l-4-3" ${st(2)}/>` + shine(12, 14);
    return `<path d="M6 12 q4-7 13-5 q9 3 8 11 q-1 9-10 9 q-12 0-11-15z" fill="${c}" ${st()}/><path d="M7 13 q4-5 11-4 q7 2 7 8" fill="none" stroke="${c2}" stroke-width="1.6"/><circle cx="17" cy="18" r="2.3" fill="${c2}" ${st(.7)}/>`;
  },
  fish: (c, c2 = '#ffffff', v = 'fish') => {
    if (v === 'shrimp') return `<path d="M24 8 q-14-3-17 8 q-2 9 7 12 q3 1 4-2 q-6-1-6-7 q1-6 10-6z" fill="${c}" ${st()}/><path d="M11 14 l4 2 M10 19 l4 1 M12 24 l3-1" stroke="${c2}" stroke-width="1"/><path d="M24 8 q4-3 6-2 M23 9 q4 0 6 2" fill="none" ${st(.8)}/>`;
    if (v === 'mussel') return `<path d="M6 26 q-3-13 8-21 q6 2 8 9 q3 8-4 12 q-6 3-12 0z" fill="${c}" ${st()}/><path d="M9 23 q2-9 6-15 M12 25 q4-7 6-12" fill="none" stroke="${c2}" stroke-width=".8" opacity=".6"/>`;
    if (v === 'fillet') return `<path d="M4 14 q12-8 24 0 q-1 9-12 11 q-11-2-12-11z" fill="${c}" ${st()}/>` + [9, 13, 17, 21].map((x) => `<path d="M${x} 12 q2 6 0 11" fill="none" stroke="${c2}" stroke-width="1.2"/>`).join('');
    if (v === 'can') return `<ellipse cx="16" cy="21" rx="12" ry="6" fill="#b0bec5" ${st()}/><ellipse cx="16" cy="18" rx="12" ry="6" fill="#eceff1" ${st()}/><ellipse cx="16" cy="18" rx="9" ry="4" fill="${c}"/><path d="M10 17 q6 3 12 0" fill="none" stroke="${c2}" stroke-width="1"/>`;
    const small = v === 'small';
    return `<path d="M${small ? 7 : 4} 16 q${small ? 8 : 10}-${small ? 7 : 9} ${small ? 16 : 19} 0 q-${small ? 8 : 10} ${small ? 7 : 9}-${small ? 16 : 19} 0z" fill="${c}" ${st()}/><path d="M${small ? 23 : 23} 16 l5-5 v10z" fill="${c}" ${st()}/><circle cx="${small ? 11 : 9}" cy="15" r="1.3" fill="${K}"/><path d="M${small ? 9 : 7} 18 q${small ? 6 : 7} 3 ${small ? 13 : 15} 0" fill="none" stroke="${c2}" stroke-width="1.1" opacity=".8"/>`;
  },
  // Kase/tabak içinde yarı akışkan (yoğurt, humus, miso, mayalı ürünler)
  bowl: (c, c2 = '#e3dccf', v = 'plain') => `<path d="M4 17 h24 q-1 11-12 11 q-11 0-12-11z" fill="${c2}" ${st()}/><path d="M5 17 q11-${v === 'peak' ? 9 : 5} 22 0z" fill="${c}" ${st(1)}/>` + (v === 'swirl' ? `<path d="M11 15 q5-3 10 0" fill="none" stroke="#fff" stroke-width="1" opacity=".7"/>` : '') + (v === 'dots' ? `<circle cx="13" cy="15" r="1" fill="${K}" opacity=".5"/><circle cx="18" cy="14" r="1" fill="${K}" opacity=".5"/>` : ''),
  // Tatlandırıcılar / diğer: sugar cubes, crystals, syrup drop
  sweet: (c, c2 = '#ffffff', v = 'cubes') => {
    if (v === 'drop') return `<path d="M16 4 q10 12 10 17 a10 10 0 0 1 -20 0 q0-5 10-17z" fill="${c}" ${st()}/>` + shine(12, 19, 1.6, 2.4);
    if (v === 'crystal') return `<path d="M5 22 l6-10 l5 6 l4-8 l7 12z" fill="${c}" ${st()}/><path d="M5 22 h22 v4 h-22z" fill="${c2}" ${st(1)}/>`;
    if (v === 'leaf') return `<path d="M16 3 l3 6 5-2 -2 6 6 1 -5 4 2 6 -6-2 -3 6 -3-6 -6 2 2-6 -5-4 6-1 -2-6 5 2z" fill="${c}" ${st()}/><path d="M16 13 v16" ${st(1.4)}/>`;
    if (v === 'pod') return `<path d="M5 20 q4-14 22-12 q-2 6-6 8 q-6 4-16 4z" fill="${c}" ${st()}/><path d="M9 18 q7-3 14-8" fill="none" stroke="${c2}" stroke-width="1"/>`;
    if (v === 'block') return `<path d="M7 11 l9-4 l9 4 v11 l-9 5 l-9-5z" fill="${c}" ${st()}/><path d="M7 11 l9 4 l9-4 M16 15 v12" fill="none" ${st(1)}/>`;
    return `<rect x="6" y="14" width="9" height="9" rx="1" fill="${c}" ${st()}/><rect x="16" y="14" width="9" height="9" rx="1" fill="${c}" ${st()}/><rect x="11" y="6" width="9" height="9" rx="1" fill="${c}" ${st()}/>`;
  },
  // Toz ürün (un, protein tozu, kakao, maya): kepçe/ölçek içinde
  powder: (c, c2 = '#90a4ae', v = 'scoop') => (v === 'pile'
    ? `<path d="M3 26 q4-14 13-15 q9 1 13 15z" fill="${c}" ${st()}/><path d="M9 21 q3-2 5 0" fill="none" stroke="#fff" stroke-width=".8" opacity=".6"/>`
    : `<path d="M4 16 h18 q0 10-9 10 q-9 0-9-10z" fill="${c2}" ${st()}/><path d="M22 18 h7" ${st(2.2)}/><path d="M5 16 q8-7 16 0z" fill="${c}" ${st(1)}/>`),
  salt: (c = '#ffffff', c2 = '#90a4ae') => `<path d="M10 11 h12 v16 q0 2-2 2 h-8 q-2 0-2-2z" fill="${c}" ${st()}/><path d="M10 11 q6-8 12 0z" fill="${c2}" ${st()}/><circle cx="14" cy="8" r=".8" fill="${K}"/><circle cx="16" cy="6.5" r=".8" fill="${K}"/><circle cx="18" cy="8" r=".8" fill="${K}"/>`,
};

// Besine özgü çizim: [şekil, renk, ikinci renk, biçim seçeneği]
export const FOOD_ART = {
  // ---- meyveler
  elma: ['round', '#e53935', '#43a047'], armut: ['pear', '#c0ca33', '#43a047'], ayva: ['pear', '#fbc02d', '#689f38'], muz: ['long', '#fdd835', '', 'banana'],
  kayisi: ['round', '#ffa726', '#7cb342', 'crease'], seftali: ['round', '#ff8a65', '#66bb6a', 'crease'], nektarin: ['round', '#ef5350', '#9ccc65', 'crease'],
  erik: ['round', '#6a1b9a', '#558b2f', 'crease'], kiraz: ['cluster', '#c62828', '#43a047', 'berry'], visne: ['cluster', '#8e0000', '#2e7d32', 'berry'],
  uzum: ['cluster', '#8bc34a', '#558b2f'], cilek: ['round', '#e53935', '#2e7d32', 'seeds'], yabanmersini: ['cluster', '#3949ab', '#43a047', 'berry'],
  ahududu: ['cluster', '#e91e63', '#43a047'], bogurtlen: ['cluster', '#311b92', '#43a047'], dut: ['cluster', '#4a148c', '#1b5e20'],
  frenk_uzumu: ['cluster', '#1a237e', '#33691e', 'berry'], bektasi: ['round', '#aed581', '#33691e', 'stripes'], kizilcik: ['cluster', '#b71c1c', '#33691e', 'berry'],
  murver: ['cluster', '#283593', '#4e342e'], portakal: ['round', '#fb8c00', '#43a047', 'dots'], mandalina: ['round', '#ff9800', '#2e7d32', 'dots noleaf'],
  greyfurt: ['round', '#ff7043', '#ffcdd2', 'half'], limon: ['round', '#fff176', '#558b2f', 'dots'], misket_limonu: ['round', '#9ccc65', '#33691e', 'dots'],
  kivi: ['round', '#8d6e63', '#9ccc65', 'half'], nar: ['round', '#c2185b', '#c2185b', 'crown'], incir: ['pear', '#6d4c7d', '#689f38'],
  trabzon_hurmasi: ['round', '#ff6f00', '#33691e', 'crown'], karpuz: ['round', '#43a047', '#1b5e20', 'stripes'], kavun: ['round', '#d4b483', '#a1887f', 'stripes'],
  kavun_balli: ['round', '#dce775', '#aed581', 'noleaf'], ananas: ['round', '#f9a825', '#2e7d32', 'seeds crown'], mango: ['pear', '#ffb300', '#e65100'],
  papaya: ['round', '#ff8f00', '#ffcc80', 'half'], guava: ['round', '#c5e1a5', '#f48fb1', 'half'], avokado: ['round', '#558b2f', '#dce775', 'half'],
  carkifelek: ['round', '#4a148c', '#ffd54f', 'half'], lici: ['round', '#ec407a', '#43a047', 'dots'], jackfruit: ['round', '#c0ca33', '#827717', 'seeds noleaf'],
  demirhindi: ['legume', '#8d6e63', '#5d4037', 'pod'], plantain: ['long', '#9e9d24', '', 'banana'], zeytin_siyah: ['round', '#212121', '#558b2f'], zeytin_yesil: ['round', '#7cb342', '#33691e'],
  // ---- kuru meyveler
  kuru_kayisi: ['nut', '#ef6c00', '#ffcc80', 'macadamia'], kuru_incir: ['pear', '#795548', '#4e342e'], kuru_uzum: ['seeds', '#4e342e', '#d7ccc8', 'round'],
  hurma: ['nut', '#6d4c41', '#3e2723', 'brazil'], hurma_medjool: ['nut', '#4e342e', '#8d6e63', 'pecan'], kuru_erik: ['round', '#311b92', '#4e342e', 'noleaf'],
  goji: ['seeds', '#e53935', '#ffccbc', 'drop'], kuru_muz: ['powder', '#fff59d', '#ffe082', 'scoop'],
  // ---- sebzeler
  domates: ['round', '#e53935', '#2e7d32', 'crown'], domates_salcasi: ['jar', '#c62828', '#e53935', 'can'], salatalik: ['long', '#43a047', '#c5e1a5', 'cuke'],
  biber_yesil: ['long', '#43a047', '#1b5e20', 'pepper'], biber_kirmizi: ['long', '#e53935', '#2e7d32', 'pepper'], aci_biber: ['long', '#d50000', '#2e7d32', 'chili'],
  patlican: ['long', '#4a148c', '#558b2f', 'eggplant'], kabak: ['long', '#7cb342', '#558b2f', 'zucchini'], balkabagi: ['round', '#ef6c00', '#bf360c', 'stripes'],
  brokoli: ['leafy', '#2e7d32', '#81c784', 'floret'], karnabahar: ['leafy', '#fff8e1', '#a5d6a7', 'floret'], brokselahanasi: ['round', '#7cb342', '#33691e', 'stripes noleaf'],
  lahana: ['leafy', '#aed581', '#689f38', 'head'], kirmizi_lahana: ['leafy', '#7b1fa2', '#ce93d8', 'head'], lahana_tursusu: ['jar', '#f0f4c3', '#827717', 'jar'],
  salatalik_tursusu: ['long', '#827717', '#c0ca33', 'cuke'], bamya: ['long', '#689f38', '#33691e', 'okra'], taze_fasulye: ['legume', '#66bb6a', '#a5d6a7', 'pod'],
  bezelye: ['legume', '#7cb342', '#c5e1a5', 'pod'], taze_bakla: ['legume', '#558b2f', '#dcedc8', 'pod'], edamame: ['legume', '#8bc34a', '#33691e', 'pod'],
  misir: ['long', '#fdd835', '#9ccc65', 'corn'], enginar: ['leafy', '#7cb342', '#33691e', 'vine'], kuskonmaz: ['long', '#7cb342', '#4a148c', 'spear'],
  sogan: ['bulb', '#d4a373', '#7cb342', 'onion'], sarimsak: ['bulb', '#f5f5f5', '#9ccc65', 'garlic'], pirasa: ['long', '#e8f5e9', '#2e7d32', 'leek'],
  kereviz_sap: ['leafy', '#a5d6a7', '#7cb342', 'stalk'], rezene: ['bulb', '#e6ee9c', '#7cb342', 'onion'], alabas: ['bulb', '#ce93d8', '#8bc34a', 'onion'],
  'kudret_narı': ['long', '#689f38', '#ff7043', 'cuke'], fasulye_filizi: ['herb', '#c0ca33', '#9e9d24', 'feather'], yonca_filizi: ['herb', '#8bc34a', '#689f38', 'round'],
  mercimek_filizi: ['herb', '#afb42b', '#827717', 'sprig'],
  // ---- yeşil yapraklılar
  ispanak: ['leafy', '#2e7d32', '#a5d6a7'], karalahana: ['leafy', '#1b5e20', '#66bb6a', 'curly'], collard: ['leafy', '#388e3c', '#c8e6c9'],
  pazi: ['leafy', '#43a047', '#e53935', 'stalk'], pancar_yapragi: ['leafy', '#2e7d32', '#ad1457'], roka: ['leafy', '#558b2f', '#c5e1a5', 'vine'],
  marul: ['leafy', '#9ccc65', '#558b2f', 'curly'], aysberg: ['leafy', '#c5e1a5', '#8bc34a', 'head'], semizotu: ['herb', '#689f38', '#d84315', 'round'],
  tere: ['herb', '#8bc34a', '#c5e1a5', 'round'], su_teresi: ['herb', '#33691e', '#7cb342', 'round'], hardal_yesili: ['leafy', '#7cb342', '#33691e', 'curly'],
  karahindiba: ['leafy', '#689f38', '#fdd835', 'vine'], asma_yapragi: ['leafy', '#558b2f', '#dce775', 'vine'], pak_choi: ['leafy', '#43a047', '#f1f8e9', 'stalk'],
  moringa: ['herb', '#2e7d32', '#795548', 'sprig'], amarant_yapragi: ['leafy', '#4caf50', '#c2185b', 'broad'],
  // ---- kök ve yumrular
  patates: ['tuber', '#d7a86e', '#8d6e63'], tatli_patates: ['tuber', '#c2185b', '#880e4f', 'sweet'], havuc: ['long', '#ef6c00', '#43a047', 'carrot'],
  pancar: ['bulb', '#880e4f', '#43a047', 'root'], turp: ['bulb', '#e53935', '#43a047', 'root'], bayir_turpu: ['long', '#fafafa', '#7cb342', 'carrot'],
  salgam: ['bulb', '#e1bee7', '#7cb342', 'root'], kereviz_kok: ['tuber', '#e6d8b8', '#a1887f', 'knob'], yaban_havucu: ['long', '#f5ecd2', '#7cb342', 'carrot'],
  yer_elmasi: ['tuber', '#bcaaa4', '#6d4c41', 'knob'], zencefil: ['tuber', '#e0b46c', '#a1887f', 'knob'], manyok: ['tuber', '#8d6e63', '#5d4037', 'sweet'],
  taro: ['tuber', '#a1887f', '#4e342e'], yam: ['tuber', '#6d4c41', '#3e2723', 'sweet'],
  // ---- baklagiller
  kirmizi_mercimek: ['legume', '#ff7043', '#fff', 'lentil'], yesil_mercimek: ['legume', '#8d8a4f', '#fff', 'lentil'], nohut: ['legume', '#e8c27a', '#fff', 'round'],
  humus: ['legume', '#e0c48c', '#c62828', 'mash'], kuru_fasulye: ['legume', '#f5f0e6', '#9e9e9e'], dermason: ['legume', '#fffaf0', '#bdbdbd', 'round'],
  barbunya: ['legume', '#d7a7a0', '#8e2424'], kirmizi_fasulye: ['legume', '#8e1c1c', '#f8bbd0'], siyah_fasulye: ['legume', '#212121', '#fafafa'],
  pinto: ['legume', '#c8a27a', '#6d4c41'], borulce: ['legume', '#f3ead8', '#212121'], kuru_bakla: ['legume', '#c8b48a', '#5d4037'],
  mas: ['legume', '#4caf50', '#fff', 'round'], urad: ['legume', '#37474f', '#ffffff', 'lentil'], adzuki: ['legume', '#b71c1c', '#ffffff', 'round'],
  kuru_bezelye: ['legume', '#9ccc65', '#33691e', 'lentil'], guvercin_bezelyesi: ['legume', '#d7c18f', '#795548', 'round'], aci_bakla: ['legume', '#f9e79f', '#c0a060', 'lentil'],
  yerfistigi: ['nut', '#d6b07a', '#fff', 'peanut'], fistik_ezmesi: ['jar', '#b8743d', '#c62828', 'jar'],
  // ---- soya
  soya_fasulyesi: ['legume', '#f0d58c', '#8d6e63', 'round'], tofu_sert: ['block', '#fffdf5', '#bdbdbd', 'cube'], tofu_normal: ['block', '#fff9e6', '#ffe0b2', 'cube'],
  tofu_nigari: ['block', '#f5f5f0', '#90caf9', 'cube'], tempeh: ['block', '#d9b77a', '#8d6e63', 'speckled'], natto: ['bowl', '#a1887f', '#5d4037', 'dots'],
  miso: ['bowl', '#c08b4a', '#e0d4c0', 'swirl'], soya_sosu: ['bottle', '#3e2723', '#d32f2f', 'small'], soya_sutu: ['cup', '#fff8e1', '#e0d4b0', 'carton'],
  soya_sutu_z: ['cup', '#fff8e1', '#90caf9', 'carton'], soya_unu: ['grain', '#f3e3b5', '#fff8e1', 'sack'], soya_izolat: ['powder', '#f3e3b5', '#5c6bc0', 'scoop'],
  // ---- tahıllar
  yulaf: ['grain', '#e8d7a8', '#8d6e63', 'bowl'], yulaf_kepegi: ['grain', '#c9a96e', '#bcaaa4', 'bowl'], bulgur: ['grain', '#d4a55a', '#8d6e63', 'bowl'],
  pirinc_beyaz: ['grain', '#ffffff', '#81d4fa', 'bowl'], pirinc_esmer: ['grain', '#b98b5a', '#81d4fa', 'bowl'], yabani_pirinc: ['grain', '#3e2723', '#a5d6a7', 'bowl'],
  kinoa: ['seeds', '#f5e6c4', '#d7ccc8', 'round'], karabugday: ['seeds', '#8d6e63', '#efebe9', 'drop'], amarant: ['seeds', '#f0d090', '#fff3e0', 'round'],
  dari: ['seeds', '#fdd835', '#fff9c4', 'round'], teff: ['seeds', '#6d4c41', '#d7ccc8', 'round'], arpa: ['grain', '#c9a35a', '#a1887f', 'ear'],
  arpa_inci: ['grain', '#f1e4c4', '#a1887f', 'bowl'], cavdar: ['grain', '#8d6e63', '#5d4037', 'ear'], kavilca: ['grain', '#b8864b', '#3e2723', 'ear'],
  bugday: ['grain', '#e0b860', '#c8a24a', 'ear'], tam_bugday_unu: ['grain', '#c9a26b', '#d7ccc8', 'sack'], beyaz_un: ['grain', '#ffffff', '#eceff1', 'sack'],
  irmik: ['grain', '#fff3c4', '#ffe082', 'bowl'], makarna: ['grain', '#fbc02d', '', 'pasta'], kuskus: ['seeds', '#f6d36b', '#fff8e1', 'round'],
  misir_tane: ['seeds', '#ffca28', '#fff8e1', 'drop'], misir_unu: ['grain', '#ffd54f', '#fff8e1', 'sack'], sorgum: ['seeds', '#a1662f', '#efebe9', 'round'],
  bugday_ruseymi: ['seeds', '#e6c27a', '#f5f5f5', 'oval'], bugday_kepegi: ['seeds', '#a0703a', '#efebe9', 'oval'], seitan: ['grain', '#b98e5f', '#8d6e63', 'block'],
  // ---- kuruyemişler
  badem: ['nut', '#b5793f', '#f2e2c4', 'almond'], findik: ['nut', '#9c6a3c', '#558b2f', 'hazel'], ceviz: ['nut', '#c4a072', '#f2e2c4', 'walnut'],
  antep_fistigi: ['nut', '#8bc34a', '#e8d9b5', 'pista'], kaju: ['nut', '#f0d9a8', '#fff', 'cashew'], brezilya_cevizi: ['nut', '#7b5232', '#f2e2c4', 'brazil'],
  makadamya: ['nut', '#f3e5c0', '#c8b48a', 'macadamia'], pekan: ['nut', '#8b4f27', '#f2e2c4', 'pecan'], cam_fistigi: ['nut', '#f6e7c1', '#fff', 'pine'],
  kestane: ['nut', '#6d3f1f', '#d7b98a', 'chestnut'], hindistancevizi: ['nut', '#ffffff', '#fff', 'coconut'], hindistancevizi_rende: ['seeds', '#ffffff', '#cfd8dc', 'oval'],
  // ---- tohumlar
  keten: ['seeds', '#8d5a2b', '#efebe9', 'drop'], chia: ['seeds', '#424242', '#eceff1', 'oval'], kenevir: ['seeds', '#9e9d24', '#f1f8e9', 'round'],
  susam: ['seeds', '#fff3d6', '#bcaaa4', 'drop'], tahin: ['jar', '#d9b98a', '#6d4c41', 'jar'], kabak_cekirdegi: ['seeds', '#689f38', '#f1f8e9', 'drop'],
  aycekirdegi: ['seeds', '#37474f', '#fff8e1', 'drop'], hashas: ['seeds', '#546e7a', '#eceff1', 'round'], hardal_tohumu: ['seeds', '#fbc02d', '#fff8e1', 'round'],
  // ---- mantarlar
  kultur_mantari: ['mushroom', '#f5f0e6', '#ffffff', 'cap'], portobello_uv: ['mushroom', '#6d4c41', '#efebe9', 'flat'], shiitake: ['mushroom', '#8d5a3a', '#f5ead9', 'spots'],
  istiridye_mantari: ['mushroom', '#b0bec5', '#eceff1', 'oyster'], maitake: ['mushroom', '#8d6e63', '#d7ccc8', 'frond'], enoki: ['mushroom', '#fffde7', '#fff8e1', 'enoki'],
  kuzugobegi: ['mushroom', '#a1887f', '#efebe9', 'morel'], kulak_mantari: ['mushroom', '#3e2723', '#8d6e63', 'ear'],
  // ---- algler
  spirulina: ['seaweed', '#1b5e20', '#004d40', 'powder'], kelp: ['seaweed', '#827717', '#33691e', 'wave'], wakame: ['seaweed', '#2e7d32', '#1b5e20', 'wave'],
  nori: ['seaweed', '#263238', '#4caf50', 'sheet'], agar: ['seaweed', '#fffde7', '#bdbdbd', 'bar'],
  // ---- taze otlar
  maydanoz: ['herb', '#2e7d32', '#1b5e20', 'sprig'], dereotu: ['herb', '#7cb342', '#33691e', 'feather'], nane: ['herb', '#43a047', '#2e7d32', 'big'],
  nane_pepermint: ['herb', '#00897b', '#004d40', 'big'], feslegen: ['herb', '#388e3c', '#1b5e20', 'big'], kisnis: ['herb', '#689f38', '#33691e', 'sprig'],
  kekik: ['herb', '#558b2f', '#5d4037', 'needle'],
  // ---- baharatlar
  tarcin: ['spice', '#8d4b20', '#e9e1d3', 'stick'], zerdecal: ['spice', '#f9a825', '#e9e1d3', 'powder'], kimyon: ['spice', '#8d6e3f', '#e9e1d3', 'seed'],
  karabiber: ['spice', '#212121', '#e9e1d3', 'whole'], pul_biber: ['spice', '#c62828', '#e9e1d3', 'powder'], aci_toz_biber: ['spice', '#e64a19', '#e9e1d3', 'powder'],
  zencefil_toz: ['spice', '#e8c27a', '#e9e1d3', 'powder'], karanfil: ['spice', '#4e2a14', '#e9e1d3', 'clove'], kakule: ['spice', '#9ccc65', '#e9e1d3', 'pod'],
  muskat: ['spice', '#795548', '#e9e1d3', 'whole'], kisnis_tohumu: ['spice', '#c8a86b', '#e9e1d3', 'whole'], rezene_tohumu: ['spice', '#9e9d24', '#e9e1d3', 'seed'],
  cemen: ['spice', '#e0a82e', '#e9e1d3', 'seed'], anason: ['spice', '#6d3f1f', '#c8a86b', 'star'], kekik_kuru: ['spice', '#6b8e23', '#e9e1d3', 'powder'],
  biberiye: ['herb', '#33691e', '#795548', 'needle'], adacayi: ['herb', '#90a4ae', '#607d8b', 'big'], defne: ['spice', '#558b2f', '#c5e1a5', 'leaf'],
  yenibahar: ['spice', '#5d4037', '#e9e1d3', 'whole'], safran: ['spice', '#d84315', '#e9e1d3', 'thread'], sarimsak_tozu: ['spice', '#f3e9d2', '#bcaaa4', 'powder'],
  sogan_tozu: ['spice', '#e8cfa0', '#a1887f', 'powder'], kori: ['spice', '#f0b400', '#bcaaa4', 'powder'], karaman_kimyonu: ['spice', '#5d4037', '#bcaaa4', 'seed'],
  kereviz_tohumu: ['spice', '#827717', '#bcaaa4', 'whole'],
  // ---- yağlar
  zeytinyagi: ['bottle', '#c0ca33', '#33691e', 'tall'], aycicek_yagi: ['bottle', '#fdd835', '#ff8f00', 'tall'], aycicek_yagi_ho: ['bottle', '#ffee58', '#e65100', 'round'],
  kanola: ['bottle', '#f4e04d', '#558b2f', 'tall'], misir_ozu_yagi: ['bottle', '#ffca28', '#fdd835', 'tall'], soya_yagi: ['bottle', '#ffe082', '#8d6e63', 'tall'],
  susam_yagi: ['bottle', '#a1662f', '#3e2723', 'small'], keten_yagi: ['bottle', '#e6a23c', '#4e342e', 'small'], ceviz_yagi: ['bottle', '#c49a5a', '#5d4037', 'round'],
  findik_yagi: ['bottle', '#d4a056', '#558b2f', 'round'], avokado_yagi: ['bottle', '#7cb342', '#1b5e20', 'round'], hindistancevizi_yagi: ['jar', '#fafafa', '#795548', 'jar'],
  palm_yagi: ['bottle', '#e65100', '#bf360c', 'tall'], aspir_yagi: ['bottle', '#ffd180', '#ff6f00', 'round'], pirinc_kepegi_yagi: ['bottle', '#ffe0b2', '#90a4ae', 'tall'],
  hardal_yagi: ['bottle', '#f9a825', '#827717', 'small'], yerfistigi_yagi: ['bottle', '#e8b06a', '#8d6e63', 'round'],
  // ---- içecekler
  badem_sutu: ['cup', '#f8efe0', '#b5793f', 'carton'], pirinc_sutu: ['cup', '#ffffff', '#81d4fa', 'carton'], hindistancevizi_sutu: ['jar', '#fafafa', '#6d4c41', 'can'],
  hindistancevizi_suyu: ['cup', '#e3f2fd', '#ffffff', 'glass'], kahve: ['cup', '#4e342e', '#ffffff', 'mug'], espresso: ['cup', '#3e2723', '#ffffff', 'espresso'],
  siyah_cay: ['cup', '#b23c17', '#ffffff', 'teacup'], yesil_cay: ['cup', '#9ccc65', '#ffffff', 'teacup'], papatya: ['cup', '#fff176', '#ffffff', 'mug'],
  elma_suyu: ['cup', '#ffb300', '#e53935', 'box'], domates_suyu: ['cup', '#d32f2f', '#ffffff', 'glass'], havuc_suyu: ['cup', '#fb8c00', '#ffffff', 'glass'],
  elma_sirkesi: ['bottle', '#d4a017', '#e53935', 'small'],
  // ---- tatlandırıcılar
  kakao: ['powder', '#5d4037', '#a1887f', 'pile'], bitter: ['block', '#4e342e', '#3e2723', 'bar'], keciboynuzu: ['sweet', '#4e342e', '#8d6e63', 'pod'],
  akcaagac: ['sweet', '#c62828', '#fff', 'leaf'], melas: ['sweet', '#3e2723', '#fff', 'drop'], seker: ['sweet', '#ffffff', '#fff', 'cubes'],
  esmer_seker: ['sweet', '#c08a4a', '#fff3e0', 'crystal'], jaggery: ['sweet', '#a1662f', '#fff', 'block'], bal: ['jar', '#ffb300', '#6d4c41', 'honey'],
  // ---- diğer
  besin_mayasi: ['powder', '#f0d58c', '#8d6e63', 'pile'], maya_ozu: ['jar', '#3e2723', '#fdd835', 'jar'], hardal: ['jar', '#fbc02d', '#c62828', 'tube'],
  balzamik: ['bottle', '#3e1f2a', '#212121', 'round'], tuz: ['salt', '#ffffff', '#90a4ae'],
  // ---- hayvansal
  inek_sutu: ['cup', '#ffffff', '#1e88e5', 'carton'], inek_sutu_yarim: ['cup', '#ffffff', '#43a047', 'carton'], inek_sutu_yagsiz: ['cup', '#ffffff', '#e53935', 'carton'],
  yogurt: ['bowl', '#ffffff', '#90caf9', 'peak'], suzme_yogurt: ['bowl', '#fffaf0', '#4fc3f7', 'swirl'], beyaz_peynir: ['block', '#ffffff', '#e0e0e0', 'cube'],
  kasar: ['block', '#ffca28', '#fff3c4', 'wedge'], mozzarella: ['block', '#fffdf2', '#fff', 'ball'], lor: ['block', '#fffef7', '#fff', 'crumble'],
  ricotta: ['bowl', '#fffdf5', '#d7ccc8', 'dots'], parmesan: ['block', '#f3d77a', '#fff8e1', 'wedge'], krem_peynir: ['bowl', '#ffffff', '#b0bec5', 'swirl'],
  tereyagi: ['block', '#ffe082', '#fff', 'stick'], krema: ['cup', '#fffdf0', '#ffffff', 'glass'], yumurta: ['egg', '#fff3e0', '#ffb300', 'whole'],
  yumurta_aki: ['egg', '#ffffff', '#ffb300', 'white'], yumurta_sarisi: ['egg', '#ffffff', '#ff8f00', 'yolk'], dana_kiyma: ['meat', '#c62828', '#ffccbc', 'mince'],
  kuzu_but: ['meat', '#d84315', '#ffe0b2', 'leg'], dana_ciger: ['meat', '#6d1b1b', '#fff', 'liver'], tavuk_gogus: ['meat', '#ffccbc', '#ffffff', 'breast'],
  hindi: ['meat', '#d4996b', '#fff', 'turkey'], somon: ['fish', '#ff8a65', '#ffffff', 'fillet'], alabalik: ['fish', '#90a4ae', '#f48fb1', 'fish'],
  hamsi: ['fish', '#78909c', '#e1f5fe', 'small'], uskumru: ['fish', '#1e88e5', '#e3f2fd', 'fish'], levrek: ['fish', '#b0bec5', '#ffffff', 'fish'],
  morina: ['fish', '#fff8e1', '#e0e0e0', 'fillet'], sardalya: ['fish', '#90a4ae', '#ffffff', 'can'], ton_baligi: ['fish', '#d7a99a', '#ffffff', 'can'],
  karides: ['fish', '#ff7043', '#ffccbc', 'shrimp'], midye: ['fish', '#263238', '#90a4ae', 'mussel'],
  beyaz_ekmek: ['bread', '#d9a35b', '#fbefd5', 'loaf'], tam_bugday_ekmegi: ['bread', '#9c6a3c', '#d8b48a', 'loaf'], cavdar_ekmegi: ['bread', '#5d4037', '#a1887f', 'loaf'],
  pide_lavas: ['bread', '#e8c27a', '#fff3d6', 'flat'], pide_lavas_tam: ['bread', '#b98b5a', '#e6cba6', 'flat'], patlamis_misir: ['popcorn', '#fff8e1', '#e53935'],
  su: ['water', '#e3f2fd', '#90caf9'], uzum_suyu: ['cup', '#6a1b9a', '#ffffff', 'glass'], taze_sogan: ['long', '#f1f8e9', '#43a047', 'leek'],
  patates_kizartmasi: ['fries', '#fbc02d', '#d32f2f'], tavuk_but: ['meat', '#e6a57e', '#fff3e0', 'drumstick'], dana_biftek: ['meat', '#b71c1c', '#ffe0e0', 'steak'],
  sirken: ["leafy", "#558b2f", "#dcedc8", "curly"],
  salgam_yapragi: ["leafy", "#43a047", "#e8f5e9"],
  karpuz_cekirdegi: ["seeds", "#efebe9", "#3e2723", "drop"],
  altin_cilek: ["round", "#ffb300", "#c5e1a5", "seeds"],
  arpacik_sogan: ["bulb", "#a1887f", "#8d6e63", "onion"],
  kestane_mantari: ["mushroom", "#8d6e63", "#d7ccc8", "cap"],
  horoz_mantari: ["mushroom", "#ffb74d", "#fff3e0", "cap"],
  irlanda_yosunu: ["seaweed", "#bcaaa4", "#6d4c41", "sheet"],
  soya_filizi: ["herb", "#fff59d", "#c0ca33", "feather"],
  besin_mayasi_z: ["powder", "#ffd54f", "#f57f17", "pile"],
  psyllium: ["powder", "#efebe9", "#a1887f", "pile"],
  hibiskus_cayi: ["cup", "#c2185b", "#f8bbd0"],
  bitki_cayi: ["cup", "#9e9d24", "#f0f4c3"],
  oolong: ["cup", "#a1887f", "#efebe9"],
  turk_kahvesi: ["cup", "#4e342e", "#d7ccc8"],
  latte_bitkisel: ["cup", "#bcaaa4", "#fff8e1"],
  cappuccino_bitkisel: ["cup", "#8d6e63", "#fffde7"],
  americano: ["cup", "#3e2723", "#bcaaa4"],
  siyez_bulguru: ["grain", "#a1887f", "#efebe9"],
  siyah_pirinc: ["grain", "#311b92", "#d1c4e9"],
  siyah_mercimek: ["legume", "#212121", "#9e9e9e"],
  lufer: ["fish", "#546e7a", "#cfd8dc", "fish"],
  istavrit: ["fish", "#78909c", "#fff9c4", "small"],
  kefal: ["fish", "#607d8b", "#eceff1", "fish"],
  kalkan: ["fish", "#8d6e63", "#efebe9", "fillet"],
  dil_baligi: ["fish", "#bcaaa4", "#fff3e0", "fillet"],
  kilic: ["fish", "#90a4ae", "#fce4ec", "fillet"],
  sazan: ["fish", "#a1887f", "#fff8e1", "fish"],
  mezgit: ["fish", "#cfd8dc", "#ffffff", "small"],
  orfoz: ["fish", "#6d4c41", "#d7ccc8", "fish"],
  yayin_baligi: ["fish", "#5d4037", "#bcaaa4", "fish"],
  mersin_baligi: ["fish", "#455a64", "#b0bec5", "fish"],
  yilan_baligi: ["fish", "#37474f", "#a5d6a7", "fish"],
  balik_yumurtasi: ["fish", "#ff8a65", "#ffe0b2", "can"],
  kalamar: ["fish", "#f5f5f5", "#f8bbd0", "shrimp"],
  ahtapot: ["fish", "#ce93d8", "#f3e5f5", "shrimp"],
  murekkep_baligi: ["fish", "#e0e0e0", "#5d4037", "shrimp"],
  istiridye: ["fish", "#9e9e9e", "#eeeeee", "mussel"],
  deniz_taragi: ["fish", "#ffcc80", "#fff3e0", "mussel"],
  yengec: ["fish", "#ef5350", "#ffcdd2", "shrimp"],
  istakoz: ["fish", "#c62828", "#ffab91", "shrimp"],
  kerevit: ["fish", "#d84315", "#ffe0b2", "shrimp"],
  kusburnu: ["round", "#d32f2f", "#558b2f", "seeds"],
  isirgan: ["leafy", "#2e7d32", "#81c784", "curly"],
  frenk_uzumu_kirmizi: ["cluster", "#e53935", "#aed581", "berry"],
  uzum_sirkesi: ["bottle", "#880e4f", "#f8bbd0", "small"],
  dereotu_tohumu: ["spice", "#827717", "#f0f4c3"],
  gemlik_zeytini: ["round", "#212121", "#616161", "seeds"],
  taflan: ["cluster", "#311b92", "#4a148c", "berry"],
  seylan_tarcini: ["spice", "#bf8040", "#fbe9e7"],
  uzum_pekmezi: ["jar", "#4e342e", "#a1887f"],
  nar_eksisi: ["bottle", "#b71c1c", "#ffcdd2"],
  sumak: ["spice", "#8e244d", "#f8bbd0"],
  corek_otu: ["seeds", "#212121", "#9e9e9e", "drop"],
  isot: ["spice", "#3e2723", "#d7ccc8"],
  aslan_yelesi: ["mushroom", "#fafafa", "#ffe0b2", "cap"],
  kral_istiridye: ["mushroom", "#d7ccc8", "#fff8e1", "cap"],
  kayin_mantari: ["mushroom", "#bcaaa4", "#f5f5f5", "cap"],
  kavak_mantari: ["mushroom", "#795548", "#efebe9", "cap"],
  kanlica: ["mushroom", "#ef6c00", "#ffcc80", "cap"],
  yumurta_mantari: ["mushroom", "#ff8f00", "#fff59d", "cap"],
  reishi: ["mushroom", "#8e2a1c", "#d7a86e", "cap"],
  keci_sutu: ["cup", "#fffde7", "#a1887f", "carton"],
  koyun_sutu: ["cup", "#fff8e1", "#8d6e63", "carton"],
  kefir: ["cup", "#fafafa", "#90caf9", "carton"],
  ayran_yayik: ["cup", "#ffffff", "#b3e5fc", "carton"],
  keci_peyniri: ["block", "#fffde7", "#bdbdbd"],
  yogurt_yagsiz: ["bowl", "#ffffff", "#e0e0e0", "swirl"],
  lor_cottage: ["bowl", "#fff8e1", "#ffe082", "swirl"],
  peynir_alti: ["cup", "#fff9c4", "#dce775", "carton"],
  bildircin_yumurtasi: ["egg", "#d7ccc8", "#5d4037"],
  ordek_yumurtasi: ["egg", "#e0f2f1", "#80cbc4"],
  kaz_yumurtasi: ["egg", "#fafafa", "#bdbdbd"],
  kuzu_kiyma: ["meat", "#c2185b", "#f8bbd0", "mince"],
  keci_eti: ["meat", "#8d3a3a", "#ffcdd2", "steak"],
  dana_kiyma_genc: ["meat", "#e57373", "#fce4ec", "mince"],
  kuzu_ciger: ["meat", "#5a1414", "#ce93d8", "liver"],
  kuzu_bobrek: ["meat", "#7b1f2b", "#d7ccc8", "liver"],
  dana_yurek: ["meat", "#9a1b1b", "#ef9a9a", "steak"],
  dana_dil: ["meat", "#d48a8a", "#fbe9e7", "steak"],
  iskembe: ["meat", "#f5f0e6", "#d7ccc8", "mince"],
  dana_beyin: ["meat", "#f8bbd0", "#fce4ec", "liver"],
  kurutulmus_dana: ["meat", "#8e2a1c", "#ffab91", "steak"],
  tavuk_kanat: ["meat", "#f4c27a", "#fff3e0", "wing"],
  tavuk_kiyma: ["meat", "#f8d7a8", "#fff8e1", "mince"],
  tavuk_ciger: ["meat", "#7a2e1e", "#bcaaa4", "liver"],
  tavuk_taslik: ["meat", "#a1503a", "#ffccbc", "liver"],
  ordek: ["meat", "#a1503a", "#ffe0b2", "steak"],
  kaz: ["meat", "#b5653f", "#fff8e1", "steak"],
  bildircin: ["meat", "#c98a5a", "#efebe9", "turkey"],
  whey_izolat: ["powder", "#fff8e1", "#1565c0", "scoop"],
  whey_tozu: ["powder", "#fff3e0", "#42a5f5", "scoop"],
  yumurta_aki_tozu: ["powder", "#ffffff", "#ffca28", "scoop"],
  jelatin: ["powder", "#fffde7", "#bcaaa4", "scoop"],
  soya_protein_tozu: ["powder", "#f3e3b5", "#43a047", "scoop"],
  bezelye_proteini: ["powder", "#c5e1a5", "#558b2f", "scoop"],
  pirinc_proteini: ["powder", "#efebe9", "#8d6e63", "scoop"],
  kenevir_proteini: ["powder", "#9ccc65", "#33691e", "scoop"],
  kabak_cek_proteini: ["powder", "#7cb342", "#dcedc8", "scoop"],
  karisik_bitkisel_protein: ["powder", "#a5d6a7", "#6d4c41", "scoop"],
  kazein: ["powder", "#fffde7", "#5c6bc0", "scoop"],
  sigir_proteini: ["powder", "#d7a99a", "#8d3a3a", "scoop"],
  kolajen_peptit: ["powder", "#fff8e1", "#f48fb1", "scoop"],
  kreatin: ["powder", "#ffffff", "#90a4ae", "pile"],
  ayran: ["cup", "#ffffff", "#b0bec5"],
  kaju_ayrani: ["cup", "#fff3e0", "#d7a86e"],
  mercimek_koftesi: ["legume", "#e8a25a", "#7cb342", "round"],
  cig_kofte: ["legume", "#b23a2a", "#43a047", "round"],
  simit: ["bread", "#b5651d", "#f3d9a4", "flat"],
  lahmacun: ["bread", "#e8c58a", "#c0392b", "flat"],
  gozleme_ispanakli: ["bread", "#f0d9a8", "#4caf50", "flat"],
  gozleme_patatesli: ["bread", "#f0d9a8", "#f2c14e", "flat"],
  kisir: ["bowl", "#c9a24a", "#7cb342", "dots"],
  piyaz: ["bowl", "#f5ecd7", "#e57373", "dots"],
  fava: ["bowl", "#e9d88a", "#a5d6a7", "peak"],
  ezogelin_corbasi: ["bowl", "#d9622b", "#fff3e0", "plain"],
  zeytinyagli_fasulye_domatesli: ["bowl", "#5e9b3a", "#ef9a9a", "plain"],
  imam_bayildi: ["bowl", "#5b2a6e", "#ef6c35", "peak"],
  zeytinyagli_enginar: ["bowl", "#9bbb59", "#ffb74d", "dots"],
  bulgur_pilavi: ["grain", "#b88a4a", "#e57373", "bowl"],
  eksi_mayali_ekmek: ["bread", "#d7a86e", "#fff3e0", "loaf"],
  cok_tahilli_ekmek: ["bread", "#a1887f", "#efebe9", "loaf"],
  yulaf_ekmegi: ["bread", "#e0c48c", "#fffde7", "loaf"],
  kepekli_ekmek: ["bread", "#8d6e63", "#d7ccc8", "loaf"],
  pumpernickel: ["bread", "#4e342e", "#a1887f", "loaf"],
  italyan_ekmegi: ["bread", "#f0d9a8", "#fff8e1", "loaf"],
  bagel: ["bread", "#d4a373", "#fefae0", "loaf"],
  naan: ["bread", "#e6c79c", "#fff3e0", "flat"],
  chapati: ["bread", "#d9b382", "#fff8e1", "flat"],
  misir_tortilla: ["bread", "#fbc02d", "#fff9c4", "flat"],
  un_tortilla: ["bread", "#fff3e0", "#e0c48c", "flat"],
  grissini: ["bread", "#e0b46e", "#fff3e0", "stick"],
  yufka: ["bread", "#fffde7", "#f5e1a4", "flat"],
  galeta_unu: ["powder", "#e0c48c", "#a1887f", "pile"],
  tam_bugday_kraker: ["bread", "#c8a26a", "#fff8e1", "stick"],
  kruvasan: ["bread", "#f2b65a", "#fff3e0", "flat"],
  falafel: ["legume", "#8d6e63", "#d7a86e", "round"],
  tabule: ["bowl", "#7cb342", "#dcedc8", "swirl"],
  zeytinyagli_sarma: ["leafy", "#558b2f", "#c5e1a5", "curly"],
  etli_sarma: ["leafy", "#33691e", "#bcaaa4", "curly"],
  cacik: ["bowl", "#ffffff", "#a5d6a7", "swirl"],
  baklava: ["sweet", "#e0a84a", "#fff3e0"],
  ispanakli_borek: ["bread", "#7cb342", "#fff8e1", "flat"],
  kuzu_sis: ["meat", "#8d3a3a", "#c5e1a5", "steak"],
  tavuk_sis: ["meat", "#f4c27a", "#aed581", "steak"],
  tavuk_doner: ["meat", "#e8b36a", "#fff3e0", "turkey"],
  et_doner: ["meat", "#7b3f2a", "#d7a86e", "mince"],
  filizlenmis_bugday_ekmegi: ["bread", "#b08452", "#e8d3a8", "loaf"],
  misir_ekmegi: ["bread", "#e8b830", "#fff3b0", "loaf"],
  yumurtali_ekmek: ["bread", "#e8a33a", "#fff1c1", "loaf"],
  tam_bugday_tortilla: ["bread", "#c49a63", "#f3e2c0", "flat"],
  chapati_tam: ["bread", "#b98a55", "#efdcb8", "flat"],
  ingiliz_muffin: ["bread", "#b5895a", "#f5e6c8", "loaf"],
  peksimet: ["block", "#d9a35e", "#a8733a", "bar"],
  milfoy: ["bread", "#f0c56a", "#fff8dc", "flat"],
  glutensiz_ekmek: ["bread", "#f2dcae", "#fffaf0", "loaf"],
  yulaf_lapasi: ["bowl", "#e8d8a8", "#d7ccc8", "dots"],
  celik_kesim_yulaf: ["grain", "#d2b67a", "#a1887f", "bowl"],
  yulaf_unu: ["grain", "#ead9b0", "#f5efe0", "sack"],
  tam_bugday_makarna: ["grain", "#c08a45", "", "pasta"],
  pirinc_eriste: ["grain", "#efe6d2", "", "pasta"],
  pilavlik_pirinc: ["grain", "#f3e0b0", "#4fc3f7", "bowl"],
  nohut_unu: ["grain", "#e9c46a", "#fdf3d8", "sack"],
  misir_irmigi: ["grain", "#ffc83d", "#ffe9a8", "bowl"],
  granola: ["grain", "#a86b32", "#efe0c0", "bowl"],
  badem_unu: ["grain", "#ecd5b0", "#c69c6d", "sack"],
  humus_ev: ["legume", "#d9b77a", "#e65100", "mash"],
  mercimek_corbasi: ["bowl", "#f08a24", "#fff3e0", "plain"],
  sehriyeli_pilav: ["grain", "#fbf3dc", "#c8a26a", "bowl"],
  pirinc_pilavi: ["grain", "#fffdf6", "#ffcc80", "bowl"],
  mercimekli_pilav: ["grain", "#a08050", "#fff3e0", "bowl"],
  etli_yaprak_sarma_kuzu: ["leafy", "#4e6b2a", "#a1887f", "curly"],
  musakka: ["block", "#b5562f", "#f3d27a", "bar"],
  patlican_ezmesi: ["legume", "#a88a6a", "#43a047", "mash"],
  zeytinyagli_taze_fasulye: ["legume", "#5a9a3c", "#f0e6a0", "pod"],
  ispanak_yemegi: ["leafy", "#2f6b2f", "#f0e6a0", "broad"],
  menemen: ["bowl", "#ef6c35", "#5d5d5d", "dots"],
  sutlac: ["bowl", "#fdf6e3", "#c8a27a", "dots"],
  lokma: ["block", "#d9902f", "#ffe0b2", "ball"],
  dana_sis: ["meat", "#7a3324", "#9ccc65", "steak"],
  manti_benzeri: ["legume", "#f1d9a0", "#a1503a", "round"],
  tavuk_sehriye_corbasi: ["bowl", "#f6d36b", "#ffffff", "dots"],
  patates_puresi: ["bowl", "#f7e7b0", "#cfd8dc", "peak"],
  mayonez: ["jar", "#fff8d6", "#1976d2", "jar"],
  pesto: ["jar", "#4c8c2b", "#ffffff", "jar"],
  kuru_elma: ["round", "#f3dfa2", "#e0b860", "half noleaf"],
  kuru_seftali: ["nut", "#f08a3c", "#ffd180", "macadamia"],
  sultani_uzum: ["seeds", "#d4a03a", "#f3e5c0", "round"],
  kus_uzumu: ["seeds", "#2b1d24", "#d7ccc8", "round"],
  kuru_visne: ["seeds", "#8e1b2b", "#f8bbd0", "round"],
  pestil: ["block", "#8a2a3c", "#b5485a", "bar"],
  hunnap: ["round", "#a0321e", "#8d6e63", "crease"],
  greyfurt_beyaz: ["round", "#f4e27a", "#fff9c4", "half"],
  mandalina_suyu: ["cup", "#ffa000", "#ffffff", "glass"],
  turna_yemisi_suyu: ["cup", "#b0122c", "#ffffff", "glass"],
  kurutulmus_domates: ["round", "#b3261e", "#6d4c41", "crease noleaf"],
  domates_konserve: ["jar", "#e53935", "#ffcc80", "can"],
  domates_puresi: ["jar", "#cc2a1f", "#4caf50", "jar"],
  domates_sosu: ["jar", "#e8452c", "#81c784", "can"],
  sari_biber: ["long", "#fbc02d", "#2e7d32", "pepper"],
  carliston_biber: ["long", "#d4e157", "#33691e", "chili"],
  yesil_aci_biber: ["long", "#388e3c", "#1b5e20", "chili"],
  jalapeno: ["long", "#2f7d32", "#6d4c41", "chili"],
  radicchio: ["leafy", "#8e1f4f", "#f5f5f5", "head"],
  hindiba: ["leafy", "#c5d86d", "#fff9c4", "vine"],
  kivircik_marul: ["leafy", "#7cb342", "#dcedc8", "curly"],
  labada: ["leafy", "#4a7c2a", "#8d3a3a", "broad"],
  cin_lahanasi: ["leafy", "#dce775", "#f1f8e9", "stalk"],
  balkabagi_butternut: ["pear", "#f4b860", "#7cb342"],
  kereviz_kok_haslanmis: ["tuber", "#efe3c4", "#bcaaa4", "knob"],
  kapari: ["seeds", "#6b7d2a", "#e6ee9c", "round"],
  biber_tursusu: ["jar", "#c0ca33", "#e53935", "jar"],
  kimchi: ["jar", "#d84a2a", "#455a64", "jar"],
  kirmizi_fasulye_konserve: ["legume", "#7a1f22", "#ffcdd2", "bean"],
  bakla_konserve: ["legume", "#a89060", "#4e342e", "bean"],
  tofu_yumusak: ["block", "#fffef8", "#e1f5fe", "cube"],
  tofu_kizarmis: ["block", "#d8a24a", "#fff3d0", "cube"],
  soya_yogurdu: ["bowl", "#fff9ee", "#f48fb1", "swirl"],
  tvp: ["block", "#c9955a", "#ffffff", "crumble"],
  sebze_burger: ["block", "#7b5a2e", "#9ccc65", "speckled"],
  hindistancevizi_yogurdu: ["bowl", "#ffffff", "#a1887f", "swirl"],
  badem_yogurdu: ["bowl", "#f8ecd8", "#c69c6d", "swirl"],
  bezelye_filizi: ["herb", "#66bb6a", "#c5e1a5", "sprig"],
  badem_ezmesi: ["jar", "#a86a3a", "#6d4c41", "jar"],
  kaju_ezmesi: ["jar", "#e3c08a", "#8d6e63", "jar"],
  aycicegi_ezmesi: ["jar", "#8f7a5a", "#fbc02d", "jar"],
  karisik_kuruyemis: ["seeds", "#a0703a", "#f0e0c0", "drop"],
  kavrulmus_susam: ["seeds", "#d9a85a", "#bcaaa4", "drop"],
  hindistancevizi_sutu_konserve: ["jar", "#fdfcf6", "#8d6e63", "can"],
  uzum_cekirdegi_yagi: ["bottle", "#d4e157", "#6a1b9a", "tall"],
  bugday_ruseymi_yagi: ["bottle", "#f9a825", "#c8a24a", "tall"],
  badem_yagi: ["bottle", "#fff3b0", "#b5793f", "small"],
  margarin: ["block", "#ffe066", "#ffffff", "stick"],
  sade_yag: ["jar", "#f2b632", "#c8a24a", "honey"],
  morina_karaciger_yagi: ["bottle", "#e8b923", "#1565c0", "round"],
  bitter_60: ["block", "#4a2a1a", "#3a2014", "bar"],
  sutlu_cikolata: ["block", "#7b4a2a", "#5d3a20", "bar"],
  recel: ["jar", "#c2185b", "#fafafa", "jar"],
  portakal_marmelati: ["jar", "#f57c00", "#2e7d32", "jar"],
  agave: ["bottle", "#d99a2b", "#4caf50", "round"],
  tahin_helvasi: ["block", "#d8c09a", "#a1887f", "speckled"],
  susamli_pasteli: ["block", "#d9a441", "#8d5a2b", "bar"],
  lokum_benzeri: ["sweet", "#f48fb1", "#ffffff", "cubes"],
  dondurma_vanilya: ["bowl", "#fff6d5", "#8d6e63", "peak"],
  manda_sutu: ["cup", "#fffff5", "#5d4037", "carton"],
  sut_tozu: ["powder", "#fffbea", "#1e88e5", "scoop"],
  kondanse_sut: ["jar", "#f7e7b8", "#1565c0", "can"],
  eksi_krema: ["bowl", "#fffef5", "#80deea", "peak"],
  ayran_yagsiz: ["cup", "#fdfdfd", "#64b5f6", "glass"],
  gouda: ["block", "#f6c445", "#c62828", "wedge"],
  gravyer: ["block", "#f0d27a", "#a1887f", "wedge"],
  rokfor: ["block", "#f3f0e6", "#4f6d7a", "speckled"],
  taze_peynir: ["block", "#fffcf0", "#e0e0e0", "cube"],
  suzme_yogurt_yagsiz: ["bowl", "#fbfbfb", "#90a4ae", "peak"],
  yumurta_pismis: ["egg", "#fff8ec", "#ffa000", "yolk"],
  cirpilmis_yumurta: ["egg", "#ffd54f", "#ffffff", "white"],
  kuzu_pirzola: ["meat", "#b5473c", "#fafafa", "drumstick"],
  kuzu_kusbasi: ["meat", "#9e2f3a", "#f8d0d0", "mince"],
  dana_bonfile: ["meat", "#8b1e22", "#f2c4c4", "steak"],
  dana_dos: ["meat", "#9c3b2e", "#fff0e6", "breast"],
  dana_kiyma_yagsiz: ["meat", "#b71c1c", "#ffebee", "mince"],
  buzagi_eti: ["meat", "#d77a7a", "#fff5f0", "steak"],
  pastirma_benzeri: ["meat", "#7f1d1d", "#e6a07a", "steak"],
  sucuk_benzeri: ["long", "#7b1e22", "#f5e6d3", "cuke"],
  sosis_dana: ["long", "#c4603e", "#8d3a2a", "zucchini"],
  tavsan: ["meat", "#e8b4a0", "#fff3e0", "leg"],
  tavuk_gogus_derili: ["meat", "#f2c98a", "#fff8e1", "breast"],
  tavuk_baget: ["meat", "#e9a85a", "#fff8e1", "drumstick"],
  tavuk_but_derili: ["meat", "#e0a060", "#ffe0b2", "leg"],
  butun_tavuk: ["meat", "#eab26a", "#fff3e0", "turkey"],
  haslama_tavuk: ["meat", "#f5e0c0", "#ffffff", "breast"],
  hindi_gogus: ["meat", "#f3d9b5", "#fff8e1", "breast"],
  tavuk_suyu: ["bowl", "#f5d77a", "#ffffff", "plain"],
  ton_baligi_yagli: ["fish", "#e8b08a", "#f4d03f", "can"],
  orkinos: ["fish", "#3d5a80", "#c0d6e4", "fish"],
  fume_somon: ["fish", "#f28c5c", "#ffd1b8", "fillet"],
  somon_konserve: ["fish", "#f4a582", "#e0e0e0", "can"],
  havyar: ["seeds", "#1c1c1c", "#90a4ae", "round"],
  gumus_baligi: ["fish", "#b0bec5", "#e3f2fd", "small"],
  kalamar_tava: ["round", "#e2a84a", "#f7f2ea", "half noleaf"],
  akivades: ["fish", "#d7c4a8", "#8d6e63", "mussel"],
  yulaf_sutu: ["cup", "#f1e4c3", "#c8a24a", "carton"],
  kombucha: ["bottle", "#c98a2e", "#37474f", "tall"],
  hazir_kahve: ["cup", "#5d3a1a", "#ffffff", "mug"],
  kola: ["cup", "#3e1f12", "#e53935", "glass"],
  soda: ["cup", "#e3f2fd", "#b3e5fc", "glass"],
  bira: ["cup", "#f0a818", "#fffde7", "mug"],
  kirmizi_sarap: ["bottle", "#6a0f24", "#3e2723", "tall"],
  beyaz_sarap: ["bottle", "#ede6a0", "#3e2723", "tall"],
  mercankosk: ["herb", "#93a35a", "#6d6d3a", "round"],
  beyaz_biber: ["spice", "#ede3cc", "#a1887f", "powder"],
  tarhun: ["herb", "#6f8f3e", "#4e5b2a", "sprig"],
  ketcap: ["bottle", "#c62828", "#f5f5f5", "small"],
  salsa: ["bowl", "#d84315", "#ffe082", "dots"],
  sriracha: ["bottle", "#e53921", "#2e7d32", "round"],
  vegan_mayonez: ["jar", "#fff5c8", "#43a047", "jar"],
  beyaz_sirke: ["bottle", "#f5fbff", "#9e9e9e", "tall"],
};

// Eski bir çizimde olmayan şablon/seçenek gelirse güvenle boş döner (emoji yedeği devreye girer)
export function foodArt(id, size = 28) {
  const a = FOOD_ART[id];
  if (!a) return '';
  const [shape, c, c2, o] = a;
  const fn = SHAPES[shape];
  if (!fn) return '';
  // Açık renkli yuvarlak kart: koyu ve açık temada aynı okunur
  return `<svg class="fart" width="${size}" height="${size}" viewBox="-2 -2 36 36" aria-hidden="true" focusable="false"><rect x="-2" y="-2" width="36" height="36" rx="9" fill="#f7f2ea"/>${fn(c, c2 || undefined, o || undefined)}</svg>`;
}
export const ART_SHAPES = Object.keys(SHAPES);
