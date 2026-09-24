// Ca bổ trợ CHUNG theo ĐƠN VỊ (Thùy 24/09, spec-xep-bo-tro-chung.md) — 1 đơn vị = 30' × 1 TA; Đuổi 4 · Bù 4 · Yếu L2 4 · Yếu L1 2.
// Mọi số liệu tính ở DB (mig 202609241100, §2.0); file này chỉ gọi RPC + gõ kiểu.
import { supabase } from './supabase'

export type LoaiBoTro = 'duoi' | 'bu' | 'yeu'
export const LOAI_TEN: Record<LoaiBoTro, string> = { duoi: 'Đuổi', bu: 'Bù', yeu: 'Yếu' }

export type HsTrongCa = {
  bhh_id: string; buoi_hoc_id: string; loai: LoaiBoTro
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  don_vi: number; xac_nhan_ph_at: string | null; diem_danh: string | null
  nguoi_day_tg: string | null; nguoi_day_ten: string | null; chi_tiet: string
}
export type CaBoTro = {
  id: string; lich_truc_id: string | null; ngay: string; gio_bat_dau: string; gio_ket_thuc: string; phut: number
  mon: string; khoi: string | null; phong: string | null; so_ta: number
  nhan_su_id: string | null; nhan_su_ten: string | null; nhan_su_2_id: string | null; nhan_su_2_ten: string | null
  don_vi: number; don_vi_dung: number; don_vi_cho: number; so_hs_xn: number; so_hs_cho: number
  trang_thai: 'mo' | 'huy'; ly_do_huy: string | null; phong_so_ca: number
  hs: HsTrongCa[]
}
export type NgayTomTat = { ngay: string; so_ca: number; don_vi: number; don_vi_dung: number; don_vi_cho: number }
export type UngVien = {
  loai: LoaiBoTro; ref_id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; lop: string | null
  don_vi: number; chi_tiet: string; ta_lop_id: string | null; ta_lop_ten: string | null; ta_dang_truc: boolean
  vua: boolean; ly_do_khong_vua: string | null; da_xep_ngay_khac?: boolean; uu_tien?: number; level?: number
}
export type UngVienCa = {
  ca: { id: string; don_vi: number; don_vi_dung: number; don_vi_cho: number; con: number; so_hs_xn: number; cho_hs: number; phut: number }
  duoi: UngVien[]; bu: UngVien[]; yeu: UngVien[]
}

export async function tomTatNgay(tu: string, den: string): Promise<NgayTomTat[]> {
  const { data, error } = await supabase.rpc('fn_ca_bo_tro_tuan', { p_tu: tu, p_den: den })
  if (error) throw error
  return (data as NgayTomTat[]) ?? []
}
// Mở ngày = sinh ca từ lịch trực (idempotent) rồi đọc.
export async function caCuaNgay(ngay: string): Promise<CaBoTro[]> {
  const { error: e1 } = await supabase.rpc('fn_ca_bo_tro_sinh_ngay', { p_ngay: ngay })
  if (e1) throw e1
  const { data, error } = await supabase.rpc('fn_ca_bo_tro_ngay', { p_ngay: ngay })
  if (error) throw error
  return (data as CaBoTro[]) ?? []
}
export async function ungVienCa(caId: string): Promise<UngVienCa> {
  const { data, error } = await supabase.rpc('fn_ca_bo_tro_ung_vien', { p_ca: caId })
  if (error) throw error
  return data as UngVienCa
}
export async function xepVaoCa(caId: string, u: UngVien): Promise<{ buoi_hoc_id: string; bhh_id: string; don_vi: number; nguoi_day_tg: string | null }> {
  const { data, error } = await supabase.rpc('fn_ca_bo_tro_xep', { p_ca: caId, p_loai: u.loai, p_hoc_sinh: u.hoc_sinh_id, p_ref: u.ref_id })
  if (error) throw error
  return data as any
}
export async function xacNhanPH(bhhId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_ca_bo_tro_xac_nhan', { p_bhh: bhhId })
  if (error) throw error
}
export async function goKhoiCa(bhhId: string, lyDo?: string): Promise<void> {
  const { error } = await supabase.rpc('fn_ca_bo_tro_go', { p_bhh: bhhId, p_ly_do: lyDo ?? null })
  if (error) throw error
}
export async function huyCa(caId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.rpc('fn_ca_bo_tro_huy', { p_ca: caId, p_ly_do: lyDo })
  if (error) throw error
}
export async function taoCaTay(input: { ngay: string; gio_bat_dau: string; gio_ket_thuc: string; mon: string; khoi: string | null; phong: string | null; so_ta: 1 | 2; nhan_su_id: string; nhan_su_2_id: string | null }): Promise<string> {
  const { data, error } = await supabase.rpc('fn_ca_bo_tro_tao', {
    p_ngay: input.ngay, p_gio_bd: input.gio_bat_dau, p_gio_kt: input.gio_ket_thuc, p_mon: input.mon, p_khoi: input.khoi, p_phong: input.phong,
    p_so_ta: input.so_ta, p_ns: input.nhan_su_id, p_ns2: input.nhan_su_2_id,
  })
  if (error) throw error
  return data as string
}
