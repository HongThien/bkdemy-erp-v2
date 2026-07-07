// Data-layer BỔ TRỢ BÙ (bù buổi nghỉ L1→L3). ADR: app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e
// TÁI DÙNG buoi_hoc loai='bu' + buoi_hoc_hs.bu_cho_buoi_id (link per-HS về buổi mẹ). Funnel pure-derive.
import { supabase } from './supabase'
import { loadETForBuoi, listProblems } from './gami'

const LIMIT = 10000

// L1 — 1 lần-nghỉ = (HS × buổi-mẹ). id = buoi_hoc_hs.id ở buổi mẹ.
export type CanBuItem = { id: string; hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; buoi_me_id: string; ngay: string; lop: string; mon: string }
// mon/lop_bu = LỚP GỐC (mẹ) của HS đang bù (buổi bù bản thân không có lớp — gom HS TỪ NHIỀU lớp/môn khác
// nhau, 07-07 phát hiện thiếu nhãn môn gây nhầm lẫn khi nhiều môn cùng chạy). bu_cho = "buổi gốc · ngày"
// (nội dung buổi học HS đang bù cho) — Thùy 07-07: PHẢI hiện, trước đây có data nhưng chưa render ra UI.
export type CaBoTroHS = { hoc_sinh_id: string; ho_ten: string; ma_hs: string | null; diem_danh: string | null; lop_bu: string; mon: string; bu_cho: string }
export type CaBoTro = { id: string; ngay: string; gio_bat_dau: string | null; phong: string | null; trang_thai: string; et_dong_at: string | null; danh_gia_xong_at: string | null; nguoi_day: string | null; nguoi_day_tg: string | null; hs: CaBoTroHS[] }

// L1: vắng ở buổi thường, CHƯA xếp bù & CHƯA ghi không-bù.
export async function listCanBu(): Promise<CanBuItem[]> {
  const { data: vang } = await supabase.from('buoi_hoc_hs')
    .select('id, hoc_sinh_id, buoi_hoc_id, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), buoi:buoi_hoc_id(loai, trang_thai, ngay, lop:lop_id(ten_lop, mon))')
    .in('diem_danh', ['vang', 'vang_phep']).limit(LIMIT)
  const abs = (vang ?? []).filter((r: any) => r.buoi?.loai === 'thuong' && r.buoi?.trang_thai !== 'huy')
  const { data: links } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, bu_cho_buoi_id').not('bu_cho_buoi_id', 'is', null).limit(LIMIT)
  const handled = new Set((links ?? []).map((l: any) => `${l.hoc_sinh_id}|${l.bu_cho_buoi_id}`))
  const { data: kb } = await supabase.from('bang_khong_bu').select('buoi_hoc_hs_id').limit(LIMIT)
  const decided = new Set((kb ?? []).map((k: any) => k.buoi_hoc_hs_id))
  return abs.filter((r: any) => !handled.has(`${r.hoc_sinh_id}|${r.buoi_hoc_id}`) && !decided.has(r.id))
    .map((r: any) => ({ id: r.id, hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null, buoi_me_id: r.buoi_hoc_id, ngay: r.buoi?.ngay, lop: r.buoi?.lop?.ten_lop ?? '?', mon: r.buoi?.lop?.mon ?? '' }))
}

// L2 (done=false) / L3 (done=true): ca bổ trợ (buổi bù) + danh sách HS.
export async function listCaBoTro(done: boolean): Promise<CaBoTro[]> {
  const { data: buois } = await supabase.from('buoi_hoc')
    .select('id, ngay, gio_bat_dau, phong, trang_thai, et_dong_at, danh_gia_xong_at, nguoi_day, nguoi_day_tg')
    .eq('loai', 'bu').neq('trang_thai', 'huy').order('ngay', { ascending: false }).limit(LIMIT)
  const filt = (buois ?? []).filter((b: any) => { const xong = !!b.et_dong_at && !!b.danh_gia_xong_at; return done ? xong : !xong })
  if (!filt.length) return []
  const ids = filt.map((b: any) => b.id)
  const { data: hs } = await supabase.from('buoi_hoc_hs')
    .select('buoi_hoc_id, hoc_sinh_id, diem_danh, hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), bu_cho:bu_cho_buoi_id(ngay, lop:lop_id(ten_lop, mon))')
    .in('buoi_hoc_id', ids).limit(LIMIT)
  const by: Record<string, any[]> = {}
  for (const r of hs ?? []) (by[(r as any).buoi_hoc_id] ??= []).push(r)
  return filt.map((b: any) => ({
    ...b, hs: (by[b.id] ?? []).map((r: any) => ({
      hoc_sinh_id: r.hoc_sinh_id, ho_ten: r.hoc_sinh?.ho_ten ?? '?', ma_hs: r.hoc_sinh?.ma_hs ?? null,
      diem_danh: r.diem_danh, lop_bu: r.bu_cho?.lop?.ten_lop ?? '', mon: r.bu_cho?.lop?.mon ?? '',
      bu_cho: r.bu_cho ? `${r.bu_cho.lop?.ten_lop ?? ''} · ${r.bu_cho.ngay}` : '',
    })),
  }))
}

