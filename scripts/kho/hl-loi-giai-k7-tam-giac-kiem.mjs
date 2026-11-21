// Kiểm TOẠ ĐỘ mọi khẳng định trong lời giải K7 Tam giác bằng nhau (hl-loi-giai-k7-tam-giac-v1.mjs) — spec-giai-bai "Verify bằng toạ độ số TRƯỚC khi chốt".
//   node scripts/kho/hl-loi-giai-k7-tam-giac-kiem.mjs
// Dựng hình ĐÚNG dữ kiện đề bằng bộ số ngẫu nhiên tổng quát (không cân / vuông đặc biệt trừ khi đề cho), kiểm: bằng nhau và THỨ TỰ ĐỈNH tương ứng
// (3 cạnh + 3 góc), song song, vuông góc, thẳng hàng, trung điểm, vị trí (nằm giữa, cùng / khác phía, tia trùng nhau), tia phân giác.
const EPS = 1e-7
let nKiem = 0, nSai = 0
const sai = []
const ok = (cond, ten, ctx) => { nKiem++; if (!cond) { nSai++; if (sai.length < 25) sai.push(`${ten} @ ${ctx}`) } }
const rnd = (a, b) => a + Math.random() * (b - a)
const P = (x, y) => [x, y]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (v, k) => [v[0] * k, v[1] * k]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0]
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
const lerp = (a, b, t) => add(a, mul(sub(b, a), t)), mid = (a, b) => lerp(a, b, 0.5)
const ang = (p, v, q) => { const a = sub(p, v), b = sub(q, v); return Math.acos(Math.max(-1, Math.min(1, dot(a, b) / (Math.hypot(...a) * Math.hypot(...b))))) * 180 / Math.PI }
const foot = (p, a, b) => lerp(a, b, dot(sub(p, a), sub(b, a)) / dot(sub(b, a), sub(b, a)))
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c), k = cross(r, s); return lerp(a, b, cross(sub(c, a), s) / k) }
const doiXung = (p, o) => sub(mul(o, 2), p)
const eq = (x, y) => Math.abs(x - y) < EPS * Math.max(1, Math.abs(x), Math.abs(y))
const coll = (a, b, c) => Math.abs(cross(sub(b, a), sub(c, a))) < EPS * Math.max(1, dist(a, b) * dist(a, c))
const giua = (a, b, c) => coll(a, b, c) && dot(sub(a, b), sub(c, b)) < -EPS            // b nằm giữa a, c
const cungTia = (o, a, b) => coll(o, a, b) && dot(sub(a, o), sub(b, o)) > EPS           // tia oa trùng tia ob
const phia = (a, b, p) => Math.sign(cross(sub(b, a), sub(p, a)))                         // phía của p đối với đường thẳng ab
const khacPhia = (a, b, p, q) => phia(a, b, p) * phia(a, b, q) < 0
const cungPhia = (a, b, p, q) => phia(a, b, p) * phia(a, b, q) > 0
const songSong = (a, b, c, d) => Math.abs(cross(sub(b, a), sub(d, c))) < EPS * dist(a, b) * dist(c, d)
const vuong = (a, b, c, d) => Math.abs(dot(sub(b, a), sub(d, c))) < EPS * dist(a, b) * dist(c, d)
// △P = △Q theo ĐÚNG thứ tự đỉnh: 3 cạnh + 3 góc tương ứng
const bang = (P3, Q3, ten, ctx) => {
  const [a, b, c] = P3, [d, e, f] = Q3
  ok(eq(dist(a, b), dist(d, e)) && eq(dist(b, c), dist(e, f)) && eq(dist(c, a), dist(f, d)), `${ten} (cạnh)`, ctx)
  ok(eq(ang(b, a, c), ang(e, d, f)) && eq(ang(a, b, c), ang(d, e, f)) && eq(ang(a, c, b), ang(d, f, e)), `${ten} (góc)`, ctx)
}
const phanGiac = (v, p, q, r, ten, ctx) => { ok(eq(ang(p, v, r), ang(r, v, q)) && eq(ang(p, v, r) + ang(r, v, q), ang(p, v, q)), ten, ctx) }  // tia vr là phân giác của góc pvq
const ngauNhien = (n, f) => { for (let i = 0; i < n; i++) f(i) }

