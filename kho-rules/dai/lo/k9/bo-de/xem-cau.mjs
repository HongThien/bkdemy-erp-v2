import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
const { rows } = await c.query(`select ma_cau, dang_chinh, ma_cum, da_duyet, noi_dung from hinh_hoc_cau_hoi where xoa_at is null and ma_cau = any($1) order by ma_cau`, [process.argv.slice(2)])
for (const r of rows) console.log(`\n### ${r.ma_cau} ${r.dang_chinh} cum=${r.ma_cum ?? '-'} ${r.da_duyet ? 'DUYỆT' : ''}\n${r.noi_dung.replace(/\n/g, ' ')}`)
await c.end()
