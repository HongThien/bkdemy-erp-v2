// k5v-G29.mjs — Toán 5, chủ đề Diện tích các hình: vẽ lại 10 hình (khối hộp / lập phương / hình khai triển / bể).
//   node scripts/anh/ve_moi/k5v-G29.mjs "<thu_muc_goi>\moi"
import { P } from '../ve_hinh_lib.mjs'
import { txt, ra, baoCao } from './k5-HK2-chung.mjs'
const OUT = process.argv[2]
if (!OUT) { console.error('Dùng: node k5v-G29.mjs <thu_muc_moi>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } }
const f = (n) => Math.round(n * 100) / 100
const FR = '#ffffff', TP = '#f1f5fa', SD = '#dde6f0'
const DAM = '#4f8fcf', VUA = '#8fc0ec', NHAT = '#d4e8f8'

// chiếu xiên: x sang phải, y chiều sâu (lên-phải nếu kx>0), z lên
const pr = (ox, oy, s, kx = 0.5, ky = 0.35) => (x, y, z) => P(ox + x * s + y * s * kx, oy - z * s - y * s * ky)
const d = (pts) => 'M ' + pts.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L ') + ' Z'
const face = (pts, fl = FR) => `<path d="${d(pts)}" fill="${fl}" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
const ln = (a, b, extra = '') => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}" ${extra}/>`
const thin = (a, b) => ln(a, b, 'stroke-width="1.5"')
const dash = (a, b) => ln(a, b, 'stroke-dasharray="6 5"')
const T = (x, y, s, size = 20, anchor = 'middle') => txt(x, y + size * 0.34, s, size, anchor)
const arrowHead = (tip, from, h = 8) => {
  const dx = tip.x - from.x, dy = tip.y - from.y, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l
  const b = P(tip.x - ux * h, tip.y - uy * h)
  return `<path d="M ${f(tip.x)} ${f(tip.y)} L ${f(b.x - uy * h * 0.4)} ${f(b.y + ux * h * 0.4)} L ${f(b.x + uy * h * 0.4)} ${f(b.y - ux * h * 0.4)} Z" fill="#222" stroke="none"/>`
}
const dim2 = (a, b) => ln(a, b, 'stroke-width="1.5"') + arrowHead(a, b) + arrowHead(b, a)

// khối hộp 3 mặt thấy (trước, trên, phải); lưới đơn vị nếu grid
function hop(p, L, W, H, { grid = false, fills = [FR, TP, SD] } = {}) {
  let b = face([p(0, 0, 0), p(L, 0, 0), p(L, 0, H), p(0, 0, H)], fills[0])
  b += face([p(0, 0, H), p(L, 0, H), p(L, W, H), p(0, W, H)], fills[1])
  b += face([p(L, 0, 0), p(L, W, 0), p(L, W, H), p(L, 0, H)], fills[2])
  if (grid) {
    for (let i = 1; i < L; i++) b += thin(p(i, 0, 0), p(i, 0, H)) + thin(p(i, 0, H), p(i, W, H))
    for (let k = 1; k < H; k++) b += thin(p(0, 0, k), p(L, 0, k)) + thin(p(L, 0, k), p(L, W, k))
    for (let j = 1; j < W; j++) b += thin(p(0, j, H), p(L, j, H)) + thin(p(L, j, 0), p(L, j, H))
  }
  return b
}
const wBox = (L, W, s, kx = 0.5) => L * s + W * s * kx

// ─────────── T1050000001336: hình khai triển + 4 phương án hình lập phương ───────────
{
  const c = 52, ox = 246, oy = 20
  const cell = (i, j, col) => `<rect x="${ox + i * c}" y="${oy + j * c}" width="${c}" height="${c}" fill="${col}" stroke="#222" stroke-width="2"/>`
  let b = cell(1, 0, DAM) + cell(0, 1, VUA) + cell(1, 1, NHAT) + cell(2, 1, VUA) + cell(3, 1, NHAT) + cell(1, 2, DAM)
  const s = 60, slot = 175, yb = oy + 3 * c + 40 + 21 + s   // đáy mặt trước
  const opts = [['A.', DAM, DAM, NHAT], ['B.', NHAT, NHAT, NHAT], ['C.', NHAT, VUA, VUA], ['D.', VUA, NHAT, DAM]]  // trước, trái, trên
  opts.forEach(([ten, fr, tr, tp], i) => {
    const p = pr(slot * i + slot / 2 - 15 + 0, yb, s, -0.5)
    b += face([p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)], tp)
    b += face([p(0, 0, 0), p(0, 1, 0), p(0, 1, 1), p(0, 0, 1)], tr)
    b += face([p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)], fr)
    b += T(slot * i + slot / 2, yb + 32, ten, 24)
  })
  // kiểm: 3 cặp mặt đối diện cùng màu trên hình khai triển (ô trên/dưới, ô 1/3, ô 2/4 của hàng ngang)
  await ra(OUT, 'T1050000001336', 700, yb + 32 + 35, b)
}

