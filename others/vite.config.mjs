import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 3000
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 3000
  }
});
