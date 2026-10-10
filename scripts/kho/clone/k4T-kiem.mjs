// ============================================================================
// k4T-kiem.mjs — KIỂM lô clone 4T (k4T-sinh.mjs) bằng đường ĐỘC LẬP: đọc CHỮ CỦA ĐỀ, tự tính lại đáp số bằng VÉT CẠN
// (bộ sinh dùng công thức dựng; bộ kiểm không dùng chung hàm nào với bộ sinh). Lệch ⇒ câu bị loại, không ghi.
//
//   node scripts/kho/clone/k4T-kiem.mjs <lo.json> [--in <doc.txt>]      (--in: xuất bản đọc để người soát)
//
// Kiểm thêm hình thức: Phần 1 dạng card 3–6 bước (kiem-p1-card.mjs) · mọi công thức render KaTeX · Phần 2 không có ⇒ ⇔ ∈ ≤ ≥ ·
// số không có dấu cách hàng nghìn · đáp số xuất hiện trong Phần 2.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'
const katex = createRequire(fileURLToPath(new URL('../../../package.json', import.meta.url)))('katex')

const csCua = (n) => String(n).split('').map(Number)
const tongCs = (n) => csCua(n).reduce((s, x) => s + x, 0)
const khacNhau = (n) => new Set(String(n)).size === String(n).length
const soTrong = (s) => (s.match(/\d+/g) || []).map(Number)
function tapCon(arr) { const ra = []; for (let m = 1; m < 1 << arr.length; m++) ra.push(arr.filter((_, i) => m >> i & 1)); return ra }
function hoanVi(arr) { if (arr.length <= 1) return [arr]; return arr.flatMap((x, i) => hoanVi([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p])) }
/** mọi số có k chữ số khác nhau lấy từ tập chữ số cs */
function lapSo(cs, k) { const ra = []; const di = (cur, con) => { if (cur.length === k) { ra.push(Number(cur.join(''))); return } for (const c of con) { if (!cur.length && c === 0) continue; di([...cur, c], con.filter((x) => x !== c)) } }; di([], cs); return ra }
function dayCachDeu(nd) {            // "a, b, c, d, e, …, y, z" ⇒ { a, d, cuoi } (kiểm các số liệt kê cách đều và số cuối thuộc dãy)
  const m = nd.match(/dãy số\s*:\s*\$?([\d,\s]+?)[,\s]*(?:\.{3,}|\\ldots)[,\s.]*([\d,\s]*)/); if (!m) return null
  const dau = soTrong(m[1]), cuoi = soTrong(m[2]); if (dau.length < 3) return null
  const d = dau[1] - dau[0]; if (d <= 0 || dau.some((x, i) => i && x - dau[i - 1] !== d)) return null
  if (cuoi.length === 2 && cuoi[1] - cuoi[0] !== d) return null
  const L = cuoi.length ? cuoi[cuoi.length - 1] : null
  if (L != null && ((L - dau[0]) % d !== 0 || L <= dau[dau.length - 1])) return null
  return { a: dau[0], d, cuoi: L }
}

