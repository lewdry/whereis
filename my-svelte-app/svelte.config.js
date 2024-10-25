import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    vite: {
      build: {
        rollupOptions: {
          output: {
            assetFileNames: '[name][extname]' // Prevent hashing of asset files
          }
        }
      }
    }
  }
};