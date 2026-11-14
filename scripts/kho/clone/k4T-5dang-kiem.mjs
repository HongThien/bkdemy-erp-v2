// ============================================================================
// k4T-5dang-kiem.mjs — KIỂM lô k4T-5dang-sinh.mjs bằng đường ĐỘC LẬP với bộ sinh:
//   (1) đọc số liệu từ CHỮ CỦA ĐỀ, tìm đáp số bằng VÉT CẠN (dạng tỉ số) hoặc tính PHÂN SỐ CHÍNH XÁC từ từng số hạng của đề (dạng dãy, quy đồng);
//   (2) mọi phép tính số nguyên `$a=b$` trong lời giải đúng (kiemPhepTinh của k4T-tbc-kiem) · (3) hình thức: card Phần 1, KaTeX, Phần 2.
//   node scripts/kho/clone/k4T-5dang-kiem.mjs <lo.json>
// ============================================================================
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'
import { kiemPhepTinh } from './k4T-tbc-kiem.mjs'
const katex = createRequire(fileURLToPath(new URL('../../../package.json', import.meta.url)))('katex')

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a))
const Q = (p, q) => { const g = gcd(p, q) || 1; return [p / g, q / g] }
const cong = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), tru = (a, b) => Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1])
const nhan = (a, b) => Q(a[0] * b[0], a[1] * b[1]), chia = (a, b) => Q(a[0] * b[1], a[1] * b[0])
const bang = (a, b) => a[0] * b[1] === b[0] * a[1]
const so = (s) => (String(s).replace(/\b4[ABC]\b/g, '').replace(/\\dfrac\{(\d+)\}\{(\d+)\}/g, ' $1 / $2 ').match(/\d+/g) || []).map(Number)
const phanSo = (s) => [...String(s).matchAll(/\\dfrac\{(\d+)\}\{(\d+)\}/g)].map((m) => [+m[1], +m[2]])
const vet = (f, max = 5000) => { for (let x = 1; x <= max; x++) if (f(x)) return x; return null }
// đối tượng được hỏi: tên đứng sau "Hỏi " ; danh sách đối tượng: theo thứ tự xuất hiện trong câu đầu
function hoiVi(nd, ds) { const h = nd.slice(nd.lastIndexOf('Hỏi ')); return ds.findIndex((t) => h.includes(` ${t} `)) }
function doiTuong(nd) {
  const dau = nd.split('. ')[0]
  let m = dau.match(/^(Ba|Hai) bạn (.+?) (có|chứa|trồng được|đựng|sửa được) tất cả/); if (m) return m[2].split(/, | và /)
  m = dau.match(/^(Ba|Hai) (kho|lớp|thùng|đội) (.+?) (có|chứa|trồng được|đựng|sửa được) tất cả/); if (m) return m[3].split(/, | và /).map((x) => `${m[2]} ${x}`)
  return null
}

