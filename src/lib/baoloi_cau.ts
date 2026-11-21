// Báo lỗi TỪNG CÂU HỎI (mig 202610101606). HS gửi qua RPC (gắn câu bằng bai_test_cau.id — server tự suy mã câu + môn, HS không tự khai).
// Nhân sự xem theo CÂU (gộp nhiều HS báo cùng câu) và xử lý cả câu.
import { supabase } from './supabase'

export type LyDoBaoCau = 'thieu_du_kien' | 'hinh_loi' | 'cong_thuc_loi' | 'dap_an_sai' | 'loi_giai_sai' | 'khac'
export const LY_DO_BAO_CAU: { id: LyDoBaoCau; ten: string }[] = [
  { id: 'thieu_du_kien', ten: 'Đề thiếu hoặc sai dữ kiện' },
  { id: 'hinh_loi', ten: 'Hình sai hoặc không hiện' },
  { id: 'cong_thuc_loi', ten: 'Công thức hiển thị lỗi' },
  { id: 'dap_an_sai', ten: 'Đáp án bị chấm sai' },
  { id: 'loi_giai_sai', ten: 'Lời giải sai hoặc khó hiểu' },
  { id: 'khac', ten: 'Lỗi khác' },
]
// Nhân sự báo sai câu trong kho (mig 202611210816, Thùy 21/11): 4 loại + khác. Mọi câu trong kho đều có nút báo.
export type LoaiBaoSai = 'trinh_bay' | 'tinh_sai' | 'sai_de' | 'sai_dang' | 'khac'
export const LOAI_BAO_SAI: { id: LoaiBaoSai; ten: string; goiY: string }[] = [
  { id: 'trinh_bay', ten: 'Trình bày sai', goiY: 'Lời giải rối, thiếu bước, sai khuôn, LaTeX lỗi, hình không hiện…' },
  { id: 'tinh_sai', ten: 'Tính sai', goiY: 'Đáp số hoặc một bước tính sai — ghi đáp số đúng nếu biết' },
  { id: 'sai_de', ten: 'Sai đề', goiY: 'Đề thiếu / thừa dữ kiện, mâu thuẫn, in sai' },
  { id: 'sai_dang', ten: 'Sai dạng', goiY: 'Câu đang nằm sai dạng bài — ghi dạng đúng nếu biết' },
  { id: 'khac', ten: 'Khác', goiY: 'Lỗi khác — mô tả rõ' },
]
export const TEN_LY_DO_BAO_CAU: Record<string, string> = Object.fromEntries([...LY_DO_BAO_CAU, ...LOAI_BAO_SAI].map((l) => [l.id, l.ten]))

// ---------- Nhân sự: báo sai · trưởng khối sửa / xoá (luôn kèm báo) ----------
export type HanhDongBaoSai = 'sua' | 'xoa' | 'khong_loi'
export async function baoSaiCau(maCau: string, loai: LoaiBaoSai, ghiChu: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_kho_bao_sai', { p_ma_cau: maCau, p_loai: loai, p_ghi_chu: ghiChu })
  if (error) throw error
  return data as string
}
/** Trưởng khối xử lý: sửa / xoá / không phải lỗi. Câu chưa có báo cáo mở ⇒ phải kèm loại + ghi chú (DB tự tạo báo cáo cùng giao dịch). */
export async function xuLyBaoSaiCau(maCau: string, hanhDong: HanhDongBaoSai, ketQua: string, bao?: { loai: LoaiBaoSai; ghiChu: string }): Promise<{ da_dong: number; da_xoa: number }> {
  const { data, error } = await supabase.rpc('fn_kho_bao_sai_xu_ly', { p_ma_cau: maCau, p_hanh_dong: hanhDong, p_ket_qua: ketQua, p_loai: bao?.loai ?? null, p_ghi_chu: bao?.ghiChu ?? null })
  if (error) throw error
  return data as { da_dong: number; da_xoa: number }
}
/** Người đang đăng nhập có được sửa / xoá câu này không (trưởng khối đúng khối trở lên). */
export async function duocXuLyBaoSai(maCau: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('fn_kho_bao_sai_quyen', { p_ma_cau: maCau })
  return !error && data === true
}

export type CauBaoSai = {
  mon: string; kho: string | null; khoi: string | null; ma_cau: string
  so_bao: number; so_hs: number; so_ns: number; moi_nhat: string
  ly_do: Record<string, number>; ghi_chu: string[]; noi_dung: string | null
  hanh_dong: HanhDongBaoSai | null; ket_qua: string | null; xu_ly_duoc: boolean
}
/** Hàng đợi báo sai theo phạm vi (môn × khối) của người xem — gồm báo của học sinh lẫn nhân sự. */
export async function dsBaoSaiKho(trangThai: 'moi' | 'da_xu_ly' | 'khong_loi' = 'moi'): Promise<CauBaoSai[]> {
  const { data, error } = await supabase.rpc('fn_kho_bao_sai_ds', { p_trang_thai: trangThai })
  if (error) throw error
  return (data ?? []) as CauBaoSai[]
}

export async function baoLoiCau(baiTestCauId: string, lyDo: LyDoBaoCau, ghiChu?: string): Promise<{ id: string; con_lai_hom_nay: number }> {
  const { data, error } = await supabase.rpc('fn_hs_bao_loi_cau', { p_bai_test_cau_id: baiTestCauId, p_ly_do: lyDo, p_ghi_chu: ghiChu?.trim() || null })
  if (error) throw error
  return data as { id: string; con_lai_hom_nay: number }
}

export type CauBaoLoi = {
  mon: string; ma_cau: string; so_bao: number; so_hs: number
  ly_do: Record<string, number> | null; ghi_chu: string[]; moi_nhat: string
  loai_cau: string | null; noi_dung: string | null
}
export async function dsBaoLoiCau(trangThai: 'moi' | 'da_xu_ly' | 'khong_loi' = 'moi'): Promise<CauBaoLoi[]> {
  const { data, error } = await supabase.rpc('fn_bao_loi_cau_ds', { p_trang_thai: trangThai })
  if (error) throw error
  return (data ?? []) as CauBaoLoi[]
}
export async function xuLyBaoLoiCau(mon: string, maCau: string, ketQua: 'da_xu_ly' | 'khong_loi', ghiChu?: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_bao_loi_cau_xu_ly', { p_mon: mon, p_ma_cau: maCau, p_ket_qua: ketQua, p_ghi_chu: ghiChu ?? null })
  if (error) throw error
  return (data as number) ?? 0
}
