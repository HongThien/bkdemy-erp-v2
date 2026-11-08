// Vẽ lại hình — gói HH00138-6 (Ôn thi giữa kì I, Hình học 7): 8 hình đường thẳng song song / góc.
//   node scripts/anh/ve_lai/HH00138-6.mjs [<thu_muc_ra>]
// Quy ước: mỗi hình một khối { }; dựng điểm bằng số đo CỦA ĐỀ (ray/rot/mid/foot/inter…), không chép toạ độ ước mắt từ ảnh cũ.
import { P, seg, angleMark, rightAngle, sector, fill, ray, dot, label, num, bien, angleText, angleBien, lineExt,
  goc, add, lerp, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00138-6/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, `${ten}: ${v} ≠ ${e}`)
const XAM = '#d9dde3'
/** Ô vuông góc tô xám nhẹ (ảnh cũ HHC002814 có tô) */
const rightFill = (v, p, q, s = 14) => {
  const u1 = P(p.x - v.x, p.y - v.y), l1 = Math.hypot(u1.x, u1.y), u2 = P(q.x - v.x, q.y - v.y), l2 = Math.hypot(u2.x, u2.y)
  const a = P(v.x + u1.x / l1 * s, v.y + u1.y / l1 * s), b = P(v.x + u2.x / l2 * s, v.y + u2.y / l2 * s)
  return fill([v, a, P(a.x + u2.x / l2 * s, a.y + u2.y / l2 * s), b], XAM) + rightAngle(v, p, q, s)
}

// HHC002799 — MN ⊥ MP, MN ⊥ NQ (⇒ MP ∥ NQ), góc MPQ = 135°; hỏi góc NQP
{
  const h = 120
  const M = P(0, 0), N = P(0, h), Pp = P(130, 0)
  const Q = P(Pp.x + h * Math.tan(45 * Math.PI / 180), h)            // PQ nghiêng đúng để góc MPQ = 135°
  const top = lerp(Pp, Q, -0.45), bot = lerp(Pp, Q, 1.4)             // PQ kéo dài hai phía
  const vtop = P(0, -42), vbot = P(0, h + 52)
  const L = -70, R = Q.x + 70
  ok(goc(Pp, M, Q), 135, 'MPQ')
  hinh('HHC002799', [P(L, 0), P(R, h), top, bot, vtop, vbot], [
    seg(P(L, 0), P(R - 25, 0)), seg(P(L, h), P(R, h)), seg(vtop, vbot), seg(top, bot),
    rightAngle(M, Pp, N), rightAngle(N, M, Q),
    angleMark(Pp, M, Q, 26), angleText(Pp, M, Q, '135°', 62),
    dot(M), dot(Pp), dot(N), dot(Q),
    label(M, 'M', -16, -12), label(Pp, 'P', 16, -12), label(N, 'N', -16, 28), label(Q, 'Q', 18, -12)])
}

// HHC002800 — Ax là tia đối của AB; góc BAC = 100°, ABC = 40° (⇒ ACB = 40°); Ay là phân giác của xAC (⇒ Ay ∥ BC)
{
  const B = P(0, 0), A = ray(B, 40, 215), C = P(2 * 215 * Math.cos(40 * Math.PI / 180), 0)
  const x = ray(A, 40, 135)                                          // tia đối của tia AB
  const xAC = 80
  const y = ray(A, 360 - 0, 230)                                     // Ay phân giác xAC: nghiêng xuống 40° so với Ax ⇒ nằm ngang, song song BC
  ok(goc(B, A, C), 40, 'ABC'); ok(goc(A, B, C), 100, 'BAC'); ok(goc(A, x, C), xAC, 'xAC'); ok(goc(A, x, y), 40, 'xAy')
  hinh('HHC002800', [B, C, A, x, y], [
    sector(A, x, C, 34), sector(B, A, C, 36),
    seg(B, C), seg(B, A), seg(A, C), seg(A, x), seg(A, y),
    angleMark(A, x, C, 34), angleMark(B, A, C, 36),
    angleText(A, B, C, '100°', 52), angleText(B, A, C, '40°', 84),
    dot(A),
    label(B, 'B', -18, 18), label(C, 'C', 16, 20), label(A, 'A', -22, -12), label(x, 'x', 8, -8), label(y, 'y', 6, 30)])
}

// HHC002812 — Oa, Ob đối nhau; On phân giác mOb, nOb = 30° ⇒ mOb = 60°, aOm = 120° = (5x + 20)°
{
  const O = P(0, 0), a = P(-190, 0), b = P(190, 0)
  const n = ray(O, 30, 175), m = ray(O, 60, 205)
  ok(goc(O, n, b), 30, 'nOb'); ok(goc(O, m, b), 60, 'mOb'); ok(goc(O, a, m), 120, 'aOm')
  hinh('HHC002812', [a, b, m, n], [
    sector(O, m, b, 30), seg(a, b), seg(O, m), seg(O, n),
    angleMark(O, m, b, 30, 2),
    bien(P(-62, -16), '(5x + 20)°'),
    num(O, '30°', 62, -16),
    dot(O),
    label(O, 'O', 2, 32), label(a, 'a', 0, 32), label(b, 'b', 0, 32), label(m, 'm', -14, -8), label(n, 'n', 18, -6)])
}

