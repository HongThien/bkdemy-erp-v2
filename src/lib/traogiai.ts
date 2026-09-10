// TRAO GIẢI (thưởng tháng) — lớp client MỎNG theo §2.0 CLAUDE.md: MỌI tính toán (metric, xếp hạng,
// ghép slot, tổng hợp) nằm ở Postgres `fn_traogiai_*` (mig 202609091431). File này CHỈ gọi rpc, đặt
// kiểu, và format nhãn hiển thị (chip "MT 8.5", "ET 72%"…). KHÔNG cộng/chia/xếp hạng ở đây.
//
// 3 luật xếp hạng (CEO chốt 22/08, nguồn duy nhất = SQL trong migration, KHÔNG lặp ở đây):
//   · Xuất sắc: điểm MT ↓ → ET(%) tháng ↓ → BTVN(%) tháng ↓.   (MT = fn_rank_diem_mt_lop, thang 10)
//   · Tiến bộ : (CEO sửa 09/09) LÊN HẠNG MT so với tháng trước — Δ hạng trong LỚP + Δ hạng trong KHỐI, cả 2 cùng
//               tăng nhiều nhất ↓ (chỉ HS có điểm MT cả 2 tháng). Nguồn hạng = fn_rank_diem_mt_lop 2 tháng.
//   · Chăm chỉ: số buổi có BTVN đã chấm (đã giao + có mặt) ↓ → BTVN(%) TB ↓.
// Đề xuất tính SỐNG mỗi lần mở màn (không lưu draft) — trước khi tick "Xác nhận" KHÔNG có dòng
// `giai_thuong` nào (§1.5 anti-NULL). Actor (duyet_boi/hoan_thanh_boi) do DB tự lấy từ JWT.
import { supabase } from './supabase'
import { todayVN } from './nhansu'

// ── Loại giải. Slot MẶC ĐỊNH 3/2/1, tổng ngân sách 6/lớp/tháng (CEO chốt, không scale theo sĩ số); từ 09/09
//    người duyệt đặt lại được số slot từng loại cho đúng (lớp, tháng) khi nhiều em bằng điểm (bảng giai_thuong_slot,
//    không có dòng = mặc định). Số slot THẬT luôn do DB trả (`slotCauHinh`/`tongSlot`) — hằng ở đây chỉ để hiển thị. ──
export type LoaiGiai = 'xuat_sac' | 'tien_bo' | 'cham_chi'
export const SLOT_COUNT: Record<LoaiGiai, number> = { xuat_sac: 3, tien_bo: 2, cham_chi: 1 }
export const TONG_SLOT = SLOT_COUNT.xuat_sac + SLOT_COUNT.tien_bo + SLOT_COUNT.cham_chi // 6 = ngân sách tối đa
export type SlotCauHinh = { xuat_sac: number; tien_bo: number; cham_chi: number; tuyChinh: boolean }
export const LOAI_GIAI_THU_TU: LoaiGiai[] = ['xuat_sac', 'tien_bo', 'cham_chi']
export const LOAI_GIAI_TEN: Record<LoaiGiai, string> = { xuat_sac: 'Xuất sắc', tien_bo: 'Tiến bộ', cham_chi: 'Chăm chỉ' }

// ── Ngày tháng — CHUỖI THUẦN, không new Date()/toISOString cho ngày local (CLAUDE.md §2) ───────────
export const curYM = (): string => todayVN().slice(0, 7)
export const shiftYM = (ym: string, delta: number): string => {
  const [y, m] = ym.split('-').map(Number); const i = y * 12 + (m - 1) + delta
  return `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`
}

