// hinh-toado.mjs — HÌNH PHẲNG dựng bằng TOẠ ĐỘ: cùng một bộ toạ độ vừa KIỂM mệnh đề / đáp số, vừa VẼ hình (SVG → PNG 2x).
// Dùng cho kho Hình từ khối 9 (đường tròn) — luật README §3 kho-rules: "AI viết mô tả có cấu trúc, máy render, máy kiểm".
// Khác scripts/anh/ve_hinh_lib.mjs (toạ độ PIXEL, đặt tay): ở đây toạ độ TOÁN (y hướng lên), dựng theo giả thiết đề
// (giao điểm, tiếp điểm, chân đường vuông góc… đều TÍNH ra), máy tự co giãn khung + đặt nhãn.
//
//   import { P, mid, chieu, giaoDT, giaoDTvaTron, giaoHaiTron, tiepDiem, goc, kiem, veNhieu } from '../../scripts/kho/hinh-toado.mjs'
//
// spec vẽ: { diem:{A:P,…}, an:[tên không ghi nhãn], doan:[['A','B'] | {d:['A','B'],phu:true}], duong:[{d:['A','B'],keo:[0.2,0.2]}],
//   tron:[{tam:'O', r} | {tam:'O', qua:'A'}], cung:[{tam:'O', r, tu, den}] (độ, ngược chiều kim đồng hồ),
//   vuong:[['H','A','B']] (ô vuông tại H giữa HA, HB), goc:[{dinh:'O', a:'A', b:'B', nhan:'60°', n:1, r:28}],
//   gach:[{d:['A','B'], n:1}], chu:[{tai:'A'|P, text, dx, dy}], nhanLech:{A:[dx,dy]} (px, ghi đè chỗ đặt nhãn),
//   to:[{kieu:'vienphan'|'quat', tam:'O', a:'A', b:'B'} | {kieu:'dagiac', diem:['A','B','C']}], diemPhu:[điểm chỉ hiện ở bản lời giải],
//   rong:520, cao:420 }
// Phần tử có phu:true chỉ vẽ ở bản LỜI GIẢI (veNhieu(..., {phu:true})) và vẽ nét đứt — hình ĐỀ không lộ đường phụ của lời giải.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

// ── hình học ───────────────────────────────────────────────────────────────────────────────────
export const P = (x, y) => ({ x, y })
export const add = (a, b) => P(a.x + b.x, a.y + b.y)
export const sub = (a, b) => P(a.x - b.x, a.y - b.y)
export const mul = (a, k) => P(a.x * k, a.y * k)
export const tichVH = (a, b) => a.x * b.x + a.y * b.y
export const tichCheo = (a, b) => a.x * b.y - a.y * b.x
export const dai = (a) => Math.hypot(a.x, a.y)
export const kc = (a, b) => dai(sub(a, b))
export const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2)
export const donVi = (a) => mul(a, 1 / dai(a))
export const rad = (d) => d * Math.PI / 180
export const deg = (r) => r * 180 / Math.PI
/** điểm trên đường tròn tâm O bán kính r, góc t độ (ngược chiều kim đồng hồ từ trục Ox) */
export const tren = (O, r, t) => P(O.x + r * Math.cos(rad(t)), O.y + r * Math.sin(rad(t)))
/** quay điểm A quanh O một góc t độ (ngược chiều kim đồng hồ) */
export const quay = (A, O, t) => { const v = sub(A, O), c = Math.cos(rad(t)), s = Math.sin(rad(t)); return P(O.x + v.x * c - v.y * s, O.y + v.x * s + v.y * c) }
/** chân đường vuông góc hạ từ M xuống đường thẳng AB */
export const chieu = (M, A, B) => { const d = sub(B, A); return add(A, mul(d, tichVH(sub(M, A), d) / tichVH(d, d))) }
export const doiXungTam = (M, O) => P(2 * O.x - M.x, 2 * O.y - M.y)
export const doiXungTruc = (M, A, B) => doiXungTam(M, chieu(M, A, B))
/** giao điểm hai đường thẳng AB và CD */
export function giaoDT(A, B, C, D) {
  const r = sub(B, A), s = sub(D, C), q = tichCheo(r, s)
  if (Math.abs(q) < 1e-12) throw new Error('giaoDT: hai đường thẳng song song')
  return add(A, mul(r, tichCheo(sub(C, A), s) / q))
}
/** giao của đường thẳng AB với đường tròn (O; r) — mảng điểm theo thứ tự đi từ A về phía B */
export function giaoDTvaTron(A, B, O, r) {
  const d = sub(B, A), f = sub(A, O)
  const a = tichVH(d, d), b = 2 * tichVH(f, d), c = tichVH(f, f) - r * r, D = b * b - 4 * a * c
  if (D < -1e-9) return []
  const s = Math.sqrt(Math.max(0, D))
  return [(-b - s) / (2 * a), (-b + s) / (2 * a)].map((t) => add(A, mul(d, t)))
}
/** giao của hai đường tròn — [điểm bên trái, điểm bên phải] khi nhìn từ O1 sang O2 */
export function giaoHaiTron(O1, r1, O2, r2) {
  const d = kc(O1, O2), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h2 = r1 * r1 - a * a
  if (h2 < -1e-9) return []
  const h = Math.sqrt(Math.max(0, h2)), u = donVi(sub(O2, O1)), M = add(O1, mul(u, a)), n = P(-u.y, u.x)
  return [add(M, mul(n, h)), sub(M, mul(n, h))]
}
/** hai tiếp điểm của tiếp tuyến kẻ từ M (ngoài đường tròn) tới (O; r) — [trái, phải] khi nhìn từ M về O */
export function tiepDiem(M, O, r) {
  const d = kc(M, O); if (d <= r) throw new Error('tiepDiem: M không nằm ngoài đường tròn')
  return giaoHaiTron(O, r, mid(O, M), d / 2).reverse()
}
/** số đo góc AOB (độ, 0..180) */
export const goc = (A, O, B) => deg(Math.acos(Math.max(-1, Math.min(1, tichVH(sub(A, O), sub(B, O)) / (kc(A, O) * kc(B, O))))))
export const thangHang = (A, B, C, eps = 1e-7) => Math.abs(tichCheo(sub(B, A), sub(C, A))) < eps * Math.max(1, kc(A, B) * kc(A, C))
export const vuongGoc = (A, B, C, D, eps = 1e-7) => Math.abs(tichVH(sub(B, A), sub(D, C))) < eps * Math.max(1, kc(A, B) * kc(C, D))
export const songSong = (A, B, C, D, eps = 1e-7) => Math.abs(tichCheo(sub(B, A), sub(D, C))) < eps * Math.max(1, kc(A, B) * kc(C, D))
export const gan = (a, b, eps = 1e-7) => Math.abs(a - b) < eps * Math.max(1, Math.abs(a), Math.abs(b))
/** tâm đường tròn qua 3 điểm */
export function tamNgoai(A, B, C) {
  return giaoDT(mid(A, B), add(mid(A, B), P(-(B.y - A.y), B.x - A.x)), mid(A, C), add(mid(A, C), P(-(C.y - A.y), C.x - A.x)))
}

