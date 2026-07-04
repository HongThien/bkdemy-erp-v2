import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('.env').DATABASE_URL }); await c.connect()

const lops = (await c.query("select id, ten_lop, mon, khoi from lop where khoi='12' order by ten_lop")).rows
console.log(`Lớp khối 12: ${lops.length}`)
for (const l of lops) console.log(' -', l.ten_lop, l.mon)

const hs = (await c.query(`
  select hs.id, hs.ma_hs, hs.ho_ten, hs.trang_thai
  from hoc_sinh hs
  join hoc_sinh_lop hl on hl.hoc_sinh_id = hs.id and hl.trang_thai='dang_hoc'
  join lop l on l.id = hl.lop_id
  where l.khoi = '12'
  group by hs.id, hs.ma_hs, hs.ho_ten, hs.trang_thai
  order by hs.ma_hs
`)).rows
console.log(`\nHS đang học ở lớp khối 12 (distinct): ${hs.length}`)

const withAcc = (await c.query(`
  select hs.id from hoc_sinh hs
  join hoc_sinh_lop hl on hl.hoc_sinh_id = hs.id and hl.trang_thai='dang_hoc'
  join lop l on l.id = hl.lop_id
  join tai_khoan tk on tk.hoc_sinh_id = hs.id
  where l.khoi = '12'
  group by hs.id
`)).rows
console.log(`Đã có tài khoản: ${withAcc.length} / ${hs.length}`)
console.log('Ví dụ HS chưa có TK:', hs.filter(h => !withAcc.some(w => w.id === h.id)).slice(0, 5).map(h => `${h.ma_hs} ${h.ho_ten}`))
await c.end()