// ═════════ MH.126 ═════════
ngauNhien(300, (i) => {
  const b = rnd(1, 4), cc = rnd(1, 6), ctx = `126#${i}`
  const A = P(0, 0), B = P(0, b), C = P(cc, 0), BC = dist(B, C)
  const D = P(b * cc / (b + BC), 0), E = lerp(B, C, b / BC)
  ok(eq(dist(B, A), dist(B, E)), 'BE=BA', ctx); ok(giua(B, E, C), 'E giữa B,C', ctx); ok(giua(A, D, C), 'D giữa A,C', ctx)
  phanGiac(B, A, C, D, 'BD phân giác ABC', ctx); ok(vuong(D, E, B, C), 'DE ⊥ BC', ctx); ok(eq(ang(B, E, D), 90), '∠BED=90', ctx); ok(eq(ang(B, A, D), 90), '∠BAD=90', ctx)
  ok(eq(ang(A, B, D), ang(E, B, D)), '∠ABD=∠EBD', ctx)
  bang([A, B, D], [E, B, D], 'B1–B3: △ABD=△EBD', ctx)
  // B4: H = BD ∩ AE
  const H = inter(B, D, A, E)
  ok(giua(A, H, E), 'H giữa A,E', ctx); ok(cungTia(B, H, D), 'tia BH = tia BD', ctx); ok(giua(B, H, D), 'H giữa B,D', ctx)
  bang([A, B, H], [E, B, H], 'B4: △ABH=△EBH', ctx); ok(eq(dist(H, A), dist(H, E)), 'HA=HE', ctx); ok(eq(ang(A, H, B), 90), '∠AHB=90', ctx); ok(vuong(B, D, A, E), 'BD ⊥ AE', ctx)
  ok(khacPhia(B, D, A, E), 'A,E khác phía BD', ctx)
  // B5, B6
  ok(eq(dist(D, A), dist(D, E)), 'DA=DE', ctx); ok(eq(ang(A, D, B), ang(E, D, B)), '∠ADB=∠EDB', ctx); phanGiac(D, A, E, B, 'DB phân giác ADE', ctx)
  // F
  const F = inter(D, E, A, B)
  ok(giua(B, A, F), 'A giữa B,F', ctx); ok(giua(E, D, F), 'D giữa E,F', ctx); ok(eq(ang(D, A, F), 90), '∠DAF=90', ctx); ok(eq(ang(D, E, C), 90), '∠DEC=90', ctx)
  ok(eq(ang(A, D, F), ang(E, D, C)), '∠ADF=∠EDC', ctx)
  bang([A, D, F], [E, D, C], 'B7/B9: △ADF=△EDC', ctx); ok(eq(dist(A, F), dist(E, C)), 'AF=EC', ctx)
  ok(eq(dist(B, F), dist(B, C)), 'BF=BC', ctx); ok(eq(dist(B, F), dist(B, A) + dist(A, F)), 'BF=BA+AF', ctx); ok(eq(dist(B, C), dist(B, E) + dist(E, C)), 'BC=BE+EC', ctx)
  const F2 = P(0, -dist(C, E)); ok(eq(dist(F, F2), 0), 'Kiểu 2: F (AF=CE, tia đối AB) trùng giao điểm DE∩AB', ctx)
  // M trung điểm FC
  const M = mid(F, C)
  bang([B, F, M], [B, C, M], 'B11: △BFM=△BCM', ctx); ok(eq(ang(F, B, M), ang(C, B, M)), '∠FBM=∠CBM', ctx)
  ok(cungTia(B, F, A), 'tia BF=tia BA', ctx); phanGiac(B, A, C, M, 'BM phân giác ABC', ctx); ok(coll(B, D, M) && cungTia(B, D, M), 'B,D,M thẳng hàng, tia BM=tia BD', ctx)
})

