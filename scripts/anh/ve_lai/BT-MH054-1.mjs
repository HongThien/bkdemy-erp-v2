// Vẽ lại hình — gói BT-MH054-1 (MH.054 Hình học, Hình 7 · Luyện: góc đối đỉnh / kề bù / phân giác).
//   node scripts/anh/ve_lai/BT-MH054-1.mjs [<thu_muc_ra>]
import { P, seg, angleMark, sector, rightAngle, ray, dot, label, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BT-MH054-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// BT.07.054.01 — xy, zt cắt nhau tại O, xOt = 33° (ảnh cũ chỉ có cung ở góc xOt, không ghi số)
{
  const O = P(0, 0)
  const x = ray(O, 191, 190), y = ray(O, 11, 190), t = ray(O, 191 + 33, 175), z = ray(O, 11 + 33, 175)
  ok(Math.abs(goc(O, x, t) - 33) < 0.5, 'xOt = 33°')
  ok(Math.abs(goc(O, y, z) - 33) < 0.5, 'yOz = 33°')
  hinh('BT.07.054.01', [x, y, z, t], [seg(x, y), seg(t, z), angleMark(O, x, t, 44), dot(O),
    label(O, 'O', 22, 26), label(x, 'x', -16, 10), label(y, 'y', 16, 10), label(z, 'z', 6, -12), label(t, 't', -6, 28)])
}

// BT.07.054.02 — m, I, n thẳng hàng; nIq = 40° (ghi trên hình); Ip ⊥ Im (ô vuông, tô nhạt như ảnh cũ)
{
  const I = P(0, 0)
  const n = ray(I, 43, 190), m = ray(I, 43 + 180, 190), q = ray(I, 3, 235), p = ray(I, 43 + 180 + 90, 205)
  ok(Math.abs(goc(I, n, q) - 40) < 0.5, 'nIq = 40°')
  ok(Math.abs(goc(I, m, p) - 90) < 0.5, 'mIp = 90°')
  const s = 20, u1 = ray(P(0, 0), 223, 1), u2 = ray(P(0, 0), 313, 1)
  const a = P(u1.x * s, u1.y * s), b = P(u2.x * s, u2.y * s), c = P(a.x + b.x, a.y + b.y)
  const lt = ray(I, 23, 66)
  hinh('BT.07.054.02', [n, m, q, p], [
    `<path d="M ${I.x} ${I.y} L ${a.x} ${a.y} L ${c.x} ${c.y} L ${b.x} ${b.y} Z" fill="#d9dde3" stroke="none"/>`,
    seg(m, n), seg(I, q), seg(I, p), rightAngle(I, m, p, s), angleMark(I, n, q, 40), dot(I),
    `<text x="${lt.x + 4}" y="${lt.y + 8}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="22">40°</text>`,
    label(I, 'I', -22, -8), label(n, 'n', 6, -10), label(q, 'q', 14, 4), label(m, 'm', -10, 26), label(p, 'p', 10, 28)])
}

// BT.07.054.03 — m, E, n thẳng hàng; x, E, y thẳng hàng (ảnh cũ không có số đo, không có ký hiệu)
{
  const E = P(0, 0)
  const m = ray(E, 180, 205), n = ray(E, 0, 195), x = ray(E, 124.5, 190), y = ray(E, 124.5 + 180, 180)
  hinh('BT.07.054.03', [m, n, x, y], [seg(m, n), seg(x, y), dot(E),
    label(E, 'E', -14, 28), label(m, 'm', 0, 28), label(n, 'n', 4, 28), label(x, 'x', -14, -8), label(y, 'y', 8, 30)])
}

// BT.07.054.04 — xOy = 80°, Oz phân giác (ảnh cũ: tô nhạt + cung cho cả góc xOy, không ghi số)
{
  const O = P(0, 0)
  const x = ray(O, 0, 290), y = ray(O, 80, 280), z = ray(O, 40, 290)
  ok(Math.abs(goc(O, x, y) - 80) < 0.5, 'xOy = 80°')
  ok(Math.abs(goc(O, x, z) - goc(O, z, y)) < 0.5, 'Oz phân giác')
  hinh('BT.07.054.04', [O, x, y, z], [sector(O, x, y, 48, '#e1e4e8'), seg(O, x), seg(O, y), seg(O, z), angleMark(O, x, y, 48), dot(O),
    label(O, 'O', -18, -12), label(x, 'x', 2, 30), label(y, 'y', 18, 6), label(z, 'z', 16, 4)])
}

await xuatTat(RA)
