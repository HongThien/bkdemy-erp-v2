// Vẽ lại hình — gói HH00140-11 (Ôn thi giữa kì I, Hình học 9: hệ thức lượng trong tam giác vuông).
//   node scripts/anh/ve_lai/HH00140-11.mjs [<thu_muc_ra>]
// Quy ước: dựng điểm bằng số đo CỦA ĐỀ (ray/rot/foot/inter…), không chép toạ độ ước mắt từ ảnh cũ.
import { P, seg, segDash, rightAngle, angleMark, ray, dot, label, num, sideText, foot, inter, mid, lerp, goc, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-11/moi'
const rad = (d) => d * Math.PI / 180
const gan = (name, v, want, tol = 0.5) => console.assert(Math.abs(v - want) < tol, `${name}: ${v.toFixed(2)} ≠ ${want}`)

/** Mũi tên hai đầu (kích thước, "17 m") từ a đến b */
function mui2(a, b, L = 11, W = 4) {
  const l = dist(a, b), u = P((b.x - a.x) / l, (b.y - a.y) / l), n = P(-u.y, u.x)
  const head = (tip, d) => {
    const base = P(tip.x - d.x * L, tip.y - d.y * L)
    return `<path d="M ${tip.x} ${tip.y} L ${base.x + n.x * W} ${base.y + n.y * W} L ${base.x - n.x * W} ${base.y - n.y * W} Z" fill="#222" stroke="none"/>`
  }
  return seg(a, b) + head(a, P(-u.x, -u.y)) + head(b, u)
}

// HHC003174 — tháp AB cao 17 m; D, C, B thẳng hàng trên mặt đất; góc nâng ∠ADB = 30°, ∠ACB = 60° (ảnh cũ: tháp là tranh ⇒ vẽ đoạn AB)
{
  const k = 10, AB = 17 * k
  const B = P(0, 0), A = P(0, -AB)
  const C = P(-AB / Math.tan(rad(60)), 0), D = P(-AB / Math.tan(rad(30)), 0)
  gan('ACB', goc(C, A, B), 60); gan('ADB', goc(D, A, B), 30)
  const x1 = P(B.x + 46, A.y), x2 = P(B.x + 46, B.y)
  hinh('HHC003174', [A, B, C, D, P(B.x + 110, 0)], [
    seg(A, B), segDash(D, A), segDash(C, A), segDash(D, B),
    angleMark(D, B, A, 40, 2), angleMark(C, B, A, 24, 1),
    mui2(x1, x2), num(P(B.x + 46 + 36, (A.y + B.y) / 2 + 8), '17 m'),
    num(P(D.x + 84, D.y - 8), '30°'), num(P(C.x + 56, C.y - 10), '60°'),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', 0, -14), label(B, 'B', 4, 32), label(C, 'C', 0, 32), label(D, 'D', -4, 32)])
}

// HHC003175_lg — tam giác ABC vuông tại A, ∠C = 30°, BC = 20; AH ⊥ BC; HD ⊥ AB, HE ⊥ AC; M giữa E, C; AI ⊥ MB
{
  const BC = 380
  const B = P(0, 0), C = P(BC, 0)
  const A = ray(B, 60, BC / 2)                 // AB = BC·sin30° = BC/2, ∠B = 60°
  const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C)
  const M = lerp(A, C, 0.62)                    // giữa E và C (AE = AC/4)
  const I = foot(A, B, M)
  gan('A', goc(A, B, C), 90); gan('C', goc(C, A, B), 30); gan('AHB', goc(H, A, B), 90)
  gan('HDA', goc(D, H, A), 90); gan('HEA', goc(E, H, A), 90); gan('AIM', goc(I, A, M), 90)
  console.assert(dist(A, E) < dist(A, M) && dist(A, M) < dist(A, C), 'M phải nằm giữa E và C')
  hinh('HHC003175_lg', [A, B, C, H, D, E, M, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, D), seg(H, E), seg(B, M), seg(A, I),
    rightAngle(A, B, C, 13), rightAngle(H, A, B, 12), rightAngle(D, A, H, 11), rightAngle(E, A, H, 11), rightAngle(I, A, M, 11),
    dot(A), dot(B), dot(C), dot(H), dot(D), dot(E), dot(M), dot(I),
    label(A, 'A', 0, -16), label(B, 'B', -20, 28), label(C, 'C', 18, 28), label(H, 'H', 0, 36),
    label(D, 'D', -22, 6), label(E, 'E', 22, -8), label(M, 'M', 12, 34), label(I, 'I', 22, -12)])
}

// HHC003176 — tháp AB (A chân, B đỉnh), C đầu bóng; ∠C = 34°, AC = 8,6 m; h = chiều cao (ảnh cũ ghi h)
{
  const AC = 310
  const A = P(0, 0), C = P(-AC, 0), B = P(0, -AC * Math.tan(rad(34)))
  gan('C', goc(C, A, B), 34)
  const x1 = P(46, B.y), x2 = P(46, A.y)
  hinh('HHC003176', [B, A, C, P(90, 0)], [
    seg(A, B), segDash(C, A), segDash(C, B),
    angleMark(C, A, B, 56, 1), num(P(C.x + 102, C.y - 8), '34°'),
    mui2(x1, x2), label(P(46, (B.y + A.y) / 2), 'h', 20, 8),
    num(mid(C, A), '8,6 m', 0, 32),
    dot(A), dot(B), dot(C),
    label(B, 'B', 0, -14), label(A, 'A', 4, 32), label(C, 'C', -4, 32)])
}

// HHC003177_lg — ABC vuông tại A, AB = 6, AC = 8; AH ⊥ BC; HE ⊥ AB, HF ⊥ AC (ảnh cũ không ghi số đo)
{
  const s = 37.5
  const A = P(0, 0), B = P(6 * s, 0), C = P(0, -8 * s)
  const H = foot(A, B, C), E = foot(H, A, B), F = foot(H, A, C)
  gan('AHB', goc(H, A, B), 90); gan('HEA', goc(E, H, A), 90)
  hinh('HHC003177_lg', [A, B, C, H, E, F], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(H, E), seg(H, F),
    rightAngle(A, B, C, 13), rightAngle(E, A, H, 11), rightAngle(F, A, H, 11), rightAngle(H, A, B, 12),
    dot(A), dot(B), dot(C), dot(H), dot(E), dot(F),
    label(A, 'A', -20, 26), label(B, 'B', 18, 28), label(C, 'C', 0, -16),
    label(E, 'E', 2, 34), label(F, 'F', -24, 8), label(H, 'H', 24, -8)])
}

