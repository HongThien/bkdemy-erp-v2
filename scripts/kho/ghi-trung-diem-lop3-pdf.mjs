// ghi-trung-diem-lop3-pdf.mjs — clone 5 bài của "Điểm-trung-điểm-lớp-3.pdf" (Thùy 12/10), mỗi bài 5 câu tương tự, HÌNH VẼ BẰNG CODE.
//   F1 ba điểm thẳng hàng (Đúng/Sai)          F2 điểm nằm giữa hai điểm nào (sơ đồ chữ I / chữ H)
//   F3 thước đo: M trung điểm AB? B trung điểm AC?   F4 cào cào nhảy tới trung điểm (ống tre chia phần)
//   F5 lưới ô vuông: nêu trung điểm của AC, BD
// Tất cả vào dạng T103040101 · da_duyet=false.
//   node --env-file=.env scripts/kho/ghi-trung-diem-lop3-pdf.mjs [--ghi] [--xem <thư-mục>] [--mau F1,F3]
import pg from 'pg'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import puppeteer from 'puppeteer-core'
import { createClient } from '@supabase/supabase-js'
import { insertCauBatch } from '../_kho_insert.mjs'

const GHI = process.argv.includes('--ghi')
const iXem = process.argv.indexOf('--xem')
const XEM = iXem > 0 ? process.argv[iXem + 1] : null
const iMau = process.argv.indexOf('--mau')
const MAU = iMau > 0 ? process.argv[iMau + 1].toUpperCase().split(',') : ['F1', 'F2', 'F3', 'F4', 'F5']
const DANG = 'T103040101'
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

// ================= bộ vẽ SVG (đơn vị mm) =================
const f = (n) => Math.round(n * 100) / 100
const FONT = 'font-family="Times New Roman, Times, serif"'
const INK = '#2b2d8f' // nét đoạn thẳng (xanh tím như hình mẫu)
const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`
const L = (a, b, o = {}) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${o.c ?? INK}" stroke-width="${o.w ?? 0.45}"${o.dash ? ' stroke-dasharray="2 1.5"' : ''} stroke-linecap="round"/>`
const D = (p, c = '#c00', r = 0.95) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${c}"/>`
const T = (p, t, o = {}) => `<text x="${f(p[0])}" y="${f(p[1])}" font-size="${o.s ?? 6}" ${o.b === false ? '' : 'font-weight="bold" font-style="italic"'} text-anchor="${o.a ?? 'middle'}" fill="${o.c ?? '#000'}" ${FONT}>${t}</text>`
/** nhãn điểm: đặt tại p lệch (dx,dy), chỉnh baseline để tâm chữ nằm ở điểm đã lệch */
const Lab = (p, t, dx = 0, dy = -3.2, o = {}) => T([p[0] + dx, p[1] + dy + 2], t, o)
const tick = (a, b, n = 1, c = '#0a7d34') => { // n gạch "bằng nhau" ngang giữa đoạn a-b
  const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(...d) || 1
  const u = [d[0] / len, d[1] / len], nv = [-u[1], u[0]]
  let s = ''
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 1.6, c0 = [m[0] + u[0] * o, m[1] + u[1] * o]
    s += L([c0[0] - nv[0] * 2, c0[1] - nv[1] * 2], [c0[0] + nv[0] * 2, c0[1] + nv[1] * 2], { c, w: 0.5 }) }
  return s
}

