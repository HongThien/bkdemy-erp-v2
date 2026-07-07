import { readFileSync } from 'fs'
import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const exist = await c.query(`select id from team where ma='core'`)
if (exist.rows.length) {
  console.log('Team "core" đã có sẵn, id=', exist.rows[0].id)
} else {
  const r = await c.query(`insert into team(ma,ten,thu_tu) values('core','Core team',7) returning id,ma,ten,thu_tu`)
  console.log('Đã tạo team:', JSON.stringify(r.rows[0]))
}
await c.end()
