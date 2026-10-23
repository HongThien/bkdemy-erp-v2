// hinh-luong-giac.mjs — MÁY VẼ hình lượng giác + đồ thị hàm số bất kì (loai do_thi_ham, cho giới hạn / liên tục) lớp 11 (README kho §3: AI viết mô tả có cấu trúc, máy render, máy kiểm).
//   svgGoc(mt)        góc lượng giác (Ou, Ov): tia, cung góc hình học, mũi tên chiều quay + số đo, chiều dương "+"
//   svgDuongTron(mt)  đường tròn lượng giác: trục, điểm biểu diễn (theo số đo độ), gióng xuống trục, cung từ A, nhãn góc phần tư
//   svgDoThiLG(mt)    đồ thị y = a·F(w·x + p·π) + k (F = sin|cos|tan|cot), x tính theo bội của π; điểm đánh dấu NẰM TRÊN đồ thị (máy kiểm)
//   node scripts/kho/hinh-luong-giac.mjs <mo-ta.json> <ra-khong-duoi>   → <ra>.svg + <ra>.png   (mo-ta.json có "loai": "goc"|"duong_tron"|"do_thi")
// Nhãn là chữ thường (không LaTeX): π, °, dấu trừ "−". Số đo góc đánh dấu bằng độ; máy tự đổi ra rad khi cần ghi nhãn trục.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const rad = (d) => (d * Math.PI) / 180
const dau = (s) => String(s).replace('-', '−')
const r2 = (v) => Math.round(v * 100) / 100
const MAU = { duong: '#111', luoi: '#e5e7eb', xanh: '#1d4ed8', do: '#b91c1c', luc: '#047857', tim: '#7c3aed' }
const dau_svg = (W, H) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Times New Roman', serif" font-size="16"><rect width="${W}" height="${H}" fill="#fff"/><defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>`
const chu = (x, y, t, o = {}) => `<text x="${r2(x)}" y="${r2(y)}" ${o.nghieng ? 'font-style="italic" ' : ''}${o.neo ? `text-anchor="${o.neo}" ` : ''}${o.mau ? `fill="${o.mau}" ` : ''}${o.co ? `font-size="${o.co}" ` : ''}paint-order="stroke" stroke="#fff" stroke-width="3">${t}</text>`
const cungSvg = (cx, cy, R, a0, a1, mau, w = 2, mui = false) => { // a0 → a1 (độ, ngược chiều kim đồng hồ dương; a1 có thể < a0 = thuận chiều kim)
  const p = (a) => [cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a))]
  const [x0, y0] = p(a0), [x1, y1] = p(a1), d = a1 - a0, lon = Math.abs(d) > 180 ? 1 : 0, sw = d > 0 ? 0 : 1
  return `<path d="M${r2(x0)},${r2(y0)} A${R},${R} 0 ${lon} ${sw} ${r2(x1)},${r2(y1)}" fill="none" stroke="${mau}" stroke-width="${w}"${mui ? ' marker-end="url(#mt)"' : ''}/>`
}

/** mô tả: { gocHinhHoc: 60 (độ, 0..180, tia Ov nằm trên Ou theo chiều dương), quay: 60|-300|… (độ, có dấu: số đo góc LG (Ou,Ov) minh hoạ bằng mũi tên cong),
 *   nhanGoc: "60°" (số đo góc HÌNH HỌC, tuỳ chọn), nhanQuay: "(Ou, Ov)" (tuỳ chọn), ten: ["O","u","v"], chieuDuong: true } */
