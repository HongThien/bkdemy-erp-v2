// ve-lai-hinh.mjs — VẼ LẠI 8 hình đề CLC mờ/nhỏ + hình NTL 2024·P2.2 (đề sửa AM = 2/5 AD) + DỰNG hình NTT 2019·1 (Thùy duyệt 21/11).
//   node kho-rules/dai/lo/clc6/ve-lai-hinh.mjs <thư mục ra>     → <ra>/CLC6-<slug>.png (+ .svg), PNG 2x qua Chrome (scripts/anh/ve_hinh_lib.mjs)
// Mỗi hình khớp dữ kiện đề: số đo / tỉ lệ dựng bằng toạ độ, không ước mắt. Đáp số đã đối chiếu ở soan.json.
import { luu } from '../../../../scripts/anh/ve_hinh_lib.mjs'
const OUT = process.argv[2]; if (!OUT) { console.error('Dùng: node ve-lai-hinh.mjs <thư mục ra>'); process.exit(2) }
const F = `font-family="'Times New Roman',Times,serif"`
const doc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`
const S = 'stroke="#222" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'
const txt = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a ?? 'middle'}" ${F} font-size="${o.s ?? 24}" ${o.i ? 'font-style="italic"' : ''} ${o.b ? 'font-weight="bold"' : ''} fill="#111">${t}</text>`
const frac = (x, y, a, b, s = 24) => `${txt(x, y - 4, a, { s })}<line x1="${x - s * 0.7}" y1="${y + 2}" x2="${x + s * 0.7}" y2="${y + 2}" stroke="#111" stroke-width="1.6"/>${txt(x, y + s * 0.95, b, { s })}`
const pts = (a) => a.map((p) => p.join(',')).join(' ')
const HINH = {}

