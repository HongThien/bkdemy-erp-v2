// REPLAY ELO — PURE (không DB). Nguồn chân lý DUY NHẤT cho "Elo là hàm của lịch sử".
// Mức 2 (pure-derive): mọi nơi cần Elo (đóng buổi live · recalc · test) đều gọi hàm NÀY,
// KHÔNG chép lại công thức (bài học 07-30: recalc chép-lại → mid-loop-mutation bug lệch ≤1).
// Công thức thật ở computeEloUpdate (elo.js). Đây chỉ lo CHUỖI theo thời gian + snapshot.
import { computeEloUpdate } from './elo.js'

// events: ĐÃ SẮP theo thời gian (ngày ↑, rồi buổi). Mỗi event:
//   { buoiHocId, mon, isMT?, students: [{ studentId, points }], rankTotal? }
// opts.seed: Map<'hs|mon', elo> mốc đầu mùa (soft-reset). Không có → BASE (1000) từ config.
// Trả: { history: [{ studentId, buoiHocId, mon, eloBefore, expected, actual, delta, eloAfter }],
//        finalElo: Map<'hs|mon', elo> }  — history theo đúng thứ tự replay.
export function replayEloEvents(events, { seed } = {}) {
  const elo = new Map() // key = hs|mon — trạng thái CỘNG DỒN qua các buổi
  const keyOf = (studentId, mon) => studentId + '|' + mon
  const get = (studentId, mon) => {
    const k = keyOf(studentId, mon)
    if (elo.has(k)) return elo.get(k)   // đã có buổi trước trong lượt replay này
    return seed?.get(k)                 // mốc đầu mùa (soft-reset), hoặc undefined → BASE ở call site
  }
  const history = []
  for (const ev of events) {
    const N = ev.students.length
    if (N < 2) continue // 1 HS không có "đấu" → không đo (khớp recalc/live)
    // mốc TRƯỚC buổi = elo cộng-dồn tới lúc này; chưa có → seed → 1000
    const students = ev.students.map((s) => ({
      studentId: s.studentId,
      elo: get(s.studentId, ev.mon) ?? 1000,
      points: s.points,
    }))
    const updates = computeEloUpdate(students, { isMT: !!ev.isMT, classSize: N })
    for (const u of updates) {
      history.push({
        studentId: u.studentId, buoiHocId: ev.buoiHocId, mon: ev.mon,
        eloBefore: u.eloBefore, expected: u.expected, actual: u.actual, delta: u.delta, eloAfter: u.eloAfter,
      })
      elo.set(keyOf(u.studentId, ev.mon), u.eloAfter)
    }
  }
  return { history, finalElo: elo }
}
