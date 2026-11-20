// B238: Ayarlar sekmesinin tıklama eylemleri (tema, hedefler, görünüm profilleri, bölüm sırası, sabitlenenler, ön ayarlar, adım/seçim düğmeleri) app.js'ten ayrıldı.
// render, iletişim kutusu, ayar yazma ve ayarları uygulama bindSettingsActions ile verilir; modül app.js'ten içe aktarmaz.
import { S } from '../state.js';
import { L } from '../i18n.js';
import { saveSettings, saveProfiles, DEFAULT_SETTINGS } from '../store.js';
import { uid, clamp, download } from '../util.js';
import { exportTheme, validColor } from '../theme.js';
import { normalizeSettings, resetSettingGroup, exportSettings, moveSection, applyProfileSettings } from '../settings.js';
import { toast, requestExtCatalog } from '../views/ui.js';

let render = () => {}, uiDialog = async () => null, setSetting = () => {}, applySettings = () => {};
const $ = (sel) => document.querySelector(sel);

export function bindSettingsActions(deps) {
  ({ render, uiDialog, setSetting, applySettings } = deps);
}

// Erişilebilirlik ön ayarları (Ayarlar → Hızlı başlangıç)
export const PRESETS_UI = {
  dyslexia: { font: 'opendyslexic', fontSize: 19, lineHeight: 1.8, letterSpacing: 0.05, wordSpacing: 0.16, theme: 'sepia', ruler: true, density: 'comfy' },
  lowvision: { font: 'atkinson', fontSize: 22, lineHeight: 1.6, theme: 'contrast', bold: true, density: 'large' },
  calm: { theme: 'light', emoji: false, reduceMotion: true, accent: '#3557d6', font: 'inter', showSd: false, showAlt: false },
  cute: { theme: 'pastel', font: 'nunito', emoji: true, radius: 20, accent: 'auto' },
};

export const SETTINGS_ACTIONS = {
  'theme-apply': async (b) => { setSetting('accent', 'auto'); setSetting('theme', 'custom'); render(); return; },
  'theme-color-open': async (b) => { S.themeEditor = { key: b.dataset.key, color: S.settings.customTheme[b.dataset.key] }; render(); return; },
  'theme-color-close': async (b) => { S.themeEditor = null; render(); return; },
  'theme-color-preset': async (b) => { S.themeEditor.color = b.dataset.color; render(); return; },
  'theme-color-save': async (b) => {
      const input = $('#theme-color-hex');
      if (!validColor(input.value)) { input.setAttribute('aria-invalid', 'true'); input.reportValidity(); input.focus(); return; }
      if (S.themeEditor.key === 'accent' && S.settings.theme === 'custom') setSetting('accent', 'auto');
      setSetting('customTheme', { ...S.settings.customTheme, [S.themeEditor.key]: input.value });
      S.themeEditor = null; render(); return;
    },
  'theme-export': async (b) => { download('besin-matriksi-tema.json', exportTheme(S.settings.customTheme)); return; },
  'target-add': async (b) => {
      const key = $('#target-nutrient')?.value, value = Number($('#target-new-value')?.value);
      if (!key || !Number.isFinite(value) || value <= 0) { toast(L("Bir bileşen ve sıfırdan büyük hedef miktarı gir")); return; }
      setSetting('targets', { ...S.settings.targets, [key]: value }); render(); return;
    },
  'target-remove': async (b) => { const targets = { ...S.settings.targets }; delete targets[b.dataset.key]; setSetting('targets', targets); render(); return; },
  'profile-save': async (b) => {
      const name = $('#profile-name')?.value.trim();
      if (!name) { toast(L("Bir profil adı gir")); return; }
      if (S.profiles.length >= 12) { toast(L("En fazla 12 profil kaydedilebilir")); return; }
      const next = [...S.profiles, { id: uid(), name: name.slice(0, 40), settings: normalizeSettings(S.settings) }];
      if (!saveProfiles(next)) { toast(L("Profil cihaz depolamasına yazılamadı")); return; }
      S.profiles = next; render(); toast(L("Görünüm kaydedildi")); return;
    },
  'profile-apply': async (b) => {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p) {
        const next = applyProfileSettings(S.settings, p.settings);
        if (!saveSettings(next)) { toast(L("Kaydedilemedi: cihaz depolaması kullanılamıyor")); return; }
        S.settings = next; applySettings(); if (S.settings.showExt) requestExtCatalog(); render(); toast(L("Görünüm: {n}", { n: p.name }));
      } return;
    },
  'profile-update': async (b) => {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(L("“{n}” geçerli görünümle güncellensin mi?", { n: p.name }), { ok: L("Güncelle"), cancel: L("Vazgeç") })) {
        const next = S.profiles.map(x => x.id === p.id ? { ...x, settings: normalizeSettings(S.settings) } : x);
        if (!saveProfiles(next)) { toast(L("Profil cihaz depolamasına yazılamadı")); return; }
        S.profiles = next; toast(L("Profil güncellendi"));
      } return;
    },
  'profile-delete': async (b) => {
      const p = S.profiles.find(p => p.id === b.dataset.id);
      if (p && await uiDialog(L("“{n}” görünüm profili silinsin mi?", { n: p.name }), { ok: L("Sil"), cancel: L("Vazgeç") })) {
        const next = S.profiles.filter(x => x.id !== p.id);
        if (!saveProfiles(next)) { toast(L("Profil cihaz depolamasına yazılamadı")); return; }
        S.profiles = next; render();
      } return;
    },
  'section-move': async (b) => { S.settings = moveSection(S.settings, b.dataset.id, Number(b.dataset.d)); saveSettings(S.settings); render(); return; },
  'unpin': async (b) => { setSetting('pinnedNutrients', S.settings.pinnedNutrients.filter(k => k !== b.dataset.key)); render(); return; },
  'reset-group': async (b) => { S.settings = resetSettingGroup(S.settings, b.dataset.group); saveSettings(S.settings); applySettings(); render(); toast(L("Bölüm ayarları sıfırlandı")); return; },
  'settings-export': async (b) => { download('besin-matriksi-ayarlar.json', exportSettings(S.settings)); return; },
  'set': async (b) => { setSetting(b.dataset.k, JSON.parse(b.dataset.v)); render(); return; },
  'font': async (b) => { setSetting('font', b.dataset.v); render(); return; },
  'setstep': async (b) => {
      const k = b.dataset.k, st = Number(b.dataset.d);
      const v = clamp(Math.round((S.settings[k] + st) * 1000) / 1000, Number(b.dataset.min), Number(b.dataset.max));
      setSetting(k, v); render(); return;
    },
  'preset': async (b) => {
      if (b.dataset.p === 'reset') {
        // Tüm görünüm/matriks ayarları ve hedefler sıfırlanır: geri alınamaz, onay ister (B163)
        if (!(await uiDialog(L("Tüm ayarlar varsayılana dönsün mü? Kişisel hedefler ve görünüm seçimleri sıfırlanır; tarif ve günlük kayıtları korunur."), { ok: L("Varsayılana dön"), cancel: L("Vazgeç") }))) return;
        S.settings = { ...DEFAULT_SETTINGS };
      } else Object.assign(S.settings, PRESETS_UI[b.dataset.p]);
      saveSettings(S.settings); applySettings(); render(); toast(L("Ön ayar uygulandı")); return;
    },
};
