// Seam ĐIỂM TÍCH LŨY (chip ⭐ trên đầu "Của tôi", CEO 07/09): mỗi ngày CÓ VIỆC mà 100% đạt = +100
// điểm, chuỗi liên tiếp (ngày không việc trung tính); trượt 1 ngày → về 0 tính lại; cutoff theo
// tháng. Ngày chỉ được tính khi đã QUA (hôm qua trở về trước). Chỉ điểm ĐÃ CHỐT THÁNG mới xài được.
// Mọi số ở Postgres (fn_tich_luy, §2.0) — dùng chung mọi vai trò (gộp việc TA/GV/OPS như xếp hạng chung).
import { supabase } from './supabase'

export type TichLuy = {
  ym: string
  diem_thang: number          // 100 × chuỗi hiện tại — DỰ KIẾN, có thể đổi khi gậy chốt / việc trễ lộ ra
  chuoi: number               // số ngày-có-việc liên tiếp 100% tính đến ngày cuối đã đánh giá
  ngay_cuoi: string | null    // ngày cuối cùng đã được tính
  ngay_trot: string | null    // ngày làm vỡ chuỗi gần nhất (null = chưa trượt)
  xai_duoc: number            // Σ điểm đã chốt các tháng − Σ đơn đã đổi (không huỷ)
  diem_moi_ngay: number
}

export async function tichLuy(ym: string): Promise<TichLuy> {
  const { data, error } = await supabase.rpc('fn_tich_luy', { p_ym: ym })
  if (error) throw error
  return data as TichLuy
}
