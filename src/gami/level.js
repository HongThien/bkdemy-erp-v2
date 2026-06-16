// LEVEL ENGINE — PURE. EXP-tích-luỹ-trong-mùa (per-môn) → level + tiến trình + bậc avatar.
// Reset mỗi mùa vì input = EXP của mùa (windowing ở tầng service). KHÔNG lưu level.
import { LEVEL } from './config.js'

// EXP để lên từ level L sang L+1 (L: 1..MAX-1). Tăng tuyến tính.
export function stepCost(L) {
  return Math.round(LEVEL.BASE_COST * (1 + (L - 1) * LEVEL.GROWTH))
}

// EXP tích luỹ tối thiểu để ĐẠT level L (L=1 → 0).
export function cumExpFor(L) {
  let s = 0
  for (let i = 1; i < L; i++) s += stepCost(i)
  return s
}

// EXP mùa → trạng thái level: { level, into (đã vào level này bao nhiêu EXP), span (EXP cả level),
// toNext (còn thiếu để lên), pct (0..1 tiến trình trong level), isMax }.
export function expToLevel(seasonExp) {
  const e = Math.max(0, Math.floor(seasonExp || 0))
  let level = 1
  while (level < LEVEL.MAX && e >= cumExpFor(level + 1)) level++
  const base = cumExpFor(level)
  if (level >= LEVEL.MAX) return { level: LEVEL.MAX, into: e - base, span: 0, toNext: 0, pct: 1, isMax: true }
  const next = cumExpFor(level + 1)
  const span = next - base
  return { level, into: e - base, span, toNext: next - e, pct: span ? (e - base) / span : 0, isMax: false }
}

// Level → bậc tiến hóa avatar (1..AVATAR_TIERS), mỗi bậc gộp đều các level.
export function avatarTier(level) {
  const per = Math.ceil(LEVEL.MAX / LEVEL.AVATAR_TIERS)
  return Math.max(1, Math.min(LEVEL.AVATAR_TIERS, Math.ceil(level / per)))
}

// ⚠ PLACEHOLDER — nhân vật ảo tạm bằng emoji tiến hóa theo bậc. Thay bằng art thật sau (GĐ shop).
const STAGES = [
  { emoji: '🥚', ten: 'Trứng' },
  { emoji: '🐣', ten: 'Mới nở' },
  { emoji: '🐥', ten: 'Non' },
  { emoji: '🦊', ten: 'Trưởng thành' },
  { emoji: '🐯', ten: 'Mạnh' },
  { emoji: '🦁', ten: 'Tinh anh' },
  { emoji: '🐲', ten: 'Huyền thoại' },
]
export function avatarStage(level) {
  return STAGES[avatarTier(level) - 1] ?? STAGES[0]
}
