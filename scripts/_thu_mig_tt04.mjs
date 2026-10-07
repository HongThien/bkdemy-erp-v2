// Chạy thử mig 202610071110 (thành tựu TT04 vào app liên tiếp) trong 1 transaction rồi ROLLBACK.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const ok = (cond, msg) => console.log((cond ? '  ✔ ' : '  ✖ ') + msg)
try {
  await c.query('begin'); await c.query("set local statement_timeout = '600s'")
  await c.query(fs.readFileSync('supabase/migrations/202610071110_thanh_tuu_tt04_vao_app.sql', 'utf8'))
  console.log('✔ migration chạy được')
  const tk = (await q(`select tk.id uid, tk.hoc_sinh_id hs from tai_khoan tk join hoc_sinh h on h.id = tk.hoc_sinh_id and h.trang_thai = 'dang_hoc'
                       join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc' join lop l on l.id = hl.lop_id and l.mon = 'Toán' limit 1`))[0]
  // 8 ngày liên tiếp (7 ngày trước hôm nay + hôm nay), rồi 1 ngày hổng, 2 ngày nữa ở xa
  await c.query(`insert into hs_mo_app (hoc_sinh_id, ngay) select $1, ((now() at time zone 'Asia/Ho_Chi_Minh')::date - g) from generate_series(0, 6) g`, [tk.hs])
  let dd = await q(`select ma, bac from public._tt_dat_duoc($1) where ma = 'TT04' order by bac`, [tk.hs])
  ok(dd.length === 1 && dd[0].bac === 1, `7 ngày liên tiếp ⇒ TT04 bậc 1 (7) — có ${JSON.stringify(dd)}`)
  await c.query(`delete from hs_mo_app where hoc_sinh_id = $1 and ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date - 3`, [tk.hs])
  dd = await q(`select ma, bac from public._tt_dat_duoc($1) where ma = 'TT04'`, [tk.hs])
  ok(dd.length === 0, 'thủng 1 ngày giữa chuỗi ⇒ chuỗi bị cắt (3 + 3 ngày), chưa bậc nào')
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.uid, role: 'authenticated' })])
  await q(`select public.fn_hs_mo_app()`); await q(`select public.fn_hs_mo_app()`)
  const n = (await q(`select count(*)::int n from hs_mo_app where hoc_sinh_id = $1 and ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date`, [tk.hs]))[0].n
  ok(n === 1, 'fn_hs_mo_app gọi 2 lần trong ngày vẫn 1 dòng (idempotent)')
  const mo = (await q(`select public.fn_thanh_tuu_cua_toi() j`))[0].j
  ok(mo.loai.find(x => x.ma === 'TT04').san_sang === true, 'TT04 đã bật san_sang trong fn_thanh_tuu_cua_toi')
  const anon = (await q(`select has_function_privilege('anon','public.fn_hs_mo_app()','execute') a`))[0]
  ok(!anon.a, 'anon không gọi được fn_hs_mo_app')
} catch (e) { console.log('✖ LỖI:', e.message, e.where || '') }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
