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
// ontap = khối "Ôn tập" cuối phiếu BTVN (spec-btvn-ontap.md) — dạng ôn từ buổi trước, ref_ma = ma_dang
// giống 'dang'/'btvn'. KHÔNG có CHECK constraint thật trên loai_phan (verify pg_constraint) → thêm giá trị
// mới KHÔNG cần migration, chỉ cần mọi chỗ lọc 'dang'/'btvn' cân nhắc có nên gộp thêm 'ontap' hay không.
export type PhanLoai = 'buoi' | 'lt_chuyen_de' | 'dang' | 'btvn' | 'ontap' | 'custom'
// btvnLinesByCau = số dòng kẻ (chấm chấm) để HS viết, RIÊNG cho TỪNG bài BTVN (key = ma_cau).
// Không có entry cho câu nào → dùng DEFAULT_BTVN_LINES. (HS làm thẳng vào phiếu, không làm vào vở.)
// etFormByCau = FORM HIỂN THỊ của câu TRONG ET (khác loai_cau của kho) — vd câu kho "trả lời ngắn"
// vẫn in dạng "tự luận" (kẻ dòng) nếu GV muốn. Per ma_cau.
// phanBac (MT — nâng cao theo hệ, per phan.id) = ÉP TAY hệ tối thiểu thấy được cả PHẦN, đè lên
// suy-tự-động-từ-bac_toi_thieu-của-dạng (mt.ts). Không set (thiếu key) = tự tính theo dạng bên trong.
// etMaDe = 3 MÃ ĐỀ của ET (Thùy 07-31). Đề GỐC = câu trong phan 'custom' (như cũ). Mã đề 2/3 sinh tự động:
// mỗi câu gốc → câu KHÁC cùng DẠNG + cùng FORM. Neo theo CÂU GỐC (key = ma_cau gốc, KHÔNG theo vị trí —
// tránh lệch khi sortETCaus đảo thứ tự). Mỗi entry = [ma_cau đề2, ma_cau đề3]; null = TRỐNG (chặn lưu).
// hsMaDe = mã đề gán cho TỪNG HS (hoc_sinh_id → 1|2|3) để in phiếu tên sẵn, tránh HS cạnh nhau trùng đề.
// Mapping BỀN (Thùy 07-31: sau này đáp án/tự-chấm cũng theo mã đề = theo HS → cần lưu chắc ở đây).
export type CauHinh = { header?: 'wave' | 'none'; footer?: 'wave' | 'none'; watermark?: 'logo' | 'none'; mau?: string; inLyThuyet?: boolean; btvnLinesByCau?: Record<string, number>; etFormByCau?: Record<string, string>; phanBac?: Record<string, string>; etMaDe?: Record<string, (string | null)[]>; hsMaDe?: Record<string, number> }
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
// Câu ứng viên có IN ĐƯỢC ở `form` không (cho sinh mã đề 2/3 — "phải cùng form"). Chỉ trắc nghiệm cần
// phương án; trả-lời-ngắn/tự-luận thì câu nào cũng ép được (set etFormByCau khi sinh). Câu Đúng/Sai
// (có menh_de) chỉ khớp trắc nghiệm — bảng TLN/TL không hiển thị nổi 4 mệnh đề.
export function canBeETForm(c: { lua_chon?: string[] | null; menh_de?: unknown[] | null }, form: ETForm): boolean {
  const coMenhDe = !!(c.menh_de && c.menh_de.length)
  if (coMenhDe) return form === 'trac_nghiem'
  if (form === 'trac_nghiem') return !!(c.lua_chon && c.lua_chon.length)
  return true
}
// ⭐ THỨ TỰ CHUẨN CỦA ET (Thùy chốt 07-20) — gom theo NHÓM IN: trắc nghiệm → trả lời ngắn → tự luận,
// GIỮ NGUYÊN thứ tự chọn bên trong mỗi nhóm. Gom TẠI LÚC LƯU (ETScreen.luu) → ghi thẳng vào `thu_tu`.
// VÌ SAO: trước đây CHỈ ETPrintView gom lúc render, còn bảng phiếu chấm / màn Chấm ET / ET online đọc
// `thu_tu` thô → "Câu 3" trên giấy KHÔNG phải "Câu 3" trên hệ → GV chấm nhầm câu → gán sai `ma_dang`
// → BẨN MASTERY (đơn vị chân lý HS × dạng). Giờ `thu_tu` là thứ tự duy nhất, mọi nơi đọc cùng một nguồn.
// DÙNG CHUNG — đừng copy lại logic gom này ở nơi khác, lệch một bản là tái diễn đúng bug trên.
export type ETGroup = 0 | 1 | 2
export type ETCauLike = { ma_cau: string; loai_cau: string; lua_chon?: string[] | null; menh_de?: unknown[] | null }
// Câu Đúng/Sai (có menh_de) LUÔN thuộc nhóm trắc nghiệm — bảng trả-lời-ngắn không hiển thị nổi 4 mệnh đề.
export function etGroupOf(c: ETCauLike, ch: CauHinh): ETGroup {
  if (c.menh_de && c.menh_de.length) return 0
  const f = etFormOf(c, ch)
  return f === 'trac_nghiem' ? 0 : f === 'tra_loi_ngan' ? 1 : 2
}
export function sortETCaus<T extends ETCauLike>(caus: T[], ch: CauHinh): T[] {
  return caus
    .map((c, i) => ({ c, i }))                                    // i = tie-break, giữ thứ tự chọn trong nhóm
    .sort((a, b) => etGroupOf(a.c, ch) - etGroupOf(b.c, ch) || a.i - b.i)
    .map((x) => x.c)
}
// file_url = link PDF public (bucket 'kho-tailieu') của bản export GẦN NHẤT — ghi đè mỗi lần "🔗 Lấy link" (uploadPagesAsLink, PrintView.tsx). "🖨 In / Xuất PDF" giờ dùng native window.print(), không upload.
// stt_lop = SỐ BUỔI CỦA LỚP (1,2,3…) cho doc vận hành bám (lop_id, ngay) — xem §"Bộ giáo trình riêng
// của lớp" phía dưới. NULL với master/ET/đề thi (không thuộc lớp nào).
export type TaiLieu = { id: string; loai: string; ten: string; khoi: string; mon: string; ma_chuyen_de: string | null; theme: string; cau_hinh?: CauHinh; created_at?: string; updated_at?: string; created_by?: string | null; file_url?: string | null; stt_lop?: number | null }
// kieu = KIỂU HIỂN THỊ của block (phan): 'thuong'(1 cột) | '2cot' | '3cot' | '4cot' | … (registry mở rộng). Câu giữ ma_dang.
export type BlockKieu = 'thuong' | '2cot' | '3cot' | '4cot'
export const BLOCK_KIEU: { v: BlockKieu; lbl: string; cols: number }[] = [
  { v: 'thuong', lbl: 'Thường', cols: 1 }, { v: '2cot', lbl: '2 cột', cols: 2 }, { v: '3cot', lbl: '3 cột', cols: 3 }, { v: '4cot', lbl: '4 cột', cols: 4 },
]
export const kieuCols = (k?: string): number => BLOCK_KIEU.find((x) => x.v === k)?.cols ?? 1
// hien_lt = BẬT/TẮT lý thuyết RIÊNG cho phan này (chỉ có ý nghĩa với loai_phan='dang') — khác
// cau_hinh.inLyThuyet (toàn doc): 1 buổi vừa học dạng mới (hien_lt=true) vừa ôn dạng cũ (hien_lt=false).
// Default true = giữ nguyên hành vi cũ (mọi phan trước đây coi như luôn hiện LT nếu kho có nội dung).
export type TaiLieuPhan = { id: string; tai_lieu_id: string; thu_tu: number; loai_phan: PhanLoai; ref_ma: string | null; tieu_de: string | null; noi_dung: string | null; kieu?: string; hien_lt?: boolean }
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
// Trả về doc bị ĐỔI TÊN/SỐ BUỔI theo (xoá 1 buổi giữa lịch ⇒ các buổi sau của lớp dồn số) — caller
// enqueueLinkGen cho chúng. Xoá doc không thuộc lớp nào → mảng rỗng.
export async function deleteTaiLieu(id: string): Promise<{ id: string; loai: string }[]> {
  const { data: row } = await supabase.from('tai_lieu').select('lop_id, loai').eq('id', id).maybeSingle()
  const { error } = await supabase.from('tai_lieu').delete().eq('id', id) // cascade phan + cau
  if (error) throw error
  const r = row as { lop_id: string | null; loai: string } | null
  if (!r?.lop_id || !LOAI_DOC_LOP.includes(r.loai)) return []
  return renumberBuoiLop(r.lop_id)
}
// Ghi link PDF public sau khi "🔗 Lấy link" upload lên Storage xong (uploadPagesAsLink, PrintView.tsx).
// KHÔNG đụng updated_at — đây là tác dụng phụ của xuất-file, không phải người dùng sửa nội dung tài liệu.
export async function setTaiLieuFileUrl(id: string, fileUrl: string): Promise<void> {
  const { error } = await supabase.from('tai_lieu').update({ file_url: fileUrl }).eq('id', id)
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
// Bật/tắt lý thuyết RIÊNG cho 1 phan 'dang' — xem ghi chú ở TaiLieuPhan.hien_lt.
export async function setPhanHienLt(id: string, hien_lt: boolean): Promise<void> {
  const { error } = await supabase.from('tai_lieu_phan').update({ hien_lt }).eq('id', id)
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
// "Nguồn bài" của 1 câu = câu GỐC nó bám vào (chính nó nếu là gốc 'le', hoặc parent_ma_cau nếu là clone AI).
// 1 dạng có thể có NHIỀU nguồn (nhiều đề gốc khác nhau, mỗi gốc sinh ra N clone) — gộp phẳng theo loại_cau
// rồi lấy N câu đầu (như cũ) sẽ dồn hết vào 1-2 nguồn có nhiều clone nhất. Round-robin qua nguồn thay vào đó
// (Thùy chốt 07-11): mỗi nguồn góp 1 câu xoay vòng cho đến đủ N — không nguồn nào bị bỏ quên.
const nguonCuaCau = (c: CauHoi): string => c.parent_ma_cau ?? c.ma_cau
function pickRoundRobinByNguon(pool: CauHoi[], n: number, u: Map<string, number>): CauHoi[] {
  const byNguon = new Map<string, CauHoi[]>()
  for (const c of pool) { const k = nguonCuaCau(c); (byNguon.get(k) ?? byNguon.set(k, []).get(k)!).push(c) }
  // Mỗi nguồn tự sắp ÍT DÙNG NHẤT trước bên trong nó; các nguồn xếp theo câu-ít-dùng-nhất-của-nguồn đó trước.
  const groups = [...byNguon.values()].map((g) => [...g].sort(cmpUsageLe(u)))
  groups.sort((a, b) => (u.get(a[0].ma_cau) ?? 0) - (u.get(b[0].ma_cau) ?? 0))
  const out: CauHoi[] = []
  for (let i = 0; out.length < n && groups.some((g) => g.length); i++) {
    const g = groups[i % groups.length]
    if (g.length) out.push(g.shift()!)
  }
  return out
}

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
    const pool = caus.filter((c) => c.loai_cau === loai)
    out.push(...pickRoundRobinByNguon(pool, n, u).map((c) => c.ma_cau))
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
      const pool = caus.filter((c) => c.loai_cau === loai && !exclude.has(c.ma_cau))
      out.push(...pickRoundRobinByNguon(pool, n, u).map((c) => c.ma_cau))
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
  // ⭐ 07-24 (Thùy chốt): THỨ TỰ = ĐÚNG THỨ TỰ NGƯỜI CHỌN trong picker — chọn trước ra trước, chọn sau
  // ra sau. Trước đây dạng mới bị TỰ CHÈN cạnh dạng cùng chuyên đề (để LT chuyên đề gom 1 lần) → người
  // soạn chọn theo mạch dạy nhưng bản in lại nhảy chỗ, không đoán được. Gom LT chuyên đề vẫn chạy (nó
  // gom các dạng LIỀN NHAU cùng chuyên đề, xem PrintView.BuoiBlock) — chỉ là không tự sắp xếp lại nữa.
  // Dạng đã có mà picker giữ nguyên → vẫn ở đúng chỗ vì picker nhận `selected` = thứ tự hiện tại.
  const targetOrder = maDangs
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
  const dangMas = [...new Set(phans.filter((p) => (p.loai_phan === 'dang' || p.loai_phan === 'btvn' || p.loai_phan === 'ontap') && p.ref_ma).map((p) => p.ref_ma as string))]
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
    const dangLike = p.loai_phan === 'dang' || p.loai_phan === 'btvn' || p.loai_phan === 'ontap'
    return {
      ...p,
      dang: dangLike && p.ref_ma ? dangMap.get(p.ref_ma) ?? null : undefined,
      lyThuyetDang: p.loai_phan === 'dang' && p.ref_ma ? ltDangMap.get(p.ref_ma) ?? null : undefined,
      caus: maList.map((ma) => cauMap.get(ma)).filter(Boolean) as CauHoi[],
    }
  })
  return { taiLieu: tl as TaiLieu, phans: phansResolved, ltChuyenDe, tenChuyenDe }
}

