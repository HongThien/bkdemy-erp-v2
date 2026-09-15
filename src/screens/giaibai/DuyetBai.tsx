// Tab DUYỆT — chỉ ghế học thuật của môn (hoặc admin). Bài chờ duyệt của các nhánh trong môn: đề trái · lời giải phải.
// Duyệt = DB ghi vào kho (nguon_giai='nguoi', giai_method='ta', da_duyet=true). Từ chối = lý do bắt buộc, ≤3 lần.
import { useEffect, useState } from 'react'
import { MathText } from '../kho/ui'
import { listChoDuyet, duyetBai, tuChoiBai, nhanhCuaMon, fmtTs, fmtGiay, type DongNhan } from '../../lib/giaibai'
import { BaiBody, BaiHead } from './BaiCard'
import { ChuoiDoc, YNhapDoc, chuoiKey, useChuoi } from './ChuoiHinh'

export default function DuyetBai({ mon, me, onChanged }: { mon: string; me: string; onChanged: () => void }) {
  const NHANH = nhanhCuaMon(mon)
  const [rows, setRows] = useState<DongNhan[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [tuChoiId, setTuChoiId] = useState<string | null>(null)
  const [lyDo, setLyDo] = useState('')
  const [xemGocId, setXemGocId] = useState<string | null>(null)   // Hoàn thiện: mở bản Claude gốc để so với bản người sửa

  async function reload() {
    setLoading(true); setErr(null)
    try { setRows(await listChoDuyet(NHANH)) } catch (e: any) { setErr(e.message ?? String(e)) } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [mon]) // eslint-disable-line
  const chuoi = useChuoi(rows)   // Hình: đề = cả chuỗi · lời giải = theo từng ý (y_nhap)

  async function chay(r: DongNhan, f: () => Promise<void>) {
    setBusyId(r.id)
    try { await f(); setRows((a) => a.filter((x) => x.id !== r.id)); setTuChoiId(null); setLyDo(''); onChanged() }
    catch (e: any) { alert(e.message ?? String(e)); await reload() }
    finally { setBusyId(null) }
  }
  const onDuyet = (r: DongNhan) => { if (confirm(`Duyệt lời giải ${r.ma} của ${r.nguoi_giai_ten}? Lời giải sẽ ghi vào kho thành chính thức.`)) chay(r, () => duyetBai(r.nhanh, r.id, me)) }
  const onTuChoi = (r: DongNhan) => { if (!lyDo.trim()) { alert('Ghi lý do từ chối để người giải biết sửa gì.'); return } chay(r, () => tuChoiBai(r.nhanh, r.id, me, lyDo.trim())) }

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      <div className="mb-3 text-[12px] text-slate-500"><b className="text-slate-800">{rows.length}</b> bài chờ duyệt · môn {mon}</div>
      {loading ? <p className="text-sm text-slate-400">Đang tải…</p> : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
        : rows.length === 0 ? <p className="text-sm text-slate-400">Không có bài nào chờ duyệt. 🎉</p>
        : (
          <ul className="space-y-4">
            {rows.map((r) => { const c = chuoi.get(chuoiKey(r.nhanh, r.key)); return (
              <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <BaiHead b={r} right={<>
                  <span className="text-[12px] text-slate-500">🧑 <b className="text-slate-700">{r.nguoi_giai_ten}</b> · nộp {fmtTs(r.nop_at)} · giải trong {fmtGiay(r.giay_giai)}{r.tu_choi_lan ? ` · đã từ chối ${r.tu_choi_lan} lần` : ''}</span>
                  <button onClick={() => { setTuChoiId(tuChoiId === r.id ? null : r.id); setLyDo('') }} disabled={busyId === r.id}
                    className="rounded-md border border-rose-200 bg-white px-3 py-1 text-[12px] font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-40">✕ Từ chối</button>
                  <button onClick={() => onDuyet(r)} disabled={busyId === r.id || r.nguoi_giai === me} title={r.nguoi_giai === me ? 'Không tự duyệt bài mình giải' : 'Ghi vào kho'}
                    className="rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">{busyId === r.id ? '⏳…' : '✓ Duyệt'}</button>
                </>} />
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Đề bài{c ? ` · chuỗi ${c.y.length} ý` : ''}</div>
                    {c ? <ChuoiDoc chuoi={c} compact /> : <BaiBody b={r} compact />}
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      <span>Lời giải · {r.so_ky_tu} ký tự · {r.so_cong_thuc} công thức{r.y_nhap?.length ? ` · ${r.y_nhap.length} ý` : ''}</span>
                      {r.che_do === 'hoan_thien' && r.loi_giai_ai && !r.y_nhap?.length && (
                        <button onClick={() => setXemGocId(xemGocId === r.id ? null : r.id)} className="rounded border border-fuchsia-200 bg-fuchsia-50 px-1.5 py-0.5 normal-case tracking-normal text-fuchsia-700 hover:bg-fuchsia-100">
                          {xemGocId === r.id ? 'Ẩn bản Claude gốc' : '🤖 So với bản Claude gốc'}{r.loi_giai_ai === r.loi_giai_nhap ? ' · giữ nguyên' : ' · đã sửa'}
                        </button>
                      )}
                    </div>
                    {c && r.y_nhap?.length
                      ? <YNhapDoc chuoi={c} yNhap={r.y_nhap} />
                      : <div className="text-[14px] leading-relaxed text-slate-800"><MathText>{r.loi_giai_nhap}</MathText></div>}
                    {r.dap_an_nhap && <div className="mt-1.5 text-[13px] text-slate-600">Đáp án ngắn: <MathText>{r.dap_an_nhap}</MathText></div>}
                    {r.anh_nhap && <img src={r.anh_nhap} alt="ảnh lời giải" className="mt-2 max-h-72 max-w-full rounded-lg border border-slate-200 bg-white" />}
                    {xemGocId === r.id && r.loi_giai_ai && (
                      <div className="mt-2 rounded-lg border border-fuchsia-200 bg-fuchsia-50/50 px-3 py-2">
                        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-700">Bản Claude gốc (lúc nhận)</div>
                        <div className="text-[13px] leading-relaxed text-slate-700"><MathText>{r.loi_giai_ai}</MathText></div>
                      </div>
                    )}
                  </div>
                </div>
                {tuChoiId === r.id && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5">
                    <input autoFocus value={lyDo} onChange={(e) => setLyDo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onTuChoi(r) }}
                      placeholder="Lý do từ chối (bắt buộc) — người giải sẽ thấy để sửa" className="flex-1 rounded-md border border-rose-200 bg-white px-2.5 py-1.5 text-[13px] focus:border-rose-400 focus:outline-none" />
                    <span className="text-[11px] text-rose-600">lần {r.tu_choi_lan + 1}/3{r.tu_choi_lan >= 2 ? ' — lần này bài về kho chung' : ''}</span>
                    <button onClick={() => onTuChoi(r)} disabled={busyId === r.id} className="rounded-md bg-rose-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-rose-500 disabled:opacity-40">Xác nhận từ chối</button>
                  </div>
                )}
              </li>
            ) })}
          </ul>
        )}
    </div>
  )
}
