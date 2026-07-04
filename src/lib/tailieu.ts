// Data-layer "Làm tài liệu" (giáo trình…). Tài liệu = THAM CHIẾU vào kho; resolver kéo nội dung sống khi render.
import { supabase } from './supabase'
import { listCauByDang, listDaiMap, listKhtnMap, type CauHoi, type MapRow } from './kho/api'

const LIMIT = 10000

// ── DISPATCH KHO theo MÔN của tài liệu (Toán→dai_, KHTN→khtn_). Mặc định Toán → mã cũ KHÔNG đổi. ──
export function khoCuaMon(mon?: string | null): { cauTbl: string; banDoTbl: string; ltDangTbl: string; ltCdTbl: string; listMap: (khoi: string) => Promise<MapRow[]> } {
  return mon === 'KHTN'
    ? { cauTbl: 'khtn_cau_hoi', banDoTbl: 'khtn_ban_do', ltDangTbl: 'khtn_dang_ly_thuyet', ltCdTbl: 'khtn_chuyen_de_ly_thuyet', listMap: listKhtnMap }
    : { cauTbl: 'dai_cau_hoi', banDoTbl: 'dai_ban_do', ltDangTbl: 'dai_dang_ly_thuyet', ltCdTbl: 'dai_chuyen_de_ly_thuyet', listMap: listDaiMap }
}

// buoi = mốc tầng-1 (Buổi 1, 2…). Trong 1 buổi: dang (trên lớp) + btvn (per-dạng) của các dạng đã chọn.
// Lý thuyết chuyên đề KHÔNG lưu phan — DERIVE từ chuyên đề của các dạng trong buổi (lt_chuyen_de chỉ còn cho data cũ).
export type PhanLoai = 'buoi' | 'lt_chuyen_de' | 'dang' | 'btvn' | 'custom'
// btvnLinesByCau = số dòng kẻ (chấm chấm) để HS viết, RIÊNG cho TỪNG bài BTVN (key = ma_cau).
// Không có entry cho câu nào → dùng DEFAULT_BTVN_LINES. (HS làm thẳng vào phiếu, không làm vào vở.)
// etFormByCau = FORM HIỂN THỊ của câu TRONG ET (khác loai_cau của kho) — vd câu kho "trả lời ngắn"
// vẫn in dạng "tự luận" (kẻ dòng) nếu GV muốn. Per ma_cau.
export type CauHinh = { header?: 'wave' | 'none'; footer?: 'wave' | 'none'; watermark?: 'logo' | 'none'; mau?: string; inLyThuyet?: boolean; btvnLinesByCau?: Record<string, number>; etFormByCau?: Record<string, string> }
export const DEFAULT_BTVN_LINES = 5
// Form hiển thị trong ET (độc lập loai_cau kho).
export type ETForm = 'trac_nghiem' | 'tra_loi_ngan' | 'tu_luan'
export const ET_FORMS: { v: ETForm; lbl: string }[] = [{ v: 'trac_nghiem', lbl: 'Trắc nghiệm' }, { v: 'tra_loi_ngan', lbl: 'Trả lời ngắn' }, { v: 'tu_luan', lbl: 'Tự luận' }]
export function etFormOf(c: { ma_cau: string; loai_cau: string; lua_chon?: string[] | null }, ch: CauHinh): ETForm {
  const set = ch.etFormByCau?.[c.ma_cau]
  if (set === 'trac_nghiem' || set === 'tra_loi_ngan' || set === 'tu_luan') return set
  if (c.lua_chon && c.lua_chon.length) return 'trac_nghiem'      // mặc định: có phương án → trắc nghiệm
  return c.loai_cau === 'tu_luan' ? 'tu_luan' : 'tra_loi_ngan'   // còn lại theo kho, default trả lời ngắn
}
export type TaiLieu = { id: string; loai: string; ten: string; khoi: string; mon: string; ma_chuyen_de: string | null; theme: string; cau_hinh?: CauHinh; created_at?: string; updated_at?: string; created_by?: string | null }
// kieu = KIỂU HIỂN THỊ của block (phan): 'thuong'(1 cột) | '2cot' | '3cot' | '4cot' | … (registry mở rộng). Câu giữ ma_dang.
export type BlockKieu = 'thuong' | '2cot' | '3cot' | '4cot'
export const BLOCK_KIEU: { v: BlockKieu; lbl: string; cols: number }[] = [
  { v: 'thuong', lbl: 'Thường', cols: 1 }, { v: '2cot', lbl: '2 cột', cols: 2 }, { v: '3cot', lbl: '3 cột', cols: 3 }, { v: '4cot', lbl: '4 cột', cols: 4 },
]
export const kieuCols = (k?: string): number => BLOCK_KIEU.find((x) => x.v === k)?.cols ?? 1
export type TaiLieuPhan = { id: string; tai_lieu_id: string; thu_tu: number; loai_phan: PhanLoai; ref_ma: string | null; tieu_de: string | null; noi_dung: string | null; kieu?: string }
type LtRow = { noi_dung: string; file_url: string | null; ten_file: string | null }
type DangRow = { ma_dang: string; ten_dang: string; muc_do: number | null; bac_toi_thieu: string; ma_chuyen_de: string; ten_chuyen_de: string }
export type PhanResolved = TaiLieuPhan & {
  dang?: DangRow | null       // dang | btvn (đều ref_ma = ma_dang)
  lyThuyetDang?: LtRow | null // dang (lý thuyết · ví dụ của dạng)
  caus: CauHoi[]              // câu luyện (dang) / câu BTVN (btvn)
}
// ltChuyenDe / tenChuyenDe: map theo ma_chuyen_de — lý thuyết chuyên đề derive từ chuyên đề của các dạng.
export type TaiLieuFull = { taiLieu: TaiLieu; phans: PhanResolved[]; ltChuyenDe: Record<string, LtRow | null>; tenChuyenDe: Record<string, string> }

