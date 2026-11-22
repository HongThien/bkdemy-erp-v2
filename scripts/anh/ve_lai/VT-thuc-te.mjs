// Vẽ lại hình ĐỀ — HGT K10, nhóm bài "Bài toán thực tế véc tơ" (NNB01524: NDB00914 · 00915 · 00916 · 00917 · 01425). Thùy 22/11: "có vài hình chất lượng khá thấp".
//   node scripts/anh/ve_lai/VT-thuc-te.mjs <thu_muc_ra> [loA|loB|loC|all]
// Ảnh gốc là ảnh cắt (nhap_kho) mờ / nhỏ / scan bẩn / còn chữ thừa ⇒ vẽ lại bằng code (spec-giai-bai §A8, mã lỗi a/b/e).
// Quy ước: KHÔNG vẽ hợp lực / đáp số (đề hỏi cái nào thì không vẽ cái đó); số liệu chỉ là số đề cho. Mũi tên vectơ, nhãn F có chỉ số dưới.
import { P, seg, segDash, dot, label, num, mid, lerp, ray, angleMark, angleText, rightAngle, hinh, xuatTat, circle, poly, fill } from '../ve_hinh_lib.mjs'
import { vecto, vectoDash } from '../ve_vecto_lib.mjs'

const RA = process.argv[2]
const LO = process.argv[3] || 'all'
const f = (n) => Math.round(n * 100) / 100
const FF = `font-family="'Times New Roman',Times,serif"`

/** Nhãn vectơ F₁… : chữ nghiêng, chỉ số dưới, mũi tên mảnh phía trên */
const vl = (p, base, sub, dx = 0, dy = 0, size = 26) => {
  const x = p.x + dx, y = p.y + dy, w = size * 0.62 + (sub ? size * 0.34 : 0), ay = y - size * 0.8
  return `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" fill="#111" stroke="none" ${FF} font-style="italic" font-size="${size}">${base}${sub ? `<tspan font-size="${Math.round(size * 0.68)}" dy="${Math.round(size * 0.2)}" font-style="normal">${sub}</tspan>` : ''}</text>`
    + `<line x1="${f(x - w / 2)}" y1="${f(ay)}" x2="${f(x + w / 2)}" y2="${f(ay)}" stroke-width="1.4"/>`
    + `<path d="M ${f(x + w / 2 + 2)} ${f(ay)} L ${f(x + w / 2 - 5)} ${f(ay - 3.2)} L ${f(x + w / 2 - 5)} ${f(ay + 3.2)} Z" fill="#111" stroke="none"/>`
}
const O0 = P(0, 0)
const hatch = (a, b, down = 12) => { // đường nền có gạch xiên phía dưới (a→b nằm ngang)
  let s = seg(a, b)
  for (let x = a.x + 8; x < b.x - 4; x += 12) s += `<line x1="${f(x)}" y1="${f(a.y)}" x2="${f(x - 9)}" y2="${f(a.y + down)}" stroke-width="1.2"/>`
  return s
}
const goc = (O, p, q, t, r = 34, rr = 56, size = 22) => angleMark(O, p, q, r, 1) + angleText(O, p, q, t, rr, size)

// ───────────── LÔ A (mã a — nhỏ / mờ / nhãn li ti) ─────────────

// T3100000001441 — công của lực F=90 N, hợp với dịch chuyển 60°, s = 100 m
function f1441() {
  const O = P(0, 0), M = P(230, 0), F = ray(O, 60, 150)
  hinh('T3100000001441', [P(-40, -140), M, P(280, 30)], [
    hatch(P(-40, 18), P(270, 18)), `<rect x="-17" y="-17" width="34" height="34" fill="#ccc"/>`,
    vecto(O, M), vecto(O, F), goc(O, M, F, '60°', 38, 62),
    dot(O), label(O, 'O', -32, 8), dot(M), label(M, 'M', 14, -12),
    vl(F, 'F', '', 22, -6), num(lerp(O, F, 0.5), '90 N', -30, -4, 22), num(lerp(O, M, 0.62), 's = 100 m', 0, -12, 22),
  ], { pad: 30, padDuoi: 46 })
}

