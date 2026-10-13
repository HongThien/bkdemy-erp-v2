// ve_lai_bang.mjs — LUỒNG VẼ LẠI HÌNH: bảng đối chiếu ẢNH CŨ | HÌNH MỚI của một gói, để người soát nhìn một lượt.
//
//   node scripts/anh/ve_lai_bang.mjs <thu_muc_goi> [<thu_muc_goi>…]
//
// Đọc <goi>/viec.json, <goi>/cu/*, <goi>/moi/<ten>.png → <goi>/bang-<n>.png (mỗi bảng 6 hình). Hình chưa vẽ hiện ô "CHƯA CÓ".
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const dirs = process.argv.slice(2)
if (!dirs.length) { console.error('Dùng: node scripts/anh/ve_lai_bang.mjs <thu_muc_goi> […]'); process.exit(2) }
const KIEU = { png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', webp: 'image/webp', gif: 'image/gif' }
const data = (p) => `data:${KIEU[p.split('.').pop()] || 'image/png'};base64,${fs.readFileSync(p).toString('base64')}`
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const br = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
try {
  for (const dir of dirs) {
    const { goi, hinh } = JSON.parse(fs.readFileSync(path.join(dir, 'viec.json'), 'utf8'))
    for (const f of fs.readdirSync(dir)) if (/^bang-\d+\.png$/.test(f)) fs.rmSync(path.join(dir, f))
    let thieu = 0
    for (let i = 0, n = 1; i < hinh.length; i += 6, n++) {
      const o = hinh.slice(i, i + 6).map((h) => {
        const moi = path.join(dir, 'moi', `${h.ten}.png`), co = fs.existsSync(moi)
        if (!co) thieu++
        const de = h.cau.map((c) => `${c.ma_cau}: ${c.noi_dung}`).join(' ‖ ').replace(/\s+/g, ' ').slice(0, 420)
        return `<div class="o"><b>${h.ten}</b> <i>${h.kieu}</i><div class="h"><div><img src="${data(h.anh_cu)}"></div><div>${co ? `<img src="${data(moi)}">` : '<span class="x">CHƯA CÓ</span>'}</div></div><p>${esc(de)}</p></div>`
      }).join('')
      const html = `<style>body{margin:0;background:#fff;font:13px/1.3 Arial}.l{display:grid;grid-template-columns:repeat(2,810px);gap:6px;padding:6px}.o{border:1px solid #888;padding:3px}
.h{display:grid;grid-template-columns:1fr 1fr;gap:4px;height:300px}.h>div{display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px dashed #ccc}.h>div:last-child{background:#f4fff4}
img{max-width:396px;max-height:296px}p{margin:2px 0 0;height:50px;overflow:hidden;font-size:12px}.x{color:#c00;font-weight:bold}b{font-size:12px}i{color:#06c}</style><div class="l">${o}</div>`
      const p = await br.newPage(); await p.setViewport({ width: 1640, height: 400 })
      await p.setContent(html); await p.screenshot({ path: path.join(dir, `bang-${n}.png`), fullPage: true }); await p.close()
    }
    console.log(`${goi}: ${hinh.length} hình${thieu ? ` · THIẾU ${thieu}` : ''} → ${Math.ceil(hinh.length / 6)} bảng`)
  }
} finally { await br.close() }
