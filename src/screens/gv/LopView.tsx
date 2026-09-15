// LopView — tab "Lớp" app GV (PLAN-app-gv.md §1#4): thông tin chung lớp mình phụ trách.
// · ET / BTVN = lưới HS × buổi % đúng (fn_matrix_lop qua getClassMatrix) + cột TB per-HS.
// · Bản đồ = thanh đạt/cần/yếu per HS (fn_mastery_cells qua getMasteryRollup — "bộ nhớ iPhone").
// · MT = bảng THEO THÁNG per HS: điểm + rank khối nhỏ bên cạnh (fn_rank_diem_mt_lop, 1 call/tháng)
//   — KHÔNG có ô "MT trung bình lớp" (CEO 31/08 chốt ①: MT 1 tháng 1 lần, không trung bình).
// · Trước buổi (CEO 04/09) = TruocBuoiTab dùng chung ERP (compact), mở trên BUỔI ẢO: ngày = buổi kế
//   tiếp theo TKB (ngayBuoiHopLeCuaLop), ‹ › nhảy giữa các ngày hợp lệ — KHÔNG đẻ dòng buoi_hoc.
import { useEffect, useState } from 'react'
import { listHSCuaLop, type Lop } from '../../lib/nhansu'
import { getClassMatrix, getMasteryRollup, type ClassMatrix, type HSRollup, type MatrixPhase } from '../../lib/mastery'
import { rankDiemMTLop, type RankMTRow } from '../../lib/report'
import { ngayBuoiHopLeCuaLop } from '../../lib/gami'
import { homNayVN, ddmmVN, congNgay, thuCuaNgay } from '../../lib/tuan'
import TruocBuoiTab from '../gami/TruocBuoiTab'

export type LopSubKey = 'truocbuoi' | 'et' | 'btvn' | 'mt' | 'bando'
type SubKey = LopSubKey
const SUBS: { key: SubKey; label: string }[] = [
  { key: 'truocbuoi', label: 'Trước buổi' }, { key: 'et', label: 'ET' }, { key: 'btvn', label: 'BTVN' }, { key: 'mt', label: 'MT' }, { key: 'bando', label: 'Bản đồ' },
]
const pctCls = (p: number) => (p >= 80 ? 'text-emerald-600' : p >= 50 ? 'text-amber-600' : 'text-rose-600')

