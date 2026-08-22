import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Nguồn cố ý đặt tên hs.html (khác index.html của app chính, đỡ nhầm khi 2 file cùng thư mục gốc)
// nhưng host tĩnh (Vercel…) — và cả `vite preview` lúc verify local — mặc định phục vụ `index.html`
// cho `/`. Đổi tên THÀNH index.html ngay trong dist-hs/ sau build — nguồn giữ tên rõ nghĩa, output
// đúng chuẩn mọi static host cần.
function renameToIndex(): Plugin {
  return {
    name: 'rename-hs-html-to-index',
    closeBundle() { try { renameSync(join('dist-hs', 'hs.html'), join('dist-hs', 'index.html')) } catch { /* dev server không build file, bỏ qua */ } },
  }
}

// Build RIÊNG cho hs.bkacademy.edu.vn (Thùy 21/08: "tách thành 1 subpage của BK như PH, làm nó
// thành webapp như phapp"). Entry = hs.html/main-hs.tsx (AppHS — KHÔNG kéo theo màn staff) →
// dist-hs/, deploy thành 1 Vercel project RIÊNG trỏ domain riêng (cùng repo/Supabase project với
// app chính — không tách DB, chỉ tách bundle/domain, xem DEVLOG 2026-08-21 "hs.bkacademy.edu.vn").
// Lệnh: npm run build:hs
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Academy — Học sinh',
        short_name: 'BK Academy',
        description: 'Làm bài online, tự luyện, xem kết quả học tập — BK Academy',
        theme_color: '#087fc6',
        background_color: '#f3f5fa',
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
        // App học tập — dữ liệu (câu hỏi/điểm) LUÔN phải mới, không cache API. Chỉ cache asset tĩnh
        // (JS/CSS/font) để load nhanh lần sau + cho phép cài ra màn hình chính (yêu cầu có SW).
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-hs',
    rollupOptions: { input: 'hs.html' },
  },
})