// ═════════ MH.130 ═════════
ngauNhien(300, (i) => {
  const ctx = `130#${i}`
  let A, B, C
  for (;;) { B = P(0, 0); C = P(rnd(3, 6), 0); A = P(rnd(0.3, 5), rnd(1.5, 5)); if (dist(B, A) < dist(B, C) && ang(B, A, C) < 89 && ang(A, B, C) < 89 && ang(A, C, B) < 89) break }
  const BA = dist(B, A), BC = dist(B, C), D = lerp(A, C, BA / (BA + BC)), E = lerp(B, C, BA / BC)
  phanGiac(B, A, C, D, 'BD phân giác', ctx); ok(giua(A, D, C), 'D giữa A,C', ctx); ok(giua(B, E, C), 'E giữa B,C', ctx); ok(eq(dist(B, E), BA), 'BE=BA', ctx)
  bang([A, B, D], [E, B, D], 'B1: △ABD=△EBD', ctx)
  const H = inter(B, D, A, E)
  ok(giua(A, H, E), 'H giữa A,E', ctx); ok(cungTia(B, H, D), 'tia BH=tia BD', ctx); bang([A, B, H], [E, B, H], 'B2: △ABH=△EBH', ctx); ok(vuong(B, D, A, E), 'BD ⊥ AE', ctx); ok(eq(dist(H, A), dist(H, E)), 'HA=HE', ctx)
  ok(eq(dist(D, A), dist(D, E)), 'B3: DA=DE', ctx); ok(khacPhia(B, D, A, E), 'A,E khác phía BD', ctx); phanGiac(D, A, E, B, 'B4: DB phân giác ADE', ctx)
  const F = inter(D, E, A, B)
  ok(giua(B, A, F), 'A giữa B,F', ctx); ok(giua(E, D, F), 'D giữa E,F', ctx); ok(eq(ang(B, A, D), ang(B, E, D)), '∠BAD=∠BED', ctx)
  ok(eq(ang(D, A, F), ang(D, E, C)), '∠DAF=∠DEC', ctx); ok(eq(ang(A, D, F), ang(E, D, C)), '∠ADF=∠EDC', ctx)
  bang([A, D, F], [E, D, C], 'B5: △ADF=△EDC', ctx); ok(eq(dist(B, F), dist(B, C)), 'B6: BF=BC', ctx); ok(eq(dist(A, F), dist(E, C)), 'AF=EC', ctx)
  const M = mid(F, C)
  bang([B, F, M], [B, C, M], 'B7: △BFM=△BCM', ctx); ok(giua(F, M, C), 'M giữa F,C', ctx); phanGiac(B, A, C, M, 'BM phân giác ABC', ctx); ok(coll(B, D, M) && cungTia(B, D, M), 'B,D,M thẳng hàng', ctx)
})

