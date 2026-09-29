// ============================================================================
// BÁO CÁO NGÀY của trợ lý — theo MẪU CEO gửi 29/09 ("hỏi là phụ, tính năng chính là báo cáo").
//
// File này CHỈ gọi hàm + khai kiểu. Mọi con số tính ở Postgres (`fn_troly_bao_cao_ngay`,
// mig 202609290201) — đúng luật §2.0. Đừng thêm reduce/filter().length nghiệp vụ ở đây hay ở
// màn hình: cần số mới thì thêm vào hàm DB.
// ============================================================================
import { supabase } from './supabase'

// Dòng của mẫu mà hệ CHƯA CÓ NGUỒN dữ liệu — hiện nguyên lý do, không bịa số (luật nói, SPEC §3).
export type ChuaCoNguon = { chua_co_nguon: true; ly_do: string }

export type TinhTrangKhau = 'khong_co_de' | 'dong_ma_trong' | 'trong' | 'co_du_lieu_chua_dong' | 'da_dong'
export type HanTT = 'dong_muon' | 'dung_han' | 'qua_han' | 'con_han'

export type TomTatKhau = {
  so_lop: number; co_de: number; co_du_lieu: number; da_dong_du: number
  lop_khong_co_de: string[]; lop_trong: string[]; lop_dong_ma_trong: string[]
  lop_co_du_lieu_chua_dong: string[]; lop_dong_muon: string[]; lop_qua_han_chua_dong: string[]
  lop_thieu_hoc_sinh: string[]; lop_khong_nhan_xet: string[]
}
export type LopKhau = {
  ten_lop: string; mon: string; co_de: boolean; so_co_mat: number
  hs_co_du_lieu: number; hs_co_nhan_xet: number; hs_thieu: string[]
  da_dong: boolean; dong_luc: string | null; han: string | null
  tinh_trang: TinhTrangKhau; han_tt: HanTT
}
export type MucKhau = { khau: string; tom_tat: TomTatKhau; lop: LopKhau[] }

export type HsBaoDongDiem = { ho_ten: string; ten_lop: string; diem_pct: number; tb_lop_pct: number }
export type BaoDongET = { hoc_sinh: HsBaoDongDiem[]; lop_da_xet: string[]; lop_chua_xet_duoc: string[]; nguong: string }
export type BaoDongDanhGia = {
  hoc_sinh: { ho_ten: string; ten_lop: string; muc: string | null; gv_bam_chuong: boolean; nhan_xet: string | null }[]
  nguong: string
}

export type LopBtvn = {
  ten_lop: string; mon: string; buoi_giao: string | null; co_giao: boolean
  so_co_mat: number; hs_co_du_lieu: number; da_dong: boolean; dong_luc: string | null; han: string | null
  tinh_trang: TinhTrangKhau | 'khong_gan_btvn' | 'khong_co_buoi_truoc'; han_tt: HanTT; khong_hop_le: boolean
  hs_bo_trong: string[]; hs_thieu_trang_thai_nop: string[]; hs_thieu_thai_do: string[]; hs_nop_ma_khong_co_diem: string[]
}
export type MucBtvn = {
  tom_tat: {
    so_lop: number; co_giao_btvn: number; co_du_lieu: number
    lop_khong_gan_btvn: string[]; lop_khong_co_buoi_truoc: string[]; lop_trong: string[]; lop_dong_ma_trong: string[]
    lop_co_du_lieu_chua_dong: string[]; lop_dong_muon: string[]; lop_qua_han_chua_dong: string[]
    lop_chi_tiet_khong_hop_le: string[]
  }
  lop: LopBtvn[]
  khong_lam: {
    ho_ten: string; ten_lop: string; buoi_giao: string; thai_do: string | null
    so_lan_khong_lam: number; so_bai_da_ghi: number; so_chuong_btvn: number; dang_bo_tro_yeu: boolean
  }[]
  tac_dong: ChuaCoNguon
  co_van_de: {
    ho_ten: string; ten_lop: string; trang_thai_nop: string | null; thai_do: string | null
    diem_pct: number | null; tb_lop_pct: number | null; vi: ('thai_do' | 'diem_thap')[]
  }[]
  nguong: string
}

export type TinhTrangBu = 'khong_bu' | 'da_hoc_bu' | 'da_xep_chua_hoc' | 'da_xep_nhung_truot' | 'chua_xep'
export type MucBu = {
  vang_trong_ngay: {
    so_luot: number; theo_tinh_trang: Partial<Record<TinhTrangBu, number>>
    hoc_sinh: { ho_ten: string; ten_lop: string; loai: string; tinh_trang: TinhTrangBu }[]
  }
  ton_14_ngay: {
    so_luot_vang: number; chua_xep: number; chua_xep_qua_48h: number; da_xep_nhung_truot: number
    da_xep_chua_hoc: number; da_hoc_bu: number; khong_bu: number
    can_xu_ly: { ho_ten: string; ten_lop: string; ngay_vang: string; tinh_trang: TinhTrangBu; so_ngay: number }[]
  }
  buoi_bu_trong_ngay: {
    so_luot: number; co_mat: number; vang: number; chua_diem_danh: number; bi_huy: number; co_mat_chua_dong_ho_so: number
    hoc_sinh: { ho_ten: string; gio: string | null; bu_cho: string | null; diem_danh: string | null; bi_huy: boolean }[]
  }
  ghi_chu: string
}

