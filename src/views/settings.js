import { plateIllustration } from '../kitchen-art.js';
// B225: Ayarlar ve Bilgi sekmeleri app.js'ten ayrıldı; davranış aynı
import { S } from '../state.js';
import { esc, fmtNum } from '../util.js';
import { L, t as tr } from '../i18n.js';
import { withSettingsToc } from '../settings-toc.js';
import { renderAppearance, settingSlider } from '../appearance.js';
import { THEMES, ACCENTS } from '../store.js';
import { FONTS, fontStack } from '../fonts.js';
import { SHORTCUT_ACTIONS, MATRIX_SECTIONS } from '../settings.js';
import { META } from '../data.js';
import { NUTRIENTS, NUTRIENT_BY_KEY, SOURCES } from '../nutrients.js';
import { nutrientLabel } from '../i18n-nutrients.js';
import { renderEfsaSettings } from '../efsa-ui.js';
import { COLOR_LABELS, themeTextContrast, contrastRatio } from '../theme.js';
import { themePreview } from '../theme-editor.js';
import NOTICES from '../data/notices.json';

export const RELEASES_URL = 'https://github.com/kaansavukduran/besinmatriksi/releases';
export function renderSettings() {
  const s = S.settings;
  const opt = (k, v, label) => `<button class="pchip ${s[k] === v ? 'on' : ''}" data-action="set" data-k="${k}" data-v="${esc(JSON.stringify(v))}">${label}</button>`;
  const tog = (k, label, help = '') => `<label class="toggle"><input type="checkbox" data-setbool="${k}" ${s[k] ? 'checked' : ''}><span class="sw"></span><span>${label}${help ? ` <span class="help" title="${esc(help)}">?</span>` : ''}</span></label>`;
  const step = (k, label, min, max, st, unit) => settingSlider(k, s[k], min, max, st, unit);
  return withSettingsToc(`<div class="settings">
    <div class="settings-search"><label class="field"><span>🔎 ${L("Ayarlarda ara")}</span><input id="settings-q" type="search" value="${esc(S.settingsQ)}" placeholder="${L("ör. yazı, tema, Aion, yedek")}" autocomplete="off"></label>
      <p class="hint" id="settings-none" role="status" hidden>${L("Bu aramaya uyan ayar yok.")}</p></div>
    <section class="card lang-card" aria-label="${tr('language')}"><h2>🌐 ${tr('language')}</h2>
      <div class="presets lang-pick" role="group" aria-label="${tr('language')}">${[['tr', '🇹🇷 Türkçe'], ['en', '🇬🇧 English'], ['auto', L("Cihaz dili")]].map(([v, name]) => `<button class="pchip ${s.language === v ? 'on' : ''}" aria-pressed="${s.language === v}" data-action="set" data-k="language" data-v='"${v}"' lang="${v === 'auto' ? '' : v}">${name}</button>`).join('')}</div>
      <p class="hint">${L("Şimdilik Türkçe ve İngilizce. Besin adları, matriks, tarif ve dışa aktarma seçilen dile geçer.")}</p></section>
    ${renderAppearance(s)}
    <section class="card aion-settings"><h2>${tr('aionTitle')}</h2>
      <p class="hint">${tr('aionHint')}</p>
      ${tog('aionEnabled', tr('aionShow'))}
      ${s.aionEnabled ? `<div class="kv"><span>${tr('aionMotionLabel')}</span><span class="presets">${opt('aionMotion', 'auto', tr('aionMotionAuto'))}${opt('aionMotion', 'animate', tr('aionMotionAnimate'))}${opt('aionMotion', 'still', tr('aionMotionStill'))}</span></div>
      <div class="kv"><span>${tr('aionSizeLabel')}</span><span class="presets">${opt('aionSize', 's', tr('sizeS'))}${opt('aionSize', 'm', tr('sizeM'))}${opt('aionSize', 'l', tr('sizeL'))}</span></div>
      <div class="kv"><span>${tr('aionSideLabel')}</span><span class="presets">${opt('aionSide', 'left', tr('sideLeft'))}${opt('aionSide', 'right', tr('sideRight'))}</span></div>
      ${tog('aionTips', tr('aionTipsLabel'))}
      <div class="presets"><button class="btn" data-action="aion-demo" data-anim="celebrate">${tr('aionTry')}</button><button class="btn ghost" data-action="reset-group" data-group="aion">${tr('aionReset')}</button></div>` : ''}
    </section>
    <section class="card"><h2>${tr('quickPresets')}</h2><div class="presets">
      <button class="btn" data-action="preset" data-p="dyslexia">${tr('dyslexiaPreset')}</button>
      <button class="btn" data-action="preset" data-p="lowvision">${tr('lowVisionPreset')}</button>
      <button class="btn" data-action="preset" data-p="calm">${tr('calmPreset')}</button>
      <button class="btn" data-action="preset" data-p="cute">${tr('pastelPreset')}</button>
      <button class="btn ghost" data-action="preset" data-p="reset">${L("Varsayılana dön")}</button></div></section>

    <section class="card"><h2>${tr('themes')}</h2><button class="btn ghost" data-action="reset-group" data-group="appearance">${tr('resetTheme')}</button><div class="themes">${THEMES.map((t) => `<button class="theme ${s.theme === t.id ? 'on' : ''}" data-action="set" data-k="theme" data-v='"${t.id}"' style="--tbg:${t.bg};--tfg:${t.fg};--tac:${t.ac}"><span class="tprev"><i></i><b>Aa</b></span>${tr('theme_' + t.id)}</button>`).join('')}</div>
      <h3>${tr('color_accent')}</h3><div class="swatches">${ACCENTS.map((a) => `<button class="sw-btn ${s.accent === a ? 'on' : ''}" data-action="set" data-k="accent" data-v='"${a}"' style="${a === 'auto' ? '' : `--sw:${a}`}" aria-label="${a === 'auto' ? tr('themeColor') : a}">${a === 'auto' ? tr('themes') : ''}</button>`).join('')}</div></section>

    <section class="card"><h2>${tr('fontTitle')}</h2><button class="btn ghost" data-action="reset-group" data-group="reading">${tr('resetReading')}</button><div class="fonts">${FONTS.map((f) => `<button class="fontbtn ${s.font === f.id ? 'on' : ''}" data-action="font" data-v="${f.id}" style="font-family:${esc(fontStack(f.id))}"><b>${f.id === 'system' ? tr('systemFont') : esc(f.name)}</b><span>${tr('fontSample')}</span><small>${tr('font_' + f.id)}</small></button>`).join('')}</div>
      ${step('fontSize', 'Yazı boyutu', 13, 28, 1, ' px')}
      ${step('lineHeight', 'Satır aralığı', 1.2, 2.4, 0.1, '', (x) => fmtNum(x))}
      ${step('letterSpacing', 'Harf aralığı', 0, 0.2, 0.01, ' em', (x) => fmtNum(x))}
      ${step('wordSpacing', 'Sözcük aralığı', 0, 0.5, 0.04, ' em', (x) => fmtNum(x))}
      ${tog('bold', tr('bold'))}
    </section>

    <section class="card"><h2>${L("Düzen ve erişilebilirlik")}</h2><button class="btn ghost" data-action="reset-group" data-group="accessibility">${L("Erişilebilirlik ayarlarını sıfırla")}</button>
      <div class="kv"><span>${L("Yoğunluk")}</span><span class="presets">${opt('density', 'comfy', L("Rahat"))}${opt('density', 'compact', L("Sıkı"))}${opt('density', 'large', L("Büyük dokunma"))}</span></div>
      ${step('radius', 'Köşe yuvarlaklığı', 0, 24, 2, ' px')}
      ${tog('ruler', L("Okuma cetveli"), L("İmlecin olduğu satırı vurgulayan yatay şerit; satır takibini kolaylaştırır."))}
      ${tog('reduceMotion', L("Animasyonları azalt"))}
      ${tog('emoji', L("Simgeleri / emojileri göster"))}
      ${tog('largeCursor', L("Büyük fare imleci"))}
      ${step('focusWidth', 'Odak halkası kalınlığı', 2, 6, 1, ' px')}
      <h3>${L("Klavye kısayolları")}</h3><p class="hint">${L("Metin yazarken ve pencereler açıkken sekme kısayolları devre dışıdır. Tab ile gez, Enter / Boşluk ile seç, Escape ile pencereyi kapat. Kısayolları yeniden ata veya kapat.")}</p>
      ${Object.entries(SHORTCUT_ACTIONS).map(([id, name]) => `<label class="field"><span>${tr(id)}</span><select data-shortcut="${id}"><option value="" ${!s.shortcuts[id] ? 'selected' : ''}>${L("Kapalı")}</option>${Array.from({ length: 9 }, (_, i) => `Alt+${i + 1}`).map(key => `<option value="${key}" ${s.shortcuts[id] === key ? 'selected' : ''}>${key}</option>`).join('')}</select></label>`).join('')}
    </section>

    <section class="card"><h2>${L("Matriks gösterimi")}</h2><button class="btn ghost" data-action="reset-group" data-group="matrix">${L("Matriks ayarlarını sıfırla")}</button>
      ${tog('showNrv', L("Yüzde referansı çubukları"), L("Seçili BRD, elle girilen hedef veya EFSA PRI/AI referansıyla karşılaştırma; kişisel ihtiyaç veya emilim ölçümü değildir."))}
      ${tog('showSource', L("Kaynak etiketleri (USDA / Hesap / Etiket)"))}
      ${tog('showAlt', L('Varsa ikinci ölçümü göster'))}
      ${tog('showSd', L("Varsa kaynak standart sapmasını göster"))}
      ${tog('showNiche', L("Az bilinen besinleri de listele (ör. jackfruit, teff); kapalıyken yalnız aramada çıkar"))}
      ${tog('catGrid', L("Keşfet'te kategorileri eşit kutulu ızgara olarak göster"))}
      ${tog('showAnimal', L("Hayvansal besinleri göster (süt, yumurta, et, balık, bal)"))}
      ${tog('showSimilar', L("Besin ayrıntısında benzer besinleri göster"))}
      ${tog('showRecent', L("Keşfet'te son bakılan besinleri göster"))}
      ${tog('recipeGaps', L("Tarifte en düşük kalan besinleri ve kaynaklarını göster"))}
      ${tog('cardFacts', L("Besin kartlarında kısa özet (kcal, protein, lif)"))}
      ${tog('showMissing', L("“Veri yok” satırlarını listele"))}
      <div class="kv"><span>${L("Ondalık hassasiyeti")}</span><span class="presets">${opt('precision', 'low', L("Az"))}${opt('precision', 'normal', L("Normal"))}${opt('precision', 'high', L("Çok"))}</span></div>
      <div class="kv"><span>${L("Varsayılan miktar")}</span><span class="presets">${[50, 100, 250, 1000].map((g) => opt('defaultAmount', g, g === 1000 ? '1 kg' : g + ' g')).join('')}</span></div>
      ${tog('showExt', L("Geniş katalog (USDA, {n} kayıt, İngilizce adlar)", { n: META.ext }))}
    </section>

    <section class="card"><h2>${L("Matriks bölümleri")}</h2>
      <p class="hint">${L("Görünür bölümleri seç, oklarla sırala. Kimlik ve kapsam özeti her zaman görünür.")}</p>
      <div class="section-settings">${s.sectionOrder.map((id, i) => `<div class="section-option">
        <label><input type="checkbox" data-section-visible="${id}" ${s.hiddenSections.includes(id) ? '' : 'checked'}> ${esc(L(MATRIX_SECTIONS.find(x => x.id === id).title))}</label>
        <span class="presets"><button class="btn ghost" data-action="section-move" data-id="${id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="${L("{s} yukarı", { s: esc(L(MATRIX_SECTIONS.find(x => x.id === id).title)) })}">↑</button><button class="btn ghost" data-action="section-move" data-id="${id}" data-d="1" ${i === s.sectionOrder.length - 1 ? 'disabled' : ''} aria-label="${L("{s} aşağı", { s: esc(L(MATRIX_SECTIONS.find(x => x.id === id).title)) })}">↓</button></span>
      </div>`).join('')}</div>
      <h3>${L("Sabitlenen besin öğeleri")}</h3><p class="hint">${L("En fazla 24 öğeyi matriksin en üstünde izle.")}</p>
      <label class="field"><span>${L("Öğe sabitle")}</span><select id="pin-nutrient"><option value="">${L("Bir bileşen seç")}</option>${NUTRIENTS.filter(n => !['energy', 'energy_kj'].includes(n.key) && !s.pinnedNutrients.includes(n.key)).map(n => `<option value="${n.key}">${esc(nutrientLabel(n))} (${esc(n.unit)})</option>`).join('')}</select></label>
      <div class="presets">${s.pinnedNutrients.map(k => `<button class="pchip on" data-action="unpin" data-key="${k}" aria-label="${L("{n} sabitlemesini kaldır", { n: esc(nutrientLabel(NUTRIENT_BY_KEY[k])) })}">${esc(nutrientLabel(NUTRIENT_BY_KEY[k]))} ×</button>`).join('')}</div>
    </section>
    <section class="card"><h2>${L("Birim ve sayı tercihleri")}</h2>
      <div class="kv"><span>${L("Enerji (matriks)")}</span><div class="presets">${opt('energyUnit', 'both', 'kcal + kJ')}${opt('energyUnit', 'kcal', 'kcal')}${opt('energyUnit', 'kj', 'kJ')}</div></div>
      <div class="kv"><span>${L("Miktar göstergesi")}</span><div class="presets">${opt('amountUnit', 'g', L("Gram"))}${opt('amountUnit', 'oz', L("Ons (oz)"))}</div></div>
      <p class="hint">${L("1 oz = 28,349523125 g. Seçim düğmeleri ve hesap tabanı 1 g – 10 kg aralığında kalır. Sıvılarda yaklaşık mL yalnızca kaynakta hacim ölçüsü (yoğunluk) varsa hesaplanır; yoksa gram gösterilir.")}</p>
      <div class="kv"><span>${tr('numberSeparator')}</span><div class="presets">${opt('decimalSeparator', 'auto', tr('followLanguage'))}${opt('decimalSeparator', 'comma', tr('comma') + ': 1,5')}${opt('decimalSeparator', 'dot', tr('dot') + ': 1.5')}</div></div>
      ${tog('autoUnits', L("Büyük miktarlarda birimi yükselt (µg → mg → g)"))}
      <p class="hint">${L("CSV her zaman Türkçe Excel uyumlu ondalık virgül ve tanımlı besin birimlerini kullanır.")}</p>
    </section>
    <section class="card"><h2>${L("Yüzde referansı")}</h2>
      <div class="presets">${opt('referenceMode', 'eu', L("AB / TGK BRD"))}${opt('referenceMode', 'custom', L("Kendi hedeflerim"))}${opt('referenceMode', 'efsa', L("EFSA grup referansı"))}</div>
      <p class="hint">${L("AB 1169/2011 (2011) yetişkin etiket referansıdır. Kişisel hedeflerin elle girilir; yaşa veya sağlık durumuna göre otomatik öneri yapılmaz. Eksik hedefe BRD değeri atanmaz.")}</p>
      ${s.referenceMode === 'efsa' ? renderEfsaSettings(s, S.efsaTableOpen) : ''}
      ${s.referenceMode === 'custom' ? `<label class="field"><span>${L("Hedef eklenecek bileşen")}</span><select id="target-nutrient"><option value="">${L("Bileşen seç")}</option>${NUTRIENTS.filter(n => n.key !== 'energy_kj' && s.targets[n.key] == null).map(n => `<option value="${n.key}">${esc(nutrientLabel(n))} (${esc(n.unit)})</option>`).join('')}</select></label><label class="field"><span>${L("Yeni hedef miktarı (seçili bileşenin biriminde)")}</span><input type="number" min="0" step="any" id="target-new-value"></label><button class="btn" data-action="target-add">${L("Hedef ekle")}</button>
      ${Object.entries(s.targets).map(([k, value]) => { const n = NUTRIENT_BY_KEY[k]; return `<label class="field"><span>${L("{n} hedefi ({u})", { n: esc(nutrientLabel(n)), u: esc(n.unit) })}</span><input type="number" min="0" step="any" data-target-value="${k}" value="${value}"></label><button class="btn ghost" data-action="target-remove" data-key="${k}">${L("{n} hedefini kaldır", { n: esc(nutrientLabel(n)) })}</button>`; }).join('')}` : ''}
    </section>
    <section class="card"><h2>${tr('customTheme')}</h2>
      <div class="cu-grid theme-colors">${Object.entries(COLOR_LABELS).map(([k, label]) => `<button class="btn color-field" data-action="theme-color-open" data-key="${k}" aria-label="${tr('colorOpen', { name: tr('color_' + k) })}"><span class="color-dot" style="background:${s.customTheme[k]}" aria-hidden="true"></span><span>${tr('color_' + k)}<small>${s.customTheme[k]}</small></span></button>`).join('')}</div>
      ${themePreview(s.customTheme)}
      <p class="hint" role="status">${tr('themeContrast', { ratio: fmtNum(themeTextContrast(s.customTheme)) })} ${tr(themeTextContrast(s.customTheme) < 4.5 ? 'contrastLow' : 'contrastGood')} ${tr('contrastAccent')}: ${fmtNum(contrastRatio(s.customTheme.accent, s.customTheme.card))}:1.</p>
      <div class="presets"><button class="btn" data-action="theme-apply">${tr('themeApply')}</button><button class="btn" data-action="theme-export">${tr('themeExport')}</button><button class="btn" data-action="open-file" data-id="theme-file">${tr('themeImport')}</button><input type="file" id="theme-file" accept="application/json,.json" hidden></div>
    </section>
    <section class="card"><h2>${L("Görünüm profilleri")}</h2>
      <p class="hint">${L("Okuma, sunum veya gece için en fazla 12 görünüm kaydet. Profiller üst çubuktan uygulanabilir ve tam yedeğe dahildir.")} ${L("Profil uygulanınca hedeflerin, referans ve diyet seçimin, sabitlenen besinler ve dil olduğu gibi kalır.")}</p>
      <div class="presets"><input id="profile-name" aria-label="${L("Yeni profil adı")}" placeholder="${L("Ör. Gece okuması")}" maxlength="40"><button class="btn" data-action="profile-save">${L("Görünümü kaydet")}</button></div>
      ${S.profiles.map(p => `<div class="section-option"><b>${esc(p.name)}</b><span class="presets"><button class="btn" data-action="profile-apply" data-id="${p.id}">${L("Uygula")}</button><button class="btn" data-action="profile-update" data-id="${p.id}" aria-label="${L("{p} profilini güncelle", { p: esc(p.name) })}">${L("Güncelle")}</button><button class="btn danger" data-action="profile-delete" data-id="${p.id}" aria-label="${L("{p} profilini sil", { p: esc(p.name) })}">${L("Sil")}</button></span></div>`).join('')}
    </section>
    <section class="card"><h2>${L("Yalnızca ayarları taşı")}</h2>
      <p class="hint">${L("Görünümünü başka cihaza taşı. Tarifler ve kendi besinlerin bu işlemden etkilenmez.")}</p>
      <div class="presets"><button class="btn" data-action="settings-export">${L("Ayarları indir")}</button>
      <button class="btn" data-action="open-file" data-id="settings-file">${L("Ayar dosyası aç")}</button><input type="file" accept="application/json,.json" id="settings-file" hidden></div>
    </section>
    <section class="card updates"><h2>${L("Güncellemeler")}</h2>
      <div class="kv"><span>${L("Yüklü sürüm")}</span><span><b>${esc(window.__APP_VERSION__ || '')}</b></span></div>
      <p class="hint">${L("Uygulama kendiliğinden internete bağlanmaz. Yeni sürümü indirmek için sürüm sayfasını aç: GitHub hesabınla giriş yapmışken cihazına uygun dosyayı indir ve eskisinin üzerine kur. Tarifler, koleksiyonlar, ayarlar ve kendi besinlerin cihazda kalır; emin olmak için önce yedek al.")}</p>
      <div class="presets"><a class="btn primary" data-action="open-releases" href="${RELEASES_URL}" target="_blank" rel="noopener noreferrer">⬇ ${L("Sürüm sayfasını aç")}</a>
      <button class="btn" data-action="copy-releases">${L("Bağlantıyı kopyala")}</button>
      <button class="btn ghost" data-action="exp-file">${L("Önce yedek al (.json)")}</button></div>
      <p class="hint mono-url">${RELEASES_URL}</p>
    </section>
    <section class="card"><h2>${L("Yedekleme")}</h2>
      <p class="hint">${L("Tarifler ve ayarlar yalnızca bu cihazda saklanır. Başka cihaza taşımak veya yedeklemek için dışa aktar.")}</p>
      <div class="presets"><button class="btn" data-action="exp-file">${L("Dosyaya kaydet (.json)")}</button>
      <button class="btn" data-action="exp-copy">${L("Panoya kopyala")}</button>
      <button class="btn" data-action="open-file" data-id="imp-file">${L("Dosyadan içe aktar")}</button><input type="file" accept="application/json,.json" id="imp-file" hidden>
      <button class="btn" data-action="imp-paste">${L("Yapıştırarak içe aktar")}</button></div>
    </section>
  </div>`);
}

