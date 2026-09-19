// CHỈ ĐỌC (transaction read only). Quét hàm/view/CHECK trên DB live đang ghi cứng danh sách khối
// — phục vụ thêm khối '8T' (THCS, vai trò như 4T/5T) 19/09.
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
console.log('role:', (await c.query('select current_user')).rows[0].current_user)

const fn = await c.query(`
  select p.oid, p.proname ten, pg_get_function_identity_arguments(p.oid) args, p.prosrc
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and (p.prosrc ~ '''[6789]''\\s*,' or p.prosrc ~ '''[45]T''')
   order by 2`)
for (const x of fn.rows) {
  const dong = x.prosrc.split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /'[6789]'\s*,|'[45]T'/.test(l))
  console.log(`\n[fn] ${x.ten}(${x.args})`)
  for (const [i, l] of dong) console.log(`   ${i}: ${l.trim()}`)
}
const vw = await c.query(`
  select c.relname ten, pg_get_viewdef(c.oid) d
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind in ('v','m')
     and (pg_get_viewdef(c.oid) ~ '''[6789]''' or pg_get_viewdef(c.oid) ~ '''[45]T''')`)
for (const x of vw.rows) {
  console.log(`\n[view] ${x.ten}`)
  for (const l of x.d.split('\n').filter((l) => /'[6789]'|'[45]T'/.test(l))) console.log('   ' + l.trim())
}
const ck = await c.query(`
  select conrelid::regclass::text t, conname, pg_get_constraintdef(oid) d
    from pg_constraint where contype = 'c' and pg_get_constraintdef(oid) ~ '''([45]T|[6789])'''`)
console.log('\n[CHECK]'); for (const x of ck.rows) console.log(`   ${x.t}.${x.conname}: ${x.d}`)
await c.query('rollback'); await c.end()
