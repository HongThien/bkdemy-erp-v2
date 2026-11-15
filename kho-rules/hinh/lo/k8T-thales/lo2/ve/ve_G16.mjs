// ve_G16.mjs — hình VHB2 §13: VD31, VD32, VD33, BT171..178. Chạy: node ve_G16.mjs (từ thư mục h8t2). Ra hinh_G16/
import { P, seg, segDash, tick, angleMark, rightAngle, ray, dot, label, labelOut, num, bien, mid, lerp, inter, goc, dist, trongTam, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G16'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5, m = '') => { if (!(Math.abs(a - b) < e)) console.error('SAI dữ kiện', m, a, b) }
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
const thang = (a, b, c, m) => { if (Math.abs(cross(a, b, c)) > 1e-6 * (dist(a, b) * dist(a, c) + 1)) console.error('KHÔNG thẳng hàng', m) }
const song = (a, b, c, d, m) => { const u = P(b.x - a.x, b.y - a.y), v = P(d.x - c.x, d.y - c.y); if (Math.abs(u.x * v.y - u.y * v.x) > 1e-6 * dist(a, b) * dist(c, d)) console.error('KHÔNG song song', m) }
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const unit = (v) => { const l = Math.hypot(v.x, v.y); return P(v.x / l, v.y / l) }

// ───── VD31: hình thoi BEDF nội tiếp tam giác ABC (E∈AB, D∈AC, F∈BC) ─────
{
  const a = 250, c = 160
  const B = P(0, 250), C = P(a, 250), A = ray(B, 70, c)
  const x = a * c / (a + c)
  const E = lerp(B, A, x / c), F = lerp(B, C, x / a), D = P(E.x + F.x - B.x, E.y + F.y - B.y)
  thang(A, D, C, 'D∈AC'); near(dist(B, E), dist(B, F), 0.01); near(dist(E, D), dist(B, E), 0.01); song(E, D, B, C, 'ED∥BC'); song(D, F, A, B, 'DF∥AB')
  const O = trongTam([A, B, C])
  const nen = (extra = '') => [seg(A, B), seg(B, C), seg(C, A), seg(E, D), seg(D, F), seg(B, D),
    tick(B, E, 1), tick(E, D, 1), tick(D, F, 1), tick(F, B, 1), extra, dots(A, B, C, D, E, F),
    label(A, 'A', 0, -14), label(B, 'B', -18, 26), label(C, 'C', 18, 26), labelOut(D, 'D', O, 22), labelOut(E, 'E', O, 22), label(F, 'F', 0, 32)]
  hinh('VHB2-VD31', [A, B, C, D, E, F], nen())
  const K = P(B.x - c, B.y)
  hinh('VHB2-VD31_c_lg', [A, B, C, D, E, F, K], [...nen(seg(K, B) + seg(K, A) + tick(B, K, 2) + tick(B, A, 2, 0.88) + dot(K) + label(K, 'K', -14, 30))])
}

// ───── VD32: ABC (AC>AB), D∈AB, E∈AC, BD=CE, K=DE∩BC ─────
{
  const B = P(0, 230), C = P(250, 230), A = P(30, 0), t = 170
  console.assert(dist(A, C) > dist(A, B))
  const D = lerp(B, A, t / dist(B, A)), E = lerp(C, A, t / dist(C, A)), K = inter(D, E, B, C)
  const G = lerp(B, C, dist(B, D) / dist(B, A))
  near(dist(B, D), dist(C, E), 0.01); thang(D, E, K, 'K∈DE'); song(D, G, A, C, 'DG∥AC')
  const O = trongTam([A, B, C])
  const nen = (extra = '', pts = []) => [seg(A, B), seg(B, C), seg(C, A), seg(D, K), tick(B, D, 1), tick(C, E, 1), extra, dots(A, B, C, D, E, K, ...pts),
    label(A, 'A', 0, -14), label(B, 'B', -18, 26), label(C, 'C', 6, 32), label(D, 'D', -22, 6), label(E, 'E', 20, -6), label(K, 'K', 12, 30)]
  hinh('VHB2-VD32', [A, B, C, D, E, K], nen())
  hinh('VHB2-VD32_lg', [A, B, C, D, E, K, G], nen(seg(D, G), [G]).concat(label(G, 'G', -4, 32)))
}

// ───── VD33: hình thang ABCD (AB∥CD, AB<CD), K=AD∩BC, O=AC∩BD, KO cắt AB, CD ở M, N ─────
{
  const D = P(0, 280), C = P(380, 280), K = P(120, 20), s = 0.5
  const A = lerp(K, D, s), B = lerp(K, C, s)
  song(A, B, D, C, 'AB∥CD'); console.assert(dist(A, B) < dist(D, C))
  const O = inter(A, C, B, D), M = inter(K, O, A, B), N = inter(K, O, D, C)
  hinh('VHB2-VD33', [K, A, B, C, D, O, M, N], [seg(K, A), seg(A, D), seg(K, B), seg(B, C), seg(A, B), seg(D, C), seg(A, C), seg(B, D), seg(K, N),
    dots(K, A, B, C, D, O, M, N),
    label(K, 'K', 0, -14), label(A, 'A', -20, -2), label(B, 'B', 20, -2), label(C, 'C', 20, 28), label(D, 'D', -20, 28),
    label(O, 'O', 20, 6), label(M, 'M', -4, -14), label(N, 'N', 0, 32)])
}

// ───── BT171: hình thang AB=28, CD=70, AD=35; EF∥đáy, DE=10 (1 cm = 5 px) ─────
{
  const k = 5, D = P(0, 0), C = P(70 * k, 0), h = Math.sqrt((35 * k) ** 2 - (12 * k) ** 2) // A cách D 12 cm theo chiều ngang
  const Dd = P(0, h), Cc = P(70 * k, h), A = P(12 * k, 0), B = P(12 * k + 28 * k, 0)
  const E = lerp(Dd, A, 10 / 35)
  const F = lerp(B, Cc, (E.y - B.y) / (Cc.y - B.y))
  const Kk = P(A.x + (Cc.x - B.x), h), I = inter(E, F, A, Kk)
  near(dist(Dd, A), 35 * k, 0.01); song(E, F, Dd, Cc, 'EF∥CD'); near(dist(Dd, Kk), 42 * k, 0.01); song(A, Kk, B, Cc, 'AK∥BC'); near(dist(E, I), 30 * k, 0.01); near(dist(E, F), 58 * k, 0.01)
  const nen = (extra = '', pts = [], lb = '') => [seg(A, B), seg(B, Cc), seg(Cc, Dd), seg(Dd, A), seg(E, F), extra, dots(A, B, Cc, Dd, E, F, ...pts),
    label(A, 'A', -6, -14), label(B, 'B', 8, -14), label(Cc, 'C', 20, 26), label(Dd, 'D', -20, 26), label(E, 'E', -20, 6), label(F, 'F', 22, 6), lb]
  hinh('VHB2-171', [A, B, Cc, Dd, E, F], nen())
  hinh('VHB2-171_lg', [A, B, Cc, Dd, E, F, Kk], nen(seg(A, Kk), [Kk, I], label(Kk, 'K', 0, 32) + label(I, 'I', 14, -8)))
}

// ───── BT172: O = AD∩BC (O ở phía đáy AB), đường thẳng qua O ∥ AB cắt AC, BD ở M, N ─────
{
  const O = P(170, 0), D = P(40, 260), C = P(380, 260), s = 0.3
  const A = lerp(O, D, s), B = lerp(O, C, s)
  const ngang = P(O.x + 100, O.y)
  const M = inter(O, ngang, A, C), N = inter(O, ngang, B, D)
  song(A, B, D, C, 'AB∥CD'); thang(O, A, D, 'O,A,D'); thang(O, B, C, 'O,B,C')
  hinh('VHB2-172', [O, D, C, M, N, A, B], [seg(O, D), seg(O, C), seg(D, C), seg(A, B), seg(M, C), seg(N, D), seg(M, N),
    dots(O, A, B, C, D, M, N),
    label(O, 'O', 0, -14), label(M, 'M', 0, -14), label(N, 'N', 0, -14), label(A, 'A', -20, -8), label(B, 'B', 20, -8), label(C, 'C', 20, 28), label(D, 'D', -20, 28)])
}

// ───── BT173: hình thang AB=a, CD=b; qua O (giao hai đường chéo) kẻ ∥AB cắt AD, BC ở E, G ─────
{
  const A = P(95, 0), B = P(215, 0), D = P(0, 230), C = P(340, 230)
  const O = inter(A, C, B, D), ngang = P(O.x + 100, O.y)
  const E = inter(O, ngang, A, D), G = inter(O, ngang, B, C)
  song(A, B, D, C, 'AB∥CD')
  hinh('VHB2-173', [A, B, C, D, O, E, G], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, G),
    dots(A, B, C, D, O, E, G),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(C, 'C', 20, 28), label(D, 'D', -20, 28), label(O, 'O', 4, -12), label(E, 'E', -18, 6), label(G, 'G', 20, 6),
    bien(mid(A, B), 'a', 0, -30), bien(mid(D, C), 'b', 0, 36)])
}

