// k5v-G01.mjs — vẽ lại 10 hình kho Đại khối 5 (Diện tích các hình / Góc, đường thẳng, hình thoi, hình bình hành)
//   node scripts/anh/ve_moi/k5v-G01.mjs "<thu_muc>\moi"
import { P, seg, hinh, xuatTat, ray, label, num, add, mul, dist, goc, labelOut, T, poly } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G01.mjs <thu_muc_ra>'); process.exit(2) }
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const near = (a, b, e = 0.6) => Math.abs(a - b) < e
const fillPoly = (pts, c) => `<path d="M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="${c}" stroke="none"/>`
const dotp = (a, b) => a.x * b.x + a.y * b.y

// ───────── 1) Bức tranh Rô-bốt (T105000000625, T105000000632) ─────────
function tranh() {
  const k = 0.6
  const K = (x, y) => P(x * k, y * k)
  const W = 870 * k, H = 410 * k
  const vang = '#efe51e', xanh = '#22a64a', do_ = '#e52222', den = '#111', lam = '#3f5fb0'
  const body = []
  body.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#fff" stroke="#8c8c8c" stroke-width="5"/>`)
  // hình tròn
  const c = K(160, 125)
  body.push(`<circle cx="${c.x}" cy="${c.y}" r="${46 * k}" fill="${vang}" stroke="none"/>`)
  // 3 hình thoi
  for (const [cx, cy] of [[402, 79], [360, 156], [443, 156]]) {
    const q = [K(cx, cy - 51), K(cx + 34, cy), K(cx, cy + 51), K(cx - 34, cy)]
    ok(`thoi (${cx},${cy}) 4 cạnh bằng nhau`, [0, 1, 2, 3].every((i) => near(dist(q[i], q[(i + 1) % 4]), dist(q[0], q[1]), 0.01)))
    body.push(fillPoly(q, vang))
  }
  // hình bình hành xanh lá
  const gA = K(70, 235), gB = K(163, 187), gC = K(310, 332)
  const gD = add(gA, sub(gC, gB))
  body.push(fillPoly([gA, gB, gC, gD], xanh))
  ok('bình hành xanh: không phải hình chữ nhật', Math.abs(dotp(sub(gB, gA), sub(gD, gA))) > 100)
  // hình chữ nhật đỏ
  const rA = K(683, 118), rB = K(788, 165)
  const dir2 = P(-(rB.y - rA.y), rB.x - rA.x) // vuông góc AB
  const len = 235 * k
  const u = mul(dir2, len / Math.hypot(dir2.x, dir2.y))
  const rD = add(rA, u), rC = add(rB, u)
  ok('chữ nhật đỏ: góc vuông', near(dotp(sub(rB, rA), sub(rD, rA)), 0, 0.01))
  body.push(fillPoly([rA, rB, rC, rD], do_))
  // đường thẳng: 2 đỏ // , 2 đen // , 1 xanh ⊥ đỏ
  const redD = P(232, -297), blkD = P(511, -77), bluD = P(297, 232)
  const L = (a, d, t, col) => { const p = K(a.x, a.y), q = K(a.x + d.x * t, a.y + d.y * t); body.push(`<path d="M ${p.x} ${p.y} L ${q.x} ${q.y}" stroke="${col}" stroke-width="3.4" fill="none"/>`) }
  L(P(115, 343), redD, 1, do_)
  L(P(388, 355), redD, 1, do_)
  L(P(77, 283), blkD, 1, den)
  L(P(281, 380), blkD, 0.975, den)
  L(P(477, 35), bluD, 1, lam)
  ok('xanh ⊥ đỏ', dotp(bluD, redD) === 0)
  ok('đen KHÔNG ⊥ đỏ', Math.abs(dotp(blkD, redD)) / (Math.hypot(blkD.x, blkD.y) * Math.hypot(redD.x, redD.y)) > 0.2)
  return [body, [P(0, 0), P(W, H)]]
}
for (const ten of ['T105000000625', 'T105000000632']) {
  const [b, pts] = tranh()
  hinh(ten, pts, b, { pad: 12, padDuoi: 14 })
}

