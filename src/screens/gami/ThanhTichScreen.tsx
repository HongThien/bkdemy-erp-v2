// MÀN THÀNH TÍCH (showcase, full-screen — KHÔNG popup) — duyệt MỌI HS → click → bảng FULL màn.
// Tách khỏi GamiDiemScreen (công cụ staff); chung query (listThanhTich/listGamiMons), khác trình bày.
import { useEffect, useState } from 'react'
import { listThanhTich, listGamiMons, type ThanhTichRow } from '../../lib/gami'
import BangThanhTich from './BangThanhTich'

export default function ThanhTichScreen() {
  const [mons, setMons] = useState<string[]>([])
  const [mon, setMon] = useState('')
  const [rows, setRows] = useState<ThanhTichRow[]>([])
  const [seasonLbl, setSeasonLbl] = useState('')
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<{ id: string; ten: string; maHs: string | null; khoi: string | null } | null>(null)

  useEffect(() => { listGamiMons().then((m) => { setMons(m); if (m.length) setMon(m[0]) }).catch(() => {}) }, [])
  useEffect(() => {
    setLoading(true)
    listThanhTich(mon || undefined).then((r) => { setRows(r.rows); setSeasonLbl(r.seasonLabel) }).finally(() => setLoading(false))
  }, [mon])

  // FULL-SCREEN: chọn 1 HS → bảng chiếm trọn màn (không phải popup).
  if (open) return (
    <div className="flex h-full min-w-0 flex-col bg-gradient-to-b from-indigo-50/50 to-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white/80 px-6 py-2.5 backdrop-blur">
        <button onClick={() => setOpen(null)} className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-500 hover:bg-slate-100">← Danh sách</button>
        <span className="text-sm font-semibold text-slate-900">{open.ten}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-6 sm:p-10"><BangThanhTich hocSinhId={open.id} hoTen={open.ten} maHs={open.maHs} khoi={open.khoi} fit /></div>
    </div>
  )

  const shown = rows.filter((r) => !q.trim() || r.ho_ten.toLowerCase().includes(q.trim().toLowerCase()) || (r.ma_hs ?? '').toLowerCase().includes(q.trim().toLowerCase()))
  const tab = (on: boolean) => `h-8 rounded-lg px-3 text-[13px] font-semibold transition ${on ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`

  return (
    <div className="flex h-full min-w-0 flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-1 text-sm font-semibold text-slate-900">🏆 Thành tích</span>
        {seasonLbl && <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[12px] font-semibold text-violet-600">{seasonLbl}</span>}
        {mons.length > 1 && mons.map((m) => <button key={m} onClick={() => setMon(m)} className={tab(mon === m)}>{m}</button>)}
        <span className="rounded bg-indigo-50 px-2 py-0.5 text-[12px] font-medium text-indigo-600">{shown.length} HS</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm tên / mã…" className="ml-auto h-8 w-48 rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-indigo-400" />
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Chưa có HS nào có thành tích. Điểm sinh khi đóng buổi.</div>
          : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((r) => <Card key={r.hoc_sinh_id + r.mon} r={r} onOpen={() => setOpen({ id: r.hoc_sinh_id, ten: r.ho_ten, maHs: r.ma_hs, khoi: r.khoi })} />)}
            </div>
          )}
      </div>
    </div>
  )
}

// Thẻ HS: ảnh + tên + huy chương top-3 + Elo + hạng.
function Card({ r, onOpen }: { r: ThanhTichRow; onOpen: () => void }) {
  const medal = r.rankNow === 1 ? '🥇' : r.rankNow === 2 ? '🥈' : r.rankNow === 3 ? '🥉' : null
  return (
    <button onClick={onOpen} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:shadow-sm">
      {r.anh_url
        ? <img src={r.anh_url} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-100" />
        : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-base font-bold text-white">{r.ho_ten.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? '?'}</span>}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 truncate text-[14px] font-semibold text-slate-800">
          {medal && <span>{medal}</span>}<span className="truncate">{r.ho_ten}</span>
        </div>
        <div className="text-[11px] text-slate-400">{r.ma_hs ?? '—'} · {r.khoi ? `Khối ${r.khoi}` : r.mon}</div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px]">
          <span className="font-bold text-indigo-600 tabular-nums">{r.elo}</span>
          <span className="text-slate-300">Elo</span>
          <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-500">#{r.rankNow}</span>
        </div>
      </div>
    </button>
  )
}
