// B245: küratörlü katalog (foods.json) için kayıpsız sıkıştırma. Veri, değer, birim ve sıra birebir korunur:
// decodeDB(encodeDB(db)) ile db derin eşittir (testle doğrulanır).
// - form.v {anahtar: sayı} → form.V [anahtarSırası, değer, …] (anahtar adları tek tabloda: db.vkeys)
// - form.s {anahtar: "u"} → form.S "uuur…" (v ile aynı anahtar ve sırada, her değer için tek karakter kaynak kodu)
// - porsiyonlar {g, label, en, …} → [g, şablonSırası] (yinelenen etiketler tek tabloda: db.ptpl)
// Sıkıştırılmamış (eski) veri decodeDB'den olduğu gibi geçer.
export const CODEC_VERSION = 1;

export function encodeDB(db) {
  const vkeys = [], vIndex = new Map();
  const ptpl = [], pIndex = new Map();
  const keyId = (k) => { if (!vIndex.has(k)) { vIndex.set(k, vkeys.length); vkeys.push(k); } return vIndex.get(k); };
  const tplId = (p) => {
    const { g, ...rest } = p;
    const sig = JSON.stringify(rest);
    if (!pIndex.has(sig)) { pIndex.set(sig, ptpl.length); ptpl.push(rest); }
    return pIndex.get(sig);
  };
  const foods = db.foods.map((food) => ({
    ...food,
    forms: food.forms.map((form) => {
      const out = {};
      for (const [k, x] of Object.entries(form)) {
        if (k === 'v') {
          const sk = Object.keys(form.s || {}), vk = Object.keys(x);
          if (sk.length !== vk.length || vk.some((key, i) => sk[i] !== key || typeof form.s[key] !== 'string' || form.s[key].length !== 1 || typeof x[key] !== 'number')) {
            throw new Error(`codec: ${food.id} biçimi v/s eşleşmiyor`);
          }
          out.V = vk.flatMap((key) => [keyId(key), x[key]]);
          out.S = vk.map((key) => form.s[key]).join('');
        } else if (k === 's') {
          // V ile birlikte yazıldı
        } else if (k === 'portions') {
          out.P = x.map((p) => {
            if (Object.keys(p)[0] !== 'g') throw new Error(`codec: ${food.id} porsiyonu g ile başlamıyor`);
            return [p.g, tplId(p)];
          });
        } else out[k] = x;
      }
      return out;
    }),
  }));
  return { codec: CODEC_VERSION, ...db, vkeys, ptpl, foods };
}

export function decodeDB(db) {
  if (!db || db.codec !== CODEC_VERSION) return db;
  const { codec, vkeys, ptpl, foods, ...rest } = db;
  const decoded = foods.map((food) => {
    food.forms = food.forms.map((form) => {
      const out = {};
      for (const [k, x] of Object.entries(form)) {
        if (k === 'V') {
          const v = {}, s = {};
          for (let i = 0, j = 0; i < x.length; i += 2, j++) { const key = vkeys[x[i]]; v[key] = x[i + 1]; s[key] = form.S[j]; }
          out.v = v; out.s = s;
        } else if (k === 'S') {
          // V ile birlikte açıldı
        } else if (k === 'P') out.portions = x.map(([g, t]) => ({ g, ...ptpl[t] }));
        else out[k] = x;
      }
      return out;
    });
    return food;
  });
  return { ...rest, foods: decoded };
}

// B245: geniş USDA kataloğu (foods-ext.json) için aynı yöntem: f.v → f.V [anahtarSırası, değer, …], f.p → f.P [[g, şablon], …].
// f.fs (kaynak istisnaları) ve diğer alanlar olduğu gibi kalır.
export function encodeExt(db) {
  const vkeys = [], vIndex = new Map(), ptpl = [], pIndex = new Map();
  const keyId = (k) => { if (!vIndex.has(k)) { vIndex.set(k, vkeys.length); vkeys.push(k); } return vIndex.get(k); };
  const tplId = (p) => { const { g, ...rest } = p; const sig = JSON.stringify(rest); if (!pIndex.has(sig)) { pIndex.set(sig, ptpl.length); ptpl.push(rest); } return pIndex.get(sig); };
  const foods = db.foods.map((f) => {
    const out = {};
    for (const [k, x] of Object.entries(f)) {
      if (k === 'v') {
        if (Object.values(x).some((n) => typeof n !== 'number')) throw new Error(`codec: ${f.n} sayı olmayan değer`);
        out.V = Object.entries(x).flatMap(([key, n]) => [keyId(key), n]);
      } else if (k === 'p') {
        out.P = x.map((p) => { if (Object.keys(p)[0] !== 'g') throw new Error(`codec: ${f.n} porsiyonu g ile başlamıyor`); return [p.g, tplId(p)]; });
      } else out[k] = x;
    }
    return out;
  });
  return { codec: CODEC_VERSION, ...db, vkeys, ptpl, foods };
}

export function decodeExt(db) {
  if (!db || db.codec !== CODEC_VERSION) return db;
  const { codec, vkeys, ptpl, foods, ...rest } = db;
  return {
    ...rest,
    foods: foods.map((f) => {
      const out = {};
      for (const [k, x] of Object.entries(f)) {
        if (k === 'V') { const v = {}; for (let i = 0; i < x.length; i += 2) v[vkeys[x[i]]] = x[i + 1]; out.v = v; }
        else if (k === 'P') out.p = x.map(([g, t]) => ({ g, ...ptpl[t] }));
        else out[k] = x;
      }
      return out;
    }),
  };
}
