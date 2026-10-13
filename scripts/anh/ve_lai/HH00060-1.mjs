// Vẽ lại hình — gói HH00060-1 (Hình thang cân, Hình học 8).
//   node scripts/anh/ve_lai/HH00060-1.mjs [<thu_muc_ra>]
// Một hình dùng chung cho 6 câu (HHC000601/602/604/605/606/607): hình thang cân ABCD (AB // CD), AB là đáy nhỏ ở trên, CD đáy lớn ở dưới.
// Hình KHÔNG ghi số đo (mỗi câu một giả thiết góc khác nhau) ⇒ chọn góc D = C = 60° (nhọn), A = B = 120° (tù): khớp mọi câu cho A > D.
import { P, seg, dot, label, hinh, xuatTat, ray, reflect, mid, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00060-1/moi'
const ok = (c, m) => console.assert(c, m)
const gan = (a, b, e = 0.05) => Math.abs(a - b) < e

const D = P(0, 160), C = P(380, 160)
const A = ray(D, 60, 190)                                  // góc D = 60°
const M0 = mid(D, C)
const B = reflect(A, M0, P(M0.x, 0))                       // đối xứng qua trục của hai đáy ⇒ cân thật
ok(gan(goc(D, A, C), 60) && gan(goc(C, B, D), 60), 'góc D = góc C = 60°')
ok(gan(dist(A, D), dist(B, C)), 'AD = BC')
ok(gan(A.y, B.y), 'AB // CD')
ok(gan(goc(A, B, D), 120) && gan(goc(B, A, C), 120), 'góc A = góc B = 120°')

hinh('HHC000601+HHC000602+HHC000604+HHC000605+HHC000606+HHC000607', [A, B, C, D], [
  seg(A, B), seg(B, C), seg(C, D), seg(D, A),
  dot(A), dot(B), dot(C), dot(D),
  label(A, 'A', -14, -12), label(B, 'B', 14, -12), label(C, 'C', 20, 24), label(D, 'D', -20, 24),
])

await xuatTat(RA)
