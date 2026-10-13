// Vẽ lại hình — gói BV-MH045-1 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · biến thể).
//   node scripts/anh/ve_lai/BV-MH045-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, ray, dot, label, angleText, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH045-1/moi'

// Hai đường thẳng SONG SONG THẬT (cùng nằm ngang), cát tuyến nghiêng góc a so với đường trên, hướng lên-phải.
// Đỉnh trên T, đỉnh dưới B = T + (-h/tan a, h).
function dungChung(a, h, lt, lp) {
  const T = P(0, 0)
  const B = ray(T, a + 180, h / Math.sin(a * Math.PI / 180))
  console.assert(Math.abs(B.y - h) < 1e-6)
  const tL = P(lt, 0), tR = P(lp, 0), bL = P(lt, h), bR = P(lp, h)
  const up = ray(T, a, 80), dn = ray(B, a + 180, 62)
  return { T, B, tL, tR, bL, bR, up, dn }
}
const dauDuong = (p, t, trai) => label(p, t, trai ? -2 : 4, -12)

// Dạng 1: tính góc. Ghi a° ở góc (tia trái đường trên, đoạn T→B) — "góc so le trong" với góc cần tìm.
// N = [trên-trái, trên-phải, dưới-trái, dưới-phải, cát-tuyến-trên, cát-tuyến-dưới, đỉnh-trên, đỉnh-dưới]
function tinhGoc(ten, a, N) {
  const { T, B, tL, tR, bL, bR, up, dn } = dungChung(a, 130, -215, 165)
  const Lp = P(-100, 0)
  console.assert(Math.abs(goc(T, Lp, B) - a) < 0.01, ten + ' goc')
  console.assert(Math.abs(goc(T, tR, up) - a) < 0.01 && Math.abs(goc(B, bR, up) - a) < 0.01, ten + ' song song')
  const rr = 36
  hinh(ten, [tL, tR, bL, bR, up, dn, P(0, -30), P(-215, -30)], [
    angleMark(T, Lp, B, rr),
    seg(tL, tR), seg(bL, bR), seg(dn, up),
    dot(T), dot(B),
    angleText(T, Lp, B, a + '°', a < 55 ? 92 : 84),
    dauDuong(tL, N[0], true), dauDuong(tR, N[1]), dauDuong(bL, N[2], true), dauDuong(bR, N[3]),
    label(T, N[6], -20, -12), label(B, N[7], -20, -12),
    labelOut(up, N[4], T, 22), labelOut(dn, N[5], B, 22),
  ])
}

tinhGoc('a18e0f2c-eb8c-4c2e-96c6-f11a26edc220', 65, ['m', 'm′', 'n', 'n′', 'p', 'p′', 'C', 'D'])
tinhGoc('8d7376cd-fd87-4532-a082-a0f9e4076d82', 50, ['a', 'a′', 'b', 'b′', 'x', 'x′', 'E', 'F'])
tinhGoc('4c49cac0-4aa0-45c5-824b-2450e170866f', 72, ['c', 'c′', 'd', 'd′', 'y', 'y′', 'G', 'H'])
tinhGoc('0a91adb8-abac-4331-99e1-5b446dc7769b', 58, ['m', 'm′', 'n', 'n′', 'z', 'z′', 'P', 'Q'])
tinhGoc('7b12152f-e767-4ae7-be40-9ec8e0559310', 76, ['u', 'u′', 'v', 'v′', 't', 't′', 'R', 'S'])
tinhGoc('80ba272f-d252-4617-8664-e4aa7070d258', 64, ['k', 'k′', 'l', 'l′', 'p', 'p′', 'M', 'N'])

// Dạng 2: chứng minh song song. Ghi a° tại đỉnh trên (phía phải, giữa tia phải và tia lên d)
// và (180−a)° tại đỉnh dưới (phía trái, giữa tia trái và tia lên về đỉnh trên) — đúng như ảnh cũ.
function chungMinh(ten, a, N) {
  const { T, B, tL, tR, bL, bR, up, dn } = dungChung(a, 150, -215, 165)
  const Rr = P(100, 0), Lb = P(B.x - 100, B.y)
  console.assert(Math.abs(goc(T, Rr, up) - a) < 0.01, ten + ' goc tren')
  console.assert(Math.abs(goc(B, Lb, T) - (180 - a)) < 0.01, ten + ' goc duoi')
  console.assert(Math.abs(goc(T, Rr, up) + goc(B, Lb, T) - 180) < 0.01)
  const rr = 36
  hinh(ten, [tL, tR, bL, bR, up, dn, P(0, -30), P(-215, -30), P(B.x + 24, B.y + 36)], [
    angleMark(T, Rr, up, rr),
    angleMark(B, Lb, T, rr),
    seg(tL, tR), seg(bL, bR), seg(dn, up),
    dot(T), dot(B),
    angleText(T, Rr, up, a + '°', 78),
    angleText(B, Lb, T, (180 - a) + '°', 84),
    dauDuong(tL, N[0], true), dauDuong(tR, N[1]), dauDuong(bL, N[2], true), dauDuong(bR, N[3]),
    label(T, N[6], -22, -12), label(B, N[7], 20, 30),
    labelOut(up, N[4], T, 22), labelOut(dn, N[5], B, 22),
  ])
}

// Hình 7: mm′ ∥ nn′, cát tuyến dd′ — 65° tại A (dAm′), 115° tại B (ABn)
chungMinh('9d02e594-aea4-4354-af2a-9fc2c8dc9775', 65, ['m', 'm′', 'n', 'n′', 'd', 'd′', 'A', 'B'])
// Hình 8: xx′ ∥ yy′, cát tuyến tt′ — 75° tại M (tMx′), 105° tại N (MNy)
chungMinh('ccb5cbda-e801-4d55-afb0-8be6f03fcc91', 75, ['x', 'x′', 'y', 'y′', 't', 't′', 'M', 'N'])

await xuatTat(RA)
