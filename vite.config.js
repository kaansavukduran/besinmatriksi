import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig(({ mode }) => {
  const lite = mode === 'lite';
  const single = mode === 'single' || lite;
  return {
    base: './',
    define: { __APP_VERSION__: JSON.stringify(pkg.version), __SINGLE__: JSON.stringify(single), __LITE__: JSON.stringify(lite) },
    json: { stringify: true }, // B202: veri JSON.parse ile açılır (JS nesne değişmezinden hızlı)
    publicDir: single ? false : 'public',
    build: {
      outDir: lite ? 'dist-lite' : single ? 'dist-single' : 'dist',
      emptyOutDir: true,
      assetsInlineLimit: single ? 100_000_000 : 4096,
      cssCodeSplit: false,
      target: 'es2020',
      chunkSizeWarningLimit: 5000,
      // B246: veri ve metin sözlükleri koddan seyrek değişir; ayrı parçalar sayesinde kod güncellemesinde yalnız kod yeniden indirilir
      // (hepsi ilk açılışta paralel modulepreload ile gelir; toplam bayt değişmez). Tek dosya sürümünde bölme yok.
      rollupOptions: single ? { output: { codeSplitting: false } } : {
        output: {
          codeSplitting: {
            groups: [
              { name: 'catalog', test: /src[\\/]data[\\/]foods\.json/ },
              { name: 'content', test: /src[\\/](i18n-[a-z-]+\.js|food-art\.js|food-icons\.js|data[\\/](efsa|notices)\.json)/ },
            ],
          },
        },
      },
    },
    // B202: hafif sürümde geniş katalog yerine boş taslak paketlenir
    resolve: lite ? { alias: [{ find: /^\.\/data\/foods-ext\.json$/, replacement: fileURLToPath(new URL('./src/foods-ext-lite.json', import.meta.url)) }] } : {},
    server: { port: 5173, strictPort: true, host: true },
    clearScreen: false,
  };
});