// ───── BT174a: hình thang AB∥CD, d∥đáy cắt AD, BC ở M, N, cắt BD, AC ở H, K ─────
{
  const A = P(70, 0), B = P(250, 0), D = P(0, 200), C = P(330, 200)
  const M = lerp(A, D, 0.5), N = lerp(B, C, 0.5)
  const H = inter(M, N, B, D), K = inter(M, N, A, C)
  song(M, N, A, B, 'd∥AB')
  const dl = P(M.x - 30, M.y), dr = P(N.x + 30, N.y)
  hinh('VHB2-174a', [A, B, C, D, dl, dr], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(dl, dr),
    dots(A, B, C, D, M, N, H, K),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(C, 'C', 20, 28), label(D, 'D', -20, 28),
    label(M, 'M', -4, -12), label(N, 'N', 4, -12), label(H, 'H', -2, 30), label(K, 'K', 2, 30), label(dr, 'd', 18, 8)])
}

// ───── BT175: AC=45, hình chiếu AC, AB trên BC là 27, 15 (1 cm = 5 px) ─────
{
  const k = 5, base = 36 * k, y0 = 0
  // hình đề: trường hợp B nhọn
  const A = P(75, y0), B = P(0, base), H = P(75, base), C = P(210, base)
  near(dist(A, C), 45 * k, 0.01); near(dist(A, B), 39 * k, 0.01)
  const M = mid(B, C), N = lerp(A, C, (M.x - A.x) / (C.x - A.x))
  hinh('VHB2-175', [A, B, C, N, M], [seg(A, B), seg(B, C), seg(C, A), seg(M, N), rightAngle(M, C, N), tick(B, M, 1), tick(M, C, 1),
    dots(A, B, C, N), label(A, 'A', 0, -14), label(B, 'B', -18, 26), label(C, 'C', 18, 26), label(N, 'N', -18, -2)])
  // hình lời giải: hai trường hợp
  const dx = 270
  const A2 = P(75, y0), B2 = P(0, base), H2 = P(75, base), C2 = P(210, base), M2 = mid(B2, C2), N2 = lerp(A2, C2, (M2.x - A2.x) / (C2.x - A2.x))
  const A3 = P(dx, y0), H3 = P(dx, base), B3 = P(dx + 15 * k, base), C3 = P(dx + 27 * k, base), M3 = mid(B3, C3), N3 = lerp(A3, C3, (M3.x - A3.x) / (C3.x - A3.x))
  near(dist(A3, C3), 45 * k, 0.01); near(dist(A3, N3) / dist(A3, C3), 35 / 45, 0.001)
  near(dist(C2, N2), 35 * k, 0.01); near(dist(C3, N3), 10 * k, 0.01)
  hinh('VHB2-175_lg', [A2, B2, C2, A3, C3, H3, P(0, base + 50)], [
    seg(A2, B2), seg(B2, C2), seg(C2, A2), seg(A2, H2), seg(M2, N2), rightAngle(H2, A2, C2), rightAngle(M2, C2, N2), tick(B2, M2, 1), tick(M2, C2, 1),
    seg(A3, B3), seg(B3, C3), seg(C3, A3), seg(A3, H3), segDash(H3, B3), seg(M3, N3), rightAngle(H3, A3, B3), rightAngle(M3, C3, N3), tick(B3, M3, 1), tick(M3, C3, 1),
    dots(A2, B2, C2, H2, M2, N2, A3, B3, C3, H3, M3, N3),
    label(A2, 'A', 0, -14), label(B2, 'B', -18, 26), label(C2, 'C', 18, 26), label(H2, 'H', 0, 32), label(M2, 'M', 8, 32), label(N2, 'N', 18, -2),
    label(A3, 'A', 0, -14), label(H3, 'H', -4, 32), label(B3, 'B', -8, 32), label(C3, 'C', 18, 26), label(M3, 'M', 6, 32), label(N3, 'N', -18, -2),
    num(P(105, base), 'a)', 0, 62), num(P(dx + 66, base), 'b)', 0, 62)])
}

