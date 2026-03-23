import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // ZZZ css block is temporary to avoid issue in DSFR styles
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      errorRecovery: true
    }
  },
  build: {
    sourcemap: true
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 3000,
    open: true
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 3000
  }
});
