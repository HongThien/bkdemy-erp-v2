// Báo cáo tuần trưởng khối (spec-bao-cao-tuan.md · mig 202611031351). Mọi số tính ở DB (fn_bctk_so / fn_bctk_trend);
// nộp = RPC tính + ghi SNAP trong cùng transaction. Client chỉ hiển thị + gửi phần chữ / phần cá nhân.
import { supabase } from './supabase'

export type NhomSo = {
  et: { so_viec: number; dung_han: number; ti_le_dung_han: number | null; so_luot: number; diem_tb: number | null }
  btvn: { can_nop: number; dung_han: number; muon: number; ti_le_nop: number | null; ti_le_dung_han: number | null; so_luot: number; diem_tb: number | null }
  dang_yeu: { dau: number | null; cuoi: number | null; giam: number | null; ti_le_giam: number | null }
  hs_yeu: { dau: number | null; cuoi: number | null; giam: number | null; ti_le_giam: number | null; si_so: number }
  // 17/11 (phien_ban 2): HS yếu = ≥ 1 NHÓM yếu + chỉ số Nhóm yếu. Bản snap cũ (phien_ban 1) không có khối này, HS yếu tính theo dạng.
  nhom_yeu?: { dau: number | null; cuoi: number | null; giam: number | null; ti_le_giam: number | null }
  // 17/11 (phien_ban 3): HAI CHIỀU tách riêng — A = yếu đầu tuần, B = yếu cuối tuần. Chiều 1: dau=|A| · con_yeu=|A∩B| · het_yeu=|A∖B| · roi (em thôi học).
  // Chiều 2: phat_sinh=|B∖A|. cuoi=|B|. null = thiếu ảnh đầu/cuối. Bản snap cũ không có khối này.
  hai_chieu?: { dang: HaiChieu; nhom: HaiChieu } | null
}
export type HaiChieu = { dau: number; con_yeu: number; het_yeu: number; roi: number; phat_sinh: number; cuoi: number; ti_le_het_yeu: number | null }
export type TongSo = NhomSo & {
  dong_chay: { vao: number; ra_bang_chung: number; ra_cua_so: number } | null
  do_phu: { so_hs: number; so_hs_co_do: number; ti_le: number | null }
  bo_tro: { ca_yeu: number; ca_nhe: number; luot_hs: number; hs_yeu_dau: number | null; hs_yeu_duoc_bt: number | null; do_phu: number | null; het_yeu_sau_ca: number | null }
}
export type LopSo = NhomSo & { lop_id: string; ten_lop: string; mon: string; khoi: string }
export type HsConYeu = { hoc_sinh_id: string; ho_ten: string; ten_lop: string; mon: string; so_dang_yeu: number; dang: string[]; so_nhom_yeu?: number; nhom?: string[]; xu_ly: 'bo_tro_yeu' | 'ca_nhe' | 'theo_doi' | 'chua' }
// 18/11: khối VẬN HÀNH (_bctk_van_hanh, mig 202611181253) — việc sau buổi của khối trong kỳ: đúng hạn / đóng muộn / chưa đóng. Bản snap cũ không có.
export type DemViec = { so_viec: number; dung_han: number; muon: number; chua: number; ti_le_dung_han: number | null }
export type VanHanh = {
  tong: DemViec | null
  khau: (DemViec & { tab: string })[]
  lop: (DemViec & { lop_id: string; ten_lop: string })[]
  nguoi: (DemViec & { nhan_su_id: string; ho_ten: string; vai: string })[]
  tre: { buoi_id: string; tab: string; ten_lop: string; ngay: string; han: string | null; dong: string | null; kq: 'muon' | 'chua'; nguoi: string | null }[]
}
export type SoBaoCao = {
  tu: string; den: string; co_anh_dau: boolean; co_anh_cuoi: boolean
  hs_yeu_theo?: 'nhom'   // không có = bản snap cũ: HS yếu đếm theo DẠNG
  tong: TongSo; lop: LopSo[]; hs_con_yeu: HsConYeu[]; trend: { tuan: string; tong: TongSo }[]
  van_hanh?: VanHanh
}
export type DongCaNhan = {
  task_id: string; tieu_de: string; han: string; so_lan_gia_han: number; trang_thai_task: string
  tu_dien: boolean; trang_thai: string; mo_ta: string; pct: number | null
}
export type TuViet = { nhan_dinh?: string; uu_tien?: string[]; can_ho_tro?: string }
export type BaoCaoTuan = {
  co_bao_cao: boolean; id: string | null; tuan: string; den: string; han: string; qua_han: boolean; ky_xong: boolean
  trang_thai: 'nhap' | 'da_nop' | 'tra_lai' | 'da_duyet'; o: { mon: string; khoi: string }[]
  so: SoBaoCao; ca_nhan: DongCaNhan[]; tu_viet: TuViet
  nop_at: string | null; tre: boolean | null; tra_lai_ly_do: string | null
}

