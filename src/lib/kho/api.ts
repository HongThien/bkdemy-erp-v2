// Data-layer Kho — UI KHÔNG đụng supabase trực tiếp, chỉ gọi các hàm ở đây.
// Tính/seam đặt ở đây để sau đổi nguồn (view Postgres, mock…) không phải sửa component.
import { supabase } from '../supabase'

const LIMIT = 10000 // spec-kho-v2 §1.3 — mọi list .limit(10000)

// Khối = KEY text. '4'/'5' = hệ thường; '4T'/'5T' = Tăng cường (CLC, chỉ tiểu học 4-5 —
// bản đồ khác cấu trúc nên là cây riêng). Thứ tự hiển thị theo ĐÚNG mảng này (KHÔNG lexsort).
// Mã prefix 2 ký tự: thường '4'→'04…', CLC '4T…' — phân biệt, không đụng.
export const KHOI_OPTIONS = ['4', '4T', '5', '5T', '6', '7', '8', '9', '10', '11', '12'] as const
export const DEFAULT_KHOI = '8'

export type LopBac = { ma: string; ten: string; thu_tu: number }

export type DaiDang = {
  ma_dang: string
  khoi: string
  ma_chu_de: string
  ten_chu_de: string
  ma_chuyen_de: string
  ten_chuyen_de: string
  ten_dang: string
  muc_do: number
  bac_toi_thieu: string
  created_at?: string
}
export type DaiDangInput = Omit<DaiDang, 'ma_dang' | 'created_at'>
export type DaiDangRow = Omit<DaiDang, 'created_at'> // gồm ma_dang (nay sinh tay theo mã vị trí)

