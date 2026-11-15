import {aggregate,scaleItem} from './calc.js';

// A computed view only: never insert this recipe into the saved recipe list.
export function combineRecipes(recipes, resolve, basis = 'total') {
  const items=[], scaled=[], meals=[];
  let cookedWeight=0;
  for(const recipe of recipes) {
    const factor=basis==='serving'?1/(recipe.servings>0?recipe.servings:1):1;
    const mealItems=recipe.items.map(it=>({...it,id:`${recipe.id}:${it.id}`,g:it.g*factor,mealName:recipe.name}));
    const parts=mealItems.map(it=>{
      const food=resolve(it.ref);
      return food?scaleItem({...food,name:`${recipe.name} · ${food.name}`},it.g):{v:{},s:{},grams:it.g,name:`${recipe.name} · ${JSON.stringify(it.ref)}`};
    });
    items.push(...mealItems);scaled.push(...parts);
    const result=aggregate(parts);
    meals.push({recipe,result,factor});
    cookedWeight+=(recipe.cookedWeight>0?recipe.cookedWeight*factor:result.grams);
  }
  return {meals,result:aggregate(scaled),recipe:{items,servings:1,cookedWeight:recipes.filter(r=>r.items.length).every(r=>r.cookedWeight>0)?cookedWeight:null}};
}
