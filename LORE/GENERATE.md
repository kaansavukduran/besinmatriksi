# Lore ve devir

`AGENTS.md` ve `CLAUDE.md` kısa yönlendiriciler olarak kalır. Ayrıntıyı tek ilgili dosyada güncelle. Karar değiştiğinde tarih, gerekçe, değiştirilen seçenek ve kaynak commit’i [DECISIONS](DECISIONS.md) içine ekle.

Forge'da önce [STATUS](STATUS.md) ile Git'i eşleştir. Sıradaki sınanabilir artışı uygula, gerçek giriş yolunda doğrula ve bir sonraki işi not et. Ayrıntılı komut, sonuç ve kapsam [Forge günlüğü](../project_state/FORGE_LOG.md) ile [durum kaydı](../project_state/CURRENT_STATE.json) içinde tutulur. Kanıt sırası PLANNED → IMPLEMENTED → UNIT_TESTED → BUILT → RUNTIME_TESTED → PACKAGED. NOT_RUN ve BLOCKED_ENVIRONMENT ayrıdır. Sert sıfırlama, toplu temizleme ve force-push kullanma.
