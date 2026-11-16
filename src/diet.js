// Filtering changes catalogue discovery, never stored recipes, diary entries or source values.
export const DIET_KEYS = ['dietPattern','vegetarianEggs','vegetarianDairy','dietGlutenFree','dietLactoseFree','dietSoyFree','dietTreeNutFree','dietPeanutFree','dietSesameFree'];
export const DIET_EXTRAS = {dietGlutenFree:'gluten',dietLactoseFree:'lactose',dietSoyFree:'soya',dietTreeNutFree:'sertkabuklu',dietPeanutFree:'yerfistigi',dietSesameFree:'susam'};
export const dietActive = s => s.dietPattern && s.dietPattern!=='omnivore'||Object.keys(DIET_EXTRAS).some(k=>s[k]===true);
export function matchesDiet(profile, s={}) {
 if(!dietActive(s))return true;
 if(!profile||profile.kind==='unknown')return false;
 const kind=profile.kind, pattern=s.dietPattern||'omnivore';
 if(pattern==='vegan'&&kind!=='plant')return false;
 if(pattern==='vegetarian'){
  if(!['plant','honey','dairy','egg','dairy-egg'].includes(kind))return false;
  if(s.vegetarianEggs===false&&['egg','dairy-egg'].includes(kind))return false;
  if(s.vegetarianDairy===false&&['dairy','dairy-egg'].includes(kind))return false;
 }
 if(pattern==='pescatarian'&&!['plant','honey','dairy','egg','dairy-egg','fish'].includes(kind))return false;
 return Object.entries(DIET_EXTRAS).every(([k,ingredient])=>!s[k]||profile.freeFrom?.includes(ingredient));
}
// Extended SR28 plant classification supports dietary patterns only. No allergen absence is inferred.
export const extendedDietProfile = f => ({kind:f.diet==='plant'&&!f.branded?'plant':'unknown',freeFrom:[]});
