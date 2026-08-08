// Data-layer GIÁO TRÌNH HÌNH (buổi → gán lớp) — độc lập giáo trình Đại (bảng hinh_giao_trinh / hinh_gt_buoi / hinh_gt_bai).
// 1 buổi = bản LƯU của nháp "Theo mô hình" (sel/ghep/anDe → hinh_gt_bai). Gán lớp = SNAPSHOT (copy bài).
// Nội dung bài lưu STRUCTURED: mỗi bài 1 dòng (phan/loai/ref/an_de); resolve nội dung sống khi in (cần Luoi).
import { supabase } from '../supabase'
import type { Bai, BienThe, Y } from './hinh'
import type { PickItem } from '../../store/useStore'

const LIMIT = 10000

export type GiaoTrinh = { id: string; ten: string; khoi: string; mon: string; created_by: string | null; created_at?: string; updated_at?: string }
export type GtBuoi = {
  id: string; thu_tu: number; tieu_de: string | null; mo_hinh_chinh_id: string | null
  giao_trinh_id: string | null                       // set = buổi MASTER
  lop_id: string | null; ngay: string | null; stt_lop: number | null; nguon_buoi_id: string | null  // set = bản LỚP (snapshot)
}
export type GtBai = {
  id: string; buoi_id: string; phan: 'lop' | 'nha'; loai: 'chuan' | 'bienthe' | 'y' | 'ghep'
  ref_id: string | null; ghep_node_ids: string[]; lua_id: string | null; an_de: boolean; so_dong: number | null; thu_tu: number
}
// Hình chiếu của nháp "Theo mô hình" cần để lưu 1 buổi — 1 DANH SÁCH pick thống nhất (§08-08 "1 chuỗi
// ghép lại cũng là 1 bài"), thay cho sel+ghep tách rời trước đây.
export type NhapBuoi = { picks: PickItem[]; anDe: string[]; soDong: Record<string, number> }

