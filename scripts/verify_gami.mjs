// Test engine gami (chạy: node scripts/verify_gami.mjs). Khớp FIXTURE bắt buộc của spec master §5-6.
import { computeEloUpdate, expectedScore, actualScore } from '../src/gami/elo.js'
import { problemPoints, expForRank } from '../src/gami/exp.js'
import { RANK_EXP } from '../src/gami/config.js'

let fail = 0
const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol
const ok = (cond, msg) => { if (!cond) { console.error('✗', msg); fail++ } else console.log('✓', msg) }

// ── FIXTURE ELO (5 HS · K=30, cap±20, P=10, λ=0.05 · mean=1000) ──
const studs = [
  { studentId: 'An', elo: 1200, points: 7.0 },
  { studentId: 'Bình', elo: 1100, points: 8.5 },
  { studentId: 'Chi', elo: 1000, points: 8.0 },
  { studentId: 'Dũng', elo: 900, points: 5.0 },
  { studentId: 'Em', elo: 800, points: 6.5 },
]
const res = computeEloUpdate(studs, { isMT: false }) // classSize mặc định = 5 (= số HS có mặt)
const by = Object.fromEntries(res.map((r) => [r.studentId, r]))
const expE = { An: 3.16, 'Bình': 2.61, Chi: 2.0, 'Dũng': 1.39, Em: 0.84 }
// Δ = clamp(30·(A−E)/4, ±20) + 10 − 0.05·(elo−1000)
const expD = { An: -9, 'Bình': 15, Chi: 18, 'Dũng': 5, Em: 21 }
const expAfter = { An: 1191, 'Bình': 1115, Chi: 1018, 'Dũng': 905, Em: 821 }
for (const id of Object.keys(expE)) {
  ok(near(by[id].expected, expE[id], 0.02), `E[${id}] ≈ ${expE[id]} (got ${by[id].expected.toFixed(2)})`)
  ok(Math.abs(by[id].delta - expD[id]) <= 1, `Δ[${id}] ≈ ${expD[id]} (got ${by[id].delta})`)
  ok(Math.abs(by[id].eloAfter - expAfter[id]) <= 1, `Elo sau[${id}] ≈ ${expAfter[id]} (got ${by[id].eloAfter})`)
}
const sumE = res.reduce((s, r) => s + r.expected, 0)
ok(near(sumE, 10, 0.05), `ΣE = 10 = C(5,2) (got ${sumE.toFixed(2)})`)
// tiến-trình: ΣΔ ≈ 5×P = 50 (hạng zero-sum, revert triệt tiêu quanh mean)
ok(Math.abs(res.reduce((s, r) => s + r.delta, 0) - 50) <= 2, `ΣΔ ≈ 5·P = 50 (got ${res.reduce((s, r) => s + r.delta, 0)})`)
ok(actualScore(8.5, [7, 8, 5, 6.5]) === 4, 'actual(Bình)=4')

// ── MT ×4: chỉ phần HẠNG nhân 4 (P & λ giữ ×1) → biên độ hạng lớn hơn, ΣΔ vẫn ≈ 50 ──
const mt = Object.fromEntries(computeEloUpdate(studs, { isMT: true }).map((r) => [r.studentId, r]))
ok(Math.abs(mt['Bình'].delta - 47) <= 1, `MT Δ[Bình] ≈ 47 (hạng ×4; got ${mt['Bình'].delta})`)
ok(Math.abs(mt['Dũng'].delta - (-27)) <= 1, `MT Δ[Dũng] ≈ −27 (thi tệ trả giá ×4; got ${mt['Dũng'].delta})`)
ok(mt['Bình'].delta > by['Bình'].delta + 20, 'MT nặng hơn buổi thường rõ rệt')
ok(Math.abs(Object.values(mt).reduce((s, r) => s + r.delta, 0) - 50) <= 3, 'MT: ΣΔ vẫn ≈ 50 (P không bị ×4)')

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

// ── SEASON (niên khóa, START=1/7) ──
import { seasonOf, seasonStartUtc, seasonEndUtc } from '../src/gami/season.js'
ok(seasonOf('2026-06-30') === '2025-26', 'trước 1/7 → mùa trước (2025-26)')
ok(seasonOf('2026-07-01') === '2026-27', 'đúng 1/7 → mùa mới (2026-27)')
ok(seasonOf('2027-01-15') === '2026-27', 'giữa năm dương lịch vẫn cùng niên khóa (2026-27)')
ok(seasonStartUtc('2026-27') === '2026-06-30T17:00:00.000Z', 'đầu mùa 1/7 VN = 30/6 17:00 UTC')
ok(seasonEndUtc('2026-27') === seasonStartUtc('2027-28'), 'cuối mùa = đầu mùa kế (liền mạch)')

// ── LEVEL ──
import { expToLevel, cumExpFor, stepCost, avatarTier } from '../src/gami/level.js'
ok(expToLevel(0).level === 1, 'EXP 0 → level 1')
ok(expToLevel(stepCost(1) - 1).level === 1, 'thiếu 1 EXP chưa lên level 2')
ok(expToLevel(stepCost(1)).level === 2, 'đủ stepCost(1) → level 2')
ok(expToLevel(cumExpFor(21)).level === 21 && expToLevel(cumExpFor(21)).isMax, 'đạt ngưỡng level 21 = MAX')
ok(expToLevel(cumExpFor(21) + 99999).level === 21, 'vượt MAX vẫn kẹp 21')
{ let mono = true; for (let L = 1; L < 21; L++) if (stepCost(L + 1) < stepCost(L)) mono = false; ok(mono, 'stepCost tăng dần (level sau đắt hơn)') }
{ const x = expToLevel(cumExpFor(5) + Math.floor(stepCost(5) / 2)); ok(x.level === 5 && x.pct > 0.4 && x.pct < 0.6, 'pct ~giữa level 5') }
ok(avatarTier(1) === 1 && avatarTier(21) === 7, 'bậc avatar: level 1→1, level 21→7')

console.log(fail ? `\n❌ ${fail} test FAIL` : '\n✅ TẤT CẢ PASS')
process.exit(fail ? 1 : 0)
