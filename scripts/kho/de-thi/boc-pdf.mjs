// ============================================================================
// boc-pdf.mjs — BÓC 1 đề thi khuôn Bộ (3 phần) từ file CHỈ CÓ PDF ra `de.json` (spec-de-thi.md §10.8, lát D).
//
//   node scripts/kho/de-thi/boc-pdf.mjs "<file.pdf>" --ra <thư mục làm việc> --khoi 12 [--model gemini-2.5-flash] [--dpi 150] [--dung-lai]
//
// Có bản Word ⇒ dùng boc-word.mjs (đọc thẳng, 0 AI, chính xác hơn). File này chỉ cho đề KHÔNG có Word.
//
// Phân vai (CEO 01/10): Gemini là MÁY GÕ (đọc trang → chữ + LaTeX + khung hình); Claude là người KIỂM (mở ảnh trang, so từng câu,
// sửa bằng quyet.mjs) — thay cho luồng cũ trong ERP "Gemini đọc sai là sai luôn". Vì vậy script này KHÔNG ghi DB và cố ý để lại
// đủ thứ cho bước kiểm:  <ra>/trang/p-NN.png (ảnh từng trang) · <ra>/lop-chu.txt (lớp chữ PDF nếu có) · <ra>/gemini-boc.json +
// gemini-muc-luc.json (nguyên văn 2 lượt đọc) · <ra>/boc-pdf.bao-cao.json · cảnh báo ghi thẳng vào từng câu của de.json.
//
// Hai lượt Gemini ĐỘC LẬP nhiệm vụ, máy so chéo (không tin một lượt):
//   1. BÓC   — chép từng câu: nội dung, phương án / mệnh đề, đáp án NẾU file thể hiện, lời giải nếu có, khung hình.
//   2. MỤC LỤC — chỉ đếm: mỗi phần mấy câu, câu nào ở trang nào, đáp án đọc từ bảng đáp án / chỗ đánh dấu.
//   Lệch số câu / lệch đáp án giữa 2 lượt ⇒ cảnh báo. PDF có lớp chữ ⇒ so thêm chữ từng câu với lớp chữ (nhân chứng không-AI).
// KHÔNG tự giải: file không thể hiện đáp án ⇒ để trống.
// Hình: cắt thẳng từ PDF bằng `pdftoppm -x -y -W -H` theo khung Gemini trả (không cần thư viện ảnh). Khung sai ⇒ Claude sửa `box`
// trong gemini-boc.json rồi chạy lại với --dung-lai (không gọi lại Gemini, không tốn tiền).
// ============================================================================
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename, join, resolve } from 'node:path'
import { bien } from '../cau-hinh.mjs'

const args = process.argv.slice(2)
const lay = (k, md) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : md }
const CO_GIA_TRI = new Set(['--ra', '--khoi', '--model', '--dpi'])
const tep = args.find((a, i) => !a.startsWith('--') && !CO_GIA_TRI.has(args[i - 1]))
const RA = lay('--ra'), KHOI = lay('--khoi'), DPI = Number(lay('--dpi', '150')), DUNG_LAI = args.includes('--dung-lai')
const MODEL = lay('--model', bien('VITE_GEMINI_MODEL')?.gia_tri ?? 'gemini-2.5-flash')
if (!tep || !RA || !KHOI) { console.error('Dùng: node scripts/kho/de-thi/boc-pdf.mjs "<file.pdf>" --ra <thư mục làm việc> --khoi 12 [--model …] [--dpi 150] [--dung-lai]'); process.exit(2) }
if (!existsSync(tep)) { console.error('❌ Không thấy file: ' + tep); process.exit(2) }
mkdirSync(join(RA, 'trang'), { recursive: true }); mkdirSync(join(RA, 'img'), { recursive: true })

// ── 0) chép file gốc + vân tay ───────────────────────────────────────────────
const buf = readFileSync(tep)
const sha256 = createHash('sha256').update(buf).digest('hex')
const goc = join(RA, 'goc.pdf')
if (resolve(tep) !== resolve(goc)) copyFileSync(tep, goc)
if (buf.length > 18 * 1024 * 1024) { console.error('❌ PDF > 18 MB — vượt mức gửi thẳng cho Gemini. Tách file hoặc giảm chất lượng scan rồi chạy lại.'); process.exit(2) }

// ── 1) ảnh trang + lớp chữ (poppler) ─────────────────────────────────────────
function chay(lenh, ts) { return execFileSync(lenh, ts, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }) }
if (!DUNG_LAI || !readdirSync(join(RA, 'trang')).some((f) => f.endsWith('.png'))) chay('pdftoppm', ['-r', String(DPI), '-png', goc, join(RA, 'trang', 'p')])
const trangTep = readdirSync(join(RA, 'trang')).filter((f) => /^p-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)))
const SO_TRANG = trangTep.length
const kichThuoc = trangTep.map((f) => { const b = readFileSync(join(RA, 'trang', f)); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) } }) // PNG IHDR
let lopChu = ''
try { lopChu = chay('pdftotext', ['-layout', goc, '-']) } catch { /* không có lớp chữ */ }
writeFileSync(join(RA, 'lop-chu.txt'), lopChu)
const CO_LOP_CHU = lopChu.replace(/\s/g, '').length > 40 * SO_TRANG
console.log(`${basename(tep)} · ${SO_TRANG} trang · ${(buf.length / 1024).toFixed(0)} KB · ${CO_LOP_CHU ? 'có lớp chữ' : 'PDF SCAN (không lớp chữ)'} · model ${MODEL}`)

