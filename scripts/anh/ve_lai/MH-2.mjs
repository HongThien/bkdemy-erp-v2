// Vẽ lại hình — gói MH-2 (hình CẤU HÌNH của mô hình: MH.026, 029, 030, 031, 032, 038, 039, 040).
//   node scripts/anh/ve_lai/MH-2.mjs [<thu_muc_ra>]
// Bộ điểm gốc chép từ các tệp đã vẽ của cùng mô hình: BV-MH029-1 (tứ giác phân giác), BV-MH030-1 (tứ giác A = B, BC = AD),
// BV-MH031-1 / BT-MH032-1 / BV-MH032-1 (tia đối nhau), BT-MH038-1 / BV-MH039-1 (hai đường cắt nhau), BT-MH040-1 (phân giác).
import { P, seg, tick, angleMark, sector, ray, rot, inter, bisector, goc, dist, trongTam, dot, label, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/MH-2/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// ───────── MH.026 — Hình vuông ABCD. Ảnh cũ: A trên-trái, B trên-phải, C dưới-phải, D dưới-trái; không gạch, không ô vuông góc ─────────
{
  const s = 290
  const A = P(0, 0), B = P(s, 0), C = P(s, s), D = P(0, s)
  const G = trongTam([A, B, C, D])
  ok(Math.abs(dist(A, B) - dist(B, C)) < 0.01 && Math.abs(goc(A, B, D) - 90) < 0.01, 'ABCD hình vuông')
  hinh('MH.026', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    dot(A), dot(B), dot(C), dot(D),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26), labelOut(D, 'D', G, 26)])
}

// ───────── MH.029 — Tứ giác ABCD, I = giao hai tia phân giác của góc A (BAD) và góc B (ABC) ─────────
// Chép hàm dung() của BV-MH029-1. Số đo dựng theo ảnh cũ: D ≈ 68°, C ≈ 64°, A ≈ 93° ⇒ B = 135° (tứ giác lồi, thường)
{
  const dung = (gD, gC, gA, a, L = 360) => {
    const D = P(0, 0), C = P(L, 0)
    const A = ray(D, gD, a)
    const dirAB = rot(D, A, gA), dirCB = ray(C, 180 - gC, 100)
    const B = inter(A, dirAB, C, dirCB)
    const gB = 360 - gA - gC - gD
    ok(Math.abs(goc(D, A, C) - gD) < 0.3 && Math.abs(goc(C, B, D) - gC) < 0.3, 'góc D, C')
    ok(Math.abs(goc(A, D, B) - gA) < 0.3 && Math.abs(goc(B, A, C) - gB) < 0.3, 'góc A, B')
    const I = inter(A, bisector(A, D, B, 100), B, bisector(B, A, C, 100))
    ok(Math.abs(goc(A, D, I) - gA / 2) < 0.3 && Math.abs(goc(A, I, B) - gA / 2) < 0.3, 'AI phân giác góc A')
    ok(Math.abs(goc(B, A, I) - gB / 2) < 0.3, 'BI phân giác góc B')
    return { A, B, C, D, I }
  }
  const { A, B, C, D, I } = dung(68, 64, 93, 278)
  ok(B.y > A.y, 'B thấp hơn A (như ảnh cũ: B nằm dưới A một chút)')
  hinh('MH.029', [A, B, C, D, I], [
    sector(A, D, B, 30), sector(B, A, C, 30),
    seg(A, D), seg(D, C), seg(C, B), seg(B, A), seg(A, I), seg(B, I),
    angleMark(A, D, B, 30, 1), angleMark(B, A, C, 24, 2),
    dot(A), dot(B), dot(C), dot(D), dot(I),
    label(A, 'A', 6, -14), label(B, 'B', 14, -12), label(C, 'C', 12, 30), label(D, 'D', -10, 30), label(I, 'I', 0, 32)])
}

