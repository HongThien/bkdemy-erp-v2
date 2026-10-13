// Vẽ lại hình — gói CG-1 (hình LỜI GIẢI của cách giải, hinh_cach_giai.anh_loi_giai; 6 hình). Thùy 13/10.
//   node scripts/anh/ve_lai/CG-1.mjs [<thu_muc_ra>]
// Mỗi hình = hình ĐỀ của bài toán (bộ điểm gốc CHÉP từ tệp đã vẽ lại: BT-MH046-2 / BT-MH027-1 / BT-MH028-1 / BT-MH047-1)
// + đúng những đường phụ / điểm phụ mà ẢNH CŨ của cách giải có (luật "ảnh cũ có gì giữ nấy").
// Tên tệp ra = uuid cách giải (hinh_cach_giai.id).
import { P, seg, segDash, tick, angleMark, sector, rightAngle, ray, num, lerp, mid, foot, doiXung, inter, bisector, goc, dist,
  dot, label, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/CG-1/moi'
const ok = (v, e, ten) => console.assert(Math.abs(v - e) < 0.5, ten + ' lệch: ' + v + ' ≠ ' + e)

// ───────── BT.07.046.11 (25bbbefd) — đề hình của BT-MH046-2 + đường thẳng xy qua A song song BD, CE (đường phụ của lời giải) ─────────
{
  const H = 200, B = P(0, 0), C = P(0, H)
  const A = ray(B, 200, 137), D = P(220, 0), E = P(220, H)
  console.assert(dist(A, ray(C, 130, 200)) < 0.6, 'A không khớp')
  const Dt = P(220, -45), Et = P(220, H + 45)
  const xL = P(A.x - 55, A.y), yR = P(D.x + 66, A.y)
  ok(goc(B, A, D), 160, 'ABD'); ok(goc(C, A, E), 130, 'ACE'); ok(goc(A, B, C), 70, 'BAC')
  hinh('25bbbefd-5647-45ec-a03a-cc623cfdd9c9', [A, B, C, D, E, Dt, Et, xL, yR], [
    seg(xL, yR), seg(Dt, Et), seg(B, D), seg(C, E), seg(A, B), seg(A, C),
    rightAngle(D, B, Dt),
    dot(A), dot(B), dot(C), dot(D), dot(E),
    num(B, '160°', 34, 28), angleText(C, A, E, '130°', 50), angleText(A, B, C, '70°', 66),
    label(A, 'A', -26, 22), label(B, 'B', 0, -16), label(C, 'C', 0, 38), label(D, 'D', 18, 24), label(E, 'E', 20, 30),
    label(xL, 'x', -2, -12), label(yR, 'y', 0, -12)],
  { pad: 44, padDuoi: 50 })
}

// ───────── BT.07.046.12 (306e9868) — đề hình của BT-MH046-2 + đường thẳng xy qua B song song AM, CN ─────────
{
  const A = P(0, 0), B = ray(A, -22, 215)
  const C = P(B.x - 255 * Math.cos(32 * Math.PI / 180), B.y + 255 * Math.sin(32 * Math.PI / 180))
  const M = P(300, 0), N = P(300, C.y), Mt = P(300, -40), Nb = P(300, C.y + 40), X = P(342, 0), Y = P(342, C.y)
  const xL = P(-45, B.y), yR = P(356, B.y)
  ok(goc(A, M, B), 22, 'BAM'); ok(goc(C, N, B), 32, 'BCN'); ok(goc(B, A, C), 54, 'ABC')
  hinh('306e9868-0a76-4ad3-97d1-c49b17b7546a', [A, B, C, M, N, Mt, Nb, X, Y, xL, yR], [
    sector(A, M, B, 50), sector(C, N, B, 50), sector(B, A, C, 34),
    seg(A, X), seg(C, Y), seg(Mt, Nb), seg(A, B), seg(B, C), seg(xL, yR),
    angleMark(A, M, B, 50), angleMark(C, N, B, 50), angleMark(B, A, C, 34),
    rightAngle(M, A, Mt),
    dot(A), dot(B), dot(C), dot(M), dot(N),
    angleText(A, M, B, '22°', 108), angleText(C, N, B, '32°', 108), num(B, '54°', -68, -5),
    label(A, 'A', -26, 4), label(B, 'B', 26, -12), label(C, 'C', -26, 4), label(M, 'M', -24, 34), label(N, 'N', -24, 34),
    label(xL, 'x', 0, -12), label(yR, 'y', 0, -12)],
  { pad: 40, padDuoi: 48 })
}

// ───────── BT.08.027.01 (39019050) — đề hình của BT-MH027-1 + K = FI ∩ BC (FI kéo xuống K) ─────────
{
  const k = 0.62, S = (x, y) => P(x * k, y * k)
  const B = S(83, 452), C = S(425, 452), E = S(645, 452), F = S(272, 73)
  const A = lerp(F, B, 0.396), D = inter(A, E, F, C)
  const I = inter(F, bisector(F, B, C, 100), E, bisector(E, B, A, 100))
  const K = inter(F, I, B, E)
  console.assert(K.x > B.x && K.x < C.x, 'K nằm giữa B và C (như ảnh cũ)')
  hinh('39019050-2d22-4652-a138-85acca57e3b3', [A, B, C, D, E, F, I, K], [
    sector(F, A, D, 38), sector(E, D, C, 50),
    seg(F, B), seg(B, E), seg(F, C), seg(A, E), seg(F, K), seg(I, E),
    angleMark(F, A, D, 38, 1), angleMark(E, D, C, 44, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F), dot(I), dot(K),
    label(F, 'F', 16, -10), label(A, 'A', -16, -6), label(B, 'B', -4, 32), label(C, 'C', 4, 32),
    label(D, 'D', 16, -8), label(E, 'E', 16, -8), label(I, 'I', 14, -8), label(K, 'K', 0, 32)])
}

// ───────── BT.08.028.02 (20206b7a) — bộ điểm của BT-MH028-1 + CF ⊥ AD (F trên tia Dx), CE ⊥ AB (E ∈ AB) ─────────
{
  const S = 290, al = 39
  const A = P(0, 0), dirAC = -69.6
  const C = ray(A, dirAC, S)
  const r = 0.675 * S, H = S * Math.cos(al * Math.PI / 180), d = Math.sqrt(r * r - (S * Math.sin(al * Math.PI / 180)) ** 2)
  const D = ray(A, dirAC - al, H - d), B = ray(A, dirAC + al, H + d)
  console.assert(Math.abs(dist(C, D) - dist(C, B)) < 0.01 && Math.abs(goc(B, A, C) + goc(D, A, C) - 180) < 0.01, 'CB = CD, B + D = 180°')
  const F = foot(C, A, D), E = foot(C, A, B)
  console.assert(dist(A, F) > dist(A, D), 'F nằm ngoài đoạn AD, trên tia Dx')
  console.assert(dist(A, E) < dist(A, B), 'E nằm trên đoạn AB')
  hinh('20206b7a-02c2-4419-b089-e0fe99a23066', [A, B, C, D, E, F], [
    sector(D, C, F, 28), sector(B, C, E, 28),
    seg(A, B), seg(B, C), seg(C, D), seg(A, D), seg(D, F), seg(A, C), seg(C, E), seg(C, F),
    angleMark(D, C, F, 28), angleMark(B, C, E, 28),
    rightAngle(F, D, C, 12), rightAngle(E, A, C, 12),
    tick(C, D, 2), tick(C, B, 2),
    dot(A), dot(B), dot(C), dot(D), dot(E), dot(F),
    label(A, 'A', 0, -14), label(B, 'B', 24, 4), label(C, 'C', 0, 34), label(D, 'D', -24, 4), label(E, 'E', 18, -10), label(F, 'F', -22, 10)])
}

// ───────── BT.08.047.04 (57848fd3) — bộ điểm của BT-MH047-1 + đường chéo BD (lời giải dùng O' = trung điểm BD) ─────────
{
  const W = 310, LECH = 70, H = 190
  const A = P(LECH, 0), B = P(LECH + W, 0), C = P(W, H), D = P(0, H)
  const M = mid(A, B), N = mid(D, C), O = mid(A, C)
  console.assert(dist(O, mid(M, N)) < 1e-6 && dist(O, mid(B, D)) < 1e-6, 'O là tâm, thuộc MN và BD')
  hinh('57848fd3-cb30-465c-b14e-7032262fbe5e', [A, B, C, D], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(D, M), seg(N, B), segDash(M, N),
    tick(A, M, 2), tick(M, B, 2), tick(D, N, 2), tick(N, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N), dot(O),
    label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30),
    label(M, 'M', 0, -14), label(N, 'N', 0, 32), label(O, 'O', 36, 6)])
}

// ───────── BT.08.057.01 (471275c3) — tam giác ABC vuông tại A (như hình cấu hình MH.057), M trung điểm BC, D đối xứng A qua M ⇒ ABDC chữ nhật ─────────
{
  const s = 0.62
  const A = P(0, 0), B = P(0, -373 * s), C = P(520 * s, 0)
  const M = mid(B, C), D = doiXung(A, M)
  ok(goc(A, B, C), 90, 'A = 90°')
  console.assert(dist(M, A) === dist(M, D) || Math.abs(dist(M, A) - dist(M, D)) < 1e-9, 'MA = MD')
  hinh('471275c3-ad00-43cf-a4ff-51af5573f1b4', [A, B, C, D], [
    seg(A, B), seg(A, C), seg(B, D), seg(C, D), seg(B, C), seg(A, D),
    rightAngle(A, B, C), tick(B, M, 2), tick(M, C, 2),
    dot(A), dot(B), dot(C), dot(D), dot(M),
    label(A, 'A', -16, 30), label(B, 'B', -2, -14), label(C, 'C', 4, 34), label(D, 'D', 2, -14), label(M, 'M', 4, -14)])
}

await xuatTat(RA)
