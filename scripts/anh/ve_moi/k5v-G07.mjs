// k5v-G07.mjs — Toán 5, "Nhận diện các loại tam giác, Xác định đường cao": 6 hình lưới ô vuông (963–968) + 3 tam giác (002–004).
//   node scripts/anh/ve_moi/k5v-G07.mjs "<thư mục gói>\moi"
import { P, seg, hinh, xuatTat, dot, label, labelOut, trongTam, rightAngle, dist, goc, T } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G07.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }

const C = 40, COLS = 12, ROWS = 10
const W = COLS * C, H = ROWS * C
const lat = () => {
  let s = ''
  for (let i = 0; i <= COLS; i++) s += `<line x1="${i * C}" y1="0" x2="${i * C}" y2="${H}" stroke="#c9ccd8" stroke-width="1"/>`
  for (let j = 0; j <= ROWS; j++) s += `<line x1="0" y1="${j * C}" x2="${W}" y2="${j * C}" stroke="#c9ccd8" stroke-width="1"/>`
  return s
}
const g = (c, r) => P(c * C, r * C)
const khung = [P(0, 0), P(W, H)]
const hs = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2 / (C * C)
const lab = (pts, names) => pts.map((p, i) => labelOut(p, names[i], trongTam(pts), 24)).join('')
function luoi(ten, pts, names, extra = '') {
  hinh(ten, khung, [lat(), seg(pts[0], pts[1]), seg(pts[1], pts[2]), seg(pts[2], pts[0]), ...pts.map(dot), lab(pts, names), extra], { pad: 6, padDuoi: 6 })
}

// 963: PQR — PQ nằm ngang phía trên, R dưới
{ const p = [g(2, 2), g(9, 2), g(6, 8)]
  ok('963 PQ nằm ngang, R dưới', p[0].y === p[1].y && p[2].y > p[0].y)
  ok('963 diện tích = 21 ô (7×6/2)', hs(...p) === 21)
  ok('963 không cân / không đều', Math.abs(dist(p[0], p[2]) - dist(p[1], p[2])) > 1)
  luoi('T105000000963', p, ['P', 'Q', 'R']) }

// 964: STU — góc T tù
{ const p = [g(1, 7), g(6, 7), g(10, 2)]
  ok('964 góc T tù', goc(p[1], p[0], p[2]) > 90)
  ok('964 ST ngang', p[0].y === p[1].y)
  luoi('T105000000964', p, ['S', 'T', 'U']) }

// 965: DEF vuông tại E (DE đứng, EF ngang), có ô vuông ở E (đề cho)
{ const p = [g(3, 2), g(3, 7), g(9, 7)]
  ok('965 vuông tại E', Math.abs(goc(p[1], p[0], p[2]) - 90) < 1e-6)
  ok('965 không vuông cân', dist(p[0], p[1]) !== dist(p[1], p[2]))
  luoi('T105000000965', p, ['D', 'E', 'F'], rightAngle(p[1], p[0], p[2], 14)) }

// 966: MNP — MN theo đường chéo ô vuông
{ const p = [g(2, 6), g(6, 2), g(9, 7)]
  ok('966 MN chéo (1 ô sang, 1 ô lên)', (p[1].x - p[0].x) === -(p[1].y - p[0].y))
  ok('966 tam giác nhọn hay tù, không đặc biệt', Math.abs(dist(p[0], p[1]) - dist(p[1], p[2])) > 1 && Math.abs(dist(p[0], p[2]) - dist(p[1], p[2])) > 1)
  luoi('T105000000966', p, ['M', 'N', 'P']) }

// 967: GKE — GK ngang phía trên, góc K tù
{ const p = [g(2, 2), g(6, 2), g(10, 7)]
  ok('967 góc K tù', goc(p[1], p[0], p[2]) > 90)
  ok('967 GK ngang', p[0].y === p[1].y)
  luoi('T105000000967', p, ['G', 'K', 'E']) }

// 968: HKG — HK đứng, góc K tù
{ const p = [g(3, 1), g(3, 4), g(9, 8)]
  ok('968 góc K tù', goc(p[1], p[0], p[2]) > 90)
  ok('968 HK đứng', p[0].x === p[1].x)
  luoi('T105000000968', p, ['H', 'K', 'G']) }

// 002: ABC đều, A trên, BC ngang (không ghi dấu loại tam giác — đề hỏi loại)
{ const s = 340, B = P(0, 295), Cc = P(s, 295), A = P(s / 2, 295 - s * Math.sqrt(3) / 2)
  ok('002 đều', Math.abs(dist(A, B) - s) < 1e-6 && Math.abs(dist(A, Cc) - s) < 1e-6)
  const pts = [A, B, Cc], tt = trongTam(pts)
  hinh('T105100401002', pts, [seg(A, B), seg(B, Cc), seg(Cc, A), ...pts.map(dot), label(A, 'A', 0, -16), label(B, 'B', -12, 32), label(Cc, 'C', 12, 32)], { pad: 44, padDuoi: 58 }) }

// 003: MNP tù tại P; NP ngang, M trên bên phải (giữ bố cục ảnh cũ)
{ const N = P(0, 260), Pp = P(195, 260), M = P(255, 0)
  ok('003 góc P tù', goc(Pp, M, N) > 90)
  ok('003 không cân', Math.abs(dist(M, N) - dist(M, Pp)) > 5 && Math.abs(dist(N, Pp) - dist(M, Pp)) > 5 && Math.abs(dist(N, Pp) - dist(M, N)) > 5)
  const pts = [M, N, Pp]
  hinh('T105100401003', pts, [seg(M, N), seg(N, Pp), seg(Pp, M), ...pts.map(dot), label(M, 'M', 14, -14), label(N, 'N', -14, 32), label(Pp, 'P', 14, 32)], { pad: 44, padDuoi: 58 }) }

// 004: EFG nhọn, E trên, FG ngang
{ const F = P(0, 277), G = P(417, 277), E = P(139, 0)
  ok('004 nhọn', goc(E, F, G) < 90 && goc(F, E, G) < 90 && goc(G, E, F) < 90)
  ok('004 không cân', Math.abs(dist(E, F) - dist(E, G)) > 20 && Math.abs(dist(E, F) - dist(F, G)) > 20 && Math.abs(dist(E, G) - dist(F, G)) > 20)
  const pts = [E, F, G]
  hinh('T105100401004', pts, [seg(E, F), seg(F, G), seg(G, E), ...pts.map(dot), label(E, 'E', 0, -16), label(F, 'F', -12, 32), label(G, 'G', 12, 32)], { pad: 44, padDuoi: 58 }) }

await xuatTat(dir)