export const TINH = {
  'quy-ve-nho-nhat'(nd) {                                    // tổng T ; B gấp p lần A ; C gấp q lần A ⇒ tìm A bằng vét cạn
    const ds = doiTuong(nd); if (!ds) return null
    const T = so(nd.split('. ')[0]).at(-1), p = +nd.match(/gấp (\d+) lần/g)[0].match(/\d+/)[0], q = +nd.match(/gấp (\d+) lần/g)[1].match(/\d+/)[0]
    const a = vet((a) => a + p * a + q * a === T, T); if (a == null) return null
    const i = hoiVi(nd, ds); return i < 0 ? null : [[a, p * a, q * a][i]]
  },
  'ti-so-doi-mot'(nd) {                                      // I = a/b II ; II = c/d III ; tổng T ⇒ vét cạn III
    const ds = doiTuong(nd); if (!ds) return null
    const T = so(nd.split('. ')[0]).at(-1), [[a, b], [c, d]] = phanSo(nd)
    for (let z = 1; z <= T; z++) { if ((c * z) % d) continue; const y = (c * z) / d; if ((a * y) % b) continue; const x = (a * y) / b; if (x + y + z === T) { const i = hoiVi(nd, ds); return i < 0 ? null : [[x, y, z][i]] } }
    return null
  },
  'phan-so-bang-nhau'(nd) {                                  // 1/m_i của từng đại lượng bằng nhau, tổng T ⇒ vét cạn giá trị chung t
    const ds = doiTuong(nd); if (!ds) return null
    const T = so(nd.split('. ')[0]).at(-1), m = phanSo(nd).map(([p, q]) => (p === 1 ? q : NaN)); if (m.length !== ds.length || m.some(Number.isNaN)) return null
    const t = vet((t) => m.reduce((s, x) => s + x * t, 0) === T, T); if (t == null) return null
    const i = hoiVi(nd, ds); return i < 0 ? null : [m[i] * t]
  },
}
// dạng phân số: hàm trả MẢNG phân số [[p,q], …] để so với đáp án
export const TINH_PS = {
  'quy-dong-tu'(nd) {                                        // tìm tử chung nhỏ nhất bằng vét cạn, rồi mẫu mới
    const [[a, b], [c, d]] = phanSo(nd); const T = vet((t) => t % a === 0 && t % c === 0, 1000)
    return [[T, (b * T) / a], [T, (d * T) / c]]
  },
  'tim-x-day-hieu-tich'(nd) {                                // cộng ĐÚNG từng số hạng của dãy trong đề (khai triển "…" theo bước), rồi giải x
    const t = [...nd.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]).at(-1) ?? '', trong = t.match(/\\left\((.*)\\right\)/)?.[1]; if (!trong) return null
    const sh = [...trong.matchAll(/\\dfrac\{(\d+)\}\{(\d+)\\times (\d+)\}/g)].map((m) => [+m[1], +m[2], +m[3]]); if (sh.length < 2) return null
    let ds = sh
    if (/…|\\ldots/.test(trong)) { const k = sh[0][0], buoc = sh[1][1] - sh[0][1], cuoi = sh.at(-1)[1]; ds = []; for (let n = sh[0][1]; n <= cuoi; n += buoc) ds.push([k, n, n + k]) }
    if (ds.some(([k, n, m]) => m - n !== k)) return null
    let S = [0, 1]; for (const [k, n, m] of ds) S = cong(S, Q(k, n * m))
    const vp = t.split('=').at(-1), r = vp.includes('dfrac') ? phanSo(vp)[0] : [+vp, 1]
    const ve = t.split('\\left(')[0] + '#' + t.split('\\right)')[1].split('=')[0]
    const x = { 'x-#': cong(r, S), 'x+#': tru(r, S), '#-x': tru(S, r), 'x\\times #': chia(r, S), 'x:#': nhan(r, S) }[ve.replace(/\s/g, '').replace('\\times', '\\times ')]
      ?? { 'x-#': cong(r, S), 'x+#': tru(r, S), '#-x': tru(S, r), 'x\\times#': chia(r, S), 'x:#': nhan(r, S) }[ve.replace(/\s/g, '')]
    if (!x) return null
    // thử lại: thay x vào đề
    const lai = { 'x-#': tru(x, S), 'x+#': cong(x, S), '#-x': tru(S, x), 'x\\times#': nhan(x, S), 'x:#': chia(x, S) }[ve.replace(/\s/g, '')]
    return lai && bang(lai, r) && x[0] > 0 ? [x] : null
  },
}
const TINH_DANG = new Set(['quy-dong-tu', 'tim-x-day-hieu-tich'])   // bài tính: Phần 2 kết bằng "Vậy …" (như kho 4T), không có dòng "Đáp số"

