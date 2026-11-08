// Vẽ lại hình — gói HH00140-1 (Ôn thi giữa kì I, Hình học 9). Luồng vẽ lại hình (Thùy 13/10).
//   node scripts/anh/ve_lai/HH00140-1.mjs [<thu_muc_ra>]
// Mỗi hình một khối { }; điểm dựng bằng số đo CỦA ĐỀ (ray/rot/mid/foot/inter…), không chép toạ độ ước mắt từ ảnh cũ.
import {
  P, seg, segDash, tick, angleMark, rightAngle, sector, fill, poly, ray, rot, mid, lerp, foot, inter, dist, goc,
  dot, label, num, bien, angleText, sideText, hinh, xuatTat,
} from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00140-1/moi'
const rad = (d) => d * Math.PI / 180
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)

// HHC003090 — hải đăng AC (vuông góc mặt biển, A chân đèn), hòn đảo B, góc B = 9°; AC = 80 m, AB = 80/tan9° ≈ 505 m.
// Đúng tỉ lệ thật, thu nhỏ: AB = 400px ⇒ AC = 400·tan9°.
{
  const AB = 320, AC = AB * Math.tan(rad(9))
  const A = P(0, 0), B = P(-AB, 0), C = P(0, -AC)
  ok(Math.abs(goc(B, A, C) - 9) < 0.01, '3090 góc B = 9°')
  hinh('HHC003090', [A, B, C, P(100, 0)], [
    seg(B, A), seg(B, C), seg(A, C), angleMark(B, A, C, 56),
    dot(A), dot(B), dot(C),
    num(P(B.x + 200, 0), '9°', 0, -6),
    label(B, 'B', -4, 28), label(A, 'A', 4, 32), label(C, 'C', 22, 2),
    num(P(A.x + 12, -AC * 0.5), 'Ngọn đèn', 54, 8),
  ])
}

// HHC003091_lg — Hình lời giải: tam giác ABC vuông tại A (AB < AC), O trung điểm BC; a ⊥ BC tại B, b ⊥ BC tại C;
// c ⊥ OA tại A cắt a, b tại M, N; D = OM∩AB; E = ON∩AC; F = AC∩a; I = OF∩AB; H = OM∩BN; T = BN∩AC.
{
  const R = 155, O = P(0, 0), B = P(-R, 0), C = P(R, 0)
  const A = ray(O, 127, R)                                  // A trên đường tròn đường kính BC ⇒ góc A vuông; AB < AC
  const up = (p) => P(p.x, p.y - 100)
  const c2 = rot(O, A, 90)                                  // c ⊥ OA tại A
  const M = inter(A, c2, B, up(B)), N = inter(A, c2, C, up(C))
  const F = inter(A, C, B, up(B))
  const D = inter(O, M, A, B), E = inter(O, N, A, C)
  const I = inter(O, F, A, B), H = inter(O, M, B, N), T = inter(B, N, A, C)
  ok(Math.abs(goc(A, B, C) - 90) < 0.01, '3091 góc A vuông')
  ok(dist(A, B) < dist(A, C), '3091 AB < AC')
  ok(Math.abs(goc(A, O, N) - 90) < 0.01 && Math.abs(goc(A, O, M) - 90) < 0.01, '3091 c ⊥ OA')
  ok(Math.abs(goc(D, A, O) - 90) < 0.01 && Math.abs(goc(E, A, O) - 90) < 0.01, '3091 ADOE chữ nhật (OM ⊥ AB, ON ⊥ AC)')
  ok(dist(A, M) - dist(B, M) < 0.01 && Math.abs(dist(A, N) - dist(C, N)) < 0.01, '3091 MA=MB, NA=NC')
  hinh('HHC003091_lg', [B, C, N, F, M, O, A], [
    seg(B, C), seg(B, F), seg(C, N),                         // BC, a (đến F), b (đến N)
    seg(M, N),                                              // c
    seg(F, C),                                              // F–A–T–E–C
    seg(B, N),                                              // B–H–T–N
    seg(A, B), seg(A, O),
    seg(M, O), seg(O, N), seg(F, O),
    rightAngle(B, C, F, 13), rightAngle(C, B, N, 13), rightAngle(A, B, C, 13),
    ...[A, B, C, O, M, N, F, D, E, I, H, T].map(dot),
    label(B, 'B', 0, 30), label(O, 'O', 0, 30), label(C, 'C', 0, 30), label(N, 'N', 24, 4),
    label(F, 'F', -22, 4), label(A, 'A', -4, -16), label(M, 'M', -24, 6),
    label(I, 'I', -22, 12), label(D, 'D', -13, 20), label(H, 'H', 6, 24),
    label(T, 'T', 8, -12), label(E, 'E', 18, 20),
  ], { pad: 42, padDuoi: 54 })
}

// HHC003092 — tấm nhôm tam giác đều ABC cạnh 40 cm; M ∈ AB, N ∈ AC, MN ∥ BC; Q, P chân đường vuông góc từ M, N xuống BC.
// Ảnh cũ chỉ tô tam giác MBQ. Chọn MB = 0,4·AB (đề hỏi tìm MB tối ưu ⇒ không vẽ đúng vị trí đáp án).
{
  const s = 330, B = P(0, 0), C = P(s, 0), A = ray(B, 60, s)
  const t = 0.4
  const M = lerp(B, A, t), N = lerp(C, A, t)
  const Q = foot(M, B, C), Pp = foot(N, B, C)
  ok(Math.abs(goc(A, B, C) - 60) < 0.01 && Math.abs(dist(A, B) - dist(A, C)) < 0.01, '3092 tam giác đều')
  ok(Math.abs(M.y - N.y) < 1e-6 && Math.abs(Q.x - M.x) < 1e-6 && Math.abs(Pp.x - N.x) < 1e-6, '3092 MNPQ chữ nhật')
  hinh('HHC003092', [A, B, C], [
    fill([B, M, Q], '#cfd3d9'),
    seg(A, B), seg(B, C), seg(C, A), seg(M, N), seg(M, Q), seg(N, Pp),
    ...[A, B, C, M, N, Q, Pp].map(dot),
    label(A, 'A', 0, -14), label(B, 'B', -16, 20), label(C, 'C', 16, 20),
    label(M, 'M', -20, -2), label(N, 'N', 20, -2), label(Q, 'Q', 0, 28), label(Pp, 'P', 0, 28),
  ])
}