// ── Kiểu dữ liệu trả từ fn_traogiai_thang (đúng tên khoá JSON của hàm) ──────────────────────────
export type HsMetric = {
  mt: number | null; et: number | null; btvn: number | null
  // Tiến bộ: hạng MT tháng trước → tháng này (null = tháng đó chưa thi). tienBo = ΔLớp + ΔKhối (dương = lên hạng).
  rankLopTruoc: number | null; rankLopNay: number | null; rankKhoiTruoc: number | null; rankKhoiNay: number | null
  khoiTotal: number | null; tienBo: number | null
  btvnHoanThanh: number; btvnTong: number
}
export type RosterHS = { id: string; ho_ten: string; ma_hs: string | null }
export type TraoGiaiSlot = {
  slotIndex: number; hocSinhId: string; hoTen: string; maHs: string | null
  confirmed: boolean; giaiThuongId: string | null
  congBoAt: string | null // chỉ có nghĩa khi confirmed: NULL = chờ "Chốt kết quả tháng", NOT NULL = đã công bố ra app PH/HS
}
export type GiaiTrangThai = 'da_chot' | 'dang_xet' | 'cho'
export type TraoGiaiAward = { loaiGiai: LoaiGiai; slotCount: number; slots: TraoGiaiSlot[]; trangThai: GiaiTrangThai; chotAt: string | null }
export type TraoGiaiClass = {
  lopId: string; tenLop: string; mon: string; khoi: string | null
  siSo: number
  hoanThanhAt: string | null; hoanThanhBoi: string | null
  daXacNhan: number; daCongBo: number
  tongSlot: number; slotCauHinh: SlotCauHinh
  giaiDangXet: LoaiGiai | null // null = đã chốt cả 3 giải
  roster: RosterHS[]
  metricsCuaHs: Record<string, HsMetric>
  awards: TraoGiaiAward[]
}
export type TraoGiaiSummary = { soLop: number; tongSlot: number; daXacNhan: number; lopDuSlot: number; lopHoanThanh: number; daCongBo: number }
export type TraoGiaiThang = { ym: string; summary: TraoGiaiSummary; khoiOpts: string[]; lops: TraoGiaiClass[] }

export async function getTraoGiaiThang(ym: string, khoi?: string): Promise<TraoGiaiThang> {
  const { data, error } = await supabase.rpc('fn_traogiai_thang', { p_ym: ym, p_khoi: khoi || null })
  if (error) throw error
  return data as TraoGiaiThang
}

// ── Chip hiển thị — FORMAT thuần (được phép ở client), số đã tính sẵn ở DB ─────────────────────
export type MetricChip = { label: string; strong?: boolean; up?: boolean }
const pct = (v: number | null) => v == null ? null : `${Math.round(v * 100)}%`
const diem10 = (v: number) => Number(v).toFixed(2).replace(/\.?0+$/, '')
export function metricChips(loaiGiai: LoaiGiai, m: HsMetric | undefined): MetricChip[] {
  if (!m) return []
  if (loaiGiai === 'xuat_sac') {
    const out: MetricChip[] = []
    if (m.mt != null) out.push({ label: `MT ${diem10(m.mt)}`, strong: true })
    if (m.et != null) out.push({ label: `ET ${pct(m.et)}` })
    if (m.btvn != null) out.push({ label: `BTVN ${pct(m.btvn)}` })
    return out
  }
  if (loaiGiai === 'tien_bo') {
    if (m.tienBo == null) return []
    const sg = (d: number) => `${d >= 0 ? '+' : ''}${d}`
    const out: MetricChip[] = [{ label: `Lên ${sg(m.tienBo)} hạng`, up: true }]
    if (m.rankLopTruoc != null && m.rankLopNay != null) out.push({ label: `Lớp ${m.rankLopTruoc} → ${m.rankLopNay}` })
    if (m.rankKhoiTruoc != null && m.rankKhoiNay != null) out.push({ label: `Khối ${m.rankKhoiTruoc} → ${m.rankKhoiNay}${m.khoiTotal ? `/${m.khoiTotal}` : ''}` })
    return out
  }
  if (!m.btvnTong) return []
  const out: MetricChip[] = [{ label: `${m.btvnHoanThanh}/${m.btvnTong} buổi BTVN`, strong: true }]
  if (m.btvn != null) out.push({ label: `TB đúng ${pct(m.btvn)}` })
  return out
}

