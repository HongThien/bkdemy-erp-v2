// Kiểm số: đề Bài 37–45 (TCHH CĐ3 II) — các bài KHAC, chỉ kiểm đề + kết luận có đúng không (bắt lỗi in sai đề).
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, e = 1e-7) => Math.abs(a - b) < e * (1 + Math.abs(a) + Math.abs(b));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cr = (a, b) => a[0] * b[1] - a[1] * b[0];
const len = a => Math.hypot(a[0], a[1]);
const mid = (a, b) => mul(add(a, b), 0.5);
const dist = (a, b) => len(sub(a, b));
function inter(p, d, q, e) { const t = cr(sub(q, p), e) / cr(d, e); return add(p, mul(d, t)); }
const foot = (p, a, b) => { const d = sub(b, a); return add(a, mul(d, dot(sub(p, a), d) / dot(d, d))); };
const unit = a => mul(a, 1 / len(a));
const incenter = (A, B, C) => { const a = dist(B, C), b = dist(C, A), c = dist(A, B); const s = a + b + c; return [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]; };
const circum = (A, B, C) => { const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1])); const f = P => dot(P, P); const x = (f(A) * (B[1] - C[1]) + f(B) * (C[1] - A[1]) + f(C) * (A[1] - B[1])) / d; const y = (f(A) * (C[0] - B[0]) + f(B) * (A[0] - C[0]) + f(C) * (B[0] - A[0])) / d; return [x, y]; };
const rot = (v, ang) => [v[0] * Math.cos(ang) - v[1] * Math.sin(ang), v[0] * Math.sin(ang) + v[1] * Math.cos(ang)];
const ang = (P, O, Q) => Math.acos(dot(sub(P, O), sub(Q, O)) / (len(sub(P, O)) * len(sub(Q, O))));

