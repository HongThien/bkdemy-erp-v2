// G03-HH00025.mjs — 6 hình đề cho bài HH00025 "Hình học" (khối 7), hình gắn vào BÀI (đủ dữ kiện dựng của mọi ý).
//   node scripts/anh/ve_moi/G03-HH00025.mjs "<gói>/moi"
import { P, seg, tick, angleMark, rightAngle, dot, label, hinh, xuatTat, dist, mid, foot, inter, bisector, goc, lerp, doiXung, reflect } from '../ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_moi/G03-HH00025.mjs <thu_muc_ra>'); process.exit(2) }
let nKiem = 0
const ok = (t, c) => { nKiem++; console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const eq = (a, b) => Math.abs(a - b) < 1e-6
const thang = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) < 1e-6
const vuong = (v, a, b) => Math.abs((a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y)) < 1e-6
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const pts = (...a) => a.map(dot).join('')
// p nằm giữa a và b (trên đoạn)
const giua = (a, p, b) => thang(a, p, b) && dist(a, p) + dist(p, b) - dist(a, b) < 1e-6
// M thuộc tia đối của tia OX (O giữa X và M)
const tiaDoi = (X, O, M) => thang(X, O, M) && giua(X, O, M)

// ── HHB000453: ABC; D trung điểm AC, E trung điểm AB; M ∈ tia đối DB, DM = DB; N ∈ tia đối EC, EN = EC.
//    Vẽ AM, AN (câu hỏi nêu), KHÔNG ký hiệu AM = BC, AM ∥ BC, A trung điểm MN. ──
{
  const A = P(130, 50), B = P(70, 210), C = P(280, 270)
  const D = mid(A, C), E = mid(A, B)
  const M = doiXung(B, D), N = doiXung(C, E)
  ok('453 ABC thường (ba cạnh đôi một khác nhau rõ)', Math.abs(dist(A, B) - dist(A, C)) > 40 && Math.abs(dist(A, B) - dist(B, C)) > 40 && Math.abs(dist(A, C) - dist(B, C)) > 40)
  ok('453 DA = DC', eq(dist(D, A), dist(D, C)))
  ok('453 EA = EB', eq(dist(E, A), dist(E, B)))
  ok('453 M thuộc tia đối của DB, DM = DB', tiaDoi(B, D, M) && eq(dist(D, M), dist(D, B)))
  ok('453 N thuộc tia đối của EC, EN = EC', tiaDoi(C, E, N) && eq(dist(E, N), dist(E, C)))
  ok('453 (kiểm, KHÔNG ký hiệu) AM = BC = AN', eq(dist(A, M), dist(B, C)) && eq(dist(A, N), dist(B, C)))
  ok('453 (kiểm, KHÔNG ký hiệu) AM ∥ BC, AN ∥ BC', song2(A, M, B, C) && song2(A, N, B, C))
  ok('453 (kiểm, KHÔNG ký hiệu) A trung điểm MN', eq(dist(A, M), dist(A, N)) && giua(M, A, N))
  hinh('HHB000453', [A, B, C, M, N, D, E], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, M), seg(C, N), seg(A, M), seg(A, N),
    tick(A, D, 1), tick(D, C, 1), tick(D, M, 2), tick(D, B, 2), tick(A, E, 3), tick(E, B, 3), tick(E, N, 4), tick(E, C, 4),
    pts(A, B, C, D, E, M, N),
    label(A, 'A', 4, -14), label(B, 'B', -14, 22), label(C, 'C', 16, 22), label(D, 'D', 24, 6), label(E, 'E', -18, 4),
    label(M, 'M', 16, -8), label(N, 'N', -14, -10),
  ])
}

