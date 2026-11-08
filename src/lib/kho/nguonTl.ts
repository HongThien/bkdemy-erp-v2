// Nguồn tài liệu của câu (Đề thi · Đề cương · Sách <tác giả> · Kho cũ) — tính ở DB (_kho_nguon_cau, mig 202610271607).
import { supabase } from '../supabase'

/** Nguồn của một lô mã câu (≤ ~400 mã/lần để URL/payload gọn). */
export async function nguonCauDs(ma: string[]): Promise<Map<string, string[]>> {
  if (!ma.length) return new Map()
  const { data, error } = await supabase.rpc('fn_kho_nguon_cau_ds', { p_ma: ma })
  if (error) throw new Error(error.message)
  return new Map(((data ?? []) as { ma_cau: string; nguon: string[] }[]).map((r) => [r.ma_cau, r.nguon ?? ['kho_cu']]))
}
