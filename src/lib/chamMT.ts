// CHẤM MT (Thùy 08/10) — mọi con số (tiến độ, điểm tính từ câu, khung CB/NC) tính ở Postgres (§2.0):
// migration 202610081051_mt_diem_tu_cham_cau. Client chỉ gọi hàm sẵn + hiển thị.
import { supabase } from './supabase'

export type MTBuoiCham = { buoi_id: string; ngay: string; ten: string; loai_de: string | null; dong: boolean; so_hs: number; so_hs_xong: number; khoi?: string | null; de_id?: string }
export type MTHSCham = {
  hoc_sinh_id: string; ho_ten: string; diem_danh: string | null
  so_cau: number; so_cham: number; so_thieu_diem: number
  tinh_co_ban: number; tinh_nang_cao: number; khung_co_ban: number | null; khung_nang_cao: number | null
  nguon: 'tay' | 'cau' | null; diem_co_ban: number | null; diem_nang_cao: number | null; diem: number | null; full_diem: boolean
  tl_co_ban: number | null; tl_nang_cao: number | null; full_thi_lai: boolean; diem_thi_lai: number | null
  lop_id: string | null; ten_lop: string | null // lớp hiện tại của em trong môn (kỳ khảo sát chung cần để lọc)
}
const so = (v: unknown): number | null => (v == null ? null : Number(v))

export async function dsBuoiChamMT(lopId: string): Promise<MTBuoiCham[]> {
  const { data, error } = await supabase.rpc('fn_mt_cham_ds_buoi', { p_lop: lopId })
  if (error) throw error
  return (data ?? []) as MTBuoiCham[]
}
export async function dsHSChamMT(buoiId: string): Promise<MTHSCham[]> {
  const { data, error } = await supabase.rpc('fn_mt_cham_hs_v2', { p_buoi: buoiId })
  if (error) throw error
  return ((data ?? []) as any[]).map((r) => ({
    ...r,
    tinh_co_ban: Number(r.tinh_co_ban ?? 0), tinh_nang_cao: Number(r.tinh_nang_cao ?? 0),
    khung_co_ban: so(r.khung_co_ban), khung_nang_cao: so(r.khung_nang_cao), diem_co_ban: so(r.diem_co_ban), diem_nang_cao: so(r.diem_nang_cao),
    diem: so(r.diem), tl_co_ban: so(r.tl_co_ban), tl_nang_cao: so(r.tl_nang_cao), diem_thi_lai: so(r.diem_thi_lai),
  })) as MTHSCham[]
}
// 23/10: kỳ KHẢO SÁT CHUNG của môn (không theo lớp) — cùng cột với dsBuoiChamMT + khối/đề.
export async function dsKyKhaoSat(mon: string): Promise<MTBuoiCham[]> {
  const { data, error } = await supabase.rpc('fn_ks_ds_ky', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as MTBuoiCham[]
}
// Chấm cả bài 1 HS cùng Đ/C/S (sửa riêng câu lệch sau) — 1 lệnh DB, điểm từng câu do trigger đặt.
export async function chamCaBaiMT(buoiId: string, hsId: string, result: 'correct' | 'partial' | 'wrong'): Promise<number> {
  const { data, error } = await supabase.rpc('fn_mt_cham_ca_hs', { p_buoi: buoiId, p_hs: hsId, p_result: result })
  if (error) throw error
  return Number(data ?? 0)
}
// Full (10đ) + điểm thi lại của 1 HS. Điểm chính Cơ bản/Nâng cao KHÔNG nhập tay — tự cộng từ câu.
export async function luuTongMT(buoiId: string, hsId: string, p: { full: boolean; tlCoBan: number | null; tlNangCao: number | null; fullThiLai: boolean }): Promise<void> {
  const { error } = await supabase.rpc('fn_mt_luu_tong', { p_buoi: buoiId, p_hs: hsId, p_full: p.full, p_tl_cb: p.tlCoBan, p_tl_nc: p.tlNangCao, p_full_tl: p.fullThiLai })
  if (error) throw error
}
// Bỏ điểm nhập tay (trước 08/10) ⇒ dùng điểm cộng từ câu.
export async function dungDiemTuCauMT(buoiId: string, hsId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_mt_dung_diem_cau', { p_buoi: buoiId, p_hs: hsId })
  if (error) throw error
}

// ── DASHBOARD KẾT QUẢ THEO CHUYÊN ĐỀ của 1 đề MT/khảo sát (Thùy 23/10) — mig 202610231416, số tính ở DB. ──
export type DeDaThi = { de_id: string; ten: string; khoi: string | null; loai_de: string | null; ngay_moi: string; so_lop: number }
export type BangCDCot = { ma: string; ten: string; nang_cao?: boolean } // nang_cao: luật CEO 23/10 — chủ đề "thực tế" là Nâng cao
export type BangCDHS = { id: string; ten: string; lop_id: string; lop: string; diem: number | null; hang: number | null; o: Record<string, number> }
export type BangCD = { cot: BangCDCot[]; hs: BangCDHS[]; so_co_diem: number }
export async function dsDeDaThi(mon: string): Promise<DeDaThi[]> {
  const { data, error } = await supabase.rpc('fn_mt_ds_de_da_thi', { p_mon: mon })
  if (error) throw error
  return (data ?? []) as DeDaThi[]
}
// cap: gom cột theo CHUYÊN ĐỀ hay CHỦ ĐỀ (Thùy 23/10) — fn_mt_bang_ket_qua, cùng luật % / điểm / hạng.
export async function bangChuyenDe(deId: string, cap: 'chuyen_de' | 'chu_de' = 'chuyen_de'): Promise<BangCD> {
  const { data, error } = await supabase.rpc('fn_mt_bang_ket_qua', { p_de: deId, p_cap: cap })
  if (error) throw error
  const j = (data ?? {}) as { cot?: BangCDCot[]; hs?: any[]; so_co_diem?: number }
  return {
    cot: j.cot ?? [],
    hs: (j.hs ?? []).map((h) => ({ ...h, diem: h.diem == null ? null : Number(h.diem), hang: h.hang == null ? null : Number(h.hang) })),
    so_co_diem: Number(j.so_co_diem ?? 0),
  }
}
