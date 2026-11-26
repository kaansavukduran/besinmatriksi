# Güncel durum

25 Kasım 2026 · `kaansavukduran/besinmatriksi` · `main`.

- İncelenen revizyon `2ae5da80700a0f1fde0fd68230a994d1dc57553a`. Ürün kodunun son değişikliği `b368369d5e4f1dfc4080b2a21a5d2f8ca1e55eb8`.
- Son ürün değişikliği B269 ve `1.1.2-beta.76`. Gün kurusu kayısıya kaynaklı 28 değer eklendi. [Veri araştırması](../docs/DATA_RESEARCH.md#b269-gün-kurusu-kayısı-ölçümü) · [Sürüm notları](../docs/RELEASE_NOTES.md)
- Yayın kanıtı. İncelenen revizyonun [GitHub Pages çalışması](https://github.com/kaansavukduran/besinmatriksi/actions/runs/45495849609) başarılı. Lore düzenlemesi uygulama kodunu değiştirmez.
- Bir sonraki veri işi açıldığında [kataloğu](../data/catalog.mjs) ve [kaynak kayıtlarını](../docs/DATA_RESEARCH.md) karşılaştır. Yaygın kuru meyve ve içecekler için hazırlama biçimi, ölçüm birimi ve lisansı doğrula. Uygun kaynakla eklenen kayıtları `npm run data` ve `npm test` ile denetle.
- B270–B271 (26 Kasım, main): İngilizce sözlük yüklenemezse açılış, WebKit odak geri dönüşü (CI WebKit'te doğrulandı), paket bütçesi denetimi. Besin listesine content-visibility denendi, CI'da regresyon üretti, geri alındı. [Forge günlüğü](../project_state/FORGE_LOG.md)
- Güncel Forge aşaması, doğrulama ve kalan engeller için [durum kaydını](../project_state/CURRENT_STATE.json) esas al. [Forge geçmişi](../project_state/FORGE_LOG.md)
