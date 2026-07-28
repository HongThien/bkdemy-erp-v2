// Popup TO chọn 1 CHUYÊN ĐỀ (browse chủ đề → chuyên đề, click 1 phát chọn + đóng) — dùng cho Đúng/Sai
// ở đề thi: chỉ neo theo CHUYÊN ĐỀ, KHÔNG chọn dạng lá riêng (khác DangPickerOne, xem DeThiScreen.tsx).
// anchorMaDang = dạng ĐẦU TIÊN của chuyên đề đó — dùng làm dang_chinh/FK-anchor nội bộ (ẩn khỏi UI),
// đúng convention "dang_chinh ∈ dạng của chuyên đề đó" đã có ở kho/api.ts.
import { useEffect, useState } from 'react'
import { listDaiMap, listKhtnMap, groupMap, type Tier1Node } from '../lib/kho/api'

export default function ChuyenDePickerOne({ khoi, mon, onClose, onPick }: {
  khoi: string; mon?: string; onClose: () => void
  onPick: (chuyenDe: { ma: string; ten: string; anchorMaDang: string }) => void
}) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const listMap = mon === 'KHTN' ? listKhtnMap : listDaiMap
  useEffect(() => { listMap(khoi).then((r) => { setTree(groupMap(r)); setLoading(false) }).catch(() => setLoading(false)) }, [khoi, mon])
  const kw = q.trim().toLowerCase()
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn chuyên đề · Khối {khoi}</h3>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm chuyên đề…" className="ml-2 h-8 w-64 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" autoFocus />
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : tree.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có chuyên đề.</p>
            : tree.map((t1) => {
              const t2s = t1.tier2s.filter((t2) => !kw || t2.t2Ten.toLowerCase().includes(kw))
              if (!t2s.length) return null
              return (
                <div key={t1.t1Ma} className="mb-4">
                  <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t1.t1Ten}</div>
                  <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
                    {t2s.map((t2) => {
                      const anchor = t2.leaves[0]?.leafMa
                      if (!anchor) return null // chuyên đề chưa có dạng nào → chưa dùng được (thiếu FK-anchor)
                      return (
                        <button key={t2.t2Ma} onClick={() => onPick({ ma: t2.t2Ma, ten: t2.t2Ten, anchorMaDang: anchor })}
                          className="rounded-md border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-700 transition hover:border-violet-400 hover:bg-violet-50">{t2.t2Ten}</button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
