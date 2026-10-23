// ĐÁNH GIÁ CUỐI CẤP (Thùy 23/10, spec-danh-gia-cuoi-cap.md) — đo theo LẦN làm bài, xu hướng TB ngắn so với TB dài,
// theo tầng Chủ đề / Chuyên đề / Nhóm bài. Mọi con số tính ở Postgres (mig 202610231549: fn_dgcc_lop, fn_dgcc_lan_nut) — §2.0.
import { supabase } from './supabase'
import { TEN_KENH as KENH_DBHT } from './dashboardHocTap'

export type TangCC = 'chu_de' | 'chuyen_de' | 'nhom'
export type XuHuong = 'tang_ro' | 'tang_nhe' | 'di_ngang' | 'giam_nhe' | 'giam_ro' | 'chua_du'
export type OCC = {
  hoc_sinh_id: string; ho_ten: string; tang: TangCC; nut: string; cha: string | null; ten: string | null; thu_tu: number | null
  so_lan: number; cua_so_ngan: number; cua_so_dai: number; tb_ngan: number; tb_dai: number; chenh: number | null
  xu_huong: XuHuong; lan_cuoi: string
}
export type LanCC = { stt: number; ngay: string; kenh: string; so_cau: number; diem: number; ti_le: number; trong_ngan: boolean; trong_dai: boolean }

export const TEN_KENH: Record<string, string> = { ...KENH_DBHT, mt: 'MT', khao_sat: 'Khảo sát' }

export const XU_HUONG: Record<XuHuong, { ky: string; ten: string; mau: string }> = {
  tang_ro: { ky: '↑↑', ten: 'tăng rõ', mau: 'text-emerald-700' },
  tang_nhe: { ky: '↑', ten: 'tăng nhẹ', mau: 'text-emerald-600' },
  di_ngang: { ky: '→', ten: 'đi ngang', mau: 'text-slate-500' },
  giam_nhe: { ky: '↓', ten: 'giảm nhẹ', mau: 'text-rose-600' },
  giam_ro: { ky: '↓↓', ten: 'giảm rõ', mau: 'text-rose-700' },
  chua_du: { ky: '·', ten: 'chưa đủ lần', mau: 'text-slate-300' },
}

const num = (v: unknown) => (v == null ? null : Number(v))

// Khối áp dụng lấy từ DB (_dgcc_tham_so) — một nguồn duy nhất cho phạm vi.
export async function khoiCuoiCap(): Promise<string[]> {
  const { data, error } = await supabase.rpc('_dgcc_tham_so')
  if (error) throw error
  return ((data ?? []) as { khoi: string[] }[])[0]?.khoi ?? []
}

// Ngưỡng xu hướng theo tầng (_dgcc_nguong) — chỉ để ghi chú dưới bảng, nhãn đã tính ở DB.
export async function nguongTang(): Promise<Record<string, { nhe: number; ro: number }>> {
  const { data, error } = await supabase.rpc('_dgcc_nguong')
  if (error) throw error
  return Object.fromEntries(((data ?? []) as { tang: string; nhe: number; ro: number }[]).map((r) => [r.tang, { nhe: Number(r.nhe), ro: Number(r.ro) }]))
}

export async function bangLop(lopId: string, tang: TangCC): Promise<OCC[]> {
  const { data, error } = await supabase.rpc('fn_dgcc_lop', { p_lop: lopId, p_tang: tang }).limit(20000)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({
    ...r, thu_tu: num(r.thu_tu), so_lan: Number(r.so_lan), cua_so_ngan: Number(r.cua_so_ngan), cua_so_dai: Number(r.cua_so_dai),
    tb_ngan: Number(r.tb_ngan), tb_dai: Number(r.tb_dai), chenh: num(r.chenh),
  }))
}

export async function cacLan(hsId: string, tang: TangCC, nut: string, cha: string | null, mon: string): Promise<LanCC[]> {
  const { data, error } = await supabase.rpc('fn_dgcc_lan_nut', { p_hs: hsId, p_tang: tang, p_nut: nut, p_cha: cha, p_mon: mon }).limit(1000)
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({ ...r, so_cau: Number(r.so_cau), diem: Number(r.diem), ti_le: Number(r.ti_le) }))
}
