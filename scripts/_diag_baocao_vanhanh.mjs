import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,25))}

// Buổi hôm qua, theo LỚP: đóng chưa + CÓ bằng chứng phải làm chưa (đề ET / doc BTVN)
await p('HÔM QUA (13/08) — từng lớp', `
  select l.ten_lop, l.mon,
    (b.et_dong_at is not null) as et_xong,
    exists(select 1 from tai_lieu t where t.loai='et' and t.lop_id=b.lop_id and t.ngay=b.ngay) as co_de_et,
    (b.btvn_dong_at is not null) as btvn_xong,
    exists(select 1 from tai_lieu t where t.loai='btvn' and t.lop_id=b.lop_id and t.ngay=b.ngay) as co_doc_btvn,
    (b.danh_gia_xong_at is not null) as dg_xong
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and b.trang_thai<>'huy' and b.ngay = current_date - 1
  order by l.ten_lop`)

// ⚠ BTVN chấm ở buổi SAU — đo xem sau bao lâu thì đóng, để biết nhắc sáng hôm sau có phải nhiễu không
await p('BTVN đóng sau bao nhiêu ngày kể từ buổi (60 ngày, buổi có doc BTVN)', `
  select (b.btvn_dong_at::date - b.ngay) as sau_may_ngay, count(*)
  from buoi_hoc b
  where b.loai='thuong' and b.trang_thai<>'huy' and b.btvn_dong_at is not null
    and b.ngay >= current_date - 60
  group by 1 order by 1 limit 12`)

await p('ET đóng sau bao nhiêu ngày kể từ buổi', `
  select (b.et_dong_at::date - b.ngay) as sau_may_ngay, count(*)
  from buoi_hoc b
  where b.loai='thuong' and b.trang_thai<>'huy' and b.et_dong_at is not null
    and b.ngay >= current_date - 60
  group by 1 order by 1 limit 12`)

// Từ đầu tuần (T2 = 10/08) tới hôm qua — lớp còn NỢ, chỉ tính khi CÓ bằng chứng phải làm
await p('TỪ ĐẦU TUẦN — lớp còn nợ (chỉ đếm khi có đề/doc)', `
  select l.ten_lop,
    count(*) filter (where b.et_dong_at is null and exists(select 1 from tai_lieu t where t.loai='et' and t.lop_id=b.lop_id and t.ngay=b.ngay)) as no_et,
    count(*) filter (where b.btvn_dong_at is null and exists(select 1 from tai_lieu t where t.loai='btvn' and t.lop_id=b.lop_id and t.ngay=b.ngay)) as no_btvn,
    count(*) filter (where b.danh_gia_xong_at is null) as chua_danh_gia,
    count(*) as so_buoi
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and b.trang_thai<>'huy'
    and b.ngay >= date_trunc('week', current_date)::date and b.ngay < current_date
  group by 1 having count(*) filter (where b.et_dong_at is null and exists(select 1 from tai_lieu t where t.loai='et' and t.lop_id=b.lop_id and t.ngay=b.ngay))>0
     or count(*) filter (where b.btvn_dong_at is null and exists(select 1 from tai_lieu t where t.loai='btvn' and t.lop_id=b.lop_id and t.ngay=b.ngay))>0
     or count(*) filter (where b.danh_gia_xong_at is null)>0
  order by 1`)
await c.end()
