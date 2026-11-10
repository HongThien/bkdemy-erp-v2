// Data-layer QUẢN LÝ PHÒNG HỌC (kiểu khách sạn — phòng nào giờ nào có ai dùng, tránh trùng).
// `phong` = danh mục chuẩn. Buổi chính khóa/bổ trợ VẪN lưu `ma_phong` dạng text ở
// buoi_hoc.phong/thoi_khoa_bieu.phong (không đổi sang FK — xem ghi chú cuối migration
// 202608171357_phong_va_hoat_dong_phong.sql); nguồn thứ 3 (hoạt động phát sinh) dùng FK sạch.
import { supabase } from './supabase'

const LIMIT = 10000

export type Phong = {
  id: string
  ma_phong: string
  ten_phong: string
  suc_chua: number | null
  thu_tu: number
  dang_hoat_dong: boolean
  ghi_chu: string | null
}

export async function listPhong(includeInactive = false): Promise<Phong[]> {
  let q = supabase.from('phong').select('*').order('thu_tu').limit(LIMIT)
  if (!includeInactive) q = q.eq('dang_hoat_dong', true)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as Phong[]
}

export async function createPhong(p: { ma_phong: string; ten_phong: string; suc_chua?: number | null; thu_tu: number; ghi_chu?: string | null }): Promise<Phong> {
  const { data, error } = await supabase.from('phong').insert(p).select().single()
  if (error) throw error
  return data as Phong
}

export async function updatePhong(id: string, patch: Partial<Pick<Phong, 'ma_phong' | 'ten_phong' | 'suc_chua' | 'thu_tu' | 'ghi_chu'>>): Promise<void> {
  const { error } = await supabase.from('phong').update(patch).eq('id', id)
  if (error) throw error
}

export async function dongPhong(id: string): Promise<void> {
  const { error } = await supabase.from('phong').update({ dang_hoat_dong: false }).eq('id', id)
  if (error) throw error
}
export async function moLaiPhong(id: string): Promise<void> {
  const { error } = await supabase.from('phong').update({ dang_hoat_dong: true }).eq('id', id)
  if (error) throw error
}

// ── Hoạt động phát sinh ──────────────────────────────────────────────────
export type LoaiHoatDong = 'hop_noi_bo' | 'hoc_tap_ngoai_lich' | 'viec_khac'
export const LOAI_HOAT_DONG_NHAN: Record<LoaiHoatDong, string> = {
  hop_noi_bo: 'Họp / sự kiện nội bộ',
  hoc_tap_ngoai_lich: 'Học tập ngoài lịch',
  viec_khac: 'Việc khác (dọn phòng, sửa chữa…)',
}
export type HoatDongPhong = {
  id: string; phong_id: string; ngay: string; gio_bat_dau: string; gio_ket_thuc: string
  loai: LoaiHoatDong; tieu_de: string; mon: string | null; ghi_chu: string | null
  nguoi_tao_id: string | null; trang_thai: 'xac_nhan' | 'huy'
}

export async function getHoatDongPhong(id: string): Promise<HoatDongPhong> {
  const { data, error } = await supabase.from('hoat_dong_phong').select('*').eq('id', id).single()
  if (error) throw error
  return data as HoatDongPhong
}

export async function createHoatDongPhong(p: {
  phong_id: string; ngay: string; gio_bat_dau: string; gio_ket_thuc: string
  loai: LoaiHoatDong; tieu_de: string; mon?: string | null; ghi_chu?: string | null; nguoi_tao_id?: string | null
}): Promise<HoatDongPhong> {
  const { data, error } = await supabase.from('hoat_dong_phong').insert(p).select().single()
  if (error) throw error
  return data as HoatDongPhong
}

