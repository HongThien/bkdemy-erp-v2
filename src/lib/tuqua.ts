// Data-layer TỦ QUÀ (seam) — hệ đổi quà thanh toán bằng XU (sổ chung qlht_xu_ledger, BK chỉ có 1 xu).
// DB layer nền của Hải, viết lại theo style ERP (mig 202608300908): client CHỈ gọi fn_tuqua_* + đọc
// view/list thô — KHÔNG tính số dư/tồn ở client (CLAUDE §2.0; công thức 1 nguồn = fn/view Postgres).
// 2 story (Thùy 30/08): đổi TẠI TỦ giao ngay · HS ĐẶT quà trước → duyệt trừ xu → quà về → ra tủ nhận.
import { supabase } from './supabase'
import { uploadKhoFile } from './kho/api'

const LIMIT = 2000

// ── Types (khớp bảng/view qlht_*) ──────────────────────────────────
export type SoDuXu = {
  hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; khoi: string | null
  anh_url: string | null; trang_thai: string; so_du: number; xu_kiem: number; xu_dieu_chinh: number
}
export type TonQua = {
  qua_id: string; ten: string; gia_xu: number; anh_url: string | null
  mo_ta: string | null; dang_ban: boolean; ton: number
}
export type HSNhung = { ho_ten: string; ma_hs: string | null; anh_url: string | null } | null
export type DoiQua = {
  id: string; hoc_sinh_id: string; qua_id: string; so_luong: number; xu_tru: number
  trang_thai: 'cho_giao' | 'da_giao' | 'huy'
  giao_luc: string | null; ly_do_huy: string | null; created_at: string
  hoc_sinh: HSNhung; qlht_qua: { ten: string; anh_url: string | null } | null
}
export type QuaOrder = {
  id: string; hoc_sinh_id: string; mo_ta: string; link_tham_khao: string | null
  gia_xu: number | null
  trang_thai: 'cho_duyet' | 'da_duyet' | 'da_ve' | 'da_giao' | 'tu_choi' | 'huy'
  ghi_chu: string | null; ly_do_huy: string | null
  duyet_luc: string | null; ve_luc: string | null; giao_luc: string | null; created_at: string
  hoc_sinh: HSNhung
}
export type QuaNhap = {
  id: string; qua_id: string; so_luong: number; so_luong_thuc: number | null
  trang_thai: 'cho_vao_kho' | 'da_vao_kho' | 'huy'
  ghi_chu: string | null; ly_do_huy: string | null; created_at: string
  qlht_qua: { ten: string } | null
}
export type XuLedgerRow = {
  id: string; amount: number; loai: string; ly_do: string | null; created_at: string
}

