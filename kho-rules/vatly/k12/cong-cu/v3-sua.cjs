// Gộp 8 câu lẻ lô 3 vào mô tả dạng gần nhất + làm rõ ranh giới (cây v3 không thêm dạng)
const fs = require("fs"), p = __dirname + "/cay-v3.md"; let s = fs.readFileSync(p, "utf8");
const them = {
  "N2.2.3": "; chu trình: công bằng diện tích trên đồ thị p–V; tủ lạnh/máy lạnh (hệ số làm lạnh)",
  "N4.2.1": "; đổi calo – J, phần năng lượng chuyển thành nhiệt",
  "K2.1.5": "; tìm nhiệt độ cực đại khi đồ thị p–V là đoạn thẳng",
  "K3.1.1": "; kể cả câu chỉ chọn biểu thức pV/T = hằng số",
  "K3.2.1": "; hai ngăn ngăn bằng pittông, hệ nhiều pittông nối thanh (cân bằng lực + định luật khí)",
  "K4.2.2": "; câu hỏi đơn vị, giá trị hằng số Boltzmann k",
  "H2.1.1": "; đơn vị khối lượng nguyên tử u",
  "H3.2.2": "; phản ứng dây chuyền với hệ số nhân k qua nhiều thế hệ",
  "H4.2.1": "; đếm số hạt phóng xạ phát ra theo thời gian để tìm T",
  "H4.2.2": "; đề cho độ phóng xạ giảm còn x% ⇒ dạng này (không phải H4.2.1)",
  "T3.1.1": "; từ thông lớn nhất/nhỏ nhất theo góc (không thay số)",
};
for (const [ma, add] of Object.entries(them)) {
  const re = new RegExp("^(- " + ma.replace(/\./g, "\\.") + " .*)$", "m");
  if (!re.test(s)) throw new Error("khong thay " + ma);
  s = s.replace(re, (m) => m + add);
}
s = s.replace("- O — câu đề hỏi kiến thức Lý 10/11 hoặc chủ đề khác (sóng âm, tia X, an toàn điện, áp suất thuỷ tĩnh…)",
  "- O — câu đề hỏi kiến thức Lý 10/11 hoặc chủ đề khác (sóng âm, sóng cơ, tia X, an toàn điện, áp suất thuỷ tĩnh, định luật Wien…)");
fs.writeFileSync(p, s); console.log("ok", Object.keys(them).length);