// Gom mọi câu của 1 TÀI LIỆU BẤT KỲ theo THỨ TỰ ĐỌC — tự nhận diện hình dạng phan, không cần biết
// trước `loai` tài liệu (dùng cho luồng "trỏ vào 1 tài liệu có sẵn", vd Test đầu vào chọn từ Kho):
// có phan 'custom' (ET/MT/MT-buổi/Đề thi) → dùng đúng các phan đó, theo thu_tu phần rồi thu_tu câu;
// không có (giáo trình/BTVN) → gom 'dang'+'btvn' theo thu_tu. Đây là điểm DUY NHẤT xử lý ngoại lệ
// loại tài liệu — chỗ khác chỉ cần gọi hàm này, không cần if theo `loai`.
export async function layCauTheoThuTu(taiLieuId: string): Promise<CauHoi[]> {
  const full = await getTaiLieuFull(taiLieuId)
  const custom = full.phans.filter((p) => p.loai_phan === 'custom')
  const source = custom.length ? custom : full.phans.filter((p) => p.loai_phan === 'dang' || p.loai_phan === 'btvn' || p.loai_phan === 'ontap')
  return source.flatMap((p) => p.caus)
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
    // kieu (2cot/3cot/4cot…) PHẢI đi theo phan khi nhân bản — thiếu thì phan mới rơi về default 'thuong'
    // (bug 07-07: giáo trình 7B đặt 2 cột, trích xuất/gán vào 7B1 xong bản in tự về 1 cột).
    const np = await addPhan({ tai_lieu_id: (nw as TaiLieu).id, thu_tu: p.thu_tu, loai_phan: p.loai_phan, ref_ma: p.ref_ma, tieu_de: p.tieu_de, noi_dung: p.noi_dung, kieu: p.kieu })
    const { data: caus } = await supabase.from('tai_lieu_cau').select('ma_cau, thu_tu').eq('phan_id', p.id).order('thu_tu').limit(LIMIT)
    if (caus?.length) await supabase.from('tai_lieu_cau').insert(caus.map((c: any) => ({ phan_id: np.id, ma_cau: c.ma_cau, thu_tu: c.thu_tu })))
  }
  return nw as TaiLieu
}