export async function listKhongBu(): Promise<{ id: string; absId: string; loai: string; ly_do: string | null; ho_ten: string; ma_hs: string | null; info: string }[]> {
  const { data } = await supabase.from('bang_khong_bu')
    .select('id, buoi_hoc_hs_id, loai, ly_do, abs:buoi_hoc_hs_id(hoc_sinh:hoc_sinh_id(ho_ten, ma_hs), buoi:buoi_hoc_id(ngay, lop:lop_id(ten_lop, mon)))')
    .order('created_at', { ascending: false }).limit(LIMIT)
  return (data ?? []).map((r: any) => ({
    id: r.id, absId: r.buoi_hoc_hs_id, loai: r.loai, ly_do: r.ly_do,
    ho_ten: r.abs?.hoc_sinh?.ho_ten ?? '?', ma_hs: r.abs?.hoc_sinh?.ma_hs ?? null,
    info: r.abs?.buoi ? `${r.abs.buoi.lop?.ten_lop ?? ''} (${r.abs.buoi.lop?.mon ?? ''}) · ${r.abs.buoi.ngay}` : '',
  }))
}

export async function ghiKhongBu(absenceId: string, loai: 'khong_can_bu' | 'khong_xep_duoc', lyDo?: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('bang_khong_bu').upsert({ buoi_hoc_hs_id: absenceId, loai, ly_do: lyDo ?? null, actor: user?.id ?? null }, { onConflict: 'buoi_hoc_hs_id' })
  if (error) throw error
}
export async function xoaKhongBu(absenceId: string): Promise<void> {
  const { error } = await supabase.from('bang_khong_bu').delete().eq('buoi_hoc_hs_id', absenceId)
  if (error) throw error
}

// Tạo buổi bù MỚI (loai='bu', không lop_id; ngày+giờ+phòng+GV+TA).
export async function taoBuoiBu(input: { ngay: string; gio_bat_dau?: string | null; gio_ket_thuc?: string | null; phong?: string | null; nguoi_day?: string | null; nguoi_day_tg?: string | null }): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('buoi_hoc').insert({
    loai: 'bu', lop_id: null, ngay: input.ngay, gio_bat_dau: input.gio_bat_dau ?? null, gio_ket_thuc: input.gio_ket_thuc ?? null,
    phong: input.phong ?? null, nguoi_day: input.nguoi_day ?? null, nguoi_day_tg: input.nguoi_day_tg ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
  }).select('id').single()
  if (error) throw error
  return (data as any).id
}
// Thêm các lần-nghỉ vào 1 buổi bù (set bu_cho_buoi_id = buổi mẹ của từng HS).
export async function themHSVaoBuoiBu(makeupId: string, items: { hoc_sinh_id: string; buoi_me_id: string }[]): Promise<void> {
  if (!items.length) return
  const { error } = await supabase.from('buoi_hoc_hs').insert(items.map((i) => ({ buoi_hoc_id: makeupId, hoc_sinh_id: i.hoc_sinh_id, bu_cho_buoi_id: i.buoi_me_id })))
  if (error) throw error
}
export const buoiBuSapToi = () => listCaBoTro(false) // cho "chọn buổi bù có sẵn"

