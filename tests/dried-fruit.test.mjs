import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {gunzipSync} from 'node:zlib';
import {categoryContains} from '../src/catalog-tree.js';import {searchKey} from '../src/search.js';import {norm} from '../src/util.js';
import { decodeDB } from '../src/foods-codec.js';
const db=decodeDB(JSON.parse(fs.readFileSync(new URL('../src/data/foods.json',import.meta.url)))),food=id=>db.foods.find(f=>f.id===id);
const measured={kuru_mango:'09178',kuru_armut:'09259',kuru_trabzon_hurmasi:'09264',kuru_turna_yemisi:'09079',kuru_yaban_mersini:'09163',kuru_hunnap:'09147',kuru_lici:'09165',kuru_longan:'09173',muz_cipsi:'19400'};
test('B155 nine dried-fruit selections use their own USDA dry/prepared records and raw energy/protein',()=>{
 const raw=new Map();for(const line of gunzipSync(fs.readFileSync(new URL('../data/raw/NUT_DATA.txt.gz',import.meta.url))).toString().split('\n')){const [id,key,value]=line.split('^').map(x=>x.replace(/^~|~$/g,''));if(Object.values(measured).includes(id)&&['208','203'].includes(key))raw.set(id+':'+key,Number(value));}
 for(const [id,ndb] of Object.entries(measured)){const f=food(id),fm=f.forms[0];assert.equal(f.cat,'kurumeyve');assert.equal(categoryContains(f,'meyve'),true);assert.equal(fm.usda.ndb,ndb);assert.equal(fm.v.energy,raw.get(ndb+':208'));assert.equal(fm.v.protein,raw.get(ndb+':203'));assert.equal(fm.s.energy,'u');}
 for(const id of ['kuru_mango','kuru_turna_yemisi','kuru_yaban_mersini']){assert.match(food(id).tr,/şekerli/);assert.match(food(id).forms[0].usda.desc,/sweetened/);}
 assert.deepEqual(food('kuru_armut').allergens,['sulfit']);assert.match(food('muz_cipsi').tr,/kızartılmış/);
});
test('B155 sun-dried apricot and four unmeasured dried fruits are separate honest data gaps',()=>{
 for(const id of ['gun_kurusu_kayisi','kuru_dut','kuru_cilek','kuru_ananas','kuru_kivi']){const f=food(id),fm=f.forms[0];assert.equal(categoryContains(f,'meyve'),true);assert.deepEqual(fm.v,{});assert.deepEqual(fm.s,{});assert.equal(fm.usda,null);assert.ok(fm.unavailable);}
 const sun=food('gun_kurusu_kayisi');for(const q of ['gün kurusu','günkurusu','gunkursu','kükürtsüz kuru kayısı','unsulfured apricot'])for(const t of norm(q).split(' '))assert.ok(searchKey(sun).includes(t),q);
 assert.equal(food('kuru_kayisi').forms[0].usda.ndb,'09032');assert.equal(food('kuru_kayisi').forms[0].v.energy,241);assert.ok(!food('kuru_kayisi').tr.includes('Gün kurusu'));
});
test('B155 explicit dried entries preserve existing fresh-food form order and share the original analysis',()=>{
 for(const [dry,fresh] of [['kuru_turna_yemisi','kizilcik'],['kuru_yaban_mersini','yabanmersini'],['kuru_hunnap','hunnap']]){const a=food(dry).forms[0],b=food(fresh).forms[1];assert.equal(b.key,'kurutulmus');assert.equal(a.usda.ndb,b.usda.ndb);assert.deepEqual(a.v,b.v);assert.deepEqual(a.s,b.s);assert.match(food(dry).note,/ayrı bir analiz değildir/);}
});