export function svgGoc(mt) {
  const phi = mt.gocHinhHoc ?? 60, quay = mt.quay ?? phi
  if (!(phi > 0 && phi < 180)) throw new Error('gocHinhHoc phải trong (0; 180)')
  // quay phải cùng tia cuối với phi: quay ≡ phi (mod 360) — máy kiểm (tránh hình mâu thuẫn dữ kiện)
  if (Math.abs((((quay - phi) % 360) + 360) % 360) > 1e-6 && (((quay - phi) % 360) + 360) % 360 < 359.999999) throw new Error(`quay=${quay} không đưa tia Ou tới đúng tia Ov (φ=${phi}): cần quay ≡ φ (mod 360)`)
  const [tO, tu, tv] = mt.ten ?? ['O', 'u', 'v']
  const W = 470, H = 340, ox = 140, oy = 250, L = 280
  const o = [dau_svg(W, H)]
  const P = (a, l) => [ox + l * Math.cos(rad(a)), oy - l * Math.sin(rad(a))]
  const [ux, uy] = P(0, L), [vx, vy] = P(phi, L - 30)
  o.push(`<line x1="${ox}" y1="${oy}" x2="${ux}" y2="${uy}" stroke="${MAU.duong}" stroke-width="2.4"/>`)
  o.push(`<line x1="${ox}" y1="${oy}" x2="${r2(vx)}" y2="${r2(vy)}" stroke="${MAU.do}" stroke-width="2.4"/>`)
  o.push(chu(ux + 6, uy + 20, tu, { nghieng: true }), chu(vx + 6, vy - 4, tv, { nghieng: true }), chu(ox - 18, oy + 18, tO, { nghieng: true }))
  o.push(`<circle cx="${ox}" cy="${oy}" r="3.4" fill="#111"/>`)
  if (mt.nhanGoc) { o.push(cungSvg(ox, oy, 44, 0, phi, MAU.duong, 1.6)); const m = rad(phi / 2); o.push(chu(ox + 62 * Math.cos(m), oy - 62 * Math.sin(m) + 5, mt.nhanGoc, { neo: 'middle' })) }
  // mũi tên chiều quay của góc lượng giác (Ou, Ov): từ 0 đi |quay| độ theo dấu
  const q = Math.sign(quay) * Math.min(Math.abs(quay), 359)
  o.push(cungSvg(ox, oy, 82, 0, q, MAU.xanh, 2.4, true))
  if (mt.nhanQuay) { const m = rad(q / 2); o.push(chu(ox + 102 * Math.cos(m), oy - 102 * Math.sin(m) + 5, mt.nhanQuay, { neo: 'middle', mau: MAU.xanh })) }
  if (mt.chieuDuong !== false) {   // chiều dương (ngược chiều kim đồng hồ)
    o.push(`<path d="M${W - 90},70 A26,26 0 0 0 ${W - 62},34" fill="none" stroke="#6b7280" stroke-width="2" marker-end="url(#mt)"/>`)
    o.push(chu(W - 56, 38, '+', { co: 20 }))
  }
  o.push('</svg>')
  return { svg: o.join('\n'), w: W, h: H }
}

/** mô tả: { diem: [{ ten, goc (độ, toạ độ cực của điểm trên đường tròn), toaDo (chuỗi hiện cạnh điểm, tuỳ chọn), giong (true: kẻ gióng xuống hai trục), nhanGiong:["cos α","sin α"] }],
 *   dauA: true (vẽ điểm A(1; 0)), cungTuA: { den: độ, nhan: "α" } (cung có mũi tên từ A tới đó), goc4: true (ghi I, II, III, IV), chia: [độ…] (chấm nhỏ + ghi số đo bằng π),
 *   nhanTruc: ["cos","sin"] (đặt tên trục, mặc định x, y) } */
