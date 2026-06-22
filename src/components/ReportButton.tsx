// Nút nổi 🐞 Báo lỗi (auto-report Pha 1) — mọi màn. Bấm → form mô tả + tự gom context (route/vai/console errors) → gửi.
// ⚠ KHÔNG auto-chụp màn ở Pha 1: app V2 dùng Tailwind v4 (màu oklch) → html-to-image ra ảnh TRẮNG, html2canvas 1.4.1
//   THROW trên oklch. Screenshot để Pha 1.5 (getDisplayMedia / html2canvas-pro). Text context đã đủ mạnh để fix.
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabase'
import { createBaoLoi } from '../lib/baoloi'
import { recentErrors } from '../lib/errorBuffer'

export default function ReportButton() {
  const [open, setOpen] = useState(false)
  const [moTa, setMoTa] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  function moForm() { setMoTa(''); setDone(false); setOpen(true) }

  async function gui() {
    if (busy) return
    if (!moTa.trim()) { alert('Tả lỗi giúp mình (kỹ càng nhất có thể).'); return }
    setBusy(true)
    try {
      const s = useStore.getState()
      const { data: { user } } = await supabase.auth.getUser()
      const context = {
        leaf: s.staffLeaf,
        nguoi: s.me ? `${s.me.nhanSu.ho_ten}${s.me.nhanSu.ma_ns ? ` (${s.me.nhanSu.ma_ns})` : ''}` : null,
        email: user?.email ?? null,
        la_admin: s.quyen?.laAdmin ?? null,
        url: window.location.href,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        user_agent: navigator.userAgent,
        loi_gan_day: recentErrors().map((e) => e.msg).slice(-10),
      }
      await createBaoLoi({ mo_ta: moTa.trim(), route: s.staffLeaf, context })
      setDone(true)
      setTimeout(() => setOpen(false), 1400)
    } catch (e: any) { alert('Gửi lỗi không thành: ' + (e?.message ?? String(e))) }
    finally { setBusy(false) }
  }

  return (
    <>
      <button onClick={moForm} title="Báo lỗi (gửi cho đội kỹ thuật)"
        className="no-print fixed bottom-4 left-4 z-[70] flex h-11 items-center gap-2 rounded-full bg-rose-600 px-4 text-[13px] font-semibold text-white shadow-lg hover:bg-rose-500">
        🐞 Báo lỗi
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[95] flex items-end justify-start bg-slate-900/40 p-4 sm:items-center sm:justify-center" onClick={() => !busy && setOpen(false)}>
          <div className="w-[440px] max-w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[15px] font-semibold text-slate-900">🐞 Báo lỗi</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">{useStore.getState().staffLeaf}</span>
              <button onClick={() => !busy && setOpen(false)} className="ml-auto text-slate-400 hover:text-slate-600">✕</button>
            </div>
            {done ? (
              <div className="py-6 text-center text-[14px] font-medium text-emerald-600">✓ Đã gửi báo lỗi. Cảm ơn!</div>
            ) : (
              <>
                <p className="mb-2 text-[12px] text-slate-400">Tả lỗi kỹ: bấm gì → mong đợi gì → thực tế ra gì. (Màn đang mở + lỗi kỹ thuật đã tự đính kèm. Có ảnh chụp màn thì dán vào mô tả giúp mình.)</p>
                <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} autoFocus rows={6}
                  placeholder="Ví dụ: Vào Buổi học → tab ET → bấm Xác nhận, mong đợi chốt điểm nhưng báo lỗi đỏ…"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-indigo-400" />
                <div className="mt-2 flex items-center">
                  <button onClick={gui} disabled={busy} className="ml-auto rounded-md bg-rose-600 px-4 py-1.5 text-[13px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">{busy ? 'Đang gửi…' : 'Gửi báo lỗi'}</button>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
