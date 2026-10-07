// ============================================================================
// thanhtuu_moi.ts — THÀNH TỰU 15 LOẠI (Thùy chốt 06/10; spec-kinh-te-nhiem-vu.md §11, mig 202610071018).
// Đạt/chưa suy từ lịch sử ở Postgres; fn_thanh_tuu_chot() ghi sổ các bậc MỚI (idempotent) — gọi lười khi em mở app / mở màn Thành tựu.
// Ở đây chỉ gọi RPC. (Khác ./thanhtuu_hs.ts = giải thưởng cuối tháng thầy cô công bố.)
// ============================================================================
import { supabase } from './supabase'

export type TtBac = { bac: number; nguong: number; exp: number; xu: number; dat: boolean; dat_at: string | null }
export type TtLoai = {
  ma: string; ten: string; mo_ta: string; kieu: 'thang' | 'lien_tiep' | 'tich_luy' | 'mot_lan'; don_vi: string
  an: boolean; san_sang: boolean; tien_do: number | null; bac: TtBac[]
}
export type TtCuaToi = { mua: string | null; tien_do: Record<string, number>; tong_exp_mua: number; loai: TtLoai[] }
export type TtMoi = { ma: string; bac: number; mon: string; exp: number; xu: number; ten: string }

export async function thanhTuuChot(): Promise<TtMoi[]> {
  const { data, error } = await supabase.rpc('fn_thanh_tuu_chot')
  if (error) throw error
  return (data as TtMoi[]) ?? []
}
export async function thanhTuuMoiCuaToi(): Promise<TtCuaToi> {
  const { data, error } = await supabase.rpc('fn_thanh_tuu_cua_toi')
  if (error) throw error
  return data as TtCuaToi
}

// Ghi "hôm nay em có mở app" (1 dòng/ngày, idempotent) — nguồn của thành tựu TT04. Lỗi mạng bỏ qua, không chặn gì.
export async function ghiMoApp(): Promise<void> {
  const { error } = await supabase.rpc('fn_hs_mo_app')
  if (error) throw error
}
