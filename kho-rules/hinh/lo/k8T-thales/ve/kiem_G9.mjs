// kiem_G9.mjs — verify bằng toạ độ số cho TCHH-5.13 … 5.17 (trạm G9). Chạy: node kiem_G9.mjs
let tong = 0, fail = 0
const ok = (cond, msg) => { tong++; if (!cond) { fail++; console.log('FAIL:', msg) } }
const eq = (a, b, msg, eps = 1e-7) => ok(Math.abs(a - b) < eps, `${msg} (${a} vs ${b})`)

const P = (x, y) => ({ x, y })
const add = (a, b) => P(a.x + b.x, a.y + b.y)
const sub = (a, b) => P(a.x - b.x, a.y - b.y)
const mul = (a, k) => P(a.x * k, a.y * k)
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)
const mid = (a, b) => lerp(a, b, 0.5)
const len = (a) => Math.hypot(a.x, a.y)
const dist = (a, b) => len(sub(a, b))
const dot = (a, b) => a.x * b.x + a.y * b.y
const cross = (a, b) => a.x * b.y - a.y * b.x
const inter = (a, b, c, d) => { const r = sub(b, a), s = sub(d, c), k = cross(r, s); return lerp(a, b, cross(sub(c, a), s) / k) }
const foot = (p, a, b) => { const d = sub(b, a); return lerp(a, b, dot(sub(p, a), d) / dot(d, d)) }
const par = (a, b, c, d) => Math.abs(cross(sub(b, a), sub(d, c))) < 1e-7 * (len(sub(b, a)) * len(sub(d, c)) + 1)
const onLine = (p, a, b) => Math.abs(cross(sub(b, a), sub(p, a))) < 1e-7 * (dist(a, b) * dist(a, p) + 1)
const between = (p, a, b) => onLine(p, a, b) && dot(sub(p, a), sub(p, b)) < -1e-12 // p nằm giữa a, b (nghiêm ngặt)
const inside = (p, a, b, c) => { const s1 = cross(sub(b, a), sub(p, a)), s2 = cross(sub(c, b), sub(p, b)), s3 = cross(sub(a, c), sub(p, c)); return (s1 > 0 && s2 > 0 && s3 > 0) || (s1 < 0 && s2 < 0 && s3 < 0) }

