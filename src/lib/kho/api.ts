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
  nguon_giai: string            // 'nguoi' (tin) | 'ai' (AI giải/clone — cần duyệt)
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
  ma_cau?: string
  dang_chinh: string; loai_cau: string; noi_dung: string
  dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null
  anh_de?: string | null; anh_dap_an?: string | null
  nguon?: string; nguon_giai?: string; parent_ma_cau?: string | null; clone_method?: string | null
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

// ── Ảnh: upload lên Supabase Storage (bucket public 'kho-anh'), DB chỉ lưu URL ngắn (không base64) ──
export const KHO_BUCKET = 'kho-anh'
export async function uploadKhoImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(KHO_BUCKET).upload(path, file, { contentType: file.type || 'image/png', upsert: false })
  if (error) throw error
  return supabase.storage.from(KHO_BUCKET).getPublicUrl(path).data.publicUrl
}

// File lý thuyết / tài liệu (PDF, Word…) — bucket public 'kho-tailieu'. Trả URL + tên gốc.
export const KHO_FILE_BUCKET = 'kho-tailieu'
export async function uploadKhoFile(file: File): Promise<{ url: string; name: string }> {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(KHO_FILE_BUCKET).upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false })
  if (error) throw error
  return { url: supabase.storage.from(KHO_FILE_BUCKET).getPublicUrl(path).data.publicUrl, name: file.name }
}
// Mã câu = mã DẠNG + STT 3 chữ số (vd 07010103 → 07010103001). Lấy max STT hiện có +1 (không tái dùng số đã xoá).
const maCau = (dangChinh: string, seq: number) => `${dangChinh}${String(seq).padStart(3, '0')}`
async function nextCauSeq(dangChinh: string): Promise<number> {
  const { data, error } = await supabase.from('dai_cau_hoi').select('ma_cau').eq('dang_chinh', dangChinh).limit(LIMIT)
  if (error) throw error
  let max = 0
  for (const r of data ?? []) {
    const n = parseInt(String((r as { ma_cau: string }).ma_cau).slice(dangChinh.length), 10)
    if (Number.isFinite(n) && n > max) max = n
  }
  return max + 1
}

