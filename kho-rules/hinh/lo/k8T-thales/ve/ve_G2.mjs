// ve_G2.mjs — hình cho NDT H1.24–27 (đường trung bình). Chạy: node ve_G2.mjs (từ thư mục h8t) → hinh_G2/
import { fileURLToPath } from 'node:url'
import { P, seg, tick, rightAngle, dot, label, mid, lerp, inter, hinh, xuatTat, trongTam } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = fileURLToPath(new URL('./hinh_G2', import.meta.url))
const dots = (a) => a.map(dot).join('')
const L = (arr) => arr.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')
const rot90 = (v) => ({ x: -v.y, y: v.x })

// ───────── Bài 24: BD = CD, BE = 2AE, M = AD ∩ CE ─────────
{
  const S = 45, p = (x, y) => P(x * S, -y * S)
  const B = p(0, 0), C = p(8, 0), A = p(2, 5), D = mid(B, C), E = lerp(A, B, 1 / 3), M = inter(A, D, C, E)
  const nhan = [[A, 'A', 0, -14], [B, 'B', -12, 26], [C, 'C', 14, 26], [D, 'D', 0, 32], [E, 'E', -16, 4], [M, 'M', 16, -8]]
  const nen = [seg(A, B), seg(B, C), seg(C, A), seg(A, D), seg(C, E), tick(B, D, 1), tick(D, C, 1)]
  hinh('NDT-H1-24', [A, B, C, D, E, M], [...nen, dots([A, B, C, D, E, M]), L(nhan)])
  const N = mid(B, E)
  hinh('NDT-H1-24_lg', [A, B, C, D, E, M, N], [...nen, seg(D, N), tick(A, E, 3), tick(E, N, 3), tick(N, B, 3), dots([A, B, C, D, E, M, N]), L([...nhan, [N, 'N', -16, 14]])])
}

// ───────── Bài 25: hình thang vuông ABCD (Â = D̂ = 90°), M trung điểm BC ─────────
{
  const S = 42, p = (x, y) => P(x * S, -y * S)
  const D = p(0, 0), C = p(8, 0), A = p(0, 5), B = p(4.2, 5), M = mid(B, C)
  const nhan = [[A, 'A', -12, -12], [B, 'B', 8, -14], [C, 'C', 14, 24], [D, 'D', -12, 24], [M, 'M', 20, -6]]
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, A), seg(M, D), rightAngle(A, B, D), rightAngle(D, A, C), tick(B, M, 1), tick(M, C, 1)]
  hinh('NDT-H1-25', [A, B, C, D, M], [...nen, dots([A, B, C, D, M]), L(nhan)])
  const N = mid(A, D)
  hinh('NDT-H1-25_lg', [A, B, C, D, M, N], [...nen, seg(M, N), tick(A, N, 2), tick(N, D, 2), rightAngle(N, M, D), dots([A, B, C, D, M, N]), L([...nhan, [N, 'N', -16, 6]])])
}

// ───────── Bài 26: AD = BC, M, N trung điểm AB, CD; MN cắt AD, BC tại E, F ─────────
{
  const S = 27, p = (x, y) => P(x * S, -y * S)
  const D = p(0, 0), C = p(10, 0), A = p(2.5, 4)
  const Ln = Math.hypot(2.5, 4), th = 108 * Math.PI / 180
  const B = p(10 + Ln * Math.cos(th), Ln * Math.sin(th))
  const M = mid(A, B), N = mid(C, D), E = inter(M, N, A, D), F = inter(M, N, B, C)
  const nhan = [[A, 'A', -16, 0], [B, 'B', 16, -2], [C, 'C', 14, 24], [D, 'D', -12, 24], [M, 'M', -16, -12], [N, 'N', 0, 32], [E, 'E', -16, -6], [F, 'F', 16, -6]]
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, E), seg(C, F), seg(N, F), tick(A, D, 1), tick(B, C, 1), tick(A, M, 2), tick(M, B, 2), tick(C, N, 3), tick(N, D, 3)]
  hinh('NDT-H1-26', [A, B, C, D, E, F, M, N], [...nen, dots([A, B, C, D, E, F, M, N]), L(nhan)], { pad: 36, padDuoi: 46 })
  const I = mid(B, D)
  hinh('NDT-H1-26_lg', [A, B, C, D, E, F, M, N, I], [...nen, seg(B, D), seg(M, I), seg(N, I), tick(B, I, 4), tick(I, D, 4), dots([A, B, C, D, E, F, M, N, I]), L([...nhan, [I, 'I', 14, 22]])], { pad: 36, padDuoi: 46 })
}

