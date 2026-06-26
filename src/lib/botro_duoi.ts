// Data-layer BỔ TRỢ ĐUỔI — HS mới chậm hơn chương trình lớp → học đuổi (mig 0055).
// Case `bo_tro_duoi` (HS×lớp) kéo dài nhiều buổi. Buổi đuổi = buoi_hoc loai='bo_tro_duoi' (điểm danh + nhận xét, KHÔNG ET).
// Cần đuổi = case can_duoi CHƯA nằm trong buổi đuổi đang MỞ → buổi xong thì HS tự về Cần đuổi (xếp tiếp).
import { supabase } from './supabase'

const LIMIT = 10000

export type CanDuoiItem = { caseId: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop_id: string | null; lop: string; mon: string; nguon: string; ly_do: string | null }
export type CaDuoiHS = { hoc_sinh_id: string; ho_ten: string; diem_danh: string | null; caseId: string | null; lop: string }
export type CaDuoi = { id: string; ngay: string; gio_bat_dau: string | null; phong: string | null; trang_thai: string; danh_gia_xong_at: string | null; nguoi_day: string | null; nguoi_day_tg: string | null; hs: CaDuoiHS[] }

// Cần đuổi: case 'can_duoi' KHÔNG nằm trong buổi đuổi đang mở (chưa đóng đánh giá).
export async function listCanDuoi(): Promise<CanDuoiItem[]> {
  const { data: cases } = await supabase.from('bo_tro_duoi')
    .select('id, hoc_sinh_id, lop_id, nguon, ly_do, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), lop:lop_id(ten_lop, mon)')
    .eq('trang_thai', 'can_duoi').order('created_at').limit(LIMIT)
  if (!cases?.length) return []
  // buổi đuổi đang MỞ → case nào đã xếp vào đó thì loại khỏi Cần đuổi
  const { data: openBuoi } = await supabase.from('buoi_hoc').select('id').eq('loai', 'bo_tro_duoi').neq('trang_thai', 'huy').is('danh_gia_xong_at', null).limit(LIMIT)
  const openIds = (openBuoi ?? []).map((b: any) => b.id)
  let scheduled = new Set<string>()
  if (openIds.length) {
    const { data: links } = await supabase.from('buoi_hoc_hs').select('bo_tro_duoi_id').in('buoi_hoc_id', openIds).not('bo_tro_duoi_id', 'is', null).limit(LIMIT)
    scheduled = new Set((links ?? []).map((l: any) => l.bo_tro_duoi_id))
  }
  return (cases as any[]).filter((c) => !scheduled.has(c.id)).map((c) => ({
    caseId: c.id, hoc_sinh_id: c.hoc_sinh_id, ho_ten: c.hoc_sinh?.ho_ten ?? '?', ma_hs: c.hoc_sinh?.ma_hs ?? null,
    lop_id: c.lop_id, lop: c.lop?.ten_lop ?? '—', mon: c.lop?.mon ?? '', nguon: c.nguon, ly_do: c.ly_do,
  }))
}