// ── 2) Gemini ────────────────────────────────────────────────────────────────
// Tên chuẩn GEMINI_API_KEY (không VITE_ — Thùy 08/10, key AI không được nằm trong bundle trình duyệt); tên cũ vẫn nhận.
const KEY = (bien('GEMINI_API_KEY') ?? bien('VITE_GEMINI_KEY'))?.gia_tri
const S = (type, extra = {}) => ({ type, ...extra })
const SCHEMA_BOC = S('OBJECT', {
  properties: {
    ten_goi_y: S('STRING', { description: 'Tên đề như in ở đầu đề (trường / sở / kỳ thi / mã đề), không bịa' }),
    nguon: S('STRING', { description: 'Đơn vị ra đề nếu có in, không có thì chuỗi rỗng' }),
    nam: S('INTEGER', { nullable: true }),
    thoi_gian_phut: S('INTEGER', { nullable: true }),
    phan: S('ARRAY', { items: S('OBJECT', { properties: {
      thu_tu: S('INTEGER'), ten: S('STRING'), dang_thuc: S('STRING', { enum: ['trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan'] }),
    }, required: ['thu_tu', 'ten', 'dang_thuc'] }) }),
    cau: S('ARRAY', { items: S('OBJECT', { properties: {
      phan: S('INTEGER', { description: 'thu_tu của phần chứa câu' }),
      so: S('INTEGER', { description: 'số câu như in trong đề (mỗi phần đánh lại từ 1 nếu đề in vậy)' }),
      trang: S('INTEGER', { description: 'trang (từ 1) nơi đề bài của câu bắt đầu' }),
      noi_dung: S('STRING', { description: 'Đề bài nguyên văn, KHÔNG gồm chữ "Câu N.", KHÔNG gồm phương án / mệnh đề. Công thức viết LaTeX trong $...$. Chỗ đề xuống dòng thì xuống dòng thật.' }),
      lua_chon: S('ARRAY', { items: S('STRING'), description: 'Trắc nghiệm: đúng 4 phương án theo thứ tự A, B, C, D — KHÔNG kèm chữ "A." ở đầu. Loại khác: mảng rỗng.' }),
      menh_de: S('ARRAY', { items: S('OBJECT', { properties: {
        chu: S('STRING', { enum: ['a', 'b', 'c', 'd'] }), noi_dung: S('STRING'),
        dap_an: S('STRING', { enum: ['D', 'S', 'K'], description: 'D = Đúng, S = Sai — CHỈ khi file thể hiện; file KHÔNG thể hiện thì K' }),
        loi_giai: S('STRING'),
      }, required: ['chu', 'noi_dung', 'dap_an'] }), description: 'Đúng/Sai: các ý a) b) c) d). Loại khác: mảng rỗng.' }),
      dap_an: S('STRING', { description: 'Trắc nghiệm: A/B/C/D. Trả lời ngắn: đáp số như file ghi (dấu phẩy thập phân). CHỈ khi file thể hiện (bảng đáp án, gạch chân, khoanh, tô màu, "Chọn A", kết luận của lời giải). Không có ⇒ rỗng. TUYỆT ĐỐI không tự giải.' }),
      dap_an_nguon: S('STRING', { description: 'Đáp án lấy từ đâu trong file: bang_dap_an | gach_chan | khoanh | to_mau | chon_x | ket_luan_loi_giai | rỗng' }),
      loi_giai: S('STRING', { description: 'Lời giải nguyên văn nếu file có; không có ⇒ rỗng' }),
    }, required: ['phan', 'so', 'trang', 'noi_dung', 'lua_chon', 'menh_de', 'dap_an', 'dap_an_nguon', 'loi_giai'] }) }),
  },
  required: ['ten_goi_y', 'phan', 'cau'],
})
const PROMPT_BOC = `Bạn là máy CHÉP đề thi môn Toán (Việt Nam) từ file PDF sang dữ liệu có cấu trúc. Người khác sẽ kiểm lại từng chữ với ảnh trang, nên: chép NGUYÊN VĂN, không sửa câu chữ, không rút gọn, không tự giải, không bịa.

Đề theo khuôn của Bộ GD&ĐT từ 2025: PHẦN I — trắc nghiệm nhiều phương án lựa chọn (4 phương án A B C D); PHẦN II — trắc nghiệm đúng sai (mỗi câu 4 ý a) b) c) d)); PHẦN III — trắc nghiệm trả lời ngắn. Có thể có phần tự luận. Đề in thế nào thì chép thế ấy.

Quy tắc:
1. Mỗi câu của đề xuất hiện ĐÚNG MỘT LẦN trong kết quả. Nếu file in đề hai lần (phần ĐỀ, rồi phần ĐÁP ÁN / LỜI GIẢI CHI TIẾT chép lại từng câu) thì KHÔNG nhân đôi: nội dung lấy theo phần ĐỀ, còn loi_giai / dap_an lấy từ phần lời giải.
2. Mọi công thức, ký hiệu toán viết bằng LaTeX đặt trong $...$ (kể cả tên điểm, toạ độ, vectơ, hệ phương trình). Hệ phương trình dùng \\begin{cases}...\\end{cases}. Phần chữ thường để nguyên tiếng Việt có dấu.
3. noi_dung KHÔNG gồm nhãn "Câu 5." và KHÔNG gồm các phương án / mệnh đề (chúng nằm ở lua_chon / menh_de).
4. dap_an CHỈ điền khi file THỂ HIỆN đáp án (bảng đáp án cuối đề, chữ cái gạch chân / khoanh / tô màu, dòng "Chọn A", kết luận của lời giải). Ghi dap_an_nguon tương ứng. File không thể hiện ⇒ để rỗng. Không suy luận, không giải bài.
5. Hình vẽ / đồ thị / bảng biến thiên: KHÔNG mô tả, KHÔNG chép (khâu khác cắt hình). Bảng số liệu thuần chữ số thì chép thành các dòng chữ.
6. Chữ không đọc được ⇒ ghi [?] đúng chỗ đó, không đoán.`
const SCHEMA_ML = S('OBJECT', {
  properties: {
    phan: S('ARRAY', { items: S('OBJECT', { properties: {
      thu_tu: S('INTEGER'), dang_thuc: S('STRING', { enum: ['trac_nghiem', 'dung_sai', 'tra_loi_ngan', 'tu_luan'] }), so_cau: S('INTEGER'),
    }, required: ['thu_tu', 'dang_thuc', 'so_cau'] }) }),
    cau: S('ARRAY', { items: S('OBJECT', { properties: {
      phan: S('INTEGER'), so: S('INTEGER'), trang: S('INTEGER'), co_hinh: S('BOOLEAN'),
      dap_an_danh_dau: S('STRING', { description: 'Đáp án theo chỗ ĐÁNH DẤU: bảng đáp án, hoặc chữ cái phương án được gạch chân / khoanh / tô màu / in đậm khác thường. TN: A/B/C/D · Đúng/Sai: 4 ký tự D/S theo a,b,c,d · Trả lời ngắn: đáp số. Không có đánh dấu ⇒ rỗng.' }),
      dap_an_loi_giai: S('STRING', { description: 'Đáp án theo CHỮ của lời giải: dòng "Chọn A", "Đáp án: …", "a) Đúng", kết luận cuối lời giải. Cùng cách ghi như trên. Không có lời giải ⇒ rỗng.' }),
    }, required: ['phan', 'so', 'trang', 'co_hinh', 'dap_an_danh_dau', 'dap_an_loi_giai'] }) }),
    co_bang_dap_an: S('BOOLEAN'), co_loi_giai_chi_tiet: S('BOOLEAN'),
  },
  required: ['phan', 'cau', 'co_bang_dap_an', 'co_loi_giai_chi_tiet'],
})
const PROMPT_ML = `Đây là file PDF một đề thi Toán (Việt Nam). KHÔNG chép nội dung. Chỉ lập MỤC LỤC:
- Đề có những phần nào (theo thứ tự), mỗi phần thuộc loại gì và có bao nhiêu câu.
- Với từng câu: thuộc phần nào, số câu, đề bài bắt đầu ở trang nào (tính từ 1), câu có hình vẽ / đồ thị / bảng không.
- Đáp án từng câu NẾU file thể hiện, ghi RIÊNG hai nguồn và KHÔNG được lấy nguồn này điền cho nguồn kia:
  (1) dap_an_danh_dau = theo chỗ đánh dấu: bảng đáp án, hoặc chữ cái phương án bị gạch chân / khoanh / tô màu (nhìn kỹ nét gạch dưới chữ A. B. C. D.);
  (2) dap_an_loi_giai = theo chữ của lời giải: "Chọn A", "Đáp án: …", "a) Đúng", kết luận.
  Hai nguồn có thể KHÁC nhau (tác giả gõ nhầm) — cứ ghi đúng cái nhìn thấy. Câu đúng/sai ghi 4 ký tự D hoặc S theo thứ tự a, b, c, d. Không thể hiện ⇒ để rỗng. Không tự giải.
- File có bảng đáp án không, có lời giải chi tiết không.
Mỗi câu của đề chỉ liệt kê MỘT lần dù file in lại câu đó ở phần lời giải.`

