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
export const TEN_LY_DO_BAO_CAU: Record<string, string> = Object.fromEntries(LY_DO_BAO_CAU.map((l) => [l.id, l.ten]))

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
