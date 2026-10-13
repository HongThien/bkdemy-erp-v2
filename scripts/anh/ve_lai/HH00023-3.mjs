// Vẽ lại hình — gói HH00023-3 (Hai đường thẳng song song, Hình 7).
//   node scripts/anh/ve_lai/HH00023-3.mjs [<thu_muc_ra>]
// Mọi đường song song dựng cùng véc-tơ chỉ phương (nằm ngang); số đo ghi trên hình dựng bằng ray (assert ở cuối mỗi khối).
import { P, seg, dot, label, num, angleMark, rightAngle, ray, goc, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00023-3/moi'
const KHUNG = { pad: 40, padDuoi: 50 }
const gan = (v, d, ten) => console.assert(Math.abs(v - d) < 0.5, `${ten}: ${v.toFixed(2)} ≠ ${d}`)
const sd = (a) => Math.sin(a * Math.PI / 180)
const td = (a) => Math.tan(a * Math.PI / 180)

// ── HHC000715 / 716 / 717 — cùng một hình: a ∥ b (cùng ⊥ GK), cát tuyến HE; HEF = 120° (đề 715) ──
function hinhGK(ten) {
  const h = 120, G = P(0, 0), K = P(0, h), H = P(120, 0)
  const E = ray(H, 300, h / sd(60))          // HE tạo với a góc 60° ⇒ GHE = 120° = HEF
  const I = P(270, 0), F = P(300, h)
  const X0 = -70, X1 = 330
  const al = P(X0, 0), ar = P(X1, 0), bl = P(X0, h), br = P(X1, h)
  const D = ray(E, 300, 70), tD = ray(E, 300, 95), tH = ray(H, 120, 80)
  const vTop = P(0, -75), vBot = P(0, h + 80)
  gan(goc(E, H, F), 120, ten + ' HEF'); gan(goc(H, G, E), 120, ten + ' GHE')
  gan(goc(G, H, K), 90, ten + ' G'); gan(goc(K, G, E), 90, ten + ' K')
  hinh(ten, [al, ar, bl, br, vTop, vBot, tH, tD], [
    seg(al, ar), seg(bl, br), seg(vTop, vBot), seg(tH, tD),
    rightAngle(G, P(1, 0), P(0, 1), 16), rightAngle(K, P(0, h - 1), P(1, h), 16),
    dot(G), dot(H), dot(I), dot(K), dot(E), dot(F), dot(D),
    label(al, 'a', 10, -14), label(ar, 'l', -10, -14), label(bl, 'b', 10, -14),
    label(G, 'G', -20, -14), label(H, 'H', 16, -14), label(I, 'I', 0, -16),
    label(K, 'K', -20, -14), label(E, 'E', -20, 28), label(F, 'F', 10, 28), label(D, 'D', -20, 26)], KHUNG)
}
hinhGK('HHC000715')
hinhGK('HHC000716')
hinhGK('HHC000717')

// ── HHC000718 / 719 — mn ∥ xy, cát tuyến cd qua A (trên mn), B (trên xy); ABy = 60° ──
function hinhMn(ten) {
  const h = 130, B = P(0, 0), A = ray(B, 60, h / sd(60))
  const X0 = -150, X1 = 200
  const ml = P(X0, -h), nr = P(X1, -h), xl = P(X0, 0), yr = P(X1, 0)
  const d = ray(A, 60, 65), c = ray(B, 240, 85)
  gan(goc(B, A, yr), 60, ten + ' ABy'); gan(A.y, -h, ten + ' A'); gan(goc(A, ml, B), 60, ten + ' BAm')
  hinh(ten, [ml, nr, xl, yr, c, d], [
    seg(ml, nr), seg(xl, yr), seg(c, d), dot(A), dot(B),
    angleText(B, A, yr, '60°', 62),
    label(ml, 'm', -20, 8), label(nr, 'n', 20, 8), label(xl, 'x', -20, 8), label(yr, 'y', 20, 8),
    label(A, 'A', -22, -14), label(B, 'B', -20, -14), label(c, 'c', -10, 26), label(d, 'd', 14, -6)], KHUNG)
}
hinhMn('HHC000718')
hinhMn('HHC000719')

// ── HHC000720 và HHC000721+722 — cùng một hình: ab ∥ cd (cùng ⊥ mn / theo số đo), cát tuyến xy qua A, B; aAy = 135°, xBc = 45°, cd ⊥ mn tại C ──
function hinhAbCd(ten) {
  const h = 120, C = P(0, 0), A = P(150, -h), B = ray(A, 315, h / sd(45))
  const X0 = -65, X1 = 345
  const al = P(X0, -h), br = P(X1, -h), cl = P(X0, 0), dr = P(X1, 0)
  const mTop = P(0, -h - 62), nBot = P(0, 62)
  const x = ray(A, 135, 85), y = ray(B, 315, 85)
  const M = P(0, -h)  // ab cắt mn (điểm không có tên, giữ chấm như ảnh cũ)
  gan(B.y, 0, ten + ' B∈cd'); gan(goc(A, al, y), 135, ten + ' aAy'); gan(goc(B, x, cl), 45, ten + ' xBc')
  gan(goc(C, mTop, dr), 90, ten + ' C')
  hinh(ten, [al, br, cl, dr, mTop, nBot, x, y], [
    seg(al, br), seg(cl, dr), seg(mTop, nBot), seg(x, y),
    rightAngle(C, P(0, -1), P(1, 0), 16),
    dot(M), dot(A), dot(B), dot(C),
    angleText(A, al, y, '135°', 58), angleText(B, x, cl, '45°', 70),
    label(al, 'a', 12, -14), label(br, 'b', -12, -14), label(cl, 'c', 12, -14), label(dr, 'd', -12, -14),
    label(mTop, 'm', 18, 6), label(nBot, 'n', 18, 6),
    label(A, 'A', 20, -14), label(B, 'B', 20, -14), label(C, 'C', -20, -14),
    label(x, 'x', 16, -4), label(y, 'y', 4, 28)], KHUNG)
}
hinhAbCd('HHC000720')
hinhAbCd('HHC000721+HHC000722')

// ── HHC000723 — a ⊥ c, b ⊥ c ⇒ a ∥ b; cát tuyến qua A (trên a), B (trên b), ABx… góc 75° tại B, các góc 1-2-3-4 ──
{
  const h = 130, B = P(0, 0), A = ray(B, 75, h / sd(75))
  const X0 = -55, cx = 240, X1 = 350
  const al = P(X0, -h), ar = P(X1, -h), bl = P(X0, 0), br = P(X1, 0)
  const ca = P(cx, -h), cb = P(cx, 0), cTop = P(cx, -h - 70), cBot = P(cx, 70)
  const t1 = ray(A, 75, 64), t2 = ray(B, 255, 70)
  const bR = P(50, 0)
  gan(goc(B, bR, A), 75, '723 B 75°'); gan(A.y, -h, '723 A')
  // số 1-2-3-4: 1 phải-trên, 2 trái-trên, 3 trái-dưới, 4 phải-dưới (đặt lệch hẳn khỏi cát tuyến dốc)
  const q = (v, i, dx, dy) => num(P(v.x + dx, v.y + dy), String(i), 0, 8, 22)
  hinh('HHC000723', [al, ar, bl, br, cTop, cBot, t1, t2], [
    seg(al, ar), seg(bl, br), seg(cTop, cBot), seg(t2, t1),
    rightAngle(ca, P(cx - 1, -h), P(cx, -h + 1), 16), rightAngle(cb, P(cx - 1, 0), P(cx, 1), 16),
    dot(A), dot(B),
    angleMark(B, bR, A, 52),
    q(A, 1, 22, -18), q(A, 2, -24, -18), q(A, 3, -24, 18), q(A, 4, 22, 18),
    q(B, 1, 20, -14), q(B, 2, -24, -18), q(B, 3, -24, 18), q(B, 4, 24, 18),
    num(ray(B, 37.5, 84), '75°', 0, 8, 22),
    label(A, 'A', -36, -40), label(B, 'B', 4, 56),
    label(ar, 'a', -14, -12), label(br, 'b', -14, -12), label(cTop, 'c', 18, 6)], KHUNG)
}

await xuatTat(RA)
