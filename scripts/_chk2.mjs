import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q=async(s,p)=>(await c.query(s,p)).rows
const b=(await q(`select b.id from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop='9A2' and b.loai='thuong' order by b.ngay desc limit 1`))[0]
for(const ph of ['ingame','et']){ console.log(`9A2 ${ph} — EXP theo điểm thô:`)
  for(const r of await q(`select n.ho_ten, x.amount, (select sum(points) from gami_grades g where g.hoc_sinh_id=h.hoc_sinh_id and g.problem_id in (select id from gami_session_problems where buoi_hoc_id=$1 and phase=$2)) pts from gami_exp_ledger x join hoc_sinh n on n.id=x.hoc_sinh_id join gami_elo_history h on h.hoc_sinh_id=x.hoc_sinh_id and h.buoi_hoc_id=x.ref_buoi_hoc_id and h.phase=$2 where x.ref_buoi_hoc_id=$1 and x.source='rank_'+$2 order by x.amount desc`,[b.id,ph]).catch(()=>[]))
    console.log(`  ${r.ho_ten.padEnd(22)} điểm=${r.pts??0} +EXP=${r.amount}`) }
await c.end()
