// Entry RIÊNG cho bundle app TRỢ GIẢNG — không import ./App. 2 bài học đắt mang nguyên từ
// main-hs/main-ops: (a) registerSW immediate qua virtual module, không thì PWA kẹt bản cũ;
// (b) --app-z=1 vì index.css mặc định zoom 1.15 mà chỉ main.tsx (staff) chạy fitZoom.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import AppTa from './AppTa'
import './index.css'
import 'katex/dist/katex.min.css' // công thức (MathText): thiếu CSS này ⇒ số mũ/phân số hiện "x2" — lỗi cũ ở khối "Câu trả lời ngắn", lộ ra khi thêm viewer câu (16/10)
import { initErrorBuffer } from './lib/errorBuffer'
import { initAppBadgeBridge } from './lib/appBadge'

initErrorBuffer()
initAppBadgeBridge()
registerSW({ immediate: true })
document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTa />
  </StrictMode>,
)