// ── CLONE: prompt + parse JSON + lưu batch (gốc 'le' + biến thể 'clone') ──
type CauNoiDung = { noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null; anh_de?: string | null; anh_dap_an?: string | null; nguon_giai?: string }
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
  '- ⚠ MỖI công thức/phân số/biểu thức phải bọc RIÊNG trong $...$ — KỂ CẢ khi liệt kê nhiều: viết "$\\\\dfrac{6}{5}$; $\\\\dfrac{4}{3}$" (TUYỆT ĐỐI KHÔNG để "\\\\dfrac{6}{5}" trần ngoài $).',
  '- ⚠ Xuống dòng DÙNG ký tự xuống dòng thật trong chuỗi — TUYỆT ĐỐI KHÔNG dùng thẻ "<br>".',
  '- Phân số DÙNG \\\\dfrac{a}{b} (KHÔNG dùng \\\\frac vì hiển thị bé). KHÔNG viết dạng a/b.',
  '- ⚠ KÝ HIỆU CHIA HẾT (Gemini RẤT HAY ĐỌC SAI — đọc kỹ ngữ cảnh): "a chia hết cho b" = ba dấu chấm DỌC ⋮ → viết "$a \\\\vdots b$". "a KHÔNG chia hết cho b" = ⋮ có GẠCH CHÉO → viết "$a \\\\not\\\\vdots b$". TUYỆT ĐỐI KHÔNG nhầm ⋮ thành dấu hai chấm ":", ba chấm ngang "...", \\\\div, hay "%". Gặp chữ "chia hết / không chia hết" trong đề/lời giải PHẢI dùng \\\\vdots / \\\\not\\\\vdots.',
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
    `1) Trích bài mẫu thành các trường: ${f.spec}. GIỮ NGUYÊN văn đề mẫu, không sửa chữ.`,
    `2) Sinh ĐÚNG ${a.soBienThe} biến thể (KHÔNG nhiều hơn, KHÔNG ít hơn — mảng "variants" có ĐÚNG ${a.soBienThe} phần tử).`,
    '',
    '⚠ RÀNG BUỘC BÁM BÀI GỐC (tuân thủ TUYỆT ĐỐI — đây là yêu cầu quan trọng nhất):',
    '- BÁM SÁT bài mẫu: GIỮ NGUYÊN cấu trúc câu, phương pháp giải, SỐ BƯỚC và THỨ TỰ bước của lời giải. CHỈ thay con số / tên người / bối cảnh.',
    '- CẤM: thêm bước, bớt bước, đổi cách giải, thêm dữ kiện/điều kiện/giả thiết KHÔNG có trong bài gốc, hay "diễn giải" dài hơn gốc. Lời giải biến thể phải SONG ÁNH từng bước với gốc, chỉ khác con số.',
    '- SỐ LIỆU thay phải cho KẾT QUẢ ĐẸP (số nguyên hoặc phân số tối giản đơn giản giống bài gốc), CÙNG độ khó & CÙNG độ lớn. TUYỆT ĐỐI KHÔNG để ra số lẻ/xấu (vd 7.3333, 0.17): nếu một bộ số ra kết quả xấu thì THỬ BỘ SỐ KHÁC cho tới khi đẹp, đừng giữ.',
    '- Nếu bài gốc không nói rõ một bước, biến thể CŨNG không tự bịa bước đó.',
    a.ghiChu ? `- ⚠ GHI CHÚ CỦA NGƯỜI RA ĐỀ = RÀNG BUỘC CỨNG, ưu tiên CAO NHẤT, áp cho MỌI biến thể (bám rất sát, không được phớt lờ): ${a.ghiChu}` : '',
    '',
    f.ruleDapAn,
    FMT_RULES,
    '',
    'Trả về JSON đúng format:',
    `{ "bai_goc": ${f.obj},`,
    `  "variants": [ ${f.obj} ] }`,
  ].filter(Boolean).join('\n')
}
// Gemini HAY trả LaTeX 1 backslash trong chuỗi JSON ("\dfrac") → JSON.parse ném "Bad escaped character".
// Sửa: thử parse thẳng (nhanh), lỗi thì NHÂN ĐÔI mọi backslash KHÔNG thuộc escape hợp lệ
// (giữ nguyên \" \\ \/ \b \f \n \r \t \uXXXX) rồi parse lại → "\dfrac" thành "\\dfrac" hợp lệ, parse ra "\dfrac".
function lenientJsonParse(t: string): any {
  try { return JSON.parse(t) }
  catch { return JSON.parse(t.replace(/\\(["\\/bfnrtu])|\\/g, (m, g) => (g ? m : '\\\\'))) }
}
export function parseCloneJson(text: string): { goc: CauNoiDung; variants: CauNoiDung[] } {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const bg = obj.bai_goc ?? obj.baiGoc
  if (!bg || !bg.de_bai) throw new Error('Thiếu "bai_goc.de_bai" trong JSON.')
  const variants = (Array.isArray(obj.variants) ? obj.variants : []).filter((v: any) => v?.de_bai).map(normCau)
  return { goc: normCau(bg), variants }
}
export async function saveCloneBatch(a: {
  dangChinh: string; loaiCau: string; goc: CauNoiDung; variants: CauNoiDung[]
}): Promise<{ goc: string; soClone: number }> {
  const start = await nextCauSeq(a.dangChinh)
  const g = await createCau({
    ma_cau: maCau(a.dangChinh, start),
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: a.goc.noi_dung, dap_an: a.goc.dap_an, loi_giai: a.goc.loi_giai, lua_chon: a.goc.lua_chon ?? null,
    anh_de: a.goc.anh_de ?? null, anh_dap_an: a.goc.anh_dap_an ?? null, nguon: 'le',
    nguon_giai: a.goc.nguon_giai ?? 'nguoi', // gốc = người ra đề (tin)
  })
  if (a.variants.length) {
    const rows = a.variants.map((v, i) => ({
      ma_cau: maCau(a.dangChinh, start + 1 + i),
      dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
      noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
      anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null,
      nguon: 'clone', nguon_giai: 'ai', parent_ma_cau: g.ma_cau, clone_method: 'manual_gemini', // biến thể = AI giải
    }))
    const { error } = await supabase.from('dai_cau_hoi').insert(rows)
    if (error) throw error
  }
  return { goc: g.ma_cau, soClone: a.variants.length }
}

// ── NHẬP CHUỖI CÂU CÓ SẴN (batch): prompt tách + parse + lưu (tất cả 'le') ──
// Luật lời giải theo 2 luồng: bóc-nguyên (người, tin) vs AI-tự-giải (cần duyệt).
const giaiRule = (giaiAI?: boolean) => giaiAI
  ? '⚠ LỜI GIẢI: tài liệu KHÔNG có lời giải sẵn → HÃY TỰ GIẢI chi tiết, đúng & gọn, BÁM "dap_an" có sẵn nếu có; trình bày từng bước. (Lời giải AI sẽ được người DUYỆT lại.)'
  : '⚠ LỜI GIẢI: CHỈ bóc lời giải CÓ SẴN trong tài liệu — TUYỆT ĐỐI KHÔNG tự giải/sửa/bịa. Câu nào tài liệu không có lời giải → để "loi_giai" RỖNG (chuỗi rỗng).'
export function buildBatchPrompt(a: { ghiChu: string; tenDang: string; loaiCau: string; giaiAI?: boolean }): string {
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
    giaiRule(a.giaiAI),
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
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
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
  const start = await nextCauSeq(a.dangChinh)
  const rows = a.items.map((v, i) => ({
    ma_cau: maCau(a.dangChinh, start + i),
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
    anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null, nguon: 'le', nguon_giai: v.nguon_giai ?? 'nguoi',
  }))
  const { error } = await supabase.from('dai_cau_hoi').insert(rows)
  if (error) throw error
  return rows.length
}

// ── ĐO TOKEN + QUY RA TIỀN ──────────────────────────────────────────
// Giá USD / 1 TRIỆU token (thinking tính như OUTPUT). ⚠ PROVISIONAL — cập nhật theo ai.google.dev/pricing.
export const USD_VND = 25400
export const GEMINI_GIA: Record<string, { in: number; out: number }> = {
  'gemini-2.5-flash-lite': { in: 0.10, out: 0.40 },
  'gemini-2.5-flash': { in: 0.30, out: 2.50 },
  'gemini-2.5-pro': { in: 1.25, out: 10.0 },
}
const giaOf = (m: string) => GEMINI_GIA[m] ?? (m.includes('pro') ? GEMINI_GIA['gemini-2.5-pro'] : m.includes('lite') ? GEMINI_GIA['gemini-2.5-flash-lite'] : GEMINI_GIA['gemini-2.5-flash'])
export type GeminiUsage = { in: number; out: number; think: number }
export function geminiCostVND(u: GeminiUsage, model: string): number {
  const g = giaOf(model)
  return Math.round(((u.in * g.in + (u.out + u.think) * g.out) / 1e6) * USD_VND)
}
// Bộ đếm theo PHIÊN (reset khi F5 / bấm reset). UI subscribe để hiện badge.
export type GeminiMeter = { in: number; out: number; think: number; calls: number; vnd: number }
let _meter: GeminiMeter = { in: 0, out: 0, think: 0, calls: 0, vnd: 0 }
const _meterListeners = new Set<() => void>()
export function getGeminiMeter(): GeminiMeter { return _meter }
export function onGeminiMeter(fn: () => void): () => void { _meterListeners.add(fn); return () => { _meterListeners.delete(fn) } }
export function resetGeminiMeter() { _meter = { in: 0, out: 0, think: 0, calls: 0, vnd: 0 }; _meterListeners.forEach((f) => f()) }
function recordUsage(u: GeminiUsage, model: string) {
  _meter = { in: _meter.in + u.in, out: _meter.out + u.out, think: _meter.think + u.think, calls: _meter.calls + 1, vnd: _meter.vnd + geminiCostVND(u, model) }
  _meterListeners.forEach((f) => f())
}

// ── AUTO: gọi Gemini API thẳng từ client (key VITE_GEMINI_KEY — rủi ro lộ, chấp nhận) ──
export type GeminiFile = { mimeType: string; dataBase64: string }  // ảnh/PDF base64 (bỏ tiền tố data:)
// Schema ép JSON hợp lệ (Type enum UPPERCASE). 1 câu = de_bai (bắt buộc) + đáp án/lời giải/lựa chọn (tuỳ).
const CAU_ITEM_SCHEMA = { type: 'OBJECT', properties: { de_bai: { type: 'STRING' }, dap_an: { type: 'STRING' }, loi_giai: { type: 'STRING' }, lua_chon: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['de_bai'] }
export const CLONE_SCHEMA = { type: 'OBJECT', properties: { bai_goc: CAU_ITEM_SCHEMA, variants: { type: 'ARRAY', items: CAU_ITEM_SCHEMA } }, required: ['bai_goc', 'variants'] }
export const BATCH_SCHEMA = { type: 'OBJECT', properties: { cau_hoi: { type: 'ARRAY', items: CAU_ITEM_SCHEMA } }, required: ['cau_hoi'] }
export const LYTHUYET_SCHEMA = { type: 'OBJECT', properties: { noi_dung: { type: 'STRING' } }, required: ['noi_dung'] }
export async function callGeminiJson(prompt: string, opts?: { model?: string; files?: GeminiFile[]; think?: number; schema?: any }): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined
  if (!key) throw new Error('Chưa có VITE_GEMINI_KEY trong .env.local → luồng AUTO chưa bật. Dùng MANUAL hoặc thêm key.')
  const model = opts?.model || (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-2.5-flash'
  const parts: any[] = [{ text: prompt }]
  for (const f of opts?.files ?? []) parts.push({ inline_data: { mime_type: f.mimeType, data: f.dataBase64 } })
  // ⚠ TIỀN: Gemini 2.5 mặc định BẬT thinking — token suy nghĩ TÍNH NHƯ OUTPUT (vụ cháy 1tr3 06-10).
  // OCR/bóc đề/nhập-chuỗi = extraction → KHÔNG cần nghĩ (budget 0). CLONE = GENERATION (dựng+giải+số đẹp)
  // → CẦN suy luận, caller truyền opts.think (vd 8192) nếu không clone toán sẽ sai. Pro ép min 128.
  const thinkingBudget = opts?.think ?? (model.includes('pro') ? 128 : 0)
  // responseSchema (constrained decoding) = ép JSON hợp lệ + tự escape → hết lỗi "Bad escaped"/"Expected , or }"
  // do LaTeX 1-backslash hay " chưa escape (clone/batch/lý-thuyết hay dính). Caller truyền schema theo shape.
  const genCfg: any = { responseMimeType: 'application/json', maxOutputTokens: 65536, thinkingConfig: { thinkingBudget } }
  if (opts?.schema) genCfg.responseSchema = opts.schema
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: genCfg }),
  })
  if (!res.ok) throw new Error(`Gemini API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  // Soi chi phí từng call ngay tại console: prompt/output/THINKING token.
  const u = data?.usageMetadata
  if (u) console.info(`[gemini ${model}] tokens — in:${u.promptTokenCount ?? 0} out:${u.candidatesTokenCount ?? 0} think:${u.thoughtsTokenCount ?? 0}`)
  recordUsage({ in: u?.promptTokenCount ?? 0, out: u?.candidatesTokenCount ?? 0, think: u?.thoughtsTokenCount ?? 0 }, model)
  const cand = data?.candidates?.[0]
  const txt: string = (cand?.content?.parts ?? []).map((p: any) => p.text ?? '').join('')
  if (cand?.finishReason === 'MAX_TOKENS') throw new Error('AI bị CẮT do output quá dài (JSON dở) → giảm "Số biến thể" hoặc cho input ngắn hơn rồi thử lại.')
  if (!txt.trim()) throw new Error(`Gemini trả rỗng${cand?.finishReason ? ` (lý do: ${cand.finishReason})` : ''}.`)
  return txt
}

// ── SPIKE Phase 2 (ingest): gọi Gemini trả KÈM token usage (đo chi phí) + prompt dò câu+bbox hình ──
// responseSchema = constrained decoding → Gemini BUỘC xuất JSON hợp lệ cấu trúc + tự escape chuỗi
// (hết lỗi "Bad escaped character" / "Expected , or }" do LaTeX 1-backslash hay " chưa escape).
export async function callGeminiRich(prompt: string, opts?: { model?: string; files?: GeminiFile[]; think?: number; schema?: any }): Promise<{ text: string; usage: GeminiUsage }> {
  const key = import.meta.env.VITE_GEMINI_KEY as string | undefined
  if (!key) throw new Error('Chưa có VITE_GEMINI_KEY trong .env.local.')
  const model = opts?.model || 'gemini-2.5-flash'
  const parts: any[] = [{ text: prompt }]
  for (const f of opts?.files ?? []) parts.push({ inline_data: { mime_type: f.mimeType, data: f.dataBase64 } })
  const thinkingBudget = opts?.think ?? (model.includes('pro') ? 128 : 0)
  const genCfg: any = { responseMimeType: 'application/json', maxOutputTokens: 65536, thinkingConfig: { thinkingBudget } }
  if (opts?.schema) genCfg.responseSchema = opts.schema
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: genCfg }),
  })
  if (!res.ok) throw new Error(`Gemini API lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const data = await res.json()
  const u = data?.usageMetadata ?? {}
  const cand = data?.candidates?.[0]
  const text: string = (cand?.content?.parts ?? []).map((p: any) => p.text ?? '').join('')
  if (cand?.finishReason === 'MAX_TOKENS') throw new Error('AI bị CẮT (JSON dở) — trang quá dày, thử trang ngắn hơn / ít câu hơn.')
  if (!text.trim()) throw new Error(`Gemini trả rỗng${cand?.finishReason ? ` (${cand.finishReason})` : ''}.`)
  const usage: GeminiUsage = { in: u.promptTokenCount ?? 0, out: u.candidatesTokenCount ?? 0, think: u.thoughtsTokenCount ?? 0 }
  recordUsage(usage, model)
  return { text, usage }
}

// Câu suy ra từ ingest 1 trang: text fields + cờ có hình + bbox hình (Gemini format [ymin,xmin,ymax,xmax] 0–1000).
export type IngestCau = { noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null; coHinh: boolean; box: [number, number, number, number] | null }
// Schema ép Gemini xuất JSON đúng cấu trúc (Type enum UPPERCASE theo proto). required tối thiểu = de_bai.
export const INGEST_SCHEMA = {
  type: 'OBJECT',
  properties: {
    cau: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          de_bai: { type: 'STRING' }, dap_an: { type: 'STRING' }, loi_giai: { type: 'STRING' },
          lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
          co_hinh: { type: 'BOOLEAN' }, box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' } },
        },
        required: ['de_bai'],
      },
    },
  },
  required: ['cau'],
}
export function buildIngestPrompt(a: { tenDang?: string; loaiCau?: string; giaiAI?: boolean }): string {
  const f = loaiFields(a.loaiCau || 'tu_luan')
  return [
    'Đây là ẢNH 1 TRANG tài liệu toán. TÁCH thành từng CÂU HỎI theo thứ tự xuất hiện (mỗi bài = 1 câu, KHÔNG tách ý a/b/c).',
    a.tenDang ? `Gợi ý: các câu thường cùng dạng "${a.tenDang}".` : '',
    `Mỗi câu gồm: ${f.spec}.`,
    '⚠ MỖI câu thêm 2 trường HÌNH: "co_hinh" (true nếu câu có HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ cần giữ làm ảnh — KHÔNG tính bảng số) và "box_hinh" = [ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0–1000 của vùng hình (ôm TRỌN hình, chừa lề nhỏ) — CHỈ trả khi co_hinh=true, nếu không thì box_hinh=null.',
    'BẢNG số liệu → viết bằng LaTeX $\\begin{array}{…}…\\end{array}$ trong de_bai (KHÔNG coi là hình).',
    giaiRule(a.giaiAI),
    f.ruleDapAn,
    FMT_RULES,
    'Trả JSON: { "cau": [ { "de_bai":"…", "dap_an":"…", "loi_giai":"…", "lua_chon":["…"], "co_hinh": false, "box_hinh": null } ] }',
  ].filter(Boolean).join('\n')
}
export function parseIngestJson(text: string): IngestCau[] {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau ?? obj.cau_hoi ?? [])
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau": [ … ] }.')
  return arr.filter((x: any) => x?.de_bai || x?.noi_dung).map((x: any) => ({
    noi_dung: String(x.de_bai ?? x.noi_dung ?? '').trim(),
    dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
    loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? String(x.loi_giai).trim() : null,
    lua_chon: Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map(String) : null,
    coHinh: !!x.co_hinh,
    box: Array.isArray(x.box_hinh) && x.box_hinh.length === 4 ? (x.box_hinh.map(Number) as [number, number, number, number]) : null,
  }))
}