// HHC003178 — A, B, C: AB ⊥ AC (A, C hai bên bờ), AC = 50 m, ∠C = 62°
{
  const AC = 150
  const A = P(0, 0), C = P(AC, 0), B = P(0, -AC * Math.tan(rad(62)))
  gan('C', goc(C, A, B), 62)
  const L = P(-46, 0), R = P(AC + 46, 0)
  hinh('HHC003178', [B, A, C, L, R], [
    seg(L, R), segDash(A, B), segDash(B, C),
    rightAngle(A, B, C, 14), angleMark(C, A, B, 36, 1),
    num(P(C.x - 66, C.y - 14), '62°'), num(mid(A, C), '50 m', 0, 32),
    dot(A), dot(B), dot(C),
    label(B, 'B', 0, -14), label(A, 'A', -4, 32), label(C, 'C', 4, 32)])
}

// HHC003179_lg — MNP vuông tại M, MN = 9, MP = 12; MH ⊥ NP; HD ⊥ MN, HQ ⊥ MP (ảnh cũ ghi 9 cm, 12 cm)
{
  const s = 25
  const M = P(0, 0), N = P(0, -9 * s), Pp = P(12 * s, 0)
  const H = foot(M, N, Pp), D = foot(H, M, N), Q = foot(H, M, Pp)
  gan('MHP', goc(H, M, Pp), 90); gan('HDM', goc(D, H, M), 90)
  hinh('HHC003179_lg', [M, N, Pp, H, D, Q, P(-54, -100)], [
    seg(M, N), seg(M, Pp), seg(N, Pp), seg(M, H), seg(H, D), seg(H, Q),
    rightAngle(M, N, Pp, 13), rightAngle(D, M, H, 11), rightAngle(Q, M, H, 11), rightAngle(H, M, Pp, 12),
    sideText(M, N, '9 cm', Pp, 34), num(lerp(M, Pp, 0.64), '12 cm', 0, 32),
    dot(M), dot(N), dot(Pp), dot(H), dot(D), dot(Q),
    label(M, 'M', -20, 26), label(N, 'N', 0, -16), label(Pp, 'P', 18, 28),
    label(Q, 'Q', 0, 32), label(D, 'D', -22, 8), label(H, 'H', 24, -8)])
}

