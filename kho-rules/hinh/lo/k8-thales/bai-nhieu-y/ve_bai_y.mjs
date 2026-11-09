// Hình 2 bài nhiều ý ĐTB (09/11): BY1 = tứ giác + 4 trung điểm cạnh (Varignon) · BY2 = M∈AB, N∈AC, P∈CD, Q∈DB
import { P, seg, segDash, tick, dot, label, mid, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'
const DIR = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/fb8747b7-c80d-4be5-bd47-3c40acf97252/scratchpad/hinh_by'
const diem = (pts) => pts.map(dot).join('')
const nhan = (arr) => arr.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')

// ───── BY1: ABCD, M N P Q trung điểm AB BC CD DA ─────
{
  const A = P(70, 0), B = P(0, 125), C = P(215, 150), D = P(255, 35)
  const M = mid(A, B), N = mid(B, C), Pp = mid(C, D), Q = mid(D, A)
  const co = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M),
    tick(A, M, 1), tick(M, B, 1), tick(B, N, 2), tick(N, C, 2), tick(C, Pp, 3), tick(Pp, D, 3), tick(D, Q, 4), tick(Q, A, 4),
    diem([A, B, C, D, M, N, Pp, Q]),
    nhan([[A, 'A', -4, -14], [B, 'B', -14, 24], [C, 'C', 10, 28], [D, 'D', 16, 8], [M, 'M', -18, 4], [N, 'N', 0, 30], [Pp, 'P', 18, 14], [Q, 'Q', 10, -14]])]
  hinh('BY1', [A, B, C, D], co.join(''))
  // hình lời giải: thêm hai đường chéo AC, BD (nét đứt)
  hinh('BY1_lg', [A, B, C, D], co.join('') + segDash(A, C) + segDash(B, D))
}

// ───── BY2: ABCD, M∈AB, N∈AC, P∈CD, Q∈DB trung điểm ─────
{
  const A = P(20, 20), B = P(0, 140), C = P(250, 190), D = P(230, 0)
  const M = mid(A, B), N = mid(A, C), Pp = mid(C, D), Q = mid(D, B)
  const co = [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M),
    tick(A, M, 1), tick(M, B, 1), tick(A, N, 2), tick(N, C, 2), tick(C, Pp, 3), tick(Pp, D, 3), tick(D, Q, 4), tick(Q, B, 4),
    diem([A, B, C, D, M, N, Pp, Q]),
    nhan([[A, 'A', -4, -14], [B, 'B', -14, 22], [C, 'C', 12, 24], [D, 'D', 14, -4], [M, 'M', -18, 4], [N, 'N', -4, 28], [Pp, 'P', 18, 10], [Q, 'Q', -4, -14]])]
  hinh('BY2', [A, B, C, D], co.join(''))
}
await xuatTat(DIR)
