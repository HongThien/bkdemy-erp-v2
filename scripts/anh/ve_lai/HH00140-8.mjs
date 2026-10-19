// Vẽ lại hình — gói HH00140-8 (Ôn thi giữa kì I, Hình học 9; hình đề + hình lời giải _lg).
//   node scripts/anh/ve_lai/HH00140-8.mjs [<thu_muc_ra>]
import { P, seg, segDash, tick, angleMark, rightAngle, ray, rot, mid, foot, inter, bisector, goc, dist, ngoaiTiep, circle,
  dot, label, num, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-8/moi'
const ok = (v, e, tol, ten) => console.assert(Math.abs(v - e) < tol, `${ten}: ${v} ≠ ${e}`)

// HHC003147_lg — ABC vuông tại A, B = 60°; AH ⊥ BC; M trung điểm AC; AD ⊥ BM; N = hình chiếu M trên BC; E = AD ∩ (đường qua C ⊥ AC)
{
  const B = P(0, 0), C = P(270, 0), A = ray(B, 60, 135)
  const H = foot(A, B, C), M = mid(A, C), D = foot(A, B, M), N = foot(M, B, C)
  const E = inter(A, D, C, rot(A, C, 90))
  ok(goc(B, A, C), 60, 0.5, 'B')
  ok(goc(D, A, B), 90, 0.5, 'D'); ok(goc(C, A, E), 90, 0.5, 'C'); ok(goc(N, M, B), 90, 0.5, 'N')
  hinh('HHC003147_lg', [A, B, C, E], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(B, M), seg(A, E), seg(C, E), seg(M, N),
    tick(A, M, 1), tick(M, C, 1),
    rightAngle(A, B, C), rightAngle(H, A, C), rightAngle(D, A, B), rightAngle(N, M, B), rightAngle(C, A, E),
    dot(A), dot(B), dot(C), dot(H), dot(M), dot(D), dot(N), dot(E),
    label(A, 'A', -20, -8), label(B, 'B', -20, 16), label(C, 'C', 22, 14), label(H, 'H', -4, 30), label(N, 'N', 6, 30),
    label(M, 'M', 20, -8), label(D, 'D', 8, -16), label(E, 'E', 0, 32)])
}

// HHC003148 — máy bay cất cánh: A (máy bay), BH ⊥ AH, góc A = 20°
{
  const A = P(0, 0), H = P(330, 0), B = ray(A, 20, 330 / Math.cos(20 * Math.PI / 180))
  ok(goc(A, H, B), 20, 0.5, 'A'); ok(goc(H, A, B), 90, 0.5, 'H')
  hinh('HHC003148', [A, B, H, P(-80, -40)], [
    seg(A, H), seg(H, B), seg(A, B), rightAngle(H, A, B),
    angleMark(A, H, B, 80), angleText(A, H, B, '20°', 160),
    dot(A), dot(B), dot(H),
    label(A, 'A', -4, 34), label(B, 'B', 4, -14), label(H, 'H', 6, 34), num(A, 'Máy bay', -20, -26)])
}

// HHC003149_lg — ABC vuông tại A, AB = 9, B = 60° (AC = 9√3, BC = 18); AH ⊥ BC; E, F hình chiếu của H trên AB, AC; AI ⊥ EF, AI cắt BC tại K
{
  const B = P(0, 0), C = P(400, 0), A = ray(B, 60, 200)
  const H = foot(A, B, C), E = foot(H, A, B), F = foot(H, A, C), I = foot(A, E, F), K = inter(A, I, B, C)
  ok(goc(A, B, C), 90, 0.5, 'A'); ok(dist(K, B), dist(K, C), 0.5, 'K trung điểm')
  hinh('HHC003149_lg', [A, B, C], [
    seg(A, B), seg(B, C), seg(A, C), seg(A, H), seg(E, F), seg(H, E), seg(H, F), seg(A, K),
    rightAngle(A, B, C), rightAngle(H, A, C), rightAngle(E, A, H), rightAngle(F, A, H), rightAngle(I, A, F),
    dot(A), dot(B), dot(C), dot(H), dot(K), dot(E), dot(F), dot(I),
    label(A, 'A', -4, -18), label(B, 'B', -18, 14), label(C, 'C', 22, 14), label(H, 'H', -4, 32), label(K, 'K', 6, 32),
    label(E, 'E', -22, 4), label(F, 'F', 20, -8), label(I, 'I', -6, 32)])
}

