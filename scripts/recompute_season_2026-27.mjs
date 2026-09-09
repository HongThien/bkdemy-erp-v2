// RECOMPUTE MÙA (sau hard-reset) — dựng lại ELO + EXP tháng cho MÙA hiện tại TỪ ĐIỂM THÔ (gami_grades),
// bắt đầu từ mốc 1000 ở đầu mùa (1/8). Dùng ĐÚNG engine thuần (replayEloEvents / rankSession / etRankExp /
// monthlyBtvnExp) — KHÔNG chép lại công thức. Khớp semantics closePhase:
//   · chỉ buổi ET đã ĐÓNG (et_dong_at) · loai='thuong' · ngay>=đầu mùa
//   · participants = roster CÓ MẶT (co_mat), điểm=Σ grades (0 nếu chưa chấm ô nào)
//   · buổi KHÔNG có ô chấm nào ⇒ BỎ (không đo Elo — bug 07-21) · buổi <2 HS ⇒ replay tự bỏ
//   · rank buổi theo điểm thô (Δ Elo tie-break) → ghi gami_elo_history.rank cho EXP dùng
// Sau ELO ghi xong → tính lại EXP THÁNG (mirror recomputeExpThang) cho tháng có buổi trong mùa.
//
// Dry-run mặc định. Ghi thật: --write
//   node scripts/recompute_season_2026-27.mjs            # xem trước
//   node scripts/recompute_season_2026-27.mjs --write    # áp
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
import { replayEloEvents } from '../src/gami/replay.js'
import { rankSession, etRankExp, monthlyBtvnExp } from '../src/gami/exp.js'
import { seasonOf } from '../src/gami/season.js'
import { SEASON } from '../src/gami/config.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const WRITE = process.argv.includes('--write')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

const vnToday = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10)
const MUA = seasonOf(vnToday)
// Đầu mùa dạng NGÀY VN 'YYYY-MM-DD' để so với cột b.ngay (DATE, giờ VN). KHÔNG dùng seasonStartUtc().slice()
// — cái đó trả INSTANT UTC (1/8 VN = 31/7 17:00Z) nên slice ra '...-07-31', lệch 1 ngày → gộp nhầm ngày thử cuối.
const START = `${MUA.split('-')[0]}-${String(SEASON.START_MONTH).padStart(2, '0')}-${String(SEASON.START_DAY).padStart(2, '0')}`
console.log(`Mùa ${MUA} · đầu mùa ${START} · hôm nay ${vnToday}`)

// ── A. ELO: dựng events từ điểm thô của buổi ET ĐÃ ĐÓNG trong mùa ──
const buoiRows = await q(`
  select b.id, b.ngay, l.mon
  from buoi_hoc b join lop l on l.id=b.lop_id
  where b.loai='thuong' and b.trang_thai<>'huy' and b.et_dong_at is not null and b.ngay >= $1
  order by b.ngay asc, b.id asc`, [START])
const buoiIds = buoiRows.map(b => b.id)
const monOf = new Map(buoiRows.map(b => [b.id, b.mon]))

const roster = buoiIds.length ? await q(`
  select buoi_hoc_id, hoc_sinh_id from buoi_hoc_hs where diem_danh='co_mat' and buoi_hoc_id = any($1)`, [buoiIds]) : []
const rosterOf = new Map() // buoiId → [hsId]
for (const r of roster) (rosterOf.get(r.buoi_hoc_id) ?? rosterOf.set(r.buoi_hoc_id, []).get(r.buoi_hoc_id)).push(r.hoc_sinh_id)

const grw = buoiIds.length ? await q(`
  select p.buoi_hoc_id, g.hoc_sinh_id, sum(g.points)::float pts
  from gami_grades g join gami_session_problems p on p.id=g.problem_id
  where p.phase='et' and p.buoi_hoc_id = any($1)
  group by p.buoi_hoc_id, g.hoc_sinh_id`, [buoiIds]) : []
