// Entry RIÊNG cho bundle hs.bkacademy.edu.vn — KHÔNG import ./App (kéo theo toàn bộ màn staff),
// KHÔNG có nhánh in-PDF (#pvjob, chỉ worker server dùng), KHÔNG chạy fitZoom (mật độ desktop staff
// — HS app vốn đã net 1.0, build này không cần zoom gì cả).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppHS from './AppHS'
import './index.css'
import 'katex/dist/katex.min.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppHS />
  </StrictMode>,
)
