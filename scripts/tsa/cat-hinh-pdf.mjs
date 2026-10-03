// Cắt "đề" và "lời giải" của 1 câu từ PDF — dùng khi Word có công thức dạng ảnh WMF mà bộ đọc không đổi được.
//   node scripts/tsa/cat-hinh-pdf.mjs <pdf> <số câu> <trang bắt đầu của câu> <thư mục ra> <nhãn>
// Ra: <nhãn>_de.png, <nhãn>_giai.png (ghép nhiều trang nếu lời giải chảy sang trang sau).
// Mốc cắt lấy từ toạ độ chữ (pdftotext -bbox): "Câu N:" · "Lời giải" · "Câu N+1:" · chân trang.
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
const { PNG } = createRequire(import.meta.url)('pngjs')

const [pdf, soS, trangS, ra, nhan] = process.argv.slice(2)
const so = +soS, trang = +trangS
const DPI = 170, K = DPI / 72
mkdirSync(ra, { recursive: true })

function tu(p) {
  const x = spawnSync('pdftotext', ['-bbox', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8' }).stdout
  return [...x.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)<\/word>/g)]
    .map((m) => ({ x0: +m[1], y0: +m[2], x1: +m[3], y1: +m[4], t: m[5] }))
}
const dongCau = (ws, n) => {
  for (let i = 0; i < ws.length - 1; i++) if (ws[i].t === 'Câu' && (ws[i + 1].t === `${n}:` || ws[i + 1].t === `${n}.`) && ws[i].x0 < 90) return ws[i].y0 - 2
  return null
}
const yLoiGiai = (ws, tuY) => {
  for (let i = 0; i < ws.length - 1; i++) if (ws[i].t === 'Lời' && ws[i + 1].t === 'giải' && ws[i].y0 > tuY) return ws[i].y0 - 3
  return null
}
const yChan = (ws) => { const ys = ws.filter((w) => (w.t === 'Đăng' || w.t === 'Trang') && w.y0 > 700).map((w) => w.y0); return ys.length ? Math.min(...ys) - 4 : 780 }

function anhTrang(p) {
  const out = join(tmpdir(), `tsa_p${p}_${process.pid}`)
  const r = spawnSync('pdftoppm', ['-r', String(DPI), '-f', String(p), '-l', String(p), '-png', '-singlefile', pdf, out])
  if (r.status !== 0) throw new Error('pdftoppm lỗi')
  return PNG.sync.read(readFileSync(out + '.png'))
}
function cat(p, y0, y1) {
  const im = anhTrang(p)
  const x0 = Math.round(40 * K), w = im.width - 2 * x0, t = Math.max(0, Math.round(y0 * K)), h = Math.min(im.height - t, Math.round((y1 - y0) * K))
  const o = new PNG({ width: w, height: h })
  PNG.bitblt(im, o, x0, t, w, h, 0, 0)
  // xoá đường kẻ đỏ của đầu/chân trang lọt vào vùng cắt: hàng có >60% điểm ảnh đỏ đậm ⇒ tô trắng
  for (let y = 0; y < h; y++) {
    let dd = 0
    for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; if (o.data[i] > 140 && o.data[i + 1] < 70 && o.data[i + 2] < 70) dd++ }
    if (dd > w * 0.6) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; o.data[i] = o.data[i + 1] = o.data[i + 2] = 255 }
  }
  return o
}
function ghep(ds) {
  const w = Math.max(...ds.map((d) => d.width)), h = ds.reduce((s, d) => s + d.height, 0)
  const o = new PNG({ width: w, height: h }); o.data.fill(255)
  let y = 0
  for (const d of ds) { PNG.bitblt(d, o, 0, 0, d.width, d.height, 0, y); y += d.height }
  return o
}

const ws = tu(trang)
const yc = dongCau(ws, so)
if (yc == null) { console.error(`không thấy câu ${so} ở trang ${trang}`); process.exit(1) }
// "Lời giải" có thể nằm ở trang sau (đề ở cuối trang) — khi đó phần đề ghép 2 trang
const dePhan = []
let pg = trang, yTu = yc, yl = null
for (;;) {
  const w = pg === trang ? ws : tu(pg)
  yl = yLoiGiai(w, yTu)
  if (yl != null) { dePhan.push(cat(pg, yTu, yl)); break }
  dePhan.push(cat(pg, yTu, yChan(w)))
  pg++; yTu = 40
  if (pg > trang + 2) { console.error('không thấy "Lời giải"'); process.exit(1) }
}
const de = ghep(dePhan)
const phan = []
let p = pg, yBat = yl
for (;;) {
  const w = p === trang ? ws : tu(p)
  const yTiep = dongCau(w, so + 1)
  if (yTiep != null && (p > pg || yTiep > yBat)) { phan.push(cat(p, yBat, yTiep)); break }
  phan.push(cat(p, yBat, yChan(w)))
  p++; yBat = 56
  if (p > pg + 3) { console.error('lời giải chảy quá 3 trang — kiểm tay'); process.exit(1) }
}
const giai = ghep(phan)
writeFileSync(join(ra, `${nhan}_de.png`), PNG.sync.write(de))
writeFileSync(join(ra, `${nhan}_giai.png`), PNG.sync.write(giai))
console.log(nhan, 'đề', de.width + 'x' + de.height, 'giải', giai.width + 'x' + giai.height, 'trang', trang, '→', p)