// 1. LTV 2018·13 — 4 đường tròn tâm ở 4 đỉnh hình vuông, bán kính = nửa cạnh; tô phần hình vuông nằm ngoài 4 hình quạt
{ const r = 60, x0 = 90, y0 = 90, V = [[x0, y0], [x0 + 2 * r, y0], [x0, y0 + 2 * r], [x0 + 2 * r, y0 + 2 * r]]
  HINH['LTV-2018-13'] = [300, 300, `<defs><clipPath id="q"><rect x="${x0}" y="${y0}" width="${2 * r}" height="${2 * r}"/></clipPath></defs>
    <rect x="${x0}" y="${y0}" width="${2 * r}" height="${2 * r}" fill="#bdbdbd"/><g clip-path="url(#q)">${V.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}</g>
    <rect x="${x0}" y="${y0}" width="${2 * r}" height="${2 * r}" fill="none" ${S}/>${V.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" ${S}/>`).join('')}`] }

// 2. LTV 2019·20 — lưới 6 cột × 5 hàng (đáp số 70 hình vuông)
{ const c = 44, x0 = 24, y0 = 24; let s = ''
  for (let i = 0; i <= 6; i++) s += `<line x1="${x0 + i * c}" y1="${y0}" x2="${x0 + i * c}" y2="${y0 + 5 * c}" ${S}/>`
  for (let j = 0; j <= 5; j++) s += `<line x1="${x0}" y1="${y0 + j * c}" x2="${x0 + 6 * c}" y2="${y0 + j * c}" ${S}/>`
  HINH['LTV-2019-20'] = [x0 * 2 + 6 * c, y0 * 2 + 5 * c, s] }

// 3. LTV 2020·11 — A —66 km— B ——— C ; xe máy từ A (45 km/h), xe đạp từ B (15 km/h)
{ const A = [90, 130], B = [440, 130], C = [760, 130]
  HINH['LTV-2020-11'] = [850, 200, `<line x1="${A[0]}" y1="${A[1]}" x2="${C[0]}" y2="${C[1]}" ${S}/>
    ${[A, B, C].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#222"/>`).join('')}
    ${txt(A[0], A[1] + 38, 'A', { i: 1, s: 28 })}${txt(B[0], B[1] + 38, 'B', { i: 1, s: 28 })}${txt(C[0], C[1] + 38, 'C', { i: 1, s: 28 })}
    ${txt(A[0] + 40, A[1] - 42, 'Xe máy (45 km/h)', { s: 26 })}${txt(B[0] + 20, B[1] - 42, 'Xe đạp (15 km/h)', { s: 26 })}
    ${txt((A[0] + B[0]) / 2, A[1] + 44, '66 km', { s: 26 })}
    <line x1="${A[0] + 8}" y1="${A[1] - 20}" x2="${A[0] + 70}" y2="${A[1] - 20}" stroke="#222" stroke-width="2"/><polygon points="${A[0] + 70},${A[1] - 25} ${A[0] + 80},${A[1] - 20} ${A[0] + 70},${A[1] - 15}" fill="#222"/>`] }

// 4. NN 2024·P1.5 — hai hộp 4×4×2 ghép chữ L (hộp đứng 2×4×4 đặt trên đầu trái hộp nằm 4×2×4); chiếu xiên 45°, 1 đơn vị = 34 px
{ const u = 34, k = 0.36, ox = 40, oy = 290
  const P = (x, y, z) => [ox + x * u + z * u * k * 1.4, oy - y * u - z * u * k * 1.4]
  const face = (a) => `<polygon points="${pts(a)}" fill="#fff" ${S}/>`
  HINH['NN-2024-P1-5'] = [320, 330, [
    face([P(0, 0, 0), P(4, 0, 0), P(4, 2, 0), P(0, 2, 0)]),                  // hộp nằm — mặt trước
    face([P(4, 0, 0), P(4, 0, 4), P(4, 2, 4), P(4, 2, 0)]),                  // hộp nằm — mặt phải
    face([P(2, 2, 0), P(4, 2, 0), P(4, 2, 4), P(2, 2, 4)]),                  // hộp nằm — mặt trên (phần không bị che)
    face([P(0, 2, 0), P(2, 2, 0), P(2, 6, 0), P(0, 6, 0)]),                  // hộp đứng — mặt trước
    face([P(2, 2, 0), P(2, 2, 4), P(2, 6, 4), P(2, 6, 0)]),                  // hộp đứng — mặt phải
    face([P(0, 6, 0), P(2, 6, 0), P(2, 6, 4), P(0, 6, 4)])].join('')] }     // hộp đứng — mặt trên

// 5. NN 2024-TT1·P1.5 — hình vuông cạnh 10 cm, đường tròn nội tiếp, hình vuông nội tiếp đường tròn (xoay 45°); tô phần tròn nằm ngoài hình vuông nhỏ
{ const a = 220, x0 = 40, y0 = 50, cx = x0 + a / 2, cy = y0 + a / 2, r = a / 2
  const D = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]]
  HINH['NN-2024-TT1-P1-5'] = [300, 320, `<path d="M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0 Z M ${D.map((p) => p.join(' ')).join(' L ')} Z" fill="#bdbdbd" fill-rule="evenodd" stroke="none"/>
    <rect x="${x0}" y="${y0}" width="${a}" height="${a}" fill="none" ${S}/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${S}/><polygon points="${pts(D)}" fill="none" ${S}/>
    ${txt(cx, y0 - 14, '10 cm', { s: 24 })}`] }

// 6. NTL 2024·P1.10 — bốn khối số
{ const bx = (x, t, a, b) => `<rect x="${x}" y="20" width="150" height="40" fill="#fff" ${S}/><rect x="${x}" y="60" width="75" height="44" fill="#fff" ${S}/><rect x="${x + 75}" y="60" width="75" height="44" fill="#fff" ${S}/>
    ${txt(x + 75, 49, t, { s: 26, b: 1 })}${txt(x + 37.5, 91, a, { s: 25 })}${txt(x + 112.5, 91, b, { s: 25 })}`
  HINH['NTL-2024-P1-10'] = [740, 124, [bx(20, '274', '24', '34'), bx(200, '376', '33', '46'), bx(380, '165', '13', '35'), bx(560, '364', '31', '?')].join('')] }

// 7. NTL 2025·P1.8 — ba hình tròn chia 3 phần; vòng 1 để trống, vòng 2 đủ số, vòng 3 thiếu một số
{ const r = 92, cy = 110, circ = (cx, vals) => { const ang = [90, 210, 330].map((d) => [cx + r * Math.cos(d * Math.PI / 180), cy - r * Math.sin(d * Math.PI / 180)])
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" ${S}/>${ang.map(([x, y]) => `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" ${S}/>`).join('')}${vals.map((v, i) => v ? (v === '?' ? txt(...[[cx - 44, cy - 28], [cx + 44, cy - 28], [cx, cy + 62]][i], '?', { s: 28 }) : frac(...[[cx - 44, cy - 34], [cx + 44, cy - 34], [cx, cy + 56]][i], v[0], v[1], 24)) : '').join('')}` }
  HINH['NTL-2025-P1-8'] = [740, 220, circ(110, [null, null, null]) + circ(370, [['12', '14'], ['10', '12'], ['5', '7']]) + circ(630, [['7', '3'], ['3', '4'], '?'])] }

