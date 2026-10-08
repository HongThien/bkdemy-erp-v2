// bang_hinh.mjs — gom các PNG trong 1 thư mục thành MỘT bảng ảnh để Read xem một lượt (soát nhãn bị cắt, sai ký hiệu).
//   node scripts/anh/bang_hinh.mjs <thu_muc_png> <bang_ra.png> [regex_loc_ten_file]
import { readdirSync, readFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const [dir, out, loc] = process.argv.slice(2)
if (!dir || !out) { console.error('Dùng: node scripts/anh/bang_hinh.mjs <thu_muc_png> <bang_ra.png> [regex]'); process.exit(2) }
const ds = readdirSync(dir).filter((f) => f.endsWith('.png') && !f.startsWith('_') && (!loc || new RegExp(loc).test(f))).sort()
const html = `<body style="margin:0;background:#ddd;font:13px sans-serif"><div style="display:flex;flex-wrap:wrap;gap:10px;padding:10px;width:1500px">${
  ds.map((f) => `<div style="background:#fff;padding:5px"><div>${f}</div><img src="data:image/png;base64,${readFileSync(dir + '/' + f).toString('base64')}" style="height:300px"></div>`).join('')}</div></body>`
const br = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
try {
  const pg = await br.newPage()
  await pg.setViewport({ width: 1520, height: 800 })
  await pg.setContent(html)
  await new Promise((r) => setTimeout(r, 500))
  await pg.screenshot({ path: out, fullPage: true })
} finally { await br.close() }
console.log(`bảng: ${ds.length} hình → ${out}`)
