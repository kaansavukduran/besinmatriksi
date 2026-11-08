// Yazı tipleri uygulamaya gömülüdür (çevrimdışı). Seçilen aile ilk kullanımda yüklenir.
import atk4l from '@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-400-normal.woff2?url';
import atk4e from '@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-ext-400-normal.woff2?url';
import atk7l from '@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-700-normal.woff2?url';
import atk7e from '@fontsource/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-ext-700-normal.woff2?url';
import lex4l from '@fontsource/lexend/files/lexend-latin-400-normal.woff2?url';
import lex4e from '@fontsource/lexend/files/lexend-latin-ext-400-normal.woff2?url';
import lex7l from '@fontsource/lexend/files/lexend-latin-700-normal.woff2?url';
import lex7e from '@fontsource/lexend/files/lexend-latin-ext-700-normal.woff2?url';
import od4 from '@fontsource/opendyslexic/files/opendyslexic-latin-400-normal.woff2?url';
import od7 from '@fontsource/opendyslexic/files/opendyslexic-latin-700-normal.woff2?url';
import and4l from '@fontsource/andika/files/andika-latin-400-normal.woff2?url';
import and4e from '@fontsource/andika/files/andika-latin-ext-400-normal.woff2?url';
import and7l from '@fontsource/andika/files/andika-latin-700-normal.woff2?url';
import and7e from '@fontsource/andika/files/andika-latin-ext-700-normal.woff2?url';
import int4l from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
import int4e from '@fontsource/inter/files/inter-latin-ext-400-normal.woff2?url';
import int7l from '@fontsource/inter/files/inter-latin-700-normal.woff2?url';
import int7e from '@fontsource/inter/files/inter-latin-ext-700-normal.woff2?url';
import lit4l from '@fontsource/literata/files/literata-latin-400-normal.woff2?url';
import lit4e from '@fontsource/literata/files/literata-latin-ext-400-normal.woff2?url';
import lit7l from '@fontsource/literata/files/literata-latin-700-normal.woff2?url';
import lit7e from '@fontsource/literata/files/literata-latin-ext-700-normal.woff2?url';
import nun4l from '@fontsource/nunito/files/nunito-latin-400-normal.woff2?url';
import nun4e from '@fontsource/nunito/files/nunito-latin-ext-400-normal.woff2?url';
import nun7l from '@fontsource/nunito/files/nunito-latin-700-normal.woff2?url';
import nun7e from '@fontsource/nunito/files/nunito-latin-ext-700-normal.woff2?url';
import mono4l from '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-400-normal.woff2?url';
import mono4e from '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-ext-400-normal.woff2?url';
import mono7l from '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-700-normal.woff2?url';
import mono7e from '@fontsource/noto-sans-mono/files/noto-sans-mono-latin-ext-700-normal.woff2?url';

const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const pair = (l, e) => [[l, LATIN], [e, LATIN_EXT]];

export const FONTS = [
  { id: 'atkinson', name: 'Atkinson Hyperlegible', family: 'BM Atkinson', note: 'Az görenler için tasarlandı; benzer harfler (I l 1, O 0) ayrışır', stack: 'sans-serif', files: { 400: pair(atk4l, atk4e), 700: pair(atk7l, atk7e) } },
  { id: 'opendyslexic', name: 'OpenDyslexic', family: 'BM OpenDyslexic', note: 'Disleksi için: ağırlıklı harf tabanları, döndürülmeye dirençli biçimler', stack: 'sans-serif', files: { 400: [[od4, null]], 700: [[od7, null]] } },
  { id: 'lexend', name: 'Lexend', family: 'BM Lexend', note: 'Okuma akıcılığı için geniş aralıklı tasarım', stack: 'sans-serif', files: { 400: pair(lex4l, lex4e), 700: pair(lex7l, lex7e) } },
  { id: 'andika', name: 'Andika', family: 'BM Andika', note: 'Okumayı yeni öğrenenler için; tek katlı a ve g', stack: 'sans-serif', files: { 400: pair(and4l, and4e), 700: pair(and7l, and7e) } },
  { id: 'nunito', name: 'Nunito', family: 'BM Nunito', note: 'Yuvarlak, yumuşak ve sevimli', stack: 'sans-serif', files: { 400: pair(nun4l, nun4e), 700: pair(nun7l, nun7e) } },
  { id: 'inter', name: 'Inter', family: 'BM Inter', note: 'Ekran için net, nötr', stack: 'sans-serif', files: { 400: pair(int4l, int4e), 700: pair(int7l, int7e) } },
  { id: 'literata', name: 'Literata', family: 'BM Literata', note: 'Kitap okuma hissi veren serifli yazı', stack: 'serif', files: { 400: pair(lit4l, lit4e), 700: pair(lit7l, lit7e) } },
  { id: 'mono', name: 'Noto Sans Mono', family: 'BM Mono', note: 'Eş genişlikli; sayılar hizalı', stack: 'monospace', files: { 400: pair(mono4l, mono4e), 700: pair(mono7l, mono7e) } },
  { id: 'system', name: 'Sistem yazısı', family: null, note: 'Cihazının varsayılan yazısı', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', files: {} },
];

const loaded = new Set();

export function fontStack(id) {
  const f = FONTS.find((x) => x.id === id) || FONTS[0];
  return f.family ? `"${f.family}", ${f.stack}` : f.stack;
}

export async function ensureFont(id) {
  const f = FONTS.find((x) => x.id === id);
  if (!f || !f.family || loaded.has(id) || typeof FontFace === 'undefined') return;
  loaded.add(id);
  const jobs = [];
  for (const [weight, files] of Object.entries(f.files)) {
    for (const [url, range] of files) {
      const desc = { weight, style: 'normal', display: 'swap' };
      if (range) desc.unicodeRange = range;
      const ff = new FontFace(f.family, `url(${url}) format("woff2")`, desc);
      document.fonts.add(ff);
      jobs.push(ff.load().catch(() => {}));
    }
  }
  await Promise.all(jobs);
}
