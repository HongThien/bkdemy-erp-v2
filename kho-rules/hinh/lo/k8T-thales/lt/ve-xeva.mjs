// ve-xeva.mjs — hình cho LÝ THUYẾT + VÍ DỤ bài HH00131 "Định lí Mê-nê-la-uýt, định lí Xê-va" khối 8T (Thùy 22/11).
//   node kho-rules/hinh/lo/k8T-thales/lt/ve-xeva.mjs        → kho-rules/hinh/lo/k8T-thales/lt/ra/<ten>.png + .svg
// Quy ước tên: cát tuyến d cắt các đường thẳng BC, CA, AB lần lượt tại M, N, P · ba đường xuyên AD, BE, CF (D∈BC, E∈CA, F∈AB) đồng quy tại O.
// menelaus: d cắt AB, AC trong cạnh, BC ngoài đoạn · menelaus_ba_ngoai: d cắt cả ba đường thẳng ngoài đoạn · menelaus_cm: kẻ CK ∥ AB (nét đứt), K ∈ d · menelaus_dao: MN cắt AB tại P' ·
// xeva: AD, BE, CF đồng quy tại O · xeva_dao: AD ∩ BE = O, CO cắt AB tại F' · ví dụ: menelaus_vd (tỉ số thật) · xeva_vd (tỉ số thật) · menelaus_vd_tuyen · xeva_trung_tuyen · xeva_phan_giac · menelaus_phan_giac_ngoai.
// Hình chỉ vẽ DỮ KIỆN (không đánh dấu điều phải chứng minh). Toạ độ DỰNG theo tỉ số (không ước mắt).
import { P, seg, segDash, dot, label, labelOut, lerp, mid, inter, tick, angleMark, hinh, xuatTat, dist } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const RA = join(dirname(fileURLToPath(import.meta.url)), 'ra')
const sub = (a, b) => P(a.x - b.x, a.y - b.y), add = (a, b) => P(a.x + b.x, a.y + b.y)
const S = (p, k) => P(p.x * k, p.y * k)
const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds) => ds.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')
const A = P(170, 30), B = P(40, 230), C = P(340, 230)
const tamGiac = [seg(A, B), seg(B, C), seg(C, A)]
const dinh = [[A, 'A', 0, -14], [B, 'B', -16, 28], [C, 'C', 16, 28]]

// 1) Mê-nê-la-uýt: P ∈ AB, N ∈ AC trong cạnh; M = d ∩ BC ngoài đoạn (về phía C)
const P1 = lerp(A, B, 0.3), N1 = lerp(A, C, 0.65), M1 = inter(P1, N1, B, C)
hinh('menelaus', [A, B, C, M1, P1], [...tamGiac, seg(C, M1), seg(P1, M1), diem([[A], [B], [C], [M1], [N1], [P1]]),
  nhan([...dinh, [M1, 'M', 6, 28], [N1, 'N', 22, 0], [P1, 'P', -20, 2]])])