// Đã xếp (done=false) / Hoàn thành (done=true): buổi đuổi + HS. "xong buổi" = danh_gia_xong_at có.
export async function listCaDuoi(done: boolean): Promise<CaDuoi[]> {
  const { data: buois } = await supabase.from('buoi_hoc')
    .select('id, ngay, gio_bat_dau, phong, trang_thai, danh_gia_xong_at, nguoi_day, nguoi_day_tg')
    .eq('loai', 'bo_tro_duoi').neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  const filt = (buois ?? []).filter((b: any) => (done ? !!b.danh_gia_xong_at : !b.danh_gia_xong_at))
  if (!filt.length) return []
  const ids = filt.map((b: any) => b.id)
  const { data: hs } = await supabase.from('buoi_hoc_hs')
    .select('buoi_hoc_id, hoc_sinh_id, diem_danh, bo_tro_duoi_id, hoc_sinh:hoc_sinh_id(ho_ten), duoi:bo_tro_duoi_id(lop:lop_id(ten_lop))')
    .in('buoi_hoc_id', ids).limit(LIMIT)
  const by: Record<string, any[]> = {}
  for (const r of hs ?? []) (by[(r as any).buoi_hoc_id] ??= []).push(r)
  return filt.map((b: any) => ({
    ...b, hs: (by[b.id] ?? []).map((r: any) => ({ hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', diem_danh: r.diem_danh, caseId: r.bo_tro_duoi_id, lop: r.duoi?.lop?.ten_lop ?? '' })),
  }))
}
export const buoiDuoiSapToi = () => listCaDuoi(false)

// Tạo buổi đuổi mới (loai='bo_tro_duoi', không lop_id; ngày/giờ/phòng/GV/TA).
export async function taoBuoiDuoi(input: { ngay: string; gio_bat_dau?: string | null; phong?: string | null; nguoi_day?: string | null; nguoi_day_tg?: string | null }): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('buoi_hoc').insert({
    loai: 'bo_tro_duoi', lop_id: null, ngay: input.ngay, gio_bat_dau: input.gio_bat_dau ?? null,
    phong: input.phong ?? null, nguoi_day: input.nguoi_day ?? null, nguoi_day_tg: input.nguoi_day_tg ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}
// Thêm case vào buổi đuổi (link bo_tro_duoi_id). Idempotent: bỏ qua nếu HS đã trong buổi.
export async function themHSVaoBuoiDuoi(buoiId: string, items: { hoc_sinh_id: string; caseId: string }[]): Promise<void> {
  if (!items.length) return
  const { data: cur } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id').eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const have = new Set((cur ?? []).map((r: any) => r.hoc_sinh_id))
  const rows = items.filter((i) => !have.has(i.hoc_sinh_id)).map((i) => ({ buoi_hoc_id: buoiId, hoc_sinh_id: i.hoc_sinh_id, bo_tro_duoi_id: i.caseId }))
  if (!rows.length) return
  const { error } = await supabase.from('buoi_hoc_hs').insert(rows)
  if (error) throw error
}

// Gợi ý GV/TA/giờ/phòng từ LỚP HS đang đuổi.
export async function goiYBuoiDuoi(lopId: string | null): Promise<{ gv_id: string | null; ta_id: string | null }> {
  if (!lopId) return { gv_id: null, ta_id: null }
  const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id, vai_tro, la_chinh').eq('lop_id', lopId).limit(LIMIT)
  const pick = (vai: string) => (pc ?? []).find((p: any) => p.vai_tro === vai && p.la_chinh)?.nhan_su_id ?? (pc ?? []).find((p: any) => p.vai_tro === vai)?.nhan_su_id ?? null
  return { gv_id: pick('gv'), ta_id: pick('tg') }
}

// Thêm case thủ công (path 2: start từ Bổ trợ đuổi). Chặn trùng case đang-đuổi (unique partial).
export async function themCaseDuoi(input: { hoc_sinh_id: string; lop_id: string | null; ly_do?: string | null }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bo_tro_duoi').insert({
    hoc_sinh_id: input.hoc_sinh_id, lop_id: input.lop_id ?? null, ly_do: input.ly_do ?? null, nguon: 'thu_cong', actor: user?.id ?? null,
  })
  if (error) {
    if ((error as any).code === '23505') throw new Error('HS này đã có cờ bổ trợ đuổi cho lớp đó rồi.')
    throw error
  }
}
// Hoàn thành cả KHÓA đuổi → rời luồng (biến mất khỏi mọi tab).
export async function hoanThanhKhoaDuoi(caseId: string): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi').update({ trang_thai: 'hoan_thanh', hoan_thanh_at: new Date().toISOString() }).eq('id', caseId)
  if (error) throw error
}
// Bỏ cờ (gắn nhầm) — chỉ khi chưa từng xếp buổi nào (an toàn).
export async function xoaCaseDuoi(caseId: string): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi').delete().eq('id', caseId)
  if (error) throw error
}

// Tìm HS cho việc thêm case thủ công (gõ tên/mã).
export async function timHocSinhDuoi(q: string): Promise<{ id: string; ma_hs: string | null; ho_ten: string }[]> {
  if (!q.trim()) return []
  const { data } = await supabase.from('hoc_sinh').select('id, ma_hs, ho_ten').or(`ho_ten.ilike.%${q.trim()}%,ma_hs.ilike.%${q.trim()}%`).eq('trang_thai', 'dang_hoc').order('ho_ten').limit(8)
  return (data ?? []) as any
}
// Lớp HS đang học (để chọn lớp đuổi khi thêm thủ công).
export async function lopCuaHS(hocSinhId: string): Promise<{ id: string; ten_lop: string; mon: string }[]> {
  const { data } = await supabase.from('hoc_sinh_lop').select('lop:lop_id(id, ten_lop, mon)').eq('hoc_sinh_id', hocSinhId).eq('trang_thai', 'dang_hoc').limit(LIMIT)
  return (data ?? []).map((r: any) => r.lop).filter(Boolean)
}

export async function demTabDuoi(): Promise<Record<string, number>> {
  const [l1, l2, l3] = await Promise.all([listCanDuoi(), listCaDuoi(false), listCaDuoi(true)])
  return { canduoi: l1.length, daxep: l2.length, xong: l3.length }
}
