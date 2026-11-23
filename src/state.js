// B215: Uygulamanın paylaşılan durumu (tek nesne) ve açılıştaki yükleme sırası. app.js ve görünüm modülleri buradan içe aktarır.
// Yükleme sırası app.js'teki eski sırayla aynıdır: ayarlar → kişisel → kendi besinler → ayar göçleri → dil → ilk tarif.
import { loadSearches, loadProfiles, loadCollections, loadRecent, loadSettings, loadRecipes, loadCustom, saveSettings, newRecipe } from './store.js';
import { loadPersonal, localDay } from './personal.js';
import { FOODS, setCustomFoods } from './data.js';
import { MATRIX_SECTIONS, migrateAionOff, migrateFontV2 } from './settings.js';
import { setLanguage, preferredLanguage, L } from './i18n.js';

export const S = {
  tab: 'kesfet',
  searches: loadSearches(),
  profiles: loadProfiles(),
  collections: loadCollections(), colPicker: false, sort: 'default', multi: false, picked: [], ingOpen: new Set(), settingsQ: '', rcQ: '', rcSort: 'manual', recent: loadRecent((r) => !!FOODS.find((f) => f.id === r.id)?.forms[r.f]),
  dietOpen: { ex: false, pk: false },
  browseFilters: { ex: false },
  uxDetails: {},
  cat: null,
  extGroup: null,
  extPage: 0,
  extError: false,
  q: '',
  sel: null, // ref
  amount: 100,
  closed: new Set(['micro', ...MATRIX_SECTIONS.map(section => section.id).filter(id => id !== 'protein')]),
  settings: loadSettings(),
  recipes: loadRecipes(),
  activeRecipe: null,
  recipeDaily: false,
  basis: 'total',
  recipeSource: 'energy',
  recipeSourcesOpen: false,
  compare: [],
  // B179: telefonda Kıyasla temel değerlerle açılır ("Tümü" ~8900 px tablo); masaüstünde geniş tablo sığar, tümü açık
  cmpSection: typeof innerWidth === 'number' && innerWidth <= 600 ? 'temel' : 'all',
  picker: null, // { target, cat, q, sel, amount }
  customEdit: null, // { id?, name, liquid, portion, v: {} }
  themeEditor: null,
  efsaTableOpen: false,
  personal: null, personalDraft: null, personalReadError: false, personalDay: localDay(), personalDayAuto: true, consumedOnly: false, personalSource: 'energy', personalSourceOpen: false, personalUndo: null,
};
const personalLoaded = loadPersonal();
S.personal = personalLoaded.state; S.personalDraft = structuredClone(S.personal.profile); S.personalReadError = personalLoaded.error;
setCustomFoods(loadCustom());
{ const m = migrateAionOff(migrateFontV2(S.settings)); if (m !== S.settings) { S.settings = m; saveSettings(S.settings); } }
S.amount = S.settings.defaultAmount;
setLanguage(preferredLanguage(S.settings.language)); // varsayılan metinler doğru dilde oluşsun
if (!S.recipes.length) S.recipes = [newRecipe(L("İlk tarifim"))];
S.activeRecipe = S.recipes[0].id;
