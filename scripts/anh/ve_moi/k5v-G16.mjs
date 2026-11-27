// k5v-G16.mjs — K5 Đại, chủ đề "Diện tích các hình": vẽ lại 10 hình (hình thang trên lưới ô vuông, bàn hình thang, mảnh đất hình thang vuông).
//   node scripts/anh/ve_moi/k5v-G16.mjs "<gói>\moi"
import { P, seg, hinh, xuatTat, num, rightAngle, fill, poly, dist } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G16.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const F = `font-family="'Times New Roman',Times,serif"`
// tên điểm: nghiêng, có viền trắng để không dính nét lưới
const lab = (p, t, dx, dy, size = 26) =>
  `<text x="${p.x + dx}" y="${p.y + dy}" text-anchor="middle" fill="#111" stroke="#fff" stroke-width="5" paint-order="stroke" ${F} font-style="italic" font-size="${size}">${t}</text>`
const txt = (x, y, t, size, rot = 0) =>
  `<text x="${x}" y="${y}" text-anchor="middle" fill="#111" stroke="none" ${F} font-size="${size}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''}>${t}</text>`
const tl = { ul: [-19, -10], ur: [14, -10], dl: [-14, 26], dr: [14, 26] }

// ───────── lưới ô vuông 7 × 5, đoạn đề cho vẽ đậm ─────────
function luoi(ox, oy, c) {
  let s = ''
  for (let i = 0; i <= 7; i++) s += `<line x1="${ox + i * c}" y1="${oy}" x2="${ox + i * c}" y2="${oy + 5 * c}" stroke-width="1"/>`
  for (let j = 0; j <= 5; j++) s += `<line x1="${ox}" y1="${oy + j * c}" x2="${ox + 7 * c}" y2="${oy + j * c}" stroke-width="1"/>`
  return s
}
const dam = (a, b) => seg(a, b).replace('<line', '<line stroke-width="3.5"')

// một hình lưới: pts = [{p:[i,j], t:'A', k:'ul'}...], doan = [[0,1],...] chỉ số trong pts
function hinhLuoi(ten, c, tiles, { pad = 24, padDuoi = 26 } = {}) {
  // tiles: [{ox, pts:[{ij:[i,j], t?, k?}], doan:[[a,b],...]}]
  const body = []; const all = []
  for (const g of tiles) {
    const oy = 0
    body.push(luoi(g.ox, oy, c))
    all.push(P(g.ox, oy), P(g.ox + 7 * c, oy + 5 * c))
    const q = g.pts.map((o) => P(g.ox + o.ij[0] * c, oy + o.ij[1] * c))
    for (const [a, b] of g.doan) body.push(dam(q[a], q[b]))
    g.pts.forEach((o, i) => { if (o.t) body.push(lab(q[i], o.t, ...tl[o.k])) })
  }
  hinh(ten, all, body, { pad, padDuoi })
}

// ───────── 007: hình thang ABCD, đáy AB // DC (tỉ lệ như ảnh cũ) ─────────
{
  const A = P(110, 48), B = P(242, 48), C = P(375, 224), D = P(43, 224)
  ok('007 AB // DC (cùng y)', A.y === B.y && D.y === C.y)
  ok('007 AB < DC, không bình hành', dist(A, B) < dist(D, C) && Math.abs((B.x - A.x) - (C.x - D.x)) > 20)
  ok('007 không cân (AD ≠ BC)', Math.abs(dist(A, D) - dist(B, C)) > 15)
  hinh('T105100404007', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    lab(A, 'A', -16, -10), lab(B, 'B', 16, -10), lab(C, 'C', 16, 26), lab(D, 'D', -16, 26)], { pad: 34, padDuoi: 50 })
}

const C2 = 46 // ô nhỏ cho ảnh 2 lưới
// ───────── 008: hai lưới, đoạn AB ─────────
hinhLuoi('T105100404008', C2, [
  { ox: 0, pts: [{ ij: [2, 1], t: 'A', k: 'ul' }, { ij: [4, 1], t: 'B', k: 'ur' }], doan: [[0, 1]] },
  { ox: 7 * C2 + 40, pts: [{ ij: [1, 1], t: 'A', k: 'ul' }, { ij: [5, 1], t: 'B', k: 'ur' }], doan: [[0, 1]] },
])
const C1 = 60
// ───────── 009: M(2,1) N(4,1) P(6,3) ─────────
hinhLuoi('T105100404009', C1, [
  { ox: 0, pts: [{ ij: [2, 1], t: 'M', k: 'ul' }, { ij: [4, 1], t: 'N', k: 'ur' }, { ij: [6, 3], t: 'P', k: 'dr' }], doan: [[0, 1], [1, 2]] },
])
// ───────── 010: M(2,1) N(4,1) P(6,5) ─────────
hinhLuoi('T105100404010', C1, [
  { ox: 0, pts: [{ ij: [2, 1], t: 'M', k: 'ul' }, { ij: [4, 1], t: 'N', k: 'ur' }, { ij: [6, 5], t: 'P', k: 'dr' }], doan: [[0, 1], [1, 2]] },
], { padDuoi: 50 })
// ───────── 011: A(2,1) B(4,1) C(6,3) ─────────
hinhLuoi('T105100404011', C1, [
  { ox: 0, pts: [{ ij: [2, 1], t: 'A', k: 'ul' }, { ij: [4, 1], t: 'B', k: 'ur' }, { ij: [6, 3], t: 'C', k: 'dr' }], doan: [[0, 1], [1, 2]] },
])
// ───────── 012: A(2,2) B(4,1) C(4,4) ─────────
hinhLuoi('T105100404012', C1, [
  { ox: 0, pts: [{ ij: [2, 2], t: 'A', k: 'ul' }, { ij: [4, 1], t: 'B', k: 'ur' }, { ij: [4, 4], t: 'C', k: 'dr' }], doan: [[0, 1], [1, 2]] },
])
// ───────── 013: hai lưới giống nhau, đoạn (2,1)-(4,1) và (4,1)-(5,3) ─────────
{
  const g = (ox) => ({ ox, pts: [{ ij: [2, 1] }, { ij: [4, 1] }, { ij: [5, 3] }], doan: [[0, 1], [1, 2]] })
  hinhLuoi('T105100404013', C2, [g(0), g(7 * C2 + 40)], { pad: 24, padDuoi: 24 })
}
// ───────── 014: hai lưới giống nhau, đoạn (2,1)-(4,1) và (2,1)-(2,4) ─────────
{
  const g = (ox) => ({ ox, pts: [{ ij: [2, 1] }, { ij: [4, 1] }, { ij: [2, 4] }], doan: [[0, 1], [0, 2]] })
  hinhLuoi('T105100404014', C2, [g(0), g(7 * C2 + 40)], { pad: 24, padDuoi: 24 })
}

