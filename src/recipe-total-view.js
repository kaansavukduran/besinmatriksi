import {basicCard,renderMatrix} from './matrix.js';
import {renderRecipeSources} from './recipe-sources.js';
import {L} from './i18n.js';
import {esc,fmtAmount} from './util.js';

export function renderRecipeTotal(model, settings, ctx) {
  const columns=[['energy',L("Kalori"),'kcal'],['protein',L("Protein"),'g'],['carb_avail',L("Karbonhidrat"),'g'],['sugars',L("Şeker"),'g'],['fat',L("Yağ"),'g'],['sfa',L("Doymuş yağ"),'g'],['fiber',L("Lif"),'g'],['salt',L("Tuz"),'g']];
  if(settings.energyUnit==='kj')columns[0]=['energy_kj',L("Kalori"),'kJ'];
  const value=(r,key,unit)=>{
    const x=r.v[key];if(x==null)return L("veri yok");
    const a=fmtAmount(x,unit,settings.precision);
    return `${r.cov[key]<r.n?'≥ ':''}${a.n} ${esc(a.u)}`;
  };
  const title=L("Günlük Toplam Tarif");
  const recipe={...model.recipe,name:title};
  const basisLabel=settings.recipeTotalBasis==='serving'?L("Her tariften 1 porsiyon"):L("Tariflerin tamamı");
  return `<header class="daily-recipe-header"><h1>${title}</h1><div class="presets"><button class="btn" data-action="csv">${L("CSV indir")}</button><button class="btn" data-action="print">${L("Yazdır")}</button></div></header>
    <p class="hint">${L("Listedeki tüm tariflerden otomatik hesaplanır. Tarif adları ve malzemeleri kendi tariflerinde düzenlenir.")}</p>
    <div class="presets" role="group" aria-label="${L("Toplama dahil edilen miktar")}">${[['total',L("Tariflerin tamamı")],['serving',L("Her tariften 1 porsiyon")]].map(([id,label])=>`<button class="pchip ${settings.recipeTotalBasis===id?'on':''}" aria-pressed="${settings.recipeTotalBasis===id}" data-action="daily-recipe-basis" data-b="${id}">${label}</button>`).join('')}</div>
    <p class="hint">${L("Bu özet günlüğüne tüketim kaydı eklemez. ≥: bazı malzemelerde ölçüm eksik.")}</p>
    <div class="meal-overview" role="region" tabindex="0" aria-label="${L("Öğünlerin besin değerleri")}"><table class="meal-table"><caption>${basisLabel}</caption><thead><tr><th scope="col">${L("Tarif")}</th>${columns.map(([,label,unit])=>`<th scope="col">${label}<small>${unit}</small></th>`).join('')}</tr></thead><tbody>${model.meals.map(({recipe,result})=>`<tr data-meal-id="${esc(recipe.id)}"><th scope="row"><button class="linkish" data-action="rc-open" data-id="${esc(recipe.id)}">${esc(recipe.name)}</button>${recipe.items.length?'':`<small>${L("Henüz malzeme yok")}</small>`}</th>${columns.map(([key,,unit])=>`<td data-meal-nutrient="${key}">${value(result,key,unit)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div id="recipe-summary">${basicCard(model.result,settings,title,{persona:ctx.persona,pie:true})}</div>
    ${ctx.gaps}
    <div id="matrix" class="matrix">${renderMatrix(model.result,settings,{recipe,basisLabel,closed:ctx.closed,aminoProfile:ctx.aminoProfile})}</div>
    <div id="recipe-sources">${renderRecipeSources(recipe,ctx.resolve,{key:ctx.sourceKey,open:ctx.sourceOpen,basisLabel,precision:settings.precision})}</div>`;
}
