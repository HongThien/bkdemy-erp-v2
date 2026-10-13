// Vẽ lại hình — gói BV-MH028-1 (MH.028, biến thể đổi tên điểm: tứ giác MNPQ, N + Q = 180°, PN = PQ, Qy là tia đối của tia QM)
//   node scripts/anh/ve_lai/BV-MH028-1.mjs [<thu_muc_ra>]
// Dựng: PM là phân giác góc NMQ (hệ quả của đề); N xa M (góc N nhọn), Q gần M (góc Q tù), PN = PQ, N + Q = 180°.
import { P, seg, tick, angleMark, rightAngle, sector, fill, ray, foot, dot, label, hinh, xuatTat, lerp, dist, goc } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH028-1/moi'

function dung() {
  const S = 290, al = 39
  const M = P(0, 0), dirMP = -69.6
  const Pp = ray(M, dirMP, S)
  const r = 0.675 * S, H = S * Math.cos(al * Math.PI / 180), d = Math.sqrt(r * r - (S * Math.sin(al * Math.PI / 180)) ** 2)
  const Q = ray(M, dirMP - al, H - d), N = ray(M, dirMP + al, H + d)
  console.assert(Math.abs(dist(Pp, Q) - dist(Pp, N)) < 0.01, 'PQ = PN')
  console.assert(Math.abs(goc(N, M, Pp) + goc(Q, M, Pp) - 180) < 0.01, 'N + Q = 180°')
  console.assert(dist(M, Q) < dist(M, N) - 40, 'Q, N lệch')
  return { M, N, P: Pp, Q }
}

// nét + chấm + nhãn chung. ray = đầu mút tia Qy; ten = tên tia ('y')
function chung({ M, N, P: Pp, Q }, yEnd, extraSeg = [], extraLab = []) {
  return [seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, yEnd), seg(M, Q), ...extraSeg, tick(Pp, Q, 2), tick(Pp, N, 2),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', 0, -14), label(N, 'N', 24, 4), label(Pp, 'P', 0, 34), label(Q, 'Q', -24, 4), label(yEnd, 'y', -16, 6), ...extraLab]
}

// 463685bf… và 3404623e… (biến thể của BT.08.028.01) — chứng minh PQy = PNM: ảnh cũ có cung ở hai góc này ⇒ giữ; riêng ảnh cũ của 463685bf… có thêm đường chéo PM ⇒ giữ
for (const [ten, coPM] of [['463685bf-44bd-40ce-a06a-8639a7beb3fb', true], ['3404623e-5236-437f-a2cf-a51e8f7dc004', false]]) {
  const p = dung(), { M, N, P: Pp, Q } = p, yEnd = lerp(M, Q, 1.55)
  hinh(ten, [M, N, Pp, Q, yEnd], [sector(Q, Pp, yEnd, 28), sector(N, Pp, M, 28), angleMark(Q, Pp, yEnd, 28), angleMark(N, Pp, M, 28),
    ...chung(p, yEnd, coPM ? [seg(M, Pp)] : [])])
}

// 04228f75… (biến thể của BT.08.028.02) — chứng minh PM là phân giác góc NMQ; giữ cung PQy = PNM như ảnh cũ (kết quả của câu trước), có đường PM
{
  const p = dung(), { M, N, P: Pp, Q } = p, yEnd = lerp(M, Q, 1.55)
  hinh('04228f75-20b9-4116-9f2b-508c315761db', [M, N, Pp, Q, yEnd], [sector(Q, Pp, yEnd, 28), sector(N, Pp, M, 28), angleMark(Q, Pp, yEnd, 28), angleMark(N, Pp, M, 28),
    ...chung(p, yEnd, [seg(M, Pp)])])
}

// b694f56c… (biến thể của BT.08.028.02) — như trên (đề có thêm hình, không có chân đường vuông góc ở đề)
{
  const p = dung(), { M, N, P: Pp, Q } = p, yEnd = lerp(M, Q, 1.55)
  hinh('b694f56c-43a1-4a4e-b48a-01f124a10eb6', [M, N, Pp, Q, yEnd], [sector(Q, Pp, yEnd, 28), sector(N, Pp, M, 28), angleMark(Q, Pp, yEnd, 28), angleMark(N, Pp, M, 28),
    ...chung(p, yEnd, [seg(M, Pp)])])
}

// Hình LỜI GIẢI: kẻ PF ⊥ QM (F nằm trên tia Qy), PE ⊥ MN; cung PQF = PNE, ô vuông ở F, E. ten1/ten2 = tên chân đường vuông góc (F,E hoặc S,R)
function loiGiai(ten, tF, tE) {
  const p = dung(), { M, N, P: Pp, Q } = p
  const F = foot(Pp, Q, M), E = foot(Pp, M, N)
  console.assert(dist(M, F) > dist(M, Q) && dist(M, E) < dist(M, N), 'F ngoài đoạn MQ (trên tia Qy), E trong đoạn MN')
  console.assert(Math.abs(dist(Pp, F) - dist(Pp, E)) < 0.01, 'PF = PE (phân giác)')
  const yEnd = lerp(M, Q, 1.9)
  const ra = (v, a, b) => fill([v, lerp(v, a, 14 / dist(v, a)), P(lerp(v, a, 14 / dist(v, a)).x + (lerp(v, b, 14 / dist(v, b)).x - v.x), lerp(v, a, 14 / dist(v, a)).y + (lerp(v, b, 14 / dist(v, b)).y - v.y)), lerp(v, b, 14 / dist(v, b))], '#d9dde3')
  hinh(ten, [M, N, Pp, Q, yEnd, F, E], [
    sector(Q, Pp, F, 28), sector(N, Pp, E, 28), ra(F, Pp, Q), ra(E, Pp, N),
    angleMark(Q, Pp, F, 28), angleMark(N, Pp, E, 28), rightAngle(F, Pp, Q), rightAngle(E, Pp, N),
    ...chung(p, yEnd, [seg(Pp, F), seg(Pp, E), seg(M, Pp)],
      [dot(F), dot(E), label(F, tF, -22, 4), label(E, tE, 4, -16)])])
}
loiGiai('04228f75-20b9-4116-9f2b-508c315761db_lg', 'F', 'E')
loiGiai('b694f56c-43a1-4a4e-b48a-01f124a10eb6_lg', 'S', 'R')

await xuatTat(RA)
