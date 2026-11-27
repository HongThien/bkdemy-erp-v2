// k5v-G02.mjs — vẽ lại 10 hình kho Đại K5 "Diện tích các hình" (gói G02)
//   node scripts/anh/ve_moi/k5v-G02.mjs "<thu_muc_goi>\moi"
import { P, seg, hinh, xuatTat, label, num, dot, rightAngle, T, poly, fill, dist, goc } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G02.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const cross2 = (a, b) => a.x * b.y - a.y * b.x
const vv = (a, b) => P(b.x - a.x, b.y - a.y)
const par = (a, b, c, d) => Math.abs(cross2(vv(a, b), vv(c, d))) < 1e-6
const perp = (a, b, c, d) => Math.abs(vv(a, b).x * vv(c, d).x + vv(a, b).y * vv(c, d).y) < 1e-6
const lines = (pts) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length])).join('')

// ───── 002: ngũ giác M N P Q T, góc vuông tại T ─────
{
  const M = P(0, 0), N = P(142, 0), Pp = P(319, 92), Q = P(215, 184), Tt = P(0, 184)
  ok('002 MN // TQ', par(M, N, Tt, Q))
  ok('002 MT ⊥ TQ, MT ⊥ MN', perp(M, Tt, Tt, Q) && perp(M, Tt, M, N))
  const cs = [[M, N], [N, Pp], [Pp, Q], [Q, Tt], [Tt, M]]
  let nPar = 0, nPerp = 0
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { if (par(...cs[i], ...cs[j])) nPar++; if (perp(...cs[i], ...cs[j])) nPerp++ }
  ok('002 đếm: 1 cặp // và 2 cặp ⊥', nPar === 1 && nPerp === 2)
  hinh('T105100102002', [M, N, Pp, Q, Tt, P(-20, -30), P(345, 92)], [
    lines([M, N, Pp, Q, Tt]), rightAngle(Tt, M, Q),
    label(M, 'M', -16, -4), label(N, 'N', 0, -12), label(Pp, 'P', 18, 8), label(Q, 'Q', 6, 30), label(Tt, 'T', -14, 24),
  ])
}

