import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q=async(s,p)=>(await c.query(s,p)).rows
const b=(await q(`select b.id from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop='9A2' and b.loai='thuong' order by b.ngay desc limit 1`))[0]
for(const ph of ['ingame','et']){ console.log(`\n9A2 ${ph}:`)
  for(const r of await q(`select n.ho_ten, h.delta, x.amount exp from gami_elo_history h join hoc_sinh n on n.id=h.hoc_sinh_id left join gami_exp_ledger x on x.hoc_sinh_id=h.hoc_sinh_id and x.ref_buoi_hoc_id=h.buoi_hoc_id and x.source=$3 where h.buoi_hoc_id=$1 and h.phase=$2 order by h.delta desc`,[b.id,ph,'rank_'+ph]))
    console.log(`  ${r.ho_ten.padEnd(22)} Δ=${r.delta}  +EXP=${r.exp}`) }
await c.end()