// T310000000330 — ba lực cân bằng tại A: F2 ngang →, F1 ↓ (vuông góc F2), F3 hợp F2 góc 120°
function f330() {
  const A = P(0, 0), F2 = ray(A, 0, 100), F1 = ray(A, -90, 160), F3 = ray(A, 120, 190)
  hinh('T310000000330', [P(F3.x - 40, F3.y - 36), F2, F1, P(-30, 0)], [
    vecto(A, F2), vecto(A, F1), vecto(A, F3), rightAngle(A, F1, F2, 14), goc(A, F2, F3, '120°', 30, 56, 22), dot(A), label(A, 'A', -14, 22),
    vl(F2, 'F', '2', 4, 36), vl(F1, 'F', '1', 30, 6), vl(F3, 'F', '3', -34, 8),
  ], { pad: 40, padDuoi: 44 })
}

// T310000000153 — tàu đi A→C hướng đông 24 km/h × 30 phút, C→B hướng nam 30 km/h × 45 phút (AC = 12 km, CB = 22,5 km)
function f153() {
  const k = 9, A = P(0, 0), C = P(12 * k, 0), B = P(12 * k, 22.5 * k)
  const la = P(190, 30) // la bàn
  hinh('T310000000153', [P(-30, -30), B, P(250, 70)], [
    vecto(A, C), vecto(C, B), vectoDash(A, B), dot(A), dot(C), dot(B),
    label(A, 'A', -16, 6), label(C, 'C', 10, -12), label(B, 'B', 14, 18),
    num(lerp(A, C, 0.5), '24 km/h', 0, -14, 20), num(P(C.x + 50, C.y + 105), '30 km/h', 0, 0, 20),
    // la bàn
    vecto(la, P(la.x, la.y - 46)), vecto(la, P(la.x + 46, la.y)), seg(la, P(la.x - 30, la.y)), seg(la, P(la.x, la.y + 30)),
    num(P(la.x, la.y - 56), 'Bắc', 0, 0, 20), num(P(la.x + 64, la.y + 7), 'Đông', 0, 0, 20), num(P(la.x - 52, la.y + 7), 'Tây', 0, 0, 20), num(P(la.x, la.y + 52), 'Nam', 0, 0, 20),
  ], { pad: 34, padDuoi: 40 })
}

// T310000000998 — ca nô hướng S15°E, 21 km/h; nước chảy hướng đông 2 km/h (không vẽ vận tốc riêng — là đáp án)
function f998() {
  const O = P(0, 0), k = 8.5, V = ray(O, -75, 21 * k), W = ray(O, 0, 2 * k + 22)
  hinh('T310000000998', [P(-170, -120), P(190, 215), P(-170, 215)], [
    seg(P(-140, 0), P(150, 0)), seg(P(0, -100), P(0, 195)),
    `<path d="M 150 0 l -9 -4 v 8 z M 0 -100 l -4 9 h 8 z" fill="#222" stroke="none"/>`,
    num(P(174, 7), 'Đông', 0, 0, 20), num(P(-156, 7), 'Tây', 0, 0, 20), num(P(0, -110), 'Bắc', 0, 0, 20), num(P(0, 222), 'Nam', 0, 0, 20),
    vecto(O, V), vecto(O, W), angleMark(O, ray(O, -90, 60), V, 58, 1) + num(P(-30, 96), '15°', 0, 0, 20), dot(O), label(O, 'O', -14, -8),
    num(P(V.x + 56, V.y - 30), '21 km/h', 0, 0, 20), num(P(W.x - 4, W.y - 14), '2 km/h', 0, 0, 20),
  ], { pad: 36, padDuoi: 40 })
}

