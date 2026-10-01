// Theo dõi bài tập trên app HS — bảng ngày × HS (CEO 17/09).
// Dùng chung cho Thùy (không truyền `lopIds` → mọi HS caller được xem) và GV
// (truyền `lopIds` = lớp phụ trách). Scope loại đã đóng ở RPC: tự luyện · bổ trợ · retest.
// Bảng: cột = ngày (mới → cũ), hàng = HS. Cell hiện: số câu · %đúng. Màu:
//   0 câu → xám nhạt · <50% đúng → đỏ · 50–75% → hổ phách · ≥75% → xanh.
// Header hàng đầu: tổng theo ngày (mấy HS làm, tổng câu). Cột cuối: tổng theo HS.
// Không tính toán nghiệp vụ ở TS — chỉ group + format.
import { useEffect, useMemo, useState } from 'react'
import {
  fetchBangLamBai, groupByHS, dayRangeDesc, homNayVNStr, truNgay,
  type HocSinhRow,
} from '../../lib/theodoiapp'
import { listLop, type Lop } from '../../lib/nhansu'
import { KHOI_OPTIONS } from '../../lib/kho/api'

type Phamvi = 7 | 14 | 30

const PHAM_VI: { key: Phamvi; ten: string }[] = [
  { key: 7, ten: '7 ngày' }, { key: 14, ten: '14 ngày' }, { key: 30, ten: '30 ngày' },
]

// dd/MM cho header cột — Thùy quen dạng này.
function ddMM(ngay: string): string {
  const [_y, m, d] = ngay.split('-')
  return `${d}/${m}`
}

// Tone màu cell theo tỉ lệ đúng — bảng phẳng, Tailwind literal (§React CLAUDE.md).
function toneCell(soCau: number, soDung: number): string {
  if (soCau <= 0) return 'bg-slate-50 text-slate-300'
  const p = soDung / soCau
  if (p < 0.5) return 'bg-rose-50 text-rose-700'
  if (p < 0.75) return 'bg-amber-50 text-amber-700'
  return 'bg-emerald-50 text-emerald-700'
}

function pct(so: number, tong: number): string {
  if (tong <= 0) return '—'
  return `${Math.round((so / tong) * 100)}%`
}

