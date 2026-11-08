import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preview-tool harness đôi khi gán port qua env PORT — đọc qua globalThis để tránh cần @types/node.
const assignedPort = (globalThis as any).process?.env?.PORT

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    ...(assignedPort ? { port: Number(assignedPort), strictPort: true } : {}),
    // Thư mục DỮ LIỆU (lô câu, nháp soạn, báo cáo) — app không import gì từ đây. Các phiên Claude ghi liên tục vào đó
    // ⇒ Vite/Tailwind reload trang vài giây/lần, mất đăng nhập + thao tác đang làm (20–22/10). Bỏ theo dõi.
    watch: { ignored: ['**/kho-rules/**', '**/reports/**', '**/_v1_ref/**', '**/scripts/**', '**/docs/**', '**/DEVLOG.md', '**/HANDOFF.md', '**/schema.md'] },
  },
})
