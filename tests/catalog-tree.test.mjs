import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {catalogGroup,categoryContains,rootCategories,catalogSections,DRINK_GROUPS} from '../src/catalog-tree.js';
import {EN_CATEGORIES} from '../src/i18n-foods.js';
const db=JSON.parse(fs.readFileSync(new URL('../src/data/foods.json',import.meta.url)));
const categories=db.categories.map(([id,name,icon])=>({id,name,icon})),food=id=>db.foods.find(f=>f.id===id);
test('B151 root categories own every food once, with no repeated child tabs or duplicate catalogue records',()=>{
 const roots=rootCategories(categories);for(const id of ['kurumeyve','yaprak','kok','kahve','soya'])assert.ok(!roots.some(r=>r.id===id));
 assert.equal(roots.find(r=>r.id==='icecek').name,'İçecekler');assert.deepEqual(roots.slice(-3).map(r=>r.id),['icecek','fastfood','atistirmalik']);
 for(const f of db.foods)assert.equal(roots.filter(r=>categoryContains(f,r.id)).length,1,f.id);
 const flat=catalogSections(db.foods,categories).flatMap(g=>g.foods.map(f=>f.id));assert.equal(new Set(flat).size,db.foods.length);assert.equal(flat.length,db.foods.length);
});
test('B152 soy products belong to the legume parent without moving drink identities or saved food references',()=>{
 const selected=db.foods.filter(f=>categoryContains(f,'baklagil'));
 assert.deepEqual(catalogSections(selected,categories).map(g=>g.id),['baklagil','soya']);
 for(const id of ['nohut','soya_fasulyesi','tofu_sert','tempeh','soya_yogurdu','tvp'])assert.ok(selected.some(f=>f.id===id),id);
 for(const f of db.foods.filter(f=>f.cat==='soya'&&catalogGroup(f)==='soya'))assert.equal(categoryContains(f,'baklagil'),true,f.id);
 assert.equal(food('tofu_sert').cat,'soya');assert.equal(categoryContains(food('tofu_sert'),'soya'),true);
 assert.equal(categoryContains(food('soya_sutu'),'baklagil'),false);assert.equal(categoryContains(food('soya_sutu'),'icecek'),true);
 assert.equal(categoryContains(food('soya_yagi'),'baklagil'),false);
});
test('B151 fruit/vegetable selections include descendant sections; all source categories and identifiers stay usable',()=>{
 const fruit=db.foods.filter(f=>categoryContains(f,'meyve'));assert.ok(fruit.some(f=>f.id==='elma'));assert.ok(fruit.some(f=>f.id==='kuru_kayisi'));
 assert.deepEqual(catalogSections(fruit,categories).map(g=>g.id),['meyve','kurumeyve']);
 const veg=db.foods.filter(f=>categoryContains(f,'sebze'));assert.deepEqual(catalogSections(veg,categories).map(g=>g.id),['sebze','yaprak','kok']);assert.ok(veg.some(f=>f.id==='ispanak'));assert.ok(veg.some(f=>f.id==='patates'));
 assert.equal(food('kuru_kayisi').cat,'kurumeyve');assert.equal(food('ispanak').cat,'yaprak');assert.equal(categoryContains(food('buzlu_latte'),'kahve'),true);
});
test('B151 beverages collect coffee, cold coffee, tea, milks and juices without counting vinegar as a drink',()=>{
 for(const id of ['kahve','buzlu_latte','soya_sutu','inek_sutu','papatya','elma_suyu','buzlu_cay_limonlu'])assert.equal(categoryContains(food(id),'icecek'),true,id);
 assert.equal(catalogGroup(food('buzlu_latte')),'icecek_soguk');assert.equal(catalogGroup(food('adacayi')),'baharat');assert.equal(catalogGroup(food('adacayi_demleme')),'icecek_bitki');assert.equal(categoryContains(food('elma_sirkesi'),'icecek'),false);
 for(const g of DRINK_GROUPS)assert.ok(EN_CATEGORIES[g.id],g.id);
});
test('B151 brewed herbal identities do not reuse spice/generic tea measurements; measured zero stays measured',()=>{
 for(const id of ['adacayi_demleme','ihlamur_cayi','nane_cayi','rooibos_cayi']){const fm=food(id).forms[0];assert.deepEqual(fm.v,{});assert.equal(fm.usda,null);assert.ok(fm.unavailable);}
 assert.ok(food('adacayi').forms[0].v.energy>100);assert.ok(food('bitki_cayi').forms[0].usda.ndb);
 assert.equal(food('soguk_yesil_cay').forms[0].v.energy,0);assert.equal(food('soguk_yesil_cay').forms[0].s.energy,'u');
 for(const id of ['sicak_cikolata','buzlu_cay_limonlu','soguk_yesil_cay','limonata'])assert.ok(food(id).forms[0].usda.ndb);
});
