// ĐỌC / VIẾT SỐ theo quy ước Việt Nam — phẩy thập phân, dấu cách hàng nghìn (18/10, sau sự cố 448 form TN hỏng).
//
// Sự cố: DẠNG 52 (mini-dang.mjs, "sinh nhiễu từ đáp số") tách đáp số theo CẢ ';' LẪN ',' ⇒ "12,61" thành 2 số
// "12;61"; còn "30 000" bị đọc như phép nhân 30·000 = 0. Máy tự kiểm bằng CHÍNH parser đó nên không lộ.
// File này là nơi DUY NHẤT quyết "dấu phẩy này là phẩy thập phân hay dấu ngăn cách":
//   • có ';'                      ⇒ ';' ngăn cách, mọi ',' bên trong là phẩy thập phân
//   • có ', ' (phẩy + cách)       ⇒ ', ' ngăn cách, ',' dính liền chữ số là phẩy thập phân
//   • ≥2 dấu ',' dính liền        ⇒ danh sách ("36,28,20,8" — lớp 3)
//   • đúng 1 dấu ',' dính liền    ⇒ phẩy thập phân, TRỪ khối ≤4 (chưa học số thập phân ⇒ danh sách "24,51")
// Nhóm 3 chữ số cách nhau bằng ' ', '\,', '\ ', '~', NBSP… ⇒ một số nguyên có dấu cách hàng nghìn.
// Không phụ thuộc mini-dang.mjs (dùng làm NHÂN CHỨNG THỨ HAI trong cổng kiểm mcq-sinh.mjs).

const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] } return a }
const R = (p, q = 1n) => { if (q < 0n) { p = -p; q = -q } const g = gcd(p, q) || 1n; return { p: p / g, q: q / g } }

// Khối học từ mã dạng: T105… → 5 · T14T… → 4 · T312… (HGT) → 12 · 077… (mã cũ khối 7) → 7. Không đọc được ⇒ null.
export function khoiCuaDang(dang) {
  const s = String(dang ?? '')
  let m = s.match(/^T[13]([0-9]{2})/); if (m) return Number(m[1])
  m = s.match(/^T1([0-9])T/); if (m) return Number(m[1])
  m = s.match(/^0([0-9]{2})/); if (m) return Number(m[1])
  return null
}
// Khối ≤4 chưa học số thập phân ⇒ "24,51" là hai số.
export const coThapPhan = (dang) => { const k = khoiCuaDang(dang); return k == null || k >= 5 }

// Chuẩn hoá ký hiệu LaTeX/khoảng trắng của số: {,} → ',' · \, \  ~ NBSP thin-space → ' ' · bỏ $ · '−' → '-'.
export function lamSachSo(s) {
  return String(s ?? '').replace(/\$/g, '').replace(/\{,\}/g, ',').replace(/\\[,;:! ]|~|[   ]/g, ' ')
    .replace(/−/g, '-').replace(/[ \t]+/g, ' ').trim()
}
// Ghép nhóm hàng nghìn: "9 123 456" → "9123456". Chỉ ghép khi MỌI nhóm sau đúng 3 chữ số và nhóm đầu 1–3 chữ số.
const RE_NGHIN = /(?<![\d,.])(\d{1,3})((?: \d{3})+)(?![\d])/g
export function ghepHangNghin(s) { return s.replace(RE_NGHIN, (_, a, b) => a + b.replace(/ /g, '')) }

// MỘT số thuần (nguyên / thập phân, có thể có dấu). → { v: Rat, fmt: {loai:'nguyen'|'thap_phan', dp, nghin} } | null
export function docMotSo(tok, { thapPhan = true } = {}) {
  const t = lamSachSo(tok).replace(/^[A-Za-zĐđ]\w*\s*=\s*/, '') // bỏ nhãn "y = 0,125"
  const m = t.match(/^([+-]?)\s*(\d{1,3}(?: \d{3})+|\d+)(?:,(\d+))?$/)
  if (!m) return null
  if (m[3] != null && !thapPhan) return null
  const nghin = m[2].includes(' '), nguyen = m[2].replace(/ /g, '')
  const dp = m[3] ? m[3].length : 0
  const p = BigInt(nguyen + (m[3] ?? '')) * (m[1] === '-' ? -1n : 1n)
  return { v: R(p, 10n ** BigInt(dp)), fmt: { loai: dp ? 'thap_phan' : 'nguyen', dp, nghin } }
}

// Tách chuỗi đáp số thành các phần (CHƯA đọc số) theo luật ở đầu file.
export function tachPhan(s, { thapPhan = true } = {}) {
  let t = lamSachSo(s)
  const tap = t.match(/^(?:[A-Za-z]\w*\s*)?(?:(?:∈|\\in)\s*)?\\?\{([^{}]*?)\\?\}$/); if (tap) t = tap[1].trim() // tập "{-1;1;3}", "x ∈ \{…\}"
  if (!t.includes(';') && /\svà\s/.test(t)) return t.split(/\s+và\s+/).map((x) => x.trim()).filter(Boolean) // "72 và 417,6"
  if (t.includes(';')) return t.split(';').map((x) => x.trim()).filter(Boolean)
  if (/,\s/.test(t)) return t.split(/,\s+/).map((x) => x.trim()).filter(Boolean)
  const nPhay = (t.match(/,/g) || []).length
  if (nPhay >= 2 || (nPhay === 1 && !thapPhan)) return t.split(',').map((x) => x.trim()).filter(Boolean)
  return [t]
}

