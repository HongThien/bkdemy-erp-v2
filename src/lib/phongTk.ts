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

// ── Phòng Trưởng bộ môn (mig 202611031237 + 202611031246; Thùy 03/11: "Phó GĐ chuyên môn" = Trưởng bộ môn) ──
// 'tbm' = người toàn hệ QLCL hoặc quản lý môn: nhân vật là trưởng khối · 'tk' = phòng trưởng khối (nhân vật là TA).
export async function cheDoPhong(): Promise<'tbm' | 'tk'> {
  const { data, error } = await supabase.rpc('fn_phong_che_do')
  if (error) throw error
  return data === 'tbm' ? 'tbm' : 'tk'
}
// Môn của phòng trưởng bộ môn: null = toàn hệ (mọi môn).
export async function monTbm(): Promise<string[] | null> {
  const { data, error } = await supabase.rpc('fn_phong_mon_tbm')
  if (error) throw error
  return (data as string[] | null) ?? null
}
// Một ghế trong phòng trưởng bộ môn: trưởng khối (nhan_su_id) hoặc Ô CHƯA CÓ TRƯỞNG KHỐI (nhan_su_id null, mon/khoi có).
export type GheTbm = {
  khoa: string; nhan_su_id: string | null; ho_ten: string | null; anh_url: string | null
  o: string[]; mon: string | null; khoi: string | null   // o = nhãn ô, vd "9" · "KHTN 9"
  so_ta: number; so_ta_co_hs: number
  hieu_suat: number | null   // trung bình hiệu suất tháng của các TA đã có số (gộp ở DB)
  viec_tuan: number; dang_lam: number; da_xong: number; tre_han: number; qua_han: number; gay_thang: number
}
export async function listGheTbm(): Promise<GheTbm[]> {
  const { data, error } = await supabase.rpc('fn_phong_ghe_tbm')
  if (error) throw error
  return (data ?? []) as GheTbm[]
}
// TA ngồi sau một ghế (cùng hình dạng listCapDuoi): trưởng khối ⇒ TA các ô họ quản · ô trống ⇒ TA của ô.
export async function listCapDuoiCuaGhe(g: GheTbm): Promise<CapDuoi[]> {
  const { data, error } = g.nhan_su_id
    ? await supabase.rpc('fn_phong_cap_duoi_cua', { p_tk: g.nhan_su_id })
    : await supabase.rpc('fn_phong_cap_duoi_o', { p_mon: g.mon, p_khoi: g.khoi })
  if (error) throw error
  return (data ?? []) as CapDuoi[]
}
