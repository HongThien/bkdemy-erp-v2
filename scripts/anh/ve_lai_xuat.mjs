// ve_lai_xuat.mjs — LUỒNG VẼ LẠI HÌNH (Thùy 13/10): xuất "gói việc" cho các câu Hình học còn dùng ảnh cắt từ sách/tài liệu.
//
//   node scripts/anh/ve_lai_xuat.mjs --khoi 7 [--bai HH00023,HH00024] [--moi-goi 8] [--ra <thu_muc>]
//
// CHỈ ĐỌC DB. Với mỗi bài (hinh_hoc_bai) có câu mang ảnh CŨ (URL không nằm trong kho-anh/hinh_hoc/ = chưa vẽ bằng code):
//   <ra>/<ma_bai>-<n>/viec.md      đề + đáp án + lời giải của từng hình phải vẽ, kèm tên tệp ra
//   <ra>/<ma_bai>-<n>/viec.json    cùng nội dung, cho máy
//   <ra>/<ma_bai>-<n>/cu/<ten>.png ảnh cũ (để đối chiếu nhãn, số đo, ký hiệu)
// Tên tệp ra = quy ước của gan_hinh.mjs:  <ma>[+<ma>…]        hình đề, gắn cả đề lẫn lời giải
//                                          <ma>[+<ma>…]_de     chỉ hình đề (câu có hình lời giải riêng)
//                                          <ma>[+<ma>…]_lg     chỉ hình lời giải
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import puppeteer from 'puppeteer-core'

