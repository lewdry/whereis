import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess(),

  kit: {
    // Use static adapter to generate build/ folder
    adapter: adapter(),

    // Ensure assets load from root
    paths: {
      base: ''
    }
  }
};