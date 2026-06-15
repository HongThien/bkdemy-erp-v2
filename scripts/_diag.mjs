import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const counts = await c.query(`select
 (select count(*) from lop) lop,
 (select count(*) from lop where trang_thai='dang_hoc') lop_dh,
 (select count(*) from lop where ngay_khai_giang is not null) lop_kg,
 (select count(*) from thoi_khoa_bieu) tkb,
 (select count(*) from thoi_khoa_bieu where hieu_luc_den is null) tkb_open,
 (select count(*) from hoc_sinh_lop where trang_thai='dang_hoc') hsl_dh`)
console.log('COUNTS', counts.rows[0])
console.log('\n-- sample lop --')
const l = await c.query(`select ten_lop,mon,khoi,trang_thai,ngay_khai_giang from lop order by ten_lop limit 15`)
console.table(l.rows.map(x=>({...x,ngay_khai_giang:x.ngay_khai_giang?String(x.ngay_khai_giang).slice(0,10):null})))
console.log('\n-- sample TKB joined --')
const t = await c.query(`select l.ten_lop, l.ngay_khai_giang, t.thu, t.hieu_luc_tu, t.hieu_luc_den,
 (select count(*) from hoc_sinh_lop hl where hl.lop_id=l.id and hl.trang_thai='dang_hoc') si
 from thoi_khoa_bieu t join lop l on l.id=t.lop_id order by si desc limit 15`)
console.table(t.rows.map(x=>({lop:x.ten_lop,kg:x.ngay_khai_giang?String(x.ngay_khai_giang).slice(0,10):null,thu:x.thu,hl_tu:String(x.hieu_luc_tu).slice(0,10),hl_den:x.hieu_luc_den?String(x.hieu_luc_den).slice(0,10):null,si:x.si})))
await c.end()
