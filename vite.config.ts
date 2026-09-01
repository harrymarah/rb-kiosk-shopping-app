import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";

// GitHub Pages serves static files with no rewrite rule, so a direct hit on a
// client route (/basket, /checkout, ...) 404s. Pages falls back to 404.html,
// so shipping a copy of index.html under that name hands those URLs to the
// router instead.
const spaFallback = (): Plugin => ({
  name: "spa-404-fallback",
  apply: "build",
  closeBundle() {
    const dist = path.resolve(__dirname, "dist");
    const index = path.join(dist, "index.html");
    if (fs.existsSync(index)) {
      fs.copyFileSync(index, path.join(dist, "404.html"));
    }
  },
});
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Served from the apex of a custom domain (redbullcom.harrymarah.uk), not
  // from a /repo-name/ path, so the default base is correct here.
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', '**/*.{png,jpg,jpeg,svg,gif,webp}'],
      manifest: {
        name: 'QuickMart Delivery App',
        short_name: 'QuickMart',
        description: 'QuickMart, Earlham Street - Your neighborhood grocery store with fast delivery',
        theme_color: '#0099ff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,gif,webp,json}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB limit for large images
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    }),
    spaFallback(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
