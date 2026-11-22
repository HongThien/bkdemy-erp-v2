// ve_G22.mjs — hình đề + hình lời giải NDT-H3.19 … 27 (Hình học III §3 Tính chất đường phân giác). Chạy: node ve_G22.mjs (từ thư mục h8t3)
import { P, seg, segDash, tick, rightAngle, angleMark, dot, label, labelOut, num, bien, mid, lerp, foot, inter, goc, dist, trongTam, hinh, xuatTat }
  from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/ad0c1492ee4a551d/6017bd0a-294b-4bab-8639-506812d8ed78/scratchpad/h8t3/hinh_G22'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5, m = '') => console.assert(Math.abs(a - b) < e, 'sai dữ kiện ' + m, a, b)
const NP = { pad: 42, padDuoi: 70 }

// tam giác theo ba cạnh: B, C nằm ngang (B trái, C phải), A phía trên; s = px/đơn vị
function tamGiac(Bx, By, a, b, c, s) {
  const B = P(Bx, By), C = P(Bx + a * s, By)
  const x = (c * c - b * b + a * a) / (2 * a)
  const A = P(Bx + x * s, By - Math.sqrt(c * c - x * x) * s)
  near(dist(A, B), c * s, 0.01, 'AB'); near(dist(A, C), b * s, 0.01, 'AC')
  return { A, B, C }
}
// thước kích thước dưới đáy (đoạn p→q ở độ sâu h, kèm hai gạch đầu mút)
const thuoc = (p, q, h = 40) => {
  const p2 = P(p.x, p.y + h), q2 = P(q.x, q.y + h)
  return seg(p2, q2) + seg(P(p2.x, p2.y - 7), P(p2.x, p2.y + 7)) + seg(P(q2.x, q2.y - 7), P(q2.x, q2.y + 7))
}
// chân phân giác trong từ v xuống cạnh pq
const chanPG = (v, p, q) => { const k = dist(v, p) / (dist(v, p) + dist(v, q)); return lerp(p, q, k) }
// chữ cạnh: điểm tại t trên đoạn a→b, lệch d px ra phía xa điểm `from`; kiểu 'n' đứng, 'i' nghiêng (chữ cái)
function chuCanh(a, b, t, from, txt, kieu = 'n', d = 20) {
  const m = lerp(a, b, t), v = foot(from, a, b)
  const w = { x: v.x - from.x, y: v.y - from.y }, l = Math.hypot(w.x, w.y) || 1
  const q = P(m.x + w.x / l * d, m.y + w.y / l * d)
  return kieu === 'i' ? bien(q, txt, 0, 8) : num(q, txt, 0, 7)
}
const nhan = (A, B) => mid(P(A.x, A.y + 0), B)

// ───── 19a: ABC, AB=12, AC=6, AD phân giác, BD=9, x=BC ─────
{
  const { A, B, C } = tamGiac(50, 230, 13.5, 6, 12, 28)
  const D = lerp(B, C, 9 / 13.5)
  near(dist(B, D), 9 * 28, 0.01, 'BD')
  const g = trongTam([A, B, C])
  hinh('NDT-H3-19a', [A, B, C, D, P(B.x, B.y + 120)], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D),
    angleMark(A, B, D, 34, 1), angleMark(A, D, C, 44, 1),
    dots(A, B, C, D),
    labelOut(A, 'A', g, 20), label(B, 'B', -16, 8), label(C, 'C', 16, 8), label(D, 'D', 4, 28),
    chuCanh(A, B, 0.5, C, '12'), chuCanh(A, C, 0.5, B, '6'),
    thuoc(B, D, 54), num(mid(P(B.x, B.y + 54), P(D.x, D.y + 54)), '9', 0, -18),
    thuoc(B, C, 92), bien(mid(P(B.x, B.y + 92), P(C.x, C.y + 92)), 'x', 0, -18),
  ], { pad: 42, padDuoi: 40 })
}

