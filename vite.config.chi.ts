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
    name: 'rename-chi-html-to-index',
    closeBundle() { try { renameSync(join('dist-chi', 'chi.html'), join('dist-chi', 'index.html')) } catch { /* dev server không build file, bỏ qua */ } },
  }
}

// Build RIÊNG cho app BK CHI (PLAN-thu-chi.md, Thùy chốt 02/09: app hoàn ứng chi tiêu nhân sự, domain
// chi.bkacademy.edu.vn). Entry = chi.html/main-chi.tsx (AppChi — KHÔNG kéo NhanSuHome/useStore/kho)
// → dist-chi/, deploy 1 Vercel project RIÊNG (cùng repo/Supabase — đúng khuôn bundle HS/OPS).
// Lệnh: npm run build:chi
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Academy — Chi tiêu',
        short_name: 'BK Chi',
        description: 'Tạo khoản chi, theo dõi hoàn ứng — BK Academy',
        theme_color: '#0f766e',
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
    outDir: 'dist-chi',
    rollupOptions: { input: 'chi.html' },
  },
  // Preview harness (Claude Code) cấp port qua env PORT — vite không tự đọc, phải nối tay.
  server: { port: Number(process.env.PORT) || 5173 },
})
