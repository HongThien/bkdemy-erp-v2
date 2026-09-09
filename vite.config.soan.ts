import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cùng bẫy đã cắn ở bundle HS/OPS/TA/GV: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-soan-html-to-index',
    closeBundle() { try { renameSync(join('dist-soan', 'soan.html'), join('dist-soan', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho TOOL SOẠN THẢO công thức (Thùy chốt 04/09): entry thứ 6 cùng repo.
// KHÔNG PWA (công cụ máy bàn, không cần offline/cài đặt) — khác 5 app kia.
// Entry = soan.html/main-soan.tsx (AppSoan — KHÔNG kéo NhanSuHome/useStore/screens kho).
// Lệnh: npm run dev:soan / npm run build:soan
export default defineConfig({
  plugins: [react(), tailwindcss(), renameToIndex()],
  build: {
    outDir: 'dist-soan',
    rollupOptions: { input: 'soan.html' },
  },
  server: { port: Number(process.env.PORT) || 5180 },
})
