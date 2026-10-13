// Test mig 202610140130 trong transaction + ROLLBACK: (1) dạng KHÔNG phải Hình–Học: kết quả y hệt trước;
// (2) dạng Hình–Học: bằng đúng kết quả hàm CŨ gọi với (window 3, tin 3/2). Chạy: node scripts/_test_mastery_hinh_hoc_3.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect()
const sql = readFileSync(new URL('../supabase/migrations/202610140130_mastery_hinh_hoc_cua_so_3.sql', import.meta.url), 'utf8')
await c.query('BEGIN')
let bad = 0
try {
  await c.query(`create temp table cu5 on commit drop as select f.* from (select array_agg(id) a from hoc_sinh) h, fn_mastery_cells(h.a, true) f`)
  await c.query(`create temp table cu3 on commit drop as select f.* from (select array_agg(id) a from hoc_sinh) h, fn_mastery_cells(h.a, true, null, 3, 3, 2) f`)
  await c.query(sql)
  await c.query(`create temp table moi on commit drop as select f.* from (select array_agg(id) a from hoc_sinh) h, fn_mastery_cells(h.a, true) f`)
  const [r] = (await c.query(`
    with hh as (select ma_bai from hinh_hoc_bai),
    j as (select moi.*, (hh.ma_bai is not null) la_hinh from moi left join hh on hh.ma_bai = moi.ma_dang)
    select (select count(*) from cu5)::int n_cu, (select count(*) from moi)::int n_moi,
      count(*) filter (where not la_hinh)::int khac_hinh, count(*) filter (where la_hinh)::int hinh,
      count(*) filter (where not la_hinh and not exists (select 1 from cu5 x where x.hoc_sinh_id=j.hoc_sinh_id and x.ma_dang=j.ma_dang
          and x.score is not distinct from j.score and x.n=j.n and x.muc=j.muc and x.tin=j.tin))::int lech_khac_hinh,
      count(*) filter (where la_hinh and not exists (select 1 from cu3 x where x.hoc_sinh_id=j.hoc_sinh_id and x.ma_dang=j.ma_dang
          and x.score is not distinct from j.score and x.n=j.n and x.muc=j.muc and x.tin=j.tin))::int lech_hinh
    from j`)).rows
  console.log(r)
  if (r.n_cu !== r.n_moi || r.lech_khac_hinh || r.lech_hinh || !r.hinh) bad = 1
} catch (e) { bad = 1; console.log('LỖI', e.message) }
finally { await c.query('ROLLBACK'); await c.end() }
console.log(bad ? '❌ sai' : '✅ đúng: dạng khác Hình y hệt cũ · Hình–Học = cửa sổ 3   (đã ROLLBACK)')
process.exit(bad)
