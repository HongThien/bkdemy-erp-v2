import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
for (const t of ['gami_elo','gami_exp_ledger']) { const r = await c.query(`select conname, pg_get_constraintdef(oid) def from pg_constraint where conrelid=$1::regclass`,[t]); console.log('==',t); r.rows.forEach(x=>console.log(' ',x.conname,x.def)) }
const cnt = await c.query(`select (select count(*) from gami_elo) e, (select count(*) from gami_exp_ledger) x, (select count(*) from gami_elo_history) h`)
console.log('rows:', cnt.rows[0])
await c.end()
