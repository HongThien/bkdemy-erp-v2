// Data-layer BỔ TRỢ ĐUỔI — HS mới chậm hơn chương trình lớp → học đuổi (mig 0055, redesign 0097).
// ĐỢT (case `bo_tro_duoi`, HS×lớp) mang KẾ HOẠCH (Thùy chốt 07-13): scope DẠNG cần dạy + SỐ BUỔI dự
// kiến (logic gốc: số buổi phải cover hết dạng). Buổi đuổi = buoi_hoc loai='bo_tro_duoi' (điểm danh +
// nhận xét, KHÔNG ET, KHÔNG đo mastery — mục tiêu là kịp kiến thức nghe hiểu buổi chính).
// Card = ĐỢT, sống ở tab "Đang đuổi" suốt vòng đời với chỉ số "Xếp x/N · Học y/N" — xếp lịch BATCH cả
// đợt 1 lần (không còn luồng xong-buổi-1-mới-xếp-buổi-2). Vắng = huỷ suất (không đếm, xếp lại). Học đủ
// N buổi CÓ MẶT → hệ ĐỀ XUẤT đóng (GV bấm Hoàn thành/Gia hạn — không đóng câm).
import { supabase } from './supabase'

const LIMIT = 10000

export type CanDuoiItem = { caseId: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; lop_id: string | null; lop: string; mon: string; nguon: string; ly_do: string | null }
export type CaDuoiHS = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; diem_danh: string | null; caseId: string | null; lop: string; mon: string }
export type CaDuoi = { id: string; ngay: string; gio_bat_dau: string | null; phong: string | null; trang_thai: string; danh_gia_xong_at: string | null; nguoi_day: string | null; nguoi_day_tg: string | null; muc_hoc_duoi_id: string | null; hs: CaDuoiHS[] }

// 1 buổi trong đợt (view theo-đợt — dùng ở card detail; click mở BuoiDuoiDetail readOnly như cũ).
export type BuoiCuaDot = { buoiId: string; ngay: string; gio_bat_dau: string | null; phong: string | null; danh_gia_xong_at: string | null; diem_danh: string | null }
// 1 dạng trong scope đợt — day_at NULL = CHƯA DẠY (0099, Thùy 07-13: GV xác nhận đã dạy dạng nào
// mới biết lúc nào kết thúc được đợt / cần gia hạn hay thu ngắn).
export type DangDuoi = { id: string; ma_dang: string; day_buoi_id: string | null; day_at: string | null }
export type DotDuoi = CanDuoiItem & {
  khoi: string | null
  so_buoi_du_kien: number | null // NULL = chưa chốt kế hoạch (đợt cũ / mới tạo) — UI bắt chốt trước khi xếp
  dangs: DangDuoi[]              // scope dạng của đợt + trạng thái đã dạy
  daXep: number                  // suất HIỆU LỰC: buổi chưa diễn ra/đang mở + buổi đã học có mặt (vắng KHÔNG đếm)
  daHoc: number                  // buổi đã đóng đánh giá + HS CÓ MẶT
  hoan_thanh_at: string | null
  buois: BuoiCuaDot[]            // các buổi của đợt (sort theo ngày) — cho detail, khỏi query lại
}

