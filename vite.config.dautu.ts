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

// Entry RIÊNG để TEST game ĐẤU TỪ (spec-dau-tu-vung.md). Thùy 03/10: game nằm TRONG app HS, KHÔNG deploy riêng —
// entry này chỉ để chạy thử local (máy + iPad cùng Wi-Fi). publicDir = public chung với app HS (bộ chiến đấu Đấu trường, boss, nền).
// Lệnh: npm run dev:dautu (cổng 5293).
export default defineConfig({
  publicDir: 'public',
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-hs-192.png', 'icon-hs-512.png'],
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
          { src: '/icon-hs-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-hs-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-hs-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html}', 'bk-ui/hs/skin/rpg/dau_truong/**/*.{webp,jpg}', 'bk-ui/hs/skin/rpg/boss_thuy_*.png'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
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
