// BÁO CÁO HỌC KÌ gửi phụ huynh (spec-bao-cao-ky.md, Thùy chốt 04/11) — data-layer.
// Mọi con số tính ở DB (fn_bc_ky_tinh — mig 202611041652); đã công bố thì đọc SNAPSHOT (fn_bc_ky_xem), không tính lại.
// Client chỉ: list kì, CRUD dòng nhập (điểm dự đoán · sai số · nhận xét), gọi RPC công bố / mở lại.
import { supabase } from './supabase'

export type KyHoc = { id: string; ten: string; tu_thang: string; den_thang: string }

export type BcKyDonVi = { ma: string; ten: string; chu_de?: string | null; p: number | null; n: number; n_toi_da: number }
export type BcKyLanThi = { loai: 'mt_sat_hach' | 'khao_sat_thang'; nhan: string; thang: string; ngay: string; diem: number; tb: number; chenh: number; n_mau: number; hang: number }
// Khuôn jsonb của fn_bc_ky_tinh = cũng là snapshot lúc công bố (tự đủ để dựng app PH / PDF).
export type BcKyData = {
  phien_ban: number; tinh_luc: string; cong_bo_at?: string
  hs: { id: string; ho_ten: string; ma_hs: string | null }
  lop: { id: string | null; ten: string | null; khoi: string | null }
  mon: string; gv: string | null
  ky: KyHoc
  cua_so_hoan_thanh: { tu: string; den: string; n_chu_de: number; n_chuyen_de: number }
  nang_luc: { diem: number | null; sai_so: number | null }
  nhan_xet: string | null
  hoan_thanh: { chu_de: BcKyDonVi[]; chuyen_de: BcKyDonVi[] }
  thi: BcKyLanThi[]
  hang_ky: { hang: number; tong: number; tb: number; so_lan: number; top_pct: number } | null
  tong_thi: { tb_em: number; tb_lan: number; chenh: number } | null
  chuyen_can: { vang: number; vang_phep: number; co_mat: number; tong: number } | null
}
export type BcKyXem = { cong_bo_at: string | null; du_lieu: BcKyData }
export type BcKyNhap = { diem_du_doan: number | null; sai_so: number | null; nhan_xet: string | null; cong_bo_at: string | null }
export const BC_KY_NHAP_TRONG: BcKyNhap = { diem_du_doan: null, sai_so: null, nhan_xet: null, cong_bo_at: null }

export async function listKyHoc(): Promise<KyHoc[]> {
  const { data, error } = await supabase.from('ky_hoc').select('id, ten, tu_thang, den_thang').order('tu_thang', { ascending: false }).limit(50)
  if (error) throw error
  return (data ?? []) as KyHoc[]
}
// Chỉ admin hệ thống tạo được (RLS ky_hoc_them) — người khác nhận lỗi từ DB.
export async function themKyHoc(ten: string, tu_thang: string, den_thang: string): Promise<KyHoc> {
  const { data, error } = await supabase.from('ky_hoc').insert({ ten, tu_thang, den_thang }).select('id, ten, tu_thang, den_thang').single()
  if (error) throw error
  return data as KyHoc
}

export async function xemBcKy(hsId: string, mon: string, kyId: string): Promise<BcKyXem> {
  const { data, error } = await supabase.rpc('fn_bc_ky_xem', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as BcKyXem
}
export async function getBcKyNhap(hsId: string, mon: string, kyId: string): Promise<BcKyNhap> {
  const { data, error } = await supabase.from('bao_cao_ph_ky').select('diem_du_doan, sai_so, nhan_xet, cong_bo_at')
    .eq('hoc_sinh_id', hsId).eq('mon', mon).eq('ky_id', kyId).maybeSingle()
  if (error) throw error
  return (data as BcKyNhap) ?? { ...BC_KY_NHAP_TRONG }
}
export async function luuBcKyNhap(hsId: string, mon: string, kyId: string, patch: Partial<Pick<BcKyNhap, 'diem_du_doan' | 'sai_so' | 'nhan_xet'>>): Promise<void> {
  const { error } = await supabase.from('bao_cao_ph_ky').upsert({ hoc_sinh_id: hsId, mon, ky_id: kyId, ...patch }, { onConflict: 'hoc_sinh_id,mon,ky_id' })
  if (error) throw error
}
export async function congBoBcKy(hsId: string, mon: string, kyId: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_bc_ky_cong_bo', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as string
}
export async function moLaiBcKy(hsId: string, mon: string, kyId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_bc_ky_mo_lai', { p_hs: hsId, p_mon: mon, p_ky: kyId })
  if (error) throw error
}
// Công bố cả lớp trong 1 transaction ở DB — chỉ em đã nhập đủ điểm dự đoán + sai số + nhận xét.
export async function congBoLopBcKy(lopId: string, mon: string, kyId: string): Promise<{ cong_bo: number; bo_qua: number }> {
  const { data, error } = await supabase.rpc('fn_bc_ky_cong_bo_lop', { p_lop: lopId, p_mon: mon, p_ky: kyId })
  if (error) throw error
  return data as { cong_bo: number; bo_qua: number }
}
// Trạng thái cả lớp cho cột trái: đã công bố / đang nhập (có dòng) — không dòng = chưa nhập gì.
export async function listBcKyTrangThai(hsIds: string[], mon: string, kyId: string): Promise<Record<string, 'cong_bo' | 'nhap'>> {
  if (!hsIds.length) return {}
  const { data, error } = await supabase.from('bao_cao_ph_ky').select('hoc_sinh_id, cong_bo_at')
    .eq('mon', mon).eq('ky_id', kyId).in('hoc_sinh_id', hsIds).limit(500)
  if (error) throw error
  const out: Record<string, 'cong_bo' | 'nhap'> = {}
  for (const r of (data ?? []) as { hoc_sinh_id: string; cong_bo_at: string | null }[]) out[r.hoc_sinh_id] = r.cong_bo_at ? 'cong_bo' : 'nhap'
  return out
}
