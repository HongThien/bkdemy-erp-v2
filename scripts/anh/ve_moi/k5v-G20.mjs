// k5v-G20.mjs — vẽ lại 10 hình kho Đại K5 (Diện tích các hình / chu vi, diện tích hình tròn)
//   node scripts/anh/ve_moi/k5v-G20.mjs "<thư mục gói>\moi"
import { P, seg, dot, label, circle, fill, rightAngle, dist } from '../ve_hinh_lib.mjs'
import { txt, bang, ra, baoCao } from './k5-HK2-chung.mjs'
const out = process.argv[2]
if (!out) { console.error('Dùng: node k5v-G20.mjs <thu_muc_moi>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } console.log('✔', t) }
const f = (n) => Math.round(n * 100) / 100
const halo = (x, y, s, size = 20, anchor = 'middle') => txt(x, y, s, size, anchor, 'stroke="#fff" stroke-width="6" paint-order="stroke"')
const bc = []

// ───── 643: 4 đường tròn đồng tâm, bán kính 50 / 100 / 150 / 200 (1 px = 1 cm) ─────
{
  const cx = 220, cy = 220, k = 1
  let b = ''
  for (const r of [50, 100, 150, 200]) b += circle(P(cx, cy), r * k)
  b += seg(P(cx - 50 * k, cy), P(cx, cy)) + seg(P(cx, cy), P(cx + 200 * k, cy)) + dot(P(cx, cy))
  b += txt(cx - 24, cy - 12, '50 cm', 17) + txt(cx + 200 + 8, cy + 6, '200 cm', 20, 'start')
  ok('643 tỉ lệ bán kính 4:1', 200 / 50 === 4)
  await ra(out, 'T105000000643', 515, 440, b)
  bc.push({ ma_cau: 'T105000000643', ghi_chu: '4 đường tròn đồng tâm cách đều (50/100/150/200 cm), 2 bán kính ghi 50 cm và 200 cm; nhãn 200 cm ngoài hình để khỏi đè nét' })
}

// ───── Bảng ─────
const cols = [200, 215, 105, 105, 105]
async function bangRa(ma, d1, hang2, mau, hs, ghi) {
  const { body, w, h } = bang(cols, [[d1, ...hs], [hang2, mau, '', '', '']], 62, 17)
  await ra(out, ma, w, h, body)
  bc.push({ ma_cau: ma, ghi_chu: ghi })
}
await bangRa('T105000000663', 'Đường kính hình tròn', 'Chu vi hình tròn', '3,14 × 6 = 18,84 (dm)', ['6 dm', '7 mm', '3 cm', '10 m'], 'Bảng 2 hàng 5 cột, cột mẫu 6 dm, 3 ô trống')
await bangRa('T105000000668', 'Bán kính hình tròn', 'Chu vi hình tròn', '3,14 × 2 × 5 = 31,4 (cm)', ['5 cm', '5 dm', '3 m', '4 km'], 'Bảng bán kính, cột mẫu 5 cm, 3 ô trống')
await bangRa('T105000000693', 'Bán kính hình tròn', 'Diện tích hình tròn', '3,14 × 2 × 2 = 12,56 (cm²)', ['2 cm', '5 mm', '3 dm', '4 km'], 'Bảng diện tích, cột mẫu 2 cm, 3 ô trống')
await bangRa('T105000000720', 'Đường kính hình tròn', 'Chu vi hình tròn', '3,14 × 6 = 18,84 (cm)', ['6 cm', '4 dm', '20 mm', '8 m'], 'Bảng đường kính, cột mẫu 6 cm, 3 ô trống')

// ───── 666: nửa hình tròn đường kính 12 m (1 m = 23 px) ─────
{
  const k = 23, r = 6 * k, cx = 40 + r, cy = 30 + r
  const A = P(cx - r, cy), B = P(cx + r, cy)
  const ay = cy + 30
  let b = `<path d="M ${A.x} ${A.y} A ${r} ${r} 0 0 1 ${B.x} ${B.y} Z" fill="#cfe6f5" stroke="#222"/>`
  b += dot(P(cx, cy))
  b += seg(P(A.x, ay), P(B.x, ay)) + seg(P(A.x, ay), P(A.x + 11, ay - 5)) + seg(P(A.x, ay), P(A.x + 11, ay + 5)) + seg(P(B.x, ay), P(B.x - 11, ay - 5)) + seg(P(B.x, ay), P(B.x - 11, ay + 5))
  b += txt(cx, ay + 30, '12 m', 22)
  ok('666 đường kính = 12 m = 2r', dist(A, B) === 12 * k)
  await ra(out, 'T105000000666', 2 * r + 80, 30 + r + 30 + 30 + 40, b)
  bc.push({ ma_cau: 'T105000000666', ghi_chu: 'Nửa hình tròn tô xanh nhạt, đường kính 12 m có mũi tên kích thước, chấm tâm' })
}

// ───── 669: cạp rổ — vòng tròn bán kính 50 cm + phần buộc 15 cm (1 cm = 2.8 px) ─────
{
  const k = 2.8, r = 50 * k, cx = 40 + r, cy = 30 + r, hw = 15 * k / 2
  const yb = cy + Math.sqrt(r * r - hw * hw)
  const yEnd = cy + r + 34
  let b = circle(P(cx, cy), r) + seg(P(cx, cy), P(cx, cy - r)) + dot(P(cx, cy))
  b += seg(P(cx - hw, yb), P(cx - hw, yEnd)) + seg(P(cx + hw, yb), P(cx + hw, yEnd)) + seg(P(cx - hw, yEnd - 8), P(cx + hw, yEnd - 8))
  b += halo(cx - 28, cy - r / 2, '50 cm', 20) + txt(cx, yEnd + 32, '15 cm', 20)
  ok('669 bề rộng phần buộc = 15 cm', f(2 * hw) === f(15 * k))
  await ra(out, 'T105000000669', 2 * r + 80, Math.ceil(yEnd + 32 + 38), b)
  bc.push({ ma_cau: 'T105000000669', ghi_chu: 'Vòng tròn có bán kính 50 cm (đoạn thẳng đứng từ tâm), đoạn buộc hai đầu tre 15 cm ở đáy' })
}

// ───── 675: hình vuông 5, chữ nhật 7×3, tròn r=4 (1 cm = 20 px) ─────
{
  const k = 20
  const A = P(40, 70), B = P(A.x + 5 * k, A.y), C = P(B.x, A.y + 5 * k), D = P(A.x, C.y)
  const E = P(220, 90), G = P(E.x + 7 * k, E.y), H = P(G.x, E.y + 3 * k), K = P(E.x, H.y)
  const O = P(550, 120), r = 4 * k
  let b = ''
  b += seg(A, B) + seg(B, C) + seg(C, D) + seg(D, A)
  b += seg(E, G) + seg(G, H) + seg(H, K) + seg(K, E)
  b += circle(O, r) + seg(O, P(O.x + r, O.y)) + dot(O)
  b += label(A, 'A', -14, -8) + label(B, 'B', 14, -8) + label(C, 'C', 14, 22) + label(D, 'D', -14, 22)
  b += label(E, 'E', -14, -8) + label(G, 'G', 14, -8) + label(H, 'H', 14, 22) + label(K, 'K', -14, 22)
  b += label(O, 'O', -2, 28) + txt(O.x + r / 2, O.y - 10, '4 cm', 19)
  b += txt((A.x + B.x) / 2, C.y + 32, '5 cm', 21) + txt((E.x + G.x) / 2, H.y + 32, '7 cm', 21) + txt(G.x + 40, (G.y + H.y) / 2 + 7, '3 cm', 21)
  ok('675 vuông 5×5, chữ nhật 7×3, bán kính 4', dist(A, B) === 100 && dist(B, C) === 100 && dist(E, G) === 140 && dist(G, H) === 60 && 4 * k === 80)
  await ra(out, 'T105000000675', 660, 230, b)
  bc.push({ ma_cau: 'T105000000675', ghi_chu: 'Vuông ABCD cạnh 5, chữ nhật EGHK 7×3, tròn tâm O bán kính 4 cm, tỉ lệ thật 20 px/cm; thêm tên đỉnh thay chữ tên đặt phía trên như ảnh cũ' })
}

// ───── 685: rùa — 3 nửa đường tròn đỏ (3,1,5 dm) và 1 nửa đường tròn xanh đường kính AB (1 dm = 20 px) ─────
{
  const k = 20, x0 = 50, y0 = 70
  const A = P(x0, y0), B = P(x0 + 18 * k, y0)
  const c1 = P(x0 + 3 * k, y0), c2 = P(x0 + 7 * k, y0), c3 = P(x0 + 13 * k, y0), c4 = P(x0 + 9 * k, y0)
  const X1 = P(x0 + 6 * k, y0), X2 = P(x0 + 8 * k, y0)
  const red = '#d62b2b', blue = '#1a9ae0'
  ok('685 AB = 6+2+10 = 18 dm', dist(A, B) === 18 * k && dist(A, X1) === 6 * k && dist(X1, X2) === 2 * k && dist(X2, B) === 10 * k)
  let b = `<g stroke-width="3">`
  b += `<path d="M ${A.x} ${y0} A ${3 * k} ${3 * k} 0 0 0 ${X1.x} ${y0}" stroke="${red}"/>`
  b += `<path d="M ${X1.x} ${y0} A ${k} ${k} 0 0 1 ${X2.x} ${y0}" stroke="${red}"/>`
  b += `<path d="M ${X2.x} ${y0} A ${5 * k} ${5 * k} 0 0 0 ${B.x} ${y0}" stroke="${red}"/>`
  b += `<path d="M ${A.x} ${y0} A ${9 * k} ${9 * k} 0 0 0 ${B.x} ${y0}" stroke="${blue}"/>`
  b += `<line x1="${A.x}" y1="${y0}" x2="${B.x}" y2="${y0}" stroke="${red}" stroke-width="2" stroke-dasharray="7 6"/></g>`
  const rd = (p, s = 4.5) => `<circle cx="${p.x}" cy="${p.y}" r="${s}" fill="${red}" stroke="none"/>`
  b += rd(A, 6) + rd(B, 6) + rd(c1) + rd(c2) + rd(c3)
  b += label(A, 'A', -20, 8) + label(B, 'B', 22, 8)
  b += txt(c1.x + 1.5 * k, y0 - 12, '3 dm', 19) + txt(c2.x, y0 - k - 12, '1 dm', 19) + txt(c3.x + 2.5 * k, y0 - 12, '5 dm', 19)
  await ra(out, 'T105000000685', 2 * x0 + 18 * k, y0 + 9 * k + 45, b)
  bc.push({ ma_cau: 'T105000000685', ghi_chu: 'Đường đỏ: nửa đường tròn bán kính 3 (dưới), 1 (trên), 5 (dưới) nối tiếp trên AB (AB=18); đường xanh: nửa đường tròn đường kính AB (dưới); chấm đỏ ở tâm từng nửa đường tròn đỏ; tỉ lệ thật 20 px/dm' })
}

// ───── 718: tam giác vuông 7×7, thang vuông 3/6/4, tròn r=5 — tô nhạt như ảnh cũ (1 cm = 20 px) ─────
{
  const k = 20, tan = '#eadfc4'
  const A = P(70, 30), Bt = P(A.x, A.y + 7 * k), C = P(A.x + 7 * k, Bt.y)
  // quy chuẩn: góc vuông ở dưới trái, AC ngang, B trên ⇒ đặt đỉnh vuông ở dưới
  const V = P(70, 170), T = P(70, 30), R = P(70 + 7 * k, 170)
  const t0 = P(70, 245), t1 = P(70 + 3 * k, 245), t2 = P(70 + 6 * k, 245 + 4 * k), t3 = P(70, 245 + 4 * k)
  const O = P(350, 295), r = 5 * k
  let b = fill([T, V, R], tan) + fill([t0, t1, t2, t3], tan)
  b += `<circle cx="${O.x}" cy="${O.y}" r="${r}" fill="${tan}"/>`
  b += seg(T, V) + seg(V, R) + seg(R, T) + rightAngle(V, T, R, 14)
  b += seg(t0, t1) + seg(t1, t2) + seg(t2, t3) + seg(t3, t0) + rightAngle(t3, t0, t2, 12) + rightAngle(t0, t3, t1, 12)
  b += circle(O, r) + seg(O, P(O.x + r, O.y)) + dot(O)
  b += txt(T.x - 32, 100 + 7, '7 cm', 21) + txt((V.x + R.x) / 2, V.y + 30, '7 cm', 21)
  b += txt((t0.x + t1.x) / 2, t0.y - 10, '3 cm', 21) + txt(t0.x - 32, (t0.y + t3.y) / 2 + 7, '4 cm', 21) + txt((t3.x + t2.x) / 2, t3.y + 30, '6 cm', 21)
  b += txt(O.x + r / 2, O.y - 10, '5 cm', 21)
  ok('718 tam giác vuông cân 7 / thang 3-6-4 / bán kính 5', dist(T, V) === 140 && dist(V, R) === 140 && dist(t0, t1) === 60 && dist(t3, t2) - 0 > 0 && t2.x - t3.x === 120 && t3.y - t0.y === 80 && r === 100)
  await ra(out, 'T105000000718', 470, 400, b)
  bc.push({ ma_cau: 'T105000000718', ghi_chu: 'Tam giác vuông 7×7 (góc vuông dưới trái, AC ngang), thang vuông đáy bé 3 / đáy lớn 6 / cao 4 (vuông ở bên trái), tròn r=5; tô nhạt như ảnh cũ; thêm ô vuông cho các góc vuông' })
}

baoCao(out, bc, [], null)
console.log('xong', bc.length)
