import {test} from 'node:test';import assert from 'node:assert/strict';import {saveImportState} from '../src/store.js';
const next={recipes:[{id:'new'}],custom:[],profiles:[],collections:[]};
test('failed multi-group import restores previous strings and missing keys',()=>{
 const map=new Map([['bm.recipes.v1','old recipes']]);const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(k==='bm.profiles.v1')throw Error('full');map.set(k,v);},removeItem:k=>map.delete(k)};
 assert.deepEqual(saveImportState(next,storage),{ok:false,rollbackFailed:false});assert.deepEqual([...map],[['bm.recipes.v1','old recipes']]);
});
test('rollback failure is reported honestly instead of claiming unchanged storage',()=>{
 const storage={getItem:()=>null,setItem:(k)=>{if(k==='bm.profiles.v1')throw Error('full');},removeItem:()=>{throw Error('blocked');}};
 assert.deepEqual(saveImportState(next,storage),{ok:false,rollbackFailed:true});
});
test('successful import commits all groups and normalized optional settings',()=>{
 const map=new Map();const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
 assert.equal(saveImportState({...next,settings:{theme:'dark',recipeTotalBasis:'serving'}},storage).ok,true);
 assert.equal(map.size,5);assert.equal(JSON.parse(map.get('bm.settings.v2')).settings.recipeTotalBasis,'serving');
});