// ───────── Bài 27a: tứ giác ABCD, E, F trung điểm AD, BC ─────────
{
  const S = 40, p = (x, y) => P(x * S, -y * S)
  const A = p(1, 4.5), B = p(7, 6), C = p(8, 0), D = p(0, 0), E = mid(A, D), F = mid(B, C)
  const nhan = [[A, 'A', -12, -10], [B, 'B', 8, -14], [C, 'C', 14, 22], [D, 'D', -12, 22], [E, 'E', -16, 4], [F, 'F', 16, 4]]
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(E, F), tick(A, E, 1), tick(E, D, 1), tick(B, F, 2), tick(F, C, 2)]
  hinh('NDT-H1-27a', [A, B, C, D, E, F], [...nen, dots([A, B, C, D, E, F]), L(nhan)])
  const M = mid(A, C)
  hinh('NDT-H1-27a_lg', [A, B, C, D, E, F, M], [...nen, seg(A, C), seg(M, E), seg(M, F), tick(A, M, 3, 0.35), tick(M, C, 3, 0.65), dots([A, B, C, D, E, F, M]), L([...nhan, [M, 'M', 4, 26]])])
}

// ───────── Bài 27b: hình thang AB ∥ CD, AB < CD; M, N, P trung điểm AB, BD, AC; E ─────────
{
  const S = 45, p = (x, y) => P(x * S, -y * S)
  const A = p(2, 4), B = p(6, 4), D = p(0, 0), C = p(9, 0)
  const M = mid(A, B), N = mid(B, D), P_ = mid(A, C)
  const dN = rot90({ x: N.x - M.x, y: N.y - M.y }), dP = rot90({ x: P_.x - M.x, y: P_.y - M.y })
  const E = inter(N, { x: N.x + dN.x, y: N.y + dN.y }, P_, { x: P_.x + dP.x, y: P_.y + dP.y })
  const nhan = [[A, 'A', -4, -14], [B, 'B', 6, -14], [C, 'C', 14, 22], [D, 'D', -12, 22], [M, 'M', 0, -14], [N, 'N', -18, -8], [P_, 'P', 18, -8], [E, 'E', 0, 28]]
  const nen = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, N), seg(M, P_), seg(N, E), seg(P_, E),
    rightAngle(N, M, E), rightAngle(P_, M, E), tick(A, M, 1), tick(M, B, 1), tick(B, N, 2, 0.3), tick(N, D, 2, 0.5), tick(A, P_, 3, 0.4), tick(P_, C, 3, 0.5)]
  hinh('NDT-H1-27b', [A, B, C, D, M, N, P_, E], [...nen, dots([A, B, C, D, M, N, P_, E]), L(nhan)])
  const Q = mid(C, D), I = mid(A, D)
  hinh('NDT-H1-27b_lg', [A, B, C, D, M, N, P_, E, Q, I], [...nen, seg(I, P_), seg(N, Q), seg(P_, Q), seg(Q, E), tick(D, Q, 4), tick(Q, C, 4), dots([A, B, C, D, M, N, P_, E, Q, I]), L([...nhan.filter((x) => x[1] !== 'E'), [E, 'E', 18, 12], [Q, 'Q', 0, 28], [I, 'I', -16, 4]])])
}

await xuatTat(OUT)
