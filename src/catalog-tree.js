// Presentation hierarchy only: food IDs, source categories, forms and saved references stay intact.
export const DRINK_GROUPS = [
 {id:'icecek_kahve',name:'Kahveler',icon:'☕'},
 {id:'icecek_cay',name:'Çaylar',icon:'🍵'},
 {id:'icecek_bitki',name:'Bitkisel çaylar',icon:'🌿'},
 {id:'icecek_sicak',name:'Diğer sıcak içecekler',icon:'☕'},
 {id:'icecek_soguk',name:'Soğuk içecekler',icon:'🥤'},
 {id:'icecek_meyvesuyu',name:'Meyve ve sebze suları',icon:'🧃'},
 {id:'icecek_bitkisel',name:'Bitkisel sütler ve içecekler',icon:'🥛'},
 {id:'icecek_sut',name:'Süt ve sütlü içecekler',icon:'🥛'},
 {id:'icecek_alkol',name:'Alkollü içecekler',icon:'🍷'},
];
const fruit = ['meyve','kurumeyve'], vegetables=['sebze','yaprak','kok'], legumes=['baklagil','soya'];
const CHILDREN = new Set(['kurumeyve','yaprak','kok','kahve','soya']);
const TEA = new Set(['siyah_cay','yesil_cay','oolong']);
const HERBAL = new Set(['papatya','hibiskus_cayi','bitki_cayi','adacayi_demleme','ihlamur_cayi','nane_cayi','rooibos_cayi']);
const PLANT_MILK = new Set(['soya_sutu','soya_sutu_z','badem_sutu','pirinc_sutu','yulaf_sutu','hindistancevizi_sutu','hindistancevizi_sutu_konserve','kaju_ayrani']);
const DAIRY_DRINK = new Set(['inek_sutu','inek_sutu_yarim','inek_sutu_yagsiz','inek_sutu_laktozsuz','keci_sutu','koyun_sutu','manda_sutu','kefir','ayran','ayran_yayik','ayran_yagsiz','peynir_alti']);
const JUICE = new Set(['elma_suyu','domates_suyu','havuc_suyu','uzum_suyu','mandalina_suyu','turna_yemisi_suyu','hindistancevizi_suyu']);
const ALCOHOL = new Set(['bira','kirmizi_sarap','beyaz_sarap']);
export function catalogGroup(food){
 if(food.cat==='kahve')return food.id.startsWith('buzlu_latte')?'icecek_soguk':'icecek_kahve';
 if(TEA.has(food.id))return 'icecek_cay';
 if(HERBAL.has(food.id))return 'icecek_bitki';
 if(PLANT_MILK.has(food.id))return 'icecek_bitkisel';
 if(DAIRY_DRINK.has(food.id))return 'icecek_sut';
 if(JUICE.has(food.id))return 'icecek_meyvesuyu';
 if(ALCOHOL.has(food.id))return 'icecek_alkol';
 if(food.id==='sicak_cikolata')return 'icecek_sicak';
 if(food.cat==='icecek')return food.id.endsWith('_sirkesi')?'diger':'icecek_soguk';
 return food.cat;
}
export function categoryContains(food,id){
 const group=catalogGroup(food);
 if(id==='meyve')return fruit.includes(group);
 if(id==='sebze')return vegetables.includes(group);
 if(id==='baklagil')return legumes.includes(group);
 if(id==='icecek')return DRINK_GROUPS.some(g=>g.id===group);
 if(id==='kahve')return food.cat==='kahve'; // Old internal category selections remain readable.
 return group===id;
}
export function rootCategories(categories){
 const roots=categories.filter(c=>!CHILDREN.has(c.id)).map(c=>c.id==='icecek'?{...c,name:'İçecekler',icon:'🥤'}:c);
 const trailing=['icecek','fastfood','atistirmalik'];
 return [...roots.filter(c=>!trailing.includes(c.id)),...trailing.map(id=>roots.find(c=>c.id===id)).filter(Boolean)];
}
export function catalogSections(foods,categories){
 const byId=new Map(categories.map(c=>[c.id,c]));
 const groups=rootCategories(categories).flatMap(c=>c.id==='meyve'?fruit.map(id=>byId.get(id)):c.id==='sebze'?vegetables.map(id=>byId.get(id)):c.id==='baklagil'?legumes.map(id=>byId.get(id)):c.id==='icecek'?DRINK_GROUPS:[c]);
 const buckets=new Map();for(const f of foods){const group=catalogGroup(f);if(!buckets.has(group))buckets.set(group,[]);buckets.get(group).push(f);}
 return groups.filter(g=>buckets.has(g.id)).map(g=>({...g,foods:buckets.get(g.id)}));
}
