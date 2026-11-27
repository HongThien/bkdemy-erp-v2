// k5v-G21.mjs — Toán 5, chủ đề "Diện tích các hình", dạng "Chu vi, diện tích hình tròn": vẽ lại 10 hình (gói G21)
//   node scripts/anh/ve_moi/k5v-G21.mjs "<thư mục gói>\moi"
import { writeFileSync, mkdirSync } from 'node:fs'
import { P, seg, dot, label, num, bien, circle, rightAngle, dist, mid, svgDoc, luu } from '../ve_hinh_lib.mjs'
import { txt, bang } from './k5-HK2-chung.mjs'

const OUT = process.argv[2]
if (!OUT) { console.error('Dùng: node k5v-G21.mjs <thu_muc_moi>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } }
const near = (a, b, e = 1e-6) => Math.abs(a - b) < e
const f = (n) => Math.round(n * 100) / 100
async function ra(ten, w, h, body) {
  if (w > 760 || h > 450) throw new Error(`${ten} ${w}x${h} vượt khung`)
  console.log(`${ten} ${w}x${h}`)
  await luu(OUT, ten, w, h, svgDoc(w, h, body))
}
const arrow = (a, b, s = 10) => {
  const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
  const head = (p, sgn) => {
    const bx = p.x - sgn * ux * s, by = p.y - sgn * uy * s
    return `<path d="M ${f(p.x)} ${f(p.y)} L ${f(bx - uy * s * 0.35)} ${f(by + ux * s * 0.35)} L ${f(bx + uy * s * 0.35)} ${f(by - ux * s * 0.35)} Z" fill="#222" stroke="none"/>`
  }
  return seg(a, b) + head(a, -1) + head(b, 1)
}
const bc = [], kv = []

// ───── T105000000722: hình tròn lớn + 4 hình tròn nhỏ + hình vuông tô
{
  const k = 22, R = 8 * k, r = 4 * k, W = 2 * R + 24, H = 2 * R + 24
  const O = P(W / 2, H / 2)
  const c = [P(O.x, O.y - r), P(O.x + r, O.y), P(O.x, O.y + r), P(O.x - r, O.y)]
  ok('722: 4 tròn nhỏ tiếp xúc trong với tròn lớn', c.every((p) => near(dist(O, p) + r, R)))
  ok('722: hình vuông cạnh 2r qua 4 giao điểm', near(2 * r, 8 * k))
  let b = `<rect x="${f(O.x - r)}" y="${f(O.y - r)}" width="${2 * r}" height="${2 * r}" fill="#bcd9f2" stroke="none"/>`
  b += circle(O, R) + c.map((p) => circle(p, r)).join('')
  b += `<rect x="${f(O.x - r)}" y="${f(O.y - r)}" width="${2 * r}" height="${2 * r}" fill="none"/>`
  const top = c[0], rt = P(top.x + r, top.y)
  b += seg(top, rt) + dot(top) + num(P((top.x + rt.x) / 2, top.y), '4 dm', 0, -8, 20)
  ok('722: bán kính 4 dm = 88 px', near(dist(top, rt), 4 * k))
  await ra('T105000000722', W, H, b)
  bc.push({ ma_cau: 'T105000000722', ghi_chu: 'Tròn lớn bán kính 8 dm + 4 tròn nhỏ bán kính 4 dm tiếp xúc nhau ở tâm và tiếp xúc trong với tròn lớn; hình vuông cạnh 8 dm tô xanh nhạt; bán kính tròn nhỏ phía trên ghi 4 dm (như ảnh cũ). Dùng nét đen thay nét xanh.' })
}

// ───── bảng: 725, 758, 786
{
  const cols = [215, 175, 100, 100, 100]
  const t = bang(cols, [['Bán kính hình tròn', '5 m', '4 cm', '6 m', '3 km'], ['Chu vi hình tròn', '31,4 m', '', '', '']], 64, 18)
  await ra('T105000000725', t.w, t.h, t.body)
  bc.push({ ma_cau: 'T105000000725', ghi_chu: 'Bảng 2 hàng × 5 cột; cột mẫu 5 m → 31,4 m; 3 ô trống cho HS điền' })
}
{
  const cols = [190, 235, 95, 95, 95]
  const t = bang(cols, [['Bán kính hình tròn', '2 dm', '4 cm', '5 m', '10 mm'], ['Diện tích hình tròn', '', '', '', '']], 64, 18)
  // ô mẫu: chữ nhỏ hơn như ảnh cũ
  const x = 10 + cols[0], y = 10 + 64
  const mau = txt(x + cols[1] / 2, y + 32 + 5, '3,14 × 2 × 2 = 12,56 (dm²)', 15)
  await ra('T105000000758', t.w, t.h, t.body + mau)
  bc.push({ ma_cau: 'T105000000758', ghi_chu: 'Bảng 2 hàng × 5 cột; cột mẫu 2 dm ghi sẵn "3,14 × 2 × 2 = 12,56 (dm²)"; 3 ô trống cho HS điền' })
}
{
  const cols = [215, 175, 100, 100, 100]
  const t = bang(cols, [['Bán kính hình tròn', '2 cm', '10 cm', '3 dm', '1 m'], ['Chu vi hình tròn', '', '', '', ''], ['Diện tích hình tròn', '', '', '', '']], 64, 18)
  await ra('T105000000786', t.w, t.h, t.body)
  bc.push({ ma_cau: 'T105000000786', ghi_chu: 'Bảng 3 hàng × 5 cột; hàng chu vi và diện tích để trống cho HS điền' })
}

// ───── T105000000733: hai hình tròn bán kính a và a×2
{
  const k = 0.48, r1 = 140 * k, r2 = 280 * k
  const c1 = P(20 + r1, 20 + r1), c2 = P(c1.x + 240 * k, c1.y + 380 * k)
  const W = Math.ceil(c2.x + r2 + 20), H = Math.ceil(c2.y + r2 + 20)
  ok('733: bán kính đỏ = 2 × xanh', near(r2, 2 * r1))
  ok('733: hai hình tròn không chạm nhau', dist(c1, c2) > r1 + r2)
  let b = `<circle cx="${f(c1.x)}" cy="${f(c1.y)}" r="${f(r1)}" fill="#7fcf9b"/><circle cx="${f(c2.x)}" cy="${f(c2.y)}" r="${f(r2)}" fill="#f29a9a"/>`
  const e1 = P(c1.x + r1, c1.y), e2 = P(c2.x + r2, c2.y)
  b += seg(c1, e1).replace('<line', '<line stroke-dasharray="6 5"') + dot(c1) + seg(c2, e2).replace('<line', '<line stroke-dasharray="6 5"') + dot(c2)
  b += bien(P((c1.x + e1.x) / 2, c1.y), 'a', 0, -8, 24)
  b += bien(P((c2.x + e2.x) / 2, c2.y), 'a × 2', 0, -8, 24)
  await ra('T105000000733', W, H, b)
  bc.push({ ma_cau: 'T105000000733', ghi_chu: 'Tròn xanh bán kính a, tròn đỏ bán kính a×2 (tỉ lệ 1:2 thật), bán kính vẽ nét đứt có ghi nhãn, tô màu nhạt để chữ đen đọc được (ảnh cũ chữ trắng trên nền đậm)' })
}

// ───── T105000000738: 4 hình, 1 cm = 34 px
{
  const k = 34
  let b = ''
  // tam giác đều ABC (cạnh 3 cm), A trên, BC ngang
  const B = P(30, 160), C = P(B.x + 3 * k, B.y), A = P(B.x + 1.5 * k, B.y - 3 * k * Math.sqrt(3) / 2)
  ok('738: tam giác đều', near(dist(A, B), 3 * k, 1e-6) && near(dist(A, C), 3 * k, 1e-6))
  b += seg(A, B) + seg(B, C) + seg(C, A)
  b += label(A, 'A', 0, -12) + label(B, 'B', -14, 18) + label(C, 'C', 14, 18)
  b += num(P((A.x + C.x) / 2 + 26, (A.y + C.y) / 2), '3 cm', 0, 6, 20)
  // hình vuông EGHK cạnh 3 cm
  const E = P(300, 60), G = P(E.x + 3 * k, E.y), Hh = P(G.x, G.y + 3 * k), K = P(E.x, E.y + 3 * k)
  b += seg(E, G) + seg(G, Hh) + seg(Hh, K) + seg(K, E)
  b += label(E, 'E', -14, -6) + label(G, 'G', 14, -6) + label(Hh, 'H', 14, 22) + label(K, 'K', -14, 22)
  b += num(mid(E, G), '3 cm', 0, -10, 20)
  // hình tròn tâm O bán kính 3 cm
  const O = P(30 + 3 * k, 215 + 3 * k), re = P(O.x + 3 * k, O.y)
  b += circle(O, 3 * k) + seg(O, re) + dot(O) + label(O, 'O', -8, 24) + num(mid(O, re), '3 cm', 0, -10, 20)
  // hình bình hành MNPQ: MN = 2,86; NP = QM = 2,48
  const M = P(340, 245), N = P(M.x + 2.86 * k, M.y)
  const dx = -0.8 * k, dy = Math.sqrt(2.48 * 2.48 - 0.8 * 0.8) * k
  const Q = P(M.x + dx, M.y + dy), Pp = P(N.x + dx, N.y + dy)
  ok('738: MN = 2,86 cm', near(dist(M, N) / k, 2.86, 1e-6))
  ok('738: MQ = NP = 2,48 cm', near(dist(M, Q) / k, 2.48, 1e-6) && near(dist(N, Pp) / k, 2.48, 1e-6))
  ok('738: QP = MN', near(dist(Q, Pp), dist(M, N), 1e-6))
  b += seg(M, N) + seg(N, Pp) + seg(Pp, Q) + seg(Q, M)
  b += label(M, 'M', -8, -10) + label(N, 'N', 12, -10) + label(Pp, 'P', 8, 24) + label(Q, 'Q', -14, 24)
  b += num(mid(M, N), '2,86 cm', 0, -12, 20)
  b += num(P(mid(N, Pp).x + 52, mid(N, Pp).y), '2,48 cm', 0, 6, 20)
  const W = 590, H = 440
  ok('738: nằm trong khung', Pp.y + 40 < H && Pp.x + 100 < W + 20 && O.y + 3 * k + 20 < H)
  await ra('T105000000738', W, H, b)
  bc.push({ ma_cau: 'T105000000738', ghi_chu: 'Bốn hình đúng tỉ lệ 1 cm = 34 px: tam giác đều cạnh 3 cm (chỉ ghi 3 cm ở AC như ảnh cũ), hình vuông EGHK cạnh 3 cm, tròn tâm O bán kính 3 cm, bình hành MNPQ MN = 2,86 cm, NP = 2,48 cm. Không ghi chu vi.' })
}

// ───── T105000000742: hình vuông cạnh a + hình tròn đường kính d (khe hở)
{
  const S = 300, x0 = 20, y0 = 20, d = 200, r = d / 2
  const cx = x0 + 150, cy = y0 + S - r
  ok('742: tròn tiếp xúc cạnh đáy', near(cy + r, y0 + S))
  let b = `<rect x="${x0}" y="${y0}" width="${S}" height="${S}"/>`
  // tròn có khe hở ở đáy (±7°)
  const g = 10 * Math.PI / 180
  const a1 = Math.PI / 2 + g, a2 = Math.PI / 2 - g
  const p1 = P(cx + r * Math.cos(a1), cy + r * Math.sin(a1)), p2 = P(cx + r * Math.cos(a2), cy + r * Math.sin(a2))
  b += `<path d="M ${f(p1.x)} ${f(p1.y)} A ${r} ${r} 0 1 1 ${f(p2.x)} ${f(p2.y)}"/>`
  // đường kính d
  b += arrow(P(cx - r, cy), P(cx + r, cy)) + num(P(cx, cy), '<tspan font-style="italic">d</tspan> cm', 0, -10, 24)
  // chiều cao a
  const ax = x0 + S + 30
  b += arrow(P(ax, y0), P(ax, y0 + S)) + num(P(ax + 42, y0 + S / 2), '<tspan font-style="italic">a</tspan> cm', 0, 8, 24)
  await ra('T105000000742', ax + 42 + 40, y0 + S + 25, b)
  bc.push({ ma_cau: 'T105000000742', ghi_chu: 'Hình vuông cạnh a cm; hình tròn đường kính d cm nằm trong, tiếp xúc cạnh đáy và có khe hở nhỏ ở đáy; mũi tên d ngang và a dọc bên phải (như ảnh cũ)' })
}

// ───── T105000000766: hai hình tròn cùng tâm, OA = 3, AB = 1
{
  const k = 46, ang = 25 * Math.PI / 180
  const O = P(20 + 4 * k, 20 + 4 * k)
  const dir = P(Math.cos(ang), -Math.sin(ang))
  const A = P(O.x + 3 * k * dir.x, O.y + 3 * k * dir.y), B = P(O.x + 4 * k * dir.x, O.y + 4 * k * dir.y)
  ok('766: OA = 3, AB = 1', near(dist(O, A) / k, 3, 1e-6) && near(dist(A, B) / k, 1, 1e-6))
  let b = circle(O, 3 * k) + circle(O, 4 * k) + seg(O, B) + dot(O) + dot(A) + dot(B)
  b += label(O, 'O', -14, 20) + label(A, 'A', -20, 2) + label(B, 'B', 22, -4)
  const rotTxt = (p, t, nx, ny) => `<g transform="translate(${f(p.x + nx)},${f(p.y + ny)}) rotate(${f(-25)})">${num(P(0, 0), t, 0, 0, 18)}</g>`
  const nrm = P(-dir.y * -1, dir.x * -1) // pháp tuyến hướng xuống dưới bên phải
  b += rotTxt(mid(O, A), '3 cm', 0, 20)
  b += rotTxt(mid(A, B), '1 cm', -6, -12)
  void nrm
  await ra('T105000000766', 8 * k + 40, 8 * k + 40, b)
  bc.push({ ma_cau: 'T105000000766', ghi_chu: 'Hai tròn đồng tâm O (bán kính 3 và 4 theo tỉ lệ 40 px/cm); O, A, B thẳng hàng, A trên tròn nhỏ, B trên tròn lớn; ghi OA = 3 cm, AB = 1 cm; không ghi OB' })
}

// ───── T105000000772: nửa hình tròn bán kính 60 m
{
  const r = 180, O = P(30 + r, 30 + r)
  const L = P(O.x - r, O.y), Rr = P(O.x + r, O.y), T = P(O.x, O.y - r)
  let b = `<path d="M ${L.x} ${L.y} A ${r} ${r} 0 0 1 ${Rr.x} ${Rr.y} Z"/>` + seg(O, T) + dot(O)
  b += num(P(O.x - 8 - 22, (O.y + T.y) / 2), '60 m', 0, 6, 22).replace('text-anchor="middle"', 'text-anchor="end"').replace(/x="[\d.]+"/, `x="${f(O.x - 10)}"`)
  await ra('T105000000772', 2 * r + 60, r + 30 + 30 + 40, b)
  bc.push({ ma_cau: 'T105000000772', ghi_chu: 'Nửa hình tròn đáy nằm ngang, tâm O ở trung điểm đáy, bán kính thẳng đứng ghi 60 m (như ảnh cũ)' })
}

// ───── T105000000810: tam giác vuông ABC nội tiếp đường tròn đường kính BC
{
  const k = 32
  const Aa = P(60, 60 + 8 * 0 + 0)
  // A góc dưới trái, AB thẳng đứng (B trên), AC nằm ngang
  const A = P(70, 70 + 6 * k), B = P(A.x, A.y - 6 * k), C = P(A.x + 8 * k, A.y)
  void Aa
  const O = mid(B, C), R = dist(O, B)
  ok('810: AB = 6, AC = 8, BC = 10', near(dist(A, B) / k, 6) && near(dist(A, C) / k, 8) && near(dist(B, C) / k, 10, 1e-9))
  ok('810: O trung điểm BC, bán kính 5 cm', near(R / k, 5, 1e-9) && near(dist(O, C), R))
  ok('810: A nằm trên đường tròn', near(dist(O, A), R, 1e-9))
  const x0 = O.x - R, y0 = O.y - R
  let b = circle(O, R) + seg(A, B) + seg(A, C) + seg(B, C) + dot(O) + rightAngle(A, B, C, 16)
  b += label(A, 'A', -14, 20) + label(B, 'B', -2, -14) + label(C, 'C', 16, 14) + label(O, 'O', -14, 22)
  // nhãn cạnh: AB trái, AC dưới, BC trên-phải
  b += num(P(A.x + 34, (A.y + B.y) / 2 + 40), '6 cm', 0, 7, 20)
  b += num(P((A.x + C.x) / 2, A.y + 28), '8 cm', 0, 4, 20)
  const m = P(B.x + (C.x - B.x) * 0.72, B.y + (C.y - B.y) * 0.72)
  b += num(P(m.x + 30, m.y - 18), '10 cm', 0, 6, 20)
  const W = Math.ceil(2 * R + 40 + 20), H = Math.ceil(2 * R + 40 + 20)
  // dịch gốc về (x0-20, y0-20)
  await ra('T105000000810', W, H, `<g transform="translate(${f(-(x0 - 20))},${f(-(y0 - 20))})">${b}</g>`)
  bc.push({ ma_cau: 'T105000000810', ghi_chu: 'Tam giác ABC vuông tại A (AB = 6, AC = 8, BC = 10 đúng tỉ lệ 32 px/cm), vẽ theo quy chuẩn AC ngang, B trên (ảnh cũ để BC nằm ngang — đổi hướng có chủ ý); đường tròn tâm O đường kính BC, O trung điểm BC, A nằm trên đường tròn; ô vuông tại A; không ghi bán kính / diện tích' })
}

mkdirSync(OUT, { recursive: true })
const par = OUT.replace(/[\\/]moi$/, '')
writeFileSync(`${par}/bao-cao.json`, JSON.stringify(bc, null, 1))
writeFileSync(`${par}/khong-ve.json`, JSON.stringify(kv, null, 1))
console.log('xong', bc.length)
