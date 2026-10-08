// ============================================================================
// hieusuat_ta.ts — DATA-LAYER "Hiệu suất trợ giảng" (màn Chất lượng vận hành, CEO chốt 08/10).
// MỌI con số tính ở Postgres (mig 202610081343, spec-hieu-suat-ta.md): fn_hsta_thang (1 dòng/TA) ·
// fn_hsta_task (từng task BTVN/ET — điểm CHỈ từ gậy đã xác nhận) · fn_hsta_gay (gậy ↔ task) · fn_hsta_bo_tro (từng ca bổ trợ — chỉ số liệu, không chấm).
// Ghi: fn_hsta_chot (quản lý chốt TA × tháng × đầu việc) · fn_hsta_ghi_them / _xoa (việc ngoài hệ thống).
// File này chỉ gọi hàm + định nghĩa kiểu, KHÔNG tính.
// ============================================================================
import { supabase } from './supabase'

export type DauViec = 'btvn' | 'et' | 'bo_tro' | 'tong'
export type DauViecGhiThem = 'btvn' | 'et' | 'bo_tro' | 'khac'

export type ChotO = { diem_chot: number; diem_he_thong: number | null; ghi_chu: string; nguoi_chot: string | null; chot_at: string }

export type HstaThang = {
  nhan_su_id: string; ho_ten: string
  btvn_so_task: number; btvn_so_tinh: number; btvn_de_xuat: number | null; btvn_so_co: number
  et_so_task: number; et_so_tinh: number; et_de_xuat: number | null; et_so_co: number
  bt_so_ca: number; bt_gio_he_thong: number; bt_gio_ghi_them: number; bt_chi_tieu_gio: number; bt_so_co: number
  tong_de_xuat: number | null; tong_du_3_dau_viec: boolean
  chot: Partial<Record<DauViec, ChotO>>; so_ghi_them: number
}

export type HstaTask = {
  nhan_su_id: string; ho_ten: string; dau_viec: 'btvn' | 'et'; buoi_id: string; ten_lop: string; ngay: string
  han: string | null; dong_dau: string | null; dong_cuoi: string | null; so_mo_lai: number
  tre_gio: number; tru_tien_do: number; gay_chat_luong: number; gay_tre: number; tru_chat_luong: number
  diem: number | null; tinh: boolean; ly_do_khong_tinh: string | null; co: string[]
  so_co_mat: number; so_kq: number | null; nop_dung_han: number | null; nop_muon: number | null; khong_lam: number | null; xin_phep: number | null
  pct_dung_han: number | null; pct_dung_han_lop_khac: number | null
  so_cau: number; o_can: number | null; o_cham: number | null; pct_o_cham: number | null; so_hs_vang_co_diem: number | null
}

export type HstaCa = {
  nhan_su_id: string; ho_ten: string; buoi_id: string; loai: 'bu' | 'bo_tro_yeu' | 'bo_tro_duoi'; ngay: string
  gio_bat_dau: string | null; gio_ket_thuc: string | null; so_phut: number | null; khung: string
  hoc_sinh: string[]; so_co_mat: number; so_vang: number; lop_goc: string | null
  danh_gia_xong_at: string | null; bai_dau_at: string | null; so_gay: number; co: string[]
}

// 1 gậy của TA (đã vào sổ / đã thu hồi / đề xuất còn chờ) ↔ task nó gắn — đối chiếu 1-1 với màn Gậy
export type HstaGay = {
  nguon: 'so' | 'de_xuat'; id: string; trang_thai: 'da_vao_so' | 'da_thu_hoi' | 'cho_chot'
  ma_loi: string | null; ten_loi: string | null; so_gay: number; tre_phut: number | null
  ly_do: string | null; ref_key: string | null; nguoi: string | null; tao_at: string; thu_hoi_at: string | null
  gan_voi: string; buoi_id: string | null; ngay_task: string | null; ten_lop: string | null
  tinh_vao: 'tien_do' | 'chat_luong' | null; ly_do_khong_tinh: string | null
}

export type GhiThem = { id: string; dau_viec: DauViecGhiThem; noi_dung: string; so_gio: number | null; nguoi_ghi: string | null; created_at: string }

const num = (v: unknown): number | null => (v == null ? null : Number(v))

function chuanThang(r: any): HstaThang {
  return {
    ...r,
    btvn_de_xuat: num(r.btvn_de_xuat), et_de_xuat: num(r.et_de_xuat), tong_de_xuat: num(r.tong_de_xuat),
    bt_gio_he_thong: Number(r.bt_gio_he_thong), bt_gio_ghi_them: Number(r.bt_gio_ghi_them), bt_chi_tieu_gio: Number(r.bt_chi_tieu_gio),
    chot: r.chot ?? {},
  }
}

