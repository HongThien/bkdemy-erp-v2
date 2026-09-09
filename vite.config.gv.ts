import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cùng bẫy đã cắn ở bundle HS/OPS/TA: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-gv-html-to-index',
    closeBundle() { try { renameSync(join('dist-gv', 'gv.html'), join('dist-gv', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho app GIÁO VIÊN (PLAN-app-gv.md, Thùy chốt 31/08): entry thứ 5 cùng repo/Supabase,
// khuôn y hệt app TA. Entry = gv.html/main-gv.tsx (AppGv — KHÔNG kéo NhanSuHome/useStore/screens kho).
// Màu lá cây #16a34a (Thùy chốt "màu giáo dục xanh" — da trời đã thuộc app HS, teal thuộc TA).
// Lệnh: npm run build:gv
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'BK Academy — Giáo viên',
        short_name: 'BK Giáo viên',
        description: 'Chấm bài trên lớp, đánh giá sau buổi, theo dõi học tập lớp mình — giáo viên BK Academy',
        theme_color: '#16a34a',
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
        // Dữ liệu chấm/đánh giá LUÔN phải mới — không cache API, chỉ asset tĩnh (như app OPS/TA).
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//, /^\/storage\//],
      },
    }),
    renameToIndex(),
  ],
  build: {
    outDir: 'dist-gv',
    rollupOptions: { input: 'gv.html' },
  },
  server: { port: Number(process.env.PORT) || 5173 },
})
