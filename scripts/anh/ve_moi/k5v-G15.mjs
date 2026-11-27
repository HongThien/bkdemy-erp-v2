// k5v-G15.mjs — vẽ lại 10 hình kho Đại khối 5 "Diện tích các hình" (nhận diện hình thang / đường cao).
//   node scripts/anh/ve_moi/k5v-G15.mjs "<gói>\moi"
import { P, seg, hinh, xuatTat, num, label, dot, rightAngle, labelOut, trongTam } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G15.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const cross2 = (a, b) => a.x * b.y - a.y * b.x
const vv = (a, b) => P(b.x - a.x, b.y - a.y)
const song2 = (a, b, c, d) => Math.abs(cross2(vv(a, b), vv(c, d))) < 1e-6
const vuong = (o, a, b) => Math.abs(vv(o, a).x * vv(o, b).x + vv(o, a).y * vv(o, b).y) < 1e-6
const poly = (pts, w = 2) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length])).join('')
const lines = (arr, w) => `<g stroke-width="${w}">${arr.map(([a, b]) => seg(a, b)).join('')}</g>`

// ───── lưới ô vuông ─────
function luoi(ox, oy, cols, rows, c) {
  let s = '<g stroke="#bbb" stroke-width="1">'
  for (let i = 0; i <= cols; i++) s += seg(P(ox + i * c, oy), P(ox + i * c, oy + rows * c))
  for (let j = 0; j <= rows; j++) s += seg(P(ox, oy + j * c), P(ox + cols * c, oy + j * c))
  return s + '</g>'
}

// ───── T105000000636: Mai / Việt trên lưới 11×8 ─────
{
  const c = 30, cols = 11, rows = 8
  const g = (ox) => (x, y) => P(ox + x * c, 10 + y * c)
  const M = g(10), V = g(10 + cols * c + 40)
  // Mai: cho sẵn (3,1)-(9,1) và (3,1)-(1,5); Mai thêm (1,5)-(10,5) và (9,1)-(10,5)
  const m = { a: M(3, 1), b: M(9, 1), c: M(10, 5), d: M(1, 5) }
  ok('Mai: đoạn ngang 6 ô', m.b.x - m.a.x === 6 * c)
  ok('Mai: đoạn xiên xuống 4 sang trái 2', m.d.y - m.a.y === 4 * c && m.a.x - m.d.x === 2 * c)
  ok('Mai: cạnh dưới ∥ cạnh trên (hình thang)', song2(m.a, m.b, m.d, m.c))
  // Việt: (3,1)-(9,1), (3,1)-(1,5); thêm (1,5)-(6,7) và (9,1)-(6,7)
  const v = { a: V(3, 1), b: V(9, 1), c: V(6, 7), d: V(1, 5) }
  ok('Việt: cạnh bên phải xuống 6 sang trái 3', v.c.y - v.b.y === 6 * c && v.b.x - v.c.x === 3 * c)
  ok('Việt: cạnh phải ∥ cạnh xiên cho trước', song2(v.a, v.d, v.b, v.c))
  ok('Việt: cạnh dưới KHÔNG ∥ cạnh trên', !song2(v.a, v.b, v.d, v.c))
  const body = luoi(10, 10, cols, rows, c) + luoi(V(0, 0).x, 10, cols, rows, c)
    + lines([[m.a, m.b], [m.a, m.d]], 4) + lines([[m.d, m.c], [m.c, m.b]], 2.5)
    + lines([[v.a, v.b], [v.a, v.d]], 4) + lines([[v.d, v.c], [v.c, v.b]], 2.5)
    + num(M(5.5, 8), 'Mai', 0, 34, 24) + num(V(5.5, 8), 'Việt', 0, 34, 24)
  hinh('T105000000636', [P(10, 10), P(V(cols, rows).x, 10 + rows * c + 40)], body, { pad: 10, padDuoi: 40 })
}