const ptsOf = new Map(grw.map(r => [r.buoi_hoc_id + '|' + r.hoc_sinh_id, Number(r.pts)]))
const buoiCoCham = new Set(grw.map(r => r.buoi_hoc_id)) // buổi có ≥1 ô chấm ET

// events theo thứ tự thời gian; bỏ buổi 0 ô chấm (khớp closePhase khongCoDuLieu)
const events = []
let boQuaKoCham = 0
for (const b of buoiRows) {
  if (!buoiCoCham.has(b.id)) { boQuaKoCham++; continue }
  const hs = rosterOf.get(b.id) ?? []
  const students = hs.map(id => ({ studentId: id, points: ptsOf.get(b.id + '|' + id) ?? 0 }))
  events.push({ buoiHocId: b.id, mon: b.mon, isMT: false, students })
}

const { history, finalElo } = replayEloEvents(events)

// rank per event (điểm thô ↓, Δ Elo tie-break) — chỉ event có history (≥2 HS)
const deltaOf = new Map(history.map(h => [h.buoiHocId + '|' + h.studentId, h.delta]))
const evHasHist = new Set(history.map(h => h.buoiHocId))
const rankInfo = new Map() // buoi|hs → {rank, rank_total}
for (const ev of events) {
  if (!evHasHist.has(ev.buoiHocId)) continue
  const ranked = rankSession(ev.students.map(s => ({ studentId: s.studentId, rawPoints: s.points, eloDelta: deltaOf.get(ev.buoiHocId + '|' + s.studentId) ?? 0 })))
  for (const r of ranked) rankInfo.set(ev.buoiHocId + '|' + r.studentId, { rank: r.rank, rank_total: ev.students.length })
}

const newHist = history.map(h => {
  const ri = rankInfo.get(h.buoiHocId + '|' + h.studentId) ?? {}
  return { hoc_sinh_id: h.studentId, buoi_hoc_id: h.buoiHocId, phase: 'et', mon: h.mon,
    elo_before: h.eloBefore, expected: h.expected, actual: h.actual, delta: h.delta, elo_after: h.eloAfter,
    rank: ri.rank ?? null, rank_total: ri.rank_total ?? null }
})
// sessions_played per (hs|mon) = số buổi ET tham gia (có history)
const sessOf = new Map(); for (const h of history) sessOf.set(h.studentId + '|' + h.mon, (sessOf.get(h.studentId + '|' + h.mon) ?? 0) + 1)

console.log(`\n── ELO ── buổi ET đã đóng trong mùa: ${buoiIds.length} · bỏ (0 ô chấm): ${boQuaKoCham} · events: ${events.length}`)
console.log(`  history sinh ra: ${newHist.length} dòng · (HS×môn) có Elo: ${finalElo.size}`)
for (const ten of ['9A1', '9A2', '9S1']) {
  const lop = (await q(`select id, mon from lop where ten_lop=$1`, [ten]))[0]; if (!lop) continue
  // HS của CHÍNH lớp này từng đấu ET trong mùa (buổi của lop có trong events) → Elo cuối của họ.
  const buoiCuaLop = new Set((await q(`select id from buoi_hoc where lop_id=$1`, [lop.id])).map(r => r.id))
  const hsSet = new Set(); for (const ev of events) if (buoiCuaLop.has(ev.buoiHocId)) for (const s of ev.students) hsSet.add(s.studentId)
  const arr = [...hsSet].map(id => Math.round(finalElo.get(id + '|' + lop.mon) ?? 1000)).sort((a, z) => z - a)
  if (arr.length) console.log(`  ${ten}: ${arr.length} HS — top ${arr[0]} · đáy ${arr[arr.length - 1]} · TB ${Math.round(arr.reduce((s, x) => s + x, 0) / arr.length)}`)
  else console.log(`  ${ten}: chưa có buổi ET đóng trong mùa → giữ 1000`)
}