// T310010104007 — tàu đi hướng đông 30 km/h, nước chảy từ nam lên bắc 5 km/h
function f4007() {
  const O = P(0, 0)
  hinh('T310010104007', [P(-100, -150), P(330, 60), P(-100, 60)], [
    seg(P(-90, 0), P(-60, 0)), `<path d="M -92 -14 L 30 -14 L 18 12 L -80 12 Z" fill="#d9e6f2"/>` + `<path d="M -10 -14 L -10 -34 L 10 -34 L 10 -14" fill="#fff"/>`,
    vecto(P(30, -1), P(190, -1)), vecto(P(-30, -16), P(-30, -110)),
    num(P(115, -16), 'vận tốc tàu: 30 km/h', 0, 0, 19), num(P(-24, -120), 'dòng nước: 5 km/h', 0, 0, 19),
    // la bàn
    vecto(P(270, 40), P(270, -10)), num(P(270, -20), 'Bắc', 0, 0, 18), vecto(P(270, 40), P(318, 40)), num(P(300, 62), 'Đông', 0, 0, 18),
  ], { pad: 26, padDuoi: 30 })
}

// T310000000310 — treo bóng đèn bằng sợi dây vắt qua móc; hai nửa dây hợp nhau 60°; P = trọng lực của đèn
function f310() {
  const H = P(0, 0), A = ray(H, 120, 190), B = ray(H, 60, 190)
  hinh('T310000000310', [P(-120, -200), P(120, 130), P(-120, 130)], [
    hatch(P(-120, -176), P(120, -176), -12).replace(/y2="-1[0-9][0-9](\.\d+)?"/g, (m) => m), seg(P(-120, -176), P(120, -176)),
    seg(H, A), seg(H, B), `<path d="M -8 0 q 0 14 8 14 q 8 0 8 -14" fill="none"/>`,
    `<circle cx="0" cy="42" r="22" fill="#fff6c8"/>` + `<rect x="-9" y="18" width="18" height="12" fill="#bbb"/>`,
    goc(H, A, B, '60°', 30, 56, 20),
    vecto(P(0, 42), P(0, 124)), vl(P(0, 124), 'P', '', 22, 4, 24),
  ], { pad: 30, padDuoi: 40 })
}

// T310000000329 — hai xe bán tải móc vào đuôi "xe tải quái vật", kéo 2000 lb và 3000 lb, hợp nhau 45° (nhìn từ trên xuống)
function f329() {
  const H = P(0, 0), a1 = 22.5, a2 = -22.5
  const xe = (ang, L, ten) => { // xe bán tải: hình chữ nhật xoay theo phương dây, mũi xe ở cuối sợi dây
    const e = ray(H, ang, L)
    return `<g transform="translate(${f(e.x)} ${f(e.y)}) rotate(${-ang})"><rect x="0" y="-15" width="86" height="30" rx="4" fill="#dfe7ee"/><rect x="6" y="-11" width="30" height="22" rx="3" fill="#fff"/><rect x="12" y="-19" width="16" height="5" fill="#444" stroke="none"/><rect x="12" y="14" width="16" height="5" fill="#444" stroke="none"/><rect x="58" y="-19" width="16" height="5" fill="#444" stroke="none"/><rect x="58" y="14" width="16" height="5" fill="#444" stroke="none"/></g>`
  }
  hinh('T310000000329', [P(-200, -130), P(285, 130), P(-200, 130)], [
    `<rect x="-200" y="-30" width="170" height="60" rx="4" fill="#f4d9d0"/><rect x="-196" y="-24" width="40" height="48" rx="3" fill="#fff"/>`,
    seg(P(-30, 0), H), seg(H, ray(H, a1, 190)), seg(H, ray(H, a2, 190)), xe(a1, 190), xe(a2, 190), dot(H),
    angleMark(H, ray(H, a1, 1), ray(H, a2, 1), 55, 1), num(P(78, 6), '45°', 0, 0, 20),
    num(P(104, -52), '2000 lb', 0, 0, 20), num(P(104, 76), '3000 lb', 0, 0, 20),
  ], { pad: 26, padDuoi: 30 })
}

