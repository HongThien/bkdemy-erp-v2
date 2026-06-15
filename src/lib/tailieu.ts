// Data-layer "Làm tài liệu" (giáo trình…). Tài liệu = THAM CHIẾU vào kho; resolver kéo nội dung sống khi render.
import { supabase } from './supabase'
import { listCauByDang, type CauHoi } from './kho/api'

const LIMIT = 10000

// buoi = mốc tầng-1 (Buổi 1, 2…). Trong 1 buổi: dang (trên lớp) + btvn (per-dạng) của các dạng đã chọn.
// Lý thuyết chuyên đề KHÔNG lưu phan — DERIVE từ chuyên đề của các dạng trong buổi (lt_chuyen_de chỉ còn cho data cũ).
export type PhanLoai = 'buoi' | 'lt_chuyen_de' | 'dang' | 'btvn' | 'custom'
// btvnLinesByCau = số dòng kẻ (chấm chấm) để HS viết, RIÊNG cho TỪNG bài BTVN (key = ma_cau).
// Không có entry cho câu nào → dùng DEFAULT_BTVN_LINES. (HS làm thẳng vào phiếu, không làm vào vở.)
export type CauHinh = { header?: 'wave' | 'none'; footer?: 'wave' | 'none'; watermark?: 'logo' | 'none'; mau?: string; btvnLinesByCau?: Record<string, number> }
export const DEFAULT_BTVN_LINES = 5
export type TaiLieu = { id: string; loai: string; ten: string; khoi: string; ma_chuyen_de: string | null; theme: string; cau_hinh?: CauHinh; created_at?: string; updated_at?: string; created_by?: string | null }
export type TaiLieuPhan = { id: string; tai_lieu_id: string; thu_tu: number; loai_phan: PhanLoai; ref_ma: string | null; tieu_de: string | null; noi_dung: string | null }
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
export async function listTaiLieu(khoi?: string, loai = 'giao_trinh'): Promise<TaiLieu[]> {
  // khoi = undefined → tất cả khối.
  let q = supabase.from('tai_lieu').select('*').eq('loai', loai).order('created_at', { ascending: false }).limit(LIMIT)
  if (khoi) q = q.eq('khoi', khoi)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}