// HHC002814 — a ∥ b (cùng ⊥ m); aMN = 120° ⇒ MNB = 120°; NP phân giác MNB; Pt ∥ MN
{
  const s = 0.9, h = 140 * s
  const dx = h / Math.tan(60 * Math.PI / 180)                       // MN nghiêng 60° so với b ⇒ aMN = 120°
  const M = P(0, 0), N = P(dx, h), Pp = P(2 * dx, 0)                // NP là phân giác MNB (MNB = 120° ⇒ NP nghiêng 60°)
  const A = P(Pp.x + 120 * s, 0), B = P(A.x, h)
  const t = P(Pp.x + 75 * s * Math.cos(60 * Math.PI / 180), 75 * s * Math.sin(60 * Math.PI / 180)) // Pt ∥ MN, hướng xuống
  const aL = P(-62 * s, 0), aR = P(A.x + 40 * s, 0), bL = P(-62 * s, h), bR = P(A.x + 40 * s, h)
  const mTop = P(A.x, -78 * s), nBot = P(A.x, h + 62 * s)
  const aPt = P(-120, 0), Bpt = B                                    // điểm chỉ hướng để đo góc
  ok(goc(M, aPt, N), 120, 'aMN'); ok(goc(N, M, Bpt), 120, 'MNB'); ok(goc(N, M, Pp), 60, 'MNP')
  ok(goc(Pp, t, P(Pp.x + 100, 0)), 60, 'tPA(góc t-P-phải)') // Pt cùng hướng MN
  hinh('HHC002814', [aL, aR, bL, bR, mTop, nBot, t, Pp, M], [
    sector(N, M, Bpt, 24), angleMark(N, M, Bpt, 24, 2),
    seg(aL, aR), seg(bL, bR), seg(mTop, nBot), seg(M, N), seg(N, Pp), seg(Pp, t),
    rightFill(A, aL, mTop), rightFill(B, bL, A),
    angleText(M, aPt, N, '120°', 58),
    dot(M), dot(Pp), dot(N), dot(A), dot(B),
    label(M, 'M', 0, -14), label(Pp, 'P', 0, -14), label(N, 'N', 2, 34), label(A, 'A', 22, -8), label(B, 'B', 22, -8),
    label(aL, 'a', 0, -12), label(bL, 'b', 0, 30), label(mTop, 'm', 20, 12), label(nBot, 'n', 20, 4), label(t, 't', -14, 14)])
}

// HHC002822 — hai đường thẳng a, b bị cắt bởi c tại A, B; góc đánh số 1 (dưới phải) · 2 (trên phải) · 3 (trên trái) · 4 (dưới trái)
{
  const gocC = 55, h = 125
  const A = P(0, 0), B = P(-h / Math.tan(gocC * Math.PI / 180), h)
  const cTop = ray(A, gocC, 95), cBot = ray(B, gocC + 180, 80)
  const aL = P(-205, 0), aR = P(135, 0), bL = P(-205, h), bR = P(135, h)
  ok(goc(A, ray(A, gocC, 50), P(100, 0)), gocC, 'c-a')
  // số góc nằm trong từng góc: 2 trên phải · 3 trên trái · 4 dưới trái · 1 dưới phải (cách đỉnh r px theo tia phân giác)
  const so = (V, t, ang, r = 31) => num(ray(V, ang, r), t, 0, 6, 18)
  const gocSo = (V) => [so(V, '2', gocC / 2), so(V, '3', (gocC + 180) / 2), so(V, '4', (180 + gocC + 180) / 2), so(V, '1', (gocC + 180 + 360) / 2)]
  hinh('HHC002822', [aL, aR, bL, bR, cTop, cBot], [
    seg(aL, aR), seg(bL, bR), seg(cBot, cTop),
    ...gocSo(A), ...gocSo(B),
    dot(A), dot(B),
    label(A, 'A', -52, -22), label(B, 'B', 34, 58),
    label(aL, 'a', -2, -12), label(bL, 'b', -2, 32), label(cTop, 'c', 18, 2)])
}