// ───── 19b: MNP, MN=10, MP=8, NP=13,5, MI phân giác, y=IP ─────
{
  const { A: M, B: N, C: Pp } = tamGiac(50, 240, 13.5, 8, 10, 26)
  const I = chanPG(M, N, Pp)
  near(dist(I, Pp), 6 * 26, 0.01, 'IP=6')
  const g = trongTam([M, N, Pp])
  hinh('NDT-H3-19b', [M, N, Pp, I, P(N.x, N.y + 120)], [
    seg(M, N), seg(N, Pp), seg(Pp, M), seg(M, I),
    angleMark(M, N, I, 34, 1), angleMark(M, I, Pp, 44, 1),
    dots(M, N, Pp, I),
    labelOut(M, 'M', g, 20), label(N, 'N', -16, 8), label(Pp, 'P', 16, 8), label(I, 'I', -4, 28),
    chuCanh(M, N, 0.5, Pp, '10'), chuCanh(M, Pp, 0.5, N, '8'),
    thuoc(I, Pp, 54), bien(mid(P(I.x, I.y + 54), P(Pp.x, Pp.y + 54)), 'y', 0, -18),
    thuoc(N, Pp, 92), num(mid(P(N.x, N.y + 92), P(Pp.x, Pp.y + 92)), '13,5', 0, -20),
  ], { pad: 42, padDuoi: 40 })
}

// ───── 20 (DE_SAU): ABC, AD phân giác ─────
{
  const { A, B, C } = tamGiac(50, 240, 8, 5.5, 7, 34)
  const D = chanPG(A, B, C), g = trongTam([A, B, C])
  hinh('NDT-H3-20', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D),
    angleMark(A, B, D, 34, 1), angleMark(A, D, C, 44, 1),
    dots(A, B, C, D),
    labelOut(A, 'A', g, 20), label(B, 'B', -16, 8), label(C, 'C', 16, 8), label(D, 'D', 4, 28),
  ], NP)
}

// ───── 21: ABC vuông tại A, AB=8, BC=10, AD phân giác ─────
{
  const s = 32
  const A = P(60, 300), B = P(60, 300 - 8 * s), C = P(60 + 6 * s, 300)
  near(dist(B, C), 10 * s, 0.01, 'BC=10')
  const D = chanPG(A, B, C)
  near(dist(B, D), 40 / 7 * s, 0.01, 'BD')
  const g = trongTam([A, B, C])
  hinh('NDT-H3-21', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D),
    rightAngle(A, B, C, 14), angleMark(A, B, D, 40, 1), angleMark(A, D, C, 50, 1),
    dots(A, B, C, D),
    label(A, 'A', -18, 26), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22),
    chuCanh(A, B, 0.5, C, '8'), chuCanh(B, C, 0.2, A, '10', 'n', 22),
  ], NP)
}

// ───── 24: ABC (BC=a, CA=b, AB=c), O = giao ba phân giác, AO cắt BC ở D ─────
{
  const a = 7, b = 6, c = 5, s = 44
  const { A, B, C } = tamGiac(40, 250, a, b, c, s)
  const D = chanPG(A, B, C), E = chanPG(B, A, C), F = chanPG(C, A, B)
  const O = inter(A, D, B, E)
  near(dist(O, inter(C, F, A, D)), 0, 0.01, 'O đồng quy')
  near(dist(B, D), a * c / (b + c) * s, 0.01, 'DB=ac/(b+c)')
  near(dist(O, A) / dist(O, D), (b + c) / a, 1e-6, 'OA/OD')
  const g = trongTam([A, B, C])
  hinh('NDT-H3-24', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F),
    angleMark(A, B, D, 34, 1), angleMark(A, D, C, 42, 1),
    angleMark(B, A, E, 30, 2), angleMark(B, E, C, 40, 2),
    angleMark(C, A, F, 22, 3), angleMark(C, F, B, 40, 3),
    dots(A, B, C, D, O),
    labelOut(A, 'A', g, 20), label(B, 'B', -16, 8), label(C, 'C', 16, 8), label(D, 'D', 4, 28), label(O, 'O', 14, -8),
    chuCanh(A, B, 0.5, C, 'c', 'i', 22), chuCanh(A, C, 0.5, B, 'b', 'i', 22), chuCanh(B, C, 0.8, A, 'a', 'i', 30),
  ], NP)
}

