// Data-layer ĐĂNG KÝ LỊCH TEST (mig 202610151355, spec-dang-ky-test.md).
// Mọi tính toán (giờ hợp lệ, giờ xong, đã đến/lỡ hẹn, môn mở theo lớp) ở DB — client chỉ gọi hàm + CRUD dòng đơn.
import { supabase } from './supabase'

export const THU_TEN: Record<number, string> = { 1: 'Thứ 2', 2: 'Thứ 3', 3: 'Thứ 4', 4: 'Thứ 5', 5: 'Thứ 6', 6: 'Thứ 7', 7: 'Chủ nhật' }
export const THU_NGAN: Record<number, string> = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 7: 'CN' }
export const THOI_LUONG_TEST = [45, 60, 75, 90, 120] as const
export const KENH_TEN: Record<string, string> = { zalo: 'Zalo', dien_thoai: 'Điện thoại', truc_tiep: 'Trực tiếp', khac: 'Khác' }
export type Kenh = 'zalo' | 'dien_thoai' | 'truc_tiep' | 'khac'
export type Cap = 'tieu_hoc' | 'thcs' | 'thpt'

// ── Form (web + ERP chung) ──
export type GioOpt = { bat_dau: string; xong: string }
export type BuoiMo = { khung_id: string; ngay: string; thu: number; tu: string; den: string; gio: Record<string, GioOpt[]> }
export type FormData = {
  hom_nay: string
  lop: { lop: string; mon: { mon: string; thoi_luong_phut: number }[] }[]
  thieu_thoi_luong: { lop: string; mon: string }[]
  truong: { ten: string; cap: Cap[] }[]
  lich: BuoiMo[]
}
export async function getFormDangKy(soNgay = 60): Promise<FormData> {
  const { data, error } = await supabase.rpc('fn_ts_dk_form', { p_so_ngay: soNgay, p_som_phut: 0 })
  if (error) throw error
  return data as FormData
}
export function capCuaLop(lop: string): Cap { const n = Number(lop); return n <= 5 ? 'tieu_hoc' : n <= 9 ? 'thcs' : 'thpt' }

export type DangKyInput = {
  ho_ten_hs: string; sdt_ph: string; lop: string; truong: string; truong_tu_go: boolean
  nguon_lead?: string | null; ghi_chu?: string | null
  mon: { mon: string; khung_id: string; ngay: string; gio_bat_dau: string }[]
}
export type DangKyKetQua = {
  lan_dk_id: string; ho_ten_hs: string; lop: string
  mon: { mon: string; ngay: string; thu: number; gio_bat_dau: string; gio_xong: string; thoi_luong_phut: number; dang_ky_lai: boolean }[]
}
export async function dangKyThay(input: DangKyInput, kenh: Kenh): Promise<DangKyKetQua> {
  const { data, error } = await supabase.rpc('fn_ts_dang_ky_test_nhap', { p: input, p_kenh: kenh })
  if (error) throw new Error(error.message)
  return data as DangKyKetQua
}

// ── Màn Lộc ──
export type TinhTrangHen = 'cho' | 'da_den' | 'lo_hen'
export type Hen = {
  id: string; lan_dk_id: string; ung_vien_id: string; ma_uv: string | null; ho_ten_hs: string; sdt_ph: string | null
  lop: string | null; truong: string | null; mon: string; khung_id: string; ngay: string; gio_bat_dau: string; gio_xong: string
  thoi_luong_phut: number; nguon: 'web' | 'nhap_thay'; kenh: Kenh | null; truong_tu_go: boolean; created_at: string; tinh_trang: TinhTrangHen
}
export type BuoiTQ = { khung_id: string; ngay: string; thu: number; tu: string; den: string; dong: boolean; khung_da_xoa: boolean; hen: Hen[] }
export type TongQuan = {
  tu: string; den: string; buoi: BuoiTQ[]; lo_hen: Hen[]
  truong_tu_go: { ten: string; so_hen: number }[]
  thieu_thoi_luong: { lop: string; mon: string }[]
  mon_theo_lop: { lop: string; mon: string; thoi_luong_phut: number | null }[]
}
export async function getTongQuan(soNgay = 14): Promise<TongQuan> {
  const { data, error } = await supabase.rpc('fn_ts_lich_test_tong_quan', { p_so_ngay: soNgay })
  if (error) throw error
  return data as TongQuan
}
export async function doiLichHen(id: string, khungId: string, ngay: string, gio: string): Promise<{ khung_id: string; ngay: string; gio_bat_dau: string; gio_xong: string }> {
  const { data, error } = await supabase.rpc('fn_ts_hen_doi_lich', { p_id: id, p_khung: khungId, p_ngay: ngay, p_gio: gio })
  if (error) throw new Error(error.message)
  return data as any
}
export async function huyHen(id: string, lyDo: string): Promise<void> {
  const { error } = await supabase.rpc('fn_ts_hen_huy', { p_id: id, p_ly_do: lyDo })
  if (error) throw new Error(error.message)
}
export async function henCuaUngVien(ungVienId: string): Promise<{ ngay: string; gio_bat_dau: string; thoi_luong_phut: number } | null> {
  const { data, error } = await supabase.rpc('fn_ts_hen_cua_ung_vien', { p_ung_vien: ungVienId })
  if (error) throw error
  return (data ?? null) as any
}

