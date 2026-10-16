// onthi.ts — Box "Ôn thi giữa kì I" của app HS (Thùy 16/10). Chỉ GỌI RPC (mig 202610161054): HS thấy đề ĐÃ DUYỆT đúng khối của em.
import { supabase } from './supabase'
import type { MenhDe } from './kho/api'

export type TabOnThi = 'de_cuong' | 'de_thi'
export type DeOnThi = { id: string; ten: string; tab: TabOnThi; nguon: string | null; nam: number | null; so_cau: number }
export type CauOnThi = {
  stt: number; ma_cau: string; loai_cau: string | null; noi_dung: string | null
  lua_chon: string[] | null; menh_de: MenhDe[] | null; dap_an: string | null; loi_giai: string | null
  anh_de: string | null; anh_dap_an: string | null
}
export type DeOnThiXem = { id: string; ten: string; phans: { tieu_de: string | null; cau: CauOnThi[] }[] }

export async function onThiDs(mon: string): Promise<DeOnThi[]> {
  const { data, error } = await supabase.rpc('fn_hs_on_thi_ds', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as DeOnThi[]
}
export async function onThiXem(deId: string): Promise<DeOnThiXem | null> {
  const { data, error } = await supabase.rpc('fn_hs_on_thi_xem', { p_de: deId })
  if (error) throw error
  return (data ?? null) as DeOnThiXem | null
}
