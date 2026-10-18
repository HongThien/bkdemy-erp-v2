import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
const { rows } = await c.query(`select ma_cau, nguon, left(replace(noi_dung, chr(10), ' '), 150) nd from hinh_hoc_cau_hoi where xoa_at is null and dang_chinh = 'HH00109' order by ma_cau`)
for (const r of rows) console.log(r.ma_cau, r.nguon, '|', r.nd)
await c.end()