// HHC002823 — zz′ cắt xx′ tại A, yy′ tại D; tt′ cắt xx′ tại B, yy′ tại C; ABC = 120°, xAz = 110°, ADC = 70° (⇒ xx′ ∥ yy′)
{
  const S = 0.85, h = 135 * S
  const A = P(0, 0)
  const dzz = 70, dtt = 300                                          // zz′: nghiêng 70° so với xx′ (xAz = 110°); tt′: BC hướng xuống 60° (ABC = 120°)
  const D = P(-h / Math.tan(dzz * Math.PI / 180), h)
  const B = P(200 * S, 0), C = P(B.x + h / Math.tan(60 * Math.PI / 180), h)
  const z = ray(A, dzz, 118 * S), z1 = ray(D, dzz + 180, 52 * S)
  const t = ray(B, 120, 112 * S), t1 = ray(C, dtt, 56 * S)
  const xL = P(-98 * S, 0), xR = P(C.x + 80 * S, 0), yL = P(-98 * S, h), yR = P(C.x + 80 * S, h)
  const xx = P(-100, 0), xxr = P(100, 0)
  ok(goc(A, xx, z), 110, 'xAz'); ok(goc(D, A, P(D.x + 100, D.y)), 70, 'ADC'); ok(goc(B, A, C), 120, 'ABC')
  hinh('HHC002823', [xL, xR, yL, yR, z, z1, t, t1], [
    seg(xL, xR), seg(yL, yR), seg(z1, z), seg(t, t1),
    angleText(A, xx, z, '110°', 62), angleText(D, A, C, '70°', 64),
    angleText(B, A, C, '120°', 62), num(ray(B, 150, 52), '?', 0, 8),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 22, 30), label(D, 'D', 22, 32), label(B, 'B', 24, -12), label(C, 'C', -22, 34),
    label(z, 'z', -10, -8), label(z1, 'z′', -10, 24), label(t, 't', -12, -8), label(t1, 't′', 16, 18),
    label(xL, 'x', -16, 8), label(xR, 'x′', 22, 8), label(yL, 'y', -16, 8), label(yR, 'y′', 22, 8)])
}

// HHC002818 — Ax ⊥ c, By ⊥ c; CAx = 40°, CBy = 30°; C nằm giữa hai đường, A, B, C cùng phía của c
{
  const H = 125
  // Dựng đúng: A, B cùng hoành độ (như ảnh cũ), C chung ⇒ LA·sin40 + LB·sin30 = H, LA·cos40 = LB·cos30
  const r40 = 40 * Math.PI / 180, r30 = 30 * Math.PI / 180
  const LA = H / (Math.sin(r40) + Math.cos(r40) * Math.tan(r30))
  const A = P(0, 0), B = P(0, H), C = P(LA * Math.cos(r40), LA * Math.sin(r40))
  ok(goc(A, C, P(100, 0)), 40, 'CAx'); ok(goc(B, C, P(100, H)), 30, 'CBy')
  const cx = 222
  const xL = P(-34, 0), xR = P(cx + 68, 0), yL = P(-12, H), yR = P(cx + 68, H)
  const cTop = P(cx, -38), cBot = P(cx, H + 55)
  hinh('HHC002818', [xL, xR, yL, yR, cTop, cBot, C], [
    sector(B, C, P(100, H), 34),
    seg(xL, xR), seg(yL, yR), seg(cTop, cBot), seg(A, C), seg(B, C),
    angleMark(B, C, P(100, H), 34),
    rightAngle(P(cx, 0), P(cx - 50, 0), P(cx, 50)), rightAngle(P(cx, H), P(cx - 50, H), P(cx, H - 50)),
    angleText(A, P(100, 0), C, '40°', 66), angleText(B, C, P(100, H), '30°', 74),
    dot(A), dot(B), dot(C),
    label(A, 'A', -4, -14), label(B, 'B', -14, 26), label(C, 'C', 20, 10),
    label(cTop, 'c', 18, 10), label(xR, 'x', 6, -10), label(yR, 'y', 6, -10)])
}

// HHC002819 — AB ∥ CD ∥ OE, góc A = BAO = 40°, AO ⊥ OC; OE nằm giữa OA và OC (E bên trái)
{
  const A = P(0, 0), B = P(150, 0)
  const O = ray(A, -40, 122)                                         // BAO = 40°
  const dirOC = 230                                                  // OC ⊥ OA: OA hướng 140° từ O ⇒ OC hướng 230° (xuống trái)
  const C = ray(O, dirOC, 98), D = P(C.x + 150, C.y)
  const E = P(O.x - 170, O.y)
  ok(goc(A, B, O), 40, 'BAO'); ok(goc(O, A, C), 90, 'AOC'); ok(goc(O, E, C), 50, 'EOC'); ok(goc(O, A, E), 40, 'AOE')
  hinh('HHC002819', [A, B, C, D, E, O], [
    seg(A, B), seg(C, D), seg(A, O), seg(O, C), seg(E, O),
    rightAngle(O, A, C, 15),
    angleText(A, B, O, '40°', 86),
    dot(A), dot(B), dot(C), dot(D), dot(O), dot(E),
    label(A, 'A', -2, -14), label(B, 'B', 2, -14), label(C, 'C', -2, 34), label(D, 'D', 2, 34), label(O, 'O', 24, 4), label(E, 'E', 0, -14)])
}

await xuatTat(RA)
