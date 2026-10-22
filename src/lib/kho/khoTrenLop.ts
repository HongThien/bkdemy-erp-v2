// KHO TRÊN LỚP — Đại (Thùy 22/10, mig 202610221458): kho phục vụ GIẢNG DẠY, tách khỏi kho LUYỆN TẬP (dai_cau_hoi).
// Mỗi câu gắn 1 dạng bài bản đồ mới, có VAI (giảng · luyện trên lớp) + thứ tự trong dạng (chuỗi gợi ý để dạy).
// Kho = tầng đảm bảo; chọn câu cho lớp nào là việc của giáo trình (GV chọn nguồn từ CẢ 2 kho). Không đo, không vào mastery.
// Thêm / chép / xếp qua RPC (thứ tự tính ở DB); sửa nội dung + bỏ (kho rác xoa_at) = CRUD dòng đơn.
import { supabase } from '../supabase'

export type VaiLop = 'giang' | 'luyen'
export const NHAN_VAI: Record<VaiLop, string> = { giang: 'Bài giảng', luyen: 'Luyện trên lớp' }
export type CauLop = {
  ma_cau: string; mon: string; dang_bai_id: string; vai: VaiLop; thu_tu: number
  loai_cau: 'tu_luan' | 'trac_nghiem' | 'tra_loi_ngan' | 'dung_sai'
  noi_dung: string; lua_chon: string[] | null; menh_de: { noi_dung?: string; dap_an?: string }[] | null
  dap_an: string | null; loi_giai: string | null; anh_de: string | null; anh_dap_an: string | null
  ghi_chu: string | null; nguon: string | null; nguon_ma_cau: string | null
  da_duyet: boolean; xoa_at: string | null; created_at: string; updated_at: string
}
// Phần soạn được (form) — không gồm mã / vai / thứ tự / duyệt
export type CauLopNhap = Pick<CauLop, 'loai_cau' | 'noi_dung' | 'lua_chon' | 'dap_an' | 'loi_giai' | 'anh_de' | 'anh_dap_an' | 'ghi_chu' | 'nguon'>

/** Mã câu kho trên lớp (mã gốc cấp ở DB: 'LOP' + 6 số) — để resolve đúng bảng khi tài liệu trộn 2 kho. */
export const laMaLop = (ma: string): boolean => /^LOP\d{6}$/.test(ma)

export async function cauLopCuaDang(dangBaiId: string): Promise<CauLop[]> {
  const { data, error } = await supabase.rpc('fn_dai_lop_cua_dang', { p_dang_bai: dangBaiId }).limit(500)
  if (error) throw error
  return (data ?? []) as CauLop[]
}
/** Số câu giảng / luyện theo dạng bài của 1 khối — đếm ở DB. */
export async function demLopTheoDang(khoi: string): Promise<Record<string, { giang: number; luyen: number }>> {
  const { data, error } = await supabase.rpc('fn_dai_lop_dem', { p_khoi: khoi }).limit(5000)
  if (error) throw error
  return Object.fromEntries(((data ?? []) as { dang_bai_id: string; so_giang: number; so_luyen: number }[]).map((r) => [r.dang_bai_id, { giang: r.so_giang, luyen: r.so_luyen }]))
}
export async function themCauLop(dangBaiId: string, vai: VaiLop, cau: CauLopNhap): Promise<CauLop> {
  const { data, error } = await supabase.rpc('fn_dai_lop_them', { p_dang_bai: dangBaiId, p_vai: vai, p_cau: cau })
  if (error) throw error
  return data as CauLop
}
export async function suaCauLop(maCau: string, cau: CauLopNhap): Promise<CauLop> {
  const { data, error } = await supabase.from('dai_cau_lop').update(cau).eq('ma_cau', maCau).select('*').single()
  if (error) throw error
  return data as CauLop
}
/** Bỏ khỏi kho = đưa vào kho rác (tài liệu trỏ mã bằng text ⇒ không xoá cứng). */
export async function boCauLop(maCau: string): Promise<void> {
  const { error } = await supabase.from('dai_cau_lop').update({ xoa_at: new Date().toISOString() }).eq('ma_cau', maCau)
  if (error) throw error
}
/** Đặt lại thứ tự 1 chuỗi (dạng bài × vai); câu của vai kia có trong mảng thì chuyển vai. */
export async function xepCauLop(dangBaiId: string, vai: VaiLop, maCaus: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_dai_lop_xep', { p_dang_bai: dangBaiId, p_vai: vai, p_ma_caus: maCaus })
  if (error) throw error
}
/** Chép câu kho LUYỆN sang kho trên lớp (câu mới, mã mới, nhớ nguồn). */
export async function chepTuKhoLuyen(dangBaiId: string, vai: VaiLop, maCaus: string[]): Promise<CauLop[]> {
  const { data, error } = await supabase.rpc('fn_dai_lop_chep_tu_kho', { p_dang_bai: dangBaiId, p_vai: vai, p_ma_caus: maCaus })
  if (error) throw error
  return (data ?? []) as CauLop[]
}
