// BỔ TRỢ HÌNH (Thùy 17/10): loại bổ trợ thứ 4, độc lập với bổ trợ yếu Đại. "Case" = hồ sơ bổ trợ Hình của 1 em (bảng bo_tro_hinh).
// Không có bản đồ/kho ⇒ không dạng, không đo; Trang/Lộc tự mở case, tài liệu gắn theo BUỔI, cuối buổi chỉ nhận xét.
// Mọi số + trạng thái tính ở DB (fn_bthinh_*, mig 202610171805 — §2.0); file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'

export type UuTienHinh = 1 | 2 | 3
export const UU_TIEN_HINH_TEN: Record<UuTienHinh, string> = { 3: 'Cao', 2: 'Thường', 1: 'Thấp' }
export const MUC_HINH_TEN: Record<number, string> = { 1: 'L1 · trước/sau giờ', 2: 'L2 · buổi riêng (TA)', 3: 'L3 · buổi riêng (GV cao cấp)' }
export type KetQuaHinh = 'on' | 'can_them' | 'bo' | 'day_xong'
export const KET_QUA_HINH_TEN: Record<KetQuaHinh, string> = { on: 'Ổn', can_them: 'Cần thêm', bo: 'Bỏ', day_xong: 'Đã dạy xong' }

export type BuoiChoHinh = { buoi_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null; nguoi_day_ten: string | null; diem_danh: string | null; so_tai_lieu: number }
export type CaseHinh = {
  id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  muc: number; uu_tien: UuTienHinh; ly_do: string; created_at: string; trang_thai: 'dang_xu' | 'hoan_thanh'
  ket_qua: KetQuaHinh | null; ghi_chu_dong: string | null; hoan_thanh_at: string | null; vong_tiep: boolean
  so_buoi_da_hoc: number; buoi_cho: BuoiChoHinh | null; giai_doan: 'can_xep' | 'da_xep' | 'hoan_thanh'
}
export type DanhSachHinh = { ds: CaseHinh[]; tran: { dang: number; dang_hinh: number; cao: number; tran_dang: number; tran_cao: number } }

export async function danhSachHinh(trangThai: 'dang_xu' | 'hoan_thanh' = 'dang_xu'): Promise<DanhSachHinh> {
  const { data, error } = await supabase.rpc('fn_bthinh_danh_sach', { p_trang_thai: trangThai, p_limit: 300 })
  if (error) throw error
  return data as DanhSachHinh
}
export async function moCaHinh(hs: string, muc: number, uuTien: UuTienHinh, lyDo: string, lop?: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('fn_bthinh_mo', { p_hs: hs, p_muc: muc, p_uu_tien: uuTien, p_ly_do: lyDo, p_lop: lop ?? null })
  if (error) throw error
  return data as string
}
export async function doiCaHinh(caseId: string, muc: number | null, uuTien: UuTienHinh | null): Promise<void> {
  const { error } = await supabase.rpc('fn_bthinh_doi', { p_case: caseId, p_muc: muc, p_uu_tien: uuTien })
  if (error) throw error
}
export async function dongCaHinh(caseId: string, ketQua: 'on' | 'can_them' | 'bo', ghiChu: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_bthinh_dong', { p_case: caseId, p_ket_qua: ketQua, p_ghi_chu: ghiChu })
  if (error) throw error
}
export type LogHinh = { at: string; su_kien: string; cu: unknown; moi: unknown; ai: string | null }
export async function lichSuCaHinh(caseId: string): Promise<LogHinh[]> {
  const { data, error } = await supabase.rpc('fn_bthinh_lich_su', { p_case: caseId })
  if (error) throw error
  return (data as LogHinh[]) ?? []
}

// ── Tài liệu của buổi (kho tài liệu / tài liệu builder) ──
export type TaiLieuHinh = { id: string; ten: string; loai: string; khoi: string | null; file_url: string | null; ghi_chu?: string | null }
export async function taiLieuCuaBuoi(buoiId: string): Promise<TaiLieuHinh[]> {
  const { data, error } = await supabase.from('bo_tro_hinh_tai_lieu').select('thu_tu, ghi_chu, tai_lieu:tai_lieu_id(id, ten, loai, khoi, file_url)').eq('buoi_hoc_id', buoiId).order('thu_tu').limit(100)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({ ...r.tai_lieu, ghi_chu: r.ghi_chu }))
}
export async function ganTaiLieu(buoiId: string, ids: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_bthinh_gan_tai_lieu', { p_buoi: buoiId, p_tai_lieu: ids })
  if (error) throw error
}
// Tìm trong kho tài liệu (môn Toán): theo tên, mới nhất trước. Chỉ list thô để chọn.
export async function timTaiLieu(q: string): Promise<TaiLieuHinh[]> {
  let qb = supabase.from('tai_lieu').select('id, ten, loai, khoi, file_url').eq('mon', 'Toán').order('created_at', { ascending: false }).limit(30)
  const t = q.trim(); if (t) qb = qb.ilike('ten', `%${t.replace(/[%_]/g, '')}%`)
  const { data, error } = await qb
  if (error) throw error
  return (data as TaiLieuHinh[]) ?? []
}

// ── App TA ──
export type ViecCaHinh = {
  buoi_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null
  case_id: string; level: number; uu_tien: UuTienHinh; ly_do: string
  diem_danh: string | null; danh_gia_xong_at: string | null; nhan_xet: string | null; tai_lieu: TaiLieuHinh[]
}
export async function viecHinhCuaToi(): Promise<ViecCaHinh[]> {
  const { data, error } = await supabase.rpc('fn_bthinh_viec_cua_toi')
  if (error) throw error
  return ((data as { ca?: ViecCaHinh[] } | null)?.ca) ?? []
}
export async function hoanTatCaHinh(buoiId: string, nhanXet: string, conTiep: boolean): Promise<{ ket_thuc_case?: boolean }> {
  const { data, error } = await supabase.rpc('fn_bthinh_hoan_tat', { p_buoi: buoiId, p_nhan_xet: nhanXet, p_con_tiep: conTiep })
  if (error) throw error
  return data as { ket_thuc_case?: boolean }
}

// Điểm danh ca Hình (app TA): cùng bảng buoi_hoc_hs như mọi buổi; khoá theo (buổi, em) vì RPC việc-của-tôi không trả id dòng.
export async function diemDanhCaHinh(buoiId: string, hocSinhId: string, tt: 'co_mat' | 'vang' | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc_hs').update({ diem_danh: tt }).eq('buoi_hoc_id', buoiId).eq('hoc_sinh_id', hocSinhId).not('bo_tro_hinh_id', 'is', null)
  if (error) throw error
}
