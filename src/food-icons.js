// Her küratörlü besine kendi küçük simgesi (sistem emojisi; çevrimdışı, ek dosya/lisans yok).
// Tam karşılığı olmayan besinlerde en yakın görsel seçildi; listede olmayanlar kategori simgesine düşer.
// Unicode 15+ (ör. zencefil, bezelye kabuğu) bazı Windows/Android sürümlerinde görünmediği için kullanılmadı.
export const FOOD_ICONS = {
  // meyveler
  elma: '🍎', armut: '🍐', ayva: '🍐', muz: '🍌', kayisi: '🍑', seftali: '🍑', nektarin: '🍑', erik: '🟣', kiraz: '🍒', visne: '🍒',
  uzum: '🍇', cilek: '🍓', yabanmersini: '🫐', ahududu: '🍓', bogurtlen: '🫐', dut: '🫐', frenk_uzumu: '🫐', bektasi: '🟢', kizilcik: '🔴', murver: '🫐',
  portakal: '🍊', mandalina: '🍊', greyfurt: '🍊', limon: '🍋', misket_limonu: '🍋', kivi: '🥝', nar: '🔴', incir: '🟤', trabzon_hurmasi: '🟠',
  karpuz: '🍉', kavun: '🍈', kavun_balli: '🍈', ananas: '🍍', mango: '🥭', papaya: '🥭', guava: '🍈', avokado: '🥑', carkifelek: '🟣', lici: '🔴',
  jackfruit: '🍈', demirhindi: '🟤', plantain: '🍌', zeytin_siyah: '🫒', zeytin_yesil: '🫒',
  // kuru meyveler
  kuru_kayisi: '🍑', kuru_incir: '🟤', kuru_uzum: '🍇', hurma: '🌴', hurma_medjool: '🌴', kuru_erik: '🟣', goji: '🔴', kuru_muz: '🍌',
  // sebzeler
  domates: '🍅', domates_salcasi: '🥫', salatalik: '🥒', biber_yesil: '🫑', biber_kirmizi: '🫑', aci_biber: '🌶️', patlican: '🍆', kabak: '🥒',
  balkabagi: '🎃', brokoli: '🥦', karnabahar: '🥦', brokselahanasi: '🥬', lahana: '🥬', kirmizi_lahana: '🥬', lahana_tursusu: '🫙', salatalik_tursusu: '🥒',
  bamya: '🌶️', taze_fasulye: '🫘', bezelye: '🟢', taze_bakla: '🫘', edamame: '🫘', misir: '🌽', enginar: '🌿', kuskonmaz: '🌱', sogan: '🧅', sarimsak: '🧄',
  pirasa: '🧅', kereviz_sap: '🌿', rezene: '🌿', alabas: '🥬', 'kudret_narı': '🥒', fasulye_filizi: '🌱', yonca_filizi: '🌱', mercimek_filizi: '🌱',
  // yeşil yapraklılar
  ispanak: '🥬', karalahana: '🥬', collard: '🥬', pazi: '🥬', pancar_yapragi: '🥬', roka: '🌿', marul: '🥬', aysberg: '🥬', semizotu: '🌿', tere: '🌱',
  su_teresi: '🌿', hardal_yesili: '🥬', karahindiba: '🌼', asma_yapragi: '🍃', pak_choi: '🥬', moringa: '🍃', amarant_yapragi: '🍃',
  // kök ve yumrular
  patates: '🥔', tatli_patates: '🍠', havuc: '🥕', pancar: '🟣', turp: '🔴', bayir_turpu: '⚪', salgam: '🟣', kereviz_kok: '⚪', yaban_havucu: '🥕',
  yer_elmasi: '🥔', zencefil: '🟡', manyok: '🥔', taro: '🥔', yam: '🍠',
  // baklagiller
  kirmizi_mercimek: '🟠', yesil_mercimek: '🟤', nohut: '🟡', humus: '🥣', kuru_fasulye: '⚪', dermason: '⚪', barbunya: '🫘', kirmizi_fasulye: '🫘',
  siyah_fasulye: '⚫', pinto: '🫘', borulce: '⚪', kuru_bakla: '🫘', mas: '🟢', urad: '⚫', adzuki: '🔴', kuru_bezelye: '🟢', guvercin_bezelyesi: '🟡',
  aci_bakla: '🟡', yerfistigi: '🥜', fistik_ezmesi: '🥜',
  // soya
  soya_fasulyesi: '🫘', tofu_sert: '⬜', tofu_normal: '⬜', tofu_nigari: '⬜', tempeh: '🟫', natto: '🫘', miso: '🥣', soya_sosu: '🍶', soya_sutu: '🥛',
  soya_sutu_z: '🥛', soya_unu: '🌾', soya_izolat: '💪',
  // tahıllar
  yulaf: '🥣', yulaf_kepegi: '🥣', bulgur: '🌾', pirinc_beyaz: '🍚', pirinc_esmer: '🍚', yabani_pirinc: '🍚', kinoa: '🌾', karabugday: '🌾', amarant: '🌾',
  dari: '🌾', teff: '🌾', arpa: '🌾', arpa_inci: '🌾', cavdar: '🌾', kavilca: '🌾', bugday: '🌾', tam_bugday_unu: '🍞', beyaz_un: '🍞', irmik: '🌾',
  makarna: '🍝', kuskus: '🍚', misir_tane: '🌽', misir_unu: '🌽', sorgum: '🌾', bugday_ruseymi: '🌾', bugday_kepegi: '🌾', seitan: '🍖',
  // kuruyemişler
  badem: '🌰', findik: '🌰', ceviz: '🌰', antep_fistigi: '🟢', kaju: '🌰', brezilya_cevizi: '🌰', makadamya: '🌰', pekan: '🌰', cam_fistigi: '🌰',
  kestane: '🌰', hindistancevizi: '🥥', hindistancevizi_rende: '🥥',
  // tohumlar
  keten: '🟤', chia: '⚫', kenevir: '🌿', susam: '⚪', tahin: '🫙', kabak_cekirdegi: '🎃', aycekirdegi: '🌻', hashas: '⚫', hardal_tohumu: '🟡',
  // mantarlar
  kultur_mantari: '🍄', portobello_uv: '🍄', shiitake: '🍄', istiridye_mantari: '🍄', maitake: '🍄', enoki: '🍄', kuzugobegi: '🍄', kulak_mantari: '🍄',
  // algler
  spirulina: '🟢', kelp: '🌊', wakame: '🌊', nori: '🍙', agar: '🌊',
  // taze otlar
  maydanoz: '🌿', dereotu: '🌿', nane: '🌱', nane_pepermint: '🌱', feslegen: '🌿', kisnis: '🌿', kekik: '🌿',
  // baharatlar
  tarcin: '🟤', zerdecal: '🟡', kimyon: '🟤', karabiber: '⚫', pul_biber: '🌶️', aci_toz_biber: '🌶️', zencefil_toz: '🟡', karanfil: '🟤', kakule: '🟢',
  muskat: '🟤', kisnis_tohumu: '🟤', rezene_tohumu: '🟢', cemen: '🟡', anason: '⭐', kekik_kuru: '🌿', biberiye: '🌿', adacayi: '🌿', defne: '🍃',
  yenibahar: '🟤', safran: '🌺', sarimsak_tozu: '🧄', sogan_tozu: '🧅', kori: '🟡', karaman_kimyonu: '🟤', kereviz_tohumu: '🟤',
  // yağlar
  zeytinyagi: '🫒', aycicek_yagi: '🌻', aycicek_yagi_ho: '🌻', kanola: '🌼', misir_ozu_yagi: '🌽', soya_yagi: '🫘', susam_yagi: '🫙', keten_yagi: '🫙',
  ceviz_yagi: '🌰', findik_yagi: '🌰', avokado_yagi: '🥑', hindistancevizi_yagi: '🥥', palm_yagi: '🌴', aspir_yagi: '🌼', pirinc_kepegi_yagi: '🍚',
  hardal_yagi: '🟡', yerfistigi_yagi: '🥜',
  // içecekler
  badem_sutu: '🥛', pirinc_sutu: '🥛', hindistancevizi_sutu: '🥥', hindistancevizi_suyu: '🥥', kahve: '☕', espresso: '☕', siyah_cay: '🫖',
  yesil_cay: '🍵', papatya: '🌼', elma_suyu: '🧃', domates_suyu: '🍅', havuc_suyu: '🥕', elma_sirkesi: '🍎',
  // tatlandırıcılar
  kakao: '🍫', bitter: '🍫', keciboynuzu: '🟤', akcaagac: '🍁', melas: '🍯', seker: '🍬', esmer_seker: '🍬', jaggery: '🟫', bal: '🍯',
  // diğer
  besin_mayasi: '🍞', maya_ozu: '🫙', hardal: '🟡', balzamik: '🍷', tuz: '🧂',
  // hayvansal
  inek_sutu: '🥛', inek_sutu_yarim: '🥛', inek_sutu_yagsiz: '🥛', yogurt: '🥣', suzme_yogurt: '🥣', beyaz_peynir: '🧀', kasar: '🧀', mozzarella: '🧀',
  lor: '🧀', ricotta: '🧀', parmesan: '🧀', krem_peynir: '🧀', tereyagi: '🧈', krema: '🥛', yumurta: '🥚', yumurta_aki: '🍳', yumurta_sarisi: '🍳',
  dana_kiyma: '🥩', kuzu_but: '🍖', dana_ciger: '🥩', tavuk_gogus: '🍗', hindi: '🦃', somon: '🍣', alabalik: '🐟', hamsi: '🐟', uskumru: '🐟',
  levrek: '🐟', morina: '🐟', sardalya: '🐟', ton_baligi: '🐟', karides: '🦐', midye: '🦪',
  beyaz_ekmek: '🍞', tam_bugday_ekmegi: '🍞', cavdar_ekmegi: '🍞', pide_lavas: '🫓', pide_lavas_tam: '🫓', patlamis_misir: '🍿', su: '💧', uzum_suyu: '🍇',
  taze_sogan: '🧅', patates_kizartmasi: '🍟', tavuk_but: '🍗', dana_biftek: '🥩',
  sirken: '🌿', salgam_yapragi: '🥬', karpuz_cekirdegi: '🍉', altin_cilek: '🟠', arpacik_sogan: '🧅', kestane_mantari: '🍄', horoz_mantari: '🍄', irlanda_yosunu: '🌊', soya_filizi: '🌱', besin_mayasi_z: '🧀', psyllium: '🌾',
  hibiskus_cayi: '🌺', bitki_cayi: '🍵', oolong: '🍵', turk_kahvesi: '☕', latte_bitkisel: '☕', cappuccino_bitkisel: '☕', americano: '☕', siyez_bulguru: '🌾', siyah_pirinc: '🍚', siyah_mercimek: '⚫',
  lufer: '🐟', istavrit: '🐟', kefal: '🐟', kalkan: '🐟', dil_baligi: '🐟', kilic: '🐟', sazan: '🐟', mezgit: '🐟', orfoz: '🐟', yayin_baligi: '🐟', mersin_baligi: '🐟', yilan_baligi: '🐟', balik_yumurtasi: '🐟', kalamar: '🦑', ahtapot: '🐙', murekkep_baligi: '🦑', istiridye: '🦪', deniz_taragi: '🐚', yengec: '🦀', istakoz: '🦞', kerevit: '🦞', kusburnu: '🌹', isirgan: '🌿', frenk_uzumu_kirmizi: '🔴', uzum_sirkesi: '🍷', dereotu_tohumu: '🌿', gemlik_zeytini: '🫒', taflan: '🫐', seylan_tarcini: '🟤', uzum_pekmezi: '🍯', nar_eksisi: '🍷', sumak: '🟥', corek_otu: '⚫', isot: '🌶️',
  aslan_yelesi: '🍄', kral_istiridye: '🍄', kayin_mantari: '🍄', kavak_mantari: '🍄', kanlica: '🍄', yumurta_mantari: '🍄', reishi: '🍄',
  keci_sutu: '🐐', koyun_sutu: '🐑', kefir: '🥛', ayran_yayik: '🥛', keci_peyniri: '🧀', yogurt_yagsiz: '🥣', lor_cottage: '🧀', peynir_alti: '🥛', bildircin_yumurtasi: '🥚', ordek_yumurtasi: '🥚', kaz_yumurtasi: '🥚', kuzu_kiyma: '🥩', keci_eti: '🥩', dana_kiyma_genc: '🥩', kuzu_ciger: '🥩', kuzu_bobrek: '🥩', dana_yurek: '🥩', dana_dil: '🥩', iskembe: '🥩', dana_beyin: '🥩', kurutulmus_dana: '🥩', tavuk_kanat: '🍗', tavuk_kiyma: '🍗', tavuk_ciger: '🍗', tavuk_taslik: '🍗', ordek: '🦆', kaz: '🪿', bildircin: '🐦',
  whey_izolat: '💪', whey_tozu: '💪', yumurta_aki_tozu: '🥚', jelatin: '🦴', soya_protein_tozu: '🌱', bezelye_proteini: '🟢', pirinc_proteini: '🍚', kenevir_proteini: '🌿', kabak_cek_proteini: '🎃', karisik_bitkisel_protein: '🌱', kazein: '💪', sigir_proteini: '🥩', kolajen_peptit: '🦴', kreatin: '⚗️',
  ayran: '🥛', kaju_ayrani: '🥛',
  eksi_mayali_ekmek: "🥖", cok_tahilli_ekmek: "🍞", yulaf_ekmegi: "🍞", kepekli_ekmek: "🍞", pumpernickel: "🍞", italyan_ekmegi: "🥖", bagel: "🥯", naan: "🫓", chapati: "🫓", misir_tortilla: "🌮", un_tortilla: "🌯", grissini: "🥖", yufka: "🫓", galeta_unu: "🍞", tam_bugday_kraker: "🍘", kruvasan: "🥐", falafel: "🧆", tabule: "🥗", zeytinyagli_sarma: "🫔", etli_sarma: "🫔", cacik: "🥣", baklava: "🍯", ispanakli_borek: "🥧", kuzu_sis: "🍢", tavuk_sis: "🍢", tavuk_doner: "🥙",
  et_doner: '🥙',
};
