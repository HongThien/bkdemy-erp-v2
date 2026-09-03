// Entry RIÊNG cho bundle hs.bkacademy.edu.vn — KHÔNG import ./App (kéo theo toàn bộ màn staff),
// KHÔNG có nhánh in-PDF (#pvjob, chỉ worker server dùng), KHÔNG chạy fitZoom (mật độ desktop staff).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import AppHS from './AppHS'
import './index.css'
import 'katex/dist/katex.min.css'
import { initErrorBuffer } from './lib/errorBuffer'

initErrorBuffer()

// ⚠ Đăng ký SW phải qua virtual module NÀY, không dựa vào registerSW.js plugin tự inject: script
// inject chỉ register suông — SW mới activate xong nhưng trang đang mở vẫn chạy JS CŨ, HS "vào lại
// app" (PWA còn trong RAM, không re-navigate) thì kẹt bản cũ vô hạn (dính thật 29/08: deploy bỏ trần
// tự luyện xong HS vẫn thấy UI 30 câu). Virtual module lắng nghe 'activated' (isUpdate) → tự
// window.location.reload() — mở app là vài giây sau tự nhảy sang bản mới.
registerSW({ immediate: true })

// ⚠ BUG THẬT gây "trang chủ cuộn dọc" dù đã khoá h-screen (Thùy 21/08, verify trên production):
// `index.css` có `:root { --app-z: 1.15 }` (mặc định — comment gốc ghi rõ "Fallback nếu JS chưa
// chạy") + `#root { zoom: var(--app-z) }` ÁP DỤNG VÔ ĐIỀU KIỆN cho MỌI bundle import file này. App
// staff (`main.tsx`) chạy `fitZoom()` ghi đè `--app-z` theo bề rộng màn NGAY khi load — bundle này
// (`main-hs.tsx`) không chạy fitZoom nên "fallback" 1.15 tồn tại VĨNH VIỄN → `#root` zoom 115% suốt
// — đo thật: 720px viewport × 1.15 = 828px, khớp CHÍNH XÁC độ tràn đã đo trên production. Test cục
// bộ trước đó "pass" là vì lỡ tay chạy qua `index.html`/`main.tsx` (app staff, có fitZoom + có dòng
// `style={{zoom:'var(--app-unz)'}}` undo riêng cho nhánh HS trong `App.tsx`) — KHÔNG PHẢI qua đúng
// `hs.html`/`main-hs.tsx` deploy thật. Ghi đè thẳng `--app-z=1` ở ĐÂY (ưu tiên hơn `:root` nhờ inline
// style) — bundle HS không cần "mật độ desktop" của staff, luôn net 1.0.
document.documentElement.style.setProperty('--app-z', '1')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppHS />
  </StrictMode>,
)
