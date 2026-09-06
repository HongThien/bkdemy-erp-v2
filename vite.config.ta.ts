import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cùng bẫy đã cắn ở bundle HS/OPS: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-ta-html-to-index',
    closeBundle() { try { renameSync(join('dist-ta', 'ta.html'), join('dist-ta', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho app TRỢ GIẢNG (PLAN-app-ta.md, Thùy chốt 30/08): entry thứ 4 cùng repo/Supabase,
// khuôn y hệt app OPS. Entry = ta.html/main-ta.tsx (AppTa — KHÔNG kéo NhanSuHome/useStore/screens kho).
// Lệnh: npm run build:ta
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Academy — Trợ giảng',
        short_name: 'BK Trợ giảng',
        description: 'Chấm ET, chấm BTVN (ảnh nộp qua app), chấm bài trên lớp — trợ giảng BK Academy',
        theme_color: '#0d9488',
        background_color: '#f5f5f7',
        display: 'standalone',
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
        // Dữ liệu chấm LUÔN phải mới — không cache API, chỉ asset tĩnh (như app OPS).
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//, /^\/storage\//, /^\/api\//],
        // Push nhắc việc 23:30 (CEO 06/09) — cùng handler thuần JS với app pt, KHÔNG qua bundler.
        importScripts: ['sw-push.js'],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-ta',
    rollupOptions: { input: 'ta.html' },
  },
  server: { port: Number(process.env.PORT) || 5173 },
})
