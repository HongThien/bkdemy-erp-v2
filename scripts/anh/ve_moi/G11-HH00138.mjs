// G11-HH00138.mjs — hình đề cho 2 câu đơn có hình mô tả được (HHC002841, HHC003434).
//   Bốn mục còn lại (HHC002834, 2837, 2839, 2842) là lý thuyết thuần ⇒ KHÔNG CẦN HÌNH (ghi trong báo cáo).
//   node scripts/anh/ve_moi/G11-HH00138.mjs "<gói>/moi"
import { P, seg, angleMark, dot, label, hinh, xuatTat, dist, goc, ray, bisector, num, angleText } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G11-HH00138.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

// ── HHC002841: điểm B nằm ngoài đường thẳng d (chỉ vẽ B và d, KHÔNG vẽ đường song song — đó là đáp án). ──
{
  const D1 = P(30, 240), D2 = P(380, 205)
  const B = P(210, 90)
  const dd = Math.abs(cross(D1, D2, B)) / dist(D1, D2)
  ok('2841 B nằm ngoài d (khoảng cách > 60)', dd > 60)
  ok('2841 d hơi nghiêng (không nằm ngang tuyệt đối), tổng quát', Math.abs(D1.y - D2.y) > 10)
  hinh('HHC002841', [D1, D2, B], [
    seg(D1, D2),
    dot(B),
    label(B, 'B', 0, -14),
    label(D2, 'd', 14, 8),
  ])
}

// ── HHC003434: ∠xOy = 100°, Ot là phân giác (ghi 100°, đánh dấu hai góc bằng nhau; KHÔNG ghi 50°). ──
{
  const O = P(120, 390)
  const aX = 15, aY = 115, aT = 65
  const Xe = ray(O, aX, 300), Ye = ray(O, aY, 300), Te = ray(O, aT, 300)
  ok('3434 ∠xOy = 100°', eq(goc(O, Xe, Ye), 100))
  ok('3434 ∠xOt = ∠tOy', eq(goc(O, Xe, Te), goc(O, Te, Ye)))
  const bs = bisector(O, Xe, Ye, 100)
  ok('3434 Ot trùng đường phân giác dựng', Math.abs(cross(O, Te, bs)) < 1e-6)
  ok('3434 (kiểm, KHÔNG ghi) ∠tOy = 50°', eq(goc(O, Te, Ye), 50))
  const t100 = ray(O, 90, 140)
  hinh('HHC003434', [O, Xe, Ye, Te], [
    seg(O, Xe), seg(O, Ye), seg(O, Te),
    angleMark(O, Xe, Ye, 95),
    angleMark(O, Xe, Te, 38), angleMark(O, Te, Ye, 52),
    num(t100, '100°', 0, 6, 22),
    dot(O),
    label(O, 'O', -18, 8),
    label(Xe, 'x', 16, 4), label(Ye, 'y', -8, -12), label(Te, 't', 8, -12),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
