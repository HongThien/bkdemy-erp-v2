// Vẽ lại bằng code 11 hình trong VÍ DỤ của bản đồ mới K10 "Hàm số, đồ thị và ứng dụng" (NCD00234) — Thùy 05/11.
// Hình hàm số/parabol/bảng biến thiên vẽ đúng công thức (không ước mắt). Mỗi hình theo đúng đề + lời giải của câu thật.
//   node scripts/anh/ve_do_thi_k10_ham_so.mjs ve                 → vẽ ra C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/k10-ham-so/*.png (+svg)
//   node scripts/anh/ve_do_thi_k10_ham_so.mjs gan [--ghi]        → upload bucket kho-anh + thay URL cũ→mới TRONG vi_du của các dạng (KHÔNG đụng dai_cau_hoi)
import fs from 'node:fs'
import puppeteer from 'puppeteer-core'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
process.loadEnvFile('.env')
const OUT = 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/k10-ham-so'
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const f = (n) => Math.round(n * 100) / 100
const FONT = `font-family="'Times New Roman',serif"`
const txt = (x, y, t, { size = 20, it = false, anchor = 'middle', fill = '#111' } = {}) =>
  `<text x="${f(x)}" y="${f(y)}" font-size="${size}" ${FONT} ${it ? 'font-style="italic"' : ''} text-anchor="${anchor}" fill="${fill}" stroke="#fff" stroke-width="4" paint-order="stroke">${t}</text>`
const arrow = (x1, y1, x2, y2, sw = 1.6) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 9, W = 4
  const bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a)
  return `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(bx)}" y2="${f(by)}" stroke-width="${sw}"/><path d="M ${f(x2)} ${f(y2)} L ${f(bx - W * Math.sin(a))} ${f(by + W * Math.cos(a))} L ${f(bx + W * Math.sin(a))} ${f(by - W * Math.cos(a))} Z" fill="#111" stroke="none"/>`
}
const dash = (x1, y1, x2, y2) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="1.3" stroke-dasharray="6 5"/>`
const dot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.8" fill="#111" stroke="none"/>`
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/><g stroke="#111" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none">${body}</g></svg>`

// Hệ trục: miền toán [x0,x1]×[y0,y1] → khung px (ox,oy,w,h); trục vẽ qua gốc nếu gốc nằm trong miền
function he({ ox = 0, oy = 0, w, h, x0, x1, y0, y1 }) {
  const X = (x) => ox + ((x - x0) / (x1 - x0)) * w, Y = (y) => oy + h - ((y - y0) / (y1 - y0)) * h
  return { X, Y, x0, x1, y0, y1, w, h, ox, oy }
}
function truc(H, { xl = 'x', yl = 'y', O = true, oOff = [-13, 18] } = {}) {
  const { X, Y } = H
  let s = arrow(X(H.x0), Y(0), X(H.x1), Y(0)) + arrow(X(0), Y(H.y0), X(0), Y(H.y1))
  s += txt(X(H.x1) - 4, Y(0) + 22, xl, { it: true }) + txt(X(0) + 18, Y(H.y1) + 10, yl, { it: true })
  if (O) s += txt(X(0) + oOff[0], Y(0) + oOff[1], 'O', { it: true })
  return s
}
function duong(H, fn, a, b, n = 160, sw = 2.3) {
  let d = ''
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; d += `${i ? 'L' : 'M'} ${f(H.X(x))} ${f(H.Y(fn(x)))} ` }
  return `<path d="${d}" stroke-width="${sw}"/>`
}

