// BỘ KIỂM ĐÁP SỐ LÔ 11 (65 bài lớp 5 có hình) — viết TỪ ĐỀ + HÌNH, không xem lời giải soạn.
// Mỗi phần tử mảng = một giá trị BẮT BUỘC có trong đáp án; phần tử là MẢNG = các cách viết tương đương.
// pi = 3,14. Tính bằng phân số chính xác (BigInt), toạ độ + shoelace cho diện tích.
//
// ===== GHI CHÚ =====
// BỎ KHỎI LO11 (không có giá trị đặc trưng để so):
//   LT 20.16  câu hỏi so sánh (S_ACD = S_BCD ; S_AOD = S_BOC), không có đáp số số.
//   ON 97     đáp = tỉ số 1 (S_BEF = S_CDE, chứng minh được); chữ '1' khớp bừa mọi chuỗi nên không đưa vào.
// LT 19.7, LT 19.15: hình sách không đánh dấu vài điểm ⇒ CEO 09/10 tối chốt VIẾT LẠI ĐỀ nêu rõ dữ kiện từng ý ⇒ kiểm đủ các ý.
// GIỮ MỘT PHẦN:
//   ON 94     chỉ ý a) = 30. Ý b) BC : CF = 1 (Menelaus) — '1' khớp bừa nên không đưa.
// LƯU Ý ĐỀ/HÌNH LỆCH NHẸ (vẫn giữ vì đáp số duy nhất):
//   VD 18.2   đề ghi "AB = 36, M trên AB, CM = 9" nhưng hình: M nằm trên BC, AH ⟂ BC ⇒ thực chất BC = 36, CM = 9
//             (khớp lời "Bài làm" có sẵn trong đề: 108×2:9 = 24; 36×24:2 = 432). Đáp 432.
//   LT 19.1   đề "AE = 15, DC = 25" ⇒ EB = 10 (AB = DC = 25), hình khớp. Đáp 50.
// Các bài dùng điểm không ghi trong đề nhưng có trên hình (đọc từ dấu chấm chia đều): LT 19.5/19.6 (đường song song đáy),
//   LT 19.9, 19.10, 19.11, 19.14, 19.19, 19.20, 19.21, 19.22, 19.23, 19.27, 19.28, 19.29, 19.30, ON 91, ON 92, ON 95 — đều khớp văn bản đề.
// LT 21.5: AB = 8cm là cạnh hình vuông DEIH (nhãn "8cm" cạnh IH) ⇒ r(O) = 4; FB = 4cm ⇒ r(O') = 2; ABCD cạnh 8 + 4 = 12.
// ON 102: hình 1 = phần hình chữ nhật ngoài hai hình tròn, hình 2 = phần chung hai hình tròn nằm TRONG hình chữ nhật
//   ⇒ S(ABCD) = hai phần tư hình tròn bán kính 6 ⇒ CD = 3×3,14 = 9,42.
// ON 119: các mũi tên bị che bằng khối đen; hiểu là đi về nhà (từ kiến ở góc dưới trái → C → nhà ở góc trên phải).
// ON 120: đường đi chỉ xuống / sang phải trên lưới gạch (dựng đồ thị từ hình), loại đường qua C.
// ON 121: lưới 5 cột × 4 hàng, đi lên / sang trái, qua C(2,2) tính từ góc trên trái.
// ===================

