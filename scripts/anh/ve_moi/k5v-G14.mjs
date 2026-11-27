// G14 — vẽ lại 10 hình "Nhận diện hình thang" (K5, Diện tích các hình)
import { txt, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
const f = (n) => Math.round(n * 100) / 100

// ---- kiểm hình học ----
const sub = (a, b) => [b[0] - a[0], b[1] - a[1]]
const crs = (u, v) => (u[0] * v[1] - u[1] * v[0]) / (Math.hypot(...u) * Math.hypot(...v))
const dt = (u, v) => (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))
const sd = (p, i) => sub(p[i], p[(i + 1) % p.length])
/** loại: 'ht' = đúng 1 cặp đối song song; 'khong' = không cặp nào; 'ht-dung' = 2 cặp đáy song song */
function kiem(ten, p, loai) {
  if (p.length !== 4) return
  const c1 = Math.abs(crs(sd(p, 0), sd(p, 2))) < 1e-9, c2 = Math.abs(crs(sd(p, 1), sd(p, 3))) < 1e-9
  const gan1 = Math.abs(crs(sd(p, 0), sd(p, 2))) < 0.08, gan2 = Math.abs(crs(sd(p, 1), sd(p, 3))) < 0.08
  if (loai === 'ht') { if (!(c1 ^ c2) || (c1 && gan2) || (c2 && gan1)) throw new Error(ten + ': không đúng 1 cặp song song') }
  else if (gan1 || gan2) throw new Error(ten + ': có cặp (gần) song song')
}

