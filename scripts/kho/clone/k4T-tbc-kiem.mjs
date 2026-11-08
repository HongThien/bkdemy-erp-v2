// ============================================================================
// k4T-tbc-kiem.mjs — KIỂM lô clone «Trung bình cộng» (k4T-tbc-sinh.mjs) bằng đường ĐỘC LẬP với bộ sinh:
//   (1) đọc số liệu từ CHỮ CỦA ĐỀ rồi TÌM ĐÁP SỐ BẰNG VÉT CẠN (thử từng giá trị thoả điều kiện đề) — không dùng công thức của bộ sinh;
//   (2) máy tự tính lại MỌI phép tính trong lời giải (mỗi `$a = b$` có vế trái là biểu thức số);
//   (3) hình thức: card 3–6 bước (kiem-p1-card), KaTeX, kí hiệu cấm ở Phần 2, "Đáp số" khớp, sơ đồ vẽ được (máy tự kiểm tỉ lệ).
//
//   node scripts/kho/clone/k4T-tbc-kiem.mjs <lo.json> [--in <doc.txt>]
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'
import { veSoDo } from '../so-do-doan-thang.mjs'
const katex = createRequire(fileURLToPath(new URL('../../../package.json', import.meta.url)))('katex')

const so = (nd) => (nd.replace(/\b4[ABC]\b/g, '').match(/\d+/g) || []).map(Number)
const trungBinh = (a) => a.reduce((s, x) => s + x, 0) / a.length
const tim = (f, max = 200000) => { for (let x = 0; x <= max; x++) if (f(x)) return x; return null }          // vét cạn số nguyên không âm
const rep = (a, b) => a.length === b.length && a.every((x, i) => x === b[i])
const khoiDV = { cm: { cm: 1, dm: 10 }, kg: { kg: 1, yến: 10, tạ: 100 }, dm: { dm: 1, m: 10 } }
const dsCuoi = (nd) => nd.split('. ').slice(0, -1).join('. ')            // bỏ câu hỏi cuối

