// Verify role claude_v2: KHÔNG ghi được public (v1) · CÓ ghi được v2.
// Chạy: node scripts/writetest.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')

const c = new pg.Client({ connectionString: url })
await c.connect()

// 1) public (v1) phải BỊ CHẶN
try {
  await c.query('CREATE TABLE public.__claude_wtest__ (id int)')
  await c.query('DROP TABLE IF EXISTS public.__claude_wtest__')
  console.log('❌ NGUY HIỂM: ghi được public — v1 KHÔNG an toàn!')
} catch (e) {
  console.log(`✅ public (v1) read-only: ghi bị chặn → [${e.code}]`)
}

// 2) v2 phải GHI ĐƯỢC
try {
  await c.query('CREATE TABLE IF NOT EXISTS v2.__claude_wtest__ (id int)')
  await c.query('DROP TABLE v2.__claude_wtest__')
  console.log('✅ v2 ghi được: sẵn sàng build')
} catch (e) {
  console.log(`❌ v2 chưa ghi được → [${e.code}] ${e.message}  (kiểm tra GRANT USAGE, CREATE ON SCHEMA v2)`)
}

await c.end()
