// Nông trại BK — lưu tiến độ THEO TÀI KHOẢN HS (mig 202610121630). App giữ phiên đăng nhập; game (iframe) chỉ nói chuyện bằng postMessage.
// state do game gửi (client) — bước này chống MẤT/LẪN tiến độ, KHÔNG chống gian lận (luật kinh tế server = bước sau).
import { supabase } from './supabase'

export type NtLuuDoc = { state: Record<string, unknown>; cap_nhat: string } | null
export type NtLuuGhi = { ok: boolean; cap_nhat?: string | null; state?: Record<string, unknown> | null; gio_ms?: number }
// Nhịp giờ chơi (mig 202610121631): server tự đo giờ liên tục giữa các nhịp; gio_ms = giờ server (epoch ms) để game đồng bộ đồng hồ.
export type NtNhip = { gio_ms: number; ngay: string; bat: boolean; da_choi_giay: number; gioi_han_giay: number | null; con_lai_giay: number | null; het: boolean }

export async function ntLuuDoc(): Promise<NtLuuDoc> {
  const { data, error } = await supabase.rpc('fn_nt_luu_doc')
  if (error) throw error
  return (data as NtLuuDoc) ?? null
}
export async function ntNhip(): Promise<NtNhip> {
  const { data, error } = await supabase.rpc('fn_nt_nhip')
  if (error) throw error
  return data as NtNhip
}
export async function ntLuuGhi(state: Record<string, unknown>, capNhat: string | null): Promise<NtLuuGhi> {
  const { data, error } = await supabase.rpc('fn_nt_luu_ghi', { p_state: state, p_cap_nhat: capNhat })
  if (error) throw error
  return data as NtLuuGhi
}
