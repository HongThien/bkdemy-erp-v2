// ═══════════ KHO ĐỀ THI — nơi LƯU và SỬA đề (spec-de-thi.md §10, CEO 01/10/2026) ═══════════
// Đề vào bằng Claude (`/nhap-de-thi`: thả file vào thư mục chỉ định → Claude bóc, kiểm, gán dạng → ghi chưa duyệt).
// Màn này là chỗ làm việc CHÍNH của đề: danh sách 3 tab (Chờ duyệt · Sẵn sàng · Đã giao — suy động ở DB) và MỘT màn
// sửa duy nhất (`DeThiSoan`, gộp "Sửa đề" + "Duyệt đề" cũ): đề hiện đúng bố cục giấy, sửa tại chỗ mọi thứ của câu
// (nội dung · phương án · đáp án · lời giải · hình · dạng; Đúng/Sai: mỗi MỆNH ĐỀ một dạng), ghi chú của máy lúc nhập,
// đề gốc cạnh bên, thêm/bớt/đổi thứ tự câu, Duyệt · Giao · In. Kho tài liệu chỉ còn để in.
// Đường "Nhập đề thi từ PDF" (Gemini đọc trong trình duyệt) ĐÃ GỠ 01/10 theo quyết định CEO.
// Mọi invariant/đếm ở Postgres (fn_de_thi_*); client gọi + hiển thị + ghi dòng đơn. Sau mỗi sửa: VÁ TẠI CHỖ.
import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'
import { useMonScope } from '../../hooks/useMonScope'
import {
  getDeThi, createDeThi, renameDeThi, deThiMeta, updateDeThiMeta, attachPdfGoc, addPhanDeThi, listPhanDeThi,
  deThiCau, deThiThieu, duyetDeThi, suaCauDeThi, themCauVaoPhan, bangCuaKho, nhanhCuaKhoPicker, canhBaoNhap, nhanGocCau, nhomBaiCuaDe, boLoiDan,
  demKhoDeThi, listKhoDeThi, KHO_DE_CUA_MON, MON_DE_THI, soDongDeThi, setSoDongDeThi, coDongKeDeThi, dongMacDinhDeThi,
  patchCauHinhDeThi, tronCauHinh, KY_DE, dangMoiCuaDe, dichMoi, ganDangMoi, namHocKhoDeThi, tenNamHoc,
  type DeThi, type KyDe, type LocNamHoc, type DangMoi, type DichMoi, type DeThiMeta, type DeThiCau, type DeThiThieu, type DeThiDong, type Kho, type LoiDeThi, type SuaCauPatch, type TabKhoDe,
} from '../../lib/dethi'
import { setCauOfPhan, deletePhan, updatePhan, type TaiLieuPhan } from '../../lib/tailieu'
import type { CheDoHinh } from '../../lib/kho/hinhGiaoTrinh'
import { ColSel, AnhXem, AnhMmCtl, CheDoHinhBtn, MAU_PRESET } from './TaiLieuBuilder'
import { AnhMmEditCtx } from './anhMmCtx'
import { KHOI_OPTIONS, DEFAULT_KHOI, uploadKhoFile, searchCau, type CauTimThay, type MenhDe } from '../../lib/kho/api'
import { MathText, ChuMon, NguLieuBlock, inp } from '../kho/ui'
import { MathTextarea } from '../../components/math/MathTextarea'
import { CauEditor, type ReviewItem } from '../kho/DangHub'
import DangPickerOne from '../../components/DangPickerOne'
import DeThiPrintView from './DeThiPrintView'
import { GiaoDeModal, DaGanPanel, LuotThiPanel } from './DuyetDeThi'
import { useNhanXet, NutCanSua, NhanXetCu } from '../duyetloigiai/CanSua'
import { monTuKho, type MonNX, type TrangThaiNX } from '../../lib/kho/nhanXet'