// ───── BT176: hình bình hành ABCD, GD:GC=1:2, KB:KC=3:2; BD=16 ─────
{
  const A = P(90, 0), B = P(430, 0), D = P(0, 230), C = P(340, 230)
  song(A, B, D, C, 'AB∥DC'); song(A, D, B, C, 'AD∥BC')
  const G = lerp(D, C, 1 / 3), K = lerp(B, C, 3 / 5)
  const E = inter(A, G, B, D), F = inter(A, K, B, D)
  near(dist(D, E) / dist(D, B), 0.25, 1e-6); near(dist(B, F) / dist(B, D), 3 / 8, 1e-6)
  const nen = (pts = [], lb = '') => [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(B, D), seg(A, G), seg(A, K), dots(A, B, C, D, G, K, ...pts),
    label(A, 'A', -6, -14), label(B, 'B', 8, -14), label(C, 'C', 20, 28), label(D, 'D', -20, 28), label(G, 'G', 0, 34), label(K, 'K', 20, 6), lb]
  hinh('VHB2-176', [A, B, C, D, G, K], nen())
  hinh('VHB2-176_lg', [A, B, C, D, G, K, E, F], nen([E, F], label(E, 'E', -20, 8) + label(F, 'F', 2, -12)))
}

// ───── BT177a: Â=120°, AB=3, AC=6 (1 cm = 50 px), AD phân giác ─────
{
  const A = P(0, 0), B = ray(A, 210, 150), C = ray(A, 330, 300)
  const D = inter(A, P(0, 100), B, C)
  near(goc(A, B, C), 120, 0.01); near(dist(A, D), 100, 0.01)
  hinh('VHB2-177a', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), angleMark(A, B, D, 30), angleMark(A, D, C, 44), dots(A, B, C, D),
    label(A, 'A', 0, -14), label(B, 'B', -18, 26), label(C, 'C', 18, 26), label(D, 'D', 0, 32)])
}

