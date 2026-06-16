// Replay Elo/EXP toàn bộ theo thứ tự thời gian với MODEL MỚI: mỗi buổi snapshot Elo-trước 1 lần,
// cả 2 phase (lớp/ET) tính độc lập từ snapshot đó. Reset rồi dựng lại history+exp+gami_elo. claude_build.
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { computeEloUpdate } from '../src/gami/elo.js'
import { expForRank, rankSession } from '../src/gami/exp.js'
import { RANK_EXP } from '../src/gami/config.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q = async (s,p)=>(await c.query(s,p)).rows
const buois = await q(`select b.id, b.ngay, b.ingame_dong_at, b.et_dong_at, l.mon from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and (b.ingame_dong_at is not null or b.et_dong_at is not null) order by b.ngay asc, b.id asc`)
const elo = new Map() // hs|mon -> {elo, sessions}
const get = (hs,mon)=>{ const k=hs+'|'+mon; if(!elo.has(k)) elo.set(k,{elo:1000,sessions:0}); return elo.get(k) }
const hist=[], exp=[]
for (const b of buois) {
  const mon=b.mon
  const coMat=(await q(`select hoc_sinh_id from buoi_hoc_hs where buoi_hoc_id=$1 and diem_danh='co_mat'`,[b.id])).map(r=>r.hoc_sinh_id)
  if(!coMat.length) continue
  const pre={}, preSess={}; for(const hs of coMat){ const e=get(hs,mon); pre[hs]=e.elo; preSess[hs]=e.sessions }
  const buoiDelta={}; const phases=[]; if(b.ingame_dong_at) phases.push('ingame'); if(b.et_dong_at) phases.push('et')
  for(const phase of phases){
    const pids=(await q(`select id from gami_session_problems where buoi_hoc_id=$1 and phase=$2`,[b.id,phase])).map(r=>r.id)
    const raw={}; for(const hs of coMat) raw[hs]=0
    if(pids.length){ for(const g of await q(`select hoc_sinh_id, points from gami_grades where problem_id = any($1)`,[pids])) if(g.hoc_sinh_id in raw) raw[g.hoc_sinh_id]+=Number(g.points) }
    const students=coMat.map(hs=>({studentId:hs, elo:pre[hs], points:raw[hs], sessionsPlayed:preSess[hs]}))
    const ups=computeEloUpdate(students,{isMT:false,classSize:coMat.length})
    for(const u of ups){ hist.push([u.studentId,b.id,phase,mon,u.eloBefore,u.expected,u.actual,u.delta,u.eloAfter]); buoiDelta[u.studentId]=(buoiDelta[u.studentId]||0)+u.delta }
    const ranks=rankSession(ups.map(u=>({studentId:u.studentId, rawPoints:raw[u.studentId], eloDelta:u.delta})))
    const grp=new Map(); for(const r of ranks){ const p=raw[r.studentId]; if(!grp.has(p))grp.set(p,[]); grp.get(p).push(expForRank(r.rank,coMat.length,RANK_EXP[phase])) }
    const expByPts=new Map(); for(const [p,arr] of grp) expByPts.set(p, Math.round(arr.reduce((s,x)=>s+x,0)/arr.length))
    for(const r of ranks) exp.push([r.studentId,'rank_'+phase,expByPts.get(raw[r.studentId])??0,b.id,mon])
  }
  for(const hs of coMat){ const e=get(hs,mon); e.elo+=(buoiDelta[hs]||0); if(b.ingame_dong_at) e.sessions+=1 }
}
try{
  await c.query('begin')
  await c.query(`delete from gami_elo_history`)
  await c.query(`delete from gami_exp_ledger where source in ('rank_ingame','rank_et','rank_mt')`)
  await c.query(`update gami_elo set elo=1000, sessions_played=0, updated_at=now()`)
  for(const h of hist) await c.query(`insert into gami_elo_history(hoc_sinh_id,buoi_hoc_id,phase,mon,elo_before,expected,actual,delta,elo_after) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`,h)
  for(const x of exp) await c.query(`insert into gami_exp_ledger(hoc_sinh_id,source,amount,ref_buoi_hoc_id,mon) values($1,$2,$3,$4,$5)`,x)
  for(const [k,e] of elo){ const [hs,mon]=k.split('|'); await c.query(`insert into gami_elo(hoc_sinh_id,mon,elo,sessions_played) values($1,$2,$3,$4) on conflict (hoc_sinh_id,mon) do update set elo=excluded.elo, sessions_played=excluded.sessions_played, updated_at=now()`,[hs,mon,e.elo,e.sessions]) }
  await c.query('commit')
  console.log(`Replay xong: ${buois.length} buổi · ${hist.length} dòng history · ${exp.length} dòng exp · ${elo.size} (HS×môn).`)
}catch(e){ await c.query('rollback'); console.error('❌',e.message); process.exitCode=1 } finally { await c.end() }
