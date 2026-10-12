// hinh-doan-thang-thuoc.mjs — vẽ hình "đoạn thẳng CD dài N cm" ĐÚNG KÍCH THƯỚC THẬT để HS cầm thước đo (bài trung điểm).
// Kích thước vật lý chính xác: SVG đơn vị mm; PNG 600 DPI (có chunk pHYs ⇒ Word/trình in chèn ra đúng cỡ khi để 100%).
//   node scripts/kho/hinh-doan-thang-thuoc.mjs --dai 8,10,7.5,12 [--ten CD,AB,MN] [--ra thu-muc] [--dap-an]
//   --dai  : danh sách độ dài cm (cách nhau dấu phẩy; số thập phân dùng dấu chấm)
//   --ten  : tên 2 đầu mút (mỗi phần tử 2 chữ cái). Ít hơn số độ dài thì quay vòng.
//   --dap-an: xuất thêm bản có trung điểm M (gạch đánh dấu + nhãn "N/2 cm" hai nửa) để làm đáp án.
// Ra:  <ra>/doan-<TEN>-<dai>cm.svg|png  (+ -dap-an). Hai đầu mút là tâm 2 chấm tròn, cách nhau ĐÚNG N cm.
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { crc32 } from 'node:zlib'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const DPI = 600
const PX_MM = DPI / 25.4 // px mỗi mm ở 600 dpi
const f = (n) => Math.round(n * 1000) / 1000

function arg(ten, mac = null) {
  const i = process.argv.indexOf('--' + ten)
  if (i < 0) return mac
  const v = process.argv[i + 1]
  return v && !v.startsWith('--') ? v : true
}

/** SVG đơn vị mm. Trả {svg, wMm, hMm}. */
export function veDoanThang({ dai, ten = 'CD', dapAn = false }) {
  const A = ten[0], B = ten[1]
  const TD = ten.includes('M') ? 'I' : 'M' // nhãn trung điểm — tránh trùng chữ cái với đầu mút
  const le = 20 // lề trái/phải (mm) — đủ chỗ cho chữ đầu mút
  const cao = dapAn ? 38 : 34
  // Bề rộng làm tròn LÊN sao cho số pixel là bội của 25 (⇒ viewport CSS nguyên ở 600 dpi / DSF 6.25)
  const wPx = Math.ceil(((dai * 10 + 2 * le) * PX_MM) / 25) * 25
  const wMm = (wPx * 25.4) / DPI
  const x0 = (wMm - dai * 10) / 2
  const x1 = x0 + dai * 10
  const y = 18
  const xm = (x0 + x1) / 2
  const nhan = `${String(dai).replace('.', ',')} cm`
  const font = `font-family="Times New Roman, Times, serif" font-weight="bold" text-anchor="middle"`
  let s = ''
  s += `<line x1="${f(x0)}" y1="${y}" x2="${f(x1)}" y2="${y}" stroke="#000" stroke-width="0.3"/>`
  s += `<circle cx="${f(x0)}" cy="${y}" r="0.8" fill="#000"/><circle cx="${f(x1)}" cy="${y}" r="0.8" fill="#000"/>`
  s += `<text x="${f(x0)}" y="${y + 9}" font-size="6.5" ${font}>${A}</text>`
  s += `<text x="${f(x1)}" y="${y + 9}" font-size="6.5" ${font}>${B}</text>`
  if (!dapAn) {
    s += `<text x="${f(xm)}" y="${y - 6}" font-size="6.5" ${font}>${nhan}</text>`
  } else {
    const nua = `${String(dai / 2).replace('.', ',')} cm`
    s += `<line x1="${f(xm)}" y1="${y - 2.5}" x2="${f(xm)}" y2="${y + 2.5}" stroke="#000" stroke-width="0.3"/>`
    s += `<circle cx="${f(xm)}" cy="${y}" r="0.8" fill="#000"/>`
    s += `<text x="${f(xm)}" y="${y + 9}" font-size="6.5" ${font}>${TD}</text>`
    s += `<text x="${f((x0 + xm) / 2)}" y="${y - 6}" font-size="6.5" ${font}>${nua}</text>`
    s += `<text x="${f((xm + x1) / 2)}" y="${y - 6}" font-size="6.5" ${font}>${nua}</text>`
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${f(wMm)}mm" height="${cao}mm" viewBox="0 0 ${f(wMm)} ${cao}"><rect width="100%" height="100%" fill="#fff"/>${s}</svg>`
  return { svg, wMm, hMm: cao, wPx, hPx: Math.ceil((cao * PX_MM) / 25) * 25, x0, x1 }
}

/** Chèn chunk pHYs (600 dpi) ngay sau IHDR để trình in/Word hiểu đúng kích thước vật lý. */
function ghiDpi(buf) {
  const ppm = Math.round((DPI / 25.4) * 1000)
  const data = Buffer.alloc(9)
  data.writeUInt32BE(ppm, 0); data.writeUInt32BE(ppm, 4); data[8] = 1
  const tag = Buffer.from('pHYs')
  const len = Buffer.alloc(4); len.writeUInt32BE(9)
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([tag, data])) >>> 0)
  const chunk = Buffer.concat([len, tag, data, crc])
  return Buffer.concat([buf.subarray(0, 33), chunk, buf.subarray(33)]) // 8 chữ ký + 25 IHDR
}

async function main() {
  const dais = String(arg('dai', '')).split(',').map(Number).filter((n) => n > 0)
  if (!dais.length) { console.error('Thiếu --dai (vd --dai 8,10,12)'); process.exit(1) }
  const tens = String(arg('ten', 'CD')).split(',').map((t) => t.trim()).filter(Boolean)
  const ra = arg('ra', 'out/doan-thang')
  const co = !!arg('dap-an', false)
  mkdirSync(ra, { recursive: true })
  const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  try {
    for (let i = 0; i < dais.length; i++) {
      const ten = tens[i % tens.length]
      for (const dapAn of co ? [false, true] : [false]) {
        const h = veDoanThang({ dai: dais[i], ten, dapAn })
        const base = `${ra}/doan-${ten}-${String(dais[i]).replace('.', ',')}cm${dapAn ? '-dap-an' : ''}`
        writeFileSync(base + '.svg', h.svg)
        const pg = await br.newPage()
        const cssW = h.wPx / 6.25, cssH = h.hPx / 6.25
        await pg.setViewport({ width: cssW, height: cssH, deviceScaleFactor: 6.25 })
        await pg.setContent(`<body style="margin:0;background:#fff">${h.svg}</body>`)
        const png = await pg.screenshot({ clip: { x: 0, y: 0, width: cssW, height: cssH } })
        writeFileSync(base + '.png', ghiDpi(Buffer.from(png)))
        await pg.close()
        console.log(`✔ ${base}.png  ${h.wPx}×${h.hPx}px @${DPI}dpi = ${f(h.wMm)}×${h.hMm} mm · đoạn ${dais[i]} cm`)
      }
    }
  } finally { await br.close() }
}

if (import.meta.url === `file:///${process.argv[1]?.replace(/\\/g, '/')}`) main()
