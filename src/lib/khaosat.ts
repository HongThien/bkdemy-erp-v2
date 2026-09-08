// Data-layer seam cho KHẢO SÁT "Bạn của con ở BK" (spec-khao-sat-hs.md, CEO 08/09) — UI không gọi supabase
// trực tiếp. Mọi tổng hợp/tính toán ở Postgres (mig 202609080246): client chỉ gọi RPC/view rồi render (§2.0).
// CEO 08/09 chốt: các trường khảo sát (trường/lớp trường/nơi ở/toà/tầng/khu/nghề bố mẹ/ban PH/chức vụ toà/lý do
// vào) = THÔNG TIN CÁ NHÂN HS → sống trên `hoc_sinh`; bảng khảo sát chỉ giữ snapshot + CẠNH quan hệ.
import { supabase } from './supabase'

export const DOT_HIEN_TAI = 1
const LIMIT = 2000

export type NoiO = 'chung_cu' | 'nha_dat'
export type LyDoVao = 'ban_ru' | 'bo_me_quyet' | 'bo_me_hoi_con_chon' | 'khac'
export type CoKhong = 'co' | 'khong' | 'khong_biet'
export type QuenTu = 'cung_lop_truong' | 'cung_toa' | 'khac'
export type QuanHe = 'con_voi_ban' | 'bo_me_voi_bo_me' | 'ca_hai'
export type KetQuaRu = 'co' | 'khong' | 'chua_biet'
export type LoaiCanh = 'biet' | 'duoc_ru_boi' | 'da_ru' | 'muon_ru'

export const NOI_O_LABEL: Record<NoiO, string> = { chung_cu: 'Chung cư', nha_dat: 'Nhà đất' }
export const LY_DO_LABEL: Record<LyDoVao, string> = { ban_ru: 'Bạn rủ', bo_me_quyet: 'Bố mẹ quyết', bo_me_hoi_con_chon: 'Bố mẹ hỏi rồi con chọn', khac: 'Khác' }
export const CO_KHONG_LABEL: Record<CoKhong, string> = { co: 'Có', khong: 'Không', khong_biet: 'Không biết' }
export const QUEN_TU_LABEL: Record<QuenTu, string> = { cung_lop_truong: 'Cùng lớp ở trường', cung_toa: 'Cùng toà', khac: 'Khác' }
export const QUAN_HE_LABEL: Record<QuanHe, string> = { con_voi_ban: 'Con chơi với bạn', bo_me_voi_bo_me: 'Bố mẹ con chơi với bố mẹ bạn', ca_hai: 'Cả hai' }
export const KET_QUA_RU_LABEL: Record<KetQuaRu, string> = { co: 'Có', khong: 'Không', chua_biet: 'Chưa biết' }
export const LOAI_CANH_LABEL: Record<LoaiCanh, string> = { biet: 'Biết bạn', duoc_ru_boi: 'Được bạn rủ', da_ru: 'Đã rủ bạn', muon_ru: 'Muốn rủ bạn' }

// ── Payload nộp (1 RPC, 1 transaction) ─────────────────────────────────────────────────────────
export type CanhPayload = { loai: LoaiCanh; ten: string; ghi_chu?: string; quen_tu?: QuenTu | null; quan_he?: QuanHe | null; ket_qua_ru?: KetQuaRu | null }
export type KhaoSatPayload = {
  hoc_sinh_id: string; dot?: number; ta_bam_ho: boolean
  truong: string; lop_truong: string
  noi_o_loai: NoiO; toa?: string; tang?: string; khu?: string
  ly_do_vao?: LyDoVao | null; bo_me_ban_ph_lop?: CoKhong | null; bo_me_chuc_vu_toa?: CoKhong | null; nghe_bo_me?: string
  quan_he: CanhPayload[]
}
export async function nopKhaoSat(p: KhaoSatPayload): Promise<number> {
  const { data, error } = await supabase.rpc('fn_khao_sat_hs_nop', { p: { ...p, dot: p.dot ?? DOT_HIEN_TAI } })
  if (error) throw error
  return data as number
}

// ── Lưới lớp ───────────────────────────────────────────────────────────────────────────────────
export type LopTienDo = { lop_id: string; ten_lop: string; mon: string; khoi: string | null; si_so: number; da_lam: number }
export async function lopTienDo(dot = DOT_HIEN_TAI): Promise<LopTienDo[]> {
  const { data, error } = await supabase.rpc('fn_khao_sat_lop_tien_do', { p_dot: dot })
  if (error) throw error
  return ((data ?? []) as LopTienDo[]).map((r) => ({ ...r, si_so: Number(r.si_so), da_lam: Number(r.da_lam) }))
}
export type HsLuoi = {
  hoc_sinh_id: string; ho_ten: string; anh_url: string | null; gioi_tinh: 'nam' | 'nu' | null; khoi: string | null
  truong_hoc: string | null; lop_truong: string | null; noi_o_loai: NoiO | null; toa: string | null; tang: number | null; khu: string | null
  da_lam: boolean; nop_luc: string | null
}
export async function luoiLop(lopId: string, dot = DOT_HIEN_TAI): Promise<HsLuoi[]> {
  const { data, error } = await supabase.rpc('fn_khao_sat_luoi_lop', { p_lop: lopId, p_dot: dot })
  if (error) throw error
  return (data ?? []) as HsLuoi[]
}
export type DanhSach = { truong: string[]; toa: string[] }
export async function danhSachGoiY(): Promise<DanhSach> {
  const { data, error } = await supabase.rpc('fn_khao_sat_danh_sach')
  if (error) throw error
  return (data ?? { truong: [], toa: [] }) as DanhSach
}

