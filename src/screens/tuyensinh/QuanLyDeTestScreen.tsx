// Quản lý đề test đầu vào (Thùy chốt 07-27) — GHIM tài liệu có sẵn trong Kho làm "đề test đầu vào".
// KHÔNG soạn/CRUD nội dung đề (không dựng lại de_test đã bỏ mig 0105) — chỉ tag. Nguồn = MT + Đề thi
// (mọi loại master TRỪ ET/GT/BTVN). Đề đã ghim → hiện ở dropdown Điểm danh test theo khối×môn; chưa
// ghim đề nào cho khối×môn đó thì Điểm danh fallback toàn bộ khớp (xem DiemDanhTestScreen).
import { useEffect, useMemo, useState } from 'react'
import { listTaiLieuLamDe, listGhimDe, ghimDe, TEN_LOAI_DE } from '../../lib/detest'
import type { TaiLieu } from '../../lib/tailieu'
import { MON_OPTIONS } from '../../lib/tuyensinh'
import { KHOI_OPTIONS } from '../../lib/kho/api'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function QuanLyDeTestScreen() {
  const [deList, setDeList] = useState<TaiLieu[]>([])
  const [ghim, setGhim] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [mon, setMon] = useState<string>('') // '' = tất cả môn
  const [busyId, setBusyId] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const isMobile = useIsMobile()

  async function reload() {
    setLoading(true)
    try {
      const [d, g] = await Promise.all([listTaiLieuLamDe(), listGhimDe()])
      setDeList(d); setGhim(g)
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  async function toggle(id: string, on: boolean) {
    setBusyId(id); setErr(null)
    try {
      await ghimDe(id, on)
      setGhim((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n })
    } catch (e: any) { setErr(e.message ?? String(e)) } finally { setBusyId(null) }
  }

  // Lọc theo môn → gom theo khối (thứ tự KHOI_OPTIONS).
  const nhom = useMemo(() => {
    const ds = mon ? deList.filter((d) => d.mon === mon) : deList
    const byKhoi = new Map<string, TaiLieu[]>()
    for (const d of ds) { (byKhoi.get(d.khoi) ?? byKhoi.set(d.khoi, []).get(d.khoi)!).push(d) }
    return KHOI_OPTIONS.filter((k) => byKhoi.has(k)).map((k) => ({ khoi: k, docs: byKhoi.get(k)! }))
  }, [deList, mon])

  const soGhim = deList.filter((d) => ghim.has(d.id)).length

  return (
    <div className="h-full overflow-auto">
      <div className={isMobile ? 'mx-auto max-w-[1100px] p-3' : 'mx-auto max-w-[1100px] p-6'}>
        <div className="mb-4">
          <h2 className="text-[20px] font-semibold text-slate-800">Quản lý đề test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Ghim tài liệu có sẵn trong Kho (MT · Đề thi) làm đề test đầu vào — Điểm danh test chỉ hiện đề đã ghim theo khối×môn. Đã ghim: {soGhim}.</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <FilterPill active={mon === ''} onClick={() => setMon('')}>Tất cả môn</FilterPill>
          {MON_OPTIONS.map((m) => <FilterPill key={m} active={mon === m} onClick={() => setMon(m)}>{m}</FilterPill>)}
        </div>

        {err && <p className="mb-3 text-[12px] text-rose-600">{err}</p>}

        {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : nhom.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">
            Chưa có MT / Đề thi nào{mon ? ` cho môn ${mon}` : ''} trong Kho.
          </div>
        ) : (
          <div className="space-y-5">
            {nhom.map(({ khoi, docs }) => (
              <div key={khoi}>
                <div className="mb-2 text-[13px] font-semibold text-slate-600">Khối {khoi}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {docs.map((d) => {
                    const on = ghim.has(d.id)
                    return (
                      <div key={d.id} className={`flex items-center gap-2 rounded-xl border p-3 shadow-sm transition ${on ? 'border-indigo-200 bg-indigo-50/60' : 'border-slate-100 bg-white'}`}>
                        <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${d.loai === 'mt' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'}`}>{TEN_LOAI_DE[d.loai] ?? d.loai}</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-slate-800">{d.ten}</div>
                          <div className="text-[11px] text-slate-400">{d.mon} · Khối {d.khoi}</div>
                        </div>
                        <button onClick={() => toggle(d.id, !on)} disabled={busyId === d.id}
                          className={`shrink-0 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition disabled:opacity-40 ${on ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'border border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                          {on ? '★ Đã ghim' : '☆ Ghim'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
      {children}
    </button>
  )
}