export function svgDuongTron(mt) {
  const R = mt.R ?? 130, W = 2 * R + 130, H = 2 * R + 90, cx = W / 2, cy = H / 2 + 4
  const X = (a) => cx + R * Math.cos(rad(a)), Y = (a) => cy - R * Math.sin(rad(a))
  const o = [dau_svg(W, H)]
  o.push(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${MAU.xanh}" stroke-width="2"/>`)
  o.push(`<line x1="${cx - R - 36}" y1="${cy}" x2="${cx + R + 40}" y2="${cy}" stroke="${MAU.duong}" stroke-width="1.5" marker-end="url(#mt)"/>`)
  o.push(`<line x1="${cx}" y1="${cy + R + 34}" x2="${cx}" y2="${cy - R - 40}" stroke="${MAU.duong}" stroke-width="1.5" marker-end="url(#mt)"/>`)
  const [nx, ny] = mt.nhanTruc ?? ['x', 'y']
  // nhãn O đặt ở góc phần tư KHÔNG có điểm nào (tránh đoạn OM đè lên chữ)
  const gp = (g) => { const c = Math.cos(rad(g)), sn = Math.sin(rad(g)); return c >= -1e-9 ? (sn >= -1e-9 ? 1 : 4) : (sn >= -1e-9 ? 2 : 3) }
  const co = new Set((mt.diem ?? []).map((q) => gp(q.goc)))
  const viTriO = [[3, -16, 17], [4, 7, 17], [2, -16, -8], [1, 7, -8]].find((v) => !co.has(v[0])) ?? [3, -16, 17]
  o.push(chu(cx + R + 44, cy + 18, nx, { nghieng: true }), chu(cx + 10, cy - R - 38, ny, { nghieng: true }), chu(cx + viTriO[1], cy + viTriO[2], 'O', { nghieng: true }))
  for (const [t, a] of [['1', 0], ['−1', 180]]) o.push(`<line x1="${X(a)}" y1="${cy - 3}" x2="${X(a)}" y2="${cy + 3}" stroke="#111"/>`, chu(X(a) + (a ? -4 : 6), cy + 17, t, { neo: a ? 'end' : 'start', co: 14 }))
  for (const [t, a] of [['1', 90], ['−1', 270]]) o.push(`<line x1="${cx - 3}" y1="${Y(a)}" x2="${cx + 3}" y2="${Y(a)}" stroke="#111"/>`, chu(cx + 8, Y(a) + (a === 90 ? 14 : -4), t, { co: 14 }))
  if (mt.goc4) for (const [t, a] of [['I', 45], ['II', 135], ['III', 225], ['IV', 315]]) o.push(chu(cx + 0.5 * R * Math.cos(rad(a)), cy - 0.5 * R * Math.sin(rad(a)) + 5, t, { neo: 'middle', mau: '#6b7280', co: 18 }))
  for (const a of mt.chia ?? []) { o.push(`<circle cx="${r2(X(a))}" cy="${r2(Y(a))}" r="2.6" fill="#6b7280"/>`) }
  if (mt.dauA) o.push(`<circle cx="${X(0)}" cy="${Y(0)}" r="3.6" fill="#111"/>`, chu(X(0) + 6, Y(0) - 8, 'A', { nghieng: true }))
  if (mt.cungTuA) { const d = mt.cungTuA.den; o.push(cungSvg(cx, cy, 34, 0, d, MAU.do, 2, true)); const m = rad(d / 2); if (mt.cungTuA.nhan) o.push(chu(cx + 50 * Math.cos(m), cy - 50 * Math.sin(m) + 5, mt.cungTuA.nhan, { neo: 'middle', mau: MAU.do })) }
  const ten = new Set()
  for (const p of mt.diem ?? []) {
    if (!Number.isFinite(p.goc)) throw new Error(`diem ${p.ten}: thiếu "goc" (độ)`)
    if (ten.has(p.ten)) throw new Error(`trùng tên điểm ${p.ten}`); ten.add(p.ten)
    const x = X(p.goc), y = Y(p.goc)
    o.push(`<line x1="${cx}" y1="${cy}" x2="${r2(x)}" y2="${r2(y)}" stroke="${MAU.do}" stroke-width="1.6"/>`)
    if (p.giong) {
      o.push(`<line x1="${r2(x)}" y1="${r2(y)}" x2="${r2(x)}" y2="${cy}" stroke="#6b7280" stroke-dasharray="4 3"/><line x1="${r2(x)}" y1="${r2(y)}" x2="${cx}" y2="${r2(y)}" stroke="#6b7280" stroke-dasharray="4 3"/>`)
      if (p.nhanGiong) o.push(chu(x, cy + (y < cy ? 17 : -8), p.nhanGiong[0], { neo: 'middle', co: 14, mau: '#6b7280' }), chu(cx + (x > cx ? -8 : 8), y + 5, p.nhanGiong[1], { neo: x > cx ? 'end' : 'start', co: 14, mau: '#6b7280' }))
    }
    o.push(`<circle cx="${r2(x)}" cy="${r2(y)}" r="4" fill="${MAU.do}"/>`)
    const dx = Math.cos(rad(p.goc)) >= 0 ? 8 : -8, dy = Math.sin(rad(p.goc)) >= 0 ? -8 : 16
    o.push(chu(x + dx, y + dy, p.ten + (p.toaDo ? ' ' + p.toaDo : ''), { neo: dx > 0 ? 'start' : 'end', nghieng: !p.toaDo, mau: MAU.do }))
  }
  o.push('</svg>')
  return { svg: o.join('\n'), w: W, h: H }
}

const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan, cot: (t) => 1 / Math.tan(t) }
function bocPi(m) {   // m = bội của π → chữ "π/2", "−3π/2", "2π"
  if (Math.abs(m) < 1e-9) return '0'
  for (const d of [1, 2, 3, 4, 6, 8, 12]) { const n = Math.round(m * d); if (Math.abs(n / d - m) < 1e-9) { const s = n < 0 ? '−' : '', a = Math.abs(n), g = Math.gcd ? 0 : 0; const g2 = ((x, y) => { while (y) [x, y] = [y, x % y]; return x })(a, d); const nn = a / g2, dd = d / g2; return `${s}${nn === 1 ? '' : nn}π${dd === 1 ? '' : '/' + dd}` } }
  return dau(r2(m)) + 'π'
}
/** mô tả: { ham: "sin"|"cos"|"tan"|"cot", a: 1, w: 1, p: 0 (pha, bội của π), k: 0, x: [-2, 2] (bội của π), y: [-2, 2] (số nguyên), buocX: 0.5 (bội của π), nhan: "y = sin x",
 *   diem: [{ x (bội của π), ten, giong: true, nhanX: "π/3" (tuỳ chọn, mặc định tự ghi) }], anNhanX: true (không ghi số trên trục x) } */
