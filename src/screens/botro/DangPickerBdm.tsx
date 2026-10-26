// Bộ chọn MỤC TIÊU đợt đuổi theo BẢN ĐỒ MỚI 4 tầng (Thùy 26/10 "bổ trợ đuổi, học từ đầu chuyển đi").
// Danh sách + thứ tự do DB trả (fn_duoi_dang_chon, xếp theo thu_tu chủ đề → chuyên đề → nhóm → dạng bài); ở đây chỉ nhóm để hiển thị.
// Khác DangPicker cũ: mã đã chọn mà KHÔNG có trong bản đồ mới (dạng bản đồ cũ chưa quy được — mig 202610261821) được GIỮ, hiện riêng
// để người chọn tự bỏ; không âm thầm rụng khi bấm "Dùng".
import { useMemo, useState } from 'react'
import type { DangChonDuoi } from '../../lib/botro_duoi'

type Nhom = { ma: string; ten: string; dangs: DangChonDuoi[] }
type ChuyenDe = { ma: string; ten: string; nhoms: Nhom[] }
type ChuDe = { ma: string; ten: string; chuyenDes: ChuyenDe[] }

const MAU_MUC = ['bg-emerald-500', 'bg-lime-500', 'bg-amber-500', 'bg-orange-500', 'bg-rose-500']

export default function DangPickerBdm({ khoi, dangs, selected, tenCu, onClose, onConfirm }: {
  khoi: string; dangs: DangChonDuoi[]; selected: string[]; tenCu: Record<string, string>
  onClose: () => void; onConfirm: (maDangs: string[]) => void
}) {
  const [sel, setSel] = useState<Set<string>>(new Set(selected))
  const [tim, setTim] = useState('')
  const coTrong = useMemo(() => new Set(dangs.map((d) => d.ma_dang)), [dangs])
  const ngoai = selected.filter((m) => !coTrong.has(m))   // mã cũ đang có trong đợt, không thuộc bản đồ mới
  const cay = useMemo(() => {
    const t = tim.trim().toLowerCase()
    const out: ChuDe[] = []
    for (const d of dangs) {
      if (t && !`${d.ten_dang} ${d.ten_nhom} ${d.ten_chuyen_de ?? ''} ${d.ten_chu_de}`.toLowerCase().includes(t)) continue
      let cd = out[out.length - 1]
      if (!cd || cd.ma !== d.ma_chu_de) { cd = { ma: d.ma_chu_de, ten: d.ten_chu_de, chuyenDes: [] }; out.push(cd) }
      const maCde = d.ma_chuyen_de ?? '_'
      let cde = cd.chuyenDes[cd.chuyenDes.length - 1]
      if (!cde || cde.ma !== maCde) { cde = { ma: maCde, ten: d.ten_chuyen_de ?? '', nhoms: [] }; cd.chuyenDes.push(cde) }
      let n = cde.nhoms[cde.nhoms.length - 1]
      if (!n || n.ma !== d.ma_nhom) { n = { ma: d.ma_nhom, ten: d.ten_nhom, dangs: [] }; cde.nhoms.push(n) }
      n.dangs.push(d)
    }
    return out
  }, [dangs, tim])
  const toggle = (ma: string) => setSel((s) => { const n = new Set(s); n.has(ma) ? n.delete(ma) : n.add(ma); return n })
  const toggleNhieu = (mas: string[], on: boolean) => setSel((s) => { const n = new Set(s); mas.forEach((m) => (on ? n.add(m) : n.delete(m))); return n })
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[14%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn dạng bài cần đuổi · Khối {khoi}</h3>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">Bản đồ mới</span>
          <span className="text-[13px] text-slate-400">đã chọn <b className="text-indigo-600">{sel.size}</b></span>
          <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm tên dạng / nhóm…"
            className="ml-auto w-56 rounded-md border border-slate-200 px-2.5 py-1 text-[13px] outline-none focus:border-indigo-400" />
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {ngoai.length > 0 && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50/60 p-2">
              <div className="mb-1 text-[12px] font-semibold text-amber-800">Dạng bản đồ cũ đang có trong đợt (chưa quy được sang dạng bài mới — giữ nếu không bỏ chọn)</div>
              <div className="grid grid-cols-2 gap-1">
                {ngoai.map((m) => (
                  <label key={m} className={`flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-1.5 ${sel.has(m) ? 'border-amber-300 bg-white' : 'border-slate-100'}`}>
                    <input type="checkbox" checked={sel.has(m)} onChange={() => toggle(m)} className="mt-0.5" />
                    <span className="min-w-0 flex-1 text-[13px] text-slate-700">{tenCu[m] ?? m}</span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-400">{m}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {dangs.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có dạng bài ở bản đồ mới.</p>
            : cay.length === 0 ? <p className="text-sm text-slate-400">Không có dạng khớp “{tim}”.</p>
            : cay.map((cd) => (
              <div key={cd.ma} className="mb-4">
                <div className="mb-1 text-[12px] font-bold uppercase tracking-wide text-slate-500">{cd.ten}</div>
                {cd.chuyenDes.map((cde) => (
                  <div key={cde.ma} className="mb-3 rounded-lg border border-slate-100 p-2">
                    {cde.ten && <div className="mb-1 text-[13px] font-semibold text-sky-700">{cde.ten}</div>}
                    {cde.nhoms.map((n) => {
                      const mas = n.dangs.map((d) => d.ma_dang)
                      const allOn = mas.every((m) => sel.has(m))
                      return (
                        <div key={n.ma} className="mb-2">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-[12px] font-medium text-slate-600">{n.ten}</span>
                            <button onClick={() => toggleNhieu(mas, !allOn)} className="ml-auto rounded px-2 py-0.5 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50">{allOn ? 'Bỏ cả nhóm' : 'Chọn cả nhóm'}</button>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {n.dangs.map((d) => (
                              <label key={d.ma_dang} className={`flex cursor-pointer items-start gap-2 rounded-md border px-2.5 py-1.5 ${sel.has(d.ma_dang) ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                                <input type="checkbox" checked={sel.has(d.ma_dang)} onChange={() => toggle(d.ma_dang)} className="mt-0.5" />
                                <span className="min-w-0 flex-1 text-[13px] text-slate-700">{d.ten_dang}</span>
                                {d.muc_do != null && <span className={`shrink-0 rounded px-1.5 text-[10px] font-bold text-white ${MAU_MUC[d.muc_do - 1] ?? 'bg-slate-400'}`}>{d.muc_do}</span>}
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-3">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100">Huỷ</button>
          {/* giữ THỨ TỰ CHỌN như DangPicker (Thùy 07-24): Set giữ thứ tự chèn */}
          <button onClick={() => onConfirm([...sel])} className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Dùng {sel.size} dạng</button>
        </div>
      </div>
    </div>
  )
}
