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

// ── Lịch phòng gộp 3 nguồn ────────────────────────────────────────────────
const thuOf = (ngay: string): number => { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 } // CN=8, T2=2..T7=7
const toMin = (t: string): number => { const [h, m] = t.slice(0, 5).split(':').map(Number); return h * 60 + m }
const LOAI_BOTRO_NHAN: Record<string, string> = { bu: 'bù', bo_tro_yeu: 'bổ trợ yếu', bo_tro_duoi: 'bổ trợ đuổi' }

export type NguonPhong = 'chinh_khoa' | 'bo_tro' | 'phat_sinh'
export type KhoiBanPhong = {
  nguon: NguonPhong
  phong_ma: string
  gio_bat_dau: string
  gio_ket_thuc: string
  tieu_de: string
  phu_trach: string | null
  ref_id: string
  loai_phat_sinh?: LoaiHoatDong
  phong_khong_khop_danh_muc: boolean
}

// Gộp lịch phòng của 1 ngày từ 3 nguồn. Chính khóa ưu tiên buoi_hoc THẬT (đã 'mở buổi' — có thể
// đã đổi phòng/giờ so với TKB gốc); ngày tương lai chưa mở buổi thì fallback TKB (mo_buoi tạo buổi
// lazy lúc mở — xem gami.ts:moBuoi — nên hầu hết ngày tương lai KHÔNG có buoi_hoc).
export async function lichPhongNgay(ngay: string): Promise<KhoiBanPhong[]> {
  const phongs = await listPhong(true)
  const maSet = new Set(phongs.map((p) => p.ma_phong))
  const thu = thuOf(ngay)

  const [buoiRes, tkbRes, hdRes] = await Promise.all([
    supabase.from('buoi_hoc')
      .select('id, lop_id, phong, gio_bat_dau, gio_ket_thuc, loai, lop:lop_id(ten_lop,mon), nguoi_day:nguoi_day(ho_ten), nguoi_day_tg:nguoi_day_tg(ho_ten)')
      .eq('ngay', ngay).in('loai', ['thuong', 'bu', 'bo_tro_yeu', 'bo_tro_duoi']).neq('trang_thai', 'huy').limit(LIMIT),
    supabase.from('thoi_khoa_bieu')
      .select('lop_id, phong, gio_bat_dau, gio_ket_thuc, lop:lop_id(ten_lop,mon)')
      .eq('thu', thu).lte('hieu_luc_tu', ngay).or(`hieu_luc_den.is.null,hieu_luc_den.gte.${ngay}`).limit(LIMIT),
    supabase.from('hoat_dong_phong')
      .select('id, gio_bat_dau, gio_ket_thuc, loai, tieu_de, phong:phong_id(ma_phong), nhan_su:nguoi_tao_id(ho_ten)')
      .eq('ngay', ngay).eq('trang_thai', 'xac_nhan').limit(LIMIT),
  ])
  if (buoiRes.error) throw buoiRes.error
  if (tkbRes.error) throw tkbRes.error
  if (hdRes.error) throw hdRes.error

  const out: KhoiBanPhong[] = []
  const lopIdsDaMo = new Set<string>() // lớp đã có buổi 'thuong' mở thật cho ngày này — TKB của lớp này bỏ qua, tránh đếm đôi

  for (const b of (buoiRes.data ?? []) as any[]) {
    if (b.loai === 'thuong' && b.lop_id) lopIdsDaMo.add(b.lop_id)
    const phongMa = (b.phong ?? '').trim()
    if (!phongMa || !b.gio_bat_dau || !b.gio_ket_thuc) continue // chưa gán phòng/giờ — không tính vào lịch phòng
    out.push({
      nguon: b.loai === 'thuong' ? 'chinh_khoa' : 'bo_tro',
      phong_ma: phongMa, gio_bat_dau: b.gio_bat_dau, gio_ket_thuc: b.gio_ket_thuc,
      tieu_de: b.loai === 'thuong'
        ? `${b.lop?.ten_lop ?? '?'}${b.lop?.mon ? ' · ' + b.lop.mon : ''}`
        : `${LOAI_BOTRO_NHAN[b.loai] ?? b.loai}`,
      phu_trach: b.nguoi_day_tg?.ho_ten ?? b.nguoi_day?.ho_ten ?? null,
      ref_id: b.id, phong_khong_khop_danh_muc: !maSet.has(phongMa),
    })
  }

  for (const t of (tkbRes.data ?? []) as any[]) {
    if (lopIdsDaMo.has(t.lop_id)) continue
    const phongMa = (t.phong ?? '').trim()
    if (!phongMa) continue
    out.push({
      nguon: 'chinh_khoa', phong_ma: phongMa, gio_bat_dau: t.gio_bat_dau, gio_ket_thuc: t.gio_ket_thuc,
      tieu_de: `${t.lop?.ten_lop ?? '?'}${t.lop?.mon ? ' · ' + t.lop.mon : ''} (TKB)`,
      phu_trach: null, ref_id: `tkb-${t.lop_id}-${t.gio_bat_dau}`, phong_khong_khop_danh_muc: !maSet.has(phongMa),
    })
  }

  for (const h of (hdRes.data ?? []) as any[]) {
    const phongMa = h.phong?.ma_phong ?? ''
    out.push({
      nguon: 'phat_sinh', phong_ma: phongMa, gio_bat_dau: h.gio_bat_dau, gio_ket_thuc: h.gio_ket_thuc,
      tieu_de: h.tieu_de, phu_trach: h.nhan_su?.ho_ten ?? null, ref_id: h.id,
      loai_phat_sinh: h.loai, phong_khong_khop_danh_muc: !phongMa,
    })
  }

  return out.sort((a, b) => a.phong_ma.localeCompare(b.phong_ma) || toMin(a.gio_bat_dau) - toMin(b.gio_bat_dau))
}

// Khối trùng với (phong, ngày, giờ) đang định lưu. boQuaRefId = loại chính nó ra (đang sửa).
export async function kiemTraTrungPhong(phongMa: string, ngay: string, gioBatDau: string, gioKetThuc: string, boQuaRefId?: string): Promise<KhoiBanPhong[]> {
  const all = await lichPhongNgay(ngay)
  const bd = toMin(gioBatDau), kt = toMin(gioKetThuc)
  return all.filter((k) => {
    if (k.phong_ma !== phongMa) return false
    if (boQuaRefId && k.ref_id === boQuaRefId) return false
    const kbd = toMin(k.gio_bat_dau), kkt = toMin(k.gio_ket_thuc)
    return !(kt <= kbd || bd >= kkt)
  })
}
