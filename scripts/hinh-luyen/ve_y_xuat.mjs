// HÌNH LUYỆN · xuất việc VẼ HÌNH THEO Ý (docs/mau-brief-ve-lai-hinh.md §5) — chỉ đọc DB.
//   node scripts/hinh-luyen/ve_y_xuat.mjs --goi <tên gói> --ma HHC002401,HHC002574,…    (mã câu GỐC = hinh_bai.nguon_ma_cau)
//   node scripts/hinh-luyen/ve_y_xuat.mjs --goi <tên gói> --khoi 8 --tu 0 --so 6           (lấy theo thứ tự trong kho)
// Ghi scripts/hinh-luyen/ve/<gói>/viec.md (đề chung + từng ý + lời giải — để biết điểm nào dựng ở ý nào) và tải hình cũ
// (hình đề / hình lời giải của nguồn) về cùng thư mục làm THAM CHIẾU bố cục. Trạm vẽ ghi tệp vẽ vào scripts/hinh-luyen/ve/<gói>.mjs.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import pg from 'pg'

const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d }
const goi = arg('--goi'); if (!goi) { console.error('thiếu --goi'); process.exit(2) }
const txt = readFileSync(new URL('../../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const ma = arg('--ma')?.split(',').map((s) => s.trim()).filter(Boolean)
const bai = ma
  ? (await c.query(`select * from hinh_bai where nguon_ma_cau = any($1)`, [ma])).rows.sort((a, b) => ma.indexOf(a.nguon_ma_cau) - ma.indexOf(b.nguon_ma_cau))
  : (await c.query(`select * from hinh_bai where khoi = $1 order by created_at, ma_bai offset $2 limit $3`, [arg('--khoi', '8'), Number(arg('--tu', 0)), Number(arg('--so', 6))])).rows
const ys = (await c.query(`select * from hinh_y where bai_id = any($1) order by thu_tu`, [bai.map((b) => b.id)])).rows
await c.query('ROLLBACK'); await c.end()

const dir = new URL(`./ve/${goi}/`, import.meta.url)
mkdirSync(dir, { recursive: true })
const tai = async (url, ten) => {
  try { const r = await fetch(url); if (!r.ok) return null; writeFileSync(new URL(ten, dir), Buffer.from(await r.arrayBuffer())); return ten } catch { return null }
}
let md = `# Gói vẽ hình theo ý: ${goi}\n\nLuật: docs/mau-brief-ve-lai-hinh.md §4 (dấu bằng nhau) + §5 (hình theo ý). Tệp ra: \`<MA>.png\` — HLB… = hình bài, HLY… = hình ý (cộng dồn).\n\n`
for (const b of bai) {
  md += `---\n\n## ${b.ma_bai} · gốc ${b.nguon_ma_cau} · ${b.nguon ?? ''}\n\n`
  const thamChieu = []
  if (b.anh_de) { const t = await tai(b.anh_de, `${b.ma_bai}_cu_de.png`); if (t) thamChieu.push(`hình đề cũ: ${t}`) }
  const lg = [...new Set(ys.filter((y) => y.bai_id === b.id && y.anh_loi_giai).map((y) => y.anh_loi_giai))]
  for (const [i, u] of lg.entries()) { const t = await tai(u, `${b.ma_bai}_cu_lg${i + 1}.png`); if (t) thamChieu.push(`hình lời giải cũ: ${t}`) }
  md += `**Tham chiếu:** ${thamChieu.join(' · ') || 'không có hình cũ'}\n\n**GIẢ THIẾT CHUNG** → \`${b.ma_bai}.png\`:\n\n${b.gia_thiet_chung ?? '(bài một ý — đề nằm trong ý)'}\n\n`
  for (const y of ys.filter((y) => y.bai_id === b.id)) {
    md += `### ý ${y.nhan_hien_thi ?? '·'} · ${y.ma_y}${y.anh_de ? ' (ĐÃ có hình ý)' : ''}\n\n**Hỏi:** ${y.noi_dung}\n\n<details><summary>Lời giải</summary>\n\n${y.loi_giai ?? ''}\n\n</details>\n\n`
  }
}
writeFileSync(new URL('viec.md', dir), md)
console.log(`${bai.length} bài · ${ys.length} ý → scripts/hinh-luyen/ve/${goi}/viec.md`)
