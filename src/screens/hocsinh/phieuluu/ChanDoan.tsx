// Bảng CHẨN ĐOÁN nhỏ cho trang xem thử (hs.html?xem=phieu_luu): hiện ngay trên màn hình máy đang thử (iPad/điện thoại không mở được console)
// — WebGL có không, card đồ hoạ nào, kích thước màn, và MỌI lỗi JS/hứa hẹn bị từ chối/console.error. Chỉ gắn trong trang xem thử.
import { useEffect, useState } from 'react'

export function ChanDoan() {
  const [dong, setDong] = useState<string[]>([])
  const [mo, setMo] = useState(true)
  useEffect(() => {
    const them = (s: string) => setDong((d) => [...d.slice(-9), s])
    const onErr = (e: ErrorEvent) => them(`LỖI: ${e.message} @${(e.filename || '').split('/').pop()}:${e.lineno}`)
    const onRej = (e: PromiseRejectionEvent) => them(`LỜI HỨA BỊ TỪ CHỐI: ${String((e.reason as Error)?.message ?? e.reason)}`)
    const ce = console.error
    console.error = (...a: unknown[]) => { them('console.error: ' + a.map((x) => (x as Error)?.message ?? String(x)).join(' ').slice(0, 220)); ce(...a) }
    window.addEventListener('error', onErr); window.addEventListener('unhandledrejection', onRej)
    try {
      const c = document.createElement('canvas'), gl2 = c.getContext('webgl2'), gl = gl2 ?? (c.getContext('webgl') as WebGLRenderingContext | null)
      const ext = gl?.getExtension('WEBGL_debug_renderer_info')
      them(`WebGL2: ${gl2 ? 'có' : 'KHÔNG'} · WebGL1: ${gl ? 'có' : 'KHÔNG'} · GPU: ${gl && ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : 'ẩn'}`)
    } catch (e) { them('Không tạo được WebGL: ' + String(e)) }
    them(`Màn ${innerWidth}×${innerHeight} · DPR ${devicePixelRatio} · ${navigator.userAgent.replace(/\(.*?\)/, '').slice(0, 70)}`)
    return () => { console.error = ce; window.removeEventListener('error', onErr); window.removeEventListener('unhandledrejection', onRej) }
  }, [])
  return (
    <div className="pointer-events-auto absolute bottom-2 left-2 z-50 max-w-[min(92vw,560px)] text-[11.5px] leading-snug" style={{ background: 'var(--sk-surface)', border: 'var(--sk-card-border)', borderRadius: 8, color: 'var(--sk-ink)' }}>
      <button onClick={() => setMo((v) => !v)} className="w-full px-2 py-1 text-left font-bold" style={{ color: 'var(--sk-acc)' }}>Chẩn đoán {mo ? '▾' : '▸'}</button>
      {mo && <div className="px-2 pb-1.5 font-mono">{dong.map((d, i) => <p key={i} className="break-words">{d}</p>)}</div>}
    </div>
  )
}
