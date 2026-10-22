// k10-hinh.mjs — vẽ hình cho LÝ THUYẾT / VÍ DỤ K10: TRỤC SỐ (tập hợp, khoảng/đoạn) và MIỀN NGHIỆM (bất phương trình / hệ bất phương trình bậc nhất 2 ẩn).
// Mô tả có cấu trúc → SVG → PNG (Chrome headless). Máy vẽ, không để AI vẽ điểm ảnh (kho-rules/README.md §3).
//
//   import { svgTrucSo, svgMienNghiem, veNhieu } from './k10-hinh.mjs'
//
// TRỤC SỐ — { moc: [{ v, ten? }…], tu, den,   hàng: [{ ten, khoang: [[l, r, lc, rc]…], kieu: 'gach'|'dam' }…], ket_qua?: {ten, khoang} }
//   khoảng [l, r, lc, rc]: l/r số hoặc null (= vô cùng); lc/rc = true nếu đầu mút THUỘC tập (đóng). Hàng 'gach' = gạch phần KHÔNG thuộc tập
//   (kiểu SGK KNTT); hàng 'dam' = tô đậm phần thuộc tập; ket_qua luôn tô đậm. Mốc có `ten` thì ghi chữ ten thay cho số.
// MIỀN NGHIỆM — { x:[x0,x1], y:[y0,y1], bpt: [{ a, b, c, dau: '<'|'<='|'>'|'>=', nhan? }…], diem?: [{x,y,ten}], duong?: [{a,b,c,nhan}], dinh?: [...] }
//   bất phương trình a·x + b·y (dau) c. Miền nghiệm = giao các nửa mặt phẳng (tô màu); biên nét liền nếu có dấu '=' , nét đứt nếu không.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const f2 = (v) => (Math.round(v * 100) / 100).toString()
const NHAN = (s) => String(s).replace('-', '−')
const fmt = (v) => NHAN(f2(v)).replace('.', ',')
const BLUE = '#2563eb', INK = '#111', GRID = '#9ca3af', FILL = 'rgba(37,99,235,0.28)'

// ───────────────────────────── TRỤC SỐ ─────────────────────────────
export function svgTrucSo(mt) {
  const { moc, hang = [], ket_qua = null } = mt
  const vs = moc.map((m) => m.v)
  const lo = mt.tu ?? Math.min(...vs) - 1.5, hi = mt.den ?? Math.max(...vs) + 1.5
  const rowsAll = [...hang, ...(ket_qua ? [ket_qua] : [])]
  const maxLen = Math.max(0, ...rowsAll.map((r) => String(r.ten ?? '').length))
  const L = mt.L ?? Math.max(52, 30 + 9 * maxLen), R = 24, W = mt.w ?? 600
  const X = (v) => L + ((v - lo) / (hi - lo)) * (W - L - R)
  const rows = [...hang.map((h) => ({ ...h })), ...(ket_qua ? [{ ...ket_qua, kieu: 'kq' }] : [])]
  const H0 = 14, ROW = 54
  const H = H0 + rows.length * ROW + 34
  const o = []
  const yAx = (i) => H0 + i * ROW + 30
  // đường gióng qua các mốc
  const yTop = H0 + 8, yBot = yAx(rows.length - 1)
  for (const m of moc) o.push(`<line x1="${X(m.v)}" y1="${yTop}" x2="${X(m.v)}" y2="${yBot}" stroke="${GRID}" stroke-width="1" stroke-dasharray="4 4"/>`)
  rows.forEach((r, i) => {
    const y = yAx(i)
    o.push(`<line x1="${L - 18}" y1="${y}" x2="${W - R + 14}" y2="${y}" stroke="${INK}" stroke-width="1.6"/>`)
    o.push(`<polygon points="${W - R + 14},${y} ${W - R + 5},${y - 4} ${W - R + 5},${y + 4}" fill="${INK}"/>`)
    o.push(`<text x="4" y="${y - 6}" font-size="16" font-style="italic" font-family="Times New Roman, serif">${r.ten ?? ''}</text>`)
    // tập hợp: danh sách khoảng (l, r) — null = vô cùng
    const seg = r.khoang.map(([l, rr, lc, rc]) => ({ a: l === null ? lo - 1 : l, b: rr === null ? hi + 1 : rr, lInf: l === null, rInf: rr === null, lc: !!lc, rc: !!rc }))
    if (r.kieu === 'gach') {
      // gạch phần KHÔNG thuộc tập: phần bù của hợp các khoảng trong [lo-?, hi+?]
      const ss = [...seg].sort((p, q) => p.a - q.a)
      const out = []
      let cur = lo - 0.6
      for (const s of ss) { if (s.a > cur) out.push([cur, s.a]); cur = Math.max(cur, s.b) }
      if (cur < hi + 0.3) out.push([cur, hi + 0.3])
      for (const [p, q] of out) {
        const x1 = Math.max(X(p), L - 18), x2 = Math.min(X(q), W - R + 4)
        for (let x = x1; x <= x2; x += 7) o.push(`<line x1="${f2(x)}" y1="${y - 20}" x2="${f2(Math.min(x + 6, x2))}" y2="${y - 2}" stroke="#444" stroke-width="1.2"/>`)
      }
    } else {
      for (const s of seg) {
        const x1 = s.lInf ? L - 18 : X(s.a), x2 = s.rInf ? W - R + 12 : X(s.b)
        o.push(`<line x1="${f2(x1)}" y1="${y}" x2="${f2(x2)}" y2="${y}" stroke="${BLUE}" stroke-width="${r.kieu === 'kq' ? 6 : 4}" stroke-linecap="butt"/>`)
      }
    }
    // đầu mút
    for (const s of seg) {
      if (!s.lInf) o.push(`<circle cx="${X(s.a)}" cy="${y}" r="5" fill="${s.lc ? INK : '#fff'}" stroke="${INK}" stroke-width="1.6"/>`)
      if (!s.rInf) o.push(`<circle cx="${X(s.b)}" cy="${y}" r="5" fill="${s.rc ? INK : '#fff'}" stroke="${INK}" stroke-width="1.6"/>`)
    }
  })
  // nhãn mốc dưới hàng cuối
  const yl = yAx(rows.length - 1) + 22
  for (const m of moc) o.push(`<text x="${X(m.v)}" y="${yl}" font-size="15" text-anchor="middle" font-family="Times New Roman, serif" ${m.ten ? 'font-style="italic"' : ''}>${m.ten ?? fmt(m.v)}</text>`)
  const svg = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial, Helvetica, sans-serif">`, `<rect width="${W}" height="${H}" fill="#fff"/>`, ...o, '</svg>'].join('\n')
  return { svg, w: W, h: H }
}

