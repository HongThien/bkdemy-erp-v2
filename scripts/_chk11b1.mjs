import pg from 'pg'; import { readFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const lop = (await c.query("select id from lop where ten_lop='11B1'")).rows[0]
const all = (await c.query(`select bt.id, bt.nguon_tai_lieu_id, bt.created_at,
  (select count(*) from bai_test_cau x where x.bai_test_id=bt.id) ncau,
  (select count(*) from bai_lam bl where bl.bai_test_id=bt.id) nlam
  from bai_test bt where bt.lop_id=$1 order by bt.created_at`, [lop.id])).rows
console.log('bai_test cho 11B1:')
all.forEach(x=>console.log(' ', x.id.slice(0,8), 'nguon:', x.nguon_tai_lieu_id?x.nguon_tai_lieu_id.slice(0,8):'NULL(mồ côi)', '·', x.ncau,'câu ·', x.nlam,'bài làm ·', String(x.created_at).slice(0,19)))
await c.end()