// Copy 1 phan (+ câu) sang tài liệu khác. GIỮ `kieu` (kiểu cột) — xem ghi chú ở duplicateTaiLieu.
// Export (không chỉ dùng nội bộ trichXuatBuoi) — MT dùng lại y hệt cho "gán vào buổi" (mt.ts).
// `over` = ghi đè vài trường khi copy (hiện chỉ `tieu_de` — mốc buổi của doc lớp phải mang SỐ BUỔI CỦA
// LỚP, không phải số của giáo trình gốc; xem §"Bộ giáo trình riêng của lớp").
export async function copyPhanInto(targetId: string, p: TaiLieuPhan, thu_tu: number, over?: { tieu_de?: string }): Promise<void> {
  const np = await addPhan({ tai_lieu_id: targetId, thu_tu, loai_phan: p.loai_phan, ref_ma: p.ref_ma, tieu_de: over?.tieu_de ?? p.tieu_de, noi_dung: p.noi_dung, kieu: p.kieu })
  const { data: caus } = await supabase.from('tai_lieu_cau').select('ma_cau, thu_tu').eq('phan_id', p.id).order('thu_tu').limit(LIMIT)
  if (caus?.length) await supabase.from('tai_lieu_cau').insert((caus as any[]).map((c) => ({ phan_id: np.id, ma_cau: c.ma_cau, thu_tu: c.thu_tu })))
}
// ════════ BỘ GIÁO TRÌNH RIÊNG CỦA LỚP (Thùy 07-24) ══════════════════════════════════════════════
// 1 master (vd 10 buổi) gán cho nhiều lớp, mỗi lớp học một TẬP CON khác nhau (9A1: buổi 1,2,3,6,7,8,10
// · 9A2: buổi 1..7). Doc đã gán của một lớp = BỘ GIÁO TRÌNH CỦA RIÊNG LỚP ĐÓ: nội dung ánh xạ từ master
// (nguon_id/nguon_buoi) nhưng SỐ THỨ TỰ BUỔI LÀ SỐ CỦA LỚP — buổi thứ 7 của 9A1 là buổi 10 của master
// nhưng với 9A1 nó vẫn là "Buổi 7". Trước đây doc copy nguyên tiêu đề master → phiếu in ra "Buổi 10".
// Số của lớp = HẠNG CỦA NGÀY trong lịch đã gán của lớp (không phải "số lúc tạo": gán chèn vào giữa
// lịch thì các buổi sau phải dồn số) ⇒ mọi thao tác gán/gán lại/xoá đều gọi renumberBuoiLop.

