// Vẽ lại hình — gói BT-MH010-1 (MH.010 Mô hình tam giác vuông, Hình 9 · Luyện).
//   node scripts/anh/ve_lai/BT-MH010-1.mjs [<thu_muc_ra>]
import { P, seg, dot, label, labelOut, rightAngle, angleMark, sector, ray, foot, inter, mid, bisector, goc, dist, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH010-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// BT.09.010.02 — tam giác MNP nhọn, đường cao MK; P = 30° (MK = 3 cm). Không ghi số đo lên hình (ảnh cũ không ghi).
{
  const hMK = 170
  const K = P(0, 0), M = P(0, -hMK), Pp = P(hMK / Math.tan(30 * Math.PI / 180), 0), N = P(-68, 0)
  ok(Math.abs(goc(Pp, M, K) - 30) < 0.5, 'P = 30°')
  ok(goc(N, M, Pp) < 90 && goc(M, N, Pp) < 90 && goc(Pp, M, N) < 90, 'nhọn')
  const G = trongTam([M, N, Pp])
  hinh('BT.09.010.02', [N, M, Pp, K], [seg(N, M), seg(M, Pp), seg(N, Pp), seg(M, K), rightAngle(K, M, Pp),
    dot(M), dot(N), dot(Pp), dot(K),
    labelOut(M, 'M', G, 26), labelOut(N, 'N', G, 26), labelOut(Pp, 'P', G, 26), label(K, 'K', 0, 34)])
}

// Dựng chung cho BT.09.010.06 / .07 — ABC vuông ở A, AB = 6, AC = 8, BC = 10; H trên AC; CK ⊥ BH tại K; CK cắt BA tại D; DH cắt BC tại E.
function chung06() {
  const k = 29
  const A = P(0, 0), B = P(0, -6 * k), C = P(8 * k, 0)
  const H = P(0.416 * 8 * k, 0)
  const K = foot(C, B, H)
  const D = inter(C, K, B, A)
  const E = inter(D, H, B, C)
  ok(Math.abs(dist(B, C) - 10 * k) < 0.01, 'BC = 10')
  ok(Math.abs(goc(K, B, C) - 90) < 0.5, 'CK ⊥ BH')
  ok(Math.abs(goc(E, H, C) - 90) < 0.5, 'DH ⊥ BC (hệ quả)')
  ok(D.y > 0 && E.x > 0 && E.x < C.x, 'D dưới A, E trên BC')
  return { A, B, C, H, K, D, E }
}

// BT.09.010.06 — chứng minh ΔDKH ~ ΔBKC (ảnh cũ gọi K là F; theo đề là K)
{
  const { A, B, C, H, K, D, E } = chung06()
  hinh('BT.09.010.06', [B, C, D, A, H, K, E], [seg(B, D), seg(A, C), seg(B, C), seg(B, K), seg(D, C), seg(D, E),
    rightAngle(A, B, C), rightAngle(E, H, C), rightAngle(K, H, C),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(K),
    label(B, 'B', 0, -16), label(A, 'A', -24, 8), label(C, 'C', 22, 6), label(D, 'D', -24, 8),
    label(E, 'E', 8, -14), label(H, 'H', 0, 38), label(K, 'K', 10, 32)])
}

// BT.09.010.07 — thêm M bất kì trên BC, P, Q là hình chiếu của M trên AB, AC (đủ H, K, E của giả thiết đầy đủ)
{
  const { A, B, C, H, K, D, E } = chung06()
  const M = P(B.x + (C.x - B.x) * 0.28, B.y + (C.y - B.y) * 0.28)
  const Pp = foot(M, A, B), Q = foot(M, A, C)
  ok(Math.abs(dist(Pp, Q) - dist(A, M)) < 0.01, 'APMQ hình chữ nhật (PQ = AM)')
  hinh('BT.09.010.07', [B, C, D, A, H, K, E, M], [seg(B, D), seg(A, C), seg(B, C), seg(B, K), seg(D, C), seg(D, E),
    seg(M, Pp), seg(M, Q), seg(Pp, Q), seg(A, M),
    rightAngle(A, Pp, C), rightAngle(Pp, A, M), rightAngle(Q, C, M), rightAngle(K, H, C),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(K), dot(M), dot(Pp), dot(Q),
    label(B, 'B', 0, -16), label(A, 'A', -24, 8), label(C, 'C', 22, 6), label(D, 'D', -24, 8),
    label(E, 'E', 18, 4), label(H, 'H', 0, 38), label(K, 'K', 10, 32),
    label(M, 'M', 10, -14), label(Pp, 'P', -22, 8), label(Q, 'Q', -6, 30)])
}

// Dựng chung cho BT.09.010.08..10 — MNP vuông tại M, MP = 3 > MN, P = 30° (tỉ lệ thật MN = MP·tan30°)
function chung08() {
  const MP = 330
  const M = P(0, 0), Pp = P(MP, 0), N = P(0, -MP * Math.tan(30 * Math.PI / 180))
  ok(Math.abs(goc(Pp, M, N) - 30) < 0.5, 'P = 30°')
  ok(dist(M, Pp) > dist(M, N), 'MP > MN')
  return { M, N, Pp }
}

// BT.09.010.08
{
  const { M, N, Pp } = chung08()
  const G = trongTam([M, N, Pp])
  hinh('BT.09.010.08', [M, N, Pp], [seg(M, N), seg(M, Pp), seg(N, Pp), rightAngle(M, N, Pp),
    dot(M), dot(N), dot(Pp),
    labelOut(M, 'M', G, 26), labelOut(N, 'N', G, 26), labelOut(Pp, 'P', G, 26)])
}

// BT.09.010.09 — MI ⊥ NP, MG là phân giác của góc PMI (cung ở M đánh dấu góc PMI như ảnh cũ)
{
  const { M, N, Pp } = chung08()
  const I = foot(M, N, Pp)
  const Gp = inter(M, bisector(M, Pp, I), N, Pp)
  ok(Math.abs(goc(M, Pp, Gp) - goc(M, Gp, I)) < 0.5, 'MG phân giác góc PMI')
  ok(Math.abs(dist(N, Gp) - dist(N, M)) < 0.5, 'NG = NM (kiểm hình, không ghi lên)')
  const C = trongTam([M, N, Pp])
  hinh('BT.09.010.09', [M, N, Pp], [sector(M, Pp, I, 52), seg(M, N), seg(M, Pp), seg(N, Pp), seg(M, I), seg(M, Gp),
    angleMark(M, Pp, I, 52), rightAngle(M, N, Pp), rightAngle(I, M, Pp),
    dot(M), dot(N), dot(Pp), dot(I), dot(Gp),
    labelOut(M, 'M', C, 26), labelOut(N, 'N', C, 26), labelOut(Pp, 'P', C, 26),
    label(I, 'I', -6, -16), label(Gp, 'G', 6, -16)])
}

// BT.09.010.10 — thêm H, K là hình chiếu của I trên MN, MP
{
  const { M, N, Pp } = chung08()
  const I = foot(M, N, Pp)
  const Gp = inter(M, bisector(M, Pp, I), N, Pp)
  const H = foot(I, M, N), K = foot(I, M, Pp)
  ok(Math.abs(dist(H, K) - dist(M, I)) < 0.01, 'MHIK hình chữ nhật')
  const C = trongTam([M, N, Pp])
  hinh('BT.09.010.10', [M, N, Pp], [sector(M, Pp, I, 52), seg(M, N), seg(M, Pp), seg(N, Pp), seg(M, I), seg(M, Gp), seg(I, H), seg(I, K),
    angleMark(M, Pp, I, 52), rightAngle(M, N, Pp), rightAngle(I, M, Pp), rightAngle(H, N, I), rightAngle(K, Pp, I),
    dot(M), dot(N), dot(Pp), dot(I), dot(Gp), dot(H), dot(K),
    labelOut(M, 'M', C, 26), labelOut(N, 'N', C, 26), labelOut(Pp, 'P', C, 26),
    label(I, 'I', -6, -16), label(Gp, 'G', 6, -16), label(H, 'H', -22, 8), label(K, 'K', 0, 34)])
}

await xuatTat(RA)
