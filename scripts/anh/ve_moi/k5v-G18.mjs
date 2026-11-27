// k5v-G18.mjs — K5 Diện tích các hình, gói G18 (vẽ lại 8 hình; 2 tranh khu rừng giữ ảnh cũ)
//   node scripts/anh/ve_moi/k5v-G18.mjs "<gói>\moi"
import { P, seg, hinh, xuatTat, dot, label, num, rightAngle, ray, lerp, dist, circle, fill, T } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G18.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e
const poly = (pts) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length])).join('')

// ── T105000000783: hình thang vuông EGHK, EG=3, KH=10, EK=8 (⊥ KH) — 20 px/cm
{
  const k = 20
  const E = P(0, 0), G = P(3 * k, 0), K = P(0, 8 * k), H = P(10 * k, 8 * k)
  ok('783 EG=3cm', near(dist(E, G), 60)); ok('783 KH=10cm', near(dist(K, H), 200)); ok('783 EK=8cm ⊥ KH', near(dist(E, K), 160) && E.x === K.x)
  ok('783 EG ∥ KH', E.y === G.y && K.y === H.y)
  hinh('T105000000783', [E, G, K, H, P(-60, 80), P(0, 205)], [
    poly([E, G, H, K]), rightAngle(K, E, H, 14),
    label(E, 'E', -20, -8), label(G, 'G', 16, -10), label(K, 'K', -22, 22), label(H, 'H', 14, 22),
    num(P(26, -18), '3 cm'), num(P(-36, 88), '8 cm'), num(P(100, 36 + 160), '10 cm'),
  ])
}

// ── T105000000792: hình thang ABCD, BC=16, AD=34, chiều cao 16 — 8 px/cm
{
  const k = 8
  const A = P(0, 16 * k), D = P(34 * k, 16 * k), B = P(12 * k, 0), C = P(B.x + 16 * k, 0), Hf = P(B.x, 16 * k)
  ok('792 BC=16', near(dist(B, C), 128)); ok('792 AD=34', near(dist(A, D), 272)); ok('792 cao 16', near(dist(B, Hf), 128))
  ok('792 BC ∥ AD, thường (AB≠CD, không vuông)', B.y === C.y && A.y === D.y && !near(dist(A, B), dist(C, D)) && Hf.x > A.x && C.x < D.x)
  hinh('T105000000792', [A, D, B, C, P(-20, 170), P(0, 0)], [
    poly([A, B, C, D]), seg(B, Hf), rightAngle(Hf, B, D, 14),
    label(A, 'A', -18, 20), label(B, 'B', -16, -10), label(C, 'C', 16, -10), label(D, 'D', 18, 20),
    num(lerp(B, C, 0.5), '16 cm', 0, -14), num(P(B.x + 40, 70), '16 cm'), num(lerp(A, D, 0.5), '34 cm', 0, 36),
  ])
}

// ── T105000000729: hình tròn xanh bán kính a, hình tròn đỏ bán kính a×2 — 60 px = a
{
  const r1 = 50, r2 = 100
  const O1 = P(70, 60), O2 = P(210, 230)
  ok('729 r đỏ = 2 × r xanh', near(r2, 2 * r1)); ok('729 hai hình tròn không chạm nhau', dist(O1, O2) > r1 + r2)
  const dash = (O, r) => `<line x1="${O.x}" y1="${O.y}" x2="${O.x + r}" y2="${O.y}" stroke-dasharray="7 5"/>`
  hinh('T105000000729', [P(O1.x - r1, O1.y - r1), P(O2.x + r2, O2.y + r2), P(O2.x - r2, O2.y - r2)], [
    `<circle cx="${O1.x}" cy="${O1.y}" r="${r1}" fill="#a7dcb0"/>`, `<circle cx="${O2.x}" cy="${O2.y}" r="${r2}" fill="#f5b0b0"/>`,
    dash(O1, r1), dash(O2, r2), dot(O1), dot(O2),
    num(P(O1.x + 25, O1.y - 12), '<tspan font-style="italic">a</tspan>'),
    num(P(O2.x + 50, O2.y - 12), '<tspan font-style="italic">a</tspan> × 2'),
  ], { padDuoi: 20 })
}