export type KetQuaCaYeu =
  | 'hop_le' | 'khong_hop_le_khong_test' | 'co_mat_chua_dong_ca' | 'huy_hs_khong_den' | 'huy_khac'
  | 'vang_chua_huy' | 'qua_ngay_khong_dien_ra' | 'cho_hoc'
export type GomCaYeu = {
  tu: string; den: string; so_luot_da_xep: number; so_ca: number; da_chay: number
  hop_le: number; khong_hop_le_khong_test: number; co_mat_chua_dong_ca: number
  huy_hs_khong_den: number; huy_khac: number; vang_chua_huy: number; qua_ngay_khong_dien_ra: number; cho_hoc: number
  luot?: { ngay: string; gio: string | null; mon: string; nguoi_day: string | null; ho_ten: string; ten_lop: string | null; ket_qua: KetQuaCaYeu; ly_do_huy: string | null }[]
}
export type MucBoTroYeu = {
  ca_trong_ngay: GomCaYeu
  ca_ngay_truoc: GomCaYeu
  retest_trong_ngay: { so_bai: number; da_nop: number; hoc_sinh: { ho_ten: string; ten_lop: string | null; da_nop: boolean }[] }
  retest_qua_han: { so_bai: number; hoc_sinh: { ho_ten: string; ten_lop: string | null; ngay_hen: string; tre_ngay: number }[] }
  duyet_3_ngay: {
    tu: string; den: string; so_luot_duyet: number; may_de_xuat_bo_tro: number; chot_bo_tro: number; chot_khong_bo_tro: number
    theo_ngay: { ngay: string; so_luot: number; chot_bo_tro: number }[]
  }
  hang_doi_cho_duyet: ChuaCoNguon
  trang_thai_case: Partial<Record<'cho_noi_dung' | 'can_xep' | 'da_xep' | 'cho_retest' | 'cho_danh_gia', number>>
}
export type MucBoTroTuan = {
  tu: string; den: string
  duyet: {
    so_luot_duyet: number; may_de_xuat_bo_tro: number; chot_bo_tro: number; chot_khong_bo_tro: number
    dot: { ngay: string; thu: string; so_luot: number; may_de_xuat_bo_tro: number; chot_bo_tro: number }[]
  }
  case_mo_trong_tuan: {
    so_case: number; da_xep_buoi: number; chua_xep_buoi: number
    do_tre_xep_tb_ngay: number | null; tu_mo_toi_ngay_hoc_tb_ngay: number | null
  }
  ca_trong_tuan: GomCaYeu
}

export type BaoCaoNgay = {
  ngay: string; thu: string; da_dien_ra: boolean; tao_luc: string
  buoi: { so_lop_co_buoi: number; lop: string[] }
  lop_co_lich_khong_co_buoi: { ten_lop: string; gio: string; bi_huy: boolean }[]
  btvn: MucBtvn
  et: MucKhau & { bao_dong: BaoDongET }
  trong_buoi: MucKhau & { hs_lam_cham: ChuaCoNguon }
  sau_buoi: MucKhau & { bao_dong: BaoDongDanhGia }
  bo_tro_bu: MucBu
  bo_tro_yeu: MucBoTroYeu
  bo_tro_tuan: MucBoTroTuan
  gia_dinh: string[]
}

// Trợ lý chỉ mở cho nhóm được cấp (CEO 29/09: Thùy · Thùy Trang · Bảo Lộc). Rào thật nằm trong
// từng hàm `fn_troly_*` ở DB; tab bị ẩn ở NhanSuHome bằng cờ chung với tab Hỏi hệ thống.
// `ngay` = 'YYYY-MM-DD'; bỏ trống = hôm qua (ngày gần nhất đã diễn ra trọn).
export async function getBaoCaoNgay(ngay?: string | null): Promise<BaoCaoNgay> {
  const { data, error } = await supabase.rpc('fn_troly_bao_cao_ngay', { p_ngay: ngay ?? null })
  if (error) throw error
  return data as BaoCaoNgay
}

// ── Ngày giờ VN, KHÔNG toISOString / new Date('YYYY-MM-DD') (CLAUDE.md §2) ──────
export const homNayVN = (): string => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
export function congNgay(ngay: string, n: number): string {
  const [y, m, d] = ngay.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`
}
export const ddmm = (ngay: string | null | undefined): string => (ngay ? `${ngay.slice(8, 10)}/${ngay.slice(5, 7)}` : '—')
