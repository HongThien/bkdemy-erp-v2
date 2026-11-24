// MODULE ĐỘ KHÓ DUY NHẤT (Thùy 24/11): mọi nơi đặt độ khó trên bản đồ dùng chung component này —
// bấm chip ⇒ popup chọn 1–5 (+ dòng "Hệ từ" nếu truyền `he`). Popup vẽ qua portal + fixed nên KHÔNG bị
// card cha (overflow-hidden) cắt. Hình khác Đại ở chỗ nào thì khác ở props (không có `he`, màu chip), không đẻ UI thứ hai.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export const HE_TANG = ['C', 'B', 'A', 'S'] as const

export const MUCDO_TONE: Record<number | string, string> = {
  1: 'bg-emerald-500 text-white', 2: 'bg-lime-500 text-white', 3: 'bg-amber-500 text-white',
  4: 'bg-orange-500 text-white', 5: 'bg-rose-500 text-white', none: 'bg-slate-100 text-slate-400 hover:bg-slate-200',
}

export function DoKhoChon({ muc, onMuc, he, onHe, nutCls, nutNoiDung, tieuDe }: {
  muc: number | null
  onMuc: (v: number | null) => void
  /** Có truyền ⇒ hiện thêm dòng "Hệ từ" (Đại). Hình không truyền. */
  he?: string | null
  onHe?: (v: string | null) => void
  /** Giao diện chip (mặc định theo màu mức). */
  nutCls?: string
  nutNoiDung?: ReactNode
  tieuDe?: string
}) {
  const [mo, setMo] = useState(false)
  const nutRef = useRef<HTMLButtonElement>(null)
  const [vt, setVt] = useState<{ top: number; left: number } | null>(null)
  const bat = (e: React.MouseEvent) => {
    e.stopPropagation()
    const r = nutRef.current?.getBoundingClientRect()
    if (r) {
      const rong = 230, cao = onHe ? 90 : 52
      setVt({
        left: Math.max(8, Math.min(r.left, window.innerWidth - rong - 8)),
        top: r.bottom + 4 + cao > window.innerHeight ? Math.max(8, r.top - cao - 4) : r.bottom + 4,
      })
    }
    setMo((v) => !v)
  }
  useEffect(() => {
    if (!mo) return
    const dong = () => setMo(false)
    window.addEventListener('scroll', dong, true)
    window.addEventListener('resize', dong)
    return () => { window.removeEventListener('scroll', dong, true); window.removeEventListener('resize', dong) }
  }, [mo])
  const nut = (on: boolean) => `rounded px-1.5 py-0.5 text-[11px] font-semibold ${on ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-violet-50'}`
  const dat = (fn: () => void) => { setMo(false); fn() }
  return (
    <span className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
      <button ref={nutRef} draggable={false} onClick={bat} title={tieuDe ?? (muc == null ? 'Chưa gán độ khó — bấm để đặt' : `Độ khó ${muc}/5 — bấm để đổi`)}
        className={nutCls ?? `h-5 min-w-5 rounded px-1 text-[11px] font-bold ${MUCDO_TONE[muc ?? 'none']}`}>{nutNoiDung ?? (muc ?? '?')}</button>
      {mo && vt && createPortal(
        <span style={{ position: 'fixed', top: vt.top, left: vt.left }} onClick={(e) => e.stopPropagation()}
          className="z-[200] flex w-max flex-col gap-1.5 rounded-lg border border-slate-200 bg-white p-2 text-[11px] text-slate-800 shadow-lg">
          <span className="flex items-center gap-1"><span className="w-12 text-slate-500">Độ khó</span>
            {[1, 2, 3, 4, 5].map((m) => <button key={m} draggable={false} className={nut(muc === m)} onClick={() => dat(() => onMuc(m))}>{m}</button>)}
            {muc != null && <button draggable={false} className="px-1 text-slate-400 hover:text-rose-600" title="Bỏ mức" onClick={() => dat(() => onMuc(null))}>✕</button>}
          </span>
          {onHe && (
            <span className="flex items-center gap-1"><span className="w-12 text-slate-500">Hệ từ</span>
              {HE_TANG.map((h) => <button key={h} draggable={false} className={nut(he === h)} onClick={() => dat(() => onHe(h))}>{h}{h === 'S' ? '' : '+'}</button>)}
              {he && <button draggable={false} className="px-1 text-slate-400 hover:text-rose-600" title="Bỏ hệ" onClick={() => dat(() => onHe(null))}>✕</button>}
            </span>
          )}
        </span>,
        document.body,
      )}
    </span>
  )
}
