// Màn "Duyệt lời giải AI" (27/08, tách 28/08) — gộp theo khối, tránh phải đi từng câu một trong Kho.
// Duyệt 1 câu = da_duyet=true + duyet_boi/duyet_at (KHÔNG đụng nội dung). Có nút duyệt cả lô
// đang lọc cho lúc tin tưởng hết, đỡ bấm từng cái.
//
// ⭐ SCOPE THEO MÔN (Thùy 04/09: "Sao KHTN cứ lẫn vào Toán. KHTN là MÔN. Ai phụ trách môn nào mới thấy môn
// đó"): màn này KHÔNG trộn môn nữa. Bộ chọn môn = y khuôn KhoScreen — `useMonScope` (scope④: admin/ops thấy
// tất, GV/TA/học thuật chỉ môn trong nhan_su_mon, chưa gán = không thấy gì). Mỗi MÔN gồm các NHÁNH kho của nó
// (registry KHO_MON trong api.ts): Toán = Đại + Hình giải tích + Hình (biến thể + bài toán gốc) · KHTN = 1 cây.
// Cả 3 tab dưới đây đều chỉ tải nhánh của môn đang chọn.
//
// TOGGLE (Thùy 28/08): 2 việc khác hẳn nhau, dùng chung nguon_giai='ai' nên dễ lẫn —
//   · "Câu trong kho" = backlog CŨ, tồn đọng (chủ yếu từ tính năng Clone lâu rồi), giai_method IS NULL.
//   · "Lời giải mới từ Claude" = MỚI vừa sinh qua đúng luồng "giải bài chưa có đáp án" hôm nay,
//     giai_method='claude_code'. Tách bằng cột giai_method (migration 202608281100) — KHÔNG lẫn nữa.
//   · "Chưa có lời giải" (Thùy 04/09) = tab ĐẦU VÀO của luồng: bài trong kho chưa có lời giải → tự giải
//     tại chỗ HOẶC đặt Claude giải (hàng đợi) → kết quả Claude quay về tab "Lời giải mới" để duyệt.
//     Tab này sống ở ChuaGiaiTab.tsx; dropdown khối kèm số bài chưa giải của MÔN đang chọn (fn_kho_dem_cau_chua_giai).
import { useEffect, useRef, useState } from 'react'
import { KHOI_OPTIONS, KHO_MON, nhanhCuaMon, NHANH_LABEL, listCauChoDuyetLoiGiai, duyetLoiGiaiCau, demCauChuaGiai, type CauChoDuyetLoiGiai, type KhoMon, type DemChuaGiai } from '../../lib/kho/api'
import ChuaGiaiTab from './ChuaGiaiTab'
import { listBienTheChoDuyetLoiGiai, duyetLoiGiaiBienThe, type BienTheChoDuyetLoiGiai, listCachGiaiChoDuyetLoiGiai, duyetLoiGiaiCachGiai, type CachGiaiChoDuyetLoiGiai } from '../../lib/kho/hinh'
import { MathText } from '../kho/ui'
import { myNhanSuId } from '../../lib/giaoviec'
import { useMonScope } from '../../hooks/useMonScope'
import { useStore } from '../../store/useStore'

const HINH_LABEL = { bien_the: 'Hình (biến thể)', bai_toan_goc: 'Hình (bài toán gốc)' }
type Row = { key: string; nhanh: string; khoi: string; deBai: string; loiGiai: string; duyet: () => Promise<void> }
type Tab = 'chua' | 'kho' | 'moi'
const readMon = () => localStorage.getItem('duyetlg.mon') ?? ''

