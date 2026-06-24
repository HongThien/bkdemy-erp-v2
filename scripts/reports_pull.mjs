// Luồng fix tự động (Pha 2) — KÉO report đã duyệt 'cho_fix' để agent đọc & fix.
// Chạy: node scripts/reports_pull.mjs   (đọc DATABASE_URL trong .env)
// In ra dạng dễ đọc: id · ngày · màn · mô tả · người · url · lỗi console gần đây.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8')
  .match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
if (!url) { console.error('Thiếu DATABASE_URL trong .env'); process.exit(1) }

const c = new pg.Client({ connectionString: url })
await c.connect()
try {
  const { rows } = await c.query(
    `select id, created_at, route, mo_ta, context from bao_loi where trang_thai = 'cho_fix' order by created_at asc`)
  if (!rows.length) { console.log('(không có report nào ở trạng thái cho_fix)'); process.exit(0) }
  console.log(`# ${rows.length} report ĐÃ DUYỆT cho-fix\n`)
  for (const r of rows) {
    const ctx = r.context ?? {}
    console.log(`## ${r.id}`)
    console.log(`- ngày: ${r.created_at?.toISOString?.() ?? r.created_at}`)
    console.log(`- màn (leaf): ${r.route ?? '—'}`)
    console.log(`- người báo: ${ctx.nguoi ?? ctx.email ?? '?'}`)
    if (ctx.url) console.log(`- url: ${ctx.url}`)
    console.log(`- MÔ TẢ: ${r.mo_ta}`)
    if (Array.isArray(ctx.loi_gan_day) && ctx.loi_gan_day.length)
      console.log(`- lỗi console gần đây:\n${ctx.loi_gan_day.map((m) => `    • ${m}`).join('\n')}`)
    console.log('')
  }
} finally { await c.end() }
