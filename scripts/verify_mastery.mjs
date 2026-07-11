// Test MASTERY ENGINE (chạy: node scripts/verify_mastery.mjs).
import { masteryOfDang, masteryOfHS, summarizeDang, RESULT_VALUE } from '../src/gami/mastery.js'

let fail = 0
const ok = (cond, msg) => { if (!cond) { console.error('✗', msg); fail++ } else console.log('✓', msg) }
const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t
const M = (value, t, src) => ({ value, t, src }) // t = ngày ISO cho dễ đọc

// ── chưa-đo ──
ok(masteryOfDang([]) === null, 'rỗng → null (chưa-đo, KHÔNG phải 0)')
ok(masteryOfDang(undefined) === null, 'undefined → null')

// ── điểm = TB, mức ──
ok(near(masteryOfDang([M(1, '2026-01-01')]).score, 1) && masteryOfDang([M(1, '2026-01-01')]).muc === 'dat', '1 lần đúng → score 1, đạt')
ok(masteryOfDang([M(0, '2026-01-01')]).muc === 'yeu', '1 lần sai → yếu')
ok(masteryOfDang([M(0.5, '2026-01-01')]).muc === 'can_luyen', '1 lần partial (0.5) → cần luyện')
const half = masteryOfDang([M(1, '2026-01-01'), M(0, '2026-01-02')])
ok(near(half.score, 0.5) && half.muc === 'can_luyen', '1 đúng + 1 sai → 0.5, cần luyện')

// ── ngưỡng đạt/cần-luyện/yếu ──
ok(masteryOfDang([M(1, 'a'), M(1, 'b'), M(1, 'c'), M(1, 'd'), M(0, 'e')]).muc === 'dat', '4/5 đúng = 0.8 → đạt (ngưỡng ≥0.8)')
ok(masteryOfDang([M(1, 'a'), M(1, 'b'), M(1, 'c'), M(0, 'd'), M(0, 'e')]).muc === 'can_luyen', '3/5 = 0.6 → cần luyện')
ok(masteryOfDang([M(1, 'a'), M(1, 'b'), M(0, 'c'), M(0, 'd'), M(0, 'e')]).muc === 'yeu', '2/5 = 0.4 → yếu (<0.5)')

// ── recency window: chỉ lấy 5 GẦN NHẤT ──
// 3 lần cũ SAI + 5 lần mới ĐÚNG → điểm phải = 1 (bỏ 3 cũ), chống "lỗi cũ ám mãi".
const recency = masteryOfDang([
  M(0, '2026-01-01'), M(0, '2026-01-02'), M(0, '2026-01-03'),
  M(1, '2026-02-01'), M(1, '2026-02-02'), M(1, '2026-02-03'), M(1, '2026-02-04'), M(1, '2026-02-05'),
])
ok(near(recency.score, 1) && recency.muc === 'dat', 'recency: 5 mới đúng đè 3 cũ sai → đạt')
ok(recency.n === 8, 'độ tin = TỔNG lần đo (8), không phải window (5)')

// ── trọng số theo nguồn đo (Thùy chốt: btvn/bt=1 · ingame/et/dg=2 · mt=3) ──
const w = masteryOfDang([M(0.5, 'a', 'btvn'), M(1, 'b', 'mt')])
ok(near(w.score, 0.875) && w.muc === 'dat', 'weighted: btvn(w1)+mt(w3) → 0.875 đạt (≠ flat mean 0.75 cần luyện)')
const w2 = masteryOfDang([M(1, 'a', 'ingame'), M(0, 'b', 'et'), M(1, 'c', 'dg')])
ok(near(w2.score, 2 / 3), 'ingame/et/dg cùng weight=2 → như flat mean giữa chúng')
ok(near(masteryOfDang([M(1, 'a')]).score, 1), 'không có src → fallback weight=1 (tương thích test cũ)')

// ── độ tin theo cỡ mẫu ──
ok(masteryOfDang([M(1, 'a')]).tin === 'thap', 'n=1 → tin thấp')
ok(masteryOfDang([M(1, 'a'), M(1, 'b')]).tin === 'thap', 'n=2 → tin thấp')
ok(masteryOfDang([M(1, 'a'), M(1, 'b'), M(1, 'c')]).tin === 'tb', 'n=3 → tin tb')
ok(masteryOfDang([M(1, 'a'), M(1, 'b'), M(1, 'c'), M(1, 'd'), M(1, 'e')]).tin === 'cao', 'n=5 → tin cao')

// ── RESULT_VALUE map ──
ok(RESULT_VALUE.correct === 1 && RESULT_VALUE.partial === 0.5 && RESULT_VALUE.wrong === 0, 'result → 1/.5/0')

// ── masteryOfHS ──
const hs = masteryOfHS({ '09010201': [M(1, 'a'), M(1, 'b')], '09010202': [M(0, 'a')], '09010203': [] })
ok(hs['09010201'].muc === 'dat' && hs['09010202'].muc === 'yeu' && hs['09010203'] === null, 'masteryOfHS: đạt/yếu/chưa-đo')

// ── summarizeDang (cả lớp 1 dạng) ──
const sm = summarizeDang([
  masteryOfDang([M(1, 'a'), M(1, 'b'), M(1, 'c'), M(1, 'd'), M(1, 'e')]), // đạt, tin cao
  masteryOfDang([M(0, 'a')]), // yếu, tin thấp
  masteryOfDang([M(0.5, 'a'), M(0.5, 'b'), M(0.5, 'c')]), // cần luyện, tin tb
  null, // chưa-đo
])
ok(sm.dat === 1 && sm.yeu === 1 && sm.can_luyen === 1 && sm.chua_do === 1 && sm.total === 4, 'summarizeDang đếm đúng 4 nhóm')
ok(sm.tin_thap === 1, 'summarizeDang đếm tin_thap = 1')

console.log(fail === 0 ? '\n✅ MASTERY ALL PASS' : `\n❌ ${fail} FAIL`)
process.exit(fail === 0 ? 0 : 1)
