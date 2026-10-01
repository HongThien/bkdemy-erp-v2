// Tab "Phủ MCQ" trong Bản đồ kiến thức (CEO yêu cầu 01/10) — quan sát độ phủ trắc nghiệm theo khối/dạng
// thay vì phải hỏi Claude chạy script tay. 3 tầng: bar theo khối → click 1 khối xổ bar theo dạng (thiếu
// nhiều lên đầu) → click 1 dạng mở panel liệt kê câu còn thiếu. Dữ liệu tổng hợp SẴN ở Postgres
// (fn_mcq_coverage_dang/fn_mcq_cau_thieu, mig 202610011506) — màn chỉ render, không group/cộng gì thêm.
import { useEffect, useMemo, useState } from 'react'
import { fetchMcqCoverage, fetchMcqCauThieu, type McqDangRow, type McqCauThieu } from '../../lib/kho/api'
import { pctColor } from './BanDo'
import { MathText } from './ui'

const NHANH_TABS: { key: 'dai' | 'hgt'; label: string }[] = [{ key: 'dai', label: 'Đại số' }, { key: 'hgt', label: 'Hình giải tích' }]
const pct = (co: number, tong: number) => (tong > 0 ? Math.round((co / tong) * 100) : null)

export default function McqCoverage() {
  const [nhanh, setNhanh] = useState<'dai' | 'hgt'>('dai')
  const [khoiRows, setKhoiRows] = useState<{ khoi: string; tong_tln: number; co_mcq: number }[]>([])
  const [dangRows, setDangRows] = useState<McqDangRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [openKhoi, setOpenKhoi] = useState<string | null>(null)
  const [openDang, setOpenDang] = useState<McqDangRow | null>(null)

  useEffect(() => {
    let cancel = false
    setLoading(true); setErr(null); setOpenKhoi(null); setOpenDang(null)
    fetchMcqCoverage(nhanh).then((r) => { if (!cancel) { setKhoiRows(r.khoi); setDangRows(r.dang) } })
      .catch((e) => { if (!cancel) setErr(e.message ?? String(e)) })
      .finally(() => { if (!cancel) setLoading(false) })
    return () => { cancel = true }
  }, [nhanh])

  const dangCuaKhoi = useMemo(() => {
    if (!openKhoi) return []
    return dangRows.filter((d) => d.khoi === openKhoi).sort((a, b) => (pct(a.co_mcq, a.tong_tln) ?? 101) - (pct(b.co_mcq, b.tong_tln) ?? 101))
  }, [dangRows, openKhoi])

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#fafafb] p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-900">Phủ MCQ</span>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {NHANH_TABS.map((t) => (
            <button key={t.key} onClick={() => setNhanh(t.key)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition ${nhanh === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="py-10 text-center text-sm text-slate-400">Đang tải…</div>
        : err ? <div className="py-10 text-center text-sm text-rose-600">Lỗi: {err}</div>
        : khoiRows.length === 0 ? <div className="py-10 text-center text-sm text-slate-400">Chưa có dữ liệu.</div>
        : (
          <div className="max-w-3xl space-y-1.5">
            {khoiRows.map((k) => {
              const p = pct(k.co_mcq, k.tong_tln)
              const open = openKhoi === k.khoi
              return (
                <div key={k.khoi}>
                  <BarRow label={`Khối ${k.khoi}`} co={k.co_mcq} tong={k.tong_tln} pct={p}
                    active={open} onClick={() => setOpenKhoi(open ? null : k.khoi)} />
                  {open && (
                    <div className="ml-6 mt-1.5 space-y-1 border-l-2 border-slate-200 pl-4">
                      {dangCuaKhoi.map((d) => (
                        <BarRow key={d.ma_dang} small label={`${d.ma_dang} — ${d.ten_dang}`}
                          co={d.co_mcq} tong={d.tong_tln} pct={pct(d.co_mcq, d.tong_tln)}
                          onClick={() => setOpenDang(d)} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      {openDang && <ChiTietDang nhanh={nhanh} dang={openDang} onClose={() => setOpenDang(null)} />}
    </div>
  )
}

function BarRow({ label, co, tong, pct, active, small, onClick }: {
  label: string; co: number; tong: number; pct: number | null; active?: boolean; small?: boolean; onClick: () => void
}) {
  const col = pctColor(pct)
  return (
    <button onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
        active ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}>
      <span className={`flex-shrink-0 ${small ? 'w-56 text-[12px]' : 'w-28 text-[13px] font-semibold'} truncate text-slate-700`}>{label}</span>
      <div className={`relative flex-1 overflow-hidden rounded-full bg-slate-100 ${small ? 'h-2' : 'h-3'}`}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct ?? 0}%`, backgroundColor: col }} />
      </div>
      <span className="w-20 flex-shrink-0 text-right text-[12px] font-bold" style={{ color: col }}>{pct == null ? '—' : `${pct}%`}</span>
      <span className="w-16 flex-shrink-0 text-right text-[11px] text-slate-400">{co}/{tong}</span>
    </button>
  )
}

function ChiTietDang({ nhanh, dang, onClose }: { nhanh: 'dai' | 'hgt'; dang: McqDangRow; onClose: () => void }) {
  const [rows, setRows] = useState<McqCauThieu[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    let cancel = false
    fetchMcqCauThieu(nhanh, dang.ma_dang).then((r) => { if (!cancel) setRows(r) }).catch((e) => { if (!cancel) setErr(e.message ?? String(e)) })
    return () => { cancel = true }
  }, [nhanh, dang.ma_dang])

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute inset-x-[12%] inset-y-10 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f5f7] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-3">
          <div>
            <div className="text-[15px] font-semibold text-slate-900">{dang.ma_dang} — {dang.ten_dang}</div>
            <div className="text-[12px] text-slate-500">Khối {dang.khoi} · còn thiếu {dang.tong_tln - dang.co_mcq}/{dang.tong_tln} câu</div>
          </div>
          <button onClick={onClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">✕</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {err ? <div className="text-sm text-rose-600">Lỗi: {err}</div>
            : rows == null ? <div className="text-sm text-slate-400">Đang tải…</div>
            : rows.length === 0 ? <div className="text-sm text-slate-400">Không còn câu nào thiếu (dữ liệu vừa đổi, bấm làm mới trang để cập nhật).</div>
            : (
              <div className="space-y-2">
                {rows.map((r) => (
                  <div key={r.ma_cau} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-mono">{r.ma_cau}</span>
                    </div>
                    <MathText className="text-[13px] text-slate-800">{r.noi_dung}</MathText>
                    {r.dap_an && <div className="mt-1.5 text-[12px] text-slate-500">Đáp số kho: <MathText className="inline">{r.dap_an}</MathText></div>}
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
