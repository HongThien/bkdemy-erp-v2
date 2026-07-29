// TEST LOGIC ELO trên DATA THẬT — chạy engine THẬT (computeEloUpdate) qua toàn bộ ET,
// kiểm bất biến + đối chiếu số đang lưu. KHÔNG ghi gì (read-only).
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { ELO } from '../src/gami/config.js'
import { computeEloUpdate, expectedScore, actualScore } from '../src/gami/elo.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root,'.env'),'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s,p)=>(await c.query(s,p)).rows

// ── sự kiện ET + số đang lưu (elo_before/actual/delta) theo ngày ──
const rows = await q(`select h.buoi_hoc_id, h.hoc_sinh_id, h.actual s_actual, h.expected s_expected, h.delta s_delta,
    h.elo_before s_before, b.ngay, l.mon, l.ten_lop
  from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id join lop l on l.id=b.lop_id
  where h.phase='et' order by b.ngay asc, h.buoi_hoc_id asc`)
// ── điểm thô ET per (buoi, hs) = Σ points grade của phase et ──
const graw = await q(`select p.buoi_hoc_id, g.hoc_sinh_id, sum(g.points)::float pts
  from gami_grades g join gami_session_problems p on p.id=g.problem_id
  where p.phase='et' group by p.buoi_hoc_id, g.hoc_sinh_id`)
const rawMap = new Map(graw.map(r=>[r.buoi_hoc_id+'|'+r.hoc_sinh_id, Number(r.pts)]))

const evOrder=[]; const evMap=new Map()
for(const r of rows){ const k=r.buoi_hoc_id; if(!evMap.has(k)){evMap.set(k,{ten:r.ten_lop,mon:r.mon,ngay:r.ngay,rows:[]}); evOrder.push(k)} evMap.get(k).rows.push(r) }

const elo=new Map(); const get=k=>elo.get(k)??1000
const clampRank=(x,l)=>Math.max(-l,Math.min(l,x))

// counters
let nEv=0, nStu=0
let deltaMatch=0, deltaMiss=0, beforeDiverge=0; const deltaMissEx=[]
let actualMatch=0, actualMiss=0; const actualMissEx=[]
let capHits=0, formulaDiff=0, monoViol_nolam=0, topNeg_lam=0, topNeg_nolam=0, anyNeg_lam=0, anyNeg_nolam=0
const sessSumDelta=[]              // Σdelta mỗi buổi (kiểm lạm phát ~N·P)
let zeroSumMaxErr=0                // max |Σ(actual-expected)| — phải ~0
const fullTie=[]                   // buổi cả lớp cùng điểm
let underdogPairs=0, underdogViol=0        // cùng điểm thô: elo thấp hơn phải Δ >= elo cao hơn
let monoPairs=0, monoViol=0; const monoEx=[]                // điểm thô cao hơn phải Δ >= (bỏ qua khi lệch do làm tròn 1)