const LOAI_DOC_LOP = ['giao_trinh_buoi', 'btvn'] // doc vận hành bám (lớp+ngày) = một buổi của lớp
// Thay SỐ trong tiêu đề buổi bằng số của lớp, GIỮ phần tên chuyên đề phía sau ("Buổi 10: Hằng đẳng
// thức" → "Buổi 7: Hằng đẳng thức"). Tiêu đề không theo mẫu "Buổi N" → gắn số vào trước.
export function tieuDeBuoiLop(tieuDeMaster: string | null | undefined, stt: number): string {
  const t = (tieuDeMaster ?? '').trim()
  if (/^buổi\s*\d+/i.test(t)) return t.replace(/^buổi\s*\d+/i, `Buổi ${stt}`)
  return t ? `Buổi ${stt} · ${t}` : `Buổi ${stt}`
}
const tenDocBuoi = (loai: string, tenLop: string, ngay: string, tieuDe: string) =>
  `${loai === 'btvn' ? 'BTVN' : 'GT'} ${tenLop} ${ngay.split('-').reverse().join('/')} · ${tieuDe}`

// Đánh lại số buổi CHO CẢ LỚP theo thứ tự ngày. Trả về doc nào đã ĐỔI NỘI DUNG HIỂN THỊ (tên/tiêu đề
// buổi in ra giấy) → caller enqueueLinkGen cho chúng (lib không import store, tránh vòng phụ thuộc).
export async function renumberBuoiLop(lopId: string): Promise<{ id: string; loai: string }[]> {
  const { data: lopRow } = await supabase.from('lop').select('ten_lop').eq('id', lopId).single()
  const tenLop = (lopRow as { ten_lop?: string } | null)?.ten_lop ?? ''
  const { data, error } = await supabase.from('tai_lieu').select('id, loai, ngay, ten, stt_lop')
    .eq('lop_id', lopId).in('loai', LOAI_DOC_LOP).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as { id: string; loai: string; ngay: string | null; ten: string; stt_lop: number | null }[]
  const docs = rows.filter((r) => r.ngay)
  if (!docs.length) return []
  // 'YYYY-MM-DD' so chuỗi = so thời gian (không dựng Date — CLAUDE.md §2 cấm new Date('YYYY-MM-DD')).
  const ngays = [...new Set(docs.map((r) => r.ngay as string))].sort()
  const sttOf = new Map(ngays.map((n, i) => [n, i + 1]))
  // Mốc 'buoi' của từng doc — 1 query cho cả lớp (đừng listPhan từng doc: N round-trip).
  const { data: mk } = await supabase.from('tai_lieu_phan').select('id, tai_lieu_id, tieu_de')
    .in('tai_lieu_id', docs.map((r) => r.id)).eq('loai_phan', 'buoi').limit(LIMIT)
  const markerOf = new Map(((mk ?? []) as { id: string; tai_lieu_id: string; tieu_de: string | null }[]).map((p) => [p.tai_lieu_id, p]))
  const changed: { id: string; loai: string }[] = []
  for (const r of docs) {
    const stt = sttOf.get(r.ngay as string) as number
    const marker = markerOf.get(r.id)
    const tieuDe = tieuDeBuoiLop(marker?.tieu_de, stt)
    const ten = tenDocBuoi(r.loai, tenLop, r.ngay as string, tieuDe)
    let doi = false
    if (marker && marker.tieu_de !== tieuDe) { await updatePhan(marker.id, { tieu_de: tieuDe }); doi = true }
    const patch: Record<string, unknown> = {}
    if (r.stt_lop !== stt) patch.stt_lop = stt
    if (r.ten !== ten) { patch.ten = ten; doi = true }
    if (Object.keys(patch).length) {
      const { error: e2 } = await supabase.from('tai_lieu').update(patch).eq('id', r.id)
      if (e2) throw e2
    }
    if (doi) changed.push({ id: r.id, loai: r.loai })
  }
  return changed
}

