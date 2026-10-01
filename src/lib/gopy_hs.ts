// Góp ý / báo lỗi của HỌC SINH (spec-v1-app-hs.md §6 · mig 202610011539). Gửi + xem lại qua RPC — HS không ghi thẳng bảng.
// Dùng lại bảng bao_loi của nhân sự (màn duyệt BaoLoiScreen): 'bug' = Báo lỗi · 'yeu_cau' = Góp ý tưởng.
import { supabase } from './supabase'
import { uploadReportAnh } from './baoloi'

export type LoaiGopY = 'bug' | 'yeu_cau'
// Trạng thái nói với em bằng lời dễ hiểu (DB đã dịch từ 7 trạng thái nội bộ).
export type TrangThaiGopY = 'da_nhan' | 'dang_xem' | 'da_xu_ly' | 'chua_lam_duoc'
export const TEN_TRANG_THAI_GOP_Y: Record<TrangThaiGopY, string> = {
  da_nhan: 'Đã nhận', dang_xem: 'Đang xem', da_xu_ly: 'Đã xử lý', chua_lam_duoc: 'Chưa làm được',
}
export type GopYCuaToi = {
  id: string; loai: LoaiGopY; mo_ta: string; anh_url: string | null; at: string
  trang_thai: TrangThaiGopY
  tra_loi: string | null; tra_loi_at: string | null
  tra_loi_moi: boolean      // có lời trả lời em chưa đọc ⇒ hiện dấu "Mới"
}

export const GOP_Y_TOI_DA_MOI_NGAY = 5   // khớp mig (5 / em / ngày giờ VN) — chỉ để hiện chữ, luật thật ở DB

// Gửi. context: màn đang mở, môn, kích thước màn… (app HS tự gom; server thêm họ tên/mã/khối). anh: ảnh chụp (tuỳ chọn, tải lên kho-anh/report).
export async function guiGopY(input: { loai: LoaiGopY; moTa: string; route?: string; context?: Record<string, unknown>; anh?: Blob | null }): Promise<{ id: string; con_lai_hom_nay: number }> {
  const anhUrl = input.anh ? await uploadReportAnh(input.anh) : null   // hỏng ảnh thì vẫn gửi chữ
  const { data, error } = await supabase.rpc('fn_hs_gui_gop_y', {
    p_loai: input.loai, p_mo_ta: input.moTa, p_route: input.route ?? null, p_context: input.context ?? null, p_anh_url: anhUrl,
  })
  if (error) throw error
  return data as { id: string; con_lai_hom_nay: number }
}

export async function gopYCuaToi(): Promise<GopYCuaToi[]> {
  const { data, error } = await supabase.rpc('fn_hs_gop_y_cua_toi')
  if (error) throw error
  return (data ?? []) as GopYCuaToi[]
}

// Số lời trả lời chưa đọc — cho chấm đỏ ở nút Góp ý / Hòm thư.
export async function soGopYChuaDoc(): Promise<number> {
  const { data, error } = await supabase.rpc('fn_hs_gop_y_chua_doc')
  if (error) throw error
  return (data as number) ?? 0
}
export async function danhDauDaDocGopY(): Promise<void> {
  const { error } = await supabase.rpc('fn_hs_gop_y_da_doc')
  if (error) throw error
}
