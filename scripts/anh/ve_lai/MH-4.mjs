// Vẽ lại hình — gói MH-4 (hình CẤU HÌNH của mô hình · Luyện): MH.050 .051 .053 .057 .058 .061 .062 .063
//   node scripts/anh/ve_lai/MH-4.mjs [<thu_muc_ra>]
// Luật: ảnh cũ có gì giữ nấy; dùng chung bộ điểm gốc với hình bài toán đã vẽ lại của cùng mô hình
// (BT-MH051-1, BT-MH053-1, BT-MH058-1, BT-MH061-1, BT-MH062-1/2, BT-MH063-2).
import { P, seg, dot, label, labelOut, rightAngle, tick, angleMark, sector, poly, foot, mid, lerp, inter, rot, bisector, doiXung, goc, dist, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/MH-4/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const dd = (...p) => p.map(dot).join('')

// ───── MH.050 Vuông góc với đường chéo — hình bình hành ABCD, AH ⊥ BD, CK ⊥ BD (thứ tự D, H, K, B) ─────
// Ảnh cũ: AB, BC, CD, DA, đường chéo BD, AH, CK, ô vuông ở H và K; KHÔNG có AC, KHÔNG có O ⇒ không vẽ.
{
  const W = 310, lech = 90, Hh = 178
  const A = P(lech, 0), B = P(lech + W, 0), C = P(W, Hh), D = P(0, Hh)
  const H = foot(A, B, D), K = foot(C, B, D)
  ok(near(dist(A, B), dist(D, C)) && near(dist(A, D), dist(B, C)), 'ABCD hình bình hành')
  ok(Math.abs(goc(H, A, B) - 90) < 0.5 && Math.abs(goc(K, C, B) - 90) < 0.5, 'AH, CK ⊥ BD')
  ok(dist(D, H) < dist(D, K) && dist(K, B) < dist(H, B), 'thứ tự D, H, K, B')
  ok(Math.abs(goc(D, A, B) - 90) > 20 && !near(dist(A, B), dist(A, D), 5), 'không phải chữ nhật/thoi')
  hinh('MH.050', [A, B, C, D], [poly([A, B, C, D]), seg(B, D), seg(A, H), seg(C, K),
    rightAngle(H, A, B), rightAngle(K, C, B),
    dd(A, B, C, D, H, K),
    label(A, 'A', 0, -14), label(B, 'B', 12, -14), label(C, 'C', 4, 32), label(D, 'D', -6, 32),
    label(H, 'H', 8, 34), label(K, 'K', -6, -14)])
}

// ───── MH.051 Mô hình trực tâm — dùng NGUYÊN bộ điểm của BT-MH051-1 ─────
// Ảnh cũ: AB, AC, BC, AH, BH, CH, BI, CI, AI (nét liền). Không có HI, không có M ⇒ không vẽ (đó là của bài toán).
{
  const B = P(0, 215), C = P(310, 215), A = P(70, 8)
  const H = inter(A, foot(A, B, C), B, foot(B, A, C))
  const I = inter(B, rot(A, B, 90), C, rot(A, C, 90))
  ok(Math.abs(goc(B, A, I) - 90) < 0.01 && Math.abs(goc(C, A, I) - 90) < 0.01, 'BI ⊥ AB, CI ⊥ AC')
  ok(Math.abs((H.x - A.x) * (C.x - B.x) + (H.y - A.y) * (C.y - B.y)) < 1e-6, 'AH ⊥ BC')
  ok(Math.abs((H.x - B.x) * (C.x - A.x) + (H.y - B.y) * (C.y - A.y)) < 1e-6, 'BH ⊥ AC')
  ok(Math.abs((H.x - C.x) * (B.x - A.x) + (H.y - C.y) * (B.y - A.y)) < 1e-6, 'CH ⊥ AB')
  ok(goc(A, B, C) < 89 && goc(B, A, C) < 89 && goc(C, A, B) < 89, 'tam giác nhọn (H nằm trong)')
  hinh('MH.051', [A, B, C, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(B, H), seg(C, H), seg(B, I), seg(C, I), seg(A, I),
    dd(A, B, C, H, I),
    label(A, 'A', 0, -14), label(B, 'B', -14, 26), label(C, 'C', 16, 8), label(H, 'H', 16, -6), label(I, 'I', 0, 32)])
}

// ───── MH.053 Đường trung bình — dùng NGUYÊN bộ điểm của BT-MH053-1 (chỉ ABC, M, N; ảnh cũ không có K, không có gạch) ─────
{
  const B = P(0, 195), C = P(340, 195), A = P(97, 0)
  const M = mid(A, B), N = mid(A, C)
  ok(near(M.y, N.y), 'MN ∥ BC')
  hinh('MH.053', [A, B, C], [seg(A, B), seg(A, C), seg(B, C), seg(M, N), dd(A, B, C, M, N),
    label(A, 'A', 14, -12), label(B, 'B', -12, 28), label(C, 'C', 14, 28), label(M, 'M', -26, 4), label(N, 'N', 14, -10)])
}

// ───── MH.057 Tam giác vuông – Trung điểm cạnh huyền — ABC vuông tại A (AB : AC = 5 : 7, như ảnh cũ và BT-MH058-1), M trung điểm BC ─────
// Ảnh cũ: AB, AC, BC, AM, ô vuông ở A, hai gạch (||) ở BM và MC.
{
  const k = 50
  const A = P(0, 0), B = P(0, -5 * k), C = P(7 * k, 0)
  const M = mid(B, C), G = trongTam([A, B, C])
  ok(near(goc(A, B, C), 90, 0.01), 'A = 90°')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(near(dist(M, A), dist(M, B), 0.01), 'MA = MB = MC (hệ quả)')
  hinh('MH.057', [A, B, C, M], [seg(A, B), seg(A, C), seg(B, C), seg(A, M),
    tick(B, M, 2), tick(M, C, 2), rightAngle(A, B, C),
    dd(A, B, C, M),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26), labelOut(M, 'M', A, 26)])
}