async function gemini(prompt, schema, nhan, tepGui = { mime: 'application/pdf', buf }) {
  if (!KEY) throw new Error('Chưa có GEMINI_API_KEY trong .env.local')
  const body = {
    contents: [{ role: 'user', parts: [{ inline_data: { mime_type: tepGui.mime, data: tepGui.buf.toString('base64') } }, { text: prompt }] }],
    generationConfig: { temperature: 0, responseMimeType: 'application/json', responseSchema: schema, maxOutputTokens: 65536 },
  }
  for (let lan = 1; lan <= 4; lan++) {
    const t0 = Date.now()
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
    })
    if (res.status === 429 || res.status >= 500) { console.log(`  ${nhan}: HTTP ${res.status}, thử lại (${lan}/4)…`); await new Promise((r) => setTimeout(r, 4000 * lan)); continue }
    const j = await res.json()
    if (!res.ok) throw new Error(`Gemini ${nhan}: HTTP ${res.status} ${JSON.stringify(j.error ?? j).slice(0, 300)}`)
    const c = j.candidates?.[0]
    const txt = (c?.content?.parts ?? []).map((p) => p.text ?? '').join('')
    const u = j.usageMetadata ?? {}
    console.log(`  ${nhan}: ${((Date.now() - t0) / 1000).toFixed(0)} giây · token vào ${u.promptTokenCount ?? '?'} · ra ${(u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0)} · kết thúc ${c?.finishReason}`)
    if (c?.finishReason === 'MAX_TOKENS') throw new Error(`Gemini ${nhan}: câu trả lời bị CẮT (đề quá dài cho một lượt) — tách PDF theo phần rồi chạy từng file.`)
    try { return JSON.parse(txt) } catch (e) { if (lan === 4) throw new Error(`Gemini ${nhan}: JSON hỏng — ${e.message}`); console.log(`  ${nhan}: JSON hỏng, thử lại (${lan}/4)…`) }
  }
  throw new Error(`Gemini ${nhan}: hết lượt thử`)
}
async function luot(tenTep, prompt, schema, nhan) {
  const p = join(RA, tenTep)
  if (DUNG_LAI && existsSync(p)) { console.log(`  ${nhan}: dùng lại ${tenTep}`); return JSON.parse(readFileSync(p, 'utf8')) }
  const kq = await gemini(prompt, schema, nhan)
  writeFileSync(p, JSON.stringify(kq, null, 1))
  return kq
}
// Hai lượt chạy NỐI TIẾP (cùng một khoá, tránh 429)
const boc = await luot('gemini-boc.json', PROMPT_BOC, SCHEMA_BOC, 'lượt 1 BÓC')
const ml = await luot('gemini-muc-luc.json', PROMPT_ML, SCHEMA_ML, 'lượt 2 MỤC LỤC')

