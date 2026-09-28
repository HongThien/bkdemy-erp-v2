// ============================================================================
// hosoGami.ts — HỒ SƠ khoe của HS theo môn (design/DON-HANG-GAMI-HS.md Đơn 4, mig 202609290015).
// Sao / tổng sao / bản cứng / 3 khoe đều đọc ở Postgres (fn_hs_ho_so) — ở đây chỉ gọi RPC. Rank + Chặng lấy từ rank.ts / nhiemvu.ts.
// ============================================================================
import { supabase } from './supabase'

export type Khoe = { vi_tri: number; key: string; ten: string; sao: number }
export type HoSoGami = {
  mon: string; mua: string | null
  huy_hieu: { key: string; ten: string; sao: number; sao_cao_nhat: number }[]
  tong_sao: number; tong_sao_toi_da: number; ban_cung_da_nhan: number
  khoe: Khoe[]
}

// null = môn chưa mở huy hiệu.
export async function hoSoGamiCuaToi(mon: string): Promise<HoSoGami | null> {
  const { data, error } = await supabase.rpc('fn_hs_ho_so', { p_mon: mon })
  if (error) throw error
  return (data as HoSoGami | null) ?? null
}

// Thay bộ khoe (0–3 key, thứ tự = vị trí). Trả bộ mới để màn vá tại chỗ.
export async function datKhoe(mon: string, keys: string[]): Promise<Khoe[]> {
  const { data, error } = await supabase.rpc('fn_hs_khoe_dat', { p_mon: mon, p_keys: keys })
  if (error) throw error
  return (data ?? []) as Khoe[]
}
