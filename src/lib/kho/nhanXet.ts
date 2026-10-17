// Nhận xét lúc duyệt — "✎ Cần sửa" (Thùy 17/10). Mọi tính trạng thái ở DB (mig 202610171123):
//   fn_kho_nhan_xet_trang_thai · fn_kho_nhan_xet_ghi · fn_kho_nhan_xet_dem. Claude sửa theo nhận xét: scripts/kho/nhan-xet.mjs.
import { supabase } from '../supabase'

export type DoiTuongNX = 'cau' | 'form_tn' | 'form_dien' | 'hinh_bai' | 'hinh_bien_the' | 'hinh_cach_giai' | 'clone' | 'de_thi'
export type MonNX = 'toan' | 'khtn' | 'hgt' | 'hinh_hoc' | 'anh' | 'tsa'
export type KhauNX = 'de' | 'dap_an' | 'loi_giai' | 'dang' | 'hinh' | 'trinh_bay' | 'khac'
export const KHAU_NX: { id: KhauNX; nhan: string }[] = [
  { id: 'de', nhan: 'Đề' }, { id: 'dap_an', nhan: 'Đáp án' }, { id: 'loi_giai', nhan: 'Lời giải' }, { id: 'dang', nhan: 'Dạng' },
  { id: 'hinh', nhan: 'Hình' }, { id: 'trinh_bay', nhan: 'Trình bày' }, { id: 'khac', nhan: 'Khác' },
]
export type NhanXet = {
  id: number; khau: KhauNX; noi_dung: string; man: string; nguoi_ten: string; at: string
  ket_qua: 'da_sua' | 'khong_sua' | null; ghi_chu: string | null; boi: 'claude' | 'nguoi' | null; xu_ly_at: string | null
}
export type TrangThaiNX = { doi_tuong: DoiTuongNX; mon: MonNX; ma: string; trang_thai: 'cho_sua' | 'da_sua' | 'khong_sua'; ds: NhanXet[] }

export const khoaNX = (mon: string, ma: string) => `${mon}|${ma}`
/** Tiền tố bảng kho (dai/hgt/khtn/anh/tsa/hinh_hoc — dùng ở Kho đề thi) → mã môn của nhận xét */
export const monTuKho = (kho: string): MonNX => (kho === 'dai' ? 'toan' : (kho as MonNX))

export async function nhanXetTrangThai(doiTuong: DoiTuongNX, mon?: MonNX): Promise<Map<string, TrangThaiNX>> {
  const { data, error } = await supabase.rpc('fn_kho_nhan_xet_trang_thai', { p_doi_tuong: doiTuong, p_mon: mon ?? null })
  if (error) throw error
  return new Map(((data ?? []) as TrangThaiNX[]).map((t) => [khoaNX(t.mon, t.ma), t]))
}

export async function ghiNhanXet(doiTuong: DoiTuongNX, mon: MonNX, ma: string, khau: KhauNX, noiDung: string, man: string): Promise<TrangThaiNX> {
  const { data, error } = await supabase.rpc('fn_kho_nhan_xet_ghi', { p_doi_tuong: doiTuong, p_mon: mon, p_ma: ma, p_khau: khau, p_noi_dung: noiDung, p_man: man })
  if (error) throw error
  return data as TrangThaiNX
}
