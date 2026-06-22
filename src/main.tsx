import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import 'katex/dist/katex.min.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer() // bắt console.error + error toàn cục → đính vào báo lỗi

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