function ymCong(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + n, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

// `init` = mở thẳng 1 lớp + 1 sub (từ box "Trước buổi" trang chủ) — chỉ đọc lúc mount (GvHome đổi key để remount).
export default function LopView({ lops, init }: { lops: Lop[]; init?: { lopId: string; sub: SubKey } | null }) {
  const [lopId, setLopId] = useState<string | null>(init?.lopId ?? lops[0]?.id ?? null)
  const [sub, setSub] = useState<SubKey>(init?.sub ?? 'truocbuoi')
  const lop = lops.find((l) => l.id === lopId) ?? null
  if (!lops.length) return <p className="mx-auto max-w-[1000px] px-3 pt-4 text-center text-[13px] text-slate-400">Bạn chưa được phân công lớp nào (vai giáo viên).</p>
  return (
    <div className="mx-auto max-w-[1000px] px-3 pb-6 pt-3">
      <div className="flex flex-wrap gap-1.5">
        {lops.map((l) => (
          <button key={l.id} onClick={() => setLopId(l.id)}
            className={`min-h-[36px] rounded-full px-3.5 text-[13px] font-semibold transition ${l.id === lopId ? 'bg-green-600 text-white' : 'border border-slate-200 bg-white text-slate-600 active:bg-slate-100'}`}>
            {l.ten_lop}<span className="ml-1 font-normal opacity-60">{l.mon}</span>
          </button>
        ))}
      </div>
      <div className="mt-2.5 mb-3 flex gap-1.5">
        {SUBS.map((s) => (
          <button key={s.key} onClick={() => setSub(s.key)}
            className={`min-h-[36px] flex-auto whitespace-nowrap rounded-xl px-2 text-[12.5px] font-semibold ${sub === s.key ? 'bg-green-600 text-white' : 'border border-slate-200 bg-white text-slate-500'}`}>{s.label}</button>
        ))}
      </div>
      {lop && sub === 'truocbuoi' && <TruocBuoiLop key={lop.id} lop={lop} />}
      {lop && (sub === 'et' || sub === 'btvn') && <LuoiPhase key={lop.id + sub} lop={lop} phase={sub} />}
      {lop && sub === 'mt' && <MTThangLop key={lop.id} lop={lop} />}
      {lop && sub === 'bando' && <RollupLop key={lop.id} lop={lop} />}
    </div>
  )
}

// ── Trước buổi trên BUỔI ẢO: ngày mặc định = buổi kế tiếp theo TKB (≥ hôm nay), ‹ › nhảy giữa các ngày
// hợp lệ của lớp trong ±4 tuần. Báo cáo = tổng kết buổi TRƯỚC ngày đó + tháng của ngày đó (spec-truocbuoi). ──
function TruocBuoiLop({ lop }: { lop: Lop }) {
  const homNay = homNayVN()
  const [ngays, setNgays] = useState<string[] | null>(null)
  const [ngay, setNgay] = useState<string>(homNay)
  useEffect(() => {
    let live = true
    setNgays(null)
    ngayBuoiHopLeCuaLop(lop.id, congNgay(homNay, -28), congNgay(homNay, 28))
      .then((r) => { if (!live) return; const ds = r.map((x) => x.ngay); setNgays(ds); setNgay(ds.find((d) => d >= homNay) ?? ds[ds.length - 1] ?? homNay) })
      .catch(() => { if (live) setNgays([]) })
    return () => { live = false }
  }, [lop.id]) // eslint-disable-line
  if (!ngays) return <p className="text-[13px] text-slate-400">Đang tìm buổi theo TKB…</p>
  const idx = ngays.indexOf(ngay)
  const nhan = ngay === homNay ? 'hôm nay' : ngay > homNay ? 'buổi tới' : 'đã qua'
  return (
    <div>
      <div className="mb-2 flex items-center gap-1">
        <span className="text-[12px] text-slate-400">Trước buổi của lớp</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => idx > 0 && setNgay(ngays[idx - 1])} disabled={idx <= 0} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-slate-500 active:bg-slate-100 disabled:opacity-30">‹</button>
          <span className="text-[13px] font-semibold text-slate-700">{thuCuaNgay(ngay)} · {ddmmVN(ngay)} <span className={`font-medium ${ngay === homNay ? 'text-green-600' : 'text-slate-400'}`}>· {nhan}</span></span>
          <button onClick={() => idx >= 0 && idx < ngays.length - 1 && setNgay(ngays[idx + 1])} disabled={idx < 0 || idx >= ngays.length - 1} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-slate-500 active:bg-slate-100 disabled:opacity-30">›</button>
        </div>
      </div>
      {ngays.length === 0 && <p className="mb-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">Lớp chưa có TKB hiệu lực quanh hôm nay — đang xem theo ngày hôm nay.</p>}
      <TruocBuoiTab key={ngay} compact lopId={lop.id} ngayBuoi={ngay} mon={lop.mon} />
    </div>
  )
}

