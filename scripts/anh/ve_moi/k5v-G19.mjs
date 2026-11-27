// k5v-G19.mjs — K5 Diện tích các hình, dạng "Vẽ đường tròn": 10 hình (tâm hình tròn / bán kính). Vẽ lại bằng code.
//   node scripts/anh/ve_moi/k5v-G19.mjs "<thư mục gói>\moi"
import { P, seg, circle, dot, label, hinh, xuatTat, ray, dist, mid } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G19.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const R = 150, O = P(0, 0)
// ang: góc toán học (độ, y lên). lab: góc đặt nhãn tâm. Đường kính = 2 điểm đối nhau; điểm thứ ba trên đường tròn.
function ve(ma, tam, [a, b, c], [da, db, dc], labTam) {
  const A = ray(O, da, R), B = ray(O, db, R), C = ray(O, dc, R)
  ok(`${ma}: ${a},${b},${c} thuộc đường tròn`, [A, B, C].every((p) => Math.abs(dist(O, p) - R) < 1e-6))
  ok(`${ma}: ${tam} là trung điểm ${a}${b}`, dist(mid(A, B), O) < 1e-6)
  ok(`${ma}: ${c} không trùng đầu đường kính`, dist(C, A) > 40 && dist(C, B) > 40)
  const out = (p, t) => { const l = Math.hypot(p.x, p.y); return label(P(p.x + p.x / l * 26, p.y + p.y / l * 26), t, 0, 9) }
  const tl = ray(O, labTam, 24)
  hinh(ma, [P(-R, -R), P(R, R)], [
    circle(O, R), seg(A, B), seg(O, C),
    dot(A), dot(B), dot(C), dot(O),
    out(A, a), out(B, b), out(C, c), label(tl, tam, 0, 9),
  ], { pad: 50, padDuoi: 60 })
}
// 059 & 065 (E,F,G tâm I): cùng hình
ve('T105100406059', 'I', ['E', 'F', 'G'], [135, 315, 235], 70)
ve('T105100406065', 'I', ['E', 'F', 'G'], [135, 315, 235], 70)
// 060 & 066 (P,R,S tâm K)
ve('T105100406060', 'K', ['P', 'R', 'S'], [90, 270, 34], 180)
ve('T105100406066', 'K', ['P', 'R', 'S'], [90, 270, 34], 180)
// 061 (T,U,V tâm H) ; 067 (T,U,V tâm H) hướng khác
ve('T105100406061', 'H', ['T', 'U', 'V'], [180, 0, 233], 90)
ve('T105100406067', 'H', ['T', 'U', 'V'], [209, 29, 117], 300)
// 062 & 068 (X,Y,Z tâm B)
ve('T105100406062', 'B', ['X', 'Y', 'Z'], [118, 298, 208], 30)
ve('T105100406068', 'B', ['X', 'Y', 'Z'], [118, 298, 208], 30)
// 063 (A,B,M tâm O)
ve('T105100406063', 'O', ['A', 'B', 'M'], [180, 0, 60], 270)
// 064 (B,C,D tâm O)
ve('T105100406064', 'O', ['B', 'C', 'D'], [225, 45, 298], 120)
await xuatTat(dir)