export function kiemCau(c) {
  const loi = []
  if (TINH[c.mau]) {
    const ds = TINH[c.mau](c.noi_dung), co = so(c.dap_an)
    if (ds == null) loi.push('bộ kiểm KHÔNG đọc được đề / không có đáp số nguyên')
    else if (ds.length !== co.length || ds.some((x, i) => x !== co[i])) loi.push(`đáp số lệch: kho [${co}] · vét cạn [${ds}]`)
  } else if (TINH_PS[c.mau]) {
    const ds = TINH_PS[c.mau](c.noi_dung), co = String(c.dap_an).includes('dfrac') ? phanSo(c.dap_an) : [[+so(c.dap_an)[0], 1]]
    if (ds == null) loi.push('bộ kiểm KHÔNG đọc được đề')
    else if (ds.length !== co.length || ds.some((x, i) => !(x[0] === co[i][0] && x[1] === co[i][1]) && !(c.mau === 'tim-x-day-hieu-tich' && bang(x, co[i])))) loi.push(`đáp số lệch: kho ${JSON.stringify(co)} · bộ kiểm ${JSON.stringify(ds)}`)
    if (c.mau === 'tim-x-day-hieu-tich' && co.length && co[0][1] !== 1 && gcd(co[0][0], co[0][1]) !== 1) loi.push('đáp số chưa tối giản')
  } else return [`chưa có hàm kiểm cho mẫu ${c.mau}`]
  const [p1, p2] = String(c.loi_giai).split('\n\n**Phần 2. Trình bày**\n\n')
  if (!p2) loi.push('lời giải thiếu Phần 2'); else {
    for (const l of kiemP1(p1)) loi.push(`Phần 1: ${l}`)
    if (/[⇒⇔∈≤≥]|\\Rightarrow|\\in\b/.test(p2)) loi.push('Phần 2 có kí hiệu cấm')
    const dong = p2.split('\n\n'); if (dong.some((d) => d.includes('\n') || !d.trim())) loi.push('Phần 2: các dòng phải cách nhau đúng một dòng trống')
    const cuoi = dong.at(-1)
    if (TINH_DANG.has(c.mau)) { if (!cuoi.startsWith('Vậy ')) loi.push('bài tính phải kết bằng "Vậy …"') }
    else if (!cuoi.startsWith('Đáp số: ')) loi.push('dòng cuối Phần 2 phải là "Đáp số: …"')
    else if (so(cuoi).join() !== so(c.dap_an).join()) loi.push('"Đáp số" cuối bài ≠ đáp án')
    if (/Ta có sơ đồ:/.test(p2)) loi.push('nhắc sơ đồ mà câu không có sơ đồ')
  }
  for (const l of kiemPhepTinh(c.loi_giai)) loi.push(l)
  for (const k of ['noi_dung', 'loi_giai', 'dap_an']) {
    const s = String(c[k]); if ((s.match(/\$/g) || []).length % 2) loi.push(`${k}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch { loi.push(`${k}: công thức không render — ${m[1].slice(0, 50)}`) } }
    if (/undefined|NaN|\[object/.test(s)) loi.push(`${k}: có "undefined/NaN"`)
    if (/(?<![\p{L}])(ước|bội)(?![\p{L}])(?! lượng)/iu.test(s)) loi.push(`${k}: dùng ước/bội (lớp 6)`)
  }
  return loi
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const lo = JSON.parse(readFileSync(process.argv[2], 'utf8')); let hong = 0; const dem = {}
  for (const c of lo) { const l = kiemCau(c); dem[c.dang] ??= { dat: 0, hong: 0 }; if (l.length) { hong++; dem[c.dang].hong++; if (hong <= 30) console.log(`✘ #${c.id} ${c.mau} | ${c.noi_dung.slice(0, 100)} | ${l.join(' · ')}`) } else dem[c.dang].dat++ }
  console.table(dem); console.log(hong ? `✘ ${hong}/${lo.length} câu không đạt` : `✔ ${lo.length}/${lo.length} câu đạt`)
  process.exit(hong ? 1 : 0)
}