// Bảng biến thiên: cols = [{x:'-∞'|'0'..., y:'giá trị', pos:'top'|'bot'}], mũi tên giữa các cột liên tiếp theo pos
function bbt(w, cols) {
  const h = 150, c0 = 74, rowH = 50, n = cols.length, step = (w - c0 - 16) / (n - 1)
  const cx = (i) => c0 + 8 + step * i
  let s = `<rect x="2" y="2" width="${w - 4}" height="${h - 4}" stroke-width="1.6"/><line x1="2" y1="${rowH}" x2="${w - 2}" y2="${rowH}"/><line x1="${c0}" y1="2" x2="${c0}" y2="${h - 2}"/>`
  s += txt(c0 / 2, 33, 'x', { it: true, size: 22 }) + txt(c0 / 2, rowH + 52, 'f(x)', { it: true, size: 22 })
  const yTop = rowH + 30, yBot = h - 24
  cols.forEach((c, i) => {
    const xr = i === 0 ? cx(i) + 4 : i === n - 1 ? cx(i) - 6 : cx(i)
    s += txt(xr, 33, c.x, { size: 22, anchor: i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle' }).replace(`x="${f(xr)}"`, `x="${f(i === 0 ? c0 + 10 : i === n - 1 ? w - 12 : cx(i))}"`)
  })
  const px = (i) => (i === 0 ? c0 + 36 : i === n - 1 ? w - 36 : cx(i))
  const py = (c) => (c.pos === 'top' ? yTop : yBot)
  cols.forEach((c, i) => { s += txt(px(i), py(c) + (c.pos === 'top' ? 0 : 0), c.y, { size: 22 }) })
  for (let i = 0; i < n - 1; i++) {
    const a = cols[i], b = cols[i + 1]
    const x1 = px(i) + (i === 0 ? 14 : 22), x2 = px(i + 1) - (i + 1 === n - 1 ? 14 : 22)
    const y1 = a.pos === 'top' ? yTop + 8 : yBot - 22, y2 = b.pos === 'top' ? yTop + 6 : yBot - 20
    s += arrow(x1, a.pos === 'top' ? y1 : y1, x2, b.pos === 'top' ? y2 - 2 : y2 + 2, 1.2)
  }
  return svgDoc(w, h, s)
}

const FIG = {}
// 1) T110000000095 — BBT: −∞ ↗ 2 (x=0) ↘ −2 (x=1) ↗ +∞
FIG['T110000000095_de'] = bbt(480, [{ x: '−∞', y: '−∞', pos: 'bot' }, { x: '0', y: '2', pos: 'top' }, { x: '1', y: '−2', pos: 'bot' }, { x: '+∞', y: '+∞', pos: 'top' }])
// 9) T1100000005801 — BBT: +∞ ↘ −1 (x=2) ↗ +∞
FIG['T1100000005801_de'] = bbt(420, [{ x: '−∞', y: '+∞', pos: 'top' }, { x: '2', y: '−1', pos: 'bot' }, { x: '+∞', y: '+∞', pos: 'top' }])

// 2) T1100000001246 — y = x²−4x+3
{ const H = he({ ox: 40, oy: 30, w: 330, h: 300, x0: -0.6, x1: 4.6, y0: -1.7, y1: 4.2 }); const { X, Y } = H
  FIG['T1100000001246_dap_an'] = svgDoc(420, 380,
    truc(H) + duong(H, (x) => x * x - 4 * x + 3, -0.45, 4.45) + dash(X(2), Y(4.0), X(2), Y(-1.5)) + dash(X(0), Y(-1), X(2), Y(-1))
    + [[0, 3], [1, 0], [3, 0], [2, 0], [2, -1], [0, -1]].map(([x, y]) => dot(X(x), Y(y))).join('')
    + txt(X(0) - 12, Y(3) + 6, '3', { anchor: 'end' }) + txt(X(0) - 12, Y(-1) + 6, '−1', { anchor: 'end' })
    + txt(X(1), Y(0) + 24, '1') + txt(X(2), Y(0) + 24, '2') + txt(X(3), Y(0) + 24, '3')) }
// 3) T1100000001253 — y = 2x²−3x+1 (đi qua (0;1), (1;0))
{ const H = he({ ox: 30, oy: 24, w: 300, h: 250, x0: -0.7, x1: 1.9, y0: -0.5, y1: 2.4 }); const { X, Y } = H
  FIG['T1100000001253_de'] = svgDoc(360, 320,
    truc(H) + duong(H, (x) => 2 * x * x - 3 * x + 1, -0.3, 1.65) + dot(X(0), Y(1)) + dot(X(1), Y(0))
    + txt(X(0) - 12, Y(1) + 6, '1', { anchor: 'end' }) + txt(X(1), Y(0) + 24, '1')) }
// 4) T1100000001740 — y = −½x²+2x−2 (đỉnh (2;0)); các điểm (−2;−8),(0;−2),(4;−2),(6;−8)
{ const H = he({ ox: 34, oy: 40, w: 420, h: 340, x0: -3, x1: 7.4, y0: -9.4, y1: 1.2 }); const { X, Y } = H
  const fn = (x) => -0.5 * x * x + 2 * x - 2
  FIG['T1100000001740_dap_an'] = svgDoc(500, 420,
    truc(H, { O: false }) + duong(H, fn, -2.6, 6.6)
    + dash(X(-2), Y(0), X(-2), Y(-8)) + dash(X(6), Y(0), X(6), Y(-8)) + dash(X(4), Y(0), X(4), Y(-2)) + dash(X(0), Y(-8), X(6), Y(-8)) + dash(X(0), Y(-2), X(4), Y(-2))
    + [[-2, 0], [0, 0], [2, 0], [4, 0], [6, 0], [-2, -8], [0, -8], [6, -8], [0, -2], [4, -2]].map(([x, y]) => dot(X(x), Y(y))).join('')
    + [[-2, '−2'], [2, '2'], [4, '4'], [6, '6']].map(([x, t]) => txt(X(x), Y(0) - 12, t)).join('') + txt(X(0) - 14, Y(0) - 12, 'O', { it: true })
    + txt(X(0) - 12, Y(-2) + 6, '−2', { anchor: 'end' }) + txt(X(0) - 12, Y(-8) + 6, '−8', { anchor: 'end' })) }
// 5) T1100000003139 — hàm trên [−3;2]: đoạn thẳng (−3;2)→(−1;4), rồi y=(x−1)² (qua (−1;4),(0;1),(1;0),(2;1))
{ const H = he({ ox: 30, oy: 30, w: 400, h: 300, x0: -4, x1: 3.2, y0: -0.7, y1: 4.8 }); const { X, Y } = H
  FIG['T1100000003139_de'] = svgDoc(470, 370,
    truc(H, { oOff: [14, 22] }) + `<path d="M ${f(X(-3))} ${f(Y(2))} L ${f(X(-1))} ${f(Y(4))}" stroke-width="2.3"/>` + duong(H, (x) => (x - 1) * (x - 1), -1, 2, 120)
    + dash(X(-3), Y(0), X(-3), Y(2)) + dash(X(-3), Y(2), X(0), Y(2)) + dash(X(-1), Y(0), X(-1), Y(4)) + dash(X(-1), Y(4), X(0), Y(4)) + dash(X(2), Y(0), X(2), Y(1)) + dash(X(0), Y(1), X(2), Y(1))
    + [-3, -1, 1, 2].map((x) => txt(X(x), Y(0) + 24, x < 0 ? `−${-x}` : `${x}`)).join('')
    + [[2, '2'], [4, '4'], [1, '1']].map(([y, t]) => txt(X(0) + 16, Y(y) + 6, t, { anchor: 'start' })).join('')) }
// 6) T1100000003290 — a>0, c>0, đỉnh bên phải trục tung (không ghi số): y = 0.45(x−1.3)² + 0.25
{ const H = he({ ox: 20, oy: 20, w: 300, h: 260, x0: -1.9, x1: 3.9, y0: -0.8, y1: 4.1 }); const { X, Y } = H
  FIG['T1100000003290_de'] = svgDoc(340, 300, truc(H, { oOff: [-14, 20] }) + duong(H, (x) => 0.45 * (x - 1.3) * (x - 1.3) + 0.25, -1.1, 3.7) + dot(X(0), Y(0.45 * 1.69 + 0.25))) }
// 7) T1100000004300 — y = −x²−2x+3 : đỉnh (−1;4), cắt Ox tại −3 và 1, cắt Oy tại 3
{ const H = he({ ox: 30, oy: 24, w: 300, h: 270, x0: -4.2, x1: 2.4, y0: -1.3, y1: 5 }); const { X, Y } = H
  FIG['T1100000004300_de'] = svgDoc(360, 330,
    truc(H, { oOff: [14, 20] }) + duong(H, (x) => -x * x - 2 * x + 3, -3.4, 1.4) + dash(X(-1), Y(0), X(-1), Y(4)) + dash(X(-1), Y(4), X(0), Y(4))
    + dot(X(0), Y(3)) + dot(X(0), Y(4)) + dot(X(-3), Y(0)) + dot(X(1), Y(0)) + dot(X(-1), Y(0))
    + txt(X(0) + 14, Y(4) + 6, '4', { anchor: 'start' }) + txt(X(0) + 14, Y(3) + 6, '3', { anchor: 'start' })
    + txt(X(-3), Y(0) + 24, '−3') + txt(X(-1), Y(0) + 24, '−1') + txt(X(1), Y(0) + 24, '1')) }
// 8) T1100000004621 — y = 2x²−8x+6 : đỉnh I(2;−2), cắt Ox tại 1 và 3, cắt Oy tại 6
{ const H = he({ ox: 34, oy: 20, w: 250, h: 340, x0: -1.4, x1: 4.6, y0: -2.7, y1: 6.7 }); const { X, Y } = H
  FIG['T1100000004621_de'] = svgDoc(320, 400,
    truc(H, { O: false }) + duong(H, (x) => 2 * x * x - 8 * x + 6, 0.02, 3.98) + dash(X(2), Y(0), X(2), Y(-2)) + dash(X(0), Y(-2), X(2), Y(-2)) + dot(X(2), Y(-2))
    + [-1, 1, 2, 3, 4].map((x) => txt(X(x), Y(0) + 22, x < 0 ? `−${-x}` : `${x}`)).join('') + txt(X(0) - 14, Y(0) + 22, 'O', { it: true })
    + [1, 2, 3, 4, 5, 6].map((y) => txt(X(0) - 8, Y(y) + 6, `${y}`, { anchor: 'end' })).join('') + txt(X(0) - 8, Y(-2) + 6, '−2', { anchor: 'end' })
    + txt(X(2), Y(-2) + 24, 'I', { it: true })) }
// 11) T1100000008666 — a<0, c>0, đỉnh bên phải trục tung, cắt Ox hai điểm: y = −0.5(x−1.2)² + 1.6
{ const H = he({ ox: 24, oy: 20, w: 300, h: 260, x0: -1.9, x1: 4.2, y0: -1.3, y1: 2.6 }); const { X, Y } = H
  FIG['T1100000008666_de'] = svgDoc(350, 300, truc(H, { oOff: [-14, 20] }) + duong(H, (x) => -0.5 * (x - 1.2) * (x - 1.2) + 1.6, -1.1, 3.6) + dot(X(0), Y(-0.5 * 1.44 + 1.6))) }

// 10) T1100000007600 — 4 hình A–D (A: y=−x²+2x+3 đỉnh (1;4), cắt Ox −1 và 3; B: bậc ba; C: trùng phương dạng W; D: đường thẳng qua A(0;−6), B(3;0))
{
  const clip = (id, x, y, w, h, body) => `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g clip-path="url(#${id})">${body}</g>`
  const ptit = (t, x, y) => txt(x, y, t, { size: 22, anchor: 'start' }).replace('<text', '<text font-weight="bold"')
  // A
  const HA = he({ ox: 40, oy: 36, w: 200, h: 150, x0: -1.9, x1: 4.2, y0: -0.9, y1: 4.9 }); const A = (HA.X, HA.Y, null)
  let a = ptit('A.', 0, 22) + truc(HA, { O: false }) + duong(HA, (x) => -x * x + 2 * x + 3, -1.4, 3.4)
    + dash(HA.X(1), HA.Y(0), HA.X(1), HA.Y(4)) + dash(HA.X(0), HA.Y(4), HA.X(1), HA.Y(4)) + dot(HA.X(1), HA.Y(4)) + dot(HA.X(-1), HA.Y(0)) + dot(HA.X(3), HA.Y(0)) + dot(HA.X(1), HA.Y(0))
    + txt(HA.X(0) - 10, HA.Y(4) + 6, '4', { anchor: 'end' }) + txt(HA.X(-1), HA.Y(0) + 20, '−1') + txt(HA.X(1), HA.Y(0) + 20, '1') + txt(HA.X(3), HA.Y(0) + 20, '3') + txt(HA.X(0) - 12, HA.Y(0) + 20, 'O', { it: true })
  // B (bậc ba, hệ số cao nhất âm)
  const HB = he({ ox: 300, oy: 36, w: 200, h: 150, x0: -1.9, x1: 4.2, y0: -2.6, y1: 3 })
  const cub = (x) => -0.5 * (x + 0.45) * (x - 1.05) * (x - 3.1)
  let b = ptit('B.', 262, 22) + truc(HB, { O: false }) + duong(HB, cub, -1.3, 3.8)
    + dash(HB.X(2.2), HB.Y(0), HB.X(2.2), HB.Y(cub(2.2))) + dash(HB.X(0), HB.Y(cub(2.2)), HB.X(2.2), HB.Y(cub(2.2))) + txt(HB.X(0) - 12, HB.Y(0) + 20, 'O', { it: true }) + txt(HB.X(1.05), HB.Y(0) + 20, '1')
  // C (trùng phương dạng W, cực đại tại (0;c) với c>0)
  const HC = he({ ox: 40, oy: 236, w: 200, h: 150, x0: -3.6, x1: 3.6, y0: -1.6, y1: 2.2 })
  const qua = (x) => 0.13 * x ** 4 - 1.0 * x ** 2 + 1.2
  let c = ptit('C.', 0, 222) + truc(HC, { O: false }) + duong(HC, qua, -2.95, 2.95, 200) + txt(HC.X(0) - 10, HC.Y(1.2) + 6, 'c', { it: true, anchor: 'end' }) + txt(HC.X(0) - 12, HC.Y(0) + 20, 'O', { it: true })
  // D (đường thẳng y = 2x − 6, qua A(0;−6) và B(3;0))
  const HD = he({ ox: 300, oy: 236, w: 200, h: 150, x0: -2.6, x1: 4.6, y0: -7.4, y1: 2.6 })
  let d = ptit('D.', 262, 222) + truc(HD, { O: false }) + duong(HD, (x) => 2 * x - 6, -0.55, 4.1, 2)
    + dot(HD.X(0), HD.Y(-6)) + dot(HD.X(3), HD.Y(0)) + txt(HD.X(0) + 14, HD.Y(-6) + 6, 'A', { it: true, anchor: 'start' }) + txt(HD.X(3) - 12, HD.Y(0) - 10, 'B', { it: true, anchor: 'start' })
    + txt(HD.X(0) - 8, HD.Y(-6) + 6, '−6', { anchor: 'end' }) + txt(HD.X(3), HD.Y(0) + 20, '3') + txt(HD.X(0) - 12, HD.Y(0) + 20, 'O', { it: true })
  FIG['T1100000007600_de'] = svgDoc(520, 420, clip('pa', 0, 0, 258, 204, a) + clip('pb', 262, 0, 258, 204, b) + clip('pc', 0, 204, 258, 216, c) + clip('pd', 262, 204, 258, 216, d))
}

async function ve() {
  fs.mkdirSync(OUT, { recursive: true })
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    const pg = await br.newPage()
    for (const [ten, svg] of Object.entries(FIG)) {
      const w = +svg.match(/width="(\d+)"/)[1], h = +svg.match(/height="(\d+)"/)[1]
      fs.writeFileSync(`${OUT}/${ten}.svg`, svg)
      await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
      await pg.setContent(`<body style="margin:0;background:#fff">${svg}</body>`)
      await pg.screenshot({ path: `${OUT}/${ten}.png`, clip: { x: 0, y: 0, width: w, height: h } })
      console.log('✔', ten, `${w}×${h}`)
    }
  } finally { await br.close() }
}

async function gan(ghi) {
  const old = JSON.parse(fs.readFileSync('.nhap-tam/vd-hinh.json', 'utf8')) // ma_cau, anh_de, anh_dap_an
  const env = {}
  for (const l of fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)) { const i = l.indexOf('='); if (i > 0 && !l.trim().startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^"|"$/g, '') }
  const sb = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  await c.query('begin')
  try {
    const dang = (await c.query(`select d.id, d.ten, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id join dai_bdm_chu_de cd on cd.id=n.chu_de_id where cd.khoi='10' and cd.ten='Hàm số, đồ thị và ứng dụng'`)).rows
    const vc = new Map(dang.map((d) => [d.id, d.vi_du])); const bb = []
    for (const o of old) for (const [k, hau] of [['anh_de', 'de'], ['anh_dap_an', 'dap_an']]) {
      if (!o[k]) continue
      const tep = `${OUT}/${o.ma_cau}_${hau}.png`; if (!fs.existsSync(tep)) throw new Error('chưa vẽ ' + tep)
      const chua = dang.filter((d) => vc.get(d.id).includes(o[k]))
      if (chua.length === 0) { console.log('BỎ QUA', o.ma_cau, k, '— không còn trong ví dụ nào (dạng đã bị xoá khỏi cây)'); continue }
      if (chua.length !== 1) throw new Error(`URL cũ của ${o.ma_cau} xuất hiện ở ${chua.length} dạng`)
      let moi = null
      if (ghi) {
        const path = `ham_so_k10/${new Date().toISOString().slice(0, 7)}/${o.ma_cau}-${randomUUID()}.png`
        const { error } = await sb.storage.from('kho-anh').upload(path, fs.readFileSync(tep), { contentType: 'image/png', upsert: false })
        if (error) throw new Error('upload: ' + error.message)
        moi = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl
        vc.set(chua[0].id, vc.get(chua[0].id).split(o[k]).join(moi))
      }
      bb.push({ ma: o.ma_cau, cot: k, dang: chua[0].id, cu: o[k], moi })
    }
    if (ghi) {
      for (const d of dang) if (vc.get(d.id) !== d.vi_du) await c.query(`update dai_bdm_dang_bai set vi_du=$2, updated_at=now() where id=$1`, [d.id, vc.get(d.id)])
      fs.mkdirSync('scripts/anh/bien_ban', { recursive: true })
      fs.writeFileSync(`scripts/anh/bien_ban/ham-so-k10-vi-du-${Date.now()}.json`, JSON.stringify(bb, null, 1))
      await c.query('commit'); console.log('ĐÃ GHI', bb.length, 'hình')
    } else { await c.query('rollback'); console.log('Thử:', bb.length, 'hình sẽ thay — không upload, không ghi') }
  } catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
  await c.end()
}

const cmd = process.argv[2]
if (cmd === 've') await ve()
else if (cmd === 'gan') await gan(process.argv.includes('--ghi'))
else console.log('Dùng: ve | gan [--ghi]')
