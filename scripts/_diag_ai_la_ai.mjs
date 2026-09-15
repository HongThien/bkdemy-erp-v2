import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,15))}
await p('Tách 3 khả năng cho dòng chấm 60 ngày', `
  select case
    when g.graded_by is null then '1. graded_by NULL (không ghi ai chấm)'
    when tk.id is null then '2. graded_by không khớp tai_khoan nào'
    when tk.nhan_su_id is null then '3. tài khoản chưa gắn nhân sự'
    when pc.nhan_su_id is null then '4. nhân sự thật, KHÔNG được phân công lớp đó'
    else '5. đúng người được phân công' end as loai,
    count(*) as so_dong
  from gami_grades g
  join gami_session_problems sp on sp.id=g.problem_id
  join buoi_hoc b on b.id=sp.buoi_hoc_id and b.ngay >= current_date - 60
  left join tai_khoan tk on tk.id=g.graded_by
  left join phan_cong_lop pc on pc.lop_id=b.lop_id and pc.nhan_su_id=tk.nhan_su_id
  group by 1 order by 2 desc`)
await p('Nhóm 4 — họ là ai, và có phải người DẠY buổi đó không', `
  select ns.ma_ns, ns.ho_ten, count(*) as so_dong,
    count(*) filter (where b.nguoi_day = ns.id or b.nguoi_day_tg = ns.id) as la_nguoi_day_buoi,
    (select count(*) from phan_cong_lop x where x.nhan_su_id=ns.id) as tong_lop_duoc_phan
  from gami_grades g
  join gami_session_problems sp on sp.id=g.problem_id
  join buoi_hoc b on b.id=sp.buoi_hoc_id and b.ngay >= current_date - 60
  join tai_khoan tk on tk.id=g.graded_by
  join nhan_su ns on ns.id=tk.nhan_su_id
  left join phan_cong_lop pc on pc.lop_id=b.lop_id and pc.nhan_su_id=tk.nhan_su_id
  where pc.nhan_su_id is null
  group by 1,2,ns.id order by 3 desc`)
await c.end()
