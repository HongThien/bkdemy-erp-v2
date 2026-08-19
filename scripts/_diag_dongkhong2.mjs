import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,20))}
// Nhóm "có đề mà không chấm" dừng ở 26/07 — kiểm xem có phải HÀNH VI ĐÃ ĐỔI, hay chỉ là hết buổi.
await p('Buổi bù CÓ đề ET, đã đóng — theo tuần: chấm vs không chấm', `
  with bu as (
    select b.id, b.ngay from buoi_hoc b
    where b.loai='bu' and b.trang_thai<>'huy' and b.et_dong_at is not null and b.danh_gia_xong_at is not null
      and exists (select 1 from gami_session_problems p where p.buoi_hoc_id=b.id and p.phase='et')
      and exists (select 1 from buoi_hoc_hs h where h.buoi_hoc_id=b.id and h.diem_danh='co_mat')
  )
  select to_char(date_trunc('week', bu.ngay),'YYYY-MM-DD') as tuan,
         count(*) as tong,
         count(*) filter (where exists (select 1 from gami_grades g where g.buoi_hoc_id=bu.id)) as co_cham,
         count(*) filter (where not exists (select 1 from gami_grades g where g.buoi_hoc_id=bu.id)) as khong_cham
  from bu group by 1 order by 1`)
await c.end()
