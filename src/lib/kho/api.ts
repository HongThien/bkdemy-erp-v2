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
// Câu Đúng/Sai (Phần 2 đề 2025): 1 đề chung + 4 mệnh đề, MỖI mệnh đề có dạng RIÊNG (có thể khác chuyên đề).
export type MenhDe = { noi_dung: string; dap_an: 'D' | 'S'; ma_dang: string; loi_giai?: string | null }
export type CauHoi = {
  ma_cau: string
  dang_chinh: string
  loai_cau: string
  noi_dung: string
  dap_an: string | null
  loi_giai: string | null
  lua_chon: string[] | null     // trắc nghiệm: 4 phương án; dap_an = chữ cái đúng
  menh_de: MenhDe[] | null       // đúng/sai: 4 mệnh đề, mỗi cái 1 dạng
  anh_de: string | null
  anh_dap_an: string | null
  nguon: string                 // 'le' | 'clone'
  nguon_giai: string            // 'nguoi' (tin) | 'ai' (AI giải/clone — cần duyệt)
  parent_ma_cau: string | null
  clone_method: string | null
  created_at?: string
}

// tbl = bảng câu theo MÔN (default Toán 'dai_cau_hoi'; KHTN 'khtn_cau_hoi'). Giữ default → Toán không đổi hành vi.
export async function listCauByDang(maDang: string, tbl = 'dai_cau_hoi'): Promise<CauHoi[]> {
  const { data, error } = await supabase.from(tbl).select('*')
    .eq('dang_chinh', maDang).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
type CauInput = {
  ma_cau?: string
  dang_chinh: string; loai_cau: string; noi_dung: string
  dap_an: string | null; loi_giai: string | null; lua_chon?: string[] | null; menh_de?: MenhDe[] | null
  anh_de?: string | null; anh_dap_an?: string | null
  nguon?: string; nguon_giai?: string; parent_ma_cau?: string | null; clone_method?: string | null
}
export async function createCau(input: CauInput, tbl = 'dai_cau_hoi'): Promise<CauHoi> {
  const { data, error } = await supabase.from(tbl).insert(input).select().single()
  if (error) throw error
  return data as CauHoi
}
export async function updateCau(ma_cau: string, patch: Partial<CauInput>, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl).update(patch).eq('ma_cau', ma_cau)
  if (error) throw error
}
export async function deleteCau(ma_cau: string, tbl = 'dai_cau_hoi'): Promise<void> {
  const { error } = await supabase.from(tbl).delete().eq('ma_cau', ma_cau)
  if (error) throw error
}

// ── TÌM CÂU (để sửa câu sai nhanh) — THEO KHO ĐANG XEM (per cauTbl), KHÔNG xuyên môn ──
const BAN_DO_OF: Record<string, string> = { dai_cau_hoi: 'dai_ban_do', khtn_cau_hoi: 'khtn_ban_do' }
export type CauTimThay = CauHoi & { dangTen: string }
// q khớp MÃ (prefix) HOẶC NỘI DUNG (chứa). Sanitize ,() vì là ký tự phân tách của PostgREST .or().
export async function searchCau(q: string, tbl = 'dai_cau_hoi'): Promise<CauTimThay[]> {
  const safe = q.trim().replace(/[,()]/g, ' ').trim()
  if (!safe) return []
  const { data, error } = await supabase.from(tbl).select('*')
    .or(`ma_cau.ilike.${safe}%,noi_dung.ilike.%${safe}%`)
    .order('ma_cau').limit(200)
  if (error) throw error
  const caus = (data ?? []) as CauHoi[]
  const dangMas = [...new Set(caus.map((c) => c.dang_chinh).filter(Boolean))]
  const ten: Record<string, string> = {}
  if (dangMas.length) {
    const { data: d2 } = await supabase.from(BAN_DO_OF[tbl] ?? 'dai_ban_do').select('ma_dang, ten_dang').in('ma_dang', dangMas).limit(LIMIT)
    for (const r of (d2 ?? []) as any[]) ten[r.ma_dang] = r.ten_dang
  }
  return caus.map((c) => ({ ...c, dangTen: ten[c.dang_chinh] ?? c.dang_chinh }))
}
// Tuỳ chọn dạng cho editor Đúng/Sai (mệnh đề gán dạng bất kỳ trong MÔN). Lấy cả môn từ ban_do.
export async function listDangOptions(tbl = 'dai_cau_hoi'): Promise<{ id: string; label: string; sub: string }[]> {
  const banDo = BAN_DO_OF[tbl] ?? 'dai_ban_do'
  const { data, error } = await supabase.from(banDo)
    .select('ma_dang, ten_dang, ten_chu_de, ten_chuyen_de, khoi').order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ id: r.ma_dang, label: r.ten_dang, sub: `K${r.khoi} · ${r.ten_chu_de} › ${r.ten_chuyen_de}` }))
}

