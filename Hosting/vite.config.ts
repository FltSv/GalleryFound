import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
        components: resolve(__dirname, './src/components'),
      },
    },

    plugins: [
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
      target: isProd ? 'es2020' : 'modules',
    },

    server: {
      port: 5000,
      host: true,
    },
  };
});