// ============================================================ BÀI 13
function bai13(A, B, C, tag) {
  ok(dist(A, B) > dist(A, C), `13${tag}: AB>AC`)
  const D = mid(B, C)
  // E = chân phân giác trong: BE/EC = AB/AC
  const t = dist(A, B) / (dist(A, B) + dist(A, C))
  const E = lerp(B, C, t)
  // phân giác thật: góc BAE = góc EAC
  const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (dist(v, p) * dist(v, q)))
  eq(ang(A, B, E), ang(A, E, C), `13${tag}: AE phân giác`)
  const F = foot(C, A, E)
  ok(Math.abs(dot(sub(C, F), sub(E, A))) < 1e-9, `13${tag}: CF ⊥ AE`)
  const G = inter(C, F, A, D)
  // --- ý a ---
  const N = lerp(A, B, dist(A, C) / dist(A, B)) // N trên tia AB, AN = AC
  ok(between(N, A, B), `13${tag}: N nằm trong đoạn AB (vì AC<AB)`)
  eq(dist(A, N), dist(A, C), `13${tag}: AN=AC`)
  ok(onLine(F, C, N), `13${tag}: C,F,N thẳng hàng`)
  ok(len(sub(F, mid(C, N))) < 1e-9, `13${tag}: F là trung điểm CN`)
  ok(len(sub(G, inter(C, N, A, D))) < 1e-9, `13${tag}: G = CN ∩ AD`)
  ok(par(D, F, A, B), `13${tag}: DF ∥ AB`)
  // --- M ---
  const M = inter(D, F, A, C)
  ok(len(sub(M, mid(A, C))) < 1e-9, `13${tag}: M = DF∩AC là trung điểm AC`)
  ok(between(F, D, M), `13${tag}: F nằm giữa D và M`)
  ok(inside(F, A, D, C), `13${tag}: F nằm trong tam giác ADC`)
  ok(between(F, A, E) && between(F, C, G), `13${tag}: F giữa A,E và giữa C,G`)
  ok(between(E, D, C), `13${tag}: E thuộc đoạn DC`)
  ok(between(G, D, A), `13${tag}: G thuộc đoạn DA`)
  // --- ý b ---
  // đường qua F song song AC cắt DA tại P, DC tại Q
  const dirAC = sub(C, A)
  const Pp = inter(F, add(F, dirAC), D, A), Q = inter(F, add(F, dirAC), D, C)
  eq(dist(F, Pp) / dist(A, M), dist(D, F) / dist(D, M), `13${tag}: PF/AM = DF/DM`)
  eq(dist(F, Q) / dist(M, C), dist(D, F) / dist(D, M), `13${tag}: FQ/MC = DF/DM`)
  eq(dist(F, Pp), dist(F, Q), `13${tag}: PF = FQ`)
  eq(dist(G, Pp) / dist(G, A), dist(G, F) / dist(G, C), `13${tag}: GP/GA = GF/GC`)
  eq(dist(G, F) / dist(G, C), dist(F, Pp) / dist(A, C), `13${tag}: GF/GC = PF/AC`)
  eq(dist(E, Q) / dist(E, C), dist(E, F) / dist(E, A), `13${tag}: EQ/EC = EF/EA`)
  eq(dist(E, F) / dist(E, A), dist(F, Q) / dist(A, C), `13${tag}: EF/EA = FQ/AC`)
  eq(dist(G, F) / dist(G, C), dist(E, F) / dist(E, A), `13${tag}: GF/GC = EF/EA`)
  eq(dist(F, G) / dist(F, C), dist(F, E) / dist(F, A), `13${tag}: FG/FC = FE/FA (Thalès đảo)`)
  ok(par(G, E, A, C), `13${tag}: GE ∥ AC`)
  // --- ý c ---
  const K = inter(D, M, G, E)
  ok(len(sub(K, mid(G, E))) < 1e-9, `13${tag}: DF đi qua trung điểm GE`)
  eq(dist(G, K) / dist(A, M), dist(D, K) / dist(D, M), `13${tag}: GK/AM = DK/DM`)
  eq(dist(K, E) / dist(M, C), dist(D, K) / dist(D, M), `13${tag}: KE/MC = DK/DM`)
  ok(onLine(K, D, F), `13${tag}: K thuộc đường thẳng DF`)
}
bai13(P(1.5, 4), P(-3, 0), P(5, 0), 'a')
bai13(P(1, 5), P(-5, 0.4), P(4.5, 0), 'b')
bai13(P(7, 3), P(-2, 1), P(9, 8), 'c')
bai13(P(6.2, 3.4), P(0, 0), P(8, 0), 'd(hình vẽ)')