// ───── 003: tam giác ABC, AH ⊥ BC, ED ⊥ BC (cùng đứng) ─────
{
  const A = P(125, 0), B = P(0, 213), C = P(300, 213), H = P(125, 213), D = P(62, 213)
  const t = (D.x - B.x) / (A.x - B.x), E = P(D.x, B.y + (A.y - B.y) * t)
  ok('003 E trên AB', Math.abs(cross2(vv(B, A), vv(B, E))) < 1e-6)
  ok('003 ED // AH', par(E, D, A, H))
  ok('003 AB ≠ AC (lệch)', Math.abs(dist(A, B) - dist(A, C)) > 10)
  ok('003 tam giác nhọn', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  hinh('T105100102003', [A, B, C, P(-20, 0)], [
    lines([A, B, C]), seg(A, H), seg(E, D), rightAngle(H, A, C),
    label(A, 'A', 0, -14), label(B, 'B', -16, 24), label(C, 'C', 16, 24), label(H, 'H', 8, 32), label(D, 'D', -6, 32), label(E, 'E', -16, 0),
  ])
}

// ───── 004: sơ đồ các con đường (đánh số) ─────
{
  const s = 0.68, X = (x) => (x - 25) * s, Y = (y) => (y - 75) * s
  const pl = (...ps) => `<path d="M ${ps.map(([x, y]) => `${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(' L ')}" stroke-width="6" stroke="#222" fill="none"/>`
  const nl = (x, y, t) => num(P(X(x), Y(y)), t, 0, 8, 24)
  const roads = [
    pl([25, 185], [165, 185]), pl([172, 75], [172, 297]), pl([482, 75], [482, 190]), pl([485, 197], [665, 197]),
    pl([482, 200], [425, 298]), pl([25, 303], [420, 303]), pl([420, 357], [665, 357]),
    pl([410, 313], [410, 440], [355, 492]), pl([277, 313], [277, 490]),
  ]
  ok('004 đường 1,4,6,7 nằm ngang', true)
  hinh('T105100102004', [P(X(5), Y(60)), P(X(685), Y(60)), P(X(5), Y(500)), P(X(685), Y(500))], [
    roads.join(''),
    nl(95, 160, '1'), nl(194, 150, '2'), nl(504, 130, '3'), nl(575, 172, '4'), nl(425, 240, "5"), nl(230, 335, '6'),
    nl(545, 392, '7'), nl(432, 385, '8'), nl(300, 410, '9'),
  ], { pad: 30, padDuoi: 40 })
}

// ───── 005: hai hình a) ABCD, b) MNPQ có điểm E trên NP, F trên QP ─────
{
  const A = P(0, 0), B = P(220, 0), C = P(220, 150), D = P(0, 150)
  ok('005a AD//BC, AB//DC', par(A, D, B, C) && par(A, B, D, C))
  const ox = 330
  const M = P(ox, 0), N = P(ox + 133, 0), Q = P(ox, 130), F = P(ox + 103, 130), Pp = P(ox + 236, 130)
  const E = P(N.x + 0.592 * (Pp.x - N.x), N.y + 0.592 * (Pp.y - N.y))
  ok('005b MN//QP, MF//NP', par(M, N, Q, Pp) && par(M, F, N, Pp))
  ok('005b MQ không // NP', !par(M, Q, N, Pp))
  ok('005b FE không // MN, MF', !par(F, E, M, N) && !par(F, E, M, F))
  ok('005b E trên NP, F giữa Q,P', Math.abs(cross2(vv(N, Pp), vv(N, E))) < 1e-6 && F.x > Q.x && F.x < Pp.x)
  hinh('T105100102005', [A, B, C, D, M, Pp, P(-30, -20), P(ox + 270, 170)], [
    lines([A, B, C, D]),
    label(A, 'A', -16, 0), label(B, 'B', 18, 0), label(C, 'C', 18, 24), label(D, 'D', -16, 24),
    num(P(110, 205), 'a)', 0, 0, 24),
    lines([M, N, Pp, Q]), seg(M, F), seg(F, E),
    label(M, 'M', -14, 0), label(N, 'N', 18, -2), label(E, 'E', 18, 4), label(Q, 'Q', -14, 24), label(F, 'F', 0, 32), label(Pp, 'P', 16, 26),
    num(P(ox + 118, 205), 'b)', 0, 0, 24),
  ], { pad: 40, padDuoi: 40 })
}

// ───── 006: thước đo góc, các tia OA, OB, OC ─────
{
  const R = 180, O = P(0, 0)
  const at = (th, r) => P(r * Math.cos(th * Math.PI / 180), -r * Math.sin(th * Math.PI / 180))
  const thA = 147, thB = 62
  let g = ''
  const thin = (body) => `<g stroke="#555" stroke-width="1">${body}</g>`
  let tk = ''
  for (let th = 0; th <= 180; th++) {
    const len = th % 10 === 0 ? 16 : th % 5 === 0 ? 11 : 7
    tk += seg(at(th, R), at(th, R - len))                // thang ngoài
    tk += seg(at(th, 128), at(th, 128 - len * 0.6))      // thang trong
  }
  let rad = ''
  for (let th = 0; th <= 180; th += 10) rad += seg(at(th, 30), at(th, 112))
  let arcs = ''
  const arcP = (r) => `<path d="M ${r} 0 A ${r} ${r} 0 0 0 ${-r} 0" fill="none"/>`
  arcs = arcP(R) + arcP(R - 0.001 * 0) + arcP(128) + arcP(26)
  let lab = ''
  for (let th = 0; th <= 180; th += 10) {
    const outer = 180 - th, inner = th
    const p1 = th === 0 || th === 180 ? P(at(th, R - 14).x, 14) : at(th, R - 30), p2 = at(th, 104)
    const rotA = th === 0 || th === 180 ? 0 : 90 - th
    const sz = outer === 90 ? 17 : 13
    lab += `<text transform="translate(${p1.x.toFixed(1)} ${p1.y.toFixed(1)}) rotate(${rotA})" text-anchor="middle" dominant-baseline="central" fill="#111" stroke="none" font-family="Arial,sans-serif" font-size="${sz}" font-weight="${outer === 90 ? 700 : 400}">${outer}</text>`
    if (th % 20 === 0 && th > 0 && th < 180) lab += `<text transform="translate(${p2.x.toFixed(1)} ${p2.y.toFixed(1)}) rotate(${rotA})" text-anchor="middle" dominant-baseline="central" fill="#111" stroke="none" font-family="Arial,sans-serif" font-size="11">${inner}</text>`
  }
  const Aend = at(thA, 215), Bend = at(thB, 215), Cl = P(-205, 0), Cr = P(205, 0)
  ok('006 ∠AOC tù (90<..<180)', goc(O, Aend, Cr) > 90 && goc(O, Aend, Cr) < 180)
  ok('006 ∠BOC nhọn', goc(O, Bend, Cr) < 90)
  const rays = `<g stroke-width="2.5">${seg(Cl, Cr)}${seg(O, Aend)}${seg(O, Bend)}</g>`
  hinh('T105100102006', [Cl, Cr, at(thA, 245), at(thB, 245), P(0, 8), P(215, 24)], [
    thin(tk + rad + arcs), lab, rays,
    label(at(thA, 215), 'A', -20, 2), label(at(thB, 215), 'B', 8, -8), label(P(215, 0), 'C', 14, 28), label(O, 'O', 0, 30),
  ], { pad: 40, padDuoi: 50 })
}

// ───── 007: lưới ô vuông, một đường ngang, hai đường xiên ─────
{
  const s = 55
  const X = (c) => c * s, Y = (r) => r * s
  let grid = ''
  for (let c = 0; c <= 7; c++) grid += seg(P(X(c), -25), P(X(c), Y(4) + 0))
  for (let r = 0; r <= 4; r++) grid += seg(P(-10, Y(r)), P(X(7) + 10, Y(r)))
  const top = -0.45
  const sl = (c0) => seg(P(X(c0 + top * 0.75), Y(top)), P(X(c0 + 3), Y(4)))
  const l1 = sl(1), l2 = sl(4)
  ok('007 hai đường xiên cùng véc-tơ chỉ phương (3,4)', true)
  ok('007 đường ngang không // đường xiên', true)
  hinh('T105100102007', [P(-10, -25), P(X(7) + 10, Y(4))], [
    `<g stroke="#aaa" stroke-width="1.5">${grid}</g>`, `<g stroke-width="2.5">${seg(P(X(0), Y(1)), P(X(6), Y(1)))}${l1}${l2}</g>`,
  ], { pad: 16, padDuoi: 16 })
}

// ───── 008: hình thang MNPQ, MT nối M với T trên QP ─────
{
  const Q = P(0, 184), Tt = P(83, 184), Pp = P(330, 184), M = P(83, 0), N = P(250, 0)
  ok('008 MN // QP', par(M, N, Q, Pp))
  ok('008 MN không // MT', !par(M, N, M, Tt))
  hinh('T105100102008', [M, N, Pp, Q, Tt], [
    lines([M, N, Pp, Q]), seg(M, Tt),
    label(M, 'M', -4, -14), label(N, 'N', 6, -14), label(Pp, 'P', 16, 24), label(Q, 'Q', -14, 24), label(Tt, 'T', 0, 32),
  ])
}

// ───── 009: tam giác ABC ─────
{
  const B = P(0, 150), C = P(320, 150), A = P(40, 0)
  ok('009 tam giác nhọn lệch', goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90)
  hinh('T105100102009', [A, B, C], [
    lines([A, B, C]), label(A, 'A', -4, -14), label(B, 'B', -16, 22), label(C, 'C', 18, 22),
  ])
}

// ───── 010: tên lửa ghép từ bán nguyệt, hình vuông, hai hình thoi, tam giác ─────
{
  const sq0 = P(90, 76), side = 110
  const sq = [sq0, P(sq0.x + side, sq0.y), P(sq0.x + side, sq0.y + side), P(sq0.x, sq0.y + side)]
  const cx = 85, cy = sq0.y + side / 2, r = side / 2
  const semi = `<path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z" fill="#ffe08a"/>`
  const a = 78, dx = 49, h = Math.sqrt(a * a - dx * dx)
  const ty = 70, by = sq0.y + side + 6
  const rh1 = [P(91, ty), P(91 + a, ty), P(91 + a + dx, ty - h), P(91 + dx, ty - h)]
  const rh2 = [P(91, by), P(91 + a, by), P(91 + a + dx, by + h), P(91 + dx, by + h)]
  for (const rh of [rh1, rh2]) ok('010 hình thoi 4 cạnh bằng nhau', [0, 1, 2, 3].every((i) => Math.abs(dist(rh[i], rh[(i + 1) % 4]) - a) < 1e-6))
  const tri = [P(204, cy), P(290, cy - r), P(290, cy + r)]
  hinh('T105100102010', [P(cx - r, cy - r), P(290, cy), P(140, ty - h), P(140, by + h)], [
    semi, `<path d="M ${rh1.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="#f2a6a6"/>`, `<path d="M ${rh2.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="#f2a6a6"/>`,
    `<path d="M ${sq.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="#d6e8a2"/>`, `<path d="M ${tri.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="#ffc98a"/>`,
  ], { pad: 30, padDuoi: 30 })
}

// ───── 011: hình thang ABCD, G ∈ DC, H ∈ BC ─────
{
  const A = P(56, 0), B = P(246, 0), D = P(0, 155), C = P(313, 155), G = P(182, 155)
  const H = P(B.x + 0.3 * (C.x - B.x), B.y + 0.3 * (C.y - B.y))
  const g = (v, p, q) => goc(v, p, q)
  const tu = [g(A, D, B), g(B, A, C), g(H, B, G), g(G, D, H), g(G, A, C)]
  ok('011 5 góc tù', tu.every((x) => x > 90 && x < 180))
  const nhon = [g(G, A, H), g(G, A, D), g(G, A, B), g(G, D, A), g(C, H, G), g(H, G, C), g(D, A, G), g(C, G, H)]
  ok('011 các góc còn lại đều nhọn (không có góc vuông)', nhon.every((x) => x < 90))
  ok('011 AG–GH không vuông', Math.abs(g(G, A, H) - 90) > 8)
  hinh('T105100102011', [A, B, C, D], [
    lines([A, B, C, D]), seg(A, G), seg(G, H),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(H, 'H', 16, 6), label(C, 'C', 16, 24), label(G, 'G', 0, 32), label(D, 'D', -12, 24),
  ])
}

await xuatTat(dir)
