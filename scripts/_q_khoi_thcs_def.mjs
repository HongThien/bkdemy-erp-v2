// CHỈ ĐỌC (transaction read only). In pg_get_functiondef của 2 hàm ghi cứng danh sách THCS
// — nguồn để viết migration thêm khối '8T' (19/09).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
function envKey(ten) {
  const m = txt.match(new RegExp(`^\\s*${ten}\\s*=\\s*(.+?)\\s*$`, 'm'))
  return m ? m[1].replace(/^["']|["']$/g, '') : null
}
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect()
await c.query('begin read only')
const r = await c.query(`
  select p.proname, pg_get_function_identity_arguments(p.oid) args, pg_get_functiondef(p.oid) d,
         (select string_agg(a.rolname || ':' || x.privilege_type, ', ')
            from aclexplode(p.proacl) x join pg_roles a on a.oid = x.grantee) acl
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname in ('fn_giaibai_pool', 'hs_cap2_cua_toi')`)
for (const x of r.rows) console.log(`\n-- ===== ${x.proname}(${x.args})\n-- ACL: ${x.acl}\n${x.d}`)
await c.query('rollback'); await c.end()
