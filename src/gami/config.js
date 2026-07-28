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

// ── EXP REDESIGN (07-28, Thùy chốt) — EXP = CHĂM CHỈ, không phải giỏi. Nguồn: ET · MT · BTVN ──
// Tính THEO THÁNG (cutoff cuối tháng → tháng sau reset phần so-lớp). Núm chỉnh ở đây.
export const EXP = {
  // ET: hạng buổi → EXP [200..300] chia 6 bậc (tách đỉnh gộp đáy, giống RANK_EXP).
  ET_BANDS: [300, 285, 270, 250, 225, 200],   // rank 1 … bét

  // ── BTVN (mỗi "bài" = BTVN 1 buổi). Base cho nộp-đúng-hạn + nghiêm-túc ──
  BTVN_BASE: 300,
  // hệ số thời điểm nộp (nhân vào base của bài). Nộp muộn = −10% (Thùy chốt 07-28).
  // xin_phep = KHÔNG LÀM = 0 (Thùy: không có lý do xin phép không làm BTVN) → timing 0 ⇒ tính là "miss".
  BTVN_TIMING: { nop_dung_han: 1.0, nop_muon: 0.9, xin_phep: 0, khong_lam: 0 },
  // PHẠT THÁI ĐỘ = THEO BÀI (Thùy chốt) — hệ số nhân vào base của chính bài đó.
  // "Thiếu nghiêm túc" = −30% EXP buổi đó; "chống đối" = 0 EXP buổi đó (Thùy chốt 07-28).
  BTVN_ATTITUDE: { nghiem_tuc: 1.0, chua_het_suc: 0.9, chua_nghiem_tuc: 0.7, chong_doi: 0 },
  // ── cộng/trừ THEO THÁNG, tính trên SUBTOTAL BTVN của tháng ──
  BTVN_FULL_MONTH_BONUS: 0.05,   // +5% nếu KHÔNG có buổi "không làm" nào trong tháng
  BTVN_CLASS_HI_BONUS:   0.05,   // +5% nếu điểm BTVN TB vượt TB lớp > +5%
  BTVN_CLASS_HI_MARGIN:  0.05,
  BTVN_CLASS_LO_PENALTY: 0.05,   // −5% nếu điểm BTVN TB kém TB lớp > −10%
  BTVN_CLASS_LO_MARGIN:  0.10,
  BTVN_MISS_PENALTY:     0.05,   // −5% subtotal MỖI bài "không làm" (Thùy: không nộp phạt THEO TỔNG)

  // ── MT: theo ĐIỂM (diem_thi thang-10). Top lớp = MT_TOP, tụt 0.25đ = −MT_PER_025. Sàn = 0 (Thùy chốt) ──
  MT_TOP: 1000,
  MT_PER_025: 50,
  MT_FLOOR: 0,
}

// ── SEASON (niên khóa) — EXP/Level reset mỗi mùa; huy hiệu/thành tựu giữ vĩnh viễn ──
// Mùa = niên khóa, bắt đầu 1/7 (giờ VN), khớp chu kỳ lên lớp + khai giảng. Mã mùa = 'YYYY-YY'.
export const SEASON = { START_MONTH: 7, START_DAY: 1 }

// ── LEVEL — hàm thuần của EXP-TÍCH-LUỸ-TRONG-MÙA (per-môn). 21 mốc. ──
// Calibrate 07-28 với data THẬT (9A1/T7 model EXP mới): TB ~4900 EXP/HS/tháng → mùa ~9 tháng
// ≈ 44k (TB) / ~54k (top). Đặt cumExp(L21) ≈ 53k để top chạm trần cuối mùa, cả lớp trải L3–L5
// sau tháng đầu (thay vì dồn L4–L7 với thang cũ BASE_COST=600 → vỡ ngưỡng). Núm nhanh/chậm = BASE_COST.
// Chi phí lên mỗi level tăng tuyến tính: stepCost(L) = BASE_COST × (1 + (L-1)×GROWTH).
export const LEVEL = {
  MAX: 21,
  BASE_COST: 1100,       // EXP để lên từ level 1 → 2  (cũ 600 — nâng cho khớp thang EXP mới)
  GROWTH: 0.15,          // mỗi level kế đắt thêm 15% so với level đầu
  AVATAR_TIERS: 7,       // 21 level gộp thành 7 bậc tiến hóa avatar (mỗi bậc 3 level)
  EXP_MAX_MONTH: null,   // (tùy chọn) cap EXP/tháng tính vào level — chờ data, mặc định tắt
}
