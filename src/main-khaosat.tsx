// Entry RIÊNG cho bundle PWA KHẢO SÁT (iPad) — không import ./App. Cùng 2 bài học từ main-hs/main-ta:
// (a) registerSW immediate qua virtual module, không thì PWA kẹt bản cũ; (b) --app-z=1 vì index.css mặc định zoom 1.15.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import AppKhaoSat from './AppKhaoSat'
import './index.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()
registerSW({ immediate: true })
document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppKhaoSat />
  </StrictMode>,
)