// ── Thư viện (CRUD tài liệu) ──────────────────────────────────────
export async function listTaiLieu(khoi?: string, loai = 'giao_trinh', mon?: string): Promise<TaiLieu[]> {
  // khoi = undefined → tất cả khối. mon = undefined → mọi môn.
  let q = supabase.from('tai_lieu').select('*').eq('loai', loai).order('created_at', { ascending: false }).limit(LIMIT)
  if (khoi) q = q.eq('khoi', khoi)
  if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}
// Kho tài liệu = MỌI loại (giáo trình/ET/…). lop_id/ngay cho ET. mon = undefined → mọi môn (admin); set → lọc môn.
export async function listAllTaiLieu(mon?: string | string[]): Promise<TaiLieu[]> {
  let q = supabase.from('tai_lieu').select('*').order('created_at', { ascending: false }).limit(LIMIT)
  if (Array.isArray(mon)) { if (mon.length) q = q.in('mon', mon) }
  else if (mon) q = q.eq('mon', mon)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}
export async function createTaiLieu(input: { loai?: string; ten: string; khoi: string; mon?: string; ma_chuyen_de?: string | null; theme?: string }): Promise<TaiLieu> {
  const { data: { user } } = await supabase.auth.getUser() // người tạo = session hiện tại
  const { data, error } = await supabase.from('tai_lieu')
    .insert({ loai: input.loai ?? 'giao_trinh', ten: input.ten, khoi: input.khoi, mon: input.mon ?? 'Toán', ma_chuyen_de: input.ma_chuyen_de ?? null, theme: input.theme ?? 'bkdemy', created_by: user?.id ?? null })
    .select().single()
  if (error) throw error
  return data as TaiLieu
}
export async function updateTaiLieu(id: string, patch: Partial<Pick<TaiLieu, 'ten' | 'theme' | 'ma_chuyen_de' | 'cau_hinh'>>): Promise<void> {
  const { error } = await supabase.from('tai_lieu').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteTaiLieu(id: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu').delete().eq('id', id) // cascade phan + cau
  if (error) throw error
}

// ── Phần (CRUD) ───────────────────────────────────────────────────
export async function listPhan(taiLieuId: string): Promise<TaiLieuPhan[]> {
  const { data, error } = await supabase.from('tai_lieu_phan').select('*').eq('tai_lieu_id', taiLieuId).order('thu_tu').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as TaiLieuPhan[]
}
export async function addPhan(p: Omit<TaiLieuPhan, 'id'>): Promise<TaiLieuPhan> {
  const { data, error } = await supabase.from('tai_lieu_phan').insert(p).select().single()
  if (error) throw error
  return data as TaiLieuPhan
}
export async function updatePhan(id: string, patch: Partial<Pick<TaiLieuPhan, 'tieu_de' | 'noi_dung' | 'thu_tu'>>): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').update(patch).eq('id', id)
  if (error) throw error
}
// Đặt KIỂU HIỂN THỊ cho 1 block (phan).
export async function setPhanKieu(id: string, kieu: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').update({ kieu }).eq('id', id)
  if (error) throw error
}
export async function deletePhan(id: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').delete().eq('id', id)
  if (error) throw error
}
export async function reorderPhan(ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase.from('tai_lieu_phan').update({ thu_tu: i }).eq('id', ids[i])
    if (error) throw error
  }
}
// Thay TOÀN BỘ câu của 1 phần theo danh sách ma_cau (giữ thứ tự)
export async function setCauOfPhan(phanId: string, maCaus: string[]): Promise<void> {
  const { error: e1 } = await supabase.from('tai_lieu_cau').delete().eq('phan_id', phanId)
  if (e1) throw e1
  if (!maCaus.length) return
  const rows = maCaus.map((ma_cau, i) => ({ phan_id: phanId, ma_cau, thu_tu: i }))
  const { error } = await supabase.from('tai_lieu_cau').insert(rows)
  if (error) throw error
}

