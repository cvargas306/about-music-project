import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // Specifies the project root directory where index.html resides
  build: {
    outDir: '../dist', // Output to 'dist' directory outside of 'src'
    emptyOutDir: true, // Empties the output directory before building
  },
  // You can add a proxy here later if needed for development
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://example.com', // Replace with your actual API base URL
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
});