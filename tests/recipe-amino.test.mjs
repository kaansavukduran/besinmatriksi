import {test} from 'node:test';
import assert from 'node:assert/strict';
import {AA_REF, aggregate, scaleItem, scaleAggregate, assessAmino} from '../src/calc.js';
const food=(name, low)=>({name,s:{},v:{protein:10,...Object.fromEntries(AA_REF.flatMap(([id,,keys,ref])=>keys.map(k=>[k,ref*10*(id===low?.5:2)/keys.length])))}});
test('recipe score uses weighted total amino acids/protein, including complementary ingredients',()=>{
 const a=scaleItem(food('A','lys'),100),b=scaleItem(food('B','his'),100);
 assert.equal(assessAmino(a).raw,50);
 assert.deepEqual(assessAmino(aggregate([a])).rows,assessAmino(a).rows);
 const combined=aggregate([a,b]),p=assessAmino(combined);
 assert.equal(p.raw,125); assert.equal(p.complete,true);
 assert.equal(assessAmino(scaleAggregate(combined,.5)).raw,p.raw);
 assert.equal(assessAmino(scaleAggregate(combined,.37)).raw,p.raw);
 assert.deepEqual(assessAmino(aggregate([b,a])).rows,p.rows);
});
test('partial amino measurements retain all nine bars and lower bounds, with TOTAL protein denominator',()=>{
 const a=scaleItem(food('A','lys'),100),label=scaleItem({name:'Label',s:{},v:{protein:10}},100);
 const p=assessAmino(aggregate([a,label]));
 assert.equal(p.rows.length,9); assert.equal(p.raw,25);assert.equal(p.limiting,null);
 assert.equal(p.complete,false);assert.equal(p.basis,20);
 assert.equal(p.rows.find(x=>x.id==='lys').ratio,.25);
 assert.deepEqual(p.gaps.map(g=>g.name),['Label']);
 assert.equal(p.gaps[0].keys.includes('protein'),false);
});
test('missing protein, absent amino group and zero protein never produce a false exact score',()=>{
 const a=scaleItem(food('A','lys'),100),unknown={name:'Missing',v:{},s:{},grams:100};
 const p=assessAmino(aggregate([a,unknown]));assert.equal(p.raw,null);assert.equal(p.rows.every(x=>x.ratio===null),true);
 assert.equal(p.rows.find(x=>x.id==='lys').amount,225);
 const partial=food('A','lys'); delete partial.v.his;
 const q=assessAmino(scaleItem(partial,100));assert.equal(q.raw,null);assert.equal(q.rows.find(x=>x.id==='his').ratio,null);
 const zero=assessAmino(scaleItem({v:{protein:0,his:0},s:{}},100));assert.equal(zero.raw,null);assert.equal(zero.basis,0);
});