// ───────── 639: mặt bàn hình thang, đáy 60 cm & 120 cm, cao 55 cm (4 px / cm) ─────────
{
  const k = 4
  const D = P(0, 55 * k), Cc = P(120 * k, 55 * k), A = P(40 * k, 0), B = P(100 * k, 0), H = P(40 * k, 55 * k)
  ok('639 đáy trên 60 cm', Math.abs((B.x - A.x) / k - 60) < 1e-9)
  ok('639 đáy dưới 120 cm', Math.abs((Cc.x - D.x) / k - 120) < 1e-9)
  ok('639 chiều cao 55 cm', Math.abs((H.y - A.y) / k - 55) < 1e-9)
  ok('639 AH ⟂ đáy', A.x === H.x)
  ok('639 không cân', Math.abs(dist(A, D) - dist(B, Cc)) > 20)
  hinh('T105000000639', [D, Cc, A, B, P(240, -30), P(240, 55 * k + 100)], [
    fill([A, B, Cc, D], '#f9d9a8'), poly([A, B, Cc, D]), seg(A, H), rightAngle(H, A, D, 14),
    num(P((A.x + B.x) / 2, -12), '60 cm', 0, 0, 24),
    num(P(H.x + 52, 112), '55 cm', 0, 0, 24),
    num(P(Cc.x / 2, Cc.y + 32), '120 cm', 0, 0, 24),
    num(P(Cc.x / 2, Cc.y + 74), 'Hình 1', 0, 0, 24),
  ], { pad: 30, padDuoi: 40 })
}

// ───────── 640: mảnh đất hình thang vuông (toạ độ ảnh cũ, rồi thu s) ─────────
{
  const s = 0.6
  const S = (x, y) => P(Math.round(x * s * 100) / 100, Math.round(y * s * 100) / 100)
  const TLp = S(160, 80), TRp = S(520, 80), BRp = S(440, 600), BLp = S(160, 600)
  const dato = [TLp, TRp, BRp, BLp]
  const ve = (a, b) => seg(S(...a), S(...b))
  const fs = 22 * s * 1.1
  // đo bằng số: 40 px/m trong ảnh cũ ⇒ cao 13 m, đáy dưới 7 m, đáy trên 9 m
  ok('640 cao 13 m', Math.abs((600 - 80) / 40 - 13) < 1e-9)
  ok('640 đáy dưới 7 m', Math.abs((440 - 160) / 40 - 7) < 1e-9)
  ok('640 đáy trên 9 m (7 + 2)', Math.abs((520 - 160) / 40 - 9) < 1e-9)
  const body = [
    fill(dato, '#fbe9a0'), poly(dato),
    ve([240, 80], [240, 600]),          // hành lang | các phòng
    ve([440, 80], [440, 600]),          // biên nhà | dải trồng cây
    ve([240, 210], [440, 210]), ve([240, 340], [440, 340]), ve([240, 490], [440, 490]),
    txt(S(200, 0).x, S(0, 350).y, 'HÀNH LANG', fs, -90),
    txt(S(340, 0).x, S(0, 135).y, 'PHÒNG', fs), txt(S(340, 0).x, S(0, 175).y + 3, 'NGỦ 1', fs),
    txt(S(340, 0).x, S(0, 265).y, 'PHÒNG', fs), txt(S(340, 0).x, S(0, 305).y + 3, 'NGỦ 2', fs),
    txt(S(340, 0).x, S(0, 395).y, 'PHÒNG', fs), txt(S(340, 0).x, S(0, 435).y + 3, 'KHÁCH', fs),
    txt(S(340, 0).x, S(0, 535).y, 'PHÒNG', fs), txt(S(340, 0).x, S(0, 575).y + 3, 'BẾP', fs),
    txt(S(472, 0).x, S(0, 230).y, 'TRỒNG CÂY', fs * 0.85, -81.25),
    // kích thước
    ve([112, 80], [112, 600]), txt(S(70, 0).x, S(0, 340).y, '13 m', fs * 1.15, -90),
    ve([160, 640], [440, 640]), txt(S(300, 0).x, S(0, 690).y, '7 m', fs * 1.15),
    ve([440, 47], [520, 47]), txt(S(480, 0).x, S(0, 25).y, '2 m', fs * 1.15),
  ]
  hinh('T105000000640', [...dato, S(50, 20), S(530, 700)], body, { pad: 12, padDuoi: 12 })
}

await xuatTat(dir)
