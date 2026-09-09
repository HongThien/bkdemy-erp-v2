// Entry RIÊNG cho bundle app PHÁT TRIỂN — không import ./App. 2 bài học đắt mang nguyên từ
// main-hs/main-ops/main-ta: (a) registerSW immediate qua virtual module, không thì PWA kẹt bản cũ;
// (b) --app-z=1 vì index.css mặc định zoom 1.15 mà chỉ main.tsx (staff) chạy fitZoom.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import AppPt from './AppPt'
import './index.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()
registerSW({ immediate: true })
document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppPt />
  </StrictMode>,
)
