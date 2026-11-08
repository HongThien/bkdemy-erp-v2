// Xuất gói VIỆC "câu hình học trong đề thi/đề cương Toán 7 chưa có hình" cho các trạm vẽ (Thùy 19/10)
import pg from 'pg'
import fs from 'node:fs'
import { bien } from '../kho/cau-hinh.mjs'
const RA = 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/'
const SO_TRAM = Number(process.argv[2] || 9)
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
const { rows: tl } = await c.query(`select id, ten, cau_hinh->'deThi'->>'kieu' k from tai_lieu where loai='de_thi' and ten ~ 'Toán 7 ' order by created_at`)
const da = new Set(), ds = []
for (const t of tl) {
  const { rows } = await c.query(`select f.stt, q.ma_cau, q.loai_cau, q.noi_dung, q.lua_chon, q.dap_an, q.loi_giai, q.anh_de from fn_de_thi_cau($1) f join hinh_hoc_cau_hoi q on q.ma_cau=f.ma_cau where f.kho='hinh_hoc' order by f.stt`, [t.id])
  for (const r of rows) if (!r.anh_de && !da.has(r.ma_cau)) { da.add(r.ma_cau); ds.push({ ...r, de: t.ten.replace(/^Đề /, ''), kieu: t.k ?? 'de_thi' }) }
}
const moi = Math.ceil(ds.length / SO_TRAM)
const chia = []
for (let i = 0; i < ds.length; i += moi) chia.push(ds.slice(i, i + moi))
chia.forEach((g, i) => {
  const dir = `${RA}TH-${i + 1}/`
  fs.mkdirSync(dir, { recursive: true })
  let md = `# Gói TH-${i + 1} — câu hình học Toán 7 trong đề thi / đề cương CHƯA CÓ HÌNH (${g.length} câu)\n\nMỗi mục = MỘT câu cần xét có vẽ hình không. Tên tệp ra = mã câu (vd \`HHC002809.png\`). Không có ảnh cũ.\n\n---\n`
  for (const q of g) {
    let lc = ''
    if (q.lua_chon) lc = '\n\n**Phương án:**\n' + (Array.isArray(q.lua_chon) ? q.lua_chon.map((x, k) => `${'ABCD'[k]}. ${typeof x === 'string' ? x : JSON.stringify(x)}`).join('\n') : JSON.stringify(q.lua_chon))
    md += `\n## Tệp ra: \`${q.ma_cau}.png\`\n\n- Nguồn: ${q.de} (${q.kieu === 'de_cuong' ? 'đề cương' : 'đề thi'}) · câu STT ${q.stt} · loại ${q.loai_cau}\n\n**Đề:**\n\n${q.noi_dung}${lc}\n\n**Đáp án:** ${q.dap_an ?? '—'}\n\n**Lời giải:**\n\n${q.loi_giai ?? '(chưa có)'}\n\n---\n`
  }
  fs.writeFileSync(dir + 'viec.md', md)
  fs.mkdirSync(dir + 'moi', { recursive: true })
  console.log(`TH-${i + 1}: ${g.length} câu · ${[...new Set(g.map((q) => q.de.slice(0, 40)))].length} đề`)
})
fs.writeFileSync(RA + 'TH-chung.json', JSON.stringify(ds.map((q) => ({ ma: q.ma_cau, de: q.de, stt: q.stt })), null, 1))
console.log('tổng', ds.length)
await c.end()
