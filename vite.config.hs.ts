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
  // Vercel đặt VERCEL_ENV = production | preview | development lúc build ⇒ app biết mình là bản THỬ NGHIỆM hay bản THẬT (phieuluu/coBat.ts — cờ tính năng mới).
  define: { __VERCEL_ENV__: JSON.stringify(process.env.VERCEL_ENV ?? "") },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-hs-192.png', 'icon-hs-512.png'],
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
          { src: '/icon-hs-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-hs-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-hs-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App học tập — dữ liệu (câu hỏi/điểm) LUÔN phải mới, không cache API. Chỉ cache asset tĩnh
        // (JS/CSS/font) để load nhanh lần sau + cho phép cài ra màn hình chính (yêu cầu có SW).
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        // Hình huy hiệu + bậc rank (~4 MB, 116 file — chỉ hiện ở Album/Rank/Hồ sơ) KHÔNG cho vào bộ lưu sẵn: nếu không, mỗi lần app
        // cập nhật mọi máy HS phải tải lại đủ 4 MB dù em chưa mở màn nào. Mở màn thì tải theo nhu cầu + cache trình duyệt (01/10).
        // games/ = game nhúng (web tĩnh ~9 MB, Nông trại BK) tải theo nhu cầu, KHÔNG vào bộ lưu sẵn (06/10).
        globIgnores: ['**/bk-ui/hs/gami/huy-hieu/**', '**/bk-ui/hs/gami/rank/**', '**/games/**'],
        // /dautu.html = khung game nhúng bằng <iframe> trong app HS (khu Học tập). Service worker trả index.html (app HS) cho MỌI điều hướng không khớp bộ lưu sẵn — mà `dautu.html?nhung=1&…` có query nên
        // KHÔNG khớp ⇒ khung game hiện lại màn chính app HS = "bấm Đấu trường BK là về Home" (Thùy 03/10; chỉ lộ ở bản có SW/PWA — dev server không có SW nên không tái hiện). Loại ra để đi thẳng mạng.
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//, /^\/dautu\.html/],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-hs',
    // dautu.html = khung game 6 chế độ, app HS nhúng trong khung (khu Học tập — spec-che-do-game §7, 03/10) ⇒ build chung vào dist-hs
    rollupOptions: { input: { hs: 'hs.html', dautu: 'dautu.html' } },
  },
})
