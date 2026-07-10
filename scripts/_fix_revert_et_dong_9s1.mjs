// Test gán MT (đã dọn ở _fix_cleanup_test_mt_9s1.mjs) đã set et_dong_at (thật, trước đó là NULL) cho
// buổi 9S1.T6.19062026 qua guard is(et_dong_at,null) trong ganMTVaoBuoi — trả lại NULL vì đây là
// side-effect của test, KHÔNG phải hành động vận hành thật. CEO đã duyệt qua AskUserQuestion 2026-07-10.
import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const r = await c.query(`update buoi_hoc set et_dong_at = null where id = '72e06adc-c107-40d5-a3c8-94dffac257ef' and et_dong_at = '2026-07-10T04:59:20.200Z' returning id, ma_buoi, et_dong_at, trang_thai`)
console.log('reverted:', r.rowCount, r.rows)
await c.end()
