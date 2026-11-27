// G24 — vẽ lại 10 hình kho Đại khối 5 "Diện tích các hình". Chạy: node k5v-G24.mjs "<thư mục gói>\moi"
import { writeFileSync } from 'node:fs'
import { P, seg, segDash, label, num, dot, rightAngle, fill, poly, svgDoc, luu, dist } from '../ve_hinh_lib.mjs'
import { bang } from './k5-HK2-chung.mjs'

const OUT = process.argv[2]
const f = (n) => Math.round(n * 100) / 100
const chk = (ok, m) => { if (!ok) throw new Error('KIỂM SAI: ' + m) }
const close = (a, b, e = 0.6) => Math.abs(a - b) <= e
const ra = async (ten, w, h, body) => { chk(w <= 760 && h <= 450, ten + ' vượt khung'); console.log(ten, w + 'x' + h); await luu(OUT, ten, w, h, svgDoc(w, h, body)) }
const map = (ox, oy, s) => (x, y) => P(ox + x * s, oy - y * s)   // y hướng lên (đơn vị thật) → toạ độ ảnh
const txt = (x, y, s, size = 22) => `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="${size}">${s}</text>`

// ───── T105100407061: bảng bán kính – diện tích ─────
{
  const cols = [170, 96, 86, 86, 86]
  const { body, w, h } = bang(cols, [['Bán kính hình tròn', '15 dm', '20 cm', '15 m', '50 mm'], ['Diện tích hình tròn', '706,5 dm²', '', '', '']], 56, 19)
  await ra('T105100407061', w, h, body)
}

// ───── T105000000651: con thuyền trên lưới ô vuông 1 cm ─────
{
  const c = 36, ox = 1, oy = 1, W = 15 * c + 2, H = 9 * c + 2
  const Q = (x, y) => P(ox + x * c, oy + y * c)
  let b = ''
  for (let i = 0; i <= 15; i++) b += `<line x1="${ox + i * c}" y1="${oy}" x2="${ox + i * c}" y2="${oy + 9 * c}" stroke="#cfd0e0" stroke-width="1"/>`
  for (let j = 0; j <= 9; j++) b += `<line x1="${oy}" y1="${oy + j * c}" x2="${ox + 15 * c}" y2="${oy + j * c}" stroke="#cfd0e0" stroke-width="1"/>`
  const cam = [Q(4, 5), Q(7, 5), Q(7, 1)], do_ = [Q(8, 5), Q(11, 5), Q(8, 1)], thuyen = [Q(2, 5), Q(13, 5), Q(10, 8), Q(5, 8)]
  b += fill(cam, '#fbc58a') + fill(do_, '#f5a3a3') + fill(thuyen, '#8ad3f7') + poly(cam) + poly(do_) + poly(thuyen)
  // kiểm: cánh buồm đáy 3 cao 4; thân thuyền 11, 5, cao 3 (đơn vị ô)
  chk(7 - 4 === 3 && 5 - 1 === 4 && 11 - 8 === 3 && 13 - 2 === 11 && 10 - 5 === 5 && 8 - 5 === 3, 'thuyền')
  await ra('T105000000651', W, H, b)
}

// ───── T105000000686: mảnh đất ABCDE (hình thang ABCD + tam giác AED) ─────
{
  const s = 6, m = map(50, 190, s)
  const A = m(0, 0), D = m(55, 0), B = m(10, 25), C = m(40, 25), M = m(10, 0), N = m(35, 0), E = m(35, -27)
  chk(close(dist(B, C), 30 * s) && close(dist(A, D), 55 * s) && close(dist(B, M), 25 * s) && close(dist(E, N), 27 * s), 'kích thước')
  let b = fill([A, B, C, D, E], '#fdf1b8') + poly([A, B, C, D, E]) + segDash(B, M) + segDash(A, D) + segDash(N, E)
  b += rightAngle(M, B, D, 11) + rightAngle(N, E, D, 11)
  b += label(A, 'A', -20, 8) + label(B, 'B', 0, -12) + label(C, 'C', 0, -12) + label(D, 'D', 22, 8) + label(E, 'E', 0, 30) + label(M, 'M', -2, 26) + label(N, 'N', 0, -12)
  b += num(P((B.x + C.x) / 2, B.y), '30 m', 0, -12) + num(P(M.x, (B.y + M.y) / 2), '25 m', 32, 8) + num(P(N.x, (N.y + E.y) / 2), '27 m', -34, 8) + num(P(m(26, 0).x, A.y), '55 m', 0, 26)
  await ra('T105000000686', 430, 420, b)
}