// HHC003150 — căn bếp chữ U PMNQ; A trên MN với MA = 4 m, AN = 1 m; B trên MP, C trên NQ sao cho ABC vuông tại A
//  (vị trí B, C vẽ KHÔNG phải vị trí tối ưu — đó là đáp án; chỉ thoả MB·NC = MA·NA)
{
  const u = 66
  const M = P(0, 0), N = P(5 * u, 0), A = P(4 * u, 0)
  const b = 2.5 * u   // MB = 2,5 m → NC = 4 / 2,5 = 1,6 m (MB·NC = MA·NA = 4 m²)
  const B = P(0, -b), C = P(5 * u, -(4 / 2.5) * u)
  const Pp = P(0, -4.2 * u), Q = P(5 * u, -4.2 * u)
  ok(goc(A, B, C), 90, 0.5, 'A vuông')
  hinh('HHC003150', [Pp, Q, M, N], [
    seg(Pp, M), seg(M, N), seg(N, Q), seg(A, B), seg(A, C), seg(B, C),
    rightAngle(M, B, N), rightAngle(N, C, M), rightAngle(A, B, C),
    dot(Pp), dot(Q), dot(B), dot(C), dot(M), dot(N), dot(A),
    label(Pp, 'P', 0, -14), label(Q, 'Q', 0, -14), label(B, 'B', -20, 6), label(C, 'C', 20, 6),
    label(M, 'M', -18, 22), label(N, 'N', 18, 22), label(A, 'A', 0, 32)])
}

// HHC003151 — robot lặn: C trên mặt nước, A cùng mực nước, AB = 150 m (thẳng đứng), góc ACB = 40°
{
  const C = P(0, 0), A = P(300, 0), B = P(300, 300 * Math.tan(40 * Math.PI / 180))
  ok(goc(C, A, B), 40, 0.5, 'C'); ok(goc(A, C, B), 90, 0.5, 'A')
  hinh('HHC003151', [C, A, B, P(-50, 0), P(A.x + 55, 0)], [
    seg(C, A), segDash(A, B), seg(C, B), rightAngle(A, C, B),
    angleMark(C, A, B, 70), angleText(C, A, B, '40°', 130),
    dot(C), dot(A), dot(B),
    label(C, 'C', 4, -14), label(A, 'A', 14, -14), label(B, 'B', 24, 8),
    num(mid(A, B), '150 m', 46, 8), num(C, 'Tàu mẹ', -50, 8), num(B, 'Robot', 0, 36)])
}

// HHC003152_lg — ABC vuông tại A, tan C = 3/4, AB = 6 (AC = 8, BC = 10); AH ⊥ BC; BD ⊥ BC (D ∈ AC); AK ∥ BC (K ∈ DB); M trung điểm DC; I = BM ∩ KH
{
  const k = 36
  const B = P(0, 0), C = P(10 * k, 0)
  const A = ray(B, Math.acos(0.6) * 180 / Math.PI, 6 * k)
  const H = foot(A, B, C), D = inter(C, A, B, P(0, -100)), K = foot(A, B, D), M = mid(D, C), I = inter(B, M, K, H)
  ok(goc(A, B, C), 90, 0.5, 'A'); ok(dist(A, C) / dist(A, B), 8 / 6, 0.01, 'AC/AB'); ok(goc(B, D, C), 90, 0.5, 'B')
  ok(goc(I, B, K) + goc(K, I, B) + goc(B, K, I), 180, 0.5, 'tam giác')
  hinh('HHC003152_lg', [D, B, C], [
    seg(D, B), seg(B, C), seg(D, C), seg(K, A), seg(A, H), seg(A, B), seg(B, M), seg(K, H),
    rightAngle(B, D, C), rightAngle(A, B, C), rightAngle(H, A, B),
    dot(D), dot(K), dot(B), dot(A), dot(M), dot(I), dot(H), dot(C),
    label(D, 'D', -22, 4), label(K, 'K', -22, 8), label(B, 'B', -18, 16), label(A, 'A', 6, -16), label(M, 'M', 22, -8),
    label(I, 'I', 20, 10), label(H, 'H', 4, 32), label(C, 'C', 22, 14)])
}

