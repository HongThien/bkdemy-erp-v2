import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const r = await c.query(`
  select tablename, policyname, cmd, qual
  from pg_policies where schemaname='public'
  and (tablename like 'hoa_don%' or tablename like 'hoc_phi%' or tablename like 'luong%')
  order by tablename, policyname`)
console.log('\n▸ Policy sẽ phải XOÁ để siết được (nhóm TIỀN)')
console.table(r.rows.map(x => ({ bang: x.tablename, policy: x.policyname, lenh: x.cmd, dieu_kien: (x.qual||'').slice(0,45) })))
const n = await c.query(`
  select 'hoa_don' t, count(*) n from hoa_don
  union all select 'hoa_don_dong', count(*) from hoa_don_dong
  union all select 'hoc_phi_phat_sinh', count(*) from hoc_phi_phat_sinh
  union all select 'hoc_phi_xet_duyet', count(*) from hoc_phi_xet_duyet
  union all select 'hoc_phi_tin_dung', count(*) from hoc_phi_tin_dung
  union all select 'hoc_phi_cong_thuc', count(*) from hoc_phi_cong_thuc
  union all select 'luong_bac', count(*) from luong_bac`)
console.log('\n▸ Dữ liệu trong mấy bảng đó (KHÔNG đụng tới, chỉ đổi ai đọc được)')
console.table(n.rows)
await c.end()
