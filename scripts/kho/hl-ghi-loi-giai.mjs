// Ghi LỜI GIẢI (đã soát) vào cách giải mặc định của bài Hình–Luyện (hinh_cach_giai.loi_giai).
//   node scripts/kho/hl-ghi-loi-giai.mjs <file.json> [<file2.json> …] [--ghi]     (mặc định chạy thử rồi ROLLBACK)
// file = [{ ma: 'BT.08.072.01', loi_giai: '…' }]. Kiểm: không có dòng trống (\n\n), không rỗng; CHỈ ghi khi lời giải đang trống
// (không đè lời giải người đã viết); bump updated_at của bài (CLAUDE.md §2: đổi nội dung con phải bump cha). 1 transaction.
import { createRequire } from 'node:module'
import fs from 'node:fs'
const pg = createRequire(process.cwd() + '/')('pg')
const GHI = process.argv.includes('--ghi')
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const ds = files.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf8')))
const loi = ds.filter((x) => !x.loi_giai?.trim() || /\n\s*\n/.test(x.loi_giai))
if (loi.length) { console.error('Từ chối — lời giải rỗng hoặc có dòng trống:', loi.map((x) => x.ma).join(' ')); process.exit(2) }
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
await c.query('begin')
try {
  let n = 0, boQua = []
  for (const x of ds) {
    const r = await c.query(`
      update hinh_cach_giai g set loi_giai = $2, updated_at = now()
        from hinh_baitoan b
       where b.ma = $1 and g.baitoan_id = b.id and coalesce(btrim(g.loi_giai), '') = ''
         and g.id = (select g2.id from hinh_cach_giai g2 where g2.baitoan_id = b.id order by g2.la_mac_dinh desc, g2.thu_tu limit 1)
      returning b.id`, [x.ma, x.loi_giai.trim()])
    if (r.rowCount === 1) { await c.query(`update hinh_baitoan set updated_at = now() where id = $1`, [r.rows[0].id]); n++ } else boQua.push(x.ma)
  }
  console.log(`ghi ${n}/${ds.length}${boQua.length ? ' · bỏ qua (không có cách giải / đã có lời giải): ' + boQua.join(' ') : ''}`)
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK (chạy thử)')
} catch (e) { await c.query('rollback'); console.error('LỖI → rollback:', e.message); process.exitCode = 1 }
await c.end()
