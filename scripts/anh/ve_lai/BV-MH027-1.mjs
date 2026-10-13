// Vẽ lại hình — gói BV-MH027-1 (MH.027 Tứ giác có 2 cạnh bên cắt nhau · biến thể).
//   node scripts/anh/ve_lai/BV-MH027-1.mjs [<thu_muc_ra>]
// Cùng bộ khung với BT-MH027-1: đáy BE nằm ngang (E bên phải), đỉnh F ở trên.
import { P, seg, angleMark, sector, lerp, inter, bisector, goc, dist, rot, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH027-1/moi'
const k = 0.62
const S = (x, y) => P(x * k, y * k)

// ───── 2bae0aec: ABCD có A + C = 180° (nội tiếp) · E = AD∩BC · F = DC∩AB · phân giác góc CED, BFC cắt nhau ở I · IE ⊥ IF ─────
{
  // Dựng ABCD NỘI TIẾP đường tròn (⇒ A + C = 180° đúng), E = BC∩AD, F = AB∩DC; rồi xoay cho BE nằm ngang, E bên phải, F phía trên.
  const tren = (th) => P(Math.cos(th * Math.PI / 180), -Math.sin(th * Math.PI / 180))
  const B0 = tren(175), C0 = tren(300), D0 = tren(365), A0 = tren(60)
  const E0 = inter(B0, C0, A0, D0), F0 = inter(A0, B0, D0, C0)
  const ang = Math.atan2(-(E0.y - B0.y), E0.x - B0.x) * 180 / Math.PI
  const he = 348 / dist(B0, E0), goc0 = S(83, 452)
  const dat = (p) => { const q = rot(p, B0, -ang); return P(goc0.x + (q.x - B0.x) * he, goc0.y + (q.y - B0.y) * he) }
  const A = dat(A0), B = dat(B0), C = dat(C0), D = dat(D0), E = dat(E0), F = dat(F0)
  const I = inter(F, bisector(F, B, C, 100), E, bisector(E, B, A, 100))
  const K = inter(F, I, B, C)
  console.assert(Math.abs(goc(A, B, D) + goc(C, B, D) - 180) < 0.3, 'A + C = 180°')
  console.assert(Math.abs(goc(I, E, F) - 90) < 0.3, 'IE ⊥ IF')
  console.assert(Math.abs(goc(F, B, I) - goc(F, I, C)) < 0.3 && Math.abs(goc(E, B, I) - goc(E, I, A)) < 0.3, 'phân giác')
  console.assert(D.y > F.y && D.y < C.y && A.y > F.y && A.y < B.y, 'bố cục')
  const chung = [
    sector(F, A, D, 38), sector(E, D, C, 50),
    seg(F, B), seg(B, E), seg(F, C), seg(A, E), seg(F, I), seg(I, E),
    angleMark(F, A, D, 38, 1), angleMark(E, D, C, 44, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I),
    label(F, 'F', 16, -10), label(A, 'A', -16, -6), label(B, 'B', -4, 32), label(C, 'C', 4, 32),
    label(D, 'D', 16, -8), label(E, 'E', 16, -8),
  ]
  hinh('2bae0aec-2eb2-45c3-a60d-bf3de9ad3d9e', [A, B, C, D, E, F, I], [...chung, label(I, 'I', 14, -8)])
  // hình lời giải: thêm K = FI ∩ BC (FI kéo dài tới BC)
  hinh('2bae0aec-2eb2-45c3-a60d-bf3de9ad3d9e_lg', [A, B, C, D, E, F, I, K], [...chung, seg(I, K), dot(K),
    label(I, 'I', -16, -4), label(K, 'K', 0, 32)])
}

// ───── 1c4e09df: MNPQ · R = MQ∩NP · S = MN∩QP · T = giao phân giác góc NSP và NRM · RTS = (N + Q)/2 ─────
// Dựng theo đúng khung lời giải: S là đỉnh trên (MN, QP cắt nhau ở S), R ở đáy NP kéo dài; L = ST ∩ NP, T nằm giữa S và L.
{
  const N = S(83, 452), Pp = S(425, 452), R = S(645, 452), Sp = S(272, 73)
  const M = lerp(Sp, N, 0.396)
  const Q = inter(M, R, Sp, Pp)
  const T = inter(Sp, bisector(Sp, N, Pp, 100), R, bisector(R, N, M, 100))
  const L = inter(Sp, T, N, Pp)
  console.assert(Math.abs(goc(Sp, N, T) - goc(Sp, T, Pp)) < 0.3, 'ST phân giác góc NSP')
  console.assert(Math.abs(goc(R, N, T) - goc(R, T, M)) < 0.3, 'RT phân giác góc NRM')
  // hệ thức đề cần chứng minh: góc RTS = (N + Q)/2 (chỉ kiểm, không ghi lên hình)
  const gN = goc(N, M, Pp), gQ = goc(Q, M, Pp)
  console.assert(Math.abs(goc(T, R, Sp) - (gN + gQ) / 2) < 0.3, 'RTS = (N+Q)/2')
  console.assert(L.x > N.x && L.x < Pp.x && T.y < L.y, 'L giữa N, P; T giữa S, L')
  const chung = [
    seg(Sp, N), seg(N, R), seg(Sp, Pp), seg(M, R), seg(Sp, T), seg(T, R),
    dot(M), dot(N), dot(Pp), dot(Q), dot(R), dot(Sp), dot(T),
    label(Sp, 'S', 16, -10), label(M, 'M', -16, -6), label(N, 'N', -4, 32), label(Pp, 'P', 4, 32),
    label(Q, 'Q', 16, -8), label(R, 'R', 16, -8),
  ]
  hinh('1c4e09df-8705-48d0-b3e4-4576e3043901', [M, N, Pp, Q, R, Sp, T], [...chung, label(T, 'T', 14, -8)])
  hinh('1c4e09df-8705-48d0-b3e4-4576e3043901_lg', [M, N, Pp, Q, R, Sp, T, L], [...chung, seg(T, L), dot(L),
    label(T, 'T', -16, -4), label(L, 'L', 0, 32)])
}

await xuatTat(RA)
