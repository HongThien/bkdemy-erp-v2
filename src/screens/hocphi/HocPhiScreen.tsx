// Học phí (staff, Apple-clean §189 — KHÔNG sci-fi). Spec: spec-hocphi.md.
// 5 tab: Danh sách (tổng quan mọi PH/kỳ → ảnh/PDF thông báo) · Phiếu (chọn PH+kỳ → phiếu ảo/thật,
// chốt kỳ, thu tiền) · Xét duyệt (người-trong-vòng-lặp, KHÔNG auto-giảm) · Mức học phí · Mức học liệu.
import { useEffect, useState } from 'react'
import {
  listMucHocPhi, createMucHocPhi, deleteMucHocPhi,
  listMucHocDuoi, createMucHocDuoi, deleteMucHocDuoi,
  listMucHocLieu, createMucHocLieu, deleteMucHocLieu,
  listPhieuTheoKy, listDuoiTheoKy, chotKy, huyChot, ghiThanhToan, listNoPhaiThu, setNoKhoiTao, listPhuHuynhCoConDangHoc,
  kyHienTai,
  listHocPhiTheoMonV2, setCongThucHocPhi, getDiemDanhTheoLop,
  listHeSoHocSinh, xacNhanHeSo, setHeSoThuCong, boManualHeSo,
  listPhatSinhTheoKy, themPhatSinhLop, themPhatSinhCaNhan, xoaPhatSinh,
  layTenConDangHoc, soanThongBao, danhDauDaBao,
  type MucHocPhi, type MucHocDuoi, type MucHocLieu, type DongSoHang, type DongDuoiSoHang, type DongNo, type PHOpt, type HocSinhHeSo, type PhatSinhEntry,
  type DongTheoMonV2, type CongThuc, type DiemDanhLop,
} from '../../lib/hocphi'
import { listLop, listHocSinh, updateLop, type Lop, type HocSinh } from '../../lib/nhansu'
import { AnhGuiPHModal } from './PhieuThongBao'
import SearchSelect from '../../components/SearchSelect'
import { inp } from '../kho/ui'
import { useStore } from '../../store/useStore'

const tienVN = (n: number) => Math.round(n).toLocaleString('vi-VN') + 'đ'
const LOAI_LABEL: Record<string, string> = { hoc_phi: 'Học phí', hoc_duoi: 'Học đuổi', hoc_lieu: 'Học liệu', phat_sinh: 'Phát sinh', no_ky_truoc: 'Nợ kỳ trước' }

// Chọn kỳ (tháng) — thay input[type=month] (Safari/Mac hiện "July 2026" khó chịu). Nút ‹ › + nhãn VN.
// value/onChange giữ nguyên format 'YYYY-MM-01' như setKy cũ → thay tại chỗ, không đụng logic tab.
// Cộng/trừ tháng bằng số học index (không new Date('YYYY-MM…') — cấm theo CLAUDE.md, tránh lệch TZ).
function KyPicker({ ky, onChange, className = '' }: { ky: string; onChange: (ky: string) => void; className?: string }) {
  const [y, m] = ky.slice(0, 7).split('-').map(Number) // m: 1..12
  const shift = (d: number) => {
    const idx = y * 12 + (m - 1) + d
    onChange(`${Math.floor(idx / 12)}-${String((idx % 12) + 1).padStart(2, '0')}-01`)
  }
  return (
    <div className={`inline-flex select-none items-center overflow-hidden rounded-lg border border-slate-300 bg-white ${className}`}>
      <button type="button" onClick={() => shift(-1)} aria-label="Kỳ trước" className="grid h-9 w-8 place-items-center text-base text-slate-500 hover:bg-slate-100 active:bg-slate-200">‹</button>
      <span className="min-w-[96px] px-1 text-center text-[13px] font-medium tabular-nums text-slate-800">Tháng {m}/{y}</span>
      <button type="button" onClick={() => shift(1)} aria-label="Kỳ sau" className="grid h-9 w-8 place-items-center text-base text-slate-500 hover:bg-slate-100 active:bg-slate-200">›</button>
    </div>
  )
}
const TAB = [['theomon', 'HS theo môn'], ['diemdanh', 'Điểm danh'], ['danhsach', 'Học phí tổng'], ['hocduoi', 'Học phí bổ trợ đuổi'], ['no', 'Học phí nợ'], ['heso', 'Hệ số'], ['muc', 'Mức & Lớp'], ['phatsinh', 'Phát sinh']] as const
type Tab = (typeof TAB)[number][0]

