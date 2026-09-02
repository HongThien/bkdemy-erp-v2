// Data-layer THU CHI (hoàn ứng chi tiêu nhân sự) — PLAN-thu-chi.md, Thùy chốt 02/09/2026.
// Seam: app BK Chi (nhân sự) + màn ERP "Thu chi" (Lộc) đều gọi qua đây, KHÔNG gọi supabase trực tiếp.
// Mọi tính toán/chuyển trạng thái nằm ở Postgres (fn_chi_* — migration 202609022329); client chỉ gọi RPC
// + hiển thị. Ảnh chứng từ: bucket public 'kho-anh' prefix thuchi/ (khuôn bao_loi report/).
import { supabase } from './supabase'
import { buildVietQR } from './vietqr'

// ── Types (khớp cột RPC) ─────────────────────────────────────────
export type ChiTrangThai = 'cho_duyet' | 'da_thanh_toan' | 'tu_choi' | 'huy'
export const CHI_TRANG_THAI_LABEL: Record<ChiTrangThai, string> = {
  cho_duyet: 'Chờ thanh toán', da_thanh_toan: 'Đã thanh toán', tu_choi: 'Từ chối', huy: 'Đã huỷ',
}

export type ChiDanhMuc = { id: string; ten: string; thu_tu: number; active: boolean }

export type ChiCuaToi = {
  id: string; ma: string; so_tien_bao: number; muc_dich: string; ngay_chi: string
  danh_muc_de_xuat_id: string | null; danh_muc_de_xuat_ten: string | null; anh_paths: string[]
  trang_thai: ChiTrangThai; tu_choi_ly_do: string | null; xu_ly_at: string | null; created_at: string
  so_tien_duyet: number | null; luu_y_duyet: string | null; ghi_so_at: string | null; danh_muc_duyet_ten: string | null
}

export type ChiKhoanDuyet = {
  id: string; ma: string; nhan_su_id: string; ma_ns: string | null; ho_ten: string
  bank_bin: string | null; bank_stk: string | null; bank_chu_tk: string | null
  so_tien_bao: number; muc_dich: string; ngay_chi: string; danh_muc_de_xuat_id: string | null; danh_muc_de_xuat_ten: string | null
  anh_paths: string[]; trang_thai: ChiTrangThai; tu_choi_ly_do: string | null; xu_ly_boi_ten: string | null; xu_ly_at: string | null; created_at: string
}

export type ChiSoRow = {
  id: string; chi_khoan_id: string; ma: string; ma_ns: string | null; ho_ten: string; ngay: string; so_tien: number; so_tien_bao: number
  muc_dich: string; danh_muc_id: string; danh_muc_ten: string; luu_y: string | null; ghi_so_at: string; ghi_so_boi_ten: string | null
  ky_id: string | null; ky_ma: string | null; anh_paths: string[]
}

export type ChiKyDanhMuc = { danh_muc_id: string; ten: string; so_khoan: number; so_tien: number }
export type ChiKyKhoan = { id: string; ma: string; ma_ns: string | null; ho_ten: string; ngay: string; so_tien: number; muc_dich: string; luu_y: string | null; ghi_so_at: string; danh_muc_id: string; danh_muc_ten: string }
export type ChiKyJson = {
  id: string | null; ma: string | null; tu_at: string; den_at: string; ghi_chu: string | null; chot_at: string | null; chot_boi_ten: string | null
  so_khoan: number; tong_tien: number; danh_muc: ChiKyDanhMuc[]; khoan: ChiKyKhoan[]
}
export type ChiKy = { id: string; ma: string; tu_at: string; den_at: string; so_khoan: number; tong_tien: number; ghi_chu: string | null; chot_at: string; chot_boi_ten: string | null }
export type ChiTongQuan = { cho_duyet: number; cho_duyet_tien: number; chua_chot: number; chua_chot_tien: number; ky_gan_nhat: { ma: string; den_at: string; tong_tien: number } | null }
export type NhanSuBank = { id: string; ma_ns: string | null; ho_ten: string; bank_bin: string | null; bank_stk: string | null; bank_chu_tk: string | null; so_khoan_cho: number; so_khoan_tong: number }

