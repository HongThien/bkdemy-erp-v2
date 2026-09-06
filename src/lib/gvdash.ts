// Seam DASHBOARD CÔNG VIỆC GV (CEO chốt 31/08 — TẦNG A: đạt-chuẩn/đến-hạn 2 khâu đánh giá +
// chấm bài trên lớp; CHƯA mốc thưởng/xếp hạng/chất lượng — "chưa đủ logic", tầng B/C còn phải
// nghĩ, xem PLAN-app-gv.md §6). Mọi đếm ở Postgres (fn_gv_dashboard, §2.0), UI chỉ gọi.
import { supabase } from './supabase'

export type GvDash = {
  ym: string
  me: { tong?: number; cho?: number; den_han?: number; dat?: number; khong_dat?: number; pct?: number | null }
  khongDat: { ten_lop: string; ngay: string; tab: string; ly_do: string | null }[]
}

export async function gvDashboard(ym: string): Promise<GvDash> {
  const { data, error } = await supabase.rpc('fn_gv_dashboard', { p_ym: ym })
  if (error) throw error
  return data as GvDash
}