// T310000000333 — hai cần cẩu nâng vật nặng 20240 lb; cáp hợp phương ngang các góc 24,3° (trái) và 44,5° (phải)
function f333() {
  const G = P(0, 0), TL = ray(G, 180 - 24.3, 260), TR = ray(G, 44.5, 280), nen = 130
  const thap = (T, w) => `<rect x="${f(T.x - w / 2)}" y="${f(T.y)}" width="${w}" height="${f(nen - T.y)}" fill="#e8d8a8"/>`
  hinh('T310000000333', [TL, TR, P(TL.x - 20, nen), P(TR.x + 20, nen)], [
    seg(P(TL.x - 40, nen), P(TR.x + 40, nen)), thap(TL, 18), thap(TR, 18),
    seg(TL, G), seg(TR, G), `<circle cx="0" cy="0" r="5" fill="#222"/>`,
    `<rect x="-36" y="14" width="72" height="42" rx="3" fill="#cfd8e3"/><line x1="0" y1="0" x2="0" y2="14"/>`, num(P(0, 42), '20240 lb', 0, 0, 18),
    segDash(G, P(-130, 0)), segDash(G, P(120, 0)),
    angleMark(G, P(-1, 0), TL, 70, 1), num(P(-92, -18), '24,3°', 0, 0, 17),
    angleMark(G, P(1, 0), TR, 56, 1), num(P(88, -26), '44,5°', 0, 0, 17),
  ], { pad: 24, padDuoi: 30 })
}

// T310010104015 — con khỉ treo trên dây, trọng lượng 28 N; dây tạo với phương ngang 14° (trái) và 20° (phải)
function f4015() {
  const O = P(0, 0), L = P(-200, -200 * Math.tan(14 * Math.PI / 180)), R = P(137, -137 * Math.tan(20 * Math.PI / 180))
  hinh('T310010104015', [P(-215, -150), P(150, 110), P(-215, 110)], [
    `<rect x="-212" y="${f(L.y - 14)}" width="14" height="${f(110 - L.y + 14)}" fill="#ddd"/><rect x="130" y="${f(R.y - 14)}" width="14" height="${f(110 - R.y + 14)}" fill="#ddd"/>`,
    seg(L, O), seg(O, R), segDash(P(-190, 0), P(130, 0)),
    // khỉ
    `<circle cx="0" cy="22" r="9" fill="#e7c9a0"/><ellipse cx="0" cy="52" rx="10" ry="17" fill="#e7c9a0"/><path d="M 0 0 L -8 14 M 0 0 L 8 14" /><path d="M 8 60 q 18 6 14 -14" fill="none"/>`,
    angleMark(O, P(-1, 0), L, 62, 1), num(P(-86, 24), '14°', 0, 0, 20), angleMark(O, P(1, 0), R, 56, 1), num(P(84, 24), '20°', 0, 0, 20),
    vecto(O, ray(O, 180 - 14, 90)), vecto(O, ray(O, 20, 90)), vl(ray(O, 180 - 14, 90), 'T', '1', -8, -20), vl(ray(O, 20, 90), 'T', '2', 14, -24),
    // trục xOy
    vecto(P(-34, -86), P(-34, -144)), vecto(P(-34, -86), P(10, -86)), num(P(-50, -138), 'y', 0, 0, 20), num(P(20, -80), 'x', 0, 0, 20), label(P(-34, -86), 'O', -14, 20),
  ], { pad: 26, padDuoi: 30 })
}