// Danh sách số thuần của một đáp số; null nếu có phần không phải số thuần (phân số, chữ, căn…).
export function docDanhSachSo(s, opt) {
  const parts = tachPhan(s, opt); if (!parts.length) return null
  const out = []
  for (const p of parts) { const x = docMotSo(p, opt); if (!x) return null; out.push(x) }
  return out
}

// Viết Rat theo khuôn số: thập phân giữ ĐÚNG số chữ số sau phẩy (0,08 vẫn là 0,08; 0,40 vẫn 0,40), nới thêm chữ số
// nếu giá trị cần (vd chia 10). tex=true ⇒ '{,}' và '\,' (KaTeX); tex=false ⇒ ',' và không cách (key_gia_tri).
export function vietSo(v, fmt, { tex = true } = {}) {
  let dp = fmt?.loai === 'thap_phan' ? fmt.dp : 0
  while (dp < 12 && (10n ** BigInt(dp)) % v.q !== 0n) dp++
  if ((10n ** BigInt(dp)) % v.q !== 0n) return null // không biểu diễn được bằng số thập phân hữu hạn
  const am = v.p < 0n, scaled = (am ? -v.p : v.p) * (10n ** BigInt(dp)) / v.q
  let s = scaled.toString().padStart(dp + 1, '0')
  let nguyen = dp ? s.slice(0, -dp) : s
  const tp = dp ? s.slice(-dp) : ''
  if (fmt?.nghin && nguyen.length > 3) nguyen = nguyen.replace(/\B(?=(\d{3})+(?!\d))/g, tex ? '\\,' : '')
  return (am ? '-' : '') + nguyen + (tp ? (tex ? '{,}' : ',') + tp : '')
}

// Chuỗi CHUẨN để so sánh (độc lập cách viết): các giá trị dạng p/q nối ';'. null nếu không phải danh sách số thuần.
export function vanTaySo(s, opt) {
  const ds = docDanhSachSo(s, opt); if (!ds) return null
  return ds.map((x) => `${x.v.p}/${x.v.q}`).join(';')
}

// ── CỔNG KIỂM (18/10): đáp số kho ↔ key_gia_tri ↔ phương án đúng — NHÂN CHỨNG ĐỘC LẬP với parser sinh nhiễu ──
// Chỉ áp khi đáp số kho là SỐ THUẦN (1 số / danh sách số, có thể phẩy thập phân, cách hàng nghìn). Trả mảng lỗi.
//   (1) dãy CHỮ SỐ của đáp số kho = dãy chữ số của key và của phương án đúng (bắt "30 000" → "0", "8 5/10" → "4",
//       "0,08" → "0,8") — không qua bước tách nào nên không thể sai cùng kiểu với parser.
//   (2) SỐ LƯỢNG giá trị + giá trị từng số (vanTaySo) khớp (bắt "12,61" → "12;61").
//   (3) Đáp số kho là số thập phân ⇒ CẢ 4 phương án phải là số thuần (cấm phân số/hỗn số lẫn vào — ca T105040103023).
// Thứ tự giá trị KHÔNG xét (tập nghiệm "1;0" = "0; 1"); thứ tự là việc của parser chính, nhân chứng chỉ lo ĐỌC SỐ.
const chuSo = (s) => lamSachSo(s).replace(/\D/g, '').split('').sort().join('')
const vanTaySapXep = (s, opt) => { const ds = docDanhSachSo(s, opt); return ds ? ds.map((x) => `${x.v.p}/${x.v.q}`).sort().join(';') : null }
export function kiemKeyVoiDapAn({ dapAn, key, textDung, texts = [], dang }) {
  const opt = { thapPhan: coThapPhan(dang) }
  const ds = docDanhSachSo(dapAn, opt); if (!ds) return []
  const err = [], vt = vanTaySapXep(dapAn, opt)
  for (const [ten, s] of [['key_gia_tri', key], ['phương án đúng', textDung]]) {
    if (s == null) continue
    if (chuSo(s) !== chuSo(dapAn)) err.push(`${ten} "${s}" khác chữ số đáp số kho "${dapAn}"`)
    else if (vanTaySapXep(s, opt) !== vt) err.push(`${ten} "${s}" đọc ra ${vanTaySapXep(s, opt) ?? 'không phải số'} ≠ đáp số kho "${dapAn}" (${vt})`)
  }
  if (ds.some((x) => x.fmt.loai === 'thap_phan')) texts.forEach((t, i) => { if (!docDanhSachSo(t, opt)) err.push(`đáp số là số thập phân nhưng phương án ${'ABCD'[i]} "${t}" không phải số thập phân/số thuần`) })
  return err
}
