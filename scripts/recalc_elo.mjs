// RECALC ELO toàn bộ = replay pure-derive (Mức 2). Per-môn, cộng dồn xuyên lớp theo NGÀY.
// • Elo SUY từ điểm thô (gami_grades) qua replayEloEvents → computeEloUpdate (config K30/cap20/P10/λ0). MỘT nguồn công thức.
// • TẠM chỉ ET. Ingame + MT BỊ LOẠI (MT chờ điểm thang 10; ingame chờ data ổn định).
// • Giữ `rank`/`rank_total` (hạng theo điểm thô, EXP dùng). KHÔNG đụng gami_exp_ledger.
// Dry-run mặc định (chỉ backup + in số). Ghi thật: thêm cờ  --write
import { readFileSync, writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { replayEloEvents } from '../src/gami/replay.js'
import { seasonOf, seasonStartUtc } from '../src/gami/season.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const WRITE = process.argv.includes('--write')
// SEASON-AWARE: chỉ replay ET của MÙA hiện tại (mặc định), để recalc TÁI TẠO đúng hard-reset đầu mùa
// (không kéo data mùa cũ/chạy-thử tháng 7 trở lại). `--all-time` để replay xuyên mùa như đời cũ nếu cần.
const ALL_TIME = process.argv.includes('--all-time')
const vnToday = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
const SEASON_START = seasonStartUtc(seasonOf(vnToday)).slice(0, 10) // 'YYYY-MM-DD' đầu mùa (giờ VN)
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// ── BACKUP (đọc) ──
const bkElo = await q(`select * from gami_elo`)
const bkHist = await q(`select * from gami_elo_history`)
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
writeFileSync(join(root, `scripts/_backup_gami_elo_${stamp}.json`), JSON.stringify(bkElo))
writeFileSync(join(root, `scripts/_backup_gami_elo_history_${stamp}.json`), JSON.stringify(bkHist))
const ingameCnt = bkHist.filter(h => h.phase === 'ingame').length
console.log(`BACKUP → scripts/_backup_gami_elo_${stamp}.json (${bkElo.length} dòng) · _history (${bkHist.length} dòng)`)
console.log(`Trong history cũ: ingame=${ingameCnt} · et=${bkHist.filter(h=>h.phase==='et').length} · mt=${bkHist.filter(h=>h.phase==='mt').length}`)

// ── ĐỌC facts: participants (roster từng chấm, từ history cũ) + ĐIỂM THÔ (gami_grades) ──
// Lọc theo mùa (b.ngay >= đầu mùa) trừ khi --all-time. Đầu mùa '2026-27' = 2026-08-01.
console.log(`Phạm vi replay: ${ALL_TIME ? 'TOÀN THỜI GIAN (--all-time)' : `mùa hiện tại (ET từ ${SEASON_START})`}`)
const rows = await q(`select h.buoi_hoc_id, h.hoc_sinh_id, h.rank, h.rank_total, b.ngay, l.mon
  from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id join lop l on l.id=b.lop_id
  where h.phase = 'et' ${ALL_TIME ? '' : 'and b.ngay >= $1'} order by b.ngay asc, h.buoi_hoc_id asc`,
  ALL_TIME ? undefined : [SEASON_START])
const graw = await q(`select p.buoi_hoc_id, g.hoc_sinh_id, sum(g.points)::float pts
  from gami_grades g join gami_session_problems p on p.id=g.problem_id
  where p.phase='et' group by p.buoi_hoc_id, g.hoc_sinh_id`)
const pts = new Map(graw.map(r => [r.buoi_hoc_id + '|' + r.hoc_sinh_id, Number(r.pts)]))

const evOrder = []; const evMap = new Map(); const rankInfo = new Map()
for (const r of rows) {
  if (!evMap.has(r.buoi_hoc_id)) { evMap.set(r.buoi_hoc_id, { buoiHocId: r.buoi_hoc_id, mon: r.mon, isMT: false, students: [] }); evOrder.push(r.buoi_hoc_id) }
  evMap.get(r.buoi_hoc_id).students.push({ studentId: r.hoc_sinh_id, points: pts.get(r.buoi_hoc_id + '|' + r.hoc_sinh_id) ?? 0 })
  rankInfo.set(r.buoi_hoc_id + '|' + r.hoc_sinh_id, { rank: r.rank, rank_total: r.rank_total })
}
const events = evOrder.map(k => evMap.get(k))

// ── REPLAY qua hàm DERIVE DUY NHẤT (dùng chung với app) ──
const { history, finalElo: eloMap } = replayEloEvents(events)
const newHist = history.map(h => {
  const ri = rankInfo.get(h.buoiHocId + '|' + h.studentId) ?? {}
  return { hoc_sinh_id: h.studentId, buoi_hoc_id: h.buoiHocId, phase: 'et', mon: h.mon,
    elo_before: h.eloBefore, expected: h.expected, actual: h.actual, delta: h.delta, elo_after: h.eloAfter,
    rank: ri.rank ?? null, rank_total: ri.rank_total ?? null }
})

// gami_elo mới: mọi (hs×mon) từng có dòng elo → set theo replay (mặc định 1000 nếu không còn ET)
const finalElo = new Map()
for (const e of bkElo) finalElo.set(e.hoc_sinh_id + '|' + e.mon, 1000)  // reset nền
for (const [k, v] of eloMap) finalElo.set(k, Math.round(v))

// ── SUMMARY ──
console.log(`\nSự kiện ET replay: ${evOrder.length} · dòng history mới: ${newHist.length} · (HS×môn) có Elo: ${eloMap.size}`)
console.log(`Sẽ XOÁ toàn bộ ${bkHist.length} dòng history cũ (gồm ${ingameCnt} ingame) → thay bằng ${newHist.length} dòng ET/MT mới.`)
console.log(`gami_elo: reset ${bkElo.length} dòng về 1000 rồi set ${eloMap.size} dòng theo replay. gami_exp_ledger KHÔNG đụng.`)
// đối chiếu vài lớp
for (const ten of ['9A1', '9A2', '9S1']) {
  const lop = (await q(`select id, mon from lop where ten_lop=$1`, [ten]))[0]; if (!lop) continue
  const ids = (await q(`select distinct h.hoc_sinh_id from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id where b.lop_id=$1 and h.phase in ('et','mt')`, [lop.id])).map(r => r.hoc_sinh_id)
  const arr = ids.map(id => finalElo.get(id + '|' + lop.mon) ?? 1000).sort((a, z) => z - a)
  console.log(`  ${ten}: Elo cuối ${arr.length} HS — top ${arr[0]} · đáy ${arr[arr.length-1]} · TB ${Math.round(arr.reduce((s,x)=>s+x,0)/arr.length)}`)
}

if (!WRITE) { console.log('\n[DRY-RUN] chưa ghi. Thêm --write để áp.'); await c.end(); process.exit(0) }

// ── WRITE (transaction) ──
try {
  await c.query('begin')
  await c.query('delete from gami_elo_history')
  for (const h of newHist) await c.query(
    `insert into gami_elo_history(hoc_sinh_id,buoi_hoc_id,phase,mon,elo_before,expected,actual,delta,elo_after,rank,rank_total)
     values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [h.hoc_sinh_id, h.buoi_hoc_id, h.phase, h.mon, h.elo_before, h.expected, h.actual, h.delta, h.elo_after, h.rank, h.rank_total])
  for (const [k, v] of finalElo) { const [hs, mon] = k.split('|'); await c.query(
    `update gami_elo set elo=$1, updated_at=now() where hoc_sinh_id=$2 and mon=$3`, [v, hs, mon]) }
  await c.query('commit')
  console.log(`\n✅ GHI XONG: ${newHist.length} dòng history · ${finalElo.size} dòng gami_elo.`)
} catch (e) { await c.query('rollback'); console.error('❌ ROLLBACK:', e.message); process.exitCode = 1 }
finally { await c.end() }
