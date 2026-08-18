import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,15))}
await p('Lớp Hải đang chấm mà KHÔNG được phân công — buổi đó hệ ghi ai dạy?', `
  select l.ten_lop,
    count(distinct b.id) as so_buoi_cham,
    count(distinct b.id) filter (where b.nguoi_day is null) as buoi_khong_ghi_nguoi_day,
    (select string_agg(distinct ns2.ho_ten, ', ') from phan_cong_lop pc2
       join nhan_su ns2 on ns2.id=pc2.nhan_su_id where pc2.lop_id=l.id and pc2.vai_tro='gv') as gv_dang_phan_cong
  from gami_grades g
  join gami_session_problems sp on sp.id=g.problem_id
  join buoi_hoc b on b.id=sp.buoi_hoc_id and b.ngay >= current_date - 60
  join lop l on l.id=b.lop_id
  join tai_khoan tk on tk.id=g.graded_by
  join nhan_su ns on ns.id=tk.nhan_su_id and ns.ma_ns='NS008'
  left join phan_cong_lop pc on pc.lop_id=b.lop_id and pc.nhan_su_id=ns.id
  where pc.nhan_su_id is null
  group by l.id, l.ten_lop order by 2 desc`)
await p('Uyên (NS006) còn được phân công lớp nào không', `
  select count(*) as so_lop from phan_cong_lop pc join nhan_su ns on ns.id=pc.nhan_su_id where ns.ma_ns='NS006'`)
await c.end()