// Danh sách ĐỢT theo trạng thái — tab "Đang đuổi" (can_duoi) / "Hoàn thành" (hoan_thanh).
// buoi_hoc_hs có 2 FK về buoi_hoc (buoi_hoc_id + bu_cho_buoi_id) → KHÔNG embed được, tách 2 bước
// (bài học HANDOFF §PostgREST-embed).
export async function listDotDuoi(done: boolean): Promise<DotDuoi[]> {
  const { data: cases } = await supabase.from('bo_tro_duoi')
    .select('id, hoc_sinh_id, lop_id, nguon, ly_do, so_buoi_du_kien, hoan_thanh_at, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), lop:lop_id(ten_lop, mon, khoi)')
    .eq('trang_thai', done ? 'hoan_thanh' : 'can_duoi').order('created_at', { ascending: !done }).limit(LIMIT)
  if (!cases?.length) return []
  const caseIds = (cases as any[]).map((c) => c.id)

  const [{ data: dangRows }, { data: links }] = await Promise.all([
    supabase.from('bo_tro_duoi_dang').select('id, bo_tro_duoi_id, ma_dang, day_buoi_id, day_at').in('bo_tro_duoi_id', caseIds).order('ma_dang').limit(LIMIT),
    supabase.from('buoi_hoc_hs').select('bo_tro_duoi_id, buoi_hoc_id, diem_danh').in('bo_tro_duoi_id', caseIds).limit(LIMIT),
  ])
  const dangsBy: Record<string, DangDuoi[]> = {}
  for (const r of (dangRows ?? []) as any[]) (dangsBy[r.bo_tro_duoi_id] ??= []).push({ id: r.id, ma_dang: r.ma_dang, day_buoi_id: r.day_buoi_id, day_at: r.day_at })

  const buoiIds = [...new Set(((links ?? []) as any[]).map((l) => l.buoi_hoc_id))]
  let buoiBy: Record<string, any> = {}
  if (buoiIds.length) {
    const { data: buois } = await supabase.from('buoi_hoc').select('id, ngay, gio_bat_dau, phong, trang_thai, danh_gia_xong_at').in('id', buoiIds).limit(LIMIT)
    buoiBy = Object.fromEntries(((buois ?? []) as any[]).map((b) => [b.id, b]))
  }
  const buoisBy: Record<string, BuoiCuaDot[]> = {}
  for (const l of (links ?? []) as any[]) {
    const b = buoiBy[l.buoi_hoc_id]
    if (!b || b.trang_thai === 'huy') continue // ca đã huỷ = không tồn tại với đợt
    ;(buoisBy[l.bo_tro_duoi_id] ??= []).push({ buoiId: b.id, ngay: b.ngay, gio_bat_dau: b.gio_bat_dau, phong: b.phong, danh_gia_xong_at: b.danh_gia_xong_at, diem_danh: l.diem_danh })
  }

  return (cases as any[]).map((c) => {
    const buois = (buoisBy[c.id] ?? []).sort((a, b) => a.ngay.localeCompare(b.ngay))
    // Vắng = huỷ suất (Thùy 07-13): buổi ĐÃ đóng mà không có mặt → không đếm vào xếp lẫn học.
    const daHoc = buois.filter((b) => b.danh_gia_xong_at && b.diem_danh === 'co_mat').length
    const daXep = daHoc + buois.filter((b) => !b.danh_gia_xong_at).length
    return {
      caseId: c.id, hoc_sinh_id: c.hoc_sinh_id, ho_ten: c.hoc_sinh?.ho_ten ?? '?', ma_hs: c.hoc_sinh?.ma_hs ?? null,
      lop_id: c.lop_id, lop: c.lop?.ten_lop ?? '—', mon: c.lop?.mon ?? '', khoi: c.lop?.khoi ?? null,
      nguon: c.nguon, ly_do: c.ly_do, so_buoi_du_kien: c.so_buoi_du_kien, hoan_thanh_at: c.hoan_thanh_at,
      dangs: dangsBy[c.id] ?? [], daXep, daHoc, buois,
    }
  })
}

// Chốt/sửa KẾ HOẠCH đợt: số buổi dự kiến + scope dạng. DIFF (không delete-all-insert-all — 0099:
// dòng dạng mang dấu ĐÃ DẠY day_at/day_buoi_id, replace toàn bộ sẽ xoá mất dấu của dạng giữ nguyên).
export async function chotKeHoachDuoi(caseId: string, soBuoi: number, maDangs: string[]): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi').update({ so_buoi_du_kien: soBuoi }).eq('id', caseId)
  if (error) throw error
  const { data: cur, error: eCur } = await supabase.from('bo_tro_duoi_dang').select('id, ma_dang').eq('bo_tro_duoi_id', caseId).limit(LIMIT)
  if (eCur) throw eCur
  const curMa = new Set(((cur ?? []) as any[]).map((r) => r.ma_dang))
  const moiMa = new Set(maDangs)
  const boIds = ((cur ?? []) as any[]).filter((r) => !moiMa.has(r.ma_dang)).map((r) => r.id)
  const themMa = maDangs.filter((m) => !curMa.has(m))
  if (boIds.length) {
    const { error: eDel } = await supabase.from('bo_tro_duoi_dang').delete().in('id', boIds)
    if (eDel) throw eDel
  }
  if (themMa.length) {
    const { error: eIns } = await supabase.from('bo_tro_duoi_dang').insert(themMa.map((m) => ({ bo_tro_duoi_id: caseId, ma_dang: m })))
    if (eIns) throw eIns
  }
}

// Scope dạng (kèm trạng thái đã dạy) của MỌI case trong 1 buổi đuổi — cho BuoiDuoiDetail (GV tick
// "đã dạy dạng nào" ngay trong khối đánh giá per-HS). Trả map caseId → dạng[].
export async function getDangCuaBuoiDuoi(buoiId: string): Promise<Record<string, DangDuoi[]>> {
  const { data: links } = await supabase.from('buoi_hoc_hs').select('bo_tro_duoi_id').eq('buoi_hoc_id', buoiId).not('bo_tro_duoi_id', 'is', null).limit(LIMIT)
  const caseIds = [...new Set(((links ?? []) as any[]).map((l) => l.bo_tro_duoi_id))]
  if (!caseIds.length) return {}
  const { data, error } = await supabase.from('bo_tro_duoi_dang').select('id, bo_tro_duoi_id, ma_dang, day_buoi_id, day_at').in('bo_tro_duoi_id', caseIds).order('ma_dang').limit(LIMIT)
  if (error) throw error
  const out: Record<string, DangDuoi[]> = {}
  for (const r of (data ?? []) as any[]) (out[r.bo_tro_duoi_id] ??= []).push({ id: r.id, ma_dang: r.ma_dang, day_buoi_id: r.day_buoi_id, day_at: r.day_at })
  return out
}
// Tick/bỏ tick "đã dạy dạng này" — buoiId có = đã dạy (ghi bằng chứng buổi nào); null = bỏ tick.
export async function setDangDay(dangRowId: string, buoiId: string | null): Promise<void> {
  const { error } = await supabase.from('bo_tro_duoi_dang')
    .update(buoiId ? { day_buoi_id: buoiId, day_at: new Date().toISOString() } : { day_buoi_id: null, day_at: null })
    .eq('id', dangRowId)
  if (error) throw error
}