// ═════════ MH.131 ═════════
const tamGiacNgau = () => { for (;;) { const B = P(0, 0), C = P(rnd(3, 6), 0), A = P(rnd(-2, 8), rnd(1, 5)); if (Math.abs(cross(sub(C, B), sub(A, B))) > 1) return [A, B, C] } }
ngauNhien(300, (i) => {
  const ctx = `131#${i}`, [A, B, C] = tamGiacNgau(), M = mid(B, C), D = doiXung(A, M)
  ok(giua(A, M, D), 'M giữa A,D', ctx); ok(giua(B, M, C), 'M giữa B,C', ctx)
  bang([A, M, B], [D, M, C], 'B1: △AMB=△DMC', ctx); bang([A, M, C], [D, M, B], 'B2: △AMC=△DMB', ctx)
  ok(songSong(A, B, C, D) && eq(dist(A, B), dist(C, D)), 'B3: AB∥CD, AB=CD', ctx); ok(songSong(A, C, B, D) && eq(dist(A, C), dist(B, D)), 'B4: AC∥BD, AC=BD', ctx)
  ok(khacPhia(A, D, B, C), 'B,C khác phía AD', ctx)
  ok(eq(ang(M, A, B), ang(M, D, C)), '∠MAB=∠MDC', ctx); ok(eq(ang(M, A, C), ang(M, D, B)), '∠MAC=∠MDB', ctx)
  // hai họ: (X, Y1, Y2) = (đỉnh bên A, đỉnh bên D, đỉnh đối) — họ AB/DC: cạnh AB, DC, đỉnh phía B, C; họ AC/DB: cạnh AC, DB, đỉnh phía C, B
  for (const [P1, P2, Q1, Q2, tenHo] of [[B, C, B, C, 'AB-DC'], [C, B, C, B, 'AC-DB']]) {
    // cạnh bên A: A–P1 ; cạnh bên D: D–P2 ; B/C phía: P1 cùng phía với X, P2 cùng phía với Y
    const cA = P1, cD = P2
    // E, F trung điểm
    const E = mid(A, cA), F = mid(D, cD)
    ok(coll(E, M, F), `${tenHo}: E,M,F thẳng hàng`, ctx); ok(eq(dist(A, E), dist(D, F)), `${tenHo}: AE=DF`, ctx); ok(eq(ang(M, A, E), ang(M, D, F)), `${tenHo}: ∠MAE=∠MDF`, ctx)
    bang([A, M, E], [D, M, F], `${tenHo}: △AME=△DMF`, ctx); ok(khacPhia(A, D, E, F), `${tenHo}: E,F khác phía AD`, ctx); ok(cungPhia(A, D, E, cA) && cungPhia(A, D, F, cD), `${tenHo}: E cùng phía P1, F cùng phía P2`, ctx)
    ok(eq(ang(A, M, E), ang(D, M, F)), `${tenHo}: ∠AME=∠DMF`, ctx); ok(eq(ang(A, M, E) + ang(E, M, D), 180), `${tenHo}: ∠AME+∠EMD=180`, ctx)
    // I, J: AI = DJ
    const t = rnd(0.1, 0.9), I = lerp(A, cA, t), J = lerp(D, cD, t)
    ok(coll(I, M, J), `${tenHo}: I,M,J thẳng hàng`, ctx); bang([A, M, I], [D, M, J], `${tenHo}: △AMI=△DMJ`, ctx); ok(khacPhia(A, D, I, J), `${tenHo}: I,J khác phía AD`, ctx); ok(eq(dist(A, I), dist(D, J)), `${tenHo}: AI=DJ`, ctx)
    // H, K: chân đường vuông góc từ M — chỉ xét khi rơi trong cạnh (đề cho H ∈ cạnh)
    const H = foot(M, A, cA), K = foot(M, D, cD)
    const trong = (X, U, V) => dot(sub(X, U), sub(V, U)) > 0 && dot(sub(X, V), sub(U, V)) > 0
    if (trong(H, A, cA) && trong(K, D, cD)) {
      ok(coll(H, M, K), `${tenHo}: H,M,K thẳng hàng`, ctx); bang([A, H, M], [D, K, M], `${tenHo}: △AHM=△DKM`, ctx)
      ok(eq(ang(M, A, H), ang(M, D, K)), `${tenHo}: ∠MAH=∠MDK`, ctx); ok(khacPhia(A, D, H, K), `${tenHo}: H,K khác phía AD`, ctx); ok(eq(ang(A, H, M), 90) && eq(ang(D, K, M), 90), `${tenHo}: góc vuông`, ctx)
    }
  }
  // N trung điểm AB, P đối xứng C qua N
  { const N = mid(A, B), Pp = doiXung(C, N)
    bang([A, N, C], [B, N, Pp], 'B8: △ANC=△BNP', ctx); ok(eq(ang(N, A, C), ang(N, B, Pp)), '∠NAC=∠NBP', ctx); ok(khacPhia(A, B, C, Pp), 'C,P khác phía AB', ctx)
    ok(songSong(B, Pp, A, C), 'BP∥AC', ctx); ok(coll(D, B, Pp), 'D,B,P thẳng hàng', ctx)
    ok(eq(dist(B, Pp), dist(A, C)), 'BP=AC', ctx); ok(eq(dist(B, D), dist(A, C)), 'BD=AC', ctx); ok(cungPhia(A, B, C, D), 'C,D cùng phía AB', ctx); ok(khacPhia(A, B, D, Pp), 'D,P khác phía AB', ctx)
    ok(giua(D, B, Pp), 'B giữa D,P', ctx); ok(eq(dist(B, D), dist(B, Pp)), 'B trung điểm DP', ctx) }
  // L trung điểm AC, Q đối xứng B qua L
  { const L = mid(A, C), Q = doiXung(B, L)
    bang([A, L, B], [C, L, Q], 'B10: △ALB=△CLQ', ctx); ok(eq(ang(L, A, B), ang(L, C, Q)), '∠LAB=∠LCQ', ctx); ok(khacPhia(A, C, B, Q), 'B,Q khác phía AC', ctx)
    ok(songSong(C, Q, A, B), 'CQ∥AB', ctx); ok(coll(D, C, Q), 'D,C,Q thẳng hàng', ctx)
    ok(eq(dist(C, Q), dist(A, B)), 'CQ=AB', ctx); ok(eq(dist(C, D), dist(A, B)), 'CD=AB', ctx); ok(cungPhia(A, C, B, D), 'B,D cùng phía AC', ctx); ok(khacPhia(A, C, D, Q), 'D,Q khác phía AC', ctx)
    ok(giua(D, C, Q), 'C giữa D,Q', ctx); ok(eq(dist(C, D), dist(C, Q)), 'C trung điểm DQ', ctx) }
})

