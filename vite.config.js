import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    base: './',
    define: { __APP_VERSION__: JSON.stringify(pkg.version), __SINGLE__: JSON.stringify(single) },
    publicDir: single ? false : 'public',
    build: {
      outDir: single ? 'dist-single' : 'dist',
      emptyOutDir: true,
      assetsInlineLimit: single ? 100_000_000 : 4096,
      cssCodeSplit: false,
      target: 'es2020',
      chunkSizeWarningLimit: 5000,
      rollupOptions: single ? { output: { codeSplitting: false } } : {},
    },
    server: { port: 5173, strictPort: true, host: true },
    clearScreen: false,
  };
});
