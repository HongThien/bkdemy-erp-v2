// kiem-phangiac.mjs — máy kiểm các khẳng định trong lý thuyết + ví dụ phân giác (lt/lt-phangiac.md, lt/vd-phangiac.md): toạ độ ngẫu nhiên.
//   node kho-rules/hinh/lo/k8T-thales/lt/kiem-phangiac.mjs
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y), add = (a, b) => P(a.x + b.x, a.y + b.y), mul = (u, k) => P(u.x * k, u.y * k)
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const len = (u) => Math.hypot(u.x, u.y), cr = (u, v) => u.x * v.y - u.y * v.x, dot = (u, v) => u.x * v.x + u.y * v.y
const unit = (u) => mul(u, 1 / len(u)), d = (a, b) => len(sub(a, b))
const par = (a, b, c, e) => near(cr(sub(b, a), sub(e, c)), 0, 1e-8)
const ang = (v, p, q) => Math.acos(Math.max(-1, Math.min(1, dot(unit(sub(p, v)), unit(sub(q, v))))))
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const inter = (a, b, c, e) => { const r = sub(b, a), s = sub(e, c), k = cr(r, s); return lerp(a, b, cr(sub(c, a), s) / k) }
const onSeg = (p, a, b) => near(d(a, p) + d(p, b), d(a, b))
for (let t = 0; t < 400; t++) {
  let A = P(R(-5, 5), R(-5, 5)), B = P(R(-9, 9), R(-9, 9)), C = P(R(-9, 9), R(-9, 9))
  if (near(cr(sub(B, A), sub(C, A)), 0, 1e-3)) continue
  const c = d(A, B), b = d(A, C), a = d(B, C)
  if (Math.abs(b - c) < 0.3) continue
  // phân giác trong
  const D = inter(A, add(A, add(unit(sub(B, A)), unit(sub(C, A)))), B, C)
  chk('D thuộc đoạn BC', onSeg(D, B, C)); chk('góc BAD = góc DAC', near(ang(A, B, D), ang(A, D, C)))
  chk('DB/DC = AB/AC', near(d(D, B) / d(D, C), c / b))
  chk('DB = ac/(b+c)', near(d(D, B), a * c / (b + c))); chk('DC = ab/(b+c)', near(d(D, C), a * b / (b + c)))
  // chứng minh trong: CE ∥ AD, E ∈ tia đối AB ⇒ AE = AC, góc AEC = BAD, ACE = CAD
  { const E = add(A, mul(unit(sub(A, B)), b))
    chk('E: CE∥AD', par(C, E, A, D)); chk('E nằm ngoài, A giữa E và B', onSeg(A, E, B))
    chk('AEC = BAD', near(ang(E, A, C), ang(A, B, D))); chk('ACE = CAD', near(ang(C, A, E), ang(A, C, D)))
    chk('DB/DC = AB/AE (Thalès)', near(d(D, B) / d(D, C), c / d(A, E))) }
  // phân giác ngoài
  const Dn = inter(A, add(A, sub(unit(sub(B, A)), unit(sub(C, A)))), B, C)
  chk("D'B/D'C = AB/AC", near(d(Dn, B) / d(Dn, C), c / b)); chk('AD ⊥ AD\'', near(dot(sub(D, A), sub(Dn, A)), 0, 1e-8))
  chk("D' ngoài đoạn BC", !onSeg(Dn, B, C))
  const Cp = add(A, mul(unit(sub(A, C)), 3))
  chk("góc BAD' = D'AC'", near(ang(A, B, Dn), ang(A, Dn, Cp)))
  const lon = b > c   // AB<AC ⇒ D' phía B ; AB>AC ⇒ D' phía C
  chk("D'B = ac/|b−c|", near(d(Dn, B), a * c / Math.abs(b - c))); chk("D'C = ab/|b−c|", near(d(Dn, C), a * b / Math.abs(b - c)))
  if (lon) { chk("B giữa D' và C (AB<AC)", onSeg(B, Dn, C)); chk("D'C − D'B = BC", near(d(Dn, C) - d(Dn, B), a)) }
  // chứng minh ngoài (AB<AC): E ∈ AC, AE = AB, BE ∥ AD'; góc BAC' = 2 AEB
  if (lon) { const E = add(A, mul(unit(sub(C, A)), c))
    chk('E thuộc đoạn AC', onSeg(E, A, C)); chk("BE∥AD'", par(B, E, A, Dn)); chk('BAC\' = 2·AEB', near(ang(A, B, Cp), 2 * ang(E, A, B)))
    chk("D'AC' = AEB", near(ang(A, Dn, Cp), ang(E, A, B)))
    chk('CB/CD\' = CE/CA', near(d(C, B) / d(C, Dn), d(C, E) / b)) }
  // cách 2 (AB<AC): qua B kẻ ∥ AC cắt AD tại I, AE (= AD' trong biến Dn) tại K ⇒ BI = BA = BK, B trung điểm IK, K ∈ đoạn EA, D giữa A và I
  if (lon) { const dB = add(B, sub(C, A)), I = inter(A, D, B, dB), Kk = inter(A, Dn, B, dB)
    chk('BI∥AC', par(B, I, A, C)); chk('BK∥AC', par(B, Kk, A, C))
    chk('BIA = IAC (so le trong)', near(ang(I, B, A), ang(A, I, C))); chk('BI = BA', near(d(B, I), c)); chk('BK = BA', near(d(B, Kk), c)); chk('BI = BK', near(d(B, I), d(B, Kk)))
    chk('D giữa A và I', onSeg(D, A, I)); chk('K ∈ đoạn EA', onSeg(Kk, A, Dn)); chk('B giữa I và K, trung điểm', onSeg(B, I, Kk) && near(d(B, I), d(B, Kk)))
    chk('DB/DC = BI/AC', near(d(D, B) / d(D, C), d(B, I) / b)); chk('EB/EC = BK/AC', near(d(Dn, B) / d(Dn, C), d(B, Kk) / b))
    chk('EK/EA = EB/EC', near(d(Dn, Kk) / d(Dn, A), d(Dn, B) / d(Dn, C)))
    chk('IAK = 90°', near(dot(sub(I, A), sub(Kk, A)), 0, 1e-8)); chk('AB = IK/2', near(c, d(I, Kk) / 2))
    chk('BKA = KAC (so le trong)', near(ang(Kk, B, A), ang(A, Kk, Cp))); chk('KAC = BAK', near(ang(A, Kk, Cp), ang(A, B, Kk))) }
  // ví dụ 3 (DE ∥ AB, E ∈ AC): AE = DE, 1/DE = 1/AB + 1/AC
  { const E = lerp(C, A, d(D, C) / a)
    chk('DE∥AB', par(D, E, A, B)); chk('EA = ED', near(d(E, A), d(E, D))); chk('1/DE = 1/AB + 1/AC', near(1 / d(D, E), 1 / c + 1 / b))
    chk('DE/AB = CE/CA', near(d(D, E) / c, d(C, E) / b)) }
  // định lí đảo: D1 trên BC với D1B/D1C = c/b ⇒ trùng chân phân giác
  { const D1 = lerp(B, C, c / (b + c)); chk('đảo: D1 = D', near(d(D1, D), 0, 1e-8)) }
}
// tam giác cân AB = AC: phân giác ngoài ∥ BC
{ const A = P(0, 5), B = P(-3, 0), C = P(3, 0), D = lerp(B, C, 0.5), du = unit(sub(A, D))
  const nga = P(-du.y, du.x); chk('cân: phân giác ngoài ∥ BC', par(A, add(A, nga), B, C)) }