// ── 3) dựng de.json ──────────────────────────────────────────────────────────
const DIEM = { trac_nghiem: 0.25, dung_sai: 1, tra_loi_ngan: 0.5, tu_luan: 1 }
// Gemini hay viết xuống dòng thành HAI ký tự "\n" (gạch chéo + n) — đổi lại thành xuống dòng thật, trừ khi đó là đầu một lệnh LaTeX (\nu, \neq, \notin…)
const LENH_N = /^(nu|neq|ne|ni|notin|not|nabla|neg|newline|nmid|nparallel|nleq|ngeq|nless|ngtr|nsubseteq|nsupseteq|nsubset|nsupset|nexists|natural|nearrow|nwarrow|nRightarrow|nLeftarrow|nLeftrightarrow|nolimits|nonumber|nleftarrow|nrightarrow|ncong|nsim)(?![a-zA-Z])/
const xuongDong = (s) => s.replace(/\\n/g, (m, i, t) => (LENH_N.test(t.slice(i + 1)) ? m : '\n'))
const gon = (s) => xuongDong(s ?? '').replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim()
const boNhan = (s) => gon(s).replace(/^\s*[A-D]\s*[.)]\s*/, '')
const chuanDS = (s) => { const t = (s ?? '').trim().toUpperCase(); return t.startsWith('D') || t.startsWith('Đ') ? 'D' : t.startsWith('S') ? 'S' : null }
const hopLe4O = (s) => !!s && s.length <= 4 && /^-?[0-9]*,?[0-9]+$/.test(s) && (!s.includes(',') || [1, 2].includes(s.indexOf(',')))

const phan = (boc.phan ?? []).slice().sort((a, b) => a.thu_tu - b.thu_tu).map((p, i) => ({
  thu_tu: i + 1, goc: p.thu_tu, ten: gon(p.ten).replace(/^PH[ẦA]N\s+[IVX\d]+\s*[.:–-]?\s*/i, '') || `Phần ${i + 1}`, dang_thuc: p.dang_thuc, diem_moi_cau: DIEM[p.dang_thuc] ?? 1,
}))
const phanCua = new Map(phan.map((p) => [p.goc, p]))
const cau = []
for (const q of (boc.cau ?? []).slice().sort((a, b) => (phanCua.get(a.phan)?.thu_tu ?? 99) - (phanCua.get(b.phan)?.thu_tu ?? 99) || a.so - b.so)) {
  const p = phanCua.get(q.phan)
  const cb = []
  if (!p) { cb.push(`Gemini xếp câu vào phần ${q.phan} không có trong đề`); }
  const loai = p?.dang_thuc ?? (q.menh_de?.length ? 'dung_sai' : q.lua_chon?.length ? 'trac_nghiem' : 'tra_loi_ngan')
  let dapAn = gon(q.dap_an) || null
  if (loai === 'trac_nghiem' && dapAn) { const m = /^[ABCD]/.exec(dapAn.toUpperCase()); dapAn = m ? m[0] : (cb.push(`đáp án trắc nghiệm lạ: "${dapAn}"`), null) }
  if (loai === 'tra_loi_ngan' && dapAn) dapAn = dapAn.replace(/\./g, ',').replace(/\s/g, '').replace(/^−/, '-')
  if (loai === 'dung_sai') dapAn = null
  cau.push({
    phan: p?.thu_tu ?? q.phan, so: q.so, loai_cau: loai, trang: q.trang,
    noi_dung: gon(q.noi_dung),
    lua_chon: loai === 'trac_nghiem' ? (q.lua_chon ?? []).map(boNhan) : null,
    dap_an: dapAn, dap_an_nguon: dapAn ? (gon(q.dap_an_nguon) || 'pdf_gemini') : null,
    menh_de: loai === 'dung_sai' ? (q.menh_de ?? []).map((m) => ({ chu: m.chu, noi_dung: gon(m.noi_dung).replace(/^\s*[a-d]\s*\)\s*/, ''), dap_an: chuanDS(m.dap_an), loi_giai: gon(m.loi_giai) || null, dang: null })) : null,
    loi_giai: gon(q.loi_giai) || null,
    anh: [], anh_giai: [], _hinh: [], canh_bao: cb, kho: null, dang: null, // hình: chỉ lấy từ lượt SOI TRANG (3b)
  })
}