// ─────────── T1050000001181: 3×3×3 hình lập phương nhỏ ───────────
{
  const s = 50, p = pr(40, 40 + 3 * s + 3 * s * 0.35, s)
  const b = hop(p, 3, 3, 3, { grid: true })
  await ra(OUT, 'T1050000001181', 40 + 3 * s + 3 * s * 0.5 + 40, Math.ceil(40 + 3 * s + 3 * s * 0.35 + 40), b)
}

// ─────────── T1050000001195: hình của Mai (3×3×2) và Rô-bốt (2×2×2) ───────────
{
  const s = 40, oy = 150
  const pm = pr(30, oy, s), prb = pr(300, oy, s)
  let b = hop(pm, 3, 3, 2, { grid: true }) + hop(prb, 2, 2, 2, { grid: true })
  b += T(30 + wBox(3, 3, s) / 2, oy + 36, 'Hình của Mai', 20)
  b += T(300 + wBox(2, 2, s) / 2, oy + 36, 'Hình của Rô-bốt', 20)
  await ra(OUT, 'T1050000001195', 470, oy + 36 + 35, b)
}

// ─────────── T1050000001198: bảng 2 cột — xúc xắc 3 cm, hộp kính 1,5 dm ───────────
{
  const cols = [220, 250, 250], r1 = 190, r2 = 60, x0 = 10, y0 = 10
  const W = x0 * 2 + 720, H = y0 * 2 + r1 + r2
  let b = ''
  let x = x0
  for (let j = 0; j < 3; j++) { b += `<rect x="${x}" y="${y0}" width="${cols[j]}" height="${r1}" fill="#fff" stroke="#222" stroke-width="2"/><rect x="${x}" y="${y0 + r1}" width="${cols[j]}" height="${r2}" fill="#fff" stroke="#222" stroke-width="2"/>`; x += cols[j] }
  b += T(x0 + 110, y0 + r1 / 2 - 14, 'Đồ vật dạng hình', 22) + T(x0 + 110, y0 + r1 / 2 + 14, 'lập phương', 22)
  b += T(x0 + 110, y0 + r1 + r2 / 2, 'Thể tích của đồ vật', 22)
  const s = 80
  // xúc xắc
  {
    const cx = x0 + 220, p = pr(cx + 45, y0 + r1 - 48, s)
    b += hop(p, 1, 1, 1)
    const pip = (q) => `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="4.5" fill="#222" stroke="none"/>`
    for (const u of [0.3, 0.7]) for (const v of [0.2, 0.5, 0.8]) b += pip(p(u, 0, v))
    for (const u of [0.3, 0.7]) for (const v of [0.3, 0.7]) b += pip(p(u, v, 1))
    b += pip(p(1, 0.3, 0.7)) + pip(p(1, 0.7, 0.3))
    b += T(p(1, 1, 0.5).x + 8, p(1, 1, 0.5).y, '3 cm', 20, 'start')
    b += T(cx + 45 + 60, y0 + r1 - 14, 'con xúc xắc', 18)
  }
  // hộp kính (cạnh nhìn xuyên: nét đứt cho cạnh khuất)
  {
    const cx = x0 + 470, p = pr(cx + 45, y0 + r1 - 48, s)
    b += face([p(0, 0, 0), p(1, 0, 0), p(1, 0, 1), p(0, 0, 1)], '#eaf4fb')
    b += face([p(0, 0, 1), p(1, 0, 1), p(1, 1, 1), p(0, 1, 1)], '#eaf4fb')
    b += face([p(1, 0, 0), p(1, 1, 0), p(1, 1, 1), p(1, 0, 1)], '#eaf4fb')
    b += dash(p(0, 1, 0), p(0, 1, 1)) + dash(p(0, 1, 0), p(1, 1, 0)) + dash(p(0, 0, 0), p(0, 1, 0))
    b += T(p(1, 1, 0.5).x + 8, p(1, 1, 0.5).y, '1,5 dm', 20, 'start')
    b += T(cx + 45 + 60, y0 + r1 - 14, 'hộp kính', 18)
  }
  await ra(OUT, 'T1050000001198', W, H + 8, b)
}

