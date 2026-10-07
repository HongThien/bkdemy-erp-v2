// ============================================================================
// thanhtuu_moi.ts — THÀNH TỰU 15 LOẠI (Thùy chốt 06/10; spec-kinh-te-nhiem-vu.md §11, mig 202610071018 · 202610071126).
// Mô hình (Thùy 07/10): ĐẠT (suy từ lịch sử ở Postgres) ≠ ĐÃ NHẬN (em bấm "Nhận quà" ⇒ mới ghi sổ & tính EXP). Mỗi thành tựu = 1 thẻ, chỉ hiện bậc kế tiếp.
// Ở đây chỉ gọi RPC. (Khác ./thanhtuu_hs.ts = giải thưởng cuối tháng thầy cô công bố.)
// ============================================================================
import { supabase } from './supabase'

export type TtBac = { bac: number; nguong: number; exp: number; xu: number; dat: boolean; co_the_nhan: boolean; dat_at: string | null }
export type TtLoai = {
  ma: string; ten: string; mo_ta: string; kieu: 'thang' | 'lien_tiep' | 'tich_luy' | 'mot_lan'; don_vi: string
  an: boolean; san_sang: boolean; tien_do: number | null; bac: TtBac[]
}
export type TtCuaToi = { mua: string | null; tien_do: Record<string, number>; tong_exp_mua: number; cho_nhan: number; loai: TtLoai[] }
export type TtNhan = { ma: string; bac: number; mon: string | null; exp: number; xu: number; ten: string; moi: boolean }

export async function thanhTuuMoiCuaToi(): Promise<TtCuaToi> {
  const { data, error } = await supabase.rpc('fn_thanh_tuu_cua_toi')
  if (error) throw error
  return data as TtCuaToi
}
/** Bấm "Nhận quà" một bậc đã đạt. Idempotent: nhận lại trả moi=false, exp=0. */
export async function thanhTuuNhan(ma: string, bac: number): Promise<TtNhan> {
  const { data, error } = await supabase.rpc('fn_thanh_tuu_nhan', { p_ma: ma, p_bac: bac })
  if (error) throw error
  return data as TtNhan
}
/** Số THẺ thành tựu đang có quà chờ nhận — chỉ số trên ô Thành tựu ở màn chính. */
export async function thanhTuuChoNhan(): Promise<number> {
  const { data, error } = await supabase.rpc('fn_thanh_tuu_cho_nhan')
  if (error) throw error
  return (data as number) ?? 0
}

// Ghi "hôm nay em có mở app" (1 dòng/ngày, idempotent) — nguồn của thành tựu TT04. Lỗi mạng bỏ qua, không chặn gì.
export async function ghiMoApp(): Promise<void> {
  const { error } = await supabase.rpc('fn_hs_mo_app')
  if (error) throw error
}
