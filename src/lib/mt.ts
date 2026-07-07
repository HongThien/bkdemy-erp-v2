// ============================================================================
// mt.ts — MT (kỳ thi lớn, "Grand Slam"). Model 2 TẦNG (giống Giáo trình↔Giáo trình buổi) — 2 `loai`
// KHÁC NHAU (giống 'giao_trinh'↔'giao_trinh_buoi') để KhoTaiLieuScreen không trộn master+instance:
//   MT MASTER  (loai='mt', lop_id=null, ngay=null) — soạn 1 lần, nhiều PHẦN (tai_lieu_phan
//              loai_phan='custom'), mỗi phần chứa câu chọn theo cơ chế ET (dạng → gợi ý → chọn/đổi)
//              — KHÔNG bóc-ảnh như Đề thi.
//   MT INSTANCE (loai='mt_buoi', lop_id=X, ngay=Y, nguon_id=masterId) — sinh ra lúc "Gán vào buổi":
//              copy phans+câu từ master (mang theo `kieu`), kèm 1 buổi_hoc(loai='mt') cho đúng
//              (lớp,ngày) đó.
// 1 MT master gán được cho NHIỀU lớp/nhiều lần (khác ET: 1 ET = 1 lớp+ngày cố định).
// Phạm vi hiện tại: CHỈ soạn + gán. Chấm MT trong buổi (Đ/C/S, đóng phase, Elo K=60) = lượt sau.
// ============================================================================
import { supabase } from './supabase'
import { listPhan, addPhan, getTaiLieuFull, createTaiLieu, updateTaiLieu, deleteTaiLieu, copyPhanInto, type TaiLieu, type TaiLieuPhan } from './tailieu'

const LIMIT = 10000

// ── MT MASTER (CRUD) ──────────────────────────────────────────────────────
export async function listMT(mon?: string): Promise<TaiLieu[]> {
  let q = supabase.from('tai_lieu').select('*').eq('loai', 'mt').is('lop_id', null).order('created_at', { ascending: false }).limit(LIMIT)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}
export async function getMT(id: string): Promise<TaiLieu> {
  const { data, error } = await supabase.from('tai_lieu').select('*').eq('id', id).single()
  if (error) throw error
  return data as TaiLieu
}
export const createMT = (input: { ten: string; khoi: string; mon: string }): Promise<TaiLieu> => createTaiLieu({ loai: 'mt', ...input })
export const renameMT = (id: string, ten: string): Promise<void> => updateTaiLieu(id, { ten })
export const deleteMT = deleteTaiLieu // cascade phan+cau (KHÔNG xoá câu ở kho); xoá master KHÔNG tự xoá các instance đã gán (nguon_id giữ trace, nhưng đứng độc lập)

// ── PHẦN (mảng/chuyên đề trong MT) ───────────────────────────────────────
export async function listPhanMT(taiLieuId: string): Promise<TaiLieuPhan[]> {
  return (await listPhan(taiLieuId)).filter((p) => p.loai_phan === 'custom')
}
export async function addPhanMT(taiLieuId: string, tieuDe: string): Promise<TaiLieuPhan> {
  const phans = await listPhan(taiLieuId)
  const tt = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  return addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt, loai_phan: 'custom', ref_ma: null, tieu_de: tieuDe, noi_dung: null })
}

// Câu ĐANG DÙNG xuyên MỌI PHẦN của 1 MT (khác ET: ET chỉ 1 "phần" nên rows tự gói gọn; MT có nhiều
// phần nên phải gom cả để suggestCauForDang không gợi ý trùng câu giữa các phần).
export async function usedCauCuaMT(taiLieuId: string): Promise<Set<string>> {
  const full = await getTaiLieuFull(taiLieuId)
  return new Set(full.phans.filter((p) => p.loai_phan === 'custom').flatMap((p) => p.caus.map((c) => c.ma_cau)))
}

