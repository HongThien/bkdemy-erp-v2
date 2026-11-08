import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
const a = await c.query(`select ma_bai, khoi, ten_bai, thu_tu, da_duyet from hinh_hoc_bai where ten_bai ilike '%ôn thi%' or ten_bai ilike '%cuối kì%' or ten_bai ilike '%cuối kỳ%' or ten_bai ilike '%học kì%' order by khoi, ma_bai`)
console.table(a.rows)
const b = await c.query(`select ma_bai, ten_bai, thu_tu from hinh_hoc_bai where khoi = '9' order by thu_tu, ma_bai`)
console.log(b.rows.map((r) => `${r.ma_bai} ${r.thu_tu} ${r.ten_bai}`).join('\n'))
await c.end()