// ================= F1: ba điểm thẳng hàng =================
// tri = 3 đỉnh [tên, x, y]; cap = [i, j] đỉnh nối thành đoạn; z = nhãn điểm; t = vị trí dọc đoạn; lech = độ lệch (0 = nằm trên đoạn)
const F1 = [
  { tri: [['A', 62, 9], ['B', 14, 52], ['C', 112, 50]], cap: [0, 2], z: 'Z', t: 0.45, lech: -6 },
  { tri: [['M', 22, 10], ['N', 8, 50], ['P', 108, 44]], cap: [0, 2], z: 'K', t: 0.55, lech: 0 },
  { tri: [['D', 100, 8], ['E', 12, 46], ['F', 98, 54]], cap: [1, 0], z: 'X', t: 0.4, lech: 6 },
  { tri: [['G', 20, 8], ['H', 108, 20], ['I', 52, 56]], cap: [0, 1], z: 'T', t: 0.6, lech: 0 },
  { tri: [['P', 58, 7], ['Q', 10, 54], ['R', 106, 52]], cap: [1, 2], z: 'S', t: 0.5, lech: 6 },
]
function f1(v, dapAn) {
  const tri = v.tri, P = (i) => [tri[i][1], tri[i][2]]
  const a = P(v.cap[0]), b = P(v.cap[1])
  const d = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(...d), n = [-d[1] / len, d[0] / len]
  const z = [a[0] + d[0] * v.t + n[0] * v.lech, a[1] + d[1] * v.t + n[1] * v.lech]
  let s = L(P(0), P(1)) + L(P(1), P(2)) + L(P(2), P(0))
  if (dapAn) s += L(a, b, { c: '#0a7d34', w: 0.7 })
  for (let i = 0; i < 3; i++) s += D(P(i))
  s += D(z, dapAn ? (v.lech === 0 ? '#0a7d34' : '#c00') : '#c00', 1.1)
  // nhãn đỉnh: đẩy ra xa trọng tâm
  const cx = (tri[0][1] + tri[1][1] + tri[2][1]) / 3, cy = (tri[0][2] + tri[1][2] + tri[2][2]) / 3
  for (let i = 0; i < 3; i++) { const p = P(i), u = [p[0] - cx, p[1] - cy], l = Math.hypot(...u); s += Lab(p, tri[i][0], (u[0] / l) * 5, (u[1] / l) * 5) }
  const side = v.lech === 0 ? (n[0] > 0 ? 1 : 1) : Math.sign(v.lech)
  s += Lab(z, v.z, n[0] * 5 * (side || 1) * (v.lech === 0 ? 1 : 1), n[1] * 5 * (side || 1) * (v.lech === 0 ? 1 : 1), { s: 5.5 })
  return svgDoc(122, 72, s)
}
const cauF1 = F1.map((v, i) => {
  const A = v.tri[v.cap[0]][0], C = v.tri[v.cap[1]][0], z = v.z, dung = v.lech === 0
  return {
    ma: `F1-${i + 1}`, svgDe: f1(v, false), svgDa: f1(v, true),
    noi_dung: `Cho hình vẽ. Ba điểm ${A}, ${z}, ${C} là ba điểm thẳng hàng. Đúng hay sai?`,
    dap_an: dung ? 'Đúng' : 'Sai',
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      `**Mấu chốt:** Ba điểm thẳng hàng là ba điểm cùng nằm trên một đường thẳng; điểm ${z} nằm trên đoạn thẳng ${A}${C} thì ba điểm ${A}, ${z}, ${C} thẳng hàng.`,
      `**Bước 1.** Tìm hai điểm ${A} và ${C} trên hình, tưởng tượng nối chúng bằng một đoạn thẳng ${A}${C} (có thể dùng thước kẻ để kiểm tra).`,
      `**Bước 2.** Nhìn vị trí điểm ${z}: nằm đúng trên đoạn thẳng ${A}${C} hay lệch ra khỏi đoạn thẳng đó.`,
      `**Bước 3.** Kết luận: nằm trên đoạn thẳng thì ba điểm thẳng hàng (Đúng), lệch ra ngoài thì không thẳng hàng (Sai).`,
      '**Phần 2. Trình bày**',
      dung ? `${z} nằm trên đoạn thẳng ${A}${C} nên ba điểm ${A}, ${z}, ${C} thẳng hàng.` : `${z} không nằm trên đoạn thẳng ${A}${C} nên ba điểm ${A}, ${z}, ${C} không thẳng hàng.`,
      `Vậy: ${dung ? 'Đúng' : 'Sai'}.`,
    ].join('\n\n'),
  }
})

