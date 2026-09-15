import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p=async(t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);console.table(r.rows.slice(0,12))}
await p('Mảng YẾU còn sống không?', `
  select 'canh_bao_yeu' as bang, count(*) as dong, max(created_at)::date as moi_nhat from canh_bao_yeu
  union all select 'bo_tro_yeu', count(*), max(created_at)::date from bo_tro_yeu
  union all select 'bo_tro_yeu_dang', count(*), null from bo_tro_yeu_dang`)
await p('Test đầu vào — 4 mốc chuỗi', `
  select count(*) as tong,
    count(*) filter (where hoan_thanh_at is not null) as da_test,
    count(*) filter (where bai_url is not null) as da_scan,
    count(*) filter (where cham_xong_at is not null) as da_cham,
    count(*) filter (where tra_bai_xong_at is not null) as da_tra
  from ca_test`)
await p('Buổi thường 30 ngày — khâu chưa đóng (nền "lớp còn thiếu" của Trang)', `
  select count(*) as buoi,
    count(*) filter (where danh_gia_xong_at is null) as thieu_danhgia,
    count(*) filter (where et_dong_at is null) as thieu_et,
    count(*) filter (where btvn_dong_at is null) as thieu_btvn
  from buoi_hoc where loai='thuong' and trang_thai<>'huy' and ngay >= current_date - 30`)
await p('Có chỗ nào ghi LỚP NÀO BẮT BUỘC làm ET/BTVN chưa?', `
  select column_name from information_schema.columns
  where table_name='lop' and (column_name ilike '%et%' or column_name ilike '%btvn%' or column_name ilike '%bat_buoc%' or column_name ilike '%must%')`)
await p('3 người — họ đang giữ ghế/vai gì', `
  select ns.ma_ns, ns.ho_ten,
    (select count(*) from phan_cong_lop p where p.nhan_su_id=ns.id) as so_lop_phan_cong,
    (select count(*) from vi_tri v where v.nhan_su_id=ns.id) as so_ghe,
    (select string_agg(v.ten,' · ') from vi_tri v where v.nhan_su_id=ns.id) as ghe
  from nhan_su ns where ns.ho_ten ilike '%Lộc%' or ns.ho_ten ilike '%Trang%' or ns.ho_ten ilike '%Thùy%'`)
await c.end()
