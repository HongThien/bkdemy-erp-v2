// ĐO MỨC GẮN BÓ APP HS — chạy lại được để so với SỐ NỀN 28/09/2026 (spec-thanh-tuu-nhiem-vu.md §0.10).
// CHỈ ĐỌC (transaction read only). Ngày theo giờ VN. Hoạt động = HS BẮT ĐẦU 1 bài trên app (bai_lam.bat_dau_at).
// "Tự nguyện" = tự luyện · học-từ-đầu luyện · thử thách (không ai giao) — tín hiệu gắn bó thật; bài giao (ET/BTVN/giáo trình/bổ trợ) là bắt buộc.
// Chạy: node scripts/do-gan-bo-app.mjs 2026-08-31 2026-09-27   (từ thứ 2 → chủ nhật, nên lấy tuần trọn)
import pg from 'pg'; import fs from 'fs'
const [TU = '2026-08-31', DEN = '2026-09-27'] = process.argv.slice(2)
const url = process.env.DATABASE_URL_RO || process.env.DATABASE_URL || fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL(?:_RO)?=(.*)$/m)[1].trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
await c.query('begin read only'); const q = async (s) => (await c.query(s, [TU, DEN])).rows
const CTE = `with hs as (select h.id, h.khoi from hoc_sinh h where h.trang_thai='dang_hoc' and coalesce(h.ma_hs,'') !~* '^test'),
 tk as (select distinct t.hoc_sinh_id id from tai_khoan t join hs on hs.id=t.hoc_sinh_id),
 bl as (select l.hoc_sinh_id, (l.bat_dau_at at time zone 'Asia/Ho_Chi_Minh') ts, (l.bat_dau_at at time zone 'Asia/Ho_Chi_Minh')::date ngay,
          date_trunc('week',(l.bat_dau_at at time zone 'Asia/Ho_Chi_Minh'))::date tuan, t.loai, coalesce(t.thu_thach,false) thu_thach, l.trang_thai
        from bai_lam l join bai_test t on t.id=l.bai_test_id join hs on hs.id=l.hoc_sinh_id
        where (l.bat_dau_at at time zone 'Asia/Ho_Chi_Minh')::date between $1::date and $2::date),
 tn as (select * from bl where loai in ('tu_luyen','htd_luyen') or thu_thach)`
console.log(`KỲ ĐO ${TU} → ${DEN}`)
console.log('Mẫu số', await q(CTE + ` select (select count(*) from hs) hs_dang_hoc, (select count(*) from tk) co_tai_khoan`))
console.table(await q(CTE + ` select to_char(w.tuan,'DD/MM') tuan, count(distinct bl.hoc_sinh_id) hs_dung_app, count(bl.*) luot,
   (select count(distinct hoc_sinh_id) from tn where tn.tuan=w.tuan) hs_tu_nguyen, (select count(*) from tn where tn.tuan=w.tuan) luot_tu_nguyen
   from (select distinct tuan from bl) w left join bl on bl.tuan=w.tuan group by w.tuan order by w.tuan`))
console.table(await q(CTE + `, d as (select hoc_sinh_id, tuan, count(distinct ngay) so_ngay from bl group by 1,2),
   luoi as (select tk.id, w.tuan from tk cross join (select distinct tuan from bl) w)
   select case when coalesce(d.so_ngay,0)=0 then '0 ngày/tuần' when d.so_ngay<=2 then '1–2 ngày/tuần' else '≥3 ngày/tuần' end nhom,
     round(100.0*count(*)/sum(count(*)) over (),1) pt_hs_tuan from luoi left join d on d.hoc_sinh_id=luoi.id and d.tuan=luoi.tuan group by 1 order by 1`))
console.table(await q(CTE + ` select case when thu_thach then 'thu_thach' else loai end loai, count(distinct hoc_sinh_id) hs, count(*) luot,
   round(100.0*count(*) filter (where trang_thai='da_nop')/count(*)) pt_nop from bl group by 1 order by 3 desc`))
console.table(await q(CTE + ` select extract(hour from ts)::int gio, count(*) luot, count(distinct hoc_sinh_id) hs from bl group by 1 order by 1`))
console.table(await q(CTE + ` select to_char(date_trunc('hour',ts)+interval '30 min'*floor(extract(minute from ts)/30),'DD/MM HH24:MI') khung_30p, count(distinct hoc_sinh_id) hs
   from bl group by date_trunc('hour',ts)+interval '30 min'*floor(extract(minute from ts)/30) order by 2 desc limit 5`))
console.table(await q(CTE + ` select hs.khoi, count(distinct tk.id) co_tk, count(distinct bl.hoc_sinh_id) da_dung from tk join hs on hs.id=tk.id left join bl on bl.hoc_sinh_id=tk.id group by 1 order by 1`))
await c.query('rollback'); await c.end()
