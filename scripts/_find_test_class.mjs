import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url })
await c.connect()
const today = '2026-06-15'
// classes with TKB effective today, khai giang <= today, dang_hoc, with enrolled count
const q = `
select l.id, l.ten_lop, l.mon, l.khoi, l.ngay_khai_giang, l.trang_thai,
  t.thu, t.gio_bat_dau, t.gio_ket_thuc, t.phong, t.hieu_luc_tu, t.hieu_luc_den,
  (select count(*) from hoc_sinh_lop hl where hl.lop_id=l.id and hl.trang_thai='dang_hoc' and (hl.ngay_vao is null or hl.ngay_vao <= $1)) as si_so
from lop l
join thoi_khoa_bieu t on t.lop_id=l.id
where l.trang_thai='dang_hoc' and l.ngay_khai_giang is not null and l.ngay_khai_giang <= $1
  and t.hieu_luc_tu <= $1 and (t.hieu_luc_den is null or t.hieu_luc_den >= $1)
order by si_so desc
limit 30`
const r = await c.query(q, [today])
console.table(r.rows.map(x=>({lop:x.ten_lop,mon:x.mon,khoi:x.khoi,kg:String(x.ngay_khai_giang).slice(0,10),thu:x.thu,gio:String(x.gio_bat_dau).slice(0,5),si_so:x.si_so})))
console.log('today VN dow:', new Date(today+'T00:00:00').getDay(), '(0=CN)')
await c.end()
