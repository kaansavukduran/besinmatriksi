import { norm } from './util.js';
export const SEARCH_ALIASES = {
  gun_kurusu_kayisi: ["gün kurusu", "günkurusu", "gunkurusu", "gunkursu", "kükürtsüz kuru kayısı", "kayısı kurusu", "unsulfured apricot"],
  kuru_dut: ["dut kurusu", "beyaz kuru dut"],
  kuru_cilek: ["çilek kurusu", "kurutulmuş çilek"],
  kuru_ananas: ["ananas kurusu", "kurutulmuş ananas"],
  kuru_kivi: ["kivi kurusu", "kurutulmuş kivi"],
  kuru_mango: ["mango kurusu", "kurutulmuş mango"],
  kuru_armut: ["armut kurusu", "kurutulmuş armut", "sulfured dried pears"],
  kuru_trabzon_hurmasi: ["hurma kurusu", "cennet hurması kurusu", "kurutulmuş Trabzon hurması"],
  kuru_turna_yemisi: ["kuru cranberry", "cranberry kurusu", "kurutulmuş turna yemişi"],
  kuru_yaban_mersini: ["yaban mersini kurusu", "kurutulmuş yaban mersini", "kuru blueberry"],
  kuru_hunnap: ["hünnap kurusu", "kurutulmuş hünnap", "çin hurması kurusu"],
  kuru_lici: ["liçi kurusu", "kurutulmuş liçi", "dried litchis"],
  kuru_longan: ["longan kurusu", "kurutulmuş longan"],
  muz_cipsi: ["banana chips", "kızarmış muz cipsi"],

  kuru_kayisi: ['kayısı kurusu', 'kükürtlü kuru kayısı', 'dried apricots', 'sulphured', 'sulfured'],
  // B210 dünya mutfağı: yaygın yazımlar
  karabugday: ['greçka', 'kaşa', 'kasha', 'grechka'], ajvar: ['ayvar'], sopska: ['shopska', 'çoban salatası balkan'], plov: ['palov', 'osh', 'özbek pilavı'],
  chana_masala: ['chole', 'nohut körisi'], aloo_gobi: ['alu gobi'], rajma: ['fasulye körisi'], misir_wot: ['wot', 'etiyopya mercimek'], ful_medames: ['foul', 'ful'], fattus: ['fattoush', 'fettuş'], pico_de_gallo: ['salsa', 'salsa fresca'],
  makarna_domates_soslu: ['spagetti', 'spaghetti', 'pasta'], lazanya_sebzeli: ['lasagna', 'lazanya'], fistik_ezmeli_sandvic: ['pb&j', 'peanut butter'], tofu_sebze_sote: ['stir fry', 'wok'],
  kimbap: ['gimbap'], zaru_soba: ['soba', 'karabuğday eriştesi'], ginisang_monggo: ['monggo', 'mung bean stew'], arroz_rojo: ['mexican rice', 'meksika pilavı', 'arroz mexicano'], frijoles_de_la_olla: ['frijoles', 'pot beans', 'meksika fasulyesi'], kabak_tatlisi: ['bal kabağı tatlısı', 'pumpkin dessert'], kayisi_hosafi: ['hoşaf', 'kayısı komposto', 'komposto'], sebzeli_kizarmis_pilav: ['fried rice', 'chahan', 'kızarmış pilav'], tay_sebze_korisi: ['thai curry', 'tay körisi', 'green curry', 'red curry'], rice_and_peas: ['jamaican rice', 'jamaika pilavı'], pkhali: ['phali', 'mkhali'], ajapsandali: ['ajapsandal', 'acapsandal'], adas_polo: ['adas polow', 'mercimekli pilav iran'], jollof_pilavi: ['jollof', 'jollof rice'], red_red: ['redred', 'gana börülce'], mafe: ['maafe', 'groundnut stew', 'domoda'], gado_gado: ['gadogado', 'gado gado'], kinoa_salatasi: ['quinoa salad', 'kinoa salata'], kuskus_sebzeli: ['couscous', 'kuskus yemeği'], djuvec: ['đuveč', 'duvec', 'güveç sebzeli'], uc_kiz_kardes: ['three sisters', 'üç kız kardeş'], yaban_pirinci_pilavi: ['wild rice', 'manoomin', 'yabani pirinç'], balkabagi_corbasi: ['bal kabağı çorbası', 'pumpkin soup'], zeytinyagli_taze_bakla: ['taze bakla yemeği', 'zeytinyağlı bakla'], achichuk: ['açiçuk', 'achchiq-chuchuk', 'shakarob'], koshari: ['kushari', 'koşari', 'kosheri'], kapuska: ['lahana yemeği'], lecso: ['leço', 'letscho'], nohutlu_pilav: ['nohut pilavı'], karnabahar_yemegi: ['karnıbahar yemeği'], baingan_bharta: ['bharta', 'baigan bharta'], acili_ezme: ['ezme', 'acılı ezme'], mucedra: ['mujaddara', 'mudjadara', 'mücedderə'], kicri: ['khichdi', 'kitchari', 'khichri'], gallo_pinto: ['gallopinto', 'rice and beans'], lobio: ['lobiyo'], zeytinyagli_barbunya: ['barbunya pilaki', 'barbunya yemeği'], zaalouk: ['zalouk', 'fas patlıcan'], gavurdagi: ['gavurdağı'], pasta_e_fagioli: ['pasta fagioli'],
  maya_ozu: ['vegemite', 'marmite', 'maya ekstresi'], grits: ['mısır lapası'], latke: ['patates mücveri', 'draniki'],
  susi_somonlu: ['sushi', 'salmon roll', 'maki'], susi_california: ['sushi', 'california roll', 'maki'], borscht: ['borş', 'barszcz', 'borsch'],
  pierogi: ['pirogi', 'varenik', 'vareniki'], fasulye_ezmesi_meksika: ['frijoles refritos', 'meksika fasulyesi ezmesi'], congee: ['jook', 'pirinç lapası'],
  gnocchi: ['nyoki'], mercimek_korisi: ['dal', 'dhal', 'daal'], lahana_sarmasi_etli: ['golubtsy', 'kapuska sarma'], injera: ['enjera'], pad_thai: ['padthai', 'tay eriştesi'],
  sebze_tempura: ['tenpura'], pho_etsiz: ['fo çorbası', 'pho'], ramen_vejetaryen: ['ramen'], guacamole: ['avokado ezmesi', 'guakamole'],
  salatalik: ['hıyar'], yabanmersini: ['yabanmersini', 'blueberry'],
  ahududu: ['frambuaz'], brokoli: ['brokkoli'],
  keten: ['flaxseed'], kirmizi_fasulye: ['meksika fasulyesi'],
  soya_sutu: ['soya içeceği'], soya_sutu_z: ['soya içeceği'],
  badem_sutu: ['badem içeceği'], pirinc_sutu: ['pirinç içeceği'],
  aci_bakla: ['tirmis'], taro: ['kolokas'], yerfistigi: ['araşit'],
  kahve: ['filtre kahve', 'filter coffee'], espresso: ['doppio', 'double espresso', 'kahve'],
  americano: ['kahve'], turk_kahvesi: ['kahve'], turk_kahvesi_sade: ['kahve'],
  latte_sutlu: ['kahve', 'latte'], cappuccino_sutlu: ['kahve', 'kapuçino'],
  latte_bitkisel: ['kahve'], cappuccino_bitkisel: ['kahve', 'kapuçino'],
  flat_white: ['kahve'], cortado: ['kahve'], espresso_macchiato: ['kahve', 'makyato'],
  mocha: ['kahve', 'moka'], buzlu_latte: ['kahve', 'iced latte'],
  ristretto: ['kahve'], lungo: ['kahve'], hazir_kahve: ['neskafe', 'nescafe', 'granül kahve'],
  dondurulmus_pizza_peynirli: ['donmuş pizza', 'dondurulmus pizza', 'frozen pizza'],
  dondurulmus_pizza_pepperoni: ['donmuş pizza', 'dondurulmus pizza', 'frozen pizza'],
  patates_cipsi: ['cips', 'chips', 'crisps'], tortilla_cipsi: ['cips', 'mısır cipsi'],
  nacho_cipsi: ['cips', 'peynirli cips'], sert_seker: ['şekerleme', 'bonbon'],
  damla_cikolatali_kurabiye: ['cookie', 'çikolatalı bisküvi'],
};
export function searchKey(food) {
  return norm(`${food.tr} ${food.en} ${food.sci || ''} ${(SEARCH_ALIASES[food.id] || []).join(' ')}`);
}
export function recentSearches(list, query = '') {
  const clean = (Array.isArray(list) ? list : []).filter(x => typeof x === 'string').map(x => x.trim().slice(0, 80)).filter(x => norm(x));
  const q = String(query).trim().slice(0, 80);
  const all = norm(q) ? [q, ...clean] : clean;
  const seen = new Set();
  return all.filter(x => { const k = norm(x); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 8);
}