// ── Chống LẠM DỤNG câu: đếm số lần mỗi câu đã dùng (mọi tai_lieu_cau) → gợi ý câu ÍT DÙNG NHẤT trước.
// (Không khóa cứng toàn cục — câu vẫn dùng lại được, chỉ sau cùng → kho tự xoay vòng đều.)
export async function cauUsage(maCaus: string[]): Promise<Map<string, number>> {
  if (!maCaus.length) return new Map()
  const { data } = await supabase.from('tai_lieu_cau').select('ma_cau').in('ma_cau', maCaus).limit(LIMIT * 50)
  const m = new Map<string, number>()
  for (const r of (data ?? []) as { ma_cau: string }[]) m.set(r.ma_cau, (m.get(r.ma_cau) ?? 0) + 1)
  return m
}
// So sánh ưu tiên: ÍT DÙNG nhất trước, rồi câu GỐC ('le') trước clone.
const cmpUsageLe = (u: Map<string, number>) => (a: CauHoi, b: CauHoi) =>
  (u.get(a.ma_cau) ?? 0) - (u.get(b.ma_cau) ?? 0) || (a.nguon === 'le' ? 0 : 1) - (b.nguon === 'le' ? 0 : 1)

// ── Rule auto gợi ý câu luyện: ít-dùng-nhất + ưu tiên GỐC, lấy N câu đầu ──
export async function autoSuggestCau(maDang: string, n = 6, cauTbl = 'dai_cau_hoi'): Promise<string[]> {
  const caus = await listCauByDang(maDang, cauTbl)
  const u = await cauUsage(caus.map((c) => c.ma_cau))
  return [...caus].sort(cmpUsageLe(u)).slice(0, n).map((c) => c.ma_cau)
}
// 1 câu gợi ý cho 1 dạng (cho ET): loại trừ câu đã dùng trong buổi/đề (`exclude`), lấy câu ÍT DÙNG nhất.
export async function suggestCauForDang(maDang: string, exclude: Set<string>, cauTbl = 'dai_cau_hoi'): Promise<string | null> {
  const caus = (await listCauByDang(maDang, cauTbl)).filter((c) => !exclude.has(c.ma_cau))
  if (!caus.length) return null
  const u = await cauUsage(caus.map((c) => c.ma_cau))
  return [...caus].sort(cmpUsageLe(u))[0].ma_cau
}
// Số câu luyện mặc định mỗi dạng (theo loại) — dùng khi thêm chuyên đề + làm default cho ô nhập.
export const DEFAULT_LUYEN_COUNTS: Record<string, number> = { trac_nghiem: 3, tra_loi_ngan: 2, tu_luan: 1 }
// Gợi ý câu theo SỐ LƯỢNG mỗi loại: { trac_nghiem: 3, tra_loi_ngan: 2, tu_luan: 1 } → ưu tiên gốc.
export async function autoSuggestByLoai(maDang: string, counts: Record<string, number>, cauTbl = 'dai_cau_hoi', exclude: Set<string> = new Set()): Promise<string[]> {
  const caus = (await listCauByDang(maDang, cauTbl)).filter((c) => !exclude.has(c.ma_cau)) // né câu đã dùng ở buổi/dạng khác
  const out: string[] = []
  const u = await cauUsage(caus.map((c) => c.ma_cau))
  for (const [loai, n] of Object.entries(counts)) {
    if (n <= 0) continue
    const pool = caus.filter((c) => c.loai_cau === loai).sort(cmpUsageLe(u))
    out.push(...pool.slice(0, n).map((c) => c.ma_cau))
  }
  return out
}
// Số câu BTVN mặc định mỗi dạng (theo loại) — nhẹ hơn Bài luyện một chút.
export const DEFAULT_BTVN_COUNTS: Record<string, number> = { trac_nghiem: 2, tra_loi_ngan: 1, tu_luan: 1 }
// Gợi ý câu BTVN trải khắp NHIỀU dạng (mỗi dạng theo counts), ưu tiên câu GỐC,
// BỎ câu đã dùng ở Bài luyện (`exclude`) → homework dùng câu KHÁC, chống học vẹt.
export async function autoSuggestBtvn(maDangs: string[], exclude: Set<string>, counts = DEFAULT_BTVN_COUNTS, cauTbl = 'dai_cau_hoi'): Promise<string[]> {
  const out: string[] = []
  for (const md of maDangs) {
    const caus = await listCauByDang(md, cauTbl)
    const u = await cauUsage(caus.map((c) => c.ma_cau))
    for (const [loai, n] of Object.entries(counts)) {
      if (n <= 0) continue
      const pool = caus.filter((c) => c.loai_cau === loai && !exclude.has(c.ma_cau)).sort(cmpUsageLe(u))
      out.push(...pool.slice(0, n).map((c) => c.ma_cau))
    }
  }
  return out
}
// Câu ĐÃ DÙNG ở nơi khác trong CÙNG tài liệu (mọi buổi/dạng/BTVN), trừ 1 phần nếu truyền `exceptPhanId`.
// → CẤM chọn lại câu đã dùng trong buổi này / buổi trước (áp cho cả auto lẫn thủ công).
// Câu đã dùng TRONG CÙNG 1 BUỔI (Thùy 07-04: cùng buổi KHÔNG trùng; KHÁC buổi ĐƯỢC dùng lại).
// Chỉ quét phan (dạng + BTVN) thuộc buổi đó, KHÔNG toàn doc.
export async function usedCausOfBuoi(taiLieuId: string, buoiId: string, exceptPhanId?: string): Promise<Set<string>> {
  const phans = await listPhan(taiLieuId)
  const g = groupBuoi(phans, buoiId)
  const ids = [...Object.values(g.dangs), ...Object.values(g.btvns)].filter((id) => id !== exceptPhanId)
  if (!ids.length) return new Set()
  const { data } = await supabase.from('tai_lieu_cau').select('ma_cau').in('phan_id', ids).limit(LIMIT * 50)
  return new Set((data ?? []).map((r: { ma_cau: string }) => r.ma_cau))
}