export async function layBaoCaoTuan(tuan?: string): Promise<BaoCaoTuan> {
  const { data, error } = await supabase.rpc('fn_bctk_lay', tuan ? { p_tuan: tuan } : {})
  if (error) throw error
  return data as BaoCaoTuan
}
const phanCaNhan = (ds: DongCaNhan[]) => ds.filter((d) => !d.tu_dien).map((d) => ({ task_id: d.task_id, trang_thai: d.trang_thai, mo_ta: d.mo_ta, pct: d.pct }))
export async function luuNhapBaoCao(tuan: string, caNhan: DongCaNhan[], tuViet: TuViet): Promise<void> {
  const { error } = await supabase.rpc('fn_bctk_luu_nhap', { p_tuan: tuan, p_ca_nhan: phanCaNhan(caNhan), p_tu_viet: tuViet })
  if (error) throw error
}
// ── P3 — trưởng bộ môn (mig 202611031407) ──
export type DongHang = {
  nhan_su_id: string; ho_ten: string; la_toi: boolean; id: string | null
  trang_thai: 'chua_nop' | 'da_nop' | 'tra_lai' | 'da_duyet'; dang_soan: boolean | null
  o: { mon: string; khoi: string }[]; nop_at: string | null; tre: boolean | null; tong: TongSo | null
}
export type HangBaoCao = {
  tuan: string; den: string; han: string; qua_han: boolean; ky_xong: boolean; mon: string[]
  bao_cao: DongHang[]
  o_chua_co_tk: { mon: string; khoi: string; co_bao_cao: boolean }[]
  mon_bc: { mon: string; id: string | null; trang_thai: 'chua_co' | 'nhap' | 'da_chot'; chot_at: string | null }[]
}
export async function hangBaoCao(tuan?: string): Promise<HangBaoCao> {
  const { data, error } = await supabase.rpc('fn_bctk_hang', tuan ? { p_tuan: tuan } : {})
  if (error) throw error
  return data as HangBaoCao
}
export async function xemBaoCao(id: string): Promise<BaoCaoTuan & { ho_ten: string; la_toi: boolean }> {
  const { data, error } = await supabase.rpc('fn_bctk_xem', { p_id: id })
  if (error) throw error
  return data as BaoCaoTuan & { ho_ten: string; la_toi: boolean }
}
export async function xuLyBaoCao(id: string, duyet: boolean, lyDo?: string): Promise<{ id: string; trang_thai: 'da_duyet' | 'tra_lai' }> {
  const { data, error } = await supabase.rpc('fn_bctk_xu_ly', { p_id: id, p_duyet: duyet, p_ly_do: lyDo ?? null })
  if (error) throw error
  return data as { id: string; trang_thai: 'da_duyet' | 'tra_lai' }
}
export type KhoiGhep = { id: string; ho_ten: string; o: { mon: string; khoi: string }[]; trang_thai: string; tre: boolean | null; so: SoBaoCao; tu_viet: TuViet }
export type BaoCaoMon = {
  tuan: string; den: string; mon: string; id: string | null; trang_thai: 'nhap' | 'da_chot'; nhan_xet: string
  chot_at: string | null; chot_boi: string | null; ky_xong: boolean
  tong: SoBaoCao; cac_khoi: KhoiGhep[]; o_thieu: { mon: string; khoi: string }[]
}
export async function layBaoCaoMon(tuan: string, mon: string): Promise<BaoCaoMon> {
  const { data, error } = await supabase.rpc('fn_bcmt_lay', { p_tuan: tuan, p_mon: mon })
  if (error) throw error
  return data as BaoCaoMon
}
export async function luuBaoCaoMon(tuan: string, mon: string, nhanXet: string): Promise<void> {
  const { error } = await supabase.rpc('fn_bcmt_luu', { p_tuan: tuan, p_mon: mon, p_nhan_xet: nhanXet })
  if (error) throw error
}
export async function chotBaoCaoMon(tuan: string, mon: string, nhanXet: string): Promise<BaoCaoMon> {
  const { data, error } = await supabase.rpc('fn_bcmt_chot', { p_tuan: tuan, p_mon: mon, p_nhan_xet: nhanXet })
  if (error) throw error
  return data as BaoCaoMon
}

export async function nopBaoCao(tuan: string, caNhan: DongCaNhan[], tuViet: TuViet): Promise<BaoCaoTuan> {
  const { data, error } = await supabase.rpc('fn_bctk_nop', { p_tuan: tuan, p_ca_nhan: phanCaNhan(caNhan), p_tu_viet: tuViet })
  if (error) throw error
  return data as BaoCaoTuan
}