// ───── T105000000637: Mai / Việt trên lưới 8×7 ─────
{
  const c = 36, cols = 8, rows = 7
  const g = (ox) => (x, y) => P(ox + x * c, 10 + y * c)
  const M = g(10), V = g(10 + cols * c + 40)
  const m = { tl: M(1, 2), bl: M(1, 5), tr: M(5, 0), br: M(5, 6) }
  ok('Mai: hai cạnh bên thẳng đứng, song song', m.tl.x === m.bl.x && m.tr.x === m.br.x)
  const v = { tl: V(1, 2), bl: V(1, 5), tr: V(5, 0), r: V(7, 3) }
  ok('Việt: cạnh trên 4 ngang 2 lên; cạnh dưới 6 ngang 2 lên', v.tr.x - v.tl.x === 4 * c && v.tl.y - v.tr.y === 2 * c && v.r.x - v.bl.x === 6 * c && v.bl.y - v.r.y === 2 * c)
  ok('Việt: cạnh phải 2 ngang 3 xuống', v.r.x - v.tr.x === 2 * c && v.r.y - v.tr.y === 3 * c)
  ok('Việt: không có cặp cạnh đối ∥', !song2(v.tl, v.tr, v.bl, v.r) && !song2(v.tl, v.bl, v.tr, v.r))
  const body = luoi(10, 10, cols, rows, c) + luoi(V(0, 0).x, 10, cols, rows, c)
    + lines([[m.tl, m.bl], [m.tl, m.tr]], 4) + lines([[m.tr, m.br], [m.br, m.bl]], 2.5)
    + lines([[v.tl, v.bl], [v.tl, v.tr]], 4) + lines([[v.tr, v.r], [v.r, v.bl]], 2.5)
    + num(M(4, 7), 'Mai', 0, 34, 24) + num(V(4, 7), 'Việt', 0, 34, 24)
  hinh('T105000000637', [P(10, 10), P(V(cols, rows).x, 10 + rows * c + 40)], body, { pad: 10, padDuoi: 40 })
}

// ───── T105000000762: chữ nhật ABCD, DC chia 7 phần bằng nhau ─────
{
  const u = 60, W = 7 * u, H = 3 / 1.3 * u
  const A = P(0, 0), B = P(W, 0), C = P(W, H), D = P(0, H)
  const Q = [D, ...[1, 2, 3, 4, 5, 6].map((i) => P(i * u, H)), C]
  const [, Hh, I, K, L, M, N] = Q
  ok('AD : DH = 3 : 1,3', Math.abs(H / u - 3 / 1.3) < 1e-6)
  ok('DC = 7 đoạn bằng nhau', Math.abs(C.x - D.x - 7 * u) < 1e-9)
  const lab = (p, t, dx, dy) => label(p, t, dx, dy)
  const body = poly([A, B, C, D]) + seg(A, Hh) + seg(B, N)
    + Q.map(dot).join('') + dot(A) + dot(B)
    + lab(A, 'A', -16, -8) + lab(B, 'B', 16, -8) + lab(C, 'C', 14, 30) + lab(D, 'D', -14, 30)
    + [['H', Hh], ['I', I], ['K', K], ['L', L], ['M', M], ['N', N]].map(([t, p]) => lab(p, t, 0, 30)).join('')
    + num(P(-8, H / 2), '3 cm', -28, 6, 20)
    + num(P(D.x + 24, H - 10), '1,3 cm', 0, 0, 15)
  hinh('T105000000762', [A, B, C, D, P(-70, 0), P(-20, 0)], body, { pad: 36, padDuoi: 62 })
}

// ───── T105000000999: Hình A–D ─────
{
  const k = 0.46
  const S = (ox, arr) => arr.map(([x, y]) => P(ox + x * k, y * k))
  const A = S(0, [[50, 260], [100, 140], [230, 90], [270, 290]])
  const B = S(0, [[360, 280], [420, 100], [540, 100], [600, 280]])
  const C = S(0, [[680, 280], [780, 80], [920, 280]])
  const R = 100, Dd = [0, 1, 2, 3, 4].map((i) => [1120 + R * 1.15 * Math.sin(i * 72 * Math.PI / 180), 195 - R * 1.15 * Math.cos(i * 72 * Math.PI / 180)])
  const D = S(0, Dd)
  ok('A: không có cặp cạnh ∥', !song2(A[0], A[1], A[2], A[3]) && !song2(A[1], A[2], A[3], A[0]))
  ok('B: cạnh trên ∥ cạnh dưới', song2(B[0], B[3], B[1], B[2]))
  ok('B: hai cạnh bên không ∥', !song2(B[0], B[1], B[3], B[2]))
  const maxY = Math.max(...[...A, ...B, ...C, ...D].map((p) => p.y))
  const nhan = (arr, t) => num(P(trongTam(arr).x, maxY + 40), t, 0, 0, 22)
  const body = [A, B, C, D].map((s) => poly(s)).join('') + nhan(A, 'Hình A') + nhan(B, 'Hình B') + nhan(C, 'Hình C') + nhan(D, 'Hình D')
  hinh('T105000000999', [...A, ...B, ...C, ...D, P(trongTam(A).x, maxY + 50)], body, { pad: 24, padDuoi: 40 })
}

