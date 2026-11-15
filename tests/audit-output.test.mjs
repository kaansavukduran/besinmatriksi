import {test} from 'node:test';import assert from 'node:assert/strict';
import {matrixCSV} from '../src/export.js';import {aggregate,scaleItem,AA_REF} from '../src/calc.js';import {setLanguage} from '../src/i18n.js';
const v={protein:10,...Object.fromEntries(AA_REF.flatMap(([, ,keys,ref])=>keys.map(k=>[k,ref*10/keys.length])))};
for(const language of ['tr','en'])test(`B149 CSV preserves partial/unknown amino status ${language}`,()=>{
 setLanguage(language);
 const known=scaleItem({v,s:{}},100),label=scaleItem({v:{protein:10},s:{}},100);
 const partial=matrixCSV(aggregate([known,label]),'Partial');
 assert.match(partial,language==='tr'?/Amino asit skoru \(alt sınır, kısmi ölçüm\);50;%/:/Amino acid score \(lower bound, partial measurements\);50;%/);
 assert.doesNotMatch(partial,/null|undefined/);
 const missing=matrixCSV(aggregate([known,{v:{},s:{},grams:100}]),'Missing protein');
 assert.match(missing,language==='tr'?/Amino asit skoru hesaplanamıyor;veri yok/:/Amino acid score cannot be calculated;no data/);
 const exact=matrixCSV(known,'Complete');assert.match(exact,/100;%/);
 setLanguage('tr');
});