// 1 buổi trong BỘ GIÁO TRÌNH CỦA LỚP: số của lớp + ngày + doc GT/BTVN + buổi gốc bên master.
export type BuoiLop = { stt: number; ngay: string; tieu_de: string; nguon_id: string | null; nguon_buoi: string | null; gt: TaiLieu | null; btvn: TaiLieu | null }
export async function listGiaoTrinhLop(lopId: string): Promise<BuoiLop[]> {
  const { data, error } = await supabase.from('tai_lieu').select('*')
    .eq('lop_id', lopId).in('loai', LOAI_DOC_LOP).order('ngay').limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []).filter((r: { ngay: string | null }) => r.ngay) as (TaiLieu & { ngay: string; nguon_id: string | null; nguon_buoi: string | null })[]
  const byNgay = new Map<string, BuoiLop>()
  for (const r of rows) {
    const b = byNgay.get(r.ngay) ?? { stt: r.stt_lop ?? 0, ngay: r.ngay, tieu_de: '', nguon_id: r.nguon_id, nguon_buoi: r.nguon_buoi, gt: null, btvn: null }
    if (r.loai === 'btvn') b.btvn = r; else b.gt = r
    if (r.stt_lop) b.stt = r.stt_lop
    if (r.nguon_buoi) { b.nguon_id = r.nguon_id; b.nguon_buoi = r.nguon_buoi }
    byNgay.set(r.ngay, b)
  }
  const out = [...byNgay.values()].sort((a, b) => a.ngay.localeCompare(b.ngay))
  // Tiêu đề buổi = mốc 'buoi' THẬT trong doc (đúng cái in ra giấy), không parse ngược từ tên file.
  const { data: mk } = rows.length ? await supabase.from('tai_lieu_phan').select('tai_lieu_id, tieu_de')
    .in('tai_lieu_id', rows.map((r) => r.id)).eq('loai_phan', 'buoi').limit(LIMIT) : { data: [] }
  const tieuDeOf = new Map(((mk ?? []) as { tai_lieu_id: string; tieu_de: string | null }[]).map((p) => [p.tai_lieu_id, p.tieu_de]))
  out.forEach((b, i) => {
    if (!b.stt) b.stt = i + 1
    b.tieu_de = tieuDeBuoiLop(tieuDeOf.get(b.gt?.id ?? '') ?? tieuDeOf.get(b.btvn?.id ?? '') ?? null, b.stt)
  })
  return out
}

