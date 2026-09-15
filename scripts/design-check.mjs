// Kiểm cơ học gói thiết kế ChatGPT giao (design/HANDOFF-PIPELINE.md §5 bước 2) TRƯỚC khi dựng UI.
// Chạy: node scripts/design-check.mjs design/handoff/hs-home-v3
// In bảng ĐẠT/RỚT từng file; exit 1 nếu có RỚT. Chỉ đọc, không sửa gì.
// Kiểm: kích thước tối thiểu · PNG có alpha THẬT (đếm pixel trong suốt, không tin header) · backdrop các
// biến thể có KHÁC nhau thật không (so pixel) · SVG không bọc <image>/base64 · có DESIGN.md + reference/.
// Vì sao: v1/v2 STUDENT_HOME rớt đúng những chỗ này mà mắt nhìn zip không thấy (xem HANDOFF-PIPELINE §7).
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import { PNG } from 'pngjs'

const root = process.argv[2]
if (!root || !existsSync(root)) { console.error('Cách dùng: node scripts/design-check.mjs <thư mục handoff>'); process.exit(2) }

// Chuẩn tối thiểu theo loại thư mục (HANDOFF-PIPELINE §1 / §3.1)
const RULE = {
  backdrop:      { minW: 1080, minH: 1920, alpha: false },
  characters:    { minH: 800, alpha: true },
  illustrations: { minW: 512, minH: 512, alpha: true },
  doodles:       { minW: 400, alpha: true },
  decor:         { minW: 600, alpha: true },
}

const rows = [] // { file, ket: 'ĐẠT'|'RỚT'|'CHÚ Ý', ly_do }
const ok = (file, ly_do = '') => rows.push({ file, ket: 'ĐẠT', ly_do })
const fail = (file, ly_do) => rows.push({ file, ket: 'RỚT', ly_do })
const warn = (file, ly_do) => rows.push({ file, ket: 'CHÚ Ý', ly_do })

function walk(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p] })
}

// Đọc PNG → { width, height, transparentPct, cornerAlpha }
function pngInfo(p) {
  const img = PNG.sync.read(readFileSync(p))
  const d = img.data; const n = img.width * img.height; let trans = 0
  for (let i = 3; i < d.length; i += 4) if (d[i] === 0) trans++
  return { width: img.width, height: img.height, transparentPct: (100 * trans) / n, cornerAlpha: d[3], data: d }
}

// % pixel trong suốt bị BAO KÍN bởi pixel đục (lỗ thủng) so với số pixel đục. Cutout sinh thật ~0%;
// "cutout" làm bằng cách xoá màu trắng thì áo/tóc/cốc trắng thành lỗ (v3: hoodie, tóc, thân cốc rỗng).
// BFS từ 4 mép qua vùng trong suốt (bước 2px cho nhanh) → phần trong suốt còn lại = lỗ.
function holePct(info) {
  const S = 2, w = Math.floor(info.width / S), h = Math.floor(info.height / S)
  const opaque = new Uint8Array(w * h); let nOp = 0
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const a = info.data[((y * S) * info.width + x * S) * 4 + 3]; if (a > 0) { opaque[y * w + x] = 1; nOp++ } }
  if (!nOp) return 0
  const seen = new Uint8Array(w * h); const q = []
  const push = (x, y) => { const i = y * w + x; if (!seen[i] && !opaque[i]) { seen[i] = 1; q.push(i) } }
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1) } for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y) }
  while (q.length) { const i = q.pop(); const x = i % w, y = (i - x) / w; if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1) }
  let holes = 0; for (let i = 0; i < w * h; i++) if (!opaque[i] && !seen[i]) holes++
  return (100 * holes) / nOp
}

// % pixel có CẠNH SẮC (độ sáng đổi > 48 so với pixel kề) — tranh nền chỉ mây/màu mềm gần 0%;
// chữ, viền card, nhân vật nướng vào ảnh đẩy số này lên (v3: backdrop vẫn nướng chào + hero + cậu bé).
function edgePct(info) {
  const S = 2, w = Math.floor(info.width / S), h = Math.floor(info.height / S)
  const L = new Float32Array(w * h)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = ((y * S) * info.width + x * S) * 4; L[y * w + x] = 0.299 * info.data[i] + 0.587 * info.data[i + 1] + 0.114 * info.data[i + 2] }
  let e = 0
  for (let y = 0; y < h - 1; y++) for (let x = 0; x < w - 1; x++) { const i = y * w + x; if (Math.abs(L[i] - L[i + 1]) > 48 || Math.abs(L[i] - L[i + w]) > 48) e++ }
  return (100 * e) / (w * h)
}

