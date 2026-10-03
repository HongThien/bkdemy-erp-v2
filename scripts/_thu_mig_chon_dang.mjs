// Thử mig chon_dang_tu_luyen_o_db trong ROLLBACK: server chọn dạng, sinh được lượt Tự luyện + Thử thách, phân bố 60/40.
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
try {
  await c.query('begin')
  const file = fs.readdirSync('supabase/migrations').filter((f) => f.endsWith('_chon_dang_tu_luyen_o_db.sql')).sort().pop()
  await c.query(fs.readFileSync('supabase/migrations/' + file, 'utf8'))
  console.log('✔ migration chạy được')
  const ems = await q(`select distinct on (l.mon) hl.hoc_sinh_id id, tk.id tk, l.mon from hoc_sinh_lop hl join lop l on l.id=hl.lop_id join tai_khoan tk on tk.hoc_sinh_id=hl.hoc_sinh_id
    where hl.trang_thai='dang_hoc' and l.mon in ('Toán','KHTN') and exists (select 1 from bai_lam b join bai_test t on t.id=b.bai_test_id where b.hoc_sinh_id=hl.hoc_sinh_id and t.mon=l.mon and t.loai='tu_luyen') order by l.mon`)
  for (const e of ems) {
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: e.tk, role: 'authenticated' })])
    const d = (await q(`select public._tu_luyen_chon_dang($1, $2, 2000) v`, [e.id, e.mon]))[0].v   // 2000 lần rút để đo phân bố
    const mc = await q(`select ma_dang from public.fn_mastery_cells(array[$1::uuid], true, null, 5, 5, 3) m where m.score is not null order by m.score, m.ma_dang`, [e.id])
    const tapYeu = new Set(mc.slice(0, Math.max(1, Math.ceil(mc.length / 2))).map((x) => x.ma_dang))
    console.log(`${e.mon}: ${mc.length} dạng có số đo · 2000 lần rút: ${(100 * d.filter((x) => tapYeu.has(x)).length / d.length).toFixed(0)}% rơi vào nửa yếu (kỳ vọng ≈ 60% + 40%×½ = 80%)`)
    const t = Date.now(); const k = (await q(`select public.fn_tu_luyen_sinh_tu_dong($1) v`, [e.mon]))[0].v
    console.log(`  Tự luyện Tổng hợp: ${k.tong} câu · ${Date.now() - t} ms`)
    await c.query('savepoint sp'); let k2; try { k2 = await q(`select public.fn_thu_thach_sinh_tu_dong($1) v`, [e.mon]); await c.query('release savepoint sp') } catch (x) { await c.query('rollback to savepoint sp'); k2 = { err: x.message } }
    console.log('  Thử thách:', k2.err ? 'LỖI ' + k2.err : `${k2[0].v.tong} câu`)
  }
} catch (e) { console.log('✖ LỖI:', e.message) }
finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong — không ghi gì') }