// ══════════════ MASTER GIÁO TRÌNH ══════════════
export async function listGiaoTrinh(khoi?: string, mon = 'Toán'): Promise<GiaoTrinh[]> {
  let b = supabase.from('hinh_giao_trinh').select('*').eq('mon', mon).order('created_at', { ascending: false }).limit(LIMIT)
  if (khoi) b = b.eq('khoi', khoi)
  const { data, error } = await b
  if (error) throw error
  return (data ?? []) as GiaoTrinh[]
}
export async function createGiaoTrinh(input: { ten: string; khoi: string; mon?: string }): Promise<GiaoTrinh> {
  const { data: u } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('hinh_giao_trinh')
    .insert({ ten: input.ten, khoi: input.khoi, mon: input.mon ?? 'Toán', created_by: u.user?.id ?? null }).select('*').single()
  if (error) throw error
  return data as GiaoTrinh
}
export async function updateGiaoTrinh(id: string, patch: { ten?: string }): Promise<void> {
  const { error } = await supabase.from('hinh_giao_trinh').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteGiaoTrinh(id: string): Promise<void> {
  const { error } = await supabase.from('hinh_giao_trinh').delete().eq('id', id)   // buổi master cascade; bài cascade theo buổi
  if (error) throw error
}

// ══════════════ BUỔI (master) ══════════════
export async function listBuoiMaster(giaoTrinhId: string): Promise<GtBuoi[]> {
  const { data, error } = await supabase.from('hinh_gt_buoi').select('*').eq('giao_trinh_id', giaoTrinhId).order('thu_tu').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as GtBuoi[]
}
export async function createBuoiMaster(giaoTrinhId: string, input: { tieu_de?: string | null; mo_hinh_chinh_id?: string | null; thu_tu?: number }): Promise<GtBuoi> {
  const { data: u } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('hinh_gt_buoi')
    .insert({ giao_trinh_id: giaoTrinhId, tieu_de: input.tieu_de ?? null, mo_hinh_chinh_id: input.mo_hinh_chinh_id ?? null, thu_tu: input.thu_tu ?? 0, created_by: u.user?.id ?? null })
    .select('*').single()
  if (error) throw error
  return data as GtBuoi
}
export async function updateBuoi(id: string, patch: { tieu_de?: string | null; mo_hinh_chinh_id?: string | null; thu_tu?: number }): Promise<void> {
  const { error } = await supabase.from('hinh_gt_buoi').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteBuoi(id: string): Promise<void> {
  const { error } = await supabase.from('hinh_gt_buoi').delete().eq('id', id)   // bài cascade
  if (error) throw error
}

// ══════════════ BÀI của buổi ══════════════
export async function listGtBai(buoiId: string): Promise<GtBai[]> {
  const { data, error } = await supabase.from('hinh_gt_bai').select('*').eq('buoi_id', buoiId).order('thu_tu').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as GtBai[]
}
/** Lưu NHÁP "Theo mô hình" thành bài của buổi (REPLACE toàn bộ bài của buổi). */
export async function saveBuoiSelection(buoiId: string, nhap: NhapBuoi): Promise<void> {
  const an = new Set(nhap.anDe)
  const seen = new Set<string>()   // khử pick trùng (cùng phiếu + cùng bản + cùng bộ node) → DB không tích luỹ lặp
  const rows: Omit<GtBai, 'id'>[] = []
  let thu = 0
  for (const p of nhap.picks) {
    const sig = p.kind === 'ghep' ? `${p.phan}|ghep|${p.luaId ?? ''}|${[...p.nodeIds].sort().join(',')}` : `${p.phan}|${p.kind}|${p.kind === 'bienthe' ? p.bienTheId : p.yId}`
    if (seen.has(sig)) continue; seen.add(sig)
    const base = { buoi_id: buoiId, phan: p.phan, an_de: an.has(p.key), so_dong: nhap.soDong[p.key] ?? null, thu_tu: thu++ }
    if (p.kind === 'ghep') rows.push({ ...base, loai: 'ghep', ref_id: null, ghep_node_ids: p.nodeIds, lua_id: p.luaId })
    else if (p.kind === 'bienthe') rows.push({ ...base, loai: 'bienthe', ref_id: p.bienTheId, ghep_node_ids: [], lua_id: null })
    else rows.push({ ...base, loai: 'y', ref_id: p.yId, ghep_node_ids: [], lua_id: null })
  }
  const { error: e1 } = await supabase.from('hinh_gt_bai').delete().eq('buoi_id', buoiId)
  if (e1) throw e1
  if (rows.length) { const { error: e2 } = await supabase.from('hinh_gt_bai').insert(rows); if (e2) throw e2 }
  await supabase.from('hinh_gt_buoi').update({ updated_at: new Date().toISOString() }).eq('id', buoiId)
}
// ── ⭐ Chống lạm dụng BẢN (least-used, 08-08 §Kho Hình soạn): đếm số lần mỗi bản đã dùng xuyên MỌI buổi
// (master + lớp) → Gợi ý N ưu tiên bản ÍT DÙNG NHẤT (khuôn cauUsage của Đại, tailieu.ts). ──
export async function banUsageCount(luaIds: string[], bienTheIds: string[], yIds: string[], chuanNodeIds: string[]) {
  const lua = new Map<string, number>(), bienthe = new Map<string, number>(), y = new Map<string, number>(), chuan = new Map<string, number>()
  const jobs: PromiseLike<void>[] = []
  if (luaIds.length) jobs.push(supabase.from('hinh_gt_bai').select('lua_id').in('lua_id', luaIds).limit(LIMIT).then(({ data }) => {
    for (const r of (data ?? []) as { lua_id: string }[]) lua.set(r.lua_id, (lua.get(r.lua_id) ?? 0) + 1)
  }))
  if (bienTheIds.length) jobs.push(supabase.from('hinh_gt_bai').select('ref_id').eq('loai', 'bienthe').in('ref_id', bienTheIds).limit(LIMIT).then(({ data }) => {
    for (const r of (data ?? []) as { ref_id: string }[]) bienthe.set(r.ref_id, (bienthe.get(r.ref_id) ?? 0) + 1)
  }))
  if (yIds.length) jobs.push(supabase.from('hinh_gt_bai').select('ref_id').eq('loai', 'y').in('ref_id', yIds).limit(LIMIT).then(({ data }) => {
    for (const r of (data ?? []) as { ref_id: string }[]) y.set(r.ref_id, (y.get(r.ref_id) ?? 0) + 1)
  }))
  if (chuanNodeIds.length) jobs.push(supabase.from('hinh_gt_bai').select('ref_id, ghep_node_ids').or('loai.eq.chuan,and(loai.eq.ghep,lua_id.is.null)').limit(LIMIT).then(({ data }) => {
    for (const r of (data ?? []) as { ref_id: string | null; ghep_node_ids: string[] }[]) {
      const hits = r.ref_id ? [r.ref_id] : r.ghep_node_ids
      for (const id of hits) if (chuanNodeIds.includes(id)) chuan.set(id, (chuan.get(id) ?? 0) + 1)
    }
  }))
  await Promise.all(jobs)
  return { lua, bienthe, y, chuan }
}
/** Bài của buổi → NHÁP "Theo mô hình" để mở lại chỉnh (cần bản đồ ref→node cho reload UI; ở đây trả thô). */
export async function loadBuoiSelection(buoiId: string): Promise<GtBai[]> {
  return listGtBai(buoiId)
}

// ══════════════ GÁN LỚP (snapshot) ══════════════
/** Gán 1 buổi MASTER cho (lớp, ngày): tạo buổi-kiểu-lớp mới + COPY bài (đóng băng). Trả id buổi lớp. */
export async function ganLopSnapshot(masterBuoiId: string, lopId: string, ngay: string): Promise<string> {
  const { data: mb, error: e0 } = await supabase.from('hinh_gt_buoi').select('*').eq('id', masterBuoiId).single()
  if (e0) throw e0
  const bais = await listGtBai(masterBuoiId)
  const { data: u } = await supabase.auth.getUser()
  const { data: nb, error: e1 } = await supabase.from('hinh_gt_buoi').insert({
    tieu_de: (mb as GtBuoi).tieu_de, mo_hinh_chinh_id: (mb as GtBuoi).mo_hinh_chinh_id,
    lop_id: lopId, ngay, nguon_buoi_id: masterBuoiId, thu_tu: 0, created_by: u.user?.id ?? null,
  }).select('id').single()
  if (e1) throw e1
  const buoiLopId = (nb as { id: string }).id
  if (bais.length) {
    const rows = bais.map((b) => ({ buoi_id: buoiLopId, phan: b.phan, loai: b.loai, ref_id: b.ref_id, ghep_node_ids: b.ghep_node_ids, lua_id: b.lua_id, an_de: b.an_de, so_dong: b.so_dong, thu_tu: b.thu_tu }))
    const { error: e2 } = await supabase.from('hinh_gt_bai').insert(rows)
    if (e2) throw e2
  }
  await renumberBuoiLop(lopId)
  return buoiLopId
}
/** Buổi ĐÃ GÁN của một lớp, sắp theo ngày. */
export async function listBuoiLop(lopId: string): Promise<GtBuoi[]> {
  const { data, error } = await supabase.from('hinh_gt_buoi').select('*').eq('lop_id', lopId).order('ngay').order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as GtBuoi[]
}
/** Đánh lại stt_lop (1,2,3…) theo NGÀY — gọi sau mỗi lần gán/xoá buổi của lớp. */
export async function renumberBuoiLop(lopId: string): Promise<void> {
  const rows = await listBuoiLop(lopId)
  let stt = 0
  for (const r of rows) {
    stt++
    if (r.stt_lop !== stt) { const { error } = await supabase.from('hinh_gt_buoi').update({ stt_lop: stt }).eq('id', r.id); if (error) throw error }
  }
}
export async function goBuoiLop(buoiLopId: string, lopId: string): Promise<void> {
  const { error } = await supabase.from('hinh_gt_buoi').delete().eq('id', buoiLopId)
  if (error) throw error
  await renumberBuoiLop(lopId)
}

// ══════════════ RESOLVE nội dung bài (để in) — fetch biến thể / ý theo id ══════════════
export async function getBienTheByIds(ids: string[]): Promise<Map<string, BienThe>> {
  const u = [...new Set(ids)].filter(Boolean)
  if (!u.length) return new Map()
  const { data, error } = await supabase.from('hinh_baitoan_bien_the').select('*').in('id', u).limit(LIMIT)
  if (error) throw error
  return new Map((data ?? []).map((v: any) => [v.id as string, v as BienThe]))
}
/** Ý thật + bài chứa nó, theo id ý. */
export async function getYFull(ids: string[]): Promise<Map<string, { y: Y; bai: Bai }>> {
  const u = [...new Set(ids)].filter(Boolean)
  if (!u.length) return new Map()
  const { data: ys, error } = await supabase.from('hinh_y').select('*').in('id', u).limit(LIMIT)
  if (error) throw error
  const yArr = (ys ?? []) as Y[]
  const baiIds = [...new Set(yArr.map((y) => y.bai_id))]
  const { data: bais } = await supabase.from('hinh_bai').select('*').in('id', baiIds).limit(LIMIT)
  const mb = new Map((bais ?? []).map((b: any) => [b.id as string, b as Bai]))
  const m = new Map<string, { y: Y; bai: Bai }>()
  for (const y of yArr) { const bai = mb.get(y.bai_id); if (bai) m.set(y.id, { y, bai }) }
  return m
}