export default function DuyetLoiGiaiScreen() {
  const [tab, setTab] = useState<Tab>('chua')
  const [khoi, setKhoi] = useState('8')
  const [mon, setMon] = useState<string>(readMon)
  const [dem, setDem] = useState<DemChuaGiai[]>([]) // số bài chưa có lời giải theo khối — của MÔN đang chọn, tính ở DB
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  // Guard race condition: đổi tab/khối liên tiếp bắn nhiều request async chồng nhau — response
  // CŨ trả về SAU có thể ghi đè response MỚI (đã dính thật lúc test 28/08). Chỉ áp kết quả nếu
  // vẫn là request MỚI NHẤT lúc nó resolve xong (CLAUDE.md §2: "React: reset state ngay trước async query").
  const reqId = useRef(0)

  // Scope④ theo môn — cùng khuôn KhoScreen: chỉ hiện môn được phân; môn đang chọn không được phép → nhảy về môn đầu.
  const me = useStore((s) => s.me)
  const { allowedMons, isAll } = useMonScope()
  const allowed = KHO_MON.filter((m) => isAll || allowedMons.includes(m.mon)).map((m) => m.mon)
  useEffect(() => { if (allowed.length && !allowed.includes(mon)) setMon(allowed[0]) }, [allowed.join(','), mon]) // eslint-disable-line
  useEffect(() => { if (mon) localStorage.setItem('duyetlg.mon', mon) }, [mon])
  const profileLoading = !isAll && me === null
  const nhanh = nhanhCuaMon(mon)
  const monOk = allowed.includes(mon)

  async function reloadDem() {
    if (!monOk) { setDem([]); return }
    try { setDem(await demCauChuaGiai(nhanh)) } catch { /* chỉ là nhãn trong dropdown — lỗi không chặn màn */ }
  }
  useEffect(() => { reloadDem() }, [mon, monOk]) // eslint-disable-line
  async function reload() {
    if (tab === 'chua' || !monOk) return // tab "chưa" tự tải trong ChuaGiaiTab
    const myReqId = ++reqId.current
    setLoading(true); setErr(null)
    try {
      const chiMoi = tab === 'moi'
      const nguoiDuyet = await myNhanSuId()
      const kho = nhanh.filter((n): n is KhoMon => n !== 'hinh')
      const coHinh = nhanh.includes('hinh')
      const [khoRows, hinh, hinhGoc] = await Promise.all([
        Promise.all(kho.map((m) => listCauChoDuyetLoiGiai(m, khoi, chiMoi))),
        coHinh ? listBienTheChoDuyetLoiGiai(khoi, chiMoi) : Promise.resolve([] as BienTheChoDuyetLoiGiai[]),
        coHinh ? listCachGiaiChoDuyetLoiGiai(khoi, chiMoi) : Promise.resolve([] as CachGiaiChoDuyetLoiGiai[]),
      ])
      if (myReqId !== reqId.current) return // đã có request mới hơn bắn sau — bỏ kết quả này
      const tuCau = (m: KhoMon, r: CauChoDuyetLoiGiai): Row => ({
        key: `${m}:${r.maCau}`, nhanh: NHANH_LABEL[m], khoi: r.khoi, deBai: r.noiDung, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiCau(m, r.maCau, nguoiDuyet),
      })
      const tuBienThe = (r: BienTheChoDuyetLoiGiai): Row => ({
        key: `hinh:${r.id}`, nhanh: HINH_LABEL.bien_the, khoi: r.khoi, deBai: r.deBai, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiBienThe(r.id, nguoiDuyet),
      })
      const tuCachGiai = (r: CachGiaiChoDuyetLoiGiai): Row => ({
        key: `hinh_goc:${r.id}`, nhanh: HINH_LABEL.bai_toan_goc, khoi: r.khoi, deBai: r.deBai, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiCachGiai(r.id, nguoiDuyet),
      })
      setRows([...kho.flatMap((m, i) => khoRows[i].map((r) => tuCau(m, r))), ...hinh.map(tuBienThe), ...hinhGoc.map(tuCachGiai)])
    } catch (e: any) { if (myReqId === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (myReqId === reqId.current) setLoading(false) }
  }
  useEffect(() => { setRows([]); reload() }, [khoi, tab, mon, monOk]) // eslint-disable-line

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
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-3.5">
        <span className="text-[15px] font-semibold text-slate-800">Duyệt lời giải AI</span>
        {/* Bộ chọn MÔN — chỉ môn được phân (admin/ops thấy tất). 1 môn vẫn hiện để rõ ngữ cảnh. */}
        {allowed.length > 0 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowed.map((m) => (
              <button key={m} onClick={() => setMon(m)}
                className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{m}</button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          {tabBtn('chua', 'Chưa có lời giải')}
          {tabBtn('moi', 'Lời giải mới từ Claude')}
          {tabBtn('kho', 'Câu trong kho (tồn đọng)')}
        </div>
        {tab !== 'chua' && <span className="text-[12px] text-slate-400">{rows.length} câu chờ duyệt</span>}
        <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="ml-3 rounded-md border border-slate-200 px-2 py-1 text-[13px]">
          {KHOI_OPTIONS.map((k) => {
            const d = dem.find((x) => x.khoi === k)
            return <option key={k} value={k}>Khối {k}{d ? ` · ${d.so_cau} chưa giải${d.so_cho_giai ? ` (${d.so_cho_giai} đã đặt)` : ''}` : ''}</option>
          })}
        </select>
        {tab !== 'chua' && (
          <button onClick={onDuyetTatCa} disabled={!rows.length || busyAll}
            className="ml-auto rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
            {busyAll ? '⏳ Đang duyệt…' : `✓ Duyệt tất cả đang lọc (${rows.length})`}
          </button>
        )}
      </div>
      {profileLoading ? <p className="px-6 py-4 text-sm text-slate-400">Đang tải hồ sơ…</p>
      : !monOk ? <p className="px-6 py-4 text-sm text-slate-400">Bạn chưa được phân môn nào (nhan_su_mon) — không có kho để duyệt.</p>
      : tab === 'chua' ? <ChuaGiaiTab mon={mon} khoi={khoi} onChanged={reloadDem} /> : (
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Không có câu nào chờ duyệt ở {mon} khối {khoi}.</p>
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
      )}
    </div>
  )
}
