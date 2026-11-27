// k5v-G26.mjs — Toán 5, "Diện tích các hình" (chia hình): 9 hình vẽ lại. T105000000824 KHÔNG vẽ (đề vô lý: không có hình tròn r=10 nằm trong hình thang).
import { P, seg, num, label, labelOut, sideText, rightAngle, dot, tick, hinh, xuatTat, rot, dist, lerp, trongTam, goc } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G26.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const gan = (a, b, e = 1e-6) => Math.abs(a - b) < e
const poly = (p) => p.map((q, i) => seg(q, p[(i + 1) % p.length])).join('')
const area = (pts) => `<path d="M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="#cfe8fa" stroke="none"/>`
const names = (pts, ten, c) => pts.map((p, i) => labelOut(p, ten[i], c, 24)).join('')

// ───── 795: hình thang vuông ABCD, AB=24, AD=13, DC=32, H ∈ DC, HC=10 ─────
{
  const k = 13
  const D = P(0, 0), C = P(32 * k, 0), A = P(0, -13 * k), B = P(24 * k, -13 * k), H = P(22 * k, 0)
  ok('795: DC = 4/3 AB', gan(dist(D, C), dist(A, B) * 4 / 3))
  ok('795: HC = 10, AD = 13', gan(dist(H, C), 10 * k) && gan(dist(A, D), 13 * k))
  const c = trongTam([A, B, C, D])
  hinh('T105000000795', [A, B, C, D, P(-40, -6 * k), P(0, 40)], [
    poly([A, B, C, D]), seg(B, H), rightAngle(D, A, C, 14),
    names([A, B, C, D], ['A', 'B', 'C', 'D'], c), labelOut(H, 'H', P(H.x, -60), 24),
    sideText(A, B, '24 m', D, 22), sideText(A, D, '13 m', C, 34), sideText(H, C, '10 m', B, 24),
  ].flat(), { pad: 50, padDuoi: 50 })
}

// ───── 797: tứ giác ABCD, góc A và C vuông; AD=56, AB=33, BC=16, DC=63 ─────
{
  const k = 5.4
  const D = P(0, 0), C = P(63 * k, 0), B = P(63 * k, -16 * k)
  const phi = Math.acos(56 / 65) * 180 / Math.PI        // góc ADB
  const A = lerp(D, rot(B, D, phi), 56 / 65)            // AD = 56 theo hướng DB quay lên phi độ
  ok('797: AD = 56', gan(dist(A, D), 56 * k, 1e-4))
  ok('797: AB = 33', gan(dist(A, B), 33 * k, 1e-4))
  ok('797: góc A vuông', gan(goc(A, D, B), 90, 1e-4))
  ok('797: góc C vuông', gan(goc(C, D, B), 90, 1e-4))
  const c = trongTam([A, B, C, D])
  hinh('T105000000797', [A, B, C, D, P(B.x + 100, B.y)], [
    area([A, B, C, D]), poly([A, B, C, D]), rightAngle(A, D, B, 14), rightAngle(C, D, B, 14),
    names([A, B, C, D], ['A', 'B', 'C', 'D'], c),
    sideText(D, A, '56 cm', C, 46), sideText(A, B, '33 cm', D, 46), sideText(B, C, '16 cm', D, 36), sideText(D, C, '63 cm', A, 26),
  ].flat(), { pad: 50, padDuoi: 55 })
}

// ───── 804 / 813: bồn hoa = hình vuông cạnh s + 4 nửa hình tròn đường kính s ─────
function bonHoa(ma, soDo) {
  const s = 170, r = s / 2, o = 60
  const A = P(o, o), B = P(o + s, o), C = P(o + s, o + s), D = P(o, o + s)
  const nua = (p, q, side) => `M ${p.x} ${p.y} A ${r} ${r} 0 0 ${side} ${q.x} ${q.y}`
  // nửa hình tròn đẩy RA ngoài: cạnh AB lên trên, BC sang phải, CD xuống dưới, DA sang trái
  const hinhNen = `<path d="${nua(A, B, 1)} ${nua(B, C, 1).replace(/^M [^A]+/, '')} ${nua(C, D, 1).replace(/^M [^A]+/, '')} ${nua(D, A, 1).replace(/^M [^A]+/, '')} Z" fill="#c5f3d4" stroke="none"/>`
  const vien = `<path d="${nua(A, B, 1)}"/><path d="${nua(B, C, 1)}"/><path d="${nua(C, D, 1)}"/><path d="${nua(D, A, 1)}"/>`
  const khung = [A, B, C, D]
  const t = `${soDo} m`
  hinh(ma, [P(A.x - r, A.y - r), P(C.x + r, C.y + r)], [
    hinhNen, poly(khung), vien,
    num(P((A.x + B.x) / 2, A.y + 42), t), num(P((C.x + D.x) / 2, C.y - 22), t),
    num(P(A.x + 40, (A.y + D.y) / 2 + 8), t), num(P(B.x - 40, (B.y + C.y) / 2 + 8), t),
  ], { pad: 30, padDuoi: 40 })
}
bonHoa('T105000000804', 2)
bonHoa('T105000000813', 4)