// 2) cả ba giao điểm ngoài đoạn: tìm đường thẳng gần tam giác (tất cả giao điểm trong khung); tam giác thu nhỏ 0,4 (giao điểm ngoài đoạn nằm xa tam giác)
{
  const k = 0.4, A2 = S(A, k), B2 = S(B, k), C2 = S(C, k), tg2 = [seg(A2, B2), seg(B2, C2), seg(C2, A2)]
  const dinh2 = [[A2, 'A', 0, -14], [B2, 'B', -16, 28], [C2, 'C', 16, 28]]
  let tot = null
  for (let th = 0; th < 180; th += 3) for (let off = -200; off <= 400; off += 5) {
    const c = Math.cos(th * Math.PI / 180), s = Math.sin(th * Math.PI / 180), O0 = P((190 + off * -s) * k, (150 + off * c) * k), Q = P(O0.x + c, O0.y + s)
    const M = inter(O0, Q, B2, C2), N = inter(O0, Q, C2, A2), Pp = inter(O0, Q, A2, B2)
    if (!M || !N || !Pp) continue
    const ngoai = (X, U, V) => dist(U, X) + dist(X, V) > dist(U, V) + 1
    if (!(ngoai(M, B2, C2) && ngoai(N, C2, A2) && ngoai(Pp, A2, B2))) continue
    const ps = [M, N, Pp], xs = ps.map((p) => p.x), ys = ps.map((p) => p.y)
    if (Math.min(...xs) < -260 || Math.max(...xs) > 400 || Math.min(...ys) < -90 || Math.max(...ys) > 150) continue
    const tatca = [A2, B2, C2, M, N, Pp]; let xa = 1e9
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) xa = Math.min(xa, dist(tatca[i], tatca[j]))     // khoảng cách nhỏ nhất giữa hai điểm bất kì (tránh nhãn đè nhau)
    if (tot === null || xa > tot.xa) tot = { xa, M, N, Pp }
  }
  const { M, N, Pp } = tot
  const keo = (X, U, V) => (dist(X, U) < dist(X, V) ? seg(U, X) : seg(V, X))         // nối từ đỉnh gần nhất tới giao điểm
  const duong = [M, N, Pp].sort((a, b) => a.x - b.x || a.y - b.y)
  hinh('menelaus_ba_ngoai', [A2, B2, C2, M, N, Pp], [...tg2, keo(M, B2, C2), keo(N, C2, A2), keo(Pp, A2, B2), seg(duong[0], duong[2]), diem([[A2], [B2], [C2], [M], [N], [Pp]]),
    nhan([...dinh2, [M, 'M', 0, 30], [N, 'N', 0, -14], [Pp, 'P', -20, 6]])])
}

// 3) chứng minh: qua C kẻ CK ∥ AB (nét đứt), K ∈ d
{
  const K = inter(P1, N1, C, add(C, sub(B, A)))
  hinh('menelaus_cm', [A, B, C, M1, P1, K], [...tamGiac, seg(C, M1), seg(P1, M1), seg(P1, K), segDash(C, K), diem([[A], [B], [C], [M1], [N1], [P1], [K]]),
    nhan([...dinh, [M1, 'M', 6, 28], [N1, 'N', 22, 0], [P1, 'P', -20, 2], [K, 'K', 18, -8]])])
}

// 4) đảo: MN cắt AB tại P'
{
  const Pd = inter(M1, N1, A, B)
  hinh('menelaus_dao', [A, B, C, M1, Pd], [...tamGiac, seg(C, M1), seg(Pd, M1), diem([[A], [B], [C], [M1], [N1], [Pd]]),
    nhan([...dinh, [M1, 'M', 6, 28], [N1, 'N', 22, 0], [Pd, "P'", -24, 2]])])
}

// 5) Xê-va: ba đường xuyên đồng quy tại O
const O = P(185, 150), D = inter(A, O, B, C), E = inter(B, O, C, A), F = inter(C, O, A, B)
hinh('xeva', [A, B, C], [...tamGiac, seg(A, D), seg(B, E), seg(C, F), diem([[A], [B], [C], [D], [E], [F], [O]]),
  nhan([...dinh, [D, 'D', 0, 32], [E, 'E', 22, 0], [F, 'F', -20, 2], [O, 'O', 18, 22]])])

// 6) Xê-va đảo: AD ∩ BE = O, CO cắt AB tại F'
{
  const D2 = lerp(B, C, 0.4), E2 = lerp(C, A, 0.45), O2 = inter(A, D2, B, E2), Fp = inter(C, O2, A, B)
  hinh('xeva_dao', [A, B, C], [...tamGiac, seg(A, D2), seg(B, E2), seg(C, Fp), diem([[A], [B], [C], [D2], [E2], [Fp], [O2]]),
    nhan([...dinh, [D2, 'D', 0, 32], [E2, 'E', 22, 0], [Fp, "F'", -24, 2], [O2, 'O', 18, 22]])])
}