// ── HHB000454: ABC vuông tại A; D ∈ BC bất kì; DH ⊥ AC (H ∈ AC); M ∈ tia đối HD, MH = HD; CM cắt BA tại K.
//    Vẽ AD (ý a), AM (ý c), kéo dài CM và BA tới K (ý d). KHÔNG ký hiệu ∠HDA = ∠BAD, CD = CM, △MCA = △DCA... ──
{
  const A = P(60, 190), B = P(60, 60), C = P(320, 190)
  const D = lerp(B, C, 0.4)
  const H = foot(D, A, C)
  const M = doiXung(D, H)
  const K = inter(C, M, A, B)
  ok('454 vuông tại A (AB ⊥ AC)', vuong(A, B, C))
  ok('454 AB ≠ AC rõ (không vuông cân)', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('454 D thuộc cạnh BC, khác B, C, không là trung điểm', giua(B, D, C) && dist(B, D) > 20 && dist(D, C) > 20 && Math.abs(dist(B, D) - dist(D, C)) > 40)
  ok('454 DH ⊥ AC, H ∈ AC', vuong(H, D, A) && giua(A, H, C))
  ok('454 M thuộc tia đối của HD, MH = HD', tiaDoi(D, H, M) && eq(dist(M, H), dist(H, D)))
  ok('454 K thuộc CM và BA', thang(C, M, K) && thang(B, A, K))
  ok('454 K thuộc tia đối của tia AB (A giữa B, K)', giua(B, A, K) && dist(A, K) > 20)
  ok('454 M nằm giữa K và C', giua(K, M, C))
  ok('454 (kiểm, KHÔNG ký hiệu) CD = CM, AD = AM', eq(dist(C, D), dist(C, M)) && eq(dist(A, D), dist(A, M)))
  ok('454 (kiểm, KHÔNG ký hiệu) ∠HDA = ∠BAD', eq(goc(D, H, A), goc(A, B, D)))
  ok('454 (kiểm, KHÔNG ký hiệu) ∠MKA = ∠DBA', eq(goc(K, M, A), goc(B, D, A)))
  hinh('HHB000454', [A, B, C, D, H, M, K], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, D), seg(D, M), seg(A, M), seg(C, K), seg(A, K),
    rightAngle(A, B, C, 16), rightAngle(H, D, C, 12),
    tick(H, D, 1), tick(H, M, 1),
    pts(A, B, C, D, H, M, K),
    label(A, 'A', -18, 4), label(B, 'B', 0, -14), label(C, 'C', 20, 8), label(D, 'D', 16, -10), label(H, 'H', 18, 26),
    label(M, 'M', 22, 16), label(K, 'K', -18, 20),
  ])
}

// ── HHB000455: ABC vuông tại A; M trung điểm BC; E ∈ tia đối MA, ME = MA. Vẽ CE (ý a, b nêu). KHÔNG ký hiệu AC ⊥ CE, BC = 2AM. ──
{
  const A = P(60, 200), B = P(60, 60), C = P(310, 200)
  const M = mid(B, C), E = doiXung(A, M)
  ok('455 vuông tại A', vuong(A, B, C))
  ok('455 AB ≠ AC rõ', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('455 MB = MC', eq(dist(M, B), dist(M, C)))
  ok('455 E thuộc tia đối của MA, ME = MA', tiaDoi(A, M, E) && eq(dist(M, E), dist(M, A)))
  ok('455 (kiểm, KHÔNG ký hiệu) AB = EC, AC ⊥ CE, BC = 2AM', eq(dist(A, B), dist(E, C)) && vuong(C, A, E) && eq(dist(B, C), 2 * dist(A, M)))
  hinh('HHB000455', [A, B, C, E, M], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, E), seg(C, E),
    rightAngle(A, B, C, 16),
    tick(B, M, 1), tick(M, C, 1), tick(A, M, 2), tick(M, E, 2),
    pts(A, B, C, E, M),
    label(A, 'A', -18, 8), label(B, 'B', -2, -14), label(C, 'C', 18, 22), label(E, 'E', 18, -6), label(M, 'M', -2, -14),
  ])
}

// ── HHB000456: ABC cân tại A; M trung điểm BC; H ∈ AB, K ∈ AC, AH = AK; I = HK ∩ AM.
//    Vẽ AM (ý a), HK (ý c); I. KHÔNG ô vuông AM ⊥ BC, AI ⊥ HK; KHÔNG ký hiệu HK ∥ BC, ∠BAM = ∠CAM. ──
{
  const A = P(190, 90), B = P(40, 250), C = P(340, 250)
  const M = mid(B, C)
  const H = lerp(A, B, 0.45), K = lerp(A, C, 0.45)
  const I = inter(H, K, A, M)
  ok('456 AB = AC (cân tại A)', eq(dist(A, B), dist(A, C)))
  ok('456 MB = MC', eq(dist(M, B), dist(M, C)))
  ok('456 H thuộc cạnh AB, K thuộc cạnh AC, AH = AK', giua(A, H, B) && giua(A, K, C) && eq(dist(A, H), dist(A, K)))
  ok('456 AH ≠ HB (H không là trung điểm)', Math.abs(dist(A, H) - dist(H, B)) > 15)
  ok('456 I thuộc HK và AM', thang(H, I, K) && thang(A, I, M) && giua(H, I, K))
  ok('456 (kiểm, KHÔNG ký hiệu) AM ⊥ BC, AI ⊥ HK, HK ∥ BC', vuong(M, A, B) && vuong(I, A, H) && song2(H, K, B, C))
  hinh('HHB000456', [A, B, C, M, H, K, I], [
    seg(A, B), seg(A, C), seg(B, C), seg(A, M), seg(H, K),
    angleMark(B, A, C, 34), angleMark(C, A, B, 34),
    tick(B, M, 1), tick(M, C, 1), tick(A, H, 2), tick(A, K, 2),
    pts(A, B, C, M, H, K, I),
    label(A, 'A', 4, -14), label(B, 'B', -14, 22), label(C, 'C', 16, 22), label(M, 'M', 0, 32),
    label(H, 'H', -18, 4), label(K, 'K', 18, 4), label(I, 'I', 16, -6),
  ])
}

