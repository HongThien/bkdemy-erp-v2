import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q=async(s,p)=>(await c.query(s,p)).rows
const b=(await q(`select b.id from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop='9A2' and b.loai='thuong' order by b.ngay desc limit 1`))[0]
for(const ph of ['ingame','et']){ console.log(`\n9A2 ${ph}:`)
  for(const r of await q(`select n.ho_ten, h.elo_before, h.expected, h.actual, h.delta, h.elo_after from gami_elo_history h join hoc_sinh n on n.id=h.hoc_sinh_id where h.buoi_hoc_id=$1 and h.phase=$2 order by h.elo_after desc`,[b.id,ph]))
    console.log(`  ${r.ho_ten.padEnd(22)} before ${r.elo_before} E=${Number(r.expected).toFixed(2)} A=${Number(r.actual).toFixed(1)} Δ=${r.delta} → ${r.elo_after}`) }
await c.end()
