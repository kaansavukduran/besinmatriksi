# Mimari

- Açılış ve gezinme [src/app.js](../src/app.js). Görünümler `src/views/`, davranışlar `src/actions/`, Türkçe ve İngilizce metinler [i18n](../src/i18n.js) ve [İngilizce arayüz sözlüğü](../src/i18n-ui.js). Yeni metni `L()` ile bağla. [Dil testi](../tests/i18n.test.mjs)
- [Depolama](../src/store.js) tarifleri, günlüğü ve tercihleri cihazda tutar. Yeni ayara `DEFAULT_SETTINGS` varsayılanı ekle ve eski kayıtla sınayarak kaydı koru. Uygulama çalışma anında CDN veya uzak veri servisi kullanmaz.
- [Aion](../src/aion.js) isteğe bağlı rehberdir. Görüntü ve animasyon üretimi [build-aion.py](../scripts/build-aion.py).
