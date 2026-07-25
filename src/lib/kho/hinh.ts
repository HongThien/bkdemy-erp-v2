// Data-layer nhánh HÌNH (spec-kho-hinh-v3). UI KHÔNG đụng `supabase` trực tiếp — chỉ gọi ở đây.
// Re-export qua `kho/api.ts` để mọi màn kho có 1 cửa import duy nhất (seam §2.11).
//
// BỐN TẦNG (đọc §0 của spec trước khi sửa file này):
//   ① họ mô hình (các họ ĐỘC LẬP) → ② lưới mô hình (trục GIẢ THIẾT, DAG)
//   → ③ lưới bài toán nhỏ (trục SUY LUẬN, tiền đề đi XUYÊN mô hình) → ④ kho bài vật lý (ÁNH XẠ).
// Hai lưới ②③ là hai lưới RIÊNG, không phải một. Bài (④) KHÔNG phải node của lưới nào.
import { supabase } from '../supabase'
import { mucDoTuCap } from './hinhConfig'

const LIMIT = 10000 // §2.11 — mọi list .limit(10000)

// ══════════════════ KIỂU ══════════════════
export type MoHinh = {
  id: string; mon: string; ma: string; ten: string
  gia_thiet: string; gia_thiet_them: string | null; anh_cau_hinh: string | null
  la_goc_ho: boolean; cap_mo_hinh: number | null; khoi: string | null; ghi_chu: string | null
}
export type CanhMoHinh = { mo_hinh_id: string; cha_id: string }
export type BaiToan = {
  id: string; mon: string; ma: string; phat_bieu: string
  mo_hinh_id: string; cap: number
  de_bai_chuan: string | null; anh_chuan: string | null; ghi_chu: string | null
}
export type CachGiai = {
  id: string; baitoan_id: string; ten: string | null; dang_id: string
  loi_giai: string | null; anh_loi_giai: string | null; la_mac_dinh: boolean; thu_tu: number
}
export type DangHinh = { id: string; mon: string; ma: string; ten: string; cap: 'loai_ch' | 'dang'; cha_id: string | null; thu_tu: number }
export type BoDe = { id: string; mon: string; ma: string; ten: string; phat_bieu: string | null; thu_tu: number }
export type Bai = {
  id: string; mon: string; ma_bai: string; de_bai: string; anh_de: string
  nguon: string | null; khoi: string | null; trang_thai: 'tam' | 'chinh'
  created_by: string | null; created_at?: string
}
export type Y = {
  id: string; ma_y: string; bai_id: string; thu_tu: number; nhan_hien_thi: string | null
  noi_dung: string; dap_an: string | null; loi_giai: string | null; anh_loi_giai: string | null
  da_duyet: boolean; baitoan_id: string | null; co_thieu_node: boolean; mo_ta_thieu: string | null
}

// ══════════════════ SNAPSHOT LƯỚI ══════════════════
// Lưới (② + ③ + catalog) nhỏ — vài trăm node — và MỌI màn sơ đồ cần cả lưới để vẽ.
// ⇒ nạp 1 phát rồi suy trên bộ nhớ. Đây là suy để HIỂN THỊ, KHÔNG ghi ngược DB
// (CLAUDE.md §2: cấm derive ở client rồi ghi lại DB). Phép đệ quy dùng ở chỗ chỉ cần
// 1 node (M8/M9) thì gọi rpc Postgres — xem `baoDongTienDeDB`.
export type Luoi = {
  moHinh: MoHinh[]
  canh: CanhMoHinh[]
  baiToan: BaiToan[]
  cach: CachGiai[]
  tienDe: { cach_id: string; tien_de_id: string }[]
  cachBoDe: { cach_id: string; bo_de_id: string }[]
  dang: DangHinh[]
  boDe: BoDe[]
}

// Lưới đi THEO KHỐI (như bản đồ Đại): mỗi khối một graph riêng. `khoi` gắn ở MÔ HÌNH —
// một họ không trải nhiều khối (Trực tâm là chuyện của khối 9). Bài toán nhỏ / cách giải /
// tiền đề KHÔNG mang cột khối, khối của chúng DERIVE từ mô hình (spec §1.1 "derive không lưu cột").
// Catalog (dạng + bổ đề) là NGOẠI LỆ — dùng chung mọi khối (một "cách xử lý" gặp ở lớp nào cũng vậy).
export async function loadLuoi(khoi?: string): Promise<Luoi> {
  const q = <T,>(t: string, order?: string) => {
    let b = supabase.from(t).select('*').limit(LIMIT)
    if (order) b = b.order(order)
    return b.then(({ data, error }) => { if (error) throw error; return (data ?? []) as T[] })
  }
  let [moHinh, canh, baiToan, cach, tienDe, cachBoDe] = await Promise.all([
    q<MoHinh>('hinh_mo_hinh', 'ma'),
    q<CanhMoHinh>('hinh_mo_hinh_cha'),
    q<BaiToan>('hinh_baitoan', 'cap'),
    q<CachGiai>('hinh_cach_giai', 'thu_tu'),
    q<{ cach_id: string; tien_de_id: string }>('hinh_cach_tien_de'),
    q<{ cach_id: string; bo_de_id: string }>('hinh_cach_bo_de'),
  ])
  const [dang, boDe] = await Promise.all([q<DangHinh>('hinh_dang', 'thu_tu'), q<BoDe>('hinh_bo_de', 'thu_tu')])

  if (khoi) {
    // Cắt lưới về đúng khối: giữ mô hình cùng khối, rồi cascade node → cách → tiền đề/bổ đề.
    // Cạnh tiền đề trỏ sang khối khác (nếu lỡ có) tự rụng — mỗi khối là graph tự chứa.
    const mhIds = new Set(moHinh.filter((m) => m.khoi === khoi).map((m) => m.id))
    moHinh = moHinh.filter((m) => mhIds.has(m.id))
    canh = canh.filter((c) => mhIds.has(c.mo_hinh_id) && mhIds.has(c.cha_id))
    baiToan = baiToan.filter((b) => mhIds.has(b.mo_hinh_id))
    const btIds = new Set(baiToan.map((b) => b.id))
    cach = cach.filter((c) => btIds.has(c.baitoan_id))
    const cachIds = new Set(cach.map((c) => c.id))
    tienDe = tienDe.filter((t) => cachIds.has(t.cach_id) && btIds.has(t.tien_de_id))
    cachBoDe = cachBoDe.filter((x) => cachIds.has(x.cach_id))
  }
  return { moHinh, canh, baiToan, cach, tienDe, cachBoDe, dang, boDe }
}