export function svgDoThiLG(mt) {
  const f = F[mt.ham]; if (!f) throw new Error('ham phải là sin|cos|tan|cot')
  const a = mt.a ?? 1, w = mt.w ?? 1, p = mt.p ?? 0, k = mt.k ?? 0
  const y = (xm) => a * f(w * xm * Math.PI + p * Math.PI) + k
  const [x0, x1] = mt.x ?? [-2, 2], [y0, y1] = mt.y ?? [-2, 2], bx = mt.buocX ?? 0.5
  const dx = Math.min(150, Math.max(70, Math.floor(620 / (x1 - x0)))), dy = Math.max(34, Math.min(70, Math.floor(300 / (y1 - y0))))
  const le = 34, W = Math.round((x1 - x0) * dx + 2 * le + 20), H = (y1 - y0) * dy + 2 * le
  const X = (v) => le + (v - x0) * dx, Y = (v) => le + (y1 - v) * dy
  const o = [dau_svg(W, H), `<defs><clipPath id="kh"><rect x="${le}" y="${le}" width="${W - 2 * le - 20}" height="${H - 2 * le}"/></clipPath></defs>`]
  for (let v = Math.ceil(x0 / bx) * bx; v <= x1 + 1e-9; v += bx) o.push(`<line x1="${r2(X(v))}" y1="${le}" x2="${r2(X(v))}" y2="${H - le}" stroke="${MAU.luoi}"/>`)
  for (let v = y0; v <= y1; v++) o.push(`<line x1="${le}" y1="${Y(v)}" x2="${W - le - 20}" y2="${Y(v)}" stroke="${MAU.luoi}"/>`)
  const yo = y0 < 0 && y1 > 0 ? Y(0) : Y(y0), xo = x0 < 0 && x1 > 0 ? X(0) : X(x0)
  o.push(`<line x1="${le - 10}" y1="${yo}" x2="${W - le - 6}" y2="${yo}" stroke="#111" stroke-width="1.4" marker-end="url(#mt)"/>`)
  o.push(`<line x1="${xo}" y1="${H - le + 10}" x2="${xo}" y2="${le - 14}" stroke="#111" stroke-width="1.4" marker-end="url(#mt)"/>`)
  o.push(chu(W - le - 4, yo + 18, 'x', { nghieng: true }), chu(xo + 8, le - 16, 'y', { nghieng: true }), chu(xo - 16, yo + 17, 'O', { nghieng: true }))
  if (!mt.anNhanX) for (let v = Math.ceil(x0 / bx) * bx; v <= x1 + 1e-9; v += bx) if (Math.abs(v) > 1e-9) o.push(`<line x1="${r2(X(v))}" y1="${yo - 3}" x2="${r2(X(v))}" y2="${yo + 3}" stroke="#111"/>`, chu(X(v), yo + 17, bocPi(v), { neo: 'middle', co: 13 }))
  for (let v = y0; v <= y1; v++) if (v !== 0) o.push(`<line x1="${xo - 3}" y1="${Y(v)}" x2="${xo + 3}" y2="${Y(v)}" stroke="#111"/>`, chu(xo - 7, Y(v) + 5, dau(v), { neo: 'end', co: 13 }))
  // đường cong (tan, cot: ngắt tại gián đoạn + vẽ tiệm cận nét đứt); them[] = đồ thị thứ hai, thứ ba…; ngang[] = đường y = c
  const veDuong = (ham, A, Wv, Pv, Kv, mau, nhanDuong, tiemCan) => {
    const g = F[ham], yy = (xm) => A * g(Wv * xm * Math.PI + Pv * Math.PI) + Kv
    const N = 1600, seg = []; let cur = []; const Ymax = (y1 - y0) * 3
    for (let i = 0; i <= N; i++) { const xm = x0 + ((x1 - x0) * i) / N, v = yy(xm); const bad = !Number.isFinite(v) || Math.abs(v) > Ymax || (cur.length && Math.abs(v - cur[cur.length - 1][2]) > (y1 - y0) * 1.5); if (bad) { if (cur.length > 1) seg.push(cur); cur = []; if (Number.isFinite(v) && Math.abs(v) <= Ymax) cur.push([X(xm), Y(v), v]); continue } cur.push([X(xm), Y(v), v]) }
    if (cur.length > 1) seg.push(cur)
    if (tiemCan && (ham === 'tan' || ham === 'cot')) for (let n = Math.ceil(x0 * Wv + Pv - 1); ; n++) { const xm = ((ham === 'tan' ? n + 0.5 : n) - Pv) / Wv; if (xm > x1 + 1e-9) break; if (xm >= x0 - 1e-9) o.push(`<line x1="${r2(X(xm))}" y1="${le}" x2="${r2(X(xm))}" y2="${H - le}" stroke="#9ca3af" stroke-dasharray="6 4"/>`) }
    for (const sg of seg) o.push(`<polyline clip-path="url(#kh)" fill="none" stroke="${mau}" stroke-width="2.4" points="${sg.map((q) => r2(q[0]) + ',' + r2(q[1])).join(' ')}"/>`)
    return nhanDuong
  }
  veDuong(mt.ham, a, w, p, k, MAU.xanh, mt.nhan, true)
  const nhans = []
  for (const [i, t] of (mt.them ?? []).entries()) { if (!F[t.ham]) throw new Error('them[' + i + '].ham sai'); veDuong(t.ham, t.a ?? 1, t.w ?? 1, t.p ?? 0, t.k ?? 0, [MAU.do, MAU.luc, MAU.tim][i % 3], t.nhan, false); if (t.nhan) nhans.push([t.nhan, [MAU.do, MAU.luc, MAU.tim][i % 3]]) }
  for (const g of mt.ngang ?? []) { if (g.y > y1 + 1e-9 || g.y < y0 - 1e-9) throw new Error('ngang y=' + g.y + ' ngoài khung'); o.push(`<line x1="${le}" y1="${r2(Y(g.y))}" x2="${W - le - 20}" y2="${r2(Y(g.y))}" stroke="${MAU.do}" stroke-width="2"/>`); if (g.nhan) nhans.push([g.nhan, MAU.do]) }
  nhans.forEach(([t, m], i) => o.push(chu(W - le - 30, le + 36 + 20 * i, t, { neo: 'end', mau: m })))
  if (mt.nhan) o.push(chu(W - le - 30, le + 14, mt.nhan, { neo: 'end', mau: MAU.xanh }))
  for (const q of mt.diem ?? []) {
    const v = y(q.x); if (!Number.isFinite(v)) throw new Error(`diem ${q.ten}: hàm không xác định tại x=${q.x}π`)
    if (q.y != null && Math.abs(q.y - v) > 1e-6) throw new Error(`diem ${q.ten}: y=${q.y} KHÔNG nằm trên đồ thị (hàm cho ${r2(v)})`)
    if (v > y1 + 1e-9 || v < y0 - 1e-9) throw new Error(`diem ${q.ten}: ngoài khung y`)
    if (q.giong) o.push(`<line x1="${r2(X(q.x))}" y1="${r2(Y(v))}" x2="${r2(X(q.x))}" y2="${yo}" stroke="#6b7280" stroke-dasharray="4 3"/><line x1="${r2(X(q.x))}" y1="${r2(Y(v))}" x2="${xo}" y2="${r2(Y(v))}" stroke="#6b7280" stroke-dasharray="4 3"/>`)
    o.push(`<circle cx="${r2(X(q.x))}" cy="${r2(Y(v))}" r="4.2" fill="${MAU.do}"/>`, chu(X(q.x) + 7, Y(v) - 8, q.ten, { nghieng: true, mau: MAU.do }))
  }
  o.push('</svg>')
  return { svg: o.join('\n'), w: W, h: H }
}

