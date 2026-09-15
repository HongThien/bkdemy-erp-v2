import { defineConfig, type Plugin } from 'vite'
import { renameSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Cùng bẫy đã cắn ở bundle HS/OPS/TA/GV/chi/soan: static host chỉ phục vụ index.html cho `/` → rename sau build.
function renameToIndex(): Plugin {
  return {
    name: 'rename-giaibai-html-to-index',
    closeBundle() { try { renameSync(join('dist-giaibai', 'giaibai.html'), join('dist-giaibai', 'index.html')) } catch { /* dev không build, bỏ qua */ } },
  }
}

// Build RIÊNG cho TOOL GIẢI BÀI kho chung (Thùy chốt 06/09: "tách hẳn ra, domain riêng giaibai.bkacademy.edu.vn,
// chỉ chung DB"): entry thứ 8 cùng repo. KHÔNG PWA (web máy bàn — soạn công thức trên điện thoại rất khổ).
// Entry = giaibai.html/main-giaibai.tsx (AppGiaiBai — KHÔNG kéo NhanSuHome/screens kho). Vercel project riêng → dist-giaibai/.
// Lệnh: npm run dev:giaibai / npm run build:giaibai
export default defineConfig({
  plugins: [react(), tailwindcss(), renameToIndex()],
  build: {
    outDir: 'dist-giaibai',
    rollupOptions: { input: 'giaibai.html' },
  },
  server: { port: Number(process.env.PORT) || 5181 },
})
