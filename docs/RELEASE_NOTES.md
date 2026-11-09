# Besin Matriksi 1.1.2 Beta 1 / Release candidate

Henüz yayımlanmadı. Güncel talimat yalnız Actions release-candidate çıktısına izin verir.
Not published. Only a release candidate is prepared under the current artifact-only publication instruction.

- Windows x64: Setup.exe, MSI ve kurulumsuz EXE / installer and portable app.
- Linux x86_64: AppImage, DEB, RPM. AppImage için / for AppImage: `chmod +x BesinMatriksi-*-linux-x86_64.AppImage`.
- macOS universal (Intel + Apple Silicon): unsigned DMG; Developer ID/notarization pending.
- Android: signed APK; see ANDROID-SIGNING.txt. A debug signature is not a production signing continuity guarantee.
- iPhone: UNSIGNED-NOT-INSTALLABLE IPA is a development artifact, not an installation link. Apple account/signing and App Store/TestFlight distribution are pending.
- Her masaüstünde / any desktop browser: offline.html; PWA archive needs your HTTPS hosting.

Kurulum/installation: download the correct platform file, open the installer; see KURULUM.md.
SHA256SUMS.txt and BUILD_INFO.json record asset integrity and source SHA. Native device acceptance remains NOT_RUN.

## Yeni / New

- Kişisel profil: yaş/boy/kilo, isteğe bağlı yağ/su/kas/kemik ve Tanita notları. Mifflin 1990 veya ayrı etiketli cihaz tahmini × seçilen PAL; kapsam 19–78 yaş, gebelik/emzirme vb. özel durumlar dışarıda. / Personal profile with optional device figures; estimated energy, with explicit scope and source.
- Günlük: planlanan ve tüketilen kayıtlar ayrı; 1–1000 g; 206 bileşende miktar, kaynak kapsamı, referans ve fark. Eksik ölçüm sıfır değildir; polifenol/amino asit için tanımlanmamış hedef uydurulmaz. / Planned and consumed diary, coverage and reference differences without invented targets.
- TR/EN yeni ekranlar, %80–200 arayüz ölçeği, bağımsız yazı ayarı, kaydırmalı aralıklar, yedi renkli seçim ekranı ve isteğe bağlı sakin keşif ilerlemesi. / Bilingual new screens, UI scale, independent typography and optional gentle discovery progress.
- Yerel profil/günlük JSON yedeği, tekrar içe aktarmada kayıt çoğalmaması ve özel besin kimlik çakışması koruması. / Local JSON backup with duplicate and custom-food collision handling.

Eski ekranların İngilizce kapsamı, imzalı otomatik güncelleme/iki gerçek paketle yükseltme deneyi, Apple imzaları ve fiziksel cihaz kabulü tamamlanmadı. Android kalıcı üretim anahtarı doğrulanmadı. / Legacy translation, signed updater, Apple signing and native device acceptance remain open.
