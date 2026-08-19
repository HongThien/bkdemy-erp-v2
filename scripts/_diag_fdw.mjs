import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const r = await c.query(`select tablename, policyname, roles::text, cmd, qual
  from pg_policies where schemaname='public' and policyname like 'fdw%' order by tablename`)
console.log('\n▸ Mọi policy fdw_* — ÁP CHO ROLE NÀO'); console.table(r.rows)
const g = await c.query(`select rolname, rolcanlogin, rolbypassrls from pg_roles
  where rolname not like 'pg_%' and rolname not in ('postgres') order by rolname`)
console.log('\n▸ Các role trong DB'); console.table(g.rows)
await c.end()
