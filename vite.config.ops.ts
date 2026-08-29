import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cùng bẫy đã cắn ở bundle HS: nguồn đặt tên ops.html cho rõ nghĩa, nhưng static host (Vercel) và
// `vite preview` chỉ phục vụ index.html cho `/` → rename ngay trong dist-ops/ sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-ops-html-to-index',
    closeBundle() { try { renameSync(join('dist-ops', 'ops.html'), join('dist-ops', 'index.html')) } catch { /* dev server không build file, bỏ qua */ } },
  }
}

// Build RIÊNG cho app OPS (PLAN-app-ops.md, Thùy chốt 29/08: OPS-only, iPad/iPhone-first, sau này OPS
// không nhập trên ERP nữa). Entry = ops.html/main-ops.tsx (AppOps — KHÔNG kéo NhanSuHome/useStore/kho)
// → dist-ops/, deploy 1 Vercel project RIÊNG (cùng repo/Supabase, không tách DB — đúng khuôn bundle HS).
// Lệnh: npm run build:ops
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Academy — Vận hành',
        short_name: 'BK Vận hành',
        description: 'Điểm danh, report, chuẩn bị phòng, test đầu vào — vận hành BK Academy',
        theme_color: '#4f46e5',
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
        // Dữ liệu vận hành (điểm danh/task) LUÔN phải mới — không cache API, chỉ cache asset tĩnh
        // (đủ điều kiện cài PWA + load nhanh lần sau). ERP và app là 2 đầu nhập cùng 1 DB (Thùy 29/08).
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-ops',
    rollupOptions: { input: 'ops.html' },
  },
  // Preview harness (Claude Code) cấp port qua env PORT — vite không tự đọc, phải nối tay.
  server: { port: Number(process.env.PORT) || 5173 },
})
