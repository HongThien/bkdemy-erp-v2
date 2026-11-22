// ve-thales.mjs — 4 hình cho LÝ THUYẾT + VÍ DỤ bài HH00127 "Định lí Thalès (thuận, đảo, hệ quả)" khối 8T (Thùy 22/11).
//   node kho-rules/hinh/lo/k8T-thales/lt/ve-thales.mjs        → kho-rules/hinh/lo/k8T-thales/lt/ra/<ten>.png + .svg
// thales_thuan: tam giác ABC, D∈AB, E∈AC, DE∥BC · thales_keo_dai: B nằm giữa A–D, C nằm giữa A–E · thales_dong_ho_cat: A nằm giữa B–D và C–E
// thales_he_qua: như thuận + EF∥AB (F∈BC, nét đứt) để chứng minh hệ quả. Hình chỉ vẽ DỮ KIỆN (không đánh dấu điều phải chứng minh).
import { P, seg, segDash, dot, label, labelOut, lerp, hinh, xuatTat } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const RA = join(dirname(fileURLToPath(import.meta.url)), 'ra')
const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds, tam) => ds.map(([p, t, tu]) => (tu && 'dx' in tu ? label(p, t, tu.dx, tu.dy) : labelOut(p, t, tu ?? tam))).join('')

// 1) thuận / đảo
{
  const A = P(190, 30), B = P(40, 210), C = P(340, 210), D = lerp(A, B, 0.4), E = lerp(A, C, 0.4)
  const ds = [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E']], tam = P(190, 150)
  hinh('thales_thuan', ds.map(([p]) => p), [seg(A, B), seg(B, C), seg(C, A), seg(D, E), diem(ds), nhan(ds, tam)])
}
// 2) kéo dài cùng phía: B giữa A và D, C giữa A và E
{
  const A = P(200, 20), u = P(-80, 110), v = P(80, 110)
  const B = P(A.x + u.x, A.y + u.y), C = P(A.x + v.x, A.y + v.y), D = P(A.x + u.x * 1.7, A.y + u.y * 1.7), E = P(A.x + v.x * 1.7, A.y + v.y * 1.7)
  const ds = [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E']], tam = P(200, 120)
  hinh('thales_keo_dai', ds.map(([p]) => p), [seg(A, D), seg(A, E), seg(B, C), seg(D, E), diem(ds), nhan(ds, tam)])
}
// 3) đồng hồ cát: A giữa B và D, A giữa C và E; BC ∥ DE (cùng nằm ngang)
{
  const B = P(60, 30), C = P(300, 30), A = P(180, 100)
  const D = P(A.x + (A.x - B.x) * 0.75, A.y + (A.y - B.y) * 0.75), E = P(A.x + (A.x - C.x) * 0.75, A.y + (A.y - C.y) * 0.75)
  const ds = [[B, 'B'], [C, 'C'], [D, 'D'], [E, 'E'], [A, 'A', { dx: 0, dy: 34 }]], tam = P(180, 100)
  hinh('thales_dong_ho_cat', ds.map(([p]) => p), [seg(B, D), seg(C, E), seg(B, C), seg(D, E), diem(ds), nhan(ds, tam)])
}
// 4) chứng minh hệ quả: thêm EF ∥ AB với F ∈ BC, CF/CB = CE/CA
{
  const A = P(190, 30), B = P(40, 210), C = P(340, 210), D = lerp(A, B, 0.4), E = lerp(A, C, 0.4), F = lerp(C, B, 0.6)
  const ds = [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E'], [F, 'F']], tam = P(190, 150)
  hinh('thales_he_qua', ds.map(([p]) => p), [seg(A, B), seg(B, C), seg(C, A), seg(D, E), segDash(E, F), diem(ds), nhan(ds, tam)])
}
await xuatTat(RA)