// ── Danh mục bậc lớp (S>A>B>C) ───────────────────────────────────
export async function listLopBac(): Promise<LopBac[]> {
  const { data, error } = await supabase
    .from('lop_bac').select('*').order('thu_tu', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ── Đọc dạng Đại theo khối ───────────────────────────────────────
export async function listDaiDang(khoi: string): Promise<DaiDang[]> {
  const { data, error } = await supabase
    .from('dai_ban_do').select('*')
    .eq('khoi', khoi)
    .order('ma_chu_de').order('ma_chuyen_de').order('ma_dang')
    .limit(LIMIT)
  if (error) throw error
  return (data ?? []) as DaiDang[]
}

// ── CÂU HỎI của một dạng (dai_cau_hoi) ───────────────────────────
export type LoaiCau = 'tra_loi_ngan' | 'trac_nghiem' | 'dung_sai' | 'tu_luan'
export const LOAI_CAU: { value: LoaiCau; label: string }[] = [
  { value: 'tra_loi_ngan', label: 'Trả lời ngắn' },
  { value: 'tu_luan', label: 'Tự luận' },
  { value: 'trac_nghiem', label: 'Trắc nghiệm' },
  { value: 'dung_sai', label: 'Đúng/Sai' },
]
export type CauHoi = {
  ma_cau: string
  dang_chinh: string
  loai_cau: string
  noi_dung: string
  dap_an: string | null
  loi_giai: string | null
  lua_chon: string[] | null     // trắc nghiệm: 4 phương án; dap_an = chữ cái đúng
  anh_de: string | null
  anh_dap_an: string | null
  nguon: string                 // 'le' | 'clone'
  parent_ma_cau: string | null
  clone_method: string | null
  created_at?: string
}

export async function listCauByDang(maDang: string): Promise<CauHoi[]> {
  const { data, error } = await supabase.from('dai_cau_hoi').select('*')
    .eq('dang_chinh', maDang).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
type CauInput = {
  dang_chinh: string; loai_cau: string; noi_dung: string
  dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null
  anh_de?: string | null; anh_dap_an?: string | null
  nguon?: string; parent_ma_cau?: string | null; clone_method?: string | null
}
export async function createCau(input: CauInput): Promise<CauHoi> {
  const { data, error } = await supabase.from('dai_cau_hoi').insert(input).select().single()
  if (error) throw error
  return data as CauHoi
}
export async function updateCau(ma_cau: string, patch: Partial<CauInput>): Promise<void> {
  const { error } = await supabase.from('dai_cau_hoi').update(patch).eq('ma_cau', ma_cau)
  if (error) throw error
}
export async function deleteCau(ma_cau: string): Promise<void> {
  const { error } = await supabase.from('dai_cau_hoi').delete().eq('ma_cau', ma_cau)
  if (error) throw error
}

// ── CLONE: prompt + parse JSON + lưu batch (gốc 'le' + biến thể 'clone') ──
type CauNoiDung = { noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null; anh_de?: string | null; anh_dap_an?: string | null }
const loaiVi = (v: string): string => ({ tra_loi_ngan: 'Trả lời ngắn', tu_luan: 'Tự luận', trac_nghiem: 'Trắc nghiệm 4 phương án', dung_sai: 'Đúng/Sai' } as Record<string, string>)[v] ?? v
// Trường JSON + quy tắc đáp án theo LOẠI câu
function loaiFields(loaiCau: string): { spec: string; obj: string; ruleDapAn: string } {
  if (loaiCau === 'trac_nghiem') return {
    spec: 'de_bai, lua_chon (mảng 4 phương án A→D, CHỈ nội dung — không kèm "A."/"B."), dap_an (CHỮ CÁI đúng), loi_giai',
    obj: '{ "de_bai": "...", "lua_chon": ["...","...","...","..."], "dap_an": "B", "loi_giai": "..." }',
    ruleDapAn: '- "dap_an" = CHỮ CÁI phương án đúng ("A"|"B"|"C"|"D"); đáp án có thể nằm ở "Chọn X" / "Đáp án: X" trong lời giải → lấy đúng chữ cái đó. ĐÚNG 4 phương án, chỉ 1 đúng.',
  }
  return {
    spec: 'de_bai, dap_an (CHỈ kết quả số/phân số), loi_giai',
    obj: '{ "de_bai": "...", "dap_an": "...", "loi_giai": "..." }',
    ruleDapAn: '- "dap_an" CHỈ là kết quả cuối (số/phân số), KHÔNG đơn vị, KHÔNG chữ giải thích. Đơn vị (quả, cm²...) ghi TRONG "loi_giai". Phân số dùng $\\\\dfrac{a}{b}$.',
  }
}
// Quy tắc trình bày + JSON (bê từ prompt v1 đã thực chiến)
const FMT_RULES = [
  'QUY TẮC TRÌNH BÀY:',
  '- Công thức toán DÙNG LaTeX trong $...$ (inline) hoặc $$...$$ (block).',
  '- Phân số DÙNG \\\\dfrac{a}{b} (KHÔNG dùng \\\\frac vì hiển thị bé). KHÔNG viết dạng a/b.',
  '- Số đơn lẻ KHÔNG cần $: viết "30 quả" không phải "$30$ quả". KHÔNG để tiếng Việt có dấu bên trong $...$.',
  '- Số thập phân dùng dấu chấm: "0.6" (không "0,6").',
  '- Nếu đề có BẢNG BIẾN THIÊN / ĐỒ THỊ / HÌNH VẼ: ghi "[hình]" đúng vị trí trong de_bai + mô tả 1 câu ngắn; KHÔNG cố vẽ lại bằng LaTeX (nhân sự sẽ cắt ảnh đính sau).',
  '',
  '⚠ QUY TẮC JSON (CỰC KỲ QUAN TRỌNG):',
  "- Trích dẫn trong chuỗi DÙNG nháy đơn ' ... ', KHÔNG nháy kép (sẽ hỏng JSON).",
  '- Mọi lệnh LaTeX PHẢI DOUBLE backslash trong JSON: "\\\\dfrac", "\\\\times", "\\\\neq".',
  '- CHỈ trả JSON, KHÔNG bọc ```json```, KHÔNG thêm chữ nào ngoài JSON.',
].join('\n')
const normCau = (x: any): CauNoiDung => ({
  noi_dung: String(x.de_bai ?? x.noi_dung ?? '').trim(),
  dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
  loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? String(x.loi_giai).trim() : null,
  lua_chon: Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map((o: any) => String(o)) : null,
})
export function buildClonePrompt(a: { soBienThe: number; ghiChu: string; tenDang: string; loaiCau: string }): string {
  const f = loaiFields(a.loaiCau)
  return [
    'Bạn là chuyên gia ra đề toán tiểu học/THCS. Bên dưới là 1 BÀI MẪU (có thể kèm ảnh sơ đồ).',
    `Dạng bài: "${a.tenDang}". Loại câu: ${loaiVi(a.loaiCau)}.`,
    '',
    'Làm 2 việc:',
    `1) Trích bài mẫu thành các trường: ${f.spec}.`,
    `2) Sinh ${a.soBienThe} biến thể GIỮ NGUYÊN cấu trúc & phương pháp; đổi số liệu (kết quả hợp lý, "đẹp") / tên người / hoàn cảnh. Lời giải copy đúng format bài mẫu, thay số tương ứng. Mỗi biến thể ĐỦ trường như bài gốc.`,
    a.ghiChu ? `Ghi chú thêm: ${a.ghiChu}` : '',
    '',
    f.ruleDapAn,
    FMT_RULES,
    '',
    'Trả về JSON đúng format:',
    `{ "bai_goc": ${f.obj},`,
    `  "variants": [ ${f.obj} ] }`,
  ].filter(Boolean).join('\n')
}
export function parseCloneJson(text: string): { goc: CauNoiDung; variants: CauNoiDung[] } {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  let obj: any
  try { obj = JSON.parse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const bg = obj.bai_goc ?? obj.baiGoc
  if (!bg || !bg.de_bai) throw new Error('Thiếu "bai_goc.de_bai" trong JSON.')
  const variants = (Array.isArray(obj.variants) ? obj.variants : []).filter((v: any) => v?.de_bai).map(normCau)
  return { goc: normCau(bg), variants }
}
export async function saveCloneBatch(a: {
  dangChinh: string; loaiCau: string; goc: CauNoiDung; variants: CauNoiDung[]
}): Promise<{ goc: string; soClone: number }> {
  const g = await createCau({
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: a.goc.noi_dung, dap_an: a.goc.dap_an, loi_giai: a.goc.loi_giai, lua_chon: a.goc.lua_chon ?? null,
    anh_de: a.goc.anh_de ?? null, anh_dap_an: a.goc.anh_dap_an ?? null, nguon: 'le',
  })
  if (a.variants.length) {
    const rows = a.variants.map((v) => ({
      dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
      noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
      anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null,
      nguon: 'clone', parent_ma_cau: g.ma_cau, clone_method: 'manual_gemini',
    }))
    const { error } = await supabase.from('dai_cau_hoi').insert(rows)
    if (error) throw error
  }
  return { goc: g.ma_cau, soClone: a.variants.length }
}

// ── NHẬP CHUỖI CÂU CÓ SẴN (batch): prompt tách + parse + lưu (tất cả 'le') ──
export function buildBatchPrompt(a: { ghiChu: string; tenDang: string; loaiCau: string }): string {
  const f = loaiFields(a.loaiCau)
  return [
    'Bạn là trợ lý số hoá đề toán. Bên dưới tôi paste MỘT DANH SÁCH câu hỏi cùng một dạng.',
    `Dạng: "${a.tenDang}".`,
    'Hãy TÁCH thành từng câu và chuẩn hoá — KHÔNG sinh thêm câu mới, KHÔNG bỏ sót, KHÔNG đổi nội dung toán.',
    'MỖI BÀI = 1 CÂU độc lập (KHÔNG tách thành ý a/b/c).',
    'Tài liệu có thể ở NHIỀU DẠNG — tự nhận diện & bóc đúng dù dạng nào:',
    '  (a) Có nhãn: "Đề bài:" / "Đáp án:" / "Lời giải [chi tiết]:".',
    '  (b) Dạng đề thi: "Câu N." + đề + phương án A/B/C/D + "Lời giải" + "Chọn X" + giải thích.',
    `Mỗi câu gồm các trường: ${f.spec}.`,
    a.ghiChu ? `Ghi chú: ${a.ghiChu}` : '',
    '',
    f.ruleDapAn,
    FMT_RULES,
    '',
    `Trả về JSON: { "cau_hoi": [ ${f.obj} ] }`,
  ].filter(Boolean).join('\n')
}
export function parseBatchJson(text: string): CauNoiDung[] {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any
  try { obj = JSON.parse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau_hoi ?? obj.cauHoi ?? obj.variants)
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau_hoi": [ … ] } hoặc một mảng câu.')
  return arr.filter((x: any) => x?.de_bai || x?.noi_dung).map(normCau)
}
// Tách câu từ VĂN BẢN CÓ CẤU TRÚC (không cần AI). Mốc câu: "Câu N."/"Bài N.";
// nhãn trường: "Đề bài:", "Đáp án:", "Lời giải [chi tiết]:" / "Hướng dẫn:".
function parseBlock(block: string): CauNoiDung {
  const buf = { de: [] as string[], da: [] as string[], lg: [] as string[] }
  const opts: string[] = []
  let cur: 'de' | 'da' | 'lg' = 'de'
  for (let ln of block.split('\n')) {
    ln = ln.replace(/^\s*(?:câu|bài)\s*\d+\s*[.:)\-]?\s*/i, '') // bỏ mốc "Câu N." nếu dính đầu dòng
    let m: RegExpMatchArray | null
    if (/^\s*(?:lựa\s*chọn|phương\s*án)\s*[:.]/i.test(ln)) continue                  // nhãn "Lựa chọn:"
    if ((m = ln.match(/^\s*[A-D][.):]\s*(.+)$/))) { opts.push(m[1].trim()); continue } // phương án A/B/C/D
    if ((m = ln.match(/^\s*đề\s*bài\s*[:.]?\s*(.*)$/i))) { cur = 'de'; buf.de.push(m[1]) }
    else if ((m = ln.match(/^\s*đáp\s*án\s*[:.]?\s*(.*)$/i))) { cur = 'da'; buf.da.push(m[1]) }
    else if ((m = ln.match(/^\s*(?:lời\s*giải(?:\s*chi\s*tiết)?|hướng\s*dẫn)\s*[:.]?\s*(.*)$/i))) { cur = 'lg'; buf.lg.push(m[1]) }
    else buf[cur].push(ln)
  }
  const join = (arr: string[]) => arr.join('\n').trim()
  return { noi_dung: join(buf.de), dap_an: join(buf.da) || null, loi_giai: join(buf.lg) || null, lua_chon: opts.length ? opts : null }
}
export function parseStructuredText(text: string): CauNoiDung[] {
  const boundary = /^\s*(?:câu|bài)\s*\d+\b/i
  const blocks: string[][] = []
  let cur: string[] | null = null
  for (const ln of text.replace(/\r\n/g, '\n').split('\n')) {
    if (boundary.test(ln)) { cur = [ln]; blocks.push(cur) }
    else if (cur) cur.push(ln)
    else if (ln.trim()) { cur = [ln]; blocks.push(cur) }
  }
  return blocks.map((b) => parseBlock(b.join('\n'))).filter((c) => c.noi_dung.trim())
}

export async function saveCauBatch(a: { dangChinh: string; loaiCau: string; items: CauNoiDung[] }): Promise<number> {
  if (!a.items.length) return 0
  const rows = a.items.map((v) => ({
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
    anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null, nguon: 'le',
  }))
  const { error } = await supabase.from('dai_cau_hoi').insert(rows)
  if (error) throw error
  return rows.length
}

// ── AUTO: gọi Gemini API thẳng từ client (key VITE_GEMINI_KEY — rủi ro lộ, chấp nhận) ──
export type GeminiFile = { mimeType: string; dataBase64: string }  // ảnh/PDF base64 (bỏ tiền tố data:)
export async function callGeminiJson(prompt: string, opts?: { model?: string; files?: GeminiFile[] }): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined
  if (!key) throw new Error('Chưa có VITE_GEMINI_KEY trong .env.local → luồng AUTO chưa bật. Dùng MANUAL hoặc thêm key.')
  const model = opts?.model || (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-2.5-flash'
  const parts: any[] = [{ text: prompt }]
  for (const f of opts?.files ?? []) parts.push({ inline_data: { mime_type: f.mimeType, data: f.dataBase64 } })
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: 'application/json' } }),
  })
  if (!res.ok) throw new Error(`Gemini API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const txt: string = (data?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text ?? '').join('')
  if (!txt.trim()) throw new Error('Gemini trả rỗng.')
  return txt
}

// #câu treo theo dạng (tạm group ở client; TODO: chuyển sang view Postgres khi có data lớn)
export async function countCauByDang(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('dai_cau_hoi').select('dang_chinh').limit(LIMIT)
  if (error) throw error
  const m: Record<string, number> = {}
  for (const r of data ?? []) m[r.dang_chinh] = (m[r.dang_chinh] ?? 0) + 1
  return m
}

// ── CRUD dạng ────────────────────────────────────────────────────
export async function createDaiDang(row: DaiDangRow): Promise<DaiDang> {
  const { data, error } = await supabase.from('dai_ban_do').insert(row).select().single()
  if (error) throw error
  return data as DaiDang
}
export async function updateDaiDang(ma_dang: string, patch: Partial<DaiDangInput>): Promise<void> {
  const { error } = await supabase.from('dai_ban_do').update(patch).eq('ma_dang', ma_dang)
  if (error) throw error
}
export async function deleteDaiDang(ma_dang: string): Promise<void> {
  // ON DELETE RESTRICT phía DB sẽ chặn nếu còn câu treo → ném lỗi cho UI bắt.
  const { error } = await supabase.from('dai_ban_do').delete().eq('ma_dang', ma_dang)
  if (error) throw error
}

// ── Group phẳng → cây Chủ đề → Chuyên đề → Dạng ──────────────────
export type ChuyenDeNode = {
  ma_chuyen_de: string
  ten_chuyen_de: string
  dangs: DaiDang[]
}
export type ChuDeNode = {
  ma_chu_de: string
  ten_chu_de: string
  chuyenDes: ChuyenDeNode[]
  soDang: number
}
export function groupDai(rows: DaiDang[]): ChuDeNode[] {
  const cd = new Map<string, ChuDeNode>()
  for (const r of rows) {
    let c = cd.get(r.ma_chu_de)
    if (!c) {
      c = { ma_chu_de: r.ma_chu_de, ten_chu_de: r.ten_chu_de, chuyenDes: [], soDang: 0 }
      cd.set(r.ma_chu_de, c)
    }
    let cde = c.chuyenDes.find((x) => x.ma_chuyen_de === r.ma_chuyen_de)
    if (!cde) {
      cde = { ma_chuyen_de: r.ma_chuyen_de, ten_chuyen_de: r.ten_chuyen_de, dangs: [] }
      c.chuyenDes.push(cde)
    }
    cde.dangs.push(r)
    c.soDang++
  }
  return [...cd.values()]
}

// ── Sinh MÃ VỊ TRÍ (auto-suggest; người sửa được) ────────────────
// Mã chủ đề  = khối(2) + thứ tự(2)              vd K7 → 0701
// Mã chuyên đề = mã chủ đề + thứ tự(2)          vd 070101
// Mã dạng    = mã chuyên đề + thứ tự(2)         vd 07010103  (thứ tự TRONG chuyên đề)
// Append-only: thứ tự mới = max anh em + 1 (xoá để lại lỗ, không đánh lại số).
const pad2 = (n: number) => String(n).padStart(2, '0')
export const khoiCode = (khoi: string) => khoi.padStart(2, '0')
const maxOrd = (codes: string[], from: number): number => {
  const ords = codes.map((c) => parseInt(c.slice(from), 10)).filter((n) => Number.isFinite(n))
  return ords.length ? Math.max(...ords) : 0
}
export function suggestChuDeMa(khoi: string, tree: ChuDeNode[]): string {
  return khoiCode(khoi) + pad2(maxOrd(tree.map((c) => c.ma_chu_de), 2) + 1)
}
export function suggestChuyenDeMa(cdCode: string, chude: ChuDeNode | null): string {
  return cdCode + pad2(maxOrd((chude?.chuyenDes ?? []).map((x) => x.ma_chuyen_de), 4) + 1)
}
export function suggestDangMa(cdeCode: string, chuyende: ChuyenDeNode | null): string {
  return cdeCode + pad2(maxOrd((chuyende?.dangs ?? []).map((d) => d.ma_dang), 6) + 1)
}

// ════════════════════════════════════════════════════════════════
// SHAPE CHUNG cho mọi nhánh bản đồ (Đại + Hình đều 3 tầng phẳng).
// Component duyệt chỉ biết MapRow; api map qua lại cột DB thật của từng nhánh.
// ════════════════════════════════════════════════════════════════
export type MapRow = {
  leafMa: string                 // PK lá (ma_dang / ma_dang_hinh) — FK-target, phải ổn định
  khoi: string
  t1Ma: string; t1Ten: string    // tầng 1 (Chủ đề / Mảng)
  t2Ma: string; t2Ten: string    // tầng 2 (Chuyên đề / Loại câu hỏi)
  leafTen: string                // tên lá (Dạng / Dạng-hình)
  bac: string                    // bac_toi_thieu
  mucDo: number | null           // Đại có; Hình null (độ khó ở Bài, không ở node)
}
export type Tier2Node = { t2Ma: string; t2Ten: string; leaves: MapRow[] }
export type Tier1Node = { t1Ma: string; t1Ten: string; tier2s: Tier2Node[]; soLeaf: number }

export function groupMap(rows: MapRow[]): Tier1Node[] {
  const m = new Map<string, Tier1Node>()
  for (const r of rows) {
    let t1 = m.get(r.t1Ma)
    if (!t1) { t1 = { t1Ma: r.t1Ma, t1Ten: r.t1Ten, tier2s: [], soLeaf: 0 }; m.set(r.t1Ma, t1) }
    let t2 = t1.tier2s.find((x) => x.t2Ma === r.t2Ma)
    if (!t2) { t2 = { t2Ma: r.t2Ma, t2Ten: r.t2Ten, leaves: [] }; t1.tier2s.push(t2) }
    t2.leaves.push(r); t1.soLeaf++
  }
  return [...m.values()]
}
export function suggestT1Ma(khoi: string, tree: Tier1Node[]): string {
  return khoiCode(khoi) + pad2(maxOrd(tree.map((t) => t.t1Ma), 2) + 1)
}
export function suggestT2Ma(t1Code: string, t1: Tier1Node | null): string {
  return t1Code + pad2(maxOrd((t1?.tier2s ?? []).map((x) => x.t2Ma), 4) + 1)
}
export function suggestLeafMa(t2Code: string, t2: Tier2Node | null): string {
  return t2Code + pad2(maxOrd((t2?.leaves ?? []).map((d) => d.leafMa), 6) + 1)
}

// ── ĐẠI: map qua MapRow ──────────────────────────────────────────
export async function listDaiMap(khoi: string): Promise<MapRow[]> {
  const rows = await listDaiDang(khoi)
  return rows.map((r) => ({
    leafMa: r.ma_dang, khoi: r.khoi,
    t1Ma: r.ma_chu_de, t1Ten: r.ten_chu_de,
    t2Ma: r.ma_chuyen_de, t2Ten: r.ten_chuyen_de,
    leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: r.muc_do,
  }))
}
export async function createDaiMap(row: MapRow): Promise<void> {
  await createDaiDang({
    ma_dang: row.leafMa, khoi: row.khoi,
    ma_chu_de: row.t1Ma, ten_chu_de: row.t1Ten,
    ma_chuyen_de: row.t2Ma, ten_chuyen_de: row.t2Ten,
    ten_dang: row.leafTen, muc_do: row.mucDo ?? 3, bac_toi_thieu: row.bac,
  })
}
export async function updateDaiLeaf(leafMa: string, patch: { leafTen: string; bac: string; mucDo: number | null }): Promise<void> {
  await updateDaiDang(leafMa, { ten_dang: patch.leafTen, bac_toi_thieu: patch.bac, muc_do: patch.mucDo ?? undefined })
}
export const deleteDaiLeaf = (leafMa: string) => deleteDaiDang(leafMa)
export async function deleteDaiLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('dai_ban_do').delete().in('ma_dang', leafMas)
  if (error) throw error
}

// ── Lý thuyết đi kèm dạng Đại (1-1) + chuẩn completeness ──────────
export const CHUAN_SO_CAU = 50 // chuẩn kho: mỗi dạng ≥ 50 câu (sàn SỐ LƯỢNG, chỉnh 1 chỗ)
export type LyThuyet = { file_url: string; ten_file: string | null; cap_nhat_at?: string }

export async function listDaiLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('dai_dang_ly_thuyet').select('*').limit(LIMIT)
  if (error) throw error
  const m: Record<string, LyThuyet> = {}
  for (const r of data ?? []) m[r.ma_dang] = { file_url: r.file_url, ten_file: r.ten_file, cap_nhat_at: r.cap_nhat_at }
  return m
}
export async function upsertDaiLyThuyet(ma_dang: string, file_url: string, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('dai_dang_ly_thuyet')
    .upsert({ ma_dang, file_url, ten_file }, { onConflict: 'ma_dang' })
  if (error) throw error
}
export async function deleteDaiLyThuyet(ma_dang: string): Promise<void> {
  const { error } = await supabase.from('dai_dang_ly_thuyet').delete().eq('ma_dang', ma_dang)
  if (error) throw error
}

// ── HÌNH: bản đồ dạng-hình (hinh_ban_do) ─────────────────────────
export async function listHinhMap(khoi: string): Promise<MapRow[]> {
  const { data, error } = await supabase
    .from('hinh_ban_do').select('*')
    .eq('khoi', khoi)
    .order('ma_mang').order('ma_loai_ch').order('ma_dang_hinh')
    .limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    leafMa: r.ma_dang_hinh, khoi: r.khoi,
    t1Ma: r.ma_mang, t1Ten: r.ten_mang,
    t2Ma: r.ma_loai_ch, t2Ten: r.ten_loai_ch,
    leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: null,
  }))
}
export async function createHinhMap(row: MapRow): Promise<void> {
  const { error } = await supabase.from('hinh_ban_do').insert({
    ma_dang_hinh: row.leafMa, khoi: row.khoi,
    ma_mang: row.t1Ma, ten_mang: row.t1Ten,
    ma_loai_ch: row.t2Ma, ten_loai_ch: row.t2Ten,
    ten_dang: row.leafTen, bac_toi_thieu: row.bac,
  })
  if (error) throw error
}
export async function updateHinhLeaf(leafMa: string, patch: { leafTen: string; bac: string }): Promise<void> {
  const { error } = await supabase.from('hinh_ban_do')
    .update({ ten_dang: patch.leafTen, bac_toi_thieu: patch.bac }).eq('ma_dang_hinh', leafMa)
  if (error) throw error
}
export async function deleteHinhLeaf(leafMa: string): Promise<void> {
  const { error } = await supabase.from('hinh_ban_do').delete().eq('ma_dang_hinh', leafMa)
  if (error) throw error
}
export async function deleteHinhLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('hinh_ban_do').delete().in('ma_dang_hinh', leafMas)
  if (error) throw error
}
// #ý treo theo dạng-hình (qua hinh_y.dang_hinh)
export async function countYByDangHinh(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('hinh_y').select('dang_hinh').limit(LIMIT)
  if (error) throw error
  const m: Record<string, number> = {}
  for (const r of data ?? []) m[r.dang_hinh] = (m[r.dang_hinh] ?? 0) + 1
  return m
}
