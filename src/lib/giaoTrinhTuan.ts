// GIÁO TRÌNH TUẦN (spec-giao-trinh-tuan.md · mig 202611161716/1722/1726/1727).
// Thứ Sáu trưởng khối điền cho TỪNG CA trong TKB tuần sau: ca đó học nhóm / dạng nào (chỉ khung); trưởng bộ môn duyệt.
// Khung lưu MỘT chỗ — dưới nút buổi trong builder; gtt_ca chỉ giữ liên kết 1-1 ca ⇄ buổi. Mọi kiểm / tính ở DB (fn_gtt_*).
import { supabase } from './supabase'
import type { ChonBuoi } from './tailieuBdm'

export type GttKhungMuc = { ma: string; loai: 'nhom' | 'dang'; ten: string | null; con: { ma: string; ten: string | null }[] }
export type GttBuoi = {
  id: string; tai_lieu_id: string; ten_gt: string; nhanh: string | null; luu_tru: boolean
  tieu_de: string | null; stt: number; khung: GttKhungMuc[]
}
export type GttCa = {
  lop_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; huy: boolean
  buoi: GttBuoi | null
  da_gan: { tai_lieu_id: string; khop: boolean } | null   // đã gán buổi cho lớp ngày dạy (bản chép) — khớp buổi đã lên kế hoạch không
  sua_sau_duyet: boolean
}
export type GttGiaoTrinh = { id: string; ten: string; nhanh: string | null }
export type GttLop = { id: string; ten_lop: string; giao_trinh: GttGiaoTrinh[]; ca: GttCa[] }
export type GttHanhDong = 'gui' | 'duyet' | 'tra_lai'
export type GttDong = { hanh_dong: GttHanhDong; at: string; ghi_chu: string | null; ho_ten: string | null }
export type GttMan = {
  mon: string; khoi: string; tuan: string; den: string
  sua: boolean; duyet: boolean
  trang_thai: GttDong | null; lich_su: GttDong[]
  lop: GttLop[]
  mo_coi: { lop_id: string; ngay: string; buoi_id: string }[]
}
export type GttO = { mon: string; khoi: string; vai: string }

/** Các ô (môn × khối) trong phạm vi của tôi — cùng nguồn phạm vi với mọi màn trưởng khối (spec-truong-khoi). */
export async function oCuaToi(): Promise<GttO[]> {
  const { data, error } = await supabase.rpc('fn_pham_vi_cua_toi').limit(500)
  if (error) throw error
  return (data ?? []) as GttO[]
}
/** MỘT lượt gọi cho cả lưới (môn × khối × tuần). */
export async function manTuan(mon: string, khoi: string, tuan: string): Promise<GttMan> {
  const { data, error } = await supabase.rpc('fn_gtt_man_tuan', { p_mon: mon, p_khoi: khoi, p_tuan: tuan })
  if (error) throw error
  return data as GttMan
}
/** Gắn ca với buổi có sẵn của giáo trình lớp (null = bỏ gắn). Trả ca để vá tại chỗ. */
export async function chonBuoi(lopId: string, ngay: string, buoiId: string | null): Promise<GttCa> {
  const { data, error } = await supabase.rpc('fn_gtt_chon_buoi', { p_lop: lopId, p_ngay: ngay, p_buoi: buoiId })
  if (error) throw error
  return data as GttCa
}
/** Đặt khung (nhóm / dạng bài) — ghi bằng đúng hàm builder. Ca chưa gắn buổi ⇒ truyền taiLieuId để tạo buổi mới cuối giáo trình. */
export async function datKhung(lopId: string, ngay: string, chon: ChonBuoi, taiLieuId?: string | null): Promise<GttCa> {
  const { data, error } = await supabase.rpc('fn_gtt_dat_khung', { p_lop: lopId, p_ngay: ngay, p_chon: chon, p_tai_lieu: taiLieuId ?? null })
  if (error) throw error
  return data as GttCa
}
/** Gửi duyệt · Duyệt · Trả lại. Trả cả màn tuần. */
export async function chuyen(mon: string, khoi: string, tuan: string, hanhDong: GttHanhDong, ghiChu?: string | null): Promise<GttMan> {
  const { data, error } = await supabase.rpc('fn_gtt_chuyen', { p_mon: mon, p_khoi: khoi, p_tuan: tuan, p_hanh_dong: hanhDong, p_ghi_chu: ghiChu ?? null })
  if (error) throw error
  return data as GttMan
}
/** Buổi nào của giáo trình đã gắn ca (lớp, ngày) — builder hiện nhãn ngày; khung chọn buổi biết buổi đã bận. */
export async function ngayBuoi(taiLieuId: string): Promise<{ buoi_id: string; lop_id: string; ngay: string }[]> {
  const { data, error } = await supabase.rpc('fn_gtt_ngay_buoi', { p_tai_lieu: taiLieuId }).limit(500)
  if (error) throw error
  return (data ?? []) as { buoi_id: string; lop_id: string; ngay: string }[]
}

// ── Ngày (giờ VN, không toISOString — CLAUDE.md §2) ──
const p2 = (n: number) => String(n).padStart(2, '0')
export const ymd = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`
export const tuDate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const congNgay = (s: string, n: number) => { const d = tuDate(s); d.setDate(d.getDate() + n); return ymd(d) }
/** Thứ Hai của TUẦN SAU (mặc định: thứ Sáu họp chốt tuần sau). */
export function thuHaiTuanSau(): string {
  const d = new Date(); d.setHours(0, 0, 0, 0)
  const dow = (d.getDay() + 6) % 7   // 0 = thứ Hai
  d.setDate(d.getDate() - dow + 7)
  return ymd(d)
}
export const THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
export const ddmm = (s: string) => { const [, m, d] = s.split('-'); return `${d}/${m}` }
export const gio = (t: string | null) => (t ? t.slice(0, 5) : '')
/** Khung (đọc từ DB) → dạng chọn của BoChonNhom (chỉ khuôn nhóm › dạng bài). */
export const khungThanhChon = (k: GttKhungMuc[]): ChonBuoi => k.filter((x) => x.loai === 'nhom').map((x) => ({ nhom: x.ma, dang_bai: x.con.map((c) => c.ma) }))
