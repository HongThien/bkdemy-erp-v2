// ============================================================================
// bxh.ts — BẢNG XẾP HẠNG app HS (Thùy duyệt 06/10; spec-bang-xep-hang.md, mig 202610070954).
// Mọi thứ hạng tính ở Postgres (fn_bxh): top 20 + hạng riêng tư của chính em; danh mục bảng ở bxh_loai. Ở đây chỉ gọi RPC.
// ============================================================================
import { supabase } from './supabase'

export type BxhNhom = 'hoc_tap' | 'ket_qua_lop' | 'game' | 'suu_tap'
export type BxhKy = 'hom_nay' | 'tuan' | 'thang' | 'mua' | 'hien_tai'
export type BxhPhamVi = 'khoi' | 'toan_bk'
export type BxhLoai = {
  ma: string; nhom: BxhNhom; ten: string; mo_ta: string; don_vi: string; gan_mon: boolean
  ky_cho_phep: BxhKy[]; ky_mac_dinh: BxhKy; san_sang: boolean; ghi_chu: string | null
}
export type BxhDong = { hang: number; ten: string; ma_hs: string | null; lop: string | null; gia_tri: number; la_toi: boolean }
export type BxhKetQua =
  | { ma: string; ten: string; san_sang: false; ghi_chu: string }
  | {
      ma: string; ten: string; san_sang: true; don_vi: string; ky: BxhKy; pham_vi: BxhPhamVi; khoi: string | null
      tong: number; top: BxhDong[]; toi: { hang: number; gia_tri: number } | null
    }

export async function bxhDanhMuc(): Promise<BxhLoai[]> {
  const { data, error } = await supabase.rpc('fn_bxh_danh_muc')
  if (error) throw error
  return (data as BxhLoai[]) ?? []
}
export async function bxhXem(loai: string, mon: string, phamVi: BxhPhamVi, ky: BxhKy): Promise<BxhKetQua> {
  const { data, error } = await supabase.rpc('fn_bxh', { p_loai: loai, p_mon: mon, p_pham_vi: phamVi, p_ky: ky })
  if (error) throw error
  return data as BxhKetQua
}
