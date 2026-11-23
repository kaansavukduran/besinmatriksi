// Ingredient classifications for the curated reference foods, not product/allergy certificates.
// Unknown mixed foods remain unknown. An empty allergen list alone NEVER proves absence.
const EXTRAS = ['gluten', 'lactose', 'soya', 'sertkabuklu', 'yerfistigi', 'susam'];
const SIMPLE_PLANT = new Set(['meyve','kurumeyve','sebze','yaprak','kok','baklagil','kuruyemis','tohum','mantar','alg','taze_ot','baharat']);
const SIMPLE_GRAINS_EXCEPT = new Set(['granola']);
const PLAIN_DRINKS = new Set(['adacayi_demleme','ihlamur_cayi','nane_cayi','rooibos_cayi','siyah_cay','yesil_cay','papatya','hibiskus_cayi','bitki_cayi','oolong','su','soda','elma_suyu','domates_suyu','havuc_suyu','uzum_suyu','mandalina_suyu','turna_yemisi_suyu','hindistancevizi_suyu','elma_sirkesi','beyaz_sirke','uzum_sirkesi','balzamik']);
const PLAIN_COFFEE = new Set(['kahve','espresso','turk_kahvesi','americano','hazir_kahve','kahve_kafeinsiz','espresso_kafeinsiz','ristretto','lungo','turk_kahvesi_sade']);
const PLANT_MILKS = new Set(['badem_sutu','soya_sutu','soya_sutu_z','pirinc_sutu','yulaf_sutu','hindistancevizi_sutu','hindistancevizi_sutu_konserve','latte_bitkisel','cappuccino_bitkisel']);
const PLAIN_DAIRY = new Set(['inek_sutu','inek_sutu_yarim','inek_sutu_yagsiz','keci_sutu','koyun_sutu','manda_sutu','yogurt','yogurt_yagsiz','suzme_yogurt','suzme_yogurt_yagsiz','kefir','ayran','ayran_yayik','ayran_yagsiz','sut_tozu','kondanse_sut','tereyagi','krema','eksi_krema','sade_yag']);
const SOY_EXCEPT = new Set(['sebze_burger']);
const SINGLE_SWEETENERS = new Set(['kakao','keciboynuzu','akcaagac','melas','seker','esmer_seker','jaggery','uzum_pekmezi','agave']);
// B211: USDA FNDDS tarifleri; girdi listesi (inputFoods) tek tek incelendi (2026-11-19), hepsi bitkisel.
// Restoran/hazır bileşenli olanlar burada yok (bilinmiyor kalır). Alerjen yokluğu iddia edilmez (freeFrom boş).
const FNDDS_PLANT = new Set(['sambar','dosa','masala_dosa','idli','pakora','bezelye_corbasi','yuca_kizartmasi','grits','guacamole','ratatouille','gazpacho','congee','vejetaryen_chili','pho_etsiz','ramen_vejetaryen','minestrone','borscht']);
export function curatedDietProfile(food, ctx = {}) {
 const allergens = new Set(food.allergens || []);
 if(food.cat==='soya'||food.id==='soya_filizi')allergens.add('soya');
 if(food.id==='siyez_bulguru')allergens.add('gluten');
 const simple = kind => ({kind,freeFrom:EXTRAS.filter(k=>k!=='lactose'?!allergens.has(k):kind!=='dairy')});
 if(food.id==='bal')return {kind:'honey',freeFrom:EXTRAS};
 if(PLAIN_COFFEE.has(food.id))return simple('plant');
 if(food.plantCoffee || PLANT_MILKS.has(food.id))return {kind:'plant',freeFrom:['lactose']};
 if(food.cat==='balik')return {kind:'fish',freeFrom:[]};
 if(['et','kumes'].includes(food.cat))return {kind:'meat',freeFrom:[]};
 if(food.id==='inek_sutu_laktozsuz')return {kind:'dairy',freeFrom:['lactose']};
 if(PLAIN_DAIRY.has(food.id))return {kind:'dairy',freeFrom:[]};
 if(food.cat==='yumurta')return {kind:food.id==='cirpilmis_yumurta'?'dairy-egg':'egg',freeFrom:[]};
 if(food.animal){
  if(food.cat==='kahve'&&food.recipe&&food.recipe.every(([n])=>['14210','01211','14411','19165','19335'].includes(n)))return {kind:'dairy',freeFrom:[]};
  return {kind:'unknown',freeFrom:[]};
 }
 if(FNDDS_PLANT.has(food.id))return {kind:'plant',freeFrom:[]};
 // Ev tarifi hesabı: tüm malzemeler bitkisel USDA kayıtlarıysa (derlemede SR28 grubundan doğrulanır) bitkiseldir
 if(food.recipe&&ctx.recipePlant)return simple('plant');
 if(SIMPLE_PLANT.has(food.cat)||food.cat==='tahil'&&!SIMPLE_GRAINS_EXCEPT.has(food.id)||PLAIN_DRINKS.has(food.id)||SINGLE_SWEETENERS.has(food.id)||food.cat==='yag'&&food.id!=='margarin'||food.id==='tuz')return simple('plant');
 if(food.cat==='soya'&&!SOY_EXCEPT.has(food.id))return {kind:'plant',freeFrom:['lactose']};
 return {kind:'unknown',freeFrom:[]};
}
