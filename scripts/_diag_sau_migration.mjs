import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,15))}
await p('FDW web — còn quyền trên bảng nào (kỳ vọng ĐÚNG 4)', `
  select table_name, string_agg(distinct privilege_type,',') q
  from information_schema.role_table_grants
  where grantee='fdw_bkdemy_web' and table_schema='public' group by 1 order by 1`)
await p('FDW — còn policy nào', `
  select tablename, policyname from pg_policies
  where schemaname='public' and policyname like 'fdw%' order by 1`)
await p('Nhóm tiền — policy hiện tại', `
  select tablename, policyname, cmd, left(qual,45) as dieu_kien
  from pg_policies where schemaname='public'
  and tablename in ('hoa_don','hoa_don_dong','hoa_don_log','hoc_phi_cong_thuc',
                    'hoc_phi_phat_sinh','hoc_phi_tin_dung','hoc_phi_xet_duyet','luong_bac')
  order by 1,2`)
await p('Còn sót cổng nhị phân trên nhóm tiền không (kỳ vọng 0)', `
  select count(*)::int as con_sot from pg_policies where schemaname='public'
  and tablename in ('hoa_don','hoa_don_dong','hoa_don_log','hoc_phi_cong_thuc',
                    'hoc_phi_phat_sinh','hoc_phi_tin_dung','hoc_phi_xet_duyet','luong_bac')
  and qual ilike '%la_thanh_vien%'`)
await c.end()