// ── Bọ rùa mẫu (T105100406018): hai đường tròn tâm O bán kính 6 mm và 15 mm, đầu = hình tròn bán kính 6 mm tâm I — 6 px/mm
{
  const k = 6, O = P(0, 0), R = 15 * k, r = 6 * k
  const Hd = P(0, -R - r * 0.55)  // đầu (tâm I của mẫu)
  ok('018 R:r = 15:6', near(R / r, 2.5)); ok('018 đầu cùng cỡ vòng nhỏ', near(r, 36))
  const eye = (x) => `<circle cx="${x}" cy="${Hd.y - 4}" r="4" fill="#222"/>`
  const ant = (s) => `<path d="M ${s * 14} ${Hd.y - r + 4} Q ${s * 30} ${Hd.y - r - 22} ${s * 46} ${Hd.y - r - 18}"/><circle cx="${s * 46}" cy="${Hd.y - r - 18}" r="3.5" fill="#222"/>`
  const leg = (s, y0, a) => { const p0 = ray(O, a, R), p1 = P(p0.x + s * 26, p0.y + (y0 - p0.y) * 0), p2 = P(p1.x + s * 22, p1.y + (a > 0 ? -26 : a < -10 ? 30 : 0)); return `<path d="M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y}"/><circle cx="${p2.x}" cy="${p2.y}" r="3.5" fill="#222"/>` }
  let legs = ''
  for (const s of [-1, 1]) for (const a of [38, 0, -38]) {
    const p0 = ray(O, s > 0 ? a : 180 - a, R)
    const p1 = P(p0.x + s * 22, p0.y + (a > 0 ? -14 : a < 0 ? 14 : -3))
    const p2 = P(p1.x + s * 18, p1.y + (a > 0 ? -22 : a < 0 ? 26 : 12))
    legs += `<path d="M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}"/><circle cx="${p2.x.toFixed(1)}" cy="${p2.y.toFixed(1)}" r="3.5" fill="#222"/>`
  }
  const IO = [P(230, -60), P(230, 60)]
  hinh('T105100406018', [P(-R - 60, -R - r - 70), P(R + 60, R + 20), P(300, 0)], [
    // đầu nằm sau thân: vẽ đầu trước rồi tô trắng thân đè lên
    `<circle cx="${Hd.x}" cy="${Hd.y}" r="${r}"/>`,
    `<circle cx="0" cy="0" r="${R}" fill="#fff"/>`, circle(O, r), seg(P(0, -R), P(0, R)),
    legs, ant(-1), ant(1), eye(-14), eye(14), dot(O),
    dot(IO[0]), label(IO[0], 'I', 24, 9), dot(IO[1]), label(IO[1], 'O', 24, 9),
  ], { padDuoi: 40 })
}

// ── T105100406024: chú sâu — ba đường tròn tâm O, I, K đường kính 20 mm, OI = IK = 20 mm — 5 px/mm
{
  const k = 5, r = 10 * k, O = P(0, 0), I = P(20 * k, 0), K = P(40 * k, 0)
  ok('024 OI=IK=20mm', near(dist(O, I), 100) && near(dist(I, K), 100)); ok('024 đường kính 20mm', near(2 * r, 100))
  const eye = (x) => `<circle cx="${x}" cy="-32" r="6" fill="#222"/>`
  const ant = (s, x) => `<path d="M ${x + s * 14} ${-r + 3} Q ${x + s * 24} ${-r - 24} ${x + s * 44} ${-r - 24}"/><circle cx="${x + s * 44}" cy="${-r - 24}" r="5"/>`
  const legs = (x) => `<path d="M ${x - 22} ${r - 6} L ${x - 24} ${r + 22}"/><path d="M ${x + 22} ${r - 6} L ${x + 24} ${r + 22}"/><ellipse cx="${x - 26}" cy="${r + 28}" rx="14" ry="6"/><ellipse cx="${x + 26}" cy="${r + 28}" rx="14" ry="6"/>`
  hinh('T105100406024', [P(-r - 20, -r - 40), P(K.x + r + 50, r + 40), P(-r, r + 40)], [
    circle(O, r), circle(I, r), circle(K, r),
    ant(-1, -20), ant(1, 20), eye(-24), eye(24), `<path d="M -14 -16 Q 0 -4 14 -16"/>`,
    `<path d="M ${K.x + 34} ${r - 30} Q ${K.x + 64} ${r - 30} ${K.x + 72} ${-20 + 0}"/><circle cx="${K.x + 72}" cy="-24" r="5"/>`,
    legs(0), legs(I.x), legs(K.x),
    dot(O), label(O, 'O', 0, 28), dot(I), label(I, 'I', 0, 28), dot(K), label(K, 'K', 0, 28),
  ], { padDuoi: 30 })
}

