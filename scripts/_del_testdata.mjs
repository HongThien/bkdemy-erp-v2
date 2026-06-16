// Xoá DỮ LIỆU TEST (buổi + con) của 1 số lớp. KHÔNG đụng lớp/HS/ghi danh/TKB. claude_build, 1 transaction.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const TEN = ['6A1', '6A2', '6A3', '9S1']
const c = new pg.Client({ connectionString: url })
await c.connect()
const sub = `(select b.id from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop = any($1))`
try {
  await c.query('begin')
  const del = async (label, sql) => { const r = await c.query(sql, [TEN]); console.log(`  ${label}: ${r.rowCount}`) }
  await del('gami_grades', `delete from gami_grades where buoi_hoc_id in ${sub}`)
  await del('gami_session_problems', `delete from gami_session_problems where buoi_hoc_id in ${sub}`)
  await del('gami_elo_history', `delete from gami_elo_history where buoi_hoc_id in ${sub}`)
  await del('gami_exp_ledger', `delete from gami_exp_ledger where ref_buoi_hoc_id in ${sub}`)
  await del('buoi_danh_gia_dang', `delete from buoi_danh_gia_dang where buoi_hoc_id in ${sub}`)
  await del('buoi_danh_gia', `delete from buoi_danh_gia where buoi_hoc_id in ${sub}`)
  await del('buoi_hoc_hs', `delete from buoi_hoc_hs where buoi_hoc_id in ${sub}`)
  await del('buoi_hoc', `delete from buoi_hoc where id in ${sub}`)
  await c.query('commit')
  console.log('— Đã xoá dữ liệu test 4 lớp.')
} catch (e) { await c.query('rollback'); console.error('❌ rollback:', e.message); process.exitCode = 1 }
finally { await c.end() }