// ═════════ MH.132 ═════════
// nhánh: 'cao' (BD⊥AC, CE⊥AB) · 'pg' (phân giác) · 'tt' (trung tuyến)
ngauNhien(300, (i) => {
  const ctx = `132#${i}`
  // A đỉnh cân; góc A nhọn để chân đường cao nằm trong cạnh
  const h = rnd(2, 6), w = rnd(1, 3.5)            // nửa đáy w, đường cao h > w ⇒ góc A < 90°
  if (!(h > w * 1.05)) return
  const B = P(-w, 0), C = P(w, 0), A = P(0, h), M = P(0, 0)
  for (const nhanh of ['cao', 'pg', 'tt']) {
    let D, E
    if (nhanh === 'cao') { D = foot(B, A, C); E = foot(C, A, B) }
    else if (nhanh === 'pg') { const AB = dist(A, B), BC = dist(B, C); D = lerp(A, C, AB / (AB + BC)); E = lerp(A, B, AB / (AB + BC)) }
    else { D = mid(A, C); E = mid(A, B) }
    const I = inter(B, D, C, E), t = `${ctx}/${nhanh}`
    ok(giua(A, D, C) && giua(A, E, B), 'D∈AC, E∈AB (nằm giữa)', t); ok(giua(B, I, D) && giua(C, I, E), 'I giữa B,D và C,E', t)
    if (nhanh === 'cao') { ok(vuong(B, D, A, C) && vuong(C, E, A, B), 'BD⊥AC, CE⊥AB', t); ok(eq(ang(B, D, C), 90) && eq(ang(C, E, B), 90), '∠CDB=∠BEC=90', t) }
    if (nhanh === 'pg') { phanGiac(B, A, C, D, 'BD phân giác', t); phanGiac(C, A, B, E, 'CE phân giác', t); ok(eq(ang(A, B, D), ang(A, C, E)), '∠ABD=∠ACE', t) }
    if (nhanh === 'tt') { ok(eq(dist(A, D), dist(D, C)) && eq(dist(A, E), dist(E, B)), 'trung điểm', t) }
    bang([A, B, D], [A, C, E], 'B1: △ABD=△ACE', t); ok(eq(dist(A, D), dist(A, E)), 'AD=AE', t)
    ok(eq(ang(A, E, D), ang(A, B, C)), '∠AED=∠ABC (đồng vị)', t); ok(eq(ang(A, E, D), (180 - ang(B, A, C)) / 2), '∠AED=(180−A)/2', t); ok(eq(ang(A, B, C), (180 - ang(B, A, C)) / 2), '∠ABC=(180−A)/2', t)
    ok(songSong(D, E, B, C), 'DE∥BC', t)
    bang([B, E, C], [C, D, B], 'B4: △BEC=△CDB', t); ok(eq(dist(B, E), dist(C, D)), 'BE=CD', t); ok(eq(ang(E, B, C), ang(D, C, B)), '∠EBC=∠DCB', t)
    if (nhanh === 'pg') ok(eq(ang(D, B, C), ang(E, C, B)), '∠DBC=∠ECB', t)
    bang([B, E, I], [C, D, I], 'B5: △BEI=△CDI', t); ok(eq(ang(E, B, I), ang(D, C, I)), '∠EBI=∠DCI', t); ok(eq(ang(B, E, I), ang(C, D, I)), '∠BEI=∠CDI', t)
    ok(eq(dist(I, B), dist(I, C)), 'B6: IB=IC', t)
    bang([A, I, B], [A, I, C], 'B7: △AIB=△AIC', t); phanGiac(A, B, C, I, 'AI phân giác BAC', t); ok(giua(B, I, D) && giua(A, D, C), 'tia AI giữa AB,AC', t)
    bang([A, B, M], [A, C, M], 'B7: △ABM=△ACM', t); phanGiac(A, B, C, M, 'AM phân giác', t); ok(coll(A, I, M), 'A,I,M thẳng hàng', t)
    const K = mid(D, E)
    bang([A, D, K], [A, E, K], 'B8: △ADK=△AEK', t); ok(eq(ang(D, A, K), ang(E, A, K)), '∠DAK=∠EAK', t); ok(giua(D, K, E), 'K giữa D,E', t); phanGiac(A, B, C, K, 'AK phân giác BAC', t)
    ok(coll(A, I, K), 'B8: A,I,K thẳng hàng', t); ok(coll(A, I, M) && coll(A, I, K) && coll(A, M, K), 'B9: A,I,M,K thẳng hàng', t)
  }
})

console.log(`Số phép kiểm: ${nKiem} · FAIL: ${nSai}`)
if (nSai) { console.log(sai.join('\n')); process.exitCode = 1 }
