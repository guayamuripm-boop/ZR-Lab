/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'ZR Lab — Taller virtual de ZR Mecademy',
        short_name: 'ZR Lab',
        description:
          'El taller virtual de ZR Mecademy: aprende las piezas del sistema de arranque y carga y practica mediciones reales.',
        lang: 'es',
        theme_color: '#0D1230',
        background_color: '#0D1230',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // El contenido pedagógico y los assets ya visitados quedan cacheados
        // para el modo offline parcial (RNF-9).
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,json}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