// ───────────────────────────── MIỀN NGHIỆM ─────────────────────────────
function cat(poly, a, b, c, ngoai) { // giữ phần a·x+b·y <= c  (Sutherland–Hodgman một cạnh)
  const out = []
  const g = (p) => a * p.x + b * p.y - c
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length]
    const gp = g(p), gq = g(q)
    const inP = gp <= 1e-9, inQ = gq <= 1e-9
    if (inP) out.push(p)
    if (inP !== inQ) { const t = gp / (gp - gq); out.push({ x: p.x + t * (q.x - p.x), y: p.y + t * (q.y - p.y) }) }
  }
  return out
}

export function svgMienNghiem(mt) {
  const [x0, x1] = mt.x, [y0, y1] = mt.y
  const S = mt.pxu ?? 38
  const ML = 26, MR = 26, MT = 22, MB = 26
  const W = Math.round((x1 - x0) * S + ML + MR), H = Math.round((y1 - y0) * S + MT + MB)
  const X = (v) => ML + (v - x0) * S, Y = (v) => MT + (y1 - v) * S
  const o = []
  // miền nghiệm
  let poly = [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }]
  for (const p of mt.bpt ?? []) {
    const gt = p.dau === '>' || p.dau === '>='
    poly = cat(poly, gt ? -p.a : p.a, gt ? -p.b : p.b, gt ? -p.c : p.c)
  }
  if (poly.length >= 3) o.push(`<polygon points="${poly.map((p) => `${f2(X(p.x))},${f2(Y(p.y))}`).join(' ')}" fill="${FILL}" stroke="none"/>`)
  // lưới nhẹ + trục
  const st = mt.luoi ?? 1
  for (let v = Math.ceil(x0 / st) * st; v <= x1; v += st) o.push(`<line x1="${X(v)}" y1="${MT}" x2="${X(v)}" y2="${H - MB}" stroke="#e5e7eb" stroke-width="1"/>`)
  for (let v = Math.ceil(y0 / st) * st; v <= y1; v += st) o.push(`<line x1="${ML}" y1="${Y(v)}" x2="${W - MR}" y2="${Y(v)}" stroke="#e5e7eb" stroke-width="1"/>`)
  const ax = (x0 <= 0 && x1 >= 0) ? X(0) : null, ay = (y0 <= 0 && y1 >= 0) ? Y(0) : null
  if (ay !== null) { o.push(`<line x1="${ML - 8}" y1="${ay}" x2="${W - MR + 10}" y2="${ay}" stroke="${INK}" stroke-width="1.6"/><polygon points="${W - MR + 10},${ay} ${W - MR + 2},${ay - 4} ${W - MR + 2},${ay + 4}" fill="${INK}"/><text x="${W - MR + 6}" y="${ay + 18}" font-size="15" font-style="italic" font-family="Times New Roman, serif">x</text>`) }
  if (ax !== null) { o.push(`<line x1="${ax}" y1="${H - MB + 8}" x2="${ax}" y2="${MT - 12}" stroke="${INK}" stroke-width="1.6"/><polygon points="${ax},${MT - 12} ${ax - 4},${MT - 4} ${ax + 4},${MT - 4}" fill="${INK}"/><text x="${ax + 8}" y="${MT - 2}" font-size="15" font-style="italic" font-family="Times New Roman, serif">y</text>`) }
  if (ax !== null && ay !== null) o.push(`<text x="${ax - 14}" y="${ay + 16}" font-size="14" font-style="italic" font-family="Times New Roman, serif">O</text>`)
  const ticks = mt.nhan_truc ?? { x: [], y: [] }
  for (const v of ticks.x ?? []) if (ay !== null && v !== 0) o.push(`<line x1="${X(v)}" y1="${ay - 4}" x2="${X(v)}" y2="${ay + 4}" stroke="${INK}"/><text x="${X(v)}" y="${ay + 18}" font-size="13" text-anchor="middle" font-family="Times New Roman, serif">${fmt(v)}</text>`)
  for (const v of ticks.y ?? []) if (ax !== null && v !== 0) o.push(`<line x1="${ax - 4}" y1="${Y(v)}" x2="${ax + 4}" y2="${Y(v)}" stroke="${INK}"/><text x="${ax - 8}" y="${Y(v) + 4}" font-size="13" text-anchor="end" font-family="Times New Roman, serif">${fmt(v)}</text>`)
  // đường biên
  const duong = [...(mt.bpt ?? []).map((p) => ({ a: p.a, b: p.b, c: p.c, net: p.dau.includes('=') ? 'lien' : 'dut', nhan: p.nhan })), ...(mt.duong ?? []).map((d) => ({ ...d, net: d.net ?? 'lien' }))]
  for (const d of duong) {
    const pts = []
    if (Math.abs(d.b) > 1e-9) { for (const xx of [x0, x1]) { const yy = (d.c - d.a * xx) / d.b; if (yy >= y0 - 1e-9 && yy <= y1 + 1e-9) pts.push({ x: xx, y: yy }) } }
    if (Math.abs(d.a) > 1e-9) { for (const yy of [y0, y1]) { const xx = (d.c - d.b * yy) / d.a; if (xx >= x0 - 1e-9 && xx <= x1 + 1e-9 && !pts.some((p) => Math.abs(p.x - xx) < 1e-6 && Math.abs(p.y - yy) < 1e-6)) pts.push({ x: xx, y: yy }) } }
    if (pts.length < 2) continue
    o.push(`<line x1="${f2(X(pts[0].x))}" y1="${f2(Y(pts[0].y))}" x2="${f2(X(pts[1].x))}" y2="${f2(Y(pts[1].y))}" stroke="${INK}" stroke-width="2" ${d.net === 'dut' ? 'stroke-dasharray="7 5"' : ''}/>`)
    if (d.nhan) { const p = d.nhan_tai ? { x: d.nhan_tai[0], y: d.nhan_tai[1] } : pts[1]; o.push(`<text x="${f2(X(p.x) + (d.dx ?? 6))}" y="${f2(Y(p.y) + (d.dy ?? -8))}" font-size="15" font-style="italic" font-family="Times New Roman, serif">${d.nhan}</text>`) }
  }
  for (const p of mt.diem ?? []) {
    o.push(`<circle cx="${f2(X(p.x))}" cy="${f2(Y(p.y))}" r="3.8" fill="${INK}"/>`)
    if (p.ten && p.ten !== 'O') o.push(`<text x="${f2(X(p.x) + (p.dx ?? 7))}" y="${f2(Y(p.y) + (p.dy ?? -7))}" font-size="15" font-family="Times New Roman, serif"><tspan font-style="italic">${p.ten}</tspan></text>`)
  }
  const svg = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial, Helvetica, sans-serif">`, `<rect width="${W}" height="${H}" fill="#fff"/>`, ...o, '</svg>'].join('\n')
  return { svg, w: W, h: H }
}

// ───────────────────────────── xuất PNG hàng loạt ─────────────────────────────
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
/** ds = [{ svg, w, h, file }] → <file>.svg + <file>.png (2x) */
export async function veNhieu(ds) {
  const { default: puppeteer } = await import('puppeteer-core')
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    const pg = await br.newPage()
    for (const d of ds) {
      mkdirSync(dirname(d.file), { recursive: true })
      writeFileSync(`${d.file}.svg`, d.svg)
      await pg.setViewport({ width: d.w, height: d.h, deviceScaleFactor: 2 })
      await pg.setContent(`<body style="margin:0;background:#fff">${d.svg}</body>`)
      await pg.screenshot({ path: `${d.file}.png`, clip: { x: 0, y: 0, width: d.w, height: d.h } })
    }
  } finally { await br.close() }
}
