// CHUYÊN ĐỀ HÌNH (Thùy 21/10) — tài liệu loai='chuyen_de', nhanh='hinh', ban_do='moi': Phần → mô hình (Hình–Luyện) → bài kho (trọn ý).
// Ghi qua RPC (mig 202610211633): fn_tl_hl_dat_mo_hinh · fn_tl_hl_dat_bai; đọc 1 lần fn_tl_hl_noi_dung (builder + in).
// Bộ chọn mô hình đọc danh sách thô (chủ đề / nhóm mô hình / mô hình) — không tính gì ở client.
import { supabase } from './supabase'

export type CdhY = { nhan: string | null; noi_dung: string; dap_an: string | null; loi_giai: string | null; anh_de: string | null; anh_loi_giai: string | null; gia_thiet_them: string | null }
export type CdhBai = { ma_bai: string; id: string | null; de_bai: string | null; gia_thiet_chung: string | null; anh_de: string | null; con_trong_kho: boolean; loai_cau?: string | null; y: CdhY[] }
export type CdhMoHinh = { phan_id: string; id: string | null; ma: string | null; ten: string | null; gia_thiet: string | null; anh: string | null; con_tren_ban_do: boolean; bai: CdhBai[] }
// khac = khối "Bài chưa có mô hình" (bài chưa gán mô hình / không tự luận) — mig 202610211748
export type CdhPhan = { id: string; tieu_de: string | null; thu_tu: number; mo_hinh: CdhMoHinh[]; khac: { phan_id: string; bai: CdhBai[] } | null }
export type CdhNoiDung = {
  tai_lieu: { id: string; ten: string; khoi: string; mon: string; nhanh: string | null; loai: string; ban_do: string; cau_hinh: Record<string, unknown>; updated_at: string } | null
  buoi: CdhPhan[]
}

export async function cdhNoiDung(taiLieuId: string, phanId?: string | null): Promise<CdhNoiDung> {
  const { data, error } = await supabase.rpc('fn_tl_hl_noi_dung', { p_tai_lieu: taiLieuId, p_buoi: phanId ?? null })
  if (error) throw error
  return data as CdhNoiDung
}
/** Đặt tập mô hình của 1 phần (thứ tự = mảng). Trả lại phần đó để vá tại chỗ. */
export async function cdhDatMoHinh(taiLieuId: string, phanId: string, moHinhIds: string[]): Promise<CdhPhan> {
  const { data, error } = await supabase.rpc('fn_tl_hl_dat_mo_hinh', { p_tai_lieu: taiLieuId, p_buoi: phanId, p_mo_hinh: moHinhIds })
  if (error) throw error
  return (data as CdhNoiDung).buoi[0]
}
export async function cdhDatBai(phanMoHinhId: string, maBai: string[]): Promise<void> {
  const { error } = await supabase.rpc('fn_tl_hl_dat_bai', { p_phan: phanMoHinhId, p_ma_bai: maBai })
  if (error) throw error
}

// ── Bộ chọn: chủ đề Hình–Luyện của khối → nhóm mô hình → mô hình ──
export type CdhChonMoHinh = { id: string; ma: string; ten: string; chu_de_id: string | null; nhom_mh_id: string | null; thu_tu: number | null }
export type CdhChonNhom = { id: string; chu_de_id: string; ten: string; thu_tu: number }
export type CdhChonChuDe = { id: string; ten: string }
export async function cdhCayChon(khoi: string): Promise<{ chuDe: CdhChonChuDe[]; nhom: CdhChonNhom[]; moHinh: CdhChonMoHinh[] }> {
  const [cd, mh] = await Promise.all([
    supabase.from('dai_bdm_chu_de').select('id, ten').eq('khoi', khoi).eq('nhanh', 'hinh_luyen').order('thu_tu').limit(100),
    supabase.from('hinh_mo_hinh').select('id, ma, ten, chu_de_id, nhom_mh_id, thu_tu').eq('phan', 'luyen').eq('khoi', khoi).is('neo_baitoan_id', null).eq('la_mo_hinh', true).order('ma')   /* nhánh giả thiết (22/10) cũng neo NULL ⇒ lọc la_mo_hinh */.limit(1000),
  ])
  if (cd.error) throw cd.error
  if (mh.error) throw mh.error
  const ids = (cd.data ?? []).map((x) => x.id)
  const nh = ids.length ? await supabase.from('hinh_nhom_mo_hinh').select('id, chu_de_id, ten, thu_tu').in('chu_de_id', ids).order('thu_tu').limit(1000) : { data: [], error: null }
  if (nh.error) throw nh.error
  return { chuDe: (cd.data ?? []) as CdhChonChuDe[], nhom: (nh.data ?? []) as CdhChonNhom[], moHinh: (mh.data ?? []) as CdhChonMoHinh[] }
}