// Khung tuần
export type Khung = { id: string; thu: number; gio_bat_dau: string; gio_ket_thuc: string }
export async function listKhung(): Promise<Khung[]> {
  const { data, error } = await supabase.from('lich_test_khung').select('id, thu, gio_bat_dau, gio_ket_thuc').is('xoa_at', null).order('thu').order('gio_bat_dau').limit(200)
  if (error) throw error
  return (data ?? []) as Khung[]
}
export async function themKhung(thu: number, tu: string, den: string): Promise<Khung> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('lich_test_khung').insert({ thu, gio_bat_dau: tu, gio_ket_thuc: den, created_by: user?.id ?? null })
    .select('id, thu, gio_bat_dau, gio_ket_thuc').single()
  if (error) throw new Error(/check/i.test(error.message) ? 'Giờ phải tròn 15 phút và giờ kết thúc sau giờ bắt đầu' : error.message)
  return data as Khung
}
// Bỏ khung = đưa vào kho rác (hẹn cũ vẫn trỏ được)
export async function boKhung(id: string): Promise<void> {
  const { error } = await supabase.from('lich_test_khung').update({ xoa_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function dongBuoi(khungId: string, ngay: string, lyDo: string | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('lich_test_dong').insert({ khung_id: khungId, ngay, ly_do: lyDo, created_by: user?.id ?? null })
  if (error) throw error
}
export async function moBuoi(khungId: string, ngay: string): Promise<void> {
  const { error } = await supabase.from('lich_test_dong').delete().eq('khung_id', khungId).eq('ngay', ngay)
  if (error) throw error
}

// Thời lượng (lớp × môn)
export async function datThoiLuong(lop: string, mon: string, phut: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('test_dau_vao_thoi_luong').upsert({ khoi: lop, mon, thoi_luong_phut: phut, updated_by: user?.id ?? null }, { onConflict: 'khoi,mon' })
  if (error) throw error
}

// Danh mục trường
export type Truong = { id: string; ten: string; cap: Cap[] }
export async function listTruong(): Promise<Truong[]> {
  const { data, error } = await supabase.from('truong_hoc_dm').select('id, ten, cap').is('xoa_at', null).order('ten').limit(1000)
  if (error) throw error
  return (data ?? []) as Truong[]
}
export async function themTruong(ten: string, cap: Cap[]): Promise<Truong> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('truong_hoc_dm').insert({ ten: ten.trim().replace(/\s+/g, ' '), cap, created_by: user?.id ?? null }).select('id, ten, cap').single()
  if (error) throw new Error(/duplicate|unique/i.test(error.message) ? 'Trường này đã có trong danh mục' : error.message)
  return data as Truong
}
export async function suaTruong(id: string, patch: Partial<Pick<Truong, 'ten' | 'cap'>>): Promise<void> {
  const { error } = await supabase.from('truong_hoc_dm').update(patch).eq('id', id)
  if (error) throw error
}
export async function anTruong(id: string): Promise<void> {
  const { error } = await supabase.from('truong_hoc_dm').update({ xoa_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