// ─────────── T1050000001188: khối ghép 6 hình hộp 10×5×2 (3 lớp, mỗi lớp 2 viên) ───────────
{
  const s = 22, p = pr(30, 40 + 6 * s + 10 * s * 0.35, s)
  // khối 10 × 10 × 6: 3 lớp cao 2; lớp 1 & 3 xếp dọc theo chiều dài (2 viên trước-sau), lớp 2 xếp xoay (2 viên cạnh nhau)
  let b = hop(p, 10, 10, 6)
  b += ln(p(0, 0, 2), p(10, 0, 2)) + ln(p(0, 0, 4), p(10, 0, 4))          // mạch ngang mặt trước
  b += ln(p(5, 0, 2), p(5, 0, 4))                                          // lớp giữa: 2 viên cạnh nhau ở mặt trước
  b += ln(p(10, 0, 2), p(10, 10, 2)) + ln(p(10, 0, 4), p(10, 10, 4))      // mạch ngang mặt phải
  b += ln(p(10, 5, 0), p(10, 5, 2)) + ln(p(10, 5, 4), p(10, 5, 6))        // lớp 1 & 3: chia ở y=5
  b += ln(p(0, 5, 6), p(10, 5, 6))                                         // mặt trên: lớp 3 chia đôi
  // kiểm số viên: 3 lớp × 2 viên, mỗi viên 10×5×2
  ok('6 viên × (10×5×2) = thể tích khối 10×10×6', 6 * 10 * 5 * 2 === 10 * 10 * 6)
  await ra(OUT, 'T1050000001188', Math.ceil(30 + wBox(10, 10, s) + 30), Math.ceil(40 + 6 * s + 10 * s * 0.35 + 36), b)
}

// ─────────── T1050000001190: khối gỗ chữ L ───────────
{
  const s = 28, oy = 40 + 8 * s + 5 * s * 0.35 + 6, p = pr(70, oy, s)
  let b = ''
  const sd = SD, tp = TP
  b += face([p(3, 0, 2), p(3, 5, 2), p(3, 5, 8), p(3, 0, 8)], sd)                         // mặt phải của phần đứng
  b += face([p(3, 0, 2), p(8, 0, 2), p(8, 5, 2), p(3, 5, 2)], tp)                          // mặt trên phần nằm
  b += face([p(8, 0, 0), p(8, 5, 0), p(8, 5, 2), p(8, 0, 2)], sd)                          // mặt phải phần nằm
  b += face([p(0, 0, 8), p(3, 0, 8), p(3, 5, 8), p(0, 5, 8)], tp)                          // mặt trên phần đứng
  b += face([p(0, 0, 0), p(8, 0, 0), p(8, 0, 2), p(3, 0, 2), p(3, 0, 8), p(0, 0, 8)], FR)  // mặt trước chữ L
  b += T(p(1.5, 0, 8).x - 4, p(1.5, 0, 8).y + 24, '3 cm', 20)
  b += T(p(0, 0, 4).x - 36, p(0, 0, 4).y, '8 cm', 20)
  b += T(p(3, 5, 5).x + 40, p(3, 5, 5).y, '6 cm', 20)
  b += T(p(5.5, 1.5, 2).x, p(5.5, 1.5, 2).y + 4, '5 cm', 20)
  b += T(p(4, 0, 0).x, p(4, 0, 0).y + 26, '8 cm', 20)
  b += T(p(8, 2.5, 0).x + 12, p(8, 2.5, 0).y + 24, '5 cm', 20, 'start')
  ok('chiều cao phần nằm 8-6=2', 8 - 6 === 2)
  await ra(OUT, 'T1050000001190', Math.ceil(70 + wBox(8, 5, s) + 70), Math.ceil(oy + 26 + 35), b)
}

