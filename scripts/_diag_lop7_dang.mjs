import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: 20000 })
await c.connect()
const r1 = await c.query(`select distinct khoi from dai_ban_do order by khoi`)
console.log('khoi values:', r1.rows.map((r) => r.khoi))
const r2 = await c.query(`select ma_dang, ten_chu_de, ten_chuyen_de, ten_dang, muc_do, bac_toi_thieu, mo_ta_ngan from dai_ban_do where khoi='7' order by ma_dang`)
console.log('lop7 dang count:', r2.rows.length)
console.log(JSON.stringify(r2.rows, null, 1))
await c.end()
