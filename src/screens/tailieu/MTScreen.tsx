// Màn "MT" (kỳ thi lớn, "Grand Slam") — soạn nội dung ĐỘC LẬP (nhiều phần/chuyên đề, mỗi phần chọn
// câu theo cơ chế ET: chọn dạng → hệ gợi ý câu ít-dùng-nhất → ✎ Chọn/↻ Đổi — KHÔNG bóc-ảnh như Đề
// thi) rồi GÁN vào buổi (lớp+ngày) khi cần dùng. Khác ET: ET = 1 lớp+ngày cố định lúc tạo; MT tạo
// xong nằm ở Kho tài liệu như 1 MẪU, gán được cho NHIỀU lớp/nhiều lần (giống mô hình Đề thi).
// Phạm vi hiện tại: soạn + gán buổi. Chấm MT trong buổi (Đ/C/S, đóng phase, Elo K=60) = lượt sau.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, type PickItem } from '../../store/useStore'
import { useMonScope } from '../../hooks/useMonScope'
import {
  listMT, createMT, renameMT, deleteMT, addPhanMT, nhanBanMT, ganMTVaoBuoi, listGanMT, pickCuaHinhRow,
  MT_LOAI_DE, mtMeta, mtLoaiDeLabel, type MTGanRow, type MTLoaiDe,
} from '../../lib/mt'
import { homNayVN } from '../../lib/tuan'
import {
  getTaiLieuFull, deletePhan, updatePhan, setCauOfPhan, suggestCauForDang, khoCuaMon, updateTaiLieu, nhanhCuaMon, nhanhChonCuaKhoi, tenNhanh, nhanhCuaCau, fetchCausCuaTaiLieu, coKhoHinh, laMaHinh, HINH_PREFIX,
  ET_FORMS, etFormOf, coFormTn, MT_DIEM_OPTS, DEFAULT_DIEM_MT, maYHinh, diemBaiHinh, type PhanResolved, type CauHinh, type ETForm as ETFormKind, type HinhRowInfo,
} from '../../lib/tailieu'
import { supabase } from '../../lib/supabase'
// Hình (mô hình) trong MT = 1 HÀNG câu như Đại (Thùy 02/09: "pick câu hình phải như ET, có dòng, là câu đấy, in
// cùng"). Chọn bài = ChonYTuCay (CEO 29/10: mô hình gốc → cả chuỗi → tick ý), banInTheoMoHinh dựng đề (preview + in),
// goiYMaDeChoBai sinh mã đề 2/3 (bản KHÁC có sẵn cùng node, không AI sinh mới).
import { banInTheoMoHinh, goiYMaDeChoBai, goiYMaDeBaiKho, DONG_BTVN, type Ban } from '../kho/hinh/SoanTaiLieu'
import ChonYTuCay from '../kho/hinh/ChonYTuCay'
import { loadLuoi, chuoiKetNoi, type Luoi, type BaiToan } from '../../lib/kho/hinh'
import type { MucIn } from '../kho/hinh/HinhPrintView'
import { sigHinh, CHE_DO_HINH, cheDoKe } from '../../lib/kho/hinhGiaoTrinh'
import { buildMaDe as buildMaDeLib, oTrongMaDe, usedMoiDe as usedMoiDeLib, setVarInCh, maDeStale, type BaseItem } from '../../lib/made'
import { listLop, listHSCuaLop, type Lop, type HocSinh } from '../../lib/nhansu'
import { listCauByDang, listLopBac, LOAI_CAU, KHOI_OPTIONS, DEFAULT_KHOI, type CauHoi, type LopBac } from '../../lib/kho/api'
import { MathText, inp } from '../kho/ui'
import { KhoPicker } from './TaiLieuBuilder'
import DangPickerOne from '../../components/DangPickerOne'
import BuoiNgaySelect from '../../components/BuoiNgaySelect'
import SearchSelect from '../../components/SearchSelect'
import MTPrintView from './MTPrintView'
// ⭐ 28/10 (Thùy: "luồng tạo MT làm giống ET mới · chọn nhiều dạng nhiều câu · đổi thứ tự kéo thả / điền vị trí") — kế hoạch
// nhiều dạng bài × N câu + popup chọn câu theo NHÓM của ET bản đồ mới (ETBdmEditor), chỉ ở khối đã chạy bản đồ mới.
import BoChonNhom from './bdm/BoChonNhom'
import ChonCauBdm from './bdm/ChonCauBdm'
import { cayChon, goiYDangBai, etViTri, loiDoc, type ChonBuoi } from '../../lib/tailieuBdm'

const MONS = ['Toán', 'KHTN']
const DEFAULT_ROWS_PER_PHAN = 3
// nhanh = NHÁNH KHO của hàng (null = nhánh mặc định của tài liệu). MT TRỘN nhánh (Thùy 21/08: "toggle chọn bản
// đồ lúc chọn câu" — Đại số / Hình giải tích trong cùng 1 đề, không cứng theo phần) → mọi thao tác tra kho
// (gợi ý câu, ✎ Chọn, mã đề 2/3) đi theo `khoCuaMon(mon, row.nhanh)`; lưu bền ở `cau_hinh.nhanhByCau`.
type Row = { maDang: string | null; maCau: string | null; nhanh: string | null }
// Dạng bài bản đồ mới của khối (Đại 'toan' + Hình giải tích 'hgt' — cùng kho bdm_cau_hoi, hàng MT nhánh 'bdm').
type NhanhBdm = 'toan' | 'hgt'
type DbInfo = { id: string; ten: string; nhom_id: string; nhom_ten: string; so_cau: number; nhanh: NhanhBdm }
type Plan = { db: string; soCau: number }
const SO_CAU_MAC_DINH = 1
const loaiLabel = (v: string) => LOAI_CAU.find((x) => x.value === v)?.label ?? v
// 'YYYY-MM' → "T09/2026" (khuôn hiển thị tháng dùng chung, xem MTThangLop/LopView.tsx).
const nhanThang = (ym: string) => `T${ym.slice(5, 7)}/${ym.slice(0, 4)}`

