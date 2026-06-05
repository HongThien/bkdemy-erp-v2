// Áp tất cả file .sql trong supabase/migrations theo thứ tự tên. Mỗi file 1 transaction.
// Chạy: node scripts/migrate.mjs
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')

const dir = join(root, 'supabase', 'migrations')
const files = readdirSync(dir).filter(f => f.endsWith('.sql')).sort()

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  for (const f of files) {
    process.stdout.write(`Applying ${f} ... `)
    try {
      await c.query('begin')
      await c.query(readFileSync(join(dir, f), 'utf8'))
      await c.query('commit')
      console.log('OK')
    } catch (e) {
      await c.query('rollback')
      console.log('FAIL')
      throw e
    }
  }
  console.log('— Tất cả migration đã áp.')
} catch (e) {
  console.error('❌', e.message)
  process.exitCode = 1
} finally {
  await c.end()
}
