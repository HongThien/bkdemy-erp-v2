import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const lopId = '1c813018-8ce0-45c1-b3c4-e2fd6ce8cee3'
const { rows } = await c.query(`select id, loai, ngay::text, ten from tai_lieu where lop_id=$1 and ngay='2026-07-23'`, [lopId])
console.log("Docs 8A1 đang tồn tại ở 23/07 (kiểm tra trùng trước khi dời):", rows)
// Phan của doc BTVN 23/08 để xác nhận có btvn + ontap
const { rows: phans } = await c.query(`
  select p.loai_phan, p.ref_ma, count(tc.id) n_cau
  from tai_lieu_phan p left join tai_lieu_cau tc on tc.phan_id=p.id
  where p.tai_lieu_id='832fc508-e674-45ce-b671-60cf560dc82b'
  group by p.loai_phan, p.ref_ma, p.thu_tu order by p.thu_tu`)
console.log("\nPhan của doc BTVN (832fc508 = 'Buổi 7'):", phans)
await c.end()