// ---- Bài 37: ABC vuông tại A, AH cao; D,E phân giác HAB, HAC cắt BC; giao phân giác ABC = tâm ngoại tiếp ADE
for (const [b, c] of [[3, 4], [2, 7], [5, 1.3]]) {
  const A = [0, 0], B = [b, 0], C = [0, c];
  const H = foot(A, B, C);
  const bis = (U, V) => add(unit(sub(U, A)), unit(sub(V, A)));
  const D = inter(A, bis(H, B), B, sub(C, B));
  const E = inter(A, bis(H, C), B, sub(C, B));
  const I = incenter(A, B, C), O = circum(A, D, E);
  ok(dist(I, O) < 1e-9, '37 I=O');
}
// ---- Bài 38: ABC cân tại A; D∈AB, E∈AC, AD=CE; trung trực DE qua tâm ngoại tiếp
for (const t of [0.1, 0.4, 0.77]) {
  const A = [0, 5], B = [-3, 0], C = [3, 0];
  const O = circum(A, B, C);
  const L = dist(A, B);
  const D = add(A, mul(unit(sub(B, A)), t * L));
  const E = add(C, mul(unit(sub(A, C)), t * L)); // CE = AD
  ok(near(dist(O, D), dist(O, E)), '38 OD=OE');
  ok(near(dist(A, D), dist(C, E)), '38 AD=CE');
}
// ---- Bài 39: AD phân giác; E,F∈AD, ∠ABE=∠CBF ⇒ ∠ACE=∠BCF
for (const [A, B, C, s] of [[[1, 5], [0, 0], [7, 0], 0.3], [[-2, 4], [0, 0], [6, 0], 0.5], [[3, 6], [0, 0], [5, 0], 0.7]]) {
  const D = add(B, mul(sub(C, B), dist(A, B) / (dist(A, B) + dist(A, C)))); // chân phân giác
  const E = add(A, mul(sub(D, A), s));
  // tia BF = đối xứng tia BE qua phân giác góc B
  const u = unit(sub(A, B)), w = unit(sub(C, B)), bb = unit(add(u, w));
  const vE = sub(E, B);
  const vF = sub(mul(bb, 2 * dot(vE, bb)), vE);
  const F = inter(A, sub(D, A), B, vF);
  ok(near(ang(A, B, E), ang(C, B, F)), '39 ABE=CBF');
  ok(near(ang(A, C, E), ang(B, C, F)), '39 ACE=BCF');
}
// ---- Bài 40: ABC vuông tại A; E,I,K tâm nội tiếp ABC, ABH, ACH ⇒ AE ⊥ IK
for (const [b, c] of [[3, 4], [2, 7], [5, 1.3]]) {
  const A = [0, 0], B = [b, 0], C = [0, c];
  const H = foot(A, B, C);
  const E = incenter(A, B, C), I = incenter(A, B, H), K = incenter(A, C, H);
  ok(near(dot(sub(E, A), sub(K, I)), 0, 1e-9), '40 AE⊥IK');
}
// ---- Bài 41: AH cao; ABD, ACE vuông cân (B=C=90°) ra ngoài; K = (đt qua C ⊥ BE) ∩ HA ⇒ DC ⊥ BK; AH,BE,CD đồng quy
for (const [A, B, C] of [[[1, 4], [0, 0], [6, 0]], [[3, 5], [-1, 0], [5, 0]], [[-1, 3], [0, 0], [4, 0]]]) {
  const H = foot(A, B, C);
  // D: BD ⊥ BA, BD=BA, ra ngoài (khác phía C so với AB)
  const mk = (P, Q, R) => { // vuông cân tại P với cạnh PQ, đỉnh còn lại ra phía đối diện R
    const v = sub(Q, P); let n = [-v[1], v[0]];
    if (dot(n, sub(R, P)) > 0) n = mul(n, -1);
    return add(P, n);
  };
  const D = mk(B, A, C), E = mk(C, A, B);
  const K = inter(C, [-(E[1] - B[1]), E[0] - B[0]], A, sub(A, H));
  ok(near(dot(sub(D, C), sub(K, B)), 0, 1e-9), '41a DC⊥BK');
  const I = inter(A, sub(A, H), B, sub(E, B));
  ok(near(cr(sub(D, C), sub(I, C)), 0, 1e-9), '41b đồng quy');
}
let nNhon = 0, nTu = 0, nSai = 0;
// ---- Bài 42: H trực tâm — bất đẳng thức (tam giác nhọn / bất kì có H)
for (let i = 0; i < 2000; i++) {
  const r = () => Math.random() * 10;
  const A = [r(), r()], B = [r(), r()], C = [r(), r()];
  if (Math.abs(cr(sub(B, A), sub(C, A))) < 1) continue;
  const O = circum(A, B, C); const H = sub(add(add(A, B), C), mul(O, 2));
  const s = dist(H, A) + dist(H, B) + dist(H, C);
  const ab = dist(A, B), bc = dist(B, C), ca = dist(C, A);
  const acute = dot(sub(B, A), sub(C, A)) > 0 && dot(sub(A, B), sub(C, B)) > 0 && dot(sub(A, C), sub(B, C)) > 0;
  const okA = s < ab + ca, okB = s < (2 / 3) * (ab + bc + ca);
  if (acute) { ok(okA, '42a nhọn'); ok(okB, '42b nhọn'); nNhon++; }
  else { nTu++; if (!okA) nSai++; }
}
console.log('42: tam giác nhọn', nNhon, '; không nhọn', nTu, ', trong đó (a) sai', nSai);
// ---- Bài 43: ABC vuông cân tại A; M,N trung điểm AB,AC; NH⊥CM tại H; HE⊥AB tại E ⇒ BA=BH, HM phân giác BHE
for (const k of [1, 3, 7]) {
  const A = [0, 0], B = [2 * k, 0], C = [0, 2 * k];
  const M = mid(A, B), N = mid(A, C);
  const H = foot(N, C, M), E = foot(H, A, B);
  ok(near(dist(B, A), dist(B, H)), '43 BA=BH');
  ok(near(ang(E, H, M), ang(M, H, B)), '43 HM phân giác');
}
// ---- Bài 44: ABC vuông A (AB<AC), AH cao, D đối xứng A qua H, đt qua D ∥ AB cắt BC,AC ở M,N, I trung điểm MC ⇒ IN ⊥ HN
for (const [b, c] of [[3, 4], [2, 6], [1.5, 2]]) {
  const A = [0, 0], B = [b, 0], C = [0, c];
  const H = foot(A, B, C), D = sub(mul(H, 2), A);
  const M = inter(D, sub(B, A), B, sub(C, B)), N = inter(D, sub(B, A), A, sub(C, A));
  const I = mid(M, C);
  ok(near(dot(sub(I, N), sub(H, N)), 0, 1e-9), '44 IN⊥HN');
}
// ---- Bài 45: ∠A=75°, ∠B=45°, D∈AC, ∠ABD=30° ⇒ AD=√3·CD
{
  const B = [0, 0], C = [1, 0];
  const A = inter(B, [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)], C, [-Math.cos(Math.PI * 45 / 180 + 0 * 1), Math.sin(0)]);
  // góc C = 60°: tia CA hợp CB góc 60°
  const A2 = inter(B, [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)], C, [Math.cos(Math.PI - Math.PI / 3), Math.sin(Math.PI - Math.PI / 3)]);
  ok(near(ang(B, A2, C), 75 * Math.PI / 180), '45 góc A=75');
  const D = inter(B, [Math.cos(Math.PI / 4 - Math.PI / 6), Math.sin(Math.PI / 4 - Math.PI / 6)], A2, sub(C, A2));
  ok(near(ang(A2, B, D), Math.PI / 6), '45 ABD=30');
  ok(near(dist(A2, D), Math.sqrt(3) * dist(C, D)), '45 AD=√3 CD');
}
console.log(`kiem_G15: ${pass} đạt, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
