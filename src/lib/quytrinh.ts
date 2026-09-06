// Seam HƯỚNG DẪN / QUY TRÌNH (box "Hướng dẫn" trong Của tôi, CEO 07/09). Nội dung = markdown
// trong bảng quy_trinh (không file) — Đợt 1 chỉ đọc; CEO sẽ đưa nội dung vào dần.
import { supabase } from './supabase'

export type QuyTrinh = {
  id: string; tieu_de: string; tom_tat: string | null; noi_dung: string
  vai_tro: string[]; thu_tu: number; active: boolean; updated_at: string
}

// vaiTro: lọc quy trình áp cho vai trò này (vai_tro rỗng = mọi vai trò).
export async function listQuyTrinh(vaiTro: string): Promise<QuyTrinh[]> {
  const { data, error } = await supabase.from('quy_trinh').select('*').eq('active', true)
    .order('thu_tu').order('tieu_de').limit(200)
  if (error) throw error
  return ((data ?? []) as QuyTrinh[]).filter((q) => !q.vai_tro.length || q.vai_tro.includes(vaiTro))
}
