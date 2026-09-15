// Nút góp ý / báo lỗi 🐞 cho app OPS (CEO 31/08: "làm toàn bộ app ops/ta giống giáo viên") —
// tái dùng NGUYÊN hệ bao_loi của ERP, KHÔNG đẻ kênh mới, không import useStore (luật bundle).
// Đặt Ở TRANG CHỦ góc trên phải (top bar cạnh Thoát), nút inline — không nổi đè màn khác.
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { createBaoLoi } from '../../lib/baoloi'
import { recentErrors } from '../../lib/errorBuffer'

export default function GopY({ route }: { route: string }) {
  const [open, setOpen] = useState(false)
  const [moTa, setMoTa] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function gui() {
    if (busy) return
    if (!moTa.trim()) { alert('Mô tả giúp mình — lỗi gì / muốn góp ý gì, càng kỹ càng tốt.'); return }
    setBusy(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await createBaoLoi({
        mo_ta: moTa.trim(),
        route: `app_ops:${route}`,
        context: { app: 'ops', email: user?.email, url: location.href, viewport: `${innerWidth}x${innerHeight}`, ua: navigator.userAgent, errors: recentErrors() },
      })
      setDone(true)
      setTimeout(() => { setOpen(false); setMoTa(''); setDone(false) }, 1400)
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }

  return (
    <>
      <button onClick={() => { setDone(false); setOpen(true) }} aria-label="Góp ý / báo lỗi"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[15px] active:bg-slate-100">🐞</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-3 sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[440px] rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {done ? <p className="py-6 text-center text-[14px] font-bold text-emerald-600">✓ Đã gửi — cảm ơn bạn!</p> : (
              <>
                <p className="mb-1 text-[14px] font-bold text-slate-900">🐞 Góp ý / báo lỗi app Vận hành</p>
                <p className="mb-2 text-[11.5px] text-slate-400">Gặp lỗi, thấy bất tiện, hay muốn thêm gì — viết vào đây, đội kỹ thuật đọc trực tiếp.</p>
                <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} autoFocus
                  placeholder="Vd: màn điểm danh lớp 8S1 bấm Có mặt không ăn…"
                  className="mb-3 h-28 w-full rounded-xl border border-slate-300 px-2.5 py-2 text-[13.5px]" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setOpen(false)} className="min-h-[40px] rounded-lg px-3 text-[13px] text-slate-500">Huỷ</button>
                  <button onClick={gui} disabled={busy} className="min-h-[40px] rounded-lg bg-indigo-600 px-4 text-[13px] font-semibold text-white disabled:opacity-40">{busy ? 'Đang gửi…' : 'Gửi'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