for(const k of evOrder){
  const ev=evMap.get(k); const rs=ev.rows; const N=rs.length; if(N<2) continue
  nEv++
  const keyOf=r=>r.hoc_sinh_id+'|'+ev.mon
  // build students cho engine THẬT: elo=replay-before, points=điểm thô
  const students = rs.map(r=>({ studentId:r.hoc_sinh_id, elo:get(keyOf(r)), points: rawMap.get(k+'|'+r.hoc_sinh_id) ?? 0 }))
  const updates = computeEloUpdate(students, { isMT:false, classSize:N })
  const uMap = new Map(updates.map(u=>[u.studentId,u]))
  const mean = students.reduce((s,o)=>s+o.elo,0)/N
  // ── KIỂM #1 SẠCH: engine vs recalc-inline trên CÙNG input (Ri, mean, actual đều từ đây) ──
  for(const s of students){
    const others = students.filter(o=>o!==s)
    const expected = expectedScore(s.elo, others.map(o=>o.elo))
    const actual = actualScore(s.points, others.map(o=>o.points))
    const rankIn = clampRank((ELO.K*(actual-expected))/(N-1), ELO.RANK_CAP)
    const inlineDelta = Math.round(rankIn + ELO.PROGRESS_P - ELO.LAMBDA*(s.elo-mean))
    if(inlineDelta !== uMap.get(s.studentId).delta) formulaDiff++
  }
  // zero-sum kỹ năng
  const zs = updates.reduce((s,u)=>s+(u.actual-u.expected),0); zeroSumMaxErr=Math.max(zeroSumMaxErr,Math.abs(zs))
  let sumD=0
  const allSameRaw = students.every(s=>s.points===students[0].points)
  for(const r of rs){
    nStu++
    const u=uMap.get(r.hoc_sinh_id); const Ri=get(keyOf(r))
    sumD+=u.delta
    // đối chiếu delta engine THẬT vs số ĐANG LƯU (recalc-inline)
    if(u.delta===Number(r.s_delta)) deltaMatch++; else { deltaMiss++; const beforeLech = Ri !== Number(r.s_before); if(beforeLech) beforeDiverge++; if(deltaMissEx.length<8) deltaMissEx.push(`${ev.ten} ${new Date(ev.ngay).toLocaleDateString('vi')} eloBefore replay=${Ri} luu=${r.s_before} ${beforeLech?'‹LỆCH before›':'‹before KHỚP → formula/round›'} | Δ engine=${u.delta} luu=${r.s_delta}`) }
    // đối chiếu actual dựng lại từ điểm thô vs actual đã lưu
    if(Math.abs(u.actual-Number(r.s_actual))<1e-6) actualMatch++; else { actualMiss++; if(actualMissEx.length<6) actualMissEx.push(`${ev.ten} ${new Date(ev.ngay).toLocaleDateString('vi')} hs=${r.hoc_sinh_id.slice(0,8)} dungLai=${u.actual} luu=${r.s_actual} pts=${rawMap.get(k+'|'+r.hoc_sinh_id)}`) }
    // cap
    const rank = clampRank((ELO.K*(u.actual-u.expected))/(N-1), ELO.RANK_CAP)
    if(Math.abs(Math.abs(rank)-ELO.RANK_CAP)<1e-9) capHits++
    elo.set(keyOf(r), Ri+u.delta)
  }
  sessSumDelta.push({sumD, N})
  if(allSameRaw) fullTie.push({ten:ev.ten,ngay:ev.ngay, us:updates.map(u=>({d:u.delta,e:students.find(s=>s.studentId===u.studentId).elo}))})
  // ── COUNTERFACTUAL λ=0: Δ = round(clamp(rank)+P), bỏ kéo-về-mean ──
  const dNoLam = new Map()
  for(const s of students){
    const others = students.filter(o=>o!==s)
    const expected = expectedScore(s.elo, others.map(o=>o.elo))
    const actual = actualScore(s.points, others.map(o=>o.points))
    const rankIn = clampRank((ELO.K*(actual-expected))/(N-1), ELO.RANK_CAP)
    dNoLam.set(s.studentId, Math.round(rankIn + ELO.PROGRESS_P))
  }
  const maxRaw = Math.max(...students.map(s=>s.points))
  for(const s of students){
    if(uMap.get(s.studentId).delta < 0) topNeg_lam += (s.points===maxRaw?1:0), anyNeg_lam++
    if(dNoLam.get(s.studentId) < 0) topNeg_nolam += (s.points===maxRaw?1:0), anyNeg_nolam++
  }
  const a3 = students.map(s=>({raw:s.points, d:dNoLam.get(s.studentId)}))
  for(let i=0;i<a3.length;i++)for(let j=0;j<a3.length;j++){ if(i===j)continue; if(a3[i].raw>a3[j].raw){ if(a3[i].d < a3[j].d - 1) monoViol_nolam++ } }
  // underdog + monotonic (dùng delta engine)
  const arr = rs.map(r=>({raw:rawMap.get(k+'|'+r.hoc_sinh_id)??0, d:uMap.get(r.hoc_sinh_id).delta, e:get(keyOf(r))+0})) // e đã cập nhật; lấy trước thì cần lưu — bỏ qua, dùng students
  const arr2 = students.map(s=>({raw:s.points, d:uMap.get(s.studentId).delta, e:s.elo}))
  for(let i=0;i<arr2.length;i++)for(let j=0;j<arr2.length;j++){ if(i===j)continue
    if(arr2[i].raw===arr2[j].raw && arr2[i].e<arr2[j].e){ underdogPairs++; if(arr2[i].d < arr2[j].d) underdogViol++ }
    if(arr2[i].raw>arr2[j].raw){ monoPairs++; if(arr2[i].d < arr2[j].d - 1){ monoViol++; if(monoEx.length<5) monoEx.push(`${ev.ten} ${new Date(ev.ngay).toLocaleDateString('vi')}: HS-A điểm=${arr2[i].raw} elo=${arr2[i].e}→Δ+${arr2[i].d}  <  HS-B điểm=${arr2[j].raw} elo=${arr2[j].e}→Δ+${arr2[j].d}`) } }
  }
}

