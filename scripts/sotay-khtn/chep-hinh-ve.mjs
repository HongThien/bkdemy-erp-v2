// ============================================================================
// chep-hinh-ve.mjs — CHÉP bộ VẼ HÌNH BẰNG MÃ của KHTN Pocket vào app (Thùy 03/10: "chép cả code lại vào app luôn mới chuẩn").
// KHTN Pocket không có file ảnh: hình là MÃ `[kiểu:tham số]` (vd `[bohr:10:Ne]`, `[mach:nt 1 A V]`) do code tự vẽ ra SVG.
// Script lấy NGUYÊN VĂN các module vẽ (fig.js … fig8.js) + hàm phụ (esc, bkBohr/shellsOf/bohrG cho mô hình Bohr) và luật CSS
// tô màu hình, ghi thành:
//   src/lib/sotayHinh/hinhVe.js   — module ES: export `veHinh(ma)` ⇒ chuỗi SVG (giữ cả tương tác chạm bộ phận tế bào)
//   src/lib/sotayHinh/hinhVe.css  — luật CSS của hình; 8 biến màu gốc nối vào biến MÀN ĐỌC `--sk-doc-*` (bọc trong .so-tay-hinh)
// KHÔNG sửa tay 2 file đó — muốn cập nhật bộ vẽ thì chạy lại script với bản bundle mới.
// Chạy: node scripts/sotay-khtn/chep-hinh-ve.mjs <so-tay-*.js> <so-tay-*.css>
// ============================================================================
import fs from 'node:fs'
import path from 'node:path'

const [, , jsVao, cssVao] = process.argv
if (!jsVao || !cssVao) { console.error('Cần: <so-tay-*.js> <so-tay-*.css>'); process.exit(1) }
const src = fs.readFileSync(jsVao, 'utf8')
const css = fs.readFileSync(cssVao, 'utf8')
const RA = path.join('src', 'lib', 'sotayHinh')

const dau = [...src.matchAll(/\/\* ([a-zA-Z0-9_.-]+\.js) \*\//g)].map((m) => ({ ten: m[1], i: m.index }))
const mod = (ten) => { const k = dau.findIndex((d) => d.ten === ten); if (k < 0) throw new Error('thiếu module ' + ten); return src.slice(dau[k].i, k + 1 < dau.length ? dau[k + 1].i : src.length) }
// 1 khai báo top-level theo tên (function X / const X =), tới khai báo top-level kế tiếp.
function khai(ten) {
  const m = new RegExp(`^(?:function ${ten}\\b|const ${ten}\\s*=)`, 'm').exec(src); if (!m) throw new Error('thiếu hàm ' + ten)
  const sau = src.slice(m.index + 1)
  const n = /^(?:function |const |let |var |\/\* [a-z0-9-]+\.js \*\/|\/\/ -{3,})/m.exec(sau)
  return src.slice(m.index, m.index + 1 + (n ? n.index : sau.length)).trimEnd()
}

const FIG_MOD = ['fig.js', 'fig2.js', 'fig3.js', 'fig4.js', 'fig5.js', 'fig6.js', 'fig7.js', 'fig8.js']
const js = `// @ts-nocheck
/* eslint-disable */
// ============================================================================
// HÌNH VẼ BẰNG MÃ — chép NGUYÊN VĂN từ KHTN Pocket (artifact "Sổ tay KHTN 6–9", GV đã duyệt) bằng scripts/sotay-khtn/chep-hinh-ve.mjs.
// ĐỪNG SỬA TAY — chạy lại script. Phần BK thêm chỉ ở CUỐI file (export veHinh).
// Cách dùng: veHinh('[bohr:10:Ne]') ⇒ chuỗi HTML chứa <svg>; mã lạ / lỗi ⇒ trả lại chính mã (đã escape) để người soạn thấy mà sửa.
// Tương tác gốc (chạm bộ phận tế bào / sơ đồ ⇒ hiện tên + chức năng) gắn 1 lần vào document khi module được nạp.
// ============================================================================

// ── hàm phụ (từ các module khác của Pocket) ──
${['esc', 'shellsOf', 'bohrG', 'bkBohr'].map(khai).join('\n\n')}

${FIG_MOD.map(mod).join('\n')}

// ── BK: điểm vào duy nhất ──
// Chỉ nhận 1 mã hình (hoặc chữ có lẫn mã) — phần chữ ngoài mã được escape, không chạy định dạng của Pocket.
export function veHinh(ma) { return figText(ma, esc) }
export const KIEU_HINH = FIG_RE.source
`
fs.mkdirSync(RA, { recursive: true })
fs.writeFileSync(path.join(RA, 'hinhVe.js'), js)

// ── CSS: luật có class hình (bk-fig / bk-bohr / bohr / fg-* / bp-*), giữ cả @media lồng 1 cấp ──
function luat(s) {
  const ra = []; let i = 0
  while (i < s.length) {
    const mo = s.indexOf('{', i); if (mo < 0) break
    let sau = 1, j = mo + 1
    while (j < s.length && sau) { if (s[j] === '{') sau++; else if (s[j] === '}') sau--; j++ }
    ra.push({ chon: s.slice(i, mo).trim(), than: s.slice(mo + 1, j - 1) }); i = j
  }
  return ra
}
const hop = (chon) => /\.(bk-fig|bk-bohr|bohr\b|fg[0-9]*-|bp-|wk-fig)/.test(chon)
const cssRa = []
for (const r of luat(css)) {
  if (r.chon.startsWith('@media') || r.chon.startsWith('@supports')) {
    const con = luat(r.than).filter((x) => hop(x.chon))
    if (con.length) cssRa.push(`${r.chon} {\n${con.map((x) => `  ${x.chon} {${x.than}}`).join('\n')}\n}`)
  } else if (!r.chon.startsWith('@') && hop(r.chon)) cssRa.push(`${r.chon} {${r.than}}`)
}
fs.writeFileSync(path.join(RA, 'hinhVe.css'), `/* ============================================================================
   CSS HÌNH VẼ BẰNG MÃ — bóc từ KHTN Pocket bằng scripts/sotay-khtn/chep-hinh-ve.mjs. ĐỪNG SỬA TAY.
   8 biến màu gốc của Pocket nối vào biến MÀN ĐỌC (registry DOC_MAC_DINH) — chỉ trong khung .so-tay-hinh, không lan ra app.
   ============================================================================ */
.so-tay-hinh {
  --line: var(--sk-doc-line, #E5ECF6); --ink: var(--sk-doc-ink, #23314F); --ink-2: var(--sk-doc-muted, #64738F); --ink-3: #8D9BAE;
  --surface: var(--sk-doc-giay, #FFFFFF); --surface-2: var(--sk-doc-vd, #F1F5FB);
  --f-body: var(--sk-doc-font, 'Be Vietnam Pro', system-ui, sans-serif); --f-mono: ui-monospace, SFMono-Regular, Consolas, monospace;
  max-width: 100%; overflow-x: auto;
}
.so-tay-hinh svg { max-width: 100%; height: auto; }
${cssRa.join('\n')}
`)
console.log('✔ hinhVe.js', (js.length / 1024).toFixed(0), 'KB · hinhVe.css', cssRa.length, 'luật')
