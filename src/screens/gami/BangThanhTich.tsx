// BẢNG THÀNH TÍCH (showcase) — dùng chung: màn Thành tích (full-screen) + tab Học sinh.
// SKIN TẠM (gu game đẹp sẽ làm sau bằng claude design). Đây chốt LOGIC + bố cục 4 zone:
// A danh tính · B chỉ số (Elo/Hạng/Elo đỉnh + Level placeholder) · C lịch sử thi đấu
// (Top-1 Lớp/ET/MT + chuỗi đi học + tổng) · E danh hiệu (placeholder, define sau).
import { useEffect, useState } from 'react'
import { getThanhTich, type ThanhTich, type ThanhTichMon } from '../../lib/gami'
import { getLevelXu, type LevelXu } from '../../lib/thanhtich'

const DANH_HIEU = ['Học sinh xuất sắc', 'Học sinh tiến bộ', 'Học sinh chăm chỉ']

export default function BangThanhTich({ hocSinhId, hoTen }: { hocSinhId: string; hoTen?: string }) {
  const [tt, setTt] = useState<ThanhTich | null>(null)
  const [loading, setLoading] = useState(true)
  const [mon, setMon] = useState('')
  const [lx, setLx] = useState<LevelXu | null>(null) // Level + Xu của môn đang xem

  useEffect(() => {
    let live = true
    setLoading(true); setTt(null)
    getThanhTich(hocSinhId).then((r) => { if (!live) return; setTt(r); setMon(r.mons[0]?.mon ?? '') }).finally(() => { if (live) setLoading(false) })
    return () => { live = false }
  }, [hocSinhId])

  useEffect(() => {
    if (!mon) { setLx(null); return }
    let live = true; setLx(null)
    getLevelXu(hocSinhId, mon).then((r) => { if (live) setLx(r) }).catch(() => {})
    return () => { live = false }
  }, [hocSinhId, mon])

  if (loading) return <div className="p-10 text-center text-sm text-slate-400">Đang tải thành tích…</div>
  if (!tt || tt.mons.length === 0)
    return <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
      {hoTen ? <b className="text-slate-600">{hoTen}</b> : 'Học sinh'} chưa có thành tích. Điểm sinh khi đóng buổi học.
    </div>

  const cur = tt.mons.find((m) => m.mon === mon) ?? tt.mons[0]
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {tt.mons.length > 1 && tt.mons.map((m) => (
          <button key={m.mon} onClick={() => setMon(m.mon)}
            className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${m.mon === cur.mon ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
            {m.mon}
          </button>
        ))}
        <span className="ml-auto rounded-full bg-violet-100 px-3 py-1 text-[13px] font-bold text-violet-700">🏆 {tt.seasonLabel}</span>
      </div>

      {/* A danh tính + B chỉ số */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-4xl ring-1 ring-indigo-200">
            🥚
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">Lv.{lx?.level ?? 0}</span>
          </div>
          <div className="min-w-0 flex-1">
            {hoTen && <div className="truncate text-xl font-bold text-slate-900">{hoTen}</div>}
            <div className="text-[13px] text-slate-400">{cur.mon}</div>
            {/* Level = chỉ số NỔI BẬT nhất */}
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-400">Cấp độ</span>
              <span className="text-3xl font-extrabold leading-none text-indigo-600">{lx?.level ?? 0}</span>
              <span className="text-sm font-semibold text-slate-400">/ {lx?.levelMax ?? 21}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Elo hiện tại" value={cur.elo.toLocaleString('vi-VN')} sub={`${cur.sessions} buổi`} accent="text-indigo-600" />
          <Stat label="Hạng" value={`#${cur.rankNow}`} sub={`/ ${cur.rankTotal} HS`} accent="text-amber-600" />
          <Stat label="Elo cao nhất" value={cur.eloPeak.toLocaleString('vi-VN')} sub="đỉnh từng đạt" accent="text-violet-600" />
        </div>
        {/* Thanh lương EXP → Xu (tháng này) */}
        {lx && (
          <div className="mt-4 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span className="font-semibold text-slate-500">💰 Lương tháng: <span className="text-emerald-600">{lx.xu} xu</span></span>
              <span className="text-slate-400">{lx.expThang.toLocaleString('vi-VN')} EXP{lx.expKeMoc != null ? ` · ${lx.xuKe} xu ở ${lx.expKeMoc.toLocaleString('vi-VN')}` : ''}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-500" style={{ width: `${lx.expKeMoc ? Math.min(100, Math.round((lx.expThang / lx.expKeMoc) * 100)) : 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* C lịch sử thi đấu */}
      <BattlePanel m={cur} />

      {/* E danh hiệu (placeholder) */}
      <Badges season={tt.seasonLabel} />
    </div>
  )
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 text-center ring-1 ring-slate-100">
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-[10px] text-slate-400">{sub}</div>
    </div>
  )
}

function BattlePanel({ m }: { m: ThanhTichMon }) {
  const Row = ({ label, value, accent }: { label: string; value: number; accent?: string }) => (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
      <span className="text-[13px] text-slate-600">{label}</span>
      <span className={`text-lg font-bold tabular-nums ${accent ?? 'text-slate-800'}`}>{value}</span>
    </div>
  )
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h4 className="mb-1 text-sm font-bold text-slate-800">⚔️ Lịch sử thi đấu</h4>
      <Row label="🏆 Top 1 · Lớp" value={m.top1.lop} accent="text-orange-600" />
      <Row label="🏆 Top 1 · ET" value={m.top1.et} accent="text-orange-600" />
      <Row label="🏆 Top 1 · MT" value={m.top1.mt} accent="text-orange-600" />
      <Row label="🔥 Chuỗi đi học" value={m.chuoiDiHoc} accent="text-rose-500" />
      <Row label="Tổng buổi" value={m.tongBuoi} accent="text-indigo-600" />
    </div>
  )
}

function Badges({ season }: { season: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h4 className="mb-3 text-sm font-bold text-slate-800">⭐ Danh hiệu · {season}</h4>
      <div className="grid grid-cols-3 gap-3">
        {DANH_HIEU.map((d) => (
          <div key={d} className="flex flex-col items-center rounded-xl border border-slate-200 p-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-2xl opacity-40 grayscale">🏅</div>
            <div className="mt-2 text-[12px] font-semibold text-slate-600">{d}</div>
            <div className="mt-1 text-[10px] text-slate-400">điều kiện sắp công bố</div>
          </div>
        ))}
      </div>
    </div>
  )
}
