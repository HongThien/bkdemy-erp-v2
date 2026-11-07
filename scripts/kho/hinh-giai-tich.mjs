// hinh-giai-tich.mjs — MÁY VẼ hình cho chương TÍCH PHÂN lớp 12 (miền tô giữa hai đồ thị, hình thang cong dưới đồ thị, cận a·b có đường dóng,
//   phác khối tròn xoay) và dùng lại cho giới hạn/liên tục K11. Mô tả có cấu trúc → SVG; máy KIỂM điểm nằm trên đường, cận nằm trong khung (README kho §3).
//   Đăng ký trong hinh-luong-giac.mjs: loai "giai_tich" → veHinh(mt).
//
// mt = {
//   loai: "giai_tich",
//   x: [-1, 4], y: [-1, 5],            khung (đơn vị toán). Tỉ lệ px/đơn vị tự chọn, x và y độc lập.
//   nhanX: [1, 3] | "nguyen" | "khong"  số ghi trên trục Ox (mặc định: chỉ các cận/giao điểm trong `doc`/`diem` có `nhan`; "nguyen" = mọi số nguyên)
//   nhanY: [2, 4] | "nguyen" | "khong"  (mặc định "khong" — chỉ ghi khi liệt kê)
//   luoi: true|false                    lưới mờ (mặc định false — hình SGK sạch)
//   ham: [{ f: "x^2", tu, den, nhan: "y = x²", bo: [..], net: "dut", mau: "xanh|do|luc|tim|den" }]   f dùng x + − * / ^ ( ) sqrt abs sin cos tan exp ln pi
//   to: [{ tren: "h0"|<số>, duoi: "h1"|<số> (mặc định 0 = trục hoành), tu, den, mau?: "xanh|do|luc|cam" }]    tô miền giữa hai đường (kieu: "gach" = gạch chéo như đề SGK) ("hN" = hàm ham[N]; số = đường y = hằng)
//   doc: [{ x: 1, nhan: "a", den: "hN"|<số>|"truc" }]   đường dóng nét đứt từ trục Ox lên tới đường (mặc định tới ham[0]); nhan ghi dưới trục
//   ngang: [{ y: 2, nhan: "2", tu: <x>, den: <ham/x> }]     dóng ngang từ trục Oy
//   diem: [{ x, y, ten, kieu: "dac"|"rong", tren: i, vi: "tr|tl|br|bl|t|b|l|r" }]   (có `tren` thì máy kiểm y = f(x))
//   chu: [{ x, y, t, mau }]                                  chữ tự do (toạ độ toán), vd tên miền "S", "(H)"
//   xoay: { quanh: "Ox", ham: 0, tu: 1, den: 4 }             phác khối tròn xoay quanh Ox: vẽ nét đứt đối xứng + elip hai đầu (quanh Oy: ham theo x = g(y) KHÔNG hỗ trợ — vẽ mặt cắt tay)
//   anTruc: false                                            ẩn trục (vd hình chỉ phác miền)
//   w: 480                                                   bề rộng px mong muốn
// }
const r2 = (v) => Math.round(v * 100) / 100
const dau = (s) => String(s).replace('-', '−')
const MAU = { den: '#111', xanh: '#1d4ed8', do: '#b91c1c', luc: '#047857', tim: '#7c3aed', cam: '#ea580c', xam: '#6b7280' }
const TO = { xanh: 'rgba(29,78,216,.22)', do: 'rgba(185,28,28,.20)', luc: 'rgba(4,120,87,.22)', cam: 'rgba(234,88,12,.25)', tim: 'rgba(124,58,237,.20)' }
const DAY = ['xanh', 'do', 'luc', 'tim']
const chu = (x, y, t, o = {}) => `<text x="${r2(x)}" y="${r2(y)}" ${o.nghieng ? 'font-style="italic" ' : ''}${o.neo ? `text-anchor="${o.neo}" ` : ''}fill="${o.mau || '#111'}" ${o.co ? `font-size="${o.co}" ` : ''}paint-order="stroke" stroke="#fff" stroke-width="3">${t}</text>`

