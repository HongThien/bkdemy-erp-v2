// QUY TRÌNH HỌC SINH MỚI (Thùy 27/10) — Ops làm checklist cho mỗi HS mới, bảng theo dõi PH–HS × bước.
// Mọi phép đếm/suy (ngày nhập học hiệu lực, > 4 tuần = mặc định full, full/chưa full) ở Postgres
// (`fn_hs_moi_*`, mig 202610271810). File này CHỈ gọi RPC + CRUD dòng đơn danh mục bước.
import { supabase } from './supabase'

export type BuocHsMoi = { id: string; ten: string; mo_ta: string | null; mau: string; thu_tu: number }
export type DongHsMoi = {
  hs_id: string; ma_hs: string | null; ho_ten: string; khoi: string | null
  ph_ten: string | null; ph_sdt: string | null
  ngay_nhap_hoc: string | null; so_ngay: number | null
  qua_4_tuan: boolean; xong: string[]; so_xong: number; tong: number; full: boolean
}
export type DashboardHsMoi = { buoc: BuocHsMoi[]; khoi: string[]; rows: DongHsMoi[]; so_dong: number }

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw new Error(error.message)
  return data as T
}

// soTuan null = mọi HS đang học (kể cả > 4 tuần, mặc định full).
export const dashboardHsMoi = (soTuan: number | null, khoi: string | null, chiChuaFull: boolean) =>
  rpc<DashboardHsMoi>('fn_hs_moi_dashboard', { p_so_tuan: soTuan, p_khoi: khoi, p_chi_chua_full: chiChuaFull })

// Trả về dòng đã tính lại ⇒ màn vá đúng dòng đó.
export const tickHsMoi = (hs: string, buoc: string, xong: boolean) =>
  rpc<DongHsMoi>('fn_hs_moi_tick', { p_hs: hs, p_buoc: buoc, p_xong: xong })

export async function listBuoc(): Promise<BuocHsMoi[]> {
  const { data, error } = await supabase.from('hs_moi_buoc').select('id, ten, mo_ta, mau, thu_tu')
    .is('xoa_at', null).order('thu_tu').order('created_at').limit(200)
  if (error) throw new Error(error.message)
  return data as BuocHsMoi[]
}

export async function themBuoc(ten: string, mau: string, thuTu: number): Promise<BuocHsMoi> {
  const { data, error } = await supabase.from('hs_moi_buoc').insert({ ten, mau, thu_tu: thuTu })
    .select('id, ten, mo_ta, mau, thu_tu').single()
  if (error) throw new Error(error.message)
  return data as BuocHsMoi
}

export async function suaBuoc(id: string, patch: Partial<Pick<BuocHsMoi, 'ten' | 'mo_ta' | 'mau' | 'thu_tu'>>): Promise<void> {
  const { error } = await supabase.from('hs_moi_buoc').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

// Bỏ bước khỏi checklist = đưa vào kho rác (tick cũ vẫn giữ, chỉ không còn là cột).
export async function boBuoc(id: string): Promise<void> {
  const { error } = await supabase.from('hs_moi_buoc').update({ xoa_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(error.message)
}
