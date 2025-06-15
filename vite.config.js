// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path'; // ADD THIS LINE

export default defineConfig({
  root: 'src',
  envDir: '../',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: { // ADD OR UPDATE THIS BLOCK
      input: {
        main: resolve(__dirname, 'src/index.html'),
        chords: resolve(__dirname, 'src/chords/index.html'), // ADD THIS LINE
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
    // Ensure your proxy is removed from here if it was for scales-chords-api
  },
});