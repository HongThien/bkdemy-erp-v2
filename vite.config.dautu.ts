import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Static host chỉ phục vụ index.html cho `/` → rename sau build (cùng bẫy các bundle khác).
function renameToIndex(): Plugin {
  return {
    name: 'rename-dautu-html-to-index',
    closeBundle() { try { renameSync(join('dist-dautu', 'dautu.html'), join('dist-dautu', 'index.html')) } catch { /* dev */ } },
  }
}

// Build RIÊNG cho game ĐẤU TỪ (spec-dau-tu-vung.md; Thùy 02/10 "làm demo ra thẳng game, deploy web + app test").
// publicDir RIÊNG (public-dautu/) — mô hình 3D ~9MB không được chui vào dist của các app khác.
// Lệnh: npm run dev:dautu / build:dautu → dist-dautu/ (Vercel project riêng, PWA cài lên iPad/điện thoại = "app").
export default defineConfig({
  publicDir: 'public-dautu',
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Đấu Từ',
        short_name: 'Đấu Từ',
        description: 'Đấu từ vựng tiếng Anh: luyện với bot, đấu online, giải đấu 8 người',
        theme_color: '#2a1d5c',
        background_color: '#140f2e',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'vi',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,webp,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        // Mô hình 3D tải khi cần, cache theo lượt dùng (không nhồi vào precache).
        runtimeCaching: [
          { urlPattern: /\/3d\/.*\.(glb|gltf|bin|png)$/, handler: 'CacheFirst', options: { cacheName: 'dautu-3d', expiration: { maxEntries: 60 } } },
        ],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-dautu',
    rollupOptions: { input: 'dautu.html' },
    chunkSizeWarningLimit: 1500,
  },
  server: { port: Number(process.env.PORT) || 5293, host: true },
})