const avgSum = sessSumDelta.reduce((s,x)=>s+x.sumD,0)/sessSumDelta.length
const avgPer = sessSumDelta.reduce((s,x)=>s+x.sumD/x.N,0)/sessSumDelta.length
console.log(`\n═══ TEST ENGINE ELO trên ${nEv} buổi ET · ${nStu} lượt (HS×buổi) ═══\n`)
console.log(`[1] Engine THẬT vs số ĐANG LƯU : khớp ${deltaMatch}/${nStu} · lệch ${deltaMiss}`)
console.log(`      trong đó elo_before LỆCH (thứ tự/backdate): ${beforeDiverge}/${deltaMiss}`); if(deltaMiss) deltaMissEx.forEach(e=>console.log('      ⚠ '+e))
console.log(`[1b] KIỂM TRÙNG LẶP — computeEloUpdate vs recalc-inline trên CÙNG input: khác ${formulaDiff}/${nStu} (0 = hai bản công thức TƯƠNG ĐƯƠNG)`)
console.log(`[2] actual dựng-lại-từ-điểm-thô vs actual đã lưu : khớp ${actualMatch} · lệch ${actualMiss}`)
if(actualMiss) actualMissEx.forEach(e=>console.log('      ⚠ '+e))
console.log(`[3] Zero-sum kỹ năng  Σ(actual−expected): max lệch = ${zeroSumMaxErr.toExponential(2)}  (phải ~0)`)
console.log(`[4] Lạm phát: Σdelta/buổi TB = ${avgSum.toFixed(1)}  ·  /HS TB = ${avgPer.toFixed(2)}  (kỳ vọng ≈ P=${ELO.PROGRESS_P})`)
console.log(`[5] Chạm trần ±${ELO.RANK_CAP}: ${capHits}/${nStu} lượt (${(100*capHits/nStu).toFixed(1)}%)  (cao = K quá mạnh / cap quá thấp)`)
console.log(`[6] Underdog (cùng điểm thô → elo thấp Δ≥ elo cao): vi phạm ${underdogViol}/${underdogPairs} cặp`)
console.log(`[7] Đơn điệu (điểm thô cao → Δ cao, cho phép lệch ≤1 do làm tròn): vi phạm ${monoViol}/${monoPairs} cặp`)
if(monoEx.length) monoEx.forEach(e=>console.log('      ↯ '+e));
console.log(`[8] Buổi CẢ LỚP CÙNG ĐIỂM (full tie): ${fullTie.length}`)
for(const t of fullTie.slice(0,3)){
  const s=[...t.us].sort((a,b)=>b.e-a.e)
  console.log(`    ${t.ten} ${new Date(t.ngay).toLocaleDateString('vi')}: `+s.map(x=>`${x.e}→Δ${x.d>=0?'+':''}${x.d}`).join('  '))
}
await c.end()
console.log(`\n═══ COUNTERFACTUAL λ=0 (bỏ kéo-về-mean, giữ K/cap/P) ═══`)
console.log(`[7'] Đơn điệu vi phạm:  λ=0.05 → ${monoViol}  |  λ=0 → ${monoViol_nolam}`)
console.log(`[9] Δ ÂM cho HS ĐIỂM CAO NHẤT buổi:  λ=0.05 → ${topNeg_lam} lượt  |  λ=0 → ${topNeg_nolam} lượt`)
console.log(`[9b] Tổng lượt Δ âm bất kỳ:  λ=0.05 → ${anyNeg_lam}  |  λ=0 → ${anyNeg_nolam}`)
