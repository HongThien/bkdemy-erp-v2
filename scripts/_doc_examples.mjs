// Kéo VÍ DỤ THẬT cho doc training Elo/EXP. Read-only.
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { etRankExp, btvnBaiExp, monthlyBtvnExp } from '../src/gami/exp.js'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const lop = (await q(`select id, mon from lop where ten_lop='9A1' order by (mon='Toán') desc limit 1`))[0]
console.log(`Lớp 9A1 · môn ${lop.mon} · id ${lop.id}\n`)

// ─────────── VÍ DỤ ELO: chọn buổi ET có PHÂN HOÁ điểm thô nhất ───────────
const ets = await q(`select b.id, b.ngay from buoi_hoc b where b.lop_id=$1 and b.loai='thuong' and b.et_dong_at is not null order by b.ngay`, [lop.id])
let best = null
for (const e of ets) {
  const pts = await q(`select g.hoc_sinh_id, sum(g.points)::int p from gami_grades g join gami_session_problems sp on sp.id=g.problem_id where sp.phase='et' and sp.buoi_hoc_id=$1 group by 1`, [e.id])
  const distinct = new Set(pts.map(r => r.p)).size
  if (pts.length >= 8 && (!best || distinct > best.distinct)) best = { ...e, distinct, n: pts.length }
}
console.log(`══ VÍ DỤ ELO — 9A1 buổi ET ${new Date(best.ngay).toLocaleDateString('vi')} (${best.n} HS, ${best.distinct} mức điểm) ══`)
const rows = await q(`
  select hs.ho_ten, eh.elo_before, eh.expected::numeric(6,2) E, eh.actual A, eh.delta, eh.elo_after, eh.rank,
    (select sum(g.points)::int from gami_grades g join gami_session_problems sp on sp.id=g.problem_id
       where sp.phase='et' and sp.buoi_hoc_id=eh.buoi_hoc_id and g.hoc_sinh_id=eh.hoc_sinh_id) tho
  from gami_elo_history eh join hoc_sinh hs on hs.id=eh.hoc_sinh_id
  where eh.buoi_hoc_id=$1 and eh.phase='et' order by eh.rank`, [best.id])
console.log('Hạng | HS                    | thô | Elo trước |   E   |  A   | Δ   | Elo sau')
for (const r of rows) console.log(
  `${String(r.rank).padStart(3)}  | ${r.ho_ten.padEnd(21)} | ${String(r.tho).padStart(3)} | ${String(r.elo_before).padStart(6)}    | ${String(r.e).padStart(5)} | ${String(r.a).padStart(4)} | ${(r.delta>=0?'+':'')+r.delta} | ${r.elo_after}`)

// ─────────── VÍ DỤ EXP: 1 HS 9A1, tháng 7, môn Toán ───────────
const FROM = '2026-07-01', TO = '2026-08-01', YM = '2026-07'
// chọn HS có nhiều BTVN nhất tháng 7
const cand = (await q(`select bk.hoc_sinh_id, count(*) n from btvn_ket_qua bk join buoi_hoc b on b.id=bk.buoi_hoc_id
  where b.lop_id=$1 and b.ngay>=$2 and b.ngay<$3 group by 1 order by n desc limit 1`, [lop.id, FROM, TO]))[0]
const hs = (await q(`select ho_ten from hoc_sinh where id=$1`, [cand.hoc_sinh_id]))[0]
console.log(`\n══ VÍ DỤ EXP — ${hs.ho_ten} · 9A1 · ${lop.mon} · tháng ${YM} ══`)

// ① ET-rank EXP mỗi buổi
const etr = await q(`select b.ngay, eh.rank, eh.rank_total from gami_elo_history eh join buoi_hoc b on b.id=eh.buoi_hoc_id
  where eh.hoc_sinh_id=$1 and eh.phase='et' and eh.mon=$2 and b.ngay>=$3 and b.ngay<$4 order by b.ngay`, [cand.hoc_sinh_id, lop.mon, FROM, TO])
let etTotal = 0
console.log('\n① ET (hạng buổi → EXP):')
for (const r of etr) { const e = etRankExp(r.rank, r.rank_total); etTotal += e; console.log(`   ${new Date(r.ngay).toLocaleDateString('vi')}  hạng ${r.rank}/${r.rank_total} → ${e}`) }
console.log(`   → ET tổng = ${etTotal}`)

// ② BTVN mỗi bài
const bk = await q(`select b.ngay, bk.trang_thai_nop, bk.thai_do from btvn_ket_qua bk join buoi_hoc b on b.id=bk.buoi_hoc_id
  where bk.hoc_sinh_id=$1 and b.lop_id=$2 and b.ngay>=$3 and b.ngay<$4 order by b.ngay`, [cand.hoc_sinh_id, lop.id, FROM, TO])
console.log('\n② BTVN (mỗi bài = 300 × timing × thái_độ):')
for (const r of bk) console.log(`   ${new Date(r.ngay).toLocaleDateString('vi')}  ${(r.trang_thai_nop||'—').padEnd(12)} ${(r.thai_do||'—').padEnd(16)} → ${btvnBaiExp(r.trang_thai_nop, r.thai_do)}`)
const bais = bk.map(r => ({ trangThai: r.trang_thai_nop, thaiDo: r.thai_do }))

// độ-đúng BTVN: per (hs,buoi) = Σpoints/(n*100); studentAcc = mean buổi; classMean = mean HS
async function accMap() {
  const g = await q(`select g.hoc_sinh_id, sp.buoi_hoc_id, sum(g.points)::float pts, count(*) n
    from gami_grades g join gami_session_problems sp on sp.id=g.problem_id join buoi_hoc b on b.id=sp.buoi_hoc_id
    where sp.phase='btvn' and b.lop_id=$1 and b.ngay>=$2 and b.ngay<$3 group by 1,2`, [lop.id, FROM, TO])
  const byHs = new Map()
  for (const r of g) { (byHs.get(r.hoc_sinh_id) ?? byHs.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)).push(r.pts / (r.n * 100)) }
  return byHs
}
const am = await accMap()
const meanOf = a => a && a.length ? a.reduce((s, x) => s + x, 0) / a.length : null
const studentAcc = meanOf(am.get(cand.hoc_sinh_id))
const classMean = meanOf([...am.values()].map(meanOf).filter(x => x != null))
const m = monthlyBtvnExp(bais, studentAcc, classMean)
console.log(`\n   subtotal=${m.subtotal} · fullMonth(+5% nếu 0 miss)=${m.fullMonth} · classHi=${m.classHi} · classLo=${m.classLo} · missPenalty=${m.missPenalty} (miss=${m.missCount})`)
console.log(`   độ-đúng HS=${studentAcc?.toFixed(3)} vs lớp=${classMean?.toFixed(3)}  → BTVN tổng tháng = ${m.total}`)

// ③ so với ledger đã lưu
const led = (await q(`select amount from gami_exp_ledger where hoc_sinh_id=$1 and mon=$2 and source='exp_thang' and note=$3`, [cand.hoc_sinh_id, lop.mon, YM]))[0]
console.log(`\n③ TỔNG THÁNG (ET ${etTotal} + BTVN ${m.total} + MT 0) = ${etTotal + m.total}  ·  ledger đã lưu: ${led?.amount ?? '—'}`)
await c.end()
