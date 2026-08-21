// Data-layer GIÁO TRÌNH HÌNH (buổi → gán lớp) — độc lập giáo trình Đại (bảng hinh_giao_trinh / hinh_gt_buoi / hinh_gt_bai).
// 1 buổi = bản LƯU của nháp "Theo mô hình" (sel/ghep/anDe → hinh_gt_bai). Gán lớp = SNAPSHOT (copy bài).
// Nội dung bài lưu STRUCTURED: mỗi bài 1 dòng (phan/loai/ref/an_de); resolve nội dung sống khi in (cần Luoi).
import { supabase } from '../supabase'
import type { Bai, BienThe, Y, Luoi } from './hinh'
import { loadLuoi, noDapAn } from './hinh'
import type { PickItem } from '../../store/useStore'

const LIMIT = 10000

export type GiaoTrinh = { id: string; ten: string; khoi: string; mon: string; created_by: string | null; created_at?: string; updated_at?: string }
export type GtBuoi = {
  id: string; thu_tu: number; tieu_de: string | null; mo_hinh_chinh_id: string | null
  giao_trinh_id: string | null                       // set = buổi MASTER
  lop_id: string | null; ngay: string | null; stt_lop: number | null; nguon_buoi_id: string | null  // set = bản LỚP (snapshot)
}
export type GtBai = {
  id: string; buoi_id: string; phan: 'lop' | 'nha' | 'et' | 'mt'; loai: 'chuan' | 'bienthe' | 'y' | 'ghep'
  ref_id: string | null; ghep_node_ids: string[]; lua_id: string | null; an_de: boolean; so_dong: number | null; thu_tu: number
  hinh_che_do: CheDoHinh
}
/** 3 trạng thái HÌNH VẼ của một bài trên phiếu (Thùy 17/08 — trước chỉ có cờ `an_de` 2 trạng thái):
 *   'hien'    — in hình vẽ
 *   'o_trong' — không in hình, chừa KHUNG TRỐNG cho HS tự vẽ  (= an_de cũ)
 *   'khong'   — không hình, không khung. MỚI: trước đây không diễn đạt được. */
