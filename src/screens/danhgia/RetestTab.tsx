// Tab "Retest" của màn Xếp bổ trợ yếu (Thùy 23/09): theo dõi mọi bài retest tầng 2 — chờ làm · QUÁ HẠN · đã nộp (kết quả từng dạng).
// Retest KHÔNG xếp lịch (làm sau ET buổi thường, TA lớp đưa iPad) — tab này chỉ để NẮM và xử lý quá hạn: dời ngày sang buổi thường kế.
// Số liệu tổng hợp ở DB (`fn_btyeu_retest_theo_doi`, §2.0); ở đây render + lọc theo chip đang chọn.
import { useEffect, useMemo, useState } from 'react'
import { retestTheoDoi, retestDoiNgay, type RetestTheoDoi } from '../../lib/botro_yeu'
import { homNayVN, ddmmVN, thuCuaNgay } from '../../lib/tuan'

type Loc = 'cho' | 'qua_han' | 'da_nop' | 'tat_ca'
export default function RetestTab({ monF, khoiF }: { monF: string; khoiF: string }) {
  const [rows, setRows] = useState<RetestTheoDoi[]>([])
  const [loading, setLoading] = useState(true)
  const [loi, setLoi] = useState<string | null>(null)
  const [loc, setLoc] = useState<Loc>('cho')
  const [doi, setDoi] = useState<{ id: string; ngay: string } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const tai = () => retestTheoDoi().then((r) => { setRows(r); setLoi(null) }).catch((e: any) => setLoi(e?.message ?? String(e))).finally(() => setLoading(false))
  useEffect(() => { tai() }, [])

  const hien = useMemo(() => rows.filter((r) => (!monF || r.mon === monF) && (!khoiF || r.khoi === khoiF)), [rows, monF, khoiF])
  const dem = useMemo(() => ({
    cho: hien.filter((r) => !r.da_nop && !r.qua_han).length,
    qua_han: hien.filter((r) => r.qua_han).length,
    da_nop: hien.filter((r) => r.da_nop).length,
    tat_ca: hien.length,
  }), [hien])
  const ds = useMemo(() => hien.filter((r) => loc === 'tat_ca' ? true : loc === 'cho' ? !r.da_nop && !r.qua_han : loc === 'qua_han' ? r.qua_han : r.da_nop), [hien, loc])
  const nhom = useMemo(() => { const g = new Map<string, RetestTheoDoi[]>(); for (const r of ds) g.set(r.ngay, [...(g.get(r.ngay) ?? []), r]); return [...g.entries()] }, [ds])

  async function luuDoi() {
    if (!doi) return
    setBusy(doi.id); setLoi(null)
    try { await retestDoiNgay(doi.id, doi.ngay); setRows((prev) => prev.map((r) => r.bai_test_id === doi.id ? { ...r, ngay: doi.ngay, qua_han: false, tre_ngay: 0 } : r)); setDoi(null) }
    catch (e: any) { setLoi(e?.message ?? String(e)) } finally { setBusy(null) }
  }

  const CHIP: { k: Loc; ten: string; cls: string }[] = [
    { k: 'cho', ten: 'Chờ làm', cls: 'bg-indigo-600 text-white' }, { k: 'qua_han', ten: 'Quá hạn', cls: 'bg-rose-600 text-white' },
    { k: 'da_nop', ten: 'Đã nộp (14 ngày)', cls: 'bg-emerald-600 text-white' }, { k: 'tat_ca', ten: 'Tất cả', cls: 'bg-slate-700 text-white' },
  ]
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {CHIP.map((c) => <button key={c.k} onClick={() => setLoc(c.k)} className={`rounded-full px-3 py-1 text-[12px] font-bold ${loc === c.k ? c.cls : 'bg-slate-100 text-slate-600'}`}>{c.ten} {dem[c.k]}</button>)}
        </div>
        <span className="ml-auto text-[12px] text-slate-500">Retest làm sau ET buổi thường — TA lớp đưa iPad. Quá hạn ⇒ dời sang buổi thường kế.</span>
        <button onClick={tai} title="Tải lại" className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-500 hover:bg-slate-100">↻</button>
      </div>
      {loi && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">{loi}</p>}
      {loading ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Đang tải…</div>
        : ds.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-[13px] text-slate-400 ring-1 ring-slate-200">Không có bài retest nào{monF || khoiF ? ' (theo filter)' : ''}.</div>
        : nhom.map(([ngay, rs]) => (
          <div key={ngay} className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
            <h3 className="mb-2 text-[13px] font-bold text-slate-700">📝 {thuCuaNgay(ngay)} {ddmmVN(ngay)}{ngay === homNayVN() ? ' · hôm nay' : ''} <span className="font-normal text-slate-400">· {rs.length} bài</span></h3>
            <div className="space-y-2">
              {rs.map((r) => (
                <div key={r.bai_test_id} className={`rounded-xl border px-3 py-2 ${r.da_nop ? 'border-emerald-200 bg-emerald-50/40' : r.qua_han ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-slate-800">{r.ho_ten}</span>
                    <span className="text-[11.5px] text-slate-400">{r.ma_hs} · {r.lop ?? '?'} · {r.mon}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${r.da_nop ? 'bg-emerald-100 text-emerald-800' : r.qua_han ? 'bg-rose-600 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                      {r.da_nop ? `✓ Đã nộp · đúng ${r.so_dung}/${r.so_cau}` : r.qua_han ? `Quá hạn ${r.tre_ngay} ngày` : `Chờ làm · ${r.so_cau} câu`}
                    </span>
                    <span className="ml-auto text-[12px] text-slate-500">TA lớp: <b className="text-slate-700">{r.ta_lop ?? '?'}</b>{r.ca_ngay ? ` · ca bổ trợ ${ddmmVN(r.ca_ngay)}${r.ca_nguoi ? ` (${r.ca_nguoi})` : ''}` : ''}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {r.dang.map((d) => (
                      <span key={d.ma_dang} title={d.ma_dang} className={`rounded-md px-2 py-0.5 text-[11.5px] ring-1 ${d.dat === true ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : d.dat === false ? 'bg-rose-50 text-rose-800 ring-rose-200' : 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
                        {d.ten_dang}{r.da_nop ? ` ${d.so_dung}/${d.so_cau}` : ` · ${d.so_cau} câu`}{d.dat === true ? ' ✓ đạt' : d.dat === false ? ' ✗ trượt → dạy lại' : ''}
                      </span>
                    ))}
                    {!r.da_nop && (doi?.id === r.bai_test_id ? (
                      <span className="ml-auto flex items-center gap-1.5 text-[12px]">
                        <input type="date" value={doi.ngay} min={homNayVN()} onChange={(e) => setDoi({ id: r.bai_test_id, ngay: e.target.value })} className="rounded-md border border-slate-300 px-1.5 py-0.5" />
                        <button disabled={busy === r.bai_test_id} onClick={luuDoi} className="rounded-md bg-indigo-600 px-2 py-0.5 font-semibold text-white disabled:opacity-50">Lưu</button>
                        <button onClick={() => setDoi(null)} className="text-slate-500">Thôi</button>
                      </span>
                    ) : (
                      <button onClick={() => setDoi({ id: r.bai_test_id, ngay: r.qua_han ? homNayVN() : r.ngay })} className="ml-auto rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11.5px] font-semibold text-slate-600 hover:bg-slate-50">📅 Dời ngày</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
