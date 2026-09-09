// CHẨN ĐOÁN luồng BỔ TRỢ BÙ trên dữ liệu THẬT. CHỈ SELECT.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env', 'utf8')
const url = env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url })
await c.connect()
const homNay = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
const p = async (ten, sql) => {
  const r = await c.query(sql)
  console.log(`\n▸ ${ten}`)
  if (!r.rows.length) console.log('   (0 dòng)')
  else r.rows.slice(0, 12).forEach((x) => console.log('  ', JSON.stringify(x)))
  if (r.rows.length > 12) console.log(`   … +${r.rows.length - 12} dòng`)
}
console.log('=== BỔ TRỢ BÙ · hôm nay', homNay, '===')

await p('Buổi bù theo trạng thái', `select trang_thai, count(*) from buoi_hoc where loai='bu' group by 1`)
await p('Buổi bù: đã qua / sắp tới (chưa huỷ)', `
  select case when ngay < '${homNay}' then 'đã qua' when ngay = '${homNay}' then 'HÔM NAY' else 'sắp tới' end as khi,
         count(*), count(*) filter (where et_dong_at is not null and danh_gia_xong_at is not null) as da_xong
  from buoi_hoc where loai='bu' and trang_thai<>'huy' group by 1`)

await p('①  Buổi bù ĐÃ QUA mà chưa đóng đủ ET + đánh giá', `
  select b.ngay, b.id, (b.et_dong_at is not null) as et, (b.danh_gia_xong_at is not null) as dg,
         count(h.id) as so_hs,
         count(h.id) filter (where h.diem_danh='co_mat') as co_mat,
         count(h.id) filter (where h.diem_danh is null) as chua_diem_danh
  from buoi_hoc b left join buoi_hoc_hs h on h.buoi_hoc_id=b.id
  where b.loai='bu' and b.trang_thai<>'huy' and b.ngay < '${homNay}'
    and (b.et_dong_at is null or b.danh_gia_xong_at is null)
  group by 1,2,3,4 order by b.ngay`)

await p('②  Buổi bù SẮP TỚI (từ hôm nay trở đi)', `
  select b.ngay, b.gio_bat_dau, b.phong, count(h.id) as so_hs
  from buoi_hoc b left join buoi_hoc_hs h on h.buoi_hoc_id=b.id
  where b.loai='bu' and b.trang_thai<>'huy' and b.ngay >= '${homNay}'
  group by 1,2,3 order by b.ngay`)

await p('③  HS ĐÃ XẾP bù nhưng VẮNG ở chính buổi bù (phải xếp lại)', `
  select hs.ho_ten, hs.ma_hs, b.ngay as ngay_bu, h.diem_danh, me.ngay as ngay_nghi_goc
  from buoi_hoc_hs h
  join buoi_hoc b on b.id=h.buoi_hoc_id and b.loai='bu'
  join hoc_sinh hs on hs.id=h.hoc_sinh_id
  left join buoi_hoc me on me.id=h.bu_cho_buoi_id
  where h.diem_danh in ('vang','vang_phep') order by b.ngay desc`)

await p('③b HS xếp vào buổi bù ĐÃ BỊ HUỶ (link còn, buổi mất)', `
  select hs.ho_ten, b.ngay as ngay_bu, b.trang_thai, me.ngay as ngay_nghi_goc
  from buoi_hoc_hs h
  join buoi_hoc b on b.id=h.buoi_hoc_id and b.loai='bu' and b.trang_thai='huy'
  join hoc_sinh hs on hs.id=h.hoc_sinh_id
  left join buoi_hoc me on me.id=h.bu_cho_buoi_id`)

await p('④  Lần nghỉ CHƯA xử lý, theo tuổi (hạn 48h = 2 ngày)', `
  with abs as (
    select h.id, h.hoc_sinh_id, h.buoi_hoc_id, b.ngay
    from buoi_hoc_hs h join buoi_hoc b on b.id=h.buoi_hoc_id
    where h.diem_danh in ('vang','vang_phep') and b.loai='thuong' and b.trang_thai<>'huy'
  ), da_xep as (
    select distinct hoc_sinh_id, bu_cho_buoi_id from buoi_hoc_hs where bu_cho_buoi_id is not null
  )
  select case when '${homNay}'::date - a.ngay::date > 2 then 'QUÁ HẠN (>48h)' else 'còn hạn' end as tt,
         count(*), min(a.ngay) as cu_nhat
  from abs a
  left join da_xep d on d.hoc_sinh_id=a.hoc_sinh_id and d.bu_cho_buoi_id=a.buoi_hoc_id
  left join bang_khong_bu k on k.buoi_hoc_hs_id=a.id
  where d.hoc_sinh_id is null and k.buoi_hoc_hs_id is null
  group by 1`)

await p('⑤  Tổng cần xếp bù (L1) + phân bố theo tuổi', `
  with abs as (
    select h.id, h.hoc_sinh_id, h.buoi_hoc_id, b.ngay
    from buoi_hoc_hs h join buoi_hoc b on b.id=h.buoi_hoc_id
    where h.diem_danh in ('vang','vang_phep') and b.loai='thuong' and b.trang_thai<>'huy'
  ), da_xep as (
    select distinct hoc_sinh_id, bu_cho_buoi_id from buoi_hoc_hs where bu_cho_buoi_id is not null
  )
  select count(*) as can_xep, min(a.ngay) as cu_nhat, max(a.ngay) as moi_nhat
  from abs a
  left join da_xep d on d.hoc_sinh_id=a.hoc_sinh_id and d.bu_cho_buoi_id=a.buoi_hoc_id
  left join bang_khong_bu k on k.buoi_hoc_hs_id=a.id
  where d.hoc_sinh_id is null and k.buoi_hoc_hs_id is null`)

await p('bang_khong_bu theo loại', `select loai, count(*) from bang_khong_bu group by 1`)
await p('Cột có sẵn của bang_khong_bu', `select column_name, data_type from information_schema.columns where table_name='bang_khong_bu' order by ordinal_position`)
await c.end()
