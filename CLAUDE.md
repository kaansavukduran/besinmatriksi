# CLAUDE.md: Besin Matriksi

Çevrimdışı, fareyle/dokunarak kullanılan, disleksi dostu, özelleştirilebilir bitkisel (vegan) besin matriksi. Vite + düz JS; masaüstü Tauri, mobil Capacitor, PWA ve tek dosya HTML. Türkçe ana dil; yeni profil/günlük/görünüm ekranları merkezi TR/EN. Eski ekranların İngilizce çevirisi B051 kapsamında açıktır. Ayrıntılar `README.md`.

Önce `project_state/CURRENT_STATE.json` (imleç: `active_forge`, `next_recommended_forge`), sonra `docs/ROADMAP.md` okunur.

## Komutlar

```bash
npm ci && npm test                 # node --test tests/*.test.mjs
npm run build && npm run build:single
npm run data                        # veri yeniden üretimi (data/raw gerekir)
```

Windows/macOS/Android/iOS paketleri yalnızca `.github/workflows/release.yml` ile kendi sistemlerinde derlenir; burada derlenmiş gibi gösterme.

## Kurallar (bozma)

- Ölçülmemiş = "veri yok", asla 0. Tahmin değerleri "Tahmin" etiketi taşır; ısıyla değişen bileşenler tahmin edilmez. Var olan ≠ ölçülen ≠ emilen ≠ fayda.
- Katalog yalnızca bitkisel/mantar/alg; hayvansal ürün eklenmez.
- Hiçbir şey ağa gitmez; çalışma anında CDN yok.
- Ayar anahtarı eklemek `DEFAULT_SETTINGS`'e varsayılanla eklemek demektir; eski kayıtlı ayarlar bozulmadan açılmalı (test ister).
- Üçüncü taraf paket: lisans, bakım, platform değerlendirmesi kaydedilmeden eklenmez; `package-lock.json` commit'lenir.
- Her davranış değişikliği test ister.

## FORGE

`FORGE` = tek, sınırlı artış: durumu oku → `git status` ile karşılaştır → yarım Forge'u kapat ya da `next_recommended_forge`'u başlat → belirt → uygula → test → ilk hatayı düzelt → yeniden test → regresyon → durum dosyalarını güncelle → dur. Yarım kalan Forge kod var diye tamamlandı sayılmaz. Her Forge `project_state/FORGE_LOG.md`'ye bir kayıt düşer (tarih, kapsam, kanıt: çalıştırılan komut + sonuç) ve tam olarak bir sonraki Forge önerir. Kanıt merdiveni: PLANNED < IMPLEMENTED < UNIT_TESTED < BUILT < RUNTIME_TESTED < PACKAGED; NOT_RUN / BLOCKED_ENVIRONMENT ayrı yazılır.

Git: `reset --hard`, `clean -fd`, force-push yok. Kapılar temiz ağaçta çalışır.