// ── T105100406035: chiếc quạt — hai nửa đường tròn tâm O, bán kính 3 cm và 6 cm — 35 px/cm
{
  const k = 35, O = P(0, 0), r1 = 3 * k, r2 = 6 * k
  ok('035 bán kính 3 cm : 6 cm', near(r2 / r1, 2))
  const arcP = (r) => `M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0`
  const nan = [30, 60, 90, 120, 150].map((a) => seg(O, ray(O, a, r1))).join('')
  const ar = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><path d="M ${x1 + 9} ${y - 4} L ${x1} ${y} L ${x1 + 9} ${y + 4} M ${x2 - 9} ${y - 4} L ${x2} ${y} L ${x2 - 9} ${y + 4}"/><line x1="${x1}" y1="${y - 8}" x2="${x1}" y2="${y + 8}"/><line x1="${x2}" y1="${y - 8}" x2="${x2}" y2="${y + 8}"/>`
  hinh('T105100406035', [P(-r2, -r2), P(r2, 0), P(0, 60)], [
    `<path d="M ${-r2} 0 A ${r2} ${r2} 0 0 1 ${r2} 0 L ${r1} 0 A ${r1} ${r1} 0 0 0 ${-r1} 0 Z" fill="#bfe3fb" stroke="none"/>`,
    `<path d="${arcP(r2)}"/><path d="${arcP(r1)}"/>`, seg(P(-r2, 0), P(r2, 0)), nan, dot(O),
    ar(0, r1, 32), ar(r1, r2, 32), num(P(r1 / 2, 62), '3 cm'), num(P((r1 + r2) / 2, 62), '3 cm'),
  ], { padDuoi: 30 })
}

// ── T105100406057: hình tròn tâm A, đường kính MN, Q trên đường tròn
{
  const R = 130, A = P(0, 0), M = P(-R, 0), N = P(R, 0), Q = ray(A, 232, R)
  ok('057 A trung điểm MN', near(A.x, (M.x + N.x) / 2)); ok('057 AQ = AM', near(dist(A, Q), R))
  hinh('T105100406057', [P(-R - 40, -R - 20), P(R + 40, R + 10)], [
    circle(A, R), seg(M, N), seg(A, Q), dot(A), dot(M), dot(N), dot(Q),
    label(A, 'A', 0, -14), label(M, 'M', -22, 8), label(N, 'N', 22, 8), label(Q, 'Q', -18, 22),
  ], { padDuoi: 30 })
}

// ── T105100406058: hình tròn tâm O, đường kính BC, D trên đường tròn
{
  const R = 130, O = P(0, 0), B = ray(O, 225, R), C = ray(O, 45, R), D = ray(O, 298, R)
  ok('058 O trung điểm BC', near(O.x, (B.x + C.x) / 2) && near(O.y, (B.y + C.y) / 2)); ok('058 OD = OB', near(dist(O, D), R))
  hinh('T105100406058', [P(-R - 40, -R - 20), P(R + 40, R + 10)], [
    circle(O, R), seg(B, C), seg(O, D), dot(O), dot(B), dot(C), dot(D),
    label(O, 'O', -4, -14), label(B, 'B', -18, 22), label(C, 'C', 20, -6), label(D, 'D', 18, 22),
  ], { padDuoi: 30 })
}

await xuatTat(dir)
