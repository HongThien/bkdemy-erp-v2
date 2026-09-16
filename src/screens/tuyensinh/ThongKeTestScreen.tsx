// Tab THỐNG KÊ test đầu vào (CEO 15/09): số lượng ca theo khối (hoặc theo tháng khi đã chọn khối), lọc môn ·
// tháng · khối. Mọi con số do Postgres đếm (`fn_test_dau_vao_thong_ke`, §2.0) — màn này chỉ gọi + render.
import { useEffect, useState } from 'react'
import { MON_OPTIONS } from '../../lib/tuyensinh'
import { KHOI_OPTIONS } from '../../lib/kho/api'
import { getThongKeTestDauVao, dsThangGanDay, nhanThang, type ThongKeTestRow } from '../../lib/detest'

const NHO: { mon: string | null; thang: string | null | undefined; khoi: string | null | undefined } = { mon: null, thang: undefined, khoi: undefined }
const THANGS = dsThangGanDay(12)

const COT: { k: keyof ThongKeTestRow; lbl: string; tone?: string }[] = [
  { k: 'tong', lbl: 'Tổng ca', tone: 'font-bold text-slate-800' },
  { k: 'dangTest', lbl: 'Đang test' },
  { k: 'hoanThanh', lbl: 'Đã điểm danh' },
  { k: 'choCham', lbl: 'Chờ chấm', tone: 'text-amber-700' },
  { k: 'daCham', lbl: 'Đã chấm' },
  { k: 'choTra', lbl: 'Chờ trả bài', tone: 'text-amber-700' },
  { k: 'daTra', lbl: 'Đã trả bài', tone: 'text-emerald-700' },
  { k: 'daVaoLop', lbl: 'Đã vào lớp', tone: 'text-indigo-700 font-semibold' },
]

export default function ThongKeTestScreen() {
  const [mon, setMon] = useState<string>(NHO.mon ?? MON_OPTIONS[0])
  const [thang, setThang] = useState<string | null>(NHO.thang === undefined ? THANGS[0] : NHO.thang)
  const [khoi, setKhoi] = useState<string | null>(NHO.khoi === undefined ? null : NHO.khoi)
  const [rows, setRows] = useState<ThongKeTestRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { NHO.mon = mon; NHO.thang = thang; NHO.khoi = khoi }, [mon, thang, khoi])

  useEffect(() => {
    let alive = true
    setLoading(true); setErr(null)
    getThongKeTestDauVao(mon, thang, khoi)
      .then((r) => alive && setRows(r))
      .catch((e) => alive && setErr(e.message ?? String(e)))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [mon, thang, khoi])

  const body = rows.filter((r) => r.nhom !== 'Tổng')
  const tong = rows.find((r) => r.nhom === 'Tổng')
  const nhanNhom = khoi ? 'Tháng' : 'Khối'

  return (
    <div className="h-full overflow-auto">
    <div className="mx-auto max-w-[1000px] p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-slate-800">Thống kê test đầu vào</h2>
          <p className="text-[12px] text-slate-400">Số ca theo {khoi ? 'từng tháng của khối đã chọn' : 'từng khối'}. Ngày tính theo ngày test. "Đã vào lớp" = ứng viên đã chuyển thành học sinh.</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-full bg-slate-100 p-0.5">
          {MON_OPTIONS.map((m) => (
            <button key={m} onClick={() => setMon(m)} className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${mon === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{m}</button>
          ))}
        </div>
        <select value={thang ?? ''} onChange={(e) => setThang(e.target.value || null)} className="min-h-[36px] rounded-lg border border-slate-200 bg-white px-2.5 text-[13px]">
          <option value="">Mọi tháng</option>
          {THANGS.map((t) => <option key={t} value={t}>Tháng {nhanThang(t)}</option>)}
        </select>
        <select value={khoi ?? ''} onChange={(e) => setKhoi(e.target.value || null)} className="min-h-[36px] rounded-lg border border-slate-200 bg-white px-2.5 text-[13px]">
          <option value="">Mọi khối</option>
          {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        {tong && <span className="ml-auto text-[13px] text-slate-500">Tổng <b className="text-slate-800">{tong.tong}</b> ca · đã trả bài <b className="text-emerald-700">{tong.daTra}</b> · đã vào lớp <b className="text-indigo-700">{tong.daVaoLop}</b></span>}
      </div>

      {err && <p className="mb-2 text-[12px] text-rose-600">{err}</p>}
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : body.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-14 text-center text-sm text-slate-400">Không có ca test nào khớp bộ lọc.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-[12px] text-slate-500">
                <th className="px-3 py-2 font-medium">{nhanNhom}</th>
                {COT.map((c) => <th key={c.k} className="px-3 py-2 text-right font-medium">{c.lbl}</th>)}
              </tr>
            </thead>
            <tbody>
              {body.map((r) => (
                <tr key={r.nhom} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-3 py-2 font-semibold text-slate-700">{khoi ? nhanThang(r.nhom) : `Khối ${r.nhom}`}</td>
                  {COT.map((c) => <td key={c.k} className={`px-3 py-2 text-right tabular-nums ${r[c.k] === 0 ? 'text-slate-300' : c.tone ?? 'text-slate-700'}`}>{r[c.k]}</td>)}
                </tr>
              ))}
              {tong && (
                <tr className="bg-slate-50 font-semibold">
                  <td className="px-3 py-2 text-slate-800">Tổng</td>
                  {COT.map((c) => <td key={c.k} className={`px-3 py-2 text-right tabular-nums ${c.tone ?? 'text-slate-800'}`}>{tong[c.k]}</td>)}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  )
}
