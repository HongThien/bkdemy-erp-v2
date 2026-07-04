import pg from 'pg'; import { readFileSync } from 'fs'
const url = readFileSync('.env','utf8').split('\n').find(l=>l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()
const lop = (await c.query("select id from lop where ten_lop='11B1'")).rows[0]
const d = await c.query('delete from bai_test where lop_id=$1 and nguon_tai_lieu_id is null returning id', [lop.id])
console.log('xoá', d.rowCount, 'bai_test mồ côi (kèm bài làm demo cũ)')
await c.end()
