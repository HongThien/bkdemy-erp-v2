import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cùng bẫy đã cắn ở bundle HS/OPS/TA: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-pt-html-to-index',
    closeBundle() { try { renameSync(join('dist-pt', 'pt.html'), join('dist-pt', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho app PHÁT TRIỂN (giao việc phát triển — CEO chốt 05/09): entry thứ 7 cùng
// repo/Supabase, khuôn y hệt app TA. Entry = pt.html/main-pt.tsx (AppPt — KHÔNG kéo
// NhanSuHome/useStore/screens kho). Lệnh: npm run build:pt · deploy Vercel project riêng
// (build:pt → dist-pt) + domain pt.bkacademy.edu.vn.
//
// ⭐ PUSH: service worker do workbox sinh (generateSW) KHÔNG có handler `push` — thêm bằng
// `importScripts('sw-push.js')` (file tĩnh ở public/, thuần JS, không qua bundler). Chỉ bundle
// này import nó; các app khác copy file ra dist nhưng không dùng — vô hại.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Academy — Phát triển',
        short_name: 'BK Phát triển',
        description: 'Việc phát triển của tôi, cập nhật tình trạng hàng ngày, giao việc & nghiệm thu — BK Academy',
        theme_color: '#7c3aed',
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
        // Dữ liệu việc LUÔN phải mới — không cache API, chỉ asset tĩnh (như app OPS/TA).
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//, /^\/storage\//, /^\/api\//],
        importScripts: ['sw-push.js'],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-pt',
    rollupOptions: { input: 'pt.html' },
  },
  server: { port: Number(process.env.PORT) || 5173 },
})