// Thông tin per-HS (mã HS · lớp gốc+môn · nội dung buổi đang bù cho) của 1 buổi bù CỤ THỂ — dùng ở
// BuoiBuDetail (mở từ "Việc của tôi" chỉ có buoiId, KHÔNG có sẵn CaBoTro đầy đủ như màn Bổ trợ Bù).
export async function getBuoiBuHsInfo(buoiId: string): Promise<Record<string, { ma_hs: string | null; lop_bu: string; mon: string; bu_cho: string }>> {
  const { data } = await supabase.from('buoi_hoc_hs')
    .select('hoc_sinh_id, hoc_sinh:hoc_sinh_id(ma_hs), bu_cho:bu_cho_buoi_id(ngay, lop:lop_id(ten_lop, mon))')
    .eq('buoi_hoc_id', buoiId).limit(LIMIT)
  const out: Record<string, { ma_hs: string | null; lop_bu: string; mon: string; bu_cho: string }> = {}
  for (const r of (data ?? []) as any[]) {
    out[r.hoc_sinh_id] = {
      ma_hs: r.hoc_sinh?.ma_hs ?? null, lop_bu: r.bu_cho?.lop?.ten_lop ?? '', mon: r.bu_cho?.lop?.mon ?? '',
      bu_cho: r.bu_cho ? `${r.bu_cho.lop?.ten_lop ?? ''} · ${r.bu_cho.ngay}` : '',
    }
  }
  return out
}

// Gợi ý mặc định cho buổi bù từ LỚP MẸ của HS nghỉ: TA (người bổ trợ mặc định) + GV + giờ + phòng.
export async function goiYBuoiBu(buoiMeId: string): Promise<{ gv_id: string | null; ta_id: string | null; gio: string | null; phong: string | null }> {
  const { data: b } = await supabase.from('buoi_hoc').select('lop_id, gio_bat_dau, phong').eq('id', buoiMeId).single()
  const lopId = (b as any)?.lop_id
  let gv_id: string | null = null, ta_id: string | null = null
  if (lopId) {
    const { data: pc } = await supabase.from('phan_cong_lop').select('nhan_su_id, vai_tro, la_chinh').eq('lop_id', lopId).limit(LIMIT)
    const pick = (vai: string) => (pc ?? []).find((p: any) => p.vai_tro === vai && p.la_chinh)?.nhan_su_id ?? (pc ?? []).find((p: any) => p.vai_tro === vai)?.nhan_su_id ?? null
    gv_id = pick('gv'); ta_id = pick('tg')
  }
  return { gv_id, ta_id, gio: ((b as any)?.gio_bat_dau ?? null) as string | null, phong: ((b as any)?.phong ?? null) as string | null }
}

// Seed ET buổi bù = ET buổi MẸ của TỪNG HS (per-HS, gắn hoc_sinh_id). Idempotent (chỉ seed khi chưa có problem ET).
export async function ensureBuoiBuETProblems(makeupId: string): Promise<void> {
  const cur = await listProblems(makeupId, 'et')
  if (cur.length) return
  const { data: ros } = await supabase.from('buoi_hoc_hs').select('hoc_sinh_id, bu_cho_buoi_id').eq('buoi_hoc_id', makeupId).not('bu_cho_buoi_id', 'is', null).limit(LIMIT)
  let no = 0
  const rows: any[] = []
  for (const r of ros ?? []) {
    const { caus } = await loadETForBuoi((r as any).bu_cho_buoi_id) // ET buổi mẹ
    for (const c of caus) { no++; rows.push({ buoi_hoc_id: makeupId, phase: 'et', problem_no: no, ma_dang: (c as any).dang_chinh ?? null, hoc_sinh_id: (r as any).hoc_sinh_id }) }
  }
  if (rows.length) { const { error } = await supabase.from('gami_session_problems').upsert(rows, { onConflict: 'buoi_hoc_id,phase,problem_no', ignoreDuplicates: true }); if (error) throw error }
}

export async function demTabBoTro(): Promise<Record<string, number>> {
  const [l1, l2, l3] = await Promise.all([listCanBu(), listCaBoTro(false), listCaBoTro(true)])
  const { count } = await supabase.from('bang_khong_bu').select('id', { count: 'exact', head: true })
  return { canbu: l1.length, daxep: l2.length, xong: l3.length, khongbu: count ?? 0 }
}