// T3100000001365 — xe kéo bởi lực F = 50 N (30° so với AB), F phân tích thành F₁ (đứng) và F₂ (ngang); AB = 200 m
function f1365() {
  const A = P(150, -30), F = ray(A, 30, 190), F1 = P(A.x, F.y), F2 = P(F.x, A.y), B = P(480, -30)
  hinh('T3100000001365', [P(-10, -150), B, P(-10, 20)], [
    hatch(P(-10, 12), P(560, 12)),
    `<rect x="0" y="-60" width="150" height="48" rx="4" fill="#dfe7ee"/><rect x="12" y="-52" width="40" height="30" fill="#fff"/><circle cx="34" cy="-6" r="14" fill="#fff"/><circle cx="112" cy="-6" r="14" fill="#fff"/>`,
    vecto(A, F2), vecto(A, F1), vecto(A, F), segDash(F1, F), segDash(F2, F), dot(A), label(A, 'A', 4, 28), dot(B), label(B, 'B', 14, -10), `<line x1="${A.x}" y1="${A.y + 62}" x2="${B.x}" y2="${A.y + 62}" stroke-width="1.4"/><line x1="${A.x}" y1="${A.y + 54}" x2="${A.x}" y2="${A.y + 70}" stroke-width="1.4"/><line x1="${B.x}" y1="${A.y + 54}" x2="${B.x}" y2="${A.y + 70}" stroke-width="1.4"/>`,
    goc(A, F2, F, '30°', 44, 76, 20),
    vl(F, 'F', '', 22, -8), vl(F1, 'F', '1', -20, -4), vl(F2, 'F', '2', 0, 36),
    num(P((A.x + B.x) / 2, A.y + 86), '200 m', 0, 0, 19),
  ], { pad: 26, padDuoi: 70 })
}

// ───────────── LÔ B (mã e — ảnh scan bẩn / hạt nhiễu) ─────────────

// T310000000295 + T310010104005 — hai người kéo thuyền: A kéo 60 N, B kéo 80 N, hai lực hợp nhau 90°
function f295() {
  const O = P(0, 0), A = ray(O, 45, 130), B = ray(O, -45, 175)
  hinh('T310000000295+T310010104005', [A, B, P(-50, 0)], [
    vecto(O, A), vecto(O, B), rightAngle(O, A, B, 16), dot(O),
    label(O, 'O', -16, 8), label(A, 'A', 20, -6), label(B, 'B', 20, 20), num(lerp(O, A, 0.5), '60 N', -24, -22, 20), num(lerp(O, B, 0.5), '80 N', -26, 30, 20),
  ], { pad: 36, padDuoi: 44 })
}

// T310000000978 — F₁ = MA, F₂ = MB tác động vào vật tại M, góc AMB = 90°; 400 N và 300 N
function f978() {
  const M = P(0, 0), A = ray(M, 0, 190), B = ray(M, -90, 140)
  hinh('T310000000978', [A, B, P(-40, -30)], [
    `<rect x="-30" y="-24" width="60" height="48" fill="#ccc"/>`, vecto(M, A), vecto(M, B), rightAngle(M, A, B, 16), dot(M),
    label(M, 'M', -4, -34), label(A, 'A', 22, 8), label(B, 'B', 22, 8),
    vl(lerp(M, A, 0.55), 'F', '1', 0, -14), vl(lerp(M, B, 0.5), 'F', '2', -28, 4),
  ], { pad: 36, padDuoi: 40 })
}

// T310000000455 — F₁ = 2·F₂ ngược chiều; F₃, F₄ hợp với F₂ góc 45° (F₂ ngắn, ở bên phải); F₃ = F₄ = 50 N
function f455() {
  const O = P(0, 0), k = 1
  hinh('T310000000455', [P(-230, -90), P(150, 90)], [
    `<circle cx="0" cy="0" r="16" fill="#ddd"/>`, vecto(O, P(-210, 0)), vecto(O, P(110, 0)),
    vectoDash(O, ray(O, 45, 100)), vectoDash(O, ray(O, -45, 100)),
    goc(O, P(1, 0), ray(O, 45, 1), '45°', 40, 62, 18), goc(O, P(1, 0), ray(O, -45, 1), '45°', 46, 70, 18),
    dot(O), label(O, 'O', -14, -22),
    vl(P(-120, 0), 'F', '1', 0, -14), vl(P(78, 0), 'F', '2', 38, -16), vl(ray(O, 45, 100), 'F', '3', 22, -14), vl(ray(O, -45, 100), 'F', '4', 22, 34),
  ], { pad: 30, padDuoi: 42 })
}