// ───── T105000000691: mảnh đất ABCD (AEGD chữ nhật, hai tam giác vuông) ─────
{
  const s = 3.6, m = map(50, 364, s)
  const D = m(0, 0), G = m(72, 0), C = m(102, 0), A = m(0, 64), E = m(72, 64), B = m(72, 90)
  chk(close(dist(A, D), 64 * s) && close(dist(A, E), 72 * s) && close(dist(B, E), 26 * s) && close(dist(G, C), 30 * s) && close(dist(E, G), 64 * s) && close(dist(B, G), 90 * s), 'kích thước')
  let b = fill([A, B, C, D], '#e8d8a6') + poly([A, B, C, D]) + segDash(A, E) + segDash(B, G)
  b += rightAngle(E, A, B, 12) + rightAngle(G, C, E, 12)
  b += label(A, 'A', -20, 8) + label(B, 'B', 0, -12) + label(C, 'C', 20, 24) + label(D, 'D', -16, 28) + label(G, 'G', 0, 28) + label(E, 'E', 15, 26)
  await ra('T105000000691', 480, 430, b)
}

// ───── T105000000702: hình vuông 8 cm, hình tròn nội tiếp ─────
{
  const S = 300, x0 = 50, y0 = 60, O = P(x0 + S / 2, y0 + S / 2)
  const A = P(x0, y0), B = P(x0 + S, y0), C = P(x0 + S, y0 + S), D = P(x0, y0 + S)
  let b = fill([A, B, C, D], '#bfe3fa') + poly([A, B, C, D]) + `<circle cx="${O.x}" cy="${O.y}" r="${S / 2}" fill="#fff"/>` + dot(O)
  b += label(A, 'A', -22, -6) + label(B, 'B', 22, -6) + label(C, 'C', 22, 30) + label(D, 'D', -22, 30) + label(O, 'O', 0, 30) + num(P(O.x, y0), '8 cm', 0, -14)
  await ra('T105000000702', 400, 430, b)
}

// ───── T105000000705: sân vận động (chữ nhật 100 m + hai nửa hình tròn bán kính 70 m) ─────
{
  const s = 2, r = 70 * s, L = 100 * s, x0 = 30 + r, top = 50, bot = top + 2 * r, cy = top + r
  chk(2 * r === 140 * s, 'rộng = 2 × bán kính')
  const xl = x0, xr = x0 + L
  let b = `<path d="M ${xl} ${top} L ${xr} ${top} A ${r} ${r} 0 0 1 ${xr} ${bot} L ${xl} ${bot} A ${r} ${r} 0 0 1 ${xl} ${top} Z" fill="#fdf1a0"/>`
  b += seg(P(xl, top), P(xl, bot)) + seg(P(xr, top), P(xr, bot)) + dot(P(xl, cy)) + dot(P(xr, cy))
  const xs = xl + 36
  b += seg(P(xs, top), P(xs, cy)) + seg(P(xs - 16, cy), P(xs + 16, cy))
  b += num(P((xl + xr) / 2, top), '100 m', 0, -14) + num(P(xs, (top + cy) / 2), '70 m', 42, 8)
  await ra('T105000000705', 2 * r + L + 60, bot + 50, b)
}

// ───── T105000000711: giếng nước (miệng giếng r = 8 dm, thành rộng 3 dm) ─────
{
  const k = 17, R = 11 * k, r = 8 * k, cx = 210, cy = 210
  chk(R - r === 3 * k, 'thành 3 dm')
  let b = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#cbd5e1"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="#bfe6fb"/>` + dot(P(cx, cy))
  b += seg(P(cx, cy), P(cx + R, cy)) + num(P(cx + r / 2, cy), '8 dm', 0, -12) + num(P(cx + r + 1.5 * k, cy), '3 dm', 0, -12, 20)
  b += seg(P(cx + r, cy - 6), P(cx + r, cy + 6)) + seg(P(cx + R, cy - 6), P(cx + R, cy + 6))
  await ra('T105000000711', 420, 420, b)
}

