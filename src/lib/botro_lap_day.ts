// DASHBOARD BỔ TRỢ › "Lấp đầy ca" + "Chi tiết bổ trợ" (Thùy 10/11). Mọi phép tính / lọc / tìm kiếm ở DB (CLAUDE.md §2.0) — file này chỉ gọi RPC + gõ kiểu.
//  · fn_botro_lap_day_ca  (mig 202611101405): 2 tỉ lệ — % theo HS (HS ÷ 3×TA) và % theo đơn vị (đã dùng ÷ đơn vị ca).
//  · fn_botro_chi_tiet    (mig 202611101406): mỗi buổi bổ trợ 1 dòng, lọc + tìm không dấu + phân trang.
import { supabase } from './supabase'

export type SoLapDay = { ca: number; hs: number; cap_hs: number; dv: number; cap_dv: number; trong: number; pct_hs: number | null; pct_dv: number | null }
export type TongLapDay = SoLapDay & { day: number }
export type KhungLapDay = SoLapDay & { khoi: string; thu: number; bd: string; kt: string; ta: string }
export type KhoiLapDay = SoLapDay & { khoi: string }
export type ThuLapDay = SoLapDay & { thu: number }
export type GioLapDay = SoLapDay & { nhom: number }
export type CaLapDay = {
  ngay: string; thu: number; bd: string; kt: string; khoi: string; ta: string; so_ta: number
  hs: number; cap_hs: number; dv: number; cap_dv: number; pct_hs: number | null; pct_dv: number | null
  ly: number; lb: number; ld: number; lh: number
}
export type LapDayCa = {
  tu: string; den: string; den_tinh: string; hom_qua: string; ngay_dau: string | null
  tong: TongLapDay; ngoai: number
  khung: KhungLapDay[]; khoi: KhoiLapDay[]; thu: ThuLapDay[]; gio: GioLapDay[]; ds: CaLapDay[]
}
export async function lapDayCa(tu: string, den: string, khoi: string | null, coMat: boolean): Promise<LapDayCa> {
  const { data, error } = await supabase.rpc('fn_botro_lap_day_ca', { p_tu: tu, p_den: den, p_khoi: khoi, p_co_mat: coMat })
  if (error) throw error
  return data as LapDayCa
}

export type LoaiChiTiet = 'bu' | 'bo_tro_yeu' | 'bo_tro_duoi' | 'bo_tro_hinh' | 'bo_tro_nhe' | 'bo_tro_on_thi'
export type HsChiTiet = { ten: string; ma: string | null; khoi: string | null; dd: string | null; dv: number }
export type DongChiTiet = {
  id: string; ma_buoi: string | null; ngay: string; thu: number; bd: string | null; kt: string | null
  loai: LoaiChiTiet; trang_thai: string; phong: string | null; mon: string | null; lop: string | null; ta: string | null
  ca_bo_tro_id: string | null; ca_khoi: string | null; ly_do_huy: string | null
  et_dong_at: string | null; danh_gia_xong_at: string | null; created_at: string
  so_hs: number; hs: HsChiTiet[]; dv: number
}
export type LocChiTiet = {
  tu: string; den: string; loai: LoaiChiTiet[] | null; tt: string[] | null; khoi: string | null
  ganCa: 'co' | 'khong' | null; q: string; limit: number; offset: number
}
export type KqChiTiet = { tong: number; limit: number; offset: number; rows: DongChiTiet[] }
export async function chiTietBoTro(f: LocChiTiet): Promise<KqChiTiet> {
  const { data, error } = await supabase.rpc('fn_botro_chi_tiet', {
    p_tu: f.tu, p_den: f.den, p_loai: f.loai && f.loai.length ? f.loai : null, p_tt: f.tt && f.tt.length ? f.tt : null,
    p_khoi: f.khoi, p_gan_ca: f.ganCa, p_q: f.q.trim() || null, p_limit: f.limit, p_offset: f.offset,
  })
  if (error) throw error
  return data as KqChiTiet
}
