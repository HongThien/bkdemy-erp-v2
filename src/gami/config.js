// Gami config — tunable, tách khỏi engine (spec master §4). Núm chỉnh ở đây, không sửa logic.
// Δ = clamp( w·K·(A−E)/(N−1), ±w·RANK_CAP ) + PROGRESS_P − LAMBDA·(elo − mean_lớp)
//   w=1 buổi thường · w=MT_WEIGHT cho MT (chỉ nhân phần HẠNG; P & λ luôn ×1).
export const ELO = {
  BASE_RATING: 1000,
  SCALE: 400,           // thang Elo cổ điển
  K: 30,                // độ nhạy 1 buổi (đã chuẩn hoá /(N−1) → KHÔNG cần K theo sĩ số/calibration)
  RANK_CAP: 20,         // trần phần HẠNG mỗi buổi thường (trần tổng ≈ +30 = 20 hạng + 10 P)
  PROGRESS_P: 10,       // điểm tiến-trình cộng cho MỌI HS có mặt → mean lớp dâng ~+P/buổi
  LAMBDA: 0.05,         // lực kéo về mean lớp: bó khoảng cách top–đáy, cho phép lật kèo
  MT_WEIGHT: 4,         // MT "grand slam" = ×4 phần HẠNG + trần hạng (P & λ giữ ×1) → trần ≈ +90
}

export const PROBLEM_SCORE = {
  result: { correct: 1.0, partial: 0.5, wrong: 0 },
  presentation: { clean: 1.0, ok: 0.85, sloppy: 0.7 },
  speed: { fast: 1.1, normal: 1.0, slow: 1.0 },
  BASE: 100,
}

// Hạng → EXP (6 bậc, tách đỉnh gộp đáy). Sàn = hạng bét vẫn nhận.
export const RANK_EXP = {
  ingame: [400, 380, 360, 330, 290, 250],
  et: [160, 150, 140, 130, 110, 100],
  mt: [1700, 1620, 1500, 1320, 1150, 1050],
}
// EXP "sàn" cho buổi bù/bổ trợ (đi học là có, không xếp hạng) = bậc cuối của ingame.
export const ATTEND_FLOOR_EXP = RANK_EXP.ingame[RANK_EXP.ingame.length - 1] // 250

export const XU = { EXP_PER_XU: null }      // chờ quỹ

// ── SEASON (niên khóa) — EXP/Level reset mỗi mùa; huy hiệu/thành tựu giữ vĩnh viễn ──
// Mùa = niên khóa, bắt đầu 1/7 (giờ VN), khớp chu kỳ lên lớp + khai giảng. Mã mùa = 'YYYY-YY'.
export const SEASON = { START_MONTH: 7, START_DAY: 1 }

// ── LEVEL — hàm thuần của EXP-TÍCH-LUỸ-TRONG-MÙA (per-môn). 21 mốc. ──
// ⚠ Ngưỡng PROVISIONAL (§1.5: không đánh số bừa) — calibrate sau 1 mùa có data thật.
// Chi phí lên mỗi level tăng tuyến tính: stepCost(L) = BASE_COST × (1 + (L-1)×GROWTH).
export const LEVEL = {
  MAX: 21,
  BASE_COST: 600,        // EXP để lên từ level 1 → 2
  GROWTH: 0.15,          // mỗi level kế đắt thêm 15% so với level đầu
  AVATAR_TIERS: 7,       // 21 level gộp thành 7 bậc tiến hóa avatar (mỗi bậc 3 level)
  EXP_MAX_MONTH: null,   // (tùy chọn) cap EXP/tháng tính vào level — chờ data, mặc định tắt
}
