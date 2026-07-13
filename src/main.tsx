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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {pvJob ? <PrintJobPage params={pvJob} /> : <App />}
  </StrictMode>,
)
