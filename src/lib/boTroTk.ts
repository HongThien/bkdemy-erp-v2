// BỔ TRỢ do TRƯỞNG KHỐI đề xuất từ Dashboard học tập → trưởng bộ môn duyệt (Thùy 10/11, mig 202611101645).
// Thay hẳn màn Duyệt bổ trợ cũ. Mọi luật (nhóm yếu = mastery theo lần, quyền, mở case, dạng vào case) ở DB — client chỉ gọi + hiển thị.
import { supabase } from './supabase'

export type TrangThaiBtk = 'nhap' | 'cho_duyet' | 'da_duyet' | 'tra_lai' | 'huy'
export type NhomGoiY = { ma: string; ten: string; cha: string | null; p: number; n: number; muc: 'yeu' | 'can_luyen' | 'dat'; tin: string; dang_chua_dat: number; dang_da_do: number; dang_yeu?: number; tick: boolean }
export type NhomChon = { ma: string; ten: string; cha: string | null; p: number | null; n: number | null; muc: string | null }
export type DeXuat = {
  id: string; hoc_sinh_id: string; mon: string; khoi: string; nhom: NhomChon[]; muc: 1 | 2 | 3; uu_tien: 1 | 2 | 3; ghi_chu: string
  trang_thai: TrangThaiBtk; ly_do_tra: string | null
}
export type GoiY = { khoi: string; so_nhom_do: number; so_nhom_yeu: number; dang_yeu: number | null; dang_yeu_trong_nhom_yeu?: number; nhom: NhomGoiY[]; de_xuat: DeXuat | null; dang_bo_tro: boolean }
// 18/11 (mig 202611181302): chuông GV / TA trong tuần của đề xuất · các ca bổ trợ em có tên trong 2 tuần gần đây + kết quả (số do DB trả)
export type BaoDongBtk = { at: string; nguon: string; ghi_chu: string | null; nguoi: string | null; lop: string | null }
export type CaLichSu = {
  buoi_id: string; ngay: string; tuan: string; loai: 'bo_tro_yeu' | 'bo_tro_nhe'; muc: number | null; diem_danh: string | null
  so_dang: number; het_yeu: number; con_yeu: number; test_dung: number; test_tong: number
}
export type DongBtk = {
  bao_dong?: BaoDongBtk[]; lich_su?: CaLichSu[]
  // 23/11 (mig 202611231446): từng nhóm của đề xuất đã được bổ trợ chưa — so_ca = số ca em có mặt và được dạy dạng thuộc nhóm; duyet_truoc = số đề xuất đã duyệt khác có nhóm này
  // 23/11 (mig 202611231551): dạng yếu TRONG các nhóm đã chọn (trong) · dạng yếu lẻ ngoài các nhóm đó (le) · số dạng yếu từng nhóm (theo_nhom) — mastery theo lần
  dy_chon?: { trong: number; le: number; theo_nhom: Record<string, number> }
  nhom_ls?: { ma: string; so_ca: number; lan_cuoi: string | null; duyet_truoc: number }[]
  id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop: string | null; khoi: string
  nhom: NhomChon[]; muc: 1 | 2 | 3; uu_tien: 1 | 2 | 3; ghi_chu: string; trang_thai: TrangThaiBtk; ly_do_tra: string | null
  so_dang: number | null; case_id: string | null; case_tt: string | null; case_ket_qua: string | null
  tao_at: string; tao_ten: string | null; gui_at: string | null; gui_ten: string | null; duyet_at: string | null; duyet_ten: string | null; dang_yeu: number | null
}

export const NHAN_TT: Record<TrangThaiBtk | 'dang_bo_tro' | 'xong', { t: string; cls: string }> = {
  nhap: { t: 'Nháp', cls: 'bg-slate-100 text-slate-700' },
  cho_duyet: { t: 'Chờ trưởng bộ môn', cls: 'bg-amber-100 text-amber-800' },
  tra_lai: { t: 'Bị trả lại', cls: 'bg-rose-100 text-rose-700' },
  da_duyet: { t: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-800' },
  huy: { t: 'Đã bỏ', cls: 'bg-slate-100 text-slate-400' },
  dang_bo_tro: { t: 'Chờ bổ trợ', cls: 'bg-indigo-100 text-indigo-700' },
  xong: { t: 'Đã xong', cls: 'bg-emerald-100 text-emerald-800' },
}
// Thang L1–L4 (Thùy 11/11): L1 & L4 ngoài ca bổ trợ khối
export const TEN_MUC: Record<number, string> = { 1: 'L1 · sau giờ (TA kèm sau buổi học)', 2: 'L2 · ca bổ trợ khối (TA dạy)', 3: 'L3 · ca bổ trợ khối (giáo viên dạy)', 4: 'L4 · ca bổ trợ khối (nghiêm trọng: chuẩn bị kỹ + đổi giáo viên)' }
export const TEN_UU_TIEN: Record<number, string> = { 3: 'Cao', 2: 'Thường', 1: 'Thấp' }

const rpc = async <T,>(fn: string, args: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}
export const goiYBoTro = (hs: string, mon: string) => rpc<GoiY>('fn_btk_goi_y', { p_hs: hs, p_mon: mon })
// 11/11: mọi nhóm em đã đo (thấp → cao) — chỉ gọi khi bấm "Xem tất cả" trong popup
// Bấm 1 nhóm ⇒ mọi dạng của nhóm + mức / điểm / số lần đo (Thùy 13/11, mig 202611131528 — mastery theo lần, đọc cache)
export type DangTrongNhom = { ma_dang: string; ten_dang: string; muc: 'yeu' | 'can_luyen' | 'dat' | 'chua_do'; p: number | null; n: number }
export const dangTrongNhom = (hs: string, mon: string, nhom: string) => rpc<DangTrongNhom[]>('fn_btk_dang_nhom', { p_hs: hs, p_mon: mon, p_nhom: nhom })
export const tatCaNhomBoTro = (hs: string, mon: string) => rpc<NhomGoiY[]>('fn_btk_goi_y_tat_ca', { p_hs: hs, p_mon: mon })
export const luuBoTro = (x: { id: string | null; hs: string; mon: string; nhom: string[]; muc: number; uuTien: number; ghiChu: string }) =>
  rpc<string>('fn_btk_luu', { p_id: x.id, p_hs: x.hs, p_mon: x.mon, p_nhom: x.nhom, p_muc: x.muc, p_uu_tien: x.uuTien, p_ghi_chu: x.ghiChu })
export const boBoTro = (id: string) => rpc<null>('fn_btk_huy', { p_id: id })
export const guiBoTro = (mon: string, khoi: string) => rpc<number>('fn_btk_gui', { p_mon: mon, p_khoi: khoi })
export const dsBoTro = (mon: string, khoi: string | null) => rpc<DongBtk[]>('fn_btk_ds', { p_mon: mon, p_khoi: khoi, p_so_ngay: 14 })
export const duyetBoTro = (id: string) => rpc<{ case_id: string; so_dang: number }>('fn_btk_duyet', { p_id: id })
export const traLaiBoTro = (id: string, lyDo: string) => rpc<null>('fn_btk_tra_lai', { p_id: id, p_ly_do: lyDo })
