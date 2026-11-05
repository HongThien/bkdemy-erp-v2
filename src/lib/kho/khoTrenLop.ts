// KHO TRÊN LỚP — Đại (Thùy 22/10, mig 202610221458): kho phục vụ GIẢNG DẠY, tách khỏi kho LUYỆN TẬP (dai_cau_hoi).
// Mỗi câu gắn 1 dạng bài bản đồ mới, có VAI (giảng · luyện trên lớp) + thứ tự trong dạng (chuỗi gợi ý để dạy).
// Kho = tầng đảm bảo; chọn câu cho lớp nào là việc của giáo trình (GV chọn nguồn từ CẢ 2 kho). Không đo, không vào mastery.
// Thêm / chép / xếp qua RPC (thứ tự tính ở DB); sửa nội dung + bỏ (kho rác xoa_at) = CRUD dòng đơn.
// Hình–Học (Thùy 05/11, mig 202611051603): bảng riêng hinh_hoc_cau_lop, bài học = dạng bài. Rẽ nhánh DUY NHẤT ở KHO_LOP (CLAUDE.md §1.6).
import { supabase } from '../supabase'
import { getKhoCau, getKhoCauHinh, type KhoCauRow } from './banDoMoi'

export type NhanhLop = 'dai' | 'hinh_hoc'
const KHO_LOP: Record<NhanhLop, { tienTo: string; bang: string; fn: string; khoLuyen: (dangBaiId: string) => Promise<KhoCauRow[]> }> = {
  dai: { tienTo: 'LOP', bang: 'dai_cau_lop', fn: 'fn_dai_lop_', khoLuyen: (id) => getKhoCau('dang_bai', id, 'tat_ca', 200, 0) },
  hinh_hoc: { tienTo: 'HHL', bang: 'hinh_hoc_cau_lop', fn: 'fn_hh_lop_', khoLuyen: (id) => getKhoCauHinh('dang_bai', id, 'tat_ca', 200, 0) },
}
const nhanhCuaMa = (ma: string): NhanhLop => (Object.keys(KHO_LOP) as NhanhLop[]).find((k) => ma.startsWith(KHO_LOP[k].tienTo)) ?? 'dai'
/** Bảng kho trên lớp chứa mã câu này (resolve tài liệu trộn nhiều kho). */
export const bangLopCuaMa = (ma: string): string => KHO_LOP[nhanhCuaMa(ma)].bang

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

/** Mã câu kho trên lớp (mã gốc cấp ở DB: 'LOP' Đại · 'HHL' Hình + 6 số) — để resolve đúng bảng khi tài liệu trộn nhiều kho. */
export const laMaLop = (ma: string): boolean => /^(LOP|HHL)\d{6}$/.test(ma)

export async function cauLopCuaDang(dangBaiId: string, nh: NhanhLop = 'dai'): Promise<CauLop[]> {
  const { data, error } = await supabase.rpc(KHO_LOP[nh].fn + 'cua_dang', { p_dang_bai: dangBaiId }).limit(500)
  if (error) throw error
  return (data ?? []) as CauLop[]
}
/** Số câu giảng / luyện theo dạng bài của 1 khối — đếm ở DB. */
export async function demLopTheoDang(khoi: string, nh: NhanhLop = 'dai'): Promise<Record<string, { giang: number; luyen: number }>> {
  const { data, error } = await supabase.rpc(KHO_LOP[nh].fn + 'dem', { p_khoi: khoi }).limit(5000)
  if (error) throw error
  return Object.fromEntries(((data ?? []) as { dang_bai_id: string; so_giang: number; so_luyen: number }[]).map((r) => [r.dang_bai_id, { giang: r.so_giang, luyen: r.so_luyen }]))
}
export async function themCauLop(dangBaiId: string, vai: VaiLop, cau: CauLopNhap, nh: NhanhLop = 'dai'): Promise<CauLop> {
  const { data, error } = await supabase.rpc(KHO_LOP[nh].fn + 'them', { p_dang_bai: dangBaiId, p_vai: vai, p_cau: cau })
  if (error) throw error
  return data as CauLop
}
export async function suaCauLop(maCau: string, cau: CauLopNhap): Promise<CauLop> {
  const { data, error } = await supabase.from(bangLopCuaMa(maCau)).update(cau).eq('ma_cau', maCau).select('*').single()
  if (error) throw error
  return data as CauLop
}
/** Bỏ khỏi kho = đưa vào kho rác (tài liệu trỏ mã bằng text ⇒ không xoá cứng). */
export async function boCauLop(maCau: string): Promise<void> {
  const { error } = await supabase.from(bangLopCuaMa(maCau)).update({ xoa_at: new Date().toISOString() }).eq('ma_cau', maCau)
  if (error) throw error
}
/** Đặt lại thứ tự 1 chuỗi (dạng bài × vai); câu của vai kia có trong mảng thì chuyển vai. */
export async function xepCauLop(dangBaiId: string, vai: VaiLop, maCaus: string[], nh: NhanhLop = 'dai'): Promise<void> {
  const { error } = await supabase.rpc(KHO_LOP[nh].fn + 'xep', { p_dang_bai: dangBaiId, p_vai: vai, p_ma_caus: maCaus })
  if (error) throw error
}
/** Chép câu kho LUYỆN sang kho trên lớp (câu mới, mã mới, nhớ nguồn). */
export async function chepTuKhoLuyen(dangBaiId: string, vai: VaiLop, maCaus: string[], nh: NhanhLop = 'dai'): Promise<CauLop[]> {
  const { data, error } = await supabase.rpc(KHO_LOP[nh].fn + 'chep_tu_kho', { p_dang_bai: dangBaiId, p_vai: vai, p_ma_caus: maCaus })
  if (error) throw error
  return (data ?? []) as CauLop[]
}
/** Câu kho LUYỆN của dạng bài (Hình: bài học) — nguồn để chép sang kho trên lớp. */
export const khoLuyenCuaDang = (dangBaiId: string, nh: NhanhLop = 'dai'): Promise<KhoCauRow[]> => KHO_LOP[nh].khoLuyen(dangBaiId)