// ───── 808: tứ giác ABCD, góc D và B vuông; AD=13, DC=84, AB=77, BC=36 ─────
{
  const k = 4.4
  const D = P(0, 0), C = P(84 * k, 0), A = P(0, -13 * k)
  const alpha = Math.acos(77 / 85) * 180 / Math.PI      // góc CAB
  const B = lerp(A, rot(C, A, alpha), 77 / 85)          // AB = 77, B nằm phía trên AC
  ok('808: AB = 77', gan(dist(A, B), 77 * k, 1e-4))
  ok('808: BC = 36', gan(dist(B, C), 36 * k, 1e-4))
  ok('808: góc B vuông', gan(goc(B, A, C), 90, 1e-4))
  ok('808: góc D vuông', gan(goc(D, A, C), 90, 1e-4))
  const c = trongTam([A, B, C, D])
  hinh('T105000000808', [A, B, C, D, P(-60, 0)], [
    poly([A, B, C, D]), rightAngle(D, A, C, 14), rightAngle(B, A, C, 14),
    names([A, B, C, D], ['A', 'B', 'C', 'D'], c),
    sideText(D, A, '13 cm', C, 36), sideText(A, B, '77 cm', D, 26), sideText(B, C, '36 cm', D, 36), sideText(D, C, '84 cm', A, 26),
  ].flat(), { pad: 55, padDuoi: 55 })
}

// ───── 818 / 823: hình thang vuông ABCD, BE ⟂ CD; đáy lớn hơn đáy bé h·... ─────
function thangE(ma, k, hieu, cao) {
  // trung bình cộng hai đáy = cao ⇒ tổng = 2·cao; hiệu cho trước
  const dayLon = (2 * cao + hieu) / 2, dayBe = dayLon - hieu
  ok(`${ma}: hiệu 2 đáy = ${hieu}, TB cộng = ${cao}`, gan(dayLon - dayBe, hieu) && gan((dayLon + dayBe) / 2, cao))
  const D = P(0, 0), C = P(dayLon * k, 0), A = P(0, -cao * k), B = P(dayBe * k, -cao * k), E = P(dayBe * k, 0)
  const c = trongTam([A, B, C, D])
  hinh(ma, [A, B, C, D], [
    poly([A, B, C, D]), seg(B, E), rightAngle(A, B, D, 14), rightAngle(D, A, E, 14), rightAngle(E, B, C, 14),
    names([A, B, C, D], ['A', 'B', 'C', 'D'], c), labelOut(E, 'E', P(E.x, -cao * k), 24),
  ].flat(), { pad: 50, padDuoi: 50 })
}
thangE('T105000000818', 3.9, 40, 80)     // AB=60, DC=100, AD=80
thangE('T105000000823', 2.6, 60, 120)    // AB=90, DC=150, AD=120

// ───── 821: hình thang vuông ABCD (AB=16, CD=28, AD=20), hình tròn tâm O đường kính AD tiếp xúc AB, CD, DA ─────
{
  const k = 15
  const D = P(0, 0), C = P(28 * k, 0), A = P(0, -20 * k), B = P(16 * k, -20 * k)
  const O = P(10 * k, -10 * k), R = 10 * k
  // khoảng cách O tới BC: ~10,29 > 10 ⇒ đề (tiếp xúc cả BC) vênh nhẹ — xem lech-de.md
  const dBC = Math.abs((C.x - B.x) * (B.y - O.y) - (B.x - O.x) * (C.y - B.y)) / dist(B, C)
  console.log('  821: khoảng cách O→BC =', (dBC / k).toFixed(3), 'cm (r = 10)')
  ok('821: O cách AD, AB, CD đúng bán kính', gan(O.x, R) && gan(O.y - A.y, R) && gan(D.y - O.y, R))
  ok('821: đường tròn nằm trọn trong hình thang', dBC >= R - 1e-6)
  const c = trongTam([A, B, C, D])
  const mienTo = `<path d="M ${A.x} ${A.y} L ${B.x} ${B.y} L ${C.x} ${C.y} L ${D.x} ${D.y} Z M ${O.x - R} ${O.y} A ${R} ${R} 0 1 0 ${O.x + R} ${O.y} A ${R} ${R} 0 1 0 ${O.x - R} ${O.y} Z" fill="#a9d1f7" fill-rule="evenodd" stroke="none"/>`
  hinh('T105000000821', [A, B, C, D], [
    mienTo, poly([A, B, C, D]), `<circle cx="${O.x}" cy="${O.y}" r="${R}" fill="none"/>`,
    rightAngle(A, B, D, 14), rightAngle(D, A, C, 14), dot(O), label(O, 'O', -16, 26),
    names([A, B, C, D], ['A', 'B', 'C', 'D'], c),
  ].flat(), { pad: 50, padDuoi: 50 })
}

// ───── T105100408005: hình vuông ABCD cạnh 16, K trung điểm BC, H trung điểm DC, tô tam giác AHK ─────
{
  const k = 18
  const A = P(0, 0), B = P(16 * k, 0), C = P(16 * k, 16 * k), D = P(0, 16 * k)
  const K = lerp(B, C, 0.5), H = lerp(D, C, 0.5)
  ok('AHK: BK = KC = 8, DH = HC = 8', gan(dist(B, K), 8 * k) && gan(dist(K, C), 8 * k) && gan(dist(D, H), 8 * k) && gan(dist(H, C), 8 * k))
  const c = trongTam([A, B, C, D])
  hinh('T105100408005', [A, B, C, D], [
    `<path d="M ${A.x} ${A.y} L ${H.x} ${H.y} L ${K.x} ${K.y} Z" fill="#f9cfa6" stroke="none"/>`,
    poly([A, B, C, D]), seg(A, H), seg(H, K), seg(K, A),
    names([A, B, C, D], ['A', 'B', 'C', 'D'], c), labelOut(K, 'K', P(A.x, K.y), 24), labelOut(H, 'H', P(H.x, A.y), 24),
    tick(B, K, 1), tick(K, C, 1), tick(D, H, 2), tick(H, C, 2),
    sideText(A, B, '16 cm', D, 22),
  ].flat(), { pad: 55, padDuoi: 55 })
}

await xuatTat(dir)