// ================= F2: điểm nằm giữa hai điểm nào =================
// kieu 'I' (hai thanh ngang nối bằng đoạn dọc) hoặc 'H' (xoay 90°). top = [đầu1, đầu2, giao], bot = [..], p = nhãn điểm, t = vị trí P dọc đoạn nối
const F2 = [
  { kieu: 'I', top: ['A', 'B', 'O'], bot: ['C', 'D', 'I'], p: 'P', t: 0.5 },
  { kieu: 'H', top: ['M', 'N', 'K'], bot: ['E', 'F', 'H'], p: 'Q', t: 0.4 },
  { kieu: 'I', top: ['X', 'Y', 'U'], bot: ['G', 'L', 'V'], p: 'S', t: 0.6 },
  { kieu: 'H', top: ['A', 'B', 'C'], bot: ['D', 'E', 'G'], p: 'P', t: 0.5 },
  { kieu: 'I', top: ['R', 'S', 'M'], bot: ['T', 'W', 'N'], p: 'K', t: 0.45 },
]
function f2(v, dapAn) {
  // (u dọc thanh, w vuông góc) → (x,y); kiểu H hoán đổi x↔y. Thanh trên ngắn (u 16..48, w 9), thanh dưới dài (u 4..64, w 34).
  const m = (u, w) => (v.kieu === 'I' ? [u + 6, w + 8] : [w + 8, u + 6])
  const t1 = [m(16, 9), m(48, 9)], o = m(32, 9)
  const t2 = [m(4, 34), m(64, 34)], i = m(32, 34)
  const pp = [o[0] + (i[0] - o[0]) * v.t, o[1] + (i[1] - o[1]) * v.t]
  let s = L(t1[0], t1[1]) + L(t2[0], t2[1]) + L(o, i, dapAn ? { c: '#0a7d34', w: 0.8 } : {})
  for (const q of [t1[0], t1[1], o, t2[0], t2[1], i]) s += D(q)
  s += D(pp, dapAn ? '#0a7d34' : '#c00', 1.1)
  // nhãn lệch theo (du, dw) trong hệ (u,w) rồi đổi sang x,y
  const lab = (q, t, du, dw, o2 = {}) => { const d = v.kieu === 'I' ? [du, dw] : [dw, du]; return T([q[0] + d[0], q[1] + d[1] + 2], t, o2) }
  s += lab(t1[0], v.top[0], 0, -4.2) + lab(t1[1], v.top[1], 0, -4.2) + lab(o, v.top[2], 0, -4.2)
  s += lab(t2[0], v.bot[0], 0, 5.5) + lab(t2[1], v.bot[1], 0, 5.5) + lab(i, v.bot[2], 0, 5.5)
  s += lab(pp, v.p, 5, 0, { s: 5.5 })
  return svgDoc(...(v.kieu === 'I' ? [76, 52] : [52, 76]), s)
}
const cauF2 = F2.map((v, k) => ({
  ma: `F2-${k + 1}`, svgDe: f2(v, false), svgDa: f2(v, true),
  noi_dung: `${v.p} là điểm nằm giữa hai điểm nào?`,
  dap_an: `${v.top[2]} và ${v.bot[2]}`,
  loi_giai: [
    '**Phần 1. Hướng dẫn**',
    `**Mấu chốt:** Điểm nằm giữa hai điểm là điểm nằm trên đoạn thẳng nối hai điểm đó, ở vị trí giữa hai đầu đoạn thẳng.`,
    `**Bước 1.** Tìm đoạn thẳng đi qua điểm ${v.p} trên hình: đó là đoạn thẳng nối hai điểm ${v.top[2]} và ${v.bot[2]}.`,
    `**Bước 2.** Xác định hai đầu của đoạn thẳng ấy, đó là hai điểm ${v.top[2]} và ${v.bot[2]}.`,
    `**Bước 3.** Điểm ${v.p} nằm trên đoạn thẳng ${v.top[2]}${v.bot[2]}, ở giữa hai đầu, nên ${v.p} nằm giữa hai điểm ${v.top[2]} và ${v.bot[2]}.`,
    '**Phần 2. Trình bày**',
    `${v.p} nằm giữa hai điểm ${v.top[2]} và ${v.bot[2]}.`,
  ].join('\n\n'),
}))

