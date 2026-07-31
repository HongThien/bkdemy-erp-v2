import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = (s,p)=>c.query(s,p).then(r=>r.rows)

console.log('distinct loai tai_lieu:', (await q("select loai, count(*) n from tai_lieu group by loai order by n desc",[])))

const L = (await q("select id from lop where ten_lop='6S1'",[]))[0]
const B = (await q("select id, ma_buoi from buoi_hoc where lop_id=$1 and ngay=$2",[L.id,'2026-07-28']))[0]

console.log('\nTẤT CẢ tai_lieu của lớp 6S1 (lop_id):')
console.log(await q("select id, loai, ten, ngay, nguon_buoi, hoc_sinh_id from tai_lieu where lop_id=$1 order by ngay nulls first",[L.id]))

console.log('\ntai_lieu có nguon_buoi = buổi 28/07:')
console.log(await q("select id, loai, ten, ngay, lop_id, hoc_sinh_id from tai_lieu where nguon_buoi=$1",[B.id]))

console.log('\ntai_lieu ET (loai=et) ngày 28/07 bất kỳ lớp:')
console.log(await q("select id, loai, ten, ngay, lop_id from tai_lieu where loai='et' and ngay=$1",['2026-07-28']))
await c.end()