// ── KB4: ingest LÝ THUYẾT có hình — AI trả text + marker [[H1]].. đúng vị trí + bbox hình theo thứ tự ──
export type TheoryIngest = { noiDung: string; hinh: { box: [number, number, number, number] | null }[] }
export const THEORY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    noi_dung: { type: 'STRING' },
    hinh: { type: 'ARRAY', items: { type: 'OBJECT', properties: { box: { type: 'ARRAY', items: { type: 'NUMBER' } } } } },
  },
  required: ['noi_dung'],
}
export function buildTheoryIngestPrompt(): string {
  return [
    'Đây là ẢNH 1 trang LÝ THUYẾT toán. Bóc TOÀN BỘ nội dung (định nghĩa/tính chất/ví dụ…) thành văn bản theo ĐÚNG thứ tự, đầy đủ, KHÔNG bịa thêm.',
    '⚠ Ở MỖI vị trí xuất hiện HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ, chèn marker [[H1]], [[H2]]… (đánh số theo thứ tự xuất hiện) ĐÚNG vị trí trong văn bản — KHÔNG mô tả hình bằng chữ, chỉ đặt marker. (Bảng số liệu KHÔNG phải hình → viết bằng LaTeX $\\begin{array}{…}…\\end{array}$.)',
    'Trường "hinh" = mảng theo ĐÚNG thứ tự H1,H2,…; mỗi phần tử { box:[ymin,xmin,ymax,xmax] } toạ độ CHUẨN HOÁ 0–1000 ôm TRỌN hình (chừa lề nhỏ).',
    FMT_RULES,
    'Trả JSON: { "noi_dung": "…văn bản có [[H1]]…", "hinh": [ { "box":[0,0,0,0] } ] }',
  ].join('\n')
}
export function parseTheoryIngest(text: string): TheoryIngest {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const hinh = Array.isArray(obj.hinh) ? obj.hinh.map((h: any) => ({ box: Array.isArray(h?.box) && h.box.length === 4 ? (h.box.map(Number) as [number, number, number, number]) : null })) : []
  return { noiDung: String(obj.noi_dung ?? obj.noiDung ?? '').trim(), hinh }
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
// Đổi TÊN chủ đề / chuyên đề (denormalize trong dai_ban_do — update mọi dòng cùng mã). KHÔNG đổi MÃ (mã là FK-target).
export async function renameDaiChuDe(khoi: string, maChuDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_ban_do').update({ ten_chu_de: ten }).eq('khoi', khoi).eq('ma_chu_de', maChuDe)
  if (error) throw error
}
export async function renameDaiChuyenDe(maChuyenDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('dai_ban_do').update({ ten_chuyen_de: ten }).eq('ma_chuyen_de', maChuyenDe)
  if (error) throw error
}
// Xoá CẢ CỤM (chủ đề/chuyên đề) KÈM câu: xoá dai_cau_hoi trước (cascade tai_lieu_cau/bo_đề/parent), rồi dai_ban_do (cascade lý thuyết).
export async function deleteDaiCum(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error: e1 } = await supabase.from('dai_cau_hoi').delete().in('dang_chinh', leafMas)
  if (e1) throw e1
  const { error: e2 } = await supabase.from('dai_ban_do').delete().in('ma_dang', leafMas)
  if (e2) throw e2
}