// ───── T105000000726: hai mảnh hình thang khoét nửa hình tròn + mảnh tam giác ─────
{
  const k = 40, top = 4 * k, bas = 6 * k, h = 3.5 * k, rr = 1.5 * k
  chk(close(2 * rr, 3 * k) && close(h, 140), 'kích thước')
  const piece = (x0, y0, col) => {
    const off = (bas - top) / 2, cxm = x0 + bas / 2
    const Tl = P(x0 + off, y0), Tr = P(x0 + off + top, y0), Bl = P(x0, y0 + h), Br = P(x0 + bas, y0 + h)
    let b = `<path d="M ${Tl.x} ${Tl.y} L ${Tr.x} ${Tr.y} L ${Br.x} ${Br.y} L ${cxm + rr} ${Br.y} A ${rr} ${rr} 0 0 0 ${cxm - rr} ${Br.y} L ${Bl.x} ${Bl.y} Z" fill="${col}"/>`
    b += seg(Tl, Tr) + seg(Tr, Br) + seg(Br, P(cxm + rr, Br.y)) + `<path d="M ${cxm + rr} ${Br.y} A ${rr} ${rr} 0 0 0 ${cxm - rr} ${Br.y}"/>` + seg(P(cxm - rr, Br.y), Bl) + seg(Bl, Tl)
    const hx = x0 + 56
    b += segDash(P(hx, y0), P(hx, y0 + h))
    b += num(P((Tl.x + Tr.x) / 2, y0), '4 dm', 0, -12) + num(P(cxm, y0 + h), '6 dm', 0, 32) + num(P(hx + 46, y0 + h / 2 - 20), '3,5 dm', 0, 8) + num(P(cxm, y0 + h), '3 dm', 0, -14)
    return b
  }
  const y0 = 40, x1 = 20, x2 = x1 + bas + 40
  let b = piece(x1, y0, '#a9c7f7') + piece(x2, y0, '#f4a8a8')
  // mảnh vàng: tam giác đáy 1 dm (trên), cao 1 dm, đỉnh dưới
  const tx = x2 + bas + 50, ty = y0 + h / 2 - 22, Ta = P(tx, ty), Tb = P(tx + k, ty), Tc = P(tx + k / 2, ty + k)
  b += fill([Ta, Tb, Tc], '#fbe58a') + poly([Ta, Tb, Tc]) + segDash(P(tx + k / 2, ty), Tc) + num(P(tx + k / 2, ty), '1 dm', 0, -12) + num(P(tx + k + 6, ty + k / 2), '1 dm', 30, 8)
  await ra('T105000000726', tx + k + 60, y0 + h + 62, b)
}

// ───── T105000000727: một phần tư hình tròn bán kính 10 m ─────
{
  const R = 300, x0 = 50, yb = 40 + R, O = P(x0 + R, yb)
  let b = `<path d="M ${O.x} ${O.y} L ${x0} ${yb} A ${R} ${R} 0 0 1 ${O.x} ${yb - R} Z" fill="#bfe3fa"/>`
  b += seg(O, P(x0, yb)) + seg(O, P(O.x, yb - R)) + `<path d="M ${x0} ${yb} A ${R} ${R} 0 0 1 ${O.x} ${yb - R}"/>`
  const ay = yb + 30
  b += seg(P(x0, ay), P(O.x, ay)) + `<path d="M ${x0} ${ay} l 12 -5 l 0 10 Z M ${O.x} ${ay} l -12 -5 l 0 10 Z" fill="#222"/>` + num(P(x0 + R / 2, ay), '10 m', 0, 30)
  await ra('T105000000727', 400, 428, b)
}

