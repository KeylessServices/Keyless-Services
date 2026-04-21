import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    injectHTML(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fr: resolve(__dirname, 'fr.html'),
        quote: resolve(__dirname, 'quote.html'),
        'quote-fr': resolve(__dirname, 'quote-fr.html'),
      },
    },
  },
});
