// Gami config — tunable, tách khỏi engine (spec master §4). Núm chỉnh ở đây, không sửa logic.
export const ELO = {
  BASE_RATING: 1000,
  SCALE: 400,
  K_CALIBRATION: 32,        // 4 buổi đầu mỗi HS (hạ từ 48 → mượt hơn, đỡ chạm trần)
  CALIBRATION_SESSIONS: 4,
  K_NORMAL: 24,
  K_MT: 60,                 // Grand Slam
  K_SMALL_CLASS: 18,        // lớp ≤ 8
  SMALL_CLASS_SIZE: 8,
  DELTA_CAP: 40,            // giới hạn Δ mỗi event (hạ từ 60)
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
export const LEVEL = { MAX_POINTS: 21, EXP_MAX_MONTH: null } // GĐ C, chờ data
