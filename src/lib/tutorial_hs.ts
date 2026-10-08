// Tiến độ tutorial (Lộc dẫn) THEO TÀI KHOẢN HS — nguồn Postgres (hs_tutorial, mig 202610081121). Chặng chưa có dòng = chưa nói với em.
import { supabase } from './supabase'

export async function tutorialDaXem(): Promise<Set<string>> {
  const { data, error } = await supabase.rpc('fn_hs_tutorial_cua_toi')
  if (error) throw error
  return new Set((data ?? []) as string[])
}
/** kieu 'xem' = em xem hết chặng · 'bo_qua' = bấm Bỏ qua (không nhắc lại). Idempotent; 'xem' thắng 'bo_qua'. */
export async function tutorialGhi(chuong: string[], kieu: 'xem' | 'bo_qua'): Promise<void> {
  if (!chuong.length) return
  const { error } = await supabase.rpc('fn_hs_tutorial_ghi', { p_chuong: chuong, p_kieu: kieu })
  if (error) throw error
}
