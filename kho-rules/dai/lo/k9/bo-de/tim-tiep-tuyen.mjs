// tim-tiep-tuyen.mjs — liệt kê câu kho Hình liên quan "hai tiếp tuyến cắt nhau" đang nằm NGOÀI dạng HH00109 (chỉ đọc).
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
const re = '(hai|2) tiếp tuyến|tiếp tuyến thứ hai|cũng là (một )?tiếp tuyến|tiếp tuyến.{0,60}cắt nhau|tính chất (của )?(hai )?tiếp tuyến'
const { rows } = await c.query(
  `select ma_cau, dang_chinh, da_duyet, noi_dung, loi_giai from hinh_hoc_cau_hoi
    where xoa_at is null and dang_chinh <> 'HH00109' and (noi_dung ~* $1 or loi_giai ~* '(hai|2) tiếp tuyến cắt nhau|tính chất (của )?(hai )?tiếp tuyến cắt nhau')
    order by dang_chinh, ma_cau`, [re])
console.log('n =', rows.length)
for (const r of rows) {
  const nd = r.noi_dung.replace(/\n/g, ' ')
  const g = (r.loi_giai ?? '').replace(/\n/g, ' ').match(/.{0,70}(hai tiếp tuyến cắt nhau|tiếp tuyến cắt nhau).{0,70}/i)?.[0] ?? ''
  console.log(`\n### ${r.ma_cau} ${r.dang_chinh}${r.da_duyet ? ' [DUYỆT]' : ''}\n${nd.slice(0, 460)}\n  giải: ${g}`)
}
await c.end()