/** Mỗi hàm trả MẢNG số nguyên là đáp số theo đề (đúng thứ tự dap_an), hoặc null nếu không đọc được đề. */
export const TINH = {
  'tbc-bang'(nd) { const ph = nd.split(': ')[1]?.split('. ')[0]; if (!ph) return null; const v = so(ph); const m = trungBinh(v); return Number.isInteger(m) ? [m] : null },
  'tbc-doi-don-vi'(nd) {
    const dich = /xăng-ti-mét/.test(nd) ? 'cm' : /ki-lô-gam/.test(nd) ? 'kg' : /đề-xi-mét/.test(nd) ? 'dm' : null; if (!dich) return null
    const ph = nd.split(': ')[1]?.split('. ')[0]; if (!ph) return null
    const it = [...ph.matchAll(/(\d+) (cm|dm|kg|yến|tạ|m)(?=[\s,.]|$)/g)]; if (!it.length) return null
    const v = it.map((x) => x[1] * (khoiDV[dich][x[2]] ?? NaN)); if (v.some(Number.isNaN)) return null
    const m = trungBinh(v); return Number.isInteger(m) ? [m] : null
  },
  'tbc-hon-kem'(nd) {
    const [a, p, q] = so(nd), nhieuTruoc = nd.search(/nhiều hơn/) < nd.search(/ít hơn/)
    const hai = nhieuTruoc ? a - p : a + p, ba = nhieuTruoc ? a + q : a - q                       // câu: "nhiều hơn … thứ hai p và ít hơn … thứ ba q" hoặc ngược lại
    const m = (a + hai + ba) / 3; return Number.isInteger(m) ? [m] : null
  },
  'tim-so-cuoi'(nd) { const [m, ...dau] = so(nd); const n = dau.length + 1; const x = tim((x) => (tong(dau) + x) / n === m); return x === null ? null : [x] },
  'tim-so-con-lai-hai-so'(nd) { const [m, a] = so(nd); const x = tim((x) => (a + x) / 2 === m); return x === null ? null : [x] },
  'tim-so-thu-ba'(nd) { const [a, d, m] = so(nd); const hon = /nhiều hơn/.test(nd); const b = hon ? a + d : a - d; const x = tim((x) => (a + b + x) / 3 === m); return x === null ? null : [x] },
  'tbc-hai-loai'(nd) { const v = so(nd), [a, p, b, q] = v.slice(-4); const m = (a * p + b * q) / (a + b); if (!Number.isInteger(m)) return null; return [/tạ thóc/.test(nd) ? m / 100 : m] },
  'tbc-ba-loai'(nd) { const [a, p, b, q, c, r] = so(nd); const m = (a * p + b * q + c * r) / (a + b + c); return Number.isInteger(m) ? [m] : null },
  'tbc-tim-loai-con-lai'(nd) { const v = so(nd), [T, a, p, b] = v, m = /Điểm trung bình của cả/.test(nd) ? v[5] : v[4]; if (T !== a + b) return null; const q = tim((q) => (a * p + b * q) / T === m, 5000); return q === null ? null : [q] },
  'day-cach-deu-ngan'(nd) { const v = so(nd), d = v[1] - v[0]; if (v[2] - v[1] !== d || v[3] - v[2] !== d || d <= 0) return null; const z = v[4], a = v[0]; if ((z - a) % d) return null; const dayso = []; for (let x = a; x <= z; x += d) dayso.push(x); const m = trungBinh(dayso); return Number.isInteger(m) ? [m] : null },
  'day-cach-deu-dai'(nd) { const v = so(nd), d = v[1] - v[0]; if (v[2] - v[1] !== d || v[4] - v[3] !== d || d <= 0) return null; if ((v[4] - v[0]) % d) return null; const dayso = []; for (let x = v[0]; x <= v[4]; x += d) dayso.push(x); const m = trungBinh(dayso); return Number.isInteger(m) ? [m] : null },
  'day-tu-tap-so'(nd) {
    const loai = /chia hết cho 5/.test(nd) ? (x) => x % 5 === 0 : /chia hết cho 3/.test(nd) ? (x) => x % 3 === 0 : /số chẵn/.test(nd) ? (x) => x % 2 === 0 : /số lẻ/.test(nd) ? (x) => x % 2 === 1 : /số tự nhiên/.test(nd) ? () => true : null; if (!loai) return null
    const v = so(nd.replace(/chia hết cho [35]/, '').replace(/khác 0/, '')); let lo, hi
    if (/từ \d+ đến \d+/.test(nd)) { [lo, hi] = v } else if (/nhỏ hơn/.test(nd)) { lo = 1; hi = v[0] - 1 } else if (/hai chữ số/.test(nd)) { lo = 10; hi = 99 } else if (/ba chữ số/.test(nd)) { lo = 100; hi = 999 } else return null
    const t = []; for (let x = lo; x <= hi; x++) if (loai(x)) t.push(x); const m = trungBinh(t); return Number.isInteger(m) ? [m] : null
  },
  'day-tinh-huong'(nd) { const v = so(nd), [a, d] = v; const n = SO_CHU(nd); if (!n) return null; const t = Array.from({ length: n }, (_, i) => a + i * d); const m = trungBinh(t); return Number.isInteger(m) ? [m] : null },
  'so-lien-tiep'(nd) {
    const [m] = so(nd); const k = nd.includes('năm số') ? 5 : 3; const s = /tự nhiên/.test(nd) ? 1 : 2
    for (let a = 1; a <= m; a++) { const t = Array.from({ length: k }, (_, i) => a + i * s); if (trungBinh(t) === m && (s === 1 || (/chẵn/.test(nd) ? a % 2 === 0 : a % 2 === 1))) return t }
    return null
  },
  'hai-so-tbc-hieu'(nd) { const [m, d] = so(nd); const be = tim((b) => (b + b + d) / 2 === m); return be === null ? null : [be + d, be] },
  'them-so-tbc-moi'(nd) { const [m, x] = so(nd); const n = SO_CHU(nd); if (!n) return null; const t = (n * m + x) / (n + 1); return Number.isInteger(t) ? [t] : null },
  'bot-so-tbc-moi'(nd) { const [m, x] = so(nd); const n = SO_CHU(nd); if (!n) return null; const t = (n * m - x) / (n - 1); return Number.isInteger(t) ? [t] : null },
  'tim-so-them'(nd) { const [m, nm] = so(nd); const n = SO_CHU(nd); if (!n) return null; const x = tim((x) => (n * m + x) / (n + 1) === nm); return x === null ? null : [x] },
  'tim-so-them-nhieu'(nd) { const v = so(nd), nc = SO_CHU(nd); const n = nc ?? v[0], m = nc ? v[0] : v[1], nm = v[v.length - 1]; const x = tim((x) => (n * m + x) / (n + 1) === nm); return x === null ? null : [x] },
  'tim-so-bot'(nd) { const [m, nm] = so(nd); const n = /bố, mẹ và Hoa/.test(nd) ? 3 : SO_CHU(nd); if (!n) return null; const x = tim((x) => (n * m - x) / (n - 1) === nm, 5000); return x === null ? null : [x] },
  'tinh-so-luong-them'(nd) { const [a, b, c] = so(nd); const n = tim((n) => (n * a + b) / (n + 1) === c, 500); return n === null || n === 0 ? null : [n] },
  'tinh-so-luong-bot'(nd) { const [a, b, c] = so(nd); const n = tim((n) => n > 1 && (n * a - b) / (n - 1) === c, 500); return n === null ? null : [n] },
}
const tong = (a) => a.reduce((s, x) => s + x, 0)
/** số đếm viết bằng chữ ở đầu đề (số ngày/giờ/bài/số): "… trong ba ngày", "của năm số", "bốn bài" → n. Lấy từ đếm đầu tiên sát một danh từ đếm. */
const CHU = { hai: 2, ba: 3, bốn: 4, năm: 5, sáu: 6, bảy: 7, tám: 8, chín: 9, 'mười': 10, 'mười một': 11, 'mười hai': 12, 'mười ba': 13, 'mười bốn': 14, 'mười lăm': 15, 'mười sáu': 16, 'mười bảy': 17, 'mười tám': 18, 'mười chín': 19, 'hai mươi': 20 }
function SO_CHU(nd) {
  const re = /(?:^|[\s,:])(mười một|mười hai|mười ba|mười bốn|mười lăm|mười sáu|mười bảy|mười tám|mười chín|hai mươi|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười) (số|bài|ngày|tuần|giờ|bạn|hàng ghế|tháng)(?=[\s,.:;]|$)/g
  const hay = []; for (const m of nd.matchAll(re)) if (m[1] in CHU && !/thứ$/.test(nd.slice(0, m.index).trim())) hay.push(CHU[m[1]])
  return hay.length ? hay[0] : null
}
/** nối n từ đề cho dạng day-tinh-huong: số hàng/ngày/tuần là từ đếm đứng ngay trước danh từ */
TINH['day-tinh-huong'] = (nd) => {
  const v = so(nd), [a, d] = v
  const m = nd.match(/(?:trong|có) (mười một|mười hai|mười ba|mười bốn|mười lăm|mười sáu|mười bảy|mười tám|mười chín|hai mươi|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười) (ngày|tuần|hàng ghế)(?=[\s,.:;]|$)/); if (!m) return null
  const n = CHU[m[1]]; const t = Array.from({ length: n }, (_, i) => a + i * d); const mm = trungBinh(t); return Number.isInteger(mm) ? [mm] : null
}
// dạng 3.x: [a, b, k?] + chiều so sánh + hỏi số hay hỏi tổng, tìm bằng vét cạn số của người thứ ba
for (const ten of ['bang-tbc-x', 'bang-tbc-tong', 'hon-tbc-x', 'hon-tbc-tong', 'kem-tbc-x', 'kem-tbc-tong']) {
  TINH[ten] = (nd) => {
    const v = so(nd), a = v[0], b = v[1], k = v[2] ?? 0, dau = /nhiều hơn/.test(nd) ? 1 : /ít hơn/.test(nd) ? -1 : 0
    const x = tim((x) => { const m = (a + b + x) / 3; return Number.isInteger(m) && x === m + dau * k }, 5000); if (x === null) return null
    return /tất cả/.test(nd) ? [a + b + x] : [x]
  }
}

