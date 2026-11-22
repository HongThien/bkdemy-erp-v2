// ve-dtb.mjs — hình cho LÝ THUYẾT + VÍ DỤ bài HH00161 "Đường trung bình của tam giác, của hình thang" khối 8T (Thùy 22/11).
//   node kho-rules/hinh/lo/k8T-thales/lt/ve-dtb.mjs        → kho-rules/hinh/lo/k8T-thales/lt/ra/<ten>.png + .svg
// Quy ước tên: tam giác ABC có M, N là trung điểm AB, AC · hình thang / tứ giác ABCD có E, F là trung điểm AD, BC (E, F như mô tả bản đồ), P, Q trung điểm hai đường chéo AC, BD.
// dtb_tam_giac · dtb_hinh_thang (AB = 6, CD = 14 theo tỉ lệ) · dtb_hinh_thang_cm (K = AF ∩ CD) · dtb_duong_cheo (EF cắt AC tại P, BD tại Q) · dtb_tu_giac (trung điểm phụ P của AC) ·
// ví dụ: dtb_vd_chu_vi · dtb_vd_tuyen · dtb_vd_varignon · dtb_vd_chu_nhat. Hình chỉ vẽ DỮ KIỆN (không đánh dấu điều phải chứng minh).
import { P, seg, segDash, dot, label, lerp, mid, inter, tick, rightAngle, hinh, xuatTat } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const RA = join(dirname(fileURLToPath(import.meta.url)), 'ra')
const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds) => ds.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')

// tam giác ABC, M, N trung điểm AB, AC
const A = P(170, 30), B = P(40, 230), C = P(340, 230), M = mid(A, B), N = mid(A, C)
hinh('dtb_tam_giac', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(M, N), tick(A, M, 1), tick(M, B, 1), tick(A, N, 2), tick(N, C, 2), diem([[A], [B], [C], [M], [N]]),
  nhan([[A, 'A', 0, -14], [B, 'B', -16, 28], [C, 'C', 16, 28], [M, 'M', -20, 4], [N, 'N', 22, 4]])])

// hình thang ABCD (AB ∥ CD), AB = 6, CD = 14 (20 px mỗi đơn vị)
const TA = P(110, 60), TB = P(230, 60), TD = P(40, 200), TC = P(320, 200), E = mid(TA, TD), F = mid(TB, TC)
const dinhT = [[TA, 'A', -18, -8], [TB, 'B', 18, -8], [TC, 'C', 18, 28], [TD, 'D', -18, 28]]
const canhT = [seg(TA, TB), seg(TB, TC), seg(TC, TD), seg(TD, TA)]
hinh('dtb_hinh_thang', [TA, TB, TC, TD], [...canhT, seg(E, F), tick(TA, E, 1), tick(E, TD, 1), tick(TB, F, 2), tick(F, TC, 2), diem([[TA], [TB], [TC], [TD], [E], [F]]),
  nhan([...dinhT, [E, 'E', -18, 4], [F, 'F', 18, 4]])])

// chứng minh: K = AF ∩ CD, K = B + C − A
{
  const K = P(TB.x + TC.x - TA.x, TB.y + TC.y - TA.y)
  hinh('dtb_hinh_thang_cm', [TA, TB, TC, TD, K], [...canhT, seg(TC, K), seg(TA, K), seg(E, F), tick(TA, E, 1), tick(E, TD, 1), tick(TB, F, 2), tick(F, TC, 2), diem([[TA], [TB], [TC], [TD], [E], [F], [K]]),
    nhan([...dinhT, [E, 'E', -18, 4], [F, 'F', 2, -14], [K, 'K', 18, 28]])])
}

// đường trung bình hình thang cắt hai đường chéo: P = EF ∩ AC, Q = EF ∩ BD (thứ tự E, Q, P, F)
{
  const Pp = inter(E, F, TA, TC), Q = inter(E, F, TB, TD)
  hinh('dtb_duong_cheo', [TA, TB, TC, TD], [...canhT, seg(TA, TC), seg(TB, TD), seg(E, F), tick(TA, E, 1), tick(E, TD, 1), tick(TB, F, 2), tick(F, TC, 2), diem([[TA], [TB], [TC], [TD], [E], [F], [Pp], [Q]]),
    nhan([...dinhT, [E, 'E', -18, 4], [F, 'F', 18, 4], [Q, 'Q', -2, 28], [Pp, 'P', 2, 28]])])
}

