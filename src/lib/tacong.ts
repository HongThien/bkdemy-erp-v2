// Seam CHẤM CÔNG + LƯƠNG TRỢ GIẢNG (spec-cham-cong-ta.md, Thùy chốt 12–14/10). Mọi luật nằm ở Postgres
// (mig 202610122210 · 202610141233 · 202610141240): khớp lịch, làm hộ ai, cờ, 24 giờ / đợt khai lùi, lương.
// Client chỉ gọi hàm + hiển thị (CLAUDE.md §2.0). Chữ trên app: Checkin / Checkout · Ghi công / Đã ghi công.
import { supabase } from './supabase'

export type LoaiViec = { ma: string; ten: string; nhom: 'package' | 'ngoai_package'; tinh_vao: string; don_vi: 'buoi' | 'gio'; can_lop: boolean; can_hs: boolean; thu_tu: number }
export type GoiY = {
  nguon: 'buoi_thuong' | 'ca_bo_tro' | 'buoi_bo_tro'; loai_viec: string; lop_id: string | null; ten_lop: string | null
  buoi_hoc_id: string | null; ca_bo_tro_id: string | null; gio_bat_dau: string | null; gio_ket_thuc: string | null
  dang_dien_ra: boolean; da_khai: boolean
}
// Một dòng công (ca có mặt hoặc việc) kèm đối chiếu — cùng hàm với màn duyệt (_ta_doi_chieu).
export type DongCong = {
  loai_dong: 'ca' | 'viec'; id: string; cham_cong_id: string | null; nhan_su_id: string; ho_ten: string; ngay: string
  vao_at: string | null; ra_at: string | null; vao_chot: string | null; ra_chot: string | null; quen_ra: boolean
  khai_bu: boolean; nguon: string; loai_viec: string | null; ten_loai: string | null; lop_id: string | null; ten_lop: string | null
  gio_bat_dau: string | null; gio_ket_thuc: string | null; hoc_sinh: string | null; ghi_chu: string
  khop: boolean | null; co: string[]; lam_ho: string | null; duyet: 'cho_duyet' | 'da_duyet' | 'tu_choi'; ly_do_duyet: string | null
}
export type KhoangKhaiBu = { tu: string; den: string; han: string | null; ghi_chu: string }
export type LuongThang = {
  nhan_su_id: string; ho_ten: string; package_lop: number; bo_tro_gio: number; bo_tro_tien: number
  ngoai_package: number; gross: number; tien_phat: number; net: number
  chi_tiet: {
    lop: { lop: string; la_chu: boolean; si_tb: number; bac: number; tg_lam: number; so_buoi: number; ti_le_tg: number; btvn_lam: number; btvn_dinh_muc: number; ti_le_btvn: number; tien: number }[]
    bo_tro: { gio: number; so_lop: number; chi_tieu_moi_lop: number; chi_tieu: number; ti_le: number | null; tong_bac: number; lop_chinh: string | null; tien: number }
    ngoai_package: { loai: string; ngay: string; lop: string | null; so_luong: number; don_gia: number | null; thieu_don_gia: boolean }[]
    day_thay: number; tien_phat: number
  }
  // fn_ta_luong_ky (mig 202610141527): kỳ đã chốt ⇒ dòng bản chốt (da_chot, lần, lúc chốt); chưa chốt ⇒ tạm tính.
  da_chot?: boolean; lan?: number | null; chot_at?: string | null
}
// Tình trạng chốt kỳ lương (fn_ta_ky_trang_thai) — mọi điều kiện tính ở DB.
export type LichSuChot = { lan: number; chot_at: string; chot_boi: string | null; tong_net: number; so_ta: number; ghi_chu: string; mo_lai_at: string | null; mo_lai_boi: string | null; ly_do_mo_lai: string | null }
export type KyTrangThai = {
  ky: string; da_chot: boolean; lan: number | null; chot_at: string | null; chot_boi: string | null; so_ta: number | null; tong_net: number | null
  mo_chot_tu: string; cho_duyet_ca: number; cho_duyet_viec: number; quen_checkout: number
  moc_cham_cong: string; truoc_moc: boolean; co_the_chot: boolean; lich_su: LichSuChot[]
}