// ── 3b) LƯỢT 3 — SOI TỪNG TRANG trên ẢNH: (a) hình + vị trí nhãn câu · (b) chữ cái phương án bị đánh dấu ────────────
// Vì sao phải có (đo 01/10 trên DE SO 3, PDF xuất từ Word, 15 trang — số liệu ở spec-de-thi.md §10.8):
//   · Hình: lượt bóc đọc cả file PDF BỊA vị trí hình (báo 3 hình ở trang chỉ có 1, chép nguyên toạ độ cho bản lời giải), khung lệch
//     vài %. Đọc trên ẢNH một trang thì đúng số hình, khung sát ⇒ hình CHỈ lấy từ lượt này. Hình thuộc câu nào thì KHÔNG hỏi Gemini
//     (hỏi là sai: gán 2 hình đầu trang cho câu phía dưới) mà TÍNH bằng vị trí: nhãn "Câu N" gần nhất phía trên khung hình.
//   · Đáp án: cả 2 lượt đọc file đều chép "Chọn C" của lời giải cho câu mà chữ B mới là chữ bị GẠCH CHÂN (tác giả gõ nhầm). Một lượt
//     RIÊNG, một việc duy nhất "chữ cái nào bị gạch chân", ảnh 250 dpi: đúng 6/6 trên trang thử (150 dpi hoặc gộp chung việc khác: sai).
// Chỉ cắt hình của phần ĐỀ; hình trong phần lời giải chỉ đếm và báo (xem đề gốc đính kèm).
// Kết quả lưu gemini-trang.json + gemini-danh-dau.json. Claude sửa tay `box` / `nhan_cau` rồi chạy lại --dung-lai là cắt lại, không gọi Gemini.
const SCHEMA_TRANG = S('OBJECT', {
  properties: {
    nhan_cau: S('ARRAY', { items: S('OBJECT', { properties: { so: S('INTEGER'), y: S('INTEGER', { description: 'mép trên của nhãn, chuẩn hoá 0–1000 theo chiều cao trang' }) }, required: ['so', 'y'] }),
      description: 'Mọi nhãn mở đầu câu "Câu N." / "Câu N:" in đậm ở lề trái trên trang, theo thứ tự từ trên xuống' }),
    y_tieu_de_loi_giai: S('INTEGER', { nullable: true, description: 'Nếu trang có TIÊU ĐỀ mở đầu phần đáp án / lời giải chi tiết / hướng dẫn giải của CẢ ĐỀ (không phải chữ "Lời giải" của một câu): mép trên của tiêu đề đó, 0–1000. Không có ⇒ null.' }),
    hinh: S('ARRAY', { items: S('OBJECT', { properties: {
      box: S('ARRAY', { items: S('INTEGER'), description: '[ymin, xmin, ymax, xmax] chuẩn hoá 0–1000' }), mo_ta: S('STRING'),
    }, required: ['box', 'mo_ta'] }) }),
  },
  required: ['nhan_cau', 'hinh'],
})
const PROMPT_TRANG = `Ảnh là MỘT trang của một đề thi Toán (Việt Nam). Không chép nội dung. Trả về:
1. nhan_cau — mọi nhãn mở đầu câu ("Câu 1.", "Câu 2:" … in đậm ở lề trái): số câu và toạ độ y mép trên của nhãn (0–1000 theo chiều cao trang), từ trên xuống.
2. hinh — mọi HÌNH MINH HOẠ trên trang: hình vẽ hình học, đồ thị, bảng biến thiên, bảng số liệu có kẻ khung, ảnh chụp / tranh. KHÔNG tính công thức, hệ phương trình, đoạn chữ, số trang. Mỗi hình một khung [ymin, xmin, ymax, xmax] chuẩn hoá 0–1000, ôm TRỌN hình (đủ nhãn điểm, số đo nằm trong hình) và KHÔNG lấy dòng chữ ở trên / dưới / bên cạnh. Hai hình đặt cạnh nhau là HAI khung. Trang không có hình ⇒ mảng rỗng.
3. y_tieu_de_loi_giai — nếu trang có tiêu đề mở đầu phần ĐÁP ÁN / LỜI GIẢI CHI TIẾT / HƯỚNG DẪN GIẢI của cả đề thì ghi toạ độ y của nó; không có thì null. (Chữ "Lời giải" nằm dưới từng câu KHÔNG tính.)`
const SCHEMA_DD = S('OBJECT', { properties: { danh_dau: S('ARRAY', { items: S('OBJECT', { properties: {
  cau_so: S('INTEGER'), chu: S('STRING', { enum: ['A', 'B', 'C', 'D'] }),
}, required: ['cau_so', 'chu'] }) }) }, required: ['danh_dau'] })
const PROMPT_DD = 'Ảnh là một trang đề thi Toán. Liệt kê các câu trắc nghiệm mà MỘT chữ cái phương án (A. B. C. D.) được ĐÁNH DẤU là đáp án: bị GẠCH CHÂN (có nét gạch ngay dưới chữ cái), khoanh tròn, hoặc tô màu khác hẳn các chữ còn lại. Nhìn thật kỹ từng chữ cái A. B. C. D. của từng câu. Chỉ ghi cái nhìn thấy trên chữ cái; KHÔNG suy từ lời giải, KHÔNG dựa vào dòng "Chọn A", không tự giải. Trang không có ⇒ mảng rỗng.'