// ───────── 2) Bốn góc (T105000000635) — không nhãn, 35°, 130°, 60°, 110° ─────────
{
  const A = 105, y0 = 150
  const ang = [35, 130, 60, 110]
  const vx = [40, 250, 400, 590]
  const pts = [], body = []
  ang.forEach((a, i) => {
    const V = P(vx[i], y0), R = ray(V, 0, A), Q = ray(V, a, A)
    ok(`góc ${i + 1} = ${a}°`, near(goc(V, R, Q), a, 0.01))
    body.push(seg(V, R), seg(V, Q)); pts.push(V, R, Q)
  })
  ok('góc 1,3 nhọn; 2,4 tù', ang[0] < 90 && ang[2] < 90 && ang[1] > 90 && ang[3] > 90)
  hinh('T105000000635', pts, body, { pad: 30, padDuoi: 40 })
}

// ───────── 3) Bốn góc có tên (T105000000646): A 60°, E 120°, H 120°, P 90° ─────────
{
  const A = 95, y0 = 130
  const defs = [
    { v: 'A', x: 40, a1: 80, a2: 20, p: 'B', q: 'C' },
    { v: 'E', x: 290, a1: 180, a2: 60, p: 'D', q: 'F' },
    { v: 'H', x: 470, a1: 210, a2: 330, p: 'G', q: 'K', y: 55 },
    { v: 'P', x: 615, a1: 90, a2: 0, p: 'S', q: 'T' },
  ]
  const exp = { A: 60, E: 120, H: 120, P: 90 }
  const pts = [], body = []
  for (const d of defs) {
    const V = P(d.x, d.y ?? y0), X = ray(V, d.a1, A), Y = ray(V, d.a2, A)
    ok(`góc ${d.v} = ${exp[d.v]}°`, near(goc(V, X, Y), exp[d.v], 0.01))
    body.push(seg(V, X), seg(V, Y), labelOut(X, d.p, V, 20), labelOut(Y, d.q, V, 20))
    const m = ray(V, (d.a1 + d.a2) / 2, 1), dv = sub(m, V)
    body.push(label(P(V.x - dv.x * 22, V.y - dv.y * 22), d.v, 0, 9))
    pts.push(V, X, Y, P(V.x - dv.x * 22, V.y - dv.y * 22))
  }
  hinh('T105000000646', pts, body, { pad: 34, padDuoi: 40 })
}

// ───────── 4) Đường thẳng đã cho (T105000000655, T105000000659) ─────────
for (const ten of ['T105000000655', 'T105000000659']) {
  const a = P(0, 190), b = P(400, 190 - 400 * Math.tan(19 * Math.PI / 180))
  ok('đường nghiêng 19°', near(goc(a, P(a.x + 100, a.y), b), 19, 0.01))
  hinh(ten, [a, b], [seg(a, b)], { pad: 40, padDuoi: 50 })
}

