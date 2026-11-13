// MỤC TIÊU TUẦN của học sinh (spec-muc-tieu-tuan.md, Thùy chốt 12–13/11) — một bộ hàm DB, ba người xem:
// app HS (fn_mtt_cua_toi) · ERP tab trung tâm (fn_mtt_trung_tam, fn_mtt_hs, fn_mtt_chot_lop) · app phụ huynh (repo bkdemy-ph-app, FDW).
// MỌI con số tính ở Postgres (mig 202611131000: _mtt_tinh) — file này chỉ gọi hàm + định dạng hiển thị (CLAUDE §2.0).
import { supabase } from './supabase'

export type MucDanhGia = 'tot' | 'tam_on' | 'chua_tot'
export type LoaiViec = 'et' | 'btvn' | 'sau_gio' | 'bo_tro'
export type TrangThaiViec = 'xong' | 'cho_cham' | 'sap_toi' | 'chua_nop' | 'vang' | 'xin_phep'

// 1 nhóm bài trên tờ. p / p_dau / mt = % (0–100) · mt = mục tiêu TUẦN (null = tuần này không có lần đo nào) · dich = đích dài hạn 80
export type MttNhom = {
  ma: string; ten: string; phan: 1 | 2
  p: number | null; n: number | null; p_dau: number | null; d: number | null; mt: number | null; dich: number
  k: number; tong_dang: number; ngay_hoc: string[]; tien: number | null; tien_dau: number | null
}
export type MttViec = {
  loai: LoaiViec; buoi_id: string; ngay: string; han: string | null; tt: TrangThaiViec
  pct: number | null; so_cau: number | null; muc: MucDanhGia | null
  thai_do: string | null; nop: string | null; dd: string | null; ghi_chu: string | null
  nhom: string[] | null; gio: string | null; phong: string | null
}
export type MttTo = {
  tuan: string; den_ngay: string; mon: string; chot: boolean
  hs: { id: string; ten: string; khoi: string | null; lop_id: string | null; lop: string | null }
  tien_do: number | null; tien_do_dau: number | null; tien_do_d: number | null
  nhom: MttNhom[]; xep_hang_cho: { ma: string; ten: string; p: number }[]
  sap_hoc: { ngay: string; nhom: string[] } | null
  viec: MttViec[]; viec_tong: number; viec_xong: number; viec_den_han: number
  tu_luyen: { so_cau: number; so_luot: number; pct: number | null; nhom: string[] }
  tinh_at: string; hang?: number | null; hang_truoc?: number | null; hang_doi?: number | null; so_hs?: number | null; so_tinh_at?: string | null; da_chot_so?: boolean
}
export type MttChuaChot = { chua_chot: true; tuan: string; mon: string }
export type MttKetQua = MttTo | MttChuaChot | null
export const laChuaChot = (x: MttKetQua): x is MttChuaChot => !!x && 'chua_chot' in x

export type MttTuanCu = { tuan: string; tien_do: number | null; viec_xong: number; viec_tong: number; hang: number | null; so_hs: number | null; nhom: { ma: string; ten: string; p: number | null }[] }
export type MttTop = { tuan: string; tinh_at: string | null; ds: { hang: number; ten: string; lop: string | null; tien_do: number }[] }

export type MttLopTT = {
  lop_id: string; ten_lop: string; si_so: number; chot_at: string | null
  so_buoi: number; so_buoi_co_tl: number; bo_tro_cho: number
  tien_do_tb: number | null; tien_do_dau_tb: number | null; viec_xong: number; viec_den_han: number
  btvn_tot: number; btvn_tam_on: number; btvn_chua_tot: number; chua_lam: number
  tien_do_d: number | null; viec_pct: number | null
}
export type MttTrungTam = {
  tuan: string; dang_chay: boolean; tinh_at: string | null
  tong: {
    so_em: number; tien_do_tb: number | null; tien_do_dau_tb: number | null; tien_do_d: number | null; viec_xong: number; viec_den_han: number; viec_pct: number | null
    btvn_tot: number; btvn_tam_on: number; btvn_chua_tot: number; chua_lam: number
    thai_do: { nghiem_tuc: number; chua_het_suc: number; chua_nghiem_tuc: number; chong_doi: number }
  }
  lop: MttLopTT[]
  em: { id: string; ten: string; lop: string | null; tien_do: number | null; viec_xong: number; viec_den_han: number; ly_do: string[] }[]
}