// ── Khớp tên (§5) ──────────────────────────────────────────────────────────────────────────────
export type Canh = {
  id: number; loai: LoaiCanh; ten_goc: string; ghi_chu_goc: string | null; quen_tu: QuenTu | null; quan_he: QuanHe | null; ket_qua_ru: KetQuaRu | null
  tu_hoc_sinh_id: string; tu_ho_ten: string; tu_khoi: string | null; tu_truong: string | null; tu_lop_truong: string | null; tu_toa: string | null
  den_hoc_sinh_id: string | null; den_ho_ten: string | null; ngoai_bk: boolean; khop_luc: string | null; nop_luc: string
}
export async function listCanh(): Promise<Canh[]> {
  const { data, error } = await supabase.rpc('fn_khao_sat_canh')
  if (error) throw error
  return (data ?? []) as Canh[]
}
export type GoiYKhop = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null; anh_url: string | null; truong_hoc: string | null; lop_truong: string | null; toa: string | null; diem: number; ly_do: string | null }
export async function goiYKhop(canhId: number): Promise<GoiYKhop[]> {
  const { data, error } = await supabase.rpc('fn_khao_sat_goi_y_khop', { p_qh: canhId })
  if (error) throw error
  return (data ?? []) as GoiYKhop[]
}
// hocSinhId null + ngoaiBk false = bỏ khớp.
export async function khopCanh(canhId: number, hocSinhId: string | null, ngoaiBk = false): Promise<void> {
  const { error } = await supabase.rpc('fn_khao_sat_khop', { p_qh: canhId, p_hoc_sinh: hocSinhId, p_ngoai_bk: ngoaiBk })
  if (error) throw error
}

// ── Kết quả (§5 — 4 query + tổng quan; đều là view/fn ở DB) ────────────────────────────────────
export type TongQuan = {
  so_hs_dang_hoc: number; so_da_lam: number; so_canh: number; so_canh_da_khop: number; so_canh_ngoai_bk: number; uu_tien: number
  ly_do: { ly_do: LyDoVao | null; n: number }[]; loai_canh: { loai: LoaiCanh; n: number }[]; noi_o: { loai: NoiO; n: number }[]
}
export async function tongQuan(dot = DOT_HIEN_TAI): Promise<TongQuan> {
  const { data, error } = await supabase.rpc('fn_khao_sat_tong_quan', { p_dot: dot })
  if (error) throw error
  return data as TongQuan
}
export type CumTruong = { truong_hoc: string; lop_truong: string | null; so_hs: number; don_doc: boolean; hs: string[] }
export type CumToa = { toa: string; tang: number | null; so_hs: number; don_doc: boolean; hs: string[] }
export type Kenh = { quen_tu: QuenTu | null; quan_he: QuanHe | null; so_canh: number; so_hai_chieu: number }
export type VectorRow = {
  hoc_sinh_id: string; ho_ten: string; khoi: string | null; truong_hoc: string | null; lop_truong: string | null; toa: string | null; tang: number | null
  ly_do_vao: LyDoVao | null; bo_me_ban_ph_lop: CoKhong | null; bo_me_chuc_vu_toa: CoKhong | null; nghe_bo_me: string | null
  ph_ten: string | null; ph_sdt: string | null; nguoi_ru: string | null
  so_da_ru: number; so_da_ru_co: number; so_muon_ru: number; so_biet: number; uu_tien: boolean; nop_luc: string
}
export type LeadRow = { hoc_sinh_id: string; ho_ten: string; khoi: string | null; ph_ten: string | null; ph_sdt: string | null; uu_tien: boolean; so_lead: number; leads: { id: number; ten: string; ghi_chu: string | null; da_khop: boolean }[] }

async function view<T>(name: string, order: string, asc = false): Promise<T[]> {
  const { data, error } = await supabase.from(name).select('*').order(order, { ascending: asc }).limit(LIMIT)
  if (error) throw error
  return (data ?? []) as T[]
}
export const cumTruong = () => view<CumTruong>('v_khao_sat_cum_truong', 'so_hs')
export const cumToa = () => view<CumToa>('v_khao_sat_cum_toa', 'so_hs')
export const kenh = () => view<Kenh>('v_khao_sat_kenh', 'so_canh')
export const vector = () => view<VectorRow>('v_khao_sat_vector', 'so_da_ru_co')
export const lead = () => view<LeadRow>('v_khao_sat_lead', 'so_lead')
