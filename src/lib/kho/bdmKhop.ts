// B4 DUYỆT KHỚP — duyệt câu xếp vào dạng bài của BẢN ĐỒ MỚI. mig 202610161046 · spec-ban-do-4-tang.md §B4.
// Seam: UI chỉ gọi hàm ở đây; mọi đếm/lọc/phân quyền theo phạm vi nằm ở Postgres (CLAUDE.md §2.0).
import { supabase } from '../supabase'

export type KhopHang = 'de_xuat' | 'trong' | 'thieu' | 'mau'
export const KHOP_HANG_LABEL: Record<KhopHang, string> = {
  de_xuat: 'Chưa chắc', trong: 'Chưa có dạng', thieu: 'Thiếu dạng', mau: 'Kiểm mẫu',
}
export const KHOP_HANG_MOTA: Record<KhopHang, string> = {
  de_xuat: 'AI đề xuất nhưng chưa chắc — bấm đúng hoặc chọn dạng khác. Câu ở kho tạm, chuyển đi khi đã xác nhận.',
  trong: 'Chưa có đề xuất nào — chọn dạng bài, hoặc báo "thiếu dạng" nếu bản đồ chưa có.',
  thieu: 'Đã báo bản đồ chưa có dạng cho câu này. Khi bản đồ có dạng thì chọn để chuyển đi.',
  mau: 'AI đã gán (mức chắc). Xem ngẫu nhiên ~10% để đo độ chính xác — sai thì sửa.',
}

export type KhopDem = { de_xuat: number; thieu: number; trong: number; mau: number; kiem_n: number; kiem_giu: number }
export type KhopCau = {
  ma_cau: string; loai: string | null; noi_dung: string | null; lua_chon: unknown; menh_de: unknown; dap_an: string | null; anh_de: string | null
  ly_do: string | null; chac: string | null
  dang_bai_id: string | null; dang_bai: string | null; nhom: string | null; chu_de: string | null; chuyen_de: string | null
  dang_cu: string | null; chuyen_de_cu: string | null
  nhanh?: 'dai' | 'hgt'   // câu thuộc kho Đại hay kho Hình giải tích (mig 202610221734)
  nguon_tl?: string[]     // nguồn tài liệu của câu (mig 202610271607)
}
export type KhopDich = { id: string; dang_bai: string; mo_ta: string | null; nhom: string; nhom_id: string; chuyen_de: string; chuyen_de_id: string; chu_de: string; chu_de_id: string }
export type KhopPhamVi = { id: number; tai_khoan_id: string; khoi: string; chu_de_id: string | null; chu_de: string | null; nguoi: string; cua_toi: boolean }
export type KhopHanhDong = 'gan' | 'thieu' | 'bo_de_xuat' | 'mau_giu' | 'mau_doi' | 'tu_choi' | 'kho_rac'   // Thùy 18/10: từ chối kèm lý do (kho_rac = câu hỏng)

const go = async <T,>(fn: string, args: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

// nguon (Thùy 27/10): 'de_thi' | 'de_cuong' | 'sach:<tác giả>' | 'kho_cu' — lọc ở DB (mig 202610271607); null = mọi nguồn
export const khopDem = (khoi: string, chuDe?: string | null, nguon?: string | null) =>
  go<KhopDem>('fn_bdm_khop_dem', { p_khoi: khoi, p_chu_de: chuDe ?? null, p_nguon: nguon ?? null })
export const khopHang = (khoi: string, hang: KhopHang, limit = 30, offset = 0, chuDe?: string | null, nguon?: string | null) =>
  go<{ tong: number; rows: KhopCau[] }>('fn_bdm_khop_hang', { p_khoi: khoi, p_hang: hang, p_limit: limit, p_offset: offset, p_chu_de: chuDe ?? null, p_nguon: nguon ?? null })
export const khopNguonDs = (khoi: string, hang: KhopHang, chuDe?: string | null) =>
  go<{ nguon: string; so_cau: number }[]>('fn_bdm_khop_nguon_ds', { p_khoi: khoi, p_hang: hang, p_chu_de: chuDe ?? null })
export const khopDich = (khoi: string) => go<KhopDich[]>('fn_bdm_khop_dich', { p_khoi: khoi })
export const khopQuyet = (maCau: string, hanhDong: KhopHanhDong, dangBai?: string | null, lyDo?: string | null) =>
  go<{ ok: boolean }>('fn_bdm_khop_quyet', { p_ma_cau: maCau, p_hanh_dong: hanhDong, p_dang_bai: dangBai ?? null, p_ly_do: lyDo ?? null })
export const khopPhamVi = () => go<{ la_admin: boolean; rows: KhopPhamVi[] }>('fn_bdm_khop_pham_vi', {})
export const khopUngVien = () => go<{ tai_khoan_id: string; ho_ten: string }[]>('fn_bdm_khop_ung_vien', {})
export const khopGiao = (taiKhoan: string, khoi: string, chuDe: string | null) =>
  go<number>('fn_bdm_khop_giao', { p_tai_khoan: taiKhoan, p_khoi: khoi, p_chu_de: chuDe })
export const khopGo = (id: number) => go<null>('fn_bdm_khop_go', { p_id: id })