// ── gọi hàm DB ───────────────────────────────────────────────────────────────
export async function mttCuaToi(mon: string, tuan?: string | null): Promise<MttKetQua> {
  const { data, error } = await supabase.rpc('fn_mtt_cua_toi', { p_mon: mon, p_tuan: tuan ?? null })
  if (error) throw error
  return (data ?? null) as MttKetQua
}
export async function mttCuaHs(hsId: string, mon: string, tuan?: string | null): Promise<MttKetQua> {
  const { data, error } = await supabase.rpc('fn_mtt_hs', { p_hs: hsId, p_mon: mon, p_tuan: tuan ?? null })
  if (error) throw error
  return (data ?? null) as MttKetQua
}
export async function mttCacTuan(mon: string, hsId?: string | null, so = 8): Promise<MttTuanCu[]> {
  const { data, error } = await supabase.rpc('fn_mtt_cac_tuan', { p_mon: mon, p_hs: hsId ?? null, p_so: so })
  if (error) throw error
  return (data ?? []) as MttTuanCu[]
}
export async function mttTop(mon: string, tuan?: string | null): Promise<MttTop | null> {
  const { data, error } = await supabase.rpc('fn_mtt_top', { p_mon: mon, p_tuan: tuan ?? null })
  if (error) throw error
  return (data ?? null) as MttTop | null
}
export async function mttTrungTam(mon: string, khoi: string, tuan?: string | null): Promise<MttTrungTam> {
  const { data, error } = await supabase.rpc('fn_mtt_trung_tam', { p_mon: mon, p_khoi: khoi, p_tuan: tuan ?? null })
  if (error) throw error
  return data as MttTrungTam
}
export async function mttChotLop(lopId: string, tuan?: string | null): Promise<{ tuan: string; lop_id: string; chot_at: string; da_tinh: number; tong: number }> {
  const { data, error } = await supabase.rpc('fn_mtt_chot_lop', { p_lop: lopId, p_tuan: tuan ?? null })
  if (error) throw error
  return data
}

// ── định dạng hiển thị (không tính nghiệp vụ) ────────────────────────────────
export const NHAN_MUC: Record<MucDanhGia, string> = { tot: 'Tốt', tam_on: 'Tạm ổn', chua_tot: 'Chưa tốt' }
export const TEN_VIEC: Record<LoaiViec, string> = { et: 'Bài trên lớp', btvn: 'Bài về nhà', sau_gio: 'Test sau giờ', bo_tro: 'Bổ trợ yếu' }
export const NHAN_TT: Record<TrangThaiViec, string> = {
  xong: 'Đã xong', cho_cham: 'Đã nộp · chờ chấm', sap_toi: 'Sắp tới', chua_nop: 'Chưa nộp', vang: 'Vắng', xin_phep: 'Xin phép',
}
export const NHAN_THAI_DO: Record<string, string> = {
  nghiem_tuc: 'Nghiêm túc', chua_het_suc: 'Chưa hết sức', chua_nghiem_tuc: 'Chưa nghiêm túc', chong_doi: 'Chống đối',
}

// 'YYYY-MM-DD' → 'dd/mm' (không qua Date: CLAUDE §2 cấm new Date('YYYY-MM-DD') cho ngày local)
export const ngayNgan = (d: string | null | undefined) => (d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '')
const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
export function thuNgan(d: string): string {
  const [y, m, n] = d.split('-').map(Number)
  return THU[new Date(Date.UTC(y, m - 1, n)).getUTCDay()]
}
export const thuNgay = (d: string | null | undefined) => (d ? `${thuNgan(d)} ${ngayNgan(d)}` : '')
export const tenTuan = (tuan: string, den: string) => `${ngayNgan(tuan)} – ${ngayNgan(den)}`
// cộng ngày trên chuỗi 'YYYY-MM-DD' (Date.UTC, không lệch múi giờ)
export function congNgay(d: string, so: number): string {
  const [y, m, n] = d.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, n + so))
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`
}
// thứ Hai của tuần hiện tại theo giờ VN
export function dauTuanNay(): string {
  const vn = new Date(Date.now() + 7 * 3600 * 1000)
  const d = `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`
  const thu = vn.getUTCDay()
  return congNgay(d, -((thu + 6) % 7))
}
export const gioPhut = (t: string | null | undefined) =>
  t ? new Date(t).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }) : ''

// dòng phụ của 1 việc (chữ formal — dùng chung HS / ERP; app HS có thể đè bằng giọng style)
export function moTaViec(v: MttViec): string {
  const nhom = (v.nhom ?? []).filter(Boolean).join(' · ')
  if (v.loai === 'btvn') {
    if (v.tt === 'sap_toi') return [nhom, v.han ? `hạn trước buổi ${thuNgay(v.han)}` : ''].filter(Boolean).join(' · ')
    if (v.tt === 'chua_nop') return [nhom, 'chưa nộp'].filter(Boolean).join(' · ')
    if (v.tt === 'cho_cham') return [nhom, 'đã nộp, đang chấm'].filter(Boolean).join(' · ')
    return [nhom, v.nop === 'nop_muon' ? 'nộp muộn' : v.nop === 'nop_dung_han' ? 'nộp đúng hạn' : ''].filter(Boolean).join(' · ')
  }
  if (v.loai === 'sau_gio' || v.loai === 'bo_tro') return [nhom, v.gio ? `${v.gio}` : '', v.phong ? `phòng ${v.phong}` : ''].filter(Boolean).join(' · ')
  return nhom
}
// chênh so với đầu tuần (d do DB tính) — nhãn hiển thị
export function nhanChenh(p: number | null, d: number | null): { chu: string; huong: 'len' | 'xuong' | 'ngang' | 'moi' } | null {
  if (p == null) return null
  if (d == null) return { chu: 'mới đo', huong: 'moi' }
  return d > 0 ? { chu: `▲ ${d}`, huong: 'len' } : d < 0 ? { chu: `▼ ${-d}`, huong: 'xuong' } : { chu: '= 0', huong: 'ngang' }
}
