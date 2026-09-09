// Entry RIÊNG cho bundle TOOL GIẢI BÀI — không import ./App.
// --app-z=1 vì index.css mặc định zoom 1.15 mà chỉ main.tsx (staff) chạy fitZoom (bài học từ main-ta).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppGiaiBai from './AppGiaiBai'
import './index.css'
import 'katex/dist/katex.min.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()
document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppGiaiBai />
  </StrictMode>,
)
