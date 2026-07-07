import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()

console.log('-- đếm ma_dang trùng giữa dai_ban_do và khtn_ban_do --')
const overlap = await c.query(`
  select count(*) as so_trung from dai_ban_do d join khtn_ban_do k on k.ma_dang = d.ma_dang
`)
console.table(overlap.rows)

console.log('-- tổng số dòng mỗi bảng --')
const totals = await c.query(`select (select count(*) from dai_ban_do) dai, (select count(*) from khtn_ban_do) khtn`)
console.table(totals.rows)

console.log('-- mẫu ma_dang của khtn_ban_do (10 dòng) --')
const sample = await c.query(`select ma_dang, ten_dang, khoi from khtn_ban_do order by ma_dang limit 10`)
console.table(sample.rows)

console.log('-- gami_session_problems.ma_dang có cột mon không? --')
const cols = await c.query(`select column_name from information_schema.columns where table_name='gami_session_problems'`)
console.table(cols.rows)

await c.end()
