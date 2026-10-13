// Vẽ lại hình — gói MH-1 (hình CẤU HÌNH của mô hình: MH.010 … MH.025, Luyện · hinh_mo_hinh.anh_cau_hinh). Thùy 13/10.
//   node scripts/anh/ve_lai/MH-1.mjs [<thu_muc_ra>]
// Ảnh cũ có gì giữ nấy; chỉ thêm ô vuông góc cho góc vuông giả thiết nêu rõ (AH ⊥ BC). Dựng điểm bằng foot/inter/mid, không ước mắt.
import { P, seg, tick, rightAngle, dot, label, labelOut, foot, inter, mid, bisector, goc, dist, trongTam, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/MH-1/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
/** Nhãn 'O' đặt giữa góc pOq (trên phân giác, cách O d px) — khỏi đè lên hai đường chéo */
const nhanO = (O, p, q, d = 32) => { const b = bisector(O, p, q, d); return label(b, 'O', 0, 9) }

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.010 — Tam giác ABC vuông ở A. Bộ điểm gốc chung với BT-MH010-1 (chung06): B trên A, C bên phải, AB : AC = 6 : 8.
// Ảnh cũ chỉ có tam giác + ô vuông ở A + nhãn A, B, C (không có H, D, … của các bài mượn) ⇒ vẽ đúng thế.
{
  const k = 36
  const A = P(0, 0), B = P(0, -6 * k), C = P(8 * k, 0)
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, 'A = 90°')
  ok(dist(A, B) < dist(A, C), 'AB < AC')
  hinh('MH.010', [A, B, C], [seg(A, B), seg(A, C), seg(B, C), rightAngle(A, B, C, 14),
    dot(A), dot(B), dot(C),
    label(B, 'B', 0, -14), label(A, 'A', -16, 28), label(C, 'C', 16, 28)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.011 — Tam giác ABC vuông ở A, đường cao AH (H ∈ BC). Cùng tam giác với BT-MH011-1 (AB : AC = 6 : 8, B trên, C phải).
// Ảnh cũ có ô vuông ở A, nhãn H phía trên-phải điểm H. Thêm: ô vuông ở H (AH ⊥ BC là giả thiết "đường cao").
{
  const s = 36
  const A = P(0, 0), B = P(0, -6 * s), C = P(8 * s, 0)
  const H = foot(A, B, C)
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, 'A = 90°')
  ok(Math.abs(goc(H, A, C) - 90) < 0.5, 'AH ⊥ BC')
  hinh('MH.011', [A, B, C, H], [seg(A, B), seg(A, C), seg(B, C), seg(A, H),
    rightAngle(A, B, C, 14), rightAngle(H, A, C, 12),
    dot(A), dot(B), dot(C), dot(H),
    label(B, 'B', 0, -14), label(A, 'A', -16, 28), label(C, 'C', 16, 28), label(H, 'H', 14, -12)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.020 — Tứ giác ABCD (tổng quát, lồi). Ảnh cũ có hai đường chéo AC, BD cắt nhau tại O ⇒ giữ (O không có trong giả thiết mô hình).
// Hướng như ảnh cũ và như các hình biến thể BV-MH020: A trên-trái, B trên-phải, C dưới-phải, D dưới-trái. Hình dạng đo từ ảnh cũ (không ràng buộc nào).
{
  const k = 0.62
  const A = P(140 * k, 128 * k), B = P(452 * k, 67 * k), C = P(637 * k, 377 * k), D = P(80 * k, 377 * k)
  const O = inter(A, C, B, D)
  const g = trongTam([A, B, C, D])
  hinh('MH.020', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    labelOut(A, 'A', g, 20), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22),
    nhanO(O, B, C, 34)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.021 — Hình thang ABCD, AB // CD (AB nhỏ trên, CD lớn dưới; thang thường — không cân, không vuông). Ảnh cũ có AC, BD cắt nhau tại O ⇒ giữ.
{
  const W = 346, H = 152, a = 38, ab = 154      // đo từ ảnh cũ (nhân 0,62): CD = 346, AB = 154, A lệch phải D 38px
  const D = P(0, H), C = P(W, H), A = P(a, 0), B = P(a + ab, 0)
  ok(Math.abs(A.y - B.y) < 1e-9 && Math.abs(D.y - C.y) < 1e-9, 'AB // CD')
  ok(Math.abs(dist(A, D) - dist(B, C)) > 20, 'không cân')
  const O = inter(A, C, B, D)
  const g = trongTam([A, B, C, D])
  hinh('MH.021', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    labelOut(A, 'A', g, 20), labelOut(B, 'B', g, 22), labelOut(C, 'C', g, 22), labelOut(D, 'D', g, 22),
    nhanO(O, B, C, 40)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.022 — Hình thang cân ABCD, AB // CD. Cùng thang(330, 62°, 180) với BT-MH022-1 (BT.08.022.02/.03). Ảnh cũ có AC, BD cắt nhau tại O ⇒ giữ.
{
  const D = P(0, 0), C = P(330, 0)
  const rad = (d) => d * Math.PI / 180
  const A = P(D.x + 180 * Math.cos(rad(62)), D.y - 180 * Math.sin(rad(62)))
  const B = P(C.x - 180 * Math.cos(rad(62)), C.y - 180 * Math.sin(rad(62)))
  ok(Math.abs(A.y - B.y) < 1e-6 && Math.abs(dist(A, D) - dist(B, C)) < 1e-6, 'thang cân')
  ok(Math.abs(dist(A, C) - dist(B, D)) < 1e-6, 'hai đường chéo bằng nhau')
  const O = inter(A, C, B, D)
  hinh('MH.022', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -16, -10), label(B, 'B', 16, -10), label(C, 'C', 16, 28), label(D, 'D', -16, 28),
    nhanO(O, B, C, 36)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.023 — Hình bình hành ABCD. Ảnh cũ chỉ có 4 đỉnh + 4 cạnh (không có đường chéo/O). Cùng hbh(lech, W, H) với BT-MH023-1:
// A trên-trái, B trên-phải, C dưới-phải, D dưới-trái (D lệch trái A). Tỉ lệ đo từ ảnh cũ (lệch ≈ 0,29·AB, cao ≈ 0,57·AB).
{
  const lech = 96, W = 330, H = 187
  const A = P(lech, 0), B = P(lech + W, 0), C = P(W, H), D = P(0, H)
  ok(Math.abs((B.x - A.x) - (C.x - D.x)) < 1e-9 && Math.abs(A.y - B.y) < 1e-9, 'AB // DC, AB = DC')
  ok(Math.abs(dist(A, B) - dist(A, D)) > 30 && Math.abs(goc(A, B, D) - 90) > 10, 'không phải thoi / chữ nhật')
  hinh('MH.023', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A),
    dot(A), dot(B), dot(C), dot(D),
    label(A, 'A', -12, -14), label(B, 'B', 12, -14), label(C, 'C', 12, 30), label(D, 'D', -12, 30)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.024 — Hình chữ nhật ABCD, AC cắt BD tại O. Ảnh cũ: hai đường chéo, O, và gạch kép trên cả 4 nửa đường chéo (OA = OB = OC = OD).
{
  const W = 270, H = 180
  const A = P(0, 0), B = P(W, 0), C = P(W, H), D = P(0, H)
  const O = inter(A, C, B, D)
  ok(Math.abs(goc(A, B, D) - 90) < 0.01 && dist(A, B) > dist(A, D), 'chữ nhật, không vuông')
  ok(dist(O, mid(A, C)) < 1e-6, 'O là trung điểm')
  hinh('MH.024', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    tick(A, O, 2), tick(B, O, 2), tick(C, O, 2), tick(D, O, 2),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', -14, -12), label(B, 'B', 14, -12), label(C, 'C', 14, 30), label(D, 'D', -14, 30),
    nhanO(O, B, C, 34)])
}

// ─────────────────────────────────────────────────────────────────────────────────────────
// MH.025 — Hình thoi ABCD, AC cắt BD tại O. Ảnh cũ: BD nằm ngang (dài, = 2·AC), AC thẳng đứng; ô vuông góc ở O (giữa OA và OB);
// gạch kép trên OA, OC; gạch đơn trên OB, OD. (Dấu chấm đỏ lạc cạnh B trên ảnh cũ là rác GeoGebra — không vẽ.)
{
  const A = P(0, -90), B = P(180, 0), C = P(0, 90), D = P(-180, 0), O = P(0, 0)
  ok(Math.abs(dist(A, B) - dist(B, C)) < 1e-6 && Math.abs(dist(B, C) - dist(C, D)) < 1e-6 && Math.abs(dist(C, D) - dist(D, A)) < 1e-6, 'bốn cạnh bằng nhau')
  ok(dist(A, C) !== dist(B, D), 'không vuông')
  hinh('MH.025', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D),
    rightAngle(O, A, B, 14), tick(A, O, 2), tick(O, C, 2), tick(D, O, 1), tick(O, B, 1),
    dot(A), dot(B), dot(C), dot(D), dot(O),
    label(A, 'A', 0, -14), label(B, 'B', 20, 8), label(C, 'C', 0, 34), label(D, 'D', -20, 8),
    nhanO(O, B, C, 34)])
}

await xuatTat(RA)