// ── BUỔI = tầng 1 ─────────────────────────────────────────────────
// Gom 1 buổi (mốc 'buoi' + các phan đến mốc kế / hết): trả thứ tự dạng + map dang/btvn theo ma_dang.
type BuoiGroup = { order: string[]; dangs: Record<string, string>; btvns: Record<string, string> }
function groupBuoi(phans: TaiLieuPhan[], buoiId: string): BuoiGroup {
  const i = phans.findIndex((p) => p.id === buoiId)
  const g: BuoiGroup = { order: [], dangs: {}, btvns: {} }
  for (let j = i + 1; j < phans.length && phans[j].loai_phan !== 'buoi'; j++) {
    const p = phans[j]
    if (p.loai_phan === 'dang' && p.ref_ma) { if (!(p.ref_ma in g.dangs)) g.order.push(p.ref_ma); g.dangs[p.ref_ma] = p.id }
    else if (p.loai_phan === 'btvn' && p.ref_ma) g.btvns[p.ref_ma] = p.id
  }
  return g
}
// Thêm 1 buổi mới (rỗng) vào cuối tài liệu.
export async function addBuoi(taiLieuId: string): Promise<void> {
  const phans = await listPhan(taiLieuId)
  const n = phans.filter((p) => p.loai_phan === 'buoi').length + 1
  const tt = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  await addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt, loai_phan: 'buoi', ref_ma: null, tieu_de: `Buổi ${n}`, noi_dung: null })
}
// Xoá 1 buổi: mốc + toàn bộ phan thuộc buổi đó.
export async function deleteBuoi(taiLieuId: string, buoiId: string): Promise<void> {
  const phans = await listPhan(taiLieuId)
  const i = phans.findIndex((p) => p.id === buoiId)
  if (i < 0) return
  await deletePhan(buoiId)
  for (let j = i + 1; j < phans.length && phans[j].loai_phan !== 'buoi'; j++) await deletePhan(phans[j].id)
}
// Đặt TẬP dạng cho 1 buổi: dạng mới → tạo (dang+btvn) auto-suggest; dạng bỏ → xoá; rồi sắp lại thứ tự cả tài liệu.
// Mỗi buổi xếp: [tất cả 'dang' (trên lớp)] rồi [tất cả 'btvn' (về nhà)] — đúng thứ tự dạng.
export async function setDangOfBuoi(taiLieuId: string, buoiId: string, maDangs: string[], cauTbl = 'dai_cau_hoi'): Promise<void> {
  const phans = await listPhan(taiLieuId)
  const target = groupBuoi(phans, buoiId)
  const toRemove = target.order.filter((ma) => !maDangs.includes(ma))
  const toAdd = maDangs.filter((ma) => !(ma in target.dangs))
  for (const ma of toRemove) {
    if (target.dangs[ma]) await deletePhan(target.dangs[ma])
    if (target.btvns[ma]) await deletePhan(target.btvns[ma])
  }
  // Câu đã dùng trong CÙNG BUỔI này (đã trừ phan vừa xoá) → auto-suggest né, tích luỹ qua từng dạng mới. Khác buổi KHÔNG né.
  const usedInBuoi = await usedCausOfBuoi(taiLieuId, buoiId)
  const newDang: Record<string, string> = {}, newBtvn: Record<string, string> = {}
  for (const ma of toAdd) {
    const luyen = await autoSuggestByLoai(ma, DEFAULT_LUYEN_COUNTS, cauTbl, usedInBuoi)
    const dp = await addPhan({ tai_lieu_id: taiLieuId, thu_tu: 99999, loai_phan: 'dang', ref_ma: ma, tieu_de: null, noi_dung: null })
    if (luyen.length) await setCauOfPhan(dp.id, luyen)
    luyen.forEach((m) => usedInBuoi.add(m))
    const hw = await autoSuggestBtvn([ma], usedInBuoi, DEFAULT_BTVN_COUNTS, cauTbl) // exclude gồm cả câu luyện vừa thêm (cùng buổi)
    const bp = await addPhan({ tai_lieu_id: taiLieuId, thu_tu: 99999, loai_phan: 'btvn', ref_ma: ma, tieu_de: null, noi_dung: null })
    if (hw.length) await setCauOfPhan(bp.id, hw)
    hw.forEach((m) => usedInBuoi.add(m))
    newDang[ma] = dp.id; newBtvn[ma] = bp.id
  }
  // Dựng lại thứ tự toàn tài liệu (dùng snapshot `phans` cho các buổi KHÁC — chúng không đổi).
  const markers = phans.filter((p) => p.loai_phan === 'buoi')
  const firstMarkerIdx = phans.findIndex((p) => p.loai_phan === 'buoi')
  const order: string[] = []
  if (firstMarkerIdx > 0) for (let k = 0; k < firstMarkerIdx; k++) order.push(phans[k].id) // giữ phan rời (data cũ) ở đầu
  // GIỮ thứ tự dạng hiện có (reorder tay không bị xoá); dạng MỚI chèn cạnh chuyên đề cùng họ (LT chuyên đề vẫn 1 lần), không có thì append cuối.
  const cdOf = (ma: string) => ma.slice(0, 6) // 6 ký tự đầu ma_dang = ma_chuyen_de
  const targetOrder = target.order.filter((ma) => maDangs.includes(ma))
  for (const ma of maDangs.filter((m) => !target.order.includes(m))) {
    let idx = -1
    for (let i = targetOrder.length - 1; i >= 0; i--) if (cdOf(targetOrder[i]) === cdOf(ma)) { idx = i; break }
    if (idx >= 0) targetOrder.splice(idx + 1, 0, ma); else targetOrder.push(ma)
  }
  for (const m of markers) {
    order.push(m.id)
    const g = m.id === buoiId
      ? { order: targetOrder, dangs: { ...target.dangs, ...newDang }, btvns: { ...target.btvns, ...newBtvn } }
      : groupBuoi(phans, m.id)
    for (const ma of g.order) if (g.dangs[ma]) order.push(g.dangs[ma])
    for (const ma of g.order) if (g.btvns[ma]) order.push(g.btvns[ma])
  }
  await reorderPhan(order)
}