export default function BangLamBaiScreen({ lopIds }: { lopIds?: string[] }) {
  const [phamvi, setPhamvi] = useState<Phamvi>(14)
  const [den] = useState<string>(() => homNayVNStr())
  const tu = useMemo(() => truNgay(den, phamvi - 1), [den, phamvi])
  const days = useMemo(() => dayRangeDesc(tu, den), [tu, den])

  const [lopList, setLopList] = useState<Lop[]>([])
  const [lopFilter, setLopFilter] = useState<string>('') // '' = tất cả lớp caller được xem
  const [khoiFilter, setKhoiFilter] = useState<string>('') // '' = tất cả khối; lọc client-side
  const [rows, setRows] = useState<HocSinhRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string>('')

  const laGv = !!lopIds && lopIds.length > 0

  useEffect(() => {
    // Thùy → load list lớp toàn hệ để filter. GV → dùng lớp phụ trách, KHÔNG cần list toàn hệ.
    if (laGv) return
    listLop().then(setLopList).catch(() => setLopList([]))
  }, [laGv])

  useEffect(() => {
    setLoading(true); setErr('')
    const effLopIds = laGv
      ? lopIds
      : (lopFilter ? [lopFilter] : null)
    fetchBangLamBai(tu, den, effLopIds ?? null)
      .then((raws) => {
        const g = groupByHS(raws)
        // Thùy: sort theo tên lớp rồi tên HS (ổn định khi rescan). GV chỉ 1-vài lớp cùng chung sort.
        g.sort((a, b) => a.ten_lop.localeCompare(b.ten_lop, 'vi') || a.ho_ten.localeCompare(b.ho_ten, 'vi'))
        setRows(g)
      })
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [tu, den, lopFilter, laGv, lopIds])

  // Khối hiện có trong data (giữ thứ tự chuẩn KHOI_OPTIONS) — filter chỉ hiện khối có HS thật.
  const khoiCoTrongData = useMemo(() => {
    const has = new Set(rows.map((r) => r.khoi).filter((k): k is string => !!k))
    return KHOI_OPTIONS.filter((k) => has.has(k))
  }, [rows])

  // Áp filter khối ở client (RPC đã trả cả rows, khoi là nhãn HS — lọc trong bộ nhớ đủ nhanh).
  const rowsShow = useMemo(
    () => (khoiFilter ? rows.filter((r) => r.khoi === khoiFilter) : rows),
    [rows, khoiFilter],
  )

  // Tổng cột (per ngày): mấy HS làm, tổng câu, % đúng.
  const tongCot = useMemo(() => {
    const out: Record<string, { hs_lam: number; so_cau: number; so_dung: number }> = {}
    for (const d of days) out[d] = { hs_lam: 0, so_cau: 0, so_dung: 0 }
    for (const r of rowsShow) {
      for (const d of days) {
        const c = r.cells[d]
        if (c && c.so_cau > 0) {
          out[d].hs_lam += 1
          out[d].so_cau += c.so_cau
          out[d].so_dung += c.so_dung
        }
      }
    }
    return out
  }, [rowsShow, days])

  const soHsCoLam = rowsShow.filter((r) => r.tong_cau > 0).length

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#f5f5f7]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <div className="text-[15px] font-semibold text-slate-800">Theo dõi bài tập trên app</div>
        <div className="text-xs text-slate-500">Tự luyện · Bổ trợ · Retest — làm ngoài lớp</div>
        <div className="ml-auto flex items-center gap-1">
          {PHAM_VI.map((p) => (
            <button key={p.key} onClick={() => setPhamvi(p.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${phamvi === p.key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {p.ten}
            </button>
          ))}
        </div>
        <select
          value={khoiFilter} onChange={(e) => setKhoiFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
        >
          <option value="">Tất cả khối</option>
          {khoiCoTrongData.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        {!laGv && (
          <select
            value={lopFilter} onChange={(e) => setLopFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
          >
            <option value="">Tất cả lớp</option>
            {lopList
              .filter((l) => !khoiFilter || l.khoi === khoiFilter)
              .map((l) => <option key={l.id} value={l.id}>{l.ten_lop}</option>)}
          </select>
        )}
      </div>

      {err && <div className="border-b border-rose-200 bg-rose-50 px-6 py-2 text-sm text-rose-700">Lỗi: {err}</div>}

      <div className="min-h-0 flex-1 overflow-auto">
        {loading ? (
          <div className="p-8 text-sm text-slate-400">Đang tải…</div>
        ) : rowsShow.length === 0 ? (
          <div className="p-8 text-sm text-slate-400">Không có HS {khoiFilter ? `khối ${khoiFilter} ` : ''}trong phạm vi.</div>
        ) : (
          <div className="min-w-max">
            <table className="border-separate" style={{ borderSpacing: 0 }}>
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <th className="sticky left-0 z-20 border-b border-slate-200 bg-white px-3 py-2 text-left">Học sinh</th>
                  <th className="border-b border-slate-200 bg-white px-3 py-2 text-left">Lớp</th>
                  <th className="border-b border-slate-200 bg-white px-2 py-2 text-right">Tổng câu</th>
                  <th className="border-b border-slate-200 bg-white px-2 py-2 text-right">% đúng</th>
                  <th className="border-b border-slate-200 bg-white px-2 py-2 text-right">Ngày làm</th>
                  {days.map((d) => (
                    <th key={d} className="border-b border-slate-200 bg-white px-2 py-2 text-center">
                      <div>{ddMM(d)}</div>
                      <div className="text-[10px] font-normal text-slate-400">
                        {tongCot[d].hs_lam > 0 ? `${tongCot[d].hs_lam} hs · ${tongCot[d].so_cau}c` : '—'}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowsShow.map((r) => (
                  <tr key={r.hoc_sinh_id} className="text-sm">
                    <td className="sticky left-0 z-10 border-b border-slate-100 bg-white px-3 py-2 font-medium text-slate-800">
                      {r.ho_ten}
                      {r.ma_hs && <span className="ml-2 text-[10px] text-slate-400">{r.ma_hs}</span>}
                    </td>
                    <td className="border-b border-slate-100 bg-white px-3 py-2 text-slate-500">{r.ten_lop}</td>
                    <td className="border-b border-slate-100 bg-white px-2 py-2 text-right font-semibold text-slate-800">{r.tong_cau}</td>
                    <td className="border-b border-slate-100 bg-white px-2 py-2 text-right text-slate-700">{pct(r.tong_dung, r.tong_cau)}</td>
                    <td className="border-b border-slate-100 bg-white px-2 py-2 text-right text-slate-500">{r.so_ngay_lam}/{days.length}</td>
                    {days.map((d) => {
                      const c = r.cells[d]
                      const sc = c?.so_cau ?? 0
                      const sd = c?.so_dung ?? 0
                      return (
                        <td key={d} className={`border-b border-slate-100 px-2 py-2 text-center ${toneCell(sc, sd)}`}>
                          {sc > 0 ? (
                            <div className="leading-tight">
                              <div className="text-[13px] font-semibold">{sc}</div>
                              <div className="text-[10px]">{pct(sd, sc)}</div>
                            </div>
                          ) : (
                            <span className="text-[11px]">·</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="text-[11px] font-semibold text-slate-600">
                  <td className="sticky left-0 z-10 bg-slate-50 px-3 py-2">Tổng ({soHsCoLam}/{rowsShow.length} HS có làm)</td>
                  <td className="bg-slate-50 px-3 py-2"></td>
                  <td className="bg-slate-50 px-2 py-2 text-right">
                    {rowsShow.reduce((s, r) => s + r.tong_cau, 0)}
                  </td>
                  <td className="bg-slate-50 px-2 py-2 text-right">
                    {pct(rowsShow.reduce((s, r) => s + r.tong_dung, 0), rowsShow.reduce((s, r) => s + r.tong_cau, 0))}
                  </td>
                  <td className="bg-slate-50 px-2 py-2"></td>
                  {days.map((d) => (
                    <td key={d} className="bg-slate-50 px-2 py-2 text-center">
                      <div className="text-[11px] font-bold text-slate-700">{tongCot[d].so_cau || '—'}</div>
                      <div className="text-[10px] text-slate-500">{pct(tongCot[d].so_dung, tongCot[d].so_cau)}</div>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