// T3100000001439 — F₂ = 2·F₁ ngược chiều; F₃, F₄ hợp với F₁ góc 45° (F₁ ngắn, ở bên phải); F₃ = F₄ = 20 N
function f1439() {
  const O = P(0, 0)
  hinh('T3100000001439', [P(-230, -90), P(150, 90)], [
    `<circle cx="0" cy="0" r="16" fill="#ddd"/>`, vecto(O, P(-210, 0)), vecto(O, P(110, 0)),
    vectoDash(O, ray(O, 45, 100)), vectoDash(O, ray(O, -45, 100)),
    goc(O, P(1, 0), ray(O, 45, 1), '45°', 40, 62, 18), goc(O, P(1, 0), ray(O, -45, 1), '45°', 46, 70, 18),
    dot(O), label(O, 'O', -14, -22),
    vl(P(-120, 0), 'F', '2', 0, -14), vl(P(78, 0), 'F', '1', 38, -16), vl(ray(O, 45, 100), 'F', '3', 22, -14), vl(ray(O, -45, 100), 'F', '4', 22, 34),
  ], { pad: 30, padDuoi: 42 })
}

// ───────────── LÔ C (mã b — còn chữ thừa / chữ chìm; hoặc hình đã vẽ sẵn hợp lực) ─────────────

// T310010104017 — F₁ = OA, F₂ = OB ngược chiều (F₂ = 2F₁); F₃ = OC, F₄ = OD; ∠AOC = ∠AOD = 45°
function f4017() {
  const O = P(0, 0), A = P(110, 0), B = P(-210, 0), C = ray(O, 45, 100), D = ray(O, -45, 100)
  hinh('T310010104017', [P(-250, -100), P(150, 100)], [
    `<circle cx="0" cy="0" r="16" fill="#ddd"/>`, vecto(O, A), vecto(O, B), vectoDash(O, C), vectoDash(O, D),
    goc(O, A, C, '45°', 40, 62, 18), goc(O, A, D, '45°', 46, 70, 18),
    dot(O), label(O, 'O', -14, -22), label(A, 'A', 20, 8), label(B, 'B', -18, 8), label(C, 'C', 18, -8), label(D, 'D', 20, 26),
    vl(P(-110, 0), 'F', '2', 0, -14), vl(P(78, 0), 'F', '1', 38, -16), vl(lerp(O, C, 0.65), 'F', '3', -6, -22), vl(lerp(O, D, 0.65), 'F', '4', -10, 40),
  ], { pad: 30, padDuoi: 42 })
}

// T310010104014 — hai lực có chung điểm đặt A, tạo góc 30°, 60 N và 90 N (không vẽ hợp lực — là đáp án)
function f4014() {
  const A = P(0, 0), F1 = ray(A, 0, 150), F2 = ray(A, 30, 225)
  hinh('T310010104014', [P(F2.x + 20, F2.y - 30), F1, P(-30, 0)], [
    vecto(A, F1), vecto(A, F2), goc(A, F1, F2, '30°', 46, 78, 20), dot(A), label(A, 'A', -16, 20),
    vl(F1, 'F', '1', 4, 38), vl(F2, 'F', '2', 14, -16), num(lerp(A, F1, 0.55), '60 N', 0, 28, 19), num(lerp(A, F2, 0.6), '90 N', -22, -18, 19),
  ], { pad: 36, padDuoi: 44 })
}