// HHC003093 — tam giác DEF vuông tại D; ảnh cũ có cung đánh dấu góc E (không ghi số đo).
{
  const EF = 330, E = P(0, 0), F = P(EF, 0)
  const gE = 56                                              // góc E (đề không cho số: DF/DE ≈ 1,5 như ảnh cũ)
  const D = ray(E, gE, EF * Math.cos(rad(gE)))
  ok(Math.abs(goc(D, E, F) - 90) < 0.01, '3093 góc D vuông')
  hinh('HHC003093', [D, E, F], [
    seg(E, F), seg(E, D), seg(D, F), rightAngle(D, E, F, 14), angleMark(E, F, D, 38),
    ...[D, E, F].map(dot),
    label(D, 'D', 0, -14), label(E, 'E', -17, 14), label(F, 'F', 17, 14),
  ])
}

// HHC003094_de / _lg — sơ đồ tàu ngầm: C (tàu bắt đầu lặn, trên mặt biển), B (độ sâu 130 m), A (hình chiếu của B trên mặt biển), góc C = 30°.
function tauNgam(ten) {
  const CA = 280, AB = CA * Math.tan(rad(30))               // đúng tỉ lệ: AB/CA = tan30°
  const C = P(0, 0), A = P(CA, 0), B = P(CA, AB)
  ok(Math.abs(goc(C, A, B) - 30) < 0.01 && Math.abs(goc(A, C, B) - 90) < 0.01, '3094 góc C = 30°, góc A vuông')
  hinh(ten, [P(-40, 0), P(CA + 40, 0), B, P(CA + 100, 0)], [
    seg(P(-40, 0), P(CA + 40, 0)), seg(C, B), seg(A, B),
    rightAngle(A, C, B, 14), angleMark(C, A, B, 62),
    ...[A, B, C].map(dot),
    num(P(CA * 0.5, 0), 'mặt nước biển', 0, -16),
    num(P(C.x + 100, 0), '30°', 0, 28),
    num(P(A.x + 56, AB * 0.5), '130 m', 0, 8),
    label(C, 'C', -2, -16), label(A, 'A', 2, -16), label(B, 'B', 22, 26),
  ])
}
tauNgam('HHC003094_de')
tauNgam('HHC003094_lg')

// HHC003095_lg — tam giác ABC vuông tại A (AB = 2, BC = 4 ⇒ góc B = 60°, AC = 2√3); D ∈ tia BA với BD = 3 (ý c, ảnh cũ vẽ đúng tỉ lệ này);
// K = chân đường vuông góc hạ từ B xuống CD; H = CA ∩ BK (trực tâm tam giác BCD); E = DH ∩ BC.
{
  const u = 88
  const A = P(0, 0), B = P(2 * u, 0), C = P(0, -2 * Math.sqrt(3) * u), D = P(-1 * u, 0)
  ok(Math.abs(goc(B, A, C) - 60) < 0.01 && Math.abs(dist(B, C) - 4 * u) < 0.01, '3095 góc B = 60°, BC = 4')
  ok(Math.abs(dist(B, D) - 3 * u) < 0.01, '3095 BD = 3')
  const K = foot(B, C, D), H = inter(C, A, B, K), E = inter(D, H, B, C)
  ok(Math.abs(goc(K, B, C) - 90) < 0.01 && Math.abs(goc(E, D, B) - 90) < 0.01, '3095 BK ⊥ CD, DE ⊥ BC')
  hinh('HHC003095_lg', [D, B, C, K, E, H], [
    seg(D, B), seg(C, A), seg(C, D), seg(C, B), seg(B, K), seg(D, E),
    rightAngle(A, C, B, 13), rightAngle(K, C, B, 13),
    ...[A, B, C, D, K, H, E].map(dot),
    label(C, 'C', 0, -14), label(D, 'D', -17, 20), label(A, 'A', 0, 30), label(B, 'B', 17, 28),
    label(K, 'K', -18, 6), label(H, 'H', -17, -6), label(E, 'E', 20, 4),
  ], { pad: 42, padDuoi: 54 })
}

// HHC003096 — tam giác ABC vuông tại B: AB = 26 m (bóng tháp), BC = AB·tan30° (chiều cao tháp), góc A = 30°. Tháp thay bằng đoạn BC + chữ "Bảo tháp".
{
  const AB = 320, BC = AB * Math.tan(rad(30))
  const A = P(0, 0), B = P(AB, 0), C = P(AB, -BC)
  ok(Math.abs(goc(A, B, C) - 30) < 0.01, '3096 góc A = 30°')
  hinh('HHC003096', [A, B, C, P(AB + 90, 0)], [
    seg(A, B), seg(A, C), seg(B, C), angleMark(A, B, C, 56),
    ...[A, B, C].map(dot),
    angleText(A, B, C, '30°', 110),
    sideText(A, B, '26 m', C, 26),
    num(P(B.x + 8, -BC * 0.5), 'Bảo tháp', 46, 8),
    label(A, 'A', -4, 28), label(B, 'B', 12, 28), label(C, 'C', 4, -14),
  ])
}

await xuatTat(RA)
