// Test engine gami (chạy: node scripts/verify_gami.mjs). Khớp FIXTURE bắt buộc của spec master §5-6.
import { computeEloUpdate, expectedScore, actualScore } from '../src/gami/elo.js'
import { problemPoints, expForRank } from '../src/gami/exp.js'
import { RANK_EXP } from '../src/gami/config.js'

let fail = 0
const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol
const ok = (cond, msg) => { if (!cond) { console.error('✗', msg); fail++ } else console.log('✓', msg) }

// ── FIXTURE ELO (5 HS, K=24, không MT; classSize>8 để K=24 theo note spec) ──
const studs = [
  { studentId: 'An', elo: 1200, points: 7.0, sessionsPlayed: 9 },
  { studentId: 'Bình', elo: 1100, points: 8.5, sessionsPlayed: 9 },
  { studentId: 'Chi', elo: 1000, points: 8.0, sessionsPlayed: 9 },
  { studentId: 'Dũng', elo: 900, points: 5.0, sessionsPlayed: 9 },
  { studentId: 'Em', elo: 800, points: 6.5, sessionsPlayed: 9 },
]
const res = computeEloUpdate(studs, { isMT: false, classSize: 20 })
const by = Object.fromEntries(res.map((r) => [r.studentId, r]))
const expE = { An: 3.16, 'Bình': 2.61, Chi: 2.0, 'Dũng': 1.39, Em: 0.84 }
const expD = { An: -28, 'Bình': 33, Chi: 24, 'Dũng': -33, Em: 4 }
const expAfter = { An: 1172, 'Bình': 1133, Chi: 1024, 'Dũng': 867, Em: 804 }
for (const id of Object.keys(expE)) {
  ok(near(by[id].expected, expE[id], 0.02), `E[${id}] ≈ ${expE[id]} (got ${by[id].expected.toFixed(2)})`)
  ok(Math.abs(by[id].delta - expD[id]) <= 1, `Δ[${id}] ≈ ${expD[id]} (got ${by[id].delta})`)
  ok(Math.abs(by[id].eloAfter - expAfter[id]) <= 1, `Elo sau[${id}] ≈ ${expAfter[id]} (got ${by[id].eloAfter})`)
}
const sumE = res.reduce((s, r) => s + r.expected, 0)
ok(near(sumE, 10, 0.05), `ΣE = 10 = C(5,2) (got ${sumE.toFixed(2)})`)
ok(Math.abs(res.reduce((s, r) => s + r.delta, 0)) <= 2, `ΣΔ ≈ 0 (got ${res.reduce((s, r) => s + r.delta, 0)})`)
ok(actualScore(8.5, [7, 8, 5, 6.5]) === 4, 'actual(Bình)=4')

// ── ĐIỂM BÀI ──
ok(problemPoints({ result: 'correct', presentation: 'clean', speed: 'fast' }) === 110, 'điểm bài đúng+chuẩn+nhanh = 110')
ok(problemPoints({ result: 'correct', presentation: 'clean', speed: 'normal' }) === 100, '= 100')
ok(problemPoints({ result: 'wrong', presentation: 'clean', speed: 'fast' }) === 0, 'sai cách = 0')
ok(problemPoints({ result: 'partial', presentation: 'ok', speed: 'normal' }) === 43, 'đúng hướng+khá = 43')

// ── expForRank: đơn điệu + biên ──
for (const phase of ['ingame', 'et', 'mt']) {
  const bands = RANK_EXP[phase]
  for (let N = 5; N <= 15; N++) {
    let mono = true
    for (let r = 1; r < N; r++) if (expForRank(r, N, bands) < expForRank(r + 1, N, bands)) mono = false
    ok(mono, `expForRank đơn điệu (${phase}, N=${N})`)
    ok(expForRank(1, N, bands) === bands[0], `hạng 1 = đỉnh (${phase}, N=${N})`)
  }
}
ok(expForRank(5, 5, RANK_EXP.ingame) === 290, 'N=5 hạng 5 = bậc 5 (290), KHÔNG dùng sàn 250')

console.log(fail ? `\n❌ ${fail} test FAIL` : '\n✅ TẤT CẢ PASS')
process.exit(fail ? 1 : 0)
