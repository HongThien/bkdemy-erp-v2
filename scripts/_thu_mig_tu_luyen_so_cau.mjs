// Thử mig 202611102121_tu_luyen_so_cau_tinh_san trong transaction rồi ROLLBACK: so kết quả tu_luyen_chu_de_ds_dang cũ/mới từng em.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const khois = (process.argv[2] ?? '9,7,12').split(',')
try {
  await c.query('begin'); await c.query("set local statement_timeout='5min'")
  const tks = []
  for (const k of khois) tks.push(...await q(`select distinct on (l.khoi) t.id, l.khoi, l.ten_lop from tai_khoan t join hoc_sinh_lop hl on hl.hoc_sinh_id=t.hoc_sinh_id and hl.trang_thai='dang_hoc'
     join lop l on l.id=hl.lop_id and l.mon='Toán' and l.trang_thai='dang_hoc' and l.khoi=$1 order by l.khoi, t.id`, [k]))
  const goi = async (tk) => { await c.query(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); const t = Date.now(); const j = (await q(`select tu_luyen_chu_de_ds_dang('Toán') j`))[0].j; return [j, Date.now() - t] }
  const cu = {}
  for (const tk of tks) { const [j, ms] = await goi(tk); cu[tk.id] = j; console.log(`CŨ  K${tk.khoi} ${tk.ten_lop}: ${ms} ms · ${j.length} dạng`) }
  await c.query(fs.readFileSync('supabase/migrations/202611102121_tu_luyen_so_cau_tinh_san.sql', 'utf8'))
  console.log('mig chạy được trong txn')
  for (const tk of tks) {
    for (const lan of ['lần đầu (tính bảng)', 'lần sau (đọc bảng)']) {
      const [j, ms] = await goi(tk)
      console.log(`MỚI K${tk.khoi} ${tk.ten_lop} ${lan}: ${ms} ms · ${j.length} dạng · khớp cũ: ${JSON.stringify(j) === JSON.stringify(cu[tk.id])}`)
    }
  }
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK') }