// 8. NTT 2025·6 — tấm bìa 25×20, cắt 4 góc vuông cạnh 5 (đúng tỉ lệ: 1 cm = 8 px)
{ const k = 8, W = 25 * k, H = 20 * k, x1 = 30, y1 = 40, x2 = 330, y2 = 40, g = 5 * k
  const cross = [[x2 + g, y2], [x2 + W - g, y2], [x2 + W - g, y2 + g], [x2 + W, y2 + g], [x2 + W, y2 + H - g], [x2 + W - g, y2 + H - g], [x2 + W - g, y2 + H], [x2 + g, y2 + H], [x2 + g, y2 + H - g], [x2, y2 + H - g], [x2, y2 + g], [x2 + g, y2 + g]]
  HINH['NTT-2025-6'] = [560, 250, `<rect x="${x1}" y="${y1}" width="${W}" height="${H}" fill="#fff" ${S}/>${txt(x1 + W / 2, y1 - 10, '25 cm')}${txt(x1 + 8, y1 + H / 2 + 8, '20 cm', { a: 'start' })}
    <line x1="${x1 + W + 28}" y1="${y1 + H / 2}" x2="${x2 - 28}" y2="${y1 + H / 2}" stroke="#222" stroke-width="2"/><polygon points="${x2 - 28},${y1 + H / 2 - 6} ${x2 - 16},${y1 + H / 2} ${x2 - 28},${y1 + H / 2 + 6}" fill="#222"/>
    <rect x="${x2}" y="${y2}" width="${W}" height="${H}" fill="none" stroke="#777" stroke-width="1.2"/><polygon points="${pts(cross)}" fill="#fff" ${S}/>
    ${txt(x2 + g + 6, y2 + 24, '5 cm', { a: 'start', s: 20 })}${txt(x2 + 6, y2 + g + 22, '5 cm', { a: 'start', s: 20 })}`] }

// 9. NTL 2024·P2.2 (đề sửa AM = 2/5 AD) — hình vuông ABCD cạnh 10 cm, M trên AD, O = BM ∩ AC, nối MC
{ const s = 200, A = [70, 250], B = [A[0] + s, A[1]], C = [A[0] + s, A[1] - s], D = [A[0], A[1] - s], M = [A[0], A[1] - s * 0.4]
  const t = 5 / 7, O = [B[0] + (M[0] - B[0]) * t, B[1] + (M[1] - B[1]) * t]   // BO/BM = 5/7 ⇒ BO/OM = 5/2
  const L = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" ${S}/>`
  HINH['NTL-2024-P2-2'] = [340, 320, `<polygon points="${pts([A, B, C, D])}" fill="none" ${S}/>${L(B, M)}${L(A, C)}${L(M, C)}
    <circle cx="${O[0]}" cy="${O[1]}" r="3.5" fill="#222"/>${txt(A[0] - 18, A[1] + 22, 'A', { i: 1, s: 26 })}${txt(B[0] + 18, B[1] + 22, 'B', { i: 1, s: 26 })}${txt(C[0] + 18, C[1] - 8, 'C', { i: 1, s: 26 })}${txt(D[0] - 18, D[1] - 8, 'D', { i: 1, s: 26 })}
    ${txt(M[0] - 20, M[1] + 8, 'M', { i: 1, s: 26 })}${txt(O[0] + 4, O[1] + 26, 'O', { i: 1, s: 26 })}`] }

// 10. NTT 2019·1 (DỰNG LẠI, không phải đề gốc) — sơ đồ đường đi từ Nhà; hai ngã tư; ba địa điểm có biểu tượng
{ const ic = (x, y, kind) => {
    if (kind === 'sieuthi') return `<g ${S} fill="#fff"><path d="M ${x - 26} ${y - 14} h 8 l 8 30 h 34 l 6 -22 h -44"/><circle cx="${x - 4}" cy="${y + 24}" r="4" fill="#222"/><circle cx="${x + 28}" cy="${y + 24}" r="4" fill="#222"/></g>${txt(x, y + 58, 'Siêu thị', { s: 22 })}`
    if (kind === 'benhvien') return `<g ${S} fill="#fff"><rect x="${x - 30}" y="${y - 28}" width="60" height="56" rx="6"/><path d="M ${x - 14} ${y} h 28 M ${x} ${y - 14} v 28" stroke-width="6"/></g>${txt(x, y + 58, 'Bệnh viện', { s: 22 })}`
    return `<g ${S} fill="#fff"><path d="M ${x - 32} ${y + 22} v -34 l 32 -18 l 32 18 v 34 z"/><rect x="${x - 8}" y="${y + 2}" width="16" height="20"/></g>${txt(x, y + 58, 'Trường học', { s: 22 })}` }
  const road = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555" stroke-width="16" stroke-linecap="butt"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="2" stroke-dasharray="10 9"/>`
  HINH['NTT-2019-1'] = [560, 470, `${road(280, 420, 280, 135)}${road(130, 300, 430, 300)}${road(130, 190, 430, 190)}
    <circle cx="280" cy="420" r="9" fill="#2a8"/>${txt(280, 452, 'Nhà Nam', { s: 22 })}
    <polygon points="280,372 272,386 288,386" fill="#d33"/>
    ${ic(64, 150, 'benhvien')}${ic(496, 150, 'sieuthi')}${ic(280, 52, 'truong')}
    ${txt(268, 328, 'ngã tư 1', { a: 'end', s: 19 })}${txt(268, 218, 'ngã tư 2', { a: 'end', s: 19 })}`] }

for (const [ten, [w, h, body]] of Object.entries(HINH)) { await luu(OUT, 'CLC6-' + ten, w, h, doc(w, h, body)); console.log('✔', ten, w + '×' + h) }
