// Tạo / sửa 1 THƯ MỤC cụm = 1 chương của 1 khối ("Hình 8 · Tứ giác"). Trong 1 chương, cụm công thức + lời văn lặp
// gần y hệt nhau (Thùy 05/09) → bảng cụm lọc theo thư mục đang chọn.
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { KHOI, NHANH_TEN, type ThuMuc } from './cum'

const inp = 'w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-[13px] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
const lbl = 'flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500'

export function ThuMucModal({ initial, onSave, onCancel }: { initial?: ThuMuc; onSave: (t: Omit<ThuMuc, 'id' | 'created'>) => void; onCancel: () => void }) {
  const [ten, setTen] = useState(initial?.ten ?? '')
  const [nhanh, setNhanh] = useState(initial?.nhanh ?? 'hinh')
  const [khoi, setKhoi] = useState<string>(initial?.khoi ? String(initial.khoi) : '8')
  const [err, setErr] = useState<string | null>(null)
  const save = () => {
    if (!ten.trim()) { setErr('Thư mục cần có tên chương.'); return }
    onSave({ ten: ten.trim(), mon: 'Toán', nhanh: nhanh || undefined, khoi: khoi ? Number(khoi) : undefined })
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onCancel() }
    if (e.key === 'Enter') { e.preventDefault(); save() }
  }
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/35 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-[520px] max-w-full rounded-2xl border border-slate-200 bg-white shadow-2xl" onKeyDown={onKeyDown}>
        <div className="border-b border-slate-200 px-4 py-2.5"><h2 className="text-[14px] font-semibold text-slate-800">{initial ? 'Sửa thư mục' : 'Thư mục mới (chương của khối)'}</h2></div>
        <div className="grid grid-cols-[0.8fr_0.6fr_1.6fr] gap-3 px-4 py-3">
          <label className={lbl}>Nhánh
            <select value={nhanh} onChange={(e) => setNhanh(e.target.value)} className={inp}>
              <option value="">Chung</option>
              {Object.entries(NHANH_TEN).map(([id, t]) => <option key={id} value={id}>{t}</option>)}
            </select>
          </label>
          <label className={lbl}>Khối
            <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={inp}>
              <option value="">—</option>
              {KHOI.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label className={lbl}>Tên chương
            <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} placeholder="vd: Tứ giác" className={inp} />
          </label>
        </div>
        {err && <p className="px-4 pb-1 text-[12px] text-rose-600">{err}</p>}
        <div className="flex items-center gap-2 border-t border-slate-200 px-4 py-2.5">
          <button type="button" onClick={onCancel} className="ml-auto rounded-md px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100">Huỷ</button>
          <button type="button" onClick={save} className="rounded-md bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-500">{initial ? 'Cập nhật' : 'Tạo thư mục'}</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
