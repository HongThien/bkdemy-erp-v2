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
}

export function recentErrors(): { t: number; msg: string }[] { return [...buf] }
