// Phòng làm việc trưởng khối — cấp dưới (TA của khối) cho cảnh phòng. Mọi số tính ở DB (mig 202611031122):
// fn_phong_cap_duoi() 1 dòng / TA · fn_phong_cap_duoi_chi_tiet(p_ns) khi bấm vào nhân vật. Client chỉ hiển thị.
import { supabase } from './supabase'

export type CapDuoi = {
  nhan_su_id: string; ho_ten: string; anh_url: string | null; khoi: string[]
  hieu_suat: number | null; hieu_suat_du: boolean        // hiệu suất TA tháng (fn_hsta_thang.tong_de_xuat)
  viec_tuan: number; dang_lam: number; da_xong: number; tre_han: number; qua_han: number; gay_thang: number
}
export type ViecTA = {
  buoi_id: string; ten_lop: string; ngay: string; tab: 'btvn' | 'et'; han: string | null; dong_dau: string | null
  trang_thai: 'dang_lam' | 'xong' | 'xong_tre' | 'qua_han'; la_ton: boolean
}
export type GayTA = { ten_loi: string | null; so_gay: number; trang_thai: string; ten_lop: string | null; ngay: string | null; ly_do: string | null }
export type ChiTietCapDuoi = {
  hieu_suat: { btvn_de_xuat: number | null; et_de_xuat: number | null; tong_de_xuat: number | null; chot: Record<string, { diem_chot: number | null }>; btvn_so_task: number; et_so_task: number; bt_so_ca: number } | null
  viec: ViecTA[]; gay: GayTA[]
}

export async function listCapDuoi(): Promise<CapDuoi[]> {
  const { data, error } = await supabase.rpc('fn_phong_cap_duoi')
  if (error) throw error
  return (data ?? []) as CapDuoi[]
}

export async function chiTietCapDuoi(ns: string): Promise<ChiTietCapDuoi> {
  const { data, error } = await supabase.rpc('fn_phong_cap_duoi_chi_tiet', { p_ns: ns })
  if (error) throw error
  return data as ChiTietCapDuoi
}
