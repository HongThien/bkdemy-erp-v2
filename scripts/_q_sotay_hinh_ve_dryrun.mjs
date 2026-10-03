// Chạy THỬ mig 202610031309 (cột sotay_ct_hinh.ve) trong transaction rồi ROLLBACK; vẽ thử mọi mã bằng bộ vẽ đã chép.
import fs from 'node:fs'
import pg from 'pg'; process.loadEnvFile('.env')
globalThis.document = { addEventListener() {} }
const { veHinh } = await import('../src/lib/sotayHinh/hinhVe.js')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
await c.query('begin')
try {
  await c.query(fs.readFileSync('supabase/migrations/202610031309_sotay_hinh_ve_bang_ma.sql', 'utf8'))
  const rows = (await c.query(`select mon, ma, ve from sotay_ct_hinh where ve is not null`)).rows
  const hong = rows.filter((r) => !veHinh(r.ve).includes('<svg'))
  console.log('mã vẽ:', rows.length, '· vẽ được:', rows.length - hong.length, hong.map((r) => r.ma + ' ' + r.ve))
  const m = (await c.query(`select _sotay_muc_json('h7-khi-hiem') j`)).rows[0].j
  console.log('mục h7-khi-hiem trả hinh_ve =', m?.hinh_ve)
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end() }
