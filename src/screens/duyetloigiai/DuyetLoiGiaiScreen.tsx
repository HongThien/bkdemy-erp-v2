// Màn "Duyệt lời giải AI" (27/08, tách 28/08) — gộp theo khối, tránh phải đi từng câu một trong Kho.
//
// ⭐ SCOPE THEO MÔN (Thùy 04/09: "Sao KHTN cứ lẫn vào Toán. KHTN là MÔN. Ai phụ trách môn nào mới thấy môn
// đó"): màn này KHÔNG trộn môn nữa. Bộ chọn môn = y khuôn KhoScreen — `useMonScope` (scope④: admin/ops thấy
// tất, GV/TA/học thuật chỉ môn trong nhan_su_mon, chưa gán = không thấy gì). Mỗi MÔN gồm các NHÁNH kho của nó
// (registry KHO_MON trong api.ts): Toán = Đại + Hình giải tích + Hình (biến thể + bài toán gốc) · KHTN = 1 cây.
//
// TAB (lịch sử): "Câu trong kho" = backlog CŨ nguồn AI (giai_method IS NULL) · "Lời giải mới từ Claude" = giai_method=
// 'claude_code' (mig 202608281100) · "Chưa có lời giải" (04/09) = tab ĐẦU VÀO — sống ở ChuaGiaiTab.tsx · "Trắc nghiệm AI"
// (08/09, spec-mcq-form.md §6) — TracNghiemAiTab.tsx.
//
// ⭐ 08/09 — KHO CHUẨN (spec-kho-chuan.md §3, mig 202609080938): các tab câu KHO (lời giải mới · tồn đọng) chuyển sang
//   DuyetCauTab = HÀNG DUYỆT HỢP NHẤT (thẻ sửa được dạng/cụm/đề/đáp số/lời giải tại chỗ, lưu là chuẩn) + 3 bộ lọc mới:
//   "Câu mới chờ duyệt" (sau NGÀY BẬT, cửa 1 chặn khỏi HS) · "Máy nghi đáp số" · "Không kiểm được". Số câu mỗi bộ lọc
//   đếm ở DB (fn_kho_dem_hang_duyet) — badge trên tab + nhãn khối trong dropdown. Phần HÌNH (biến thể/cách giải — không có
//   dạng/cụm/kiem_may) của 2 tab lời giải vẫn render ở màn cha như cũ, chọn qua toggle "Câu kho / Hình" (chỉ môn có Hình).
import { useEffect, useRef, useState } from 'react'
import { KHOI_OPTIONS, KHO_MON, nhanhCuaMon, demCauChuaGiai, demHangDuyet, HANG_DUYET_LABEL, type DemChuaGiai, type DemHangDuyet, type HangDuyetLoc } from '../../lib/kho/api'
import ChuaGiaiTab from './ChuaGiaiTab'
import TracNghiemAiTab from './TracNghiemAiTab'
import DuyetCauTab from './DuyetCauTab'
import DuyetDungSaiTab from './DuyetDungSaiTab'
import DienOAiTab from './DienOAiTab'
import { listBienTheChoDuyetLoiGiai, duyetLoiGiaiBienThe, type BienTheChoDuyetLoiGiai, listCachGiaiChoDuyetLoiGiai, duyetLoiGiaiCachGiai, type CachGiaiChoDuyetLoiGiai } from '../../lib/kho/hinh'
import { MathText } from '../kho/ui'
import { coKhoHinh } from '../../lib/tailieu'
import { myNhanSuId } from '../../lib/giaoviec'
import { useMonScope } from '../../hooks/useMonScope'
import { useStore } from '../../store/useStore'

const HINH_LABEL = { bien_the: 'Hình (biến thể)', bai_toan_goc: 'Hình (bài toán gốc)' }
const BATCH_SIZE = 20
type Row = { key: string; nhanh: string; khoi: string; deBai: string; loiGiai: string; duyet: () => Promise<void> }
// 'tn' = "Trắc nghiệm AI" (spec-mcq-form.md §6, 08/09): phiên bản 4 phương án AI sinh cho câu tính toán — sống ở TracNghiemAiTab.tsx.
// 'dien' = "Điền ô AI" (spec-dien-o.md, 09/09): lời giải chứng minh hình có ô trống — sống ở DienOAiTab.tsx (chỉ môn Toán, kho hình).
// 'dung_sai' (CEO 12/09): câu Đúng/Sai là LOẠI RIÊNG — bộ lọc riêng trên thanh tab, UI duyệt theo từng mệnh đề (DuyetDungSaiTab).
// Đếm vẫn qua fn_kho_dem_hang_duyet như các bộ lọc khác (DB chỉ đếm nhánh có bảng con mệnh đề: Đại/HGT; KHTN hold).
type Tab = 'chua' | HangDuyetLoc | 'tn' | 'dien'
const TAB_LOC: HangDuyetLoc[] = ['cau_moi', 'moi', 'nghi', 'khong_kiem', 'ton_dong', 'dung_sai']
const TAB_CO_HINH = new Set<Tab>(['moi', 'ton_dong']) // 2 tab lời giải có thêm phần Hình (biến thể / cách giải)
const readMon = () => localStorage.getItem('duyetlg.mon') ?? ''