// Đã xếp (done=false) / Hoàn thành (done=true): buổi đuổi + HS. "xong buổi" = danh_gia_xong_at có.
export async function listCaDuoi(done: boolean): Promise<CaDuoi[]> {
  const { data: buois } = await supabase.from('buoi_hoc')
    .select('id, ngay, gio_bat_dau, phong, trang_thai, danh_gia_xong_at, nguoi_day, nguoi_day_tg, muc_hoc_duoi_id')
    .eq('loai', 'bo_tro_duoi').neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  const filt = (buois ?? []).filter((b: any) => (done ? !!b.danh_gia_xong_at : !b.danh_gia_xong_at))
  if (!filt.length) return []
  const ids = filt.map((b: any) => b.id)
  const { data: hs } = await supabase.from('buoi_hoc_hs')
    .select('buoi_hoc_id, hoc_sinh_id, diem_danh, bo_tro_duoi_id, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), duoi:bo_tro_duoi_id(lop:lop_id(ten_lop, mon))')
    .in('buoi_hoc_id', ids).limit(LIMIT)
  const by: Record<string, any[]> = {}
  for (const r of hs ?? []) (by[(r as any).buoi_hoc_id] ??= []).push(r)
  return filt.map((b: any) => ({
    ...b, hs: (by[b.id] ?? []).map((r: any) => ({
      hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
      diem_danh: r.diem_danh, caseId: r.bo_tro_duoi_id, lop: r.duoi?.lop?.ten_lop ?? '', mon: r.duoi?.lop?.mon ?? '',
    })),
  }))
}
export const buoiDuoiSapToi = () => listCaDuoi(false)

// Thông tin per-HS (lớp đuổi + môn) của 1 buổi đuổi CỤ THỂ — dùng khi mở buổi đuổi CHỈ có buoiId
// (mở từ "Việc của tôi", không có sẵn CaDuoi đầy đủ như màn Bổ trợ Đuổi).
export async function getBuoiDuoiHsInfo(buoiId: string): Promise<Record<string, { lop: string; mon: string }>> {
  const { data } = await supabase.from('buoi_hoc_hs')
    .select('hoc_sinh_id, duoi:bo_tro_duoi_id(lop:lop_id(ten_lop, mon))')
    .eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const out: Record<string, { lop: string; mon: string }> = {}
  for (const r of (data ?? []) as any[]) out[r.hoc_sinh_id] = { lop: r.duoi?.lop?.ten_lop ?? '', mon: r.duoi?.lop?.mon ?? '' }
  return out
}

// Tạo buổi đuổi mới (loai='bo_tro_duoi', không lop_id; ngày/giờ/phòng/GV/TA/mức học đuổi).
// Mức học đuổi gắn theo CA (KHÔNG theo lớp gốc) — mỗi ca có thể khác giá (Thùy 07-05).
export async function taoBuoiDuoi(input: { ngay: string; gio_bat_dau?: string | null; phong?: string | null; nguoi_day?: string | null; nguoi_day_tg?: string | null; muc_hoc_duoi_id?: string | null }): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('buoi_hoc').insert({
    loai: 'bo_tro_duoi', lop_id: null, ngay: input.ngay, gio_bat_dau: input.gio_bat_dau ?? null,
    phong: input.phong ?? null, nguoi_day: input.nguoi_day ?? null, nguoi_day_tg: input.nguoi_day_tg ?? null,
    muc_hoc_duoi_id: input.muc_hoc_duoi_id ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}
// Gán/đổi mức học đuổi cho CA đã tạo (vd tạo buổi trước, gán giá sau).
export async function setMucHocDuoi(buoiId: string, mucId: string | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ muc_hoc_duoi_id: mucId }).eq('id', buoiId)
  if (error) throw error
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

// Đếm tab: Đang đuổi = ĐỢT đang mở · Đã xếp = BUỔI đang chờ · Hoàn thành = ĐỢT đã đóng (07-13:
// tab 1 và 3 đơn vị là ĐỢT, chỉ tab 2 là buổi).
export async function demTabDuoi(): Promise<Record<string, number>> {
  const [{ count: dang }, { count: xong }, l2] = await Promise.all([
    supabase.from('bo_tro_duoi').select('id', { count: 'exact', head: true }).eq('trang_thai', 'can_duoi'),
    supabase.from('bo_tro_duoi').select('id', { count: 'exact', head: true }).eq('trang_thai', 'hoan_thanh'),
    listCaDuoi(false),
  ])
  return { canduoi: dang ?? 0, daxep: l2.length, xong: xong ?? 0 }
}
