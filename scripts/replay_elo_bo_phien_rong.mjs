// Replay Elo/EXP toàn bộ theo thời gian, BỎ QUA phiên KHÔNG CÓ DỮ LIỆU CHẤM (Thùy 07-21).
//
// Vì sao phải replay chứ không "trừ ngược": Elo là chuỗi phụ thuộc — delta của buổi sau tính từ Elo
// SAU buổi trước (qua `expected`). Xoá 1 phiên ở giữa làm mọi delta phía sau sai theo. Chỉ có tính
// lại từ đầu theo đúng thứ tự thời gian mới ra số đúng.
//
// Khác `_replay_elo.mjs` (đời cũ): (1) BỎ phase không có dòng chấm nào · (2) có phase `mt` (K=60,
// đời cũ chỉ ingame+et nên replay bằng script cũ sẽ NUỐT toàn bộ Elo của MT) · (3) `sessions_played`
// chỉ +1 khi phiên ingame THẬT SỰ tính Elo (buổi trống không phải "đã chơi" — nó ảnh hưởng hệ số K).
//
// Chạy:  node scripts/replay_elo_bo_phien_rong.mjs           → THỬ, không ghi gì
//        node scripts/replay_elo_bo_phien_rong.mjs --ghi     → ghi thật (1 transaction)
//        thêm --giu-exp  → chỉ dựng lại Elo, GIỮ NGUYÊN gami_exp_ledger đang có
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { computeEloUpdate } from '../src/gami/elo.js'
import { expForRank, rankSession } from '../src/gami/exp.js'
import { RANK_EXP } from '../src/gami/config.js'

const GHI = process.argv.includes('--ghi')
const GIU_EXP = process.argv.includes('--giu-exp')
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows

// Buổi có ÍT NHẤT 1 phase đã đóng, theo đúng thứ tự thời gian. `mt` cũng là phase của buổi thường.
const buois = await q(`
  select b.id, b.ngay, b.loai, b.ingame_dong_at, b.et_dong_at, b.mt_dong_at, l.mon, l.ten_lop
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.trang_thai <> 'huy'
    and (b.ingame_dong_at is not null or b.et_dong_at is not null or b.mt_dong_at is not null)
  order by b.ngay asc, b.id asc`)

const elo = new Map() // "hs|mon" -> { elo, sessions }
const get = (hs, mon) => { const k = hs + '|' + mon; if (!elo.has(k)) elo.set(k, { elo: 1000, sessions: 0 }); return elo.get(k) }
const hist = [], exp = []
const boQua = []
let phaseTinh = 0

for (const b of buois) {
  const coElo = b.loai === 'thuong' || b.loai === 'mt'
  const coMat = (await q(`select hoc_sinh_id from buoi_hoc_hs where buoi_hoc_id=$1 and diem_danh='co_mat'`, [b.id])).map((r) => r.hoc_sinh_id)
  if (!coMat.length) continue
  const mon = b.mon

  if (!coElo) { // bù/bổ trợ: EXP sàn, không Elo — giữ nguyên hành vi cũ (không nằm trong rank_*)
    continue
  }

  // Snapshot Elo TRƯỚC BUỔI — cả 3 phase tính độc lập từ mốc này (không nối tiếp nhau).
  const pre = {}, preSess = {}
  for (const hs of coMat) { const e = get(hs, mon); pre[hs] = e.elo; preSess[hs] = e.sessions }

  const phases = []
  if (b.ingame_dong_at) phases.push('ingame')
  if (b.et_dong_at) phases.push('et')
  if (b.mt_dong_at) phases.push('mt')

  const buoiDelta = {}
  let ingameTinh = false
  for (const phase of phases) {
    const pids = (await q(`select id from gami_session_problems where buoi_hoc_id=$1 and phase=$2`, [b.id, phase])).map((r) => r.id)
    const gs = pids.length ? await q(`select hoc_sinh_id, points from gami_grades where problem_id = any($1)`, [pids]) : []
    // ⭐ ĐIỀU KIỆN CỐT LÕI: không có dòng chấm nào ⇒ HUỶ phiên Elo này.
    if (!gs.length) { boQua.push({ lop: b.ten_lop, ngay: b.ngay, phase, hs: coMat.length }); continue }
    const raw = {}; for (const hs of coMat) raw[hs] = 0
    for (const g of gs) if (g.hoc_sinh_id in raw) raw[g.hoc_sinh_id] += Number(g.points)

    const students = coMat.map((hs) => ({ studentId: hs, elo: pre[hs], points: raw[hs], sessionsPlayed: preSess[hs] }))
    const ups = computeEloUpdate(students, { isMT: phase === 'mt', classSize: coMat.length })
    const ranks = rankSession(ups.map((u) => ({ studentId: u.studentId, rawPoints: raw[u.studentId], eloDelta: u.delta })))
    const rankMap = new Map(ranks.map((r) => [r.studentId, r.rank]))
    for (const u of ups) {
      hist.push([u.studentId, b.id, phase, mon, u.eloBefore, u.expected, u.actual, u.delta, u.eloAfter, rankMap.get(u.studentId) ?? null, coMat.length])
      buoiDelta[u.studentId] = (buoiDelta[u.studentId] || 0) + u.delta
    }
    // EXP theo hạng, CÔNG BẰNG khi hoà: cùng điểm thô ⇒ TB bậc EXP các vị trí nhóm chiếm.
    const grp = new Map()
    for (const r of ranks) { const p = raw[r.studentId]; if (!grp.has(p)) grp.set(p, []); grp.get(p).push(expForRank(r.rank, coMat.length, RANK_EXP[phase])) }
    const expByPts = new Map()
    for (const [p, arr] of grp) expByPts.set(p, Math.round(arr.reduce((s, x) => s + x, 0) / arr.length))
    for (const r of ranks) exp.push([r.studentId, 'rank_' + phase, expByPts.get(raw[r.studentId]) ?? 0, b.id, mon])

    if (phase === 'ingame') ingameTinh = true
    phaseTinh++
  }
  // sessions_played chỉ +1 khi phiên ingame THẬT SỰ có tính (ảnh hưởng hệ số K — buổi trống không phải "đã chơi")
  for (const hs of coMat) { const e = get(hs, mon); e.elo += (buoiDelta[hs] || 0); if (ingameTinh) e.sessions += 1 }
}

