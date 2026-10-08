// BẢNG GIÁ MODEL dùng chung cho MỌI worker gọi Claude API — tách ra để KHÔNG lệch (trước đây mỗi worker
// tự chép 1 bảng, sửa giá 1 nơi mà quên nơi kia là số liệu tiền sai thầm lặng).
// USD / 1 triệu token. Cập nhật khi Anthropic đổi giá — sửa Ở ĐÂY, mọi worker tự ăn theo.
// `tren: { nguong, vao, ra }` = model tính giá THEO ĐỘ DÀI PROMPT: prompt vượt `nguong` token vào
// thì CẢ lượt tính giá `tren`. Luôn tra giá qua `giaCho()` — đọc thẳng GIA[m] là bỏ sót bậc này.
export const GIA = {
  'claude-opus-4-8': { vao: 5, ra: 25 },
  'claude-opus-4-7': { vao: 5, ra: 25 },
  'claude-sonnet-5': { vao: 2, ra: 10 },
  'claude-sonnet-4-6': { vao: 3, ra: 15 },
  // Haiku 5.5 (ra 07/10/2026): rẻ hơn Haiku 4.5 10 lần ở prompt ≤100K; >100K đắt gấp 5 bậc dưới.
  // Nguồn: platform.claude.com/docs/en/about-claude/pricing (tra 08/10/2026).
  'claude-haiku-5-5': { vao: 0.1, ra: 0.5, tren: { nguong: 100_000, vao: 0.5, ra: 2.5 } },
  'claude-haiku-4-5': { vao: 1, ra: 5 },
}
// Giá áp cho 1 lượt có `tokVao` token vào (null nếu model chưa có trong bảng).
export function giaCho(model, tokVao) {
  const g = GIA[model]
  if (!g) return null
  return g.tren && tokVao > g.tren.nguong ? g.tren : g
}
// Haiku 4.5 KHÔNG hỗ trợ adaptive thinking (API trả 400 "adaptive thinking is not supported on this model").
// Haiku 5.5 thì CÓ (Models API: thinking.adaptive + effort low→max) — nên nằm trong set.
export const CO_ADAPTIVE = new Set(['claude-opus-4-8', 'claude-opus-4-7', 'claude-sonnet-5', 'claude-sonnet-4-6', 'claude-fable-5', 'claude-haiku-5-5'])
export const USD_VND = 26_000
