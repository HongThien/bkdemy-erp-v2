// Áp 1 file migration cụ thể (KHÔNG chạy lại toàn bộ). Dùng: node scripts/_apply_one.mjs 0037_gami_grade_loi.sql
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const file = process.argv[2]
if (!file) { console.error('Cần tên file migration.'); process.exit(1) }

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  await c.query('begin')
  await c.query(readFileSync(join(root, 'supabase', 'migrations', file), 'utf8'))
  await c.query('commit')
  console.log('OK', file)
} catch (e) { await c.query('rollback'); console.error('❌', e.message); process.exitCode = 1 }
finally { await c.end() }
