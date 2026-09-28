// Giao diện app HS lớp 9–12 (mig 202609281346, spec-giao-dien-hs.md). Chỉ gọi RPC — mọi tính toán ở Postgres.
import { supabase } from './supabase'
import type { GiaoDien } from '../screens/hocsinh/skin/registry'

// null = HS CHƯA có dòng hs_giao_dien ⇒ chưa xem hướng dẫn lần đầu (và đang dùng skin mặc định).
export async function giaoDienCuaToi(): Promise<GiaoDien | null> {
  const { data, error } = await supabase.rpc('fn_hs_giao_dien_cua_toi')
  if (error) throw error
  return (data as GiaoDien | null) ?? null
}

// Tạo/đổi — trigger ở DB tự ghi log (actor + ts + cũ/mới). Lần gọi đầu = xong hướng dẫn lần đầu.
export async function luuGiaoDien(g: GiaoDien): Promise<GiaoDien> {
  const { data, error } = await supabase.rpc('fn_hs_luu_giao_dien', { p_skin: g.skin, p_che_do: g.che_do, p_hinh_nen: g.hinh_nen })
  if (error) throw error
  return data as GiaoDien
}

export type EloMon = { mon: string; elo: number; hang?: number; so_hs?: number }
export type KyThiSapToi = { ten: string; ngay: string; con_ngay: number }
export type Home912 = { elo: EloMon[]; thi: KyThiSapToi[] }

// Elo từng môn + hạng trong lớp + ≤2 kỳ thi lớn sắp tới của khối (bảng lich_thi_lon, trung tâm nhập).
export async function home912(): Promise<Home912> {
  const { data, error } = await supabase.rpc('fn_hs_home_912')
  if (error) throw error
  const d = (data ?? {}) as Partial<Home912>
  return { elo: d.elo ?? [], thi: d.thi ?? [] }
}
