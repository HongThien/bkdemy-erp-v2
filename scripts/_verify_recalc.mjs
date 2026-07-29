import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root,'.env'),'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c=new pg.Client({connectionString:url}); await c.connect()
const q=async(s,p)=>(await c.query(s,p)).rows
const ph=await q(`select phase, count(*) n from gami_elo_history group by phase order by phase`)
console.log('history theo phase:', ph.map(r=>`${r.phase}=${r.n}`).join(' · '))
const el=await q(`select count(*) n, sum((elo=1000)::int) base, min(elo) lo, max(elo) hi from gami_elo`)
console.log('gami_elo:', `${el[0].n} dòng · =1000: ${el[0].base} · min ${el[0].lo} · max ${el[0].hi}`)
// 9A1 leaderboard hiện tại, khớp bảng chốt?
const r=await q(`select hs.ho_ten, ge.elo from gami_elo ge join hoc_sinh hs on hs.id=ge.hoc_sinh_id
  join lop_hoc_sinh lhs on lhs.hoc_sinh_id=ge.hoc_sinh_id join lop l on l.id=lhs.lop_id
  where l.ten_lop='9A1' and l.mon=ge.mon order by ge.elo desc limit 20`).catch(e=>[{err:e.message}])
if(r[0]?.err){console.log('9A1 join lỗi (bỏ qua):',r[0].err)}
else{console.log('\n9A1 leaderboard sau recalc:'); r.forEach((x,i)=>console.log(`${String(i+1).padStart(2)}. ${x.ho_ten.padEnd(24)} ${x.elo}`))}
await c.end()
