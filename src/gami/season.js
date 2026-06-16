// SEASON ENGINE — PURE. Mùa = niên khóa (bắt đầu SEASON.START ngày/tháng, giờ VN).
// EXP/Level reset mỗi mùa = WINDOWING theo created_at (KHÔNG xoá data — §4 immutable append).
import { SEASON } from './config.js'

// 'YYYY-MM-DD' (giờ VN) → mã mùa 'YYYY-YY' (niên khóa chứa ngày đó).
// Vd START=1/7: 2026-06-30 → '2025-26'; 2026-07-01 → '2026-27'.
export function seasonOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const after = m > SEASON.START_MONTH || (m === SEASON.START_MONTH && d >= SEASON.START_DAY)
  const startY = after ? y : y - 1
  return `${startY}-${String((startY + 1) % 100).padStart(2, '0')}`
}

export function seasonLabel(code) {
  return `Mùa ${code}`
}

// Mốc đầu/cuối mùa → INSTANT UTC ISO (so với created_at timestamptz). VN = UTC+7 → giờ -7.
// Dùng Date.UTC để ra instant chính xác (KHÔNG phải format ngày-local nên không vướng cấm §2).
function startYearOf(code) { return Number(code.split('-')[0]) }
export function seasonStartUtc(code) {
  return new Date(Date.UTC(startYearOf(code), SEASON.START_MONTH - 1, SEASON.START_DAY, -7, 0, 0)).toISOString()
}
export function seasonEndUtc(code) {
  return new Date(Date.UTC(startYearOf(code) + 1, SEASON.START_MONTH - 1, SEASON.START_DAY, -7, 0, 0)).toISOString()
}
