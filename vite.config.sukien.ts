import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cùng bẫy đã cắn ở bundle HS/OPS/TA/GV/chi: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-sukien-html-to-index',
    closeBundle() { try { renameSync(join('dist-sukien', 'sukien.html'), join('dist-sukien', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho app SỰ KIỆN (spec-su-kien.md; Thùy 26/09 "tách khỏi ERP cho đỡ lẫn"). Entry thứ 11 cùng repo/Supabase,
// khuôn y hệt app Khảo sát: sukien.html/main-sukien.tsx (AppSuKien — KHÔNG kéo NhanSuHome/useStore). Vercel project
// riêng → dist-sukien/. Dùng trên laptop check-in, điện thoại quản trò, máy nối TV. Lệnh: npm run dev:sukien / build:sukien
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-sukien-192.png', 'icon-sukien-512.png'],
      manifest: {
        name: 'BK Sự kiện',
        short_name: 'BK Sự kiện',
        description: 'Check-in · vòng quay · hàng chờ · quầy quà cho sự kiện BK Academy',
        theme_color: '#3b1d6e',
        background_color: '#1a0b33',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'vi',
        icons: [
          { src: '/icon-sukien-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-sukien-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-sukien-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
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
    outDir: 'dist-sukien',
    rollupOptions: { input: 'sukien.html' },
  },
  server: { port: Number(process.env.PORT) || 5186 },
})