// ══════════════════ DERIVE (§1.1 — KHÔNG lưu cột) ══════════════════
export const chaCua = (L: Luoi, id: string) => L.canh.filter((c) => c.mo_hinh_id === id).map((c) => c.cha_id)
export const conCua = (L: Luoi, id: string) => L.canh.filter((c) => c.cha_id === id).map((c) => c.mo_hinh_id)

function luyThua(next: (id: string) => string[], goc: string): Set<string> {
  const ra = new Set<string>()
  const stack = [goc]
  while (stack.length) {
    for (const x of next(stack.pop()!)) if (!ra.has(x)) { ra.add(x); stack.push(x) }
  }
  return ra // KHÔNG gồm chính goc; `ra.has` chặn vòng
}
export const toTienCua = (L: Luoi, id: string) => luyThua((x) => chaCua(L, x), id)
export const hauDueCua = (L: Luoi, id: string) => luyThua((x) => conCua(L, x), id)

/** Gốc họ của một mô hình: truy lên tới `la_goc_ho`. Không thấy → chính nó (họ 1 node). */
export function gocHoCua(L: Luoi, id: string): string {
  const mh = L.moHinh.find((m) => m.id === id)
  if (mh?.la_goc_ho) return id
  for (const t of toTienCua(L, id)) if (L.moHinh.find((m) => m.id === t)?.la_goc_ho) return t
  return id
}
/** Mọi mô hình thuộc một họ = gốc + toàn bộ hậu duệ. */
export const moHinhCuaHo = (L: Luoi, gocId: string) => new Set<string>([gocId, ...hauDueCua(L, gocId)])
/** Độ sâu trong họ = số bước từ gốc họ (gốc = 0). */
export function doSauTrongHo(L: Luoi, id: string): number {
  const goc = gocHoCua(L, id)
  if (goc === id) return 0
  let lop = new Set<string>([goc]); let d = 0
  const daQua = new Set<string>([goc])
  while (lop.size && d < 50) {
    d++
    const tiep = new Set<string>()
    for (const x of lop) for (const c of conCua(L, x)) {
      if (c === id) return d
      if (!daQua.has(c)) { daQua.add(c); tiep.add(c) }
    }
    lop = tiep
  }
  return d
}

/** Cách mặc định của một bài toán: `la_mac_dinh`, không có thì `thu_tu` nhỏ nhất (v1 mỗi node 1 cách). */
export function cachMacDinh(L: Luoi, baiToanId: string): CachGiai | null {
  const ds = L.cach.filter((c) => c.baitoan_id === baiToanId)
  if (!ds.length) return null
  return ds.find((c) => c.la_mac_dinh) ?? ds.slice().sort((a, b) => a.thu_tu - b.thu_tu)[0]
}
export const cachCua = (L: Luoi, baiToanId: string) => L.cach.filter((c) => c.baitoan_id === baiToanId)
export const tienDeCuaCach = (L: Luoi, cachId: string) => L.tienDe.filter((t) => t.cach_id === cachId).map((t) => t.tien_de_id)
export const boDeCuaCach = (L: Luoi, cachId: string) => L.cachBoDe.filter((t) => t.cach_id === cachId).map((t) => t.bo_de_id)
/** Tiền đề "hiệu lực" của một node = tiền đề của CÁCH MẶC ĐỊNH (§2 luật 5: tiền đề gắn ở cách giải). */
export function tienDeCua(L: Luoi, baiToanId: string): string[] {
  const c = cachMacDinh(L, baiToanId)
  return c ? tienDeCuaCach(L, c.id) : []
}

/** Cấp gợi ý = 1 + max(cap tiền đề); không tiền đề ⇒ 1. CHỈ để đối chiếu — không ghi đè `cap` nhập tay. */
export function capGoiY(L: Luoi, baiToanId: string): number {
  const td = tienDeCua(L, baiToanId)
  if (!td.length) return 1
  const caps = td.map((id) => L.baiToan.find((b) => b.id === id)?.cap ?? 0)
  return 1 + Math.max(...caps)
}
export function lechCap(L: Luoi, bt: BaiToan): number {
  return bt.cap - capGoiY(L, bt.id)
}
/** Độ khó của node: ngưỡng từ `cap`, +1 bậc nếu cách mặc định có bổ đề. */
export function mucDoCua(L: Luoi, baiToanId: string): number | null {
  const bt = L.baiToan.find((b) => b.id === baiToanId)
  if (!bt) return null
  const c = cachMacDinh(L, baiToanId)
  return mucDoTuCap(bt.cap, !!c && boDeCuaCach(L, c.id).length > 0)
}