const DPI_DD = 250
mkdirSync(join(RA, 'trang-dd'), { recursive: true })
if (!readdirSync(join(RA, 'trang-dd')).some((f) => f.endsWith('.png'))) chay('pdftoppm', ['-r', String(DPI_DD), '-png', goc, join(RA, 'trang-dd', 'p')])
const ddTep = readdirSync(join(RA, 'trang-dd')).filter((f) => /^p-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)))
const tepTrang = join(RA, 'gemini-trang.json'), tepDD = join(RA, 'gemini-danh-dau.json')
const soi = DUNG_LAI && existsSync(tepTrang) ? JSON.parse(readFileSync(tepTrang, 'utf8')) : {}
const dd = DUNG_LAI && existsSync(tepDD) ? JSON.parse(readFileSync(tepDD, 'utf8')) : {}
{
  const viec = []
  for (let t = 1; t <= SO_TRANG; t++) {
    if (!soi[t]) viec.push(async () => { soi[t] = await gemini(PROMPT_TRANG, SCHEMA_TRANG, `lượt 3a HÌNH trang ${t}`, { mime: 'image/png', buf: readFileSync(join(RA, 'trang', trangTep[t - 1])) }) })
    if (!dd[t]) viec.push(async () => { dd[t] = await gemini(PROMPT_DD, SCHEMA_DD, `lượt 3b ĐÁNH DẤU trang ${t}`, { mime: 'image/png', buf: readFileSync(join(RA, 'trang-dd', ddTep[t - 1])) }) })
  }
  let k = 0
  const tho = async () => { while (k < viec.length) { const v = viec[k++]; try { await v() } catch (e) { console.log(`  lượt 3: LỖI ${String(e.message).slice(0, 140)}`) } } }
  await Promise.all([tho(), tho(), tho()]) // 3 lời gọi một lúc
  writeFileSync(tepTrang, JSON.stringify(soi, null, 1)); writeFileSync(tepDD, JSON.stringify(dd, null, 1))
}
const cbSoi = []
for (let t = 1; t <= SO_TRANG; t++) {
  if (!soi[t]) cbSoi.push(`Trang ${t}: chưa soi được hình (Gemini lỗi) — Claude tự xem trang này có hình không`)
  if (!dd[t]) cbSoi.push(`Trang ${t}: chưa soi được chữ đánh dấu (Gemini lỗi) — Claude tự xem`)
}
// Ranh giới ĐỀ | LỜI GIẢI: trang đầu tiên (từ trang của câu cuối trở đi) có tiêu đề phần lời giải của cả đề
const trangCauCuoi = Math.max(0, ...cau.map((q) => q.trang || 0))
let trangLoiGiai = null
for (let t = Math.max(1, trangCauCuoi); t <= SO_TRANG; t++) if (soi[t]?.y_tieu_de_loi_giai != null) { trangLoiGiai = t; break }
if (trangLoiGiai == null && ml.co_loi_giai_chi_tiet && trangCauCuoi < SO_TRANG) trangLoiGiai = trangCauCuoi + 1 // có lời giải mà không thấy tiêu đề ⇒ coi như bắt đầu ngay sau trang câu cuối
const thuTu = new Map(cau.map((q, i) => [q, i]))
let hinhLoiGiai = 0
for (let t = 1; t <= SO_TRANG; t++) {
  const nhan = (soi[t]?.nhan_cau ?? []).slice().sort((a, b) => a.y - b.y)
  for (const h of (soi[t]?.hinh ?? []).filter((x) => x.box?.length === 4).sort((a, b) => a.box[0] - b.box[0])) {
    if (trangLoiGiai != null && (t > trangLoiGiai || (t === trangLoiGiai && soi[t].y_tieu_de_loi_giai != null && h.box[0] > soi[t].y_tieu_de_loi_giai))) { hinhLoiGiai++; continue }
    // Hình thuộc câu nào = TÍNH theo vị trí: nhãn "Câu N" gần nhất phía trên khung (dung sai 1,5% trang). Không có nhãn nào phía trên
    // ⇒ hình của câu dở từ trang trước = câu cuối cùng có đề bắt đầu trước trang này.
    const tren = nhan.filter((n) => n.y <= h.box[0] + 15).pop()
    // Trang nằm SAU trang của câu cuối mà hình không đứng dưới nhãn câu nào: thường là phiếu trả lời / bảng đáp án / bảng điểm in cuối đề,
    // không phải hình của câu ⇒ KHÔNG tự gắn (đo 01/10: 6 ô "phiếu trả lời" bị gắn nhầm vào câu cuối), chỉ báo để Claude xem.
    if (!tren && t > trangCauCuoi) { cbSoi.push(`Trang ${t}: có hình / bảng sau câu cuối của đề (${h.mo_ta}) — không gắn vào câu nào; nếu là hình của câu cuối thì Claude gắn tay`); continue }
    const ung = tren
      ? cau.filter((q) => q.so === tren.so && q.trang <= t).sort((a, b) => b.trang - a.trang || thuTu.get(b) - thuTu.get(a))[0]
      : cau.filter((q) => q.trang < t).sort((a, b) => b.trang - a.trang || thuTu.get(b) - thuTu.get(a))[0]
    if (!ung) { cbSoi.push(`Trang ${t}: có hình (${h.mo_ta}) không gắn được vào câu nào${tren ? ` (nhãn Câu ${tren.so})` : ''} — Claude xem trang rồi gắn tay`); continue }
    if (tren && ung.trang !== t) ung.canh_bao.push(`hình ở trang ${t} gắn theo nhãn "Câu ${tren.so}" nhưng lượt bóc ghi câu này bắt đầu ở trang ${ung.trang} — kiểm hình có đúng của câu`)
    ung._hinh.push({ trang: t, box: h.box, mo_ta: h.mo_ta })
  }
}
if (hinhLoiGiai) cbSoi.push(`${hinhLoiGiai} hình nằm trong phần LỜI GIẢI không cắt (xem đề gốc đính kèm khi cần)`)

// ── 4) cắt hình thẳng từ PDF ─────────────────────────────────────────────────
let soHinh = 0
for (const q of cau) {
  q._hinh.forEach((h, i) => {
    const kt = kichThuoc[h.trang - 1]
    const b = h.box
    if (!kt || b[2] <= b[0] || b[3] <= b[1]) { q.canh_bao.push(`khung hình ${i + 1} không hợp lệ (trang ${h.trang}, box ${JSON.stringify(b)}) — tự cắt từ trang/${trangTep[h.trang - 1]}`); return }
    const le = 8 // lề thêm 0,8% mỗi phía — khung ôm sát hay ăn mất nét ngoài cùng
    const y0 = Math.max(0, b[0] - le), x0 = Math.max(0, b[1] - le), y1 = Math.min(1000, b[2] + le), x1 = Math.min(1000, b[3] + le)
    const X = Math.round(x0 / 1000 * kt.w), Y = Math.round(y0 / 1000 * kt.h), W = Math.round((x1 - x0) / 1000 * kt.w), H = Math.round((y1 - y0) / 1000 * kt.h)
    const ten = `p${q.phan}c${q.so}_${i + 1}`
    try {
      chay('pdftoppm', ['-r', String(DPI), '-f', String(h.trang), '-l', String(h.trang), '-x', String(X), '-y', String(Y), '-W', String(W), '-H', String(H), '-png', '-singlefile', goc, join(RA, 'img', ten)])
      q.anh.push(ten + '.png'); soHinh++
      if ((b[2] - b[0]) * (b[3] - b[1]) > 450000) q.canh_bao.push(`hình ${ten}.png chiếm gần nửa trang — khung có thể ôm cả chữ, mở ảnh kiểm`)
    } catch (e) { q.canh_bao.push(`không cắt được hình ${i + 1}: ${String(e.message).slice(0, 80)}`) }
  })
  delete q._hinh
}
// Chữ cái ĐÁNH DẤU nhìn thấy trên ảnh trang, gom theo câu trắc nghiệm (đề chỉ có 1 phần trắc nghiệm ⇒ số câu là khoá đủ)
const danhDauAnh = new Map()
const motPhanTN = phan.filter((p) => p.dang_thuc === 'trac_nghiem').length === 1
if (motPhanTN) for (let t = 1; t <= SO_TRANG; t++) for (const d of dd[t]?.danh_dau ?? []) {
  const q = cau.find((x) => x.loai_cau === 'trac_nghiem' && x.so === d.cau_so)
  if (q) (danhDauAnh.get(q) ?? danhDauAnh.set(q, new Set()).get(q)).add(d.chu)
}
// Lượt đánh dấu BẮT SÓT (đo 01/10: chạy lại thấy 7/12 câu) ⇒ có thấy thì là nhân chứng tốt, KHÔNG thấy thì chưa nói lên gì:
// liệt kê câu chưa có nhân chứng này để Claude tự soi ảnh trang-dd/ (250 dpi).
const tnChuaSoi = danhDauAnh.size ? cau.filter((q) => q.loai_cau === 'trac_nghiem' && !danhDauAnh.has(q)).map((q) => q.so) : []
if (tnChuaSoi.length) cbSoi.push(`Chữ cái đánh dấu trên ảnh trang: máy thấy ${danhDauAnh.size}/${cau.filter((q) => q.loai_cau === 'trac_nghiem').length} câu trắc nghiệm — CHƯA thấy câu ${tnChuaSoi.join(', ')}: Claude tự soi nét gạch chân của các câu này (trang-dd/)`)

