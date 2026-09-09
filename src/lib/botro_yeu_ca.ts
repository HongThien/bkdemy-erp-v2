// Data-layer CA BỔ TRỢ YẾU (PLAN-botro-yeu-ca.md) — 2 app, 1 buổi: app HS làm bài · app TA điều hành.
// MỌI logic ở Postgres (fn_btyeu_*, migration 202609030307 + 202609030326); file này chỉ gọi RPC + type.
// KHÔNG tính toán gì ở đây (CLAUDE.md §2.0) — kể cả "đã học cụm nào" cũng do DB derive.
import { supabase } from './supabase'
import type { BaiTestCuaHS, BaiLam } from './testonline'

// ── App HỌC SINH ─────────────────────────────────────────────────────────────
export type CumCaHS = {
  ma_cum: string; ten: string; thu_tu: number; tien_de: string[]
  so_cau_kho: number; so_cau: number; so_dung: number
}
export type DangCaHS = {
  ma_dang: string; ten_dang: string; ten_chuyen_de: string; da_day_truoc: boolean
  diem_luc_mo: number | null; so_cau: number; so_dung: number; cums: CumCaHS[]
}
export type CaCuaToi = {
  buoi_id: string; mon: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  ta_ten: string | null; dangs: DangCaHS[]
  test: { bai_test_id: string; so_cau: number; da_nop: boolean } | null
}
// null = hôm nay em không có ca / chưa được điểm danh có mặt / ca đã hoàn tất.
export async function caCuaToi(): Promise<CaCuaToi | null> {
  const { data, error } = await supabase.rpc('fn_btyeu_ca_cua_toi')
  if (error) throw error
  return (data as CaCuaToi | null) ?? null
}
// 1 LÔ luyện (mặc định 3 câu) trong cụm (null = cả dạng). App tự gọi lô mới khi hết — em luyện tới khi TA bảo next.
export async function sinhLoLuyen(buoiId: string, maDang: string, maCum: string | null, soCau = 3): Promise<{ bai_test_id: string; so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_btyeu_luyen_sinh', { p_buoi: buoiId, p_ma_dang: maDang, p_ma_cum: maCum, p_so_cau: soCau })
  if (error) throw error
  return data as { bai_test_id: string; so_cau: number }
}
// 1 bài cá nhân (test cuối ca / retest) dạng BaiTestCuaHS để đưa thẳng vào LamET (chế độ thi) — RLS
// bai_test_hs_read đã cho em đọc bài có hoc_sinh_id = em (migration 202609030307 §2).
export async function layBaiTestCaNhan(baiTestId: string): Promise<BaiTestCuaHS> {
  const { data, error } = await supabase.from('bai_test').select('*, lop:lop_id(ten_lop)').eq('id', baiTestId).single()
  if (error) throw error
  const { data: lams } = await supabase.from('bai_lam').select('*').eq('bai_test_id', baiTestId).limit(1)
  const t = data as any
  return { ...t, lop_ten: t.lop?.ten_lop ?? '', bai_lam: (lams?.[0] as BaiLam | undefined) ?? null }
}
export type RetestCuaToi = { bai_test_id: string; ngay: string; mon: string; so_cau: number; lop_id: string; da_nop: boolean; nop_at: string | null; buoi_bo_tro_ngay: string | null }
export async function retestCuaToi(): Promise<RetestCuaToi[]> {
  const { data, error } = await supabase.rpc('fn_btyeu_retest_cua_toi')
  if (error) throw error
  return (data as RetestCuaToi[]) ?? []
}

// ── App TRỢ GIẢNG ────────────────────────────────────────────────────────────
export type ViecCaBoTro = {
  buoi_id: string; ngay: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; mon: string; level: number | null
  diem_danh: string | null; so_dang: number; co_test: boolean; test_da_nop: boolean; danh_gia_xong_at: string | null
}
export type ViecRetest = {
  bai_test_id: string; ngay: string; mon: string; so_cau: number; lop_id: string; ten_lop: string
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; da_nop: boolean; buoi_bo_tro_ngay: string | null
}
// Việc bổ trợ yếu của TÔI: ca tôi đứng (hôm nay + chưa hoàn tất các ngày trước) + retest của lớp tôi là TA đến hạn.
export async function viecBoTroCuaToi(): Promise<{ ca: ViecCaBoTro[]; retest: ViecRetest[] }> {
  const { data, error } = await supabase.rpc('fn_btyeu_viec_cua_toi')
  if (error) throw error
  const d = (data ?? {}) as { ca?: ViecCaBoTro[]; retest?: ViecRetest[] }
  return { ca: d.ca ?? [], retest: d.retest ?? [] }
}

export type CumTienDo = { ma_cum: string | null; ten: string; so_cau: number; so_dung: number; so_goi_y: number; cau_cuoi_at: string | null }
export type DangCaTA = {
  ma_dang: string; ten_dang: string; ten_chuyen_de: string
  day_at: string | null; day_buoi_id: string | null; dong_at: string | null; diem_luc_mo: number | null
  retest_diem: number | null; retest_at: string | null; dat: boolean | null
  so_cau: number; so_dung: number; so_goi_y: number; cau_cuoi_at: string | null; cums: CumTienDo[]
}
export type CaTA = {
  buoi_id: string; mon: string; ngay: string; trang_thai: string; diem_danh: string | null; buoi_hoc_hs_id: string
  nguoi_day_tg: string | null; danh_gia_xong_at: string | null; bo_tro_yeu_id: string
  hs: { id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; level: number | null }
  dangs: DangCaTA[]
  test: { bai_test_id: string; so_cau: number; da_nop: boolean | null; nop_at: string | null; theo_dang: { ma_dang: string; so_cau: number; so_dung: number }[] } | null
  retest: { bai_test_id: string; ngay: string; so_cau: number; da_nop: boolean; nop_at: string | null } | null
  danh_gia: { nhan_xet: string | null; muc_ma: string | null } | null
  so_lan_huy: number
}
export async function caTA(buoiId: string): Promise<CaTA | null> {
  const { data, error } = await supabase.rpc('fn_btyeu_ca_ta', { p_buoi: buoiId })
  if (error) throw error
  return (data as CaTA | null) ?? null
}
export type KetQuaDongCa = { bo_tro_test_id: string | null; retest_id: string | null; retest_ngay: string | null; khong_hoc: boolean; da_dong_truoc?: boolean }
// Đóng ca: chốt dạng đã dạy + sinh test cuối ca + sinh retest tầng 2 (1 transaction, idempotent).
export async function dongCa(buoiId: string): Promise<KetQuaDongCa> {
  const { data, error } = await supabase.rpc('fn_btyeu_dong_ca', { p_buoi: buoiId })
  if (error) throw error
  return data as KetQuaDongCa
}
// Hoàn tất ca: nhận xét + mức; test chưa nộp thì bắt buộc có lý do "không test" (Thùy 03/09).
export async function hoanTatCa(buoiId: string, nhanXet: string, mucMa: string | null, khongTestLyDo: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_btyeu_hoan_tat', { p_buoi: buoiId, p_nhan_xet: nhanXet, p_muc_ma: mucMa, p_khong_test_ly_do: khongTestLyDo })
  if (error) throw error
}