// ───── T105100404001 / 002: lưới, 3 hình mỗi ảnh ─────
function banLuoi(ten, cols, rows, c, figs) {
  const g = (x, y) => P(10 + x * c, 10 + y * c)
  let body = luoi(10, 10, cols, rows, c)
  const pts = [g(0, 0), g(cols, rows + 1.2)]
  for (const f of figs) {
    const ps = f.p.map(([x, y]) => g(x, y))
    body += poly(ps) // nét 2
    body += num(g(f.lx, rows + 0.75), f.t, 0, 0, 22)
  }
  hinh(ten, pts, body, { pad: 10, padDuoi: 40 })
}
{
  const g = (x, y) => P(x * 36, y * 36)
  const s1 = [[1, 4], [2, 1], [5, 2], [6, 4]], s2 = [[7, 4], [8, 1], [10, 1], [12, 4]], s3 = [[14, 4], [16, 1], [19, 1], [19, 4]]
  const q = (a) => a.map(([x, y]) => g(x, y))
  const [a1, a2, a3] = [q(s1), q(s2), q(s3)]
  ok('H1: không ∥', !song2(a1[0], a1[1], a1[3], a1[2]) && !song2(a1[1], a1[2], a1[3], a1[0]))
  ok('H2: đáy ∥, bên không ∥', song2(a2[0], a2[3], a2[1], a2[2]) && !song2(a2[0], a2[1], a2[3], a2[2]))
  ok('H3: đáy ∥, vuông', song2(a3[0], a3[3], a3[1], a3[2]) && vuong(a3[3], a3[0], a3[2]))
  banLuoi('T105100404001', 20, 4, 36, [
    { p: s1, t: 'Hình 1', lx: 3.5 }, { p: s2, t: 'Hình 2', lx: 9.5 }, { p: s3, t: 'Hình 3', lx: 16.5 }])
}
{
  const g = (x, y) => P(x * 36, y * 36)
  const s4 = [[1, 0], [4, 0], [6, 3], [1, 3]], s5 = [[7, 0], [12, 0], [11, 2], [8, 2]], s6 = [[14, 1], [18, 0], [19, 1], [19, 3]]
  const q = (a) => a.map(([x, y]) => g(x, y))
  const [a4, a5, a6] = [q(s4), q(s5), q(s6)]
  ok('H4: đáy ∥, vuông', song2(a4[0], a4[1], a4[3], a4[2]) && vuong(a4[0], a4[1], a4[3]))
  ok('H5: đáy ∥, bên không ∥', song2(a5[0], a5[1], a5[3], a5[2]) && !song2(a5[1], a5[2], a5[3], a5[0]))
  ok('H6: không ∥', !song2(a6[0], a6[1], a6[3], a6[2]) && !song2(a6[1], a6[2], a6[0], a6[3]))
  banLuoi('T105100404002', 20, 4, 36, [
    { p: s4, t: 'Hình 4', lx: 3.5 }, { p: s5, t: 'Hình 5', lx: 9.5 }, { p: s6, t: 'Hình 6', lx: 16.5 }])
}

// ───── T105100404003: Hình 1–4 ─────
{
  const k = 0.3
  const S = (arr) => arr.map(([x, y]) => P(x * k, y * k))
  const F1 = S([[122, 310], [295, 32], [482, 310]])
  const F2 = S([[641, 40], [865, 128], [953, 310], [566, 310]])
  const F3 = S([[985, 65], [1421, 65], [1326, 305], [1078, 305]])
  const F4 = S([[1498, 138], [1837, 36], [1915, 118], [1915, 315]])
  ok('F2 không ∥', !song2(F2[0], F2[1], F2[3], F2[2]) && !song2(F2[1], F2[2], F2[0], F2[3]))
  ok('F3 đáy ∥, bên không ∥', song2(F3[0], F3[1], F3[3], F3[2]) && !song2(F3[1], F3[2], F3[0], F3[3]))
  ok('F4 không ∥', !song2(F4[0], F4[1], F4[3], F4[2]) && !song2(F4[1], F4[2], F4[0], F4[3]))
  const yL = 400 * k
  const nhan = (arr, t) => num(P((Math.min(...arr.map((p) => p.x)) + Math.max(...arr.map((p) => p.x))) / 2, yL), t, 0, 0, 22)
  const body = [F1, F2, F3, F4].map((s) => poly(s)).join('') + nhan(F1, 'Hình 1') + nhan(F2, 'Hình 2') + nhan(F3, 'Hình 3') + nhan(F4, 'Hình 4')
  hinh('T105100404003', [...F1, ...F2, ...F3, ...F4, P(0, yL + 8)], body, { pad: 24, padDuoi: 40 })
}