// ───── BT177b: AD phân giác, 1/AD = 1/AB + 1/AC ⇒ Â = 120° (dựng đúng giá trị thật, không ghi số đo) ─────
{
  const A = P(0, 0), B = ray(A, 210, 160), C = ray(A, 330, 250)
  const D = inter(A, P(0, 100), B, C)
  near(1 / dist(A, D), 1 / dist(A, B) + 1 / dist(A, C), 1e-9, 'hệ thức giả thiết')
  hinh('VHB2-177b', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, A), seg(A, D), angleMark(A, B, D, 30), angleMark(A, D, C, 44), dots(A, B, C, D),
    label(A, 'A', 0, -14), label(B, 'B', -18, 26), label(C, 'C', 18, 26), label(D, 'D', 0, 32)])
}

// ───── BT178: D∈AB, K∈BC, E∈tia đối của tia CA, BD=CE ─────
{
  const A = P(60, 0), B = P(0, 230), C = P(280, 230), t = 80
  const D = lerp(B, A, t / dist(B, A)), u = unit(sub(C, A)), E = P(C.x + u.x * t, C.y + u.y * t)
  const K = inter(D, E, B, C)
  near(dist(B, D), dist(C, E), 0.01); thang(A, C, E, 'E∈AC'); console.assert(K.x > B.x && K.x < C.x, 'K nằm trên cạnh BC')
  const G = lerp(A, C, dist(A, D) / dist(A, B)); song(D, G, B, C, 'DG∥BC')
  const nen = (extra = '', pts = [], lb = '') => [seg(A, B), seg(B, C), seg(A, E), seg(D, E), tick(B, D, 1), tick(C, E, 1), extra, dots(A, B, C, D, E, K, ...pts),
    label(A, 'A', 0, -14), label(B, 'B', -18, 26), label(C, 'C', 22, -4), label(D, 'D', -20, 4), label(E, 'E', 18, 24), label(K, 'K', 4, 32), lb]
  hinh('VHB2-178', [A, B, C, D, E, K], nen())
  hinh('VHB2-178_lg', [A, B, C, D, E, K, G], nen(seg(D, G), [G], label(G, 'G', 22, -8)))
}

await xuatTat(OUT)