// ── GÁN VÀO BUỔI (lớp+ngày cụ thể) ───────────────────────────────────────
export type GanMTKetQua = { buoiId: string; taiLieuId: string; buoiMoi: boolean }
// Tìm/tạo buổi_hoc(loai='mt', lop_id, ngay) + tạo doc con bám (lớp+ngày) copy từ master (xoá-rồi-tạo
// nếu re-gán — cùng nguyên tắc "doc vận hành 1-1 (lớp+ngày+loại)" như trichXuatBuoi).
export async function ganMTVaoBuoi(masterId: string, opts: { lopId: string; ngay: string; gioBatDau?: string | null; phong?: string | null; nguoiDay?: string | null }): Promise<GanMTKetQua> {
  const { data: { user } } = await supabase.auth.getUser()

  // 1) Buổi MT cho (lớp,ngày) — MT = session RIÊNG (không đè lên buổi 'thuong' có sẵn).
  const { data: existB, error: eB } = await supabase.from('buoi_hoc').select('id')
    .eq('loai', 'mt').eq('lop_id', opts.lopId).eq('ngay', opts.ngay).neq('trang_thai', 'huy')
    .order('created_at', { ascending: false }).limit(1)
  if (eB) throw eB
  let buoiId = (existB as { id: string }[] | null)?.[0]?.id ?? null
  let buoiMoi = false
  if (!buoiId) {
    const { data: nb, error } = await supabase.from('buoi_hoc').insert({
      loai: 'mt', lop_id: opts.lopId, ngay: opts.ngay, gio_bat_dau: opts.gioBatDau ?? null,
      phong: opts.phong ?? null, nguoi_day: opts.nguoiDay ?? null, trang_thai: 'mo', created_by: user?.id ?? null,
    }).select('id').single()
    if (error) throw error
    buoiId = (nb as { id: string }).id
    buoiMoi = true
  }

  // 2) Doc con bám (lớp+ngày) — re-gán = THAY THẾ (xoá cũ rồi tạo mới), copy phans từ master.
  const master = await getTaiLieuFull(masterId)
  await supabase.from('tai_lieu').delete().eq('loai', 'mt_buoi').eq('lop_id', opts.lopId).eq('ngay', opts.ngay)
  const { data: nw, error: eNw } = await supabase.from('tai_lieu').insert({
    loai: 'mt_buoi', ten: master.taiLieu.ten, khoi: master.taiLieu.khoi, mon: master.taiLieu.mon, theme: master.taiLieu.theme,
    lop_id: opts.lopId, ngay: opts.ngay, nguon_id: masterId, created_by: user?.id ?? null,
  }).select().single()
  if (eNw) throw eNw
  const docCon = nw as TaiLieu
  let t = 0
  for (const p of master.phans.filter((p) => p.loai_phan === 'custom')) await copyPhanInto(docCon.id, p, t++)

  return { buoiId: buoiId!, taiLieuId: docCon.id, buoiMoi }
}

// Các lượt đã gán của 1 MT master (hiện trong editor: "Đã gán cho: 9A1 · 12/07…").
export type MTGanRow = { taiLieuId: string; lopId: string; lopTen: string; ngay: string; buoiId: string | null }
export async function listGanMT(masterId: string): Promise<MTGanRow[]> {
  const { data, error } = await supabase.from('tai_lieu').select('id, lop_id, ngay, lop:lop_id(ten_lop)')
    .eq('loai', 'mt_buoi').eq('nguon_id', masterId).order('ngay', { ascending: false }).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as any[]
  if (!rows.length) return []
  const { data: buois } = await supabase.from('buoi_hoc').select('id, lop_id, ngay')
    .eq('loai', 'mt').in('lop_id', rows.map((r) => r.lop_id)).limit(LIMIT)
  const buoiOf = (lopId: string, ngay: string) => (buois as any[] ?? []).find((b) => b.lop_id === lopId && b.ngay === ngay)?.id ?? null
  return rows.map((r) => ({ taiLieuId: r.id, lopId: r.lop_id, lopTen: r.lop?.ten_lop ?? '?', ngay: r.ngay, buoiId: buoiOf(r.lop_id, r.ngay) }))
}
