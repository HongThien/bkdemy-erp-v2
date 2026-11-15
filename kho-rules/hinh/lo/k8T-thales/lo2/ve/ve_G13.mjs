// ve_G13.mjs — hình đề + hình lời giải TCHH-3.II.21 và TCHH-3.II.27. Chạy: node ve_G13.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, rightAngle, dot, label, labelOut, mid, lerp, foot, inter, goc, dist, trongTam, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G13'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const NP = { pad: 40, padDuoi: 50 }
const lab = (p, t, from, d = 22) => labelOut(p, t, from, d)

// ───── 21: MNP cân tại P; H trung điểm MN; K hình chiếu của H trên PM; qua P vuông góc NK cắt HK tại I ─────
function cau21(voiLg) {
  const s = 1.3, N = P(40 * s, 230 * s), M = P(340 * s, 230 * s), H = mid(N, M), Pp = P(H.x, 50 * s)
  const K = foot(H, Pp, M)
  const Q = foot(Pp, N, K)                    // chân đường vuông góc hạ từ P xuống NK
  const I = inter(Pp, Q, H, K)
  near(dist(Pp, N), dist(Pp, M), 0.01); near(goc(K, H, Pp), 90); near(goc(Q, Pp, N), 90)
  const E = mid(K, M)
  const pts = [N, M, Pp, H, K, I]
  const g = trongTam([N, M, Pp])
  const body = [
    seg(N, M), seg(M, Pp), seg(Pp, N), seg(H, K), seg(N, K), seg(Pp, I),
    tick(N, H, 1, 0.5), tick(H, M, 1, 0.8),
    rightAngle(K, H, Pp), rightAngle(Q, Pp, N),
    voiLg ? [segDash(H, E), segDash(Pp, H), segDash(E, I)].join('') : '',
    dots(N, M, Pp, H, K, I), voiLg ? dot(E) : '',
    label(N, 'N', -18, 8), label(M, 'M', 20, 8), lab(Pp, 'P', g, 22), label(H, 'H', 4, 32),
    label(K, 'K', 22, -4), (voiLg ? label(I, 'I', -20, 14) : label(I, 'I', 22, 16)),
    voiLg ? label(E, 'E', 20, -8) : '',
  ]
  hinh(voiLg ? 'TCHH-3-II-21_lg' : 'TCHH-3-II-21', voiLg ? pts.concat([E]) : pts, body, NP)
}
cau21(false)
cau21(true)

// ───── 27: D, E trung điểm AB, BC; C trung điểm ME, B trung điểm ND; K = AC ∩ DM ─────
function cau27(voiLg) {
  const s = 1.2
  const A = P(130 * s, 40 * s), B = P(40 * s, 200 * s), C = P(240 * s, 200 * s)
  const D = mid(A, B), E = mid(B, C)
  const M = P(2 * C.x - E.x, 2 * C.y - E.y), N = P(2 * B.x - D.x, 2 * B.y - D.y)
  const K = inter(A, C, D, M)
  near(dist(C, E), dist(C, M), 0.01); near(dist(B, N), dist(B, D), 0.01)
  const pts = [A, B, C, D, E, M, N, K]
  const g = trongTam([A, B, C])
  const body = [
    seg(A, B), seg(B, C), seg(C, A), seg(C, M), seg(B, N), seg(D, M),
    tick(A, D, 1, 0.5), tick(D, B, 1, 0.5), tick(B, N, 1, 0.5),
    tick(B, E, 2, 0.5), tick(E, C, 2, 0.5), tick(C, M, 2, 0.5),
    voiLg ? [seg(D, E), segDash(N, K)].join('') : '',
    dots(A, B, C, D, E, M, N, K),
    lab(A, 'A', g, 20), label(B, 'B', -18, -6), label(C, 'C', 6, 28), lab(D, 'D', g, 22), label(E, 'E', 2, 28),
    label(M, 'M', 20, 8), label(N, 'N', -18, 8), label(K, 'K', 4, -14),
  ]
  hinh(voiLg ? 'TCHH-3-II-27_lg' : 'TCHH-3-II-27', pts, body, NP)
}
cau27(false)
cau27(true)

await xuatTat(OUT)
