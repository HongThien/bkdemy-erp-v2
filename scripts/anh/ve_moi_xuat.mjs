// ve_moi_xuat.mjs — xuất "gói việc VẼ HÌNH MỚI" cho kho Hình–Học (hinh_hoc_*) còn THIẾU hình đề (Thùy 16/11: "vẽ hình cho các bài trong kho 7").
//   node scripts/anh/ve_moi_xuat.mjs --khoi 7 [--chi-duyet] [--bai HH00099,HH00112] [--moi-goi 6] [--ra <thu_muc>]
// CHỈ ĐỌC DB. Đơn vị cần hình = MỘT BÀI NHIỀU Ý (hinh_hoc_bai_y, mã HHB…; hình gắn vào BÀI) hoặc MỘT CÂU ĐƠN (HHC…). Chỉ câu sống, không rút khỏi kho, không Đúng/Sai.
//   <ra>/<goi>/viec.md   đề + ý + đáp án + lời giải của từng đơn vị, kèm TÊN TỆP ra
//   <ra>/<goi>/viec.json cùng nội dung cho máy
// Tên tệp ra (gan_hinh.mjs):  bài nhiều ý  → HHB000123.png  (gắn bằng --bang baiy)   ·   câu đơn → HHC000123.png (gắn mặc định, cả đề lẫn lời giải)
// --chi-duyet: chỉ đơn vị có ít nhất một câu đã duyệt (kho chính thức); không có cờ = cả hàng chờ duyệt.
import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

