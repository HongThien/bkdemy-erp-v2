// Seam MAY MẮN — vòng quay HS (Thùy 11/09). Kiến trúc mirror maymai.ts (nhân sự) nhưng:
//   · 2 chế độ do SERVER quyết (che_do), đổi ở nhiem_vu_cau_hinh.bat_dau (Toán 01/10/2026 — mig 202609281810):
//     'tu_luyen' (cũ): 1 lượt tự luyện 10 câu đúng ≥70% · 50/100/150/200 EXP · EXP KHÔNG thành xu.
//     'nhiem_vu' (mới): xong ≥2 nhiệm vụ ngày của môn · 20/30/50/100/200 EXP · EXP ĐỔI RA XU (trần app 30/tháng/môn).
//   · RNG + quyết định giải ở SERVER (fn_may_man_hs_quay), client chỉ chạy animation tới ô server trả.
import { supabase } from './supabase'

export type MayManHSLichSu = { ngay: string; exp: number; mon: string | null; created_at: string }
export type MayManHSDuDieuKien = { du: boolean; che_do?: 'nhiem_vu'; nguong_pct?: number; bai_lam_id?: string; mon?: string | null; so_dung?: number; so_cau?: number; so_nv?: number; can?: number }
export type MayManHSCuaToi = {
  ngay: string
  active: boolean
  hom_nay: { exp: number; mon: string | null; created_at: string } | null   // null = hôm nay chưa quay
  exp_thang: number                                                          // tổng EXP May Mắn tháng này (ước lượng)
  du_dieu_kien: MayManHSDuDieuKien
  che_do: 'tu_luyen' | 'nhiem_vu'
  ti_le: Record<string, number>   // khoá 'ti_le_<exp>' — tập giải theo che_do
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