export async function createTaiLieu(input: { loai?: string; ten: string; khoi: string; ma_chuyen_de?: string | null; theme?: string }): Promise<TaiLieu> {
  const { data: { user } } = await supabase.auth.getUser() // người tạo = session hiện tại
  const { data, error } = await supabase.from('tai_lieu')
    .insert({ loai: input.loai ?? 'giao_trinh', ten: input.ten, khoi: input.khoi, ma_chuyen_de: input.ma_chuyen_de ?? null, theme: input.theme ?? 'bkdemy', created_by: user?.id ?? null })
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

// ── Rule auto gợi ý câu luyện: ưu tiên câu GỐC ('le') > clone, lấy N câu đầu ──
export async function autoSuggestCau(maDang: string, n = 6): Promise<string[]> {
  const caus = await listCauByDang(maDang)
  const sorted = [...caus].sort((a, b) => (a.nguon === 'le' ? 0 : 1) - (b.nguon === 'le' ? 0 : 1))
  return sorted.slice(0, n).map((c) => c.ma_cau)
}
// Số câu luyện mặc định mỗi dạng (theo loại) — dùng khi thêm chuyên đề + làm default cho ô nhập.
export const DEFAULT_LUYEN_COUNTS: Record<string, number> = { trac_nghiem: 3, tra_loi_ngan: 2, tu_luan: 1 }
// Gợi ý câu theo SỐ LƯỢNG mỗi loại: { trac_nghiem: 3, tra_loi_ngan: 2, tu_luan: 1 } → ưu tiên gốc.
export async function autoSuggestByLoai(maDang: string, counts: Record<string, number>): Promise<string[]> {
  const caus = await listCauByDang(maDang)
  const out: string[] = []
  for (const [loai, n] of Object.entries(counts)) {
    if (n <= 0) continue
    const pool = caus.filter((c) => c.loai_cau === loai).sort((a, b) => (a.nguon === 'le' ? 0 : 1) - (b.nguon === 'le' ? 0 : 1))
    out.push(...pool.slice(0, n).map((c) => c.ma_cau))
  }
  return out
}
// Số câu BTVN mặc định mỗi dạng (theo loại) — nhẹ hơn Bài luyện một chút.
export const DEFAULT_BTVN_COUNTS: Record<string, number> = { trac_nghiem: 2, tra_loi_ngan: 1, tu_luan: 1 }
// Gợi ý câu BTVN trải khắp NHIỀU dạng (mỗi dạng theo counts), ưu tiên câu GỐC,
// BỎ câu đã dùng ở Bài luyện (`exclude`) → homework dùng câu KHÁC, chống học vẹt.
export async function autoSuggestBtvn(maDangs: string[], exclude: Set<string>, counts = DEFAULT_BTVN_COUNTS): Promise<string[]> {
  const out: string[] = []
  for (const md of maDangs) {
    const caus = await listCauByDang(md)
    for (const [loai, n] of Object.entries(counts)) {
      if (n <= 0) continue
      const pool = caus.filter((c) => c.loai_cau === loai && !exclude.has(c.ma_cau))
        .sort((a, b) => (a.nguon === 'le' ? 0 : 1) - (b.nguon === 'le' ? 0 : 1))
      out.push(...pool.slice(0, n).map((c) => c.ma_cau))
    }
  }
  return out
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
export async function setDangOfBuoi(taiLieuId: string, buoiId: string, maDangs: string[]): Promise<void> {
  const phans = await listPhan(taiLieuId)
  const target = groupBuoi(phans, buoiId)
  const toRemove = target.order.filter((ma) => !maDangs.includes(ma))
  const toAdd = maDangs.filter((ma) => !(ma in target.dangs))
  for (const ma of toRemove) {
    if (target.dangs[ma]) await deletePhan(target.dangs[ma])
    if (target.btvns[ma]) await deletePhan(target.btvns[ma])
  }
  const newDang: Record<string, string> = {}, newBtvn: Record<string, string> = {}
  for (const ma of toAdd) {
    const luyen = await autoSuggestByLoai(ma, DEFAULT_LUYEN_COUNTS)
    const dp = await addPhan({ tai_lieu_id: taiLieuId, thu_tu: 99999, loai_phan: 'dang', ref_ma: ma, tieu_de: null, noi_dung: null })
    if (luyen.length) await setCauOfPhan(dp.id, luyen)
    const hw = await autoSuggestBtvn([ma], new Set(luyen))
    const bp = await addPhan({ tai_lieu_id: taiLieuId, thu_tu: 99999, loai_phan: 'btvn', ref_ma: ma, tieu_de: null, noi_dung: null })
    if (hw.length) await setCauOfPhan(bp.id, hw)
    newDang[ma] = dp.id; newBtvn[ma] = bp.id
  }
  // Dựng lại thứ tự toàn tài liệu (dùng snapshot `phans` cho các buổi KHÁC — chúng không đổi).
  const markers = phans.filter((p) => p.loai_phan === 'buoi')
  const firstMarkerIdx = phans.findIndex((p) => p.loai_phan === 'buoi')
  const order: string[] = []
  if (firstMarkerIdx > 0) for (let k = 0; k < firstMarkerIdx; k++) order.push(phans[k].id) // giữ phan rời (data cũ) ở đầu
  const targetOrder = [...maDangs].sort() // theo ma_dang → dạng cùng chuyên đề liền nhau (LT chuyên đề hiện 1 lần)
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

// ── Resolver: gom phần + nội dung SỐNG từ kho (cho print-view) ──
export async function getTaiLieuFull(id: string): Promise<TaiLieuFull> {
  const { data: tl, error } = await supabase.from('tai_lieu').select('*').eq('id', id).single()
  if (error) throw error
  const phans = await listPhan(id)
  const phanIds = phans.map((p) => p.id)
  const cauRows = phanIds.length
    ? (((await supabase.from('tai_lieu_cau').select('*').in('phan_id', phanIds).order('thu_tu').limit(LIMIT)).data ?? []) as { phan_id: string; ma_cau: string; thu_tu: number }[])
    : []
  const maCaus = [...new Set(cauRows.map((r) => r.ma_cau))]
  const caus = maCaus.length ? (((await supabase.from('dai_cau_hoi').select('*').in('ma_cau', maCaus).limit(LIMIT)).data ?? []) as CauHoi[]) : []
  const cauMap = new Map(caus.map((c) => [c.ma_cau, c]))
  // Dạng dùng cho CẢ 'dang' (trên lớp) lẫn 'btvn' (về nhà) — đều ref_ma = ma_dang.
  const dangMas = [...new Set(phans.filter((p) => (p.loai_phan === 'dang' || p.loai_phan === 'btvn') && p.ref_ma).map((p) => p.ref_ma as string))]
  const dangs = dangMas.length ? (((await supabase.from('dai_ban_do').select('ma_dang,ten_dang,muc_do,bac_toi_thieu,ma_chuyen_de,ten_chuyen_de').in('ma_dang', dangMas).limit(LIMIT)).data ?? []) as DangRow[]) : []
  const dangMap = new Map(dangs.map((d) => [d.ma_dang, d]))
  const ltDangRows = dangMas.length ? (((await supabase.from('dai_dang_ly_thuyet').select('*').in('ma_dang', dangMas).limit(LIMIT)).data ?? []) as (LtRow & { ma_dang: string })[]) : []
  const ltDangMap = new Map(ltDangRows.map((l) => [l.ma_dang, l]))
  // Lý thuyết chuyên đề DERIVE từ chuyên đề của các dạng TRÊN LỚP (mỗi buổi sẽ tự hiện LT của chuyên đề nó chứa).
  const cdMas = [...new Set(phans.filter((p) => p.loai_phan === 'dang' && p.ref_ma).map((p) => dangMap.get(p.ref_ma as string)?.ma_chuyen_de).filter(Boolean) as string[])]
  const ltCdRows = cdMas.length ? (((await supabase.from('dai_chuyen_de_ly_thuyet').select('*').in('ma_chuyen_de', cdMas).limit(LIMIT)).data ?? []) as (LtRow & { ma_chuyen_de: string })[]) : []
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