class Fr {
  constructor(n, d = 1n) {
    n = BigInt(n); d = BigInt(d);
    if (d === 0n) throw new Error('chia 0');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n < 0n ? -n : n, d) || 1n;
    this.n = n / g; this.d = d / g;
  }
  add(o) { o = F(o); return new Fr(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = F(o); return new Fr(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = F(o); return new Fr(this.n * o.n, this.d * o.d); }
  div(o) { o = F(o); return new Fr(this.n * o.d, this.d * o.n); }
  neg() { return new Fr(-this.n, this.d); }
  abs() { return this.n < 0n ? this.neg() : this; }
  isZero() { return this.n === 0n; }
  eq(o) { o = F(o); return this.n === o.n && this.d === o.d; }
}
function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
function F(x, d) {
  if (x instanceof Fr) return x;
  if (d !== undefined) return new Fr(x, d);
  return new Fr(x, 1n);
}
const PI = new Fr(314, 100);

// ---- định dạng ----
function dec(f) { // số thập phân dấu phẩy; null nếu không hữu hạn
  let den = f.d, k = 0;
  let d2 = den; while (d2 % 2n === 0n) d2 /= 2n; while (d2 % 5n === 0n) d2 /= 5n;
  if (d2 !== 1n) return null;
  while (10n ** BigInt(k) % den !== 0n) k++;
  const scale = 10n ** BigInt(k);
  const neg = f.n < 0n, abs = neg ? -f.n : f.n;
  const val = abs * scale / den;
  const str = val.toString().padStart(k + 1, '0');
  const ip = str.slice(0, str.length - k), fp = k ? str.slice(str.length - k) : '';
  return (neg ? '-' : '') + ip + (fp ? ',' + fp : '');
}
function V(f) { // giá trị số: một phần tử cho LO11 (mảng tương đương nếu có nhiều cách viết)
  f = F(f);
  const out = [];
  const t = dec(f);
  if (f.d === 1n) { return f.n.toString(); }
  if (t) out.push(t, t.replace(',', '.'));
  out.push(`\\dfrac{${f.n}}{${f.d}}`, `${f.n}/${f.d}`);
  // hỗn số
  if (f.n > f.d) {
    const q = f.n / f.d, r = f.n % f.d;
    out.push(`${q}\\dfrac{${r}}{${f.d}}`);
  }
  return out;
}
function R(a, b) { return V(F(a, b)); } // tỉ số a/b

// ---- hình học (toạ độ phân số) ----
const P = (x, y) => [F(x), F(y)];
function shoelace(pts) {
  let s = F(0);
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
    s = s.add(x1.mul(y2)).sub(x2.mul(y1));
  }
  return s.abs().div(2);
}
function lerp(a, b, t) { t = F(t); return [a[0].add(b[0].sub(a[0]).mul(t)), a[1].add(b[1].sub(a[1]).mul(t))]; }
function inter(p1, p2, p3, p4) { // giao đường thẳng p1p2 với p3p4
  const [x1, y1] = p1, [x2, y2] = p2, [x3, y3] = p3, [x4, y4] = p4;
  const d = x1.sub(x2).mul(y3.sub(y4)).sub(y1.sub(y2).mul(x3.sub(x4)));
  const a = x1.mul(y2).sub(y1.mul(x2)), b = x3.mul(y4).sub(y3.mul(x4));
  const x = a.mul(x3.sub(x4)).sub(x1.sub(x2).mul(b)).div(d);
  const y = a.mul(y3.sub(y4)).sub(y1.sub(y2).mul(b)).div(d);
  return [x, y];
}
// Tam giác tham chiếu A(0,0) B(12,0) C(0,12) [affine ⇒ tỉ lệ diện tích giữ nguyên]; trả hàm đổi S_cho_trước → toạ độ
const TA = P(0, 0), TB = P(12, 0), TC = P(0, 12);
const SREF = shoelace([TA, TB, TC]); // 72
const tile = (S) => (poly) => shoelace(poly).div(SREF).mul(S); // diện tích đa giác theo S(ABC)=S