// ── HHB000457+HHB000902: ABC (AB < AC); M trung điểm AC; D ∈ tia đối MB, MB = MD; CE ⊥ AD (E ∈ AD), AF ⊥ BC (F ∈ BC).
//    Vẽ CD, AD (ý a–c nêu). KHÔNG ký hiệu AB = CD, AD = CB, AD ∥ CB, DE = BF. ──
{
  const A = P(110, 80), B = P(40, 290), C = P(290, 290)
  const M = mid(A, C), D = doiXung(B, M)
  const E = foot(C, A, D), F = foot(A, B, C)
  ok('457 AB < AC rõ', dist(A, B) < dist(A, C) - 30)
  ok('457 ABC thường (BC khác AB, AC rõ)', Math.abs(dist(B, C) - dist(A, B)) > 20 && Math.abs(dist(B, C) - dist(A, C)) > 20)
  ok('457 MA = MC', eq(dist(M, A), dist(M, C)))
  ok('457 D thuộc tia đối của MB, MB = MD', tiaDoi(B, M, D) && eq(dist(M, B), dist(M, D)))
  ok('457 E ∈ AD, CE ⊥ AD', thang(A, E, D) && vuong(E, C, A))
  ok('457 F ∈ BC, AF ⊥ BC', thang(B, F, C) && vuong(F, A, B))
  ok('457 E nằm giữa A, D; F nằm giữa B, C (hình sạch)', giua(A, E, D) && giua(B, F, C))
  ok('457 E ≠ A, F ≠ B không sát nhau', dist(E, D) > 30 && dist(B, F) > 30)
  ok('457 (kiểm, KHÔNG ký hiệu) AB = CD, AD = CB, AD ∥ CB, DE = BF', eq(dist(A, B), dist(C, D)) && eq(dist(A, D), dist(C, B)) && song2(A, D, C, B) && eq(dist(D, E), dist(B, F)))
  hinh('HHB000457+HHB000902', [A, B, C, D, M, E, F], [
    seg(A, B), seg(B, C), seg(C, A), seg(B, D), seg(A, D), seg(C, D), seg(C, E), seg(A, F),
    rightAngle(E, C, D, 12), rightAngle(F, A, C, 12),
    tick(A, M, 1), tick(M, C, 1), tick(B, M, 2, 0.7), tick(M, D, 2, 0.3),
    pts(A, B, C, D, M, E, F),
    label(A, 'A', -14, -10), label(B, 'B', -14, 22), label(C, 'C', 18, 22), label(D, 'D', 16, -10),
    label(M, 'M', 4, 28), label(E, 'E', 2, -14), label(F, 'F', -14, 26),
  ])
}

// ── HHB000458+HHB000903: ABC vuông tại A; BD phân giác ∠ABC (D ∈ AC); E ∈ BC, BE = BA. Vẽ DE (ý a nêu).
//    KHÔNG ký hiệu DE = AD, DE ⊥ BC. ──
{
  const A = P(60, 320), B = P(60, 130), C = P(350, 320)
  const E = lerp(B, C, dist(B, A) / dist(B, C))
  const D = inter(B, bisector(B, A, C, 100), A, C)
  ok('458 vuông tại A (AB ⊥ AC)', vuong(A, B, C))
  ok('458 AB ≠ AC rõ (không vuông cân)', Math.abs(dist(A, B) - dist(A, C)) > 50)
  ok('458 D thuộc đoạn AC', D.y === 320 && D.x > A.x && D.x < C.x)
  ok('458 BD là phân giác (∠ABD = ∠DBC)', eq(goc(B, A, D), goc(B, D, C)))
  ok('458 E thuộc đoạn BC, BE = BA', giua(B, E, C) && eq(dist(B, E), dist(B, A)))
  ok('458 (kiểm, KHÔNG ký hiệu) DE = DA, DE ⊥ BC', eq(dist(D, E), dist(D, A)) && vuong(E, D, B))
  hinh('HHB000458+HHB000903', [A, B, C, D, E], [
    seg(A, B), seg(A, C), seg(B, C), seg(B, D), seg(D, E),
    rightAngle(A, B, C, 16),
    tick(B, A, 1), tick(B, E, 1),
    angleMark(B, A, D, 40), angleMark(B, D, E, 52),
    pts(A, B, C, D, E),
    label(A, 'A', -18, 8), label(B, 'B', 0, -14), label(C, 'C', 18, 22), label(D, 'D', -2, 32), label(E, 'E', 20, -6),
  ])
}

await xuatTat(dir)
console.log(`Đã chạy ${nKiem} phép kiểm.`)
