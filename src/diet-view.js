import {L} from './i18n.js';
import {dietActive} from './diet.js';
export function renderDietFilter(s,prefix,open=false){
 const check=(s,k,text)=>`<label class="diet-check"><input type="checkbox" id="${prefix}-${k}" data-diet="${k}" ${s[k]?'checked':''}>${text}</label>`;

 const labels=[['omnivore',L('Hepçil · tümü')],['vegan',L('Vegan')],['vegetarian',L('Vejetaryen')],['pescatarian',L('Pesketaryen')]];
 const subtype=s.vegetarianEggs?(s.vegetarianDairy?L('Ovo-lakto vejetaryen'):L('Ovo-vejetaryen')):(s.vegetarianDairy?L('Lakto-vejetaryen'):L('Yumurta ve süt ürünü tüketmeyen vejetaryen'));
 return `<div class="diet-filter" data-diet-prefix="${prefix}">
 <label class="diet-select" for="${prefix}-diet-pattern"><span>${L('Beslenme')}</span><select id="${prefix}-diet-pattern" data-diet="dietPattern">${labels.map(([v,t])=>`<option value="${v}" ${s.dietPattern===v?'selected':''}>${t}</option>`).join('')}</select></label>
 ${s.dietPattern==='vegetarian'?`<fieldset class="diet-vegetarian"><legend>${L('Vejetaryen tercihlerim')}</legend><div class="diet-checks">${check(s,'vegetarianEggs',L('Yumurta tüketiyorum (ovo)'))}${check(s,'vegetarianDairy',L('Süt ürünleri tüketiyorum (lakto)'))}</div><p class="hint" role="status">${subtype}</p></fieldset>`:''}
 <details class="diet-extras" data-diet-details="${prefix}" ${open?'open':''}><summary>${L('Ek tercihler')}${Object.keys(s).some(k=>k.startsWith('diet')&&s[k]===true)?' · '+L('Filtre etkin'):''}</summary><div class="diet-checks">${check(s,'dietGlutenFree',L('Glutensiz'))}${check(s,'dietLactoseFree',L('Laktozsuz'))}${check(s,'dietSoyFree',L('Soya içermez'))}${check(s,'dietTreeNutFree',L('Sert kabuklu yemiş içermez'))}${check(s,'dietPeanutFree',L('Yer fıstığı içermez'))}${check(s,'dietSesameFree',L('Susam içermez'))}</div></details>
 ${dietActive(s)?`<p class="diet-note" role="status">${L('Yalnız içerik bilgisi seçimine uyan kayıtlar gösterilir; belirsiz içerikler gizlenir. Bu filtre ürün sertifikası değildir; alerjen ve çapraz bulaşma için etiketi kontrol et.')}</p><button class="linkish" data-action="diet-reset">${L('Beslenme filtrelerini temizle')}</button>`:''}
 </div>`;
}