export default function HocPhiScreen() {
  // Tab + bộ lọc giữ ở zustand (module-scope, KHÔNG mất khi tab con unmount/remount — Thùy 07-05: "đừng reset").
  const tab = useStore((s) => s.hocPhiTab) as Tab
  const setTab = useStore((s) => s.setHocPhiTab)
  return (
    <div className="flex h-full flex-col bg-[#f5f5f7]">
      <div className="flex flex-none flex-wrap items-center gap-1.5 border-b border-slate-200 bg-white px-6 py-2.5">
        <span className="mr-2 text-sm font-semibold text-slate-900">Học phí</span>
        {TAB.map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} className={`rounded-lg px-3 py-1.5 text-[13px] font-medium transition ${tab === v ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-6">
        {tab === 'theomon' && <TheoMonTab />}
        {tab === 'diemdanh' && <DiemDanhTab />}
        {tab === 'danhsach' && <DanhSachTab />}
        {tab === 'hocduoi' && <DuoiTab />}
        {tab === 'no' && <NoTab />}
        {tab === 'heso' && <HeSoTab />}
        {tab === 'muc' && <MucTab />}
        {tab === 'phatsinh' && <PhatSinhTab />}
      </div>
    </div>
  )
}

// ── TAB HS THEO MÔN (đời 2 — Thùy 07-13) — toggle từng MÔN, mỗi dòng 1 HS × lớp với thông tin
// VẬN HÀNH (lớp học mấy buổi / nghỉ mấy / bù mấy / đuổi mấy — PH/đơn giá/hệ số là thông tin fix,
// xem trong Detail) + cột CÔNG THỨC (hệ đề xuất theo ngưỡng nghỉ 30%, người dùng chọn lại được)
// + Thành tiền = học chính (ct1/ct2) + đuổi + tài liệu + nút Detail (popup ngày đi/nghỉ/bù/đuổi).
// nhãn toggle ngắn (Thùy: "Toán - Văn - Anh - KHTN") nhưng GIÁ TRỊ môn trong DB là 'Tiếng Anh' —
// map tường minh, không so trực tiếp nhãn (bug thật 07-13: toggle Anh luôn 0 dòng).
const MON_TOGGLE: { label: string; value: string }[] = [
  { label: 'Toán', value: 'Toán' }, { label: 'Văn', value: 'Văn' }, { label: 'Anh', value: 'Tiếng Anh' }, { label: 'KHTN', value: 'KHTN' },
]
type SortKey = 'ten' | 'ma' | 'lop' | 'buoi' | 'bu' | 'duoi' | 'ct' | 'tien'

// Toggle bar CT1/CT2 cho 1 HS×lớp — chọn rồi mới bấm "✓ Lưu" (không auto-lưu, Thùy 08-01).
// Lưu = đề xuất → xoá dòng chọn tay (về theo hệ); khác đề xuất → ghi hoc_phi_cong_thuc.
function CtToggle({ r, ky, onSaved }: { r: DongTheoMonV2; ky: string; onSaved: () => void }) {
  const cur: CongThuc = r.congThucChon ?? r.congThucDeXuat
  const [pending, setPending] = useState<CongThuc | null>(null)
  const [busy, setBusy] = useState(false)
  const chon = pending ?? cur
  const tay = r.congThucChon != null
  async function luu() {
    if (!pending || pending === cur || !r.lop_id) return
    setBusy(true)
    try { await setCongThucHocPhi(r.hoc_sinh_id, r.lop_id, ky, pending === r.congThucDeXuat ? null : pending); setPending(null); onSaved() }
    catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="inline-flex overflow-hidden rounded-md border border-slate-300">
        {(['ct1', 'ct2'] as CongThuc[]).map((v) => (
          <button key={v} disabled={busy} onClick={() => setPending(v === cur ? null : v)}
            title={v === 'ct1' ? 'CT1: số buổi LỚP × đơn giá × hệ số' : 'CT2: (đi học + bù) × đơn giá × hệ số'}
            className={`px-2.5 py-0.5 text-[12px] font-bold ${chon === v ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{v.toUpperCase()}</button>
        ))}
      </div>
      {pending && pending !== cur
        ? <button disabled={busy} onClick={luu} className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white disabled:opacity-40">{busy ? '…' : '✓ Lưu'}</button>
        : tay ? <span title={`Đang chọn TAY (hệ đề xuất ${r.congThucDeXuat.toUpperCase()}, nghỉ ${r.soBuoiNghi}/${r.soBuoiLop})`} className="text-[10px] font-semibold text-amber-600">tay</span> : null}
    </div>
  )
}
function TheoMonTab() {
  const ky = useStore((s) => s.hocPhiKy) || kyHienTai()
  const setKy = useStore((s) => s.setHocPhiKy)
  const [rows, setRows] = useState<DongTheoMonV2[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [mon, setMon] = useState<string>('Toán')
  const [ctFilter, setCtFilter] = useState<'all' | CongThuc>('all') // toggle lọc CT1/CT2 trên header (Thùy 07-13)
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'ten', dir: 1 })
  const [detail, setDetail] = useState<DongTheoMonV2 | null>(null)

  async function reload(silent = false) {
    if (!silent) setLoading(true)
    try { setRows(await listHocPhiTheoMonV2(ky)) } finally { if (!silent) setLoading(false) }
  }
  useEffect(() => { reload() }, [ky]) // eslint-disable-line

  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const ctCua = (r: DongTheoMonV2) => r.congThucChon ?? r.congThucDeXuat
  const theoMon = rows.filter((r) => r.mon === mon || (mon === 'Toán' && r.mon === 'Học đuổi')) // dòng chỉ-đuổi không môn: kẹp vào tab đầu
  const filtered = theoMon
    .filter((r) => ctFilter === 'all' || (r.soBuoiLop > 0 && ctCua(r) === ctFilter))
    .filter((r) => !q.trim() || norm(r.hoc_sinh_ten + ' ' + (r.ma_hs ?? '') + ' ' + r.lop_ten).includes(norm(q)))
  const SORT_VAL: Record<SortKey, (r: DongTheoMonV2) => string | number> = {
    ten: (r) => r.hoc_sinh_ten, ma: (r) => r.ma_hs ?? '', lop: (r) => r.lop_ten,
    buoi: (r) => r.soBuoiNghi, bu: (r) => r.soBuoiBu, duoi: (r) => r.soBuoiDuoi,
    ct: (r) => (r.soBuoiLop > 0 ? ctCua(r) : ''), tien: (r) => r.thanhTien,
  }
  const sorted = [...filtered].sort((a, b) => {
    const va = SORT_VAL[sort.key](a); const vb = SORT_VAL[sort.key](b)
    const c = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'vi')
    return c !== 0 ? c * sort.dir : a.hoc_sinh_ten.localeCompare(b.hoc_sinh_ten, 'vi')
  })
  const tongTien = sorted.reduce((s, r) => s + r.thanhTien, 0)
  const clickSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))
  // hàm render thường (KHÔNG phải component định nghĩa trong component — identity đổi mỗi render làm
  // React remount cả header, DOM không ổn định)
  const th = (k: SortKey, label: string, className = '') => (
    <th className={`cursor-pointer select-none px-2 py-2 hover:text-slate-600 ${className}`} onClick={() => clickSort(k)}>
      {label}{sort.key === k ? <span className="ml-0.5 text-indigo-500">{sort.dir === 1 ? '▲' : '▼'}</span> : null}
    </th>
  )

  return (
    <div className="mx-auto max-w-[1250px]">
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <KyPicker ky={ky} onChange={setKy} />
        {/* Toggle MÔN (Thùy 07-13: "lần lượt từng môn Toán - Văn - Anh - KHTN") */}
        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          {MON_TOGGLE.map((m) => (
            <button key={m.value} onClick={() => setMon(m.value)} className={`px-3.5 py-1.5 text-[13px] font-medium ${mon === m.value ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{m.label}</button>
          ))}
        </div>
        {/* Lọc theo CÔNG THỨC (Thùy 07-13: toggle bar CT1-CT2 trên header để lọc khi cần) */}
        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          {([['all', 'Tất cả'], ['ct1', 'CT1'], ['ct2', 'CT2']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setCtFilter(v)} className={`px-3 py-1.5 text-[13px] font-medium ${ctFilter === v ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>{l}</button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm học sinh / lớp…" className={`${inp} w-64`} />
        <span className="text-[12px] text-slate-400">{sorted.length} dòng · tổng {tienVN(tongTien)}</span>
      </div>
      {loading ? <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
        : !filtered.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Không có học sinh nào học {mon} trong kỳ.</div>
        : (
          <div className="rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[1150px] table-fixed text-[13px]">
              <colgroup>
                <col className="w-[170px]" /><col className="w-[85px]" /><col className="w-[90px]" />
                <col className="w-[120px]" /><col className="w-[70px]" /><col className="w-[70px]" />
                <col className="w-[210px]" /><col className="w-[125px]" /><col className="w-[80px]" />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  {th('ten', 'Học sinh', '!px-4')}{th('ma', 'Mã HS')}{th('lop', 'Lớp')}
                  {th('buoi', 'Buổi (lớp / nghỉ)')}{th('bu', 'Bù', 'text-center')}{th('duoi', 'Đuổi', 'text-center')}
                  {th('ct', 'Công thức')}{th('tien', 'Thành tiền', 'text-right')}<th className="px-2 py-2 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => {
                  const key = `${r.hoc_sinh_id}|${r.lop_id}`
                  return (
                    <tr key={key + r.mon} className="border-t border-slate-100">
                      <td className="truncate px-4 py-2 font-medium text-slate-800" title={r.hoc_sinh_ten}>{r.hoc_sinh_ten}</td>
                      <td className="px-2 py-2 font-mono text-[12px] text-slate-400">{r.ma_hs ?? '—'}</td>
                      <td className="px-2 py-2 text-slate-500">{r.lop_ten}</td>
                      <td className="px-2 py-2">
                        <span className="text-slate-700">Lớp <b>{r.soBuoiLop}</b></span>
                        {r.soBuoiNghi > 0 ? <span className="text-rose-600"> · nghỉ <b>{r.soBuoiNghi}</b></span> : <span className="text-slate-300"> · nghỉ 0</span>}
                      </td>
                      <td className="px-2 py-2 text-center">{r.soBuoiBu > 0 ? <span title={`Tổng ${r.soBuoiBu} buổi bù = ${r.soBuoiBuDaHoc} đã bù + ${r.soBuoiBuDaXep} đã xếp lịch`}><b className="text-sky-700">{r.soBuoiBu}</b>{r.soBuoiBuDaXep > 0 ? <span className="ml-0.5 text-[11px] font-semibold text-amber-600">({r.soBuoiBuDaHoc}+{r.soBuoiBuDaXep})</span> : null}</span> : <span className="text-slate-300">—</span>}</td>
                      <td className="px-2 py-2 text-center">{r.soBuoiDuoi > 0 ? <b className="text-orange-600">{r.soBuoiDuoi}</b> : <span className="text-slate-300">—</span>}</td>
                      <td className="px-2 py-2">
                        {/* Toggle bar CT1/CT2 — chọn xong bấm ✓ Lưu mới ghi (Thùy 08-01). vàng "tay" = đang chọn khác đề xuất. */}
                        {r.lop_id && r.soBuoiLop > 0
                          ? <CtToggle r={r} ky={ky} onSaved={() => reload(true)} />
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-2 py-2 text-right font-semibold text-slate-800">{tienVN(r.thanhTien)}</td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => setDetail(r)} className="rounded-md border border-slate-200 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700">Detail</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      {detail && <TheoMonDetailModal r={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}

const ddmmHP = (iso: string) => iso.split('-').reverse().slice(0, 2).join('/')
// Popup DETAIL 1 dòng HS×lớp (Thùy 07-13): đi học ngày nào, nghỉ ngày nào, bù ngày nào, đuổi ngày
// nào, tài liệu + phí — kèm breakdown tiền theo công thức đang áp.
function TheoMonDetailModal({ r, onClose }: { r: DongTheoMonV2; onClose: () => void }) {
  const ct = r.congThucChon ?? r.congThucDeXuat
  const soBuoiTinh = ct === 'ct2' ? r.soBuoiDiHoc + r.soBuoiBu : r.soBuoiLop
  const NgayChips = ({ ngays, mau }: { ngays: string[]; mau: string }) => (
    ngays.length === 0 ? <span className="text-[12px] text-slate-300">không có</span>
      : <div className="flex flex-wrap gap-1">{ngays.map((n, i) => <span key={n + i} className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${mau}`}>{ddmmHP(n)}</span>)}</div>
  )
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 text-[17px] font-semibold text-slate-800">{r.hoc_sinh_ten} · {r.lop_ten}</div>
        <div className="mb-4 text-[12px] text-slate-400">{r.ma_hs ?? ''}{r.mon ? ` · ${r.mon}` : ''}</div>
        <div className="space-y-3">
          <div><div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-slate-400">Đi học ({r.soBuoiDiHoc} buổi)</div><NgayChips ngays={r.ngayDiHoc} mau="bg-emerald-50 text-emerald-700" /></div>
          <div><div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-slate-400">Nghỉ ({r.soBuoiNghi} buổi)</div><NgayChips ngays={r.ngayNghi} mau="bg-rose-50 text-rose-700" /></div>
          <div><div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-slate-400">Bù ({r.soBuoiBu} buổi{r.soBuoiBuDaXep > 0 ? <span className="normal-case text-slate-500"> — {r.soBuoiBuDaHoc} đã bù, <span className="text-amber-600">{r.soBuoiBuDaXep} đã xếp lịch</span></span> : null})</div><NgayChips ngays={r.ngayBu} mau="bg-sky-50 text-sky-700" /><div className="mt-0.5 text-[11px] text-slate-400">Bù tính theo tháng buổi GỐC (bù tháng này có thể diễn ra tháng sau); buổi đã xếp lịch vẫn tính tiền.</div></div>
          <div><div className="mb-1 text-[12px] font-medium uppercase tracking-wide text-slate-400">Học đuổi ({r.soBuoiDuoi} buổi)</div><NgayChips ngays={r.ngayDuoi} mau="bg-orange-50 text-orange-700" /></div>
          <div className="rounded-xl bg-slate-50 p-3 text-[13px]">
            <div className="mb-1.5 text-[12px] font-medium uppercase tracking-wide text-slate-400">Thành tiền</div>
            <div className="space-y-1 text-slate-700">
              {r.tienHocChinh > 0 && (
                <div className="flex justify-between">
                  <span>Học chính — <b>{ct.toUpperCase()}</b>: {ct === 'ct2' ? `(đi ${r.soBuoiDiHoc} + bù ${r.soBuoiBu})` : `lớp ${r.soBuoiLop} buổi`} × {tienVN(r.donGia)}{r.heSo !== 1 ? ` × ${r.heSo}` : ''} <span className="text-slate-400">({soBuoiTinh} buổi)</span></span>
                  <b>{tienVN(r.tienHocChinh)}</b>
                </div>
              )}
              {r.tienDuoi > 0 && <div className="flex justify-between"><span>Bổ trợ đuổi: {r.soBuoiDuoi} buổi</span><b>{tienVN(r.tienDuoi)}</b></div>}
              {r.tienHocLieu > 0 && <div className="flex justify-between"><span>Tài liệu{r.hocLieuTen ? ` (${r.hocLieuTen})` : ''}</span><b>{tienVN(r.tienHocLieu)}</b></div>}
              <div className="flex justify-between border-t border-slate-200 pt-1 text-[14px]"><span className="font-semibold">Tổng</span><b>{tienVN(r.thanhTien)}</b></div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-right"><button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px] text-slate-600 hover:bg-slate-50">Đóng</button></div>
      </div>
    </div>
  )
}

// ── TAB ĐIỂM DANH (Thùy 07-13) — OPS view nhanh điểm danh cả lớp: trái = danh sách lớp (thanh cuộn
// riêng), phải = ma trận HS × ngày học trong kỳ, ô = có mặt/vắng/(chưa điểm danh).
function DiemDanhTab() {
  const ky = useStore((s) => s.hocPhiKy) || kyHienTai()
  const setKy = useStore((s) => s.setHocPhiKy)
  const [lops, setLops] = useState<Lop[]>([])
  const [lopId, setLopId] = useState<string | null>(null)
  const [data, setData] = useState<DiemDanhLop | null>(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    listLop().then((ls) => {
      const dang = ls.filter((l) => l.trang_thai === 'dang_hoc').sort((a, b) => a.ten_lop.localeCompare(b.ten_lop, 'vi'))
      setLops(dang)
      setLopId((cur) => cur ?? dang[0]?.id ?? null)
    })
  }, [])
  useEffect(() => {
    if (!lopId) return
    setLoading(true)
    getDiemDanhTheoLop(lopId, ky).then(setData).catch(() => setData(null)).finally(() => setLoading(false))
  }, [lopId, ky])
  const lop = lops.find((l) => l.id === lopId)

  return (
    <div className="flex h-full min-h-0 gap-4">
      {/* Cột trái: danh sách lớp — thanh cuộn RIÊNG (Thùy: "có bar kéo riêng khi ko hiển thị hết") */}
      <div className="flex w-52 flex-none flex-col rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-3 py-2 text-[12px] font-medium uppercase tracking-wide text-slate-400">Lớp ({lops.length})</div>
        <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {lops.map((l) => (
            <button key={l.id} onClick={() => setLopId(l.id)}
              className={`mb-0.5 block w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium ${lopId === l.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {l.ten_lop} <span className={`text-[11px] ${lopId === l.id ? 'text-indigo-200' : 'text-slate-400'}`}>· {l.mon}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Bên phải: ma trận điểm danh */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="mb-3 flex flex-none flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
          <span className="text-[15px] font-semibold text-slate-800">{lop ? `${lop.ten_lop} · ${lop.mon}` : 'Chọn lớp'}</span>
          <KyPicker ky={ky} onChange={setKy} />
          {data && <span className="text-[12px] text-slate-400">{data.hs.length} HS · {data.buois.length} buổi trong kỳ</span>}
          <span className="ml-auto flex items-center gap-2 text-[11px] text-slate-400"><span className="rounded bg-emerald-100 px-1.5 py-0.5 font-medium text-emerald-700">✓ có mặt</span><span className="rounded bg-rose-100 px-1.5 py-0.5 font-medium text-rose-700">✕ vắng</span><span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-400">— chưa điểm danh</span></span>
        </div>
        <div className="min-h-0 flex-1 overflow-auto rounded-xl border border-slate-200 bg-white">
          {loading ? <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
            : !data || !data.buois.length ? <p className="py-14 text-center text-sm text-slate-400">Lớp chưa có buổi học nào trong kỳ này.</p>
            : (
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="sticky left-0 z-20 bg-slate-50 px-4 py-2 text-left">Học sinh</th>
                    {data.buois.map((b) => <th key={b.id} className="whitespace-nowrap px-2 py-2 text-center font-medium">{ddmmHP(b.ngay)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.hs.map((h) => (
                    <tr key={h.hoc_sinh_id} className="border-t border-slate-100">
                      <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-1.5 font-medium text-slate-800">{h.ho_ten} {h.ma_hs && <span className="font-mono text-[10px] text-slate-400">{h.ma_hs}</span>}</td>
                      {data.buois.map((b) => {
                        const dd = h.dd[b.id]
                        return (
                          <td key={b.id} className="px-2 py-1.5 text-center">
                            {dd === 'co_mat' ? <span className="inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">✓</span>
                              : dd === 'vang' || dd === 'vang_phep' ? <span className="inline-block rounded bg-rose-100 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">✕</span>
                              : <span className="text-slate-200">—</span>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  )
}

// ── TAB HỌC PHÍ HỌC CHÍNH — tổng quan mọi PH trong kỳ → xuất ảnh/PDF + toggle trạng thái thông báo
// Nhóm trạng thái để LỌC (tab con) + màu card. Chưa chốt → Chưa báo → Đã báo → Đã thu.
type NhomTT = 'chua_chot' | 'chua_bao' | 'da_bao' | 'da_thu'
function nhomTT(r: DongSoHang): NhomTT {
  if (!r.daChot) return 'chua_chot'
  if (r.trangThai === 'da_thu' || r.trangThai === 'mien') return 'da_thu'
  if (r.baoLan1At) return 'da_bao'
  return 'chua_bao'
}
const NHOM: { key: 'all' | NhomTT; label: string }[] = [
  { key: 'all', label: 'Tất cả' }, { key: 'chua_chot', label: 'Chưa chốt' }, { key: 'chua_bao', label: 'Chưa báo' }, { key: 'da_bao', label: 'Đã báo' }, { key: 'da_thu', label: 'Đã thu' },
]
const NHOM_MAU: Record<NhomTT, { vien: string; pill: string }> = {
  chua_chot: { vien: 'border-l-slate-300', pill: 'bg-slate-100 text-slate-600' },
  chua_bao: { vien: 'border-l-rose-400', pill: 'bg-rose-50 text-rose-700' },
  da_bao: { vien: 'border-l-amber-400', pill: 'bg-amber-50 text-amber-700' },
  da_thu: { vien: 'border-l-emerald-400', pill: 'bg-emerald-50 text-emerald-700' },
}

// 1 CARD phụ huynh — hiện ĐỦ cơ cấu tiền + tổng, thu gọn được. Chốt/báo/thu OPTIMISTIC (cập nhật đúng
// card, KHÔNG refresh cả màn). Chốt = checkbox; trạng thái = toggle bar 3 nấc (Chưa báo/Đã báo/Đã thu).
function PhuHuynhCard({ r0, ky, onAnh, moMacDinh, onDoi }: { r0: DongSoHang; ky: string; onAnh: (r: DongSoHang) => void; moMacDinh: boolean; onDoi: (r: DongSoHang) => void }) {
  const [r, setRSt] = useState(r0)
  const [open, setOpen] = useState(moMacDinh)
  const [busy, setBusy] = useState(false)
  const [showThu, setShowThu] = useState(false)
  const [thuSo, setThuSo] = useState('')
  const [copied, setCopied] = useState(false)
  useEffect(() => { setRSt(r0) }, [r0])
  useEffect(() => { setOpen(moMacDinh) }, [moMacDinh])
  const setR = (nw: DongSoHang) => { setRSt(nw); onDoi(nw) }
  const nhom = nhomTT(r)
  const tong = r.tongTien ?? 0
  const conLai = Math.max(0, tong - r.daThuKy)

  async function toggleChot() {
    setBusy(true)
    try {
      if (!r.daChot) {
        if (!confirm(`Chốt học phí kỳ này cho ${r.ho_ten} = ${tienVN(tong)}?\nĐông cứng số này để thu tiền (sửa được sau bằng bỏ tích Chốt).`)) return
        const { hoaDonId, tongTien } = await chotKy(r.phu_huynh_id, ky, [])
        setR({ ...r, daChot: true, hoaDonId, tongTien, trangThai: 'chua_thu', baoLan1At: null, daThuKy: 0 })
      } else {
        const cb = r.daThuKy > 0 ? `\n⚠ Đã thu ${tienVN(r.daThuKy)} — huỷ sẽ xoá bản ghi thu.` : ''
        if (!confirm(`Huỷ chốt phiếu này để sửa lại?${cb}`)) return
        await huyChot(r.hoaDonId!)
        setR({ ...r, daChot: false, hoaDonId: null, trangThai: null, baoLan1At: null, daThuKy: 0, tongTien: r.tienChinh + r.tienDuoi + r.tienNo })
      }
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function bao() {
    setBusy(true)
    try {
      const tenCon = await layTenConDangHoc(r.phu_huynh_id)
      const nd = soanThongBao(r.baoLan1At ? 'cho_xu_ly' : 'thong_bao_1', tenCon, ky, tong)
      try { await navigator.clipboard.writeText(nd) } catch { /* clipboard bị chặn */ }
      if (!r.baoLan1At) { await danhDauDaBao(r.hoaDonId!); setR({ ...r, baoLan1At: new Date().toISOString() }) }
      setCopied(true); setTimeout(() => setCopied(false), 1500)
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function ghiThu() {
    const so = Number(thuSo.replace(/[.,]/g, '')); if (!so || so <= 0) { alert('Số tiền không hợp lệ.'); return }
    setBusy(true)
    try {
      await ghiThanhToan(r.hoaDonId!, so)
      const daThuMoi = r.daThuKy + so
      setR({ ...r, daThuKy: daThuMoi, trangThai: daThuMoi >= tong ? 'da_thu' : 'thu_mot_phan' })
      setShowThu(false); setThuSo('')
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  const Seg = ({ k, label, onClick }: { k: NhomTT; label: string; onClick: () => void }) => (
    <button disabled={busy} onClick={onClick} className={`px-2.5 py-1 text-[11px] font-semibold ${nhom === k ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'} disabled:opacity-40`}>{label}</button>
  )

  return (
    <div className={`rounded-xl border border-l-4 border-slate-200 bg-white ${NHOM_MAU[nhom].vien}`}>
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <label className="flex cursor-pointer items-center gap-1.5" title={r.daChot ? 'Đang chốt — bỏ tích để huỷ chốt/sửa lại' : 'Tích để chốt kỳ'}>
          <input type="checkbox" checked={r.daChot} disabled={busy} onChange={toggleChot} className="h-4 w-4 accent-indigo-600" />
          <span className="text-[11px] font-medium text-slate-500">Chốt</span>
        </label>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold text-slate-800">{r.ho_ten} <span className="font-mono text-[10px] font-normal text-slate-400">{r.ma_ph}</span></div>
          {r.tenCon.length > 0 && <div className="truncate text-[11px] text-slate-500">{r.tenCon.join(', ')}</div>}
        </div>
        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${NHOM_MAU[nhom].pill}`}>{NHOM.find((n) => n.key === nhom)?.label}</span>
        <span className="whitespace-nowrap text-[15px] font-extrabold text-indigo-700">{tienVN(tong)}</span>
        <button onClick={() => setOpen((o) => !o)} className="rounded-md border border-slate-200 px-1.5 py-1 text-[11px] text-slate-500 hover:border-indigo-300">{open ? '▴' : '▾'}</button>
      </div>
      {open && (
        <div className="border-t border-slate-100 px-3.5 py-2.5">
          <div className="mb-2 space-y-1 text-[12px]">
            {/* CHI TIẾT từng dòng như phiếu gửi PH — kiểm tra đầy đủ thành phần */}
            {r.dong.length === 0 && <div className="text-slate-400">Không có khoản nào trong kỳ.</div>}
            {r.dong.map((d, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="min-w-0 text-slate-500">
                  <b className="text-slate-700">{LOAI_LABEL[d.loai] ?? d.loai}</b>
                  {d.hoc_sinh_ten ? ` · ${d.hoc_sinh_ten}` : ''}{d.lop_ten ? ` · ${d.lop_ten}` : ''}
                  {d.loai === 'hoc_phi' ? ` · ${d.so_luong} buổi × ${tienVN(d.don_gia ?? 0)}${d.he_so && d.he_so !== 1 ? ` × ${d.he_so}` : ''}` : ''}
                  {d.mo_ta ? <span className="text-slate-400"> ({d.mo_ta})</span> : ''}
                </span>
                <span className={`whitespace-nowrap font-medium ${d.loai === 'no_ky_truoc' ? 'text-rose-600' : 'text-slate-700'}`}>{tienVN(d.thanh_tien)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200 pt-1"><span className="font-bold text-slate-800">TỔNG{!r.daChot ? ' (tạm tính)' : ''}</span><span className="font-extrabold text-indigo-700">{tienVN(tong)}</span></div>
            {r.daChot && r.daThuKy > 0 && <div className="flex justify-between text-[11px]"><span className="text-slate-400">Đã thu {tienVN(r.daThuKy)} · còn lại</span><span className="font-semibold text-rose-600">{tienVN(conLai)}</span></div>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {r.daChot ? (
              <div className="inline-flex overflow-hidden rounded-md border border-slate-300">
                <Seg k="chua_bao" label="Chưa báo" onClick={() => {}} />
                <Seg k="da_bao" label={copied ? '✓ Copy' : 'Đã báo'} onClick={bao} />
                <Seg k="da_thu" label="Đã thu" onClick={() => { setShowThu(true); setThuSo(String(conLai)) }} />
              </div>
            ) : <span className="text-[11px] text-slate-400">Tích &quot;Chốt&quot; để bắt đầu thu tiền</span>}
            <button onClick={() => onAnh(r)} className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-indigo-300">📷 Ảnh QR</button>
          </div>
          {showThu && r.daChot && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-emerald-50 p-2">
              <span className="text-[11px] font-medium text-slate-600">Số tiền thu (mặc định = số thông báo):</span>
              <input value={thuSo} onChange={(e) => setThuSo(e.target.value)} className={`${inp} w-32`} />
              <button disabled={busy} onClick={ghiThu} className="rounded-md bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-40">Ghi đã thu</button>
              <button onClick={() => setShowThu(false)} className="text-[11px] text-slate-400 hover:text-slate-600">Huỷ</button>
              <span className="text-[10px] text-slate-400">Thu ít hơn tổng → phần thiếu tự thành nợ.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DanhSachTab() {
  const ky = useStore((s) => s.hocPhiKy) || kyHienTai()
  const setKy = useStore((s) => s.setHocPhiKy)
  const [rows, setRows] = useState<DongSoHang[]>([])
  const [loading, setLoading] = useState(true)
  const [anh, setAnh] = useState<{ id: string; ten: string; ma: string } | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<'all' | NhomTT>('all')
  const [moAll, setMoAll] = useState(true)

  async function reload() { setLoading(true); try { setRows(await listPhieuTheoKy(ky)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [ky]) // eslint-disable-line
  const onDoi = (nw: DongSoHang) => setRows((rs) => rs.map((x) => (x.phu_huynh_id === nw.phu_huynh_id ? nw : x))) // cập nhật 1 card, KHÔNG reload cả list

  const boDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase()
  const timKhop = (r: DongSoHang) => { if (!q.trim()) return true; const nq = boDau(q); return boDau(r.ho_ten).includes(nq) || r.ma_ph.toLowerCase().includes(nq) || r.tenCon.some((c) => boDau(c).includes(nq)) }
  const filtered = rows.filter((r) => timKhop(r) && (filter === 'all' || nhomTT(r) === filter))
  const dem = (k: 'all' | NhomTT) => rows.filter((r) => timKhop(r) && (k === 'all' || nhomTT(r) === k)).length

  return (
    <div className="mx-auto max-w-[1150px]">
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <KyPicker ky={ky} onChange={setKy} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm phụ huynh / tên học sinh / mã…" className={`${inp} w-64`} />
        <button onClick={() => setMoAll((m) => !m)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:border-indigo-300">{moAll ? '⊟ Thu gọn tất cả' : '⊞ Mở tất cả'}</button>
        <span className="ml-auto text-[12px] text-slate-400">{filtered.length}/{rows.length} PH</span>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {NHOM.map((n) => (
          <button key={n.key} onClick={() => setFilter(n.key)} className={`rounded-lg px-3 py-1.5 text-[12px] font-medium ${filter === n.key ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}`}>{n.label} <span className={filter === n.key ? 'opacity-80' : 'text-slate-400'}>{dem(n.key)}</span></button>
        ))}
      </div>
      {loading ? <p className="py-8 text-center text-sm text-slate-400">Đang tải…</p>
        : !rows.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Chưa có phụ huynh nào có con đang học.</div>
        : !filtered.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Không có phụ huynh khớp bộ lọc.</div>
        : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {filtered.map((r) => <PhuHuynhCard key={r.phu_huynh_id} r0={r} ky={ky} moMacDinh={moAll} onAnh={(x) => setAnh({ id: x.phu_huynh_id, ten: x.ho_ten, ma: x.ma_ph })} onDoi={onDoi} />)}
          </div>
        )}
      {anh && <AnhGuiPHModal phuHuynhId={anh.id} phTen={anh.ten} maPh={anh.ma} ky={ky} onClose={() => setAnh(null)} />}
    </div>
  )
}


// ── TAB HỌC PHÍ NỢ — 2 phần: nợ KHỞI TẠO (điền tay, nợ cũ trước khi có hệ thống) + nợ HỆ THỐNG
// (Σ hoá đơn chốt − đã thu). Tổng = cả 2. Nợ khởi tạo tự cộng vào "nợ kỳ trước" trên phiếu (Thùy 08-01).
function NoRow({ r, onSave }: { r: DongNo; onSave: (phId: string, so: number) => Promise<void> }) {
  const [val, setVal] = useState(String(r.noKhoiTao))
  const [busy, setBusy] = useState(false)
  useEffect(() => { setVal(String(r.noKhoiTao)) }, [r.noKhoiTao])
  async function save() {
    const so = Number(val.replace(/[.,]/g, ''))
    if (isNaN(so) || so === r.noKhoiTao) return
    setBusy(true); try { await onSave(r.phu_huynh_id, so) } finally { setBusy(false) }
  }
  return (
    <tr className="border-t border-slate-100">
      <td className="px-4 py-2 font-medium text-slate-800">{r.ho_ten} <span className="font-mono text-[11px] text-slate-400">{r.ma_ph}</span></td>
      <td className="px-2 py-2 text-right"><input value={val} onChange={(e) => setVal(e.target.value)} onBlur={save} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} disabled={busy} title="Nợ khởi tạo — sửa rồi Enter/rời ô để lưu" className={`${inp} w-28 text-right`} /></td>
      <td className="px-2 py-2 text-right text-slate-600">{tienVN(r.noHeThong)}</td>
      <td className="px-4 py-2 text-right font-bold text-rose-600">{tienVN(r.no)}</td>
    </tr>
  )
}
function NoTab() {
  const [rows, setRows] = useState<DongNo[]>([])
  const [loading, setLoading] = useState(true)
  const [phs, setPhs] = useState<PHOpt[]>([])
  const [addPh, setAddPh] = useState<string | null>(null)
  const [addSo, setAddSo] = useState('')
  const [busy, setBusy] = useState(false)
  async function reload() { setLoading(true); try { setRows(await listNoPhaiThu()) } finally { setLoading(false) } }
  useEffect(() => { reload(); listPhuHuynhCoConDangHoc().then(setPhs) }, [])
  async function saveKhoiTao(phId: string, so: number) { await setNoKhoiTao(phId, so); await reload() }
  async function them() {
    if (!addPh || !addSo.trim()) return
    const so = Number(addSo.replace(/[.,]/g, '')); if (isNaN(so) || so < 0) return
    setBusy(true); try { await setNoKhoiTao(addPh, so); setAddPh(null); setAddSo(''); await reload() } finally { setBusy(false) }
  }
  const tongNo = rows.reduce((s, r) => s + r.no, 0)
  const tongKhoiTao = rows.reduce((s, r) => s + r.noKhoiTao, 0)
  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-3 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-2.5 text-sm font-semibold text-slate-900">Học phí nợ <span className="ml-2 text-[12px] font-normal text-slate-400">{rows.length} PH · nợ khởi tạo {tienVN(tongKhoiTao)} · tổng nợ <b className="text-rose-600">{tienVN(tongNo)}</b></span></div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-2.5">
          <span className="text-[12px] font-medium text-slate-500">Nhập nợ khởi tạo (nợ cũ):</span>
          <div className="w-64"><SearchSelect value={addPh} onChange={setAddPh} placeholder="Chọn phụ huynh…" options={phs.map((p) => ({ id: p.id, label: p.ho_ten, sub: `${p.ma_ph} · ${p.tenCon.join(', ')}` }))} /></div>
          <input value={addSo} onChange={(e) => setAddSo(e.target.value)} placeholder="Số tiền…" className={`${inp} w-32`} />
          <button disabled={busy || !addPh || !addSo.trim()} onClick={them} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-40">Lưu</button>
        </div>
      </div>
      {loading ? <p className="py-8 text-center text-sm text-slate-400">Đang tải…</p>
        : !rows.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Không có phụ huynh nào đang nợ. 🎉 (nhập nợ khởi tạo ở trên nếu có nợ cũ)</div>
        : (
          <div className="rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[13px]">
              <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <tr><th className="px-4 py-2">Phụ huynh</th><th className="text-right">Nợ khởi tạo</th><th className="text-right">Nợ học phí</th><th className="text-right px-4">Tổng nợ</th></tr>
              </thead>
              <tbody>{rows.map((r) => <NoRow key={r.phu_huynh_id} r={r} onSave={saveKhoiTao} />)}</tbody>
            </table>
          </div>
        )}
    </div>
  )
}

// ── TAB HỌC PHÍ BỔ TRỢ ĐUỔI — luồng billing RIÊNG với học chính (Thùy 07-05: không xét duyệt,
// không chốt kỳ riêng — chỉ để xem/đối chiếu PH nào có con học đuổi trong kỳ và tổng bao nhiêu).
function DuoiTab() {
  const ky = useStore((s) => s.hocPhiKy) || kyHienTai()
  const setKy = useStore((s) => s.setHocPhiKy)
  const [rows, setRows] = useState<DongDuoiSoHang[]>([])
  const [loading, setLoading] = useState(true)
  async function reload() { setLoading(true); try { setRows(await listDuoiTheoKy(ky)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [ky]) // eslint-disable-line
  const tongCong = rows.reduce((s, r) => s + r.tongTienDuoi, 0)

  return (
    <div className="mx-auto max-w-[700px]">
      <p className="mb-3 text-[12px] text-slate-400">Học phí bổ trợ đuổi ĐỘC LẬP với học phí học chính (không xét duyệt nghỉ ≥30%, giá theo mức của từng ca — xem tab "Đuổi" để gán). Vẫn cộng chung vào 1 hoá đơn khi chốt kỳ ở tab "Phiếu".</p>
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <KyPicker ky={ky} onChange={setKy} />
        <span className="text-[12px] text-slate-400">{rows.length} PH có con học đuổi · tổng {tienVN(tongCong)}</span>
      </div>
      {loading ? <p className="py-8 text-center text-sm text-slate-400">Đang tải…</p>
        : !rows.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Không có PH nào phát sinh học phí đuổi trong kỳ này.</div>
        : (
          <div className="rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <tr><th className="px-4 py-2">Phụ huynh</th><th className="text-right px-4">Tiền học đuổi</th></tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.phu_huynh_id} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-slate-800">{r.ho_ten} <span className="font-mono text-[11px] text-slate-400">{r.ma_ph}</span></td>
                    <td className="px-4 py-2 text-right font-semibold text-slate-800">{tienVN(r.tongTienDuoi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

// ── TAB HỆ SỐ — thông tin CỦA HỌC SINH (Thùy chốt 07-05). Bảng TO hiện MỌI HS đang học ở BK.
// Hệ thống GỢI Ý (học ≥2 môn -5% · có anh chị em cùng học chung môn -5%, gộp -10%) — Nhân sự XÁC NHẬN mới ghi.
// Sửa tay (học bổng, ngoại lệ…) khoá gợi ý cho tới khi bấm "Bỏ tay".
function HeSoTab() {
  const [rows, setRows] = useState<HocSinhHeSo[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [suaId, setSuaId] = useState<string | null>(null)
  const [suaVal, setSuaVal] = useState('')
  const [q, setQ] = useState('')

  async function reload() { setLoading(true); try { setRows(await listHeSoHocSinh()) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [])

  async function xacNhan(hocSinhId: string, heSo: number) {
    setBusyId(hocSinhId)
    try { await xacNhanHeSo(hocSinhId, heSo); await reload() } finally { setBusyId(null) }
  }
  async function luuTay(hocSinhId: string) {
    const v = Number(suaVal); if (!v || v <= 0) return
    setBusyId(hocSinhId)
    try { await setHeSoThuCong(hocSinhId, v); setSuaId(null); await reload() } finally { setBusyId(null) }
  }
  async function boTay(hocSinhId: string) {
    setBusyId(hocSinhId)
    try { await boManualHeSo(hocSinhId); await reload() } finally { setBusyId(null) }
  }

  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const filtered = q.trim() ? rows.filter((r) => norm(r.ho_ten + ' ' + (r.phu_huynh_ten ?? '')).includes(norm(q))) : rows
  const soLechGoiY = rows.filter((r) => r.he_so_nguon !== 'manual' && r.heSoGoiY !== r.he_so_hoc_phi).length

  return (
    <div className="mx-auto max-w-[1200px]">
      <p className="mb-3 text-[12px] text-slate-400">Hệ số là thông tin CỦA HỌC SINH. Hệ thống gợi ý: học ≥2 môn giảm 5% · có anh chị em cùng học chung ít nhất 1 môn giảm thêm 5% (gộp cả 2 = giảm 10%). Nhân sự bấm "Xác nhận" mới ghi vào phiếu; sửa tay (học bổng…) sẽ khoá gợi ý cho tới khi bấm "Bỏ tay".</p>
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm học sinh / phụ huynh…" className={`${inp} w-72`} />
        <span className="text-[12px] text-slate-400">{rows.length} học sinh đang học{soLechGoiY > 0 ? ` · ${soLechGoiY} lệch gợi ý` : ''}</span>
      </div>
      {loading ? <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>
        : !filtered.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Không có học sinh nào.</div>
        : (
          <div className="rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[1150px] table-fixed text-[13px]">
              <colgroup>
                <col className="w-[130px]" /><col className="w-[150px]" /><col className="w-[150px]" /><col className="w-[110px]" />
                <col className="w-[130px]" /><col className="w-[80px]" /><col className="w-[230px]" />
                <col className="w-[170px]" />
              </colgroup>
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <tr><th className="px-4 py-2">Học sinh</th><th className="px-2 py-2">Phụ huynh</th><th className="px-2 py-2">Lớp</th><th className="px-2 py-2">Môn đang học</th><th className="px-2 py-2">Hệ số hiện tại</th><th className="px-2 py-2">Gợi ý</th><th className="px-2 py-2">Lý do</th><th className="px-4 py-2 text-right">Thao tác</th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-2 font-medium text-slate-800">{r.ho_ten}</td>
                    <td className="px-2 py-2 text-slate-500">{r.phu_huynh_ten ?? '—'}</td>
                    <td className="px-2 py-2 text-slate-500">{r.lops.join(', ') || '—'}</td>
                    <td className="px-2 py-2 text-slate-500">{r.mons.join(', ') || '—'}</td>
                    <td className="px-2 py-2">
                      {suaId === r.id ? (
                        <div className="flex items-center gap-1.5">
                          <input value={suaVal} onChange={(e) => setSuaVal(e.target.value)} placeholder="VD 0.9" className={`${inp} w-20`} />
                          <button disabled={busyId === r.id} onClick={() => luuTay(r.id)} className="rounded-md bg-indigo-600 px-2 py-1 text-[12px] font-medium text-white disabled:opacity-40">Lưu</button>
                          <button onClick={() => setSuaId(null)} className="text-slate-400 hover:text-slate-600">Huỷ</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800">× {r.he_so_hoc_phi}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${r.he_so_nguon === 'manual' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{r.he_so_nguon === 'manual' ? 'Sửa tay' : 'Auto'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      {r.he_so_nguon !== 'manual' && r.heSoGoiY !== r.he_so_hoc_phi
                        ? <span className="font-semibold text-amber-700">× {r.heSoGoiY}</span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-2 py-2 text-[12px] text-slate-500">{r.lyDoGoiY || '—'}</td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {r.he_so_nguon !== 'manual' && r.heSoGoiY !== r.he_so_hoc_phi && (
                          <button disabled={busyId === r.id} onClick={() => xacNhan(r.id, r.heSoGoiY)} className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[12px] font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-40">✓ Xác nhận</button>
                        )}
                        {suaId !== r.id && <button onClick={() => { setSuaId(r.id); setSuaVal(String(r.he_so_hoc_phi)) }} className="rounded-md border border-slate-200 px-2 py-1 text-[12px] font-medium text-slate-600 hover:border-indigo-300">Sửa tay</button>}
                        {r.he_so_nguon === 'manual' && <button disabled={busyId === r.id} onClick={() => boTay(r.id)} className="text-[12px] font-medium text-slate-400 hover:text-rose-600">Bỏ tay</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

// ── TAB MỨC & LỚP — 3 bảng mức con con (học phí/đuổi/học liệu, ĐỘC LẬP nhau) TRONG 1 tab,
// + bảng gán mức cho từng lớp ngay bên dưới (Thùy: "3 cái mức để cùng 1 tab" + "bảng lớp cũng nhập ở đây luôn").
// Tên mức tự đặt theo giá (KHÔNG bắt gõ tay — "tên"/"giá" trùng nhau).
function MucTab() {
  const [mucPhi, setMucPhi] = useState<MucHocPhi[]>([])
  const [mucDuoi, setMucDuoi] = useState<MucHocDuoi[]>([])
  const [mucLieu, setMucLieu] = useState<MucHocLieu[]>([])
  async function reloadMuc() {
    const [a, b, c] = await Promise.all([listMucHocPhi(), listMucHocDuoi(), listMucHocLieu()])
    setMucPhi(a); setMucDuoi(b); setMucLieu(c)
  }
  useEffect(() => { reloadMuc() }, [])

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <MucSoBang title="Mức học phí" defaultValue="150000" suffix="/buổi"
          rows={mucPhi.map((m) => ({ id: m.id, ten: m.ten, gia: m.don_gia_buoi }))}
          onThem={async (v) => { await createMucHocPhi(v); await reloadMuc() }}
          onXoa={async (id) => { await deleteMucHocPhi(id); await reloadMuc() }} />
        <MucSoBang title="Mức học đuổi" defaultValue="150000" suffix="/buổi"
          rows={mucDuoi.map((m) => ({ id: m.id, ten: m.ten, gia: m.gia }))}
          onThem={async (v) => { await createMucHocDuoi(v); await reloadMuc() }}
          onXoa={async (id) => { await deleteMucHocDuoi(id); await reloadMuc() }} />
        <MucSoBang title="Mức học liệu" defaultValue="30000" suffix="/tháng"
          rows={mucLieu.map((m) => ({ id: m.id, ten: m.ten, gia: m.gia }))}
          onThem={async (v) => { await createMucHocLieu(v); await reloadMuc() }}
          onXoa={async (id) => { await deleteMucHocLieu(id); await reloadMuc() }} />
      </div>
      <LopMucBang mucPhi={mucPhi} mucLieu={mucLieu} />
    </div>
  )
}
function MucSoBang({ title, defaultValue, suffix, rows, onThem, onXoa }: {
  title: string; defaultValue: string; suffix: string; rows: { id: string; ten: string; gia: number }[]
  onThem: (gia: number) => Promise<void>; onXoa: (id: string) => Promise<void>
}) {
  // Đề xuất sẵn giá trị phổ biến nhất (Thùy: 150k học phí/đuổi · 30k học liệu) — người dùng vẫn tự sửa được.
  const [gia, setGia] = useState(defaultValue)
  const [busy, setBusy] = useState(false)
  async function them() {
    if (!gia) return
    setBusy(true)
    try { await onThem(Number(gia)); setGia(defaultValue) } finally { setBusy(false) }
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <h3 className="mb-2 text-[13px] font-semibold text-slate-800">{title}</h3>
      <div className="mb-2 flex items-center gap-1.5">
        <input value={gia} onChange={(e) => setGia(e.target.value)} className={`${inp} flex-1`} />
        <button disabled={busy || !gia} onClick={them} className="h-8 rounded-lg bg-indigo-600 px-2.5 text-[12px] font-medium text-white disabled:opacity-40">+ Thêm</button>
      </div>
      <div className="space-y-1">
        {rows.map((m) => (
          <div key={m.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[12px]">
            <span className="flex-1 font-medium text-slate-700">{tienVN(m.gia)}{suffix}</span>
            <button onClick={async () => { if (confirm(`Xoá "${m.ten}"? (lớp đang gán mức này sẽ mất mức)`)) await onXoa(m.id) }} className="text-slate-300 hover:text-rose-600">Xoá</button>
          </div>
        ))}
        {!rows.length && <p className="py-4 text-center text-[12px] text-slate-400">Chưa có mức nào.</p>}
      </div>
    </div>
  )
}
// Bảng gán mức cho TỪNG LỚP — bulk, thay cho việc phải mở từng lớp một ở màn "Lớp".
// Học phí + học liệu là thuộc tính CỦA LỚP. Học đuổi KHÔNG theo lớp — thay đổi theo CA Bổ trợ đuổi
// (gán ở màn "Bổ trợ · Đuổi chương trình", Thùy 07-05), nên KHÔNG có cột ở đây.
function LopMucBang({ mucPhi, mucLieu }: { mucPhi: MucHocPhi[]; mucLieu: MucHocLieu[] }) {
  const [rows, setRows] = useState<Lop[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  async function reload() { setLoading(true); try { setRows((await listLop()).filter((l) => l.trang_thai === 'dang_hoc')) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [])

  async function set(lopId: string, patch: Partial<Lop>) {
    setBusyId(lopId)
    try { await updateLop(lopId, patch); await reload() } finally { setBusyId(null) }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 text-[13px] font-semibold text-slate-800">Gán mức cho từng lớp</h3>
      {loading ? <p className="py-6 text-center text-[13px] text-slate-400">Đang tải…</p>
        : !rows.length ? <p className="py-6 text-center text-[13px] text-slate-400">Chưa có lớp đang học.</p>
        : (
          <div className="rounded-lg border border-slate-200">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 z-10 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <tr><th className="px-3 py-2">Lớp</th><th className="w-52">Mức học phí</th><th className="w-52">Mức học liệu</th></tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className={`border-t border-slate-100 ${busyId === l.id ? 'opacity-50' : ''}`}>
                    <td className="px-3 py-1.5 font-medium text-slate-800">{l.ten_lop} <span className="text-[11px] text-slate-400">· {l.mon}</span></td>
                    <td className="px-1 py-1">
                      <SearchSelect value={l.muc_hoc_phi_id ?? null} onChange={(id) => set(l.id, { muc_hoc_phi_id: id })} placeholder="Chưa gán…"
                        options={mucPhi.map((m) => ({ id: m.id, label: m.ten }))} />
                    </td>
                    <td className="px-1 py-1">
                      <SearchSelect value={l.muc_hoc_lieu_id ?? null} onChange={(id) => set(l.id, { muc_hoc_lieu_id: id })} placeholder="Chưa gán…"
                        options={mucLieu.map((m) => ({ id: m.id, label: m.ten }))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  )
}

// ── TAB PHÁT SINH — 1 chỗ nhập chi phí phát sinh, 2 loại: THEO LỚP (áp mọi HS đang học lớp đó)
// và CÁ NHÂN (áp riêng 1 HS) — Thùy 07-05. Tự cộng vào phiếu ảo + khi chốt, KHÔNG cần nhập lại per-PH.
function PhatSinhTab() {
  const ky = useStore((s) => s.hocPhiKy) || kyHienTai()
  const setKy = useStore((s) => s.setHocPhiKy)
  const [rows, setRows] = useState<PhatSinhEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loai, setLoai] = useState<'lop' | 'ca_nhan'>('lop')
  const [lops, setLops] = useState<Lop[]>([])
  const [hocSinhs, setHocSinhs] = useState<HocSinh[]>([])
  const [targetId, setTargetId] = useState<string | null>(null)
  const [moTa, setMoTa] = useState('')
  const [soTien, setSoTien] = useState('')
  const [busy, setBusy] = useState(false)

  async function reload() { setLoading(true); try { setRows(await listPhatSinhTheoKy(ky)) } finally { setLoading(false) } }
  useEffect(() => { reload() }, [ky]) // eslint-disable-line
  useEffect(() => { listLop().then((l) => setLops(l.filter((x) => x.trang_thai === 'dang_hoc'))); listHocSinh().then((h) => setHocSinhs(h.filter((x) => x.trang_thai === 'dang_hoc'))) }, [])

  async function them() {
    if (!targetId || !moTa.trim() || !soTien) return
    setBusy(true)
    try {
      if (loai === 'lop') await themPhatSinhLop(ky, targetId, moTa.trim(), Number(soTien))
      else await themPhatSinhCaNhan(ky, targetId, moTa.trim(), Number(soTien))
      setTargetId(null); setMoTa(''); setSoTien(''); await reload()
    } catch (e: any) { alert(e.message ?? String(e)) } finally { setBusy(false) }
  }
  async function xoa(id: string) {
    if (!confirm('Xoá khoản phát sinh này? (đã tính vào phiếu ảo/đã chốt sẽ mất theo)')) return
    try { await xoaPhatSinh(id); await reload() } catch (e: any) { alert(e.message ?? String(e)) }
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <p className="mb-3 text-[12px] text-slate-400">Chi phí phát sinh theo LỚP (áp mọi HS đang học lớp đó) hoặc CÁ NHÂN (áp riêng 1 HS) — nhập 1 lần ở đây, tự cộng vào phiếu ảo/đã chốt của kỳ, khỏi phải gõ tay từng PH.</p>
      <div className="mb-3 flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-4">
        <Field2 label="Kỳ"><KyPicker ky={ky} onChange={setKy} /></Field2>
        <Field2 label="Loại">
          <div className="flex overflow-hidden rounded-lg border border-slate-300">
            <button onClick={() => { setLoai('lop'); setTargetId(null) }} className={`px-3 py-1.5 text-[13px] font-medium ${loai === 'lop' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Theo lớp</button>
            <button onClick={() => { setLoai('ca_nhan'); setTargetId(null) }} className={`px-3 py-1.5 text-[13px] font-medium ${loai === 'ca_nhan' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600'}`}>Cá nhân</button>
          </div>
        </Field2>
        <div className="w-56">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{loai === 'lop' ? 'Lớp' : 'Học sinh'}</label>
          {loai === 'lop'
            ? <SearchSelect value={targetId} onChange={setTargetId} placeholder="Chọn lớp…" options={lops.map((l) => ({ id: l.id, label: l.ten_lop, sub: l.mon }))} />
            : <SearchSelect value={targetId} onChange={setTargetId} placeholder="Chọn học sinh…" options={hocSinhs.map((h) => ({ id: h.id, label: h.ho_ten, sub: h.ma_hs ?? undefined }))} />}
        </div>
        <Field2 label="Mô tả"><input value={moTa} onChange={(e) => setMoTa(e.target.value)} placeholder="vd: Phí dã ngoại" className={`${inp} w-44`} /></Field2>
        <Field2 label="Số tiền"><input value={soTien} onChange={(e) => setSoTien(e.target.value)} placeholder="200000" className={`${inp} w-32`} /></Field2>
        <button disabled={busy || !targetId || !moTa.trim() || !soTien} onClick={them} className="h-8 rounded-lg bg-indigo-600 px-3 text-[13px] font-medium text-white disabled:opacity-40">+ Thêm</button>
      </div>
      {loading ? <p className="py-8 text-center text-[13px] text-slate-400">Đang tải…</p>
        : !rows.length ? <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-400">Chưa có khoản phát sinh nào trong kỳ này.</div>
        : (
          <div className="space-y-1.5">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px]">
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${r.loai === 'lop' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'}`}>{r.loai === 'lop' ? 'Theo lớp' : 'Cá nhân'}</span>
                <span className="font-medium text-slate-800">{r.loai === 'lop' ? r.lop_ten : r.hoc_sinh_ten}</span>
                <span className="flex-1 text-slate-500">{r.mo_ta}</span>
                <span className="font-semibold text-slate-800">{tienVN(r.so_tien)}</span>
                <button onClick={() => xoa(r.id)} className="text-slate-300 hover:text-rose-600">Xoá</button>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
function Field2({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex-1"><label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</label>{children}</div>
}
