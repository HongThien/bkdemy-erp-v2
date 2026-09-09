// Entry RIÊNG cho bundle app OPS — KHÔNG import ./App (kéo toàn bộ màn staff), không fitZoom.
// 2 bài học đắt mang nguyên từ main-hs.tsx (xem comment dài bên đó): (a) registerSW qua virtual
// module + immediate, không thì PWA kẹt bản cũ vô hạn; (b) ghi đè --app-z=1 vì index.css mặc định
// 1.15 mà chỉ main.tsx (staff) mới chạy fitZoom ghi đè.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import AppOps from './AppOps'
import './index.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()
registerSW({ immediate: true })
document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppOps />
  </StrictMode>,
)
