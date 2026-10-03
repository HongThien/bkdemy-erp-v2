// Dữ liệu BẢN ĐỒ PHIÊU LƯU (spec-v1-app-hs.md §4.1, hợp đồng §13.4 · mig 202610011520).
// chủ đề = lục địa · chuyên đề = khu vực · dạng = màn đấu · cụm = quái. Trạng thái/quái/biome do Postgres tính — client chỉ vẽ.
import { supabase } from './supabase'

export type QuaiPL = {
  ma: string                 // mã cụm (dạng chưa có cụm ⇒ mã dạng)
  ten: string                // tên cụm (hoặc tên dạng)
  loai_quai: string          // tên loài — khớp tên file hình của style (Đơn 6: slime_la, rong_con…)
  la_boss: boolean           // mỗi khu vực đúng 1 boss = quái cuối của màn khó nhất
}
export type ManPL = {
  ma_dang: string
  ten: string
  thu_tu: number
  muc_do: number | null
  nhanh: string | null       // nhánh kho (null = nhánh gốc môn · 'hinh_gt' · 'hinh_hoc')
  so_cau: number             // số câu luyện được trên app (0 ⇒ chỉ hiện vì em đã có số đo từ bài trên lớp)
  trang_thai: 'chua_do' | 'yeu' | 'dat'   // 3 trạng thái (CLAUDE §5): chưa đo ⇒ sương · yếu ⇒ quái còn máu · đạt ⇒ chinh phục
  muc: string | null         // mức thô của fn_mastery_cells ('dat' / 'can_luyen' / 'yeu'…)
  mastery: number | null     // 0..1, null khi chưa đo
  da_day: boolean            // lớp đã gặp dạng này hoặc em đã có số đo — false ⇒ phủ sương nhưng vẫn vào được
  la_man_boss: boolean
  quai: QuaiPL[]
}
export type KhuVucPL = { ma: string; ten: string; thu_tu: number; man: ManPL[] }
export type LucDiaPL = { ma: string; ten: string; thu_tu: number; biome: string; khu_vuc: KhuVucPL[] }
export type BanDoPL = { mon: string; khoi: string | null; luc_dia: LucDiaPL[] }

export async function banDoPhieuLuu(mon: string): Promise<BanDoPL> {
  const { data, error } = await supabase.rpc('fn_ban_do_phieu_luu', { p_mon: mon })
  if (error) throw error
  return data as BanDoPL
}
