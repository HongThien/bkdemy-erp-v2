import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { ELO } from '../src/gami/config.js'; import { expectedScore } from '../src/gami/elo.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p)=>(await c.query(s,p)).rows
const clamp=(x,l)=>Math.max(-l,Math.min(l,x))

// replay ALL et exactly like recalc_elo.mjs
const rows = await q(`select h.buoi_hoc_id,h.hoc_sinh_id,h.phase,h.actual,h.rank,h.rank_total,b.ngay,l.mon,l.ten_lop
  from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id join lop l on l.id=b.lop_id
  where h.phase='et' order by b.ngay asc, h.buoi_hoc_id asc`)
const evOrder=[]; const evMap=new Map()
for(const r of rows){const k=r.buoi_hoc_id+'|'+r.phase; if(!evMap.has(k)){evMap.set(k,{ten:r.ten_lop,mon:r.mon,ngay:r.ngay,rows:[]});evOrder.push(k)} evMap.get(k).rows.push(r)}
const elo=new Map(); const get=k=>elo.get(k)??1000
const detail=new Map() // evKey -> per student new numbers
for(const k of evOrder){
  const ev=evMap.get(k); const rs=ev.rows; const N=rs.length; if(N<2)continue
  const cap=ELO.RANK_CAP, keyOf=r=>r.hoc_sinh_id+'|'+r.mon
  const mean=rs.reduce((s,r)=>s+get(keyOf(r)),0)/N
  const out=[]
  for(const r of rs){
    const kk=keyOf(r); const Ri=get(kk)
    const others=rs.filter(o=>o!==r).map(o=>get(o.hoc_sinh_id+'|'+o.mon))
    const expected=expectedScore(Ri,others)
    const rankv=clamp((ELO.K*(Number(r.actual)-expected))/(N-1),cap)
    const delta=Math.round(rankv+ELO.PROGRESS_P-ELO.LAMBDA*(Ri-mean))
    out.push({hs:r.hoc_sinh_id,actual:Number(r.actual),Ri,expected,rankv,delta,after:Ri+delta,rank:r.rank})
    elo.set(kk,Ri+delta)
  }
  detail.set(k,{ten:ev.ten,ngay:ev.ngay,out})
}
// find 9A1 ET events
const nine=[...detail.entries()].filter(([k,v])=>v.ten==='9A1').sort((a,b)=>new Date(a[1].ngay)-new Date(b[1].ngay))
const last=nine[nine.length-1]
console.log(`9A1 có ${nine.length} sự kiện ET. Buổi cuối: ${new Date(last[1].ngay).toLocaleDateString('vi')}\n`)
// names + current stored delta for this buoi
const buoiId=last[0].split('|')[0]
const names=Object.fromEntries((await q(`select id, ho_ten from hoc_sinh where id = any($1)`,[last[1].out.map(o=>o.hs)])).map(r=>[r.id,r.ho_ten]))
const cur=Object.fromEntries((await q(`select hoc_sinh_id,delta,elo_before,elo_after from gami_elo_history where buoi_hoc_id=$1 and phase='et'`,[buoiId])).map(r=>[r.hoc_sinh_id,r]))
const sorted=[...last[1].out].sort((a,b)=>b.actual-a.actual||b.after-a.after)
console.log('HS'.padEnd(20),'A'.padStart(5),'Ebef'.padStart(6),'E'.padStart(6),'rank'.padStart(6),'Δmới'.padStart(6),'Elo→'.padStart(6),'| Δcũ(DB)'.padStart(9))
for(const o of sorted){
  const cu=cur[o.hs]
  console.log((names[o.hs]||o.hs).slice(0,20).padEnd(20),String(o.actual).padStart(5),String(o.Ri).padStart(6),o.expected.toFixed(2).padStart(6),o.rankv.toFixed(1).padStart(6),((o.delta>=0?'+':'')+o.delta).padStart(6),String(o.after).padStart(6),'|',cu?((cu.delta>=0?'+':'')+cu.delta+' ('+cu.elo_before+'→'+cu.elo_after+')'):'—')
}
await c.end()
