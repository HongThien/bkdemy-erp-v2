// Màn "Duyệt lời giải AI" (27/08, tách 28/08) — gộp theo khối, tránh phải đi từng câu một trong Kho.
// Gộp 5 nguồn: dai/khtn/hgt_cau_hoi + hinh_baitoan_bien_the + hinh_cach_giai (đều nguon_giai='ai').
// Duyệt 1 câu = da_duyet=true + duyet_boi/duyet_at (KHÔNG đụng nội dung). Có nút duyệt cả lô
// đang lọc cho lúc tin tưởng hết, đỡ bấm từng cái.
//
// TOGGLE (Thùy 28/08): 2 việc khác hẳn nhau, dùng chung nguon_giai='ai' nên dễ lẫn —
//   · "Câu trong kho" = backlog CŨ, tồn đọng (chủ yếu từ tính năng Clone lâu rồi), giai_method IS NULL.
//   · "Lời giải mới từ Claude" = MỚI vừa sinh qua đúng luồng "giải bài chưa có đáp án" hôm nay,
//     giai_method='claude_code'. Tách bằng cột giai_method (migration 202608281100) — KHÔNG lẫn nữa.
import { useEffect, useRef, useState } from 'react'
import { KHOI_OPTIONS, listCauChoDuyetLoiGiai, duyetLoiGiaiCau, type CauChoDuyetLoiGiai, type KhoMon } from '../../lib/kho/api'
import { listBienTheChoDuyetLoiGiai, duyetLoiGiaiBienThe, type BienTheChoDuyetLoiGiai, listCachGiaiChoDuyetLoiGiai, duyetLoiGiaiCachGiai, type CachGiaiChoDuyetLoiGiai } from '../../lib/kho/hinh'
import { MathText } from '../kho/ui'
import { myNhanSuId } from '../../lib/giaoviec'

const NHANH_LABEL: Record<string, string> = { toan: 'Đại', khtn: 'KHTN', hgt: 'Hình giải tích', hinh: 'Hình (biến thể)', hinh_goc: 'Hình (bài toán gốc)' }
type Row = { key: string; nhanh: string; khoi: string; deBai: string; loiGiai: string; duyet: () => Promise<void> }
type Tab = 'kho' | 'moi'

export default function DuyetLoiGiaiScreen() {
  const [tab, setTab] = useState<Tab>('moi')
  const [khoi, setKhoi] = useState('8')
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  // Guard race condition: đổi tab/khối liên tiếp bắn nhiều request async chồng nhau — response
  // CŨ trả về SAU có thể ghi đè response MỚI (đã dính thật lúc test 28/08). Chỉ áp kết quả nếu
  // vẫn là request MỚI NHẤT lúc nó resolve xong (CLAUDE.md §2: "React: reset state ngay trước async query").
  const reqId = useRef(0)

  async function reload() {
    const myReqId = ++reqId.current
    setLoading(true); setErr(null)
    try {
      const chiMoi = tab === 'moi'
      const nguoiDuyet = await myNhanSuId()
      const [dai, khtn, hgt, hinh, hinhGoc] = await Promise.all([
        listCauChoDuyetLoiGiai('toan', khoi, chiMoi), listCauChoDuyetLoiGiai('khtn', khoi, chiMoi), listCauChoDuyetLoiGiai('hgt', khoi, chiMoi),
        listBienTheChoDuyetLoiGiai(khoi, chiMoi), listCachGiaiChoDuyetLoiGiai(khoi, chiMoi),
      ])
      if (myReqId !== reqId.current) return // đã có request mới hơn bắn sau — bỏ kết quả này
      const tuCau = (mon: KhoMon, r: CauChoDuyetLoiGiai): Row => ({
        key: `${mon}:${r.maCau}`, nhanh: NHANH_LABEL[mon], khoi: r.khoi, deBai: r.noiDung, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiCau(mon, r.maCau, nguoiDuyet),
      })
      const tuBienThe = (r: BienTheChoDuyetLoiGiai): Row => ({
        key: `hinh:${r.id}`, nhanh: NHANH_LABEL.hinh, khoi: r.khoi, deBai: r.deBai, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiBienThe(r.id, nguoiDuyet),
      })
      const tuCachGiai = (r: CachGiaiChoDuyetLoiGiai): Row => ({
        key: `hinh_goc:${r.id}`, nhanh: NHANH_LABEL.hinh_goc, khoi: r.khoi, deBai: r.deBai, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiCachGiai(r.id, nguoiDuyet),
      })
      setRows([
        ...dai.map((r) => tuCau('toan', r)), ...khtn.map((r) => tuCau('khtn', r)), ...hgt.map((r) => tuCau('hgt', r)),
        ...hinh.map(tuBienThe), ...hinhGoc.map(tuCachGiai),
      ])
    } catch (e: any) { if (myReqId === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (myReqId === reqId.current) setLoading(false) }
  }
  useEffect(() => { reload() }, [khoi, tab]) // eslint-disable-line

  async function onDuyet(r: Row) {
    setBusyKey(r.key)
    try { await r.duyet(); setRows((a) => a.filter((x) => x.key !== r.key)) }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyKey(null) }
  }
  async function onDuyetTatCa() {
    if (!rows.length || !confirm(`Duyệt cả ${rows.length} câu đang lọc?`)) return
    setBusyAll(true)
    try {
      for (const r of rows) { try { await r.duyet() } catch { /* bỏ qua câu lỗi, tiếp tục */ } }
      await reload()
    } finally { setBusyAll(false) }
  }

  const tabBtn = (t: Tab, label: string) => (
    <button onClick={() => setTab(t)}
      className={`rounded-full px-3.5 py-1 text-[13px] font-medium transition ${tab === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`}>
      {label}
    </button>
  )

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3.5">
        <span className="text-[15px] font-semibold text-slate-800">Duyệt lời giải AI</span>
        <div className="flex items-center gap-1.5">
          {tabBtn('moi', 'Lời giải mới từ Claude')}
          {tabBtn('kho', 'Câu trong kho (tồn đọng)')}
        </div>
        <span className="text-[12px] text-slate-400">{rows.length} câu chờ duyệt</span>
        <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="ml-3 rounded-md border border-slate-200 px-2 py-1 text-[13px]">
          {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        <button onClick={onDuyetTatCa} disabled={!rows.length || busyAll}
          className="ml-auto rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
          {busyAll ? '⏳ Đang duyệt…' : `✓ Duyệt tất cả đang lọc (${rows.length})`}
        </button>
      </div>
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Không có câu nào chờ duyệt ở khối {khoi}.</p>
          : (
            <ul className="space-y-3">
              {rows.map((r) => (
                <li key={r.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-400">
                    <span className="rounded bg-violet-50 px-2 py-0.5 font-medium text-violet-700">{r.nhanh}</span>
                    <span>Khối {r.khoi}</span>
                    <button onClick={() => onDuyet(r)} disabled={busyKey === r.key || busyAll}
                      className="ml-auto rounded-md bg-emerald-600 px-3 py-1 text-[12px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
                      {busyKey === r.key ? '⏳…' : '✓ Duyệt'}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Đề bài</div>
                      <MathText>{r.deBai}</MathText>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Lời giải (AI)</div>
                      <MathText>{r.loiGiai}</MathText>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  )
}