// ───── MH.058 Tam giác vuông – Chân đường cao — NGUYÊN bộ điểm của BT-MH058-1 ─────
// Ảnh cũ: AB, AC, BC, AH, ô vuông ở A và ở H. Không có M, D, E ⇒ không vẽ.
{
  const k = 50
  const A = P(0, 0), B = P(0, -5 * k), C = P(7 * k, 0)
  const H = foot(A, B, C), G = trongTam([A, B, C])
  ok(near(goc(A, B, C), 90, 0.01), 'A = 90°')
  ok(near(goc(H, A, C), 90, 0.5), 'AH ⊥ BC')
  hinh('MH.058', [A, B, C, H], [seg(A, B), seg(A, C), seg(B, C), seg(A, H),
    rightAngle(A, B, C), rightAngle(H, A, C),
    dd(A, B, C, H),
    labelOut(A, 'A', G, 26), labelOut(B, 'B', G, 26), labelOut(C, 'C', G, 26), labelOut(H, 'H', A, 26)])
}

// ───── MH.061 Phân giác trong tam giác vuông — NGUYÊN bộ điểm của BT-MH061-1 ─────
// ABC vuông tại A (AB : AC = 1 : 2), BD phân giác góc B (D ∈ AC), E ∈ BC với BE = BA.
// Ảnh cũ: AB, AC, BC, BD, AE, DE; ô vuông ở A; quạt tô + cung ở B trải cả góc ABC (BD nằm trong quạt) ⇒ giữ.
{
  const A = P(0, 0), B = P(0, -120), C = P(240, 0)
  const E = lerp(B, C, dist(A, B) / dist(B, C))
  const D = inter(B, bisector(B, A, C), A, C)
  const G = trongTam([A, B, C])
  ok(near(goc(A, B, C), 90, 0.01), 'A = 90°')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  ok(near(dist(B, E), dist(B, A)), 'BE = BA')
  ok(near(goc(B, A, D), goc(B, E, D)) && near(goc(B, A, C), 2 * goc(B, A, D)), 'BD phân giác góc B')
  hinh('MH.061', [A, B, C, E, D], [
    sector(B, A, C, 30), angleMark(B, A, C, 30),
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(A, E), seg(D, E),
    rightAngle(A, B, C),
    dd(A, B, C, D, E),
    labelOut(B, 'B', G, 26), label(A, 'A', -22, 8), labelOut(C, 'C', G, 26),
    labelOut(E, 'E', A, 26), label(D, 'D', 0, 32)])
}

// ───── MH.062 Tam giác cân — NGUYÊN bộ điểm của BT-MH062-1/-2 (AB = AC, chiều cao = 2 × nửa đáy, như ảnh cũ) ─────
// Ảnh cũ: AB, AC, BC, AM (M ∈ BC, chân đường cao = trung điểm BC); không ô vuông, không gạch.
{
  const hb = 140, H = 2 * hb
  const A = P(0, -H), B = P(-hb, 0), C = P(hb, 0), M = P(0, 0)
  ok(near(dist(A, B), dist(A, C), 1e-9), 'AB = AC')
  ok(near(dist(A, B), dist(B, C), 5) === false, 'không đều')
  hinh('MH.062', [A, B, C, M], [seg(A, B), seg(A, C), seg(B, C), seg(A, M), dd(A, B, C, M),
    label(A, 'A', 0, -14), label(B, 'B', -14, -12), label(C, 'C', 16, -12), label(M, 'M', 0, 36)])
}

// ───── MH.063 Cụng đầu — NGUYÊN bộ điểm của BT-MH063-2 (k = 0.5) ─────
// ABC thường (AB < AC), M trung điểm BC, D trên tia đối MA với MD = MA.
// Ảnh cũ: AB, AC, BC (qua M), AD (qua M), CD. KHÔNG có BD (xem báo cáo).
{
  const k = 0.5
  const sc = (p) => P(p.x * k, p.y * k)
  const A = sc(P(187, 35)), B = sc(P(47, 316)), C = sc(P(470, 316))
  const M = mid(B, C), D = doiXung(A, M)
  ok(near(dist(M, A), dist(M, D)) && near(dist(A, M) + dist(M, D), dist(A, D)), 'D trên tia đối MA, MD = MA')
  ok(dist(A, B) < dist(A, C) && goc(A, B, C) > 20 && goc(B, A, C) < 85, 'tam giác thường')
  hinh('MH.063', [A, B, C, M, D], [seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(C, D), dd(A, B, C, M, D),
    label(A, 'A', 17, -8), label(B, 'B', -17, -8), label(C, 'C', 17, -8), label(M, 'M', 17, -8), label(D, 'D', 17, 28)])
}

await xuatTat(RA)
