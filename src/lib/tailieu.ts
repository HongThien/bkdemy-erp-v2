// Data-layer "Làm tài liệu" (giáo trình…). Tài liệu = THAM CHIẾU vào kho; resolver kéo nội dung sống khi render.
import { supabase } from './supabase'
import { listCauByDang, type CauHoi } from './kho/api'

const LIMIT = 10000

export type PhanLoai = 'lt_chuyen_de' | 'dang' | 'btvn' | 'custom'
export type CauHinh = { header?: 'wave' | 'none'; footer?: 'wave' | 'none'; watermark?: 'logo' | 'none'; mau?: string }
export type TaiLieu = { id: string; loai: string; ten: string; khoi: string; ma_chuyen_de: string | null; theme: string; cau_hinh?: CauHinh; created_at?: string }
export type TaiLieuPhan = { id: string; tai_lieu_id: string; thu_tu: number; loai_phan: PhanLoai; ref_ma: string | null; tieu_de: string | null; noi_dung: string | null }
type LtRow = { noi_dung: string; file_url: string | null; ten_file: string | null }
type DangRow = { ma_dang: string; ten_dang: string; muc_do: number | null; bac_toi_thieu: string }
export type PhanResolved = TaiLieuPhan & {
  ltChuyenDe?: LtRow | null   // lt_chuyen_de
  dang?: DangRow | null       // dang
  lyThuyetDang?: LtRow | null // dang
  caus: CauHoi[]              // câu luyện (dang) / câu BTVN (btvn)
}
export type TaiLieuFull = { taiLieu: TaiLieu; phans: PhanResolved[] }

// ── Thư viện (CRUD tài liệu) ──────────────────────────────────────
export async function listTaiLieu(khoi?: string, loai = 'giao_trinh'): Promise<TaiLieu[]> {
  let q = supabase.from('tai_lieu').select('*').eq('loai', loai).order('created_at', { ascending: false }).limit(LIMIT)
  if (khoi) q = q.eq('khoi', khoi)
  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as TaiLieu[]
}
export async function createTaiLieu(input: { loai?: string; ten: string; khoi: string; ma_chuyen_de?: string | null; theme?: string }): Promise<TaiLieu> {
  const { data, error } = await supabase.from('tai_lieu')
    .insert({ loai: input.loai ?? 'giao_trinh', ten: input.ten, khoi: input.khoi, ma_chuyen_de: input.ma_chuyen_de ?? null, theme: input.theme ?? 'bkdemy' })
    .select().single()
  if (error) throw error
  return data as TaiLieu
}
export async function updateTaiLieu(id: string, patch: Partial<Pick<TaiLieu, 'ten' | 'theme' | 'ma_chuyen_de' | 'cau_hinh'>>): Promise<void> {
  const { error } = await supabase.from('tai_lieu').update(patch).eq('id', id)
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

// ── Thêm 1 CHUYÊN ĐỀ vào tài liệu: nối [LT chuyên đề → mỗi dạng + câu luyện] vào CUỐI (giữ BTVN cuối cùng) ──
// Tài liệu = NHIỀU chuyên đề gộp; gọi nhiều lần để thêm nhiều chuyên đề.
export async function themChuyenDe(taiLieuId: string, khoi: string, maChuyenDe: string, soLuyen = 6): Promise<void> {
  const phans = await listPhan(taiLieuId)
  const btvn = phans.find((p) => p.loai_phan === 'btvn')
  let tt = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  const { data: dangs, error } = await supabase.from('dai_ban_do').select('ma_dang')
    .eq('khoi', khoi).eq('ma_chuyen_de', maChuyenDe).order('ma_dang').limit(LIMIT)
  if (error) throw error
  await addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt++, loai_phan: 'lt_chuyen_de', ref_ma: maChuyenDe, tieu_de: null, noi_dung: null })
  for (const d of (dangs ?? []) as { ma_dang: string }[]) {
    const phan = await addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt++, loai_phan: 'dang', ref_ma: d.ma_dang, tieu_de: null, noi_dung: null })
    const caus = await autoSuggestCau(d.ma_dang, soLuyen)
    if (caus.length) await setCauOfPhan(phan.id, caus)
  }
  if (btvn) await updatePhan(btvn.id, { thu_tu: tt }) // đẩy BTVN xuống cuối
}
// BTVN: tài liệu có TỐI ĐA 1 phần BTVN, luôn ở cuối. Trả id (tạo nếu chưa có).
export async function ensureBtvnPhan(taiLieuId: string): Promise<string> {
  const phans = await listPhan(taiLieuId)
  const ex = phans.find((p) => p.loai_phan === 'btvn')
  if (ex) return ex.id
  const tt = phans.length ? Math.max(...phans.map((p) => p.thu_tu)) + 1 : 0
  const p = await addPhan({ tai_lieu_id: taiLieuId, thu_tu: tt, loai_phan: 'btvn', ref_ma: null, tieu_de: 'Bài tập về nhà', noi_dung: null })
  return p.id
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
  const dangMas = phans.filter((p) => p.loai_phan === 'dang' && p.ref_ma).map((p) => p.ref_ma as string)
  const dangs = dangMas.length ? (((await supabase.from('dai_ban_do').select('ma_dang,ten_dang,muc_do,bac_toi_thieu').in('ma_dang', dangMas).limit(LIMIT)).data ?? []) as DangRow[]) : []
  const dangMap = new Map(dangs.map((d) => [d.ma_dang, d]))
  const ltDangRows = dangMas.length ? (((await supabase.from('dai_dang_ly_thuyet').select('*').in('ma_dang', dangMas).limit(LIMIT)).data ?? []) as (LtRow & { ma_dang: string })[]) : []
  const ltDangMap = new Map(ltDangRows.map((l) => [l.ma_dang, l]))
  const cdMas = phans.filter((p) => p.loai_phan === 'lt_chuyen_de' && p.ref_ma).map((p) => p.ref_ma as string)
  const ltCdRows = cdMas.length ? (((await supabase.from('dai_chuyen_de_ly_thuyet').select('*').in('ma_chuyen_de', cdMas).limit(LIMIT)).data ?? []) as (LtRow & { ma_chuyen_de: string })[]) : []
  const ltCdMap = new Map(ltCdRows.map((l) => [l.ma_chuyen_de, l]))

  const phansResolved: PhanResolved[] = phans.map((p) => {
    const maList = cauRows.filter((r) => r.phan_id === p.id).sort((a, b) => a.thu_tu - b.thu_tu).map((r) => r.ma_cau)
    return {
      ...p,
      ltChuyenDe: p.loai_phan === 'lt_chuyen_de' && p.ref_ma ? ltCdMap.get(p.ref_ma) ?? null : undefined,
      dang: p.loai_phan === 'dang' && p.ref_ma ? dangMap.get(p.ref_ma) ?? null : undefined,
      lyThuyetDang: p.loai_phan === 'dang' && p.ref_ma ? ltDangMap.get(p.ref_ma) ?? null : undefined,
      caus: maList.map((ma) => cauMap.get(ma)).filter(Boolean) as CauHoi[],
    }
  })
  return { taiLieu: tl as TaiLieu, phans: phansResolved }
}
