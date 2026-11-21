// me4-dung-anh-so-do.mjs — dựng ẢNH PNG các sơ đồ của lô ME4 (kho-rules/dai/lo/me4/ME4-CD*.soan.json → veSoDo → SVG → PNG bằng Chrome)
// để trạm kiểm (model KHÁC) NHÌN ảnh sơ đồ đối chiếu với đề (biên bản kiem-hinh-b của cổng ghi).
//   node scripts/kho/sach/me4-dung-anh-so-do.mjs <thư mục ra>     → <ra>/<n>.png + <ra>/_manifest.json
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'
import { veSoDo } from '../so-do-doan-thang.mjs'

const ra = process.argv[2]
if (!ra) { console.error('Dùng: node scripts/kho/sach/me4-dung-anh-so-do.mjs <thư mục ra>'); process.exit(2) }
mkdirSync(ra, { recursive: true })
const DIR = 'kho-rules/dai/lo/me4'
const ds = []
for (const f of readdirSync(DIR).filter((x) => /^ME4-CD\d+\.lo\.json$/.test(x)).sort()) {
  const lo = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  const soan = JSON.parse(readFileSync(join(DIR, f.replace('.lo.json', '.soan.json')), 'utf8'))
  const moTa = new Map(soan.map((s) => [s.ma_nguon, s.so_do_mo_ta]))
  for (const c of lo) if (c.so_do) ds.push({ ma: c.ma_nguon, noi_dung: c.noi_dung, dap_an: c.dap_an, mo_ta: moTa.get(c.ma_nguon) })
}
const br = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
const manifest = {}
try {
  const pg = await br.newPage()
  let i = 0
  for (const d of ds) {
    i++
    const svg = veSoDo(d.mo_ta)
    await pg.setViewport({ width: 900, height: 500 })
    await pg.setContent(`<body style="margin:0;background:#fff;display:inline-block">${svg}</body>`)
    const el = await pg.$('body')
    const ten = `${String(i).padStart(3, '0')}.png`
    await el.screenshot({ path: join(ra, ten) })
    manifest[d.ma] = { png: ten, noi_dung: d.noi_dung, dap_an: d.dap_an }
  }
} finally { await br.close() }
writeFileSync(join(ra, '_manifest.json'), JSON.stringify(manifest, null, 1))
console.log(`đã dựng ${ds.length} ảnh sơ đồ → ${ra}`)