/** mọi `$A=B$`/`$A=B=C$` có các vế là biểu thức số thì phải bằng nhau */
export function kiemPhepTinh(s) {
  const loi = []
  for (const m of String(s).matchAll(/\$([^$]+)\$/g)) {
    let t = m[1]; if (!t.includes('=')) continue
    t = t.replace(/\\left|\\right/g, '').replace(/\\times/g, '*').replace(/\\ /g, ' ').replace(/\s+/g, '').replace(/:/g, '/')
    const ve = t.split('='); if (ve.length < 2 || !ve.every((p) => /^[\d+\-*/().]+$/.test(p))) continue
    let val; try { val = ve.map((p) => Function(`return (${p})`)()) } catch { loi.push(`không tính được: ${m[1]}`); continue }
    if (!val.every((x) => Math.abs(x - val[0]) < 1e-9)) loi.push(`phép tính SAI: $${m[1]}$ (${val.join(' ≠ ')})`)
  }
  return loi
}

export function kiemCau(c) {
  const loi = []
  const f = TINH[c.mau]; if (!f) return [`chưa có hàm kiểm cho mẫu ${c.mau}`]
  const ds = f(c.noi_dung)
  const co = (String(c.dap_an).replace(/\$/g, '').match(/\d+/g) || []).map(Number)
  if (ds == null) loi.push('bộ kiểm KHÔNG đọc được đề / không có đáp số nguyên')
  else if (!rep(ds, co)) loi.push(`đáp số lệch: kho ghi [${co}], bộ kiểm vét cạn ra [${ds}]`)
  const [p1, p2] = String(c.loi_giai).split('\n\n**Phần 2. Trình bày**\n\n')
  if (!p2) loi.push('lời giải thiếu Phần 2'); else {
    for (const l of kiemP1(p1)) loi.push(`Phần 1: ${l}`)
    if (/[⇒⇔∈≤≥]|\\Rightarrow|\\Leftrightarrow|\\in\b|\\le\b|\\ge\b/.test(p2)) loi.push('Phần 2 có kí hiệu cấm (⇒ ⇔ ∈ ≤ ≥)')
    const dong = p2.split('\n\n'); if (dong.some((d) => d.includes('\n') || !d.trim())) loi.push('Phần 2: các dòng phải cách nhau đúng một dòng trống')
    const cuoi = dong[dong.length - 1]; if (!cuoi.startsWith('Đáp số: ')) loi.push('dòng cuối Phần 2 phải là "Đáp số: …"')
    else { const dc = (cuoi.replace(/\$/g, '').match(/\d+/g) || []).map(Number); if (!rep(dc, co)) loi.push(`"Đáp số" cuối bài [${dc}] ≠ đáp án [${co}]`) }
    if (c.so_do && !/Ta có sơ đồ:/.test(p2)) loi.push('có sơ đồ nhưng Phần 2 thiếu dòng "Ta có sơ đồ:"')
    if (!c.so_do && /Ta có sơ đồ:/.test(p2)) loi.push('Phần 2 nhắc sơ đồ mà câu không có sơ đồ')
  }
  for (const l of kiemPhepTinh(c.loi_giai)) loi.push(l)
  if (c.so_do) { try { veSoDo(c.so_do) } catch (e) { loi.push(`sơ đồ bị máy từ chối: ${e.message}`) } }
  for (const k of ['noi_dung', 'loi_giai', 'dap_an']) {
    const s = String(c[k]); if ((s.match(/\$/g) || []).length % 2) loi.push(`${k}: số dấu $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch { loi.push(`${k}: công thức không render — ${m[1].slice(0, 50)}`) } }
    if (/\d{1,3} \d{3}(?!\d)/.test(s)) loi.push(`${k}: có số viết cách hàng nghìn`)
    if (/undefined|NaN|\[object/.test(s)) loi.push(`${k}: có "undefined/NaN"`)
  }
  return loi
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2), lo = JSON.parse(readFileSync(a[0], 'utf8')); let hong = 0; const dem = {}
  for (const c of lo) { const l = kiemCau(c); dem[c.dang] = dem[c.dang] || { dat: 0, hong: 0 }; if (l.length) { hong++; dem[c.dang].hong++; if (hong <= 40) console.log(`✘ ${c.dang} ${c.mau} | ${c.noi_dung.replace(/\n/g, ' ⏎ ').slice(0, 110)} | ${l.join(' · ')}`) } else dem[c.dang].dat++ }
  console.table(dem); console.log(hong ? `✘ ${hong}/${lo.length} câu không đạt` : `✔ ${lo.length}/${lo.length} câu: vét cạn khớp + mọi phép tính đúng + hình thức đạt`)
  const i = a.indexOf('--in'); if (i >= 0) writeFileSync(a[i + 1], lo.map((c, j) => `===== [${j + 1}] ${c.dang} · ${c.mau} · ĐA: ${c.dap_an}\n${c.noi_dung}\n--\n${c.loi_giai}\n`).join('\n'))
  process.exit(hong ? 1 : 0)
}
