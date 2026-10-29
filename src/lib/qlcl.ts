// QUẢN LÝ CHẤT LƯỢNG — widget dạng yếu của Trưởng khối (Thùy 29/10, spec-truong-khoi.md §8.4).
// Số dạng yếu tính ở DB (fn_btyeu_dang_yeu_2_cua_so_moi) và LƯU SẴN ở dang_yeu_hien_tai; ~0,2 s/em nên làm mới lười theo lô
// (fn_qlcl_lam_moi ≤ 10 em/lần). File này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'
import type { EtBtvn } from './botro_tuan'

export type OTongQuan = {
  mon: string; khoi: string; vai: 'truong' | 'pho' | 'toan_he'
  so_hs: number; so_hs_yeu: number; so_dang_yeu: number; so_can_tinh: number; tinh_at: string | null
  dau_tuan_hs_yeu: number | null; dau_tuan_dang_yeu: number | null   // null = chưa đóng băng (chờ Chốt tuần, P3)
}
export async function tongQuanDangYeu(): Promise<OTongQuan[]> {
  const { data, error } = await supabase.rpc('fn_qlcl_tong_quan').limit(200)
  if (error) throw error
  return (data ?? []) as OTongQuan[]
}
// Tính lại tối đa `toiDa` em đã cũ của ô; trả số em còn cũ.
export async function lamMoiDangYeu(mon: string, khoi: string, toiDa = 10): Promise<number> {
  const { data, error } = await supabase.rpc('fn_qlcl_lam_moi', { p_mon: mon, p_khoi: khoi, p_toi_da: toiDa })
  if (error) throw error
  return Number(data ?? 0)
}

export type DangYeuCuaEm = { ma_dang: string; ten_dang: string; score: number; n: number }
export type HsDangYeu = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop_id: string; ten_lop: string
  so_dang_yeu: number; dang: DangYeuCuaEm[]; tinh_at: string
  so_ca_nhe_tuan: number; co_case_yeu: boolean; dang_theo_doi: boolean
}
export async function hsDangYeu(mon: string, khoi: string): Promise<HsDangYeu[]> {
  const { data, error } = await supabase.rpc('fn_qlcl_dang_yeu_hs', { p_mon: mon, p_khoi: khoi }).limit(1000)
  if (error) throw error
  return (data ?? []) as HsDangYeu[]
}
// ET 4 buổi (so lớp, màu) + BTVN 4 buổi — cùng hàm màn Duyệt bổ trợ dùng (fn_botro_et_btvn), đọc sống.
export async function etBtvnCuaEm(hocSinhId: string): Promise<EtBtvn> {
  const { data, error } = await supabase.rpc('fn_botro_et_btvn', { p_hs: hocSinhId, p_n: 4 })
  if (error) throw error
  return (data ?? { et: [], btvn: [] }) as EtBtvn
}
