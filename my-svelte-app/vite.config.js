import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const base = process.env.DEPLOY_TARGET === 'github' ? '/whereis/' : '/';

export default defineConfig({
  plugins: [svelte()],
  base,
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (ext === 'mp3') {
            // Keep MP3 files in assets directory with original name
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  }
});