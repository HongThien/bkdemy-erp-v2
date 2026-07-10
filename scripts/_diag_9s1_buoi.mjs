// Điều tra READ-ONLY: lớp 9S1 — TKB, ngày khai giảng, và buổi_hoc đã mở/hủy quanh 09/07, 21/07.
import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()

console.log('-- lớp 9S1 --')
const lop = await c.query(`select id, ten_lop, mon, khoi, ngay_khai_giang from lop where ten_lop ilike '%9S1%'`)
console.table(lop.rows)

if (lop.rows.length) {
  const lopIds = lop.rows.map(r => r.id)
  console.log('\n-- thời khóa biểu (thu = 2..8, T2..CN) --')
  const tkb = await c.query(`
    select id, lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den
    from thoi_khoa_bieu where lop_id = any($1::uuid[]) order by thu
  `, [lopIds])
  console.table(tkb.rows)

  console.log('\n-- buổi_hoc đã materialize quanh 09/07 và 21/07 (mọi năm) --')
  const bh = await c.query(`
    select id, ma_buoi, lop_id, ngay, thu, trang_thai, loai, ly_do_huy, created_at
    from buoi_hoc
    where lop_id = any($1::uuid[])
      and (to_char(ngay,'DD/MM') = '09/07' or to_char(ngay,'DD/MM') = '21/07')
    order by ngay
  `, [lopIds])
  console.table(bh.rows)
}
await c.end()