export function renderAbout() {
  // B180: telefonda ~7600 px metin duvarıydı. Önce tanıtım, sürüm ve veri dürüstlüğü; uzun kaynak listesi ve lisanslar katlanır.
  return `<div class="about card">
    ${S.settings.emoji ? plateIllustration : ''}
    <h1>Besin Matriksi</h1>
    <p>${L("Çevrimdışı çalışan, ayrıntılı besin bileşimi gezgini ve tarif hesaplayıcı. Bitkisel besinler ağırlıklı; hayvansal besinler ayrı kategorilerde ve etiketli (Ayarlar'dan gizlenebilir). İnternet bağlantısı gerekmez; hiçbir veri cihazdan çıkmaz.")}</p>
    <p class="hint">${L("Sürüm {v} · veri: {src} · {n} küratörlü besin / {f} biçim.", { v: esc(window.__APP_VERSION__ || ''), src: esc(L(META.sources)), n: META.curated, f: META.forms })}</p>
    ${META.recipeEstimatedForms != null ? `<p class="hint">${L("Kapsam özeti: {r} tarif hesabı (tahmin) biçimi, {u} verisiz biçim, {z} varsayılan sıfır hücresi, {e} geniş katalog kaydı.", { r: fmtNum(META.recipeEstimatedForms), u: fmtNum(META.unavailableForms), z: fmtNum(META.assumedZeroCells || 0), e: fmtNum(META.ext) })}</p>` : ''}
    <h3>${L("Veri dürüstlüğü")}</h3>
    <ul>
      <li>${L("Ölçülmemiş bileşen <b>“veri yok”</b> olarak gösterilir, asla 0 yazılmaz. 0 yalnızca kaynak 0 bildirdiğinde görünür.")}</li>
      <li>${L('Değerler kaynakta belirtilen besin ve hazırlama biçimine aittir. Çeşit, toprak, olgunluk ve yöntem değerleri değiştirebilir.')}</li>
      <li>${L("Varlık ≠ ölçülen miktar ≠ emilen miktar ≠ sağlık etkisi. Göstergeler eğitim amaçlıdır, tıbbi tavsiye değildir.")}</li>
      <li>${L("%BRD, AB/TGK etiket referansıdır; kişisel ihtiyacın yaşa, cinsiyete, sağlık durumuna göre değişir.")}</li>
      <li>${L("EFSA seçeneği, çocuk/yetişkin grup referanslarındaki PRI ve AI türlerini ayırır; üst sınır veya kişisel hedef önermez. Kaynak koşulları ve görüş yılı Ayarlar'daki referans tablosunda okunur.")}</li>
    </ul>
    <details class="about-more"><summary>${L('Veri kaynakları')} <span class="cnt">15</span></summary>
    <ul>
      <li><b>${esc(SOURCES.u.short)}</b>: ${esc(L(SOURCES.u.long))}. ${L("Su, enerji, makrolar, lif, şeker, vitaminler, mineraller, yağ sınıfları; pişmiş formlar dahil.")}</li>
      <li><b>${L("USDA tam bileşim tablosu:")}</b> ${L("Ölçümü bulunan amino asitler, şeker türleri, yağ asitleri, D2/D3, tokoferoller, fitosteroller, kafein ve betain. Eksik değerler sıfıra çevrilmez.")}</li>
      <li><b>${esc(SOURCES.F.short)}</b>: ${esc(L(SOURCES.F.long))}. ${L("Aynı USDA kaydında SR28'de ölçülmeyen değerler (ör. biyotin, molibden, iyot, sitrik ve malik asit, şeker türleri) daha yeni analizden doldurulur; SR28 değerleri değiştirilmez.")}</li>
      <li><b>${esc(SOURCES.N.short)}</b>: ${esc(L(SOURCES.N.long))}. ${L("Türk kahvesi, bitkisel sütlü latte ve cappuccino gibi SR28'de olmayan hazır içecekler.")}</li>
      <li><b>${esc(SOURCES.f.short)}</b>: ${esc(L(SOURCES.f.long))}. ${L("Flavonoller (kuersetin, kaempferol…), flavonlar, flavanonlar (hesperetin, naringenin), flavan-3-oller (kateşinler, EGCG) ve antosiyanidinler; aynı USDA kayıt numarasıyla eşleşen besinlerde.")}</li>
      <li><b>${esc(L(SOURCES.y.short))}</b>: ${esc(L(SOURCES.y.long))}. ${L("Daidzein, genistein, glisitein.")}</li>
      <li><b>${esc(SOURCES.L.short)}</b>: ${esc(L(SOURCES.L.long))}. ${L("Bazı besinlerde yağ asitleri, şeker türleri ve tokoferoller.")}</li>
      <li><b>${esc(L(SOURCES.I.short))}</b>: ${esc(L(SOURCES.I.long))}. ${L("İyot; analitik ortalamalar (0 = ölçüldü, saptanmadı).")}</li>
      <li><b>${esc(L(SOURCES.C.short))}</b>: ${esc(L(SOURCES.C.long))}. ${L("Kolin türleri (serbest kolin, fosfatidilkolin…) ve betain; SR28 toplam kolini değiştirilmez.")}</li>
      <li><b>${esc(L(SOURCES.P.short))}</b>: ${esc(L(SOURCES.P.long))}. ${L("Proantosiyanidin (yoğunlaşmış tanen) fraksiyonları; 0 = saptanmadı, bazı iz değerler tespit sınırından tahmin edilmiştir.")}</li>
      <li><b>${esc(L(SOURCES.U.short))}</b>: ${esc(L(SOURCES.U.long))}. ${L("Adenin, guanin, hipoksantin, ksantin ve toplamları (gut/ürik asit açısından); USDA kaydına adla eşlendi, Japonya örneklerinden gelen değerler etiketin açıklamasında belirtilir.")}</li>
      <li><b>${esc(SOURCES.B.short)}</b>: ${esc(L(SOURCES.B.long))}. ${L("İyot, biyotin, selenyum, pantotenik asit ve şeker türleri; yalnız ad, hazırlama biçimi ve ana bileşimi (su, protein) uyuşan besinlerde. İz (Tr) ve ölçülmemiş (N) değerler kullanılmaz.")}</li>
      <li><a href="https://www.matvaretabellen.no/en/">${esc(SOURCES.M.short)}</a> · ${esc(L('Beluga mercimeği, psyllium ve bazı iyot değerleri.'))}</li>
      <li><a href="https://doi.org/10.57745/RDMHWY">${esc(SOURCES.A.short)}</a> · ${esc(L('Bazı makarna, taze ot, içecek ve klorür kayıtları.'))}</li>
      <li><b>IFCT 2017:</b> ${L("NIN ürün kullanım izni doğrulanmadığı için veri ve bu veriye dayanan tahminler bu sürümde dağıtılmıyor.")}</li>
    </ul>
    </details>
    <section class="license-notices" aria-label="${L("Lisanslar ve telif bildirimleri")}"><details class="about-more"><summary><h3>${L("Lisanslar ve telif bildirimleri")} <span class="cnt">${NOTICES.length}</span></h3></summary>
      <p>${L("Kod MIT lisanslıdır. Veriler, yazı tipleri ve diğer yazılımlar kendi koşullarına tabidir. Aşağıdaki özgün bildirimler internetsiz okunabilir.")}</p>
      ${NOTICES.map(n => `<details class="notice"><summary>${esc(n.name)} · ${esc(n.license)} · ${esc(n.version)}</summary><pre>${esc(n.text)}</pre></details>`).join('')}
    </details></section>
  </div>`;
}
