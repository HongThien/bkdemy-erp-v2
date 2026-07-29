import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root,'.env'),'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()
const q=async(s,p)=>(await c.query(s,p)).rows
const r=await q(`
  select ge.sessions_played, coalesce(cnt.n,0) as et_events
  from gami_elo ge
  left join (select hoc_sinh_id, mon, count(*) n from gami_elo_history where phase='et' group by hoc_sinh_id, mon) cnt
    on cnt.hoc_sinh_id=ge.hoc_sinh_id and cnt.mon=ge.mon`)
let match=0, mismatch=0
for(const x of r){ if(Number(x.sessions_played)===Number(x.et_events)) match++; else mismatch++ }
console.log(`Tổng ${r.length} dòng gami_elo · sessions_played==et_count: ${match} · lệch: ${mismatch}`)
const dist=await q(`select sessions_played, count(*) n from gami_elo group by sessions_played order by sessions_played`)
console.log('phân bố sessions_played:', dist.map(d=>`${d.sessions_played}:${d.n}`).join(' '))
await c.end()
