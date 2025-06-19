import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  envDir: '../',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        chords: resolve(__dirname, 'src/chords/index.html'),
      },
    },
  },
  plugins: [
    {
      name: 'vite-env-logger',
      configResolved(config) {
        console.log('\n--- Vite Environment Variables Loaded ---');
        console.log(config.env);
        console.log('-----------------------------------------\n');
      }
    }
  ],
  server: {
    proxy: {

      '/api/genius': {
        target: 'https://api.genius.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/genius/, ''),
        secure: true,
      },

    },

    '/api/lastfm': {
      target: 'https://ws.audioscrobbler.com', // The actual Last.fm API domain
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/lastfm/, ''), // Removes /api/lastfm prefix
      secure: true, // Set to true because Last.fm supports HTTPS
    },
  },
});