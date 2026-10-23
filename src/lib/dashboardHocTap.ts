// DASHBOARD HỌC TẬP (Thùy 23/10) — kênh quan sát song song với mastery: % trên ≤10 câu gần nhất trong 2–4 tuần, theo
// Chuyên đề / Nhóm bài bản đồ mới. Mọi con số tính ở Postgres (mig 202610231524: fn_dbht_bang, fn_dbht_o_lich_su) — §2.0.
import { supabase } from './supabase'

export type CapDB = 'chuyen_de' | 'nhom'
export type CotDB = { ma: string; ten: string; cha: string | null }
export type ODB = { p: number; n: number }
export type HSDB = { id: string; ten: string; lop_id: string; lop: string; o: Record<string, ODB> }
export type BangDB = { tu: string; cot: CotDB[]; hs: HSDB[] }

export type CauDB = { ma_cau: string | null; dang: string; nhom: string; g: number }
export type LuotDB = {
  ngay: string; kenh: string; dung: number; tong: number; tl_dung: number; tl_tong: number
  dung10: number; tong10: number; p: number; delta: number | null; cau: CauDB[]
}
export type LichSuO = { tu: string; dau_ky: { p: number; n: number } | null; luot: LuotDB[] }

export const TEN_KENH: Record<string, string> = {
  et: 'ET', btvn: 'BTVN', mt: 'MT / Khảo sát', bo_tro_test: 'Test bổ trợ', retest: 'Retest bổ trợ', bu_test: 'Test bù', htd_test: 'Test đuổi',
}

export async function bangDashboardHocTap(mon: string, khoi: string, soTuan: number, cap: CapDB): Promise<BangDB> {
  const { data, error } = await supabase.rpc('fn_dbht_bang', { p_mon: mon, p_khoi: khoi, p_so_tuan: soTuan, p_cap: cap })
  if (error) throw error
  const j = (data ?? {}) as Partial<BangDB>
  return { tu: j.tu ?? '', cot: j.cot ?? [], hs: j.hs ?? [] }
}

export async function lichSuO(hsId: string, mon: string, cap: CapDB, ma: string, soTuan: number): Promise<LichSuO> {
  const { data, error } = await supabase.rpc('fn_dbht_o_lich_su', { p_hs: hsId, p_mon: mon, p_cap: cap, p_ma: ma, p_so_tuan: soTuan })
  if (error) throw error
  const j = (data ?? {}) as Partial<LichSuO>
  return { tu: j.tu ?? '', dau_ky: j.dau_ky ?? null, luot: (j.luot ?? []).map((l) => ({ ...l, cau: l.cau ?? [] })) }
}