// ================= F3: thước đo =================
// m, b, c = vị trí (cm) của M, B, C trên thước (A ở 0). Thước dài 0–16 cm.
const F3 = [{ m: 4, b: 8, c: 13 }, { m: 3, b: 6, c: 12 }, { m: 5, b: 9, c: 14 }, { m: 4, b: 7, c: 14 }, { m: 5, b: 10, c: 15 }]
function f3(v, dapAn) {
  const x0 = 12, u = 8.6, y = 12, ry = 20, W = x0 * 2 + 16 * u + 6
  const X = (cm) => x0 + cm * u
  let s = L([X(0), y], [X(v.c), y], { c: '#222', w: 0.4 })
  for (const [cm, n] of [[0, 'A'], [v.m, 'M'], [v.b, 'B'], [v.c, 'C']]) { s += D([X(cm), y], '#222', 0.9) + T([X(cm), y - 4], n, { s: 6, b: false }) }
  s += `<rect x="${f(X(0) - 4)}" y="${ry}" width="${f(16 * u + 12)}" height="15" rx="2" fill="#f7b6d2"/>`
  for (let k = 0; k <= 16; k++) {
    s += L([X(k), ry + 1.5], [X(k), ry + 6], { c: '#444', w: 0.3 })
    if (k < 16) s += L([X(k + 0.5), ry + 1.5], [X(k + 0.5), ry + 4.2], { c: '#444', w: 0.25 })
    s += T([X(k) + (k === 0 ? -1.2 : 0), ry + 11.5], k === 0 ? '0 cm' : String(k), { s: 3.6, b: false, a: k === 0 ? 'start' : 'middle' }).replace(/x="([\d.]+)"/, (_, x) => `x="${k === 0 ? f(X(0) - 3.2) : x}"`)
  }
  let h = 41
  if (dapAn) { // 2 dấu ngoặc đoạn đo
    const br = (a, b2, t, yy, c) => L([X(a), yy], [X(b2), yy], { c, w: 0.5 }) + L([X(a), yy - 1.5], [X(a), yy + 1.5], { c, w: 0.5 }) + L([X(b2), yy - 1.5], [X(b2), yy + 1.5], { c, w: 0.5 }) + T([X((a + b2) / 2), yy + 6], t, { s: 4.4, b: false, c })
    s += br(0, v.m, `AM = ${v.m} cm`, 42, '#0a7d34') + br(v.m, v.b, `MB = ${v.b - v.m} cm`, 42, '#0a7d34')
    s += br(0, v.b, `AB = ${v.b} cm`, 55, '#b45309') + br(v.b, v.c, `BC = ${v.c - v.b} cm`, 55, '#b45309')
    h = 66
  }
  return svgDoc(f(W), h, s)
}
const cauF3 = F3.map((v, i) => {
  const am = v.m, mb = v.b - v.m, ab = v.b, bc = v.c - v.b
  const a = am === mb, b = ab === bc
  return {
    ma: `F3-${i + 1}`, svgDe: f3(v, false), svgDa: f3(v, true),
    noi_dung: `Cho hình vẽ, biết A, M, B, C cùng nằm trên một đường thẳng. Dựa vào số đo trên thước, hãy trả lời:\n\na) Điểm M có là trung điểm của đoạn thẳng AB hay không?\n\nb) Điểm B có là trung điểm của đoạn thẳng AC hay không?`,
    dap_an: `${a ? 'Có' : 'Không'}; ${b ? 'Có' : 'Không'}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Điểm là trung điểm của một đoạn thẳng khi nó nằm giữa hai đầu và cách đều hai đầu đoạn thẳng, tức là hai đoạn nhỏ có độ dài bằng nhau.',
      '**Bước 1.** Đọc số đo của từng điểm A, M, B, C trên thước (điểm A trùng vạch 0).',
      `**Bước 2.** Tính độ dài các đoạn thẳng cần so sánh: với câu a là AM và MB, với câu b là AB và BC (lấy số đo lớn trừ số đo nhỏ).`,
      '**Bước 3.** So sánh hai độ dài: bằng nhau thì điểm đó là trung điểm, khác nhau thì không phải.',
      '**Phần 2. Trình bày**',
      'a) Ta có:',
      `AM = ${am} cm, MB = ${v.b} − ${v.m} = ${mb} cm.`,
      a ? 'Vì AM = MB nên M là trung điểm của đoạn thẳng AB.' : `Vì AM = ${am} cm, MB = ${mb} cm nên M không là trung điểm của đoạn thẳng AB.`,
      `Vậy câu a: ${a ? 'Có' : 'Không'}.`,
      'b) Ta có:',
      `AB = ${ab} cm, BC = ${v.c} − ${v.b} = ${bc} cm.`,
      b ? 'Vì AB = BC nên B là trung điểm của đoạn thẳng AC.' : `Vì AB = ${ab} cm; BC = ${bc} cm nên B không là trung điểm của đoạn thẳng AC.`,
      `Vậy câu b: ${b ? 'Có' : 'Không'}.`,
    ].join('\n\n'),
  }
})

// ================= F4: cào cào nhảy tới trung điểm =================
const F4 = [{ n: 8, k: 1 }, { n: 10, k: 3 }, { n: 12, k: 2 }, { n: 6, k: 1 }, { n: 14, k: 4 }]
function f4(v, dapAn) {
  const x0 = 10, tot = 126, w = tot / v.n, y = 20, hh = 11
  const X = (p) => x0 + p * w
  let s = ''
  for (let p = 0; p < v.n; p++) s += `<rect x="${f(X(p))}" y="${y}" width="${f(w)}" height="${hh}" rx="1.2" fill="#8fd16a" stroke="#3b7a1e" stroke-width="0.5"/>`
  s += L([X(0), y], [X(v.n), y], { c: '#e11', w: 0.9 }) + L([X(0), y - 2.2], [X(0), y + 2.2], { c: '#e11', w: 0.8 }) + L([X(v.n), y - 2.2], [X(v.n), y + 2.2], { c: '#e11', w: 0.8 })
  s += T([X(0) - 5.5, y - 3], 'A', { s: 6, b: false }) + T([X(v.n) + 5.5, y - 3], 'B', { s: 6, b: false })
  for (let p = 0; p < v.k; p++) s += `<path d="M ${f(X(p))} ${y} Q ${f((X(p) + X(p + 1)) / 2)} ${y - 11} ${f(X(p + 1))} ${y}" fill="none" stroke="#222" stroke-width="0.4"/>`
  // cào cào đứng tại X(k)
  const gx = X(v.k), gy = y - 2
  s += `<ellipse cx="${f(gx)}" cy="${f(gy - 2.4)}" rx="3.3" ry="1.7" fill="#4c9a2a" stroke="#1f5c0d" stroke-width="0.35"/><circle cx="${f(gx + 3.6)}" cy="${f(gy - 3.2)}" r="1.3" fill="#4c9a2a" stroke="#1f5c0d" stroke-width="0.35"/>` +
    L([gx - 2, gy - 1], [gx - 4.5, gy + 1.5], { c: '#1f5c0d', w: 0.4 }) + L([gx + 0.5, gy - 1], [gx + 1.5, gy + 1.5], { c: '#1f5c0d', w: 0.4 }) +
    L([gx + 3.8, gy - 4.3], [gx + 6, gy - 7], { c: '#1f5c0d', w: 0.3 })
  if (dapAn) {
    const mid = v.n / 2
    s += L([X(mid), y - 9], [X(mid), y + hh + 2], { c: '#0a7d34', w: 0.7, dash: true }) + T([X(mid), y - 11], 'trung điểm', { s: 4.6, b: false, c: '#0a7d34' })
    for (let p = v.k; p < mid; p++) s += `<path d="M ${f(X(p))} ${y + hh} Q ${f((X(p) + X(p + 1)) / 2)} ${y + hh + 9} ${f(X(p + 1))} ${y + hh}" fill="none" stroke="#0a7d34" stroke-width="0.5" stroke-dasharray="1.6 1.2"/>`
  }
  return svgDoc(f(tot + 24), dapAn ? 52 : 42, s)
}
const cauF4 = F4.map((v, i) => {
  const mid = v.n / 2, con = mid - v.k
  return {
    ma: `F4-${i + 1}`, svgDe: f4(v, false), svgDa: f4(v, true),
    noi_dung: `Cào cào cần nhảy thêm mấy bước để đến trung điểm của đoạn thẳng AB? (Mỗi bước nhảy dài đúng một phần của đoạn thẳng AB.)`,
    dap_an: String(con),
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Trung điểm của một đoạn thẳng là điểm chia đoạn thẳng đó thành hai phần bằng nhau, nên nó nằm ở đúng giữa, cách mỗi đầu một nửa số phần.',
      `**Bước 1.** Đếm số phần bằng nhau của đoạn thẳng AB trên hình: AB được chia thành ${v.n} phần.`,
      `**Bước 2.** Tìm vị trí trung điểm: chia đôi số phần, trung điểm cách A là ${v.n} : 2 = ${mid} phần.`,
      `**Bước 3.** Nhìn hình để biết cào cào đang cách A bao nhiêu phần (bằng số bước đã nhảy): ${v.k} phần.`,
      '**Bước 4.** Lấy khoảng cách từ A tới trung điểm trừ đi khoảng cách cào cào đã đi, được số bước còn phải nhảy.',
      '**Phần 2. Trình bày**',
      `Đoạn thẳng AB được chia thành ${v.n} phần bằng nhau.`,
      `Trung điểm của đoạn thẳng AB cách A là ${v.n} : 2 = ${mid} (phần).`,
      `Cào cào hiện đang ở vị trí cách A ${v.k} phần.`,
      'Vậy cào cào cần nhảy thêm:',
      `${mid} − ${v.k} = ${con} (bước)`,
      `Đáp số: ${con} bước.`,
    ].join('\n\n'),
  }
})

// ================= F5: lưới ô vuông =================
// toạ độ nguyên theo ô; a,c cùng hàng; b,d cùng cột (cột giao điểm); pts = các điểm có nhãn thêm {ten, [col,row]}
const F5 = [
  { n: { A: 'A', B: 'B', C: 'C', D: 'D' }, a: [1, 5], c: [13, 5], b: [5, 1], d: [5, 9], extra: { G: [5, 5], H: [7, 5] } },
  { n: { A: 'M', B: 'N', C: 'P', D: 'Q' }, a: [2, 5], c: [12, 5], b: [4, 2], d: [4, 8], extra: { I: [4, 5], K: [7, 5] } },
  { n: { A: 'X', B: 'Y', C: 'Z', D: 'T' }, a: [1, 6], c: [9, 6], b: [3, 2], d: [3, 10], extra: { U: [3, 6], V: [5, 6] } },
  { n: { A: 'A', B: 'B', C: 'C', D: 'D' }, a: [2, 5], c: [12, 5], b: [6, 1], d: [6, 7], extra: { G: [6, 5], H: [7, 5], K: [6, 4] } },
  { n: { A: 'E', B: 'F', C: 'H', D: 'I' }, a: [2, 5], c: [12, 5], b: [7, 2], d: [7, 8], extra: { G: [7, 5], K: [4, 5] } },
]
const keyP = (p) => `${p[0]},${p[1]}`
function f5(v, dapAn) {
  const u = 7, cols = 15, rows = 11, ox = 6, oy = 6
  const P = (p) => [ox + p[0] * u, oy + p[1] * u]
  let s = ''
  for (let i = 0; i <= cols; i++) s += L([ox + i * u, oy], [ox + i * u, oy + rows * u], { c: '#9fdde6', w: 0.25 })
  for (let j = 0; j <= rows; j++) s += L([ox, oy + j * u], [ox + cols * u, oy + j * u], { c: '#9fdde6', w: 0.25 })
  const A = P(v.a), B = P(v.b), C = P(v.c), Dd = P(v.d)
  s += L(A, B, { c: '#222' }) + L(B, C, { c: '#222' }) + L(C, Dd, { c: '#222' }) + L(Dd, A, { c: '#222' }) + L(A, C, { c: '#222' }) + L(B, Dd, { c: '#222' })
  const mAC = [(v.a[0] + v.c[0]) / 2, (v.a[1] + v.c[1]) / 2], mBD = [(v.b[0] + v.d[0]) / 2, (v.b[1] + v.d[1]) / 2]
  const tenMid = (m) => Object.entries(v.extra).find(([, p]) => p[0] === m[0] && p[1] === m[1])?.[0] ?? null
  const dots = [[v.n.A, v.a, -3.5, 3.8], [v.n.B, v.b, 3.2, -1.2], [v.n.C, v.c, 3.6, 3.8], [v.n.D, v.d, 3.2, 3.8]]
  for (const [t, p, dx, dy] of dots) s += D(P(p), '#111', 0.9) + T([P(p)[0] + dx, P(p)[1] + dy], t, { s: 5, b: false, a: 'middle' })
  for (const [t, p] of Object.entries(v.extra)) s += D(P(p), '#111', 0.9) + T([P(p)[0] + 0.5, P(p)[1] + 5], t, { s: 5, b: false })
  if (dapAn) {
    for (const [m, ends] of [[mAC, [A, C]], [mBD, [B, Dd]]]) {
      const M = P(m); s += D(M, '#0a7d34', 1.4) + tick(ends[0], M, 1) + tick(M, ends[1], 1)
    }
  }
  return { svg: svgDoc(f(ox * 2 + cols * u), f(oy * 2 + rows * u), s), mAC, mBD, tenAC: tenMid(mAC), tenBD: tenMid(mBD) }
}
const cauF5 = F5.map((v, i) => {
  const de = f5(v, false), da = f5(v, true)
  const { A, B, C, D: Dn } = v.n
  const lenAC = Math.abs(v.c[0] - v.a[0]), lenBD = Math.abs(v.d[1] - v.b[1])
  if (!de.tenAC || !de.tenBD) throw new Error(`F5-${i + 1}: thiếu nhãn trung điểm`)
  return {
    ma: `F5-${i + 1}`, svgDe: de.svg, svgDa: da.svg,
    noi_dung: `Nêu tên trung điểm của các đoạn thẳng ${A}${C}, ${B}${Dn} trong hình vẽ.`,
    dap_an: `${de.tenAC} là trung điểm của ${A}${C}; ${de.tenBD} là trung điểm của ${B}${Dn}`,
    loi_giai: [
      '**Phần 1. Hướng dẫn**',
      '**Mấu chốt:** Trung điểm của một đoạn thẳng nằm chính giữa đoạn thẳng đó, cách đều hai đầu; trên lưới ô vuông ta đếm số ô để tìm điểm chính giữa.',
      `**Bước 1.** Đếm số ô vuông dọc theo từng đoạn thẳng ${A}${C} và ${B}${Dn} để biết độ dài mỗi đoạn.`,
      '**Bước 2.** Chia đôi số ô vừa đếm để biết điểm chính giữa mỗi đoạn thẳng cách một đầu bao nhiêu ô.',
      '**Bước 3.** Tìm điểm đã được đặt tên nằm đúng vị trí chính giữa, kiểm tra lại bằng cách đếm số ô về hai phía.',
      '**Phần 2. Trình bày**',
      `Đoạn thẳng ${A}${C} dài ${lenAC} ô vuông, một nửa là ${lenAC / 2} ô. Điểm ${de.tenAC} cách ${A} và cách ${C} đều ${lenAC / 2} ô nên ${de.tenAC} là trung điểm của đoạn thẳng ${A}${C}.`,
      `Đoạn thẳng ${B}${Dn} dài ${lenBD} ô vuông, một nửa là ${lenBD / 2} ô. Điểm ${de.tenBD} cách ${B} và cách ${Dn} đều ${lenBD / 2} ô nên ${de.tenBD} là trung điểm của đoạn thẳng ${B}${Dn}.`,
    ].join('\n\n'),
  }
})

const TAT_CA = { F1: cauF1, F2: cauF2, F3: cauF3, F4: cauF4, F5: cauF5 }
const cau = MAU.flatMap((m) => TAT_CA[m])

// ================= render + upload =================
const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
async function png(s) {
  const w = Math.ceil(+s.match(/width="([\d.]+)mm"/)[1] * 3.7795), h = Math.ceil(+s.match(/height="([\d.]+)mm"/)[1] * 3.7795)
  const pg = await br.newPage()
  await pg.setViewport({ width: w, height: h, deviceScaleFactor: 3 })
  await pg.setContent(`<body style="margin:0;background:#fff">${s}</body>`)
  const b = Buffer.from(await pg.screenshot({ clip: { x: 0, y: 0, width: w, height: h } }))
  await pg.close()
  return b
}
const env = {}
for (const l of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
  if (!l.includes('=') || l.trim().startsWith('#')) continue
  const i = l.indexOf('=')
  env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '')
}
const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })
async function up(buf) {
  const path = `trung-diem/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.png`
  if (!GHI) return `dry://kho-anh/${path}`
  const { error } = await sb.storage.from('kho-anh').upload(path, buf, { contentType: 'image/png', upsert: false })
  if (error) throw new Error(`upload: ${error.message}`)
  return sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
}

try {
  if (XEM) mkdirSync(XEM, { recursive: true })
  const cauList = []
  // Đề giống hệt chữ nhưng KHÁC HÌNH (F3/F4/F5) ⇒ bộ lọc trùng theo nội dung sẽ nuốt nhầm ⇒ choTrung=true; thay vào đó chống ghi lặp theo ten_de_goc.
  let daCo = new Set()
  if (!XEM) {
    const db0 = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
    await db0.connect()
    daCo = new Set((await db0.query("select ten_de_goc from dai_cau_hoi where xoa_at is null and ten_de_goc like 'Trung điểm lớp 3 (PDF) · %'")).rows.map((r) => r.ten_de_goc))
    await db0.end()
  }
  for (const c of cau) {
    if (daCo.has(`Trung điểm lớp 3 (PDF) · ${c.ma}`)) continue
    const de = await png(c.svgDe), da = await png(c.svgDa)
    if (XEM) { writeFileSync(`${XEM}/${c.ma}-de.png`, de); writeFileSync(`${XEM}/${c.ma}-da.png`, da); continue }
    cauList.push({
      dang_chinh: DANG, loai_cau: 'tra_loi_ngan', noi_dung: c.noi_dung, dap_an: c.dap_an, loi_giai: c.loi_giai,
      anh_de: await up(de), anh_dap_an: await up(da), nguon: 'le', nguon_giai: 'nguoi', ten_de_goc: `Trung điểm lớp 3 (PDF) · ${c.ma}`,
    })
  }
  if (XEM) console.log(`Đã xuất ${cau.length * 2} ảnh vào ${XEM}`)
  else {
    const db = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 })
    await db.connect()
    await db.query('begin')
    try {
      if (!cauList.length) throw new Error("Không còn câu nào cần ghi")
      const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList, choTrung: true })
      console.log(`${maCauList.length} mã: ${maCauList[0]} … ${maCauList.at(-1)}${trung.length ? ' · trùng ' + JSON.stringify(trung) : ''}`)
      await db.query(GHI ? 'commit' : 'rollback')
      console.log(GHI ? '✅ ĐÃ GHI' : '↩ chạy thử, ROLLBACK')
    } catch (e) { await db.query('rollback'); throw e } finally { await db.end() }
  }
} finally { await br.close() }
