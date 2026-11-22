// kiem-thales.mjs — máy kiểm các khẳng định trong lý thuyết + ví dụ Thalès (lt/lt-thales.md, lt/vd-thales.md): toạ độ ngẫu nhiên, nhiều bộ.
//   node kho-rules/hinh/lo/k8T-thales/lt/kiem-thales.mjs
let ok = 0, fail = 0
const chk = (nhan, cond) => { if (cond) ok++; else { fail++; console.log('FAIL', nhan) } }
const near = (a, b, e = 1e-9) => Math.abs(a - b) < e * Math.max(1, Math.abs(a), Math.abs(b))
const P = (x, y) => ({ x, y })
const sub = (a, b) => P(a.x - b.x, a.y - b.y), lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const len = (u) => Math.hypot(u.x, u.y), cr = (u, v) => u.x * v.y - u.y * v.x
const par = (a, b, c, d) => near(cr(sub(b, a), sub(d, c)), 0, 1e-8)
const R = (lo, hi) => lo + Math.random() * (hi - lo)
const d = (a, b) => len(sub(a, b))
// điểm trên đường thẳng AB theo hệ số k từ A: A + k(B−A)  (k∈(0,1) trên cạnh, k>1 kéo dài về phía B, k<0 tia đối)
const tren = (A, B, k) => lerp(A, B, k)
for (let t = 0; t < 300; t++) {
  const A = P(R(-5, 5), R(-5, 5)), B = P(R(-9, 9), R(-9, 9)), C = P(R(-9, 9), R(-9, 9))
  if (near(cr(sub(B, A), sub(C, A)), 0, 1e-3)) continue
  for (const k of [R(0.1, 0.9), R(1.1, 3), R(-3, -0.1)]) {            // cạnh · kéo dài cùng phía · đồng hồ cát (tia đối)
    const D = tren(A, B, k), E = tren(A, C, k)                          // DE ∥ BC bởi dựng
    chk('DE∥BC', par(D, E, B, C))
    chk('AD/AB=AE/AC', near(d(A, D) / d(A, B), d(A, E) / d(A, C)))
    chk('AD/DB=AE/EC', near(d(A, D) / d(D, B), d(A, E) / d(E, C)))
    chk('DB/AB=EC/AC', near(d(D, B) / d(A, B), d(E, C) / d(A, C)))
    chk('hệ quả DE/BC=AD/AB', near(d(D, E) / d(B, C), d(A, D) / d(A, B)))
    if (k < 0) chk('đồng hồ cát: DB=AD+AB, EC=AE+AC', near(d(D, B), d(A, D) + d(A, B)) && near(d(E, C), d(A, E) + d(A, C)))
    if (k > 1) chk('kéo dài: DB=AD−AB', near(d(D, B), d(A, D) - d(A, B)))
    // đảo: cho AD/AB=AE/AC cùng phía (k>0) hoặc đối (k<0) ⇒ DE∥BC (đã đúng theo dựng); phản ví dụ: D cạnh, E kéo dài cùng tỉ số độ dài
    const k2 = k > 0 ? k : -k
    const Dl = tren(A, B, 0.5), El = tren(A, C, -0.5)
    chk('đảo cần cùng dạng: D cạnh + E tia đối KHÔNG song song', !par(Dl, El, B, C))
  }
  // chứng minh hệ quả: EF∥AB, F∈BC, BDEF hình bình hành ⇒ DE=BF, BF/BC=AE/AC
  { const k = R(0.1, 0.9), D = tren(A, B, k), E = tren(A, C, k), F = lerp(C, B, 1 - k)   // CF/CB = CE/CA = 1−k
    chk('EF∥AB', par(E, F, A, B)); chk('BDEF bình hành', near(d(B, D), d(E, F)) && par(B, D, E, F) && par(D, E, B, F))
    chk('DE=BF', near(d(D, E), d(B, F))); chk('AE/AC=BF/BC', near(d(A, E) / d(A, C), d(B, F) / d(B, C))) }
}
// số trong các ví dụ
const eq = (nhan, a, b) => chk(nhan, near(a, b))
eq('VD1 AB', 3 + 5, 8); eq('VD1 AE', 3 * 12 / 8, 4.5); eq('VD1 EC', 12 - 4.5, 7.5)
eq('VD2 AD/AB', 6 / 15, 2 / 5); eq('VD2 AE/AC', 8 / 20, 2 / 5); eq('VD2 DE', 2 * 10 / 5, 4)
eq('VD3 AE', 4 * 9 / 6, 6); eq('VD3 DE', 2 / 3 * 12, 8)
eq('VD4 AD', 6 + 3, 9); eq('VD4 AE', 9 * 8 / 6, 12); eq('VD4 CE', 12 - 8, 4); eq('VD4 DB/AB', 3 / 6, 4 / 8)
eq('VD5 tỉ số', 18 / (10 + 14 + 12), 1 / 2); eq('VD5 AD', 10 / 2, 5)
// dựng lại từng ví dụ bằng toạ độ: độ dài khớp đề và các tỉ số
{ const A = P(0, 0), u = { x: 1, y: 0 }, w = { x: Math.cos(1), y: Math.sin(1) }
  const B = P(8 * u.x, 8 * u.y), C = P(12 * w.x, 12 * w.y), D = tren(A, B, 3 / 8), E = tren(A, C, 3 / 8)       // VD1: AB=8, AD=3, AC=12
  chk('VD1 DE∥BC', par(D, E, B, C)); eq('VD1 AE=4,5', d(A, E), 4.5); eq('VD1 EC=7,5', d(E, C), 7.5) }
{ const A = P(0, 0), B = P(15, 0), C = P(20 * Math.cos(0.9), 20 * Math.sin(0.9)), D = tren(A, B, 6 / 15), E = tren(A, C, 8 / 20)   // VD2
  chk('VD2 DE∥BC', par(D, E, B, C)); eq('VD2 DE/BC', d(D, E) / d(B, C), 2 / 5) }
{ const A = P(0, 0), B = P(-6, 0), C = P(9 * Math.cos(2.2), 9 * Math.sin(2.2)), D = tren(A, B, -4 / 6), E = tren(A, C, -4 / 6)   // VD3 đồng hồ cát: AB=6, AD=4, AC=9
  eq('VD3 AD=4', d(A, D), 4); eq('VD3 AE=6', d(A, E), 6); chk('VD3 BC∥DE', par(B, C, D, E)); eq('VD3 DE/BC=2/3', d(D, E) / d(B, C), 2 / 3) }
{ const A = P(0, 0), B = P(6, 0), C = P(8 * Math.cos(0.8), 8 * Math.sin(0.8)), D = tren(A, B, 9 / 6), E = tren(A, C, 9 / 6)   // VD4 kéo dài: AB=6, BD=3, AC=8
  eq('VD4 BD=3', d(B, D), 3); eq('VD4 AE=12', d(A, E), 12); eq('VD4 CE=4', d(C, E), 4); chk('VD4 DE∥BC', par(D, E, B, C)) }
console.log(`kiem-thales: ${ok} phép kiểm đạt, ${fail} FAIL`)