// HHC003180 — A nhà, B trường, C đỉnh dốc, CH ⊥ AB; AC = 150, ∠A = 6°, ∠B = 4° (vẽ ĐÚNG số đo nên tam giác rất dẹt)
{
  const AC = 150, k = 440 / 373.4
  const CH = AC * Math.sin(rad(6)), AH = AC * Math.cos(rad(6)), HB = CH / Math.tan(rad(4))
  const A = P(0, 0), H = P(AH * k, 0), C = P(AH * k, -CH * k), B = P((AH + HB) * k, 0)
  gan('A', goc(A, B, C), 6, 0.1); gan('B', goc(B, A, C), 4, 0.1)
  hinh('HHC003180', [A, B, C, H], [
    seg(A, B), seg(A, C), seg(B, C), seg(C, H),
    rightAngle(H, C, A, 10),
    angleMark(A, B, C, 80, 1), angleMark(B, A, C, 80, 1),
    num(P(A.x + 100, A.y + 26), '6°'), num(P(B.x - 100, B.y + 26), '4°'),
    dot(A), dot(B), dot(C), dot(H),
    label(A, 'A', -20, 8), label(B, 'B', 20, 8), label(C, 'C', 0, -16), label(H, 'H', 0, 34)], { pad: 42 })
}

// HHC003181_lg — ABC vuông tại A (AB < AC); M ∈ BC; BK ⊥ AM; CH ⊥ AM (H trên tia AM kéo dài). Dựng theo số đo ý a: AB = 4, ∠BAM = 65°, KM = 3,2
{
  const s = 44
  const A = P(0, 0), B = P(0, -4 * s)
  const AM = 4 * Math.cos(rad(65)) + 3.2              // AK + KM
  const M = ray(A, 25, AM * s)                         // ∠BAM = 65° ⇒ AM nghiêng 25° so với AC
  const C = inter(B, M, A, P(1, 0))
  const K = foot(B, A, M), H = foot(C, A, M)
  gan('BAM', goc(A, B, M), 65); gan('KM', dist(K, M) / s, 3.2, 0.01); gan('AKB', goc(K, A, B), 90); gan('AHC', goc(H, A, C), 90)
  console.assert(dist(A, B) < dist(A, C) && dist(A, K) < dist(A, M) && dist(A, M) < dist(A, H), 'thứ tự A-K-M-H, AB<AC')
  hinh('HHC003181_lg', [A, B, C, M, K, H], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, H), seg(B, K), seg(C, H),
    rightAngle(A, B, C, 14), rightAngle(K, B, M, 11), rightAngle(H, C, M, 11),
    dot(A), dot(B), dot(C), dot(M), dot(K), dot(H),
    label(B, 'B', -18, -6), label(A, 'A', -20, 26), label(C, 'C', 18, 30),
    label(M, 'M', 8, -16), label(K, 'K', -4, 32), label(H, 'H', 22, -6)])
}

await xuatTat(RA)
