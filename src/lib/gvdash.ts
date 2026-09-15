// Seam DASHBOARD CÔNG VIỆC GV (CEO chốt 31/08, mở rộng 06/09: THÊM xếp hạng riêng —
// trước đây "chưa đủ logic" — dùng CHUNG khuôn TA/OPS + gậy-override + items đầy đủ).
// Mọi đếm/xếp hạng ở Postgres (fn_gv_dashboard, §2.0), UI chỉ gọi.
import { supabase } from './supabase'
import type { ViecItem, XepHangTop } from './xephang'
export type { ViecItem, XepHangTop }

export type GvDash = {
  ym: string
  me: { tong?: number; cho?: number; den_han?: number; dat?: number; khong_dat?: number; pct?: number | null; du_dieu_kien_xep_hang?: boolean }
  rank: number | null
  tongXepHang: number
  top: XepHangTop[]
  items: ViecItem[]
  nguongRankFinal: number
  nguongRankTop: number
}

export async function gvDashboard(ym: string): Promise<GvDash> {
  const { data, error } = await supabase.rpc('fn_gv_dashboard', { p_ym: ym })
  if (error) throw error
  return data as GvDash
}
