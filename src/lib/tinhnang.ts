// CÔNG TẮC TÍNH NĂNG app HS (Thùy 07/10 — mở dần từng đợt để HS không bị ngợp). Nguồn sự thật = Postgres:
// fn_hs_tinh_nang_mo() trả mã các tính năng em ĐƯỢC THẤY (theo ngày mở chung + ngoại lệ theo lớp). Client chỉ ẩn/hiện ô, không tự quyết.
// Lỗi mạng/RPC ⇒ 'tat_ca' (mở hết): công tắc hỏng không được làm mất app.
import { supabase } from './supabase'

export type TinhNangMo = Set<string> | 'tat_ca'

export async function tinhNangMoCuaToi(): Promise<TinhNangMo> {
  const { data, error } = await supabase.rpc('fn_hs_tinh_nang_mo')
  if (error) throw error
  return new Set((data ?? []) as string[])
}

/** Ô trên màn chính → mã tính năng. Ô KHÔNG có trong bảng này (bài trên lớp, ET, BTVN, bổ trợ…) là việc thầy cô giao — không bao giờ bị ẩn. */
export const MA_TINH_NANG_O: Record<string, string> = {
  tu_luyen: 'hoc_tap', thong_tin: 'thong_tin', so_tay: 'so_tay', nhiem_vu: 'nhiem_vu', may_man: 'nhiem_vu',
  thanh_tuu: 'thanh_tuu', vi_xu: 'vi_xu', xep_hang: 'xep_hang', rank: 'rank', thu_vien: 'thu_vien',
  the_gioi: 'the_gioi', tro_choi: 'tro_choi', de_thi_thu: 'de_thi_thu',
}

// ── ADMIN (màn "Mở tính năng app HS" — Thùy) ─────────────────────────────────
export type TinhNangLopNgoaiLe = { lop_id: string; ten_lop: string; mon: string; mo: boolean }
export type TinhNangAdmin = { ma: string; ten: string; nhom: 'hoc' | 'choi'; mo_ta: string | null; mo_tu: string | null; ngoai_le: TinhNangLopNgoaiLe[] }
export type TinhNangDs = { hom_nay: string; tinh_nang: TinhNangAdmin[]; lop: { id: string; ten_lop: string; mon: string; khoi: string | null }[] }

export async function tinhNangDs(): Promise<TinhNangDs> {
  const { data, error } = await supabase.rpc('fn_tinh_nang_ds')
  if (error) throw error
  return data as TinhNangDs
}
/** mo_tu = ngày (YYYY-MM-DD, giờ VN) bắt đầu mở cho mọi lớp; null = đóng. */
export async function tinhNangDat(ma: string, moTu: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_tinh_nang_dat', { p_ma: ma, p_mo_tu: moTu })
  if (error) throw error
}
/** mo = true mở riêng lớp · false đóng riêng lớp · null bỏ ngoại lệ (lớp theo ngày chung). */
export async function tinhNangLopDat(ma: string, lopId: string, mo: boolean | null): Promise<void> {
  const { error } = await supabase.rpc('fn_tinh_nang_lop_dat', { p_ma: ma, p_lop_id: lopId, p_mo: mo })
  if (error) throw error
}
