import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const homNay = new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Ho_Chi_Minh'})
const D = '2026-08-10'
const q = `
with abs as (
  select h.id, h.hoc_sinh_id, h.buoi_hoc_id, b.ngay
  from buoi_hoc_hs h join buoi_hoc b on b.id=h.buoi_hoc_id
  where h.diem_danh in ('vang','vang_phep') and b.loai='thuong' and b.trang_thai<>'huy'
), link as (   -- lượt xếp bù CÒN HIỆU LỰC: buổi bù chưa huỷ VÀ em không vắng ở buổi bù
  select distinct l.hoc_sinh_id, l.bu_cho_buoi_id
  from buoi_hoc_hs l join buoi_hoc bb on bb.id=l.buoi_hoc_id
  where l.bu_cho_buoi_id is not null and bb.trang_thai<>'huy'
    and (l.diem_danh is null or l.diem_danh not in ('vang','vang_phep'))
), truot as (  -- đã xếp mà trượt (vắng hoặc buổi huỷ), và KHÔNG có lượt nào còn hiệu lực
  select distinct l.hoc_sinh_id, l.bu_cho_buoi_id
  from buoi_hoc_hs l join buoi_hoc bb on bb.id=l.buoi_hoc_id
  where l.bu_cho_buoi_id is not null
    and (bb.trang_thai='huy' or l.diem_danh in ('vang','vang_phep'))
), can as (
  select a.*, (t.hoc_sinh_id is not null) as phai_xep_lai
  from abs a
  left join link  d on d.hoc_sinh_id=a.hoc_sinh_id and d.bu_cho_buoi_id=a.buoi_hoc_id
  left join truot t on t.hoc_sinh_id=a.hoc_sinh_id and t.bu_cho_buoi_id=a.buoi_hoc_id
  left join bang_khong_bu k on k.buoi_hoc_hs_id=a.id
  where d.hoc_sinh_id is null and k.buoi_hoc_hs_id is null
)
select count(*) filter (where phai_xep_lai) as "③ phải xếp lại",
       count(*) filter (where not phai_xep_lai) as "⑤ cần xếp (chưa từng xếp)",
       count(*) filter (where not phai_xep_lai and ngay >= '${D}' and '${homNay}'::date - ngay::date > 2) as "④ quá hạn 48h",
       count(*) filter (where not phai_xep_lai and ngay >= '${D}' and '${homNay}'::date - ngay::date <= 2) as "còn trong hạn",
       count(*) filter (where not phai_xep_lai and ngay < '${D}') as "tồn đọng cũ (trước đường ngày)",
       count(*) as "tổng hàng đợi"
from can`
console.log('Kỳ vọng sau fix — hôm nay', homNay, '· đường ngày', D)
console.table((await c.query(q)).rows)
await c.end()
