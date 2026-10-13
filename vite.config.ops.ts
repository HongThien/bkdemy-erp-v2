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
      includeAssets: ['icon-ops-192.png', 'icon-ops-512.png'],
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
          { src: '/icon-ops-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-ops-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-ops-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Dữ liệu vận hành (điểm danh/task) LUÔN phải mới — không cache API, chỉ cache asset tĩnh
        // (đủ điều kiện cài PWA + load nhanh lần sau). ERP và app là 2 đầu nhập cùng 1 DB (Thùy 29/08).
        // ⭐ 13/10 — CHỈ tải sẵn CODE + bộ icon của OPS. public/ dùng CHUNG mọi app nên glob cũ ('**/*.{…png,svg…}') kéo
        // cả ảnh app Học sinh (bk-ui/hs 18MB), game, phiếu test, vinh danh… vào gói tải sẵn: đo trên bản đang chạy =
        // 507 file / 36,5MB mỗi máy cài mới, tải lại mỗi khi bất kỳ ảnh nào trong đó đổi (kể cả ảnh OPS không hề dùng).
        // Ảnh nền/tranh (bk-ui, ops-ui) chuyển sang lưu-khi-dùng (runtimeCaching): lần đầu tải qua mạng, các lần sau
        // lấy từ máy và tự làm mới ngầm (StaleWhileRevalidate ⇒ đổi ảnh cùng tên không bị kẹt bản cũ).
        globPatterns: ['**/*.{js,css,html,woff2}', 'ops-ui/**/*.svg', 'icon-ops-*.png'],
        globIgnores: ['**/xem-thu-*.html', '**/games/**'],
        runtimeCaching: [{
          urlPattern: /\/(bk-ui|ops-ui)\/.+\.(png|jpe?g|svg|webp)$/,
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'ops-anh', expiration: { maxEntries: 300, maxAgeSeconds: 60 * 24 * 3600 } },
        }],
        navigateFallbackDenylist: [/^\/rest\//, /^\/auth\//],
        // Chunk SoanTaiLieu (đường in MT của Test đầu vào) ~2.5 MB do lib/detest.ts dynamic-import — chỉ tải
        // khi bấm in đề, không cần precache offline. Nới trần lên 5 MiB để build không chết vì nó.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
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