// ── B. EXP THÁNG: mirror recomputeExpThang cho từng (lop × tháng có buổi) trong mùa ──
// Tháng của mùa (12 tháng từ START_MONTH); chỉ tháng có buổi mới ghi.
const y0 = Number(MUA.split('-')[0])
const monthsOfMua = []
for (let i = 0; i < 12; i++) { const m = SEASON.START_MONTH + i; const yy = m > 12 ? y0 + 1 : y0; const mm = ((m - 1) % 12) + 1; monthsOfMua.push(`${yy}-${String(mm).padStart(2, '0')}`) }
const lops = await q(`select id, ten_lop, mon from lop where mon in ('Toán','KHTN') order by ten_lop`)

// EXP đọc gami_elo_history.rank. Trong --write ta đọc SAU khi ghi history (cùng transaction).
// Trả { rows:[{hoc_sinh_id,source,amount,mon,note}], buoiIds, hsList } cho 1 (lop,ym).
async function expThangRows(lop, ym, histRankGetter) {
  const [Y, M] = ym.split('-').map(Number)
  const from = `${ym}-01`, to = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`
  const bs = await q(`select id from buoi_hoc where lop_id=$1 and trang_thai<>'huy' and loai='thuong' and ngay>=$2 and ngay<$3`, [lop.id, from, to])
  const bIds = bs.map(b => b.id); if (!bIds.length) return { rows: [], bIds: [], hsList: [] }
  const perHs = new Map(); const ensure = id => perHs.get(id) ?? perHs.set(id, { et: 0, bais: [], acc: [] }).get(id)
  for (const r of histRankGetter(bIds)) if (r.rank != null && r.rank_total != null) ensure(r.hoc_sinh_id).et += etRankExp(r.rank, r.rank_total)
  const kq = await q(`select hoc_sinh_id, trang_thai_nop, thai_do from btvn_ket_qua where buoi_hoc_id=any($1)`, [bIds])
  for (const r of kq) ensure(r.hoc_sinh_id).bais.push({ trangThai: r.trang_thai_nop, thaiDo: r.thai_do })
  const gr = await q(`select g.hoc_sinh_id, p.buoi_hoc_id, count(*)::int n, sum(g.points)::float pts from gami_grades g join gami_session_problems p on p.id=g.problem_id where p.phase='btvn' and p.buoi_hoc_id=any($1) group by g.hoc_sinh_id, p.buoi_hoc_id`, [bIds])
  const accB = new Map(); for (const r of gr) { const a = r.n ? r.pts / (r.n * 100) : 0; (accB.get(r.hoc_sinh_id) ?? accB.set(r.hoc_sinh_id, []).get(r.hoc_sinh_id)).push(a) }
  const accOf = new Map(); for (const [id, arr] of accB) accOf.set(id, arr.reduce((s, x) => s + x, 0) / arr.length)
  const av = [...accOf.values()]; const classMean = av.length ? av.reduce((s, x) => s + x, 0) / av.length : null
  const rows = []
  for (const [hs, p] of perHs) {
    const studentAcc = accOf.get(hs) ?? null
    const total = p.et + monthlyBtvnExp(p.bais, studentAcc, classMean).total
    if (total > 0) rows.push({ hoc_sinh_id: hs, source: 'exp_thang', amount: total, mon: lop.mon, note: ym })
  }
  return { rows, bIds, hsList: [...perHs.keys()] }
}

// Trong dry-run: đọc rank từ newHist (in-memory) vì DB history đang rỗng.
const memRank = new Map(newHist.map(h => [h.buoi_hoc_id + '|' + h.hoc_sinh_id, { rank: h.rank, rank_total: h.rank_total }]))
const memRankGetter = bIds => { const out = []; for (const bId of bIds) for (const [k, v] of memRank) if (k.startsWith(bId + '|')) out.push({ hoc_sinh_id: k.split('|')[1], rank: v.rank, rank_total: v.rank_total }); return out }

let expPreview = 0, expPairs = 0
const expPlan = [] // {lop, ym, rows, bIds, hsList}
for (const lop of lops) for (const ym of monthsOfMua) {
  const r = await expThangRows(lop, ym, memRankGetter)
  if (r.rows.length) { expPlan.push({ lop, ym, ...r }); expPreview += r.rows.reduce((s, x) => s + x.amount, 0); expPairs += r.rows.length }
}
const monthsSeen = [...new Set(expPlan.map(p => p.ym))].sort()
console.log(`\n── EXP THÁNG ── tháng có buổi: ${monthsSeen.join(', ') || '(không)'} · sẽ ghi ${expPairs} dòng exp_thang · tổng ${expPreview.toLocaleString('vi-VN')} EXP`)

if (!WRITE) { console.log('\n[DRY-RUN] chưa ghi. Thêm --write để áp ELO + EXP.'); await c.end(); process.exit(0) }

// ── WRITE (1 transaction) ──
try {
  await c.query('begin')
  // ELO: nền 1000 + xoá history mùa này + ghi lại + upsert gami_elo
  await c.query(`update gami_elo set elo=1000, sessions_played=0, updated_at=now()`)
  if (buoiIds.length) await c.query(`delete from gami_elo_history where buoi_hoc_id = any($1)`, [buoiIds])
  for (const h of newHist) await c.query(
    `insert into gami_elo_history(hoc_sinh_id,buoi_hoc_id,phase,mon,elo_before,expected,actual,delta,elo_after,rank,rank_total)
     values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [h.hoc_sinh_id, h.buoi_hoc_id, h.phase, h.mon, h.elo_before, h.expected, h.actual, h.delta, h.elo_after, h.rank, h.rank_total])
  for (const [k, v] of finalElo) { const [hs, mon] = k.split('|'); await c.query(
    `insert into gami_elo(hoc_sinh_id, mon, elo, sessions_played, updated_at) values($1,$2,$3,$4,now())
     on conflict (hoc_sinh_id, mon) do update set elo=excluded.elo, sessions_played=excluded.sessions_played, updated_at=now()`,
    [hs, mon, Math.round(v), sessOf.get(k) ?? 0]) }

  // EXP: đọc rank từ history VỪA GHI (cùng txn) rồi ghi exp_thang, mirror recomputeExpThang
  let expWritten = 0
  for (const lop of lops) for (const ym of monthsOfMua) {
    // đọc rank thật trong txn
    const [Y, M] = ym.split('-').map(Number)
    const from = `${ym}-01`, to = M === 12 ? `${Y + 1}-01-01` : `${Y}-${String(M + 1).padStart(2, '0')}-01`
    const bs = (await c.query(`select id from buoi_hoc where lop_id=$1 and trang_thai<>'huy' and loai='thuong' and ngay>=$2 and ngay<$3`, [lop.id, from, to])).rows
    const bIds = bs.map(b => b.id); if (!bIds.length) continue
    const eh = (await c.query(`select hoc_sinh_id, rank, rank_total from gami_elo_history where phase='et' and buoi_hoc_id=any($1)`, [bIds])).rows
    const r = await expThangRows(lop, ym, () => eh)
    // xoá per-buổi legacy trong tháng + exp_thang cũ của (mon,ym,hsList) rồi chèn (idempotent)
    await c.query(`delete from gami_exp_ledger where ref_buoi_hoc_id = any($1)`, [bIds])
    if (r.hsList.length) await c.query(`delete from gami_exp_ledger where source='exp_thang' and mon=$1 and note=$2 and hoc_sinh_id = any($3)`, [lop.mon, ym, r.hsList])
    for (const row of r.rows) { await c.query(`insert into gami_exp_ledger(hoc_sinh_id, source, amount, mon, note) values($1,$2,$3,$4,$5)`, [row.hoc_sinh_id, row.source, row.amount, row.mon, row.note]); expWritten++ }
  }
  await c.query('commit')
  console.log(`\n✅ RECOMPUTE XONG: ${newHist.length} dòng ELO history · ${finalElo.size} (HS×môn) Elo · ${expWritten} dòng exp_thang.`)
} catch (e) { await c.query('rollback'); console.error('❌ ROLLBACK:', e.message); process.exitCode = 1 }
finally { await c.end() }