// ═══════════ LIST (leaf lamtailieu:mt) — chọn MT để sửa / tạo mới ═══════════
export default function MTScreen() {
  const { allowedMons: monScope, isAll } = useMonScope()  // scope④ (admin/Ops/Media/Marketing = tất cả)
  const allowedMons = isAll ? MONS : MONS.filter((m) => monScope.includes(m))
  const [mon, setMon] = useState(allowedMons[0] ?? 'Toán')
  useEffect(() => { if (allowedMons.length && !allowedMons.includes(mon)) setMon(allowedMons[0]) }, [allowedMons.join(',')]) // eslint-disable-line
  const [list, setList] = useState<Awaited<ReturnType<typeof listMT>>>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [nhanBan, setNhanBan] = useState<{ id: string; ten: string } | null>(null)
  const [fThang, setFThang] = useState('__all__')
  const [fLoaiDe, setFLoaiDe] = useState('__all__')
  const [fKhoi, setFKhoi] = useState('__all__')

  async function reload() { setLoading(true); try { setList(await listMT(mon)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [mon]) // eslint-disable-line

  const thangOptions = useMemo(() => [...new Set(list.map((d) => mtMeta(d).thang).filter((t): t is string => !!t))].sort((a, b) => b.localeCompare(a)), [list])
  const khoiOptions = useMemo(() => [...new Set(list.map((d) => d.khoi))].sort(), [list])
  const shown = useMemo(() => list.filter((d) => {
    const m = mtMeta(d)
    if (fThang !== '__all__' && m.thang !== fThang) return false
    if (fLoaiDe !== '__all__' && m.loaiDe !== fLoaiDe) return false
    if (fKhoi !== '__all__' && d.khoi !== fKhoi) return false
    return true
  }), [list, fThang, fLoaiDe, fKhoi])
  const dangLoc = fThang !== '__all__' || fLoaiDe !== '__all__' || fKhoi !== '__all__'
  const xoaLoc = () => { setFThang('__all__'); setFLoaiDe('__all__'); setFKhoi('__all__') }

  if (openId) return <MTEditor key={openId} id={openId} onClose={() => { setOpenId(null); reload() }} onMo={setOpenId} />

  const selCls = "h-8 rounded-md border border-slate-200 bg-white px-2 text-[12.5px] text-slate-600 outline-none focus:border-indigo-400"
  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="text-sm font-semibold text-slate-900">MT</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">kỳ thi lớn — soạn 1 lần, gán được nhiều lớp/nhiều lần</span>
        {allowedMons.length > 1 && (
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {allowedMons.map((m) => <button key={m} onClick={() => setMon(m)} className={`rounded-md px-3 py-1 text-[13px] font-medium ${mon === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>{m}</button>)}
          </div>
        )}
        <button onClick={() => setCreating(true)} className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[13px] font-medium text-white shadow-sm hover:bg-indigo-500">+ Tạo MT mới</button>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-6 py-2">
        <select value={fThang} onChange={(e) => setFThang(e.target.value)} className={selCls}>
          <option value="__all__">Mọi tháng</option>
          {thangOptions.map((t) => <option key={t} value={t}>{nhanThang(t)}</option>)}
        </select>
        <select value={fLoaiDe} onChange={(e) => setFLoaiDe(e.target.value)} className={selCls}>
          <option value="__all__">Mọi loại đề</option>
          {MT_LOAI_DE.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={fKhoi} onChange={(e) => setFKhoi(e.target.value)} className={selCls}>
          <option value="__all__">Mọi khối</option>
          {khoiOptions.map((k) => <option key={k} value={k}>Khối {k}</option>)}
        </select>
        {dangLoc && <button onClick={xoaLoc} className="text-[12px] text-slate-400 hover:text-indigo-600">Xoá lọc</button>}
        <span className="ml-auto text-[12px] text-slate-400">{shown.length}/{list.length} MT</span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {loading ? <p className="text-sm text-slate-400">Đang tải…</p>
          : list.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">Chưa có MT nào ở môn {mon}.</div>
          : shown.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-400">Không có MT nào khớp bộ lọc. <button onClick={xoaLoc} className="text-indigo-600 hover:underline">Xoá lọc</button></div>
          : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-[13px]">
                <thead className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="sticky top-0 z-10 bg-slate-50 px-4 py-2.5">Tên MT</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Tháng</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Loại đề</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3">Khối</th>
                    <th className="sticky top-0 z-10 bg-slate-50 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((d) => {
                    const m = mtMeta(d)
                    return (
                      <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <td className="px-4 py-2">
                          <button onClick={() => setOpenId(d.id)} title={d.ten} className="block max-w-[360px] truncate text-left font-medium text-slate-800 hover:text-indigo-600">{d.ten}</button>
                        </td>
                        <td className="px-3 py-2 text-slate-600">{m.thang ? nhanThang(m.thang) : <span className="text-slate-300">—</span>}</td>
                        <td className="px-3 py-2">{m.loaiDe ? <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600">{mtLoaiDeLabel(m.loaiDe)}</span> : <span className="text-slate-300">—</span>}</td>
                        <td className="px-3 py-2 text-slate-600">Khối {d.khoi}</td>
                        <td className="px-3 py-2 text-right">
                          <button onClick={() => setOpenId(d.id)} className="rounded-md px-2 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">Mở</button>
                          <button onClick={() => setNhanBan({ id: d.id, ten: d.ten })} title="Nhân bản thành MT mới (chép mọi phần, câu, điểm, 3 mã đề) rồi sửa phần khác"
                            className="rounded-md px-2 py-1 text-[12px] font-medium text-slate-500 hover:bg-slate-100">⧉ Nhân bản</button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Xoá MT "${d.ten}"? Toàn bộ phần/câu trong mẫu này sẽ mất (câu vẫn còn trong kho). Các buổi đã gán từ mẫu này trước đó KHÔNG bị xoá theo.`)) return
                              await deleteMT(d.id); reload()
                            }}
                            title="Xoá MT"
                            className="rounded-md px-2 py-1 text-[13px] text-slate-300 hover:text-rose-600"
                          >🗑</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
      </div>
      {creating && <TaoMTModal mon={mon} onClose={() => setCreating(false)} onCreated={(id) => { setCreating(false); setOpenId(id) }} />}
      {nhanBan && <NhanBanMTModal goc={nhanBan} onClose={() => setNhanBan(null)} onXong={(id) => { setNhanBan(null); setOpenId(id) }} />}
    </div>
  )
}

// ⧉ NHÂN BẢN MT (Thùy 28/10): đặt tên bản mới → chép ở DB → mở luôn bản mới để sửa phần khác. Bản gốc không đổi.
function NhanBanMTModal({ goc, onClose, onXong }: { goc: { id: string; ten: string }; onClose: () => void; onXong: (id: string) => void }) {
  const [ten, setTen] = useState(`${goc.ten} (bản sao)`)
  const [busy, setBusy] = useState(false)
  const [loi, setLoi] = useState<string | null>(null)
  async function lam() {
    if (!ten.trim()) return
    setBusy(true); setLoi(null)
    try { onXong(await nhanBanMT(goc.id, ten.trim())) }
    catch (e) { setLoi((e as { message?: string })?.message ?? String(e)); setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">⧉ Nhân bản MT</p>
        <p className="mt-1 text-[12px] text-slate-500">Chép <b>{goc.ten}</b> thành MT mới: đủ mọi phần, câu (đúng thứ tự), điểm từng câu, Cơ bản/Nâng cao, bài Hình, 3 mã đề. Bản mới chưa gán lớp nào — sửa phần khác rồi gán như MT thường. Bản gốc giữ nguyên.</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên MT mới</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') lam() }} className={`${inp} mt-1 w-full`} />
        {loi && <p className="mt-2 text-[12px] text-rose-600">{loi}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!ten.trim() || busy} onClick={lam} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang nhân bản…' : 'Nhân bản & mở'}</button>
        </div>
      </div>
    </div>
  )
}

function TaoMTModal({ mon, onClose, onCreated }: { mon: string; onClose: () => void; onCreated: (id: string) => void }) {
  const [ten, setTen] = useState('')
  const [khoi, setKhoi] = useState(DEFAULT_KHOI)
  const [loaiDe, setLoaiDe] = useState<MTLoaiDe | null>(null)
  const [thang, setThang] = useState(homNayVN().slice(0, 7))
  const [busy, setBusy] = useState(false)
  async function tao() {
    if (!ten.trim()) return
    setBusy(true)
    try { const d = await createMT({ ten: ten.trim(), khoi, mon, loaiDe, thang: thang || null }); onCreated(d.id) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[420px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Tạo MT mới</p>
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Tên MT</label>
        <input autoFocus value={ten} onChange={(e) => setTen(e.target.value)} placeholder='vd "MT Học kỳ 1 — Toán 9"' className={`${inp} mt-1 w-full`} />
        <label className="mt-3 block text-[12px] font-medium text-slate-600">Loại đề</label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {MT_LOAI_DE.map((o) => <button key={o.value} onClick={() => setLoaiDe(loaiDe === o.value ? null : o.value)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${loaiDe === o.value ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{o.label}</button>)}
        </div>
        <div className="mt-3 flex gap-3">
          <div>
            <label className="block text-[12px] font-medium text-slate-600">Tháng</label>
            <input type="month" value={thang} onChange={(e) => setThang(e.target.value)} className={`${inp} mt-1`} />
          </div>
          <div className="flex-1">
            <label className="block text-[12px] font-medium text-slate-600">Khối</label>
            <div className="mt-1 flex flex-wrap gap-1.5">{KHOI_OPTIONS.map((k) => <button key={k} onClick={() => setKhoi(k)} className={`rounded-lg px-2.5 py-1 text-[13px] font-medium ${khoi === k ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{k}</button>)}</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
          <button disabled={!ten.trim() || busy} onClick={tao} className="rounded-lg bg-indigo-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang tạo…' : 'Tạo'}</button>
        </div>
      </div>
    </div>
  )
}

// ═══════════ EDITOR — nhiều phần, mỗi phần chọn câu kiểu ET + nút Gán vào buổi ═══════════
export function MTEditor({ id, onClose, onMo }: { id: string; onClose: () => void; onMo?: (id: string) => void }) {
  const [nhanBan, setNhanBan] = useState(false)
  const [d, setD] = useState<{ id: string; ten: string; khoi: string; mon: string; nhanh?: string | null; cau_hinh?: CauHinh } | null>(null)
  const [phans, setPhans] = useState<PhanResolved[]>([])
  const [rowsByPhan, setRowsByPhan] = useState<Record<string, Row[]>>({})
  const [cau, setCau] = useState<Record<string, CauHoi>>({}) // cache để preview
  // ⭐ 30/09 (Thùy: "hệ thống đã sinh ra nhiều câu MCQ, tính vào") — cache CÂU CÓ FORM_TN (bảng
  // dai_cau_form_tn / hgt_cau_form_tn, `da_duyet=true AND xoa_at IS NULL`). Không attach vào CauHoi
  // (kho không có cột này); giữ map riêng, tra khi build formOpts. Fetch batch theo nhánh mỗi lần
  // `cau` cache đổi (add key mới).
  const [formTnByMa, setFormTnByMa] = useState<Record<string, boolean>>({})
  // dangOpts = HỢP mọi bản đồ của môn (Toán: Đại + Hình giải tích), mỗi dòng gắn `nhanh` — tra tên/bậc theo (nhanh, ma_dang).
  const [dangOpts, setDangOpts] = useState<{ ma_dang: string; ten_dang: string; ten_chuyen_de: string; bac: string; nhanh: string | null }[]>([])
  const [lopBacs, setLopBacs] = useState<LopBac[]>([]) // S>A>B>C (thu_tu desc) — suy hệ nào thấy được 1 phần, xem ganMTVaoBuoi
  const [ch, setCh] = useState<CauHinh>({}) // cấu hình chỉnh dòng (etFormByCau/btvnLinesByCau) — giống ET
  const [ten, setTen] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [ganModal, setGanModal] = useState(false)
  const [ganList, setGanList] = useState<MTGanRow[]>([])
  const [printing, setPrinting] = useState(false)
  const [picker, setPicker] = useState<{ phanId: string; idx: number; maDang: string; nhanh: string | null } | null>(null)
  const [varPicker, setVarPicker] = useState<{ baseMaCau: string; v: number; maDang: string; nhanh: string | null; form: ETFormKind } | null>(null)
  const [dangModal, setDangModal] = useState<{ phanId: string; idx: number; nhanh: string | null } | null>(null)
  const [chiaDe, setChiaDe] = useState<{ taiLieuId: string; lopId: string; lopTen: string } | null>(null)
  const nhanhMacDinh = d?.nhanh ?? null
  const tblCua = (nhanh: string | null) => khoCuaMon(d?.mon, nhanh).cauTbl // bảng câu theo nhánh của TỪNG HÀNG
  const coNhieuNhanh = nhanhCuaMon(d?.mon).length > 1
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  // ── HÌNH (mô hình) = HÀNG câu (Thùy 02/09): hàng nhanh='hinh', maCau='HINH:<uuid>' (giữ vị trí trong phần),
  //    nội dung bài ở ch.hinhByMa[ma]; in chung MTPrintView; gán buổi ghi sang hinh_gt_buoi (lớp,ngày) cho tab chấm.
  //    KHÔNG khối riêng, KHÔNG buổi mẫu (bản sáng 02/09 đã bỏ). ──
  const [hinhL, setHinhL] = useState<Luoi | null>(null)
  const [hinhPicker, setHinhPicker] = useState<{ phanId: string; idx: number } | null>(null)
  const [hinhMuc, setHinhMuc] = useState<Record<string, MucIn>>({}) // preview đề bài từng hàng Hình (banInTheoMoHinh)
  const chRef = useRef<CauHinh>(ch); chRef.current = ch // cau_hinh MỚI NHẤT cho các hàm async (tránh đè bằng closure cũ)
  const formTnRef = useRef<Record<string, boolean>>(formTnByMa); formTnRef.current = formTnByMa
  // ── Bản đồ mới (28/10): dạng bài của khối + kế hoạch nhiều dạng × N câu cho 1 phần + chọn nhiều câu + đổi thứ tự ──
  const [dbs, setDbs] = useState<Map<string, DbInfo>>(new Map())
  const [kh, setKh] = useState<{ phanId: string; nhanh: NhanhBdm; plan: Plan[] } | null>(null)
  const [chonPlan, setChonPlan] = useState(false)
  const [khBusy, setKhBusy] = useState(false)
  const [chonCauBdm, setChonCauBdm] = useState<{ phanId: string; idx: number } | null>(null)
  const [keo, setKeo] = useState<{ phanId: string; idx: number } | null>(null)
  const [dich, setDich] = useState<{ phanId: string; idx: number; sau: boolean } | null>(null)
  const [loi, setLoi] = useState<string | null>(null)
  const coBdm = dbs.size > 0
  const coHgt = [...dbs.values()].some((x) => x.nhanh === 'hgt')

  // ⭐ 30/09 — Fetch form_tn presence cho câu MỚI THÊM vào cache. Group theo nhánh (bảng form_tn khác
  // nhau: dai_cau_form_tn / hgt_cau_form_tn); nhánh chưa có bảng (KHTN/etc.) → mark false luôn. Fetch
  // chỉ với `da_duyet=true AND xoa_at IS NULL` — câu MCQ nháp/từ chối KHÔNG in ra được, không tính.
  useEffect(() => {
    if (!d) return
    const byNhanh = new Map<string | null, string[]>()
    for (const ma of Object.keys(cau)) {
      if (ma in formTnRef.current) continue
      if (laMaHinh(ma)) continue
      const nh = chRef.current.nhanhByCau?.[ma] ?? d.nhanh ?? null
      const arr = byNhanh.get(nh) ?? []; arr.push(ma); byNhanh.set(nh, arr)
    }
    if (byNhanh.size === 0) return
    let alive = true
    ;(async () => {
      const patch: Record<string, boolean> = {}
      for (const [nh, mas] of byNhanh) {
        const { formTnTbl } = khoCuaMon(d.mon, nh)
        if (!coFormTn(formTnTbl)) { for (const m of mas) patch[m] = false; continue }
        const { data } = await supabase.from(formTnTbl).select('ma_cau').in('ma_cau', mas).eq('da_duyet', true).is('xoa_at', null).limit(1000)
        const have = new Set(((data ?? []) as { ma_cau: string }[]).map((r) => r.ma_cau))
        for (const m of mas) patch[m] = have.has(m)
      }
      if (alive) setFormTnByMa((p) => ({ ...p, ...patch }))
    })().catch(() => {})
    return () => { alive = false }
  }, [cau, d, ch.nhanhByCau])

  async function reload() {
    setLoading(true)
    try {
      const full = await getTaiLieuFull(id)
      const ch0 = full.taiLieu.cau_hinh ?? {}
      setD(full.taiLieu as any); setTen(full.taiLieu.ten); setCh(ch0)
      const ps = full.phans.filter((p) => p.loai_phan === 'custom')
      setPhans(ps)
      const rb: Record<string, Row[]> = {}
      const c: Record<string, CauHoi> = {}
      for (const p of ps) {
        const byMa = new Map(p.caus.map((x) => [x.ma_cau, x]))
        // Duyệt danh sách THÔ (maCaus) để giữ hàng HÌNH đúng vị trí; câu kho đã mất thì rụng như trước.
        rb[p.id] = p.maCaus.map((ma): Row | null => {
          if (laMaHinh(ma)) return ch0.hinhByMa?.[ma] ? { maDang: null, maCau: ma, nhanh: 'hinh' } : null
          const x = byMa.get(ma); return x ? { maDang: x.dang_chinh, maCau: ma, nhanh: nhanhCuaCau(full.taiLieu, ma) } : null
        }).filter((r): r is Row => !!r)
        for (const x of p.caus) c[x.ma_cau] = x
      }
      // Nạp thêm nội dung câu MÃ ĐỀ 2/3 (etMaDe) — trên chỉ nạp câu GỐC (phan.caus) nên mở lại MT cũ,
      // cột Mã đề 2/3 chỉ thấy MÃ câu, không thấy đề (chỉ "…") dù dữ liệu vẫn còn nguyên trong cau_hinh.
      const need = new Set<string>()
      for (const arr of Object.values(ch0.etMaDe ?? {})) for (const m of arr) if (m && !c[m]) need.add(m)
      if (need.size) { const vs = await fetchCausCuaTaiLieu(full.taiLieu, [...need]); for (const v of vs) c[v.ma_cau] = v }
      setRowsByPhan(rb); setCau((prev) => ({ ...prev, ...c }))
      setGanList(await listGanMT(id))
    } finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [id]) // eslint-disable-line
  useEffect(() => { listLopBac().then(setLopBacs) }, [])
  useEffect(() => {
    if (!d?.khoi || !coKhoHinh(d.mon)) { setHinhL(null); return }
    let alive = true
    loadLuoi(d.khoi).then((L) => { if (alive) setHinhL(L) }).catch(() => { if (alive) setHinhL(null) })
    return () => { alive = false }
  }, [d?.khoi, d?.mon])
  // Preview đề bài của từng hàng Hình — dựng bằng ĐÚNG engine in (banInTheoMoHinh, 1 bài/lượt), đổi khi hinhByMa đổi.
  useEffect(() => {
    if (!hinhL || !d) return
    const entries = Object.entries(ch.hinhByMa ?? {})
    if (!entries.length) { setHinhMuc({}); return }
    let alive = true
    ;(async () => {
      const out: Record<string, MucIn> = {}
      for (const [ma, h] of entries) {
        // phan phải = 'mt' (banInTheoMoHinh lọc picks theo phan); dòng kẻ truyền tường minh (mặc định DONG_BTVN như ET).
        const m = (await banInTheoMoHinh(d.ten, 'mt', [pickCuaHinhRow(ma, h)], hinhL, { [ma]: h.cheDo ?? 'hien' }, { [ma]: h.soDong ?? DONG_BTVN })).mucs[0]
        if (m) out[ma] = m
      }
      if (alive) setHinhMuc(out)
    })().catch(() => { /* preview thôi — in thật dựng lại ở MTPrintView */ })
    return () => { alive = false }
  }, [hinhL, ch.hinhByMa, d?.ten]) // eslint-disable-line
  useEffect(() => {
    if (!d?.khoi) { setDangOpts([]); return }
    // Nạp MỌI bản đồ của môn (registry nhanhCuaMon; môn 1 nhánh → chỉ nhánh mặc định) — MT trộn nhánh.
    // + 'bdm' khi khối đã chạy bản đồ mới (nhanhChonCuaKhoi — DangPickerOne banDoMoi trả hàng nhánh 'bdm', câu ghi
    // cau_hinh.nhanhByCau='bdm'); nhánh cũ vẫn nạp để MT cũ mở ra còn tên dạng / bậc.
    const nhs = nhanhCuaMon(d.mon).map((n) => n.ma)
    nhanhChonCuaKhoi(d.mon, d.khoi).then((chon) => {
      const list = [...new Set([...(nhs.length ? nhs : [d.nhanh ?? null]), ...chon.map((n) => n.ma)])]
      return Promise.all(list.map((nh) => khoCuaMon(d.mon, nh).listMap(d.khoi).then((ds) => ds.map((x) => ({ ma_dang: x.leafMa, ten_dang: x.leafTen, ten_chuyen_de: x.t2Ten, bac: x.bac, nhanh: nh })))))
    }).then((a) => setDangOpts(a.flat())).catch(() => { /* */ })
  }, [d?.khoi, d?.mon, d?.nhanh])

  // Dạng bài bản đồ mới của khối (chỉ khối đã chạy bản đồ mới — nhanhChonCuaKhoi có 'bdm'); khối khác giữ luồng chọn từng hàng.
  useEffect(() => {
    if (!d?.khoi) { setDbs(new Map()); return }
    let alive = true
    ;(async () => {
      const chon = await nhanhChonCuaKhoi(d.mon, d.khoi)
      if (!chon.some((n) => n.ma === 'bdm')) { if (alive) setDbs(new Map()); return }
      const m = new Map<string, DbInfo>()
      for (const nh of ['toan', 'hgt'] as NhanhBdm[]) {
        const cay = await cayChon(d.khoi, nh).catch(() => [])
        for (const cd of cay) for (const chd of cd.chuyen_de) for (const n of chd.nhom) for (const x of n.dang_bai)
          m.set(x.id, { id: x.id, ten: x.ten, nhom_id: n.id, nhom_ten: n.ten, so_cau: x.so_cau, nhanh: nh })
      }
      if (alive) setDbs(m)
    })().catch((e) => { if (alive) setLoi(loiDoc(e)) })
    return () => { alive = false }
  }, [d?.khoi, d?.mon])

  const findDang = (md: string | null, nhanh: string | null) => dangOpts.find((x) => x.ma_dang === md && x.nhanh === nhanh)
  const tenDang = (md: string | null, nhanh: string | null) => findDang(md, nhanh)?.ten_dang ?? md ?? ''
  // ⭐ Hệ nào thấy được 1 phần — MẶC ĐỊNH suy từ bac_toi_thieu của dạng các câu trong phần (bản đồ
  // kiến thức đã gán sẵn, khắt khe nhất thắng); GV ÉP TAY được (dropdown cạnh badge, `ch.phanBac[phanId]`)
  // khi muốn khác — ép tay LUÔN THẮNG, "gán vào buổi" (mt.ts) đọc y hệt ưu tiên này.
  const thuTuBac = (ma: string) => lopBacs.find((b) => b.ma === ma)?.thu_tu ?? 0
  function bacTuDongCuaPhan(phanId: string): string {
    const bacs = (rowsByPhan[phanId] ?? []).map((r) => r.maDang ? findDang(r.maDang, r.nhanh)?.bac : null).filter(Boolean) as string[]
    return bacs.reduce((worst, b) => (thuTuBac(b) > thuTuBac(worst) ? b : worst), 'C')
  }
  const bacEpCuaPhan = (phanId: string): string | null => ch.phanBac?.[phanId] ?? null
  const bacHieuLucCuaPhan = (phanId: string): string => bacEpCuaPhan(phanId) ?? bacTuDongCuaPhan(phanId)
  async function setPhanBac(phanId: string, bac: string | null) {
    const next: CauHinh = { ...ch, phanBac: { ...(ch.phanBac ?? {}) } }
    if (bac) next.phanBac![phanId] = bac; else delete next.phanBac![phanId]
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  function nhanHe(bacMa: string): string {
    const qualifying = lopBacs.filter((b) => b.thu_tu >= thuTuBac(bacMa)).map((b) => b.ma)
    return qualifying.length >= lopBacs.length ? 'Mọi hệ' : `Hệ ${qualifying.join(', ')}`
  }
  async function saveTen() { if (d && ten.trim() && ten.trim() !== d.ten) { await renameMT(id, ten.trim()); markSaved() } }
  async function xoaMT() {
    const canhBao = ganList.length ? ` Đã gán cho ${ganList.length} lượt lớp+ngày trước đó — các buổi đó KHÔNG bị xoá theo, chỉ mất liên kết về mẫu gốc.` : ''
    if (!confirm(`Xoá MT "${d?.ten}"? Toàn bộ phần/câu trong mẫu này sẽ mất (câu vẫn còn trong kho).${canhBao}`)) return
    await deleteMT(id); onClose()
  }

  // Câu ĐANG DÙNG xuyên MỌI PHẦN (không riêng phần đang sửa) — chống trùng câu trong 1 MT.
  const usedGlobal = (exceptPhan: string, exceptIdx: number) => {
    const s = new Set<string>()
    for (const [pid, rows] of Object.entries(rowsByPhan)) rows.forEach((r, i) => { if (!(pid === exceptPhan && i === exceptIdx) && r.maCau) s.add(r.maCau) })
    return s
  }
  async function ensureCache(maDang: string, tbl: string) {
    if (Object.values(cau).some((c) => c.dang_chinh === maDang)) return
    const list = await listCauByDang(maDang, tbl)
    setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) }))
  }
  // Ghi bền nhánh của TỪNG CÂU (cau_hinh.nhanhByCau) — chỉ giữ key cho câu KHÁC nhánh mặc định của tài liệu.
  // Mọi nơi đọc lại (getTaiLieuFull → in / chấm / gán buổi) resolve qua nhanhCuaCau, không đoán theo mã.
  // Cùng lúc DỌN hinhByMa: chỉ giữ bài của hàng Hình còn tồn tại (xoá hàng = xoá luôn nội dung bài).
  async function syncNhanhByCau(all: Record<string, Row[]>) {
    const cur = chRef.current
    const next: Record<string, string> = {}
    const dungHinh = new Set<string>()
    for (const rows of Object.values(all)) for (const r of rows) {
      if (!r.maCau) continue
      if (r.nhanh === 'hinh') { dungHinh.add(r.maCau); continue }
      if (r.nhanh && r.nhanh !== nhanhMacDinh) next[r.maCau] = r.nhanh
    }
    const hinhByMa = Object.fromEntries(Object.entries(cur.hinhByMa ?? {}).filter(([ma]) => dungHinh.has(ma)))
    const curN = cur.nhanhByCau ?? {}
    const sameN = Object.keys(curN).length === Object.keys(next).length && Object.entries(next).every(([k, v]) => curN[k] === v)
    const sameH = Object.keys(cur.hinhByMa ?? {}).length === Object.keys(hinhByMa).length
    if (sameN && sameH) return
    const nc: CauHinh = { ...cur }
    if (Object.keys(next).length) nc.nhanhByCau = next; else delete nc.nhanhByCau
    if (Object.keys(hinhByMa).length) nc.hinhByMa = hinhByMa; else delete nc.hinhByMa
    chRef.current = nc; setCh(nc); await updateTaiLieu(id, { cau_hinh: nc })
  }
  async function luuPhan(phanId: string, rows: Row[]) {
    setRowsByPhan((rb) => ({ ...rb, [phanId]: rows }))
    const maCaus = rows.map((r) => r.maCau).filter(Boolean) as string[]
    await setCauOfPhan(phanId, maCaus)
    await syncNhanhByCau({ ...rowsByPhan, [phanId]: rows })
    markSaved()
  }
  async function pickDang(phanId: string, idx: number, maDang: string, nhanh: string | null) {
    const tbl = tblCua(nhanh)
    await ensureCache(maDang, tbl)
    const sug = await suggestCauForDang(maDang, usedGlobal(phanId, idx), tbl)
    if (sug && !cau[sug]) { const list = await listCauByDang(maDang, tbl); setCau((p) => ({ ...p, ...Object.fromEntries(list.map((c) => [c.ma_cau, c])) })) }
    const rows = (rowsByPhan[phanId] ?? []).map((r, i) => (i === idx ? { maDang, maCau: sug, nhanh } : r))
    await luuPhan(phanId, rows)
  }
  async function doiCau(phanId: string, idx: number) {
    const r = (rowsByPhan[phanId] ?? [])[idx]; if (!r?.maDang) return
    const sug = await suggestCauForDang(r.maDang, new Set([...usedGlobal(phanId, idx), r.maCau].filter(Boolean) as string[]), tblCua(r.nhanh))
    if (!sug) { alert('Hết câu khác cho dạng này (đã dùng hết trong MT).'); return }
    const rows = (rowsByPhan[phanId] ?? []).map((x, i) => (i === idx ? { ...x, maCau: sug } : x))
    await luuPhan(phanId, rows)
  }
  // Nạp nội dung câu bản đồ mới (kho bdm_cau_hoi: Đại + Hình giải tích) vào cache.
  async function napBdm(mas: string[]) {
    const can = [...new Set(mas)].filter((m) => m && !cau[m])
    if (!can.length || !d) return
    const rs = await fetchCausCuaTaiLieu({ mon: d.mon, nhanh: 'bdm', cau_hinh: null }, can)
    setCau((p) => ({ ...p, ...Object.fromEntries(rs.map((c) => [c.ma_cau, c])) }))
  }
  // ⚡ Sinh theo kế hoạch: mỗi dạng bài N câu ít dùng nhất (fn_tl_bdm_goi_y — cùng luật ET mới), né câu đã có XUYÊN mọi phần,
  // nối vào cuối phần (bỏ hàng trống), lưu ngay.
  async function sinhKeHoach() {
    if (!kh) return
    const ps = kh.plan.filter((p) => p.soCau > 0)
    if (!ps.length) return
    setKhBusy(true); setLoi(null)
    try {
      const used = [...usedGlobal('', -1)]
      const moi: Row[] = []; const thieu: string[] = []
      for (const p of ps) {
        const info = dbs.get(p.db); if (!info) { thieu.push(`${p.db}: không còn trên bản đồ`); continue }
        const got = await goiYDangBai(info.nhom_id, p.db, p.soCau, used)
        got.forEach((m) => { used.push(m); moi.push({ maDang: p.db, maCau: m, nhanh: 'bdm' }) })
        if (got.length < p.soCau) thieu.push(`${info.ten}: chỉ được ${got.length}/${p.soCau} câu`)
      }
      await napBdm(moi.map((r) => r.maCau!))
      await luuPhan(kh.phanId, [...(rowsByPhan[kh.phanId] ?? []).filter((r) => r.maCau || r.maDang), ...moi])
      setKh(null)
      if (thieu.length) setLoi(`Thiếu câu ở vài dạng bài (kho hết câu chưa dùng trong MT):\n${thieu.join('\n')}`)
    } catch (e) { setLoi(loiDoc(e)) } finally { setKhBusy(false) }
  }
  // ✎ Chọn NHIỀU câu cho 1 hàng: câu đầu thay hàng đó, các câu sau chèn NGAY SAU (mỗi câu 1 hàng, giữ thứ tự bấm).
  // dangCua = dạng của từng câu (chọn theo nhóm thì câu có thể thuộc dạng bài khác trong nhóm).
  async function chenNhieuCau(phanId: string, idx: number, ms: string[], dangCua: (ma: string) => string | null, nhanh: string | null) {
    const used = usedGlobal(phanId, idx)
    const pick = [...new Set(ms)].filter((m) => !used.has(m))
    const rows = [...(rowsByPhan[phanId] ?? [])]
    rows.splice(idx, 1, ...(pick.length ? pick.map((m): Row => ({ maDang: dangCua(m), maCau: m, nhanh })) : [{ ...rows[idx], maCau: null }]))
    await luuPhan(phanId, rows)
  }
  // ── ĐỔI THỨ TỰ (kéo thả / gõ số câu): `to.idx` = vị trí chèn trong phần đích TÍNH TRƯỚC khi gỡ hàng; đi được sang phần khác
  //    (câu sang phần Nâng cao ⇒ cộng vào điểm Nâng cao). Lưu ngay cả 2 phần (gỡ ở phần nguồn trước, rồi ghi phần đích).
  async function diChuyen(from: { phanId: string; idx: number }, to: { phanId: string; idx: number }) {
    let ti = to.idx
    if (to.phanId === from.phanId && ti > from.idx) ti--
    if (to.phanId === from.phanId && ti === from.idx) return
    const next = { ...rowsByPhan }
    const src = [...(next[from.phanId] ?? [])]
    const [row] = src.splice(from.idx, 1)
    if (!row) return
    next[from.phanId] = src
    const dst = to.phanId === from.phanId ? src : [...(next[to.phanId] ?? [])]
    dst.splice(Math.max(0, Math.min(ti, dst.length)), 0, row)
    next[to.phanId] = dst
    setRowsByPhan(next)
    try {
      await setCauOfPhan(from.phanId, src.map((r) => r.maCau).filter(Boolean) as string[])
      if (to.phanId !== from.phanId) await setCauOfPhan(to.phanId, dst.map((r) => r.maCau).filter(Boolean) as string[])
      markSaved()
    } catch (e) { setLoi(loiDoc(e)) }
  }
  // Gõ số câu ⇒ hàng đứng trước câu đang mang số đó (sau khi gỡ hàng đang chuyển); lớn hơn số cuối ⇒ cuối phần cuối.
  function viTriTheoSo(from: { phanId: string; idx: number }, so: number): { phanId: string; idx: number } {
    let n = 0
    for (const p of phans) {
      const rows = rowsByPhan[p.id] ?? []
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i]
        if ((p.id === from.phanId && i === from.idx) || !r.maCau) continue
        if (n + 1 >= so) return { phanId: p.id, idx: i }
        n += r.nhanh === 'hinh' ? soYHinh(r.maCau) : 1
      }
    }
    const cuoi = phans[phans.length - 1]
    return { phanId: cuoi.id, idx: sauCauCuoi(cuoi.id) }
  }
  // Vị trí "cuối phần" = ngay sau câu cuối cùng, TRƯỚC các hàng trống chờ chọn dạng (không để câu kẹt dưới hàng trống).
  const sauCauCuoi = (phanId: string) => {
    const rows = rowsByPhan[phanId] ?? []
    for (let i = rows.length - 1; i >= 0; i--) if (rows[i].maCau || rows[i].maDang) return i + 1
    return 0
  }
  const themCau = (phanId: string) => setRowsByPhan((rb) => ({ ...rb, [phanId]: [...(rb[phanId] ?? []), { maDang: null, maCau: null, nhanh: nhanhMacDinh }] }))
  async function xoaRow(phanId: string, idx: number) {
    const rows = (rowsByPhan[phanId] ?? []).filter((_, i) => i !== idx)
    await luuPhan(phanId, rows)
  }
  async function themPhan() {
    const tieuDe = prompt('Tên phần (vd "Phần I. Đại số", "Phần II. Hình học"):', `Phần ${['I', 'II', 'III', 'IV', 'V'][phans.length] ?? phans.length + 1}`)?.trim()
    if (!tieuDe) return
    const p = await addPhanMT(id, tieuDe)
    setRowsByPhan((rb) => ({ ...rb, [p.id]: Array.from({ length: DEFAULT_ROWS_PER_PHAN }, () => ({ maDang: null, maCau: null, nhanh: nhanhMacDinh })) }))
    await reload(); markSaved()
  }
  // ⭐ 08/10 (Thùy) — phần tính vào điểm NÂNG CAO hay Cơ bản (điểm MT tổng tự cộng theo phần). Lớp đã gán đọc
  // cờ + điểm câu của ĐỀ GỐC này (mig 202610081402) ⇒ sửa ở đây là màn chấm theo ngay lần mở kế tiếp, không cần gán lại.
  async function setPhanNangCao(p: PhanResolved, v: boolean) {
    await updatePhan(p.id, { nang_cao: v })
    setPhans((ps) => ps.map((x) => (x.id === p.id ? { ...x, nang_cao: v } : x))); markSaved()
  }
  async function xoaPhan(p: PhanResolved) {
    if (!confirm(`Xoá phần "${p.tieu_de}"? (câu vẫn còn trong kho, chỉ bỏ khỏi MT này)`)) return
    await deletePhan(p.id); await reload(); markSaved()
  }
  // Cấu hình chỉnh dòng (số dòng kẻ tự luận + đổi form hiển thị) — GIỐNG ET, autosave ngay (MT không có nút Lưu riêng).
  async function setLines(maCau: string, n: number) {
    const next: CauHinh = { ...ch, btvnLinesByCau: { ...(ch.btvnLinesByCau ?? {}), [maCau]: n } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  async function setForm(maCau: string, f: ETFormKind) {
    const next: CauHinh = { ...ch, etFormByCau: { ...(ch.etFormByCau ?? {}), [maCau]: f } }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  // ⭐ 30/09 (Thùy) — điểm per câu (áp mọi mã: câu kho + HÌNH). Default DEFAULT_DIEM_MT. Không lưu key
  // nếu chọn = default (giữ cau_hinh sạch, xoá được đè); có thể xoá key sau nếu quay lại default.
  async function setDiem(maCau: string, n: number) {
    const cur = { ...(ch.diemByCau ?? {}) }
    if (n === DEFAULT_DIEM_MT) delete cur[maCau]; else cur[maCau] = n
    const next: CauHinh = { ...ch, diemByCau: cur }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  // ⭐ 07/10 (Thùy) — điểm bài Hình đặt THEO TỪNG Ý (xem diemBaiHinh). Đặt ý đầu tiên trên đề cũ (key cả bài) ⇒ bỏ
  // key cả bài, các ý còn lại về mặc định — người soạn đặt nốt.
  async function setDiemY(ma: string, i: number, n: number) {
    const cur = { ...(ch.diemByCau ?? {}) }
    delete cur[ma]
    const k = maYHinh(ma, i)
    if (n === DEFAULT_DIEM_MT) delete cur[k]; else cur[k] = n
    const next: CauHinh = { ...ch, diemByCau: cur }
    setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved()
  }
  // Số cột khi in — RIÊNG TỪNG CÂU (cau_hinh.colByCau, autosave). Câu tag cột liền nhau tự xếp cạnh nhau.
  const setColCau = (maCau: string, n: number) => saveCh({ ...ch, colByCau: { ...(ch.colByCau ?? {}), [maCau]: n } })

  // ── 3 MÃ ĐỀ (như ET) — base = MỌI câu XUYÊN mọi phần (đúng thứ tự phần → hàng). Đề 2/3 tự sinh khác
  //    câu (cùng dạng + form), neo theo ma_cau gốc; lưu NGAY vào cau_hinh (MT autosave). Dùng lib/made. ──
  //    ⭐ base = MỌI hàng câu kho (trừ hàng Hình), KỂ CẢ câu không còn dạng (maDang null — câu bị gỡ khỏi dạng bài):
  //    lọc `r.maDang` như trước thì câu đó bị bỏ qua IM LẶNG ⇒ không có đề 2/3, màn vẫn báo "✓ đủ 3 mã đề" trong khi
  //    bản in (base = mọi câu) thấy thiếu ⇒ in 1 đề cho cả MT (MT 4a câu 6–7, Thùy 31/10).
  const baseRows = (): Row[] => phans.flatMap((p) => (rowsByPhan[p.id] ?? []).filter((r) => r.maCau && r.nhanh !== 'hinh'))
  const baseAll = (): BaseItem[] => baseRows().map((r) => ({ maDang: r.maDang, maCau: r.maCau! }))
  async function saveCh(next: CauHinh) { chRef.current = next; setCh(next); await updateTaiLieu(id, { cau_hinh: next }); markSaved() }
  const mMeta = mtMeta({ cau_hinh: ch })
  const setMtField = (patch: { loaiDe?: MTLoaiDe | null; thang?: string | null }) => saveCh({ ...ch, mtMeta: { loaiDe: mMeta.loaiDe, thang: mMeta.thang, ...patch } })
  const hinhRowsAll = (): Row[] => phans.flatMap((p) => (rowsByPhan[p.id] ?? []).filter((r) => r.nhanh === 'hinh' && r.maCau))
  // Hàng Hình chưa có mã đề 2/3 (khoá theo sigHinh: chuỗi node, hoặc bài kho — khuôn ET Hình).
  const hinhTrong = (): number => hinhRowsAll().filter((r) => { const h = ch.hinhByMa?.[r.maCau!]; return !h || !ch.hinhMaDe?.[sigHinh(h)] }).length
  async function sinhMaDe() {
    const rows = baseRows()
    const hinhRows = hinhRowsAll()
    if (!rows.length && !hinhRows.length) return
    // Sinh THEO NHÁNH (mỗi nhánh 1 bảng câu) rồi GỘP etMaDe — buildMaDe reset etMaDe từ base của lượt gọi
    // (cố ý, bỏ entry stale) nên phải gộp tay giữa các nhánh; câu 2 nhánh không bao giờ trùng mã (bảng khác).
    const nhs = [...new Set(rows.map((r) => r.nhanh))]
    let chNext: CauHinh = { ...chRef.current, etMaDe: {} }
    const allCaus: CauHoi[] = []
    for (const nh of nhs) {
      const base: BaseItem[] = rows.filter((r) => r.nhanh === nh).map((r) => ({ maDang: r.maDang, maCau: r.maCau! }))
      const { ch: c2, caus } = await buildMaDeLib(base, chNext, tblCua(nh), cau)
      chNext = { ...c2, etMaDe: { ...(chNext.etMaDe ?? {}), ...(c2.etMaDe ?? {}) } }
      allCaus.push(...caus)
    }
    // HÌNH: mã đề 2/3 = bản KHÁC có sẵn cùng node (khuôn ET Hình, goiYMaDeChoBai); thiếu thì dùng lại bài gốc
    // (Thùy 24/08 — không để trống chặn in).
    if (hinhRows.length && hinhL) {
      const hm: NonNullable<CauHinh['hinhMaDe']> = {}
      const thieu: string[] = []
      for (const r of hinhRows) {
        const h = chNext.hinhByMa?.[r.maCau!]; if (!h) continue
        const goc = banCuaHinh(h)
        // Bài kho: bài kho khác cùng mô hình, cùng số ý. Chuỗi: bản khác cùng node.
        const chuoi = h.kind === 'bai' ? [] : chuoiKetNoi(hinhL, h.nodeIds[0])
        const opts = h.kind === 'bai' ? await goiYMaDeBaiKho(h.moHinhId ?? null, h.baiId!, 2) : await goiYMaDeChoBai(chuoi, goc, 2)
        hm[sigHinh(h)] = [opts[0]?.ban ?? goc, opts[1]?.ban ?? goc]
        if (opts.length < 2) thieu.push(h.kind === 'bai' ? `bài kho ${(hinhMuc[r.maCau!] as { ma?: string | null } | undefined)?.ma ?? ''}` : chuoi.map((b) => b.ma).join('+'))
      }
      chNext = { ...chNext, hinhMaDe: hm }
      if (thieu.length) alert(`Kho chưa đủ 2 bản khác cho ${thieu.length} bài Hình (chuỗi: biến thể CÙNG node; bài kho: bài khác cùng mô hình, cùng số ý — không tự sinh AI) — đã dùng lại bài gốc cho phần thiếu:\n${thieu.join('\n')}`)
    } else delete chNext.hinhMaDe
    setCau((p) => { const n = { ...p }; for (const c of allCaus) n[c.ma_cau] = c; return n })
    await saveCh(chNext)
    const khongDang = rows.filter((r) => !r.maDang).map((r) => r.maCau!)
    if (khongDang.length) alert(`${khongDang.length} câu KHÔNG thuộc dạng bài nào (đã bị gỡ khỏi dạng trên bản đồ) — đề 2 & 3 dùng lại chính câu gốc:\n${khongDang.join('\n')}\n\nMuốn đề 2/3 khác câu: gán lại dạng cho câu ở bản đồ rồi Sinh lại, hoặc bấm ô dạng để chọn câu khác.`)
  }
  // ── HÌNH: chọn bài cho 1 HÀNG (popup ChonYTuCay → PickItem) · tuỳ chọn hình vẽ / số dòng · ↻ Đổi bản khác ──
  async function pickHinh(phanId: string, idx: number, p: PickItem) {
    const ma = HINH_PREFIX + crypto.randomUUID()
    const info: HinhRowInfo = { kind: p.kind, nodeIds: p.nodeIds, cheDo: 'hien', ...(p.kind === 'ghep' ? { luaId: p.luaId } : p.kind === 'bienthe' ? { bienTheId: p.bienTheId } : p.kind === 'bai' ? { baiId: p.baiId, moHinhId: p.moHinhId } : { yId: p.yId }) }
    const nc: CauHinh = { ...chRef.current, hinhByMa: { ...(chRef.current.hinhByMa ?? {}), [ma]: info } }
    chRef.current = nc; setCh(nc); await updateTaiLieu(id, { cau_hinh: nc })
    const rows = (rowsByPhan[phanId] ?? []).map((r, i): Row => (i === idx ? { maDang: null, maCau: ma, nhanh: 'hinh' } : r))
    await luuPhan(phanId, rows)
  }
  async function setHinhInfo(ma: string, patch: Partial<HinhRowInfo>) {
    const cur = chRef.current.hinhByMa?.[ma]; if (!cur) return
    await saveCh({ ...chRef.current, hinhByMa: { ...(chRef.current.hinhByMa ?? {}), [ma]: { ...cur, ...patch } } })
  }
  const chuoiCuaHinh = (h: HinhRowInfo): BaiToan[] => h.nodeIds.map((nid) => hinhL?.baiToan.find((b) => b.id === nid)).filter((b): b is BaiToan => !!b)
  const banCuaHinh = (h: HinhRowInfo): Ban => h.kind === 'ghep' ? { kind: 'ghep', luaId: h.luaId ?? null } : h.kind === 'bienthe' ? { kind: 'bienthe', bienTheId: h.bienTheId! } : h.kind === 'bai' ? { kind: 'bai', baiId: h.baiId!, moHinhId: h.moHinhId ?? null } : { kind: 'y', yId: h.yId! }
  const nhanBanHinh = (h: HinhRowInfo) => (h.kind === 'ghep' ? (h.luaId ? 'Lứa (đổi đỉnh)' : 'Đề chuẩn') : h.kind === 'bienthe' ? 'Biến thể' : h.kind === 'bai' ? 'Bài trong kho' : 'Ý thật')
  // ↻ Đổi = bản KHÁC cùng chuỗi/node, ít dùng nhất (đúng goiYMaDeChoBai của ET Hình) — hết bản khác thì báo.
  async function doiHinh(ma: string) {
    const h = chRef.current.hinhByMa?.[ma]; if (!h || !hinhL) return
    const opts = h.kind === 'bai' ? await goiYMaDeBaiKho(h.moHinhId ?? null, h.baiId!, 1) : await goiYMaDeChoBai(chuoiKetNoi(hinhL, h.nodeIds[0]), banCuaHinh(h), 1)
    if (!opts.length) { alert(h.kind === 'bai' ? 'Kho của mô hình chưa có bài khác cùng số ý.' : 'Kho chưa có bản khác cho bài này (cùng node).'); return }
    const b = opts[0].ban
    await setHinhInfo(ma, { kind: b.kind, luaId: b.kind === 'ghep' ? b.luaId : undefined, bienTheId: b.kind === 'bienthe' ? b.bienTheId : undefined, yId: b.kind === 'y' ? b.yId : undefined, baiId: b.kind === 'bai' ? b.baiId : undefined, moHinhId: b.kind === 'bai' ? b.moHinhId : undefined })
  }
  const setVar = (baseMaCau: string, v: number, maCau: string, form: ETFormKind) => saveCh(setVarInCh(ch, baseMaCau, v, maCau, form))
  const usedMoiDe = (): Set<string> => usedMoiDeLib(baseAll(), ch)
  const oTrong = (): { maCau: string; v: number }[] => oTrongMaDe(baseAll(), ch)

  if (loading || !d) return <div className="p-8 text-sm text-slate-400">Đang tải…</div>
  const soCau = Object.values(rowsByPhan).reduce((s, rows) => s + rows.filter((r) => r.maCau).length, 0)
  // ⭐ 30/09 (Thùy) — TỔNG ĐIỂM MT: cộng diemByCau[maCau] cho MỌI hàng có maCau (thiếu key = DEFAULT_DIEM_MT).
  // Hàng Hình: tổng điểm các ý (07/10 — diemBaiHinh; đề cũ = điểm cả bài). Format bỏ trailing 0.
  const soYHinh = (ma: string): number => { const m = hinhMuc[ma]; return Math.max(1, m && m.kieu === 'de' ? m.ys.length : 1) }
  const tongDiem = Object.values(rowsByPhan).flat().reduce((s, r) => s + (!r.maCau ? 0
    : r.nhanh === 'hinh' ? diemBaiHinh(ch.diemByCau, r.maCau, soYHinh(r.maCau)).tong
    : (ch.diemByCau?.[r.maCau] ?? DEFAULT_DIEM_MT)), 0)
  const fmtDiem = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''))
  // Số câu HIỆN TRÊN PHIẾU cho từng hàng (Thùy 02/09: đếm theo thứ tự builder, bài Hình = 1 số/ý): "17" hoặc "17–19".
  const nhanSo: Record<string, string> = {}
  const soDau: Record<string, number> = {} // số câu của ý ĐẦU mỗi hàng — nhãn ô điểm từng ý Hình ("C19", "C20")
  { let n = 0
    for (const p of phans) (rowsByPhan[p.id] ?? []).forEach((r, i) => {
      if (!r.maCau) { nhanSo[`${p.id}:${i}`] = ''; return }
      const soY = r.nhanh === 'hinh' ? soYHinh(r.maCau) : 1
      soDau[`${p.id}:${i}`] = n + 1
      nhanSo[`${p.id}:${i}`] = soY > 1 ? `${n + 1}–${n + soY}` : String(n + 1)
      n += soY
    }) }
  const laToanCoHinh = coKhoHinh(d.mon)
  // Kéo thả hàng: kéo bằng tay ⠿ (ảnh kéo = cả hàng), thả lên nửa trên/dưới 1 hàng = chèn trước/sau; thả lên "+ Thêm câu" = cuối phần.
  const keoTu = (phanId: string, idx: number) => (e: React.DragEvent) => {
    setKeo({ phanId, idx })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', 'mt-hang')
    const hang = (e.currentTarget as HTMLElement).closest('[data-hang]')
    if (hang) e.dataTransfer.setDragImage(hang, 24, 18)
  }
  const keoXong = () => { setKeo(null); setDich(null) }
  const nuaDuoi = (e: React.DragEvent) => { const b = (e.currentTarget as HTMLElement).getBoundingClientRect(); return e.clientY > b.top + b.height / 2 }
  const tha = (phanId: string, idx: number) => ({
    'data-hang': '1',
    onDragOver: (e: React.DragEvent) => {
      if (!keo) return
      e.preventDefault()
      const sau = nuaDuoi(e)
      if (dich?.phanId !== phanId || dich.idx !== idx || dich.sau !== sau) setDich({ phanId, idx, sau })
    },
    onDrop: (e: React.DragEvent) => {
      if (!keo) return
      e.preventDefault()
      const from = keo, sau = nuaDuoi(e)
      keoXong()
      diChuyen(from, { phanId, idx: sau ? idx + 1 : idx })
    },
  })
  const vach = (phanId: string, idx: number) =>
    (keo?.phanId === phanId && keo.idx === idx ? ' opacity-40' : '')
    + (keo && dich?.phanId === phanId && dich.idx === idx ? (dich.sau ? ' shadow-[0_3px_0_0_#6366f1]' : ' shadow-[0_-3px_0_0_#6366f1]') : '')
  const daChonPlan: ChonBuoi = (() => {
    const m = new Map<string, string[]>()
    for (const pl of kh?.plan ?? []) { const x = dbs.get(pl.db); if (x && x.nhanh === kh!.nhanh) m.set(x.nhom_id, [...(m.get(x.nhom_id) ?? []), pl.db]) }
    return [...m.entries()].map(([nhom, dang_bai]) => ({ nhom, dang_bai }))
  })()

  return (
    <div className="flex h-full flex-col bg-[#fafafb]">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-5 py-2.5">
        {/* ⭐ 07-12: MT master cũng autosave (không nút Lưu) — enqueue link ở lúc ĐÓNG. Bản thân master
            hiếm khi tự gửi PH (thường gửi bản mt_buoi đã gán lớp), nhưng vẫn có link sẵn nếu cần. */}
        <button onClick={() => { useStore.getState().enqueueLinkGen(id, 'mt'); onClose() }} className="text-[13px] font-medium text-slate-400 hover:text-indigo-600">← Kho tài liệu</button>
        <input value={ten} onChange={(e) => setTen(e.target.value)} onBlur={saveTen} className="min-w-[260px] flex-1 rounded-md border border-transparent px-2 py-1 text-[15px] font-semibold text-slate-900 hover:border-slate-200 focus:border-indigo-400 focus:outline-none" />
        <span className="rounded bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600">{d.mon} · Khối {d.khoi} · mẫu độc lập</span>
        {coBdm && <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700" title="Chọn câu theo bản đồ kiến thức mới (nhóm bài · dạng bài), giống ET mới">🆕 Bản đồ mới</span>}
        <select value={mMeta.loaiDe ?? ''} onChange={(e) => setMtField({ loaiDe: (e.target.value || null) as MTLoaiDe | null })}
          title="Loại đề" className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[11.5px] font-medium text-slate-500 hover:border-violet-300">
          <option value="">Chưa gắn loại đề</option>
          {MT_LOAI_DE.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input type="month" value={mMeta.thang ?? ''} onChange={(e) => setMtField({ thang: e.target.value || null })}
          title="Tháng" className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[11.5px] font-medium text-slate-500 hover:border-violet-300" />
        {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        <span className="text-[12px] text-slate-400">{soCau} câu · <b className="text-violet-700">tổng {fmtDiem(tongDiem)} đ</b> · {phans.length} phần{ganList.length ? ` · đã gán ${ganList.length} lớp` : ''}</span>
        <button onClick={() => setPrinting(true)} disabled={!soCau} className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400 disabled:opacity-40">🖨 Xem / In</button>
        <button onClick={() => setGanModal(true)} disabled={!soCau} className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-40">🎯 Gán vào buổi</button>
        {onMo && <button onClick={() => setNhanBan(true)} title="Nhân bản thành MT mới rồi sửa phần khác (bản này giữ nguyên)" className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-medium text-slate-600 hover:border-indigo-400">⧉ Nhân bản</button>}
        <button onClick={xoaMT} title="Xoá MT" className="rounded-md border border-rose-200 px-3 py-1.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50">🗑 Xoá</button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mx-auto max-w-[900px]">
          {ganList.length > 0 && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-wide text-slate-400">Đã gán</p>
              <div className="flex flex-wrap gap-1.5">
                {ganList.map((g) => (
                  <span key={g.taiLieuId} className="flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-2.5 pr-1 text-[12px] font-medium text-emerald-700">
                    {g.lopTen} · {g.ngay.split('-').reverse().join('/')}
                    <button onClick={() => setChiaDe({ taiLieuId: g.taiLieuId, lopId: g.lopId, lopTen: g.lopTen })}
                      title="Chia mã đề theo TỪNG HS trong lớp (in cho cả lớp, trước khi vào buổi) + in"
                      className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-emerald-700 hover:bg-emerald-100">🎯 Chia đề &amp; In</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {loi && <div className="mb-3 whitespace-pre-line rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[13px] text-rose-600">{loi} <button onClick={() => setLoi(null)} className="ml-2 text-rose-400 hover:text-rose-700">✕</button></div>}
          <p className="mb-3 text-[12px] text-slate-400">
            {coBdm ? <>Mỗi phần bấm <b>⚡ Thêm nhiều dạng</b> → chọn nhiều dạng bài × số câu → hệ gợi ý câu <b>ít dùng nhất</b>; <b>✎ Chọn</b> tick được nhiều câu. </>
              : <>Mỗi câu chọn 1 dạng → hệ gợi ý câu <b>ít dùng nhất</b> (đổi được). </>}
            Đổi thứ tự: <b>kéo ⠿</b> hoặc <b>gõ số câu mới</b> vào ô số. Câu không trùng nhau XUYÊN mọi phần.
          </p>
          {soCau > 0 && (() => { const base = baseAll(); const t = oTrong().length + hinhTrong()
            const gen = !!(ch.etMaDe && Object.keys(ch.etMaDe).length) || !!(ch.hinhMaDe && Object.keys(ch.hinhMaDe).length); const stale = gen && base.length > 0 && maDeStale(base, ch)
            return (
              <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2">
                <span className="text-[12px] font-semibold text-violet-700">🧩 3 mã đề</span>
                <span className="text-[11px] text-slate-500">Đề gốc = các câu dưới; đề 2 &amp; 3 tự sinh — cùng dạng + form, khác câu (xuyên mọi phần).</span>
                <button onClick={sinhMaDe} className="ml-auto rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 {gen ? 'Sinh lại' : 'Sinh'} đề 2 &amp; 3</button>
                {stale ? <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">đã đổi câu — bấm Sinh lại</span>
                  : t ? <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">{t} ô trống — chọn tay trước khi in</span>
                  : gen ? <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">✓ đủ 3 mã đề</span> : null}
              </div>
            ) })()}
          <div className="space-y-3">
            {phans.map((p) => {
              const rows = rowsByPhan[p.id] ?? []
              return (
                <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{p.tieu_de}</span>
                    <span className="text-[12px] text-slate-400">{rows.filter((r) => r.maCau).length} câu</span>
                    <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-600" title="Hệ đang thấy được phần này (gán vào buổi tự lọc/loại nếu lớp không đủ tư cách)">{nhanHe(bacHieuLucCuaPhan(p.id))}</span>
                    <select value={bacEpCuaPhan(p.id) ?? ''} onChange={(e) => setPhanBac(p.id, e.target.value || null)}
                      title="Ép tay hệ tối thiểu cho CẢ PHẦN (đè lên tự tính theo dạng) — để trống = tự động"
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-500 hover:border-violet-300">
                      <option value="">Tự động</option>
                      {[...lopBacs].sort((a, b) => a.thu_tu - b.thu_tu).map((b) => <option key={b.ma} value={b.ma}>Ép: từ {b.ma} trở lên</option>)}
                    </select>
                    <button onClick={() => setPhanNangCao(p, !p.nang_cao)} title="Điểm các câu trong phần này cộng vào điểm Cơ bản hay Nâng cao của HS — bấm để đổi"
                      className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${p.nang_cao ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'}`}>
                      {p.nang_cao ? 'Nâng cao' : 'Cơ bản'}
                    </button>
                    {coBdm && kh?.phanId !== p.id && (
                      <button onClick={() => setKh({ phanId: p.id, nhanh: 'toan', plan: [] })}
                        className="rounded-md border border-dashed border-indigo-300 px-2 py-0.5 text-[11.5px] font-medium text-indigo-600 hover:bg-indigo-50">⚡ Thêm nhiều dạng</button>
                    )}
                    <button onClick={() => xoaPhan(p)} className="ml-auto text-[12px] text-slate-300 hover:text-rose-600">Xoá phần</button>
                  </div>
                  {kh?.phanId === p.id && (
                    <div className="mb-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-semibold text-indigo-700">⚡ Kế hoạch — nhiều dạng bài, mỗi dạng N câu</span>
                        <span className="text-[11px] text-slate-500">→ nối vào cuối {p.tieu_de}</span>
                        <button onClick={() => setKh(null)} className="ml-auto text-[12px] text-slate-400 hover:text-rose-600">Đóng</button>
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {kh.plan.length === 0
                          ? <div className="rounded-md border border-dashed border-indigo-200 bg-white px-3 py-4 text-center text-[12px] italic text-slate-400">bấm <b>+ Chọn dạng bài</b> để chọn nhiều dạng bài cùng lúc.</div>
                          : kh.plan.map((pl, j) => {
                            const info = dbs.get(pl.db)
                            return (
                              <div key={pl.db} className="flex items-center gap-2">
                                <span className="w-6 shrink-0 text-center text-[12px] font-bold text-violet-600">{j + 1}</span>
                                <span className="min-w-0 flex-1 truncate rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[13px] text-slate-700" title={info ? `${info.nhom_ten} › ${info.ten}` : pl.db}>
                                  {info ? <>{info.nhanh === 'hgt' && <span className="mr-1 rounded bg-sky-50 px-1 py-0.5 text-[10px] font-medium text-sky-700">HGT</span>}<span className="text-slate-400">{info.nhom_ten} › </span>{info.ten}</> : pl.db}
                                </span>
                                {info && <span className={`shrink-0 text-[11px] ${info.so_cau < pl.soCau ? 'font-medium text-rose-600' : 'text-slate-400'}`}>kho {info.so_cau}</span>}
                                <span className="text-[12px] text-slate-400">×</span>
                                <input type="number" min={1} max={50} value={pl.soCau}
                                  onChange={(e) => { const v = Math.max(1, Math.min(50, +e.target.value || 1)); setKh((k) => k && { ...k, plan: k.plan.map((x) => (x.db === pl.db ? { ...x, soCau: v } : x)) }) }}
                                  className="h-8 w-16 rounded border border-slate-300 px-1 text-center text-[13px]" />
                                <span className="text-[12px] text-slate-400">câu</span>
                                <button onClick={() => setKh((k) => k && { ...k, plan: k.plan.filter((x) => x.db !== pl.db) })} title="Bỏ dạng bài" className="text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                              </div>
                            )
                          })}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {coHgt && (
                            <div className="flex overflow-hidden rounded-md ring-1 ring-indigo-200" title="Bản đồ để chọn dạng bài">
                              {([['toan', 'Đại số'], ['hgt', 'Hình giải tích']] as [NhanhBdm, string][]).map(([v, l]) => (
                                <button key={v} onClick={() => setKh((k) => k && { ...k, nhanh: v })}
                                  className={`px-2 py-1 text-[11.5px] font-medium ${kh.nhanh === v ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`}>{l}</button>
                              ))}
                            </div>
                          )}
                          <button onClick={() => setChonPlan(true)} className="rounded-md border border-dashed border-indigo-300 px-2.5 py-1 text-[12px] font-medium text-indigo-600 hover:bg-indigo-50">+ Chọn dạng bài {kh.plan.length ? '(thêm/bớt)' : '(nhiều dạng cùng lúc)'}</button>
                          <button onClick={sinhKeHoach} disabled={khBusy || !kh.plan.length}
                            className="ml-auto rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-indigo-500 disabled:opacity-40">
                            {khBusy ? 'Đang sinh…' : `⚡ Sinh ${kh.plan.reduce((s, x) => s + x.soCau, 0)} câu`}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    {rows.map((r, i) => {
                      // ── HÀNG HÌNH (mô hình): cùng khung hàng như câu Đại — nhãn "Hình" + chuỗi, preview đề, tuỳ chọn hình vẽ
                      //    (hiện / ô trống / không — 3 trạng thái như ET Hình), số dòng, ↻ Đổi / ✎ Chọn / ✕. In chung ở "Xem / In".
                      if (r.nhanh === 'hinh' && r.maCau) {
                        const ma = r.maCau; const h = ch.hinhByMa?.[ma]; const m = hinhMuc[ma]
                        const cd = CHE_DO_HINH.find((x) => x.ma === (h?.cheDo ?? 'hien'))!
                        // Bố cục 2 dòng (Thùy 02/09: "trái phải đều trống, đề co cụm ở giữa"): dòng 1 = số · chuỗi · nhãn bản ·
                        // hình vẽ · dòng · nút; dòng 2 = ĐỀ trải rộng bên trái + HÌNH bên phải, dùng hết bề ngang hàng.
                        return (
                          <div key={i} {...tha(p.id, i)} className={`rounded-xl border border-amber-200 bg-amber-50/30 p-2.5${vach(p.id, i)}`}>
                            <div className="flex flex-wrap items-center gap-2">
                              <SoHang nhan={nhanSo[`${p.id}:${i}`] ?? ''} onKeo={keoTu(p.id, i)} onKeoXong={keoXong} onDoi={(so) => diChuyen({ phanId: p.id, idx: i }, viTriTheoSo({ phanId: p.id, idx: i }, so))} />
                              <button onClick={() => setHinhPicker({ phanId: p.id, idx: i })} className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-left text-[13px] hover:border-indigo-400" title="Chọn bài Hình khác">
                                <span className="mr-1 rounded bg-amber-50 px-1 py-0.5 text-[10px] font-medium text-amber-700">Hình</span>
                                <span className="font-mono text-[12px] text-slate-700">{h ? (h.kind === 'bai' ? ((m as { ma?: string | null } | undefined)?.ma ?? 'bài kho') : chuoiCuaHinh(h).map((b) => b.ma).join(' → ') || `${h.nodeIds.length} node`) : '?'}</span>
                              </button>
                              {h && (
                                <>
                                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{nhanBanHinh(h)}</span>
                                  <span className="text-[10px] text-slate-300">hình vẽ:</span>
                                  <button onClick={() => setHinhInfo(ma, { cheDo: cheDoKe(h.cheDo ?? 'hien') })} title={`${cd.goi} — bấm để đổi (hiện → ô trống → không)`}
                                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 hover:bg-slate-200">{cd.icon} {cd.nhan}</button>
                                </>
                              )}
                              <label className="ml-auto flex shrink-0 items-center gap-1 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết (bản in) — trống = mặc định như ET">dòng
                                <input type="number" min={0} max={50} value={h?.soDong ?? DONG_BTVN} onChange={(e) => setHinhInfo(ma, { soDong: e.target.value === '' ? null : Math.max(0, Math.min(50, +e.target.value || 0)) })} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                              </label>
                              {/* ⭐ 07/10 (Thùy) — điểm TỪNG Ý (mỗi ý = 1 câu trên phiếu), không chia đều điểm bài. Đề cũ đặt
                                  cả bài: giữ tổng, nhắc đặt lại (ô ý để "—" tới khi chọn). */}
                              {(() => { const db = diemBaiHinh(ch.diemByCau, ma, soYHinh(ma))
                                return db.cu ? <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10.5px] font-medium text-amber-800" title="Đề soạn trước 07/10 đặt điểm cho cả bài — chọn điểm từng câu bên dưới để thay">cũ: {fmtDiem(db.tong)}đ cả bài — đặt lại từng câu</span> : null })()}
                              <button onClick={() => doiHinh(ma)} title={h?.kind === 'bai' ? 'Đổi sang bài kho khác cùng mô hình, cùng số ý (ít dùng nhất)' : 'Đổi bản khác (cùng node, ít dùng nhất)'} className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                              <button onClick={() => setHinhPicker({ phanId: p.id, idx: i })} className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                              <button onClick={() => xoaRow(p.id, i)} title="Xoá hàng" className="shrink-0 px-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                            </div>
                            {/* Preview = đề + các ý (trái, trải rộng) + HÌNH VẼ (phải) — "preview bài của hình thì phải có cả hình" */}
                            <div className="mt-2 flex items-start gap-4 pl-10">
                              {m && m.kieu === 'de' ? (
                                <>
                                  {/* ⭐ 29/10 (CEO): mỗi Ý = 1 CÂU riêng (số câu + điểm ngay trên dòng ý) — giả thiết thêm của nhánh
                                      in trước câu hỏi của ý cần nó (mucGhep). Điểm từng ý giữ khoá diemBaiHinh (07/10). */}
                                  <div className="min-w-0 flex-1 text-[13px] leading-relaxed text-slate-700">
                                    {m.deBai && <div><MathText>{m.deBai}</MathText></div>}
                                    {(() => { const db = diemBaiHinh(ch.diemByCau, ma, soYHinh(ma)); const dau = soDau[`${p.id}:${i}`] ?? 1
                                      return m.ys.map((y, yi) => (
                                        <div key={yi} className="mt-1 flex items-start gap-2 rounded-md border border-amber-100 bg-white/70 px-2 py-1">
                                          <span className="mt-0.5 shrink-0 rounded bg-amber-100 px-1.5 text-[10.5px] font-semibold text-amber-800">Câu {dau + yi}</span>
                                          <span className="min-w-0 flex-1 text-[12.5px] text-slate-700">{y.nhan && <b>{y.nhan}) </b>}<MathText>{y.giaThietPhu ? `${y.giaThietPhu}. ${y.noiDung}` : y.noiDung}</MathText></span>
                                          <select value={db.yDiem[yi] ?? ''} onChange={(e) => setDiemY(ma, yi, +e.target.value)} title={`Điểm câu ${dau + yi}`}
                                            className="h-7 shrink-0 rounded border border-slate-300 bg-white px-1 text-[12px] font-medium text-slate-700">
                                            {db.yDiem[yi] == null && <option value="">—</option>}
                                            {MT_DIEM_OPTS.map((n) => <option key={n} value={n}>{n} đ</option>)}
                                          </select>
                                        </div>
                                      )) })()}
                                  </div>
                                  {m.anhDe && <img src={m.anhDe} alt="" className="max-h-40 w-auto max-w-[280px] shrink-0 rounded border border-slate-200 bg-white object-contain" />}
                                </>
                              ) : <span className="text-[12px] italic text-slate-400">{hinhL ? 'đang dựng đề…' : 'đang tải kho Hình…'}</span>}
                            </div>
                          </div>
                        )
                      }
                      const c = r.maCau ? cau[r.maCau] : null
                      const form = c ? etFormOf(c, ch) : null
                      // ⭐ 30/09 — TN option MỞ cho câu có form_tn đã duyệt (bảng <kho>_cau_form_tn),
                      // không chỉ câu có lua_chon sẵn trên bảng gốc — CEO: "hệ đã sinh nhiều MCQ, tính vào".
                      const formOpts = ET_FORMS.filter((f) => f.v !== 'trac_nghiem' || !!(c?.lua_chon && c.lua_chon.length) || (c ? !!formTnByMa[c.ma_cau] : false))
                      const dbInfo = r.nhanh === 'bdm' && r.maDang ? dbs.get(r.maDang) ?? null : null
                      return (
                        <div key={i} {...tha(p.id, i)} className={`rounded-xl border border-slate-200 bg-slate-50/60 p-2.5${vach(p.id, i)}`}>
                          <div className="flex items-start gap-2">
                          <SoHang className="mt-0.5" nhan={nhanSo[`${p.id}:${i}`] ?? ''} onKeo={keoTu(p.id, i)} onKeoXong={keoXong} onDoi={(so) => diChuyen({ phanId: p.id, idx: i }, viTriTheoSo({ phanId: p.id, idx: i }, so))} />
                          <button onClick={() => setDangModal({ phanId: p.id, idx: i, nhanh: r.nhanh })} title={dbInfo ? `${dbInfo.nhom_ten} › ${dbInfo.ten}` : undefined}
                            className="w-56 shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-left text-[13px] hover:border-indigo-400">
                            {dbInfo ? (
                              <span className="line-clamp-2 text-slate-700">
                                {dbInfo.nhanh === 'hgt' && <span className="mr-1 rounded bg-sky-50 px-1 py-0.5 text-[10px] font-medium text-sky-700">HGT</span>}
                                <span className="text-slate-400">{dbInfo.nhom_ten} › </span>{dbInfo.ten}
                              </span>
                            ) : r.maDang ? (
                              <span className="text-slate-700">
                                {coNhieuNhanh && <span className="mr-1 rounded bg-sky-50 px-1 py-0.5 text-[10px] font-medium text-sky-700" title="Bản đồ kiến thức (nhánh kho) của câu này">{tenNhanh(d.mon, r.nhanh) ?? ''}</span>}
                                {tenDang(r.maDang, r.nhanh)}
                              </span>
                            ) : c ? <span className="text-amber-700" title="Câu này đã bị gỡ khỏi dạng bài trên bản đồ — vẫn in được, nhưng đề 2/3 chỉ dùng lại chính câu này. Bấm để chọn dạng (sẽ THAY câu bằng câu gợi ý của dạng đó).">⚠ Câu chưa thuộc dạng bài nào</span>
                              : <span className="text-indigo-500">+ chọn dạng…</span>}
                          </button>
                          <div className="min-w-0 flex-1 pt-1">
                            {c ? <div className="truncate text-[13px] text-slate-700"><MathText>{c.noi_dung}</MathText></div>
                              : r.maDang ? <span className="text-[12px] italic text-slate-400">chưa có câu</span>
                              : <span className="text-[12px] italic text-slate-300">chọn dạng để hệ gợi ý câu</span>}
                            {c && (
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500" title="Mã câu">{c.ma_cau}</span>
                                <span className="text-[10px] text-slate-300">kho: {loaiLabel(c.loai_cau)} · in dạng:</span>
                                <div className="flex gap-0.5">
                                  {formOpts.map((f) => (
                                    <button key={f.v} onClick={() => setForm(c.ma_cau, f.v)} title="Form hiển thị trong đề (khác loại kho)"
                                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${form === f.v ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{f.lbl}</button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {c && form === 'tu_luan' && (
                            <label className="flex shrink-0 items-center gap-1 pt-1.5 text-[11px] text-slate-400" title="Số dòng kẻ cho HS viết (bản in)">dòng
                              <input type="number" min={0} max={50} value={ch.btvnLinesByCau?.[c.ma_cau] ?? 4} onChange={(e) => setLines(c.ma_cau, Math.max(0, Math.min(50, +e.target.value || 0)))} className="h-7 w-12 rounded border border-slate-300 px-1 text-center text-[12px]" />
                            </label>
                          )}
                          {r.maDang && (
                            <div className="flex shrink-0 gap-1 pt-0.5">
                              <button onClick={() => doiCau(p.id, i)} title="Đổi câu khác (ít dùng kế tiếp)" className="rounded-md bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100">↻ Đổi</button>
                              <button onClick={() => (dbInfo ? setChonCauBdm({ phanId: p.id, idx: i }) : setPicker({ phanId: p.id, idx: i, maDang: r.maDang!, nhanh: r.nhanh }))}
                                title="Chọn câu — tick NHIỀU câu được: câu thêm chèn ngay sau hàng này" className="rounded-md border border-slate-300 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-400">✎ Chọn</button>
                            </div>
                          )}
                          {c && (
                            <label className="flex shrink-0 items-center gap-1 self-start pt-1.5 text-[11px] text-slate-500" title="Tích = in 2 cột — các câu 2 cột LIỀN NHAU tự xếp cạnh nhau">
                              <input type="checkbox" checked={(ch.colByCau?.[c.ma_cau] ?? 1) === 2} onChange={(e) => setColCau(c.ma_cau, e.target.checked ? 2 : 1)} className="h-3.5 w-3.5 accent-sky-600" />
                              2 cột
                            </label>
                          )}
                          {c && (
                            <select value={ch.diemByCau?.[c.ma_cau] ?? DEFAULT_DIEM_MT} onChange={(e) => setDiem(c.ma_cau, +e.target.value)}
                              title="Điểm câu này" className="h-7 shrink-0 self-start rounded border border-slate-300 bg-white px-1 text-[12px] font-medium text-slate-700">
                              {MT_DIEM_OPTS.map((n) => <option key={n} value={n}>{n} đ</option>)}
                            </select>
                          )}
                          <button onClick={() => xoaRow(p.id, i)} title="Xoá hàng" className="shrink-0 px-1 pt-1 text-[13px] text-slate-300 hover:text-rose-600">✕</button>
                          </div>
                          {/* Mã đề 2 & 3 — câu khác cùng dạng + form với câu gốc; TRỐNG thì chọn tay (giống ET). */}
                          {c && ch.etMaDe?.[c.ma_cau] && (
                            <div className="mt-2 ml-8 space-y-1 border-t border-dashed border-slate-200 pt-2">
                              {[0, 1].map((v) => {
                                const vm = ch.etMaDe?.[c.ma_cau]?.[v] ?? null
                                const vc = vm ? cau[vm] : null
                                const f = etFormOf(c, ch)
                                return (
                                  <div key={v} className="flex items-center gap-2 text-[12px]">
                                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Mã đề {v + 2}</span>
                                    {vm ? (
                                      <>
                                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">{vm}</span>
                                        <span className="min-w-0 flex-1 truncate text-slate-600">{vc ? <MathText>{vc.noi_dung}</MathText> : '…'}</span>
                                      </>
                                    ) : (
                                      <span className="min-w-0 flex-1 font-medium text-rose-500">⚠ TRỐNG — chưa có câu cùng dạng + form khác</span>
                                    )}
                                    {(r.maDang ?? c.dang_chinh) && (
                                      <button onClick={() => setVarPicker({ baseMaCau: c.ma_cau, v, maDang: (r.maDang ?? c.dang_chinh)!, nhanh: r.nhanh, form: f })}
                                        className="shrink-0 rounded-md border border-slate-300 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-violet-400">✎ {vm ? 'Đổi' : 'Chọn'}</button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <button onClick={() => themCau(p.id)}
                    onDragOver={(e) => { if (keo) { e.preventDefault(); setDich(null) } }}
                    onDrop={(e) => { if (!keo) return; e.preventDefault(); const from = keo; keoXong(); diChuyen(from, { phanId: p.id, idx: sauCauCuoi(p.id) }) }}
                    className="mt-2.5 w-full rounded-lg border-2 border-dashed border-violet-200 bg-violet-50/40 py-2 text-[13px] font-medium text-violet-700 hover:bg-violet-50">+ Thêm câu</button>
                </div>
              )
            })}
            <button onClick={themPhan} className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white py-3 text-[14px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">+ Thêm phần (vd "Phần II. Hình học")</button>
          </div>
        </div>
      </div>

      {dangModal && d && (
        <DangPickerOne khoi={d.khoi} mon={d.mon} nhanh={dangModal.nhanh} chonNhanh banDoMoi onClose={() => setDangModal(null)}
          pillsThem={laToanCoHinh ? [{ ten: 'Hình · Luyện', onClick: () => { const { phanId, idx } = dangModal; setDangModal(null); setHinhPicker({ phanId, idx }) } }] : undefined}
          onPick={(ma, nh) => { const { phanId, idx } = dangModal; setDangModal(null); pickDang(phanId, idx, ma, nh) }} />
      )}
      {picker && (
        <KhoPicker maDangs={[picker.maDang]} cauTbl={tblCua(picker.nhanh)} selected={rowsByPhan[picker.phanId]?.[picker.idx]?.maCau ? [rowsByPhan[picker.phanId][picker.idx].maCau!] : []} onClose={() => setPicker(null)}
          onConfirm={async (m) => {
            if (m.length) await ensureCache(picker.maDang, tblCua(picker.nhanh))
            await chenNhieuCau(picker.phanId, picker.idx, m, () => picker.maDang, picker.nhanh)
            setPicker(null)
          }} />
      )}
      {chonCauBdm && (() => {
        const r = rowsByPhan[chonCauBdm.phanId]?.[chonCauBdm.idx]
        const info = r?.maDang ? dbs.get(r.maDang) : null
        if (!r || !info) return null
        return (
          <ChonCauBdm tl={{ mon: d.mon, nhanh: 'bdm', cau_hinh: null }} coKhoLop={false} nhomId={info.nhom_id} uuTien={r.maDang}
            selected={r.maCau ? [r.maCau] : []} khoa={[...usedGlobal(chonCauBdm.phanId, chonCauBdm.idx)]}
            onClose={() => setChonCauBdm(null)}
            onConfirm={async (ms) => {
              const { phanId, idx } = chonCauBdm
              try {
                const vt = new Map((await etViTri(d.khoi, ms)).map((v) => [v.ma_cau, v.dang_bai_id]))
                await napBdm(ms)
                await chenNhieuCau(phanId, idx, ms, (m) => vt.get(m) ?? r.maDang, 'bdm')
              } catch (e) { setLoi(loiDoc(e)) }
              setChonCauBdm(null)
            }} />
        )
      })()}
      {chonPlan && kh && (
        <BoChonNhom khoi={d.khoi} nhanh={kh.nhanh} daChon={daChonPlan} onClose={() => setChonPlan(false)}
          onConfirm={(c) => {
            const cu = new Map(kh.plan.map((pl) => [pl.db, pl.soCau]))
            const giu = kh.plan.filter((pl) => dbs.get(pl.db)?.nhanh !== kh.nhanh)   // dạng bài của bản đồ kia (Đại ↔ HGT) giữ nguyên
            setKh({ ...kh, plan: [...giu, ...c.flatMap((x) => x.dang_bai).map((db) => ({ db, soCau: cu.get(db) ?? SO_CAU_MAC_DINH }))] })
            setChonPlan(false)
          }} />
      )}
      {varPicker && (
        <KhoPicker maDangs={[varPicker.maDang]} cauTbl={tblCua(varPicker.nhanh)}
          selected={ch.etMaDe?.[varPicker.baseMaCau]?.[varPicker.v] ? [ch.etMaDe[varPicker.baseMaCau][varPicker.v]!] : []}
          disabled={[...usedMoiDe()]} onClose={() => setVarPicker(null)}
          onConfirm={async (m) => {
            const used = usedMoiDe()
            const pick = m.find((x) => !used.has(x)) ?? m[0] ?? null
            if (pick) {
              const list = await listCauByDang(varPicker.maDang, tblCua(varPicker.nhanh))
              setCau((prev) => ({ ...prev, ...Object.fromEntries(list.map((cc) => [cc.ma_cau, cc])) }))
              await setVar(varPicker.baseMaCau, varPicker.v, pick, varPicker.form)
            }
            setVarPicker(null)
          }} />
      )}
      {ganModal && d && <GanBuoiModal mtId={id} mon={d.mon} ganList={ganList} onClose={() => setGanModal(false)} onDone={async () => { setGanModal(false); await reload() }} />}
      {printing && <MTPrintView id={id} onClose={() => setPrinting(false)} />}
      {hinhPicker && d && (hinhL
        ? <ChonYTuCay L={hinhL} khoi={d.khoi} phan="mt"
            chonSan={(() => { const ma = rowsByPhan[hinhPicker.phanId]?.[hinhPicker.idx]?.maCau; const h = ma ? ch.hinhByMa?.[ma] : undefined; return h?.kind === 'ghep' && !h.luaId ? h.nodeIds : undefined })()}
            baiSan={(() => { const ma = rowsByPhan[hinhPicker.phanId]?.[hinhPicker.idx]?.maCau; const h = ma ? ch.hinhByMa?.[ma] : undefined; return h?.kind === 'bai' && h.baiId ? { baiId: h.baiId, moHinhId: h.moHinhId ?? null } : undefined })()}
            onClose={() => setHinhPicker(null)} onPick={(pk) => { const { phanId, idx } = hinhPicker; setHinhPicker(null); pickHinh(phanId, idx, pk) }} />
        : <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40" onClick={() => setHinhPicker(null)}><div className="rounded-xl bg-white px-5 py-3 text-sm text-slate-600">Đang tải kho Hình khối {d.khoi}… (bấm lại sau giây lát)</div></div>)}
      {chiaDe && <ChiaDeMTModal {...chiaDe} onClose={() => setChiaDe(null)} />}
      {nhanBan && onMo && <NhanBanMTModal goc={{ id, ten: d.ten }} onClose={() => setNhanBan(false)} onXong={(moi) => { setNhanBan(false); useStore.getState().enqueueLinkGen(id, 'mt'); onMo(moi) }} />}
    </div>
  )
}

// Ô số câu của 1 hàng: tay kéo ⠿ + số câu gõ được (gõ số mới, Enter ⇒ chuyển câu tới vị trí đó; Esc huỷ).
function SoHang({ nhan, className, onKeo, onKeoXong, onDoi }: {
  nhan: string; className?: string; onKeo: (e: React.DragEvent) => void; onKeoXong: () => void; onDoi: (so: number) => void
}) {
  const [v, setV] = useState(nhan)
  useEffect(() => { setV(nhan) }, [nhan])
  const xong = () => {
    const so = parseInt(v, 10)
    if (Number.isFinite(so) && so > 0 && so !== parseInt(nhan, 10)) onDoi(so)
    setV(nhan)   // hàng ở vị trí này sau khi chuyển vẫn mang đúng số `nhan` ⇒ trả ô về số thật (không giữ số vừa gõ)
  }
  return (
    <span className={`flex shrink-0 items-center ${className ?? ''}`}>
      <span draggable onDragStart={onKeo} onDragEnd={onKeoXong} title="Kéo để đổi thứ tự (thả sang phần khác cũng được)"
        className="cursor-grab select-none px-0.5 text-[15px] leading-none text-slate-300 hover:text-indigo-500 active:cursor-grabbing">⠿</span>
      <input value={v} placeholder="·" onChange={(e) => setV(e.target.value)} onFocus={(e) => e.target.select()} onBlur={xong}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') { setV(nhan); e.currentTarget.blur() }
        }}
        title="Số câu trên phiếu — gõ số mới rồi Enter để chuyển câu tới vị trí đó"
        className="h-7 w-11 rounded border border-transparent bg-transparent text-center text-[12px] font-bold text-violet-600 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:outline-none" />
    </span>
  )
}

// ── GÁN VÀO BUỔI: CHỈ chọn lớp (cùng môn với MT) + ngày (Thùy 07-08: "giờ/GV/phòng thuộc về buổi
// học, MT không cần hỏi lại" — buổi mới (nếu chưa có) tự suy giờ/phòng từ TKB, xem tkbSlotCuaLop mt.ts) ──
function GanBuoiModal({ mtId, mon, ganList, onClose, onDone }: { mtId: string; mon: string; ganList: MTGanRow[]; onClose: () => void; onDone: () => void }) {
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [ngay, setNgay] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null)
  useEffect(() => { listLop().then((ls) => setLops(ls.filter((l) => l.mon === mon))) }, [mon])

  // Lớp này đã có 1 lượt gán (từ đúng MT này) rồi — gán ngày khác sẽ THAY THẾ (đè), cảnh báo trước.
  const daGan = lopId ? ganList.find((g) => g.lopId === lopId) : null
  const daySo = (s: string) => s.split('-').reverse().join('/')

  async function xacNhan() {
    if (!lopId || !ngay) return
    if (daGan && daGan.ngay !== ngay) {
      if (!confirm(`Lớp này đã gán MT vào ngày ${daySo(daGan.ngay)}. Gán ngày ${daySo(ngay)} sẽ THAY THẾ — bản gán ngày ${daySo(daGan.ngay)} bị xoá (buổi học ngày đó vẫn còn, chỉ mất nội dung MT). Tiếp tục?`)) return
    }
    setBusy(true)
    try {
      const kq = await ganMTVaoBuoi(mtId, { lopId, ngay })
      // ⭐ 07-12: doc mt_buoi vừa gán ĐỦ NỘI DUNG ngay (copy từ master) — enqueue link luôn.
      useStore.getState().enqueueLinkGen(kq.taiLieuId, 'mt_buoi')
      const loaiMsg = kq.soCauLoai > 0 ? ` (đã tự loại ${kq.soCauLoai} câu nâng cao — lớp này không đủ tư cách theo bậc dạng ở bản đồ kiến thức)` : ''
      const hinhMsg = kq.soBaiHinh > 0 ? ` Kèm ${kq.soBaiHinh} bài Hình (mô hình).` : ''
      // Lớp chưa xếp bậc (lop.bac trống) → không lọc câu nâng cao, giữ nguyên đề — nói ra để người biết (04/09: 9K1).
      const bacMsg = kq.lopChuaCoBac ? ' ⚠ Lớp này CHƯA xếp bậc (S/A/B/C) nên giữ nguyên toàn bộ đề, không lọc câu nâng cao — xếp bậc ở Quản lý lớp rồi gán lại nếu cần lọc.' : ''
      setRes({ ok: true, msg: (kq.buoiMoi ? 'Đã tạo buổi mới + gán nội dung MT.' : 'Đã gán nội dung MT vào buổi có sẵn (lớp+ngày này đã có buổi).') + loaiMsg + hinhMsg + bacMsg + ' Chấm ở tab "🏆 MT" trong buổi (Buổi học/Việc của tôi).' })
    } catch (e: any) { setRes({ ok: false, msg: e.message ?? String(e) }) } finally { setBusy(false) }
  }
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="w-[460px] max-w-full rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[15px] font-semibold text-slate-900">Gán MT vào buổi</p>
        {res ? (
          <>
            <p className={`mt-3 text-[13px] ${res.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{res.msg}</p>
            <div className="mt-4 flex justify-end gap-2">
              {res.ok && <button onClick={() => setRes(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Gán tiếp lớp khác</button>}
              <button onClick={onDone} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Đóng</button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-[12px] text-slate-500">Chọn buổi học (lớp + ngày) để gán nội dung MT vào — MT là 1 tab của buổi đó (giống ET), không tách buổi riêng. Giờ/phòng/GV thuộc về buổi học, sửa ở đó nếu cần.</p>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Lớp ({mon})</label>
            <div className="mt-1"><SearchSelect value={lopId} onChange={setLopId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: l.khoi ? `Khối ${l.khoi}` : '' }))} /></div>
            <label className="mt-3 block text-[12px] font-medium text-slate-600">Ngày *</label>
            <BuoiNgaySelect lopId={lopId} value={ngay} onChange={setNgay} className={`${inp} mt-1 w-full`} defaultToday />
            {daGan && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[12px] text-amber-700">
                ⚠ Lớp này đã gán MT này vào <b>{daySo(daGan.ngay)}</b>{daGan.ngay !== ngay ? ' — chọn "Gán" sẽ THAY THẾ bản gán đó.' : '.'}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Huỷ</button>
              <button disabled={!lopId || !ngay || busy} onClick={xacNhan} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">{busy ? 'Đang gán…' : 'Gán'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════ CHIA ĐỀ THEO HS + IN CẢ LỚP ═══════════
// Thùy: "MT in TRƯỚC khi vào lớp — phải in theo DANH SÁCH LỚP" (khác ET in theo HS CÓ MẶT, vì ET in NGAY
// TRONG buổi, sau điểm danh — hsCoMatCuaBuoi đọc điểm danh CHƯA có lúc phát đề MT). Roster = TOÀN BỘ HS
// đang học của lớp (listHSCuaLop), không phụ thuộc điểm danh. Gán mã đề lưu vào cau_hinh.hsMaDe của BẢN
// mt_buoi (doc đã gán riêng cho lớp này), KHÔNG phải master (master dùng chung cho nhiều lớp khác nhau).
function ChiaDeMTModal({ taiLieuId, lopId, lopTen, onClose }: { taiLieuId: string; lopId: string; lopTen: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [phans, setPhans] = useState<PhanResolved[] | null>(null) // giữ để tính base (đủ 3 mã đề?)
  const [ch, setCh] = useState<CauHinh>({})
  const [roster, setRoster] = useState<{ id: string; ho_ten: string; ma_hs: string | null }[]>([])
  const [saved, setSaved] = useState(false)
  const [printing, setPrinting] = useState<{ id: string; ho_ten: string; maDe: number }[] | null>(null)
  const markSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }

  useEffect(() => {
    let alive = true
    setLoading(true)
    Promise.all([getTaiLieuFull(taiLieuId), listHSCuaLop(lopId)]).then(([f, hsl]) => {
      if (!alive) return
      setPhans(f.phans.filter((p) => p.loai_phan === 'custom'))
      setCh(f.taiLieu.cau_hinh ?? {})
      setRoster(
        hsl.map((x) => x.hoc_sinh).filter((h): h is HocSinh => !!h)
          .map((h) => ({ id: h.id, ho_ten: h.ho_ten, ma_hs: h.ma_hs }))
          .sort((a, b) => a.ho_ten.localeCompare(b.ho_ten, 'vi')),
      )
    }).finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [taiLieuId, lopId])

  const base: BaseItem[] = (phans ?? []).flatMap((p) => p.caus.filter((c) => c.ma_cau).map((c) => ({ maDang: c.dang_chinh, maCau: c.ma_cau })))
  // ⭐ KHÔNG dùng maDeReady/maDeStale ở đây (Thùy báo "mỗi lần vào lại mất đề 2/3"): những hàm đó so
  // KHỚP TUYỆT ĐỐI base ↔ etMaDe, đúng cho MTEditor (base = TOÀN BỘ câu của MT master) nhưng SAI ở đây —
  // base của 1 lớp là TẬP CON (ganMTVaoBuoi LỌC BỚT câu nâng cao lớp không đủ bậc, xem mt.ts) trong khi
  // etMaDe copy NGUYÊN từ master nên còn THỪA key của câu đã bị lọc. maDeStale thấy "thừa key" tưởng lệch
  // → báo "chưa đủ 3 mã đề" dù dữ liệu vẫn nguyên ở MT gốc. Ở đây chỉ cần: mọi câu CÒN LẠI (sau lọc) có
  // đủ cặp đề 2/3 — không quan tâm etMaDe dư key của câu đã lọc.
  // MT chỉ có hàng Hình (base Đại rỗng) vẫn chia đề được (bản in tự dùng hinhMaDe, thiếu thì về bài gốc); có Đại
  // thì Đại phải đủ 3 mã đề như cũ. soMuc = mọi hàng (câu kho + hàng Hình) — đọc maCaus thô, không chỉ caus.
  const soMuc = (phans ?? []).flatMap((p) => p.maCaus).length
  const daiReady = base.length === 0 || (!!ch.etMaDe && oTrongMaDe(base, ch).length === 0)
  const deReady = phans != null && soMuc > 0 && daiReady

  async function save(next: CauHinh) { setCh(next); await updateTaiLieu(taiLieuId, { cau_hinh: next }); markSaved() }
  const setHsMa = (hsId: string, maDe: number) => save({ ...ch, hsMaDe: { ...(ch.hsMaDe ?? {}), [hsId]: maDe } })
  const raiTuDong = () => { const m: Record<string, number> = {}; roster.forEach((hs, i) => { m[hs.id] = (i % 3) + 1 }); save({ ...ch, hsMaDe: m }) }
  const inCaLop = () => setPrinting(roster.map((hs) => ({ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 })))

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 px-4" onClick={onClose}>
      <div className="flex max-h-[85vh] w-[520px] max-w-full flex-col rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center gap-2">
          <p className="text-[15px] font-semibold text-slate-900">Chia đề — {lopTen}</p>
          {saved && <span className="text-[12px] text-emerald-600">✓ Đã lưu</span>}
        </div>
        <p className="mb-3 text-[12px] text-slate-500">In <b>TRƯỚC khi vào buổi</b>, theo danh sách CẢ LỚP (khác ET in theo HS điểm danh có mặt) — chưa điểm danh cũng chia đề được.</p>
        {loading ? <p className="text-[12px] italic text-slate-400">Đang tải…</p>
          : !deReady ? (
            <p className="text-[12px] italic text-amber-600">MT này chưa đủ 3 mã đề (còn ô trống hoặc chưa sinh) — mở MT, bấm "🎲 Sinh đề 2 &amp; 3" cho đủ trước khi chia đề.</p>
          ) : roster.length === 0 ? (
            <p className="text-[12px] italic text-slate-400">Lớp {lopTen} chưa có HS đang học.</p>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <button onClick={raiTuDong} className="rounded-md border border-violet-300 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-700 hover:bg-violet-100">🎲 Rải tự động</button>
                <button onClick={inCaLop} className="ml-auto rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-indigo-500">🖨 Xem &amp; In cả lớp</button>
              </div>
              <ol className="min-h-0 flex-1 space-y-1 overflow-auto">
                {roster.map((hs) => { const cur = ch.hsMaDe?.[hs.id]
                  return (
                    <li key={hs.id} className="flex items-center gap-2 rounded-md border border-slate-100 px-2 py-1.5">
                      <span className="min-w-0 flex-1 truncate text-[12px] text-slate-700" title={hs.ma_hs ?? ''}>{hs.ho_ten}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((n) => (
                          <button key={n} onClick={() => setHsMa(hs.id, n)} title={`Mã đề ${n}`}
                            className={`h-6 w-6 rounded text-[12px] font-bold ${cur === n ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{n}</button>
                        ))}
                      </div>
                      <button onClick={() => setPrinting([{ id: hs.id, ho_ten: hs.ho_ten, maDe: ch.hsMaDe?.[hs.id] ?? 1 }])} title="In riêng phiếu HS này" className="shrink-0 text-[13px] text-slate-400 hover:text-indigo-600">🖨</button>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-2 text-[11px] text-slate-400">Rải tự động = xoay vòng 1·2·3 theo thứ tự (HS cạnh nhau khác mã). Chưa gán tay HS nào → mặc định mã đề 1 lúc in.</p>
            </>
          )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-1.5 text-[13px] text-slate-600">Đóng</button>
        </div>
      </div>
      {printing && <MTPrintView id={taiLieuId} perHS={printing} lopTen={lopTen} onClose={() => setPrinting(null)} />}
    </div>
  )
}
