// ============================================================================
// k4T-tbc-anh-so-do.mjs — dựng ẢNH PNG mọi sơ đồ máy vẽ của lô clone Trung bình cộng + bảng kê cho trạm `kiem-hinh-b`
// (một model KHÁC nhìn ảnh + đề, xác nhận sơ đồ đúng bài).
//
//   node scripts/kho/clone/k4T-tbc-anh-so-do.mjs <lo.json> --ra <thư mục> [--nhom 6]
//
// Ghi <ra>/<id>.png (đúng như sẽ lên kho: veSoDo → SVG → PNG 2x) và <ra>/nhom-<i>.json =
//   [{ id, anh, de, loi_giai_phan_2, dap_an }]. Không gọi AI, không đụng DB. Lô phải có trường `id` (số thứ tự trong lô).
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { veSoDo } from '../so-do-doan-thang.mjs'

const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
const RA = lay('--ra'), NHOM = Number(lay('--nhom') ?? 6)
if (!a[0] || !RA) { console.error('Dùng: node scripts/kho/clone/k4T-tbc-anh-so-do.mjs <lo.json> --ra <dir> [--nhom 6]'); process.exit(2) }
const lo = JSON.parse(readFileSync(a[0], 'utf8'))
mkdirSync(RA, { recursive: true })

const ds = []
for (const c of lo) {
  if (!c.so_do) continue
  const svg = veSoDo(c.so_do)
  const anh = join(RA, `c${c.id}.png`).replace(/\\/g, '/')
  ds.push({ svg, w: Math.ceil(Number(svg.match(/width="([\d.]+)"/)[1])), h: Math.ceil(Number(svg.match(/height="([\d.]+)"/)[1])),
    muc: { id: c.id, anh, de: c.noi_dung, loi_giai_phan_2: c.loi_giai.slice(c.loi_giai.indexOf('**Phần 2. Trình bày**')), dap_an: c.dap_an } })
}
const { default: puppeteer } = await import('puppeteer-core')
const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
try {
  const pg = await br.newPage()
  for (const x of ds) {
    await pg.setViewport({ width: x.w, height: x.h, deviceScaleFactor: 2 })
    await pg.setContent(`<body style="margin:0;background:#fff">${x.svg}</body>`)
    await pg.screenshot({ path: x.muc.anh, clip: { x: 0, y: 0, width: x.w, height: x.h } })
  }
} finally { await br.close() }
const co = Math.ceil(ds.length / NHOM)
for (let i = 0; i < NHOM; i++) writeFileSync(join(RA, `nhom-${i + 1}.json`), JSON.stringify(ds.slice(i * co, (i + 1) * co).map((x) => x.muc), null, 1))
console.log(`${ds.length} câu có sơ đồ → ${RA} · ${NHOM} nhóm, mỗi nhóm ≤ ${co} câu`)