// ── Format (hiển thị thuần — không phải tính nghiệp vụ) ──────────
export const vnd = (n: number | null | undefined) => (n == null ? '—' : `${Math.round(Number(n)).toLocaleString('vi-VN')}đ`)
export const ddmmyyyy = (ymd: string | null | undefined) => (ymd ? `${ymd.slice(8, 10)}/${ymd.slice(5, 7)}/${ymd.slice(0, 4)}` : '—')
export function ddmmhh(iso: string | null | undefined): string {
  if (!iso) return '—'
  const t = new Date(new Date(iso).getTime() + 7 * 3600000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(t.getUTCDate())}/${p(t.getUTCMonth() + 1)}/${t.getUTCFullYear()} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}`
}
// Chuỗi số có dấu chấm ngàn ↔ number (ô nhập tiền trên mobile).
export const parseTien = (s: string) => Number(String(s).replace(/[^\d]/g, '')) || 0
export const fmtTienInput = (n: number) => (n ? n.toLocaleString('vi-VN') : '')

// ── Danh mục ─────────────────────────────────────────────────────
export async function listDanhMuc(caAn = false): Promise<ChiDanhMuc[]> {
  let q = supabase.from('chi_danh_muc').select('id, ten, thu_tu, active').order('thu_tu').order('ten').limit(200)
  if (!caAn) q = q.eq('active', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}
export async function themDanhMuc(ten: string, thu_tu: number): Promise<void> {
  const { error } = await supabase.from('chi_danh_muc').insert({ ten: ten.trim(), thu_tu })
  if (error) throw error
}
export async function suaDanhMuc(id: string, patch: Partial<Pick<ChiDanhMuc, 'ten' | 'thu_tu' | 'active'>>): Promise<void> {
  const { error } = await supabase.from('chi_danh_muc').update(patch).eq('id', id)
  if (error) throw error
}

// ── Phía nhân sự (app BK Chi) ────────────────────────────────────
export async function listChiCuaToi(): Promise<ChiCuaToi[]> {
  const { data, error } = await supabase.rpc('fn_chi_cua_toi')
  if (error) throw error
  return (data ?? []) as ChiCuaToi[]
}
export type ChiInput = { so_tien: number; muc_dich: string; ngay_chi: string; danh_muc_id: string | null; anh_paths: string[] }
export async function taoKhoanChi(i: ChiInput): Promise<string> {
  const { data, error } = await supabase.rpc('fn_chi_tao', { p_so_tien: i.so_tien, p_muc_dich: i.muc_dich, p_ngay_chi: i.ngay_chi, p_danh_muc_id: i.danh_muc_id, p_anh_paths: i.anh_paths })
  if (error) throw error
  return data as string
}
export async function suaKhoanChi(id: string, i: ChiInput): Promise<void> {
  const { error } = await supabase.rpc('fn_chi_sua', { p_id: id, p_so_tien: i.so_tien, p_muc_dich: i.muc_dich, p_ngay_chi: i.ngay_chi, p_danh_muc_id: i.danh_muc_id, p_anh_paths: i.anh_paths })
  if (error) throw error
}
export async function huyKhoanChi(id: string): Promise<void> {
  const { error } = await supabase.rpc('fn_chi_huy', { p_id: id })
  if (error) throw error
}

// STK của chính mình (3 cột trên nhan_su — RLS member cho sửa; UI app chỉ mở 3 cột này).
export type BankInfo = { bank_bin: string | null; bank_stk: string | null; bank_chu_tk: string | null }
export async function getBankCuaToi(nhanSuId: string): Promise<BankInfo> {
  const { data, error } = await supabase.from('nhan_su').select('bank_bin, bank_stk, bank_chu_tk').eq('id', nhanSuId).single()
  if (error) throw error
  return data
}
export async function luuBank(nhanSuId: string, b: BankInfo): Promise<void> {
  const patch = { bank_bin: b.bank_bin || null, bank_stk: b.bank_stk?.replace(/\s+/g, '') || null, bank_chu_tk: b.bank_chu_tk?.trim().toUpperCase() || null }
  const { error, data } = await supabase.from('nhan_su').update(patch).eq('id', nhanSuId).select('id')
  if (error) throw error
  if (!data?.length) throw new Error('Không lưu được STK (không có quyền sửa hồ sơ)')
}

// Ảnh chứng từ: thu nhỏ ≤1600px JPEG (ảnh camera 4–8MB → ~300KB) rồi upload. Trả PATH (không phải URL).
const CHI_BUCKET = 'kho-anh'
export const anhUrl = (path: string) => supabase.storage.from(CHI_BUCKET).getPublicUrl(path).data.publicUrl
export async function uploadAnhChi(file: File): Promise<string> {
  const blob = await thuNhoAnh(file).catch(() => file)
  const path = `thuchi/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`
  const { error } = await supabase.storage.from(CHI_BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  return path
}
async function thuNhoAnh(file: File, max = 1600, q = 0.85): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  bmp.close()
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob null'))), 'image/jpeg', q))
}

// ── Phía kế toán (ERP, leaf thuchi) ──────────────────────────────
export async function listKhoanDuyet(trang_thai: ChiTrangThai | null = 'cho_duyet'): Promise<ChiKhoanDuyet[]> {
  const { data, error } = await supabase.rpc('fn_chi_khoan_duyet', { p_trang_thai: trang_thai })
  if (error) throw error
  return (data ?? []) as ChiKhoanDuyet[]
}
export async function deXuatDanhMuc(chiKhoanId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('fn_chi_de_xuat_danh_muc', { p_chi_khoan_id: chiKhoanId })
  if (error) throw error
  return (data as string | null) ?? null
}
export async function tuChoiKhoan(id: string, lyDo: string): Promise<void> {
  const { error } = await supabase.rpc('fn_chi_tu_choi', { p_id: id, p_ly_do: lyDo })
  if (error) throw error
}
export type GhiSoInput = { so_tien: number; muc_dich: string; danh_muc_id: string; ngay: string; luu_y: string }
// "Đã thanh toán" + popup ghi sổ = 1 RPC transactional.
export async function thanhToanGhiSo(id: string, i: GhiSoInput): Promise<string> {
  const { data, error } = await supabase.rpc('fn_chi_thanh_toan_ghi_so', { p_id: id, p_so_tien: i.so_tien, p_muc_dich: i.muc_dich, p_danh_muc_id: i.danh_muc_id, p_ngay: i.ngay, p_luu_y: i.luu_y || null })
  if (error) throw error
  return data as string
}
export type SoFilter = { tu?: string | null; den?: string | null; danh_muc_id?: string | null; nhan_su_id?: string | null; ky_id?: string | null; chua_chot?: boolean }
export async function listSo(f: SoFilter = {}): Promise<ChiSoRow[]> {
  const { data, error } = await supabase.rpc('fn_chi_so_list', { p_tu: f.tu ?? null, p_den: f.den ?? null, p_danh_muc_id: f.danh_muc_id ?? null, p_nhan_su_id: f.nhan_su_id ?? null, p_ky_id: f.ky_id ?? null, p_chua_chot: !!f.chua_chot })
  if (error) throw error
  return (data ?? []) as ChiSoRow[]
}
// Sửa dòng sổ TRƯỚC khi chốt (trigger chặn khi đã có ky_id; số ≠ báo ⇒ luu_y bắt buộc — trigger canh).
export async function suaSo(id: string, patch: Partial<Pick<ChiSoRow, 'ngay' | 'so_tien' | 'muc_dich' | 'danh_muc_id' | 'luu_y'>>): Promise<void> {
  const { error } = await supabase.from('chi_so').update(patch).eq('id', id)
  if (error) throw error
}
export async function kyXemTruoc(): Promise<ChiKyJson> {
  const { data, error } = await supabase.rpc('fn_chi_ky_xem_truoc')
  if (error) throw error
  return data as ChiKyJson
}
export async function kyChiTiet(kyId: string): Promise<ChiKyJson> {
  const { data, error } = await supabase.rpc('fn_chi_ky_chi_tiet', { p_ky_id: kyId })
  if (error) throw error
  return data as ChiKyJson
}
export async function chotKy(ghiChu: string): Promise<string> {
  const { data, error } = await supabase.rpc('fn_chi_ky_chot', { p_ghi_chu: ghiChu || null })
  if (error) throw error
  return data as string
}
export async function listKy(): Promise<ChiKy[]> {
  const { data, error } = await supabase.rpc('fn_chi_ky_list')
  if (error) throw error
  return (data ?? []) as ChiKy[]
}
export async function tongQuan(): Promise<ChiTongQuan> {
  const { data, error } = await supabase.rpc('fn_chi_tong_quan')
  if (error) throw error
  return data as ChiTongQuan
}
export async function listNhanSuBank(): Promise<NhanSuBank[]> {
  const { data, error } = await supabase.rpc('fn_chi_nhan_su_bank')
  if (error) throw error
  return (data ?? []) as NhanSuBank[]
}
export async function luuBankNhanSu(nhanSuId: string, b: BankInfo): Promise<void> { return luuBank(nhanSuId, b) }

// ── VietQR chuyển trả cho nhân sự ────────────────────────────────
// Nội dung CK: "BK CHI <mã NS> <mã khoản>" không dấu (Thùy câu 8) — khoá đối soát sao kê.
export const noiDungCKChi = (maNs: string | null, maKhoan: string) => `BK CHI ${maNs ?? 'NS'} ${maKhoan}`.replace(/\s+/g, ' ')
export async function qrChuyenTra(k: { bank_bin: string; bank_stk: string; ma_ns: string | null; ma: string; so_tien: number }): Promise<string> {
  const QRCode = (await import('qrcode')).default
  const payload = buildVietQR({ bin: k.bank_bin, soTaiKhoan: k.bank_stk, amount: k.so_tien, addInfo: noiDungCKChi(k.ma_ns, k.ma) })
  return QRCode.toDataURL(payload, { margin: 1, width: 360, errorCorrectionLevel: 'M' })
}
export async function qrTinh(bin: string, stk: string): Promise<string> {
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(buildVietQR({ bin, soTaiKhoan: stk }), { margin: 1, width: 240, errorCorrectionLevel: 'M' })
}