// ============================================================ BÀI 14
function bai14(A, B, C, D, F, tag, truongHopAnh) {
  // D ∈ BC, E = DF ∩ AC, F ∈ BA ngoài đoạn
  ok(between(D, B, C), `14${tag}: D thuộc BC`)
  ok(onLine(F, B, A) && !between(F, A, B), `14${tag}: F thuộc BA ngoài đoạn AB`)
  const E = inter(D, F, A, C)
  ok(between(E, A, C), `14${tag}: E thuộc cạnh AC`)
  const H = add(B, sub(E, D)) // BDEH hình bình hành: H = B + E − D
  ok(par(B, D, E, H) && par(B, H, D, E), `14${tag}: BDEH là hình bình hành`)
  const I = inter(F, add(F, sub(C, B)), H, A)
  eq(dist(F, I), dist(D, C), `14${tag}: FI = DC (KẾT LUẬN)`)
  const K = inter(F, I, A, C), M = inter(A, B, E, H)
  ok(par(F, I, E, H), `14${tag}: FI ∥ EH`)
  // lời giải (cho trường hợp F ngoài về phía A: thứ tự F, E, D)
  eq(dist(F, I) / dist(M, H), dist(F, K) / dist(M, E), `14${tag}: FI/MH = FK/ME (Thalès từ A)`)
  eq(dist(D, C) / dist(F, K), dist(D, E) / dist(F, E), `14${tag}: DC/FK = DE/FE`)
  eq(dist(B, D) / dist(M, E), dist(F, D) / dist(F, E), `14${tag}: BD/ME = FD/FE`)
  if (truongHopAnh) {
    ok(between(E, F, D), `14${tag}: thứ tự F, E, D`)
    ok(between(M, E, H), `14${tag}: M nằm giữa E và H`)
    eq(dist(B, D) - dist(M, E), dist(M, H), `14${tag}: BD−ME = MH`)
    eq(dist(M, H) / dist(M, E), dist(D, E) / dist(F, E), `14${tag}: MH/ME = DE/FE`)
    eq(dist(F, D) - dist(F, E), dist(D, E), `14${tag}: FD−FE = DE`)
    eq(dist(F, I) / dist(F, K), dist(D, C) / dist(F, K), `14${tag}: FI/FK = DC/FK`)
  }
  return { E, H, I, K, M }
}
bai14(P(2, 5), P(0, 0), P(8, 0), P(3, 0), P(2.8, 7), 'a', true)
bai14(P(1, 6), P(-1, 0), P(9, 0), P(2, 0), P(1.6, 7.8), 'b', true)
bai14(P(4, 7), P(0, 0), P(10, 0), P(6, 0), P(4 + (4) * 0.5, 7 + 7 * 0.5), 'c(F ngoài đoạn AB về phía A)', false) // chỉ thử FI=DC
// F phía B (ngoài hình mô tả): thử xem kết luận còn đúng không
try { bai14(P(3, 6), P(0, 0), P(9, 0), P(5, 0), P(-0.3, -0.6), 'd(F phía B)', false) } catch (e) { console.log('14d bỏ qua', e.message) }

// ============================================================ BÀI 15 — DE_SAU, chỉ kiểm số liệu hình vẽ (tam giác đồng dạng + kết luận)
{
  const th = 31 * Math.PI / 180, s = 1.28
  const rotS = (p, k) => { const r = Math.pow(s, k), a = k * th; return P(r * (p.x * Math.cos(a) - p.y * Math.sin(a)), r * (p.x * Math.sin(a) + p.y * Math.cos(a))) }
  const A = P(0, 0), B0 = P(10, 0)
  const pts = [A, rotS(B0, 0), rotS(B0, 1), rotS(B0, 2), rotS(B0, 3)] // A,B,C,D,E
  const [, B, C, D, E] = pts
  const ang = (v, p, q) => Math.acos(dot(sub(p, v), sub(q, v)) / (dist(v, p) * dist(v, q)))
  eq(ang(A, B, C), ang(A, C, D), '15: BAC = CAD'); eq(ang(A, C, D), ang(A, D, E), '15: CAD = DAE')
  eq(ang(B, A, C), ang(C, A, D), '15: ABC = ACD'); eq(ang(C, A, D), ang(D, A, E), '15: ACD = ADE')
  const M = inter(B, D, C, E)
  const Imid = mid(C, D)
  ok(onLine(Imid, A, M), '15: AM đi qua trung điểm CD (kết luận)')
}

