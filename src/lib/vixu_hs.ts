// Seam VÍ XU — app HS (Thùy 23/09). Toàn bộ hạ tầng xu/EXP cũ (tuqua.ts, thanhtich.ts) là CHỈ-NHÂN-SỰ
// (RLS/chặn tường minh — xem migration 202609231557). RPC "của tôi" mới tự resolve my_hoc_sinh_id(),
// trả 1 khối jsonb gộp sẵn — client chỉ render, không tính/join gì thêm (§2.0).
import { supabase } from './supabase'

export type HoatDongViXu = {
  loai: 'exp' | 'xu' | 'may_man'
  nguon: string // exp: 'exp_et'|'exp_btvn'|'exp_btvn_thang'|'attend_floor' · xu: loai của qlht_xu_ledger · may_man: 'may_man'
  mon: string | null
  so: number
  created_at: string
  ngay: string | null
  lop: string | null
}
export type TrangThaiMua = 'cho_giao' | 'da_giao' | 'huy'
export type LichSuMua = {
  id: string; ten_qua: string; anh_url: string | null; so_luong: number; xu_tru: number
  trang_thai: TrangThaiMua; created_at: string; giao_luc: string | null
}
export type ViXuCuaToi = { ym: string; so_du: number; lich_su_mua: LichSuMua[]; hoat_dong: HoatDongViXu[] }

export async function viXuCuaToi(ym?: string): Promise<ViXuCuaToi> {
  const { data, error } = await supabase.rpc('fn_hs_vi_xu_cua_toi', { p_ym: ym ?? null })
  if (error) throw error
  return data as ViXuCuaToi
}