// tứ giác ABCD bất kì, E, F trung điểm AD, BC, trung điểm phụ P của AC
{
  const QA = P(60, 40), QB = P(300, 70), QC = P(330, 220), QD = P(30, 200), Ea = mid(QA, QD), Fa = mid(QB, QC), Pa = mid(QA, QC)
  hinh('dtb_tu_giac', [QA, QB, QC, QD], [seg(QA, QB), seg(QB, QC), seg(QC, QD), seg(QD, QA), segDash(QA, QC), segDash(Ea, Pa), segDash(Pa, Fa), tick(QA, Ea, 1), tick(Ea, QD, 1), tick(QB, Fa, 2), tick(Fa, QC, 2),
    tick(QA, Pa, 3), tick(Pa, QC, 3), diem([[QA], [QB], [QC], [QD], [Ea], [Fa], [Pa]]),
    nhan([[QA, 'A', -16, -8], [QB, 'B', 16, -8], [QC, 'C', 18, 26], [QD, 'D', -18, 26], [Ea, 'E', -18, 4], [Fa, 'F', 18, 4], [Pa, 'P', 4, 28]])])
  // ví dụ 5: tứ giác ABCD, E, F trung điểm AD, BC (không vẽ trung điểm phụ)
  hinh('dtb_vd_bat_dang_thuc', [QA, QB, QC, QD], [seg(QA, QB), seg(QB, QC), seg(QC, QD), seg(QD, QA), seg(Ea, Fa), tick(QA, Ea, 1), tick(Ea, QD, 1), tick(QB, Fa, 2), tick(Fa, QC, 2), diem([[QA], [QB], [QC], [QD], [Ea], [Fa]]),
    nhan([[QA, 'A', -16, -8], [QB, 'B', 16, -8], [QC, 'C', 18, 26], [QD, 'D', -18, 26], [Ea, 'E', -18, 4], [Fa, 'F', 18, 4]])])
  // ví dụ 4: Varignon — E, F, G, H trung điểm AB, BC, CD, DA
  const Ev = mid(QA, QB), Fv = mid(QB, QC), Gv = mid(QC, QD), Hv = mid(QD, QA)
  hinh('dtb_vd_varignon', [QA, QB, QC, QD], [seg(QA, QB), seg(QB, QC), seg(QC, QD), seg(QD, QA), seg(Ev, Fv), seg(Fv, Gv), seg(Gv, Hv), seg(Hv, Ev),
    tick(QA, Ev, 1), tick(Ev, QB, 1), tick(QB, Fv, 2), tick(Fv, QC, 2), tick(QC, Gv, 3), tick(Gv, QD, 3), tick(QD, Hv, 4), tick(Hv, QA, 4),
    diem([[QA], [QB], [QC], [QD], [Ev], [Fv], [Gv], [Hv]]),
    nhan([[QA, 'A', -16, -8], [QB, 'B', 16, -8], [QC, 'C', 18, 26], [QD, 'D', -18, 26], [Ev, 'E', 0, -14], [Fv, 'F', 20, 6], [Gv, 'G', 0, 30], [Hv, 'H', -20, 6]])])
}

// ví dụ 1: tam giác ABC, M, N, P trung điểm AB, BC, CA (tam giác MNP)
{
  const Mv = mid(A, B), Nv = mid(B, C), Pv = mid(C, A)
  hinh('dtb_vd_chu_vi', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(Mv, Nv), seg(Nv, Pv), seg(Pv, Mv), diem([[A], [B], [C], [Mv], [Nv], [Pv]]),
    nhan([[A, 'A', 0, -14], [B, 'B', -16, 28], [C, 'C', 16, 28], [Mv, 'M', -20, 4], [Nv, 'N', 0, 32], [Pv, 'P', 22, 4]])])
}
// ví dụ 3: tam giác ABC, AM trung tuyến, D trung điểm AM, BD cắt AC tại E
{
  const Mt = mid(B, C), Dt = mid(A, Mt), Et = inter(B, Dt, A, C)
  hinh('dtb_vd_tuyen', [A, B, C], [seg(A, B), seg(B, C), seg(C, A), seg(A, Mt), seg(B, Et), tick(A, Dt, 1), tick(Dt, Mt, 1), tick(B, Mt, 2), tick(Mt, C, 2), diem([[A], [B], [C], [Mt], [Dt], [Et]]),
    nhan([[A, 'A', 0, -14], [B, 'B', -16, 28], [C, 'C', 16, 28], [Mt, 'M', 0, 32], [Dt, 'D', -18, 4], [Et, 'E', 22, 4]])])
}
// ví dụ 6: tam giác ABC vuông tại A, D, E, M trung điểm AB, AC, BC
{
  const Av = P(50, 200), Bv = P(50, 40), Cv = P(300, 200), Dv = mid(Av, Bv), Ev = mid(Av, Cv), Mv = mid(Bv, Cv)
  hinh('dtb_vd_chu_nhat', [Av, Bv, Cv], [seg(Av, Bv), seg(Bv, Cv), seg(Cv, Av), seg(Dv, Mv), seg(Ev, Mv), rightAngle(Av, Bv, Cv, 14), tick(Av, Dv, 1), tick(Dv, Bv, 1), tick(Av, Ev, 2), tick(Ev, Cv, 2), tick(Bv, Mv, 3), tick(Mv, Cv, 3),
    diem([[Av], [Bv], [Cv], [Dv], [Ev], [Mv]]), nhan([[Av, 'A', -16, 28], [Bv, 'B', 0, -14], [Cv, 'C', 16, 28], [Dv, 'D', -20, 4], [Ev, 'E', 0, 32], [Mv, 'M', 22, -6]])])
}
await xuatTat(RA)
