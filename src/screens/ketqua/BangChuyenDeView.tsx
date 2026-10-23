// KẾT QUẢ THEO CHUYÊN ĐỀ của 1 kỳ thi (MT / khảo sát) — Thùy 23/10. Kết quả học tập › Điểm thi.
// Chọn môn → đề (gốc, mọi lớp đã gán) → bảng: Tên · Lớp · mỗi chuyên đề 1 cột (% đạt = điểm đạt / điểm tối đa các câu
// thuộc chuyên đề) · Điểm (MT/khảo sát) · Xếp hạng (trên cả đề). Mọi con số từ DB (fn_mt_bang_chuyen_de); client chỉ
// lọc lớp + sắp xếp theo cột đang bấm (§2.0). Giai đoạn chuyển giao: CHUYÊN ĐỀ CŨ; xong bản đồ mới đổi nguồn ở hàm DB.
import { useEffect, useState } from 'react'
import { dsDeDaThi, bangChuyenDe, type DeDaThi, type BangCD, type BangCDHS } from '../../lib/chamMT'

const MON = ['Toán', 'KHTN']
// Bề rộng cột (px): chuyên đề tối thiểu COT_MIN rồi giãn đều theo màn; các cột còn lại cố định.
const COT_TEN = 190, COT_LOP = 60, COT_DIEM = 64, COT_HANG = 64, COT_MIN = 92
// Rời tab quay lại = đúng chỗ cũ (CLAUDE §React).
type Cap = 'chuyen_de' | 'chu_de'
const NHO: { mon: string; deId: string | null; lopId: string | null; cap: Cap; sap: { cot: string; tang: boolean } } = { mon: 'Toán', deId: null, lopId: null, cap: 'chuyen_de', sap: { cot: 'hang', tang: true } }

const mauPct = (p: number | undefined) => p == null ? 'bg-slate-50 text-slate-300'
  : p >= 80 ? 'bg-emerald-100 text-emerald-800' : p >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
const nhanLoai = (v: string | null) => v === 'khao_sat_giua_thang' ? 'Khảo sát' : v === 'khao_sat_thang' ? 'MT' : v === 'test_dau_vao' ? 'Test đầu vào' : v === 'thi_thu' ? 'Thi thử' : v === 'luyen' ? 'Luyện' : 'MT'