// ── LÝ THUYẾT: prompt bóc tài liệu (ảnh/PDF) → 1 khối text LaTeX (KHÔNG clone) ──
export function buildLyThuyetPrompt(a: { tenDang: string; ghiChu?: string }): string {
  return [
    'Bạn là trợ lý số hoá tài liệu toán. Bên dưới là tài liệu LÝ THUYẾT của một dạng bài (ảnh/PDF).',
    `Dạng: "${a.tenDang}".`,
    'Chép lại TOÀN BỘ phần lý thuyết / phương pháp / ví dụ mẫu thành MỘT chuỗi text có định dạng — GIỮ nguyên nội dung, KHÔNG tóm tắt, KHÔNG thêm bớt.',
    a.ghiChu ? `Ghi chú: ${a.ghiChu}` : '',
    '',
    'QUY TẮC:',
    '- Công thức toán DÙNG LaTeX trong $...$ (inline) hoặc $$...$$ (block). Phân số DÙNG \\\\dfrac (không \\\\frac).',
    '- Đề mục/tiêu đề để nguyên dòng; xuống dòng giữ bằng xuống dòng thật.',
    '- TÁCH mỗi ý/khối logic (mỗi Ví dụ, mỗi Quy tắc, mỗi Tính chất…) bằng MỘT DÒNG TRỐNG để khi in không bị xé ngang trang.',
    '- Nhãn đầu dòng (Ví dụ, Quy tắc, Lưu ý, Chú ý, Nhận xét, Định nghĩa, Định lý, Tính chất, Hệ quả, Phương pháp…) bọc **đậm**, vd: "**Ví dụ 1:** ...".',
    '- Nếu có BẢNG / ĐỒ THỊ / HÌNH VẼ: ghi "[hình]" + mô tả 1 dòng ngắn, KHÔNG vẽ lại bằng LaTeX.',
    '- Trong JSON: lệnh LaTeX PHẢI double backslash ("\\\\dfrac", "\\\\neq"); trích dẫn dùng nháy đơn; CHỈ trả JSON.',
    'Trả về JSON: { "noi_dung": "..." }',
  ].filter(Boolean).join('\n')
}
export function parseLyThuyetJson(text: string): string {
  let t = text.trim()
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any
  try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  return String(obj.noi_dung ?? obj.noiDung ?? '').trim()
}

