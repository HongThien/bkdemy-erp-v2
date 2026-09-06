// Seam DASHBOARD CÔNG VIỆC TA (CEO chốt 30/08 đêm, mở rộng 06/09: gậy-override + xếp
// hạng riêng đổi ngưỡng + items đầy đủ) — mọi đếm/xếp hạng ở Postgres (fn_ta_dashboard,
// §2.0), UI chỉ gọi + hiển thị.
import { supabase } from './supabase'
import type { ViecItem, XepHangTop } from './xephang'
export type { ViecItem, XepHangTop }

export type TaDash = {
  ym: string
  me: {
    tong?: number; cho?: number; den_han?: number; dat?: number; khong_dat?: number
    pct?: number | null; dat_moc_thuong?: boolean; du_dieu_kien_xep_hang?: boolean
  }
  rank: number | null
  tongXepHang: number
  top: XepHangTop[]
  items: ViecItem[]
  nguongChatLuong: number
  nguongRankFinal: number
  nguongRankTop: number
}

export async function taDashboard(ym: string): Promise<TaDash> {
  const { data, error } = await supabase.rpc('fn_ta_dashboard', { p_ym: ym })
  if (error) throw error
  return data as TaDash
}