export async function updateHoatDongPhong(id: string, patch: Partial<Pick<HoatDongPhong, 'phong_id' | 'ngay' | 'gio_bat_dau' | 'gio_ket_thuc' | 'loai' | 'tieu_de' | 'mon' | 'ghi_chu'>>): Promise<void> {
  const { error } = await supabase.from('hoat_dong_phong').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function huyHoatDongPhong(id: string): Promise<void> {
  const { error } = await supabase.from('hoat_dong_phong').update({ trang_thai: 'huy', updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function moLaiHoatDongPhong(id: string): Promise<void> {
  const { error } = await supabase.from('hoat_dong_phong').update({ trang_thai: 'xac_nhan', updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

// ── Lịch phòng MỘT NGUỒN (Thùy 10/11) ─────────────────────────────────────
// Mọi khối chiếm phòng của BK (chính khoá/TKB · bổ trợ lẻ · ca bổ trợ · lịch bổ trợ khối hằng tuần · phát sinh · test đầu vào)
// gộp ở DB: fn_phong_lich(tu, den) (mig 202611101544). Màn nào xếp lịch/kiểm trùng cũng đọc đúng hàm này — không gộp lại ở client.
export type NguonPhong = 'chinh_khoa' | 'bo_tro' | 'bo_tro_khoi' | 'phat_sinh' | 'test'
export const NGUON_PHONG_TEN: Record<NguonPhong, string> = { chinh_khoa: 'Chính khoá', bo_tro: 'Bổ trợ lẻ', bo_tro_khoi: 'Bổ trợ khối', phat_sinh: 'Phát sinh', test: 'Test đầu vào' }
export type KhoiBanPhong = {
  ngay: string
  nguon: NguonPhong
  phong_ma: string            // '' = khối có giờ nhưng CHƯA gán phòng (vd lịch khối cũ)
  gio_bat_dau: string
  gio_ket_thuc: string
  tieu_de: string
  phu_trach: string | null
  nhan_su_ids: string[]
  ref_id: string              // 'lt-<lich_truc_id>-<ngay>' = lịch khối chiếu lên ngày chưa mở ca · 'ca-<id>' · 'tkb-…' · 'test-…' · uuid buổi/phát sinh
  loai_phat_sinh?: LoaiHoatDong
  mon: string | null
  khoi: string | null
  phong_khong_khop_danh_muc: boolean
}
const mapKhoi = (r: any): KhoiBanPhong => ({ ...r, ngay: String(r.ngay).slice(0, 10), phong_ma: r.phong_ma ?? '', nhan_su_ids: r.nhan_su_ids ?? [], loai_phat_sinh: r.loai_phat_sinh ?? undefined })

// Lịch phòng của khoảng ngày [tu, den] (tối đa 63 ngày) — 1 lần gọi.
export async function lichPhongKhoang(tu: string, den: string): Promise<KhoiBanPhong[]> {
  const { data, error } = await supabase.rpc('fn_phong_lich', { p_tu: tu, p_den: den })
  if (error) throw error
  return ((data ?? []) as any[]).map(mapKhoi)
}
export async function lichPhongNgay(ngay: string): Promise<KhoiBanPhong[]> {
  return lichPhongKhoang(ngay, ngay)
}

// Khối trùng PHÒNG với (phòng, ngày, giờ) đang định lưu — DB tính (fn_phong_kiem_trung). boQuaRefId = loại chính nó ra (đang sửa).
export async function kiemTraTrungPhong(phongMa: string, ngay: string, gioBatDau: string, gioKetThuc: string, boQuaRefId?: string): Promise<KhoiBanPhong[]> {
  const { data, error } = await supabase.rpc('fn_phong_kiem_trung', { p_phong: phongMa, p_ngay: ngay, p_gio_bd: gioBatDau, p_gio_kt: gioKetThuc, p_bo_qua: boQuaRefId ?? null })
  if (error) throw error
  return ((data ?? []) as any[]).map(mapKhoi)
}

// ── Lịch bổ trợ khối (lich_truc_bo_tro) — kiểm trùng + lưu qua DB, cùng nguồn fn_phong_lich ──
export type TrungLichKhoi = {
  kieu: 'phong' | 'nguoi'
  muc: 'chan' | 'canh_bao'   // chan = không lưu được · canh_bao = lưu được nếu xác nhận (ghép phòng ≤2 ca bổ trợ)
  nguon: NguonPhong; tieu_de: string; phong: string | null; phu_trach: string | null
  gio_bat_dau: string; gio_ket_thuc: string; ngay: string[]
}
export type LichKhoiInput = {
  id: string | null; mon: string; khoi: string; bac: string; thu: number; gio_bat_dau: string; gio_ket_thuc: string
  phong: string; so_ta: number; nhan_su_id: string; nhan_su_2_id: string | null; suc_chua: number; hieu_luc_tu: string; ghi_chu: string | null
}
export async function kiemTrungLichKhoi(p: { thu: number; gio_bat_dau: string; gio_ket_thuc: string; phong: string | null; nhan_su_id: string | null; nhan_su_2_id: string | null; hieu_luc_tu: string | null; bo_qua: string | null }): Promise<TrungLichKhoi[]> {
  const { data, error } = await supabase.rpc('fn_lich_truc_kiem_trung', {
    p_thu: p.thu, p_gio_bd: p.gio_bat_dau, p_gio_kt: p.gio_ket_thuc, p_phong: p.phong, p_ns: p.nhan_su_id, p_ns2: p.nhan_su_2_id,
    p_tu: p.hieu_luc_tu, p_den: null, p_bo_qua: p.bo_qua,
  })
  if (error) throw error
  return (data ?? []) as TrungLichKhoi[]
}
export async function luuLichKhoi(x: LichKhoiInput, chapNhan: boolean): Promise<{ ok: boolean; id: string | null; trung: TrungLichKhoi[] }> {
  const { data, error } = await supabase.rpc('fn_lich_truc_luu', {
    p_id: x.id, p_mon: x.mon, p_khoi: x.khoi, p_bac: x.bac, p_thu: x.thu, p_gio_bd: x.gio_bat_dau, p_gio_kt: x.gio_ket_thuc, p_phong: x.phong,
    p_so_ta: x.so_ta, p_ns: x.nhan_su_id, p_ns2: x.nhan_su_2_id, p_suc_chua: x.suc_chua, p_hieu_luc_tu: x.hieu_luc_tu, p_ghi_chu: x.ghi_chu, p_chap_nhan: chapNhan,
  })
  if (error) throw error
  return data as any
}