// ── BANK ĐÚNG/SAI: con của CHUYÊN ĐỀ (như lý thuyết). câu loai_cau='dung_sai' có dang_chinh ∈ dạng của chuyên đề đó. ──
export async function listDungSaiByDang(dangMas: string[], tbl = 'dai_cau_hoi'): Promise<CauHoi[]> {
  if (!dangMas.length) return []
  const { data, error } = await supabase.from(tbl).select('*').eq('loai_cau', 'dung_sai').in('dang_chinh', dangMas).order('created_at').limit(LIMIT)
  if (error) throw error
  return (data ?? []) as CauHoi[]
}
// AI bóc câu đúng/sai từ tài liệu (PDF/ảnh): đề chung + 4 mệnh đề + Đ/S + lời giải. Người chỉ sửa đáp án + gán dạng.
export type IngestDungSai = { de_chung: string; loi_giai: string | null; menh_de: { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null }[] }
export const DUNGSAI_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      de_chung: { type: 'STRING', description: 'Phần dẫn/đề chung của câu. Giữ nguyên xuống dòng bằng \\n.' },
      loi_giai: { type: 'STRING', description: 'Lời giải chi tiết chung của câu (nếu tài liệu có). Giữ xuống dòng.' },
      menh_de: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            noi_dung: { type: 'STRING', description: 'Nội dung 1 mệnh đề (a/b/c/d).' },
            dap_an: { type: 'STRING', description: "'D' nếu mệnh đề ĐÚNG, 'S' nếu SAI." },
            loi_giai: { type: 'STRING', description: 'Giải thích riêng cho mệnh đề (nếu có).' },
          },
          required: ['noi_dung', 'dap_an'],
        },
      },
    },
    required: ['de_chung', 'menh_de'],
  },
}
export function buildDungSaiIngestPrompt(): string {
  return [
    'Đây là tài liệu (ảnh/PDF) chứa các CÂU TRẮC NGHIỆM ĐÚNG/SAI (Phần 2 đề thi).',
    'Mỗi câu gồm: 1 ĐỀ CHUNG (phần dẫn) + 4 MỆNH ĐỀ a) b) c) d). Với mỗi mệnh đề học sinh xác định ĐÚNG hay SAI.',
    'TÁCH từng câu theo thứ tự xuất hiện. Với MỖI câu trả: de_chung, loi_giai (lời giải chi tiết nếu tài liệu CÓ — nếu không có thì để trống), và menh_de = MẢNG đúng 4 phần tử theo thứ tự a,b,c,d.',
    "Mỗi mệnh đề: noi_dung; dap_an = 'D' nếu mệnh đề ĐÚNG / 'S' nếu SAI (đọc đáp án trong tài liệu; nếu tài liệu không ghi, suy luận chính xác nhất); loi_giai (giải thích riêng nếu có).",
    'Công thức toán viết LaTeX trong $…$. Bảng số liệu dùng $\\begin{array}{…}…\\end{array}$ (KHÔNG coi là hình). Giữ nguyên xuống dòng bằng \\n. TUYỆT ĐỐI không bịa thêm câu/mệnh đề không có trong tài liệu.',
    'Trả JSON: MẢNG các câu [ { "de_chung":"…", "loi_giai":"…", "menh_de":[ {"noi_dung":"…","dap_an":"D","loi_giai":"…"}, …đúng 4 phần tử ] } ].',
  ].join('\n')
}
export function parseDungSaiJson(text: string): IngestDungSai[] {
  let arr: any
  try { arr = JSON.parse(text) } catch { return [] }
  if (!Array.isArray(arr)) arr = arr?.cau ?? arr?.cau_hoi ?? arr?.items ?? []
  return (arr as any[]).map((c) => ({
    de_chung: String(c.de_chung ?? c.de ?? '').trim(),
    loi_giai: String(c.loi_giai ?? '').trim() || null,
    menh_de: (Array.isArray(c.menh_de) ? c.menh_de : []).slice(0, 4).map((m: any) => ({
      noi_dung: String(m.noi_dung ?? '').trim(),
      dap_an: (String(m.dap_an ?? 'D').trim().toUpperCase().startsWith('S') ? 'S' : 'D') as 'D' | 'S',
      loi_giai: String(m.loi_giai ?? '').trim() || null,
    })),
  })).filter((c) => c.de_chung && c.menh_de.length)
}
// Tạo câu đúng/sai: dang_chinh = dạng đại diện của chuyên đề nhà (cho ma_cau + browse). menh_de = 4 mệnh đề (mỗi cái dạng riêng).
export async function createCauDungSai(input: { dang_chinh: string; noi_dung: string; loi_giai?: string | null; menh_de: MenhDe[]; anh_de?: string | null }, tbl = 'dai_cau_hoi'): Promise<CauHoi> {
  const ma_cau = maCau(input.dang_chinh, await nextCauSeq(input.dang_chinh, tbl))
  const { data, error } = await supabase.from(tbl).insert({
    ma_cau, dang_chinh: input.dang_chinh, loai_cau: 'dung_sai', noi_dung: input.noi_dung,
    loi_giai: input.loi_giai ?? null, menh_de: input.menh_de, anh_de: input.anh_de ?? null,
    dap_an: null, lua_chon: null, nguon: 'le', nguon_giai: 'nguoi',
  }).select().single()
  if (error) throw error
  return data as CauHoi
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
async function nextCauSeq(dangChinh: string, tbl = 'dai_cau_hoi'): Promise<number> {
  const { data, error } = await supabase.from(tbl).select('ma_cau').eq('dang_chinh', dangChinh).limit(LIMIT)
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
  '- ⚠ KHÔNG chép nhãn "Câu N" / "Bài N" vào đầu de_bai — de_bai bắt đầu THẲNG từ nội dung đề (hệ thống TỰ đánh số câu). Bản gốc có "Câu 3." → BỎ nhãn đó, chỉ lấy phần đề.',
  '- ⚠ Câu TRẮC NGHIỆM: de_bai CHỈ chứa đề dẫn (câu hỏi), TUYỆT ĐỐI KHÔNG chép 4 phương án "A. … B. … C. … D. …" vào de_bai — phương án CHỈ đặt ở lua_chon (hệ thống tự render lưới đáp án).',
  '- Công thức toán DÙNG LaTeX trong $...$ (inline) hoặc $$...$$ (block).',
  '- ⚠ MỖI công thức/phân số/biểu thức phải bọc RIÊNG trong $...$ — KỂ CẢ khi liệt kê nhiều: viết "$\\\\dfrac{6}{5}$; $\\\\dfrac{4}{3}$" (TUYỆT ĐỐI KHÔNG để "\\\\dfrac{6}{5}" trần ngoài $).',
  '- ⚠ XUỐNG DÒNG: GIỮ ĐÚNG bố cục NHIỀU DÒNG của đề & lời giải gốc — mỗi ý, mỗi câu hỏi, mỗi bước giải đặt trên MỘT DÒNG riêng (ngăn bằng ký tự xuống dòng thật trong chuỗi). Gốc bao nhiêu dòng thì giữ bấy nhiêu. TUYỆT ĐỐI KHÔNG gộp tất cả thành một đoạn liền, KHÔNG dùng thẻ "<br>".',
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
// Bỏ nhãn "Câu N" / "Bài N" ở ĐẦU đề (hệ thống tự đánh số → nhãn này dư, gây số trùng/lệch).
// Chỉ strip khi CÒN nội dung sau đó (không để rỗng). Cap CỨNG ở code — không tin mỗi prompt.
export const stripCauLabel = (s: string): string => {
  const t = s.replace(/^[\s*]*(?:câu|bài)\s*\d+\s*[.:)\-]?\s*/i, '')
  return t.trim() ? t : s
}
// Bỏ tiền tố ý con "a)" "b." "c)" … ở đầu MỖI dòng (đề nhiều ý → clone hay chèn nhãn a/b/c; người muốn bỏ hết).
// Chỉ cắt nhãn 1 chữ cái a–h + ')' hoặc '.' + khoảng trắng → không đụng nội dung/công thức toán.
export const stripYCon = (s: string): string =>
  s.split('\n').map((ln) => ln.replace(/^(\s*)[a-h][.)]\s+/, '$1')).join('\n')