// ============================================================ BÀI 16
function bai16(A, B, C, m, tag) {
  const D = mid(A, C), E = mid(A, B)
  const O = inter(B, D, C, E)
  ok(len(sub(O, P((A.x + B.x + C.x) / 3, (A.y + B.y + C.y) / 3))) < 1e-9, `16${tag}: O là trọng tâm`)
  eq(dist(O, E) / dist(C, E), 1 / 3, `16${tag}: OE = CE/3`); eq(dist(O, D) / dist(B, D), 1 / 3, `16${tag}: OD = BD/3`)
  const M = lerp(B, C, m)
  const G = inter(M, add(M, sub(D, B)), A, C)   // MG ∥ BD, G ∈ AC
  const H = inter(M, add(M, sub(E, C)), A, B)   // MH ∥ CE, H ∈ AB
  ok(par(M, G, B, D) && par(M, H, C, E), `16${tag}: MG∥BD, MH∥CE`)
  ok(between(G, A, C) && between(H, A, B), `16${tag}: G∈AC, H∈AB (đoạn)`)
  const Nn = inter(H, M, B, D)   // N = HM ∩ BD
  const Pp = inter(G, M, C, E)   // P = GM ∩ CE
  const I = inter(H, G, B, D)    // I = HG ∩ BD
  const K = inter(H, G, C, E)    // K = HG ∩ CE
  // chuỗi tỉ số của ý a
  eq(dist(H, Nn) / dist(H, M), dist(E, O) / dist(E, C), `16${tag}: HN/HM = EO/EC`)
  eq(dist(H, Nn) / dist(H, M), 1 / 3, `16${tag}: HN/HM = 1/3`)
  eq(dist(H, I) / dist(H, G), dist(H, Nn) / dist(H, M), `16${tag}: HI/HG = HN/HM`)
  eq(dist(G, Pp) / dist(G, M), dist(D, O) / dist(D, B), `16${tag}: GP/GM = DO/DB`)
  eq(dist(G, Pp) / dist(G, M), 1 / 3, `16${tag}: GP/GM = 1/3`)
  eq(dist(G, K) / dist(G, H), dist(G, Pp) / dist(G, M), `16${tag}: GK/GH = GP/GM`)
  eq(dist(H, I), dist(I, K), `16${tag}: HI = IK`); eq(dist(I, K), dist(K, G), `16${tag}: IK = KG`)
  ok(between(I, H, K) && between(K, I, G), `16${tag}: thứ tự H, I, K, G`)
  // ý b
  ok(par(O, Nn, M, Pp) && par(O, Pp, M, Nn), `16${tag}: ONMP là hình bình hành`)
  ok(len(sub(mid(O, M), mid(Nn, Pp))) < 1e-9, `16${tag}: hai đường chéo OM, NP cắt nhau tại trung điểm`)
  ok(par(Nn, Pp, H, G), `16${tag}: NP ∥ HG`)
  const L = mid(Nn, Pp)
  ok(onLine(L, M, O), `16${tag}: trung điểm NP thuộc MO`)
  const Jm = mid(H, G)
  ok(onLine(Jm, M, O), `16${tag}: MO đi qua trung điểm HG (KẾT LUẬN)`)
  // bổ đề hình thang: thang NPGH (đáy NP, HG; hai cạnh bên HN, GP cắt nhau tại M)
  ok(onLine(M, H, Nn) && onLine(M, G, Pp), `16${tag}: cạnh bên HN, GP đi qua M`)
  ok(onLine(mid(Nn, Pp), M, Jm), `16${tag}: M, trung điểm NP, trung điểm HG thẳng hàng`)
  // MN/MH = MP/MG = 2/3
  eq(dist(M, Nn) / dist(M, H), 2 / 3, `16${tag}: MN/MH=2/3`); eq(dist(M, Pp) / dist(M, G), 2 / 3, `16${tag}: MP/MG=2/3`)
}
bai16(P(2, 8), P(-3, 0), P(7, 0), 0.4, 'a')
bai16(P(0.5, 6.5), P(-2, 1), P(9, -1), 0.75, 'b')
bai16(P(5, 9), P(0, 0), P(10, 2), 0.15, 'c')