// TRÍCH XUẤT 1 buổi của giáo trình master → doc con BÁM (lớp+ngày): "Giáo trình buổi X" (lý thuyết+luyện) và/hoặc "BTVN buổi X".
// loai con: 'giao_trinh_buoi' (vận hành) · 'btvn' (vận hành). Master (giao_trinh) = phát triển. Cả 3 hiện ở Kho.
// Số buổi ghi vào doc + mốc buổi là SỐ CỦA LỚP (xem §"Bộ giáo trình riêng của lớp"), KHÔNG phải số của
// master — `opts.tenBuoi` (tên buổi bên master) chỉ còn dùng làm phần chữ phía sau số.
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
  // Số buổi của LỚP cho ngày này = hạng của ngày trong lịch đã gán (kể cả ngày này nếu chưa có).
  // Tính TRƯỚC khi insert để đặt tên/tiêu đề đúng ngay; renumberBuoiLop cuối hàm chốt lại cả lớp.
  const { data: dsNgay } = await supabase.from('tai_lieu').select('ngay')
    .eq('lop_id', opts.lopId).in('loai', LOAI_DOC_LOP).limit(LIMIT)
  const ngays = [...new Set([...((dsNgay ?? []) as { ngay: string | null }[]).map((r) => r.ngay).filter(Boolean) as string[], opts.ngay])].sort()
  const stt = ngays.indexOf(opts.ngay) + 1
  const tieuDeLop = tieuDeBuoiLop(marker.tieu_de ?? opts.tenBuoi, stt)
  const mk = async (loai: string): Promise<TaiLieu> => {
    // Re-trích = THAY THẾ doc cũ cùng (lớp+ngày+loại) — chống trùng (unique uq_tai_lieu_van_hanh).
    await supabase.from('tai_lieu').delete().eq('loai', loai).eq('lop_id', opts.lopId).eq('ngay', opts.ngay)
    const { data, error } = await supabase.from('tai_lieu').insert({
      loai, ten: tenDocBuoi(loai, opts.tenLop, opts.ngay, tieuDeLop), khoi: opts.khoi, mon: (master as any)?.mon ?? 'Toán', theme: (master as any)?.theme ?? 'bkdemy', cau_hinh: (master as any)?.cau_hinh ?? {},
      lop_id: opts.lopId, ngay: opts.ngay, nguon_id: masterId, nguon_buoi: buoiPhanId, stt_lop: stt, created_by: user?.id ?? null,
    }).select().single()
    if (error) throw error
    return data as TaiLieu
  }
  const out: TaiLieu[] = []
  if (opts.giaoTrinh) {
    const nw = await mk('giao_trinh_buoi')
    let t = 0; await copyPhanInto(nw.id, marker, t++, { tieu_de: tieuDeLop }); for (const p of dangPhans) await copyPhanInto(nw.id, p, t++)
    out.push(nw)
  }
  if (opts.btvn && btvnPhans.length) {
    const nw = await mk('btvn')
    let t = 0; await copyPhanInto(nw.id, marker, t++, { tieu_de: tieuDeLop }); for (const p of btvnPhans) await copyPhanInto(nw.id, p, t++)
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
  return full.phans.filter((p) => p.loai_phan === 'btvn' || p.loai_phan === 'ontap').flatMap((p) => p.caus)
}
// Giáo trình buổi (lớp+ngày) — doc loai='giao_trinh_buoi' (từ trích xuất). Dùng để khớp buổi ↔ test online.
export async function getGiaoTrinhBuoiDoc(lopId: string, ngay: string): Promise<{ id: string } | null> {
  const { data, error } = await supabase.from('tai_lieu').select('id').eq('loai', 'giao_trinh_buoi').eq('lop_id', lopId).eq('ngay', ngay).order('created_at', { ascending: false }).limit(1)
  if (error) throw error
  return ((data as { id: string }[])?.[0]) ?? null
}
// Câu BÀI LUYỆN của giáo trình buổi (loai_phan='dang') — online chỉ giao BT, KHÔNG lý thuyết.
export async function getGiaoTrinhBuoiCaus(taiLieuId: string): Promise<CauHoi[]> {
  const full = await getTaiLieuFull(taiLieuId)
  return full.phans.filter((p) => p.loai_phan === 'dang').flatMap((p) => p.caus)
}
// Đặt LẠI toàn bộ câu ET theo thứ tự (UI tự dedup trong đề — trong buổi không trùng).
// Bump `updated_at`: sửa CÂU chỉ đụng tai_lieu_cau nên trước đây KHÔNG để lại dấu thời gian nào —
// `updated_at` chỉ đổi khi updateET (tên/lớp/ngày/cấu hình). Chẩn đoán bug ET 07-21 vì thế suýt đọc
// nhầm "đề này chưa ai sửa" trong khi câu đã bị thay. Đổi nội dung đề = phải có vết (§4).
export async function setETCaus(taiLieuId: string, maCaus: string[]): Promise<void> {
  await setCauOfPhan(await etPhanId(taiLieuId), maCaus)
  const { error } = await supabase.from('tai_lieu').update({ updated_at: new Date().toISOString() }).eq('id', taiLieuId)
  if (error) throw error
}
