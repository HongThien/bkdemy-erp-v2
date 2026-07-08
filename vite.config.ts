import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Preview-tool harness đôi khi gán port qua env PORT — đọc qua globalThis để tránh cần @types/node.
const assignedPort = (globalThis as any).process?.env?.PORT

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: assignedPort ? { port: Number(assignedPort), strictPort: true } : undefined,
})