// HHC003153 — bến A, khách sạn B bên kia sông (AB ⊥ bờ, AB = 520 m), tàu lệch 30° đến bến C trên bờ
{
  const A = P(0, 0), B = P(0, -280), C = P(280 * Math.tan(30 * Math.PI / 180), -280)
  ok(goc(B, A, C), 90, 0.5, 'B'); ok(goc(A, B, C), 30, 0.5, 'A')
  hinh('HHC003153', [A, B, C, P(-80, 0)], [
    seg(A, B), seg(B, C), seg(A, C), rightAngle(B, A, C),
    angleMark(A, B, C, 70), angleText(A, B, C, '30°', 130),
    dot(A), dot(B), dot(C),
    label(A, 'A', 0, 34), label(B, 'B', -18, 6), label(C, 'C', 16, 6),
    num(mid(A, B), '520 m', -42, 8), num(B, 'Khách sạn', 0, -22)])
}

// HHC003154_lg — ABC nhọn nội tiếp (O), AB < AC; BD ⊥ AC, CE ⊥ AB cắt nhau tại H; HP phân giác EHB (P ∈ AB), HQ phân giác DHC (Q ∈ AC);
//  PM ∥ EH (M ∈ BH), QN ∥ HD (N ∈ CH); I trung điểm MN; K trung điểm BC
{
  const W = 312
  const B = P(0, 0), C = P(W, 0), A = P(0.314 * W, -0.642 * W)
  const D = foot(B, A, C), E = foot(C, A, B), H = inter(B, D, C, E)
  const Pp = inter(H, bisector(H, E, B), A, B), Q = inter(H, bisector(H, D, C), A, C)
  const M = inter(Pp, P(Pp.x + H.x - E.x, Pp.y + H.y - E.y), B, H)
  const N = inter(Q, P(Q.x + H.x - D.x, Q.y + H.y - D.y), C, H)
  const I = mid(M, N), K = mid(B, C), O = ngoaiTiep(A, B, C), R = dist(O, A)
  ok(dist(A, B) < dist(A, C) ? 1 : 0, 1, 0.1, 'AB<AC'); ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90 ? 1 : 0, 1, 0.1, 'nhọn')
  ok(Math.abs((M.y - N.y)), 0, 0.5, 'MN ∥ BC')
  hinh('HHC003154_lg', [P(O.x - R, O.y - R), P(O.x + R, O.y + R), A], [
    circle(O, R),
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(C, E), seg(Pp, Q), seg(Pp, M), seg(Q, N), seg(M, N),
    rightAngle(E, A, H), rightAngle(D, A, H), angleMark(H, E, B, 30), angleMark(H, D, C, 30),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(H), dot(Pp), dot(Q), dot(M), dot(N), dot(I), dot(K), dot(O),
    label(A, 'A', 0, -14), label(B, 'B', -20, 8), label(C, 'C', 22, 8), label(D, 'D', 16, -10), label(E, 'E', -16, -6),
    label(H, 'H', -6, -14), label(Pp, 'P', -20, 6), label(Q, 'Q', 18, -8), label(M, 'M', 4, 36), label(N, 'N', -12, 34),
    label(I, 'I', 0, 36), label(K, 'K', 0, 30), label(O, 'O', 16, 8)], { pad: 34, padDuoi: 34 })
}

await xuatTat(RA)
