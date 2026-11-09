// Kiểm số 2 bài nhiều ý ĐTB (09/11) — mọi khẳng định trong lời giải, trên tứ giác ngẫu nhiên (lồi và lõm)
const R = (a, b) => a + Math.random() * (b - a)
const pt = () => [R(-10, 10), R(-10, 10)]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], half = (v) => [v[0] / 2, v[1] / 2]
const mid = (a, b) => half(add(a, b)), dot = (a, b) => a[0] * b[0] + a[1] * b[1], cr = (a, b) => a[0] * b[1] - a[1] * b[0], len = (v) => Math.hypot(v[0], v[1])
const eq = (a, b, e = 1e-9) => Math.abs(a - b) < e, song = (a, b) => Math.abs(cr(a, b)) < 1e-9 * (len(a) * len(b) || 1)
let ok = 0, fail = 0
const T = (c, m) => { if (c) ok++; else { fail++; console.log('FAIL', m) } }
for (let t = 0; t < 400; t++) {
  const A = pt(), B = pt(), C = pt(), D = pt()
  // ── BY1: M N P Q = trung điểm AB BC CD DA
  {
    const M = mid(A, B), N = mid(B, C), Pp = mid(C, D), Q = mid(D, A)
    const AC = sub(C, A), BD = sub(D, B)
    T(song(sub(N, M), AC) && eq(len(sub(N, M)), len(AC) / 2), 'BY1 MN∥AC, MN=AC/2')
    T(song(sub(Pp, Q), AC) && eq(len(sub(Pp, Q)), len(AC) / 2), 'BY1 QP∥AC, QP=AC/2')
    T(song(sub(Pp, N), BD) && eq(len(sub(Pp, N)), len(BD) / 2), 'BY1 NP∥BD, NP=BD/2')
    T(eq(sub(N, M)[0], sub(Pp, Q)[0]) && eq(sub(N, M)[1], sub(Pp, Q)[1]), 'BY1 vector MN = QP (HBH)')
    // điều kiện: AC ⊥ BD ⇔ MN ⊥ NP ; AC=BD ⇔ MN=NP
    const vuong = Math.abs(dot(AC, BD)) < 1e-9 * len(AC) * len(BD)
    T(vuong === (Math.abs(dot(sub(N, M), sub(Pp, N))) < 1e-9 * len(sub(N, M)) * len(sub(Pp, N))), 'BY1 MN⊥NP ⇔ AC⊥BD (ngẫu nhiên)')
  }
  // dựng AC ⊥ BD: lấy O, hai hướng vuông góc
  {
    const O = pt(), u = [Math.random() + .5, Math.random() - .5], v = [-u[1], u[0]]
    const a = R(1, 5), b = R(1, 5), c = R(1, 5), d = R(1, 5)
    const A2 = [O[0] - u[0] * a, O[1] - u[1] * a], C2 = [O[0] + u[0] * c, O[1] + u[1] * c], B2 = [O[0] - v[0] * b, O[1] - v[1] * b], D2 = [O[0] + v[0] * d, O[1] + v[1] * d]
    const M = mid(A2, B2), N = mid(B2, C2), Pp = mid(C2, D2), Q = mid(D2, A2)
    T(eq(dot(sub(M, N), sub(Pp, N)), 0, 1e-9) && eq(dot(sub(N, Pp), sub(Q, Pp)), 0, 1e-9) && eq(dot(sub(Pp, Q), sub(M, Q)), 0, 1e-9) && eq(dot(sub(Q, M), sub(N, M)), 0, 1e-9), 'BY1 AC⊥BD ⇒ MNPQ hình chữ nhật')
    // thêm AC = BD ⇒ hình vuông
    const L = R(2, 6); const A3 = [O[0] - u[0] * L, O[1] - u[1] * L], C3 = [O[0] + u[0] * L * 1.3, O[1] + u[1] * L * 1.3]
    const lenAC = len(sub(C3, A3)), vn = len(v) / len(u)
    const B3 = [O[0] - v[0] * (lenAC * 0.4 / len(v)), O[1] - v[1] * (lenAC * 0.4 / len(v))], D3 = [O[0] + v[0] * (lenAC * 0.6 / len(v)), O[1] + v[1] * (lenAC * 0.6 / len(v))]
    const M3 = mid(A3, B3), N3 = mid(B3, C3), P3 = mid(C3, D3)
    T(eq(len(sub(D3, B3)), lenAC) && eq(len(sub(N3, M3)), len(sub(P3, N3))) && eq(dot(sub(N3, M3), sub(P3, N3)), 0, 1e-9), 'BY1 AC⊥BD, AC=BD ⇒ MN=NP, MN⊥NP (hình vuông)')
  }
  // ── BY2: M∈AB, N∈AC, P∈CD, Q∈DB
  {
    const M = mid(A, B), N = mid(A, C), Pp = mid(C, D), Q = mid(D, B)
    const BC = sub(C, B), AD = sub(D, A)
    T(song(sub(N, M), BC) && eq(len(sub(N, M)), len(BC) / 2), 'BY2 MN∥BC, MN=BC/2')
    T(song(sub(Pp, Q), BC) && eq(len(sub(Pp, Q)), len(BC) / 2), 'BY2 QP∥BC, QP=BC/2')
    T(song(sub(Pp, N), AD) && eq(len(sub(Pp, N)), len(AD) / 2), 'BY2 NP∥AD, NP=AD/2')
    T(song(sub(Q, M), AD) && eq(len(sub(Q, M)), len(AD) / 2), 'BY2 MQ∥AD, MQ=AD/2')
    T(eq(sub(N, M)[0], sub(Pp, Q)[0]) && eq(sub(N, M)[1], sub(Pp, Q)[1]), 'BY2 vector MN = QP (HBH)')
    const vuong = Math.abs(dot(BC, AD)) < 1e-9 * len(BC) * len(AD)
    T(vuong === (Math.abs(dot(sub(N, M), sub(Pp, N))) < 1e-9 * len(sub(N, M)) * len(sub(Pp, N))), 'BY2 MN⊥NP ⇔ BC⊥AD (ngẫu nhiên)')
  }
  {
    // BC ⊥ AD, BC = AD ⇒ hình vuông ; BC ⊥ AD ⇒ hình chữ nhật
    const u = [R(.3, 1), R(.3, 1)], v = [-u[1], u[0]], B = pt(), A = pt()
    const lb = R(1, 4), la = R(1, 4)
    const C = [B[0] + u[0] * lb, B[1] + u[1] * lb], D = [A[0] + v[0] * la, A[1] + v[1] * la]
    const M = mid(A, B), N = mid(A, C), Pp = mid(C, D), Q = mid(D, B)
    T(eq(dot(sub(N, M), sub(Pp, N)), 0, 1e-9) && eq(dot(sub(Pp, N), sub(Q, Pp)), 0, 1e-9), 'BY2 BC⊥AD ⇒ MNPQ hình chữ nhật')
    const D2 = [A[0] + v[0] * lb, A[1] + v[1] * lb]
    const Pq = mid(C, D2), Qq = mid(D2, B)
    T(eq(len(sub(Pq, N)), len(sub(N, M))) && eq(dot(sub(N, M), sub(Pq, N)), 0, 1e-9), 'BY2 BC⊥AD, BC=AD ⇒ hình vuông')
  }
}
console.log(`BY1 + BY2: ${ok} PASS · ${fail} FAIL`)
process.exit(fail ? 1 : 0)
