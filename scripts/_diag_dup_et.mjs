import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q = async (s,p)=>(await c.query(s,p)).rows
const hs = (await q(`select id, ho_ten from hoc_sinh where ma_hs='HS0549'`))[0]
console.log('HS:', hs?.ho_ten, hs?.id)
console.log('\n— ELO HISTORY (HS này):')
for (const r of await q(`select h.phase, h.mon, h.elo_before, h.delta, h.elo_after, h.created_at, b.id buoi, l.ten_lop from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id join lop l on l.id=b.lop_id where h.hoc_sinh_id=$1 order by h.created_at`,[hs.id]))
  console.log(`  ${r.ten_lop} ${r.phase} ${r.elo_before}→${r.elo_after}(${r.delta}) @${r.created_at.toISOString().slice(0,19)} buoi=${r.buoi.slice(0,8)}`)
console.log('\n— EXP LEDGER (HS này):')
for (const r of await q(`select source, mon, amount, ref_buoi_hoc_id, created_at from gami_exp_ledger where hoc_sinh_id=$1 order by created_at`,[hs.id]))
  console.log(`  ${r.source} +${r.amount} buoi=${(r.ref_buoi_hoc_id||'').slice(0,8)} @${r.created_at.toISOString().slice(0,19)}`)
// dup check: nhiều history cùng (buoi,phase)?
console.log('\n— DUP (buoi,phase,hs) trong elo_history:')
for (const r of await q(`select b.id buoi, h.phase, count(*) n from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id group by 1,2 having count(*)>1 order by n desc limit 10`,[]))
  console.log(`  buoi=${r.buoi.slice(0,8)} ${r.phase}: ${r.n} dòng (×${r.n} HS hay trùng?)`)
await c.end()