const AN_TOAN = /^[0-9x+\-*/^().,\s]*(?:(?:sqrt|abs|sin|cos|tan|exp|ln|pi)[0-9x+\-*/^().,\s]*)*$/
export function bienDich(src) {
  const s = String(src).replace(/\s+/g, '')
  if (!AN_TOAN.test(s) || /[a-wyz]\(/.test(s.replace(/sqrt|abs|sin|cos|tan|exp|ln|pi/g, ''))) throw new Error(`biểu thức không hợp lệ: ${src}`)
  const js = s.replace(/(^|[(*/])-/g, '$1-1*').replace(/\^/g, '**').replace(/\bsqrt\(/g, 'Math.sqrt(').replace(/\babs\(/g, 'Math.abs(').replace(/\bsin\(/g, 'Math.sin(').replace(/\bcos\(/g, 'Math.cos(').replace(/\btan\(/g, 'Math.tan(').replace(/\bexp\(/g, 'Math.exp(').replace(/\bln\(/g, 'Math.log(').replace(/\bpi\b/g, 'Math.PI')
  // eslint-disable-next-line no-new-func
  return new Function('x', `"use strict"; return (${js})`)
}
const tick = (v) => dau(Number.isInteger(v) ? String(v) : String(r2(v)).replace('.', ','))

export function svgGiaiTich(mt) {
  const [x0, x1] = mt.x ?? [-1, 4], [y0, y1] = mt.y ?? [-1, 4]
  if (!(x0 < x1 && y0 < y1)) throw new Error('khung x, y sai')
  const Wmong = mt.w ?? 480, le = 30
  const dx = (Wmong - 2 * le) / (x1 - x0)
  const dy = mt.deu ? dx : Math.min(dx * 1.15, Math.max(24, 330 / (y1 - y0)))
  const W = Math.round((x1 - x0) * dx + 2 * le), H = Math.round((y1 - y0) * dy + 2 * le)
  const X = (v) => le + (v - x0) * dx, Y = (v) => le + (y1 - v) * dy
  const fs = (mt.ham ?? []).map((h) => bienDich(h.f))
  const gt = (k) => { if (typeof k === 'number') return () => k; const m = /^h([0-9]+)$/.exec(String(k)); const f = m && fs[+m[1]]; if (!f) throw new Error(`"${k}" không phải hằng số hay hàm "h0", "h1"… (ham[] có ${fs.length})`); return f }
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Times New Roman', serif" font-size="16"><rect width="${W}" height="${H}" fill="#fff"/><defs><marker id="mt" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#111"/></marker><pattern id="gach" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fff"/><line x1="0" y1="0" x2="0" y2="7" stroke="#374151" stroke-width="1.1"/></pattern><clipPath id="kh"><rect x="${le - 2}" y="${le - 2}" width="${W - 2 * le + 4}" height="${H - 2 * le + 4}"/></clipPath></defs>`]
  if (mt.luoi) { for (let v = Math.ceil(x0); v <= x1; v++) o.push(`<line x1="${X(v)}" y1="${le}" x2="${X(v)}" y2="${H - le}" stroke="#e5e7eb"/>`); for (let v = Math.ceil(y0); v <= y1; v++) o.push(`<line x1="${le}" y1="${Y(v)}" x2="${W - le}" y2="${Y(v)}" stroke="#e5e7eb"/>`) }
  const trucY = x0 <= 0 && x1 >= 0 ? X(0) : le, trucX = y0 <= 0 && y1 >= 0 ? Y(0) : H - le

  // 1) miền tô (dưới đường cong để đường cong đè lên)
  for (const [i, t] of (mt.to ?? []).entries()) {
    const gT = gt(t.tren ?? 'h0'), gD = gt(t.duoi ?? 0)
    const tu = t.tu ?? x0, den = t.den ?? x1; if (!(tu < den)) throw new Error(`to[${i}]: tu < den`)
    const N = 400, top = [], bot = []
    for (let k = 0; k <= N; k++) { const xv = tu + ((den - tu) * k) / N, a = gT(xv), b = gD(xv); if (!Number.isFinite(a) || !Number.isFinite(b)) continue; top.push([X(xv), Y(a)]); bot.push([X(xv), Y(b)]) }
    if (top.length < 2) throw new Error(`to[${i}]: không có điểm hợp lệ`)
    const pts = [...top, ...bot.reverse()].map((q) => r2(q[0]) + ',' + r2(q[1])).join(' ')
    o.push(`<polygon clip-path="url(#kh)" points="${pts}" fill="${t.kieu === 'gach' ? 'url(#gach)' : (TO[t.mau ?? 'xanh'] ?? TO.xanh)}" stroke="none"/>`)
  }

  // 2) trục
  if (mt.anTruc !== true) {
    o.push(`<line x1="${le - 10}" y1="${trucX}" x2="${W - le + 8}" y2="${trucX}" stroke="#111" stroke-width="1.5" marker-end="url(#mt)"/>`)
    o.push(`<line x1="${trucY}" y1="${H - le + 10}" x2="${trucY}" y2="${le - 12}" stroke="#111" stroke-width="1.5" marker-end="url(#mt)"/>`)
    o.push(chu(W - le + 4, trucX + 18, (mt.truc ?? ['x', 'y'])[0], { nghieng: true }), chu(trucY + 8, le - 12, (mt.truc ?? ['x', 'y'])[1], { nghieng: true }), chu(trucY - 15, trucX + 17, 'O', { nghieng: true }))
  }

  // 3) nhãn trục Ox/Oy
  const nhanX = mt.nhanX ?? [], nhanY = mt.nhanY ?? 'khong'
  const dsX = nhanX === 'nguyen' ? Array.from({ length: Math.floor(x1) - Math.ceil(x0) + 1 }, (_, i) => Math.ceil(x0) + i).filter((v) => v !== 0) : Array.isArray(nhanX) ? nhanX : []
  const dsY = nhanY === 'nguyen' ? Array.from({ length: Math.floor(y1) - Math.ceil(y0) + 1 }, (_, i) => Math.ceil(y0) + i).filter((v) => v !== 0) : Array.isArray(nhanY) ? nhanY : []
  for (const e of dsX) { const v = typeof e === 'object' ? e.v : e, tx = typeof e === 'object' ? e.t : tick(e); o.push(`<line x1="${r2(X(v))}" y1="${trucX - 3}" x2="${r2(X(v))}" y2="${trucX + 3}" stroke="#111"/>`, chu(X(v), trucX + 17, tx, { neo: 'middle', co: 14 })) }
  for (const e of dsY) { const v = typeof e === 'object' ? e.v : e, tx = typeof e === 'object' ? e.t : tick(e); o.push(`<line x1="${trucY - 3}" y1="${r2(Y(v))}" x2="${trucY + 3}" y2="${r2(Y(v))}" stroke="#111"/>`, chu(trucY - 7, Y(v) + 5, tx, { neo: 'end', co: 14 })) }

  // 4) đường dóng
  for (const [i, d] of (mt.doc ?? []).entries()) {
    if (d.x < x0 - 1e-9 || d.x > x1 + 1e-9) throw new Error(`doc[${i}].x ngoài khung`)
    let ytop = 0
    if (d.tiem) ytop = y1; else if (d.den === 'truc') ytop = 0; else { const g = gt(d.den ?? 'h0'); ytop = g(d.x); if (!Number.isFinite(ytop)) throw new Error(`doc[${i}]: hàm không xác định tại x=${d.x}`) }
    o.push(`<line x1="${r2(X(d.x))}" y1="${r2(Y(ytop))}" x2="${r2(X(d.x))}" y2="${trucX}" stroke="#4b5563" stroke-width="1.2" stroke-dasharray="5 4"/>`)
    if (d.nhan !== undefined && d.nhan !== '') o.push(chu(X(d.x), trucX + (ytop >= 0 || y0 >= 0 ? 17 : -8), d.nhan, { neo: 'middle', nghieng: !/^[-−]?\d/.test(String(d.nhan)), co: 15 }))
  }
  for (const [i, d] of (mt.ngang ?? []).entries()) {
    if (d.y < y0 - 1e-9 || d.y > y1 + 1e-9) throw new Error(`ngang[${i}].y ngoài khung`)
    const xe = d.den === undefined ? (d.tu ?? 0) : typeof d.den === 'number' ? d.den : 0
    o.push(`<line x1="${trucY}" y1="${r2(Y(d.y))}" x2="${r2(X(xe))}" y2="${r2(Y(d.y))}" stroke="#4b5563" stroke-width="1.2" stroke-dasharray="5 4"/>`)
    if (d.nhan !== undefined && d.nhan !== '') o.push(chu(trucY - 7, Y(d.y) + 5, d.nhan, { neo: 'end', co: 15 }))
  }

  // 5) phác khối tròn xoay quanh Ox (nét đứt đối xứng + elip hai đầu)
  if (mt.xoay && mt.xoay.quanh === 'Oy') {
    const xo = mt.xoay, g = gt('h' + (xo.ham ?? 0)), tu = xo.tu, den = xo.den
    if (!(tu < den)) throw new Error('xoay: tu < den')
    const N = 300, dup = []
    for (let k = 0; k <= N; k++) { const xv = tu + ((den - tu) * k) / N, v = g(xv); if (Number.isFinite(v)) dup.push(`${r2(X(-xv))},${r2(Y(v))}`) }
    o.push(`<polyline clip-path="url(#kh)" fill="none" stroke="#6b7280" stroke-width="1.6" stroke-dasharray="6 4" points="${dup.join(' ')}"/>`)
    for (const yn of [].concat(xo.nap ?? [])) { const rx = den * dx, ry = Math.max(7, Math.min(18, rx * 0.28)); o.push(`<ellipse cx="${r2(X(0))}" cy="${r2(Y(yn))}" rx="${r2(rx)}" ry="${r2(ry)}" fill="none" stroke="#6b7280" stroke-width="1.4"/>`) }
  } else if (mt.xoay) {
    const xo = mt.xoay, g = gt('h' + (xo.ham ?? 0)), tu = xo.tu, den = xo.den
    if (!(tu < den)) throw new Error('xoay: tu < den')
    const N = 300, dup = []
    for (let k = 0; k <= N; k++) { const xv = tu + ((den - tu) * k) / N, v = g(xv); if (Number.isFinite(v)) dup.push(`${r2(X(xv))},${r2(Y(-v))}`) }
    o.push(`<polyline clip-path="url(#kh)" fill="none" stroke="#6b7280" stroke-width="1.6" stroke-dasharray="6 4" points="${dup.join(' ')}"/>`)
    for (const xv of [tu, den]) { const v = Math.abs(g(xv)); if (v > 1e-9) { const ry = v * dy, rx = Math.max(7, Math.min(18, ry * 0.28)); o.push(`<ellipse cx="${r2(X(xv))}" cy="${trucX}" rx="${r2(rx)}" ry="${r2(ry)}" fill="none" stroke="#6b7280" stroke-width="1.4"${xv === tu ? ' stroke-dasharray="5 3"' : ''}/>`) } }
  }

  // 5b) vật thể có thiết diện không đổi dọc Ox: hai elip + hai đường sinh
  if (mt.tru) {
    const { tu, den, r } = mt.tru, ry = r * dy, rx = Math.max(8, Math.min(20, ry * 0.3))
    o.push(`<line x1="${r2(X(tu))}" y1="${r2(trucX - ry)}" x2="${r2(X(den))}" y2="${r2(trucX - ry)}" stroke="#6b7280" stroke-width="1.6"/><line x1="${r2(X(tu))}" y1="${r2(trucX + ry)}" x2="${r2(X(den))}" y2="${r2(trucX + ry)}" stroke="#6b7280" stroke-width="1.6"/>`)
    o.push(`<ellipse cx="${r2(X(tu))}" cy="${trucX}" rx="${rx}" ry="${r2(ry)}" fill="${TO.xanh}" stroke="#6b7280" stroke-width="1.4" stroke-dasharray="5 3"/><ellipse cx="${r2(X(den))}" cy="${trucX}" rx="${rx}" ry="${r2(ry)}" fill="${TO.xanh}" stroke="#6b7280" stroke-width="1.4"/>`)
    if (mt.tru.nhan) o.push(chu(X((tu + den) / 2), trucX - ry - 8, mt.tru.nhan, { co: 15, neo: 'middle' }))
  }

  // 6) đường cong
  for (const [i, h] of (mt.ham ?? []).entries()) {
    const tu = h.tu ?? x0, den = h.den ?? x1; if (!(tu < den)) throw new Error(`ham[${i}]: tu < den`)
    const mau = MAU[h.mau ?? DAY[i % DAY.length]] ?? MAU.xanh
    const N = 900, seg = []; let cur = []; const Ymax = (y1 - y0) * 4
    for (let k = 0; k <= N; k++) {
      const xv = tu + ((den - tu) * k) / N, v = fs[i](xv)
      const bo = (h.bo ?? []).some((b) => Math.abs(b - xv) < (den - tu) / N)
      if (bo || !Number.isFinite(v) || Math.abs(v) > Ymax || (cur.length && Math.abs(v - cur[cur.length - 1][2]) > (y1 - y0) * 1.2)) { if (cur.length > 1) seg.push(cur); cur = []; if (!bo && Number.isFinite(v) && Math.abs(v) <= Ymax) cur.push([X(xv), Y(v), v]); continue }
      cur.push([X(xv), Y(v), v])
    }
    if (cur.length > 1) seg.push(cur)
    for (const s of seg) o.push(`<polyline clip-path="url(#kh)" fill="none" stroke="${mau}" stroke-width="2.5" stroke-linejoin="round"${h.net === 'dut' ? ' stroke-dasharray="7 4"' : ''} points="${s.map((q) => r2(q[0]) + ',' + r2(q[1])).join(' ')}"/>`)
    if (h.nhan) {
      const xl = h.xnhan ?? den - (den - tu) * 0.04, yl = fs[i](xl)
      if (Number.isFinite(yl)) o.push(chu(X(xl) + (h.dx ?? 4), Y(yl) + (h.dy ?? -8), h.nhan, { neo: h.neo ?? 'end', co: 15, mau, nghieng: true }))
    }
  }

  // 7) điểm
  const VI = { tr: [8, -8, 'start'], tl: [-8, -8, 'end'], br: [8, 18, 'start'], bl: [-8, 18, 'end'], t: [0, -10, 'middle'], b: [0, 20, 'middle'], l: [-9, 5, 'end'], r: [9, 5, 'start'] }
  for (const [i, p] of (mt.diem ?? []).entries()) {
    if (p.x < x0 - 1e-9 || p.x > x1 + 1e-9 || p.y < y0 - 1e-9 || p.y > y1 + 1e-9) throw new Error(`diem[${i}] ${p.ten ?? ''} ngoài khung`)
    if (p.tren != null) { const v = fs[p.tren]?.(p.x); if (!Number.isFinite(v) || Math.abs(v - p.y) > 1e-6) throw new Error(`diem ${p.ten ?? ''}(${p.x}; ${p.y}) KHÔNG nằm trên ham[${p.tren}] (cho ${v})`) }
    o.push(`<circle cx="${r2(X(p.x))}" cy="${r2(Y(p.y))}" r="4.2" fill="${p.kieu === 'rong' ? '#fff' : '#111'}" stroke="#111" stroke-width="1.8"/>`)
    if (p.ten) { const [ox, oy, na] = VI[p.vi ?? 'tr']; o.push(chu(X(p.x) + ox, Y(p.y) + oy, p.ten, { neo: na, nghieng: true, co: 16 })) }
  }
  for (const c of mt.chu ?? []) o.push(chu(X(c.x), Y(c.y), c.t, { neo: 'middle', nghieng: c.nghieng !== false, mau: MAU[c.mau] ?? c.mau, co: c.co ?? 17 }))
  o.push('</svg>')
  return { svg: o.join('\n'), w: W, h: H }
}