// ── 5) máy kiểm ──────────────────────────────────────────────────────────────
const cbDe = [...cbSoi]
// 5a. cấu trúc từng câu
for (const q of cau) {
  const cb = q.canh_bao
  const chu = [q.noi_dung, ...(q.lua_chon ?? []), ...(q.menh_de ?? []).map((m) => m.noi_dung), q.loi_giai ?? ''].join('\n')
  if (!q.noi_dung) cb.push('đề bài RỖNG')
  if ((chu.match(/(?<!\\)\$/g) ?? []).length % 2) cb.push('dấu $ không cân — có công thức mở mà chưa đóng')
  if (chu.includes('[?]')) cb.push('có chỗ Gemini không đọc được ([?])')
  if (/\\(?:left|right|frac|sqrt|vec|overrightarrow|begin|end)\b/.test(chu.replace(/\$[^$]*\$/g, ''))) cb.push('có lệnh LaTeX nằm NGOÀI $...$')
  if (q.loai_cau === 'trac_nghiem') {
    if (q.lua_chon.length !== 4 || q.lua_chon.some((x) => !x)) cb.push(`trắc nghiệm có ${q.lua_chon.filter(Boolean).length} phương án (phải 4)`)
    if (!q.dap_an) cb.push('file không thể hiện đáp án — người duyệt điền')
  }
  if (q.loai_cau === 'dung_sai') {
    if (q.menh_de.length !== 4) cb.push(`đúng/sai có ${q.menh_de.length} ý (thường là 4)`)
    if (q.menh_de.map((m) => m.chu).join('') !== 'abcd'.slice(0, q.menh_de.length)) cb.push('thứ tự ý a) b) c) d) không liên tục')
    if (q.menh_de.some((m) => !m.dap_an)) cb.push('có ý chưa có Đúng/Sai — file không thể hiện, người duyệt điền')
  }
  if (q.loai_cau === 'tra_loi_ngan') {
    if (!q.dap_an) cb.push('file không thể hiện đáp số — người duyệt điền')
    else if (!hopLe4O(q.dap_an)) cb.push(`đáp số "${q.dap_an}" không tô được trên phiếu 4 ô — kiểm lại với ảnh trang`)
  }
  if (!(q.trang >= 1 && q.trang <= SO_TRANG)) cb.push(`số trang ${q.trang} ngoài phạm vi 1–${SO_TRANG}`)
}
// 5b. số câu liên tục trong từng phần
for (const p of phan) {
  const so = cau.filter((q) => q.phan === p.thu_tu).map((q) => q.so)
  p.so_cau = so.length
  const thieu = []; for (let i = 1; i <= Math.max(0, ...so); i++) if (!so.includes(i)) thieu.push(i)
  const trung = so.filter((x, i) => so.indexOf(x) !== i)
  if (thieu.length) cbDe.push(`Phần ${p.thu_tu} (${p.dang_thuc}): THIẾU câu số ${thieu.join(', ')}`)
  if (trung.length) cbDe.push(`Phần ${p.thu_tu}: TRÙNG câu số ${[...new Set(trung)].join(', ')}`)
  if (!so.length) cbDe.push(`Phần ${p.thu_tu} (${p.ten}) không có câu nào`)
}
// 5c. so với lượt MỤC LỤC (số câu mỗi phần + đáp án)
const mlPhan = (ml.phan ?? []).slice().sort((a, b) => a.thu_tu - b.thu_tu)
if (mlPhan.length !== phan.length) cbDe.push(`Hai lượt đọc lệch SỐ PHẦN: bóc ${phan.length} · mục lục ${mlPhan.length}`)
mlPhan.forEach((m, i) => { const p = phan[i]; if (p && (p.so_cau !== m.so_cau || p.dang_thuc !== m.dang_thuc)) cbDe.push(`Phần ${i + 1}: bóc ${p.so_cau} câu (${p.dang_thuc}) · mục lục ${m.so_cau} câu (${m.dang_thuc})`) })
const mlThuTu = new Map(mlPhan.map((m, i) => [m.thu_tu, i + 1]))
const mlCau = new Map((ml.cau ?? []).map((c) => [`${mlThuTu.get(c.phan) ?? c.phan}.${c.so}`, c]))
let lechDapAn = 0
for (const q of cau) {
  const m = mlCau.get(`${q.phan}.${q.so}`)
  if (!m) { q.canh_bao.push('lượt mục lục KHÔNG thấy câu này'); continue }
  const cua = q.loai_cau === 'dung_sai' ? q.menh_de.map((x) => x.dap_an ?? '?').join('') : (q.dap_an ?? '')
  const chuanKia = (v) => {
    let k = (v ?? '').trim().toUpperCase().replace(/Đ/g, 'D')
    if (q.loai_cau === 'tra_loi_ngan') k = k.replace(/\./g, ',').replace(/\s/g, '').replace(/^−/, '-')
    if (q.loai_cau === 'dung_sai') k = k.replace(/[^DS]/g, '')
    if (q.loai_cau === 'trac_nghiem') k = (/^[ABCD]/.exec(k) ?? [''])[0]
    return k
  }
  // 3 nguồn: lượt bóc · chỗ ĐÁNH DẤU (gạch chân / bảng đáp án) · CHỮ lời giải ("Chọn X"). Đo 28/09 + 01/10: gạch chân đúng, "Chọn X" của tác giả hay sai.
  const nguon = [['lượt bóc', cua.includes('?') ? '' : cua.toUpperCase()], ['đánh dấu (đọc file)', chuanKia(m.dap_an_danh_dau)], ['chữ lời giải', chuanKia(m.dap_an_loi_giai)],
    ['GẠCH CHÂN / khoanh trên ảnh trang', [...(danhDauAnh.get(q) ?? [])].sort().join('/')]].filter(([, v]) => v)
  const khac = [...new Set(nguon.map(([, v]) => v))]
  if (khac.length > 1) { lechDapAn++; q.canh_bao.push(`ĐÁP ÁN CÁC NGUỒN LỆCH: ${nguon.map(([n, v]) => `${n} "${v}"`).join(' · ')} — mở trang ${q.trang} xem tận mắt, không tự chọn`) }
  else if (khac.length === 1 && (!cua || cua.includes('?'))) q.canh_bao.push(`lượt bóc để trống đáp án, lượt mục lục đọc được "${khac[0]}" — mở trang ${q.trang} kiểm rồi điền`)
  if (m.co_hinh && !q.anh.length) q.canh_bao.push(`lượt mục lục báo câu CÓ HÌNH nhưng lượt soi trang không cắt hình nào cho câu — mở trang ${q.trang}`)
  if (m.trang !== q.trang) q.canh_bao.push(`hai lượt lệch trang: bóc ${q.trang} · mục lục ${m.trang}`)
}
for (const k of mlCau.keys()) if (!cau.some((q) => `${q.phan}.${q.so}` === k)) cbDe.push(`Lượt mục lục có câu ${k} (phần.số) mà lượt bóc KHÔNG có`)
// 5d. so chữ với lớp chữ PDF (nhân chứng không-AI) — chỉ khi PDF có lớp chữ
let lechChu = 0
if (CO_LOP_CHU) {
  const nen = lopChu.toLowerCase().normalize('NFC').replace(/\s+/g, ' ')
  for (const q of cau) {
    const tu = q.noi_dung.replace(/\$[^$]*\$/g, ' ').toLowerCase().normalize('NFC').match(/[\p{L}]{3,}/gu) ?? []
    if (tu.length < 5) continue
    const co = tu.filter((t) => nen.includes(t)).length
    if (co / tu.length < 0.8) { lechChu++; q.canh_bao.push(`chữ của đề bài chỉ khớp ${Math.round(co / tu.length * 100)}% với lớp chữ PDF — nghi chép sai / bịa, so với trang ${q.trang}`) }
  }
} else cbDe.push('PDF SCAN, không có lớp chữ ⇒ không có nhân chứng không-AI. Claude PHẢI so từng câu với ảnh trang.')