// T310010104013 + T310010104006 + T310010102071 — ba lực F₁ = MA, F₂ = MB, F₃ = MC tại M, vật đứng yên, ∠AMB = 60°, F₁ = F₂
function f3luc() {
  const M = P(0, 0), A = ray(M, 30, 130), B = ray(M, -30, 130), C = ray(M, 180, 130 * Math.sqrt(3))
  hinh('T310010104013+T310010104006+T310010102071', [A, B, C, P(30, 0)], [
    vecto(M, A), vecto(M, B), vecto(M, C), goc(M, A, B, '60°', 36, 66, 20), dot(M),
    label(M, 'M', 14, 30), label(A, 'A', 20, -6), label(B, 'B', 20, 20), label(C, 'C', -12, 22),
    vl(lerp(M, A, 0.6), 'F', '1', 0, -22), vl(lerp(M, B, 0.6), 'F', '2', 0, 44), vl(lerp(M, C, 0.55), 'F', '3', 0, -14),
  ], { pad: 36, padDuoi: 46 })
}

// T310000000281 — hai lực F₁, F₂ có điểm đặt A, hợp nhau 60°, 50 N và 60 N
function f281() {
  const A = P(0, 0), F1 = ray(A, 0, 150), F2 = ray(A, 60, 180)
  hinh('T310000000281', [F2, F1, P(-30, 0)], [
    vecto(A, F1), vecto(A, F2), goc(A, F1, F2, '60°', 40, 70, 20), dot(A), label(A, 'A', -16, 20),
    vl(F1, 'F', '1', 4, 38), vl(F2, 'F', '2', 14, -12), num(lerp(A, F1, 0.55), '50 N', 0, 28, 19), num(lerp(A, F2, 0.6), '60 N', -26, -4, 19),
  ], { pad: 36, padDuoi: 44 })
}

// T310000000298 — hai người kéo thuyền bị mắc cạn: F₁ = 80 N, F₂ = 100 N, hợp nhau 60°
function f298() {
  const O = P(0, 0), F1 = ray(O, 30, 144), F2 = ray(O, -30, 180)
  hinh('T310000000298', [F1, F2, P(-50, 0)], [
    vecto(O, F1), vecto(O, F2), goc(O, F1, F2, '60°', 44, 76, 20), dot(O), label(O, 'O', -14, 24),
    vl(F1, 'F', '1', 16, -14), vl(F2, 'F', '2', 16, 40), num(lerp(O, F1, 0.55), '80 N', 0, -22, 19), num(lerp(O, F2, 0.55), '100 N', 0, 36, 19),
  ], { pad: 36, padDuoi: 44 })
}

// T310010104010 — F₁ = OA (400 N), F₂ = OB (600 N), ∠AOB = 60° (không vẽ hợp lực)
function f4010() {
  const O = P(0, 0), A = ray(O, 30, 140), B = ray(O, -30, 210)
  hinh('T310010104010', [A, B, P(-50, 0)], [
    vecto(O, A), vecto(O, B), goc(O, A, B, '60°', 44, 76, 20), dot(O),
    label(O, 'O', -14, 24), label(A, 'A', 20, -6), label(B, 'B', 20, 20),
    vl(lerp(O, A, 0.6), 'F', '1', 8, -22), vl(lerp(O, B, 0.6), 'F', '2', 8, 44), num(lerp(O, A, 0.6), '400 N', 54, 16, 18), num(lerp(O, B, 0.6), '600 N', 56, 12, 18),
  ], { pad: 36, padDuoi: 46 })
}

const LOT = {
  loA: [f1441, f330, f153, f998, f4007, f310, f329, f333, f4015, f1365],
  loB: [f295, f978, f455, f1439],
  loC: [f4017, f4014, f3luc, f281, f298, f4010],
}
for (const [k, ds] of Object.entries(LOT)) if (LO === 'all' || LO === k) for (const d of ds) d()
await xuatTat(RA)