// ── Lưới HS × buổi cho 1 phase (tháng hiện tại, nav ‹›) + cột TB per-HS (mean ô done — như ERP) ──
function LuoiPhase({ lop, phase }: { lop: Lop; phase: MatrixPhase }) {
  const ymNay = homNayVN().slice(0, 7)
  const [ym, setYm] = useState(ymNay)
  const [mx, setMx] = useState<ClassMatrix | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setMx(null); setErr(null); getClassMatrix(lop.id, phase, ym).then(setMx).catch((e) => setErr(e.message ?? String(e))) }, [lop.id, phase, ym])
  return (
    <div>
      <div className="mb-2 flex items-center gap-1">
        <span className="text-[12px] text-slate-400">% câu đúng mỗi buổi đã đóng {phase.toUpperCase()}</span>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setYm(ymCong(ym, -1))} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-slate-500 active:bg-slate-100">‹</button>
          <span className="text-[13px] font-semibold text-slate-700">Tháng {ym.slice(5, 7)}/{ym.slice(0, 4)}</span>
          <button onClick={() => setYm(ymCong(ym, 1))} disabled={ym >= ymNay} className="rounded-lg px-2.5 py-1 text-[15px] font-bold text-slate-500 active:bg-slate-100 disabled:opacity-30">›</button>
        </div>
      </div>
      {err ? <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
        : !mx ? <p className="text-[13px] text-slate-400">Đang tải…</p>
        : mx.buois.length === 0 ? <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Tháng này chưa có buổi nào đóng {phase.toUpperCase()}.</p>
        : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-left text-[12px] font-semibold text-slate-600">Học sinh</th>
                {mx.buois.map((b) => <th key={b.id} className="min-w-[52px] border-b border-slate-200 px-1.5 py-2 text-center text-[11px] font-semibold text-slate-500">{ddmmVN(b.ngay)}</th>)}
                <th className="min-w-[52px] border-b border-l border-slate-200 bg-slate-50 px-1.5 py-2 text-center text-[11px] font-bold text-slate-600">TB</th>
              </tr>
            </thead>
            <tbody>
              {mx.students.map((s) => {
                const pcts = mx.buois.map((b) => mx.cells[s.id + ':' + b.id]).filter((c) => c?.status === 'done' && c.pct != null).map((c) => c!.pct!)
                const tb = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null
                return (
                  <tr key={s.id}>
                    <td className="sticky left-0 z-10 whitespace-nowrap border-b border-r border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-800">{s.ho_ten}</td>
                    {mx.buois.map((b) => {
                      const c = mx.cells[s.id + ':' + b.id]
                      return (
                        <td key={b.id} className="border-b border-slate-200 px-1 py-1.5 text-center text-[12px] font-semibold">
                          {c?.status === 'done' && c.pct != null ? <span className={pctCls(c.pct)}>{c.pct}</span>
                            : c?.status === 'khong_lam' ? <span className="rounded bg-rose-50 px-1 text-[10px] font-bold text-rose-500">KL</span>
                            : c?.status === 'vang' ? <span className="text-[10.5px] text-slate-400">V</span>
                            : <span className="text-slate-200">·</span>}
                        </td>
                      )
                    })}
                    <td className="border-b border-l border-slate-200 px-1 py-1.5 text-center text-[12.5px] font-bold">{tb == null ? <span className="text-slate-200">·</span> : <span className={pctCls(tb)}>{tb}</span>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-1.5 px-1 text-[10.5px] text-slate-400">KL = không làm · V = vắng · TB = trung bình các buổi có dữ liệu.</p>
    </div>
  )
}

// ── MT theo THÁNG cả lớp: cột = 4 tháng gần nhất, ô = điểm + (#rank khối) nhỏ ──
function MTThangLop({ lop }: { lop: Lop }) {
  const ymNay = homNayVN().slice(0, 7)
  const yms = [-3, -2, -1, 0].map((n) => ymCong(ymNay, n))
  const [data, setData] = useState<Map<string, Map<string, RankMTRow>> | null>(null) // ym → hsId → row
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { (async () => {
    setData(null); setErr(null)
    try {
      const out = new Map<string, Map<string, RankMTRow>>()
      await Promise.all(yms.map(async (ym) => { out.set(ym, await rankDiemMTLop(lop.id, lop.mon, ym)) }))
      setData(out)
      const rows = await listHSCuaLop(lop.id)
      const nm = new Map<string, string>()
      for (const r of rows as any[]) if (r.hoc_sinh?.id) nm.set(r.hoc_sinh.id, r.hoc_sinh.ho_ten)
      setNames(nm)
    } catch (e: any) { setErr(e.message ?? String(e)) }
  })() }, [lop.id]) // eslint-disable-line
  if (err) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
  if (!data) return <p className="text-[13px] text-slate-400">Đang tải MT…</p>
  const hsIds = [...new Set(yms.flatMap((ym) => [...(data.get(ym)?.keys() ?? [])]))]
    .sort((a, b) => (names.get(a) ?? '').localeCompare(names.get(b) ?? '', 'vi'))
  if (!hsIds.length) return <p className="rounded-2xl border border-slate-200/70 bg-white p-4 text-center text-[13px] text-slate-400">Chưa có dữ liệu MT.</p>
  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="sticky left-0 z-20 border-b border-r border-slate-200 bg-slate-50 px-3 py-2 text-left text-[12px] font-semibold text-slate-600">Học sinh</th>
              {yms.map((ym) => <th key={ym} className="min-w-[86px] border-b border-slate-200 px-1.5 py-2 text-center text-[11px] font-semibold text-slate-500">T{ym.slice(5, 7)}/{ym.slice(0, 4)}</th>)}
            </tr>
          </thead>
          <tbody>
            {hsIds.map((hsId) => (
              <tr key={hsId}>
                <td className="sticky left-0 z-10 whitespace-nowrap border-b border-r border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-800">{names.get(hsId) ?? '?'}</td>
                {yms.map((ym) => {
                  const r = data.get(ym)?.get(hsId)
                  return (
                    <td key={ym} className="border-b border-slate-200 px-1.5 py-1.5 text-center">
                      {r?.tb == null ? <span className="text-slate-200">·</span> : (
                        <span className="inline-flex items-baseline gap-1">
                          <span className={`text-[13px] font-bold ${r.tb >= 8 ? 'text-emerald-600' : r.tb >= 6.5 ? 'text-amber-600' : 'text-rose-600'}`}>{r.tb}</span>
                          <span className="text-[9.5px] font-semibold text-slate-400">#{r.rankNow}/{r.rankTotal}</span>
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 px-1 text-[10.5px] text-slate-400">MT 1 tháng 1 lần (cửa sổ 25 → mùng 10 tháng sau) · #rank = hạng trong KHỐI cùng môn · "·" = chưa thi.</p>
    </div>
  )
}

// ── Bản đồ kiến thức lớp: mỗi HS 1 thanh 100% đạt/cần/yếu (khuôn "bộ nhớ iPhone" ERP view ③) ──
function RollupLop({ lop }: { lop: Lop }) {
  const [rows, setRows] = useState<HSRollup[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { setRows(null); setErr(null); getMasteryRollup({ mon: lop.mon, lopId: lop.id }).then(setRows).catch((e) => setErr(e.message ?? String(e))) }, [lop.id, lop.mon])
  if (err) return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700">⚠ {err}</p>
  if (!rows) return <p className="text-[13px] text-slate-400">Đang tính mastery cả lớp…</p>
  const sorted = [...rows].sort((a, b) => {
    const ra = a.total ? (a.yeu + 0.5 * a.can_luyen) / a.total : -1
    const rb = b.total ? (b.yeu + 0.5 * b.can_luyen) / b.total : -1
    return rb - ra || a.ho_ten.localeCompare(b.ho_ten, 'vi')
  })
  return (
    <div className="flex flex-col gap-1.5">
      <p className="px-1 text-[11.5px] text-slate-400">Mỗi HS: phân bố dạng <span className="font-semibold text-emerald-600">đạt</span> / <span className="font-semibold text-amber-600">cần luyện</span> / <span className="font-semibold text-rose-600">yếu</span> (chỉ dạng ĐÃ ĐO) — HS nhiều yếu lên đầu.</p>
      {sorted.map((r) => (
        <div key={r.hoc_sinh_id} className="rounded-2xl border border-slate-200/70 bg-white px-3 py-2 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold text-slate-800">{r.ho_ten}</span>
            <span className="text-[10.5px] text-slate-400">{r.total} dạng đã đo</span>
          </div>
          {r.total === 0 ? <div className="h-3 rounded-full bg-slate-100" /> : (
            <div className="flex h-3 overflow-hidden rounded-full">
              <span className="bg-emerald-500" style={{ width: `${(r.dat / r.total) * 100}%` }} />
              <span className="bg-amber-400" style={{ width: `${(r.can_luyen / r.total) * 100}%` }} />
              <span className="bg-rose-500" style={{ width: `${(r.yeu / r.total) * 100}%` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
