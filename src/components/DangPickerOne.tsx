// Popup TO chọn 1 DẠNG (browse chủ đề → chuyên đề → dạng, click 1 phát chọn + đóng). Dùng chung mọi nơi chọn dạng.
import { useEffect, useState } from 'react'
import { groupMap, type Tier1Node } from '../lib/kho/api'
import { khoCuaMon } from '../lib/tailieu'

export default function DangPickerOne({ khoi, mon, nhanh, onClose, onPick }: { khoi: string; mon?: string; nhanh?: string | null; onClose: () => void; onPick: (maDang: string) => void }) {
  const [tree, setTree] = useState<Tier1Node[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const listMap = khoCuaMon(mon, nhanh).listMap
  useEffect(() => { listMap(khoi).then((r) => { setTree(groupMap(r)); setLoading(false) }).catch(() => setLoading(false)) }, [khoi, mon, nhanh])
  const kw = q.trim().toLowerCase()
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[8%] inset-y-8 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-3">
          <h3 className="text-base font-semibold text-slate-900">Chọn dạng · Khối {khoi}</h3>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm dạng / chuyên đề…" className="ml-2 h-8 w-64 rounded-md border border-slate-200 px-2.5 text-[13px] outline-none focus:border-indigo-400" autoFocus />
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
            : tree.length === 0 ? <p className="text-sm text-slate-400">Khối này chưa có dạng.</p>
            : tree.map((t1) => (
              <div key={t1.t1Ma} className="mb-4">
                <div className="mb-1.5 text-[12px] font-bold uppercase tracking-wide text-slate-500">{t1.t1Ten}</div>
                {t1.tier2s.map((t2) => {
                  const leaves = t2.leaves.filter((l) => !kw || l.leafTen.toLowerCase().includes(kw) || t2.t2Ten.toLowerCase().includes(kw))
                  if (!leaves.length) return null
                  return (
                    <div key={t2.t2Ma} className="mb-3 rounded-lg border border-slate-100 p-2.5">
                      <div className="mb-1.5 text-[13px] font-semibold text-sky-700">{t2.t2Ten}</div>
                      <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
                        {leaves.map((l) => (
                          <button key={l.leafMa} onClick={() => onPick(l.leafMa)}
                            className="rounded-md border border-slate-200 px-3 py-2 text-left text-[13px] text-slate-700 transition hover:border-violet-400 hover:bg-violet-50">{l.leafTen}</button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
