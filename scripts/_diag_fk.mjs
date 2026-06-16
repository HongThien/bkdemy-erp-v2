import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const r = await c.query(`select tc.constraint_name, rc.delete_rule, kcu.column_name, ccu.table_name ref
 from information_schema.table_constraints tc
 join information_schema.referential_constraints rc on rc.constraint_name=tc.constraint_name
 join information_schema.key_column_usage kcu on kcu.constraint_name=tc.constraint_name
 join information_schema.constraint_column_usage ccu on ccu.constraint_name=tc.constraint_name
 where tc.constraint_type='FOREIGN KEY' and ccu.table_name='dai_ban_do'`)
for (const x of r.rows) console.log(`${x.column_name} → dai_ban_do : ON DELETE ${x.delete_rule}`)
await c.end()