// ─────────── T1050000001200: hình khai triển hộp 8 × 6 × 3 ───────────
{
  const s = 24, ox = 70, y0 = 100
  const R = (u, v, w, h) => `<rect x="${ox + u * s}" y="${y0 + v * s}" width="${w * s}" height="${h * s}" fill="#fff" stroke="#222" stroke-width="2"/>`
  let b = R(0, -3, 6, 3) + R(0, 0, 6, 8) + R(6, 0, 3, 8) + R(9, 0, 6, 8) + R(15, 0, 3, 8) + R(9, 8, 6, 3)
  b += dim2(P(ox + 9 * s, y0 - 18), P(ox + 15 * s, y0 - 18)) + T(ox + 12 * s, y0 - 36, '6 cm', 20)
  b += dim2(P(ox - 22, y0), P(ox - 22, y0 + 8 * s)) + `<text x="${ox - 40}" y="${y0 + 4 * s}" text-anchor="middle" fill="#111" stroke="none" font-family="'Times New Roman',Times,serif" font-size="20" transform="rotate(-90 ${ox - 40} ${y0 + 4 * s})">8 cm</text>`
  b += dim2(P(ox + 15 * s, y0 + 8 * s + 22), P(ox + 18 * s, y0 + 8 * s + 22)) + T(ox + 16.5 * s, y0 + 8 * s + 44, '3 cm', 20)
  ok('hộp 8×6×3: V=144', 8 * 6 * 3 === 144)
  await ra(OUT, 'T1050000001200', ox + 18 * s + 40, y0 + 8 * s + 44 + 36, b)
}

// ─────────── T1050000001203: hình khai triển trên lưới ô vuông 1 cm → hộp 6×3×3 ───────────
{
  const s = 24, ox = 20, oy = 60
  let b = ''
  for (let i = 0; i <= 18; i++) b += `<line x1="${ox + i * s}" y1="${oy}" x2="${ox + i * s}" y2="${oy + 9 * s}" stroke="#b9c0c8" stroke-width="1"/>`
  for (let j = 0; j <= 9; j++) b += `<line x1="${ox}" y1="${oy + j * s}" x2="${ox + 18 * s}" y2="${oy + j * s}" stroke="#b9c0c8" stroke-width="1"/>`
  const R = (u, v, w, h) => `<rect x="${ox + u * s}" y="${oy + v * s}" width="${w * s}" height="${h * s}" fill="none" stroke="#222" stroke-width="2.5"/>`
  b += R(0, 0, 6, 3) + R(0, 3, 6, 3) + R(6, 3, 3, 3) + R(9, 3, 6, 3) + R(15, 3, 3, 3) + R(9, 6, 6, 3)
  const ax = ox + 18 * s + 22, ay = oy + 4.5 * s
  b += ln(P(ax, ay), P(ax + 44, ay)) + arrowHead(P(ax + 44, ay), P(ax, ay))
  const pb = pr(ax + 64, ay + 36, 16)
  b += hop(pb, 6, 3, 3, { fills: [FR, FR, FR] })
  // chú thích ô: 1 cm ngang và 1 cm dọc
  const lx = ax + 64
  b += dim2(P(lx, 22), P(lx + s, 22)) + T(lx + s + 8, 22, '1 cm', 18, 'start')
  b += dim2(P(lx, 40), P(lx, 40 + s)) + T(lx + 10, 40 + s / 2, '1 cm', 18, 'start')
  ok('hộp 6×3×3: V=54', 6 * 3 * 3 === 54)
  await ra(OUT, 'T1050000001203', Math.ceil(lx + wBox(6, 3, 16) + 30), oy + 9 * s + 36, b)
}