export type CheDoHinh = 'hien' | 'o_trong' | 'khong'
export const CHE_DO_HINH: { ma: CheDoHinh; nhan: string; icon: string; goi: string }[] = [
  { ma: 'hien', nhan: 'Hiện hình', icon: '🖼', goi: 'Đang IN hình vẽ. Bấm để chuyển sang chừa ô trống.' },
  { ma: 'o_trong', nhan: 'Ô trống', icon: '✏️', goi: 'Đang chừa Ô TRỐNG cho HS tự vẽ. Bấm để bỏ hẳn hình.' },
  { ma: 'khong', nhan: 'Không hình', icon: '🚫', goi: 'KHÔNG hình, KHÔNG ô trống. Bấm để quay lại hiện hình.' },
]
/** Bấm 1 nút xoay vòng hien → o_trong → khong → hien (gọn hơn 3 nút trên mỗi dòng bài). */
export const cheDoKe = (c: CheDoHinh): CheDoHinh => (c === 'hien' ? 'o_trong' : c === 'o_trong' ? 'khong' : 'hien')
// Hình chiếu của nháp "Theo mô hình" cần để lưu 1 buổi — 1 DANH SÁCH pick thống nhất (§08-08 "1 chuỗi
// ghép lại cũng là 1 bài"), thay cho sel+ghep tách rời trước đây.
export type NhapBuoi = { picks: PickItem[]; cheDo: Record<string, CheDoHinh>; soDong: Record<string, number> }

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
  const cheDoCua = (k: string): CheDoHinh => nhap.cheDo[k] ?? 'hien'
  const seen = new Set<string>()   // khử pick trùng (cùng phiếu + cùng bản + cùng bộ node) → DB không tích luỹ lặp
  const rows: Omit<GtBai, 'id'>[] = []
  let thu = 0
  for (const p of nhap.picks) {
    const sig = p.kind === 'ghep' ? `${p.phan}|ghep|${p.luaId ?? ''}|${[...p.nodeIds].sort().join(',')}` : `${p.phan}|${p.kind}|${p.kind === 'bienthe' ? p.bienTheId : p.yId}`
    if (seen.has(sig)) continue; seen.add(sig)
    // GHI CẢ HAI: `an_de` (cột cũ, suy ra) để mọi đường code chưa đổi còn chạy đúng · `hinh_che_do` là
    // nguồn thật. Khi nào chắc không còn ai đọc `an_de` thì mới bàn chuyện xoá (luật xoá).
    const cd = cheDoCua(p.key)
    const base = { buoi_id: buoiId, phan: p.phan, an_de: cd !== 'hien', hinh_che_do: cd, so_dong: nhap.soDong[p.key] ?? null, thu_tu: thu++ }
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
/** Nghịch đảo `saveBuoiSelection`: bài đã lưu (GtBai[]) → NhapBuoi (PickItem[] thống nhất) để BuoiPickEditor
 *  sửa tại chỗ. `loai='chuan'` (data CŨ trước 08-08) đọc lại y hệt `kind:'ghep',luaId:null,nodeIds:[ref_id]`. */
export async function loadBuoiPicks(buoiId: string): Promise<NhapBuoi> {
  const bais = await listGtBai(buoiId)
  const [btMap, yMap] = await Promise.all([
    getBienTheByIds(bais.filter((b) => b.loai === 'bienthe').map((b) => b.ref_id!).filter(Boolean)),
    getYFull(bais.filter((b) => b.loai === 'y').map((b) => b.ref_id!).filter(Boolean)),
  ])
  const picks: PickItem[] = []; const cheDo: Record<string, CheDoHinh> = {}; const soDong: Record<string, number> = {}
  for (const b of bais) {
    // Ưu tiên cột mới; dòng cũ chưa kịp backfill thì suy từ `an_de` như trước.
    cheDo[b.id] = b.hinh_che_do ?? (b.an_de ? 'o_trong' : 'hien')
    if (b.so_dong != null) soDong[b.id] = b.so_dong
    if (b.loai === 'chuan' && b.ref_id) picks.push({ key: b.id, phan: b.phan, kind: 'ghep', luaId: null, nodeIds: [b.ref_id] })
    else if (b.loai === 'bienthe' && b.ref_id) { const v = btMap.get(b.ref_id); if (v) picks.push({ key: b.id, phan: b.phan, kind: 'bienthe', bienTheId: b.ref_id, nodeIds: [v.baitoan_id] }) }
    else if (b.loai === 'y' && b.ref_id) { const yb = yMap.get(b.ref_id); if (yb?.y.baitoan_id) picks.push({ key: b.id, phan: b.phan, kind: 'y', yId: b.ref_id, nodeIds: [yb.y.baitoan_id] }) }
    else if (b.loai === 'ghep') picks.push({ key: b.id, phan: b.phan, kind: 'ghep', luaId: b.lua_id, nodeIds: b.ghep_node_ids })
  }
  return { picks, cheDo, soDong }
}

// ══════════════ ET Hình (mô hình) — Thùy 21/08 ══════════════
// ET là tài liệu ĐỘC LẬP với giáo trình (như Đại: `trichXuatBuoi` không hề đụng tới ET) — nhưng dùng
// CHUNG bảng hinh_gt_bai/hinh_gt_buoi qua nhãn `phan='et'` riêng, KHÔNG lẫn với 'lop'/'nha' của giáo
// trình (nếu buổi đó đã có giáo trình gán). 1 buổi = 1 hinh_gt_buoi (khớp lop_id+ngay); ET không có
// khái niệm "master" nên tạo/tìm THẲNG (khác `ganLopSnapshot` — không snapshot từ đâu cả).
/** Buổi Hình (lớp+ngày) — tìm hoặc tạo trực tiếp, KHÔNG qua master/snapshot. Dùng cho ET (và các đường
 *  không-giáo-trình khác sau này). Nếu buổi đó ĐÃ có giáo trình gán (từ `ganLopSnapshot`) thì trả về
 *  ĐÚNG hinh_gt_buoi đó — ET và giáo trình chia sẻ 1 buổi, tách nhau bằng `phan`. */
export async function ensureHinhGtBuoiForBuoi(lopId: string, ngay: string): Promise<string> {
  const { data: existing, error: e0 } = await supabase.from('hinh_gt_buoi').select('id').eq('lop_id', lopId).eq('ngay', ngay).order('created_at', { ascending: false }).limit(1)
  if (e0) throw e0
  const found = (existing as { id: string }[])?.[0]
  if (found) return found.id
  const { data: u } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('hinh_gt_buoi').insert({ lop_id: lopId, ngay, thu_tu: 0, created_by: u.user?.id ?? null }).select('id').single()
  if (error) throw error
  return (data as { id: string }).id
}
/** Lưu NHÁP CHỈ 1 `phan` — REPLACE riêng phan đó, KHÔNG đụng phan khác của cùng buổi (khác
 *  `saveBuoiSelection` gốc REPLACE CẢ buổi — không dùng được khi buổi này CÒN giáo trình 'lop'/'nha'). */
export async function saveBuoiSelectionPhan(buoiId: string, phan: 'lop' | 'nha' | 'et' | 'mt', nhap: NhapBuoi): Promise<void> {
  const cheDoCua = (k: string): CheDoHinh => nhap.cheDo[k] ?? 'hien'
  const seen = new Set<string>()
  const rows: Omit<GtBai, 'id'>[] = []
  let thu = 0
  for (const p of nhap.picks) {
    if (p.phan !== phan) continue
    const sig = p.kind === 'ghep' ? `ghep|${p.luaId ?? ''}|${[...p.nodeIds].sort().join(',')}` : `${p.kind}|${p.kind === 'bienthe' ? p.bienTheId : p.yId}`
    if (seen.has(sig)) continue; seen.add(sig)
    const cd = cheDoCua(p.key)
    const base = { buoi_id: buoiId, phan, an_de: cd !== 'hien', hinh_che_do: cd, so_dong: nhap.soDong[p.key] ?? null, thu_tu: thu++ }
    if (p.kind === 'ghep') rows.push({ ...base, loai: 'ghep', ref_id: null, ghep_node_ids: p.nodeIds, lua_id: p.luaId })
    else if (p.kind === 'bienthe') rows.push({ ...base, loai: 'bienthe', ref_id: p.bienTheId, ghep_node_ids: [], lua_id: null })
    else rows.push({ ...base, loai: 'y', ref_id: p.yId, ghep_node_ids: [], lua_id: null })
  }
  const { error: e1 } = await supabase.from('hinh_gt_bai').delete().eq('buoi_id', buoiId).eq('phan', phan)
  if (e1) throw e1
  if (rows.length) { const { error: e2 } = await supabase.from('hinh_gt_bai').insert(rows); if (e2) throw e2 }
  await supabase.from('hinh_gt_buoi').update({ updated_at: new Date().toISOString() }).eq('id', buoiId)
}
/** Bài CHỈ 1 phan của buổi → NhapBuoi (ET Hình mở lại sửa — không load lẫn 'lop'/'nha'). */
export async function loadBuoiPicksPhan(buoiId: string, phan: 'lop' | 'nha' | 'et' | 'mt'): Promise<NhapBuoi> {
  const full = await loadBuoiPicks(buoiId)
  return { picks: full.picks.filter((p) => p.phan === phan), cheDo: full.cheDo, soDong: full.soDong }
}

// ══════════════ GÁN LỚP (snapshot) ══════════════
/** Gán 1 buổi MASTER cho (lớp, ngày): tạo buổi-kiểu-lớp mới + COPY bài (đóng băng). Trả id buổi lớp.
 *  ⭐ Re-gán (Gán lại) cùng (lớp,ngày) → THAY THẾ buổi cũ tại ngày đó (khuôn `trichXuatBuoi` Đại: 1
 *  lớp chỉ có 1 buổi Hình / ngày, kể cả nguồn buổi-master khác) — chống trùng lịch, không tích luỹ rác. */
export async function ganLopSnapshot(masterBuoiId: string, lopId: string, ngay: string): Promise<string> {
  const { data: mb, error: e0 } = await supabase.from('hinh_gt_buoi').select('*').eq('id', masterBuoiId).single()
  if (e0) throw e0
  const bais = await listGtBai(masterBuoiId)
  const { data: u } = await supabase.auth.getUser()
  await supabase.from('hinh_gt_buoi').delete().eq('lop_id', lopId).eq('ngay', ngay)   // thay thế buổi cũ (nếu có) tại ngày này
  const { data: nb, error: e1 } = await supabase.from('hinh_gt_buoi').insert({
    tieu_de: (mb as GtBuoi).tieu_de, mo_hinh_chinh_id: (mb as GtBuoi).mo_hinh_chinh_id,
    lop_id: lopId, ngay, nguon_buoi_id: masterBuoiId, thu_tu: 0, created_by: u.user?.id ?? null,
  }).select('id').single()
  if (e1) throw e1
  const buoiLopId = (nb as { id: string }).id
  if (bais.length) {
    const rows = bais.map((b) => ({ buoi_id: buoiLopId, phan: b.phan, loai: b.loai, ref_id: b.ref_id, ghep_node_ids: b.ghep_node_ids, lua_id: b.lua_id, an_de: b.an_de, hinh_che_do: b.hinh_che_do, so_dong: b.so_dong, thu_tu: b.thu_tu }))
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
// ── ⭐ TRẠNG THÁI GÁN theo buổi MASTER (cho TrichPanel Hình, khuôn listTrichXuat Đại) ──
export type TrichStateHinh = { ngay: string; id: string }
/** Với 1 lớp: buổi MASTER nào (trong `buoiIds`) đã gán, gán vào ngày nào. Key = id buổi MASTER. */
export async function listTrichXuatHinh(lopId: string, buoiIds: string[]): Promise<Record<string, TrichStateHinh>> {
  if (!buoiIds.length) return {}
  const { data, error } = await supabase.from('hinh_gt_buoi').select('id, ngay, nguon_buoi_id')
    .eq('lop_id', lopId).in('nguon_buoi_id', buoiIds).limit(LIMIT)
  if (error) throw error
  const out: Record<string, TrichStateHinh> = {}
  for (const r of (data ?? []) as { id: string; ngay: string | null; nguon_buoi_id: string | null }[]) {
    if (!r.nguon_buoi_id || !r.ngay) continue
    out[r.nguon_buoi_id] = { ngay: r.ngay, id: r.id }
  }
  return out
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

// ══════════════ ⭐ HIỆN CHUNG Ở KHO TÀI LIỆU (bảng tổng, cùng Đại — KHÔNG gộp bảng, chỉ liệt kê chung) ══
export type HinhKhoRow = {
  id: string; ten: string; khoi: string; mon: string
  loai: 'hinh_giao_trinh' | 'hinh_giao_trinh_buoi'   // 'hinh_giao_trinh'=buổi MASTER (phát triển) · 'hinh_giao_trinh_buoi'=bản LỚP (vận hành)
  lop_id: string | null; ngay: string | null; created_at: string
}
/** Mọi buổi Hình (master + gán lớp) → hình chiếu liệt kê chung với `tai_lieu` ở Kho tài liệu bảng-tổng.
 *  KHÔNG đụng bảng `tai_lieu` — Hình vẫn 100% bảng riêng (Thùy chốt "2 giáo trình riêng, không gộp"),
 *  hàm này chỉ SUY dữ liệu hiển thị tương thích để 1 màn liệt kê được cả 2 nguồn. */
export async function listAllBuoiHinh(): Promise<HinhKhoRow[]> {
  const [{ data: gts, error: e1 }, { data: buois, error: e2 }] = await Promise.all([
    supabase.from('hinh_giao_trinh').select('id, ten, khoi, mon').limit(LIMIT),
    supabase.from('hinh_gt_buoi').select('id, tieu_de, giao_trinh_id, lop_id, ngay, nguon_buoi_id, created_at').limit(LIMIT),
  ])
  if (e1) throw e1; if (e2) throw e2
  const gtMap = new Map(((gts ?? []) as { id: string; ten: string; khoi: string; mon: string }[]).map((g) => [g.id, g]))
  const rows = (buois ?? []) as { id: string; tieu_de: string | null; giao_trinh_id: string | null; lop_id: string | null; ngay: string | null; nguon_buoi_id: string | null; created_at: string }[]
  const byId = new Map(rows.map((r) => [r.id, r]))
  const gtOfMasterBuoi = (masterBuoiId: string | null) => {
    const m = masterBuoiId ? byId.get(masterBuoiId) : null
    return m?.giao_trinh_id ? (gtMap.get(m.giao_trinh_id) ?? null) : null
  }
  const out: HinhKhoRow[] = []
  for (const r of rows) {
    if (r.giao_trinh_id) {
      const g = gtMap.get(r.giao_trinh_id); if (!g) continue
      out.push({ id: r.id, ten: `${g.ten} — ${r.tieu_de || 'Buổi'}`, khoi: g.khoi, mon: g.mon, loai: 'hinh_giao_trinh', lop_id: null, ngay: null, created_at: r.created_at })
    } else if (r.lop_id) {
      const g = gtOfMasterBuoi(r.nguon_buoi_id); if (!g) continue
      out.push({ id: r.id, ten: `${g.ten} — ${r.tieu_de || 'Buổi'}`, khoi: g.khoi, mon: g.mon, loai: 'hinh_giao_trinh_buoi', lop_id: r.lop_id, ngay: r.ngay, created_at: r.created_at })
    }
  }
  return out
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

// ══════════════ ⭐ RESOLVE ĐỂ CHẤM (ET/BTVN/MT) — Thùy 21/08, "đánh giá Hình" ═══════════════
// Khác resolve-để-in ở trên (ra text/ảnh cho PDF): ở đây chỉ cần dừng lại tầng NODE (`hinh_baitoan.id`)
// — đơn vị chân lý mastery Hình. Đơn vị chấm = 1 NODE cụ thể trong pick (không gộp cả chuỗi thành 1 ô —
// Thùy chốt "chấm theo từng node", nếu gộp thì luật "không tính mô hình con" vô nghĩa vì không tách
// được ý nào thuộc node nào). Tái dùng ĐÚNG bộ khung `noDapAn`/`ys` mà `mucGhep` dùng để in — không suy
// diễn lại logic chuỗi (1 nguồn sự thật, khớp 1-1 với thứ tự "a) b) c)" hiện trên phiếu HS).
export type HinhDapAn = {
  hinhBaitoanId: string
  hinhBienTheId: string | null
  hinhYId: string | null
  nhan: string   // "5" hoặc "5C" — snapshot lúc sync (mig 202608211127), KHÔNG tính lại khi hiển thị
}
/** Làm phẳng bài của 1 buổi (đã lọc theo `phan`) → 1 dòng/NODE, đúng thứ tự in.
 *  Nhãn = số Bài (thứ tự pick trong buổi, 1-indexed) + CHỮ HOA nếu bài đó > 2 ý (Thùy chốt 21/08;
 *  ≤2 ý thì số trơn, đỡ rối cho GV khi đa số bài chỉ có 1 ý). */
export async function flattenGtBaiToDapAn(L: Luoi, bais: GtBai[]): Promise<HinhDapAn[]> {
  const [btMap, yMap] = await Promise.all([
    getBienTheByIds(bais.filter((b) => b.loai === 'bienthe').map((b) => b.ref_id!).filter(Boolean)),
    getYFull(bais.filter((b) => b.loai === 'y').map((b) => b.ref_id!).filter(Boolean)),
  ])
  const out: HinhDapAn[] = []
  let baiSo = 0
  for (const b of bais) {
    baiSo++
    if (b.loai === 'ghep' || b.loai === 'chuan') {
      const nodeIds = b.loai === 'chuan' ? (b.ref_id ? [b.ref_id] : []) : b.ghep_node_ids
      if (!nodeIds.length) { baiSo--; continue }
      const khung = noDapAn(L, nodeIds)   // ĐÚNG khung mucGhep dùng — thứ tự = thứ tự "a) b) c)" khi in
      const chu = khung.length > 2
      khung.forEach((k, i) => out.push({
        hinhBaitoanId: k.node.id, hinhBienTheId: null, hinhYId: null,
        nhan: chu ? `${baiSo}${String.fromCharCode(65 + i)}` : String(baiSo),
      }))
    } else if (b.loai === 'bienthe' && b.ref_id) {
      const v = btMap.get(b.ref_id)
      if (v) out.push({ hinhBaitoanId: v.baitoan_id, hinhBienTheId: v.id, hinhYId: null, nhan: String(baiSo) })
      else baiSo--
    } else if (b.loai === 'y' && b.ref_id) {
      const yb = yMap.get(b.ref_id)
      if (yb?.y.baitoan_id) out.push({ hinhBaitoanId: yb.y.baitoan_id, hinhBienTheId: null, hinhYId: b.ref_id, nhan: String(baiSo) })
      else baiSo--
    } else baiSo--
  }
  return out
}
/** Buổi (giáo trình Hình, lớp+ngày) khớp `phan` cần chấm — null nếu buổi chưa gán giáo trình Hình nào.
 *  Khớp qua `hinh_gt_buoi.lop_id/ngay` (KHÔNG FK buoi_hoc — cùng nguyên lý ET/BTVN Đại, buổi có thể ẢO
 *  lúc gán). order+limit(1) thay vì .single(): lỡ trùng thì lấy bản mới nhất, đừng throw cả tab chấm. */
export async function loadHinhForBuoi(buoiId: string, phan: 'lop' | 'nha' | 'et' | 'mt'): Promise<{ gtBuoiId: string | null; dapAn: HinhDapAn[] }> {
  const { data: b, error } = await supabase.from('buoi_hoc').select('lop_id, ngay, lop:lop_id(khoi)').eq('id', buoiId).single()
  if (error) throw error
  const lopId = (b as any).lop_id as string | null
  const ngay = (b as any).ngay as string
  const khoi = (b as any).lop?.khoi as string | null
  if (!lopId) return { gtBuoiId: null, dapAn: [] }
  const { data: gtbs, error: e2 } = await supabase.from('hinh_gt_buoi').select('id').eq('lop_id', lopId).eq('ngay', ngay).order('created_at', { ascending: false }).limit(1)
  if (e2) throw e2
  const gtBuoiId = ((gtbs as { id: string }[])?.[0])?.id ?? null
  if (!gtBuoiId) return { gtBuoiId: null, dapAn: [] }
  const bais = (await listGtBai(gtBuoiId)).filter((x) => x.phan === phan)
  if (!bais.length) return { gtBuoiId, dapAn: [] }
  const L = await loadLuoi(khoi ?? undefined)
  return { gtBuoiId, dapAn: await flattenGtBaiToDapAn(L, bais) }
}