/** từng dạng: hàm (đề) → đáp số chuẩn (chuỗi) hoặc null nếu không đọc được đề */
const TINH = {
  T14T010106(nd) {
    const N = +(nd.match(/tổng các chữ số là (\d+)/) || [])[1]; if (!N) return null
    if (/khác nhau/.test(nd)) { let tot = null; for (const s of tapCon([1, 2, 3, 4, 5, 6, 7, 8, 9])) if (s.reduce((x, y) => x + y, 0) === N) { const so = Number(s.sort((a, b) => a - b).join('')); if (tot === null || so < tot) tot = so } return tot === null ? null : String(tot) }
    for (let x = 1; x < 10_000_000; x++) if (tongCs(x) === N) return String(x)
    return null
  },
  T14T040103(nd) { const bt = (nd.match(/\$([^$]+)\$/) || [])[1]; if (!bt) return null; const js = bt.replace(/\\times/g, '*').replace(/\s+/g, ''); return /^[\d+\-*]+$/.test(js) ? String(Function(`return ${js}`)()) : null },
  T14T010102(nd) { const m = nd.match(/lớn nhất có (\d) chữ số khác nhau có tích bằng (\d+)/); if (!m) return null; const k = +m[1], P = +m[2]; for (let x = 10 ** k - 1; x >= 10 ** (k - 1); x--) if (khacNhau(x) && csCua(x).reduce((s, y) => s * y, 1) === P) return String(x); return null },
  T14T060101(nd) { const g = dayCachDeu(nd), n = +(nd.match(/số hạng thứ (\d+)/) || [])[1]; if (!g || !n) return null; let x = g.a; for (let i = 1; i < n; i++) x += g.d; return g.cuoi != null && x > g.cuoi ? null : String(x) },
  T14T060102(nd) { const g = dayCachDeu(nd); if (!g || g.cuoi == null) return null; let dem = 0; for (let x = g.a; x <= g.cuoi; x += g.d) dem++; return String(dem) },
  T14T010105(nd) { const m = nd.match(/nhỏ nhất có (\d) chữ số khác nhau có tổng là (\d+)/); if (!m) return null; const k = +m[1], S = +m[2]; for (let x = 10 ** (k - 1); x < 10 ** k; x++) if (khacNhau(x) && tongCs(x) === S) return String(x); return null },
  T14T010101(nd) { const m = nd.match(/lớn nhất có (\d) chữ số( khác nhau)? có tổng là (\d+)/); if (!m) return null; const k = +m[1], S = +m[3]; for (let x = 10 ** k - 1; x >= 10 ** (k - 1); x--) if ((!m[2] || khacNhau(x)) && tongCs(x) === S) return String(x); return null },
  T14T010103(nd) { const N = +(nd.match(/lớn nhất có các chữ số khác nhau có tổng là (\d+)/) || [])[1]; if (!N) return null; let tot = -1; for (const s of tapCon([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])) if (s.reduce((x, y) => x + y, 0) === N) { const so = Number(s.sort((a, b) => b - a).join('')); if (so > tot) tot = so } return tot < 0 ? null : String(tot) },
  T14T040201(nd) { const m = nd.match(/\$(\d+)\s*:\s*(\d+)\$/); if (!m) return null; const A = +m[1], b = +m[2]; let q = 0, con = A; while (con >= b) { con -= b; q++ } return con ? `${q} dư ${con}` : String(q) },
  T14T010104(nd) {
    const m = nd.match(/số tự nhiên (lẻ|chẵn), (lớn|nhỏ) nhất có (\d+) chữ số khác nhau/); if (!m) return null
    const le = m[1] === 'lẻ', lon = m[2] === 'lớn', k = +m[3]
    // tìm theo chiều sâu: thử chữ số theo thứ tự (giảm dần nếu lớn nhất), số ĐẦU TIÊN hoàn chỉnh thoả chẵn/lẻ chính là đáp số
    const thuTu = lon ? [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; let kq = null
    const di = (cur) => { if (kq) return; if (cur.length === k) { if ((cur[k - 1] % 2 === 1) === le) kq = cur.join(''); return } for (const c of thuTu) { if (cur.includes(c) || (!cur.length && c === 0)) continue; di([...cur, c]); if (kq) return } }
    di([]); return kq
  },
  T14T020101(nd) { return demLap(nd, false) }, T14T020102(nd) { return demLap(nd, false) }, T14T020103(nd) { return demLap(nd, true) },
  T14T040102(nd) { const m = nd.match(/\$(\d+)\s*\\times\s*(\d+)\$/); if (!m) return null; let s = 0; for (let i = 0; i < +m[2]; i++) s += +m[1]; return String(s) },
  T14T060104(nd) { const g = dayCachDeu(nd), X = +(nd.match(/Số (\d+) có thuộc dãy/) || [])[1]; if (!g || !X || g.cuoi == null) return null; let i = 1; for (let x = g.a; x <= g.cuoi; x += g.d, i++) if (x === X) return String(i); return 'Không' },
  T14T070102(nd) {
    const m = nd.match(/chiều dài (\d+) m và chiều rộng (\d+) m[\s\S]*liên tiếp cách nhau (\d+) m/); if (!m || !/xung quanh/.test(nd) || !/mỗi góc/.test(nd)) return null
    const D = +m[1], R = +m[2], k = +m[3]; if (D % k || R % k || D <= R) return null      // "mỗi góc đều có" ⇒ hai cạnh phải chia hết cho khoảng cách
    let dem = 0; for (let x = 0; x < 2 * (D + R); x += k) dem++; return String(dem)
  },
}
function demLap(nd, chan) {
  const m = nd.match(/Từ các chữ số ([\d,\s]+?) viết được bao nhiêu số( chẵn)? có (\d) chữ số khác nhau/); if (!m || !!m[2] !== chan) return null
  const cs = soTrong(m[1]); if (new Set(cs).size !== cs.length || cs.some((x) => x > 9)) return null
  return String(lapSo(cs, +m[3]).filter((x) => !chan || x % 2 === 0).length)
}

export function kiemCau(c) {
  const loi = []
  const tinh = TINH[c.dang]; if (!tinh) return [`chưa có hàm kiểm cho dạng ${c.dang}`]
  const ds = tinh(c.noi_dung)
  if (ds == null) loi.push('bộ kiểm KHÔNG đọc được đề'); else if (ds !== String(c.dap_an)) loi.push(`đáp số lệch: kho ghi "${c.dap_an}", bộ kiểm tính ra "${ds}"`)
  const [p1, p2] = String(c.loi_giai).split('\n\n**Phần 2. Trình bày**\n\n')
  if (!p2) loi.push('lời giải thiếu Phần 2'); else {
    for (const l of kiemP1(p1)) loi.push(`Phần 1: ${l}`)
    if (/[⇒⇔∈≤≥]|\\Rightarrow|\\Leftrightarrow|\\in\b|\\le\b|\\ge\b/.test(p2)) loi.push('Phần 2 có kí hiệu cấm (⇒ ⇔ ∈ ≤ ≥)')
    const dsTrongP2 = String(c.dap_an).match(/\d+/g) || []
    if (!dsTrongP2.every((x) => p2.includes(x))) loi.push('đáp số không xuất hiện trong Phần 2')
    if (p2.split('\n\n').some((d) => d.includes('\n') || !d.trim())) loi.push('Phần 2: các dòng phải cách nhau đúng một dòng trống')
  }
  for (const k of ['noi_dung', 'loi_giai']) {
    const s = String(c[k])
    if ((s.match(/\$/g) || []).length % 2) loi.push(`${k}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch { loi.push(`${k}: công thức không render — ${m[1].slice(0, 50)}`) } }
    if (/\d{1,3} \d{3}(?!\d)/.test(s)) loi.push(`${k}: có số viết cách hàng nghìn`)
  }
  return loi
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2), lo = JSON.parse(readFileSync(a[0], 'utf8')); let hong = 0
  const dem = {}
  for (const c of lo) { const l = kiemCau(c); dem[c.dang] = dem[c.dang] || { dat: 0, hong: 0 }; if (l.length) { hong++; dem[c.dang].hong++; console.log(`✘ ${c.dang} ${c.mau} | ${c.noi_dung.replace(/\n/g, ' ⏎ ').slice(0, 90)} | ${l.join(' · ')}`) } else dem[c.dang].dat++ }
  console.table(dem); console.log(hong ? `✘ ${hong}/${lo.length} câu không đạt` : `✔ ${lo.length}/${lo.length} câu: đáp số khớp bộ kiểm độc lập + đạt hình thức`)
  const i = a.indexOf('--in'); if (i >= 0) writeFileSync(a[i + 1], lo.map((c, j) => `===== [${j + 1}] ${c.dang} · ${c.mau} ⟵ ${c.parent} · ĐA: ${c.dap_an}\n${c.noi_dung}\n--\n${c.loi_giai}\n`).join('\n'))
  process.exit(hong ? 1 : 0)
}
