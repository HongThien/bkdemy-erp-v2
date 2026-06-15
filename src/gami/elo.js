// ELO ENGINE — PURE (không gọi DB). Cờ vua đa người: 1 buổi = đấu cả lớp cùng lúc.
// E_i = Σ_(j≠i) 1/(1+10^((Rj−Ri)/400)); actual_i = #(điểm_i>điểm_j)+0.5×#(hoà); Δ=clamp(K(actual−E),±60)
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

// Chọn K: MT > calibration(<4 buổi) > lớp nhỏ(≤8) > thường
export function getK({ sessionsPlayed, isMT, classSize }) {
  if (isMT) return ELO.K_MT
  if (sessionsPlayed < ELO.CALIBRATION_SESSIONS) return ELO.K_CALIBRATION
  if (classSize <= ELO.SMALL_CLASS_SIZE) return ELO.K_SMALL_CLASS
  return ELO.K_NORMAL
}

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x))

// Tính cả event cho cả lớp. students = [{studentId, elo, points, sessionsPlayed}]
// → [{studentId, eloBefore, expected, actual, delta, eloAfter}]
export function computeEloUpdate(students, { isMT = false, classSize } = {}) {
  const n = classSize ?? students.length
  return students.map((s) => {
    const others = students.filter((o) => o !== s)
    const expected = expectedScore(s.elo, others.map((o) => o.elo))
    const actual = actualScore(s.points, others.map((o) => o.points))
    const k = getK({ sessionsPlayed: s.sessionsPlayed ?? 0, isMT, classSize: n })
    const delta = Math.round(clamp(k * (actual - expected), -ELO.DELTA_CAP, ELO.DELTA_CAP))
    return { studentId: s.studentId, eloBefore: s.elo, expected, actual, delta, eloAfter: s.elo + delta }
  })
}
