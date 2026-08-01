// RESET SEASON — chuyển đợt CHẠY THỬ (tháng 7/2026, mùa '2025-26') sang MÙA THẬT '2026-27' (bắt đầu 1/8).
// Backup toàn bộ ELO/EXP tháng 7 ra JSON → HARD RESET ELO về 1000 → xoá lịch sử ELO (đã backup).
// KHÔNG đụng gami_exp_ledger (đã backup; season-window đầu mùa 1/8 tự loại July khỏi Level/EXP-tháng mùa mới).
//
// Dry-run mặc định (chỉ BACKUP + in số sẽ đổi). Ghi thật: thêm cờ  --write
//   node scripts/reset_season_2026-27.mjs            # xem trước (vẫn ghi file backup)
//   node scripts/reset_season_2026-27.mjs --write    # áp reset (sau khi CEO gật)
import { readFileSync, writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const WRITE = process.argv.includes('--write')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// ── BACKUP (đọc toàn bộ 3 bảng gami) ──
const bkElo = await q(`select * from gami_elo`)
const bkHist = await q(`select * from gami_elo_history`)
const bkExp = await q(`select * from gami_exp_ledger`)
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const dump = (name, data) => { const f = `scripts/_backup_${name}_${stamp}.json`; writeFileSync(join(root, f), JSON.stringify(data)); return f }
const fElo = dump('gami_elo', bkElo), fHist = dump('gami_elo_history', bkHist), fExp = dump('gami_exp_ledger', bkExp)
console.log('── BACKUP (đợt tháng 7 / mùa 2025-26) ──')
console.log(`  ${fElo}   (${bkElo.length} dòng gami_elo)`)
console.log(`  ${fHist}   (${bkHist.length} dòng gami_elo_history)`)
console.log(`  ${fExp}   (${bkExp.length} dòng gami_exp_ledger)`)

// ── SUMMARY: Elo hiện tại vài lớp (trước reset) để đối chiếu ──
console.log('\n── Elo HIỆN TẠI (trước reset) — vài lớp ──')
for (const ten of ['9A1', '9A2', '9S1']) {
  const lop = (await q(`select id, mon from lop where ten_lop=$1`, [ten]))[0]; if (!lop) continue
  const ids = (await q(`select distinct h.hoc_sinh_id from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id where b.lop_id=$1 and h.phase in ('et','mt')`, [lop.id])).map(r => r.hoc_sinh_id)
  if (!ids.length) { console.log(`  ${ten}: chưa có Elo`); continue }
  const eloBy = new Map(bkElo.filter(e => e.mon === lop.mon).map(e => [e.hoc_sinh_id, Number(e.elo)]))
  const arr = ids.map(id => eloBy.get(id) ?? 1000).sort((a, z) => z - a)
  console.log(`  ${ten}: ${arr.length} HS — top ${arr[0]} · đáy ${arr[arr.length - 1]} · TB ${Math.round(arr.reduce((s, x) => s + x, 0) / arr.length)}`)
}

console.log('\n── SẼ LÀM khi --write ──')
console.log(`  1) UPDATE gami_elo → elo=1000, sessions_played=0  (${bkElo.length} dòng, mọi HS về mốc gốc)`)
console.log(`  2) DELETE gami_elo_history                          (${bkHist.length} dòng — data thử tháng 7, ĐÃ backup)`)
console.log(`  3) gami_exp_ledger: GIỮ NGUYÊN (${bkExp.length} dòng — đã backup; July tự bị season-window 1/8 loại khỏi Level/EXP-tháng mùa mới)`)

if (!WRITE) { console.log('\n[DRY-RUN] chưa ghi gì (ngoài file backup). Thêm --write để áp reset.'); await c.end(); process.exit(0) }

// ── WRITE (transaction) ──
try {
  await c.query('begin')
  const u = await c.query(`update gami_elo set elo=1000, sessions_played=0, updated_at=now()`)
  const d = await c.query(`delete from gami_elo_history`)
  await c.query('commit')
  console.log(`\n✅ RESET XONG: gami_elo ${u.rowCount} dòng về 1000 · xoá ${d.rowCount} dòng gami_elo_history.`)
  console.log(`   Mùa '2026-27' bắt đầu phẳng từ 1/8. Backup mùa cũ: ${fElo} · ${fHist} · ${fExp}.`)
} catch (e) { await c.query('rollback'); console.error('❌ ROLLBACK:', e.message); process.exitCode = 1 }
finally { await c.end() }