// Nhãn cờ (mã cờ do _ta_doi_chieu trả) — 'nhe' = thông tin, không phải mâu thuẫn.
export const NHAN_CO: Record<string, { t: string; nhe?: boolean }> = {
  quen_ra: { t: 'Quên checkout' }, khai_bu: { t: 'Khai bù', nhe: true }, nhap_ho: { t: 'Nhập hộ', nhe: true },
  ca_khong_viec: { t: 'Ca chưa ghi việc' }, buoi_huy: { t: 'Buổi đã huỷ' }, khong_co_buoi: { t: 'Không có buổi trên lịch' },
  hai_ta_cung_buoi: { t: 'Hai TA cùng buổi' }, truoc_gio_vao: { t: 'Trước giờ checkin' }, sau_gio_ra: { t: 'Sau giờ checkout' },
  trung_gio: { t: 'Trùng giờ việc khác' }, ngoai_gio: { t: 'Ngoài 7h–22h30' }, thieu_gio: { t: 'Thiếu giờ' },
  chua_don_gia: { t: 'Chưa có đơn giá', nhe: true }, ca_bi_tu_choi: { t: 'Ca bị từ chối' }, lop_chua_co_ta: { t: 'Lớp hôm đó chưa phân TA' },
}
export const nhanCo = (ma: string) => NHAN_CO[ma] ?? { t: ma }

const rpc = async <T,>(fn: string, args?: Record<string, unknown>): Promise<T> => {
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return data as T
}

// Mốc thời gian VN cho RPC timestamptz: ghép 'YYYY-MM-DD' + 'HH:MM' + '+07:00' (không qua Date/toISOString).
export const tsVN = (ngay: string, gio: string) => `${ngay}T${gio.slice(0, 5)}:00+07:00`
// 'HH:MM' giờ VN từ timestamptz server trả về.
export function gioVN(ts: string | null): string {
  if (!ts) return '—'
  const d = new Date(new Date(ts).getTime() + 7 * 3600000)
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}
export const hm = (t: string | null) => (t ? t.slice(0, 5) : '?')

export const checkin = () => rpc<string>('fn_ta_cham_cong_vao')
export const checkout = () => rpc<string>('fn_ta_cham_cong_ra')
export const khaiBuCa = (ngay: string, vao: string, ra: string) => rpc<string>('fn_ta_cham_cong_khai_bu', { p_vao: tsVN(ngay, vao), p_ra: tsVN(ngay, ra) })
export const goiYViec = () => rpc<GoiY[]>('fn_ta_hom_nay')
export const congCuaToi = (tu: string, den: string) => rpc<DongCong[]>('fn_ta_cong_cua_toi', { p_tu: tu, p_den: den })
export const khaiBuChoPhep = () => rpc<KhoangKhaiBu[]>('fn_ta_khai_bu_cho_phep')
export const boViec = (id: string) => rpc<null>('fn_ta_bo_viec', { p_id: id })
// Phiếu lương của tôi: kỳ đã chốt ⇒ bản chốt bất biến; chưa chốt ⇒ tạm tính (fn_ta_luong_ky).
export const luongCuaToi = async (ky: string, ns: string) => (await rpc<LuongThang[]>('fn_ta_luong_ky', { p_ky: ky, p_ns: ns }))[0] ?? null

export type KhaiViec = { loai: string; ngay: string; lop?: string | null; buoi?: string | null; ca?: string | null; bat?: string | null; ket?: string | null; hs?: string | null; ghiChu?: string }
export const ghiCong = (v: KhaiViec) => rpc<string>('fn_ta_khai_viec', {
  p_loai: v.loai, p_ngay: v.ngay, p_lop: v.lop ?? null, p_buoi: v.buoi ?? null, p_ca: v.ca ?? null,
  p_bat: v.bat || null, p_ket: v.ket || null, p_hs: v.hs?.trim() || null, p_ghi_chu: v.ghiChu ?? '',
})

export async function dsLoaiViec(): Promise<LoaiViec[]> {
  const { data, error } = await supabase.from('ta_loai_viec').select('ma, ten, nhom, tinh_vao, don_vi, can_lop, can_hs, thu_tu').eq('active', true).order('thu_tu').limit(100)
  if (error) throw error
  return (data ?? []) as LoaiViec[]
}
export async function dsLop(): Promise<{ id: string; ten_lop: string; mon: string }[]> {
  const { data, error } = await supabase.from('lop').select('id, ten_lop, mon').eq('trang_thai', 'dang_hoc').order('ten_lop').limit(500)
  if (error) throw error
  return data ?? []
}