// ───── T105000000748: mảnh đất ABCDE (hình thang ABCK + tam giác DEK) ─────
{
  const s = 12, m = map(40, 332, s)
  const A = m(0, 0), G = m(8, 0), H = m(20, 0), K = m(24, 0), E = m(36, 0), B = m(8, 24), C = m(16, 24), D = m(20, 12)
  chk(close(dist(B, C), 8 * s) && close(dist(A, G), 8 * s) && close(dist(G, H), 12 * s) && close(dist(H, K), 4 * s) && close(dist(K, E), 12 * s) && close(dist(B, G), 24 * s) && close(dist(D, H), 12 * s), 'kích thước')
  let b = poly([A, B, C, D, E]) + segDash(B, G) + segDash(D, H) + segDash(D, K) + rightAngle(G, A, B, 10) + rightAngle(H, G, D, 10)
  b += label(A, 'A', -18, 8) + label(G, 'G', 0, 30) + label(H, 'H', 0, 30) + label(K, 'K', 4, 30) + label(E, 'E', 16, 8) + label(B, 'B', -8, -12) + label(C, 'C', 8, -12) + label(D, 'D', 20, -8)
  b += num(P((B.x + C.x) / 2, B.y), '8 m', 0, -12, 20) + num(P((A.x + G.x) / 2, A.y), '8 m', 0, -10, 20) + num(P((G.x + H.x) / 2, A.y), '12 m', 0, -10, 20) + num(P(H.x + 22, A.y), '4 m', 0, -10, 18) + num(P((K.x + E.x) / 2 + 4, A.y), '12 m', 0, -10, 20)
  b += num(P(G.x, (G.y + B.y) / 2), '24 m', 34, 8, 20) + num(P(H.x, (H.y + D.y) / 2), '12 m', -26, 8, 20)
  await ra('T105000000748', 520, 420, b)
}

writeFileSync(OUT.replace(/[\\/]moi$/, '') + '/bao-cao.json', JSON.stringify([
  { ma_cau: 'T105100407061', ghi_chu: 'Bảng 2 hàng × 5 cột; cột mẫu 15 dm = 706,5 dm² giữ sẵn, ba ô còn lại để trống' },
  { ma_cau: 'T105000000651', ghi_chu: 'Con thuyền trên lưới ô 1 cm: 2 cánh buồm tam giác đáy 3 cao 4 (cam, đỏ nhạt), thân thang 11/5/cao 3 (xanh nhạt); đúng toạ độ ô như ảnh cũ' },
  { ma_cau: 'T105000000686', ghi_chu: 'Dựng theo số đề (BC 30, AD 55, BM 25, EN 27) tỉ lệ thật; đường AD/BM/EN nét đứt đen (ảnh cũ có đỏ); thêm ô vuông tại M, N (BM, EN là chiều cao)' },
  { ma_cau: 'T105000000691', ghi_chu: 'Dựng theo số đề (AD 64, AE 72, BE 26, GC 30) tỉ lệ thật (ảnh cũ lệch tỉ lệ); không ghi số đo như ảnh cũ (đề cho bằng chữ); AE, BG nét đứt, ô vuông tại E, G' },
  { ma_cau: 'T105000000702', ghi_chu: 'Hình vuông 8 cm, hình tròn nội tiếp, tô xanh nhạt phần ngoài hình tròn; bỏ đường kính đỏ của ảnh cũ (gợi ý lời giải), giữ tâm O' },
  { ma_cau: 'T105000000705', ghi_chu: 'Hình chữ nhật 100 m + hai nửa hình tròn bán kính 70 m (rộng = 140 m đúng tỉ lệ), 70 m ghi từ mép trên đến tâm như ảnh cũ' },
  { ma_cau: 'T105000000711', ghi_chu: 'Hai hình tròn đồng tâm bán kính 8 dm và 11 dm (thành 3 dm) đúng tỉ lệ; 8 dm ghi trên bán kính, 3 dm ghi trên bề rộng thành' },
  { ma_cau: 'T105000000726', ghi_chu: 'Hai hình thang cân đáy 4/6 dm cao 3,5 dm khoét nửa hình tròn d 3 dm ở giữa đáy lớn (xanh, đỏ nhạt) + tam giác đáy 1 dm cao 1 dm (vàng nhạt); thêm đường cao nét đứt; đề hỏi cm2 nhưng hình ghi dm (đúng đề)' },
  { ma_cau: 'T105000000727', ghi_chu: 'Một phần tư hình tròn bán kính 10 m, ghi 10 m dưới cạnh đáy bằng mũi tên hai đầu như ảnh cũ (ảnh cũ là ảnh chụp, vẽ lại dạng sơ đồ)' },
  { ma_cau: 'T105000000748', ghi_chu: 'Dựng đúng số đề (BC 8, BG 24, DH 12, AG 8, GH 12, HK 4, KE 12) tỉ lệ thật; BG, DH, DK nét đứt; ô vuông tại G, H' },
], null, 1))
writeFileSync(OUT.replace(/[\\/]moi$/, '') + '/khong-ve.json', '[]')
