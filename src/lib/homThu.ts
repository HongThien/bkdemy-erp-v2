// HÒM THƯ nhân sự (mig 202610140053): mọi sự kiện liên quan tới tôi — DB tự đẻ, client chỉ đọc + đánh dấu đã đọc.
import { supabase } from './supabase'

export type LoaiThu = 'order' | 'gay' | 'viec' | 'nhan_xet' | 'he_thong'
export type Thu = {
  id: string; loai: LoaiThu; tieu_de: string; noi_dung: string | null; lien_ket: string | null
  da_doc: boolean; created_at: string; tu: { ho_ten: string } | null
}

export const NHAN_LOAI: Record<LoaiThu, { icon: string; ten: string }> = {
  order: { icon: '📋', ten: 'Order' }, gay: { icon: '🏑', ten: 'Gậy' }, viec: { icon: '🚀', ten: 'Việc' },
  nhan_xet: { icon: '💬', ten: 'Nhận xét' }, he_thong: { icon: '🔔', ten: 'Hệ thống' },
}

export async function listThu(limit = 60): Promise<Thu[]> {
  const { data, error } = await supabase.from('hom_thu')
    .select('id, loai, tieu_de, noi_dung, lien_ket, da_doc, created_at, tu:tu_nhan_su(ho_ten)')
    .order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as unknown as Thu[]
}

/** Số thư chưa đọc — đếm ở DB (head), không kéo về rồi đếm. */
export async function demChuaDoc(): Promise<number> {
  const { count, error } = await supabase.from('hom_thu').select('id', { count: 'exact', head: true }).eq('da_doc', false)
  if (error) throw error
  return count ?? 0
}

export async function danhDauDoc(ids: string[]): Promise<void> {
  if (!ids.length) return
  const { error } = await supabase.from('hom_thu').update({ da_doc: true }).in('id', ids)
  if (error) throw error
}
