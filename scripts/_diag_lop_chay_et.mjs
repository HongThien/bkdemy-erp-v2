import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,60))}
// "Lớp có chạy ET" phải SUY từ hành vi, không hỏi người tick 46 lớp.
// DEVLOG 12/08 đã ghi tín hiệu này là BIMODAL — kiểm lại xem còn đúng không.
await p('Tỉ lệ buổi CÓ ĐỀ ET theo lớp (60 ngày) — xem có tách đôi rõ không', `
  select l.ten_lop, l.mon, count(*) as buoi,
    count(*) filter (where exists(select 1 from tai_lieu t where t.loai='et' and t.lop_id=b.lop_id and t.ngay=b.ngay)) as co_de,
    round(100.0 * count(*) filter (where exists(select 1 from tai_lieu t where t.loai='et' and t.lop_id=b.lop_id and t.ngay=b.ngay)) / count(*)) as pct_de,
    count(*) filter (where b.et_dong_at is not null) as da_dong
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay >= current_date - 60
  group by 1,2 order by pct_de desc, buoi desc`)
await p('Phân bố % có đề — bimodal hay dàn đều?', `
  with t as (
    select b.lop_id, round(100.0 * count(*) filter (where exists(select 1 from tai_lieu x where x.loai='et' and x.lop_id=b.lop_id and x.ngay=b.ngay)) / count(*)) as pct
    from buoi_hoc b where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay >= current_date - 60 group by 1
  )
  select case when pct = 0 then '0%' when pct < 30 then '1-29%' when pct < 70 then '30-69%'
              when pct < 100 then '70-99%' else '100%' end as nhom, count(*) as so_lop
  from t group by 1 order by 1`)
await c.end()
