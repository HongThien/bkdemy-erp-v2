import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,50))}
// Nếu áp CÙNG luật bằng chứng cho đánh giá (lớp nào thật sự chạy) thì ra bao nhiêu lớp?
await p('Tỉ lệ buổi ĐÃ ĐÓNG đánh giá theo lớp (60 ngày)', `
  select l.ten_lop, l.mon, count(*) as buoi,
    count(*) filter (where b.danh_gia_xong_at is not null) as da_dg,
    round(100.0*count(*) filter (where b.danh_gia_xong_at is not null)/count(*)) as pct
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay >= current_date - 60
  group by 1,2 having count(*) >= 4 order by pct desc limit 20`)
await p('Phân bố % đánh giá', `
  with t as (
    select b.lop_id, count(*) n, round(100.0*count(*) filter (where b.danh_gia_xong_at is not null)/count(*)) as pct
    from buoi_hoc b where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay >= current_date - 60 group by 1
  )
  select case when pct=0 then '0%' when pct<30 then '1-29%' when pct<60 then '30-59%'
              when pct<100 then '60-99%' else '100%' end as nhom, count(*) so_lop
  from t where n >= 4 group by 1 order by 1`)
await c.end()
