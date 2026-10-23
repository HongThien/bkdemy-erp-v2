// Bộ đệm lỗi runtime gần nhất → đính vào report (giúp AI fix đúng). Giữ N lỗi cuối.
type ErrEntry = { t: number; msg: string }
const buf: ErrEntry[] = []
const MAX = 25

function push(msg: string) {
  if (!msg) return
  buf.push({ t: Date.now(), msg: msg.slice(0, 600) })
  if (buf.length > MAX) buf.shift()
}

let inited = false
// Vá console.error + bắt error/unhandledrejection toàn cục. Gọi 1 lần ở main.tsx.
export function initErrorBuffer() {
  if (inited) return
  inited = true
  const orig = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    try { push(args.map((a) => (a instanceof Error ? `${a.name}: ${a.message}` : String(a))).join(' ')) } catch { /* */ }
    orig(...args)
  }
  window.addEventListener('error', (e) => push(`window.error: ${e.message}${e.filename ? ` @ ${e.filename}:${e.lineno}` : ''}`))
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => push(`unhandledrejection: ${String(e?.reason)}`))
  initTaiLaiKhiCoBanMoi()
}

// Deploy mới ⇒ file chunk cũ (tên có hash) biến mất khỏi server; tab đang mở từ bản cũ bấm vào chức năng
// tải động (xuất PDF/ảnh, màn lazy) sẽ gặp 'Failed to fetch dynamically imported module'. Vite phát
// 'vite:preloadError' đúng lúc đó ⇒ tự tải lại trang 1 lần để lấy bản mới. Chặn vòng lặp: đã tải lại trong
// 60s gần nhất (hoặc đang mất mạng) thì để lỗi trôi về chỗ gọi như cũ.
function initTaiLaiKhiCoBanMoi() {
  window.addEventListener('vite:preloadError', (e) => {
    if (!navigator.onLine) return
    let lan = 0
    try { lan = Number(sessionStorage.getItem('bk_tai_lai_ban_moi') || 0) } catch { /* */ }
    if (Date.now() - lan < 60_000) return
    try { sessionStorage.setItem('bk_tai_lai_ban_moi', String(Date.now())) } catch { return }
    e.preventDefault()
    window.location.reload()
  })
}

export function recentErrors(): { t: number; msg: string }[] { return [...buf] }