// ky = 'YYYY-MM-01'
export async function layBangThang(ky: string): Promise<HstaThang[]> {
  const { data, error } = await supabase.rpc('fn_hsta_thang', { p_ky: ky }).limit(500)
  if (error) throw error
  return (data ?? []).map(chuanThang)
}
export async function layDongThang(ky: string, nsId: string): Promise<HstaThang | null> {
  const { data, error } = await supabase.rpc('fn_hsta_thang', { p_ky: ky, p_ns: nsId }).limit(1)
  if (error) throw error
  return data?.[0] ? chuanThang(data[0]) : null
}

export async function layTask(tu: string, den: string, nsId: string): Promise<HstaTask[]> {
  const { data, error } = await supabase.rpc('fn_hsta_task', { p_tu: tu, p_den: den, p_ns: nsId }).limit(2000)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    ...r, tre_gio: Number(r.tre_gio), diem: num(r.diem), pct_dung_han: num(r.pct_dung_han),
    pct_dung_han_lop_khac: num(r.pct_dung_han_lop_khac), pct_o_cham: num(r.pct_o_cham), co: r.co ?? [],
  }))
}

export async function layCaBoTro(tu: string, den: string, nsId: string): Promise<HstaCa[]> {
  const { data, error } = await supabase.rpc('fn_hsta_bo_tro', { p_tu: tu, p_den: den, p_ns: nsId }).limit(1000)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ ...r, hoc_sinh: r.hoc_sinh ?? [], co: r.co ?? [] }))
}

export async function layGay(tu: string, den: string, nsId: string): Promise<HstaGay[]> {
  const { data, error } = await supabase.rpc('fn_hsta_gay', { p_tu: tu, p_den: den, p_ns: nsId }).limit(500)
  if (error) throw error
  return (data ?? []) as HstaGay[]
}

// diem = null ⇒ bỏ chốt. Trả ô vừa ghi (null nếu bỏ chốt).
export async function chot(nsId: string, ky: string, dauViec: DauViec, diem: number | null, ghiChu: string): Promise<ChotO | null> {
  const { data, error } = await supabase.rpc('fn_hsta_chot', { p_ns: nsId, p_ky: ky, p_dau_viec: dauViec, p_diem: diem, p_ghi_chu: ghiChu })
  if (error) throw error
  return (data as ChotO | null) ?? null
}

export async function layGhiThem(nsId: string, ky: string): Promise<GhiThem[]> {
  const { data, error } = await supabase.rpc('fn_hsta_ghi_them_ds', { p_ns: nsId, p_ky: ky }).limit(500)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ ...r, so_gio: num(r.so_gio) }))
}
export async function themGhiThem(nsId: string, ky: string, dauViec: DauViecGhiThem, noiDung: string, soGio: number | null): Promise<GhiThem> {
  const { data, error } = await supabase.rpc('fn_hsta_ghi_them', { p_ns: nsId, p_ky: ky, p_dau_viec: dauViec, p_noi_dung: noiDung, p_so_gio: soGio })
  if (error) throw error
  return { ...(data as any), so_gio: num((data as any)?.so_gio) }
}
export async function xoaGhiThem(id: string): Promise<void> {
  const { error } = await supabase.rpc('fn_hsta_ghi_them_xoa', { p_id: id })
  if (error) throw error
}

// ── Nhãn hiển thị ──
export const TEN_DAU_VIEC: Record<DauViec | 'khac', string> = { btvn: 'Chấm BTVN', et: 'Chấm ET', bo_tro: 'Bổ trợ', tong: 'Tổng', khac: 'Khác' }
export const TEN_LOAI_CA: Record<HstaCa['loai'], string> = { bu: 'Bù', bo_tro_yeu: 'Yếu', bo_tro_duoi: 'Đuổi' }
export const TEN_CO: Record<string, string> = {
  chua_dong: 'Chưa đóng',
  gay_cho_chot: 'Có đề xuất gậy chờ chốt',
  gay_dau_dung_han: 'Có gậy trễ nhưng lần đóng đầu ĐÚNG HẠN — xem lại gậy',
  khong_cau_co_gay: 'Không có câu nhưng đã có gậy — vẫn tính',
  mo_lai: 'Đã mở lại',
  nop_muon_cao: '≥40% muộn / không làm',
  lech_lop_khac: 'Lệch xa so với các em ở lớp khác',
  dong_khong_du_lieu: 'Đóng mà không có dữ liệu',
  et_thieu_o: 'Còn ô chưa chấm',
  hs_vang_co_diem: 'HS vắng mà có điểm',
  khong_hs: 'Không HS nào có mặt',
  thieu_gio: 'Thiếu giờ',
  ket_thuc_le: 'Giờ kết thúc ≤ giờ bắt đầu',
  gio_bat_thuong: 'Giờ ngoài 7h–22h30',
  trung_khung: 'Chồng giờ với ca khác',
  chua_danh_gia: 'Chưa đánh giá ca',
}
