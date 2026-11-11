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

export type KetQuaTao = { ca_id: string; so_hs: number; em_khong_dang: string[]; trung_phong: number; trung_ds?: { tieu_de: string; gio_bat_dau: string; gio_ket_thuc: string; nguon: string }[] } // trung_ds: lịch phòng chung (mig 202611101604)
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

// ── BỔ TRỢ SAU GIỜ = L1 (Thùy 11/11, mig 202611111627) ──
// Hàng chờ: em được trưởng bộ môn DUYỆT L1, chưa khởi tạo ca sau giờ (fn_btnhe_cho).
export type ChoSauGio = {
  de_xuat_id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; mon: string; khoi: string
  lop_id: string | null; ten_lop: string | null; nhom: { ma: string; ten: string }[]; uu_tien: number; ghi_chu: string; duyet_at: string; so_dang: number
}
export async function choSauGio(): Promise<ChoSauGio[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_cho')
  if (error) throw error
  return (data ?? []) as ChoSauGio[]
}
export type LyThuyetSauGio = {
  buoi_id: string; mon: string; ngay: string; hs: { id: string; ho_ten: string; ma_hs: string | null; khoi: string | null }
  dang: { ma_dang: string; ten_dang: string; nhom_yeu: boolean; ly_thuyet: string | null; file_url: string | null; vi_du: string | null }[]
}
export async function inLyThuyetSauGio(buoiId: string): Promise<LyThuyetSauGio> {
  const { data, error } = await supabase.rpc('fn_btnhe_in_ly_thuyet', { p_buoi: buoiId })
  if (error) throw error
  return data as LyThuyetSauGio
}
// Bài test sau giờ: 1 câu mỗi dạng yếu trong nhóm yếu; gọi lại = lấy đúng bài đã sinh (DB idempotent)
export async function inTestSauGio(buoiId: string): Promise<{ bai_test_id: string; so_cau: number; da_co: boolean; dang_khong_co_cau: string[] }> {
  const { data, error } = await supabase.rpc('fn_btnhe_in_test', { p_buoi: buoiId })
  if (error) throw error
  return data as { bai_test_id: string; so_cau: number; da_co: boolean; dang_khong_co_cau: string[] }
}

// Form khởi tạo theo BUỔI (Thùy 11/11, mig 202611111659): lớp có em đã duyệt L1 → em đã duyệt của lớp → buổi học sắp tới
export type LopCho = { lop_id: string; ten_lop: string; mon: string; khoi: string; so_em: number; so_cho: number }
export async function lopCoEmDuyet(): Promise<LopCho[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_lop_cho').limit(500)
  if (error) throw error
  return (data ?? []) as LopCho[]
}
export type HsDuyet = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; cho: boolean; duyet_at: string; so_ca_tuan: number; so_dang: number; nhom: { ma: string; ten: string }[]; ghi_chu: string }
export async function hsDaDuyet(lopId: string): Promise<HsDuyet[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_hs_duyet', { p_lop: lopId }).limit(500)
  if (error) throw error
  return (data ?? []) as HsDuyet[]
}
export type BuoiLop = { ngay: string; gio_bat_dau: string; gio_ket_thuc: string; phong: string | null; ta_id: string | null; ta_ten: string | null; so_ca_sau_gio: number }
export async function buoiCuaLop(lopId: string, soNgay = 14): Promise<BuoiLop[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_buoi_lop', { p_lop: lopId, p_so_ngay: soNgay }).limit(100)
  if (error) throw error
  return (data ?? []) as BuoiLop[]
}

// SOẠN bài luyện / bài test như builder giáo trình (Thùy 11/11, mig 202611111717): máy đề xuất (không ghi) → người sửa → lưu.
export type DangSoan = { ma_dang: string; ten_dang: string; nhom_yeu: boolean; nhanh: string | null; nhom_id: string | null; caus: string[] }
export type BaiSoan = { loai: 'luyen' | 'test'; mon: string; test_id: string | null; dang: DangSoan[]; da_in: string[] }
export async function soanBai(buoiId: string, loai: 'luyen' | 'test', so = 3): Promise<BaiSoan> {
  const { data, error } = await supabase.rpc('fn_btnhe_soan', { p_buoi: buoiId, p_loai: loai, p_so: so })
  if (error) throw error
  return data as BaiSoan
}
export async function goiYDang(buoiId: string, maDang: string, n: number, tru: string[]): Promise<string[]> {
  const { data, error } = await supabase.rpc('fn_btnhe_goi_y_dang', { p_buoi: buoiId, p_ma_dang: maDang, p_n: n, p_tru: tru })
  if (error) throw error
  return (data ?? []) as string[]
}
export async function luuBai(buoiId: string, loai: 'luyen' | 'test', ds: { ma_dang: string; caus: string[] }[]): Promise<{ bai_test_id: string; so_cau: number }> {
  const { data, error } = await supabase.rpc('fn_btnhe_luu_bai', { p_buoi: buoiId, p_loai: loai, p_ds: ds })
  if (error) throw error
  return data as { bai_test_id: string; so_cau: number }
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