// ── kiểm ───────────────────────────────────────────────────────────────────────────────────────
/** ds: [{ten, dat:boolean}] hoặc [{ten, a, b, eps}] (so a ≈ b). Trả {ok, dong:[…]} — không ném, người gọi quyết. */
export function kiem(ds) {
  const dong = ds.map((k) => {
    const dat = 'dat' in k ? !!k.dat : gan(k.a, k.b, k.eps ?? 1e-7)
    return { ten: k.ten, dat, chiTiet: 'dat' in k ? '' : `${+k.a.toFixed(6)} vs ${+k.b.toFixed(6)}` }
  })
  return { ok: dong.every((d) => d.dat), dong }
}

// ── vẽ ─────────────────────────────────────────────────────────────────────────────────────────
const f2 = (n) => Math.round(n * 100) / 100
const FONT = `font-family="'Times New Roman',Times,serif"`

/** dựng SVG từ spec. phu=true ⇒ thêm các phần tử phu (nét đứt). Trả {svg, w, h} */
export function svgHinh(spec, { phu = false } = {}) {
  const D = spec.diem
  const ten = (k) => { if (typeof k === 'string') { if (!D[k]) throw new Error(`svgHinh: thiếu điểm ${k}`); return D[k] } return k }
  const lay = (arr) => (arr || []).map((e) => (Array.isArray(e) ? { d: e } : e)).filter((e) => phu || !e.phu)
  const tron = (spec.tron || []).filter((c) => phu || !c.phu).map((c) => ({ ...c, O: ten(c.tam), r: c.r ?? kc(ten(c.tam), ten(c.qua)) }))
  const cung = (spec.cung || []).filter((c) => phu || !c.phu).map((c) => ({ ...c, O: ten(c.tam) }))
  const duong = lay(spec.duong).map((e) => {
    const A = ten(e.d[0]), B = ten(e.d[1]), v = sub(B, A), [k1, k2] = e.keo || [0.25, 0.25]
    return { ...e, A: sub(A, mul(v, k1)), B: add(B, mul(v, k2)) }
  })
  // khung
  const pts = Object.values(D)
  for (const c of tron) pts.push(P(c.O.x - c.r, c.O.y - c.r), P(c.O.x + c.r, c.O.y + c.r))
  for (const c of cung) for (let t = c.tu; t <= c.den; t += 5) pts.push(tren(c.O, c.r, t))
  for (const e of duong) pts.push(e.A, e.B)
  const minX = Math.min(...pts.map((p) => p.x)), maxX = Math.max(...pts.map((p) => p.x))
  const minY = Math.min(...pts.map((p) => p.y)), maxY = Math.max(...pts.map((p) => p.y))
  const W = spec.rong ?? 520, H = spec.cao ?? 400, pad = 42
  const s = Math.min((W - 2 * pad) / Math.max(1e-9, maxX - minX), (H - 2 * pad) / Math.max(1e-9, maxY - minY))
  const w = Math.ceil((maxX - minX) * s + 2 * pad), h = Math.ceil((maxY - minY) * s + 2 * pad)
  const X = (p) => P(pad + (p.x - minX) * s, h - pad - (p.y - minY) * s) // y lật: toạ độ toán → ảnh
  const line = (a, b, dash) => { const A = X(a), B = X(b); return `<line x1="${f2(A.x)}" y1="${f2(A.y)}" x2="${f2(B.x)}" y2="${f2(B.y)}"${dash ? ' stroke-dasharray="7 5"' : ''}/>` }
  let body = ''
  // vùng tô (dưới cùng)
  for (const t of (spec.to || []).filter((t) => phu || !t.phu)) {
    if (t.kieu === 'dagiac') {
      body += `<path d="M ${t.diem.map((k) => { const q = X(ten(k)); return `${f2(q.x)} ${f2(q.y)}` }).join(' L ')} Z" fill="#cfd8e3" stroke="none"/>`
    } else if (t.kieu === 'vienphan' || t.kieu === 'quat') {
      const O = ten(t.tam), A = ten(t.a), B = ten(t.b), r = kc(O, A) * s, a = X(A), b = X(B), o = X(O)
      const lon = t.lon ? 1 : 0, sweep = tichCheo(sub(A, O), sub(B, O)) > 0 ? 0 : 1 // ảnh lật y ⇒ ngược chiều
      const d = t.kieu === 'quat' ? `M ${f2(o.x)} ${f2(o.y)} L ${f2(a.x)} ${f2(a.y)} A ${f2(r)} ${f2(r)} 0 ${lon} ${t.lon ? 1 - sweep : sweep} ${f2(b.x)} ${f2(b.y)} Z`
        : `M ${f2(a.x)} ${f2(a.y)} A ${f2(r)} ${f2(r)} 0 ${lon} ${t.lon ? 1 - sweep : sweep} ${f2(b.x)} ${f2(b.y)} Z`
      body += `<path d="${d}" fill="#cfd8e3" stroke="none"/>`
    }
  }
  for (const c of tron) { const o = X(c.O); body += `<circle cx="${f2(o.x)}" cy="${f2(o.y)}" r="${f2(c.r * s)}"${c.phu ? ' stroke-dasharray="7 5"' : ''}/>` }
  for (const c of cung) {
    const a = X(tren(c.O, c.r, c.tu)), b = X(tren(c.O, c.r, c.den)), lon = c.den - c.tu > 180 ? 1 : 0
    body += `<path d="M ${f2(a.x)} ${f2(a.y)} A ${f2(c.r * s)} ${f2(c.r * s)} 0 ${lon} 0 ${f2(b.x)} ${f2(b.y)}"${c.phu ? ' stroke-dasharray="7 5"' : ''}/>`
  }
  for (const e of duong) body += line(e.A, e.B, e.phu)
  const doan = lay(spec.doan)
  for (const e of doan) body += line(ten(e.d[0]), ten(e.d[1]), e.phu)
  // ô vuông
  for (const v of (spec.vuong || []).map((e) => (Array.isArray(e) ? { d: e } : e)).filter((e) => phu || !e.phu)) {
    const [Hk, Ak, Bk] = v.d, Hh = X(ten(Hk)), u1 = donVi(sub(X(ten(Ak)), Hh)), u2 = donVi(sub(X(ten(Bk)), Hh)), q = 12
    const a = add(Hh, mul(u1, q)), b = add(Hh, mul(u2, q)), c = add(a, mul(u2, q))
    body += `<path d="M ${f2(a.x)} ${f2(a.y)} L ${f2(c.x)} ${f2(c.y)} L ${f2(b.x)} ${f2(b.y)}"/>`
  }
  // cung đánh dấu góc
  let chuGoc = ''
  for (const g of (spec.goc || []).filter((g) => phu || !g.phu)) {
    const V = X(ten(g.dinh)), u1 = donVi(sub(X(ten(g.a)), V)), u2 = donVi(sub(X(ten(g.b)), V))
    const sw = tichCheo(u1, u2) > 0 ? 1 : 0
    for (let i = 0; i < (g.n ?? 1); i++) {
      const rr = (g.r ?? 26) + i * 5
      body += `<path d="M ${f2(V.x + u1.x * rr)} ${f2(V.y + u1.y * rr)} A ${rr} ${rr} 0 0 ${sw} ${f2(V.x + u2.x * rr)} ${f2(V.y + u2.y * rr)}"/>`
    }
    if (g.nhan) {
      const bis = donVi(add(u1, u2)), rr = (g.r ?? 26) + 16 + (g.n ?? 1) * 4, q = add(V, mul(bis, rr))
      chuGoc += `<text x="${f2(q.x)}" y="${f2(q.y + 6)}" text-anchor="middle" fill="#111" stroke="none" ${FONT} font-size="19">${g.nhan}</text>`
    }
  }
  // gạch bằng nhau
  for (const g of (spec.gach || []).filter((g) => phu || !g.phu)) {
    const A = X(ten(g.d[0])), B = X(ten(g.d[1])), d = donVi(sub(B, A)), nr = P(-d.y, d.x), m = mid(A, B)
    for (let i = 0; i < (g.n ?? 1); i++) {
      const off = (i - ((g.n ?? 1) - 1) / 2) * 6, c = add(m, mul(d, off))
      body += `<line x1="${f2(c.x - nr.x * 7)}" y1="${f2(c.y - nr.y * 7)}" x2="${f2(c.x + nr.x * 7)}" y2="${f2(c.y + nr.y * 7)}"/>`
    }
  }
  // nhãn điểm: đặt ngược hướng các đoạn nối tới điểm đó, điểm trên đường tròn thì kéo ra ngoài
  const an = new Set([...(spec.an || []), ...(phu ? [] : spec.diemPhu || [])])
  let nhan = ''
  const tamKhung = X(P((minX + maxX) / 2, (minY + maxY) / 2))
  for (const [k, p] of Object.entries(D)) {
    const q = X(p)
    body += an.has(k) ? '' : `<circle cx="${f2(q.x)}" cy="${f2(q.y)}" r="3.6" fill="#222" stroke="none"/>`
    if (an.has(k)) continue
    let v = P(0, 0)
    const ke = []
    for (const e of doan) { if (e.d[0] === k) ke.push(ten(e.d[1])); if (e.d[1] === k) ke.push(ten(e.d[0])) }
    for (const e of duong) { if (e.d.includes(k)) { ke.push(e.A); ke.push(e.B) } }
    for (const n of ke) { const u = sub(X(n), q); if (dai(u) > 1e-6) v = add(v, donVi(u)) }
    for (const c of tron) { const o = X(c.O); const rr = dai(sub(q, o)); if (Math.abs(rr - c.r * s) < 2 && rr > 1e-6) v = add(v, mul(donVi(sub(o, q)), 1.4)) }
    let dir = dai(v) > 0.15 ? mul(donVi(v), -1) : (dai(sub(q, tamKhung)) > 1e-6 ? donVi(sub(q, tamKhung)) : P(0, -1))
    let pos = add(q, mul(dir, 19))
    if (spec.nhanLech?.[k]) pos = add(q, P(...spec.nhanLech[k]))
    const t = k.replace(/'/g, '′').replace(/(\d+)$/, '<tspan font-size="15" baseline-shift="sub">$1</tspan>')
    nhan += `<text x="${f2(pos.x)}" y="${f2(pos.y + 8)}" text-anchor="middle" fill="#111" stroke="none" ${FONT} font-style="italic" font-size="23">${t}</text>`
  }
  for (const c of spec.chu || []) {
    if (c.phu && !phu) continue
    const q = X(ten(c.tai))
    nhan += `<text x="${f2(q.x + (c.dx ?? 0))}" y="${f2(q.y + (c.dy ?? 0))}" text-anchor="middle" fill="#111" stroke="none" ${FONT} font-size="19"${c.nghieng ? ' font-style="italic"' : ''}>${c.text}</text>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#fff"/>` +
    `<g stroke="#222" stroke-width="2" stroke-linecap="round" fill="none">${body}</g>${chuGoc}${nhan}</svg>`
  return { svg, w, h }
}

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'

/** ds: [{file (không đuôi), spec, phu?}] ⇒ ghi <file>.svg + <file>.png (2x), MỘT lần mở Chrome cho cả lô */
export async function veNhieu(ds) {
  const { default: puppeteer } = await import('puppeteer-core')
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    const pg = await br.newPage()
    for (const d of ds) {
      const { svg, w, h } = svgHinh(d.spec, { phu: !!d.phu })
      mkdirSync(dirname(d.file), { recursive: true })
      writeFileSync(`${d.file}.svg`, svg)
      await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2 })
      await pg.setContent(`<body style="margin:0;background:#fff">${svg}</body>`)
      await pg.screenshot({ path: `${d.file}.png`, clip: { x: 0, y: 0, width: w, height: h } })
    }
  } finally { await br.close() }
}
