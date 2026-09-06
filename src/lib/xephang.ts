// Kiểu + RPC DÙNG CHUNG cho "Của tôi" 3 app TA/GV/OPS (CEO chốt 06/09 tối): mỗi app tự
// tính riêng qua fn_<app>_dashboard, còn bảng CHUNG (toàn bộ nhân sự BK, gộp mọi vai trò
// 1 người đang có) tính 1 lần duy nhất ở fn_xephang_chung — mọi số ở Postgres (§2.0).
import { supabase } from './supabase'

export type ViecItem = { ten_lop: string; ngay: string; tab: string; kq: 'dat' | 'khong_dat'; ly_do: string | null }
// top = 6 người đầu bảng (fn trả limit 6 từ 07/09): [0..2] lên bục, [3..5] danh sách dưới bục; anh_url = avatar thật
export type XepHangTop = { ho_ten: string; pct: number | null; dat: number; den_han: number; anh_url?: string | null }

export type XepHangChung = {
  ym: string
  me: { dat?: number; den_han?: number; pct?: number | null; du_dieu_kien_xep_hang?: boolean }
  rank: number | null
  tongXepHang: number
  top: XepHangTop[]
  nguongRankFinal: number
  nguongRankTop: number
}

export async function xepHangChung(ym: string): Promise<XepHangChung> {
  const { data, error } = await supabase.rpc('fn_xephang_chung', { p_ym: ym })
  if (error) throw error
  return data as XepHangChung
}