// ───── 25: ABC cân tại A, AB=AC=m, BC=n, góc A = 36° (+ hình lời giải có phân giác CD) ─────
function cau25(lg) {
  const m = 250, n = 2 * m * Math.sin(18 * Math.PI / 180)
  const B = P(60, 290), C = P(60 + n, 290), A = P(60 + n / 2, 290 - m * Math.cos(18 * Math.PI / 180))
  near(goc(A, B, C), 36, 0.001, 'A=36'); near(goc(B, A, C), 72, 0.001, 'B=72'); near(dist(A, B), m, 0.01)
  const D = lerp(A, B, n / m)   // AD = n (kết quả của lời giải)
  const g = trongTam([A, B, C])
  const pts = [A, B, C].concat(lg ? [D] : [])
  const body = [
    seg(A, B), seg(B, C), seg(C, A),
    dots(...pts),
    labelOut(A, 'A', g, 22), label(B, 'B', -16, 10), label(C, 'C', 16, 10),
    bien(lerp(A, B, 0.5), 'm', -22, 0), bien(lerp(A, C, 0.5), 'm', 22, 0), bien(mid(B, C), 'n', 0, 36),
    num(P(A.x, A.y + 100), '36°', 0, 0),
  ]
  body.push(angleMark(A, B, C, 62, 1))
  if (lg) {
    // các kết quả của lời giải: CD phân giác, ba góc 36°, DA = DC = CB
    body.push(seg(C, D), label(D, 'D', -22, 6))
    body.push(angleMark(C, A, D, 50, 1), angleMark(C, D, B, 62, 1))
    body.push(tick(A, D, 1, 0.5), tick(D, C, 1, 0.5), tick(C, B, 1, 0.5))
  }
  hinh(lg ? 'NDT-H3-25_lg' : 'NDT-H3-25', pts, body, NP)
}
cau25(false); cau25(true)

// ───── 26: ABC, BD, CE phân giác cắt nhau ở I (hình minh hoạ tam giác tổng quát) ─────
{
  const A = P(150, 40), B = P(40, 290), C = P(390, 290)
  const bd = chanPG(B, A, C), ce = chanPG(C, A, B)
  const I = inter(B, bd, C, ce)
  const g = trongTam([A, B, C])
  hinh('NDT-H3-26', [A, B, C, bd, ce, I], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, bd), seg(C, ce),
    angleMark(B, A, bd, 34, 1), angleMark(B, bd, C, 42, 1),
    angleMark(C, A, ce, 34, 2), angleMark(C, ce, B, 44, 2),
    dots(A, B, C, bd, ce, I),
    labelOut(A, 'A', g, 20), label(B, 'B', -16, 10), label(C, 'C', 16, 10), label(bd, 'D', 20, -6), label(ce, 'E', -20, -6), label(I, 'I', 4, 30),
  ], NP)
}