export default function DuyetLoiGiaiScreen() {
  const [tab, setTab] = useState<Tab>('chua')
  const [khoi, setKhoi] = useState('8')
  const [mon, setMon] = useState<string>(readMon)
  const [nguon, setNguon] = useState<'kho' | 'hinh'>('kho') // tab lời giải: câu kho (DuyetCauTab) hay Hình (list dưới)
  const [dem, setDem] = useState<DemChuaGiai[]>([]) // số bài chưa có lời giải theo khối — của MÔN đang chọn, tính ở DB
  const [demHD, setDemHD] = useState<DemHangDuyet[]>([]) // số câu mỗi bộ lọc × khối (khoi null = tổng) — tính ở DB
  const [rows, setRows] = useState<Row[]>([]) // CHỈ Hình
  const [loading, setLoading] = useState(false)
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
  const coHinh = nhanh.includes('hinh')
  const monOk = allowed.includes(mon)
  const laLoc = TAB_LOC.includes(tab as HangDuyetLoc)
  const hienHinh = coHinh && TAB_CO_HINH.has(tab) && nguon === 'hinh'

  async function reloadDem() {
    if (!monOk) { setDem([]); setDemHD([]); return }
    try { const [a, b] = await Promise.all([demCauChuaGiai(nhanh), demHangDuyet(nhanh)]); setDem(a); setDemHD(b) }
    catch { /* chỉ là nhãn — lỗi không chặn màn */ }
  }
  useEffect(() => { reloadDem() }, [mon, monOk]) // eslint-disable-line
  const demLoc = (loc: HangDuyetLoc, k: string | null = null) => demHD.find((d) => d.loc === loc && d.khoi === k)?.so_cau ?? 0

  // Phần HÌNH của 2 tab lời giải (biến thể chưa duyệt / cách giải bài toán gốc) — như trước 08/09.
  async function reload() {
    if (!hienHinh || !monOk) { setRows([]); return }
    const myReqId = ++reqId.current
    setLoading(true); setErr(null)
    try {
      const chiMoi = tab === 'moi'
      const nguoiDuyet = await myNhanSuId()
      const [hinh, hinhGoc] = await Promise.all([listBienTheChoDuyetLoiGiai(khoi, chiMoi), listCachGiaiChoDuyetLoiGiai(khoi, chiMoi)])
      if (myReqId !== reqId.current) return
      const tuBienThe = (r: BienTheChoDuyetLoiGiai): Row => ({
        key: `hinh:${r.id}`, nhanh: HINH_LABEL.bien_the, khoi: r.khoi, deBai: r.deBai, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiBienThe(r.id, nguoiDuyet),
      })
      const tuCachGiai = (r: CachGiaiChoDuyetLoiGiai): Row => ({
        key: `hinh_goc:${r.id}`, nhanh: HINH_LABEL.bai_toan_goc, khoi: r.khoi, deBai: r.deBai, loiGiai: r.loiGiai,
        duyet: () => duyetLoiGiaiCachGiai(r.id, nguoiDuyet),
      })
      setRows([...hinh.map(tuBienThe), ...hinhGoc.map(tuCachGiai)])
    } catch (e: any) { if (myReqId === reqId.current) setErr(e.message ?? String(e)) }
    finally { if (myReqId === reqId.current) setLoading(false) }
  }
  useEffect(() => { setRows([]); reload() }, [khoi, tab, mon, monOk, nguon]) // eslint-disable-line

  async function onDuyet(r: Row) {
    setBusyKey(r.key)
    try { await r.duyet(); setRows((a) => a.filter((x) => x.key !== r.key)) }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusyKey(null) }
  }
  // Batch 20 (CEO 11/09) — cùng nhịp với các tab kho khác.
  const batchHinh = rows.slice(0, BATCH_SIZE)
  async function onDuyetTatCa() {
    if (!batchHinh.length || !confirm(`Duyệt cả ${batchHinh.length} bài Hình trong batch này? Câu không đạt hãy Từ chối trước.`)) return
    setBusyAll(true)
    try {
      const done = new Set<string>()
      for (const r of batchHinh) {
        try { await r.duyet(); done.add(r.key) }
        catch { /* bỏ qua câu lỗi, tiếp tục */ }
      }
      setRows((a) => a.filter((x) => !done.has(x.key)))
    } finally { setBusyAll(false) }
  }

  const tabBtn = (t: Tab, label: string, n?: number) => (
    <button key={t} onClick={() => setTab(t)}
      className={`rounded-full px-3.5 py-1 text-[13px] font-medium transition ${tab === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-800'}`}>
      {label}{n ? <span className={`ml-1.5 rounded-full px-1.5 text-[11px] ${tab === t ? 'bg-white/20' : t === 'nghi' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>{n}</span> : null}
    </button>
  )

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-3.5">
        <span className="text-[15px] font-semibold text-slate-800">Duyệt câu &amp; lời giải</span>
        {/* Bộ chọn MÔN — chỉ môn được phân (admin/ops thấy tất). 1 môn vẫn hiện để rõ ngữ cảnh. */}
        {allowed.length > 0 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowed.map((m) => (
              <button key={m} onClick={() => setMon(m)}
                className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{m}</button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          {tabBtn('chua', 'Chưa có lời giải')}
          {TAB_LOC.map((l) => tabBtn(l, HANG_DUYET_LABEL[l], demLoc(l)))}
          {tabBtn('tn', 'Trắc nghiệm AI')}
          {coKhoHinh(mon) && tabBtn('dien', 'Điền ô AI')}
        </div>
        <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="ml-3 rounded-md border border-slate-200 px-2 py-1 text-[13px]">
          {KHOI_OPTIONS.map((k) => {
            const d = dem.find((x) => x.khoi === k)
            const n = laLoc ? demLoc(tab as HangDuyetLoc, k) : 0
            return <option key={k} value={k}>Khối {k}{laLoc ? ` · ${n} câu` : d ? ` · ${d.so_cau} chưa giải${d.so_cho_giai ? ` (${d.so_cho_giai} đã đặt)` : ''}` : ''}</option>
          })}
        </select>
        {coHinh && TAB_CO_HINH.has(tab) && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5" title="Tab lời giải: câu kho (Đại / Hình giải tích) hay Hình (biến thể / bài toán gốc)">
            {(['kho', 'hinh'] as const).map((n) => (
              <button key={n} onClick={() => setNguon(n)}
                className={`rounded-md px-3 py-1 text-[13px] font-medium transition ${nguon === n ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{n === 'kho' ? 'Câu kho' : 'Hình'}</button>
            ))}
          </div>
        )}
        {hienHinh && (
          <>
            <span className="ml-auto text-[12px] text-slate-500">Batch <b className="text-slate-800">{batchHinh.length}</b>/<b>{rows.length}</b> bài Hình</span>
            <button onClick={onDuyetTatCa} disabled={!batchHinh.length || busyAll}
              className="rounded-md bg-emerald-600 px-3.5 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
              {busyAll ? '⏳ Đang duyệt…' : `✓ Duyệt tất cả batch (${batchHinh.length})`}
            </button>
          </>
        )}
      </div>
      {profileLoading ? <p className="px-6 py-4 text-sm text-slate-400">Đang tải hồ sơ…</p>
      : !monOk ? <p className="px-6 py-4 text-sm text-slate-400">Bạn chưa được phân môn nào (nhan_su_mon) — không có kho để duyệt.</p>
      : tab === 'chua' ? <ChuaGiaiTab mon={mon} khoi={khoi} onChanged={reloadDem} />
      : tab === 'tn' ? <TracNghiemAiTab mon={mon} khoi={khoi} />
      : tab === 'dien' ? <DienOAiTab mon={mon} khoi={khoi} />
      : tab === 'dung_sai' ? <DuyetDungSaiTab mon={mon} khoi={khoi} onChanged={reloadDem} />
      : !hienHinh ? <DuyetCauTab mon={mon} khoi={khoi} loc={tab as HangDuyetLoc} onChanged={reloadDem} /> : (
      <div className="flex-1 overflow-auto px-6 py-4">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : err ? <p className="text-sm text-rose-600">Lỗi: {err}</p>
          : rows.length === 0 ? <p className="text-sm text-slate-400">Không có bài Hình nào chờ duyệt ở khối {khoi}.</p>
          : (
            <>
            <ul className="space-y-3">
              {batchHinh.map((r) => (
                <li key={r.key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-slate-400">
                    <span className="rounded bg-sky-50 px-2 py-0.5 font-medium text-sky-700">{r.nhanh}</span>
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
            {rows.length > batchHinh.length && (
              <p className="mt-4 text-center text-[12px] text-slate-400">Còn <b>{rows.length - batchHinh.length}</b> bài Hình — sẽ hiện sau khi duyệt/từ chối xong batch này.</p>
            )}
            </>
          )}
      </div>
      )}
    </div>
  )
}