// ── Lý thuyết đi kèm dạng Đại (1-1) + chuẩn completeness ──────────
export const CHUAN_SO_CAU = 50 // chuẩn kho: mỗi dạng ≥ 50 câu (sàn SỐ LƯỢNG, chỉnh 1 chỗ)
// noi_dung = nội dung lý thuyết (text + LaTeX); file_url/ten_file = đính kèm; khong_can = đánh dấu "không cần" (chỉ chuyên đề)
export type LyThuyet = { noi_dung: string; file_url: string | null; ten_file: string | null; khong_can?: boolean; cap_nhat_at?: string }

export async function listDaiLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('dai_dang_ly_thuyet').select('*').limit(LIMIT)
  if (error) throw error
  const m: Record<string, LyThuyet> = {}
  for (const r of data ?? []) m[r.ma_dang] = { noi_dung: r.noi_dung ?? '', file_url: r.file_url, ten_file: r.ten_file, cap_nhat_at: r.cap_nhat_at }
  return m
}
export async function upsertDaiLyThuyet(ma_dang: string, noi_dung: string, file_url: string | null, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('dai_dang_ly_thuyet')
    .upsert({ ma_dang, noi_dung, file_url, ten_file }, { onConflict: 'ma_dang' })
  if (error) throw error
}
export async function deleteDaiLyThuyet(ma_dang: string): Promise<void> {
  const { error } = await supabase.from('dai_dang_ly_thuyet').delete().eq('ma_dang', ma_dang)
  if (error) throw error
}
// Lý thuyết CHUNG cấp chuyên đề (Tier 2) — tuỳ chọn, khoá theo ma_chuyen_de
export async function listDaiChuyenDeLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('dai_chuyen_de_ly_thuyet').select('*').limit(LIMIT)
  if (error) throw error
  const m: Record<string, LyThuyet> = {}
  for (const r of data ?? []) m[r.ma_chuyen_de] = { noi_dung: r.noi_dung ?? '', file_url: r.file_url, ten_file: r.ten_file, khong_can: r.khong_can ?? false, cap_nhat_at: r.cap_nhat_at }
  return m
}
export async function upsertDaiChuyenDeLyThuyet(ma_chuyen_de: string, noi_dung: string, file_url: string | null, ten_file: string | null, khong_can = false): Promise<void> {
  const { error } = await supabase.from('dai_chuyen_de_ly_thuyet')
    .upsert({ ma_chuyen_de, noi_dung, file_url, ten_file, khong_can }, { onConflict: 'ma_chuyen_de' })
  if (error) throw error
}
export async function deleteDaiChuyenDeLyThuyet(ma_chuyen_de: string): Promise<void> {
  const { error } = await supabase.from('dai_chuyen_de_ly_thuyet').delete().eq('ma_chuyen_de', ma_chuyen_de)
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