// ───── 27a: AB=4, AC=8, BC=6; AD, BE phân giác trong cắt nhau ở O; G trọng tâm ─────
function cau27a(lg) {
  const s = 40
  const B = P(60, 290), C = P(60 + 6 * s, 290)
  const x = (16 - 64 + 36) / 12
  const A = P(B.x + x * s, B.y - Math.sqrt(16 - x * x) * s)
  near(dist(A, B), 4 * s, 0.01); near(dist(A, C), 8 * s, 0.01)
  const D = chanPG(A, B, C), E = chanPG(B, A, C)
  const O = inter(A, D, B, E), G = P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3), M = mid(B, C)
  near(dist(B, D), 2 * s, 0.01, 'DB=2')
  near(dist(O, A) / dist(O, D), 2, 1e-6, 'OA/OD=2')
  near(O.y, G.y, 1e-6, 'OG ∥ BC')
  const g = trongTam([A, B, C])
  const pts = [A, B, C, D, E, O, G].concat(lg ? [M] : [])
  hinh(lg ? 'NDT-H3-27a_lg' : 'NDT-H3-27a', pts, [
    seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E),
    lg ? seg(A, M) + seg(O, G) : '',
    angleMark(A, B, D, 30, 1), angleMark(A, D, C, 40, 1),
    angleMark(B, A, E, 34, 2), angleMark(B, E, C, 44, 2),
    dots(A, B, C, D, E, O, G, ...(lg ? [M] : [])),
    labelOut(A, 'A', g, 22), label(B, 'B', -16, 14), label(C, 'C', 16, 14), label(D, 'D', -2, 30), labelOut(E, 'E', g, 22),
    label(O, 'O', -20, 4), label(G, 'G', 22, -8), lg ? label(M, 'M', 8, 30) : '',
    chuCanh(A, B, 0.5, C, '4', 'n', 22), chuCanh(A, C, 0.78, B, '8', 'n', 22), chuCanh(B, C, 0.8, A, '6', 'n', 36),
  ], NP)
}
cau27a(false); cau27a(true)

// ───── 27b: ABC nhọn; D, E, F thuộc BC, CA, AB; AD, BE, CF đồng quy ở H; M = BE∩DF, N = CF∩DE ─────
function cau27b(lg) {
  const A = P(100, 45), B = P(40, 300), C = P(420, 300)
  let D, E, F, H
  if (!lg) {
    // hình đề: ba đường đồng quy nhưng KHÔNG đặc biệt (giả thiết về M, N kéo theo kết luận nên không dựng đúng tỉ lệ)
    const wa = 0.25, wb = 0.4, wc = 0.35
    H = P(wa * A.x + wb * B.x + wc * C.x, wa * A.y + wb * B.y + wc * C.y)
    D = lerp(B, C, wc / (wb + wc)); E = lerp(A, C, wc / (wa + wc)); F = lerp(A, B, wb / (wa + wb))
    near(dist(inter(A, D, B, E), inter(C, F, A, D)), 0, 0.01, 'đồng quy')
  } else {
    D = foot(A, B, C); E = foot(B, A, C); F = foot(C, A, B)
    H = inter(A, D, B, E)
  }
  const g = trongTam([A, B, C])
  const pts = [A, B, C, D, E, F, H]
  const body = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(B, E), seg(C, F), seg(D, E), seg(E, F), seg(F, D),
    dots(A, B, C, D, E, F, H),
    labelOut(A, 'A', g, 22), label(B, 'B', lg ? -2 : -16, lg ? 32 : 12), label(C, 'C', 16, 12), label(D, 'D', 4, 30), labelOut(E, 'E', g, 22), labelOut(F, 'F', g, 22)]
  if (!lg) {
    const M = inter(B, E, D, F), N = inter(C, F, D, E)
    pts.push(M, N)
    body.push(dots(M, N), label(H, 'H', 4, -12), label(M, 'M', -18, 20), label(N, 'N', 20, 20))
  } else {
    const Pp = inter(A, D, E, F), T = inter(E, F, B, C)
    pts.push(Pp, T)
    body.push(segDash(F, T), segDash(B, T), dot(Pp), dot(T), label(H, 'H', -14, -10), label(Pp, 'P', -14, -10), label(T, 'T', 0, 30))
  }
  hinh(lg ? 'NDT-H3-27b_lg' : 'NDT-H3-27b', pts, body, NP)
}
cau27b(false); cau27b(true)

await xuatTat(OUT)