// ── 1. Cấu trúc bắt buộc ─────────────────────────────────────────────────────
if (!existsSync(join(root, 'DESIGN.md'))) fail('DESIGN.md', 'thiếu — ChatGPT phải điền theo mẫu §4')
else {
  const md = readFileSync(join(root, 'DESIGN.md'), 'utf8')
  const thieu = ['## 1', '## 2', '## 3', '## 4', '## 5', '## 6'].filter((h) => !md.includes(h))
  thieu.length ? fail('DESIGN.md', `thiếu mục ${thieu.join(', ')}`) : ok('DESIGN.md', '6 mục')
  // Bảng kiểm kê (CHATGPT-UI-KIT §4) = hợp đồng: mỗi phần tử 1 dòng, cột Loại ∈ 7 loại. Thiếu bảng = ChatGPT
  // chưa kiểm kê, lập trình viên sẽ phải đoán phần tử nào dựng bằng gì.
  const nDong = (md.match(/\|\s*(TEXT|SHAPE|GLYPH|ILLUST|CHAR|DECOR|BACKDROP)(\+[A-Z]+)*\s*\|/g) ?? []).length
  nDong < 5 ? fail('DESIGN.md · bảng kiểm kê', `chỉ ${nDong} dòng có cột Loại (TEXT/SHAPE/GLYPH/ILLUST/CHAR/DECOR/BACKDROP) — thiếu bảng kiểm kê phần tử`)
            : ok('DESIGN.md · bảng kiểm kê', `${nDong} phần tử`)
  // Đối chiếu 2 chiều: file asset ghi trong DESIGN.md phải tồn tại; file trong assets/ phải được DESIGN.md nhắc tới.
  const nhac = new Set((md.match(/(backdrop|characters|illustrations|decor|svg)\/[a-z0-9_@.-]+\.(png|svg)/gi) ?? []).map((s) => s.toLowerCase()))
  const coThat = new Set(walk(join(root, 'assets')).map((p) => p.slice(join(root, 'assets').length + 1).replace(/\\/g, '/').toLowerCase()))
  for (const f of nhac) if (!coThat.has(f)) fail(`DESIGN.md → ${f}`, 'ghi trong bảng kiểm kê nhưng KHÔNG có file trong assets/')
  for (const f of coThat) if (!nhac.has(f) && /\.(png|svg)$/.test(f)) warn(`assets/${f}`, 'có file nhưng DESIGN.md không nhắc tới — mồ côi, sẽ không được dùng')
}
const refs = walk(join(root, 'reference')).filter((p) => /\.(png|jpg|jpeg)$/i.test(p))
refs.length ? ok('reference/', `${refs.length} ảnh mockup`) : fail('reference/', 'không có ảnh mockup nào — không có gì để so')

