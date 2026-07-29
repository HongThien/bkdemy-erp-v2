import pg from 'pg'; import { readFileSync } from 'fs'
const envf=(f)=>Object.fromEntries(readFileSync(f,'utf8').split('\n').map(l=>l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map(m=>[m[1],m[2].replace(/^["']|["']$/g,'')]))
const E={...envf('.env')}; const c=new pg.Client({connectionString:E.DATABASE_URL}); await c.connect()
const cols=(await c.query("select column_name from information_schema.columns where table_name='tai_lieu' order by ordinal_position")).rows.map(r=>r.column_name)
console.log('cột tai_lieu:', cols.join(', '))
const lopId='20372255-82d8-4ea4-8416-db11bf106f50'
const tl=(await c.query("select id, loai, ngay, created_at from tai_lieu where lop_id=$1 and loai='et' order by ngay",[lopId])).rows
console.log('\ntai_lieu ET của 4A1:', tl.length, 'dòng')
for(const r of tl) console.log(` ngay=${String(r.ngay).slice(0,25)} | id=${r.id}`)
const match=(await c.query("select id, ngay from tai_lieu where lop_id=$1 and loai='et' and ngay='2026-07-14T17:00:00.000Z'",[lopId])).rows
console.log('\nKhớp buổi 15/07:', JSON.stringify(match))
if(match.length){ const caus=(await c.query("select count(*) c from tai_lieu_cau where tai_lieu_id=$1",[match[0].id])).rows; console.log('Số câu:', JSON.stringify(caus)) }
await c.end()
