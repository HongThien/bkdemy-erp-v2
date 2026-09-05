// Kiểm tra dữ liệu ET/BTVN thiếu cho buổi học 20/08 - 25/08/2026. CHỈ SELECT.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env', 'utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '') })
await c.connect()
const p = async (t, s, params) => {
  const r = await c.query(s, params)
  console.log(`\n▸ ${t} (${r.rows.length} dòng)`)
  if (r.rows.length) console.table(r.rows.slice(0, 40))
}

const RANGE = `b.ngay between '2026-08-20' and '2026-08-25'`

await p('0. Tổng quan buổi trong khoảng 20-25/8 (không huỷ)', `
  select b.ngay::text, l.ten_lop, b.loai, b.trang_thai,
         (b.et_dong_at is not null) as et_dong,
         (b.btvn_dong_at is not null) as btvn_dong
  from buoi_hoc b join lop l on l.id=b.lop_id
  where ${RANGE} and b.trang_thai<>'huy'
  order by b.ngay, l.ten_lop`)

await p('1. Buổi CÓ đề ET (gami_session_problems phase=et) nhưng CHƯA đóng ET (et_dong_at null)', `
  select b.ngay::text, l.ten_lop, b.loai,
         (select count(*) from gami_session_problems p where p.buoi_hoc_id=b.id and p.phase='et') as so_de_et
  from buoi_hoc b join lop l on l.id=b.lop_id
  where ${RANGE} and b.trang_thai<>'huy' and b.et_dong_at is null
    and exists (select 1 from gami_session_problems p where p.buoi_hoc_id=b.id and p.phase='et')
  order by b.ngay, l.ten_lop`)

await p('2. Buổi ĐÃ đóng ET nhưng có HS có_mặt KHÔNG có dòng chấm nào (đóng khống)', `
  with bu as (
    select b.id, b.ngay, l.ten_lop from buoi_hoc b join lop l on l.id=b.lop_id
    where ${RANGE} and b.trang_thai<>'huy' and b.et_dong_at is not null
  ), comat as (
    select h.buoi_hoc_id, count(*) n from buoi_hoc_hs h
    join bu on bu.id=h.buoi_hoc_id where h.diem_danh='co_mat' group by 1
  ), cham as (
    select distinct buoi_hoc_id from gami_grades where buoi_hoc_id in (select id from bu)
  )
  select bu.ngay::text, bu.ten_lop, comat.n as so_hs_co_mat
  from bu join comat on comat.buoi_hoc_id=bu.id
  left join cham on cham.buoi_hoc_id=bu.id
  where cham.buoi_hoc_id is null
  order by bu.ngay, bu.ten_lop`)

await p('3. Buổi ĐÃ đóng ET, có chấm — nhưng THIẾU 1 phần HS có_mặt (chấm không đủ)', `
  with bu as (
    select b.id, b.ngay, l.ten_lop from buoi_hoc b join lop l on l.id=b.lop_id
    where ${RANGE} and b.trang_thai<>'huy' and b.et_dong_at is not null
  ), comat as (
    select h.buoi_hoc_id, count(*) n from buoi_hoc_hs h
    join bu on bu.id=h.buoi_hoc_id where h.diem_danh='co_mat' group by 1
  ), cham as (
    select buoi_hoc_id, count(distinct hoc_sinh_id) n from gami_grades
    where buoi_hoc_id in (select id from bu) group by 1
  )
  select bu.ngay::text, bu.ten_lop, comat.n as so_co_mat, coalesce(cham.n,0) as so_da_cham
  from bu join comat on comat.buoi_hoc_id=bu.id
  left join cham on cham.buoi_hoc_id=bu.id
  where coalesce(cham.n,0) < comat.n
  order by bu.ngay, bu.ten_lop`)

await p('4. Buổi CÓ tài liệu BTVN giao (tai_lieu loai=btvn khớp ngày+lớp) nhưng CHƯA đóng BTVN (btvn_dong_at null)', `
  select b.ngay::text, l.ten_lop
  from buoi_hoc b join lop l on l.id=b.lop_id
  where ${RANGE} and b.trang_thai<>'huy' and b.btvn_dong_at is null
    and exists (select 1 from tai_lieu tl where tl.lop_id=b.lop_id and tl.ngay=b.ngay and tl.loai='btvn')
  order by b.ngay, l.ten_lop`)

await p('5. Buổi ĐÃ đóng BTVN nhưng có HS có_mặt KHÔNG có dòng btvn_ket_qua nào', `
  with bu as (
    select b.id, b.ngay, l.ten_lop from buoi_hoc b join lop l on l.id=b.lop_id
    where ${RANGE} and b.trang_thai<>'huy' and b.btvn_dong_at is not null
  ), comat as (
    select h.buoi_hoc_id, h.hoc_sinh_id from buoi_hoc_hs h
    join bu on bu.id=h.buoi_hoc_id where h.diem_danh='co_mat'
  ), coket as (
    select bkq.buoi_hoc_id, bkq.hoc_sinh_id from btvn_ket_qua bkq
    where bkq.buoi_hoc_id in (select id from bu)
  )
  select bu.ngay::text, bu.ten_lop, count(*) as so_hs_thieu_ket_qua
  from comat
  join bu on bu.id=comat.buoi_hoc_id
  left join coket on coket.buoi_hoc_id=comat.buoi_hoc_id and coket.hoc_sinh_id=comat.hoc_sinh_id
  where coket.hoc_sinh_id is null
  group by bu.ngay, bu.ten_lop
  order by bu.ngay, bu.ten_lop`)

await p('6. Buổi vắng KHÔNG-bù chưa xử lý (bang_khong_bu) trong khoảng — vẫn liệt kê để đối chiếu', `
  select b.ngay::text, l.ten_lop, count(*) filter (where h.diem_danh='vang') as so_vang
  from buoi_hoc b join lop l on l.id=b.lop_id
  join buoi_hoc_hs h on h.buoi_hoc_id=b.id
  where ${RANGE} and b.trang_thai<>'huy'
  group by b.ngay, l.ten_lop having count(*) filter (where h.diem_danh='vang') > 0
  order by b.ngay, l.ten_lop`)

await c.end()
