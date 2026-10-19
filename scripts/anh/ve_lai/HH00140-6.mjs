// Vẽ lại hình — gói HH00140-6 (Ôn thi giữa kì I, Hình học 9).
//   node scripts/anh/ve_lai/HH00140-6.mjs [<thu_muc_ra>]
// Mỗi hình một khối { }; điểm dựng bằng số đo của ĐỀ (ray/foot/inter/mid…), kèm console.assert tự kiểm.
import { P, seg, segDash, tick, angleMark, rightAngle, ray, dot, label, num, bien, angleText, sideText,
  mid, foot, inter, lerp, add, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-6/moi'
const ok = (cond, msg) => { if (!cond) { console.error('✘ ASSERT:', msg); process.exitCode = 1 } }

// HHC003131_lg — cây tre gãy: tam giác OMN vuông tại O, MN = 8 m, góc N = 30° (hình lời giải)
{
  const N = P(0, 0), MN = 300
  const M = ray(N, 30, MN), O = P(M.x, 0)
  ok(Math.abs(goc(N, O, M) - 30) < 0.5, '131 góc N')
  ok(Math.abs(goc(O, N, M) - 90) < 0.5, '131 góc O')
  hinh('HHC003131_lg', [N, O, M], [seg(N, O), seg(O, M), seg(M, N), dot(N), dot(O), dot(M), rightAngle(O, N, M),
    angleMark(N, O, M, 56), angleText(N, O, M, '30°', 104),
    sideText(N, M, '8 m', O, 24),
    label(M, 'M', 0, -14), label(N, 'N', -4, 32), label(O, 'O', 4, 32)])
}

// HHC003132_lg — △ABC vuông tại A (AB = 4,5; AC = 6 ⇒ BC = 7,5), AH ⊥ BC, M trung điểm BC,
//   BE ⊥ AM tại E, BE ∩ AH = D, BE ∩ AC = F
{
  const k = 50, AB = 4.5 * k, BC = 7.5 * k
  const B = P(0, 0), C = P(BC, 0)
  const A = ray(B, Math.acos(AB / BC) * 180 / Math.PI, AB)
  const H = foot(A, B, C), M = mid(B, C)
  const E = foot(B, A, M)
  const D = inter(B, E, A, H), F = inter(B, E, A, C)
  ok(Math.abs(goc(A, B, C) - 90) < 0.5, '132 vuông A')
  ok(Math.abs(dist(A, C) - 6 * k) < 0.5, '132 AC')
  ok(Math.abs(goc(E, B, M) - 90) < 0.5, '132 BE⊥AM')
  ok(F.x > Math.min(A.x, C.x) && F.x < Math.max(A.x, C.x), '132 F trên đoạn AC')
  ok(D.y < 0 && D.y > A.y, '132 D trên đoạn AH')
  hinh('HHC003132_lg', [A, B, C, H, M, E, D, F],
    [seg(B, A), seg(A, C), seg(B, C), seg(A, H), seg(A, M), seg(B, F),
      dot(A), dot(B), dot(C), dot(H), dot(M), dot(E), dot(D), dot(F),
      rightAngle(A, B, C, 12), rightAngle(H, B, A, 12), rightAngle(E, B, M, 12),
      tick(B, M, 1), tick(M, C, 1),
      label(A, 'A', 0, -14), label(B, 'B', -14, 30), label(C, 'C', 14, 30), label(H, 'H', -8, 32), label(M, 'M', 12, 32),
      label(E, 'E', 14, -8), label(D, 'D', -16, 2), label(F, 'F', 16, -8)])
}

// HHC003133 — Bảo tháp: △ABC vuông tại B, AB = 26 m (bóng), góc A = 30°; BC là chiều cao tháp
{
  const A = P(0, 0), AB = 300
  const B = P(AB, 0), C = ray(A, 30, AB / Math.cos(30 * Math.PI / 180))
  ok(Math.abs(goc(A, B, C) - 30) < 0.5, '133 góc A')
  ok(Math.abs(goc(B, A, C) - 90) < 0.5, '133 vuông B')
  hinh('HHC003133', [A, B, C, P(B.x + 90, 0)], [seg(A, B), seg(B, C), seg(C, A), dot(A), dot(B), dot(C), rightAngle(B, A, C),
    angleMark(A, B, C, 52), angleText(A, B, C, '30°', 98),
    num(mid(A, B), '26 m', 0, 34),
    num(P(B.x + 52, C.y / 2), 'Bảo tháp', 0, 8),
    label(A, 'A', -14, 8), label(B, 'B', 16, 30), label(C, 'C', 14, -10)])
}

// HHC003134_lg — △ABC nhọn (AB > AC), BD ⊥ AC, CE ⊥ AB, BD ∩ CE = H, O trung điểm BC, M trên tia đối CB, CM = R = BC/2
//   Ảnh cũ dựng theo ý c: góc DBC = 30° ⇒ góc C = 60°; chọn góc B = 55° (⇒ A = 65°, AB > AC)
{
  const BC = 260, B = P(0, 0), C = P(BC, 0)
  const A = inter(B, ray(B, 55, 100), C, ray(C, 120, 100))
  const D = foot(B, A, C), E = foot(C, A, B), H = inter(B, D, C, E)
  const O = mid(B, C), M = lerp(B, C, 1.5)
  ok(Math.abs(goc(B, D, C) - 30) < 0.5, '134 góc DBC')
  ok(dist(A, B) > dist(A, C), '134 AB>AC')
  ok(goc(A, B, C) < 90 && goc(B, A, C) < 90 && goc(C, A, B) < 90, '134 nhọn')
  ok(Math.abs(dist(C, M) - dist(O, B)) < 0.5, '134 CM=R')
  hinh('HHC003134_lg', [A, B, C, M, D, E, H, O],
    [seg(B, A), seg(A, C), seg(B, M), seg(B, D), seg(C, E),
      dot(A), dot(B), dot(C), dot(M), dot(D), dot(E), dot(H), dot(O),
      rightAngle(E, B, H, 12), rightAngle(D, C, H, 12),
      label(A, 'A', 0, -14), label(B, 'B', -14, 30), label(C, 'C', 4, 32), label(M, 'M', 4, 32), label(O, 'O', 0, 32),
      label(E, 'E', -18, -4), label(D, 'D', 18, -6), label(H, 'H', 4, 34)])
}

// HHC003135 — cây: △ABC vuông tại A (gốc cây), AC = 7 m (bóng), góc C = 52°, AB = ? m
{
  const k = 32, A = P(0, 0), C = P(7 * k, 0)
  const B = P(0, -7 * k * Math.tan(52 * Math.PI / 180))
  ok(Math.abs(goc(C, A, B) - 52) < 0.5, '135 góc C')
  hinh('HHC003135', [A, B, C, P(-70, 0)], [seg(A, B), seg(A, C), seg(B, C), rightAngle(A, B, C, 12),
    angleMark(C, A, B, 36), angleText(C, A, B, '52°', 76),
    sideText(A, C, '7 m', B, 34),
    num(P(-34, B.y / 2), '? m', 0, 8),
    num(P(52, B.y / 2), 'Cây', 0, 8)])
}

// HHC003136 — toà tháp: △ABC vuông tại A (chân tháp, bên phải), AC = 8,6 m (bóng), góc C = 34° (bên trái, như ảnh cũ)
{
  const k = 38, A = P(0, 0), C = P(-8.6 * k, 0)
  const B = P(0, -8.6 * k * Math.tan(34 * Math.PI / 180))
  ok(Math.abs(goc(C, A, B) - 34) < 0.5, '136 góc C')
  hinh('HHC003136', [A, B, C, P(70, 0)], [seg(A, B), seg(A, C), seg(B, C), rightAngle(A, B, C, 12),
    angleMark(C, A, B, 42), angleText(C, A, B, '34°', 88),
    sideText(A, C, '8,6 m', B, 34),
    num(P(46, B.y / 2), 'Tháp', 0, 8)])
}

// HHC003137_lg — △ABC vuông tại A (AB < AC, góc B = 53°), AH ⊥ BC, BD phân giác (D ∈ AC), K = BD ∩ AH,
//   M hình chiếu của C trên BD, qua M kẻ ⊥ AC cắt BC tại I
{
  const k = 38, BC = 9.97 * k, B = P(0, 0), C = P(BC, 0)
  const A = ray(B, 53, BC * Math.cos(53 * Math.PI / 180))
  const H = foot(A, B, C)
  const Dd = P(0, 0)
  const dirD = ray(B, 53 / 2, 100)
  const D = inter(B, dirD, A, C), K = inter(B, D, A, H), M = foot(C, B, D)
  const I = inter(M, add(M, P(A.x - B.x, A.y - B.y)), B, C)
  ok(Math.abs(goc(B, A, C) - 53) < 0.5, '137 góc B')
  ok(dist(A, B) < dist(A, C), '137 AB<AC')
  ok(Math.abs(goc(A, B, C) - 90) < 0.5, '137 vuông A')
  ok(Math.abs(goc(M, B, C) - 90) < 0.5, '137 vuông M')
  ok(Math.abs(goc(D, A, B) - 90) < 90 && D.x > Math.min(A.x, C.x) && D.x < Math.max(A.x, C.x), '137 D trên AC')
  ok(Math.abs(goc(B, A, D) - goc(B, C, D)) < 0.5, '137 phân giác')
  ok(Math.abs(dist(I, B) - dist(I, C)) < 0.5, '137 I trung điểm (kiểm lại)')
  hinh('HHC003137_lg', [A, B, C, H, K, D, M, I],
    [seg(B, A), seg(A, C), seg(B, C), seg(A, H), seg(B, M), seg(M, C), seg(M, I),
      dot(A), dot(B), dot(C), dot(H), dot(K), dot(D), dot(M), dot(I),
      rightAngle(A, B, C, 12), rightAngle(H, C, A, 12), rightAngle(M, B, C, 12),
      angleMark(B, A, D, 44), angleMark(B, D, C, 70),
      label(A, 'A', 0, -14), label(B, 'B', -14, 30), label(C, 'C', 14, 30), label(H, 'H', -8, 32), label(I, 'I', 6, 32),
      label(K, 'K', -16, 2), label(D, 'D', -10, -14), label(M, 'M', 16, -12)])
}

// HHC003138 — ngọn núi: A, B, C thẳng hàng trên mặt đất, AB = 1000 m, DC ⊥ AC, góc A = 32°, góc B = 40°
{
  const AC = 310, A = P(0, 0), C = P(AC, 0)
  const h = AC * Math.tan(32 * Math.PI / 180), D = P(AC, -h)
  const BCl = h / Math.tan(40 * Math.PI / 180), B = P(AC - BCl, 0)
  ok(Math.abs(goc(A, C, D) - 32) < 0.5, '138 góc A')
  ok(Math.abs(goc(B, C, D) - 40) < 0.5, '138 góc B')
  ok(Math.abs(dist(A, B) / h - 1000 / 2447.495) < 0.01, '138 tỉ lệ AB:h')
  const chev = (a, b, t) => { // mũi tên nhỏ trên tia a→b tại t
    const p = lerp(a, b, t), L = dist(a, b), ux = (b.x - a.x) / L, uy = (b.y - a.y) / L, s = 11
    const r1 = P(p.x - (ux * Math.cos(0.45) - uy * Math.sin(0.45)) * s, p.y - (uy * Math.cos(0.45) + ux * Math.sin(0.45)) * s)
    const r2 = P(p.x - (ux * Math.cos(0.45) + uy * Math.sin(0.45)) * s, p.y - (uy * Math.cos(0.45) - ux * Math.sin(0.45)) * s)
    return seg(p, r1) + seg(p, r2)
  }
  const G0 = P(-34, 0), G1 = P(AC + 40, 0)
  let hatch = ''
  for (let x = G0.x + 4; x < G1.x; x += 12) hatch += seg(P(x, 0), P(x - 9, 10))
  hinh('HHC003138', [A, B, C, D, G0, G1, P(AC + 70, 0)],
    [seg(G0, G1), hatch, seg(A, D), seg(B, D), seg(C, D), dot(A), dot(B), dot(C), dot(D),
      chev(A, D, 0.55), chev(B, D, 0.5), rightAngle(C, B, D, 12),
      angleMark(A, C, D, 26), num(P(A.x + 58, -6), '32°', 0, 0, 20),
      angleMark(B, C, D, 30), angleText(B, C, D, '40°', 64, 20),
      num(mid(A, B), '1000 m', 0, 68),
      label(P(C.x, mid(C, D).y), 'h', -16, 6),
      num(P(C.x + 40, mid(C, D).y), 'Núi', 0, 8),
      label(A, 'A', -14, 34), label(B, 'B', 4, 34), label(C, 'C', 4, 34), label(D, 'D', 12, -10)], { padDuoi: 84 })
}

await xuatTat(RA)