// ── 6) ghi ───────────────────────────────────────────────────────────────────
const de = {
  file: basename(tep), sha256, ten: gon(boc.ten_goi_y) || basename(tep).replace(/\.pdf$/i, ''), khoi: String(KHOI), mon: 'Toán',
  nguon: gon(boc.nguon) || null, nam: boc.nam ?? null, thoi_gian_phut: boc.thoi_gian_phut ?? 90, thang_diem: 10,
  nguon_doc: 'pdf_gemini', model: MODEL, so_trang: SO_TRANG, co_lop_chu: CO_LOP_CHU,
  co_bo_loi_giai: !!ml.co_loi_giai_chi_tiet, phan: phan.map(({ goc: _g, ...p }) => p), cau, canh_bao: cbDe,
}
writeFileSync(join(RA, 'de.json'), JSON.stringify(de, null, 1))
const tong = phan.reduce((s, p) => s + p.so_cau * p.diem_moi_cau, 0)
const baoCao = {
  file: de.file, sha256, so_trang: SO_TRANG, co_lop_chu: CO_LOP_CHU, model: MODEL,
  phan: phan.map((p) => `${p.thu_tu}. ${p.dang_thuc} × ${p.so_cau}`), so_cau: cau.length, tong_diem: tong, so_hinh: soHinh,
  co_dap_an: cau.filter((q) => q.loai_cau === 'dung_sai' ? q.menh_de.every((m) => m.dap_an) : !!q.dap_an).length,
  cau_co_canh_bao: cau.filter((q) => q.canh_bao.length).length, lech_dap_an_2_luot: lechDapAn, lech_lop_chu: lechChu, canh_bao_de: cbDe,
}
writeFileSync(join(RA, 'boc-pdf.bao-cao.json'), JSON.stringify(baoCao, null, 1))

console.log(`\n«${de.ten}»`)
console.log(`  ${baoCao.phan.join(' · ')} = ${cau.length} câu · tổng ${tong} điểm${Math.abs(tong - 10) > 1e-9 ? ' (KHÁC 10 — kiểm số câu / điểm từng phần)' : ''}`)
console.log(`  có đáp án: ${baoCao.co_dap_an}/${cau.length} · hình cắt: ${soHinh} · lệch đáp án 2 lượt: ${lechDapAn} · lệch lớp chữ: ${CO_LOP_CHU ? lechChu : 'không so được (scan)'}`)
for (const c of cbDe) console.log('  ⚠ ĐỀ: ' + c)
for (const q of cau) if (q.canh_bao.length) console.log(`  ⚠ P${q.phan} câu ${q.so} (trang ${q.trang}): ${q.canh_bao.join(' | ')}`)
console.log(`\n→ ${join(RA, 'de.json')}`)
console.log('VIỆC KẾ (Claude, không bỏ qua): mở từng ảnh trang/p-NN.png, so TỪNG câu với de.json (chữ, công thức, phương án, đáp án, hình trong img/),')
console.log('sửa bằng quyet.mjs; điền kho + dạng; rồi `node scripts/kho/de-thi/ghi.mjs <thư mục>` (chạy thử) trước khi --ghi.')