const MONS = MON_DE_THI
// 3 tab đầu = ĐỀ THI (suy động ở DB); tab "Đề cương" = tài liệu ôn tập, tách riêng khỏi đề thi (CEO 10/10, mig 202610102204)
const TABS: { key: TabKhoDe; ten: string }[] = [{ key: 'cho_duyet', ten: 'Chờ duyệt' }, { key: 'san_sang', ten: 'Sẵn sàng' }, { key: 'da_giao', ten: 'Đã giao' }, { key: 'de_cuong', ten: 'Đề cương' }]
const LOAI_TEN: Record<string, string> = { trac_nghiem: 'Trắc nghiệm', dung_sai: 'Đúng / sai', tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận' }
const LOI_TEN: Record<LoiDeThi, string> = {
  cau_da_xoa: 'câu đã vào kho rác', dang_cho: 'chưa có dạng', thieu_dap_an: 'thiếu đáp án', thieu_phuong_an: 'thiếu phương án',
  tln_chua_mcq: 'chưa có 4 phương án trắc nghiệm', thieu_menh_de: 'thiếu mệnh đề', md_thieu_dap_an: 'ý chưa có Đ/S',
  md_dang_cho: 'có ý chưa có dạng', chua_chu_de: 'chưa có chủ đề', tu_luan_chi_in: 'tự luận — chỉ in, không lên app',
}
// Lỗi CHỈ CẢNH BÁO (không chặn duyệt / giao): chưa có dạng · chưa có chủ đề (Đ/S) · tự luận chỉ in. Mọi lỗi khác chặn.
const CHI_CANH_BAO = new Set<LoiDeThi>(['dang_cho', 'md_dang_cho', 'chua_chu_de', 'tu_luan_chi_in'])
const TEN_KY = Object.fromEntries(KY_DE.map((k) => [k.key, k.ten])) as Record<KyDe, string>
const laDangCho = (m: string | null | undefined) => !m || m.endsWith('000000')
const ngayVN = (s: string | null | undefined) => (s ? new Date(s).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : '')
// Phiếu trả lời trắc nghiệm của Bộ, phần Trả lời ngắn: 4 ô; dấu "−" chỉ ở ô 1; dấu "," chỉ ở ô 2 hoặc 3; còn lại chữ số.
export function hopLePhieu4O(s: string): boolean {
  if (!s || s.length > 4 || !/^[0-9,-]+$/.test(s)) return false
  if (s.includes('-') && s.lastIndexOf('-') !== 0) return false
  const ph = [...s].map((ch, i) => (ch === ',' ? i : -1)).filter((i) => i >= 0)
  return ph.length <= 1 && ph.every((i) => i === 1 || i === 2) && /\d$/.test(s)
}

// ═══════════ DANH SÁCH ═══════════
// Màn hàng đợi ⇒ nhớ bộ lọc + danh sách + vị trí cuộn ở module-level; mở đề rồi quay lại đứng đúng chỗ cũ.
const NHO: { mon: string | null; khoi: string | null; ky: KyDe | null; namHoc: LocNamHoc; tab: TabKhoDe; tim: string; rows: DeThiDong[]; het: boolean; scrollTop: number; coDuLieu: boolean } =
  { mon: null, khoi: null, ky: null, namHoc: null, tab: 'cho_duyet', tim: '', rows: [], het: false, scrollTop: 0, coDuLieu: false }

export default function KhoDeThiScreen() {
  const { allowedMons: monScope, isAll } = useMonScope()
  const allowedMons = isAll ? MONS : MONS.filter((m) => monScope.includes(m))
  const [mon, setMon] = useState(NHO.mon ?? allowedMons[0] ?? 'Toán')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(',')]) // eslint-disable-line
  const [khoi, setKhoi] = useState<string | null>(NHO.khoi)
  const [ky, setKy] = useState<KyDe | null>(NHO.ky)
  const [namHoc, setNamHoc] = useState<LocNamHoc>(NHO.namHoc)
  const [dsNamHoc, setDsNamHoc] = useState<{ nam: number[]; co_chua_ro: boolean } | null>(null)
  useEffect(() => { let song = true; namHocKhoDeThi(mon).then((r) => { if (song) setDsNamHoc(r) }).catch(() => {}); return () => { song = false } }, [mon])
  const [tab, setTab] = useState<TabKhoDe>(NHO.tab)
  // tab trạng thái đề thi người dùng đứng gần nhất — bấm "Đề thi" từ "Đề cương" quay lại đúng chỗ đó
  const tabDeThiCuoi = useRef<TabKhoDe>(NHO.tab === 'de_cuong' ? 'cho_duyet' : NHO.tab)
  useEffect(() => { if (tab !== 'de_cuong') tabDeThiCuoi.current = tab }, [tab])
  const [tim, setTim] = useState(NHO.tim)
  const [rows, setRows] = useState<DeThiDong[]>(NHO.coDuLieu ? NHO.rows : [])
  const [het, setHet] = useState(NHO.het)
  const [loading, setLoading] = useState(!NHO.coDuLieu)
  const [them, setThem] = useState(false)
  const [dem, setDem] = useState<Record<TabKhoDe, number> | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [tao, setTao] = useState(false)
  const cuon = useRef<HTMLDivElement>(null)
  const lanDau = useRef(true)

  const nho = (r: DeThiDong[], h: boolean) => { Object.assign(NHO, { mon, khoi, ky, namHoc, tab, tim, rows: r, het: h, coDuLieu: true }) }
  // Đổi NGỮ CẢNH (môn / khối / kỳ / năm học / tab / từ khoá) ⇒ tải lại từ đầu. Lần mount đầu mà đã có cache đúng ngữ cảnh ⇒ dùng cache.
  useEffect(() => {
    if (lanDau.current) {
      lanDau.current = false
      if (NHO.coDuLieu && NHO.mon === mon && NHO.khoi === khoi && NHO.ky === ky && NHO.namHoc === namHoc && NHO.tab === tab && NHO.tim === tim) {
        requestAnimationFrame(() => { if (cuon.current) cuon.current.scrollTop = NHO.scrollTop })
        return
      }
    }
    let song = true
    setLoading(true); setLoi(null); setRows([])
    const t = setTimeout(() => {
      listKhoDeThi(mon, khoi, tab, tim, ky, namHoc).then((r) => { if (song) { setRows(r); setHet(r.length < 25); nho(r, r.length < 25) } })
        .catch((e) => { if (song) setLoi(e.message ?? String(e)) }).finally(() => { if (song) setLoading(false) })
    }, tim ? 300 : 0)
    return () => { song = false; clearTimeout(t) }
  }, [mon, khoi, ky, namHoc, tab, tim]) // eslint-disable-line
  useEffect(() => { let song = true; demKhoDeThi(mon, khoi, ky, namHoc).then((d) => { if (song) setDem(d) }).catch(() => {}); return () => { song = false } }, [mon, khoi, ky, namHoc, openId])

  async function taiThem() {
    if (!rows.length) return
    setThem(true)
    try { const r = await listKhoDeThi(mon, khoi, tab, tim, ky, namHoc, rows[rows.length - 1].created_at); const all = [...rows, ...r]; setRows(all); setHet(r.length < 25); nho(all, r.length < 25) }
    catch (e: any) { setLoi(e.message ?? String(e)) } finally { setThem(false) }
  }
  // Quay lại từ màn sửa: làm mới NỀN đúng trang đang xem (không xoá danh sách, không cuộn về đầu).
  function dongDe() {
    setOpenId(null)
    listKhoDeThi(mon, khoi, tab, tim, ky, namHoc).then((r) => {
      setRows((prev) => { const moi = new Map(r.map((x) => [x.id, x])); const giu = prev.filter((x) => !moi.has(x.id) && x.created_at < (r[r.length - 1]?.created_at ?? '')); const all = [...r, ...giu]; nho(all, het); return all })
    }).catch(() => {})
    requestAnimationFrame(() => { if (cuon.current) cuon.current.scrollTop = NHO.scrollTop })
  }

  if (openId) return <DeThiSoan id={openId} onClose={dongDe} tuKho />

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">Kho đề thi</span>
        {allowedMons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        )}
        {/* Bộ lọc LOẠI tài liệu: Đề thi | Đề cương (CEO 12/10). Đề thi mới có 3 tab trạng thái bên cạnh. */}
        <div className="flex gap-0.5 rounded-lg bg-indigo-50 p-0.5" title="Loại tài liệu">
          {([['de_thi', 'Đề thi'], ['de_cuong', 'Đề cương']] as const).map(([k, ten]) => {
            const bat = (k === 'de_cuong') === (tab === 'de_cuong')
            const n = dem ? (k === 'de_cuong' ? dem.de_cuong : dem.cho_duyet + dem.san_sang) : null
            return (
              <button key={k} onClick={() => { if (!bat) setTab(k === 'de_cuong' ? 'de_cuong' : tabDeThiCuoi.current) }}
                className={`rounded-md px-3 py-1 text-[13px] font-semibold ${bat ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-700 hover:bg-indigo-100'}`}>
                {ten}{n !== null ? <span className={`ml-1.5 rounded-full px-1.5 text-[11px] ${bat ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-700'}`}>{n}</span> : null}
              </button>
            )
          })}
        </div>
        {tab !== 'de_cuong' && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {TABS.filter((t) => t.key !== 'de_cuong').map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {t.ten}{dem ? <span className={`ml-1.5 rounded-full px-1.5 text-[11px] ${tab === t.key ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'}`}>{dem[t.key]}</span> : null}
              </button>
            ))}
          </div>
        )}
        <select value={khoi ?? ''} onChange={(e) => setKhoi(e.target.value || null)} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[13px] text-slate-700">
          <option value="">Mọi khối</option>
          {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        {/* Lọc KỲ (Thùy 20/10) — áp cho cả Đề thi lẫn Đề cương; kỳ suy từ tên đề, sửa tay ở "Thông tin đề" */}
        <select value={ky ?? ''} onChange={(e) => setKy((e.target.value || null) as KyDe | null)} title="Kỳ thi" className={`rounded-md border px-2 py-1.5 text-[13px] ${ky ? 'border-indigo-300 bg-indigo-50 font-medium text-indigo-700' : 'border-slate-200 bg-white text-slate-700'}`}>
          <option value="">Mọi kỳ</option>
          {KY_DE.map((k) => <option key={k.key} value={k.key}>{k.ten}</option>)}
        </select>
        {/* Lọc NĂM HỌC (Thùy 20/10) — suy ở DB từ tên đề + năm, sửa tay ở "Thông tin đề" */}
        <select value={namHoc ?? ''} onChange={(e) => setNamHoc(e.target.value || null)} title="Năm học" className={`rounded-md border px-2 py-1.5 text-[13px] ${namHoc ? 'border-indigo-300 bg-indigo-50 font-medium text-indigo-700' : 'border-slate-200 bg-white text-slate-700'}`}>
          <option value="">Mọi năm học</option>
          {(dsNamHoc?.nam ?? []).map((n) => <option key={n} value={String(n)}>{tenNamHoc(n)}</option>)}
          {dsNamHoc?.co_chua_ro && <option value="chua_ro">Chưa rõ năm học</option>}
          {namHoc && namHoc !== 'chua_ro' && !(dsNamHoc?.nam ?? []).includes(+namHoc) && <option value={namHoc}>{tenNamHoc(+namHoc)}</option>}
        </select>
        <input value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm theo tên đề…" className="w-64 rounded-md border border-slate-200 px-2.5 py-1.5 text-[13px] focus:border-indigo-400 focus:outline-none" />
        <button onClick={() => setTao(true)} className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">+ Tạo đề trống</button>
      </div>
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-1.5 text-[12px] text-slate-500">
        {tab === 'de_cuong'
          ? <>Đề cương ôn tập (không phải đề thi) — lọc riêng, không lẫn vào Chờ duyệt / Sẵn sàng / Đã giao của đề thi. Mở đề để xem / sửa câu, in hoặc giao như đề thường.</>
          : <>Đề mới: thả file (Word / PDF) vào <code className="rounded bg-white px-1">E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L&lt;khối&gt;</code> rồi gọi Claude chạy <code className="rounded bg-white px-1">/nhap-de-thi &lt;khối&gt;</code> — đề hiện ở tab Chờ duyệt.</>}
      </div>

      <div ref={cuon} onScroll={(e) => { NHO.scrollTop = (e.target as HTMLDivElement).scrollTop }} className="min-h-0 flex-1 overflow-auto p-6">
        {loi ? <p className="text-sm text-rose-600">Không tải được: {loi}</p>
          : loading && rows.length === 0 ? <p className="text-sm text-slate-400">Đang tải…</p>
          : rows.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">{tab === 'de_cuong' ? 'Chưa có đề cương nào.' : 'Không có đề nào ở tab này.'}</div>
          : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th className="px-4 py-2">Đề</th><th className="px-3 py-2">Khối</th><th className="px-3 py-2">Số câu</th><th className="px-3 py-2">Tình trạng</th>
                    {tab === 'da_giao' && <th className="px-3 py-2">Đã giao</th>}<th className="px-3 py-2">Nhập ngày</th></tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} onClick={() => setOpenId(r.id)} className="cursor-pointer border-t border-slate-100 hover:bg-indigo-50/40">
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-slate-800">{r.ten}</div>
                        <div className="text-[12px] text-slate-400">{[TEN_KY[r.ky], r.nam_hoc != null ? `năm học ${tenNamHoc(r.nam_hoc)}` : null, r.nguon && r.nguon !== 'le' && r.nguon !== 'noctorium' ? r.nguon : null, r.co_de_goc ? '📎 có đề gốc' : null].filter(Boolean).join(' · ')}</div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">{r.khoi}</td>
                      <td className="px-3 py-2.5 text-slate-600">{r.so_cau}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {r.duyet_at && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11.5px] font-medium text-emerald-700">✓ đã duyệt {ngayVN(r.duyet_at)}</span>}
                          {r.so_chan > 0 && <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11.5px] font-medium text-rose-700">{r.so_chan} câu thiếu đáp án</span>}
                          {r.so_chua_dang > 0 && <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[11.5px] text-amber-800">{r.so_chua_dang} câu chưa đủ dạng</span>}
                          {r.so_canh_bao_nhap > 0 && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[11.5px] text-sky-800">{r.so_canh_bao_nhap} ghi chú lúc nhập</span>}
                          {!r.duyet_at && !r.so_chan && !r.so_chua_dang && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11.5px] text-slate-600">đủ dữ liệu · chờ duyệt</span>}
                        </div>
                      </td>
                      {tab === 'da_giao' && <td className="px-3 py-2.5 text-slate-600">{r.so_luot} lượt{r.luot_gan_nhat ? ` · gần nhất ${ngayVN(r.luot_gan_nhat)}` : ''}</td>}
                      <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{ngayVN(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!het && (
                <div className="flex justify-center border-t border-slate-100 py-2.5">
                  <button onClick={taiThem} disabled={them} className="rounded-md border border-slate-200 bg-white px-4 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 disabled:opacity-40">{them ? 'Đang tải…' : '↓ Tải thêm 25 đề'}</button>
                </div>
              )}
            </div>
          )}
      </div>
      {tao && <TaoDeTrong mon={mon} onClose={() => setTao(false)} onCreated={(id) => { setTao(false); setOpenId(id) }} />}
    </div>
  )
}

