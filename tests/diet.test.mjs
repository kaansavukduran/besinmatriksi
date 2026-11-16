import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {matchesDiet,dietActive} from '../src/diet.js';
import {DEFAULT_SETTINGS,normalizeSettings,exportSettings,parseSettings,resetSettingGroup} from '../src/settings.js';
import {curatedDietProfile} from '../data/diet-profiles.mjs';
import {PLANT_COFFEES,FOODS} from '../data/catalog.mjs';
const db=JSON.parse(fs.readFileSync(new URL('../src/data/foods.json',import.meta.url)));
const food=id=>db.foods.find(f=>f.id===id);
const settings=(pattern='omnivore',rest={})=>normalizeSettings({...DEFAULT_SETTINGS,dietPattern:pattern,...rest});
const matches=(id,s)=>matchesDiet(food(id).dietary,s);
test('diet defaults preserve unrestricted omnivore discovery; old settings migrate, export, restore and reset',()=>{
 const old=normalizeSettings({theme:'dark',font:'atkinson'});assert.equal(old.dietPattern,'omnivore');assert.equal(old.theme,'dark');assert.equal(old.font,'atkinson');assert.equal(dietActive(old),false);
 const custom=settings('vegetarian',{vegetarianDairy:false,dietSesameFree:true});assert.deepEqual(parseSettings(exportSettings(custom)),custom);assert.equal(resetSettingGroup(custom,'matrix').dietPattern,'omnivore');assert.equal(normalizeSettings({dietPattern:'bad',dietSoyFree:'yes'}).dietSoyFree,false);
 assert.equal(matchesDiet(null,old),true);assert.equal(matchesDiet({kind:'unknown'},settings('vegan')),false);
});
test('vegetarian egg/dairy permissions are independent; honey is not vegan, fish is pescatarian',()=>{
 assert.equal(matches('yumurta',settings('vegetarian')),true);assert.equal(matches('inek_sutu',settings('vegetarian')),true);
 assert.equal(matches('yumurta',settings('vegetarian',{vegetarianEggs:false})),false);assert.equal(matches('inek_sutu',settings('vegetarian',{vegetarianDairy:false})),false);
 assert.equal(matches('bal',settings('vegan')),false);assert.equal(matches('bal',settings('vegetarian',{vegetarianDairy:false,vegetarianEggs:false})),true);
 const fish=db.foods.find(f=>f.cat==='balik');assert.equal(matchesDiet(fish.dietary,settings('vegetarian')),false);assert.equal(matchesDiet(fish.dietary,settings('pescatarian')),true);
 const meat=db.foods.find(f=>f.cat==='et');assert.equal(matchesDiet(meat.dietary,settings('pescatarian')),false);
});
test('absence is only positive ingredient knowledge; unknown recipes, labels, oats and separate allergens stay honest',()=>{
 assert.equal(matches('elma',settings('vegan',{dietGlutenFree:true,dietSoyFree:true})),true);
 assert.equal(matches('soya_filizi',settings('vegan',{dietSoyFree:true})),false);
 assert.equal(matches('siyez_bulguru',settings('vegan',{dietGlutenFree:true})),false);
 assert.equal(matches('latte_sutlu_yulafli',settings('vegan')),true);assert.equal(matches('latte_sutlu_yulafli',settings('vegan',{dietGlutenFree:true})),false);
 assert.equal(matches('latte_sutlu_bademli',settings('vegan',{dietTreeNutFree:true})),false);
 assert.equal(matchesDiet(null,settings('omnivore',{dietLactoseFree:true})),false);
 assert.equal(matchesDiet(curatedDietProfile({id:'unknown',cat:'yemek',allergens:[]}),settings('vegan')),false);
 const peanut=FOODS.find(f=>f.id==='yerfistigi');assert.equal(matchesDiet(curatedDietProfile(peanut),settings('vegan',{dietPeanutFree:true})),false);
 assert.equal(matchesDiet(curatedDietProfile(peanut),settings('vegan',{dietTreeNutFree:true})),true);
});
test('all 21 named plant coffees retain explicit source ratios, missing measurements and recipe rather than measured tags',()=>{
 assert.equal(PLANT_COFFEES.length,21);
 for(const f of PLANT_COFFEES){const out=food(f.id),fm=out.forms[0];assert.ok(out);assert.equal(out.dietary.kind,'plant');assert.equal(out.animal,false);assert.ok(!out.en.includes('whole milk'));assert.ok(/with (oat|almond|soy) milk/.test(out.en));assert.equal(matchesDiet(out.dietary,settings('vegan')),true);assert.equal(fm.recipeOf.length,f.recipe.length);assert.ok(Object.values(fm.s).every(s=>s==='r'));assert.equal(fm.portions[0].g,f.recipePortion);assert.equal(fm.v.gluten,undefined);}
 const espresso=food('espresso').forms[0].v, oat=food('yulaf_sutu').forms[0].v;
 const latte=food('latte_sutlu_yulafli').forms[0];assert.ok(Math.abs(latte.v.energy-(espresso.energy*30+oat.energy*150)/180)<0.001);assert.ok(latte.recipeOf.some(x=>x.fdc&&!x.ndb));
 const missing=Object.keys(espresso).find(k=>oat[k]==null);if(missing)assert.equal(latte.v[missing],undefined);
 assert.notEqual(latte.v.energy,food('latte_sutlu').forms[0].v.energy);
});