const S = 0.55
const path = (pts, fill, dx = 0, dy = 0, s = S) =>
  `<path d="M ${pts.map((p) => `${f((p[0] - dx) * s)} ${f((p[1] - dy) * s)}`).join(' L ')} Z" fill="${fill}" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
const lab = (x, y, t, s = S, dx = 0, dy = 0) =>
  txt((x - dx) * s, (y - dy) * s, `Hình ${/[A-Za-z]/.test(t) ? `<tspan font-style="italic">${t}</tspan>` : t}`, 22)
const FILL = '#eceff3'

// hình mẫu (toạ độ trên khung 1280 × 400 của ảnh cũ)
const NG = [[160, 60], [280, 150], [230, 290], [90, 290], [40, 150]]                // ngũ giác
const NG2 = [[480, 60], [600, 150], [550, 290], [410, 290], [360, 150]]
const NG3 = [[1120, 60], [1240, 150], [1190, 290], [1050, 290], [1000, 150]]
const T = (ax, ay, bx, by, cx, cy) => [[ax, ay], [bx, by], [cx, cy]]
const QA = [[40, 120], [200, 80], [280, 220], [60, 300]]     // tứ giác thường
const QC = [[740, 140], [870, 90], [910, 290], [690, 260]]   // tứ giác thường
const sh = (p, d) => p.map((q) => [q[0] + d, q[1]])

async function nhom(ma, items, ghi) {
  // items: [{pts, ten, loai}] ; nhãn ở tâm ô 160+320k
  let b = ''
  items.forEach((it, k) => {
    if (it.pts.length === 4) kiem(ma + ' ' + it.ten, it.pts, it.loai)
    b += path(it.pts, FILL)
    b += lab(160 + 320 * k, 372, it.ten)
  })
  const W = Math.round(1280 * S), H = Math.round(420 * S)
  await ra(OUT, ma, W, H + 24, b)
}

const R = []
const tam = (ma, ghi) => R.push({ ma_cau: ma, ghi_chu: ghi })

// 1002: 1 ngũ giác, 2 tứ giác thường, 3 hình thang (hai đáy dọc), 4 tam giác
await nhom('T1050000001002', [
  { pts: NG, ten: '1' },
  { pts: [[360, 120], [520, 80], [600, 220], [380, 300]], ten: '2', loai: 'khong' },
  { pts: [[700, 60], [900, 120], [900, 240], [700, 300]], ten: '3', loai: 'ht' },
  { pts: T(1100, 80, 1240, 280, 1000, 280), ten: '4' },
])
tam('T1050000001002', 'Bốn hình 1–4 theo ảnh cũ: 1 ngũ giác, 2 tứ giác thường, 3 hình thang hai đáy dọc (nghiêng), 4 tam giác; có assert song song')

// 1003: A tứ giác, B hình thang, C tứ giác, D ngũ giác
await nhom('T1050000001003', [
  { pts: QA, ten: 'A', loai: 'khong' },
  { pts: [[380, 110], [460, 110], [600, 270], [360, 270]], ten: 'B', loai: 'ht' },
  { pts: QC, ten: 'C', loai: 'khong' },
  { pts: NG3, ten: 'D' },
])
tam('T1050000001003', 'A tứ giác thường, B hình thang (đáy ngang), C tứ giác thường, D ngũ giác')

// 1004: M tam giác, N ngũ giác, P tứ giác, Q hình thang
await nhom('T1050000001004', [
  { pts: T(140, 80, 280, 280, 40, 280), ten: 'M' },
  { pts: NG2, ten: 'N' },
  { pts: QC, ten: 'P', loai: 'khong' },
  { pts: [[1060, 100], [1180, 100], [1240, 280], [1000, 280]], ten: 'Q', loai: 'ht' },
])
tam('T1050000001004', 'M tam giác, N ngũ giác, P tứ giác thường, Q hình thang')

// 1005: E hình thang vuông, G tam giác, H tứ giác, K ngũ giác
await nhom('T1050000001005', [
  { pts: [[50, 100], [170, 100], [270, 280], [50, 280]], ten: 'E', loai: 'ht' },
  { pts: T(460, 80, 600, 280, 360, 280), ten: 'G' },
  { pts: [[680, 120], [840, 80], [920, 220], [700, 300]], ten: 'H', loai: 'khong' },
  { pts: NG3, ten: 'K' },
])
tam('T1050000001005', 'E hình thang vuông (không đánh dấu góc vuông), G tam giác, H tứ giác thường, K ngũ giác')

// 1006: 1 tứ giác, 2 ngũ giác, 3 hình thang, 4 tam giác
await nhom('T1050000001006', [
  { pts: [[100, 140], [230, 90], [270, 290], [50, 260]], ten: '1', loai: 'khong' },
  { pts: NG2, ten: '2' },
  { pts: [[760, 120], [880, 120], [920, 280], [680, 280]], ten: '3', loai: 'ht' },
  { pts: T(1100, 80, 1240, 280, 1000, 280), ten: '4' },
])
tam('T1050000001006', '1 tứ giác thường, 2 ngũ giác, 3 hình thang, 4 tam giác')

// 1007: A tứ giác, B hình thang hai đáy dọc, C tam giác, D tứ giác
await nhom('T1050000001007', [
  { pts: QA, ten: 'A', loai: 'khong' },
  { pts: [[380, 60], [580, 120], [580, 240], [380, 300]], ten: 'B', loai: 'ht' },
  { pts: T(780, 80, 920, 280, 680, 280), ten: 'C' },
  { pts: [[1060, 140], [1190, 90], [1230, 290], [1010, 260]], ten: 'D', loai: 'khong' },
])
tam('T1050000001007', 'A tứ giác thường, B hình thang hai đáy dọc (nghiêng), C tam giác, D tứ giác thường')

// 1008: M ngũ giác, N tứ giác, P tứ giác, Q hình thang
await nhom('T1050000001008', [
  { pts: NG, ten: 'M' },
  { pts: [[420, 140], [550, 90], [590, 290], [370, 260]], ten: 'N', loai: 'khong' },
  { pts: [[680, 120], [840, 80], [920, 220], [700, 300]], ten: 'P', loai: 'khong' },
  { pts: [[1020, 110], [1100, 110], [1240, 270], [1000, 270]], ten: 'Q', loai: 'ht' },
])
tam('T1050000001008', 'M ngũ giác, N và P tứ giác thường, Q hình thang')

// 623: 5 hình A–E, không tô; A,B,D hình thang; C,E tứ giác thường
{
  const dx = 40, dy = 150, s = 0.55
  const fig = [
    ['A', [[110, 184], [188, 184], [224, 300], [70, 300]], 'ht', 153],
    ['B', [[340, 190], [420, 190], [500, 300], [340, 300]], 'ht', 427],
    ['C', [[620, 300], [645, 212], [732, 183], [770, 280]], 'khong', 705],
    ['D', [[910, 190], [1040, 184], [1040, 260], [910, 300]], 'ht', 985],
    ['E', [[1200, 300], [1225, 176], [1320, 187], [1360, 292]], 'khong', 1287],
  ]
  let b = ''
  for (const [t, p, l, cx] of fig) {
    kiem('623 ' + t, p, l)
    b += path(p, '#fff', dx, dy, s)
    b += txt((cx - dx) * s, (345 - dy) * s, `<tspan font-style="italic">${t}</tspan>`, 24)
  }
  // D: hai cạnh bên thẳng đứng song song
  if (fig[3][1][0][0] !== fig[3][1][3][0] || fig[3][1][1][0] !== fig[3][1][2][0]) throw new Error('D không có hai cạnh dọc')
  await ra(OUT, 'T105000000623', Math.round((1360 - dx + 30) * s), Math.round((345 - dy + 70) * s), b)
  tam('T105000000623', 'Năm hình A–E theo ảnh cũ (không tô): A hình thang cân, B hình thang vuông, C tứ giác thường, D hình thang hai đáy dọc, E tứ giác thường; đã bỏ khoảng trắng thừa phía trên')
}

// 628: hai hình thang A (vuông, nghiêng) và B (đáy dọc, không vuông); không đánh dấu góc vuông
{
  const th = Math.atan(0.39), u = [Math.cos(th), Math.sin(th)], v = [-Math.sin(th), Math.cos(th)]
  const P1 = [130, 45]
  const P2 = [P1[0] + 213 * u[0], P1[1] + 213 * u[1]]
  const P4 = [P1[0] + 186 * v[0], P1[1] + 186 * v[1]]
  const P3 = [P4[0] + 292 * u[0], P4[1] + 292 * u[1]]
  const A = [P1, P2, P3, P4]
  // kiểm: AD (P1P4) vuông góc cả hai đáy; hai đáy song song; cạnh bên phải không vuông
  console.assert(Math.abs(dt(sub(P1, P4), sub(P1, P2))) < 1e-9 && Math.abs(dt(sub(P4, P1), sub(P4, P3))) < 1e-9, 'A: cạnh bên trái phải vuông góc hai đáy')
  console.assert(Math.abs(crs(sub(P1, P2), sub(P4, P3))) < 1e-9, 'A: hai đáy song song')
  console.assert(Math.abs(dt(sub(P2, P3), sub(P1, P2))) > 0.2, 'A: cạnh bên phải không vuông')
  const B = [[420, 50], [578, 155], [578, 285], [420, 320]]
  console.assert(Math.abs(crs(sub(B[0], B[3]), sub(B[1], B[2]))) < 1e-9, 'B: hai cạnh dọc song song')
  for (const [a, c, d] of [[0, 1, 3], [1, 0, 2], [2, 1, 3], [3, 2, 0]]) if (Math.abs(dt(sub(B[a], B[c]), sub(B[a], B[d]))) < 0.05) throw new Error('B có góc vuông')
  const dx = 30, dy = 25, s = 0.95
  let b = path(A, '#fff', dx, dy, s) + path(B, '#fff', dx, dy, s)
  b += txt((222 - dx) * s, (205 - dy) * s + 8, '<tspan font-style="italic">A</tspan>', 28)
  b += txt((500 - dx) * s, (195 - dy) * s + 8, '<tspan font-style="italic">B</tspan>', 28)
  await ra(OUT, 'T105000000628', Math.round((600 - dx) * s), Math.round((345 - dy) * s), b)
  tam('T105000000628', 'Hình A: hình thang có cạnh bên trái vuông góc hai đáy (đặt nghiêng, đáy chéo); hình B: hình thang có hai đáy dọc, hai cạnh bên không vuông góc đáy; không đánh dấu góc vuông (để HS dùng ê ke). Ảnh cũ là ảnh chụp, cạnh dưới B hơi cong -> vẽ thẳng')
}

// 630: tam giác chia 3 dải bằng 2 đoạn song song đáy; dải dưới tô xám
{
  const ax = 228, ay = 42, bl = 36, br = 420, by = 408
  const h = (by - ay) / 3
  const X = (y, side) => ax + (side === 'l' ? (bl - ax) : (br - ax)) * (y - ay) / (by - ay)
  const y1 = ay + h, y2 = ay + 2 * h
  const dx = 10, dy = 20, s = 0.8
  const pt = (x, y) => [x, y]
  const top = [pt(ax, ay), pt(X(y1, 'r'), y1), pt(X(y1, 'l'), y1)]
  const mid = [pt(X(y1, 'l'), y1), pt(X(y1, 'r'), y1), pt(X(y2, 'r'), y2), pt(X(y2, 'l'), y2)]
  const bot = [pt(X(y2, 'l'), y2), pt(X(y2, 'r'), y2), pt(br, by), pt(bl, by)]
  kiem('630 mid', mid, 'ht'); kiem('630 bot', bot, 'ht')
  const b = path(top, '#eceff3', dx, dy, s) + path(mid, '#fff', dx, dy, s) + path(bot, '#9a9a9a', dx, dy, s)
  await ra(OUT, 'T105000000630', Math.round((br - dx + 20) * s), Math.round((by - dy + 20) * s), b)
  tam('T105000000630', 'Tam giác chia ba phần bằng hai đoạn song song đáy (cao bằng nhau); phần trên tô nhạt, phần giữa trắng, phần dưới tô xám như ảnh cũ')
}

baoCao(OUT, R, [], null)
