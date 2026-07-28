// ELO ENGINE — PURE (không gọi DB). Cờ vua đa người: 1 buổi = đấu cả lớp cùng lúc.
// E_i = Σ_(j≠i) 1/(1+10^((Rj−Ri)/400)); actual_i = #(điểm_i>điểm_j)+0.5×#(hoà)
// Δ_i = clamp( w·K·(A−E)/(N−1), ±w·RANK_CAP ) + P − λ·(elo_i − mean_lớp)
//   • phần HẠNG chuẩn-hoá /(N−1) → biên độ tự nhiên, không thiên vị sĩ số
//   • P = tiến-trình (mọi HS có mặt cùng dâng → bảng cao dần, KHÔNG đổi thứ hạng)
//   • λ = kéo về mean lớp (bó khoảng cách, cho phép lật kèo)
//   • MT: w=MT_WEIGHT — chỉ nhân phần HẠNG + trần hạng; P & λ giữ ×1
import { ELO } from './config.js'

// Kỳ vọng số bạn vượt (R = elo đầu event)
export function expectedScore(ratingI, otherRatings) {
  let e = 0
  for (const rj of otherRatings) e += 1 / (1 + Math.pow(10, (rj - ratingI) / ELO.SCALE))
  return e
}

// Thực tế số bạn vượt theo điểm buổi (hoà = 0.5)
export function actualScore(pointsI, otherPoints) {
  let a = 0
  for (const pj of otherPoints) { if (pointsI > pj) a += 1; else if (pointsI === pj) a += 0.5 }
  return a
}

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x))

// Tính cả event cho cả lớp. students = [{studentId, elo, points}]
//   elo = mốc TRƯỚC event · mean_lớp lấy TỪ chính mảng này (các HS có mặt)
// → [{studentId, eloBefore, expected, actual, delta, eloAfter}]
export function computeEloUpdate(students, { isMT = false, classSize } = {}) {
  const n = classSize ?? students.length
  const denom = Math.max(1, n - 1)
  const w = isMT ? ELO.MT_WEIGHT : 1
  const cap = ELO.RANK_CAP * w
  const mean = students.reduce((s, o) => s + o.elo, 0) / students.length
  return students.map((s) => {
    const others = students.filter((o) => o !== s)
    const expected = expectedScore(s.elo, others.map((o) => o.elo))
    const actual = actualScore(s.points, others.map((o) => o.points))
    const rank = clamp((w * ELO.K * (actual - expected)) / denom, -cap, cap)
    const revert = -ELO.LAMBDA * (s.elo - mean)
    const delta = Math.round(rank + ELO.PROGRESS_P + revert)
    return { studentId: s.studentId, eloBefore: s.elo, expected, actual, delta, eloAfter: s.elo + delta }
  })
}