// Bỏ khối đáp án "A. … B. … C. … D. …" ở CUỐI đề (khi câu ĐÃ có lua_chon riêng) → chống hiện 2 lần
// (1 lần trong đề + 1 lần ở lưới đáp án). Cắt từ dòng bắt đầu "A." tới hết. Chỉ khi còn nội dung sau cắt.
const stripEmbeddedOpts = (s: string): string => {
  const t = s.replace(/\n\s*A\s*[.):][\s\S]*$/, '').trimEnd()
  return t.trim() ? t : s
}
const normCau = (x: any): CauNoiDung => {
  const lua_chon = Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map((o: any) => String(o)) : null
  let noi_dung = stripYCon(stripCauLabel(String(x.de_bai ?? x.noi_dung ?? '').trim()))
  if (lua_chon) noi_dung = stripEmbeddedOpts(noi_dung) // câu trắc nghiệm: đề KHÔNG chứa 4 đáp án
  const loi_giai = x.loi_giai != null && String(x.loi_giai).trim() ? stripYCon(String(x.loi_giai).trim()) : null
  return {
    noi_dung,
    dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
    loi_giai,
    lua_chon,
  }
}
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
    '- ⚠ KHÔNG thêm nhãn ý con "a)", "b)", "c)"… vào đầu dòng trong de_bai / loi_giai — viết THẲNG nội dung từng ý trên dòng riêng, KHÔNG kèm chữ cái đánh mục.',
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
}, tbl = 'dai_cau_hoi'): Promise<{ goc: string; soClone: number }> {
  const start = await nextCauSeq(a.dangChinh, tbl)
  const g = await createCau({
    ma_cau: maCau(a.dangChinh, start),
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: a.goc.noi_dung, dap_an: a.goc.dap_an, loi_giai: a.goc.loi_giai, lua_chon: a.goc.lua_chon ?? null,
    anh_de: a.goc.anh_de ?? null, anh_dap_an: a.goc.anh_dap_an ?? null, nguon: 'le',
    nguon_giai: a.goc.nguon_giai ?? 'nguoi', // gốc = người ra đề (tin)
  }, tbl)
  if (a.variants.length) {
    const rows = a.variants.map((v, i) => ({
      ma_cau: maCau(a.dangChinh, start + 1 + i),
      dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
      noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
      anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null,
      nguon: 'clone', nguon_giai: 'ai', parent_ma_cau: g.ma_cau, clone_method: 'manual_gemini', // biến thể = AI giải
    }))
    const { error } = await supabase.from(tbl).insert(rows)
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

export async function saveCauBatch(a: { dangChinh: string; loaiCau: string; items: CauNoiDung[] }, tbl = 'dai_cau_hoi'): Promise<number> {
  if (!a.items.length) return 0
  const start = await nextCauSeq(a.dangChinh, tbl)
  const rows = a.items.map((v, i) => ({
    ma_cau: maCau(a.dangChinh, start + i),
    dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: v.noi_dung, dap_an: v.dap_an, loi_giai: v.loi_giai, lua_chon: v.lua_chon ?? null,
    anh_de: v.anh_de ?? null, anh_dap_an: v.anh_dap_an ?? null, nguon: 'le', nguon_giai: v.nguon_giai ?? 'nguoi',
  }))
  const { error } = await supabase.from(tbl).insert(rows)
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
// ⚠ de_bai/loi_giai có description ÉP GIỮ XUỐNG DÒNG: responseSchema (constrained decoding) hay gộp
//   chuỗi về 1 dòng → mất bố cục. Description per-field là cách Gemini tôn trọng để chèn '\n'.
const CAU_ITEM_SCHEMA = { type: 'OBJECT', properties: {
  de_bai: { type: 'STRING', description: 'Đề bài. GIỮ bố cục NHIỀU DÒNG: mỗi ý / mỗi câu hỏi / mỗi dòng của đề đặt trên MỘT dòng riêng, ngăn nhau bằng ký tự xuống dòng. KHÔNG gộp tất cả thành một đoạn liền.' },
  dap_an: { type: 'STRING' },
  loi_giai: { type: 'STRING', description: 'Lời giải trình bày TỪNG BƯỚC, mỗi bước trên MỘT dòng riêng, ngăn nhau bằng ký tự xuống dòng. KHÔNG gộp thành một đoạn.' },
  lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
}, required: ['de_bai'] }
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

// ════════════════════════════════════════════════════════════════
// LUỒNG NHẬP KHO (ingest-first, scope = CHỦ ĐỀ): 1 file → bóc MỌI loại → gán dạng → verify → đẩy kho.
// Bóc/crop hình chạy ở SCREEN (DOM); ở đây = prompt + parse + phân loại grounded + verify + AI-giải + save + log.
// ════════════════════════════════════════════════════════════════
export type KhoMon = 'toan' | 'khtn'
export function khoTbls(mon: KhoMon): { cauTbl: string; banDoTbl: string; lyThuyetTbl: string } {
  return mon === 'khtn'
    ? { cauTbl: 'khtn_cau_hoi', banDoTbl: 'khtn_ban_do', lyThuyetTbl: 'khtn_dang_ly_thuyet' }
    : { cauTbl: 'dai_cau_hoi', banDoTbl: 'dai_ban_do', lyThuyetTbl: 'dai_dang_ly_thuyet' }
}

// Chủ đề trong 1 khối — chọn ở ĐẦU luồng (tài liệu chung 1 chủ đề, người biết sẵn).
export type ChuDeOption = { ma_chu_de: string; ten_chu_de: string; soDang: number }
export async function listChuDeOptions(mon: KhoMon, khoi: string): Promise<ChuDeOption[]> {
  const { banDoTbl } = khoTbls(mon)
  const { data, error } = await supabase.from(banDoTbl).select('ma_chu_de, ten_chu_de').eq('khoi', khoi).limit(LIMIT)
  if (error) throw error
  const m = new Map<string, ChuDeOption>()
  for (const r of (data ?? []) as any[]) {
    const c = m.get(r.ma_chu_de) ?? { ma_chu_de: r.ma_chu_de, ten_chu_de: r.ten_chu_de, soDang: 0 }
    c.soDang++; m.set(r.ma_chu_de, c)
  }
  return [...m.values()].sort((a, b) => a.ma_chu_de.localeCompare(b.ma_chu_de))
}

// Dạng ứng viên TRONG 1 chủ đề (candidate cho classify + chip). Kèm mo_ta_ngan (grounded, ~0 token biên).
export type DangCandidate = { ma_dang: string; ten_dang: string; ma_chuyen_de: string; ten_chuyen_de: string; mo_ta_ngan: string | null }
export async function listDangByChuDe(mon: KhoMon, khoi: string, maChuDe: string): Promise<DangCandidate[]> {
  const { banDoTbl } = khoTbls(mon)
  const { data, error } = await supabase.from(banDoTbl)
    .select('ma_dang, ten_dang, ma_chuyen_de, ten_chuyen_de, mo_ta_ngan')
    .eq('khoi', khoi).eq('ma_chu_de', maChuDe).order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({ ma_dang: r.ma_dang, ten_dang: r.ten_dang, ma_chuyen_de: r.ma_chuyen_de, ten_chuyen_de: r.ten_chuyen_de, mo_ta_ngan: r.mo_ta_ngan ?? null }))
}

// Lý thuyết 1 dạng (RAG cho verify + AI-giải). '' nếu chưa có.
export async function getDangLyThuyet(mon: KhoMon, maDang: string): Promise<string> {
  const { lyThuyetTbl } = khoTbls(mon)
  const { data, error } = await supabase.from(lyThuyetTbl).select('noi_dung').eq('ma_dang', maDang).limit(1)
  if (error) throw error
  return String((data?.[0] as any)?.noi_dung ?? '').trim()
}

// ── Bóc 1 pass (schema HỢP NHẤT): loai_cau + de_bai + dap_an? + lua_chon? + menh_de? + hình ──
const KHO_MENHDE_SCHEMA = { type: 'OBJECT', properties: {
  noi_dung: { type: 'STRING' }, dap_an: { type: 'STRING', description: "'D' nếu mệnh đề ĐÚNG, 'S' nếu SAI." }, loi_giai: { type: 'STRING' },
}, required: ['noi_dung', 'dap_an'] }
export const INGEST_KHO_SCHEMA = { type: 'OBJECT', properties: { cau: { type: 'ARRAY', items: {
  type: 'OBJECT', properties: {
    loai_cau: { type: 'STRING', description: "'trac_nghiem' | 'dung_sai' | 'tra_loi_ngan' | 'tu_luan'" },
    de_bai: { type: 'STRING', description: 'Đề bài (đúng/sai: đề CHUNG). GIỮ bố cục nhiều dòng bằng ký tự xuống dòng.' },
    dap_an: { type: 'STRING' },
    lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
    menh_de: { type: 'ARRAY', items: KHO_MENHDE_SCHEMA },
    loi_giai: { type: 'STRING', description: 'Lời giải chi tiết, mỗi bước 1 dòng.' },
    co_hinh: { type: 'BOOLEAN' }, box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' } },
  }, required: ['loai_cau', 'de_bai'],
} } }, required: ['cau'] }
export function buildKhoIngestPrompt(a: { tenChuDe?: string; giaiAI?: boolean }): string {
  return [
    'Đây là ẢNH 1 TRANG tài liệu toán. TÁCH thành từng CÂU theo thứ tự xuất hiện (mỗi bài = 1 câu, KHÔNG tách ý a/b/c thành nhiều câu).',
    a.tenChuDe ? `Bối cảnh: tài liệu thuộc chủ đề "${a.tenChuDe}".` : '',
    'MỖI câu tự nhận diện "loai_cau" ∈ { trac_nghiem, dung_sai, tra_loi_ngan, tu_luan } và bóc đúng cấu trúc:',
    '- trac_nghiem (4 phương án A/B/C/D): "de_bai" = đề dẫn (KHÔNG kèm A./B./C./D.); "lua_chon" = mảng 4 nội dung phương án; "dap_an" = CHỮ CÁI đúng.',
    '- dung_sai (Phần 2: 1 đề chung + 4 mệnh đề a/b/c/d): "de_bai" = đề CHUNG; "menh_de" = mảng ĐÚNG 4 phần tử { noi_dung, dap_an ("D"|"S"), loi_giai }; để "lua_chon" trống.',
    '- tra_loi_ngan / tu_luan: "de_bai" = toàn bộ đề; "dap_an" = kết quả (nếu có); để "lua_chon"/"menh_de" trống.',
    '⚠ MỖI câu thêm "co_hinh" (true nếu có HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ/BẢNG BIẾN THIÊN/BẢNG XÉT DẤU cần giữ làm ảnh) và "box_hinh" = [ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0–1000 ôm trọn hình (chỉ khi co_hinh=true, không thì null).',
    '⚠ BẢNG BIẾN THIÊN / BẢNG XÉT DẤU (có mũi tên ↗↘, dòng x · y′ · y, dấu ∞) = KHÔNG viết LaTeX cho đúng được → BẮT BUỘC coi là HÌNH: đặt co_hinh=true + box_hinh ôm trọn bảng, trong de_bai chỉ ghi "[bảng biến thiên]" đúng vị trí (KHÔNG cố dựng bằng \\begin{array}).',
    'CHỈ bảng SỐ LIỆU thuần (không mũi tên, không biến thiên) mới viết LaTeX $\\begin{array}{…}…\\end{array}$ trong de_bai (không coi là hình).',
    giaiRule(a.giaiAI),
    FMT_RULES,
    'Trả JSON: { "cau": [ { "loai_cau":"…", "de_bai":"…", "dap_an":"…", "lua_chon":[…], "menh_de":[…], "loi_giai":"…", "co_hinh":false, "box_hinh":null } ] }',
  ].filter(Boolean).join('\n')
}
export type KhoIngestMenhDe = { noi_dung: string; dap_an: 'D' | 'S'; loi_giai: string | null }
export type KhoIngestCau = { loai_cau: LoaiCau; noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null; menh_de: KhoIngestMenhDe[] | null; coHinh: boolean; box: [number, number, number, number] | null }
const LOAI_HOP_LE = new Set<LoaiCau>(['trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan'])
export function parseKhoIngestJson(text: string): KhoIngestCau[] {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau ?? obj.cau_hoi ?? [])
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau": [ … ] }.')
  return arr.filter((x: any) => x?.de_bai || x?.noi_dung).map((x: any): KhoIngestCau => {
    let loai = String(x.loai_cau ?? 'tu_luan').trim() as LoaiCau
    if (!LOAI_HOP_LE.has(loai)) loai = Array.isArray(x.menh_de) && x.menh_de.length ? 'dung_sai' : Array.isArray(x.lua_chon) && x.lua_chon.length ? 'trac_nghiem' : 'tu_luan'
    const lua_chon = Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map(String) : null
    let noi_dung = stripYCon(stripCauLabel(String(x.de_bai ?? x.noi_dung ?? '').trim()))
    if (loai === 'trac_nghiem' && lua_chon) noi_dung = stripEmbeddedOpts(noi_dung)
    const menh_de = loai === 'dung_sai' && Array.isArray(x.menh_de)
      ? x.menh_de.slice(0, 4).map((m: any): KhoIngestMenhDe => ({ noi_dung: String(m.noi_dung ?? '').trim(), dap_an: String(m.dap_an ?? 'D').trim().toUpperCase().startsWith('S') ? 'S' : 'D', loi_giai: String(m.loi_giai ?? '').trim() || null })).filter((m: KhoIngestMenhDe) => m.noi_dung)
      : null
    return {
      loai_cau: loai, noi_dung,
      dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
      loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? stripYCon(String(x.loi_giai).trim()) : null,
      lua_chon: loai === 'dung_sai' ? null : lua_chon,
      menh_de,
      coHinh: !!x.co_hinh,
      box: Array.isArray(x.box_hinh) && x.box_hinh.length === 4 ? (x.box_hinh.map(Number) as [number, number, number, number]) : null,
    }
  })
}

// ── BÓC ĐỀ THI (DeThiScreen — thêm de_meta trang đầu + phan_goi_y mỗi câu so với INGEST_KHO_SCHEMA ở
// trên; KHÔNG đụng INGEST_KHO_SCHEMA/buildKhoIngestPrompt/parseKhoIngestJson đang dùng ở NhapKhoScreen,
// đúng convention đã có sẵn kiểu buildDungSaiIngestPrompt/DUNGSAI_SCHEMA riêng cho DungSaiBank). ──
export type DeThiIngestMeta = { nguon: string | null; nam: number | null; cap: string | null; thoiGianPhut: number | null; thangDiem: number | null }
const DETHI_META_SCHEMA = { type: 'OBJECT', properties: {
  nguon: { type: 'STRING', description: 'Tên trường/sở ra đề' }, nam: { type: 'NUMBER', description: 'Năm học/năm thi' },
  cap: { type: 'STRING', description: "vd 'vào 10', 'thi thử', 'học kỳ 1'" },
  thoi_gian_phut: { type: 'NUMBER' }, thang_diem: { type: 'NUMBER' },
} }
export const DETHI_INGEST_SCHEMA = { type: 'OBJECT', properties: {
  de_meta: DETHI_META_SCHEMA,
  cau: { type: 'ARRAY', items: {
    type: 'OBJECT', properties: {
      loai_cau: { type: 'STRING', description: "'trac_nghiem' | 'dung_sai' | 'tra_loi_ngan' | 'tu_luan'" },
      stt_goc: { type: 'NUMBER', description: 'Số thứ tự "Câu N." IN TRÊN TRANG (đọc đúng số gốc, TRƯỚC khi hệ tự đánh số lại) — để trống nếu đề không đánh số câu.' },
      phan_goi_y: { type: 'STRING', description: 'Tiêu đề PHẦN đang thấy ngay TRÊN câu này trong đề (vd "Phần I. Trắc nghiệm") — để trống nếu đề không chia phần rõ.' },
      de_bai: { type: 'STRING', description: 'Đề bài (đúng/sai: đề CHUNG). GIỮ bố cục nhiều dòng bằng ký tự xuống dòng.' },
      dap_an: { type: 'STRING' },
      lua_chon: { type: 'ARRAY', items: { type: 'STRING' } },
      menh_de: { type: 'ARRAY', items: KHO_MENHDE_SCHEMA },
      loi_giai: { type: 'STRING', description: 'Lời giải chi tiết, mỗi bước 1 dòng.' },
      co_hinh: { type: 'BOOLEAN' }, box_hinh: { type: 'ARRAY', items: { type: 'NUMBER' } },
    }, required: ['loai_cau', 'de_bai'],
  } },
}, required: ['cau'] }
export function buildDeThiIngestPrompt(a: { trangDau: boolean; chuan?: boolean; giaiAI?: boolean }): string {
  return [
    'Đây là ẢNH 1 TRANG đề thi. TÁCH thành từng CÂU theo thứ tự xuất hiện (mỗi bài = 1 câu, KHÔNG tách ý a/b/c thành nhiều câu).',
    a.trangDau
      ? '⚠ ĐÂY LÀ TRANG ĐẦU đề thi — đọc PHẦN HEADER (tên trường/sở ra đề, năm học/năm thi, cấp/kỳ thi, thời gian làm bài (phút), thang điểm) → điền vào "de_meta". Để trống field nào không thấy, KHÔNG bịa.'
      : '(Không phải trang đầu — để "de_meta" trống/bỏ qua.)',
    a.chuan
      ? '⚠⚠ ĐỀ NÀY CÓ CẤU TRÚC CHUẨN CỐ ĐỊNH, ĐÚNG 22 CÂU: Câu 1–12 = TRẮC NGHIỆM (Phần I), Câu 13–16 = ĐÚNG/SAI (Phần II, mỗi câu 1 đề chung + 4 mệnh đề a/b/c/d), Câu 17–22 = TRẢ LỜI NGẮN (Phần III). Dùng ĐÚNG số thứ tự "Câu N." in trên trang để xác định câu đó thuộc loại nào theo cấu trúc này — ĐỪNG tự đoán loại câu khác đi trừ khi số thứ tự không khớp mốc nào ở trên.'
      : '',
    'MỖI câu thêm "stt_goc" = số thứ tự "Câu N." IN TRÊN TRANG (đọc đúng số gốc — KHÔNG tự đánh số lại); để trống nếu đề không đánh số câu.',
    'MỖI câu thêm "phan_goi_y" = tiêu đề PHẦN đang thấy NGAY TRÊN câu này trong đề (vd "Phần I. Trắc nghiệm", "PHẦN II. TỰ LUẬN") — giữ NGUYÊN VĂN tiêu đề đề gốc; để trống nếu đề không chia phần / không thấy tiêu đề nào mới kể từ câu trước.',
    'MỖI câu tự nhận diện "loai_cau" ∈ { trac_nghiem, dung_sai, tra_loi_ngan, tu_luan } và bóc đúng cấu trúc:',
    '- trac_nghiem (4 phương án A/B/C/D): "de_bai" = đề dẫn (KHÔNG kèm A./B./C./D.); "lua_chon" = mảng 4 nội dung phương án; "dap_an" = CHỮ CÁI đúng.',
    '- dung_sai (đề chung + 4 mệnh đề a/b/c/d): "de_bai" = đề CHUNG; "menh_de" = mảng ĐÚNG 4 phần tử { noi_dung, dap_an ("D"|"S"), loi_giai }; để "lua_chon" trống.',
    '- tra_loi_ngan / tu_luan: "de_bai" = toàn bộ đề; "dap_an" = kết quả (nếu có); để "lua_chon"/"menh_de" trống.',
    '⚠ MỖI câu thêm "co_hinh" (true nếu có HÌNH VẼ/SƠ ĐỒ/ĐỒ THỊ/BẢNG BIẾN THIÊN/BẢNG XÉT DẤU cần giữ làm ảnh) và "box_hinh" = [ymin,xmin,ymax,xmax] toạ độ CHUẨN HOÁ 0–1000 ôm trọn hình (chỉ khi co_hinh=true, không thì null).',
    'BẢNG BIẾN THIÊN / BẢNG XÉT DẤU (mũi tên ↗↘, dòng x·y′·y, dấu ∞) = BẮT BUỘC coi là HÌNH (co_hinh=true), trong de_bai chỉ ghi "[bảng biến thiên]" đúng vị trí.',
    'CHỈ bảng SỐ LIỆU thuần mới viết LaTeX $\\begin{array}{…}…\\end{array}$ trong de_bai (không coi là hình).',
    giaiRule(a.giaiAI),
    FMT_RULES,
    'Trả JSON: { "de_meta": { "nguon":"…", "nam":0, "cap":"…", "thoi_gian_phut":0, "thang_diem":0 }, "cau": [ { "loai_cau":"…", "stt_goc":0, "phan_goi_y":"…", "de_bai":"…", "dap_an":"…", "lua_chon":[…], "menh_de":[…], "loi_giai":"…", "co_hinh":false, "box_hinh":null } ] }',
  ].filter(Boolean).join('\n')
}
export type DeThiIngestCau = KhoIngestCau & { phanGoiY: string | null; sttGoc: number | null }
export function parseDeThiIngestJson(text: string): { meta: Partial<DeThiIngestMeta>; caus: DeThiIngestCau[] } {
  let t = text.trim(); const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (fence) t = fence[1].trim()
  let obj: any; try { obj = lenientJsonParse(t) } catch (e: any) { throw new Error('JSON không hợp lệ: ' + e.message) }
  const arr = Array.isArray(obj) ? obj : (obj.cau ?? obj.cau_hoi ?? [])
  if (!Array.isArray(arr)) throw new Error('Cần JSON dạng { "cau": [ … ] }.')
  const dm = obj.de_meta ?? {}
  const meta: Partial<DeThiIngestMeta> = {
    nguon: dm.nguon != null && String(dm.nguon).trim() ? String(dm.nguon).trim() : null,
    nam: Number.isFinite(Number(dm.nam)) && Number(dm.nam) > 0 ? Number(dm.nam) : null,
    cap: dm.cap != null && String(dm.cap).trim() ? String(dm.cap).trim() : null,
    thoiGianPhut: Number.isFinite(Number(dm.thoi_gian_phut)) && Number(dm.thoi_gian_phut) > 0 ? Number(dm.thoi_gian_phut) : null,
    thangDiem: Number.isFinite(Number(dm.thang_diem)) && Number(dm.thang_diem) > 0 ? Number(dm.thang_diem) : null,
  }
  const caus: DeThiIngestCau[] = arr.filter((x: any) => x?.de_bai || x?.noi_dung).map((x: any): DeThiIngestCau => {
    let loai = String(x.loai_cau ?? 'tu_luan').trim() as LoaiCau
    if (!LOAI_HOP_LE.has(loai)) loai = Array.isArray(x.menh_de) && x.menh_de.length ? 'dung_sai' : Array.isArray(x.lua_chon) && x.lua_chon.length ? 'trac_nghiem' : 'tu_luan'
    const lua_chon = Array.isArray(x.lua_chon) && x.lua_chon.length ? x.lua_chon.map(String) : null
    let noi_dung = stripYCon(stripCauLabel(String(x.de_bai ?? x.noi_dung ?? '').trim()))
    if (loai === 'trac_nghiem' && lua_chon) noi_dung = stripEmbeddedOpts(noi_dung)
    const menh_de = loai === 'dung_sai' && Array.isArray(x.menh_de)
      ? x.menh_de.slice(0, 4).map((m: any): KhoIngestMenhDe => ({ noi_dung: String(m.noi_dung ?? '').trim(), dap_an: String(m.dap_an ?? 'D').trim().toUpperCase().startsWith('S') ? 'S' : 'D', loi_giai: String(m.loi_giai ?? '').trim() || null })).filter((m: KhoIngestMenhDe) => m.noi_dung)
      : null
    return {
      loai_cau: loai, noi_dung, phanGoiY: x.phan_goi_y != null && String(x.phan_goi_y).trim() ? String(x.phan_goi_y).trim() : null,
      sttGoc: Number.isFinite(Number(x.stt_goc)) && Number(x.stt_goc) > 0 ? Number(x.stt_goc) : null,
      dap_an: x.dap_an != null && String(x.dap_an).trim() ? String(x.dap_an).trim() : null,
      loi_giai: x.loi_giai != null && String(x.loi_giai).trim() ? stripYCon(String(x.loi_giai).trim()) : null,
      lua_chon: loai === 'dung_sai' ? null : lua_chon,
      menh_de,
      coHinh: !!x.co_hinh,
      box: Array.isArray(x.box_hinh) && x.box_hinh.length === 4 ? (x.box_hinh.map(Number) as [number, number, number, number]) : null,
    }
  })
  return { meta, caus }
}

// ── PHÂN LOẠI DẠNG (grounded theo chủ đề, 1 call/lô) → { ma_dang, confidence, ma_dang_2 } ──
export type ClassifyResult = { ma_dang: string | null; confidence: number; ma_dang_2: string | null }
const CLASSIFY_SCHEMA = { type: 'OBJECT', properties: { ket_qua: { type: 'ARRAY', items: {
  type: 'OBJECT', properties: { index: { type: 'NUMBER' }, ma_dang: { type: 'STRING' }, confidence: { type: 'NUMBER' }, ma_dang_2: { type: 'STRING' } }, required: ['index', 'ma_dang', 'confidence'],
} } }, required: ['ket_qua'] }
export function buildClassifyPrompt(caus: string[], cands: DangCandidate[]): string {
  const ds = cands.map((d) => `${d.ma_dang} | ${d.ten_dang} | Chuyên đề: ${d.ten_chuyen_de}${d.mo_ta_ngan ? ` | ${d.mo_ta_ngan}` : ''}`).join('\n')
  const qs = caus.map((c, i) => `[${i}] ${c.slice(0, 400)}`).join('\n')
  return [
    'Bạn là chuyên gia phân loại câu hỏi Toán theo BẢN ĐỒ KIẾN THỨC. Với MỖI câu, chọn MÃ DẠNG phù hợp nhất trong danh sách (chỉ trong danh sách này).',
    'DANH SÁCH DẠNG (ma_dang | tên | chuyên đề | định nghĩa):', ds,
    'CÁC CÂU:', qs,
    'Với mỗi câu trả: index, ma_dang (phù hợp nhất), confidence (0.0–1.0, độ chắc chắn), ma_dang_2 (ứng viên hợp lý thứ nhì — để trống nếu không có).',
    'Trả JSON: { "ket_qua": [ { "index":0, "ma_dang":"…", "confidence":0.0, "ma_dang_2":"…" } ] }',
  ].join('\n')
}
export async function classifyDang(caus: string[], cands: DangCandidate[], model?: string): Promise<ClassifyResult[]> {
  const out: ClassifyResult[] = caus.map(() => ({ ma_dang: null, confidence: 0, ma_dang_2: null }))
  if (!caus.length || !cands.length) return out
  const text = await callGeminiJson(buildClassifyPrompt(caus, cands), { model, think: 0, schema: CLASSIFY_SCHEMA })
  let obj: any; try { obj = lenientJsonParse(text.replace(/```(?:json)?|```/g, '').trim()) } catch { return out }
  const valid = new Set(cands.map((c) => c.ma_dang))
  for (const r of (obj?.ket_qua ?? []) as any[]) {
    const i = Number(r.index)
    if (!Number.isInteger(i) || i < 0 || i >= out.length) continue
    const ma = valid.has(String(r.ma_dang)) ? String(r.ma_dang) : null
    const ma2 = valid.has(String(r.ma_dang_2)) ? String(r.ma_dang_2) : null
    out[i] = { ma_dang: ma, confidence: Math.max(0, Math.min(1, Number(r.confidence) || 0)), ma_dang_2: ma2 }
  }
  return out
}

// ── VERIFY 1 câu (CHỈ chạy cho confidence thấp) bằng LÝ THUYẾT dạng → { khop, ma_dang_dung } ──
export type VerifyResult = { khop: boolean; ma_dang_dung: string | null; ghi_chu: string | null }
const VERIFY_SCHEMA = { type: 'OBJECT', properties: { khop: { type: 'BOOLEAN' }, ma_dang_dung: { type: 'STRING' }, ghi_chu: { type: 'STRING' } }, required: ['khop'] }
export async function verifyDangByLyThuyet(deBai: string, dangHienTai: DangCandidate, lyThuyet: string, cands: DangCandidate[], model?: string): Promise<VerifyResult> {
  if (!lyThuyet.trim()) return { khop: true, ma_dang_dung: null, ghi_chu: 'chưa có lý thuyết' } // không có lý thuyết → không chặn
  const ds = cands.map((d) => `${d.ma_dang} | ${d.ten_dang}`).join('\n')
  const prompt = [
    `Kiểm tra: câu hỏi dưới có ĐÚNG thuộc dạng "${dangHienTai.ten_dang}" (mã ${dangHienTai.ma_dang}) không, dựa trên ĐỊNH NGHĨA/LÝ THUYẾT của dạng đó.`,
    'LÝ THUYẾT DẠNG:', lyThuyet.slice(0, 4000),
    'CÂU HỎI:', deBai.slice(0, 800),
    'Nếu khớp → khop=true. Nếu KHÔNG khớp → khop=false, chọn ma_dang_dung phù hợp hơn trong danh sách:', ds,
    'Trả JSON: { "khop": true, "ma_dang_dung": "…", "ghi_chu": "…" }',
  ].join('\n')
  const text = await callGeminiJson(prompt, { model, think: 1024, schema: VERIFY_SCHEMA })
  let obj: any; try { obj = lenientJsonParse(text.replace(/```(?:json)?|```/g, '').trim()) } catch { return { khop: true, ma_dang_dung: null, ghi_chu: null } }
  const valid = new Set(cands.map((c) => c.ma_dang))
  const dung = valid.has(String(obj?.ma_dang_dung)) ? String(obj.ma_dang_dung) : null
  return { khop: !!obj?.khop, ma_dang_dung: dung, ghi_chu: String(obj?.ghi_chu ?? '').trim() || null }
}

// ── AI GIẢI 1 câu — ĐỌC lý thuyết dạng TRƯỚC (RAG), lời giải = nguon_giai 'ai' (cần duyệt) ──
const GIAI_SCHEMA = { type: 'OBJECT', properties: { loi_giai: { type: 'STRING' } }, required: ['loi_giai'] }
export async function aiGiaiCau(item: { noi_dung: string; loai_cau: string; dap_an: string | null; lua_chon: string[] | null }, lyThuyet: string, model?: string): Promise<string> {
  const prompt = [
    'Bạn là giáo viên Toán. HÃY GIẢI câu dưới, BÁM theo LÝ THUYẾT/PHƯƠNG PHÁP của dạng (nếu có) — trình bày từng bước, đúng & gọn.',
    lyThuyet.trim() ? '⚠ Đọc kỹ LÝ THUYẾT DẠNG rồi mới giải, dùng đúng phương pháp/ký hiệu của dạng:\n' + lyThuyet.slice(0, 4000) : '(Dạng chưa có lý thuyết — giải theo kiến thức chuẩn.)',
    'CÂU HỎI:', item.noi_dung,
    item.lua_chon?.length ? 'Phương án: ' + item.lua_chon.map((o, k) => `${'ABCD'[k]}. ${o}`).join(' | ') : '',
    item.dap_an ? `Đáp án đúng: ${item.dap_an} → giải thích để RA đúng đáp án này.` : '',
    FMT_RULES,
    'Trả JSON: { "loi_giai": "…" }',
  ].filter(Boolean).join('\n')
  const text = await callGeminiJson(prompt, { model, think: 8192, schema: GIAI_SCHEMA })
  let obj: any; try { obj = lenientJsonParse(text.replace(/```(?:json)?|```/g, '').trim()) } catch { return '' }
  return stripYCon(String(obj?.loi_giai ?? '').trim())
}

// ── LƯU 1 câu vào ĐÚNG dạng của nó (mỗi câu 1 dạng riêng) → trả ma_cau ──
export async function saveCauToDang(a: { dangChinh: string; loaiCau: string; noi_dung: string; dap_an: string | null; loi_giai: string | null; lua_chon: string[] | null; anh_de: string | null; anh_dap_an: string | null; nguon_giai: string }, tbl: string): Promise<string> {
  const seq = await nextCauSeq(a.dangChinh, tbl)
  const c = await createCau({
    ma_cau: maCau(a.dangChinh, seq), dang_chinh: a.dangChinh, loai_cau: a.loaiCau,
    noi_dung: a.noi_dung, dap_an: a.dap_an, loi_giai: a.loi_giai, lua_chon: a.lua_chon ?? null,
    anh_de: a.anh_de ?? null, anh_dap_an: a.anh_dap_an ?? null, nguon: 'le', nguon_giai: a.nguon_giai,
  }, tbl)
  return c.ma_cau
}

// ── LOG gán dạng (precision@1 + nguồn vòng-học) — ghi lúc đẩy kho ──
export type TagLogRow = { mon: KhoMon; ma_cau: string | null; loai_field?: string; ai_value: string | null; final_value: string | null; ai_confidence?: number | null; da_verify?: boolean }
export async function logKhoTag(rows: TagLogRow[]): Promise<void> {
  if (!rows.length) return
  const { error } = await supabase.from('kho_tag_log').insert(rows.map((r) => ({
    mon: r.mon, ma_cau: r.ma_cau, loai_field: r.loai_field ?? 'dang',
    ai_value: r.ai_value, final_value: r.final_value, ai_confidence: r.ai_confidence ?? null, da_verify: r.da_verify ?? false,
  })))
  if (error) throw error
}
// precision@1 = (final = ai) / (tổng câu AI có đề xuất), field 'dang'.
export async function khoTagPrecision(mon: KhoMon): Promise<{ dung: number; tong: number; pct: number }> {
  const { data, error } = await supabase.from('kho_tag_log').select('ai_value, final_value').eq('mon', mon).eq('loai_field', 'dang').not('ai_value', 'is', null).limit(LIMIT)
  if (error) throw error
  const rows = (data ?? []) as { ai_value: string; final_value: string }[]
  const tong = rows.length
  const dung = rows.filter((r) => r.ai_value === r.final_value).length
  return { dung, tong, pct: tong ? Math.round((dung / tong) * 100) : 0 }
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

// #câu theo dạng — ĐẾM Ở POSTGRES (RPC count_cau_by_dang, mig 0062, trả 1 dòng jsonb).
// KHÔNG group ở client nữa: fetch mọi câu bị PostgREST cap max-rows (~1000) → kho >1000 câu đếm CỤT → thẻ "0/50".
export async function countCauByDang(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('count_cau_by_dang', { p_tbl: 'dai_cau_hoi' })
  if (error) throw error
  return (data ?? {}) as Record<string, number>
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

// ── KHTN: bản đồ (clone shape Đại, bảng khtn_*) — 1 cây Chủ-đề→Chuyên-đề→Dạng, KHÔNG nhánh ──
export async function listKhtnMap(khoi: string): Promise<MapRow[]> {
  const { data, error } = await supabase.from('khtn_ban_do').select('*')
    .eq('khoi', khoi).order('ma_chu_de').order('ma_chuyen_de').order('ma_dang').limit(LIMIT)
  if (error) throw error
  return (data ?? []).map((r: any) => ({
    leafMa: r.ma_dang, khoi: r.khoi, t1Ma: r.ma_chu_de, t1Ten: r.ten_chu_de,
    t2Ma: r.ma_chuyen_de, t2Ten: r.ten_chuyen_de, leafTen: r.ten_dang, bac: r.bac_toi_thieu, mucDo: r.muc_do,
  }))
}
export async function createKhtnMap(row: MapRow): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').insert({
    ma_dang: row.leafMa, khoi: row.khoi, ma_chu_de: row.t1Ma, ten_chu_de: row.t1Ten,
    ma_chuyen_de: row.t2Ma, ten_chuyen_de: row.t2Ten, ten_dang: row.leafTen, muc_do: row.mucDo ?? 3, bac_toi_thieu: row.bac,
  })
  if (error) throw error
}
export async function updateKhtnLeaf(leafMa: string, patch: { leafTen: string; bac: string; mucDo: number | null }): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').update({ ten_dang: patch.leafTen, bac_toi_thieu: patch.bac, muc_do: patch.mucDo ?? undefined }).eq('ma_dang', leafMa)
  if (error) throw error
}
export const deleteKhtnLeaf = async (leafMa: string) => { const { error } = await supabase.from('khtn_ban_do').delete().eq('ma_dang', leafMa); if (error) throw error }
export async function deleteKhtnLeaves(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error } = await supabase.from('khtn_ban_do').delete().in('ma_dang', leafMas); if (error) throw error
}
export async function deleteKhtnCum(leafMas: string[]): Promise<void> {
  if (!leafMas.length) return
  const { error: e1 } = await supabase.from('khtn_cau_hoi').delete().in('dang_chinh', leafMas); if (e1) throw e1
  const { error: e2 } = await supabase.from('khtn_ban_do').delete().in('ma_dang', leafMas); if (e2) throw e2
}
export async function renameKhtnChuDe(khoi: string, maChuDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').update({ ten_chu_de: ten }).eq('khoi', khoi).eq('ma_chu_de', maChuDe); if (error) throw error
}
export async function renameKhtnChuyenDe(maChuyenDe: string, ten: string): Promise<void> {
  const { error } = await supabase.from('khtn_ban_do').update({ ten_chuyen_de: ten }).eq('ma_chuyen_de', maChuyenDe); if (error) throw error
}
export async function countCauByDangKhtn(): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc('count_cau_by_dang', { p_tbl: 'khtn_cau_hoi' })
  if (error) throw error
  return (data ?? {}) as Record<string, number>
}
export async function listKhtnLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('khtn_dang_ly_thuyet').select('*').limit(LIMIT); if (error) throw error
  const m: Record<string, LyThuyet> = {}; for (const r of data ?? []) { const x = r as any; m[x.ma_dang] = { noi_dung: x.noi_dung ?? '', file_url: x.file_url, ten_file: x.ten_file, cap_nhat_at: x.cap_nhat_at } } return m
}
export async function upsertKhtnLyThuyet(ma_dang: string, noi_dung: string, file_url: string | null, ten_file: string | null): Promise<void> {
  const { error } = await supabase.from('khtn_dang_ly_thuyet').upsert({ ma_dang, noi_dung, file_url, ten_file }, { onConflict: 'ma_dang' }); if (error) throw error
}
export async function deleteKhtnLyThuyet(ma_dang: string): Promise<void> {
  const { error } = await supabase.from('khtn_dang_ly_thuyet').delete().eq('ma_dang', ma_dang); if (error) throw error
}
export async function listKhtnChuyenDeLyThuyet(): Promise<Record<string, LyThuyet>> {
  const { data, error } = await supabase.from('khtn_chuyen_de_ly_thuyet').select('*').limit(LIMIT); if (error) throw error
  const m: Record<string, LyThuyet> = {}; for (const r of data ?? []) { const x = r as any; m[x.ma_chuyen_de] = { noi_dung: x.noi_dung ?? '', file_url: x.file_url, ten_file: x.ten_file, khong_can: x.khong_can ?? false, cap_nhat_at: x.cap_nhat_at } } return m
}
export async function upsertKhtnChuyenDeLyThuyet(ma_chuyen_de: string, noi_dung: string, file_url: string | null, ten_file: string | null, khong_can = false): Promise<void> {
  const { error } = await supabase.from('khtn_chuyen_de_ly_thuyet').upsert({ ma_chuyen_de, noi_dung, file_url, ten_file, khong_can }, { onConflict: 'ma_chuyen_de' }); if (error) throw error
}
export async function deleteKhtnChuyenDeLyThuyet(ma_chuyen_de: string): Promise<void> {
  const { error } = await supabase.from('khtn_chuyen_de_ly_thuyet').delete().eq('ma_chuyen_de', ma_chuyen_de); if (error) throw error
}