// ── PHÍA QUẢN LÝ (ERP: lá ta_cong_duyet · ta_luong) — quyền chặn ở DB (co_quyen_ghi / co_chuc_nang) ──
export type ThieuCong = { loai: 'buoi' | 'ca' | 'bo_tro_bu' | 'bo_tro_yeu' | 'bo_tro_duoi'; ngay: string; lop_id: string | null; ten: string; gio_bat_dau: string | null; gio_ket_thuc: string | null; buoi_hoc_id: string | null; ca_bo_tro_id: string | null; nguoi_phu_trach: string | null }
export type DonGia = { ma: string; ten: string; si_tu: number | null; si_den: number | null; gia_tri: number; don_vi: string; hieu_luc_tu: string; dang_hieu_luc: boolean; ghi_chu: string; nguoi_dat: string | null; dat_at: string }

export const doiChieu = (tu: string, den: string) => rpc<DongCong[]>('fn_ta_doi_chieu', { p_tu: tu, p_den: den })
export const thieuCong = (tu: string, den: string) => rpc<ThieuCong[]>('fn_ta_buoi_thieu_cong', { p_tu: tu, p_den: den })
export const duyetCong = (ca: string[], viec: string[], ketQua: 'da_duyet' | 'tu_choi', lyDo?: string) =>
  rpc<number>('fn_ta_duyet_cong', { p_ca: ca, p_viec: viec, p_ket_qua: ketQua, p_ly_do: lyDo ?? null })
export const chotGio = (id: string, ngay: string, vao: string, ra: string) => rpc<null>('fn_ta_chot_gio', { p_id: id, p_vao: tsVN(ngay, vao), p_ra: tsVN(ngay, ra) })
export const nhapHoCa = (ns: string, ngay: string, vao: string, ra: string, lyDo: string) =>
  rpc<string>('fn_ta_cham_cong_nhap_ho', { p_ns: ns, p_vao: tsVN(ngay, vao), p_ra: tsVN(ngay, ra), p_ly_do: lyDo })
export const nhapHoViec = (ns: string, v: KhaiViec, lyDo: string) => rpc<string>('fn_ta_nhap_ho_viec', {
  p_ns: ns, p_loai: v.loai, p_ngay: v.ngay, p_lop: v.lop ?? null, p_buoi: v.buoi ?? null, p_ca: v.ca ?? null,
  p_bat: v.bat || null, p_ket: v.ket || null, p_hs: v.hs?.trim() || null, p_ly_do: lyDo,
})
export const bangDonGia = () => rpc<DonGia[]>('fn_ta_bang_don_gia')
// Đổi giá = THÊM dòng mới có hiệu lực từ ngày chỉ định (bảng chỉ-thêm). Bậc lương phải kèm khoảng sĩ số của bậc đó.
export const datDonGia = (ma: string, gia: number, tu: string, o: { ten?: string; siTu?: number | null; siDen?: number | null; ghiChu?: string } = {}) =>
  rpc<string>('fn_ta_dat_don_gia', { p_ma: ma, p_gia: gia, p_hieu_luc_tu: tu, p_ten: o.ten ?? null, p_si_tu: o.siTu ?? null, p_si_den: o.siDen ?? null, p_ghi_chu: o.ghiChu ?? '' })
export const luongThang = (ky: string) => rpc<LuongThang[]>('fn_ta_luong_ky', { p_ky: ky })
// Chốt kỳ (bản chụp bất biến; khoá sửa công + đơn giá lùi về tháng đó) · mở lại (bắt buộc lý do, bản cũ giữ trong lịch sử).
export const kyTrangThai = (ky: string) => rpc<KyTrangThai>('fn_ta_ky_trang_thai', { p_ky: ky })
export const chotKy = (ky: string, ghiChu = '') => rpc<number>('fn_ta_chot_ky', { p_ky: ky, p_ghi_chu: ghiChu })
export const moLaiKy = (ky: string, lyDo: string) => rpc<null>('fn_ta_mo_lai_ky', { p_ky: ky, p_ly_do: lyDo })
export async function dsNhanSuDangLam(): Promise<{ id: string; ho_ten: string; anh_url: string | null }[]> {
  const { data, error } = await supabase.from('nhan_su').select('id, ho_ten, anh_url').eq('trang_thai', 'dang_lam').order('ho_ten').limit(500)
  if (error) throw error
  return data ?? []
}
