// EXP ENGINE — PURE. Điểm bài + hạng buổi → EXP (6 bậc tách đỉnh gộp đáy).
import { PROBLEM_SCORE, RANK_EXP, EXP } from './config.js'

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

// ════════════════════════════════════════════════════════════════════════════
// EXP REDESIGN (07-28) — EXP = CHĂM CHỈ. Nguồn: ET · MT · BTVN. Tính THEO THÁNG.
// Tất cả hàm THUẦN (không DB); service gom sự-kiện-tháng rồi gọi. Núm ở config.EXP.
// ════════════════════════════════════════════════════════════════════════════

// ET: hạng buổi (1..n) → EXP trong [200..300]. Dùng lại logic chia bậc của expForRank.
export function etRankExp(rank, n) {
  return expForRank(rank, n, EXP.ET_BANDS)
}

// BTVN 1 bài (1 buổi) → EXP: base × hệ-số-thời-điểm × hệ-số-thái-độ.
//   trangThai ∈ nop_dung_han|nop_muon|xin_phep|khong_lam ; thaiDo ∈ nghiem_tuc|chua_het_suc|chua_nghiem_tuc|chong_doi|null
export function btvnBaiExp(trangThai, thaiDo) {
  const timing = EXP.BTVN_TIMING[trangThai] ?? 0
  if (timing === 0) return 0                                   // không làm / trạng thái lạ → 0
  const att = EXP.BTVN_ATTITUDE[thaiDo] ?? 1.0                 // thiếu thái độ → coi nghiêm túc
  return Math.round(EXP.BTVN_BASE * timing * att)
}

// BTVN cả THÁNG cho 1 HS. bais = [{trangThai, thaiDo}] (mỗi buổi có BTVN 1 phần tử).
//   studentAcc = độ-đúng-TB BTVN của HS trong tháng (0..1) ; classMeanAcc = TB lớp (0..1).
// → { subtotal, fullMonth, classHi, classLo, missPenalty, total, missCount } (đã làm tròn).
export function monthlyBtvnExp(bais, studentAcc, classMeanAcc) {
  const subtotal = bais.reduce((s, b) => s + btvnBaiExp(b.trangThai, b.thaiDo), 0)
  const missCount = bais.filter((b) => (EXP.BTVN_TIMING[b.trangThai] ?? 0) === 0).length

  // +5% nếu KHÔNG có buổi "không làm" nào (chăm đủ tháng)
  const fullMonth = missCount === 0 ? Math.round(subtotal * EXP.BTVN_FULL_MONTH_BONUS) : 0

  // so điểm BTVN với TB lớp (chỉ khi có dữ liệu độ-đúng)
  let classHi = 0, classLo = 0
  if (studentAcc != null && classMeanAcc != null) {
    const diff = studentAcc - classMeanAcc
    if (diff > EXP.BTVN_CLASS_HI_MARGIN) classHi = Math.round(subtotal * EXP.BTVN_CLASS_HI_BONUS)
    else if (diff < -EXP.BTVN_CLASS_LO_MARGIN) classLo = -Math.round(subtotal * EXP.BTVN_CLASS_LO_PENALTY)
  }

  // −5% subtotal MỖI bài không làm (phạt THEO TỔNG, ngoài việc bài đó đã = 0)
  const missPenalty = -Math.round(subtotal * EXP.BTVN_MISS_PENALTY * missCount)

  const total = Math.max(0, subtotal + fullMonth + classHi + classLo + missPenalty)
  return { subtotal, fullMonth, classHi, classLo, missPenalty, missCount, total }
}

// MT 1 kỳ → EXP theo điểm (thang-10). topDiem = điểm cao nhất lớp kỳ đó. Sàn = MT_FLOOR.
export function mtExp(diem, topDiem) {
  const steps = (topDiem - diem) / 0.25
  return Math.max(EXP.MT_FLOOR, Math.round(EXP.MT_TOP - steps * EXP.MT_PER_025))
}
