// Dọn ET/EXP bị tính 2 lần + recompute gami_elo từ history đã dedup. claude_build, 1 transaction.
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
try {
  await c.query('begin')
  // dedup elo_history: giữ dòng SỚM NHẤT mỗi (hs, buoi, phase)
  const h = await c.query(`delete from gami_elo_history a using gami_elo_history b
    where a.hoc_sinh_id=b.hoc_sinh_id and a.buoi_hoc_id=b.buoi_hoc_id and a.phase=b.phase
      and (a.created_at, a.id) > (b.created_at, b.id)`)
  // dedup exp_ledger: giữ dòng sớm nhất mỗi (hs, ref_buoi, source)
  const x = await c.query(`delete from gami_exp_ledger a using gami_exp_ledger b
    where a.hoc_sinh_id=b.hoc_sinh_id and a.source=b.source
      and coalesce(a.ref_buoi_hoc_id::text,'∅')=coalesce(b.ref_buoi_hoc_id::text,'∅')
      and (a.created_at, a.id) > (b.created_at, b.id)`)
  // recompute elo = 1000 + Σ delta (history đã dedup), sessions = số dòng phase≠et
  const e = await c.query(`update gami_elo e set
    elo = 1000 + coalesce((select sum(h.delta) from gami_elo_history h where h.hoc_sinh_id=e.hoc_sinh_id and h.mon=e.mon),0),
    sessions_played = coalesce((select count(*) from gami_elo_history h where h.hoc_sinh_id=e.hoc_sinh_id and h.mon=e.mon and h.phase<>'et'),0),
    updated_at = now()`)
  await c.query('commit')
  console.log(`Xoá history trùng: ${h.rowCount} · exp trùng: ${x.rowCount} · recompute elo: ${e.rowCount} dòng.`)
} catch (er) { await c.query('rollback'); console.error('❌', er.message); process.exitCode=1 } finally { await c.end() }
