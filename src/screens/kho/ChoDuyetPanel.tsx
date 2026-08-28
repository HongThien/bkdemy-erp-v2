// Panel "Câu chờ duyệt" — kết quả Claude Code sinh từ hàng đợi clone (26/08), CHƯA có trong
// dai_cau_hoi thật. Duyệt = promote sang dai_cau_hoi (da_duyet=true luôn). Từ chối = chỉ đánh
// dấu trong bảng nháp, không đụng dai_cau_hoi. Xem ghi chú kiến trúc trong migration + api.ts.
import { useEffect, useState } from 'react'
import { listCloneChoDuyet, duyetCloneChoDuyet, tuChoiCloneChoDuyet, type CloneChoDuyet } from '../../lib/kho/api'
import { MathText } from './ui'
import { myNhanSuId } from '../../lib/giaoviec'

export default function ChoDuyetPanel({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState<CloneChoDuyet[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try { setRows(await listCloneChoDuyet()) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function onDuyet(r: CloneChoDuyet) {
    setBusyId(r.id)
    try { const nguoiDuyet = await myNhanSuId(); const ma = await duyetCloneChoDuyet(r, nguoiDuyet); await reload(); alert(`Đã duyệt — vào kho với mã ${ma}.`) }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyId(null) }
  }
  async function onTuChoi(r: CloneChoDuyet) {
    const lyDo = prompt('Lý do từ chối (bắt buộc):')
    if (!lyDo?.trim()) return
    setBusyId(r.id)
    try { const nguoiTuChoi = await myNhanSuId(); await tuChoiCloneChoDuyet(r.id, nguoiTuChoi, lyDo.trim()); await reload() }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyId(null) }
  }

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <button onClick={onClose} className="text-[14px] text-slate-500 hover:text-indigo-600">← Bản đồ kiến thức</button>
        <span className="text-[15px] font-semibold text-slate-800">Câu chờ duyệt</span>
        <span className="text-[12px] text-slate-400">{rows.length} câu — do Claude Code sinh từ hàng đợi clone, chưa vào kho</span>
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Không có câu nào đang chờ duyệt.</p>
          : (
            <ul className="space-y-3">
              {rows.map((r) => (
                <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-400">
                    <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">{r.dang_chinh}</span>
                    {r.parent_ma_cau && <span>clone từ <b className="text-slate-500">{r.parent_ma_cau}</b></span>}
                    <span className="ml-auto">{new Date(r.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Đề bài</div>
                      <MathText>{r.noi_dung}</MathText>
                      {r.lua_chon && (
                        <ul className="mt-1.5 space-y-0.5 text-[13px] text-slate-600">
                          {r.lua_chon.map((o, i) => <li key={i}>{String.fromCharCode(65 + i)}. <MathText>{o}</MathText></li>)}
                        </ul>
                      )}
                      {r.dap_an && <div className="mt-1.5 text-[13px]"><span className="font-medium text-slate-500">Đáp án: </span><MathText>{r.dap_an}</MathText></div>}
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Lời giải</div>
                      {r.loi_giai ? <MathText>{r.loi_giai}</MathText> : <span className="text-[13px] text-slate-300">(không có)</span>}
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button onClick={() => onTuChoi(r)} disabled={busyId === r.id}
                      className="rounded-md px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">✕ Từ chối</button>
                    <button onClick={() => onDuyet(r)} disabled={busyId === r.id}
                      className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">{busyId === r.id ? '⏳…' : '✓ Duyệt — đưa vào kho'}</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  )
}
