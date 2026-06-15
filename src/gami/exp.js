// EXP ENGINE — PURE. Điểm bài + hạng buổi → EXP (6 bậc tách đỉnh gộp đáy).
import { PROBLEM_SCORE, RANK_EXP } from './config.js'

// Điểm 1 bài = 100 × kết_quả × trình_bày × tốc_độ; sai cách → 0 (khỏi nhân)
export function problemPoints({ result, presentation, speed }) {
  if (result === 'wrong') return 0
  const r = PROBLEM_SCORE.result[result]
  const p = PROBLEM_SCORE.presentation[presentation]
  const s = PROBLEM_SCORE.speed[speed]
  return Math.round(PROBLEM_SCORE.BASE * r * p * s)
}

// Hạng (1..N) → EXP. N≤6: dùng bậc đầu. N>6: hạng 1,2 riêng; 3..N rải đều 4 bậc cuối.
export function expForRank(rank, n, bands) {
  if (n <= 6) return bands[rank - 1]
  if (rank === 1) return bands[0]
  if (rank === 2) return bands[1]
  const band = Math.min(5, 2 + Math.floor((rank - 3) * 4 / (n - 2)))
  return bands[band]
}

// Xếp hạng buổi theo điểm thô GIẢM DẦN (tầng 1); hoà → Δ Elo lớn xếp trên (tầng 2).
// rows = [{studentId, rawPoints, eloDelta}] → [{studentId, rank}]
export function rankSession(rows) {
  const sorted = [...rows].sort((a, b) => b.rawPoints - a.rawPoints || (b.eloDelta ?? 0) - (a.eloDelta ?? 0))
  return sorted.map((r, i) => ({ studentId: r.studentId, rank: i + 1 }))
}