function TaoDeTrong({ mon, onClose, onCreated }: { mon: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [busy, setBusy] = useState(false)
  async function tao() { if (!ten.trim()) return; setBusy(true); try { const d = await createDeThi({ ten: ten.trim(), khoi, mon }); onCreated(d.id) } finally { setBusy(false) } }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[440px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Tạo đề trống</p>
        <p className="mt-1 text-[12px] text-slate-500">Dùng khi tự ghép đề từ câu đã có trong kho. Đề từ file thì để Claude nhập.</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên đề</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} className={`${inp} mt-1 w-full`} />
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Khối</label>
        <div className="mt-1 flex flex-wrap gap-1.5">{KHOI_OPTIONS.map((k) => <button key={k} onClick={() => setKhoi(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${khoi === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{k}</button>)}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!ten.trim() || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════ MÀN SỬA ĐỀ (gộp Sửa + Duyệt) ═══════════
type NoiDungCau = { ma_cau: string; noi_dung: string | null; anh_de: string | null; loi_giai: string | null; anh_dap_an: string | null; ngu_lieu?: string | null; thu_tu_trong_ngu_lieu?: number | null }
type NguLieuDe = { ma_ngu_lieu: string; loai: string; tieu_de: string | null; noi_dung: string; anh: string | null; am_thanh: string | null }
// Nội dung câu + NGỮ LIỆU (đoạn văn/thông báo/biển báo — chỉ kho có bảng ngữ liệu theo registry `nguLieuTbl`).
async function taiNoiDung(mon: string, caus: DeThiCau[]): Promise<{ nd: Record<string, NoiDungCau>; nl: Record<string, NguLieuDe> }> {
  const out: Record<string, NoiDungCau> = {}
  const nl: Record<string, NguLieuDe> = {}
  const theoKho = new Map<Kho, string[]>()
  for (const c of caus) theoKho.set(c.kho, [...(theoKho.get(c.kho) ?? []), c.ma_cau])
  for (const [kho, mas] of theoKho) {
    const bang = bangCuaKho(mon, kho)
    const { data, error } = await supabase.from(bang.cauTbl)
      .select('ma_cau, noi_dung, anh_de, loi_giai, anh_dap_an' + (bang.nguLieuTbl ? ', ngu_lieu, thu_tu_trong_ngu_lieu' : '')).in('ma_cau', mas).limit(1000)
    if (error) throw error
    const rows = (data ?? []) as unknown as NoiDungCau[]
    for (const r of rows) out[r.ma_cau] = r
    const ids = [...new Set(rows.map((r) => r.ngu_lieu).filter((x): x is string => !!x))]
    if (bang.nguLieuTbl && ids.length) {
      const { data: d2, error: e2 } = await supabase.from(bang.nguLieuTbl).select('ma_ngu_lieu, loai, tieu_de, noi_dung, anh, am_thanh').in('ma_ngu_lieu', ids).limit(1000)
      if (e2) throw e2
      for (const r of (d2 ?? []) as NguLieuDe[]) nl[r.ma_ngu_lieu] = r
    }
  }
  return { nd: out, nl }
}
async function taiTenDang(mon: string, caus: Pick<DeThiCau, 'kho' | 'dang_chinh' | 'menh_de'>[]): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  const theoKho = new Map<Kho, Set<string>>()
  for (const c of caus) {
    const s = theoKho.get(c.kho) ?? new Set<string>()
    if (c.dang_chinh) s.add(c.dang_chinh)
    for (const m of c.menh_de ?? []) if (m.ma_dang) s.add(m.ma_dang)
    theoKho.set(c.kho, s)
  }
  for (const [kho, s] of theoKho) {
    if (!s.size) continue
    const { data } = await supabase.from(bangCuaKho(mon, kho).banDoTbl).select('ma_dang, ten_dang').in('ma_dang', [...s]).limit(1000)
    for (const r of (data ?? []) as { ma_dang: string; ten_dang: string }[]) out[r.ma_dang] = r.ten_dang
  }
  return out
}

export function DeThiSoan({ id, onClose, tuKho }: { id: string; onClose: () => void; tuKho?: boolean }) {
  const [d, setD] = useState<DeThi | null>(null)
  const [ten, setTen] = useState('')
  const [meta, setMeta] = useState<DeThiMeta | null>(null)
  const [phans, setPhans] = useState<TaiLieuPhan[]>([])
  const [caus, setCaus] = useState<DeThiCau[] | null>(null)
  const [nd, setNd] = useState<Record<string, NoiDungCau>>({})
  const [nl, setNl] = useState<Record<string, NguLieuDe>>({})
  const [tenDang, setTenDang] = useState<Record<string, string>>({})
  const [moi, setMoi] = useState<Record<string, DangMoi>>({})        // chỗ của câu trên BẢN ĐỒ MỚI (Thùy 20/10)
  const [pickMoi, setPickMoi] = useState<DeThiCau | null>(null)
  const [thieu, setThieu] = useState<DeThiThieu | null>(null)
  const [chiCanXem, setChiCanXem] = useState(false)
  const [xemGoc, setXemGoc] = useState(false)
  const [pick, setPick] = useState<{ c: DeThiCau; md: number | null } | null>(null)
  const [themVao, setThemVao] = useState<string | null>(null) // id phần đang thêm câu có sẵn
  const [printing, setPrinting] = useState(false)
  const [giao, setGiao] = useState(false)
  const [lamMoiLuot, setLamMoiLuot] = useState(0)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [saved, setSaved] = useState(false)                    // "✓ Đã lưu" như builder giáo trình
  const [xemPhan, setXemPhan] = useState<string | null>(null)  // 👁 Xem nhanh bản in 1 phần
  const pdfRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (!saved) return; const t = setTimeout(() => setSaved(false), 2000); return () => clearTimeout(t) }, [saved])
  // Lưu thường ⇒ chỉ bật badge "✓ Đã lưu"; thông báo khác (duyệt, gửi nhận xét, lỗi) mới hiện chữ.
  const flash = (ok: boolean, t: string) => { if (ok && t === 'Đã lưu') { setSaved(true); return } setMsg({ ok, t }); if (ok) setSaved(true); setTimeout(() => setMsg(null), ok ? 2500 : 7000) }
  // "✎ Cần sửa" (Thùy 17/10): nhận xét cho từng CÂU (không rút khỏi đề — đề giữ cấu trúc) và cho CẢ ĐỀ
  const nxCau = useNhanXet('cau')
  const nxDe = useNhanXet('de_thi')
  const monDe: MonNX = d?.mon === 'KHTN' ? 'khtn' : d?.mon === 'Tiếng Anh' ? 'anh' : d?.mon === 'TSA' ? 'tsa' : 'toan'

  // Tải lại CẤU TRÚC (phần + câu) ở nền — giữ nguyên danh sách đang hiện tới khi có bản mới.
  async function taiCau(deMon: string) {
    const [ps, cs] = await Promise.all([listPhanDeThi(id), deThiCau(id)])
    const [n, td, th, dm] = await Promise.all([taiNoiDung(deMon, cs), taiTenDang(deMon, cs), deThiThieu(id), dangMoiCuaDe(id)])
    setPhans(ps); setCaus(cs); setNd(n.nd); setNl((s) => ({ ...s, ...n.nl })); setTenDang((s) => ({ ...s, ...td })); setThieu(th)
    setMoi(Object.fromEntries(dm.map((x) => [x.ma_cau, x])))
  }
  useEffect(() => {
    (async () => {
      const de = await getDeThi(id)
      setD(de); setTen(de.ten); setMeta(deThiMeta(de))
      await taiCau(de.mon)
    })().catch((e) => flash(false, e.message ?? String(e)))
  }, [id]) // eslint-disable-line

  const ghiChu = useMemo(() => (d ? canhBaoNhap(d) : {}), [d])
  const nhanGoc = useMemo(() => (d ? nhanGocCau(d) : {}), [d])
  // Nhóm BÀI: câu kho đã tách ý (2a–2d) hiện lại thành MỘT bài có 4 ý — đề giữ cấu trúc gốc, kho vẫn là câu riêng (CEO 13/10)
  const nhomCua = useMemo(() => {
    const m = new Map<string, { nhan: string; dan: string; y: string; n: number }>()
    for (const g of d ? nhomBaiCuaDe(d) : []) g.cau.forEach((x) => m.set(x.ma_cau, { nhan: g.nhan, dan: g.dan, y: x.y, n: g.cau.length }))
    return m
  }, [d])
  const loiCua = useMemo(() => new Map((thieu?.cau ?? []).map((x) => [x.ma_cau, x.loi])), [thieu])
  const quetLai = () => { deThiThieu(id).then(setThieu).catch(() => {}) }
  const va = (ma: string, patch: Partial<DeThiCau>) => setCaus((prev) => prev?.map((c) => (c.ma_cau === ma ? { ...c, ...patch } : c)) ?? prev)

  async function sua(c: DeThiCau, patch: SuaCauPatch, localNd?: Partial<NoiDungCau>): Promise<boolean> {
    if (!d) return false
    try {
      await suaCauDeThi(d.mon, c.kho, c.ma_cau, patch, d.id)
      const { noi_dung, loi_giai, anh_de, anh_dap_an, ...cauPatch } = patch; void noi_dung; void loi_giai; void anh_de; void anh_dap_an
      va(c.ma_cau, cauPatch as Partial<DeThiCau>)
      if (localNd) setNd((s) => ({ ...s, [c.ma_cau]: { ...(s[c.ma_cau] ?? { ma_cau: c.ma_cau, noi_dung: null, anh_de: null, loi_giai: null, anh_dap_an: null }), ...localNd } }))
      quetLai(); flash(true, 'Đã lưu')
      return true
    } catch (e: any) { flash(false, e.message ?? String(e)); return false }
  }
  async function chonDang(maDang: string) {
    if (!pick || !d) return
    const { c, md } = pick; setPick(null)
    if (md == null) await sua(c, { dang_chinh: maDang })
    else await sua(c, { menh_de: (c.menh_de ?? []).map((m, i) => (i === md ? { ...m, ma_dang: maDang } : m)) })
    if (!tenDang[maDang]) taiTenDang(d.mon, [{ kho: c.kho, dang_chinh: maDang, menh_de: null }]).then((t) => setTenDang((s) => ({ ...s, ...t })))
  }
  // Bản đồ mới: ghi ở DB (fn_de_thi_gan_dang_moi) rồi VÁ đúng câu đó, quét lại cảnh báo nền.
  async function chonDangMoi(idDich: string) {
    if (!pickMoi) return
    const c = pickMoi; setPickMoi(null)
    try {
      const r = await ganDangMoi(id, c.ma_cau, idDich)
      setMoi((s) => ({ ...s, [c.ma_cau]: { ...s[c.ma_cau], ...r } }))
      quetLai(); flash(true, 'Đã lưu')
    } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function duyet() {
    setBusy(true)
    try {
      const r = await duyetDeThi(id)
      const at = new Date().toISOString()
      setD((x) => (x ? { ...x, duyet_at: at } : x))
      // Duyệt đề = duyệt NỘI DUNG mọi câu; phân dạng là việc riêng, làm sau (Thùy 20/10, mig 202610202045)
      flash(true, `Đã duyệt đề — ${r.so_cau} câu đã duyệt nội dung${r.so_cau_cho_dang ? `; ${r.so_cau_cho_dang} câu còn chờ phân dạng (Duyệt kho › Chưa phân dạng / Bản đồ mới — làm sau)` : ''}.`)
      deThiCau(id).then(setCaus).catch(() => {})
    } catch (e: any) { flash(false, e.message ?? String(e)) } finally { setBusy(false) }
  }
  // ── cấu trúc đề: bớt câu · đổi thứ tự · thêm câu có sẵn · phần ──
  const cauCuaPhan = (pid: string) => (caus ?? []).filter((c) => c.phan_id === pid)
  async function datThuTu(pid: string, mas: string[]) {
    if (!d) return
    try { await setCauOfPhan(pid, mas); await supabase.from('tai_lieu').update({ updated_at: new Date().toISOString() }).eq('id', id); await taiCau(d.mon); flash(true, 'Đã lưu') }
    catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  function boCau(c: DeThiCau) {
    if (!confirm(`Bỏ câu ${c.ma_cau} khỏi đề? (Câu VẪN CÒN trong kho, chỉ gỡ khỏi đề này.)`)) return
    datThuTu(c.phan_id, cauCuaPhan(c.phan_id).map((x) => x.ma_cau).filter((m) => m !== c.ma_cau))
  }
  function doiCho(c: DeThiCau, huong: -1 | 1) {
    const mas = cauCuaPhan(c.phan_id).map((x) => x.ma_cau); const i = mas.indexOf(c.ma_cau); const j = i + huong
    if (i < 0 || j < 0 || j >= mas.length) return
    ;[mas[i], mas[j]] = [mas[j], mas[i]]
    datThuTu(c.phan_id, mas)
  }
  async function themCau(pid: string, maCau: string, kho: Kho) {
    if (!d) return
    try { await themCauVaoPhan(id, pid, maCau, kho); setThemVao(null); const de = await getDeThi(id); setD(de); await taiCau(de.mon); flash(true, `Đã thêm ${maCau}`) }
    catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function themPhan() {
    if (!d) return
    const tieuDe = prompt('Tên phần:', `Phần ${phans.length + 1}`)?.trim(); if (!tieuDe) return
    try { await addPhanDeThi(id, tieuDe); await taiCau(d.mon) } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function xoaPhan(p: TaiLieuPhan) {
    if (!d) return
    if (!confirm(`Xoá "${p.tieu_de}" khỏi đề? ${cauCuaPhan(p.id).length} câu của phần này bị gỡ khỏi đề (câu VẪN CÒN trong kho).`)) return
    try { await deletePhan(p.id); await taiCau(d.mon); flash(true, 'Đã xoá phần') } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  async function luuMeta(patch: Partial<DeThiMeta>) { setMeta((m) => (m ? { ...m, ...patch } : m)); try { await updateDeThiMeta(id, patch); flash(true, 'Đã lưu') } catch (e: any) { flash(false, e.message ?? String(e)) } }
  async function luuTen() { if (d && ten.trim() && ten.trim() !== d.ten) { try { await renameDeThi(id, ten.trim()); setD({ ...d, ten: ten.trim() }); flash(true, 'Đã lưu') } catch (e: any) { flash(false, e.message ?? String(e)) } } }
  async function dinhKemGoc(f: File) { try { const { url } = await uploadKhoFile(f); await attachPdfGoc(id, url); setMeta((m) => (m ? { ...m, pdfGocUrl: url } : m)); setXemGoc(true) } catch (e: any) { flash(false, e.message ?? String(e)) } }
  // Số dòng kẻ câu TỰ LUẬN trên bản in: vá `d.cau_hinh` tại chỗ rồi ghi (không tải lại đề). patch = 1 câu hoặc cả phần.
  async function datSoDong(patch: Record<string, number>) {
    setD((x) => (x ? { ...x, cau_hinh: { ...x.cau_hinh, btvnLinesByCau: { ...soDongDeThi(x), ...patch } } } : x))
    try { await setSoDongDeThi(id, patch); flash(true, 'Đã lưu') } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  // Cấu hình IN theo câu như builder giáo trình (2 cột · chế độ hình · cỡ ảnh · màu): vá `d.cau_hinh` tại chỗ rồi ghi đúng khoá đó.
  async function luuCh(patch: Record<string, unknown>) {
    setD((x) => (x ? { ...x, cau_hinh: tronCauHinh(x.cau_hinh, patch) } : x))
    try { await patchCauHinhDeThi(id, patch); flash(true, 'Đã lưu') } catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  const onAnhMm = (ma: string, v: { pct: number; mm: number } | null) => {
    const co = v && v.mm > 0
    luuCh({ anhMmByCau: { [ma]: co ? v!.mm : null }, anhPctByCau: { [ma]: co ? v!.pct : null } })
  }
  async function doiTenPhan(p: TaiLieuPhan, t: string) {
    try { await updatePhan(p.id, { tieu_de: t }); setPhans((ps) => ps.map((x) => (x.id === p.id ? { ...x, tieu_de: t } : x))); flash(true, 'Đã lưu') }
    catch (e: any) { flash(false, e.message ?? String(e)) }
  }
  function dong() { useStore.getState().enqueueLinkGen(id, 'de_thi'); onClose() }

  if (!d || !meta) return <div className="p-8 text-sm text-slate-400">{msg && !msg.ok ? <span className="text-rose-600">Lỗi: {msg.t}</span> : 'Đang tải đề…'}</div>
  const soChan = thieu?.so_chan ?? 0
  const soChuaDang = thieu?.so_chua_dang ?? 0
  const soGhiChu = Object.keys(ghiChu).length
  const canXem = (c: DeThiCau) => (loiCua.get(c.ma_cau)?.length ?? 0) > 0 || (ghiChu[c.ma_cau]?.length ?? 0) > 0
  const soDong = soDongDeThi(d)
  const ch = d.cau_hinh as { colByCau?: Record<string, number>; hinhCheDoByCau?: Record<string, CheDoHinh>; anhMmByCau?: Record<string, number>; anhPctByCau?: Record<string, number>; mau?: string }
  const jump = (elId: string) => document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <AnhMmEditCtx.Provider value={{ mm: ch.anhMmByCau ?? {}, pct: ch.anhPctByCau ?? {}, set: onAnhMm, baChe: true }}>
    <div className="flex h-full flex-col bg-[#fafafb]">
      {/* Khung như builder giáo trình: thanh trên (tên · tự lưu · Xem/Xuất PDF · màu) · dải tình trạng · cây trái · thẻ phần */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 bg-white px-5 py-2.5">
        <button onClick={dong} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← {tuKho ? 'Kho đề thi' : 'Quay lại'}</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={luuTen} className={`${inp} h-9 min-w-[260px] max-w-[520px] flex-1 font-semibold`} placeholder="Tên đề" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700">{d.mon} · Khối {d.khoi}</span>
        {d.duyet_at && <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">✓ Đã duyệt {ngayVN(d.duyet_at)}</span>}
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition ${saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>{saved ? '✓ Đã lưu' : '↻ Tự động lưu'}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button onClick={() => setGiao(true)} disabled={!caus?.length} className="whitespace-nowrap rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">📱 Giao</button>
          <NutCanSua doiTuong="de_thi" mon={monDe} ma={id} man={`Kho đề thi › ${ten}`} khau="khac"
            onXong={(t) => { nxDe.vaNX(t); flash(true, 'Đã gửi nhận xét cho cả đề — chờ Claude sửa') }} />
          <button onClick={duyet} disabled={busy || !thieu || soChan > 0 || !caus?.length}
            title={soChan ? 'Còn câu thiếu đáp án / phương án — bổ sung rồi mới duyệt được' : 'Xác nhận nội dung + đáp án cả đề. Không cần phân đủ dạng — câu chưa có dạng phân sau.'}
            className="whitespace-nowrap rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-40">
            {busy ? 'Đang duyệt…' : d.duyet_at ? '✅ Duyệt lại' : '✅ Duyệt đề'}
          </button>
          <button onClick={() => setPrinting(true)} disabled={!caus?.length} className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-40">🖨 Xem / Xuất PDF</button>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-500">Màu
            <span className="flex gap-1">{MAU_PRESET.map(([c, n]) => (
              <button key={c} title={n} onClick={() => luuCh({ mau: c })} className={`h-6 w-6 rounded-full border-2 ${(ch.mau ?? '#2D9CDB') === c ? 'border-slate-800' : 'border-white shadow'}`} style={{ background: c }} />
            ))}</span>
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-1.5">
        {thieu && (soChan > 0
          ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[12px] font-medium text-rose-700">{soChan}/{thieu.tong} câu thiếu đáp án</span>
          : <span className="rounded bg-emerald-50 px-2 py-0.5 text-[12px] font-medium text-emerald-700">Đủ đáp án · {thieu.tong} câu</span>)}
        {soChuaDang > 0 && <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] text-amber-800" title="Đề vẫn dùng được; câu chưa có dạng chưa tính mastery cho tới khi gán dạng">{soChuaDang} câu chưa đủ dạng</span>}
        {soGhiChu > 0 && <span className="rounded bg-sky-50 px-2 py-0.5 text-[12px] text-sky-800">{soGhiChu} ghi chú lúc nhập</span>}
        {msg && <span className={`text-[12px] ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>{msg.ok ? '✓ ' : '⚠ '}{msg.t}</span>}
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600"><input type="checkbox" checked={chiCanXem} onChange={(e) => setChiCanXem(e.target.checked)} /> Chỉ câu cần xem</label>
          <input ref={pdfRef} type="file" accept="application/pdf" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) dinhKemGoc(f); e.target.value = '' }} />
          {meta.pdfGocUrl
            ? <button onClick={() => setXemGoc((v) => !v)} className={`rounded-md border px-2.5 py-1 text-[12px] font-medium ${xemGoc ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-300 bg-white text-slate-600 hover:border-indigo-400'}`}>📎 Đề gốc {xemGoc ? '(đang mở)' : ''}</button>
            : <button onClick={() => pdfRef.current?.click()} className="rounded-md border border-dashed border-slate-300 bg-white px-2.5 py-1 text-[12px] font-medium text-slate-500 hover:border-indigo-400">📎 Đính kèm đề gốc</button>}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="w-[270px] shrink-0 overflow-auto border-r border-slate-200 bg-white p-3">
          <CayDe ten={ten} phans={phans} cauCuaPhan={cauCuaPhan} nhanGoc={nhanGoc} nhomCua={nhomCua} loiCua={loiCua} ghiChu={ghiChu} onJump={jump} />
        </aside>
        <div className="min-h-0 min-w-0 flex-1 overflow-auto p-5">
          {nxDe.cua(monDe, id) && <div className="mb-3"><NhanXetCu hienChoSua t={nxDe.cua(monDe, id)} /></div>}
          <div className="mx-auto max-w-[980px] space-y-5">
            <details className="rounded-xl border border-slate-200 bg-white px-4 py-2.5">
              <summary className="cursor-pointer text-[12.5px] font-medium text-slate-600">Thông tin đề: {[meta.nguon, meta.nam, meta.thoiGianPhut ? `${meta.thoiGianPhut} phút` : null, `thang ${meta.thangDiem}`].filter(Boolean).join(' · ')}</summary>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                <O label="Nguồn (trường/sở)"><input defaultValue={meta.nguon} onBlur={(e) => luuMeta({ nguon: e.target.value })} className={inp} /></O>
                <O label="Kỳ"><select value={meta.ky ?? ''} onChange={(e) => luuMeta({ ky: (e.target.value || undefined) as KyDe | undefined })} className={inp}>
                  <option value="">Theo tên đề</option>
                  {KY_DE.map((k) => <option key={k.key} value={k.key}>{k.ten}</option>)}
                </select></O>
                <O label="Năm học"><select value={meta.namHoc ?? ''} onChange={(e) => luuMeta({ namHoc: e.target.value ? +e.target.value : undefined })} className={inp}>
                  <option value="">Theo tên đề</option>
                  {Array.from({ length: 8 }, (_, i) => new Date().getFullYear() + 1 - i).map((n) => <option key={n} value={n}>{tenNamHoc(n)}</option>)}
                </select></O>
                <O label="Cấp"><input defaultValue={meta.cap} onBlur={(e) => luuMeta({ cap: e.target.value })} className={inp} /></O>
                <O label="Năm"><input type="number" defaultValue={meta.nam ?? ''} onBlur={(e) => luuMeta({ nam: e.target.value ? +e.target.value : null })} className={inp} /></O>
                <O label="Thời gian (phút)"><input type="number" defaultValue={meta.thoiGianPhut ?? ''} onBlur={(e) => luuMeta({ thoiGianPhut: e.target.value ? +e.target.value : null })} className={inp} /></O>
                <O label="Thang điểm"><input type="number" defaultValue={meta.thangDiem} onBlur={(e) => luuMeta({ thangDiem: +e.target.value || 10 })} className={inp} /></O>
              </div>
            </details>

            {!caus ? <p className="text-sm text-slate-400">Đang tải câu…</p> : phans.map((p) => {
              const cs = cauCuaPhan(p.id)
              const hien = cs.filter((c) => !(chiCanXem && !canXem(c)))
              const nlCua = (c: DeThiCau) => nd[c.ma_cau]?.ngu_lieu ?? null
              return (
                <div key={p.id} id={`p-${p.id}`} className="scroll-mt-3 overflow-hidden rounded-xl border border-indigo-200 bg-white">
                  <div className="flex flex-wrap items-center gap-2 bg-indigo-600 px-3 py-2 text-white">
                    <input key={p.tieu_de ?? ''} defaultValue={p.tieu_de ?? ''} onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== p.tieu_de) doiTenPhan(p, v) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }} title="Bấm để sửa tên phần"
                      className="min-w-[200px] max-w-[420px] flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-[14px] font-bold uppercase tracking-wide text-white outline-none placeholder:text-white/60 hover:border-white/40 focus:border-white focus:bg-white/10" />
                    <span className="text-[12px] text-white/80">{cs.length} câu</span>
                    <span className="ml-auto flex flex-wrap items-center gap-2">
                      {cs.some((c) => coDongKeDeThi(c.loai_cau)) && <DongCaPhan toi onDat={(n) => datSoDong(Object.fromEntries(cs.filter((c) => coDongKeDeThi(c.loai_cau)).map((c) => [c.ma_cau, n])))} />}
                      <button onClick={() => setXemPhan(p.id)} disabled={!cs.length} title="Xem nhanh bản in CHỈ phần này" className="whitespace-nowrap rounded-md bg-white/15 px-2.5 py-1 text-[12px] font-medium text-white hover:bg-white/25 disabled:opacity-40">👁 Xem phần</button>
                      <button onClick={() => setThemVao(themVao === p.id ? null : p.id)} className="whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-50">+ Thêm câu có sẵn trong kho</button>
                      <button onClick={() => xoaPhan(p)} title="Xoá phần khỏi đề (câu vẫn còn trong kho)" className="text-[12px] text-white/70 hover:text-white">✕</button>
                    </span>
                  </div>
                  <div className="space-y-3 p-3">
                  {themVao === p.id && <ThemCauCoSan mon={d.mon} onPick={(ma, kho) => themCau(p.id, ma, kho)} />}
                  {cs.length === 0 && <div className="text-[12px] italic text-slate-400">Phần chưa có câu — bấm “+ Thêm câu có sẵn trong kho”.</div>}
                  <div className="space-y-3">
                    {hien.map((c, k) => {
                      const i = cs.indexOf(c)
                      const maNl = nlCua(c)
                      const moiNl = maNl && nl[maNl] && (k === 0 || nlCua(hien[k - 1]) !== maNl)
                      const gr = nhomCua.get(c.ma_cau)
                      const dauBai = gr && (k === 0 || nhomCua.get(hien[k - 1].ma_cau)?.nhan !== gr.nhan)
                      return (
                        <div key={c.ma_cau} id={`c-${c.ma_cau}`} className={`scroll-mt-3 ${gr ? 'ml-3 border-l-2 border-indigo-200 pl-3' : ''}`}>
                          {dauBai && (
                            <div className="-ml-3 mb-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="text-[14px] font-bold text-indigo-800">{gr!.nhan}</span>
                                <span className="text-[11px] text-indigo-500">{gr!.n} ý — mỗi ý là một câu riêng trong kho</span>
                              </div>
                              {gr!.dan && <div className="mt-1 text-[14px] leading-relaxed text-slate-800"><ChuMon mon={d.mon}>{gr!.dan}</ChuMon></div>}
                            </div>
                          )}
                          {moiNl && <NguLieuBlock nl={nl[maNl!]} />}
                          <CauThe nx={nxCau.cua(monTuKho(c.kho), c.ma_cau)} onCanSua={(t) => { nxCau.vaNX(t); flash(true, `Đã gửi nhận xét ${c.ma_cau} — chờ Claude sửa`) }} c={c} mon={d.mon} so={i + 1} nd={nd[c.ma_cau]} tenDang={tenDang} moi={moi[c.ma_cau]} onChonMoi={() => setPickMoi(c)} loi={loiCua.get(c.ma_cau) ?? []} ghiChu={ghiChu[c.ma_cau] ?? []} nhan={nhanGoc[c.ma_cau]} nhom={gr ? { y: gr.y, dan: gr.dan } : undefined}
                            dau={i === 0} cuoi={i === cs.length - 1}
                            soDong={soDong[c.ma_cau] ?? dongMacDinhDeThi(c.loai_cau)} onSoDong={(n) => datSoDong({ [c.ma_cau]: n })}
                            cot={ch.colByCau?.[c.ma_cau] ?? 1} onCot={(n) => luuCh({ colByCau: { [c.ma_cau]: n } })}
                            cheDo={ch.hinhCheDoByCau?.[c.ma_cau] ?? 'hien'} onCheDo={(v) => luuCh({ hinhCheDoByCau: { [c.ma_cau]: v } })}
                            onChonDang={(md) => setPick({ c, md })} onSua={(patch, localNd) => sua(c, patch, localNd)}
                            onBo={() => boCau(c)} onDoiCho={(h) => doiCho(c, h)} />
                        </div>
                      )
                    })}
                  </div>
                  </div>
                </div>
              )
            })}
            {caus && <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-2.5 text-[13px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">+ Thêm phần</button>}
            <DaGanPanel deId={id} lamMoi={lamMoiLuot} />
            <LuotThiPanel deId={id} lamMoi={lamMoiLuot} />
          </div>
        </div>
        {xemGoc && meta.pdfGocUrl && (
          <div className="flex w-[46%] min-w-[420px] flex-col border-l border-slate-200 bg-white">
            <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-1.5 text-[12px] text-slate-500">
              Đề gốc <a href={meta.pdfGocUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">mở tab mới</a>
              <button onClick={() => setXemGoc(false)} className="ml-auto text-slate-400 hover:text-rose-600">✕ Đóng</button>
            </div>
            <iframe title="Đề gốc" src={meta.pdfGocUrl} className="min-h-0 flex-1" />
          </div>
        )}
      </div>

      {pickMoi && <ChonDangMoi khoi={d.khoi} kho={pickMoi.kho} laDS={pickMoi.loai_cau === 'dung_sai'} hien={moi[pickMoi.ma_cau]?.id ?? null} onClose={() => setPickMoi(null)} onPick={chonDangMoi} />}
      {pick && <DangPickerOne khoi={d.khoi} mon={d.mon} nhanh={nhanhCuaKhoPicker(pick.c.kho)} onClose={() => setPick(null)} onPick={(ma) => chonDang(ma)} />}
      {printing && <DeThiPrintView id={id} onClose={() => setPrinting(false)} />}
      {xemPhan && <DeThiPrintView id={id} onlyPhanId={xemPhan} onClose={() => setXemPhan(null)} />}
      {giao && <GiaoDeModal de={d} thoiGianMacDinh={meta.thoiGianPhut} onClose={() => setGiao(false)} onDone={() => setLamMoiLuot((n) => n + 1)} />}
    </div>
    </AnhMmEditCtx.Provider>
  )
}

// Cây trái (như builder giáo trình): Phần → Câu, chấm màu = tình trạng (đỏ: chặn duyệt · vàng: cần xem · xanh: ổn). Bấm = nhảy tới.
function CayDe({ ten, phans, cauCuaPhan, nhanGoc, nhomCua, loiCua, ghiChu, onJump }: {
  ten: string; phans: TaiLieuPhan[]; cauCuaPhan: (pid: string) => DeThiCau[]; nhanGoc: Record<string, string>
  nhomCua: Map<string, { nhan: string; y: string }>; loiCua: Map<string, LoiDeThi[]>; ghiChu: Record<string, string[]>; onJump: (elId: string) => void
}) {
  const item = 'flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-[13px] hover:bg-slate-100'
  return (
    <div>
      <div className="mb-2 truncate px-1 text-[13px] font-bold text-slate-700">📄 {ten || 'Đề thi'}</div>
      {phans.length === 0 && <div className="px-2 py-3 text-[12px] italic text-slate-400">Chưa có phần.</div>}
      {phans.map((p) => {
        const cs = cauCuaPhan(p.id)
        return (
          <div key={p.id} className="mb-1">
            <button onClick={() => onJump(`p-${p.id}`)} className={`${item} font-semibold text-indigo-700`}>
              <span className="min-w-0 flex-1 truncate">📑 {p.tieu_de}</span><span className="shrink-0 text-[11px] font-normal text-slate-300">{cs.length}</span>
            </button>
            <div className="ml-2 border-l border-slate-100 pl-1">
              {cs.map((c, i) => {
                const loi = loiCua.get(c.ma_cau) ?? []
                const chan = loi.some((x) => !CHI_CANH_BAO.has(x))
                const canh = loi.length > 0 || (ghiChu[c.ma_cau]?.length ?? 0) > 0
                const gr = nhomCua.get(c.ma_cau)
                const nhan = gr ? `${gr.nhan} ${gr.y})` : (nhanGoc[c.ma_cau] ?? `Câu ${i + 1}`)
                return (
                  <button key={c.ma_cau} onClick={() => onJump(`c-${c.ma_cau}`)} className={`${item} text-[12px] text-slate-600`} title={c.ma_cau}>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.xoa ? 'bg-slate-300' : chan ? 'bg-rose-500' : canh ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                    <span className="min-w-0 flex-1 truncate">{nhan}</span>
                    <span className="shrink-0 font-mono text-[10px] text-slate-300">{c.ma_cau}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function O({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</label>{children}</div>
}

// Tìm câu ĐÃ CÓ trong kho để gắn vào đề (không tạo bản sao). Chọn kho trước vì đề Toán trộn Đại số + Hình giải tích.
function ThemCauCoSan({ mon, onPick }: { mon: string; onPick: (maCau: string, kho: Kho) => void }) {
  const KHOS: { kho: Kho; ten: string }[] = KHO_DE_CUA_MON[mon] ?? KHO_DE_CUA_MON['Toán']
  const [kho, setKho] = useState<Kho>(KHOS[0].kho)
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<CauTimThay[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const term = q.trim()
    if (!term) { setRows([]); return }
    setLoading(true)
    const t = setTimeout(() => { searchCau(term, bangCuaKho(mon, kho).cauTbl).then(setRows).catch(() => setRows([])).finally(() => setLoading(false)) }, 300)
    return () => clearTimeout(t)
  }, [q, kho, mon])
  return (
    <div className="mb-3 rounded-xl border border-sky-200 bg-sky-50/50 p-3">
      <div className="flex items-center gap-2">
        {KHOS.length > 1 && <div className="flex gap-0.5 rounded-lg bg-white p-0.5">{KHOS.map((k) => <button key={k.kho} onClick={() => setKho(k.kho)} className={`rounded-md px-2.5 py-1 text-[12px] font-medium ${kho === k.kho ? 'bg-sky-600 text-white' : 'text-slate-500'}`}>{k.ten}</button>)}</div>}
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Gõ mã câu hoặc một đoạn nội dung…" className={`${inp} flex-1 bg-white`} />
      </div>
      {loading && <p className="mt-1 text-[12px] text-slate-400">Đang tìm…</p>}
      {!!rows.length && (
        <div className="mt-2 max-h-56 space-y-1.5 overflow-auto">
          {rows.map((c) => (
            <button key={c.ma_cau} onClick={() => onPick(c.ma_cau, kho)} className="block w-full rounded-lg border border-slate-200 bg-white p-2.5 text-left hover:border-sky-400">
              <div className="mb-0.5 flex items-center gap-2 text-[11px]"><span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500">{c.ma_cau}</span><span className="text-slate-400">{c.dangTen}</span></div>
              <div className="truncate text-[13px] text-slate-700"><ChuMon mon={mon}>{c.noi_dung}</ChuMon></div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Chọn chỗ trên BẢN ĐỒ MỚI: câu thường ⇒ dạng bài; câu Đúng/Sai ⇒ chủ đề (kho Đ/S cấp chủ đề, Thùy 18/10 + 20/10).
// Danh sách đích đọc từ DB theo khối + nhánh của kho câu (fn_de_thi_dich_moi); mặc định khối của đề, đổi được.
function ChonDangMoi({ khoi: khoiDe, kho, laDS, hien, onClose, onPick }: { khoi: string; kho: Kho; laDS: boolean; hien: string | null; onClose: () => void; onPick: (id: string) => void }) {
  const [khoi, setKhoi] = useState(khoiDe)
  const [dich, setDich] = useState<DichMoi | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const [tim, setTim] = useState('')
  useEffect(() => { let song = true; setDich(null); setLoi(null); dichMoi(khoi, kho).then((r) => { if (song) setDich(r) }).catch((e) => { if (song) setLoi(e.message ?? String(e)) }); return () => { song = false } }, [khoi, kho])
  const t = tim.trim().toLowerCase()
  const nhomTheoCd = useMemo(() => {
    const m = new Map<string, DichMoi['dang_bai']>()
    for (const x of dich?.dang_bai ?? []) if (!t || `${x.ten} ${x.nhom} ${x.chuyen_de} ${x.chu_de} ${x.id}`.toLowerCase().includes(t)) m.set(x.chu_de, [...(m.get(x.chu_de) ?? []), x])
    return [...m]
  }, [dich, t])
  const nut = (id: string, children: React.ReactNode) => (
    <button key={id} onClick={() => onPick(id)} className={`block w-full rounded-lg border px-2.5 py-1.5 text-left text-[13px] ${id === hien ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>{children}</button>
  )
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[620px] max-w-full flex-col rounded-2xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[15px] font-semibold text-slate-900">{laDS ? 'Chọn chủ đề (kho Đúng/Sai)' : 'Chọn dạng bài — bản đồ mới'}</p>
          <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className="ml-auto rounded-md border border-slate-200 px-2 py-1 text-[13px]">
            {KHOI_OPTIONS.map((k) => <option key={k} value={k}>Khối {k}</option>)}
          </select>
          <button onClick={onClose} className="text-[13px] text-slate-400 hover:text-slate-700">✕</button>
        </div>
        {laDS && <p className="mt-1 text-[12px] text-slate-500">Câu Đúng/Sai có 4 ý thuộc nhiều dạng khác nhau nên chỉ gắn CHỦ ĐỀ, không gắn dạng bài.</p>}
        {!laDS && <input autoFocus value={tim} onChange={(e) => setTim(e.target.value)} placeholder="Tìm dạng bài, nhóm, mã…" className={`${inp} mt-2 w-full`} />}
        <div className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-auto">
          {loi ? <p className="text-[13px] text-rose-600">Không tải được: {loi}</p>
            : !dich ? <p className="text-[13px] text-slate-400">Đang tải…</p>
            : laDS ? (dich.chu_de.length ? dich.chu_de.map((cd) => nut(cd.id, <><span className="font-medium text-slate-800">{cd.ten}</span> <span className="font-mono text-[11px] text-slate-400">{cd.id}</span></>))
                                         : <p className="text-[13px] text-slate-400">Khối {khoi} chưa có chủ đề nào ở bản đồ mới.</p>)
            : nhomTheoCd.length ? nhomTheoCd.map(([cd, ds]) => (
                <div key={cd}>
                  <div className="sticky top-0 bg-white py-1 text-[12px] font-semibold text-indigo-700">{cd}</div>
                  <div className="space-y-1">{ds.map((x) => nut(x.id, <><span className="text-slate-800">{x.ten}</span><span className="block text-[11px] text-slate-400">{x.chuyen_de} › {x.nhom} · {x.id}</span></>))}</div>
                </div>
              ))
            : <p className="text-[13px] text-slate-400">{t ? 'Không có dạng bài khớp.' : `Khối ${khoi} chưa có dạng bài nào ở bản đồ mới.`}</p>}
        </div>
      </div>
    </div>
  )
}

// Ô số dòng kẻ (0–50) — ghi khi rời ô / Enter, không ghi từng phím. `key` theo giá trị để "đặt cả phần" đổi được ô từng câu.
const kepDong = (v: string) => Math.max(0, Math.min(50, Math.round(+v || 0)))
function ODong({ value, onDat, title }: { value: number | ''; onDat: (n: number) => void; title: string }) {
  return <input key={value} type="number" min={0} max={50} defaultValue={value} title={title} placeholder="—"
    onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
    onBlur={(e) => { if (e.target.value === '') return; const n = kepDong(e.target.value); if (n !== value) onDat(n) }}
    className="w-12 rounded border border-slate-200 px-1 py-0.5 text-center text-[12px] text-slate-700 focus:border-indigo-400 focus:outline-none" />
}
// Đặt nhanh số dòng cho MỌI câu tự luận + trả lời ngắn của 1 phần (vd "Phần 2. Tự luận").
function DongCaPhan({ onDat, toi }: { onDat: (n: number) => void; toi?: boolean }) {
  return <label className={`flex items-center gap-1 text-[11px] ${toi ? 'text-white/85' : 'text-slate-400'}`}>Dòng kẻ · cả phần
    <ODong value="" onDat={onDat} title="Gõ số rồi Enter: đặt số dòng kẻ cho MỌI câu tự luận / trả lời ngắn của phần này (bản in)" /></label>
}

function CauThe({ c, mon, so, nd, tenDang, moi, onChonMoi, loi, ghiChu, nhan, nhom, dau, cuoi, soDong, onSoDong, cot, onCot, cheDo, onCheDo, onChonDang, onSua, onBo, onDoiCho, nx, onCanSua }: {
  nx?: TrangThaiNX; onCanSua: (t: TrangThaiNX) => void
  c: DeThiCau; mon: string; so: number; nd?: NoiDungCau; tenDang: Record<string, string>; moi?: DangMoi; onChonMoi: () => void; loi: LoiDeThi[]; ghiChu: string[]; nhan?: string; nhom?: { y: string; dan: string }; dau: boolean; cuoi: boolean
  soDong: number; onSoDong: (n: number) => void
  cot: number; onCot: (n: number) => void; cheDo: CheDoHinh; onCheDo: (v: CheDoHinh) => void
  onChonDang: (md: number | null) => void
  onSua: (patch: SuaCauPatch, localNd?: Partial<NoiDungCau>) => Promise<boolean>
  onBo: () => void; onDoiCho: (huong: -1 | 1) => void
}) {
  const [soan, setSoan] = useState(false)
  const chan = loi.filter((x) => !CHI_CANH_BAO.has(x))
  const vien = c.xoa ? 'border-slate-300 opacity-60' : chan.length ? 'border-rose-200' : (loi.length || ghiChu.length) ? 'border-amber-200' : 'border-slate-200'
  const laDS = c.loai_cau === 'dung_sai'
  const banDoMoi = moi?.he === 'moi'   // kho đã có bản đồ mới ⇒ dạng bài (câu thường) / chủ đề (Đ/S); không thì dạng cũ
  return (
    <div className={`rounded-xl border bg-white p-4 ${vien}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {nhom
          ? <span className="text-[13px] font-bold text-indigo-700" title={`Ý ${nhom.y} của ${nhan ?? ''}`}>{nhom.y})</span>
          : <span className="text-[13px] font-bold text-slate-700">{nhan ?? `Câu ${so}`}</span>}
        {(nhom || nhan) && <span className="text-[11px] text-slate-400">câu {so} của đề</span>}
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{LOAI_TEN[c.loai_cau ?? ''] ?? c.loai_cau}</span>
        <span className="font-mono text-[10px] text-slate-400">{c.ma_cau}</span>
        <span className="text-[11px] text-slate-400">{c.diem} đ</span>
        {c.da_duyet && <span className="text-[11px] text-emerald-600">✓ kho chuẩn</span>}
        {loi.map((x) => <span key={x} className={`rounded px-1.5 py-0.5 text-[11px] ${CHI_CANH_BAO.has(x) ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-700'}`}>{LOI_TEN[x]}</span>)}
        <span className="ml-auto flex items-center gap-1">
          <button disabled={dau} onClick={() => onDoiCho(-1)} title="Đưa lên" className="rounded border border-slate-200 px-1.5 text-[12px] text-slate-500 hover:border-indigo-300 disabled:opacity-30">↑</button>
          <button disabled={cuoi} onClick={() => onDoiCho(1)} title="Đưa xuống" className="rounded border border-slate-200 px-1.5 text-[12px] text-slate-500 hover:border-indigo-300 disabled:opacity-30">↓</button>
          {!c.xoa && <NutCanSua nho doiTuong="cau" mon={monTuKho(c.kho)} ma={c.ma_cau} man={`Kho đề thi · ${nhan ?? `câu ${so}`}`} onXong={onCanSua} />}
          {!c.xoa && <button onClick={() => setSoan((v) => !v)} className={`rounded border px-2 py-0.5 text-[12px] font-medium ${soan ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{soan ? 'Đóng sửa' : '✎ Sửa nội dung'}</button>}
          <button onClick={onBo} title="Bỏ khỏi đề (câu vẫn còn trong kho)" className="rounded border border-slate-200 px-1.5 text-[12px] text-slate-400 hover:border-rose-300 hover:text-rose-600">✕</button>
        </span>
      </div>

      {/* Cấu hình IN của câu — cùng bộ nút với builder giáo trình (dòng kẻ · 2 cột · chế độ hình · cỡ ảnh) */}
      {!c.xoa && (
        <div className="mb-2 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 px-2.5 py-1">
          <span className="text-[11px] font-medium text-slate-400">🖨 Bản in:</span>
          {coDongKeDeThi(c.loai_cau) && <label className="flex items-center gap-1 text-[11px] text-slate-400">dòng
            <ODong value={soDong} onDat={onSoDong} title="Số dòng kẻ để HS viết câu này (bản in) — 0 = không kẻ" /></label>}
          <ColSel value={cot} onChange={onCot} />
          {nd?.anh_de && <CheDoHinhBtn cur={cheDo} onChange={onCheDo} />}
          {nd?.anh_de && <AnhMmCtl ma={c.ma_cau} url={nd.anh_de} />}
        </div>
      )}
      {nx && <div className="mb-2"><NhanXetCu hienChoSua t={nx} /></div>}
      {ghiChu.length > 0 && (
        <ul className="mb-2 space-y-1">
          {ghiChu.map((g, i) => <li key={i} className="rounded-lg bg-sky-50 px-2.5 py-1.5 text-[12.5px] text-sky-900">📝 {g}</li>)}
        </ul>
      )}

      {banDoMoi ? (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-slate-500">{laDS ? 'Chủ đề (kho Đúng/Sai):' : 'Dạng bài:'}</span>
          {moi!.id
            ? <span className="text-slate-700">{moi!.ten} <span className="text-slate-400">{laDS ? `(${moi!.id})` : `· ${moi!.chu_de} (${moi!.id})`}</span></span>
            : <span className="font-medium text-amber-700">{laDS ? 'chưa có chủ đề' : 'chưa có dạng bài'}</span>}
          <button onClick={onChonMoi} disabled={c.xoa} className="rounded border border-indigo-200 px-2 py-0.5 text-[12px] text-indigo-700 hover:bg-indigo-50">{laDS ? 'Chọn chủ đề' : 'Chọn dạng bài'}</button>
        </div>
      ) : (
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-slate-500">{laDS ? 'Dạng của cả câu:' : 'Dạng:'}</span>
          <span className={laDangCho(c.dang_chinh) ? 'font-medium text-amber-700' : 'text-slate-700'}>
            {laDangCho(c.dang_chinh) ? 'chưa có dạng' : `${tenDang[c.dang_chinh!] ?? ''} (${c.dang_chinh})`}
          </span>
          <button onClick={() => onChonDang(null)} disabled={c.xoa} className="rounded border border-indigo-200 px-2 py-0.5 text-[12px] text-indigo-700 hover:bg-indigo-50">Chọn dạng</button>
        </div>
      )}

      {soan
        ? (laDS
            ? <SoanDungSai c={c} nd={nd} onHuy={() => setSoan(false)} onLuu={async (patch, localNd) => { if (await onSua(patch, localNd)) setSoan(false) }} />
            : <SoanCau c={c} nd={nd} onHuy={() => setSoan(false)} onLuu={async (patch, localNd) => { if (await onSua(patch, localNd)) setSoan(false) }} />)
        : (<>
          {nd?.noi_dung && <div className="mb-2 text-[14px] leading-relaxed text-slate-800"><ChuMon mon={mon}>{nhom ? boLoiDan(nd.noi_dung, nhom.dan) : nd.noi_dung}</ChuMon></div>}
          {nd?.anh_de && <div className="mb-2"><AnhXem ma={c.ma_cau} url={nd.anh_de} cheDo={cheDo} /></div>}

          {c.loai_cau === 'trac_nghiem' && (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {(c.lua_chon ?? []).map((o, i) => {
                const chu = 'ABCD'[i]; const dung = (c.dap_an ?? '').trim().toUpperCase() === chu
                return (
                  <button key={i} onClick={() => onSua({ dap_an: chu })} title="Bấm để đặt làm đáp án đúng"
                    className={`flex items-start gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[13px] ${dung ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${dung ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{chu}</span>
                    <span className="min-w-0 flex-1"><ChuMon mon={mon}>{o}</ChuMon></span>
                  </button>
                )
              })}
            </div>
          )}

          {laDS && (
            <div className="space-y-1.5">
              {(c.menh_de ?? []).map((m, i) => (
                <div key={i} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[13px]">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-slate-500">{'abcd'[i]})</span>
                    <span className="min-w-0 flex-1"><ChuMon mon={mon}>{m.noi_dung}</ChuMon></span>
                    {(['D', 'S'] as const).map((v) => (
                      <button key={v} onClick={() => onSua({ menh_de: (c.menh_de ?? []).map((x, j) => (j === i ? { ...x, dap_an: v } : x)) })}
                        className={`w-14 shrink-0 rounded-md border py-0.5 text-[12px] font-medium ${m.dap_an === v ? (v === 'D' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700') : 'border-slate-200 text-slate-400'}`}>
                        {v === 'D' ? 'Đúng' : 'Sai'}
                      </button>
                    ))}
                  </div>
                  {!banDoMoi && <div className="mt-1 flex flex-wrap items-center gap-2 pl-6 text-[12px]">
                    <span className="text-slate-400">Dạng của ý này:</span>
                    <span className={laDangCho(m.ma_dang) ? 'font-medium text-amber-700' : 'text-slate-700'}>{laDangCho(m.ma_dang) ? 'chưa có dạng' : `${tenDang[m.ma_dang] ?? ''} (${m.ma_dang})`}</span>
                    <button onClick={() => onChonDang(i)} disabled={c.xoa} className="rounded border border-indigo-200 px-2 py-0.5 text-indigo-700 hover:bg-indigo-50">Chọn dạng</button>
                  </div>}
                  {m.loi_giai && (
                    <details className="mt-1 pl-6 text-[12.5px] text-slate-600">
                      <summary className="cursor-pointer text-[12px] text-slate-400">Lời giải ý {'abcd'[i]}</summary>
                      <div className="mt-1"><ChuMon mon={mon}>{m.loi_giai}</ChuMon></div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {c.loai_cau === 'tra_loi_ngan' && <DapSoTLN dapSo={c.dap_an ?? ''} onLuu={(v) => onSua({ dap_an: v || null })} />}
          {c.loai_cau === 'tu_luan' && <p className="text-[12px] text-amber-700">Câu tự luận — giữ nguyên để in, học sinh không làm câu này trên app.</p>}

          {(nd?.loi_giai || nd?.anh_dap_an) && (
            <details className="mt-2 rounded-lg bg-slate-50 px-3 py-1.5 text-[13px] text-slate-700">
              <summary className="cursor-pointer text-[12px] font-medium text-slate-500">Lời giải</summary>
              {nd?.loi_giai && <div className="mt-1"><ChuMon mon={mon}>{nd.loi_giai}</ChuMon></div>}
              {nd?.anh_dap_an && <img src={nd.anh_dap_an} alt="hình lời giải" className="mt-2 max-h-72 rounded border border-slate-200" />}
            </details>
          )}
        </>)}
    </div>
  )
}

// Trả lời ngắn: GIỮ FORM ĐỀ GỐC (K5) — ô đáp số, kiểm theo phiếu 4 ô của Bộ. Không còn 4 phương án trắc nghiệm.
function DapSoTLN({ dapSo, onLuu }: { dapSo: string; onLuu: (v: string) => void }) {
  const [v, setV] = useState(dapSo)
  useEffect(() => { setV(dapSo) }, [dapSo])
  const t = v.trim()
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px]">
      <span className="text-slate-500">Đáp số:</span>
      <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => { if (t !== dapSo) onLuu(t) }} className={`${inp} w-32 font-mono`} />
      {t && !hopLePhieu4O(t) && <span className="rounded bg-amber-50 px-2 py-0.5 text-[12px] text-amber-800">không tô được trên phiếu 4 ô (chỉ số 0–9, dấu − ở ô đầu, dấu , ở ô 2–3, tối đa 4 ký tự)</span>}
      {!t && <span className="text-[12px] text-rose-600">chưa có đáp số</span>}
    </div>
  )
}

// Sửa câu trắc nghiệm / trả lời ngắn / tự luận: dùng chung ô sửa câu của kho (xem trước công thức, dán ảnh).
function SoanCau({ c, nd, onLuu, onHuy }: { c: DeThiCau; nd?: NoiDungCau; onLuu: (patch: SuaCauPatch, localNd: Partial<NoiDungCau>) => Promise<void>; onHuy: () => void }) {
  const [it, setIt] = useState<ReviewItem>({
    noi_dung: nd?.noi_dung ?? '', dap_an: c.dap_an ?? '', loi_giai: nd?.loi_giai ?? '', luaChon: c.lua_chon ?? null,
    anhDe: nd?.anh_de ?? null, anhDapAn: nd?.anh_dap_an ?? null, nguonGiai: 'nguoi', approved: true, isGoc: false,
  })
  const [busy, setBusy] = useState(false)
  async function luu() {
    if (!it.noi_dung.trim()) return
    setBusy(true)
    const patch: SuaCauPatch = {
      noi_dung: it.noi_dung.trim(), dap_an: it.dap_an.trim() || null, loi_giai: it.loi_giai.trim() || null,
      lua_chon: it.luaChon && it.luaChon.length ? it.luaChon : null, anh_de: it.anhDe, anh_dap_an: it.anhDapAn,
    }
    try { await onLuu(patch, { noi_dung: patch.noi_dung!, loi_giai: patch.loi_giai ?? null, anh_de: patch.anh_de ?? null, anh_dap_an: patch.anh_dap_an ?? null }) } finally { setBusy(false) }
  }
  return (
    <div>
      <CauEditor item={it} onChange={(p) => setIt((s) => ({ ...s, ...p }))} />
      <div className="mt-2 flex items-center gap-2">
        <button disabled={busy || !it.noi_dung.trim()} onClick={luu} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu câu'}</button>
        <button disabled={busy} onClick={onHuy} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
      </div>
    </div>
  )
}

// Sửa câu Đúng/Sai: đề chung + từng mệnh đề (nội dung + lời giải). Đ/S và dạng từng ý sửa ở chế độ xem.
function SoanDungSai({ c, nd, onLuu, onHuy }: { c: DeThiCau; nd?: NoiDungCau; onLuu: (patch: SuaCauPatch, localNd: Partial<NoiDungCau>) => Promise<void>; onHuy: () => void }) {
  const [noiDung, setNoiDung] = useState(nd?.noi_dung ?? '')
  const [md, setMd] = useState<MenhDe[]>(() => (c.menh_de ?? []).map((m) => ({ ...m })))
  const [busy, setBusy] = useState(false)
  const o = `${inp} resize-y font-mono text-[12.5px] leading-relaxed`
  const dat = (i: number, p: Partial<MenhDe>) => setMd((s) => s.map((m, j) => (j === i ? { ...m, ...p } : m)))
  async function luu() {
    if (!noiDung.trim() || md.some((m) => !m.noi_dung.trim())) return
    setBusy(true)
    const sach = md.map((m) => ({ ...m, noi_dung: m.noi_dung.trim(), loi_giai: m.loi_giai?.trim() || null }))
    try { await onLuu({ noi_dung: noiDung.trim(), menh_de: sach }, { noi_dung: noiDung.trim() }) } finally { setBusy(false) }
  }
  return (
    <div className="space-y-2.5">
      <div>
        <label className="mb-1 block text-[12px] font-semibold text-slate-600">Đề chung</label>
        <MathTextarea value={noiDung} onChange={setNoiDung} className={`${o} min-h-[70px]`} />
        <div className="mt-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[13px] text-slate-700"><MathText>{noiDung}</MathText></div>
      </div>
      {md.map((m, i) => (
        <div key={i} className="rounded-lg border border-slate-200 p-2.5">
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">Ý {'abcd'[i]})</label>
          <MathTextarea value={m.noi_dung} onChange={(v) => dat(i, { noi_dung: v })} className={`${o} min-h-[44px]`} />
          <div className="mt-1 rounded bg-slate-50 px-2 py-1 text-[13px] text-slate-700"><MathText>{m.noi_dung}</MathText></div>
          <label className="mb-1 mt-2 block text-[12px] text-slate-500">Lời giải ý {'abcd'[i]}</label>
          <MathTextarea value={m.loi_giai ?? ''} onChange={(v) => dat(i, { loi_giai: v })} className={`${o} min-h-[44px]`} />
        </div>
      ))}
      <div className="flex items-center gap-2">
        <button disabled={busy || !noiDung.trim() || md.some((m) => !m.noi_dung.trim())} onClick={luu} className="rounded-md bg-indigo-600 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Đang lưu…' : 'Lưu câu'}</button>
        <button disabled={busy} onClick={onHuy} className="text-[13px] text-slate-500 hover:text-slate-700">Huỷ</button>
      </div>
    </div>
  )
}
