import { readFileSync } from 'node:fs'
import pg from 'pg'
const lines = readFileSync('.env', 'utf8').split(/\r?\n/)
const envKey = (t) => { const l = lines.find((x) => x.trim().startsWith(t + '=')); return l ? l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : null }
const c = new pg.Client({ connectionString: envKey('DATABASE_URL_RO') || envKey('DATABASE_URL') })
await c.connect()
const r = await c.query(`select tgname, pg_get_functiondef(tgfoid) d, pg_get_triggerdef(oid) td from pg_trigger where tgrelid='dai_ban_do'::regclass and not tgisinternal`)
for (const x of r.rows) console.log('-- ' + x.td + '\n' + x.d)
const cols = await c.query(`select table_name, string_agg(column_name, ', ' order by ordinal_position) from information_schema.columns where table_schema='public' and table_name in ('tai_lieu_cau','bai_test_cau','ca_test_cau') group by 1`)
console.table(cols.rows)
await c.end()
