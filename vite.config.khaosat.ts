import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cùng bẫy đã cắn ở bundle HS/OPS/TA/GV/chi: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-khaosat-html-to-index',
    closeBundle() { try { renameSync(join('dist-khaosat', 'khaosat.html'), join('dist-khaosat', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho PWA KHẢO SÁT "Bạn của con ở BK" trên iPad trung tâm (spec-khao-sat-hs.md; CEO 08/09 "trỏ riêng ra
// thành 1 PWA cho iPad"). Entry thứ 10 cùng repo/Supabase, khuôn y hệt app TA: khaosat.html/main-khaosat.tsx
// (AppKhaoSat — KHÔNG kéo NhanSuHome/useStore/screens kho). Vercel project riêng → dist-khaosat/.
// iPad = iOS ⇒ chỉ PWA (Safari → Chia sẻ → Thêm vào MH chính), không có APK. Lệnh: npm run dev:khaosat / build:khaosat
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-khaosat-192.png', 'icon-khaosat-512.png'],
      manifest: {
        name: 'Bạn của con ở BK — Khảo sát',
        short_name: 'Bạn của con',
        description: 'Khảo sát 3 phút cho học sinh BK Academy — trợ giảng cầm iPad',
        theme_color: '#8B6BEF',
        background_color: '#DDF3FF',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'vi',
        icons: [
          { src: '/icon-khaosat-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-khaosat-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-khaosat-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Không cache API (ai đã làm phải luôn mới) — chỉ asset tĩnh để cài PWA + load nhanh.
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//, /^\/storage\//],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-khaosat',
    rollupOptions: { input: 'khaosat.html' },
  },
  server: { port: Number(process.env.PORT) || 5184 },
})
