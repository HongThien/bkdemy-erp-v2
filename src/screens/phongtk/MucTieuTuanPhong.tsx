// MỤC TIÊU TUẦN — đồ vật riêng trong Phòng làm việc (Thùy 17/11 tối: "cần là 1 cái riêng ở phòng làm việc, đừng chung với dashboard,
// để cùng chỗ giáo trình tuần"). Cột lịch bên trái phòng theo nhịp tuần: 📅 Giáo trình tuần → 🎯 Mục tiêu tuần → 📝 Báo cáo tuần.
// Ô (môn × khối) trong phạm vi lấy CÙNG nguồn với Giáo trình tuần (oCuaToi ⇒ fn_pham_vi_cua_toi); phần thân là MucTieuTuanTab (một bộ hàm fn_mtt_*).
// Rời phòng quay lại = đúng chỗ cũ (NHO sống tới F5 — CLAUDE.md §2 React).
import { useEffect, useState } from 'react'
import { oCuaToi, type GttO } from '../../lib/giaoTrinhTuan'
import { thuTuMon } from '../../lib/mon'
import MucTieuTuanTab from '../danhgia/MucTieuTuanTab'

const khoaO = (o: { mon: string; khoi: string }) => `${o.mon}|${o.khoi}`
const NHO: { ds: GttO[] | null; o: string | null } = { ds: null, o: null }

export default function MucTieuTuanPhong() {
  const [ds, setDs] = useState<GttO[] | null>(NHO.ds)
  const [o, setOS] = useState<string | null>(NHO.o)
  const [loi, setLoi] = useState<string | null>(null)
  const [lamMoi, setLamMoi] = useState(0)
  const setO = (v: string) => { NHO.o = v; setOS(v) }

  // Ô (môn × khối) trong phạm vi — gọi một lần; nhớ tới F5.
  useEffect(() => {
    if (ds) return
    oCuaToi().then((d) => {
      const s = [...d].sort((a, b) => thuTuMon(a.mon) - thuTuMon(b.mon) || a.khoi.localeCompare(b.khoi, 'vi', { numeric: true }))
      NHO.ds = s; setDs(s)
      if (!NHO.o && s[0]) setO(khoaO(s[0]))
    }).catch((e) => setLoi(e?.message ?? String(e)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [mon, khoi] = o ? o.split('|') : ['', null]
  // tiêu đề · chọn ô · ↻ đi chung MỘT dòng với tuần / lớp của MucTieuTuanTab
  const dau = (
    <>
      <span className="text-[15px] font-bold">🎯 Mục tiêu tuần</span>
      <select value={o ?? ''} onChange={(e) => setO(e.target.value)} className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[12.5px]">
        {(ds ?? []).map((x) => <option key={khoaO(x)} value={khoaO(x)}>{x.mon} · khối {x.khoi}</option>)}
      </select>
      <button onClick={() => setLamMoi((x) => x + 1)} title="Đọc lại" className="h-7 rounded-md px-2 text-[13px] text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50">↻</button>
    </>
  )
  return (
    <div className="flex min-h-[520px] flex-col gap-2 text-slate-800">
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">Không tải được phạm vi: {loi}</div>}
      {ds && ds.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Ghế của bạn chưa có khối nào trong phạm vi.</div>}
      {o && mon && <MucTieuTuanTab key={o} mon={mon} khoi={khoi} lamMoi={lamMoi} dau={dau} />}
    </div>
  )
}