export const LO11 = {
  // ================= LÔ 11A =================
  'VD 18.2': () => [F(108).mul(2).div(9).mul(36).div(2).n.toString()], // 432
  'LT 18.5': () => [F(150).mul(2).div(25).n.toString()], // đáy NP = 12
  'LT 18.12': () => { // h = 27·2/9 = 6 ; S_AMC = 4·6/2
    const h = F(27).mul(2).div(9);
    return [V(F(4).mul(h).div(2))];
  },
  'VD 19.2': () => [V(F(18).div(3))], // S_AMC = 1/3 S_ABC = 6
  'VD 19.3': () => [R(1, 6)], // 1/6
  'LT 19.1': () => [V(F(25 - 15).mul(10).div(2))], // 50
  'LT 19.2': () => { // D(0,0) C(14,0) B(14,20) A(0,20); E trên BC: BE=8 ⇒ (14,12); G(9,0)
    const A = P(0, 20), E = P(14, 12), C = P(14, 0), G = P(9, 0);
    return [V(shoelace([A, E, C, G]))]; // 134
  },
  'LT 19.3': () => { // a) AEC : đáy EC=25, cao 28 ; b) hình thang ABCE
    const a = F(25).mul(28).div(2);
    const b = F(50 + 25).mul(28).div(2);
    return [V(a), V(b)]; // 350, 1050
  },
  'LT 19.4': () => [V(F(90).sub(35).sub(F(2, 5).mul(35)))], // 41
  'LT 19.5': () => [V(F(20).div(F(1).sub(F(1, 9)).sub(F(5, 9))))], // 60
  'LT 19.6': () => { // S2 = S - S1 = 5/6 S ; S2 - S1 = 4/6 S = 60
    return [V(F(60).div(F(5, 6).sub(F(1, 6))))]; // 90
  },
  // ĐỀ VIẾT LẠI (CEO 09/10 tối) nêu rõ dữ kiện từng ý ⇒ kiểm đủ: a) BM = MC ⇒ 1/2, 1/2 ; b) AM = 2MB ⇒ 2/3, 1/3 ;
  // c) AM = 2/5 AC: S1 = BMC = 3/5, S2 = ABM = 2/5 ; d) CN = 1/3 BC (N ngoài BC): S1 = ACN = 1/3, S_ANB = 4/3.
  'LT 19.7': () => [R(1, 2), R(2, 3), R(1, 3), R(3, 5), R(2, 5), R(4, 3)],
  'LT 19.9': () => [V(F(24).mul(4).div(3))], // 32
  'LT 19.10': () => { // M trung điểm BC ⇒ S = 2·15 = 30 ; AN = 2/5 AC
    const S = F(15).mul(2);
    return [V(S), V(S.mul(F(2, 5)))]; // 30, 12
  },
  'LT 19.11': () => [V(F(72).mul(F(2, 3)).div(2))], // S_ACM = 2/3·72 = 48 ; S_ACN = 24
  'LT 19.13': () => { // S_BNP = 1/3 · 1/2 · 1/2 S
    return [V(F(9).div(F(1, 3).mul(F(1, 2)).mul(F(1, 2))))]; // 108
  },
  'LT 19.14': () => [V(F(108).mul(F(1, 4)).mul(F(1, 3)))], // 9
  // ĐỀ VIẾT LẠI (CEO 09/10 tối): a) AM = 1/2 AB, AN = 2/3 AC ⇒ 1/3, 2/3 ; b) CM = 1/3 CA, CN = 3/5 CB ⇒ 1/5, 4/5 ;
  // c) BM = 1/2 BA, BN = 3/5 BC ⇒ 3/10, 7/10 ; d) AM = 1/2 AB, AN = 4/3 AC ⇒ S_AMN/S = 2/3.
  'LT 19.15': () => [R(1, 3), R(2, 3), R(1, 5), R(4, 5), R(3, 10), R(7, 10)],
  'LT 19.18': () => [V(F(7).div(F(1, 2).mul(F(1, 3))))], // 42
  'LT 19.19': () => { // S_NMPB = S_ABP − S_AMN = 2/3 S − 1/6 S = 1/2 S
    return [V(F(21).div(F(2, 3).sub(F(1, 2).mul(F(1, 3)))))]; // 42
  },
  'LT 19.20': () => { // S1 = 1/9 S ; S2 = 4/9 − 1/9 = 3/9 ; S2−S1 = 2/9 S = 14
    return [V(F(14).div(F(4, 9).sub(F(1, 9)).sub(F(1, 9))))]; // 63
  },
  'LT 19.21': () => { // S1 = AMP, S2 = MBNP, S3 = PNC
    const S = F(320);
    const s1 = S.mul(F(1, 4)).mul(F(1, 2));
    const s3 = S.mul(F(3, 5)).mul(F(1, 2));
    return [V(s1), V(S.sub(s1).sub(s3)), V(s3)]; // 40, 184, 96
  },
  'LT 19.22': () => {
    const S = F(180);
    const s1 = S.mul(F(1, 4)).mul(F(2, 3));
    const s3 = S.mul(F(1, 3)).mul(F(1, 2));
    return [V(s1), V(S.sub(s1).sub(s3)), V(s3)]; // 30, 120, 30
  },
  'LT 19.23': () => { // S1 = APM = 3/4·2/5 S = 36
    const S = F(36).div(F(3, 4).mul(F(2, 5)));
    const s2 = S.mul(F(1, 4)).mul(F(2, 3));
    const s3 = S.mul(F(1, 3)).mul(F(3, 5));
    return [V(S.sub(36).sub(s2).sub(s3))]; // S4 = 40
  },
  'LT 19.24': () => [[...R(1, 2), '0,5']], // S_ABI / S_ACI = BD / DC = 1/2
  'LT 19.26': () => { // A(0,0) B(12,0) C(0,12); E mid BC; I mid AE; D = BI ∩ AC
    const E = lerp(TB, TC, F(1, 2)), I = lerp(TA, E, F(1, 2));
    const D = inter(TB, I, TA, TC);
    return [V(tile(168)([TA, I, D]))]; // 14
  },
  'LT 19.27': () => { // M mid BC ; N: AN = 1/3 AC ; O = AM ∩ BN ; S_AON = 5
    const M = lerp(TB, TC, F(1, 2)), N = lerp(TA, TC, F(1, 3));
    const O = inter(TA, M, TB, N);
    const frac = shoelace([TA, O, N]).div(SREF); // S_AON / S
    return [V(F(5).div(frac))]; // 60
  },
  'LT 19.28': () => { // AM = MB ; CN = 2AN ; O = BN ∩ CM ; S_OBC = 32
    const M = lerp(TA, TB, F(1, 2)), N = lerp(TA, TC, F(1, 3));
    const O = inter(TB, N, TC, M);
    const frac = shoelace([O, TB, TC]).div(SREF);
    return [V(F(32).div(frac))]; // 80
  },
  'LT 19.29': () => { // M mid AB ; BN = 1/3 NC ⇒ BN = 1/4 BC ; I = AN ∩ CM ; S_MBNI
    const M = lerp(TA, TB, F(1, 2)), N = lerp(TB, TC, F(1, 4));
    const I = inter(TA, N, TC, M);
    return [V(tile(280)([M, TB, N, I]))]; // 50
  },
  'LT 19.30': () => { // BM = MC ; CN = 3NA ⇒ AN = 1/4 AC ; E = MN ∩ BA (E ngoài đoạn BA, sau A)
    const M = lerp(TB, TC, F(1, 2)), N = lerp(TA, TC, F(1, 4));
    const E = inter(M, N, TA, TB);
    return [V(tile(232)([TA, N, E]))]; // 29
  },

  // ================= LÔ 11B =================
  'VD 20.1': () => [V(F(185, 10).add(25).mul(F(124, 10)).div(2)), V(F(1025, 100).add(F(155, 10)).mul(10).div(2))], // 269,7 ; 128,75
  'LT 20.9': () => { // AB=5, MB=3 ⇒ AM=2 ; AMCD: (2+10)·h/2 = 24 ⇒ h=4 ; ABCD = (5+10)·4/2
    const h = F(24).mul(2).div(F(2).add(10));
    return [V(F(5).add(10).mul(h).div(2))]; // 30
  },
  'LT 20.17': () => { // S_AOD=10 ; S_DOC = 4·10 ; S_BOC = S_AOD ; S_AOB = S_AOD/4
    const aod = F(10), doc = aod.mul(F(16).div(4)), boc = aod, aob = aod.mul(F(4).div(16));
    return [V(aod.add(doc).add(boc).add(aob))]; // 62,5
  },
  'LT 20.18': () => [V(F(2).add(3))], // S_MEN = S_AED , S_MFN = S_BFC ⇒ 5
  'VD 21.2': () => { // r² = 28,26 : 3,14 = 9 ⇒ r = 3 ⇒ cạnh 6
    const r2 = F(2826, 100).div(PI); // 9
    let r = 0; while (BigInt(r * r) < r2.n) r++;
    return [V(F(2 * r).mul(2 * r))]; // 36
  },
  'VD 21.3': () => { // hình vuông cạnh 4 nội tiếp: r² = 4²/2 = 8
    return [V(F(16).div(2).mul(PI))]; // 25,12
  },
  'LT 21.4': () => [V(F(100).sub(F(55, 10).mul(F(55, 10))).mul(PI))], // 219,015
  'LT 21.5': () => [V(F(16).mul(PI)), V(F(4).mul(PI)), V(F(144))], // 50,24 ; 12,56 ; 144
  'LT 21.6': () => [V(F(8).mul(PI)), V(F(4).mul(PI))], // 25,12 ; 12,56 (M, N)
  'LT 21.11': () => { // chéo 16 ⇒ cạnh² = 128 ; hình tròn nội tiếp: r² = cạnh²/4 = 32
    return [V(F(16 * 16).div(2).div(4).mul(PI))]; // 100,48
  },
  'LT 21.12': () => [V(F(36).div(2).mul(PI))], // r² = 6²/2 = 18 ⇒ 56,52
  'LT 21.13': () => { // hình tròn trong r=3 ; hình vuông cạnh 6 ; hình tròn ngoài r² = 18
    return [V(F(9).mul(PI)), V(F(18).mul(PI))]; // 28,26 ; 56,52
  },
  'LT 21.14': () => { // hình tròn r=2 ; hình vuông cạnh 4 ; sao giữa = 16 − 4 góc 1/4 hình tròn r=2 ; tô = tròn − sao
    const circ = F(4).mul(PI), star = F(16).sub(circ);
    return [V(circ.sub(star))]; // 9,12
  },
  'LT 21.15': () => { // cạnh 10 ; 4 nửa hình tròn r=5 trừ hình vuông
    return [V(F(4).mul(F(25).mul(PI).div(2)).sub(100))]; // 57
  },
  'LT 22.1': () => [V(F(3)), V(F(6)), V(F(4)), V(F(6 * 4)), V(F(6 * 3)), V(F(4 * 3))], // CP,MN,PN ; đáy, ABNM, ADQM
  'LT 23.3': () => [V(F(9 * 6 * 5 - 4 * 4 * 4))], // 206
  'LT 23.4': () => [V(F(20 ** 3 - 3 * 3 * 20))], // 7820
  'VD 24.1': () => { // lập phương 4×4×4
    const n = 4;
    return [V(F(n ** 3)), V(F(8)), V(F(12 * (n - 2))), V(F(6 * (n - 2) ** 2)), V(F((n - 2) ** 3))]; // 64, 8, 24, 24, 8
  },

  // ================= LÔ 11C =================
  'ON 90': () => { // D(0,0) C(8,0) B(8,6) A(0,6) ; M mid DC=(4,0) ; BN = 2/3 BC ⇒ N=(8,6−4)=(8,2)
    return [V(shoelace([P(0, 6), P(4, 0), P(8, 2)]))]; // 16
  },
  'ON 91': () => { // S_MEK = 3/5·120 ; ME = 6x, CD = 2x
    const mek = F(120).mul(F(3, 5));
    return [V(mek), V(mek.mul(F(2, 6)))]; // 72 ; 24
  },
  'ON 92': () => { // S_AQK = 3/5·2/3 S ; QBCK = S − AQK
    return [V(F(45).sub(F(45).mul(F(3, 5)).mul(F(2, 3))))]; // 27
  },
  'ON 93': () => { // DEFG = S − AGD − GBF − FEC = (1 − 1/6 − 1/4 − 1/6) S
    const k = F(1).sub(F(1, 2).mul(F(1, 3))).sub(F(1, 2).mul(F(1, 2))).sub(F(1, 2).mul(F(1, 3)));
    return [V(F(45).div(k))]; // 108
  },
  'ON 94': () => [V(F(90).mul(F(1, 2)).mul(F(2, 3)))], // a) S_ADE = 30 ; (b) BC : CF = 1 — không đưa
  'ON 95': () => [V(F(84).mul(F(4, 7)))], // EQ = 4/7 AC ⇒ EDQB = 4/7 S = 48
  'ON 96': () => { // ½·AB·h = 3/2 · ¼·CD·h
    return [R(3, 4)]; // AB/CD = 3/4
  },
  'ON 98': () => { // AE = 2/3 AB ⇒ AI:IC = 2:3 ⇒ S_AID = 3/2 S_AIE ; S_ADE = 30 ; S_ABCD = 3/2 · 2·S_ADE... = 3·S_ADE
    const ade = F(12).add(F(12).mul(F(3, 2)));
    return [V(ade.mul(2).mul(F(3, 2)))]; // 90
  },
  'ON 99': () => { // đáy a, b, cao H ; MPQN: cao H/2, đáy (3a+b)/4 và (a+3b)/4 ⇒ S/2
    return [V(F(240).div(2))]; // 120
  },
  'ON 100': () => { // OA² = 4²/2 = 8 ; tô = tròn − vuông
    return [V(F(8).mul(PI).sub(16))]; // 9,12
  },
  'ON 101': () => { // AB=16 : nửa tròn lớn r=8, hai nửa tròn nhỏ r=4
    const chuVi = PI.mul(16).div(2).add(PI.mul(8).div(2).mul(2));
    const dienTich = PI.mul(64).div(2).add(PI.mul(16).div(2).mul(2));
    return [V(chuVi), V(dienTich)]; // 50,24 ; 150,72
  },
  'ON 102': () => [V(F(3).mul(PI))], // CD = 3π = 9,42
  'ON 119': () => { // lưới 1: 3 đường (trái-trên, dưới-phải, chéo) ; lưới 2 giống ⇒ 3×3
    return [V(F(3 * 3))]; // 9
  },
  'ON 120': () => { // đồ thị lưới gạch: nút (cột,hàng), đi xuống / sang phải, tránh C
    const nodes = {
      // hàng 1 (y=80): x = 80, 630, 1365 ; hàng 2 (y=262): 80, 258, 630, 995, 1365 ;
      // hàng 3 (y=440): 80, 258, 740, 995(C), 1365 ; hàng 4 (y=612): 80, 740, 1365
      1: [80, 630, 1365], 2: [80, 258, 630, 995, 1365], 3: [80, 258, 740, 995, 1365], 4: [80, 740, 1365],
    };
    const vert = [ // đoạn dọc [x, từ hàng, đến hàng]
      [80, 1, 4], [1365, 1, 4], [630, 1, 2], [258, 2, 3], [995, 2, 3], [740, 3, 4],
    ];
    const key = (x, r) => `${x},${r}`;
    const out = new Map(); const add = (a, b) => { (out.get(a) ?? out.set(a, []).get(a)).push(b); };
    for (const r of [1, 2, 3, 4]) {
      const xs = nodes[r];
      for (let i = 0; i + 1 < xs.length; i++) add(key(xs[i], r), key(xs[i + 1], r));
    }
    for (const [x, r1, r2] of vert) {
      let prev = r1;
      for (let r = r1 + 1; r <= r2; r++) { if (nodes[r].includes(x)) { add(key(x, prev), key(x, r)); prev = r; } }
    }
    const C = key(995, 3), A = key(80, 1), B = key(1365, 4);
    const memo = new Map();
    const count = (n) => {
      if (n === C) return 0n;
      if (n === B) return 1n;
      if (memo.has(n)) return memo.get(n);
      let s = 0n; for (const m of out.get(n) ?? []) s += count(m);
      memo.set(n, s); return s;
    };
    return [count(A).toString()];
  },
  'ON 121': () => { // A(5,4) → C(2,2) → B(0,0), đi trái/lên
    const comb = (n, k) => { let r = 1n; for (let i = 1n; i <= BigInt(k); i++) r = r * (BigInt(n) - BigInt(k) + i) / i; return r; };
    return [(comb(3 + 2, 2) * comb(2 + 2, 2)).toString()]; // 10 × 6 = 60
  },
};
