// MASTERY ENGINE — PURE. Suy động (HS × dạng/KP) từ CÁC LẦN ĐO → mức thành thạo + độ tin.
// KHÔNG lưu — tính lại mỗi lần từ measurements (đúng CLAUDE.md §1: mastery suy động, §5: kèm độ tin).
// Nguồn đo: gami_grades (phase et/ingame, result→{1/.5/0}) + buoi_danh_gia_dang (diem {0/.5/1}).
// ⚠ LOẠI phase='btvn' (tham khảo, KHÔNG vào mastery) — lọc ở tầng service trước khi đưa vào đây.
// test: node scripts/verify_mastery.mjs

// ⭐ CÔNG THỨC (Thùy chốt): mỗi lần đánh giá Đ=1 · C(chưa đạt)=0.5 · S=0.
// Tổng 5 lần gần nhất (max 5đ): ≥4 → Đ(đạt) · 2.5–3.5 → C(cần luyện) · <2.5 → S(yếu).
// = ngưỡng trên score TRUNG BÌNH (sum/n): ≥0.8 đạt · 0.5–0.8 cần luyện · <0.5 yếu.
// Dùng mean (không tổng tuyệt đối) để <5 lần đo vẫn xếp mức được (kèm cờ độ tin thấp).
// ⭐ TRỌNG SỐ THEO NGUỒN (Thùy chốt 07-10): các nguồn KHÔNG đáng tin như nhau — MT (test chuẩn nhất)
// > IG/ET/ĐG (trực tiếp tại trung tâm, có giám sát) > BTVN/BT (tự luyện, không giám sát). Vẫn chọn
// 5 lần GẦN NHẤT theo thời gian y hệt cũ (KHÔNG chọn theo trọng số) — chỉ đổi cách TÍNH ĐIỂM của 5
// lần đó từ trung bình phẳng sang trung bình có trọng số. Độ tin (tin) GIỮ NGUYÊN đo bằng số lượng
// lần đo — không lẫn với trọng số nguồn (đây là 2 trục khác nhau: độ PHỦ vs độ TIN CẬY nguồn).
export const MASTERY_CONFIG = {
  WINDOW: 5, // điểm = TB N lần đo GẦN NHẤT (chống 1 buổi lỗi ám mãi; dạng lặp lại tự lấp)
  DAT: 0.8, // score ≥ 0.8 (tổng ≥4/5) → đạt
  CAN_LUYEN: 0.5, // 0.5 ≤ score < 0.8 (tổng 2.5–3.5) → cần luyện · < 0.5 (tổng <2.5) → yếu
  TIN_CAO: 5, // n ≥ 5 lần đo → tin cao
  TIN_TB: 3, // 3–4 → tin trung bình · ≤ 2 → tin thấp (§5: thiếu data = ĐỘ TIN thấp, KHÁC mastery thấp)
  WEIGHT: { ingame: 2, et: 2, dg: 2, mt: 3, btvn: 1, bt: 1 }, // nguồn không có trong bảng (hoặc thiếu src) → weight 1
}

// grade.result / đánh-giá → giá trị đo 0..1.
export const RESULT_VALUE = { correct: 1, partial: 0.5, wrong: 0 }

function toMs(t) { return t instanceof Date ? t.getTime() : typeof t === 'number' ? t : Date.parse(t) }

// Mastery của 1 DẠNG từ mảng lần đo [{ value:0|0.5|1, t:Date|ms|ISO }].
// Trả { score, n, muc:'dat'|'can_luyen'|'yeu', tin:'cao'|'tb'|'thap' } — hoặc null nếu KHÔNG có lần đo (=chưa-đo).
export function masteryOfDang(measures, cfg = MASTERY_CONFIG) {
  if (!measures || measures.length === 0) return null // chưa-đo: KHÔNG suy ra 0 (§5: đừng gộp chưa-đo vào yếu)
  const recent = [...measures].sort((a, b) => toMs(b.t) - toMs(a.t)).slice(0, cfg.WINDOW) // mới → cũ, lấy WINDOW đầu (theo THỜI GIAN, không theo trọng số)
  let wsum = 0, wtot = 0
  for (const m of recent) { const w = cfg.WEIGHT?.[m.src] ?? 1; wsum += m.value * w; wtot += w }
  const score = wsum / wtot
  const n = measures.length // cỡ mẫu TỔNG = độ tin (khác số lần dùng tính điểm = ≤WINDOW)
  const muc = score >= cfg.DAT ? 'dat' : score >= cfg.CAN_LUYEN ? 'can_luyen' : 'yeu'
  const tin = n >= cfg.TIN_CAO ? 'cao' : n >= cfg.TIN_TB ? 'tb' : 'thap'
  return { score, n, muc, tin }
}

// Mastery của 1 HS trên NHIỀU dạng. measuresByDang = { [ma_dang]: [lần đo…] }.
// Trả { [ma_dang]: masteryOfDang | null }.
export function masteryOfHS(measuresByDang, cfg = MASTERY_CONFIG) {
  const out = {}
  for (const ma of Object.keys(measuresByDang)) out[ma] = masteryOfDang(measuresByDang[ma], cfg)
  return out
}

// Tổng hợp 1 DẠNG trên cả LỚP: đếm theo mức (chưa-đo tách riêng) → "dạng nào cả lớp yếu".
// cells = mảng (masteryOfDang | null) mỗi HS. Trả { dat, can_luyen, yeu, chua_do, total, tin_thap }.
export function summarizeDang(cells) {
  const s = { dat: 0, can_luyen: 0, yeu: 0, chua_do: 0, total: cells.length, tin_thap: 0 }
  for (const c of cells) {
    if (!c) { s.chua_do++; continue }
    s[c.muc]++
    if (c.tin === 'thap') s.tin_thap++
  }
  return s
}