// số trong các ví dụ
const eq = (nhan, a, b) => chk(nhan, near(a, b))
eq('VD1 tỉ số', 6 / 9, 2 / 3); eq('VD1 DB=4', 2 * 2, 4); eq('VD1 DC=6', 3 * 2, 6); eq('VD1 DB/DC', 4 / 6, 6 / 9); eq('VD1 tổng', 4 + 6, 10)
eq('VD2 D\'B=6', 6 / (6 + 6), 1 / 2); eq('VD2 D\'C=12', 6 + 6, 12); eq('VD2 tỉ số', 6 / 12, 4 / 8)
eq('VD4 DB=2', 6 / 3, 2); eq('VD4 DD\'=8', 6 + 2, 8); eq('VD4 DB/DC', 2 / 4, 4 / 8)
eq('VD5 tỉ số', 2 / 3, 4 / 6)
// dựng VD1, VD2, VD4 bằng toạ độ: độ dài khớp đề
{ // VD1: AB=6, AC=9, BC=10 ⇒ A từ B=(0,0), C=(10,0)
  const B = P(0, 0), C = P(10, 0), x = (36 - 81 + 100) / 20, A = P(x, Math.sqrt(36 - x * x))
  eq('VD1 AB', d(A, B), 6); eq('VD1 AC', d(A, C), 9)
  const D = inter(A, add(A, add(unit(sub(B, A)), unit(sub(C, A)))), B, C); eq('VD1 DB=4', d(D, B), 4); eq('VD1 DC=6', d(D, C), 6) }
{ // VD2/VD4: AB=4, AC=8, BC=6
  const B = P(0, 0), C = P(6, 0), x = (16 - 64 + 36) / 12, A = P(x, Math.sqrt(16 - x * x))
  eq('VD2 AB', d(A, B), 4); eq('VD2 AC', d(A, C), 8)
  const D = inter(A, add(A, add(unit(sub(B, A)), unit(sub(C, A)))), B, C), Dn = inter(A, add(A, sub(unit(sub(B, A)), unit(sub(C, A)))), B, C)
  eq('VD2 D\'B=6', d(Dn, B), 6); eq('VD2 D\'C=12', d(Dn, C), 12); eq('VD4 DB=2', d(D, B), 2); eq('VD4 DD\'=8', d(D, Dn), 8)
  chk('VD4 thứ tự D\', B, D, C', Dn.x < B.x && B.x < D.x && D.x < C.x) }
{ // VD5: AB=4, AC=6, BC=5 (BD=2, DC=3) ⇒ D chia BC theo 2:3 trùng chân phân giác
  const B = P(0, 0), C = P(5, 0), x = (16 - 36 + 25) / 10, A = P(x, Math.sqrt(16 - x * x))
  eq('VD5 AB', d(A, B), 4); eq('VD5 AC', d(A, C), 6)
  const D = P(2, 0), Dp = inter(A, add(A, add(unit(sub(B, A)), unit(sub(C, A)))), B, C); eq('VD5 D trùng chân phân giác', d(D, Dp), 0) }
console.log(`kiem-phangiac: ${ok} phép kiểm đạt, ${fail} FAIL`)
