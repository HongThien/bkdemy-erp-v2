// Nông trại BK — lưu tiến độ THEO TÀI KHOẢN HS (mig 202610121630). App giữ phiên đăng nhập; game (iframe) chỉ nói chuyện bằng postMessage.
// state do game gửi (client) — bước này chống MẤT/LẪN tiến độ, KHÔNG chống gian lận (luật kinh tế server = bước sau).
import { supabase } from './supabase'

export type NtLuuDoc = { state: Record<string, unknown>; cap_nhat: string } | null
export type NtLuuGhi = { ok: boolean; cap_nhat?: string | null; state?: Record<string, unknown> | null; gio_ms?: number }
// Nhịp giờ chơi (mig 202610121631): server tự đo giờ liên tục giữa các nhịp; gio_ms = giờ server (epoch ms) để game đồng bộ đồng hồ.
export type NtNhip = { gio_ms: number; ngay: string; bat: boolean; da_choi_giay: number; gioi_han_giay: number | null; con_lai_giay: number | null; het: boolean; dht_so_du: number; dht_da_tieu: number | null }
// Điểm học tập (mig 202610121645): game gửi TỔNG điểm đã tiêu (bộ đếm tích luỹ) ⇒ server trừ phần chênh vào ví ĐHT. ok=false + loi='khong_du' ⇒ không đủ điểm, không ghi.
export type NtDht = { ok: boolean; loi?: string; moc?: boolean; so_du: number; da_tieu: number; can?: number }

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
// Xu thật (mig 202610121655): game báo (tháng_k, ra) = xu đã đổi từ EXP trong tháng (tích luỹ); server cắt theo ngày chơi + trần tháng rồi ghi ví.
export type NtXu = { ok: boolean; loi?: string; da_nhan?: number; nhan_them?: number; tran_thang?: number; xu_moi_ngay?: number; ngay_choi?: number; duoc_toi_nay?: number }
export async function ntXuDongBo(thangK: number, ra: number): Promise<NtXu> {
  const { data, error } = await supabase.rpc('fn_nt_xu_dong_bo', { p_thang_k: Math.floor(thangK), p_ra: Math.max(0, Math.floor(ra)) })
  if (error) throw error
  return data as NtXu
}
export async function ntDhtDongBo(tongTieu: number): Promise<NtDht> {
  const { data, error } = await supabase.rpc('fn_nt_dht_dong_bo', { p_tong_tieu: Math.max(0, Math.floor(tongTieu)) })
  if (error) throw error
  return data as NtDht
}
