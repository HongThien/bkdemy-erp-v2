// Tờ SOÁT hình theo ý: ghép các PNG của một gói thành vài tờ lưới (mỗi ô = hình + mã + câu hỏi của ý) để soát nhanh bằng mắt.
//   node scripts/hinh-luyen/ve/to_soat.mjs <gói>        → scripts/hinh-luyen/ve/<gói>/soat-1.png, soat-2.png …
// Đọc bản nháp tách ý (scripts/hinh-luyen/nhap/k8-de-thi.json) để in câu hỏi cạnh hình — chỉ để NGƯỜI soát, không ghi DB.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const goi = process.argv[2]; if (!goi) { console.error('thiếu <gói>'); process.exit(2) }
const dir = `scripts/hinh-luyen/ve/${goi}`, moi = `${dir}/moi`
if (!existsSync(moi)) { console.error(`không thấy ${moi}`); process.exit(2) }
const viec = readFileSync(`${dir}/viec.md`, 'utf8')
// HLB…/HLY… → nhãn + câu hỏi, lấy từ viec.md (đã có đủ)
const nhanCua = {}
for (const m of viec.matchAll(/## (HLB\d+) · gốc (\S+)[\s\S]*?\*\*GIẢ THIẾT CHUNG\*\*[^\n]*\n\n([^\n]*)/g)) nhanCua[m[1]] = `BÀI · ${m[3]}`
for (const m of viec.matchAll(/### ý (\S+) · (HLY\d+)[^\n]*\n\n\*\*Hỏi:\*\* ([^\n]*)/g)) nhanCua[m[2]] = `ý ${m[1]}) ${m[3]}`
const tep = readdirSync(moi).filter((f) => /^HL[BY]\d+\.png$/.test(f)).sort((a, b) => {
  // giữ thứ tự xuất hiện trong viec.md (bài rồi các ý của nó)
  const ia = viec.indexOf(a.replace('.png', '')), ib = viec.indexOf(b.replace('.png', '')); return ia - ib
})
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
const pg = await br.newPage()
const MOI_TO = 6
for (let t = 0; t * MOI_TO < tep.length; t++) {
  const phan = tep.slice(t * MOI_TO, (t + 1) * MOI_TO)
  const o = phan.map((f) => {
    const ma = f.replace('.png', ''), b64 = readFileSync(`${moi}/${f}`).toString('base64')
    return `<div class=o><div class=ma>${ma}</div><img src="data:image/png;base64,${b64}"><div class=h>${esc(nhanCua[ma] ?? '')}</div></div>`
  }).join('')
  await pg.setViewport({ width: 1500, height: 900, deviceScaleFactor: 1 })
  await pg.setContent(`<style>body{margin:8px;font:13px system-ui}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.o{border:1px solid #ccc;border-radius:6px;padding:4px}.ma{font-weight:700;color:#0f766e}img{width:100%;max-height:330px;object-fit:contain}.h{color:#333;font-size:12px;max-height:48px;overflow:hidden}</style><div class=g>${o}</div>`)
  const h = await pg.evaluate(() => document.body.scrollHeight + 16)
  await pg.setViewport({ width: 1500, height: h, deviceScaleFactor: 1 })
  await pg.screenshot({ path: `${dir}/soat-${t + 1}.png`, fullPage: true })
  console.log(`✔ ${dir}/soat-${t + 1}.png (${phan.length} hình)`)
}
await br.close()