// ───────── MH.030 — Tứ giác ABCD có A = B và BC = AD (ảnh cũ: hai đường chéo AC, BD, cung ở A và B, hai gạch ở AD và BC) ─────────
// Chép dung() của BV-MH030-1: A, B cạnh trên; D, C cùng phía dưới; góc 117°; AD = BC (đề ép D, C đối xứng qua trung trực AB)
{
  const th = 117, L = 212
  const A = P(0, 0), B = P(190, 0)
  const D = ray(A, -th, L), C = ray(B, -(180 - th), L)
  ok(Math.abs(goc(A, B, D) - th) < 0.01 && Math.abs(goc(B, A, C) - th) < 0.01, 'A = B')
  ok(Math.abs(dist(A, D) - dist(B, C)) < 0.01, 'AD = BC')
  hinh('MH.030', [A, B, C, D], [sector(A, B, D, 30), sector(B, A, C, 30), angleMark(A, B, D, 30), angleMark(B, A, C, 30),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, B), seg(A, C), tick(A, D, 2), tick(B, C, 2),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -6, -14), label(B, 'B', 6, -14), label(C, 'C', 20, 24), label(D, 'D', -20, 24)])
}

// ───────── MH.031 — Hai tia đối nhau Ox, Oy; tia Oz nằm giữa. Ảnh cũ: x trái, y phải, z hướng xuống-trái; tô xám + cung góc xOz; KHÔNG ghi số ─────────
{
  const O = P(0, 0), X = ray(O, 180, 190), Y = ray(O, 0, 170), Z = ray(O, 240, 215)
  ok(Math.abs(goc(O, X, Y) - 180) < 0.01, 'Ox, Oy đối nhau')
  ok(Math.abs(goc(O, X, Z) - 60) < 0.01, 'xOz = 60° (ảnh cũ ≈ 62°; khớp BT.07.031.02)')
  hinh('MH.031', [X, Y, Z], [
    sector(O, X, Z, 46), seg(X, Y), seg(O, Z), angleMark(O, X, Z, 46), dot(O),
    label(O, 'O', 4, -16), label(X, 'x', -4, -14), label(Y, 'y', 4, -14), labelOut(Z, 'z', O, 22)])
}

// ───────── MH.032 — Ox, Oy đối nhau; Oz (trái) và Ot (phải) cùng nửa mặt phẳng trên. Ảnh cũ: KHÔNG số, KHÔNG cung ─────────
// Hướng như BT-MH032-1 (z trên-trái, t trên-phải); số đo không ghi, chọn xOz = 40°, tOy = 62° (zOt = 78°, không đặc biệt)
{
  const O = P(0, 0), X = ray(O, 180, 190), Y = ray(O, 0, 190), Z = ray(O, 180 - 40, 200), Tt = ray(O, 62, 195)
  ok(Math.abs(goc(O, X, Y) - 180) < 0.01, 'Ox, Oy đối nhau')
  ok(Math.abs(goc(O, X, Z) - 40) < 0.01 && Math.abs(goc(O, Y, Tt) - 62) < 0.01, 'xOz, tOy')
  hinh('MH.032', [X, Y, Z, Tt], [
    seg(X, Y), seg(O, Z), seg(O, Tt), dot(O),
    label(O, 'O', 0, 34), label(X, 'x', 0, 34), label(Y, 'y', 0, 34), labelOut(Z, 'z', O, 22), labelOut(Tt, 't', O, 22)])
}

// ───────── MH.038 — Ox, Ox′ đối nhau; Oy, Oy′ đối nhau. Ảnh cũ: x dưới-phải, x′ trên-trái, y trên-phải, y′ dưới-trái; không số, không cung ─────────
// Bộ điểm của BT-MH038-1: x ở −18°, y ở 47° (xOy = 65°)
{
  const O = P(0, 0), X = ray(O, -18, 190), X1 = ray(O, 162, 190), Y = ray(O, 47, 175), Y1 = ray(O, 227, 175)
  ok(Math.abs(goc(O, X, X1) - 180) < 0.01 && Math.abs(goc(O, Y, Y1) - 180) < 0.01, 'tia đối nhau')
  hinh('MH.038', [X, X1, Y, Y1], [
    seg(X1, X), seg(Y1, Y), dot(O),
    label(O, 'O', -14, -18), labelOut(X, 'x', O, 22), labelOut(X1, 'x′', O, 22), labelOut(Y, 'y', O, 22), labelOut(Y1, 'y′', O, 22)])
}