// ── GHI — 3 mức workflow (KHÔNG gộp): slot → lớp → tháng. Mọi kiểm tra (khoá lớp, trùng giải, đủ
//    slot, HS thuộc lớp, đã công bố) làm Ở DB trong cùng transaction — client chỉ hiện message. ──
function rpcErr(e: unknown): Error {
  const msg = String((e as { message?: string })?.message ?? e)
  if (/đã đủ/.test(msg) && /slot/i.test(msg)) return new Error('Lớp này vừa đủ slot cho giải này (có thể do người khác vừa xác nhận) — tải lại trang rồi thử lại.')
  return e instanceof Error ? e : new Error(msg)
}

export async function xacNhanSlot(p: { thangYm: string; lopId: string; hocSinhId: string; loaiGiai: LoaiGiai }): Promise<string> {
  const { data, error } = await supabase.rpc('fn_traogiai_xac_nhan', { p_ym: p.thangYm, p_lop: p.lopId, p_hs: p.hocSinhId, p_loai: p.loaiGiai })
  if (error) throw rpcErr(error)
  return data as string
}
export async function boXacNhanSlot(giaiThuongId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_traogiai_bo_xac_nhan', { p_id: giaiThuongId })
  if (error) throw rpcErr(error)
}
export async function doiNguoiSlotDaXacNhan(giaiThuongIdCu: string, hocSinhIdMoi: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_traogiai_doi_nguoi', { p_id: giaiThuongIdCu, p_hs_moi: hocSinhIdMoi })
  if (error) throw rpcErr(error)
  return data as string
}
// Đặt số slot từng loại cho (lớp, tháng) — DB kiểm: 0–6 mỗi loại, tổng 1–6, không giảm dưới số đã xác nhận, lớp chưa khoá.
export async function datSlotLop(lopId: string, thangYm: string, c: { xuat_sac: number; tien_bo: number; cham_chi: number }): Promise<void> {
  const { error } = await supabase.rpc('fn_traogiai_dat_slot', { p_ym: thangYm, p_lop: lopId, p_xuat_sac: c.xuat_sac, p_tien_bo: c.tien_bo, p_cham_chi: c.cham_chi })
  if (error) throw rpcErr(error)
}
export async function hoanThanhLop(lopId: string, thangYm: string): Promise<void> {
  const { error } = await supabase.rpc('fn_traogiai_hoan_thanh_lop', { p_ym: thangYm, p_lop: lopId })
  if (error) throw rpcErr(error)
}
export async function moLaiLop(lopId: string, thangYm: string): Promise<void> {
  const { error } = await supabase.rpc('fn_traogiai_mo_lai_lop', { p_ym: thangYm, p_lop: lopId })
  if (error) throw rpcErr(error)
}
// Chốt / mở lại từng giải của 1 lớp (workflow theo giai đoạn: Xuất sắc → Tiến bộ → Chăm chỉ). DB kiểm đúng lượt.
export async function chotGiaiLop(lopId: string, thangYm: string, loaiGiai: LoaiGiai): Promise<void> {
  const { error } = await supabase.rpc('fn_traogiai_chot_giai', { p_ym: thangYm, p_lop: lopId, p_loai: loaiGiai })
  if (error) throw rpcErr(error)
}
export async function moLaiGiaiLop(lopId: string, thangYm: string, loaiGiai: LoaiGiai): Promise<void> {
  const { error } = await supabase.rpc('fn_traogiai_mo_lai_giai', { p_ym: thangYm, p_lop: lopId, p_loai: loaiGiai })
  if (error) throw rpcErr(error)
}

// Chốt kết quả THÁNG (toàn trung tâm) — công bố MỌI giải chưa công bố của tháng. Trả số dòng.
export async function chotKetQuaThang(thangYm: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_traogiai_chot_thang', { p_ym: thangYm })
  if (error) throw rpcErr(error)
  return Number(data ?? 0)
}