/** Đồ thị hàm số tuỳ ý trên mặt phẳng Oxy (giới hạn, liên tục): mỗi `ham[i]` là một mảnh đường cong y = f(x) trên [tu; den].
 *  mô tả: { x: [-3, 4], y: [-2, 5], ham: [{ f: "x^2", tu: -3, den: 1, nhan: "y = x²" }, { f: "x+1", tu: 1, den: 3 }],
 *    diem: [{ x: 1, y: 1, ten: "A", kieu: "dac" | "rong", giong: true }], ngang: [{ y: 2, nhan: "y = 2" }], doc: [{ x: 1, nhan: "x = 1" }] (đường thẳng đứng nét đứt) }
 *  f viết bằng x với + − * / ^ ( ) và sqrt, abs, sin, cos, tan, exp, ln; chỗ hàm không xác định / quá lớn thì ngắt nét. Điểm có `y` thì máy KHÔNG kiểm trên đường (điểm rỗng/đặc có thể lệch đường);
 *  điểm có `tren: i` (chỉ số mảnh) thì máy kiểm y = f(x) của mảnh đó. */
const AN_TOAN = /^[0-9x+\-*/^().,\s]*(?:(?:sqrt|abs|sin|cos|tan|exp|ln|pi)[0-9x+\-*/^().,\s]*)*$/
function biênDich(src) {
  const s = String(src).replace(/\s+/g, '')
  if (!AN_TOAN.test(s) || /[a-wyz]\(/.test(s.replace(/sqrt|abs|sin|cos|tan|exp|ln|pi/g, ''))) throw new Error(`biểu thức không hợp lệ: ${src}`)
  const js = s.replace(/\^/g, '**').replace(/\bsqrt\(/g, 'Math.sqrt(').replace(/\babs\(/g, 'Math.abs(').replace(/\bsin\(/g, 'Math.sin(').replace(/\bcos\(/g, 'Math.cos(').replace(/\btan\(/g, 'Math.tan(').replace(/\bexp\(/g, 'Math.exp(').replace(/\bln\(/g, 'Math.log(').replace(/\bpi\b/g, 'Math.PI')
  // eslint-disable-next-line no-new-func
  return new Function('x', `"use strict"; return (${js})`)
}
export function svgDoThiHam(mt) {
  const [x0, x1] = mt.x ?? [-3, 3], [y0, y1] = mt.y ?? [-3, 3]
  if (!(x0 < x1 && y0 < y1)) throw new Error('khung x, y sai')
  const dx = Math.max(34, Math.min(80, Math.floor(560 / (x1 - x0)))), dy = Math.max(34, Math.min(70, Math.floor(380 / (y1 - y0))))
  const le = 34, W = Math.round((x1 - x0) * dx + 2 * le + 20), H = (y1 - y0) * dy + 2 * le
  const X = (v) => le + (v - x0) * dx, Y = (v) => le + (y1 - v) * dy
  const o = [dau_svg(W, H), `<defs><clipPath id="kh"><rect x="${le}" y="${le}" width="${W - 2 * le - 20}" height="${H - 2 * le}"/></clipPath></defs>`]
  for (let v = Math.ceil(x0); v <= x1; v++) o.push(`<line x1="${X(v)}" y1="${le}" x2="${X(v)}" y2="${H - le}" stroke="${MAU.luoi}"/>`)
  for (let v = Math.ceil(y0); v <= y1; v++) o.push(`<line x1="${le}" y1="${Y(v)}" x2="${W - le - 20}" y2="${Y(v)}" stroke="${MAU.luoi}"/>`)
  const yo = y0 <= 0 && y1 >= 0 ? Y(0) : Y(y0), xo = x0 <= 0 && x1 >= 0 ? X(0) : X(x0)
  o.push(`<line x1="${le - 10}" y1="${yo}" x2="${W - le - 6}" y2="${yo}" stroke="#111" stroke-width="1.4" marker-end="url(#mt)"/>`)
  o.push(`<line x1="${xo}" y1="${H - le + 10}" x2="${xo}" y2="${le - 14}" stroke="#111" stroke-width="1.4" marker-end="url(#mt)"/>`)
  o.push(chu(W - le - 4, yo + 18, 'x', { nghieng: true }), chu(xo + 8, le - 16, 'y', { nghieng: true }), chu(xo - 16, yo + 17, 'O', { nghieng: true }))
  for (let v = Math.ceil(x0); v <= x1; v++) if (v !== 0) o.push(`<line x1="${X(v)}" y1="${yo - 3}" x2="${X(v)}" y2="${yo + 3}" stroke="#111"/>`, chu(X(v), yo + 17, dau(v), { neo: 'middle', co: 13 }))
  for (let v = Math.ceil(y0); v <= y1; v++) if (v !== 0) o.push(`<line x1="${xo - 3}" y1="${Y(v)}" x2="${xo + 3}" y2="${Y(v)}" stroke="#111"/>`, chu(xo - 7, Y(v) + 5, dau(v), { neo: 'end', co: 13 }))
  for (const d of mt.doc ?? []) { o.push(`<line x1="${X(d.x)}" y1="${le}" x2="${X(d.x)}" y2="${H - le}" stroke="#9ca3af" stroke-dasharray="6 4"/>`); if (d.nhan) o.push(chu(X(d.x) + 4, le + 14, d.nhan, { co: 13, mau: '#6b7280' })) }
  for (const g of mt.ngang ?? []) { o.push(`<line x1="${le}" y1="${Y(g.y)}" x2="${W - le - 20}" y2="${Y(g.y)}" stroke="#9ca3af" stroke-dasharray="6 4"/>`); if (g.nhan) o.push(chu(W - le - 24, Y(g.y) - 6, g.nhan, { neo: 'end', co: 13, mau: '#6b7280' })) }
  const fs = (mt.ham ?? []).map((h) => biênDich(h.f))
  for (const [i, h] of (mt.ham ?? []).entries()) {
    const tu = h.tu ?? x0, den = h.den ?? x1; if (!(tu < den)) throw new Error(`ham[${i}]: tu < den`)
    const N = 800, seg = []; let cur = []
    for (let k = 0; k <= N; k++) {
      const xv = tu + ((den - tu) * k) / N, v = fs[i](xv)
      if ((h.bo ?? []).some((b) => Math.abs(b - xv) < (den - tu) / N)) { if (cur.length > 1) seg.push(cur); cur = []; continue }
      if (!Number.isFinite(v) || Math.abs(v) > (y1 - y0) * 4) { if (cur.length > 1) seg.push(cur); cur = []; continue }
      cur.push([X(xv), Y(v)])
    }
    if (cur.length > 1) seg.push(cur)
    for (const s of seg) o.push(`<polyline clip-path="url(#kh)" fill="none" stroke="${[MAU.xanh, MAU.do, MAU.luc][i % 3]}" stroke-width="2.4" points="${s.map((q) => r2(q[0]) + ',' + r2(q[1])).join(' ')}"/>`)
    if (h.nhan) o.push(chu(X(den) - 4, Y(Number.isFinite(fs[i](den - 1e-6)) ? fs[i](den - 1e-6) : 0) - 8, h.nhan, { neo: 'end', co: 14, mau: [MAU.xanh, MAU.do, MAU.luc][i % 3] }))
  }
  for (const p of mt.diem ?? []) {
    if (p.tren != null) { const v = fs[p.tren]?.(p.x); if (!Number.isFinite(v) || Math.abs(v - p.y) > 1e-6) throw new Error(`diem ${p.ten ?? ''}(${p.x}; ${p.y}) KHÔNG nằm trên ham[${p.tren}] (cho ${v})`) }
    if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) throw new Error(`diem ${p.ten ?? ''} ngoài khung`)
    if (p.giong) o.push(`<line x1="${X(p.x)}" y1="${Y(p.y)}" x2="${X(p.x)}" y2="${yo}" stroke="#6b7280" stroke-dasharray="4 3"/><line x1="${X(p.x)}" y1="${Y(p.y)}" x2="${xo}" y2="${Y(p.y)}" stroke="#6b7280" stroke-dasharray="4 3"/>`)
    o.push(`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.6" fill="${p.kieu === 'rong' ? '#fff' : MAU.do}" stroke="${MAU.do}" stroke-width="2"/>`)
    if (p.ten) o.push(chu(X(p.x) + 8, Y(p.y) - 8, p.ten, { nghieng: true, mau: MAU.do }))
  }
  o.push('</svg>')
  return { svg: o.join('\n'), w: W, h: H }
}

const VE = { goc: svgGoc, duong_tron: svgDuongTron, do_thi: svgDoThiLG, do_thi_ham: svgDoThiHam }
export const veHinh = (mt) => { const f = VE[mt.loai]; if (!f) throw new Error('loai phải là goc | duong_tron | do_thi'); return f(mt) }

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
/** ds = [{ mo_ta, file }] — ghi <file>.svg + <file>.png (2x) */
export async function veNhieu(ds) {
  const { default: puppeteer } = await import('puppeteer-core')
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    const pg = await br.newPage()
    for (const d of ds) {
      const { svg, w, h } = veHinh(d.mo_ta)
      mkdirSync(dirname(d.file), { recursive: true }); writeFileSync(`${d.file}.svg`, svg)
      await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
      await pg.setContent(`<body style="margin:0;background:#fff">${svg}</body>`)
      await pg.screenshot({ path: `${d.file}.png`, clip: { x: 0, y: 0, width: w, height: h } })
    }
  } finally { await br.close() }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [vao, ra] = process.argv.slice(2)
  if (!vao || !ra) { console.error('Dùng: node scripts/kho/hinh-luong-giac.mjs <mo-ta.json> <ra-khong-duoi>'); process.exit(2) }
  await veNhieu([{ mo_ta: JSON.parse(readFileSync(vao, 'utf8')), file: ra }]); console.log('→', ra + '.png')
}