const argv = process.argv.slice(2)
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
const KHOI = opt('--khoi'), BAI = opt('--bai')?.split(','), MOI_GOI = +opt('--moi-goi', 6), CHI_DUYET = argv.includes('--chi-duyet')
const RA = opt('--ra', 'C:/Users/WBPC/bk-kho-lam-viec/ve-moi-hinh')
if (!KHOI) { console.error('Dùng: node scripts/anh/ve_moi_xuat.mjs --khoi 7 [--chi-duyet] [--bai HH00099,…] [--moi-goi 6] [--ra <thu_muc>]'); process.exit(2) }
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const db = new pg.Client({ connectionString: env.DATABASE_URL_RO ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await db.connect(); await db.query('begin read only')
const q = async (s, p) => (await db.query(s, p)).rows

const cau = await q(`
  select h.ma_cau, h.dang_chinh, b.ten_bai, h.bai_y, h.nhan_y, h.cau_hoi_y, h.da_biet, h.noi_dung, h.dap_an, h.loi_giai, h.loai_cau, h.da_duyet,
         y.loi_dan, y.anh_de anh_bai_y, h.anh_de anh_cau
    from hinh_hoc_cau_hoi h join hinh_hoc_bai b on b.ma_bai = h.dang_chinh left join hinh_hoc_bai_y y on y.ma_bai_y = h.bai_y
   where b.khoi = $1 and h.xoa_at is null and not h.rut_khoi_kho and h.loai_cau <> 'dung_sai'
     and ($2::text[] is null or h.dang_chinh = any($2))
   order by h.dang_chinh, coalesce(h.bai_y, h.ma_cau), h.nhan_y nulls first, h.ma_cau`, [KHOI, BAI ?? null])
// Bản chép thẳng hàng (16/11, hinh-k7-day-thang-hang): bài_y mới cùng lời dẫn với bài_y gốc ⇒ vẽ MỘT hình, gắn cả hai (tên tệp HHBgoc+HHBmoi.png)
const bb = JSON.parse(fs.readFileSync('kho-rules/hinh/k7-thang-hang/bien-ban-truoc.json', 'utf8')).filter((x) => x.bai_y)
const hienNay = new Map((await q(`select ma_cau, bai_y from hinh_hoc_cau_hoi where ma_cau = any($1)`, [bb.map((x) => x.ma_cau)])).map((r) => [r.ma_cau, r.bai_y]))
const alias = new Map(), ban_chep = new Set()
for (const x of bb) { const moi = hienNay.get(x.ma_cau); if (moi && moi !== x.bai_y) { ban_chep.add(moi); alias.set(x.bai_y, [...new Set([...(alias.get(x.bai_y) ?? []), moi])]) } }
const dv = new Map()
for (const r of cau) {
  if (r.bai_y && ban_chep.has(r.bai_y)) continue
  const k = r.bai_y ?? r.ma_cau
  if (!dv.has(k)) dv.set(k, { dv: k, la_y: !!r.bai_y, bai: r.dang_chinh, ten_bai: r.ten_bai, co_hinh: !!(r.bai_y ? r.anh_bai_y : r.anh_cau), duyet: false, alias: alias.get(r.bai_y) ?? [], de: r.bai_y ? r.loi_dan : r.noi_dung, y: [], dap_an: r.bai_y ? null : r.dap_an, loi_giai: r.bai_y ? null : r.loi_giai, loai: r.loai_cau })
  const d = dv.get(k)
  d.duyet ||= r.da_duyet
  if (r.bai_y) d.y.push({ ma_cau: r.ma_cau, nhan: r.nhan_y, hoi: r.cau_hoi_y, da_biet: r.da_biet, dap_an: r.dap_an, loi_giai: r.loi_giai })
}
let ds = [...dv.values()].filter((d) => !d.co_hinh && (!CHI_DUYET || d.duyet))
ds.sort((a, b) => (b.duyet - a.duyet) || a.bai.localeCompare(b.bai) || a.dv.localeCompare(b.dv))
console.log(`Thiếu hình: ${ds.length} đơn vị (${ds.filter((d) => d.duyet).length} đã duyệt, ${ds.filter((d) => !d.duyet).length} hàng chờ) · ${ds.filter((d) => d.la_y).length} bài nhiều ý + ${ds.filter((d) => !d.la_y).length} câu đơn`)

fs.mkdirSync(RA, { recursive: true })
const cat = (s, n) => { const t = (s ?? '').trim(); return t.length > n ? t.slice(0, n) + ' …' : t }
let n = 0
for (let i = 0; i < ds.length; i += MOI_GOI) {
  const goi = ds.slice(i, i + MOI_GOI); n++
  const ten = `G${String(n).padStart(2, '0')}-${goi[0].bai}`
  const dir = path.join(RA, ten); fs.mkdirSync(dir, { recursive: true })
  let md = `# Gói ${ten} — ${goi.length} hình cần VẼ MỚI (kho Hình–Học khối ${KHOI})\n\nMỗi mục: một hình đề. Tên tệp ra bên dưới là tên bắt buộc.\n`
  for (const d of goi) {
    md += `\n---\n\n## ${[d.dv, ...d.alias].join('+')}.png — bài ${d.bai} "${d.ten_bai}" · ${d.la_y ? 'BÀI NHIỀU Ý' : 'CÂU ĐƠN'} · ${d.duyet ? 'đã duyệt' : 'hàng chờ'}\n\n**ĐỀ${d.la_y ? ' (lời dẫn chung — hình gắn vào BÀI, vẽ ĐỦ giả thiết của mọi ý)' : ''}:**\n${d.de}\n`
    if (d.la_y) for (const y of d.y) md += `\n**Ý ${y.nhan})** ${y.hoi}${y.da_biet ? `\n  (đã biết: ${cat(y.da_biet, 300)})` : ''}\n  Lời giải: ${cat(y.loi_giai, 900)}\n`
    else md += `\n**Đáp án:** ${cat(d.dap_an, 200) || '(không)'}\n**Lời giải:**\n${cat(d.loi_giai, 1600)}\n`
  }
  fs.writeFileSync(path.join(dir, 'viec.md'), md)
  fs.writeFileSync(path.join(dir, 'viec.json'), JSON.stringify(goi.map((d) => ({ dv: d.dv, ten_tep: [d.dv, ...d.alias].join('+'), la_y: d.la_y, bai: d.bai, duyet: d.duyet, de: d.de, y: d.y, dap_an: d.dap_an, loi_giai: d.loi_giai })), null, 1))
  console.log(`  ${ten}: ${goi.map((d) => d.dv).join(' ')}`)
}
await db.query('rollback'); await db.end()
console.log(`→ ${n} gói trong ${RA}`)
