import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,15))}
// Ai THẬT SỰ chấm ingame: người chấm là GV hay TG của chính lớp đó?
await p('Chấm bài trên lớp (ingame, 60 ngày) — người chấm giữ vai gì ở lớp đó', `
  select coalesce(pc.vai_tro,'(không phân công lớp này)') as vai_cua_nguoi_cham,
         count(*) as so_dong, count(distinct g.graded_by) as so_nguoi
  from gami_grades g
  join gami_session_problems sp on sp.id=g.problem_id and sp.phase='ingame'
  join buoi_hoc b on b.id=sp.buoi_hoc_id and b.ngay >= current_date - 60
  left join tai_khoan tk on tk.id = g.graded_by
  left join phan_cong_lop pc on pc.lop_id=b.lop_id and pc.nhan_su_id = tk.nhan_su_id
  group by 1 order by 2 desc`)
await p('So sánh: ET chấm bởi vai nào', `
  select coalesce(pc.vai_tro,'(không phân công)') as vai, count(*) as so_dong
  from gami_grades g
  join gami_session_problems sp on sp.id=g.problem_id and sp.phase='et'
  join buoi_hoc b on b.id=sp.buoi_hoc_id and b.ngay >= current_date - 60
  left join tai_khoan tk on tk.id = g.graded_by
  left join phan_cong_lop pc on pc.lop_id=b.lop_id and pc.nhan_su_id = tk.nhan_su_id
  group by 1 order by 2 desc`)
await c.end()
