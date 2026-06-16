import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const b = (await c.query(`select b.id from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop='9B1' and b.loai='thuong' order by b.ngay desc limit 1`)).rows[0]
try {
  await c.query('begin')
  const g = await c.query(`delete from gami_grades where problem_id in (select id from gami_session_problems where buoi_hoc_id=$1 and phase='et')`, [b.id])
  const p = await c.query(`delete from gami_session_problems where buoi_hoc_id=$1 and phase='et'`, [b.id])
  await c.query('commit')
  console.log(`Đã xoá: grades ET ${g.rowCount} · problems ET ${p.rowCount}. Mở lại tab Chấm ET sẽ tự seed lại từ ET doc.`)
} catch(e){ await c.query('rollback'); console.error('❌', e.message); process.exitCode=1 } finally { await c.end() }
