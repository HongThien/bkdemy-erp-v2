// Seam DASHBOARD CÔNG VIỆC OPS (CEO chốt 06/09 tối) — app OPS chưa từng có "Của tôi",
// dựng CÙNG KHUÔN TA: bar đạt-chuẩn + 4 số + xếp hạng riêng + items đầy đủ (accordion).
// 4 việc phủ: Report + Báo tan + Prep phòng + Coi test đầu vào (fn_ops_dashboard §2.0).
import { supabase } from './supabase'
import type { ViecItem, XepHangTop } from './xephang'
export type { ViecItem, XepHangTop }

export type OpsDash = {
  ym: string
  me: { tong?: number; cho?: number; den_han?: number; dat?: number; khong_dat?: number; pct?: number | null; du_dieu_kien_xep_hang?: boolean }
  rank: number | null
  tongXepHang: number
  top: XepHangTop[]
  items: ViecItem[]
  nguongChatLuong: number
  nguongRankFinal: number
  nguongRankTop: number
}

export async function opsDashboard(ym: string): Promise<OpsDash> {
  const { data, error } = await supabase.rpc('fn_ops_dashboard', { p_ym: ym })
  if (error) throw error
  return data as OpsDash
}
