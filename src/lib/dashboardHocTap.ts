// DASHBOARD HỌC TẬP (Thùy 23/10) — kênh quan sát song song với mastery: % = TB ≤5 LẦN gần nhất (Thùy 10/11, thay 10 câu) trong 2–4 tuần, theo
// Chuyên đề / Nhóm bài bản đồ mới. Mọi con số tính ở Postgres (mig 202610231524: fn_dbht_bang, fn_dbht_o_lich_su) — §2.0.
import { supabase } from './supabase'

// Hình: cột riêng theo cây Hình (mã 'H:…'); tầng nào câu Hình chưa có thì dồn vào cột 'HINH'
export type CapDB = 'chu_de' | 'chuyen_de' | 'nhom'
export type CotDB = { ma: string; ten: string; cha: string | null }
// d = % hiện tại − mốc (đầu kỳ; dk=false ⇒ mốc là % sau lượt đầu trong cửa sổ); null = chưa đủ để nói xu hướng
export type ODB = { p: number; n: number; d: number | null; dk: boolean; muc?: 'dat' | 'can_luyen' | 'yeu'; tin?: 'cao' | 'tb' | 'thap' }
// 10/11: nhom_yeu (mastery theo lần) là chính · dang_yeu (bảng chụp) đi kèm · bao_dong 30 ngày · bt = trạng thái bổ trợ (đề xuất đang sống / case mở)
export type HSDB = {
  id: string; ten: string; lop_id: string; lop: string; o: Record<string, ODB>
  nhom_yeu?: number | null; dang_yeu?: number | null
  bao_dong?: { so: number; at: string; ghi_chu: string } | null
  bt?: { id: string; tt: 'nhap' | 'cho_duyet' | 'tra_lai' | 'dang_bo_tro' } | null
}
export type BangDB = { tu: string | null; tinh_at?: string | null; co_do?: boolean; cot: CotDB[]; hs: HSDB[] }   // co_do = môn đã đo theo bản đồ mới (DB quyết, mig 202611131522)

export type CauDB = { ma_cau: string | null; dang: string; nhom: string; g: number }
export type LuotDB = {
  ngay: string; kenh: string; dung: number; tong: number
  // 1 lượt = 1 LẦN (bài làm). p = TB ≤5 lần gần nhất tới lần này · p_luot = % lần này · delta = p_luot − p_truoc (p ngay trước; lần đầu = đầu kỳ)
  so_lan5: number; p: number; p_luot: number; p_truoc: number | null; delta: number | null; cau: CauDB[]
}
// Thùy 10/11: lịch sử chỉ 1 tháng; co_cu = còn lần cũ hơn ⇒ nút "Xem thêm" gọi lại với soNgay + 30 (DB mới đọc thêm lúc đó)
export type LichSuO = { tu: string; dau_ky: { p: number; n: number } | null; luot: LuotDB[]; so_ngay: number; co_cu: boolean }

export const TEN_KENH: Record<string, string> = {
  et: 'ET', btvn: 'BTVN', mt: 'MT / Khảo sát', bo_tro_test: 'Test bổ trợ', bt: 'Phiếu bổ trợ', tu_luyen: 'Tự luyện', retest: 'Retest bổ trợ', bu_test: 'Test bù', htd_test: 'Test đuổi',
}

export async function bangDashboardHocTap(mon: string, khoi: string, soTuan: number, cap: CapDB): Promise<BangDB> {
  const { data, error } = await supabase.rpc('fn_dbht_bang', { p_mon: mon, p_khoi: khoi, p_so_tuan: soTuan, p_cap: cap })
  if (error) throw error
  const j = (data ?? {}) as Partial<BangDB>
  return { tu: j.tu ?? null, tinh_at: j.tinh_at ?? null, co_do: j.co_do ?? true, cot: j.cot ?? [], hs: j.hs ?? [] }
}

export async function lichSuO(hsId: string, mon: string, cap: CapDB, ma: string, soNgay = 30): Promise<LichSuO> {
  const { data, error } = await supabase.rpc('fn_dbht_o_lich_su', { p_hs: hsId, p_mon: mon, p_cap: cap, p_ma: ma, p_so_ngay: soNgay })
  if (error) throw error
  const j = (data ?? {}) as Partial<LichSuO>
  return { tu: j.tu ?? '', dau_ky: j.dau_ky ?? null, luot: (j.luot ?? []).map((l) => ({ ...l, cau: l.cau ?? [] })), so_ngay: j.so_ngay ?? soNgay, co_cu: !!j.co_cu }
}