// ── Đọc: số dư + catalog/tồn (view — số tính ở DB) ─────────────────
// List HS đang học kèm số dư — nguồn cho SearchSelect màn đổi (list thô để render, không tính gì).
export async function listSoDuXu(): Promise<SoDuXu[]> {
  const { data, error } = await supabase.from('qlht_v_so_du_xu')
    .select('hoc_sinh_id, ho_ten, ma_hs, khoi, anh_url, trang_thai, so_du, xu_kiem, xu_dieu_chinh')
    .eq('trang_thai', 'dang_hoc').order('ho_ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as SoDuXu[]
}
export async function getSoDuXu(hocSinhId: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_tuqua_so_du', { p_hoc_sinh_id: hocSinhId })
  if (error) throw error
  return Number(data ?? 0)
}
export async function listTonQua(): Promise<TonQua[]> {
  const { data, error } = await supabase.from('qlht_v_ton_qua').select('*').order('ten').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as TonQua[]
}
// Sổ xu của 1 HS (hiện lịch sử ở màn đổi — đọc thô, không tổng hợp).
export async function listXuLedger(hocSinhId: string, limit = 15): Promise<XuLedgerRow[]> {
  const { data, error } = await supabase.from('qlht_xu_ledger')
    .select('id, amount, loai, ly_do, created_at')
    .eq('hoc_sinh_id', hocSinhId).order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as XuLedgerRow[]
}

// ── Đổi quà tại tủ ─────────────────────────────────────────────────
export async function doiQua(hocSinhId: string, quaId: string, soLuong: number, giaoNgay: boolean): Promise<{ doiQuaId: string; soDuMoi: number }> {
  const { data, error } = await supabase.rpc('fn_tuqua_doi', {
    p_hoc_sinh_id: hocSinhId, p_qua_id: quaId, p_so_luong: soLuong, p_giao_ngay: giaoNgay,
  })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return { doiQuaId: row.doi_qua_id, soDuMoi: Number(row.so_du_moi) }
}
export async function giaoDoiQua(doiQuaId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_doi_giao', { p_doi_qua_id: doiQuaId })
  if (error) throw error
}
export async function huyDoiQua(doiQuaId: string, lyDo: string): Promise<number> {
  const { data, error } = await supabase.rpc('fn_tuqua_doi_huy', { p_doi_qua_id: doiQuaId, p_ly_do: lyDo })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return Number(row.so_du_moi)
}
const DOI_QUA_COLS = 'id, hoc_sinh_id, qua_id, so_luong, xu_tru, trang_thai, giao_luc, ly_do_huy, created_at, hoc_sinh(ho_ten, ma_hs, anh_url), qlht_qua(ten, anh_url)'
export async function listDoiQuaCuaHS(hocSinhId: string, limit = 10): Promise<DoiQua[]> {
  const { data, error } = await supabase.from('qlht_doi_qua').select(DOI_QUA_COLS)
    .eq('hoc_sinh_id', hocSinhId).order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as unknown as DoiQua[]
}
// Các lượt đổi đang CHỜ GIAO (mọi HS) — hàng đợi tủ.
export async function listDoiQuaChoGiao(): Promise<DoiQua[]> {
  const { data, error } = await supabase.from('qlht_doi_qua').select(DOI_QUA_COLS)
    .eq('trang_thai', 'cho_giao').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as unknown as DoiQua[]
}

// ── Order quà theo yêu cầu ─────────────────────────────────────────
export async function taoOrder(hocSinhId: string, moTa: string, link: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('fn_tuqua_order_tao', { p_hoc_sinh_id: hocSinhId, p_mo_ta: moTa, p_link: link })
  if (error) throw error
  return data as string
}
export async function duyetOrder(orderId: string, giaXu: number): Promise<number> {
  const { data, error } = await supabase.rpc('fn_tuqua_order_duyet', { p_order_id: orderId, p_gia_xu: giaXu })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return Number(row.so_du_moi)
}
export async function tuChoiOrder(orderId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_order_tu_choi', { p_order_id: orderId, p_ly_do: lyDo })
  if (error) throw error
}
export async function orderVe(orderId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_order_ve', { p_order_id: orderId })
  if (error) throw error
}
export async function orderGiao(orderId: string): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_order_giao', { p_order_id: orderId })
  if (error) throw error
}
export async function huyOrder(orderId: string, lyDo: string): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_order_huy', { p_order_id: orderId, p_ly_do: lyDo })
  if (error) throw error
}
const ORDER_COLS = 'id, hoc_sinh_id, mo_ta, link_tham_khao, gia_xu, trang_thai, ghi_chu, ly_do_huy, duyet_luc, ve_luc, giao_luc, created_at, hoc_sinh(ho_ten, ma_hs, anh_url)'
// Đơn đang sống (chờ duyệt / đã duyệt / đã về) — hàng đợi xử lý.
export async function listOrderDangSong(): Promise<QuaOrder[]> {
  const { data, error } = await supabase.from('qlht_qua_order').select(ORDER_COLS)
    .in('trang_thai', ['cho_duyet', 'da_duyet', 'da_ve']).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as unknown as QuaOrder[]
}
export async function listOrderGanDay(limit = 20): Promise<QuaOrder[]> {
  const { data, error } = await supabase.from('qlht_qua_order').select(ORDER_COLS)
    .in('trang_thai', ['da_giao', 'tu_choi', 'huy']).order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return (data ?? []) as unknown as QuaOrder[]
}

// ── Catalog + nhập kho ─────────────────────────────────────────────
export async function themQua(ten: string, giaXu: number, anhUrl: string | null, moTa: string | null): Promise<string> {
  const { data, error } = await supabase.rpc('fn_tuqua_qua_them', { p_ten: ten, p_gia_xu: giaXu, p_anh_url: anhUrl, p_mo_ta: moTa })
  if (error) throw error
  return data as string
}
export async function suaQua(quaId: string, ten: string, giaXu: number, anhUrl: string | null, moTa: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_qua_sua', { p_qua_id: quaId, p_ten: ten, p_gia_xu: giaXu, p_anh_url: anhUrl, p_mo_ta: moTa })
  if (error) throw error
}
export async function setQuaDangBan(quaId: string, dangBan: boolean): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_qua_dang_ban', { p_qua_id: quaId, p_dang_ban: dangBan })
  if (error) throw error
}
export async function uploadQuaAnh(file: File): Promise<string> { return (await uploadKhoFile(file)).url }

export async function taoNhap(quaId: string, soLuong: number, ghiChu: string | null): Promise<{ nhapId: string; trangThaiMoi: string }> {
  const { data, error } = await supabase.rpc('fn_tuqua_nhap_tao', { p_qua_id: quaId, p_so_luong: soLuong, p_ghi_chu: ghiChu })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return { nhapId: row.nhap_id, trangThaiMoi: row.trang_thai_moi }
}
export async function xacNhanNhap(nhapId: string, soLuongThuc: number | null): Promise<number> {
  const { data, error } = await supabase.rpc('fn_tuqua_nhap_xac_nhan', { p_nhap_id: nhapId, p_so_luong_thuc: soLuongThuc })
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  return Number(row.ton_moi)
}
export async function huyNhap(nhapId: string, lyDo: string | null): Promise<void> {
  const { error } = await supabase.rpc('fn_tuqua_nhap_huy', { p_nhap_id: nhapId, p_ly_do: lyDo })
  if (error) throw error
}
export async function listNhapChoXacNhan(): Promise<QuaNhap[]> {
  const { data, error } = await supabase.from('qlht_qua_nhap')
    .select('id, qua_id, so_luong, so_luong_thuc, trang_thai, ghi_chu, ly_do_huy, created_at, qlht_qua(ten)')
    .eq('trang_thai', 'cho_vao_kho').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as unknown as QuaNhap[]
}
