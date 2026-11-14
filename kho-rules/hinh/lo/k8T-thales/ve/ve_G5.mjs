// G5 — NĐT Hình III §2, bài 10–14 (Thalès đảo / hệ quả). Chạy: node ve_G5.mjs (từ thư mục h8t)
import {
  P, seg, segDash, dot, label, num, bien, tick, lerp, mid, inter, dist, sideText, trongTam, labelOut, hinh, xuatTat,
} from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t/hinh_G5'
const chk = (c, m) => { if (!c) throw new Error('ASSERT: ' + m) }

// ───────── Bài 10: AD=12 DB=10 AE=13,2 EC=11 BF=9 FC=10,8 ─────────
{
  const k = 12
  const AB = 22, AC = 24.2, BC = 19.8
  const ax = (AB * AB - AC * AC + BC * BC) / (2 * BC), ay = Math.sqrt(AB * AB - ax * ax)
  const B = P(0, ay * k), C = P(BC * k, ay * k), A = P(ax * k, 0)
  const D = lerp(A, B, 12 / 22), E = lerp(A, C, 13.2 / 24.2), F = lerp(B, C, 9 / 19.8)
  chk(Math.abs(dist(A, D) / k - 12) < 1e-6 && Math.abs(dist(D, B) / k - 10) < 1e-6, 'b10 AD DB')
  chk(Math.abs(dist(A, E) / k - 13.2) < 1e-6 && Math.abs(dist(E, C) / k - 11) < 1e-6, 'b10 AE EC')
  chk(Math.abs(dist(B, F) / k - 9) < 1e-6 && Math.abs(dist(F, C) / k - 10.8) < 1e-6, 'b10 BF FC')
  const G = trongTam([A, B, C])
  hinh('NDT-H3-10', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E), seg(D, F),
    [A, B, C, D, E, F].map(dot).join(''),
    labelOut(A, 'A', G, 22), labelOut(B, 'B', G, 22), labelOut(C, 'C', G, 22),
    labelOut(D, 'D', G, 20), labelOut(E, 'E', G, 20), labelOut(F, 'F', G, 20),
    sideText(A, D, '12', G, 20), sideText(D, B, '10', G, 20),
    sideText(A, E, '13,2', G, 26), sideText(E, C, '11', G, 20),
    sideText(B, F, '9', G, 22), sideText(F, C, '10,8', G, 22),
  ])
}

// ───────── Bài 11: AD=5 DB=7,5 DE=6,4 DE∥BC, x=BC=16 ─────────
{
  const k = 17
  const bx = 4.5, by = Math.sqrt(12.5 * 12.5 - bx * bx)   // AB = 12,5
  const B = P(0, by * k), C = P(16 * k, by * k), A = P(bx * k, 0)
  const D = lerp(A, B, 0.4), E = lerp(A, C, 0.4)
  chk(Math.abs(dist(A, D) / k - 5) < 1e-6 && Math.abs(dist(D, E) / k - 6.4) < 1e-6, 'b11')
  const G = trongTam([A, B, C])
  hinh('NDT-H3-11', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E),
    [A, B, C, D, E].map(dot).join(''),
    labelOut(A, 'A', G, 22), labelOut(B, 'B', G, 22), labelOut(C, 'C', G, 22),
    labelOut(D, 'D', G, 20), labelOut(E, 'E', G, 20),
    sideText(A, D, '5', G, 18), sideText(D, B, '7,5', G, 22),
    num(mid(D, E), '6,4', 0, 28),
    bien(mid(B, C), 'x', 0, 34),
  ])
}

// ───────── Bài 12: AD/DB = AE/EC (=2/3), chứng minh AD/AB = DE/BC ─────────
{
  const A = P(110, 0), B = P(0, 190), C = P(300, 190)
  const D = lerp(A, B, 0.4), E = lerp(A, C, 0.4)
  const G = trongTam([A, B, C])
  hinh('NDT-H3-12', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(D, E),
    [A, B, C, D, E].map(dot).join(''),
    labelOut(A, 'A', G, 22), labelOut(B, 'B', G, 22), labelOut(C, 'C', G, 22),
    labelOut(D, 'D', G, 20), labelOut(E, 'E', G, 20),
  ])
}

// ───────── Bài 13: hình bình hành ABCD, tia Ax cắt BD ở M, BC ở N, CD ở K ─────────
{
  const A = P(80, 0), B = P(230, 0), D = P(0, 110)
  const C = P(B.x + D.x - A.x, B.y + D.y - A.y)               // ABCD là hình bình hành: C = B + D − A
  const K = lerp(D, C, 1.6)                                    // K nằm trên đường thẳng CD, ngoài đoạn CD (phía C)
  const M = inter(A, K, B, D), N = inter(A, K, B, C)
  const X = lerp(A, K, 1.2)
  const ok = (p, a, b) => { const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (dist(a, b) ** 2); return t > 0 && t < 1 }
  chk(ok(M, B, D) && ok(N, B, C) && ok(M, A, K) && ok(N, A, K), 'b13 thứ tự')
  chk(dist(A, M) < dist(A, N) && dist(A, N) < dist(A, K), 'b13 A,M,N,K')
  hinh('NDT-H3-13', [A, B, C, D, X], [
    seg(A, B), seg(B, C), seg(D, K), seg(D, A), seg(A, X), seg(B, D),
    [A, B, C, D, K, M, N].map(dot).join(''),
    label(A, 'A', -4, -14), label(B, 'B', 6, -14), label(C, 'C', 4, 28), label(D, 'D', -6, 26),
    label(K, 'K', -6, 34), label(M, 'M', 0, -12), label(N, 'N', 26, 4), label(X, 'x', 22, 6),
  ])
}

// ───────── Bài 14: AM trung tuyến, đường thẳng ∥ BC cắt AB, AM, AC ở D, N, E ─────────
{
  const A = P(110, 0), B = P(0, 190), C = P(300, 190)
  const M = mid(B, C)
  const t = 0.45
  const D = lerp(A, B, t), E = lerp(A, C, t), N = lerp(A, M, t)
  const G = trongTam([A, B, C])
  hinh('NDT-H3-14', [A, B, C], [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(D, E),
    tick(B, M, 1), tick(M, C, 1),
    [A, B, C, M, D, E, N].map(dot).join(''),
    labelOut(A, 'A', G, 22), labelOut(B, 'B', G, 22), labelOut(C, 'C', G, 22),
    label(M, 'M', 0, 30), labelOut(D, 'D', G, 20), labelOut(E, 'E', G, 20), label(N, 'N', 18, -10),
  ])
}

await xuatTat(OUT)