console.log(`Buổi xét: ${buois.length} · phase TÍNH: ${phaseTinh} · phase BỎ (0 dòng chấm): ${boQua.length}`)
const theoPhase = {}; boQua.forEach((r) => { theoPhase[r.phase] = (theoPhase[r.phase] ?? 0) + 1 })
console.log(`  phase bỏ theo loại:`, JSON.stringify(theoPhase))
console.log(`  → history mới: ${hist.length} dòng · exp mới: ${exp.length} dòng`)

// So Elo cũ vs mới
const cu = new Map((await q(`select hoc_sinh_id, mon, elo, sessions_played from gami_elo`)).map((r) => [r.hoc_sinh_id + '|' + r.mon, r]))
const diff = []
for (const [k, e] of elo) {
  const o = cu.get(k)
  if (!o) continue
  if (o.elo !== e.elo || o.sessions_played !== e.sessions) diff.push({ k, cu: o.elo, moi: e.elo, sCu: o.sessions_played, sMoi: e.sessions })
}
const ten = new Map((await q(`select id, ho_ten from hoc_sinh`)).map((r) => [r.id, r.ho_ten]))
diff.sort((a, b2) => Math.abs(b2.moi - b2.cu) - Math.abs(a.moi - a.cu))
console.log(`\nHS×môn đổi Elo: ${diff.length}/${elo.size}`)
console.log('  lệch lớn nhất:')
diff.slice(0, 12).forEach((d) => {
  const [hs, mon] = d.k.split('|')
  console.log(`    ${(ten.get(hs) ?? hs).padEnd(24)} ${mon.padEnd(5)} ${String(d.cu).padStart(5)} → ${String(d.moi).padStart(5)}  (${d.moi - d.cu > 0 ? '+' : ''}${d.moi - d.cu})  buổi ${d.sCu}→${d.sMoi}`)
})
const expCu = Number((await q(`select coalesce(sum(amount),0)::int n from gami_exp_ledger where source like 'rank_%'`))[0].n)
const expMoi = exp.reduce((s, x) => s + x[2], 0)
console.log(`\nEXP (rank_*): ${expCu} → ${expMoi}  (${expMoi - expCu})`)

if (!GHI) { console.log('\n(THỬ — chưa ghi gì. Thêm --ghi để áp thật.)'); await c.end(); process.exit(0) }

try {
  await c.query('begin')
  await c.query(`delete from gami_elo_history`)
  if (!GIU_EXP) await c.query(`delete from gami_exp_ledger where source in ('rank_ingame','rank_et','rank_mt')`)
  await c.query(`update gami_elo set elo=1000, sessions_played=0, updated_at=now()`)
  for (const h of hist) await c.query(`insert into gami_elo_history(hoc_sinh_id,buoi_hoc_id,phase,mon,elo_before,expected,actual,delta,elo_after,rank,rank_total) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, h)
  if (!GIU_EXP) for (const x of exp) await c.query(`insert into gami_exp_ledger(hoc_sinh_id,source,amount,ref_buoi_hoc_id,mon) values($1,$2,$3,$4,$5)`, x)
  for (const [k, e] of elo) {
    const [hs, mon] = k.split('|')
    await c.query(`insert into gami_elo(hoc_sinh_id,mon,elo,sessions_played) values($1,$2,$3,$4)
      on conflict (hoc_sinh_id,mon) do update set elo=excluded.elo, sessions_played=excluded.sessions_played, updated_at=now()`, [hs, mon, e.elo, e.sessions])
  }
  await c.query('commit')
  console.log(`\n✅ ĐÃ GHI: ${hist.length} history · ${GIU_EXP ? 'GIỮ NGUYÊN exp cũ' : exp.length + ' exp'} · ${elo.size} (HS×môn).`)
} catch (e) {
  await c.query('rollback'); console.error('❌ rollback:', e.message); process.exitCode = 1
} finally { await c.end() }
