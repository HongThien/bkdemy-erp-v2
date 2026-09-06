// Seam TIẾN TRÌNH TA (box "Tiến trình" trong Của tôi, CEO 07/09): thừa/thiếu so với định mức
// tháng theo TỪNG LỚP + bổ trợ theo TA. Mọi đếm ở Postgres (fn_ta_tien_trinh, §2.0); định mức
// đọc từ bảng ta_dinh_muc (sửa được, không hardcode). KHÔNG dùng tính lương (CEO 07/09).
import { supabase } from './supabase'

export type TienTrinhLop = {
  lop_id: string; ten_lop: string; buoi_tuan: number
  buoi_chuan: number; buoi_thuc: number
  btvn_chuan: number; btvn_thuc: number
  et_chuan: number; et_thuc: number
}
export type TaTienTrinh = {
  ym: string
  lop: TienTrinhLop[]
  botro: { chuan_gio: number; so_ca: number; thuc_gio: number }
  dinh_muc: { buoi_x_tuan: number; btvn: number; et: number; botro_gio: number }
}

export async function taTienTrinh(ym: string): Promise<TaTienTrinh> {
  const { data, error } = await supabase.rpc('fn_ta_tien_trinh', { p_ym: ym })
  if (error) throw error
  return data as TaTienTrinh
}
