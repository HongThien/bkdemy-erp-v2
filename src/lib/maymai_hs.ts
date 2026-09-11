// Seam MAY MẮN — vòng quay HS (Thùy 11/09). Kiến trúc mirror maymai.ts (nhân sự) nhưng:
//   · Điều kiện quay = ≥1 batch 10 câu tự luyện hôm nay đúng ≥ngưỡng (config, default 70%).
//   · Thưởng EXP (50/100/150/200 · 40/40/15/5%) — lưu bảng RIÊNG (may_man_hs_luot), CHƯA
//     cộng vào EXP tháng lương (§2.0: đổi ý thì thêm source vào fn_gami_exp_xu_thang, 1 mig nhỏ).
//   · RNG + quyết định giải ở SERVER (fn_may_man_hs_quay), client chỉ chạy animation tới ô server trả.
import { supabase } from './supabase'

export type MayManHSLichSu = { ngay: string; exp: number; mon: string | null; created_at: string }
export type MayManHSDuDieuKien = { du: boolean; nguong_pct?: number; bai_lam_id?: string; mon?: string | null; so_dung?: number; so_cau?: number }
export type MayManHSCuaToi = {
  ngay: string
  active: boolean
  hom_nay: { exp: number; mon: string | null; created_at: string } | null   // null = hôm nay chưa quay
  exp_thang: number                                                          // tổng EXP May Mắn tháng này (ước lượng)
  du_dieu_kien: MayManHSDuDieuKien
  ti_le: { ti_le_50: number; ti_le_100: number; ti_le_150: number; ti_le_200: number }
  lich_su: MayManHSLichSu[]
}
export type MayManHSKetQua = { id: string; ngay: string; exp: number; mon: string | null }

export async function mayManHSCuaToi(): Promise<MayManHSCuaToi> {
  const { data, error } = await supabase.rpc('fn_may_man_hs_cua_toi')
  if (error) throw error
  return data as MayManHSCuaToi
}
export async function mayManHSQuay(): Promise<MayManHSKetQua> {
  const { data, error } = await supabase.rpc('fn_may_man_hs_quay')
  if (error) throw error
  return data as MayManHSKetQua
}

// Helper phân biệt cấp — mirror laCap1HS() ở tuluyen.ts (dùng hs_cap2_cua_toi, mig 202609112330).
export async function laCap2HS(): Promise<boolean> {
  const { data, error } = await supabase.rpc('hs_cap2_cua_toi')
  if (error) throw error
  return !!data
}
