// Primitives dùng chung cho các tab Giao việc v2 (Apple-clean: nền xám, card trắng, pill mềm).
import { useState, type ReactNode } from 'react'
import { nhanKyTuan, todayVN, soNgayLech } from '../../lib/giaoviec-config'
import type { NguoiDuocGiao } from '../../lib/giaoviec'

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
      <div className={`max-h-[88vh] w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} overflow-auto rounded-2xl bg-white p-6 shadow-xl`} onClick={(e) => e.stopPropagation()}>
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

// Viết tắt tên (2 chữ cái cuối) cho avatar tròn.
export function initials(hoTen: string): string {
  const parts = hoTen.replace(/\s*\(tôi\)\s*/, '').trim().split(/\s+/)
  const a = parts[parts.length - 1]?.[0] ?? ''
  const b = parts.length > 1 ? (parts[parts.length - 2]?.[0] ?? '') : ''
  return (b + a).toUpperCase()
}

// PICKER NGƯỜI có Ô SEARCH (tìm theo tên / mã NS) — dùng chung mọi chỗ gán người.
export function NguoiPicker({ nguoi, value, onChange, exclude }: {
  nguoi: NguoiDuocGiao[]; value: string; onChange: (id: string) => void; exclude?: string
}) {
  const [q, setQ] = useState('')
  const kw = q.trim().toLowerCase()
  const rows = nguoi.filter((n) => n.nhan_su_id !== exclude &&
    (!kw || n.ho_ten.toLowerCase().includes(kw) || (n.ma_ns ?? '').toLowerCase().includes(kw)))
  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm người theo tên hoặc mã NS…"
          className={`${CX_INPUT} pl-9`} />
      </div>
      <div className="mt-1.5 max-h-64 divide-y divide-slate-50 overflow-auto rounded-xl border border-slate-200">
        {!rows.length ? <div className="px-3 py-6 text-center text-[12px] text-slate-400">Không tìm thấy ai khớp “{q}”.</div> :
          rows.map((n) => (
            <button key={n.nhan_su_id} type="button" onClick={() => onChange(n.nhan_su_id)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition ${value === n.nhan_su_id ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">{initials(n.ho_ten)}</span>
              <span className="min-w-0 flex-1 truncate">{n.ho_ten}</span>
              {n.ma_ns && <span className="text-[11px] text-slate-400">{n.ma_ns}</span>}
              {value === n.nhan_su_id && <span className="text-indigo-600">✓</span>}
            </button>
          ))}
      </div>
    </div>
  )
}

// CHIP người làm — nổi bật, đồng nhất (để scan + sau này filter/sort).
export function NguoiChip({ ten }: { ten?: string | null }) {
  if (!ten) return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">◌ chưa gán</span>
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white">{initials(ten)}</span>
      {ten}
    </span>
  )
}

// CHIP deadline — màu theo độ gấp (đỏ quá hạn · cam ≤2 ngày · xám thường).
export function DeadlineChip({ deadline, active = true }: { deadline?: string | null; active?: boolean }) {
  if (!deadline) return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-slate-200">📅 chưa hạn</span>
  const con = active ? soNgayLech(todayVN(), deadline) : 99   // âm = quá hạn
  const cls = !active ? 'bg-slate-100 text-slate-500 ring-slate-200'
    : con < 0 ? 'bg-rose-50 text-rose-700 ring-rose-200'
    : con <= 2 ? 'bg-amber-50 text-amber-700 ring-amber-200'
    : 'bg-slate-100 text-slate-600 ring-slate-200'
  // CEO 05/09: bỏ đếm ngày trễ — chip đỏ là đủ biết quá hạn, chữ thêm chỉ làm card dày.
  const nhan = con === 0 && active ? ' (hôm nay)' : ''
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${cls}`}>📅 {fmtNgay(deadline)}{nhan}</span>
}

// Chọn giá trị/cỡ theo thang FIBONACCI (1·2·3·5·8) — pill. CEO chốt 07-31.
export const FIBO = [1, 2, 3, 5, 8] as const
export function Chon13({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {FIBO.map((n) => <Pill key={n} on={value === n} onClick={() => onChange(n)}>{n}</Pill>)}
    </div>
  )
}