/** Bao đóng tiền đề trên snapshot (theo cách mặc định) — id → số bước lùi tối thiểu. */
export function baoDongTienDe(L: Luoi, goc: string): Map<string, number> {
  const ra = new Map<string, number>()
  let lop = [goc]; let d = 0
  while (lop.length && d < 200) {
    d++
    const tiep: string[] = []
    for (const x of lop) for (const t of tienDeCua(L, x)) {
      if (!ra.has(t)) { ra.set(t, d); tiep.push(t) }
    }
    lop = tiep
  }
  return ra
}
/** Bản Postgres của bao đóng — dùng khi chỉ cần 1 node, không muốn tải cả lưới. */
export async function baoDongTienDeDB(baiToanId: string): Promise<{ id: string; do_sau: number }[]> {
  const { data, error } = await supabase.rpc('hinh_bao_dong_tien_de', { goc: baiToanId })
  if (error) throw error
  return (data ?? []) as { id: string; do_sau: number }[]
}

/** Lý thuyết của một mô hình = bài toán của chính nó + KẾ THỪA toàn bộ từ tổ tiên (§1.1). */
export function lyThuyetCuaMoHinh(L: Luoi, moHinhId: string): { rieng: BaiToan[]; keThua: BaiToan[] } {
  const tt = toTienCua(L, moHinhId)
  return {
    rieng: L.baiToan.filter((b) => b.mo_hinh_id === moHinhId),
    keThua: L.baiToan.filter((b) => tt.has(b.mo_hinh_id)),
  }
}

/** Dạng (lá) của một bài toán, theo cách mặc định. */
export function dangCua(L: Luoi, baiToanId: string): DangHinh | null {
  const c = cachMacDinh(L, baiToanId)
  return c ? L.dang.find((d) => d.id === c.dang_id) ?? null : null
}
/** Nhãn dạng 2 tầng: "loại câu hỏi › cách xử lý". */
export function tenDangDayDu(L: Luoi, dangId: string): string {
  const d = L.dang.find((x) => x.id === dangId)
  if (!d) return ''
  const cha = d.cha_id ? L.dang.find((x) => x.id === d.cha_id) : null
  return cha ? `${cha.ten} › ${d.ten}` : d.ten
}

/** Thống kê một họ cho M0: số mô hình con · số bài toán · dải cấp. */
export function thongKeHo(L: Luoi, gocId: string) {
  const trongHo = moHinhCuaHo(L, gocId)
  const bts = L.baiToan.filter((b) => trongHo.has(b.mo_hinh_id))
  const caps = bts.map((b) => b.cap)
  return {
    soMoHinhCon: trongHo.size - 1,
    soBaiToan: bts.length,
    capTu: caps.length ? Math.min(...caps) : null,
    capDen: caps.length ? Math.max(...caps) : null,
  }
}

// ══════════════════ CRUD ② MÔ HÌNH ══════════════════
export type MoHinhInput = Partial<Omit<MoHinh, 'id' | 'mon'>> & { ten: string; gia_thiet: string }

