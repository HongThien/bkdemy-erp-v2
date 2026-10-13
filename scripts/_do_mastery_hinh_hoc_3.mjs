// ĐO (chỉ đọc): đổi cửa sổ mastery Hình–Học 5 → 3 bài thì bao nhiêu ô (HS × bài học) đổi mức / độ tin.
// Dùng chính fn_mastery_cells với p_window khác nhau. Chạy: node scripts/_do_mastery_hinh_hoc_3.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const m = txt.match(/^[ \t]*DATABASE_URL_RO[ \t]*=[ \t]*(.+?)[ \t\r]*$/m) || txt.match(/^[ \t]*DATABASE_URL[ \t]*=[ \t]*(.+?)[ \t\r]*$/m)
const c = new pg.Client({ connectionString: m[1].replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const r = await c.query(`
  with hs as (select array_agg(id) a from hoc_sinh),
  hh as (select ma_bai from hinh_hoc_bai),
  c5 as (select f.* from hs, fn_mastery_cells(hs.a, false, null, 5, 5, 3) f join hh on hh.ma_bai = f.ma_dang),
  c3 as (select f.* from hs, fn_mastery_cells(hs.a, false, null, 3, 3, 2) f join hh on hh.ma_bai = f.ma_dang)
  select count(*)::int as o,
         count(*) filter (where c5.muc <> c3.muc)::int as doi_muc,
         count(*) filter (where c5.tin <> c3.tin)::int as doi_tin,
         count(*) filter (where c5.n > 3)::int as co_hon_3_lan,
         count(*) filter (where c5.muc='yeu' and c3.muc<>'yeu')::int as het_yeu,
         count(*) filter (where c5.muc<>'yeu' and c3.muc='yeu')::int as thanh_yeu,
         count(*) filter (where c5.muc='dat' and c3.muc<>'dat')::int as mat_dat,
         count(*) filter (where c5.muc<>'dat' and c3.muc='dat')::int as thanh_dat,
         count(*) filter (where c5.tin='thap')::int as tin_thap_5, count(*) filter (where c3.tin='thap')::int as tin_thap_3,
         count(*) filter (where c5.tin='cao')::int as tin_cao_5, count(*) filter (where c3.tin='cao')::int as tin_cao_3
  from c5 join c3 using (hoc_sinh_id, ma_dang)`)
const d = await c.query(`
  with hs as (select array_agg(id) a from hoc_sinh), hh as (select ma_bai from hinh_hoc_bai)
  select width_bucket(f.n, 1, 8, 7) b, min(f.n)::int tu, max(f.n)::int den, count(*)::int so_o
  from hs, fn_mastery_cells(hs.a, false, null, 5, 5, 3) f join hh on hh.ma_bai = f.ma_dang group by 1 order by 1`)
await c.query('ROLLBACK'); await c.end()
console.log(r.rows[0]); console.log('phân bố số lần đo / ô:'); console.table(d.rows)
