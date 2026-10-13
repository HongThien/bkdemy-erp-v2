// BẢNG ORDER giữa nhân sự (mig 202610140053): 1 người đặt → 1 người nhận, phản hồi bằng trạng thái.
// Đọc qua PostgREST (RLS: chỉ 2 bên thấy); GHI chỉ qua fn_order_* (cùng transaction ghi order + lịch sử + hòm thư).
import { supabase } from './supabase'

export type TrangThaiOrder = 'moi' | 'ban' | 'dang_lam' | 'xong' | 'tu_choi' | 'huy'
export type OrderRow = {
  id: string; nguoi_dat_id: string; nguoi_nhan_id: string; noi_dung: string; han: string | null
  trang_thai: TrangThaiOrder; created_at: string; updated_at: string
  dat: { ho_ten: string } | null; nhan: { ho_ten: string } | null
}
export type OrderLog = { id: string; order_id: string; nguoi_id: string; trang_thai: TrangThaiOrder; ghi_chu: string | null; created_at: string; nguoi: { ho_ten: string } | null }

export const TEN_TRANG_THAI: Record<TrangThaiOrder, string> = {
  moi: 'Mới đặt', ban: 'Bận, chưa làm được', dang_lam: 'Đang làm', xong: 'Đã xong', tu_choi: 'Không làm được', huy: 'Đã huỷ',
}
/** Order còn "mở" = chưa có kết cục (xong / không làm được / huỷ). */
export const dangMo = (t: TrangThaiOrder) => t === 'moi' || t === 'ban' || t === 'dang_lam'

export async function listOrder(): Promise<OrderRow[]> {
  const { data, error } = await supabase.from('nhan_su_order')
    .select('*, dat:nguoi_dat_id(ho_ten), nhan:nguoi_nhan_id(ho_ten)')
    .order('updated_at', { ascending: false }).limit(300)
  if (error) throw error
  return (data ?? []) as unknown as OrderRow[]
}

export async function listOrderLog(orderId: string): Promise<OrderLog[]> {
  const { data, error } = await supabase.from('nhan_su_order_log')
    .select('*, nguoi:nguoi_id(ho_ten)').eq('order_id', orderId).order('created_at').limit(100)
  if (error) throw error
  return (data ?? []) as unknown as OrderLog[]
}

export async function taoOrder(nguoiNhan: string, noiDung: string, han: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('fn_order_tao', { p_nguoi_nhan: nguoiNhan, p_noi_dung: noiDung, p_han: han })
  if (error) throw error
  return data as string
}

export async function phanHoiOrder(orderId: string, trangThai: TrangThaiOrder, ghiChu: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_order_phan_hoi', { p_order: orderId, p_trang_thai: trangThai, p_ghi_chu: ghiChu })
  if (error) throw error
}
