// "⏭ Để sau" ở mọi màn duyệt kho (Thùy 20/10): mục chưa muốn quyết ⇒ xuống CUỐI hàng đợi. Lưu ở DB (mig 202610201639),
// dùng chung cả team: fn_kho_de_sau_ds (lần bấm gần nhất của từng mục) · fn_kho_de_sau_ghi. Khoá = (loại, môn, mã) như nhận xét.
import { supabase } from '../supabase'
import { khoaNX, type DoiTuongNX, type MonNX } from './nhanXet'

// 'bdm_khop' = hàng Bản đồ mới › Duyệt kho (khớp câu ↔ dạng bài) — khác hàng duyệt nội dung câu dù cùng mã câu (mig 202610201646)
export type DoiTuongDS = DoiTuongNX | 'bdm_khop'

export async function deSauDs(doiTuong: DoiTuongDS, mon?: MonNX): Promise<Map<string, string>> {
  const { data, error } = await supabase.rpc('fn_kho_de_sau_ds', { p_doi_tuong: doiTuong, p_mon: mon ?? null })
  if (error) throw error
  return new Map(((data ?? []) as { mon: string; ma: string; at: string }[]).map((r) => [khoaNX(r.mon, r.ma), r.at]))
}

export async function ghiDeSau(doiTuong: DoiTuongDS, mon: MonNX, ma: string, man: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_kho_de_sau_ghi', { p_doi_tuong: doiTuong, p_mon: mon, p_ma: ma, p_man: man })
  if (error) throw error
  return data as string
}