// 7) ví dụ 1: AB = 10, AC = 8, BC = 7 chỉ dùng tỉ số: PA:PB = 2:3, NA:NC = 1:3; MB = BC (M ở tia đối của tia BC); tam giác thu nhỏ 0,6 cho vừa khung
{
  const k = 0.6, A7 = S(A, k), B7 = S(B, k), C7 = S(C, k), Pv = lerp(A7, B7, 0.4), Nv = lerp(A7, C7, 0.25), Mv = inter(Pv, Nv, B7, C7)
  hinh('menelaus_vd', [A7, B7, C7, Mv], [seg(A7, B7), seg(B7, C7), seg(C7, A7), seg(Mv, B7), seg(Mv, Nv), diem([[A7], [B7], [C7], [Mv], [Nv], [Pv]]),
    nhan([[A7, 'A', 0, -14], [B7, 'B', -2, 30], [C7, 'C', 16, 28], [Mv, 'M', 0, 30], [Nv, 'N', 22, 0], [Pv, 'P', -20, 2]])])
}
// 8) ví dụ 2: AF = 4, FB = 10, BD = 6, DC = 8, EC = 10, EA = 3 (tích tỉ số = 1 ⇒ AD, BE, CF đồng quy)
{
  const Fv = lerp(A, B, 4 / 14), Dv = lerp(B, C, 6 / 14), Ev = lerp(C, A, 10 / 13), Ov = inter(A, Dv, B, Ev)
  hinh('xeva_vd', [A, B, C], [...tamGiac, seg(A, Dv), seg(B, Ev), seg(C, Fv), diem([[A], [B], [C], [Dv], [Ev], [Fv], [Ov]]),
    nhan([...dinh, [Dv, 'D', 0, 32], [Ev, 'E', 22, 0], [Fv, 'F', -20, 2], [Ov, 'O', 18, 22]])])
}
// 9) ví dụ 3: D ∈ BC với DB = 2DC, E trung điểm AD, F = BE ∩ AC
{
  const Dm = lerp(B, C, 2 / 3), Em = mid(A, Dm), Fm = inter(B, Em, A, C)
  hinh('menelaus_vd_tuyen', [A, B, C], [...tamGiac, seg(A, Dm), seg(B, Fm), tick(A, Em, 1), tick(Em, Dm, 1), diem([[A], [B], [C], [Dm], [Em], [Fm]]),
    nhan([...dinh, [Dm, 'D', 0, 32], [Em, 'E', -20, 4], [Fm, 'F', 22, 0]])])
}
// 10) ví dụ 4: ba trung tuyến (gạch trung điểm)
{
  const Dt = mid(B, C), Et = mid(C, A), Ft = mid(A, B)
  hinh('xeva_trung_tuyen', [A, B, C], [...tamGiac, seg(A, Dt), seg(B, Et), seg(C, Ft), tick(B, Dt, 1), tick(Dt, C, 1), tick(C, Et, 2), tick(Et, A, 2), tick(A, Ft, 3), tick(Ft, B, 3),
    diem([[A], [B], [C], [Dt], [Et], [Ft]]), nhan([...dinh, [Dt, 'D', 0, 32], [Et, 'E', 22, 0], [Ft, 'F', -20, 2]])])
}
// 11) ví dụ 5 và 6: tam giác lệch có ba cạnh a = BC = 7, b = CA = 5, c = AB = 3 (đơn vị 25 px)
{
  const s = 22, Bv = P(120, 70), Cv = P(120 + 7 * s, 70), Ax = (9 - 25 + 49) / 14, Av = P(120 + Ax * s, 70 - Math.sqrt(9 - Ax * Ax) * s)
  const len = (X, Y) => dist(X, Y)
  const a = len(Bv, Cv), b = len(Cv, Av), c = len(Av, Bv)
  const bis = (V, X, Y) => lerp(X, Y, len(V, X) / (len(V, X) + len(V, Y)))               // chân phân giác trong từ V xuống XY
  const Dp = bis(Av, Bv, Cv), Ep = bis(Bv, Cv, Av), Fp = bis(Cv, Av, Bv)
  const tam = P((Av.x + Bv.x + Cv.x) / 3, (Av.y + Bv.y + Cv.y) / 3)
  const dv = [[Av, 'A', 0, -14], [Bv, 'B', -16, 28], [Cv, 'C', 16, 28]]
  // ba phân giác trong vẽ trên tam giác nhọn lệch riêng (tam giác 7-5-3 ở trên tù tại A, nhìn rối)
  const Ap = P(150, 30), Bp = P(40, 230), Cp = P(340, 200)
  const bis2 = (V, X, Y) => lerp(X, Y, dist(V, X) / (dist(V, X) + dist(V, Y)))
  const D5 = bis2(Ap, Bp, Cp), E5 = bis2(Bp, Cp, Ap), F5 = bis2(Cp, Ap, Bp)
  hinh('xeva_phan_giac', [Ap, Bp, Cp], [seg(Ap, Bp), seg(Bp, Cp), seg(Cp, Ap), seg(Ap, D5), seg(Bp, E5), seg(Cp, F5),
    angleMark(Ap, Bp, D5, 30, 1), angleMark(Ap, D5, Cp, 38, 1), angleMark(Bp, Cp, E5, 30, 2), angleMark(Bp, E5, Ap, 38, 2), angleMark(Cp, Ap, F5, 30, 3), angleMark(Cp, F5, Bp, 38, 3),
    diem([[Ap], [Bp], [Cp], [D5], [E5], [F5]]), nhan([[Ap, 'A', 0, -14], [Bp, 'B', -16, 28], [Cp, 'C', 16, 28], [D5, 'D', 0, 32], [E5, 'E', 22, 4], [F5, 'F', -20, 4]])])
  void Dp; void Ep; void Fp
  if (false) hinh('xeva_phan_giac_cu', [Av, Bv, Cv], [seg(Av, Bv), seg(Bv, Cv), seg(Cv, Av), seg(Av, Dp), seg(Bv, Ep), seg(Cv, Fp),
    angleMark(Av, Bv, Dp, 26, 1), angleMark(Av, Dp, Cv, 32, 1), angleMark(Bv, Cv, Ep, 26, 2), angleMark(Bv, Ep, Av, 32, 2), angleMark(Cv, Av, Fp, 26, 3), angleMark(Cv, Fp, Bv, 32, 3),
    diem([[Av], [Bv], [Cv], [Dp], [Ep], [Fp]]), nhan([...dv, [Dp, 'D', 0, 32], [Ep, 'E', 22, 4], [Fp, 'F', -20, 4]])])
  // phân giác ngoài: M ∈ BC (MB/MC = c/b), N ∈ CA (NC/NA = a/c), P ∈ AB (PA/PB = b/a); chân phân giác ngoài đều nằm ngoài đoạn
  const ngoai = (V, X, Y) => { const k = len(V, X) / len(V, Y); return add(X, P((X.x - Y.x) * k / (1 - k), (X.y - Y.y) * k / (1 - k))) }   // điểm chia ngoài XY theo tỉ số XQ/YQ = k
  const Mv = ngoai(Av, Bv, Cv), Nv = ngoai(Bv, Cv, Av), Pv = ngoai(Cv, Av, Bv)
  void a; void b; void c
  const keo = (X, U, V) => (dist(X, U) < dist(X, V) ? seg(U, X) : seg(V, X))
  hinh('menelaus_phan_giac_ngoai', [Av, Bv, Cv, Mv, Nv, Pv], [seg(Av, Bv), seg(Bv, Cv), seg(Cv, Av), keo(Mv, Bv, Cv), keo(Nv, Cv, Av), keo(Pv, Av, Bv),
    diem([[Av], [Bv], [Cv], [Mv], [Nv], [Pv]]), nhan([...dv, [Mv, 'M', 0, 30], [Nv, 'N', 0, -14], [Pv, 'P', -20, 4]])])
  void tam
}
await xuatTat(RA)