// ───────── MH.039 — như MH.038 + tia Oa. Ảnh cũ: x′x nằm ngang, y trên-phải (≈ 53°), y′ dưới-trái, a trên-trái (≈ 140°); không số ─────────
// Bộ điểm của BV-MH039-1
{
  const O = P(0, 0), X = ray(O, 0, 195), X1 = ray(O, 180, 195), Y = ray(O, 52, 175), Y1 = ray(O, 232, 175), a = ray(O, 139, 160)
  ok(Math.abs(goc(O, X, X1) - 180) < 0.01 && Math.abs(goc(O, Y, Y1) - 180) < 0.01, 'tia đối nhau')
  hinh('MH.039', [X, X1, Y, Y1, a], [
    seg(X1, X), seg(Y1, Y), seg(O, a), dot(O),
    label(O, 'O', 18, 30), labelOut(X, 'x', O, 22), labelOut(X1, 'x′', O, 22), labelOut(Y, 'y', O, 22), labelOut(Y1, 'y′', O, 22), labelOut(a, 'a', O, 22)])
}

// ───────── MH.040 — Góc xOy, Oz là tia phân giác. Ảnh cũ: ba tia CÓ MŨI TÊN, O bên trái, y trên, x dưới, z giữa;
// một cung quanh cả góc xOy, mỗi nửa cung có dấu "=" (hai gạch) báo xOz = zOy; không số ─────────
{
  const O = P(0, 0), a = 70, ax = -10                                 // xOy = 70° (như BT.07.040.01); x ở −10°, y ở 60°, z ở 25°
  const X = ray(O, ax, 255), Y = ray(O, ax + a, 270), Z = ray(O, ax + a / 2, 265)
  ok(Math.abs(goc(O, X, Y) - a) < 0.01, 'xOy')
  ok(Math.abs(goc(O, X, Z) - goc(O, Z, Y)) < 0.01, 'Oz phân giác')
  const r = 90
  // mũi tên đặc ở đầu tia
  const mui = (tip) => {
    const d = { x: (tip.x - O.x) / Math.hypot(tip.x - O.x, tip.y - O.y), y: (tip.y - O.y) / Math.hypot(tip.x - O.x, tip.y - O.y) }
    const b = P(tip.x - d.x * 16, tip.y - d.y * 16), n = P(-d.y * 5.5, d.x * 5.5)
    return `<path d="M ${tip.x} ${tip.y} L ${b.x + n.x} ${b.y + n.y} L ${b.x - n.x} ${b.y - n.y} Z" fill="#222" stroke="none"/>`
  }
  // hai gạch "=" cắt qua cung ở giữa mỗi nửa góc
  const gach = (ang) => [-1, 1].map((k) => { const aa = ang + k * (3.5 / r) * 180 / Math.PI; const p = ray(O, aa, r - 8), q = ray(O, aa, r + 8); return seg(p, q) }).join('')
  hinh('MH.040', [X, Y, Z, O], [
    seg(O, X), seg(O, Y), seg(O, Z), mui(X), mui(Y), mui(Z),
    angleMark(O, X, Y, r, 1), gach(ax + a / 4), gach(ax + 3 * a / 4),
    dot(O),
    label(O, 'O', -20, 24), labelOut(X, 'x', O, 24), labelOut(Y, 'y', O, 24), labelOut(Z, 'z', O, 24)])
}

await xuatTat(RA)
