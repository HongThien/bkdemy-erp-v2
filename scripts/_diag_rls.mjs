import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,25))}

await p('Kiểu policy đang dùng — bao nhiêu bảng thật sự lọc theo DÒNG', `
  select case
    when qual ilike '%la_thanh_vien%' then 'cổng nhị phân: là nhân sự thì thấy hết'
    when qual = 'true' then 'mở toang (true)'
    when qual ilike '%my_hoc_sinh_id%' or qual ilike '%hs_o_lop%' then 'lọc theo DÒNG (HS/PH)'
    when qual is null then '(không có qual)'
    else 'khác — ' || left(qual, 40) end as kieu,
    count(*) as so_policy, count(distinct tablename) as so_bang
  from pg_policies where schemaname='public' group by 1 order by 2 desc`)

await p('Bảng NHẠY CẢM — ai đang đọc được', `
  select p.tablename, count(*) as so_policy,
    bool_or(p.qual ilike '%la_thanh_vien%') as moi_nhan_su_deu_doc_duoc
  from pg_policies p
  where p.schemaname='public' and (
    p.tablename like 'hoa_don%' or p.tablename like 'hoc_phi%' or p.tablename like 'luong%'
    or p.tablename in ('nhan_su','tai_khoan','phu_huynh','bao_cao_ph','viec','ung_vien','vi_tri'))
  group by 1 order by 1`)

await p('Bảng vận hành cần siết đầu tiên — có bao nhiêu dòng', `
  select 'buoi_hoc' t, count(*) n from buoi_hoc
  union all select 'buoi_hoc_hs', count(*) from buoi_hoc_hs
  union all select 'gami_grades', count(*) from gami_grades
  union all select 'buoi_danh_gia', count(*) from buoi_danh_gia
  union all select 'btvn_ket_qua', count(*) from btvn_ket_qua
  union all select 'hoa_don', count(*) from hoa_don`)
await c.end()
