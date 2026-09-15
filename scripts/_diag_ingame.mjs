import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,10))}
await p('Buổi thường 60 ngày: khâu nào ĐANG chạy', `
  select count(*) as buoi,
    count(*) filter (where ingame_dong_at is not null) as ingame_dong,
    count(*) filter (where et_dong_at is not null) as et_dong,
    count(*) filter (where btvn_dong_at is not null) as btvn_dong,
    count(*) filter (where danh_gia_xong_at is not null) as dg_dong
  from buoi_hoc where loai='thuong' and trang_thai<>'huy' and ngay >= current_date - 60`)
await p('Dòng chấm theo phase (60 ngày) — ai thật sự ghi gì', `
  select p.phase, count(*) as so_dong, count(distinct p.buoi_hoc_id) as so_buoi
  from gami_grades g join gami_session_problems p on p.id=g.problem_id
  join buoi_hoc b on b.id=p.buoi_hoc_id
  where b.ngay >= current_date - 60 group by 1 order by 2 desc`)
await c.end()