// Đổi thứ tự DẠNG trong 1 buổi (giữ nguyên dạng/btvn, chỉ sắp lại thu_tu). orderedMaDangs = thứ tự MỚI người chọn.
export async function reorderDangInBuoi(taiLieuId: string, buoiId: string, orderedMaDangs: string[]): Promise<void> {
  const phans = await listPhan(taiLieuId)
  const markers = phans.filter((p) => p.loai_phan === 'buoi')
  const firstMarkerIdx = phans.findIndex((p) => p.loai_phan === 'buoi')
  const order: string[] = []
  if (firstMarkerIdx > 0) for (let k = 0; k < firstMarkerIdx; k++) order.push(phans[k].id) // giữ phan rời (data cũ) ở đầu
  for (const m of markers) {
    order.push(m.id)
    const g = groupBuoi(phans, m.id)
    const ord = m.id === buoiId ? orderedMaDangs.filter((ma) => ma in g.dangs) : g.order
    for (const ma of ord) if (g.dangs[ma]) order.push(g.dangs[ma])
    for (const ma of ord) if (g.btvns[ma]) order.push(g.btvns[ma])
  }
  await reorderPhan(order)
}

// ── Resolver: gom phần + nội dung SỐNG từ kho (cho print-view) ──
export async function getTaiLieuFull(id: string): Promise<TaiLieuFull> {
  const { data: tl, error } = await supabase.from('tai_lieu').select('*').eq('id', id).single()
  if (error) throw error
  const phans = await listPhan(id)
  const phanIds = phans.map((p) => p.id)
  const cauRows = phanIds.length
    ? (((await supabase.from('tai_lieu_cau').select('*').in('phan_id', phanIds).order('thu_tu').limit(LIMIT)).data ?? []) as { phan_id: string; ma_cau: string; thu_tu: number }[])
    : []
  const K = khoCuaMon((tl as any).mon) // dispatch kho theo MÔN của tài liệu
  const maCaus = [...new Set(cauRows.map((r) => r.ma_cau))]
  const caus = maCaus.length ? (((await supabase.from(K.cauTbl).select('*').in('ma_cau', maCaus).limit(LIMIT)).data ?? []) as CauHoi[]) : []
  const cauMap = new Map(caus.map((c) => [c.ma_cau, c]))
  // Dạng dùng cho CẢ 'dang' (trên lớp) lẫn 'btvn' (về nhà) — đều ref_ma = ma_dang.
  const dangMas = [...new Set(phans.filter((p) => (p.loai_phan === 'dang' || p.loai_phan === 'btvn') && p.ref_ma).map((p) => p.ref_ma as string))]
  const dangs = dangMas.length ? (((await supabase.from(K.banDoTbl).select('ma_dang,ten_dang,muc_do,bac_toi_thieu,ma_chuyen_de,ten_chuyen_de').in('ma_dang', dangMas).limit(LIMIT)).data ?? []) as DangRow[]) : []
  const dangMap = new Map(dangs.map((d) => [d.ma_dang, d]))
  const ltDangRows = dangMas.length ? (((await supabase.from(K.ltDangTbl).select('*').in('ma_dang', dangMas).limit(LIMIT)).data ?? []) as (LtRow & { ma_dang: string })[]) : []
  const ltDangMap = new Map(ltDangRows.map((l) => [l.ma_dang, l]))
  // Lý thuyết chuyên đề DERIVE từ chuyên đề của các dạng TRÊN LỚP (mỗi buổi sẽ tự hiện LT của chuyên đề nó chứa).
  const cdMas = [...new Set(phans.filter((p) => p.loai_phan === 'dang' && p.ref_ma).map((p) => dangMap.get(p.ref_ma as string)?.ma_chuyen_de).filter(Boolean) as string[])]
  const ltCdRows = cdMas.length ? (((await supabase.from(K.ltCdTbl).select('*').in('ma_chuyen_de', cdMas).limit(LIMIT)).data ?? []) as (LtRow & { ma_chuyen_de: string })[]) : []
  const ltCdMap = new Map(ltCdRows.map((l) => [l.ma_chuyen_de, l]))
  const ltChuyenDe: Record<string, LtRow | null> = {}
  const tenChuyenDe: Record<string, string> = {}
  for (const cm of cdMas) ltChuyenDe[cm] = ltCdMap.get(cm) ?? null
  for (const d of dangs) tenChuyenDe[d.ma_chuyen_de] = d.ten_chuyen_de

  const phansResolved: PhanResolved[] = phans.map((p) => {
    const maList = cauRows.filter((r) => r.phan_id === p.id).sort((a, b) => a.thu_tu - b.thu_tu).map((r) => r.ma_cau)
    const dangLike = p.loai_phan === 'dang' || p.loai_phan === 'btvn'
    return {
      ...p,
      dang: dangLike && p.ref_ma ? dangMap.get(p.ref_ma) ?? null : undefined,
      lyThuyetDang: p.loai_phan === 'dang' && p.ref_ma ? ltDangMap.get(p.ref_ma) ?? null : undefined,
      caus: maList.map((ma) => cauMap.get(ma)).filter(Boolean) as CauHoi[],
    }
  })
  return { taiLieu: tl as TaiLieu, phans: phansResolved, ltChuyenDe, tenChuyenDe }
}

