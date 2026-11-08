// BỔ TRỢ ÔN THI (Thùy 23/10): mỗi kỳ thi BK mở ca ôn cho TẤT CẢ học sinh trong 2 tuần. Ngoài hệ case (không mastery, không app HS, không test).
// Trang tạo ĐỢT → CA (ngày/giờ/phòng/TA) → thêm HS; TA điểm danh + báo động cuối giờ ở app TA; ERP thống kê đã đi / chờ đi / không đi được / chưa đi.
// Mọi số + trạng thái tính ở DB (fn_onthi_*, mig 202610231718 — CLAUDE.md §2.0); file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'

export type LoaiDot = 'giua_ky' | 'cuoi_ky'
export const LOAI_DOT_TEN: Record<LoaiDot, string> = { giua_ky: 'Giữa kỳ', cuoi_ky: 'Cuối kỳ' }
export const KHOI_CHON = ['3', '4', '4T', '5', '5T', '6', '7', '8', '9', '10', '11', '12']

export type DotOnThi = { id: string; ten: string; loai: LoaiDot; hoc_ky: 1 | 2; khoi: string[]; tu_ngay: string; den_ngay: string; ghi_chu: string | null; so_ca: number; so_hs_dang_ky: number }
export type HsTrongCa = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; diem_danh: 'co_mat' | 'vang' | 'vang_phep' | null; khong_dk: boolean; bao_dong: boolean }
export type CaOnThi = {
  buoi_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; trang_thai: 'mo' | 'hoan_tat' | 'huy'
  hoan_tat: boolean; ly_do_huy: string | null; ta_id: string | null; ta_ten: string | null; so_dk: number; so_co_mat: number; so_vang: number; hs: HsTrongCa[]
}
export type HsTim = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null; so_ca_da_dk: number; da_di: boolean }
export type KetQuaThemHs = { them: number; da_co: number; khong_thay: string[]; ngoai_khoi: string[] }
export type NhomOnThi = 'da_di' | 'cho_di' | 'khong_di_duoc' | 'chua_di'
export const NHOM_TEN: Record<NhomOnThi, string> = { da_di: 'Đã đi', cho_di: 'Đã lên lịch, chờ đi', khong_di_duoc: 'Lên lịch nhưng không đi được', chua_di: 'Chưa đi' }
export type ThongKeKhoi = { khoi: string; tong: number; da_di: number; cho_di: number; khong_di_duoc: number; chua_di: number }
export type ThongKeOnThi = ThongKeKhoi & { thieu_diem_danh: number; so_ca: number; so_luot_co_mat: number; ngoai_mau_so: number | null; theo_khoi: ThongKeKhoi[] }
export type HsNhom = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null; ca: string; thieu_diem_danh: boolean }
export type BaoDongOnThi = {
  id: string; buoi_id: string; ngay: string; gio_bat_dau: string | null; phong: string | null; dot_id: string; dot_ten: string
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  noi_dung: string; ta_ten: string | null; tao_luc: string; trang_thai: 'moi' | 'da_xu_ly'; xu_ly_ghi_chu: string | null; xu_ly_ten: string | null; xu_ly_at: string | null
}
// Phía TA
export type HsViecTA = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; diem_danh: 'co_mat' | 'vang' | 'vang_phep' | null; khong_dk: boolean; bao_dong: string | null }
export type ViecCaOnThi = { buoi_id: string; dot_id: string; dot_ten: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; hoan_tat: boolean; hs: HsViecTA[] }

async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

// ── ERP: đợt
export const dsDot = () => rpc<DotOnThi[]>('fn_onthi_dot_ds')
export const luuDot = (p: { id?: string | null; ten: string; loai: LoaiDot; hoc_ky: number; khoi: string[]; tu: string; den: string; ghi_chu?: string | null }) =>
  rpc<string>('fn_onthi_dot_luu', { p_id: p.id ?? null, p_ten: p.ten, p_loai: p.loai, p_hoc_ky: p.hoc_ky, p_khoi: p.khoi, p_tu: p.tu, p_den: p.den, p_ghi_chu: p.ghi_chu ?? null })
// ── ERP: ca + học sinh
export const dsCa = (dot: string) => rpc<CaOnThi[]>('fn_onthi_ca_ds', { p_dot: dot })
export const luuCa = (p: { id?: string | null; dot: string; ngay: string; bat_dau: string; ket_thuc: string; phong: string | null; ta: string | null }) =>
  rpc<string>('fn_onthi_ca_luu', { p_id: p.id ?? null, p_dot: p.dot, p_ngay: p.ngay, p_bat_dau: p.bat_dau, p_ket_thuc: p.ket_thuc, p_phong: p.phong, p_ta: p.ta })
export const huyCa = (buoi: string, lyDo?: string | null) => rpc<void>('fn_onthi_ca_huy', { p_buoi: buoi, p_ly_do: lyDo ?? null })
export const timHs = (dot: string | null, q: string, moiKhoi = false) => rpc<HsTim[]>('fn_onthi_hs_tim', { p_dot: dot, p_q: q, p_limit: 30, p_moi_khoi: moiKhoi })
export const themHs = (buoi: string, hs: string[], ma: string[] | null) => rpc<KetQuaThemHs>('fn_onthi_them_hs', { p_buoi: buoi, p_hs: hs, p_ma: ma })
export const goHs = (buoi: string, hs: string) => rpc<void>('fn_onthi_go_hs', { p_buoi: buoi, p_hs: hs })
export const doiCaHs = (hs: string, tu: string, den: string) => rpc<void>('fn_onthi_doi_ca', { p_hs: hs, p_tu_buoi: tu, p_den_buoi: den })
// ── ERP: thống kê + báo động
export const thongKe = (dot: string, khoi: string | null) => rpc<ThongKeOnThi>('fn_onthi_thong_ke', { p_dot: dot, p_khoi: khoi })
export const dsNhom = (dot: string, khoi: string | null, nhom: NhomOnThi) => rpc<HsNhom[]>('fn_onthi_thong_ke_ds', { p_dot: dot, p_khoi: khoi, p_nhom: nhom })
export const dsBaoDong = (dot: string | null, trangThai: 'moi' | 'da_xu_ly' | null) => rpc<BaoDongOnThi[]>('fn_onthi_bao_dong_ds', { p_dot: dot, p_trang_thai: trangThai })
export const xuLyBaoDong = (id: string, daXuLy: boolean, ghiChu?: string | null) => rpc<void>('fn_onthi_bao_dong_xu_ly', { p_id: id, p_da_xu_ly: daXuLy, p_ghi_chu: ghiChu ?? null })
// ── App TA
export const viecOnThiCuaToi = async (): Promise<ViecCaOnThi[]> => (await rpc<{ ca: ViecCaOnThi[] }>('fn_onthi_viec_cua_toi')).ca ?? []
export const diemDanhOnThi = (buoi: string, hs: string, tt: 'co_mat' | 'vang' | null) => rpc<void>('fn_onthi_diem_danh', { p_buoi: buoi, p_hs: hs, p_tt: tt })
export const themTaiCho = (buoi: string, hs: string) => rpc<void>('fn_onthi_them_tai_cho', { p_buoi: buoi, p_hs: hs })
export const baoDongOnThi = (buoi: string, hs: string, noiDung: string) => rpc<void>('fn_onthi_bao_dong_luu', { p_buoi: buoi, p_hs: hs, p_noi_dung: noiDung })
export const hoanTatCaOnThi = (buoi: string) => rpc<{ da_xong: boolean }>('fn_onthi_ca_hoan_tat', { p_buoi: buoi })