// ───────── 5) Năm hình khối (T105000000689, 690, 700) ─────────
function khoi() {
  const s = 0.56
  const S = (x, y) => P(x * s, y * s)
  const body = [], pts = [], so = []
  const quad = (q) => { const ps = q; body.push(poly(ps)); pts.push(...ps) }
  const cen = (q) => P(q.reduce((t, p) => t + p.x, 0) / q.length, q.reduce((t, p) => t + p.y, 0) / q.length)
  const par = (q) => near(q[0].x + q[2].x, q[1].x + q[3].x, 0.01) && near(q[0].y + q[2].y, q[1].y + q[3].y, 0.01)
  const rect = (x, y, w, h) => [S(x, y), S(x + w, y), S(x + w, y + h), S(x, y + h)]
  const sh = (q, o) => q.map((p) => add(p, o))
  const num_ = (q, t) => so.push(num(cen(q), t, 0, 8, 22))
  // 1: front chữ nhật + mặt trên + mặt bên phải
  { const F = rect(25, 55, 105, 150), o = mul(S(38, -36), 1)
    const top = [F[0], F[1], add(F[1], o), add(F[0], o)], right = [F[1], add(F[1], o), add(F[2], o), F[2]]
    ;[F, top, right].forEach(quad); ok('H1 mặt trên/bên là bình hành', par(top) && par(right)); num_(F, '1') }
  // 2: tấm dẹt, mặt trên bình hành lớn
  { const F = rect(220, 158, 160, 45), o = S(80, -70)
    const top = [F[0], F[1], add(F[1], o), add(F[0], o)], right = [F[1], add(F[1], o), add(F[2], o), F[2]]
    ;[F, top, right].forEach(quad); ok('H2 mặt trên: hai cạnh kề khác độ dài', Math.abs(dist(top[0], top[1]) - dist(top[0], top[3])) > 15); num_(top, '2') }
  // 3: mặt trước chữ nhật bên phải, mặt trái + mặt trên xiên
  { const F = rect(578, 100, 142, 95), o = S(-48, -50)
    const top = [F[0], F[1], add(F[1], o), add(F[0], o)], left = [F[0], F[3], add(F[3], o), add(F[0], o)]
    ;[F, top, left].forEach(quad); ok('H3 mặt trên/trái là bình hành', par(top) && par(left)); num_(F, '3') }
  // 4, 5: hộp dẹt mặt trên xiên, hai mặt bên xiên
  const hop = (L, a, b, t, ten) => {
    const Ls = S(L.x, L.y), as = S(a.x, a.y), bs = S(b.x, b.y), ts = S(0, t)
    const top = [Ls, add(Ls, as), add(add(Ls, as), bs), add(Ls, bs)]
    const lf = [top[0], top[3], add(top[3], ts), add(top[0], ts)], rt = [top[3], top[2], add(top[2], ts), add(top[3], ts)]
    ;[top, lf, rt].forEach(quad); ok(`H${ten} các mặt là bình hành`, par(top) && par(lf) && par(rt)); return top
  }
  const t4 = hop(P(772, 115), P(130, -50), P(85, 52), 45, 4); num_(t4, '4')
  ok('H4 mặt trên KHÔNG phải hình thoi', Math.abs(dist(t4[0], t4[1]) - dist(t4[0], t4[3])) > 15)
  const t5 = hop(P(1033, 118), P(135, -48), P(135, 48), 50, 5); num_(t5, '5')
  ok('H5 mặt trên là hình thoi (4 cạnh bằng nhau)', near(dist(t5[0], t5[1]), dist(t5[0], t5[3]), 0.01) && near(dist(t5[0], t5[1]), dist(t5[1], t5[2]), 0.01))
  ok('H5 mặt trên không phải hình vuông', Math.abs(dotp(sub(t5[1], t5[0]), sub(t5[3], t5[0]))) > 100)
  return [body.concat(so), pts]
}
for (const ten of ['T105000000689', 'T105000000690', 'T105000000700']) {
  const [b, pts] = khoi()
  hinh(ten, pts, b, { pad: 22, padDuoi: 30 })
}

// ───────── 6) Sáu đường thẳng a, b, c, d, x, y (T105100102001) ─────────
{
  const c0 = P(142, 0), c1 = P(142, 247)
  const x0 = P(28, 47), x1 = P(267, 47)
  const d0 = P(62, 105), d1 = P(297, 105)
  const O = P(142, 105)
  const u = P(0.5, Math.sqrt(3) / 2) // a, b (60°)
  const a0 = add(O, mul(u, -(95 / u.y))), a1 = add(O, mul(u, 107 / u.y))
  const Bp = P(240, 105)
  const b0 = add(Bp, mul(u, -(97 / u.y))), b1 = add(Bp, mul(u, 107 / u.y))
  const v = P(Math.sqrt(3) / 2, -0.5) // y ⊥ a, b
  const yc = P(142, 193)
  const y0 = add(yc, mul(v, -34)), y1 = add(yc, mul(v, 230))
  ok('a ∥ b', near(dotp(sub(a1, a0), P(-(b1.y - b0.y), b1.x - b0.x)), 0, 0.01))
  ok('y ⊥ a', near(dotp(sub(y1, y0), sub(a1, a0)), 0, 0.01))
  ok('y ⊥ b', near(dotp(sub(y1, y0), sub(b1, b0)), 0, 0.01))
  ok('x ∥ d, c ⊥ x, c ⊥ d', x0.y === x1.y && d0.y === d1.y && c0.x === c1.x)
  ok('y cắt a và b trong đoạn', y0.y > 0 && y1.y > 0)
  const body = [seg(c0, c1), seg(x0, x1), seg(d0, d1), seg(a0, a1), seg(b0, b1), seg(y0, y1),
    label(x0, 'x', -14, 8), label(d0, 'd', -14, 8), label(a0, 'a', -13, -6), label(b0, 'b', 13, -6),
    label(y1, 'y', 14, -4), label(c1, 'c', 16, 8)]
  hinh('T105100102001', [c0, c1, x0, x1, d0, d1, a0, a1, b0, b1, y0, y1, P(10, 0), P(325, 0)], body, { pad: 30, padDuoi: 34 })
}
await xuatTat(dir)