// ── ET (loai='et') — gắn buổi qua (lop_id, ngay); nội dung = phẳng các 'dang' (KHÔNG buổi/BTVN) ──
export type ETDoc = TaiLieu & { lop_id: string | null; ngay: string | null }
const thuLabelET = (ngay: string) => { const d = new Date(ngay + 'T00:00:00').getDay(); const t = d === 0 ? 8 : d + 1; return t === 8 ? 'CN' : 'T' + t }
// Mã ET = ma_buoi + ".ET" (8A1.T3.16062026.ET) — danh tính suy ra từ lớp+ngày.
export function maET(tenLop: string, ngay: string): string { const [y, m, d] = ngay.split('-'); return `${tenLop}.${thuLabelET(ngay)}.${d}${m}${y}.ET` }

export async function listET(lopId?: string): Promise<ETDoc[]> {
  let q = supabase.from('tai_lieu').select('*').eq('loai', 'et').order('ngay', { ascending: false }).limit(LIMIT)
  if (lopId) q = q.eq('lop_id', lopId)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as ETDoc[]
}
export async function createET(input: { lopId: string; ngay: string; ten: string; khoi: string; mon?: string }): Promise<ETDoc> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('tai_lieu')
    .insert({ loai: 'et', ten: input.ten, khoi: input.khoi, mon: input.mon ?? 'Toán', lop_id: input.lopId, ngay: input.ngay, created_by: user?.id ?? null })
    .select().single()
  if (error) throw error
  return data as ETDoc
}
// Cập nhật ET (tên / gán lại lớp+ngày / cấu hình). lop_id+ngay = đường nối buổi.
export async function updateET(id: string, patch: { ten?: string; lop_id?: string | null; ngay?: string | null; cau_hinh?: CauHinh }): Promise<void> {
  const { error } = await supabase.from('tai_lieu').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
// ET tìm theo buổi (lớp+ngày) — dùng khi tab Chấm ET load (buổi materialize).
export async function getETByBuoi(lopId: string, ngay: string): Promise<ETDoc | null> {
  // order+limit1 (KHÔNG maybeSingle) — cùng lý do getBTVNByBuoi: 1 doc trùng lọt thì lấy mới nhất, đừng throw.
  const { data, error } = await supabase.from('tai_lieu').select('*').eq('loai', 'et').eq('lop_id', lopId).eq('ngay', ngay).order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  return ((data as ETDoc[])?.[0]) ?? null
}
// Nhân bản 1 tài liệu (copy tai_lieu + phans + câu + cau_hinh). Dùng cho: lưu MẪU (lop_id/ngay=null) hoặc tạo từ mẫu.
export async function duplicateTaiLieu(srcId: string, over: { ten: string; lop_id?: string | null; ngay?: string | null }): Promise<TaiLieu> {
  const { data: src, error: eS } = await supabase.from('tai_lieu').select('*').eq('id', srcId).single()
  if (eS) throw eS
  const s = src as any
  const { data: { user } } = await supabase.auth.getUser()
  const { data: nw, error } = await supabase.from('tai_lieu').insert({
    loai: s.loai, ten: over.ten, khoi: s.khoi, mon: s.mon ?? 'Toán', ma_chuyen_de: s.ma_chuyen_de, theme: s.theme, cau_hinh: s.cau_hinh,
    lop_id: over.lop_id ?? null, ngay: over.ngay ?? null, created_by: user?.id ?? null,
  }).select().single()
  if (error) throw error
  const phans = await listPhan(srcId)
  for (const p of phans) {
    const np = await addPhan({ tai_lieu_id: (nw as TaiLieu).id, thu_tu: p.thu_tu, loai_phan: p.loai_phan, ref_ma: p.ref_ma, tieu_de: p.tieu_de, noi_dung: p.noi_dung })
    const { data: caus } = await supabase.from('tai_lieu_cau').select('ma_cau, thu_tu').eq('phan_id', p.id).order('thu_tu').limit(LIMIT)
    if (caus?.length) await supabase.from('tai_lieu_cau').insert(caus.map((c: any) => ({ phan_id: np.id, ma_cau: c.ma_cau, thu_tu: c.thu_tu })))
  }
  return nw as TaiLieu
}

// Copy 1 phan (+ câu) sang tài liệu khác.
async function copyPhanInto(targetId: string, p: TaiLieuPhan, thu_tu: number): Promise<void> {
  const np = await addPhan({ tai_lieu_id: targetId, thu_tu, loai_phan: p.loai_phan, ref_ma: p.ref_ma, tieu_de: p.tieu_de, noi_dung: p.noi_dung })
  const { data: caus } = await supabase.from('tai_lieu_cau').select('ma_cau, thu_tu').eq('phan_id', p.id).order('thu_tu').limit(LIMIT)
  if (caus?.length) await supabase.from('tai_lieu_cau').insert((caus as any[]).map((c) => ({ phan_id: np.id, ma_cau: c.ma_cau, thu_tu: c.thu_tu })))
}
// TRÍCH XUẤT 1 buổi của giáo trình master → doc con BÁM (lớp+ngày): "Giáo trình buổi X" (lý thuyết+luyện) và/hoặc "BTVN buổi X".
// loai con: 'giao_trinh_buoi' (vận hành) · 'btvn' (vận hành). Master (giao_trinh) = phát triển. Cả 3 hiện ở Kho.
export async function trichXuatBuoi(masterId: string, buoiPhanId: string, opts: { lopId: string; ngay: string; khoi: string; tenLop: string; tenBuoi: string; giaoTrinh: boolean; btvn: boolean }): Promise<TaiLieu[]> {
  const phans = await listPhan(masterId)
  const { data: master } = await supabase.from('tai_lieu').select('cau_hinh, theme, mon').eq('id', masterId).single()
  const i = phans.findIndex((p) => p.id === buoiPhanId)
  if (i < 0) throw new Error('Không thấy buổi.')
  const marker = phans[i]
  const dangPhans: TaiLieuPhan[] = [], btvnPhans: TaiLieuPhan[] = []
  for (let j = i + 1; j < phans.length && phans[j].loai_phan !== 'buoi'; j++) {
    if (phans[j].loai_phan === 'dang') dangPhans.push(phans[j])
    else if (phans[j].loai_phan === 'btvn') btvnPhans.push(phans[j])
  }
  const { data: { user } } = await supabase.auth.getUser()
  const ngayVn = opts.ngay.split('-').reverse().join('/')
  const mk = async (loai: string, ten: string): Promise<TaiLieu> => {
    // Re-trích = THAY THẾ doc cũ cùng (lớp+ngày+loại) — chống trùng (unique uq_tai_lieu_van_hanh).
    await supabase.from('tai_lieu').delete().eq('loai', loai).eq('lop_id', opts.lopId).eq('ngay', opts.ngay)
    const { data, error } = await supabase.from('tai_lieu').insert({
      loai, ten, khoi: opts.khoi, mon: (master as any)?.mon ?? 'Toán', theme: (master as any)?.theme ?? 'bkdemy', cau_hinh: (master as any)?.cau_hinh ?? {},
      lop_id: opts.lopId, ngay: opts.ngay, nguon_id: masterId, nguon_buoi: buoiPhanId, created_by: user?.id ?? null,
    }).select().single()
    if (error) throw error
    return data as TaiLieu
  }
  const out: TaiLieu[] = []
  if (opts.giaoTrinh) {
    const nw = await mk('giao_trinh_buoi', `GT ${opts.tenLop} ${ngayVn} · ${opts.tenBuoi}`)
    let t = 0; await copyPhanInto(nw.id, marker, t++); for (const p of dangPhans) await copyPhanInto(nw.id, p, t++)
    out.push(nw)
  }
  if (opts.btvn && btvnPhans.length) {
    const nw = await mk('btvn', `BTVN ${opts.tenLop} ${ngayVn} · ${opts.tenBuoi}`)
    let t = 0; await copyPhanInto(nw.id, marker, t++); for (const p of btvnPhans) await copyPhanInto(nw.id, p, t++)
    out.push(nw)
  }
  return out
}

// Trạng thái đã trích của 1 master cho 1 lớp: gom theo buổi nguồn → ngày + đã có GT buổi / BTVN chưa.
export type TrichState = { nguon_buoi: string; ngay: string | null; hasGT: boolean; hasBTVN: boolean; ids: string[] }
export async function listTrichXuat(masterId: string, lopId: string): Promise<Record<string, TrichState>> {
  const { data, error } = await supabase.from('tai_lieu').select('id, loai, ngay, nguon_buoi')
    .eq('nguon_id', masterId).eq('lop_id', lopId).limit(LIMIT)
  if (error) throw error
  const out: Record<string, TrichState> = {}
  for (const r of (data ?? []) as any[]) {
    if (!r.nguon_buoi) continue
    const s = (out[r.nguon_buoi] ??= { nguon_buoi: r.nguon_buoi, ngay: r.ngay, hasGT: false, hasBTVN: false, ids: [] })
    s.ngay = r.ngay; s.ids.push(r.id)
    if (r.loai === 'giao_trinh_buoi') s.hasGT = true
    if (r.loai === 'btvn') s.hasBTVN = true
  }
  return out
}

// ET câu-centric: 1 phan 'custom' chứa câu THEO THỨ TỰ (mỗi câu 1 "hàng" trong UI; dạng = câu.dang_chinh).
async function etPhanId(taiLieuId: string): Promise<string> {
  const ex = (await listPhan(taiLieuId)).find((p) => p.loai_phan === 'custom')
  if (ex) return ex.id
  return (await addPhan({ tai_lieu_id: taiLieuId, thu_tu: 0, loai_phan: 'custom', ref_ma: null, tieu_de: 'ET', noi_dung: null })).id
}
// Câu của ET (đúng thứ tự) — mỗi CauHoi có dang_chinh để biết dạng của hàng đó.
export async function getETCaus(taiLieuId: string): Promise<CauHoi[]> {
  const full = await getTaiLieuFull(taiLieuId)
  return full.phans.find((p) => p.loai_phan === 'custom')?.caus ?? []
}
// BTVN của buổi (lớp+ngày) — doc loai='btvn' (từ trích xuất). Câu gộp mọi phan 'btvn' theo thứ tự (mỗi dạng 1 phan).
export async function getBTVNByBuoi(lopId: string, ngay: string): Promise<{ id: string } | null> {
  // order+limit1 (KHÔNG maybeSingle): nếu lỡ còn 2 doc trùng (lớp+ngày) thì lấy bản mới nhất, đừng throw cả màn.
  const { data, error } = await supabase.from('tai_lieu').select('id').eq('loai', 'btvn').eq('lop_id', lopId).eq('ngay', ngay).order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  return ((data as { id: string }[])?.[0]) ?? null
}
export async function getBTVNCaus(taiLieuId: string): Promise<CauHoi[]> {
  const full = await getTaiLieuFull(taiLieuId)
  return full.phans.filter((p) => p.loai_phan === 'btvn').flatMap((p) => p.caus)
}
// Câu BÀI LUYỆN của giáo trình buổi (loai_phan='dang') — online chỉ giao BT, KHÔNG lý thuyết.
export async function getGiaoTrinhBuoiCaus(taiLieuId: string): Promise<CauHoi[]> {
  const full = await getTaiLieuFull(taiLieuId)
  return full.phans.filter((p) => p.loai_phan === 'dang').flatMap((p) => p.caus)
}
// Đặt LẠI toàn bộ câu ET theo thứ tự (UI tự dedup trong đề — trong buổi không trùng).
export async function setETCaus(taiLieuId: string, maCaus: string[]): Promise<void> {
  await setCauOfPhan(await etPhanId(taiLieuId), maCaus)
}
