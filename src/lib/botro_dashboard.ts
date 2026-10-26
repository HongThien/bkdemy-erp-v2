// DASHBOARD BỔ TRỢ theo TUẦN (Thùy 13/10): mỗi tuần "chốt" bao nhiêu ca yếu · bù · đuổi, thực tế đã chạy bao nhiêu.
// Đơn vị = 1 lượt học sinh trong 1 ca. Mọi phép đếm + phân loại trạng thái ở DB (fn_bo_tro_dashboard_tuan, mig 202610131134 — §2.0);
// file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'

export type LoaiBT = 'bo_tro_yeu' | 'bu' | 'bo_tro_duoi' | 'bo_tro_hinh'
// go = đã gỡ khỏi lịch (đổi lịch) — KHÔNG tính vào "chốt"
export type TtLuot = 'hoan_tat' | 'dang_do' | 'vang' | 'khong_dien_ra' | 'qua_han' | 'cho' | 'go'
export type SoLoai = { chot: number; da_chay: number; hoan_tat: number; dang_do: number; vang: number; khong_dien_ra: number; qua_han: number; cho: number; go: number }
export type LuotBT = {
  loai: LoaiBT; tt: TtLuot; buoi_id: string; ngay: string; gio_bat_dau: string | null
  ho_ten: string; ma_hs: string | null; lop: string | null; nguoi: string | null; ly_do: string | null
}
export type TuanBT = { tu: string; den: string; dang_chay: boolean; tuong_lai: boolean; tong: { chot: number; da_chay: number }; loai: Record<LoaiBT, SoLoai>; ds: LuotBT[] }

// p_den = một ngày bất kỳ thuộc tuần CUỐI muốn xem (null = tuần này); trả `soTuan` tuần, mới nhất trước.
export async function dashboardBoTroTuan(den?: string | null, soTuan = 3): Promise<TuanBT[]> {
  const { data, error } = await supabase.rpc('fn_bo_tro_dashboard_tuan', { p_den: den ?? null, p_so_tuan: soTuan })
  if (error) throw error
  return (data as TuanBT[]) ?? []
}

// ── KẾT QUẢ BỔ TRỢ YẾU THEO TUẦN (Thùy 26/10): từng ca × em đã đạt gì — dạng đã học, luyện/test, trạng thái dạng TRƯỚC ca → NAY.
// "Giảm dạng yếu" = dạng yếu trước ca → nay không còn yếu. Mọi phép tính ở DB (fn_botro_ket_qua_tuan, mig 202610261654 — §2.0).
export type MucDang = 'yeu' | 'can_luyen' | 'dat' | string | null
export type TienBo = 'giam' | 'van_yeu' | 'khac' | 'chua_do'
export type DangKetQua = {
  ma_dang: string; ten_dang: string; tien_bo: TienBo
  truoc_muc: MucDang; truoc_score: number | null; truoc_n: number | null; nay_muc: MucDang; nay_score: number | null; nay_n: number | null
  luyen_dung: number; luyen_tong: number; test_dung: number; test_tong: number
}
export type CaKetQua = {
  buoi_id: string; ngay: string; gio_bat_dau: string | null; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  nguoi_day: string | null; hoan_tat: boolean; mo_ngay: string; case_tt: string; case_kq: string | null; so_dang_case: number
  co_test: boolean; test_da_nop: boolean; theo_doi: { nguon: string; trang_thai: string; vao_at: string } | null; dang: DangKetQua[]
}
export type TomTatKetQua = {
  so_ca: number; so_ca_co_hoc: number; so_ca_huy: number; so_hs: number; so_hs_co_hoc: number
  so_dang_hoc: number; so_dang_yeu_truoc: number; so_dang_giam: number; so_dang_van_yeu: number; so_dang_khong_yeu_truoc: number; so_dang_chua_do_truoc: number
  so_dang_con_yeu_nay: number; so_hs_co_giam: number; so_hs_het_yeu_dang_hoc: number; so_hs_con_yeu: number
  luyen_dung: number; luyen_tong: number; test_dung: number; test_tong: number
}
export type KetQuaTuan = { tu: string; den: string; tom_tat: TomTatKetQua; ca: CaKetQua[] }
export async function ketQuaBoTroTuan(tu: string, den: string): Promise<KetQuaTuan> {
  const { data, error } = await supabase.rpc('fn_botro_ket_qua_tuan', { p_tu: tu, p_den: den })
  if (error) throw error
  return data as KetQuaTuan
}
