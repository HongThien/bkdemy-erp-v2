// Entry RIÊNG cho bundle TOOL SOẠN THẢO — không import ./App.
// --app-z=1 vì index.css mặc định zoom 1.15 mà chỉ main.tsx (staff) chạy fitZoom (bài học từ main-ta).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppSoan from './AppSoan'
import './index.css'
import 'katex/dist/katex.min.css'
import './soan/soan.css'

document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppSoan />
  </StrictMode>,
)
