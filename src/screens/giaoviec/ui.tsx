// Primitives dùng chung cho các tab Giao việc v2 (Apple-clean: nền xám, card trắng, pill mềm).
import type { ReactNode } from 'react'
import { nhanKyTuan } from '../../lib/giaoviec-config'

export const CX_INPUT = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-[13px] outline-none focus:border-indigo-400'
export const CX_BTN = 'rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40'
export const CX_BTN_GHOST = 'rounded-lg border border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50'

export const fmtNgay = (iso?: string | null) => {
  if (!iso) return '—'
  const s = iso.slice(0, 10); const [y, m, d] = s.split('-')
  return `${d}/${m}/${y.slice(2)}`
}
export { nhanKyTuan }

// ── Nhãn trạng thái VIỆC (8 trạng thái v2) ──────────────────────────────────
export const VIEC_TT: Record<string, { ten: string; cls: string }> = {
  moi_giao:       { ten: 'Mới giao',       cls: 'bg-slate-100 text-slate-600 ring-slate-200' },
  dang_lam:       { ten: 'Đang làm',       cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  cho_nghiem_thu: { ten: 'Chờ nghiệm thu', cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  dat:            { ten: 'Đạt',            cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  tra_lai:        { ten: 'Trả lại',        cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  hold:           { ten: 'Hold',           cls: 'bg-violet-50 text-violet-700 ring-violet-200' },
  huy:            { ten: 'Đã huỷ',         cls: 'bg-slate-100 text-slate-400 ring-slate-200 line-through' },
  chuyen:         { ten: 'Đã chuyển',      cls: 'bg-slate-100 text-slate-500 ring-slate-200' },
}
export const IDEA_TT: Record<string, { ten: string; cls: string }> = {
  moi:           { ten: 'Mới',           cls: 'bg-sky-50 text-sky-700 ring-sky-200' },
  backlog:       { ten: 'Backlog',       cls: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  holding:       { ten: 'Holding',       cls: 'bg-amber-50 text-amber-700 ring-amber-200' },
  da_trien_khai: { ten: 'Đã triển khai', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  ngu_dong:      { ten: 'Ngủ đông',      cls: 'bg-slate-100 text-slate-400 ring-slate-200' },
  tu_choi:       { ten: 'Đã huỷ',        cls: 'bg-rose-50 text-rose-600 ring-rose-200' },
}

export function Badge({ map, k }: { map: Record<string, { ten: string; cls: string }>; k: string }) {
  const t = map[k] ?? { ten: k, cls: 'bg-slate-100 text-slate-600 ring-slate-200' }
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${t.cls}`}>{t.ten}</span>
}

export function Pill({ on, onClick, children }: { on?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-full px-3 py-1 text-[12px] font-medium ring-1 transition ${on ? 'bg-indigo-600 text-white ring-indigo-600' : 'bg-white text-slate-600 ring-slate-300 hover:ring-indigo-300'}`}>
      {children}
    </button>
  )
}

export function Section({ title, highlight, right, children }: { title: string; highlight?: boolean; right?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className={`text-[13px] font-semibold ${highlight ? 'text-amber-600' : 'text-slate-600'}`}>{title}</div>
        {right}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-[13px] text-slate-400">{children}</div>
}
export function ErrBar({ msg }: { msg: string | null }) {
  if (!msg) return null
  return <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">Lỗi: {msg}</div>
}
export function Stat({ label, value, accent }: { label: string; value: ReactNode; accent?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-[11px] text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${accent ?? 'text-slate-800'}`}>{value}</div>
    </div>
  )
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className={`max-h-[85vh] w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-auto rounded-2xl bg-white p-5 shadow-xl`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><div className="mb-1 text-[12px] font-medium text-slate-600">{label}</div>{children}</label>
}

// Chọn 1–3 (gia_tri / co) — pill.
export function Chon13({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3].map((n) => <Pill key={n} on={value === n} onClick={() => onChange(n)}>{n}</Pill>)}
    </div>
  )
}
