import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,20))}

// Khoá thứ tự: không đóng ET buổi X nếu còn buổi THƯỜNG trước đó của cùng lớp chưa đóng ET.
// Đo: mỗi lớp, buổi hở ET cũ nhất là ngày nào, và nó đang chặn bao nhiêu buổi phía sau.
await p('Lớp đang bị CHẶN dây chuyền (buổi hở ET cũ nhất + số buổi sau bị chặn)', `
  with ho as (
    select b.lop_id, min(b.ngay) as ngay_ho
    from buoi_hoc b
    where b.loai='thuong' and b.trang_thai<>'huy' and b.et_dong_at is null
    group by 1
  )
  select l.ten_lop, ho.ngay_ho, (current_date - ho.ngay_ho) as ho_bao_ngay,
    (select count(*) from buoi_hoc x where x.lop_id=ho.lop_id and x.loai='thuong'
       and x.trang_thai<>'huy' and x.ngay > ho.ngay_ho and x.et_dong_at is null) as buoi_sau_bi_chan,
    exists(select 1 from tai_lieu t where t.loai='et' and t.lop_id=ho.lop_id and t.ngay=ho.ngay_ho) as buoi_ho_co_de
  from ho join lop l on l.id=ho.lop_id
  order by buoi_sau_bi_chan desc, ho.ngay_ho`)

await p('Tổng quan', `
  with ho as (
    select b.lop_id, min(b.ngay) as ngay_ho from buoi_hoc b
    where b.loai='thuong' and b.trang_thai<>'huy' and b.et_dong_at is null group by 1
  )
  select count(*) as lop_co_lo_ho,
    count(*) filter (where (select count(*) from buoi_hoc x where x.lop_id=ho.lop_id and x.loai='thuong'
        and x.trang_thai<>'huy' and x.ngay > ho.ngay_ho and x.et_dong_at is null) > 0) as lop_bi_chan_day_chuyen,
    max(current_date - ho.ngay_ho) as lo_ho_cu_nhat_ngay
  from ho`)
await c.end()