const argv = process.argv.slice(2)
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
const KHOI = opt('--khoi'), BAI = opt('--bai')?.split(','), MOI_GOI = +opt('--moi-goi', 8)
const RA = opt('--ra', 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh')
if (!KHOI && !BAI) { console.error('Dùng: node scripts/anh/ve_lai_xuat.mjs --khoi 7 | --bai HH00023,HH00024  [--moi-goi 8] [--ra <thu_muc>]'); process.exit(2) }

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect(); await db.query('begin read only')

const CU = (c) => `(${c} is not null and ${c} not like '%/kho-anh/hinh_hoc/%')`
const { rows } = await db.query(
  `select c.ma_cau, c.dang_chinh, b.ten_bai, b.khoi, c.thu_tu, c.loai_cau, c.noi_dung, c.dap_an, c.loi_giai, c.lua_chon, c.menh_de, c.anh_de, c.anh_dap_an, c.da_duyet
     from hinh_hoc_cau_hoi c join hinh_hoc_bai b on b.ma_bai = c.dang_chinh
    where c.xoa_at is null and (${CU('c.anh_de')} or ${CU('c.anh_dap_an')})
      and ($1::text is null or b.khoi = $1) and ($2::text[] is null or c.dang_chinh = any($2))
    order by c.dang_chinh, c.thu_tu, c.ma_cau`, [KHOI ?? null, BAI ?? null])
await db.end()

const laCu = (u) => u && !u.includes('/kho-anh/hinh_hoc/')
// gom theo (bài, URL, kiểu gắn): một ảnh dùng chung cho nhiều câu ⇒ một hình vẽ lại
const theoBai = new Map()
for (const r of rows) {
  const them = (url, kieu) => {
    if (!theoBai.has(r.dang_chinh)) theoBai.set(r.dang_chinh, { ten_bai: r.ten_bai, khoi: r.khoi, hinh: new Map() })
    const h = theoBai.get(r.dang_chinh).hinh, k = url + '|' + kieu
    if (!h.has(k)) h.set(k, { url, kieu, cau: [] })
    h.get(k).cau.push(r)
  }
  const lgRieng = r.anh_dap_an && r.anh_dap_an !== r.anh_de
  if (laCu(r.anh_de)) them(r.anh_de, lgRieng ? 'de' : 'chung')
  if (lgRieng && laCu(r.anh_dap_an)) them(r.anh_dap_an, 'lg')
}

let trinhDuyet = null
async function svgSangPng(tep) {
  trinhDuyet ??= await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
  const p = await trinhDuyet.newPage(); await p.setViewport({ width: 900, height: 700, deviceScaleFactor: 2 })
  await p.setContent(`<body style="margin:0;background:#fff"><img id="i" src="data:image/svg+xml;base64,${fs.readFileSync(tep).toString('base64')}" style="max-width:800px;min-width:300px"></body>`)
  const png = tep.replace(/.svg$/, '.png')
  await (await p.$('#i')).screenshot({ path: png }); await p.close()
  return png
}

const DUOI = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg', 'image/webp': 'webp', 'image/gif': 'gif' }
let tongHinh = 0, tongGoi = 0
for (const [bai, { ten_bai, khoi, hinh }] of theoBai) {
  const ds = [...hinh.values()]
  for (let i = 0, n = 1; i < ds.length; i += MOI_GOI, n++) {
    const goi = `${bai}-${n}`, dir = path.join(RA, goi)
    fs.mkdirSync(path.join(dir, 'cu'), { recursive: true })
    const viec = []
    let md = `# Gói ${goi} — ${ten_bai} (Hình học ${khoi})\n\nMỗi mục = MỘT hình phải vẽ lại. Tên tệp ra phải đúng y như ghi.\n`
    for (const h of ds.slice(i, i + MOI_GOI)) {
      const ten = h.cau.map((c) => c.ma_cau).join('+') + (h.kieu === 'de' ? '_de' : h.kieu === 'lg' ? '_lg' : '')
      const res = await fetch(h.url)
      const duoi = DUOI[(res.headers.get('content-type') || '').split(';')[0]] || 'png'
      let cu = path.join(dir, 'cu', `${ten}.${duoi}`)
      fs.writeFileSync(cu, Buffer.from(await res.arrayBuffer()))
      if (duoi === 'svg') cu = await svgSangPng(cu) // ảnh cũ dạng SVG ⇒ dựng thêm PNG để người/agent mở xem được
      viec.push({ ten, kieu: h.kieu, url_cu: h.url, anh_cu: cu, cau: h.cau.map(({ anh_de, anh_dap_an, ...c }) => c) })
      md += `\n---\n\n## Tệp ra: \`${ten}.png\`\n\n- Kiểu: ${{ chung: 'hình ĐỀ (hiện ở cả đề và lời giải)', de: 'hình ĐỀ (câu này có hình lời giải riêng)', lg: 'hình LỜI GIẢI (có thể có đường phụ, điểm phụ của lời giải)' }[h.kieu]}\n- Ảnh cũ: \`${cu.replace(/\\/g, '/')}\`\n`
      for (const c of h.cau) {
        md += `\n### ${c.ma_cau} · ${c.loai_cau}${c.da_duyet ? ' · đã duyệt' : ''}\n\n**Đề:**\n\n${c.noi_dung}\n`
        if (c.lua_chon) md += `\n**Lựa chọn:** ${JSON.stringify(c.lua_chon)}\n`
        if (c.menh_de) md += `\n**Mệnh đề:** ${JSON.stringify(c.menh_de)}\n`
        if (c.dap_an) md += `\n**Đáp án:** ${c.dap_an}\n`
        if (c.loi_giai) md += `\n**Lời giải:**\n\n${c.loi_giai}\n`
      }
    }
    fs.writeFileSync(path.join(dir, 'viec.json'), JSON.stringify({ goi, bai, ten_bai, khoi, hinh: viec }, null, 1))
    fs.writeFileSync(path.join(dir, 'viec.md'), md)
    console.log(`${goi.padEnd(16)} ${String(viec.length).padStart(2)} hình · ${ten_bai}`)
    tongHinh += viec.length; tongGoi++
  }
}
await trinhDuyet?.close()
console.log(`\n${tongGoi} gói ·${tongHinh} hình · ${rows.length} câu → ${RA}`)
