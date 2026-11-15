import {test} from 'node:test';import assert from 'node:assert/strict';
import {combineRecipes} from '../src/recipe-total.js';
import {normalizeSettings,exportSettings,parseSettings} from '../src/settings.js';
const food={name:'Food',v:{energy:100,protein:10},s:{energy:'u',protein:'u'}};
const resolve=ref=>ref.id==='known'?food:null;
const recipe=(id,g,servings=1,ref={t:'c',id:'known',f:0})=>({id,name:`Meal ${id}`,servings,items:[{id:'ingredient',ref,g}]});
test('automatic total flattens any number of recipes without changing names, IDs or saved recipes',()=>{
 const recipes=[recipe('a',100,2),recipe('b',200),recipe('c',300)];const before=JSON.stringify(recipes);
 const x=combineRecipes(recipes,resolve);
 assert.equal(x.meals.length,3);assert.equal(x.result.v.energy,600);assert.equal(x.result.v.protein,60);assert.equal(x.result.n,3);
 assert.equal(new Set(x.recipe.items.map(it=>it.id)).size,3);
 assert.equal(JSON.stringify(recipes),before);
 const one=combineRecipes(recipes,resolve,'serving');assert.equal(one.result.v.energy,550);assert.equal(one.meals[0].result.v.energy,50);
});
test('empty and unresolved meals preserve missing coverage; same food in different meals is counted twice',()=>{
 const x=combineRecipes([recipe('a',100),recipe('b',100),recipe('c',100,1,{t:'u',id:'gone'}),{id:'empty',name:'Empty',items:[],servings:1}],resolve);
 assert.equal(x.result.v.energy,200);assert.equal(x.result.cov.energy,2);assert.equal(x.result.n,3);assert.equal(x.result.grams,300);
 assert.equal(x.meals[3].result.v.energy,undefined);assert.equal(x.recipe.items.length,3);
 assert.equal(x.result.aaGaps.some(g=>g.name.includes('Meal c')),true);
});
test('scope setting migrates safely, validates enum and survives settings backup',()=>{
 assert.equal(normalizeSettings({theme:'dark'}).recipeTotalBasis,'total');
 assert.equal(normalizeSettings({recipeTotalBasis:'bad'}).recipeTotalBasis,'total');
 assert.equal(parseSettings(exportSettings({recipeTotalBasis:'serving'})).recipeTotalBasis,'serving');
});
