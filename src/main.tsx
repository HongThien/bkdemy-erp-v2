import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import 'katex/dist/katex.min.css'
import { initErrorBuffer } from './lib/errorBuffer'
import PrintJobPage, { parsePvJobHash } from './screens/tailieu/PrintJobPage'

initErrorBuffer() // bắt console.error + error toàn cục → đính vào báo lỗi

// #pvjob=... = trang in cho WORKER server-gen link PDF (xem PrintJobPage) — nhánh riêng hẳn,
// không đi qua App/luồng đăng nhập thường (worker tự mang token qua hash).
const pvJob = parsePvJobHash()

// Zoom VỪA-KHÍT: staff desktop muốn +15% mật độ, nhưng 1.15× cứng làm màn HẸP (MacBook…) tràn mép
// phải. Hạ zoom vừa đủ để layout luôn ≥ MIN_W (đo thực ~1113px) → không cắt góc; tối đa 1.15 màn rộng.
// html.clientWidth = bề rộng cửa sổ THẬT (zoom ở #root, không ảnh hưởng ancestor). index.css/App.tsx
// đọc cùng --app-z (+ --app-unz = 1/z để bù HS/mobile về net 1.0).
function fitZoom() {
  const MIN_W = 1150
  const z = Math.max(1, Math.min(1.15, document.documentElement.clientWidth / MIN_W))
  const s = document.documentElement.style
  s.setProperty('--app-z', z.toFixed(4))
  s.setProperty('--app-unz', (1 / z).toFixed(4))
}
if (!pvJob) { fitZoom(); window.addEventListener('resize', fitZoom) }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {pvJob ? <PrintJobPage params={pvJob} /> : <App />}
  </StrictMode>,
)
