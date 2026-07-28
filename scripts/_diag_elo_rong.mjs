// Phiên Elo TRỐNG = có gami_elo_history nhưng KHÔNG có gami_grades nào của phase đó.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({connectionString:url, ssl:{rejectUnauthorized:false}}); await c.connect()
const q = async (s,p) => (await c.query(s,p)).rows

const rows = await q(`
  select h.buoi_hoc_id, h.phase, h.mon, l.ten_lop, b.ngay::text ngay, b.loai,
         count(*) n_hs, sum(abs(h.delta))::int tong_bien_dong,
         (select count(*) from gami_grades g join gami_session_problems p on p.id=g.problem_id
          where p.buoi_hoc_id=h.buoi_hoc_id and p.phase=h.phase) n_diem
  from gami_elo_history h
  join buoi_hoc b on b.id=h.buoi_hoc_id join lop l on l.id=b.lop_id
  group by h.buoi_hoc_id, h.phase, h.mon, l.ten_lop, b.ngay, b.loai
  order by b.ngay`)
const rong = rows.filter(r=>Number(r.n_diem)===0)
console.log(`Tổng phiên Elo đã tính: ${rows.length} · TRỐNG (0 dòng chấm): ${rong.length}`)
const theoPhase = {}
rong.forEach(r=>{ theoPhase[r.phase]=(theoPhase[r.phase]??0)+1 })
console.log('  theo phase:', JSON.stringify(theoPhase))
console.log(`  số dòng gami_elo_history dính: ${rong.reduce((s,r)=>s+Number(r.n_hs),0)}`)
console.log(`  tổng biến động Elo vô nghĩa: ${rong.reduce((s,r)=>s+Number(r.tong_bien_dong),0)} điểm\n`)
console.log('lớp    ngày        phase  HS  |Δ|tổng')
rong.slice(0,25).forEach(r=>console.log(`${r.ten_lop.padEnd(6)} ${r.ngay} ${r.phase.padEnd(6)} ${String(r.n_hs).padStart(3)} ${String(r.tong_bien_dong).padStart(6)}`))
if (rong.length>25) console.log(`… và ${rong.length-25} phiên nữa`)

// Ảnh hưởng: HS nào lệch nhiều nhất
const hs = await q(`
  select h.hoc_sinh_id, s.ho_ten, h.mon, sum(h.delta)::int delta_rong
  from gami_elo_history h join hoc_sinh s on s.id=h.hoc_sinh_id
  where not exists (select 1 from gami_grades g join gami_session_problems p on p.id=g.problem_id
                    where p.buoi_hoc_id=h.buoi_hoc_id and p.phase=h.phase)
  group by 1,2,3 order by abs(sum(h.delta)) desc limit 10`)
console.log('\nHS lệch nhiều nhất do phiên trống:')
hs.forEach(r=>console.log(`  ${r.ho_ten} (${r.mon}): ${r.delta_rong>0?'+':''}${r.delta_rong} Elo`))
await c.end()