// ───── T105100404004: hình thang vuông ABCD (vuông tại A, D) ─────
{
  const A = P(118, 97), B = P(470, 97), C = P(825, 485), D = P(118, 485)
  const k = 0.5, S = (p) => P(p.x * k, p.y * k)
  const [a, b, c, d] = [A, B, C, D].map(S)
  ok('AB ∥ DC', song2(a, b, d, c)); ok('AD ⟂ AB, DC', vuong(a, b, d) && vuong(d, a, c))
  const body = poly([a, b, c, d]) + rightAngle(a, b, d, 14) + rightAngle(d, a, c, 14)
    + label(a, 'A', -16, -8) + label(b, 'B', 6, -10) + label(c, 'C', 14, 24) + label(d, 'D', -14, 30)
  hinh('T105100404004', [a, b, c, d, P(c.x + 30, c.y)], body, { pad: 36, padDuoi: 62 })
}

// ───── T105100404005: ABCD (vuông tại B, C), KHIJ, EFGP (vuông tại F, G, nghiêng) ─────
{
  const A = P(148, 65), B = P(335, 65), C = P(335, 250), D = P(25, 250)
  const J = P(489, 242), I = P(796, 242), Kk = P(550, 58), Hh = P(672, 58)
  // EFGP: EF ∥ PG, FG ⟂ cả hai, nghiêng như ảnh cũ
  const G = P(1150, 215), dl = P(0.931, 0.362), dn = Math.hypot(dl.x, dl.y)
  const dd = P(dl.x / dn, dl.y / dn), n = P(dd.y, -dd.x)
  const F = P(G.x + 110 * n.x, G.y + 110 * n.y), E = P(F.x - 134 * dd.x, F.y - 134 * dd.y), Pp = P(G.x - 290 * dd.x, G.y - 290 * dd.y)
  ok('ABCD: AB ∥ DC, BC ⟂ AB', song2(A, B, D, C) && vuong(B, A, C))
  ok('KHIJ: KH ∥ JI, cạnh bên không ∥', song2(Kk, Hh, J, I) && !song2(Kk, J, Hh, I))
  ok('EFGP: EF ∥ PG, FG ⟂ EF', song2(E, F, Pp, G) && vuong(F, E, G))
  ok('EFGP: PE không ∥ GF', !song2(Pp, E, G, F))
  const k = 0.58, T = (p) => P(p.x * k, p.y * k)
  const [a, b, c, d, j, i, kk, hh, pp, e, f, g] = [A, B, C, D, J, I, Kk, Hh, Pp, E, F, G].map(T)
  const t1 = trongTam([a, b, c, d]), t2 = trongTam([kk, hh, i, j]), t3 = trongTam([pp, e, f, g])
  const body = poly([a, b, c, d]) + poly([kk, hh, i, j]) + poly([pp, e, f, g])
    + labelOut(a, 'A', t1, 20) + labelOut(b, 'B', t1, 20) + labelOut(c, 'C', t1, 22) + labelOut(d, 'D', t1, 22)
    + labelOut(kk, 'K', t2, 20) + labelOut(hh, 'H', t2, 20) + labelOut(i, 'I', t2, 22) + labelOut(j, 'J', t2, 22)
    + labelOut(pp, 'P', t3, 20) + labelOut(e, 'E', t3, 20) + labelOut(f, 'F', t3, 20) + labelOut(g, 'G', t3, 22)
  hinh('T105100404005', [a, b, c, d, j, i, kk, hh, pp, e, f, g], body, { pad: 34, padDuoi: 60 })
}

// ───── T105100404006: ADGH vuông tại A, H ─────
{
  const A = P(52, 330), H = P(200, 330), G = P(200, 42), D = P(52, 165)
  ok('AD ∥ HG', song2(A, D, H, G)); ok('AH ⟂ AD, HG', vuong(A, H, D) && vuong(H, A, G))
  const body = poly([A, H, G, D]) + rightAngle(A, H, D, 14) + rightAngle(H, A, G, 14)
    + label(A, 'A', -16, 28) + label(H, 'H', 18, 28) + label(G, 'G', 14, -4) + label(D, 'D', -18, 0)
  hinh('T105100404006', [A, H, G, D, P(240, 20)], body, { pad: 30, padDuoi: 62 })
}

await xuatTat(dir)