// ─────────── T1050000001176: 3 bể cá không nắp ───────────
{
  const oy = 190
  const be = (ox, s, L, W, H, tL, tW, tH, tenBe) => {
    const p = pr(ox, oy, s)
    let b = face([p(0, 0, 0), p(L, 0, 0), p(L, 0, H), p(0, 0, H)], '#eaf4fb')
    b += face([p(L, 0, 0), p(L, W, 0), p(L, W, H), p(L, 0, H)], '#d6e9f6')
    b += `<path d="${d([p(0, 0, H), p(L, 0, H), p(L, W, H), p(0, W, H)])}" fill="none" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    b += dash(p(0, W, 0), p(0, W, H)) + dash(p(0, W, 0), p(L, W, 0)) + dash(p(0, 0, 0), p(0, W, 0))
    b += T(p(L / 2, 0, 0).x, p(L / 2, 0, 0).y + 26, tL, 20)
    b += T(p(L, W / 2, 0).x + 10, p(L, W / 2, 0).y + 26, tW, 20, 'start')
    b += T(p(L, W, H / 2).x + 8, p(L, W, H / 2).y, tH, 20, 'start')
    b += T(ox - 6, 38, tenBe, 24, 'start')
    return b
  }
  let b = be(24, 60, 2, 1, 1, '2 m', '1 m', '1 m', 'a)')
  b += be(225, 48, 2, 1, 2, '200 cm', '100 cm', '200 cm', 'b)')
  b += be(425, 14, 15, 4, 5, '15 dm', '4 dm', '5 dm', 'c)')
  await ra(OUT, 'T1050000001176', 740, oy + 26 + 35, b)
}

// ─────────── T1050000001191: bể nước trước / sau khi đặt tảng đá ───────────
{
  const s = 18, L = 10, W = 6, Hh = 5, oy = 40 + Hh * s + W * s * 0.35 + 6, W0 = 700
  const be = (ox, mực, đá) => {
    const p = pr(ox, oy, s)
    let b = ''
    // nước
    b += `<path d="${d([p(0, 0, 0), p(L, 0, 0), p(L, 0, mực), p(0, 0, mực)])}" fill="#bfe3f7" stroke="none"/>`
    b += `<path d="${d([p(L, 0, 0), p(L, W, 0), p(L, W, mực), p(L, 0, mực)])}" fill="#a9d6f0" stroke="none"/>`
    b += `<path d="${d([p(0, 0, mực), p(L, 0, mực), p(L, W, mực), p(0, W, mực)])}" fill="#d4ecfa" stroke="none"/>`
    // cạnh khuất
    b += dash(p(0, W, 0), p(0, W, Hh)) + dash(p(0, W, 0), p(L, W, 0)) + dash(p(0, 0, 0), p(0, W, 0))
    // cạnh thấy
    b += `<path d="${d([p(0, 0, 0), p(L, 0, 0), p(L, 0, Hh), p(0, 0, Hh)])}" fill="none" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    b += `<path d="${d([p(L, 0, 0), p(L, W, 0), p(L, W, Hh), p(L, 0, Hh)])}" fill="none" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    b += `<path d="${d([p(0, 0, Hh), p(L, 0, Hh), p(L, W, Hh), p(0, W, Hh)])}" fill="none" stroke="#222" stroke-width="2" stroke-linejoin="round"/>`
    b += ln(p(0, 0, mực), p(L, 0, mực), 'stroke="#5aa6d6" stroke-width="1.5"')
    if (đá) {
      const q = p(5, 2.2, 0)
      b += `<path d="M ${f(q.x - 34)} ${f(q.y)} C ${f(q.x - 40)} ${f(q.y - 36)} ${f(q.x - 8)} ${f(q.y - 56)} ${f(q.x + 14)} ${f(q.y - 50)} C ${f(q.x + 38)} ${f(q.y - 44)} ${f(q.x + 46)} ${f(q.y - 14)} ${f(q.x + 38)} ${f(q.y)} Z" fill="#8d8d8d" stroke="#222" stroke-width="2"/>`
      b += `<text x="${f(q.x + 2)}" y="${f(q.y - 20)}" text-anchor="middle" fill="#fff" stroke="none" font-family="'Times New Roman',Times,serif" font-size="15">tảng đá</text>`
    }
    // kích thước
    const a = p(0, 0, 0), t = p(0, 0, mực)
    b += dim2(P(a.x - 16, a.y), P(a.x - 16, t.y)) + T(a.x - 24, (a.y + t.y) / 2, `${mực} dm`, 20, 'end')
    b += T(p(L / 2, 0, 0).x, a.y + 26, '10 dm', 20)
    b += T(p(L, W / 2, 0).x + 10, p(L, W / 2, 0).y + 26, '6 dm', 20, 'start')
    return b
  }
  const b = be(70, 3, false) + be(410, 4, true)
  await ra(OUT, 'T1050000001191', W0, Math.ceil(oy + 26 + 35), b)
}

const mo = {
  T1050000001336: 'Hình khai triển chữ thập (ô trên/dưới xanh đậm; hàng ngang: vừa, nhạt, vừa, nhạt) + bốn hình lập phương A–D: A hai mặt đậm + nhạt; B ba mặt nhạt; C hai mặt vừa + nhạt; D ba màu khác nhau (đúng theo lời giải). Màu vẽ lại tự chọn 3 sắc xanh (ảnh cũ mờ, sắc chính xác không đọc được); phép gấp của A–C không ảnh hưởng đáp án.',
  T1050000001181: 'Hình lập phương 3×3×3 hình nhỏ, lưới trên 3 mặt thấy.',
  T1050000001195: 'Hình của Mai 3×3×2 và Rô-bốt 2×2×2 (lưới đơn vị) + nhãn dưới mỗi hình.',
  T1050000001198: 'Bảng 2 cột: xúc xắc (cạnh 3 cm, chấm tròn 6/4/2) và hộp kính (cạnh 1,5 dm, nét đứt cạnh khuất) — tranh cây trong hộp bỏ, thay bằng chữ tên vật; hàng "Thể tích của đồ vật" để trống.',
  T1050000001188: 'Khối 10×10×6 ghép 6 viên 10×5×2 (3 lớp; lớp giữa xoay 90°), mạch ghép đúng như ảnh cũ; kiểm 6×100 = 600.',
  T1050000001190: 'Khối chữ L: phần đứng rộng 3, cao 8; phần nằm dài 8, cao 2 (=8-6), dày 5; nhãn 3/8/6/5/8/5 cm như ảnh cũ (nhãn "5 cm" trên mặt phần nằm = 8-3).',
  T1050000001200: 'Hình khai triển: dải 6-3-6-3 cao 8 + nắp trên (6×3) và đáy dưới (6×3); nhãn 8, 6, 3 cm có mũi tên như ảnh cũ.',
  T1050000001203: 'Hình khai triển trên lưới 18×9 ô (dải 6-3-6-3 cao 3, hai nắp 6×3), mũi tên → hộp, chú thích ô 1 cm ngang/dọc.',
  T1050000001176: 'Ba bể không nắp a/b/c, tỉ lệ 2:1:1, 2:1:2, 15:4:5 (bể c dùng tỉ lệ nhỏ hơn); cá/san hô bỏ, giữ đủ số đo.',
  T1050000001191: 'Hai bể 10×6, nước 3 dm và 4 dm (chiều cao bể không cho — vẽ 5); tảng đá vẽ sơ đồ xám có chữ "tảng đá"; không ghi chiều dâng 1 dm.'
}
baoCao(OUT, Object.entries(mo).map(([ma_cau, ghi_chu]) => ({ ma_cau, ghi_chu })), [], null)
