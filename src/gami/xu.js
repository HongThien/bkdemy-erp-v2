// XU ENGINE — PURE. Quy EXP tháng → xu theo BẢNG MỐC (luong_bac: min_exp → xu, CEO chỉnh trên ERP,
// KHÔNG hardcode). Quy TỪNG MÔN rồi cộng ví (Thùy chốt 08-29). Giữa 2 mốc lấy MỐC DƯỚI (mốc cao nhất
// đã đạt — cùng ngữ nghĩa màn Thành tích vẫn dùng); dưới mốc thấp nhất = 0; trên mốc cuối = mốc cuối
// (trần là chủ đích — CEO muốn thêm thì thêm mốc).
export function xuForExp(exp, bacs) {
  let xu = 0
  for (const b of [...bacs].sort((a, b) => a.min_exp - b.min_exp)) if (exp >= b.min_exp) xu = b.xu
  return xu
}