// ── 2. Từng PNG theo loại thư mục ────────────────────────────────────────────
const backdrops = []
for (const loai of Object.keys(RULE)) {
  const dir = join(root, 'assets', loai)
  const files = walk(dir)
  if (!files.length) { warn(`assets/${loai}/`, 'trống (bỏ qua nếu màn này không cần)'); continue }
  for (const p of files) {
    const rel = `assets/${loai}/${basename(p)}`
    const ext = extname(p).toLowerCase()
    if (ext === '.webp') { warn(rel, 'WebP — không kiểm được alpha, gửi PNG gốc; Claude tự tối ưu'); continue }
    if (ext !== '.png') { warn(rel, `đuôi ${ext} — chỉ nhận PNG`); continue }
    if (!/^[a-z0-9_@.]+$/.test(basename(p))) warn(rel, 'tên file có dấu/khoảng trắng/chữ hoa')
    let info
    try { info = pngInfo(p) } catch (e) { fail(rel, `không đọc được PNG: ${e.message}`); continue }
    const r = RULE[loai]; const loi = []
    // Backdrop 941×1672 (cỡ mockup gốc) vẫn 2.2x so với màn 430px → chỉ CHÚ Ý; dưới 900×1600 mới RỚT.
    const mem = loai === 'backdrop' && info.width >= 900 && info.height >= 1600
    if (r.minW && info.width < r.minW) (mem ? warn(rel, `ngang ${info.width} < ${r.minW} — chấp nhận được`) : loi.push(`ngang ${info.width} < ${r.minW}`))
    if (r.minH && info.height < r.minH) (mem ? warn(rel, `cao ${info.height} < ${r.minH} — chấp nhận được`) : loi.push(`cao ${info.height} < ${r.minH}`))
    let them = ''
    if (r.alpha) {
      // "Có alpha" phải là pixel trong suốt THẬT ≥ 5% và góc ảnh trong suốt — header RGBA không đủ.
      if (info.transparentPct < 5) loi.push(`nền KHÔNG trong suốt (${info.transparentPct.toFixed(0)}% pixel alpha=0) — là crop nền trắng?`)
      else if (info.transparentPct > 95) loi.push(`ảnh RỖNG (${info.transparentPct.toFixed(0)}% trong suốt) — chủ thể bị xoá cùng nền?`)
      else {
        if (info.cornerAlpha !== 0) loi.push('góc ảnh không trong suốt')
        const hp = holePct(info)
        if (hp > 4) loi.push(`THỦNG ${hp.toFixed(0)}% — xoá nền bằng cách xoá màu trắng (áo/tóc/cốc trắng thành lỗ), không phải cutout thật`)
        else them = ` · thủng ${hp.toFixed(1)}%`
      }
    }
    if (loai === 'backdrop') {
      backdrops.push({ rel, info })
      const ep = edgePct(info)
      if (ep > 0.5) loi.push(`có CHỮ/CARD/NHÂN VẬT nướng trong ảnh (cạnh sắc ${ep.toFixed(2)}% pixel, tranh nền mềm phải < 0.5%)`)
      else them = ` · cạnh sắc ${ep.toFixed(2)}%`
    }
    loi.length ? fail(rel, loi.join(' · ')) : ok(rel, `${info.width}×${info.height}${r.alpha ? ` · trong suốt ${info.transparentPct.toFixed(0)}%` : ''}${them}`)
  }
}

// ── 3. Backdrop các biến thể phải KHÁC nhau thật (v2: "nữ" = nam đổi tông 6/255) ─
for (let i = 0; i < backdrops.length; i++) for (let j = i + 1; j < backdrops.length; j++) {
  const a = backdrops[i], b = backdrops[j]
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) continue
  let sum = 0; const d1 = a.info.data, d2 = b.info.data
  for (let k = 0; k < d1.length; k++) if (k % 4 !== 3) sum += Math.abs(d1[k] - d2[k])
  const mean = sum / (d1.length * 0.75)
  const cap = `${basename(a.rel)} ↔ ${basename(b.rel)}`
  mean < 20 ? fail(cap, `gần như cùng 1 ảnh (lệch TB ${mean.toFixed(1)}/255) — biến thể chưa tồn tại`) : ok(cap, `khác nhau (lệch TB ${mean.toFixed(1)}/255)`)
}

// ── 4. SVG phải là vector thật ───────────────────────────────────────────────
for (const p of walk(join(root, 'assets', 'svg'))) {
  const rel = `assets/svg/${basename(p)}`
  const s = readFileSync(p, 'utf8')
  if (/<image\b/i.test(s) || /base64,/.test(s)) fail(rel, 'bọc ảnh raster trong <image>/base64 — không phải vector')
  else if (/<text\b/i.test(s)) fail(rel, 'chữ trong SVG <text> — chữ (doodle/quote) phải dựng bằng font Itim, không phải asset')
  else if (/^(icon_|ill_)/.test(basename(p))) fail(rel, 'minh hoạ ô gõ tay bằng SVG — phải là PNG sinh bằng công cụ tạo ảnh (luật 6)')
  else if (!/<(path|circle|rect|polygon|ellipse|line)\b/i.test(s)) fail(rel, 'không có hình vector nào')
  else if (!/viewBox=/.test(s)) warn(rel, 'thiếu viewBox — khó scale')
  else ok(rel, 'vector')
}

// ── In bảng ──────────────────────────────────────────────────────────────────
const w = Math.max(...rows.map((r) => r.file.length), 10)
for (const r of rows) console.log(`${r.ket.padEnd(5)} ${r.file.padEnd(w)}  ${r.ly_do}`)
const nRot = rows.filter((r) => r.ket === 'RỚT').length
console.log(`\n${nRot ? `✖ ${nRot} chỗ RỚT — trả lại ChatGPT đúng các dòng trên, CHƯA dựng UI.` : '✔ ĐẠT — dựng được.'}`)
process.exit(nRot ? 1 : 0)
