import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const r = await c.query(`select kcu.table_name src, kcu.column_name col, rc.delete_rule
 from information_schema.referential_constraints rc
 join information_schema.key_column_usage kcu on kcu.constraint_name=rc.constraint_name
 join information_schema.constraint_column_usage ccu on ccu.constraint_name=rc.constraint_name
 where ccu.table_name='dai_cau_hoi' and ccu.column_name='ma_cau'`)
console.log('Bảng tham chiếu dai_cau_hoi.ma_cau:')
for (const x of r.rows) console.log(`  ${x.src}.${x.col} : ON DELETE ${x.delete_rule}`)
await c.end()
