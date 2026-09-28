// ============================================================================
// huyhieu.ts — HUY HIỆU (spec-huy-hieu-build.md, mig 202609281846).
// Đo thành tựu / tháng chuẩn–hoàn hảo / sao / việc trao đều ở Postgres — ở đây chỉ gọi RPC + CRUD dòng đơn bảng ma trận.
// ============================================================================
import { supabase } from './supabase'

const LIMIT = 500

// ── App HS: album ────────────────────────────────────────────────────────────
export type AlbumHuyHieu = {
  key: string; ten: string; bieu_tuong: string; ghi_nhan: string; cau_chuyen: string | null
  n_chuan: number; n_hoan_hao: number; n_chuan_tam: number; sao: number
  dat: { sao: number; lan: number; dat_at: string; thang_chot: string; da_trao: boolean; so_ban_khoi: number }[]
  lich_su: { thang: string; chuan: boolean | null; hoan_hao: boolean | null; da_chot: boolean }[]
  thang_nay: { key: string; ten: string; vai: 'chuan' | 'them'; ket_qua: 'dat' | 'khong_dat' | 'khong_ap_dung' | null }[]
}
export type Album = {
  mon: string; mua: string; thang: string; thang_cuoi: string; si_so_khoi: number
  thang_sao: { sao: number; so_thang: number; loai: 'chuan' | 'hoan_hao'; ban_cung: boolean; exp: number }[]
  huy_hieu: AlbumHuyHieu[]
}
export async function albumCuaToi(mon: string): Promise<Album | null> {
  const { data, error } = await supabase.rpc('fn_hs_album', { p_mon: mon })
  if (error) throw error
  return (data as Album | null) ?? null
}

// ── Nhân sự: việc trao bản cứng · chốt tháng ─────────────────────────────────
export type ViecTrao = { dat_id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; ten_lop: string; mon: string; huy_hieu: string; bieu_tuong: string; sao: number; dat_at: string }
export async function viecTraoCuaToi(): Promise<ViecTrao[]> {
  const { data, error } = await supabase.rpc('fn_huy_hieu_viec_trao')
  if (error) throw error
  return (data ?? []) as ViecTrao[]
}
export async function daTrao(datId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_huy_hieu_trao', { p_dat_id: datId })
  if (error) throw error
}
export async function chotHuyHieuThang(mon: string, ym: string): Promise<{ dong_thanh_tuu: number; sao_moi: number }> {
  const { data, error } = await supabase.rpc('fn_huy_hieu_chot_thang', { p_mon: mon, p_ym: ym })
  if (error) throw error
  return data as { dong_thanh_tuu: number; sao_moi: number }
}
// Tháng đã chốt + số em + số sao mới (đếm ở DB).
export type ThangChot = { thang: string; so_em: number; sao_moi: number; chot_at: string }
export async function thangDaChot(mon: string): Promise<ThangChot[]> {
  const { data, error } = await supabase.rpc('fn_huy_hieu_thang_da_chot', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as ThangChot[]
}

// ── Ma trận thành tựu × huy hiệu (CRUD dòng đơn bảng nối) ─────────────────────
export type ThanhTuu = { key: string; ten: string; loai_chi_so: string; tham_so: Record<string, unknown>; mo_tu: string | null; thu_tu: number }
export type HuyHieu = { key: string; ten: string; bieu_tuong: string; ghi_nhan: string; thu_tu: number }
export type DieuKien = { huy_hieu_key: string; thanh_tuu_key: string; vai: 'chuan' | 'them' }
export async function maTran(mon: string): Promise<{ tt: ThanhTuu[]; hh: HuyHieu[]; dk: DieuKien[] }> {
  const [a, b, c] = await Promise.all([
    supabase.from('thanh_tuu').select('key, ten, loai_chi_so, tham_so, mo_tu, thu_tu').eq('mon', mon).eq('active', true).order('thu_tu').limit(LIMIT),
    supabase.from('huy_hieu').select('key, ten, bieu_tuong, ghi_nhan, thu_tu').eq('mon', mon).eq('active', true).order('thu_tu').limit(LIMIT),
    supabase.from('huy_hieu_dieu_kien').select('huy_hieu_key, thanh_tuu_key, vai').eq('mon', mon).limit(LIMIT),
  ])
  for (const r of [a, b, c]) if (r.error) throw r.error
  return { tt: (a.data ?? []) as ThanhTuu[], hh: (b.data ?? []) as HuyHieu[], dk: (c.data ?? []) as DieuKien[] }
}
export async function datOMaTran(mon: string, hh: string, tt: string, vai: 'chuan' | 'them' | null): Promise<void> {
  if (vai === null) {
    const { error } = await supabase.from('huy_hieu_dieu_kien').delete().eq('mon', mon).eq('huy_hieu_key', hh).eq('thanh_tuu_key', tt)
    if (error) throw error
    return
  }
  const { error } = await supabase.from('huy_hieu_dieu_kien').upsert({ mon, huy_hieu_key: hh, thanh_tuu_key: tt, vai }, { onConflict: 'mon,huy_hieu_key,thanh_tuu_key' })
  if (error) throw error
}
