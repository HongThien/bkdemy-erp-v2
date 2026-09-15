import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env','utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'') })
await c.connect()
const p = async (t,s)=>{const r=await c.query(s);console.log('\n▸ '+t);r.rows.forEach(x=>console.log('  ',JSON.stringify(x)))}
await p('Index/constraint trên buoi_hoc_hs', `select indexname, indexdef from pg_indexes where tablename='buoi_hoc_hs'`)
await p('Đã từng có HS xếp bù 2 lần cho CÙNG buổi mẹ chưa?', `
  select hoc_sinh_id, bu_cho_buoi_id, count(*) from buoi_hoc_hs
  where bu_cho_buoi_id is not null group by 1,2 having count(*)>1`)
await p('35 ca khong_xep_duoc — tuổi', `
  select k.loai, count(*), min(b.ngay) as cu_nhat
  from bang_khong_bu k join buoi_hoc_hs h on h.id=k.buoi_hoc_hs_id
  join buoi_hoc b on b.id=h.buoi_hoc_id where k.loai='khong_xep_duoc' group by 1`)
await c.end()
