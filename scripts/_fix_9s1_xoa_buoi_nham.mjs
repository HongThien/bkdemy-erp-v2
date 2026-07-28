// Xóa cứng 2 buổi 9S1 mở nhầm ngày (09/07/2026 T5, 21/07/2026 T3) — không khớp TKB hiện hành (T2/4/6).
// Đã xác nhận: diem_danh null hết, gami_session_problems.hoc_sinh_id null hết (chưa ai làm),
// 0 dòng gami_exp_ledger/gami_elo_history/buoi_danh_gia liên quan. Xóa theo thứ tự FK lá -> gốc.
// Được CEO duyệt hard-delete qua AskUserQuestion ngày 2026-07-10.
import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const ids = ['68d64312-45e9-4ecd-b0be-12fb8cd9b267', '83de0794-4aba-4aa8-9fb7-b84f8b268d02']

try {
  await c.query('BEGIN')
  const gsp = await c.query(`delete from gami_session_problems where buoi_hoc_id = any($1::uuid[])`, [ids])
  console.log('deleted gami_session_problems:', gsp.rowCount)
  const bhh = await c.query(`delete from buoi_hoc_hs where buoi_hoc_id = any($1::uuid[])`, [ids])
  console.log('deleted buoi_hoc_hs:', bhh.rowCount)
  const bh = await c.query(`delete from buoi_hoc where id = any($1::uuid[]) returning ma_buoi, ngay`, [ids])
  console.log('deleted buoi_hoc:', bh.rowCount, bh.rows)
  await c.query('COMMIT')
  console.log('COMMITTED')
} catch (e) {
  await c.query('ROLLBACK')
  console.error('ROLLED BACK due to error:', e.message)
  throw e
}
await c.end()
