// ve_lai_xuat_hgt.mjs — gói việc VẼ LẠI HÌNH ĐỀ cho câu HGT (hgt_cau_hoi) của một/nhiều DẠNG BÀI bản đồ mới (Thùy 08/11: chuyên đề "Tích của véc tơ với một số").
//   node scripts/anh/ve_lai_xuat_hgt.mjs --dang NDB00907,NDB00909,... [--moi-goi 8] [--ra <thu_muc>] [--ten VT]
// CHỈ ĐỌC DB. Gom theo URL ảnh (câu dùng chung ảnh ⇒ một hình, tên tệp ra `ma1+ma2`). Mỗi gói: viec.md + viec.json + cu/<ten>.png.
// Gắn lại: node --env-file=.env scripts/anh/gan_hinh.mjs <goi>/moi --bang hgt --thay --ghi   (chỉ cột anh_de, không đụng lời giải).
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import puppeteer from 'puppeteer-core'
process.loadEnvFile('.env')
const argv = process.argv.slice(2)
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
const DANG = opt('--dang')?.split(','), MOI = +opt('--moi-goi', 8), TEN = opt('--ten', 'VT')
const RA = opt('--ra', 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh')
if (!DANG) { console.error('Dùng: --dang NDB00907,NDB00909 [--moi-goi 8] [--ten VT]'); process.exit(2) }
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL }); await db.connect(); await db.query('begin read only')
const rows = (await db.query(`select q.ma_cau, q.loai_cau, q.noi_dung, q.lua_chon, q.menh_de, q.dap_an, q.loi_giai, q.anh_de, g.dang_bai_id, d.ten dang from hgt_bdm_gan_cau g join hgt_cau_hoi q on q.ma_cau=g.ma_cau join dai_bdm_dang_bai d on d.id=g.dang_bai_id
  where g.dang_bai_id = any($1) and q.xoa_at is null and coalesce(q.anh_de,'')<>'' order by q.anh_de, q.ma_cau`, [DANG])).rows
await db.end()
const nhom = new Map(); for (const r of rows) { if (!nhom.has(r.anh_de)) nhom.set(r.anh_de, []); nhom.get(r.anh_de).push(r) }
const hinh = [...nhom.entries()].map(([url, cau]) => ({ url, cau, ten: cau.map((c) => c.ma_cau).join('+') }))
console.log(`${rows.length} câu · ${hinh.length} hình khác nhau`)
const goi = []; for (let i = 0; i < hinh.length; i += MOI) goi.push(hinh.slice(i, i + MOI))
const br = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
try {
  const pg2 = await br.newPage()
  for (let k = 0; k < goi.length; k++) {
    const dir = path.join(RA, `${TEN}-${k + 1}`); fs.mkdirSync(path.join(dir, 'cu'), { recursive: true })
    let md = `# Gói ${TEN}-${k + 1} — vẽ lại HÌNH ĐỀ câu HGT (vectơ)\n\nTên tệp ra = đúng như ghi bên dưới (đuôi .png), đặt trong \`moi/\`. Chỉ hình ĐỀ.\n`
    const js = []
    for (const h of goi[k]) {
      const buf = Buffer.from(await (await fetch(h.url)).arrayBuffer())
      const svg = /svg/i.test(h.url) || buf.slice(0, 200).toString().includes('<svg')
      let png = path.join(dir, 'cu', `${h.ten}.png`)
      if (svg) { fs.writeFileSync(path.join(dir, 'cu', `${h.ten}.svg`), buf)
        await pg2.setViewport({ width: 700, height: 500 }); await pg2.setContent(`<body style="margin:0;background:#fff"><img src="data:image/svg+xml;base64,${buf.toString('base64')}" style="max-width:680px;max-height:480px"></body>`); await pg2.screenshot({ path: png, fullPage: true }) }
      else fs.writeFileSync(png, buf)
      md += `\n---\n## ${h.ten}.png  (${h.cau.length} câu dùng chung)\nẢnh cũ: \`cu/${h.ten}.png\` · dạng: ${[...new Set(h.cau.map((c) => c.dang))].join(' | ')}\n`
      for (const c of h.cau) md += `\n### ${c.ma_cau} · ${c.loai_cau}\n**Đề:** ${c.noi_dung}\n${c.lua_chon ? c.lua_chon.map((t, i) => `- ${'ABCD'[i]}. ${t}`).join('\n') + '\n' : ''}${c.menh_de ? '**Mệnh đề:** ' + JSON.stringify(c.menh_de) + '\n' : ''}**Đáp án:** ${c.dap_an ?? '—'}\n**Lời giải:** ${(c.loi_giai ?? '').slice(0, 900)}\n`
      js.push({ ten: h.ten, cu: `cu/${h.ten}.png`, cau: h.cau.map((c) => ({ ma_cau: c.ma_cau, noi_dung: c.noi_dung, lua_chon: c.lua_chon, dap_an: c.dap_an })) })
    }
    fs.writeFileSync(path.join(dir, 'viec.md'), md); fs.writeFileSync(path.join(dir, 'viec.json'), JSON.stringify(js, null, 1))
    console.log(`✔ ${dir}  (${goi[k].length} hình)`)
  }
} finally { await br.close() }