export default function BangChuyenDeView() {
  const [mon, setMon] = useState(NHO.mon)
  const [des, setDes] = useState<DeDaThi[]>([])
  const [deId, setDeId] = useState<string | null>(NHO.deId)
  const [bang, setBang] = useState<BangCD | null>(null)
  const [lopId, setLopId] = useState<string | null>(NHO.lopId)
  const [sap, setSap] = useState(NHO.sap)
  const [cap, setCap] = useState<Cap>(NHO.cap)
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  useEffect(() => { Object.assign(NHO, { mon, deId, lopId, sap, cap }) }, [mon, deId, lopId, sap, cap])

  useEffect(() => {
    let alive = true
    setDes([])
    dsDeDaThi(mon).then((ds) => {
      if (!alive) return
      setDes(ds)
      if (!ds.some((d) => d.de_id === NHO.deId)) { setDeId(ds[0]?.de_id ?? null); setLopId(null) }
    }).catch((e) => alive && setLoi('Không tải được danh sách đề: ' + (e?.message ?? e)))
    return () => { alive = false }
  }, [mon])

  useEffect(() => {
    setBang(null); setLoi(null)
    if (!deId) return
    let alive = true
    setDangTai(true)
    bangChuyenDe(deId, cap).then((b) => { if (alive) setBang(b) })
      .catch((e) => alive && setLoi('Không tải được bảng: ' + (e?.message ?? e)))
      .finally(() => alive && setDangTai(false))
    return () => { alive = false }
  }, [deId, cap])

  const lops = bang ? [...new Map(bang.hs.map((h) => [h.lop_id, h.lop])).entries()].sort((a, b) => a[1].localeCompare(b[1], 'vi', { numeric: true })) : []
  const hien = (bang?.hs ?? []).filter((h) => !lopId || h.lop_id === lopId)
  const giaTri = (h: BangCDHS, cot: string): number | string | null =>
    cot === 'ten' ? h.ten : cot === 'lop' ? h.lop : cot === 'diem' ? h.diem : cot === 'hang' ? h.hang : (h.o[cot] ?? null)
  const sapXep = [...hien].sort((a, b) => {
    const x = giaTri(a, sap.cot), y = giaTri(b, sap.cot)
    if (x == null && y == null) return a.ten.localeCompare(b.ten, 'vi')
    if (x == null) return 1
    if (y == null) return -1
    const s = typeof x === 'string' ? x.localeCompare(String(y), 'vi', { numeric: true }) : (x as number) - (y as number)
    return sap.tang ? s : -s
  })
  // Bấm cột: cột số (chuyên đề, điểm) mặc định cao → thấp; hạng/tên/lớp mặc định tăng dần.
  const bamCot = (cot: string) => setSap((s) => s.cot === cot ? { cot, tang: !s.tang } : { cot, tang: ['ten', 'lop', 'hang'].includes(cot) })
  const muiTen = (cot: string) => sap.cot === cot ? (sap.tang ? ' ▲' : ' ▼') : ''
  const de = des.find((d) => d.de_id === deId) ?? null
  const th = 'sticky top-0 z-10 cursor-pointer select-none border-b border-slate-200 bg-slate-50 px-2 py-2 text-[11px] font-semibold text-slate-600 hover:bg-slate-100'

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {MON.map((m) => <button key={m} onClick={() => setMon(m)} className={`h-7 rounded-md px-3 text-[13px] font-semibold ${mon === m ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{m}</button>)}
        <select value={deId ?? ''} onChange={(e) => { setDeId(e.target.value || null); setLopId(null) }} className="h-8 min-w-[360px] rounded border border-slate-300 bg-white px-2 text-[13px]">
          {des.length === 0 && <option value="">Chưa có đề nào đã chấm</option>}
          {des.map((d) => <option key={d.de_id} value={d.de_id}>{d.ten} · {nhanLoai(d.loai_de)}{d.khoi ? ` · K${d.khoi}` : ''} · {d.so_lop} lớp · {d.ngay_moi.split('-').reverse().slice(0, 2).join('/')}</option>)}
        </select>
        <div className="flex overflow-hidden rounded-md ring-1 ring-slate-200">
          {([['chuyen_de', 'Chuyên đề'], ['chu_de', 'Chủ đề']] as [Cap, string][]).map(([v, l]) => (
            <button key={v} onClick={() => { setCap(v); if (sap.cot !== 'ten' && sap.cot !== 'lop' && sap.cot !== 'diem' && sap.cot !== 'hang') setSap({ cot: 'hang', tang: true }) }}
              className={`h-8 px-3 text-[12.5px] font-semibold ${cap === v ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}>{l}</button>
          ))}
        </div>
        {bang && <span className="text-[12px] text-slate-500">{bang.hs.length} HS đã chấm · {bang.so_co_diem} có điểm tổng · {bang.cot.length} {cap === 'chu_de' ? 'chủ đề' : 'chuyên đề'}</span>}
      </div>
      {lops.length > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Lớp</span>
          <button onClick={() => setLopId(null)} className={`h-7 rounded-md px-3 text-[12px] font-semibold ${!lopId ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>Cả đề</button>
          {lops.map(([id, ten]) => <button key={id} onClick={() => setLopId(id)} className={`h-7 rounded-md px-3 text-[12px] font-semibold ${lopId === id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>{ten}</button>)}
        </div>
      )}
      {loi && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-700">{loi}</div>}
      {dangTai ? <p className="text-sm text-slate-500">Đang tính bảng…</p>
        : !bang ? null
        : bang.hs.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-500">Đề này chưa có HS nào được chấm.</div>
        : (
          <>
            <div className="max-h-[calc(100vh-280px)] overflow-auto rounded-xl border border-slate-200 bg-white">
              {/* 23/10 (Thùy): bảng GIÃN theo màn — cột chuyên đề chia đều phần rộng còn lại, tối thiểu COT_MIN; Tên/Lớp/Điểm/Hạng
                  cố định. Màn hẹp hơn tổng tối thiểu ⇒ bảng giữ tối thiểu và cuộn ngang (table-fixed + minWidth). */}
              <table className="w-full table-fixed border-separate border-spacing-0 text-[12.5px]" style={{ minWidth: COT_TEN + COT_LOP + COT_DIEM + COT_HANG + bang.cot.length * COT_MIN }}>
                <colgroup>
                  <col style={{ width: COT_TEN }} /><col style={{ width: COT_LOP }} />
                  {bang.cot.map((c) => <col key={c.ma} />)}
                  <col style={{ width: COT_DIEM }} /><col style={{ width: COT_HANG }} />
                </colgroup>
                <thead>
                  <tr>
                    <th onClick={() => bamCot('ten')} className={`${th} sticky left-0 z-20 text-left`}>Tên{muiTen('ten')}</th>
                    <th onClick={() => bamCot('lop')} className={`${th} text-left`}>Lớp{muiTen('lop')}</th>
                    {bang.cot.map((c) => (
                      <th key={c.ma} onClick={() => bamCot(c.ma)} title={`${c.ten} (${c.ma})`} className={`${th} align-bottom`}>
                        <div className="line-clamp-3 text-center leading-tight">{c.ten}{muiTen(c.ma)}</div>
                      </th>
                    ))}
                    <th onClick={() => bamCot('diem')} className={`${th} text-center`}>Điểm{muiTen('diem')}</th>
                    <th onClick={() => bamCot('hang')} className={`${th} text-center`}>Hạng{muiTen('hang')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sapXep.map((h) => (
                    <tr key={h.id} className="hover:bg-indigo-50/30">
                      <td title={h.ten} className="sticky left-0 z-[5] truncate border-b border-slate-100 bg-white px-2 py-1 font-medium text-slate-800">{h.ten}</td>
                      <td className="truncate border-b border-slate-100 px-2 py-1 text-slate-600">{h.lop}</td>
                      {bang.cot.map((c) => (
                        <td key={c.ma} className="border-b border-slate-100 px-1 py-0.5 text-center">
                          <span className={`inline-block w-full rounded px-1 py-0.5 font-semibold tabular-nums ${mauPct(h.o[c.ma])}`}>{h.o[c.ma] == null ? '—' : `${h.o[c.ma]}%`}</span>
                        </td>
                      ))}
                      <td className="border-b border-slate-100 px-2 py-1 text-center font-mono font-semibold text-slate-800">{h.diem == null ? <span className="text-slate-300">—</span> : h.diem}</td>
                      <td className="border-b border-slate-100 px-2 py-1 text-center font-semibold text-indigo-700">{h.hang == null ? <span className="text-slate-300">—</span> : `#${h.hang}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400">
              {de ? `${de.ten} · ` : ''}% đạt = điểm đạt / điểm tối đa các câu thuộc {cap === 'chu_de' ? 'chủ đề' : 'chuyên đề'} (câu chưa chấm hoặc câu C chưa chọn điểm chưa tính; ý Hình của đề chỉ đặt điểm cả bài tính theo cả bài).
              Xếp hạng trên cả đề (mọi lớp), lọc lớp chỉ để xem. {cap === 'chu_de' ? 'Chủ đề theo bản đồ cũ — Hình học chưa có chủ đề cũ: lấy chủ đề mới nếu đã gắn, chưa gắn gom "Hình học".' : 'Chuyên đề theo bản đồ cũ — bài Hình mô hình gom theo mô hình.'}
            </p>
          </>
        )}
    </div>
  )
}
