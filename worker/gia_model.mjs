// BẢNG GIÁ MODEL dùng chung cho MỌI worker gọi Claude API — tách ra để KHÔNG lệch (trước đây mỗi worker
// tự chép 1 bảng, sửa giá 1 nơi mà quên nơi kia là số liệu tiền sai thầm lặng).
// USD / 1 triệu token. Cập nhật khi Anthropic đổi giá — sửa Ở ĐÂY, mọi worker tự ăn theo.
export const GIA = {
  'claude-opus-4-8': { vao: 5, ra: 25 },
  'claude-opus-4-7': { vao: 5, ra: 25 },
  'claude-sonnet-5': { vao: 2, ra: 10 },
  'claude-sonnet-4-6': { vao: 3, ra: 15 },
  'claude-haiku-4-5': { vao: 1, ra: 5 },
}
// Haiku 4.5 KHÔNG hỗ trợ adaptive thinking (API trả 400 "adaptive thinking is not supported on this model").
export const CO_ADAPTIVE = new Set(['claude-opus-4-8', 'claude-opus-4-7', 'claude-sonnet-5', 'claude-sonnet-4-6', 'claude-fable-5'])
export const USD_VND = 26_000