export async function createMoHinh(input: MoHinhInput, chaIds: string[] = []): Promise<MoHinh> {
  const { data, error } = await supabase.from('hinh_mo_hinh')
    .insert({ ...input, la_goc_ho: input.la_goc_ho ?? chaIds.length === 0 }).select('*').single()
  if (error) throw error
  if (chaIds.length) await setChaMoHinh(data.id, chaIds)
  return data as MoHinh
}
export async function updateMoHinh(id: string, patch: Partial<MoHinhInput>): Promise<void> {
  const { error } = await supabase.from('hinh_mo_hinh').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
/** Nối cha (DAG). CHẶN CHU TRÌNH: cha mới không được nằm trong hậu duệ của node (rpc Postgres). */
export async function setChaMoHinh(moHinhId: string, chaIds: string[]): Promise<void> {
  const { data, error: e1 } = await supabase.rpc('hinh_mo_hinh_hau_due', { goc: moHinhId })
  if (e1) throw e1
  const cam = new Set<string>([moHinhId, ...((data ?? []) as { id: string }[]).map((r) => r.id)])
  const xau = chaIds.find((c) => cam.has(c))
  if (xau) throw new Error('Không nối được: mô hình cha nằm trong nhánh con → tạo vòng.')
  const { error: e2 } = await supabase.from('hinh_mo_hinh_cha').delete().eq('mo_hinh_id', moHinhId)
  if (e2) throw e2
  if (chaIds.length) {
    const { error: e3 } = await supabase.from('hinh_mo_hinh_cha').insert(chaIds.map((cha_id) => ({ mo_hinh_id: moHinhId, cha_id })))
    if (e3) throw e3
  }
  await updateMoHinh(moHinhId, { la_goc_ho: chaIds.length === 0 })
}
export async function deleteMoHinh(id: string): Promise<void> {
  const { count, error: e0 } = await supabase.from('hinh_baitoan').select('id', { count: 'exact', head: true }).eq('mo_hinh_id', id)
  if (e0) throw e0
  if (count) throw new Error(`Mô hình còn ${count} bài toán nhỏ — chuyển/xoá chúng trước.`)
  const { error } = await supabase.from('hinh_mo_hinh').delete().eq('id', id)
  if (error) throw error
}

// ══════════════════ CRUD ③ BÀI TOÁN NHỎ ══════════════════
export type BaiToanInput = Partial<Omit<BaiToan, 'id' | 'mon'>> & { phat_bieu: string; mo_hinh_id: string; cap: number }

export async function createBaiToan(input: BaiToanInput): Promise<BaiToan> {
  const { data, error } = await supabase.from('hinh_baitoan').insert(input).select('*').single()
  if (error) throw error
  return data as BaiToan
}
export async function updateBaiToan(id: string, patch: Partial<BaiToanInput>): Promise<void> {
  const { error } = await supabase.from('hinh_baitoan').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteBaiToan(id: string): Promise<void> {
  // Ý thật đang trỏ vào node ⇒ xoá node là làm rụng con trỏ IM LẶNG (CLAUDE.md §2). Chặn.
  const { count, error: e0 } = await supabase.from('hinh_y').select('id', { count: 'exact', head: true }).eq('baitoan_id', id)
  if (e0) throw e0
  if (count) throw new Error(`Còn ${count} ý thật đang trỏ vào node này — gỡ gán trước khi xoá.`)
  const { error } = await supabase.from('hinh_baitoan').delete().eq('id', id)
  if (error) throw error
}
/** Search-before-create (§2 luật 7): tìm node gần giống theo phát biểu. NHẮC, không chặn. */
export async function searchBaiToan(q: string, moHinhIds?: string[]): Promise<BaiToan[]> {
  if (!q.trim()) return []
  let b = supabase.from('hinh_baitoan').select('*').ilike('phat_bieu', `%${q.trim()}%`).limit(50)
  if (moHinhIds?.length) b = b.in('mo_hinh_id', moHinhIds)
  const { data, error } = await b
  if (error) throw error
  return (data ?? []) as BaiToan[]
}

// ── cách giải + tiền đề + bổ đề ──
export async function createCachGiai(input: { baitoan_id: string; dang_id: string; ten?: string | null; loi_giai?: string | null; anh_loi_giai?: string | null; la_mac_dinh?: boolean; thu_tu?: number }): Promise<CachGiai> {
  const { data, error } = await supabase.from('hinh_cach_giai').insert(input).select('*').single()
  if (error) throw error
  return data as CachGiai
}
export async function updateCachGiai(id: string, patch: Partial<Omit<CachGiai, 'id' | 'baitoan_id'>>): Promise<void> {
  const { error } = await supabase.from('hinh_cach_giai').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteCachGiai(id: string): Promise<void> {
  const { error } = await supabase.from('hinh_cach_giai').delete().eq('id', id)
  if (error) throw error
}
/** Tiền đề của một cách. CHẶN CHU TRÌNH: node chủ không được nằm trong bao đóng của tiền đề mới. */
export async function setTienDe(cachId: string, baiToanChuId: string, tienDeIds: string[]): Promise<void> {
  for (const t of tienDeIds) {
    if (t === baiToanChuId) throw new Error('Bài toán không thể là tiền đề của chính nó.')
    const bd = await baoDongTienDeDB(t)
    if (bd.some((x) => x.id === baiToanChuId)) throw new Error('Không nối được: tiền đề này lại cần chính bài toán đang sửa → vòng.')
  }
  const { error: e1 } = await supabase.from('hinh_cach_tien_de').delete().eq('cach_id', cachId)
  if (e1) throw e1
  if (tienDeIds.length) {
    const { error: e2 } = await supabase.from('hinh_cach_tien_de').insert(tienDeIds.map((tien_de_id) => ({ cach_id: cachId, tien_de_id })))
    if (e2) throw e2
  }
}
export async function setBoDeCuaCach(cachId: string, boDeIds: string[]): Promise<void> {
  const { error: e1 } = await supabase.from('hinh_cach_bo_de').delete().eq('cach_id', cachId)
  if (e1) throw e1
  if (boDeIds.length) {
    const { error: e2 } = await supabase.from('hinh_cach_bo_de').insert(boDeIds.map((bo_de_id) => ({ cach_id: cachId, bo_de_id })))
    if (e2) throw e2
  }
}

// ══════════════════ CATALOG: DẠNG (M6) + BỔ ĐỀ (M7) ══════════════════
export async function listDang(): Promise<DangHinh[]> {
  const { data, error } = await supabase.from('hinh_dang').select('*').order('thu_tu').order('ma').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as DangHinh[]
}
export async function createDang(input: { ten: string; cap: 'loai_ch' | 'dang'; cha_id?: string | null; thu_tu?: number }): Promise<DangHinh> {
  if (input.cap === 'dang' && !input.cha_id) throw new Error('Dạng (cách xử lý) phải nằm dưới một loại câu hỏi.')
  const { data, error } = await supabase.from('hinh_dang').insert(input).select('*').single()
  if (error) throw error
  return data as DangHinh
}
export async function updateDang(id: string, patch: { ten?: string; thu_tu?: number; cha_id?: string | null }): Promise<void> {
  const { error } = await supabase.from('hinh_dang').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteDang(id: string): Promise<void> {
  const [{ count: nCon }, { count: nCach }] = await Promise.all([
    supabase.from('hinh_dang').select('id', { count: 'exact', head: true }).eq('cha_id', id),
    supabase.from('hinh_cach_giai').select('id', { count: 'exact', head: true }).eq('dang_id', id),
  ])
  if (nCon) throw new Error(`Còn ${nCon} dạng con — xoá/chuyển chúng trước.`)
  if (nCach) throw new Error(`Còn ${nCach} cách giải đang gắn dạng này — đổi dạng của chúng trước.`)
  const { error } = await supabase.from('hinh_dang').delete().eq('id', id)
  if (error) throw error
}

export async function listBoDe(): Promise<BoDe[]> {
  const { data, error } = await supabase.from('hinh_bo_de').select('*').order('thu_tu').order('ma').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as BoDe[]
}
export async function createBoDe(input: { ten: string; phat_bieu?: string | null; thu_tu?: number }): Promise<BoDe> {
  const { data, error } = await supabase.from('hinh_bo_de').insert(input).select('*').single()
  if (error) throw error
  return data as BoDe
}
export async function updateBoDe(id: string, patch: { ten?: string; phat_bieu?: string | null; thu_tu?: number }): Promise<void> {
  const { error } = await supabase.from('hinh_bo_de').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteBoDe(id: string): Promise<void> {
  const { count } = await supabase.from('hinh_cach_bo_de').select('bo_de_id', { count: 'exact', head: true }).eq('bo_de_id', id)
  if (count) throw new Error(`Còn ${count} cách giải dùng bổ đề này — gỡ trước khi xoá.`)
  const { error } = await supabase.from('hinh_bo_de').delete().eq('id', id)
  if (error) throw error
}

/** Tra ngược M6/M7 trên snapshot: dạng/bổ đề → các bài toán nhỏ dùng nó (kèm tag mô hình ở UI). */
export function baiToanTheoDang(L: Luoi): Map<string, BaiToan[]> {
  const m = new Map<string, BaiToan[]>()
  for (const c of L.cach) {
    const bt = L.baiToan.find((b) => b.id === c.baitoan_id)
    if (!bt) continue
    const arr = m.get(c.dang_id) ?? []
    if (!arr.some((x) => x.id === bt.id)) arr.push(bt)
    m.set(c.dang_id, arr)
  }
  return m
}
export function baiToanTheoBoDe(L: Luoi): Map<string, BaiToan[]> {
  const m = new Map<string, BaiToan[]>()
  for (const lk of L.cachBoDe) {
    const c = L.cach.find((x) => x.id === lk.cach_id)
    const bt = c && L.baiToan.find((b) => b.id === c.baitoan_id)
    if (!bt) continue
    const arr = m.get(lk.bo_de_id) ?? []
    if (!arr.some((x) => x.id === bt.id)) arr.push(bt)
    m.set(lk.bo_de_id, arr)
  }
  return m
}
/** Rollup M6: đếm gộp lên tầng "loại câu hỏi" (đọc tầng trên = mẫu lớn, tín hiệu chắc). */
export function demTheoDangRollup(L: Luoi): Map<string, number> {
  const theo = baiToanTheoDang(L)
  const ra = new Map<string, number>()
  for (const d of L.dang) ra.set(d.id, theo.get(d.id)?.length ?? 0)
  for (const d of L.dang) {
    if (d.cap === 'dang' && d.cha_id) ra.set(d.cha_id, (ra.get(d.cha_id) ?? 0) + (theo.get(d.id)?.length ?? 0))
  }
  return ra
}

// ══════════════════ ④ KHO BÀI VẬT LÝ (M3/M4/M5) ══════════════════
export type BaiFull = Bai & { ys: Y[] }

export async function listBai(trangThai?: 'tam' | 'chinh', khoi?: string): Promise<Bai[]> {
  let b = supabase.from('hinh_bai').select('*').order('created_at', { ascending: false }).limit(LIMIT)
  if (trangThai) b = b.eq('trang_thai', trangThai)
  if (khoi) b = b.eq('khoi', khoi)
  const { data, error } = await b
  if (error) throw error
  return (data ?? []) as Bai[]
}
export async function listY(baiIds?: string[]): Promise<Y[]> {
  let b = supabase.from('hinh_y').select('*').order('thu_tu').limit(LIMIT)
  if (baiIds) { if (!baiIds.length) return []; b = b.in('bai_id', baiIds) }
  const { data, error } = await b
  if (error) throw error
  return (data ?? []) as Y[]
}
export async function getBaiFull(id: string): Promise<BaiFull | null> {
  const { data, error } = await supabase.from('hinh_bai').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  return { ...(data as Bai), ys: await listY([id]) }
}
export async function createBai(input: { de_bai: string; anh_de: string; nguon?: string | null; khoi?: string | null; created_by?: string | null }): Promise<Bai> {
  const { data, error } = await supabase.from('hinh_bai').insert(input).select('*').single()
  if (error) throw error
  return data as Bai
}
export async function updateBai(id: string, patch: Partial<Pick<Bai, 'de_bai' | 'anh_de' | 'nguon' | 'khoi'>>): Promise<void> {
  const { error } = await supabase.from('hinh_bai').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteBai(id: string): Promise<void> {
  const { error } = await supabase.from('hinh_bai').delete().eq('id', id) // ý cascade
  if (error) throw error
}
export async function addY(baiId: string, input: { thu_tu: number; noi_dung: string; nhan_hien_thi?: string | null; dap_an?: string | null; loi_giai?: string | null; anh_loi_giai?: string | null }): Promise<Y> {
  const { data, error } = await supabase.from('hinh_y').insert({ bai_id: baiId, ...input }).select('*').single()
  if (error) throw error
  return data as Y
}
export async function updateY(id: string, patch: Partial<Omit<Y, 'id' | 'bai_id'>>): Promise<void> {
  const { error } = await supabase.from('hinh_y').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}
export async function deleteY(id: string): Promise<void> {
  const { error } = await supabase.from('hinh_y').delete().eq('id', id)
  if (error) throw error
}
/** Gán ý → node lưới. Gán được thì cờ thiếu tự tắt (§0.5 bottom-up: bài tự nối được). */
export async function ganY(yId: string, baiToanId: string): Promise<void> {
  await updateY(yId, { baitoan_id: baiToanId, co_thieu_node: false, mo_ta_thieu: null })
}
export async function goGanY(yId: string): Promise<void> {
  await updateY(yId, { baitoan_id: null })
}
/** "Thiếu node trong sơ đồ" → hàng chờ. KHÔNG chặn nhập liệu (§2 luật 3), bài vẫn ở kho tạm. */
export async function baoThieuNode(yId: string, moTa: string): Promise<void> {
  await updateY(yId, { co_thieu_node: true, mo_ta_thieu: moTa, baitoan_id: null })
}
/** CỔNG 1 → kho chính: mọi ý đã gán `baitoan_id`. Cổng 2 (tiền đề/cấp) KHÔNG chặn cổng này. */
export async function chuyenKhoChinh(baiId: string): Promise<void> {
  const ys = await listY([baiId])
  if (!ys.length) throw new Error('Bài chưa có ý nào.')
  const chuaGan = ys.filter((y) => !y.baitoan_id)
  if (chuaGan.length) throw new Error(`Còn ${chuaGan.length}/${ys.length} ý chưa gán node — chưa qua cổng 1.`)
  const { error } = await supabase.from('hinh_bai').update({ trang_thai: 'chinh', updated_at: new Date().toISOString() }).eq('id', baiId)
  if (error) throw error
}
export async function traVeKhoTam(baiId: string): Promise<void> {
  const { error } = await supabase.from('hinh_bai').update({ trang_thai: 'tam', updated_at: new Date().toISOString() }).eq('id', baiId)
  if (error) throw error
}
/** M5 hàng chờ — kênh bottom-up: CẤP TÍN HIỆU, không cấp quyền ghi vào lưới. Lọc theo khối của bài. */
export async function listHangCho(khoi?: string): Promise<{ y: Y; bai: Bai }[]> {
  const { data, error } = await supabase.from('hinh_y').select('*').eq('co_thieu_node', true).limit(LIMIT)
  if (error) throw error
  const ys = (data ?? []) as Y[]
  if (!ys.length) return []
  let bq = supabase.from('hinh_bai').select('*').in('id', [...new Set(ys.map((y) => y.bai_id))]).limit(LIMIT)
  if (khoi) bq = bq.eq('khoi', khoi)
  const { data: bais, error: e2 } = await bq
  if (e2) throw e2
  const m = new Map((bais ?? []).map((b: any) => [b.id, b as Bai]))
  return ys.map((y) => ({ y, bai: m.get(y.bai_id)! })).filter((x) => x.bai)
}
/** Các ý thực tế đang trỏ tới một node (detail panel M1). */
export async function yTheoNode(baiToanId: string): Promise<{ y: Y; bai: Bai }[]> {
  const { data, error } = await supabase.from('hinh_y').select('*').eq('baitoan_id', baiToanId).limit(LIMIT)
  if (error) throw error
  const ys = (data ?? []) as Y[]
  if (!ys.length) return []
  const { data: bais } = await supabase.from('hinh_bai').select('*').in('id', [...new Set(ys.map((y) => y.bai_id))]).limit(LIMIT)
  const m = new Map((bais ?? []).map((b: any) => [b.id, b as Bai]))
  return ys.map((y) => ({ y, bai: m.get(y.bai_id)! })).filter((x) => x.bai)
}

/** Mô hình của một BÀI = hợp mô hình của các node mà ý trỏ tới (một bài có thể mang NHIỀU tag). */
export function moHinhCuaBai(L: Luoi, ys: Y[]): MoHinh[] {
  const ids = new Set<string>()
  for (const y of ys) {
    const bt = y.baitoan_id ? L.baiToan.find((b) => b.id === y.baitoan_id) : null
    if (bt) ids.add(bt.mo_hinh_id)
  }
  return L.moHinh.filter((m) => ids.has(m.id))
}

/** ĐÁP ÁN HAI BẬC (§3): ý có lời giải riêng = bậc CHUẨN XÁC; trống ⇒ rơi về node = bậc THAM CHIẾU. */
export function dapAnHaiBac(L: Luoi, y: Y): { bac: 'chuan_xac' | 'tham_chieu' | 'chua_co'; loiGiai: string | null; anh: string | null; deBaiChuan?: string | null } {
  if (y.loi_giai || y.anh_loi_giai) return { bac: 'chuan_xac', loiGiai: y.loi_giai, anh: y.anh_loi_giai }
  const bt = y.baitoan_id ? L.baiToan.find((b) => b.id === y.baitoan_id) : null
  if (!bt) return { bac: 'chua_co', loiGiai: null, anh: null }
  const c = cachMacDinh(L, bt.id)
  return { bac: 'tham_chieu', loiGiai: c?.loi_giai ?? null, anh: c?.anh_loi_giai ?? bt.anh_chuan, deBaiChuan: bt.de_bai_chuan }
}

// ══════════════════ M9 ÔN TẬP — rút từ BÀI THẬT theo DẠNG ══════════════════
// Chọn dạng, KHÔNG ràng buộc mô hình: cùng một cách xử lý, gặp ở họ nào cũng được.
// PostgREST không lọc được quan hệ lồng ⇒ đi 2 nhịp: dạng → node → ý.
export async function listYTheoDang(L: Luoi, dangIds: string[], opts?: { khoi?: string | null; doKhoTu?: number; doKhoDen?: number }): Promise<{ y: Y; bai: Bai; bt: BaiToan }[]> {
  const nodeIds = L.cach.filter((c) => dangIds.includes(c.dang_id)).map((c) => c.baitoan_id)
  if (!nodeIds.length) return []
  const { data, error } = await supabase.from('hinh_y').select('*').in('baitoan_id', [...new Set(nodeIds)]).limit(LIMIT)
  if (error) throw error
  const ys = (data ?? []) as Y[]
  if (!ys.length) return []
  let bq = supabase.from('hinh_bai').select('*').in('id', [...new Set(ys.map((y) => y.bai_id))]).eq('trang_thai', 'chinh').limit(LIMIT)
  if (opts?.khoi) bq = bq.eq('khoi', opts.khoi)
  const { data: bais, error: e2 } = await bq
  if (e2) throw e2
  const mb = new Map((bais ?? []).map((b: any) => [b.id, b as Bai]))
  return ys.flatMap((y) => {
    const bai = mb.get(y.bai_id); const bt = L.baiToan.find((b) => b.id === y.baitoan_id)
    if (!bai || !bt) return []
    const dk = mucDoCua(L, bt.id) ?? 0
    if (opts?.doKhoTu != null && dk < opts.doKhoTu) return []
    if (opts?.doKhoDen != null && dk > opts.doKhoDen) return []
    return [{ y, bai, bt }]
  })
}

// ══════════════════ M8 TÀI LIỆU CHUẨN — CHUỖI node ══════════════════
// Một chuỗi = tập node mà một bài thật chạm tới, ĐÓNG theo bao đóng tiền đề rồi sắp topo.
// Nhiều bài khác trường/khác tên điểm đi cùng chuỗi ⇒ DÙNG CHUNG một tài liệu chuẩn.
export type Chuoi = { key: string; nodeIds: string[]; baiIds: string[] }

export function chuoiCuaBai(L: Luoi, ys: Y[]): string[] {
  const goc = ys.map((y) => y.baitoan_id).filter(Boolean) as string[]
  const tap = new Set<string>(goc)
  for (const g of goc) for (const t of baoDongTienDe(L, g).keys()) tap.add(t)
  // sắp topo: theo `cap` rồi `ma` — cấp là số tính chất phải CM trước ⇒ đã là thứ tự dạy được.
  return [...tap]
    .map((id) => L.baiToan.find((b) => b.id === id)!)
    .filter(Boolean)
    .sort((a, b) => a.cap - b.cap || a.ma.localeCompare(b.ma))
    .map((b) => b.id)
}
export function gomChuoi(L: Luoi, bais: Bai[], ys: Y[]): Chuoi[] {
  const theoBai = new Map<string, Y[]>()
  for (const y of ys) { const a = theoBai.get(y.bai_id) ?? []; a.push(y); theoBai.set(y.bai_id, a) }
  const m = new Map<string, Chuoi>()
  for (const b of bais) {
    const nodeIds = chuoiCuaBai(L, theoBai.get(b.id) ?? [])
    if (!nodeIds.length) continue
    const key = nodeIds.join('>')
    const c = m.get(key) ?? { key, nodeIds, baiIds: [] }
    c.baiIds.push(b.id)
    m.set(key, c)
  }
  return [...m.values()].sort((a, b) => b.baiIds.length - a.baiIds.length)
}
/** Mô hình SÂU NHẤT mà chuỗi chạm tới — đề chuẩn + hình chuẩn của tài liệu lấy từ đây (§4 M8). */
export function moHinhSauNhat(L: Luoi, nodeIds: string[]): MoHinh | null {
  let best: MoHinh | null = null; let bestD = -1
  for (const id of nodeIds) {
    const bt = L.baiToan.find((b) => b.id === id); if (!bt) continue
    const mh = L.moHinh.find((m) => m.id === bt.mo_hinh_id); if (!mh) continue
    const d = doSauTrongHo(L, mh.id)
    if (d > bestD) { bestD = d; best = mh }
  }
  return best
}

// ══════════════════ M9 GIẢNG DẠY — khúc A→B ══════════════════
// Một buổi = MỘT KHÚC, không in lại từ cấp 1. Tiền đề nằm DƯỚI A ⇒ buổi trước đã dạy ⇒
// mục "nhắc lại"; KHÔNG nằm dưới A ⇒ HS chưa học ⇒ CẢNH BÁO HỞ.
export type Khuc = {
  trong: BaiToan[]          // node phải dạy trong buổi (A..B), đã sắp topo
  nhacLai: BaiToan[]        // tiền đề nằm dưới A — buổi trước đã dạy
  hoHang: BaiToan[]         // tiền đề KHÔNG nằm dưới A và không trong khúc — HS chưa học
  mocChuong: { truocNodeId: string; moHinh: MoHinh }[]  // chỗ đường đi cắt biên mô hình
}

export function tinhKhuc(L: Luoi, aId: string, bId: string, daHoc: Set<string> = new Set()): Khuc {
  const duoiA = baoDongTienDe(L, aId)          // mọi thứ A cần ⇒ buổi trước đã đi qua
  duoiA.set(aId, 0)
  const canChoB = baoDongTienDe(L, bId)
  const bt = (id: string) => L.baiToan.find((x) => x.id === id)

  // Khúc = node nằm TRÊN ĐƯỜNG A→B, tức vừa (B cần tới) vừa (phụ thuộc vào A).
  // ⚠ KHÔNG lấy cả bao đóng của B trừ đi dưới-A: làm thế thì mọi tiền đề nhánh khác tự động
  //   rơi vào buổi và "cảnh báo hở" thành code chết — đúng cái spec muốn nhìn thấy thì mất.
  //   Node B cần nhưng KHÔNG phụ thuộc A ⇒ HS chưa học ⇒ phải BÁO ĐỎ, người dạy quyết.
  const phuThuocA = new Set<string>([aId])
  for (let i = 0; i < 200; i++) {
    let them = false
    for (const n of L.baiToan) {
      if (phuThuocA.has(n.id)) continue
      if (tienDeCua(L, n.id).some((t) => phuThuocA.has(t))) { phuThuocA.add(n.id); them = true }
    }
    if (!them) break
  }
  const trongIds = [bId, ...canChoB.keys()].filter((id) => phuThuocA.has(id))
  const trong = trongIds.map(bt).filter(Boolean) as BaiToan[]
  trong.sort((x, y) => x.cap - y.cap || x.ma.localeCompare(y.ma))

  const nhacLai: BaiToan[] = []; const hoHang: BaiToan[] = []
  const trongSet = new Set(trong.map((x) => x.id))
  for (const n of trong) {
    for (const t of tienDeCua(L, n.id)) {
      if (trongSet.has(t)) continue
      const node = bt(t); if (!node) continue
      if (duoiA.has(t)) { if (!nhacLai.some((x) => x.id === t)) nhacLai.push(node) }
      else if (!daHoc.has(t) && !hoHang.some((x) => x.id === t)) hoHang.push(node)
    }
  }
  // Tự chia chương: đi dọc khúc, mỗi lần đổi mô hình ⇒ chèn mốc "nay cho thêm: …".
  const mocChuong: { truocNodeId: string; moHinh: MoHinh }[] = []
  let mhTruoc: string | null = null
  for (const n of trong) {
    if (n.mo_hinh_id !== mhTruoc) {
      const mh = L.moHinh.find((m) => m.id === n.mo_hinh_id)
      if (mh) mocChuong.push({ truocNodeId: n.id, moHinh: mh })
      mhTruoc = n.mo_hinh_id
    }
  }
  return { trong, nhacLai, hoHang, mocChuong }
}

// ══════════════════ HOOK ĐO LƯỜNG (spec §8 — reserve, chưa phải Measurement đầy đủ) ══════════════════
// Quan sát vận hành trỏ vào Hình phải mang ĐỦ HAI nhãn: ý nào + LƯỢT DẠY nào.
// Thiếu nhãn lượt thì ba trục (mô hình / dạng / bổ đề) chồng lên một quan sát, sau này không gỡ ra được:
//   · lượt `mo_hinh` (buổi 1) — dạng + bổ đề đã scaffold sẵn ⇒ sai ⇒ quy về MÔ HÌNH
//   · lượt `dang`    (buổi 2) — mô hình đã quen         ⇒ sai ⇒ quy về DẠNG
//   · lượt `luyen_de`         — ôn/thi, không scaffold gì
export type NguCanhLuot = 'mo_hinh' | 'dang' | 'luyen_de'
export const NGU_CANH_LUOT: { v: NguCanhLuot; label: string; mo_ta: string }[] = [
  { v: 'mo_hinh', label: 'Lượt 1 — dạy mô hình', mo_ta: 'dạng + bổ đề đã scaffold sẵn; sai ⇒ quy về mô hình' },
  { v: 'dang', label: 'Lượt 2 — dạy dạng', mo_ta: 'mô hình đã quen; sai ⇒ quy về dạng' },
  { v: 'luyen_de', label: 'Luyện đề', mo_ta: 'không scaffold; đọc dè dặt' },
]

/** Khai LƯỢT DẠY của buổi. Đây là Ý ĐỊNH của buổi — dòng quan sát tự snapshot lúc sinh, đổi sau
 *  KHÔNG viết lại lịch sử đã đo. */
export async function setNguCanhLuotBuoi(buoiHocId: string, v: NguCanhLuot | null): Promise<void> {
  const { error } = await supabase.from('buoi_hoc').update({ ngu_canh_luot: v }).eq('id', buoiHocId)
  if (error) throw error
}
export async function getNguCanhLuotBuoi(buoiHocId: string): Promise<NguCanhLuot | null> {
  const { data, error } = await supabase.from('buoi_hoc').select('ngu_canh_luot').eq('id', buoiHocId).maybeSingle()
  if (error) throw error
  return (data?.ngu_canh_luot ?? null) as NguCanhLuot | null
}

/** Nối một câu đang chấm (ingame/ET/MT/BTVN) về Ý Hình sinh ra nó + lượt dạy tại thời điểm đó. */
export async function ganYVaoProblem(problemId: string, hinhYId: string | null, nguCanh: NguCanhLuot | null): Promise<void> {
  const { error } = await supabase.from('gami_session_problems')
    .update({ hinh_y_id: hinhYId, ngu_canh_luot: nguCanh }).eq('id', problemId)
  if (error) throw error
}
/** Nối một cảnh báo yếu về Ý Hình + lượt dạy. */
export async function ganYVaoCanhBao(canhBaoId: string, hinhYId: string | null, nguCanh: NguCanhLuot | null): Promise<void> {
  const { error } = await supabase.from('canh_bao_yeu')
    .update({ hinh_y_id: hinhYId, ngu_canh_luot: nguCanh }).eq('id', canhBaoId)
  if (error) throw error
}

/** Mọi quan sát đã ghi cho một ý, tách theo lượt dạy — đầu vào của Measurement 3 trục sau này. */
export async function quanSatCuaY(hinhYId: string): Promise<{ problems: { id: string; buoi_hoc_id: string; phase: string; ngu_canh_luot: NguCanhLuot | null }[]; canhBao: { id: string; hoc_sinh_id: string; ngu_canh_luot: NguCanhLuot | null }[] }> {
  const [p, cb] = await Promise.all([
    supabase.from('gami_session_problems').select('id, buoi_hoc_id, phase, ngu_canh_luot').eq('hinh_y_id', hinhYId).limit(LIMIT),
    supabase.from('canh_bao_yeu').select('id, hoc_sinh_id, ngu_canh_luot').eq('hinh_y_id', hinhYId).limit(LIMIT),
  ])
  if (p.error) throw p.error
  if (cb.error) throw cb.error
  return { problems: (p.data ?? []) as any, canhBao: (cb.data ?? []) as any }
}
