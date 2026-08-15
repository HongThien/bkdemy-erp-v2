import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const r = await c.query(`
  select tablename, rowsecurity from pg_tables
  where schemaname='public' and tablename in (
   'hoa_don','hoa_don_dong','hoa_don_log','hoc_phi_cong_thuc','hoc_phi_phat_sinh',
   'hoc_phi_tin_dung','hoc_phi_xet_duyet','luong_bac','muc_hoc_phi')
  order by tablename`)
console.log('\n▸ RLS đã bật chưa (nhóm tiền) — chưa bật thì xoá policy KHÔNG chặn được gì')
console.table(r.rows)
const g = await c.query(`
  select table_name, string_agg(distinct privilege_type, ',') as quyen
  from information_schema.role_table_grants
  where grantee='fdw_bkdemy_web' and table_schema='public' group by 1 order by 1`)
console.log('\n▸ GRANT cấp thẳng cho role fdw_bkdemy_web (' + g.rows.length + ' bảng)')
console.table(g.rows.slice(0, 30))
await c.end()