// ============================================================ BÀI 17
function bai17(c1, d1, k, p, n, tag, kiemKetLuan) {
  const O = P(0, 0)
  const C = c1, D = d1, A = mul(c1, -k), B = mul(d1, -k)
  ok(par(A, B, C, D), `17${tag}: AB ∥ CD`)
  const Pp = mul(c1, p), N = mul(d1, n)
  const M = sub(mul(N, 2), Pp), Q = sub(mul(Pp, 2), N)
  ok(onLine(M, N, Pp) && onLine(Q, N, Pp), `17${tag}: M,N,P,Q thẳng hàng`)
  ok(onLine(M, A, D), `17${tag}: M ∈ AD`); ok(onLine(Q, B, C), `17${tag}: Q ∈ BC`)
  ok(between(M, A, D) && between(Q, B, C), `17${tag}: M∈đoạn AD, Q∈đoạn BC`)
  eq(dist(M, N), dist(N, Pp), `17${tag}: MN=NP`); eq(dist(N, Pp), dist(Pp, Q), `17${tag}: NP=PQ`)
  ok(between(N, D, O) && between(Pp, O, C), `17${tag}: N∈đoạn OD, P∈đoạn OC`)
  const khongSong = !par(M, Q, C, D)
  if (!kiemKetLuan) { console.log(`   (17${tag}: d ${khongSong ? 'KHÔNG' : 'CÓ'} song song CD; AB/CD = ${(dist(A, B) / dist(C, D)).toFixed(4)})`); return }
  ok(khongSong, `17${tag}: d không song song CD`)
  eq(dist(C, D), 2 * dist(A, B), `17${tag}: CD = 2AB (KẾT LUẬN)`)
  // J, K: qua M kẻ ∥ AC cắt BD tại J; qua Q kẻ ∥ BD cắt AC tại K
  const J = inter(M, add(M, sub(C, A)), B, D), K = inter(Q, add(Q, sub(D, B)), A, C)
  ok(len(sub(N, mid(O, J))) < 1e-9, `17${tag}: N là trung điểm OJ`)
  ok(len(sub(Pp, mid(O, K))) < 1e-9, `17${tag}: P là trung điểm OK`)
  eq(dist(M, J), dist(O, Pp), `17${tag}: MJ = OP`); eq(dist(Q, K), dist(O, N), `17${tag}: QK = ON`)
  ok(between(J, O, D) && between(K, O, C), `17${tag}: J∈đoạn OD, K∈đoạn OC`)
  eq(dist(M, J) / dist(A, O), dist(D, J) / dist(D, O), `17${tag}: MJ/AO = DJ/DO`)
  eq(dist(Q, K) / dist(B, O), dist(C, K) / dist(C, O), `17${tag}: QK/BO = CK/CO`)
  const x = dist(O, Pp) / dist(O, C), y = dist(O, N) / dist(O, D)
  eq(x, k * (1 - 2 * y), `17${tag}: x = k(1−2y)`); eq(y, k * (1 - 2 * x), `17${tag}: y = k(1−2x)`)
  eq(dist(O, A) / dist(O, C), dist(A, B) / dist(C, D), `17${tag}: OA/OC = AB/CD`)
  eq(dist(O, B) / dist(O, D), dist(A, B) / dist(C, D), `17${tag}: OB/OD = AB/CD`)
  ok(x + y > 0 && Math.abs(x + y - 0.5) < 1e-9, `17${tag}: x+y=1/2 (k=1/2)`)
}
bai17(P(5, -4.2857), P(-5, -4.2857), 0.5, 0.15, 0.35, 'a', true)
bai17(P(6, -2), P(-3, -5), 0.5, 0.3, 0.2, 'b', true)
bai17(P(4, -1), P(-7, -3), 0.5, 0.05, 0.45, 'c', true)
// phản ví dụ khi d ∥ đáy (đề sách thiếu điều kiện): p = n = k/(1+2k), k ≠ 1/2
{
  const k = 0.4, p = k / (1 + 2 * k)
  bai17(P(5, -4.2857), P(-5, -4.2857), k, p, p, 'e(PHẢN VÍ DỤ d∥CD, k=0.4)', false)
}

console.log(`\nTổng ${tong} phép kiểm, FAIL = ${fail}`)
