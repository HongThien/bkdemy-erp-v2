// BỔ TRỢ NHẸ (L1.1) — Thùy 29/10, spec-truong-khoi.md §8. Trưởng khối tự tạo ca 15–20' (sau giờ / giờ khác), không qua Lộc,
// không suất. Mọi kiểm tra (phạm vi khối, ≤ 2 ca/em/tuần, em thuộc lớp) ở DB — fn_btnhe_* (mig 202610291639).
// Chạy ca (điểm danh · in phiếu · nhập giấy · đóng ca · test · hoàn tất) = máy ca Yếu: CaDetail + fn_btyeu_*.
import { supabase } from './supabase'
import { thuCuaNgay, ddmmVN } from './tuan'

const hhmm = (t: string | null | undefined) => (t ? String(t).slice(0, 5) : '')

export type LopNhe = {
  lop_id: string; ten_lop: string; mon: string; khoi: string
  gio_bat_dau: string | null; gio_ket_thuc: string | null; phong: string | null  // giờ học ngày đã chọn (null = lớp không học ngày đó)
  ta_id: string | null; ta_ten: string | null
}
export async function lopCuaToi(ngay: string): Promise<LopNhe[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_lop_cua_toi', { p_ngay: ngay }).limit(500)
  if (error) throw error
  return (data ?? []) as LopNhe[]
}

export type HsNhe = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; so_dang_yeu: number; dang_yeu: string[]; so_ca_nhe_tuan: number }
export async function hsCuaLop(lopId: string, ngay: string): Promise<HsNhe[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_lop_hs', { p_lop: lopId, p_ngay: ngay }).limit(500)
  if (error) throw error
  return (data ?? []) as HsNhe[]
}

export type KetQuaTao = { ca_id: string; so_hs: number; em_khong_dang: string[]; trung_phong: number }
export async function taoCaNhe(p: { lopId: string; kieu: 'sau_buoi' | 'khac'; ngay: string; gioBatDau: string; phut: number; phong: string | null; hs: string[]; taId: string | null }): Promise<KetQuaTao> {
  const { data, error } = await supabase.rpc('fn_btnhe_tao', {
    p_lop: p.lopId, p_kieu: p.kieu, p_ngay: p.ngay, p_gio_bat_dau: p.gioBatDau, p_phut: p.phut, p_phong: p.phong, p_hs: p.hs, p_ta: p.taId,
  })
  if (error) throw error
  return data as KetQuaTao
}

export type HsCaNhe = {
  buoi_id: string; buoi_hoc_hs_id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null
  buoi_trang_thai: 'mo' | 'hoan_tat' | 'huy'; diem_danh: string | null; danh_gia_xong_at: string | null
  so_dang: number; co_test: boolean; test_da_nop: boolean; ket_qua: string | null
}
export type CaNhe = {
  ca_id: string; lop_id: string; ten_lop: string; mon: string; khoi: string; kieu: 'sau_buoi' | 'khac'; ngay: string
  gio_bat_dau: string; gio_ket_thuc: string; phong: string | null; trang_thai: 'mo' | 'huy'
  truong_khoi_id: string; truong_khoi_ten: string | null; ta_id: string | null; ta_ten: string | null; hs: HsCaNhe[]
}
export async function dsCaNhe(tu: string, den: string): Promise<CaNhe[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_ds', { p_tu: tu, p_den: den })
  if (error) throw error
  return (data ?? []) as CaNhe[]
}
export async function huyCaNhe(caId: string, lyDo: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_btnhe_huy', { p_ca: caId, p_ly_do: lyDo })
  if (error) throw error
  return Number(data ?? 0)
}

// Thông báo dán nhóm Zalo lớp (Thùy 29/10). Chỉ ghép chữ hiển thị — tên em lấy từ ca đã lưu, bỏ em đã huỷ (vắng/huỷ ca).
export function thongBaoPhuHuynh(ca: CaNhe): string {
  const ten = ca.hs.filter((h) => h.buoi_trang_thai !== 'huy').map((h) => h.ho_ten)
  const ds = ten.length <= 1 ? (ten[0] ?? '') : `${ten.slice(0, -1).join(', ')} và ${ten[ten.length - 1]}`
  const phut = Math.round((Date.parse(`1970-01-01T${ca.gio_ket_thuc}Z`) - Date.parse(`1970-01-01T${ca.gio_bat_dau}Z`)) / 60000)
  const ngay = `${thuCuaNgay(ca.ngay)}, ngày ${ddmmVN(ca.ngay)}`
  return ca.kieu === 'sau_buoi'
    ? `${ngay}, các bạn ${ds} sẽ ở lại sau giờ ${phut} phút để bổ trợ các phần kiến thức còn yếu. Bố mẹ nắm thông tin nhé ạ.`
    : `${ngay}, từ ${hhmm(ca.gio_bat_dau)} đến ${hhmm(ca.gio_ket_thuc)}${ca.phong ? ` tại phòng ${ca.phong}` : ''}, các bạn ${ds} sẽ học bổ trợ ${phut} phút các phần kiến thức còn yếu. Bố mẹ nắm thông tin nhé ạ.`
}
