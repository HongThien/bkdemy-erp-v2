// Hòm thư thông báo cho HS (in-app, KHÔNG push OS — app HS chưa có hạ tầng push).
// Nguồn duy nhất hiện tại: fn_chap_nhan_dap_an tự chèn khi TA/GV duyệt "Em nghĩ mình đúng" là ĐÚNG.
import { supabase } from './supabase'

export type ThongBaoHS = {
  id: string
  mon: string
  noi_dung: string
  doc_at: string | null
  created_at: string
}

export async function listThongBaoHS(): Promise<ThongBaoHS[]> {
  const { data, error } = await supabase
    .from('thong_bao_hs')
    .select('id, mon, noi_dung, doc_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return data ?? []
}

export async function docTatCaThongBao(): Promise<void> {
  const { error } = await supabase.from('thong_bao_hs').update({ doc_at: new Date().toISOString() }).is('doc_at', null)
  if (error) throw error
}
