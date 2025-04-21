import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      components: resolve(__dirname, './src/components'),
    },
  },

  plugins: [
    legacy({
      renderLegacyChunks: false,
      modernPolyfills: true,
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico',
        'assets/images/icon-192x192.png',
        'assets/images/icon-512x512.png',
        'assets/images/apple-touch-icon.png',
      ],
      manifest: {
        name: 'Gallery Found',
        theme_color: '#bb67bf',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'assets/images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],

  build: {
    target: 'es2020',
  },

  server: {
    port: 5000,
    host: true,
  },
});
