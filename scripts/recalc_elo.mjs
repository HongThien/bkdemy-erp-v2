// RECALC ELO toàn bộ theo engine MỚI (K30/cap20/P10/λ0.05). Per-môn, cộng dồn xuyên lớp theo NGÀY.
// • TẠM chỉ ET vào Elo. Ingame + MT BỊ LOẠI (MT chờ điểm chi tiết thang 10; ingame chờ data ổn định).
// • Giữ nguyên `actual`/`rank`/`rank_total` (do điểm thô, độc lập thuật toán) — chỉ tính lại expected/delta/elo_before/after.
// • KHÔNG đụng gami_exp_ledger (EXP/điểm game giữ nguyên).
// Dry-run mặc định (chỉ backup + in số). Ghi thật: thêm cờ  --write
import { readFileSync, writeFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { ELO } from '../src/gami/config.js'; import { expectedScore } from '../src/gami/elo.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const WRITE = process.argv.includes('--write')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const clamp = (x, l) => Math.max(-l, Math.min(l, x))

// ── BACKUP (đọc) ──
const bkElo = await q(`select * from gami_elo`)
const bkHist = await q(`select * from gami_elo_history`)
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
writeFileSync(join(root, `scripts/_backup_gami_elo_${stamp}.json`), JSON.stringify(bkElo))
writeFileSync(join(root, `scripts/_backup_gami_elo_history_${stamp}.json`), JSON.stringify(bkHist))
const ingameCnt = bkHist.filter(h => h.phase === 'ingame').length
console.log(`BACKUP → scripts/_backup_gami_elo_${stamp}.json (${bkElo.length} dòng) · _history (${bkHist.length} dòng)`)
console.log(`Trong history cũ: ingame=${ingameCnt} · et=${bkHist.filter(h=>h.phase==='et').length} · mt=${bkHist.filter(h=>h.phase==='mt').length}`)

// ── ĐỌC sự kiện ET/MT (measurement facts) theo NGÀY ──
const rows = await q(`select h.buoi_hoc_id, h.hoc_sinh_id, h.phase, h.actual, h.rank, h.rank_total, b.ngay, l.mon
  from gami_elo_history h join buoi_hoc b on b.id=h.buoi_hoc_id join lop l on l.id=b.lop_id
  where h.phase = 'et' order by b.ngay asc, h.buoi_hoc_id asc`)
const evKey = r => r.buoi_hoc_id + '|' + r.phase
const evOrder = []; const evMap = new Map()
for (const r of rows) { const k = evKey(r); if (!evMap.has(k)) { evMap.set(k, { mon: r.mon, phase: r.phase, rows: [] }); evOrder.push(k) } evMap.get(k).rows.push(r) }

// ── REPLAY ──
const elo = new Map(); const get = k => elo.get(k) ?? 1000            // key = hs|mon
const newHist = []                                                    // dòng history mới
for (const k of evOrder) {
  const ev = evMap.get(k); const rs = ev.rows; const N = rs.length; if (N < 2) continue
  const w = ev.phase === 'mt' ? ELO.MT_WEIGHT : 1
  const cap = ELO.RANK_CAP * w
  const keyOf = r => r.hoc_sinh_id + '|' + r.mon
  const snap = new Map(rs.map((r) => [keyOf(r), get(keyOf(r))]))  // FIX: mốc elo ĐẦU buổi — mọi HS chấm trên cùng snapshot (khớp computeEloUpdate). Trước đây get() bị elo.set mid-loop làm nhiễm expected.
  const mean = [...snap.values()].reduce((s, v) => s + v, 0) / N
  for (const r of rs) {
    const kk = keyOf(r); const Ri = snap.get(kk)
    const others = rs.filter(o => o !== r).map(o => snap.get(keyOf(o)))
    const expected = expectedScore(Ri, others)
    const rank = clamp((w * ELO.K * (Number(r.actual) - expected)) / (N - 1), cap)
    const delta = Math.round(rank + ELO.PROGRESS_P - ELO.LAMBDA * (Ri - mean))
    newHist.push({ hoc_sinh_id: r.hoc_sinh_id, buoi_hoc_id: r.buoi_hoc_id, phase: r.phase, mon: r.mon,
      elo_before: Ri, expected, actual: Number(r.actual), delta, elo_after: Ri + delta, rank: r.rank, rank_total: r.rank_total })
    elo.set(kk, Ri + delta)
  }
}
// gami_elo mới: mọi (hs×mon) từng có dòng elo → set về giá trị replay (mặc định 1000 nếu không còn et/mt)
const finalElo = new Map()
for (const e of bkElo) finalElo.set(e.hoc_sinh_id + '|' + e.mon, 1000)  // reset nền
for (const [k, v] of elo) finalElo.set(k, Math.round(v))

// ── SUMMARY ──
console.log(`\nSự kiện ET replay: ${evOrder.length} · dòng history mới: ${newHist.length} · (HS×môn) có Elo: ${elo.size}`)
console.log(`Sẽ XOÁ toàn bộ ${bkHist.length} dòng history cũ (gồm ${ingameCnt} ingame) → thay bằng ${newHist.length} dòng ET/MT mới.`)
console.log(`gami_elo: reset ${bkElo.length} dòng về 1000 rồi set ${elo.size} dòng theo replay. gami_exp_ledger KHÔNG đụng.`)
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
