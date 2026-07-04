import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('.env').DATABASE_URL }); await c.connect()
const r = await c.query(`
  select hs.ma_hs, hs.ho_ten from hoc_sinh hs
  join hoc_sinh_lop hl on hl.hoc_sinh_id=hs.id and hl.trang_thai='dang_hoc'
  join lop l on l.id=hl.lop_id where l.ten_lop='12A1' order by hs.ma_hs limit 3
`)
console.log(r.rows)
await c.end()
