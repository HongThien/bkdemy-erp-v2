import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('.env').DATABASE_URL }); await c.connect()
const r = await c.query(`
  select bl.id bl_id, blc.dap_an_hs, blc.verdict, blc.diem, bc.dap_an_key, hs.ma_hs
  from bai_lam bl
  join hoc_sinh hs on hs.id=bl.hoc_sinh_id
  join bai_lam_cau blc on blc.bai_lam_id=bl.id
  join bai_test_cau bc on bc.id=blc.bai_test_cau_id
  where bl.bai_test_id='7ca30d8b-6375-4304-826a-c585703b4885' and hs.ma_hs in ('HS0037','HS0040')
  order by hs.ma_hs, bc.thu_tu
`)
console.log(JSON.stringify(r.rows, null, 2))

if (process.argv.includes('--xoa')) {
  await c.query(`delete from bai_lam where bai_test_id='7ca30d8b-6375-4304-826a-c585703b4885' and hoc_sinh_id in (select id from hoc_sinh where ma_hs in ('HS0037','HS0040'))`)
  console.log('đã xoá bai_lam test HS0037/HS0040')
}
await c.end()
